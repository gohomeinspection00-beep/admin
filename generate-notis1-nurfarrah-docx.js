const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, PageBreak, ShadingType,
} = require("docx");
const fs = require("fs");

const D = {
  ruj: "NOTIS-1/2026/039",
  nama: "NURFARRAH AMIERA MOHD AZLAN",
  alamat: ["No. 45, Jalan TU 22,", "Taman Tasik Utama,", "75450 Ayer Keroh,", "Melaka."],
  kp: "941002-01-6562",
  tel: "018-465 4209",
  emel: "farramiera94@gmail.com",
  pemaju: "MERLIMAU LAND SDN. BHD.",
  noSyarikat: "(201401015597 / 1091684-M)",
  penerima: ["PARKLAND GROUP", "(bagi pihak MERLIMAU LAND SDN. BHD. (201401015597 / 1091684-M))", "(Parkland Headquarters Office)", "No. 112, Jalan Tun Perak,", "75300 Melaka."],
  hartanah: "JD 6317, Jalan Desa Sungai Rambai 1, Taman Desa Sungai Rambai, 77400 Sungai Rambai, Melaka",
  jenis: "Rumah Berkembar 1 Tingkat (Semi-Detached House 1 Storey, PT 3916, H.S.(M) 1650)",
  projek: "Taman Desa Sungai Rambai, Mukim Sungei Rambai, Jasin",
  tarikhNotis: "7 September 2026",
  deadline: "22 September 2026",
};

const defects = [
  ["1", "Finding — M&E", "Wire connector tidak dibekalkan untuk semua titik elektrik — masih tiada (Missing wire connector for all electrical points)", "Belum Diselesaikan"],
  ["3", "Car Porch — Floor", "Keretakan dengan bunyi hollow pada permukaan papak masih ada (Crack with hollow sound on slab surface)", "Belum Diselesaikan"],
  ["4", "Car Porch — Floor", "Keretakan dan kerosakan (chipping) pada permukaan papak lantai / saliran masih ada", "Belum Diselesaikan"],
  ["8", "Car Porch — Wall", "Kerosakan pada tiang pintu pagar masih ada (Damage on gate pillar)", "Belum Diselesaikan"],
  ["10", "Car Porch — Fixtures", "Platform tong sampah longgar / tidak kukuh dan sokongan tidak sempurna masih ada", "Belum Diselesaikan"],
  ["13", "Terrace — Ceiling", "Keretakan pada penjuru siling / ceiling jointing masih ada", "Belum Diselesaikan"],
  ["14", "Terrace — Plumbing & Sanitary", "Air bertakung pada U-drain masih ada (Water stagnant on U-drain)", "Belum Diselesaikan"],
  ["15", "Terrace — Plumbing & Sanitary", "Sistem saliran tidak sempurna — air bertakung dalam manhole; tanah merah keluar semasa ujian flushing; cerun paip antara manhole tidak mencukupi; aliran flushing master bathroom terus ke paip hadapan dan bukan ke tangki septik (Poor Drainage System — Major)", "Belum Diselesaikan"],
  ["17", "Backyard — Plumbing & Sanitary", "Ujian flushing semua bilik air mengeluarkan tanah merah; manhole dipenuhi tanah menyebabkan air bertakung — cerun paip keluar perlu disemak (Poor Drainage System)", "Belum Diselesaikan"],
  ["18", "Bedroom 4 — Wall", "Keretakan pada dinding bercat masih ada", "Belum Diselesaikan"],
  ["19", "Bedroom 3 — Wall", "Keretakan pada permukaan dinding masih ada", "Belum Diselesaikan"],
  ["21", "Bathroom 2 — Plumbing & Sanitary", "Kepala paip air longgar masih ada (Loose water tap)", "Belum Diselesaikan"],
  ["22", "Bedroom 2 — Wall", "Keretakan pada dinding bercat masih ada", "Belum Diselesaikan"],
  ["25", "Master Bedroom — Wall", "Cat tidak sekata pada dinding masih ada (Uneven paint/surface)", "Belum Diselesaikan"],
  ["26", "Bathroom 1 — Plumbing & Sanitary", "Mangkuk tandas longgar masih ada (Loose toilet bowl)", "Belum Diselesaikan"],
];

