const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, PageBreak, UnderlineType,
} = require("docx");
const fs = require("fs");

// Helper: yellow-highlighted run = field to change per client
function hl(text, opts = {}) {
  return new TextRun({ text, highlight: "yellow", size: 24, font: "Helvetica", ...opts });
}
function tr(text, opts = {}) {
  return new TextRun({ text, size: 24, font: "Helvetica", ...opts });
}
function para(children, opts = {}) {
  return new Paragraph({ children, spacing: { after: 160, line: 300 }, ...opts });
}

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };

function cell(text, { bold = false, highlight = false, width } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({
      children: [highlight ? hl(text, { bold, size: 20 }) : tr(text, { bold, size: 20 })],
      spacing: { after: 0 },
    })],
  });
}

const CW = 9360; // content width DXA (A4, 25mm margins ~ 160mm = 9072; use ~9070)
const W = 9070;

const doc = new Document({
  styles: { default: { document: { run: { font: "Helvetica", size: 24 } } } },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1418, bottom: 1418, left: 1418, right: 1418 }, // 25mm
      },
    },
    children: [
      // ============ PENGIRIM ============
      para([hl("NAMA PENUH PEMBELI (HURUF BESAR)", { bold: true })], { spacing: { after: 40 } }),
      para([hl("Alamat surat-menyurat baris 1,")], { spacing: { after: 40 } }),
      para([hl("Alamat baris 2,")], { spacing: { after: 40 } }),
      para([hl("Poskod, Bandar, Negeri.")], { spacing: { after: 40 } }),
      para([tr("No. K/P: ", { size: 20 }), hl("XXXXXX-XX-XXXX", { size: 20 })], { spacing: { after: 40 } }),
      para([tr("E-mel: ", { size: 20 }), hl("emel@contoh.com", { size: 20 })], { spacing: { after: 40 } }),
      para([tr("Tel: ", { size: 20 }), hl("01X-XXX XXXX", { size: 20 })], { spacing: { after: 120 } }),

      new Paragraph({
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" } },
        children: [],
        spacing: { after: 200 },
      }),

      // ============ PENERIMA ============
      para([hl("NAMA PEMAJU SDN. BHD. (No. Pendaftaran Syarikat)", { bold: true })], { spacing: { after: 40 } }),
      para([hl("Alamat pemaju baris 1,")], { spacing: { after: 40 } }),
      para([hl("Alamat pemaju baris 2,")], { spacing: { after: 40 } }),
      para([hl("Poskod, Bandar, Negeri.")], { spacing: { after: 40 } }),
      para([tr("")], { spacing: { after: 0 } }),
      para([hl("TARIKH NOTIS (cth: 15 Ogos 2026)", { bold: true })], { alignment: AlignmentType.RIGHT, spacing: { after: 120 } }),
      para([tr("Ruj. Kami: ", { size: 20 }), hl("NOTIS-1/2026/0XX", { size: 20 })], { spacing: { after: 200 } }),

      para([tr("Tuan,")], { spacing: { after: 200 } }),

      // ============ PERKARA ============
      para([tr("Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim)", { bold: true, underline: { type: UnderlineType.SINGLE } })], { spacing: { after: 40 } }),
      para([tr("Hartanah: ", { bold: true, underline: { type: UnderlineType.SINGLE } }), hl("Jenis rumah (cth: Rumah Teres 2 Tingkat)", { bold: true, underline: { type: UnderlineType.SINGLE } })], { spacing: { after: 40 } }),
      para([tr("di ", { bold: true, underline: { type: UnderlineType.SINGLE } }), hl("Alamat penuh unit hartanah", { bold: true, underline: { type: UnderlineType.SINGLE } })], { spacing: { after: 240 } }),

      // ============ PERENGGAN 1 ============
      para([
        tr("Saya, "), hl("NAMA PEMBELI"), tr(" (No. K/P: "), hl("XXXXXX-XX-XXXX"),
        tr("), pemilik unit hartanah di alamat di atas, sebagaimana termaktub di dalam Perjanjian Jual Beli bertarikh "),
        hl("TARIKH SPA"), tr(" (No. Rujukan SPA: "), hl("NO RUJUKAN SPA"),
        tr(") mengikut "), hl("Jadual G / Jadual H"),
        tr(", telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui "),
        hl("kaedah serahan (cth: aplikasi XXX / serahan tangan)"), tr(" pada "), hl("TARIKH SERAHAN LAPORAN"),
        tr(". Pihak tuan telah diberikan tempoh tiga puluh (30) hari untuk melaksanakan pembaikan terhadap semua kecacatan yang dilaporkan."),
      ]),

      // ============ PERENGGAN 2 ============
      para([
        tr("2.    Namun, sehingga tarikh notis ini dikeluarkan, didapati bahawa pembaikan terhadap kecacatan yang telah dilaporkan masih belum dilaksanakan sepenuhnya oleh pihak tuan. "),
        hl("[PILIHAN — jika ada pemeriksaan kali kedua: \"Berdasarkan pemeriksaan kali kedua pada TARIKH, ...\"]"),
        tr(" Kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:"),
      ]),

      // ============ JADUAL DEFECTS ============
      para([tr("Senarai Kecacatan yang Masih Belum Diselesaikan:", { bold: true })], { spacing: { after: 120 } }),

      new Table({
        columnWidths: [900, 2200, 3970, 2000],
        width: { size: W, type: WidthType.DXA },
        rows: [
          new TableRow({
            children: [
              cell("No.", { bold: true, width: 900 }),
              cell("Lokasi", { bold: true, width: 2200 }),
              cell("Kecacatan (Defect)", { bold: true, width: 3970 }),
              cell("Status", { bold: true, width: 2000 }),
            ],
          }),
          new TableRow({
            children: [
              cell("TAG", { highlight: true, width: 900 }),
              cell("Lokasi — Elemen", { highlight: true, width: 2200 }),
              cell("Keterangan kecacatan (BM + English dalam kurungan)", { highlight: true, width: 3970 }),
              cell("Belum Dibaiki", { highlight: true, width: 2000 }),
            ],
          }),
          new TableRow({
            children: [
              cell("TAG", { highlight: true, width: 900 }),
              cell("Lokasi — Elemen", { highlight: true, width: 2200 }),
              cell("Keterangan kecacatan", { highlight: true, width: 3970 }),
              cell("Belum Dibaiki Sepenuhnya", { highlight: true, width: 2000 }),
            ],
          }),
          new TableRow({
            children: [
              cell("...", { highlight: true, width: 900 }),
              cell("(tambah baris ikut bilangan defect)", { highlight: true, width: 2200 }),
              cell("...", { highlight: true, width: 3970 }),
              cell("...", { highlight: true, width: 2000 }),
            ],
          }),
        ],
      }),

      para([], { spacing: { after: 80 } }),
      para([
        tr("*Senarai di atas bukanlah senarai penuh. Kecacatan lain adalah sebagaimana terkandung dalam Laporan Pemeriksaan Kecacatan yang telah diserahkan kepada pihak tuan melalui ", { italics: true, size: 18 }),
        hl("kaedah serahan", { italics: true, size: 18 }),
        tr(" pada ", { italics: true, size: 18 }),
        hl("TARIKH SERAHAN", { italics: true, size: 18 }),
        tr(".", { italics: true, size: 18 }),
      ]),

      // ============ PERENGGAN 3 ============
      para([
        tr("3.    Klausa "), hl("27(1) [Jadual G] / 26(1) atau 30(1) [Jadual H — semak SPA]"),
        tr(" Perjanjian Jual Beli memperuntukkan bahawa pemaju hendaklah, atas kos dan belanjanya sendiri, membaiki dan memperbetulkan apa-apa kecacatan, pengecutan atau kerosakan lain yang menjejaskan hartanah tersebut dalam tempoh 24 bulan dari tarikh penyerahan milikan kosong (DLP — Defect Liability Period)."),
      ]),

      // ============ PERENGGAN 4 ============
      para([
        tr("4.    Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh 15 hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada "),
        hl("TARIKH DEADLINE (tarikh notis + 15 hari kalendar)"),
        tr(". Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan 15 hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan."),
      ]),

      // ============ PERENGGAN 5 ============
      para([tr("5.    Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:")]),
      para([tr("•  Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;")], { indent: { left: 720 }, spacing: { after: 60 } }),
      para([tr("•  Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;")], { indent: { left: 720 }, spacing: { after: 60 } }),
      para([tr("•  Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan")], { indent: { left: 720 }, spacing: { after: 60 } }),
      para([tr("•  Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.")], { indent: { left: 720 } }),

      // ============ PERENGGAN 6 ============
      para([
        tr("6.    Merujuk kepada klausa Service of Documents (Klausa "),
        hl("29(1) [Jadual G] / 28(1) atau 32(1) [Jadual H — semak SPA]"),
        tr(") di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi."),
      ]),

      // ============ LEGAL ACTION ============
      para([tr("Peringatan Tindakan Undang-undang (Legal Action Notice)", { bold: true, underline: { type: UnderlineType.SINGLE } })], { spacing: { after: 160 } }),
      para([
        tr("7.    Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan memfailkan tuntutan rasmi ke Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau apa-apa remedi lain yang diperuntukkan di bawah Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 (Akta 118) untuk mendapatkan perintah pembaikan atau pampasan yang sewajarnya."),
      ]),

      para([tr("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.")]),
      para([tr("Sekian.")], { spacing: { after: 400 } }),

      // ============ TANDATANGAN ============
      para([tr("Yang benar,")], { spacing: { after: 600 } }),
      para([tr("________________________________")], { spacing: { after: 60 } }),
      para([tr("("), hl("NAMA PEMBELI", { bold: true }), tr(")", { bold: true })], { spacing: { after: 40 } }),
      para([tr("No. K/P: ", { size: 20 }), hl("XXXXXX-XX-XXXX", { size: 20 })], { spacing: { after: 40 } }),
      para([tr("E-mel: ", { size: 20 }), hl("emel@contoh.com", { size: 20 })], { spacing: { after: 40 } }),
      para([tr("Telefon: ", { size: 20 }), hl("01X-XXX XXXX", { size: 20 })], { spacing: { after: 200 } }),

      para([
        tr("s.k. (CC): ", { bold: true, size: 20 }),
        hl("[PILIHAN — kalau ada alamat kedua pemaju/pejabat cawangan, letak sini; kalau tiada, padam baris ini]", { size: 20 }),
      ]),

      // ============ PAGE: KRONOLOGI ============
      new Paragraph({ children: [new PageBreak()] }),
      para([tr("KRONOLOGI TINDAKAN", { bold: true, underline: { type: UnderlineType.SINGLE } })], { alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
      para([tr("(Chronology of Actions)", { size: 20 })], { alignment: AlignmentType.CENTER, spacing: { after: 240 } }),

      new Table({
        columnWidths: [2270, 6800],
        width: { size: W, type: WidthType.DXA },
        rows: [
          new TableRow({ children: [cell("Tarikh (Date)", { bold: true, width: 2270 }), cell("Peristiwa (Event)", { bold: true, width: 6800 })] }),
          new TableRow({ children: [cell("TARIKH SPA", { highlight: true, width: 2270 }), cell("Perjanjian Jual Beli (SPA) ditandatangani — Jadual G/H  [tukar ikut SPA]", { highlight: true, width: 6800 })] }),
          new TableRow({ children: [cell("TARIKH", { highlight: true, width: 2270 }), cell("Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah", { highlight: true, width: 6800 })] }),
          new TableRow({ children: [cell("TARIKH", { highlight: true, width: 2270 }), cell("Laporan Pemeriksaan Kecacatan diserahkan kepada pemaju melalui [kaedah serahan] (No. kes/tiket: XXX — jika ada)", { highlight: true, width: 6800 })] }),
          new TableRow({ children: [cell("TARIKH +30 hari", { highlight: true, width: 2270 }), cell("Tamat tempoh 30 hari pembaikan oleh pemaju — [tiada pembaikan / pembaikan belum disiapkan sepenuhnya]", { highlight: true, width: 6800 })] }),
          new TableRow({ children: [cell("TARIKH (jika ada)", { highlight: true, width: 2270 }), cell("[PILIHAN] Pemeriksaan Kecacatan Kali Kedua (Re-Inspection) dijalankan — kecacatan masih wujud", { highlight: true, width: 6800 })] }),
          new TableRow({ children: [cell("TARIKH NOTIS", { highlight: true, width: 2270 }), cell("Notis Pertama (First Notice) dikeluarkan", { highlight: true, width: 6800 })] }),
          new TableRow({ children: [cell("TARIKH DEADLINE", { highlight: true, width: 2270 }), cell("Tarikh akhir pembaikan (15 hari dari Notis Pertama)", { highlight: true, width: 6800 })] }),
        ],
      }),

      // ============ PAGE: AKUAN TERIMA ============
      new Paragraph({ children: [new PageBreak()] }),
      para([tr("Salinan Pemaju (Developer's Copy)", { italics: true, size: 20 })], { alignment: AlignmentType.RIGHT, spacing: { after: 200 } }),
      para([tr("AKUAN TERIMA OLEH PEMAJU", { bold: true, underline: { type: UnderlineType.SINGLE } })], { alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
      para([tr("(Developer's Acknowledgement of Receipt)", { size: 20 })], { alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
      para([
        tr("Dengan ini diakui bahawa "), hl("NAMA PEMAJU SDN. BHD. (No. Syarikat)"),
        tr(" telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh "),
        hl("TARIKH NOTIS"), tr(" dengan rujukan "), hl("NOTIS-1/2026/0XX"),
        tr(" daripada "), hl("NAMA PEMBELI"), tr(" berhubung hartanah di "), hl("ALAMAT HARTANAH"), tr("."),
      ], { spacing: { after: 400 } }),
      para([tr("Diterima oleh:", { bold: true })], { spacing: { after: 300 } }),
      para([tr("Nama        : ________________________________")], { spacing: { after: 300 } }),
      para([tr("Jawatan     : ________________________________")], { spacing: { after: 300 } }),
      para([tr("Tarikh      : ________________________________")], { spacing: { after: 300 } }),
      para([tr("Cop Syarikat (Company Stamp):", { bold: true, size: 20 })], { spacing: { after: 100 } }),
      new Table({
        columnWidths: [3400],
        width: { size: 3400, type: WidthType.DXA },
        rows: [new TableRow({ height: { value: 2000, rule: "atLeast" }, children: [new TableCell({ width: { size: 3400, type: WidthType.DXA }, children: [new Paragraph("")] })] })],
      }),

      // Nota template
      new Paragraph({ children: [new PageBreak()] }),
      para([tr("NOTA PENGGUNAAN TEMPLATE (padam muka surat ini sebelum hantar)", { bold: true, size: 22 })], { spacing: { after: 200 } }),
      para([tr("1. Semua teks ber-highlight KUNING perlu ditukar mengikut maklumat client.", { size: 22 })]),
      para([tr("2. Rumah landed biasanya Jadual G — Klausa pembaikan 27(1), Service of Documents 29(1). Strata/apartment Jadual H — biasanya 26(1) & 28(1), tetapi SEMAK SPA (ada SPA guna 30(1) & 32(1)).", { size: 22 })]),
      para([tr("3. Deadline = tarikh notis + 15 HARI KALENDAR.", { size: 22 })]),
      para([tr("4. Ulang muka surat Akuan Terima sekali lagi untuk 'Salinan Pemilik (Owner's Copy)'.", { size: 22 })]),
      para([tr("5. Tambah/padam baris jadual defect & kronologi ikut kes.", { size: 22 })]),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/home/user/admin/TEMPLATE_NOTIS_1.docx", buf);
  console.log("DOCX generated: TEMPLATE_NOTIS_1.docx");
});
