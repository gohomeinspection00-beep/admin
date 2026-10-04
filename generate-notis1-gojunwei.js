const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/053",

  namaPembeli: "GO JUN WEI",
  alamatPengirim: [
    "#44-12, Tower C, Pangsapuri Seri Permata,",
    "Jalan Kunyit, Taman Sri Amar,",
    "81100 Johor Bahru,",
    "Johor.",
  ],
  noKP: "010709-01-0919",
  telefonPembeli: "011-1061 7779",
  emailPembeli: "junwei_0000@hotmail.com",

  namaPemaju: "TH TEBRAU LAND SDN. BHD.",
  noSyarikat: "(201201012411 / 985928-D)",
  alamatPenerima: (process.argv[2] === "KEDAH") ? [
    "(Pejabat Berdaftar / Registered Office)",
    "No. 1010-1012, Kompleks Sri Putra,",
    "Seberang Jalan Putra,",
    "05150 Alor Setar, Kedah.",
  ] : (process.argv[2] === "PEJABAT") ? [
    "(Tempat Perniagaan / Place of Business)",
    "PTD 209290, Jalan Kunyit,",
    "Taman Sri Amar,",
    "81100 Johor Bahru, Johor.",
  ] : [
    "(Pejabat Pengurusan)",
    "L13, Menara A, Pangsapuri Seri Permata,",
    "Jalan Kunyit, Taman Sri Amar,",
    "81100 Johor Bahru, Johor.",
  ],

  alamatHartanah: "Unit C-44-12 (#44-12), Tower C, Pangsapuri Seri Permata, Jalan Kunyit, Taman Sri Amar, 81100 Johor Bahru, Johor",
  jenisHartanah: "Pangsapuri (Unit C-44-12, Type B)",
  namaProyek: "Pangsapuri Seri Permata, Taman Sri Amar, Johor Bahru",

  noSPA: "JB.72500062",
  tarikhSPA: "22 Mac 2025",
  jenisSPA: "Jadual H",
  klausaPembaikan: "30(1)",
  klausaSerahan: "32(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "Oktober 2025",
  tarikhSerahanLaporan: "20 Oktober 2025",
  kaedahSerahanLaporan: "aplikasi Marvis pihak pemaju",

  tarikhReInspection: "29 September 2026",

  tarikhNotis: "5 Oktober 2026",
  tarikhDeadline: "20 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "2", lokasi: "Foyer — Door", kecacatan: "Cat mengelupas pada bingkai pintu (New Defect from Rectification Work — Peeling paint on door frame)", status: "Kecacatan Baru (Kerja Pembaikan)" },
    { tag: "3", lokasi: "Foyer — PVC Skirting", kecacatan: "Kesan kotoran pada PVC skirting masih ada (Stains on PVC skirting still observed — DF 1)", status: "Belum Dibaiki" },
    { tag: "5", lokasi: "Living & Dining — Floor", kecacatan: "Kesan kotoran pada PVC skirting masih ada (Stain on PVC skirting still observed — DFC 9)", status: "Belum Dibaiki" },
    { tag: "6", lokasi: "Living & Dining — Wall", kecacatan: "Kesan kotoran dan cat tidak sekata pada dinding masih ada (Stain and uneven painting still observed on wall — DFC 4)", status: "Belum Dibaiki" },
    { tag: "7", lokasi: "Living & Dining — Ceiling", kecacatan: "Cat tidak sekata pada siling masih ada (Uneven painting on ceiling still observed — DFC 5)", status: "Belum Dibaiki" },
    { tag: "8", lokasi: "Living & Dining — M&E", kecacatan: "Penandaan litar tidak sempurna pada distribution box masih ada (Improper tagging on distribution box for circuit still observed — DFC 8)", status: "Belum Dibaiki" },
    { tag: "9", lokasi: "Living & Dining — Sliding Door", kecacatan: "Rubber stopper tiada / tidak dipasang masih ada (Missing / not installed rubber stopper still observed — DFC 10)", status: "Belum Dibaiki" },
    { tag: "11", lokasi: "Kitchen — Wall", kecacatan: "Kesan kotoran pada dinding (New Defect from Rectification Work — Stain on wall)", status: "Kecacatan Baru (Kerja Pembaikan)" },
    { tag: "12", lokasi: "Kitchen — Window", kecacatan: "Calar pada tingkap (New Defect from Rectification Work — Scratch on window)", status: "Kecacatan Baru (Kerja Pembaikan)" },
    { tag: "13", lokasi: "Kitchen — Plumbing & Sanitary", kecacatan: "Sisa binaan di dalam floor trap masih ada (Construction leftover inside floor trap still observed — DFC 21)", status: "Belum Dibaiki" },
    { tag: "14", lokasi: "Kitchen — Fixtures", kecacatan: "Celahan ketara pada water tap (New Defect — Visible gap on water tap)", status: "Kecacatan Baru" },
    { tag: "16", lokasi: "Yard — Wall", kecacatan: "Hollowness pada dinding masih ada (Hollowness on wall still observed — DFC 26)", status: "Belum Dibaiki" },
    { tag: "17", lokasi: "Yard — Door", kecacatan: "Kesan kotoran dan karat pada tombol pintu masih ada (Stain and rusted doorknob still observed — DFC 29)", status: "Belum Dibaiki" },
    { tag: "19", lokasi: "Corridor — Floor", kecacatan: "Kesan kotoran pada PVC skirting masih ada (Stain on PVC skirting still observed — DFC 31)", status: "Belum Dibaiki" },
    { tag: "20", lokasi: "Corridor — Floor", kecacatan: "Chipping pada jubin lantai masih ada (Chipping on floor tiles still observed — DFC 32)", status: "Belum Dibaiki" },
    { tag: "22", lokasi: "Master Bedroom — Wall", kecacatan: "Permukaan dinding tidak sejajar dan tidak rata masih ada (Misaligned and uneven wall surface still observed — DFC 34)", status: "Belum Dibaiki" },
    { tag: "23", lokasi: "Master Bedroom — Wall", kecacatan: "Keretakan pada dinding (New Defect — Crack on wall)", status: "Kecacatan Baru" },
    { tag: "24", lokasi: "Master Bedroom — Ceiling", kecacatan: "Keretakan pada siling (New Defect — Crack on ceiling)", status: "Kecacatan Baru" },
    { tag: "25", lokasi: "Master Bedroom — M&E", kecacatan: "Titik lampu dan kipas mempunyai voltan rendah — bacaan L+E: 157V (New Defect — Light and fan point have low voltage)", status: "Kecacatan Baru" },
    { tag: "27", lokasi: "Master Bathroom — Floor", kecacatan: "Air bertakung pada jubin lantai masih ada (Stagnant water on floor tiles still observed — DFC 42)", status: "Belum Dibaiki" },
    { tag: "28", lokasi: "Master Bathroom — Wall", kecacatan: "Hollowness pada jubin dinding masih ada (Hollowness on wall tiles still observed — DFC 47)", status: "Belum Dibaiki" },
    { tag: "29", lokasi: "Master Bathroom — Door", kecacatan: "Celahan ketara sekeliling bingkai pintu (New Defect — Visible gaps around door frame)", status: "Kecacatan Baru" },
    { tag: "30", lokasi: "Master Bathroom — Door", kecacatan: "Penyendalan tidak sempurna antara bingkai pintu dan jubin lantai masih ada (Improper seal between door frame and floor tiles still observed — DFC 48)", status: "Belum Dibaiki" },
    { tag: "31", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Sisa binaan di dalam kedua-dua floor trap masih ada (Construction leftover inside both floor traps still observed — DFC 50)", status: "Belum Dibaiki" },
    { tag: "32", lokasi: "Master Bathroom — M&E", kecacatan: "Wire connector tiada (New Defect — Missing wire connector)", status: "Kecacatan Baru" },
    { tag: "33", lokasi: "Master Bathroom — Fixtures", kecacatan: "Celahan dan penyendalan tiada sekeliling basin stopper holder masih ada (Gaps and missing seal around basin stopper holder still observed — DFC 78)", status: "Belum Dibaiki" },
    { tag: "35", lokasi: "Bedroom 2 — Floor", kecacatan: "Kesan kotoran/perubahan warna pada grouting keseluruhan jubin lantai masih ada (Stains/discolouration on all floor tiles grouting still observed — DFC 52)", status: "Belum Dibaiki" },
    { tag: "36", lokasi: "Bedroom 2 — Wall", kecacatan: "Permukaan dinding tidak sejajar dan tidak rata masih ada (Misaligned and uneven wall surface still observed — DFC 53)", status: "Belum Dibaiki" },
    { tag: "37", lokasi: "Bedroom 2 — Window", kecacatan: "Kesan kotoran pada bingkai tingkap (luaran) masih ada (Stains on window frame, External — still observed, DFC 56)", status: "Belum Dibaiki" },
    { tag: "38", lokasi: "Bedroom 2 — Window", kecacatan: "Celahan ketara sekeliling bingkai tingkap (luaran) masih ada (Visible gaps around window frame, External — still observed, DFC 57)", status: "Belum Dibaiki" },
    { tag: "39", lokasi: "Bedroom 2 — M&E", kecacatan: "Titik lampu dan kipas mempunyai voltan rendah — bacaan L+E: 167V (New Defect — Light and fan point have low voltage)", status: "Kecacatan Baru" },
    { tag: "41", lokasi: "Bedroom 3 — Wall", kecacatan: "Keretakan pada dinding masih ada (Crack on wall still observed — DFC 61)", status: "Belum Dibaiki" },
    { tag: "42", lokasi: "Bedroom 3 — Wall", kecacatan: "Keretakan pada dinding (luaran) (New Defect — Crack on wall, External)", status: "Kecacatan Baru" },
    { tag: "43", lokasi: "Bedroom 3 — Ceiling", kecacatan: "Kesan kotoran pada siling masih ada (Stains on ceiling still observed — DFC 62)", status: "Belum Dibaiki" },
    { tag: "44", lokasi: "Bedroom 3 — M&E", kecacatan: "Titik lampu dan kipas mempunyai voltan rendah — bacaan L+E: 178V (New Defect — Light and fan point have low voltage)", status: "Kecacatan Baru" },
    { tag: "45", lokasi: "Bedroom 3 — PVC Skirting", kecacatan: "Kesan kotoran pada PVC skirting masih ada (Stains on PVC skirting still observed — DFC 64)", status: "Belum Dibaiki" },
    { tag: "47", lokasi: "Bathroom 2 — Floor", kecacatan: "Air bertakung pada jubin lantai masih ada (Stagnant water on floor tiles still observed — DFC 65)", status: "Belum Dibaiki" },
    { tag: "48", lokasi: "Bathroom 2 — Floor", kecacatan: "Chipping pada jubin lantai (New Defect from Rectification Work — Chipping on floor tiles)", status: "Kecacatan Baru (Kerja Pembaikan)" },
    { tag: "49", lokasi: "Bathroom 2 — Ceiling", kecacatan: "Kesan kotoran pada siling masih ada (Stain on ceiling still observed — DFC 68)", status: "Belum Dibaiki" },
    { tag: "50", lokasi: "Bathroom 2 — Door", kecacatan: "Kesan kotoran pada bingkai pintu (New Defect from Rectification Work — Stain on door frame)", status: "Kecacatan Baru (Kerja Pembaikan)" },
    { tag: "51", lokasi: "Bathroom 2 — Plumbing & Sanitary", kecacatan: "Sisa binaan di dalam floor trap masih ada (Construction leftover inside floor trap — DFC 73)", status: "Belum Dibaiki" },
    { tag: "52", lokasi: "Bathroom 2 — M&E", kecacatan: "Wire connector tiada pada titik lampu (New Defect — Missing wire connector on light point)", status: "Kecacatan Baru" },
    { tag: "53", lokasi: "Bathroom 2 — Fixtures", kecacatan: "Penyendalan tiada pada basin stopper holder (New Defect — Missing seal on basin stopper holder)", status: "Kecacatan Baru" },
    { tag: "55", lokasi: "Balcony (Master Bedroom) — Floor", kecacatan: "Jubin lantai masih tidak dipasang — KECACATAN MAJOR (Missing / uninstalled floor tiles still observed — Major Defect, DFC 39)", status: "Belum Dibaiki" },
    { tag: "56", lokasi: "Balcony (Master Bedroom) — Floor", kecacatan: "Kulat pada jubin lantai — KECACATAN MAJOR (New Defect — Moldy on floor tiles, Major Defect)", status: "Kecacatan Baru" },
    { tag: "57", lokasi: "Balcony (Master Bedroom) — Plumbing & Sanitary", kecacatan: "Floor trap tidak sejajar dengan paip dalaman (New Defect — Floor trap not aligned with internal pipe)", status: "Kecacatan Baru" },
    { tag: "58", lokasi: "Balcony (Master Bedroom) — Plumbing & Sanitary", kecacatan: "Kesan kotoran pada water down pipe masih ada (Stains on water down pipe still observed — DFC 41)", status: "Belum Dibaiki" },
    { tag: "59", lokasi: "Balcony (Master Bedroom) — Plumbing & Sanitary", kecacatan: "Kerja lepaan tidak sempurna di dalam floor trap masih ada (Improper plastering work inside floor trap still observed — DFC 40)", status: "Belum Dibaiki" },
    { tag: "60", lokasi: "Balcony (Master Bedroom) — M&E", kecacatan: "Lampu mempunyai voltan rendah — bacaan L+E: 131V (New Defect — Light have low voltage)", status: "Kecacatan Baru" },
    { tag: "62", lokasi: "Balcony (Living & Dining) — Floor", kecacatan: "Jubin lantai masih tidak dipasang — KECACATAN MAJOR (Missing / not installed floor tiles still observed — Major Defect, DFC 14)", status: "Belum Dibaiki" },
    { tag: "63", lokasi: "Balcony (Living & Dining) — Floor", kecacatan: "Hollowness pada jubin lantai masih ada (Hollowness on floor tiles still observed — DFC 13)", status: "Belum Dibaiki" },
    { tag: "64", lokasi: "Balcony (Living & Dining) — Ceiling", kecacatan: "Keretakan pada siling masih ada (Crack on ceiling still observed — DFC 16)", status: "Belum Dibaiki" },
    { tag: "65", lokasi: "Balcony (Living & Dining) — Plumbing & Sanitary", kecacatan: "Kedua-dua discharge pipe tersumbat (New Defect — Clogged inside both discharge pipes)", status: "Kecacatan Baru" },
  ],

  kronologi: [
    { tarikh: "22 Mac 2025", peristiwa: "Perjanjian Jual Beli (Sale and Purchase Agreement) ditandatangani — Jadual H (Ruj: JB.72500062), Unit C-44-12, Pangsapuri Seri Permata" },
    { tarikh: "20 Oktober 2025", peristiwa: "Laporan Pemeriksaan Kecacatan Kali Pertama dikemukakan secara rasmi melalui aplikasi Marvis pihak pemaju — merupakan notis bertulis di bawah Klausa 30(1)" },
    { tarikh: "19 November 2025", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 30(1) — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "30 Januari 2026", peristiwa: "Laporan Pemeriksaan Semula (kali kedua) dikemukakan melalui aplikasi Marvis — kecacatan masih belum diselesaikan" },
    { tarikh: "29 September 2026", peristiwa: "Pemeriksaan Ketiga (Third Inspection) oleh Building Surveyor berdaftar RISM — 53 kecacatan direkodkan: kecacatan lama masih belum selesai, kecacatan baru, dan kecacatan baru akibat kerja pembaikan" },
    { tarikh: "2 Oktober 2026", peristiwa: "Laporan Pemeriksaan Ketiga dikemukakan melalui aplikasi Marvis (submission kali ketiga)" },
    { tarikh: "5 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "20 Oktober 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  const fsz = SZ.TABLE;
  doc.setFontSize(fsz);

  function rowH(cells) {
    let mx = rlh + pad * 2;
    for (let c = 0; c < cells.length; c++) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(fsz);
      const ls = doc.splitTextToSize(String(cells[c]), colWidths[c] - pad * 2);
      const h = ls.length * rlh + pad * 2;
      if (h > mx) mx = h;
    }
    return mx;
  }

  function drawRow(cells, ry, rh, isH) {
    doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fsz); bk();
    let cx = mL;
    for (let c = 0; c < cells.length; c++) {
      doc.setLineWidth(0.3);
      doc.rect(cx, ry, colWidths[c], rh);
      const w = colWidths[c] - pad * 2;
      doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fsz); bk();
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

doc.text(data.tarikhNotis, pageW - mR, y - LH_S, { align: "right" });

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
const perkara1 = "Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim)";
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pembeli unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) bertarikh ${data.tarikhSPA} dengan rujukan ${data.noSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) ke atas hartanah tersebut dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pengemukaan tersebut merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}, dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
);
y += 4;

