const { jsPDF } = require("jspdf");
const fs = require("fs");

const baseData = {
  noRujukan: "NOTIS-1/2026/015",

  namaPembeli: "RAJSHRMELA A/P RAJAGOPAL",
  alamatPengirim: [
    "No. 34, Jalan Makmur 14,",
    "Taman Damai Jaya,",
    "81300 Skudai,",
    "Johor Bahru, Johor.",
  ],
  noKP: "920609-01-6216",
  telefonPembeli: "010-887 4423",
  emailPembeli: "Shrmelarajagopal@yahoo.com.my",

  namaPemaju: "INTACT CORPORATE APPROACH SDN BHD",
  noSyarikat: "(201301019840 / 1049670-K)",

  alamatHartanah: "No. 27, Jalan Puncak Warisan 2/1, Puncak Warisan, 81900 Kota Tinggi, Johor",
  jenisHartanah: "Rumah Teres 2 Tingkat",
  namaProyek: "Puncak Warisan — Laman Iskandaria (Phase 1B), Unit No. 181",

  noSPA: "SSP/NAZ/ICA-181/005/1022/ina",
  tarikhSPA: "21 Oktober 2022",
  jenisSPA: "Jadual G",
  klausaPembaikan: "27(1)",
  klausaSerahan: "29(1)",
  tempohDLP: "24",

  tarikhPemeriksaan1: "7 April 2026",
  tarikhPemeriksaan2: "3 Julai 2026",
  tarikhSerahanLaporan: "20 April 2026",
  kaedahSerahanLaporan: "serahan tangan (hardcopy)",
  tarikhSerahanLaporan2: "20 Julai 2026",

  tarikhNotis: "22 Julai 2026",
  tarikhDeadline: "6 Ogos 2026",
  tempohNotis1: "15",
  tempohNotis2: "15",

  kecacatan: [
    { tag: "3", lokasi: "Car Porch — Wall", kecacatan: "Air bertakung di atas dinding pagar (Water stagnant on top of fence wall)", status: "Belum Dibaiki" },
    { tag: "18", lokasi: "Car Porch — TNB Chamber", kecacatan: "Kerosakan pada bingkai TNB chamber (Damaged on TNB chamber frame)", status: "Belum Dibaiki" },
    { tag: "19", lokasi: "Car Porch — TNB Chamber", kecacatan: "Keretakan pada dinding TNB chamber — keretakan dan RC terdedah (berkarat) di dalam TNB compactman", status: "Belum Dibaiki" },
    { tag: "20", lokasi: "Car Porch — TNB Chamber", kecacatan: "Pertumbuhan kulat pada TNB chamber — tanda air bertakung dan kelembapan (Mould growth, sign of water stagnant and moisture)", status: "Belum Dibaiki" },
    { tag: "23", lokasi: "Car Porch — TNB Chamber", kecacatan: "Kunci pintu TNB chamber sukar ditutup (TNB chamber door lock hard to close)", status: "Belum Dibaiki" },
    { tag: "47", lokasi: "External Area — Floor", kecacatan: "Keretakan pada apron slab — masih terdapat keretakan dan chipping", status: "Belum Dibaiki" },
    { tag: "58", lokasi: "Living and Dining — Ceiling", kecacatan: "Kebocoran pada siling — masih terdapat kebocoran aktif pada permukaan siling (active leaking)", status: "Belum Dibaiki" },
    { tag: "143", lokasi: "Master Bedroom — Wall", kecacatan: "Reka bentuk dinding bercat tidak mengikut pelan lantai Perjanjian Jual Beli (S&P Review — design not as per floor plan)", status: "Belum Diselesaikan" },
    { tag: "144", lokasi: "Master Bedroom — Wall", kecacatan: "Reka bentuk dinding tidak mengikut pelan lantai Perjanjian Jual Beli (S&P Review — design not as per floor plan)", status: "Belum Diselesaikan" },
    { tag: "228", lokasi: "Ceiling Area (Bedroom 2) — M&E", kecacatan: "Trunking cover hilang — kabel elektrik terdedah (Missing trunking cover, exposed electrical cable)", status: "Belum Dibaiki" },
    { tag: "245", lokasi: "Top Roof — Roof Gutter", kecacatan: "Air bertakung pada roof gutter (Sign of water stagnant on the roof gutter)", status: "Belum Dibaiki" },
    { tag: "246", lokasi: "Top Roof — Roof Flashing", kecacatan: "Skru berkarat dan lubang tidak ditutup pada roof flashing (Corroded screws and unsealed holes)", status: "Belum Dibaiki" },
  ],

  kronologi: [
    { tarikh: "21 Oktober 2022", peristiwa: "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G" },
    { tarikh: "7 April 2026", peristiwa: "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah" },
    { tarikh: "20 April 2026", peristiwa: "Laporan Pemeriksaan Kecacatan (laporan penuh tanpa electrical) diserahkan kepada pemaju secara serahan tangan — dicop 'Received' oleh pemaju" },
    { tarikh: "20 Mei 2026", peristiwa: "Tamat tempoh 30 hari pembaikan oleh pemaju — pembaikan masih belum disiapkan sepenuhnya" },
    { tarikh: "21 Mei 2026", peristiwa: "Pemeriksaan tambahan (electrical) dijalankan ke atas hartanah" },
    { tarikh: "3 Julai 2026", peristiwa: "Pemeriksaan Kecacatan Kali Kedua / Re-Inspection dijalankan — kecacatan masih wujud" },
    { tarikh: "20 Julai 2026", peristiwa: "Laporan Re-Inspection diserahkan kepada pemaju secara serahan tangan" },
    { tarikh: "22 Julai 2026", peristiwa: "Notis Pertama (First Notice) dikeluarkan" },
    { tarikh: "6 Ogos 2026", peristiwa: "Tarikh akhir pembaikan (15 hari dari Notis Pertama)" },
  ],
};

