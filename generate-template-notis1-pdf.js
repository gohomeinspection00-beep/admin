const { jsPDF } = require("jspdf");
const fs = require("fs");

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 25;
const mR = 25;
const cW = pageW - mL - mR;
let y = 25;
let pageNum = 1;

const BODY = 11.5, SMALL = 10, FOOT = 8;
const LH = 5.8;

function newPage() { doc.addPage(); pageNum++; y = 25; }
function checkBreak(n = 12) { if (y + n > pageH - 20) { newPage(); return true; } return false; }

// Rich paragraph: runs = [{t, hl, bold, italic, size}]
function rich(runs, opts = {}) {
  const { indent = 0, spacing = 4 } = opts;
  const maxW = cW - indent;
  let x = mL + indent;
  checkBreak(LH + 2);
  for (const run of runs) {
    const size = run.size || BODY;
    const style = run.bold && run.italic ? "bolditalic" : run.bold ? "bold" : run.italic ? "italic" : "normal";
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const words = String(run.t).split(/(\s+)/).filter(w => w.length);
    for (const w of words) {
      const ww = doc.getTextWidth(w);
      if (x + ww > mL + indent + maxW - 0.5 && x > mL + indent) {
        x = mL + indent;
        y += LH;
        checkBreak(LH + 2);
        if (/^\s+$/.test(w)) continue;
      }
      if (run.hl && !/^\s+$/.test(w)) {
        doc.setFillColor(255, 242, 0);
        const h = size * 0.42;
        doc.rect(x - 0.3, y - h + 0.8, ww + 0.6, h + 0.8, "F");
      } else if (run.hl && /^\s+$/.test(w)) {
        doc.setFillColor(255, 242, 0);
        const h = size * 0.42;
        doc.rect(x, y - h + 0.8, ww, h + 0.8, "F");
      }
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", style);
      doc.setFontSize(size);
      doc.text(w, x, y);
      if (run.underline && !/^\s+$/.test(w)) {
        doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
        doc.line(x, y + 1, x + ww, y + 1);
      }
      x += ww;
    }
  }
  y += LH + spacing;
}

const T = (t, o = {}) => ({ t, ...o });
const H = (t, o = {}) => ({ t, hl: true, ...o });

// Highlighted table cell text draw
function drawTable(headers, rows, colWidths, hlRows = true) {
  const pad = 2.2, rlh = 4.6, fs = 9.5;
  function rowH(cells) {
    let mx = rlh + pad * 2;
    doc.setFontSize(fs);
    for (let c = 0; c < cells.length; c++) {
      const ls = doc.splitTextToSize(String(cells[c]), colWidths[c] - pad * 2);
      mx = Math.max(mx, ls.length * rlh + pad * 2);
    }
    return mx;
  }
  function drawRow(cells, ry, rh, isH, hlRow) {
    let cx = mL;
    for (let c = 0; c < cells.length; c++) {
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3);
      doc.rect(cx, ry, colWidths[c], rh);
      doc.setFont("helvetica", isH ? "bold" : "normal"); doc.setFontSize(fs);
      const ls = doc.splitTextToSize(String(cells[c]), colWidths[c] - pad * 2);
      let ty = ry + pad + rlh - 1.2;
      for (const l of ls) {
        if (hlRow && !isH) {
          doc.setFillColor(255, 242, 0);
          doc.rect(cx + pad - 0.3, ty - fs * 0.38, doc.getTextWidth(l) + 0.6, fs * 0.42 + 0.8, "F");
        }
        doc.setTextColor(0, 0, 0);
        doc.text(l, cx + pad, ty);
        ty += rlh;
      }
      cx += colWidths[c];
    }
  }
  const hh = rowH(headers);
  checkBreak(hh + 5);
  drawRow(headers, y, hh, true, false);
  y += hh;
  for (const row of rows) {
    const rh = rowH(row);
    checkBreak(rh + 2);
    drawRow(row, y, rh, false, hlRows);
    y += rh;
  }
}

