const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/068",

  namaPembeli: "NUR AFIQAH BINTI HASSAN",
  alamatPengirim: [
    "JBR 57, Kampung Liang Batu,",
    "Pagoh,",
    "84600 Muar,",
    "Johor.",
  ],
  noKP: "880922-23-5868",

  namaPemaju: "PAGOH JAYA (2000) SDN. BHD.",
  noSyarikat: "(199301001219 / 255956-P)",
  alamatPenerima: (process.argv[2] === "PAGOH") ? [
    "No. 1, Jalan Jaya 1/1,",
    "84600 Pagoh,",
    "Johor.",
    "Tel: 012-475 3503",
  ] : [
    "Lot 6.03 & 6.08, Tingkat 6,",
    "Plaza First Nationwide,",
    "161, Jalan Tun H.S. Lee,",
    "50000 Kuala Lumpur.",
  ],

  alamatHartanah: "No. 68, Jalan Jaya 3/6, Taman Pagoh Jaya, Pagoh, 84600 Muar, Johor (Geran 565566, Lot 22370 — dahulu HS(D) 39605, PTD 16992, Mukim Jorak)",
  jenisHartanah: "Rumah Teres 2 Tingkat (Double Storey Terrace House)",
  namaProyek: "Taman Pagoh Jaya, Pagoh, Muar",

  tarikhSPA: "15 Jun 2026",
  hargaBelian: "RM448,800.00",

  tarikhPemeriksaan1: "13 Oktober 2026",
  tarikhSerahanLaporan: "16 Oktober 2026",
  tarikhReInspection: "7 November 2026",

  tarikhNotis: "14 November 2026",
  tarikhDeadline: "29 November 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "26", lokasi: "Foyer — Siling", kecacatan: "Kebocoran pada siling berpunca dari Master Bathroom — disahkan dengan kamera termal (Leaking on ceiling from Master Bathroom — thermal camera evidence)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "27", lokasi: "Foyer — Pintu", kecacatan: "Kerosakan daun pintu telah dibaiki tetapi cat tidak rata (Damage rectified but uneven painting on door leaf)", status: "Belum Diselesaikan Sepenuhnya (Not Fully Complete)" },
    { tag: "30", lokasi: "Foyer — M&E", kecacatan: "Litar lampu disambung pada RCCB 0.03A — sepatutnya RCCB 0.1A mengikut kehendak Suruhanjaya Tenaga (Lighting point connected to 0.03A RCCB, should be 0.1A)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "44", lokasi: "Family Area — M&E", kecacatan: "Litar lampu pada RCCB 0.03A — sepatutnya 0.1A; litar water heater dan penghawa dingin sepatutnya di bawah litar kuasa, bukan litar lampu (kehendak Suruhanjaya Tenaga)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "45", lokasi: "Bedroom 2 — Dinding", kecacatan: "Dinding tidak sejajar dan beralun — ketara (Misaligned and wavy wall — Visible)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "60", lokasi: "Master Bathroom", kecacatan: "Celahan ketara pada penutup shower head — tidak lekat penuh pada jubin dinding (Visible gap on shower head cover plate)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "61", lokasi: "Ceiling Area (Master Bedroom) — Dinding", kecacatan: "Lubang-lubang pada dinding partition di dalam ruang siling (Holes on partition wall)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "62", lokasi: "Ceiling Area (Master Bedroom) — M&E", kecacatan: "KESEMUA penutup conduit fleksibel dan penutup junction box hilang (Missing all flexible conduit cover and all junction box cover)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "72", lokasi: "Water Tank Area — Paip", kecacatan: "Getaran pada paip masuk semasa tangki diisi (Vibration on incoming pipe when filling the water tank)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "73", lokasi: "Water Tank Area — Paip", kecacatan: "Simen di dalam slot sambungan floor trap dan penapis floor trap rosak (Cement on floor trap joint slot and damaged floor trap filter)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "74", lokasi: "Water Tank Area", kecacatan: "Tangki air di dalam keadaan kotor — perlu dibersihkan (Water tank in dirty condition)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "75", lokasi: "Balcony — Lantai", kecacatan: "Kesan air bertakung pada papak lantai (Sign of stagnant water on floor slab — Alignment Issue)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "76", lokasi: "Balcony — Lantai", kecacatan: "Shrinkage crack / spider web crack pada keseluruhan papak lantai (Crack on all floor slab area)", status: "Belum Diselesaikan Sepenuhnya (Not Fully Complete)" },
    { tag: "77", lokasi: "Balcony — Dinding", kecacatan: "Keretakan dan chipping pada dinding (Crack and chipping on wall)", status: "Belum Diselesaikan Sepenuhnya (Not Fully Complete)" },
    { tag: "84", lokasi: "Top Roof — Bumbung", kecacatan: "Kedapan tidak sempurna di sekeliling perabung bumbung (Improper seal around roof ridge)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "85", lokasi: "Top Roof — Bumbung", kecacatan: "Bukaan dan roof flashing longgar (Opening and loose roof flashing — Jointing Issue)", status: "Masih Belum Diselesaikan (Not Complete)" },
  ],

  kronologi: [
    { tarikh: "15 Jun 2026", peristiwa: "Perjanjian Jual Beli (Sale & Purchase Agreement) ditandatangani dengan Pagoh Jaya (2000) Sdn. Bhd. — harga belian RM448,800.00" },
    { tarikh: "13 Oktober 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (Full House Inspection) dijalankan ke atas hartanah oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM)" },
    { tarikh: "16 Oktober 2026", peristiwa: "Laporan Pemeriksaan Kecacatan (Defect Inspection Report, 91 muka surat) dikemukakan secara rasmi kepada pihak pemaju melalui WhatsApp rasmi pihak pemaju — diterima tanpa sebarang bantahan" },
    { tarikh: "Oktober — November 2026", peristiwa: "Pihak pemaju menjalankan kerja pembaikan ke atas kecacatan yang dilaporkan — pengakuan tanggungjawab pembaikan melalui tindakan (course of conduct)" },
    { tarikh: "7 November 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — ENAM BELAS (16) kecacatan disahkan masih belum diselesaikan" },
    { tarikh: "14 November 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "29 November 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pembeli dan pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} di antara saya dengan pihak tuan selaku pemaju dan penjual berdaftar, dengan harga belian ${data.hargaBelian}. Satu Pemeriksaan Kecacatan (Full House Inspection) telah dijalankan ke atas hartanah tersebut pada ${data.tarikhPemeriksaan1} oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM), dan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) telah dikemukakan secara rasmi kepada pihak tuan melalui WhatsApp rasmi pihak tuan pada ${data.tarikhSerahanLaporan}.`
);
y += 4;

numPara(2,
  `Pihak tuan telah MENERIMA laporan tersebut tanpa sebarang bantahan, dan seterusnya telah pun MENJALANKAN KERJA PEMBAIKAN ke atas kecacatan yang dilaporkan — suatu pengakuan jelas terhadap tanggungjawab pihak tuan untuk membaiki kecacatan mutu kerja (defective workmanship) pada hartanah ini sebagai pemaju yang membina dan menjual unit tersebut. Namun, Pemeriksaan Semula (Re-Inspection) yang dijalankan pada ${data.tarikhReInspection} mengesahkan bahawa ENAM BELAS (16) kecacatan masih belum diselesaikan atau belum disempurnakan oleh pihak tuan, seperti berikut:`
);
y += 5;

checkBreak(45);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
y += 6;

const colW = [13, 40, 70, cW - 13 - 40 - 70];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Status di atas adalah sebagaimana Laporan Pemeriksaan Semula (Re-Inspection Report) bertarikh ${data.tarikhReInspection}. Senarai penuh kecacatan adalah sebagaimana Laporan Pemeriksaan Kecacatan yang telah dikemukakan pada ${data.tarikhSerahanLaporan}, dan KESEMUANYA hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada item No. 26 — KEBOCORAN pada siling Foyer yang berpunca dari Master Bathroom, yang disahkan masih berterusan melalui pengimbas kamera termal semasa pemeriksaan semula. Pihak tuan dituntut MENGESAN DAN MEMBAIKI PUNCA kebocoran tersebut (termasuk lapisan kalis air dan sambungan paip di Master Bathroom) dan bukan sekadar mengecat semula kesan pada siling, memandangkan kebocoran yang dibiarkan akan merosakkan siling, kemasan dan pendawaian di sekitarnya.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada kluster kecacatan elektrik yang melibatkan KESELAMATAN — item No. 30 dan No. 44 (litar lampu disambung pada RCCB 0.03A sedangkan kehendak Suruhanjaya Tenaga memperuntukkan litar lampu dilindungi RCCB 100mA (0.1A), dan litar water heater serta penghawa dingin sepatutnya berada di bawah litar kuasa) serta item No. 62 (KESEMUA penutup conduit fleksibel dan junction box hilang di ruang siling — pendawaian terdedah). Ketidakpatuhan ini mendedahkan penghuni kepada risiko kejutan elektrik dan kebakaran; semua pembaikan elektrik hendaklah dilaksanakan oleh orang kompeten elektrik dan dibuktikan mematuhi kehendak Suruhanjaya Tenaga.`
);
y += 4;

