# Sistem Pengurusan Syarikat — Panduan Ringkas

Satu fail sahaja: **`index.html`**. Tiada pemasangan, tiada internet, tiada Firebase.

## Cara guna

1. Muat turun `index.html`.
2. Klik dua kali fail tersebut — ia terus terbuka dalam pelayar (Chrome / Edge).
3. Untuk akses cepat, simpan sebagai bookmark atau letak di desktop.

## Modul sedia ada

| Menu | Kegunaan |
|---|---|
| **Papan Utama** | Jualan bulan ini, deposit dikutip, baki belum kutip, % capai target, job hari ini, senarai perlu tindakan, prestasi ikut sales & projek |
| **Key-in Sale** | Paparan **Kalendar** atau **Senarai**. Rekod setiap tempahan: tarikh, masa inspection, client, unit, harga, water, electric, deposit, closed by, sumber lead, status kerja, invois, catatan. Baki dikira automatik |
| **Operasi** | Siapa bergerak hari ini: jadual mengikut masa, staf yang ditugaskan, job belum ditugaskan, beban kerja 7 hari, tukar status terus dari jadual |
| **Invois** | Jana invois A4 untuk minta bayaran — tarikh akhir bayaran, bayaran diterima ditolak, status automatik (Belum Bayar / Bayar Sebahagian / Sudah Bayar / Lewat) |
| **Resit** | Jana resit A4 mengikut format syarikat — nombor resit automatik & unik, cetak/simpan PDF, salin teks atau hantar WhatsApp |
| **Staf** | Tambah / sunting / padam staf, termasuk **kumpulan** (Operasi / Management). Staf aktif muncul dalam pilihan "Closed By" dan jualan bulanan mereka dipaparkan |
| **Tetapan** | Nama syarikat, target jualan harian, hari bekerja, senarai projek, sumber lead, hari cuti, backup & restore |

## Kalendar Key-in Sale

Setiap kotak tarikh memaparkan nama client, **masa inspection (dari–hingga)**, jumlah,
serta jumlah jualan hari itu. Warna jalur mengikut status kerja.

| Tindakan | Cara |
|---|---|
| Key-in sale pada satu tarikh | **Klik kiri** pada kotak tarikh |
| Lihat / tukar status / sunting / padam satu job | **Klik pada nama client** |
| Tandakan cuti hujung minggu | **Klik kanan** → *Tandakan Cuti Hujung Minggu* |
| Tandakan cuti lain (pilih sebab) | **Klik kanan** → *Tandakan cuti (pilih sebab)…* |
| Buang tanda cuti | **Klik kanan** → *Buang tanda cuti* |
| Tulis remark harian | **Klik kanan** → *Tambah remark* |
| Urus semua cuti bulan itu | **Klik kanan** → *Urus cuti bulan …* |
| Kongsi slot kosong dengan client | Butang **Slot Kosong** (lihat di bawah) |

Pada telefon, **tekan lama** menggantikan klik kanan.

Cuti yang ditanda dari kalendar akan jadi **merah** dan target harian menjadi RM 0,
tetapi **tidak** masuk senarai Hari Cuti dalam Tetapan — melainkan kotak
*"Masukkan juga ke senarai Hari Cuti dalam Tetapan"* ditandakan.

## Kumpulan staf

Setiap staf mesti dalam satu kumpulan:

- **Operasi** — staf yang turun ke site. Hanya kumpulan ini muncul semasa
  menugaskan inspector, dan hanya mereka dikira dalam halaman Operasi.
- **Management** — pejabat, jualan, pentadbiran.

Semua staf aktif (kedua-dua kumpulan) tetap muncul dalam pilihan *Closed By*.

## Staf inspection

Semasa key-in sale, tandakan staf yang akan turun (boleh lebih daripada seorang
untuk satu site).
Dalam kalendar, staf dipapar sebagai lencana ringkas (contoh `FI`, `HA`);
tanda `?` bermakna job itu belum ditugaskan kepada sesiapa.

Menu **Operasi** memaparkan, untuk satu-satu hari:

- Bilangan job, staf bergerak, job belum ditugaskan, nilai job hari itu
- Jadual mengikut masa — boleh tukar status kerja dan tugaskan staf terus dari situ
- Pergerakan setiap staf (job mereka hari itu dan waktunya) serta siapa tiada tugasan
- Beban kerja 7 hari akan datang bagi setiap staf, dan senarai job yang belum ditugaskan
- Butang **Cetak Jadual** untuk cetak jadual harian

## Slot kosong untuk client

1. Dalam paparan Kalendar, tekan butang **Slot Kosong**.
2. **Tick** mana-mana tarikh yang ada slot kosong (tekan sekali lagi untuk buang tanda).
3. Tekan **Dapatkan Slot** — sistem mencadangkan masa kosong terbesar bagi setiap
   tarikh berdasarkan waktu kerja dan job yang sudah ditempah. Ubah masa jika perlu.
4. Teks siap sedia dijana dan boleh disunting, kemudian **Salin Teks** atau
   **Hantar WhatsApp**.

Contoh teks yang dijana:

```
Salam, ini slot inspection yang masih kosong:

1. Selasa, 8 Sep 2026 — 1.00pm hingga 6.00pm
2. Khamis, 10 Sep 2026 — 9.00am hingga 6.00pm

Sila maklumkan slot yang sesuai untuk tempahan. Terima kasih.
Go Home Inspection
```

## Bayaran & Resit

Setiap jualan ada **senarai bayaran** sendiri — deposit, bayaran kedua, bayaran
akhir dan seterusnya. Baki dikira automatik dari jumlah semua bayaran.

**Rekod bayaran:**

1. Semasa key-in sale, isi **Deposit Diterima (RM)** jika client dah bayar deposit.
2. Bayaran seterusnya: buka jualan (klik nama client dalam kalendar) →
   butang **+ Bayaran** dalam bahagian *Bayaran Diterima*.
3. Setiap bayaran menyimpan tarikh, jenis, jumlah, kaedah (Bank Transfer, Tunai,
   DuitNow, Cek) dan nombor rujukan. Sistem mencadangkan jenis seterusnya
   (Deposit → Bayaran Kedua → Bayaran Ketiga → Bayaran Akhir) dan jumlah = baki.

**Jana resit:**

Selepas menyimpan bayaran, borang resit terus terbuka. Untuk bayaran lama,
tekan **Buat Resit** pada baris bayaran itu. Resit yang sudah dijana dipapar
sebagai nombor resit dalam senarai bayaran — tekan untuk buka semula.

Resit **mesti ada jumlah diterima** — sistem tidak benarkan resit RM 0.
Halaman Resit dan Invois disusun **ikut nama client** (tekan nama untuk kembang),
lengkap dengan jumlah diterima dan baki semasa client itu.

Resit mengambil kira **semua bayaran terdahulu**, contoh resit bayaran kedua:

```
Sub-Total                             RM 550.00
Previous Payment — Deposit (1 Sep)    RM 100.00
Payment Received (Bayaran Kedua)      RM 450.00
Total Paid                            RM 550.00
Balance Due                           RM   0.00
```

Tandakan *Sertakan muka surat Inspection Information* untuk resit 2 muka surat.

## Invois

Untuk **minta bayaran** sebelum client bayar. Buka jualan → **Buat Invois**.
Semua maklumat diambil dari rekod jualan yang sama, dan bayaran yang sudah
diterima ditolak automatik:

```
Sub-Total                              RM 550.00
Payment Received — Deposit (1 Sep)     RM 100.00
Balance                                RM 450.00
AMOUNT DUE                             RM 450.00
```

- **Tarikh akhir bayaran** diisi automatik (tempoh boleh ubah dalam Tetapan, default 7 hari)
- **Jumlah Perlu Dibayar** boleh diubah jika mahu minta sebahagian sahaja
- Nombor invois berasingan dari resit (contoh `INV-0001` dan `GX-0001`)
- Cetak/PDF, salin teks, atau hantar WhatsApp — sama seperti resit
- **Status dikira automatik** dari bayaran sebenar dalam rekod jualan:
  Belum Bayar → Bayar Sebahagian → Sudah Bayar (Lewat jika lepas tarikh akhir)
- Butang **Terima Bayaran & Jana Resit** dalam invois: bayaran terus direkod pada
  jualan (jumlah = amaun invois), resit dijana, dan invois bertukar *Sudah Bayar*
  dengan pautan ke resit tersebut
