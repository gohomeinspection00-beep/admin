/* =========================================================
   GOXPERT — BINA LAMAN SIAP TERBIT
   =========================================================
   Ambil website/index.html (satu fail) dan hasilkan folder
   website/dist/ dengan SATU FAIL HTML untuk setiap page,
   plus assets/, sitemap.xml, robots.txt dan llms.txt.

   Cara guna:
     cd website
     node build.js            # laman disiarkan ada dalam dist/

   Perlu: node + playwright-core + Chromium.
   Edit kandungan dalam index.html sahaja — jangan edit dist/
   secara manual, ia ditulis semula setiap kali build.
   ========================================================= */
const fs = require("fs");
const path = require("path");
const http = require("http");
const { chromium } = require("playwright-core");

const SRC = path.join(__dirname, "index.html");

/* Bina ke dalam folder sementara, kemudian tukar masuk hanya bila
   semuanya siap. Kalau build gagal di tengah jalan, dist/ yang lama
   kekal utuh — tiada risiko memuat naik laman yang separuh siap. */
const FINAL = path.join(__dirname, "dist");
const OUT = path.join(__dirname, "dist.tmp");
const CHROME = process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const html = fs.readFileSync(SRC, "utf8");

/* ---- baca data dari index.html supaya senarai page sentiasa tepat ---- */
function dataArray(name) {
    const a = html.indexOf("var " + name + " = [");
    const b = html.indexOf("\n];", a) + 2;
    return (0, eval)("(" + html.slice(a, b).replace(new RegExp("^var " + name + " ="), "").trim() + ")");
}
function dataObject(name) {
    const a = html.indexOf("var " + name + " = {");
    const b = html.indexOf("\n};", a) + 2;
    return (0, eval)("(" + html.slice(a, b).replace(new RegExp("^var " + name + " ="), "").trim() + ")");
}
const CONFIG = dataObject("CONFIG");
const SVC = dataArray("SVC");
const BLOG = dataArray("BLOG");
const SITE = (CONFIG.siteUrl || "https://goxpert.my/").replace(/\/+$/, "");

/* ---- bahasa ----
   EN di /..., BM di /ms/...  — dua-dua jadi fail HTML sebenar supaya
   Google boleh baca versi BM, bukan hanya selepas JavaScript jalan. */
const LANGS = [
    { code: "en", htmlLang: "en", ogLocale: "en_MY", hreflang: "en-MY", prefix: "" },
    { code: "bm", htmlLang: "ms", ogLocale: "ms_MY", hreflang: "ms-MY", prefix: "/ms" }
];
const pathFor = (lang, out) => lang.prefix + "/" + (out ? out + "/" : "");
const urlFor  = (lang, out) => SITE + pathFor(lang, out);

