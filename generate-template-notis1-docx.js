const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, HeadingLevel,
} = require("docx");

// Teks biasa (hitam) dan teks WAJIB TUKAR (merah bold)
const T = (text, opts = {}) => new TextRun({ text, size: 24, font: "Arial", ...opts });
const R = (text, opts = {}) => new TextRun({ text, size: 24, font: "Arial", color: "FF0000", bold: true, ...opts });

const P = (children, opts = {}) => new Paragraph({ children, spacing: { after: 160, line: 300 }, ...opts });

function cell(runs, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: runs, spacing: { line: 276 } })],
    ...opts,
  });
}

const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 24 } } } },
  sections: [{
    properties: { page: { margin: { top: 1134, bottom: 1134, left: 1418, right: 1418 } } }, // 25mm kiri/kanan
    children: [
      // ===== NOTA TEMPLATE =====
      P([R("TEMPLATE NOTIS 1 — SEMUA TEKS MERAH WAJIB DITUKAR IKUT OWNER/KES. ", { size: 22 }),
         T("Teks hitam adalah ayat standard — jangan ubah kecuali ada remarks khas owner. Padam nota ini sebelum print.", { size: 22, italics: true })]),
      P([T("")]),

      // ===== PENGIRIM =====
      P([R("NAMA PENUH PEMILIK (HURUF BESAR)")], { spacing: { after: 40 } }),
      P([R("Alamat surat-menyurat pemilik — baris 1,")], { spacing: { after: 40 } }),
      P([R("Baris 2,")], { spacing: { after: 40 } }),
      P([R("Poskod, Bandar, Negeri.")], { spacing: { after: 40 } }),
      P([T("No. K/P: "), R("XXXXXX-XX-XXXX")], { spacing: { after: 40 } }),
      P([T("E-mel: "), R("emel@owner.com")], { spacing: { after: 40 } }),
      P([T("Tel: "), R("0XX-XXX XXXX")]),
      P([T("________________________________________________________________________")]),

      // ===== PENERIMA + TARIKH =====
      P([R("NAMA PEMAJU SDN. BHD. (NO. PENDAFTARAN LAMA / BARU)", { })], { spacing: { after: 40 } }),
      P([R("(Pejabat Berdaftar / Pejabat Pengurusan / Tempat Perniagaan — pilih)")], { spacing: { after: 40 } }),
      P([R("Alamat pemaju — baris 1,")], { spacing: { after: 40 } }),
      P([R("Baris 2,")], { spacing: { after: 40 } }),
      P([R("Poskod, Bandar, Negeri."), T("                                                          Tarikh: "), R("TARIKH NOTIS")]),
      P([T("Ruj. Kami: "), R("NOTIS-1/2026/NNN"), T("  "), R("(semak nombor terakhir — berurutan)", { size: 20, italics: true })]),
      P([T("Tuan,")]),

      // ===== PERKARA =====
      P([new TextRun({ text: "Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim)", bold: true, underline: {}, size: 24, font: "Arial" })], { spacing: { after: 40 } }),
      P([new TextRun({ text: "Hartanah: ", bold: true, underline: {}, size: 24, font: "Arial" }),
         R("JENIS RUMAH (cth. Rumah Teres 2 Tingkat)", { underline: {} })], { spacing: { after: 40 } }),
      P([new TextRun({ text: "di ", bold: true, underline: {}, size: 24, font: "Arial" }),
         R("ALAMAT PENUH HARTANAH (termasuk No. Lot/PTD jika ada)", { underline: {} })]),

      // ===== PARA 1 =====
      P([
        T("Saya, "), R("NAMA PEMILIK"), T(" (No. K/P: "), R("XXXXXX-XX-XXXX"), T("), pemilik unit hartanah di alamat di atas (Projek: "),
        R("NAMA PROJEK & FASA"), T("), sebagaimana termaktub di dalam Perjanjian Jual Beli ("),
        R("Jadual G / Jadual H"), T(", Akta Pemajuan Perumahan 1966) bertarikh "), R("TARIKH SPA"), T(" dengan rujukan "),
        R("NO. RUJUKAN SPA"), T(", telah menjalankan Pemeriksaan Kecacatan (Defect Inspection) pada "),
        R("TARIKH FIRST INSPECTION"), T(" dan telah mengemukakan Laporan Pemeriksaan Kecacatan (Defect Inspection Report) secara rasmi kepada pihak tuan melalui "),
        R("KAEDAH SERAHAN (hardcopy / aplikasi XXX / WhatsApp / e-mel)"), T(" pada "), R("TARIKH HANTAR LAPORAN"),
        T(". Pengemukaan tersebut merupakan notis bertulis di bawah Klausa "), R("27(1) [Jadual G] / 30(1) [Jadual H]"),
        T(", dan pihak tuan diwajibkan membaiki semua kecacatan yang dilaporkan, atas kos dan belanja pihak tuan sendiri, dalam tempoh tiga puluh (30) hari."),
      ]),

      // ===== PARA 2 =====
      P([
        T("2.   Namun, walaupun tempoh tiga puluh (30) hari tersebut telah tamat pada "),
        R("TARIKH TAMAT 30 HARI (= tarikh hantar laporan + 30 hari)"),
        T(", Pemeriksaan Semula (Re-Inspection) yang dijalankan pada "), R("TARIKH RE-INSPECTION"),
        T(" mengesahkan bahawa kecacatan masih belum diselesaikan oleh pihak tuan. Laporan Re-Inspection disertakan bersama-sama notis ini sebagai serahan rasmi. Antara kecacatan yang masih wujud dan belum dibaiki adalah seperti berikut:"),
      ]),

      // ===== JADUAL KECACATAN =====
      P([new TextRun({ text: "Senarai Kecacatan yang Masih Belum Diselesaikan:", bold: true, size: 24, font: "Arial" })]),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [
            cell([T("No.", { bold: true })], 8),
            cell([T("Lokasi", { bold: true })], 25),
            cell([T("Kecacatan (Defect)", { bold: true })], 47),
            cell([T("Status", { bold: true })], 20),
          ]}),
          new TableRow({ children: [
            cell([R("No. item dlm laporan")], 8),
            cell([R("Lokasi — Elemen")], 25),
            cell([R("Keterangan BM (English dalam kurungan — still observed)")], 47),
            cell([R("Belum Dibaiki / Kecacatan Baru")], 20),
          ]}),
          new TableRow({ children: [
            cell([R("...")], 8),
            cell([R("... tambah baris ikut bilangan item ...")], 25),
            cell([R("...")], 47),
            cell([R("...")], 20),
          ]}),
        ],
      }),
      P([new TextRun({ text: "*Senarai di atas bukanlah senarai penuh. Kecacatan lain yang turut belum diselesaikan adalah sebagaimana terkandung dalam ", italics: true, size: 20, font: "Arial" }),
         R("Laporan Pemeriksaan Kecacatan Kali Pertama (TARIKH) dan Laporan Re-Inspection (TARIKH)", { italics: true, size: 20 }),
         new TextRun({ text: " yang disertakan bersama-sama notis ini.", italics: true, size: 20, font: "Arial" })], { spacing: { before: 120 } }),

      // ===== PARA 3 — PENEKANAN KHAS =====
      P([
        T("3.   "), R("[PENEKANAN KHAS — tukar ikut kes. Contoh ayat sedia ada: (a) ELEKTRIK: “Perhatian khusus dan SEGERA diberikan kepada item No. X — [isu]. Pembaikan oleh orang kompeten (competent person) berdaftar dengan Suruhanjaya Tenaga dituntut dengan segera, dan bukti penyiapan hendaklah dikemukakan kepada pemilik.” (b) KEBOCORAN: “pihak tuan dituntut MENGESAN DAN MEMBAIKI PUNCA kebocoran tersebut dengan sempurna, dan bukan sekadar kerja kemasan kosmetik.” (c) MAJOR/STRUKTUR: RC terdedah, honeycomb, genting pecah — risiko struktur/kebocoran. (d) AIR BERTAKUNG: betulkan kecerunan (falls), bukan sekadar pengeringan. (e) DAKWAAN DESIGN: “sekiranya keadaan sedia ada merupakan reka bentuk asal yang diluluskan, pihak tuan dituntut mengemukakan dokumen rasmi (official documentation); sekiranya tidak, pembaikan hendaklah dilaksanakan.”]"),
      ]),

      // ===== PARA 4 — AFTER-REPAIR PHOTOS =====
      P([
        T("4.   Bagi kerja pembaikan di kawasan yang sukar diakses oleh pemilik ("),
        R("cth. Ceiling Area, Water Tank Area, Top Roof"),
        T("), pihak tuan dituntut mengemukakan gambar selepas pembaikan (after-repair photos) kepada pemilik melalui e-mel ("),
        R("emel@owner.com"), T(") atau WhatsApp ("), R("0XX-XXX XXXX"), T(") sebagai bukti penyiapan."),
      ]),

      // ===== PARA 5 — KLAUSA =====
      P([
        T("5.   Klausa "), R("27(1) Jadual G / 30(1) Jadual H"),
        T(" Perjanjian Jual Beli memperuntukkan bahawa apa-apa kecacatan, pengecutan atau kerosakan lain (any defect, shrinkage or other faults) yang menjadi ketara dalam tempoh "),
        R("dua puluh empat (24)"),
        T(" bulan selepas pembeli mengambil milikan kosong, yang disebabkan oleh mutu kerja atau bahan yang cacat, hendaklah dibaiki dan diperbetulkan oleh pihak tuan atas kos dan belanja pihak tuan sendiri dalam tempoh tiga puluh (30) hari selepas menerima notis bertulis daripada pembeli."),
      ]),

      // ===== PARA 6 — TUNTUTAN 15 HARI =====
      P([
        T("6.   Dengan ini, saya mengeluarkan Notis Pertama (First Notice) kepada pihak tuan bagi menuntut agar semua kerja pembaikan yang masih tertunggak disiapkan sepenuhnya dalam tempoh 15 hari dari tarikh notis ini dikeluarkan, iaitu sebelum atau pada "),
        R("TARIKH AKHIR (= TARIKH NOTIS + 15 HARI KALENDAR)"),
        T(". Sekiranya pembaikan masih tidak disempurnakan, Notis Kedua iaitu Notis Akhir (Final Notice) akan dikeluarkan dengan tempoh tambahan 15 hari, menjadikan keseluruhan tempoh tiga puluh (30) hari diperuntukkan kepada pihak tuan untuk menyelesaikan semua kerja pembaikan."),
      ]),

      // ===== PARA 7 — BULLETS =====
      P([T("7.   Sekiranya tiada tindakan pembaikan diambil dalam tempoh yang ditetapkan, saya akan:")]),
      P([T("•  Melaksanakan pemeriksaan semula (Re-Inspection) bagi mengesahkan status terkini semua kecacatan;")], { indent: { left: 567 } }),
      P([T("•  Mendapatkan sebut harga rasmi pembaikan (Official Repair Quotation) daripada kontraktor bertauliah;")], { indent: { left: 567 } }),
      P([T("•  Mengemukakan Notis Kedua iaitu Notis Akhir (Final Notice) kepada pihak tuan dan pihak berkepentingan (stakeholders); dan")], { indent: { left: 567 } }),
      P([T("•  Mengambil tindakan selanjutnya termasuk memfailkan tuntutan ke Tribunal Tuntutan Pembeli Rumah (TTPR) atau apa-apa remedi lain yang diperuntukkan di bawah undang-undang.")], { indent: { left: 567 } }),

      // ===== PARA 8 — SERAHAN DOKUMEN =====
      P([
        T("8.   Merujuk kepada klausa Service of Documents (Klausa "),
        R("29(1) Jadual G / 32(1) Jadual H"),
        T(") di dalam Perjanjian Jual Beli, sebarang dokumen yang dihantar kepada pihak tuan melalui serahan tangan atau pos berdaftar adalah dianggap sah dan diterima pakai sebagai dokumen rasmi."),
      ]),

      // ===== LEGAL =====
      P([new TextRun({ text: "Peringatan Tindakan Undang-undang (Legal Action Notice)", bold: true, underline: {}, size: 24, font: "Arial" })]),
      P([
        T("9.   Sekiranya pihak tuan masih gagal mengambil tindakan selepas Notis Kedua (Final Notice) dikeluarkan, saya akan mengambil tindakan undang-undang selanjutnya, termasuk memfailkan tuntutan rasmi di Tribunal Tuntutan Pembeli Rumah — TTPR (Homebuyer Claims Tribunal) di bawah Peraturan-peraturan Pemajuan Perumahan (Tribunal Tuntutan Pembeli Rumah) 2002 dan/atau mahkamah yang berbidang kuasa, bagi mendapatkan perintah pembaikan, kos pembaikan atau pampasan yang sewajarnya sebagaimana diperuntukkan di bawah Perjanjian Jual Beli dan Akta Pemajuan Perumahan (Kawalan dan Pelesenan) 1966 [Akta 118]."),
      ]),

      P([T("Saya berharap pihak tuan mengambil tindakan segera terhadap Notis Pertama ini. Atas kerjasama dan perhatian tuan diucapkan ribuan terima kasih.")]),
      P([T("Sekian.")]),
      P([T("")]),
      P([T("Yang benar,")]),
      P([T("")]),
      P([T("_____________________________")]),
      P([T("("), R("NAMA PEMILIK"), T(")")], { spacing: { after: 40 } }),
      P([T("No. K/P: "), R("XXXXXX-XX-XXXX")], { spacing: { after: 40 } }),
      P([T("E-mel: "), R("emel@owner.com")], { spacing: { after: 40 } }),
      P([T("Telefon: "), R("0XX-XXX XXXX")]),

      // ===== KRONOLOGI =====
      new Paragraph({ children: [new TextRun({ text: "KRONOLOGI TINDAKAN", bold: true, underline: {}, size: 24, font: "Arial" })], alignment: AlignmentType.CENTER, pageBreakBefore: true, spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "(Chronology of Actions)", size: 20, font: "Arial" })], alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [cell([T("Tarikh (Date)", { bold: true })], 25), cell([T("Peristiwa (Event)", { bold: true })], 75)] }),
          new TableRow({ children: [cell([R("TARIKH SPA")], 25), cell([T("Perjanjian Jual Beli (Sale and Purchase Agreement) ditandatangani — "), R("NAMA PROJEK (Ruj: NO. SPA)")], 75)] }),
          new TableRow({ children: [cell([R("TARIKH FIRST INSPECTION")], 25), cell([T("Pemeriksaan Kecacatan Kali Pertama (First Defect Inspection) dijalankan ke atas hartanah")], 75)] }),
          new TableRow({ children: [cell([R("TARIKH HANTAR LAPORAN")], 25), cell([T("Laporan Pemeriksaan Kecacatan dikemukakan secara rasmi melalui "), R("KAEDAH"), T(" — merupakan notis bertulis di bawah Klausa "), R("27(1)/30(1)")], 75)] }),
          new TableRow({ children: [cell([R("TARIKH +30 HARI")], 25), cell([T("Tamat tempoh tiga puluh (30) hari pembaikan — pembaikan masih belum disiapkan sepenuhnya")], 75)] }),
          new TableRow({ children: [cell([R("TARIKH RE-INSPECTION")], 25), cell([T("Pemeriksaan Semula (Re-Inspection) dijalankan — "), R("X"), T(" kecacatan masih belum diselesaikan")], 75)] }),
          new TableRow({ children: [cell([R("TARIKH NOTIS")], 25), cell([T("Notis Pertama (First Notice) dikeluarkan")], 75)] }),
          new TableRow({ children: [cell([R("TARIKH NOTIS + 15 HARI")], 25), cell([T("Tarikh akhir pembaikan (15 hari dari Notis Pertama)")], 75)] }),
        ],
      }),

      // ===== AKUAN TERIMA x2 =====
      ...[["Salinan Pemaju (Developer's Copy)"], ["Salinan Pemilik (Owner's Copy)"]].flatMap(([label]) => [
        new Paragraph({ children: [new TextRun({ text: label, italics: true, size: 20, font: "Arial" })], alignment: AlignmentType.RIGHT, pageBreakBefore: true, spacing: { after: 240 } }),
        new Paragraph({ children: [new TextRun({ text: "AKUAN TERIMA OLEH PEMAJU", bold: true, underline: {}, size: 24, font: "Arial" })], alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "(Developer's Acknowledgement of Receipt)", size: 20, font: "Arial" })], alignment: AlignmentType.CENTER, spacing: { after: 300 } }),
        P([
          T("Dengan ini diakui bahawa "), R("NAMA PEMAJU SDN. BHD. (NO. SYARIKAT)"),
          T(" telah menerima Notis Pertama — Tuntutan Pembetulan Kecacatan (Defect Rectification Claim) bertarikh "),
          R("TARIKH NOTIS"), T(" dengan rujukan "), R("NOTIS-1/2026/NNN"), T(" daripada "), R("NAMA PEMILIK"),
          T(" berhubung hartanah di "), R("ALAMAT HARTANAH"), T("."),
        ]),
        P([T("")]),
        P([new TextRun({ text: "Diterima oleh:", bold: true, size: 24, font: "Arial" })], { spacing: { after: 300 } }),
        P([T("Nama          : ______________________________________")], { spacing: { after: 300 } }),
        P([T("Jawatan      : ______________________________________")], { spacing: { after: 300 } }),
        P([T("Tarikh          : ______________________________________")], { spacing: { after: 300 } }),
        P([new TextRun({ text: "Cop Syarikat (Company Stamp):", bold: true, size: 20, font: "Arial" })]),
        P([T("")]), P([T("")]), P([T("")]),
      ]),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/home/user/admin/TEMPLATE_NOTIS_1.docx", buf);
  console.log("DOCX generated: TEMPLATE_NOTIS_1.docx");
});
