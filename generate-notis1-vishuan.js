const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/057",

  namaPembeli: "VISHUAN A/L KUMARESAN",
  alamatPengirim: [
    "No. 334, Jalan Mutiara Hijau 11,",
    "Taman Mutiara Hijau,",
    "81000 Kulai,",
    "Johor.",
  ],
  noKP: "921111-05-5351",
  telefonPembeli: "011-3662 2170",
  emailPembeli: "vicchuvishuan@gmail.com",

  namaPemaju: "CASA BAYU IDAMAN SDN. BHD.",
  noSyarikat: "(201701016228 / 1230392-T)",
  alamatPenerima: [
    "No. 33, Jalan Perjiranan 4/5,",
    "Bandar Dato Onn,",
    "81100 Johor Bahru,",
    "Johor.",
  ],

  alamatHartanah: "No. 334, Jalan Mutiara Hijau 11, Taman Mutiara Hijau, 81000 Kulai, Johor (Lot 335, PTD 113202, HS(M) 4987, Mukim Senai)",
  jenisHartanah: "Rumah Teres 2 Tingkat (2 Storey Terrace House, 2,108 kaki persegi)",
  namaProyek: "St. Marco Park — Fasa 3B, Kulai, Johor",

  noSPA: "19706-5/eSPA/230224/PTD113202/01",
  tarikhSPA: "23 Februari 2024",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "22 April 2026",
  tarikhSerahanLaporan: "22 Mei 2026",
  kaedahSerahanLaporan: "serahan tangan (hardcopy) di pejabat pengurusan (management office) pihak pemaju",
  tarikhTamat30: "21 Jun 2026",
  tarikhReInspection: "3 Oktober 2026",

  tarikhNotis: "29 Oktober 2026",
  tarikhDeadline: "13 November 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "1", lokasi: "Car Porch — Lantai", kecacatan: "Serpihan (chipping) pada jubin lantai (Chipping on floor tiles)", status: "Belum Dibaiki" },
    { tag: "10", lokasi: "Car Porch — Plumbing & Sanitary", kecacatan: "Sisa binaan di dalam floor trap / refuse chamber (Construction leftover inside floor trap)", status: "Belum Dibaiki" },
    { tag: "59", lokasi: "Utility Room — Lantai", kecacatan: "Keretakan pada papak lantai — pelekat penanda (marking sticker) pemeriksaan pertama masih belum ditanggalkan (Crack on floor slab — first inspection marking sticker still in place)", status: "Belum Dibaiki" },
    { tag: "66", lokasi: "Staircase — Dinding", kecacatan: "Bunyi berongga pada dinding bercat (Hollow sound on painted wall — Hollowness Issue)", status: "Belum Dibaiki" },
    { tag: "67", lokasi: "Staircase — Siling", kecacatan: "Celahan pemisahan antara siling dan dinding (Separation gap between ceiling and wall)", status: "Belum Dibaiki" },
    { tag: "113", lokasi: "Bathroom 2 — M&E", kecacatan: "Titik lampu siling tiada dan wayar hidup tergantung terdedah (Missing lighting point; exposed live wire)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "120", lokasi: "Water Tank Area — Lantai", kecacatan: "Tanda air bertakung pada permukaan lantai (Sign of water stagnant on floor surface — Alignment Issue)", status: "Belum Dibaiki" },
    { tag: "121", lokasi: "Water Tank Area — Lantai", kecacatan: "Kemungkinan air bertakung pada permukaan lantai (Possibility of water stagnant on floor surface)", status: "Belum Dibaiki" },
    { tag: "123", lokasi: "Water Tank Area — Siling", kecacatan: "Ceiling board tiada — penebat (insulation) dan struktur siling terdedah; terdapat bukaan antara bumbung dan dinding (Missing ceiling board — exposed insulation and ceiling structure; opening between roof and wall)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "23 Februari 2024", peristiwa: "Perjanjian Jual Beli (Sale and Purchase Agreement) ditandatangani — St. Marco Park Fasa 3B (Ruj: 19706-5/eSPA/230224/PTD113202/01)" },
    { tarikh: "22 April 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "22 Mei 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara rasmi melalui serahan tangan (hardcopy) di pejabat pengurusan pihak pemaju — merupakan notis bertulis di bawah Klausa 27(1)" },
    { tarikh: "21 Jun 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1) — pembaikan masih belum diselesaikan" },
    { tarikh: "3 Oktober 2026", peristiwa: "Pemeriksaan Semula (Second Inspection) dijalankan — kecacatan yang dilaporkan masih belum diselesaikan" },
    { tarikh: "15 Oktober 2026", peristiwa: "Laporan Pemeriksaan Semula (2nd Inspection Report) diserahkan secara serahan tangan menggunakan Borang Aduan Kecacatan pihak pemaju — DITERIMA dengan cop rasmi RECEIVED 15 OCT 2026 (rujuk Lampiran A)" },
    { tarikh: "26 Oktober 2026", peristiwa: "Notis Pertama dihantar melalui Pos Laju — Pos Daftar AR No. RW214685601MY — ke alamat pihak pemaju di No. 33, Jalan Perjiranan 4/5, Bandar Dato' Onn, 81100 Johor Bahru" },
    { tarikh: "29 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "13 November 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) bertarikh ${data.tarikhSPA} dengan rujukan ${data.noSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pengemukaan tersebut merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}, dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
);
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada ${data.tarikhTamat30}, Pemeriksaan Semula (Second Inspection) yang dijalankan pada ${data.tarikhReInspection} mengesahkan bahawa kecacatan yang dilaporkan masih belum diselesaikan oleh pihak tuan — iaitu hampir LIMA (5) BULAN sejak laporan diserahkan. Laporan Pemeriksaan Semula tersebut telah pun diserahkan secara serahan tangan kepada pihak tuan menggunakan Borang Aduan Kecacatan (Defect Complaint Form) St. Marco Park Fasa 3B dan DITERIMA dengan cop rasmi "RECEIVED 15 OCT 2026" (salinan dilampirkan sebagai LAMPIRAN A). Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Senarai penuh kecacatan adalah sebagaimana direkodkan di dalam Laporan Pemeriksaan Kecacatan yang telah diserahkan secara hardcopy di pejabat pengurusan pihak tuan pada ${data.tarikhSerahanLaporan}, dan kesemuanya hendaklah dibaiki sepenuhnya. Status terkini adalah berdasarkan Pemeriksaan Semula pada ${data.tarikhReInspection}.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada item No. 113 — titik lampu siling di Bathroom 2 yang masih tiada dan wayar hidup (live wire) yang tergantung secara terdedah. Wayar hidup yang terdedah di dalam bilik air — kawasan basah — adalah BAHAYA KESELAMATAN yang serius dan melibatkan risiko kejutan elektrik dan kebakaran kepada penghuni. Pembaikan hendaklah dilaksanakan dengan SEGERA oleh orang kompeten (competent person) yang berdaftar dengan Suruhanjaya Tenaga, dan bukti penyiapan hendaklah dikemukakan kepada pemilik.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada item No. 123 — ceiling board di Water Tank Area yang masih tiada, menyebabkan penebat (insulation) dan struktur siling terdedah, serta bukaan antara bumbung dan dinding yang terbuka. Bukaan sedemikian merupakan laluan kemasukan air hujan, habuk dan haiwan (burung, kelawar, tikus) ke dalam ruang bumbung. Sekiranya pihak tuan mendakwa keadaan ini adalah mengikut reka bentuk asal, pihak tuan dituntut mengemukakan dokumen rasmi (official documentation) — lukisan reka bentuk yang diluluskan atau Method of Statement — sebagai bukti; jika tidak, ceiling board hendaklah dipasang dan bukaan tersebut ditutup dengan sempurna. Item No. 120 dan No. 121 — tanda air bertakung di Water Tank Area — menunjukkan kecerunan (falls) dan saliran yang tidak sempurna yang WAJIB dibetulkan pada PUNCANYA, bukan sekadar dikeringkan.`
);
y += 4;

numPara(5,
  `Selain itu, item No. 59 — keretakan pada papak lantai Utility Room — perlu diberi perhatian khusus: pelekat penanda (marking sticker) yang dilekatkan semasa Pemeriksaan Pertama pada ${data.tarikhPemeriksaan1} masih belum ditanggalkan sehingga Pemeriksaan Semula pada ${data.tarikhReInspection}, bukti jelas bahawa kawasan tersebut langsung tidak pernah disentuh atau dibaiki oleh pihak tuan. Item No. 66 (bunyi berongga pada dinding Staircase) dan No. 67 (celahan pemisahan antara siling dan dinding Staircase) hendaklah dibaiki mengikut amalan pembinaan yang baik dan bukan sekadar tampalan kosmetik; item No. 1 (chipping jubin Car Porch) dan No. 10 (sisa binaan di dalam floor trap) hendaklah diselesaikan sepenuhnya. Bagi kerja pembaikan di kawasan yang sukar diakses (Water Tank Area), pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui e-mel (${data.emailPembeli}) atau WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan.`
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

checkBreak(46);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
const signImg = "data:image/jpeg;base64," + fs.readFileSync("/home/user/admin/vishuan-sign.jpg").toString("base64");
doc.addImage(signImg, "JPEG", mL + 8, y + 1, 32, 32 * 151 / 480);
y += 18;
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
// LAMPIRAN A — BUKTI SERAHAN LAPORAN PEMERIKSAAN SEMULA
// ============================================================
newPage();
y = 25;
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const lampT = "LAMPIRAN A";
doc.text(lampT, pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth(lampT) / 2, y + 1, pageW / 2 + doc.getTextWidth(lampT) / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("Bukti Serahan Laporan Pemeriksaan Semula (Proof of Submission — 2nd Inspection Report)", pageW / 2, y, { align: "center" });
y += 8;
const lampImg = "data:image/jpeg;base64," + fs.readFileSync("/home/user/admin/vishuan-akuan-report2.jpg").toString("base64");
const liW = 125; const liH = liW * 1280 / 960;
const liX = (pageW - liW) / 2;
doc.setLineWidth(0.3); doc.setDrawColor(0, 0, 0);
doc.rect(liX - 1, y - 1, liW + 2, liH + 2);
doc.addImage(lampImg, "JPEG", liX, y, liW, liH);
y += liH + 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const lampCap = doc.splitTextToSize("Borang Aduan Kecacatan (Defect Complaint Form) St. Marco Park — Fasa 3B bagi unit No. 334 — ditandatangani oleh pemilik pada 10 Oktober 2026 dan DITERIMA oleh pihak pemaju dengan cop rasmi RECEIVED 15 OCT 2026.", cW - 10);
for (const c of lampCap) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.3; }

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
fs.writeFileSync("/home/user/admin/NOTIS_1_VISHUAN.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_VISHUAN.pdf");
console.log(`Total pages: ${totalPages}`);