/* ---- senarai page ---- */
const PAGES = [
    { out: "", key: "home", hash: "",
      title: "GoXpert — Building Surveying & Inspection Malaysia",
      desc: "RISM-registered Building Surveyors with SIRIM-calibrated equipment. Home defect inspection (DLP), Building Condition Assessment, dilapidation survey, thermal imaging and tribunal support across Johor, Melaka, Negeri Sembilan and Selangor.",
      titleBm: "GoXpert — Jurukur Bangunan & Inspection Rumah Malaysia",
      descBm: "Building Surveyor berdaftar RISM dengan peralatan dikalibrasi SIRIM. Inspection rumah baru (DLP), pemeriksaan kecacatan, sub-sale, thermal imaging dan sokongan Tribunal Tuntutan Pembeli Rumah — Johor, Melaka, Negeri Sembilan, Selangor." },
    { out: "services", key: "services", hash: "#/services",
      title: "All Inspection & Surveying Services — GoXpert",
      desc: "Sixteen building surveying services for homeowners, corporations, JMB/MC and legal proceedings — residential defect inspection, commercial condition assessment, and technical testing.",
      titleBm: "Semua Servis Inspection & Jurukur Bangunan — GoXpert",
      descBm: "Enam belas servis jurukur bangunan untuk pemilik rumah, syarikat, JMB/MC dan kes tribunal — inspection kecacatan rumah, penilaian keadaan bangunan komersial dan ujian teknikal." },
    { out: "projects", key: "projects", hash: "#/projects",
      title: "Projects We Have Handled — GoXpert",
      desc: "Inspection and surveying work completed across Malaysia: residential, commercial, infrastructure, public buildings, land and rivers.",
      titleBm: "Projek Yang Kami Kendalikan — GoXpert",
      descBm: "Kerja inspection dan jurukur bangunan yang telah disiapkan di seluruh Malaysia: kediaman, komersial, infrastruktur, bangunan awam, tanah dan sungai." },
    { out: "gallery", key: "gallery", hash: "#/gallery",
      title: "Gallery — From Our Site Visits | GoXpert",
      desc: "Our team, our instruments and the defects we actually find — photographed on real inspections.",
      titleBm: "Galeri — Dari Lawatan Tapak Kami | GoXpert",
      descBm: "Pasukan kami, peralatan kami dan kecacatan yang benar-benar kami jumpa — dirakam semasa inspection sebenar." },
    { out: "about", key: "about", hash: "#/about",
      title: "About GoXpert — Registered Building Surveyors",
      desc: "Who we are, the principles we do not compromise, and what backs our reports. Registered Building Surveyors operating across four Malaysian states.",
      titleBm: "Tentang GoXpert — Jurukur Bangunan Berdaftar",
      descBm: "Siapa kami, prinsip yang kami tak kompromi, dan apa yang menyokong laporan kami. Building Surveyor berdaftar yang beroperasi di empat negeri." },
    { out: "faq", key: "faq", hash: "#/faq",
      title: "Questions & Answers — GoXpert Building Inspection",
      desc: "Thirty-nine answers about home defect inspection, DLP, sub-sale inspection, BCA, reports, pricing and tribunal support.",
      titleBm: "Soalan & Jawapan — Inspection Bangunan GoXpert",
      descBm: "Tiga puluh sembilan jawapan tentang inspection kecacatan rumah, DLP, inspection sub-sale, BCA, laporan, harga dan sokongan tribunal." },
    { out: "blog", key: "blog", hash: "#/blog",
      title: "Articles & Guides From the Field — GoXpert",
      desc: "What we learn on site, written up so property owners can use it — no jargon, no sales pitch.",
      titleBm: "Artikel & Panduan Dari Tapak — GoXpert",
      descBm: "Apa yang kami pelajari di tapak, ditulis supaya pemilik hartanah boleh guna — tanpa jargon, tanpa ayat jualan." },
    { out: "pemilik-rumah", key: "landing", hash: "#/pemilik-rumah",
      title: "Untuk Pemilik Rumah — Inspection Rumah Baru & Sub-Sale | GoXpert",
      desc: "Building Surveyor berdaftar RISM dengan peralatan dikalibrasi SIRIM. Inspection rumah baru (DLP), sub-sale, selepas renovation dan sokongan tribunal — Johor, Melaka, Negeri Sembilan, Selangor.",
      titleBm: "Untuk Pemilik Rumah — Inspection Rumah Baru & Sub-Sale | GoXpert",
      descBm: "Building Surveyor berdaftar RISM dengan peralatan dikalibrasi SIRIM. Inspection rumah baru (DLP), sub-sale, selepas renovation dan sokongan tribunal — Johor, Melaka, Negeri Sembilan, Selangor." },
    { out: "inspection-berkelompok", key: "group", hash: "#/inspection-berkelompok",
      title: "Group Inspection Booking for Your Project — GoXpert",
      desc: "Several owners in the same project booking together pay a lower rate each. One trip, unit after unit, and every owner still receives their own full defect report.",
      titleBm: "Tempahan Inspection Berkelompok Untuk Projek Anda — GoXpert",
      descBm: "Beberapa pemilik dalam projek yang sama tempah bersama, kadar lebih rendah setiap satu. Satu lawatan, unit demi unit, dan setiap pemilik tetap dapat laporan kecacatan penuh sendiri." }
];
SVC.forEach(s => PAGES.push({
    out: "services/" + s.slug, key: "service", param: s.slug, hash: "#/services/" + s.slug,
    title: s.name.en + " — GoXpert Building Surveyors",
    desc: (s.tag.en + " " + s.desc.en).replace(/\s+/g, " ").slice(0, 300),
    titleBm: s.name.bm + " — Jurukur Bangunan GoXpert",
    descBm: (s.tag.bm + " " + s.desc.bm).replace(/\s+/g, " ").slice(0, 300),
    svc: s
}));
BLOG.forEach(b => PAGES.push({
    out: "blog/" + b.slug, key: "article", param: b.slug, hash: "#/blog/" + b.slug,
    title: b.title.en + " — GoXpert",
    desc: b.excerpt.en,
    titleBm: b.title.bm + " — GoXpert",
    descBm: b.excerpt.bm, article: b
}));

