const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "WARRANTY-1/2026/063",

  namaPembeli: "FADZILAH BINTI AHMAD",
  alamatPengirim: [
    "Lot 1113, Jalan Bunga Kertas,",
    "Kg. Sungai Telor,",
    "81900 Kota Tinggi,",
    "Johor.",
  ],
  noKP: "670920-02-5466",
  telefonPembeli: "011-2406 6216",

  namaKontraktor: "BUMI ALAM SERVICES",
  noSSM: "(201903304910 / JM0920752-V)",
  alamatPenerima: [
    "(Milikan Tunggal — Pemilik: Norhairulizzam bin Abdul Hai)",
    "No. 873, Jalan Merpati 3, Taman Wawasan,",
    "Kelapa Sawit, 81030 Kulai,",
    "Johor.",
  ],

  alamatHartanah: "Rumah kediaman setingkat (3 bilik, 2 bilik air serta anjung, 760 kps) di PTD 1166, HSM 2522, Kampung Sayang, Mukim Sedili Besar, 81960 Kota Tinggi, Johor",

  hargaKontrak: "RM85,480.00",
  rujSebutharga: "2025/12/03234",
  tarikhKontrak: "27 Disember 2025",
  tempohProjek: "15 Januari 2026 hingga 15 Mei 2026",

  kecacatan: [
    { tag: "33", lokasi: "External Area (Kiri) — Siling", kecacatan: "Keretakan pada papan siling (Crack on ceiling board) — KECACATAN MAJOR", },
    { tag: "78", lokasi: "Bathroom 1 — Paip & Sanitari", kecacatan: "Kebocoran pada paip buangan sinki (Leaking on basin down pipe)", },
    { tag: "31", lokasi: "External Area (Kiri) — Dinding", kecacatan: "Kesan air dan bacaan kelembapan tinggi pada dinding luar (water mark and high moisture reading)", },
    { tag: "83", lokasi: "Bedroom 2 — Dinding", kecacatan: "Bacaan kelembapan tinggi dan corak suhu rendah pada dinding (pengimbas haba / thermal scanner)", },
    { tag: "93", lokasi: "Bedroom 3 — Dinding", kecacatan: "Bacaan kelembapan tinggi dan corak suhu rendah pada dinding (pengimbas haba / thermal scanner)", },
    { tag: "35", lokasi: "External Area (Kiri) — M&E", kecacatan: "Kabel pembumian (earth) tidak mematuhi saiz minimum 10mm yang dikehendaki Suruhanjaya Tenaga", },
    { tag: "56", lokasi: "Living Area — M&E", kecacatan: "Kabel water heater hanya 2.5mm — sepatutnya minimum 4mm bagi mematuhi kehendak Suruhanjaya Tenaga", },
    { tag: "79", lokasi: "Bathroom 1 — M&E", kecacatan: "Water heater disambung pada soket 13A — sepatutnya soket 15A sebagaimana sebutharga", },
    { tag: "112", lokasi: "Ceiling Area (Bedroom 1) — M&E", kecacatan: "Conduit fleksibel terlalu pendek menyebabkan wayar terdedah (exposed wire)", },
    { tag: "111", lokasi: "Ceiling Area (Bedroom 1) — Struktur", kecacatan: "Besi tetulang (RC bar) terdedah pada rasuk (Exposed RC bar on beam)", },
    { tag: "63 / 89 / 101", lokasi: "Bedroom 1, 2 & 3 — M&E", kecacatan: "Kipas siling bergegar apabila dihidupkan pada kelajuan tinggi (fan vibrate on high speed) — ketiga-tiga bilik", },
    { tag: "30 / 40 / 58 / 66 / 92", lokasi: "Dinding dalam & luar — pelbagai lokasi", kecacatan: "Keretakan pada dinding bercat (crack on painted wall) secara berulang di dalam dan luar rumah", },
    { tag: "1", lokasi: "Semakan Sebutharga — Tingkap", kecacatan: "Tingkap W1 (900mm x 1200mm) sepatutnya TUJUH (7) unit mengikut sebutharga — hanya ENAM (6) unit dipasang", },
    { tag: "76 / 107", lokasi: "Bathroom 1 & 2 — Pintu", kecacatan: "Sebutharga menyatakan pintu Single PVC Panel (D2) — folding door dipasang sebaliknya", },
    { tag: "52 / 53 / 60 / 85 / 98", lokasi: "Pintu & dinding — pelbagai lokasi", kecacatan: "Kerja mengecat tidak disiapkan (bahagian atas dinding dan pintu tidak dicat sepenuhnya)", },
  ],

  kronologi: [
    { tarikh: "19 Disember 2025", peristiwa: "Sebutharga kerja-kerja membina dan menyiapkan 1 unit rumah dikeluarkan oleh Bumi Alam Services (Ruj: 2025/12/03234) — RM85,480.00" },
    { tarikh: "23 Disember 2025", peristiwa: "Surat Setuju Terima Perlantikan Kontraktor dikeluarkan — termasuk peruntukan \"Serta Pelan lengkap rumah disediakan\"" },
    { tarikh: "27 Disember 2025", peristiwa: "Perjanjian / Surat Perlantikan Kontraktor ditandatangani oleh kedua-dua pihak" },
    { tarikh: "15 Januari — 15 Mei 2026", peristiwa: "Tempoh projek sebagaimana dinyatakan di dalam perjanjian (tempoh kerja 4 bulan dari pembayaran kedua)" },
    { tarikh: "23 Oktober 2026", peristiwa: "Pemeriksaan Kecacatan Profesional (Defect Inspection) dijalankan oleh Building Surveyor berdaftar RISM — SERATUS DUA PULUH TIGA (123) penemuan direkodkan" },
    { tarikh: "Sekitar 25 Oktober 2026", peristiwa: "Aduan bertulis dihantar kepada wakil kontraktor melalui WhatsApp selepas TIGA (3) panggilan telefon tidak berjawab — menyenaraikan kecacatan dan menuntut maklum balas bertulis dalam 3 hari bekerja (Lampiran A-1 & A-2)" },
    { tarikh: "Oktober 2026", peristiwa: "Jawapan bertulis kontraktor melalui WhatsApp — antara lain MENGESAHKAN jaminan (warranty) bermula pada serahan kunci dan BERJANJI menyusun jadual pekerja untuk hadir membuat kerja baik pulih (Lampiran A-3 & A-4)" },
    { tarikh: "(Tarikh notis ini)", peristiwa: "Notis Tuntutan Pembaikan Kecacatan (Warranty Claim) dikeluarkan — tarikh akhir pembaikan 15 hari dari tarikh notis" },
  ],
};

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 25;
const mR = 25;
const cW = pageW - mL - mR;
let y = 0;
let pageNum = 1;

