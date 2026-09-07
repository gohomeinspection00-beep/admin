# Sistem Pengurusan Syarikat — Panduan Ringkas

Satu fail sahaja: **`index.html`**. Tiada pemasangan, tiada internet, tiada Firebase.

## Cara guna

1. Muat turun `index.html`.
2. Klik dua kali fail tersebut — ia terus terbuka dalam pelayar (Chrome / Edge).
3. Untuk akses cepat, simpan sebagai bookmark atau letak di desktop.

## Susunan menu

Menu sisi disusun ikut kategori. Kumpulan boleh dibuka atau ditutup dengan
menekan tajuknya.

```
Papan Utama
Sale and Schedule
Operasi
Sub Job
Tool ▸ Quotation · Invois · Resit
Kewangan ▸ Tunggakan · Perbelanjaan · Marketing · Claim Staf · Gaji · Komitmen
Aset & Stok ▸ Alat · Sticker & Bahan · Calibration Tool
To Do
Team & Staf ▸ Team · Staf
Tetapan
```

Nombor merah pada menu menunjukkan perkara yang perlu tindakan. Bila kumpulan
ditutup, nombor itu naik ke tajuk kumpulan.

## Modul sedia ada

| Menu | Kegunaan |
|---|---|
| **Papan Utama** | **Jalur amaran tugasan tertunggak di atas sekali**, jualan bulan ini, deposit, baki, % capai target, bilangan site, **carta 12 bulan (boleh tukar Jualan RM ↔ bilangan Site)**, job hari ini, kerja tertunggak, prestasi ikut sales & projek |
| **Sale and Schedule** | Paparan **Kalendar** atau **Senarai**. Rekod setiap tempahan: tarikh, masa inspection, client, unit, harga, water, electric, deposit, closed by, sumber lead, status kerja, invois, catatan. Baki dikira automatik |
| **Operasi** | Siapa bergerak hari ini: jadual mengikut masa, staf ditugaskan, job belum ditugaskan, beban kerja 7 hari, **carta tugasan inspector bulan ini**, **nilai site setiap inspector**, tugasan report & submission, tukar status terus dari jadual |
| **Quotation** | Jana sebut harga A4, pautan Syarat & Terma untuk client, mesej WhatsApp, dan tukar quotation yang diterima menjadi sale |
| **Sub Job** | Kerja yang disubkan — direkod berasingan daripada jualan syarikat, dengan agihan RM kepada setiap staf/rakan dan baki bahagian syarikat |
| **Invois** | Jana invois A4 untuk minta bayaran — tarikh akhir bayaran, bayaran diterima ditolak, status automatik (Belum Bayar / Bayar Sebahagian / Sudah Bayar / Lewat) |
| **Tunggakan** | Semua baki yang belum dikutip — jualan, sub job dan invois manual — disusun ikut umur hutang, dengan butang kejar bayaran WhatsApp |
| **Alat & Stok** | Tiga tab: Alat (siapa ambil, siapa pulang), Sticker & Bahan Pakai, dan Calibration Tool (sijil SIRIM & tarikh luput) |
| **Perbelanjaan** | Semua duit keluar: perbelanjaan syarikat, marketing (Ads, campaign, flyers) dan claim staf — dengan resit |
| **Gaji** | Payroll bulanan: gaji pokok, elaun, komisen, elaun site, claim staf, potongan KWSP/PERKESO/EIS/PCB dan slip gaji A4 |
| **Komitmen** | Transport, pinjaman dan komitmen bulanan lain — bila kena bayar, sudah bayar atau belum |
| **To Do** | Senarai kerja: apa perlu buat, siapa buat, bila kena siap, boleh berulang |
| **Resit** | Jana resit A4 mengikut format syarikat — nombor resit automatik & unik, cetak/simpan PDF, salin teks atau hantar WhatsApp |
| **Team** | Set up team kerja: nama team, ketua, ahli (tidak wajib) dan alat yang dipegang team |
| **Staf** | Tambah / sunting / padam staf, termasuk **kumpulan** (Operasi / Management). Staf aktif muncul dalam pilihan "Closed By" dan jualan bulanan mereka dipaparkan |
| **Tetapan** | Terbahagi kepada 5 tab: Syarikat & Target, Jualan & Status, Resit & Invois, Quotation, Data & Backup |

