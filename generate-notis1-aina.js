const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/042",

  namaPembeli: "AINA SAKINAH BINTI ISHAK",
  alamatPengirim: [
    "No. 3561, Taman Muhibbah,",
    "73200 Gemencheh,",
    "Negeri Sembilan.",
  ],
  noKP: "960807-05-5220",
  telefonPembeli: "019-659 4829",
  emailPembeli: "ainaishak88@yahoo.com",

  namaPemaju: "BINTANG URUSJUTA (M) SDN. BHD.",
  noSyarikat: "(198901013798 / 191108-A)",
  alamatPenerima: [
    "(Sales Gallery) Taman Anjung Gapam,",
    "Persiaran Anjung Gapam 1,",
    "77200 Bemban, Melaka.",
  ],

  alamatHartanah: "No. 10, Jalan Sireh 5, Taman Serambi Gapam, 77200 Bemban, Melaka",
  jenisHartanah: "Rumah Teres 2 Tingkat (Unit T203, PT 15591, H.S.(M) 5439)",
  namaProyek: "Taman Serambi Gapam, Fasa 2 — Mukim Ayer Panas, Jasin, Melaka",

  noSPA: "14677-10/eSPA/100225/PT15591/02",
  tarikhSPA: "10 Februari 2025",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "23 Julai 2026",
  tarikhSerahanLaporan: "28 Julai 2026",
  kaedahSerahanLaporan: "serahan tangan (hardcopy) kepada Sales Gallery pemaju di Taman Anjung Gapam",

  tarikhNotis: "12 September 2026",
  tarikhDeadline: "27 September 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "4", lokasi: "Car Porch — Floor", kecacatan: "Berkulat dan tanda air bertakung di dalam U-drain (Moldy and sign of stagnant water inside U-drain)", status: "Belum Dibaiki" },
    { tag: "5", lokasi: "Car Porch — Floor", kecacatan: "Berkulat dan tanda air bertakung pada papak lantai (Moldy and sign of stagnant water on floor slab)", status: "Belum Dibaiki" },
    { tag: "15", lokasi: "Car Porch — Ceiling", kecacatan: "Kesan air pada permukaan siling (Water mark on ceiling surface)", status: "Belum Dibaiki" },
    { tag: "24", lokasi: "Living Area — Floor", kecacatan: "Besi tetulang (RC bar) terdedah pada rasuk dan jointing antara siling dan rasuk (Exposed RC bar on beam and jointing between ceiling and beam — Major Defect)", status: "Belum Dibaiki" },
    { tag: "29", lokasi: "Living Area — Ceiling", kecacatan: "Kebocoran dan kelembapan tinggi pada siling di dalam ceiling manhole (Leaking and high moisture on ceiling inside ceiling manhole)", status: "Belum Dibaiki" },
    { tag: "37", lokasi: "Living Area — M&E", kecacatan: "Push button RCCB 30 mA tidak berfungsi (Malfunction push button for 30 mA RCCB)", status: "Belum Dibaiki" },
    { tag: "177", lokasi: "Bathroom 2 — Ceiling", kecacatan: "Kebocoran pada siling — kemungkinan daripada paip PVC di dalam siling (Leaking on ceiling, possible from PVC down pipe inside ceiling)", status: "Belum Dibaiki" },
    { tag: "196", lokasi: "Bathroom 3 — Floor", kecacatan: "Air bertakung pada jubin lantai (Stagnant water on floor tiles)", status: "Belum Dibaiki" },
    { tag: "211", lokasi: "Ceiling Area (Bedroom 2) — Wall", kecacatan: "Besi tetulang (RC bar) terdedah pada dinding (Exposed RC bar on wall — Major Defect)", status: "Belum Dibaiki" },
    { tag: "212", lokasi: "Ceiling Area (Bedroom 2) — Wall", kecacatan: "Lubang pada dinding pemisah (Hole on partition wall — Major Defect)", status: "Belum Dibaiki" },
    { tag: "216", lokasi: "Ceiling Area (Family Area) — Wall", kecacatan: "Lubang pada dinding pemisah (Hole on partition wall — Major Defect)", status: "Belum Dibaiki" },
    { tag: "218", lokasi: "Ceiling Area (Bedroom 3) — Wall", kecacatan: "Lubang pada dinding pemisah (Hole on partition wall — Major Defect)", status: "Belum Dibaiki" },
    { tag: "219", lokasi: "Ceiling Area (Bedroom 3) — M&E", kecacatan: "Penutup junction box hilang — wayar terdedah (Missing junction box cover — exposed wire)", status: "Belum Dibaiki" },
    { tag: "221", lokasi: "Water Tank Area — Floor", kecacatan: "Tanda air bertakung pada keseluruhan papak lantai (Sign of stagnant water on all floor slab)", status: "Belum Dibaiki" },
    { tag: "222", lokasi: "Water Tank Area — Floor", kecacatan: "Keretakan pada papak lantai (Cracks on floor slab)", status: "Belum Dibaiki" },
    { tag: "223", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Tiada sokongan yang sempurna pada distribution pipe yang bersambung ke tangki air (Missing proper support for distribution pipe connected to water tank)", status: "Belum Dibaiki" },
    { tag: "226", lokasi: "Metal Roofing Pitch (Car Porch) — Floor", kecacatan: "Keretakan dan lubang pada lantai (Crack and hole on floor)", status: "Belum Dibaiki" },
    { tag: "227", lokasi: "Metal Roofing Pitch (Car Porch) — Roof", kecacatan: "Air bertakung pada metal deck (Water stagnant on metal deck)", status: "Belum Dibaiki" },
    { tag: "229", lokasi: "Metal Roofing Pitch (Car Porch) — Roof", kecacatan: "Kerosakan dan karat pada metal deck (Damaged and rusted on metal deck)", status: "Belum Dibaiki" },
    { tag: "230", lokasi: "Metal Roofing Pitch (Car Porch) — Gutter", kecacatan: "Air bertakung di dalam gutter (Water stagnant inside gutter)", status: "Belum Dibaiki" },
    { tag: "231", lokasi: "Metal Roofing Pitch (Car Porch) — Gutter", kecacatan: "Karat pada gutter (Rusted on gutter)", status: "Belum Dibaiki" },
    { tag: "233", lokasi: "RC Flat Roof — Floor", kecacatan: "Keretakan pada papak lantai — semua kawasan lantai (Crack on floor slab, all floor area)", status: "Belum Dibaiki" },
    { tag: "236", lokasi: "Top Roof (Bedroom 2) — Ceiling", kecacatan: "Celahan pemisahan antara siling dan dinding (Separation gaps between ceiling and wall — Jointing Issue)", status: "Belum Dibaiki" },
    { tag: "237", lokasi: "Top Roof (Bedroom 2) — Roof", kecacatan: "Lubang pada roof flashing (Hole on roof flashing)", status: "Belum Dibaiki" },
    { tag: "238", lokasi: "Top Roof (Bedroom 2) — Roof", kecacatan: "Celahan ketara dan penyendalan tidak sempurna antara roof flashing dan dinding (Visible gaps and improper seal between roof flashing and wall)", status: "Belum Dibaiki" },
    { tag: "239", lokasi: "Top Roof (Bedroom 2) — Roof", kecacatan: "Karat pada skru roof flashing (Rusted on screw for roof flashing)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "10 Februari 2025", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "23 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "28 Julai 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara serahan tangan (hardcopy) kepada Sales Gallery pemaju di Taman Anjung Gapam" },
    { tarikh: "27 Ogos 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum dilaksanakan" },
    { tarikh: "12 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "27 September 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
doc.text(`${data.namaPemaju} ${data.noSyarikat}`, mL, y);
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas, sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} (No. Rujukan SPA: ${data.noSPA}) mengikut ${data.jenisSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`
);
y += 4;

numPara(2,
  `Namun, sehingga tarikh notis ini dikeluarkan dan walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada 27 Ogos 2026, didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum dilaksanakan oleh pihak tuan. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung dalam Laporan Pemeriksaan Kecacatan yang telah diserahkan kepada pihak tuan pada ${data.tarikhSerahanLaporan}.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus diberikan kepada KECACATAN MAJOR yang melibatkan struktur — item No. 24 dan No. 211 (besi tetulang / RC bar terdedah pada rasuk dan dinding) serta item No. 212, No. 216 dan No. 218 (lubang pada dinding pemisah di ruang siling). Besi tetulang yang terdedah akan berkarat dan menjejaskan integriti struktur, manakala lubang pada dinding pemisah menjejaskan fungsi pemisahan antara unit. Pembaikan yang menyeluruh dan mengikut spesifikasi dituntut, bukan sekadar tampalan kosmetik.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada kecacatan yang melibatkan KESELAMATAN dan kebocoran aktif — item No. 37 (push button RCCB 30 mA tidak berfungsi, menjejaskan perlindungan kebocoran arus elektrik), item No. 219 (penutup junction box hilang dengan wayar terdedah), serta item No. 29 dan No. 177 (kebocoran dan kelembapan tinggi pada siling di Living Area dan Bathroom 2). Pembaikan oleh orang kompeten dan pengesanan punca kebocoran dituntut dengan segera.`
);
y += 4;

numPara(5,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period).`
);
y += 4;

numPara(6,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan.`
);
y += 4;

numPara(7, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:");
y += 2;
bullet("Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
bullet("Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.");
y += 4;

numPara(8,
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

numPara(9,
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(46);
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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
fs.writeFileSync("/home/user/admin/NOTIS_1_AINA.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_AINA.pdf");
console.log(`Total pages: ${totalPages}`);
