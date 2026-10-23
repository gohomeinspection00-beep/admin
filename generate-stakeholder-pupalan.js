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
doc.text("PUPALAN A/L WAI RAWAN", mL, y); y += LH;
doc.setFont("helvetica", "normal");
for (const l of ["No. 72, Jalan Ketapang 5,", "Taman Rinting,", "81750 Masai,", "Johor."]) { doc.text(l, mL, y); y += LH_S; }
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text("E-mail: pupalanpukat@gmail.com", mL, y); y += LH_S;
doc.text("Tel: 012-243 5795", mL, y); y += LH_S;
y += 3;
doc.setLineWidth(0.5);
doc.line(mL, y, pageW - mR, y);
y += 6;

// ===== Recipient =====
doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.BODY); bk();
doc.text("MESSRS PHANG & PARTNERS", mL, y); y += LH_S;
doc.setFont("helvetica", "normal");
for (const l of ["Advocates & Solicitors", "No. 2 (Sebelah Bangunan Parkland),", "Persiaran Wau Kikik, Bandar Layangkasa,", "81700 Pasir Gudang, Johor."]) { doc.text(l, mL, y); y += LH_S; }
doc.text("24 October 2026", pageW - mR, y - LH_S, { align: "right" });
y += 1;
doc.setFontSize(SZ.SMALL);
doc.text("E-mail: masai@phangpartners.com   Tel: +6011-6302 9191", mL, y); y += LH_S;
doc.text("Your Ref: JC(SH)(AL)/CON(MS)/10336/2024(BL-P5)", mL, y); y += LH_S;
y += 3;
doc.setFontSize(SZ.SMALL);
doc.text("Our Ref: STAKEHOLDER/NOTIS-3/2026/016", mL, y);
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
  ["Developer", "PARKLAND CITY SDN BHD (201201031906 / 1016393-K)"],
  ["Purchaser", "PUPALAN A/L WAI RAWAN (NRIC: 900117-08-5399)"],
  ["Project", "Bandar Layangkasa, Phase 5 — Pasir Gudang, Johor"],
  ["Property", "Terrace House 2 Storey (20' x 70', Intermediate) — PTD 248797, Mukim Plentong"],
  ["Address", "No. 6, Jalan Wau Barat 9, Bandar Layangkasa, 81700 Pasir Gudang, Johor"],
  ["SPA", "Schedule G, dated 27 September 2024 (Ref: 13759-31/eSPA/270924/PTD248797/01)"],
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
  "Pursuant to the Sale and Purchase Agreement, I have given the requisite written notices to the Developer to remedy the defects within the Defect Liability Period under Clause 27(1) of Schedule G, namely: (i) the Defect Inspection Report submitted by hand to the Developer's management office on 20 April 2026; (ii) the First Notice (Ref: NOTIS-1/2026/016) dated 5 August 2026, delivered by hand and acknowledged by the Developer's Customer Care with the Developer's official RECEIVED stamp on the same day; (iii) the Second and Final Notice (Ref: NOTIS-2/2026/016) dated 10 September 2026, acknowledged at the Developer's Bandar Layangkasa office on 10 September 2026 and further delivered to the Developer's Headquarters in Melaka by AR Registered Post No. RW193876461MY, RECEIVED on 23 September 2026; and (iv) the Third Notice / Final Reminder (Ref: NOTIS-3/2026/016) dated 24 October 2026, with a final deadline of 8 November 2026."
);
y += 4;

para(
  "I wish to bring to your attention that the defect rectification works have not been completed by the Developer despite the notices above and three (3) inspections by a Registered Building Surveyor (13 April 2026, 4 September 2026 and 15 October 2026). The latest inspection on 15 October 2026 confirmed that the defects remain unresolved, including NEW defects arising from the Developer's own rectification works and an electrical earthing installation that remains non-compliant with the ST Domestic Electrical Installation Guidelines (Second Edition 2024). A copy of the list of outstanding defects, together with the supporting documents, will be forwarded to your firm by e-mail (masai@phangpartners.com) for your record."
);
y += 4;

para(
  "I hereby give you notice, as Stakeholder under Clause 27(2) of Schedule G of the Sale and Purchase Agreement, NOT to release any portion of the five per cent (5%) stakeholder sum (retention sum) to the Developer until such time that I am satisfied with the remedial works and due written notice to that effect is given to you. In default of your professional role as Stakeholder, I will hold your firm personally responsible and will not hesitate to lodge an official complaint with the Bar Council of Malaysia."
);
y += 4;

para("Your cooperation is appreciated. Thank you.");
y += 6;

checkBreak(70);
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.BODY); bk();
doc.text("Yours faithfully,", mL, y);
y += 18;
doc.setLineWidth(0.3);
doc.line(mL, y, mL + 60, y);
y += 5;
doc.setFont("helvetica", "bold");
doc.text("(PUPALAN A/L WAI RAWAN)", mL, y);
y += 5;
doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.SMALL);
doc.text("NRIC: 900117-08-5399", mL, y); y += 4;
doc.text("E-mail: pupalanpukat@gmail.com", mL, y); y += LH_S;
doc.text("Tel: 012-243 5795", mL, y); y += 8;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("cc:", mL, y); y += 5;
doc.setFont("helvetica", "normal");
const ccList = [
  "PARKLAND CITY SDN BHD (201201031906 / 1016393-K) — Parkland Headquarters Office, No. 112, Jalan Tun Perak, 75300 Melaka.",
  "PARKLAND CITY SDN BHD — Bangunan Parkland Group, Persiaran Wau Kikik, Bandar Layangkasa, 81700 Pasir Gudang, Johor.",
];
for (const cc1 of ccList) {
  const ccL = doc.splitTextToSize(cc1, cW - 5);
  for (const l of ccL) { checkBreak(5); doc.text(l, mL + 5, y); y += 4.5; }
  y += 2;
}
y += 2;

doc.setFont("helvetica", "bold"); doc.setFontSize(SZ.SMALL); bk();
doc.text("To follow by e-mail:", mL, y); y += 5;
doc.setFont("helvetica", "normal");
doc.text("1. List of outstanding defects (as per Third Notice / Final Reminder Ref: NOTIS-3/2026/016)", mL + 5, y); y += 4.5;
doc.text("2. Copies of the Developer's acknowledgements of receipt (First and Second Notices) and", mL + 5, y); y += 4.5;
doc.text("    AR card No. RW193876461MY (proof of service at the Developer's Headquarters)", mL + 5, y); y += 4.5;

// ===== Footer =====
const totalPages = doc.internal.getNumberOfPages();
for (let p = 1; p <= totalPages; p++) {
  doc.setPage(p);
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.2);
  doc.line(mL, pageH - 18, pageW - mR, pageH - 18);
  doc.setFont("helvetica", "normal"); doc.setFontSize(SZ.FOOTER); doc.setTextColor(0, 0, 0);
  doc.text("Ref: STAKEHOLDER/NOTIS-3/2026/016", mL, pageH - 13);
  doc.text(`Page ${p} of ${totalPages}`, pageW - mR, pageH - 13, { align: "right" });
}

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/SURAT_STAKEHOLDER_PUPALAN.pdf", Buffer.from(out));
console.log("PDF generated: SURAT_STAKEHOLDER_PUPALAN.pdf");
console.log(`Total pages: ${totalPages}`);