## Kalendar Sale and Schedule

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
  paparan Senarai dalam Sale and Schedule

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

Dalam **Sale and Schedule** tekan **Isi Auto (WhatsApp)**:

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

## Quotation

Menu **Quotation** menjana sebut harga lengkap:

1. **Quotation Baharu** (atau dari butiran jualan → *Buat Quotation*)
2. Isi client, jenis hartanah, alamat, service, dan **pecahan harga**
   (baris lalai: Inspection Fee, Transportation, PDF Report, Consultation —
   boleh tambah/buang). Jumlah dikira automatik
3. Tekan **Jana Quotation** — terus dapat:
   - **Quotation A4** (pratonton + Cetak/Simpan PDF) dengan logo, pecahan harga,
     "Apa Yang Kami Lakukan", nota penting dan tandatangan
   - **Pautan Syarat & Terma** untuk client (harga & pecahan dibawa dalam pautan)
   - **Mesej WhatsApp** siap (BM atau English) — salin atau hantar terus

Status quotation: Draf → Dihantar → Diterima / Ditolak / Luput.

### Pilih service dari dropdown

Medan **Service** dalam borang quotation ialah **dropdown** yang diambil dari
Tetapan → Quotation → *Senarai Servis*. Bila service ditukar, tiga benda
bertukar automatik: **link skop penuh**, **link lampiran PDF**, dan
**halaman belakang**. Semuanya masih boleh diubah untuk quotation itu sahaja.

### Page depan + page belakang (katalog PDF)

Setiap servis boleh disimpan **satu fail PDF katalog**:
Tetapan → **Quotation** → pilih servis → **Muat Naik PDF**.
Fail itu disimpan terus di dalam sistem (bukan link), jadi ia kekal walaupun
tiada internet.

Dalam quotation, tekan **Muat Turun PDF** — sistem menghasilkan **satu fail PDF**:

- **Page 1** — quotation A4 (logo, pecahan harga, nota, tandatangan)
- **Page 2 dan seterusnya** — semua muka surat katalog PDF tadi

Fail keluar sebagai `Quotation Q-0001 - Nama Client.pdf` — terus boleh hantar
kepada client melalui WhatsApp atau email.

Butang **Cetak** pula mencetak page quotation sahaja (untuk cetak kertas).

Nota:
- Kalau servis itu belum ada fail katalog, PDF akan ada page quotation sahaja
  (sistem akan beritahu di dalam tetingkap quotation).
- Kalau ruangan *Link Lampiran PDF* diisi dengan pautan `.pdf` dan komputer ada
  internet, sistem cuba muat turun pautan itu untuk digabung. Cara paling
  selamat tetap **muat naik fail** dalam Tetapan.
- Untuk logo & tandatangan keluar dalam PDF tanpa internet, guna butang
  **Muat Naik Fail Logo / Tandatangan** dalam Tetapan → Resit & Invois.
- Fail katalog turut dimasukkan ke dalam **fail backup**, jadi bila pulih di
  komputer lain, katalog ikut sekali.

### Jadikan Sale / Jadikan Sub Job

Tekan **Jadikan Sale** pada quotation — borang key-in sale terus terbuka dengan
nama, telefon, alamat (No. Unit), jenis hartanah, harga dan catatan sudah terisi;
*Dari* diisi **Quotation**. Tinggal isi **tarikh, masa inspection dan staf**,
kemudian **Simpan Sale**. Bila disimpan:

- Rekod terus masuk **Sale and Schedule** dan muncul dalam kalendar
- Quotation ditukar status kepada **Diterima**
- Quotation dan sale terpaut — butang **Lihat Sale** muncul pada quotation, dan
  butiran jualan pula memaparkan baris **Quotation** dengan butang *Buka*

Butang **Jadikan Sale** hilang selepas dipakai supaya tiada rekod berganda
(digantikan **Lihat Sale**).

