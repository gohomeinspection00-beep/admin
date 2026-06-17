const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukanNotis2: "NOTIS-2/2026/039",
  noRujukanNotis1: "NOTIS-1/2026/039",

  namaPembeli: "MUHAMMAD IMRAN BIN MOHAMAD NAZARUDIN",
  alamatPengirim: [
    "No.39, Jalan Seluang,",
    "Tg Puteri Resort,",
    "81700 Pasir Gudang,",
    "Johor Darul Takzim.",
  ],
  emailPembeli: "imranalan20@gmail.com",
  telefonPembeli: "013-6749124",
  noKP: "991005015843",

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
  klausaSPA: "27(1)",
  klausaSerahan: "29(1)",
  tarikhVP: "1 Mac 2025",
  tempohDLP: "24",
  tarikhDLPTamat: "1 Mac 2027",

  noRujukanLaporan: "RPK/IMRAN/2026/001",
  tarikhSerahanLaporan: "25 Februari 2026",
  kaedahSerahanLaporan: "serahan tangan",

  tarikhPemeriksaanKedua: "6 Jun 2026",
  tarikhHantarLaporanKedua: "10 Jun 2026",

  tarikhNotis1: "18 Jun 2026",
  tarikhDeadlineNotis1: "3 Julai 2026",
  tempohNotis1: "15",
  kaedahPenghantaranNotis1: "serahan tangan dan e-mel",

  tarikhPemeriksaanKetiga: "10 Julai 2026",

  tarikhNotis2: "15 Julai 2026",
  tarikhDeadlineNotis2: "30 Julai 2026",
  tempohNotis2: "15",
  kaedahPenghantaranNotis2: "serahan tangan dan e-mel",

  jumlahSebutharga: "RM 18,500.00",
  namaKontraktor: "Syarikat Bina Jaya Enterprise",

  kecacatan: [
    { tag: "155", lokasi: "Tandas 1", kecacatan: "Kebocoran pada paip basin", status: "Tiada Tindakan" },
    { tag: "168", lokasi: "Bilik Tidur 2", kecacatan: "Kelembapan di dinding", status: "Tiada Tindakan" },
    { tag: "223", lokasi: "RC Flat Roof", kecacatan: "Metal deck kemek", status: "Tiada Tindakan" },
    { tag: "235", lokasi: "Atas Bumbung", kecacatan: "Atap genting pecah dan retak", status: "Pembaikan Tidak Sempurna" },
    { tag: "240", lokasi: "Atas Bumbung (Tingkat 1)", kecacatan: "Pemegang tingkap longgar", status: "Tiada Tindakan" },
    { tag: "242", lokasi: "Atas Bumbung (Tingkat 1)", kecacatan: "Atap genting pecah dan retak", status: "Tiada Tindakan" },
  ],

  kronologi: [
    { tarikh: "15 Mac 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani" },
    { tarikh: "1 Mac 2025", peristiwa: "Penyerahan Milik Kosong (Vacant Possession)" },
    { tarikh: "25 Februari 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju (serahan tangan)" },
    { tarikh: "27 Mac 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju" },
    { tarikh: "6 Jun 2026", peristiwa: "Pemeriksaan kali kedua (Second Inspection) dijalankan" },
    { tarikh: "10 Jun 2026", peristiwa: "Laporan pemeriksaan kali kedua dihantar kepada pemaju" },
    { tarikh: "18 Jun 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "3 Julai 2026", peristiwa: "Tarikh akhir pembaikan Notis Pertama (15 hari)" },
    { tarikh: "10 Julai 2026", peristiwa: "Pemeriksaan kali ketiga (Third Inspection) dijalankan" },
    { tarikh: "15 Julai 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan" },
    { tarikh: "30 Julai 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
  ],

  salinanKepada: [
    "Peguam Pemaju — Tetuan ABC & Partners, Johor Bahru",
    "Jabatan Perumahan Negara (KPKT)",
    "Tribunal Tuntutan Pembeli Rumah (TTPR)",
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

function bullet(text) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(SZ.BODY);
  bk();
  const bi = 14; const ti = bi + 5;
  checkBreak(LH + 1);
  doc.text("•", mL + bi, y);
  const lines = doc.splitTextToSize(text, cW - ti);
  for (const line of lines) { checkBreak(LH + 1); doc.text(line, mL + ti, y); y += LH; }
}

function drawTable(headers, rows, colWidths) {
  const pad = 2.5;
  const rlh = 5;
  const fs = SZ.TABLE;
  doc.setFontSize(fs);

  function rowH(cells) {
    let mx = rlh + pad * 2;
    for (let c = 0; c < cells.length; c++) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(fs);
      const ls = doc.splitTextToSize(String(cells[c]), colWidths[c] - pad * 2);
      const h = ls.length * rlh + pad * 2;
      if (h > mx) mx = h;
    }
    return mx;
  }

  function drawRow(cells, ry, rh, isH) {
    doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fs); bk();
    let cx = mL;
    for (let c = 0; c < cells.length; c++) {
      doc.setLineWidth(0.3);
      doc.rect(cx, ry, colWidths[c], rh);
      const w = colWidths[c] - pad * 2;
      doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fs); bk();
      const ls = doc.splitTextToSize(String(cells[c]), w);
      const ty = ry + pad + rlh - 1;
      for (let l = 0; l < ls.length; l++) doc.text(ls[l], cx + pad, ty + l * rlh);
      cx += colWidths[c];
    }
  }

  const hh = rowH(headers);
  checkBreak(hh + 5);
  drawRow(headers, y, hh, true);
  y += hh;

  for (const row of rows) {
    const rh2 = rowH(row);
    checkBreak(rh2 + 2);
    drawRow(row, y, rh2, false);
    y += rh2;
  }
}

