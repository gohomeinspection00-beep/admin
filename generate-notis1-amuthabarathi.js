const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/055",

  namaPembeli: "AMUTHABARATHI A/L MANOHARAN",
  alamatPengirim: [
    "No. 15, Jalan Austin Duta 5/1,",
    "Taman Austin Duta,",
    "81100 Johor Bahru,",
    "Johor.",
  ],
  noKP: "930210-10-5013",
  telefonPembeli: "019-895 2891",
  emailPembeli: "amuthabarathi93@gmail.com",

  namaPemaju: "IJM PROPERTIES SDN. BHD.",
  noSyarikat: "(100180-M)",
  alamatPenerima: (process.argv[2] === "PJ") ? [
    "(Pejabat Berdaftar / Registered Office)",
    "Tkt. 2, Wisma IJM,",
    "Jalan Yong Shook Lin,",
    "46050 Petaling Jaya,",
    "Selangor.",
  ] : [
    "17th Floor, Unit 17-01, City Plaza,",
    "Jalan Tebrau,",
    "80250 Johor Bahru,",
    "Johor.",
  ],

  alamatHartanah: "No. 15, Jalan Austin Duta 5/1, Taman Austin Duta, 81100 Johor Bahru, Johor (PTD 181815, Mukim Tebrau)",
  jenisHartanah: "Rumah Teres 2 Tingkat (Intermediate Lot, 1,882 kaki persegi)",
  namaProyek: "Austin Duta, Fasa 11A — Johor Bahru",

  noSPA: "8326-20/eSPA/261123/PTD181815/01",
  tarikhSPA: "26 November 2023",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "16 Mei 2026",
  tarikhSerahanLaporan: "20 Mei 2026",
  kaedahSerahanLaporan: "serahan rasmi",

  tarikhReInspection: "1 Oktober 2026",

  tarikhNotis: "9 Oktober 2026",
  tarikhDeadline: "24 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "172", lokasi: "Bedroom 3 — Ceiling", kecacatan: "Keretakan pada permukaan siling masih ada (Crack on ceiling surface still observed)", status: "Belum Dibaiki" },
    { tag: "203", lokasi: "AC Ledge — Floor", kecacatan: "Tanda dan kemungkinan air bertakung pada permukaan papak masih ada (Possible and sign of water stagnant on slab surface still observed)", status: "Belum Dibaiki" },
    { tag: "215", lokasi: "Ceiling Area (Family Area) — Ceiling", kecacatan: "Najis kelawar pada ceiling board masih ada (Bat droppings on ceiling board still observed)", status: "Belum Dibaiki" },
    { tag: "220", lokasi: "Water Tank Area — Floor", kecacatan: "Kulat pada hampir keseluruhan permukaan papak masih ada (Most of slab surface have moldy — still observed)", status: "Belum Dibaiki" },
    { tag: "221", lokasi: "Water Tank Area — Floor", kecacatan: "Tiada angle filler antara papak dan dinding; sebahagian bata terdedah — masih ada (No angle filler between slab and wall; some part have exposed brick — Jointing Issue, still observed)", status: "Belum Dibaiki" },
    { tag: "229", lokasi: "Flat Roof — Floor", kecacatan: "Air bertakung pada papak lantai masih ada (Water stagnant on floor slab still observed)", status: "Belum Dibaiki" },
    { tag: "236", lokasi: "RC Flat Roof 2 (Balcony Awning & Master Bathroom) — Floor", kecacatan: "Air bertakung pada permukaan papak masih ada (Water stagnant on slab surface still observed)", status: "Belum Dibaiki" },
    { tag: "239", lokasi: "RC Flat Roof 3 (Right Area) — Floor", kecacatan: "Kulat dan kemungkinan air bertakung pada papak lantai masih ada (Moldy and possible water stagnant on floor slab still observed)", status: "Belum Dibaiki" },
    { tag: "240", lokasi: "RC Flat Roof 3 (Right Area) — Wall", kecacatan: "Keretakan dan kerosakan pada keseluruhan permukaan dinding masih ada (Crack and damage on wall surface — all wall surface, still observed)", status: "Belum Dibaiki" },
    { tag: "243", lokasi: "Top Roof — Roof", kecacatan: "Keretakan dan chipping pada genting bumbung di pelbagai lokasi masih ada (Crack and chipping on roof tiles still observed)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "26 November 2023", peristiwa: "Perjanjian Jual Beli (Sale and Purchase Agreement) ditandatangani — Austin Duta Fasa 11A (Ruj: 8326-20/eSPA/261123/PTD181815/01)" },
    { tarikh: "16 Mei 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "20 Mei 2026", peristiwa: "Laporan Pemeriksaan Kecacatan dikemukakan secara rasmi kepada pihak pemaju — merupakan notis bertulis di bawah Klausa 27(1)" },
    { tarikh: "19 Jun 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1) — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "1 Oktober 2026", peristiwa: "Pemeriksaan Kedua (Re-Inspection) dijalankan — kecacatan masih belum diselesaikan" },
    { tarikh: "2 Oktober 2026", peristiwa: "Laporan Pemeriksaan Kedua (Re-Inspection Report) dikemukakan secara rasmi kepada pihak pemaju" },
    { tarikh: "9 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "24 Oktober 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pembeli unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) bertarikh ${data.tarikhSPA} dengan rujukan ${data.noSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan pada ${data.tarikhSerahanLaporan}. Pengemukaan tersebut merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}, dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
);
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada 19 Jun 2026 — lebih TIGA (3) BULAN yang lalu — Pemeriksaan Kedua (Re-Inspection) yang dijalankan pada ${data.tarikhReInspection} mengesahkan bahawa kecacatan masih belum diselesaikan oleh pihak tuan. Laporan Pemeriksaan Kedua telah dikemukakan secara rasmi kepada pihak tuan pada 2 Oktober 2026. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung di dalam Laporan Pemeriksaan Kecacatan Kali Pertama yang dikemukakan pada ${data.tarikhSerahanLaporan} dan Laporan Pemeriksaan Kedua (Re-Inspection Report) bertarikh ${data.tarikhReInspection} yang dikemukakan pada 2 Oktober 2026.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus diberikan kepada kluster kecacatan di kawasan bumbung dan papak atas yang kesemuanya masih tidak dibaiki sejak pemeriksaan pertama: air bertakung pada papak di Flat Roof, RC Flat Roof 2 dan AC Ledge (item No. 229, 236 dan 203), kulat yang telah tumbuh pada papak di RC Flat Roof 3 dan Water Tank Area (item No. 239 dan 220) — petanda takungan air dan pendedahan lembapan yang berpanjangan — serta keretakan dan chipping pada genting bumbung di pelbagai lokasi (item No. 243) dan keretakan pada keseluruhan permukaan dinding RC Flat Roof 3 (item No. 240). Kesemua ini mendedahkan rumah kepada risiko kebocoran air hujan dan kerosakan struktur jika dibiarkan. Pihak tuan dituntut membetulkan PUNCA — kecerunan (falls) permukaan papak dan integriti genting/permukaan — dan bukan sekadar pengeringan atau tampalan kosmetik.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada item No. 221 — ketiadaan angle filler antara papak dan dinding di Water Tank Area dengan sebahagian bata terdedah (exposed brick), iaitu kecacatan kemasan dan kekedapan yang membenarkan resapan air dan wajib disiapkan dengan sempurna. Bagi item No. 215 — najis kelawar (bat droppings) pada ceiling board di ruang siling Family Area — pembersihan semata-mata TIDAK memadai: kehadiran najis yang berterusan menunjukkan wujudnya bukaan/laluan haiwan ke dalam ruang siling yang belum ditutup; pihak tuan dituntut mengenal pasti dan MENUTUP laluan tersebut, membersihkan najis sepenuhnya, dan menggantikan ceiling board yang tercemar jika perlu, memandangkan najis kelawar menjejaskan kebersihan dan kesihatan penghuni. Bagi semua kerja pembaikan di kawasan yang sukar diakses (Top Roof, RC Flat Roof, Water Tank Area dan ruang siling), pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui e-mel (${data.emailPembeli}) atau WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan.`
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
const outName = (process.argv[2] === "PJ") ? "NOTIS_1_AMUTHABARATHI_PJ.pdf" : "NOTIS_1_AMUTHABARATHI.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
