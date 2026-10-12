package my.goxpert.pocket

import android.opengl.GLES20

/**
 * Model 3D dilukis dalam bingkai GL yang sama dengan imej kamera.
 *
 * Ini bukan pilihan gaya. Lapisan di atas bingkai kamera — sama ada View 2D
 * atau WebView lutsinar — dilukis oleh benang lain selepas benang GL sudah
 * membentangkan kameranya, jadi kedua-duanya sentiasa satu dua bingkai
 * berbeza. Pada kursor sebesar ibu jari jurang itu tidak kelihatan; pada
 * bangunan sebesar bilik ia kelihatan seperti seluruh model berenang setiap
 * kali telefon digerakkan. Masalah itu sudah ditemui dua kali dalam app ini.
 *
 * Potong ialah dua uniform dan satu baris discard, bukan pustaka. Itulah
 * sebab utama perender ditulis di sini dan bukan diserahkan kepada Filament:
 * Filament tiada API satah potong sama sekali, dan benda yang paling
 * diperlukan di sini akan menjadi benda yang paling susah di sana.
 *
 * Tiada tekstur. Warna asas setiap bahan, dengan lorekan ikut normal.
 * Eksport Revit, IFC dan SketchUp hampir selalu warna rata, dan untuk
 * membaca satu keratan ia lebih jelas daripada PBR.
 */
class ArModelMesh {

    private var program = 0
    private var aPos = 0
    private var aNrm = 0
    private var uVp = 0
    private var uModel = 0
    private var uNrm = 0
    private var uColour = 0
    private var uHi = 0
    private var uLo = 0
    private var uAlpha = 0
    private var uLight = 0
    private var uBack = 0

    private class Gpu(val group: String, val colour: FloatArray,
                      val vbPos: Int, val vbNrm: Int, val ib: Int, val indices: Int)

    private val parts = ArrayList<Gpu>()
    var tris = 0; private set
    var groups: List<String> = emptyList(); private set

