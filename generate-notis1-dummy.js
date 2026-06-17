const { jsPDF } = require("jspdf");
const fs = require("fs");

// ============================================================
// DUMMY DATA — nanti user hanya perlu tukar bahagian ini
// ============================================================
const data = {
  // Rujukan surat
  noRujukan: "NOTIS-1/2026/039",

  // Maklumat Pembeli
  namaPembeli: "MUHAMMAD IMRAN BIN MOHAMAD NAZARUDIN",
  alamatPembeli: "No.39, Jalan Seluang, Tg Puteri Resort,\n81700, Pasir Gudang, Johor Darul Takzim.",
  emailPembeli: "imranalan20@gmail.com",
  telefonPembeli: "013-6749124",
  noKP: "991005-XX-XXXX",

  // Maklumat Pemaju
  namaPemaju: "SCUDAI DEVELOPMENT SDN. BHD.",
  alamatPemaju: "Jalan Seluang 35, Tg Puteri Resort,\n81700 Pasir Gudang, Johor.",
  emailPemaju: "scudai@scudai.com.my",

  // Maklumat Hartanah
  alamatHartanah: "No.39, Jalan Seluang, Tg Puteri Resort, 81700, Pasir Gudang, Johor Darul Takzim",

  // Maklumat SPA & DLP
  noRujukanSPA: "SPA/SCUDAI/2024/1039",
  tarikhSPA: "15 Mac 2024",
  jenisSPA: "Jadual G",
  tarikhVP: "1 Mac 2025",
  tempohDLP: "24",

  // Maklumat Laporan & Tarikh
  noRujukanLaporan: "RPK/IMRAN/2026/001",
  tarikhSerahanLaporan: "25 Februari 2026",
  kaedahSerahanLaporan: "serahan tangan",
  tarikhPemeriksaanKedua: "6 Jun 2026",
  tarikhHantarLaporanKedua: "10 Jun 2026",

  // Tarikh Notis
  tarikhNotis: "18 Jun 2026",
  tarikhDeadline: "3 Julai 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  // Kaedah penghantaran notis ini
  kaedahPenghantaranNotis: "serahan tangan dan e-mel",

  // Senarai Kecacatan
  kecacatan: [
    { tag: "155", lokasi: "Tandas 1", kecacatan: "Kebocoran pada paip basin", status: "Tidak ditindakan" },
    { tag: "168", lokasi: "Bilik Tidur 2", kecacatan: "Kelembapan di dinding", status: "Tidak ditindakan" },
    { tag: "223", lokasi: "RC Flat Roof", kecacatan: "Metal deck kemek", status: "Tidak ditindakan" },
    { tag: "235", lokasi: "Atas Bumbung", kecacatan: "Atap genting pecah dan retak", status: "Pembaikan tidak sempurna" },
    { tag: "240", lokasi: "Atas Bumbung (Tingkat 1)", kecacatan: "Pemegang tingkap longgar", status: "Tidak ditindakan" },
    { tag: "242", lokasi: "Atas Bumbung (Tingkat 1)", kecacatan: "Atap genting pecah dan retak", status: "Tidak ditindakan" },
  ],

  // Salinan Kepada (CC)
  salianKepada: [
    "Peguam Pemaju — Tetuan ABC & Partners, Johor Bahru",
    "Jabatan Perumahan Negara (KPKT)",
  ],
};

// ============================================================
// PDF GENERATION
// ============================================================
const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const marginL = 25;
const marginR = 25;
const contentW = pageW - marginL - marginR;
let y = 0;
let pageNum = 1;
let totalPages = 4; // estimated, we'll update footer later

function setFont(style = "normal", size = 11) {
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
}

function setColor(r = 33, g = 33, b = 33) {
  doc.setTextColor(r, g, b);
}

function addFooter(pg) {
  // no-op during generation; footers are written in the final pass
}

function checkPageBreak(needed = 20) {
  if (y + needed > pageH - 25) {
    addFooter(pageNum);
    doc.addPage();
    pageNum++;
    y = 25;
    return true;
  }
  return false;
}

