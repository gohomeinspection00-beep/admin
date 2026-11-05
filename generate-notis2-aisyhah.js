const { jsPDF } = require("jspdf");
const fs = require("fs");

const VERSI = process.argv[2] || "SERKAM";

const ALAMAT = {
  SERKAM: [
    "(Pejabat Jualan / Sales Office)",
    "JC 8165, PT 7209,",
    "Persimpangan Jalan Baru Serkam,",
    "77300 Mukim Jasin, Melaka.",
  ],
  SELANGOR: [
    "(Pejabat Berdaftar / Registered Office)",
    "No. 9, Persiaran Selangor, Seksyen 15,",
    "40200 Shah Alam,",
    "Selangor.",
  ],
};

const data = {
  noRujukanNotis2: "NOTIS-2/2026/044",
  noRujukanNotis1: "NOTIS-1/2026/044",

  namaPembeli: "SITI AISYHAH BINTI MOHD ISMAIL",
  noKP: "000815-10-0214",
  namaPembeli2: "MUHAMMAD FIRDAUS BIN AB SAMAT",
  noKP2: "000818-04-0253",
  alamatPengirim: [
    "No. 26, KM 22,",
    "Jalan Permatang Bukit 2,",
    "77300 Merlimau,",
    "Melaka.",
  ],
  emailPembeli: "aisyhah.ismail0815@gmail.com",
  telefonPembeli: "017-378 5523",

  namaPemaju: "SCIENTEX HEIGHTS SDN. BHD.",
  noSyarikat: "(198801002898 / 170255-V)",
  alamatPenerima: ALAMAT[VERSI],

  alamatHartanah: "JD 6515, Jalan BSJ P2/1, Bandar Scientex Jasin Presint 2, 77300 Merlimau, Melaka (Lot JP24, PT 11089, H.S.(D) 26413, Mukim Jasin)",
  jenisHartanah: "Rumah Teres 2 Tingkat",

  noRujukanSPA: "6575-44/eSPA/120724/PT11089/01",
  tarikhSPA: "22 Julai 2024",
  jenisSPA: "Jadual G",
  klausaSPA: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhSerahanLaporan: "22 Julai 2026",
  kaedahSerahanLaporan: "serahan tangan (hardcopy)",

  tarikhNotis1: "18 September 2026",
  tarikhDeadlineNotis1: "3 Oktober 2026",
  tempohNotis1: "15",

  tarikhReInspection3: "30 Oktober 2026",

  tarikhNotis2: "6 November 2026",
  tarikhDeadlineNotis2: "21 November 2026",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "2", lokasi: "Backyard — Dinding", kecacatan: "Keretakan dan shrinkage cracks pada keseluruhan permukaan dinding masih ada (Crack and shrinkage cracks on all wall surface — still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "3", lokasi: "Backyard — Paip & Sanitari", kecacatan: "Sistem saliran tidak sempurna — objek masih menyebabkan sumbatan (Poor Drainage System — still have object causes of clogged)", status: "Masih Belum Diselesaikan" },
    { tag: "4", lokasi: "Living & Dining — Dinding", kecacatan: "Dinding tidak sejajar masih ada — ketara (Misaligned wall still observed — Visible)", status: "Masih Belum Diselesaikan" },
    { tag: "5", lokasi: "Living & Dining — Dinding", kecacatan: "Ketidakjajaran dan permukaan dinding beralun (Wall have alignment issue and wavy surface)", status: "Masih Belum Diselesaikan" },
    { tag: "6", lokasi: "Family Hall — Dinding", kecacatan: "Ketidakjajaran pada permukaan dinding masih ada (Still have alignment issue on wall surface)", status: "Masih Belum Diselesaikan" },
    { tag: "7", lokasi: "Bedroom 2 — Dinding", kecacatan: "Ukuran dinding tidak konsisten dengan jubin lantai — 29.5cm berbanding 27cm — ketidakjajaran ketara (Wall inconsistent measurements with floor tiles, 29.5cm and 27cm — still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "9", lokasi: "Ceiling Area (Master Bedroom) — Paip", kecacatan: "Tiada sokongan sempurna pada distribution pipe ke tangki air masih ada (Missing proper support for distribution pipe — still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "10", lokasi: "Water Tank Area — Lantai", kecacatan: "Air bertakung pada papak lantai masih ada (Water stagnant on floor slab — still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "11", lokasi: "Water Tank Area — Lantai", kecacatan: "Keretakan dan kerosakan pada papak lantai — seluruh kawasan (Crack and damage on floor slab, all floor area — still observed)", status: "Belum Diselesaikan Sepenuhnya" },
    { tag: "12", lokasi: "Water Tank Area — Dinding", kecacatan: "Plaster dinding rosak (Damaged on wall plaster) — KECACATAN BARU AKIBAT KERJA PEMBAIKAN (New Defect from Rectification Work)", status: "Kecacatan Baru" },
    { tag: "14", lokasi: "Water Tank Area — Paip", kecacatan: "Kebocoran pada incoming pipe stopcock masih ada (Leaking on incoming pipe stopcock — still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "16", lokasi: "Water Tank Area", kecacatan: "Tangki air dalam keadaan kotor dan perlu dibersihkan masih ada (Water tank on dirty condition — still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "17", lokasi: "RC Flat Roof — Lantai", kecacatan: "Air bertakung pada permukaan papak masih ada (Still have water stagnant on slab surface)", status: "Masih Belum Diselesaikan" },
    { tag: "19", lokasi: "RC Flat Roof — Lantai", kecacatan: "Kesan kotoran pada papak lantai masih ada (Stain on floor slab — still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "20", lokasi: "RC Flat Roof — Lantai", kecacatan: "Tonality, permukaan tidak rata dan kesan kotoran pada keseluruhan papak SELEPAS kerja pembaikan (New Defect from Rectification Work)", status: "Kecacatan Baru — Belum Diselesaikan" },
    { tag: "21", lokasi: "RC Flat Roof — Dinding", kecacatan: "Permukaan kasar dan cat tidak rata pada dinding SELEPAS kerja pembaikan (Visible uneven rough surface and uneven painting — New Defect from Rectification Work)", status: "Kecacatan Baru — Belum Diselesaikan" },
    { tag: "26", lokasi: "Top Roof — Bumbung", kecacatan: "Chipping dan keretakan pada genting bumbung masih ada (Chipping and crack on roof tiles — MAJOR DEFECT, still observed)", status: "Masih Belum Diselesaikan" },
  ],

  kronologi: [
    { tarikh: "22 Julai 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Scientex Bandar Jasin Fasa 2A1, Jadual G (Ruj: 6575-44/eSPA/120724/PT11089/01)" },
    { tarikh: "16 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "22 Julai 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara rasmi melalui serahan tangan (hardcopy) — notis bertulis di bawah Klausa 27(1)" },
    { tarikh: "21 Ogos 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1) — pembaikan masih belum diselesaikan" },
    { tarikh: "9 September 2026", peristiwa: "Pemeriksaan Kedua (Re-Inspection) dijalankan — kecacatan masih belum diselesaikan" },
    { tarikh: "18 September 2026", peristiwa: "Notis Pertama (Ruj: NOTIS-1/2026/044) diserahkan secara serahan tangan dan DITERIMA oleh wakil pemaju, Cik Radhiah (Customer Care Department), dengan cop rasmi RECEIVED 18 SEP 2026 (Lampiran A)" },
    { tarikh: "3 Oktober 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari) — kecacatan masih belum diselesaikan" },
    { tarikh: "30 Oktober 2026", peristiwa: "Pemeriksaan Ketiga (Third Inspection) dijalankan — TUJUH BELAS (17) kecacatan masih belum diselesaikan, termasuk TIGA (3) kecacatan baru yang berpunca daripada kerja pembaikan pihak pemaju sendiri (New Defect from Rectification Work)" },
    { tarikh: "6 November 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan" },
    { tarikh: "21 November 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
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
doc.text(`${data.namaPembeli} &`, mL, y); y += LH_S;
doc.text(data.namaPembeli2, mL, y); y += LH;

doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text(`No. K/P: ${data.noKP} / ${data.noKP2}`, mL, y); y += LH_S;
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
  `Kami, ${data.namaPembeli} (No. K/P: ${data.noKP}) dan ${data.namaPembeli2} (No. K/P: ${data.noKP2}), pemilik bersama hartanah di alamat di atas, merujuk kepada Notis Pertama (First Notice) bertarikh ${data.tarikhNotis1} dengan nombor rujukan ${data.noRujukanNotis1} — yang telah diserahkan secara serahan tangan dan DITERIMA pada hari yang sama oleh wakil pihak tuan, Cik Radhiah (Customer Care Department), dengan cop rasmi "RECEIVED 18 SEP 2026" (salinan Akuan Terima dilampirkan sebagai Lampiran A). Melalui Notis Pertama tersebut, pihak tuan telah diberikan tempoh ${data.tempohNotis1} hari sehingga ${data.tarikhDeadlineNotis1} untuk melaksanakan pembaikan kecacatan selaras dengan tanggungjawab pemaju di bawah Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}) bertarikh ${data.tarikhSPA} dan Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118].`
);;;
y += 4;

numPara(2,
  `Namun, Pemeriksaan Ketiga (Third Inspection) yang dijalankan pada ${data.tarikhReInspection3} mengesahkan bahawa TUJUH BELAS (17) kecacatan masih belum diselesaikan oleh pihak tuan — termasuk TIGA (3) KECACATAN BARU yang berpunca daripada kerja pembaikan pihak tuan sendiri (New Defect from Rectification Work). Ini bermakna pihak tuan telah gagal mematuhi Notis Pertama yang dikeluarkan. Senarai kecacatan tersebut adalah seperti berikut:`
);;;
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
const fn = `*Status di atas adalah sebagaimana Laporan Pemeriksaan Ketiga (Re-Inspection Report) bertarikh ${data.tarikhReInspection3}. Senarai penuh kecacatan adalah sebagaimana laporan-laporan yang telah diserahkan kepada pihak tuan, dan KESEMUANYA hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus diberikan kepada: (a) item No. 26 — chipping dan keretakan pada genting bumbung (KECACATAN MAJOR) yang mendedahkan rumah kepada risiko kebocoran air hujan dan WAJIB diganti baharu; (b) kluster ketidakjajaran dinding (item No. 4, 5, 6 dan 7) yang disahkan dengan bukti ukuran — termasuk perbezaan 29.5cm berbanding 27cm pada Bedroom 2 — yang hendaklah dibaiki mengikut amalan pembinaan yang baik dan bukan tampalan kosmetik; (c) kluster Water Tank Area (item No. 9, 10, 11, 14 dan 16) termasuk kebocoran stopcock dan tangki air kotor yang melibatkan kebersihan bekalan air domestik; dan (d) TIGA (3) KECACATAN BARU AKIBAT KERJA PEMBAIKAN pihak tuan sendiri — item No. 12 (plaster dinding rosak), No. 20 (tonality dan permukaan tidak rata pada keseluruhan papak) dan No. 21 (permukaan kasar dan cat tidak rata) — di mana kerja pembaikan yang menyebabkan kerosakan baharu hendaklah disiapkan semula dengan kemasan yang sempurna.`
);;;
y += 4;

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

checkBreak(70);
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
y += 5;
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

const akuanImg = "data:image/jpeg;base64," + fs.readFileSync("/home/user/admin/aisyhah-akuan-terima.jpg").toString("base64");
const aH = 175;
const aW = aH * 720 / 1280;
doc.setLineWidth(0.3); doc.setDrawColor(0, 0, 0);
doc.rect((pageW - aW) / 2 - 1, y - 1, aW + 2, aH + 2);
doc.addImage(akuanImg, "JPEG", (pageW - aW) / 2, y, aW, aH);
y += aH + 6;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const capL = doc.splitTextToSize("Akuan Terima Notis Pertama (Ruj: NOTIS-1/2026/044) — diserahkan secara serahan tangan dan DITERIMA pada 18 September 2026 oleh Cik Radhiah, Customer Care Department, dengan cop rasmi RECEIVED 18 SEP 2026.", cW - 10);
for (const c of capL) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.3; }

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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan (Final Notice — Defect Rectification Claim) bertarikh ${data.tarikhNotis2} dengan rujukan ${data.noRujukanNotis2} daripada ${data.namaPembeli} dan ${data.namaPembeli2} berhubung hartanah di ${data.alamatHartanah}.`;
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
const outName = VERSI === "SELANGOR" ? "NOTIS_2_AISYHAH_SELANGOR.pdf" : "NOTIS_2_AISYHAH_SERKAM.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
