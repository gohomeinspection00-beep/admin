const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukanNotis3: "NOTIS-3/2026/024",
  noRujukanNotis2: "NOTIS-2/2026/024",
  noRujukanNotis1: "NOTIS-1/2026/024",

  namaPembeli: "ARIDHASAN A/L MENANDI",
  alamatPengirim: [
    "No. 28, Jalan Uda Utama 2/6,",
    "Bandar Uda Utama,",
    "81200 Johor Bahru,",
    "Johor.",
  ],
  emailPembeli: "eswari9583@yahoo.com",
  telefonPembeli: "017-225 0417",
  noKP: "830128-07-5427",

  namaPemaju: "UDA LAND (SOUTH) SDN. BHD.",
  noSyarikat: "(197501001813 / 23298-K)",
  alamatPenerima: (process.argv[2] === "JB") ? [
    "No. 1, Jalan Padi Mahsuri 12,",
    "Bandar Baru Uda,",
    "81200 Johor Bahru,",
    "Johor.",
  ] : [
    "Tingkat 15, Blok Menara,",
    "Kompleks Pertama,",
    "Jalan Tuanku Abdul Rahman,",
    "50100 Kuala Lumpur.",
  ],

  alamatHartanah: "No. 28, Jalan Uda Utama 2/6, Bandar Uda Utama, 81200 Johor Bahru, Johor",
  jenisHartanah: "Rumah Berkembar 2 Tingkat (2 Storey Semi-Detached)",

  noRujukanSPA: "8971-17/eSPA/161024/PTD217654/01",
  tarikhSPA: "16 Oktober 2024",
  jenisSPA: "Jadual G",
  klausaSPA: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhSerahanLaporan: "28 April 2026",
  kaedahSerahanLaporan: "aplikasi ProFix (Batch 1: 342 kecacatan; Batch 2 dan 3 pada 28 dan 29 Julai 2026: 159 dan 114 kecacatan)",

  tarikhNotis1: "15 Ogos 2026",
  tarikhDeadlineNotis1: "11 September 2026",
  tempohNotis1: "15",
  kaedahPenghantaranNotis1: "serahan fizikal (by hand)",

  tarikhReInspection: "24 September 2026",
  tarikhInspection4: "29 Oktober 2026",

  tarikhNotis2: "1 Oktober 2026",
  tarikhDeadlineNotis2: "16 Oktober 2026",
  tempohNotis2: "15",

  tarikhNotis3: "4 November 2026",
  tarikhDeadlineNotis3: "19 November 2026",
  tempohNotis3: "15",

  kecacatan: [
    { tag: "1", lokasi: "Toilet — Paip & Sanitari", kecacatan: "Kebocoran pada paip besen masih ada (Still observed leaking on basin down pipe)", status: "Masih Belum Diselesaikan (Not Complete)" },
    { tag: "3", lokasi: "Master Bathroom — Paip & Sanitari", kecacatan: "Kebocoran pada paip besen masih ada (Still observed leaking on basin down pipe) — kecacatan baru yang dilaporkan sejak Pemeriksaan Ketiga", status: "Masih Belum Diselesaikan (Not Fully Complete)" },
    { tag: "4", lokasi: "Bedroom 2 — M&E", kecacatan: "Lampu penunjuk suis tidak berfungsi (Possible indicator light for switch not function)", status: "Masih Belum Diselesaikan (Not Fully Complete)" },
    { tag: "7", lokasi: "Metal Deck Area — Metal Deck", kecacatan: "Kemungkinan air bertakung pada metal deck masih ada, serta sealant tidak sempurna/rosak di sekeliling paip vent (Possible water stagnant on metal deck; improper/damaged sealant around vent pipe)", status: "Masih Belum Diselesaikan (Not Complete)" },
  ],


  kronologi: [
    { tarikh: "16 Oktober 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "21 April 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama — laporan Batch 1 (342 kecacatan) dihantar melalui aplikasi ProFix pada 28 April 2026" },
    { tarikh: "28 Mei 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju" },
    { tarikh: "27 Julai 2026", peristiwa: "Pemeriksaan Kedua (Re-Inspection) — laporan Batch 2 (159 kecacatan) dan Batch 3 (114 kecacatan) dihantar melalui aplikasi ProFix pada 28 dan 29 Julai 2026" },
    { tarikh: "15 Ogos 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan — Ruj. NOTIS-1/2026/024" },
    { tarikh: "27 Ogos 2026", peristiwa: "Notis Pertama diserahkan secara fizikal (by hand) dan DIAKUI TERIMA oleh wakil pemaju, En. Mohd Sharil bin Kamsan (Officer), dengan cop rasmi DITERIMA (rujuk Lampiran A)" },
    { tarikh: "11 September 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari dari tarikh serahan 27 Ogos 2026) — kecacatan masih belum diselesaikan" },
    { tarikh: "24 September 2026", peristiwa: "Pemeriksaan Ketiga (Third Inspection) oleh Building Surveyor berdaftar RISM — 49 penemuan masih belum diselesaikan, termasuk kecacatan baru; ujian semula elektrik pada 27 September 2026 mengesahkan rintangan penebatan masih gagal" },
    { tarikh: "1 Oktober 2026", peristiwa: "Laporan Pemeriksaan Ketiga dihantar kepada pemaju melalui aplikasi ProFix" },
    { tarikh: "1 Oktober 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) — Ruj. NOTIS-2/2026/024 — dikeluarkan" },
    { tarikh: "16 Oktober 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Kedua (TARIKH MUKTAMAD) — kecacatan masih belum diselesaikan sepenuhnya" },
    { tarikh: "29 Oktober 2026", peristiwa: "Pemeriksaan Keempat (Fourth Inspection) oleh Building Surveyor berdaftar RISM — 5 daripada 9 item disahkan selesai (termasuk ujian rintangan penebatan elektrik yang kini LULUS); EMPAT (4) item masih belum diselesaikan" },
    { tarikh: "4 November 2026", peristiwa: "Notis Ketiga / Notis Muktamad (Third & Final Notice) dikeluarkan" },
    { tarikh: "19 November 2026", peristiwa: "Tarikh akhir pembaikan Notis Ketiga (15 hari) — TARIKH MUKTAMAD TERAKHIR" },
  ],

  salinanKepada: [],
};

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

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text(data.namaPembeli, mL, y);
y += LH;

doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Tel: ${data.telefonPembeli}`, mL, y); y += LH_S;

y += 3;

doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text(`${data.namaPemaju} ${data.noSyarikat}`, mL, y);
y += LH_S;

doc.setFont("helvetica", "normal");
doc.setFontSize(SZ.BODY);
for (const line of data.alamatPenerima) { doc.text(line, mL, y); y += LH_S; }

doc.text(data.tarikhNotis3, pageW - mR, y - LH_S, { align: "right" });

y += 3;

doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukanNotis3}`, mL, y);
y += LH_S;
doc.text(`Ruj. Notis Kedua: ${data.noRujukanNotis2}   Ruj. Notis Pertama: ${data.noRujukanNotis1}`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkara1 = "Notis Ketiga / Notis Muktamad — Tuntutan Pembetulan Kecacatan";
const perkara2 = "(Third and Final Notice — Defect Rectification Claim)";
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

doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
para(
  `Merujuk kepada Notis Pertama (Ruj: ${data.noRujukanNotis1}) bertarikh ${data.tarikhNotis1} — yang telah diserahkan secara fizikal (by hand) dan DIAKUI TERIMA oleh wakil pihak tuan, En. Mohd Sharil bin Kamsan (Officer), dengan cop rasmi "DITERIMA 27 AUG 2026" (Lampiran A) — serta Notis Kedua / Notis Akhir (Ruj: ${data.noRujukanNotis2}) bertarikh ${data.tarikhNotis2} dengan tarikh muktamad ${data.tarikhDeadlineNotis2}, pihak tuan telah pun diberikan keseluruhan tempoh melebihi tiga puluh (30) hari untuk menyelesaikan semua pembaikan kecacatan selaras dengan Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}) dan Seksyen 12(2) Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118].`
);;
y += 4;

numPara(2,
  `Pemeriksaan Keempat (Fourth Inspection) telah dijalankan pada ${data.tarikhInspection4} oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM). DIAKUI bahawa 5 daripada 9 item yang disemak telah disahkan selesai — termasuk ujian rintangan penebatan elektrik yang kini LULUS — dan kemajuan ini diambil maklum. Namun, EMPAT (4) item masih belum diselesaikan walaupun tarikh muktamad Notis Kedua (${data.tarikhDeadlineNotis2}) telah lama tamat. Laporan Pemeriksaan Keempat penuh disertakan bersama-sama notis ini. Item yang masih belum diselesaikan adalah seperti berikut:`
);;
y += 5;

checkBreak(60);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
y += LH_S;
doc.text("(List of Outstanding Defects)", mL, y);
y += 6;

const colW = [15, 40, 55, cW - 15 - 40 - 55];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Status di atas adalah sebagaimana Laporan Pemeriksaan Keempat bertarikh ${data.tarikhInspection4} yang disertakan bersama-sama notis ini. Kesemua item hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus diberikan kepada kebocoran paip besen yang MASIH BERTERUSAN di dua (2) lokasi — item No. 1 (Toilet) dan No. 3 (Master Bathroom) — walaupun telah dilaporkan dan dibaiki berulang kali; pihak tuan dituntut MENGESAN DAN MEMBAIKI PUNCA kebocoran (termasuk menggantikan fitting/sambungan yang rosak sepenuhnya), bukan sekadar mengetatkan sambungan secara sementara, dan membuktikan pembaikan dengan ujian aliran air. Bagi item No. 7 — Metal Deck Area — takungan air dan sealant yang tidak sempurna/rosak di sekeliling paip vent mendedahkan ruang bawah kepada risiko kebocoran dan kakisan; sealant hendaklah dibaiki/diganti mengikut spesifikasi pengilang dan kecerunan permukaan dibetulkan. Manakala item No. 4 — lampu penunjuk suis di Bedroom 2 yang tidak berfungsi — hendaklah dibaiki atau diganti oleh orang kompeten.`
);;
y += 4;

numPara(4,
  `Dengan ini, saya mengeluarkan Notis Ketiga iaitu Notis Muktamad (Third and Final Notice) kepada pihak tuan bagi menuntut agar KESEMUA EMPAT (4) item yang masih tertunggak di atas disiapkan sepenuhnya dalam tempoh ${data.tempohNotis3} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadlineNotis3} (TARIKH MUKTAMAD TERAKHIR). Memandangkan hanya empat item sahaja yang berbaki, tiada sebarang alasan munasabah untuk pihak tuan gagal menyiapkannya dalam tempoh tersebut.`
);;
y += 4;

numPara(5,
  `Merujuk kepada Klausa Penyampaian Dokumen ${data.klausaSerahan} (Service of Documents) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const lT = "Peringatan Tindakan Undang-undang (Legal Action Notice)";
