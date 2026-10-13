package my.goxpert.pocket

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.RectF

/**
 * Kad defect, dilukis sekali ke dalam satu Bitmap dan dimuat naik sebagai
 * satu tekstur.
 *
 * Teks dalam OpenGL ES 2 bermakna atlas glyph, kerning dan pemotongan baris
 * yang ditulis tangan. Canvas Android sudah melakukan semua itu dengan betul,
 * termasuk tulisan Jawi dan emoji, jadi kad siap dilukis di sana dan GL cuma
 * menampalnya pada satu segi empat. Kad hanya berubah bila defect diedit,
 * jadi tiada apa yang dilukis semula setiap bingkai.
 *
 * Keterukan mengikut keutamaan BARIS yang app ini sudah gunakan di tempat
 * lain — N1 sehingga E4 — dan bukan skala rendah/sederhana/tinggi yang baharu.
 * Surveyor yang bertauliah ACPIM menulis kod itu dalam laporannya; dua
 * perbendaharaan kata untuk perkara yang sama hanya menimbulkan kerja
 * menterjemah.
 */
object ArCardArt {

    const val W = 256
    const val H = 200
    private const val PHOTO_H = 148

    /** N1 Normal, R2 Rutin, U3 Mendesak, E4 Kecemasan. */
    val CODES = arrayOf("N1", "R2", "U3", "E4")
    val NAMES = arrayOf("Normal", "Rutin", "Mendesak", "Kecemasan")
    private val COLOURS = intArrayOf(
        Color.rgb(59, 130, 246),
        Color.rgb(245, 158, 11),
        Color.rgb(249, 115, 22),
        Color.rgb(220, 38, 38))

    fun colour(sev: Int): Int = COLOURS[sev.coerceIn(0, 3)]

    /** Warna yang sama sebagai tiga apungan, untuk pin GL. */
    fun rgb(sev: Int): FloatArray {
        val c = colour(sev)
        return floatArrayOf(Color.red(c) / 255f, Color.green(c) / 255f, Color.blue(c) / 255f)
    }

    fun card(photo: Bitmap?, n: Int, title: String, sev: Int): Bitmap {
        val bmp = Bitmap.createBitmap(W, H, Bitmap.Config.ARGB_8888)
        val c = Canvas(bmp)
        val p = Paint(Paint.ANTI_ALIAS_FLAG)
        val accent = colour(sev)

        // Badan putih dengan bucu bulat.
        p.color = Color.WHITE
        c.drawRoundRect(RectF(0f, 0f, W.toFloat(), H.toFloat()), 14f, 14f, p)

        // Gambar, dipotong di tengah supaya nisbahnya tidak pernah diregang.
        if (photo != null && photo.width > 0 && photo.height > 0) {
            val want = W.toFloat() / PHOTO_H
            val have = photo.width.toFloat() / photo.height
            val src = if (have > want) {
                val w = (photo.height * want).toInt().coerceAtMost(photo.width)
                Rect((photo.width - w) / 2, 0, (photo.width - w) / 2 + w, photo.height)
            } else {
                val h = (photo.width / want).toInt().coerceAtMost(photo.height)
                Rect(0, (photo.height - h) / 2, photo.width, (photo.height - h) / 2 + h)
            }
            c.save()
            val clip = android.graphics.Path()
            clip.addRoundRect(RectF(0f, 0f, W.toFloat(), PHOTO_H.toFloat()), 14f, 14f,
                android.graphics.Path.Direction.CW)
            // Bucu bawah gambar lurus, kerana jalur di bawahnya bersambung.
            clip.addRect(RectF(0f, PHOTO_H - 16f, W.toFloat(), PHOTO_H.toFloat()),
                android.graphics.Path.Direction.CW)
            c.clipPath(clip)
            c.drawBitmap(photo, src, Rect(0, 0, W, PHOTO_H), p)
            c.restore()
        } else {
            p.color = Color.rgb(226, 232, 240)
            c.drawRect(0f, 0f, W.toFloat(), PHOTO_H.toFloat(), p)
            p.color = Color.rgb(120, 130, 145)
            p.textSize = 15f
            p.textAlign = Paint.Align.CENTER
            c.drawText("tiada gambar", W / 2f, PHOTO_H / 2f + 5f, p)
            p.textAlign = Paint.Align.LEFT
        }

        // Nombor, di atas gambar. Inilah yang dirujuk dalam laporan, jadi ia
        // mesti boleh dibaca walaupun kad itu kecil di hujung bilik.
        p.color = Color.argb(225, 17, 20, 24)
        c.drawCircle(27f, 27f, 19f, p)
        p.color = Color.WHITE
        p.textSize = 22f
        p.isFakeBoldText = true
        p.textAlign = Paint.Align.CENTER
        c.drawText(n.toString(), 27f, 35f, p)
        p.textAlign = Paint.Align.LEFT
        p.isFakeBoldText = false

        // Jalur bawah: kod keterukan, kemudian tajuk.
        p.color = accent
        c.drawRect(0f, PHOTO_H.toFloat(), W.toFloat(), H.toFloat(), p)
        p.color = Color.WHITE
        p.textSize = 20f
        p.isFakeBoldText = true
        c.drawText(CODES[sev.coerceIn(0, 3)], 12f, H - 17f, p)
        p.isFakeBoldText = false
        p.textSize = 17f
        val t = title.ifBlank { NAMES[sev.coerceIn(0, 3)] }
        c.drawText(ellipsize(t, p, (W - 62).toFloat()), 52f, H - 17f, p)

        // Tepi berwarna keterukan, supaya kad terbaca sebagai satu objek
        // walaupun di hadapan dinding putih.
        p.style = Paint.Style.STROKE
        p.strokeWidth = 5f
        p.color = accent
        c.drawRoundRect(RectF(2.5f, 2.5f, W - 2.5f, H - 2.5f), 14f, 14f, p)
        return bmp
    }

