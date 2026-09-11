const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukanNotis2: "NOTIS-2/2026/016",
  noRujukanNotis1: "NOTIS-1/2026/016",

  namaPembeli: "PUPALAN A/L WAI RAWAN",
  alamatPengirim: [
    "No. 72, Jalan Ketapang 5,",
    "Taman Rinting,",
    "81750 Masai,",
    "Johor.",
  ],
  emailPembeli: "pupalanpukat@gmail.com",
  telefonPembeli: "012-243 5795",
  noKP: "900117-08-5399",

  namaPemaju: "PARKLAND CITY SDN BHD",
  noSyarikat: "(201201031906 / 1016393-K)",
  alamatPenerima: [
    "(Parkland Headquarters Office)",
    "No. 112, Jalan Tun Perak,",
    "75300 Melaka.",
  ],

  alamatHartanah: "No. 6, Jalan Wau Barat 9, Bandar Layangkasa, 81700 Pasir Gudang, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (20' x 70')",

  noRujukanSPA: "13759-31/eSPA/270924/PTD248797/01",
  tarikhSPA: "27 September 2024",
  jenisSPA: "Jadual G",
  klausaSPA: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhSerahanLaporan: "20 April 2026",
  kaedahSerahanLaporan: "serahan tangan (hardcopy) kepada pejabat pengurusan (management office)",

  tarikhNotis1: "5 Ogos 2026",
  tarikhDeadlineNotis1: "20 Ogos 2026",
  tempohNotis1: "15",
  kaedahPenghantaranNotis1: "serahan tangan",

  tarikhReInspection: "4 September 2026",

  tarikhNotis2: "10 September 2026",
  tarikhDeadlineNotis2: "25 September 2026",
  tempohNotis2: "15",
  kaedahPenghantaranNotis2: "serahan tangan",

  kecacatan: [
    { tag: "11", lokasi: "Carporch — Mailbox", kecacatan: "Celahan ketara dan penyendalan tidak sempurna di sekeliling bingkai peti surat (Visible gaps and improper seal around mailbox frame)", status: "Belum Dibaiki" },
    { tag: "12", lokasi: "Carporch — Mailbox", kecacatan: "Bukaan peti surat tertanggal (Detached mailbox opening)", status: "Belum Dibaiki" },
    { tag: "13", lokasi: "Foyer — Floor", kecacatan: "Kesan kotoran pada jubin lantai (Stains on floor tile)", status: "Belum Dibaiki" },
    { tag: "37", lokasi: "Yard — Plumbing & Sanitary Fitting", kecacatan: "Batu di dalam manhole — sistem saliran tidak sempurna (Stones inside manhole — poor drainage system)", status: "Belum Dibaiki" },
    { tag: "47", lokasi: "Staircase — Wall", kecacatan: "Keretakan pada dinding bercat (Crack on painted wall)", status: "Belum Dibaiki" },
    { tag: "50", lokasi: "Family Area — Wall", kecacatan: "Keretakan pada dinding bercat (Crack on painted wall)", status: "Belum Dibaiki" },
    { tag: "55", lokasi: "Master Bedroom — Wall", kecacatan: "Ketidakjajaran ketara pada dinding (Visible misalignment on wall)", status: "Belum Dibaiki" },
    { tag: "78", lokasi: "Water Tank Area — Floor", kecacatan: "Keretakan pada papak lantai (semua kawasan lantai) — masih retak selepas kerja pembaikan (Crack on floor slab, all floor area — still cracked after rectification work)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "80", lokasi: "Water Tank Area — Plumbing & Sanitary Fitting", kecacatan: "Tiada sokongan yang sempurna pada distribution pipe dan incoming pipe ke tangki air (Missing proper support on distribution pipe and incoming pipe connected to water tank)", status: "Belum Dibaiki" },
    { tag: "81", lokasi: "Water Tank Area — Plumbing & Sanitary Fitting", kecacatan: "Paip saliran papak tersumbat (Clogged slab discharge pipe) — KECACATAN BARU yang berlaku akibat kerja pembaikan (New Defect from Rectification Work)", status: "Kecacatan Baru — Belum Dibaiki" },
    { tag: "82", lokasi: "Water Tank Area — Fixtures", kecacatan: "Tangki air kotor dan perlu dibersihkan (Water tank dirty and needs to be cleaned)", status: "Belum Dibaiki" },
    { tag: "85", lokasi: "RC Flat Roof — Floor", kecacatan: "Air bertakung pada papak lantai (Stagnant water on floor slab)", status: "Belum Dibaiki" },
    { tag: "86", lokasi: "RC Flat Roof — Floor", kecacatan: "Lubang, keretakan dan mengelupas pada papak lantai (Holes, crack and peel off on floor slab)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "88", lokasi: "RC Flat Roof — Wall", kecacatan: "Keretakan dan kemek pada dinding bercat (Crack and dented on painted wall)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "89", lokasi: "Top Roof — Roof", kecacatan: "Keretakan/kerosakan pada genting bumbung (Crack/damaged on roof tiles)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "27 September 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "13 April 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "20 April 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara serahan tangan (hardcopy) kepada pejabat pengurusan pemaju" },
    { tarikh: "20 Mei 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "2 Julai 2026", peristiwa: "Susulan (follow-up) oleh pemilik melalui WhatsApp kepada wakil pemaju — wakil pemaju mengesahkan kecacatan (crack) masih belum dibaiki ('rumah masih pending defect crack')" },
    { tarikh: "19 Julai 2026", peristiwa: "Susulan terakhir oleh pemilik melalui WhatsApp — tiada maklum balas daripada pemaju" },
    { tarikh: "5 Ogos 2026", peristiwa: "Notis Pertama (First Notice) — Ruj. NOTIS-1/2026/016 — diserahkan secara serahan tangan dan diakui terima oleh wakil pemaju, Cik Laynia Nabila binti Salikim (Customer Care), dengan cop rasmi 'RECEIVED' bertarikh 5 Ogos 2026 (rujuk Lampiran A)" },
    { tarikh: "20 Ogos 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari) — kecacatan masih belum diselesaikan" },
    { tarikh: "4 September 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — 15 kecacatan masih belum dibaiki / kecacatan baru dikesan / belum disiapkan sepenuhnya" },
    { tarikh: "10 September 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan" },
    { tarikh: "25 September 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
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

doc.text(data.tarikhNotis2, pageW - mR, y - LH_S, { align: "right" });

y += 3;

doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukanNotis2}`, mL, y);
y += LH_S;
doc.text(`Ruj. Notis Pertama: ${data.noRujukanNotis1}`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

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

doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
para(
  `Merujuk kepada Notis Pertama (First Notice) bertarikh ${data.tarikhNotis1} dengan nombor rujukan ${data.noRujukanNotis1} yang telah dihantar melalui ${data.kaedahPenghantaranNotis1}, pihak tuan telah diberikan tempoh ${data.tempohNotis1} hari sehingga ${data.tarikhDeadlineNotis1} untuk melaksanakan pembaikan kecacatan selaras dengan tanggungjawab pemaju di bawah Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}) dan Seksyen 12(2) Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118]. Notis Pertama tersebut telah diakui terima oleh wakil pihak tuan, Cik Laynia Nabila binti Salikim (Customer Care), dengan cop rasmi "RECEIVED" bertarikh 5 Ogos 2026 dan cop syarikat pihak tuan — salinan Akuan Terima tersebut dilampirkan sebagai Lampiran A bersama-sama notis ini.`
);
y += 4;

numPara(2,
  `Namun, hasil daripada pemeriksaan semula (Re-Inspection) pada ${data.tarikhReInspection}, didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum disempurnakan sepenuhnya atau tidak dilakukan langsung. Ini bermakna pihak tuan telah gagal mematuhi Notis Pertama yang dikeluarkan.`
);
y += 4;

numPara(3,
  `Lebih membimbangkan, pemeriksaan semula tersebut turut mengesan KECACATAN BARU yang berlaku akibat kerja pembaikan pihak tuan sendiri (New Defect from Rectification Work), iaitu paip saliran papak di Water Tank Area yang tersumbat (clogged slab discharge pipe — item 81). Kecacatan baru ini boleh menyebabkan air bertakung dan kebocoran ke dalam unit, dan dengan itu dituntut supaya ia dibaiki dengan SEGERA bersama-sama kecacatan lain dalam tempoh notis ini.`
);
y += 5;

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
const fn = `*Senarai lengkap kecacatan adalah sebagaimana dinyatakan di dalam Laporan Pemeriksaan Kecacatan Kali Pertama yang telah dihantar melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}, dan Laporan Pemeriksaan Semula Kali Kedua (Re-Inspection Report) bertarikh ${data.tarikhReInspection} yang disertakan bersama-sama notis ini.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(4,
  `Dengan ini, saya mengeluarkan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadlineNotis2}. Notis Kedua ini menjadikan keseluruhan tempoh tiga puluh (30) hari telah diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan selaras dengan Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}).`
);
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
  `Sekiranya pihak tuan masih gagal mengambil tindakan pembaikan selepas Notis Kedua (Final Notice) ini tamat tempohnya pada ${data.tarikhDeadlineNotis2}, saya akan tanpa berlengah lagi mengambil tindakan berikut:`
);
y += 2;

