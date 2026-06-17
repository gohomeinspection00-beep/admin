const { jsPDF } = require("jspdf");
const fs = require("fs");

// ============================================================
// DUMMY DATA
// ============================================================
const data = {
  noRujukan: "NOTIS-1/2026/039",

  namaPembeli: "MUHAMMAD IMRAN BIN MOHAMAD NAZARUDIN",
  alamatPembeli: "No.39, Jalan Seluang, Tg Puteri Resort,\n81700, Pasir Gudang, Johor Darul Takzim.",
  emailPembeli: "imranalan20@gmail.com",
  telefonPembeli: "013-6749124",
  noKP: "991005-XX-XXXX",

  namaPemaju: "SCUDAI DEVELOPMENT SDN. BHD.",
  alamatPemaju: "Jalan Seluang 35, Tg Puteri Resort,\n81700 Pasir Gudang, Johor.",
  emailPemaju: "scudai@scudai.com.my",

  alamatHartanah: "No.39, Jalan Seluang, Tg Puteri Resort, 81700, Pasir Gudang, Johor Darul Takzim",

  noRujukanSPA: "SPA/SCUDAI/2024/1039",
  tarikhSPA: "15 Mac 2024",
  jenisSPA: "Jadual G",
  tarikhVP: "1 Mac 2025",
  tempohDLP: "24",

  noRujukanLaporan: "RPK/IMRAN/2026/001",
  tarikhSerahanLaporan: "25 Februari 2026",
  kaedahSerahanLaporan: "serahan tangan",
  tarikhPemeriksaanKedua: "6 Jun 2026",
  tarikhHantarLaporanKedua: "10 Jun 2026",

  tarikhNotis: "18 Jun 2026",
  tarikhDeadline: "3 Julai 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kaedahPenghantaranNotis: "serahan tangan dan e-mel",

  kecacatan: [
    { tag: "155", lokasi: "Tandas 1", kecacatan: "Kebocoran pada paip basin", status: "Tidak ditindakan" },
    { tag: "168", lokasi: "Bilik Tidur 2", kecacatan: "Kelembapan di dinding", status: "Tidak ditindakan" },
    { tag: "223", lokasi: "RC Flat Roof", kecacatan: "Metal deck kemek", status: "Tidak ditindakan" },
    { tag: "235", lokasi: "Atas Bumbung", kecacatan: "Atap genting pecah dan retak", status: "Pembaikan tidak sempurna" },
    { tag: "240", lokasi: "Atas Bumbung (Tingkat 1)", kecacatan: "Pemegang tingkap longgar", status: "Tidak ditindakan" },
    { tag: "242", lokasi: "Atas Bumbung (Tingkat 1)", kecacatan: "Atap genting pecah dan retak", status: "Tidak ditindakan" },
  ],

  salinanKepada: [
    "Peguam Pemaju — Tetuan ABC & Partners, Johor Bahru",
    "Jabatan Perumahan Negara (KPKT)",
  ],
};

// ============================================================
// PDF SETUP
// ============================================================
const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const marginL = 25;
const marginR = 25;
const contentW = pageW - marginL - marginR;
const BLACK = [0, 0, 0];
let y = 0;
let pageNum = 1;

// ============================================================
// FONT SIZE STANDARD (Surat Rasmi)
// ============================================================
const FONT = {
  NAME: 12,        // Nama pengirim
  TITLE: 14,       // Tajuk utama (NOTIS PERTAMA)
  SUBTITLE: 12,    // Sub-tajuk
  BODY: 12,        // Teks badan surat
  SMALL: 10,       // Alamat, maklumat kecil
  TABLE_HEAD: 10,  // Header jadual
  TABLE_BODY: 10,  // Isi jadual
  CAPTION: 9,      // Caption gambar
  FOOTNOTE: 9,     // Nota kaki
  FOOTER: 8,       // Footer muka surat
  FIELD_LABEL: 12, // Label borang (Nama, Jawatan)
};

