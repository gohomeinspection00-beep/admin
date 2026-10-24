const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/059",

  namaPembeli: "THIRUCHELVAM A/L SANMUGAM",
  alamatPengirim: [
    "No. 1, Jalan Puncak 5/9,",
    "Taman Puncak Tropicana,",
    "81500 Pekan Nenas,",
    "Johor.",
  ],
  noKP: "940808-06-5799",
  telefonPembeli: "010-903 9625",
  emailPembeli: "thirumacdrogba08@gmail.com",

  namaPemaju: "KSL MEDINI DEVELOPMENT SDN. BHD.",
  noSyarikat: "(201301044792 / 1074615-X)",
  alamatPenerima: (process.argv[2] === "KSLCITY") ? [
    "d/a KSL Holdings Berhad,",
    "L1-95, KSL City, No. 33, Jalan Seladang,",
    "Taman Abad, 80250 Johor Bahru,",
    "Johor.",
  ] : (process.argv[2] === "SKUDAI") ? [
    "(KSL Sales Office)",
    "Taman Nusa Bestari 2,",
    "81300 Skudai,",
    "Johor.",
  ] : [
    "(Pejabat Berdaftar / Registered Office)",
    "A-3-55, Pusat Komersial Bayu Tasek,",
    "Persiaran Southkey 1, Kota Southkey,",
    "80150 Johor Bahru, Johor.",
  ],

  alamatHartanah: "No. 1, Jalan Puncak 5/9, Taman Puncak Tropicana, 81500 Pekan Nenas, Johor (PTD 16655, HS(M) 7576, Mukim Jeram Batu)",
  jenisHartanah: "Rumah Teres 2 Tingkat (2 Storey Terrace House, 20' x 70', End Lot)",
  namaProyek: "Azalea Heights 2C — Taman Puncak Tropicana, Fasa 2C",

  noSPA: "30622-1/eSPA/100724/PTD16655/01",
  tarikhSPA: "19 Ogos 2024",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "15 September 2026",
  tarikhSerahanLaporan: "21 dan 22 September 2026",
  kaedahSerahanLaporan: "aplikasi pihak pemaju (SAMMO)",
  tarikhTamat30: "21 dan 22 Oktober 2026",

  tarikhNotis: "25 Oktober 2026",
  tarikhDeadline: "9 November 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "112", lokasi: "Bathroom 4 — Dinding", kecacatan: "Celahan ketara pada grouting jubin dinding (Visible gaps observed in wall tile grouting)", status: "Belum Dibaiki" },
    { tag: "113", lokasi: "Bathroom 4 — Siling", kecacatan: "Permukaan siling tidak rata (Uneven surface on ceiling — Finishing issue)", status: "Belum Dibaiki" },
    { tag: "114", lokasi: "Bathroom 4 — Siling", kecacatan: "Celahan pemisahan antara siling dan jubin dinding (Separation gaps between the ceiling and wall tiles — Jointing issue)", status: "Belum Dibaiki" },
    { tag: "115", lokasi: "Bathroom 4 — Siling", kecacatan: "Kelembapan tinggi pada siling di dalam manhole siling, dari arah Bathroom 3 (High moisture on ceiling inside ceiling manhole, from Bathroom 3 — bukti bacaan moisture meter)", status: "Belum Dibaiki" },
    { tag: "116", lokasi: "Bathroom 4 — Pintu", kecacatan: "Kesan kotoran pada bingkai pintu (Stains on door frame)", status: "Belum Dibaiki" },
    { tag: "117", lokasi: "Bathroom 4 — Pintu", kecacatan: "Kemek pada bingkai pintu (Dent on door frame)", status: "Belum Dibaiki" },
    { tag: "292", lokasi: "Water Tank Area — Lantai", kecacatan: "Air bertakung pada papak lantai (Stagnant water observed on the floor slab — Alignment issue)", status: "Belum Dibaiki" },
    { tag: "293", lokasi: "Water Tank Area — Lantai", kecacatan: "Keretakan pada papak lantai di seluruh kawasan (Cracks on floor slab throughout the area)", status: "Belum Dibaiki" },
    { tag: "302", lokasi: "AC Ledge (Top Roof) — Lantai", kecacatan: "Air bertakung pada lantai (Stagnant water observed on the floor — Alignment issue)", status: "Belum Dibaiki" },
    { tag: "303", lokasi: "AC Ledge (Top Roof) — Lantai", kecacatan: "Sisa binaan di atas papak lantai (Construction debris observed on the floor slab — Major defects)", status: "Belum Dibaiki" },
    { tag: "304", lokasi: "AC Ledge (Top Roof) — Lantai", kecacatan: "Celahan ketara antara papak lantai dan dinding (Visible gap observed between the floor slab and the wall — Jointing issue)", status: "Belum Dibaiki" },
    { tag: "308", lokasi: "Flat Roof (Terrace) — Lantai", kecacatan: "Keretakan pada papak lantai di seluruh kawasan (Cracks on floor slab throughout the area)", status: "Belum Dibaiki" },
    { tag: "310", lokasi: "RC Flat Roof — Lantai", kecacatan: "Tanda air bertakung (Sign of stagnant water — Alignment issue)", status: "Belum Dibaiki" },
    { tag: "311", lokasi: "RC Flat Roof — Lantai", kecacatan: "Air bertakung pada papak lantai (Stagnant water observed on the floor slab)", status: "Belum Dibaiki" },
    { tag: "312", lokasi: "RC Flat Roof — Lantai", kecacatan: "Keretakan pada papak lantai — keseluruhan papak (Crack on floor slab, all floor slab)", status: "Belum Dibaiki" },
    { tag: "316", lokasi: "Top Roof — Dinding", kecacatan: "Keretakan pada semua permukaan dinding (Crack observed on all wall surfaces)", status: "Belum Dibaiki" },
    { tag: "317", lokasi: "Top Roof — Bumbung", kecacatan: "Celahan ketara pada roof flashing (Visible gap observed on the roof flashing — Jointing issue)", status: "Belum Dibaiki" },
    { tag: "318", lokasi: "Top Roof — Talang", kecacatan: "Air bertakung dan sisa binaan di dalam gutter (Stagnant water and construction debris found inside the gutter)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "19 Ogos 2024", peristiwa: "Perjanjian Jual Beli (Sale and Purchase Agreement) ditandatangani — Azalea Heights 2C, Taman Puncak Tropicana (Ruj: 30622-1/eSPA/100724/PTD16655/01)" },
    { tarikh: "15 September 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (Full House Inspection) dijalankan ke atas hartanah" },
    { tarikh: "21 September 2026", peristiwa: "Laporan kecacatan dikemukakan melalui aplikasi pihak pemaju (SAMMO) — Defect 9996637-1 — merupakan notis bertulis di bawah Klausa 27(1)" },
    { tarikh: "22 September 2026", peristiwa: "Laporan kecacatan dikemukakan melalui aplikasi pihak pemaju (SAMMO) — Defect 1996947-2" },
    { tarikh: "21 dan 22 Oktober 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1) — TIADA kecacatan berstatus Completed di dalam sistem pihak pemaju; Defect 1996947-2 masih berstatus Pending" },
    { tarikh: "25 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "9 November 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada ${data.tarikhTamat30}, sehingga tarikh notis ini dikeluarkan kecacatan yang dilaporkan masih belum diselesaikan oleh pihak tuan. Malah, rekod aplikasi SAMMO pihak tuan sendiri mengesahkan bahawa TIADA satu pun kes berstatus "Completed" — Defect 9996637-1 masih berstatus "In Progress" manakala Defect 1996947-2 masih berstatus "Pending" tanpa sebarang tindakan. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Senarai penuh kecacatan adalah sebagaimana direkodkan di dalam Laporan Pemeriksaan Kecacatan (152 muka) yang telah dikemukakan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}, dan kesemuanya hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada item No. 115 — kelembapan tinggi (high moisture) pada siling di dalam manhole siling Bathroom 4, dari arah Bathroom 3, sebagaimana dibuktikan dengan bacaan moisture meter semasa pemeriksaan. Kelembapan tinggi pada siling adalah petanda kebocoran dari ruang di atasnya (contohnya paip atau lapisan kalis air bilik air). Pihak tuan dituntut MENYIASAT DAN MENGESAN PUNCA kelembapan tersebut dan membaikinya dengan sempurna — bukan sekadar pembaikan kosmetik pada permukaan siling — kerana kebocoran yang dibiarkan akan merebak dan merosakkan siling serta kemasan di sekitarnya.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada kluster AIR BERTAKUNG (water ponding) — item No. 292 (Water Tank Area), No. 302 (AC Ledge), No. 310 dan No. 311 (RC Flat Roof) serta No. 318 (gutter Top Roof). Takungan air yang berterusan menunjukkan kecerunan (falls) dan saliran yang tidak sempurna; ia akan mempercepatkan kemerosotan lapisan kalis air, mengundang kebocoran ke ruang di bawahnya dan menjadi tempat pembiakan nyamuk Aedes — pihak tuan dituntut membetulkan PUNCA, iaitu kecerunan permukaan dan laluan saliran, bukan sekadar mengeringkan takungan. Kluster KERETAKAN PAPAK DAN DINDING — item No. 293, No. 308, No. 312 dan No. 316 (keretakan menyeluruh di Water Tank Area, Flat Roof Terrace, RC Flat Roof dan semua permukaan dinding Top Roof) — hendaklah dibaiki mengikut amalan pembinaan yang baik memandangkan ia melibatkan kawasan terdedah cuaca yang berisiko resapan air. Item No. 303 dan No. 318 — sisa binaan di atas papak AC Ledge (kecacatan major) dan di dalam gutter — WAJIB dikeluarkan sepenuhnya; manakala item No. 317 — celahan pada roof flashing — mendedahkan rumah kepada risiko kebocoran air hujan dan hendaklah dibaiki mengikut spesifikasi. Memandangkan kesemua lokasi ini (Top Roof, RC Flat Roof, AC Ledge dan Water Tank Area) adalah kawasan yang sukar diakses oleh pemilik, pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui e-mel (${data.emailPembeli}) atau WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan.`
);
y += 4;

numPara(5,
  `Selain itu, kluster bunyi berongga (hollowness) — item No. 26 (dinding Living And Dining), No. 88 (dinding bercat Staircase), No. 186 (permukaan papak Flat Roof) dan No. 189 (dinding bercat Flat Roof) — menunjukkan lekatan lepaan/skrid yang tidak sempurna yang berisiko retak dan tertanggal; ia hendaklah dibaiki mengikut amalan pembinaan yang baik (hack dan lepa/skrid semula) dan bukan sekadar tampalan kosmetik. Item No. 191 — sisa binaan yang ditinggalkan di atas bumbung — WAJIB dikeluarkan sepenuhnya kerana ia boleh menyumbat talang dan merosakkan genting. Memandangkan sebahagian besar lokasi kerja (Top Roof dan Flat Roof) adalah kawasan yang sukar diakses oleh pemilik, pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui e-mel (${data.emailPembeli}) atau WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan.`
);
y += 4;

numPara(5,
  `Lebih membimbangkan, semakan terhadap rekod kes Defect 9996637-1 di dalam aplikasi SAMMO mendapati beberapa item telah ditanda "Completed" sedangkan pembaikan sebenarnya TIDAK dilaksanakan — ini merupakan SALAH NYATA STATUS PEMBAIKAN: (i) Item No. 45 ("Leakage observed on the ceiling") dan Item No. 50 ("Visible gaps around floor trap") ditanda "Completed" sedangkan gambar "selepas pembaikan" yang dimuat naik oleh kontraktor pihak tuan sendiri hanyalah NOTA BERTULIS TANGAN berbunyi "bukan orang paip — hantar kontraktor lain" dan "cat ceiling, bukan orang paip" — pengakuan jelas bahawa kerja pembaikan tidak dibuat kerana kontraktor yang dihantar bukan kontraktor paip; dan (ii) Item No. 8 ("Uneven surface on ceiling soffit", Carporch) ditanda "Completed" tetapi gambar "selepas pembaikan" yang dimuat naik menunjukkan KAWASAN YANG BERBEZA daripada kecacatan yang dilaporkan. Pihak tuan dituntut membetulkan status item-item tersebut di dalam sistem, menghantar kontraktor yang betul mengikut bidang kerja, dan mengemukakan bukti pembaikan sebenar di lokasi yang betul. Salinan rekod aplikasi bagi item-item tersebut dilampirkan sebagai LAMPIRAN A.`
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
// LAMPIRAN A — REKOD APLIKASI KSL (ITEM 8, 45, 50)
// ============================================================
const lampItems = [
  { file: "thiru-ksl-item8.jpg", w: 646, h: 1400, cap: "Lampiran A-1: Item No. 8 (Carporch — Uneven surface on ceiling soffit) ditanda \"Completed\" di dalam aplikasi SAMMO, tetapi gambar \"selepas pembaikan\" oleh kontraktor menunjukkan kawasan yang berbeza daripada kecacatan yang dilaporkan." },
  { file: "thiru-ksl-item45.jpg", w: 646, h: 1400, cap: "Lampiran A-2: Item No. 45 (Leakage observed on the ceiling) ditanda \"Completed\" — gambar \"selepas pembaikan\" oleh kontraktor hanyalah nota bertulis \"cat ceiling bukan orang paep TQ\"; kerja pembaikan paip tidak dilaksanakan." },
  { file: "thiru-ksl-item50.jpg", w: 646, h: 1400, cap: "Lampiran A-3: Item No. 50 (Yard — Visible gaps around floor trap) ditanda \"Completed\" — gambar \"selepas pembaikan\" oleh kontraktor hanyalah nota bertulis \"bukan org paip, hantar contractor lain\"; kerja pembaikan tidak dilaksanakan." },
  { file: "thiru-ksl-nota.jpg", w: 646, h: 1400, cap: "Lampiran A-4: Nota bertulis tangan yang dimuat naik oleh kontraktor pihak pemaju sebagai gambar \"selepas pembaikan\" — \"Bukan orang paep. Hantar contractor lain, tq.\"" },
];
for (const it of lampItems) {
  newPage();
  y = 25;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
  const lT2 = "LAMPIRAN A";
  doc.text(lT2, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(lT2) / 2, y + 1, pageW / 2 + doc.getTextWidth(lT2) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text("Rekod Aplikasi SAMMO — Status \"Completed\" Yang Tidak Tepat (Defect 9996637-1)", pageW / 2, y, { align: "center" });
  y += 8;
  const img = "data:image/jpeg;base64," + fs.readFileSync("/home/user/admin/" + it.file).toString("base64");
  let iw = 82; let ih = iw * it.h / it.w;
  if (ih > 185) { ih = 185; iw = ih * it.w / it.h; }
  const ix = (pageW - iw) / 2;
  doc.setLineWidth(0.3); doc.setDrawColor(0, 0, 0);
  doc.rect(ix - 1, y - 1, iw + 2, ih + 2);
  doc.addImage(img, "JPEG", ix, y, iw, ih);
  y += ih + 5;
  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
  const cl = doc.splitTextToSize(it.cap, cW - 10);
  for (const c of cl) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.3; }
}

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
const outName = (process.argv[2] === "KSLCITY") ? "NOTIS_1_THIRU_KSLCITY.pdf" : (process.argv[2] === "SKUDAI") ? "NOTIS_1_THIRU_SKUDAI.pdf" : "NOTIS_1_THIRU.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
