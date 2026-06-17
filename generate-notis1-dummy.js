const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/039",

  // Pengirim — alamat sahaja di header, nama di bawah tandatangan
  alamatPengirim: [
    "No.39, Jalan Seluang,",
    "Tg Puteri Resort,",
    "81700 Pasir Gudang,",
    "Johor Darul Takzim.",
  ],
  namaPembeli: "MUHAMMAD IMRAN BIN MOHAMAD NAZARUDIN",
  emailPembeli: "imranalan20@gmail.com",
  telefonPembeli: "013-6749124",
  noKP: "991005-XX-XXXX",

  // Penerima
  namaPemaju: "SCUDAI DEVELOPMENT SDN. BHD.",
  alamatPenerima: [
    "Jalan Seluang 35,",
    "Tg Puteri Resort,",
    "81700 Pasir Gudang,",
    "Johor.",
  ],
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
const mL = 25;
const mR = 25;
const cW = pageW - mL - mR;
let y = 0;
let pageNum = 1;

const SZ = {
  BODY: 12,
  SMALL: 10,
  TABLE: 10,
  FOOTNOTE: 9,
  FOOTER: 8,
  TITLE: 12,
  CAPTION: 9,
};
const LH = 6;
const LH_SMALL = 5;

// ============================================================
// HELPERS
// ============================================================
function bk() { doc.setTextColor(0, 0, 0); doc.setDrawColor(0, 0, 0); }

function newPage() {
  doc.addPage();
  pageNum++;
  y = 25;
}

function checkBreak(need = 15) {
  if (y + need > pageH - 22) { newPage(); return true; }
  return false;
}

function txt(text, x, opts = {}) {
  const { size = SZ.BODY, style = "normal", align = "left", lh = LH } = opts;
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  bk();
  const maxW = (align === "right") ? undefined : cW - (x - mL);
  if (!maxW) {
    doc.text(text, x, y, { align });
    y += lh;
    return;
  }
  const lines = doc.splitTextToSize(text, maxW);
  for (const line of lines) {
    checkBreak(lh + 1);
    doc.text(line, x, y);
    y += lh;
  }
}

function para(text, opts = {}) {
  const { indent = 0 } = opts;
  txt(text, mL + indent, opts);
}

function numPara(num, text) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(SZ.BODY);
  bk();
  const numStr = `${num}.`;
  const numIndent = 10;
  checkBreak(LH + 1);
  doc.text(numStr, mL, y);
  const lines = doc.splitTextToSize(text, cW - numIndent);
  for (const line of lines) {
    checkBreak(LH + 1);
    doc.text(line, mL + numIndent, y);
    y += LH;
  }
}

function bullet(text) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(SZ.BODY);
  bk();
  const bIndent = 14;
  const tIndent = bIndent + 5;
  checkBreak(LH + 1);
  doc.text("•", mL + bIndent, y);
  const lines = doc.splitTextToSize(text, cW - tIndent);
  for (const line of lines) {
    checkBreak(LH + 1);
    doc.text(line, mL + tIndent, y);
    y += LH;
  }
}

// Draw a proper bordered table
function drawTable(headers, rows, colWidths) {
  const tableX = mL;
  const cellPad = 2;
  const fontSize = SZ.TABLE;
  const rowLH = 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);

  // Calculate row heights first
  function calcRowHeight(cells) {
    let maxH = rowLH + cellPad * 2;
    for (let c = 0; c < cells.length; c++) {
      const w = colWidths[c] - cellPad * 2;
      const lines = doc.splitTextToSize(String(cells[c]), w);
      const h = lines.length * rowLH + cellPad * 2;
      if (h > maxH) maxH = h;
    }
    return maxH;
  }

  function drawRow(cells, rowY, rowH, isHeader) {
    doc.setFont("helvetica", isHeader ? "bold" : "normal");
    doc.setFontSize(fontSize);
    bk();

    let cx = tableX;
    for (let c = 0; c < cells.length; c++) {
      // Cell border
      doc.setLineWidth(0.3);
      doc.rect(cx, rowY, colWidths[c], rowH);

      // Cell text
      const w = colWidths[c] - cellPad * 2;
      const lines = doc.splitTextToSize(String(cells[c]), w);
      const textY = rowY + cellPad + rowLH - 1;
      for (let l = 0; l < lines.length; l++) {
        doc.text(lines[l], cx + cellPad, textY + l * rowLH);
      }
      cx += colWidths[c];
    }
  }

  // Header row
  const headerH = calcRowHeight(headers);
  checkBreak(headerH + 5);
  drawRow(headers, y, headerH, true);
  y += headerH;

  // Data rows
  for (const row of rows) {
    const rh = calcRowHeight(row);
    checkBreak(rh + 2);
    drawRow(row, y, rh, false);
    y += rh;
  }
}

