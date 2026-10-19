const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/058",

  namaPembeli: "NUR ZARIFAHANA BINTI ISA",
  alamatPengirim: [
    "A-05-02, Pangsapuri Laman Indah, Blok A,",
    "Laman Indah, Taman Laman Indah,",
    "81110 Johor Bahru,",
    "Johor.",
  ],
  noKP: "890707-01-5474",
  telefonPembeli: "013-216 8801",
  emailPembeli: "nurzarifahana@gmail.com",

  namaPemaju: "PERBADANAN PENGURUSAN PANGSAPURI LAMAN INDAH",
  noSyarikat: "(PTG01817)",
  alamatPenerima: [
    "A-01-04 (Pejabat Pengurusan),",
    "Pangsapuri Laman Indah, Taman Laman Indah,",
    "81110 Johor Bahru,",
    "Johor.",
  ],
  kontakPenerima: "Tel: +6011 6566 8992   E-mel: pkjb.management@gmail.com",

  alamatHartanah: "A-05-02, Pangsapuri Laman Indah, Blok A, Laman Indah, Taman Laman Indah, 81110 Johor Bahru, Johor (Lot 172257, GM 2876, Mukim Pulai)",
  jenisHartanah: "Unit Pangsapuri (Apartment) — Unit 05-02",
  namaProyek: "Laman Indah 1 — Johor Bahru",
  namaPemajuSPA: "ECO BOTANIC SDN. BHD. (201301037050 / 1066879-M)",

  noSPA: "EB/PKJ/JY/NS/404/2301",
  tarikhSPA: "18 Januari 2023",
  jenisSPA: "Jadual H",
  klausaPembaikan: "30(1)",
  klausaSerahan: "32(1)",
  tempohDLP: "24",

  tarikhNotis: "19 Oktober 2026",
  tarikhDeadline: "3 November 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "1", lokasi: "Kitchen — Dinding", kecacatan: "Dinding tidak sejajar — masih ada (Alignment issue on wall, still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "2", lokasi: "Kitchen — Dinding", kecacatan: "Dinding tidak sejajar — masih ada (Wall misaligned, still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "3", lokasi: "Kitchen — Dinding", kecacatan: "Dinding tidak sejajar — masih ada (Still have alignment issue on wall)", status: "Masih Belum Diselesaikan" },
    { tag: "4", lokasi: "Kitchen — Dinding", kecacatan: "Dinding masih tidak sejajar (Wall still misaligned)", status: "Masih Belum Diselesaikan" },
    { tag: "5", lokasi: "Kitchen — M&E", kecacatan: "Isu pemasangan pada titik lampu — menyukarkan pemasangan lampu oleh pemilik (Installation issue at lighting point — may make it difficult for owner to install lamp)", status: "Masih Belum Diselesaikan" },
    { tag: "6", lokasi: "Yard — Pintu", kecacatan: "Bahagian bawah pintu masih tidak dicat sepenuhnya (Bottom of door still not fully painted — Finishing issue)", status: "Masih Belum Diselesaikan" },
    { tag: "7", lokasi: "Master Bedroom — Dinding", kecacatan: "Berongga dengan keretakan pada dinding bercat SELEPAS kerja pembaikan (Hollow with crack on painted wall after rectification work — new defect arising from rectification)", status: "Masih Belum Diselesaikan" },
    { tag: "8", lokasi: "Master Bathroom — Siling", kecacatan: "Karat pada rangka siling masih ada (Rusty on ceiling frame, still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "9", lokasi: "Bedroom 2 — Lantai", kecacatan: "Keretakan dengan bunyi berongga pada papak masih ada (Crack with hollow sound on slab, still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "10", lokasi: "Bedroom 2 — Lantai", kecacatan: "Bunyi berongga pada papak masih ada (Hollow sound on slab, still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "11", lokasi: "Bedroom 2 — Dinding", kecacatan: "Dinding masih tidak sejajar (Misaligned wall, still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "12", lokasi: "Bedroom 3 — Lantai", kecacatan: "Keretakan dengan bunyi berongga pada papak masih ada (Crack with hollow sound on slab, still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "13", lokasi: "Bedroom 3 — Lantai", kecacatan: "Bunyi berongga pada papak masih ada (Hollow sound on slab, still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "14", lokasi: "Bedroom 3 — Dinding", kecacatan: "Dinding masih tidak sejajar (Wall still misaligned)", status: "Masih Belum Diselesaikan" },
    { tag: "15", lokasi: "Bathroom 2 — Dinding", kecacatan: "Dinding beralun dan tidak sejajar masih ada (Wavy and misaligned wall, still observed)", status: "Masih Belum Diselesaikan" },
    { tag: "16", lokasi: "Bathroom 2 — Fixtures", kecacatan: "Penyendal (seal) pada basin tiada (Missing seal on basin — Jointing issue)", status: "Masih Belum Diselesaikan" },
    { tag: "17", lokasi: "Balcony — Lantai", kecacatan: "Keretakan pada papak lantai SELEPAS kerja pembaikan (Crack on floor slab after rectification work — new defect arising from rectification)", status: "Masih Belum Diselesaikan" },
  ],

  kronologi: [
    { tarikh: "18 Januari 2023", peristiwa: "Perjanjian Jual Beli (Sale and Purchase Agreement, Jadual H) ditandatangani dengan ECO BOTANIC SDN. BHD. — Laman Indah 1 (Ruj. fail: EB/PKJ/JY/NS/404/2301)" },
    { tarikh: "12 April 2025", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan oleh Surveyor Bangunan Berdaftar (RISM)" },
    { tarikh: "25 Mei 2025", peristiwa: "Laporan Pemeriksaan Kecacatan Pertama diserahkan kepada pihak pengurusan" },
    { tarikh: "4 Julai 2025", peristiwa: "Pihak pengurusan/pemaju memaklumkan kerja pembaikan telah selesai" },
    { tarikh: "9 Mei 2026", peristiwa: "Pemeriksaan Kali Kedua (Second Inspection) — kecacatan didapati BERULANG di lokasi yang sama selepas lebih kurang 13 bulan, dan sebahagiannya semakin bertambah" },
    { tarikh: "21 Mei 2026", peristiwa: "Surat rasmi beserta Laporan Pemeriksaan Kedua diserahkan secara serahan tangan ke Pejabat Pengurusan Laman Indah — merupakan notis bertulis di bawah Klausa 30(1) Jadual H (tempoh pembaikan 30 hari)" },
    { tarikh: "20 Jun 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan — pembaikan masih belum diselesaikan" },
    { tarikh: "7 Julai 2026", peristiwa: "Semakan oleh pemilik — kebanyakan kecacatan masih belum disiapkan" },
    { tarikh: "11 Julai 2026", peristiwa: "Pemeriksaan Kali Ketiga (Third Inspection / Re-Inspection) dijalankan" },
    { tarikh: "17 Julai 2026", peristiwa: "Laporan Pemeriksaan Ketiga diserahkan kepada pihak pengurusan" },
    { tarikh: "5 Oktober 2026", peristiwa: "Pemeriksaan Kali Keempat (Fourth Inspection) dijalankan — SEMUA 17 kecacatan direkodkan masih belum diselesaikan (100% Not Complete)" },
    { tarikh: "19 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "3 November 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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

doc.setFontSize(SZ.SMALL);
doc.text(data.kontakPenerima, mL, y); y += LH_S;

y += 3;

doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukan}`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan/Puan,", mL, y);
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik berdaftar unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) bertarikh ${data.tarikhSPA} dengan pemaju ${data.namaPemajuSPA} (Ruj. fail: ${data.noSPA}). Unit saya masih berada di dalam tempoh Defect Liability Period (DLP) selama ${data.tempohDLP} bulan di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}. Pemeriksaan Kecacatan Kali Pertama telah dijalankan oleh Surveyor Bangunan Berdaftar (RISM) pada 12 April 2025 dan laporannya diserahkan kepada pihak tuan/puan pada 25 Mei 2025; pihak tuan/puan telah memaklumkan kerja pembaikan selesai pada 4 Julai 2025.`
);
y += 4;

numPara(2,
  `Namun, Pemeriksaan Kali Kedua pada 9 Mei 2026 mendapati kecacatan BERULANG di lokasi yang sama selepas lebih kurang tiga belas (13) bulan, dan sebahagiannya semakin bertambah teruk. Surat rasmi beserta Laporan Pemeriksaan Kedua telah diserahkan secara serahan tangan ke Pejabat Pengurusan pada 21 Mei 2026 — merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA} dengan tempoh pembaikan tiga puluh (30) hari yang telah tamat pada 20 Jun 2026. Pemeriksaan Kali Ketiga (11 Julai 2026, laporan diserahkan 17 Julai 2026) dan seterusnya Pemeriksaan Kali Keempat pada 5 Oktober 2026 mengesahkan bahawa KESEMUA TUJUH BELAS (17) kecacatan yang direkodkan masih belum diselesaikan — 100% berstatus "Not Complete". Senarai kecacatan tersebut adalah seperti berikut:`
);
y += 5;

checkBreak(45);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
y += 6;

const colW = [12, 40, 73, cW - 12 - 40 - 73];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = `*Senarai di atas adalah berdasarkan Laporan Pemeriksaan terkini (status pada 5 Oktober 2026) oleh Surveyor Bangunan Berdaftar (RISM). Butiran penuh beserta gambar adalah sebagaimana di dalam laporan tersebut, dan kesemuanya hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus diberikan kepada kluster ketidaksejajaran dinding (wall alignment) — item No. 1 hingga 4 (Kitchen, EMPAT titik berasingan), No. 11 (Bedroom 2), No. 14 (Bedroom 3) dan No. 15 (Bathroom 2, dinding beralun). Kecacatan ini telah direkodkan seawal Laporan Pertama pada 12 April 2025, didakwa telah dibaiki pada 4 Julai 2025, namun BERULANG di lokasi yang sama dalam setiap pemeriksaan berikutnya — bukti jelas bahawa kaedah pembaikan yang digunakan tidak menyelesaikan punca dan tidak mengikut amalan pembinaan yang baik. Pembaikan semula hendaklah dilakukan secara menyeluruh (bukan tampalan kosmetik) dan disahkan dengan ukuran.`
);
y += 4;

numPara(4,
  `Lebih membimbangkan, item No. 7 (berongga dengan keretakan pada dinding bercat Master Bedroom) dan item No. 17 (keretakan pada papak lantai Balcony) adalah kecacatan BARU yang timbul DARIPADA kerja pembaikan pihak tuan/puan sendiri (new defects arising from rectification work). Ini menunjukkan kualiti kerja pembaikan yang tidak memuaskan dan menambahkan lagi kerosakan kepada unit. Begitu juga kluster berongga dan keretakan pada papak lantai — item No. 9, 10 (Bedroom 2) dan No. 12, 13 (Bedroom 3) — yang hendaklah dibaiki dengan kaedah hack dan skrid semula mengikut amalan pembinaan yang baik.`
);
y += 4;

numPara(5,
  `Bagi item No. 5 (isu pemasangan pada titik lampu Kitchen): sekiranya pihak tuan/puan mendakwa keadaan tersebut adalah mengikut reka bentuk asal atau di dalam had toleransi, pihak tuan/puan dituntut mengemukakan dokumen rasmi (official documentation) — lukisan reka bentuk yang diluluskan atau spesifikasi — sebagai bukti; jika tidak, ia hendaklah dibetulkan supaya tidak menyukarkan pemasangan lampu oleh pemilik. Item No. 8 (karat pada rangka siling Master Bathroom) hendaklah dirawat atau diganti bagi mengelakkan merebak; dan item No. 16 (penyendal/seal basin yang tiada di Bathroom 2) hendaklah dipasang bagi mengelakkan resapan air ke dalam struktur.`
);
y += 4;

numPara(6,
  `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah dalam tempoh ${data.tempohDLP} bulan selepas penyerahan milikan kosong hendaklah dibaiki dan diperbetulkan dalam tempoh tiga puluh (30) hari selepas penerimaan notis bertulis, atas kos dan belanja pihak yang bertanggungjawab sendiri.`
);
y += 4;

numPara(7,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan/puan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan untuk menyelesaikan semua kerja pembaikan.`
);
y += 4;

numPara(8, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:");
y += 2;
bullet("Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan/puan, pemaju dan pihak berkepentingan (stakeholders);");
bullet("Memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) dan/atau mengeskalasikan perkara ini kepada Pejabat Pengawal Perumahan, KPKT, atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.");
y += 4;

numPara(9,
  `Merujuk kepada klausa Service of Documents (Klausa ${data.klausaSerahan} ${data.jenisSPA}) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const lT = "Peringatan Tindakan Undang-undang (Legal Action Notice)";
doc.text(lT, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(lT), y + 1);
y += 8;

numPara(10,
  `Sekiranya pihak tuan/puan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya.`
);
y += 4;

para("Saya berharap pihak tuan/puan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian diucapkan ribuan terima kasih.");
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
  const t = "AKUAN TERIMA";
  doc.text(t, pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth(t) / 2, y + 1, pageW / 2 + doc.getTextWidth(t) / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
  doc.text("(Acknowledgement of Receipt)", pageW / 2, y, { align: "center" });
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
  doc.text("Cop Pejabat (Office Stamp):", mL, y);
  y += 5;
  doc.setLineWidth(0.3); doc.rect(mL, y, 60, 35);
}

drawAkuanTerima("Salinan Pejabat Pengurusan (Management's Copy)");
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
fs.writeFileSync("/home/user/admin/NOTIS_1_NURZARIFAHANA.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_NURZARIFAHANA.pdf");
console.log(`Total pages: ${totalPages}`);
