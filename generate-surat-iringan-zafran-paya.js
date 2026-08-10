const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "SERAHAN-AR/2026/ZAFRAN",

  namaPembeli: "MOHAMAD ZAFRAN SHAZIQ BIN YASID",
  alamatPengirim: [
    "No. 7, Jalan BS 23,",
    "Taman Bertam Setia,",
    "76450 Melaka.",
  ],
  noKP: "981203-01-6725",
  telefonPembeli: "011-1916 9598",
  emailPembeli: "shazzafran98@gmail.com",

  namaPemaju: "SHANG HEIGHT REALTY SDN. BHD.",
  noSyarikat: "(201301010686 / 1040528-X)",
  alamatPenerima: [
    "No. 19 & 19-1, Jalan Inang 1,",
    "Taman Paya Rumput Utama,",
    "76450 Melaka.",
  ],

  alamatHartanah: "No. 47, Jalan Kejora 8, Taman Tanjong Minyak Perdana, 75260 Melaka",
  jenisHartanah: "Rumah Teres 2 Tingkat (Double Storey Terrace — Intermediate), Unit PH1B-TM 050",
  namaProyek: "Taman Tanjong Minyak Perdana, Bertam Ulu (Fasa 1B)",

  tarikhSPA: "24 Februari 2025",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",

  tarikhVP: "2 Julai 2026",
  tarikhDLP: "2 Julai 2028",
  tarikhInspeksi: "4 Ogos 2026",
  tarikhSubmitApps: "5 Ogos 2026",
  namaApps: "iGoDefect (Intsoft)",
  noCase: "DF00000066",

  ruangTertinggal: "Living & Dining, Staircase dan Backyard",

  tarikhSurat: "11 Ogos 2026",

  salinanKepada: [
    {
      nama: "SHANG HEIGHT REALTY SDN. BHD. — Alamat Berdaftar",
      alamat: ["No. 2B-9, Jalan Kesidang 3/6,", "Melaka Mall, Off Jalan Tun Perak,", "75300 Melaka."],
    },
  ],
};

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 25;
const mR = 25;
const cW = pageW - mL - mR;
let y = 0;
let pageNum = 1;

const SZ = { BODY: 12, SMALL: 10, TABLE: 10, FOOTNOTE: 9, FOOTER: 8, TITLE: 12 };
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
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkara1 = "Serahan Laporan Kecacatan Tambahan (3 Ruang) Secara Pos Berdaftar AR";
const perkara2 = `Hartanah: ${data.jenisHartanah}`;
const perkara3 = `di ${data.alamatHartanah}`;
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas, sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} mengikut ${data.jenisSPA}, merujuk kepada perkara di atas. Milikan kosong (Vacant Possession) telah diserahkan pada ${data.tarikhVP} dan Tempoh Liabiliti Kecacatan (DLP) adalah sehingga ${data.tarikhDLP}.`
);
y += 4;

numPara(2,
  `Saya telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) ke atas hartanah tersebut pada ${data.tarikhInspeksi} dan telah mengemukakan laporan kecacatan secara rasmi kepada pihak tuan melalui aplikasi ${data.namaApps} pada ${data.tarikhSubmitApps} (No. Kes: ${data.noCase}).`
);
y += 4;

numPara(3,
  `Walau bagaimanapun, aplikasi tersebut hanya membenarkan satu (1) kes OPEN pada satu-satu masa ("Only 1 OPEN case is allowed. You can only create a new case when the current OPEN case is closed") dan tidak membenarkan penambahan item selepas serahan dibuat. Akibat had sistem ini, kecacatan bagi tiga (3) ruang iaitu ${data.ruangTertinggal} tidak dapat dimasukkan ke dalam kes tersebut. Perkara ini telah turut disahkan secara bertulis oleh wakil pihak tuan, yang memaklumkan bahawa item tambahan hanya boleh dikemukakan selepas semua kecacatan sedia ada dibaiki dan laporan ditutup.`
);
y += 4;

numPara(4,
  `Untuk makluman pihak tuan, had sistem dalaman aplikasi pemaju tidak boleh mengecilkan atau menangguhkan hak saya selaku pembeli di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli, yang mewajibkan pemaju membaiki apa-apa kecacatan yang dimaklumkan secara bertulis dalam tempoh DLP. Oleh yang demikian, bersama-sama surat ini disertakan Laporan Kecacatan bagi tiga (3) ruang tersebut sebagai serahan rasmi kepada pihak tuan.`
);
y += 4;

numPara(5,
  `Serahan surat ini beserta lampirannya dibuat melalui Pos Berdaftar Akuan Terima (AR) selaras dengan klausa Service of Documents (Klausa ${data.klausaSerahan} ${data.jenisSPA}), dan dengan itu adalah dianggap sah dan diterima pakai sebagai serahan rasmi. Tempoh pembaikan tiga puluh (30) hari bagi kecacatan di dalam lampiran surat ini bermula dari tarikh serahan surat ini.`
);
y += 4;

numPara(6,
  "Saya berharap pihak tuan dapat mengambil tindakan pembaikan terhadap semua kecacatan yang dilaporkan, termasuk item di dalam lampiran ini, dalam tempoh yang ditetapkan. Sebarang pertanyaan boleh menghubungi saya di talian di atas."
);
y += 4;

para("Sekian, terima kasih.");
y += 4;

checkBreak(60);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 12;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPembeli})`, mL, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += 4;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += 7;

