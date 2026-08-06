# GoInspect — Roadmap Pra-Publish (hasil audit menyeluruh)

4 audit mendalam (app teras, sync/kos, admin, PWA/ketahanan) menemui 23 isu. Disusun
berfasa ikut keutamaan: **data-loss & duit dahulu → kualiti → polish → PWA (masa publish)**.
Setiap fasa = siasat-sahkan + edit selamat (tak ganggu happy-path) + verify (node --check +
smoke/logic test) + commit. Boleh berhenti di mana-mana fasa.

Severity: CRITICAL = data hilang / duit / pecah; HIGH = ciri rosak / salah senyap; MED = kes tepi; LOW = kosmetik.

---

## FASA A — Data-loss & hasil duit (buat DAHULU) — 3 isu
Paling penting: ini boleh hilangkan kerja pelanggan berbayar atau bocorkan kuota berbayar.

- **A1 [CRITICAL] Simpan gagal senyap bila storage penuh.** `saveAllSafe` + `newProject`:
  bila localStorage penuh & cleanup tak cukup, ia alert tapi **tak simpan** → kerja hilang
  bila reload. Lebih teruk: `newProject` dah tolak kuota Firestore SEBELUM simpan berjaya →
  kuota hangus untuk projek yang lenyap. *Fix: `saveAllSafe` pulang true/false; tolak kuota
  hanya selepas simpan berjaya; halang kalau gagal.*
- **A2 [HIGH] Import musnahkan Maintenance Plan.** `importJSON` jana semula `_syncId` setiap
  defect TAPI tak petakan semula `maintenancePlan.items[].defectSyncId` → semua item plan
  jadi yatim & hilang dari report. *Fix: peta lama→baru syncId, petakan semula item plan.*
- **A3 [HIGH] "Delete" di History tolak kuota seumur hidup.** Padam-dari-peranti (cloud kekal)
  tapi ia `decrementInspectionCount` → user boleh cipta-padam-cipta untuk pintas had berbayar;
  kuota desync. *Fix: buang panggilan decrement pada laluan padam-peranti ini.*

## FASA B — Kos Firebase (jimat bil) — 2 isu utama + 1 tertunda
Punca bil naik. Fix beberapa baris, tak sentuh logik merge.

- **B1 [CRITICAL-kos] `checkCloudForNewDefects` baca SELURUH koleksi backups setiap kali buka
  History.** 2 query penuh tanpa cache/throttle — pemacu kos #1 (cth ~2,400 baca + ratusan MB
  egress/hari/user). *Fix: throttle 60s + high-water-mark `backupAt`.*
- **B2 [HIGH-kos] `pullFromCloud` tak update `_lastCloudSync` bila cloud lebih baru tapi tiada
  perubahan → baca semula dokumen tiap 30s selamanya.** *Fix: set `_lastCloudSync` tanpa syarat
  selepas merge.*
- **B3 [MED-kos, tertunda] Gambar Storage tak pernah dipadam** → timbun selamanya (kos perlahan
  membesar). *Fix: tindakan "reclaim storage" admin / Cloud Function di luar laluan sync — buat
  kemudian.*
- **+ Budget cap:** awak set sendiri di Google Cloud → Billing → Budgets (cth RM50/bln). 2 minit.

## FASA C — Admin: ketepatan & akses — 6 isu
Admin ada beberapa benda pecah/mengelirukan yang penting sebelum jual.

- **C1 [CRITICAL] Modal "Add User" guna ID bertindih → baca borang salah.** Borang inline &
  modal kongsi ID sama → modal cipta user dengan medan kosong/salah. *Fix: ID unik untuk modal
  / buang satu borang berlebihan.*
- **C2 [CRITICAL] Peranan "Viewer (Read-Only)" tak dikuatkuasakan** — viewer boleh edit/padam/
  freeze user, simpan settings. *Fix: helper `canWrite()` + guard setiap handler menulis.*
- **C3 [HIGH] Borang add-user inline tak tulis `groups`/`featureAccess`** (tak konsisten dgn edit).
- **C4 [HIGH] 4 daripada 16 toggle ciri tak dibaca app** (developerCheck, conditionRating,
  subSaleMode, subSaleOnly) → admin sangka terkunci padahal tak. *Fix: buang/label "belum aktif".*
- **C5 [HIGH] Status assignment tak atomik** → `assignedInspections` & `backups` boleh drift.
  *Fix: batch kedua-dua.*