// ============================================================
// PAGE 1 — SURAT UTAMA
// ============================================================
y = 25;

// NAMA PENGIRIM — BOLD
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text(data.namaPembeli, mL, y);
y += LH;

// Alamat pengirim
doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += LH_S;

y += 3;

// Garis pemisah
doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

// Kepada:
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Kepada:", mL, y);
y += LH;

// NAMA PENERIMA — BOLD
doc.text(data.namaPemaju, mL, y);
y += LH_S;

// Alamat penerima
doc.setFont("helvetica", "normal");
for (const line of data.alamatPenerima) { doc.text(line, mL, y); y += LH_S; }

// Tarikh kanan, sebaris baris akhir
doc.text(data.tarikhNotis2, pageW - mR, y - LH_S, { align: "right" });

y += 3;

// Rujukan
doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukanNotis2}`, mL, y);
y += LH_S;
doc.text(`Ruj. Notis Pertama: ${data.noRujukanNotis1}`, mL, y);
y += 8;

// Panggilan hormat
doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

// PERKARA — bold + underlined
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkara1 = "Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan";
const perkara2 = "(Final Notice — Defect Rectification Claim)";
const perkara3 = `Hartanah di ${data.alamatHartanah}`;
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

// ── PERENGGAN 1 — tiada nombor ──
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
para(
  `Merujuk kepada Notis Pertama (First Notice) bertarikh ${data.tarikhNotis1} dengan nombor rujukan ${data.noRujukanNotis1} yang telah dihantar melalui ${data.kaedahPenghantaranNotis1}, pihak tuan telah diberikan tempoh ${data.tempohNotis1} hari sehingga ${data.tarikhDeadlineNotis1} untuk melaksanakan pembaikan kecacatan selaras dengan tanggungjawab pemaju di bawah Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}) dan Seksyen 12(2) Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118].`
);
y += 4;

// ── PERENGGAN 2 ──
numPara(2,
  `Namun, hasil daripada pemeriksaan kali ketiga (Third Inspection) pada ${data.tarikhPemeriksaanKetiga}, didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum disempurnakan sepenuhnya atau tidak dilakukan langsung. Ini bermakna pihak tuan telah gagal mematuhi Notis Pertama yang dikeluarkan.`
);
y += 5;

// ── JADUAL KECACATAN ──
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
y += LH_S;
doc.text("(List of Outstanding Defects)", mL, y);
y += 6;

const colW = [15, 35, 55, cW - 15 - 35 - 55];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

// Footnote
y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Senarai lengkap kecacatan adalah sebagaimana dinyatakan di dalam Laporan Pemeriksaan Kecacatan (Ruj: ${data.noRujukanLaporan})`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { doc.text(f, mL, y); y += 4.5; }
y += 5;

