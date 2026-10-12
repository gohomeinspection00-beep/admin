package my.goxpert.pocket

import org.json.JSONObject
import java.io.File
import java.nio.ByteBuffer
import java.nio.ByteOrder

/** Sebab yang boleh dibaca manusia, kerana "parse gagal" tidak membantu. */
class GlbError(msg: String) : Exception(msg)

/**
 * Pembaca GLB, ditulis di sini dan bukan diambil daripada pustaka.
 *
 * Sebabnya praktikal. Pelihat 3D dalam Pocket memuatkan three.js dan
 * GLTFLoader daripada CDN — itu baik di pejabat, tetapi skrin AR dibuka di
 * tapak, kerap tanpa talian, dan satu permintaan rangkaian yang gagal di situ
 * bermakna tiada AR. Parser di sini tiada kebergantungan dan tiada rangkaian.
 *
 * Pilihan utama ialah apa yang dihasilkannya: KELOMPOK siap dibakar, bukan
 * pokok node. Eksport IFC dan Revit mempunyai ribuan node, dan seribu node
 * bermakna seribu lukisan GL setiap bingkai, yang tiada telefon boleh
 * lakukan pada 30 bingkai sesaat. Jadi transform setiap node dibakar ke dalam
 * verteksnya dan node yang sepadan digabungkan, dikunci pada (kumpulan,
 * bahan). Lukisan jatuh daripada ribuan kepada berpuluh.
 *
 * Harganya ialah memori: satu pintu yang digunakan 500 kali menjadi 500
 * salinan. Itu sebabnya ada had segi tiga di bawah, dan sebab penimbal
 * dilepaskan sebaik ia dimuat naik ke GPU.
 *
 * Setiap kelompok dipecah pada 65 535 verteks supaya indeks sentiasa muat
 * dalam 16 bit. GL_UNSIGNED_INT memerlukan sambungan yang tidak semua
 * telefon ada; memecah kelompok tidak memerlukan apa-apa. Pemecahan berlaku
 * pada sempadan segi tiga dan bukan pada sempadan mesh, kerana eksport
 * Blender kerap menggabungkan seluruh bangunan menjadi SATU mesh — memecah
 * ikut mesh akan gagal tepat pada fail yang paling biasa.
 */
object Glb {

    /** Di atas ini, memori telefon pertengahan habis semasa membakar. Skrin
     *  import Pocket sudah memberi amaran pada 900k, jadi had ini ialah
     *  jaring keselamatan dan bukan dasar. */
    private const val MAX_TRIS = 1_500_000

    /** Verteks paling banyak dalam satu kelompok, supaya indeks kekal 16 bit. */
    private const val SPLIT = 65535

    /** Satu lukisan GL: satu kumpulan, satu warna. */
    class Batch(
        val group: String,
        val colour: FloatArray,
        var pos: ByteBuffer?,
        var nrm: ByteBuffer?,
        var idx: ByteBuffer?,
        val indices: Int,
        val verts: Int
    )

    class Model(
        val batches: List<Batch>,
        val tris: Int,
        val min: FloatArray,
        val max: FloatArray,
        val groups: List<String>
    )

    // ---------- 1. BEKAS ----------

    fun read(file: File): Model {
        val all = file.readBytes()
        if (all.size < 20) throw GlbError("Fail terlalu kecil untuk menjadi GLB")
        val bb = ByteBuffer.wrap(all).order(ByteOrder.LITTLE_ENDIAN)
        if (bb.int != 0x46546C67) {
            throw GlbError("Ini bukan fail GLB. Fail .gltf teks perlu ditukar ke .glb dahulu.")
        }
        bb.int                                  // versi
        bb.int                                  // panjang yang diisytiharkan

        var json: String? = null
        var bin: ByteBuffer? = null
        while (bb.remaining() >= 8) {
            val len = bb.int
            val type = bb.int
            if (len < 0 || len > bb.remaining()) break
            val start = bb.position()
            when (type) {
                0x4E4F534A -> json = String(all, start, len, Charsets.UTF_8)
                0x004E4942 -> bin = ByteBuffer.wrap(all, start, len)
                    .slice().order(ByteOrder.LITTLE_ENDIAN)
            }
            val next = start + len + ((4 - len % 4) % 4)
            if (next > all.size) break
            bb.position(next)
        }
        val j = JSONObject(json ?: throw GlbError("GLB tiada bongkah JSON"))
        blockUnsupported(j)
        return build(j, bin ?: throw GlbError("GLB tiada bongkah data"))
    }