const SZ = { BODY: 12, SMALL: 10, TABLE: 10, FOOTNOTE: 9, FOOTER: 8, TITLE: 12 };
const LH = 6;
const LH_S = 5;

function bk() { doc.setTextColor(0, 0, 0); doc.setDrawColor(0, 0, 0); }
function newPage() { doc.addPage(); pageNum++; y = 25; }
function checkBreak(n = 15) { if (y + n > pageH - 22) { newPage(); return true; } return false; }

function para(text, opts = {}) {
  const { indent = 0, style = "normal", size = SZ.BODY } = opts;
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  bk();
  const lines = doc.splitTextToSize(text, cW - indent);
  for (const line of lines) {
    checkBreak(LH + 1);
    doc.text(line, mL + indent, y);
    y += LH;
  }
}

function numPara(num, text) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(SZ.BODY);
  bk();
  const ni = 10;
  checkBreak(LH + 1);
  doc.text(`${num}.`, mL, y);
  const lines = doc.splitTextToSize(text, cW - ni);
  for (const line of lines) {
    checkBreak(LH + 1);
    doc.text(line, mL + ni, y);
    y += LH;
  }
}

function bullet(text) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(SZ.BODY);
  bk();
  const bi = 14; const ti = bi + 5;
  checkBreak(LH + 1);
  doc.text("•", mL + bi, y);
  const lines = doc.splitTextToSize(text, cW - ti);
  for (const line of lines) { checkBreak(LH + 1); doc.text(line, mL + ti, y); y += LH; }
}