numPara(2,
  `Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada 19 November 2025 — iaitu HAMPIR SATU TAHUN yang lalu — kecacatan masih belum diselesaikan. Laporan Pemeriksaan Semula (kali kedua) telah dikemukakan melalui aplikasi Marvis pada 30 Januari 2026, namun pembaikan masih tidak disempurnakan. Pemeriksaan Ketiga (Third Inspection) yang dijalankan pada ${data.tarikhReInspection} oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM) seterusnya mengesahkan sejumlah LIMA PULUH TIGA (53) kecacatan — merangkumi kecacatan lama yang masih belum diselesaikan, kecacatan baru, dan kecacatan baru yang timbul akibat kerja pembaikan pihak tuan sendiri. Laporan Pemeriksaan Ketiga telah dikemukakan melalui aplikasi Marvis pada 2 Oktober 2026 dan turut disertakan bersama-sama notis ini. Senarai kecacatan tersebut adalah seperti berikut:`
);
y += 5;

checkBreak(45);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
y += 6;

const colW = [15, 40, 70, cW - 15 - 40 - 70];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Butiran penuh setiap kecacatan berserta gambar adalah sebagaimana terkandung di dalam Laporan Pemeriksaan Ketiga (3rd Inspection Report) bertarikh ${data.tarikhReInspection} yang disertakan bersama-sama notis ini, serta laporan-laporan terdahulu yang telah dikemukakan melalui aplikasi Marvis pada 20 Oktober 2025 dan 30 Januari 2026. Rujukan DFC merujuk kepada penomboran kecacatan asal di dalam laporan terdahulu.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada isu elektrik. Titik lampu dan kipas di EMPAT lokasi direkodkan mempunyai VOLTAN RENDAH yang serius — Master Bedroom (157V, item No. 25), Bedroom 2 (167V, item No. 39), Bedroom 3 (178V, item No. 44) dan Balcony Master Bedroom (131V, item No. 60) — berbanding voltan bekalan nominal 230V. Bacaan serendah ini menunjukkan masalah pendawaian yang serius, seperti sambungan yang longgar atau susut voltan berlebihan, yang boleh menyebabkan kerosakan peralatan elektrik, lampu/kipas tidak berfungsi dengan betul, pemanasan pada sambungan dan risiko kebakaran. Perhatian turut diberikan kepada item No. 32 dan No. 52 — wire connector yang TIADA pada sambungan di Master Bathroom dan Bathroom 2, iaitu sambungan wayar terdedah tanpa penyambung yang selamat. Siasatan punca dan pembetulan penuh oleh orang kompeten (competent person) yang berdaftar dengan Suruhanjaya Tenaga dituntut dengan segera, dan bukti penyiapan hendaklah dikemukakan kepada pemilik.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada KECACATAN MAJOR yang berulang: jubin lantai di Balcony (Master Bedroom) dan Balcony (Living and Dining) MASIH TIDAK DIPASANG sejak pemeriksaan pertama (item No. 55 — DFC 39; item No. 62 — DFC 14), dan kini kulat (mold) telah tumbuh pada lantai balkoni (item No. 56) — petanda pendedahan lembapan yang berpanjangan akibat kelewatan pihak tuan sendiri. Bagi sistem saliran: kedua-dua discharge pipe di Balcony (Living and Dining) didapati TERSUMBAT (item No. 65), floor trap tidak sejajar dengan paip dalaman (item No. 57), air bertakung pada lantai Master Bathroom dan Bathroom 2 (item No. 27 dan No. 47), dan sisa binaan masih berada di dalam floor trap di Kitchen, Master Bathroom dan Bathroom 2 (item No. 13, 31 dan 51) — kesemuanya dituntut dibaiki pada PUNCANYA, bukan sekadar pembersihan kosmetik. Selain itu, ditegaskan bahawa beberapa kecacatan baru adalah AKIBAT KERJA PEMBAIKAN pihak tuan sendiri (antaranya item No. 2, 11, 12, 48 dan 50 — New Defect from Rectification Work), dan kesemuanya wajib dibaiki sepenuhnya atas kos pihak tuan. Bagi kerja pembaikan yang telah siap, pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui e-mel (${data.emailPembeli}) atau WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan.`
);
y += 4;

numPara(5,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period).`
);
y += 4;

numPara(6,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan.`
);
y += 4;

numPara(7, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:");
y += 2;
bullet("Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
bullet("Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.");
y += 4;

numPara(8,
  `Merujuk kepada klausa Service of Documents (Klausa ${data.klausaSerahan} ${data.jenisSPA}) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const lT = "Peringatan Tindakan Undang-undang (Legal Action Notice)";
doc.text(lT, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(lT), y + 1);
y += 8;

numPara(9,
  `Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
y += 4;

checkBreak(46);
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

// ============================================================
// KRONOLOGI
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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
const outName = (process.argv[2] === "KEDAH") ? "NOTIS_1_GOJUNWEI_KEDAH.pdf" : (process.argv[2] === "PEJABAT") ? "NOTIS_1_GOJUNWEI_PEJABAT.pdf" : "NOTIS_1_GOJUNWEI.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
