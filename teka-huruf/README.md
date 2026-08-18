# 🔤 Teka Huruf — Permainan Perkataan untuk Pelajar

Aplikasi web ringkas (satu fail HTML) untuk murid sekolah rendah berlatih ejaan dan
perbendaharaan kata Bahasa Melayu. Tiada pemasangan, tiada internet diperlukan.

## Cara guna

Buka `teka-huruf/index.html` dalam mana-mana pelayar (Chrome, Safari, Edge) —
komputer, tablet atau telefon. Boleh juga dihoskan di Firebase Hosting sebagai
`/teka-huruf/`.

## Tiga mod permainan

| Mod | Cara main | Nyawa |
|---|---|---|
| 🎯 **Teka Huruf** (hangman) | Teka huruf satu demi satu berdasarkan petunjuk | 6 |
| 🔀 **Susun Huruf** (anagram) | Ketik jubin huruf mengikut susunan yang betul | 3 cubaan |
| 🕳️ **Huruf Hilang** | Isi tempat kosong, contoh `B_K_` → `BUKU` | 3 |

Setiap set ada 10 soalan. Boleh guna papan kekunci pada skrin atau papan kekunci
komputer (Backspace = padam dalam mod Susun Huruf).

## Ciri-ciri

- **138 perkataan terbina** dalam 10 kategori (Haiwan, Buah-buahan, Warna, Sekolah,
  Anggota Badan, Kenderaan, Makanan, Alam Semula Jadi, Barang Rumah, Pekerjaan) —
  setiap satu dengan petunjuk Bahasa Melayu.
- **Tahap kesukaran**: Campur / Mudah (3–5 huruf) / Sederhana (6–7) / Sukar (8+).
- **Markah & rentetan**: markah ikut baki nyawa, bonus 🔥 untuk jawapan betul berturut-turut,
  bintang ⭐ pada akhir set.
- **Bantuan** (−5 markah): buka satu huruf, sekali untuk setiap perkataan.
- **Statistik murid**: set dimainkan, skor terbaik, ketepatan — ikut mod.
- **Editor senarai kata untuk guru**: tambah perkataan + petunjuk + kategori sendiri.
  Boleh pilih *"Guna senarai saya sahaja"* supaya hanya perkataan guru digunakan
  (contoh: senarai ejaan minggu ini).
- **Eksport / Import** senarai kata sebagai teks JSON — mudah dikongsi antara guru
  atau dipindah ke peranti lain.
- Bunyi ringkas (boleh dimatikan 🔇), mesra telefon, antara muka penuh Bahasa Melayu.

## Di mana data disimpan?

Semua data (senarai kata guru, statistik, tetapan) disimpan dalam `localStorage`
pelayar peranti itu sahaja. Tiada data dihantar ke mana-mana pelayan, tiada akaun
diperlukan. Membersihkan data pelayar akan memadam senarai — sila **Eksport**
senarai penting sebagai simpanan.

## Untuk adik yang lebih kecil (4–6 tahun)

Lihat [ABC Kecil](../abc-kecil/) — apps mengenal huruf A–Z dengan lagu ABC,
gambar dan suara. Ada pautan ke sana di skrin menu apps ini.

## Menambah perkataan secara pukal (guru)

1. Buka apps → ikon 📝 → **Eksport** untuk melihat formatnya.
2. Format: `[{"w":"MATAHARI","h":"Bersinar pada waktu siang","k":"Alam Semula Jadi"}]`
   (`w` = perkataan A–Z 3–14 huruf, `h` = petunjuk, `k` = kategori).
3. Tampal senarai penuh ke dalam kotak teks → **Import**. Perkataan berulang diabaikan.