    /**
     * Sambungan yang memampat geometri mesti ditolak dengan namanya, bukan
     * dibiarkan menjadi mesh kosong yang kelihatan seperti bug.
     */
    private fun blockUnsupported(j: JSONObject) {
        val req = j.optJSONArray("extensionsRequired") ?: return
        val known = mapOf(
            "KHR_draco_mesh_compression" to "Draco",
            "EXT_meshopt_compression" to "meshopt",
            "KHR_texture_basisu" to "Basis/KTX2"
        )
        for (k in 0 until req.length()) {
            known[req.optString(k)]?.let {
                throw GlbError(
                    "Model ini termampat ($it). Eksport semula tanpa mampatan " +
                    "— dalam Blender, buang tanda Compression semasa eksport GLB."
                )
            }
        }
    }

    // ---------- 2. TATASUSUNAN YANG BOLEH MEMBESAR ----------
    //
    // Tatasusunan primitif, bukan ArrayList<Float>. Satu juta verteks dalam
    // ArrayList<Float> ialah empat juta objek Float dan lebih 100 MB sampah.

    private class FloatBag(cap: Int = 4096) {
        var a = FloatArray(cap); var n = 0
        fun add(v: Float) { if (n == a.size) a = a.copyOf(a.size * 2); a[n++] = v }
        fun add3(x: Float, y: Float, z: Float) { add(x); add(y); add(z) }
        fun clear() { n = 0 }
    }

    private class IntBag(cap: Int = 4096) {
        var a = IntArray(cap); var n = 0
        fun add(v: Int) { if (n == a.size) a = a.copyOf(a.size * 2); a[n++] = v }
        fun clear() { n = 0 }
    }

    // ---------- 3. PENGAKSES ----------

    private class Reader(val j: JSONObject, val bin: ByteBuffer) {

        private val accessors = j.optJSONArray("accessors")
        private val views = j.optJSONArray("bufferViews")
        private val cacheV = HashMap<Int, FloatArray>()
        private val cacheI = HashMap<Int, IntArray>()

        fun clear() { cacheV.clear(); cacheI.clear() }

        private fun comps(type: String): Int = when (type) {
            "SCALAR" -> 1; "VEC2" -> 2; "VEC3" -> 3; "VEC4" -> 4
            else -> throw GlbError("Jenis pengakses $type tidak disokong")
        }

        private fun size(ct: Int): Int = when (ct) {
            5120, 5121 -> 1
            5122, 5123 -> 2
            5125, 5126 -> 4
            else -> throw GlbError("Jenis komponen $ct tidak dikenali")
        }

        /** Satu pengakses sebagai apungan, dengan byteStride dihormati. */
        fun vec(i: Int): FloatArray = cacheV.getOrPut(i) {
            val a = accessors?.optJSONObject(i) ?: throw GlbError("Pengakses $i tiada")
            val n = a.optInt("count")
            val c = comps(a.optString("type", "VEC3"))
            val ct = a.optInt("componentType", 5126)
            val out = FloatArray(n * c)
            val vi = if (a.has("bufferView")) a.optInt("bufferView") else -1
            if (vi < 0) return@getOrPut out        // dibenarkan oleh spek: semua sifar
            val v = views?.optJSONObject(vi) ?: throw GlbError("bufferView $vi tiada")
            val base = v.optInt("byteOffset", 0) + a.optInt("byteOffset", 0)
            val es = size(ct)
            val stride = v.optInt("byteStride", 0).let { if (it > 0) it else c * es }
            val norm = a.optBoolean("normalized", false)
            if (n > 0 && base + (n - 1) * stride + c * es > bin.limit()) {
                throw GlbError("Pengakses $i menunjuk ke luar data model")
            }
            for (k in 0 until n) {
                var p = base + k * stride
                for (q in 0 until c) {
                    out[k * c + q] = when (ct) {
                        5126 -> bin.getFloat(p)
                        5120 -> bin.get(p).toFloat().let { if (norm) maxOf(it / 127f, -1f) else it }
                        5121 -> (bin.get(p).toInt() and 0xff).toFloat().let { if (norm) it / 255f else it }
                        5122 -> bin.getShort(p).toFloat().let { if (norm) maxOf(it / 32767f, -1f) else it }
                        5123 -> (bin.getShort(p).toInt() and 0xffff).toFloat()
                            .let { if (norm) it / 65535f else it }
                        5125 -> (bin.getInt(p).toLong() and 0xffffffffL).toFloat()
                        else -> 0f
                    }
                    p += es
                }
            }
            out
        }