doc.text(lT, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(lT), y + 1);
y += 8;

numPara(6,
  `Sekiranya pihak tuan masih gagal menyelesaikan kesemua item selepas Notis Ketiga ini tamat tempohnya pada ${data.tarikhDeadlineNotis3}, saya akan TANPA SEBARANG NOTIS LANJUT mengambil tindakan berikut:`
);;
y += 2;

bullet("Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya;");
bullet("Menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan 5% (Retention Sum 5%) yang sedang dipegang sebagaimana diperuntukkan di bawah Klausa 27(2) Perjanjian Jual Beli (Jadual G);");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
y += 4;

checkBreak(80);
para("Saya berharap pihak tuan menyelesaikan baki empat item ini dengan segera dan muktamad. Ini merupakan notis TERAKHIR sebelum tindakan undang-undang dimulakan tanpa notis lanjut. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 10;

checkBreak(46);
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
// LAMPIRAN A — BUKTI AKUAN TERIMA NOTIS 1
// ============================================================
newPage();
y = 25;
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const lampT = "LAMPIRAN A";
doc.text(lampT, pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth(lampT) / 2, y + 1, pageW / 2 + doc.getTextWidth(lampT) / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("Bukti Akuan Terima Notis Pertama oleh Pemaju", pageW / 2, y, { align: "center" });
y += 5;
doc.text("(Proof of Developer's Acknowledgement of Receipt — First Notice)", pageW / 2, y, { align: "center" });
y += 8;

const akuanImg = fs.readFileSync("/home/user/admin/aridhasan-bukti-akuan.jpg");
const akuanB64 = "data:image/jpeg;base64," + akuanImg.toString("base64");
const imgW = 100; const imgH = 160;
doc.addImage(akuanB64, "JPEG", (pageW - imgW) / 2, y, imgW, imgH);
y += imgH + 6;

doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const capText = "Akuan Terima Notis Pertama (Ruj: NOTIS-1/2026/024) — diterima dan ditandatangani oleh En. Mohd Sharil bin Kamsan (Officer) pada 27 Ogos 2026, dengan cop rasmi DITERIMA 27 AUG 2026.";
const capLines = doc.splitTextToSize(capText, cW - 20);
for (const cl of capLines) { doc.text(cl, pageW / 2, y, { align: "center" }); y += 4.5; }

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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Notis Ketiga / Notis Muktamad — Tuntutan Pembetulan Kecacatan (Third and Final Notice — Defect Rectification Claim) bertarikh ${data.tarikhNotis3} dengan rujukan ${data.noRujukanNotis3} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
  doc.text(`Ruj: ${data.noRujukanNotis3}`, mL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

const out = doc.output("arraybuffer");
const outName = (process.argv[2] === "JB") ? "NOTIS_3_ARIDHASAN_JB.pdf" : "NOTIS_3_ARIDHASAN.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
