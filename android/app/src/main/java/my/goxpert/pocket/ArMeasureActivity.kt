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
import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.FrameLayout
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
    private lateinit var undoBtn: Button
    private lateinit var doneBtn: Button

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
     * Disentuh hanya pada benang GL; benang UI membaca ptsNow.
     */
    private val anchors = ArrayList<Anchor>()

    /** Gambaran pose semasa, diterbitkan untuk benang UI setiap bingkai. */
    @Volatile private var ptsNow: List<FloatArray> = emptyList()

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
            text = "Halakan kamera ke lantai dan gerak perlahan…"
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

        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(0, dp(10), 0, 0)
        }
        // Ikon di sebelah label, sama seperti skrin pelan: satu bar AR tidak
        // sepatutnya kelihatan seperti dua app yang berbeza.
        fun mk(label: String, weight: Float, res: Int): Button =
            Button(this).apply {
                text = label
                isAllCaps = false
                maxLines = 1
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
                setCompoundDrawablesWithIntrinsicBounds(res, 0, 0, 0)
                compoundDrawablePadding = dp(5)
                setPadding(dp(6), 0, dp(6), 0)
                layoutParams = LinearLayout.LayoutParams(0, dp(52), weight)
                    .apply { marginEnd = dp(6) }
            }

        undoBtn = mk("Undo", 1f, R.drawable.ic_undo).apply {
            isEnabled = false; setOnClickListener { undo() }
        }
        val place = mk("Letak", 1.4f, R.drawable.ic_pin).apply { setOnClickListener { place() } }
        doneBtn = mk("Siap", 1f, R.drawable.ic_check).apply {
            isEnabled = false; setOnClickListener { finishWith() }
        }

        row.addView(undoBtn); row.addView(place); row.addView(doneBtn)
        bar.addView(row, LinearLayout.LayoutParams(-1, -2))

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
                bail("AR tidak dapat dimulakan: ${e.javaClass.simpleName}")
                return
            }
        }
        try {
            session?.resume()
            sessionResumed = true
        } catch (e: CameraNotAvailableException) {
            session = null
            bail("Kamera tidak tersedia untuk AR")
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
        anchors.forEach { runCatching { it.detach() } }
        anchors.clear()
        runCatching { session?.close() }
        session = null
    }

    private fun bail(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
        setResult(RESULT_CANCELED, Intent().putExtra("error", msg))
        finish()
    }

    // ---------- titik ----------

    private fun place() {
        if (aim == null) {
            Toast.makeText(this, "Belum ada satah di tengah skrin", Toast.LENGTH_SHORT).show()
            return
        }
        wantPlace = true
    }

    private fun undo() { wantUndo = true }

    private fun dist(a: FloatArray, b: FloatArray): Float {
        val dx = a[0] - b[0]; val dy = a[1] - b[1]; val dz = a[2] - b[2]
        return sqrt(dx * dx + dy * dy + dz * dz)
    }

    /** Panjang setakat ini, termasuk segmen hidup ke reticle. */
    private fun liveLen(): Float {
        val p = ptsNow
        var m = 0f
        for (i in 1 until p.size) m += dist(p[i - 1], p[i])
        val a = aim
        if (a != null && p.isNotEmpty()) m += dist(p[p.size - 1], a)
        return m
    }

    private fun fmt(m: Float): String {
        val cm = m * 100
        return if (cm < 100) String.format("%.1f cm", cm) else String.format("%.2f m", m)
    }

    @SuppressLint("SetTextI18n")
    private fun paintText() {
        val p = ptsNow
        val need = if (kind == "dist") 2 else 3
        undoBtn.isEnabled = p.isNotEmpty()
        doneBtn.isEnabled = p.size >= need

        readout.text = if (p.isEmpty()) "—" else fmt(liveLen())
        hint.text = when {
            // Sebab sebenar ARCore hilang jejak, dan bukan "cuba lagi": di
            // tapak, "terlalu gelap" dan "gerak terlalu laju" ialah dua
            // masalah berbeza dengan dua penyelesaian berbeza.
            !tracking && why.isNotEmpty() -> why
            !tracking -> "Gerak telefon perlahan supaya ARCore nampak permukaan…"
            // "Belum jumpa apa-apa" dan "jumpa, tapi awak tidak menghalakannya"
            // ialah dua masalah berbeza, jadi ia dikatakan secara berbeza.
            planeCount == 0 ->
                "Belum ada satah. Gerak telefon ke KIRI dan KANAN perlahan, " +
                "halakan ke permukaan bercorak — lantai kosong dan dinding putih sukar."
            aim == null -> "$planeCount satah dikesan · halakan bulatan ke kawasan biru"
            kind == "dist" && p.isEmpty() -> "Ketik Letak titik pada hujung pertama"
            kind == "dist" && p.size == 1 -> "Jalan ke hujung kedua, letak titik lagi"
            kind == "dist" -> "Tekan Siap, atau Undo untuk ubah"
            p.size < 3 -> "Letak titik demi titik sepanjang dinding (${p.size})"
            else -> "${p.size} titik · tekan Siap"
        }
    }

    private fun finishWith() {
        val sb = StringBuilder("[")
        ptsNow.forEachIndexed { i, p ->
            if (i > 0) sb.append(',')
            sb.append("{\"x\":").append(p[0])
                .append(",\"y\":").append(p[1])
                .append(",\"z\":").append(p[2]).append('}')
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

            val world = ptsNow
            val screen = ArrayList<FloatArray?>(world.size)
            for (p in world) screen.add(toScreen(p))

            for (i in 1 until screen.size) {
                val a = screen[i - 1] ?: continue
                val b = screen[i] ?: continue
                c.drawLine(a[0], a[1], b[0], b[1], line)
                tag(c, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, fmt(dist(world[i - 1], world[i])))
            }

            // Segmen hidup dari titik terakhir ke reticle.
            val last = screen.lastOrNull()
            val tip = aim
            if (last != null && tip != null && world.isNotEmpty()) {
                c.drawLine(last[0], last[1], cx, cy, line)
                tag(c, (last[0] + cx) / 2, (last[1] + cy) / 2,
                    fmt(dist(world[world.size - 1], tip)))
            }

            // Gelung tertutup untuk luas.
            if (kind == "area" && screen.size >= 3) {
                val a = screen[screen.size - 1]; val b = screen[0]
                if (a != null && b != null) c.drawLine(a[0], a[1], b[0], b[1], line)
            }

            for (s in screen) if (s != null) c.drawCircle(s[0], s[1], dp(6).toFloat(), dot)
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
                TrackingFailureReason.INSUFFICIENT_LIGHT -> "Terlalu gelap — hidupkan lampu"
                TrackingFailureReason.EXCESSIVE_MOTION -> "Gerak telefon lebih perlahan"
                TrackingFailureReason.INSUFFICIENT_FEATURES ->
                    "Permukaan ini terlalu kosong — halakan ke sesuatu yang bercorak"
                TrackingFailureReason.CAMERA_UNAVAILABLE -> "Kamera diambil oleh app lain"
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
                val firstY = ptsNow.firstOrNull()?.get(1)
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
                    runCatching { anchors.add(h.trackable.createAnchor(h.hitPose)) }
                        .onSuccess { changed = true }
                }
            }
            if (wantUndo) {
                wantUndo = false
                if (anchors.isNotEmpty()) {
                    runCatching { anchors.removeAt(anchors.size - 1).detach() }
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
            val fresh = ArrayList<FloatArray>(anchors.size)
            val prev = ptsNow
            anchors.forEachIndexed { i, an ->
                if (an.trackingState == TrackingState.TRACKING) {
                    val po = an.pose
                    fresh.add(floatArrayOf(po.tx(), po.ty(), po.tz()))
                } else if (i < prev.size) {
                    fresh.add(prev[i])
                } else {
                    fresh.add(floatArrayOf(0f, 0f, 0f))
                }
            }
            ptsNow = fresh

            if (changed || had != gotHit) runOnUiThread { paintText() }
            postOverlay()
        }

        private fun postOverlay() {
            overlay.postInvalidateOnAnimation()
            if (ptsNow.isNotEmpty()) runOnUiThread { readout.text = fmt(liveLen()) }
        }
    }

    companion object {
        /** Berapa banyak setiap bingkai menggerakkan kursor ke arah hit
         *  mentah. Rendah bermakna tenang tetapi lambat; ini kompromi yang
         *  masih terasa segera di tangan. */
        private const val SMOOTH = 0.28f
    }
}
