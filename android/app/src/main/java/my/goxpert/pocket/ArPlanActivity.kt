package my.goxpert.pocket

import android.annotation.SuppressLint
import android.app.Activity
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import android.content.ContentValues
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.widget.Button
import android.widget.FrameLayout
import android.graphics.drawable.GradientDrawable
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
import kotlin.math.cos
import kotlin.math.hypot
import kotlin.math.sin
import kotlin.math.sqrt

/**
 * Pelan lantai dihamparkan pada tapak sebenar, di dalam app.
 *
 * Versi web melukis pelan sebagai mesh bertekstur dalam Three.js di atas
 * sesi WebXR. Tiada satu pun daripada itu wujud dalam WebView, tetapi
 * hamparan itu sendiri tidak memerlukan enjin 3D: pelan ialah satu segi
 * empat rata, jadi ia empat bucu, satu tekstur dan satu jalur segi tiga.
 * Itu dilukis dalam bingkai GL yang sama dengan imej kamera — lihat
 * ArPlanQuad untuk sebab mengapa lapisan 2D tidak mencukupi di sini.
 *
 * Benda kecil — kursor, titik yang diletak — kekal pada lapisan 2D, di mana
 * jurang satu bingkai terlalu halus untuk dilihat.
 *
 * Matematik jajaran ialah port langsung fungsi fpFrom1/fpFrom2/fpMap dalam
 * Pocket, supaya pelan duduk di tempat yang sama sama ada ia dibuka di sini
 * atau dalam Chrome.
 */
class ArPlanActivity : Activity() {

    private var session: Session? = null
    private lateinit var gl: GLSurfaceView
    private lateinit var overlay: Overlay
    private lateinit var hint: TextView
    private lateinit var readout: TextView
    private lateinit var placeBtn: Button
    private lateinit var resetBtn: ImageButton
    private lateinit var lockBtn: ImageButton
    private lateinit var shotBtn: ImageButton
    private lateinit var flipBtn: ImageButton
    private lateinit var warn: TextView

    private val bg = ArBackground()
    private val planGl = ArPlanQuad()
    @Volatile private var glReady = false

    /** Dikunci: pelan berhenti dibina semula, jadi tiada slider, anchor
     *  atau ketikan yang terlepas boleh mengalihkannya. */
    @Volatile private var locked = false

    private var plan: Bitmap? = null
    private var planW = 0f
    private var planH = 0f
    private var mode = "floor"
    private var twoPin = false
    private var au = 0f; private var av = 0f      // pin A dalam piksel pelan
    private var bu = 0f; private var bv = 0f

    /** Titik dunia yang dipilih, sebagai Anchor supaya ia tidak hanyut. */
    private val anchors = ArrayList<Anchor>()

    @Volatile private var vp = FloatArray(16)
    @Volatile private var aim: FloatArray? = null
    @Volatile private var ring: FloatArray = FloatArray(0)
    @Volatile private var quad: FloatArray = FloatArray(0)   // 4 bucu dunia

    /**
     * Garis tegak dari setiap bucu pelan turun ke satah yang dikesan.
     *
     * Slider tinggi mengangkat pelan, tetapi pelan yang terapung di udara
     * kelihatan sama seperti pelan yang duduk di lantai apabila dilihat dari
     * atas — tiada apa pada skrin yang berkata berapa jauh ia naik. Garis
     * ini ialah jarak itu, dilukis.
     */
    @Volatile private var drops: FloatArray = FloatArray(0)
    @Volatile private var baseY = 0f
    @Volatile private var tracking = false
    @Volatile private var why = ""
    @Volatile private var planeCount = 0

    private var smooth: FloatArray? = null
    @Volatile private var wantPlace = false
    @Volatile private var wantReset = false
    @Volatile private var wantShot = false

    /** Laras selepas pelan diletak. */
    @Volatile private var opacity = 0.65f
    @Volatile private var lift = 0f          // tinggi (lantai) atau dalam (dinding)
    @Volatile private var theta = 0f         // putaran, mod satu pin sahaja
    @Volatile private var mPerPx = 0f        // skala, mod satu pin sahaja
    @Volatile private var flip = false

