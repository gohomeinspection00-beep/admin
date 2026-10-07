const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-2/2026/035",
  noRujukanNotis1: "NOTIS-1/2026/035",

  namaPembeli: "TEO GEOK YAN",
  alamatPengirim: [
    "A-162, Aurora Resort,",
    "Jalan Aurora Utama, Aurora Sentral,",
    "79100 Iskandar Puteri,",
    "Johor.",
  ],
  noKP: "970729-01-6582",
  telefonPembeli: "+65 8617 8812",
  emailPembeli: "gyteo97@gmail.com",

  namaPemaju: "COUNTRY VIEW RESOURCES SDN BHD",
  noSyarikat: "(200001021248 / 523855-A)",
  alamatPenerima: [
    "No. 26-01, Level 26, Mail Box 261,",
    "Menara Landmark, No. 12, Jalan Ngee Heng,",
    "80000 Johor Bahru,",
    "Johor.",
  ],

  alamatHartanah: "A-162, Aurora Resort, Jalan Aurora Utama, Aurora Sentral, 79100 Iskandar Puteri, Johor",
  jenisHartanah: "Rumah Intermediate (2,833 kaki persegi, Unit L247)",
  namaProyek: "Aurora Resort Villas, Fasa 1, Aurora Sentral",

  jenisSPA: "Perjanjian Jual Beli (SPA)",
  klausaPembaikan: "27",
  tempohDLP: "24",

  tarikhPemeriksaan1: "Julai 2025",
  tarikhSerahanLaporan: "1 dan 2 Julai 2025",
  kaedahSerahanLaporan: "aplikasi CVConnect",
  tarikhReInspection: "27 Ogos 2026",

  tarikhNotis: "8 Oktober 2026",
  tarikhDeadline: "23 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "40", lokasi: "Living & Dining — Ceiling", kecacatan: "Kebocoran pada permukaan siling masih ada (Leaking on ceiling surface still observed — bukti kamera termal)", status: "Belum Diselesaikan" },
    { tag: "159", lokasi: "Balcony — Wall", kecacatan: "Hollowness pada bahagian atas dinding masih ada (Hollowness on top of the wall still observed)", status: "Belum Diselesaikan" },
    { tag: "193", lokasi: "Bedroom 3 — Wall", kecacatan: "Kelembapan sederhana pada permukaan dinding masih ada (Medium moisture on wall surface still observed — bukti kamera termal)", status: "Belum Diselesaikan" },
    { tag: "233", lokasi: "Ceiling Area (Master Bedroom) — Wall", kecacatan: "Besi tetulang RC terdedah pada tiang masih ada (Exposed steel RC on column still observed)", status: "Belum Diselesaikan" },
    { tag: "238", lokasi: "Water Tank Area — Floor", kecacatan: "Air bertakung pada permukaan papak masih ada (Stagnant water on slab surface still observed)", status: "Belum Diselesaikan" },
    { tag: "244", lokasi: "Water Tank Area — Ceiling", kecacatan: "Kerosakan pada papan siling masih ada (Damaged on ceiling board still observed — Major defects)", status: "Belum Diselesaikan" },
    { tag: "245", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Tangki air masih dalam keadaan kotor dan perlu dibersihkan (Water tank in dirty condition still observed)", status: "Belum Diselesaikan" },
    { tag: "252", lokasi: "RC Flat Roof — Floor", kecacatan: "Keretakan pada papak lantai masih ada — keseluruhan lantai (Crack on floor slab still observed — All floor area)", status: "Belum Diselesaikan" },
  ],

  kronologi: [
    { tarikh: "1 & 2 Julai 2025", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan melalui aplikasi CVConnect — Defect 728811-2 dan 228839-3" },
    { tarikh: "Ogos 2025", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disempurnakan" },
    { tarikh: "27 Ogos 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — kecacatan masih belum diselesaikan" },
    { tarikh: "28 Ogos 2026", peristiwa: "8 kes kecacatan baharu diserahkan melalui aplikasi CVConnect (Defect 440028-4, 940037-5, 440046-6, 840052-7, 540067-8, 140075-9, 840083-10, 940098-11) — semua masih Pending" },
    { tarikh: "1 September 2026", peristiwa: "1 kes kecacatan tambahan diserahkan melalui aplikasi CVConnect (Defect 940157-12) — masih Pending" },
    { tarikh: "2 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan — Ruj. NOTIS-1/2026/035, dihantar melalui Pos Berdaftar AR" },
    { tarikh: "17 September 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari) — pembaikan masih tidak disempurnakan, tiada maklum balas rasmi" },
    { tarikh: "6 Oktober 2026", peristiwa: "Sebut harga rasmi pembaikan (Official Repair Quotation) No. GXS-RW-2026-00202605 berjumlah RM25,565.00 diperoleh daripada kontraktor berdaftar CIDB" },
    { tarikh: "8 Oktober 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan — Ruj. NOTIS-2/2026/035, bersama sebut harga rasmi pembaikan" },
    { tarikh: "23 Oktober 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
  ],

  salinanKepada: [
    {
      nama: "M/s K.H. KOH, AZHAR & KOH (Peguam Pemegang Wang Tahanan / Stakeholder)",
      alamat: ["Suite 25-03, Level 25, Menara Landmark,", "No. 12, Jalan Ngee Heng,", "80000 Johor Bahru, Johor."],
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
const perkara1 = "Notis Kedua / Notis Akhir (Final Notice) — Tuntutan Pembetulan Kecacatan";
const perkara1b = "(Defect Rectification Claim)";
const perkara2 = `Hartanah: ${data.jenisHartanah}`;
const perkara3 = `di ${data.alamatHartanah}`;
for (const pk of [perkara1, perkara1b, perkara2, perkara3]) {
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), merujuk kepada Notis Pertama — Tuntutan Pembetulan Kecacatan (First Notice) dengan rujukan ${data.noRujukanNotis1} bertarikh 2 September 2026 yang telah dihantar kepada pihak tuan melalui Pos Berdaftar Akuan Terima (AR), susulan Laporan Pemeriksaan Kecacatan yang dikemukakan melalui aplikasi CVConnect pada 1 dan 2 Julai 2025 (Defect 728811-2 dan 228839-3) selaras dengan Klausa ${data.klausaPembaikan} Perjanjian Jual Beli dan Seksyen 12(2) Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118]. Notis Pertama tersebut telah memberikan tempoh lima belas (15) hari kepada pihak tuan untuk menyiapkan semua kerja pembaikan, iaitu sehingga 17 September 2026.`
);
y += 4;

numPara(2,
  `Namun, tempoh Notis Pertama tersebut telah TAMAT pada 17 September 2026 tanpa sebarang pembaikan disempurnakan dan tanpa sebarang maklum balas rasmi daripada pihak tuan. Sehingga tarikh notis ini dikeluarkan, kecacatan yang dilaporkan masih belum diselesaikan, dan kesemua sembilan (9) kes kecacatan yang diserahkan melalui aplikasi CVConnect pada 28 Ogos 2026 dan 1 September 2026 masih berstatus Pending. Ini jelas menunjukkan kegagalan pihak tuan mematuhi Notis Pertama. Kecacatan yang masih wujud dan belum diselesaikan adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung dalam Laporan Re-Inspection bertarikh ${data.tarikhReInspection} serta 9 kes kecacatan di dalam aplikasi CVConnect (Defect 440028-4, 940037-5, 440046-6, 840052-7, 540067-8, 140075-9, 840083-10, 940098-11 & 940157-12).`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(6); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Untuk makluman pihak tuan, kes asal Defect 728811-2 dan 228839-3 telah ditandakan sebagai "Completed" di dalam sistem pihak tuan, sedangkan Pemeriksaan Semula pada ${data.tarikhReInspection} membuktikan kecacatan yang sama masih wujud dan belum dibaiki. Ini merupakan salah nyata status pembaikan. Sehubungan itu, saya menuntut agar sebarang kes kecacatan hanya ditutup selepas pembaikan disahkan oleh pemilik, dan penutupan kes secara unilateral tanpa pengesahan pemilik tidak akan diterima pakai.`
);
y += 4;

numPara(4,
  `Klausa ${data.klausaPembaikan} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam Tempoh Liabiliti Kecacatan (DLP — Defect Liability Period), dalam masa tiga puluh (30) hari selepas menerima notis bertulis daripada pembeli.`
);
y += 4;

numPara(5,
  `Dengan ini, saya mengeluarkan NOTIS KEDUA iaitu NOTIS AKHIR (FINAL NOTICE) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Tarikh tersebut merupakan TARIKH MUKTAMAD, dan tiada sebarang lanjutan masa akan diberikan selepasnya. Notis Kedua ini menjadikan keseluruhan tempoh tiga puluh (30) hari telah diperuntukkan kepada pihak tuan melalui kedua-dua notis, selaras dengan Klausa ${data.klausaPembaikan} Perjanjian Jual Beli.`
);
y += 4;

numPara(6,
  `Bagi makluman pihak tuan, saya telah pun memperoleh sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor berdaftar CIDB bagi kesemua kerja pembaikan yang masih tertunggak — Go Xpert Solution, No. Sebut Harga GXS-RW-2026-00202605 bertarikh 6 Oktober 2026 — dengan jumlah keseluruhan RM25,565.00 (Ringgit Malaysia: Dua Puluh Lima Ribu Lima Ratus Enam Puluh Lima Sahaja), merangkumi 18 item kerja termasuk kerja pembaikan elektrik oleh pendawai berdaftar, rawatan tetulang terdedah, kerja kalis air (waterproofing) dan pembaikan keretakan keseluruhan rumah. Salinan penuh sebut harga tersebut dilampirkan sebagai LAMPIRAN A. Sekiranya pihak tuan masih gagal menyiapkan semua kerja pembaikan dalam tempoh notis ini, jumlah tersebut atau kos sebenar yang ditanggung akan dituntut sepenuhnya daripada pihak tuan, termasuk melalui tolakan daripada Wang Tahanan lima peratus (5%) yang dipegang oleh peguam pemegang (stakeholder) dan/atau tuntutan di Tribunal Tuntutan Pembeli Rumah (TTPR).`
);
y += 4;

numPara(7, "Sekiranya pembaikan masih tidak disempurnakan selepas tarikh akhir MUKTAMAD tersebut, saya akan TANPA RUJUKAN LANJUT:");
y += 2;
bullet("Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan, kos pembaikan atau pampasan yang sewajarnya;");
bullet("Menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan lima peratus (5%) (Retention Sum) yang dipegang oleh peguam pemegang (stakeholder), M/s K.H. Koh, Azhar & Koh, selaras dengan Klausa 27 Perjanjian Jual Beli;");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
y += 4;

numPara(8,
  `Merujuk kepada klausa Service of Documents di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi. Notis ini dihantar melalui Pos Berdaftar Akuan Terima (AR) dan salinannya dimaklumkan kepada peguam pemegang wang tahanan (stakeholder) untuk makluman dan tindakan lanjut berhubung wang tahanan lima peratus (5%).`
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
  `Ini merupakan NOTIS TERAKHIR sebelum tindakan undang-undang dimulakan. Sebarang kegagalan pihak tuan mematuhi notis ini akan dijadikan bukti kegagalan dan keengganan pihak tuan di hadapan Tribunal Tuntutan Pembeli Rumah dan/atau mahkamah yang berbidang kuasa, dan segala kos yang ditanggung akibat kegagalan tersebut akan dituntut sepenuhnya daripada pihak tuan.`
);
y += 4;

para("Saya berharap pihak tuan mengambil tindakan segera dan muktamad terhadap Notis Kedua ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
y += 4;
para("Sekian.");
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
// LAMPIRAN A — SEBUT HARGA (5 muka)
// ============================================================
for (let qp = 1; qp <= 5; qp++) {
  newPage();
  y = 25;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
  const laT = qp === 1 ? "LAMPIRAN A" : "LAMPIRAN A (sambungan)";
  doc.text(laT, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(laT) / 2, y + 1, pageW / 2 + doc.getTextWidth(laT) / 2, y + 1);
  y += 5;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.FOOTNOTE);
  doc.text(`Sebut Harga Rasmi Pembaikan GXS-RW-2026-00202605 — muka ${qp} daripada 5`, pageW / 2, y, { align: "center" });
  y += 6;
  const qImg = "data:image/jpeg;base64," + fs.readFileSync(`/home/user/admin/teogy-quot-p${qp}.jpg`).toString("base64");
  const qW = 150, qH = 150 * 1521 / 1075;
  const qX = (pageW - qW) / 2;
  doc.addImage(qImg, "JPEG", qX, y, qW, qH);
  doc.setLineWidth(0.3); bk();
  doc.rect(qX, y, qW, qH);
}

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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Notis Kedua / Notis Akhir — Tuntutan Pembetulan Kecacatan (Final Notice — Defect Rectification Claim) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
fs.writeFileSync("/home/user/admin/NOTIS_2_TEOGEOKYAN.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_2_TEOGEOKYAN.pdf");
console.log(`Total pages: ${totalPages}`);
