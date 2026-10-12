const { jsPDF } = require("jspdf");
const fs = require("fs");

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 25;
const mR = 25;
const cW = pageW - mL - mR;
let y = 25;

const SZ = { BODY: 12, SMALL: 10, FOOTER: 8 };
const LH = 6;
const LH_S = 5;

function bk() { doc.setTextColor(0, 0, 0); doc.setDrawColor(0, 0, 0); }
function newPage() { doc.addPage(); y = 25; }
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

// ===== Sender =====
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("TEO GEOK YAN", mL, y); y += LH;
doc.setFont("helvetica", "normal");
for (const l of ["A-162, Aurora Resort,", "Jalan Aurora Utama, Aurora Sentral,", "79100 Iskandar Puteri,", "Johor."]) { doc.text(l, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text("E-mail: gyteo97@gmail.com", mL, y); y += LH_S;
doc.text("Tel: +65 8617 8812", mL, y); y += LH_S;
y += 3;
doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

// ===== Recipient =====
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("M/s K.H. KOH, AZHAR & KOH", mL, y); y += LH_S;
doc.setFont("helvetica", "normal");
for (const l of ["Advocates & Solicitors", "Suite 25-03, Level 25, Menara Landmark,", "No. 12, Jalan Ngee Heng,", "80000 Johor Bahru, Johor."]) { doc.text(l, mL, y); y += LH_S; }
doc.text("12 October 2026", pageW - mR, y - LH_S, { align: "right" });
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text("E-mail: khkohjoetan@yahoo.com; khkjoetan@gmail.com", mL, y); y += LH_S;
doc.text("Tel: 07-224 2323   Fax: 07-224 7262", mL, y); y += LH_S;
y += 3;
doc.setFontSize(SZ.SMALL);
doc.text("Our Ref: STAKEHOLDER/NOTIS-2/2026/035", mL, y);
y += 8;

doc.setFontSize(SZ.BODY);
doc.text("Dear Sirs,", mL, y);
y += 8;

// ===== Title =====
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
const tT = "RE: NOTICE TO STAKEHOLDER LAWYERS — RETENTION OF 5% STAKEHOLDER SUM";
const tL = doc.splitTextToSize(tT, cW);
for (const l of tL) {
  doc.text(l, mL, y);
  doc.setLineWidth(0.3);
  doc.line(mL, y + 1, mL + doc.getTextWidth(l), y + 1);
  y += LH;
}
y += 3;

// ===== Matter table =====
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
const matter = [
  ["Developer", "COUNTRY VIEW RESOURCES SDN BHD (200001021248 / 523855-A)"],
  ["Purchaser", "TEO GEOK YAN (NRIC: 970729-01-6582)"],
  ["Project", "Aurora Resort Villas, Phase 1, Aurora Sentral"],
  ["Property", "Double Storey Link Villa (Lot 247)"],
  ["Address", "A-162, Aurora Resort, Jalan Aurora Utama, Aurora Sentral, 79100 Iskandar Puteri, Johor"],
  ["SPA", "Schedule H, dated 21 December 2023 (Ref: 8428-23/eSPA/141223/247/01)"],
];
for (const [k, v] of matter) {
  doc.setFont("helvetica", "bold");
  doc.text(k, mL + 2, y);
  doc.text(":", mL + 30, y);
  doc.setFont("helvetica", "normal");
  const vl = doc.splitTextToSize(v, cW - 36);
  for (let i = 0; i < vl.length; i++) {
    doc.text(vl[i], mL + 34, y);
    y += LH_S;
  }
  y += 1;
}
y += 4;

para("We refer to the above matter.");
y += 4;

para(
  "Pursuant to the Sale and Purchase Agreement, I have given the requisite written notices to the Developer to remedy the defects within the Defect Liability Period under Clause 30(1) of Schedule H, namely: (i) the Defect Inspection Reports submitted through the Developer's CVConnect application on 1 and 2 July 2025 (Defect 728811-2 and 228839-3); (ii) the First Notice (Ref: NOTIS-1/2026/035) dated 2 September 2026, delivered by AR Registered Post No. RW214680799MY and RECEIVED by the Developer on 23 September 2026; and (iii) the Second and Final Notice (Ref: NOTIS-2/2026/035) dated 12 October 2026, with a final deadline of 27 October 2026."
);
y += 4;

para(
  "I wish to bring to your attention that a substantial number of defect rectification works have not been completed by the Developer despite numerous written and verbal complaints and inspections, and/or the Developer has failed, neglected or refused to attend to them. Among others, the latest Re-Inspection on 27 August 2026 confirmed the defects remain unresolved, and all nine (9) further defect cases submitted through CVConnect on 28 August 2026 and 1 September 2026 remain in \"Pending\" status to date. A copy of the list of outstanding defects, together with the supporting documents, will be forwarded to your firm by e-mail (khkohjoetan@yahoo.com; khkjoetan@gmail.com) for your record, and an official repair quotation amounting to RM25,565.00 has been obtained."
);
y += 4;

para(
  "I hereby give you notice, as Stakeholder under Clause 30(2) of Schedule H of the Sale and Purchase Agreement, NOT to release any portion of the five per cent (5%) stakeholder sum (retention sum) to the Developer until such time that I am satisfied with the remedial works and due written notice to that effect is given to you. In default of your professional role as Stakeholder, I will hold your firm personally responsible and will not hesitate to lodge an official complaint with the Bar Council of Malaysia."
);
y += 4;

para("Your cooperation is appreciated. Thank you.");
y += 6;

checkBreak(70);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yours faithfully,", mL, y);
const signImg = "data:image/jpeg;base64," + fs.readFileSync("/home/user/admin/teogy-sign.jpg").toString("base64");
doc.addImage(signImg, "JPEG", mL + 8, y + 2, 24, 24 * 174 / 202);
y += 28;
doc.setFont("helvetica", "bold");
doc.text("(TEO GEOK YAN)", mL, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("NRIC: 970729-01-6582", mL, y); y += 4;
doc.text("E-mail: gyteo97@gmail.com", mL, y); y += LH_S;
doc.text("Tel: +65 8617 8812", mL, y); y += 8;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("cc:", mL, y); y += 5;
doc.setFont("helvetica", "normal");
const cc1 = "COUNTRY VIEW RESOURCES SDN BHD (200001021248 / 523855-A) — No. 26-01, Level 26, Mail Box 261, Menara Landmark, No. 12, Jalan Ngee Heng, 80000 Johor Bahru, Johor.";
const ccL = doc.splitTextToSize(cc1, cW - 5);
for (const l of ccL) { checkBreak(5); doc.text(l, mL + 5, y); y += 4.5; }
y += 4;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("To follow by e-mail:", mL, y); y += 5;
doc.setFont("helvetica", "normal");
doc.text("1. List of outstanding defects (as per Second and Final Notice Ref: NOTIS-2/2026/035)", mL + 5, y); y += 4.5;
doc.text("2. Copy of AR card No. RW214680799MY (proof of service of First Notice)", mL + 5, y); y += 4.5;

// ===== Footer =====
const totalPages = doc.internal.getNumberOfPages();
for (let p = 1; p <= totalPages; p++) {
  doc.setPage(p);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2);
  doc.line(mL, pageH - 18, pageW - mR, pageH - 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.FOOTER); doc.setTextColor(0, 0, 0);
  doc.text("Ref: STAKEHOLDER/NOTIS-2/2026/035", mL, pageH - 13);
  doc.text(`Page ${p} of ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/SURAT_STAKEHOLDER_TEOGEOKYAN.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_STAKEHOLDER_TEOGEOKYAN.pdf");
console.log(`Total pages: ${totalPages}`);
