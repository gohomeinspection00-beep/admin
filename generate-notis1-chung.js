const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/060",

  namaPembeli: "CHUNG SIEW HOOI",
  alamatPengirim: [
    "No. 20, Jalan Perjiranan 12/1,",
    "Bandar Dato' Onn,",
    "81100 Johor Bahru,",
    "Johor.",
  ],
  noKP: "960116-01-5780",
  telefonPembeli: "014-980 8023",
  emailPembeli: "chungsiewhooi@gmail.com",

  namaPemaju: "JOHOR LAND BERHAD",
  noSyarikat: "(197201000788 / 12379-K)",
  alamatPenerima: [
    "83, Jalan Perjiranan 15/1,",
    "Perjiranan 15, Bandar Dato' Onn,",
    "81100 Johor Bahru,",
    "Johor.",
  ],

  alamatHartanah: "No. 14, Jalan Perjiranan 8/17, Perjiranan 8, Bandar Dato' Onn, 81100 Johor Bahru, Johor (HS(D) 574964, PTD 189509, Mukim Tebrau)",
  jenisHartanah: "Rumah Teres 2 Tingkat (Double Storey Terrace House — CANNA 3)",
  namaProyek: "Perjiranan 8, Fasa 3 — Bandar Dato' Onn, Johor Bahru",

  noSPA: "IKSA/SPA/JL(BDO-CANNA3)/44801(06)/24-NR",
  tarikhSPA: "16 Mei 2024",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "30 September 2026",
  tarikhSerahanLaporan: "5 Oktober 2026",
  kaedahSerahanLaporan: "aplikasi pihak pemaju (Kita)",
  tarikhTamat30: "4 November 2026",

  tarikhNotis: "25 Oktober 2026",
  tarikhDeadline: "4 November 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "270", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Tiada sokongan yang sempurna pada distribution pipe yang disambung ke tangki air (Missing proper support for distribution pipe connected to water tank — Accessories defects)", status: "Belum Dibaiki" },
    { tag: "271", lokasi: "Water Tank Area — Fixtures", kecacatan: "Tangki air dalam keadaan kotor dan perlu dibersihkan (Water tank on dirty condition, need to be cleaned)", status: "Belum Dibaiki" },
    { tag: "272", lokasi: "Water Tank Area — Fixtures", kecacatan: "Pemasangan insulation sheet tidak sempurna (Improper installation of insulation sheet)", status: "Belum Dibaiki" },
    { tag: "276", lokasi: "Flat Roof (Top Roof) — Lantai", kecacatan: "Tanda air bertakung pada papak lantai (Sign of stagnant water on floor slab — Alignment issue)", status: "Belum Dibaiki" },
    { tag: "277", lokasi: "Flat Roof (Top Roof) — Lantai", kecacatan: "Keretakan pada papak lantai — keseluruhan kawasan lantai (Crack on floor slab, all floor area)", status: "Belum Dibaiki" },
    { tag: "280", lokasi: "AC Ledge (Top Roof) — Lantai", kecacatan: "Tanda air bertakung (Sign of stagnant water — Alignment issue)", status: "Belum Dibaiki" },
    { tag: "281", lokasi: "AC Ledge (Top Roof) — Lantai", kecacatan: "Keretakan pada papak lantai — keseluruhan kawasan lantai (Crack on floor slab, all floor area)", status: "Belum Dibaiki" },
    { tag: "282", lokasi: "AC Ledge (Top Roof) — Dinding", kecacatan: "Keretakan dan corner bead terdedah pada dinding (Crack and exposed corner bead on wall)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "16 Mei 2024", peristiwa: "Perjanjian Jual Beli (Sale and Purchase Agreement) ditandatangani — CANNA 3, Perjiranan 8 Fasa 3, Bandar Dato' Onn (Ruj: IKSA/SPA/JL(BDO-CANNA3)/44801(06)/24-NR)" },
    { tarikh: "30 September 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (Full House Inspection) dijalankan ke atas hartanah" },
    { tarikh: "5 Oktober 2026", peristiwa: "Laporan Pemeriksaan Kecacatan dikemukakan secara rasmi melalui aplikasi pihak pemaju (Kita) — merupakan notis bertulis di bawah Klausa 27(1); tempoh pembaikan 30 hari bermula" },
    { tarikh: "25 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan — peringatan agar semua pembaikan disiapkan dalam baki tempoh 30 hari" },
    { tarikh: "4 November 2026", peristiwa: "TARIKH AKHIR — tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1)" },
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
  `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) bertarikh ${data.tarikhSPA} dengan rujukan ${data.noSPA}, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada ${data.tarikhPemeriksaan1} dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}. Pengemukaan tersebut merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}, dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
);
y += 4;

numPara(2,
  `Tempoh tiga puluh (30) hari tersebut sedang berjalan dan akan TAMAT pada ${data.tarikhTamat30}. Notis Pertama ini dikeluarkan sebagai PERINGATAN RASMI agar pihak tuan menyelaraskan dan menyiapkan SEMUA kerja pembaikan dalam baki tempoh tersebut, memandangkan sehingga tarikh notis ini dikeluarkan kecacatan yang dilaporkan masih belum diselesaikan. Antara kecacatan yang dilaporkan adalah seperti berikut:`
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
const fn = `*Senarai di atas bukanlah senarai penuh. Senarai penuh kecacatan adalah sebagaimana direkodkan di dalam Laporan Pemeriksaan Kecacatan yang telah dikemukakan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}, dan kesemuanya hendaklah dibaiki sepenuhnya.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus diberikan kepada tanda air bertakung (sign of stagnant water) pada papak lantai Flat Roof dan AC Ledge (item No. 276 dan No. 280) serta keretakan papak lantai yang menyeluruh dan keretakan dinding dengan corner bead terdedah (item No. 277, No. 281 dan No. 282). Kawasan-kawasan ini terdedah kepada cuaca: takungan air yang berterusan menunjukkan kecerunan (falls) yang tidak sempurna dan akan mempercepatkan kemerosotan lapisan kalis air, manakala keretakan yang dibiarkan akan membenarkan resapan air dan kebocoran ke ruang di bawahnya. Pihak tuan dituntut membetulkan PUNCA — kecerunan permukaan dan pembaikan keretakan mengikut amalan pembinaan yang baik — dan bukan sekadar tampalan kosmetik.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada kluster Water Tank Area — item No. 270 (tiada sokongan sempurna pada distribution pipe ke tangki air, yang hendaklah dipasang mengikut spesifikasi pemasangan), No. 271 (tangki air dalam keadaan kotor — WAJIB dibersihkan sepenuhnya memandangkan ia membekalkan air untuk kegunaan harian penghuni) dan No. 272 (pemasangan insulation sheet yang tidak sempurna). Memandangkan lokasi-lokasi kerja (Top Roof, Flat Roof, AC Ledge dan Water Tank Area) adalah kawasan yang sukar diakses oleh pemilik, pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui e-mel (${data.emailPembeli}) atau WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan.`
);
y += 4;

numPara(5,
  `Selain itu, kluster bunyi berongga (hollowness) — item No. 26 (dinding Living And Dining), No. 88 (dinding bercat Staircase), No. 186 (permukaan papak Flat Roof) dan No. 189 (dinding bercat Flat Roof) — menunjukkan lekatan lepaan/skrid yang tidak sempurna yang berisiko retak dan tertanggal; ia hendaklah dibaiki mengikut amalan pembinaan yang baik (hack dan lepa/skrid semula) dan bukan sekadar tampalan kosmetik. Item No. 191 — sisa binaan yang ditinggalkan di atas bumbung — WAJIB dikeluarkan sepenuhnya kerana ia boleh menyumbat talang dan merosakkan genting. Memandangkan sebahagian besar lokasi kerja (Top Roof dan Flat Roof) adalah kawasan yang sukar diakses oleh pemilik, pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui e-mel (${data.emailPembeli}) atau WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan.`
);
y += 4;

numPara(6,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar SEMUA kerja pembaikan terhadap kecacatan yang dilaporkan disiapkan sepenuhnya selewat-lewatnya pada ${data.tarikhDeadline}, iaitu tarikh tamat tempoh tiga puluh (30) hari di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}. Sekiranya pembaikan masih tidak disempurnakan selepas tarikh tersebut, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari.`
);
y += 4;

numPara(7,
  `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan.`
);
y += 4;

numPara(8, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:");
y += 2;
bullet("Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;");
bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
bullet("Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.");
y += 4;

numPara(9,
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

numPara(10,
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
fs.writeFileSync("/home/user/admin/NOTIS_1_CHUNG.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_1_CHUNG.pdf");
console.log(`Total pages: ${totalPages}`);
