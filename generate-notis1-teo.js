const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/018",

  namaPembeli: "TEO GEOK HUI",
  noKP: "910827-01-5554",
  namaPembeli2: "LUI WEE ONG",
  noKP2: "930623-01-6561",
  alamatPengirim: [
    "490, Residensi Botanic 3,",
    "Persiaran Eko Botanic 2,",
    "Taman Eko Botanic 2,",
    "79100 Iskandar Puteri,",
    "Johor.",
  ],
  telefonPembeli: "016-758 5830",
  emailPembeli: "gh_teo@outlook.com",

  namaPemaju: "MELIA SPRING SDN. BHD.",
  noSyarikat: "(201401019246 / 1095333-H)",
  alamatPenerima: [
    "No. 60, Setia Avenue,",
    "No. 2, Jalan Setia Prima S U13/S,",
    "Setia Alam, Seksyen U13,",
    "40170 Shah Alam,",
    "Selangor.",
  ],

  alamatHartanah: "490, Residensi Botanic 3, Persiaran Eko Botanic 2, Taman Eko Botanic 2, 79100 Iskandar Puteri, Johor",
  jenisHartanah: "Rumah 2 Tingkat (24' x 85', Parcel No. L268(3216))",
  namaProyek: "Residensi Botani 3",

  noSPA: "19985-6/eSPA/030723/L268(3216)/01",
  tarikhSPA: "3 Julai 2023",
  jenisSPA: "Jadual H",
  klausaPembaikan: "30(1)",
  klausaSerahan: "32(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "4 April 2026",
  tarikhPemeriksaan2: "10 Julai 2026",
  tarikhSerahanLaporan: "10 April 2026 dan 11 April 2026",
  kaedahSerahanLaporan: "laman web EcoWorld",
  noKesSerahan: "MSP3-3C02-3216-001, -002, -003, -004, -005, -006",

  tarikhNotis: "13 Julai 2026",
  tarikhDeadline: "28 Julai 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kaedahPenghantaranNotis: "serahan tangan",

  kecacatan: [
    { tag: "16", lokasi: "Car Porch — Plumbing & Sanitary", kecacatan: "Kemungkinan air bertakung disebabkan permukaan kasar pada lubang saliran air hujan; penutup lubang saliran tidak boleh dibuka kerana simen di sekeliling penutup", status: "Belum Dibaiki" },
    { tag: "17", lokasi: "Car Porch — Plumbing & Sanitary", kecacatan: "Keretakan pada dinding dalam manhole dan lubang saliran", status: "Belum Dibaiki" },
    { tag: "Baru", lokasi: "Foyer — Door", kecacatan: "Calar pada bingkai pintu selepas kerja pembaikan (New Defect from Rectification Work)", status: "Kecacatan Baru" },
    { tag: "Baru", lokasi: "Living Dining Area — Floor", kecacatan: "Kesan kotoran (stains) pada lantai selepas kerja pembaikan (New Defect from Rectification Work)", status: "Kecacatan Baru" },
    { tag: "40", lokasi: "Living Dining Area — Wall", kecacatan: "Keretakan pada dinding bercat (Crack on painted wall)", status: "Belum Dibaiki" },
    { tag: "Baru", lokasi: "Utility Room — Floor", kecacatan: "Jurang kelihatan (visible gaps) pada jubin lantai selepas kerja pembaikan (New Defect from Rectification Work)", status: "Kecacatan Baru" },
    { tag: "48", lokasi: "Utility Room — M&E", kecacatan: "Merujuk kepada DB tagging, MCB ini sepatutnya spare tetapi mempunyai wayar hidup yang disambung", status: "Belum Dibaiki" },
    { tag: "49", lokasi: "Utility Room — M&E", kecacatan: "Kebanyakan tagging DB Box tidak tepat dengan fungsi MCB (contoh: tagged 'Wet Kitchen' tetapi fungsi sebenar adalah smart curtain). Perlu semak semula semua tagging", status: "Belum Dibaiki" },
    { tag: "86", lokasi: "Bathroom 4 — Plumbing & Sanitary", kecacatan: "Floor trap tidak sejajar dengan paip (Floor trap not aligned with pipe)", status: "Belum Dibaiki" },
    { tag: "Baru", lokasi: "Yard — Floor", kecacatan: "Sisa binaan (construction leftover) selepas kerja pembaikan (New Defect from Rectification Work)", status: "Kecacatan Baru" },
    { tag: "Baru", lokasi: "Yard — Floor", kecacatan: "Kesan kotoran (stains) pada jubin lantai selepas kerja pembaikan (New Defect from Rectification Work)", status: "Kecacatan Baru" },
    { tag: "119", lokasi: "Corridor — M&E", kecacatan: "Kebanyakan tagging Sub DB Box tidak tepat dengan fungsi MCB (contoh: tagged 'M/Bedroom' tetapi fungsi sebenar adalah Bedroom 2 Socket). Perlu semak semula semua tagging", status: "Belum Dibaiki" },
    { tag: "120", lokasi: "Corridor — Timber Flooring", kecacatan: "Kesan kotoran (stains) pada lantai kayu", status: "Belum Dibaiki" },
    { tag: "137", lokasi: "Master Bedroom — Timber Flooring", kecacatan: "Jurang kelihatan (visible gaps) pada lantai kayu", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "211", lokasi: "Bedroom 3 — Timber Floor", kecacatan: "Delaminasi lantai kayu — masih terdapat kesan hollowness / springiness pada lantai kayu", status: "Belum Dibaiki" },
    { tag: "243", lokasi: "Flat Roof 4 (Water Tank Area) — Floor", kecacatan: "Tanda air bertakung pada permukaan papak (Sign of water stagnant on slab surface)", status: "Belum Dibaiki" },
    { tag: "244", lokasi: "Flat Roof 4 (Water Tank Area) — Floor", kecacatan: "Keretakan pada permukaan dinding (Crack on wall surface)", status: "Belum Dibaiki" },
    { tag: "Baru", lokasi: "Bathroom 3 — Floor", kecacatan: "Kesan air kencing dan kesan kuning pada lantai selepas kerja pembaikan. Pemilik telah memaklumkan kepada site team bahawa jubin perlu ditukar terus dan bukan dibasuh sahaja — pihak site team telah dimaklumkan (aware)", status: "Kecacatan Baru" },
  ],

  kronologi: [
    { tarikh: "3 Julai 2023", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual H" },
    { tarikh: "4 April 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "10 April 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju melalui laman web EcoWorld (No. kes: MSP3-3C02-3216-001, -002, -003)" },
    { tarikh: "11 April 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju melalui laman web EcoWorld (No. kes: MSP3-3C02-3216-004, -005, -006)" },
    { tarikh: "11 Mei 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan telah dilakukan tetapi sebahagian kecacatan masih belum disiapkan sepenuhnya" },
    { tarikh: "10 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Kedua (Second Inspection) dijalankan — kecacatan masih wujud dan terdapat kecacatan baru akibat kerja pembaikan" },
    { tarikh: "13 Julai 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "28 Julai 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
  ],

  salinanKepada: [
    {
      nama: "MELIA SPRING SDN. BHD.",
      keterangan: "(Pejabat Johor / Johor Office)",
      alamat: [
        "The Tomorrow Centre,",
        "No. 9, 11, 15 & 17, Jalan Ekoperniagaan 1/6,",
        "Taman Ekoperniagaan,",
        "81100 Bandar Tebrau, Johor.",
      ],
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
doc.text(`${data.namaPembeli} & ${data.namaPembeli2}`, mL, y);
y += LH;

doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP} (${data.namaPembeli})`, mL, y); y += LH_S;
doc.text(`No. K/P: ${data.noKP2} (${data.namaPembeli2})`, mL, y); y += LH_S;
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
  `Kami, ${data.namaPembeli} (No. K/P: ${data.noKP}) dan ${data.namaPembeli2} (No. K/P: ${data.noKP2}), pemilik unit hartanah di alamat di atas, sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} (No. Rujukan SPA: ${data.noSPA}) mengikut ${data.jenisSPA}, telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan} dengan nombor kes ${data.noKesSerahan}. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`
);
y += 4;

numPara(2,
  `Namun, walaupun pihak tuan telah melaksanakan sebahagian kerja pembaikan, didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum disiapkan sepenuhnya, malah terdapat kecacatan baru yang berpunca daripada kerja pembaikan tersebut. Berdasarkan pemeriksaan kali kedua pada ${data.tarikhPemeriksaan2}, kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
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
const fn = `*Senarai kecacatan di atas merujuk kepada penemuan terkini dalam Laporan Pemeriksaan Kecacatan Kali Kedua pada ${data.tarikhPemeriksaan2}. Senarai lengkap kecacatan juga terkandung dalam Laporan Pemeriksaan Kecacatan Pertama yang telah dihantar melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period).`
);
y += 4;

numPara(4,
  `Dengan ini, kami mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan.`
);
y += 4;

numPara(5, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, kami akan:");
y += 2;
bullet("Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
bullet("Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.");
y += 4;

numPara(6,
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
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, kami akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);
y += 4;

para("Kami berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(46);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 12;
const sigCol2 = mL + 85;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
doc.line(sigCol2, y, sigCol2 + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPembeli})`, mL, y);
doc.text(`(${data.namaPembeli2})`, sigCol2, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y);
doc.text(`No. K/P: ${data.noKP2}`, sigCol2, y);
y += 4;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += 7;

// CC section
if (data.salinanKepada.length > 0) {
  checkBreak(18);
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
  doc.text("s.k. (CC):", mL, y);
  y += LH_S;
  for (const cc of data.salinanKepada) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
    doc.text(`${cc.nama} ${cc.keterangan}`, mL + 5, y); y += LH_S;
    doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
    const ccLines = doc.splitTextToSize(cc.alamat.join(" "), cW - 5);
    for (const al of ccLines) { doc.text(al, mL + 5, y); y += LH_S; }
    y += 2;
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
fs.writeFileSync("/home/user/admin/NOTIS_1_TEO.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_TEO.pdf");
console.log(`Total pages: ${totalPages}`);
