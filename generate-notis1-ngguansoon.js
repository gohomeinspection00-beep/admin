const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/047",

  namaPembeli: "NG GUAN SOON",
  alamatPengirim: [
    "No. B-200, Aurora Resort,",
    "Jalan Aurora Utama, Aurora Sentral,",
    "79200 Iskandar Puteri,",
    "Johor.",
  ],
  noKP: "K5534717P",
  telefonPembeli: "+65 9237 6382",
  emailPembeli: "ngs216@hotmail.com",

  namaPemaju: "COUNTRY VIEW RESOURCES SDN. BHD.",
  noSyarikat: "(200001021248 / 523855-A)",
  alamatPenerima: (process.argv[2] === "TJB") ? [
    "(Pejabat Berdaftar / Registered Office)",
    "Suite 5.11 & 5.12, 5th Floor, Menara TJB,",
    "Jalan Syed Mohd Mufti,",
    "80000 Johor Bahru, Johor.",
  ] : [
    "Unit 26-01, Mail Box 261, Menara Landmark,",
    "No. 12, Jalan Ngee Heng,",
    "80888 Ibrahim International Business District,",
    "Johor Darul Ta'zim.",
  ],

  alamatHartanah: "No. B-200, Aurora Resort, Jalan Aurora Utama, Aurora Sentral, 79200 Iskandar Puteri, Johor",
  jenisHartanah: "Rumah (Parcel Lot 362, GRN 620694/L362, Lot 210184, Mukim Pulai)",
  namaProyek: "Aurora Resort, Fasa 2 — Aurora Sentral, Iskandar Puteri",

  noSPA: "8428-24/eSPA/241125/362/02",
  tarikhSPA: "12 Januari 2026",
  jenisSPA: "Jadual H",
  klausaPembaikan: "30(1)",
  klausaSerahan: "32(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "24 Julai 2026",
  tarikhSerahanLaporan: "4 Ogos 2026",
  kaedahSerahanLaporan: "Aplikasi CV Connect",

  tarikhNotis: "19 September 2026",
  tarikhDeadline: "4 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "109", lokasi: "Room 4 — Wall", kecacatan: "Kesan kotoran dan cat tidak sekata pada dinding bercat (Stain and uneven painting on painted wall)", status: "Belum Dibaiki" },
    { tag: "110", lokasi: "Room 4 — Wall", kecacatan: "Kemek dan calar pada dinding bercat (Dented and scratch on painted wall)", status: "Belum Dibaiki" },
    { tag: "111", lokasi: "Room 4 — Wall", kecacatan: "Kelembapan tinggi pada dinding (High moisture on wall)", status: "Belum Dibaiki" },
    { tag: "112", lokasi: "Room 4 — Ceiling", kecacatan: "Kesan kotoran dan cat tidak sekata pada siling (Stain and uneven painting on ceiling)", status: "Belum Dibaiki" },
    { tag: "113", lokasi: "Room 4 — Door", kecacatan: "Permukaan kasar pada daun pintu (Rough surface on door leaf)", status: "Belum Dibaiki" },
    { tag: "169", lokasi: "Bedroom 2 — Wall", kecacatan: "Cat tidak sekata dan kesan kotoran pada dinding bercat (Uneven painting and stain on painted wall)", status: "Belum Dibaiki" },
    { tag: "170", lokasi: "Bedroom 2 — Wall", kecacatan: "Kelembapan tinggi pada dinding bercat (High moisture on painted wall)", status: "Belum Dibaiki" },
    { tag: "171", lokasi: "Bedroom 2 — Ceiling", kecacatan: "Permukaan tidak sekata dan kasar pada siling (Uneven surface and rough surface on ceiling)", status: "Belum Dibaiki" },
    { tag: "284", lokasi: "Ceiling Area (Bathroom 4) — Plumbing & Sanitary", kecacatan: "Kebocoran paip (Leaking pipe) — disahkan dengan pengimejan kamera termal", status: "Belum Dibaiki" },
    { tag: "288", lokasi: "Water Tank Area — Floor", kecacatan: "Tanda air bertakung pada papak lantai (Sign of water stagnant on floor slab)", status: "Belum Dibaiki" },
    { tag: "289", lokasi: "Water Tank Area — Floor", kecacatan: "Keretakan pada papak lantai — semua kawasan lantai (Crack on floor slab, all floor area)", status: "Belum Dibaiki" },
    { tag: "290", lokasi: "Water Tank Area — Wall", kecacatan: "Keretakan pada permukaan dinding (Crack on wall surface)", status: "Belum Dibaiki" },
    { tag: "300", lokasi: "RC Flat Roof (Left Side) — Floor", kecacatan: "Tanda air bertakung pada papak lantai (Sign of water stagnant on floor slab)", status: "Belum Dibaiki" },
    { tag: "301", lokasi: "RC Flat Roof (Left Side) — Floor", kecacatan: "Keretakan pada papak lantai — semua kawasan lantai (Crack on floor slab, all floor area)", status: "Belum Dibaiki" },
    { tag: "302", lokasi: "RC Flat Roof (Left Side) — Wall", kecacatan: "Keretakan dan cat mengelupas pada dinding (Crack and peeling paint on wall)", status: "Belum Dibaiki" },
    { tag: "304", lokasi: "RC Flat Roof (Rear) — Floor", kecacatan: "Tanda air bertakung pada papak lantai (Sign of water stagnant on floor slab)", status: "Belum Dibaiki" },
    { tag: "305", lokasi: "RC Flat Roof (Rear) — Floor", kecacatan: "Keretakan pada papak lantai — semua kawasan lantai (Crack on floor slab, all floor area)", status: "Belum Dibaiki" },
    { tag: "306", lokasi: "RC Flat Roof (Rear) — Floor", kecacatan: "Celahan pemisahan antara dinding dan papak lantai (Separation gap between wall and floor slab — Jointing Issue)", status: "Belum Dibaiki" },
    { tag: "307", lokasi: "RC Flat Roof (Rear) — Wall", kecacatan: "Keretakan dan cat mengelupas pada dinding (Crack and peeling paint on wall)", status: "Belum Dibaiki" },
    { tag: "309", lokasi: "Top Roof — Wall", kecacatan: "Keretakan dan cat mengelupas pada dinding — semua permukaan dinding (Crack and peeling paint on wall, all wall surface)", status: "Belum Dibaiki" },
    { tag: "310", lokasi: "Top Roof — Roof", kecacatan: "Skru berkarat pada roof flashing (Rusted screw on roof flashing)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "12 Januari 2026", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual H" },
    { tarikh: "24 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "4 Ogos 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara rasmi kepada pemaju melalui Aplikasi CV Connect" },
    { tarikh: "3 September 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum dilaksanakan" },
    { tarikh: "19 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "4 Oktober 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
doc.text(`No. Pasport: ${data.noKP}`, mL, y); y += LH_S;
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
  `Saya, ${data.namaPembeli} (No. Pasport: ${data.noKP}), pemilik unit hartanah di alamat di atas, sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} (No. Rujukan SPA: ${data.noSPA}) mengikut ${data.jenisSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`
);
y += 4;

numPara(2,
  `Namun, sehingga tarikh notis ini dikeluarkan dan walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada 3 September 2026, didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum dilaksanakan oleh pihak tuan. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
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
  `Perhatian khusus diberikan kepada isu KELEMBAPAN dan KEBOCORAN — item No. 111 dan No. 170 (kelembapan tinggi pada dinding di Room 4 dan Bedroom 2, disahkan dengan bacaan moisture meter) serta item No. 284 (kebocoran paip di ruang siling Bathroom 4, disahkan dengan pengimejan kamera termal). Kelembapan dan kebocoran yang berterusan akan merosakkan kemasan, siling dan struktur unit. Saya menuntut agar pihak tuan mengesan dan membaiki PUNCA kelembapan dan kebocoran tersebut dengan sempurna, dan bukan sekadar kerja kemasan semula pada permukaan.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada keadaan RC Flat Roof (Left Side dan Rear), Water Tank Area dan Top Roof — item No. 288 hingga No. 310 — di mana keretakan pada hampir keseluruhan papak lantai dan dinding, tanda air bertakung, celahan pemisahan antara dinding dan papak, serta cat mengelupas masih wujud secara meluas. Saya menuntut agar pihak tuan menyemak semula kecerunan papak dan sistem kalis air (waterproofing) di kawasan-kawasan tersebut dan melaksanakan pembaikan yang menyeluruh, memandangkan kawasan ini terdedah kepada cuaca dan boleh menyebabkan kebocoran ke dalam unit.`
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
doc.text(`No. Pasport: ${data.noKP}`, mL, y); y += 4;
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
const outName = (process.argv[2] === "TJB") ? "NOTIS_1_NGGUANSOON_TJB.pdf" : "NOTIS_1_NGGUANSOON_LANDMARK.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