        fun idx(i: Int): IntArray = cacheI.getOrPut(i) {
            val a = accessors?.optJSONObject(i) ?: throw GlbError("Pengakses indeks $i tiada")
            val n = a.optInt("count")
            val ct = a.optInt("componentType", 5123)
            val out = IntArray(n)
            val vi = if (a.has("bufferView")) a.optInt("bufferView") else -1
            if (vi < 0) return@getOrPut out
            val v = views?.optJSONObject(vi) ?: throw GlbError("bufferView $vi tiada")
            val base = v.optInt("byteOffset", 0) + a.optInt("byteOffset", 0)
            val es = size(ct)
            val stride = v.optInt("byteStride", 0).let { if (it > 0) it else es }
            if (n > 0 && base + (n - 1) * stride + es > bin.limit()) {
                throw GlbError("Pengakses indeks $i menunjuk ke luar data model")
            }
            for (k in 0 until n) {
                val p = base + k * stride
                out[k] = when (ct) {
                    5121 -> bin.get(p).toInt() and 0xff
                    5123 -> bin.getShort(p).toInt() and 0xffff
                    5125 -> bin.getInt(p)
                    else -> 0
                }
            }
            out
        }

        fun count(i: Int): Int =
            if (i < 0) 0 else accessors?.optJSONObject(i)?.optInt("count") ?: 0
    }

    // ---------- 4. MATRIKS ----------

    private fun ident() = floatArrayOf(1f,0f,0f,0f, 0f,1f,0f,0f, 0f,0f,1f,0f, 0f,0f,0f,1f)

    /** Lajur-utama, seperti glTF dan OpenGL. */
    private fun mul(a: FloatArray, b: FloatArray): FloatArray {
        val o = FloatArray(16)
        for (c in 0 until 4) for (r in 0 until 4) {
            var s = 0f
            for (k in 0 until 4) s += a[k * 4 + r] * b[c * 4 + k]
            o[c * 4 + r] = s
        }
        return o
    }

    private fun nodeMatrix(n: JSONObject): FloatArray {
        n.optJSONArray("matrix")?.let { m ->
            if (m.length() == 16) {
                val o = FloatArray(16)
                for (k in 0 until 16) o[k] = m.optDouble(k, 0.0).toFloat()
                return o
            }
        }
        val m = ident()
        n.optJSONArray("rotation")?.let { r ->
            if (r.length() == 4) {
                val x = r.optDouble(0).toFloat(); val y = r.optDouble(1).toFloat()
                val z = r.optDouble(2).toFloat(); val w = r.optDouble(3).toFloat()
                m[0] = 1 - 2 * (y*y + z*z); m[1] = 2 * (x*y + z*w);     m[2] = 2 * (x*z - y*w)
                m[4] = 2 * (x*y - z*w);     m[5] = 1 - 2 * (x*x + z*z); m[6] = 2 * (y*z + x*w)
                m[8] = 2 * (x*z + y*w);     m[9] = 2 * (y*z - x*w);     m[10] = 1 - 2 * (x*x + y*y)
            }
        }
        n.optJSONArray("scale")?.let { s ->
            if (s.length() == 3) for (c in 0 until 3) {
                val f = s.optDouble(c, 1.0).toFloat()
                m[c * 4] *= f; m[c * 4 + 1] *= f; m[c * 4 + 2] *= f
            }
        }
        n.optJSONArray("translation")?.let { t ->
            if (t.length() == 3) {
                m[12] = t.optDouble(0).toFloat(); m[13] = t.optDouble(1).toFloat()
                m[14] = t.optDouble(2).toFloat()
            }
        }
        return m
    }

    // ---------- 5. KUMPULAN ----------
    //
    // Peraturan yang sama seperti mdGroups dalam Pocket: pengeksport IFC
    // menyimpan IfcWall, IfcSlab dan nama tingkat dalam nama node, jadi
    // penapis datang tanpa pangkalan data tambahan.

    private val IFC = Regex("Ifc([A-Za-z]+)")

    private fun groupOf(names: List<String>): String {
        for (i in names.indices.reversed()) {
            IFC.find(names[i])?.let { return it.groupValues[1] }
        }
        val head = names.lastOrNull().orEmpty().split('_', '.', ':').firstOrNull().orEmpty()
        return if (head.isBlank()) "Lain" else head
    }

