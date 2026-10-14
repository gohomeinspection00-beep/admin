package my.goxpert.pocket

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import android.opengl.Matrix
import android.os.Build
import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.graphics.drawable.GradientDrawable
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import com.google.ar.core.Anchor
import com.google.ar.core.Config
import com.google.ar.core.Frame
import com.google.ar.core.HitResult
import com.google.ar.core.Plane
import com.google.ar.core.Session
import com.google.ar.core.TrackingFailureReason
import com.google.ar.core.TrackingState
import com.google.ar.core.exceptions.CameraNotAvailableException
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10
import kotlin.math.sqrt

/**
 * AR dalam app, kerana WebXR tidak boleh berada di sini.
 *
 * Chrome mengkompil WebXR ke dalam dirinya; WebView tidak menghantarnya dan
 * tiada jambatan JavaScript boleh menampung satu tindanan penjejakan. ARCore
 * pula ialah pustaka Android biasa, jadi app ini menjalankan AR sendiri dan
 * menghantar kembali perkara yang Pocket sebenarnya perlukan: senarai titik
 * 3D. Setiap jarak, luas, label, senarai dan storan sudah wujud dalam
 * JavaScript dan tidak berubah langsung.
 *
 * Hanya latar kamera dilukis dalam OpenGL, kerana ARCore hanya menyerahkannya
 * sebagai tekstur. Titik dan garis diunjurkan ke koordinat skrin dan dilukis
 * oleh View biasa di atasnya — satu perender 3D penuh tidak akan menunjukkan
 * apa-apa yang lebih berguna kepada surveyor.
 */
class ArMeasureActivity : Activity() {

    private var session: Session? = null
    private lateinit var gl: GLSurfaceView
    private lateinit var overlay: Overlay
    private lateinit var readout: TextView
    private lateinit var hint: TextView
    private lateinit var undoBtn: ImageButton
    private lateinit var doneBtn: ImageButton
    private lateinit var placeBtn: ImageButton

    private val bg = ArBackground()

    /**
     * Titik yang diletak, sebagai Anchor.
     *
     * Bukan koordinat mentah. ARCore memperbaik anggarannya tentang dunia
     * sepanjang masa: bila lebih banyak permukaan dikesan, ia membetulkan
     * di mana ia fikir segala-galanya berada. Satu titik yang disimpan
     * sebagai (x,y,z) pada satu bingkai berada di tempat yang salah pada
     * bingkai berikutnya — ia hanyut bila surveyor maju, dan kelihatan
     * betul semula bila dia berundur ke tempat asal, kerana anggaran itu
     * menumpu semula di sana. Anchor ialah jawapan ARCore sendiri: ia
     * dilekatkan pada permukaan sebenar dan posenya dikemas kini setiap
     * bingkai, jadi ia kekal di mana ia diletak.
     *
     * Disentuh hanya pada benang GL; benang UI membaca segsNow.
     */
    private val groups = ArrayList<ArrayList<Anchor>>()

    /**
     * Gambaran pose semasa, satu senarai bagi setiap ukuran, diterbitkan
     * untuk benang UI setiap bingkai.
     *
     * Dahulu ini satu rantai tunggal, jadi titik ketiga menyambung kepada
     * yang kedua dan bacaannya menjadi jumlah semua segmen. Itu betul untuk
     * satu laluan, tetapi salah untuk perkara yang surveyor sebenarnya buat:
     * tiga ukuran di tiga tempat berbeza dalam bilik yang sama, tidak
     * bersambung antara satu sama lain. Dalam mod jarak, setiap dua titik
     * menutup satu ukuran dan titik seterusnya memulakan yang baharu.
     */
    @Volatile private var segsNow: List<List<FloatArray>> = emptyList()

    /** Berapa titik satu ukuran boleh pegang; 0 bermakna tiada had. */
    private fun capacity(): Int = if (kind == "dist") 2 else 0

    /** Semua titik dalam satu senarai rata, untuk kerja yang tidak peduli
     *  tentang pengumpulan. */
    private fun flat(): List<FloatArray> = segsNow.flatten()

    /** Indeks ukuran yang sedang dibina, atau -1 bila yang terakhir sudah
     *  penuh dan titik seterusnya akan memulakan yang baharu. */
    private fun openIndex(l: List<List<FloatArray>> = segsNow): Int {
        if (l.isEmpty()) return -1
        val cap = capacity()
        return if (cap > 0 && l[l.size - 1].size >= cap) -1 else l.size - 1
    }

    private fun openSeg(): List<FloatArray> {
        val l = segsNow
        val i = openIndex(l)
        return if (i < 0) emptyList() else l[i]
    }

