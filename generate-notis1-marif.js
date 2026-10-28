const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/061",

  namaPembeli: "MUHAMMAD ARIF BIN MOHD ISHAK",
  alamatPengirim: [
    "Pos 65, Kg. Paya Panjang,",
    "Bukit Pasir,",
    "84300 Muar,",
    "Johor.",
  ],
  noKP: "921124-01-6933",
  telefonPembeli: "017-614 2425",
  emailPembeli: "marif.mishak@yahoo.com",

  namaPemaju: "PAGOH JAYA (2000) SDN. BHD.",
  noSyarikat: "(199301001219 / 255956-P)",
  alamatPenerima: [
    "Suite 901, 9th Floor, Wisma Hangsam,",
    "No. 1, Jalan Hang Lekir,",
    "50000 Kuala Lumpur,",
    "W.P. Kuala Lumpur.",
  ],

  alamatHartanah: "No. 88, Jalan Jaya 5/14, Taman Pagoh Jaya, 84600 Pagoh, Johor (PTD 18456, HS(D) 42462, Mukim Jorak, Daerah Muar)",
  jenisHartanah: "Rumah Teres 1 Tingkat (Terrace House 1 Storey)",
  namaProyek: "Taman Pagoh Jaya, Pagoh, Johor",

  tarikhSPA: "12 Februari 2025",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "27 Julai 2026",
  tarikhSerahanLaporan: "30 Julai 2026",
  kaedahSerahanLaporan: "WhatsApp kepada wakil pihak pemaju",
  tarikhTamat30: "29 Ogos 2026",
  tarikhReInspection: "21 Oktober 2026",

  tarikhNotis: "29 Oktober 2026",
  tarikhDeadline: "13 November 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "41", lokasi: "Kitchen — Dinding", kecacatan: "Bunyi berongga pada jubin dinding (Hollowness on wall tiles — Hollowness Issue)", status: "Masih Belum Diselesaikan (Not Fully Complete)" },
    { tag: "110", lokasi: "Bedroom 3 — M&E", kecacatan: "Penyambung wayar hilang pada titik kipas siling (Missing wire connector on fan point)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "126", lokasi: "Bathroom 1 — Dinding", kecacatan: "Bunyi berongga pada jubin dinding (Hollowness on wall tiles — Hollowness Issue)", status: "Masih Belum Diselesaikan (Not Fully Complete)" },
    { tag: "165", lokasi: "Water Tank Area — Struktur", kecacatan: "Besi tetulang terdedah pada dinding partition (Exposed RC bar on partition wall) — lepaan/plaster diperlukan", status: "Masih Belum Diselesaikan (Not Fully Complete)" },
    { tag: "166", lokasi: "Water Tank Area — Struktur", kecacatan: "Honeycomb pada dinding dengan besi tetulang terdedah (Honeycomb on wall — Exposed RC bar) — Kecacatan Major", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "167", lokasi: "Water Tank Area — Struktur", kecacatan: "Bukaan pada dinding partition (Opening on partition wall) — Kecacatan Major", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "169", lokasi: "Top Roof — Bumbung", kecacatan: "Genting bumbung rosak dan retak (Damaged and crack on roof tiles) — Kecacatan Major", status: "Masih Belum Diselesaikan (Not Complete)" },
  ],

  kronologi: [
    { tarikh: "12 Februari 2025", peristiwa: "Perjanjian Jual Beli (Sale and Purchase Agreement, Jadual G) ditandatangani — Taman Pagoh Jaya, Pagoh" },
    { tarikh: "27 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "30 Julai 2026", peristiwa: "Laporan Pemeriksaan Kecacatan (Defect Inspection Report) dikemukakan secara rasmi kepada pihak pemaju melalui WhatsApp — merupakan notis bertulis di bawah Klausa 27(1)" },
    { tarikh: "29 Ogos 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1) — pembaikan masih belum diselesaikan sepenuhnya" },
    { tarikh: "21 Oktober 2026", peristiwa: "Pemeriksaan Semula (Second Inspection / Re-Inspection) dijalankan — daripada 174 item yang disemak, LIMA PULUH (50) kecacatan masih belum diselesaikan (36 Not Complete dan 14 Not Fully Complete), di samping 3 kecacatan baharu (New Defect) dan 1 kecacatan baharu akibat kerja pembaikan (New Defect from Rectification Work)" },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) bertarikh ${data.tarikhSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pengemukaan tersebut merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}, dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
);
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada ${data.tarikhTamat30}, pembaikan masih belum diselesaikan sepenuhnya oleh pihak tuan. Pemeriksaan Semula (Second Inspection / Re-Inspection) yang dijalankan pada ${data.tarikhReInspection} — iaitu hampir TIGA (3) BULAN selepas serahan laporan — mengesahkan bahawa daripada 174 item yang disemak, sebanyak LIMA PULUH (50) kecacatan masih belum diselesaikan (36 berstatus "Not Complete" dan 14 berstatus "Not Fully Complete"), di samping TIGA (3) kecacatan baharu (New Defect) dan SATU (1) kecacatan baharu yang berpunca daripada kerja pembaikan pihak tuan sendiri (New Defect from Rectification Work). Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
);
y += 5;

