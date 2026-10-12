package my.goxpert.pocket

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.opengl.GLES11Ext
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
import com.google.ar.core.Config
import com.google.ar.core.Coordinates2d
import com.google.ar.core.Frame
import com.google.ar.core.Plane
import com.google.ar.core.Point
import com.google.ar.core.Session
import com.google.ar.core.TrackingState
import com.google.ar.core.exceptions.CameraNotAvailableException
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
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

    private val bg = Background()

    /** Titik yang diletak, dalam ruang dunia. */
    private val pts = ArrayList<FloatArray>()

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
        fun mk(label: String, weight: Float): Button =
            Button(this).apply {
                text = label
                isAllCaps = false
                layoutParams = LinearLayout.LayoutParams(0, dp(52), weight)
                    .apply { marginEnd = dp(6) }
            }

        undoBtn = mk("Undo", 1f).apply { isEnabled = false; setOnClickListener { undo() } }
        val place = mk("Letak titik", 1.6f).apply { setOnClickListener { place() } }
        doneBtn = mk("Siap", 1f).apply { isEnabled = false; setOnClickListener { finishWith() } }

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
        val p = aim
        if (p == null) {
            Toast.makeText(this, "Belum ada satah di tengah skrin", Toast.LENGTH_SHORT).show()
            return
        }
        pts.add(p.copyOf())
        runOnUiThread { paintText() }
    }

    private fun undo() {
        if (pts.isNotEmpty()) pts.removeAt(pts.size - 1)
        paintText()
    }

    private fun dist(a: FloatArray, b: FloatArray): Float {
        val dx = a[0] - b[0]; val dy = a[1] - b[1]; val dz = a[2] - b[2]
        return sqrt(dx * dx + dy * dy + dz * dz)
    }

    /** Panjang setakat ini, termasuk segmen hidup ke reticle. */
    private fun liveLen(): Float {
        var m = 0f
        for (i in 1 until pts.size) m += dist(pts[i - 1], pts[i])
        val a = aim
        if (a != null && pts.isNotEmpty()) m += dist(pts[pts.size - 1], a)
        return m
    }

    private fun fmt(m: Float): String {
        val cm = m * 100
        return if (cm < 100) String.format("%.1f cm", cm) else String.format("%.2f m", m)
    }

    @SuppressLint("SetTextI18n")
    private fun paintText() {
        val need = if (kind == "dist") 2 else 3
        undoBtn.isEnabled = pts.isNotEmpty()
        doneBtn.isEnabled = pts.size >= need

        readout.text = when {
            pts.isEmpty() -> "—"
            else -> fmt(liveLen())
        }
        hint.text = when {
            !tracking -> "Gerak telefon perlahan supaya ARCore nampak permukaan…"
            aim == null -> "Halakan bulatan ke permukaan"
            kind == "dist" && pts.isEmpty() -> "Ketik Letak titik pada hujung pertama"
            kind == "dist" && pts.size == 1 -> "Jalan ke hujung kedua, letak titik lagi"
            kind == "dist" -> "Tekan Siap, atau Undo untuk ubah"
            pts.size < 3 -> "Letak titik demi titik sepanjang dinding (${pts.size})"
            else -> "${pts.size} titik · tekan Siap"
        }
    }

    private fun finishWith() {
        val sb = StringBuilder("[")
        pts.forEachIndexed { i, p ->
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
        private val ring = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(3).toFloat(); color = Color.WHITE
        }
        private val line = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            style = Paint.Style.STROKE; strokeWidth = dp(3).toFloat(); color = Color.rgb(255, 196, 0)
        }
        private val lbl = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.WHITE; textSize = dp(14).toFloat(); textAlign = Paint.Align.CENTER
        }
        private val lblBg = Paint(Paint.ANTI_ALIAS_FLAG).apply { color = Color.argb(190, 0, 0, 0) }
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
            // Reticle: sentiasa di tengah, pejal bila ia menyentuh sesuatu.
            val cx = width / 2f
            val cy = height / 2f
            ring.color = if (aim != null) Color.rgb(255, 196, 0) else Color.argb(120, 255, 255, 255)
            c.drawCircle(cx, cy, dp(13).toFloat(), ring)
            if (aim != null) c.drawCircle(cx, cy, dp(4).toFloat(), dot)

            val screen = ArrayList<FloatArray?>(pts.size)
            for (p in pts) screen.add(toScreen(p))

            for (i in 1 until screen.size) {
                val a = screen[i - 1] ?: continue
                val b = screen[i] ?: continue
                c.drawLine(a[0], a[1], b[0], b[1], line)
                tag(c, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, fmt(dist(pts[i - 1], pts[i])))
            }

            // Segmen hidup dari titik terakhir ke reticle.
            val last = screen.lastOrNull()
            if (last != null && aim != null) {
                c.drawLine(last[0], last[1], cx, cy, line)
                tag(c, (last[0] + cx) / 2, (last[1] + cy) / 2,
                    fmt(dist(pts[pts.size - 1], aim!!)))
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
            if (tracking != ok) { tracking = ok; runOnUiThread { paintText() } }
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
            try {
                val hits = frame.hitTest(gl.width / 2f, gl.height / 2f)
                for (h in hits) {
                    val t = h.trackable
                    val inside = (t is Plane && t.isPoseInPolygon(h.hitPose)) ||
                        (t is Point && t.orientationMode ==
                            Point.OrientationMode.ESTIMATED_SURFACE_NORMAL)
                    if (inside) {
                        found = floatArrayOf(h.hitPose.tx(), h.hitPose.ty(), h.hitPose.tz())
                        break
                    }
                }
            } catch (e: Throwable) { /* bingkai ini tiada hit; cuba yang seterusnya */ }

            val had = aim != null
            aim = found
            if (had != (found != null)) runOnUiThread { paintText() }
            postOverlay()
        }

        private fun postOverlay() {
            overlay.postInvalidateOnAnimation()
            if (pts.isNotEmpty()) runOnUiThread { readout.text = fmt(liveLen()) }
        }
    }

    /**
     * Latar kamera. ARCore menyerahkan bingkai sebagai tekstur luaran sahaja,
     * jadi ia mesti dilukis sendiri; ini jumlah minimum untuk melakukannya.
     */
    inner class Background {
        var textureId = -1; private set
        private var program = 0
        private var aPos = 0
        private var aTex = 0
        private var uTex = 0
        private lateinit var coords: FloatBuffer
        private lateinit var texCoords: FloatBuffer

        fun create() {
            val ids = IntArray(1)
            GLES20.glGenTextures(1, ids, 0)
            textureId = ids[0]
            val t = GLES11Ext.GL_TEXTURE_EXTERNAL_OES
            GLES20.glBindTexture(t, textureId)
            GLES20.glTexParameteri(t, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE)
            GLES20.glTexParameteri(t, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE)
            GLES20.glTexParameteri(t, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR)
            GLES20.glTexParameteri(t, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR)

            coords = buf(floatArrayOf(-1f, -1f, 1f, -1f, -1f, 1f, 1f, 1f))
            texCoords = buf(FloatArray(8))

            val vs = compile(GLES20.GL_VERTEX_SHADER, """
                attribute vec4 a_Position;
                attribute vec2 a_TexCoord;
                varying vec2 v_TexCoord;
                void main() { gl_Position = a_Position; v_TexCoord = a_TexCoord; }
            """.trimIndent())
            val fs = compile(GLES20.GL_FRAGMENT_SHADER, """
                #extension GL_OES_EGL_image_external : require
                precision mediump float;
                varying vec2 v_TexCoord;
                uniform samplerExternalOES sTexture;
                void main() { gl_FragColor = texture2D(sTexture, v_TexCoord); }
            """.trimIndent())
            program = GLES20.glCreateProgram()
            GLES20.glAttachShader(program, vs)
            GLES20.glAttachShader(program, fs)
            GLES20.glLinkProgram(program)
            aPos = GLES20.glGetAttribLocation(program, "a_Position")
            aTex = GLES20.glGetAttribLocation(program, "a_TexCoord")
            uTex = GLES20.glGetUniformLocation(program, "sTexture")
        }

        fun draw(frame: Frame) {
            if (frame.hasDisplayGeometryChanged()) {
                frame.transformCoordinates2d(
                    Coordinates2d.OPENGL_NORMALIZED_DEVICE_COORDINATES, coords,
                    Coordinates2d.TEXTURE_NORMALIZED, texCoords)
            }
            if (frame.timestamp == 0L) return   // belum ada bingkai

            GLES20.glDisable(GLES20.GL_DEPTH_TEST)
            GLES20.glDepthMask(false)
            GLES20.glUseProgram(program)
            GLES20.glActiveTexture(GLES20.GL_TEXTURE0)
            GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, textureId)
            GLES20.glUniform1i(uTex, 0)
            coords.position(0); texCoords.position(0)
            GLES20.glVertexAttribPointer(aPos, 2, GLES20.GL_FLOAT, false, 0, coords)
            GLES20.glVertexAttribPointer(aTex, 2, GLES20.GL_FLOAT, false, 0, texCoords)
            GLES20.glEnableVertexAttribArray(aPos)
            GLES20.glEnableVertexAttribArray(aTex)
            GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4)
            GLES20.glDisableVertexAttribArray(aPos)
            GLES20.glDisableVertexAttribArray(aTex)
            GLES20.glDepthMask(true)
            GLES20.glEnable(GLES20.GL_DEPTH_TEST)
        }

        private fun buf(v: FloatArray): FloatBuffer =
            ByteBuffer.allocateDirect(v.size * 4).order(ByteOrder.nativeOrder())
                .asFloatBuffer().apply { put(v); position(0) }

        private fun compile(type: Int, src: String): Int {
            val id = GLES20.glCreateShader(type)
            GLES20.glShaderSource(id, src)
            GLES20.glCompileShader(id)
            return id
        }
    }
}
