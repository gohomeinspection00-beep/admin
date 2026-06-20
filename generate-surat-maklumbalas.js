const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "SMB/SHAH/2026/001",

  namaPembeli: "MOHAMAD SHAHRULNIZAM BIN AHMAD",
  alamatPengirim: [
    "No. 38, Jalan Permata 3,",
    "Laman Permata,",
    "81100 Johor Bahru,",
    "Johor Darul Takzim.",
  ],
  emailPembeli: "shahrulnizam690@gmail.com",
  telefonPembeli: "019-7789227",
  noKP: "900613-01-5365",

  namaPemaju: "FAIRE DEVELOPMENT SDN. BHD.",
  noSyarikat: "202001010876 (1367196-P)",
  alamatPenerima: [
    "30, Jalan Perjiranan 4/2,",
    "Bandar Dato Onn,",
    "81100 Johor Bahru,",
    "Johor.",
  ],
  emailPemaju: "customercare@faire-dev.com",

  alamatHartanah: "No. 38, Jalan Permata 3, Laman Permata, 81100 Johor Bahru, Johor Darul Takzim",

  noRujukanSPA: "SOO/MNS/BAE30044/2506/NANA",
  tarikhSPA: "30 Ogos 2025",
  jenisSPA: "Jadual G",

  tarikhHantarReport: "22 Mac 2026",
  kaedahSerahanReport: "aplikasi pemaju (Marvis)",

  tarikhSurat: "19 Jun 2026",
  tempohMaklumBalas: "14",
  tarikhKenyataanPemaju: "12 Jun 2026",

  defectTag: "100",
  defectLokasi: "Tangga (Staircase)",
  defectDescription: "Ketidakselarasan tangga (staircase misalignment) sebanyak 15mm",

  salinanKepada: [
    "Tetuan Wang & S.B. Wong — molek@wangsbwong.com.my",
  ],
};

// ============================================================
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

function bullet(text, indent = 14) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(SZ.BODY);
  bk();
  const ti = indent + 5;
  checkBreak(LH + 1);
  doc.text("•", mL + indent, y);
  const lines = doc.splitTextToSize(text, cW - ti);
  for (const line of lines) { checkBreak(LH + 1); doc.text(line, mL + ti, y); y += LH; }
}

// ============================================================
// PAGE 1 — SURAT MAKLUM BALAS RASMI
// ============================================================
y = 25;

// (1) NAMA PENGIRIM — BOLD
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text(data.namaPembeli, mL, y);
y += LH;

// Alamat pengirim
doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Tel: ${data.telefonPembeli}`, mL, y); y += LH_S;

y += 3;

// Garis melintang
doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

// (2) Kepada
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text("Kepada:", mL, y);
y += LH;

// NAMA PENERIMA — BOLD
doc.text(data.namaPemaju, mL, y);
y += LH_S;

// No. Syarikat
doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.SMALL);
doc.text(`[${data.noSyarikat}]`, mL, y);
y += LH_S;

// Alamat penerima
doc.setFontSize(SZ.BODY);
for (const line of data.alamatPenerima) { doc.text(line, mL, y); y += LH_S; }

// Tarikh kanan
doc.text(data.tarikhSurat, pageW - mR, y - LH_S, { align: "right" });

y += 3;

// Rujukan
doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukan}`, mL, y);
y += 8;

// Panggilan hormat
doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

// PERKARA — bold + underlined
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkaraLines = [
  "Surat Maklum Balas Rasmi — Permohonan Penjelasan Berkenaan",
  "Kenyataan Kelonggaran Binaan Bagi Kecacatan Tangga (Staircase Misalignment)",
  `Hartanah di ${data.alamatHartanah}`,
];
for (const pk of perkaraLines) {
  const ls = doc.splitTextToSize(pk, cW);
  for (const l of ls) {
    doc.text(l, mL, y);
    doc.setLineWidth(0.3);
    doc.line(mL, y + 1, mL + doc.getTextWidth(l), y + 1);
    y += LH;
  }
}
y += 6;

// ── PERENGGAN 1 — tiada nombor ──
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
para(
  `Merujuk kepada Perjanjian Jual Beli (Sales and Purchase Agreement) bertarikh ${data.tarikhSPA} dengan nombor rujukan ${data.noRujukanSPA} (${data.jenisSPA}), saya telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanReport} pada ${data.tarikhHantarReport}.`
);
y += 4;

