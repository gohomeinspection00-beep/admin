package my.goxpert.pocket

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.drawable.GradientDrawable
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import android.opengl.Matrix
import android.os.Build
import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.SeekBar
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
import org.json.JSONObject
import java.io.File
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10
import kotlin.math.abs
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.hypot
import kotlin.math.sin
import kotlin.math.sqrt

/**
 * Model 3D dihamparkan pada bangunan sebenar, pada skala sebenar, di dalam app.
 *
 * Versi web sudah melakukan semua ini dalam Three.js di atas WebXR — potong,
 * x-ray, tanda sisihan, ralat padanan dalam milimeter. Tiada satu pun
 * daripadanya boleh berjalan dalam WebView, kerana WebView tidak menghantar
 * WebXR. Jadi matematik jajaran, bentuk kawalan dan makna setiap nombor
 * dipindahkan ke sini apa adanya, dan ARCore mengambil tempat WebXR.
 *
 * Satu perjanjian dipegang ketat di kedua-dua belah: titik ruang model
 * sentiasa dalam METER, dan faktor unit hidup dalam matriks letak sahaja.
 * Pelihat 3D menskala model dengan faktor itu, jadi titik yang diketik di
 * sana sudah meter; menukarnya semula di sini ialah pendaraban dua kali.
 *
 * "Skala diukur" ialah semakan yang terbit daripada perjanjian itu: ia patut
 * 1.000, dan apa-apa yang lain bermakna model ini tidak akan padan walau di
 * mana ia diletak.
 */
class ArModelActivity : Activity() {

    private var session: Session? = null
    private lateinit var gl: GLSurfaceView
    private lateinit var overlay: Overlay
    private lateinit var hint: TextView
    private lateinit var readout: TextView
    private lateinit var warn: TextView
    private lateinit var placeBtn: ImageButton
    private lateinit var xrayBtn: ImageButton
    private lateinit var lockBtn: ImageButton
    private lateinit var shotBtn: ImageButton
    private lateinit var flagBtn: ImageButton
    private lateinit var resetBtn: ImageButton
    private lateinit var cutHiRow: View
    private lateinit var cutLoRow: View
    private lateinit var yawRow: View

    private val bg = ArBackground()
    private val mesh = ArModelMesh()

    // ---------- apa yang Pocket hantar ----------
    private var unitF = 1f
    private var need = 2
    private var modelName = ""
    /** Satu penemuan milik satu inspection. Tanpa job terbuka, tanda sisihan
     *  tiada tempat untuk pergi, jadi butangnya kekal mati dan berkata kenapa. */
    private var hasJob = true
    /**
     * Titik tanda, dalam METER ruang model.
     *
     * Pocket menghantarnya begitu dan bukan dalam unit model mentah: pelihat
     * 3D menskala model dengan faktor unit, dan titik yang diketik ialah
     * koordinat DUNIA pelihat. Faktor unit hidup dalam matriks letak sahaja.
     */
    private val marks = ArrayList<FloatArray>()

    // ---------- memuat ----------
    @Volatile private var parsed: Glb.Model? = null
    @Volatile private var loadErr: String? = null
    @Volatile private var uploaded = false

    // ---------- jajaran ----------
    /** Titik dunia yang ditanda, sebagai Anchor supaya ia tidak hanyut. */
    private val anchors = ArrayList<Anchor>()
    @Volatile private var tagged: List<FloatArray> = emptyList()
    @Volatile private var placed = false
    @Volatile private var locked = false
    @Volatile private var yawDeg = 0f
    @Volatile private var rms = 0f
    /**
     * Skala yang diukur daripada titik-titik itu, dan DIGUNAKAN.
     *
     * Dahulu ia dikunci pada 1 dan hanya dilaporkan, yang bermakna unit model
     * mesti betul sebelum apa-apa boleh padan — dan bila ia salah, model
     * mendarat 11 kali terlalu besar dan tiada apa yang boleh dibuat di
     * tapak. Tetapi dua titik pada model dan dua titik di tapak SUDAH
     * menentukan skala; tiada sebab untuk bertanya tentang unit dan kemudian
     * mengabaikan apa yang baru saja diukur.
     *
     * Harganya: dengan dua titik sahaja, satu ketikan yang tersasar
     * meregangkan model dan bukan menaikkan ralat. Tiga atau empat titik
     * mengembalikan semakan itu, kerana satu yang buruk kemudian bercanggah
     * dengan baki yang sepadan.
     */
    @Volatile private var measured = 1f

    /** Letak model: terjemah × yaw × skala-unit, lajur-utama. */
    @Volatile private var model = FloatArray(16)
    @Volatile private var nrmMat = FloatArray(9)
    /** Paras lantai sebenar yang model dijangkar padanya. Semua ketinggian
     *  potong diukur daripada sini dan bukan daripada asalan model. */
    @Volatile private var baseY = 0f

    // ---------- melihat ----------
    @Volatile private var cutHi = Float.MAX_VALUE
    @Volatile private var cutLo = -Float.MAX_VALUE
    @Volatile private var cutHiOn = false
    @Volatile private var cutLoOn = false
    @Volatile private var xray = false
    private val hidden = HashSet<String>()

    // ---------- sisihan ----------
    private class Dev(val world: FloatArray, val m: FloatArray, val n: Int)
    /** Diganti, bukan diubah: benang GL menulis dan benang UI melukis, dan
     *  satu ArrayList yang dikongsi akan pecah di tengah lukisan. */
    @Volatile private var devs: List<Dev> = emptyList()

