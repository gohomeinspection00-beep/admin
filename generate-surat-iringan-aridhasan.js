const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "IRINGAN/NOTIS-1/2026/024",

  namaPembeli: "ARIDHASAN A/L MENANDI",
  alamatPengirim: [
    "No. 28, Jalan Uda Utama 2/6,",
    "Bandar Uda Utama,",
    "81200 Johor Bahru,",
    "Johor.",
  ],
  noKP: "830128-07-5427",
  telefonPembeli: "017-225 0417",
  emailPembeli: "eswari9583@yahoo.com",

  namaPemaju: "UDA LAND (SOUTH) SDN. BHD.",
  noSyarikat: "(197501001813 / 23298-K)",
  alamatPenerima: [
    "(Ibu Pejabat / Headquarters)",
    "Tingkat 15, Blok Menara, Kompleks Pertama,",
    "Jalan Tuanku Abdul Rahman,",
    "50100 Kuala Lumpur.",
  ],

  alamatHartanah: "No. 28, Jalan Uda Utama 2/6, Bandar Uda Utama, 81200 Johor Bahru, Johor",

  tarikhSurat: "1 Oktober 2026",
};

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 25;
const mR = 25;
const cW = pageW - mL - mR;
let y = 0;
let pageNum = 1;

const SZ = { BODY: 12, SMALL: 10, FOOTNOTE: 9, FOOTER: 8, TITLE: 12 };
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

// ============ HEADER ============
y = 25;
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
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
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY);
for (const line of data.alamatPenerima) { doc.text(line, mL, y); y += LH_S; }
doc.text(data.tarikhSurat, pageW - mR, y - LH_S, { align: "right" });
y += 3;
doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukan}`, mL, y);
y += 8;

// BY REGISTERED POST label
doc.setFont("helvetica", "bolditalic"); doc.setFontSize(SZ.SMALL); bk();
doc.text("MELALUI POS BERDAFTAR (BY REGISTERED POST)", mL, y);
doc.setFont("helvetica", "normal");
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const perkara = [
  "Surat Iringan — Salinan Notis Pertama, Tuntutan Pembetulan Kecacatan",
  "(Defect Rectification Claim)",
  `Hartanah: ${data.alamatHartanah}`,
];
for (const pk of perkara) {
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
  `Dengan segala hormatnya perkara di atas dirujuk. Bersama-sama surat ini disertakan salinan Notis Pertama — Tuntutan Pembetulan Kecacatan (First Notice) bertarikh 15 Ogos 2026 dengan nombor rujukan NOTIS-1/2026/024, yang dialamatkan kepada Ibu Pejabat pihak tuan, untuk rekod dan perhatian rasmi pihak tuan di peringkat Ibu Pejabat.`
);
y += 4;

numPara(2,
  `Untuk makluman pihak tuan, Notis Pertama tersebut telah diserahkan secara fizikal (by hand) kepada pejabat pihak tuan di Johor Bahru (No. 1, Jalan Padi Mahsuri 12, Bandar Baru Uda) pada 27 Ogos 2026, dan telah DIAKUI TERIMA oleh wakil pihak tuan, En. Mohd Shawl bin Kamsan (Officer), dengan cop rasmi "DITERIMA 27 AUG 2026". Tempoh lima belas (15) hari yang diperuntukkan di dalam notis tersebut telah tamat pada 11 September 2026 tanpa pembaikan disempurnakan.`
);
y += 4;

checkBreak(45);
numPara(3,
  `Sehubungan dengan kegagalan tersebut, dan berikutan Pemeriksaan Ketiga (Third Inspection) oleh Building Surveyor berdaftar RISM pada 24 September 2026 yang mengesahkan 50 penemuan masih belum diselesaikan, Notis Kedua / Notis Akhir (Final Notice) bertarikh 1 Oktober 2026 dengan rujukan NOTIS-2/2026/024 telah pun dikeluarkan dan diserahkan kepada pejabat pihak tuan di Johor Bahru, dengan tarikh akhir pembaikan yang MUKTAMAD pada 16 Oktober 2026.`
);
y += 4;

numPara(4,
  `Ibu Pejabat pihak tuan adalah dengan hormatnya diminta untuk mengambil perhatian serius terhadap perkara ini dan memastikan pasukan pembaikan di Johor Bahru menyelesaikan kesemua kecacatan dalam tempoh yang ditetapkan. Sekiranya tiada tindakan diambil selepas tarikh akhir muktamad tersebut, saya akan meneruskan tindakan sebagaimana dinyatakan di dalam Notis Kedua, termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR).`
);
y += 4;

para("Kerjasama dan perhatian segera pihak tuan amatlah dihargai dan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(60);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 18;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPembeli})`, mL, y);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += LH_S;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += 8;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("Lampiran:", mL, y); y += LH_S;
doc.setFont("helvetica", "normal");
doc.text("1. Salinan Notis Pertama (Ruj: NOTIS-1/2026/024) bertarikh 15 Ogos 2026", mL + 4, y); y += LH_S;
doc.text("2. Salinan Akuan Terima Notis Pertama (cop DITERIMA 27 AUG 2026)", mL + 4, y); y += LH_S;

// ============ FOOTER ============
const totalPages = doc.internal.getNumberOfPages();
for (let p = 1; p <= totalPages; p++) {
  doc.setPage(p);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2);
  doc.line(mL, pageH - 18, pageW - mR, pageH - 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.FOOTER); doc.setTextColor(0, 0, 0);
  doc.text(`Ruj: ${data.noRujukan}`, mL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/SURAT_IRINGAN_ARIDHASAN_KL.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_IRINGAN_ARIDHASAN_KL.pdf");
console.log(`Total pages: ${totalPages}`);