    /**
     * Sasaran di tengah gambar panduan titik kunci.
     *
     * Tangkapan itu ialah bingkai kamera yang bersih, dan silang bidikan
     * ialah View berasingan yang tidak berada di dalamnya. Tanpa tanda ini,
     * gambar itu cuma "bilik" — dan tiga bulan kemudian "bucu yang mana"
     * tiada jawapan. Titik itu sentiasa di tengah skrin semasa ditanda,
     * jadi di sinilah ia.
     */
    fun aimed(src: Bitmap): Bitmap {
        val b = if (src.isMutable) src else src.copy(Bitmap.Config.ARGB_8888, true)
        val c = Canvas(b)
        val cx = b.width / 2f
        val cy = b.height / 2f
        val r = minOf(b.width, b.height) * 0.09f
        val p = Paint(Paint.ANTI_ALIAS_FLAG)
        p.style = Paint.Style.STROKE
        // Dua lapis: gelap di bawah, terang di atas. Satu warna sahaja
        // hilang pada dinding yang kebetulan sewarna dengannya.
        for (pass in 0..1) {
            p.color = if (pass == 0) Color.argb(170, 0, 0, 0) else Color.rgb(96, 220, 140)
            p.strokeWidth = if (pass == 0) r * 0.34f else r * 0.17f
            c.drawCircle(cx, cy, r, p)
            c.drawLine(cx - r * 2f, cy, cx - r * 1.35f, cy, p)
            c.drawLine(cx + r * 1.35f, cy, cx + r * 2f, cy, p)
            c.drawLine(cx, cy - r * 2f, cx, cy - r * 1.35f, p)
            c.drawLine(cx, cy + r * 1.35f, cx, cy + r * 2f, p)
        }
        p.style = Paint.Style.FILL
        p.color = Color.rgb(96, 220, 140)
        c.drawCircle(cx, cy, r * 0.22f, p)
        return b
    }

    private fun ellipsize(s: String, p: Paint, max: Float): String {
        if (p.measureText(s) <= max) return s
        var n = s.length
        while (n > 1 && p.measureText(s.substring(0, n) + "…") > max) n--
        return s.substring(0, n) + "…"
    }
}