// ============================================================
// MUKA SURAT 1 — SURAT UTAMA
// ============================================================
y = 25;

// ── ALAMAT PENGIRIM (kiri atas, tanpa nama) ──
doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.BODY);
bk();
for (const line of data.alamatPengirim) {
  doc.text(line, mL, y);
  y += LH_SMALL;
}

y += 2;

// ── GARIS PANJANG MELINTANG ──
doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

// ── ALAMAT PENERIMA (kiri) ──
doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.BODY);
bk();
doc.text(data.namaPemaju, mL, y);
y += LH_SMALL;
for (const line of data.alamatPenerima) {
  doc.text(line, mL, y);
  y += LH_SMALL;
}

// Underline baris terakhir alamat penerima
const lastLine = data.alamatPenerima[data.alamatPenerima.length - 1];
const lastLineW = doc.getTextWidth(lastLine);
doc.setLineWidth(0.3);
doc.line(mL, y - LH_SMALL + 1.5, mL + lastLineW, y - LH_SMALL + 1.5);

// ── TARIKH (kanan, sebaris baris akhir alamat penerima) ──
doc.text(data.tarikhNotis, pageW - mR, y - LH_SMALL, { align: "right" });

y += 3;

// ── RUJUKAN ──
doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukan}`, mL, y);
y += 8;

// ── PANGGILAN HORMAT ──
doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

// ── PERKARA (underlined, huruf besar setiap awal kata) ──
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();

const perkara1 = "Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim)";
const perkara2 = `Hartanah di ${data.alamatHartanah}`;

const p1Lines = doc.splitTextToSize(perkara1, cW);
for (const line of p1Lines) {
  doc.text(line, mL, y);
  const lw = doc.getTextWidth(line);
  doc.setLineWidth(0.3);
  doc.line(mL, y + 1, mL + lw, y + 1);
  y += LH;
}
const p2Lines = doc.splitTextToSize(perkara2, cW);
for (const line of p2Lines) {
  doc.text(line, mL, y);
  const lw = doc.getTextWidth(line);
  doc.setLineWidth(0.3);
  doc.line(mL, y + 1, mL + lw, y + 1);
  y += LH;
}

y += 6;

// ── PERENGGAN 1 — tiada nombor, dari tepi ──
doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.BODY);
bk();
para(
  `Merujuk kepada Perjanjian Jual Beli (Sales and Purchase Agreement) bertarikh ${data.tarikhSPA} dengan nombor rujukan ${data.noRujukanSPA} (${data.jenisSPA}), Laporan Pemeriksaan Kecacatan (Defect Inspection Report) bernombor rujukan ${data.noRujukanLaporan} telah dikemukakan secara rasmi kepada pihak tuan melalui penghantaran secara ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan selaras dengan tanggungjawab pemaju di bawah Klausa 27(1) Perjanjian Jual Beli (${data.jenisSPA}). Unit ini masih berada dalam Tempoh Liabiliti Kecacatan (Defect Liability Period — DLP) selama ${data.tempohDLP} bulan dari tarikh Penyerahan Milik Kosong (Vacant Possession) pada ${data.tarikhVP}.`
);
y += 4;

// ── PERENGGAN 2 — ada nombor ──
numPara(
  2,
  `Susulan laporan yang telah dikemukakan sebelum ini, hasil daripada pemerhatian kali kedua (Second Inspection) pada ${data.tarikhPemeriksaanKedua} mendapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum disempurnakan sepenuhnya atau tidak dilakukan langsung seperti berikut:`
);
y += 5;

// ── JADUAL KECACATAN — bordered table ──
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
y += 6;

const colW = [15, 35, 55, cW - 15 - 35 - 55];
const tableHeaders = ["No.", "Lokasi", "Kecacatan (Defect)", "Status"];
const tableRows = data.kecacatan.map(item => [
  item.tag,
  item.lokasi,
  item.kecacatan,
  item.status,
]);

drawTable(tableHeaders, tableRows, colW);
y += 2;

// Footnote
doc.setFont("helvetica", "italic");
doc.setFontSize(SZ.FOOTNOTE);
bk();
const fnote = `*Senarai lengkap kecacatan adalah sebagaimana dinyatakan di dalam Laporan Pemeriksaan Kecacatan (Ruj: ${data.noRujukanLaporan})`;
const fnLines = doc.splitTextToSize(fnote, cW);
for (const fl of fnLines) {
  doc.text(fl, mL, y);
  y += 4;
}
y += 5;

// ── PERENGGAN 3 ──
numPara(
  3,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan selaras dengan Klausa 27(1) Perjanjian Jual Beli (${data.jenisSPA}).`
);
y += 4;

