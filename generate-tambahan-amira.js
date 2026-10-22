const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "TAMBAHAN-1/NOTIS-2/2026/030",

  namaPembeli: "NOR AMIRA BINTI ABU ZARIN",
  noKP: "960408-01-6216",
  namaPembeli2: "MUHAMMAD AMIRUL ZARIQ BIN MOHAMAD HALID",
  noKP2: "920721-01-6451",
  alamatPengirim: [
    "No. 55, Jalan Alamanda 4,",
    "Taman Bistari Perdana,",
    "81700 Pasir Gudang,",
    "Johor.",
  ],
  telefonPembeli: "011-3788 1033",
  emailPembeli: "noramira390@gmail.com",

  namaPemaju: "MERIDIN EAST SDN BHD",
  noSyarikat: "(201301025170 / 1054999-D)",
  alamatPenerima: (process.argv[2] === "AUSTIN") ? [
    "(Sales Gallery)",
    "No. 17 - 21, Block A, Austin V Square,",
    "Jalan Austin Perdana 2, Taman Austin Perdana,",
    "81100 Johor Bahru, Johor.",
    "Tel: 07-355 4888 / 019-422 2624",
  ] : [
    "(Sales Gallery / Customer Services)",
    "Utama 6, Jalan Bestari Perdana, Jalan Kong Kong,",
    "Taman Bistari Perdana,",
    "81700 Pasir Gudang, Johor.",
  ],

  alamatHartanah: "No. 55, Jalan Alamanda 4, Taman Bistari Perdana, 81700 Pasir Gudang, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (18' x 65', Intermediate, Unit PTD 244714)",
  namaProyek: "Allamanda, Bandar Meridin East",
  tarikhSPA: "9 Januari 2024",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",

  tarikhNotis: "22 Oktober 2026",
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
doc.text(`${data.namaPembeli} &`, mL, y); y += LH_S;
doc.text(data.namaPembeli2, mL, y); y += LH;
doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP} (NOR AMIRA)`, mL, y); y += LH_S;
doc.text(`No. K/P: ${data.noKP2}`, mL, y); y += LH_S;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Tel: ${data.telefonPembeli}`, mL, y); y += LH_S;
y += 3;
doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

// ===== Recipient =====
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text(`${data.namaPemaju} ${data.noSyarikat}`, mL, y);
y += LH_S;
doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.BODY);
for (const line of data.alamatPenerima) { doc.text(line, mL, y); y += LH_S; }
doc.text(data.tarikhNotis, pageW - mR, y - LH_S, { align: "right" });
y += 3;
doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukan}   Ruj. Notis Kedua: NOTIS-2/2026/030   Ruj. Notis Pertama: NOTIS-1/2026/030`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

// ===== Title =====
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const perkara1 = "Makluman Kecacatan Tambahan — Pemerhatian Pemilik (Additional Defect Notification — Owner's Observation)";
const perkara2 = "Kesan Kebocoran pada Siling Family Area";
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
  `Kami, ${data.namaPembeli} (No. K/P: ${data.noKP}) dan ${data.namaPembeli2} (No. K/P: ${data.noKP2}), pemilik bersama unit hartanah di alamat di atas (Projek: ${data.namaProyek}), merujuk kepada Notis Pertama (NOTIS-1/2026/030) bertarikh 2 September 2026 dan Notis Kedua / Notis Akhir (NOTIS-2/2026/030) bertarikh 22 Oktober 2026 yang telah dikemukakan kepada pihak tuan.`
);
y += 4;

numPara(2,
  `Dengan ini dimaklumkan bahawa melalui pemerhatian pemilik sendiri (owner's observation), satu kecacatan TAMBAHAN telah dikesan di unit kami — KESAN KEBOCORAN / TOMPOK AIR (water stain / sign of leaking) pada permukaan siling di ruang Family Area. Gambar kecacatan tersebut dilampirkan sebagai LAMPIRAN A bersama-sama surat ini.`
);
y += 4;

numPara(3,
  `Kesan air pada siling menunjukkan kemungkinan kebocoran daripada ruang di atasnya (contohnya paip, bilik air atau lapisan kalis air di tingkat atas). Pihak tuan dimohon untuk MENYIASAT DAN MENGESAN PUNCA kebocoran tersebut terlebih dahulu dan membaikinya dengan sempurna — bukan sekadar pembaikan kosmetik ke atas kesan pada siling — memandangkan kebocoran yang dibiarkan akan merebak dan merosakkan siling serta kemasan di sekitarnya.`
);
y += 4;

numPara(4,
  `Kecacatan tambahan ini adalah di dalam Tempoh Liabiliti Kecacatan (DLP) di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli bertarikh ${data.tarikhSPA}, dan dengan ini dikemukakan sebagai notis bertulis. Kami memohon agar kecacatan ini dibaiki BERSAMA-SAMA kecacatan lain yang masih tertunggak sebagaimana dinyatakan di dalam Notis Kedua / Notis Akhir (NOTIS-2/2026/030), iaitu sebelum atau pada 6 November 2026.`
);
y += 4;

para("Kerjasama dan perhatian segera pihak tuan amat dihargai. Sekian, terima kasih.");
y += 8;

// ===== Signatures (side by side) =====
checkBreak(60);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 18;
const sigCol2 = mL + 85;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
doc.line(sigCol2, y, sigCol2 + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.SMALL);
doc.text(`(${data.namaPembeli})`, mL, y);
doc.text(`(${data.namaPembeli2})`, sigCol2, y);
y += 5;
doc.setFont("helvetica", "normal");
doc.text(`No. K/P: ${data.noKP}`, mL, y);
doc.text(`No. K/P: ${data.noKP2}`, sigCol2, y);
y += 8;

// ===== LAMPIRAN A =====
newPage();
y = 25;
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const lampT = "LAMPIRAN A";
doc.text(lampT, pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth(lampT) / 2, y + 1, pageW / 2 + doc.getTextWidth(lampT) / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("Gambar Kecacatan Tambahan — Pemerhatian Pemilik", pageW / 2, y, { align: "center" });
y += 8;
const img = "data:image/jpeg;base64," + fs.readFileSync("/home/user/admin/amira-leaking-family.jpg").toString("base64");
const iw = 105; const ih = iw * 1280 / 720;
const ix = (pageW - iw) / 2;
doc.setLineWidth(0.3); doc.setDrawColor(0, 0, 0);
doc.rect(ix - 1, y - 1, iw + 2, ih + 2);
doc.addImage(img, "JPEG", ix, y, iw, ih);
y += ih + 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const cl = doc.splitTextToSize("Kesan kebocoran / tompok air (water stain / sign of leaking) pada permukaan siling Family Area — pemerhatian pemilik, Oktober 2026.", cW - 10);
for (const c of cl) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.3; }

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
const outName = (process.argv[2] === "AUSTIN") ? "SURAT_TAMBAHAN_AMIRA_AUSTIN.pdf" : "SURAT_TAMBAHAN_AMIRA.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
