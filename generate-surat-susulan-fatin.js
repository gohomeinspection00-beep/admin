const { jsPDF } = require("jspdf");
const fs = require("fs");

const IS_HQ = process.argv[2] === "HQ";

const data = {
  noRujukan: "SUSULAN-1/NOTIS-1/2026/043",

  namaPembeli: "NUR FATIN LIYANA BINTI MARIZAN",
  alamatPengirim: [
    "No. 23, Jalan TU 30,",
    "Taman Tasik Utama,",
    "Ayer Keroh,",
    "75450 Melaka.",
  ],
  noKP: "961006-38-5072",
  telefonPembeli: "013-742 0028",
  emailPembeli: "ftnliyanaa@gmail.com",

  namaPemaju: "METACORP PROPERTIES SDN. BHD.",
  noSyarikat: "(198301002311 / 97547-U)",
  alamatPenerima: IS_HQ ? [
    "(Alamat Berdaftar / Registered Office)",
    "L5-01, Level 5, Menara Kenari @ Canary Tower,",
    "No. 1, Jalan Tun Mohd Fuad,",
    "Taman Tun Dr. Ismail,",
    "60000 Wilayah Persekutuan Kuala Lumpur.",
  ] : [
    "No. 42A, Jalan TU 2,",
    "Taman Tasik Utama,",
    "Ayer Keroh,",
    "75450 Melaka.",
  ],

  alamatHartanah: "No. 53, Jalan TU 13, Taman Tasik Utama, Ayer Keroh, 75450 Melaka",
  jenisHartanah: "Rumah Teres 1 Tingkat (Unit ST-187C, H.S.(M) 7054, PT 26455, Mukim Bukit Katil)",

  tarikhSurat: "2 Oktober 2026",
  tarikhNotis1: IS_HQ ? "22 September 2026" : "25 September 2026",
  tarikhDeadline: IS_HQ ? "7 Oktober 2026" : "10 Oktober 2026",
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

function img64(path) {
  return "data:image/jpeg;base64," + fs.readFileSync(path).toString("base64");
}

function addEvidenceImage(path, wMM, hMM, caption) {
  const needed = hMM + 16;
  checkBreak(needed > pageH - 50 ? 60 : needed);
  if (y + hMM + 14 > pageH - 22) { newPage(); }
  const x = (pageW - wMM) / 2;
  doc.addImage(img64(path), "JPEG", x, y, wMM, hMM);
  doc.setLineWidth(0.3); bk();
  doc.rect(x, y, wMM, hMM);
  y += hMM + 5;
  doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
  const capL = doc.splitTextToSize(caption, cW - 20);
  for (const c of capL) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.5; }
  y += 6;
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

doc.text(data.tarikhSurat, pageW - mR, y - LH_S, { align: "right" });

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
const perkara1 = "Surat Susulan — Maklum Balas Pemeriksaan Bersama (Joint Inspection)";
const perkara2 = "pada 25 September 2026 & Tuntutan Dokumentasi Rasmi";
const perkara3 = `Hartanah: ${data.jenisHartanah}`;
const perkara4 = `di ${data.alamatHartanah}`;
for (const pk of [perkara1, perkara2, perkara3, perkara4]) {
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
  `Dengan segala hormatnya perkara di atas dirujuk. Surat ini adalah susulan kepada Notis Pertama — Tuntutan Pembetulan Kecacatan (First Notice) dengan rujukan NOTIS-1/2026/043 bertarikh ${data.tarikhNotis1} yang telah diserahkan secara rasmi kepada pihak tuan dan telah DIAKUI TERIMA — di pejabat pihak tuan di Ayer Keroh pada 24 September 2026 oleh En. Haziron bin Hasan (Supervisor, Site — Group Facilities, Property Liaison & Project Management) dengan cop rasmi "RECEIVED 24 SEP 2026", dan di Ibu Pejabat pihak tuan di Kuala Lumpur pada 22 September 2026 oleh En. Noor Razmin Riza bin Noor Hazizi (Senior Executive, Property Management). Salinan kedua-dua akuan terima dilampirkan sebagai Lampiran B.`
);
y += 4;

numPara(2,
  `Pada 25 September 2026 (Jumaat), satu Pemeriksaan Bersama (Joint Inspection) telah dijalankan di hartanah tersebut dengan kehadiran saya selaku pemilik, wakil pihak pemaju, dan beberapa wakil daripada kontraktor utama (main contractor). Dalam perbincangan tersebut, beberapa maklum balas telah diberikan secara LISAN oleh pihak yang mewakili pemaju dan kontraktor berhubung kecacatan yang dilaporkan. Memandangkan maklum balas lisan tidak mempunyai nilai rekod, surat ini dikeluarkan bagi merekodkan secara BERTULIS kesemua maklum balas tersebut berserta pendirian rasmi saya, dan menuntut jawapan serta dokumentasi rasmi daripada pihak tuan bagi setiap perkara di bawah.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const sT = "A. Keretakan Berulang pada Apron Slab (Luar)";
doc.text(sT, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(sT), y + 1);
y += 8;

numPara(3,
  `Semasa Joint Inspection, didapati keretakan (crack) pada apron slab di bahagian luar rumah MASIH BERULANG semula walaupun kerja pembaikan telah dijalankan oleh pihak tuan. Keretakan yang berulang selepas pembaikan jelas menunjukkan pembaikan yang dijalankan bersifat kosmetik dan tidak menangani punca sebenar. Pihak tuan dituntut mengenal pasti dan menangani PUNCA keretakan tersebut (contohnya pemadatan tanah atau asas papak yang tidak sempurna), dan bukan sekadar menampal permukaan retakan.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const sT2 = "B. Mailbox & Pintu Refuse Chamber Senget — Alasan Pembekal Ditolak";
const sT2L = doc.splitTextToSize(sT2, cW);
for (const l of sT2L) { doc.text(l, mL, y); doc.setLineWidth(0.3); doc.line(mL, y + 1, mL + doc.getTextWidth(l), y + 1); y += LH; }
y += 2;

numPara(4,
  `Berhubung peti surat (mailbox) dan pintu refuse chamber yang senget, pihak yang mewakili pemaju dan kontraktor menyatakan secara lisan bahawa barangan tersebut "telah sedia senget daripada pembekal (supplier)" dan pihak mereka "hanya memasang sahaja". Alasan ini TIDAK BOLEH DITERIMA dan dengan ini DITOLAK. Klausa 11.1 Perjanjian Jual Beli dengan jelas meletakkan tanggungjawab ke atas pihak tuan bagi apa-apa kecacatan yang disebabkan oleh mutu kerja ATAU BAHAN yang cacat (defective workmanship or materials). Saya selaku pembeli tidak mempunyai sebarang hubungan kontrak dengan pembekal pihak tuan; pemilihan, penerimaan dan pemasangan bahan daripada pembekal adalah sepenuhnya urusan dan tanggungjawab pihak tuan. Sekiranya bahan yang diterima daripada pembekal didapati cacat, kewajipan pihak tuan adalah menolak dan menggantikannya — bukan memasangnya di rumah pembeli dan memindahkan bebanan tersebut kepada pembeli. Penggantian/pembetulan dituntut sepenuhnya atas kos pihak tuan.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const sT3 = 'C. Alasan "Refer Drawing" — Kitchen & Master Bedroom';
doc.text(sT3, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(sT3), y + 1);
y += 8;

numPara(5,
  `Semasa Joint Inspection, alasan "refer drawing" (merujuk kepada lukisan) telah diberikan secara lisan bagi TIGA kecacatan berikut:`
);
y += 2;
bullet("Kitchen — ketidakjajaran lantai / alignment lantai (floor alignment) yang didakwa mengikut gradient dalam lukisan;");
bullet("Kitchen — dinding yang senget dan kawasan dinding yang tidak dipasang tiles, yang didakwa mengikut lukisan; dan");
bullet("Master Bedroom — dinding yang senget sehingga ketara (nampak jelas) pada pemasangan tiles, yang juga didakwa mengikut lukisan.");
y += 4;

numPara(6,
  `Pendirian saya adalah seperti berikut: Perjanjian Jual Beli yang ditandatangani TIDAK menyatakan sebarang peruntukan berkenaan gradient lantai di Kitchen, dan TIDAK menyatakan bahawa dinding di Kitchen mahupun Master Bedroom dibina senget sehingga ketara pada permukaan tiles. Dakwaan lisan "refer drawing" tanpa sebarang dokumen sokongan tidak mempunyai apa-apa nilai. Oleh itu, bagi SETIAP satu daripada tiga perkara di atas, pihak tuan dituntut mengemukakan dokumen rasmi (official documentation) — iaitu salinan lukisan yang diluluskan (approved drawing) dan/atau lukisan as-built terkini yang jelas menunjukkan spesifikasi yang didakwa — dalam bentuk bertulis kepada saya. Sekiranya dokumen tersebut tidak dapat dikemukakan, atau dokumen tersebut tidak menyokong keadaan sedia ada, maka kecacatan berkenaan hendaklah dibaiki sepenuhnya mengikut standard mutu kerja yang sewajarnya, atas kos pihak tuan.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const sT4 = "D. Rantai Basin Stopper Tidak Dibekalkan";
doc.text(sT4, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(sT4), y + 1);
y += 8;

numPara(7,
  `Berhubung keperluan memasang rantai (chain) pada basin stopper bagi mengelakkan kebocoran, pihak kontraktor utama menyatakan secara lisan bahawa pemasangan adalah merujuk kepada rumah contoh (show unit). Walau bagaimanapun, slot untuk rantai tersebut jelas wujud pada kelengkapan yang dipasang, yang menunjukkan rantai merupakan sebahagian daripada kelengkapan asal yang sepatutnya dibekalkan. Rujukan kepada rumah contoh bukanlah jawapan kontraktual. Pihak tuan dituntut memberikan keterangan rasmi bertulis mengapa rantai tersebut tidak dibekalkan, atau membekalkan dan memasang rantai berkenaan.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const sT5 = "E. Bukaan Besar & Struktur Bumbung Terdedah (Metal Deck Area)";
const sT5L = doc.splitTextToSize(sT5, cW);
for (const l of sT5L) { doc.text(l, mL, y); doc.setLineWidth(0.3); doc.line(mL, y + 1, mL + doc.getTextWidth(l), y + 1); y += LH; }
y += 2;

numPara(8,
  `Berhubung item No. 197 dalam Notis Pertama — bukaan besar (large opening) dengan struktur bumbung terdedah di Metal Deck Area — pihak yang mewakili pemaju menyatakan secara lisan bahawa keadaan tersebut adalah "mengikut design". Perlu ditegaskan bahawa keadaan ini turut menyebabkan wujudnya bukaan di dalam ruang siling di mana cahaya luar boleh dilihat menembusi masuk — keadaan yang turut membuka laluan kepada air hujan, habuk dan haiwan perosak. Sebagaimana telah dituntut dalam Notis Pertama, sekiranya keadaan ini benar-benar merupakan reka bentuk asal yang diluluskan, pihak tuan dituntut mengemukakan dokumen rasmi (official documentation) reka bentuk yang diluluskan sebagai pengesahan bertulis, termasuk semakan sama ada kawasan tersebut sepatutnya dipasang ceiling board sebagai lapisan perlindungan. Jawapan lisan "ikut design" tanpa dokumen tidak akan diterima sebagai penyelesaian.`
);
y += 4;

checkBreak(40);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const sT6 = "F. Kerosakan Roof Tiles Selepas Kerja Pembaikan — Dakwaan";
const sT6b = "Terhadap Pihak Pemeriksa Ditolak Dengan Bukti";
for (const l of [sT6, sT6b]) { doc.text(l, mL, y); doc.setLineWidth(0.3); doc.line(mL, y + 1, mL + doc.getTextWidth(l), y + 1); y += LH; }
y += 2;

numPara(9,
  `Berhubung kecacatan baharu yang direkodkan sebagai "New Defect from Rectification Work — crack/damage on roof tiles after rectification work", pihak yang mewakili pemaju/kontraktor telah mendakwa secara lisan bahawa kerosakan tersebut disebabkan oleh juruukur (surveyor) yang menaiki bumbung semasa pemeriksaan. Dakwaan ini adalah TIDAK BERASAS dan dengan ini DITOLAK berdasarkan bukti bergambar berikut (rujuk Lampiran A):`
);
y += 2;
bullet("Semasa Pemeriksaan Kali Pertama (31 Julai 2026), telah sedia wujud keretakan kecil di penghujung roof tile di lokasi yang sama (ditanda dengan bulatan hijau dan anak panah hijau dalam gambar Pemeriksaan Kali Pertama — Lampiran A, Gambar 1 & 2). Oleh kerana keretakan tersebut kecil sahaja dan tidak ketara, kami bertolak ansur (tolerate) dan tidak memasukkannya sebagai item tuntutan ketika itu;");
bullet("Semasa Pemeriksaan Semula (Re-Inspection) pada 9 September 2026, didapati roof tile di lokasi keretakan sedia ada tersebut telah PECAH sepenuhnya (Lampiran A, Gambar 3, bertarikh 09/09/2026, 15:07) — iaitu selepas kerja pembaikan bumbung dijalankan oleh pihak kontraktor, dan bersebelahan dengan roof tiles pecah yang memang telah dilaporkan dalam laporan pemeriksaan;");
bullet("Kronologi gambar ini jelas menunjukkan kerosakan berlaku dalam tempoh kerja pembaikan (rectification work) dijalankan oleh pihak kontraktor, dan bukannya disebabkan oleh pihak pemeriksa.");
y += 4;

numPara(10,
  `Sehubungan itu, sekiranya pihak tuan masih mengekalkan dakwaan bahawa kerosakan tersebut bukan berpunca daripada kerja pembaikan pihak kontraktor, pihak tuan dituntut mengemukakan bukti bergambar (photographic evidence) kerja pembaikan bumbung yang telah dijalankan — iaitu gambar selepas siap kerja pembaikan (after-repair photos) yang menunjukkan roof tiles di kawasan tersebut berada dalam keadaan sempurna TANPA pecah. Tanpa bukti sedemikian, kerosakan tersebut kekal sebagai kecacatan baharu akibat kerja pembaikan (new defect arising from rectification work) yang WAJIB dibaiki sepenuhnya oleh pihak tuan atas kos pihak tuan sendiri, dengan kadar SEGERA memandangkan ia melibatkan bumbung yang terdedah kepada risiko kebocoran air hujan.`
);
y += 4;

checkBreak(30);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const sT7 = "G. Tempoh Notis Pertama Kekal Berkuat Kuasa";
doc.text(sT7, mL, y);
doc.setLineWidth(0.3);
doc.line(mL, y + 1, mL + doc.getTextWidth(sT7), y + 1);
y += 8;

numPara(11,
  `Untuk mengelakkan sebarang keraguan, surat susulan ini TIDAK melanjutkan mahupun menggantikan tempoh yang ditetapkan dalam Notis Pertama. Tarikh akhir penyiapan semua kerja pembaikan sebagaimana dinyatakan dalam Notis Pertama KEKAL pada ${data.tarikhDeadline}. Kesemua jawapan bertulis dan dokumen rasmi yang dituntut di dalam surat ini hendaklah dikemukakan dalam tempoh yang sama. Sekiranya pembaikan masih tidak disempurnakan dan/atau dokumen yang dituntut tidak dikemukakan dalam tempoh tersebut, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan tanpa rujukan lanjut, dan tindakan selanjutnya sebagaimana dinyatakan dalam Notis Pertama — termasuk tuntutan di Tribunal Tuntutan Pembeli Rumah (TTPR) — akan diteruskan.`
);
y += 4;

numPara(12,
  `Merujuk kepada Klausa 13.1 (Notices) di dalam Perjanjian Jual Beli, surat ini yang diberikan melalui serahan tangan atau surat berdaftar ke alamat pihak tuan adalah dianggap sah diserahkan (sufficiently served).`
);
y += 4;

checkBreak(80);
para("Saya berharap pihak tuan memberikan maklum balas bertulis terhadap setiap perkara di atas dan menyiapkan semua kerja pembaikan dalam tempoh yang ditetapkan. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
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
doc.text(`No. K/P: ${data.noKP}`, mL, y); y += 4;
doc.text(`E-mel: ${data.emailPembeli}`, mL, y); y += LH_S;
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += 8;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("Lampiran:", mL, y); y += LH_S;
doc.setFont("helvetica", "normal");
doc.text("A. Bukti bergambar — keretakan sedia ada vs kerosakan roof tiles selepas kerja pembaikan", mL + 4, y); y += LH_S;
doc.text("B. Salinan Akuan Terima Notis Pertama (Ayer Keroh, 24 Sept 2026 & Ibu Pejabat KL, 22 Sept 2026)", mL + 4, y); y += LH_S;

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

const kronologi = [
  { tarikh: "6 Mac 2026", peristiwa: "Perjanjian Jual Beli (Sale and Purchase Agreement) ditandatangani — MTD Cinerea Heights, Unit ST-187C" },
  { tarikh: "31 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan — keretakan kecil sedia ada pada roof tile turut dirakam bergambar" },
  { tarikh: "5 Ogos 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara serahan tangan (hardcopy) kepada pihak pemaju — notis bertulis di bawah Klausa 11.1" },
  { tarikh: "4 September 2026", peristiwa: "Tamat tempoh tiga puluh (30) hari pembaikan di bawah Klausa 11.1 — pembaikan masih belum disiapkan sepenuhnya" },
  { tarikh: "9 September 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — 8 kecacatan masih belum selesai; roof tile didapati PECAH selepas kerja pembaikan (dirakam bergambar, 15:07)" },
  { tarikh: "22 September 2026", peristiwa: "Notis Pertama (NOTIS-1/2026/043) diserahkan ke Ibu Pejabat KL — diakui terima oleh En. Noor Razmin Riza bin Noor Hazizi (Senior Executive, Property Management)" },
  { tarikh: "24 September 2026", peristiwa: 'Notis Pertama diakui terima di pejabat Ayer Keroh oleh En. Haziron bin Hasan (Supervisor, Site) — cop rasmi "RECEIVED 24 SEP 2026"' },
  { tarikh: "25 September 2026", peristiwa: "Pemeriksaan Bersama (Joint Inspection) — pemilik bersama wakil pemaju dan wakil kontraktor utama; maklum balas lisan diberikan" },
  { tarikh: "2 Oktober 2026", peristiwa: "Surat Susulan ini dikeluarkan — merekodkan maklum balas lisan dan menuntut dokumentasi rasmi" },
  { tarikh: data.tarikhDeadline, peristiwa: "Tarikh akhir pembaikan di bawah Notis Pertama (KEKAL — tidak dilanjutkan oleh surat ini)" },
];

const krColW = [40, cW - 40];
drawTable(
  ["Tarikh (Date)", "Peristiwa (Event)"],
  kronologi.map(k => [k.tarikh, k.peristiwa]),
  krColW
);

// ============================================================
// LAMPIRAN A — BUKTI ROOF TILES
// ============================================================
newPage();
y = 25;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const laT = "LAMPIRAN A";
doc.text(laT, pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth(laT) / 2, y + 1, pageW / 2 + doc.getTextWidth(laT) / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("Bukti Bergambar — Kerosakan Roof Tiles Selepas Kerja Pembaikan", pageW / 2, y, { align: "center" });
y += 10;

// Gambar 1: first inspection close-up (367x316)
addEvidenceImage("/home/user/admin/fatin-roof-first-1.jpg", 80, 80 * 316 / 367,
  "Gambar 1 — Pemeriksaan Kali Pertama (31 Julai 2026): keretakan kecil sedia ada di penghujung roof tile (bulatan hijau). Keretakan kecil ini ditolak ansur dan tidak dituntut ketika itu.");

// Gambar 2: first inspection wide (509x811)
addEvidenceImage("/home/user/admin/fatin-roof-first-2.jpg", 85, 85 * 811 / 509,
  "Gambar 2 — Pemeriksaan Kali Pertama (31 Julai 2026): lokasi keretakan sedia ada (anak panah hijau), bersebelahan roof tile pecah yang dilaporkan (kotak merah).");

// Gambar 3: second inspection pair (566x284)
addEvidenceImage("/home/user/admin/fatin-roof-second.jpg", 130, 130 * 284 / 566,
  "Gambar 3 — Pemeriksaan Semula (9 September 2026, 15:07): roof tile di lokasi keretakan sedia ada kini didapati PECAH sepenuhnya — selepas kerja pembaikan bumbung dijalankan oleh pihak kontraktor.");

// ============================================================
// LAMPIRAN B — AKUAN TERIMA NOTIS 1
// ============================================================
newPage();
y = 25;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const lbT = "LAMPIRAN B";
doc.text(lbT, pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth(lbT) / 2, y + 1, pageW / 2 + doc.getTextWidth(lbT) / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("Salinan Akuan Terima Notis Pertama (NOTIS-1/2026/043)", pageW / 2, y, { align: "center" });
y += 10;

addEvidenceImage("/home/user/admin/fatin-akuan-ayerkeroh.jpg", 90, 160,
  'Akuan Terima di pejabat Ayer Keroh — diterima oleh En. Haziron bin Hasan (Supervisor, Site — Group Facilities, Property Liaison & Project Management) pada 24 September 2026, cop rasmi "RECEIVED 24 SEP 2026 METACORP PROPERTIES SDN BHD".');

newPage();
y = 25;
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const lb2 = "LAMPIRAN B (sambungan)";
doc.text(lb2, pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth(lb2) / 2, y + 1, pageW / 2 + doc.getTextWidth(lb2) / 2, y + 1);
y += 10;

addEvidenceImage("/home/user/admin/fatin-akuan-hq.jpg", 110, 110 * 1280 / 960,
  "Akuan Terima di Ibu Pejabat Kuala Lumpur — diterima oleh En. Noor Razmin Riza bin Noor Hazizi (Senior Executive, Property Management) pada 22 September 2026.");

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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Surat Susulan — Maklum Balas Pemeriksaan Bersama (Joint Inspection) & Tuntutan Dokumentasi Rasmi bertarikh ${data.tarikhSurat} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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
const totalPages = doc.internal.getNumberOfPages();
for (let p = 1; p <= totalPages; p++) {
  doc.setPage(p);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2);
  doc.line(mL, pageH - 18, pageW - mR, pageH - 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.FOOTER); doc.setTextColor(0, 0, 0);
  doc.text(`Ruj: ${data.noRujukan}`, mL, pageH - 13);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

const out = doc.output("arraybuffer");
const outName = IS_HQ ? "SURAT_SUSULAN_FATIN_HQ.pdf" : "SURAT_SUSULAN_FATIN.pdf";
fs.writeFileSync("/home/user/admin/" + outName, Buffer.from(out));
console.log("PDF generated: " + outName);
console.log(`Total pages: ${totalPages}`);