Kalau kerja itu nak disubkan pula, tekan **Jadikan Sub Job** — borang Sub Job
terbuka dengan data client, alamat, jenis hartanah dan harga sudah terisi.
Tinggal isi tarikh, masa dan **agihan RM kepada staf/rakan**. Sub job juga
terpaut dengan quotation (butang *Lihat Sub Job* / baris *Quotation → Buka*),
dan ingat: sub job **tidak masuk** jualan syarikat atau target.

### Nama client tidak wajib

Nama client boleh dikosongkan dalam quotation, key-in sale dan sub job (kadang
client tak beri nama). Dalam senarai dan kalendar ia dipapar sebagai
**Tanpa nama**, dan pada quotation yang dicetak baris nama itu hilang terus.

### Tetapan quotation

Tetapan → tab **Quotation**: prefix & nombor seterusnya, tempoh sah,
**URL halaman Syarat & Terma**, senarai servis (nama, link skop, link lampiran
PDF untuk mesej, dan **fail katalog PDF**) dengan butang *+ Tambah Servis* /
*Buang*, pecahan harga lalai dan senarai jenis hartanah.

> **Halaman `tnc.html` mesti di-deploy berasingan** supaya client boleh buka
> pautan itu. Lihat `DEPLOY.md` untuk langkah penuh.

## Sub Job

Kerja yang awak subkan kepada orang lain. **Tidak dikira** dalam jualan syarikat,
target bulanan, papan utama, resit atau invois — semuanya diurus dalam menu
**Sub Job** sahaja.

Cara buat: klik kanan pada tarikh dalam kalendar → **Sub job baharu pada hari ini**
(atau butang *Sub Job Baharu* dalam menu Sub Job).

Isi butiran seperti biasa (tarikh, masa, client, projek, unit, harga), kemudian
bahagian **Agihan**:

- Tambah seberapa ramai staf/rakan — setiap seorang dapat berapa RM, dan peranan
  mereka (contoh: *buat inspection*)
- **Bahagian syarikat dikira automatik** = harga client − jumlah agihan
  (contoh: RM 600 − RM 250 − RM 150 = **RM 200** untuk syarikat kerana cari site)

### Bayaran sub job

Setiap sub job ada senarai bayaran sendiri (butang **+ Bayaran** dalam butiran
sub job) supaya tiada yang terlepas pandang. Sistem menunjukkan berapa sudah
dibayar dan **baki client**, dan sub job yang belum lunas ditanda merah.

Menu Sub Job memaparkan nilai client, jumlah diagihkan, bahagian syarikat,
**belum dikutip**, **kerja tertunggak**, senarai penuh, carian, eksport CSV,
serta **carta pendapatan setiap staf** dari sub job.

### Sub job pada papan utama

Sub job **tidak masuk** dalam kad jualan atau target — tetapi ada kad berasingan
*Sub Job* pada papan utama:

| Kad | Maksud |
|---|---|
| Nilai Client | jumlah harga sub job bulan itu |
| Syarikat Dapat | bahagian syarikat selepas tolak agihan |
| Belum Dikutip | baki yang client sub job belum bayar |
| **Pendapatan Syarikat** | jualan syarikat **+** bahagian sub job |

Sub job yang belum bayar atau status tertunggak juga naik dalam **jalur amaran**
dan **Perlu Tindakan** dengan tanda `SUB` — tekan untuk buka terus sub job itu.

Dalam kalendar, sub job dipapar dengan bingkai putus-putus dan tanda **SUB**
supaya jadual tidak bertindih — tetapi jumlah harian dan target kekal mengira
jualan syarikat sahaja.

## Kiraan automatik

```
Jumlah  = Harga + Water + Electric
Dibayar = Deposit + Final Payment
Baki    = Jumlah − Dibayar

Target bulan = Target harian × bilangan hari bekerja (tolak hari cuti)
```

## Status kerja

Senarai status **boleh diubah sendiri** dalam Tetapan (satu baris satu, ikut turutan).
Default:

