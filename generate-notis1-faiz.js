const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/065",

  namaPembeli: "MUHAMAD FAIZ BIN ROSEMAN @ HARUN",
  alamatPengirim: [
    "02-06, Blok D, Villa Bestari,",
    "Jalan NB2 10/2, Taman Nusa Bestari 2,",
    "81300 Johor Bahru,",
    "Johor.",
  ],
  noKP: "930825-01-6375",
  telefonPembeli: "011-6139 7743 / +65 8452 2666",
  emailPembeli: "muhamadfaiz2808@gmail.com",

  namaPemaju: "SCIENTEX QUATARI SDN. BHD.",
  noSyarikat: "(197601002045 / 28008-M)",
  alamatPenerima: [
    "Pejabat Jualan Taman Pulai Mutiara,",
    "Persiaran Pulai Mutiara, Taman Pulai Mutiara,",
    "81300 Johor Bahru,",
    "Johor Darul Takzim.",
  ],

  alamatHartanah: "No. 40, Jalan Pulai Duta 5/23, Taman Pulai Duta, 81300 Johor Bahru, Johor (SP32A, PTD 225003)",
  jenisHartanah: "Rumah Teres (Terrace House)",
  namaProyek: "Taman Pulai Duta, Johor Bahru",

  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "10 September 2026",
  tarikhSerahanLaporan: "28 September 2026",
  tarikhTamat30: "28 Oktober 2026",

  tarikhNotis: "31 Oktober 2026",
  tarikhDeadline: "15 November 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "301", lokasi: "Water Tank Area", kecacatan: "Tangki air di dalam keadaan kotor — perlu dibersihkan (Water tank in dirty condition — need to be clean)", status: "Masih Belum Diselesaikan" },
    { tag: "312", lokasi: "Top Roof — Bumbung", kecacatan: "Lubang pada genting bumbung (Got holes on roof tiles)", status: "Masih Belum Diselesaikan" },
    { tag: "313", lokasi: "Top Roof — Bumbung", kecacatan: "Genting bumbung rosak (Damaged on roof tiles) — Kecacatan Major", status: "Masih Belum Diselesaikan" },
    { tag: "314", lokasi: "Top Roof — Talang Belakang", kecacatan: "Air bertakung di dalam talang belakang (Stagnant water inside gutter — Rear, Alignment Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "315", lokasi: "Top Roof — Talang Hadapan", kecacatan: "Air bertakung di dalam talang hadapan (Stagnant water inside gutter — Front, Alignment Issue)", status: "Masih Belum Diselesaikan" },
  ],

  kronologi: [
    { tarikh: "10 September 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (Full House Inspection) dijalankan ke atas hartanah" },
    { tarikh: "28 September 2026", peristiwa: "Laporan Pemeriksaan Kecacatan (Defect Inspection Report) diserahkan secara rasmi kepada pihak pemaju melalui serahan tangan (hardcopy) — merupakan notis bertulis di bawah Klausa 27(1)" },
    { tarikh: "28 Oktober 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1) — pembaikan masih belum diselesaikan" },
    { tarikh: "31 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "15 November 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) yang ditandatangani dengan pihak tuan, telah menjalankan Pemeriksaan Kecacatan (Full House Inspection) pada ${data.tarikhPemeriksaan1} dan telah menyerahkan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui serahan tangan (hardcopy) pada ${data.tarikhSerahanLaporan}. Penyerahan tersebut merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}, dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
);;
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada ${data.tarikhTamat30}, sehingga tarikh notis ini dikeluarkan kecacatan yang dilaporkan masih belum diselesaikan oleh pihak tuan dan tiada sebarang kerja pembaikan dijalankan di hartanah saya. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
);;
y += 5;

checkBreak(45);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan (Antaranya):", mL, y);
y += 6;

const colW = [14, 40, 72, cW - 14 - 40 - 72];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Senarai di atas BUKANLAH senarai penuh. Senarai penuh kecacatan adalah sebagaimana direkodkan di dalam Laporan Pemeriksaan Kecacatan yang telah diserahkan kepada pihak tuan secara serahan tangan pada ${data.tarikhSerahanLaporan}, dan KESEMUANYA hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada kluster kecacatan bumbung — item No. 313 (genting bumbung rosak — KECACATAN MAJOR) dan item No. 312 (lubang pada genting bumbung). Genting yang rosak dan berlubang mendedahkan ruang dalaman rumah kepada risiko kebocoran air hujan, kerosakan siling dan pertumbuhan kulat. Genting yang rosak atau berlubang WAJIB diganti baharu (bukan ditampal atau disumbat), dan kerja di lokasi tinggi hendaklah dilaksanakan oleh personel yang berkelayakan. Memandangkan lokasi kerja (Top Roof) adalah kawasan yang sukar diakses oleh pemilik, pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada saya melalui e-mel (${data.emailPembeli}) atau WhatsApp sebagai bukti penyiapan.`
);;
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada kluster air bertakung pada talang — item No. 314 (talang belakang) dan No. 315 (talang hadapan). Takungan air yang berterusan di dalam talang menunjukkan kecerunan (falls) talang yang tidak sempurna; ia akan mempercepatkan kakisan talang, mengundang limpahan dan kebocoran ke ruang di bawahnya, serta menjadi tempat pembiakan nyamuk Aedes. Pihak tuan dituntut membetulkan PUNCA — iaitu kecerunan dan laluan saliran talang — dan bukan sekadar mengeringkan takungan. Bagi item No. 301 — tangki air domestik di dalam keadaan kotor — ia melibatkan kebersihan dan keselamatan bekalan air keluarga saya; tangki hendaklah dibersihkan sepenuhnya sebelum penyerahan semula.`
);;
y += 4;

;
y += 4;

numPara(5,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period).`
);
y += 4;

numPara(6,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan.`
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

const krColW = [45, cW - 45];
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
fs.writeFileSync("/home/user/admin/NOTIS_1_FAIZ.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_FAIZ.pdf");
console.log(`Total pages: ${totalPages}`);