function drawLine() {
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.5);
  doc.line(marginL, y, pageW - marginR, y);
  y += 3;
}

function drawThinLine() {
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(marginL, y, pageW - marginR, y);
  y += 3;
}

function writeText(text, options = {}) {
  const {
    style = "normal",
    size = 11,
    align = "left",
    color = [33, 33, 33],
    maxWidth = contentW,
    lineHeight = 5.5,
    indent = 0,
  } = options;

  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  doc.setTextColor(color[0], color[1], color[2]);

  const x = align === "right" ? pageW - marginR : marginL + indent;
  const lines = doc.splitTextToSize(text, maxWidth - indent);

  for (const line of lines) {
    checkPageBreak(lineHeight + 2);
    doc.text(line, x, y, { align: align === "right" ? "right" : "left" });
    y += lineHeight;
  }
}

function writeNumberedParagraph(num, text, options = {}) {
  const { style = "normal", size = 11, lineHeight = 5.5 } = options;
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  doc.setTextColor(33, 33, 33);

  const numStr = `${num}.`;
  const numWidth = 8;
  const textX = marginL + numWidth;
  const textW = contentW - numWidth;

  checkPageBreak(lineHeight + 2);
  doc.text(numStr, marginL, y);

  const lines = doc.splitTextToSize(text, textW);
  for (const line of lines) {
    checkPageBreak(lineHeight + 2);
    doc.text(line, textX, y);
    y += lineHeight;
  }
}

function writeBullet(text, options = {}) {
  const { indent = 12, size = 11, lineHeight = 5.5 } = options;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(33, 33, 33);

  const bulletX = marginL + indent;
  const textX = bulletX + 5;
  const textW = contentW - indent - 5;

  checkPageBreak(lineHeight + 2);
  doc.text("•", bulletX, y);
  const lines = doc.splitTextToSize(text, textW);
  for (const line of lines) {
    checkPageBreak(lineHeight + 2);
    doc.text(line, textX, y);
    y += lineHeight;
  }
}

// ============================================================
// PAGE 1 — HEADER & BODY
// ============================================================
y = 22;

// Sender header
writeText(data.namaPembeli, { style: "bold", size: 13 });
y += 1;

const alamatLines = data.alamatPembeli.split("\n");
for (const line of alamatLines) {
  writeText(line, { size: 10, color: [80, 80, 80] });
}
writeText(`E-mel: ${data.emailPembeli}`, { size: 10, color: [80, 80, 80] });
writeText(`Telefon: ${data.telefonPembeli}`, { size: 10, color: [80, 80, 80] });

y += 2;
drawLine();
y += 2;

// Reference number (left) and Date (right)
setFont("bold", 10);
setColor(100, 100, 100);
doc.text(`Ruj: ${data.noRujukan}`, marginL, y);
doc.text(`Tarikh: ${data.tarikhNotis}`, pageW - marginR, y, { align: "right" });
y += 8;

// Recipient
writeText("Kepada:", { style: "bold", size: 10, color: [100, 100, 100] });
writeText(data.namaPemaju, { style: "bold", size: 11 });
const pemajuLines = data.alamatPemaju.split("\n");
for (const line of pemajuLines) {
  writeText(line, { size: 10, color: [80, 80, 80] });
}
writeText(`E-mel: ${data.emailPemaju}`, { size: 10, color: [80, 80, 80] });

y += 6;
drawThinLine();
y += 3;

// Title — shortened per suggestion B2
writeText("NOTIS PERTAMA", { style: "bold", size: 13, align: "left" });
writeText("Tuntutan Pembetulan Kecacatan (Defect Rectification Claim)", { style: "bold", size: 11 });
y += 1;
writeText(`Hartanah: ${data.alamatHartanah}`, { size: 10, color: [80, 80, 80] });

y += 6;

// Salutation
writeText("Tuan/Puan,", { style: "bold", size: 11 });
y += 3;

