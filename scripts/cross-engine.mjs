/* cross-engine.mjs — الموقع في WebKit، لا في Chromium وحده.
   كل فحص في هذا المستودع يعمل على محرّك واحد، ونصف زوّار موقع عربي على iPhone
   — أي على WebKit. المحرّكان يختلفان في: دعم الخصائص، تقريب التخطيط، سياسة
   الوسائط، وتحليل CSS الحديث (:has، @container، color-mix، mask).
   يقيس هنا ما لا يحتمل الاختلاف: خطأ نصّي، طلب فاشل، صورة مكسورة، فيض أفقي،
   نصّ مقصوص، وخاصيّة CSS حديثة سقطت. */
import { webkit } from "playwright";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:https";
import { request as httpRequest } from "node:http";

const HTTP = process.env.BASE || "http://localhost:8899";
/* سياسة الموقع تحمل upgrade-insecure-requests. Chromium يستثني localhost منه،
   وWebKit لا يستثنيه: كل طلب يُرقّى إلى https فيفشل، فتبدو الصور مكسورة
   والخطوط ساقطة — وذلك عيبٌ في بيئة الفحص لا في الموقع، إذ العنوان في الإنتاج
   https أصلاً. فبدل أن نعطّل السياسة نرضيها: وكيل https محلّي أمام الخادم.
   الشهادة موقّعة ذاتياً و ignoreHTTPSErrors يقبلها. */
const TLS = process.env.TLS_DIR || join(tmpdir(), "awalim-cross-engine-tls");
try { const res = await fetch(HTTP + "/", { method: "HEAD" }); if (!res.ok && res.status !== 404) throw new Error("status " + res.status); }
catch (e) { console.error(`\n✖ لا خادم على ${HTTP} — \`npm run serve\`.\n   ${e.message}`); process.exit(1); }
if (!existsSync(`${TLS}/cert.pem`)) {
  try {
    mkdirSync(TLS, { recursive: true });
    execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes",
      "-keyout", `${TLS}/key.pem`, "-out", `${TLS}/cert.pem`, "-days", "30",
      "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost,IP:127.0.0.1"], { stdio: "ignore" });
  } catch (e) {
    console.error(`\n✖ تعذّر توليد شهادة محلّية في ${TLS} (openssl مطلوب).\n   ${e.message}`);
    process.exit(1);
  }
}
const upstream = new URL(HTTP);
const PORT = Number(process.env.TLS_PORT || 8943);
const proxy = createServer({ key: readFileSync(`${TLS}/key.pem`), cert: readFileSync(`${TLS}/cert.pem`) }, (req, res) => {
  const r = httpRequest({ hostname: upstream.hostname, port: upstream.port, path: req.url, method: req.method, headers: { ...req.headers, host: upstream.host } },
    (up) => { res.writeHead(up.statusCode || 502, up.headers); up.pipe(res); });
  r.on("error", () => { res.writeHead(502); res.end(); });
  req.pipe(r);
});
await new Promise((ok) => proxy.listen(PORT, ok));
const BASE = `https://localhost:${PORT}`;

const routes = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8"));
const b = await webkit.launch();
/* reducedMotion يوقف المسارح المدفوعة بالتمرير فتظهر الصفحة كاملةً ساكنة —
   وهو ما يفعله audit-render. بدونه كان التمرير ثم التجميد يترك مسرح الصفحة
   الرئيسية في منتصف حركته، فيختفي العنوان كلّه ويُبلَّغ عنه «مقصوصاً». */
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true, reducedMotion: "reduce" });
const page = await ctx.newPage();


const findings = [];
const add = (rule, route, detail) => findings.push({ rule, route, detail });

let pageErrs = [], consoleErrs = [], failed = [];
page.on("pageerror", (e) => pageErrs.push(String(e.message).slice(0, 120)));
page.on("console", (m) => { if (m.type() === "error") consoleErrs.push(m.text().slice(0, 120)); });
page.on("requestfailed", (r) => failed.push(r.url().replace(BASE, "").slice(0, 80) + " — " + (r.failure() || {}).errorText));

/* خصائص حديثة يعتمد عليها التصميم: لو سقطت في محرّك، سقط معها شيء مرئي */
const FEATURES = [
  ["color-mix", "color", "color-mix(in srgb, #000 50%, #fff)"],
  ["oklch", "color", "oklch(0.6 0.1 200)"],
  [":has()", null, null],
  ["backdrop-filter", "backdropFilter", "blur(4px)"],
  ["inset-block-start", "insetBlockStart", "4px"],
  ["adoptedStyleSheets", null, null],
  ["container-type", "containerType", "inline-size"],
  ["text-wrap: balance", "textWrap", "balance"],
];

