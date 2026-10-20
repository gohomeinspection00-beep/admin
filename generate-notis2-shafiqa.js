const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-2/2026/045",
  noRujukanNotis1: "NOTIS-1/2026/045",

  namaPembeli: "NURSHAFIQA BINTI MD YUNUS",
  alamatPengirim: [
    "No. 31, Jalan Silat Cekak 15,",
    "Bandar Selesa Jaya,",
    "81300 Skudai,",
    "Johor.",
  ],
  noKP: "931207-01-6292",
  telefonPembeli: "017-707 1400",
  emailPembeli: "nurshafiqa.yunus@yahoo.com",

  namaPemaju: "PERMAS JAYA SDN. BHD.",
  noSyarikat: "(197301000637 / 14161-T)",
  alamatPenerima: (process.argv[2] === "PERMASMALL") ? [
    "#G-33, Blk A, Permas Mall,",
    "No. 3, Jalan Permas Utara,",
    "Bandar Baru Permas Jaya,",
    "81750 Masai, Johor.",
  ] : [
    "(Management Office)",
    "Apartment Bayu Permas,",
    "Jalan Permas 12/21, Bandar Baru Permas Jaya,",
    "81750 Masai, Johor.",
  ],

  alamatHartanah: "01-03, Blok B, Apartment Bayu Permas, Jalan Permas 12/21, Bandar Baru Permas Jaya, 81750 Masai, Johor",
  jenisHartanah: "Pangsapuri — Parcel B-01-03, Tingkat 1, Blok B",
  namaProyek: "Apartmen Bayu Permas, Mukim Plentong (PTD 250169)",

  noSPA: "835-12/eSPA/230524/B-01-03/01",
  tarikhSPA: "10 Julai 2024",
  jenisSPA: "Jadual H",
  klausaPembaikan: "30(1)",
  klausaSerahan: "32(1)",
  tempohDLP: "24",

  tarikhNotis: "21 Oktober 2026",
  tarikhDeadline: "5 November 2026",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "12", lokasi: "Master Bedroom — Dinding", kecacatan: "Ketidakjajaran ketara pada permukaan dinding masih ada (Visible alignment issue on wall surface, still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "15", lokasi: "Master Bedroom — Dinding", kecacatan: "Bunyi berongga pada dinding bercat masih ada (Hollow sound on painted wall, still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "17", lokasi: "Master Bathroom — Lantai", kecacatan: "Air bertakung pada jubin lantai masih ada (Stagnant water on floor tile, still observed)", status: "Belum Dibaiki" },
    { tag: "20", lokasi: "Master Bathroom — Dinding", kecacatan: "Keretakan pada dinding luar masih ada (Crack on external wall, still observed)", status: "Belum Dibaiki" },
    { tag: "24", lokasi: "Bedroom 2 — Dinding", kecacatan: "Bunyi berongga pada dinding bercat masih ada (Hollowness on painted wall, still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "27", lokasi: "Bedroom 2 — Lantai Kayu", kecacatan: "Lantai kayu tenggelam/mendap masih ada (Sunken timber flooring, still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "34", lokasi: "Bedroom 3 — Lantai Kayu", kecacatan: "Skirting tidak sejajar masih ada (Skirting exhibits an alignment issue, still observed)", status: "Belum Dibaiki" },
    { tag: "40", lokasi: "Balcony — Lantai", kecacatan: "Bunyi berongga pada papak lantai masih ada (Hollowness on floor slab, still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "44", lokasi: "Balcony — Dinding", kecacatan: "Bunyi berongga pada dinding bercat masih ada (Hollow sound on painted wall, still observed)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "10 Julai 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual H (Ruj: 835-12/eSPA/230524/B-01-03/01)" },
    { tarikh: "7 Ogos 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "10 Ogos 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara serahan tangan (hardcopy) di pejabat pengurusan pihak pemaju, beserta kunci unit — merupakan notis bertulis di bawah Klausa 30(1)" },
    { tarikh: "9 September 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum dilaksanakan" },
    { tarikh: "18 September 2026", peristiwa: "Notis Pertama (NOTIS-1/2026/045) dikeluarkan dan diserahkan — DITERIMA dan diakui terima pada hari yang sama oleh Puan Nurdayanee Abdul Hadi (Management) dan En. Azwan bin Azhar, dengan cop rasmi RECEIVED 18 SEP 2026 (rujuk Lampiran A dan B)" },
    { tarikh: "3 Oktober 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari) — pembaikan masih tidak disempurnakan" },
    { tarikh: "12 Oktober 2026", peristiwa: "Pihak pemaju memaklumkan kerja pembaikan telah siap" },
    { tarikh: "14 Oktober 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — SEMBILAN (9) kecacatan masih belum diselesaikan" },
    { tarikh: "21 Oktober 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan — Ruj. NOTIS-2/2026/045" },
    { tarikh: "5 November 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
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

function richNumPara(num, segments) {
  // segments: [{t: "text", b: true/false}] — lays out word by word with mixed bold
  const ni = 10;
  doc.setFontSize(SZ.BODY);
  bk();
  checkBreak(LH + 1);
  doc.setFont("helvetica", "normal");
  doc.text(`${num}.`, mL, y);
  const words = [];
  for (const seg of segments) {
    for (const w of seg.t.split(/\s+/)) {
      if (w) words.push({ w, b: seg.b });
    }
  }
  let x = mL + ni;
  const maxX = mL + cW;
  doc.setFontSize(SZ.BODY);
  for (const { w, b } of words) {
    doc.setFont("helvetica", b ? "bold" : "normal");
    const ww = doc.getTextWidth(w + " ");
    if (x + ww > maxX) {
      y += LH;
      checkBreak(LH + 1);
      x = mL + ni;
    }
    doc.text(w, x, y);
    x += ww;
  }
  y += LH;
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
const perkara1 = "Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan (Final Notice — Defect Rectification Claim)";
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) bertarikh ${data.tarikhSPA} dengan rujukan ${data.noSPA}, merujuk kepada Notis Pertama — Tuntutan Pembetulan Kecacatan (First Notice) dengan rujukan ${data.noRujukanNotis1} bertarikh 18 September 2026, yang telah diserahkan dan DITERIMA serta diakui terima oleh pihak tuan pada hari yang sama — oleh Puan Nurdayanee Abdul Hadi (Management) dan En. Azwan bin Azhar, dengan cop rasmi RECEIVED 18 SEP 2026 (salinan Akuan Terima dilampirkan sebagai LAMPIRAN A dan LAMPIRAN B). Notis Pertama tersebut memberikan tempoh lima belas (15) hari kepada pihak tuan untuk menyiapkan semua kerja pembaikan, iaitu sehingga 3 Oktober 2026.`
);
y += 4;

numPara(2,
  `Namun, tempoh Notis Pertama tersebut telah TAMAT pada 3 Oktober 2026 tanpa semua pembaikan disempurnakan. Walaupun pihak tuan memaklumkan pada 12 Oktober 2026 bahawa kerja pembaikan telah siap, Pemeriksaan Semula (Re-Inspection) yang dijalankan pada 14 Oktober 2026 MENGESAHKAN bahawa SEMBILAN (9) kecacatan masih belum diselesaikan. Ini jelas menunjukkan kegagalan berterusan pihak tuan mematuhi Notis Pertama. Senarai kecacatan tersebut adalah seperti berikut:`
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
const fn = `*Senarai di atas merujuk kepada penemuan Pemeriksaan Semula (Re-Inspection) pada 14 Oktober 2026. Senarai lengkap kecacatan asal terkandung di dalam Laporan Pemeriksaan Kecacatan yang diserahkan pada ${data.tarikhSerahanLaporan} serta Notis Pertama, dan kesemuanya hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus diberikan kepada kluster BUNYI BERONGGA (hollowness) — item No. 15 (dinding Master Bedroom), No. 24 (dinding Bedroom 2), No. 40 (papak lantai Balcony) dan No. 44 (dinding Balcony) — yang masih wujud walaupun telah melalui dua pusingan "pembaikan". Lekatan lepaan/skrid yang tidak sempurna berisiko retak dan tertanggal, dan hendaklah dibaiki dengan kaedah hack dan lepa/skrid semula mengikut amalan pembinaan yang baik, bukan tampalan kosmetik. Item No. 12 — ketidakjajaran ketara pada dinding Master Bedroom — turut masih ada dan hendaklah diperbetulkan mengikut piawaian kerja yang sepatutnya.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada item No. 17 — air bertakung pada jubin lantai Master Bathroom yang masih ada: kecerunan (falls) lantai hendaklah dibetulkan supaya air mengalir sepenuhnya ke arah floor trap, dan bukan sekadar dikeringkan. Item No. 20 — keretakan pada dinding luar Master Bathroom — hendaklah dibaiki dengan sempurna; manakala item No. 27 (lantai kayu tenggelam/mendap di Bedroom 2) dan No. 34 (skirting tidak sejajar di Bedroom 3) memerlukan pembaikan pada ASAS/substrat lantai dan pemasangan semula yang betul, bukan sekadar penggantian permukaan.`
);
y += 4;

numPara(5,
  `Pihak tuan turut diingatkan bahawa Laporan Pemeriksaan Elektrikal (Electrical Inspection Report) bagi unit ini — mengandungi dua belas (12) penemuan serius yang melibatkan KESELAMATAN penghuni — telah dikemukakan secara serahan tangan (hardcopy) pada akhir Ogos 2026, dan kesemua penemuan tersebut hendaklah diselesaikan oleh orang kompeten (competent person) tanpa kelewatan lanjut.`
);
y += 4;

richNumPara(6, [
  { t: "Berikutan kegagalan berterusan pihak tuan, saya telah mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah bagi kerja-kerja pembaikan arkitektural dan paip (plumbing) dengan", b: false },
  { t: "JUMLAH BESAR sebanyak RM17,350.00 (Ringgit Malaysia: Tujuh Belas Ribu Tiga Ratus Lima Puluh Sahaja).", b: true },
  { t: "Untuk makluman, skop sebut harga tersebut", b: false },
  { t: "TIDAK TERMASUK kerja elektrikal:", b: true },
  { t: "beberapa kecacatan berkaitan sistem elektrik yang diperhatikan di dalam unit", b: false },
  { t: "dirujuk kepada pihak tuan selaku pemaju untuk dibaiki terlebih dahulu,", b: true },
  { t: "memandangkan unit masih berada di dalam Tempoh Liabiliti Kecacatan (DLP) dan", b: false },
  { t: "pembaikan tersebut adalah tanggungjawab pihak tuan tanpa sebarang kos kepada pemilik,", b: true },
  { t: "manakala pembaikan oleh pihak ketiga boleh menjejaskan tuntutan waranti.", b: false },
  { t: "Sekiranya pihak tuan enggan atau gagal membaiki kecacatan elektrik tersebut,", b: true },
  { t: "kerja elektrik akan disebut harga secara berasingan dan dilaksanakan oleh pendawai berdaftar Suruhanjaya Tenaga, dan", b: false },
  { t: "keseluruhan kos tersebut, bersama kos sebut harga di atas, akan dituntut sepenuhnya daripada pihak tuan", b: true },
  { t: "termasuk melalui Wang Tahanan 5% di bawah Klausa 30(2) Jadual H dan tuntutan ke TTPR.", b: false },
]);
y += 4;

numPara(7,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period).`
);
y += 4;

numPara(8,
  `Dengan ini, saya mengeluarkan NOTIS KEDUA iaitu NOTIS AKHIR (FINAL NOTICE) kepada pihak tuan bagi menuntut agar SEMUA kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Tarikh tersebut merupakan TARIKH MUKTAMAD, dan tiada sebarang lanjutan masa akan diberikan selepasnya.`
);
y += 4;

numPara(9, "Sekiranya pembaikan masih tidak disempurnakan selepas TARIKH MUKTAMAD tersebut, saya akan, tanpa notis lanjut:");
y += 2;
bullet("Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan, kos pembaikan atau pampasan yang sewajarnya;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah dan menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan lima peratus (5%) (Retention Sum) yang dipegang oleh pemegang amanah (stakeholder), selaras dengan Klausa 30(2) Jadual H Perjanjian Jual Beli;");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
y += 4;

numPara(10,
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

numPara(11,
  `Adalah ditegaskan bahawa ini merupakan NOTIS TERAKHIR yang akan dikeluarkan sebelum tindakan undang-undang diambil. Kegagalan pihak tuan mematuhi notis ini sepenuhnya sebelum atau pada ${data.tarikhDeadline} akan mengakibatkan tuntutan difailkan ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) dan/atau apa-apa remedi lain di bawah Akta 118, tanpa sebarang rujukan lanjut kepada pihak tuan.`
);
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Akhir ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan (Final Notice — Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
// LAMPIRAN A & B — AKUAN TERIMA NOTIS PERTAMA
// ============================================================
const akuanItems = [
  { file: "shafiqa-akuan-1.jpg", t: "LAMPIRAN A", cap: "Akuan Terima Notis Pertama (NOTIS-1/2026/045) bertarikh 18 September 2026 — diterima dan diakui terima oleh Puan Nurdayanee Abdul Hadi (Management) pada 18 September 2026." },
  { file: "shafiqa-akuan-2.jpg", t: "LAMPIRAN B", cap: "Akuan Terima Notis Pertama (NOTIS-1/2026/045) bertarikh 18 September 2026 — diterima dan diakui terima oleh En. Azwan bin Azhar pada 18 September 2026, dengan cop rasmi RECEIVED 18 SEP 2026." },
];
for (const it of akuanItems) {
  newPage();
  y = 25;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
  doc.text(it.t, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(it.t) / 2, y + 1, pageW / 2 + doc.getTextWidth(it.t) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text("Bukti Serahan Notis Pertama (Proof of Service of First Notice)", pageW / 2, y, { align: "center" });
  y += 8;
  const img = "data:image/jpeg;base64," + fs.readFileSync("/home/user/admin/" + it.file).toString("base64");
  const iw = 130; const ih = iw * 1400 / 1050;
  const ix = (pageW - iw) / 2;
  doc.setLineWidth(0.3); doc.setDrawColor(0, 0, 0);
  doc.rect(ix - 1, y - 1, iw + 2, ih + 2);
  doc.addImage(img, "JPEG", ix, y, iw, ih);
  y += ih + 6;
  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
  const cl = doc.splitTextToSize(it.cap, cW - 20);
  for (const c of cl) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.5; }
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
const outName = (process.argv[2] === "PERMASMALL") ? "NOTIS_2_SHAFIQA_PERMASMALL.pdf" : "NOTIS_2_SHAFIQA.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