bullet("Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya;");
bullet("Menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan 5% (Retention Sum 5%) yang sedang dipegang sebagaimana diperuntukkan di bawah Klausa 27(2) Perjanjian Jual Beli (Jadual G);");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera dan muktamad terhadap Notis Kedua ini. Ini merupakan notis akhir sebelum tindakan undang-undang dimulakan. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 10;

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

const akuanImg = fs.readFileSync("/home/user/admin/pupalan-bukti-akuan.jpg");
const akuanB64 = "data:image/jpeg;base64," + akuanImg.toString("base64");
const imgW = 120; const imgH = 160;
doc.addImage(akuanB64, "JPEG", (pageW - imgW) / 2, y, imgW, imgH);
y += imgH + 6;

doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const capText = "Akuan Terima Notis Pertama (Ruj: NOTIS-1/2026/016) bertarikh 5 Ogos 2026 — diterima dan ditandatangani oleh Cik Laynia Nabila binti Salikim (Customer Care) dengan cop 'RECEIVED' 05 AUG 2026 serta cop rasmi PARKLAND CITY SDN BHD.";
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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan (Final Notice — Defect Rectification Claim) bertarikh ${data.tarikhNotis2} dengan rujukan ${data.noRujukanNotis2} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
  doc.text(`Ruj: ${data.noRujukanNotis2}`, mL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/NOTIS_2_PUPALAN.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_2_PUPALAN.pdf");
console.log(`Total pages: ${totalPages}`);