- Status juga boleh **ditetapkan manual** (Belum Bayar / Bayar Sebahagian /
  Sudah Bayar / Batal) jika perlu
- Invois boleh dijana dari butiran jualan **atau** terus dari baris dalam
  paparan Senarai Key-in Sale

## Ayat hantar WhatsApp

Menu **Tetapan → Tetapan Resit** ada dua kotak ayat yang boleh disunting:
*Ayat Hantar Invois* dan *Ayat Hantar Resit*. Guna kod ini dalam ayat, sistem
akan gantikan automatik:

`{nama}` `{no}` `{tarikh}` `{tarikhAkhir}` `{servis}` `{jenis}` `{jumlah}`
`{subtotal}` `{dibayar}` `{baki}` `{bank}` `{akaun}` `{namaAkaun}`
`{tarikhInspeksi}` `{syarikat}`

Dari pratonton: **Cetak / Simpan PDF** (pilih "Save as PDF" dalam dialog cetak),
**Salin Teks**, atau **WhatsApp** (terus ke nombor client jika ada).

Resit yang dijana menyimpan salinan tetapan syarikat pada masa itu, jadi resit
lama tidak berubah walaupun tetapan diubah kemudian.

**Tetapan resit** (menu Tetapan): nama syarikat, alamat, email, SSM, prefix &
nombor resit seterusnya, maklumat bank, nota bawah resit, URL logo & tandatangan,
nama dan jawatan penandatangan.

## Target ikut bulan

Secara lalai, target bulan = **target harian × hari bekerja**. Kalau mahu target
berbeza untuk bulan tertentu, pergi **Tetapan → Target Ikut Bulan**, pilih bulan
dan masukkan jumlah. Bulan itu akan guna target khas tersebut, dan target harian
dalam kalendar dikira semula (target bulan ÷ hari bekerja). Tekan **Buang** untuk
kembali kepada kiraan automatik.

## Isi auto dari WhatsApp

Dalam **Key-in Sale** tekan **Isi Auto (WhatsApp)**:

1. **Salin Format Kosong** (atau **Hantar Format ke WhatsApp**) — hantar kepada admin.
2. Admin isi maklumat dalam WhatsApp dan hantar balik.
3. Paste mesej itu ke dalam kotak, tekan **Isi Borang** — borang key-in terisi automatik.

Format:

```
KEY-IN SALE
Tarikh: 8/9/2026
Masa: 9.30am - 12.30pm
Nama Client: Ahmad Faiz
No. Telefon: 012-3456789
Email: faiz@gmail.com
Projek: Panorama
No. Unit: A-07-07
Size: 950
Harga (RM): 500
Water (RM): 50
Electric (RM): 0
Deposit (RM): 100
Closed By: Dastie
Dari (sumber): Facebook
Staf Inspection: Fikri, Haziq
Catatan: Client minta pagi
```

Baris yang tak diisi diabaikan. Tarikh menerima `8/9/2026`, `08-09-2026` atau
`2026-09-08`. Masa boleh guna `-`, `–` atau `hingga`. Staf inspection dipisah
dengan koma dan terus ditandakan dalam borang.

## Kiraan automatik

```
Jumlah  = Harga + Water + Electric
Dibayar = Deposit + Final Payment
Baki    = Jumlah − Dibayar

Target bulan = Target harian × bilangan hari bekerja (tolak hari cuti)
```

## Status kerja

`Tempahan` → `Inspection Siap` → `Report Submit` → `Selesai`
(`Batal` untuk job yang dibatalkan — tidak dikira dalam jualan)

Nombor merah pada menu **Key-in Sale** = bilangan job yang report belum submit.

## Data & backup — PENTING

Data disimpan dalam pelayar komputer yang digunakan sahaja.

- Buat **backup** kerap: Tetapan → *Muat Turun Backup* (fail JSON).
- Untuk pindah ke komputer lain: Tetapan → *Pulih dari Fail*.
- Jangan "clear browsing data / cookies + site data" tanpa backup — data akan hilang.
- Guna **Eksport CSV** untuk buka data dalam Excel.

## Akan datang

Log masuk & peranan, kehadiran staf, cuti, tuntutan (claim), komisen sales,
dan pilihan simpan data dalam talian supaya semua telefon nampak data sama.
