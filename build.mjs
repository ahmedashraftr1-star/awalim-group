#!/usr/bin/env node
/* ==========================================================================
   build.mjs — zero-dependency static build.
   src/content/*.json  →  templates (src/pages/*.mjs)  →  <route>/index.html
   src/css/*.css       →  assets/css/awalim.css (one request, in layer order)
   Also emits sitemap.xml, robots.txt, and the legacy-route redirect stubs.
   Run: node build.mjs   (Node ≥ 18)
   ========================================================================== */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, generateKeyPairSync, sign as edSign, createPrivateKey, createPublicKey } from "node:crypto";
import { fill, normalizeSearch } from "./src/lib/html.mjs";
import { merge, findLoss } from "./src/lib/merge.mjs";
import { setBuild } from "./src/lib/layout.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));
const write = (rel, content) => {
  const abs = join(ROOT, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
};

/* ---------- locales ----------
   Arabic is the source of truth and lives at /. English is a full mirror at
   /en: its CONTENT comes from src/content/en/*.json (deep-merged over the
   Arabic so anything untranslated still renders), and its CHROME — every
   string typed into a template — is translated by applying src/content/
   i18n.json to the rendered HTML. The build then asserts that no Arabic
   letter survives in the English output, so a missing translation is a build
   error rather than something a visitor discovers. */
const LOCALES = [
  { code: "ar", dir: "rtl", prefix: "", name: "العربية", altName: "English", altPrefix: "/en" },
  { code: "en", dir: "ltr", prefix: "/en", name: "English", altName: "العربية", altPrefix: "" }
];
const DICT = read("src/content/i18n.json");
/* UI strings for pages written after the dictionary existed: these templates
   read ctx.t.<key> directly instead of being translated after rendering. */
const UI = {
  ar: { home: "الرئيسية", does: "ما ستفعله", needs: "ما نحتاجه", bonus: "يُحسب لك", apply: "قدّم الآن", askFirst: "اسأل قبل التقديم",
        careersEyebrow: "الوظائف", openRoles: "الوظائف المفتوحة", rolesOpenNow: "وظائف مفتوحة الآن", openApplication: "تقديم مفتوح",
        howWeHire: "كيف نوظّف", noRolesTitle: "لا وظائف مفتوحة الآن", noRolesLede: "لا يعني ذلك أننا لا نبحث. أرسل تقديماً مفتوحاً ونعود إليك حين يُفتح دور يناسبك.",
        careersCtaH: "جاهز؟ أرسل مشروعاً بنيته.", careersCtaLede: "لا نطلب سيرة ذاتية منمّقة. أرسل شيئاً بنيته وسطرين عن قرار صعب اتّخذته فيه.",
        legal: "قانوني", lastUpdated: "آخر تحديث", toc: "جدول المحتويات", onThisPage: "في هذه الصفحة",
        legalFooter: "سؤال عن هذه الصفحة؟ راسلنا مباشرة ونجيب.", press: "المواد الصحفية", copy: "انسخ", download: "نزّل", downloadPhoto: "نزّل الصورة",
        copied: "نُسخ" },
  en: { home: "Home", does: "What you'll do", needs: "What we need", bonus: "Counts in your favour", apply: "Apply now", askFirst: "Ask before applying",
        careersEyebrow: "Careers", openRoles: "Open roles", rolesOpenNow: "roles open now", openApplication: "Open application",
        howWeHire: "How we hire", noRolesTitle: "No open roles right now", noRolesLede: "That does not mean we are not looking. Send an open application and we will come back to you when a role that fits opens.",
        careersCtaH: "Ready? Send us something you built.", careersCtaLede: "We do not want a polished CV. Send something you built and two lines about a hard decision you made in it.",
        legal: "Legal", lastUpdated: "Last updated", toc: "Table of contents", onThisPage: "On this page",
        legalFooter: "A question about this page? Write to us and we answer.", press: "Press kit", copy: "Copy", download: "Download", downloadPhoto: "Download the photo",
        copied: "Copied" }
};
/* longest first: "كل الأعمال" must win over "الأعمال" */
const DICT_ENTRIES = Object.entries(DICT).filter(([k]) => !k.startsWith("_")).sort((a, b) => b[0].length - a[0].length);

const readLocale = (file, locale) => {
  const base = read(`src/content/${file}`);
  if (locale === "ar") return base;
  const p = join(ROOT, `src/content/en/${file}`);
  if (!existsSync(p)) return base;
  const merged = merge(base, JSON.parse(readFileSync(p, "utf8")));
  const lost = [];
  findLoss(base, merged, file.replace(/\.json$/, ""), lost);
  if (lost.length) {
    console.error(`\n✖ the ${locale} merge of ${file} loses content the Arabic has:`);
    for (const l of lost.slice(0, 20)) console.error("   " + l);
    if (lost.length > 20) console.error(`   … and ${lost.length - 20} more`);
    process.exit(1);
  }
  return merged;
};

const site = read("src/content/site.json");
const stats = site.stats;

/** Walk any JSON value and replace {statKey} placeholders inside strings. */
const hydrate = (v) => {
  if (typeof v === "string") return fill(v, stats);
  if (Array.isArray(v)) return v.map(hydrate);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, hydrate(x)]));
  return v;
};

