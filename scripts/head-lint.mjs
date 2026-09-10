/* head-lint.mjs — سلامة رأس الصفحة والمراسي وخريطة الموقع، مقروءة من الـHTML المبني.
   لا متصفّح: هذه حقائق في الملفّ، وفحصها بالمتصفّح يخلط بين ما بُني وما رُسم.
   يغطّي ما لا يغطّيه check-links (الملفّات) ولا audit-render (الرسم):
   العنوان والوصف وتفرّدهما وطولهما · canonical · og و og:image على القرص ·
   hreflang وأن الطرف الآخر موجود · JSON-LD يُحلَّل · المراسي #id تُصيب هدفاً ·
   الصور بأبعاد معلنة (وإلا قفزت الصفحة) · lang على html · sitemap = المسارات. */
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { px20 } from "../src/lib/html.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const routes = JSON.parse(readFileSync(join(ROOT, "src/routes.json"), "utf8"));
const fileFor = (p) => {
  p = p.split("#")[0].split("?")[0];
  if (!p || p === "/") return join(ROOT, "index.html");
  const abs = join(ROOT, p);
  if (existsSync(abs) && statSync(abs).isFile()) return abs;
  if (existsSync(join(abs, "index.html"))) return join(abs, "index.html");
  if (existsSync(abs + ".html")) return abs + ".html";
  return null;
};

/* صفحات خدمة: لا تُفهرَس ولا تُوصَف كصفحات محتوى */
const UTILITY = new Set(["/404", "/offline", "/en/404", "/en/offline"]);

const findings = [];
const add = (rule, route, detail) => findings.push({ rule, route, detail });
const attr = (tag, name) => { const m = tag.match(new RegExp(name + '="([^"]*)"')); return m ? m[1] : null; };
const meta = (html, key, kind = "name") => {
  const re = new RegExp(`<meta[^>]*${kind}="${key}"[^>]*>`, "i");
  const m = html.match(re);
  return m ? attr(m[0], "content") : null;
};

const titles = new Map(), descs = new Map();
let images = 0, anchors = 0;

