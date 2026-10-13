const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-2/2026/037",
  noRujukanNotis1: "NOTIS-1/2026/037",

  namaPembeli: "LOO CHUN HUA",
  alamatPengirim: [
    "No. 72, Jalan Perwira 12,",
    "Taman Ungku Tun Aminah,",
    "81300 Skudai,",
    "Johor.",
  ],
  noKP: "960215-08-5127",
  telefonPembeli: "010-461 0373",
  emailPembeli: "Chunhualoo25@gmail.com",

  namaPemaju: "COUNTRY VIEW RESOURCES SDN BHD",
  noSyarikat: "(200001021248 / 523855-A)",
  alamatPenerima: [
    "No. 26-01, Level 26, Mail Box 261,",
    "Menara Landmark, No. 12, Jalan Ngee Heng,",
    "80000 Johor Bahru,",
    "Johor.",
  ],

  alamatHartanah: "No. B-199, Aurora Resort, Jalan Aurora Utama, Aurora Sentral, 79200 Iskandar Puteri, Johor",
  jenisHartanah: "Double Storey Link Villa (Lot 363, Geran 620694 Lot 210184, Mukim Pulai)",
  namaProyek: "Aurora Sentral Resort Villas, Iskandar Puteri",

  noSPA: "8428-24/eSPA/220623/363/01",
  tarikhSPA: "18 Julai 2023",
  klausaPembaikan: "27",

  tarikhPemeriksaan1: "18 Julai 2026",
  tarikhSerahanLaporan: "22 Julai 2026",
  kaedahSerahanLaporan: "aplikasi CVConnect",
  tarikhTamat30Hari: "21 Ogos 2026",

  tarikhNotis: "14 Oktober 2026",
  tarikhDeadline: "29 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "14", lokasi: "Carporch — Wall", kecacatan: "Isu alignment ketara pada permukaan dinding (Visible alignment issue on wall surface)", status: "Masih Belum Diselesaikan" },
    { tag: "20", lokasi: "Carporch — Wall", kecacatan: "Bunyi hollow dan keretakan pada bahagian atas pagar dinding dan tiang (Hollow sound and crack on top wall fencing and pillar)", status: "Masih Belum Diselesaikan" },
    { tag: "22", lokasi: "Carporch — Wall", kecacatan: "Kerosakan dan corner bead terdedah pada dinding bercat (Damage and exposed corner bead on painted wall — Major defects)", status: "Masih Belum Diselesaikan" },
    { tag: "23", lokasi: "Carporch — Wall", kecacatan: "Bunyi hollow pada dinding bercat (Hollow sound on painted wall)", status: "Masih Belum Diselesaikan" },
    { tag: "29", lokasi: "Carporch — Plumbing & Sanitary", kecacatan: "Keretakan pada permukaan dalam manhole (Crack inside manhole surface)", status: "Masih Belum Diselesaikan" },
    { tag: "33", lokasi: "Carporch — Plumbing & Sanitary", kecacatan: "Sistem saliran tidak sempurna — sisa binaan di dalam manhole dan kemungkinan air bertakung (Poor Drainage System — construction leftover inside manhole and possible water stagnant)", status: "Masih Belum Diselesaikan" },
    { tag: "34", lokasi: "Carporch — Plumbing & Sanitary", kecacatan: "Sistem saliran tidak sempurna — sisa binaan di dalam manhole (Poor Drainage System — construction leftover inside manhole)", status: "Masih Belum Diselesaikan" },
    { tag: "346", lokasi: "Water Tank Area — Fixtures", kecacatan: "Air bertakung pada besi (Water stagnant on steel — Alignment issue)", status: "Masih Belum Diselesaikan" },
    { tag: "347", lokasi: "Water Tank Area — Fixtures", kecacatan: "Penutup tangki air tidak dapat ditutup sepenuhnya (Water tank cover cannot closed fully)", status: "Masih Belum Diselesaikan" },
    { tag: "356", lokasi: "Flat Roof — Skylight Roof", kecacatan: "Keretakan pada kaca bumbung skylight (Crack on skylight roof glass — Major defects)", status: "Masih Belum Diselesaikan" },
    { tag: "370", lokasi: "Flat Roof (Rear) — Floor", kecacatan: "Mutu kerja lemah pada papak penjuru — angle filler perlu dibuat konsisten (Poor workmanship at corner slab — Jointing issue)", status: "Masih Belum Diselesaikan" },
    { tag: "371", lokasi: "Flat Roof (Rear) — Wall", kecacatan: "Keretakan pada parapet wall (Crack on parapet wall)", status: "Masih Belum Diselesaikan" },
    { tag: "374", lokasi: "Top Roof — Wall", kecacatan: "Keseluruhan party wall mengalami cat mengelupas dan keretakan (All of party wall have peeling paint and crack)", status: "Masih Belum Diselesaikan" },
  ],

  kronologi: [
    { tarikh: "18 Julai 2023", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani" },
    { tarikh: "18 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "22 Julai 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju melalui aplikasi CVConnect" },
    { tarikh: "21 Ogos 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum dilaksanakan" },
    { tarikh: "3 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan — Ruj. NOTIS-1/2026/037" },
    { tarikh: "5 September 2026", peristiwa: "Notis Pertama dihantar melalui Pos Berdaftar Akuan Terima (AR) No. RW193876515MY" },
    { tarikh: "18 September 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari) — pembaikan masih tidak disempurnakan" },
    { tarikh: "23 September 2026", peristiwa: "Notis Pertama DITERIMA oleh pihak pemaju — diakui oleh Puan Norfarhana dengan tandatangan dan cop rasmi syarikat (rujuk Lampiran A)" },
    { tarikh: "24 September 2026", peristiwa: "Wakil pemaju MENGAKUI secara bertulis melalui WhatsApp rasmi bahawa 342 kecacatan telah pending melebihi 60 hari, memohon maaf atas kelewatan, dan mempelawa sebut harga kontraktor pihak ketiga di bawah Klausa 30(2) (rujuk Lampiran B)" },
    { tarikh: "14 Oktober 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan — Ruj. NOTIS-2/2026/037" },
    { tarikh: "29 Oktober 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (Jadual H, Akta Pemajuan Perumahan 1966) bertarikh ${data.tarikhSPA} (No. Rujukan SPA: ${data.noSPA}), merujuk kepada Notis Pertama — Tuntutan Pembetulan Kecacatan (First Notice) dengan rujukan ${data.noRujukanNotis1} bertarikh 3 September 2026 yang telah dihantar kepada pihak tuan melalui Pos Berdaftar Akuan Terima (AR) No. RW193876515MY pada 5 September 2026 dan telah DITERIMA oleh pihak tuan pada 23 September 2026 — diakui terima oleh wakil pihak tuan, Puan Norfarhana, dengan tandatangan dan cop rasmi syarikat pada kad Akuan Terima (AR) Pos Malaysia (dilampirkan sebagai Lampiran A) — susulan Laporan Pemeriksaan Kecacatan yang dikemukakan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan} (342 kecacatan) selaras dengan Klausa 30(1) Jadual H dan Seksyen 12(2) Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118]. Notis Pertama tersebut telah memberikan tempoh lima belas (15) hari kepada pihak tuan, iaitu sehingga 18 September 2026.`
);
y += 4;

numPara(2,
  `Namun, tempoh Notis Pertama tersebut telah TAMAT pada 18 September 2026 tanpa semua pembaikan disempurnakan, dan sehingga tarikh notis ini dikeluarkan, kecacatan yang dilaporkan masih belum diselesaikan. Ini jelas menunjukkan kegagalan pihak tuan mematuhi Notis Pertama. Antara kecacatan yang masih wujud dan belum diselesaikan adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Kesemua 342 kecacatan yang diserahkan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan} — yang diakui sendiri oleh pihak tuan sebagai tertunggak melebihi 60 hari — kekal dituntut sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(6); doc.text(f, mL, y); y += 4.5; }
y += 5;



numPara(3,
  `Perlu dirakamkan bahawa pada 24 September 2026, wakil pihak tuan sendiri, melalui akaun WhatsApp perniagaan rasmi pihak tuan (+60 11-6099 2742), telah MENGAKUI secara bertulis bahawa kesemua 342 kecacatan yang diserahkan pada 22 Julai 2026 telah berstatus tertunggak ("pending") selama MELEBIHI 60 HARI, memohon maaf di atas kelewatan proses pembaikan, dan mempelawa pemilik mengemukakan sebut harga kontraktor pihak ketiga selaras dengan Klausa 30(2) Perjanjian Jual Beli untuk semakan dan pertimbangan pihak tuan (salinan perbualan dilampirkan sebagai Lampiran B). Pengakuan bertulis ini mengesahkan kegagalan pihak tuan melaksanakan kewajipan pembaikan di bawah Klausa 30(1). Selaras dengan pelawaan pihak tuan sendiri, sebut harga rasmi daripada kontraktor berdaftar sedang diperoleh dan akan dikemukakan; segala kos pembaikan tersebut akan dituntut sepenuhnya daripada pihak tuan, termasuk melalui tolakan daripada Wang Tahanan lima peratus (5%) yang dipegang oleh peguam pemegang (stakeholder) di bawah Klausa 30(2) Jadual H.`
);
y += 4;

numPara(4,
  `Dengan ini, saya mengeluarkan NOTIS KEDUA iaitu NOTIS AKHIR (FINAL NOTICE) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Tarikh tersebut merupakan TARIKH MUKTAMAD, dan tiada sebarang lanjutan masa akan diberikan selepasnya.`
);
y += 4;

numPara(5, "Sekiranya pembaikan masih tidak disempurnakan selepas tarikh akhir MUKTAMAD tersebut, saya akan TANPA RUJUKAN LANJUT:");
y += 2;
bullet("Memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 untuk mendapatkan perintah pembaikan, kos pembaikan atau pampasan yang sewajarnya;");
bullet("Menuntut supaya kos pembaikan ditolak/ditahan daripada Wang Tahanan lima peratus (5%) (Retention Sum) yang dipegang oleh peguam pemegang (stakeholder), M/s K.H. Koh, Azhar & Koh, selaras dengan Klausa 30(2) Jadual H Perjanjian Jual Beli;");
bullet("Mengemukakan aduan rasmi kepada Kementerian Perumahan dan Kerajaan Tempatan (KPKT) serta pihak berkuasa berkaitan; dan/atau");
bullet("Mengambil apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118).");
y += 4;

numPara(6,
  `Klausa 30(1) Jadual H Perjanjian Jual Beli memperuntukkan bahawa apa-apa kecacatan, pengecutan atau kerosakan lain yang menjadi ketara dalam tempoh dua puluh empat (24) bulan selepas pembeli mengambil milikan kosong, yang disebabkan oleh mutu kerja atau bahan yang cacat, hendaklah dibaiki oleh pemaju atas kos dan belanjanya sendiri dalam masa tiga puluh (30) hari selepas menerima notis bertulis daripada pembeli.`
);
y += 4;

numPara(7,
  `Merujuk kepada Klausa 32(1) (Service of Documents) Jadual H Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi. Notis ini dihantar melalui Pos Berdaftar Akuan Terima (AR) dan salinannya dimaklumkan kepada peguam pemegang wang tahanan (stakeholder) untuk makluman dan tindakan lanjut berhubung wang tahanan lima peratus (5%).`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const lT = "Peringatan Tindakan Undang-undang (Legal Action Notice)";
doc.text(lT, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(lT), y + 1);
y += 8;

numPara(8,
  `Ini merupakan NOTIS TERAKHIR sebelum tindakan undang-undang dimulakan. Sebarang kegagalan pihak tuan mematuhi notis ini akan dijadikan bukti kegagalan dan keengganan pihak tuan di hadapan Tribunal Tuntutan Pembeli Rumah dan/atau mahkamah yang berbidang kuasa — termasuk pengakuan bertulis pihak tuan sendiri di Lampiran B — dan segala kos yang ditanggung akibat kegagalan tersebut akan dituntut sepenuhnya daripada pihak tuan`
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
// LAMPIRAN A & B
// ============================================================
function lampPage(title, sub, img, w, h, cap) {
  newPage();
  y = 25;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
  doc.text(title, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(title) / 2, y + 1, pageW / 2 + doc.getTextWidth(title) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text(sub, pageW / 2, y, { align: "center" });
  y += 8;
  const imgData = "data:image/jpeg;base64," + fs.readFileSync(img).toString("base64");
  const x = (pageW - w) / 2;
  doc.addImage(imgData, "JPEG", x, y, w, h);
  doc.setLineWidth(0.3); bk();
  doc.rect(x, y, w, h);
  y += h + 5;
  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
  const cl = doc.splitTextToSize(cap, cW - 20);
  for (const c of cl) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.5; }
}

lampPage("LAMPIRAN A", "Bukti Penghantaran & Penerimaan Notis Pertama (Pos Berdaftar AR)",
  "/home/user/admin/loo-ar.jpg", 120, 120 * 1280 / 960,
  "Kad Akuan Terima (AR) Pos Malaysia No. RW193876515MY — Notis Pertama (Ruj: NOTIS-1/2026/037) diposkan pada 5 September 2026 kepada Country View Resources Sdn Bhd dan DITERIMA pada 23 September 2026, diakui oleh Puan Norfarhana dengan tandatangan dan cop rasmi syarikat, disahkan oleh Penyelia Serahan Pos Malaysia.");

lampPage("LAMPIRAN B", "Pengakuan Bertulis Pihak Pemaju (WhatsApp Rasmi, 24 September 2026)",
  "/home/user/admin/loo-whatsapp.jpg", 85, 85 * 1280 / 589,
  'Perbualan WhatsApp daripada akaun perniagaan rasmi pihak pemaju (+60 11-6099 2742) pada 24 September 2026 — mengakui 342 kecacatan yang diserahkan pada 22 Julai 2026 telah tertunggak ("pending for more than 60 days"), memohon maaf atas kelewatan, dan mempelawa sebut harga kontraktor pihak ketiga di bawah Klausa 30(2) SPA.');

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
fs.writeFileSync("/home/user/admin/NOTIS_2_LOO.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_2_LOO.pdf");
console.log(`Total pages: ${totalPages}`);
