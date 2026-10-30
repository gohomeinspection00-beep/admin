const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/064",

  namaPembeli: "MOHD HAFIZ SAIFUL NIZAM BIN M ROSLI",
  alamatPengirim: [
    "No. 46, Jalan Perjiranan 13/3,",
    "Bandar Dato' Onn,",
    "81100 Johor Bahru,",
    "Johor.",
  ],
  telefonPembeli: "017-737 3410",
  emailPembeli: "hafizsaifulnizam@gmail.com",

  namaPemaju: "JLG LAND BERHAD",
  noSyarikat: "(197201000788 / 12379-K)",
  alamatPenerima: [
    "(dahulu dikenali sebagai Johor Land Berhad)",
    "Level 16, Menara KOMTAR,",
    "80888 Ibrahim International Business District,",
    "Johor, Malaysia.",
    "Tel: 07-290 4284",
  ],

  alamatHartanah: "No. 46, Jalan Perjiranan 13/3, Bandar Dato' Onn, 81100 Johor Bahru, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (Terrace House 2 Storey, Built-up 2,052 kps)",
  namaProyek: "Bandar Dato' Onn, Johor Bahru",

  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "15 September 2026",
  tarikhSerahanLaporan: "22 September 2026",
  tarikhTamat30: "22 Oktober 2026",

  tarikhNotis: "31 Oktober 2026",
  tarikhDeadline: "15 November 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "199", lokasi: "Bathroom 2 — Dinding", kecacatan: "Jubin dinding tidak dipasang penuh hingga paras siling (Wall tiles should be full height to ceiling level) — tidak mengikut spesifikasi kemasan di dalam S&P", status: "Masih Belum Diselesaikan" },
    { tag: "232", lokasi: "Bathroom 3 — Paip & Sanitari", kecacatan: "Sisa binaan di dalam perangkap lantai menjejaskan saliran (Construction debris found inside the floor trap — Poor Drainage System)", status: "Masih Belum Diselesaikan" },
    { tag: "244", lokasi: "Flat Roof 3 (Kiri) — Lantai", kecacatan: "Kesan air bertakung pada permukaan papak (Sign of water stagnant on slab — Alignment Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "257", lokasi: "Top Roof — Bumbung", kecacatan: "Kerosakan pada perabung bumbung (Damage on roof ridge)", status: "Masih Belum Diselesaikan" },
    { tag: "259", lokasi: "Top Roof — Bumbung", kecacatan: "Genting bumbung rosak (Damage on roof tiles)", status: "Masih Belum Diselesaikan" },
    { tag: "260", lokasi: "Top Roof — Bumbung", kecacatan: "Kerosakan pada lapisan membran (Damage on membrane sheet)", status: "Masih Belum Diselesaikan" },
    { tag: "261", lokasi: "Top Roof — Bumbung", kecacatan: "Kedapan tidak sempurna di sekeliling roof flashing (Improper seal around roof flashing — Jointing Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "267", lokasi: "Yard — Paip & Sanitari", kecacatan: "Sisa binaan dan lurang (manhole) tersumbat (Construction leftover and clogged manhole — Poor Drainage System)", status: "Masih Belum Diselesaikan" },
    { tag: "285", lokasi: "Ceiling Area (Family Area) — Siling", kecacatan: "Kesan kulat pada permukaan siling (Fungus mark on ceiling surface)", status: "Masih Belum Diselesaikan" },
    { tag: "293", lokasi: "Water Tank Area", kecacatan: "Tangki air di dalam keadaan kotor — perlu dibersihkan (Water tank need to be clean)", status: "Masih Belum Diselesaikan" },
    { tag: "294", lokasi: "Water Tank Area", kecacatan: "Penutup tangki air tidak tertutup rapat dan sukar ditutup (Water tank not closed fully and hard to close)", status: "Masih Belum Diselesaikan" },
  ],

  kronologi: [
    { tarikh: "15 September 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (Full House Inspection) dijalankan ke atas hartanah" },
    { tarikh: "22 September 2026", peristiwa: "Laporan Pemeriksaan Kecacatan dikemukakan secara rasmi kepada pihak pemaju melalui aplikasi rasmi JLG KITA — merupakan notis bertulis di bawah Klausa 27(1); sebanyak 268 kes kecacatan direkodkan" },
    { tarikh: "2, 8 & 12 Oktober 2026", peristiwa: "Pemilik menghubungi Customer Service pihak pemaju melalui WhatsApp bertanyakan status pembaikan — TIADA sebarang balasan diterima (Lampiran B)" },
    { tarikh: "22 Oktober 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1) — pembaikan masih belum diselesaikan; 268 kes masih berstatus \"In Progress\" di dalam aplikasi JLG KITA (Lampiran A)" },
    { tarikh: "26 Oktober 2026", peristiwa: "Pemilik sekali lagi menghubungi Customer Service melalui WhatsApp (\"Sebulan da ni.. Any progress?\") — masih TIADA balasan" },
    { tarikh: "27 & 30 Oktober 2026", peristiwa: "TIGA (3) kes kecacatan tambahan dilaporkan di dalam aplikasi JLG KITA (Faulty Electrical — Dining Room; Cracked Ceiling — Bedroom 2; Floor — Guest Room)" },
    { tarikh: "31 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "15 November 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Saya, ${data.namaPembeli}, pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) yang ditandatangani dengan pihak tuan, telah menjalankan Pemeriksaan Kecacatan (Full House Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui aplikasi rasmi JLG KITA pihak tuan pada ${data.tarikhSerahanLaporan}, dengan sebanyak 268 kes kecacatan direkodkan. Pengemukaan tersebut merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}, dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
);
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada ${data.tarikhTamat30}, sehingga tarikh notis ini dikeluarkan rekod aplikasi JLG KITA pihak tuan sendiri menunjukkan kesemua DUA RATUS ENAM PULUH LAPAN (268) kes kecacatan tersebut masih berstatus "In Progress" tanpa sebarang kerja pembaikan dijalankan di hartanah saya (Lampiran A). Lebih mendukacitakan, saya telah menghubungi Customer Service pihak tuan melalui WhatsApp secara berulang kali — pada 2 Oktober, 8 Oktober, 12 Oktober dan 26 Oktober 2026 — bertanyakan status dan tarikh mula pembaikan, namun TIADA SATU PUN balasan diterima (Lampiran B). Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
);
y += 5;