    // ---------- 6. MEMBAKAR ----------

    private class Inst(val mesh: Int, val prim: Int, val m: FloatArray, val group: String)

    private fun build(j: JSONObject, bin: ByteBuffer): Model {
        val nodes = j.optJSONArray("nodes")
        val meshes = j.optJSONArray("meshes") ?: throw GlbError("Model ini tiada mesh")
        val mats = j.optJSONArray("materials")

        // Punca pokok. scenes ialah jawapan yang betul; tanpanya, node yang
        // tiada sesiapa namakan sebagai anak ialah punca.
        val roots = ArrayList<Int>()
        val sc = j.optJSONArray("scenes")?.optJSONObject(j.optInt("scene", 0))
            ?.optJSONArray("nodes")
        if (sc != null) {
            for (k in 0 until sc.length()) roots.add(sc.optInt(k))
        } else if (nodes != null) {
            val child = HashSet<Int>()
            for (k in 0 until nodes.length()) {
                nodes.optJSONObject(k)?.optJSONArray("children")?.let { ch ->
                    for (q in 0 until ch.length()) child.add(ch.optInt(q))
                }
            }
            for (k in 0 until nodes.length()) if (k !in child) roots.add(k)
        }

        val inst = ArrayList<Inst>()
        val seen = HashSet<Int>()

        fun walk(ni: Int, parent: FloatArray, trail: List<String>, depth: Int) {
            // Satu node, satu kali. Had kedalaman sahaja tidak mencukupi:
            // satu kitaran dengan had 64 masih bermakna jutaan laluan.
            if (depth > 64 || !seen.add(ni)) return
            val n = nodes?.optJSONObject(ni) ?: return
            val m = mul(parent, nodeMatrix(n))
            val names = trail + n.optString("name", "")
            if (n.has("mesh")) {
                val mi = n.optInt("mesh")
                meshes.optJSONObject(mi)?.optJSONArray("primitives")?.let { prims ->
                    val g = groupOf(names)
                    for (p in 0 until prims.length()) {
                        // Hanya segi tiga. Garis dan titik dalam eksport BIM
                        // ialah geometri pembinaan, bukan bangunan.
                        if (prims.optJSONObject(p)?.optInt("mode", 4) != 4) continue
                        inst.add(Inst(mi, p, m, g))
                    }
                }
            }
            n.optJSONArray("children")?.let { ch ->
                for (q in 0 until ch.length()) walk(ch.optInt(q), m, names, depth + 1)
            }
        }
        for (r in roots) walk(r, ident(), emptyList(), 0)
        if (inst.isEmpty()) throw GlbError("Tiada geometri segi tiga dalam model ini")

        val rd = Reader(j, bin)

        fun primOf(one: Inst): JSONObject? =
            meshes.optJSONObject(one.mesh)?.optJSONArray("primitives")?.optJSONObject(one.prim)

        // Kira dahulu, supaya model yang terlalu berat ditolak sebelum satu
        // bait diumpukkan dan bukan dengan kehabisan memori di tengah jalan.
        var tris = 0
        for (one in inst) {
            val pr = primOf(one) ?: continue
            val nIdx = if (pr.has("indices")) rd.count(pr.optInt("indices"))
                       else rd.count(pr.optJSONObject("attributes")?.optInt("POSITION", -1) ?: -1)
            tris += nIdx / 3
        }
        if (tris > MAX_TRIS) throw GlbError(
            "${tris / 1000}k segi tiga — terlalu berat untuk AR. " +
            "Eksport satu tingkat sahaja, bukan bangunan penuh.")

        // Kunci kelompok: kumpulan dahulu, kemudian bahan. Kumpulan dahulu
        // supaya menyembunyikan satu kumpulan ialah melangkau lukisan dan
        // bukan membina semula penimbal.
        val keyed = LinkedHashMap<String, ArrayList<Inst>>()
        for (one in inst) {
            val mi = primOf(one)?.optInt("material", -1) ?: -1
            keyed.getOrPut("${one.group}\u0000$mi") { ArrayList() }.add(one)
        }

        val out = ArrayList<Batch>()
        val lo = floatArrayOf(Float.MAX_VALUE, Float.MAX_VALUE, Float.MAX_VALUE)
        val hi = floatArrayOf(-Float.MAX_VALUE, -Float.MAX_VALUE, -Float.MAX_VALUE)
        val groups = LinkedHashSet<String>()

        val pos = FloatBag(1 shl 16)
        val nrm = FloatBag(1 shl 16)
        val idx = IntBag(1 shl 16)
        // Verteks yang datang daripada mesh tanpa NORMAL. Dikumpul semasa
        // flush, kerana normal muka memerlukan segi tiga yang sudah lengkap.
        val needN = IntBag(1 shl 12)

        for ((key, list) in keyed) {
            val group = key.substringBefore('\u0000')
            val mi = key.substringAfter('\u0000').toIntOrNull() ?: -1
            groups.add(group)
            val colour = baseColour(mats?.optJSONObject(mi))

            fun flush() {
                if (idx.n < 3) { pos.clear(); nrm.clear(); idx.clear(); needN.clear(); return }
                if (needN.n > 0) faceNormals(pos, nrm, idx, needN)
                out.add(Batch(group, colour,
                    floats(pos), floats(nrm), shorts(idx), idx.n, pos.n / 3))
                pos.clear(); nrm.clear(); idx.clear(); needN.clear()
            }

            for (one in list) {
                val pr = primOf(one) ?: continue
                val attr = pr.optJSONObject("attributes") ?: continue
                if (!attr.has("POSITION")) continue
                val p = rd.vec(attr.optInt("POSITION"))
                val nv = p.size / 3
                if (nv == 0) continue
                val nn = if (attr.has("NORMAL")) rd.vec(attr.optInt("NORMAL")) else FloatArray(0)
                val hasN = nn.size >= nv * 3
                val ii = if (pr.has("indices")) rd.idx(pr.optInt("indices")) else IntArray(nv) { it }
                if (ii.size < 3) continue
                val m = one.m

                // Peta semula setiap verteks kepada slot dalam kelompok INI.
                // Ia diset semula pada setiap flush, kerana kelompok baharu
                // bermakna slot baharu.
                var remap = IntArray(nv) { -1 }

                var k = 0
                while (k + 2 < ii.size) {
                    val a = ii[k]; val b = ii[k + 1]; val c = ii[k + 2]
                    k += 3
                    if (a < 0 || b < 0 || c < 0 || a >= nv || b >= nv || c >= nv) continue
                    // Ruang untuk tiga verteks baharu dalam kes paling buruk.
                    if (pos.n / 3 + 3 > SPLIT) { flush(); remap = IntArray(nv) { -1 } }
                    for (t in intArrayOf(a, b, c)) {
                        var d = remap[t]
                        if (d < 0) {
                            d = pos.n / 3
                            val x = p[t * 3]; val y = p[t * 3 + 1]; val z = p[t * 3 + 2]
                            val wx = m[0] * x + m[4] * y + m[8] * z + m[12]
                            val wy = m[1] * x + m[5] * y + m[9] * z + m[13]
                            val wz = m[2] * x + m[6] * y + m[10] * z + m[14]
                            pos.add3(wx, wy, wz)
                            if (wx < lo[0]) lo[0] = wx; if (wx > hi[0]) hi[0] = wx
                            if (wy < lo[1]) lo[1] = wy; if (wy > hi[1]) hi[1] = wy
                            if (wz < lo[2]) lo[2] = wz; if (wz > hi[2]) hi[2] = wz
                            if (hasN) {
                                // Normal diputar oleh 3x3 atas. Itu betul
                                // untuk putaran dan skala seragam, yang
                                // meliputi hampir setiap eksport BIM; skala
                                // tidak seragam menyengetkan lorekan sedikit
                                // tetapi tidak memindahkan geometri.
                                val u = nn[t * 3]; val v = nn[t * 3 + 1]; val w = nn[t * 3 + 2]
                                var rx = m[0] * u + m[4] * v + m[8] * w
                                var ry = m[1] * u + m[5] * v + m[9] * w
                                var rz = m[2] * u + m[6] * v + m[10] * w
                                val l = Math.sqrt((rx*rx + ry*ry + rz*rz).toDouble()).toFloat()
                                if (l > 1e-9f) { rx /= l; ry /= l; rz /= l } else { ry = 1f }
                                nrm.add3(rx, ry, rz)
                            } else {
                                nrm.add3(0f, 0f, 0f)
                                needN.add(d)
                            }
                            remap[t] = d
                        }
                        idx.add(d)
                    }
                }
            }
            flush()
        }

        rd.clear()
        if (out.isEmpty()) throw GlbError("Tiada geometri yang boleh dibaca")
        if (lo[0] > hi[0]) { lo.fill(0f); hi.fill(0f) }
        return Model(out, tris, lo, hi, groups.toList())
    }

