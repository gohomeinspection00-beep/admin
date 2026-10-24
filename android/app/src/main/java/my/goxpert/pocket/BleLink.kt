package my.goxpert.pocket

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothGattDescriptor
import android.bluetooth.BluetoothManager
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import java.util.UUID

/**
 * Web Bluetooth tidak wujud dalam WebView Android, dan tiada polyfill am
 * yang boleh menggantikannya — ia satu tumpukan protokol penuh. Tetapi
 * SATU kerja itu kecil: cari meter, sambung, dengar satu ciri, hantar
 * baitnya ke halaman. Itulah seluruh kandungan fail ini.
 *
 * Protokol meter TIDAK dinyahkod di sini. Halaman yang memiliki
 * laserParse(); Kotlin cuma membawa bait. Satu APK lama yang bertemu
 * HTML baharu dengan meter baharu masih berfungsi, dan satu perubahan
 * penyahkod tidak memerlukan pemasangan semula.
 */
class BleLink(
    private val ctx: Context,
    /** Setiap peristiwa pergi ke halaman melalui satu fungsi ini. */
    private val emit: (String, String) -> Unit
) {
    companion object {
        /** Descriptor standard yang menghidupkan pemberitahuan. Tanpa
         *  menulisnya, startNotifications tidak bermakna apa-apa. */
        private val CCCD = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")

        /** Satu imbasan yang tidak pernah berhenti menghabiskan bateri
         *  telefon di tapak, dan meter ini mengiklan serta-merta. */
        private const val SCAN_MS = 20_000L
    }

    private val main = Handler(Looper.getMainLooper())
    private var gatt: BluetoothGatt? = null
    private var scanning = false
    private val seen = HashSet<String>()

    /** Ciri yang boleh ditulis, untuk meter yang menunggu satu arahan. */
    private val writables = ArrayList<BluetoothGattCharacteristic>()

    private val adapter: BluetoothAdapter?
        get() = (ctx.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager)?.adapter

    // Context.checkSelfPermission terus, bukan ContextCompat: minSdk 24
    // sudah melepasi API 23, dan satu kebergantungan kurang bermakna fail
    // ini boleh diperiksa jenisnya tanpa androidx pada mesin ini.
    private fun granted(p: String) =
        ctx.checkSelfPermission(p) == PackageManager.PERMISSION_GRANTED

    /**
     * Kosong bermakna boleh teruskan. Selainnya ialah sebab, dalam satu
     * perkataan, supaya halaman boleh menulis ayatnya sendiri — telefon
     * yang tiada radio dan Bluetooth yang dimatikan ialah dua masalah
     * berbeza dengan dua pembetulan berbeza.
     */
    fun why(): String {
        val a = adapter ?: return "no-adapter"
        if (!a.isEnabled) return "off"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (!granted(Manifest.permission.BLUETOOTH_SCAN)) return "no-scan-permission"
            if (!granted(Manifest.permission.BLUETOOTH_CONNECT)) return "no-connect-permission"
        } else if (!granted(Manifest.permission.ACCESS_FINE_LOCATION)) {
            // Sebelum Android 12, mengimbas BLE dikira mengesan lokasi.
            return "no-location-permission"
        }
        return ""
    }

    // ---------- mengimbas ----------

    private val scanCb = object : ScanCallback() {
        override fun onScanResult(type: Int, r: ScanResult?) {
            val d = r?.device ?: return
            val addr = d.address ?: return
            if (!seen.add(addr)) return
            emit("found", j(
                "addr" to addr,
                "name" to safeName(d),
                "rssi" to (r.rssi.toString())
            ))
        }
        override fun onBatchScanResults(rs: MutableList<ScanResult>?) {
            rs?.forEach { onScanResult(0, it) }
        }
        override fun onScanFailed(code: Int) {
            scanning = false
            emit("error", j("msg" to "Scan failed (code $code)"))
            emit("scan-end", j())
        }
    }

    @SuppressLint("MissingPermission")
    private fun safeName(d: BluetoothDevice): String =
        runCatching { d.name }.getOrNull().orEmpty()

    @SuppressLint("MissingPermission")
    fun scan() {
        val bad = why()
        if (bad.isNotEmpty()) { emit("error", j("msg" to bad)); return }
        if (scanning) return
        val s = adapter?.bluetoothLeScanner
        if (s == null) { emit("error", j("msg" to "off")); return }
        seen.clear()
        scanning = true
        emit("scan-start", j())
        val cfg = ScanSettings.Builder()
            .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
            .build()
        runCatching { s.startScan(null, cfg, scanCb) }
            .onFailure {
                scanning = false
                emit("error", j("msg" to (it.message ?: "scan refused")))
                emit("scan-end", j())
                return
            }
        main.postDelayed({ stopScan() }, SCAN_MS)
    }

    @SuppressLint("MissingPermission")
    fun stopScan() {
        if (!scanning) return
        scanning = false
        runCatching { adapter?.bluetoothLeScanner?.stopScan(scanCb) }
        emit("scan-end", j())
    }

    // ---------- menyambung ----------

    @SuppressLint("MissingPermission")
    fun connect(addr: String) {
        val bad = why()
        if (bad.isNotEmpty()) { emit("error", j("msg" to bad)); return }
        stopScan()
        disconnect()
        val d = runCatching { adapter?.getRemoteDevice(addr) }.getOrNull()
        if (d == null) { emit("error", j("msg" to "No device at $addr")); return }
        emit("state", j("state" to "connecting", "name" to safeName(d), "addr" to addr))
        gatt = runCatching {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
                d.connectGatt(ctx, false, cb, BluetoothDevice.TRANSPORT_LE)
            else d.connectGatt(ctx, false, cb)
        }.getOrNull()
        if (gatt == null) emit("error", j("msg" to "Could not open a connection"))
    }

    @SuppressLint("MissingPermission")
    fun disconnect() {
        val g = gatt ?: return
        gatt = null
        writables.clear()
        runCatching { g.disconnect() }
        runCatching { g.close() }
    }

    /** Hex, kerana itu yang makmal tunjukkan dan itu yang pengguna taip. */
    @SuppressLint("MissingPermission")
    fun write(hex: String): Boolean {
        val g = gatt ?: return false
        val bytes = hexBytes(hex) ?: run {
            emit("error", j("msg" to "Hex bytes only, like \"aa 00 01\"."))
            return false
        }
        var any = false
        for (c in writables) {
            val type = if (c.properties and BluetoothGattCharacteristic.PROPERTY_WRITE != 0)
                BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT
            else BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE
            val okOne = runCatching {
                if (Build.VERSION.SDK_INT >= 33) {
                    g.writeCharacteristic(c, bytes, type) == BluetoothGatt.GATT_SUCCESS
                } else {
                    @Suppress("DEPRECATION")
                    run { c.writeType = type; c.value = bytes; g.writeCharacteristic(c) }
                }
            }.getOrDefault(false)
            if (okOne) { any = true; emit("sent", j("uuid" to c.uuid.toString(), "hex" to hex)) }
        }
        if (!any) emit("error", j("msg" to "Nothing here accepts a write."))
        return any
    }

    // ---------- GATT ----------

    private val cb = object : BluetoothGattCallback() {
        @SuppressLint("MissingPermission")
        override fun onConnectionStateChange(g: BluetoothGatt, status: Int, state: Int) {
            if (state == android.bluetooth.BluetoothProfile.STATE_CONNECTED) {
                emit("state", j("state" to "connected"))
                // Satu MTU yang lebih besar bermakna bacaan panjang tidak
                // berpecah. Kegagalan di sini tidak penting: halaman
                // memasang semula barisnya sendiri.
                runCatching { g.requestMtu(185) }
                main.postDelayed({ runCatching { g.discoverServices() } }, 250)
            } else if (state == android.bluetooth.BluetoothProfile.STATE_DISCONNECTED) {
                writables.clear()
                emit("state", j("state" to "disconnected", "status" to status.toString()))
                runCatching { g.close() }
                if (gatt === g) gatt = null
            }
        }

        override fun onMtuChanged(g: BluetoothGatt, mtu: Int, status: Int) {
            runCatching { g.discoverServices() }
        }

        @SuppressLint("MissingPermission")
        override fun onServicesDiscovered(g: BluetoothGatt, status: Int) {
            if (status != BluetoothGatt.GATT_SUCCESS) {
                emit("error", j("msg" to "Services could not be read (status $status)"))
                return
            }
            writables.clear()
            // Senarai menunggu: satu descriptor ditulis pada satu masa.
            // Menulis dua serentak diam-diam menjatuhkan yang kedua, dan
            // meter kemudian kelihatan senyap tanpa sebab.
            val queue = ArrayList<BluetoothGattCharacteristic>()
            for (sv in g.services) {
                val chars = sv.characteristics ?: continue
                emit("service", j("uuid" to sv.uuid.toString(), "chars" to chars.size.toString()))
                for (c in chars) {
                    val p = c.properties
                    if (p and (BluetoothGattCharacteristic.PROPERTY_WRITE or
                               BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE) != 0)
                        writables.add(c)
                    if (p and (BluetoothGattCharacteristic.PROPERTY_NOTIFY or
                               BluetoothGattCharacteristic.PROPERTY_INDICATE) != 0)
                        queue.add(c)
                }
            }
            pending.clear()
            pending.addAll(queue)
            subs = 0
            nextSub(g)
        }

        override fun onDescriptorWrite(g: BluetoothGatt, d: BluetoothGattDescriptor, status: Int) {
            if (status == BluetoothGatt.GATT_SUCCESS) subs++
            nextSub(g)
        }

        override fun onCharacteristicChanged(
            g: BluetoothGatt, c: BluetoothGattCharacteristic, value: ByteArray
        ) = push(c.uuid, value)

        @Deprecated("Pra-Android 13 memanggil bentuk ini.")
        @Suppress("DEPRECATION")
        override fun onCharacteristicChanged(g: BluetoothGatt, c: BluetoothGattCharacteristic) {
            push(c.uuid, c.value ?: ByteArray(0))
        }
    }

    private val pending = ArrayList<BluetoothGattCharacteristic>()
    private var subs = 0

    @SuppressLint("MissingPermission")
    private fun nextSub(g: BluetoothGatt) {
        if (pending.isEmpty()) {
            emit("ready", j("subs" to subs.toString(), "writables" to writables.size.toString()))
            return
        }
        val c = pending.removeAt(0)
        val on = runCatching { g.setCharacteristicNotification(c, true) }.getOrDefault(false)
        val d = c.getDescriptor(CCCD)
        if (!on || d == null) { nextSub(g); return }
        val want = if (c.properties and BluetoothGattCharacteristic.PROPERTY_NOTIFY != 0)
            BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
        else BluetoothGattDescriptor.ENABLE_INDICATION_VALUE
        val wrote = runCatching {
            if (Build.VERSION.SDK_INT >= 33) {
                g.writeDescriptor(d, want) == BluetoothGatt.GATT_SUCCESS
            } else {
                @Suppress("DEPRECATION")
                run { d.value = want; g.writeDescriptor(d) }
            }
        }.getOrDefault(false)
        // Tiada panggilan balik akan datang untuk tulisan yang tidak
        // pernah bermula, jadi barisan itu mesti digerakkan di sini.
        if (!wrote) nextSub(g)
    }

    private fun push(uuid: UUID, v: ByteArray) {
        emit("data", j("uuid" to uuid.toString(), "hex" to hex(v)))
    }

    // ---------- bantuan ----------

    private fun hex(b: ByteArray): String {
        val sb = StringBuilder(b.size * 3)
        for (x in b) {
            if (sb.isNotEmpty()) sb.append(' ')
            sb.append("%02x".format(x.toInt() and 0xff))
        }
        return sb.toString()
    }

    private fun hexBytes(s: String): ByteArray? {
        val parts = s.trim().split(Regex("[\\s,]+")).filter { it.isNotEmpty() }
        if (parts.isEmpty()) return null
        val out = ByteArray(parts.size)
        for (i in parts.indices) {
            val v = parts[i].toIntOrNull(16) ?: return null
            if (v < 0 || v > 0xff) return null
            out[i] = v.toByte()
        }
        return out
    }

    /** JSON yang cukup untuk muatan ini: setiap nilai ialah rentetan,
     *  dan halaman menukar nombor sendiri. */
    private fun j(vararg kv: Pair<String, String>): String {
        val sb = StringBuilder("{")
        for ((i, p) in kv.withIndex()) {
            if (i > 0) sb.append(',')
            sb.append(q(p.first)).append(':').append(q(p.second))
        }
        return sb.append('}').toString()
    }

    private fun q(v: String): String {
        val sb = StringBuilder("\"")
        for (c in v) when {
            c == '\\' -> sb.append("\\\\")
            c == '"' -> sb.append("\\\"")
            c == '\n' -> sb.append("\\n")
            c == '\r' -> sb.append("\\r")
            c < ' ' -> sb.append("\\u%04x".format(c.code))
            else -> sb.append(c)
        }
        return sb.append('"').toString()
    }
}