// s.k. (CC)
checkBreak(18);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("s.k. (CC):", mL, y); y += 5;
doc.setFont("helvetica", "normal");
for (const cc of data.salinanKepada) {
  const ccText = `${cc.nama} — ${cc.alamat.join(" ")}`;
  const ccLines = doc.splitTextToSize(ccText, cW - 5);
  for (const l of ccLines) { checkBreak(5); doc.text(l, mL + 5, y); y += 4.5; }
}
y += 3;

// Lampiran
checkBreak(14);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("Lampiran:", mL, y); y += 5;
doc.setFont("helvetica", "normal");
doc.text("1. Laporan Kecacatan — Living & Dining, Staircase dan Backyard", mL + 5, y); y += 4.5;

// ============================================================
// AKUAN TERIMA x 2
// ============================================================
function drawAkuanTerima(copyLabel) {
  newPage();
  y = 25;

  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.SMALL); bk();
  doc.text(copyLabel, pageW - mR, y, { align: "right" });
  y += 8;

  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
  const t = "AKUAN TERIMA OLEH PEMAJU";
  doc.text(t, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(t) / 2, y + 1, pageW / 2 + doc.getTextWidth(t) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text("(Developer's Acknowledgement of Receipt)", pageW / 2, y, { align: "center" });
  y += 12;

  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima surat Serahan Laporan Kecacatan Tambahan (3 Ruang: ${data.ruangTertinggal}) bertarikh ${data.tarikhSurat} dengan rujukan ${data.noRujukan} beserta lampirannya daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
  const ls = doc.splitTextToSize(akText, cW);
  for (const l of ls) { doc.text(l, mL, y); y += LH; }

  y += 18;
  doc.setFont("helvetica", "bold");
  doc.text("Diterima oleh:", mL, y);
  y += 14;

  const fs2 = mL + 30; const fe = mL + 120;
  for (const f of ["Nama", "Jawatan", "Tarikh"]) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
    doc.text(f, mL, y); doc.text(":", mL + 25, y);
    doc.setLineWidth(0.3); doc.line(fs2, y + 1, fe, y + 1);
    y += 14;
  }

  y += 8;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL);
  doc.text("Cop Syarikat (Company Stamp):", mL, y);
  y += 5;
  doc.setLineWidth(0.3); doc.rect(mL, y, 60, 35);
}

drawAkuanTerima("Salinan Pemaju (Developer's Copy)");
drawAkuanTerima("Salinan Pemilik (Owner's Copy)");

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
fs.writeFileSync("/home/user/admin/SURAT_IRINGAN_ZAFRAN_PAYA.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_IRINGAN_ZAFRAN_PAYA.pdf");
console.log(`Total pages: ${totalPages}`);