/** Everything a locale needs, assembled fresh so the two passes never share state. */
const buildCtx = (locale) => {
  const s = hydrate(readLocale("site.json", locale));
  const casesJson = hydrate(readLocale("cases.json", locale));
  const productsJson = hydrate(readLocale("products.json", locale));
  const journalJson = hydrate(readLocale("journal.json", locale));
  const pages = hydrate(readLocale("pages.json", locale));
  return {
    locale,
    t: UI[locale],
    careers: hydrate(readLocale("careers.json", locale)),
    legal: hydrate(readLocale("legal.json", locale)),
    press: hydrate(readLocale("press.json", locale)),
    site: s,
    stats: s.stats,
    themes: s.themes,
    pages,
    cases: casesJson.cases,
    minor: casesJson.minor,
    filters: casesJson.filters,
    products: productsJson.products,
    articles: journalJson.articles.slice().sort((a, b) => (a.date < b.date ? 1 : -1))
      .map((a) => ({ ...a, readLabel: locale === "en" ? `${a.minutes} min read` : `قراءة ${a.minutes} دقائق` })),
    categories: journalJson.categories
  };
};

const ctx = buildCtx("ar");

/* ---------- signed numbers (Ed25519) ----------
   The stats are the one thing on this site a visitor should be able to
   check rather than trust. The canonical payload is signed at build with a
   private key that never leaves this machine (.keys/, git-ignored); the
   public key, payload and signature are committed in src/content/signing.json
   and served at /verify/stats.json, where the visitor's browser re-verifies
   them with WebCrypto. If the numbers change and no key is present, the
   build keeps going but marks them unsigned — nothing is silently re-signed. */
const KEY_DIR = join(ROOT, ".keys");
const PRIV = join(KEY_DIR, "awalim-ed25519.pem");
const SIGNING = join(ROOT, "src/content/signing.json");
/* canonical JSON: keys sorted at every level, no whitespace — the exact bytes that get signed */
const sortDeep = (v) => (Array.isArray(v) ? v.map(sortDeep) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortDeep(v[k])])) : v);
const canonical = (o) => JSON.stringify(sortDeep(o));
const statsPayloadObj = (issued) => ({
  issued,
  issuer: site.brand.latin,
  stats: Object.fromEntries(Object.entries(stats).map(([k, v]) => [k, v.value])),
  url: site.brand.url
});
const sha256 = (str) => createHash("sha256").update(str, "utf8").digest("hex");
let signing = existsSync(SIGNING) ? JSON.parse(readFileSync(SIGNING, "utf8")) : null;
const statsFingerprint = canonical(statsPayloadObj("").stats);
const prevFingerprint = signing ? canonical(JSON.parse(signing.payload).stats) : null;
if (!signing || prevFingerprint !== statsFingerprint) {
  if (!existsSync(PRIV)) {
    if (!signing) {
      mkdirSync(KEY_DIR, { recursive: true });
      const { privateKey } = generateKeyPairSync("ed25519");
      writeFileSync(PRIV, privateKey.export({ type: "pkcs8", format: "pem" }));
      console.log("• generated a new Ed25519 signing key in .keys/ (git-ignored — back it up)");
    } else {
      console.warn("⚠ stats changed but .keys/awalim-ed25519.pem is missing — numbers are UNSIGNED until you rebuild with the key");
      signing = { ...signing, unsigned: true };
    }
  }
  if (existsSync(PRIV)) {
    const privateKey = createPrivateKey(readFileSync(PRIV));
    const publicKey = createPublicKey(privateKey);
    const der = publicKey.export({ type: "spki", format: "der" });
    const raw = der.subarray(der.length - 32); // raw 32-byte Ed25519 public key
    const issued = new Date().toISOString().slice(0, 10);
    const payload = canonical(statsPayloadObj(issued));
    const signature = edSign(null, Buffer.from(payload, "utf8"), privateKey).toString("base64");
    signing = { alg: "Ed25519", issued, publicKey: raw.toString("base64"), payload, sha256: sha256(payload), signature };
    writeFileSync(SIGNING, JSON.stringify(signing, null, 2));
    console.log("• stats signed · issued " + issued);
  }
}
ctx.signing = signing;
ctx.routesCount = 1 + 1 + ctx.cases.length + 1 + ctx.products.length + 1 + 1 + 1 + 1 + ctx.articles.length + 1 + 1 + 1;

