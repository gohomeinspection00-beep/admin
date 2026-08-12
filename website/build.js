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
const OUT = path.join(__dirname, "dist");
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

/* ---- senarai page ---- */
const PAGES = [
    { out: "", key: "home", hash: "",
      title: "GoXpert — Building Surveying & Inspection Malaysia",
      desc: "RISM-registered Building Surveyors with SIRIM-calibrated equipment. Home defect inspection (DLP), Building Condition Assessment, dilapidation survey, thermal imaging and tribunal support across Johor, Melaka, Negeri Sembilan and Selangor." },
    { out: "services", key: "services", hash: "#/services",
      title: "All Inspection & Surveying Services — GoXpert",
      desc: "Sixteen building surveying services for homeowners, corporations, JMB/MC and legal proceedings — residential defect inspection, commercial condition assessment, and technical testing." },
    { out: "projects", key: "projects", hash: "#/projects",
      title: "Projects We Have Handled — GoXpert",
      desc: "Inspection and surveying work completed across Malaysia: residential, commercial, infrastructure, public buildings, land and rivers." },
    { out: "gallery", key: "gallery", hash: "#/gallery",
      title: "Gallery — From Our Site Visits | GoXpert",
      desc: "Our team, our instruments and the defects we actually find — photographed on real inspections." },
    { out: "about", key: "about", hash: "#/about",
      title: "About GoXpert — Registered Building Surveyors",
      desc: "Who we are, the principles we do not compromise, and what backs our reports. Registered Building Surveyors operating across four Malaysian states." },
    { out: "faq", key: "faq", hash: "#/faq",
      title: "Questions & Answers — GoXpert Building Inspection",
      desc: "Thirty-nine answers about home defect inspection, DLP, sub-sale inspection, BCA, reports, pricing and tribunal support." },
    { out: "blog", key: "blog", hash: "#/blog",
      title: "Articles & Guides From the Field — GoXpert",
      desc: "What we learn on site, written up so property owners can use it — no jargon, no sales pitch." }
];
SVC.forEach(s => PAGES.push({
    out: "services/" + s.slug, key: "service", param: s.slug, hash: "#/services/" + s.slug,
    title: s.name.en + " — GoXpert Building Surveyors",
    desc: (s.tag.en + " " + s.desc.en).replace(/\s+/g, " ").slice(0, 300),
    svc: s
}));
BLOG.forEach(b => PAGES.push({
    out: "blog/" + b.slug, key: "article", param: b.slug, hash: "#/blog/" + b.slug,
    title: b.title.en + " — GoXpert",
    desc: b.excerpt.en, article: b
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
function realLinks(s) {
    return s
        .replace(/href="#\/services\/([a-z0-9-]+)"/g, 'href="/services/$1/"')
        .replace(/href="#\/blog\/([a-z0-9-]+)"/g, 'href="/blog/$1/"')
        .replace(/href="#\/(services|projects|gallery|about|faq|blog)"/g, 'href="/$1/"')
        .replace(/href="#"/g, 'href="/"');
}

/* ---- JSON-LD ---- */
const ORG = {
    "@type": "ProfessionalService",
    "@id": SITE + "/#organisation",
    name: CONFIG.legalName || "GO XPERT SOLUTION",
    alternateName: CONFIG.companyName || "GoXpert",
    url: SITE + "/",
    telephone: "+" + CONFIG.phoneRaw,
    email: CONFIG.email,
    description: "Registered Building Surveyors providing building inspection, condition assessment and tribunal documentation across Malaysia.",
    slogan: "Inspection with integrity.",
    priceRange: "$$",
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

function crumbs(page) {
    const parts = [{ name: "Home", url: SITE + "/" }];
    if (page.key === "service") parts.push({ name: "Services", url: SITE + "/services/" });
    if (page.key === "article") parts.push({ name: "Articles", url: SITE + "/blog/" });
    parts.push({ name: page.title.split(" — ")[0], url: SITE + "/" + page.out + (page.out ? "/" : "") });
    return {
        "@type": "BreadcrumbList",
        itemListElement: parts.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, item: p.url }))
    };
}

function jsonLd(page, faqNodes) {
    const graph = [ORG, {
        "@type": "WebSite", "@id": SITE + "/#website", url: SITE + "/",
        name: CONFIG.companyName || "GoXpert", publisher: { "@id": SITE + "/#organisation" },
        inLanguage: ["en-MY", "ms-MY"]
    }];
    if (page.key !== "home") graph.push(crumbs(page));
    if (page.key === "service") {
        graph.push({
            "@type": "Service",
            name: page.svc.name.en,
            serviceType: page.svc.name.en,
            description: page.svc.desc.en,
            url: SITE + "/services/" + page.svc.slug + "/",
            provider: { "@id": SITE + "/#organisation" },
            areaServed: ["Johor", "Melaka", "Negeri Sembilan", "Selangor"].map(n => ({ "@type": "State", name: n })),
            audience: { "@type": "Audience", audienceType: (page.svc.who && page.svc.who.en || []).join(", ") },
            hasOfferCatalog: {
                "@type": "OfferCatalog", name: "What is included",
                itemListElement: (page.svc.inc.en || []).map(x => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: x } }))
            }
        });
    }
    if (page.key === "article") {
        const a = page.article;
        graph.push({
            "@type": "BlogPosting",
            headline: a.title.en, description: a.excerpt.en,
            url: SITE + "/blog/" + a.slug + "/",
            datePublished: a.date, dateModified: a.date,
            image: a.cover ? SITE + "/" + a.cover : undefined,
            author: { "@id": SITE + "/#organisation" },
            publisher: { "@id": SITE + "/#organisation" },
            inLanguage: "en-MY", isAccessibleForFree: true
        });
    }
    if (page.key === "faq" && faqNodes) graph.push(faqNodes);
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 1);
}

