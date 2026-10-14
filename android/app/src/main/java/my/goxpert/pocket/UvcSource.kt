package my.goxpert.pocket

import android.content.Context
import android.graphics.ImageFormat
import android.graphics.Rect
import android.graphics.SurfaceTexture
import android.graphics.YuvImage
import android.hardware.usb.UsbDevice
import android.util.Log
import android.view.Surface
import com.herohan.uvcapp.CameraHelper
import com.herohan.uvcapp.ICameraHelper
import com.serenegiant.usb.IFrameCallback
import com.serenegiant.usb.UVCCamera
import java.io.ByteArrayOutputStream
import java.nio.ByteBuffer
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Satu-satunya tempat yang menyentuh pustaka UVC.
 *
 * Endoskop ini kamera UVC tulen, tetapi Android pada telefon ini tidak
 * mendaftarkannya pada perkhidmatan kamera, jadi tiada pelayar boleh
 * melihatnya. App vendor menyelesaikannya dengan membuka nod USB mentah
 * melalui libusb; kita buat perkara yang sama melalui pustaka ini, kemudian
 * menghidangkan bingkainya sebagai JPEG supaya Pocket boleh memaparkannya
 * dengan satu tag img.
 *
 * Setiap langkah dicatatkan. Saya tidak boleh menguji APK ini, jadi bila ia
 * gagal pada telefon sebenar, log itulah yang memberitahu kita di mana.
 */
class UvcSource(private val ctx: Context) {

    @Volatile var latestJpeg: ByteArray? = null
        private set
    @Volatile var frameCount: Long = 0L
        private set
    @Volatile var width: Int = 0
        private set
    @Volatile var height: Int = 0
        private set
    @Volatile var deviceName: String = ""
        private set
    @Volatile var opened: Boolean = false
        private set

    private val log = ArrayDeque<String>()
    private var helper: ICameraHelper? = null
    private var dummySurface: Surface? = null
    private var dummyTexture: SurfaceTexture? = null

    fun say(msg: String) {
        val t = SimpleDateFormat("HH:mm:ss.SSS", Locale.UK).format(Date())
        synchronized(log) {
            log.addLast("$t  $msg")
            while (log.size > 200) log.removeFirst()
        }
        Log.i(TAG, msg)
    }

    fun logLines(): List<String> = synchronized(log) { log.toList() }

    fun start() {
        if (helper != null) return
        try {
            val h = CameraHelper()
            h.setStateCallback(state)
            helper = h
            say("CameraHelper created, waiting for a device")
        } catch (e: Throwable) {
            say("GAGAL mencipta CameraHelper: ${e.javaClass.simpleName}: ${e.message}")
        }
    }

    fun stop() {
        try {
            helper?.releaseAll()
        } catch (e: Throwable) {
            say("Error while releasing: ${e.message}")
        }
        helper = null
        opened = false
        dummySurface?.release(); dummySurface = null
        dummyTexture?.release(); dummyTexture = null
        say("Dihentikan")
    }

    private val state = object : ICameraHelper.StateCallback {
        override fun onAttach(device: UsbDevice?) {
            device ?: return
            say("Dicolok: ${desc(device)}")
            try {
                helper?.selectDevice(device)
            } catch (e: Throwable) {
                say("selectDevice gagal: ${e.message}")
            }
        }

        override fun onDeviceOpen(device: UsbDevice?, isFirstOpen: Boolean) {
            say("Device opened (first=$isFirstOpen)")
            try {
                helper?.openCamera()
            } catch (e: Throwable) {
                say("openCamera gagal: ${e.message}")
            }
        }

        override fun onCameraOpen(device: UsbDevice?) {
            deviceName = device?.let { desc(it) } ?: "UVC"
            say("Camera opened")
            try {
                val h = helper ?: return
                h.previewSize?.let {
                    width = it.width
                    height = it.height
                    say("Preview size ${it.width} x ${it.height}")
                }
                // Pustaka ini mengharapkan satu permukaan sebelum pratonton
                // bermula. Tiada apa akan melihatnya: bingkai sampai kepada
                // kita melalui panggilan balik, bukan melalui skrin.
                if (dummySurface == null) {
                    val tex = SurfaceTexture(0).also { dummyTexture = it }
                    if (width > 0 && height > 0) tex.setDefaultBufferSize(width, height)
                    dummySurface = Surface(tex).also { h.addSurface(it, false) }
                    say("Permukaan tersembunyi dipasang")
                }
                h.setFrameCallback(frameCb, UVCCamera.PIXEL_FORMAT_NV21)
                h.startPreview()
                opened = true
                say("Pratonton bermula")
            } catch (e: Throwable) {
                say("Gagal memulakan pratonton: ${e.javaClass.simpleName}: ${e.message}")
            }
        }

        override fun onCameraClose(device: UsbDevice?) {
            opened = false
            say("Camera closed")
            try { helper?.stopPreview() } catch (_: Throwable) {}
        }

        override fun onDeviceClose(device: UsbDevice?) { say("Device closed") }

        override fun onDetach(device: UsbDevice?) {
            opened = false
            latestJpeg = null
            say("Dicabut")
        }

        override fun onCancel(device: UsbDevice?) {
            say("Kebenaran USB ditolak oleh pengguna")
        }
    }

    private val frameCb = IFrameCallback { buf: ByteBuffer? ->
        buf ?: return@IFrameCallback
        try {
            val w = width
            val h = height
            if (w <= 0 || h <= 0) return@IFrameCallback

            // Penimbal itu milik pustaka dan diguna semula, jadi salin dahulu.
            val nv21 = ByteArray(buf.remaining())
            buf.get(nv21)

            val out = ByteArrayOutputStream(nv21.size / 3)
            YuvImage(nv21, ImageFormat.NV21, w, h, null)
                .compressToJpeg(Rect(0, 0, w, h), JPEG_QUALITY, out)
            latestJpeg = out.toByteArray()

            frameCount++
            if (frameCount == 1L) say("First frame received, ${latestJpeg?.size} JPEG bytes")
        } catch (e: Throwable) {
            if (frameCount == 0L) say("Frame conversion failed: ${e.javaClass.simpleName}: ${e.message}")
        }
    }

    private fun desc(d: UsbDevice): String =
        "${d.productName ?: "tanpa nama"}  VID=%04x PID=%04x".format(d.vendorId, d.productId)

    companion object {
        private const val TAG = "UvcSource"
        private const val JPEG_QUALITY = 80
    }
}
