package my.goxpert.pocket

import kotlin.math.abs
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.hypot
import kotlin.math.sin
import kotlin.math.sqrt

/**
 * Matematik "balik ke tempat yang sama".
 *
 * ARCore tidak boleh menyimpan peta sesuatu tempat. Tutup app, dan setiap
 * koordinat yang ia tahu hilang; esok bilik yang sama ialah dunia baharu
 * dengan asalan baharu. Jadi defect tidak boleh disimpan dalam koordinat
 * ARCore. Ia disimpan dalam bingkai zon itu sendiri — bingkai yang
 * ditakrifkan oleh beberapa titik kunci yang surveyor tanda pada ciri
 * tetap: bucu dinding, bucu kusen pintu, penjuru tiang.
 *
 * Balik nanti, titik yang sama ditanda semula, dan di sinilah fail ini
 * masuk: ia mengira satu putaran dan satu anjakan yang membawa bingkai zon
 * itu ke dalam dunia ARCore yang baharu. Setiap defect ikut sama.
 *
 * Dua keputusan di sini penting, dan kedua-duanya bertentangan dengan apa
 * yang betul untuk alat model 3D:
 *
 * TIADA SKALA. Model 3D datang dalam unit yang tidak diketahui, jadi di
 * sana skala mesti diukur. Di sini kedua-dua belah ialah meter sebenar.
 * Membenarkan skala bergerak bermakna setiap millimeter ralat tapping
 * diserap dengan meregangkan bilik, jadi nombor ralat menjadi cantik dan
 * defect tetap tersasar. Skala dikunci pada 1 supaya ralat itu kekal
 * kelihatan.
 *
 * YAW SAHAJA. ARCore sentiasa menjajarkan paksi Y dengan graviti, dalam
 * setiap sesi. Jadi satu-satunya putaran antara dua sesi ialah yaw.
 * Memuatkan putaran 3D penuh akan membenarkan bilik itu CONDONG untuk
 * menyerap ralat, dan defect pada dinding akan merayap naik atau turun.
 */
object ArFit {

    /** Putaran mengelilingi graviti dan satu anjakan: zon -> dunia. */
    class Fit(
        val yaw: Float,
        val t: FloatArray,
        /** Punca min kuasa dua baki, meter. 0 bila hanya dua titik. */
        val rms: Float,
        /** Indeks titik yang paling tidak sepadan, -1 bila kurang 3 titik. */
        val worst: Int,
        /** Baki titik itu, meter. */
        val worstErr: Float
    )

    /** Dua titik lebih rapat daripada ini secara mengufuk tidak boleh
     *  menentukan arah: ralat ARCore sendiri menjadi sudutnya. */
    const val MIN_SPAN = 0.4f

    private fun yawApply(p: FloatArray, c: Float, s: Float) =
        floatArrayOf(p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c)

    /** Satu titik zon ke dalam dunia. */
    fun apply(p: FloatArray, f: Fit): FloatArray {
        val r = yawApply(p, cos(f.yaw), sin(f.yaw))
        return floatArrayOf(r[0] + f.t[0], r[1] + f.t[1], r[2] + f.t[2])
    }

    /** Arah bertentangan: satu titik dunia balik ke dalam bingkai zon. */
    fun invert(w: FloatArray, f: Fit): FloatArray {
        val d = floatArrayOf(w[0] - f.t[0], w[1] - f.t[1], w[2] - f.t[2])
        return yawApply(d, cos(-f.yaw), sin(-f.yaw))
    }

    /** Jarak mengufuk terbesar antara mana-mana dua titik. */
    fun span(pts: List<FloatArray>): Float {
        var m = 0f
        for (i in pts.indices) for (j in i + 1 until pts.size) {
            val d = hypot(pts[i][0] - pts[j][0], pts[i][2] - pts[j][2])
            if (d > m) m = d
        }
        return m
    }

    /**
     * Bingkai zon daripada titik kunci sesi pertama.
     *
     * Asalan pada titik 1, dan arah mengufuk titik 1 ke titik 2 menjadi
     * paksi Z. Nombor yang disimpan kemudiannya bermakna sendiri — "2.4 m
     * sepanjang dinding, 1.6 m tinggi" — dan bukan koordinat ARCore sesi
     * itu, yang tidak bermakna apa-apa esok.
     */
    fun frame(worldLocks: List<FloatArray>): Fit? {
        if (worldLocks.size < 2) return null
        if (span(worldLocks) < MIN_SPAN) return null
        val a = worldLocks[0]
        var b: FloatArray? = null
        // Titik kedua yang cukup jauh secara mengufuk daripada yang pertama;
        // titik 2 tepat di atas titik 1 tidak memberi arah.
        for (i in 1 until worldLocks.size) {
            if (hypot(worldLocks[i][0] - a[0], worldLocks[i][2] - a[2]) >= MIN_SPAN) {
                b = worldLocks[i]; break
            }
        }
        val q = b ?: return null
        val yaw = atan2(q[0] - a[0], q[2] - a[2])
        return Fit(yaw, floatArrayOf(a[0], a[1], a[2]), 0f, -1, 0f)
    }