    /**
     * HitResult hanya sah sehingga update() berikutnya, jadi anchor mesti
     * dibuat pada benang GL dalam bingkai yang sama dengan hit itu. Butang
     * menaikkan bendera; bingkai seterusnya melakukannya.
     */
    @Volatile private var wantPlace = false
    @Volatile private var wantUndo = false
    @Volatile private var why = ""

    /**
     * Apa yang ARCore sedang nampak, dilukis supaya surveyor tahu sama ada
     * ia sedang bekerja.
     *
     * Tanpa ini, satu-satunya maklum balas ialah reticle, yang hanya bertukar
     * bila tengah skrin kebetulan mengenai satah. "Tiada satah dijumpai" dan
     * "satah dijumpai tetapi awak tidak menghalakannya" kelihatan sama, dan
     * tiada apa yang memberitahu bahawa menggerakkan telefon ke sisi itulah
     * yang ARCore perlukan.
     */
    @Volatile private var outlines: List<FloatArray> = emptyList()
    @Volatile private var planeCount = 0

    /**
     * Cincin reticle, sebagai titik dunia yang terletak DI ATAS permukaan
     * yang ditujui.
     *
     * Satu bulatan rata di tengah skrin tidak boleh memberitahu apa-apa
     * tentang permukaan di bawahnya: ia kelihatan sama sama ada ARCore
     * terkunci pada lantai, pada dinding, atau pada tiada apa-apa. Satu
     * cincin yang dilukis dalam satah itu condong bersamanya, jadi bentuknya
     * sendiri ialah jawapan kepada "ia nampak satah tak" — dan itulah yang
     * laluan WebXR lama lakukan.
     */
    @Volatile private var ring: FloatArray = FloatArray(0)

    /** Kedudukan kursor yang ditapis; aim menunjuk kepadanya. */
    private var smooth: FloatArray? = null

    /** Tempat reticle sedang menyentuh dunia, atau null bila tiada satah. */
    @Volatile private var aim: FloatArray? = null
    @Volatile private var tracking = false

    /** Dikemas kini setiap bingkai, dibaca oleh overlay pada benang UI. */
    @Volatile private var vp = FloatArray(16)

    private var kind = "dist"
    private var sessionResumed = false

    @SuppressLint("SetTextI18n")
    override fun onCreate(st: Bundle?) {
        super.onCreate(st)
        kind = intent.getStringExtra("kind") ?: "dist"

        gl = GLSurfaceView(this).apply {
            preserveEGLContextOnPause = true
            setEGLContextClientVersion(2)
            setEGLConfigChooser(8, 8, 8, 8, 16, 0)
            setRenderer(Renderer())
            renderMode = GLSurfaceView.RENDERMODE_CONTINUOUSLY
        }
        overlay = Overlay(this)

        val root = FrameLayout(this)
        root.addView(gl, FrameLayout.LayoutParams(-1, -1))
        root.addView(overlay, FrameLayout.LayoutParams(-1, -1))

        hint = TextView(this).apply {
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.argb(140, 0, 0, 0))
            setPadding(dp(14), dp(10), dp(14), dp(10))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
            text = "Aim the camera at the floor and move slowly…"
        }
        root.addView(hint, FrameLayout.LayoutParams(-1, -2).apply { gravity = Gravity.TOP })