checkBreak(45);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan (Antaranya):", mL, y);
y += 6;

const colW = [13, 38, 67, cW - 13 - 38 - 67];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Senarai di atas BUKANLAH senarai penuh — ia hanya sebahagian daripada LIMA PULUH (50) kecacatan yang disahkan masih belum diselesaikan di dalam Laporan Pemeriksaan Semula (Re-Inspection Report) bertarikh ${data.tarikhReInspection}. Senarai penuh adalah sebagaimana direkodkan di dalam laporan tersebut dan Laporan Pemeriksaan Kecacatan asal yang telah dikemukakan pada ${data.tarikhSerahanLaporan}, dan KESEMUANYA hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada kluster kecacatan struktur di Water Tank Area — item No. 166 (honeycomb pada dinding dengan besi tetulang terdedah — kecacatan major), item No. 167 (bukaan pada dinding partition — kecacatan major) dan item No. 165 (besi tetulang terdedah pada dinding partition). Honeycomb dan besi tetulang (RC bar) yang terdedah akan mengalami kakisan (korosi) apabila terdedah kepada lembapan, yang seterusnya menjejaskan integriti struktur; ia hendaklah dibaiki dengan kaedah yang betul — permukaan dibersihkan, besi tetulang dirawat dan ditutup dengan lepaan/grout pembaikan yang bersesuaian — dan BUKAN sekadar tampalan kosmetik. Bukaan pada dinding partition hendaklah ditutup sepenuhnya bagi mengelakkan kemasukan air, haiwan perosak dan menjejaskan fungsi dinding tersebut.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada item No. 169 — genting bumbung yang rosak dan retak (damaged and crack on roof tiles) di Top Roof, yang merupakan kecacatan major. Genting yang pecah atau retak mendedahkan ruang dalaman rumah kepada risiko kebocoran air hujan, kerosakan siling dan pertumbuhan kulat. Genting yang rosak WAJIB diganti baharu (bukan ditampal), dan kerja di lokasi tinggi hendaklah dilaksanakan oleh personel yang berkelayakan. Memandangkan lokasi kerja (Top Roof dan Water Tank Area) adalah kawasan yang sukar diakses oleh pemilik, pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui e-mel (${data.emailPembeli}) atau WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan.`
);
y += 4;

numPara(5,
  `Selain itu, item No. 110 — penyambung wayar yang hilang pada titik kipas siling (missing wire connector on fan point) di Bedroom 3 — adalah kecacatan elektrik yang melibatkan keselamatan. Sambungan wayar tanpa penyambung (connector) yang sempurna mendedahkan penghuni kepada risiko kejutan elektrik dan kebakaran, dan pembaikan hendaklah dilaksanakan oleh orang kompeten elektrik. Manakala kluster bunyi berongga (hollowness) pada jubin dinding — item No. 41 (Kitchen) dan No. 126 (Bathroom 1) — menunjukkan lekatan jubin yang tidak sempurna yang berisiko retak dan tertanggal; jubin yang berongga hendaklah dibuka dan dipasang semula dengan lekatan penuh, dan bukan sekadar tampalan grout.`
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
fs.writeFileSync("/home/user/admin/NOTIS_1_MUHAMMADARIF.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_MUHAMMADARIF.pdf");
console.log(`Total pages: ${totalPages}`);
