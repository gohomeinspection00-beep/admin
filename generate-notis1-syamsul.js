const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/052",

  namaPembeli: "SYAMSUL IZWANI BIN A BAKAR",
  alamatPengirim: [
    "No. 44, Jalan Nadi 1/3,",
    "Taman Bukit Senadi,",
    "79100 Iskandar Puteri,",
    "Johor.",
  ],
  noKP: "910119-01-5289",
  telefonPembeli: "013-746 1564",
  emailPembeli: "syamsulizwani318@gmail.com",

  namaPemaju: "BANDAR NUSAJAYA DEVELOPMENT SDN. BHD.",
  noSyarikat: "(199201021441 / 252945-M)",
  alamatPenerima: (process.argv[2] === "KL") ? [
    "(Pejabat Berdaftar / Registered Office)",
    "Level U6, Block C5, Solaris Dutamas,",
    "No. 1, Jalan Dutamas 1,",
    "50480 Kuala Lumpur,",
    "Wilayah Persekutuan Kuala Lumpur.",
  ] : [
    "d/a UEM Sunrise Berhad,",
    "Level 6, Imperia Office Tower,",
    "Jalan Laksamana 1, Puteri Harbour,",
    "79000 Iskandar Puteri,",
    "Johor.",
  ],

  alamatHartanah: "No. 44, Jalan Nadi 1/3, Taman Bukit Senadi, 79100 Iskandar Puteri, Johor (PTD 231596, Mukim Pulai)",
  jenisHartanah: "Rumah Teres 2 Tingkat (Terrace House 2 Storey, 2,222 kaki persegi)",
  namaProyek: "Senadi Hills, Fasa 2B — Iskandar Puteri, Johor",

  noSPA: "14032-6/eSPA/290424/PTD231596/01",
  tarikhSPA: "29 April 2024",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "25 Jun 2026",
  tarikhSerahanLaporan: "3 Julai 2026",
  kaedahSerahanLaporan: "aplikasi QMS — Projects (hub.uemsunrise.com) pihak pemaju",

  tarikhReInspection: "24 September 2026",

  tarikhNotis: "5 Oktober 2026",
  tarikhDeadline: "20 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "9", lokasi: "Car Porch — M&E", kecacatan: "Penutup earth chamber tidak dapat dipasang rata dengan sempurna — masih ada (Earth chamber cover cannot properly flush — Alignment Issue, still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "17", lokasi: "Utility — M&E", kecacatan: "Titik lampu dan titik kipas disambung kepada RCCB 30 mA sedangkan sepatutnya disambung kepada RCCB 100 mA — masih ada (Light point and fan point connected to 30 mA RCCB; should connect to 100 mA RCCB — Standard & Regulation, still observed)", status: "Belum Dibaiki" },
    { tag: "22", lokasi: "Yard — Plumbing & Sanitary", kecacatan: "Tanah merah keluar apabila ujian flushing dilakukan sebanyak 3 kali — masih ada (Red soil come out when flushing test done 3 times — Poor Drainage System, still observed)", status: "Belum Dibaiki" },
    { tag: "35", lokasi: "Family Area — M&E", kecacatan: "Titik lampu dan titik kipas disambung kepada RCCB 30 mA sedangkan sepatutnya disambung kepada RCCB 100 mA — masih ada (Light point and fan point connected to 30 mA RCCB; should connect to 100 mA RCCB — Standard & Regulation, still observed)", status: "Belum Dibaiki" },
    { tag: "47", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Sisa binaan di dalam floor trap masih ada (Construction leftover inside floor trap — Poor Drainage System, still observed)", status: "Belum Dibaiki" },
    { tag: "56", lokasi: "Water Tank Area — Fixtures", kecacatan: "Tangki air dalam keadaan kotor dan perlu dibersihkan — masih ada (Water tank on dirty condition, need to be clean — still observed)", status: "Belum Dibaiki" },
    { tag: "57", lokasi: "RC Flat Roof — Floor", kecacatan: "Air bertakung pada permukaan papak lantai masih ada (Water stagnant on floor slab — Alignment Issue, still observed)", status: "Belum Dibaiki" },
    { tag: "62", lokasi: "Top Roof — Gutter", kecacatan: "Air bertakung di dalam gutter masih ada — bahagian hadapan (Water stagnant on gutter — Alignment Issue, still observed, Front)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "29 April 2024", peristiwa: "Perjanjian Jual Beli (Sale and Purchase Agreement) ditandatangani — Senadi Hills Fasa 2B (Ruj: 14032-6/eSPA/290424/PTD231596/01)" },
    { tarikh: "25 Jun 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "3 Julai 2026", peristiwa: "Laporan Pemeriksaan Kecacatan dikemukakan secara rasmi melalui aplikasi QMS — Projects (hub.uemsunrise.com) pihak pemaju (298 isu direkodkan) — merupakan notis bertulis di bawah Klausa 27(1)" },
    { tarikh: "2 Ogos 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1) — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "24 September 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — 61 kecacatan masih belum diselesaikan (berstatus W.I.P di dalam sistem QMS pihak pemaju sendiri)" },
    { tarikh: "28 September 2026", peristiwa: "Laporan Pemeriksaan Semula dikemukakan melalui aplikasi QMS — Projects (submission kali kedua)" },
    { tarikh: "5 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "20 Oktober 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) bertarikh ${data.tarikhSPA} dengan rujukan ${data.noSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada 2 dan 3 Julai 2026, dengan sejumlah 298 isu direkodkan. Pengemukaan tersebut merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}, dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
);
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada 2 Ogos 2026, Pemeriksaan Semula (Re-Inspection) yang dijalankan pada ${data.tarikhReInspection} mengesahkan bahawa sejumlah ENAM PULUH SATU (61) kecacatan masih belum diselesaikan — status yang turut disahkan oleh sistem QMS pihak tuan sendiri, yang sehingga kini merekodkan 61 isu berstatus "W.I.P" (Work In Progress). Laporan Pemeriksaan Semula telah dikemukakan melalui aplikasi QMS pada 28 September 2026. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Kesemua 61 kecacatan yang masih belum diselesaikan adalah sebagaimana direkodkan di dalam sistem QMS pihak tuan (status W.I.P) serta Laporan Pemeriksaan Semula (Re-Inspection Report) bertarikh ${data.tarikhReInspection} yang telah dikemukakan melalui aplikasi QMS pada 28 September 2026.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada item No. 17 dan No. 35 — titik lampu dan titik kipas di Utility dan Family Area yang disambung kepada litar RCCB 30 mA sedangkan mengikut konfigurasi reka bentuk yang sepatutnya ia disambung kepada litar RCCB 100 mA. Pendawaian litar perlindungan yang tidak mengikut konfigurasi yang betul adalah isu Standard & Regulation yang melibatkan KESELAMATAN elektrik dan pematuhan kepada garis panduan pendawaian semasa. Pembetulan pendawaian oleh orang kompeten (competent person) yang berdaftar dengan Suruhanjaya Tenaga dituntut dengan segera, dan bukti penyiapan hendaklah dikemukakan kepada pemilik.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada item No. 57 dan No. 62 — air bertakung (water ponding) pada permukaan papak RC Flat Roof dan di dalam gutter Top Roof (hadapan). Takungan air yang berterusan menunjukkan kecerunan (falls) permukaan dan saliran yang tidak sempurna; ia akan mempercepatkan kemerosotan lapisan kalis air, mengundang kebocoran ke ruang di bawahnya, dan menjadi tempat pembiakan nyamuk Aedes. Pihak tuan dituntut membetulkan PUNCA — iaitu kecerunan permukaan dan laluan saliran — dan bukan sekadar mengeringkan takungan. Perhatian turut diberikan kepada item No. 22 — tanah merah yang keluar di Yard apabila ujian flushing dilakukan sebanyak TIGA (3) kali, petanda kemasukan tanah ke dalam sistem saliran (contohnya paip pecah/retak atau sambungan tidak kedap di bawah tanah) yang WAJIB disiasat puncanya dan bukan sekadar dibersihkan; item No. 47 — sisa binaan di dalam floor trap Master Bathroom yang menjejaskan sistem saliran dan wajib dikeluarkan sepenuhnya; item No. 9 — penutup earth chamber di Car Porch yang masih tidak rata dan perlu dipasang semula dengan sempurna, serta item No. 56 — tangki air domestik yang masih kotor dan wajib dibersihkan sepenuhnya memandangkan ia membekalkan air untuk kegunaan harian penghuni. Bagi kerja pembaikan di kawasan yang sukar diakses (Top Roof, RC Flat Roof dan Water Tank Area), pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui e-mel (${data.emailPembeli}) atau WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan.`
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
const outName = (process.argv[2] === "KL") ? "NOTIS_1_SYAMSUL_KL.pdf" : "NOTIS_1_SYAMSUL.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
