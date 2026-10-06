const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "NOTIS-1/2026/054",

  namaPembeli: "TEJINDER KAUR KHURANA",
  alamatPengirim: [
    "No. 478, Residensi Botani 3 (THE COMMUNE),",
    "Taman Eko Botani,",
    "79100 Iskandar Puteri,",
    "Johor.",
  ],
  noKP: "",
  telefonPembeli: "016-772 2067",
  emailPembeli: "",

  namaPemaju: "MELIA SPRING SDN. BHD.",
  noSyarikat: "(201401019246 / 1095333-H)",
  alamatPenerima: [
    "Eko Galleria,",
    "Jalan Eko Botani 3,",
    "Taman Eko Botani,",
    "79100 Iskandar Puteri, Johor.",
  ],

  alamatHartanah: "No. 478, Residensi Botani 3 (THE COMMUNE), Taman Eko Botani, 79100 Iskandar Puteri, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (2-Storey Terrace)",
  namaProyek: "Residensi Botani 3 (THE COMMUNE), Taman Eko Botani, Iskandar Puteri",

  noSPA: "",
  tarikhSPA: "",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "8 Mei 2026",
  tarikhSerahanLaporan: "",
  kaedahSerahanLaporan: "",

  tarikhReInspection: "4 Oktober 2026",

  tarikhNotis: "7 Oktober 2026",
  tarikhDeadline: "22 Oktober 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "1", lokasi: "Car Porch — Floor", kecacatan: "Jubin lantai tidak sejajar masih ada (Misaligned on floor tiles still observed)", status: "Belum Dibaiki" },
    { tag: "2", lokasi: "Car Porch — Wall", kecacatan: "Keretakan di bahagian atas dinding masih ada (Crack on top of wall still observed)", status: "Belum Dibaiki" },
    { tag: "3", lokasi: "Car Porch — Ceiling", kecacatan: "Keretakan dan kerosakan pada siling (New Defect — Crack and damaged on ceiling)", status: "Kecacatan Baru" },
    { tag: "4", lokasi: "Car Porch — Mailbox", kecacatan: "Kesan kotoran pada mailbox masih ada (Stains on mailbox still observed)", status: "Belum Dibaiki" },
    { tag: "5", lokasi: "Car Porch — Refuse Chamber", kecacatan: "Kesan kotoran pada jubin dinding di dalam refuse chamber (New Defect from Rectification Work — Stains on wall tiles inside refuse chamber)", status: "Kecacatan Baru (Kerja Pembaikan)" },
    { tag: "6", lokasi: "Terrace — Plumbing & Sanitary", kecacatan: "Manhole saliran tersumbat masih ada (Clogged inside manhole for drainage still observed)", status: "Belum Dibaiki" },
    { tag: "7", lokasi: "Terrace — M&E", kecacatan: "Kesan kotoran pada penutup soket masih ada (Stains on socket cover still observed)", status: "Belum Dibaiki" },
    { tag: "8", lokasi: "Kitchen — Wall", kecacatan: "Dinding tidak sejajar — jelas kelihatan — masih ada (Misaligned on wall still observed, Visible)", status: "Belum Dibaiki" },
    { tag: "9", lokasi: "Dining Area — Wall", kecacatan: "Cat tidak sekata pada dinding masih ada (Uneven painting still observed on wall)", status: "Belum Dibaiki" },
    { tag: "10", lokasi: "Dining Area — Ceiling", kecacatan: "Kesan kotoran pada siling masih ada (Stain on ceiling still observed)", status: "Belum Dibaiki" },
    { tag: "11", lokasi: "Dining Area — Sliding Door", kecacatan: "Kesan kotoran pada sliding door masih ada (Stain on sliding door still observed)", status: "Belum Dibaiki" },
    { tag: "12", lokasi: "Bedroom 2 — PVC Skirting", kecacatan: "PVC skirting tidak sejajar — jelas kelihatan — masih ada (Misaligned on PVC skirting still observed, Visible)", status: "Belum Dibaiki" },
    { tag: "13", lokasi: "Bathroom 2 — Plumbing & Sanitary", kecacatan: "Longgokan simen di dalam floor trap masih ada (Accumulation of cement inside floor trap still observed)", status: "Belum Dibaiki" },
    { tag: "14", lokasi: "Bedroom 3 — Window", kecacatan: "Kesan kotoran pada kaca tingkap masih ada (Stains on window glass still observed — asalnya New Defect from Rectification Work)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "15", lokasi: "Bathroom 3 — Door", kecacatan: "Kesan kotoran pada tombol pintu masih ada (Stains on doorknob still observed)", status: "Belum Dibaiki" },
    { tag: "16", lokasi: "Bathroom 3 — Plumbing & Sanitary", kecacatan: "Longgokan simen di dalam floor trap masih ada (Accumulation of cement inside floor trap still observed)", status: "Belum Dibaiki" },
    { tag: "17", lokasi: "Master Bedroom — Wall", kecacatan: "Bacaan kelembapan tinggi pada dinding masih ada (High moisture reading on wall still observed — Leaking Issue)", status: "Belum Dibaiki" },
    { tag: "18", lokasi: "Master Bedroom — Sliding Door", kecacatan: "Kesan kotoran pada kaca sliding door (New Defect from Rectification Work — Stain on sliding door glass)", status: "Kecacatan Baru (Kerja Pembaikan)" },
    { tag: "19", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Kebocoran pada bottle trap besen masih ada (Leaking on bottle trap for basin still observed — Leaking Issue)", status: "Belum Dibaiki" },
    { tag: "20", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Longgokan simen di dalam floor trap masih ada (Accumulation of cement inside floor trap still observed)", status: "Belum Dibaiki" },
    { tag: "21", lokasi: "Master Bathroom — Fixtures", kecacatan: "Pemegang tisu longgar masih ada (Loose on tissue holder still observed)", status: "Belum Dibaiki" },
    { tag: "22", lokasi: "Ceiling Area (Master Bedroom) — Roof", kecacatan: "Pemasangan insulation sheet tidak sempurna masih ada — dibaiki menggunakan tape sahaja, iaitu penyelesaian sementara (Improper installation for insulation sheet still observed — tape is only a temporary solution)", status: "Belum Dibaiki" },
    { tag: "23", lokasi: "Balcony — Handrail", kecacatan: "Karat pada handrail — keseluruhan permukaan — masih ada (Rusted on handrail still observed, all surface)", status: "Belum Dibaiki" },
    { tag: "24", lokasi: "RC Flat Roof — Floor", kecacatan: "Air bertakung pada papak lantai masih ada (Water stagnant on floor slab still observed)", status: "Belum Dibaiki" },
    { tag: "25", lokasi: "RC Flat Roof — Wall", kecacatan: "Cat menggelembung pada dinding (New Defect — Bubble paint on wall)", status: "Kecacatan Baru" },
    { tag: "26", lokasi: "RC Flat Roof (Kitchen Area) — Floor", kecacatan: "Air bertakung pada papak lantai masih ada (Water stagnant on floor slab still observed)", status: "Belum Dibaiki" },
    { tag: "27", lokasi: "RC Flat Roof (Kitchen Area) — Floor", kecacatan: "Kesan kotoran pada hampir keseluruhan papak lantai (New Defect from Rectification Work — Stains on most of floor slab)", status: "Kecacatan Baru (Kerja Pembaikan)" },
    { tag: "28", lokasi: "RC Flat Roof (Kitchen Area) — Floor", kecacatan: "Keretakan pada papak lantai masih ada (Cracks on floor slab still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "29", lokasi: "Top Roof — Floor", kecacatan: "Tanda air bertakung pada papak masih ada (Sign of water stagnant on slab still observed)", status: "Belum Dibaiki" },
    { tag: "30", lokasi: "Top Roof — Roof", kecacatan: "Kerosakan pada genting bumbung masih ada — KECACATAN MAJOR (Damaged on roof tiles still observed — Major Defect)", status: "Belum Dibaiki" },
    { tag: "31", lokasi: "Top Roof — Gutter", kecacatan: "Air bertakung di dalam gutter masih ada (Water stagnant on gutter still observed)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "8 Mei 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan oleh Building Surveyor berdaftar RISM — laporan dikemukakan kepada pihak pemaju (notis bertulis di bawah Klausa 27(1))" },
    { tarikh: "Jun 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 27(1) — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "21 Julai 2026", peristiwa: "Pemeriksaan Kedua (Second Inspection) dijalankan — kecacatan masih belum diselesaikan" },
    { tarikh: "4 Oktober 2026", peristiwa: "Pemeriksaan Ketiga (Third Inspection) oleh Building Surveyor berdaftar RISM — 31 kecacatan direkodkan: 24 Not Complete, 2 Not Fully Complete, 2 New Defect dan 3 New Defect from Rectification Work" },
    { tarikh: "7 Oktober 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan — bersama Laporan Pemeriksaan Ketiga" },
    { tarikh: "22 Oktober 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
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
  `Saya, ${data.namaPembeli}, pemilik unit hartanah di alamat di atas (Projek: ${data.namaProyek}), sebagaimana termaktub di dalam Perjanjian Jual Beli (${data.jenisSPA}, Akta Pemajuan Perumahan 1966) yang ditandatangani dengan pihak tuan, telah menjalankan Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) pada ${data.tarikhPemeriksaan1} melalui Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM), dan laporan pemeriksaan tersebut telah dikemukakan secara rasmi kepada pihak tuan. Pengemukaan tersebut merupakan notis bertulis di bawah Klausa ${data.klausaPembaikan} ${data.jenisSPA}, dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari.`
);
y += 4;

numPara(2,
  `Namun, tempoh tiga puluh (30) hari tersebut telah lama tamat — kini hampir LIMA (5) BULAN sejak pemeriksaan pertama — namun kecacatan masih belum diselesaikan. Pemeriksaan Kedua (Second Inspection) pada 21 Julai 2026 mendapati kecacatan masih tidak dibaiki, dan Pemeriksaan Ketiga (Third Inspection) pada ${data.tarikhReInspection} oleh Building Surveyor berdaftar RISM seterusnya mengesahkan sejumlah TIGA PULUH SATU (31) kecacatan — 24 masih Not Complete, 2 Not Fully Complete, 2 kecacatan baru (New Defect), dan 3 kecacatan baru yang timbul akibat kerja pembaikan pihak tuan sendiri (New Defect from Rectification Work). Laporan Pemeriksaan Ketiga disertakan bersama-sama notis ini sebagai serahan rasmi. Senarai kecacatan tersebut adalah seperti berikut:`
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
const fn = `*Butiran penuh setiap kecacatan berserta gambar sebelum/selepas adalah sebagaimana terkandung di dalam Laporan Pemeriksaan Ketiga (3rd Inspection Report) bertarikh ${data.tarikhReInspection} yang disertakan bersama-sama notis ini.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada isu KEBOCORAN yang berterusan: item No. 17 — bacaan kelembapan tinggi (high moisture) pada dinding Master Bedroom yang masih direkodkan sehingga Pemeriksaan Ketiga, petanda kemasukan atau resapan air (water ingress) yang belum ditangani; dan item No. 19 — kebocoran pada bottle trap besen di Master Bathroom yang masih berterusan. Bagi kedua-dua item ini, pihak tuan dituntut MENGESAN DAN MEMBAIKI PUNCA kebocoran/resapan tersebut dengan sempurna, dan bukan sekadar kerja kemasan kosmetik. Kegagalan menangani punca akan mengakibatkan kerosakan merebak kepada struktur dan kemasan di sekitarnya.`
);
y += 4;

numPara(4,
  `Perhatian turut diberikan kepada item No. 30 — kerosakan genting bumbung di Top Roof (KECACATAN MAJOR) yang masih tidak dibaiki dan mendedahkan rumah kepada risiko kebocoran air hujan. Bagi sistem saliran dan takungan air: air bertakung masih direkodkan di RC Flat Roof (item No. 24 dan 26), Top Roof (item No. 29) dan gutter (item No. 31) — menunjukkan kecerunan (falls) permukaan yang tidak sempurna yang dituntut dibetulkan pada puncanya; manhole saliran di Terrace masih tersumbat (item No. 6); dan longgokan simen masih berada di dalam floor trap di TIGA bilik air (item No. 13, 16 dan 20) yang wajib dikeluarkan sepenuhnya. Ditegaskan juga bahawa item No. 22 — pemasangan insulation sheet — didapati "dibaiki" menggunakan TAPE sahaja, iaitu penyelesaian sementara yang tidak boleh diterima; pemasangan semula yang kekal dan sempurna dituntut. Item No. 23 — handrail balkoni yang berkarat pada keseluruhan permukaan — dituntut dirawat/diganti dengan sewajarnya. Selain itu, TIGA kecacatan baru adalah AKIBAT KERJA PEMBAIKAN pihak tuan sendiri (item No. 5, 18 dan 27 — New Defect from Rectification Work) dan kesemuanya wajib dibaiki sepenuhnya atas kos pihak tuan. Bagi kerja pembaikan di kawasan sukar diakses (Top Roof, RC Flat Roof dan ruang siling), pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui WhatsApp (${data.telefonPembeli}) sebagai bukti penyiapan.`
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
const outName = "NOTIS_1_TEJINDER.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