`Tempahan` → `Inspection Siap` → `Report Siap` → `Submit Report` → `Submit App`
→ `Minta Bayaran` → `Selesai` · `Batal`

Dalam Tetapan juga ditetapkan status mana bermaksud **Selesai** dan **Batal**,
serta **Tempoh Pending (hari)** — default 3 hari.

Setiap status ada warna sendiri dalam kalendar. Job yang belum sampai status
Selesai selepas tempoh pending (dikira dari tarikh inspection) akan:

- ditanda **bingkai merah + lencana bilangan hari** dalam kalendar
- naik dalam **jalur amaran merah di atas sekali papan utama** — dengan kiraan,
  ringkasan setiap status, dan senarai yang boleh diklik terus ke job berkenaan.
  Jalur ini hilang sendiri sebaik status bertukar kepada Selesai
- naik juga dalam **Perlu Tindakan** di papan utama, dikumpul mengikut status
  semasa (contoh: *Tersekat di "Report Siap" (2)*) berserta staf yang ditugaskan

## Carta 12 bulan

Papan utama memaparkan carta bar Jan–Dis. Suis di atas carta menukar antara
**Jualan (RM)** dan **Site** (bilangan job), lengkap dengan perbandingan
naik/turun berbanding bulan lepas. Butang ‹ › menukar tahun, dan klik mana-mana
bar untuk menukar bulan yang dipaparkan pada kad-kad lain.

## Tugasan report & submission

Selain staf inspection, setiap job boleh ditetapkan:

- **Report Disediakan Oleh** — siapa tulis report
- **Submission Oleh** + **Jenis Submission** — siapa hantar dan submission apa

Untuk submission, boleh simpan sekali **Portal / App**, **Username**, **Password**
dan **Nota Submission** (contoh: OTP ke telefon siapa). Password dipapar bertanda
titik dalam butiran job — tekan **Papar** untuk lihat.

> Maklumat log masuk disimpan dalam pelayar komputer itu sahaja dan tidak dihantar
> ke mana-mana. Jangan guna komputer berkongsi, dan pastikan backup disimpan selamat.

Boleh diisi semasa key-in, atau melalui butang **Tugaskan** dalam menu Operasi.

## Hantar tugasan ke WhatsApp

Dalam butiran job, setiap nama staf ada butang **Hantar** di sebelahnya —
untuk staf inspection, report, dan submission. Bila ada dua atau lebih inspector,
ada juga butang **Hantar semua** (satu mesej untuk kedua-duanya).

Tetingkap tugasan membolehkan:

- Tukar jenis tugasan (Staf inspection / Report / Submission)
- Pilih penerima — seorang, atau beberapa orang dalam satu mesej. Staf lain
  yang belum ditugaskan ditanda `*` tetapi masih boleh dipilih
- Tulis **Remark** (disimpan pada job mengikut jenis tugasan, jadi kekal
  bila dibuka semula)
- Untuk submission: kotak pilihan **Sertakan username & password**
  (tidak disertakan secara lalai)
- **Salin Teks** atau **Hantar WhatsApp** — terus ke nombor staf itu jika ada
  dalam menu Staf

**Mesej tugasan tidak sekali-kali menyertakan harga, deposit atau baki.**
Contoh:

```
TUGASAN INSPECTION

Client: Ahmad Faiz
Tarikh inspection: 8 Sep 2026 (Selasa)
Masa: 9.30am – 12.30pm
Projek: Panorama
Unit: A-07-07
Size: 950
Telefon client: 012-1112222
Staf bertugas: Fikri, Zaim

Remark: Bawa moisture meter, client minta datang awal

Go Home Inspection
```

Butang **Hantar** juga ada pada setiap baris jadual dalam menu Operasi.
Menu Operasi memaparkan jadual *Tugasan Report & Submission* — berapa report dan
submission tertunggak bagi setiap staf, termasuk yang **belum ditugaskan**.

Nombor merah pada menu **Sale and Schedule** = bilangan job yang belum selesai.

## Tunggakan (aging)

Menu **Tunggakan** mengumpul semua duit yang belum masuk dalam satu skrin:

- **Jualan** yang masih ada baki (rekod berstatus Batal tidak dikira)
- **Sub job** yang belum dijelaskan client
- **Invois manual** yang belum ditanda *Sudah Bayar*

Umur hutang dikira dari **tarikh akhir invois**; kalau job itu tiada invois,
dikira dari **tarikh kerja**. Kumpulan umur: *Belum matang* (belum sampai
tarikh), *1–30 hari*, *31–60 hari*, *61 hari ke atas*.

Setiap baris ada tiga butang:

| Butang | Fungsi |
|---|---|
| **Buka** | Buka butiran jualan / sub job / invois |
| **Bayar** | Terus rekod bayaran (jumlah baki sudah terisi) |
| **WA** | Buka WhatsApp client dengan ayat kejar bayaran siap |

Ayat kejar bayaran diubah di Tetapan → **Resit & Invois** → *Ayat Kejar Bayaran*.
Boleh guna: `{nama} {syarikat} {tarikh} {tarikhAkhir} {projek} {unit} {jumlah}
{dibayar} {baki} {hari} {bank} {akaun} {namaAkaun}`.

Papan utama pula memaparkan jalur **Tunggakan Bayaran** bila ada rekod yang
sudah lewat, dan menu sisi menunjukkan bilangannya. Semua senarai boleh
dieksport ke CSV.

## Team

Menu **Team & Staf → Team** untuk set up pasukan kerja.

Setiap team ada: **nama team**, **ketua**, **ahli** (tandakan dari senarai staf —
tidak wajib, nama team sahaja pun boleh), **kit team**, **kenderaan team**,
status aktif dan nota.

### Kit team menolak stok

Dalam borang team, bahagian **Kit Team** ialah senarai barang + kuantiti.
Pilihannya termasuk **semua barang** dalam Alat & Stok — alat mahupun bahan
pakai seperti sticker. Setiap pilihan menunjukkan berapa banyak lagi *di rak*.

Bila disimpan, barang itu **ditolak dari stok** — ia dikira sedang dipegang
team tersebut, dan masuk dalam sejarah barang sebagai *Ambil (Kit Team)*.
Kurangkan kuantiti atau buang baris untuk **pulangkan** semula ke stok
(*Pulang (Kit Team)* dalam sejarah). Kuantiti yang melebihi baki di rak akan
dihadkan automatik dan sistem beritahu berapa yang sebenarnya boleh diambil.

Untuk barang yang memang sentiasa berada dalam kit (contoh tangga 2 unit yang
dua-duanya sentiasa keluar), tandakan **Abaikan amaran stok** pada barang itu
supaya baki 0 tidak keluar sebagai amaran.

**Kenderaan team** diambil dari Kewangan → Komitmen → Transport (kenderaan
tidak menolak stok kerana ia bukan barang stok).

Bila staf ambil alat, borang **Ambil** ada pilihan **Untuk Team**. Kalau nama
staf itu sudah ada dalam sesuatu team, team itu dipilih automatik. Sejarah alat
kemudiannya menunjukkan **siapa ambil dan team mana** — contoh
*"Zaim (Team A)"* — dan jadual *Siapa Pegang Apa* memaparkan nama team di bawah
nama staf.

Buka mana-mana team untuk lihat ahli, kit tetap team, dan alat yang sedang
diambil atas nama team itu.

## Alat & Stok

Menu ini ada **tiga tab**.

### Tab 1 — Alat

Semua alat inspection yang jarang dibeli: moisture meter, thermal camera,
tangga, socket tester dan sebagainya.

**Siapa ambil barang** — tekan **Ambil** pada baris barang, pilih nama staf,
berapa unit dan untuk apa. Contoh: Zaim ambil 1 daripada 3 socket tester —
lajur *Dipegang* jadi 1, *di rak* tinggal 2, dan rekod itu masuk sejarah
barang tersebut.

Bila dipulangkan, tekan **Pulang** (dalam jadual *Siapa Pegang Apa*, atau
dalam butiran barang). Masa pulang boleh pilih keadaan barang:
**Baik**, **Rosak** atau **Hilang** — kalau rosak atau hilang, sistem terus
tolak dari jumlah yang boleh guna.

