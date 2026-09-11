const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/041",

  namaPembeli: "THAYAANITI A/L RAMAN",
  alamatPengirim: [
    "Pangsapuri Pulai Mutiara 3, 06-17 Blok C,",
    "Jalan Pulai Mutiara 7/12,",
    "Taman Pulai Mutiara,",
    "81300 Johor Bahru, Johor.",
  ],
  noKP: "950124-06-5607",
  telefonPembeli: "010-918 2532",
  emailPembeli: "thaya_2401@yahoo.com",

  namaPemaju: "AVENUE GREEN DEVELOPMENT SDN. BHD.",
  noSyarikat: "(202201000586 / 1446283-D)",
  alamatPenerima: [
    "#01-05, Pangsapuri Seri 18,",
    "Jalan Persiaran Jaya Putra,",
    "Bandar Jaya Putra,",
    "81100 Johor Bahru, Johor.",
  ],

  alamatHartanah: "No. 49, Jalan Impian Indah 2, Taman Impian Indah, 81000 Kulai, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (Terrace House 2 Storey, 22' x 70', PTD 109061, Mukim Senai)",
  namaProyek: "Taman Impian Indah (Serene Ville), Fasa 1",

  noSPA: "30424-1/eSPA/110624/PTD109061/01",
  tarikhSPA: "11 Jun 2024",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "28 Julai 2026",
  tarikhSerahanLaporan: "31 Julai 2026",
  tarikhTamat30Hari: "30 Ogos 2026",
  tarikhReInspection: "8 September 2026",

  tarikhNotis: "11 September 2026",
  tarikhDeadline: "26 September 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "45", lokasi: "Bedroom 1 — Wall", kecacatan: "Hollowness pada dinding masih ada (Hollowness on wall still observed)", status: "Belum Dibaiki" },
    { tag: "71", lokasi: "AC Ledge (Bedroom 3) — Wall", kecacatan: "Hollowness pada dinding bercat masih ada (Hollowness on painted wall still observed)", status: "Belum Dibaiki" },
    { tag: "100", lokasi: "Bedroom 3 — M&E", kecacatan: "Open ground pada soket 13A — sistem pembumian tidak berfungsi (Open ground on socket 13A — Major Defect)", status: "Belum Dibaiki" },
    { tag: "116", lokasi: "Ceiling Area (Family Area) — Fixtures", kecacatan: "Insulation sheet rosak dan pemasangan tidak sempurna (Damaged and improper installation for insulation sheet)", status: "Belum Dibaiki" },
    { tag: "128", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Lengan injap terapung bengkok menyebabkan air terpancut keluar (Bent on floating valve arm still observed)", status: "Belum Dibaiki" },
    { tag: "130", lokasi: "Water Tank Area — Fixtures", kecacatan: "Insulation sheet rosak dan pemasangan tidak sempurna (Damaged and improper installation for insulation sheet)", status: "Belum Dibaiki" },
    { tag: "134", lokasi: "Staircase — Floor", kecacatan: "Hollowness pada jubin lantai dan skirting masih ada (Hollowness on floor tiles and skirting still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "153", lokasi: "Top Roof — Wall", kecacatan: "Keretakan pada dinding masih ada (Crack on wall still observed)", status: "Belum Dibaiki" },
    { tag: "154", lokasi: "Top Roof — Roof", kecacatan: "Kerosakan/keretakan pada genting bumbung (Damaged/crack on roof tiles)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "162", lokasi: "Utility — M&E", kecacatan: "SPD tidak berfungsi (Malfunction Surge Protective Device — Major Defect)", status: "Belum Dibaiki" },
    { tag: "172", lokasi: "Bathroom 3 — Ceiling", kecacatan: "Kebocoran dan kelembapan tinggi pada permukaan siling di dalam ceiling manhole (Leaking and high moisture on ceiling surface inside ceiling manhole)", status: "Belum Dibaiki" },
    { tag: "173", lokasi: "Bathroom 3 — Ceiling", kecacatan: "Kebocoran dan kelembapan tinggi pada permukaan siling di dalam ceiling manhole (Leaking and high moisture on ceiling surface inside ceiling manhole)", status: "Belum Dibaiki" },
    { tag: "200", lokasi: "Living and Dining — Ceiling", kecacatan: "Kebocoran dan kelembapan tinggi pada siling di dalam ceiling manhole (Leaking and high moisture on ceiling inside ceiling manhole)", status: "Belum Dibaiki" },
    { tag: "243", lokasi: "Car Porch — Floor", kecacatan: "Keretakan dan shrinkage cracks pada keseluruhan papak lantai masih ada (Cracks and shrinkage cracks on all floor slab still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "251", lokasi: "Car Porch — Wall", kecacatan: "Hollowness pada dinding bercat masih ada (Hollowness on painted wall still observed)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "11 Jun 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "28 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "31 Julai 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara rasmi kepada pihak pemaju melalui WhatsApp" },
    { tarikh: "30 Ogos 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "8 September 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — 15 kecacatan masih belum dibaiki / belum disiapkan sepenuhnya" },
    { tarikh: "11 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "26 September 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Tel: ${data.telefonPembeli}`, mL, y); y += LH_S;

y += 3;

doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text("PARKLAND GROUP", mL, y);
y += LH_S;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`(bagi pihak ${data.namaPemaju} ${data.noSyarikat})`, mL, y);
y += LH_S;
doc.setFontSize(SZ.BODY);

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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} (No. Rujukan SPA: ${data.noSPA}) mengikut ${data.jenisSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui WhatsApp pada ${data.tarikhSerahanLaporan}. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`
);
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada ${data.tarikhTamat30Hari}, Pemeriksaan Semula (Re-Inspection) yang dijalankan pada ${data.tarikhReInspection} mendapati kecacatan masih belum diselesaikan oleh pihak tuan. Laporan Re-Inspection penuh disertakan bersama-sama notis ini sebagai serahan rasmi. Antara kecacatan yang masih wujud dan belum diselesaikan adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung dalam Laporan Re-Inspection bertarikh ${data.tarikhReInspection} yang disertakan bersama-sama notis ini, serta Laporan Pemeriksaan Kecacatan Kali Pertama yang diserahkan pada ${data.tarikhSerahanLaporan}.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(6); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada kecacatan elektrik yang melibatkan KESELAMATAN — item No. 100 (open ground pada soket 13A, sistem pembumian tidak berfungsi) dan item No. 162 (SPD tidak berfungsi). Kedua-dua kecacatan ini menjadikan sistem perlindungan elektrik rumah tidak berfungsi dengan sempurna dan boleh mendatangkan risiko kejutan elektrik dan kebakaran kepada penghuni. Pembaikan oleh orang kompeten (competent person) dituntut dengan segera.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada isu kebocoran aktif — item No. 172, No. 173 dan No. 200 — di mana kebocoran dan kelembapan tinggi masih dikesan pada siling di dalam ceiling manhole di Bathroom 3 serta ruang Living and Dining. Kebocoran berterusan boleh merosakkan struktur siling, kemasan dan pendawaian elektrik di dalamnya. Pihak tuan dituntut mengesan punca kebocoran dan membaikinya sepenuhnya, bukan sekadar pembaikan kosmetik pada permukaan siling.`
);
y += 4;

numPara(5,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period), dalam masa tiga puluh (30) hari selepas menerima notis bertulis daripada pembeli.`
);
y += 4;


numPara(6,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari.`
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

checkBreak(60);
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

// s.k. (CC)
if (data.salinanKepada.length > 0) {
checkBreak(18);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("s.k. (CC):", mL, y); y += 5;
doc.setFont("helvetica", "normal");
for (const cc of data.salinanKepada) {
  const ccText = `${cc.nama} — ${cc.alamat.join(" ")}`;
  const ccLines = doc.splitTextToSize(ccText, cW - 5);
  for (const l of ccLines) { checkBreak(5); doc.text(l, mL + 5, y); y += 4.5; }
}
}

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
  const akText = `Dengan ini diakui bahawa PARKLAND GROUP, bagi pihak ${data.namaPemaju} ${data.noSyarikat}, telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
fs.writeFileSync("/home/user/admin/NOTIS_1_THAYAANITI.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_THAYAANITI.pdf");
console.log(`Total pages: ${totalPages}`);
