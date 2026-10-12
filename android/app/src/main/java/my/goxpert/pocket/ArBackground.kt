package my.goxpert.pocket

import android.opengl.GLES11Ext
import android.opengl.GLES20
import com.google.ar.core.Coordinates2d
import com.google.ar.core.Frame
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.FloatBuffer

/**
 * Latar kamera. ARCore menyerahkan bingkai sebagai tekstur luaran sahaja,
 * jadi ia mesti dilukis sendiri; ini jumlah minimum untuk melakukannya.
 */
class ArBackground {
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