function drawTable(headers, rows, colWidths) {
  const pad = 2.5;
  const rlh = 5;
  const fsz = SZ.TABLE;
  doc.setFontSize(fsz);

  function rowH(cells) {
    let mx = rlh + pad * 2;
    for (let c = 0; c < cells.length; c++) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(fsz);
      const ls = doc.splitTextToSize(String(cells[c]), colWidths[c] - pad * 2);
      const h = ls.length * rlh + pad * 2;
      if (h > mx) mx = h;
    }
    return mx;
  }

  function drawRow(cells, ry, rh, isH) {
    doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fsz); bk();
    let cx = mL;
    for (let c = 0; c < cells.length; c++) {
      doc.setLineWidth(0.3);
      doc.rect(cx, ry, colWidths[c], rh);
      const w = colWidths[c] - pad * 2;
      doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fsz); bk();
      const ls = doc.splitTextToSize(String(cells[c]), w);
      const ty = ry + pad + rlh - 1;
      for (let l = 0; l < ls.length; l++) doc.text(ls[l], cx + pad, ty + l * rlh);
      cx += colWidths[c];
    }
  }

  const hh = rowH(headers);
  checkBreak(hh + 5);
  drawRow(headers, y, hh, true);
  y += hh;

  for (const row of rows) {
    const rh2 = rowH(row);
    checkBreak(rh2 + 2);
    drawRow(row, y, rh2, false);
    y += rh2;
  }
}

// ============================================================
// PAGE 1 — SURAT UTAMA
// ============================================================
y = 25;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text(`PUAN ${data.namaPembeli}`, mL, y);
y += LH;

doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += LH_S;
doc.text(`Tel: ${data.telefonPembeli}`, mL, y); y += LH_S;

y += 3;

doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text(`${data.namaKontraktor} ${data.noSSM}`, mL, y);
y += LH_S;

doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.SMALL);
doc.text(data.alamatPenerima[0], mL, y); y += LH_S;
doc.setFontSize(SZ.BODY);
for (let i = 1; i < data.alamatPenerima.length; i++) { doc.text(data.alamatPenerima[i], mL, y); y += LH_S; }

// Blank date for owner to fill
doc.text("Tarikh: ____________________", pageW - mR, y - LH_S, { align: "right" });

y += 3;

doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukan}   Ruj. Sebutharga: ${data.rujSebutharga}`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkara1 = "Notis Tuntutan Pembaikan Kecacatan dalam Tempoh Jaminan (Warranty / Defect";
const perkara1b = "Rectification Claim)";
const perkara2 = `Hartanah: ${data.alamatHartanah}`;
const perkara3 = `Perjanjian Pembinaan bertarikh ${data.tarikhKontrak} — Harga Kontrak ${data.hargaKontrak}`;
for (const pk of [perkara1, perkara1b, perkara2, perkara3]) {
  const ls = doc.splitTextToSize(pk, cW);
  for (const l of ls) {
    doc.text(l, mL, y);
    doc.setLineWidth(0.3);
    doc.line(mL, y + 1, mL + doc.getTextWidth(l), y + 1);
    y += LH;
  }
}
y += 6;

doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
para(
  `Saya, PUAN ${data.namaPembeli} (No. K/P: ${data.noKP}), tuan punya tanah dan rumah di alamat di atas, merujuk kepada perjanjian membina dan menyiapkan 1 unit rumah kediaman setingkat yang ditandatangani di antara saya dengan pihak tuan pada ${data.tarikhKontrak} (Surat Setuju Terima Perlantikan Kontraktor dan Sebutharga Rujukan ${data.rujSebutharga}) dengan harga kontrak ${data.hargaKontrak}, dan tempoh projek ${data.tempohProjek}. Kesemua bayaran telah dijelaskan mengikut pecahan proses pembayaran yang dipersetujui.`
);
y += 4;

numPara(2,
  `Terma dan Syarat No. 4 perjanjian tersebut memperuntukkan bahawa pihak tuan "akan memberi jaminan sekiranya berlaku kerosakan selama 3 HINGGA 6 BULAN dari tarikh akhir serahan tapak". Melalui jawapan bertulis pihak tuan sendiri di WhatsApp, pihak tuan turut MENGESAHKAN bahawa "pengesahan warranty bermula pada serahan kunci" dan BERJANJI untuk "menyusun jadual pekerja" bagi hadir membuat kerja baik pulih. Kecacatan-kecacatan di dalam notis ini dilaporkan di dalam tempoh jaminan tersebut, dan dengan ini dituntut secara rasmi.`
);
y += 4;

numPara(3,
  `Sebelum notis ini, saya telah menghubungi wakil pihak tuan sebanyak TIGA (3) kali melalui panggilan telefon tanpa berjawab, dan seterusnya mengemukakan aduan bertulis melalui WhatsApp sekitar 25 Oktober 2026 (salinan dilampirkan sebagai LAMPIRAN A). Bagi mengesahkan keadaan sebenar rumah tersebut, satu Pemeriksaan Kecacatan Profesional (Defect Inspection) telah dijalankan pada 23 Oktober 2026 oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM), dan sebanyak SERATUS DUA PULUH TIGA (123) penemuan telah direkodkan di dalam Laporan Pemeriksaan Kecacatan (disertakan bersama notis ini). Antara kecacatan yang paling ketara adalah seperti berikut:`
);
y += 5;

checkBreak(45);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan Utama (Antaranya):", mL, y);
y += 6;

const colW = [22, 42, cW - 22 - 42];
drawTable(
  ["No. Tag", "Lokasi", "Kecacatan (Defect)"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Senarai di atas BUKANLAH senarai penuh — ia hanya sebahagian daripada SERATUS DUA PULUH TIGA (123) penemuan yang direkodkan di dalam Laporan Pemeriksaan Kecacatan bertarikh 23 Oktober 2026 yang disertakan bersama notis ini, dan KESEMUA penemuan di dalam laporan tersebut hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(4,
  `Perhatian khusus dan SEGERA diberikan kepada kluster kecacatan elektrik — item No. 35 (kabel pembumian tidak mematuhi saiz minimum 10mm kehendak Suruhanjaya Tenaga), No. 56 (kabel water heater 2.5mm sedangkan minimum 4mm), No. 79 (water heater pada soket 13A sedangkan sebutharga sendiri menyatakan Plug 15 AMP untuk air cond/heater) dan No. 112 (wayar terdedah akibat conduit terlalu pendek). Ketidakpatuhan ini mendedahkan penghuni kepada risiko kejutan elektrik dan kebakaran, dan menjelaskan aduan bekalan elektrik yang lemah. Semua pembaikan elektrik hendaklah dilaksanakan oleh orang kompeten elektrik dan dibuktikan mematuhi kehendak Suruhanjaya Tenaga.`
);
y += 4;

numPara(5,
  `Perhatian turut diberikan kepada kecacatan kebocoran dan kelembapan — item No. 78 (kebocoran pada paip buangan sinki Bathroom 1), No. 31, No. 83 dan No. 93 (bacaan kelembapan tinggi pada dinding yang disahkan menggunakan moisture meter dan pengimbas haba/thermal scanner, di dinding luar, Bedroom 2 dan Bedroom 3). Pihak tuan dituntut MENGESAN DAN MEMBAIKI PUNCA kebocoran dan resapan lembapan tersebut — bukan sekadar pembaikan kosmetik ke atas kesan pada permukaan — memandangkan kebocoran yang dibiarkan akan merosakkan kemasan, mengundang kulat dan menjejaskan pendawaian.`
);
y += 4;

numPara(6,
  `Bagi kecacatan major dan struktur — item No. 33 (keretakan pada papan siling, kecacatan major), No. 111 (besi tetulang terdedah pada rasuk) serta keretakan dinding yang berulang di dalam dan luar rumah (item No. 30, 40, 58, 66 dan 92) — pihak tuan dituntut mengemukakan PENJELASAN BERTULIS tentang punca keretakan memandangkan rumah baru sahaja disiapkan, dan membaikinya mengikut amalan pembinaan yang baik. Besi tetulang yang terdedah hendaklah dirawat dan ditutup dengan sempurna bagi mengelakkan kakisan.`
);
y += 4;

numPara(7,
  `Selain itu, pemeriksaan turut mengesahkan KETIDAKPATUHAN kepada sebutharga pihak tuan sendiri: item No. 1 (tingkap W1 sepatutnya TUJUH (7) unit — hanya ENAM (6) dipasang) dan item No. 76 / 107 (pintu bilik air sepatutnya Single PVC Panel (D2) — folding door dipasang sebaliknya), di samping kerja mengecat yang tidak disiapkan (item No. 52, 53, 60, 85 dan 98). Pihak tuan dituntut memasang dan menyiapkan mengikut spesifikasi sebutharga, atau mengemukakan pelarasan harga secara bertulis bagi setiap item yang tidak dibekalkan mengikut spesifikasi.`
);
y += 4;

numPara(8,
  `Dengan ini, saya menuntut agar pihak tuan: (a) mengemukakan JADUAL KERJA PEMBAIKAN BERTULIS (tarikh mula, tarikh siap dan skop setiap item) dalam tempoh TUJUH (7) hari dari tarikh notis ini — selaras dengan janji pihak tuan sendiri untuk menyusun jadual pekerja; dan (b) menyiapkan SEMUA kerja pembaikan dan kerja yang belum disiapkan dalam tempoh LIMA BELAS (15) hari dari tarikh notis ini, atas kos dan belanja pihak tuan sepenuhnya.`
);
y += 4;

numPara(9, "Pihak tuan turut dituntut mengemukakan dokumen rasmi (official documentation) berikut bersama maklum balas bertulis:");
y += 2;
bullet("Pengesahan bertulis TARIKH SERAHAN TAPAK/KUNCI serta tempoh dan tarikh tamat jaminan (warranty) — sebagaimana yang telah dipersetujui oleh pihak tuan di dalam WhatsApp;");
bullet("Status kelulusan pelan dengan pihak berkuasa yang berkaitan secara bertulis — atau pengesahan bertulis di atas kepala surat syarikat, bertandatangan, bahawa tiada kelulusan diperlukan sebagaimana didakwa oleh pihak tuan;");
bullet("Bukti pendaftaran CIDB yang AKTIF sepanjang tempoh pembinaan (rekod perakuan menunjukkan status DORMAN) — kehendak Akta Lembaga Pembangunan Industri Pembinaan Malaysia 1994 (Akta 520); dan");
bullet("Pelan lengkap rumah sebagaimana diperuntukkan di dalam Surat Setuju Terima (\"Serta Pelan lengkap rumah disediakan\") — atau penjelasan bertulis pelan yang dimaksudkan dan telah diserahkan.");
y += 4;

numPara(10,
  `Sekiranya pihak tuan gagal mematuhi tuntutan di atas dalam tempoh yang ditetapkan, saya berhak melantik kontraktor pihak ketiga untuk menyiapkan kerja pembaikan dan MENUNTUT SEMULA KESEMUA KOS tersebut daripada pihak tuan, termasuk sebagai milikan tunggal, daripada pemiliknya secara peribadi. Hak saya untuk menuntut penalti kelewatan sebanyak RM850.00 sebulan di bawah Terma dan Syarat No. 1, tertakluk kepada pengesahan tarikh serahan sebenar, adalah dirizabkan sepenuhnya.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const lT = "Peringatan Tindakan Selanjutnya (Notice of Further Action)";
