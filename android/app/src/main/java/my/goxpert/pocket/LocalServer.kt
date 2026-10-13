package my.goxpert.pocket

import fi.iki.elonen.NanoHTTPD
import java.io.File
import java.io.PipedInputStream
import java.io.PipedOutputStream

/**
 * Pocket dihidangkan dari sini, dan bingkai endoskop juga, supaya kedua-duanya
 * berada pada asal yang sama. Tiada CORS, tiada kandungan campuran.
 *
 * Hos mesti "localhost" dan bukan 127.0.0.1: WebView Android hanya mengira
 * https, file, dan nama hos localhost yang tepat sebagai konteks selamat.
 * Dapat ini salah dan kamera, Bluetooth serta GPS dalam Pocket mati senyap.
 *
 * Port tetap, bukan dipilih bebas. Port yang berubah bermakna asal yang
 * berubah, dan IndexedDB Pocket kosong setiap kali app dibuka.
 */
class LocalServer(
    private val uvc: UvcSource,
    private val pocketFile: File,
    private val pickDir: File,
    private val modelDir: File,
    private val assets: android.content.res.AssetManager
) : NanoHTTPD(HOST, PORT) {

    override fun serve(session: IHTTPSession): Response {
        val uri = session.uri ?: "/"
        return try {
            when {
                uri == "/uvc/status"   -> status()
                uri == "/uvc/snapshot" -> snapshot()
                uri == "/uvc/stream"   -> stream()
                uri == "/uvc/debug"    -> debug()
                uri == "/model" -> model(session)
                uri.startsWith("/lib/") -> lib(uri.removePrefix("/lib/"))
                uri.startsWith("/pick/") -> picked(uri.removePrefix("/pick/"))
                else                   -> pocket()
            }
        } catch (e: Throwable) {
            newFixedLengthResponse(
                Response.Status.INTERNAL_ERROR, "text/plain",
                "${e.javaClass.simpleName}: ${e.message}"
            )
        }
    }

    private fun noCache(r: Response): Response {
        // Fail Pocket boleh ditukar tanpa memasang semula APK, jadi ia tidak
        // boleh disimpan dalam cache.
        r.addHeader("Cache-Control", "no-store, must-revalidate")
        r.addHeader("Pragma", "no-cache")
        return r
    }

    private fun pocket(): Response {
        if (!pocketFile.exists()) {
            return noCache(newFixedLengthResponse(
                Response.Status.OK, "text/html; charset=utf-8", SETUP_PAGE))
        }
        return noCache(newChunkedResponse(
            Response.Status.OK, "text/html; charset=utf-8", pocketFile.inputStream()))
    }

    private fun status(): Response {
        val j = buildString {
            append("{")
            append("\"ok\":true,")
            append("\"opened\":").append(uvc.opened).append(",")
            append("\"frames\":").append(uvc.frameCount).append(",")
            append("\"width\":").append(uvc.width).append(",")
            append("\"height\":").append(uvc.height).append(",")
            append("\"hasFrame\":").append(uvc.latestJpeg != null).append(",")
            append("\"device\":\"").append(uvc.deviceName.replace("\"", "'")).append("\"")
            append("}")
        }
        return noCache(newFixedLengthResponse(Response.Status.OK, "application/json", j))
    }

    private fun snapshot(): Response {
        val jpg = uvc.latestJpeg
            ?: return noCache(newFixedLengthResponse(
                Response.Status.SERVICE_UNAVAILABLE, "text/plain", "tiada bingkai"))
        return noCache(newFixedLengthResponse(
            Response.Status.OK, "image/jpeg", jpg.inputStream(), jpg.size.toLong()))
    }

    /**
     * Gambar yang baru dipilih dari telefon. App menyalinnya ke cakera dan
     * menyebut nama fail ini kepada halaman; halaman cuma fetch ia seperti
     * mana-mana gambar lain. Tiada rentetan base64 besar melintasi jambatan
     * JavaScript, dan tiada hasil Intent untuk hilang.
     *
     * Nama dihadkan kepada fail yang app sendiri tulis, jadi URL yang disusun
     * sendiri tidak boleh membaca apa-apa lain.
     */
    private fun picked(name: String): Response {
        val safe = name.substringAfterLast('/')
        if (!Regex("^p\\d+\\.jpg$").matches(safe)) {
            return noCache(newFixedLengthResponse(
                Response.Status.FORBIDDEN, "text/plain", "nama tidak sah"))
        }
        val f = File(pickDir, safe)
        if (!f.exists()) {
            return noCache(newFixedLengthResponse(
                Response.Status.NOT_FOUND, "text/plain", "tiada"))
        }
        return noCache(newFixedLengthResponse(
            Response.Status.OK, "image/jpeg", f.inputStream(), f.length()))
    }

    /**
     * Model 3D masuk ke dalam app melalui sini, dan bukan melalui jambatan
     * JavaScript.
     *
     * Fail GLB ialah berpuluh megabait. Sebagai base64 ia menjadi sepertiga
     * lebih besar lagi, dan satu rentetan sebesar itu melintasi jambatan
     * bermakna satu salinan dalam JavaScript, satu lagi dalam Java, dan
     * kemungkinan besar kehabisan memori. Di sini ia satu PUT ke asal yang
     * SAMA yang Pocket sendiri dihidangkan dari — tiada CORS, tiada
     * pengekodan, dan ia mengalir terus ke cakera.
     *
     * Satu fail sahaja disimpan. Model sebelumnya dibuang pada setiap PUT,
     * kerana cache yang mengumpul fail 30 MB akan memenuhi telefon.
     */
    private fun model(session: IHTTPSession): Response {
        if (session.method != Method.PUT && session.method != Method.POST) {
            return noCache(newFixedLengthResponse(
                Response.Status.METHOD_NOT_ALLOWED, "text/plain", "PUT sahaja"))
        }
        val len = (session.headers["content-length"] ?: "0").toLongOrNull() ?: 0L
        if (len <= 0L) {
            return noCache(newFixedLengthResponse(
                Response.Status.BAD_REQUEST, "text/plain", "tiada panjang"))
        }
        if (len > 120L * 1024 * 1024) {
            return noCache(newFixedLengthResponse(
                Response.Status.BAD_REQUEST, "text/plain", "terlalu besar"))
        }
        return try {
            modelDir.mkdirs()
            modelDir.listFiles()?.forEach { runCatching { it.delete() } }
            val f = File(modelDir, "model.glb")
            var left = len
            val buf = ByteArray(64 * 1024)
            java.io.FileOutputStream(f).use { out ->
                val ins = session.inputStream
                while (left > 0) {
                    val want = minOf(left, buf.size.toLong()).toInt()
                    val got = ins.read(buf, 0, want)
                    if (got <= 0) break
                    out.write(buf, 0, got)
                    left -= got
                }
            }
            // Separuh fail ialah fail rosak, dan lebih baik ia ditolak di
            // sini daripada menjadi "model tidak dapat dibaca" nanti.
            if (left > 0L || f.length() != len) {
                runCatching { f.delete() }
                return noCache(newFixedLengthResponse(
                    Response.Status.INTERNAL_ERROR, "text/plain", "terputus"))
            }
            noCache(newFixedLengthResponse(
                Response.Status.OK, "application/json", "{\"ok\":true,\"bytes\":${f.length()}}"))
        } catch (e: Throwable) {
            noCache(newFixedLengthResponse(
                Response.Status.INTERNAL_ERROR, "text/plain",
                "${e.javaClass.simpleName}: ${e.message}"))
        }
    }

    /**
     * three.js dan fabric.js, dihidangkan dari dalam APK.
     *
     * Pelihat 3D, dua skrin AR lama dan Plan Editor memuatkannya dari cdnjs.
     * Itu baik di pejabat dan mati di tapak: telefon pada "SOS only" tidak
     * dapat memuatkan GLTFLoader, jadi model tidak boleh dibuka, jadi titik
     * tidak boleh ditanda, jadi AR tidak boleh dimasuki langsung — walaupun
     * skrin AR itu sendiri tidak perlukan rangkaian sama sekali. Plan Editor
     * pula tidak membuka apa-apa selain satu mesej ralat.
     *
     * 1 MB dalam APK ialah harga yang murah untuk membuang kebergantungan
     * itu sepenuhnya. Halaman cuba laluan ini dahulu dan jatuh ke CDN hanya
     * bila ia tiada — iaitu dalam Chrome, bukan di sini.
     */
    private fun lib(name: String): Response {
        // Hanya fail yang app sendiri bungkuskan, supaya URL yang disusun
        // sendiri tidak boleh membaca apa-apa lain dalam aset.
        if (!Regex("^(three\\.min\\.js|fabric\\.min\\.js|loaders/(GLTF|DRACO)Loader\\.js)$")
                .matches(name)) {
            return noCache(newFixedLengthResponse(
                Response.Status.FORBIDDEN, "text/plain", "nama tidak sah"))
        }
        return try {
            val ins = assets.open("lib/$name")
            newChunkedResponse(Response.Status.OK, "application/javascript", ins)
                .also { it.addHeader("Cache-Control", "max-age=86400") }
        } catch (e: Throwable) {
            noCache(newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "tiada"))
        }
    }

    private fun debug(): Response {
        val t = buildString {
            append("PERANTI: ").append(uvc.deviceName.ifEmpty { "(tiada)" }).append('\n')
            append("DIBUKA : ").append(uvc.opened).append('\n')
            append("BINGKAI: ").append(uvc.frameCount).append('\n')
            append("SAIZ   : ").append(uvc.width).append(" x ").append(uvc.height).append('\n')
            append("POCKET : ").append(if (pocketFile.exists()) "${pocketFile.length()} bait" else "belum dimuat").append('\n')
            append("\n--- log ---\n")
            uvc.logLines().forEach { append(it).append('\n') }
        }
        return noCache(newFixedLengthResponse(Response.Status.OK, "text/plain; charset=utf-8", t))
    }

    /**
     * MJPEG sebagai multipart/x-mixed-replace. Pelayar menyahkodnya dalam C++,
     * jadi tiada JavaScript dalam laluan panas dan Pocket cuma perlukan satu
     * tag img.
     */
    private fun stream(): Response {
        val pipeIn = PipedInputStream(64 * 1024)
        val pipeOut = PipedOutputStream(pipeIn)

        Thread({
            try {
                var sent = 0L
                while (true) {
                    val jpg = uvc.latestJpeg
                    if (jpg != null) {
                        val head = ("--$BOUNDARY\r\n" +
                            "Content-Type: image/jpeg\r\n" +
                            "Content-Length: ${jpg.size}\r\n\r\n").toByteArray()
                        pipeOut.write(head)
                        pipeOut.write(jpg)
                        pipeOut.write("\r\n".toByteArray())
                        pipeOut.flush()
                        sent++
                    }
                    // Kira-kira 15 bingkai sesaat. Endoskop ini jarang
                    // melebihi itu, dan ia memadai untuk memandu probe.
                    Thread.sleep(66)
                }
            } catch (_: Throwable) {
                // Pelayar menutup imej itu; itu cara biasa strim ini berakhir.
            } finally {
                try { pipeOut.close() } catch (_: Throwable) {}
            }
        }, "uvc-stream").apply { isDaemon = true }.start()

        val r = newChunkedResponse(
            Response.Status.OK, "multipart/x-mixed-replace; boundary=$BOUNDARY", pipeIn)
        r.addHeader("Cache-Control", "no-store")
        return r
    }

    companion object {
        /** Nama yang sama yang WebView sambung kepadanya. */
        const val HOST = "localhost"
        const val PORT = 8765
        private const val BOUNDARY = "pocketframe"

        /** Ditunjukkan sebelum fail Pocket dimuat, supaya skrin tidak kosong. */
        private val SETUP_PAGE = """
            <!doctype html><meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>GoXpert Pocket</title>
            <style>
              body{margin:0;font:16px/1.6 system-ui,sans-serif;background:#10151a;color:#e4ebf1;
                   display:grid;place-items:center;min-height:100vh;padding:24px}
              div{max-width:420px}
              h1{font-size:20px;margin:0 0 12px}
              p{color:#90a2b2;margin:0 0 10px}
              code{font-family:ui-monospace,monospace;color:#4ea3f0}
            </style>
            <div>
              <h1>Fail Pocket belum dimuat</h1>
              <p>Tekan butang menu di penjuru atas, pilih <b>Muat fail Pocket</b>,
                 dan pilih <code>pocket_index_88.html</code> dari telefon awak.</p>
              <p>Fail itu disalin ke dalam app, jadi awak boleh menukarnya bila-bila
                 tanpa memasang semula APK.</p>
            </div>
        """.trimIndent()
    }
}
