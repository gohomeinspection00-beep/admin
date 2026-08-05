const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/021",

  namaPembeli: "NUR ATHIRAH BINTI MOHD SA'AT",
  alamatPengirim: [
    "No. 146, Persisiran Perling 1,",
    "Taman Perling,",
    "81200 Johor Bahru,",
    "Johor.",
  ],
  noKP: "921005-01-6594",
  telefonPembeli: "012-703 3782",
  emailPembeli: "athirahsaat@gmail.com",

  namaPemaju: "PLENITUDE HILLS SDN. BHD.",
  noSyarikat: "",
  alamatPenerima: [
    "No. 1, Persiaran Impian Utama,",
    "Taman Kota Impian,",
    "81800 Ulu Tiram,",
    "Johor.",
  ],

  alamatHartanah: "No. 17, Jalan Impian 2/5, Taman Kota Impian, 81800 Ulu Tiram, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (Unit PTD44839)",
  namaProyek: "Taman Kota Impian, Ulu Tiram",

  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "9 Mei 2026",
  tarikhPemeriksaan2: "28 Julai 2026",
  tarikhSerahanLaporan: "15 Mei 2026",
  kaedahSerahanLaporan: "Aplikasi Marvis",
  noDefectForm: "PTD44839-DF-1",

  tarikhNotis: "5 Ogos 2026",
  tarikhDeadline: "20 Ogos 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "31", lokasi: "External Area — Floor", kecacatan: "Jurang pemisah antara dinding dan apron slab (Separating gaps between wall and apron slab) — masih terdapat jurang disebabkan keretakan", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "32", lokasi: "External Area — Wall", kecacatan: "Kesan kotoran, cat tidak rata dan permukaan tidak rata pada dinding bercat — keseluruhan permukaan dinding mempunyai cat yang tidak rata selepas kerja pembaikan", status: "Belum Dibaiki" },
    { tag: "149", lokasi: "Family Area — Ceiling", kecacatan: "Jurang pemisahan antara siling dan dinding bercat (Separation gap between ceiling and painted wall) — masih ada", status: "Belum Dibaiki" },
    { tag: "249", lokasi: "RC Flat Roof — Floor", kecacatan: "Tanda air bertakung pada papak lantai — masih terdapat masalah leveling dan air bertakung", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "250", lokasi: "RC Flat Roof — Floor", kecacatan: "Air bertakung pada papak lantai — masih terdapat masalah leveling dan air bertakung", status: "Belum Dibaiki" },
    { tag: "266", lokasi: "Top Roof — Roof", kecacatan: "Kerosakan pada genting bumbung (Major defect) — masih terdapat kerosakan (crack) pada genting", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "267", lokasi: "Top Roof — Roof", kecacatan: "Kerosakan pada genting bumbung (Major defect) — masih terdapat kerosakan (crack) pada genting", status: "Belum Dibaiki Sepenuhnya" },
  ],

  kronologi: [
    { tarikh: "9 Mei 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "15 Mei 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju melalui Aplikasi Marvis" },
    { tarikh: "14 Jun 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "Julai 2026", peristiwa: "Pemaju melalui e-mel (The VP Team) mendakwa pembaikan kecacatan unit telah 'successfully completed' (Defect Form No: PTD44839-DF-1) dan meminta pemilik mengambil kunci serta menandatangani pengesahan (sign off) kecacatan" },
    { tarikh: "28 Julai 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) oleh Building Surveyor bertauliah — kecacatan masih belum disiapkan sepenuhnya, bertentangan dengan dakwaan pemaju" },
    { tarikh: "5 Ogos 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "20 Ogos 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
doc.text(data.namaPembeli, mL, y);
y += LH;

doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += LH_S;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Tel: ${data.telefonPembeli}`, mL, y); y += LH_S;

y += 3;

doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text(`${data.namaPemaju}`, mL, y);
y += LH_S;

doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.BODY);
for (const line of data.alamatPenerima) { doc.text(line, mL, y); y += LH_S; }

doc.text(data.tarikhNotis, pageW - mR, y - LH_S, { align: "right" });

y += 3;

doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukan}`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkara1 = "Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim)";
const perkara2 = `Hartanah: ${data.jenisHartanah}`;
const perkara3 = `di ${data.alamatHartanah}`;
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas, sebagaimana termaktub di dalam Perjanjian Jual Beli mengikut ${data.jenisSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`
);
y += 4;

numPara(2,
  `Pihak tuan melalui e-mel (The VP Team) telah memaklumkan bahawa pembaikan kecacatan unit telah 'successfully completed' (Defect Form No: ${data.noDefectForm}) dan meminta saya mengambil kunci serta menandatangani pengesahan (sign off) kecacatan. Walau bagaimanapun, Pemeriksaan Semula (Re-Inspection) oleh Building Surveyor bertauliah pada ${data.tarikhPemeriksaan2} membuktikan bahawa kecacatan masih belum disiapkan sepenuhnya. Dakwaan pembaikan telah siap tersebut adalah salah nyata status pembaikan, dan saya enggan menandatangani sign off sehingga semua kecacatan disempurnakan. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
);
y += 5;

checkBreak(45);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
y += 6;

const colW = [15, 40, 70, cW - 15 - 40 - 70];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung dalam Laporan Re-Inspection bertarikh ${data.tarikhPemeriksaan2} dan Laporan Pemeriksaan Kecacatan Pertama yang telah dihantar melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(6); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period).`
);
y += 4;

numPara(4,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan.`
);
y += 4;

numPara(5, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:");
y += 2;
bullet("Melaksanakan pemeriksaan semula bagi mengesahkan status terkini semua kecacatan;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
bullet("Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.");
y += 4;

numPara(6,
  `Merujuk kepada klausa Service of Documents (Klausa ${data.klausaSerahan} ${data.jenisSPA}) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const lT = "Peringatan Tindakan Undang-undang (Legal Action Notice)";
doc.text(lT, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(lT), y + 1);
y += 8;

numPara(7,
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(50);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 12;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPembeli})`, mL, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += 4;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
  doc.text(`Ruj: ${data.noRujukan}`, mL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/NOTIS_1_ATHIRAH.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_ATHIRAH.pdf");
console.log(`Total pages: ${totalPages}`);