for (const r of routes) {
  const f = fileFor(r);
  if (!f) { add("صفحة-مفقودة", r, "لا ملف"); continue; }
  const html = readFileSync(f, "utf8");

  /* -- html lang/dir -- */
  const htmlTag = (html.match(/<html[^>]*>/i) || [""])[0];
  const lang = attr(htmlTag, "lang"), dir = attr(htmlTag, "dir");
  const wantLang = r.startsWith("/en") ? "en" : "ar", wantDir = r.startsWith("/en") ? "ltr" : "rtl";
  if (lang !== wantLang) add("lang", r, `${lang} بدل ${wantLang}`);
  if (dir !== wantDir) add("dir", r, `${dir} بدل ${wantDir}`);

  /* -- title / description -- */
  const t = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1];
  if (!t) add("بلا-عنوان", r, "");
  else {
    /* محرّك البحث يقصّ بالعرض: 600px بخطّ Arial 20px. عدّ الحروف يظلم العربية
       (حرفها أضيق) ويسامح الإنجليزية — وقد أرسل الفحص الأوّل إلى 52 عنواناً
       سليماً وترك 18 معطوباً. */
    const w = px20(t.replace(/&[a-z]+;/g, "x"));
    if (w > 600) add("عرض-العنوان", r, `${w}px — «${t.slice(0, 56)}»`);
    if (t.replace(/&[a-z]+;/g, "x").length < 15) add("عنوان-قصير", r, `«${t}»`);
    if (titles.has(t)) add("عنوان-مكرّر", r, `مثل ${titles.get(t)}`); else titles.set(t, r);
  }
  const d = meta(html, "description");
  if (!d) add("بلا-وصف", r, "");
  else {
    const w = px20(d);
    if (w > 1620) add("عرض-الوصف", r, `${w}px`);
    if (!UTILITY.has(r) && d.length < 50) add("وصف-قصير", r, `${d.length} حرفاً`);
    if (descs.has(d)) add("وصف-مكرّر", r, `مثل ${descs.get(d)}`); else descs.set(d, r);
  }

  /* -- canonical -- */
  const can = (html.match(/<link[^>]*rel="canonical"[^>]*>/i) || [""])[0];
  const href = can ? attr(can, "href") : null;
  if (!href) add("بلا-canonical", r, "");
  else if (!/^https?:\/\//.test(href)) add("canonical-نسبي", r, href);
  else {
    const path = href.replace(/^https?:\/\/[^/]+/, "") || "/";
    const want = r === "/" ? "/" : r + "/";
    if (path !== want && path !== r) add("canonical-خاطئ", r, `${path} بدل ${want}`);
  }

  /* -- open graph -- */
  for (const k of ["og:title", "og:description", "og:image", "og:url", "og:type"])
    if (!meta(html, k, "property")) add("og-ناقص", r, k);
  const ogimg = meta(html, "og:image", "property");
  if (ogimg) {
    const p = ogimg.replace(/^https?:\/\/[^/]+/, "");
    if (p.startsWith("/") && !existsSync(join(ROOT, p))) add("og:image-مفقودة", r, p);
  }

  /* -- hreflang: الطرف الآخر موجود فعلاً -- */
  const alts = [...html.matchAll(/<link[^>]*rel="alternate"[^>]*>/gi)].map((m) => m[0]);
  const langs = alts.map((a) => attr(a, "hreflang"));
  for (const need of ["ar", "en", "x-default"])
    if (!langs.includes(need)) add("hreflang-ناقص", r, need);
  for (const a of alts) {
    const p = (attr(a, "href") || "").replace(/^https?:\/\/[^/]+/, "");
    if (p && !fileFor(p)) add("hreflang-معطّل", r, `${attr(a, "hreflang")} → ${p}`);
  }

  /* -- JSON-LD يُحلَّل -- */
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(m[1]); } catch (e) { add("JSON-LD-معطوب", r, e.message.slice(0, 60)); }
  }

  /* -- المراسي: كل href="#id" تصيب هدفاً -- */
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    anchors++;
    if (!ids.has(m[1])) add("مرساة-معطّلة", r, "#" + m[1]);
  }

  /* -- الصور بأبعاد: بدونها تقفز الصفحة عند التحميل (CLS) -- */
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    images++;
    const tag = m[0];
    if (!attr(tag, "width") || !attr(tag, "height")) add("صورة-بلا-أبعاد", r, (attr(tag, "src") || "").slice(-46));
  }
}

/* -- sitemap = المسارات المبنيّة -- */
const smPath = join(ROOT, "sitemap.xml");
if (!existsSync(smPath)) add("sitemap", "/", "مفقود");
else {
  const sm = readFileSync(smPath, "utf8");
  const listed = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "").replace(/\/$/, "") || "/"));
  for (const r of routes) {
    if (UTILITY.has(r)) continue;                 /* 404 وoffline لا تُفهرَسان بقصد */
    if (!listed.has(r === "/" ? "/" : r.replace(/\/$/, ""))) add("sitemap-ناقص", r, "غير مذكور");
  }
  for (const l of listed) if (!routes.includes(l) && !routes.includes(l + "/")) add("sitemap-زائد", l, "ليس مساراً مبنيّاً");
}

const byRule = {};
for (const f of findings) (byRule[f.rule] ||= []).push(f);
console.log(`فُحص ${routes.length} صفحة · ${anchors} مرساة · ${images} صورة`);
if (!findings.length) { console.log("✔ الرأس والمراسي والخريطة سليمة"); process.exit(0); }
console.log(`✘ ${findings.length} مخالفة في ${Object.keys(byRule).length} قاعدة\n`);
for (const [rule, list] of Object.entries(byRule).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`■ ${rule} — ${list.length}`);
  for (const x of list.slice(0, 8)) console.log(`   ${x.route.padEnd(34)} ${x.detail}`);
  if (list.length > 8) console.log(`   … و${list.length - 8} أخرى`);
}
process.exit(1);
