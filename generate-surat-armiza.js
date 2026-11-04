const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "ARMIZA/SEMAKAN-AIR/2026",

  namaPemilik: "NOR ARMIZA BINTI A RAHMAN",
  alamatPengirim: [
    "No. 20, Jalan CI-2A,",
    "Taman Camar Indah,",
    "75450 Ayer Keroh,",
    "Melaka.",
  ],
  telefonPemilik: "010-945 6338",
  emailPemilik: "noramiza@yahoo.com.my",

  alamatHartanah: "No. 20, Jalan CI-2A, Taman Camar Indah, 75450 Ayer Keroh, Melaka",
  jenisHartanah: "Rumah Setingkat Lot Penjuru (Single Storey Corner Lot House)",

  tarikhSurat: "4 November 2026",
  tarikhPemeriksaan: "30 Oktober 2026",
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

// ===== Sender =====
y = 25;
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text(data.namaPemilik, mL, y);
y += LH;
doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`E-mel: ${data.emailPemilik}`, mL, y); y += LH_S;
doc.text(`Tel: ${data.telefonPemilik}`, mL, y); y += LH_S;
y += 3;
doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

// ===== Recipient =====
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("KEPADA PIHAK KONTRAKTOR / PEMAJU", mL, y);
y += LH_S;
doc.setFont("helvetica", "normal");
doc.text(`(Unit: ${data.alamatHartanah})`, mL, y);
y += LH_S;

doc.text(data.tarikhSurat, pageW - mR, y - LH_S, { align: "right" });
y += 3;
doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukan}`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan/Puan,", mL, y);
y += 8;

// ===== Title =====
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const perkara1 = "Permohonan Semakan dan Pembaikan Bekalan Air — Bathroom 1";
const perkara2 = "(Request for Water Supply Check — Low Water Pressure / No Supply)";
const perkara3 = `Hartanah: ${data.jenisHartanah} di ${data.alamatHartanah}`;
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
  `Saya, ${data.namaPemilik}, pemilik unit hartanah di alamat di atas, merujuk kepada Pemeriksaan Kecacatan (Defect Inspection) yang telah dijalankan pada ${data.tarikhPemeriksaan} oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM).`
);
y += 4;

numPara(2,
  `Semasa pemeriksaan tersebut, didapati bekalan air di Bathroom 1 mengalami masalah TEKANAN AIR RENDAH / TIADA BEKALAN PADA WAKTU TERTENTU (low water pressure / no supply at times) pada shower head, water tap, cistern tandas dan basin tap — walaupun stopcock berada dalam kedudukan terbuka (bekalan air dari tangki air). Keadaan ini direkodkan sebagai Item No. 83 (Major Defect — Plumbing & Sanitary Fitting) di dalam laporan pemeriksaan.`
);
y += 4;

numPara(3,
  `Sehubungan itu, dimohon jasa baik pihak tuan/puan untuk MENYEMAK DAN MEMBAIKI bekalan air tersebut terlebih dahulu — termasuk laluan paip dari tangki air, injap (valve) dan sebarang sekatan pada sistem — dalam tempoh MINGGU INI sekiranya boleh. Ini kerana pasukan pemeriksa akan hadir semula ke unit ini untuk MENYAMBUNG PEMERIKSAAN BAHAGIAN PAIP (plumbing), dan pemeriksaan tersebut tidak dapat dijalankan dengan sempurna selagi bekalan air belum berfungsi dengan normal.`
);
y += 4;

numPara(4,
  `Mohon pihak tuan/puan memaklumkan kepada saya tarikh semakan/pembaikan akan dijalankan dan tarikh ia dijangka selesai, melalui telefon (${data.telefonPemilik}) atau e-mel (${data.emailPemilik}).`
);
y += 4;

para("Kerjasama dan perhatian segera pihak tuan/puan amat dihargai dan didahului dengan ucapan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(50);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 18;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPemilik})`, mL, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`E-mel: ${data.emailPemilik}`, mL, y); y += LH_S;
doc.text(`Telefon: ${data.telefonPemilik}`, mL, y); y += 7;

// ===== Footer =====
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
fs.writeFileSync("/home/user/admin/SURAT_SEMAKAN_AIR_ARMIZA.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_SEMAKAN_AIR_ARMIZA.pdf");
console.log(`Total pages: ${totalPages}`);
