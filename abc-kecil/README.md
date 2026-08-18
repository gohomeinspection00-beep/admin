# 🌈 ABC Kecil — Belajar Huruf untuk Umur 4–6 Tahun

Aplikasi web sangat mudah (satu fail HTML) untuk anak kecil mengenal huruf A–Z
sambil menyanyi lagu ABC. Butang besar, sedikit teks, banyak gambar — sesuai
untuk kanak-kanak yang belum boleh membaca.

Buka `abc-kecil/index.html` dalam pelayar telefon, tablet atau komputer.
Tiada internet, tiada pemasangan, tiada akaun.

## Tiga aktiviti sahaja

| Aktiviti | Apa yang berlaku |
|---|---|
| 🎵 **Lagu ABC** | Melodi lagu ABC dimainkan; huruf besar berubah dan huruf dalam grid menyala mengikut lagu, jadi anak boleh nyanyi sambil menunjuk |
| 🔤 **Kenal Huruf** | Ketik mana-mana huruf → huruf besar **A** + huruf kecil **a** + gambar (🐔) + perkataan (AYAM), dan suara menyebut "A, A untuk Ayam" |
| 🎯 **Cari Huruf** | "Mana huruf B?" — pilih antara 3 huruf besar. Betul dapat ⭐, salah cuma goyang sikit (tiada hukuman). Kumpul 6 bintang → skrin 🏆 Syabas |

## Bunyi & suara

- **Melodi lagu ABC** dijana sendiri oleh apps (WebAudio) — tiada fail MP3 diperlukan,
  jadi ia berfungsi walaupun tanpa internet.
- **Suara menyebut huruf** menggunakan *text-to-speech* pelayar (`ms-MY`).
  Butang 🗣️ / 🤐 untuk hidup-matikan; butang 🔊 / 🔇 untuk melodi & kesan bunyi.
  Jika peranti tiada suara TTS, butang itu disembunyikan dan apps tetap boleh
  dimainkan dengan melodi sahaja.
- Tekan skrin dahulu (mula-mula ketik butang) supaya pelayar benarkan bunyi —
  ini peraturan biasa semua pelayar telefon.

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