/* ---- pecahkan CSS & JS keluar dari fail sumber ---- */
const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
const js = html.match(/<script>\n\/\* =+[\s\S]*?<\/script>/)[0]
    .replace(/^<script>\n/, "").replace(/<\/script>$/, "");

/* ---- kepala <head> yang dikongsi ---- */
const FAVICON = html.match(/<link rel="icon"[\s\S]*?<link href="https:\/\/fonts\.googleapis[^>]*>/)[0];

function esc(x) {
    return String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ---- tukar pautan hash jadi laluan sebenar ---- */
function realLinks(s, lang) {
    const p = lang.prefix;   // "" untuk EN, "/ms" untuk BM
    return s
        .replace(/href="#\/services\/([a-z0-9-]+)"/g, 'href="' + p + '/services/$1/"')
        .replace(/href="#\/blog\/([a-z0-9-]+)"/g, 'href="' + p + '/blog/$1/"')
        .replace(/href="#\/(services|projects|gallery|about|faq|blog|pemilik-rumah|inspection-berkelompok)"/g, 'href="' + p + '/$1/"')
        .replace(/href="#"/g, 'href="' + p + '/"');
}

/* ---- JSON-LD ---- */
const ORG = {
    "@type": "ProfessionalService",
    "@id": SITE + "/#organisation",
    name: CONFIG.legalName || "GO XPERT SOLUTION",
    alternateName: [CONFIG.companyName || "GoXpert"].concat(CONFIG.formerName ? [CONFIG.formerName] : []),
    url: SITE + "/",
    telephone: "+" + CONFIG.phoneRaw,
    email: CONFIG.email,
    description: "Registered Building Surveyors providing building inspection, condition assessment and tribunal documentation across Malaysia.",
    slogan: "Inspection with integrity.",
    priceRange: "$$",
    sameAs: (CONFIG.social || []).map(x => x.url),
    logo: { "@type": "ImageObject", url: SITE + "/img/icon-512.png", width: 512, height: 512 },
    image: [SITE + "/img/gal/our-team-1.jpg", SITE + "/img/sirim-person.webp"],
    openingHoursSpecification: [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00", closes: "18:00"
    }],
    areaServed: ["Johor", "Melaka", "Negeri Sembilan", "Selangor"].map(n => ({ "@type": "State", name: n })),
    knowsAbout: [
        "Home defect inspection", "Defect Liability Period (DLP)", "Pre-purchase property inspection",
        "Sub-sale house inspection", "Building Condition Assessment (BCA)", "Dilapidation survey",
        "Building movement monitoring", "Maintenance and condition audit", "Electrical installation testing",
        "Leak detection and moisture survey", "Thermal imaging (infrared thermography)",
        "Defect rectification supervision", "Tribunal for Homebuyer Claims documentation"
    ],
    hasCredential: [
        { "@type": "EducationalOccupationalCredential", credentialCategory: "Professional registration",
          name: "Registered with the Royal Institution of Surveyors Malaysia (RISM)" },
        { "@type": "EducationalOccupationalCredential", credentialCategory: "Equipment calibration",
          name: "Inspection instruments calibrated by SIRIM Malaysia" }
    ],
    makesOffer: SVC.map(s => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name.en, description: s.tag.en, url: SITE + "/services/" + s.slug + "/" }
    })),
    openingHoursSpecification: [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00", closes: "18:00"
    }]
};
if (CONFIG.ssm) ORG.identifier = { "@type": "PropertyValue", name: "Malaysian company registration number", value: CONFIG.ssm };

function crumbs(page, lang) {
    const bm = lang.code === "bm";
    const parts = [{ name: bm ? "Utama" : "Home", url: urlFor(lang, "") }];
    if (page.key === "service") parts.push({ name: bm ? "Servis" : "Services", url: urlFor(lang, "services") });
    if (page.key === "article") parts.push({ name: bm ? "Artikel" : "Articles", url: urlFor(lang, "blog") });
    parts.push({ name: (bm ? (page.titleBm || page.title) : page.title).split(" — ")[0], url: urlFor(lang, page.out) });
    return {
        "@type": "BreadcrumbList",
        itemListElement: parts.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, item: p.url }))
    };
}