    @SuppressLint("SetTextI18n")
    override fun onCreate(st: Bundle?) {
        super.onCreate(st)

        val path = intent.getStringExtra("plan").orEmpty()
        plan = runCatching { BitmapFactory.decodeFile(path) }.getOrNull()
        if (plan == null) { bail("Pelan tidak dapat dibaca"); return }

        runCatching {
            val j = JSONObject(intent.getStringExtra("spec") ?: "{}")
            planW = j.optDouble("W", plan!!.width.toDouble()).toFloat()
            planH = j.optDouble("H", plan!!.height.toDouble()).toFloat()
            mode = j.optString("mode", "floor")
            twoPin = j.optInt("pins", 1) >= 2
            au = (j.optDouble("au", 50.0) / 100.0).toFloat() * planW
            av = (j.optDouble("av", 50.0) / 100.0).toFloat() * planH
            bu = (j.optDouble("bu", 50.0) / 100.0).toFloat() * planW
            bv = (j.optDouble("bv", 50.0) / 100.0).toFloat() * planH
        }
        if (planW <= 0f || planH <= 0f) { bail("Saiz pelan tidak sah"); return }
        // Lebar 10 m ialah teka-teka pertama yang munasabah untuk satu bilik;
        // mod satu pin membiarkan ia dilaras.
        mPerPx = 10f / planW

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
            setPadding(0, 0, 0, dp(6))
        }
        bar.addView(readout, LinearLayout.LayoutParams(-1, -2))

        // Lut sinar: pelan mesti boleh dilihat menembusi untuk dibandingkan
        // dengan apa yang sebenarnya ada di sana.
        bar.addView(row("Lut sinar", 20, 95, 65, { v -> "$v%" }) { v ->
            opacity = v / 100f; paintText(); overlay.postInvalidate()
        })
        bar.addView(row(if (mode == "wall") "Dalam" else "Tinggi", 0, 100, 50,
            { v -> String.format("%+.2f m", (v - 50) / 100f * 2f) }) { v ->
            if (locked) return@row
            lift = (v - 50) / 100f * 2f      // -1 m .. +1 m
            rebuild(); paintText()
        })
        if (!twoPin) {
            bar.addView(row("Putar", 0, 360, 0, { v -> "$v\u00b0" }) { v ->
                if (!locked) { theta = v.toFloat(); rebuild(); paintText() }
            })
            // Turun ke 10 cm: pelan satu bilik kecil, keratan rentas, atau
            // lakaran kecacatan semuanya jauh lebih kecil daripada satu meter,
            // dan had lama pada 1 m menjadikannya tidak boleh dijajarkan.
            bar.addView(row("Skala", 1, 400, 100,
                { v -> val m = 10f * (v / 100f)
                       if (m < 1f) String.format("%.0f cm", m * 100) else String.format("%.1f m", m) }) { v ->
                if (!locked) { mPerPx = (10f * (v / 100f)) / planW; rebuild(); paintText() }
            })
        }

