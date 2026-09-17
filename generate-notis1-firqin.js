const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/046",

  namaPembeli: "MOHAMAD FIRQIN IZZUDDIN BIN SAAD",
  alamatPengirim: [
    "No. 55, Jalan Uda Utama 5/4,",
    "Bandar Uda Utama,",
    "81300 Skudai,",
    "Johor.",
  ],
  noKP: "941107-01-5005",
  telefonPembeli: "013-391 1302",
  emailPembeli: "",

  namaPemaju: "UDA LAND (SOUTH) SDN. BHD.",
  noSyarikat: "(197501001813 / 23298-K)",
  alamatPenerima: [
    "No. 1, Jalan Padi Mahsuri 12,",
    "Bandar Baru Uda,",
    "81200 Johor Bahru,",
    "Johor.",
  ],

  alamatHartanah: "No. 55, Jalan Uda Utama 5/4, Bandar Uda Utama, 81300 Skudai, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (PTD 217365)",
  namaProyek: "Areca Terrace, Phase 4B",

  noSPA: "",
  tarikhSPA: "",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "24 Mei 2026",
  tarikhSerahanLaporan: "27 dan 28 Mei 2026",
  kaedahSerahanLaporan: "aplikasi ProFix",
  tarikhTamat30Hari: "27 Jun 2026",
  tarikhReInspection: "16 September 2026",

  tarikhNotis: "18 September 2026",
  tarikhDeadline: "3 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "1", lokasi: "Finding — M&E (S&P Review)", kecacatan: "Merujuk Building Specification, Power Point 13A sepatutnya 19 nos/unit tetapi unit ini hanya mempunyai 18 unit soket — perlu semakan semula (Refer to building specification, Power Point 13A should have 19 nos/unit but this unit only has 18 unit socket — need to review)", status: "Belum Diselesaikan" },
    { tag: "2", lokasi: "Finding — M&E (S&P Review)", kecacatan: "Merujuk Building Specification, Light Point sepatutnya 21 nos/unit tetapi unit ini hanya mempunyai 20 nos/unit — perlu semakan semula (Light Point should have 21 nos/unit but this unit only has 20 nos/unit — need to review)", status: "Belum Diselesaikan" },
    { tag: "27", lokasi: "Guest Room — Wall", kecacatan: "Hollowness pada dinding bercat masih ada (Hollowness on painted wall — still observed)", status: "Belum Dibaiki" },
    { tag: "46", lokasi: "Family Area — M&E", kecacatan: "Incoming supply ke Sub DB tidak disambung kepada MCB di Main DB — apabila main switch di Main DB dimatikan, Sub DB masih mempunyai voltan; bercanggah dengan schematic drawing di mana Consumer Unit 2 (Sub DB) sepatutnya disambung ke MCB C40 (As per drawing, incoming supply to Sub DB is not connected to the MCB in the Main DB — when main switch is turned off, Sub DB still has voltage)", status: "Belum Dibaiki" },
    { tag: "70", lokasi: "Bedroom 3 — Wall", kecacatan: "Hollowness pada dinding bercat masih ada (Hollowness on painted wall — still observed)", status: "Belum Dibaiki" },
    { tag: "79", lokasi: "Bathroom 2 — Window", kecacatan: "Celahan ketara sekeliling bingkai tingkap masih ada (Visible gaps around window frame — still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "80", lokasi: "Ceiling Area (Master Bedroom) — Roof", kecacatan: "Kerosakan pada insulation sheet masih ada (Damaged on insulation sheet — Major Defect, still observed)", status: "Belum Dibaiki" },
    { tag: "81", lokasi: "Ceiling Area (Bedroom 2) — Wall", kecacatan: "Honeycomb pada permukaan rasuk masih ada (Honeycomb on beam surface — Major Defect, still observed)", status: "Belum Dibaiki" },
    { tag: "82", lokasi: "Water Tank Area — Floor", kecacatan: "Keretakan pada permukaan papak masih ada (Crack on slab surface — still observed)", status: "Belum Dibaiki" },
    { tag: "83", lokasi: "Water Tank Area — Roof", kecacatan: "Kerosakan pada insulation sheet masih ada (Damaged on insulation sheet — Major Defect, still observed)", status: "Belum Dibaiki" },
    { tag: "84", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Tiada sokongan sempurna pada distribution pipe yang bersambung ke tangki air masih ada (Missing proper support for distribution pipe connected to water tank — still observed)", status: "Belum Dibaiki" },
    { tag: "85", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Discharge pipe untuk platform tangki air yang bersambung ke discharge water tank masih tiada — perlu semakan (Missing discharge pipe for water tank platform — still observed, need to review)", status: "Belum Dibaiki" },
    { tag: "86", lokasi: "RC Flat Roof — Floor", kecacatan: "Air bertakung pada papak lantai masih ada (Stagnant water on floor slab — still observed)", status: "Belum Dibaiki" },
    { tag: "89", lokasi: "Top Roof — Plumbing & Sanitary", kecacatan: "Air bertakung di dalam roof gutter masih ada (Stagnant water in the roof gutter — still observed)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "24 Mei 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "27 Mei 2026", peristiwa: "Laporan Pemeriksaan Kecacatan Batch 1 (167 kecacatan) dihantar melalui aplikasi ProFix" },
    { tarikh: "28 Mei 2026", peristiwa: "Laporan Pemeriksaan Kecacatan Batch 2 (160 kecacatan) dihantar melalui aplikasi ProFix — jumlah keseluruhan 327 kecacatan" },
    { tarikh: "27 Jun 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "16 September 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — 14 kecacatan disahkan masih belum dibaiki / belum diselesaikan" },
    { tarikh: "18 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "3 Oktober 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
  ],

  salinanKepada: [
    {
      nama: "UDA LAND (SOUTH) SDN. BHD. — Ibu Pejabat (SPA)",
      alamat: ["Tingkat 15, Blok Menara, Kompleks Pertama,", "Jalan Tuanku Abdul Rahman,", "50100 Kuala Lumpur."],
    },
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
doc.text(data.namaPembeli, mL, y);
y += LH;

doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += LH_S;
if (data.emailPembeli) { doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S; }
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}, PTD 217365), sebagaimana termaktub di dalam Perjanjian Jual Beli mengikut ${data.jenisSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui aplikasi ProFix dalam dua (2) batch — Batch 1 sebanyak 167 kecacatan pada 27 Mei 2026 dan Batch 2 sebanyak 160 kecacatan pada 28 Mei 2026 — berjumlah 327 kecacatan keseluruhannya. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`
);
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada ${data.tarikhTamat30Hari}, Pemeriksaan Semula (Re-Inspection) yang dijalankan pada ${data.tarikhReInspection} mengesahkan bahawa kecacatan masih belum diselesaikan oleh pihak tuan. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung dalam Laporan Pemeriksaan Kecacatan yang telah diserahkan kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(6); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada item No. 46 — pendawaian Sub DB yang tidak mengikut schematic drawing: apabila main switch di Main DB dimatikan, Sub DB masih mempunyai voltan. Keadaan ini amat MERBAHAYA kerana litar yang disangka telah dimatikan sebenarnya masih hidup, dan boleh mendatangkan risiko kejutan elektrik dan kebakaran kepada penghuni serta mana-mana pihak yang menjalankan kerja penyelenggaraan. Pembetulan pendawaian mengikut schematic drawing oleh orang kompeten (competent person) dituntut dengan segera. Perhatian turut diberikan kepada kecacatan major — item No. 80 dan No. 83 (insulation sheet rosak) serta item No. 81 (honeycomb pada rasuk).`
);
y += 4;

numPara(4,
  `Bagi item No. 1 dan No. 2 (S&P Review), saya meminta pihak tuan mengambil perhatian dan membuat semakan semula (double check): bilangan Power Point 13A yang dipasang (18 unit berbanding 19 unit) dan bilangan Light Point (20 unit berbanding 21 unit) adalah kurang daripada Building Specification di dalam Perjanjian Jual Beli. Sekiranya spesifikasi S&P yang silap, ATAU unit memang dibekalkan sebagaimana yang sedia ada, pihak tuan dituntut memberikan penjelasan rasmi kepada pemilik dan mengeluarkan dokumen rasmi (official documentation) mengenainya; sekiranya tidak, titik-titik yang kurang tersebut hendaklah dipasang dengan sempurna.`
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
if (data.emailPembeli) { doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S; }
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += 7;

// s.k. (CC)
checkBreak(18);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("s.k. (CC):", mL, y); y += 5;
doc.setFont("helvetica", "normal");
for (const cc of data.salinanKepada) {
  const ccText = `${cc.nama} — ${cc.alamat.join(" ")}`;
  const ccLines = doc.splitTextToSize(ccText, cW - 5);
  for (const l of ccLines) { checkBreak(5); doc.text(l, mL + 5, y); y += 4.5; }
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
fs.writeFileSync("/home/user/admin/NOTIS_1_FIRQIN.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_FIRQIN.pdf");
console.log(`Total pages: ${totalPages}`);