// ============ TITLE NOTE ============
doc.setFillColor(255, 242, 0);
doc.rect(mL, y - 5, cW, 8, "F");
doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0, 0, 0);
doc.text("TEMPLATE NOTIS 1 — teks ber-HIGHLIGHT KUNING perlu ditukar ikut client", pageW / 2, y, { align: "center" });
y += 10;

// ============ PENGIRIM ============
rich([H("NAMA PENUH PEMBELI (HURUF BESAR)", { bold: true })], { spacing: 0.5 });
rich([H("Alamat surat-menyurat baris 1,")], { spacing: 0.5 });
rich([H("Alamat baris 2,")], { spacing: 0.5 });
rich([H("Poskod, Bandar, Negeri.")], { spacing: 0.5 });
rich([T("No. K/P: ", { size: SMALL }), H("XXXXXX-XX-XXXX", { size: SMALL })], { spacing: 0.5 });
rich([T("E-mel: ", { size: SMALL }), H("emel@contoh.com", { size: SMALL })], { spacing: 0.5 });
rich([T("Tel: ", { size: SMALL }), H("01X-XXX XXXX", { size: SMALL })], { spacing: 1 });

doc.setLineWidth(0.5); doc.setDrawColor(0, 0, 0);
doc.line(mL, y, pageW - mR, y);
y += 7;

// ============ PENERIMA ============
rich([H("NAMA PEMAJU SDN. BHD. (No. Pendaftaran Syarikat)", { bold: true })], { spacing: 0.5 });
rich([H("Alamat pemaju baris 1,")], { spacing: 0.5 });
rich([H("Alamat pemaju baris 2,")], { spacing: 0.5 });
rich([H("Poskod, Bandar, Negeri.")], { spacing: 0.5 });

doc.setFont("helvetica", "bold"); doc.setFontSize(BODY);
const dt = "TARIKH NOTIS (cth: 15 Ogos 2026)";
const dtw = doc.getTextWidth(dt);
doc.setFillColor(255, 242, 0);
doc.rect(pageW - mR - dtw - 0.5, y - BODY * 0.42 + 0.8, dtw + 1, BODY * 0.42 + 0.8, "F");
doc.setTextColor(0, 0, 0);
doc.text(dt, pageW - mR, y, { align: "right" });
y += 7;

rich([T("Ruj. Kami: ", { size: SMALL }), H("NOTIS-1/2026/0XX", { size: SMALL })], { spacing: 3 });
rich([T("Tuan,")], { spacing: 3 });

// ============ PERKARA ============
rich([T("Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim)", { bold: true, underline: true })], { spacing: 0.5 });
rich([T("Hartanah: ", { bold: true, underline: true }), H("Jenis rumah (cth: Rumah Teres 2 Tingkat)", { bold: true, underline: true })], { spacing: 0.5 });
rich([T("di ", { bold: true, underline: true }), H("Alamat penuh unit hartanah", { bold: true, underline: true })], { spacing: 4 });

// ============ PERENGGAN ============
rich([
  T("Saya, "), H("NAMA PEMBELI"), T(" (No. K/P: "), H("XXXXXX-XX-XXXX"),
  T("), pemilik unit hartanah di alamat di atas, sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh "),
  H("TARIKH SPA"), T(" (No. Rujukan SPA: "), H("NO RUJUKAN SPA"), T(") mengikut "), H("Jadual G / Jadual H"),
  T(", telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui "),
  H("kaedah serahan (cth: aplikasi XXX / serahan tangan)"), T(" pada "), H("TARIKH SERAHAN LAPORAN"),
  T(". Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan."),
]);

rich([
  T("2.   Namun, sehingga tarikh notis ini dikeluarkan, didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum dilaksanakan sepenuhnya oleh pihak tuan. "),
  H("[PILIHAN — jika ada pemeriksaan kali kedua: \"Berdasarkan pemeriksaan kali kedua pada TARIKH, ...\"]"),
  T(" Kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:"),
]);

