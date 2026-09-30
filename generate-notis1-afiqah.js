const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/051",

  namaPembeli: "SITI AFIQAH BINTI AB HAMID",
  alamatPengirim: [
    "21, Jalan Indah 22/22,",
    "Taman Bukit Indah 2,",
    "81200 Johor Bahru,",
    "Johor.",
  ],
  noKP: "901221-01-6064",
  telefonPembeli: "013-704 7987",
  emailPembeli: "sitiafiqahabhamid@gmail.com",

  namaPemaju: "TH TEBRAU LAND SDN. BHD.",
  noSyarikat: "(201201012411 / 985928-D)",
  alamatPenerima: [
    "(Pejabat Pengurusan)",
    "L13, Menara A, Pangsapuri Seri Permata,",
    "Jalan Kunyit, Taman Sri Amar,",
    "81100 Johor Bahru, Johor.",
  ],

  alamatHartanah: "B-20-02, Menara B, Pangsapuri Seri Permata, Jalan Kunyit, Taman Sri Amar, 81100 Johor Bahru, Johor",
  jenisHartanah: "Pangsapuri (Unit B-20-02, Menara B)",
  namaProyek: "PPAM Pangsapuri Seri Permata",

  noSPA: "",
  tarikhSPA: "",
  jenisSPA: "Perjanjian Jual Beli",
  klausaPembaikan: "",
  klausaSerahan: "",
  tempohDLP: "24",

  tarikhPemeriksaan1: "6 November 2025",
  tarikhSerahanLaporan: "11 November 2025",
  tarikhTamat30Hari: "11 Disember 2025",
  tarikhReInspection: "8 September 2026",

  tarikhNotis: "1 Oktober 2026",
  tarikhDeadline: "16 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "17", lokasi: "Balcony (Living & Dining) — Floor", kecacatan: "Jubin lantai masih hilang (Missing tiles on floor — Not Complete)", status: "Belum Dibaiki" },
    { tag: "22", lokasi: "Kitchen — Wall", kecacatan: "Hollowness pada jubin dinding masih ada (Hollowness on wall tiles — Not Fully Complete)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "30", lokasi: "Yard — Floor", kecacatan: "Hollowness pada skirting lantai masih ada (Hollowness on floor skirting — Not Complete)", status: "Belum Dibaiki" },
    { tag: "31", lokasi: "Yard — Wall", kecacatan: "Dinding tidak sejajar — ketara (Misaligned on wall, visible) — KECACATAN BARU", status: "Kecacatan Baru — Belum Dibaiki" },
    { tag: "32", lokasi: "Yard — Wall", kecacatan: "Hollowness di bahagian atas dinding masih ada (Hollowness on top of wall — Not Complete)", status: "Belum Dibaiki" },
    { tag: "40", lokasi: "Master Bedroom — Door", kecacatan: "Daun pintu masih tidak dapat dibuka sepenuhnya — tersekat dengan jubin lantai (Door leaf unable to fully open, stuck with floor tiles — Not Complete)", status: "Belum Dibaiki" },
    { tag: "43", lokasi: "Master Bedroom — M&E", kecacatan: "Light point dan fan point mempunyai voltan rendah bagi L+E (Light and fan point have low voltage for L+E)", status: "Belum Dibaiki" },
    { tag: "45", lokasi: "Master Bathroom — Floor", kecacatan: "Air bertakung pada jubin lantai masih ada (Stagnant water on floor tiles — Not Complete)", status: "Belum Dibaiki" },
    { tag: "50", lokasi: "Master Bathroom — Window", kecacatan: "Tingkap dipasang tidak sejajar masih ada (Window installed misaligned — Not Complete)", status: "Belum Dibaiki" },
    { tag: "52", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Kebocoran pada cistern supply pipe (Leaking on cistern supply pipe) — KECACATAN BARU", status: "Kecacatan Baru — Belum Dibaiki" },
    { tag: "53", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Sisa binaan masih ada di dalam kedua-dua floor trap (Construction leftover inside both floor trap — Poor Drainage System, Not Complete)", status: "Belum Dibaiki" },
    { tag: "54", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Air di dalam besen terlalu perlahan mengalir ke floor trap (Water inside basin too slow to go to floor trap — Poor Drainage System) — KECACATAN BARU", status: "Kecacatan Baru — Belum Dibaiki" },
    { tag: "57", lokasi: "Balcony (Master Bedroom) — Floor", kecacatan: "Jubin masih hilang dan celahan ketara (Missing tiles and visible gap — Not Complete)", status: "Belum Dibaiki" },
    { tag: "59", lokasi: "Balcony (Master Bedroom) — Floor", kecacatan: "Hollowness pada jubin lantai masih ada (Hollowness on floor tiles — Not Complete)", status: "Belum Dibaiki" },
    { tag: "60", lokasi: "Balcony (Master Bedroom) — Floor", kecacatan: "Hollowness pada papak lantai masih ada (Hollowness on floor slab — Not Complete)", status: "Belum Dibaiki" },
    { tag: "61", lokasi: "Balcony (Master Bedroom) — M&E", kecacatan: "Voltan rendah bagi Live + Earth untuk light point masih ada (Live + Earth for light point has low voltage — Not Complete)", status: "Belum Dibaiki" },
    { tag: "63", lokasi: "Bedroom 2 — Wall", kecacatan: "Dinding tidak sejajar masih ada (Misaligned wall — Not Complete)", status: "Belum Dibaiki" },
    { tag: "66", lokasi: "Bedroom 2 — M&E", kecacatan: "Fan point dan light point mempunyai voltan rendah bagi L+N dan L+E (Fan point and light point have low voltage, L+N and L+E)", status: "Belum Dibaiki" },
    { tag: "74", lokasi: "Bedroom 3 — M&E", kecacatan: "Voltan rendah bagi Live + Earth dan Live + Neutral untuk light dan fan point masih ada (Low voltage still observed — Not Complete)", status: "Belum Dibaiki" },
    { tag: "76", lokasi: "Bathroom 2 — Floor", kecacatan: "Air bertakung pada jubin lantai masih ada (Stagnant water on floor tiles — Not Complete)", status: "Belum Dibaiki" },
    { tag: "82", lokasi: "Bathroom 2 — Window", kecacatan: "Tingkap dipasang tidak sejajar masih ada (Window installed misaligned, DFC-15 — Not Complete)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "6 November 2025", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "11 November 2025", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara rasmi kepada pemaju melalui Aplikasi Marvis" },
    { tarikh: "11 Disember 2025", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "8 September 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) oleh Building Surveyor berdaftar RISM — 74 kecacatan masih belum diselesaikan / kecacatan baru dikesan" },
    { tarikh: "11 September 2026", peristiwa: "Laporan Pemeriksaan Semula diserahkan melalui Aplikasi Marvis — 74 kes didaftarkan (rujukan DFC-1 hingga DFC-74)" },
    { tarikh: "1 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "16 Oktober 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
doc.text(`${data.namaPemaju} ${data.noSyarikat}`, mL, y);
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli yang ditandatangani dengan pihak tuan, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui Aplikasi Marvis pada ${data.tarikhSerahanLaporan}. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`
);
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada ${data.tarikhTamat30Hari} — iaitu hampir SEPULUH (10) BULAN yang lalu — Pemeriksaan Semula (Re-Inspection) yang dijalankan pada ${data.tarikhReInspection} oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM) mendapati 74 kecacatan masih belum diselesaikan oleh pihak tuan, termasuk beberapa KECACATAN BARU yang berlaku akibat kerja pembaikan pihak tuan sendiri. Kesemua 74 kes telah didaftarkan semula melalui Aplikasi Marvis pada 11 September 2026, dan Laporan Pemeriksaan Semula penuh disertakan bersama-sama notis ini. Antara kecacatan yang masih wujud dan belum diselesaikan adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh — hanya sebahagian daripada 74 kecacatan yang masih belum diselesaikan. Senarai penuh adalah sebagaimana Laporan Pemeriksaan Semula (Re-Inspection Report) bertarikh ${data.tarikhReInspection} yang disertakan bersama-sama notis ini dan 74 kes yang didaftarkan di dalam Aplikasi Marvis (DFC-1 hingga DFC-74).`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(6); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada kecacatan elektrik — item No. 43, 61, 66 dan 74: voltan rendah bagi Live + Earth dan/atau Live + Neutral pada light point dan fan point di EMPAT ruang berbeza (Master Bedroom, Balkoni Master Bedroom, Bedroom 2 dan Bedroom 3). Bacaan voltan yang rendah menunjukkan masalah pendawaian atau sambungan yang boleh menjejaskan fungsi dan KESELAMATAN pemasangan elektrik unit. Siasatan menyeluruh dan pembaikan oleh orang kompeten (competent person) dituntut dengan segera.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada KECACATAN BARU YANG BERLAKU AKIBAT KERJA PEMBAIKAN pihak tuan sendiri (New Defect from Rectification Work) — antaranya kebocoran pada cistern supply pipe (item No. 52), saliran besen yang perlahan (item No. 54), dinding tidak sejajar di Yard (item No. 31), serta pelbagai kesan kotoran cat, calar dan keretakan baru yang ditinggalkan oleh kontraktor pihak tuan di serata unit sebagaimana direkodkan di dalam Laporan Pemeriksaan Semula. Selain itu, daun pintu Master Bedroom masih tidak dapat dibuka sepenuhnya kerana tersekat dengan jubin lantai (item No. 40) dan dua tingkap masih dipasang tidak sejajar (item No. 50 dan 82). Pembaikan yang menyeluruh dan kemas dituntut, dan sebarang kerosakan baru akibat kerja pembaikan hendaklah diperbetulkan atas kos pihak tuan sepenuhnya.`
);
y += 4;

numPara(5,
  `Di bawah Perjanjian Jual Beli dan Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118] serta peraturan-peraturan di bawahnya, pihak tuan sebagai pemaju bertanggungjawab, atas kos dan belanja pihak tuan sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam Tempoh Liabiliti Kecacatan (Defect Liability Period) selepas menerima notis bertulis daripada pembeli, dalam masa tiga puluh (30) hari.`
);
y += 4;


numPara(6,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari.`
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
  `Sebarang dokumen atau notis yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah diserahkan dan diterima pakai sebagai dokumen rasmi.`
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
fs.writeFileSync("/home/user/admin/NOTIS_1_AFIQAH.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_AFIQAH.pdf");
console.log(`Total pages: ${totalPages}`);