const kron = [
  ["26 Jun 2024", "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G"],
  ["15 Julai 2026", "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah"],
  ["20 Julai 2026", "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju secara serahan tangan (hardcopy)"],
  ["19 Ogos 2026", "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disempurnakan"],
  ["3 September 2026", "Pemeriksaan Semula (Re-Inspection) dijalankan — kecacatan masih belum diselesaikan; Laporan Re-Inspection disertakan bersama notis ini"],
  ["7 September 2026", "Notis Pertama (First Notice) dikeluarkan"],
  ["22 September 2026", "Tarikh akhir pembaikan (15 hari dari Notis Pertama)"],
];

const F = "Helvetica";
function t(text, opts = {}) { return new TextRun({ text, font: F, size: 24, ...opts }); }
function p(children, opts = {}) { return new Paragraph({ spacing: { after: 120, line: 300 }, ...opts, children }); }
function numPara(num, text) {
  return new Paragraph({
    spacing: { after: 160, line: 300 },
    indent: { left: 567, hanging: 567 },
    children: [t(`${num}.\t${text}`)],
  });
}
function bullet(text) {
  return new Paragraph({
    spacing: { after: 80, line: 300 },
    indent: { left: 1100, hanging: 280 },
    children: [t(`•  ${text}`)],
  });
}
function cell(text, w, bold = false) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({ children: [t(text, { bold, size: 20 })] })],
  });
}

const colW = [900, 2300, 4600, 1500];
const defTable = new Table({
  columnWidths: colW,
  width: { size: colW.reduce((a, b) => a + b), type: WidthType.DXA },
  rows: [
    new TableRow({ children: [cell("No.", colW[0], true), cell("Lokasi", colW[1], true), cell("Kecacatan (Defect)", colW[2], true), cell("Status", colW[3], true)] }),
    ...defects.map(r => new TableRow({ children: r.map((c, i) => cell(c, colW[i])) })),
  ],
});

const kronW = [2200, 7100];
const kronTable = new Table({
  columnWidths: kronW,
  width: { size: kronW.reduce((a, b) => a + b), type: WidthType.DXA },
  rows: [
    new TableRow({ children: [cell("Tarikh (Date)", kronW[0], true), cell("Peristiwa (Event)", kronW[1], true)] }),
    ...kron.map(r => new TableRow({ children: r.map((c, i) => cell(c, kronW[i])) })),
  ],
});

