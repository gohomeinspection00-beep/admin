package my.goxpert.pocket

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.Gravity
import android.view.ViewGroup
import android.webkit.GeolocationPermissions
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import java.io.File

class MainActivity : AppCompatActivity() {

    private lateinit var web: WebView
    private lateinit var uvc: UvcSource
    private var server: LocalServer? = null

    private val pocketFile: File get() = File(filesDir, "pocket.html")

    private val pickPocket = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri: Uri? ->
        uri ?: return@registerForActivityResult
        try {
            contentResolver.openInputStream(uri)!!.use { input ->
                pocketFile.outputStream().use { input.copyTo(it) }
            }
            toast("Pocket dimuat, ${pocketFile.length() / 1024} KB")
            web.loadUrl(HOME)
        } catch (e: Throwable) {
            toast("Gagal memuat: ${e.message}")
        }
    }

    private val askPerms = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { /* Pocket sendiri akan beritahu apa yang kurang. */ }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        uvc = UvcSource(this)
        uvc.start()

        try {
            server = LocalServer(uvc, pocketFile).also { it.start(0, true) }
            uvc.say("Pelayan hidup pada $HOME")
        } catch (e: Throwable) {
            uvc.say("Pelayan GAGAL bermula: ${e.message}")
            toast("Port ${LocalServer.PORT} sedang dipakai. Tutup app ini sepenuhnya dan buka semula.")
        }

        web = WebView(this).apply {
            setBackgroundColor(Color.BLACK)
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                databaseEnabled = true
                mediaPlaybackRequiresUserGesture = false
                loadWithOverviewMode = true
                useWideViewPort = true
                cacheMode = WebSettings.LOAD_DEFAULT
                // Tiada akses fail diperlukan: semuanya datang dari pelayan
                // tempatan, jadi biarkan kedua-duanya tertutup.
                allowFileAccess = false
                allowContentAccess = false
            }
            webViewClient = WebViewClient()
            webChromeClient = object : WebChromeClient() {
                // Pocket meminta kamera telefon, mikrofon dan lokasi sendiri.
                // Tanpa ini permintaan itu ditolak senyap dalam WebView.
                override fun onPermissionRequest(request: PermissionRequest) {
                    runOnUiThread { request.grant(request.resources) }
                }
                override fun onGeolocationPermissionsShowPrompt(
                    origin: String?, callback: GeolocationPermissions.Callback?
                ) { callback?.invoke(origin, true, false) }
            }
        }

        val root = FrameLayout(this)
        root.addView(web, FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT))

        // Satu butang kecil, lut sinar, supaya ia tidak mengganggu Pocket.
        val menu = Button(this).apply {
            text = "⋮"
            setTextColor(Color.WHITE)
            setBackgroundColor(Color.argb(90, 0, 0, 0))
            setOnClickListener { showMenu() }
        }
        root.addView(menu, FrameLayout.LayoutParams(110, 110).apply {
            gravity = Gravity.TOP or Gravity.END
            topMargin = 8; rightMargin = 8
        })

        setContentView(root)
        requestNeeded()
        web.loadUrl(HOME)

        onBackPressedDispatcher.addCallback(this,
            object : androidx.activity.OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    if (web.canGoBack()) web.goBack() else finish()
                }
            })
    }

    private fun showMenu() {
        val items = arrayOf(
            "Muat fail Pocket",
            "Diagnostik endoskop",
            "Muat semula",
            "Sambung semula endoskop"
        )
        AlertDialog.Builder(this)
            .setTitle("GoXpert Pocket")
            .setItems(items) { _, which ->
                when (which) {
                    0 -> pickPocket.launch(arrayOf("text/html", "*/*"))
                    1 -> web.loadUrl("$HOME/uvc/debug")
                    2 -> web.loadUrl(HOME)
                    3 -> { uvc.stop(); uvc.start(); toast("Mencari endoskop semula") }
                }
            }
            .show()
    }

    private fun requestNeeded() {
        val want = mutableListOf(Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.ACCESS_FINE_LOCATION)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            want += Manifest.permission.BLUETOOTH_SCAN
            want += Manifest.permission.BLUETOOTH_CONNECT
        }
        val missing = want.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isNotEmpty()) askPerms.launch(missing.toTypedArray())
    }

    private fun toast(s: String) = Toast.makeText(this, s, Toast.LENGTH_LONG).show()

    override fun onDestroy() {
        super.onDestroy()
        server?.stop()
        uvc.stop()
    }

    companion object {
        /**
         * Mesti "localhost" dan bukan 127.0.0.1. WebView Android hanya mengira
         * https, file, dan nama hos localhost yang tepat sebagai konteks
         * selamat; pada 127.0.0.1 kamera, Bluetooth dan GPS dalam Pocket akan
         * mati senyap. Fail hosts Android memetakan localhost ke 127.0.0.1,
         * iaitu alamat yang pelayan terikat padanya.
         */
        private const val HOME = "http://localhost:${LocalServer.PORT}"
    }
}