for (const r of routes) {
  pageErrs = []; consoleErrs = []; failed = [];
  await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    document.querySelectorAll(".rv,[data-stagger]").forEach((e) => e.classList.add("in"));
    /* الحقن عبر CSSOM لأن style-src ترفض وسم <style> محقوناً. */
    const froze = new CSSStyleSheet();
    froze.replaceSync("*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important}");
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, froze];
  });
  await page.waitForTimeout(140);
  const out = await page.evaluate(() => {
    const res = { clipped: [], overflow: 0, brokenImg: [], missingFeat: [] };
    /* فيض أفقي بإشارتين */
    const de = document.documentElement;
    const byWidth = de.scrollWidth - de.clientWidth;
    const at = scrollX;
    scrollTo(9999, scrollY); const right = scrollX;
    scrollTo(-9999, scrollY); const left = scrollX;
    scrollTo(at, scrollY);
    res.overflow = Math.max(byWidth, Math.round(Math.max(Math.abs(right), Math.abs(left))));
    /* صور مكسورة */
    for (const img of document.images)
      if (img.complete && img.naturalWidth === 0 && img.currentSrc) res.brokenImg.push(img.currentSrc.slice(-60));
    /* نصّ مقصوص */
    const sel = (el) => !el ? "—" : el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/)[0] : "");
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walk.nextNode()); ) {
      const t = (n.nodeValue || "").trim();
      if (t.length < 2) continue;
      const host = n.parentElement;
      if (!host || host.closest('[data-marquee],.tick,.ticker,.pticker,.marq,.rail,.film,.sr-only,svg,.skip,.drawer,[aria-hidden="true"],[hidden]')) continue;
      let clip = host;
      const hid = (v) => v === "hidden" || v === "clip";
      const scrolls = (v) => v === "auto" || v === "scroll";
      while (clip && clip !== document.body) {
        const cs = getComputedStyle(clip);
        if ((hid(cs.overflowX) && !scrolls(cs.overflowY)) || (hid(cs.overflowY) && !scrolls(cs.overflowX))) break;
        clip = clip.parentElement;
      }
      if (!clip || clip === document.body) continue;
      const cr = clip.getBoundingClientRect();
      if (cr.height < 2) continue;
      const slack = Math.max(2, parseFloat(getComputedStyle(host).fontSize) * 0.12);
      const rg = document.createRange(); rg.selectNodeContents(n);
      for (const bb of rg.getClientRects()) {
        if (!bb.width || !bb.height) continue;
        const outX = Math.max(cr.left - bb.left, bb.right - cr.right);
        const outY = Math.max(cr.top - bb.top, bb.bottom - cr.bottom);
        if (outX > slack || outY > slack) { res.clipped.push(`${sel(host)} داخل ${sel(clip)} — ${Math.round(Math.max(outX, outY))}px · «${t.slice(0, 30)}»`); break; }
      }
      if (res.clipped.length > 6) break;
    }
    return res;
  });

  if (pageErrs.length) add("خطأ-JS", r, pageErrs[0]);
  /* /security تُنفّذ خمس هجمات على نفسها لتُري المتصفّح يرفضها، والهجمات تبدأ
     بضغطة زرّ — لا تُقيَّم من الخارج، لأن الفحص من خارج الصفحة يقيس سياقه هو.
     التوكيد هنا مقلوب: الرفض هو النجاح، وصمتُه هو العطل. */
  if (/(^|\/)security$/.test(r)) {
    const btn = await page.$("[data-sec-run]");
    if (!btn) add("أمان-بلا-زرّ", r, "لا [data-sec-run] على الصفحة");
    else {
      await btn.click();
      await page.waitForTimeout(900);
      const verdicts = await page.evaluate(() =>
        [...document.querySelectorAll(".seccheck__r")].map((x) => (x.textContent || "").trim()));
      const pending = verdicts.filter((v) => !v || /لم يُجرَ|not run yet/i.test(v));
      if (!verdicts.length) add("أمان-بلا-نتائج", r, "لا نتائج بعد الضغط");
      else if (pending.length) add("أمان-غير-مكتمل", r, `${pending.length} من ${verdicts.length} لم تُجرَ`);
    }
  } else if (consoleErrs.length) add("خطأ-كونسول", r, consoleErrs[0]);
  if (failed.length) add("طلب-فاشل", r, failed[0]);
  if (out.overflow > 1) add("فيض-أفقي", r, `${out.overflow}px`);
  for (const x of out.brokenImg) add("صورة-مكسورة", r, x);
  for (const x of out.clipped) add("نصّ-مقصوص", r, x);
}

/* دعم الخصائص — مرّة واحدة */
const feats = await page.evaluate((list) => {
  const out = [];
  for (const [name, prop, val] of list) {
    let ok;
    if (name === ":has()") { try { document.querySelector("html:has(body)"); ok = true; } catch { ok = false; } }
    else if (name === "adoptedStyleSheets") ok = "adoptedStyleSheets" in document;
    else ok = CSS.supports(prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()), val);
    if (!ok) out.push(name);
  }
  return out;
}, FEATURES);
for (const f of feats) add("خاصيّة-غير-مدعومة", "(المحرّك)", f);

const version = b.version();
await b.close();
proxy.close();

const uniq = new Map();
for (const f of findings) { const k = f.rule + "|" + f.detail.replace(/\d+/g, "N"); if (!uniq.has(k)) uniq.set(k, { ...f, routes: [] }); uniq.get(k).routes.push(f.route); }
console.log(`WebKit ${version} · ${routes.length} صفحة`);
if (!findings.length) { console.log("✔ WebKit يوافق Chromium — لا خطأ، ولا فيض، ولا نصّ مقصوص، ولا خاصيّة ساقطة"); process.exit(0); }
const byRule = {};
for (const u of uniq.values()) (byRule[u.rule] ||= []).push(u);
console.log(`✘ ${findings.length} مخالفة · ${uniq.size} حالة فريدة\n`);
for (const [rule, list] of Object.entries(byRule).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`■ ${rule} — ${list.length} حالة`);
  for (const u of list.slice(0, 10)) console.log(`   ${String(u.routes.length).padStart(3)} صفحة  ${u.detail}   [${u.routes[0]}]`);
  if (list.length > 10) console.log(`   … و${list.length - 10} أخرى`);
}
process.exit(1);