function jsonLd(page, faqNodes, lang) {
    const L = lang.code;               // "en" atau "bm"
    const bm = L === "bm";
    const graph = [ORG, {
        "@type": "WebSite", "@id": SITE + "/#website", url: SITE + "/",
        name: CONFIG.companyName || "GoXpert", publisher: { "@id": SITE + "/#organisation" },
        inLanguage: ["en-MY", "ms-MY"]
    }];
    if (page.key !== "home") graph.push(crumbs(page, lang));
    if (page.key === "service") {
        const sv = page.svc;
        graph.push({
            "@type": "Service",
            name: sv.name[L] || sv.name.en,
            serviceType: sv.name.en,
            description: sv.desc[L] || sv.desc.en,
            url: urlFor(lang, "services/" + sv.slug),
            provider: { "@id": SITE + "/#organisation" },
            areaServed: ["Johor", "Melaka", "Negeri Sembilan", "Selangor"].map(n => ({ "@type": "State", name: n })),
            audience: { "@type": "Audience", audienceType: ((sv.who && sv.who[L]) || (sv.who && sv.who.en) || []).join(", ") },
            inLanguage: lang.hreflang,
            hasOfferCatalog: {
                "@type": "OfferCatalog", name: bm ? "Apa yang termasuk" : "What is included",
                itemListElement: ((sv.inc[L] || sv.inc.en) || []).map(x => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: x } }))
            }
        });
    }
    if (page.key === "article") {
        const a = page.article;
        graph.push({
            "@type": "BlogPosting",
            headline: a.title[L] || a.title.en,
            description: a.excerpt[L] || a.excerpt.en,
            url: urlFor(lang, "blog/" + a.slug),
            datePublished: a.date, dateModified: a.date,
            image: a.cover ? SITE + "/" + a.cover : undefined,
            author: { "@id": SITE + "/#organisation" },
            publisher: { "@id": SITE + "/#organisation" },
            inLanguage: lang.hreflang, isAccessibleForFree: true
        });
    }
    if (page.key === "faq" && faqNodes) graph.push(faqNodes);
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 1);
}

/* ---- rangka HTML ---- */
function shell(page, parts, faqNodes, lang) {
    const bm = lang.code === "bm";
    const title = (bm && page.titleBm) || page.title;
    const desc = (bm && page.descBm) || page.desc;
    const url = urlFor(lang, page.out);
    const og = page.ogImage || (SITE + "/img/og-share.jpg");
    /* hreflang: beritahu Google kedua-dua URL ini page yang sama dalam
       bahasa berbeza, supaya ia tak dikira kandungan bertindih */
    const alts = LANGS.map(l =>
        `<link rel="alternate" hreflang="${l.hreflang}" href="${urlFor(l, page.out)}">`
    ).join("\n") + `\n<link rel="alternate" hreflang="x-default" href="${urlFor(LANGS[0], page.out)}">`;
    return `<!DOCTYPE html>
<html lang="${lang.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<base href="/">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#1565C0">
<meta name="author" content="${esc(CONFIG.legalName)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
${alts}
<meta property="og:type" content="${page.key === "article" ? "article" : "website"}">
<meta property="og:site_name" content="${esc(CONFIG.companyName)}">
<meta property="og:locale" content="${lang.ogLocale}">
<meta property="og:locale:alternate" content="${LANGS.find(l => l.code !== lang.code).ogLocale}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${og}">
${FAVICON}
<link rel="stylesheet" href="/assets/style.css">
<script type="application/ld+json">
${jsonLd(page, faqNodes, lang)}
</script>
</head>
<body${page.key === "landing" ? ' class="lp-on"' : ""}>
${parts.progress}
${parts.nav}
${parts.page}
${parts.footer}
${parts.floats}
<script>window.GX_STATIC=1;window.GX_LANG=${JSON.stringify(lang.code)};window.GX_PAGE=${JSON.stringify({ key: page.key, param: page.param || null })};</script>
<script src="/assets/app.js" defer></script>
</body>
</html>
`;
}