        readout = TextView(this).apply {
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.argb(170, 0, 0, 0))
            setPadding(dp(16), dp(10), dp(16), dp(10))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 20f)
            gravity = Gravity.CENTER
            text = "—"
        }

        val bar = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.argb(190, 0, 0, 0))
            setPadding(dp(12), dp(10), dp(12), dp(16))
        }
        bar.addView(readout, LinearLayout.LayoutParams(-1, -2))

        // Susunan yang sama seperti skrin pelan: satu tindakan utama yang
        // lebar penuh, kemudian satu baris ikon bulat berwarna. Dua skrin AR
        // dalam app yang sama tidak sepatutnya kelihatan seperti dua app.
        placeBtn = ImageButton(this).apply {
            setImageResource(R.drawable.ic_pin)
            setColorFilter(Color.WHITE)
            contentDescription = "Place point"
            scaleType = android.widget.ImageView.ScaleType.CENTER_INSIDE
            background = GradientDrawable().apply {
                cornerRadius = dp(14).toFloat()
                setColor(C_PRIMARY)
            }
            setPadding(dp(12), dp(12), dp(12), dp(12))
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) tooltipText = "Place point"
            setOnClickListener { place() }
            layoutParams = LinearLayout.LayoutParams(-1, dp(54)).apply { topMargin = dp(8) }
        }
        bar.addView(placeBtn)

        fun icon(res: Int, desc: String, tint: Int): ImageButton =
            ImageButton(this).apply {
                setImageResource(res)
                setColorFilter(tint)
                contentDescription = desc
                scaleType = android.widget.ImageView.ScaleType.CENTER_INSIDE
                background = GradientDrawable().apply {
                    shape = GradientDrawable.OVAL
                    setColor(Color.argb(38, 255, 255, 255))
                    setStroke(dp(1), Color.argb(55, 255, 255, 255))
                }
                setPadding(dp(13), dp(13), dp(13), dp(13))
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) tooltipText = desc
                layoutParams = LinearLayout.LayoutParams(0, dp(54), 1f)
                    .apply { marginStart = dp(6); marginEnd = dp(6); topMargin = dp(10) }
            }

        undoBtn = icon(R.drawable.ic_undo, "Undo", C_PLAIN).apply {
            isEnabled = false; setOnClickListener { undo() }
        }
        doneBtn = icon(R.drawable.ic_check, "Done", C_DONE).apply {
            isEnabled = false; setOnClickListener { finishWith() }
        }
        val closeBtn = icon(R.drawable.ic_close, "Cancel", C_CLOSE).apply {
            setOnClickListener { askLeave() }
        }
        bar.addView(LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            addView(undoBtn); addView(doneBtn); addView(closeBtn)
        }, LinearLayout.LayoutParams(-1, -2))

        root.addView(bar, FrameLayout.LayoutParams(-1, -2).apply { gravity = Gravity.BOTTOM })
        setContentView(root)
        paintText()
    }

    private fun dp(v: Int): Int =
        TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics).toInt()

    // ---------- kitaran hayat sesi ----------

    override fun onResume() {
        super.onResume()
        if (session == null) {
            session = try {
                Session(this).also { s ->
                    s.configure(Config(s).apply {
                        planeFindingMode = Config.PlaneFindingMode.HORIZONTAL_AND_VERTICAL
                        updateMode = Config.UpdateMode.LATEST_CAMERA_IMAGE
                        focusMode = Config.FocusMode.AUTO
                        // Setiap ciri yang dihidupkan ialah kerja setiap
                        // bingkai, dan kerja setiap bingkai ialah ketaran.
                        // Tiada satu pun daripada ini digunakan di sini.
                        depthMode = Config.DepthMode.DISABLED
                        instantPlacementMode = Config.InstantPlacementMode.DISABLED
                        lightEstimationMode = Config.LightEstimationMode.DISABLED
                        cloudAnchorMode = Config.CloudAnchorMode.DISABLED
                    })
                }
            } catch (e: Throwable) {
                bail("AR could not start: ${e.javaClass.simpleName}")
                return
            }
        }
        try {
            session?.resume()
            sessionResumed = true
        } catch (e: CameraNotAvailableException) {
            session = null
            bail("Camera not available for AR")
            return
        }
        gl.onResume()
    }

    override fun onPause() {
        super.onPause()
        if (sessionResumed) {
            gl.onPause()
            session?.pause()
            sessionResumed = false
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        groups.forEach { g -> g.forEach { runCatching { it.detach() } } }
        groups.clear()
        runCatching { session?.close() }
        session = null
    }

    /**
     * Satu pusingan kini boleh memegang enam ukuran, bukan satu, jadi
     * tersalah tekan butang merah menjadi jauh lebih mahal daripada dahulu.
     * Ia ditanya dahulu — tetapi hanya apabila ada sesuatu untuk hilang.
     */
    private fun askLeave() {
        val n = doneSegs().size
        if (n == 0) { finish(); return }
        android.app.AlertDialog.Builder(this)
            .setMessage("$n measurements are not saved. Discard them all?")
            .setPositiveButton("Discard") { _, _ -> finish() }
            .setNegativeButton("Back", null)
            .show()
    }

    @Suppress("DEPRECATION", "MissingSuperCall")
    override fun onBackPressed() { askLeave() }

    private fun bail(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
        setResult(RESULT_CANCELED, Intent().putExtra("error", msg))
        finish()
    }

    // ---------- titik ----------

    private fun place() {
        if (aim == null) {
            Toast.makeText(this, "No surface at the centre of the screen yet", Toast.LENGTH_SHORT).show()
            return
        }
        wantPlace = true
    }

    private fun undo() { wantUndo = true }

    private fun dist(a: FloatArray, b: FloatArray): Float {
        val dx = a[0] - b[0]; val dy = a[1] - b[1]; val dz = a[2] - b[2]
        return sqrt(dx * dx + dy * dy + dz * dz)
    }

    /**
     * Panjang ukuran yang SEDANG dibina, termasuk segmen hidup ke reticle.
     *
     * Hanya yang sedang dibina. Bacaan besar itu ialah nombor yang surveyor
     * tulis sekarang; menjumlahkan tiga ukuran berasingan ke dalamnya akan
     * memberi satu nombor yang tidak bermakna apa-apa.
     */
    private fun liveLen(): Float {
        val p = openSeg()
        var m = 0f
        for (i in 1 until p.size) m += dist(p[i - 1], p[i])
        val a = aim
        if (a != null && p.isNotEmpty()) m += dist(p[p.size - 1], a)
        return m
    }

    /** Panjang satu ukuran yang sudah siap. */
    private fun segLen(p: List<FloatArray>): Float {
        var m = 0f
        for (i in 1 until p.size) m += dist(p[i - 1], p[i])
        if (kind == "area" && p.size >= 3) m += dist(p[p.size - 1], p[0])
        return m
    }

    /** Berapa titik sebelum satu ukuran bermakna apa-apa. */
    private fun least(): Int = if (kind == "area") 3 else 2

    /** Ukuran yang lengkap dan boleh dihantar balik. */
    private fun doneSegs(): List<List<FloatArray>> = segsNow.filter { it.size >= least() }

    /** Nombor yang patut berada dalam bacaan besar: ukuran yang sedang
     *  dibina, kalau tidak yang terakhir disiapkan — supaya nombor itu
     *  tidak hilang sebaik titik kedua diletak. */
    private fun shownLen(): Float =
        if (openSeg().isNotEmpty()) liveLen()
        else segsNow.lastOrNull()?.let { segLen(it) } ?: 0f

    private fun fmt(m: Float): String {
        val cm = m * 100
        return if (cm < 100) String.format("%.1f cm", cm) else String.format("%.2f m", m)
    }

    @SuppressLint("SetTextI18n")
    private fun paintText() {
        val all = flat()
        val open = openSeg()
        val done = doneSegs().size
        undoBtn.isEnabled = all.isNotEmpty()
        doneBtn.isEnabled = done > 0
        placeBtn.isEnabled = aim != null
        placeBtn.alpha = if (placeBtn.isEnabled) 1f else 0.3f
        for (b2 in listOf(undoBtn, doneBtn)) b2.alpha = if (b2.isEnabled) 1f else 0.35f

        readout.text = if (all.isEmpty()) "—" else fmt(shownLen())
        val tally = if (done == 0) "" else " · $done measurements done"
        hint.text = when {
            // Sebab sebenar ARCore hilang jejak, dan bukan "cuba lagi": di
            // tapak, "terlalu gelap" dan "gerak terlalu laju" ialah dua
            // masalah berbeza dengan dua penyelesaian berbeza.
            !tracking && why.isNotEmpty() -> why
            !tracking -> "Move the phone slowly so ARCore can see the surface…"
            // "Belum jumpa apa-apa" dan "jumpa, tapi awak tidak menghalakannya"
            // ialah dua masalah berbeza, jadi ia dikatakan secara berbeza.
            planeCount == 0 ->
                "No surface yet. Move the phone LEFT and RIGHT slowly, " +
                "aim at a surface with texture — bare floors and white walls are hard."
            aim == null -> "$planeCount surfaces found · aim the circle at a blue area$tally"
            kind == "dist" && open.isEmpty() && done == 0 ->
                "Tap the blue button at the first end"
            // Selepas satu pasangan ditutup, perkara paling penting untuk
            // dikatakan ialah ia SUDAH tutup: titik seterusnya tidak akan
            // menyambung kepadanya.
            kind == "dist" && open.isEmpty() ->
                "$done measurements done · tap the blue button for a new one, " +
                "or the green circle to save them all"
            kind == "dist" -> "Walk to the other end, tap the blue button again$tally"
            open.size < 3 -> "Tap the blue button point by point along the wall (${open.size})"
            else -> "${open.size} points · tap the green circle"
        }
    }

    /**
     * Dihantar balik sebagai senarai ukuran — senarai bagi senarai titik —
     * dan bukan satu senarai titik rata seperti dahulu. Pocket menerima
     * kedua-dua bentuk, kerana APK dan HTML dipasang secara berasingan dan
     * salah satu daripadanya akan sentiasa lebih lama daripada yang lain.
     */
    private fun finishWith() {
        val segs = doneSegs()
        val dropped = flat().size - segs.sumOf { it.size }
        if (dropped > 0) {
            // Satu titik bukan ukuran. Ia dibuang, tetapi tidak secara
            // senyap: data yang hilang tanpa sebab ialah bug.
            Toast.makeText(this,
                "$dropped incomplete points dropped", Toast.LENGTH_SHORT).show()
        }
        val sb = StringBuilder("[")
        segs.forEachIndexed { gi, g ->
            if (gi > 0) sb.append(',')
            sb.append('[')
            g.forEachIndexed { i, p ->
                if (i > 0) sb.append(',')
                sb.append("{\"x\":").append(p[0])
                    .append(",\"y\":").append(p[1])
                    .append(",\"z\":").append(p[2]).append('}')
            }
            sb.append(']')
        }
        sb.append(']')
        setResult(RESULT_OK, Intent().putExtra("pts", sb.toString()).putExtra("kind", kind))
        finish()
    }

    // ---------- lapisan 2D ----------

    /**
     * Titik dunia diunjur ke skrin dengan matriks kamera yang sama yang
     * melukis latar itu, jadi tanda itu kekal melekat pada tempat sebenar
     * tanpa satu pun objek 3D dilukis.
     */
    inner class Overlay(ctx: android.content.Context) : View(ctx) {
        private val dot = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.rgb(255, 196, 0) }
        private val hoop = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(3).toFloat(); color = Color.WHITE
        }
        private val hoopDot = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.argb(120, 255, 255, 255)
        }
        private val aimEdge = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(3).toFloat(); color = Color.rgb(255, 196, 0)
        }
        private val aimFill = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL; color = Color.argb(60, 255, 196, 0)
        }
        private val line = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(3).toFloat(); color = Color.rgb(255, 196, 0)
        }
        private val lbl = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.WHITE; textSize = dp(14).toFloat(); textAlign = Paint.Align.CENTER
        }
        private val lblBg = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.argb(190, 0, 0, 0) }
        private val planeFill = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL; color = Color.argb(38, 90, 170, 255)
        }
        private val planeEdge = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(2).toFloat()
            color = Color.argb(150, 120, 190, 255)
        }
        private val path = android.graphics.Path()
        private val out = FloatArray(4)

        /** null bila titik itu di belakang kamera. */
        private fun toScreen(p: FloatArray): FloatArray? {
            val m = vp
            out[0] = m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12]
            out[1] = m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13]
            out[2] = m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]
            out[3] = m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15]
            if (out[3] <= 0.0001f) return null
            val x = (out[0] / out[3] * 0.5f + 0.5f) * width
            val y = (1f - (out[1] / out[3] * 0.5f + 0.5f)) * height
            return floatArrayOf(x, y)
        }

        override fun onDraw(c: Canvas) {
            val cx = width / 2f
            val cy = height / 2f
            // dot dikongsi dengan titik tengah reticle di bawah, dan gelung
            // ukuran mengubah warnanya. Tanpa set semula di sini, reticle
            // memakai warna ukuran terakhir bingkai lepas.
            dot.color = C_SEG_LIVE

            // Garis luar setiap satah yang dikesan.
            for (poly in outlines) {
                val n = poly.size / 3
                if (n < 3) continue
                path.reset()
                var started = false
                for (k in 0 until n) {
                    val sp = toScreen(floatArrayOf(poly[k * 3], poly[k * 3 + 1], poly[k * 3 + 2]))
                        ?: continue
                    if (!started) { path.moveTo(sp[0], sp[1]); started = true }
                    else path.lineTo(sp[0], sp[1])
                }
                if (!started) continue
                path.close()
                c.drawPath(path, planeFill)
                c.drawPath(path, planeEdge)
            }

            // Reticle. Bila ARCore terkunci pada permukaan, cincin itu
            // dilukis DI ATAS permukaan itu dan condong bersamanya; bila
            // tidak, yang tinggal hanyalah bulatan rata yang tidak berpura-
            // pura tahu apa-apa tentang dunia.
            val rg = ring
            var drew = false
            if (rg.size >= 9) {
                path.reset()
                var started = false
                var k = 0
                while (k + 2 < rg.size) {
                    val sp = toScreen(floatArrayOf(rg[k], rg[k + 1], rg[k + 2]))
                    if (sp != null) {
                        if (!started) { path.moveTo(sp[0], sp[1]); started = true }
                        else path.lineTo(sp[0], sp[1])
                    }
                    k += 3
                }
                if (started) {
                    path.close()
                    c.drawPath(path, aimFill)
                    c.drawPath(path, aimEdge)
                    drew = true
                }
            }
            if (!drew) {
                hoop.color = Color.argb(120, 255, 255, 255)
                c.drawCircle(cx, cy, dp(13).toFloat(), hoop)
            }
            c.drawCircle(cx, cy, dp(3).toFloat(), if (drew) dot else hoopDot)

            // Setiap ukuran dilukis sebagai rantainya sendiri, dan tiada
            // garis antara satu ukuran dengan yang berikutnya — kerana tiada
            // garis di sana. Ia benda berasingan di tempat berasingan.
            //
            // Satu senarai dibaca sekali ke dalam pemboleh ubah tempatan:
            // benang GL menggantikannya di bawah kita, dan membacanya dua
            // kali boleh melukis indeks terbuka satu bingkai lepas terhadap
            // senarai bingkai ini.
            val segs = segsNow
            val oi = openIndex(segs)
            val tip = aim

            for (gi in segs.indices) {
                val world = segs[gi]
                val screen = ArrayList<FloatArray?>(world.size)
                for (q in world) screen.add(toScreen(q))

                // Hijau bermakna terkunci, kuning bermakna masih dibina —
                // warna yang sama dengan butang Siap, atas sebab yang sama.
                val fin = gi != oi
                line.color = if (fin) C_SEG_DONE else C_SEG_LIVE
                dot.color = if (fin) C_SEG_DONE else C_SEG_LIVE

                for (i in 1 until screen.size) {
                    val a = screen[i - 1] ?: continue
                    val b = screen[i] ?: continue
                    c.drawLine(a[0], a[1], b[0], b[1], line)
                    val d = fmt(dist(world[i - 1], world[i]))
                    // Nombor ukuran hanya apabila ada lebih daripada satu.
                    tag(c, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2,
                        if (segs.size > 1 && kind == "dist") "${gi + 1}. $d" else d)
                }

                // Gelung tertutup untuk luas.
                if (kind == "area" && screen.size >= 3) {
                    val a = screen[screen.size - 1]; val b = screen[0]
                    if (a != null && b != null) c.drawLine(a[0], a[1], b[0], b[1], line)
                }

                for (q in screen) if (q != null) c.drawCircle(q[0], q[1], dp(6).toFloat(), dot)
            }

            // Segmen hidup, dari titik terakhir ukuran yang sedang dibina.
            // Bila pasangan terakhir sudah penuh, tiada apa dilukis: titik
            // seterusnya bermula dari kosong, dan satu garis keluar dari
            // pasangan yang sudah tutup akan menipu tentang perkara itu.
            if (oi >= 0 && tip != null && segs[oi].isNotEmpty()) {
                val open = segs[oi]
                val last = toScreen(open[open.size - 1])
                if (last != null) {
                    line.color = C_SEG_LIVE
                    c.drawLine(last[0], last[1], cx, cy, line)
                    tag(c, (last[0] + cx) / 2, (last[1] + cy) / 2,
                        fmt(dist(open[open.size - 1], tip)))
                }
            }
        }

        private fun tag(c: Canvas, x: Float, y: Float, text: String) {
            val w = lbl.measureText(text) + dp(12)
            val h = dp(22).toFloat()
            c.drawRoundRect(x - w / 2, y - h / 2, x + w / 2, y + h / 2,
                dp(6).toFloat(), dp(6).toFloat(), lblBg)
            c.drawText(text, x, y + dp(5), lbl)
        }
    }

    // ---------- GL ----------

    inner class Renderer : GLSurfaceView.Renderer {
        private val proj = FloatArray(16)
        private val view = FloatArray(16)
        private val mul = FloatArray(16)

        override fun onSurfaceCreated(g: GL10?, c: EGLConfig?) {
            GLES20.glClearColor(0f, 0f, 0f, 1f)
            bg.create()
        }

        override fun onSurfaceChanged(g: GL10?, w: Int, h: Int) {
            GLES20.glViewport(0, 0, w, h)
            session?.setDisplayGeometry(
                windowManager.defaultDisplay.rotation, w, h)
        }

        override fun onDrawFrame(g: GL10?) {
            GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT or GLES20.GL_DEPTH_BUFFER_BIT)
            val s = session ?: return
            s.setCameraTextureName(bg.textureId)

            val frame: Frame = try { s.update() } catch (e: Throwable) { return }
            bg.draw(frame)

            val cam = frame.camera
            val ok = cam.trackingState == TrackingState.TRACKING
            val reason = if (ok) "" else when (cam.trackingFailureReason) {
                TrackingFailureReason.INSUFFICIENT_LIGHT -> "Too dark — turn on a light"
                TrackingFailureReason.EXCESSIVE_MOTION -> "Move the phone more slowly"
                TrackingFailureReason.INSUFFICIENT_FEATURES ->
                    "This surface is too plain — aim at something with texture"
                TrackingFailureReason.CAMERA_UNAVAILABLE -> "Another app is using the camera"
                else -> ""
            }
            if (tracking != ok || why != reason) {
                tracking = ok; why = reason
                runOnUiThread { paintText() }
            }
            if (!ok) {
                if (aim != null) { aim = null; postOverlay() }
                return
            }

            cam.getProjectionMatrix(proj, 0, 0.05f, 100f)
            cam.getViewMatrix(view, 0)
            Matrix.multiplyMM(mul, 0, proj, 0, view, 0)
            vp = mul.copyOf()

            // Satu hit-test setiap bingkai, di tengah skrin: surveyor menghala
            // dengan telefon dan bukan dengan jari, jadi tiada ketikan untuk
            // terlepas dan tangan yang memegang telefon tidak menggoyangnya.
            var found: FloatArray? = null
            var hit: HitResult? = null
            try {
                // Satah SAHAJA. Titik ciri dan titik kedalaman juga
                // memulangkan hit, tetapi kedudukannya berubah beberapa
                // sentimeter setiap bingkai — kursor yang mengikutinya
                // bergegar sepanjang masa, yang membuat seluruh skrin
                // kelihatan tidak stabil. Satah ialah anggaran yang ARCore
                // sendiri sudah tapis merentasi banyak bingkai.
                val hits = frame.hitTest(gl.width / 2f, gl.height / 2f).filter {
                    val t = it.trackable
                    t is Plane && t.isPoseInPolygon(it.hitPose) &&
                        t.trackingState == TrackingState.TRACKING
                }
                // Selepas titik pertama diletak, terima hanya satah pada
                // ketinggian yang lebih kurang sama. Tanpa ini, kursor
                // melompat ke meja atau ke dinding di tengah ukuran dan
                // bacaannya menjadi karut tanpa amaran.
                // Pada ukuran yang SEDANG dibina, bukan titik pertama sesi:
            // tiga ukuran di tiga tempat boleh berada di tiga ketinggian
            // berbeza, dan mengunci semuanya kepada yang pertama akan
            // menolak satah yang betul untuk dua yang lain.
            val firstY = openSeg().firstOrNull()?.get(1)
                hit = if (firstY == null) hits.firstOrNull()
                      else hits.firstOrNull { kotlin.math.abs(it.hitPose.ty() - firstY) < 0.12f }
                          ?: hits.firstOrNull()
                hit?.let { found = floatArrayOf(it.hitPose.tx(), it.hitPose.ty(), it.hitPose.tz()) }
            } catch (e: Throwable) { /* bingkai ini tiada hit; cuba yang seterusnya */ }

            // Tapis lulus-rendah pada kedudukan kursor.
            //
            // Walaupun dengan satah sahaja, hit berubah sedikit setiap
            // bingkai, dan pada 30 bingkai sesaat getaran kecil itu ialah
            // apa yang membuat skrin memeningkan. Lompatan besar dibiarkan
            // melalui: itu permukaan yang berbeza, bukan bunyi, dan
            // melicinkannya akan membuat kursor merayap ke sasaran baharu.
            // val tempatan: found ditangkap oleh closure di atas, jadi
            // Kotlin tidak boleh smart-cast ia.
            val raw = found
            if (raw == null) {
                smooth = null
            } else {
                val sm = smooth
                smooth = if (sm == null || dist(sm, raw) > 0.35f) raw.copyOf()
                else floatArrayOf(
                    sm[0] + (raw[0] - sm[0]) * SMOOTH,
                    sm[1] + (raw[1] - sm[1]) * SMOOTH,
                    sm[2] + (raw[2] - sm[2]) * SMOOTH)
            }
            val shown = smooth

            // Cincin dibina daripada pose hit itu sendiri: paksi Y pose itu
            // ialah normal permukaan, jadi satu bulatan dalam XZ tempatannya
            // terletak rata pada permukaan itu. Ia dialihkan ke kedudukan
            // yang ditapis supaya cincin dan titik bergerak sebagai satu.
            ring = if (hit == null || shown == null || raw == null) FloatArray(0) else {
                val po = hit.hitPose
                val dx = shown[0] - raw[0]
                val dy = shown[1] - raw[1]
                val dz = shown[2] - raw[2]
                val n = 28
                val r = 0.05f
                val w = FloatArray(n * 3)
                for (k in 0 until n) {
                    val a2 = (k.toFloat() / n) * 6.2831855f
                    val wp = po.transformPoint(floatArrayOf(
                        r * kotlin.math.cos(a2), 0f, r * kotlin.math.sin(a2)))
                    w[k * 3] = wp[0] + dx; w[k * 3 + 1] = wp[1] + dy; w[k * 3 + 2] = wp[2] + dz
                }
                w
            }

            val had = aim != null
            aim = shown
            val gotHit = raw != null

            // Anchor dicipta di sini dan bukan dalam pengendali butang: satu
            // HitResult hanya sah sehingga update() berikutnya, jadi ia mesti
            // digunakan dalam bingkai yang melahirkannya.
            var changed = false
            if (wantPlace) {
                wantPlace = false
                hit?.let { h ->
                    runCatching { h.trackable.createAnchor(h.hitPose) }.onSuccess { an ->
                        val cap = capacity()
                        val g = groups.lastOrNull()
                        // Pasangan yang penuh tidak diperluas. Titik ini
                        // memulakan ukuran baharu, tidak bersambung kepada
                        // yang sebelumnya.
                        if (g == null || (cap > 0 && g.size >= cap)) groups.add(ArrayList())
                        groups[groups.size - 1].add(an)
                        changed = true
                    }
                }
            }
            if (wantUndo) {
                wantUndo = false
                // Satu ketikan membuang satu titik. Kumpulan yang menjadi
                // kosong dibuang sekali, supaya ketikan seterusnya masuk ke
                // dalam ukuran sebelumnya dan bukan ke dalam bekas kosong.
                val g = groups.lastOrNull()
                if (g != null) {
                    if (g.isNotEmpty()) runCatching { g.removeAt(g.size - 1).detach() }
                    if (g.isEmpty()) groups.removeAt(groups.size - 1)
                    changed = true
                }
            }

            // Apa yang ARCore nampak, dikumpul untuk dilukis.
            val outs = ArrayList<FloatArray>()
            var nPlane = 0
            try {
                for (pl in s.getAllTrackables(Plane::class.java)) {
                    if (pl.trackingState != TrackingState.TRACKING) continue
                    // Satah yang telah diserap ke dalam satah lain yang lebih
                    // besar akan dilukis dua kali kalau tidak dilangkau.
                    if (pl.subsumedBy != null) continue
                    nPlane++
                    val poly = pl.polygon ?: continue
                    val n = poly.limit() / 2
                    if (n < 3) continue
                    val pose = pl.centerPose
                    val w = FloatArray(n * 3)
                    for (i in 0 until n) {
                        val wp = pose.transformPoint(
                            floatArrayOf(poly.get(i * 2), 0f, poly.get(i * 2 + 1)))
                        w[i * 3] = wp[0]; w[i * 3 + 1] = wp[1]; w[i * 3 + 2] = wp[2]
                    }
                    outs.add(w)
                }
            } catch (e: Throwable) { /* satah berubah di bawah kita; bingkai berikutnya */ }
            outlines = outs
            if (planeCount != nPlane) { planeCount = nPlane; runOnUiThread { paintText() } }

            // Pose segar setiap bingkai: itulah sebabnya anchor digunakan.
            // Anchor yang ARCore belum jejak semula ditinggalkan di tempat
            // terakhirnya dan bukan dilompat ke asalan.
            val prev = segsNow
            val fresh = ArrayList<List<FloatArray>>(groups.size)
            groups.forEachIndexed { gi, g ->
                val old = if (gi < prev.size) prev[gi] else emptyList()
                val one = ArrayList<FloatArray>(g.size)
                g.forEachIndexed { i, an ->
                    if (an.trackingState == TrackingState.TRACKING) {
                        val po = an.pose
                        one.add(floatArrayOf(po.tx(), po.ty(), po.tz()))
                    } else if (i < old.size) {
                        one.add(old[i])
                    } else {
                        one.add(floatArrayOf(0f, 0f, 0f))
                    }
                }
                fresh.add(one)
            }
            segsNow = fresh

            if (changed || had != gotHit) runOnUiThread { paintText() }
            postOverlay()
        }

        private fun postOverlay() {
            overlay.postInvalidateOnAnimation()
            if (segsNow.isNotEmpty()) runOnUiThread { readout.text = fmt(shownLen()) }
        }
    }

    companion object {
        private const val C_PRIMARY = 0xFF2563EB.toInt()
        /** Kuning: sedang dibina. Hijau: terkunci, warna butang Siap. */
        private const val C_SEG_LIVE = 0xFFFFC400.toInt()
        private const val C_SEG_DONE = 0xFF4ADE80.toInt()
        private const val C_PLAIN = 0xFFD6DEE6.toInt()
        private const val C_DONE = 0xFF4ADE80.toInt()
        private const val C_CLOSE = 0xFFFF7A7A.toInt()

        /** Berapa banyak setiap bingkai menggerakkan kursor ke arah hit
         *  mentah. Rendah bermakna tenang tetapi lambat; ini kompromi yang
         *  masih terasa segera di tangan. */
        private const val SMOOTH = 0.28f
    }
}