rich([T("Senarai Kecacatan yang Masih Belum Diselesaikan:", { bold: true })], { spacing: 1 });

drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  [
    ["TAG", "Lokasi — Elemen", "Keterangan kecacatan (BM + English dalam kurungan)", "Belum Dibaiki"],
    ["TAG", "Lokasi — Elemen", "Keterangan kecacatan", "Belum Dibaiki Sepenuhnya"],
    ["...", "(tambah baris ikut bilangan defect)", "...", "..."],
  ],
  [15, 38, 72, 35]
);
y += 4;

rich([
  T("*Senarai di atas bukanlah senarai penuh. Kecacatan lain adalah sebagaimana terkandung dalam Laporan Pemeriksaan Kecacatan yang telah diserahkan kepada pihak tuan melalui ", { italic: true, size: 9 }),
  H("kaedah serahan", { italic: true, size: 9 }), T(" pada ", { italic: true, size: 9 }), H("TARIKH SERAHAN", { italic: true, size: 9 }), T(".", { italic: true, size: 9 }),
]);

rich([
  T("3.   Klausa "), H("27(1) [Jadual G] / 26(1) atau 30(1) [Jadual H — semak SPA]"),
  T(" Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh 24 bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period)."),
]);

rich([
  T("4.   Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh 15 hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada "),
  H("TARIKH DEADLINE (tarikh notis + 15 hari kalendar)"),
  T(". Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan 15 hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan."),
]);

rich([T("5.   Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:")], { spacing: 1 });
rich([T("•  Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;")], { indent: 8, spacing: 1 });
rich([T("•  Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;")], { indent: 8, spacing: 1 });
rich([T("•  Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan")], { indent: 8, spacing: 1 });
rich([T("•  Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.")], { indent: 8 });

rich([
  T("6.   Merujuk kepada klausa Service of Documents (Klausa "),
  H("29(1) [Jadual G] / 28(1) atau 32(1) [Jadual H — semak SPA]"),
  T(") di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi."),
]);

checkBreak(25);
rich([T("Peringatan Tindakan Undang-undang (Legal Action Notice)", { bold: true, underline: true })], { spacing: 2 });

rich([
  T("7.   Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya."),
]);

rich([T("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.")]);
rich([T("Sekian.")], { spacing: 6 });

checkBreak(50);
rich([T("Yang benar,")], { spacing: 12 });
doc.setLineWidth(0.3); doc.line(mL, y, mL + 60, y); y += 5;
rich([T("(", { bold: true }), H("NAMA PEMBELI", { bold: true }), T(")", { bold: true })], { spacing: 0.5 });
rich([T("No. K/P: ", { size: SMALL }), H("XXXXXX-XX-XXXX", { size: SMALL })], { spacing: 0.5 });
rich([T("E-mel: ", { size: SMALL }), H("emel@contoh.com", { size: SMALL })], { spacing: 0.5 });
rich([T("Telefon: ", { size: SMALL }), H("01X-XXX XXXX", { size: SMALL })], { spacing: 3 });

rich([
  T("s.k. (CC): ", { bold: true, size: SMALL }),
  H("[PILIHAN — kalau ada alamat kedua pemaju / pejabat cawangan, letak sini; kalau tiada, padam]", { size: SMALL }),
]);

// ============ KRONOLOGI ============
newPage();
y = 30;
doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(0, 0, 0);
doc.text("KRONOLOGI TINDAKAN", pageW / 2, y, { align: "center" });
doc.setLineWidth(0.4);
doc.line(pageW / 2 - doc.getTextWidth("KRONOLOGI TINDAKAN") / 2, y + 1, pageW / 2 + doc.getTextWidth("KRONOLOGI TINDAKAN") / 2, y + 1);
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(SMALL);
doc.text("(Chronology of Actions)", pageW / 2, y, { align: "center" });
y += 10;