Jadual **Siapa Pegang Apa** di bawah senarai memaparkan semua barang yang
masih di tangan staf dan sudah berapa hari.

### Tab 2 — Sticker & Bahan Pakai

Sticker defect, marker, tape, bateri, sarung tangan. Tekan **Ambil / Guna**,
taip kuantiti dan nama pengambil — stok tolak sendiri dan nama disimpan dalam
sejarah. **+ Stok** untuk top up bila beli baharu.

Status: **Baik** → **Hampir habis** (bila baki sampai paras minimum) →
**Habis**. Paras minimum ditetapkan setiap barang.

### Abaikan amaran stok

Ada barang yang memang digunakan sepenuhnya — contoh tangga 2 unit dan
dua-duanya sentiasa keluar, atau bahan yang memang tidak di-top up. Untuk
barang begini, tandakan **Abaikan amaran stok** dalam borang barang.

- Amaran *Hampir habis* dan *Habis* tidak lagi keluar (status jadi
  **Guna sepenuhnya**), dan barang itu tidak dikira dalam nombor merah pada
  menu atau papan utama
- **Rosak** dan **hilang** tetap dilaporkan seperti biasa
- Baris barang itu bertanda *stok diabaikan* supaya awak tahu sebab ia senyap

### Tab 3 — Calibration Tool

Rekod kalibrasi setiap alat:

- Nama alat dan no. siri
- Badan kalibrasi (SIRIM dan lain-lain) dan no. sijil
- Tarikh kalibrasi + tarikh luput (pilih tempoh 6/12/24/36 bulan dan tarikh
  luput diisi automatik)
- Kos kalibrasi
- **Fail sijil PDF** — muat naik terus, simpan dalam sistem, buka bila-bila
  dengan butang *Sijil*

Alat yang **hampir luput** (30 hari sebelum, boleh ubah) atau **sudah luput**
naik di papan utama dan jadi nombor merah pada menu. Bila kalibrasi semula,
tekan **Kalibrasi Semula** — rekod lama kekal sebagai sejarah.

Semua nombor stok, sejarah ambil/pulang dan fail sijil masuk dalam **backup**.

## Perbelanjaan

Satu menu untuk semua duit keluar, dengan tiga tab.

### Tab 1 — Semua Perbelanjaan

Setiap rekod ada: tarikh, jenis (**Syarikat** atau **Claim Staf**), jumlah,
kategori, saluran/sub-kategori, pembekal, cara bayar, no. rujukan, nota,
**resit** (gambar atau PDF) dan penanda **boleh tuntut cukai** untuk LHDN.

Kad atas memaparkan belanja bulan itu, **duit masuk** (semua bayaran client),
**duit keluar** (perbelanjaan + bayaran komitmen) dan **baki bulan ini**.
Di bawahnya carta belanja ikut kategori.

### Tab 2 — Marketing

Semua rekod berkategori **Marketing** — Facebook Ads, Google Ads, TikTok,
print flyers, banner, kempen, booth, influencer dan lain-lain (senarai saluran
boleh diubah dalam Tetapan).

Selain jumlah belanja bulan dan tahun, tab ini memaparkan:

- **Peratus dari jualan** — berapa peratus jualan bulan itu dibelanjakan untuk marketing
- **Carta belanja ikut saluran**
- **Belanja vs Jualan Ikut Saluran** — nisbah pulangan setiap saluran

Nisbah dikira dengan memadankan **nama saluran** dengan **sumber lead** pada
rekod jualan. Contoh: belanja *Facebook Ads* RM 450 dan jualan dari sumber
*Facebook Ads* RM 1,400 → nisbah **3.1x**. Sebab itu guna nama yang sama
di kedua-dua senarai (Tetapan → Jualan & Status untuk sumber lead,
Tetapan → Perbelanjaan untuk saluran).

### Tab 3 — Claim Staf

Claim staf direkod sama seperti perbelanjaan lain, cuma jenisnya **Claim Staf**
dan perlu nama staf. Setiap claim ada status **Belum Bayar** / **Sudah Bayar** —
tekan **Tanda Bayar** bila sudah dibayar kepada staf.