const LH = {
  BODY: 6,
  SMALL: 5,
  TABLE: 5.5,
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function resetColor() {
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(0, 0, 0);
}

function checkPageBreak(needed = 20) {
  if (y + needed > pageH - 25) {
    doc.addPage();
    pageNum++;
    y = 25;
    return true;
  }
  return false;
}

function drawLine(weight = 0.5) {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(weight);
  doc.line(marginL, y, pageW - marginR, y);
  y += 4;
}

function writeText(text, options = {}) {
  const {
    style = "normal",
    size = FONT.BODY,
    align = "left",
    maxWidth = contentW,
    lineHeight = LH.BODY,
    indent = 0,
  } = options;

  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  doc.setTextColor(0, 0, 0);

  const x = align === "right" ? pageW - marginR : marginL + indent;
  const lines = doc.splitTextToSize(text, maxWidth - indent);

  for (const line of lines) {
    checkPageBreak(lineHeight + 2);
    doc.text(line, x, y, { align: align === "right" ? "right" : "left" });
    y += lineHeight;
  }
}

function writeNumberedParagraph(num, text, options = {}) {
  const { size = FONT.BODY, lineHeight = LH.BODY } = options;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(0, 0, 0);

  const numStr = `${num}.`;
  const numWidth = 10;
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
  const { indent = 14, size = FONT.BODY, lineHeight = LH.BODY } = options;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(0, 0, 0);

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
// PAGE 1 — HEADER
// ============================================================
y = 25;

// Nama pengirim
writeText(data.namaPembeli, { style: "bold", size: FONT.NAME });
y += 1;

const alamatLines = data.alamatPembeli.split("\n");
for (const line of alamatLines) {
  writeText(line, { size: FONT.SMALL, lineHeight: LH.SMALL });
}
writeText(`E-mel: ${data.emailPembeli}`, { size: FONT.SMALL, lineHeight: LH.SMALL });
writeText(`Telefon: ${data.telefonPembeli}`, { size: FONT.SMALL, lineHeight: LH.SMALL });

y += 3;
drawLine(0.5);
y += 1;

// Rujukan & Tarikh
doc.setFont("helvetica", "normal");
doc.setFontSize(FONT.SMALL);
doc.setTextColor(0, 0, 0);
doc.text(`Ruj: ${data.noRujukan}`, marginL, y);
doc.text(`Tarikh: ${data.tarikhNotis}`, pageW - marginR, y, { align: "right" });
y += 8;

// Penerima
writeText("Kepada:", { style: "bold", size: FONT.SMALL, lineHeight: LH.SMALL });
writeText(data.namaPemaju, { style: "bold", size: FONT.BODY });
const pemajuLines = data.alamatPemaju.split("\n");
for (const line of pemajuLines) {
  writeText(line, { size: FONT.SMALL, lineHeight: LH.SMALL });
}
writeText(`E-mel: ${data.emailPemaju}`, { size: FONT.SMALL, lineHeight: LH.SMALL });

y += 8;

// ============================================================
// TAJUK — centered, underlined (format surat rasmi)
// ============================================================
doc.setFont("helvetica", "bold");
doc.setFontSize(FONT.TITLE);
doc.setTextColor(0, 0, 0);
const titleText = "NOTIS PERTAMA";
doc.text(titleText, pageW / 2, y, { align: "center" });
const titleW = doc.getTextWidth(titleText);
doc.setLineWidth(0.5);
doc.line(pageW / 2 - titleW / 2, y + 1, pageW / 2 + titleW / 2, y + 1);
y += 7;

doc.setFont("helvetica", "bold");
doc.setFontSize(FONT.SUBTITLE);
const subTitle = "Tuntutan Pembetulan Kecacatan (Defect Rectification Claim)";
doc.text(subTitle, pageW / 2, y, { align: "center" });
const subW = doc.getTextWidth(subTitle);
doc.setLineWidth(0.3);
doc.line(pageW / 2 - subW / 2, y + 1, pageW / 2 + subW / 2, y + 1);
y += 6;

doc.setFont("helvetica", "normal");
doc.setFontSize(FONT.SMALL);
doc.text(`Hartanah: ${data.alamatHartanah}`, pageW / 2, y, { align: "center" });
y += 8;

// Salam
writeText("Tuan/Puan,", { style: "bold", size: FONT.BODY });
y += 4;

// ============================================================
// PERENGGAN 1
// ============================================================
writeNumberedParagraph(
  1,
  `Merujuk kepada Perjanjian Jual Beli (Sales and Purchase Agreement) bertarikh ${data.tarikhSPA} dengan nombor rujukan ${data.noRujukanSPA} (${data.jenisSPA}), Laporan Pemeriksaan Kecacatan (Defect Inspection Report) bernombor rujukan ${data.noRujukanLaporan} telah dikemukakan secara rasmi kepada pihak tuan melalui penghantaran secara ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}.`
);
y += 2;

writeText(
  `Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan selaras dengan tanggungjawab pemaju di bawah Klausa 27(1) Perjanjian Jual Beli (${data.jenisSPA}). Unit ini masih berada dalam Tempoh Liabiliti Kecacatan (Defect Liability Period — DLP) selama ${data.tempohDLP} bulan dari tarikh Penyerahan Milik Kosong (Vacant Possession) pada ${data.tarikhVP}.`,
  { indent: 10 }
);

y += 4;

// ============================================================
// PERENGGAN 2
// ============================================================
writeNumberedParagraph(
  2,
  `Susulan laporan yang telah dikemukakan sebelum ini, hasil daripada pemerhatian kali kedua (Second Inspection) pada ${data.tarikhPemeriksaanKedua} mendapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum disempurnakan sepenuhnya atau tidak dilakukan langsung seperti berikut:`
);

y += 5;

// ============================================================
// JADUAL KECACATAN — hitam putih, formal
// ============================================================
writeText("Senarai Kecacatan yang Masih Belum Diselesaikan:", { style: "bold", size: FONT.BODY });
y += 4;

const colTag = marginL;
const colLokasi = marginL + 15;
const colKecacatan = marginL + 52;
const colStatus = marginL + 110;
const tableRight = pageW - marginR;

// Table header — border sahaja, tiada warna
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0.5);
doc.line(marginL, y - 5, tableRight, y - 5); // top border
doc.setFont("helvetica", "bold");
doc.setFontSize(FONT.TABLE_HEAD);
doc.setTextColor(0, 0, 0);
doc.text("No.", colTag + 1, y);
doc.text("Lokasi", colLokasi + 1, y);
doc.text("Kecacatan (Defect)", colKecacatan + 1, y);
doc.text("Status", colStatus + 1, y);
y += 2;
doc.setLineWidth(0.5);
doc.line(marginL, y, tableRight, y); // header bottom border
y += 5;

// Table rows — tiada warna, tiada background
doc.setFont("helvetica", "normal");
doc.setFontSize(FONT.TABLE_BODY);
doc.setTextColor(0, 0, 0);

for (let i = 0; i < data.kecacatan.length; i++) {
  const item = data.kecacatan[i];
  checkPageBreak(14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT.TABLE_BODY);
  doc.setTextColor(0, 0, 0);

  doc.text(item.tag, colTag + 1, y);

  const lokasiLines = doc.splitTextToSize(item.lokasi, 34);
  for (let j = 0; j < lokasiLines.length; j++) {
    doc.text(lokasiLines[j], colLokasi + 1, y + j * LH.TABLE);
  }

  const kecacatanLines = doc.splitTextToSize(item.kecacatan, 54);
  for (let j = 0; j < kecacatanLines.length; j++) {
    doc.text(kecacatanLines[j], colKecacatan + 1, y + j * LH.TABLE);
  }

  const statusLines = doc.splitTextToSize(item.status, 42);
  for (let j = 0; j < statusLines.length; j++) {
    doc.text(statusLines[j], colStatus + 1, y + j * LH.TABLE);
  }

  const maxLines = Math.max(lokasiLines.length, kecacatanLines.length, statusLines.length);
  const rowH = maxLines * LH.TABLE + 3;
  y += rowH;

  // Row separator line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.15);
  doc.line(marginL, y - 2, tableRight, y - 2);
}

// Table bottom border
doc.setLineWidth(0.5);
doc.line(marginL, y - 2, tableRight, y - 2);
y += 2;

// Footnote
doc.setFont("helvetica", "italic");
doc.setFontSize(FONT.FOOTNOTE);
doc.setTextColor(0, 0, 0);
doc.text(`*Senarai lengkap kecacatan adalah sebagaimana dinyatakan di dalam Laporan Pemeriksaan Kecacatan (Ruj: ${data.noRujukanLaporan})`, marginL, y);
y += 8;

// ============================================================
// PERENGGAN 3
// ============================================================
resetColor();
writeNumberedParagraph(
  3,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}.`
);
y += 2;
writeText(
  `Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan selaras dengan Klausa 27(1) Perjanjian Jual Beli (${data.jenisSPA}).`,
  { indent: 10 }
);

y += 4;

// ============================================================
// PERENGGAN 4
// ============================================================
writeNumberedParagraph(
  4,
  "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:"
);
y += 2;
writeBullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
writeBullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
writeBullet(
  `Menghantar surat rasmi kepada peguam pemaju (stakeholder) untuk memohon agar kos pembaikan ditolak/ditahan daripada Wang Tahanan 5% (Retention Sum 5%) yang sedang dipegang, sebagaimana diperuntukkan di bawah Klausa 27(3) Perjanjian Jual Beli (${data.jenisSPA}).`
);

y += 4;

// ============================================================
// PERENGGAN 5
// ============================================================
writeNumberedParagraph(
  5,
  `Merujuk kepada Klausa Penyampaian Dokumen 29(1) (Service of Documents) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan, pos berdaftar atau e-mel adalah dianggap sah dan diterima pakai sebagai dokumen rasmi. Notis ini dihantar melalui ${data.kaedahPenghantaranNotis}. Selain itu, saya juga telah menghantar Laporan Kecacatan bagi pemeriksaan kali kedua pada ${data.tarikhHantarLaporanKedua} kepada pihak pemaju.`
);

y += 4;

// ============================================================
// PERENGGAN 6
// ============================================================
writeNumberedParagraph(
  6,
  "Oleh yang demikian, pihak tuan hendaklah menerima sepenuhnya notis ini secara rasmi serta mengambil tindakan sewajarnya untuk menyelesaikan isu kecacatan yang berlaku di unit kediaman saya."
);

y += 6;

// ============================================================
// PERINGATAN UNDANG-UNDANG — bold underline, tiada warna
// ============================================================
checkPageBreak(45);
doc.setFont("helvetica", "bold");
doc.setFontSize(FONT.BODY);
doc.setTextColor(0, 0, 0);
const legalTitle = "Peringatan Tindakan Undang-undang (Legal Action Notice)";
doc.text(legalTitle, marginL, y);
const legalTitleW = doc.getTextWidth(legalTitle);
doc.setLineWidth(0.4);
doc.line(marginL, y + 1, marginL + legalTitleW, y + 1);
y += 8;

// Perenggan 7
writeNumberedParagraph(
  7,
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);

y += 8;

// Penutup
writeText("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini.");
y += 4;
writeText("Sekian, terima kasih.");

y += 12;
writeText("Yang benar,");
y += 18;

// Tandatangan
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0.4);
doc.line(marginL, y, marginL + 65, y);
y += 5;
writeText(data.namaPembeli, { style: "bold", size: FONT.BODY });
writeText(`(No. K/P: ${data.noKP})`, { size: FONT.SMALL });

y += 8;

// ============================================================
// SALINAN KEPADA (CC)
// ============================================================
drawLine(0.3);
y += 1;
writeText("s.k. (Salinan Kepada / Carbon Copy):", { style: "bold", size: FONT.SMALL, lineHeight: LH.SMALL });
for (const cc of data.salinanKepada) {
  writeText(`• ${cc}`, { size: FONT.SMALL, lineHeight: LH.SMALL });
}

// ============================================================
// MUKA SURAT BARU — AKUAN TERIMA OLEH PEMAJU
// ============================================================
doc.addPage();
pageNum++;
y = 30;

// Tajuk centered, underlined
doc.setFont("helvetica", "bold");
doc.setFontSize(FONT.TITLE);
doc.setTextColor(0, 0, 0);
const akuanTitle = "AKUAN TERIMA OLEH PEMAJU";
doc.text(akuanTitle, pageW / 2, y, { align: "center" });
const akuanW = doc.getTextWidth(akuanTitle);
doc.setLineWidth(0.5);
doc.line(pageW / 2 - akuanW / 2, y + 1, pageW / 2 + akuanW / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal");
doc.setFontSize(FONT.SMALL);
doc.text("(Developer's Acknowledgement of Receipt)", pageW / 2, y, { align: "center" });
y += 10;

writeText(
  `Dengan ini diakui bahawa ${data.namaPemaju} telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`
);

y += 18;
writeText("Diterima oleh:", { style: "bold" });
y += 12;

// Borang
const fieldLineStart = marginL + 30;
const fieldLineEnd = marginL + 120;

const fields = ["Nama", "Jawatan", "Tarikh"];
for (const field of fields) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT.FIELD_LABEL);
  doc.setTextColor(0, 0, 0);
  doc.text(field, marginL, y);
  doc.text(":", marginL + 25, y);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(fieldLineStart, y + 1, fieldLineEnd, y + 1);
  y += 14;
}

y += 8;
writeText("Cop Syarikat (Company Stamp):", { style: "bold", size: FONT.SMALL });
y += 4;
doc.setDrawColor(0, 0, 0);
doc.setLineWidth(0.3);
doc.rect(marginL, y, 60, 35);

// ============================================================
// MUKA SURAT BARU — LAMPIRAN A
// ============================================================
doc.addPage();
pageNum++;
y = 25;

// Tajuk centered, underlined
doc.setFont("helvetica", "bold");
doc.setFontSize(FONT.TITLE);
doc.setTextColor(0, 0, 0);
const lampTitle = "LAMPIRAN A";
doc.text(lampTitle, pageW / 2, y, { align: "center" });
const lampW = doc.getTextWidth(lampTitle);
doc.setLineWidth(0.5);
doc.line(pageW / 2 - lampW / 2, y + 1, pageW / 2 + lampW / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal");
doc.setFontSize(FONT.SMALL);
doc.text("Gambar Bukti Kecacatan (Defect Evidence Photos)", pageW / 2, y, { align: "center" });
y += 10;

writeText(`Rujukan Laporan: ${data.noRujukanLaporan}`, { size: FONT.SMALL, lineHeight: LH.SMALL });
writeText(`Tarikh Pemeriksaan Kedua: ${data.tarikhPemeriksaanKedua}`, { size: FONT.SMALL, lineHeight: LH.SMALL });
y += 6;

// Photo grid — 2 columns, border sahaja
const photoW = (contentW - 10) / 2;
const photoH = 55;
const gap = 10;

for (let i = 0; i < data.kecacatan.length; i++) {
  const col = i % 2;

  if (col === 0 && i > 0) {
    // already advanced by previous row
  }

  const px = marginL + col * (photoW + gap);
  const py = y;

  checkPageBreak(photoH + 20);
  const pyActual = y;

  // Photo box — border only
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.rect(px, pyActual, photoW, photoH);

  // Placeholder text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(180, 180, 180);
  doc.text("[FOTO]", px + photoW / 2, pyActual + photoH / 2 - 2, { align: "center" });

  doc.setFontSize(FONT.FOOTNOTE);
  doc.setTextColor(150, 150, 150);
  doc.text(`Tag #${data.kecacatan[i].tag}`, px + photoW / 2, pyActual + photoH / 2 + 6, { align: "center" });

  // Caption below
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT.CAPTION);
  doc.setTextColor(0, 0, 0);
  doc.text(`Tag ${data.kecacatan[i].tag} — ${data.kecacatan[i].lokasi}`, px + 2, pyActual + photoH + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT.CAPTION);
  const captionLines = doc.splitTextToSize(data.kecacatan[i].kecacatan, photoW - 4);
  doc.text(captionLines[0], px + 2, pyActual + photoH + 10);

  if (col === 1) {
    y += photoH + 18;
  }
}

if (data.kecacatan.length % 2 === 1) {
  y += photoH + 18;
}

// ============================================================
// FOOTER — tulis pada semua muka surat di akhir
// ============================================================
const totalPages = pageNum;
const allPages = doc.internal.getNumberOfPages();
for (let p = 1; p <= allPages; p++) {
  doc.setPage(p);

  // Footer line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(marginL, pageH - 18, pageW - marginR, pageH - 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT.FOOTER);
  doc.setTextColor(0, 0, 0);
  doc.text(`Ruj: ${data.noRujukan}`, marginL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - marginR, pageH - 13, { align: "right" });
}

// ============================================================
// SAVE
// ============================================================
const pdfOutput = doc.output("arraybuffer");
const outputPath = "/home/user/admin/NOTIS_1_DUMMY_IMPROVED.pdf";
fs.writeFileSync(outputPath, Buffer.from(pdfOutput));
console.log(`PDF generated: ${outputPath}`);
console.log(`Total pages: ${totalPages}`);
