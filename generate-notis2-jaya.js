const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-2/2026/014",
  noRujukanNotis1: "NOTIS-1/2026/014",

  namaPembeli: "JAYA CHANDRAN A/L NALESAMY",
  alamatPengirim: [
    "No 13438, Jalan Rajawali 9,",
    "Bandar Putra,",
    "81000 Kulai,",
    "Johor.",
  ],
  noKP: "781128-01-5063",
  telefonPembeli: "016-722 9052",
  emailPembeli: "jcnalesamy@gmail.com",

  namaPemaju: "NICE FRONTIER SDN. BHD.",
  noSyarikat: "(199401014059 / 299739-U)",
  alamatPenerima: [
    "IOI Galleria @ Bandar Putra Kulai,",
    "Jalan Putra 4,",
    "Bandar Putra Kulai,",
    "81000 Kulai, Johor.",
  ],

  alamatHartanah: "850, Jalan Bayan 2, Bandar Putra, 81000 Kulai, Johor",
  jenisHartanah: "Rumah Teres 1 Tingkat (End Lot, 1984 sq.ft.)",
  namaProyek: "Bandar Putra Kulai, Phase 1B01 Piccolo 3",

  noSPA: "7147-83/eSPA/190724/PTD110150/01",
  tarikhSPA: "19 Julai 2024",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "6 April 2026",
  tarikhPemeriksaan2: "4 Julai 2026",
  tarikhSerahanLaporan: "9 April 2026",
  kaedahSerahanLaporan: "aplikasi IOI",

  tarikhNotis: "14 Oktober 2026",
  tarikhDeadline: "29 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kaedahPenghantaranNotis: "serahan tangan",

  kecacatan: [
    { tag: "1", lokasi: "Backyard — Floor", kecacatan: "Keretakan pada papak lantai masih ada (Crack on floor slab still observed)", status: "Belum Dibaiki" },
    { tag: "2", lokasi: "External Area — Floor", kecacatan: "Kesan tapak kaki anjing pada papak masih ada — sejak konkrit dituang (Dog foot print on slab still observed)", status: "Belum Dibaiki" },
    { tag: "3", lokasi: "Metal Deck Area (Car Porch) — Floor", kecacatan: "Air bertakung pada papak masih ada (Stagnant water on slab still observed)", status: "Belum Dibaiki" },
    { tag: "4", lokasi: "Metal Deck Area (Car Porch) — Floor", kecacatan: "Keretakan pada penjuru papak masih ada (Cracks on edge of slab still observed)", status: "Belum Dibaiki" },
    { tag: "5", lokasi: "Water Tank Area — Roof", kecacatan: "Pemasangan roof flashing tidak sempurna masih ada (Improper installation of roof flashing still observed)", status: "Belum Dibaiki" },
    { tag: "6", lokasi: "Water Tank Area — Fixtures", kecacatan: "Tangki air masih belum dibersihkan — isu sama berulang (Water tank should be cleaned — same issue still observed)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "19 Julai 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "6 April 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "9 April 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju melalui aplikasi IOI" },
    { tarikh: "9 Mei 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — tiada tindakan pembaikan yang memuaskan / tidak sempurna" },
    { tarikh: "4 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Kedua (Second Inspection) dijalankan — kecacatan masih wujud" },
    { tarikh: "10 Julai 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan — Ruj. NOTIS-1/2026/014, dihantar secara serahan tangan" },
    { tarikh: "25 Julai 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari) — pembaikan masih tidak disempurnakan" },
    { tarikh: "19 Ogos 2026", peristiwa: "Pemeriksaan Ketiga (Third Inspection) dijalankan — kecacatan masih belum diselesaikan" },
    { tarikh: "11 Oktober 2026", peristiwa: "Laporan Pemeriksaan Semula Keempat (4th Re-Inspection) disiapkan oleh Building Surveyor berdaftar RISM — 6 kecacatan, KESEMUANYA (100%) berstatus Not Complete" },
    { tarikh: "14 Oktober 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan — Ruj. NOTIS-2/2026/014" },
    { tarikh: "29 Oktober 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
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

const SZ = { BODY: 12, SMALL: 10, TABLE: 10, FOOTNOTE: 9, FOOTER: 8, TITLE: 12, CAPTION: 9 };
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
  const fs = SZ.TABLE;
  doc.setFontSize(fs);

  function rowH(cells) {
    let mx = rlh + pad * 2;
    for (let c = 0; c < cells.length; c++) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(fs);
      const ls = doc.splitTextToSize(String(cells[c]), colWidths[c] - pad * 2);
      const h = ls.length * rlh + pad * 2;
      if (h > mx) mx = h;
    }
    return mx;
  }

  function drawRow(cells, ry, rh, isH) {
    doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fs); bk();
    let cx = mL;
    for (let c = 0; c < cells.length; c++) {
      doc.setLineWidth(0.3);
      doc.rect(cx, ry, colWidths[c], rh);
      const w = colWidths[c] - pad * 2;
      doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fs); bk();
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
const perkara1 = "Notis Kedua / Notis Akhir (Final Notice) — Tuntutan Pembetulan Kecacatan";
const perkara1b = "(Defect Rectification Claim)";
const perkara2 = `Hartanah: ${data.jenisHartanah}`;
const perkara3 = `di ${data.alamatHartanah}`;
for (const pk of [perkara1, perkara1b, perkara2, perkara3]) {
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} (No. Rujukan SPA: ${data.noSPA}) mengikut ${data.jenisSPA}, merujuk kepada Notis Pertama — Tuntutan Pembetulan Kecacatan (First Notice) dengan rujukan ${data.noRujukanNotis1} bertarikh 10 Julai 2026 yang telah diserahkan kepada pihak tuan secara serahan tangan, susulan Laporan Pemeriksaan Kecacatan yang dikemukakan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan} selaras dengan Klausa ${data.klausaPembaikan} ${data.jenisSPA}. Notis Pertama tersebut telah memberikan tempoh lima belas (15) hari kepada pihak tuan untuk menyiapkan semua kerja pembaikan, iaitu sehingga 25 Julai 2026.`
);
y += 4;

numPara(2,
  `Namun, tempoh Notis Pertama tersebut telah TAMAT pada 25 Julai 2026 — hampir TIGA (3) BULAN yang lalu — tanpa semua pembaikan disempurnakan. Pemeriksaan Ketiga pada 19 Ogos 2026 dan seterusnya Pemeriksaan Semula Keempat (4th Re-Inspection) oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM) mengesahkan bahawa KESEMUA ENAM (6) kecacatan yang tinggal masih berstatus Not Complete (100%). Ini jelas menunjukkan kegagalan berterusan pihak tuan mematuhi Notis Pertama. Laporan Pemeriksaan Semula Keempat disertakan bersama-sama notis ini sebagai serahan rasmi. Senarai kecacatan tersebut adalah seperti berikut:`
);
y += 5;

checkBreak(45);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
y += 6;

const colW = [15, 40, 55, cW - 15 - 40 - 55];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Senarai di atas merujuk kepada penemuan Laporan Pemeriksaan Semula Keempat (4th Re-Inspection) yang disertakan bersama-sama notis ini. Senarai lengkap kecacatan asal terkandung dalam Laporan Pemeriksaan Kecacatan Pertama yang dihantar melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan} serta laporan-laporan pemeriksaan berikutnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { doc.text(f, mL, y); y += 4.5; }
y += 5;


numPara(3,
  `Perhatian khusus diberikan kepada air bertakung pada papak Metal Deck Area (item No. 3) dan pemasangan roof flashing yang tidak sempurna di Water Tank Area (item No. 5) — kedua-duanya mendedahkan rumah kepada risiko kebocoran air hujan dan dituntut dibaiki pada PUNCANYA (kecerunan permukaan dan pemasangan semula flashing dengan betul), bukan sekadar kerja kosmetik. Tangki air (item No. 6) yang masih belum dibersihkan walaupun isu yang sama telah dibangkitkan berulang kali turut wajib dibersihkan sepenuhnya memandangkan ia membekalkan air untuk kegunaan harian penghuni.`
);
y += 4;

numPara(4,
  `Dengan ini, saya mengeluarkan NOTIS KEDUA iaitu NOTIS AKHIR (FINAL NOTICE) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Tarikh tersebut merupakan TARIKH MUKTAMAD, dan tiada sebarang lanjutan masa akan diberikan selepasnya.`
);
y += 4;

numPara(5, "Sekiranya pembaikan masih tidak disempurnakan selepas tarikh akhir MUKTAMAD tersebut, saya akan TANPA RUJUKAN LANJUT:");
y += 2;
bullet("Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan, kos pembaikan atau pampasan yang sewajarnya;");
bullet("Menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan lima peratus (5%) (Retention Sum) yang dipegang oleh peguam cara pemaju sebagai pemegang (stakeholder), selaras dengan Klausa 27(2) Jadual G Perjanjian Jual Beli;");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
y += 4;

numPara(6,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa apa-apa kecacatan, pengecutan atau kerosakan lain yang menjadi ketara dalam tempoh ${data.tempohDLP} bulan selepas pembeli mengambil milikan kosong, yang disebabkan oleh mutu kerja atau bahan yang cacat, hendaklah dibaiki oleh pemaju atas kos dan belanjanya sendiri dalam masa tiga puluh (30) hari selepas menerima notis bertulis daripada pembeli.`
);
y += 4;

numPara(7,
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

numPara(8,
  `Ini merupakan NOTIS TERAKHIR sebelum tindakan undang-undang dimulakan. Sebarang kegagalan pihak tuan mematuhi notis ini akan dijadikan bukti kegagalan dan keengganan pihak tuan di hadapan Tribunal Tuntutan Pembeli Rumah dan/atau mahkamah yang berbidang kuasa, dan segala kos yang ditanggung akibat kegagalan tersebut akan dituntut sepenuhnya daripada pihak tuan`
);
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera dan muktamad terhadap Notis Kedua ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 10;

doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 20;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPembeli})`, mL, y);
y += 8;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += LH_S;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += 8;

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
fs.writeFileSync("/home/user/admin/NOTIS_2_JAYA.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_2_JAYA.pdf");
console.log(`Total pages: ${totalPages}`);