Kad atas memaparkan jumlah claim yang belum dibayar, claim bulan ini, yang
sudah dibayar, dan siapa paling banyak claim. Papan utama juga mengingatkan
kalau ada claim belum dibayar.

### Untuk LHDN

Tekan **Eksport CSV** — fail mengandungi tarikh, kategori, perkara, pembekal,
jumlah, cara bayar, no. rujukan, penanda *boleh tuntut cukai* dan nama fail
resit. Resit sebenar disimpan dalam sistem dan ikut dalam backup.

## Gaji

Menu **Kewangan → Gaji** untuk payroll bulanan.

### Sediakan maklumat staf dahulu

Dalam **Team & Staf → Staf**, setiap staf ada bahagian *Maklumat Gaji*:
gaji pokok, **komisen jualan (%)**, **elaun site (RM/site)**, elaun tetap
(nama | jumlah), bank, no. akaun, no. KP, no. KWSP, no. PERKESO, dan
tanda caruman KWSP / PERKESO / EIS.

### Jana gaji

Tekan **Jana Gaji Semua Staf** untuk bulan berkenaan. Sistem mencadangkan:

| Baris | Dari mana |
|---|---|
| Gaji pokok & elaun tetap | Rekod staf |
| Komisen jualan | Jualan bulan itu yang *Closed By* staf tersebut × peratus komisen |
| Elaun site | Bilangan site staf itu ditugaskan × kadar seunit |
| Claim staf | Semua claim **belum bayar** staf itu (dari menu Claim Staf) |
| KWSP / PERKESO / EIS | Peratus dalam Tetapan → Gaji |

Semua nombor **boleh diubah** sebelum slip dikeluarkan, dan boleh tambah
baris sendiri untuk OT, bonus, pendahuluan gaji atau potongan lain.

> **Penting:** KWSP, PERKESO dan EIS sebenarnya mengikut **jadual rasmi**
> ikut julat gaji. Sistem hanya mengira **anggaran peratus** — sila semak
> dengan jadual rasmi dan betulkan jumlah pada slip jika berbeza.

### Slip gaji

Tekan **Slip** untuk pratonton slip A4 (logo, maklumat pekerja, pendapatan,
potongan, bayaran balik claim, gaji bersih, caruman majikan, tandatangan) dan
**Cetak / PDF** untuk simpan atau cetak.

### Bila ditanda dibayar

Tekan **Bayar** → isi tarikh, kaedah, rujukan dan boleh lampirkan bukti bayaran.
Sistem kemudian:

- Tanda semua **claim** dalam slip itu sebagai *Sudah Bayar*
- Rekod satu **perbelanjaan** kategori *Gaji & Elaun* bersamaan
  **gaji kasar + caruman majikan** — jadi ia masuk kiraan duit keluar
  (claim tidak dikira dua kali kerana sudah direkod semasa claim dibuat)

Eksport CSV disediakan untuk penyata gaji bulanan.

## Komitmen

Tiga tab: **Transport**, **Pinjaman** dan **Komitmen Lain** (sewa, internet,
insurans, langganan — apa sahaja).

Setiap rekod ada: nama, pihak (bank/syarikat), rujukan (no. pendaftaran
kenderaan atau no. akaun), jumlah bayaran, kitaran (**Bulanan / Tahunan /
Sekali**), hari bayar setiap bulan, tarikh mula & tamat, dan jumlah
keseluruhan (untuk pinjaman).

Sistem kira sendiri **tarikh bayaran seterusnya**. Bila dah bayar, tekan
**Bayar** — bayaran itu direkod untuk bulan tersebut dan peringatan berpindah
ke bulan berikutnya. Butiran setiap komitmen memaparkan jumlah sudah dibayar
dan baki pinjaman.

Kad atas memaparkan komitmen aktif, purata bayaran sebulan, jumlah dibayar
bulan ini, dan berapa yang perlu dibayar tidak lama lagi.

## To Do

