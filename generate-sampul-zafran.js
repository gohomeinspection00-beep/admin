const { jsPDF } = require("jspdf");
const fs = require("fs");

const sets = [
  {
    label: "1. ZAFRAN — ke SHANG HEIGHT REALTY, alamat berdaftar (Melaka Mall)  [Ruj: SERAHAN-AR/2026/ZAFRAN]",
    pengirim: ["MOHAMAD ZAFRAN SHAZIQ BIN YASID", "No. 7, Jalan BS 23,", "Taman Bertam Setia,", "76450 Melaka.", "Tel: 011-1916 9598"],
    penerima: ["SHANG HEIGHT REALTY SDN. BHD. (201301010686 / 1040528-X)", "No. 2B-9, Jalan Kesidang 3/6,", "Melaka Mall, Off Jalan Tun Perak,", "75300 Melaka."],
  },
  {
    label: "2. ZAFRAN — salinan (CC) ke Pejabat Pengurusan (Jalan Inang)  [Ruj: SERAHAN-AR/2026/ZAFRAN]",
    pengirim: ["MOHAMAD ZAFRAN SHAZIQ BIN YASID", "No. 7, Jalan BS 23,", "Taman Bertam Setia,", "76450 Melaka.", "Tel: 011-1916 9598"],
    penerima: ["SHANG HEIGHT REALTY SDN. BHD. — Pejabat Pengurusan", "No. 19 & 19-1, Jalan Inang 1,", "Taman Paya Rumput Utama,", "76450 Melaka.", "Tel: 06-337 0871"],
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
fs.writeFileSync("/home/user/admin/SAMPUL_ZAFRAN.pdf", Buffer.from(out));
console.log("PDF generated: SAMPUL_ZAFRAN.pdf");