    /** Mesti dipanggil pada benang GL. Penimbal dilepaskan sebaik ia berada
     *  dalam GPU — model 900k segi tiga ialah berpuluh MB, dan menyimpan dua
     *  salinan tiada gunanya. */
    fun create(m: Glb.Model) {
        if (program == 0) program = buildProgram()
        tris = m.tris
        groups = m.groups
        for (b in m.batches) {
            val p = b.pos ?: continue
            val n = b.nrm ?: continue
            val i = b.idx ?: continue
            val ids = IntArray(3)
            GLES20.glGenBuffers(3, ids, 0)
            GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, ids[0])
            GLES20.glBufferData(GLES20.GL_ARRAY_BUFFER, b.verts * 3 * 4, p, GLES20.GL_STATIC_DRAW)
            GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, ids[1])
            GLES20.glBufferData(GLES20.GL_ARRAY_BUFFER, b.verts * 3 * 4, n, GLES20.GL_STATIC_DRAW)
            GLES20.glBindBuffer(GLES20.GL_ELEMENT_ARRAY_BUFFER, ids[2])
            GLES20.glBufferData(GLES20.GL_ELEMENT_ARRAY_BUFFER, b.indices * 2, i, GLES20.GL_STATIC_DRAW)
            parts.add(Gpu(b.group, b.colour, ids[0], ids[1], ids[2], b.indices))
            b.pos = null; b.nrm = null; b.idx = null
        }
        GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, 0)
        GLES20.glBindBuffer(GLES20.GL_ELEMENT_ARRAY_BUFFER, 0)
    }

    val ready: Boolean get() = program != 0 && parts.isNotEmpty()

    /**
     * @param vp      unjuran × pandangan daripada ARCore
     * @param model   letak model: terjemah × yaw × skala
     * @param nrm     3x3 untuk normal — hanya yaw, kerana skalanya seragam
     * @param hi      potong dari ATAS: apa-apa di atas ketinggian dunia ini hilang
     * @param lo      potong dari BAWAH: apa-apa di bawahnya hilang
     * @param alpha   1 biasa, lebih rendah untuk x-ray
     * @param hide    nama kumpulan yang tidak dilukis
     */
    fun draw(vp: FloatArray, model: FloatArray, nrm: FloatArray,
             hi: Float, lo: Float, alpha: Float, hide: Set<String>) {
        if (!ready) return

        GLES20.glUseProgram(program)
        GLES20.glEnable(GLES20.GL_DEPTH_TEST)
        GLES20.glDepthFunc(GLES20.GL_LEQUAL)
        val see = alpha < 0.999f
        if (see) {
            GLES20.glEnable(GLES20.GL_BLEND)
            GLES20.glBlendFunc(GLES20.GL_SRC_ALPHA, GLES20.GL_ONE_MINUS_SRC_ALPHA)
            // X-ray yang menulis kedalaman menyembunyikan dirinya sendiri:
            // dinding hadapan menolak dinding belakang keluar walaupun ia
            // lut sinar.
            GLES20.glDepthMask(false)
        } else {
            GLES20.glDisable(GLES20.GL_BLEND)
            GLES20.glDepthMask(true)
        }

        GLES20.glUniformMatrix4fv(uVp, 1, false, vp, 0)
        GLES20.glUniformMatrix4fv(uModel, 1, false, model, 0)
        GLES20.glUniformMatrix3fv(uNrm, 1, false, nrm, 0)
        GLES20.glUniform1f(uHi, hi)
        GLES20.glUniform1f(uLo, lo)
        GLES20.glUniform1f(uAlpha, alpha)
        // Cahaya dari atas dan sedikit ke sisi: cukup untuk membezakan
        // dinding daripada lantai tanpa berpura-pura tahu cahaya sebenar.
        GLES20.glUniform3f(uLight, 0.35f, 0.86f, 0.37f)

        GLES20.glEnableVertexAttribArray(aPos)
        GLES20.glEnableVertexAttribArray(aNrm)

        // Dua laluan. Yang pertama muka belakang: itu bahagian dalam dinding
        // yang terbuka oleh potongan, dan tanpa ia potongan kelihatan seperti
        // lubang dan bukan seperti keratan. Dilukis dahulu supaya muka
        // hadapan menimpanya di tempat yang tidak dipotong.
        GLES20.glEnable(GLES20.GL_CULL_FACE)
        for (pass in 0 until 2) {
            GLES20.glCullFace(if (pass == 0) GLES20.GL_FRONT else GLES20.GL_BACK)
            GLES20.glUniform1f(uBack, if (pass == 0) 1f else 0f)
            for (p in parts) {
                if (p.group in hide) continue
                GLES20.glUniform4f(uColour, p.colour[0], p.colour[1], p.colour[2], p.colour[3])
                GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, p.vbPos)
                GLES20.glVertexAttribPointer(aPos, 3, GLES20.GL_FLOAT, false, 0, 0)
                GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, p.vbNrm)
                GLES20.glVertexAttribPointer(aNrm, 3, GLES20.GL_FLOAT, false, 0, 0)
                GLES20.glBindBuffer(GLES20.GL_ELEMENT_ARRAY_BUFFER, p.ib)
                GLES20.glDrawElements(
                    GLES20.GL_TRIANGLES, p.indices, GLES20.GL_UNSIGNED_SHORT, 0)
            }
        }
        GLES20.glDisable(GLES20.GL_CULL_FACE)

        GLES20.glDisableVertexAttribArray(aPos)
        GLES20.glDisableVertexAttribArray(aNrm)
        GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, 0)
        GLES20.glBindBuffer(GLES20.GL_ELEMENT_ARRAY_BUFFER, 0)
        GLES20.glDepthMask(true)
        GLES20.glDisable(GLES20.GL_BLEND)
        GLES20.glDisable(GLES20.GL_DEPTH_TEST)
    }

    fun release() {
        if (parts.isEmpty()) return
        val ids = IntArray(parts.size * 3)
        parts.forEachIndexed { i, p ->
            ids[i * 3] = p.vbPos; ids[i * 3 + 1] = p.vbNrm; ids[i * 3 + 2] = p.ib
        }
        GLES20.glDeleteBuffers(ids.size, ids, 0)
        parts.clear()
    }

    private fun buildProgram(): Int {
        val vs = compile(GLES20.GL_VERTEX_SHADER, """
            uniform mat4 uVp;
            uniform mat4 uModel;
            uniform mat3 uNrm;
            attribute vec4 aPos;
            attribute vec3 aNrm;
            varying vec3 vW;
            varying vec3 vN;
            void main() {
              vec4 w = uModel * aPos;
              vW = w.xyz;
              vN = uNrm * aNrm;
              gl_Position = uVp * w;
            }
        """.trimIndent())
        val fs = compile(GLES20.GL_FRAGMENT_SHADER, """
            precision mediump float;
            uniform vec4 uColour;
            uniform float uHi;
            uniform float uLo;
            uniform float uAlpha;
            uniform float uBack;
            uniform vec3 uLight;
            varying vec3 vW;
            varying vec3 vN;
            void main() {
              // Dua potongan, dalam ketinggian dunia sebenar: satu dari atas,
              // satu dari bawah. Hidupkan kedua-duanya dan yang tinggal ialah
              // satu jalur mendatar — contohnya 2.2 m sampai 2.8 m untuk ruang
              // siling dengan duct dan paipnya.
              if (vW.y > uHi || vW.y < uLo) discard;
              vec3 n = normalize(vN);
              float d = max(dot(n, normalize(uLight)), 0.0);
              float sky = 0.5 + 0.5 * n.y;
              vec3 c = uColour.rgb * (0.30 + 0.45 * d + 0.25 * sky);
              c = mix(c, uColour.rgb * 0.26, uBack);
              gl_FragColor = vec4(c, uColour.a * uAlpha);
            }
        """.trimIndent())
        val p = GLES20.glCreateProgram()
        GLES20.glAttachShader(p, vs)
        GLES20.glAttachShader(p, fs)
        GLES20.glLinkProgram(p)
        aPos = GLES20.glGetAttribLocation(p, "aPos")
        aNrm = GLES20.glGetAttribLocation(p, "aNrm")
        uVp = GLES20.glGetUniformLocation(p, "uVp")
        uModel = GLES20.glGetUniformLocation(p, "uModel")
        uNrm = GLES20.glGetUniformLocation(p, "uNrm")
        uColour = GLES20.glGetUniformLocation(p, "uColour")
        uHi = GLES20.glGetUniformLocation(p, "uHi")
        uLo = GLES20.glGetUniformLocation(p, "uLo")
        uAlpha = GLES20.glGetUniformLocation(p, "uAlpha")
        uBack = GLES20.glGetUniformLocation(p, "uBack")
        uLight = GLES20.glGetUniformLocation(p, "uLight")
        return p
    }

    private fun compile(type: Int, src: String): Int {
        val id = GLES20.glCreateShader(type)
        GLES20.glShaderSource(id, src)
        GLES20.glCompileShader(id)
        return id
    }
}