Senarai kerja pejabat: **apa perlu buat**, **siapa buat**, **bila kena siap**,
keutamaan (Biasa / Penting / Segera) dan status.

- Tanda kotak di kiri untuk tanda siap
- Kalau tugasan itu **berulang** (mingguan / bulanan / tahunan), tugasan
  berikutnya dibuat sendiri bila yang sekarang ditanda siap
- Tapis ikut *Belum siap*, *Sudah lewat*, *Sudah siap*, atau ikut orang
- Tugasan lewat atau hampir sampai tarikh naik di papan utama

## Muat naik gambar / resit

Lima tempat boleh dilampirkan gambar atau fail PDF. Tekan **Muat Naik**,
pilih gambar (boleh terus dari kamera telefon) atau PDF, kemudian **Simpan**.

| Tempat | Untuk apa |
|---|---|
| Rekod bayaran client (jualan & sub job) | Resit atau screenshot transfer client |
| Bayaran komitmen (transport, pinjaman, lain) | Resit bayaran bulanan |
| Ambil barang | Gambar barang masa diambil |
| Pulang barang | Gambar keadaan barang masa dipulangkan |
| Tambah stok / guna stok | Resit pembelian atau bukti penggunaan |

Selepas disimpan, butang kecil (**Bukti**, **Resit** atau **Gambar**) muncul
pada baris itu — tekan untuk buka fail.

Gambar dikecilkan automatik kepada maksimum 1400px sebelum disimpan, jadi
gambar telefon 4 MB biasanya tinggal beberapa ratus KB sahaja. Semua fail ini
disimpan dalam sistem (bukan link luar) dan **ikut sekali dalam backup**.

## Peringatan di papan utama

Papan utama mengumpul semua yang perlu tindakan di bahagian atas:

| Jalur | Isi |
|---|---|
| **Tugasan Tertunggak** | Job inspection yang belum siap ikut tempoh |
| **Tunggakan Bayaran** | Duit client yang belum masuk |
| **Alat & Stok Perlu Perhatian** | Rosak, hilang atau hampir habis |
| **Peringatan** | Kalibrasi hampir luput, komitmen kena bayar, tugasan To Do |

Berapa hari awal setiap peringatan keluar boleh diubah di
Tetapan → **Peringatan**.

## Menu Tetapan

Tetapan dibahagikan kepada tab supaya senang cari:

| Tab | Isi |
|---|---|
| **Syarikat & Target** | Nama syarikat, target jualan harian, hari bekerja, target ikut bulan, hari cuti / offday |
| **Jualan & Status** | Senarai projek/daerah, sumber lead, senarai status kerja, status "selesai" & "batal", tempoh pending |
| **Resit & Invois** | Maklumat syarikat pada dokumen, prefix & nombor resit/invois, bank, logo & tandatangan, ayat hantar WhatsApp |
| **Perbelanjaan** | Senarai kategori perbelanjaan dan saluran marketing |
| **Peringatan** | Berapa hari awal amaran kalibrasi, komitmen dan tugasan To Do keluar |
| **Quotation** | Prefix & nombor quotation, tempoh sah, URL Syarat & Terma, senarai servis + fail katalog PDF, pecahan harga lalai, jenis hartanah |
| **Data & Backup** | Muat turun backup, pulih dari fail, padam semua data, ringkasan bilangan rekod |

Setiap tab ada butang **Simpan** sendiri — simpan tab itu dahulu sebelum tukar tab.

## Data & backup — PENTING

Data disimpan dalam pelayar komputer yang digunakan sahaja.

- Buat **backup** kerap: Tetapan → Data & Backup → *Muat Turun Backup* (fail JSON,
  termasuk fail katalog PDF).
- Untuk pindah ke komputer lain: Tetapan → *Pulih dari Fail*.
- Jangan "clear browsing data / cookies + site data" tanpa backup — data akan hilang.
- Guna **Eksport CSV** untuk buka data dalam Excel.

## Akan datang

Log masuk & peranan, kehadiran staf, cuti, tuntutan (claim), komisen sales,
dan pilihan simpan data dalam talian supaya semua telefon nampak data sama.
