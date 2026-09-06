# Panduan Deploy — PENTING SEBELUM GUNA QUOTATION

Projek ini ada **dua fail berasingan** yang perlu di-deploy berbeza:

| Fail | Untuk siapa | Cara guna |
|---|---|---|
| `index.html` | **Admin sahaja** | Sistem pengurusan penuh. Simpan dalam komputer admin (buka terus), atau deploy ke pautan peribadi. Jangan kongsi dengan client — ada harga, gaji, password submission dan semua data syarikat. |
| `tnc.html` | **Client** | Halaman Syarat & Terma + ringkasan quotation. **Mesti di-deploy secara awam** supaya boleh dihantar sebagai pautan kepada client. |

## Langkah deploy `tnc.html`

1. Pergi ke [app.netlify.com/drop](https://app.netlify.com/drop) (atau mana-mana hosting statik).
2. Seret **fail `tnc.html` sahaja** ke ruang itu (boleh letak dalam satu folder kosong dahulu).
3. Netlify beri pautan, contoh: `https://tnc-goxpert.netlify.app/tnc.html`
4. Buka sistem admin → **Tetapan → tab Quotation** → tampal pautan itu dalam
   **Halaman Syarat & Terma untuk client (URL)** → Simpan.

Selepas ini, setiap quotation yang dijana akan menghasilkan pautan seperti:

```
https://tnc-goxpert.netlify.app/tnc.html?client=Encik%20Ali&price=400&cur=RM
&quote=Q-0001&service=Home%20Defect%20Inspection&valid=2026-09-20
&fee0_name=Inspection%20Fee&fee0_amt=250&...
```

Client buka pautan → nampak Syarat & Terma + ringkasan quotation (harga, pecahan,
no. quotation, tarikh sah) → tekan **Saya Setuju** → pilih tarikh → WhatsApp
terbuka kepada nombor syarikat untuk pengesahan.

## Katalog PDF (page belakang quotation)

Fail katalog **tidak perlu di-deploy**. Muat naik terus:
Tetapan → tab **Quotation** → pilih servis → **Muat Naik PDF**.
Fail disimpan dalam sistem, dan bila **Muat Turun PDF** ditekan pada quotation,
sistem gabung page quotation + semua muka surat katalog jadi satu fail PDF.

Fail katalog ikut sekali dalam **backup JSON**, jadi bila pulih di komputer lain
tak perlu muat naik semula.

## Nota deploy sistem admin

- Sistem admin menyimpan data dalam **localStorage pelayar**. Kalau di-deploy ke
  hosting, data tetap tinggal dalam pelayar setiap peranti — bukan dikongsi.
- Kalau deploy ke pautan awam, sesiapa yang tahu pautan boleh buka sistem
  (tiada log masuk lagi). Untuk sekarang, cara paling selamat ialah simpan
  `index.html` dalam komputer admin sahaja.
- Buat **backup** (Tetapan → Data & Backup → Muat Turun Backup) sebelum tukar
  komputer atau sebelum "clear browsing data". Backup ini termasuk fail katalog PDF.
- `index.html` sekarang mengandungi pustaka **pdf-lib** (MIT) supaya sistem boleh
  gabung PDF tanpa internet — sebab itu saiz failnya lebih besar. Jangan buang
  bahagian itu.

## Nombor WhatsApp dalam `tnc.html`

Halaman TNC menghantar pengesahan ke **011-3144 6591**. Untuk tukar, cari baris
ini dalam `tnc.html`:

```js
const to="601131446591";
```