// ── PERENGGAN 4 ──
numPara(
  4,
  "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:"
);
y += 2;
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
bullet(
  `Menghantar surat rasmi kepada peguam pemaju (stakeholder) untuk memohon agar kos pembaikan ditolak/ditahan daripada Wang Tahanan 5% (Retention Sum 5%) yang sedang dipegang, sebagaimana diperuntukkan di bawah Klausa 27(3) Perjanjian Jual Beli (${data.jenisSPA}).`
);
y += 4;

// ── PERENGGAN 5 ──
numPara(
  5,
  `Merujuk kepada Klausa Penyampaian Dokumen 29(1) (Service of Documents) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan, pos berdaftar atau e-mel adalah dianggap sah dan diterima pakai sebagai dokumen rasmi. Notis ini dihantar melalui ${data.kaedahPenghantaranNotis}. Selain itu, saya juga telah menghantar Laporan Kecacatan bagi pemeriksaan kali kedua pada ${data.tarikhHantarLaporanKedua} kepada pihak pemaju.`
);
y += 4;

// ── PERENGGAN 6 — Peringatan Undang-undang ──
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
checkBreak(30);
const legalH = "Peringatan Tindakan Undang-undang (Legal Action Notice)";
doc.text(legalH, mL, y);
const lhW = doc.getTextWidth(legalH);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + lhW, y + 1);
y += 8;

numPara(
  6,
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);
y += 4;

// ── PERENGGAN AKHIR — tiada nombor, dari tepi ──
para("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;

para("Sekian.");
y += 10;

// ── PENGAKUAN & TANDATANGAN ──
doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.BODY);
bk();
doc.text("Yang benar,", mL, y);
y += 20;

// Garis tandatangan
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 1;

// Nama HURUF BESAR dalam kurungan
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
doc.text(`(${data.namaPembeli})`, mL, y + 4);
y += 10;

// Maklumat pengirim di bawah nama
doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y);
y += LH_SMALL;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y);
y += LH_SMALL;
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y);
y += 8;

// ── SALINAN KEPADA ──
doc.setLineWidth(0.2);
doc.line(mL, y, pageW - mR, y);
y += 4;
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.SMALL);
doc.text("s.k.:", mL, y);
y += LH_SMALL;
doc.setFont("helvetica", "normal");
for (const cc of data.salinanKepada) {
  doc.text(`•  ${cc}`, mL + 5, y);
  y += LH_SMALL;
}

// ============================================================
// MUKA SURAT — AKUAN TERIMA OLEH PEMAJU
// ============================================================
newPage();
y = 30;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const akT = "AKUAN TERIMA OLEH PEMAJU";
doc.text(akT, pageW / 2, y, { align: "center" });
const akW = doc.getTextWidth(akT);
doc.setLineWidth(0.4);
doc.line(pageW / 2 - akW / 2, y + 1, pageW / 2 + akW / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.SMALL);
doc.text("(Developer's Acknowledgement of Receipt)", pageW / 2, y, { align: "center" });
y += 12;