// ── PERENGGAN 3 — Notis Kedua formal ──
numPara(3,
  `Dengan ini, saya mengeluarkan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadlineNotis2}. Notis Kedua ini menjadikan keseluruhan tempoh tiga puluh (30) hari telah diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan selaras dengan Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}).`
);
y += 4;

// ── PERENGGAN 4 — Sebutharga ──
numPara(4,
  `Di sini juga disertakan sebut harga rasmi (Official Repair Quotation) daripada kontraktor bertauliah, ${data.namaKontraktor}, mengenai jumlah anggaran kos pembaikan kecacatan di unit rumah saya yang berjumlah ${data.jumlahSebutharga}. Sebut harga ini dilampirkan sebagai Lampiran B bersama-sama notis ini.`
);
y += 4;

// ── PERENGGAN 5 — Serahan dokumen ──
numPara(5,
  `Merujuk kepada Klausa Penyampaian Dokumen ${data.klausaSerahan} (Service of Documents) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan, pos berdaftar atau e-mel adalah dianggap sah dan diterima pakai sebagai dokumen rasmi. Notis ini dihantar melalui ${data.kaedahPenghantaranNotis2}.`
);
y += 4;

// ── PERENGGAN 6 — DLP warning ──
numPara(6,
  `Adalah dimaklumkan bahawa Tempoh Liabiliti Kecacatan (Defect Liability Period — DLP) selama ${data.tempohDLP} bulan bagi unit ini bermula dari tarikh Penyerahan Milik Kosong (Vacant Possession) pada ${data.tarikhVP} dan akan tamat pada ${data.tarikhDLPTamat}. Oleh itu, pihak tuan hendaklah menyelesaikan semua pembaikan sebelum tempoh DLP tamat bagi mengelakkan tindakan lanjut.`
);
y += 4;

// ── PERINGATAN UNDANG-UNDANG ──
checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const lT = "Peringatan Tindakan Undang-undang (Legal Action Notice)";
doc.text(lT, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(lT), y + 1);
y += 8;

numPara(7,
  `Sekiranya pihak tuan masih gagal mengambil tindakan pembaikan selepas Notis Kedua (Final Notice) ini tamat tempohnya pada ${data.tarikhDeadlineNotis2}, saya akan tanpa berlengah lagi mengambil tindakan berikut:`
);
y += 2;

bullet(`Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan atau pampasan berjumlah ${data.jumlahSebutharga} atau lebih;`);
bullet(`Menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan 5% (Retention Sum 5%) yang sedang dipegang sebagaimana diperuntukkan di bawah Klausa 27(3) Perjanjian Jual Beli (${data.jenisSPA});`);
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
y += 4;