checkBreak(45);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan (Antaranya):", mL, y);
y += 6;

const colW = [14, 40, 72, cW - 14 - 40 - 72];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Senarai di atas BUKANLAH senarai penuh — ia hanya sebahagian daripada DUA RATUS ENAM PULUH LAPAN (268) kes kecacatan yang direkodkan di dalam Laporan Pemeriksaan Kecacatan dan aplikasi JLG KITA pihak tuan pada ${data.tarikhSerahanLaporan}, dan KESEMUANYA hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada kluster kecacatan bumbung — item No. 257 (kerosakan perabung), No. 259 (genting rosak), No. 260 (kerosakan lapisan membran) dan No. 261 (kedapan tidak sempurna sekeliling roof flashing). Kecacatan-kecacatan ini menjejaskan integriti keseluruhan sistem bumbung dan mendedahkan ruang dalaman rumah kepada risiko kebocoran air hujan, kerosakan siling dan pertumbuhan kulat — malah kesan kulat TELAH PUN dikesan pada permukaan siling Family Area (item No. 285), yang menunjukkan resapan lembapan sedang berlaku. Genting dan perabung yang rosak WAJIB diganti baharu (bukan ditampal), lapisan membran dan kedapan flashing hendaklah dibaiki mengikut spesifikasi pengilang, dan PUNCA kesan kulat pada siling hendaklah dikesan dan dibaiki — bukan sekadar mengecat semula permukaan.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada kluster saliran dan takungan air — item No. 232 (sisa binaan di dalam perangkap lantai Bathroom 3), No. 267 (sisa binaan dan lurang/manhole tersumbat di Yard) dan No. 244 (kesan air bertakung pada papak Flat Roof 3). Sisa binaan yang menyumbat saliran WAJIB dikeluarkan sepenuhnya dan sistem saliran diuji lancar (flushing test), manakala kecerunan papak yang menyebabkan takungan hendaklah dibetulkan pada puncanya. Bagi tangki air domestik — item No. 293 (tangki kotor) dan No. 294 (penutup tidak tertutup rapat) — ia melibatkan kebersihan dan keselamatan bekalan air minuman keluarga saya; tangki hendaklah dibersihkan sepenuhnya dan penutup dibaiki supaya tertutup rapat bagi mengelakkan pencemaran.`
);
y += 4;

numPara(5,
  `Selain itu, item No. 199 (Bathroom 2) — jubin dinding tidak dipasang penuh hingga paras siling sedangkan spesifikasi kemasan di dalam S&P pihak tuan sendiri menyatakan "Full Height Tile to Ceiling Height". Ini merupakan KETIDAKPATUHAN kepada spesifikasi S&P, dan pihak tuan dituntut menyiapkan pemasangan jubin mengikut spesifikasi tersebut, atau mengemukakan dokumen rasmi (official documentation) yang mengesahkan sebarang perubahan spesifikasi yang didakwa.`
);
y += 4;

numPara(6,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period).`
);
y += 4;

