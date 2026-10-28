const { jsPDF } = require("jspdf");
const fs = require("fs");

const pengirim = ["AMUTHABARATHI A/L MANOHARAN", "No. 17, Jalan Kejayaan 62,", "Taman Universiti,", "81300 Skudai, Johor.", "Tel: 019-895 2891"];

const sets = [
  {
    label: "AMUTHABARATHI (NOTIS 1) — ke Site Office Austin Duta  [Ruj: NOTIS-1/2026/055]",
    pengirim,
    penerima: ["IJM PROPERTIES SDN BHD (100180-M)", "(Pejabat Tapak / Site Office — Austin Duta)", "PTD 182037 & PTD 182038, Ground Floor,", "Jalan Austin Duta, Taman Austin Duta,", "81100 Johor Bahru, Johor."],
  },
  {
    label: "AMUTHABARATHI (NOTIS 1) — ke Pejabat Berdaftar, Wisma IJM PJ  [Ruj: NOTIS-1/2026/055]",
    pengirim,
    penerima: ["IJM PROPERTIES SDN BHD (100180-M)", "(Pejabat Berdaftar / Registered Office)", "Tkt. 2, Wisma IJM, Jalan Yong Shook Lin,", "46050 Petaling Jaya, Selangor."],
  },
  {
    label: "AMUTHABARATHI (NOTIS 1) — ke City Plaza, Jalan Tebrau JB  [Ruj: NOTIS-1/2026/055]",
    pengirim,
    penerima: ["IJM PROPERTIES SDN BHD (100180-M)", "17th Floor, Unit 17-01, City Plaza,", "Jalan Tebrau,", "80250 Johor Bahru, Johor."],
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
  const boxH = 50;
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
fs.writeFileSync("/home/user/admin/SAMPUL_AMUTHABARATHI.pdf", Buffer.from(out));
console.log("PDF generated: SAMPUL_AMUTHABARATHI.pdf");