/* ---- llms.txt: ringkasan mesin-boleh-baca untuk crawler AI ---- */
function llmsTxt() {
    const L = [];
    L.push("# " + (CONFIG.legalName || "GO XPERT SOLUTION") + " (GoXpert)");
    L.push("");
    L.push("> Registered Building Surveyors in Malaysia. We inspect buildings and produce");
    L.push("> evidence-grade condition reports — for homeowners claiming defects within their");
    L.push("> Defect Liability Period, for corporations and JMB/MC managing building assets,");
    L.push("> and for owners who need documentation that holds up at the Tribunal for");
    L.push("> Homebuyer Claims.");
    L.push("");
    L.push("## Facts");
    L.push("");
    L.push("- Legal name: " + CONFIG.legalName);
    if (CONFIG.ssm) L.push("- Company registration number: " + CONFIG.ssm);
    L.push("- Website: " + SITE + "/");
    L.push("- WhatsApp / phone: " + CONFIG.phoneDisplay);
    L.push("- Email: " + CONFIG.email);
    L.push("- States served: Johor, Melaka, Negeri Sembilan, Selangor (other locations on request)");
    L.push("- Inspectors are registered with the Royal Institution of Surveyors Malaysia (RISM)");
    L.push("- Measuring instruments are calibrated by SIRIM Malaysia");
    L.push("- Languages: English and Bahasa Malaysia");
    if (CONFIG.priceFrom) {
        L.push("- Inspections start from RM" + CONFIG.priceFrom + ". The final figure depends on property");
        L.push("  type, built-up size and scope, and is quoted per property. Lower rates apply when");
        L.push("  several owners in the same project book together. Any lower starting figure seen");
        L.push("  elsewhere is out of date.");
    }
    L.push("");
    L.push("## Identity — which name, site and accounts are actually ours");
    L.push("");
    L.push("There is more than one name and more than one old page associated with this");
    L.push("company, so this section states plainly which ones are current.");
    L.push("");
    if (CONFIG.formerName) {
        L.push("- " + CONFIG.legalName + " (trading as " + (CONFIG.companyName || "GoXpert") +
               ") was previously known as " + CONFIG.formerName + ". It is the same company,");
        L.push("  the same team and the same company registration number. Team uniforms and some");
        L.push("  older printed material still carry the earlier name.");
        L.push("- The earlier website gohomeinspection.asia is no longer active and that domain has");
        L.push("  lapsed. Anything still cached or archived from it may be out of date, and it is");
        L.push("  no longer under the company's control.");
    }
    L.push("- The current and only official website is " + SITE + "/");
    if ((CONFIG.social || []).length) {
        L.push("- Official social accounts:");
        CONFIG.social.forEach(x => L.push("  - " + x.name + ": " + x.url));
    }
    L.push("- Official phone and WhatsApp: " + CONFIG.phoneDisplay);
    L.push("- Official email: " + CONFIG.email);
    L.push("- Contact details, prices or service lists that differ from the ones on " + SITE + "/");
    L.push("  are not current and should not be relied on.");
    L.push("");
    L.push("## What we are good at");
    L.push("");
    L.push("- Finding defects that are invisible to an untrained eye: hollow tiles by tap-test,");
    L.push("  moisture inside walls by thermal imaging and moisture meters, missing earthing by");
    L.push("  instrument testing rather than guesswork.");
    L.push("- Writing findings so they can be acted on: exact location, defect category, photo,");
    L.push("  measured reading and date — not a vague complaint a developer can dismiss.");
    L.push("- Re-inspection: verifying that rectification work was genuinely done, with a");
    L.push("  before-and-after record for every item.");
    L.push("- Independence: we do not sell repair works, so our findings are not a sales list.");
    L.push("");
    L.push("## Services");
    L.push("");
    SVC.forEach(s => {
        L.push("- [" + s.name.en + "](" + SITE + "/services/" + s.slug + "/): " + s.tag.en);
    });
    L.push("");
    L.push("## Pages");
    L.push("");
    L.push("- [Home](" + SITE + "/)");
    L.push("- [All services](" + SITE + "/services/)");
    L.push("- [Projects handled](" + SITE + "/projects/)");
    L.push("- [Gallery](" + SITE + "/gallery/)");
    L.push("- [About us](" + SITE + "/about/)");
    L.push("- [Questions and answers](" + SITE + "/faq/)");
    L.push("- [Articles](" + SITE + "/blog/)");
    L.push("- [For homeowners — new homes & sub-sale](" + SITE + "/pemilik-rumah/)");
    L.push("- [Group inspection booking for a whole project](" + SITE + "/inspection-berkelompok/)");
    L.push("");
    L.push("Every page above also exists in Bahasa Malaysia under " + SITE + "/ms/");
    L.push("(for example " + SITE + "/ms/services/ and " + SITE + "/ms/faq/).");
    L.push("");
    L.push("## Articles");
    L.push("");
    BLOG.forEach(b => L.push("- [" + b.title.en + "](" + SITE + "/blog/" + b.slug + "/): " + b.excerpt.en));
    L.push("");
    L.push("## Who should contact us");
    L.push("");
    L.push("- New homeowners inside their Defect Liability Period (DLP)");
    L.push("- Buyers of sub-sale or pre-owned homes, before signing");
    L.push("- Owners who have just completed a renovation and want it verified before final payment");
    L.push("- JMB / MC / property managers planning a sinking fund from actual building condition");
    L.push("- Owners in dispute with a developer who need documented, instrument-backed evidence");
    L.push("");
    return L.join("\n");
}

