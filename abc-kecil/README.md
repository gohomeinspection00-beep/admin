# 🌈 ABC Kecil — Belajar Huruf untuk Umur 4–6 Tahun

Aplikasi web sangat mudah (satu fail HTML) untuk anak kecil mengenal huruf A–Z
sambil menyanyi lagu ABC. Butang besar, sedikit teks, banyak gambar — sesuai
untuk kanak-kanak yang belum boleh membaca.

Buka `abc-kecil/index.html` dalam pelayar telefon, tablet atau komputer.
Tiada internet, tiada pemasangan, tiada akaun.

## Tujuh aktiviti

| Aktiviti | Apa yang berlaku |
|---|---|
| 🎵 **Lagu ABC** | Melodi lagu ABC dimainkan; huruf besar berubah dan huruf dalam grid menyala mengikut lagu, jadi anak boleh nyanyi sambil menunjuk |
| 🔤 **Kenal Huruf** | Ketik mana-mana huruf → huruf besar **A** + huruf kecil **a** + gambar (🐔) + perkataan (AYAM), dan suara menyebut "A, A untuk Ayam" |
| ✏️ **Surih Huruf** | Huruf besar & kecil dipapar sebagai jejak pudar — anak tulis di atasnya dengan jari (krayon pelangi). Butang 🧽 Padam, ⭐ Siap! auto ke huruf seterusnya |
| 🎯 **Cari Huruf** | "Mana huruf B?" — pilih antara 3 huruf besar. Betul dapat ⭐, salah cuma goyang sikit (tiada hukuman). Kumpul 6 bintang → skrin 🏆 Syabas |
| 🃏 **Cari Pasangan** | Permainan memori 8 kad: padankan huruf besar dengan huruf kecil (A + a). Padan → kad kekal terbuka hijau dan suara sebut "Sama! A besar dan a kecil" |
| 🖼️ **Huruf & Gambar** | Huruf dipapar, anak pilih gambar yang bermula dengan huruf itu (B → ⚽). Mengukuhkan bunyi huruf dengan perkataan |
| 🎈 **Letupkan Belon** | 4 belon terapung-apung; suara sebut "Letupkan belon huruf D!" — anak ketik belon yang betul, belon meletup 💥 |

Semua permainan: 6 pusingan kumpul bintang (kecuali Surih & Pasangan), tiada
hukuman untuk jawapan salah, dan skrin 🏆 Syabas pada akhirnya.

## Bunyi & suara Bahasa Melayu

- **Melodi lagu ABC** dijana sendiri oleh apps (WebAudio) — tiada fail MP3 diperlukan,
  jadi ia berfungsi walaupun tanpa internet.
- **Suara menyebut huruf** menggunakan *text-to-speech* peranti. Apps akan memilih
  suara mengikut keutamaan ini:
  1. 🇲🇾 suara **Bahasa Melayu** (`ms-MY`) — paling tepat;
  2. 🇮🇩 suara **Bahasa Indonesia** (`id-ID`) — sebutannya hampir sama dengan BM;
  3. jika kedua-duanya tiada, apps bertukar ke **mod fonetik**: perkataan dieja
     mengikut bunyi Melayu supaya suara Inggeris pun menyebut dengan betul
     (contoh: `KUCING` → *koo-ching*, `Mana huruf` → *mah-nah hoo-roof*, `Z` → *zed*).
- Kad **🎙️ Suara Bahasa Melayu** di skrin menu menunjukkan suara yang sedang dipakai,
  membenarkan ibu bapa/guru pilih suara lain daripada senarai peranti (pilihan disimpan),
  dan butang ▶️ untuk mencuba bunyinya.
- **Nak suara BM sebenar?** Pasang dahulu pada peranti:
  - **Android:** Tetapan → Sistem → Bahasa & input → Output teks-ke-pertuturan →
    Google Text-to-Speech → Pasang data suara → *Bahasa Melayu*.
  - **iPhone / iPad:** Tetapan → Kebolehaksesan → Kandungan Dituturkan → Suara → *Bahasa Melayu*.
  - **Komputer:** guna Chrome atau Edge, dan pasang pakej bahasa Melayu pada sistem.
  Selepas dipasang, buka semula apps — kad suara akan tunjuk ✅ automatik.
- Butang 🗣️ / 🤐 untuk hidup-matikan suara; butang 🔊 / 🔇 untuk melodi & kesan bunyi.
- Tekan skrin dahulu (mula-mula ketik butang) supaya pelayar benarkan bunyi —
  ini peraturan biasa semua pelayar telefon.

Semua teks dalam apps ini 100% Bahasa Melayu Malaysia — tiada antara muka Inggeris.

## Senarai perkataan A–Z

A Ayam · B Bola · C Cawan · D Daun · E Epal · F Feri · G Gajah · H Harimau ·
I Ikan · J Jam · K Kucing · L Lori · M Matahari · N Nanas · O Oren · P Pisang ·
Q Quran · R Rumah · S Susu · T Topi · U Ular · V Van · W Wau · X Xilofon ·
Y Yoyo · Z Zebra

Nak tukar perkataan? Edit senarai `HURUF` di bahagian atas `<script>` dalam
`index.html` — formatnya `["A","AYAM","🐔"]`.

## Apps berkaitan

Untuk kanak-kanak yang sudah boleh mengeja (sekolah rendah), gunakan
[Teka Huruf](../teka-huruf/) — hangman, susun huruf dan huruf hilang, dengan
editor senarai kata untuk guru. Kedua-dua apps ada pautan antara satu sama lain
di skrin menu.
