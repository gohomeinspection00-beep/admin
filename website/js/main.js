/* ==========================================================================
   Go Home Inspection — logik laman web
   Semua kandungan datang dari js/config.js. Fail ini jarang perlu diubah.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var lang = localStorage.getItem("ghi_lang") || "bm";

  /* --- Teks tetap (label UI) untuk dua bahasa --- */
  var I18N = {
    bm: {
      "nav.services": "Perkhidmatan", "nav.process": "Proses", "nav.packages": "Pakej",
      "nav.about": "Tentang", "nav.faq": "Soalan Lazim", "nav.contact": "Hubungi", "nav.book": "Tempah",
      "hero.eyebrow": "Pemeriksa hartanah bertauliah",
      "hero.title": "Jangan terima kunci sebelum rumah anda diperiksa.",
      "hero.cta1": "Tempah pemeriksaan", "hero.cta2": "Lihat perkhidmatan",
      "hero.p1": "Laporan PDF bergambar penuh",
      "hero.p2": "Setiap kecacatan direkod & dijejak",
      "hero.p3": "Pemeriksaan semula selepas pembaikan",
      "services.title": "Perkhidmatan kami",
      "services.sub": "Skop pemeriksaan yang kami sediakan untuk pemilik dan pembeli hartanah.",
      "process.title": "Bagaimana ia berfungsi",
      "process.sub": "Empat langkah mudah dari tempahan hingga kecacatan selesai.",
      "packages.title": "Pakej",
      "packages.sub": "Harga akhir bergantung saiz dan jenis hartanah. Hubungi kami untuk sebut harga tepat.",
      "packages.cta": "Pilih pakej ini", "packages.badge": "Popular",
      "about.title": "Tentang kami",
      "about.p1": "Go Home Inspection ialah pasukan pemeriksa hartanah yang membantu pemilik rumah di Malaysia memastikan unit mereka diserahkan dalam keadaan yang sepatutnya.",
      "about.p2": "Setiap pemeriksaan direkod menggunakan sistem GoInspect kami sendiri — setiap kecacatan bergambar, berlokasi dan boleh dijejak sehingga pemaju menyelesaikannya.",
      "about.s1": "Unit diperiksa", "about.s2": "Kecacatan direkod", "about.s3": "Tahun pengalaman",
      "testi.title": "Kata pelanggan",
      "faq.title": "Soalan lazim",
      "contact.title": "Hubungi kami",
      "contact.sub": "Beritahu kami jenis hartanah dan tarikh yang anda mahukan. Kami balas secepat mungkin.",
      "contact.phone": "Telefon / WhatsApp", "contact.email": "E-mel", "contact.address": "Alamat",
      "contact.areas": "Kawasan liputan", "contact.hours": "Waktu operasi",
      "form.name": "Nama", "form.phone": "No. telefon", "form.type": "Jenis hartanah",
      "form.msg": "Butiran ringkas", "form.send": "Hantar melalui WhatsApp",
      "form.note": "Butang ini akan membuka WhatsApp dengan mesej yang sudah siap ditaip.",
      "form.t1": "Apartmen / Kondominium", "form.t2": "Rumah teres", "form.t3": "Semi-D / Banglo",
      "form.t4": "Komersial / Pejabat", "form.t5": "Lain-lain",
      "form.required": "Sila isi nama dan nombor telefon.",
      "footer.rights": "Hak cipta terpelihara.",
      "wa.greeting": "Salam, saya berminat dengan perkhidmatan pemeriksaan hartanah.",
    },
    en: {
      "nav.services": "Services", "nav.process": "Process", "nav.packages": "Packages",
      "nav.about": "About", "nav.faq": "FAQ", "nav.contact": "Contact", "nav.book": "Book",
      "hero.eyebrow": "Certified property inspectors",
      "hero.title": "Don't take the keys before your home is inspected.",
      "hero.cta1": "Book an inspection", "hero.cta2": "See services",
      "hero.p1": "Full photo-backed PDF report",
      "hero.p2": "Every defect logged & tracked",
      "hero.p3": "Re-inspection after repairs",
      "services.title": "Our services",
      "services.sub": "The inspection scopes we offer to property owners and buyers.",
      "process.title": "How it works",
      "process.sub": "Four simple steps from booking to closed defects.",
      "packages.title": "Packages",
      "packages.sub": "Final pricing depends on property size and type. Contact us for an exact quote.",
      "packages.cta": "Choose this package", "packages.badge": "Popular",
      "about.title": "About us",
      "about.p1": "Go Home Inspection is a team of property inspectors helping Malaysian homeowners make sure their unit is handed over in the condition it should be.",
      "about.p2": "Every inspection is recorded in our own GoInspect system — each defect photographed, located and tracked until the developer resolves it.",
      "about.s1": "Units inspected", "about.s2": "Defects logged", "about.s3": "Years of experience",
      "testi.title": "What clients say",
      "faq.title": "Frequently asked questions",
      "contact.title": "Contact us",
      "contact.sub": "Tell us the property type and the date you want. We'll reply as soon as we can.",
      "contact.phone": "Phone / WhatsApp", "contact.email": "Email", "contact.address": "Address",
      "contact.areas": "Coverage area", "contact.hours": "Business hours",
      "form.name": "Name", "form.phone": "Phone number", "form.type": "Property type",
      "form.msg": "Brief details", "form.send": "Send via WhatsApp",
      "form.note": "This opens WhatsApp with your message already written.",
      "form.t1": "Apartment / Condominium", "form.t2": "Terrace house", "form.t3": "Semi-D / Bungalow",
      "form.t4": "Commercial / Office", "form.t5": "Other",
      "form.required": "Please fill in your name and phone number.",
      "footer.rights": "All rights reserved.",
      "wa.greeting": "Hi, I'm interested in your property inspection service.",
    },
  };

  function t(key) {
    var pack = I18N[lang] || I18N.bm;
    return pack[key] != null ? pack[key] : (I18N.bm[key] || "");
  }

  /* Ambil nilai dwibahasa dari config: boleh {bm,en} atau string biasa */
  function pick(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value[lang] != null ? value[lang] : (value.bm || value.en || "");
    }
    return value || "";
  }

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function waLink(message) {
    var num = (C.phoneRaw || "").replace(/\D/g, "");
    if (!num) return C.bookingUrl || "#contact";
    return "https://wa.me/" + num + (message ? "?text=" + encodeURIComponent(message) : "");
  }

  /* ---------- Render bahagian dinamik ---------- */

  function renderServices() {
    var grid = document.getElementById("servicesGrid");
    if (!grid) return;
    grid.innerHTML = "";
    (C.services || []).forEach(function (s) {
      var card = el("article", "card");
      card.appendChild(el("div", "card-icon", s.icon || "•"));
      card.appendChild(el("h3", null, pick(s.title)));
      card.appendChild(el("p", null, pick(s.desc)));
      grid.appendChild(card);
    });
  }

  function renderSteps() {
    var list = document.getElementById("stepsList");
    if (!list) return;
    list.innerHTML = "";
    (C.steps || []).forEach(function (s) {
      var li = el("li");
      li.appendChild(el("h3", null, pick(s.title)));
      li.appendChild(el("p", null, pick(s.desc)));
      list.appendChild(li);
    });
  }

  function renderPackages() {
    var grid = document.getElementById("packagesGrid");
    var section = document.getElementById("packages");
    if (!grid) return;
    var pkgs = C.packages || [];
    if (!pkgs.length) { if (section) section.hidden = true; return; }
    if (section) section.hidden = false;

    grid.innerHTML = "";
    pkgs.forEach(function (p) {
      var card = el("article", "card pkg" + (p.featured ? " featured" : ""));
      if (p.featured) card.appendChild(el("span", "pkg-badge", t("packages.badge")));
      card.appendChild(el("h3", null, pick(p.name)));
      card.appendChild(el("div", "pkg-price", p.price || ""));
      card.appendChild(el("p", "pkg-note", pick(p.note)));

      var ul = el("ul");
      var feats = p.features && (p.features[lang] || p.features.bm || p.features.en);
      (feats || []).forEach(function (f) { ul.appendChild(el("li", null, f)); });
      card.appendChild(ul);

      var cta = el("a", "btn btn-primary", t("packages.cta"));
      cta.href = "#contact";
      cta.setAttribute("data-pkg", pick(p.name));
      card.appendChild(cta);
      grid.appendChild(card);
    });
  }

  function renderTestimonials() {
    var grid = document.getElementById("testimonialsGrid");
    var section = document.getElementById("testimonials");
    if (!grid) return;
    var items = C.testimonials || [];
    if (!items.length) { if (section) section.hidden = true; return; }
    if (section) section.hidden = false;

    grid.innerHTML = "";
    items.forEach(function (item) {
      var card = el("figure", "card quote");
      card.style.margin = "0";
      var p = el("p", null, "“" + pick(item.quote) + "”");
      var foot = el("figcaption", null);
      foot.appendChild(el("strong", null, item.name || ""));
      foot.appendChild(document.createTextNode(pick(item.role)));
      card.appendChild(p);
      card.appendChild(foot);
      grid.appendChild(card);
    });
  }

  function renderFaq() {
    var list = document.getElementById("faqList");
    if (!list) return;
    list.innerHTML = "";
    (C.faqs || []).forEach(function (f, i) {
      var d = el("details");
      if (i === 0) d.open = true;
      var s = el("summary", null, pick(f.q));
      d.appendChild(s);
      d.appendChild(el("p", null, pick(f.a)));
      list.appendChild(d);
    });
  }

  function renderContact() {
    var list = document.getElementById("contactList");
    if (!list) return;
    list.innerHTML = "";

    var rows = [
      { ico: "📞", label: t("contact.phone"), value: C.phone, href: C.phoneRaw ? "tel:+" + C.phoneRaw.replace(/\D/g, "") : "" },
      { ico: "✉️", label: t("contact.email"), value: C.email, href: C.email ? "mailto:" + C.email : "" },
      { ico: "📍", label: t("contact.address"), value: C.address },
      { ico: "🗺️", label: t("contact.areas"), value: C.serviceAreas },
      { ico: "🕘", label: t("contact.hours"), value: C.hours },
    ];

    rows.forEach(function (r) {
      if (!r.value) return;
      var li = el("li");
      li.appendChild(el("span", "ico", r.ico));
      var box = el("div");
      box.appendChild(el("span", "label", r.label));
      if (r.href) {
        var a = el("a", null, r.value);
        a.href = r.href;
        box.appendChild(a);
      } else {
        box.appendChild(el("span", null, r.value));
      }
      li.appendChild(box);
      list.appendChild(li);
    });

    var social = document.getElementById("socialList");
    if (social) {
      social.innerHTML = "";
      var names = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube" };
      Object.keys(C.social || {}).forEach(function (k) {
        var url = C.social[k];
        if (!url) return;
        var a = el("a", null, names[k] || k);
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
        social.appendChild(a);
      });
    }
  }

  function renderStatic() {
    document.documentElement.lang = lang === "en" ? "en" : "ms";

    document.querySelectorAll("[data-i18n]").forEach(function (n) {
      var v = t(n.getAttribute("data-i18n"));
      if (v) n.textContent = v;
    });

    document.querySelectorAll('[data-bind="companyName"]').forEach(function (n) {
      n.textContent = C.companyName || "";
    });
    document.querySelectorAll('[data-bind="legalName"]').forEach(function (n) {
      n.textContent = C.legalName || C.companyName || "";
    });
    document.querySelectorAll('[data-bind="tagline"]').forEach(function (n) {
      n.textContent = pick(C.tagline);
    });
    document.querySelectorAll('[data-bind="legalLine"]').forEach(function (n) {
      n.textContent = [C.legalName, C.ssm].filter(Boolean).join(" · ");
    });

    var toggle = document.getElementById("langToggle");
    if (toggle) toggle.textContent = lang === "bm" ? "EN" : "BM";

    var wa = document.getElementById("waFloat");
    if (wa) wa.href = waLink(t("wa.greeting"));

    // Butang "Tempah" ikut bookingUrl jika ada, jika tidak ke borang
    document.querySelectorAll("[data-cta]").forEach(function (a) {
      if (C.bookingUrl) { a.href = C.bookingUrl; a.target = "_blank"; a.rel = "noopener"; }
    });

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    if (C.companyName) {
      document.title = C.companyName + (lang === "bm"
        ? " — Pemeriksaan Hartanah Profesional"
        : " — Professional Property Inspection");
    }
  }

  function renderAll() {
    renderStatic();
    renderServices();
    renderSteps();
    renderPackages();
    renderTestimonials();
    renderFaq();
    renderContact();
  }

  /* ---------- Interaksi ---------- */

  function initLangToggle() {
    var btn = document.getElementById("langToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      lang = lang === "bm" ? "en" : "bm";
      localStorage.setItem("ghi_lang", lang);
      renderAll();
    });
  }

  function initNav() {
    var btn = document.getElementById("navToggle");
    var nav = document.getElementById("nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function initStickyHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get("name") || "").toString().trim();
      var phone = (d.get("phone") || "").toString().trim();
      if (!name || !phone) { alert(t("form.required")); return; }

      var lines = [
        t("wa.greeting"),
        "",
        t("form.name") + ": " + name,
        t("form.phone") + ": " + phone,
        t("form.type") + ": " + (d.get("type") || "-"),
      ];
      var msg = (d.get("message") || "").toString().trim();
      if (msg) lines.push(t("form.msg") + ": " + msg);

      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  // Butang pakej: isi butiran pakej ke dalam borang
  function initPackageCta() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("[data-pkg]");
      if (!a) return;
      var box = document.querySelector('#contactForm [name="message"]');
      if (box && !box.value.trim()) {
        box.value = (lang === "bm" ? "Saya berminat dengan pakej " : "I'm interested in the ")
          + a.getAttribute("data-pkg") + (lang === "bm" ? "." : " package.");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderAll();
    initLangToggle();
    initNav();
    initStickyHeader();
    initForm();
    initPackageCta();
  });
})();
