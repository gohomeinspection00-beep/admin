package my.goxpert.pocket

import android.graphics.Bitmap
import android.opengl.GLES20
import android.opengl.GLUtils
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer
import kotlin.math.sqrt

/**
 * Pin defect, dan kad gambar yang terapung di atasnya.
 *
 * Dilukis dalam bingkai GL yang sama dengan imej kamera, bukan sebagai
 * lapisan View di atasnya. Sebabnya sudah ditemui dua kali dalam app ini:
 * lapisan 2D dilukis oleh benang UI selepas benang GL membentangkan
 * bingkai kameranya, jadi kedua-duanya sentiasa satu dua bingkai berbeza,
 * dan semuanya kelihatan berenang apabila telefon digerakkan.
 *
 * Kad tidak diletakkan pada defect itu sendiri. Gambar retak yang
 * menutupi retak itu tidak berguna kepada sesiapa, jadi pin menanda
 * tempatnya dan kad terapung di atasnya dengan satu garis penghubung.
 *
 * Saiz mengikut jarak supaya sudut yang dilihat kekal sama: kad tiga meter
 * jauh dilukis lebih besar dalam meter, jadi ia kekal sebesar itu pada
 * skrin. Tanpa itu, bilik dengan dua puluh defect menjadi tompok yang
 * tidak boleh dibaca di hujung yang jauh.
 */
class ArCards {

    /** Satu defect: tempatnya, warna keterukannya, dan kadnya. */
    class Item(
        val x: Float, val y: Float, val z: Float,
        val r: Float, val g: Float, val b: Float,
        /** 0 bermakna pin sahaja. */
        var tex: Int = 0,
        var aspect: Float = 1.28f,
        /** Pudar: defect dalam zon ini yang sudah ditanda siap. */
        var dim: Boolean = false
    )

    private var program = 0
    private var aPos = 0
    private var aTex = 0
    private var uMvp = 0
    private var uColour = 0
    private var uMode = 0
    private var uAlpha = 0

    private val quad = buf(FloatArray(12))
    private val quadUv = buf(floatArrayOf(0f, 0f, 0f, 1f, 1f, 0f, 1f, 1f))
    private val line = buf(FloatArray(6))
    private val tex = ArrayList<Int>()

    /** Lebih jauh daripada ini, kad menguncup menjadi pin sahaja. */
    var openTo = 3.5f
    /** Pandang terus pada satu pin dalam kon ini dan kadnya terbuka semula. */
    var aimCos = 0.985f          // lebih kurang 10 darjah

    fun create() {
        if (program != 0) return
        val vs = compile(GLES20.GL_VERTEX_SHADER, """
            uniform mat4 uMvp;
            attribute vec4 aPos;
            attribute vec2 aTex;
            varying vec2 vTex;
            void main() { vTex = aTex; gl_Position = uMvp * aPos; }
        """.trimIndent())
        val fs = compile(GLES20.GL_FRAGMENT_SHADER, """
            precision mediump float;
            uniform sampler2D uTex;
            uniform vec4 uColour;
            uniform float uMode;
            uniform float uAlpha;
            varying vec2 vTex;
            void main() {
              if (uMode > 1.5) {
                // Pin: cakera dengan cincin putih, supaya ia kelihatan
                // sama ada di atas dinding gelap atau siling terang.
                vec2 d = vTex - vec2(0.5);
                float r = length(d);
                if (r > 0.5) discard;
                float ring = smoothstep(0.33, 0.40, r);
                gl_FragColor = vec4(mix(uColour.rgb, vec3(1.0), ring), uAlpha);
              } else if (uMode > 0.5) {
                gl_FragColor = vec4(uColour.rgb, uColour.a * uAlpha);
              } else {
                vec4 t = texture2D(uTex, vTex);
                gl_FragColor = vec4(t.rgb, t.a * uAlpha);
              }
            }
        """.trimIndent())
        program = GLES20.glCreateProgram()
        GLES20.glAttachShader(program, vs)
        GLES20.glAttachShader(program, fs)
        GLES20.glLinkProgram(program)
        aPos = GLES20.glGetAttribLocation(program, "aPos")
        aTex = GLES20.glGetAttribLocation(program, "aTex")
        uMvp = GLES20.glGetUniformLocation(program, "uMvp")
        uColour = GLES20.glGetUniformLocation(program, "uColour")
        uMode = GLES20.glGetUniformLocation(program, "uMode")
        uAlpha = GLES20.glGetUniformLocation(program, "uAlpha")
    }

