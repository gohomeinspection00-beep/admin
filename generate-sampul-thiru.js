const { jsPDF } = require("jspdf");
const fs = require("fs");

const pengirim = ["THIRUCHELVAM A/L SANMUGAM", "No. 1, Jalan Puncak 5/9,", "Taman Puncak Tropicana,", "81500 Pekan Nenas, Johor.", "Tel: 010-903 9625"];

const sets = [
  {
    label: "THIRUCHELVAM (NOTIS 1) — ke Pejabat Berdaftar KSL Medini, Kota Southkey  [Ruj: NOTIS-1/2026/059]",
    pengirim,
    penerima: ["KSL MEDINI DEVELOPMENT SDN. BHD. (201301044792 / 1074615-X)", "A-3-55, Pusat Komersial Bayu Tasek,", "Persiaran Southkey 1, Kota Southkey,", "80150 Johor Bahru, Johor."],
  },
  {
    label: "THIRUCHELVAM (NOTIS 1) — ke KSL Sales Office, Skudai  [Ruj: NOTIS-1/2026/059]",
    pengirim,
    penerima: ["KSL MEDINI DEVELOPMENT SDN. BHD. (201301044792 / 1074615-X)", "(KSL Sales Office)", "Taman Nusa Bestari 2,", "81300 Skudai, Johor."],
  },
  {
    label: "THIRUCHELVAM (NOTIS 1) — ke KSL City HQ, Taman Abad  [Ruj: NOTIS-1/2026/059]",
    pengirim,
    penerima: ["KSL MEDINI DEVELOPMENT SDN. BHD. (201301044792 / 1074615-X)", "d/a KSL Holdings Berhad,", "L1-95, KSL City, No. 33, Jalan Seladang,", "Taman Abad, 80250 Johor Bahru, Johor."],
  },
];

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 12;
const mR = 12;
const cW = pageW - mL - mR;
let y = 16;

function newPageIf(n) { if (y + n > pageH - 12) { doc.addPage(); y = 16; } }

doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(0, 0, 0);
doc.text("LABEL SAMPUL SURAT — GUNTING & TAMPAL", pageW / 2, y, { align: "center" });
y += 8;

for (const s of sets) {
  const boxH = 48;
  newPageIf(boxH + 16);

  doc.setFont("helvetica", "italic"); doc.setFontSize(8.5); doc.setTextColor(90, 90, 90);
  const labLines = doc.splitTextToSize(s.label, cW);
  for (const l of labLines) { doc.text(l, mL, y); y += 3.5; }

  const colw = (cW - 4) / 2;
  const x1 = mL, x2 = mL + colw + 4;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);
  doc.rect(x1, y, colw, boxH);
  doc.rect(x2, y, colw, boxH);
  doc.setLineDashPattern([], 0);

  function fillBox(x, title, lines) {
    let ty = y + 6;
    doc.setFont("helvetica", "italic"); doc.setFontSize(8); doc.setTextColor(0, 0, 0);
    doc.text(title, x + 4, ty);
    ty += 6;
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    const nl = doc.splitTextToSize(lines[0], colw - 8);
    for (const l of nl) { doc.text(l, x + 4, ty); ty += 4.6; }
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    for (let i = 1; i < lines.length; i++) {
      const wl = doc.splitTextToSize(lines[i], colw - 8);
      for (const l of wl) { doc.text(l, x + 4, ty); ty += 4.6; }
    }
  }

  fillBox(x1, "DARIPADA / PENGIRIM:", s.pengirim);
  fillBox(x2, "KEPADA / PENERIMA:", s.penerima);

  y += boxH + 9;
}

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/SAMPUL_THIRU.pdf", Buffer.from(out));
console.log("PDF generated: SAMPUL_THIRU.pdf");
