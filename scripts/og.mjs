/* Generate a 1200×630 Open Graph image per route (section 11) by rendering a
   small branded HTML card with the site's own fonts and tokens, then
   screenshotting it. Output: assets/img/og/<name>.png */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE || "http://localhost:8899";
const site = JSON.parse(readFileSync(join(ROOT, "src/content/site.json"), "utf8"));
const cases = JSON.parse(readFileSync(join(ROOT, "src/content/cases.json"), "utf8")).cases;
const products = JSON.parse(readFileSync(join(ROOT, "src/content/products.json"), "utf8")).products;
const articles = JSON.parse(readFileSync(join(ROOT, "src/content/journal.json"), "utf8")).articles;
const pages = JSON.parse(readFileSync(join(ROOT, "src/content/pages.json"), "utf8"));
const T = site.themes;

const cards = [
  { name: "home", eyebrow: "AWALIM GROUP · عوالِم قروب", title: "لا نبني مواقع.\nنبني الأنظمة التي تُشغِّل الشركات.", sub: "بيت هندسة رقمية من فلسطين إلى العالم · تأسّست 2021", theme: T.rahmacare },
  { name: "work", eyebrow: "SELECTED WORK · الأعمال", title: "أنظمة وتطبيقات وهويات سُلِّمت لعملاء حقيقيين", sub: `${cases.length} دراسات حالة مشروحة كما بُنيت — ما المشكلة، وما الذي قرّرناه، ولماذا`, theme: T.vibeos },
  { name: "products", eyebrow: "SYS INDEX · المنتجات", title: "أنظمة نبنيها ونطوّرها كمنتجات مستقلة", sub: "محاسب ذكي · RahmaCare · Vibe OS 4.0 · مختبر الذكاء", theme: T.accounting },
  { name: "services", eyebrow: "SERVICES · الخدمات", title: "أربعة مجالات نعمل فيها بعمق", sub: "أنظمة مؤسسية · ذكاء اصطناعي وكيل · موبايل · هوية", theme: T.lab },
  { name: "academy", eyebrow: "SYS-ACAD-03 · الأكاديمية", title: "نُدرّس بالطريقة التي نعمل بها", sub: "مشروع حقيقي، مراجعة كود، واختبارات — لا سلسلة فيديوهات", theme: T.academy },
  { name: "group", eyebrow: "THE GROUP · المجموعة", title: "من غرفة في غزّة إلى أنظمة تعمل في عشر دول", sub: "Born in Palestine 🇵🇸 · Est. 2021", theme: T.islandhaven },
  { name: "journal", eyebrow: "JOURNAL · رؤى", title: "ملاحظات هندسية من مشاريع حقيقية", sub: "لا محتوى تسويقي", theme: T.maya },
  { name: "contact", eyebrow: "START A PROJECT · تواصل", title: "احكِ لنا عن المشكلة، لا عن الحل", sub: "نعود إليك بتشخيص أوّلي وتقدير نطاق — دون التزام", theme: T.hmi },
  ...cases.map((c) => ({ name: `work-${c.slug}`, eyebrow: `${c.code} · دراسة حالة`, title: `${c.title} — ${c.headline}`, sub: c.summary, theme: T[c.theme] })),
  ...products.map((p) => ({ name: `products-${p.slug}`, eyebrow: `${p.code} · ${p.kind}`, title: p.title, sub: p.headline, theme: T[p.theme] })),
  ...articles.map((a) => ({ name: `journal-${a.slug}`, eyebrow: `${a.catLabel} · قراءة ${a.minutes} دقائق`, title: a.title, sub: a.excerpt, theme: T[a.theme] }))
];

const html = (c) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<link rel="stylesheet" href="${BASE}/assets/css/awalim.css">
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
  .og { width: 1200px; height: 630px; padding: 72px 80px; box-sizing: border-box; background: ${c.theme.bg}; color: ${c.theme.fg}; display: grid; grid-template-rows: auto 1fr auto; font-family: var(--font-ar); position: relative; overflow: hidden; }
  .og::before { content: ""; position: absolute; inset: 0; background: radial-gradient(55% 80% at 95% 0%, ${c.theme.accent}44, transparent 70%); }
  .og > * { position: relative; }
  .eb { display: flex; align-items: center; gap: 14px; font-size: 22px; color: ${c.theme.dim}; font-weight: 500; }
  .eb::before { content: ""; width: 34px; height: 2px; background: ${c.theme.accent}; }
  .t { font-family: "Alexandria", var(--font-ar); font-size: ${c.title.length > 60 ? 54 : c.title.length > 34 ? 62 : 80}px; line-height: 1.38; font-weight: 800; align-self: center; white-space: pre-line; text-wrap: balance; max-width: 18ch; }
  .s { font-size: 24px; color: ${c.theme.dim}; line-height: 1.5; max-width: 44ch; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .b { display: flex; align-items: center; justify-content: space-between; gap: 24px; }
  .brand { display: flex; align-items: center; gap: 14px; font-weight: 700; font-size: 24px; }
  .brand img { width: 44px; height: 44px; border-radius: 12px; }
  .brand small { display: block; font-family: var(--font-latin); font-size: 11px; letter-spacing: .2em; opacity: .7; font-weight: 600; }
  .url { font-family: var(--font-mono); font-size: 18px; color: ${c.theme.dim}; direction: ltr; }
</style></head><body><div class="og">
  <div class="eb"><span>${c.eyebrow}</span></div>
  <div><div class="t">${c.title}</div><div class="s" style="margin-top:22px">${c.sub}</div></div>
  <div class="b"><div class="brand"><img src="${BASE}${site.brand.mark}" alt=""><span>${site.brand.name}<small>AWALIM GROUP</small></span></div><span class="url">awalimgroup.com</span></div>
</div></body></html>`;

mkdirSync(join(ROOT, "assets/img/og"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const c of cards) {
  await page.setContent(html(c), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(ROOT, `assets/img/og/${c.name}.png`), type: "png" });
  console.log("✔ og/" + c.name + ".png");
}
await browser.close();
