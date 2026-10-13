package my.goxpert.pocket

import android.app.Activity
import android.app.AlertDialog
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.drawable.GradientDrawable
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import android.opengl.Matrix
import android.os.Bundle
import android.util.Base64
import android.util.TypedValue
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import com.google.ar.core.Anchor
import com.google.ar.core.Config
import com.google.ar.core.Frame
import com.google.ar.core.HitResult
import com.google.ar.core.Plane
import com.google.ar.core.Point
import com.google.ar.core.Session
import com.google.ar.core.TrackingFailureReason
import com.google.ar.core.TrackingState
import com.google.ar.core.exceptions.CameraNotAvailableException
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10
import kotlin.math.sqrt

/**
 * Inspection dalam AR: tanda defect di tempatnya, dan jumpa semula di tempat
 * yang sama pada lawatan berikutnya.
 *
 * Perkara yang membuat skrin ini wujud ialah lawatan KEDUA. Menanda defect
 * dalam AR mudah; mana-mana app boleh letak pin pada dinding. Yang susah
 * ialah pulang tiga bulan kemudian, selepas pembaikan, dan melihat pin yang
 * sama pada retak yang sama — kerana ARCore tidak boleh menyimpan peta
 * sesuatu tempat. Tutup app dan setiap koordinat hilang.
 *
 * Jadi defect tidak pernah disimpan dalam koordinat ARCore. Ia disimpan
 * dalam bingkai zon itu sendiri, yang ditakrifkan oleh beberapa titik kunci
 * pada ciri yang tidak bergerak. Lawatan berikutnya menanda semula titik
 * yang sama, ArFit mengira putaran dan anjakan, dan semuanya kembali.
 * Kualiti padanan itu dipapar dalam milimeter, kerana defect yang tersasar
 * setengah meter lebih memudaratkan daripada tiada defect langsung.
 *
 * Satu perbezaan yang disengajakan daripada skrin model 3D: di sana, hit
 * ditapis kepada DALAM poligon satah. Di sini tidak boleh. Titik kunci
 * ialah bucu — tempat dua dinding bertemu — dan poligon satah ARCore
 * hampir selalu berhenti sebelum sampai ke bucu. Menapis dengan
 * isPoseInPolygon akan menolak tepat titik yang alat ini perlukan.
 */
class ArInspectActivity : Activity() {

    private enum class Phase { LOCK, READY }

    private class Lock(
        var zx: Float, var zy: Float, var zz: Float,
        var label: String,
        /** Gambar panduan masuk, untuk ditunjuk semasa menanda semula. */
        var guide: Bitmap? = null,
        /** Nama fail bila gambar baharu ditangkap sesi ini. */
        var shot: String = "",
        /** Datang daripada bungkusan: halaman sudah memegang gambarnya,
         *  jadi ia tidak ditulis semula. Menulis semula bermakna memampat
         *  semula JPEG yang sama setiap lawatan. */
        var incoming: Boolean = false
    )

    private class Def(
        var id: String,
        var zx: Float, var zy: Float, var zz: Float,
        var sev: Int,
        var title: String,
        var note: String,
        var fresh: Boolean,
        var shot: String = "",
        var photo: Bitmap? = null,
        var thumb: Bitmap? = null,
        var tex: Int = 0,
        var removed: Boolean = false,
        /** Minta tekstur dibina semula pada bingkai GL berikutnya. */
        var dirty: Boolean = true
    )

    private var session: Session? = null
    private lateinit var gl: GLSurfaceView
    private lateinit var overlay: Overlay
    private lateinit var hint: TextView
    private lateinit var readout: TextView
    private lateinit var warn: TextView
    private lateinit var guideIm: ImageView
    private lateinit var markBtn: ImageButton
    private lateinit var undoBtn: ImageButton
    private lateinit var addBtn: ImageButton
    private lateinit var lockBtn: ImageButton
    private lateinit var doneBtn: ImageButton

    private val bg = ArBackground()
    private val cards = ArCards()

    // ---------- apa yang Pocket hantar ----------
    private var zoneName = ""
    private var modeNew = true
    private var need = 3
    private val locks = ArrayList<Lock>()
    private val defs = ArrayList<Def>()
    private val removed = ArrayList<String>()
    private lateinit var outDir: File

    /**
     * Benang GL melukis daripada senarai ini tiga puluh kali sesaat, dan
     * benang UI menambah kepadanya apabila borang defect disimpan. Tanpa
     * kunci ini, menyimpan satu defect semasa skrin bergerak ialah
     * ConcurrentModificationException — bukan kadang-kadang, tetapi tepat
     * pada saat yang paling mungkin berlaku.
     */
    private val bank = Any()

    // ---------- keadaan ----------
    @Volatile private var phase = Phase.LOCK
    /** Titik kunci yang ditanda sesi ini, sebagai Anchor supaya ia tidak
     *  hanyut apabila peta ARCore bertambah baik. */
    private val pins = ArrayList<Anchor>()
    @Volatile private var fit: ArFit.Fit? = null
    @Volatile private var rms = 0f
    @Volatile private var badPoint = -1
    @Volatile private var tracking = false
    @Volatile private var why = ""
    @Volatile private var aim: FloatArray? = null
    @Volatile private var smooth: FloatArray? = null
    @Volatile private var vp = FloatArray(16)
    @Volatile private var camPos = FloatArray(3)
    @Volatile private var camFwd = floatArrayOf(0f, 0f, -1f)
    @Volatile private var camRight = floatArrayOf(1f, 0f, 0f)

