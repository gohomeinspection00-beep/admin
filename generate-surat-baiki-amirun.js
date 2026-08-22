const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "PERMOHONAN-BAIKI/2026/AMIRUN",

  namaPemilik: "AMIRUNURASHID BIN ISMAIL ZUKRI",
  alamatPengirim: [
    "No. 610, Jalan Keembong,",
    "Felda Padang Piol,",
    "27040 Jerantut,",
    "Pahang.",
  ],
  noKP: "950424-06-5385",
  telefonPemilik: "010-509 5003",
  emailPemilik: "amirunurashid@gmail.com",

  namaPemaju: "PAGOH JAYA (2000) SDN BHD",
  noSyarikat: "(199301001219 / 255956-P)",
  alamatPenerima: [
    "Lot 6.08, 6th Floor,",
    "Plaza First Nationwide,",
    "161, Jalan Tun H.S. Lee,",
    "50000 Kuala Lumpur.",
  ],

  alamatHartanah: "No. 84, Jalan Jaya 3/6, Taman Pagoh Jaya, 84600 Pagoh, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (22' x 70')",
  butiranLot: "PTD 16984, Plot 44, H.S.(D) 39597",

  tarikhSPA: "14 Mei 2026",
  tarikhSuratVP: "6 Ogos 2026",
  rujSuratVP: "PJSB2K/PJ7412/29DST/44/16984",

  tarikhInspeksi: "20 Ogos 2026",
  tempohBaiki: "30",

  tarikhSurat: "22 Ogos 2026",
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

// ============================================================
// SURAT
// ============================================================
y = 25;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text(data.namaPemilik, mL, y);
y += LH;

doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += LH_S;
doc.text(`E-mel: ${data.emailPemilik}`, mL, y); y += LH_S;
doc.text(`Tel: ${data.telefonPemilik}`, mL, y); y += LH_S;

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
doc.text(`Ruj. Kami: ${data.noRujukan}`, mL, y); y += 4.5;
doc.text(`Ruj. Tuan: ${data.rujSuratVP}`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkara1 = "Permohonan Pembaikan Kecacatan & Persetujuan Pemaju";
const perkara2 = "(Defect Rectification Request & Developer's Acknowledgement)";
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
  `Saya, ${data.namaPemilik} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (${data.butiranLot}), sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} di antara saya dengan pihak tuan, merujuk kepada perkara di atas.`
);
y += 4;

numPara(2,
  `Saya merujuk kepada surat pihak tuan bertarikh ${data.tarikhSuratVP} (Ruj: ${data.rujSuratVP}) berhubung penyerahan milikan kosong (Handing-Over with Vacant Possession), di mana pihak tuan sendiri telah menyatakan bahawa: "The period of the defect liability for the property as stated in the Sales & Purchase Agreement is commenced from the date of this notice." Berdasarkan pernyataan tersebut, tempoh liabiliti kecacatan bagi hartanah ini telah bermula pada ${data.tarikhSuratVP}.`
);
y += 4;

numPara(3,
  `Untuk makluman pihak tuan, satu Pemeriksaan Kecacatan (Defect Inspection) telah dijalankan ke atas hartanah tersebut pada ${data.tarikhInspeksi} oleh pemeriksa profesional. Laporan Pemeriksaan Kecacatan (Defect Inspection Report) yang mengandungi senarai penuh kecacatan beserta gambar disertakan bersama-sama surat ini sebagai lampiran.`
);
y += 4;

numPara(4,
  `Sehubungan itu, saya dengan hormatnya memohon agar pihak tuan, selaras dengan tempoh liabiliti kecacatan yang dinyatakan dalam surat pihak tuan tersebut serta jaminan pembaikan (warranty) yang diberikan oleh pihak tuan, melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan dalam tempoh tiga puluh (${data.tempohBaiki}) hari dari tarikh persetujuan pihak tuan di bawah, atas kos dan belanja pihak tuan sendiri.`
);
y += 4;

