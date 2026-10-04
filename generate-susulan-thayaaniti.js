const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "SUSULAN-1/NOTIS-2/2026/041",

  namaPembeli: "THAYAANITI A/L RAMAN",
  alamatPengirim: [
    "Pangsapuri Pulai Mutiara 3, 06-17 Blok C,",
    "Jalan Pulai Mutiara 7/12,",
    "Taman Pulai Mutiara,",
    "81300 Johor Bahru, Johor.",
  ],
  noKP: "950124-06-5607",
  telefonPembeli: "010-918 2532",
  emailPembeli: "thaya_2401@yahoo.com",

  namaPemaju: "AVENUE GREEN DEVELOPMENT SDN. BHD.",
  noSyarikat: "(202201000586 / 1446283-D)",
  alamatPenerima: [
    "#01-03, Pangsapuri Seri 18,",
    "Jalan Persiaran Jaya Putra,",
    "Bandar Jaya Putra,",
    "81100 Johor Bahru, Johor.",
  ],

  alamatHartanah: "No. 49, Jalan Impian Indah 2, Taman Impian Indah, 81000 Kulai, Johor",

  tarikhSurat: "6 Oktober 2026",
};

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 25;
const mR = 25;
const cW = pageW - mL - mR;
let y = 0;

const SZ = { BODY: 12, SMALL: 10, FOOTNOTE: 9, FOOTER: 8, TITLE: 12 };
const LH = 6;
const LH_S = 5;

function bk() { doc.setTextColor(0, 0, 0); doc.setDrawColor(0, 0, 0); }
function newPage() { doc.addPage(); y = 25; }
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

function heading(txt) {
  checkBreak(30);
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
  const ls = doc.splitTextToSize(txt, cW);
  for (const l of ls) {
    doc.text(l, mL, y);
    doc.setLineWidth(0.3);
    doc.line(mL, y + 1, mL + doc.getTextWidth(l), y + 1);
    y += LH;
  }
  y += 2;
}

// ============ HEADER ============
y = 25;
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
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

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text(`${data.namaPemaju} ${data.noSyarikat}`, mL, y);
y += LH_S;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY);
for (const line of data.alamatPenerima) { doc.text(line, mL, y); y += LH_S; }
doc.text(data.tarikhSurat, pageW - mR, y - LH_S, { align: "right" });
y += 3;
doc.setFontSize(SZ.SMALL);
doc.text(`Ruj. Kami: ${data.noRujukan}`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.TITLE); bk();
const perkara = [
  "Surat Susulan — Maklum Balas Terhadap Dakwaan \"Tiada Kebocoran Fizikal\"",
  "(No Physical Leaking) & Tuntutan Pengesahan Bertulis",
  "Berhubung Kelembapan Tinggi (High Moisture) pada Siling",
  `Hartanah: ${data.alamatHartanah}`,
];
for (const pk of perkara) {
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
  `Dengan segala hormatnya perkara di atas dirujuk. Surat ini adalah susulan kepada Notis Kedua / Notis Akhir (Final Notice) dengan rujukan NOTIS-2/2026/041 bertarikh 5 Oktober 2026, yang antara lainnya menuntut pembaikan terhadap item No. 3, 4 dan 5 — kelembapan tinggi (high moisture) pada permukaan siling di dalam ceiling manhole di Bathroom 3 serta Living and Dining — sebagaimana disahkan oleh Pemeriksaan Ketiga (Third Inspection) yang dijalankan oleh Building Surveyor berdaftar RISM pada 24 September 2026. Kecacatan ini telah dilaporkan secara berterusan sejak Laporan Pemeriksaan Kecacatan Kali Pertama yang diserahkan pada 31 Julai 2026, iaitu di dalam Tempoh Liabiliti Kecacatan (Defect Liability Period) di bawah Klausa 27(1) Jadual G Perjanjian Jual Beli.`
);
y += 4;

numPara(2,
  `Pada 2 Oktober 2026, pihak tuan telah memaklumkan secara lisan/tidak rasmi kepada pemilik bahawa "tiada kebocoran fizikal (no physical leaking)" dikesan di kawasan berkenaan. Memandangkan maklum balas tersebut tidak dibuat secara bertulis dan tidak disertakan sebarang butiran pemeriksaan, surat ini dikeluarkan bagi merekodkan maklum balas tersebut secara BERTULIS dan menyatakan pendirian rasmi pemilik.`
);
y += 4;

heading("A. Kelembapan Tinggi Adalah Kecacatan — Bukan Sekadar \"Kebocoran Fizikal\"");

numPara(3,
  `Pendirian pemilik adalah seperti berikut: kecacatan yang dilaporkan BUKANLAH dakwaan "kebocoran fizikal", tetapi bacaan KELEMBAPAN TINGGI (high moisture) yang direkodkan secara objektif oleh Building Surveyor berdaftar RISM pada permukaan siling, dan bacaan tersebut kekal direkodkan sehingga Pemeriksaan Ketiga pada 24 September 2026. Kelembapan tinggi pada permukaan siling adalah petunjuk awal kemasukan atau resapan air (water ingress) — contohnya kegagalan lapisan kalis air, resapan perlahan pada paip atau sambungan di dalam ruang siling — yang lazimnya berlaku SEBELUM kebocoran kelihatan secara fizikal. Ketiadaan titisan air yang kelihatan pada hari pemeriksaan pihak tuan tidak menafikan kewujudan kecacatan tersebut, dan tidak melepaskan kewajipan pihak tuan di bawah Klausa 27(1) untuk mengesan dan membaiki PUNCANYA.`
);
y += 4;

