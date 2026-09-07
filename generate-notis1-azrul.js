const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/040",

  namaPembeli: "MUHAMMAD AZRUL IZZAT BIN ROSLI",
  noKP: "960703-07-5155",
  namaPembeli2: "SITI NORSHAHIRA BINTI TUMIN",
  noKP2: "970822-01-6894",
  alamatPengirim: [
    "06-05, Blok B, Apartment Bayu Permas,",
    "Jalan Permas 12/21,",
    "Bandar Baru Permas Jaya,",
    "81750 Masai, Johor.",
  ],
  telefonPembeli: "018-949 8420",
  emailPembeli: "azrulizat10@gmail.com",

  namaPemaju: "PERMAS JAYA SDN. BHD.",
  noSyarikat: "(197301000637 / 14161-T)",
  alamatPenerima: [
    "(Management Office)",
    "Apartment Bayu Permas,",
    "Jalan Permas 12/21, Bandar Baru Permas Jaya,",
    "81750 Masai, Johor.",
  ],

  alamatHartanah: "06-05, Blok B, Apartment Bayu Permas, Jalan Permas 12/21, Bandar Baru Permas Jaya, 81750 Masai, Johor",
  jenisHartanah: "Pangsapuri — Parcel B-06-05, Tingkat 6, Blok B (126 meter persegi, aksesori A143 & A144)",
  namaProyek: "Apartmen Bayu Permas, Mukim Plentong (PTD 250169)",

  noSPA: "835-12/eSPA/230824/B-06-05/01",
  tarikhSPA: "23 September 2024",
  jenisSPA: "Jadual H",
  klausaPembaikan: "30(1)",
  klausaSerahan: "32(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "22 Julai 2026",
  tarikhSerahanLaporan: "25 Julai 2026",
  kaedahSerahanLaporan: "serahan tangan (hardcopy)",
  tarikhTamat30Hari: "24 Ogos 2026",

  tarikhNotis: "7 September 2026",
  tarikhDeadline: "22 September 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "2", lokasi: "S&P Review — Wall", kecacatan: "Isu Pelan Lantai — dinding tidak dibina mengikut pelan lantai yang dibekalkan bersama S&P (Wall not built as per floor plan provided with S&P)", status: "Untuk Semakan Pemaju" },
    { tag: "3", lokasi: "S&P Review — M&E", kecacatan: "Kekurangan 1 fan point — mengikut Building Specification SPA, unit A3 sepatutnya mempunyai 6 fan point; hanya 5 dijumpai (Missing 1 fan point)", status: "Untuk Semakan Pemaju" },
    { tag: "4", lokasi: "S&P Review — M&E", kecacatan: "Kekurangan 2 unit 13A power point — mengikut Building Specification SPA, unit A3 sepatutnya mempunyai 25 unit; hanya 23 dijumpai (Missing 2 units of 13A power points)", status: "Untuk Semakan Pemaju" },
    { tag: "59", lokasi: "Master Bedroom — Wall", kecacatan: "Kelembapan tinggi pada permukaan dinding (High moisture on wall surface — bukti kamera termal)", status: "Belum Dibaiki" },
    { tag: "68", lokasi: "Master Bathroom — Floor", kecacatan: "Air bertakung pada jubin lantai (Water stagnant on floor tiles)", status: "Belum Dibaiki" },
    { tag: "80", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Air masih keluar walaupun tidak flush (Water still come out even not flushing — Major defects)", status: "Belum Dibaiki" },
    { tag: "97", lokasi: "Study Room — M&E", kecacatan: "Slot soket sukar untuk dimasukkan plag (Socket slot hard to insert socket — Major)", status: "Belum Dibaiki" },
    { tag: "128", lokasi: "Living & Dining Area — M&E", kecacatan: "Slot soket sukar untuk dimasukkan plag (Socket slot hard to insert socket)", status: "Belum Dibaiki" },
    { tag: "138", lokasi: "Bedroom 1 — Wall", kecacatan: "Kelembapan tinggi pada dinding akibat resapan air dari dinding luar (High moisture caused by water seepage from external wall)", status: "Belum Dibaiki" },
    { tag: "146", lokasi: "Bedroom 1 — M&E", kecacatan: "Slot soket sukar untuk dimasukkan plag (Socket slot hard to insert socket)", status: "Belum Dibaiki" },
    { tag: "150", lokasi: "Bathroom 1 — Floor", kecacatan: "Air bertakung pada jubin lantai (Water stagnant on floor tile)", status: "Belum Dibaiki" },
    { tag: "177", lokasi: "Bedroom 2 — Wall", kecacatan: "Keretakan pada dinding — dalaman dan luaran (Crack on wall, internal and external)", status: "Belum Dibaiki" },
    { tag: "178", lokasi: "Bedroom 2 — Wall", kecacatan: "Kelembapan tinggi pada dinding akibat resapan air dari dinding luar (High moisture caused by water seepage from external wall)", status: "Belum Dibaiki" },
    { tag: "180", lokasi: "Bedroom 2 — Ceiling", kecacatan: "Kebocoran pada siling (Leaking on ceiling — bukti kamera termal)", status: "Belum Dibaiki" },
    { tag: "188", lokasi: "Bedroom 3 — Floor", kecacatan: "Lantai timber melentur/springy (Floor deflection springiness on timber flooring — Major defects)", status: "Belum Dibaiki" },
    { tag: "194", lokasi: "Bedroom 3 — Wall", kecacatan: "Keretakan pada dinding bercat (Crack on painted wall)", status: "Belum Dibaiki" },
    { tag: "195", lokasi: "Bedroom 3 — Wall", kecacatan: "Kelembapan tinggi pada dinding akibat resapan air dari dinding luar (High moisture caused by water seepage from external wall)", status: "Belum Dibaiki" },
    { tag: "200", lokasi: "Bedroom 3 — UPVC Skirting", kecacatan: "Skirting lantai tidak sejajar (Floor skirting alignment issues)", status: "Belum Dibaiki" },
    { tag: "203", lokasi: "Bathroom 2 — Floor", kecacatan: "Air bertakung pada jubin lantai (Water stagnant on floor tiles)", status: "Belum Dibaiki" },
    { tag: "209", lokasi: "Bathroom 2 — Wall", kecacatan: "Hollowness pada jubin dinding (Hollowness wall tile)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "23 September 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual H" },
    { tarikh: "22 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "25 Julai 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju secara serahan tangan (hardcopy)" },
    { tarikh: "24 Ogos 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum dilaksanakan" },
    { tarikh: "September 2026", peristiwa: "Pemeriksaan kendiri oleh pemilik — kecacatan masih wujud dan belum dibaiki" },
    { tarikh: "7 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "22 September 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Perhatian khusus diberikan kepada item No. 138, 178 dan 195 — kelembapan tinggi akibat resapan air dari dinding luar dikesan di TIGA bilik berasingan (Bedroom 1, 2 dan 3), berserta kebocoran siling (item No. 180). Ini menunjukkan kegagalan sistem kalis air / dinding luar bangunan. Kami menuntut agar pihak tuan menyiasat dan membaiki PUNCA resapan air dari bahagian luar bangunan, dan bukan sekadar kerja kemasan semula pada permukaan dalaman unit. Selain itu, unit ini turut mempunyai banyak isu ketidakjajaran (alignment issues) pada dinding dan kemasan di beberapa lokasi; pihak tuan dituntut memperbetulkan kesemua permukaan dinding dan kemasan yang tidak sejajar mengikut piawaian kerja yang sepatutnya.`
);
y += 4;

numPara(5,
  `Bagi item No. 2, 3 dan 4 (S&P Review), kami meminta pihak tuan mengambil perhatian dan membuat semakan semula (double check): (a) sama ada dinding unit dibina mengikut pelan lantai yang dibekalkan bersama S&P atau terdapat pindaan reka bentuk; dan (b) sama ada bilangan fan point dan 13A power point yang dipasang (5 fan point dan 23 power point) adalah betul berbanding Building Specification SPA (6 fan point dan 25 power point). Sekiranya spesifikasi S&P yang silap, ATAU unit memang dibekalkan sebagaimana yang sedia ada, ATAU reka bentuk dinding telah dipinda, pihak tuan dituntut memberikan penjelasan rasmi kepada pemilik dan mengeluarkan dokumen rasmi (official documentation) mengenainya.`
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
fs.writeFileSync("/home/user/admin/NOTIS_1_AZRUL.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_AZRUL.pdf");
console.log(`Total pages: ${totalPages}`);
