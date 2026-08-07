const { jsPDF } = require("jspdf");
const fs = require("fs");

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 25;
const mR = 25;
const cW = pageW - mL - mR;
let y = 0;
let pageNum = 1;

const SZ = { BODY: 11.5, SMALL: 10, FOOTER: 8, TITLE: 12 };
const LH = 5.8;
const LH_S = 5;

function bk() { doc.setTextColor(0, 0, 0); doc.setDrawColor(0, 0, 0); }
function newPage() { doc.addPage(); pageNum++; y = 25; }
function checkBreak(n = 15) { if (y + n > pageH - 20) { newPage(); return true; } return false; }

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

function fieldLine(label, blankLen = 90) {
  checkBreak(8);
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
  doc.text(label, mL, y);
  const lx = mL + doc.getTextWidth(label) + 2;
  doc.setLineWidth(0.2);
  doc.line(lx, y + 1, Math.min(lx + blankLen, pageW - mR), y + 1);
  y += 8;
}

// ============================================================
// SURAT — halaman 1
// ============================================================
y = 22;

// Header
doc.setFont("helvetica", "bold"); doc.setFontSize(13); bk();
doc.text("NOTIS KEPADA PEGUAM PEMEGANG WANG TAHANAN", pageW / 2, y, { align: "center" });
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("(NOTICE TO STAKEHOLDER LAWYERS — 5% Retention Sum)", pageW / 2, y, { align: "center" });
y += 4;
doc.setLineWidth(0.4);
doc.line(mL, y, pageW - mR, y);
y += 8;

// Pengirim
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("DARIPADA (Pembeli / Purchaser):", mL, y); y += 7;
fieldLine("Nama Penuh:", 100);
fieldLine("No. K/P:", 60);
fieldLine("Alamat:", 110);
fieldLine("", 130);
fieldLine("Tel:                                     E-mel:", 70);
y += 1;

// Penerima
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("KEPADA (Tetuan Peguam Pemegang Wang Tahanan / Stakeholder Lawyers):", mL, y); y += 7;
fieldLine("Nama Firma (Tetuan):", 95);
fieldLine("Alamat Firma:", 105);
fieldLine("", 130);
y += 1;

fieldLine("Tarikh:", 50);
y += 2;

doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY);
doc.text("Tuan/Puan,", mL, y);
y += 8;

// Perkara
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const pk = "PER: NOTIS KEPADA PEMEGANG WANG TAHANAN (STAKEHOLDER) — LARANGAN PELEPASAN WANG TAHANAN 5% SEHINGGA KECACATAN DISEMPURNAKAN";
const pkl = doc.splitTextToSize(pk, cW);
for (const l of pkl) {
  doc.text(l, mL, y);
  doc.setLineWidth(0.3);
  doc.line(mL, y + 1, mL + doc.getTextWidth(l), y + 1);
  y += LH;
}
y += 5;

// Butiran hartanah
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("Butiran Hartanah / Perjanjian:", mL, y); y += 7;
fieldLine("Pemaju (Developer):", 100);
fieldLine("Projek / Fasa:", 100);
fieldLine("No. Lot / PTD:", 90);
fieldLine("Alamat Hartanah:", 105);
fieldLine("", 130);
fieldLine("Tarikh Perjanjian Jual Beli (SPA):", 60);
y += 2;

para("Dengan segala hormatnya saya merujuk kepada perkara di atas.");
y += 3;

numPara(1,
  "Untuk makluman pihak tuan, selaras dengan Perjanjian Jual Beli tersebut, saya telah mengemukakan notis dan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) kepada pihak pemaju bagi menuntut pembaikan kecacatan di bawah Tempoh Liabiliti Kecacatan (Defect Liability Period). Salinan laporan kecacatan tersebut disertakan bersama-sama surat ini untuk rekod pihak tuan."
);
y += 3;

numPara(2,
  "Sehingga tarikh surat ini, kecacatan yang dilaporkan masih belum disempurnakan oleh pihak pemaju."
);
y += 3;

numPara(3,
  "Oleh yang demikian, saya dengan ini memberikan notis kepada pihak tuan selaku pemegang wang tahanan (Stakeholder), supaya TIDAK MELEPASKAN mana-mana bahagian daripada wang tahanan lima peratus (5%) (stakeholder sum) kepada pihak pemaju sehingga saya mengesahkan secara bertulis bahawa saya berpuas hati dengan semua kerja pembaikan kecacatan yang telah dilaksanakan."
);
y += 3;

numPara(4,
  "Sekiranya pihak tuan melepaskan wang tahanan tersebut kepada pemaju tanpa pengesahan saya, dan bertentangan dengan notis ini, saya akan mempertanggungjawabkan firma tuan secara profesional dan tidak akan teragak-agak untuk memfailkan aduan rasmi kepada Majlis Peguam Malaysia (Bar Council) serta mengambil apa-apa tindakan lain yang diperuntukkan di bawah undang-undang."
);
y += 3;

numPara(5,
  "Kerjasama pihak tuan dalam perkara ini amatlah dihargai. Sebarang pertanyaan boleh menghubungi saya di talian yang dinyatakan di atas."
);
y += 5;

para("Sekian, terima kasih.");
y += 6;

checkBreak(55);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 16;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 70, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("(Nama:                                                            )", mL, y); y += 6;
doc.text("No. K/P:", mL, y); y += 8;

// s.k.
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("s.k. (CC):", mL, y); y += 5;
doc.setFont("helvetica", "normal");
doc.text("1. Pihak Pemaju (Developer) — melalui pos berdaftar / serahan tangan", mL + 5, y); y += 5;
doc.text("2. Fail pemilik", mL + 5, y); y += 5;

// Lampiran
y += 2;
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL);
doc.text("Lampiran:", mL, y); y += 5;
doc.setFont("helvetica", "normal");
doc.text("1. Laporan Pemeriksaan Kecacatan (Defect Inspection Report)", mL + 5, y); y += 5;
doc.text("2. Salinan Notis Pertama / Notis kepada Pemaju", mL + 5, y); y += 5;

// ============================================================
// FOOTER
// ============================================================
const totalPages = pageNum;
for (let p = 1; p <= doc.internal.getNumberOfPages(); p++) {
  doc.setPage(p);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2);
  doc.line(mL, pageH - 16, pageW - mR, pageH - 16);
  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTER); doc.setTextColor(0, 0, 0);
  doc.text("Template disediakan oleh GoXpert — untuk kegunaan pemilik rumah (isi tempat kosong sebelum hantar)", mL, pageH - 11);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 11, { align: "right" });
}

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/SURAT_STAKEHOLDER_TEMPLATE_GOXPERT.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_STAKEHOLDER_TEMPLATE_GOXPERT.pdf");
console.log(`Total pages: ${totalPages}`);