// Paragraph 1 — with SPA ref, VP date (A1, A2, A3, B3)
writeNumberedParagraph(
  1,
  `Merujuk kepada Perjanjian Jual Beli (Sales and Purchase Agreement) bertarikh ${data.tarikhSPA} dengan nombor rujukan ${data.noRujukanSPA} (${data.jenisSPA}), Laporan Pemeriksaan Kecacatan (Defect Inspection Report) bernombor rujukan ${data.noRujukanLaporan} telah dikemukakan secara rasmi kepada pihak tuan melalui penghantaran secara ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}.`
);
y += 2;

writeText(
  `Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan selaras dengan tanggungjawab pemaju di bawah Klausa 27(1) Perjanjian Jual Beli (${data.jenisSPA}). Unit ini masih berada dalam Tempoh Liabiliti Kecacatan (Defect Liability Period — DLP) selama ${data.tempohDLP} bulan dari tarikh Penyerahan Milik Kosong (Vacant Possession) pada ${data.tarikhVP}.`,
  { indent: 8 }
);

y += 4;

// Paragraph 2
writeNumberedParagraph(
  2,
  `Susulan laporan yang telah dikemukakan sebelum ini, hasil daripada pemerhatian kali kedua (Second Inspection) pada ${data.tarikhPemeriksaanKedua} mendapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum disempurnakan sepenuhnya atau tidak dilakukan langsung seperti berikut:`
);

y += 5;

// Defect Table Header — with Status column (B4)
writeText("Senarai Kecacatan yang Masih Belum Diselesaikan:", { style: "bold", size: 11 });
y += 3;

const colTag = marginL;
const colLokasi = marginL + 18;
const colKecacatan = marginL + 55;
const colStatus = marginL + 115;
const tableRight = pageW - marginR;