/* ---- rangka HTML ---- */
function shell(page, parts, faqNodes) {
    const url = SITE + "/" + (page.out ? page.out + "/" : "");
    const og = page.ogImage || (SITE + "/img/gal/our-team-1.jpg");
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<base href="/">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.desc)}">
<meta name="theme-color" content="#1565C0">
<meta name="author" content="${esc(CONFIG.legalName)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${page.key === "article" ? "article" : "website"}">
<meta property="og:site_name" content="${esc(CONFIG.companyName)}">
<meta property="og:locale" content="en_MY">
<meta property="og:locale:alternate" content="ms_MY">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.desc)}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.desc)}">
<meta name="twitter:image" content="${og}">
${FAVICON}
<link rel="stylesheet" href="/assets/style.css">
<script type="application/ld+json">
${jsonLd(page, faqNodes)}
</script>
</head>
<body>
${parts.progress}
${parts.nav}
${parts.page}
${parts.footer}
${parts.floats}
<script>window.GX_STATIC=1;window.GX_PAGE=${JSON.stringify({ key: page.key, param: page.param || null })};</script>
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

    let faqNodes = null;
    for (const P of PAGES) {
        await page.goto(`http://localhost:${port}/index.html${P.hash}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(P.key === "home" ? 900 : 550);

        const parts = await page.evaluate(key => {
            const id = { home: "page-home", services: "page-services", service: "page-service",
                projects: "page-projects", gallery: "page-gallery", about: "page-about",
                faq: "page-faq", blog: "page-blog", article: "page-article" }[key];
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
            faqNodes = await page.evaluate(() => {
                const n = [...document.querySelectorAll('script[type="application/ld+json"]')]
                    .map(x => JSON.parse(x.textContent))
                    .find(x => x["@type"] === "FAQPage");
                return n || null;
            });
        }

        for (const k of Object.keys(parts)) parts[k] = realLinks(parts[k]);

        const dir = path.join(OUT, P.out);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), shell(P, parts, P.key === "faq" ? faqNodes : null));
        process.stdout.write(".");
    }
    console.log("");
    await browser.close();
    srv.close();

    /* gambar + fail muat turun (PDF dsb.) */
    copyDir(path.join(__dirname, "img"), path.join(OUT, "img"));
    if (fs.existsSync(path.join(__dirname, "files"))) {
        copyDir(path.join(__dirname, "files"), path.join(OUT, "files"));
    }

    /* sitemap */
    const today = fs.statSync(SRC).mtime.toISOString().slice(0, 10);
    const sm = ['<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
    PAGES.forEach(P => {
        const loc = SITE + "/" + (P.out ? P.out + "/" : "");
        const pr = P.key === "home" ? "1.0" : (P.key === "service" || P.key === "services") ? "0.9" : "0.7";
        sm.push("  <url><loc>" + loc + "</loc><lastmod>" + (P.article ? P.article.date : today) +
                "</lastmod><changefreq>monthly</changefreq><priority>" + pr + "</priority></url>");
    });
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

    const n = PAGES.length;
    console.log("Siap: " + n + " page HTML + assets + sitemap.xml + robots.txt + llms.txt -> dist/");
    if (errors.length) console.log("RALAT JS semasa pra-render:", [...new Set(errors)].slice(0, 5));
})();