const VERSIONS = [
  {
    label: "HQ",
    alamatPenerima: [
      "Level 18, Ho Hup Tower,",
      "1, Persiaran Jalil 1,",
      "Bandar Bukit Jalil,",
      "57000 Kuala Lumpur.",
    ],
    salinanKepada: {
      nama: "INTACT CORPORATE APPROACH SDN BHD",
      keterangan: "(Pejabat Johor / Johor Office)",
      alamat: "No. 265, Jalan Kenanga 29/8, Indahpura, 81000 Kulai, Johor.",
    },
    output: "/home/user/admin/NOTIS_1_RAJ_HQ.pdf",
  },
  {
    label: "JOHOR",
    alamatPenerima: [
      "No. 265, Jalan Kenanga 29/8,",
      "Indahpura,",
      "81000 Kulai,",
      "Johor.",
    ],
    salinanKepada: {
      nama: "INTACT CORPORATE APPROACH SDN BHD",
      keterangan: "(Ibu Pejabat / Headquarters)",
      alamat: "Level 18, Ho Hup Tower, 1, Persiaran Jalil 1, Bandar Bukit Jalil, 57000 Kuala Lumpur.",
    },
    output: "/home/user/admin/NOTIS_1_RAJ_JOHOR.pdf",
  },
];

function generate(version) {
  const data = { ...baseData, alamatPenerima: version.alamatPenerima, salinanKepada: [version.salinanKepada] };

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

  // PAGE 1 — SURAT UTAMA
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
    `Saya, ${data.namaPembeli} (No. K/P: ${data.noKP}), pemilik unit hartanah di alamat di atas, sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh ${data.tarikhSPA} (Ruj: ${data.noSPA}) mengikut ${data.jenisSPA}, telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui ${data.kaedahSerahanLaporan} pada ${data.tarikhSerahanLaporan} dan telah dicop terima oleh pihak tuan. Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan.`
  );
  y += 4;

  numPara(2,
    `Namun, walaupun pihak tuan telah melaksanakan sebahagian kerja pembaikan, didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum disiapkan sepenuhnya. Berdasarkan pemeriksaan kali kedua (Re-Inspection) pada ${data.tarikhPemeriksaan2}, yang laporannya telah diserahkan kepada pihak tuan pada ${data.tarikhSerahanLaporan2}, kecacatan yang masih wujud dan belum dibaiki antaranya adalah seperti berikut:`
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
  const fn = `*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung dalam Laporan Re-Inspection yang telah diserahkan kepada pihak tuan secara serahan tangan pada ${data.tarikhSerahanLaporan2}, serta Laporan Pemeriksaan Pertama yang diserahkan pada ${data.tarikhSerahanLaporan}.`;
  const fnL = doc.splitTextToSize(fn, cW);
  for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
  y += 5;

  numPara(3,
    `Selain daripada kecacatan fizikal di atas, pemeriksaan turut mendapati terdapat perkara yang tidak selaras dengan Perjanjian Jual Beli dan pelan lantai (floor plan) yang diluluskan, iaitu reka bentuk dinding di Master Bedroom (rujuk No. 143 dan 144 dalam senarai di atas), dan banyak lagi sebagaimana yang dinyatakan di dalam laporan pemeriksaan. Sehubungan itu, saya menuntut agar pihak tuan memberikan maklum balas rasmi secara bertulis berserta dokumentasi yang sewajarnya (proper documentation) — termasuk pelan pindaan yang diluluskan oleh Pihak Berkuasa, jika ada — bagi menjelaskan percanggahan tersebut kepada saya selaku pembeli. Sekiranya percanggahan ini tidak dapat dibuktikan sebagai pindaan yang sah, saya berhak menuntut pembetulan atau pampasan yang sewajarnya di bawah Perjanjian Jual Beli.`
  );
  y += 4;

  numPara(4,
    `Klausa ${data.klausaPembaikan} ${data.jenisSPA} Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh ${data.tempohDLP} bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period).`
  );
  y += 4;

  numPara(5,
    `Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh ${data.tempohNotis1} hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan ${data.tempohNotis2} hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan.`
  );
  y += 4;

  numPara(6, "Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:");
  y += 2;
  bullet("Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;");
  bullet("Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;");
  bullet("Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan");
  bullet("Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.");
  y += 4;

  numPara(7,
    `Merujuk kepada klausa Service of Documents (Klausa ${data.klausaSerahan} ${data.jenisSPA}) di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi. Notis ini dihantar ke kedua-dua alamat pihak tuan iaitu ibu pejabat dan pejabat Johor.`
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

  // CC section
  checkBreak(18);
  doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
  doc.text("s.k. (CC):", mL, y);
  y += LH_S;
  for (const cc of data.salinanKepada) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
    doc.text(`${cc.nama} ${cc.keterangan}`, mL + 5, y); y += LH_S;
    doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
    const ccLines = doc.splitTextToSize(cc.alamat, cW - 5);
    for (const al of ccLines) { doc.text(al, mL + 5, y); y += LH_S; }
    y += 2;
  }

  // KRONOLOGI
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

  // AKUAN TERIMA x 2
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

  // FOOTER
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
  fs.writeFileSync(version.output, Buffer.from(out));
  console.log(`PDF generated: ${version.output} (${totalPages} pages)`);
}

for (const v of VERSIONS) generate(v);
