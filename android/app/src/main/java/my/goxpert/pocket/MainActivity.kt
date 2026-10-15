package my.goxpert.pocket

import android.Manifest
import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.ContentValues
import android.content.Intent
import android.graphics.Bitmap
import android.app.AlertDialog
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.Bundle
import android.view.Gravity
import android.view.ViewGroup
import android.provider.MediaStore
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.speech.tts.Voice
import android.graphics.BitmapFactory
import android.util.Base64
import android.webkit.GeolocationPermissions
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.ValueCallback
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebResourceRequest
import android.webkit.WebViewClient
import android.view.WindowManager
import androidx.core.content.FileProvider
import com.google.ar.core.ArCoreApk
import android.widget.Button
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import java.io.File
import java.io.FileOutputStream
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var web: WebView
    private lateinit var uvc: UvcSource
    private var server: LocalServer? = null

    /**
     * API Web Speech tidak dihantar bersama WebView Android: objek
     * speechSynthesis ada, getVoices() pulangkan senarai kosong, dan speak()
     * tidak mengeluarkan apa-apa bunyi dan tidak melaporkan apa-apa. Itulah
     * sebabnya mod remote Tally bercakap dalam Chrome tetapi senyap di dalam
     * app. Ini ialah TTS Android sebenar, didedahkan kepada halaman itu.
     */
    private var tts: TextToSpeech? = null
    @Volatile private var ttsOk = false

    /**
     * API Web Speech untuk pengecaman juga tidak wujud dalam WebView, jadi
     * window.SpeechRecognition adalah undefined dan setiap butang mikrofon
     * dalam Pocket mati. Ini SpeechRecognizer Android, dibentangkan supaya
     * halaman itu boleh memakaikan antara muka yang sama di atasnya.
     */
    private var rec: SpeechRecognizer? = null
    private var recOn = false

    /**
     * Suara terbaik yang enjin ini ada untuk satu bahasa.
     *
     * setLanguage sahaja memberi apa sahaja yang enjin anggap lalai, yang
     * biasanya suara terbenam yang kecil dan terdengar seperti robot. Suara
     * neural untuk bahasa yang sama duduk dalam senarai yang sama dan
     * melaporkan kualiti yang lebih tinggi; enjin tidak memilihnya sendiri.
     *
     * Kualiti dahulu, kemudian negara yang sepadan. Pada kualiti yang sama,
     * suara yang tidak memerlukan rangkaian menang: di tapak, isyarat tidak
     * boleh diharap, dan suara yang senyap lebih teruk daripada suara yang
     * kurang cantik.
     */
    private fun bestVoice(loc: Locale): Voice? {
        val t = tts ?: return null
        val all = runCatching { t.voices }.getOrNull() ?: return null
        val want = loc.language.lowercase()
        val fit = all.filter { v ->
            val lang = runCatching { v.locale.language.lowercase() }.getOrNull()
            lang == want && v.features?.contains(
                TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED) != true
        }
        if (fit.isEmpty()) return null
        return fit.sortedWith(
            compareByDescending<Voice> { it.quality }
                .thenByDescending { it.locale.country.equals(loc.country, true) }
                .thenBy { it.isNetworkConnectionRequired }
        ).firstOrNull()
    }

    /** Tetapkan bahasa DAN suara terbaiknya. Benar kalau bahasa itu ada. */
    private fun useLang(bcp: String): Boolean {
        val t = tts ?: return false
        val loc = runCatching { Locale.forLanguageTag(bcp) }.getOrNull() ?: return false
        val r = runCatching { t.setLanguage(loc) }.getOrNull() ?: return false
        if (r == TextToSpeech.LANG_MISSING_DATA || r == TextToSpeech.LANG_NOT_SUPPORTED) return false
        bestVoice(loc)?.let { v -> runCatching { t.voice = v } }
        return true
    }

    private fun sayEvent(k: String) {
        val js = "window.pkSaid && window.pkSaid(" + jsStr(k) + ")"
        runOnUiThread { runCatching { web.evaluateJavascript(js, null) } }
    }

    /** Halaman mendengar melalui satu fungsi; setiap peristiwa pergi ke sana. */
    private fun recEvent(kind: String, a: String = "", b: String = "") {
        val js = "window.pkRecog && window.pkRecog(" +
            jsStr(kind) + "," + jsStr(a) + "," + jsStr(b) + ")"
        runOnUiThread { runCatching { web.evaluateJavascript(js, null) } }
    }

    private fun jsStr(v: String): String {
        val sb = StringBuilder("\"")
        for (c in v) when (c) {
            '\\' -> sb.append("\\\\")
            '"'  -> sb.append("\\\"")
            '\n' -> sb.append("\\n")
            '\r' -> sb.append("\\r")
            '\t' -> sb.append("\\t")
            '<'  -> sb.append("\\u003c")
            else -> if (c < ' ') sb.append("\\u%04x".format(c.code)) else sb.append(c)
        }
        return sb.append("\"").toString()
    }

    /** Nama ralat Android dipetakan kepada nama API Web, supaya kod halaman
     *  yang sedia ada tidak perlu belajar perbendaharaan kata kedua. */
    private fun recErrName(code: Int): String = when (code) {
        SpeechRecognizer.ERROR_AUDIO -> "audio-capture"
        SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "not-allowed"
        SpeechRecognizer.ERROR_NETWORK,
        SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "network"
        SpeechRecognizer.ERROR_NO_MATCH -> "no-speech"
        SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "no-speech"
        SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "aborted"
        SpeechRecognizer.ERROR_CLIENT -> "aborted"
        else -> "audio-capture"
    }

    private fun recBuild() {
        if (rec != null) return
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            uvc.say("Speech recognition: no service on this phone")
            return
        }
        rec = SpeechRecognizer.createSpeechRecognizer(this).apply {
            setRecognitionListener(object : RecognitionListener {
                override fun onReadyForSpeech(p: Bundle?) { recEvent("start") }
                override fun onBeginningOfSpeech() {}
                override fun onRmsChanged(v: Float) {}
                override fun onBufferReceived(b: ByteArray?) {}
                override fun onEndOfSpeech() {}
                override fun onEvent(t: Int, p: Bundle?) {}

                override fun onPartialResults(p: Bundle?) {
                    val t = p?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        ?.firstOrNull().orEmpty()
                    if (t.isNotEmpty()) recEvent("partial", t)
                }

                override fun onResults(p: Bundle?) {
                    val t = p?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        ?.firstOrNull().orEmpty()
                    recOn = false
                    if (t.isNotEmpty()) recEvent("final", t)
                    recEvent("end")
                }

                override fun onError(code: Int) {
                    recOn = false
                    // Tiada padanan selepas senyap bukan kegagalan yang perlu
                    // dilaporkan; ia cuma tiada apa yang dikatakan.
                    val name = recErrName(code)
                    if (name != "no-speech") recEvent("error", name)
                    recEvent("end")
                }
            })
        }
    }

    private val pocketFile: File get() = File(filesDir, "pocket.html")

    /** Gambar yang baru dipilih, menunggu halaman mengambilnya. */
    private val pickDir: File get() = File(cacheDir, "pick")

    /** Model 3D terakhir yang Pocket PUT ke pelayan tempatan. */
    private val modelDir: File get() = File(cacheDir, "model")
    private val inspDir: File get() = File(cacheDir, "insp")

    /** Gambar yang baru diambil dengan kamera, menunggu diserahkan. */
    private val shotDir: File get() = File(cacheDir, "shot")
    private var shotFile: File? = null
    private var shotUri: Uri? = null

    /**
     * Pemilih gambar app sendiri.
     *
     * <input type=file> dalam WebView bergantung pada onShowFileChooser dan
     * satu ValueCallback yang hidup dalam WebView itu. App pergi ke belakang
     * semasa pemilih di depan, dan kalau Android memusnahkan Activity ini
     * sementara itu, panggilan balik itu mati bersamanya: pengguna memilih
     * gambar dan tiada apa-apa yang masuk, tanpa satu pun ralat. Laluan ini
     * tidak memegang apa-apa merentasi sempadan itu — hasilnya ditulis ke
     * cakera, dan halaman diberitahu nama failnya selepas ia pulang.
     */
    private val pickImg = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { res -> onPicked(res) }

    private val pickPocket = registerForActivityResult(
        ActivityResultContracts.OpenDocument()
    ) { uri: Uri? ->
        uri ?: return@registerForActivityResult
        try {
            contentResolver.openInputStream(uri)!!.use { input ->
                pocketFile.outputStream().use { input.copyTo(it) }
            }
            toast("Pocket loaded, ${pocketFile.length() / 1024} KB")
            web.loadUrl(HOME)
        } catch (e: Throwable) {
            toast("Could not load: ${e.message}")
        }
    }

    private var filePick: ValueCallback<Array<Uri>>? = null

    /** Kamera untuk <input type=file> dalam halaman. */
    private val shotForInput = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { res ->
        val cb = filePick; filePick = null
        val u = shotUri
        val ok = shotOk(res)
        uvc.say("Camera (input): code=${res.resultCode} bytes=${shotFile?.length() ?: 0}")
        shotFile = null; shotUri = null
        cb?.onReceiveValue(if (ok && u != null) arrayOf(u) else null)
    }

    /** Kamera untuk PocketNative.pickImages. Hasilnya melalui laluan sahkod
     *  yang sama seperti gambar yang dipilih, supaya halaman menerima bentuk
     *  yang sama tidak kira dari mana ia datang. */
    private val shotForPick = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { res ->
        val u = shotUri
        val ok = shotOk(res)
        uvc.say("Camera (pick): code=${res.resultCode} bytes=${shotFile?.length() ?: 0}")
        shotFile = null; shotUri = null
        val list = if (ok && u != null) listOf(u) else emptyList()
        Thread({ decodePicked(list, list.size) }, "shot-decode")
            .apply { isDaemon = true }.start()
    }

    private val pickFiles = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { res ->
        val cb = filePick ?: return@registerForActivityResult
        filePick = null
        cb.onReceiveValue(
            WebChromeClient.FileChooserParams.parseResult(res.resultCode, res.data)
        )
    }

    /** Titik dari Activity AR, dihantar kembali ke Pocket apa adanya. */
    private val arMeasure = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { res ->
        val pts = if (res.resultCode == RESULT_OK)
            res.data?.getStringExtra("pts").orEmpty() else ""
        val err = res.data?.getStringExtra("error").orEmpty()
        val js = "window.pkAr && window.pkAr(" +
            jsStr(pts) + "," + jsStr(err) + ")"
        runOnUiThread { runCatching { web.evaluateJavascript(js, null) } }
    }

    /**
     * Skrin model AR memulangkan sisihan yang ditanda, dalam ruang model.
     * Pocket menulisnya sebagai penemuan biasa — koleksi yang sama, laporan
     * yang sama. Ia ditulis selepas keluar dan bukan semasa di dalam AR,
     * kerana di tapak tiada talian dan satu tulisan Firestore yang gagal di
     * tengah ukuran hanya memberi toast yang hilang.
     */
    private val arModelResult = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { res ->
        val devs = if (res.resultCode == RESULT_OK)
            res.data?.getStringExtra("devs").orEmpty() else ""
        val err = res.data?.getStringExtra("error").orEmpty()
        val rms = res.data?.getFloatExtra("rms", 0f) ?: 0f
        val sc = res.data?.getFloatExtra("scale", 1f) ?: 1f
        val js = "window.pkArModel && window.pkArModel(" +
            jsStr(devs) + "," + jsStr(err) + "," + rms + "," + sc + ")"
        runOnUiThread { runCatching { web.evaluateJavascript(js, null) } }
    }

    private val arInspectResult = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { res ->
        val ok = res.resultCode == RESULT_OK
        val err = res.data?.getStringExtra("error").orEmpty()
        val js = "window.pkArInspect && window.pkArInspect(" + ok + "," + jsStr(err) + ")"
        runOnUiThread { runCatching { web.evaluateJavascript(js, null) } }
    }

    /**
     * Null bermakna AR boleh dimulakan. Selainnya ialah sebab, dalam
     * perkataan yang halaman Pocket sudah tahu kendalikan.
     */
    private fun arNotReady(): String? {
        val av = runCatching {
            ArCoreApk.getInstance().checkAvailability(this)
        }.getOrNull()
        if (av != ArCoreApk.Availability.SUPPORTED_INSTALLED) {
            return if (av == ArCoreApk.Availability.SUPPORTED_NOT_INSTALLED ||
                       av == ArCoreApk.Availability.SUPPORTED_APK_TOO_OLD) {
                runCatching { ArCoreApk.getInstance().requestInstall(this, true) }
                "pasang"
            } else "tiada"
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
            != PackageManager.PERMISSION_GRANTED) {
            askPerms.launch(arrayOf(Manifest.permission.CAMERA))
            return "tiada-kebenaran"
        }
        return null
    }

    private val askPerms = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { /* Pocket sendiri akan beritahu apa yang kurang. */ }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        uvc = UvcSource(this)
        uvc.start()

        tts = TextToSpeech(this) { st ->
            ttsOk = st == TextToSpeech.SUCCESS
            if (ttsOk) {
                // Kiraan dibaca dalam bahasa Inggeris ("Hollow, 3"), jadi
                // cuba bahasa itu dahulu dan jatuh ke bahasa peranti.
                if (!useLang("en-GB")) useLang(Locale.getDefault().toLanguageTag())
                runCatching {
                    uvc.say("TTS voice: " + (tts?.voice?.name ?: "(default)"))
                }
            }
            if (ttsOk) runCatching {
                // Chat suara menukar keadaan pada mula dan tamat ucapan.
                // Tanpa peristiwa ini ia kekal pada "sedang bercakap"
                // selama-lamanya, yang lebih teruk daripada senyap.
                tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(id: String?) { sayEvent("start") }
                    override fun onDone(id: String?) { sayEvent("end") }
                    @Deprecated("Required by the base class")
                    override fun onError(id: String?) { sayEvent("end") }
                })
            }
            uvc.say("TTS: " + if (ttsOk) "ready" else "not available (code $st)")
        }

        try {
            server = LocalServer(uvc, pocketFile, pickDir, modelDir, inspDir, assets)
                .also { it.start(0, true) }
            uvc.say("Server up at $HOME")
        } catch (e: Throwable) {
            uvc.say("Server FAILED to start: ${e.message}")
            toast("Port ${LocalServer.PORT} is in use. Close this app completely and open it again.")
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
            webViewClient = object : WebViewClient() {
                // window.open(url, "_blank") dalam WebView tanpa berbilang
                // tetingkap memuat URL itu DI SINI, menggantikan Pocket:
                // mengetik pautan Maps atau WhatsApp membuang pengguna keluar
                // dari app dan satu-satunya jalan balik ialah butang kembali.
                // Apa-apa yang bukan pelayan tempatan kita pergi ke pelayar.
                override fun shouldOverrideUrlLoading(
                    v: WebView?, req: WebResourceRequest?
                ): Boolean = leaveApp(req?.url?.toString())

                @Suppress("DEPRECATION")
                override fun shouldOverrideUrlLoading(v: WebView?, url: String?): Boolean =
                    leaveApp(url)
            }
            // Satu WebView tanpa pengendali ini menelan setiap muat turun
            // secara senyap. Pocket menyimpan PDF melalui jambatan di bawah,
            // tetapi ini menangkap apa-apa yang lain.
            setDownloadListener { url, _, _, _, _ ->
                toast(
                    if (url.startsWith("blob:") || url.startsWith("data:"))
                        "Use the Download button inside Pocket for this file"
                    else "Downloads are not supported here"
                )
            }
            webChromeClient = object : WebChromeClient() {
                // Pocket meminta kamera telefon, mikrofon dan lokasi sendiri.
                // Tanpa ini permintaan itu ditolak senyap dalam WebView.
                override fun onPermissionRequest(request: PermissionRequest) {
                    runOnUiThread { request.grant(request.resources) }
                }
                override fun onGeolocationPermissionsShowPrompt(
                    origin: String?, callback: GeolocationPermissions.Callback?
                ) { callback?.invoke(origin, true, false) }

                // Tanpa ini, mengetik butang pilih fail dalam Pocket tidak
                // membuka apa-apa, dan WebView tidak melaporkan sebarang ralat.
                override fun onShowFileChooser(
                    view: WebView?,
                    cb: ValueCallback<Array<Uri>>?,
                    params: FileChooserParams?
                ): Boolean {
                    // Pocket memilih gambar melalui PocketNative.pickImages,
                    // yang tidak memegang apa-apa merentasi sempadan Activity.
                    // Laluan ini kekal untuk apa-apa <input type=file> lain.
                    filePick?.onReceiveValue(null)
                    filePick = cb

                    val types = params?.acceptTypes?.filter { it.isNotBlank() } ?: emptyList()
                    val isImg = { t: String ->
                        t.startsWith("image/") || t == ".jpg" || t == ".jpeg" || t == ".png"
                    }
                    val anyImage = types.any(isImg)
                    val onlyImage = types.isNotEmpty() && types.all(isImg)

                    // Input bukan gambar — dokumen, GLB, PDF sahaja — tiada
                    // pilihan untuk ditawarkan.
                    if (!anyImage) {
                        return try {
                            pickFiles.launch(params!!.createIntent()); true
                        } catch (e: Throwable) {
                            filePick = null
                            uvc.say("onShowFileChooser failed: ${e.message}")
                            toast("Could not open the file picker")
                            false
                        }
                    }

                    // Setiap input gambar bertanya, tidak kira sama ada ia
                    // ditanda capture="environment" atau tidak. Bendera itu
                    // ialah pilihan penulis HTML; ini pilihan surveyor yang
                    // sedang berdiri di depan kecacatan itu.
                    uvc.say("onShowFileChooser: image, only=$onlyImage " +
                            "capture=${params?.isCaptureEnabled}")
                    askSource(
                        onCamera = {
                            val i = shotIntent()
                            if (i == null) { filePick = null; cb?.onReceiveValue(null) }
                            else try { shotForInput.launch(i) } catch (e: Throwable) {
                                filePick = null; cb?.onReceiveValue(null)
                                toast("No camera app on this phone")
                            }
                        },
                        onFiles = {
                            try {
                                // Pemilih foto untuk gambar sahaja: tiada
                                // kebenaran storan, dan ia lebih pantas.
                                pickFiles.launch(
                                    if (onlyImage) imagePickIntent() else params!!.createIntent())
                            } catch (e: Throwable) {
                                filePick = null; cb?.onReceiveValue(null)
                                toast("Could not open the file picker")
                            }
                        },
                        onCancel = { filePick = null; cb?.onReceiveValue(null) })
                    return true
                }
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

        web.addJavascriptInterface(Native(), "PocketNative")
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
            "Load Pocket file",
            "Diagnostik endoskop",
            "Reload",
            "Reconnect endoscope"
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
        // Penggera check-in SOS perlu sampai walaupun surveyor sudah
        // bertukar ke app lain, dan sejak Android 13 itu memerlukan
        // kebenaran masa jalan.
        if (Build.VERSION.SDK_INT >= 33) want += "android.permission.POST_NOTIFICATIONS"

        val missing = want.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isNotEmpty()) askPerms.launch(missing.toTypedArray())
    }

    /** Halaman menunggu satu jawapan selepas pickImages memulangkan "ok".
     *  Batal ialah jawapan juga, dan tanpa ini butangnya tersekat selamanya. */
    private fun onPickedNone() {
        runOnUiThread {
            runCatching { web.evaluateJavascript("window.enPickDone && enPickDone([],0)", null) }
        }
    }

    private fun toast(s: String) = Toast.makeText(this, s, Toast.LENGTH_LONG).show()

    // ---------- Penggera SOS ----------
    // Satu saluran, dibuat sekali, pada kepentingan TINGGI: penggera
    // keselamatan yang didiamkan oleh sistem bukan penggera.
    private fun sosChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val mgr = getSystemService(NotificationManager::class.java) ?: return
        if (mgr.getNotificationChannel(SOS_CHANNEL) != null) return
        val ch = NotificationChannel(SOS_CHANNEL, "Site safety",
            NotificationManager.IMPORTANCE_HIGH)
        ch.description = "Check-in alarms and SOS"
        ch.enableVibration(true)
        ch.setShowBadge(true)
        mgr.createNotificationChannel(ch)
    }

    private fun postAlarmNote(title: String, body: String) {
        sosChannel()
        val open = Intent(this, MainActivity::class.java)
            .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val flags = PendingIntent.FLAG_UPDATE_CURRENT or
            (if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) PendingIntent.FLAG_IMMUTABLE else 0)
        val pi = PendingIntent.getActivity(this, 0, open, flags)
        val n = NotificationCompat.Builder(this, SOS_CHANNEL)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setVibrate(longArrayOf(0, 400, 150, 400, 150, 400))
            .setAutoCancel(true)
            .setOngoing(false)
            .setContentIntent(pi)
            .build()
        runCatching { NotificationManagerCompat.from(this).notify(SOS_NOTE_ID, n) }
    }

    @Suppress("DEPRECATION")
    private fun buzzFor(ms: Long) {
        runCatching {
            val v = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                (getSystemService(android.os.VibratorManager::class.java))?.defaultVibrator
            } else {
                getSystemService(VIBRATOR_SERVICE) as? android.os.Vibrator
            } ?: return
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v.vibrate(android.os.VibrationEffect.createOneShot(
                    ms, android.os.VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                v.vibrate(ms)
            }
        }
    }

    /**
     * Dalam WebView, doc.save() daripada jsPDF tidak melakukan apa-apa: ia
     * bergantung pada muat turun pelayar, yang tiada di sini. Pocket
     * menghantar bait PDF ke sini sebagai base64 dan kita menulisnya ke
     * folder Muat Turun telefon, di mana mana-mana app boleh membukanya.
     */
    /** Benar bila URL itu dikendalikan di luar: pergi ke pelayar dan biarkan
     *  Pocket di tempatnya. */
    private fun leaveApp(url: String?): Boolean {
        if (url.isNullOrEmpty()) return false
        val u = url.lowercase()
        if (u.startsWith("http://localhost:${LocalServer.PORT}")) return false
        // Senarai putih, bukan senarai hitam: blob: dan data: milik halaman
        // itu sendiri, dan menghantarnya ke ACTION_VIEW cuma menghasilkan
        // ralat yang mengelirukan bila laluan sedia ada akan berjaya.
        val out = u.startsWith("http://") || u.startsWith("https://") ||
            u.startsWith("mailto:") || u.startsWith("tel:") || u.startsWith("sms:") ||
            u.startsWith("geo:") || u.startsWith("whatsapp:") || u.startsWith("intent:")
        if (!out) return false
        return try {
            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
            true
        } catch (e: Throwable) {
            toast("No app to open this link")
            true
        }
    }

    /**
     * Pemilih Foto Android bila ada (API 33+): ia tidak perlukan satu pun
     * kebenaran dan hanya menunjukkan gambar. Di bawah itu, SAF.
     */
    /**
     * Niat ambil gambar, dengan failnya sendiri.
     *
     * Ini yang hilang sepanjang masa ini. FileChooserParams.createIntent()
     * memulangkan ACTION_GET_CONTENT dan TIDAK pernah membuka kamera, walau
     * input itu bertulis capture="environment" — bendera itu didedahkan
     * kepada app justeru supaya app mengendalikannya sendiri. Jadi setiap
     * butang "ambil gambar" dalam Pocket membuka pemilih fail dalam APK.
     *
     * EXTRA_OUTPUT dan bukan bitmap kecil dalam extras: tanpa ia, app kamera
     * memulangkan lakaran kecil beberapa ratus piksel, yang tidak berguna
     * untuk mengukur retak.
     */
    private fun shotIntent(): Intent? = try {
        shotDir.mkdirs()
        // Satu sahaja disimpan: setiap gambar sudah diserahkan ke halaman.
        shotDir.listFiles()?.forEach { runCatching { it.delete() } }
        val f = File(shotDir, "shot-${System.currentTimeMillis()}.jpg")
        val u = FileProvider.getUriForFile(this, "$packageName.files", f)
        shotFile = f; shotUri = u
        Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            .putExtra(MediaStore.EXTRA_OUTPUT, u)
            .addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION or
                      Intent.FLAG_GRANT_READ_URI_PERMISSION)
    } catch (e: Throwable) {
        uvc.say("Camera intent failed: ${e.message}")
        shotFile = null; shotUri = null
        null
    }

    private fun hasCamPerm(): Boolean =
        ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) ==
            PackageManager.PERMISSION_GRANTED

    /** Benar bila gambar itu benar-benar ditulis. */
    private fun shotOk(res: ActivityResult): Boolean =
        res.resultCode == RESULT_OK && (shotFile?.length() ?: 0L) > 0L

    /**
     * Kamera atau fail — ditanya sekali, di satu tempat, untuk setiap input
     * gambar dalam Pocket.
     *
     * Butang yang hanya boleh membuka kamera tidak berguna bila gambar itu
     * sudah ada dalam telefon, dan butang yang hanya boleh membuka fail
     * tidak berguna bila kecacatan itu ada di depan mata. Kedua-duanya
     * berlaku di tapak.
     */
    private fun askSource(onCamera: () -> Unit, onFiles: () -> Unit, onCancel: () -> Unit) {
        android.app.AlertDialog.Builder(this)
            .setTitle("Where from?")
            .setItems(arrayOf("Take a photo now", "Pick from files")) { _, w ->
                if (w == 0) {
                    if (!hasCamPerm()) {
                        askPerms.launch(arrayOf(Manifest.permission.CAMERA))
                        toast("Allow the camera, then try again")
                        onCancel()
                    } else onCamera()
                } else onFiles()
            }
            .setOnCancelListener { onCancel() }
            .show()
    }

    private fun imagePickIntent(): Intent =
        if (Build.VERSION.SDK_INT >= 33) {
            Intent(MediaStore.ACTION_PICK_IMAGES).apply {
                putExtra(MediaStore.EXTRA_PICK_IMAGES_MAX, 20)
            }
        } else {
            Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                type = "image/*"
                addCategory(Intent.CATEGORY_OPENABLE)
                putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
            }
        }

    /**
     * Setiap gambar disahkod dan ditulis semula sebagai JPEG, bukan disalin
     * mentah: pemilih itu boleh memulangkan HEIC, dan WebView lama tidak
     * boleh melukisnya di atas kanvas. Menyahkod di sini bermakna halaman
     * sentiasa menerima sesuatu yang ia pasti boleh baca.
     */
    private fun onPicked(res: ActivityResult) {
        val uris = ArrayList<Uri>()
        val d = res.data
        if (res.resultCode == RESULT_OK && d != null) {
            d.clipData?.let { c -> for (i in 0 until c.itemCount) uris.add(c.getItemAt(i).uri) }
            if (uris.isEmpty()) d.data?.let { uris.add(it) }
        }
        val picked = uris.size
        uvc.say("Photo picker: code=${res.resultCode}, $picked chosen")

        // Menyahkod dan mengekod semula sehingga 20 gambar mengambil masa
        // beberapa saat. Di atas thread utama itu app yang tergantung, jadi
        // kerja itu dibuat di belakang dan hanya hasilnya kembali ke sini.
        Thread({ decodePicked(uris, picked) }, "pick-decode")
            .apply { isDaemon = true }.start()
    }

    /**
     * Bilangan yang dipilih dihantar bersama nama fail, supaya halaman boleh
     * membezakan "pengguna menekan batal" daripada "gambar dipilih tetapi
     * tiada satu pun dapat dibaca". Tanpa itu, kegagalan sahkod akan nampak
     * sama seperti batal: senyap, iaitu pepijat yang sama yang kita baru
     * hilangkan.
     */
    /**
     * Pusingkan mengikut EXIF, kerana piksel itu sendiri tidak dipusingkan.
     *
     * Dipakai pada gambar yang dipilih juga dan bukan hanya yang baru
     * diambil: gambar dalam galeri datang dari kamera yang sama dan membawa
     * tanda yang sama.
     */
    private fun rotateByExif(u: Uri, bmp: Bitmap): Bitmap {
        val deg = try {
            contentResolver.openInputStream(u)?.use { ins ->
                when (android.media.ExifInterface(ins).getAttributeInt(
                    android.media.ExifInterface.TAG_ORIENTATION,
                    android.media.ExifInterface.ORIENTATION_NORMAL)) {
                    android.media.ExifInterface.ORIENTATION_ROTATE_90 -> 90f
                    android.media.ExifInterface.ORIENTATION_ROTATE_180 -> 180f
                    android.media.ExifInterface.ORIENTATION_ROTATE_270 -> 270f
                    else -> 0f
                }
            } ?: 0f
        } catch (e: Throwable) { 0f }
        if (deg == 0f) return bmp
        return try {
            val m = android.graphics.Matrix().apply { postRotate(deg) }
            val out = Bitmap.createBitmap(bmp, 0, 0, bmp.width, bmp.height, m, true)
            if (out !== bmp) bmp.recycle()
            out
        } catch (e: Throwable) { bmp }
    }

    private fun decodePicked(uris: List<Uri>, picked: Int) {
        pickDir.mkdirs()
        pickDir.listFiles()?.forEach { runCatching { it.delete() } }

        val names = ArrayList<String>()
        uris.forEachIndexed { i, u ->
            try {
                // inSampleSize dahulu, supaya gambar 50 MP tidak membunuh app.
                val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
                contentResolver.openInputStream(u)?.use { BitmapFactory.decodeStream(it, null, bounds) }
                var scale = 1
                while (maxOf(bounds.outWidth, bounds.outHeight) / scale > 2400) scale *= 2
                val opts = BitmapFactory.Options().apply { inSampleSize = scale }
                val raw = contentResolver.openInputStream(u)?.use {
                    BitmapFactory.decodeStream(it, null, opts)
                } ?: throw IllegalStateException("could not be decoded")
                // Gambar kamera hampir selalu membawa putaran dalam EXIF dan
                // bukan dalam piksel — telefon dipegang menegak, sensornya
                // melintang. BitmapFactory mengabaikannya sepenuhnya, jadi
                // tanpa ini setiap gambar yang diambil masuk mengiring.
                val bmp = rotateByExif(u, raw)
                val f = File(pickDir, "p$i.jpg")
                FileOutputStream(f).use { out ->
                    bmp.compress(Bitmap.CompressFormat.JPEG, 88, out)
                }
                bmp.recycle()
                if (f.length() > 0) {
                    names.add("/pick/" + f.name)
                    uvc.say("Photo $i: ${bounds.outWidth}x${bounds.outHeight} -> ${f.length()} bytes")
                } else uvc.say("Photo $i: empty file")
            } catch (e: Throwable) {
                uvc.say("Photo $i failed: ${e.javaClass.simpleName}: ${e.message}")
            }
        }

        val js = "window.enPickDone && window.enPickDone([" +
            names.joinToString(",") { "\"$it\"" } + "], $picked)"
        runOnUiThread { runCatching { web.evaluateJavascript(js, null) } }
    }

    inner class Native {
        /**
         * Halaman meminta gambar; app membuka pemilih dan memanggil
         * window.enPickDone bila ia pulang. Memulangkan "ok" bermakna pemilih
         * dilancarkan, bukan bermakna pengguna memilih apa-apa.
         */
        @JavascriptInterface
        fun pickImages(): String =
            try {
                runOnUiThread {
                    askSource(
                        onCamera = {
                            val i = shotIntent()
                            if (i == null) onPickedNone()
                            else try { shotForPick.launch(i) } catch (e: Throwable) {
                                toast("No camera app on this phone"); onPickedNone()
                            }
                        },
                        onFiles = {
                            try { pickImg.launch(imagePickIntent()) }
                            catch (e: Throwable) {
                                toast("Could not open the picker"); onPickedNone()
                            }
                        },
                        onCancel = { onPickedNone() })
                }
                "ok"
            } catch (e: Throwable) {
                uvc.say("Picker could not be opened: ${e.message}")
                "failed: ${e.message}"
            }

        /** Baca satu baris. QUEUE_FLUSH: kiraan laju tidak menimbun baris
         *  gilir, yang terakhir sahaja kedengaran. */
        @JavascriptInterface
        fun say(text: String, rate: Float): String {
            val t = tts
            if (t == null || !ttsOk) return "tiada"
            return try {
                t.setSpeechRate(if (rate > 0f) rate else 1f)
                t.speak(text, TextToSpeech.QUEUE_FLUSH, null, "pocket")
                "ok"
            } catch (e: Throwable) {
                "failed: ${e.message}"
            }
        }

        /** Baca dalam satu bahasa tertentu. TextToSpeech tiada bahasa
         *  per-ucapan, jadi bahasa ditetapkan dahulu; QUEUE_FLUSH bermakna
         *  hanya ucapan terakhir yang penting. */
        @JavascriptInterface
        fun sayIn(text: String, bcp: String, rate: Float): String {
            val t = tts
            if (t == null || !ttsOk) return "tiada"
            return try {
                if (!useLang(bcp)) return "tiada-bahasa"
                t.setSpeechRate(if (rate > 0f) rate else 1f)
                t.speak(text, TextToSpeech.QUEUE_FLUSH, null, "pocket")
                "ok"
            } catch (e: Throwable) {
                "failed: ${e.message}"
            }
        }

        /** Satu bahasa pada satu masa: enjin boleh ada tetapi data bahasa
         *  itu tidak dipasang, dan kedua-duanya kelihatan sama dari halaman
         *  melainkan kita bertanya. */
        @JavascriptInterface
        fun canSayIn(bcp: String): Boolean {
            val t = tts
            if (t == null || !ttsOk) return false
            return try {
                when (t.isLanguageAvailable(Locale.forLanguageTag(bcp))) {
                    TextToSpeech.LANG_AVAILABLE,
                    TextToSpeech.LANG_COUNTRY_AVAILABLE,
                    TextToSpeech.LANG_COUNTRY_VAR_AVAILABLE -> true
                    else -> false
                }
            } catch (e: Throwable) { false }
        }

        /** Android boleh memasang data suara yang hilang; "tiada suara"
         *  sepatutnya satu benda yang boleh dibaiki, bukan jalan buntu. */
        @JavascriptInterface
        fun installVoices(): String =
            try {
                runOnUiThread {
                    runCatching {
                        startActivity(Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA))
                    }
                }
                "ok"
            } catch (e: Throwable) {
                "failed: ${e.message}"
            }

        /** Buka pautan di luar app. */
        /**
         * Apa yang telefon ini boleh buat dengan AR, dalam satu perkataan.
         *
         * "ok" sedia; "pasang" bermakna telefon disahkan tetapi Google Play
         * Services for AR belum dipasang, yang boleh dibaiki; "tiada"
         * bermakna peranti ini tidak disokong dan tiada kod akan mengubah
         * itu; "tunggu" bermakna ARCore masih menyemak.
         */
        @JavascriptInterface
        fun arState(): String =
            try {
                when (ArCoreApk.getInstance().checkAvailability(this@MainActivity)) {
                    ArCoreApk.Availability.SUPPORTED_INSTALLED -> "ok"
                    ArCoreApk.Availability.SUPPORTED_APK_TOO_OLD,
                    ArCoreApk.Availability.SUPPORTED_NOT_INSTALLED -> "pasang"
                    ArCoreApk.Availability.UNKNOWN_CHECKING -> "tunggu"
                    else -> "tiada"
                }
            } catch (e: Throwable) { "tiada" }

        /**
         * Buka skrin AR. Bila ARCore belum dipasang, Google sendiri
         * mengendalikan pemasangan itu; kita cuma memintanya.
         */
        @JavascriptInterface
        fun arStart(kind: String): String {
            var out = "ok"
            runOnUiThread {
                try {
                    val av = ArCoreApk.getInstance().checkAvailability(this@MainActivity)
                    if (av == ArCoreApk.Availability.SUPPORTED_NOT_INSTALLED ||
                        av == ArCoreApk.Availability.SUPPORTED_APK_TOO_OLD) {
                        ArCoreApk.getInstance().requestInstall(this@MainActivity, true)
                        out = "pasang"
                        return@runOnUiThread
                    }
                    if (av != ArCoreApk.Availability.SUPPORTED_INSTALLED) {
                        out = "tiada"; return@runOnUiThread
                    }
                    if (ContextCompat.checkSelfPermission(
                            this@MainActivity, Manifest.permission.CAMERA)
                        != PackageManager.PERMISSION_GRANTED) {
                        askPerms.launch(arrayOf(Manifest.permission.CAMERA))
                        out = "tiada-kebenaran"; return@runOnUiThread
                    }
                    arMeasure.launch(
                        Intent(this@MainActivity, ArMeasureActivity::class.java)
                            .putExtra("kind", kind))
                } catch (e: Throwable) {
                    uvc.say("AR could not be opened: ${e.message}")
                    out = "failed: ${e.message}"
                }
            }
            return out
        }

        /**
         * Hamparkan pelan lantai pada tapak sebenar.
         *
         * Pelan datang sebagai base64 dan bukan sebagai URL: ia mungkin
         * sebuah blob yang hanya wujud dalam halaman itu, dan Activity AR
         * tidak boleh mengambilnya dari sana.
         */
        @JavascriptInterface
        fun arPlan(b64: String, spec: String): String {
            return try {
                val dir = File(cacheDir, "plan").apply { mkdirs() }
                dir.listFiles()?.forEach { runCatching { it.delete() } }
                val f = File(dir, "plan.jpg")
                FileOutputStream(f).use { it.write(Base64.decode(b64, Base64.DEFAULT)) }
                if (f.length() <= 0L) return "failed: empty plan"
                var out = "ok"
                runOnUiThread {
                    val av = runCatching {
                        ArCoreApk.getInstance().checkAvailability(this@MainActivity)
                    }.getOrNull()
                    if (av != ArCoreApk.Availability.SUPPORTED_INSTALLED) {
                        out = if (av == ArCoreApk.Availability.SUPPORTED_NOT_INSTALLED ||
                                  av == ArCoreApk.Availability.SUPPORTED_APK_TOO_OLD) {
                            runCatching { ArCoreApk.getInstance().requestInstall(this@MainActivity, true) }
                            "pasang"
                        } else "tiada"
                        return@runOnUiThread
                    }
                    if (ContextCompat.checkSelfPermission(
                            this@MainActivity, Manifest.permission.CAMERA)
                        != PackageManager.PERMISSION_GRANTED) {
                        askPerms.launch(arrayOf(Manifest.permission.CAMERA))
                        out = "tiada-kebenaran"
                        return@runOnUiThread
                    }
                    runCatching {
                        startActivity(Intent(this@MainActivity, ArPlanActivity::class.java)
                            .putExtra("plan", f.absolutePath)
                            .putExtra("spec", spec))
                    }.onFailure { out = "failed: ${it.message}" }
                }
                out
            } catch (e: Throwable) {
                uvc.say("Plan overlay failed: ${e.message}")
                "failed: ${e.message}"
            }
        }

        /**
         * AR Inspection: tanda defect dalam ruang, dan buka semula di
         * tempat yang sama.
         *
         * Bungkusan zon sudah berada dalam cakera melalui PUT /insp sebelum
         * ini, dan hasilnya keluar melalui fail juga. Yang melintasi
         * jambatan di sini hanyalah "mula".
         */
        @JavascriptInterface
        fun arInspect(): String {
            val f = File(inspDir, "in.json")
            if (!f.exists() || f.length() <= 0L) return "tiada-fail"
            var out = "ok"
            runOnUiThread {
                val bad = arNotReady()
                if (bad != null) { out = bad; return@runOnUiThread }
                runCatching {
                    arInspectResult.launch(
                        Intent(this@MainActivity, ArInspectActivity::class.java)
                            .putExtra("bundle", f.absolutePath))
                }.onFailure { out = "failed: ${it.message}" }
            }
            return out
        }

        /**
         * Buka model 3D dalam AR.
         *
         * Fail itu sendiri tidak melalui sini — Pocket PUT ia ke
         * http://localhost/model dahulu, kerana GLB berpuluh megabait dan
         * base64 merentasi jambatan JavaScript akan menggandakan saiznya dan
         * menggandakan salinannya. Yang melintasi sini hanyalah spec: faktor
         * unit, titik tanda, dan kumpulan yang disembunyikan.
         */
        @JavascriptInterface
        fun arModel(spec: String): String {
            val f = File(modelDir, "model.glb")
            if (!f.exists() || f.length() <= 0L) return "tiada-fail"
            var out = "ok"
            runOnUiThread {
                try {
                    val av = ArCoreApk.getInstance().checkAvailability(this@MainActivity)
                    if (av == ArCoreApk.Availability.SUPPORTED_NOT_INSTALLED ||
                        av == ArCoreApk.Availability.SUPPORTED_APK_TOO_OLD) {
                        ArCoreApk.getInstance().requestInstall(this@MainActivity, true)
                        out = "pasang"; return@runOnUiThread
                    }
                    if (av != ArCoreApk.Availability.SUPPORTED_INSTALLED) {
                        out = "tiada"; return@runOnUiThread
                    }
                    if (ContextCompat.checkSelfPermission(
                            this@MainActivity, Manifest.permission.CAMERA)
                        != PackageManager.PERMISSION_GRANTED) {
                        askPerms.launch(arrayOf(Manifest.permission.CAMERA))
                        out = "tiada-kebenaran"; return@runOnUiThread
                    }
                    arModelResult.launch(
                        Intent(this@MainActivity, ArModelActivity::class.java)
                            .putExtra("model", f.absolutePath)
                            .putExtra("spec", spec))
                } catch (e: Throwable) {
                    out = "failed: ${e.message}"
                }
            }
            return out
        }

        /**
         * Lepaskan kunci potret, atau kunci semula.
         *
         * Activity ini dikunci potret dalam manifest kerana setiap alat lain
         * ialah satu lajur sempit yang direka untuk dipegang tegak. Spirit
         * level ialah pengecualian: ia dirapatkan pada permukaan dan dibaca
         * pada apa jua orientasi telefon itu berada, jadi dalam potret yang
         * terkunci nombornya mengiring kepada pembacanya.
         *
         * Dilepaskan semasa alat itu terbuka sahaja, dan dipulangkan bila ia
         * ditutup — supaya tiada skrin lain tiba-tiba mendapat susun atur
         * landskap yang ia tidak pernah direka untuknya.
         */
        @JavascriptInterface
        fun allowRotate(on: Boolean): String {
            runOnUiThread {
                runCatching {
                    requestedOrientation = if (on)
                        android.content.pm.ActivityInfo.SCREEN_ORIENTATION_FULL_SENSOR
                    else
                        android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                }
            }
            return "ok"
        }

        /** Benar bila telefon ini boleh mendengar langsung. */
        @JavascriptInterface
        fun canListen(): Boolean =
            try { SpeechRecognizer.isRecognitionAvailable(this@MainActivity) }
            catch (e: Throwable) { false }

        @JavascriptInterface
        fun listenStart(bcp: String): String {
            if (ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
                runOnUiThread { askPerms.launch(arrayOf(Manifest.permission.RECORD_AUDIO)) }
                return "tiada-kebenaran"
            }
            var out = "ok"
            runOnUiThread {
                recBuild()
                val r = rec
                if (r == null) { out = "tiada"; recEvent("error", "service-not-allowed"); recEvent("end"); return@runOnUiThread }
                runCatching {
                    if (recOn) r.cancel()
                    val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                        putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                            RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                        putExtra(RecognizerIntent.EXTRA_LANGUAGE, bcp)
                        putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                        putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
                    }
                    recOn = true
                    r.startListening(i)
                }.onFailure {
                    recOn = false
                    out = "failed: ${it.message}"
                    recEvent("error", "aborted"); recEvent("end")
                }
            }
            return out
        }

        /** Berhenti dan simpan apa yang didengar; batal buang semuanya. */
        @JavascriptInterface
        fun listenStop(): String {
            runOnUiThread { runCatching { rec?.stopListening() } }
            return "ok"
        }

        @JavascriptInterface
        fun listenAbort(): String {
            runOnUiThread { runCatching { rec?.cancel() }; recOn = false }
            recEvent("end")
            return "ok"
        }

        @JavascriptInterface
        fun openUrl(url: String): String =
            try {
                runOnUiThread { leaveApp(url) }
                "ok"
            } catch (e: Throwable) { "failed: ${e.message}" }

        /**
         * API Web Share tidak wujud dalam WebView, jadi navigator.share
         * adalah undefined dan setiap butang kongsi jatuh ke salin-teks atau
         * tidak melakukan apa-apa. Ini ialah ACTION_SEND Android.
         *
         * Fail dihantar sebagai base64 dan ditulis ke cache, kemudian
         * dikongsi melalui FileProvider: Uri fail mentah dilarang sejak
         * Android 7.
         */
        @JavascriptInterface
        fun share(text: String, b64: String, name: String, mime: String): String {
            return try {
                val i = Intent(Intent.ACTION_SEND)
                if (b64.isEmpty()) {
                    i.type = "text/plain"
                    i.putExtra(Intent.EXTRA_TEXT, text)
                } else {
                    val dir = File(cacheDir, "share").apply { mkdirs() }
                    dir.listFiles()?.forEach { runCatching { it.delete() } }
                    val f = File(dir, if (name.isEmpty()) "pocket.bin" else name)
                    FileOutputStream(f).use { it.write(Base64.decode(b64, Base64.DEFAULT)) }
                    val u = FileProvider.getUriForFile(
                        this@MainActivity, "$packageName.files", f)
                    i.type = if (mime.isEmpty()) "application/octet-stream" else mime
                    i.putExtra(Intent.EXTRA_STREAM, u)
                    if (text.isNotEmpty()) i.putExtra(Intent.EXTRA_TEXT, text)
                    i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                }
                runOnUiThread {
                    runCatching { startActivity(Intent.createChooser(i, "Share")) }
                }
                "ok"
            } catch (e: Throwable) {
                uvc.say("Share failed: ${e.message}")
                "failed: ${e.message}"
            }
        }

        /**
         * Screen Wake Lock API tidak wujud dalam WebView, jadi skrin padam
         * di tengah pemeriksaan. Ini bendera Android yang sepadan.
         */
        @JavascriptInterface
        fun keepAwake(on: Boolean): String {
            runOnUiThread {
                runCatching {
                    if (on) window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                    else window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                }
            }
            return "ok"
        }

        /**
         * Notification API tidak wujud dalam WebView Android.
         *
         * Penggera check-in SOS berbunyi dan menggetar, tetapi kedua-duanya
         * hilang sebaik surveyor bertukar ke kamera atau peta. Satu
         * pemberitahuan kekal di bar status sehingga ia dijawab, dan
         * mengetiknya membawa Pocket ke hadapan.
         */
        @JavascriptInterface
        fun notify(title: String, body: String): String {
            return try {
                runOnUiThread { postAlarmNote(title, body) }
                "ok"
            } catch (e: Throwable) { "failed: ${e.message}" }
        }

        /** Buang pemberitahuan itu sebaik sahaja ia dijawab. */
        @JavascriptInterface
        fun notifyClear(): String {
            runCatching { NotificationManagerCompat.from(this@MainActivity).cancel(SOS_NOTE_ID) }
            return "ok"
        }

        /** Getaran melalui Android, bukan melalui WebView. */
        @JavascriptInterface
        fun buzz(ms: Int): String {
            return try {
                runOnUiThread { buzzFor(ms.toLong().coerceIn(50L, 4000L)) }
                "ok"
            } catch (e: Throwable) { "failed: ${e.message}" }
        }

        @JavascriptInterface
        fun sayStop(): String {
            runCatching { tts?.stop() }
            return "ok"
        }

        /** Jambatan itu wujud tetapi enjin itu mungkin tidak. */
        @JavascriptInterface
        fun canSay(): Boolean = ttsOk

        @JavascriptInterface
        fun savePdf(b64: String, name: String): String {
            return try {
                val bytes = Base64.decode(b64, Base64.DEFAULT)
                val safe = if (name.endsWith(".pdf", true)) name else "$name.pdf"
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val cv = ContentValues().apply {
                        put(MediaStore.Downloads.DISPLAY_NAME, safe)
                        put(MediaStore.Downloads.MIME_TYPE, "application/pdf")
                        put(MediaStore.Downloads.IS_PENDING, 1)
                    }
                    val uri = contentResolver.insert(
                        MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv
                    ) ?: return "Could not create the file"
                    contentResolver.openOutputStream(uri)?.use { it.write(bytes) }
                    cv.clear()
                    cv.put(MediaStore.Downloads.IS_PENDING, 0)
                    contentResolver.update(uri, cv, null, null)
                } else {
                    @Suppress("DEPRECATION")
                    val dir = Environment.getExternalStoragePublicDirectory(
                        Environment.DIRECTORY_DOWNLOADS)
                    dir.mkdirs()
                    FileOutputStream(File(dir, safe)).use { it.write(bytes) }
                }
                runOnUiThread { toast("Saved to Downloads: $safe") }
                "Saved to Downloads"
            } catch (e: Throwable) {
                val m = "Could not save: " + (e.message ?: e.javaClass.simpleName)
                runOnUiThread { toast(m) }
                m
            }
        }

        /**
         * Gambar endoskop ke galeri telefon. Sama seperti PDF: WebView tiada
         * muat turun, jadi bait datang ke sini dan kita menulisnya melalui
         * MediaStore supaya app galeri benar-benar menemuinya.
         */
        @JavascriptInterface
        fun saveImage(b64: String, name: String): String {
            return try {
                val bytes = Base64.decode(b64, Base64.DEFAULT)
                // PNG dibiarkan sebagai PNG. Pelan lantai ialah garisan hitam
                // atas putih, dan JPEG meninggalkan bayang pada setiap dinding.
                val png = name.endsWith(".png", true)
                val mime = if (png) "image/png" else "image/jpeg"
                val safe = when {
                    png || name.endsWith(".jpg", true) -> name
                    else -> "$name.jpg"
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val cv = ContentValues().apply {
                        put(MediaStore.Images.Media.DISPLAY_NAME, safe)
                        put(MediaStore.Images.Media.MIME_TYPE, mime)
                        put(MediaStore.Images.Media.RELATIVE_PATH,
                            Environment.DIRECTORY_PICTURES + "/GoXpert Pocket")
                        put(MediaStore.Images.Media.IS_PENDING, 1)
                    }
                    val uri = contentResolver.insert(
                        MediaStore.Images.Media.EXTERNAL_CONTENT_URI, cv
                    ) ?: return "Could not create the file"
                    contentResolver.openOutputStream(uri)?.use { it.write(bytes) }
                    cv.clear()
                    cv.put(MediaStore.Images.Media.IS_PENDING, 0)
                    contentResolver.update(uri, cv, null, null)
                } else {
                    @Suppress("DEPRECATION")
                    val dir = File(
                        Environment.getExternalStoragePublicDirectory(
                            Environment.DIRECTORY_PICTURES), "GoXpert Pocket")
                    dir.mkdirs()
                    val f = File(dir, safe)
                    FileOutputStream(f).use { it.write(bytes) }
                    // Tanpa imbasan, app galeri tidak akan melihat fail lama ini.
                    @Suppress("DEPRECATION")
                    sendBroadcast(android.content.Intent(
                        android.content.Intent.ACTION_MEDIA_SCANNER_SCAN_FILE,
                        Uri.fromFile(f)))
                }
                "Saved to gallery"
            } catch (e: Throwable) {
                val m = "Could not save the photo: " + (e.message ?: e.javaClass.simpleName)
                runOnUiThread { toast(m) }
                m
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        server?.stop()
        uvc.stop()
        runCatching { tts?.stop(); tts?.shutdown() }
        tts = null
        runCatching { rec?.destroy() }
        rec = null
    }

    companion object {
        /**
         * Mesti "localhost" dan bukan 127.0.0.1. WebView Android hanya mengira
         * https, file, dan nama hos localhost yang tepat sebagai konteks
         * selamat; pada 127.0.0.1 kamera, Bluetooth dan GPS dalam Pocket akan
         * mati senyap. Fail hosts Android memetakan localhost ke 127.0.0.1,
         * iaitu alamat yang pelayan terikat padanya.
         */
        private const val SOS_CHANNEL = "pocket_sos"
        private const val SOS_NOTE_ID = 4201

        private const val HOME = "http://localhost:${LocalServer.PORT}"
    }
}
