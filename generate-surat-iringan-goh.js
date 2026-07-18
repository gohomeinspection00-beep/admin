const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/011-A (Surat Iringan)",
  rujukanNotis: "NOTIS-1/2026/011",

  namaPembeli: "GOH BOON HAU",
  alamatPengirim: [
    "No. 10, Jalan Perwira 6,",
    "Taman Muhibbah,",
    "85400 Chaah,",
    "Johor.",
  ],
  noKP: "950907-04-5143",
  telefonPembeli: "011-55295031",
  emailPembeli: "redsunwu6816@gmail.com",

  namaPemaju: "CASA BAYU IDAMAN SDN. BHD.",
  noSyarikat: "(1230392-T)",
  alamatPenerima: [
    "88A, Jalan Harimau Tarum,",
    "Taman Century,",
    "80250 Bandar Johor Bahru,",
    "Johor.",
  ],

  alamatHartanah: "No. 333, Jalan Mutiara Hijau 11, Taman Mutiara Hijau, 81000 Kulai, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (25' Intermediate Unit)",

  jenisSPA: "Jadual G",
  klausaSerahan: "29(1)",

  tarikhSurat: "21 Julai 2026",
  tarikhNotis: "14 Julai 2026",
  tarikhDeadline: "29 Julai 2026",
};

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 25;
const mR = 25;
const cW = pageW - mL - mR;
let y = 0;
let pageNum = 1;

const SZ = { BODY: 12, SMALL: 10, FOOTER: 8, TITLE: 12 };
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

// ============================================================
// SURAT IRINGAN
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

doc.text(data.tarikhSurat, pageW - mR, y - LH_S, { align: "right" });

y += 3;

doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukan}`, mL, y);
y += 3;
doc.text("Melalui: Pos Berdaftar Akuan Terima (AR Registered Post)", mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkara1 = "Surat Iringan — Penyerahan Semula Notis Pertama (First Notice)";
const perkara2 = `Rujukan Notis: ${data.rujukanNotis} bertarikh ${data.tarikhNotis}`;
const perkara3 = `Hartanah: ${data.jenisHartanah}`;
const perkara4 = `di ${data.alamatHartanah}`;
for (const pk of [perkara1, perkara2, perkara3, perkara4]) {
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
  `Dengan segala hormatnya saya merujuk kepada perkara di atas dan Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) dengan rujukan ${data.rujukanNotis} bertarikh ${data.tarikhNotis}.`
);
y += 4;

numPara(2,
  `Untuk makluman pihak tuan, pada 14 Julai 2026, saya selaku pemilik hartanah telah hadir sendiri ke pejabat pengurusan (management office) pihak tuan bagi menyerahkan Laporan Pemeriksaan Kecacatan Kali Kedua berserta Notis Pertama tersebut secara serahan tangan, dan pada masa yang sama turut menyerahkan kunci unit bagi memudahkan kerja pembaikan dijalankan.`
);
y += 4;

numPara(3,
  `Walau bagaimanapun, amat dikesali bahawa wakil / pegawai bertugas (person-in-charge) di pejabat pengurusan pihak tuan telah enggan menandatangani dan mengecop akuan penerimaan bagi Notis Pertama tersebut, walaupun penyerahan dibuat secara sah pada waktu urusan rasmi.`
);
y += 4;

numPara(4,
  `Ekoran keengganan tersebut, saya dengan ini menyerahkan semula Notis Pertama yang sama kepada pihak tuan melalui Pos Berdaftar Akuan Terima (AR Registered Post). Sesalinan penuh Notis Pertama bertarikh ${data.tarikhNotis} disertakan bersama-sama surat ini.`
);
y += 4;

numPara(5,
  `Merujuk kepada klausa Service of Documents (Klausa ${data.klausaSerahan} ${data.jenisSPA}) di dalam Perjanjian Jual Beli, penyerahan dokumen melalui pos berdaftar adalah dianggap sah dan sempurna diserahkan (deemed served). Oleh yang demikian, tempoh pembaikan lima belas (15) hari sebagaimana dinyatakan di dalam Notis Pertama adalah berkuat kuasa dari tarikh notis tersebut, iaitu sebelum atau pada ${data.tarikhDeadline}.`
);
y += 4;

numPara(6,
  `Sekiranya pihak tuan gagal menyempurnakan semua kerja pembaikan dalam tempoh yang ditetapkan, saya tidak akan teragak-agak untuk mengeluarkan Notis Kedua iaitu Notis Akhir (Final Notice) dan seterusnya memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) tanpa notis lanjut.`
);
y += 4;

para("Kerjasama dan perhatian segera pihak tuan berhubung perkara ini amatlah dihargai. Terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(46);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
const sigImg = fs.readFileSync("/home/user/admin/goh-signature.png").toString("base64");
doc.addImage("data:image/png;base64," + sigImg, "PNG", mL + 5, y + 1, 38, 15);
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
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += 8;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("Lampiran:", mL, y);
y += LH_S;
doc.setFont("helvetica", "normal");
doc.text(`1. Notis Pertama — Tuntutan Pembetulan Kecacatan (Ruj: ${data.rujukanNotis}) bertarikh ${data.tarikhNotis}`, mL + 5, y);
y += LH_S;

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
fs.writeFileSync("/home/user/admin/SURAT_IRINGAN_GOH.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_IRINGAN_GOH.pdf");
console.log(`Total pages: ${totalPages}`);
