const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukanNotis2: "NOTIS-2/2026/024",
  noRujukanNotis1: "NOTIS-1/2026/024",

  namaPembeli: "ARIDHASAN A/L MENANDI",
  alamatPengirim: [
    "No. 28, Jalan Uda Utama 2/6,",
    "Bandar Uda Utama,",
    "81200 Johor Bahru,",
    "Johor.",
  ],
  emailPembeli: "eswari9583@yahoo.com",
  telefonPembeli: "017-225 0417",
  noKP: "830128-07-5427",

  namaPemaju: "UDA LAND (SOUTH) SDN. BHD.",
  noSyarikat: "(197501001813 / 23298-K)",
  alamatPenerima: (process.argv[2] === "JB") ? [
    "No. 1, Jalan Padi Mahsuri 12,",
    "Bandar Baru Uda,",
    "81200 Johor Bahru,",
    "Johor.",
  ] : [
    "Tingkat 15, Blok Menara,",
    "Kompleks Pertama,",
    "Jalan Tuanku Abdul Rahman,",
    "50100 Kuala Lumpur.",
  ],

  alamatHartanah: "No. 28, Jalan Uda Utama 2/6, Bandar Uda Utama, 81200 Johor Bahru, Johor",
  jenisHartanah: "Rumah Berkembar 2 Tingkat (2 Storey Semi-Detached)",

  noRujukanSPA: "8971-17/eSPA/161024/PTD217654/01",
  tarikhSPA: "16 Oktober 2024",
  jenisSPA: "Jadual G",
  klausaSPA: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhSerahanLaporan: "28 April 2026",
  kaedahSerahanLaporan: "aplikasi ProFix (Batch 1: 342 kecacatan; Batch 2 dan 3 pada 28 dan 29 Julai 2026: 159 dan 114 kecacatan)",

  tarikhNotis1: "15 Ogos 2026",
  tarikhDeadlineNotis1: "11 September 2026",
  tempohNotis1: "15",
  kaedahPenghantaranNotis1: "serahan fizikal (by hand)",

  tarikhReInspection: "24 September 2026",

  tarikhNotis2: "1 Oktober 2026",
  tarikhDeadlineNotis2: "16 Oktober 2026",
  tempohNotis2: "15",
  kaedahPenghantaranNotis2: "serahan rasmi",

  kecacatan: [
    { tag: "16", lokasi: "Guest Room — Wall", kecacatan: "Ketidakjajaran ketara pada dinding masih ada (Visible alignment issue still observed)", status: "Belum Dibaiki" },
    { tag: "17", lokasi: "Dry Kitchen — Wall", kecacatan: "Ketidakjajaran pada dinding masih ada (Alignment issue on wall still observed)", status: "Belum Dibaiki" },
    { tag: "18", lokasi: "Dry Kitchen — Wall", kecacatan: "Ketidakjajaran ketara pada dinding masih ada (Visible alignment issue still observed)", status: "Belum Dibaiki" },
    { tag: "19", lokasi: "Dry Kitchen — M&E", kecacatan: "Soket masih longgar (Loose socket still observed)", status: "Belum Dibaiki" },
    { tag: "21", lokasi: "Toilet — Plumbing & Sanitary", kecacatan: "Kebocoran pada paip besen masih ada (Leaking on basin down pipe still observed)", status: "Belum Dibaiki" },
    { tag: "24", lokasi: "Staircase — Wall", kecacatan: "Ketidakjajaran pada dinding masih ada (Alignment issue on wall still observed)", status: "Belum Dibaiki" },
    { tag: "26", lokasi: "Family Area — M&E", kecacatan: "Ujian rintangan penebatan GAGAL: dua (2) MCB mencatat bacaan 0.19 Megaohm dan 0.20 Megaohm (Live-Neutral), di bawah nilai minimum 1.0 Megaohm yang diwajibkan di bawah MS IEC 60364-6; wayar live yang gagal ujian sebelum ini didapati dipindahkan ke MCB lain tanpa pembaikan (Insulation resistance test failed on two MCBs — retested 27 September 2026)", status: "Belum Dibaiki" },
    { tag: "29", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Kebocoran pada paip besen (Leaking on basin down pipe) — KECACATAN BARU", status: "Kecacatan Baru — Belum Dibaiki" },
    { tag: "30", lokasi: "Master Bathroom — Glass Panel", kecacatan: "Pintu kaca tidak dapat dibuka 90 darjah — tersekat dengan shower head, perlu semakan (Glass door cannot open 90 degrees, stuck with shower head)", status: "Belum Dibaiki" },
    { tag: "33", lokasi: "Bedroom 3 — Door", kecacatan: "Daun pintu tidak rapat dengan bingkai dan berbunyi apabila ditutup (Door leaf cannot flush with door frame, rattling sound) — KECACATAN BARU AKIBAT KERJA PEMBAIKAN", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "34", lokasi: "Bathroom 3 — Plumbing & Sanitary", kecacatan: "Kebocoran pada paip besen masih ada (Leaking on basin down pipe still observed)", status: "Belum Dibaiki" },
    { tag: "36", lokasi: "Water Tank Area — Floor", kecacatan: "Air bertakung pada papak masih ada (Water stagnant on slab still observed)", status: "Belum Dibaiki" },
    { tag: "38", lokasi: "Flat Roof 1 (Car Porch) — Floor", kecacatan: "Lapisan kalis air melengkung masih ada (Warping waterproofing layer still observed)", status: "Belum Dibaiki" },
    { tag: "41", lokasi: "Flat Roof 2 (Top Roof) — Floor", kecacatan: "Keretakan pada keseluruhan permukaan papak masih ada (All of slab surface still have crack)", status: "Belum Dibaiki" },
    { tag: "43", lokasi: "Flat Roof 2 (Top Roof) — Wall", kecacatan: "Keretakan pada kebanyakan permukaan dinding masih ada (Crack on most of wall surface still observed)", status: "Belum Dibaiki" },
    { tag: "44", lokasi: "Flat Roof 3 (Top Roof - Rear) — Floor", kecacatan: "Keretakan pada keseluruhan permukaan papak masih ada (All of slab surface still have crack)", status: "Belum Dibaiki" },
    { tag: "45", lokasi: "Flat Roof 3 (Top Roof - Rear) — Wall", kecacatan: "Keretakan pada keseluruhan dinding masih ada (All of wall still have crack)", status: "Belum Dibaiki" },
    { tag: "48", lokasi: "Metal Deck Area — Metal Deck", kecacatan: "Kemungkinan air bertakung pada metal deck masih ada (Possible water stagnant on metal deck still observed)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "16 Oktober 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "21 April 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama — laporan Batch 1 (342 kecacatan) dihantar melalui aplikasi ProFix pada 28 April 2026" },
    { tarikh: "28 Mei 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju" },
    { tarikh: "27 Julai 2026", peristiwa: "Pemeriksaan Kedua (Re-Inspection) — laporan Batch 2 (159 kecacatan) dan Batch 3 (114 kecacatan) dihantar melalui aplikasi ProFix pada 28 dan 29 Julai 2026" },
    { tarikh: "15 Ogos 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan — Ruj. NOTIS-1/2026/024" },
    { tarikh: "27 Ogos 2026", peristiwa: "Notis Pertama diserahkan secara fizikal (by hand) dan DIAKUI TERIMA oleh wakil pemaju, En. Mohd Sharil bin Kamsan (Officer), dengan cop rasmi DITERIMA (rujuk Lampiran A)" },
    { tarikh: "11 September 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari dari tarikh serahan 27 Ogos 2026) — kecacatan masih belum diselesaikan" },
    { tarikh: "24 September 2026", peristiwa: "Pemeriksaan Ketiga (Third Inspection) oleh Building Surveyor berdaftar RISM — 49 penemuan masih belum diselesaikan, termasuk kecacatan baru; ujian semula elektrik pada 27 September 2026 mengesahkan rintangan penebatan masih gagal" },
    { tarikh: "1 Oktober 2026", peristiwa: "Laporan Pemeriksaan Ketiga dihantar kepada pemaju melalui aplikasi ProFix" },
    { tarikh: "1 Oktober 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan" },
    { tarikh: "16 Oktober 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
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
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Tel: ${data.telefonPembeli}`, mL, y); y += LH_S;

y += 3;

doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text(`${data.namaPemaju} ${data.noSyarikat}`, mL, y);
y += LH_S;

doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.BODY);
for (const line of data.alamatPenerima) { doc.text(line, mL, y); y += LH_S; }

doc.text(data.tarikhNotis2, pageW - mR, y - LH_S, { align: "right" });

y += 3;

doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukanNotis2}`, mL, y);
y += LH_S;
doc.text(`Ruj. Notis Pertama: ${data.noRujukanNotis1}`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkara1 = "Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan";
const perkara2 = "(Final Notice — Defect Rectification Claim)";
const perkara3 = `Hartanah di ${data.alamatHartanah}`;
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
  `Merujuk kepada Notis Pertama (First Notice) bertarikh ${data.tarikhNotis1} dengan nombor rujukan ${data.noRujukanNotis1}, yang telah diserahkan secara fizikal (by hand) kepada pihak tuan pada 27 Ogos 2026 dan telah DIAKUI TERIMA oleh wakil pihak tuan, En. Mohd Sharil bin Kamsan (Officer), dengan cop rasmi "DITERIMA 27 AUG 2026" (salinan Akuan Terima dilampirkan sebagai Lampiran A), pihak tuan telah diberikan tempoh ${data.tempohNotis1} hari dari tarikh serahan tersebut, iaitu sehingga ${data.tarikhDeadlineNotis1}, untuk melaksanakan pembaikan kecacatan selaras dengan tanggungjawab pemaju di bawah Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}) dan Seksyen 12(2) Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118].`
);
y += 4;

numPara(2,
  `Namun, hasil daripada Pemeriksaan Ketiga (Third Inspection) yang dijalankan pada ${data.tarikhReInspection} oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM), didapati kesemua 49 penemuan yang direkodkan masih belum diselesaikan oleh pihak tuan — termasuk beberapa KECACATAN BARU yang berlaku akibat kerja pembaikan pihak tuan sendiri. Ini bermakna pihak tuan telah gagal mematuhi Notis Pertama yang dikeluarkan. Laporan Pemeriksaan Ketiga penuh disertakan bersama-sama notis ini. Antara kecacatan yang masih belum diselesaikan adalah seperti berikut:`
);
y += 5;

checkBreak(60);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
y += LH_S;
doc.text("(List of Outstanding Defects)", mL, y);
y += 6;

const colW = [15, 40, 55, cW - 15 - 40 - 55];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Senarai di atas hanyalah sebahagian daripada 49 penemuan Pemeriksaan Ketiga. Senarai penuh adalah sebagaimana Laporan Pemeriksaan Ketiga bertarikh ${data.tarikhReInspection} yang disertakan bersama-sama notis ini, serta laporan-laporan terdahulu yang dihantar melalui ${data.kaedahSerahanLaporan}.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada item No. 26 — kegagalan ujian rintangan penebatan (insulation resistance test) yang melibatkan KESELAMATAN elektrik: dua (2) MCB mencatat bacaan 0.19 Megaohm dan 0.20 Megaohm (Live-Neutral), jauh di bawah nilai minimum 1.0 Megaohm yang diwajibkan di bawah MS IEC 60364-6. Lebih membimbangkan, wayar live yang sebelum ini dilaporkan gagal ujian didapati hanya DIPINDAHKAN ke MCB lain tanpa pembaikan sebenar dilaksanakan. Saya menuntut agar pihak tuan menjalankan siasatan dan pembaikan penuh terhadap litar yang terjejas oleh orang kompeten (competent person), dan mengemukakan keputusan ujian rintangan penebatan yang terkini kepada saya sebaik kerja pembaikan disiapkan. Perhatian turut diberikan kepada kebocoran paip besen yang masih berterusan di TIGA bilik air (item No. 21, 29 dan 34).`
);
y += 4;

numPara(4,
  `Berhubung isu arah bukaan pintu bi-fold di Bathroom 2 dan Bathroom 3 serta pintu pagar (gate) yang tidak mengikut Pelan Lantai (Floor Plan) yang diluluskan di dalam Perjanjian Jual Beli (item No. 7 dan No. 8 Notis Pertama): atas dasar tolak ansur, saya TIDAK menuntut penukaran arah bukaan tersebut, DENGAN SYARAT pihak tuan mengemukakan kepada saya lukisan terkini yang diluluskan (latest approved / as-built drawing) yang menunjukkan arah bukaan sebenar sebagaimana yang sedia ada, sebagai dokumen rasmi bagi rekod dan rujukan saya selaku pembeli. Begitu juga, bagi item No. 30 — pintu kaca di Master Bathroom yang tidak dapat dibuka sepenuhnya (90 darjah) kerana tersekat dengan shower head — keadaan ini menyusahkan kami setiap kali membuka pintu tersebut tanpa terkena shower head. Oleh itu, kami meminta pihak tuan menyemak semula bukaan pintu kaca tersebut dan memberikan PENJELASAN RASMI sama ada ia mengikut reka bentuk yang diluluskan ataupun kesilapan pemasangan, serta melaksanakan pembetulan yang sewajarnya.`
);
y += 4;

numPara(5,
  `Selanjutnya, bagi mana-mana kecacatan yang pihak tuan berpendapat tidak dapat dibaiki atau tidak akan dibaiki (contohnya hollowness pada dinding atau jubin dan seumpamanya), pihak tuan dituntut memberikan PENJELASAN RASMI SECARA BERTULIS berserta dokumen sokongan yang sewajarnya (justifikasi teknikal / pengesahan / proper documentation and support) bagi setiap item berkenaan — dan bukan sekadar menandakan kes sebagai selesai di dalam aplikasi tanpa sebarang penjelasan.`
);
y += 4;

numPara(6,
  `Dengan ini, saya mengeluarkan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadlineNotis2}. Notis Kedua ini menjadikan keseluruhan tempoh tiga puluh (30) hari telah diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan selaras dengan Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}).`
);
y += 4;

numPara(7,
  `Merujuk kepada Klausa Penyampaian Dokumen ${data.klausaSerahan} (Service of Documents) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi.`
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
  `Sekiranya pihak tuan masih gagal mengambil tindakan pembaikan selepas Notis Kedua (Final Notice) ini tamat tempohnya pada ${data.tarikhDeadlineNotis2}, saya akan tanpa berlengah lagi mengambil tindakan berikut:`
);
y += 2;

bullet("Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya;");
bullet("Menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan 5% (Retention Sum 5%) yang sedang dipegang sebagaimana diperuntukkan di bawah Klausa 27(2) Perjanjian Jual Beli (Jadual G);");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
y += 4;

checkBreak(80);
para("Saya berharap pihak tuan mengambil tindakan segera dan muktamad terhadap Notis Kedua ini. Ini merupakan notis akhir sebelum tindakan undang-undang dimulakan. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 10;

checkBreak(46);
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
// KRONOLOGI TINDAKAN
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
// LAMPIRAN A — BUKTI AKUAN TERIMA NOTIS 1
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
doc.text("Bukti Akuan Terima Notis Pertama oleh Pemaju", pageW / 2, y, { align: "center" });
y += 5;
doc.text("(Proof of Developer's Acknowledgement of Receipt — First Notice)", pageW / 2, y, { align: "center" });
y += 8;

const akuanImg = fs.readFileSync("/home/user/admin/aridhasan-bukti-akuan.jpg");
const akuanB64 = "data:image/jpeg;base64," + akuanImg.toString("base64");
const imgW = 100; const imgH = 160;
doc.addImage(akuanB64, "JPEG", (pageW - imgW) / 2, y, imgW, imgH);
y += imgH + 6;

doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const capText = "Akuan Terima Notis Pertama (Ruj: NOTIS-1/2026/024) — diterima dan ditandatangani oleh En. Mohd Sharil bin Kamsan (Officer) pada 27 Ogos 2026, dengan cop rasmi DITERIMA 27 AUG 2026.";
const capLines = doc.splitTextToSize(capText, cW - 20);
for (const cl of capLines) { doc.text(cl, pageW / 2, y, { align: "center" }); y += 4.5; }

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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan (Final Notice — Defect Rectification Claim) bertarikh ${data.tarikhNotis2} dengan rujukan ${data.noRujukanNotis2} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
  doc.text(`Ruj: ${data.noRujukanNotis2}`, mL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

const out = doc.output("arraybuffer");
const outName = (process.argv[2] === "JB") ? "NOTIS_2_ARIDHASAN_JB.pdf" : "NOTIS_2_ARIDHASAN.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
