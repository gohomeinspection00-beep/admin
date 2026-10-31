const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukanNotis2: "NOTIS-2/2026/056",
  noRujukanNotis1: "NOTIS-1/2026/056",

  namaPembeli: "SARAVANAN A/L A KANNA",
  alamatPengirim: [
    "No. 10, Jalan Palma Puteri 7,",
    "Desa Palma,",
    "81100 Johor Bahru,",
    "Johor.",
  ],
  emailPembeli: "saravanankanna4@gmail.com",
  telefonPembeli: "011-3628 0693",
  noKP: "000418-04-0035",

  namaPemaju: "NASA LAND SDN. BHD.",
  noSyarikat: "(457736-W)",
  alamatPenerima: [
    "No. 1, Jalan Palma Puteri 4,",
    "Desa Palma,",
    "81100 Johor Bahru,",
    "Johor.",
  ],

  alamatHartanah: "No. 10, Jalan Palma Puteri 7, Desa Palma, 81100 Johor Bahru, Johor (PTD 142908, HS(D) 495272, Mukim Tebrau)",
  jenisHartanah: "Rumah Teres 2 Tingkat (Terrace House 2 Storey, Type A, 20' x 70', Intermediate)",

  noRujukanSPA: "10241-7/eSPA/260824/PTD142908/01",
  tarikhSPA: "26 Ogos 2024",
  jenisSPA: "Jadual G",
  klausaSPA: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhSerahanLaporan: "22 Ogos 2026",
  kaedahSerahanLaporan: "aplikasi IJM CONNEX",

  tarikhNotis1: "20 Oktober 2026",
  tarikhDeadlineNotis1: "4 November 2026",
  tempohNotis1: "15",

  tarikhNotis2: "5 November 2026",
  tarikhDeadlineNotis2: "20 November 2026",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "26", lokasi: "Living And Dining — Dinding", kecacatan: "Bunyi berongga pada permukaan dinding (Hollow sound on wall surface — Hollowness Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "88", lokasi: "Staircase — Dinding", kecacatan: "Bunyi berongga pada dinding bercat (Hollow sound on painted wall — Hollowness Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "152", lokasi: "Bathroom 2 — Lantai", kecacatan: "Air bertakung pada jubin lantai (Water stagnant on floor tiles — Alignment Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "183", lokasi: "Flat Roof — Lantai", kecacatan: "Kesan air bertakung pada permukaan papak (Sign of water stagnant on slab surface — Alignment Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "186", lokasi: "Flat Roof — Lantai", kecacatan: "Bunyi berongga pada permukaan papak (Hollow sound on slab surface — Hollowness Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "189", lokasi: "Flat Roof — Dinding", kecacatan: "Bunyi berongga pada dinding bercat (Hollow sound on painted wall — Hollowness Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "191", lokasi: "Top Roof", kecacatan: "Sisa binaan ditinggalkan di atas bumbung (Construction leftover on roof — Finishing Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "192", lokasi: "Top Roof", kecacatan: "Keretakan, serpihan dan genting bumbung pecah (Crack, chipping and broken roof tiles — Major Defect)", status: "Masih Belum Diselesaikan" },
    { tag: "193", lokasi: "Top Roof", kecacatan: "Celahan ketara di sekeliling roof flashing dan dinding (Visible gap around roof flashing and wall — Jointing Issue)", status: "Masih Belum Diselesaikan" },
    { tag: "194", lokasi: "Top Roof", kecacatan: "Pemasangan genting bumbung tidak sempurna menyebabkan celahan besar (Improper installation of roof tiles causing large gap)", status: "Masih Belum Diselesaikan" },
    { tag: "195", lokasi: "Top Roof — Rear Gutter", kecacatan: "Air bertakung pada talang belakang (Water stagnant on rear gutter — Alignment Issue)", status: "Masih Belum Diselesaikan" },
  ],

  kronologi: [
    { tarikh: "26 Ogos 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Desa Palma Fasa 6, Jadual G (Ruj: 10241-7/eSPA/260824/PTD142908/01)" },
    { tarikh: "18 Ogos 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "22 Ogos 2026", peristiwa: "Laporan Pemeriksaan Kecacatan dikemukakan melalui aplikasi IJM CONNEX (Ticket ID: 6DP1214 - 6DP1387) dan diakui terima (acknowledged) oleh pihak pemaju pada hari yang sama — notis bertulis di bawah Klausa 27(1)" },
    { tarikh: "21 September 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1) — pembaikan masih belum diselesaikan; kesemua tiket masih berstatus New di dalam sistem IJM CONNEX" },
    { tarikh: "20 Oktober 2026", peristiwa: "Notis Pertama (First Notice) — Ruj. NOTIS-1/2026/056 — dikeluarkan dan dipos kepada pihak pemaju secara Pos Berdaftar AR (AR Registered Post) No. RW214685575MY" },
    { tarikh: "4 November 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari) — kecacatan masih belum dibaiki" },
    { tarikh: "5 November 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan" },
    { tarikh: "20 November 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
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
  `Merujuk kepada Notis Pertama (First Notice) bertarikh ${data.tarikhNotis1} dengan nombor rujukan ${data.noRujukanNotis1} yang telah dipos kepada pihak tuan secara Pos Berdaftar AR (AR Registered Post) No. RW214685575MY pada ${data.tarikhNotis1}, pihak tuan telah diberikan tempoh ${data.tempohNotis1} hari sehingga ${data.tarikhDeadlineNotis1} untuk melaksanakan pembaikan kecacatan selaras dengan tanggungjawab pemaju di bawah Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}) bertarikh ${data.tarikhSPA} dan Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118].`
);;
y += 4;

numPara(2,
  `Namun, sehingga tarikh Notis Kedua ini dikeluarkan, kerja pembaikan terhadap kecacatan yang telah dilaporkan masih belum dilaksanakan atau belum disempurnakan oleh pihak tuan — malah rekod sistem IJM CONNEX pihak tuan sendiri masih menunjukkan tiket-tiket kecacatan (Ticket ID: 6DP1214 hingga 6DP1387) yang diakui terima sejak 22 Ogos 2026 kekal tanpa kemajuan kerja, iaitu lebih DUA (2) BULAN sejak serahan laporan. Ini bermakna pihak tuan telah gagal mematuhi Notis Pertama yang dikeluarkan.`
);;
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
const fn = `*Senarai di atas bukanlah senarai penuh. Senarai lengkap kecacatan adalah sebagaimana dinyatakan di dalam Laporan Pemeriksaan Kecacatan yang telah dikemukakan melalui ${data.kaedahSerahanLaporan} pihak tuan pada ${data.tarikhSerahanLaporan}, dan kesemuanya hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus sekali lagi diberikan kepada kluster kecacatan bumbung (item No. 192, 193 dan 194 — genting pecah, celahan pada roof flashing dan pemasangan genting tidak sempurna) yang mendedahkan rumah kepada risiko kebocoran air hujan, serta kluster air bertakung dan bunyi berongga yang masih belum disentuh. Sekiranya pihak tuan gagal melaksanakan pembaikan dalam tempoh notis ini, saya akan mendapatkan Sebut Harga Rasmi Pembaikan (Official Repair Quotation) daripada kontraktor bertauliah dan jumlah tersebut akan menjadi asas tuntutan kos pembaikan terhadap pihak tuan, termasuk tuntutan supaya ia ditolak daripada Wang Tahanan 5% (Retention Sum) di bawah Klausa 27(2) ${data.jenisSPA}.`
);;
y += 4;

numPara(4,
  `Dengan ini, saya mengeluarkan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadlineNotis2}. Notis Kedua ini menjadikan keseluruhan tempoh tiga puluh (30) hari telah diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan selaras dengan Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}).`
);
y += 4;

numPara(5,
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

numPara(6,
  `Sekiranya pihak tuan masih gagal mengambil tindakan pembaikan selepas Notis Kedua (Final Notice) ini tamat tempohnya pada ${data.tarikhDeadlineNotis2}, saya akan tanpa berlengah lagi mengambil tindakan berikut:`
);
y += 2;

bullet("Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya;");
bullet("Menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan 5% (Retention Sum 5%) yang sedang dipegang sebagaimana diperuntukkan di bawah Klausa 27(2) Perjanjian Jual Beli (Jadual G);");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera dan muktamad terhadap Notis Kedua ini. Ini merupakan notis akhir sebelum tindakan undang-undang dimulakan. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 10;

checkBreak(60);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
const signImg = "data:image/jpeg;base64," + fs.readFileSync("/home/user/admin/saravanan-sign.jpg").toString("base64");
doc.addImage(signImg, "JPEG", mL + 8, y + 1, 30, 30 * 243 / 418);
y += 22;
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
fs.writeFileSync("/home/user/admin/NOTIS_2_SARAVANAN.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_2_SARAVANAN.pdf");
console.log(`Total pages: ${totalPages}`);