        // Ikon sahaja, dalam bulatan, setiap satu dengan warnanya sendiri.
        //
        // Warna ialah apa yang menjadikan ikon boleh dibaca sepintas lalu:
        // lima bentuk kelabu yang serupa memerlukan pembacaan, lima warna
        // berbeza tidak. Merah ialah keluar, kuning ialah dikunci, sian ialah
        // tindakan yang paling kerap diperlukan.
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
                // Tekan lama menamakannya, untuk bentuk yang belum dikenali.
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) tooltipText = desc
                layoutParams = LinearLayout.LayoutParams(0, dp(54), 1f)
                    .apply { marginStart = dp(5); marginEnd = dp(5); topMargin = dp(10) }
            }

        placeBtn = Button(this).apply {
            isAllCaps = false
            maxLines = 1
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 15f)
            setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_pin, 0, 0, 0)
            compoundDrawablePadding = dp(8)
            setOnClickListener { wantPlace = true }
            layoutParams = LinearLayout.LayoutParams(-1, dp(52))
                .apply { topMargin = dp(7) }
        }
        bar.addView(placeBtn)

        // Cermin duduk pertama kerana ia jawapan kepada soalan yang paling
        // kerap: jajaran dua titik menetapkan satu garis, bukan sisi mana
        // menghadap ke atas, jadi pelan boleh mendarat bercermin dan satu
        // ketikan membetulkannya.
        flipBtn = icon(R.drawable.ic_flip, "Cermin", C_FLIP).apply {
            setOnClickListener {
                if (locked) {
                    Toast.makeText(this@ArPlanActivity, "Buka kunci dahulu", Toast.LENGTH_SHORT).show()
                } else { flip = !flip; rebuild(); paintText() }
            }
        }
        lockBtn = icon(R.drawable.ic_lock, "Kunci", C_PLAIN).apply {
            isEnabled = false
            setOnClickListener {
                locked = !locked
                if (!locked) rebuild()
                paintText()
                Toast.makeText(this@ArPlanActivity,
                    if (locked) "Pelan dikunci" else "Pelan dibuka", Toast.LENGTH_SHORT).show()
            }
        }
        shotBtn = icon(R.drawable.ic_camera, "Snap", C_SNAP).apply {
            isEnabled = false
            setOnClickListener { wantShot = true; isEnabled = false }
        }
        resetBtn = icon(R.drawable.ic_reset, "Mula semula", C_PLAIN).apply {
            isEnabled = false
            setOnClickListener { locked = false; wantReset = true }
        }
        val doneBtn = icon(R.drawable.ic_close, "Tutup", C_CLOSE).apply {
            setOnClickListener { finish() }
        }
        bar.addView(LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            addView(flipBtn); addView(lockBtn); addView(shotBtn)
            addView(resetBtn); addView(doneBtn)
        }, LinearLayout.LayoutParams(-1, -2))

        root.addView(bar, FrameLayout.LayoutParams(-1, -2).apply { gravity = Gravity.BOTTOM })
        setContentView(root)
        paintText()
    }

    /**
     * Satu slider dengan nilainya kelihatan.
     *
     * Slider tanpa nombor memberitahu arah tetapi bukan jumlah: "lebih
     * tinggi" boleh dilihat, "+0.35 m" tidak, dan ketinggian ialah tepat
     * jenis perkara yang surveyor perlu tahu dan bukan sekadar rasa.
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
            width = dp(62)
        })
        val value = TextView(this).apply {
            setTextColor(Color.WHITE)
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
            typeface = android.graphics.Typeface.MONOSPACE
            gravity = Gravity.END
            width = dp(62)
            text = fmt(start)
        }
        val sb = SeekBar(this).apply {
            this.max = max - min
            progress = start - min
            setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
                override fun onProgressChanged(s: SeekBar?, p: Int, fromUser: Boolean) {
                    value.text = fmt(p + min)
                    onSet(p + min)
                }
                override fun onStartTrackingTouch(s: SeekBar?) {}
                override fun onStopTrackingTouch(s: SeekBar?) {}
            })
        }
        wrap.addView(sb, LinearLayout.LayoutParams(0, -2, 1f))
        wrap.addView(value)
        return wrap
    }

    private fun dp(v: Int): Int =
        TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP, v.toFloat(), resources.displayMetrics).toInt()

    private fun bail(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show()
        finish()
    }

    // ---------- kitaran hayat ----------

    private var resumed = false

    override fun onResume() {
        super.onResume()
        if (plan == null) return
        if (session == null) {
            session = try {
                Session(this).also { s ->
                    s.configure(Config(s).apply {
                        planeFindingMode = Config.PlaneFindingMode.HORIZONTAL_AND_VERTICAL
                        updateMode = Config.UpdateMode.LATEST_CAMERA_IMAGE
                        focusMode = Config.FocusMode.AUTO
                        depthMode = Config.DepthMode.DISABLED
                        instantPlacementMode = Config.InstantPlacementMode.DISABLED
                        lightEstimationMode = Config.LightEstimationMode.DISABLED
                        cloudAnchorMode = Config.CloudAnchorMode.DISABLED
                    })
                }
            } catch (e: Throwable) { bail("AR tidak dapat dimulakan"); return }
        }
        try { session?.resume(); resumed = true }
        catch (e: CameraNotAvailableException) { session = null; bail("Kamera tidak tersedia"); return }
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
        plan?.recycle(); plan = null
    }

    // ---------- matematik jajaran (port daripada Pocket) ----------

    private fun sub(a: FloatArray, b: FloatArray) =
        floatArrayOf(a[0] - b[0], a[1] - b[1], a[2] - b[2])
    private fun len(a: FloatArray) = sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
    private fun norm(a: FloatArray): FloatArray {
        val l = len(a)
        return if (l > 1e-9f) floatArrayOf(a[0] / l, a[1] / l, a[2] / l) else floatArrayOf(1f, 0f, 0f)
    }
    private fun horiz(a: FloatArray) = floatArrayOf(a[0], 0f, a[2])
    /** Serenjang mendatar: UP x dir. */
    private fun perp(dir: FloatArray, f: Boolean): FloatArray {
        // UP x dir, dengan UP = (0,1,0), yang memberi (dz, 0, -dx).
        val d = norm(dir)
        val q = norm(floatArrayOf(d[2], 0f, -d[0]))
        return if (f) floatArrayOf(-q[0], -q[1], -q[2]) else q
    }

    /** eu, ev, skala dan asalan — cukup untuk memetakan mana-mana piksel
     *  pelan kepada kedudukan dunia. */
    private class St(
        val au: Float, val av: Float, val A: FloatArray,
        val eu: FloatArray, val ev: FloatArray, val s: Float
    )

    @Volatile private var state: St? = null

    private fun from1(A: FloatArray): St? {
        val t = theta * Math.PI.toFloat() / 180f
        val dir = floatArrayOf(cos(t), 0f, sin(t))
        val eu: FloatArray
        val ev: FloatArray
        if (mode == "wall") {
            eu = if (flip) floatArrayOf(-dir[0], -dir[1], -dir[2]) else dir
            ev = floatArrayOf(0f, -1f, 0f)
        } else {
            eu = dir
            ev = perp(dir, flip)
        }
        if (mPerPx <= 0f || !mPerPx.isFinite()) return null
        return St(au, av, A, eu, ev, mPerPx)
    }

    private fun from2(A: FloatArray, B: FloatArray): St? {
        val du = bu - au
        val dv = bv - av
        val L = hypot(du, dv)
        if (L < 1e-6f) return null
        val dx = du / L
        val dy = dv / L
        val D = sub(B, A)
        val s: Float
        val eu: FloatArray
        val ev: FloatArray
        if (mode == "wall") {
            s = len(D) / L
            val Dh = horiz(D)
            var e = if (len(Dh) > 1e-6f) norm(Dh) else floatArrayOf(1f, 0f, 0f)
            if (flip) e = floatArrayOf(-e[0], -e[1], -e[2])
            eu = e
            ev = floatArrayOf(0f, -1f, 0f)
        } else {
            val Dh = horiz(D)
            s = len(Dh) / L
            val wd = norm(Dh)
            val wp = perp(wd, flip)
            eu = floatArrayOf(wd[0] * dx - wp[0] * dy, wd[1] * dx - wp[1] * dy, wd[2] * dx - wp[2] * dy)
            ev = floatArrayOf(wd[0] * dy + wp[0] * dx, wd[1] * dy + wp[1] * dx, wd[2] * dy + wp[2] * dx)
        }
        if (s <= 0f || !s.isFinite()) return null
        return St(au, av, A, eu, ev, s)
    }

    private fun map(st: St, u: Float, v: Float): FloatArray {
        val du = u - st.au
        val dv = v - st.av
        return floatArrayOf(
            st.A[0] + (st.eu[0] * du + st.ev[0] * dv) * st.s,
            st.A[1] + (st.eu[1] * du + st.ev[1] * dv) * st.s,
            st.A[2] + (st.eu[2] * du + st.ev[2] * dv) * st.s)
    }

    /** Bina semula daripada anchor dan laras semasa. */
    private fun rebuild() {
        if (locked) return
        val n = anchors.size
        if (n == 0) { state = null; quad = FloatArray(0); return }
        val a0 = anchors[0].pose
        val up = if (mode == "wall") {
            // "Dalam" menolak pelan menjauhi dinding, pada normalnya.
            val st0 = state
            val e = st0?.eu ?: floatArrayOf(1f, 0f, 0f)
            val p = perp(e, false)
            floatArrayOf(p[0] * lift, p[1] * lift, p[2] * lift)
        } else floatArrayOf(0f, lift, 0f)

        val A = floatArrayOf(a0.tx() + up[0], a0.ty() + up[1], a0.tz() + up[2])
        val st = if (twoPin && n >= 2) {
            val b0 = anchors[1].pose
            from2(A, floatArrayOf(b0.tx() + up[0], b0.ty() + up[1], b0.tz() + up[2]))
        } else from1(A)
        state = st
        quad = if (st == null) FloatArray(0) else {
            val c = arrayOf(map(st, 0f, 0f), map(st, planW, 0f), map(st, planW, planH), map(st, 0f, planH))
            floatArrayOf(
                c[0][0], c[0][1], c[0][2], c[1][0], c[1][1], c[1][2],
                c[2][0], c[2][1], c[2][2], c[3][0], c[3][1], c[3][2])
        }

        // Satah yang dikesan duduk pada ketinggian anchor; pelan duduk pada
        // ketinggian itu campur lift. Garis dari satu ke satu lagi ialah
        // jarak yang slider itu sedang menetapkan.
        baseY = a0.ty()
        val q = quad
        drops = if (mode == "wall" || q.size != 12 || abs(lift) < 0.015f) FloatArray(0) else {
            val out = FloatArray(4 * 6)
            for (k in 0 until 4) {
                out[k * 6]     = q[k * 3]
                out[k * 6 + 1] = q[k * 3 + 1]
                out[k * 6 + 2] = q[k * 3 + 2]
                out[k * 6 + 3] = q[k * 3]
                out[k * 6 + 4] = baseY
                out[k * 6 + 5] = q[k * 3 + 2]
            }
            out
        }
    }

    @SuppressLint("SetTextI18n")
    private fun paintText() {
        val n = anchors.size
        val need = if (twoPin) 2 else 1
        placeBtn.isEnabled = n < need && !locked
        placeBtn.text = if (n < need) "Letak titik ${n + 1}" else "Pelan diletak"
        // Ikon mangga bertukar bersama keadaannya, dan warnanya juga: kuning
        // bermakna sesuatu sedang ditahan, yang perlu kelihatan tanpa dibaca.
        lockBtn.setImageResource(if (locked) R.drawable.ic_unlock else R.drawable.ic_lock)
        lockBtn.setColorFilter(if (locked) C_LOCKED else C_PLAIN)
        for (b2 in listOf(flipBtn, lockBtn, shotBtn, resetBtn)) b2.alpha = if (b2.isEnabled) 1f else 0.35f
        lockBtn.isEnabled = state != null
        lockBtn.contentDescription = if (locked) "Buka kunci" else "Kunci"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            lockBtn.tooltipText = lockBtn.contentDescription
        flipBtn.isEnabled = state != null && !locked
        if (!wantShot) shotBtn.isEnabled = state != null
        resetBtn.isEnabled = n > 0

        hint.text = when {
            !tracking && why.isNotEmpty() -> why
            !tracking -> "Gerak telefon perlahan supaya ARCore nampak lantai…"
            planeCount == 0 ->
                "Belum ada satah. Gerak telefon ke KIRI dan KANAN perlahan, halakan ke lantai bercorak."
            locked -> "Pelan dikunci. Tekan Buka kunci untuk melaras semula."
            // Ketaksaan yang paling kerap mengelirukan, dinamakan sebaik
            // pelan muncul dan bukan dibiarkan untuk ditemui sendiri.
            n >= need -> "Pelan diletak. Teks terbalik? Tekan Cermin. Laras tinggi dengan slider."
            aim == null -> "$planeCount satah dikesan · halakan bulatan ke kawasan biru"
            n == 0 -> "Halakan ke tempat sebenar titik ${if (twoPin) "1" else "jangkar"} pada pelan, kemudian Letak"
            else -> "Halakan ke tempat sebenar titik 2, kemudian Letak"
        }

        val st = state
        // Skala yang tidak munasabah bermakna dua titik diletak terlalu
        // rapat di tapak: ralat beberapa sentimeter antara dua anchor yang
        // berjarak setengah meter mendarabkan merentasi seluruh pelan.
        val wideM = if (st == null) 0f else planW * st.s
        warn.visibility = if (st != null && twoPin && (wideM < 0.8f || wideM > 120f))
            View.VISIBLE else View.GONE
        if (warn.visibility == View.VISIBLE) {
            warn.text = String.format(
                "Pelan keluar %.2f m lebar — dua titik di tapak terlalu %s. " +
                "Tekan Mula semula dan letak semula lebih %s.",
                wideM, if (wideM < 0.8f) "rapat" else "jauh",
                if (wideM < 0.8f) "jauh" else "rapat")
        }
        readout.text = if (st == null) "—" else {
            val wide = planW * st.s
            val gap = if (mode == "wall") ""
                else if (abs(lift) < 0.015f) " · pada satah"
                else String.format(" · %.0f cm %s satah", abs(lift) * 100,
                    if (lift > 0) "atas" else "bawah")
            String.format("%.2f m lebar%s · %d%%", wide, gap, (opacity * 100).toInt())
        }
    }

    /**
     * Gambar skrin AR, ke galeri telefon.
     *
     * Dibaca daripada buffer GL dan bukan daripada paparan: itu memberi
     * kamera dan pelan tepat seperti yang dilihat, tanpa kursor dan butang
     * yang tiada tempat dalam laporan. glReadPixels memulangkan baris dari
     * bawah ke atas, jadi ia dibalikkan.
     *
     * Dipanggil pada benang GL, selepas semuanya dilukis.
     */
    private fun grab() {
        val w = gl.width
        val h = gl.height
        if (w <= 0 || h <= 0) { runOnUiThread { paintText() }; return }
        val buf = java.nio.ByteBuffer.allocateDirect(w * h * 4)
            .order(java.nio.ByteOrder.nativeOrder())
        GLES20.glReadPixels(0, 0, w, h, GLES20.GL_RGBA, GLES20.GL_UNSIGNED_BYTE, buf)
        buf.rewind()
        val px = IntArray(w * h)
        buf.asIntBuffer().get(px)
        // RGBA daripada GL, ARGB untuk Bitmap, dan terbalik menegak.
        val out = IntArray(w * h)
        for (y in 0 until h) {
            val src = y * w
            val dst = (h - 1 - y) * w
            for (x in 0 until w) {
                val c = px[src + x]
                val r = c and 0xff
                val g2 = (c shr 8) and 0xff
                val b2 = (c shr 16) and 0xff
                out[dst + x] = (0xff shl 24) or (r shl 16) or (g2 shl 8) or b2
            }
        }
        val bmp = Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
        val name = "goxpert-pelan-" + System.currentTimeMillis() + ".jpg"
        val okSave = runCatching { saveToGallery(bmp, name) }.getOrDefault(false)
        bmp.recycle()
        runOnUiThread {
            Toast.makeText(this,
                if (okSave) "Disimpan ke galeri" else "Tidak dapat menyimpan gambar",
                Toast.LENGTH_SHORT).show()
            paintText()
        }
    }

    private fun saveToGallery(bmp: Bitmap, name: String): Boolean {
        val dir = Environment.DIRECTORY_PICTURES + "/GoXpert Pocket"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val cv = ContentValues().apply {
                put(MediaStore.Images.Media.DISPLAY_NAME, name)
                put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
                put(MediaStore.Images.Media.RELATIVE_PATH, dir)
                put(MediaStore.Images.Media.IS_PENDING, 1)
            }
            val uri = contentResolver.insert(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI, cv) ?: return false
            contentResolver.openOutputStream(uri)?.use {
                bmp.compress(Bitmap.CompressFormat.JPEG, 92, it)
            } ?: return false
            cv.clear(); cv.put(MediaStore.Images.Media.IS_PENDING, 0)
            contentResolver.update(uri, cv, null, null)
            return true
        }
        val folder = File(
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES),
            "GoXpert Pocket").apply { mkdirs() }
        val f = File(folder, name)
        java.io.FileOutputStream(f).use { bmp.compress(Bitmap.CompressFormat.JPEG, 92, it) }
        // Tanpa imbasan, galeri tidak akan menemuinya pada Android lama.
        android.media.MediaScannerConnection.scanFile(
            this, arrayOf(f.absolutePath), arrayOf("image/jpeg"), null)
        return true
    }

    // ---------- lapisan 2D ----------

    inner class Overlay(ctx: android.content.Context) : View(ctx) {
        private val hoop = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(3).toFloat(); color = Color.argb(120, 255, 255, 255)
        }
        private val aimEdge = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(3).toFloat(); color = Color.rgb(255, 196, 0)
        }
        private val aimFill = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.FILL; color = Color.argb(60, 255, 196, 0)
        }
        private val dot = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.rgb(255, 196, 0) }
        private val path = android.graphics.Path()
        private val out = FloatArray(4)

        private fun toScreen(x: Float, y: Float, z: Float): FloatArray? {
            val v = vp
            out[0] = v[0] * x + v[4] * y + v[8] * z + v[12]
            out[1] = v[1] * x + v[5] * y + v[9] * z + v[13]
            out[2] = v[2] * x + v[6] * y + v[10] * z + v[14]
            out[3] = v[3] * x + v[7] * y + v[11] * z + v[15]
            if (out[3] <= 0.0001f) return null
            return floatArrayOf(
                (out[0] / out[3] * 0.5f + 0.5f) * width,
                (1f - (out[1] / out[3] * 0.5f + 0.5f)) * height)
        }

        override fun onDraw(c: Canvas) {
            // Pelan itu sendiri dilukis dalam GL, bersama kamera. Yang
            // tinggal di sini ialah benda kecil, di mana jurang satu bingkai
            // tidak kelihatan.

            // Titik yang sudah diletak.
            for (an in anchors) {
                if (an.trackingState != TrackingState.TRACKING) continue
                val p = an.pose
                val sp = toScreen(p.tx(), p.ty(), p.tz()) ?: continue
                c.drawCircle(sp[0], sp[1], dp(6).toFloat(), dot)
            }

            // Reticle, terletak pada permukaan.
            val cx = width / 2f
            val cy = height / 2f
            val rg = ring
            var drew = false
            if (rg.size >= 9) {
                path.reset()
                var started = false
                var k = 0
                while (k + 2 < rg.size) {
                    val sp = toScreen(rg[k], rg[k + 1], rg[k + 2])
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
            plan?.let { b2 -> if (!b2.isRecycled) { planGl.create(b2); glReady = true } }
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

            val cam = frame.camera
            val ok = cam.trackingState == TrackingState.TRACKING
            val reason = if (ok) "" else when (cam.trackingFailureReason) {
                TrackingFailureReason.INSUFFICIENT_LIGHT -> "Terlalu gelap — hidupkan lampu"
                TrackingFailureReason.EXCESSIVE_MOTION -> "Gerak telefon lebih perlahan"
                TrackingFailureReason.INSUFFICIENT_FEATURES ->
                    "Permukaan ini terlalu kosong — halakan ke sesuatu yang bercorak"
                else -> ""
            }
            if (tracking != ok || why != reason) {
                tracking = ok; why = reason; runOnUiThread { paintText() }
            }
            if (!ok) return

            cam.getProjectionMatrix(proj, 0, 0.05f, 100f)
            cam.getViewMatrix(view, 0)
            android.opengl.Matrix.multiplyMM(mul, 0, proj, 0, view, 0)
            vp = mul.copyOf()

            var nPlane = 0
            runCatching {
                for (pl in s.getAllTrackables(Plane::class.java)) {
                    if (pl.trackingState == TrackingState.TRACKING && pl.subsumedBy == null) nPlane++
                }
            }
            if (planeCount != nPlane) { planeCount = nPlane; runOnUiThread { paintText() } }

            var hit: HitResult? = null
            runCatching {
                hit = frame.hitTest(gl.width / 2f, gl.height / 2f).firstOrNull {
                    val t = it.trackable
                    t is Plane && t.isPoseInPolygon(it.hitPose) &&
                        t.trackingState == TrackingState.TRACKING
                }
            }
            val h = hit
            val rawHit = if (h == null) null
                else floatArrayOf(h.hitPose.tx(), h.hitPose.ty(), h.hitPose.tz())

            if (rawHit == null) smooth = null
            else {
                val sm = smooth
                val d = if (sm == null) 99f
                    else sqrt((sm[0] - rawHit[0]) * (sm[0] - rawHit[0]) +
                              (sm[1] - rawHit[1]) * (sm[1] - rawHit[1]) +
                              (sm[2] - rawHit[2]) * (sm[2] - rawHit[2]))
                smooth = if (sm == null || d > 0.35f) rawHit.copyOf()
                else floatArrayOf(
                    sm[0] + (rawHit[0] - sm[0]) * 0.28f,
                    sm[1] + (rawHit[1] - sm[1]) * 0.28f,
                    sm[2] + (rawHit[2] - sm[2]) * 0.28f)
            }
            val shown = smooth
            aim = shown

            ring = if (h == null || shown == null || rawHit == null) FloatArray(0) else {
                val po = h.hitPose
                val dx = shown[0] - rawHit[0]
                val dy = shown[1] - rawHit[1]
                val dz = shown[2] - rawHit[2]
                val n = 28
                val r = 0.05f
                val w = FloatArray(n * 3)
                for (k in 0 until n) {
                    val a2 = (k.toFloat() / n) * 6.2831855f
                    val wp = po.transformPoint(floatArrayOf(r * cos(a2), 0f, r * sin(a2)))
                    w[k * 3] = wp[0] + dx; w[k * 3 + 1] = wp[1] + dy; w[k * 3 + 2] = wp[2] + dz
                }
                w
            }

            var changed = false
            if (wantPlace) {
                wantPlace = false
                val need = if (twoPin) 2 else 1
                if (anchors.size < need) h?.let { hh ->
                    runCatching { anchors.add(hh.trackable.createAnchor(hh.hitPose)) }
                        .onSuccess { changed = true }
                }
            }
            if (wantReset) {
                wantReset = false
                anchors.forEach { runCatching { it.detach() } }
                anchors.clear()
                state = null; quad = FloatArray(0)
                lift = 0f
                changed = true
            }

            rebuild()

            // Pelan dilukis DI SINI, dalam bingkai yang sama dengan imej
            // kamera. Melukisnya pada lapisan 2D di atas bermakna ia sentiasa
            // satu dua bingkai di belakang, yang kelihatan seperti pelan yang
            // berenang walaupun titiknya tidak bergerak.
            val q = quad
            if (glReady && q.size == 12) {
                planGl.draw(vp, q, opacity)
                val dp2 = drops
                if (dp2.size >= 6) {
                    // Kuning, sama seperti kursor: ini ukuran, bukan hiasan.
                    planGl.lines(vp, dp2, 1f, 0.77f, 0f, 0.95f, 4f)
                    // Bayang pelan pada satah itu sendiri, supaya mata boleh
                    // melihat di mana ia akan jatuh.
                    val sh = FloatArray(8 * 3)
                    for (k in 0 until 4) {
                        val n2 = (k + 1) % 4
                        sh[k * 6]     = q[k * 3];     sh[k * 6 + 1] = baseY; sh[k * 6 + 2] = q[k * 3 + 2]
                        sh[k * 6 + 3] = q[n2 * 3];    sh[k * 6 + 4] = baseY; sh[k * 6 + 5] = q[n2 * 3 + 2]
                    }
                    planGl.lines(vp, sh, 1f, 0.77f, 0f, 0.4f, 2f)
                }
            }

            if (wantShot) { wantShot = false; grab() }

            if (changed) runOnUiThread { paintText() }
            overlay.postInvalidateOnAnimation()
        }
    }

    companion object {
        private const val C_FLIP = 0xFF22D3EE.toInt()
        private const val C_SNAP = 0xFFFFFFFF.toInt()
        private const val C_PLAIN = 0xFFD6DEE6.toInt()
        private const val C_LOCKED = 0xFFFFC400.toInt()
        private const val C_CLOSE = 0xFFFF7A7A.toInt()
    }
}