    // ---------- keadaan AR ----------
    @Volatile private var vp = FloatArray(16)
    @Volatile private var aim: FloatArray? = null
    @Volatile private var ring: FloatArray = FloatArray(0)
    @Volatile private var outlines: List<FloatArray> = emptyList()
    @Volatile private var planeCount = 0
    @Volatile private var tracking = false
    @Volatile private var why = ""
    private var smooth: FloatArray? = null

    @Volatile private var wantPlace = false
    @Volatile private var wantReset = false
    @Volatile private var wantShot = false
    @Volatile private var wantDev = false

    @SuppressLint("SetTextI18n")
    override fun onCreate(st: Bundle?) {
        super.onCreate(st)

        val path = intent.getStringExtra("model").orEmpty()
        runCatching {
            val j = JSONObject(intent.getStringExtra("spec") ?: "{}")
            unitF = j.optDouble("f", 1.0).toFloat().let { if (it > 0f) it else 1f }
            // Satu hingga enam. Dua menyelesaikan yaw dan memberi satu
            // nombor ralat; tiga atau empat boleh menunjukkan titik MANA
            // yang tersilap, kerana satu yang buruk menonjol daripada yang
            // lain.
            need = j.optInt("pins", 2).coerceIn(1, 6)
            modelName = j.optString("name", "")
            hasJob = j.optBoolean("job", true)
            // Kumpulan yang disembunyikan dalam pelihat 3D kekal tersembunyi
            // di sini. Tiada kawalan baharu pada skrin AR: penapis dibuat di
            // tempat ia senang dibuat, dan dibawa masuk.
            j.optJSONArray("hide")?.let { h ->
                for (k in 0 until h.length()) hidden.add(h.optString(k))
            }
            val mk = j.optJSONArray("marks")
            if (mk != null) for (k in 0 until mk.length()) {
                val o = mk.optJSONObject(k) ?: continue
                marks.add(floatArrayOf(
                    o.optDouble("x", 0.0).toFloat(),
                    o.optDouble("y", 0.0).toFloat(),
                    o.optDouble("z", 0.0).toFloat()))
            }
        }
        if (marks.size < need) { bail("Mark $need points on the model first"); return }

        val f = File(path)
        if (!f.exists() || f.length() <= 0L) { bail("The model file did not arrive"); return }

        // Membaca GLB mengambil masa beberapa detik pada model besar. Pada
        // benang utama itu ialah ANR, jadi ia dibaca di sini dan diambil oleh
        // benang GL bila ia siap.
        Thread {
            try { parsed = Glb.read(f) }
            catch (e: GlbError) { loadErr = e.message ?: "The model could not be read" }
            catch (e: OutOfMemoryError) { loadErr = "The model is too large for this phone's memory" }
            catch (e: Throwable) { loadErr = "The model could not be read: ${e.javaClass.simpleName}" }
            runOnUiThread { if (!isFinishing) paintText() }
        }.apply { isDaemon = true }.start()

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
            text = "Reading the model…"
        }
        root.addView(hint, FrameLayout.LayoutParams(-1, -2).apply { gravity = Gravity.TOP })

