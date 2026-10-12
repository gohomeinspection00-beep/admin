package my.goxpert.pocket

import android.Manifest
import android.annotation.SuppressLint
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
import android.widget.Button
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
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
            uvc.say("Pengecaman suara: tiada perkhidmatan pada telefon ini")
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
            toast("Pocket dimuat, ${pocketFile.length() / 1024} KB")
            web.loadUrl(HOME)
        } catch (e: Throwable) {
            toast("Gagal memuat: ${e.message}")
        }
    }

    private var filePick: ValueCallback<Array<Uri>>? = null

    private val pickFiles = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { res ->
        val cb = filePick ?: return@registerForActivityResult
        filePick = null
        cb.onReceiveValue(
            WebChromeClient.FileChooserParams.parseResult(res.resultCode, res.data)
        )
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
                    uvc.say("Suara TTS: " + (tts?.voice?.name ?: "(lalai)"))
                }
            }
            if (ttsOk) runCatching {
                // Chat suara menukar keadaan pada mula dan tamat ucapan.
                // Tanpa peristiwa ini ia kekal pada "sedang bercakap"
                // selama-lamanya, yang lebih teruk daripada senyap.
                tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(id: String?) { sayEvent("start") }
                    override fun onDone(id: String?) { sayEvent("end") }
                    @Deprecated("Diperlukan oleh kelas asas")
                    override fun onError(id: String?) { sayEvent("end") }
                })
            }
            uvc.say("TTS: " + if (ttsOk) "sedia" else "tidak tersedia (kod $st)")
        }

        try {
            server = LocalServer(uvc, pocketFile, pickDir).also { it.start(0, true) }
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
                        "Guna butang Muat turun dalam Pocket untuk fail ini"
                    else "Muat turun tidak disokong di sini"
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
                    // capture="environment" bermakna ambil gambar BARU.
                    // Menghalakannya ke pemilih foto membuka galeri dan bukan
                    // kamera, jadi biarkan intent asal mengendalikan itu.
                    val wantsCamera = params?.isCaptureEnabled ?: false
                    val wantsImage = !wantsCamera && (params?.acceptTypes?.any {
                        it.startsWith("image/") || it == ".jpg" || it == ".png"
                    } ?: false)
                    return try {
                        val it0 = if (wantsImage) imagePickIntent() else params!!.createIntent()
                        uvc.say("onShowFileChooser: galeri=$wantsImage kamera=$wantsCamera")
                        pickFiles.launch(it0)
                        true
                    } catch (e: Throwable) {
                        filePick = null
                        uvc.say("onShowFileChooser gagal: ${e.message}")
                        toast("Tidak dapat membuka pemilih fail")
                        false
                    }
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
            toast("Tiada app untuk membuka pautan ini")
            true
        }
    }

    /**
     * Pemilih Foto Android bila ada (API 33+): ia tidak perlukan satu pun
     * kebenaran dan hanya menunjukkan gambar. Di bawah itu, SAF.
     */
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
        uvc.say("Pemilih gambar: kod=${res.resultCode}, $picked dipilih")

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
                val bmp = contentResolver.openInputStream(u)?.use {
                    BitmapFactory.decodeStream(it, null, opts)
                } ?: throw IllegalStateException("tidak boleh disahkod")
                val f = File(pickDir, "p$i.jpg")
                FileOutputStream(f).use { out ->
                    bmp.compress(Bitmap.CompressFormat.JPEG, 88, out)
                }
                bmp.recycle()
                if (f.length() > 0) {
                    names.add("/pick/" + f.name)
                    uvc.say("Gambar $i: ${bounds.outWidth}x${bounds.outHeight} -> ${f.length()} bait")
                } else uvc.say("Gambar $i: fail kosong")
            } catch (e: Throwable) {
                uvc.say("Gambar $i gagal: ${e.javaClass.simpleName}: ${e.message}")
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
                runOnUiThread { pickImg.launch(imagePickIntent()) }
                "ok"
            } catch (e: Throwable) {
                uvc.say("Pemilih gagal dibuka: ${e.message}")
                "gagal: ${e.message}"
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
                "gagal: ${e.message}"
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
                "gagal: ${e.message}"
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
                "gagal: ${e.message}"
            }

        /** Buka pautan di luar app. */
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
                    out = "gagal: ${it.message}"
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
            } catch (e: Throwable) { "gagal: ${e.message}" }

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
                    runCatching { startActivity(Intent.createChooser(i, "Kongsi")) }
                }
                "ok"
            } catch (e: Throwable) {
                uvc.say("Kongsi gagal: ${e.message}")
                "gagal: ${e.message}"
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
                    ) ?: return "Tidak dapat membuat fail"
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
                runOnUiThread { toast("Disimpan ke Muat Turun: $safe") }
                "Disimpan ke Muat Turun"
            } catch (e: Throwable) {
                val m = "Gagal menyimpan: " + (e.message ?: e.javaClass.simpleName)
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
                val safe = if (name.endsWith(".jpg", true)) name else "$name.jpg"
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val cv = ContentValues().apply {
                        put(MediaStore.Images.Media.DISPLAY_NAME, safe)
                        put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
                        put(MediaStore.Images.Media.RELATIVE_PATH,
                            Environment.DIRECTORY_PICTURES + "/GoXpert Pocket")
                        put(MediaStore.Images.Media.IS_PENDING, 1)
                    }
                    val uri = contentResolver.insert(
                        MediaStore.Images.Media.EXTERNAL_CONTENT_URI, cv
                    ) ?: return "Tidak dapat membuat fail"
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
                "Disimpan ke galeri"
            } catch (e: Throwable) {
                val m = "Gagal menyimpan gambar: " + (e.message ?: e.javaClass.simpleName)
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
        private const val HOME = "http://localhost:${LocalServer.PORT}"
    }
}