    /**
     * Normal muka untuk verteks yang mesh asalnya tidak membawa normal.
     *
     * Eksport tanpa NORMAL bukan jarang, dan tanpa ini model muncul sebagai
     * satu siluet rata tanpa kedalaman — kelihatan seperti bug, bukan seperti
     * data yang tiada.
     */
    private fun faceNormals(pos: FloatBag, nrm: FloatBag, idx: IntBag, needN: IntBag) {
        val want = HashSet<Int>(needN.n * 2)
        for (i in 0 until needN.n) want.add(needN.a[i])
        var k = 0
        while (k + 2 < idx.n) {
            val a = idx.a[k]; val b = idx.a[k + 1]; val c = idx.a[k + 2]
            k += 3
            if (a !in want && b !in want && c !in want) continue
            val ux = pos.a[b*3] - pos.a[a*3]
            val uy = pos.a[b*3+1] - pos.a[a*3+1]
            val uz = pos.a[b*3+2] - pos.a[a*3+2]
            val vx = pos.a[c*3] - pos.a[a*3]
            val vy = pos.a[c*3+1] - pos.a[a*3+1]
            val vz = pos.a[c*3+2] - pos.a[a*3+2]
            val nx = uy*vz - uz*vy
            val ny = uz*vx - ux*vz
            val nz = ux*vy - uy*vx
            for (t in intArrayOf(a, b, c)) {
                if (t !in want) continue
                nrm.a[t*3] += nx; nrm.a[t*3+1] += ny; nrm.a[t*3+2] += nz
            }
        }
        for (i in 0 until needN.n) {
            val t = needN.a[i]
            val x = nrm.a[t*3]; val y = nrm.a[t*3+1]; val z = nrm.a[t*3+2]
            val l = Math.sqrt((x*x + y*y + z*z).toDouble()).toFloat()
            if (l > 1e-9f) { nrm.a[t*3] = x/l; nrm.a[t*3+1] = y/l; nrm.a[t*3+2] = z/l }
            else { nrm.a[t*3] = 0f; nrm.a[t*3+1] = 1f; nrm.a[t*3+2] = 0f }
        }
    }

