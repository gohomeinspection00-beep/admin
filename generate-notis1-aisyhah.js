const { jsPDF } = require("jspdf");
const fs = require("fs");

const VERSI = process.argv[2] || "SERKAM";

const ALAMAT = {
  SERKAM: [
    "(Pejabat Jualan / Sales Office)",
    "JC 8165, PT 7209,",
    "Persimpangan Jalan Baru Serkam,",
    "77300 Mukim Jasin, Melaka.",
  ],
  SELANGOR: [
    "(Pejabat Berdaftar / Registered Office)",
    "No. 9, Persiaran Selangor, Seksyen 15,",
    "40200 Shah Alam,",
    "Selangor.",
  ],
};

const data = {
  noRujukan: "NOTIS-1/2026/044",

  namaPembeli: "SITI AISYHAH BINTI MOHD ISMAIL",
  noKP: "000815-10-0214",
  namaPembeli2: "MUHAMMAD FIRDAUS BIN AB SAMAT",
  noKP2: "000818-04-0253",
  alamatPengirim: [
    "No. 26, KM 22,",
    "Jalan Permatang Bukit 2,",
    "77300 Merlimau,",
    "Melaka.",
  ],
  telefonPembeli: "017-378 5523",
  emailPembeli: "aisyhah.ismail0815@gmail.com",

  namaPemaju: "SCIENTEX HEIGHTS SDN. BHD.",
  noSyarikat: "(198801002898 / 170255-V)",
  alamatPenerima: ALAMAT[VERSI],

  alamatHartanah: "JD 6515, Jalan BSJ P2/1, Bandar Scientex Jasin Presint 2, 77300 Merlimau, Melaka",
  jenisHartanah: "Rumah Teres 2 Tingkat (Lot JP24, PT 11089, H.S.(D) 26413, Mukim Jasin)",
  namaProyek: "Scientex Bandar Jasin, Fasa 2A1",

  noSPA: "6575-44/eSPA/120724/PT11089/01",
  tarikhSPA: "22 Julai 2024",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "16 Julai 2026",
  tarikhSerahanLaporan: "22 Julai 2026",
  kaedahSerahanLaporan: "serahan tangan (hardcopy)",
  tarikhTamat30Hari: "21 Ogos 2026",
  tarikhReInspection: "9 September 2026",

  tarikhNotis: "14 September 2026",
  tarikhDeadline: "29 September 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "16", lokasi: "Carporch — Ceiling", kecacatan: "Kesan air (watermark) dan kebocoran pada permukaan siling (Watermark and leaking on ceiling surface — still observed)", status: "Belum Dibaiki" },
    { tag: "28", lokasi: "Backyard — Floor", kecacatan: "Keretakan pada permukaan simen manhole (Crack on manhole cement surface — still observed)", status: "Belum Dibaiki" },
    { tag: "30", lokasi: "Backyard — Floor", kecacatan: "Hollowness pada papak lantai (Hollowness on floor slab — still observed)", status: "Belum Dibaiki" },
    { tag: "33", lokasi: "Backyard — Wall", kecacatan: "Keretakan dan shrinkage cracks pada keseluruhan permukaan dinding (Cracks and shrinkage cracks on all wall surface — still observed)", status: "Belum Dibaiki" },
    { tag: "41", lokasi: "Backyard — Plumbing & Sanitary", kecacatan: "Sistem saliran tidak sempurna — tanah merah keluar bersama air semasa ujian flushing dan sebahagian paip tersumbat; objek masih menyebabkan sumbatan (Poor Drainage System — red soil during flushing test, pipe clogged, still observed)", status: "Belum Dibaiki" },
    { tag: "47", lokasi: "Kitchen — Wall", kecacatan: "Dinding tidak sejajar (Misaligned wall — visible, still observed)", status: "Belum Dibaiki" },
    { tag: "48", lokasi: "Kitchen — Wall", kecacatan: "Dinding tidak sejajar (Misaligned wall — visible, still observed)", status: "Belum Dibaiki" },
    { tag: "49", lokasi: "Kitchen — Wall", kecacatan: "Ketidakjajaran ketara pada dinding sekeliling tingkap (Visible alignment issue on wall around window — still observed)", status: "Belum Dibaiki" },
    { tag: "62", lokasi: "Bathroom 3 — Plumbing & Sanitary", kecacatan: "Kebocoran pada stopcock akibat stopcock longgar (Leaking on stopcock caused by loose stopcock — still observed)", status: "Belum Dibaiki" },
    { tag: "67", lokasi: "Bedroom 4 — Wall", kecacatan: "Dinding tidak sejajar (Wall alignment issue — still observed)", status: "Belum Dibaiki" },
    { tag: "74", lokasi: "Living and Dining — Wall", kecacatan: "Dinding tidak sejajar (Misaligned wall — visible, still observed)", status: "Belum Dibaiki" },
    { tag: "75", lokasi: "Living and Dining — Wall", kecacatan: "Keseluruhan dinding tidak sejajar dengan ukuran tidak konsisten dan permukaan beralun (Overall wall misaligned, inconsistent measurement and wavy surface — still observed)", status: "Belum Dibaiki" },
    { tag: "91", lokasi: "Family Hall — Wall", kecacatan: "Dinding tidak sejajar (Misaligned wall — visible, still observed)", status: "Belum Dibaiki" },
    { tag: "96", lokasi: "Bedroom 2 — Wall", kecacatan: "Ukuran dinding tidak konsisten dengan jubin lantai — 29.5cm berbanding 27cm — ketidakjajaran ketara (Wall inconsistent measurements with floor tiles, 29.5cm and 27cm — still observed)", status: "Belum Dibaiki" },
    { tag: "121", lokasi: "Master Bedroom — Wall", kecacatan: "Dinding tidak sejajar (Misaligned on wall — still observed)", status: "Belum Dibaiki" },
    { tag: "122", lokasi: "Master Bedroom — Wall", kecacatan: "Ukuran dinding tidak konsisten dengan jubin lantai — 27cm berbanding 29.5cm — ketidakjajaran ketara (Wall inconsistent measurements with floor tiles, 27cm and 29.5cm — still observed)", status: "Belum Dibaiki" },
    { tag: "146", lokasi: "Ceiling Area (Master Bedroom) — Roof", kecacatan: "Kemek pada roof truss (Dented on roof truss — Major Defect, still observed)", status: "Belum Dibaiki" },
    { tag: "147", lokasi: "Ceiling Area (Master Bedroom) — Plumbing & Sanitary", kecacatan: "Tiada sokongan sempurna pada distribution pipe yang bersambung ke tangki air (Missing proper support for distribution pipe connected to water tank — still observed)", status: "Belum Dibaiki" },
    { tag: "148", lokasi: "Water Tank Area — Floor", kecacatan: "Tanda air bertakung pada papak lantai (Sign of water stagnant on floor slab — still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "149", lokasi: "Water Tank Area — Floor", kecacatan: "Air bertakung pada papak lantai (Water stagnant on floor slab — still observed)", status: "Belum Dibaiki" },
    { tag: "150", lokasi: "Water Tank Area — Floor", kecacatan: "Keretakan dan kerosakan pada papak lantai — semua kawasan lantai (Crack and damage on floor slab, all floor area — still observed)", status: "Belum Dibaiki" },
    { tag: "151", lokasi: "Water Tank Area — Floor", kecacatan: "Sisa binaan pada papak lantai — semua kawasan lantai (Construction leftover on floor slab, all floor area — Major Defect, still observed)", status: "Belum Dibaiki" },
    { tag: "152", lokasi: "Water Tank Area — Wall", kecacatan: "Keretakan pada dinding — semua permukaan dinding (Crack on wall, all wall surface — still observed)", status: "Belum Dibaiki" },
    { tag: "153", lokasi: "Water Tank Area — Ceiling", kecacatan: "Lubang pada ceiling board terlalu besar (Hole on ceiling board too wide — still observed)", status: "Belum Dibaiki" },
    { tag: "154", lokasi: "Water Tank Area — Window", kecacatan: "Celahan ketara sekeliling bingkai tingkap (Visible gap around window frame — still observed)", status: "Belum Dibaiki" },
    { tag: "155", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Kebocoran pada incoming pipe stopcock (Leaking on incoming pipe stopcock — still observed)", status: "Belum Dibaiki" },
    { tag: "156", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Tiada sokongan sempurna pada distribution pipe yang bersambung ke tangki air (Missing proper support for distribution pipe connected to water tank — still observed)", status: "Belum Dibaiki" },
    { tag: "157", lokasi: "Water Tank Area — Fixtures", kecacatan: "Tangki air dalam keadaan kotor dan perlu dibersihkan (Water tank in dirty condition, need to be cleaned — still observed)", status: "Belum Dibaiki" },
    { tag: "158", lokasi: "RC Flat Roof — Floor", kecacatan: "Tanda air bertakung pada papak lantai (Sign of water stagnant on floor slab — still observed)", status: "Belum Dibaiki" },
    { tag: "159", lokasi: "RC Flat Roof — Floor", kecacatan: "Air bertakung pada papak lantai (Water stagnant on floor slab — still observed)", status: "Belum Dibaiki" },
    { tag: "164", lokasi: "RC Flat Roof — Ceiling", kecacatan: "Celahan ketara pada siling — jointing issue (Visible gap on ceiling — still observed)", status: "Belum Dibaiki" },
    { tag: "165", lokasi: "Top Roof — Roof", kecacatan: "Lubang pada genting bumbung (Got hole on roof tiles — still observed)", status: "Belum Dibaiki" },
    { tag: "166", lokasi: "Top Roof — Roof", kecacatan: "Penyendalan simen tidak konsisten sekeliling roof ridge — simen tertanggal (Inconsistent cement seal around roof ridge, detach cement — still observed)", status: "Belum Dibaiki" },
    { tag: "167", lokasi: "Top Roof — Roof", kecacatan: "Chipping dan keretakan pada genting bumbung (Chipping and crack on roof tiles — Major Defect, still observed)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "22 Julai 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "16 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "22 Julai 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara serahan tangan (hardcopy) kepada pihak pemaju" },
    { tarikh: "21 Ogos 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "9 September 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — 34 kecacatan masih belum dibaiki / belum disiapkan sepenuhnya" },
    { tarikh: "14 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "29 September 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada ${data.tarikhTamat30Hari}, Pemeriksaan Semula (Re-Inspection) yang dijalankan pada ${data.tarikhReInspection} mengesahkan bahawa kecacatan masih belum diselesaikan oleh pihak tuan. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung dalam Laporan Pemeriksaan Kecacatan Kali Pertama yang diserahkan pada ${data.tarikhSerahanLaporan} dan Laporan Pemeriksaan Semula (Re-Inspection Report) bertarikh ${data.tarikhReInspection}.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(6); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period), dalam masa tiga puluh (30) hari selepas menerima notis bertulis daripada pembeli.`
);
y += 4;

numPara(4,
  `Perhatian khusus diberikan kepada isu KETIDAKJAJARAN DINDING (wall alignment issues) yang meluas — item No. 47, 48, 49, 67, 74, 75, 91, 96, 121 dan 122 — merangkumi Kitchen, Living and Dining, Family Hall, Bedroom 2, Bedroom 4 dan Master Bedroom, termasuk bukti ukuran yang tidak konsisten antara dinding dan jubin lantai (27cm berbanding 29.5cm) serta permukaan dinding yang beralun. Ini menunjukkan mutu kerja pembinaan dinding yang tidak mengikut piawaian. Kami menuntut agar pihak tuan memperbetulkan KESEMUA permukaan dinding yang tidak sejajar mengikut piawaian kerja yang sepatutnya, dan bukan sekadar kemasan kosmetik. Perhatian turut diberikan kepada item No. 146 (roof truss kemek — kecacatan major yang melibatkan struktur bumbung) serta kebocoran aktif pada item No. 62 dan No. 155 (stopcock bocor) dan item No. 16 (kesan air dan kebocoran pada siling carporch).`
);
y += 4;

numPara(5,
  `Bagi item No. 41 — sistem saliran di Backyard didapati tidak sempurna: tanah merah keluar bersama air semasa ujian flushing dan sebahagian paip masih tersumbat oleh objek di dalamnya. Kami menuntut agar pihak tuan menyemak dan membersihkan keseluruhan sistem saliran serta memastikan tiada halangan dan kecerunan paip yang betul, dan bukan sekadar pembersihan permukaan manhole.`
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
const outName = VERSI === "SELANGOR" ? "NOTIS_1_AISYHAH_SELANGOR.pdf" : "NOTIS_1_AISYHAH_SERKAM.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