    /** Mesti dipanggil pada benang GL. Memulangkan id tekstur. */
    fun upload(bmp: Bitmap): Int {
        val ids = IntArray(1)
        GLES20.glGenTextures(1, ids, 0)
        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, ids[0])
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR)
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR)
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE)
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE)
        GLUtils.texImage2D(GLES20.GL_TEXTURE_2D, 0, bmp, 0)
        tex.add(ids[0])
        return ids[0]
    }

    /**
     * @param vp    unjuran x pandangan daripada ARCore
     * @param cam   kedudukan kamera dalam dunia
     * @param fwd   arah pandangan kamera, unit
     * @param right paksi kanan kamera, unit
     * @param openAll buka setiap kad tidak kira jarak
     */
    fun draw(vp: FloatArray, cam: FloatArray, fwd: FloatArray, right: FloatArray,
             items: List<Item>, openAll: Boolean = false) {
        if (program == 0 || items.isEmpty()) return

        GLES20.glUseProgram(program)
        GLES20.glEnable(GLES20.GL_BLEND)
        GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE_MINUS_SRC_ALPHA)
        // Latar kamera dilukis tanpa kedalaman, jadi tiada apa yang bermakna
        // untuk diuji terhadapnya. Susunan belakang-ke-hadapan di bawah yang
        // membuat kad hadapan menimpa kad belakang.
        GLES20.glDisable(GLES20.GL_DEPTH_TEST)
        GLES20.glUniformMatrix4fv(uMvp, 1, false, vp, 0)
        GLES20.glEnableVertexAttribArray(aPos)

        // Jauh dahulu. Dengan campuran alfa dan tiada kedalaman, susunan
        // ini sahaja yang menentukan apa yang menimpa apa.
        val order = items.indices.sortedByDescending { dist2(items[it], cam) }

        for (i in order) {
            val it = items[i]
            val dx = it.x - cam[0]; val dy = it.y - cam[1]; val dz = it.z - cam[2]
            val d = sqrt(dx * dx + dy * dy + dz * dz).coerceAtLeast(0.05f)
            val alpha = if (it.dim) 0.45f else 1f

            // Kad: dekat, atau dipandang terus, atau semua dibuka.
            val aimed = (dx * fwd[0] + dy * fwd[1] + dz * fwd[2]) / d > aimCos
            val show = it.tex != 0 && (openAll || d <= openTo || aimed)

            if (show) {
                val h = (d * 0.20f).coerceIn(0.13f, 0.60f)
                val w = h * it.aspect
                // Naik mengikut graviti dan bukan mengikut atas kamera: kad
                // kekal di ATAS defect walaupun telefon dicondongkan.
                val cy = it.y + h * 0.5f + 0.12f
                // Lebar mengikut kanan kamera, tinggi mengikut graviti: kad
                // menghadap kamera tetapi tidak pernah terbalik.
                billboard(it.x, cy, it.z, right, w * 0.5f, h * 0.5f)
                GLES20.glUniform1f(uMode, 0f)
                GLES20.glUniform1f(uAlpha, alpha)
                GLES20.glActiveTexture(GLES20.GL_TEXTURE0)
                GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, it.tex)
                GLES20.glVertexAttribPointer(aPos, 3, GLES20.GL_FLOAT, false, 0, quad)
                GLES20.glVertexAttribPointer(aTex, 2, GLES20.GL_FLOAT, false, 0, quadUv)
                GLES20.glEnableVertexAttribArray(aTex)
                GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4)
                GLES20.glDisableVertexAttribArray(aTex)

                // Garis penghubung, pin ke bawah kad.
                line.clear()
                line.put(floatArrayOf(it.x, it.y, it.z, it.x, cy - h * 0.5f, it.z))
                line.position(0)
                GLES20.glUniform1f(uMode, 1f)
                GLES20.glUniform4f(uColour, it.r, it.g, it.b, 0.9f)
                GLES20.glLineWidth(3f)
                GLES20.glVertexAttribPointer(aPos, 3, GLES20.GL_FLOAT, false, 0, line)
                GLES20.glDrawArrays(GLES20.GL_LINES, 0, 2)
            }

            // Pin, sentiasa.
            val pr = (d * 0.014f).coerceIn(0.012f, 0.06f)
            billboard(it.x, it.y, it.z, right, pr, pr)
            GLES20.glUniform1f(uMode, 2f)
            GLES20.glUniform1f(uAlpha, alpha)
            GLES20.glUniform4f(uColour, it.r, it.g, it.b, 1f)
            GLES20.glVertexAttribPointer(aPos, 3, GLES20.GL_FLOAT, false, 0, quad)
            GLES20.glVertexAttribPointer(aTex, 2, GLES20.GL_FLOAT, false, 0, quadUv)
            GLES20.glEnableVertexAttribArray(aTex)
            GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4)
            GLES20.glDisableVertexAttribArray(aTex)
        }

        GLES20.glDisableVertexAttribArray(aPos)
        GLES20.glDisable(GLES20.GL_BLEND)
    }

    /** Segmen garis dunia sewenang-wenangnya, untuk titik kunci dan bantuan. */
    fun lines(vp: FloatArray, pts: FloatArray, r: Float, g: Float, b: Float, a: Float, w: Float) {
        if (program == 0 || pts.size < 6) return
        if (lineBuf == null || lineBuf!!.capacity() < pts.size) lineBuf = buf(FloatArray(pts.size))
        val lb = lineBuf!!
        lb.clear(); lb.put(pts); lb.position(0)
        GLES20.glUseProgram(program)
        GLES20.glEnable(GLES20.GL_BLEND)
        GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE_MINUS_SRC_ALPHA)
        GLES20.glDisable(GLES20.GL_DEPTH_TEST)
        GLES20.glUniformMatrix4fv(uMvp, 1, false, vp, 0)
        GLES20.glUniform1f(uMode, 1f)
        GLES20.glUniform1f(uAlpha, 1f)
        GLES20.glUniform4f(uColour, r, g, b, a)
        GLES20.glLineWidth(w)
        GLES20.glVertexAttribPointer(aPos, 3, GLES20.GL_FLOAT, false, 0, lb)
        GLES20.glEnableVertexAttribArray(aPos)
        GLES20.glDrawArrays(GLES20.GL_LINES, 0, pts.size / 3)
        GLES20.glDisableVertexAttribArray(aPos)
        GLES20.glDisable(GLES20.GL_BLEND)
    }

    /** Buang satu tekstur kad yang sudah digantikan. */
    fun drop(id: Int) {
        if (id == 0) return
        tex.remove(id)
        GLES20.glDeleteTextures(1, intArrayOf(id), 0)
    }

    fun release() {
        if (tex.isNotEmpty()) {
            val ids = tex.toIntArray()
            GLES20.glDeleteTextures(ids.size, ids, 0)
            tex.clear()
        }
    }

    /** Segi empat menghadap kamera: lebar ikut kanan kamera, tinggi ikut
     *  graviti. Jalur segi tiga: KiriAtas, KiriBawah, KananAtas, KananBawah. */
    private fun billboard(cx: Float, cy: Float, cz: Float, right: FloatArray, hw: Float, hh: Float) {
        val rx = right[0] * hw; val ry = right[1] * hw; val rz = right[2] * hw
        quad.clear()
        quad.put(floatArrayOf(
            cx - rx, cy + hh, cz - rz,
            cx - rx, cy - hh, cz - rz,
            cx + rx, cy + hh, cz + rz,
            cx + rx, cy - hh, cz + rz))
        quad.position(0)
    }

    private fun dist2(it: Item, cam: FloatArray): Float {
        val dx = it.x - cam[0]; val dy = it.y - cam[1]; val dz = it.z - cam[2]
        return dx * dx + dy * dy + dz * dz
    }

    private var lineBuf: FloatBuffer? = null

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
