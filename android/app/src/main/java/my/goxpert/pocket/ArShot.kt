package my.goxpert.pocket

import android.app.Activity
import android.content.ContentValues
import android.graphics.Bitmap
import android.opengl.GLES20
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import java.io.File
import java.io.FileOutputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder

/**
 * Tangkap skrin AR ke galeri telefon.
 *
 * Dibaca daripada penimbal GL dan bukan daripada View: apa yang surveyor nak
 * ialah kamera dan hamparan tepat seperti yang dilihat, dan View tidak
 * mengandungi imej kamera sama sekali.
 *
 * Dipisahkan daripada skrin pelan supaya skrin model tidak membawa salinan
 * ketiga kod yang sama.
 */
object ArShot {

    /** Mesti dipanggil pada benang GL, selepas bingkai dilukis. */
    fun capture(w: Int, h: Int): Bitmap? {
        if (w <= 0 || h <= 0) return null
        val buf = ByteBuffer.allocateDirect(w * h * 4).order(ByteOrder.nativeOrder())
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
                out[dst + x] = (0xff shl 24) or
                    ((c and 0xff) shl 16) or
                    (((c shr 8) and 0xff) shl 8) or
                    ((c shr 16) and 0xff)
            }
        }
        return Bitmap.createBitmap(out, w, h, Bitmap.Config.ARGB_8888)
    }

    fun save(ctx: Activity, bmp: Bitmap, name: String): Boolean {
        val dir = Environment.DIRECTORY_PICTURES + "/GoXpert Pocket"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val cv = ContentValues().apply {
                put(MediaStore.Images.Media.DISPLAY_NAME, name)
                put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
                put(MediaStore.Images.Media.RELATIVE_PATH, dir)
                put(MediaStore.Images.Media.IS_PENDING, 1)
            }
            val uri = ctx.contentResolver.insert(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI, cv) ?: return false
            ctx.contentResolver.openOutputStream(uri)?.use {
                bmp.compress(Bitmap.CompressFormat.JPEG, 92, it)
            } ?: return false
            cv.clear(); cv.put(MediaStore.Images.Media.IS_PENDING, 0)
            ctx.contentResolver.update(uri, cv, null, null)
            return true
        }
        val folder = File(
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES),
            "GoXpert Pocket").apply { mkdirs() }
        val f = File(folder, name)
        FileOutputStream(f).use { bmp.compress(Bitmap.CompressFormat.JPEG, 92, it) }
        // Tanpa imbasan, galeri tidak akan menemuinya pada Android lama.
        android.media.MediaScannerConnection.scanFile(
            ctx, arrayOf(f.absolutePath), arrayOf("image/jpeg"), null)
        return true
    }
}