// ── PERENGGAN AKHIR ──
para("Saya berharap pihak tuan mengambil tindakan segera dan muktamad terhadap Notis Kedua ini. Ini merupakan notis akhir sebelum tindakan undang-undang dimulakan. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
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
// KRONOLOGI TINDAKAN
// ============================================================
newPage();
y = 30;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const krT = "KRONOLOGI TINDAKAN";
doc.text(krT, pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth(krT) / 2, y + 1, pageW / 2 + doc.getTextWidth(krT) / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("(Chronology of Actions)", pageW / 2, y, { align: "center" });
y += 10;

const krColW = [40, cW - 40];
drawTable(
  ["Tarikh (Date)", "Peristiwa (Event)"],
  data.kronologi.map(k => [k.tarikh, k.peristiwa]),
  krColW
);

// ============================================================
// AKUAN TERIMA — 2 salinan
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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} telah menerima Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan (Final Notice — Defect Rectification Claim) bertarikh ${data.tarikhNotis2} dengan rujukan ${data.noRujukanNotis2} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
// LAMPIRAN A — Gambar Bukti
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
doc.text("Gambar Bukti Kecacatan (Defect Evidence Photos)", pageW / 2, y, { align: "center" });
y += 10;

doc.setFontSize(SZ.SMALL); bk();
doc.text(`Rujukan Laporan: ${data.noRujukanLaporan}`, mL, y); y += LH_S;
doc.text(`Tarikh Pemeriksaan Ketiga: ${data.tarikhPemeriksaanKetiga}`, mL, y); y += 8;

const pw = (cW - 10) / 2;
const ph = 55;
const pg = 10;

for (let i = 0; i < data.kecacatan.length; i++) {
  const col = i % 2;
  if (col === 0) checkBreak(ph + 20);
  const px = mL + col * (pw + pg);
  const py = y;

  doc.setLineWidth(0.3); bk();
  doc.rect(px, py, pw, ph);

  doc.setFont("helvetica", "normal"); doc.setFontSize(14);
  doc.setTextColor(180, 180, 180);
  doc.text("[FOTO]", px + pw / 2, py + ph / 2 - 2, { align: "center" });
  doc.setFontSize(SZ.FOOTNOTE);
  doc.setTextColor(150, 150, 150);
  doc.text(`Tag #${data.kecacatan[i].tag}`, px + pw / 2, py + ph / 2 + 6, { align: "center" });

  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.CAPTION); doc.setTextColor(0, 0, 0);
  doc.text(`Tag ${data.kecacatan[i].tag} — ${data.kecacatan[i].lokasi}`, px + 2, py + ph + 5);
  doc.setFont("helvetica", "normal");
  const cl = doc.splitTextToSize(data.kecacatan[i].kecacatan, pw - 4);
  doc.text(cl[0], px + 2, py + ph + 10);

  if (col === 1) y += ph + 18;
}
if (data.kecacatan.length % 2 === 1) y += ph + 18;

// ============================================================
// LAMPIRAN B — Sebut Harga (placeholder)
// ============================================================
newPage();
y = 25;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const lamB = "LAMPIRAN B";
doc.text(lamB, pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth(lamB) / 2, y + 1, pageW / 2 + doc.getTextWidth(lamB) / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("Sebut Harga Rasmi Pembaikan Kecacatan (Official Repair Quotation)", pageW / 2, y, { align: "center" });
y += 12;

doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text(`Kontraktor: ${data.namaKontraktor}`, mL, y); y += LH;
doc.text(`Jumlah Anggaran: ${data.jumlahSebutharga}`, mL, y); y += LH + 8;

// Placeholder box for quotation document
doc.setLineWidth(0.3); bk();
doc.rect(mL, y, cW, 150);

doc.setFont("helvetica", "normal"); doc.setFontSize(14);
doc.setTextColor(180, 180, 180);
doc.text("[SALINAN SEBUT HARGA KONTRAKTOR]", pageW / 2, y + 75, { align: "center" });
doc.setFontSize(SZ.SMALL);
doc.setTextColor(150, 150, 150);
doc.text("(Lampirkan salinan sebut harga asal di sini)", pageW / 2, y + 85, { align: "center" });

// ============================================================
// FOOTER
// ============================================================
const totalPages = pageNum;
for (let p = 1; p <= doc.internal.getNumberOfPages(); p++) {
  doc.setPage(p);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2);
  doc.line(mL, pageH - 18, pageW - mR, pageH - 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.FOOTER); doc.setTextColor(0, 0, 0);
  doc.text(`Ruj: ${data.noRujukanNotis2}`, mL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

// ============================================================
const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/NOTIS_2_DUMMY_IMPROVED.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_2_DUMMY_IMPROVED.pdf");
console.log(`Total pages: ${totalPages}`);