// ── PERENGGAN 2 ──
numPara(2,
  `Dalam laporan tersebut, antara kecacatan yang dilaporkan termasuk ketidakselarasan tangga (staircase misalignment) sebanyak 15mm yang ditandakan sebagai Tag ${data.defectTag}. Saya merujuk kepada kenyataan maklum balas pihak tuan bertarikh ${data.tarikhKenyataanPemaju} melalui aplikasi WhatsApp (sebagaimana dilampirkan di Lampiran A) yang menyatakan bahawa:`
);
y += 3;

// Petikan kenyataan pemaju — italic, indent
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.BODY); bk();
const petikan = `"Tuan, untuk makluman tuan misalignment 15mm yang dimaksudkan masih lagi dalam kelonggaran binaan bangunan yang ditetapkan. Pihak kami sudah beberapa kali periksa untuk pastikan keadaan dan tangga yang dimaklumkan."`;
const petikanLines = doc.splitTextToSize(petikan, cW - 20);
for (const line of petikanLines) {
  checkBreak(LH + 1);
  doc.text(line, mL + 10, y);
  y += LH;
}
y += 4;

// ── PERENGGAN 3 — Permohonan penjelasan ──
numPara(3,
  `Berhubung kenyataan di atas, saya dengan ini memohon pihak tuan untuk memberikan penjelasan secara bertulis bagi perkara-perkara berikut:`
);
y += 2;

bullet("Apakah standard, kod atau rujukan teknikal khusus yang digunakan oleh pihak tuan sebagai asas kepada kenyataan bahawa ketidakselarasan (misalignment) sebanyak 15mm adalah \"masih dalam kelonggaran binaan bangunan yang ditetapkan\"?");
y += 1;
bullet("Sila nyatakan nama penuh standard/kod tersebut, klausa berkaitan, serta had kelonggaran (tolerance) yang dibenarkan mengikut standard berkenaan.");
y += 1;
bullet("Adakah penilaian tersebut dilakukan oleh jurutera bertauliah (Professional Engineer) atau pihak ketiga yang bebas? Jika ya, sila sertakan laporan penilaian berkenaan.");
y += 4;

// ── PERENGGAN 4 — Rujukan UBBL ──
numPara(4,
  `Untuk makluman pihak tuan, Undang-Undang Kecil Bangunan Seragam 1984 (UBBL 1984), By-Law 106(1) bertajuk "Dimensions of staircases" memperuntukkan bahawa:`
);
y += 3;

// Petikan UBBL — italic, indent
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.BODY); bk();
const ubblQuote = `"...the dimensions of the rise and the tread of the staircase so chosen shall be uniform and consistent throughout."`;
const ubblLines = doc.splitTextToSize(ubblQuote, cW - 20);
for (const line of ubblLines) {
  checkBreak(LH + 1);
  doc.text(line, mL + 10, y);
  y += LH;
}
y += 4;

// ── PERENGGAN 5 — Hujah ──
numPara(5,
  `Berdasarkan peruntukan di atas, undang-undang dengan jelas menetapkan bahawa dimensi tangga mestilah seragam dan konsisten sepenuhnya (uniform and consistent throughout). Ketidakselarasan (misalignment) sebanyak 15mm yang dikesan pada tangga unit saya menunjukkan bahawa dimensi tangga tersebut tidak konsisten, dan ini bercanggah dengan kehendak By-Law 106(1) UBBL 1984. Oleh itu, kenyataan pihak tuan bahawa kecacatan ini "masih dalam kelonggaran binaan" memerlukan penjelasan dan bukti sokongan yang jelas.`
);
y += 4;

// ── PERENGGAN 6 — Kewajipan pemaju ──
numPara(6,
  `Selain itu, saya juga ingin mengingatkan bahawa di bawah Klausa 27(1) Perjanjian Jual Beli (${data.jenisSPA}), pihak tuan sebagai pemaju adalah bertanggungjawab untuk membaiki segala kecacatan, pengecutan dan kerosakan lain yang dilaporkan dalam Tempoh Liabiliti Kecacatan (Defect Liability Period). Tanggungjawab ini termasuk memastikan binaan mematuhi semua standard dan undang-undang yang berkuat kuasa.`
);
y += 4;