numPara(7,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan.`
);
y += 4;

numPara(8, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:");
y += 2;
bullet("Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
bullet("Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.");
y += 4;

numPara(9,
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

numPara(10,
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(70);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 18;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPembeli})`, mL, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
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

const krColW = [45, cW - 45];
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
// LAMPIRAN A & B
// ============================================================
const lampiran = [
  { file: "hafiz-jlgkita.jpg", w: 590, h: 1280, title: "LAMPIRAN A", sub: "Rekod Aplikasi JLG KITA Pihak Pemaju", cap: "Rekod aplikasi JLG KITA menunjukkan 268 kes kecacatan masih berstatus \"In Progress\" sejak 22 September 2026, serta 3 kes tambahan berstatus \"Lodged\" (27 & 30 Oktober 2026)." },
  { file: "hafiz-wa.jpg", w: 572, h: 1080, title: "LAMPIRAN B", sub: "Rekod WhatsApp Pemilik kepada Customer Service JLAND", cap: "Pemilik menghubungi Customer Service pihak pemaju melalui WhatsApp pada 2, 8, 12 dan 26 Oktober 2026 bertanyakan status pembaikan — tiada sebarang balasan diterima." },
];

for (const L of lampiran) {
  newPage();
  y = 25;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
  doc.text(L.title, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(L.title) / 2, y + 1, pageW / 2 + doc.getTextWidth(L.title) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text(L.sub, pageW / 2, y, { align: "center" });
  y += 8;

  const img = "data:image/jpeg;base64," + fs.readFileSync("/home/user/admin/" + L.file).toString("base64");
  const ih = 180;
  const iw = ih * L.w / L.h;
  const ix = (pageW - iw) / 2;
  doc.setLineWidth(0.3); doc.setDrawColor(0, 0, 0);
  doc.rect(ix - 1, y - 1, iw + 2, ih + 2);
  doc.addImage(img, "JPEG", ix, y, iw, ih);
  y += ih + 6;
  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
  const cl = doc.splitTextToSize(L.cap, cW - 10);
  for (const c of cl) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.3; }
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
fs.writeFileSync("/home/user/admin/NOTIS_1_HAFIZ.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_HAFIZ.pdf");
console.log(`Total pages: ${totalPages}`);
