const { jsPDF } = require("jspdf");
const fs = require("fs");

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;

function drawBlock(x, y, w, h, label, lines, opts = {}) {
  const { nameSize = 14, addrSize = 13 } = opts;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);
  doc.rect(x, y, w, h);
  doc.setLineDashPattern([], 0);

  let ty = y + 8;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(label, x + 5, ty);
  ty += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(nameSize);
  doc.text(lines[0], x + 5, ty);
  ty += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(addrSize);
  for (let i = 1; i < lines.length; i++) {
    doc.text(lines[i], x + 5, ty);
    ty += 6.5;
  }
}

// PENGIRIM (top left, smaller)
drawBlock(20, 25, 105, 55, "DARIPADA / PENGIRIM:", [
  "MUHAMMAD ARIF BIN AHMED",
  "No. 1837, Jalan Scientex Jaya 32,",
  "Taman Scientex Senai,",
  "81400 Senai,",
  "Johor.",
  "Tel: 013-654 3211",
], { nameSize: 12, addrSize: 11 });

// PENERIMA (center, bigger)
drawBlock(45, 130, 145, 70, "KEPADA / PENERIMA:", [
  "NICE FRONTIER SDN. BHD. (199401014059 / 299739-U)",
  "Level 29, IOI City Tower 2,",
  "Lebuh IRC, IOI Resort City,",
  "62502 Putrajaya,",
  "WP Putrajaya.",
  "Tel: +607-5959 222",
], { nameSize: 13, addrSize: 13 });

// Footer note
doc.setFont("helvetica", "italic");
doc.setFontSize(9);
doc.setTextColor(0, 0, 0);
doc.text("Ruj: NOTIS-1/2026/017 — Pos Berdaftar Akuan Terima (AR Registered Post)", pageW / 2, 285, { align: "center" });

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/SAMPUL_ARIF.pdf", Buffer.from(out));
console.log("PDF generated: SAMPUL_ARIF.pdf");