        val bar = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.argb(205, 0, 0, 0))
            // Pelapik bawah yang lebih besar: bar navigasi sistem duduk di
            // atas tetingkap ini dan memotong baris terakhir.
            setPadding(dp(12), dp(8), dp(12), dp(30))
        }

        warn = TextView(this).apply {
            setTextColor(Color.rgb(255, 214, 102))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
            setPadding(dp(10), dp(7), dp(10), dp(7))
            setBackgroundColor(Color.argb(60, 255, 196, 0))
            visibility = View.GONE
        }
        bar.addView(warn, LinearLayout.LayoutParams(-1, -2))

        readout = TextView(this).apply {
            setTextColor(Color.WHITE)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, dp(5))
        }
        bar.addView(readout, LinearLayout.LayoutParams(-1, -2))

        // Julat potong tetap 0–8 m, dan bukan daripada tinggi model.
        //
        // Tinggi yang dilaporkan datang daripada unit yang dipilih semasa
        // import, dan unit itu boleh salah — skala sebenar hanya diketahui
        // SELEPAS dua titik diletak, yang terlalu lewat untuk membina
        // slider. Lapan meter meliputi dua tingkat, iaitu setakat mana
        // sesiapa memotong.
        val cm = 800

        // Potong dari ATAS: pada nilai maksimum ia tutup, kerana itulah
        // keadaan di mana tiada apa dibuang.
        cutHiRow = row("Cut from top", 0, cm, cm, { v ->
            if (v >= cm) "off" else String.format("%.2f m", v / 100f)
        }) { v ->
            cutHiOn = v < cm
            cutHi = v / 100f
            paintText()
        }
        // Potong dari BAWAH: pada sifar ia tutup.
        cutLoRow = row("Cut from bottom", 0, cm, 0, { v ->
            if (v <= 0) "off" else String.format("%.2f m", v / 100f)
        }) { v ->
            cutLoOn = v > 0
            cutLo = v / 100f
            paintText()
        }
        yawRow = row("Rotate", 0, 360, 0, { v -> "$v°" }) { v ->
            if (!locked) { yawDeg = v.toFloat(); rebuild(); paintText() }
        }
        bar.addView(cutHiRow); bar.addView(cutLoRow); bar.addView(yawRow)
        cutHiRow.visibility = View.GONE
        cutLoRow.visibility = View.GONE
        yawRow.visibility = View.GONE

        // Ikon sahaja, dengan namanya pada tekan lama. Susunan yang sama
        // seperti dua skrin AR yang lain, kerana tiga skrin AR dalam app yang
        // sama tidak sepatutnya kelihatan seperti tiga app.
        placeBtn = ImageButton(this).apply {
            setImageResource(R.drawable.ic_pin)
            setColorFilter(Color.WHITE)
            contentDescription = "Place point"
            scaleType = android.widget.ImageView.ScaleType.CENTER_INSIDE
            background = GradientDrawable().apply {
                cornerRadius = dp(14).toFloat(); setColor(C_PRIMARY)
            }
            setPadding(dp(12), dp(12), dp(12), dp(12))
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) tooltipText = "Place point"
            setOnClickListener { tagPoint() }
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
                setPadding(dp(11), dp(11), dp(11), dp(11))
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) tooltipText = desc
                layoutParams = LinearLayout.LayoutParams(0, dp(52), 1f)
                    .apply { marginStart = dp(4); marginEnd = dp(4); topMargin = dp(9) }
            }

        xrayBtn = icon(R.drawable.ic_eye, "X-ray", C_PLAIN).apply {
            isEnabled = false
            setOnClickListener { xray = !xray; paintText() }
        }
        lockBtn = icon(R.drawable.ic_lock, "Lock", C_PLAIN).apply {
            isEnabled = false
            setOnClickListener {
                locked = !locked
                paintText()
                Toast.makeText(this@ArModelActivity,
                    if (locked) "Model locked" else "Model open", Toast.LENGTH_SHORT).show()
            }
        }
        shotBtn = icon(R.drawable.ic_camera, "Snap", C_SNAP).apply {
            isEnabled = false
            setOnClickListener { wantShot = true; isEnabled = false }
        }
        flagBtn = icon(R.drawable.ic_flag,
            if (hasJob) "Mark deviation" else "Mark deviation — open an inspection first",
            C_DEV).apply {
            isEnabled = false
            setOnClickListener { wantDev = true }
        }
        resetBtn = icon(R.drawable.ic_reset, "Align again", C_PLAIN).apply {
            isEnabled = false
            setOnClickListener { wantReset = true }
        }
        val closeBtn = icon(R.drawable.ic_close, "Exit", C_CLOSE).apply {
            setOnClickListener { askLeave() }
        }
        bar.addView(LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            addView(xrayBtn); addView(lockBtn); addView(shotBtn)
            addView(flagBtn); addView(resetBtn); addView(closeBtn)
        }, LinearLayout.LayoutParams(-1, -2))

        root.addView(bar, FrameLayout.LayoutParams(-1, -2).apply { gravity = Gravity.BOTTOM })
        setContentView(root)
        paintText()
    }

    /**
     * Satu slider dengan nilainya kelihatan. Slider tanpa nombor memberitahu
     * arah tetapi bukan jumlah, dan "potong pada 2.20 m" ialah tepat jenis
     * perkara yang perlu diketahui dan bukan sekadar dirasa.
     */
    private fun row(label: String, min: Int, max: Int, start: Int,
                    fmt: (Int) -> String, onSet: (Int) -> Unit): View {
        val wrap = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
        }
        wrap.addView(TextView(this).apply {
            text = label
            setTextColor(Color.argb(210, 255, 255, 255))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
            width = dp(78)
        })
        val value = TextView(this).apply {
            setTextColor(Color.WHITE)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
            typeface = android.graphics.Typeface.MONOSPACE
            gravity = Gravity.END
            width = dp(56)
            text = fmt(start)
        }
        wrap.addView(SeekBar(this).apply {
            this.max = max - min
            progress = start - min
            setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
                override fun onProgressChanged(s: SeekBar?, p: Int, fromUser: Boolean) {
                    value.text = fmt(p + min); onSet(p + min)
                }
                override fun onStartTrackingTouch(s: SeekBar?) {}
                override fun onStopTrackingTouch(s: SeekBar?) {}
            })
        }, LinearLayout.LayoutParams(0, -2, 1f))
        wrap.addView(value)
        return wrap
    }

    private fun dp(v: Int): Int =
        TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics).toInt()

    private fun bail(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
        setResult(RESULT_CANCELED, Intent().putExtra("error", msg))
        finish()
    }

    private fun tagPoint() {
        if (aim == null) {
            Toast.makeText(this, "No surface at the centre of the screen yet", Toast.LENGTH_SHORT).show()
            return
        }
        wantPlace = true
    }

    /**
     * Sisihan yang ditanda hilang kalau skrin ditutup tanpa dihantar balik,
     * jadi ia ditanya dahulu — tetapi hanya apabila ada sesuatu untuk hilang.
     */
    private fun askLeave() {
        if (devs.isEmpty()) { finishWith(); return }
        android.app.AlertDialog.Builder(this)
            .setMessage("${devs.size} deviations marked. Save them as findings?")
            .setPositiveButton("Save") { _, _ -> finishWith() }
            .setNegativeButton("Discard") { _, _ ->
                devs = emptyList(); finishWith()
            }
            .setNeutralButton("Back", null)
            .show()
    }

    @Suppress("DEPRECATION", "MissingSuperCall")
    override fun onBackPressed() { askLeave() }

    private fun finishWith() {
        val sb = StringBuilder("[")
        devs.forEachIndexed { i, d ->
            if (i > 0) sb.append(',')
            // Meter ruang model — ruang yang sama dengan titik tanda, jadi
            // penemuan boleh dibandingkan dengan pelihat 3D nanti.
            sb.append("{\"mx\":").append(d.m[0])
                .append(",\"my\":").append(d.m[1])
                .append(",\"mz\":").append(d.m[2]).append('}')
        }
        sb.append(']')
        // NaN melintasi ke JavaScript sebagai token yang bukan nombor dan
        // memecahkan panggilan itu sepenuhnya, jadi ia dihentikan di sini.
        setResult(RESULT_OK, Intent()
            .putExtra("devs", sb.toString())
            .putExtra("rms", if (rms.isFinite()) rms else 0f)
            .putExtra("scale", if (measured.isFinite()) measured else 1f))
        finish()
    }

    // ---------- kitaran hayat ----------

    private var resumed = false

    override fun onResume() {
        super.onResume()
        if (isFinishing) return
        if (session == null) {
            session = try {
                Session(this).also { s ->
                    s.configure(Config(s).apply {
                        planeFindingMode = Config.PlaneFindingMode.HORIZONTAL_AND_VERTICAL
                        updateMode = Config.UpdateMode.LATEST_CAMERA_IMAGE
                        focusMode = Config.FocusMode.AUTO
                        // Setiap ciri yang dihidupkan ialah kerja setiap
                        // bingkai, dan kerja setiap bingkai ialah ketaran.
                        depthMode = Config.DepthMode.DISABLED
                        instantPlacementMode = Config.InstantPlacementMode.DISABLED
                        lightEstimationMode = Config.LightEstimationMode.DISABLED
                        cloudAnchorMode = Config.CloudAnchorMode.DISABLED
                    })
                }
            } catch (e: Throwable) {
                bail("AR could not start: ${e.javaClass.simpleName}"); return
            }
        }
        try { session?.resume(); resumed = true }
        catch (e: CameraNotAvailableException) {
            session = null; bail("Camera not available for AR"); return
        }
        gl.onResume()
    }

    override fun onPause() {
        super.onPause()
        if (resumed) { gl.onPause(); session?.pause(); resumed = false }
    }

    override fun onDestroy() {
        super.onDestroy()
        anchors.forEach { runCatching { it.detach() } }
        anchors.clear()
        runCatching { session?.close() }
        session = null
        parsed = null
    }

    // ---------- matematik jajaran (port daripada Pocket) ----------

    private fun yawApply(p: FloatArray, c: Float, s: Float) =
        floatArrayOf(p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c)

    private fun placePt(p: FloatArray, yaw: Float, t: FloatArray, sc: Float): FloatArray {
        val r = yawApply(floatArrayOf(p[0] * sc, p[1] * sc, p[2] * sc), cos(yaw), sin(yaw))
        return floatArrayOf(r[0] + t[0], r[1] + t[1], r[2] + t[2])
    }

    /**
     * Di mana model SEBENARNYA meletakkan sudut yang ditanda ke-i.
     *
     * Jurang antara ini dan titik yang surveyor tanda di tapak ialah ralat
     * jajaran, satu sudut pada satu masa. Satu nombor RMS memberitahu bahawa
     * ada sesuatu tidak kena; garis yang dilukis di sini memberitahu sudut
     * MANA, dan ke arah mana ia tersasar — itulah jawapan kepada "model ini
     * nampak lari".
     */
    private fun placedMark(i: Int): FloatArray {
        val yaw = Math.toRadians(yawDeg.toDouble()).toFloat()
        return placePt(marks[i], yaw, floatArrayOf(model[12], model[13], model[14]), measured)
    }

    /** Arah bertentangan: satu titik dunia balik kepada ruang model. */
    private fun unplace(w: FloatArray): FloatArray {
        val yaw = Math.toRadians(yawDeg.toDouble()).toFloat()
        val d = floatArrayOf(w[0] - model[12], w[1] - model[13], w[2] - model[14])
        val r = yawApply(d, cos(-yaw), sin(-yaw))
        val sc = if (measured > 1e-6f) measured else 1f
        return floatArrayOf(r[0] / sc, r[1] / sc, r[2] / sc)
    }

    /**
     * Satu titik menyelesaikan kedudukan sepenuhnya tetapi bukan arah.
     *
     * Di sinilah model 3D berbeza daripada pelan 2D. Pelan tiada ketinggian,
     * jadi tinggi terpaksa dilaras tangan. Titik pada model membawa X, Y dan
     * Z sekali, jadi satu titik sudah cukup untuk kedudukan; yang tinggal
     * hanyalah yaw, dan itulah gunanya slider Putar.
     */
    private fun solveOne(m: FloatArray, w: FloatArray) {
        val yaw = Math.toRadians(yawDeg.toDouble()).toFloat()
        // Satu titik tidak boleh mengukur skala, jadi unit model mesti betul
        // dalam mod ini — itulah satu-satunya tempat ia masih penting.
        val r = yawApply(m, cos(yaw), sin(yaw))
        setPlacement(yaw, floatArrayOf(w[0] - r[0], w[1] - r[1], w[2] - r[2]), 1f)
        rms = 0f; measured = 1f
    }

    /**
     * Dua titik atau lebih: yaw diselesaikan, dan lebihannya menjadi nombor
     * ralat. 18 mm bermakna pilihan awak bersetuju; 300 mm bermakna satu
     * daripadanya tersilap — dan awak tahu sebelum berjalan keliling
     * bangunan.
     *
     * Dengan dua titik, ralat hanya boleh berkata bahawa kedua-duanya tidak
     * bersetuju. Dengan tiga atau empat ia boleh menunjukkan yang MANA,
     * kerana satu titik yang buruk menonjol daripada baki yang sepadan.
     */
    private fun solveMany(pairs: List<Pair<FloatArray, FloatArray>>): Boolean {
        if (pairs.size < 2) return false
        val mc = mean(pairs.map { it.first })
        val wc = mean(pairs.map { it.second })
        var num = 0f; var den = 0f; var sm = 0f; var sw = 0f
        for ((m, w) in pairs) {
            val ax = m[0] - mc[0]; val az = m[2] - mc[2]
            val bx = w[0] - wc[0]; val bz = w[2] - wc[2]
            // Memaksimumkan c·A + s·B, dengan R(x,z) = (xc+zs, -xs+zc).
            // Tandanya penting: yang songsang lulus pada 0° dan 180° tetapi
            // memulangkan yaw bercermin pada setiap arah lain.
            num += az * bx - ax * bz
            den += ax * bx + az * bz
            sm += hypot(ax, az)
            sw += hypot(bx, bz)
        }
        if (abs(num) < 1e-12f && abs(den) < 1e-12f) return false   // titik bertindih
        // Terlalu rapat untuk mengukur apa-apa. Dua titik 10 cm berjauhan di
        // tapak memberi skala yang ditentukan oleh ralat ARCore sahaja, dan
        // meregangkan seluruh bangunan mengikutnya.
        if (sm < 1e-4f || sw < 0.25f) return false
        val yaw = atan2(num, den)
        val sc = (sw / sm).coerceIn(1e-4f, 1e4f)
        measured = sc
        val r = yawApply(floatArrayOf(mc[0] * sc, mc[1] * sc, mc[2] * sc), cos(yaw), sin(yaw))
        val t = floatArrayOf(wc[0] - r[0], wc[1] - r[1], wc[2] - r[2])
        setPlacement(yaw, t, sc)
        var sq = 0f
        for ((m, w) in pairs) {
            val p = placePt(m, yaw, t, sc)
            val dx = p[0] - w[0]; val dy = p[1] - w[1]; val dz = p[2] - w[2]
            sq += dx * dx + dy * dy + dz * dz
        }
        rms = sqrt(sq / pairs.size)
        return true
    }

    private fun mean(l: List<FloatArray>): FloatArray {
        val o = FloatArray(3)
        for (p in l) { o[0] += p[0]; o[1] += p[1]; o[2] += p[2] }
        val n = l.size.coerceAtLeast(1)
        return floatArrayOf(o[0] / n, o[1] / n, o[2] / n)
    }

    /** Terjemah × yaw × (skala-unit × skala-diukur), lajur-utama untuk GL. */
    private fun setPlacement(yaw: Float, t: FloatArray, sc: Float) {
        yawDeg = ((Math.toDegrees(yaw.toDouble()) + 360.0) % 360.0).toFloat()
        val c = cos(yaw); val s = sin(yaw); val f = unitF * sc
        model = floatArrayOf(
            f * c, 0f, -f * s, 0f,
            0f, f, 0f, 0f,
            f * s, 0f, f * c, 0f,
            t[0], t[1], t[2], 1f)
        nrmMat = floatArrayOf(c, 0f, -s, 0f, 1f, 0f, s, 0f, c)
    }

    /** Dipanggil apabila slider Putar bergerak dalam mod satu titik. */
    private fun rebuild() {
        if (!placed || need != 1) return
        val w = tagged.firstOrNull() ?: return
        solveOne(marks[0], w)
    }

    // ---------- teks ----------

    private fun fmtMm(m: Float): String {
        val mm = m * 1000f
        return if (mm < 1000f) "${Math.round(mm)} mm" else String.format("%.2f m", m)
    }

    @SuppressLint("SetTextI18n")
    private fun paintText() {
        val err = loadErr
        if (err != null && !isFinishing) { bail(err); return }
        val ready = parsed != null || uploaded

        placeBtn.isEnabled = ready && !placed && aim != null
        placeBtn.alpha = if (placeBtn.isEnabled) 1f else 0.3f
        placeBtn.visibility = if (placed) View.GONE else View.VISIBLE
        for (b in listOf(xrayBtn, lockBtn, shotBtn)) b.isEnabled = placed
        flagBtn.isEnabled = placed && hasJob
        // Jajar semula mesti hidup sebaik titik pertama ditanda. Tanpa ini,
        // satu titik yang tersalah letak tidak boleh dibuang sama sekali.
        resetBtn.isEnabled = placed || tagged.isNotEmpty()
        for (b in listOf(xrayBtn, lockBtn, shotBtn, flagBtn, resetBtn)) {
            b.alpha = if (b.isEnabled) 1f else 0.3f
        }
        lockBtn.setImageResource(if (locked) R.drawable.ic_unlock else R.drawable.ic_lock)
        lockBtn.setColorFilter(if (locked) C_LOCKED else C_PLAIN)
        lockBtn.contentDescription = if (locked) "Unlock" else "Lock"
        xrayBtn.setColorFilter(if (xray) C_XRAY else C_PLAIN)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            lockBtn.tooltipText = lockBtn.contentDescription
        }
        // Kawalan melihat tiada makna sebelum ada apa-apa untuk dilihat, dan
        // setiap baris yang disembunyikan ialah kanvas kamera yang dikembalikan.
        cutHiRow.visibility = if (placed) View.VISIBLE else View.GONE
        cutLoRow.visibility = if (placed) View.VISIBLE else View.GONE
        yawRow.visibility = if (placed && need == 1) View.VISIBLE else View.GONE

        readout.text = when {
            !ready -> "Reading the model…"
            !placed -> modelName.ifBlank { "Model 3D" } +
                " · ${tagged.size}/$need points on site"
            need >= 2 -> "Match error ${fmtMm(rms)} · $need points · model scaled " +
                (if (measured >= 1f) String.format("%.2f×", measured)
                 else String.format("1/%.1f", 1f / measured))
            else -> "One point · rotate ${Math.round(yawDeg)}°"
        }

        hint.text = when {
            !ready -> "Reading the model… a large file takes a few seconds."
            !tracking && why.isNotEmpty() -> why
            !tracking -> "Move the phone slowly so ARCore can see the surface…"
            locked -> "Model locked. Tap the yellow padlock to adjust it again."
            placed && !hasJob ->
                "Model placed. Marking deviations is off — open an inspection first."
            placed && need >= 2 -> "Model placed. Cut at eye level to step inside it."
            placed -> "Model placed. Rotate it until it lines up with the building."
            planeCount == 0 ->
                "No surface yet. Move the phone LEFT and RIGHT slowly, " +
                "aim at a floor with texture."
            aim == null -> "$planeCount surfaces found · aim the circle at a blue area"
            tagged.isEmpty() ->
                "Stand at the corner you marked as point 1 of $need, " +
                "aim at it, tap the blue button"
            else -> "Now the corner for point ${tagged.size + 1} of $need · tap the blue button"
        }

        // Dua potongan yang bertindih bukan ralat, tetapi ia bermakna skrin
        // kosong — dan skrin kosong tanpa sebab kelihatan seperti bug.
        val clash = placed && cutHiOn && cutLoOn && cutLo >= cutHi
        val bad = placed && need >= 2 && rms > 0.12f
        warn.visibility = if (clash || bad) View.VISIBLE else View.GONE
        warn.text = when {
            clash -> "The bottom cut is above the top cut — nothing is " +
                "left to see. Lower the bottom cut."
            else -> "Match error ${fmtMm(rms)} — one corner may be the wrong one. " +
                "Tap ↻ and try corners further apart" +
                (if (need < 3) ", or use three points so the wrong one stands out." else ".")
        }
        overlay.postInvalidate()
    }

    // ---------- lapisan 2D ----------

    inner class Overlay(ctx: android.content.Context) : View(ctx) {
        private val dot = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.rgb(255, 196, 0) }
        private val hoop = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(3).toFloat()
            color = Color.argb(120, 255, 255, 255)
        }
        private val aimEdge = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(3).toFloat()
            color = Color.rgb(255, 196, 0)
        }
        private val aimFill = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL; color = Color.argb(60, 255, 196, 0)
        }
        private val devPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = C_DEV }
        private val fitDot = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = C_XRAY }
        private val fitLine = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(2).toFloat(); color = C_XRAY
        }
        private val lbl = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.WHITE; textSize = dp(13).toFloat(); textAlign = Paint.Align.CENTER
        }
        private val lblBg = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.argb(195, 0, 0, 0) }
        private val planeFill = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL; color = Color.argb(34, 90, 170, 255)
        }
        private val planeEdge = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(2).toFloat()
            color = Color.argb(140, 120, 190, 255)
        }
        private val path = android.graphics.Path()
        private val out = FloatArray(4)

        private fun toScreen(p: FloatArray): FloatArray? {
            val m = vp
            out[0] = m[0]*p[0] + m[4]*p[1] + m[8]*p[2] + m[12]
            out[1] = m[1]*p[0] + m[5]*p[1] + m[9]*p[2] + m[13]
            out[2] = m[2]*p[0] + m[6]*p[1] + m[10]*p[2] + m[14]
            out[3] = m[3]*p[0] + m[7]*p[1] + m[11]*p[2] + m[15]
            if (out[3] <= 0.0001f) return null
            return floatArrayOf(
                (out[0] / out[3] * 0.5f + 0.5f) * width,
                (1f - (out[1] / out[3] * 0.5f + 0.5f)) * height)
        }

        override fun onDraw(c: Canvas) {
            val cx = width / 2f
            val cy = height / 2f

            // Satah hanya sebelum model mendarat. Selepas itu ia hanya
            // menghalang pandangan terhadap benda yang kita datang nak lihat.
            if (!placed) {
                for (poly in outlines) {
                    val n = poly.size / 3
                    if (n < 3) continue
                    path.reset()
                    var started = false
                    for (k in 0 until n) {
                        val sp = toScreen(floatArrayOf(
                            poly[k*3], poly[k*3+1], poly[k*3+2])) ?: continue
                        if (!started) { path.moveTo(sp[0], sp[1]); started = true }
                        else path.lineTo(sp[0], sp[1])
                    }
                    if (!started) continue
                    path.close()
                    c.drawPath(path, planeFill)
                    c.drawPath(path, planeEdge)
                }
            }

            // Reticle. Cincin yang dilukis dalam satah itu condong bersamanya,
            // jadi bentuknya sendiri ialah jawapan kepada "ia nampak satah tak".
            val rg = ring
            var drew = false
            if (rg.size >= 9) {
                path.reset()
                var started = false
                var k = 0
                while (k + 2 < rg.size) {
                    val sp = toScreen(floatArrayOf(rg[k], rg[k+1], rg[k+2]))
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
            if (!drew) c.drawCircle(cx, cy, dp(13).toFloat(), hoop)
            c.drawCircle(cx, cy, dp(3).toFloat(), dot)

            // Titik jajaran, supaya jelas sudut mana yang sudah ditanda.
            //
            // Selepas model mendarat, setiap satu dipasangkan dengan tempat
            // model SEBENARNYA meletakkan sudut itu. Garis antara keduanya
            // ialah ralat, dilukis — dan jaraknya dalam mm di sebelahnya.
            // Satu nombor RMS berkata "ada yang tidak kena"; ini berkata
            // sudut mana, dan ke arah mana.
            val list = tagged
            for (i in list.indices) {
                val sp = toScreen(list[i]) ?: continue
                c.drawCircle(sp[0], sp[1], dp(7).toFloat(), dot)
                if (!placed || i >= marks.size) {
                    tag(c, sp[0], sp[1] - dp(20), "Point ${i + 1}")
                    continue
                }
                val mw = placedMark(i)
                val mp = toScreen(mw)
                val gap = dist(mw, list[i])
                if (mp != null && gap > 0.02f) {
                    c.drawLine(sp[0], sp[1], mp[0], mp[1], fitLine)
                    c.drawCircle(mp[0], mp[1], dp(5).toFloat(), fitDot)
                }
                tag(c, sp[0], sp[1] - dp(20),
                    "Point ${i + 1} · " + if (gap < 1f) "${Math.round(gap * 1000)} mm"
                                          else String.format("%.2f m", gap))
            }

            // Sisihan yang ditanda.
            for (d in devs) {
                val sp = toScreen(d.world) ?: continue
                c.drawCircle(sp[0], sp[1], dp(7).toFloat(), devPaint)
                tag(c, sp[0], sp[1] - dp(20), "S${d.n}")
            }
        }

        private fun tag(c: Canvas, x: Float, y: Float, text: String) {
            val w = lbl.measureText(text) + dp(12)
            val h = dp(21).toFloat()
            c.drawRoundRect(x - w/2, y - h/2, x + w/2, y + h/2,
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
            session?.setDisplayGeometry(windowManager.defaultDisplay.rotation, w, h)
        }

        override fun onDrawFrame(g: GL10?) {
            GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT or GLES20.GL_DEPTH_BUFFER_BIT)
            val s = session ?: return
            s.setCameraTextureName(bg.textureId)

            val frame: Frame = try { s.update() } catch (e: Throwable) { return }
            bg.draw(frame)

            // Muat naik ke GPU berlaku di sini, bukan pada benang pembaca:
            // penimbal GL hanya wujud dalam konteks ini.
            if (!uploaded) {
                parsed?.let { m ->
                    runCatching { mesh.create(m) }
                        .onSuccess { uploaded = true; parsed = null }
                        .onFailure { loadErr = "The model could not be loaded onto the GPU" }
                    runOnUiThread { paintText() }
                }
            }

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
                if (aim != null) { aim = null; overlay.postInvalidateOnAnimation() }
                return
            }

            // Jauh 300 m, bukan 100: satu model bangunan dilihat dari hujung
            // tapak akan terpotong pada 100.
            cam.getProjectionMatrix(proj, 0, 0.05f, 300f)
            cam.getViewMatrix(view, 0)
            Matrix.multiplyMM(mul, 0, proj, 0, view, 0)
            vp = mul.copyOf()

            var hit: HitResult? = null
            var found: FloatArray? = null
            try {
                // Satah SAHAJA. Titik ciri dan titik kedalaman juga
                // memulangkan hit, tetapi kedudukannya berubah beberapa
                // sentimeter setiap bingkai dan kursor yang mengikutinya
                // bergegar sepanjang masa.
                val hits = frame.hitTest(gl.width / 2f, gl.height / 2f).filter {
                    val t = it.trackable
                    t is Plane && t.isPoseInPolygon(it.hitPose) &&
                        t.trackingState == TrackingState.TRACKING
                }
                // Selepas titik pertama, terima hanya satah pada ketinggian
                // yang lebih kurang sama: dua sudut jajaran berada pada
                // lantai yang sama, dan tanpa ini kursor melompat ke meja.
                val firstY = tagged.firstOrNull()?.get(1)
                hit = if (firstY == null) hits.firstOrNull()
                      else hits.firstOrNull { abs(it.hitPose.ty() - firstY) < 0.12f }
                          ?: hits.firstOrNull()
                hit?.let { found = floatArrayOf(it.hitPose.tx(), it.hitPose.ty(), it.hitPose.tz()) }
            } catch (e: Throwable) { /* bingkai ini tiada hit */ }

            // Tapis lulus-rendah: walaupun dengan satah sahaja, hit berubah
            // sedikit setiap bingkai, dan pada 30 bingkai sesaat getaran kecil
            // itulah yang membuat skrin memeningkan. Lompatan besar dibiarkan
            // lalu — itu permukaan lain, bukan bunyi.
            val raw = found
            if (raw == null) smooth = null
            else {
                val sm = smooth
                smooth = if (sm == null || dist(sm, raw) > 0.35f) raw.copyOf()
                else floatArrayOf(
                    sm[0] + (raw[0] - sm[0]) * SMOOTH,
                    sm[1] + (raw[1] - sm[1]) * SMOOTH,
                    sm[2] + (raw[2] - sm[2]) * SMOOTH)
            }
            val shown = smooth

            ring = if (hit == null || shown == null || raw == null) FloatArray(0) else {
                val po = hit.hitPose
                val dx = shown[0] - raw[0]; val dy = shown[1] - raw[1]; val dz = shown[2] - raw[2]
                val n = 28; val r = 0.05f
                val w = FloatArray(n * 3)
                for (k in 0 until n) {
                    val a = (k.toFloat() / n) * 6.2831855f
                    val wp = po.transformPoint(floatArrayOf(r * cos(a), 0f, r * sin(a)))
                    w[k*3] = wp[0] + dx; w[k*3+1] = wp[1] + dy; w[k*3+2] = wp[2] + dz
                }
                w
            }

            val had = aim != null
            aim = shown
            var changed = false

            // Anchor dicipta di sini dan bukan dalam pengendali butang: satu
            // HitResult hanya sah sehingga update() berikutnya.
            if (wantPlace) {
                wantPlace = false
                if (!placed && uploaded) hit?.let { h ->
                    runCatching { h.trackable.createAnchor(h.hitPose) }.onSuccess { an ->
                        anchors.add(an); changed = true
                    }
                }
            }
            if (wantReset) {
                wantReset = false
                anchors.forEach { runCatching { it.detach() } }
                anchors.clear()
                devs = emptyList()
                placed = false; locked = false; rms = 0f; measured = 1f
                changed = true
            }
            if (wantDev) {
                wantDev = false
                val w = shown
                if (placed && w != null) {
                    devs = devs + Dev(w.copyOf(), unplace(w), devs.size + 1)
                    changed = true
                    runOnUiThread {
                        Toast.makeText(this@ArModelActivity,
                            "Deviation S${devs.size} marked", Toast.LENGTH_SHORT).show()
                    }
                } else if (w == null) {
                    runOnUiThread {
                        Toast.makeText(this@ArModelActivity,
                            "Find a surface first", Toast.LENGTH_SHORT).show()
                    }
                }
            }

            // Pose segar setiap bingkai: itulah sebabnya anchor digunakan.
            // Model dijajar semula daripadanya setiap bingkai sehingga ia
            // dikunci, jadi ia mengikut ARCore memperbaik anggarannya dan
            // bukan hanyut menjauhi bangunan.
            val fresh = ArrayList<FloatArray>(anchors.size)
            val prev = tagged
            anchors.forEachIndexed { i, an ->
                if (an.trackingState == TrackingState.TRACKING) {
                    val po = an.pose
                    fresh.add(floatArrayOf(po.tx(), po.ty(), po.tz()))
                } else if (i < prev.size) fresh.add(prev[i])
                else fresh.add(floatArrayOf(0f, 0f, 0f))
            }
            tagged = fresh

            if (fresh.size >= need && uploaded) {
                if (!locked) {
                    val okSolve = if (need >= 2) {
                        solveMany((0 until need).map { marks[it] to fresh[it] })
                    } else { solveOne(marks[0], fresh[0]); true }
                    if (okSolve) {
                        baseY = fresh[0][1]
                        if (!placed) { placed = true; changed = true }
                    } else if (!placed) {
                        // Titik yang bertindih tidak menentukan arah mahupun
                        // skala.
                        anchors.forEach { runCatching { it.detach() } }
                        anchors.clear(); tagged = emptyList()
                        changed = true
                        runOnUiThread {
                            Toast.makeText(this@ArModelActivity,
                                "Those points are too close together to measure scale — " +
                                "try corners further apart",
                                Toast.LENGTH_LONG).show()
                        }
                    }
                }
            }

            // Apa yang ARCore nampak, dikumpul untuk dilukis.
            if (!placed) {
                val outs = ArrayList<FloatArray>()
                var nPlane = 0
                try {
                    for (pl in s.getAllTrackables(Plane::class.java)) {
                        if (pl.trackingState != TrackingState.TRACKING) continue
                        if (pl.subsumedBy != null) continue
                        nPlane++
                        val poly = pl.polygon ?: continue
                        val n = poly.limit() / 2
                        if (n < 3) continue
                        val pose = pl.centerPose
                        val w = FloatArray(n * 3)
                        for (i in 0 until n) {
                            val wp = pose.transformPoint(
                                floatArrayOf(poly.get(i*2), 0f, poly.get(i*2+1)))
                            w[i*3] = wp[0]; w[i*3+1] = wp[1]; w[i*3+2] = wp[2]
                        }
                        outs.add(w)
                    }
                } catch (e: Throwable) { /* satah berubah di bawah kita */ }
                outlines = outs
                if (planeCount != nPlane) { planeCount = nPlane; changed = true }
            }

            // Model, dalam bingkai ini. Potongan diukur daripada lantai
            // sebenar yang model dijangkar padanya, bukan daripada asalan
            // model — "potong pada paras mata" hanya bermakna begitu.
            if (placed && mesh.ready) {
                mesh.draw(vp, model, nrmMat,
                    if (cutHiOn) baseY + cutHi else Float.MAX_VALUE,
                    if (cutLoOn) baseY + cutLo else -Float.MAX_VALUE,
                    if (xray) 0.32f else 1f,
                    hidden)
            }

            if (wantShot) {
                wantShot = false
                val bmp = ArShot.capture(gl.width, gl.height)
                val name = "goxpert-model-" + System.currentTimeMillis() + ".jpg"
                val okSave = bmp != null &&
                    runCatching { ArShot.save(this@ArModelActivity, bmp, name) }
                        .getOrDefault(false)
                bmp?.recycle()
                runOnUiThread {
                    Toast.makeText(this@ArModelActivity,
                        if (okSave) "Saved to gallery" else "Could not save the photo",
                        Toast.LENGTH_SHORT).show()
                    shotBtn.isEnabled = placed
                    paintText()
                }
            }

            if (changed || had != (shown != null)) runOnUiThread { paintText() }
            overlay.postInvalidateOnAnimation()
        }
    }

    private fun dist(a: FloatArray, b: FloatArray): Float {
        val dx = a[0]-b[0]; val dy = a[1]-b[1]; val dz = a[2]-b[2]
        return sqrt(dx*dx + dy*dy + dz*dz)
    }

    companion object {
        private const val C_PRIMARY = 0xFF2563EB.toInt()
        private const val C_PLAIN = 0xFFD6DEE6.toInt()
        private const val C_SNAP = 0xFFFFFFFF.toInt()
        private const val C_LOCKED = 0xFFFFC400.toInt()
        private const val C_XRAY = 0xFF22D3EE.toInt()
        private const val C_DEV = 0xFFFF9F43.toInt()
        private const val C_CLOSE = 0xFFFF7A7A.toInt()

        /** Berapa banyak setiap bingkai menggerakkan kursor ke arah hit
         *  mentah. Rendah bermakna tenang tetapi lambat. */
        private const val SMOOTH = 0.28f
    }
}
