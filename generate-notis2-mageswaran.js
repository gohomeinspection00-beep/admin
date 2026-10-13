const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-2/2026/032",
  noRujukanNotis1: "NOTIS-1/2026/032",

  namaPembeli: "MAGESWARAN A/L RAVI CHANDRAN",
  alamatPengirim: [
    "No. 24, Rapat Ria 4,",
    "Pinggiran Rapat Ria Pine 3,",
    "31350 Ipoh,",
    "Perak.",
  ],
  noKP: "950315-08-6785",
  telefonPembeli: "016-270 1856",
  emailPembeli: "r.mages1413@gmail.com",

  namaPemaju: "ECO TROPICS DEVELOPMENT SDN. BHD.",
  noSyarikat: "(199401030842 / 316524-U)",
  alamatPenerima: [
    "No. 60, Setia Avenue, No. 2,",
    "Jalan Setia Prima S U13/S,",
    "Setia Alam, Seksyen U13,",
    "40170 Shah Alam, Selangor.",
  ],

  alamatHartanah: "Parcel 4127, No. 23, Jalan Ekotropika 4/5, Kota Masai, 81700 Pasir Gudang, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (Intermediate, 2,100 kaki persegi)",
  namaProyek: "Ekotropika, Taman Ekoperniagaan, Mukim Tebrau",

  noSPA: "6443-22/eSPA/070823/4127/01",
  tarikhSPA: "7 Ogos 2023",
  jenisSPA: "Jadual H",
  klausaPembaikan: "30(1)",
  klausaSerahan: "32(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "7 Julai 2026",
  tarikhSerahanLaporan: "15 Julai 2026",
  kaedahSerahanLaporan: "aplikasi EcoWorld",
  tarikhTamat30Hari: "14 Ogos 2026",
  tarikhReInspection: "20 Ogos 2026",
  tarikhSerahanLaporan2: "20 Ogos 2026",

  tarikhNotis: "14 Oktober 2026",
  tarikhDeadline: "29 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "1", lokasi: "Car Porch — Floor", kecacatan: "Tumbuhan liar pada permukaan tanah masih ada (Unwanted plant on ground still observed)", status: "Belum Dibaiki" },
    { tag: "2", lokasi: "Car Porch — Floor", kecacatan: "Keretakan pada grouting jubin lantai (New Defect — Crack on floor tiles grouting)", status: "Kecacatan Baru" },
    { tag: "3", lokasi: "Car Porch — Floor", kecacatan: "Hollowness pada jubin lantai dan floor skirting masih ada (Hollowness on floor tiles and floor skirting still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "4", lokasi: "Car Porch — Wall", kecacatan: "Keretakan pada dinding bercat masih ada (Cracks on painted wall still observed)", status: "Belum Dibaiki" },
    { tag: "5", lokasi: "Bathroom 3 — Plumbing & Sanitary", kecacatan: "Kebocoran pada basin down pipe masih ada (Leaking on basin down pipe still observed — Leaking Issue)", status: "Belum Dibaiki" },
    { tag: "6", lokasi: "Family Area — Wall", kecacatan: "Dinding tidak sejajar masih ada (Misaligned on wall still observed)", status: "Belum Dibaiki" },
    { tag: "7", lokasi: "Bathroom 2 — Plumbing & Sanitary", kecacatan: "Kebocoran pada basin down pipe masih ada (Leaking on basin down pipe still observed — Leaking Issue)", status: "Belum Dibaiki" },
    { tag: "8", lokasi: "RC Flat Roof — Floor", kecacatan: "Air bertakung pada papak lantai masih ada (Stagnant water on floor slab still observed)", status: "Belum Dibaiki Sepenuhnya" },
  ],

  kronologi: [
    { tarikh: "7 Ogos 2023", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual H" },
    { tarikh: "7 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "15 Julai 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju melalui aplikasi EcoWorld" },
    { tarikh: "14 Ogos 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disempurnakan" },
    { tarikh: "20 Ogos 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan dan Laporan Re-Inspection diserahkan melalui aplikasi EcoWorld — kecacatan masih belum diselesaikan" },
    { tarikh: "3 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan — Ruj. NOTIS-1/2026/032" },
    { tarikh: "18 September 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari) — pembaikan masih tidak disempurnakan" },
    { tarikh: "2 Oktober 2026", peristiwa: "Pemeriksaan Ketiga (Third Inspection) oleh Building Surveyor berdaftar RISM — 8 kecacatan direkodkan: 5 Not Complete, 2 Not Fully Complete dan 1 kecacatan baru" },
    { tarikh: "14 Oktober 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan — Ruj. NOTIS-2/2026/032" },
    { tarikh: "29 Oktober 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
  ],

  salinanKepada: [
    {
      nama: "ECO TROPICS DEVELOPMENT SDN. BHD. — The Tomorrow Centre",
      alamat: ["No. 9, 11, 15 & 17, Jalan Ekoperniagaan 1/6,", "Taman Ekoperniagaan,", "81100 Johor Bahru, Johor."],
    },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} (No. Rujukan SPA: ${data.noSPA}) mengikut ${data.jenisSPA}, merujuk kepada Notis Pertama — Tuntutan Pembetulan Kecacatan (First Notice) dengan rujukan ${data.noRujukanNotis1} bertarikh 3 September 2026 yang telah dikemukakan kepada pihak tuan, susulan Laporan Pemeriksaan Kecacatan yang diserahkan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan} selaras dengan Klausa ${data.klausaPembaikan} ${data.jenisSPA}. Notis Pertama tersebut telah memberikan tempoh lima belas (15) hari kepada pihak tuan untuk menyiapkan semua kerja pembaikan, iaitu sehingga 18 September 2026.`
);
y += 4;

numPara(2,
  `Namun, tempoh Notis Pertama tersebut telah TAMAT pada 18 September 2026 tanpa semua pembaikan disempurnakan. Pemeriksaan Ketiga (Third Inspection) yang dijalankan pada 2 Oktober 2026 oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM) mengesahkan sejumlah LAPAN (8) kecacatan — 5 masih Not Complete, 2 Not Fully Complete, dan 1 KECACATAN BARU dikesan. Ini jelas menunjukkan kegagalan pihak tuan mematuhi Notis Pertama. Laporan Pemeriksaan Ketiga disertakan bersama-sama notis ini sebagai serahan rasmi. Senarai kecacatan tersebut adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung dalam Laporan Re-Inspection yang diserahkan pada ${data.tarikhSerahanLaporan2} serta Laporan Pemeriksaan Kecacatan Kali Pertama yang diserahkan pada ${data.tarikhSerahanLaporan}, kedua-duanya melalui aplikasi EcoWorld.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(6); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period).`
);
y += 4;

numPara(4,
  `Perhatian khusus dan SEGERA diberikan kepada KEBOCORAN yang masih berterusan pada basin down pipe di DUA bilik air — Bathroom 2 dan Bathroom 3 (item No. 5 dan No. 7) — yang telah dilaporkan sejak pemeriksaan pertama dan masih tidak dibaiki; pihak tuan dituntut mengesan dan membaiki PUNCA kebocoran tersebut dengan sempurna, dan bukan sekadar kerja kemasan. Perhatian turut diberikan kepada air bertakung pada papak RC Flat Roof (item No. 8) yang menunjukkan kecerunan permukaan masih tidak sempurna, serta kecacatan BARU yang timbul — keretakan pada grouting jubin lantai Car Porch (item No. 2).`
);
y += 4;

numPara(5,
  `Dengan ini, saya mengeluarkan NOTIS KEDUA iaitu NOTIS AKHIR (FINAL NOTICE) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Tarikh tersebut merupakan TARIKH MUKTAMAD, dan tiada sebarang lanjutan masa akan diberikan selepasnya.`
);
y += 4;

numPara(6, "Sekiranya pembaikan masih tidak disempurnakan selepas tarikh akhir MUKTAMAD tersebut, saya akan TANPA RUJUKAN LANJUT:");
y += 2;
bullet("Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan, kos pembaikan atau pampasan yang sewajarnya;");
bullet("Menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan lima peratus (5%) (Retention Sum) yang dipegang oleh peguam cara pemaju sebagai pemegang (stakeholder), selaras dengan Klausa 30(2) Jadual H Perjanjian Jual Beli;");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
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

numPara(7,
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera dan muktamad terhadap Notis Kedua ini. Ini merupakan notis akhir sebelum tindakan undang-undang dimulakan. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
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
checkBreak(18);
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
fs.writeFileSync("/home/user/admin/NOTIS_2_MAGESWARAN.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_2_MAGESWARAN.pdf");
console.log(`Total pages: ${totalPages}`);
