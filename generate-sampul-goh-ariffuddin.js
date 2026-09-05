const { jsPDF } = require("jspdf");
const fs = require("fs");

const sets = [
  {
    label: "1. GOH BOON HAU — Notis 2 ke CASA BAYU IDAMAN, Taman Century JB  [Ruj: NOTIS-2/2026/011]",
    pengirim: ["GOH BOON HAU", "No. 10, Jalan Perwira 6,", "Taman Muhibbah,", "85400 Chaah, Johor.", "Tel: 011-5529 5031"],
    penerima: ["CASA BAYU IDAMAN SDN. BHD. (1230392-T)", "88A, Jalan Harimau Tarum,", "Taman Century,", "80250 Bandar Johor Bahru, Johor."],
  },
  {
    label: "2. AHMAD ARIFFUDDIN — ke PARKLAND CITY, HQ Melaka  [Ruj: NOTIS-1/2026/038]",
    pengirim: ["AHMAD ARIFFUDDIN BIN ARIFIN", "#13-05, Blok A, Pangsapuri Jentayu,", "Jalan Tampoi,", "81200 Johor Bahru, Johor.", "Tel: 014-532 0134"],
    penerima: ["PARKLAND CITY SDN BHD (201201031906 / 1016393-K)", "(Parkland Headquarters Office)", "No. 112, Jalan Tun Perak,", "75300 Melaka.", "Tel: 06-222 2888"],
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
  const boxH = 46;
  newPageIf(boxH + 14);

  doc.setFont("helvetica", "italic"); doc.setFontSize(8.5); doc.setTextColor(90, 90, 90);
  doc.text(s.label, mL, y);
  y += 3;

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
fs.writeFileSync("/home/user/admin/SAMPUL_GOH_ARIFFUDDIN.pdf", Buffer.from(out));
console.log("PDF generated: SAMPUL_GOH_ARIFFUDDIN.pdf");
