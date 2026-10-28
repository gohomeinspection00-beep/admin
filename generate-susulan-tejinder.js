const { jsPDF } = require("jspdf");
const fs = require("fs");

const data = {
  noRujukan: "SUSULAN-1/NOTIS-1/2026/054",

  namaPembeli: "TEJINDER KAUR KHURANA",
  alamatPengirim: [
    "No. 478, Residensi Botani 3 (The Commune),",
    "Taman Eko Botani,",
    "79100 Iskandar Puteri,",
    "Johor.",
  ],

  namaPemaju: "MELIA SPRING SDN. BHD.",
  noSyarikat: "(201401019246 / 1095333-H)",
  alamatPenerima: [
    "Eko Galleria,",
    "Jalan Eko Botani 3,",
    "Taman Eko Botani,",
    "79100 Iskandar Puteri, Johor.",
  ],

  alamatHartanah: "No. 478, Residensi Botani 3 (THE COMMUNE), Taman Eko Botani, 79100 Iskandar Puteri, Johor (Unit 3363, The Commune Phase 3)",

  tarikhNotis: "29 Oktober 2026",
  tarikhDeadline: "13 November 2026",

  kecacatan: [
    { tag: "6", lokasi: "Terrace — Plumbing & Sanitary", kecacatan: "Manhole saliran tersumbat — air bertakung di dalamnya masih ada (Clogged inside manhole for drainage, still observed — Poor Drainage System)", status: "Belum Dibaiki" },
    { tag: "15", lokasi: "Bathroom 3 — Pintu", kecacatan: "Kesan kotoran pada tombol pintu masih ada (Stains on doorknob, still observed)", status: "Belum Dibaiki" },
    { tag: "17", lokasi: "Master Bedroom — Dinding", kecacatan: "Bacaan kelembapan tinggi pada dinding masih ada (High moisture reading on wall, still observed — Leaking issue, bukti moisture meter)", status: "Belum Dibaiki" },
    { tag: "19", lokasi: "Master Bathroom — Plumbing & Sanitary", kecacatan: "Kebocoran pada bottle trap basin masih ada (Still observed leaking on bottle trap for basin)", status: "Belum Dibaiki" },
    { tag: "22", lokasi: "Ceiling Area (Master Bedroom) — Bumbung", kecacatan: "Pemasangan insulation sheet tidak sempurna masih ada — penggunaan tape hanyalah penyelesaian sementara (Improper installation for insulation sheet, still observed — tape is only a temporary solution)", status: "Belum Dibaiki" },
    { tag: "24", lokasi: "RC Flat Roof — Lantai", kecacatan: "Air bertakung pada papak lantai masih ada (Water stagnant on floor slab, still observed)", status: "Belum Dibaiki" },
    { tag: "26", lokasi: "RC Flat Roof (Kitchen Area) — Lantai", kecacatan: "Air bertakung pada papak lantai masih ada (Water stagnant on floor slab, still observed)", status: "Belum Dibaiki" },
    { tag: "29", lokasi: "Top Roof — Lantai", kecacatan: "Tanda air bertakung pada papak masih ada (Sign of water stagnant on slab, still observed)", status: "Belum Dibaiki" },
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

// ===== Header =====
y = 25;
doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.BODY);
bk();
doc.text(data.namaPembeli, mL, y);
y += LH;
doc.setFont("helvetica", "normal");
for (const line of data.alamatPengirim) { doc.text(line, mL, y); y += LH_S; }
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
doc.text(`Ruj. Kami: ${data.noRujukan}   Ruj. Notis Pertama: NOTIS-1/2026/054`, mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Tuan,", mL, y);
y += 8;

doc.setFont("helvetica", "bold");
doc.setFontSize(SZ.TITLE);
bk();
const perkara1 = "Surat Susulan — Pembaikan Kecacatan Masih Belum Diselesaikan";
const perkara2 = "(Follow-Up Notice — Outstanding Defect Rectification)";
const perkara3 = `Hartanah: ${data.alamatHartanah}`;
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
  `Saya, ${data.namaPembeli}, pemilik unit hartanah di alamat di atas, merujuk kepada Notis Pertama (NOTIS-1/2026/054) bertarikh 7 Oktober 2026 serta laporan-laporan kecacatan yang telah dikemukakan kepada pihak tuan melalui aplikasi EcoWorld.`
);
y += 4;

numPara(2,
  `Untuk makluman pihak tuan, laporan kecacatan bagi unit ini telah dikemukakan sebanyak TIGA (3) kali melalui aplikasi EcoWorld — pada 14 Mei 2026 (Kes MSP3-3C03-3363-001 hingga 006), 28 Julai 2026 (Kes 007 hingga 009) dan terkini pada 6 Oktober 2026 (Kes MSP3-3C03-3363-010), susulan Pemeriksaan Kali Ketiga (3rd Inspection) pada 5 Oktober 2026. Namun, sehingga tarikh surat ini dikeluarkan, kecacatan yang dilaporkan MASIH BELUM DIBAIKI — Kes MSP3-3C03-3363-010 masih berstatus "Work In Progress" di dalam sistem pihak tuan sendiri. Antara kecacatan yang masih belum diselesaikan adalah seperti berikut:`
);
y += 5;

checkBreak(45);
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("Senarai Kecacatan yang Masih Belum Diselesaikan:", mL, y);
y += 6;

const colW = [12, 42, 71, cW - 12 - 42 - 71];
drawTable(
  ["No.", "Lokasi", "Kecacatan (Defect)", "Status"],
  data.kecacatan.map(i => [i.tag, i.lokasi, i.kecacatan, i.status]),
  colW
);

y += 5;
doc.setFont("helvetica", "italic"); doc.setFontSize(SZ.FOOTNOTE); bk();
const fn = "*Senarai di atas adalah berdasarkan Pemeriksaan Kali Ketiga pada 5 Oktober 2026 (kesemua berstatus Not Complete). Butiran penuh adalah sebagaimana Kes MSP3-3C03-3363-010 di dalam aplikasi EcoWorld pihak tuan.";
const fnL = doc.splitTextToSize(fn, cW);
for (const f of fnL) { checkBreak(5); doc.text(f, mL, y); y += 4.5; }
y += 5;

numPara(3,
  `Perhatian khusus diberikan kepada item No. 17 (bacaan kelembapan tinggi pada dinding Master Bedroom) dan No. 19 (kebocoran pada bottle trap basin Master Bathroom) — kebocoran yang dibiarkan akan merebak dan merosakkan kemasan di sekitarnya, dan pihak tuan dipohon mengesan dan membaiki PUNCANYA, bukan sekadar pembaikan kosmetik. Bagi item No. 22, pemasangan insulation sheet hendaklah dibaiki dengan kaedah pemasangan yang betul memandangkan penggunaan tape hanyalah penyelesaian sementara.`
);
y += 4;

numPara(4,
  `Sehubungan itu, saya memohon agar pihak tuan menyiapkan SEMUA kerja pembaikan yang tertunggak selewat-lewatnya pada ${data.tarikhDeadline}. Sekiranya pembaikan masih tidak disempurnakan, saya akan meneruskan tindakan susulan sebagaimana dinyatakan di dalam Notis Pertama, termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR).`
);
y += 4;

para("Kerjasama dan perhatian segera pihak tuan amat dihargai. Sekian, terima kasih.");
y += 8;

checkBreak(50);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yang benar,", mL, y);
y += 16;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text(`(${data.namaPembeli})`, mL, y);
y += 5;

// ===== AKUAN TERIMA =====
newPage();
y = 25;
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
const akText = `Dengan ini diakui bahawa ${data.namaPemaju} ${data.noSyarikat} telah menerima Surat Susulan — Pembaikan Kecacatan (Follow-Up Notice) bertarikh ${data.tarikhNotis} dengan rujukan ${data.noRujukan} daripada ${data.namaPembeli} berhubung hartanah di ${data.alamatHartanah}.`;
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

// ===== FOOTER =====
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
fs.writeFileSync("/home/user/admin/SURAT_SUSULAN_TEJINDER.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_SUSULAN_TEJINDER.pdf");
console.log(`Total pages: ${totalPages}`);
