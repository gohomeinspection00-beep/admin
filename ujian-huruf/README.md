# 📋 Ujian Huruf — Uji Penguasaan Huruf Pelajar

Aplikasi web satu fail untuk guru/ibu bapa **menguji** (bukan mengajar) sama ada
murid sudah mengenal huruf A–Z. Keputusan setiap murid disimpan dan boleh
dieksport. Buka `ujian-huruf/index.html` dalam pelayar — tiada internet, tiada akaun.

## Tiga jenis ujian

| Ujian | Cara | Semakan |
|---|---|---|
| 👂 **Dengar & Tunjuk** | Apps sebut huruf (suara BM), murid ketik 1 daripada 4 pilihan; butang 🔊 untuk dengar semula | Automatik |
| 🗣️ **Lihat & Sebut** | Huruf besar dipapar, murid menyebutnya dengan mulut — guru tanda ✓/✗ | Guru |
| 🔗 **Padan Besar–Kecil** | Huruf besar dipapar, murid pilih huruf kecil yang sepadan | Automatik |

Pilihan tambahan: bentuk huruf (BESAR / kecil / campur) dan jumlah soalan
(10 / 15 / semua 26). Huruf dipilih secara rawak tanpa ulangan; semasa mod
Lihat & Sebut suara dimatikan supaya jawapan tidak terbocor.

## Keputusan & rekod

- Skor besar + carta A–Z berwarna: hijau = dikuasai, merah = perlu latihan,
  kelabu = tidak diuji, serta senarai huruf untuk dilatih semula.
- Setiap ujian yang **tamat** disimpan automatik (nama, tarikh/masa, jenis,
  skor, huruf salah). Ujian yang dibatalkan tidak disimpan.
- Skrin 🗂️ **Rekod**: tapis ikut nama murid, padam satu-satu atau semua,
  dan **Jana CSV** untuk disalin ke Excel/Google Sheets/WhatsApp.
- Semua data dalam `localStorage` peranti — tiada data dihantar ke pelayan.

## 🎤 Rakam suara sendiri (suara cikgu/ibu bapa)

Tekan **"Rakam Suara Saya Sendiri"** dalam kad suara di skrin utama:

1. Benarkan akses mikrofon apabila pelayar bertanya.
2. Ketik 🎙️ pada mana-mana huruf, sebut hurufnya, dan ketik ⏹ (atau tunggu —
   rakaman berhenti sendiri selepas 4 saat). ▶️ untuk semak, 🗑 untuk padam.
3. Boleh juga rakam frasa 💬 *"Mana huruf…?"* supaya keseluruhan soalan
   berbunyi dengan suara anda.
4. Tandakan **"Guna suara saya dalam ujian"**.

Semasa ujian Dengar & Tunjuk, apps akan mainkan rakaman anda (frasa + huruf);
huruf yang belum dirakam jatuh balik ke suara TTS secara automatik — jadi tidak
perlu rakam semua 26 sekali gus. Rakaman disimpan dalam `localStorage` peranti
itu sahaja (tidak dihantar ke mana-mana), dan kekal walaupun apps ditutup.

## Suara Bahasa Melayu

Sama seperti ABC Kecil: apps memilih suara `ms-MY` dahulu, kemudian `ms`,
kemudian `id-ID` (sebutan hampir sama); jika semua tiada, arahan dieja secara
fonetik Melayu supaya suara Inggeris pun berbunyi betul. Kad 🎙️ di skrin
utama menunjukkan suara semasa dan membenarkan pilihan manual (disimpan).

## Aliran cadangan untuk cikgu

1. Murid belajar dengan [ABC Kecil](../abc-kecil/) 🌈 (umur 4–6).
2. Uji dengan **Ujian Huruf** — mula dengan Dengar & Tunjuk 10 soalan.
3. Huruf merah dilatih semula di ABC Kecil, kemudian uji semula.
4. Bila carta penuh hijau, naik ke [Teka Huruf](../teka-huruf/) 🔤 (ejaan perkataan).