drawTable(
  ["Tarikh (Date)", "Peristiwa (Event)"],
  [
    ["TARIKH SPA", "Perjanjian Jual Beli (SPA) ditandatangani — Jadual G/H [tukar ikut SPA]"],
    ["TARIKH", "Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah"],
    ["TARIKH", "Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju melalui [kaedah serahan] (No. kes/tiket: XXX — jika ada)"],
    ["TARIKH +30 hari", "Tamat tempoh 30 hari pembaikan oleh pemaju — [tiada pembaikan / pembaikan belum disiapkan sepenuhnya]"],
    ["TARIKH (jika ada)", "[PILIHAN] Pemeriksaan Kecacatan Kali Kedua (Re-Inspection) dijalankan — kecacatan masih wujud"],
    ["TARIKH NOTIS", "Notis Pertama (First Notice) dikeluarkan"],
    ["TARIKH DEADLINE", "Tarikh akhir pembaikan (15 hari dari Notis Pertama)"],
  ],
  [40, cW - 40]
);

// ============ AKUAN TERIMA ============
function akuan(label) {
  newPage();
  y = 25;
  doc.setFont("helvetica", "italic"); doc.setFontSize(SMALL); doc.setTextColor(0, 0, 0);
  doc.text(label, pageW - mR, y, { align: "right" });
  y += 8;
  doc.setFont("helvetica", "bold"); doc.setFontSize(12);
  doc.text("AKUAN TERIMA OLEH PEMAJU", pageW / 2, y, { align: "center" });
  doc.setLineWidth(0.4);
  doc.line(pageW / 2 - doc.getTextWidth("AKUAN TERIMA OLEH PEMAJU") / 2, y + 1, pageW / 2 + doc.getTextWidth("AKUAN TERIMA OLEH PEMAJU") / 2, y + 1);
  y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(SMALL);
  doc.text("(Developer's Acknowledgement of Receipt)", pageW / 2, y, { align: "center" });
  y += 12;

  rich([
    T("Dengan ini diakui bahawa "), H("NAMA PEMAJU SDN. BHD. (No. Syarikat)"),
    T(" telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh "),
    H("TARIKH NOTIS"), T(" dengan rujukan "), H("NOTIS-1/2026/0XX"), T(" daripada "), H("NAMA PEMBELI"),
    T(" berhubung hartanah di "), H("ALAMAT HARTANAH"), T("."),
  ], { spacing: 14 });

  doc.setFont("helvetica", "bold"); doc.setFontSize(BODY);
  doc.text("Diterima oleh:", mL, y);
  y += 14;
  for (const f of ["Nama", "Jawatan", "Tarikh"]) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(BODY);
    doc.text(f, mL, y); doc.text(":", mL + 25, y);
    doc.setLineWidth(0.3); doc.line(mL + 30, y + 1, mL + 120, y + 1);
    y += 14;
  }
  y += 8;
  doc.setFont("helvetica", "bold"); doc.setFontSize(SMALL);
  doc.text("Cop Syarikat (Company Stamp):", mL, y);
  y += 5;
  doc.setLineWidth(0.3); doc.rect(mL, y, 60, 35);
}
akuan("Salinan Pemaju (Developer's Copy)");
akuan("Salinan Pemilik (Owner's Copy)");

// ============ FOOTER ============
const totalPages = pageNum;
for (let p = 1; p <= doc.internal.getNumberOfPages(); p++) {
  doc.setPage(p);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2);
  doc.line(mL, pageH - 16, pageW - mR, pageH - 16);
  doc.setFont("helvetica", "italic"); doc.setFontSize(FOOT); doc.setTextColor(0, 0, 0);
  doc.text("TEMPLATE NOTIS 1 — bahagian highlight kuning perlu ditukar ikut client", mL, pageH - 11);
  doc.text(`Muka ${p} daripada ${totalPages}`, pageW - mR, pageH - 11, { align: "right" });
}

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/TEMPLATE_NOTIS_1.pdf", Buffer.from(out));
console.log("PDF generated: TEMPLATE_NOTIS_1.pdf");
console.log(`Total pages: ${totalPages}`);
