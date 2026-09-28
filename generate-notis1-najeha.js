const { jsPDF } = require("jspdf");
const fs = require("fs");

const VERSI = process.argv[2] || "LAYANGKASA";

const ALAMAT = {
  LAYANGKASA: [
    "Bangunan Parkland Group,",
    "Persiaran Wau Kikik,",
    "Bandar Layangkasa,",
    "81700 Pasir Gudang, Johor.",
  ],
  HQ: [
    "(Parkland Headquarters Office)",
    "No. 112, Jalan Tun Perak,",
    "75300 Melaka.",
  ],
};

const data = {
  noRujukan: "NOTIS-1/2026/050",

  namaPembeli: "NURUL NAJEHA BINTI ROSLI",
  noKP: "960505-01-6146",
  namaPembeli2: "MUHAMMAD ASYRAF BIN ZULKIFLEE",
  noKP2: "960928-01-5479",
  alamatPengirim: [
    "No. 39, Jalan Selasih 1,",
    "Taman Pasir Putih,",
    "81700 Pasir Gudang,",
    "Johor.",
  ],
  telefonPembeli: "013-792 9731",
  emailPembeli: "nurulfawwaz0596@gmail.com",

  namaPemaju: "PARKLAND CITY SDN. BHD.",
  noSyarikat: "(201201031906 / 1016393-K)",
  alamatPenerima: ALAMAT[VERSI],

  alamatHartanah: "No. 33, Jalan Wau Barat 10, Bandar Layangkasa, 81700 Pasir Gudang, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (20' x 70', End Lot, PTD 248754, H.S.(M) 8844, Mukim Plentong)",
  namaProyek: "Bandar Layangkasa, Fasa 5",

  noSPA: "13759-31/eSPA/280725/PTD248754/01",
  tarikhSPA: "28 Julai 2025",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "8 Ogos 2026",
  tarikhSerahanLaporan: "29 Ogos 2026",
  kaedahSerahanLaporan: "serahan tangan (hardcopy) kepada pejabat pengurusan (management office)",
  tarikhTamat30Hari: "28 September 2026",

  tarikhNotis: "29 September 2026",
  tarikhDeadline: "14 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "58", lokasi: "Family Area — M&E", kecacatan: "RCCB rating tidak betul: 0.1A dipasang, 0.03A diperlukan (Incorrect RCCB rating: 0.1A installed, 0.03A required)", status: "Belum Dibaiki" },
    { tag: "59", lokasi: "Family Area — M&E", kecacatan: "RCCB litar kuasa sepatutnya 30mA / 0.03A, bukan 0.1A, mengikut piawaian ST (Power circuit RCCB rating should be 30mA / 0.03A, not 0.1A, as per ST standards — Major Defect)", status: "Belum Dibaiki" },
    { tag: "60", lokasi: "Family Area — M&E", kecacatan: "Litar kuasa sepatutnya menggunakan RCCB 30mA bukan 100mA — rujuk Garis Panduan Suruhanjaya Tenaga (Power circuit should use 30mA RCCB not 100mA RCCB, refer Suruhanjaya Tenaga Guideline)", status: "Belum Dibaiki" },
    { tag: "89", lokasi: "RC Flat Roof — Floor", kecacatan: "Air bertakung pada papak lantai (Water stagnant on floor slab)", status: "Belum Dibaiki" },
    { tag: "97", lokasi: "Top Roof — Roof", kecacatan: "Kerosakan pada genting bumbung (Damage observed on the roof tiles — Major Defect)", status: "Belum Dibaiki" },
    { tag: "143", lokasi: "Bathroom 3 — Ceiling", kecacatan: "Kesan air pada siling (Watermark observed on ceiling)", status: "Belum Dibaiki" },
    { tag: "148", lokasi: "Bathroom 3 — Plumbing & Sanitary", kecacatan: "Kebocoran dari paip besen (Leaking from basin downpipe)", status: "Belum Dibaiki" },
    { tag: "149", lokasi: "Bathroom 3 — Plumbing & Sanitary", kecacatan: "Kebocoran dari hand bidet (Leaking from hand bidet)", status: "Belum Dibaiki" },
    { tag: "150", lokasi: "Bathroom 3 — Plumbing & Sanitary", kecacatan: "Sisa binaan di dalam floor trap — sistem saliran tidak sempurna (Construction debris observed inside floor trap — Poor Drainage System)", status: "Belum Dibaiki" },
    { tag: "160", lokasi: "Yard — Wall", kecacatan: "Keretakan pada dinding di dalam manhole kumbahan (Crack on wall inside sewerage manhole)", status: "Belum Dibaiki" },
    { tag: "164", lokasi: "Yard — Plumbing & Sanitary", kecacatan: "Manhole tersumbat — air bertakung di dalamnya (Clogged inside manhole — Poor Drainage System)", status: "Belum Dibaiki" },
    { tag: "173", lokasi: "Staircase — Floor", kecacatan: "Hollowness dikesan pada skirting lantai tangga (Hollowness detected on the floor skirting)", status: "Belum Dibaiki" },
    { tag: "214", lokasi: "External Area — Wall", kecacatan: "Ketidakjajaran ketara pada kesemua dinding luar (Visible alignment issues observed on all walls)", status: "Belum Dibaiki" },
    { tag: "218", lokasi: "External Area — Wall", kecacatan: "Bunyi hollow pada permukaan dinding (Hollow sound on wall surface)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "28 Julai 2025", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "8 Ogos 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "29 Ogos 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara serahan tangan (hardcopy) kepada pejabat pengurusan pemaju" },
    { tarikh: "28 September 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum dilaksanakan" },
    { tarikh: "29 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "14 Oktober 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
doc.text(`${data.namaPembeli} &`, mL, y); y += LH_S;
doc.text(data.namaPembeli2, mL, y); y += LH;

doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP} (${data.namaPembeli.split(" ")[0]} ${data.namaPembeli.split(" ")[1]})`, mL, y); y += LH_S;
doc.text(`No. K/P: ${data.noKP2}`, mL, y); y += LH_S;
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
  `Kami, ${data.namaPembeli} (No. K/P: ${data.noKP}) dan ${data.namaPembeli2} (No. K/P: ${data.noKP2}), pemilik bersama unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} (No. Rujukan SPA: ${data.noSPA}) mengikut ${data.jenisSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`
);
y += 4;

numPara(2,
  `Namun, sehingga tarikh notis ini dikeluarkan, didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum dilaksanakan oleh pihak tuan, walaupun tempoh tiga puluh (30) hari telah tamat pada ${data.tarikhTamat30Hari}. Pemeriksaan kendiri oleh kami mengesahkan kecacatan masih wujud. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
);
y += 4;


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
for (const f of fnL) { checkBreak(6); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period), dalam masa tiga puluh (30) hari selepas menerima notis bertulis daripada pembeli.`
);
y += 4;

numPara(4,
  `Perhatian khusus dan SEGERA diberikan kepada kecacatan elektrik yang melibatkan KESELAMATAN — item No. 58, 59 dan 60: RCCB berkadaran 0.1A (100mA) telah dipasang bagi litar kuasa sedangkan piawaian Suruhanjaya Tenaga (ST) menetapkan RCCB 30mA (0.03A) bagi perlindungan nyawa terhadap kebocoran arus elektrik. RCCB 100mA TIDAK memberikan perlindungan yang mencukupi kepada penghuni terhadap risiko kejutan elektrik. Kami menuntut agar pihak tuan menggantikan RCCB tersebut dengan kadaran 30mA yang betul, oleh orang kompeten (competent person), dengan segera.`
);
y += 4;

numPara(5,
  `Perhatian turut diberikan kepada: (a) kebocoran aktif — item No. 148 dan No. 149 (kebocoran paip besen dan hand bidet di Bathroom 3) serta kesan air pada siling (item No. 143); (b) sistem saliran — item No. 150 dan No. 164 (sisa binaan dalam floor trap dan manhole yang tersumbat dengan air bertakung), di mana pihak tuan dituntut membersihkan dan memastikan keseluruhan sistem saliran berfungsi dengan sempurna; dan (c) item No. 214 — ketidakjajaran ketara pada KESEMUA dinding luar (dibuktikan dengan ujian spirit level) serta kerosakan genting bumbung (item No. 97 — major), yang mana pembaikan menyeluruh mengikut piawaian dituntut.`
);
y += 4;

numPara(6,
  `Dengan ini, kami mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari.`
);
y += 4;

numPara(7, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, kami akan:");
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
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, kami akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);
y += 4;

para("Kami berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(60);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 12;
const sigCol2 = mL + 85;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
doc.line(sigCol2, y, sigCol2 + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.SMALL);
doc.text(`(${data.namaPembeli})`, mL, y);
doc.text(`(${data.namaPembeli2})`, sigCol2, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y);
doc.text(`No. K/P: ${data.noKP2}`, sigCol2, y);
y += 4;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += 7;

// s.k. (CC)
checkBreak(14);
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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} dan ${data.namaPembeli2} berhubung hartanah di ${data.alamatHartanah}.`;
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
const outName = VERSI === "HQ" ? "NOTIS_1_NAJEHA_HQ.pdf" : "NOTIS_1_NAJEHA_LAYANGKASA.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
