/* Editorial covers for the journal — typographic, on-brand, generated from
   the site's own tokens instead of stock imagery. 1200×750 → webp.
   The cover carries the CATEGORY, not the headline: the card prints the
   headline in text right beneath it, and a cover that repeats it word for
   word reads as a duplication rather than as art. (The OG images, which are
   seen alone in a share preview, do carry the headline — scripts/og.mjs.)
   Usage: node scripts/covers.mjs   (expects the dev server at BASE) */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.BASE || "http://localhost:8899";
const site = JSON.parse(readFileSync(join(ROOT, "src/content/site.json"), "utf8"));
const journal = JSON.parse(readFileSync(join(ROOT, "src/content/journal.json"), "utf8"));
const T = site.themes;
const glyph = { ai: "⌘", mobile: "◐", infra: "▦", product: "◆", design: "◈" };

const html = (a, t) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<link rel="stylesheet" href="${BASE}/assets/css/awalim.css">
<style>
  html, body { margin: 0; width: 1200px; height: 750px; overflow: hidden; }
  .c { width: 1200px; height: 750px; box-sizing: border-box; padding: 70px 80px; background: ${t.bg}; color: ${t.fg}; display: grid; grid-template-rows: auto 1fr auto; position: relative; overflow: hidden; font-family: var(--font-ar); }
  .c::before { content: ""; position: absolute; inset: 0; background: radial-gradient(60% 80% at 92% 0%, ${t.accent}55, transparent 68%); }
  .c::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(${t.fg}0d 1px, transparent 1px), linear-gradient(90deg, ${t.fg}0d 1px, transparent 1px); background-size: 60px 60px; mask-image: linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent); }
  .c > * { position: relative; z-index: 1; }
  .eb { display: flex; gap: 14px; align-items: center; font-size: 22px; color: ${t.dim}; font-weight: 500; }
  .eb::before { content: ""; width: 34px; height: 2px; background: ${t.accent}; }
  .t { font-family: "Alexandria", var(--font-ar); font-weight: 800; font-size: ${a.coverWord.length > 16 ? 74 : 92}px; line-height: 1.2; align-self: center; max-width: 13ch; text-wrap: balance; }
  .t small { display: block; font-family: var(--font-ar); font-size: 22px; font-weight: 500; color: ${t.dim}; margin-block-end: 20px; }
  .g { position: absolute; inset-inline-start: 60px; inset-block-end: -70px; font-size: 340px; line-height: .8; color: ${t.accent}; opacity: .14; font-family: var(--font-latin); font-weight: 900; z-index: 0; }
  .b { display: flex; justify-content: space-between; align-items: center; color: ${t.dim}; font-size: 20px; }
  .b b { color: ${t.fg}; font-weight: 700; }
</style></head><body><div class="c">
  <div class="eb"><span>رؤى · عوالِم قروب</span></div>
  <div class="t"><small>${a.catLabel}</small>${a.coverWord}</div>
  <div class="g">${glyph[a.cat] || "◆"}</div>
  <div class="b"><span>قراءة ${a.minutes} دقائق</span><span dir="ltr" style="font-family:var(--font-mono)">awalimgroup.com/journal</span></div>
</div></body></html>`;

mkdirSync(join(ROOT, "assets/img/journal"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 750 }, deviceScaleFactor: 1 });
for (const a of journal.articles) {
  const t = T[a.theme] || T.accounting;
  await page.setContent(html(a, t), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const png = join(ROOT, `assets/img/journal/cover-${a.slug}.png`);
  await page.screenshot({ path: png, type: "png" });
  execSync(`cwebp -q 86 "${png}" -o "${png.replace(/\.png$/, ".webp")}" >/dev/null 2>&1 && rm "${png}"`);
  console.log("✔ cover-" + a.slug + ".webp");
}
await browser.close();
