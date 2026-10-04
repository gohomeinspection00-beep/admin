const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukanNotis2: "NOTIS-2/2026/041",
  noRujukanNotis1: "NOTIS-1/2026/041",

  namaPembeli: "THAYAANITI A/L RAMAN",
  alamatPengirim: [
    "Pangsapuri Pulai Mutiara 3, 06-17 Blok C,",
    "Jalan Pulai Mutiara 7/12,",
    "Taman Pulai Mutiara,",
    "81300 Johor Bahru, Johor.",
  ],
  emailPembeli: "thaya_2401@yahoo.com",
  telefonPembeli: "010-918 2532",
  noKP: "950124-06-5607",

  namaPemaju: "AVENUE GREEN DEVELOPMENT SDN. BHD.",
  noSyarikat: "(202201000586 / 1446283-D)",
  alamatPenerima: [
    "#01-03, Pangsapuri Seri 18,",
    "Jalan Persiaran Jaya Putra,",
    "Bandar Jaya Putra,",
    "81100 Johor Bahru, Johor.",
  ],

  alamatHartanah: "No. 49, Jalan Impian Indah 2, Taman Impian Indah, 81000 Kulai, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat (22' x 70', PTD 109061, Mukim Senai)",

  noRujukanSPA: "30424-1/eSPA/110624/PTD109061/01",
  tarikhSPA: "11 Jun 2024",
  jenisSPA: "Jadual G",
  klausaSPA: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhSerahanLaporan: "31 Julai 2026",
  kaedahSerahanLaporan: "WhatsApp",

  tarikhNotis1: "11 September 2026",
  tarikhDeadlineNotis1: "26 September 2026",
  tempohNotis1: "15",
  kaedahPenghantaranNotis1: "serahan rasmi",

  tarikhNotis2: "5 Oktober 2026",
  tarikhDeadlineNotis2: "20 Oktober 2026",
  tempohNotis2: "15",
  kaedahPenghantaranNotis2: "serahan rasmi",

  kecacatan: [
    { tag: "1", lokasi: "Car Porch — Floor", kecacatan: "Keretakan dan shrinkage cracks pada keseluruhan papak lantai masih ada, dengan perbezaan tona (tonality) pada papak selepas kerja pembaikan (Crack and shrinkage cracks on all floor slab still observed; tonality on floor slab after rectification work)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "2", lokasi: "Car Porch — M&E", kecacatan: "Rintangan elektrod bumi diukur 56 ohm pada ujian ketiga (sebelum ini 69 ohm) — melebihi had di bawah 10 ohm yang ditetapkan ST Domestic Electrical Installation Guidelines, Second Edition 2024, Klausa 10.8(b) bagi pemasangan dengan SPD; tidak patuh dan menjejaskan keberkesanan SPD (Measured earth electrode resistance 56 ohm, exceeds required limit — non-compliant)", status: "Belum Dibaiki" },
    { tag: "3", lokasi: "Bathroom 3 — Ceiling", kecacatan: "Kelembapan tinggi pada permukaan siling di dalam ceiling manhole masih ada (High moisture on ceiling surface inside ceiling manhole still observed)", status: "Belum Dibaiki" },
    { tag: "4", lokasi: "Bathroom 3 — Ceiling", kecacatan: "Kelembapan tinggi pada permukaan siling di dalam ceiling manhole masih ada (High moisture on ceiling surface inside ceiling manhole still observed)", status: "Belum Dibaiki" },
    { tag: "5", lokasi: "Living and Dining — Ceiling", kecacatan: "Kelembapan tinggi pada siling di dalam ceiling manhole masih ada (High moisture on ceiling inside ceiling manhole still observed)", status: "Belum Dibaiki" },
    { tag: "6", lokasi: "Ceiling Area (Bathroom 1) — Fixtures", kecacatan: "Pemasangan insulation sheet tidak sempurna masih ada (Improper installation for insulation sheet still observed)", status: "Belum Dibaiki" },
    { tag: "7", lokasi: "Ceiling Area (Bedroom 2) — Fixtures", kecacatan: "Pemasangan aluminium foil sheet tidak sempurna (Improper installation of aluminium foil sheet)", status: "Belum Dibaiki" },
    { tag: "8", lokasi: "Water Tank Area — Plumbing & Sanitary", kecacatan: "Getaran pada incoming pipe (Vibrate on incoming pipe) — KECACATAN BARU (New Defect)", status: "Kecacatan Baru — Belum Dibaiki" },
    { tag: "9", lokasi: "Water Tank Area — Fixtures", kecacatan: "Insulation sheet rosak dan pemasangan tidak sempurna masih ada (Damaged and improper installation for insulation sheet still observed)", status: "Belum Dibaiki" },
    { tag: "10", lokasi: "AC Ledge (Bedroom 3) — Wall", kecacatan: "Hollowness pada dinding bercat masih ada (Hollowness on painted wall still observed)", status: "Belum Dibaiki Sepenuhnya" },
    { tag: "11", lokasi: "Top Roof — Roof", kecacatan: "Keretakan pada genting bumbung dan pemasangan genting tidak sempurna masih ada (Crack on roof tiles; improper installation of roof tiles still observed)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "11 Jun 2024", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "28 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "31 Julai 2026", peristiwa: "Laporan Pemeriksaan Kecacatan diserahkan secara rasmi kepada pemaju melalui WhatsApp" },
    { tarikh: "30 Ogos 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "8 September 2026", peristiwa: "Pemeriksaan Semula (Re-Inspection) dijalankan — daripada 269 item, hanya 191 (71.0%) selesai: 27 Not Complete, 18 Not Fully Complete dan 5 kecacatan baru (1 New Defect; 4 New Defect from Rectification Work) direkodkan" },
    { tarikh: "11 September 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan — Ruj. NOTIS-1/2026/041" },
    { tarikh: "24 September 2026", peristiwa: "Pemeriksaan Ketiga (Third Inspection) oleh Building Surveyor berdaftar RISM — 11 penemuan: kecacatan masih belum diselesaikan dan 1 kecacatan baru dikesan" },
    { tarikh: "26 September 2026", peristiwa: "Tamat tarikh akhir pembaikan Notis Pertama (15 hari) — kecacatan masih belum diselesaikan" },
    { tarikh: "2 Oktober 2026", peristiwa: "Pihak pemaju memaklumkan secara lisan/tidak rasmi dakwaan \"tiada kebocoran fizikal (no physical leaking)\" bagi item kelembapan tinggi — tanpa butiran pemeriksaan bertulis" },
    { tarikh: "2 Oktober 2026", peristiwa: "Sebut harga rasmi pembaikan (Official Repair Quotation) No. 00202604 berjumlah RM7,610.00 diperoleh daripada kontraktor" },
    { tarikh: "5 Oktober 2026", peristiwa: "Notis Kedua / Notis Akhir (Final Notice) dikeluarkan — bersama sebut harga rasmi pembaikan" },
    { tarikh: "20 Oktober 2026", peristiwa: "Tarikh akhir pembaikan Notis Kedua (15 hari) — TARIKH MUKTAMAD" },
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
  `Merujuk kepada Notis Pertama (First Notice) bertarikh ${data.tarikhNotis1} dengan nombor rujukan ${data.noRujukanNotis1} yang telah dikemukakan kepada pihak tuan, pihak tuan telah diberikan tempoh ${data.tempohNotis1} hari sehingga ${data.tarikhDeadlineNotis1} untuk melaksanakan pembaikan kecacatan selaras dengan tanggungjawab pemaju di bawah Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}) dan Seksyen 12(2) Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118].`
);
y += 4;

numPara(2,
  `Namun, Pemeriksaan Semula (Re-Inspection) pada 8 September 2026 telah pun merekodkan bahawa daripada 269 item yang diperiksa, hanya 191 item (71.0%) disahkan selesai — manakala 27 item berstatus Not Complete, 18 item Not Fully Complete, dan 5 kecacatan baru dikesan (1 New Defect dan 4 New Defect from Rectification Work, iaitu kecacatan yang timbul akibat kerja pembaikan pihak tuan sendiri). Seterusnya, hasil daripada Pemeriksaan Ketiga (Third Inspection) yang dijalankan pada 24 September 2026 oleh Building Surveyor berdaftar di bawah Royal Institution of Surveyors Malaysia (RISM), didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum disempurnakan sepenuhnya — malah terdapat KECACATAN BARU yang dikesan. Ini bermakna pihak tuan telah gagal mematuhi Notis Pertama yang dikeluarkan. Laporan Pemeriksaan Ketiga penuh disertakan bersama-sama notis ini. Antara kecacatan yang masih belum diselesaikan adalah seperti berikut:`
);
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
const fn = `*Senarai lengkap kecacatan adalah sebagaimana dinyatakan di dalam Laporan Pemeriksaan Kecacatan yang telah dihantar melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan}, dan Laporan Pemeriksaan Ketiga (Third Inspection Report) bertarikh 24 September 2026 yang disertakan bersama-sama notis ini.`;
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus dan SEGERA diberikan kepada item No. 2 — rintangan elektrod bumi yang masih berada pada 56 ohm pada ujian ketiga (berbanding had di bawah 10 ohm yang ditetapkan oleh ST Domestic Electrical Installation Guidelines, Second Edition 2024, Klausa 10.8(b) bagi pemasangan dengan SPD). Walaupun sedikit penurunan dicatatkan (daripada 69 ohm), pemasangan ini KEKAL TIDAK PATUH dan keberkesanan SPD terjejas — pembetulan penuh oleh orang kompeten (competent person) dituntut dengan segera. Perhatian turut diberikan kepada kelembapan tinggi yang berterusan pada siling di dalam ceiling manhole (item No. 3, 4 dan 5 — Bathroom 3 dan Living and Dining), di mana punca dituntut dikesan dan dibaiki sepenuhnya; serta item No. 8 — getaran pada incoming pipe di Water Tank Area, iaitu KECACATAN BARU yang dikesan selepas kerja pembaikan pihak tuan dan dituntut dibaiki bersama-sama dalam tempoh notis ini.`
);
y += 4;

numPara(4,
  `Berhubung item No. 3, 4 dan 5 tersebut, pada 2 Oktober 2026 pihak tuan telah memaklumkan secara lisan/tidak rasmi bahawa "tiada kebocoran fizikal (no physical leaking)" dikesan di kawasan berkenaan. Dengan ini ditegaskan bahawa kecacatan yang dilaporkan BUKANLAH dakwaan kebocoran fizikal, tetapi bacaan KELEMBAPAN TINGGI (high moisture) yang direkodkan secara objektif oleh Building Surveyor berdaftar RISM dan kekal direkodkan sehingga Pemeriksaan Ketiga pada 24 September 2026. Kelembapan tinggi pada permukaan siling adalah petunjuk awal kemasukan atau resapan air (water ingress) — contohnya kegagalan lapisan kalis air atau resapan perlahan pada paip/sambungan di dalam ruang siling — yang lazimnya berlaku SEBELUM kebocoran kelihatan secara fizikal. Ketiadaan titisan air yang kelihatan pada hari pemeriksaan pihak tuan tidak menafikan kewujudan kecacatan ini dan tidak melepaskan kewajipan pihak tuan di bawah Klausa 27(1) untuk mengesan dan membaiki PUNCANYA. Pihak tuan dituntut mengemukakan secara BERTULIS butiran pemeriksaan yang menjadi asas dakwaan tersebut — tarikh pemeriksaan, nama pegawai, kaedah dan alat pengujian (sama ada visual semata-mata atau menggunakan moisture meter / thermal imaging camera), serta bacaan yang direkodkan.`
);
y += 4;

numPara(5,
  `Memandangkan kecacatan kelembapan tinggi ini telah dilaporkan di dalam Tempoh Liabiliti Kecacatan (DLP) sejak 31 Julai 2026, hak saya terhadap pembaikannya telah pun terpelihara. Sekiranya pihak tuan memilih untuk tidak melaksanakan sebarang kerja pembaikan atas alasan "tiada kebocoran fizikal", maka pihak tuan dituntut mengeluarkan AKUAN BERTULIS yang menyatakan: (i) kecacatan pada item No. 3, 4 dan 5 telah dilaporkan di dalam tempoh DLP; dan (ii) sekiranya kebocoran, kesan air, kulat atau apa-apa kerosakan berkaitan muncul di kawasan yang sama atau bersebelahan pada bila-bila masa, TERMASUK SELEPAS tamat tempoh DLP, pihak tuan kekal bertanggungjawab sepenuhnya untuk mengesan punca dan melaksanakan pembaikan atas kos pihak tuan sendiri, memandangkan ia merupakan lanjutan kecacatan yang sama yang telah dilaporkan dalam tempoh. Untuk kejelasan, saya TIADA HALANGAN untuk item No. 3, 4 dan 5 ini diletakkan berstatus "dalam pemerhatian" (under review/observation), TERTAKLUK kepada syarat-syarat berikut: (i) akuan bertulis sebagaimana di atas dikeluarkan oleh pihak tuan; (ii) item-item ini KEKAL direkodkan sebagai BELUM SELESAI (open/not closed) di dalam rekod pihak tuan, dan tidak boleh ditutup (closed) tanpa persetujuan bertulis daripada saya; dan (iii) pemantauan berkala dijalankan dan satu pemeriksaan semakan semula dijadualkan secara bertulis. Status "dalam pemerhatian" TANPA syarat-syarat di atas tidak memberikan sebarang perlindungan kepada pemilik dan dengan itu tidak boleh diterima.`
);
y += 4;

numPara(6,
  `Untuk rekod, saya telah merancang kerja ubah suai di hartanah tersebut (antaranya melibatkan bilik air di tingkat bawah), namun telah MENANGGUHKAN kesemua kerja tersebut sehingga isu kelembapan ini diselesaikan atau akuan bertulis di perenggan 5 dikeluarkan. Dengan itu, keadaan sedia ada di kawasan berkenaan kekal tidak diusik, dan sebarang kerosakan berkaitan air yang muncul kemudian tidak boleh dikaitkan dengan kerja ubah suai saya.`
);
y += 4;

numPara(7,
  `Dengan ini, saya mengeluarkan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis2} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadlineNotis2}. Notis Kedua ini menjadikan keseluruhan tempoh tiga puluh (30) hari telah diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan selaras dengan Klausa ${data.klausaSPA} Perjanjian Jual Beli (${data.jenisSPA}).`
);
y += 4;

numPara(8,
  `Bagi makluman pihak tuan, saya telah pun memperoleh sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bagi kesemua kerja pembaikan yang masih tertunggak — GoXpert Solution, No. Sebut Harga 00202604 bertarikh 2 Oktober 2026 — dengan jumlah keseluruhan RM7,610.00 (Ringgit Malaysia: Tujuh Ribu Enam Ratus Sepuluh Sahaja). Salinan sebut harga tersebut dilampirkan sebagai LAMPIRAN A. Sekiranya pihak tuan masih gagal menyiapkan semua kerja pembaikan dalam tempoh notis ini, jumlah tersebut atau kos sebenar yang ditanggung akan dituntut sepenuhnya daripada pihak tuan, termasuk melalui tolakan daripada Wang Tahanan 5% (Retention Sum) di bawah Klausa 27(2) dan/atau tuntutan di Tribunal Tuntutan Pembeli Rumah (TTPR).`
);
y += 4;

numPara(9,
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

numPara(10,
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

checkBreak(60);
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
// LAMPIRAN A — SEBUT HARGA
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
doc.text("Sebut Harga Rasmi Pembaikan (Official Repair Quotation)", pageW / 2, y, { align: "center" });
y += 8;

const quotImg = "data:image/jpeg;base64," + fs.readFileSync("/home/user/admin/thayaaniti-quotation.jpg").toString("base64");
const qW = 112, qH = 112 * 1400 / 991;
const qX = (pageW - qW) / 2;
doc.addImage(quotImg, "JPEG", qX, y, qW, qH);
doc.setLineWidth(0.3); bk();
doc.rect(qX, y, qW, qH);
y += qH + 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const qCap = "Sebut Harga Rasmi Pembaikan — GoXpert Solution, No. 00202604 bertarikh 2 Oktober 2026, berjumlah RM7,610.00 (sah selama 30 hari dari tarikh dikeluarkan; maklumat pembayaran dikaburkan).";
const qCapL = doc.splitTextToSize(qCap, cW - 20);
for (const c of qCapL) { doc.text(c, pageW / 2, y, { align: "center" }); y += 4.5; }

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
fs.writeFileSync("/home/user/admin/NOTIS_2_THAYAANITI.pdf", Buffer.from(out));
console.log("PDF generated: NOTIS_2_THAYAANITI.pdf");
console.log(`Total pages: ${totalPages}`);