    /**
     * Padankan titik kunci yang disimpan dengan titik kunci yang baru
     * ditanda. Memulangkan null bila ia tidak boleh diselesaikan langsung.
     *
     * Dengan dua titik, baki sentiasa sifar — tiada lebihan untuk
     * mendedahkan apa-apa, jadi ia boleh padan dengan sempurna pada bucu
     * yang salah sama sekali. Dengan tiga ke atas, satu titik yang buruk
     * menonjol daripada baki yang sepadan, dan itulah yang memberitahu
     * surveyor yang MANA satu, sebelum dia berjalan keliling bangunan
     * mengikut defect yang tersasar setengah meter.
     */
    fun solve(zone: List<FloatArray>, world: List<FloatArray>): Fit? {
        val n = minOf(zone.size, world.size)
        if (n < 2) return null
        if (span(zone.take(n)) < MIN_SPAN || span(world.take(n)) < MIN_SPAN) return null

        val zc = mean(zone, n)
        val wc = mean(world, n)
        var num = 0f
        var den = 0f
        for (i in 0 until n) {
            val ax = zone[i][0] - zc[0]; val az = zone[i][2] - zc[2]
            val bx = world[i][0] - wc[0]; val bz = world[i][2] - wc[2]
            // Memaksimumkan c*A + s*B untuk R(x,z) = (xc+zs, -xs+zc).
            // Tandanya penting: versi songsang lulus pada 0 dan 180 darjah
            // dan memulangkan yaw bercermin pada setiap arah lain.
            num += az * bx - ax * bz
            den += ax * bx + az * bz
        }
        if (abs(num) < 1e-12f && abs(den) < 1e-12f) return null
        val yaw = atan2(num, den)
        val r = yawApply(zc, cos(yaw), sin(yaw))
        val t = floatArrayOf(wc[0] - r[0], wc[1] - r[1], wc[2] - r[2])

        val base = Fit(yaw, t, 0f, -1, 0f)
        var sq = 0f
        var worst = -1
        var worstErr = 0f
        for (i in 0 until n) {
            val p = apply(zone[i], base)
            val dx = p[0] - world[i][0]
            val dy = p[1] - world[i][1]
            val dz = p[2] - world[i][2]
            val e = sqrt(dx * dx + dy * dy + dz * dz)
            sq += e * e
            if (e > worstErr) { worstErr = e; worst = i }
        }
        val rms = sqrt(sq / n)
        // Dua titik sentiasa muat sempurna dalam satah mengufuk, jadi
        // menamakan "yang paling teruk" antara dua ialah bunyi bising.
        return if (n < 3) Fit(yaw, t, rms, -1, 0f)
        else Fit(yaw, t, rms, worst, worstErr)
    }

    /**
     * Semakan bentuk, sebelum apa-apa diselesaikan.
     *
     * Jarak antara bucu bilik tidak berubah. Jadi kalau titik 2 ditanda
     * pada bucu yang salah, jarak daripadanya ke setiap titik lain berubah
     * sekaligus — dan itu kelihatan serta-merta, tanpa perlu memadankan
     * apa-apa. Ia juga menamakan tertuduh: titik yang jaraknya paling
     * banyak bergeser.
     *
     * Memulangkan sisihan terbesar dalam meter, dan indeks titik itu.
     */
    fun shapeError(zone: List<FloatArray>, world: List<FloatArray>): Pair<Int, Float> {
        val n = minOf(zone.size, world.size)
        if (n < 3) return Pair(-1, 0f)
        var who = -1
        var worst = 0f
        for (i in 0 until n) {
            var mine = 0f
            for (j in 0 until n) {
                if (i == j) continue
                val d = abs(dist(zone[i], zone[j]) - dist(world[i], world[j]))
                if (d > mine) mine = d
            }
            if (mine > worst) { worst = mine; who = i }
        }
        return Pair(who, worst)
    }

    private fun dist(a: FloatArray, b: FloatArray): Float {
        val dx = a[0] - b[0]; val dy = a[1] - b[1]; val dz = a[2] - b[2]
        return sqrt(dx * dx + dy * dy + dz * dz)
    }

    private fun mean(l: List<FloatArray>, n: Int): FloatArray {
        val o = FloatArray(3)
        for (i in 0 until n) { o[0] += l[i][0]; o[1] += l[i][1]; o[2] += l[i][2] }
        val d = n.coerceAtLeast(1)
        return floatArrayOf(o[0] / d, o[1] / d, o[2] / d)
    }
}
