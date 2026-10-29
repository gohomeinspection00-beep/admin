const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/062",

  namaPembeli: "SITI AFIQAH BINTI AB HAMID",
  alamatPengirim: [
    "No. 21, Jalan Indah 22/22,",
    "Taman Bukit Indah 2,",
    "81200 Johor Bahru,",
    "Johor.",
  ],
  noKP: "901221-01-6064",
  telefonPembeli: "013-704 7987",
  emailPembeli: "sitiafiqahabhamid@gmail.com",

  namaPemaju: "TH TEBRAU LAND SDN. BHD.",
  noSyarikat: "(201201012411 / 985928-D)",
  alamatPenerima: (process.argv[2] === "SITE") ? [
    "PTD 209290, Jalan Kunyit,",
    "Taman Sri Amar,",
    "81100 Johor Bahru,",
    "Johor Darul Ta'zim.",
    "Tel: 012-715 4212",
  ] : [
    "d/a Pejabat Pengurusan,",
    "L13, Menara A, Pangsapuri Seri Permata,",
    "Jalan Kunyit, Taman Sri Amar,",
    "81100 Johor Bahru, Johor.",
  ],

  alamatHartanah: "Unit B-20-02, Menara B, Pangsapuri Seri Permata, Jalan Kunyit, Taman Sri Amar, 81100 Johor Bahru, Johor",
  jenisHartanah: "Pangsapuri (Apartment / Strata Unit)",
  namaProyek: "Pangsapuri Seri Permata, Johor Bahru",

  tarikhSPA: "",
  jenisSPA: "Jadual H",
  klausaPembaikan: "30(1)",
  klausaSerahan: "32(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "6 November 2025",
  tarikhSerahanLaporan: "11 November 2025",
  kaedahSerahanLaporan: "aplikasi rasmi pihak pemaju",
  tarikhTamat30: "11 Disember 2025",
  tarikhReInspection: "8 September 2026",

  tarikhNotis: "31 Oktober 2026",
  tarikhDeadline: "15 November 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "53", lokasi: "Master Bathroom — Paip & Sanitari", kecacatan: "Sistem saliran tidak sempurna — sisa binaan di dalam kedua-dua perangkap lantai (Poor drainage system — construction leftover inside both floor traps)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "57", lokasi: "Balcony (Master Bedroom) — Lantai", kecacatan: "Jubin hilang dan celahan ketara (Missing tiles and visible gap)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "60", lokasi: "Balcony (Master Bedroom) — Lantai", kecacatan: "Bunyi berongga pada papak lantai (Hollowness on floor slab — Hollowness Issue)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "66", lokasi: "Bedroom 2 — M&E", kecacatan: "Voltan rendah pada titik kipas dan titik lampu, L+N dan L+E (Fan point and light point have low voltage — Functionality Issue)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "74", lokasi: "Bedroom 3 — M&E", kecacatan: "Voltan rendah Live+Earth dan Live+Neutral pada titik lampu dan kipas (Live + Earth and Live + Neutral for light and fan point has low voltage — Functionality Issue)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "76", lokasi: "Bathroom 2 — Lantai", kecacatan: "Air bertakung pada jubin lantai (Stagnant water on floor tiles — Alignment Issue)", status: "Masih Belum Diselesaikan (Not Complete)" },
  ],

  kronologi: [
    { tarikh: "6 November 2025", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "11 November 2025", peristiwa: "Laporan Pemeriksaan Kecacatan (Defect Inspection Report) dikemukakan secara rasmi kepada pihak pemaju melalui aplikasi rasmi pihak pemaju — merupakan notis bertulis di bawah Klausa 30(1)" },
    { tarikh: "11 Disember 2025", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 30(1) — pembaikan masih belum diselesaikan sepenuhnya" },
    { tarikh: "8 September 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — kecacatan yang dilaporkan masih belum diselesaikan" },
    { tarikh: "11 September 2026", peristiwa: "Kes-kes kecacatan dikemukakan semula di dalam aplikasi pihak pemaju — sebanyak TUJUH PULUH EMPAT (74) kes (Ruj: #DFC-1 hingga #DFC-74) masih berstatus Open sehingga tarikh notis ini" },
    { tarikh: "31 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "15 November 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) yang ditandatangani dengan pihak tuan, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pengemukaan tersebut merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}, dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
);;
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada ${data.tarikhTamat30}, pembaikan masih belum diselesaikan oleh pihak tuan sehingga kini — iaitu hampir SATU (1) TAHUN sejak serahan laporan. Pemeriksaan Semula (Re-Inspection) yang dijalankan pada ${data.tarikhReInspection} mengesahkan bahawa kecacatan yang dilaporkan masih belum diselesaikan, dan kes-kes kecacatan tersebut telah dikemukakan semula di dalam aplikasi pihak tuan pada 11 September 2026 — di mana sebanyak TUJUH PULUH EMPAT (74) kes masih berstatus "Open" di dalam rekod aplikasi pihak tuan sendiri sehingga tarikh notis ini dikeluarkan, tanpa sebarang kemajuan kerja pembaikan. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:`
);;
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
const fn = `*Senarai di atas BUKANLAH senarai penuh — ia hanya sebahagian daripada TUJUH PULUH EMPAT (74) kes kecacatan yang masih berstatus Open di dalam aplikasi pihak tuan. Senarai penuh adalah sebagaimana direkodkan di dalam Laporan Pemeriksaan Semula (Re-Inspection Report) bertarikh ${data.tarikhReInspection} dan aplikasi pihak tuan, dan KESEMUANYA hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada kecacatan elektrik — item No. 66 (Bedroom 2) dan No. 74 (Bedroom 3), di mana ujian mengesahkan bacaan voltan rendah (low voltage) pada sambungan Live+Neutral dan Live+Earth bagi titik lampu dan titik kipas. Bacaan voltan yang tidak normal menunjukkan sambungan litar atau pendawaian yang tidak sempurna, yang mendedahkan penghuni kepada risiko kejutan elektrik dan kebakaran, serta menjejaskan fungsi kelengkapan elektrik yang dipasang. Pembaikan hendaklah dilaksanakan oleh orang kompeten elektrik, dan punca bacaan voltan rendah tersebut hendaklah dikesan dan dibetulkan sepenuhnya — bukan sekadar penggantian kelengkapan.`
);;
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada kluster kecacatan lantai Balcony (Master Bedroom) — item No. 57 (jubin hilang dan celahan ketara) dan item No. 60 (bunyi berongga pada papak lantai). Jubin yang hilang dan celahan yang terdedah di kawasan balkoni membenarkan air hujan meresap ke dalam papak dan lapisan di bawahnya, yang boleh menyebabkan kebocoran ke unit di bawah dan kakisan; manakala bunyi berongga menunjukkan lekatan skrid/jubin yang tidak sempurna yang berisiko tertanggal. Kedua-duanya hendaklah dibaiki dengan sempurna — jubin dipasang semula dengan lekatan penuh dan celahan ditutup dengan kemasan kalis air yang bersesuaian.`
);;
y += 4;

numPara(5,
  `Selain itu, kluster saliran dan takungan air — item No. 53 (Master Bathroom: sisa binaan di dalam KEDUA-DUA perangkap lantai / floor trap) dan item No. 76 (Bathroom 2: air bertakung pada jubin lantai) — hendaklah dibaiki pada PUNCANYA. Sisa binaan di dalam perangkap lantai menyekat aliran air dan boleh menyebabkan limpahan serta bau; ia WAJIB dikeluarkan sepenuhnya dan sistem saliran diuji lancar (flushing test). Bagi Bathroom 2, takungan air menunjukkan kecerunan (falls) lantai yang tidak sempurna — kecerunan hendaklah dibetulkan supaya air mengalir sepenuhnya ke arah floor trap, dan bukan sekadar mengeringkan takungan.`
);;
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
const outName = (process.argv[2] === "SITE") ? "NOTIS_1_SITIAFIQAH_SITE.pdf" : "NOTIS_1_SITIAFIQAH.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