doc.setFontSize(SZ.BODY);
bk();
const akuanText = `Dengan ini diakui bahawa ${data.namaPemaju} telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
const akLines = doc.splitTextToSize(akuanText, cW);
for (const al of akLines) {
  doc.text(al, mL, y);
  y += LH;
}

y += 18;
doc.setFont("helvetica", "bold");
doc.text("Diterima oleh:", mL, y);
y += 14;

const fStart = mL + 30;
const fEnd = mL + 120;
const fields = ["Nama", "Jawatan", "Tarikh"];
for (const f of fields) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(SZ.BODY);
  bk();
  doc.text(f, mL, y);
  doc.text(":", mL + 25, y);
  doc.setLineWidth(0.3);
  doc.line(fStart, y + 1, fEnd, y + 1);
  y += 14;
}

y += 8;
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.SMALL);
doc.text("Cop Syarikat (Company Stamp):", mL, y);
y += 5;
doc.setLineWidth(0.3);
doc.rect(mL, y, 60, 35);

// ============================================================
// MUKA SURAT — LAMPIRAN A
// ============================================================
newPage();
y = 25;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const lamT = "LAMPIRAN A";
doc.text(lamT, pageW / 2, y, { align: "center" });
const lamW = doc.getTextWidth(lamT);
doc.setLineWidth(0.4);
doc.line(pageW / 2 - lamW / 2, y + 1, pageW / 2 + lamW / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.SMALL);
doc.text("Gambar Bukti Kecacatan (Defect Evidence Photos)", pageW / 2, y, { align: "center" });
y += 10;

doc.setFontSize(SZ.SMALL);
bk();
doc.text(`Rujukan Laporan: ${data.noRujukanLaporan}`, mL, y);
y += LH_SMALL;
doc.text(`Tarikh Pemeriksaan Kedua: ${data.tarikhPemeriksaanKedua}`, mL, y);
y += 8;

const photoW = (cW - 10) / 2;
const photoH = 55;
const photoGap = 10;

for (let i = 0; i < data.kecacatan.length; i++) {
  const col = i % 2;

  if (col === 0) {
    checkBreak(photoH + 20);
  }

  const px = mL + col * (photoW + photoGap);
  const py = y;

  doc.setLineWidth(0.3);
  bk();
  doc.rect(px, py, photoW, photoH);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(180, 180, 180);
  doc.text("[FOTO]", px + photoW / 2, py + photoH / 2 - 2, { align: "center" });

  doc.setFontSize(SZ.FOOTNOTE);
  doc.setTextColor(150, 150, 150);
  doc.text(`Tag #${data.kecacatan[i].tag}`, px + photoW / 2, py + photoH / 2 + 6, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(SZ.CAPTION);
  doc.setTextColor(0, 0, 0);
  doc.text(`Tag ${data.kecacatan[i].tag} — ${data.kecacatan[i].lokasi}`, px + 2, py + photoH + 5);
  doc.setFont("helvetica", "normal");
  const capLines = doc.splitTextToSize(data.kecacatan[i].kecacatan, photoW - 4);
  doc.text(capLines[0], px + 2, py + photoH + 10);

  if (col === 1) {
    y += photoH + 18;
  }
}
if (data.kecacatan.length % 2 === 1) {
  y += photoH + 18;
}

// ============================================================
// FOOTER — semua muka surat
// ============================================================
const totalPages = pageNum;
for (let p = 1; p <= doc.internal.getNumberOfPages(); p++) {
  doc.setPage(p);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(mL, pageH - 18, pageW - mR, pageH - 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(SZ.FOOTER);
  doc.setTextColor(0, 0, 0);
  doc.text(`Ruj: ${data.noRujukan}`, mL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

// ============================================================
// SAVE
// ============================================================
const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/NOTIS_1_DUMMY_IMPROVED.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_DUMMY_IMPROVED.pdf");
console.log(`Total pages: ${totalPages}`);