    /**
     * Warna asas sahaja, bukan tekstur.
     *
     * Eksport Revit, ArchiCAD, IFC dan SketchUp hampir selalu warna rata,
     * dan untuk membaca satu keratan, warna rata lebih jelas daripada PBR.
     * Scan bertekstur akan kelihatan salah di sini, dan itu diketahui.
     */
    private fun baseColour(m: JSONObject?): FloatArray {
        val d = floatArrayOf(0.78f, 0.80f, 0.83f, 1f)
        if (m == null) return d
        m.optJSONObject("pbrMetallicRoughness")?.optJSONArray("baseColorFactor")?.let { a ->
            if (a.length() >= 3) return floatArrayOf(
                a.optDouble(0, 1.0).toFloat(), a.optDouble(1, 1.0).toFloat(),
                a.optDouble(2, 1.0).toFloat(), a.optDouble(3, 1.0).toFloat())
        }
        m.optJSONObject("extensions")
            ?.optJSONObject("KHR_materials_pbrSpecularGlossiness")
            ?.optJSONArray("diffuseFactor")?.let { a ->
            if (a.length() >= 3) return floatArrayOf(
                a.optDouble(0, 1.0).toFloat(), a.optDouble(1, 1.0).toFloat(),
                a.optDouble(2, 1.0).toFloat(), a.optDouble(3, 1.0).toFloat())
        }
        return d
    }

    private fun floats(b: FloatBag): ByteBuffer {
        val out = ByteBuffer.allocateDirect(b.n * 4).order(ByteOrder.nativeOrder())
        out.asFloatBuffer().put(b.a, 0, b.n)
        out.position(0)
        return out
    }

    private fun shorts(b: IntBag): ByteBuffer {
        val out = ByteBuffer.allocateDirect(b.n * 2).order(ByteOrder.nativeOrder())
        val s = out.asShortBuffer()
        for (i in 0 until b.n) s.put((b.a[i] and 0xffff).toShort())
        out.position(0)
        return out
    }
}
