const { jsPDF } = require("jspdf");
const fs = require("fs");

const VERSI = process.argv[2] || "LAYANGKASA";

const ALAMAT = {
  LAYANGKASA: ["Bangunan Parkland Group,", "Persiaran Wau Kikik,", "Bandar Layangkasa,", "81700 Pasir Gudang, Johor."],
  HQ: ["(Parkland Headquarters Office)", "No. 112, Jalan Tun Perak,", "75300 Melaka."],
};

const data = {
  noRujukanNotis2: "NOTIS-2/2026/028",
  noRujukanNotis1: "NOTIS-1/2026/028",

  namaPembeli: "NGU YI KIET",
  alamatPengirim: [
    "No. 30, Jalan Berlian 14,",
    "Taman Cahaya Masai,",
    "81750 Pasir Gudang,",
    "Johor.",
  ],
  emailPembeli: "yikietngu@gmail.com",
  telefonPembeli: "014-916 8526",
  noKP: "950802-08-5106",

  namaPemaju: "PARKLAND CITY SDN. BHD.",
  noSyarikat: "(201201031906 / 1016393-K)",
  alamatPenerima: ALAMAT[VERSI],

  alamatHartanah: "No. 13, Jalan Wau Barat 12, Bandar Layangkasa, 81700 Pasir Gudang, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (20' x 70', 1,400 kaki persegi)",

  noRujukanSPA: "13759-31/eSPA/150724/PTD248616/01",
  tarikhSPA: "15 Julai 2024",
  jenisSPA: "Jadual G",
  klausaSPA: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhSerahanLaporan: "15 Jun 2026",
  kaedahSerahanLaporan: "serahan tangan (hardcopy) kepada pejabat pengurusan (management office)",

  tarikhNotis1: "20 Ogos 2026",
  tarikhDeadlineNotis1: "4 September 2026",
  tempohNotis1: "15",
  kaedahPenghantaranNotis1: "pos daftar (AR Registered)",

  tarikhNotis2: "14 September 2026",
  tarikhDeadlineNotis2: "29 September 2026",
  tempohNotis2: "15",
  kaedahPenghantaranNotis2: "pos daftar (AR Registered)",

  kecacatan: [
    { tag: "233", lokasi: "Ceiling Area (Bedroom 2 & 3) — Wall", kecacatan: "Kecacatan honeycomb dan RC terdedah pada dinding (Honeycomb defect and exposed RC on wall — Major defect)", status: "Belum Dibaiki" },
    { tag: "245", lokasi: "Water Tank Area — Floor", kecacatan: "Kulat dan tanda air bertakung pada papak lantai (Moldy and sign of stagnant water on floor slab)", status: "Belum Dibaiki" },
    { tag: "249", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Sokongan sempurna untuk paip agihan yang disambung ke tangki air tiada (Missing proper support for distribution pipe connected to water tank)", status: "Belum Dibaiki" },
    { tag: "250", lokasi: "Water Tank Area — Fixtures", kecacatan: "Tangki air dalam keadaan kotor dan perlu dibersihkan (Water tank in dirty condition — need to be cleaned)", status: "Belum Dibaiki" },
    { tag: "263", lokasi: "RC Flat Roof — Plumbing & Sanitary", kecacatan: "Sistem saliran tidak sempurna (Poor Drainage System) — sisa binaan di dalam kedua-dua paip saliran (Construction leftover inside both drain pipes)", status: "Belum Dibaiki" },
    { tag: "266", lokasi: "Top Roof — Roof", kecacatan: "Keretakan dan chipping pada genting bumbung (Crack and chipping on roof tiles)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "15 Julai 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "6 Jun 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "15 Jun 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara serahan tangan (hardcopy) kepada pejabat pengurusan pemaju" },
    { tarikh: "15 Julai 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum dilaksanakan" },
    { tarikh: "20 Ogos 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan — Ruj. NOTIS-1/2026/028" },
    { tarikh: "22 Ogos 2026", peristiwa: "Notis Pertama dihantar melalui pos daftar (AR Registered) kepada Ibu Pejabat Melaka (No. RW214685283MY) dan pejabat Bandar Layangkasa" },
    { tarikh: "27 Ogos 2026", peristiwa: "Notis Pertama DITERIMA dan ditandatangani oleh wakil pemaju di kedua-dua alamat — Ibu Pejabat Melaka (Jennifer, cop Pusat Mel Melaka) dan Bandar Layangkasa (Zulaika) — rujuk Lampiran A & B" },
    { tarikh: "4 September 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari) — kecacatan masih belum dibaiki" },
    { tarikh: "14 September 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan" },
    { tarikh: "29 September 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
  ],

  salinanKepada: [],
};


const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 25;
const mR = 25;
const cW = pageW - mL - mR;
let y = 0;
let pageNum = 1;

const SZ = { BODY: 12, SMALL: 10, TABLE: 10, FOOTNOTE: 9, FOOTER: 8, TITLE: 12, CAPTION: 9 };
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
  const fs = SZ.TABLE;
  doc.setFontSize(fs);

  function rowH(cells) {
    let mx = rlh + pad * 2;
    for (let c = 0; c < cells.length; c++) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(fs);
      const ls = doc.splitTextToSize(String(cells[c]), colWidths[c] - pad * 2);
      const h = ls.length * rlh + pad * 2;
      if (h > mx) mx = h;
    }
    return mx;
  }

  function drawRow(cells, ry, rh, isH) {
    doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fs); bk();
    let cx = mL;
    for (let c = 0; c < cells.length; c++) {
      doc.setLineWidth(0.3);
      doc.rect(cx, ry, colWidths[c], rh);
      const w = colWidths[c] - pad * 2;
      doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fs); bk();
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
doc.text(data.namaPembeli, mL, y);
y += LH;

doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Tel: ${data.telefonPembeli}`, mL, y); y += LH_S;

y += 3;

doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text(`${data.namaPemaju} ${data.noSyarikat}`, mL, y);
y += LH_S;

doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.BODY);
for (const line of data.alamatPenerima) { doc.text(line, mL, y); y += LH_S; }

doc.text(data.tarikhNotis2, pageW - mR, y - LH_S, { align: "right" });

y += 3;

doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukanNotis2}`, mL, y);
y += LH_S;
doc.text(`Ruj. Notis Pertama: ${data.noRujukanNotis1}`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkara1 = "Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan";
const perkara2 = "(Final Notice — Defect Rectification Claim)";
const perkara3 = `Hartanah di ${data.alamatHartanah}`;
for (const pk of [perkara1, perkara2, perkara3]) {
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
  `Merujuk kepada Notis Pertama (First Notice) bertarikh ${data.tarikhNotis1} dengan nombor rujukan ${data.noRujukanNotis1} yang telah dihantar melalui ${data.kaedahPenghantaranNotis1}, pihak tuan telah diberikan tempoh ${data.tempohNotis1} hari sehingga ${data.tarikhDeadlineNotis1} untuk melaksanakan pembaikan kecacatan selaras dengan tanggungjawab pemaju di bawah Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}) dan Seksyen 12(2) Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118]. Notis Pertama tersebut telah dihantar melalui pos daftar (AR Registered) pada 22 Ogos 2026 ke kedua-dua alamat pihak tuan, dan telah DITERIMA serta ditandatangani oleh wakil pihak tuan pada 27 Ogos 2026 di Ibu Pejabat Melaka (No. Pos Daftar RW214685283MY, diterima oleh Jennifer dengan cop Pusat Mel Melaka) dan di pejabat Bandar Layangkasa (diterima oleh Zulaika) — salinan Akuan Terima Pos Daftar (AR Card) dilampirkan sebagai Lampiran A dan Lampiran B bersama-sama notis ini.`
);
y += 4;

numPara(2,
  `Namun, sehingga tarikh Notis Kedua ini dikeluarkan, pemantauan berterusan oleh pemilik mendapati bahawa kerja pembaikan terhadap kecacatan yang telah dilaporkan masih belum dilaksanakan atau belum disempurnakan oleh pihak tuan. Ini bermakna pihak tuan telah gagal mematuhi Notis Pertama yang dikeluarkan.`
);
y += 5;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
y += LH_S;
doc.text("(List of Outstanding Defects)", mL, y);
y += 6;

const colW = [15, 40, 55, cW - 15 - 40 - 55];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Senarai lengkap kecacatan adalah sebagaimana dinyatakan di dalam Laporan Pemeriksaan Kecacatan yang telah dihantar melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Dengan ini, saya mengeluarkan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadlineNotis2}. Notis Kedua ini menjadikan keseluruhan tempoh tiga puluh (30) hari telah diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan selaras dengan Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}).`
);
y += 4;

numPara(4,
  `Merujuk kepada Klausa Penyampaian Dokumen ${data.klausaSerahan} (Service of Documents) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const lT = "Peringatan Tindakan Undang-undang (Legal Action Notice)";
