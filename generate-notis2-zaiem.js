const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukanNotis2: "NOTIS-2/2026/009",
  noRujukanNotis1: "NOTIS-1/2026/009",

  namaPembeli: "MOHAMMAD ZAIEM BIN SUHAIDI",
  alamatPengirim: [
    "No. 46, Jalan Wau Barat 11,",
    "Bandar Layangkasa,",
    "81700 Pasir Gudang,",
    "Johor.",
  ],
  emailPembeli: "zaiemsuhaidi33@gmail.com",
  telefonPembeli: "011-55042545",
  noKP: "000229-03-0903",

  namaPemaju: "PARKLAND CITY SDN BHD",
  noSyarikat: "(1016393-K)",
  alamatPenerima: [
    "Bangunan Parkland Group,",
    "Persiaran Wau Kikik,",
    "Bandar Layangkasa,",
    "81700 Pasir Gudang, Johor.",
  ],
  emailPemaju: "general@parklandgroup.com.my",
  telefonPemaju: "013-6655111",

  alamatHartanah: "No. 46, Jalan Wau Barat 11, Bandar Layangkasa, 81700 Pasir Gudang, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (Terrace House 2 Storey)",

  noRujukanSPA: "13759-31/eSPA/150825/PTD248649/01",
  tarikhSPA: "15 Ogos 2025",
  jenisSPA: "Jadual G",
  klausaSPA: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhSerahanLaporan: "26 April 2026",
  kaedahSerahanLaporan: "penghantaran salinan keras (hardcopy)",

  tarikhPemeriksaanKendiri: "30 Mei 2026",

  tarikhNotis1: "6 Jun 2026",
  tarikhDeadlineNotis1: "21 Jun 2026",
  tempohNotis1: "15",
  kaedahPenghantaranNotis1: "serahan tangan",

  tarikhReInspection: "28 Jun 2026",

  tarikhNotis2: "2 Julai 2026",
  tarikhDeadlineNotis2: "17 Julai 2026",
  tempohNotis2: "15",
  kaedahPenghantaranNotis2: "serahan tangan",

  kecacatan: [
    { tag: "190", lokasi: "Water Tank Area — Wall", kecacatan: "Large damage on wall — still have large opening/damage on wall", status: "Belum Dibaiki" },
    { tag: "193", lokasi: "Water Tank Area — Fixtures", kecacatan: "Water tank should be clean — water inside water tank dirty", status: "Belum Dibaiki" },
    { tag: "196", lokasi: "Top Roof — Roof", kecacatan: "Construction leftover on roof tiles — still have construction left over", status: "Belum Dibaiki" },
    { tag: "199", lokasi: "Ceiling Area (Bedroom 2 & 3) — Wall", kecacatan: "Exposed RC structure on wall — still have exposed RC", status: "Belum Dibaiki" },
    { tag: "200", lokasi: "Ceiling Area (Bedroom 2 & 3) — Wall", kecacatan: "Medium crack on wall — still have medium crack on wall", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "15 Ogos 2025", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "26 April 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju (salinan keras / hardcopy)" },
    { tarikh: "26 Mei 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — tiada tindakan diambil" },
    { tarikh: "30 Mei 2026", peristiwa: "Pemeriksaan kendiri oleh pemilik — kecacatan masih wujud" },
    { tarikh: "6 Jun 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "21 Jun 2026", peristiwa: "Tarikh akhir pembaikan Notis Pertama (15 hari)" },
    { tarikh: "28 Jun 2026", peristiwa: "Pemeriksaan semula (Re-Inspection) dijalankan — kecacatan masih belum dibaiki" },
    { tarikh: "2 Julai 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan" },
    { tarikh: "17 Julai 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
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
  `Merujuk kepada Notis Pertama (First Notice) bertarikh ${data.tarikhNotis1} dengan nombor rujukan ${data.noRujukanNotis1} yang telah dihantar melalui ${data.kaedahPenghantaranNotis1}, pihak tuan telah diberikan tempoh ${data.tempohNotis1} hari sehingga ${data.tarikhDeadlineNotis1} untuk melaksanakan pembaikan kecacatan selaras dengan tanggungjawab pemaju di bawah Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}) dan Seksyen 12(2) Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118].`
);
y += 4;

numPara(2,
  `Namun, hasil daripada pemeriksaan semula (Re-Inspection) pada ${data.tarikhReInspection}, didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum disempurnakan sepenuhnya atau tidak dilakukan langsung. Ini bermakna pihak tuan telah gagal mematuhi Notis Pertama yang dikeluarkan.`
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
fs.writeFileSync("/home/user/admin/NOTIS_2_ZAIEM.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_2_ZAIEM.pdf");
console.log(`Total pages: ${totalPages}`);
