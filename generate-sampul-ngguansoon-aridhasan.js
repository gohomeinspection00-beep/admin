const { jsPDF } = require("jspdf");
const fs = require("fs");

const ngPengirim = ["NG GUAN SOON", "No. B-200, Aurora Resort,", "Jalan Aurora Utama, Aurora Sentral,", "79200 Iskandar Puteri, Johor.", "Tel: +65 9237 6382"];
const ariPengirim = ["ARIDHASAN A/L MENANDI", "No. 28, Jalan Uda Utama 2/6,", "Bandar Uda Utama,", "81200 Johor Bahru, Johor.", "Tel: 017-225 0417"];

const sets = [
  {
    label: "NG GUAN SOON (NOTIS 1) — ke COUNTRY VIEW RESOURCES, Menara Landmark  [Ruj: NOTIS-1/2026/047]",
    pengirim: ngPengirim,
    penerima: ["COUNTRY VIEW RESOURCES SDN. BHD. (200001021248 / 523855-A)", "Unit 26-01, Mail Box 261, Menara Landmark,", "No. 12, Jalan Ngee Heng,", "80888 Ibrahim International Business District,", "Johor Darul Ta'zim."],
  },
  {
    label: "NG GUAN SOON (NOTIS 1) — ke COUNTRY VIEW RESOURCES, Pejabat Berdaftar Menara TJB  [Ruj: NOTIS-1/2026/047]",
    pengirim: ngPengirim,
    penerima: ["COUNTRY VIEW RESOURCES SDN. BHD. (200001021248 / 523855-A)", "(Pejabat Berdaftar / Registered Office)", "Suite 5.11 & 5.12, 5th Floor, Menara TJB,", "Jalan Syed Mohd Mufti,", "80000 Johor Bahru, Johor."],
  },
  {
    label: "ARIDHASAN (NOTIS 2) — ke UDA LAND (SOUTH), Jalan Padi Mahsuri JB  [Ruj: NOTIS-2/2026/024]",
    pengirim: ariPengirim,
    penerima: ["UDA LAND (SOUTH) SDN. BHD. (197501001813 / 23298-K)", "No. 1, Jalan Padi Mahsuri 12,", "Bandar Baru Uda,", "81200 Johor Bahru, Johor."],
  },
  {
    label: "ARIDHASAN (NOTIS 1) — ke UDA HOLDINGS BERHAD, Kompleks Pertama KL  [Ruj: NOTIS-1/2026/024]",
    pengirim: ariPengirim,
    penerima: ["UDA HOLDINGS BERHAD (199501018305 / 347508-T)", "Tingkat 15, Blok Menara,", "Kompleks Pertama,", "Jalan Tuanku Abdul Rahman,", "50100 Kuala Lumpur."],
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
fs.writeFileSync("/home/user/admin/SAMPUL_NGGUANSOON_ARIDHASAN.pdf", Buffer.from(out));
console.log("PDF generated: SAMPUL_NGGUANSOON_ARIDHASAN.pdf");
