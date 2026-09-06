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
