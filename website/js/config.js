/* ==========================================================================
   TEMPAT UTAMA UNTUK EDIT MAKLUMAT SYARIKAT
   Ubah nilai di bawah sahaja — tak perlu sentuh index.html.
   ========================================================================== */

window.SITE_CONFIG = {
  // --- Identiti syarikat ---
  companyName: "Go Home Inspection",
  legalName: "GoXpert Solutions",
  tagline: {
    bm: "Pemeriksaan hartanah profesional sebelum anda serah kunci.",
    en: "Professional property inspection before you take the keys.",
  },
  ssm: "",                 // Contoh: "202301234567 (003123456-X)"

  // --- Hubungi ---
  phone: "+60 11-3144 6591",
  phoneRaw: "601131446591",           // untuk pautan WhatsApp / tel:
  email: "Team.gohomeinspection@gmail.com",
  address: "",                        // Contoh: "No 1, Jalan ABC, 43000 Kajang, Selangor"
  serviceAreas: "Lembah Klang, Selangor & Kuala Lumpur",
  hours: "Isnin – Sabtu, 9:00 pagi – 6:00 petang",

  // --- Media sosial (kosongkan jika tiada) ---
  social: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
  },

  // --- Pautan app / borang tempahan ---
  bookingUrl: "",          // Kosong = guna WhatsApp secara automatik
  appUrl: "",              // Pautan ke GoInspect app (jika mahu dipaparkan)

  // --- Perkhidmatan (tambah / buang ikut suka) ---
  services: [
    {
      icon: "🏠",
      title: { bm: "Pemeriksaan Rumah Baharu", en: "New Home Inspection" },
      desc: {
        bm: "Pemeriksaan menyeluruh sebelum tamat tempoh DLP. Semua kecacatan direkod dengan gambar & lokasi tepat.",
        en: "Full inspection before the DLP expires. Every defect logged with photos and exact location.",
      },
    },
    {
      icon: "🔁",
      title: { bm: "Pemeriksaan Semula (Re-Inspection)", en: "Re-Inspection" },
      desc: {
        bm: "Kami semak semula kerja pembaikan pemaju dan sahkan setiap item benar-benar selesai.",
        en: "We re-verify the developer's repair work and confirm each item is genuinely closed.",
      },
    },
    {
      icon: "🔑",
      title: { bm: "Rumah Subsale & Sewa", en: "Subsale & Rental" },
      desc: {
        bm: "Nilai keadaan sebenar hartanah sebelum beli atau sebelum serah kepada penyewa.",
        en: "Assess the true condition of a property before buying or handing over to a tenant.",
      },
    },
    {
      icon: "🏢",
      title: { bm: "Komersial & Pejabat", en: "Commercial & Office" },
      desc: {
        bm: "Pemeriksaan unit kedai, pejabat dan ruang komersial mengikut skop yang dipersetujui.",
        en: "Inspection of shoplots, offices and commercial spaces based on an agreed scope.",
      },
    },
  ],

  // --- Proses kerja ---
  steps: [
    {
      title: { bm: "Tempah", en: "Book" },
      desc: {
        bm: "Hubungi kami melalui WhatsApp atau borang. Kami sahkan tarikh dan harga.",
        en: "Reach us on WhatsApp or the form. We confirm the date and price.",
      },
    },
    {
      title: { bm: "Periksa", en: "Inspect" },
      desc: {
        bm: "Pemeriksa bertauliah datang ke tapak dan merekod setiap kecacatan dengan gambar.",
        en: "A certified inspector visits the site and records every defect with photos.",
      },
    },
    {
      title: { bm: "Laporan", en: "Report" },
      desc: {
        bm: "Anda terima laporan PDF penuh — ringkas, bergambar dan mudah dihantar kepada pemaju.",
        en: "You receive a full PDF report — clear, photo-backed and easy to send to the developer.",
      },
    },
    {
      title: { bm: "Susulan", en: "Follow-up" },
      desc: {
        bm: "Selepas pemaju baiki, kami buat pemeriksaan semula untuk sahkan kerja siap.",
        en: "After the developer repairs, we re-inspect to confirm the work is done.",
      },
    },
  ],

  // --- Pakej harga (biarkan kosong [] jika belum mahu papar harga) ---
  packages: [
    {
      name: { bm: "Asas", en: "Basic" },
      price: "RM —",
      note: { bm: "Sesuai untuk apartmen kecil", en: "Suited to smaller apartments" },
      features: {
        bm: ["Pemeriksaan penuh 1 unit", "Laporan PDF bergambar", "Penghantaran dalam 48 jam"],
        en: ["Full inspection of 1 unit", "Photo PDF report", "Delivered within 48 hours"],
      },
      featured: false,
    },
    {
      name: { bm: "Standard", en: "Standard" },
      price: "RM —",
      note: { bm: "Pilihan paling popular", en: "Most popular choice" },
      features: {
        bm: ["Semua dalam pakej Asas", "1 kali pemeriksaan semula", "Sokongan WhatsApp"],
        en: ["Everything in Basic", "1 free re-inspection", "WhatsApp support"],
      },
      featured: true,
    },
    {
      name: { bm: "Premium", en: "Premium" },
      price: "RM —",
      note: { bm: "Rumah teres, banglo & komersial", en: "Landed, bungalow & commercial" },
      features: {
        bm: ["Semua dalam pakej Standard", "2 kali pemeriksaan semula", "Keutamaan tarikh tempahan"],
        en: ["Everything in Standard", "2 free re-inspections", "Priority booking dates"],
      },
      featured: false,
    },
  ],

  // --- Testimoni pelanggan ---
  testimonials: [
    { name: "—", role: { bm: "Pemilik rumah", en: "Homeowner" }, quote: { bm: "Tulis testimoni pelanggan di sini.", en: "Put a customer testimonial here." } },
    { name: "—", role: { bm: "Pembeli hartanah", en: "Property buyer" }, quote: { bm: "Tulis testimoni pelanggan di sini.", en: "Put a customer testimonial here." } },
  ],

  // --- Soalan lazim ---
  faqs: [
    {
      q: { bm: "Berapa lama pemeriksaan mengambil masa?", en: "How long does an inspection take?" },
      a: {
        bm: "Bergantung saiz unit — biasanya 2 hingga 4 jam bagi apartmen, lebih lama untuk rumah teres dan banglo.",
        en: "It depends on unit size — usually 2 to 4 hours for an apartment, longer for landed homes.",
      },
    },
    {
      q: { bm: "Bila saya terima laporan?", en: "When do I get the report?" },
      a: {
        bm: "Laporan PDF penuh dihantar dalam masa 48 jam selepas pemeriksaan.",
        en: "The full PDF report is sent within 48 hours after the inspection.",
      },
    },
    {
      q: { bm: "Perlukah saya hadir semasa pemeriksaan?", en: "Do I need to be present?" },
      a: {
        bm: "Tidak wajib, tetapi digalakkan supaya kami boleh terus terangkan penemuan di tapak.",
        en: "Not required, but recommended so we can walk you through the findings on site.",
      },
    },
    {
      q: { bm: "Kawasan mana yang anda liputi?", en: "Which areas do you cover?" },
      a: {
        bm: "Kami beroperasi di Lembah Klang. Untuk kawasan lain, hubungi kami untuk semakan.",
        en: "We operate around the Klang Valley. For other areas, contact us to check availability.",
      },
    },
  ],
};