doc.text(lT, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(lT), y + 1);
y += 8;

numPara(11,
  `Sekiranya tiada maklum balas dan tindakan pembaikan dalam tempoh yang ditetapkan, saya akan, tanpa notis lanjut: (a) mengeluarkan Notis Akhir (Final Notice); (b) mengemukakan aduan rasmi kepada Lembaga Pembangunan Industri Pembinaan Malaysia (CIDB) berhubung kualiti kerja dan status pendaftaran; dan (c) memfailkan tuntutan ke Tribunal Tuntutan Pengguna Malaysia (TTPM) dan/atau mengambil tindakan undang-undang sivil terhadap Bumi Alam Services dan pemiliknya bagi mendapatkan perintah pembaikan, pampasan serta kos.`
);
y += 4;

para("Saya berharap perkara ini dapat diselesaikan secara baik tanpa pertikaian, sebagaimana hasrat saya dari awal. Atas kerjasama dan perhatian pihak tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(70);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 18;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(PUAN ${data.namaPembeli})`, mL, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += 4;
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += 7;

// ============================================================
// KRONOLOGI
// ============================================================
newPage();
y = 30;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const krT = "KRONOLOGI TINDAKAN";
doc.text(krT, pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth(krT) / 2, y + 1, pageW / 2 + doc.getTextWidth(krT) / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("(Chronology of Actions)", pageW / 2, y, { align: "center" });
y += 10;

const krColW = [45, cW - 45];
drawTable(
  ["Tarikh (Date)", "Peristiwa (Event)"],
  data.kronologi.map(k => [k.tarikh, k.peristiwa]),
  krColW
);

// ============================================================
// AKUAN TERIMA x 2
// ============================================================
function drawAkuanTerima(copyLabel) {
  newPage();
  y = 25;

  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.SMALL); bk();
  doc.text(copyLabel, pageW - mR, y, { align: "right" });
  y += 8;

  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
  const t = "AKUAN TERIMA OLEH KONTRAKTOR";
  doc.text(t, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(t) / 2, y + 1, pageW / 2 + doc.getTextWidth(t) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text("(Contractor's Acknowledgement of Receipt)", pageW / 2, y, { align: "center" });
  y += 12;

  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
  const akText = `Dengan ini diakui bahawa ${data.namaKontraktor} ${data.noSSM} telah menerima Notis Tuntutan Pembaikan Kecacatan dalam Tempoh Jaminan (Warranty / Defect Rectification Claim) dengan rujukan ${data.noRujukan}, berserta Laporan Pemeriksaan Kecacatan bertarikh 23 Oktober 2026, daripada PUAN ${data.namaPembeli} berhubung ${data.alamatHartanah}.`;
  const ls = doc.splitTextToSize(akText, cW);
  for (const l of ls) { doc.text(l, mL, y); y += LH; }

  y += 18;
  doc.setFont("helvetica", "bold");
  doc.text("Diterima oleh:", mL, y);
  y += 14;

  const fs2 = mL + 30; const fe = mL + 120;
  for (const f of ["Nama", "Jawatan", "Tarikh"]) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
    doc.text(f, mL, y); doc.text(":", mL + 25, y);
    doc.setLineWidth(0.3); doc.line(fs2, y + 1, fe, y + 1);
    y += 14;
  }

  y += 8;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL);
  doc.text("Cop Syarikat (Company Stamp):", mL, y);
  y += 5;
  doc.setLineWidth(0.3); doc.rect(mL, y, 60, 35);
}