numPara(5,
  `Bagi kluster bumbung — item No. 84 (kedapan tidak sempurna sekeliling perabung) dan No. 85 (bukaan dan roof flashing longgar) — ia mendedahkan ruang dalaman rumah kepada risiko kebocoran air hujan dan WAJIB dibaiki mengikut spesifikasi pengilang. Bagi kawasan tangki air — item No. 72 (getaran paip masuk), No. 73 (simen di dalam slot floor trap dan penapis rosak) dan No. 74 (tangki kotor) — ia melibatkan kebersihan dan keselamatan bekalan air domestik dan hendaklah dibersihkan serta dibaiki sepenuhnya. Memandangkan lokasi kerja (Top Roof, ruang siling dan Water Tank Area) sukar diakses oleh pemilik, pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) sebagai bukti penyiapan.`
);
y += 4;

numPara(6,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari.`
);
y += 4;

numPara(7, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:");
y += 2;
bullet("Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah — dan jumlah tersebut akan menjadi asas tuntutan kos pembaikan terhadap pihak tuan;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan; dan");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) selaku pihak berkuasa ke atas pemaju perumahan berlesen, dan/atau mengambil tindakan undang-undang sivil untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.");
y += 4;

numPara(8,
  `Merujuk kepada Klausa 28 Perjanjian Jual Beli, sebarang notis yang dihantar melalui pos berdaftar ke alamat pihak tuan atau diserahkan secara serahan tangan adalah dianggap sah dan diterima pakai sebagai penyampaian yang sempurna.`
);
y += 4;

para("Saya berharap pihak tuan menyelesaikan baki kecacatan ini dengan segera, sebagaimana komitmen pembaikan yang telah pihak tuan sendiri mulakan. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(70);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 18;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPembeli})`, mL, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += 7;

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

const krColW = [48, cW - 48];
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
const outName = (process.argv[2] === "PAGOH") ? "NOTIS_1_NURAFIQAH_PAGOH.pdf" : "NOTIS_1_NURAFIQAH.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