doc.text(lT, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(lT), y + 1);
y += 8;

numPara(5,
  `Sekiranya pihak tuan masih gagal mengambil tindakan pembaikan selepas Notis Kedua (Final Notice) ini tamat tempohnya pada ${data.tarikhDeadlineNotis2}, saya akan tanpa berlengah lagi mengambil tindakan berikut:`
);
y += 2;

bullet("Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya;");
bullet("Menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan 5% (Retention Sum 5%) yang sedang dipegang sebagaimana diperuntukkan di bawah Klausa 27(2) Perjanjian Jual Beli (Jadual G);");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera dan muktamad terhadap Notis Kedua ini. Ini merupakan notis akhir sebelum tindakan undang-undang dimulakan. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 10;

doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 20;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPembeli})`, mL, y);
y += 8;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += LH_S;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += 8;

// ============================================================
// KRONOLOGI TINDAKAN
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

const krColW = [40, cW - 40];
drawTable(
  ["Tarikh (Date)", "Peristiwa (Event)"],
  data.kronologi.map(k => [k.tarikh, k.peristiwa]),
  krColW
);

// ============================================================
// LAMPIRAN A & B — BUKTI PENERIMAAN NOTIS 1 (AR CARD)
// ============================================================
function drawLampiran(tajuk, sub, imgPath, cap) {
  newPage();
  y = 25;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
  doc.text(tajuk, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(tajuk) / 2, y + 1, pageW / 2 + doc.getTextWidth(tajuk) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text(sub, pageW / 2, y, { align: "center" });
  y += 8;
  const img = fs.readFileSync(imgPath);
  const b64 = "data:image/jpeg;base64," + img.toString("base64");
  const w = 90, h = 160;
  doc.addImage(b64, "JPEG", (pageW - w) / 2, y, w, h);
  y += h + 6;
  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
  const cl = doc.splitTextToSize(cap, cW - 20);
  for (const c of cl) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.5; }
}

drawLampiran(
  "LAMPIRAN A",
  "Bukti Penerimaan Notis Pertama — Ibu Pejabat Melaka (AR Card)",
  "/home/user/admin/ngu-bukti-ar-hq.jpg",
  "Akuan Terima Pos Daftar (AR Card) No. RW214685283MY — Notis Pertama (Ruj: NOTIS-1/2026/028) dihantar pada 22 Ogos 2026 kepada PARKLAND CITY SDN. BHD. dan DITERIMA serta ditandatangani oleh wakil penerima (Jennifer) dengan cop Pusat Mel Melaka bertarikh 27.08.2026."
);

drawLampiran(
  "LAMPIRAN B",
  "Bukti Penerimaan Notis Pertama — Pejabat Bandar Layangkasa (AR Card)",
  "/home/user/admin/ngu-bukti-ar-layangkasa.jpg",
  "Akuan Terima Pos Daftar (AR Card) — Notis Pertama (Ruj: NOTIS-1/2026/028) DITERIMA serta ditandatangani oleh wakil penerima, Zulaika (No. K/P: 991123-01-5334), pada 27 Ogos 2026."
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
  const t = "AKUAN TERIMA OLEH PEMAJU";
  doc.text(t, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(t) / 2, y + 1, pageW / 2 + doc.getTextWidth(t) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text("(Developer's Acknowledgement of Receipt)", pageW / 2, y, { align: "center" });
  y += 12;

  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan (Final Notice — Defect Rectification Claim) bertarikh ${data.tarikhNotis2} dengan rujukan ${data.noRujukanNotis2} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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

drawAkuanTerima("Salinan Pemaju (Developer's Copy)");
drawAkuanTerima("Salinan Pemilik (Owner's Copy)");

// ============================================================
// FOOTER
// ============================================================
const totalPages = pageNum;
for (let p = 1; p <= doc.internal.getNumberOfPages(); p++) {
  doc.setPage(p);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2);
  doc.line(mL, pageH - 18, pageW - mR, pageH - 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.FOOTER); doc.setTextColor(0, 0, 0);
  doc.text(`Ruj: ${data.noRujukanNotis2}`, mL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

const out = doc.output("arraybuffer");
const outName = VERSI === "HQ" ? "NOTIS_2_NGU_HQ.pdf" : "NOTIS_2_NGU_LAYANGKASA.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