/* ---------- CSS: concatenate layers, extract the critical fences, minify ---------- */
const cssDir = join(ROOT, "src/css");
const layers = ["tokens.css", "base.css", "components.css", "motion.css", "pages.css"];
const rawCss = layers.map((f) => readFileSync(join(cssDir, f), "utf8")).join("\n");
const minify = (c) => c.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{};,>])\s*/g, "$1").replace(/;}/g, "}").replace(/:\s+/g, ":").trim();
/* tokens + base are always critical; other layers contribute only what sits inside @critical fences */
const fenced = (c) => [...c.matchAll(/\/\*\s*@critical\s*\*\/([\s\S]*?)\/\*\s*@\/critical\s*\*\//g)].map((m) => m[1]).join("\n");
const criticalRaw = ["tokens.css", "base.css"].map((f) => readFileSync(join(cssDir, f), "utf8")).join("\n") + "\n" + ["components.css", "motion.css", "pages.css"].map((f) => fenced(readFileSync(join(cssDir, f), "utf8"))).join("\n");
const css = "/* عوالِم قروب — built from src/css/*.css · do not edit by hand */\n" + minify(rawCss);
const criticalCss = minify(criticalRaw);
write("assets/css/awalim.css", css);
const buildStamp = createHash("sha256").update(css + readFileSync(join(ROOT, "assets/js/awalim.js"), "utf8") + readFileSync(join(ROOT, "assets/js/motion.js"), "utf8") + readFileSync(join(ROOT, "assets/js/extras.js"), "utf8")).digest("hex").slice(0, 8);
setBuild(criticalCss, buildStamp);

/* ---------- templates ---------- */
const home = (await import("./src/pages/home.mjs")).default;
const work = await import("./src/pages/work.mjs");
const products = await import("./src/pages/products.mjs");
const services = (await import("./src/pages/services.mjs")).default;
const academy = (await import("./src/pages/academy.mjs")).default;
const group = (await import("./src/pages/group.mjs")).default;
const journal = await import("./src/pages/journal.mjs");
const contact = (await import("./src/pages/contact.mjs")).default;
const verify = (await import("./src/pages/verify.mjs")).default;
const offline = (await import("./src/pages/offline.mjs")).default;
const notfound = (await import("./src/pages/notfound.mjs")).default;
const careers = (await import("./src/pages/careers.mjs")).default;
const legal = (await import("./src/pages/legal.mjs")).default;
const press = (await import("./src/pages/press.mjs")).default;

const renderAll = (c) => [
  home(c),
  work.renderIndex(c),
  ...c.cases.map((x, i) => work.renderCase(c, x, i)),
  products.renderIndex(c),
  ...c.products.map((p) => products.renderProduct(c, p)),
  services(c),
  academy(c),
  group(c),
  journal.renderIndex(c),
  ...c.articles.map((a, i) => journal.renderArticle(c, a, i)),
  contact(c),
  careers(c),
  press(c),
  ...c.legal.pages.map((d) => legal(c, d)),
  verify(c),
  offline(c),
  notfound(c)
];
const routes = renderAll(ctx);

/* ---------- clean previous output (only what we own) ---------- */
const OWNED_DIRS = ["work", "products", "services", "academy", "group", "journal", "contact", "about", "insights", "verify", "offline", "careers", "press", "privacy", "terms", "en"];
for (const d of OWNED_DIRS) if (existsSync(join(ROOT, d))) rmSync(join(ROOT, d), { recursive: true, force: true });
for (const f of ["index.html", "404.html", "work.html", "products.html", "services.html", "academy.html", "about.html", "insights.html", "contact.html"])
  if (existsSync(join(ROOT, f))) rmSync(join(ROOT, f));

/* ---------- localisation of the rendered HTML ---------- */
const ASSET_RE = /^\/(assets|sw\.js|search\.json|favicon\.ico|site\.webmanifest|verify\/stats\.json|robots\.txt|sitemap\.xml|journal\/feed\.xml)/;
const ARABIC_RE = /[\u0600-\u06FF]/;

/* The eyebrow carries a bilingual signature: an Arabic label beside a Latin
   section code. Translated verbatim it stutters — "Careers · CAREERS" — so the
   Arabic pass records every label under its Latin code, and the English pass
   swaps the pair round: "Careers · الوظائف". The signature survives translation
   instead of collapsing into a repeated word. */
const EYEBROW_RE = /<p class="eyebrow[^"]*">\s*<span>([\s\S]*?)<\/span><span class="eyebrow__sep"[^>]*>·<\/span><span class="eyebrow__latin" lang="en">([^<]*)<\/span>/g;
const AR_EYEBROWS = new Map();
function recordEyebrows(html, path) {
  const codes = new Map();
  for (const [, label, latin] of html.matchAll(EYEBROW_RE)) {
    const key = latin.trim();
    if (!codes.has(key)) codes.set(key, []);
    codes.get(key).push(label.replace(/<[^>]+>/g, "").trim());
  }
  AR_EYEBROWS.set(path, codes);
}

function localize(html, path, loc) {
  const alt = LOCALES.find((l) => l.code !== loc.code);
  let out = html;

  if (loc.code !== "ar") {
    /* mirror the eyebrow pair before anything else, and park the Arabic
       stencil behind a token so the dictionary below cannot translate it back */
    const codes = AR_EYEBROWS.get(path) || new Map();
    const seen = new Map();
    const parked = [];
    out = out.replace(EYEBROW_RE, (m, label, latin) => {
      const key = latin.trim();
      const i = seen.get(key) || 0;
      seen.set(key, i + 1);
      const ar = (codes.get(key) || [])[i];
      /* a label that was already a system code has nothing to mirror */
      if (!ar || !/[\u0600-\u06FF]/.test(ar)) return m;
      parked.push(ar);
      return m.replace(`<span class="eyebrow__latin" lang="en">${latin}</span>`,
        `<span class="eyebrow__latin eyebrow__ar" lang="ar">\u0000E${parked.length - 1}\u0000</span>`);
    });

    /* The header lockup is the same bilingual signature as the eyebrow: the
       name in the page's own script, the name in the other one beneath it.
       src/content/en/site.json overrides brand.name, so by the time the English
       pass runs the pair has already collapsed — it printed "Awalim Group"
       twice, stacked, on all 38 English pages. The mirror is taken from the
       Arabic source and parked so the dictionary cannot translate it back. */
    out = out.replace(/<span class="brand__sub" lang="en">[^<]*<\/span>/g, () => {
      parked.push(site.brand.name);
      return `<span class="brand__sub brand__sub--ar" lang="ar">\u0000E${parked.length - 1}\u0000</span>`;
    });

    /* chrome strings → English, longest match first */
    for (const [ar, en] of DICT_ENTRIES) out = out.split(ar).join(en);
    out = out.replace('<html lang="ar" dir="rtl">', `<html lang="${loc.code}" dir="${loc.dir}">`);
    /* internal links move under the locale prefix; assets never do */
    out = out.replace(/(href|src)="(\/[^"#]*)"/g, (m, attr, p) => (ASSET_RE.test(p) ? m : `${attr}="${loc.prefix}${p}"`));
    /* absolute URLs in canonical, og:url and JSON-LD */
    out = out.replace(new RegExp(site.brand.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(/[^\"']*)?", "g"),
      (m, p) => (p && ASSET_RE.test(p) ? m : site.brand.url + loc.prefix + (p || "/")));
    out = out.replace(/\u0000E(\d+)\u0000/g, (m, i) => parked[+i]);
  }

  /* hreflang: both locales, on every page, plus x-default on the Arabic original */
  const altPath = `${site.brand.url}${alt.prefix}${path === "/" ? "/" : path}`;
  const selfPath = `${site.brand.url}${loc.prefix}${path === "/" ? "/" : path}`;
  const arPath = loc.code === "ar" ? selfPath : altPath;
  out = out.replace("</head>", [
    `<link rel="alternate" hreflang="ar" href="${loc.code === "ar" ? selfPath : altPath}">`,
    `<link rel="alternate" hreflang="en" href="${loc.code === "en" ? selfPath : altPath}">`,
    `<link rel="alternate" hreflang="x-default" href="${arPath}">`,
    "</head>"
  ].join("\n"));

  /* the language switcher points at this exact page in the other language */
  out = out.split("__ALT_URL__").join(`${alt.prefix}${path === "/" ? "/" : path}`)
           .split("__ALT_CODE__").join(alt.code)
           .split("__ALT_SHORT__").join(alt.code === "en" ? "EN" : "ع")
           .split("__ALT_LABEL__").join(alt.name)
           .split("__ALT_ARIA__").join(alt.code === "en" ? "Read this page in English" : "اقرأ هذه الصفحة بالعربية");
  return out;
}

/* ---------- write pages, per locale ---------- */
let count = 0;
const allRoutes = [];
const leftovers = [];
for (const loc of LOCALES) {
  const c = loc.code === "ar" ? ctx : buildCtx(loc.code);
  if (loc.code !== "ar") { c.signing = signing; c.routesCount = ctx.routesCount; }
  for (const r of renderAll(c)) {
    if (loc.code === "ar") recordEyebrows(r.html, r.path);
    const html = localize(r.html, r.path, loc);
    const full = `${loc.prefix}${r.path}`;
    const out = full === "/" ? "index.html" : full === "/404" ? "404.html" : `${full.replace(/^\//, "")}/index.html`;
    write(out, html);
    allRoutes.push(full);
    count++;
    if (loc.code === "en") {
      /* the brand's Arabic wordmark is intentional; anything else is a gap */
      /* the wordmark and the "read this in Arabic" switcher are deliberately Arabic */
      const body = html
        .replace(/<span class="brand__name">[^<]*<\/span>/g, "")
        .replace(/<a\b[^>]*lang="ar"[\s\S]*?<\/a>/g, "")
        .replace(/<[^>]*lang="ar"[^>]*>[^<]*</g, "<");
      const hits = [...new Set((body.match(/[\u0600-\u06FF][\u0600-\u06FF\s،؛؟«»\-—·:,.\d]*/g) || []).map((x) => x.trim()).filter((x) => x.length > 1))];
      if (hits.length) leftovers.push(`${full}: ${hits.slice(0, 6).join(" | ")}`);
    }
  }
}
if (leftovers.length) {
  console.warn(`⚠ ${leftovers.length} English page(s) still contain Arabic — add the strings to src/content/i18n.json or src/content/en/*.json:`);
  for (const l of leftovers.slice(0, 12)) console.warn("   " + l);
}

/* ---------- service worker (versioned by the build stamp) ---------- */
write("sw.js", readFileSync(join(ROOT, "src/sw.template.js"), "utf8").replace("__STAMP__", buildStamp));

/* ---------- public verification manifest ---------- */
write("verify/stats.json", JSON.stringify({ ...signing, note: "Verify: sha256(payload) == sha256 · Ed25519.verify(publicKey, signature, payload). See /verify." }, null, 2));

/* ---------- search index for the ⌘K palette ---------- */
const idx = [];
const add = (t, d, u, k, extra = "") => idx.push({ t, d, u, k, s: normalizeSearch([t, d, extra].join(" ")) });
const pages = ctx.pages;
add("الرئيسية", site.brand.tagline, "/", "صفحة", "home awalim عوالم");
add("الأعمال", pages.work.lede, "/work", "صفحة", "work portfolio دراسات حالة");
add("المنتجات", pages.products.lede, "/products", "صفحة", "products");
add("الخدمات", pages.services.lede, "/services", "صفحة", "services");
add("الأكاديمية", pages.academy.lede, "/academy", "صفحة", "academy تدريب مسارات");
add("المجموعة", pages.group.lede, "/group", "صفحة", "about group عن عوالم");
add("رؤى", pages.journal.lede, "/journal", "صفحة", "journal blog مقالات");
add("ابدأ مشروعك", pages.contact.lede, "/contact", "صفحة", "contact تواصل واتساب");
add("تحقّق من أرقامنا", "توقيع Ed25519 يتحقّق منه متصفّحك", "/verify", "صفحة", "verify signature توقيع");
add("الوظائف", ctx.careers.lede, "/careers", "صفحة", "careers jobs توظيف وظيفة شاغر");
add("المواد الصحفية", ctx.press.lede, "/press", "صفحة", "press kit صحافة شعار لوجو");
for (const d of ctx.legal.pages) add(d.h, d.lede, `/${d.slug}`, "صفحة", "legal privacy terms خصوصية شروط");
for (const r of ctx.careers.roles.filter((r) => r.open !== false)) add(r.title, r.summary, `/careers#role-${r.slug}`, "وظيفة", `${r.team} ${r.type} ${r.level}`);
for (const c of ctx.cases) add(`${c.title} — ${c.headline}`, c.summary, `/work/${c.slug}`, "دراسة حالة", `${c.code} ${c.kind} ${c.tech.join(" ")} ${c.aliases || ""}`);
for (const p of ctx.products) add(p.title, p.headline, `/products/${p.slug}`, "منتج", `${p.code} ${p.kind} ${p.tags.join(" ")} ${p.aliases || ""}`);
for (const a of ctx.articles) add(a.title, a.excerpt, `/journal/${a.slug}`, "مقال", `${a.catLabel} ${a.author}`);
for (const [id, t, d] of [["work", "الأعمال المختارة", "RahmaCare · Jameel Store · Vibe OS · محاسب ذكي"], ["ecosystem", "ستّة خطوط إنتاج", "المنظومة"], ["standards", "ثمانية شروط لا نسلّم بدونها", "المعايير الهندسية"], ["stack", "أدوات نعرفها عن ظهر قلب", "المكدّس التقني"], ["process", "أربع مراحل. لا مفاجآت.", "كيف نعمل"], ["founder", "كلمة المؤسّس", "أحمد أشرف"], ["faq", "أسئلة متكرّرة", "قبل أن تتواصل"]]) add(t, d, `/#${id}`, "قسم");
for (const it of pages.services.items) add(it.t, it.h, `/services#${it.id}`, "قسم", it.latin);
add("كيف نُسعّر", pages.services.pricing.h, "/services#pricing", "قسم", "pricing تسعير");
write("search.json", JSON.stringify(idx));
/* English index: same shape, translated through the dictionary and prefixed */
const enCtx = buildCtx("en");
const enIdx = [];
const addEn = (t, d, u, k, extra = "") => enIdx.push({ t, d, u: "/en" + (u === "/" ? "/" : u), k, s: normalizeSearch([t, d, extra].join(" ")) });
const tr = (x) => { let o = String(x ?? ""); for (const [ar, en] of DICT_ENTRIES) o = o.split(ar).join(en); return o; };
addEn("Home", enCtx.site.brand.tagline, "/", "page", "home awalim");
addEn("Work", enCtx.pages.work.lede, "/work", "page", "portfolio case studies");
addEn("Products", enCtx.pages.products.lede, "/products", "page", "products");
addEn("Services", enCtx.pages.services.lede, "/services", "page", "services");
addEn("Academy", enCtx.pages.academy.lede, "/academy", "page", "academy training tracks");
addEn("Group", enCtx.pages.group.lede, "/group", "page", "about group");
addEn("Journal", enCtx.pages.journal.lede, "/journal", "page", "journal blog articles");
addEn("Start your project", enCtx.pages.contact.lede, "/contact", "page", "contact whatsapp");
addEn("Verify our numbers", "An Ed25519 signature your browser checks", "/verify", "page", "verify signature");
addEn("Careers", enCtx.careers.lede, "/careers", "page", "careers jobs hiring role vacancy");
addEn("Press kit", enCtx.press.lede, "/press", "page", "press kit logo boilerplate media");
for (const d of enCtx.legal.pages) addEn(d.h, d.lede, `/${d.slug}`, "page", "legal privacy terms");
for (const r of enCtx.careers.roles.filter((r) => r.open !== false)) addEn(r.title, r.summary, `/careers#role-${r.slug}`, "role", `${r.team} ${r.type} ${r.level}`);
for (const c of enCtx.cases) addEn(`${c.title} — ${c.headline}`, c.summary, `/work/${c.slug}`, "case study", `${c.code} ${c.kind} ${c.tech.join(" ")}`);
for (const p of enCtx.products) addEn(p.title, p.headline, `/products/${p.slug}`, "product", `${p.code} ${p.kind} ${p.tags.join(" ")}`);
for (const a of enCtx.articles) addEn(a.title, a.excerpt, `/journal/${a.slug}`, "article", `${tr(a.catLabel)} ${a.author}`);
for (const it of enCtx.pages.services.items) addEn(it.t, it.h, `/services#${it.id}`, "section", it.latin);
write("en/search.json", JSON.stringify(enIdx));

/* ---------- legacy routes: /about → /group, /insights → /journal ---------- */
const stub = (to) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="${site.brand.url}${to}"><title>تحويل…</title></head><body><a href="${to}">${to}</a></body></html>`;
write("about/index.html", stub("/group"));
write("insights/index.html", stub("/journal"));
write("en/about/index.html", stub("/en/group"));
write("en/insights/index.html", stub("/en/journal"));


/* ---------- RSS for the journal (both locales) ---------- */
const rss = (c, prefix) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${c.pages.journal.h} — ${c.site.brand.name}</title>
  <link>${site.brand.url}${prefix}/journal</link>
  <description>${c.pages.journal.lede}</description>
  <language>${prefix ? "en" : "ar"}</language>
  <atom:link href="${site.brand.url}${prefix}/journal/feed.xml" rel="self" type="application/rss+xml"/>
${c.articles.map((a) => `  <item>
    <title>${a.title.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</title>
    <link>${site.brand.url}${prefix}/journal/${a.slug}</link>
    <guid isPermaLink="true">${site.brand.url}${prefix}/journal/${a.slug}</guid>
    <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    <description>${a.excerpt.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</description>
  </item>`).join("\n")}
</channel>
</rss>
`;
write("journal/feed.xml", rss(ctx, ""));
write("en/journal/feed.xml", rss(buildCtx("en"), "/en"));

/* ---------- sitemap + robots ---------- */
const today = new Date().toISOString().slice(0, 10);
const prio = (p) => (p === "/" ? "1.0" : p.split("/").length > 2 ? "0.7" : "0.9");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allRoutes.filter((p) => !p.endsWith("/404") && !p.endsWith("/offline")).map((p) => `  <url><loc>${site.brand.url}${p === "/" ? "/" : p}</loc><lastmod>${today}</lastmod><priority>${prio(p)}</priority><xhtml:link rel="alternate" hreflang="${p.startsWith("/en") ? "en" : "ar"}" href="${site.brand.url}${p}"/></url>`).join("\n")}
</urlset>
`;
write("sitemap.xml", sitemap);
write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /src/\n\nSitemap: ${site.brand.url}/sitemap.xml\n`);

/* ---------- routes manifest (used by tests / OG generator) ---------- */
write("src/routes.json", JSON.stringify(allRoutes, null, 2));

console.log(`✔ built ${count} pages (${LOCALES.length} locales) · css ${(css.length / 1024).toFixed(1)}KB (critical ${(criticalCss.length / 1024).toFixed(1)}KB inline) · build ${buildStamp} · ${new Date().toLocaleTimeString("en-GB")}`);