numPara(5,
  `Bagi tujuan rekod dan tindakan bersama, saya memohon agar wakil pihak tuan yang diberi kuasa menandatangani bahagian "Akuan Persetujuan Pembaikan oleh Pemaju" yang disertakan bersama surat ini, dan mengembalikan satu (1) salinan yang telah ditandatangani kepada saya di alamat atau e-mel di atas.`
);
y += 4;

numPara(6,
  "Kerjasama dan perhatian pihak tuan dalam perkara ini amatlah saya hargai. Sebarang pertanyaan atau penetapan temujanji pembaikan boleh menghubungi saya di talian di atas."
);
y += 4;

para("Sekian, terima kasih.");
y += 4;

checkBreak(55);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 12;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPemilik})`, mL, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += 4;
doc.text(`E-mel: ${data.emailPemilik}`, mL, y); y += LH_S;
doc.text(`Telefon: ${data.telefonPemilik}`, mL, y); y += 7;

// Lampiran
checkBreak(12);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("Lampiran:", mL, y); y += 5;
doc.setFont("helvetica", "normal");
doc.text(`1. Laporan Pemeriksaan Kecacatan (Defect Inspection Report) — ${data.tarikhInspeksi}`, mL + 5, y); y += 4.5;
doc.text(`2. Salinan surat pihak tuan bertarikh ${data.tarikhSuratVP} (Ruj: ${data.rujSuratVP})`, mL + 5, y); y += 4.5;

// ============================================================
// AKUAN PERSETUJUAN x 2
// ============================================================
function drawAkuan(copyLabel) {
  newPage();
  y = 25;

  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.SMALL); bk();
  doc.text(copyLabel, pageW - mR, y, { align: "right" });
  y += 8;

  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
  const t = "AKUAN PERSETUJUAN PEMBAIKAN OLEH PEMAJU";
  doc.text(t, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(t) / 2, y + 1, pageW / 2 + doc.getTextWidth(t) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text("(Developer's Acknowledgement & Agreement to Rectify)", pageW / 2, y, { align: "center" });
  y += 12;

  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima surat Permohonan Pembaikan Kecacatan bertarikh ${data.tarikhSurat} (Ruj: ${data.noRujukan}) beserta Laporan Pemeriksaan Kecacatan bertarikh ${data.tarikhInspeksi} daripada ${data.namaPemilik} berhubung hartanah di ${data.alamatHartanah}, dan dengan ini BERSETUJU untuk melaksanakan pembaikan terhadap kecacatan yang dilaporkan atas kos dan belanja pemaju sendiri dalam tempoh tiga puluh (30) hari dari tarikh akuan ini, atau selewat-lewatnya pada tarikh sasaran siap yang dinyatakan di bawah.`;
  const ls = doc.splitTextToSize(akText, cW);
  for (const l of ls) { doc.text(l, mL, y); y += LH; }

  y += 14;
  doc.setFont("helvetica", "bold");
  doc.text("Dipersetujui oleh (bagi pihak pemaju):", mL, y);
  y += 14;

  const fs2 = mL + 52; const fe = mL + 130;
  for (const f of ["Tandatangan", "Nama", "Jawatan", "Tarikh", "Tarikh Sasaran Siap"]) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
    doc.text(f, mL, y); doc.text(":", mL + 47, y);
    doc.setLineWidth(0.3); doc.line(fs2, y + 1, fe, y + 1);
    y += 13;
  }

  y += 5;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL);
  doc.text("Cop Syarikat (Company Stamp):", mL, y);
  y += 5;
  doc.setLineWidth(0.3); doc.rect(mL, y, 60, 35);
}

drawAkuan("Salinan Pemaju (Developer's Copy)");
drawAkuan("Salinan Pemilik (Owner's Copy)");

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
fs.writeFileSync("/home/user/admin/SURAT_BAIKI_AMIRUN.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_BAIKI_AMIRUN.pdf");
console.log(`Total pages: ${totalPages}`);