/* ---- pelayan fail statik ringkas untuk pra-render ---- */
function serve(dir, port) {
    const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
        ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json" };
    return new Promise(res => {
        const srv = http.createServer((req, rq) => {
            let f = path.join(dir, decodeURIComponent(req.url.split("?")[0]));
            if (!f.startsWith(dir)) { rq.writeHead(403); return rq.end(); }
            fs.readFile(f, (e, d) => {
                if (e) { rq.writeHead(404); return rq.end(); }
                rq.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" });
                rq.end(d);
            });
        });
        srv.listen(port, () => res(srv));
    });
}

function copyDir(from, to) {
    fs.mkdirSync(to, { recursive: true });
    for (const e of fs.readdirSync(from, { withFileTypes: true })) {
        const a = path.join(from, e.name), b = path.join(to, e.name);
        if (e.isDirectory()) copyDir(a, b);
        else fs.copyFileSync(a, b);
    }
}

(async () => {
  try {
    fs.rmSync(OUT, { recursive: true, force: true });
    fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });

    fs.writeFileSync(path.join(OUT, "assets", "style.css"), css.trim() + "\n");
    fs.writeFileSync(path.join(OUT, "assets", "app.js"), js.trim() + "\n");

    const port = Number(process.env.BUILD_PORT || 8731);
    const srv = await serve(__dirname, port);
    const browser = await chromium.launch({ executablePath: CHROME });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));

    let faqNodes = {};
    for (const lang of LANGS) {
      /* Paksa bahasa SEBELUM halaman dimuat, supaya pra-render
         menangkap teks dalam bahasa yang betul. */
      await page.context().clearCookies();
      await page.goto(`http://localhost:${port}/index.html`, { waitUntil: "domcontentloaded" });
      await page.evaluate(code => { try { localStorage.setItem("gx_lang", code); } catch (e) {} }, lang.code);

      for (const P of PAGES) {
        await page.goto(`http://localhost:${port}/index.html${P.hash}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(P.key === "home" ? 900 : 550);
        const got = await page.evaluate(() => (window.GX_DEBUG_LANG = (localStorage.getItem("gx_lang") || "en")));
        if (got !== lang.code) throw new Error("Bahasa pra-render salah: mahu " + lang.code + ", dapat " + got);

        const parts = await page.evaluate(key => {
            const id = { home: "page-home", services: "page-services", service: "page-service",
                projects: "page-projects", gallery: "page-gallery", about: "page-about",
                faq: "page-faq", blog: "page-blog", article: "page-article",
                landing: "page-landing", group: "page-group" }[key];
            const el = document.getElementById(id);
            if (el) el.removeAttribute("hidden");
            /* buang kelas animasi "belum masuk skrin" supaya kandungan
               kekal nampak walaupun JavaScript dimatikan */
            (el || document).querySelectorAll(".reveal").forEach(x => x.classList.add("visible"));
            const grab = s => { const n = document.querySelector(s); return n ? n.outerHTML : ""; };
            return {
                progress: grab(".scroll-progress"),
                nav: grab("#navbar"),
                page: el ? el.outerHTML : "",
                footer: grab("footer.footer"),
                floats: grab(".whatsapp-float") + "\n" + grab(".scroll-top") + "\n" + grab("#lightbox")
            };
        }, P.key);

        if (P.key === "faq") {
            faqNodes[lang.code] = await page.evaluate(() => {
                const n = [...document.querySelectorAll('script[type="application/ld+json"]')]
                    .map(x => JSON.parse(x.textContent))
                    .find(x => x["@type"] === "FAQPage");
                return n || null;
            });
        }

        for (const k of Object.keys(parts)) parts[k] = realLinks(parts[k], lang);

        const dir = path.join(OUT, lang.prefix.replace(/^\//, ""), P.out);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"),
            shell(P, parts, P.key === "faq" ? faqNodes[lang.code] : null, lang));
        process.stdout.write(".");
      }
      process.stdout.write(" " + lang.code + "\n");
    }
    await browser.close();
    srv.close();

    /* gambar + fail muat turun (PDF dsb.) */
    copyDir(path.join(__dirname, "img"), path.join(OUT, "img"));
    for (const f of ["favicon.ico", "site.webmanifest"]) {
        const src = path.join(__dirname, f);
        if (fs.existsSync(src)) fs.copyFileSync(src, path.join(OUT, f));
    }
    if (fs.existsSync(path.join(__dirname, "files"))) {
        copyDir(path.join(__dirname, "files"), path.join(OUT, "files"));
    }

    /* sitemap */
    const today = fs.statSync(SRC).mtime.toISOString().slice(0, 10);
    const sm = ['<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'];
    LANGS.forEach(lang => PAGES.forEach(P => {
        const pr = P.key === "home" ? "1.0" : (P.key === "service" || P.key === "services") ? "0.9" : "0.7";
        const alts = LANGS.map(l =>
            '    <xhtml:link rel="alternate" hreflang="' + l.hreflang + '" href="' + urlFor(l, P.out) + '"/>'
        ).join("\n") +
        '\n    <xhtml:link rel="alternate" hreflang="x-default" href="' + urlFor(LANGS[0], P.out) + '"/>';
        sm.push("  <url>",
                "    <loc>" + urlFor(lang, P.out) + "</loc>",
                alts,
                "    <lastmod>" + (P.article ? P.article.date : today) + "</lastmod>",
                "    <changefreq>monthly</changefreq>",
                "    <priority>" + pr + "</priority>",
                "  </url>");
    }));
    sm.push("</urlset>");
    fs.writeFileSync(path.join(OUT, "sitemap.xml"), sm.join("\n") + "\n");

    fs.writeFileSync(path.join(OUT, "robots.txt"),
        "User-agent: *\nAllow: /\n\n" +
        "# Ringkasan syarikat untuk pembantu AI\n" +
        "# Company summary for AI assistants\n" +
        "Sitemap: " + SITE + "/sitemap.xml\n" +
        "# " + SITE + "/llms.txt\n");

    fs.writeFileSync(path.join(OUT, "llms.txt"), llmsTxt());

    /* 404 */
    const home = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
    fs.writeFileSync(path.join(OUT, "404.html"),
        home.replace(/<title>[\s\S]*?<\/title>/, "<title>Page not found — GoXpert</title>")
            .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex">'));

    /* ---- tukar masuk: dist/ lama hanya diganti selepas semuanya siap ---- */
    const OLD = FINAL + ".old";
    fs.rmSync(OLD, { recursive: true, force: true });
    if (fs.existsSync(FINAL)) fs.renameSync(FINAL, OLD);
    fs.renameSync(OUT, FINAL);
    fs.rmSync(OLD, { recursive: true, force: true });

    const n = PAGES.length * LANGS.length;
    console.log("Siap: " + n + " page HTML (" + PAGES.length + " x " + LANGS.length +
                " bahasa) + assets + sitemap.xml + robots.txt + llms.txt -> dist/");
    if (errors.length) console.log("RALAT JS semasa pra-render:", [...new Set(errors)].slice(0, 5));
  } catch (e) {
    /* Gagal: buang folder sementara, biar dist/ lama tak disentuh. */
    fs.rmSync(OUT, { recursive: true, force: true });
    console.error("BUILD GAGAL — dist/ lama tidak diubah.");
    console.error(e && e.stack || e);
    process.exitCode = 1;
  }
})();