    // niat daripada benang UI, dimakan oleh benang GL
    @Volatile private var wantMark = false
    @Volatile private var wantUndo = false
    @Volatile private var wantDefect = false
    @Volatile private var wantLock = false
    @Volatile private var wantReset = false
    @Volatile private var tapX = -1f
    @Volatile private var tapY = -1f

    private val proj = FloatArray(16)
    private val view = FloatArray(16)
    private val mul = FloatArray(16)
    private val inv = FloatArray(16)

    private var paused = false

    override fun onCreate(st: Bundle?) {
        super.onCreate(st)
        val path = intent.getStringExtra("bundle")
        if (path.isNullOrEmpty()) { bail("Zon tidak sampai"); return }
        val f = File(path)
        outDir = f.parentFile ?: cacheDir
        if (!f.exists()) { bail("Zon tidak sampai"); return }

        try { readBundle(f) } catch (e: Throwable) {
            bail("Zon tidak dapat dibaca: ${e.javaClass.simpleName}"); return
        }
        if (!modeNew && locks.size < 2) { bail("Zon ini belum ada titik kunci"); return }
        if (!modeNew) need = locks.size

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

        // Gambar panduan titik kunci: bucu YANG MANA, dilihat semula.
        // Tanpa ini "tanda titik 2" bermakna apa-apa sahaja tiga bulan
        // kemudian, dan padanan yang salah kelihatan sama seperti yang betul.
        guideIm = ImageView(this).apply {
            scaleType = ImageView.ScaleType.CENTER_CROP
            background = GradientDrawable().apply {
                setStroke(dp(3), Color.rgb(96, 180, 255))
                cornerRadius = dp(10).toFloat()
                setColor(Color.argb(190, 0, 0, 0))
            }
            visibility = View.GONE
        }
        root.addView(guideIm, FrameLayout.LayoutParams(dp(132), dp(99)).apply {
            gravity = Gravity.TOP or Gravity.END
            topMargin = dp(62); rightMargin = dp(12)
        })

        val bar = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.argb(205, 0, 0, 0))
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

        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
        }
        markBtn = iconBtn(R.drawable.ic_pin, "Tanda titik kunci") { wantMark = true }
        undoBtn = iconBtn(R.drawable.ic_undo, "Buang titik terakhir") { wantUndo = true }
        addBtn = iconBtn(R.drawable.ic_camera, "Tambah defect") { wantDefect = true }
        lockBtn = iconBtn(R.drawable.ic_lock, "Tambah titik kunci") { wantLock = true }
        doneBtn = iconBtn(R.drawable.ic_check, "Siap") { finishUp() }
        row.addView(markBtn); row.addView(undoBtn)
        row.addView(addBtn); row.addView(lockBtn); row.addView(doneBtn)
        bar.addView(row, LinearLayout.LayoutParams(-1, -2))
        root.addView(bar, FrameLayout.LayoutParams(-1, -2).apply { gravity = Gravity.BOTTOM })

        val close = iconBtn(R.drawable.ic_close, "Tutup") { finishUp() }
        root.addView(close, FrameLayout.LayoutParams(dp(44), dp(44)).apply {
            gravity = Gravity.TOP or Gravity.END
            topMargin = dp(10); rightMargin = dp(10)
        })

        overlay.setOnTouchListener { _, e ->
            if (e.action == MotionEvent.ACTION_UP) { tapX = e.x; tapY = e.y }
            true
        }

        setContentView(root)
        paintUi()
    }

    // ---------- masuk dan keluar ----------

    private fun readBundle(f: File) {
        val j = JSONObject(f.readText())
        zoneName = j.optString("zone", "Zon")
        modeNew = j.optString("mode", "new") != "open"
        need = j.optInt("need", 3).coerceIn(2, 8)
        j.optJSONArray("locks")?.let { a ->
            for (i in 0 until a.length()) {
                val o = a.optJSONObject(i) ?: continue
                locks.add(Lock(
                    o.optDouble("x", 0.0).toFloat(),
                    o.optDouble("y", 0.0).toFloat(),
                    o.optDouble("z", 0.0).toFloat(),
                    o.optString("label", ""),
                    decode(o.optString("shot", "")),
                    incoming = true))
            }
        }
        j.optJSONArray("defects")?.let { a ->
            for (i in 0 until a.length()) {
                val o = a.optJSONObject(i) ?: continue
                defs.add(Def(
                    o.optString("id", ""),
                    o.optDouble("x", 0.0).toFloat(),
                    o.optDouble("y", 0.0).toFloat(),
                    o.optDouble("z", 0.0).toFloat(),
                    o.optInt("sev", 1).coerceIn(0, 3),
                    o.optString("title", ""),
                    o.optString("note", ""),
                    false,
                    thumb = decode(o.optString("thumb", ""))))
            }
        }
        // Zon baharu bermula kosong walaupun bungkusan membawa sesuatu.
        if (modeNew) { locks.clear(); defs.clear() }
    }

    private fun decode(b64: String): Bitmap? {
        if (b64.isEmpty()) return null
        return runCatching {
            val b = Base64.decode(b64, Base64.DEFAULT)
            BitmapFactory.decodeByteArray(b, 0, b.size)
        }.getOrNull()
    }

    private fun bail(msg: String) {
        setResult(RESULT_CANCELED, Intent().putExtra("error", msg))
        finish()
    }

    /**
     * Tulis hasil ke cakera dan beritahu halaman.
     *
     * Gambar tidak dipulangkan melalui Intent. Had urus niaga Binder ialah
     * satu megabait untuk seluruh proses, dan sepuluh gambar defect
     * melepasinya; kegagalan itu pula berlaku di dalam sistem dan bukan di
     * sini, jadi ia kelihatan seperti skrin yang pulang kosong tanpa sebab.
     */
    private fun finishUp() {
        val keep = liveDefs()
        val ls = lockList()
        val ok = runCatching {
            outDir.mkdirs()
            val arr = JSONArray()
            for (d in keep) {
                // Hampir semuanya sudah ditulis masa disimpan; ini menangkap
                // apa-apa yang terlepas.
                stow(d)
                arr.put(JSONObject().apply {
                    put("id", d.id)
                    put("x", d.zx.toDouble()); put("y", d.zy.toDouble()); put("z", d.zz.toDouble())
                    put("sev", d.sev)
                    put("title", d.title)
                    put("note", d.note)
                    put("shot", d.shot)
                    put("new", d.fresh)
                })
            }
            val la = JSONArray()
            for ((i, l) in ls.withIndex()) {
                val g = l.guide
                if (g != null && !l.incoming && l.shot.isEmpty()) {
                    val name = "l$i.jpg"
                    FileOutputStream(File(outDir, name)).use {
                        g.compress(Bitmap.CompressFormat.JPEG, 80, it)
                    }
                    l.shot = name
                }
                la.put(JSONObject().apply {
                    put("x", l.zx.toDouble()); put("y", l.zy.toDouble()); put("z", l.zz.toDouble())
                    put("label", l.label)
                    put("shot", l.shot)
                })
            }
            val out = JSONObject().apply {
                put("ok", true)
                put("zone", zoneName)
                put("mode", if (modeNew) "new" else "open")
                put("placed", phase == Phase.READY)
                put("rms", rms.toDouble())
                put("locks", la)
                put("defects", arr)
                put("removed", JSONArray(removed))
            }
            File(outDir, "out.json").writeText(out.toString())
            true
        }.getOrElse { false }

        if (ok) setResult(RESULT_OK, Intent())
        else setResult(RESULT_CANCELED, Intent().putExtra("error", "Tidak dapat menyimpan hasil"))
        finish()
    }

    // ---------- kitaran hidup ----------

    override fun onResume() {
        super.onResume()
        if (!::gl.isInitialized) return
        if (session == null) {
            try {
                val s = Session(this)
                s.configure(Config(s).apply {
                    planeFindingMode = Config.PlaneFindingMode.HORIZONTAL_AND_VERTICAL
                    updateMode = Config.UpdateMode.LATEST_CAMERA_IMAGE
                    focusMode = Config.FocusMode.AUTO
                    lightEstimationMode = Config.LightEstimationMode.DISABLED
                    depthMode = Config.DepthMode.DISABLED
                })
                session = s
            } catch (e: Throwable) {
                bail("AR tidak dapat dimulakan: ${e.message}"); return
            }
        }
        try { session?.resume() } catch (e: CameraNotAvailableException) {
            bail("Kamera tidak tersedia"); return
        }
        gl.onResume()
        paused = false
    }

    override fun onPause() {
        super.onPause()
        if (!::gl.isInitialized) return
        paused = true
        gl.onPause()
        runCatching { session?.pause() }
    }

    override fun onDestroy() {
        super.onDestroy()
        pins.forEach { runCatching { it.detach() } }
        pins.clear()
        cards.release()
        runCatching { session?.close() }
        session = null
    }

    // ---------- ui ----------

    private fun dp(v: Int) = (v * resources.displayMetrics.density).toInt()

    private fun iconBtn(icon: Int, name: String, onTap: () -> Unit): ImageButton =
        ImageButton(this).apply {
            setImageResource(icon)
            setColorFilter(Color.WHITE)
            contentDescription = name
            scaleType = ImageView.ScaleType.CENTER_INSIDE
            background = GradientDrawable().apply {
                cornerRadius = dp(11).toFloat()
                setColor(Color.argb(46, 255, 255, 255))
                setStroke(dp(1), Color.argb(70, 255, 255, 255))
            }
            val lp = LinearLayout.LayoutParams(dp(54), dp(46))
            lp.marginStart = dp(5); lp.marginEnd = dp(5)
            layoutParams = lp
            setOnClickListener { onTap() }
            setOnLongClickListener {
                Toast.makeText(this@ArInspectActivity, name, Toast.LENGTH_SHORT).show(); true
            }
        }

    private fun paintUi() {
        val locking = phase == Phase.LOCK
        markBtn.visibility = if (locking) View.VISIBLE else View.GONE
        undoBtn.visibility = if (locking && pins.isNotEmpty()) View.VISIBLE else View.GONE
        addBtn.visibility = if (locking) View.GONE else View.VISIBLE
        lockBtn.visibility = if (locking) View.GONE else View.VISIBLE
        doneBtn.visibility = View.VISIBLE

        val n = pins.size
        val ls = lockList()
        hint.text = when {
            !tracking -> "Gerakkan telefon perlahan untuk mengesan ruang"
            locking && modeNew ->
                "$zoneName · Tanda titik kunci ${n + 1} daripada $need — " +
                "pilih ciri yang tidak akan bergerak: bucu dinding, bucu kusen pintu, penjuru tiang."
            locking ->
                "$zoneName · Tanda semula titik ${n + 1} daripada $need" +
                (ls.getOrNull(n)?.label?.takeIf { it.isNotBlank() }?.let { " — $it" } ?: "")
            else -> "$zoneName · ${defs.count { !it.removed }} defect"
        }

        // Gambar panduan hanya bermakna semasa menanda semula.
        val g = if (locking && !modeNew) ls.getOrNull(n)?.guide else null
        if (g != null) { guideIm.setImageBitmap(g); guideIm.visibility = View.VISIBLE }
        else guideIm.visibility = View.GONE

        warn.visibility = if (why.isEmpty()) View.GONE else View.VISIBLE
        if (why.isNotEmpty()) warn.text = why

        readout.text = when {
            phase == Phase.READY && !modeNew && rms > 0f ->
                "Padanan ${fmtMm(rms)}" + quality(rms) +
                (if (badPoint >= 0) " · titik ${badPoint + 1} paling tersasar" else "")
            phase == Phase.READY -> "Bidik defect, kemudian tekan kamera"
            else -> "$n daripada $need ditanda"
        }
    }

    private fun quality(e: Float) = when {
        e < 0.05f -> " · bagus"
        e < 0.15f -> " · boleh pakai"
        else -> " · lemah"
    }

    private fun fmtMm(m: Float): String {
        val mm = m * 1000f
        return if (mm < 1000f) "${Math.round(mm)} mm" else String.format("%.2f m", m)
    }

    private fun toast(s: String) =
        runOnUiThread { Toast.makeText(this, s, Toast.LENGTH_SHORT).show() }

    // ---------- borang defect ----------

    private fun askDefect(d: Def, isNew: Boolean) {
        val pad = dp(16)
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(pad, dp(8), pad, 0)
        }
        (d.photo ?: d.thumb)?.let { ph ->
            box.addView(ImageView(this).apply {
                setImageBitmap(ph)
                adjustViewBounds = true
                scaleType = ImageView.ScaleType.CENTER_CROP
            }, LinearLayout.LayoutParams(-1, dp(150)))
        }
        val title = EditText(this).apply {
            hint = "Defect apa? contoh: Retak rambut pada dinding"
            setText(d.title)
            setSingleLine()
        }
        box.addView(title)

        box.addView(TextView(this).apply {
            text = "Keutamaan"
            setPadding(0, dp(12), 0, dp(4))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 12f)
        })
        var sev = d.sev
        val sevRow = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        val btns = ArrayList<TextView>()
        for (i in 0..3) {
            val b = TextView(this).apply {
                text = "${ArCardArt.CODES[i]}\n${ArCardArt.NAMES[i]}"
                gravity = Gravity.CENTER
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 11f)
                setPadding(dp(4), dp(8), dp(4), dp(8))
                val lp = LinearLayout.LayoutParams(0, -2, 1f)
                lp.marginStart = dp(3); lp.marginEnd = dp(3)
                layoutParams = lp
            }
            btns.add(b); sevRow.addView(b)
        }
        fun paintSev() {
            for (i in 0..3) {
                val on = i == sev
                btns[i].setTextColor(if (on) Color.WHITE else Color.rgb(90, 95, 105))
                btns[i].background = GradientDrawable().apply {
                    cornerRadius = dp(9).toFloat()
                    setColor(if (on) ArCardArt.colour(i) else Color.argb(26, 128, 128, 128))
                    setStroke(dp(1), if (on) ArCardArt.colour(i) else Color.argb(50, 128, 128, 128))
                }
            }
        }
        for (i in 0..3) btns[i].setOnClickListener { sev = i; paintSev() }
        paintSev()
        box.addView(sevRow)

        val note = EditText(this).apply {
            hint = "Nota (pilihan)"
            setText(d.note)
            minLines = 2
        }
        box.addView(note, LinearLayout.LayoutParams(-1, -2).apply { topMargin = dp(10) })

        val b = AlertDialog.Builder(this)
            .setTitle(if (isNew) "Defect baharu" else "Defect ${liveDefs().indexOf(d) + 1}")
            .setView(box)
            .setPositiveButton("Simpan") { _, _ ->
                d.title = title.text.toString().trim()
                d.sev = sev
                d.note = note.text.toString().trim()
                d.dirty = true
                stow(d)
                if (isNew) synchronized(bank) { defs.add(d) }
                paintUi()
            }
        if (isNew) {
            // Batal bermakna gambar itu dibuang, bukan defect tanpa nama
            // tertinggal dalam zon.
            b.setNegativeButton("Buang") { _, _ -> paintUi() }
        } else {
            b.setNegativeButton("Buang defect") { _, _ ->
                synchronized(bank) {
                    d.removed = true
                    if (!d.fresh && d.id.isNotEmpty()) removed.add(d.id)
                }
                paintUi()
            }
            b.setNeutralButton("Tutup", null)
        }
        b.setCancelable(false)
        b.show()
    }

    private fun liveDefs(): List<Def> = synchronized(bank) { defs.filter { !it.removed } }

    /** Kaunter nama fail gambar defect, untuk sesi ini. */
    private var shotN = 0

    /**
     * Gambar ke cakera sekarang, dan Bitmapnya dilepaskan.
     *
     * Satu tangkapan 1024 px ialah 4 MB dalam memori dan 150 KB sebagai
     * JPEG. Memegang dua puluh daripadanya sehingga skrin ditutup ialah 80
     * MB, dan telefon sederhana mati jauh sebelum itu — di tapak, dengan
     * kerja sejam di dalamnya.
     */
    private fun stow(d: Def) {
        val p = d.photo ?: return
        if (d.shot.isNotEmpty()) return
        runCatching {
            outDir.mkdirs()
            val name = "d${shotN++}.jpg"
            FileOutputStream(File(outDir, name)).use {
                p.compress(Bitmap.CompressFormat.JPEG, 86, it)
            }
            d.shot = name
        }
        d.photo = null
    }

    private fun lockList(): List<Lock> = synchronized(bank) { locks.toList() }

    // ---------- benang GL ----------

    private inner class Renderer : GLSurfaceView.Renderer {

        private val SMOOTH = 0.35f
        private var w = 1
        private var h = 1
        /** Minta satu gambar BERSIH: dibaca selepas latar kamera dilukis
         *  dan sebelum pin dan kad, supaya gambar defect itu gambar defect
         *  dan bukan gambar hamparan AR. */
        private var shotFor: Def? = null

        override fun onSurfaceCreated(g: GL10?, c: EGLConfig?) {
            GLES20.glClearColor(0f, 0f, 0f, 1f)
            bg.create()
            cards.create()
        }

        override fun onSurfaceChanged(g: GL10?, width: Int, height: Int) {
            w = width; h = height
            GLES20.glViewport(0, 0, width, height)
            session?.setDisplayGeometry(windowManager.defaultDisplay.rotation, width, height)
        }

        override fun onDrawFrame(g: GL10?) {
            GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT or GLES20.GL_DEPTH_BUFFER_BIT)
            val s = session ?: return
            if (paused) return
            // ARCore menyerahkan bingkai kamera sebagai tekstur luaran, dan
            // ia perlu diberitahu yang MANA. Tanpa baris ini ia melukis ke
            // dalam tekstur yang tiada siapa membacanya, latar kekal hitam,
            // dan segala-galanya yang lain — jejakan, hit test, pin —
            // berjalan betul di atas skrin kosong.
            //
            // Dipanggil setiap bingkai dan bukan sekali dalam
            // onSurfaceCreated: konteks GL boleh dibina semula apabila
            // skrin dimatikan dan dihidupkan, dan id tekstur lama mati
            // bersamanya. Tiga skrin AR yang lain melakukannya begini.
            s.setCameraTextureName(bg.textureId)
            val frame: Frame = try { s.update() } catch (e: Throwable) { return }

            bg.draw(frame)

            val cam = frame.camera
            val ok = cam.trackingState == TrackingState.TRACKING
            val reason = when (cam.trackingFailureReason) {
                TrackingFailureReason.BAD_STATE -> "AR hilang jejak — gerak perlahan"
                TrackingFailureReason.INSUFFICIENT_LIGHT -> "Terlalu gelap untuk menjejak"
                TrackingFailureReason.EXCESSIVE_MOTION -> "Terlalu laju — gerak perlahan"
                TrackingFailureReason.INSUFFICIENT_FEATURES ->
                    "Dinding terlalu kosong untuk dijejak — masukkan sedikit perabot atau bucu dalam pandangan"
                TrackingFailureReason.CAMERA_UNAVAILABLE -> "Kamera diambil oleh app lain"
                else -> ""
            }
            if (tracking != ok || why != reason) {
                tracking = ok; why = reason
                runOnUiThread { if (!isFinishing) paintUi() }
            }
            if (!ok) { aim = null; smooth = null; return }

            cam.getProjectionMatrix(proj, 0, 0.05f, 100f)
            cam.getViewMatrix(view, 0)
            Matrix.multiplyMM(mul, 0, proj, 0, view, 0)
            vp = mul.copyOf()
            // Kedudukan dan paksi kamera daripada songsangan matriks
            // pandangan: kad menghadap ke sini, dan jarak memutuskan sama
            // ada ia terbuka.
            Matrix.invertM(inv, 0, view, 0)
            camPos = floatArrayOf(inv[12], inv[13], inv[14])
            camRight = norm(floatArrayOf(inv[0], inv[1], inv[2]))
            camFwd = norm(floatArrayOf(-inv[8], -inv[9], -inv[10]))

            // ---- bidikan ----
            var hit: HitResult? = null
            try {
                val hits = frame.hitTest(w / 2f, h / 2f)
                // Satah dahulu, tetapi TANPA isPoseInPolygon: bucu dinding
                // terletak di tepi poligon satah, dan menapisnya menolak
                // tepat titik yang alat ini wujud untuk menanda. Titik ciri
                // menjadi sandaran, kerana bilik yang baru dicat tidak
                // memberi satah langsung.
                hit = hits.firstOrNull {
                    val t = it.trackable
                    t is Plane && t.trackingState == TrackingState.TRACKING
                } ?: hits.firstOrNull {
                    val t = it.trackable
                    t is Point && t.orientationMode == Point.OrientationMode.ESTIMATED_SURFACE_NORMAL
                }
            } catch (e: Throwable) { /* bingkai ini tiada hit */ }

            val raw = hit?.let { floatArrayOf(it.hitPose.tx(), it.hitPose.ty(), it.hitPose.tz()) }
            if (raw == null) smooth = null
            else {
                val sm = smooth
                smooth = if (sm == null || dist(sm, raw) > 0.35f) raw.copyOf()
                else floatArrayOf(
                    sm[0] + (raw[0] - sm[0]) * SMOOTH,
                    sm[1] + (raw[1] - sm[1]) * SMOOTH,
                    sm[2] + (raw[2] - sm[2]) * SMOOTH)
            }
            aim = smooth

            // ---- niat ----
            // Anchor dicipta di sini dan bukan dalam pengendali butang: satu
            // HitResult hanya sah sehingga update() berikutnya.
            if (wantMark) { wantMark = false; doMark(hit) }
            if (wantUndo) { wantUndo = false; doUndo() }
            if (wantLock) { wantLock = false; doAddLock(hit) }
            if (wantReset) { wantReset = false; doReset() }
            if (wantDefect) {
                wantDefect = false
                val p = smooth
                if (p == null) toast("Cari permukaan dahulu")
                else {
                    val f0 = fit
                    if (f0 == null) toast("Zon belum berada")
                    else {
                        val z = ArFit.invert(p, f0)
                        shotFor = Def("", z[0], z[1], z[2], 1, "", "", true)
                    }
                }
            }
            if (tapX >= 0f) { doTap(tapX, tapY); tapX = -1f; tapY = -1f }

            // Gambar bersih, sebelum apa-apa dilukis di atasnya.
            shotFor?.let { d ->
                shotFor = null
                val shot = ArShot.capture(w, h)
                d.photo = shot?.let { scale(it, 1024) }
                d.thumb = shot?.let { scale(it, 320) }
                runOnUiThread { if (!isFinishing) askDefect(d, true) }
            }

            // ---- lukis ----
            val f0 = fit
            if (f0 != null && phase == Phase.READY) {
                val live = liveDefs()
                for ((i, d) in live.withIndex()) {
                    if (d.dirty || d.tex == 0) {
                        // Mengedit defect membina kad baharu. Tanpa membuang
                        // yang lama, setiap suntingan meninggalkan satu
                        // tekstur dalam GPU sehingga skrin ditutup.
                        if (d.tex != 0) cards.drop(d.tex)
                        d.tex = cards.upload(ArCardArt.card(d.thumb, i + 1, d.title, d.sev))
                        d.dirty = false
                    }
                }
                val items = live.mapIndexed { i, d ->
                    val wpt = ArFit.apply(floatArrayOf(d.zx, d.zy, d.zz), f0)
                    val c = ArCardArt.rgb(d.sev)
                    ArCards.Item(wpt[0], wpt[1], wpt[2], c[0], c[1], c[2],
                        d.tex, ArCardArt.W.toFloat() / ArCardArt.H)
                }
                cards.draw(vp, camPos, camFwd, camRight, items)

                // Titik kunci, supaya surveyor nampak bingkai yang dia berdiri
                // di dalamnya dan bukan hanya defect yang terapung.
                val seg = ArrayList<Float>()
                for (l in lockList()) {
                    val p = ArFit.apply(floatArrayOf(l.zx, l.zy, l.zz), f0)
                    seg.addAll(listOf(p[0] - 0.08f, p[1], p[2], p[0] + 0.08f, p[1], p[2]))
                    seg.addAll(listOf(p[0], p[1] - 0.08f, p[2], p[0], p[1] + 0.08f, p[2]))
                    seg.addAll(listOf(p[0], p[1], p[2] - 0.08f, p[0], p[1], p[2] + 0.08f))
                }
                if (seg.isNotEmpty())
                    cards.lines(vp, seg.toFloatArray(), 0.38f, 0.76f, 1f, 0.95f, 3f)
            } else {
                // Semasa mengunci: salib pada setiap titik yang sudah ditanda.
                val seg = ArrayList<Float>()
                for (a in pins) {
                    if (a.trackingState != TrackingState.TRACKING) continue
                    val p = a.pose
                    seg.addAll(listOf(p.tx() - 0.08f, p.ty(), p.tz(), p.tx() + 0.08f, p.ty(), p.tz()))
                    seg.addAll(listOf(p.tx(), p.ty() - 0.08f, p.tz(), p.tx(), p.ty() + 0.08f, p.tz()))
                    seg.addAll(listOf(p.tx(), p.ty(), p.tz() - 0.08f, p.tx(), p.ty(), p.tz() + 0.08f))
                }
                if (seg.isNotEmpty())
                    cards.lines(vp, seg.toFloatArray(), 0.38f, 0.76f, 1f, 0.95f, 3f)
            }

            overlay.postInvalidateOnAnimation()
        }

        private fun doMark(hit: HitResult?) {
            if (phase != Phase.LOCK) return
            if (hit == null) { toast("Cari permukaan dahulu"); return }
            val an = runCatching { hit.trackable.createAnchor(hit.hitPose) }.getOrNull()
            if (an == null) { toast("Tidak dapat menanda di sini"); return }
            // Gambar panduan untuk titik ini, hanya bila ia titik BAHARU.
            if (modeNew) {
                val shot = ArShot.capture(w, h)
                val l = Lock(0f, 0f, 0f, "Titik ${pins.size + 1}",
                    guide = shot?.let { ArCardArt.aimed(scale(it, 420)) })
                synchronized(bank) { locks.add(l) }
            }
            pins.add(an)
            if (pins.size >= need) settle() else runOnUiThread { if (!isFinishing) paintUi() }
        }

        private fun doUndo() {
            if (phase != Phase.LOCK || pins.isEmpty()) return
            runCatching { pins.removeAt(pins.size - 1).detach() }
            synchronized(bank) { if (modeNew && locks.isNotEmpty()) locks.removeAt(locks.size - 1) }
            runOnUiThread { if (!isFinishing) paintUi() }
        }

        /** Titik kunci tambahan selepas zon berada: setiap satu menjadikan
         *  lawatan berikutnya lebih tepat, dan menjadi saksi kalau satu
         *  daripada yang lama musnah. */
        private fun doAddLock(hit: HitResult?) {
            val f0 = fit ?: return
            if (hit == null) { toast("Cari permukaan dahulu"); return }
            val p = floatArrayOf(hit.hitPose.tx(), hit.hitPose.ty(), hit.hitPose.tz())
            val z = ArFit.invert(p, f0)
            val shot = ArShot.capture(w, h)
            val n = synchronized(bank) {
                locks.add(Lock(z[0], z[1], z[2], "Titik ${locks.size + 1}",
                    guide = shot?.let { ArCardArt.aimed(scale(it, 420)) }))
                locks.size
            }
            toast("Titik kunci $n ditambah")
            runOnUiThread { if (!isFinishing) paintUi() }
        }

        /** Semua titik sudah ditanda: bina bingkai, atau padankan dengannya. */
        private fun settle() {
            val world = pins.map {
                val p = it.pose; floatArrayOf(p.tx(), p.ty(), p.tz())
            }
            if (modeNew) {
                val f0 = ArFit.frame(world)
                if (f0 == null) {
                    toast("Titik terlalu rapat atau sebaris — pilih bucu yang lebih berjauhan")
                    doUndo(); return
                }
                synchronized(bank) {
                    for ((i, w) in world.withIndex()) {
                        val z = ArFit.invert(w, f0)
                        locks[i].zx = z[0]; locks[i].zy = z[1]; locks[i].zz = z[2]
                    }
                }
                fit = f0; rms = 0f; badPoint = -1
            } else {
                val zone = lockList().map { floatArrayOf(it.zx, it.zy, it.zz) }
                // Bentuk diperiksa SEBELUM dipadankan. Padanan akan sentiasa
                // memulangkan sesuatu; jarak antara bucu bilik tidak berubah,
                // jadi inilah yang menangkap bucu yang salah dan menamakannya.
                val (who, off) = ArFit.shapeError(zone, world)
                if (who >= 0 && off > 0.25f) {
                    runOnUiThread {
                        if (isFinishing) return@runOnUiThread
                        AlertDialog.Builder(this@ArInspectActivity)
                            .setTitle("Titik ${who + 1} tidak padan")
                            .setMessage("Jaraknya ke titik lain tersasar ${fmtMm(off)} " +
                                "daripada yang direkod. Biasanya ini bermakna bucu yang salah " +
                                "ditanda — atau sesuatu di tempat itu sudah berubah.")
                            .setPositiveButton("Tanda semula") { _, _ -> wantReset = true }
                            .setNegativeButton("Teruskan juga") { _, _ -> accept(zone, world) }
                            .setCancelable(false)
                            .show()
                    }
                    return
                }
                accept(zone, world)
                return
            }
            runOnUiThread {
                if (isFinishing) return@runOnUiThread
                phase = Phase.READY
                paintUi()
            }
        }

        private fun accept(zone: List<FloatArray>, world: List<FloatArray>) {
            val f0 = ArFit.solve(zone, world)
            if (f0 == null) {
                toast("Titik terlalu rapat atau sebaris — tanda semula")
                wantReset = true
                return
            }
            fit = f0; rms = f0.rms; badPoint = f0.worst
            runOnUiThread {
                if (isFinishing) return@runOnUiThread
                phase = Phase.READY
                paintUi()
                if (f0.rms > 0.15f) {
                    AlertDialog.Builder(this@ArInspectActivity)
                        .setTitle("Padanan lemah: ${fmtMm(f0.rms)}")
                        .setMessage("Defect akan muncul lebih kurang sejauh itu daripada " +
                            "tempat sebenarnya. Tanda semula dengan lebih tepat, atau teruskan " +
                            "kalau anggaran sudah memadai.")
                        .setPositiveButton("Tanda semula") { _, _ -> wantReset = true }
                        .setNegativeButton("Teruskan", null)
                        .show()
                }
            }
        }

        /** Anchor dimiliki oleh benang GL. Butang dialog hanya meminta. */
        private fun doReset() {
            pins.forEach { runCatching { it.detach() } }
            pins.clear()
            fit = null; rms = 0f; badPoint = -1
            phase = Phase.LOCK
            runOnUiThread { if (!isFinishing) paintUi() }
        }

        /** Ketik satu kad atau pin untuk membukanya. */
        private fun doTap(x: Float, y: Float) {
            val f0 = fit ?: return
            if (phase != Phase.READY) return
            val live = liveDefs()
            var best = -1
            var bestD = dp(64).toFloat()
            for ((i, d) in live.withIndex()) {
                val wpt = ArFit.apply(floatArrayOf(d.zx, d.zy, d.zz), f0)
                val sp = project(wpt) ?: continue
                val dd = sqrt((sp[0] - x) * (sp[0] - x) + (sp[1] - y) * (sp[1] - y))
                if (dd < bestD) { bestD = dd; best = i }
            }
            if (best < 0) return
            val d = live[best]
            runOnUiThread { if (!isFinishing) askDefect(d, false) }
        }

        /** Titik dunia ke piksel skrin, atau null kalau di belakang kamera. */
        private fun project(p: FloatArray): FloatArray? {
            val v = floatArrayOf(p[0], p[1], p[2], 1f)
            val o = FloatArray(4)
            Matrix.multiplyMV(o, 0, vp, 0, v, 0)
            if (o[3] <= 1e-5f) return null
            val nx = o[0] / o[3]
            val ny = o[1] / o[3]
            return floatArrayOf((nx * 0.5f + 0.5f) * w, (1f - (ny * 0.5f + 0.5f)) * h)
        }
    }

    private fun scale(b: Bitmap, max: Int): Bitmap {
        val m = maxOf(b.width, b.height)
        if (m <= max) return b
        val k = max.toFloat() / m
        return Bitmap.createScaledBitmap(b, (b.width * k).toInt(), (b.height * k).toInt(), true)
    }

    private fun norm(v: FloatArray): FloatArray {
        val d = sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
        return if (d < 1e-6f) floatArrayOf(0f, 0f, -1f)
        else floatArrayOf(v[0] / d, v[1] / d, v[2] / d)
    }

    private fun dist(a: FloatArray, b: FloatArray): Float {
        val dx = a[0] - b[0]; val dy = a[1] - b[1]; val dz = a[2] - b[2]
        return sqrt(dx * dx + dy * dy + dz * dz)
    }

    // ---------- hamparan 2D ----------

    /**
     * Hanya silang bidikan. Semua yang terikat pada tempat di dunia —
     * pin, kad, titik kunci — dilukis dalam bingkai GL, kerana lapisan ini
     * dilukis oleh benang UI selepas benang GL membentangkan kameranya dan
     * sentiasa satu dua bingkai ketinggalan.
     */
    private inner class Overlay(ctx: android.content.Context) : View(ctx) {
        private val p = Paint(Paint.ANTI_ALIAS_FLAG)

        override fun onDraw(c: Canvas) {
            val cx = width / 2f
            val cy = height / 2f
            val on = aim != null
            p.style = Paint.Style.STROKE
            p.strokeWidth = dp(2).toFloat()
            p.color = if (on) Color.rgb(96, 220, 140) else Color.argb(150, 255, 255, 255)
            c.drawCircle(cx, cy, dp(13).toFloat(), p)
            p.strokeWidth = dp(1).toFloat()
            c.drawLine(cx - dp(22), cy, cx - dp(7), cy, p)
            c.drawLine(cx + dp(7), cy, cx + dp(22), cy, p)
            c.drawLine(cx, cy - dp(22), cx, cy - dp(7), p)
            c.drawLine(cx, cy + dp(7), cx, cy + dp(22), p)
            if (on) {
                p.style = Paint.Style.FILL
                c.drawCircle(cx, cy, dp(3).toFloat(), p)
            }
        }
    }
}
