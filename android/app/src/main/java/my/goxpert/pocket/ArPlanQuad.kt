package my.goxpert.pocket

import android.graphics.Bitmap
import android.opengl.GLES20
import android.opengl.GLUtils
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer

/**
 * Pelan sebagai segi empat bertekstur, dilukis dalam bingkai GL yang sama
 * dengan imej kamera.
 *
 * Ia dahulu dilukis pada lapisan 2D di atas, dengan Canvas.setPolyToPoly.
 * Matematiknya betul dan titik yang diletak kekal di tempatnya, tetapi
 * seluruh pelan kelihatan berenang apabila telefon digerakkan: View itu
 * dilukis oleh benang UI selepas benang GL sudah membentangkan bingkai
 * kameranya, jadi kedua-duanya sentiasa satu dua bingkai berbeza. Pada
 * kursor sebesar ibu jari jurang itu tidak kelihatan; pada pelan sebesar
 * skrin ia jelas.
 *
 * Dilukis di sini, pelan dan kamera adalah bingkai yang sama, sentiasa.
 */
class ArPlanQuad {

    private var program = 0
    private var aPos = 0
    private var aTex = 0
    private var uMvp = 0
    private var uAlpha = 0
    private var uFlat = 0
    private var uColour = 0
    private var tex = 0

    private val verts: FloatBuffer = buf(FloatArray(12))
    /** Jalur segi tiga: KiriAtas, KiriBawah, KananAtas, KananBawah. */
    private val uvs: FloatBuffer = buf(floatArrayOf(0f, 0f, 0f, 1f, 1f, 0f, 1f, 1f))
    private val loop: FloatBuffer = buf(FloatArray(12))

    fun create(bmp: Bitmap) {
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
            uniform float uAlpha;
            uniform float uFlat;
            uniform vec4 uColour;
            varying vec2 vTex;
            void main() {
              vec4 t = texture2D(uTex, vTex);
              gl_FragColor = mix(vec4(t.rgb, t.a * uAlpha), uColour, uFlat);
            }
        """.trimIndent())
        program = GLES20.glCreateProgram()
        GLES20.glAttachShader(program, vs)
        GLES20.glAttachShader(program, fs)
        GLES20.glLinkProgram(program)
        aPos = GLES20.glGetAttribLocation(program, "aPos")
        aTex = GLES20.glGetAttribLocation(program, "aTex")
        uMvp = GLES20.glGetUniformLocation(program, "uMvp")
        uAlpha = GLES20.glGetUniformLocation(program, "uAlpha")
        uFlat = GLES20.glGetUniformLocation(program, "uFlat")
        uColour = GLES20.glGetUniformLocation(program, "uColour")

        val ids = IntArray(1)
        GLES20.glGenTextures(1, ids, 0)
        tex = ids[0]
        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, tex)
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR)
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR)
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE)
        GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE)
        GLUtils.texImage2D(GLES20.GL_TEXTURE_2D, 0, bmp, 0)
    }

    /**
     * corners ialah 12 apungan: empat bucu dunia mengikut urutan kiri-atas,
     * kanan-atas, kanan-bawah, kiri-bawah — susunan yang sama yang fpCorners
     * dalam Pocket hasilkan.
     */
    fun draw(vp: FloatArray, corners: FloatArray, alpha: Float) {
        if (program == 0 || corners.size != 12) return

        // Susun semula kepada jalur segi tiga: KA, KB, KnA, KnB.
        val v = floatArrayOf(
            corners[0], corners[1], corners[2],      // kiri atas
            corners[9], corners[10], corners[11],    // kiri bawah
            corners[3], corners[4], corners[5],      // kanan atas
            corners[6], corners[7], corners[8])      // kanan bawah
        verts.clear(); verts.put(v); verts.position(0)

        GLES20.glUseProgram(program)
        GLES20.glEnable(GLES20.GL_BLEND)
        GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE_MINUS_SRC_ALPHA)
        // Tiada ujian kedalaman: latar kamera dilukis tanpa kedalaman, jadi
        // tiada apa yang bermakna untuk diuji terhadapnya.
        GLES20.glDisable(GLES20.GL_DEPTH_TEST)

        GLES20.glUniformMatrix4fv(uMvp, 1, false, vp, 0)
        GLES20.glActiveTexture(GLES20.GL_TEXTURE0)
        GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, tex)
        GLES20.glUniform1f(uAlpha, alpha)
        GLES20.glUniform1f(uFlat, 0f)
        GLES20.glUniform4f(uColour, 0f, 0f, 0f, 0f)

        GLES20.glVertexAttribPointer(aPos, 3, GLES20.GL_FLOAT, false, 0, verts)
        GLES20.glVertexAttribPointer(aTex, 2, GLES20.GL_FLOAT, false, 0, uvs)
        GLES20.glEnableVertexAttribArray(aPos)
        GLES20.glEnableVertexAttribArray(aTex)
        GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4)

        // Tepi, supaya pelan yang sangat lut sinar masih boleh dicari.
        loop.clear(); loop.put(corners); loop.position(0)
        GLES20.glUniform1f(uFlat, 1f)
        GLES20.glUniform4f(uColour, 0.35f, 0.78f, 1f, 0.9f)
        GLES20.glLineWidth(3f)
        GLES20.glVertexAttribPointer(aPos, 3, GLES20.GL_FLOAT, false, 0, loop)
        GLES20.glDrawArrays(GLES20.GL_LINE_LOOP, 0, 4)

        GLES20.glDisableVertexAttribArray(aPos)
        GLES20.glDisableVertexAttribArray(aTex)
        GLES20.glDisable(GLES20.GL_BLEND)
    }

    /** Segmen garis sewenang-wenang dalam ruang dunia: 6 apungan setiap
     *  segmen. Dilukis dengan program yang sama dalam mod warna rata. */
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
        GLES20.glUniform1f(uFlat, 1f)
        GLES20.glUniform4f(uColour, r, g, b, a)
        GLES20.glLineWidth(w)
        GLES20.glVertexAttribPointer(aPos, 3, GLES20.GL_FLOAT, false, 0, lb)
        GLES20.glEnableVertexAttribArray(aPos)
        GLES20.glDrawArrays(GLES20.GL_LINES, 0, pts.size / 3)
        GLES20.glDisableVertexAttribArray(aPos)
        GLES20.glDisable(GLES20.GL_BLEND)
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