function akuan(label) {
  return [
    new Paragraph({ children: [new PageBreak()] }),
    p([t(label, { italics: true, size: 20 })], { alignment: AlignmentType.RIGHT }),
    p([t("AKUAN TERIMA OLEH PEMAJU", { bold: true, underline: {} })], { alignment: AlignmentType.CENTER }),
    p([t("(Developer's Acknowledgement of Receipt)", { size: 20 })], { alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
    p([t(`Dengan ini diakui bahawa PARKLAND GROUP, bagi pihak ${D.pemaju} ${D.noSyarikat}, telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh ${D.tarikhNotis} dengan rujukan ${D.ruj} daripada ${D.nama} berhubung hartanah di ${D.hartanah}.`)], { spacing: { after: 500, line: 300 } }),
    p([t("Diterima oleh:", { bold: true })], { spacing: { after: 400 } }),
    p([t("Nama\t: ______________________________________")], { spacing: { after: 400 } }),
    p([t("Jawatan\t: ______________________________________")], { spacing: { after: 400 } }),
    p([t("Tarikh\t: ______________________________________")], { spacing: { after: 500 } }),
    p([t("Cop Syarikat (Company Stamp):", { bold: true, size: 20 })], { spacing: { after: 2000 } }),
  ];
}

const doc = new Document({
  styles: { default: { document: { run: { font: F, size: 24 } } } },
  sections: [{
    properties: { page: { margin: { top: 1418, bottom: 1418, left: 1418, right: 1418 } } },
    children: [
      p([t(D.nama, { bold: true })], { spacing: { after: 40 } }),
      ...D.alamat.map(a => p([t(a)], { spacing: { after: 20 } })),
      p([t(`No. K/P: ${D.kp}`, { size: 20 })], { spacing: { after: 20 } }),
      p([t(`E-mel: ${D.emel}`, { size: 20 })], { spacing: { after: 20 } }),
      p([t(`Tel: ${D.tel}`, { size: 20 })], { spacing: { after: 120 } }),
      new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" } }, children: [], spacing: { after: 200 } }),
      p([t(D.penerima[0], { bold: true })], { spacing: { after: 20 } }),
      p([t(D.penerima[1], { size: 20 })], { spacing: { after: 20 } }),
      ...D.penerima.slice(2).map(a => p([t(a)], { spacing: { after: 20 } })),
      p([t(`Tarikh: ${D.tarikhNotis}`)], { alignment: AlignmentType.RIGHT, spacing: { after: 60 } }),
      p([t(`Ruj. Kami: ${D.ruj}`, { size: 20 })], { spacing: { after: 200 } }),
      p([t("Tuan,")], { spacing: { after: 200 } }),
      p([t("Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim)", { bold: true, underline: {} })], { spacing: { after: 40 } }),
      p([t(`Hartanah: ${D.jenis}`, { bold: true, underline: {} })], { spacing: { after: 40 } }),
      p([t(`di ${D.hartanah}`, { bold: true, underline: {} })], { spacing: { after: 240 } }),
      p([t(`Saya, ${D.nama} (No. K/P: ${D.kp}), pemilik unit hartanah di alamat di atas (Projek: ${D.projek}), sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh 26 Jun 2024 (No. Rujukan SPA: 19626-3/eSPA/260624/PT3916/01) mengikut Jadual G, telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada 15 Julai 2026 dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui serahan tangan (hardcopy) pada 20 Julai 2026. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`)]),
      numPara(2, "Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada 19 Ogos 2026, Pemeriksaan Semula (Re-Inspection) yang dijalankan pada 3 September 2026 mendapati kecacatan masih belum diselesaikan oleh pihak tuan. Laporan Re-Inspection penuh disertakan bersama-sama notis ini sebagai serahan rasmi. Antara kecacatan yang masih wujud dan belum diselesaikan adalah seperti berikut:"),
      p([t("Senarai Kecacatan yang Masih Belum Diselesaikan:", { bold: true })], { spacing: { after: 120 } }),
      defTable,
      p([t("*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung dalam Laporan Re-Inspection bertarikh 3 September 2026 yang disertakan bersama-sama notis ini, serta Laporan Pemeriksaan Kecacatan Kali Pertama yang diserahkan pada 20 Julai 2026.", { italics: true, size: 18 })], { spacing: { before: 120, after: 240 } }),
      numPara(3, "Perhatian khusus diberikan kepada item No. 15 dan No. 17 — sistem saliran hartanah didapati tidak sempurna: air bertakung di dalam manhole akibat cerun paip yang tidak mencukupi antara manhole, tanah merah keluar semasa ujian flushing, dan aliran flushing dari master bathroom didapati terus ke paip hadapan dan bukan ke tangki septik sebagaimana sepatutnya. Saya menuntut agar pihak tuan menyemak semula dan membaiki keseluruhan sistem saliran dan kecerunan paip, bukan sekadar pembersihan manhole."),
      numPara(4, "Klausa 27(1) Jadual G Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh 24 bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period), dalam masa tiga puluh (30) hari selepas menerima notis bertulis daripada pembeli."),
      numPara(5, `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh 15 hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${D.deadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan 15 hari.`),
      numPara(6, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:"),
      bullet("Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;"),
      bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;"),
      bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan"),
      bullet("Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang."),
      numPara(7, "Merujuk kepada klausa Service of Documents (Klausa 29(1) Jadual G) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi."),
      p([t("Peringatan Tindakan Undang-undang (Legal Action Notice)", { bold: true, underline: {} })], { spacing: { after: 160 } }),
      numPara(8, "Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya."),
      p([t("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.")]),
      p([t("Sekian.")], { spacing: { after: 400 } }),
      p([t("Yang benar,")], { spacing: { after: 700 } }),
      p([t("_________________________________")], { spacing: { after: 40 } }),
      p([t(`(${D.nama})`, { bold: true })], { spacing: { after: 40 } }),
      p([t(`No. K/P: ${D.kp}`, { size: 20 })], { spacing: { after: 20 } }),
      p([t(`E-mel: ${D.emel}`, { size: 20 })], { spacing: { after: 20 } }),
      p([t(`Telefon: ${D.tel}`, { size: 20 })], { spacing: { after: 120 } }),
      new Paragraph({ children: [new PageBreak()] }),
      p([t("KRONOLOGI TINDAKAN", { bold: true, underline: {} })], { alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
      p([t("(Chronology of Actions)", { size: 20 })], { alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
      kronTable,
      ...akuan("Salinan Pemaju (Developer's Copy)"),
      ...akuan("Salinan Pemilik (Owner's Copy)"),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/user/admin/NOTIS_1_NURFARRAH.docx", buf);
  console.log("DOCX generated: NOTIS_1_NURFARRAH.docx");
});