// ── PERENGGAN 7 — Tempoh maklum balas ──
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const tmb = "Permohonan Maklum Balas Bertulis";
checkBreak(10);
doc.text(tmb, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(tmb), y + 1);
y += 8;

numPara(7,
  `Dengan ini, saya memohon agar pihak tuan memberikan maklum balas secara bertulis dalam tempoh empat belas (14) hari dari tarikh surat ini diterima, iaitu sebelum atau pada 3 Julai 2026. Maklum balas tersebut hendaklah merangkumi:`
);
y += 2;

bullet("Rujukan penuh standard/kod teknikal yang menyokong kenyataan pihak tuan;");
bullet("Dokumen sokongan (jika ada) daripada jurutera bertauliah atau pihak ketiga bebas; dan");
bullet("Pendirian rasmi pihak tuan sama ada kecacatan ini akan dibaiki atau sebaliknya.");
y += 4;

// ── PERENGGAN 8 — Amaran ──
numPara(8,
  `Sekiranya tiada maklum balas diterima dalam tempoh yang ditetapkan, atau sekiranya penjelasan yang diberikan tidak disokong oleh rujukan standard/kod yang sah, saya akan menganggap bahawa kenyataan pihak tuan berkenaan "kelonggaran binaan" adalah tanpa asas dan akan meneruskan tindakan selanjutnya termasuk pengeluaran Notis Rasmi Tuntutan Pembetulan Kecacatan (Defect Rectification Claim Notice) serta apa-apa remedi lain yang diperuntukkan di bawah undang-undang.`
);
y += 4;

// ── PENUTUP ──
para("Saya berharap pihak tuan memberikan perhatian serius terhadap surat ini dan memberikan maklum balas dalam tempoh yang ditetapkan. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 10;

// ── TANDATANGAN ──
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

// ── SALINAN KEPADA ──
doc.setLineWidth(0.2); doc.line(mL, y, pageW - mR, y); y += 4;
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL);
doc.text("s.k.:", mL, y); y += LH_S;
doc.setFont("helvetica", "normal");
for (const cc of data.salinanKepada) { doc.text(`•  ${cc}`, mL + 5, y); y += LH_S; }

// ============================================================
// LAMPIRAN A — Screenshot WhatsApp
// ============================================================
newPage();
y = 25;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const lamT = "LAMPIRAN A";
doc.text(lamT, pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth(lamT) / 2, y + 1, pageW / 2 + doc.getTextWidth(lamT) / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("Bukti Kenyataan Pemaju Melalui WhatsApp", pageW / 2, y, { align: "center" });
y += 6;
doc.text("(Evidence of Developer's Statement via WhatsApp)", pageW / 2, y, { align: "center" });
y += 10;

doc.setFontSize(SZ.SMALL); bk();
doc.text(`Tarikh Perbualan: ${data.tarikhKenyataanPemaju}`, mL, y); y += LH_S;
doc.text("Platform: WhatsApp", mL, y); y += LH_S;
doc.text("Kenalan: En Faqeh — Faire Development Sdn. Bhd.", mL, y); y += LH_S;
doc.text(`Berkaitan: Tag ${data.defectTag} — ${data.defectDescription}`, mL, y); y += 10;

// Transkrip WhatsApp
const chatMessages = [
  { time: "14:13", sender: "Pemilik", text: "[Gambar laporan pemeriksaan dihantar]", italic: true },
  { time: "14:14", sender: "Pemilik", text: "Boleh saya tau kenapa tangga senget ni status as void?" },
  { time: "14:15", sender: "En Faqeh (Faire Dev)", text: "Saya dapatkan kepastian dulu dari project team" },
  { time: "14:18", sender: "Pemilik", text: "Ok baik. Tolong maklumkan saya segera ya. Sebab saya pun nak maklumkan & dapatkan penerangan dari Building Surveyor." },
  { time: "16:37", sender: "En Faqeh (Faire Dev)", text: "Tuan, untuk makluman tuan misalignment 15mm yang dimaksudkan masih lagi dalam kelonggaran binaan bangunan yang ditetapkan. Pihak kami sudah beberapa kali periksa untuk pastikan keadaan dan tangga yang dimaklumkan", highlight: true },
];

// Draw chat transcript box
const boxX = mL;
const boxW = cW;
doc.setLineWidth(0.4); bk();

// Header bar
doc.setFillColor(37, 211, 102);
doc.rect(boxX, y, boxW, 8, "F");
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL);
doc.setTextColor(255, 255, 255);
doc.text("WhatsApp — En Faqeh - Faire Development", boxX + 3, y + 5.5);
y += 8;