// Table header background
doc.setFillColor(45, 55, 72);
doc.rect(marginL, y - 4, contentW, 8, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(9);
doc.setTextColor(255, 255, 255);
doc.text("Tag", colTag + 2, y);
doc.text("Lokasi", colLokasi + 2, y);
doc.text("Kecacatan (Defect)", colKecacatan + 2, y);
doc.text("Status", colStatus + 2, y);
y += 7;

// Table rows
doc.setFont("helvetica", "normal");
doc.setFontSize(9);

for (let i = 0; i < data.kecacatan.length; i++) {
  const item = data.kecacatan[i];
  checkPageBreak(14);

  // Alternating row bg
  if (i % 2 === 0) {
    doc.setFillColor(245, 247, 250);
    doc.rect(marginL, y - 4, contentW, 10, "F");
  }

  // Status color coding
  const statusColor = item.status === "Tidak ditindakan" ? [220, 38, 38] : [234, 138, 0];

  doc.setTextColor(33, 33, 33);
  doc.text(item.tag, colTag + 2, y);

  const lokasiLines = doc.splitTextToSize(item.lokasi, 34);
  doc.text(lokasiLines[0], colLokasi + 2, y);
  if (lokasiLines.length > 1) {
    doc.text(lokasiLines[1], colLokasi + 2, y + 4);
  }

  const kecacatanLines = doc.splitTextToSize(item.kecacatan, 56);
  doc.text(kecacatanLines[0], colKecacatan + 2, y);
  if (kecacatanLines.length > 1) {
    doc.text(kecacatanLines[1], colKecacatan + 2, y + 4);
  }

  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont("helvetica", "bold");
  const statusLines = doc.splitTextToSize(item.status, 40);
  doc.text(statusLines[0], colStatus + 2, y);
  if (statusLines.length > 1) {
    doc.text(statusLines[1], colStatus + 2, y + 4);
  }
  doc.setFont("helvetica", "normal");

  const rowH = Math.max(lokasiLines.length, kecacatanLines.length, statusLines.length) > 1 ? 12 : 8;
  y += rowH;
}

// Table bottom line
doc.setDrawColor(45, 55, 72);
doc.setLineWidth(0.3);
doc.line(marginL, y - 2, tableRight, y - 2);
y += 3;

// Table footnote
doc.setFont("helvetica", "italic");
doc.setFontSize(8);
doc.setTextColor(120, 120, 120);
doc.text(`*Senarai lengkap kecacatan adalah sebagaimana dinyatakan di dalam Laporan Pemeriksaan Kecacatan (Ruj: ${data.noRujukanLaporan})`, marginL, y);
y += 8;

// Paragraph 3 — notice demand
setColor();
writeNumberedParagraph(
  3,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}.`
);
y += 1;
writeText(
  `Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan selaras dengan Klausa 27(1) Perjanjian Jual Beli (${data.jenisSPA}).`,
  { indent: 8 }
);

y += 4;

// Paragraph 4 — consequences
writeNumberedParagraph(
  4,
  "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:"
);
y += 1;
writeBullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
writeBullet(`Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan`);
writeBullet(
  `Menghantar surat rasmi kepada peguam pemaju (stakeholder) untuk memohon agar kos pembaikan ditolak/ditahan daripada Wang Tahanan 5% (Retention Sum 5%) yang sedang dipegang, sebagaimana diperuntukkan di bawah Klausa 27(3) Perjanjian Jual Beli (${data.jenisSPA}).`
);

y += 4;

// Paragraph 5 — service of documents (B6)
writeNumberedParagraph(
  5,
  `Merujuk kepada Klausa Penyampaian Dokumen 29(1) (Service of Documents) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan, pos berdaftar atau e-mel adalah dianggap sah dan diterima pakai sebagai dokumen rasmi. Notis ini dihantar melalui ${data.kaedahPenghantaranNotis}. Selain itu, saya juga telah menghantar Laporan Kecacatan bagi pemeriksaan kali kedua pada ${data.tarikhHantarLaporanKedua} kepada pihak pemaju.`
);

y += 4;

// Paragraph 6
writeNumberedParagraph(
  6,
  "Oleh yang demikian, pihak tuan hendaklah menerima sepenuhnya notis ini secara rasmi serta mengambil tindakan sewajarnya untuk menyelesaikan isu kecacatan yang berlaku di unit kediaman saya."
);

y += 6;

// Legal Warning Section
checkPageBreak(40);
doc.setFillColor(254, 243, 243);
doc.rect(marginL, y - 4, contentW, 6, "F");
writeText("Peringatan Tindakan Undang-undang (Legal Action Notice)", { style: "bold", size: 11, color: [180, 30, 30] });
y += 2;

// Paragraph 7 — enhanced with Akta 118 (A5)
writeNumberedParagraph(
  7,
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);

y += 6;

writeText("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini.", { style: "italic" });
y += 3;
writeText("Sekian, terima kasih.");

y += 10;
writeText("Yang benar,");
y += 15;

// Signature line
doc.setDrawColor(33, 33, 33);
doc.setLineWidth(0.4);
doc.line(marginL, y, marginL + 60, y);
y += 5;
writeText(data.namaPembeli, { style: "bold", size: 11 });
writeText(`(No. K/P: ${data.noKP})`, { size: 10, color: [100, 100, 100] });

y += 6;

// CC section (A6)
drawThinLine();
y += 2;
writeText("s.k. (Salinan Kepada / Carbon Copy):", { style: "bold", size: 9, color: [100, 100, 100] });
for (const cc of data.salianKepada) {
  writeText(`• ${cc}`, { size: 9, color: [100, 100, 100] });
}

// Footer for page 1 area
addFooter(pageNum);

// ============================================================
// PAGE 3 — AKUAN TERIMA OLEH PEMAJU
// ============================================================
doc.addPage();
pageNum++;
y = 30;

writeText("AKUAN TERIMA OLEH PEMAJU", { style: "bold", size: 14, align: "left" });
writeText("(Developer's Acknowledgement of Receipt)", { style: "normal", size: 10, color: [100, 100, 100] });

y += 5;
drawLine();
y += 5;

writeText(
  `Dengan ini diakui bahawa ${data.namaPemaju} telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`
);

y += 15;
writeText("Diterima oleh:", { style: "bold" });
y += 12;

// Signature fields
const fieldLabelX = marginL;
const fieldLineStart = marginL + 30;
const fieldLineEnd = marginL + 120;

const fields = ["Nama", "Jawatan", "Tarikh"];
for (const field of fields) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(33, 33, 33);
  doc.text(`${field}`, fieldLabelX, y);
  doc.text(":", fieldLabelX + 25, y);
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(fieldLineStart, y + 1, fieldLineEnd, y + 1);
  y += 12;
}

y += 5;
writeText("Cop Syarikat (Company Stamp):", { style: "bold", size: 10 });
y += 3;
doc.setDrawColor(180, 180, 180);
doc.setLineWidth(0.3);
doc.rect(marginL, y, 60, 30);
doc.setFont("helvetica", "italic");
doc.setFontSize(8);
doc.setTextColor(180, 180, 180);
doc.text("[Cop Syarikat di sini]", marginL + 10, y + 17);

addFooter(pageNum);

// ============================================================
// PAGE 4 — LAMPIRAN A: GAMBAR BUKTI KECACATAN (C1 — placeholder)
// ============================================================
doc.addPage();
pageNum++;
y = 22;

writeText("LAMPIRAN A", { style: "bold", size: 14 });
writeText("Gambar Bukti Kecacatan (Defect Evidence Photos)", { style: "normal", size: 10, color: [100, 100, 100] });
y += 2;
drawLine();
y += 5;

writeText(`Rujukan Laporan: ${data.noRujukanLaporan}`, { size: 9, color: [100, 100, 100] });
writeText(`Tarikh Pemeriksaan Kedua: ${data.tarikhPemeriksaanKedua}`, { size: 9, color: [100, 100, 100] });
y += 5;

// Photo placeholders — 2 columns, 3 rows
const photoW = (contentW - 8) / 2;
const photoH = 55;
const gap = 8;

for (let i = 0; i < data.kecacatan.length; i++) {
  const col = i % 2;
  const row = Math.floor(i / 2);

  if (col === 0 && i > 0) {
    y += 0; // handled by row logic
  }

  const px = marginL + col * (photoW + gap);
  const py = col === 0 ? y : y; // same row

  // Photo box
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.setFillColor(248, 249, 250);
  doc.rect(px, py, photoW, photoH, "FD");

  // Placeholder icon
  doc.setFontSize(20);
  doc.setTextColor(200, 200, 200);
  doc.text("[FOTO]", px + photoW / 2, py + photoH / 2 - 3, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Tag #${data.kecacatan[i].tag}`, px + photoW / 2, py + photoH / 2 + 5, { align: "center" });

  // Caption below photo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(33, 33, 33);
  doc.text(`Tag ${data.kecacatan[i].tag} — ${data.kecacatan[i].lokasi}`, px + 2, py + photoH + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  const captionLines = doc.splitTextToSize(data.kecacatan[i].kecacatan, photoW - 4);
  doc.text(captionLines[0], px + 2, py + photoH + 9);

  // Move to next row after second column
  if (col === 1) {
    y += photoH + 18;
  }
}

// If odd number of items, still advance y
if (data.kecacatan.length % 2 === 1) {
  y += photoH + 18;
}

addFooter(pageNum);

// ============================================================
// FIX: Update total page count in all footers
// ============================================================
totalPages = pageNum;
const allPages = doc.internal.getNumberOfPages();
for (let p = 1; p <= allPages; p++) {
  doc.setPage(p);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW / 2, pageH - 12, { align: "center" });
  doc.text(`Ruj: ${data.noRujukan}`, marginL, pageH - 12);
}

// ============================================================
// SAVE
// ============================================================
const pdfOutput = doc.output("arraybuffer");
const outputPath = "/home/user/admin/NOTIS_1_DUMMY_IMPROVED.pdf";
fs.writeFileSync(outputPath, Buffer.from(pdfOutput));
console.log(`PDF generated: ${outputPath}`);
console.log(`Total pages: ${totalPages}`);