heading("B. Tuntutan Butiran Pemeriksaan Pihak Tuan");

numPara(4,
  `Sehubungan dengan dakwaan "tiada kebocoran fizikal" tersebut, pihak tuan dituntut mengemukakan secara BERTULIS butiran pemeriksaan yang menjadi asas dakwaan itu, iaitu:`
);
y += 2;
bullet("Tarikh dan masa pemeriksaan dijalankan, serta nama dan jawatan pegawai/kontraktor yang menjalankannya;");
bullet("Kaedah dan alat pengujian yang digunakan — sama ada pemeriksaan visual semata-mata, atau menggunakan moisture meter / thermal imaging camera; dan");
bullet("Bacaan kelembapan yang direkodkan oleh pihak tuan di setiap lokasi berkenaan (item No. 3, 4 dan 5), bagi dibandingkan dengan bacaan Building Surveyor RISM.");
y += 2;

numPara(5,
  `Sekiranya pemeriksaan pihak tuan dibuat secara visual semata-mata, dakwaan "tiada kebocoran fizikal" tersebut tidak setara dan tidak boleh menyangkal bacaan kelembapan yang direkodkan dengan alat pengukuran. Sebagai alternatif, pemilik bersedia untuk satu PEMERIKSAAN BERSAMA (joint inspection) di mana bacaan kelembapan diambil menggunakan moisture meter dan/atau thermal imaging camera di hadapan kedua-dua pihak, dan direkodkan secara bertulis.`
);
y += 4;

heading("C. Tuntutan Akuan Liabiliti Bertulis");

numPara(6,
  `Memandangkan kecacatan ini telah dilaporkan di dalam Tempoh Liabiliti Kecacatan (DLP), hak pemilik terhadap pembaikannya telah pun terpelihara. Sekiranya pihak tuan memilih untuk tidak melaksanakan sebarang kerja pembaikan sekarang atas alasan "tiada kebocoran fizikal", maka pihak tuan dituntut mengeluarkan AKUAN BERTULIS yang menyatakan: (i) kecacatan kelembapan tinggi pada item No. 3, 4 dan 5 telah dilaporkan di dalam tempoh DLP; dan (ii) sekiranya kebocoran, kesan air, kulat, atau apa-apa kerosakan berkaitan muncul di kawasan yang sama atau bersebelahan pada bila-bila masa, TERMASUK SELEPAS tamat tempoh DLP, pihak tuan kekal bertanggungjawab sepenuhnya untuk mengesan punca dan melaksanakan pembaikan atas kos pihak tuan sendiri, memandangkan ia merupakan lanjutan kecacatan yang sama yang telah dilaporkan dalam tempoh. Tanpa akuan bertulis sedemikian, sebarang cadangan untuk meletakkan perkara ini sebagai "dalam pemerhatian" (under review/observation) adalah TIDAK DITERIMA.`
);
y += 4;

heading("D. Kerja Ubah Suai Ditangguhkan — Keadaan Sedia Ada Tidak Diusik");

numPara(7,
  `Untuk rekod, pemilik telah merancang kerja ubah suai di hartanah tersebut (antaranya melibatkan bilik air di tingkat bawah), namun telah MENANGGUHKAN kesemua kerja tersebut sehingga isu kelembapan ini diselesaikan atau akuan bertulis di perenggan 6 dikeluarkan. Dengan itu, keadaan sedia ada di kawasan berkenaan kekal tidak diusik, dan sebarang kerosakan berkaitan air yang muncul kemudian tidak boleh dikaitkan dengan kerja ubah suai pemilik.`
);
y += 4;

heading("E. Tempoh Notis Kedua Kekal Berkuat Kuasa");

numPara(8,
  `Surat ini TIDAK melanjutkan mahupun menggantikan tempoh yang ditetapkan di dalam Notis Kedua. Tarikh akhir MUKTAMAD pembaikan kekal pada 20 Oktober 2026, dan kesemua jawapan bertulis serta dokumen yang dituntut di dalam surat ini hendaklah dikemukakan dalam tempoh yang sama. Kegagalan berbuat demikian akan mengakibatkan tindakan selanjutnya diteruskan sebagaimana dinyatakan di dalam Notis Kedua, termasuk tuntutan di Tribunal Tuntutan Pembeli Rumah (TTPR).`
);
y += 4;

numPara(9,
  `Merujuk kepada klausa Service of Documents (Klausa 29(1) Jadual G) di dalam Perjanjian Jual Beli, surat ini yang dihantar melalui serahan tangan atau pos berdaftar adalah dianggap sah diserahkan.`
);
y += 4;

checkBreak(80);
para("Saya berharap pihak tuan memberikan maklum balas bertulis terhadap setiap perkara di atas dalam tempoh yang ditetapkan. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.");
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
doc.text(`Telefon: ${data.telefonPembeli}`, mL, y); y += LH_S;

// ============ AKUAN TERIMA x2 ============
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
  const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Surat Susulan — Maklum Balas Terhadap Dakwaan "Tiada Kebocoran Fizikal" & Tuntutan Pengesahan Bertulis bertarikh ${data.tarikhSurat} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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

// ============ FOOTER ============
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
fs.writeFileSync("/home/user/admin/SURAT_SUSULAN_THAYAANITI.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_SUSULAN_THAYAANITI.pdf");
console.log(`Total pages: ${totalPages}`);
