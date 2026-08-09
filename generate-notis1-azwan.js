const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/007",

  namaPembeli: "AZWAN BIN MOHAMAD",
  alamatPengirim: [
    "No 7, Jalan Perjiranan 14/8,",
    "Perjiranan 14, Bandar Dato Onn,",
    "81100 Johor Bahru,",
    "Johor.",
  ],
  emailPembeli: "ain_nabilah151294@yahoo.com",
  telefonPembeli: "011-10902477",
  noKP: "920330015777",

  namaPemaju: "JLG LAND BERHAD",
  alamatPenerima: [
    "Level 16, Menara KOMTAR,",
    "80888 Ibrahim International Business District (IIBD),",
    "Johor Bahru, Johor.",
  ],
  emailPemaju: "johorland@jland.com.my",
  telefonPemaju: "+607 287 3152",

  alamatHartanah: "No 7, Jalan Perjiranan 14/8, Perjiranan 14, Bandar Dato Onn, 81100 Johor Bahru, Johor",

  tarikhSerahanLaporan: "2 Mac 2026",
  kaedahSerahanLaporan: "aplikasi pemaju (KITA APPS)",

  tarikhNotis: "10 Ogos 2026",
  tarikhDeadline: "25 Ogos 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kaedahPenghantaranNotis: "serahan tangan",

  kecacatan: [
    { tag: "5", lokasi: "Bathroom 3 — Plumbing & Sanitary", kecacatan: "Simen terkumpul di dalam floor trap (Accumulation of cement inside floor trap) — masih ada", status: "Belum Dibaiki" },
    { tag: "7", lokasi: "Yard — Door", kecacatan: "Pintu tidak dapat ditutup dan tersekat dengan paip air — water tap hilang dan lokasi water tap point perlu disemak semula", status: "Belum Dibaiki" },
    { tag: "9", lokasi: "Staircase — Wall", kecacatan: "Keretakan dan kemek pada dinding bercat — masih terdapat keretakan pada permukaan dinding", status: "Belum Dibaiki" },
    { tag: "11", lokasi: "Master Bedroom — Wall", kecacatan: "Pertumbuhan kulat dan tanda kerosakan air pada dinding bercat — kelembapan masih tinggi pada dinding (Major defect)", status: "Belum Dibaiki" },
    { tag: "12", lokasi: "Master Bedroom — Window", kecacatan: "Jurang kelihatan dan pengedap tidak sempurna antara bingkai tingkap dan dinding — masih ada jurang + pertumbuhan kulat", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "15", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Kebocoran pada sambungan antara bottle trap dan paip sink — masih bocor", status: "Belum Dibaiki" },
    { tag: "16", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Sisa binaan di dalam floor trap — masih ada", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "18", lokasi: "Bedroom 2 — Floor", kecacatan: "Keretakan pada jubin lantai — masih retak", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "19", lokasi: "Bedroom 2 — Wall", kecacatan: "Kemek dan keretakan pada dinding bercat — masih retak", status: "Belum Dibaiki" },
    { tag: "21", lokasi: "Bathroom 2 — Plumbing & Sanitary", kecacatan: "Floor trap tidak sejajar dengan paip dalaman", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "24", lokasi: "Ceiling Area — M&E", kecacatan: "Flexible conduit terlalu pendek dan penutup junction box hilang (kabel elektrik terdedah) — penutup masih hilang", status: "Belum Dibaiki" },
    { tag: "25", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Tiada sokongan yang sempurna untuk sistem paip/distribution pipe — masih hilang", status: "Belum Dibaiki" },
    { tag: "26", lokasi: "Water Tank Area — Fixtures", kecacatan: "Tangki air dalam keadaan kotor (perlu dibersihkan) — masih kotor", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "26 Februari 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan" },
    { tarikh: "2 Mac 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju melalui aplikasi pemaju (KITA APPS)" },
    { tarikh: "1 April 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "23 Jun 2026", peristiwa: "Pemilik mengemukakan aduan keretakan dinding tangga melalui aplikasi KITA (Ref: F-NH14-P2-[PTD208412]07,JALANPERJIRANAN14/8-N12336). Tiket tersebut kemudiannya ditutup (closed) oleh pihak kontraktor/pengurusan dengan status seolah-olah telah dibaiki" },
    { tarikh: "30 Julai 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) oleh Building Surveyor bertauliah — 30 kecacatan direkodkan: 13 kecacatan asal masih belum dibaiki (termasuk keretakan dinding tangga yang tiketnya telah ditutup), 2 kecacatan baru dan 15 kecacatan baru akibat kerja pembaikan" },
    { tarikh: "10 Ogos 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "25 Ogos 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text(data.namaPemaju, mL, y);
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
const perkara2 = `Hartanah di ${data.alamatHartanah}`;
for (const pk of [perkara1, perkara2]) {
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas, telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`
);
y += 4;

numPara(2,
  `Namun, walaupun sebahagian kerja pembaikan telah dijalankan, Pemeriksaan Semula (Re-Inspection) oleh Building Surveyor bertauliah pada 30 Julai 2026 mendapati pembaikan masih belum disiapkan sepenuhnya. Berikut adalah senarai kecacatan yang masih belum diselesaikan (nombor merujuk kepada Laporan Re-Inspection bertarikh 30 Julai 2026):`
);
y += 5;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
y += 6;

const colW = [15, 35, 55, cW - 15 - 35 - 55];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Selain 13 kecacatan di atas, Laporan Re-Inspection bertarikh 30 Julai 2026 turut merekodkan 2 kecacatan baru dan 15 kecacatan baru akibat kerja pembaikan (New Defect from Rectification Work), menjadikan jumlah keseluruhan 30 kecacatan. Senarai penuh adalah sebagaimana terkandung dalam Laporan Re-Inspection tersebut dan Laporan Pemeriksaan Kecacatan Pertama yang dihantar melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(6); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Untuk makluman pihak tuan, pemilik telah mengemukakan aduan keretakan pada dinding tangga melalui aplikasi KITA pada 23 Jun 2026 (Ref: F-NH14-P2-[PTD208412]07,JALANPERJIRANAN14/8-N12336). Bagaimanapun, tiket aduan tersebut telah ditutup (closed) oleh pihak kontraktor/pengurusan dengan status seolah-olah pembaikan telah disempurnakan, sedangkan Pemeriksaan Semula (Re-Inspection) oleh Building Surveyor bertauliah pada 30 Julai 2026 mengesahkan keretakan tersebut masih wujud dan tidak dibaiki. Tindakan menutup tiket tanpa pembaikan sebenar adalah tidak boleh diterima dan merupakan salah nyata status pembaikan. Saya menuntut agar semua tiket yang telah ditutup disemak semula, dan sebarang penutupan tiket selepas ini hendaklah disahkan oleh pemilik terlebih dahulu.`
);
y += 4;

numPara(4,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan.`
);
y += 4;

numPara(5, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:");
y += 2;
bullet("Melaksanakan pemeriksaan kali ketiga bagi mengesahkan status terkini semua kecacatan;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
bullet("Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.");
y += 4;

numPara(6,
  `Merujuk kepada klausa Service of Documents di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi. Notis ini dihantar melalui ${data.kaedahPenghantaranNotis}.`
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

para("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 10;

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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
fs.writeFileSync("/home/user/admin/NOTIS_1_AZWAN.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_AZWAN.pdf");
console.log(`Total pages: ${totalPages}`);
