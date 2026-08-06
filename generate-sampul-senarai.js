const { jsPDF } = require("jspdf");
const fs = require("fs");

const sets = [
  {
    label: "1. ARIF (Kedidi) — ke NICE FRONTIER, Putrajaya  [Ruj: NOTIS-1/2026/017]",
    pengirim: ["MUHAMMAD ARIF BIN AHMED", "No. 1837, Jalan Scientex Jaya 32,", "Taman Scientex Senai,", "81400 Senai, Johor.", "Tel: 013-654 3211"],
    penerima: ["NICE FRONTIER SDN. BHD. (199401014059 / 299739-U)", "Level 29, IOI City Tower 2,", "Lebuh IRC, IOI Resort City,", "62502 Putrajaya, WP Putrajaya.", "Tel: +607-5959 222"],
  },
  {
    label: "2. CHEN — ke TH TEBRAU LAND, Johor Bahru  [Ruj: NOTIS-1/2026/012]",
    pengirim: ["CHEN SEE NGA", "#25-06, Menara C, Pangsapuri Seri Permata,", "Jalan Kunyit, Taman Sri Amar,", "81100 Johor Bahru, Johor.", "Tel: +65 8273 47373"],
    penerima: ["TH TEBRAU LAND SDN. BHD. (985928-D)", "PTD 209290, Jalan Kunyit,", "Taman Sri Amar,", "81100 Johor Bahru, Johor.", "Tel: 07-338 1188"],
  },
  {
    label: "3. RAJSHRMELA — Surat 1: ke INTACT, HQ Kuala Lumpur  [Ruj: NOTIS-1/2026/015]",
    pengirim: ["RAJSHRMELA A/P RAJAGOPAL", "No. 34, Jalan Makmur 14,", "Taman Damai Jaya,", "81300 Skudai, Johor Bahru, Johor.", "Tel: 010-887 4423"],
    penerima: ["INTACT CORPORATE APPROACH SDN BHD (1049670-K)", "Level 18, Ho Hup Tower,", "1, Persiaran Jalil 1, Bandar Bukit Jalil,", "57000 Kuala Lumpur.", "Tel: 07-661 5166"],
  },
  {
    label: "4. RAJSHRMELA — Surat 2: ke INTACT, Pejabat Johor  [Ruj: NOTIS-1/2026/015]",
    pengirim: ["RAJSHRMELA A/P RAJAGOPAL", "No. 34, Jalan Makmur 14,", "Taman Damai Jaya,", "81300 Skudai, Johor Bahru, Johor.", "Tel: 010-887 4423"],
    penerima: ["INTACT CORPORATE APPROACH SDN BHD (1049670-K)", "No. 265, Jalan Kenanga 29/8,", "Indahpura,", "81000 Kulai, Johor.", "Tel: 018-951 5166"],
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
  const boxH = 42;
  newPageIf(boxH + 14);

  // Label header (outside cut area)
  doc.setFont("helvetica", "italic"); doc.setFontSize(8.5); doc.setTextColor(90, 90, 90);
  doc.text(s.label, mL, y);
  y += 3;

  // Table: two cells side by side with dashed borders (cut lines)
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
fs.writeFileSync("/home/user/admin/SAMPUL_SENARAI.pdf", Buffer.from(out));
console.log("PDF generated: SAMPUL_SENARAI.pdf");
