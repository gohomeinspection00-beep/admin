const { jsPDF } = require("jspdf");
const fs = require("fs");

const clients = [
  {
    label: "1. MUHAMMAD ARIF BIN AHMED (Jalan Kedidi)",
    noRujukan: "NOTIS-1/2026/017",
    pengirim: {
      nama: "MUHAMMAD ARIF BIN AHMED",
      alamat: ["No. 1837, Jalan Scientex Jaya 32,", "Taman Scientex Senai,", "81400 Senai, Johor."],
      tel: "013-654 3211",
      email: "arifray90@gmail.com",
    },
    penerima: [
      {
        nama: "NICE FRONTIER SDN. BHD. (199401014059 / 299739-U)",
        alamat: ["Level 29, IOI City Tower 2,", "Lebuh IRC, IOI Resort City,", "62502 Putrajaya, WP Putrajaya.", "Tel: +607-5959 222"],
        nota: "Alamat utama (SPA)",
      },
      {
        nama: "NICE FRONTIER SDN. BHD. — Pejabat Cawangan",
        alamat: ["IOI Galleria @ Bandar Putra Kulai,", "Jalan Putra 4, Bandar Putra Kulai,", "81000 Kulai, Johor."],
        nota: "s.k. (CC)",
      },
    ],
    hartanah: "No. 439, Jalan Kedidi 14, Bandar Putra, 81000 Kulai, Johor",
    tarikhNotis: "24 Julai 2026 (deadline 8 Ogos 2026)",
    kaedah: "Pos Berdaftar Akuan Terima (AR) — bersama Laporan Re-Inspection",
  },
  {
    label: "2. CHEN SEE NGA",
    noRujukan: "NOTIS-1/2026/012",
    pengirim: {
      nama: "CHEN SEE NGA",
      alamat: ["#25-06, Menara C,", "Pangsapuri Seri Permata,", "Jalan Kunyit, Taman Sri Amar,", "81100 Johor Bahru, Johor."],
      tel: "+65 8273 47373",
      email: "xiahsn@gmail.com",
    },
    penerima: [
      {
        nama: "TH TEBRAU LAND SDN. BHD. (985928-D)",
        alamat: ["PTD 209290, Jalan Kunyit,", "Taman Sri Amar,", "81100 Johor Bahru, Johor."],
        nota: "Alamat pemaju",
      },
    ],
    hartanah: "Parcel C-25-06, Menara C, Pangsapuri Seri Permata, Jalan Kunyit, Taman Sri Amar, 81100 Johor Bahru, Johor",
    tarikhNotis: "6 Ogos 2026 (deadline 21 Ogos 2026)",
    kaedah: "Serahan tangan / pos berdaftar",
  },
  {
    label: "3. RAJSHRMELA A/P RAJAGOPAL",
    noRujukan: "NOTIS-1/2026/015",
    pengirim: {
      nama: "RAJSHRMELA A/P RAJAGOPAL",
      alamat: ["No. 34, Jalan Makmur 14,", "Taman Damai Jaya,", "81300 Skudai, Johor Bahru, Johor."],
      tel: "010-887 4423",
      email: "Shrmelarajagopal@yahoo.com.my",
    },
    penerima: [
      {
        nama: "INTACT CORPORATE APPROACH SDN BHD (201301019840 / 1049670-K)",
        alamat: ["Level 18, Ho Hup Tower,", "1, Persiaran Jalil 1, Bandar Bukit Jalil,", "57000 Kuala Lumpur."],
        nota: "Surat 1 — Ibu Pejabat (HQ)",
      },
      {
        nama: "INTACT CORPORATE APPROACH SDN BHD (201301019840 / 1049670-K)",
        alamat: ["No. 265, Jalan Kenanga 29/8,", "Indahpura,", "81000 Kulai, Johor."],
        nota: "Surat 2 — Pejabat Johor",
      },
    ],
    hartanah: "No. 27, Jalan Puncak Warisan 2/1, Puncak Warisan, 81900 Kota Tinggi, Johor",
    tarikhNotis: "22 Julai 2026 (deadline 6 Ogos 2026)",
    kaedah: "Dua surat — satu ke HQ KL, satu ke pejabat Johor",
  },
];