- **C6 [HIGH] Dua borang setting Track berbeza tulis dokumen sama** → satu boleh tibai nilai
  satu lagi. *Fix: kekal satu, guna merge.*
- **C7 [MED] Carta "activity" dashboard guna `Math.random()`** (data palsu) — buang/label.

## FASA D — Kualiti Report/PDF (hasil yang dijual) — 4 isu
Report ialah deliverable pelanggan; ini buat ia nampak kemas.

- **D1 [HIGH] Baris defect bergambar banyak melimpah keluar halaman PDF** (terpotong / terhimpit).
  *Fix: pecah gambar ke beberapa baris / pecah imej halaman terlalu tinggi.*
- **D2 [MED] Risiko infinite-loop** dalam `mkListChunk` bila satu baris ringkasan lebih tinggi
  dari halaman → report tergantung. *Fix: paksa maju `nextStart = start+1`.*
- **D3 [MED] `ensureFits`** biar satu nod terlalu tinggi melimpah. *Fix: pecah perenggan.*
- **D4 [LOW] Restore imej Direct-PDF** patut dalam `finally`.

## FASA E — Ketahanan & polish — 7 isu
Buat app rasa "siap dijual".

- **E1 [HIGH] Tiada pengendali ralat global** → ralat tak ditangkap = skrin putih masa inspection,
  user tak tahu data selamat ke tak. *Fix: `window.onerror`+`unhandledrejection` → toast "ada ralat,
  kerja disimpan lokal".*
- **E2 [HIGH] Skrip CDN tiada pengendalian gagal** (Firebase/jspdf) → kalau gagal muat, app mati
  senyap. *Fix: mesej jelas + (digabung dengan SW Fasa F yang cache skrip).* 
- **E3 [MED] Mesej ralat mentah** (`error.message`/"permission denied") dipapar ke user. *Fix:
  ayat mesra, simpan teknikal di console.*
- **E4 [MED] Bunyi 404 console:** skrip Cloudflare `email-decode.min.js` (admin, 2x), + meta usang.
  *Fix: buang.*
- **E5 [MED] `appLinks` & app URL guna domain `netlify.app` staging + ada ruang dalam URL.** Perlu
  **input awak**: domain produksi sebenar. *Fix: tetapkan domain berjenama + seed `appConfig.appUrl`.*
- **E6 [MED] Admin kemas-kemas:** padam-user yatimkan backups/assignments; batch >500 boleh gagal;
  padam tak atomik; `deleteAssignment` rapuh. *Fix: chunk 400, samakan laluan padam.*
- **E7 [MED] App self-heal edge cases:** TDZ `localProject` dalam transaksi; sync ber-queue boleh
  terabai; rujukan aliasing dalam pull. *Fix: tukar guna `project`, jadual drain, deep-copy.*

## FASA F — PWA offline (buat masa nak PUBLISH — terakhir) — 4 fail
Tambah `manifest.webmanifest` + `sw.js` + ikon (192/512) supaya app boleh **load offline** &
boleh "install". SW selamat: HTML network-first (sentiasa dapat versi baru), CDN cache-first,
Firebase/AI network-only, cache berversi (`GOINSPECT_BUILD`) + auto-buang cache lama + toast
"versi baru". Deploy sebagai **folder** (bukan 1 fail). Termasuk strategi anti-"versi-tersangkut".

---

## Cadangan urutan
**A → B → C → D → E → F.** Fasa A & B paling penting (duit & data). F terakhir masa publish.
Setiap fasa diverify & commit berasingan; awak boleh uji antara fasa.


---

## SENARAI SEMAK PRA-PUBLISH (ingatkan owner sebelum deploy/publish akhir)

1. **Obfuscate/minify kod deploy** — bina saluran minify+obfuscate untuk index.html &
   admin_panel.html supaya Inspect/View-Source tidak dedahkan kod sumber boleh-baca
   (perlindungan IP). Versi sumber kekal dalam repo; hanya salinan deploy diserabutkan.
   Uji headless penuh sebelum guna. (Diminta owner: buat BILA nak publish, bukan sekarang.)
2. **Fasa F — PWA offline** (manifest.webmanifest + sw.js + ikon 192/512, cache berversi
   ikut GOINSPECT_BUILD, HTML network-first) — buang 404 console & boleh guna offline.
3. (Pilihan) Bungkus ke Play Store (TWA/Capacitor) selepas PWA siap.
4. Budget cap Google Cloud (kalau belum diset).
5. Semak semula Fasa D (report edge cases) & baki isu LOW jika mahu.
