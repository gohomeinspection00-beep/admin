const { jsPDF } = require("jspdf");
const fs = require("fs");

const looPengirim = ["LOO CHUN HUA", "No. 72, Jalan Perwira 12,", "Taman Ungku Tun Aminah,", "81300 Skudai, Johor.", "Tel: 010-461 0373"];
const teoPengirim = ["TEO GEOK YAN", "A-162, Aurora Resort,", "Jalan Aurora Utama, Aurora Sentral,", "79100 Iskandar Puteri, Johor.", "Tel: +65 8617 8812"];

const sets = [
  {
    label: "LOO CHUN HUA (NOTIS 2) — ke COUNTRY VIEW RESOURCES, Menara Landmark  [Ruj: NOTIS-2/2026/037]",
    pengirim: looPengirim,
    penerima: ["COUNTRY VIEW RESOURCES SDN BHD (200001021248 / 523855-A)", "No. 26-01, Level 26, Mail Box 261,", "Menara Landmark, No. 12, Jalan Ngee Heng,", "80000 Johor Bahru, Johor."],
  },
  {
    label: "TEO GEOK YAN (NOTIS 2) — ke COUNTRY VIEW RESOURCES, Menara Landmark  [Ruj: NOTIS-2/2026/035]",
    pengirim: teoPengirim,
    penerima: ["COUNTRY VIEW RESOURCES SDN BHD (200001021248 / 523855-A)", "No. 26-01, Level 26, Mail Box 261,", "Menara Landmark, No. 12, Jalan Ngee Heng,", "80000 Johor Bahru, Johor."],
  },
  {
    label: "TEO GEOK YAN (NOTIS 2 — Salinan Penegasan) — ke PEJABAT PENGURUSAN Aurora Sentral  [Ruj: NOTIS-2/2026/035]",
    pengirim: teoPengirim,
    penerima: ["COUNTRY VIEW RESOURCES SDN BHD (200001021248 / 523855-A)", "(Pejabat Pengurusan / Management Office)", "Aurora Resort, Aurora Sentral,", "Jalan Aurora Utama,", "79100 Iskandar Puteri, Johor."],
  },
  {
    label: "TEO GEOK YAN (Surat Stakeholder) — ke M/s K.H. KOH, AZHAR & KOH  [Ruj: STAKEHOLDER/NOTIS-2/2026/035]",
    pengirim: teoPengirim,
    penerima: ["M/s K.H. KOH, AZHAR & KOH (Advocates & Solicitors)", "Suite 25-03, Level 25, Menara Landmark,", "No. 12, Jalan Ngee Heng,", "80000 Johor Bahru, Johor."],
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
fs.writeFileSync("/home/user/admin/SAMPUL_LOO_TEOGEOKYAN.pdf", Buffer.from(out));
console.log("PDF generated: SAMPUL_LOO_TEOGEOKYAN.pdf");