const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageW = 210;
const pageH = 297;
const mL = 18;
const mR = 18;
const cW = pageW - mL - mR;
let y = 20;
let pageNum = 1;

function bk() { doc.setTextColor(0, 0, 0); doc.setDrawColor(0, 0, 0); }
function newPage() { doc.addPage(); pageNum++; y = 20; }
function checkBreak(n = 15) { if (y + n > pageH - 15) { newPage(); return true; } return false; }

// Title
doc.setFont("helvetica", "bold"); doc.setFontSize(14); bk();
doc.text("SENARAI ALAMAT PENGIRIM & PENERIMA — NOTIS 1", pageW / 2, y, { align: "center" });
y += 6;
doc.setFont("helvetica", "normal"); doc.setFontSize(10);
doc.text("(Ariffudin/Arif Kedidi, Chen, Rajshrmela)", pageW / 2, y, { align: "center" });
y += 10;

for (const c of clients) {
  checkBreak(80);

  // Client header bar
  doc.setFillColor(230, 230, 230);
  doc.rect(mL, y - 5, cW, 8, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); bk();
  doc.text(c.label, mL + 2, y);
  doc.text(`Ruj: ${c.noRujukan}`, pageW - mR - 2, y, { align: "right" });
  y += 8;

  // Two columns: pengirim left, penerima right
  const colw = (cW - 6) / 2;
  const x1 = mL, x2 = mL + colw + 6;
  let y1 = y, y2 = y;

  doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); bk();
  doc.text("PENGIRIM:", x1, y1); y1 += 5;
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text(c.pengirim.nama, x1, y1); y1 += 4.5;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  for (const l of c.pengirim.alamat) { doc.text(l, x1, y1); y1 += 4.5; }
  doc.text(`Tel: ${c.pengirim.tel}`, x1, y1); y1 += 4.5;
  doc.text(`E-mel: ${c.pengirim.email}`, x1, y1); y1 += 4.5;

  doc.setFont("helvetica", "bold"); doc.setFontSize(9.5);
  doc.text("PENERIMA:", x2, y2); y2 += 5;
  for (const p of c.penerima) {
    doc.setFont("helvetica", "italic"); doc.setFontSize(8.5);
    doc.text(`[${p.nota}]`, x2, y2); y2 += 4;
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5);
    const nl = doc.splitTextToSize(p.nama, colw);
    for (const l of nl) { doc.text(l, x2, y2); y2 += 4.5; }
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    for (const l of p.alamat) { doc.text(l, x2, y2); y2 += 4.5; }
    y2 += 2;
  }

  y = Math.max(y1, y2) + 3;

  // Details rows
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); bk();
  doc.text("Hartanah:", mL, y);
  doc.setFont("helvetica", "normal");
  const hl = doc.splitTextToSize(c.hartanah, cW - 30);
  for (const l of hl) { doc.text(l, mL + 28, y); y += 4.5; }
  doc.setFont("helvetica", "bold");
  doc.text("Tarikh Notis:", mL, y);
  doc.setFont("helvetica", "normal");
  doc.text(c.tarikhNotis, mL + 28, y); y += 4.5;
  doc.setFont("helvetica", "bold");
  doc.text("Kaedah:", mL, y);
  doc.setFont("helvetica", "normal");
  const kl = doc.splitTextToSize(c.kaedah, cW - 30);
  for (const l of kl) { doc.text(l, mL + 28, y); y += 4.5; }

  y += 8;
}

// Footer
for (let p = 1; p <= doc.internal.getNumberOfPages(); p++) {
  doc.setPage(p);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(0, 0, 0);
  doc.text(`Muka ${p}`, pageW - mR, pageH - 8, { align: "right" });
}

const out = doc.output("arraybuffer");
fs.writeFileSync("/home/user/admin/SENARAI_ALAMAT_NOTIS.pdf", Buffer.from(out));
console.log("PDF generated: SENARAI_ALAMAT_NOTIS.pdf");