drawAkuanTerima("Salinan Kontraktor (Contractor's Copy)");
drawAkuanTerima("Salinan Pemilik (Owner's Copy)");

// ============================================================
// LAMPIRAN A-1 hingga A-4 — WhatsApp
// ============================================================
const waCaptions = [
  "Lampiran A-1: Tiga (3) panggilan telefon kepada wakil kontraktor tidak berjawab, diikuti aduan bertulis pemilik melalui WhatsApp.",
  "Lampiran A-2: Sambungan aduan bertulis pemilik — senarai kecacatan dan tuntutan maklum balas bertulis dalam 3 hari bekerja.",
  "Lampiran A-3: Jawapan bertulis wakil kontraktor melalui WhatsApp (bahagian pertama).",
  "Lampiran A-4: Jawapan bertulis wakil kontraktor — antara lain mengesahkan warranty bermula pada serahan kunci dan berjanji menyusun jadual pekerja untuk kerja baik pulih.",
];

for (let i = 0; i < 4; i++) {
  newPage();
  y = 25;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
  const lampT = `LAMPIRAN A-${i + 1}`;
  doc.text(lampT, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(lampT) / 2, y + 1, pageW / 2 + doc.getTextWidth(lampT) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text("Rekod Komunikasi WhatsApp antara Pemilik dan Wakil Kontraktor", pageW / 2, y, { align: "center" });
  y += 8;

  const img = "data:image/jpeg;base64," + fs.readFileSync(`/home/user/admin/fadzilah-wa-${i + 1}.jpg`).toString("base64");
  const ih = 185;
  const iw = ih * 540 / 1200;
  const ix = (pageW - iw) / 2;
  doc.setLineWidth(0.3); doc.setDrawColor(0, 0, 0);
  doc.rect(ix - 1, y - 1, iw + 2, ih + 2);
  doc.addImage(img, "JPEG", ix, y, iw, ih);
  y += ih + 6;
  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
  const cl = doc.splitTextToSize(waCaptions[i], cW - 10);
  for (const c of cl) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.3; }
}

// ============================================================
// FOOTER
// ============================================================
const totalPages = pageNum;
for (let p = 1; p <= doc.internal.getNumberOfPages(); p++) {
  doc.setPage(p);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2);
  doc.line(mL, pageH - 18, pageW - mR, pageH - 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.FOOTER); doc.setTextColor(0, 0, 0);
  doc.text(`Ruj: ${data.noRujukan}`, mL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/NOTIS_WARRANTY_FADZILAH.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_WARRANTY_FADZILAH.pdf");
console.log(`Total pages: ${totalPages}`);
