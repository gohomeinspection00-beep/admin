const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/043",

  namaPembeli: "NUR FATIN LIYANA BINTI MARIZAN",
  alamatPengirim: [
    "No. 23, Jalan TU 30,",
    "Taman Tasik Utama,",
    "Ayer Keroh,",
    "75450 Melaka.",
  ],
  noKP: "961006-38-5072",
  telefonPembeli: "013-742 0028",
  emailPembeli: "ftnliyanaa@gmail.com",

  namaPemaju: "METACORP PROPERTIES SDN. BHD.",
  noSyarikat: "(198301002311 / 97547-U)",
  alamatPenerima: [
    "No. 42A, Jalan TU 2,",
    "Taman Tasik Utama,",
    "Ayer Keroh,",
    "75450 Melaka.",
  ],

  alamatHartanah: "No. 53, Jalan TU 13, Taman Tasik Utama, Ayer Keroh, 75450 Melaka",
  jenisHartanah: "Rumah Teres 1 Tingkat (Unit ST-187C, H.S.(M) 7054, PT 26455, Mukim Bukit Katil)",
  namaProyek: "MTD Cinerea Heights, Fasa 23 — Taman Tasik Utama, Ayer Keroh, Melaka",

  noSPA: "SPA MTD Cinerea Heights (Unit ST-187C)",
  tarikhSPA: "6 Mac 2026",
  jenisSPA: "Perjanjian Jual Beli",
  klausaPembaikan: "11.1",
  klausaSerahan: "13.1",
  tempohDLP: "6",

  tarikhPemeriksaan1: "31 Julai 2026",
  tarikhSerahanLaporan: "5 Ogos 2026",
  tarikhTamat30Hari: "4 September 2026",
  tarikhReInspection: "9 September 2026",

  tarikhNotis: "15 September 2026",
  tarikhDeadline: "30 September 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "13", lokasi: "Carporch — M&E", kecacatan: "Wayar Neutral longgar pada meter TNB masih ada (Loose Neutral wire at TNB meter — still observed)", status: "Belum Dibaiki" },
    { tag: "19", lokasi: "Carporch — Wall", kecacatan: "Hollowness pada dinding bercat masih ada (Hollowness on painted wall — still observed)", status: "Belum Dibaiki" },
    { tag: "110", lokasi: "Master Bedroom — Wall", kecacatan: "Bunyi hollow pada dinding bercat masih ada (Hollow sound on painted wall — still observed)", status: "Belum Dibaiki" },
    { tag: "131", lokasi: "Bathroom 1 — Plumbing & Sanitary", kecacatan: "Air masih keluar walaupun tidak flush (Water still come out even not flush — still observed)", status: "Belum Dibaiki" },
    { tag: "187", lokasi: "Ceiling Area (Living & Dining) — Wall", kecacatan: "Dinding bata hilang menyebabkan bukaan masih ada (Missing brick wall causes of opening — still observed)", status: "Belum Dibaiki" },
    { tag: "190", lokasi: "Ceiling Area (Walkway) — Wall", kecacatan: "Besi tetulang (RC) terdedah pada rasuk masih ada (Exposed RC on beam — Major Defect, still observed)", status: "Belum Dibaiki" },
    { tag: "193", lokasi: "Water Tank Area — Floor", kecacatan: "Bunyi hollow dengan keretakan pada hampir keseluruhan permukaan papak masih ada (Hollow sound with crack on most of slab surface — still observed)", status: "Belum Dibaiki" },
    { tag: "197", lokasi: "Metal Deck Area — Roof", kecacatan: "Bukaan besar dan struktur bumbung terdedah (Large opening and exposed roof structure) — perlu semakan sama ada kawasan ini sepatutnya dipasang ceiling board sebagai lapisan perlindungan", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "6 Mac 2026", peristiwa: "Perjanjian Jual Beli (Sale and Purchase Agreement) ditandatangani — MTD Cinerea Heights, Unit ST-187C" },
    { tarikh: "31 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "5 Ogos 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara serahan tangan (hardcopy) kepada pihak penjual/pemaju — merupakan notis bertulis di bawah Klausa 11.1" },
    { tarikh: "4 September 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 11.1 — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "9 September 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — 8 kecacatan masih belum dibaiki / belum disiapkan sepenuhnya" },
    { tarikh: "15 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "30 September 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pembeli unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (Sale and Purchase Agreement) bertarikh ${data.tarikhSPA} yang ditandatangani dengan pihak tuan, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui serahan tangan (hardcopy) pada ${data.tarikhSerahanLaporan}. Laporan tersebut merupakan notis bertulis di bawah Klausa 11.1 (Defect Liability Period) Perjanjian Jual Beli, dan dengan itu pihak tuan diwajibkan membaiki dan memperbetulkan semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
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
  `Perhatian khusus dan SEGERA diberikan kepada item No. 13 — wayar Neutral yang longgar pada meter TNB. Sambungan Neutral yang longgar boleh menyebabkan voltan tidak stabil, kerosakan peralatan elektrik, percikan api dan risiko kebakaran, dan merupakan isu KESELAMATAN yang tidak boleh ditangguhkan. Perhatian turut diberikan kepada item No. 190 — besi tetulang (RC) yang terdedah pada rasuk (kecacatan major) yang akan berkarat dan menjejaskan integriti struktur jika tidak dibaiki dengan sempurna. Pembaikan oleh orang kompeten dituntut dengan segera bagi kedua-dua item ini.`
);
y += 4;

numPara(4,
  `Berhubung item No. 197 — bukaan besar (large opening) dengan struktur bumbung terdedah di Metal Deck Area — pihak tuan dituntut menyemak semula perkara ini: sama ada kawasan tersebut sepatutnya dipasang ceiling board sebagai lapisan perlindungan bagi mengelakkan bukaan tersebut. Sekiranya keadaan sedia ada merupakan reka bentuk asal (original design) yang diluluskan, pihak tuan dituntut mengeluarkan dokumen rasmi (official documentation) sebagai pengesahan bertulis kepada pemilik; sekiranya tidak, pembaikan yang sewajarnya hendaklah dilaksanakan.`
);
y += 4;

numPara(5,
  `Bagi semua kerja pembaikan yang melibatkan kawasan yang sukar diakses oleh pemilik — khususnya Ceiling Area (ruang siling), Water Tank Area dan Top Roof / Metal Deck Area — pihak tuan dituntut mengambil gambar selepas pembaikan (after-repair photos) dan menghantarnya kepada pemilik melalui e-mel (${data.emailPembeli}) atau WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan kerja pembaikan tersebut.`
);
y += 4;

numPara(6,
  `Klausa 11.1 (Defect Liability Period) Perjanjian Jual Beli memperuntukkan bahawa apa-apa kecacatan, pengecutan atau kerosakan lain (any defect, shrinkage or other faults) yang menjadi ketara dalam tempoh enam (6) bulan selepas pembeli mengambil milikan kosong, yang disebabkan oleh mutu kerja atau bahan yang cacat (defective workmanship or materials), hendaklah dibaiki dan diperbetulkan oleh pihak tuan atas kos dan belanja pihak tuan sendiri dalam tempoh tiga puluh (30) hari selepas menerima notis bertulis daripada pembeli. Klausa yang sama turut memperuntukkan bahawa sekiranya pembaikan tidak dilaksanakan, pembeli berhak menuntut daripada pihak tuan kos pembaikan dan pemulihan kecacatan tersebut.`
);
y += 4;


numPara(7,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}, memandangkan tempoh tiga puluh (30) hari di bawah Klausa 11.1 telah pun tamat pada ${data.tarikhTamat30Hari}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari.`
);
y += 4;

numPara(8, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:");
y += 2;
bullet("Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
bullet("Mengambil tindakan selanjutnya termasuk menuntut kos pembaikan daripada pihak tuan sebagaimana diperuntukkan di bawah Klausa 11.1 Perjanjian Jual Beli, dan/atau memfailkan tuntutan di Tribunal Tuntutan Pembeli Rumah (TTPR) atau mahkamah yang berbidang kuasa.");
y += 4;

numPara(9,
  `Merujuk kepada Klausa 13.1 (Notices) di dalam Perjanjian Jual Beli, sebarang notis yang diberikan melalui serahan tangan atau surat berdaftar ke alamat pihak tuan adalah dianggap sah diserahkan (sufficiently served), dan bagi penghantaran melalui pos, dianggap diterima lima (5) hari dari tarikh pengeposan.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const lT = "Peringatan Tindakan Undang-undang (Legal Action Notice)";
doc.text(lT, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(lT), y + 1);
y += 8;

numPara(10,
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan mengambil tindakan undang-undang selanjutnya, termasuk memfailkan tuntutan rasmi di Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) dan/atau mahkamah yang berbidang kuasa, bagi mendapatkan perintah pembaikan, kos pembaikan atau pampasan yang sewajarnya sebagaimana diperuntukkan di bawah Perjanjian Jual Beli dan undang-undang.`
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
fs.writeFileSync("/home/user/admin/NOTIS_1_FATIN.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_FATIN.pdf");
console.log(`Total pages: ${totalPages}`);