// Date label
doc.setFillColor(240, 240, 240);
doc.rect(boxX, y, boxW, 7, "F");
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.FOOTNOTE);
doc.setTextColor(100, 100, 100);
doc.text("12 June 2026", pageW / 2, y + 4.5, { align: "center" });
y += 7;

// Chat background
const chatStartY = y;
doc.setFillColor(230, 221, 212);

// Pre-calculate total height
let tempY = 0;
for (const msg of chatMessages) {
  doc.setFont("helvetica", msg.italic ? "italic" : "normal"); doc.setFontSize(SZ.SMALL);
  const lines = doc.splitTextToSize(msg.text, boxW - 30);
  tempY += lines.length * 5 + 16;
}
doc.rect(boxX, y, boxW, tempY + 5, "F");

// Draw messages
for (const msg of chatMessages) {
  const isOwner = msg.sender === "Pemilik";
  const bubbleMaxW = boxW - 30;
  doc.setFont("helvetica", msg.italic ? "italic" : "normal"); doc.setFontSize(SZ.SMALL);
  const lines = doc.splitTextToSize(msg.text, bubbleMaxW - 10);
  const bubbleH = lines.length * 5 + 12;
  const bubbleW = bubbleMaxW;

  let bubbleX;
  if (isOwner) {
    bubbleX = boxX + boxW - bubbleW - 5;
    doc.setFillColor(212, 251, 211);
  } else {
    bubbleX = boxX + 5;
    doc.setFillColor(255, 255, 255);
  }

  doc.roundedRect(bubbleX, y + 2, bubbleW, bubbleH, 2, 2, "F");

  // Sender name
  doc.setFont("helvetica", "bold"); doc.setFontSize(8);
  if (isOwner) {
    doc.setTextColor(0, 128, 0);
  } else {
    doc.setTextColor(0, 100, 180);
  }
  doc.text(msg.sender, bubbleX + 4, y + 7);

  // Message text
  doc.setFont("helvetica", msg.italic ? "italic" : "normal"); doc.setFontSize(SZ.SMALL);
  if (msg.highlight) {
    doc.setTextColor(180, 0, 0);
  } else {
    doc.setTextColor(0, 0, 0);
  }
  let textY = y + 12;
  for (const line of lines) {
    doc.text(line, bubbleX + 4, textY);
    textY += 5;
  }

  // Timestamp
  doc.setFont("helvetica", "normal"); doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  doc.text(msg.time, bubbleX + bubbleW - 4, y + bubbleH - 1, { align: "right" });

  y += bubbleH + 4;
}

y += 10;
bk();

// Highlight box for key statement
doc.setLineWidth(0.5);
doc.setDrawColor(200, 0, 0);
doc.rect(mL, y, cW, 28);
doc.setDrawColor(0, 0, 0);
y += 5;
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL);
doc.text("Kenyataan Utama Pemaju (Key Developer Statement):", mL + 4, y);
y += 6;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.SMALL);
const keyStmt = "\"...misalignment 15mm yang dimaksudkan masih lagi dalam kelonggaran binaan bangunan yang ditetapkan.\"";
const ksLines = doc.splitTextToSize(keyStmt, cW - 8);
for (const l of ksLines) { doc.text(l, mL + 4, y); y += 5; }
y += 10;

doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE);
bk();
const fnote = `*Transkrip di atas disalin secara verbatim daripada perbualan WhatsApp bertarikh ${data.tarikhKenyataanPemaju} antara pemilik unit dan wakil pemaju (En Faqeh, Faire Development Sdn. Bhd.) sebagai bukti kenyataan rasmi pihak pemaju.`;
const fnLines = doc.splitTextToSize(fnote, cW);
for (const f of fnLines) { doc.text(f, mL, y); y += 4.5; }

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

// ============================================================
const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/SURAT_MAKLUMBALAS_FAIRE.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_MAKLUMBALAS_FAIRE.pdf");
console.log(`Total pages: ${totalPages}`);
