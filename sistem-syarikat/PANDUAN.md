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
| **Key-in Sale** | Rekod setiap tempahan: tarikh, masa, client, unit, harga, water, electric, deposit, closed by, sumber lead, status kerja, invois, catatan. Baki dikira automatik |
| **Staf** | Tambah / sunting / padam staf. Staf aktif muncul dalam pilihan "Closed By" dan jualan bulanan mereka dipaparkan |
| **Tetapan** | Nama syarikat, target jualan harian, hari bekerja, senarai projek, sumber lead, hari cuti, backup & restore |

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
