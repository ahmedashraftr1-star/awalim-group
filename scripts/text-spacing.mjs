/* text-spacing.mjs — WCAG 2.1 SC 1.4.12 (تباعد النصّ) و SC 1.4.4 (تكبير النصّ 200%).
   الزائر الذي يصعب عليه القراءة يفرض تباعده الخاص، والصفحة يجب أن تحتمله:
   ارتفاع سطر 1.5×، تباعد حروف 0.12em، تباعد كلمات 0.16em، ومسافة فقرة 2em.
   ثم يكبّر النصّ وحده إلى 200% دون تكبير التخطيط.
   القياس: نصّ يُرسم خارج الصندوق الذي يقصّه، أو صفحة تفيض أفقياً.
   الحقن عبر CSSOM لا <style>: سياسة style-src ترفض الوسم المحقون. */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:8899";
try { const res = await fetch(BASE + "/", { method: "HEAD" }); if (!res.ok && res.status !== 404) throw new Error("status " + res.status); }
catch (e) { console.error(`\n✖ لا خادم على ${BASE} — \`npm run serve\`.\n   ${e.message}`); process.exit(1); }

const routes = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8"));
const b = await chromium.launch();

/* التباعد المفروض في نصّ المعيار حرفياً */
const SPACING = `* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
p, li, dd, dt, figcaption, blockquote { margin-block-end: 2em !important; }`;
/* التكبير: النصّ وحده، بلا تكبير التخطيط */
const ZOOM = `html { font-size: 200% !important; }`;

const MODES = [
  { key: "تباعد-1.4.12", css: SPACING, w: 1440 },
  { key: "تباعد-موبايل", css: SPACING, w: 390 },
  { key: "تكبير-200%",  css: ZOOM,    w: 1440 },
];

const findings = [], intermittent = [];
const add = (mode, route, kind, detail) => findings.push({ mode, route, kind, detail });
let checked = 0;

const SCAN = () => {
  const out = [];
  const sel = (el) => !el ? "—" : el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") +
    (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/)[0] : "");
  /* نصّ مرسوم خارج ما يقصّه */
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
      if (outX > slack || outY > slack) {
        /* المحور يُسمّى: «26px خارج» لا تقول إن كان النصّ يتجاوز عرض القاصّ أم
           ارتفاعه، والعلاج يختلف تماماً بين الحالتين — وقد أضعتُ وقتاً في
           إصلاح التفاف أفقي بينما التجاوز رأسي. */
        const axis = outY > outX ? "رأسياً" : "أفقياً";
        const dbg = window.__TSDEBUG ? ` ⟨قاصّ ${Math.round(cr.width)}×${Math.round(cr.height)} @${Math.round(cr.top)} · مضيف ${Math.round(host.getBoundingClientRect().width)}×${Math.round(host.getBoundingClientRect().height)} · أسطر ${rg.getClientRects().length} · خطّ ${getComputedStyle(host).fontFamily.split(",")[0]} · حجم ${getComputedStyle(host).fontSize} · قصّ ${getComputedStyle(clip).overflow}⟩` : "";
        out.push({ kind: "نصّ-مقصوص", detail: `${sel(host)} داخل ${sel(clip)} — ${Math.round(Math.max(outX, outY))}px ${axis} · «${t.slice(0, 34)}»${dbg}` });
        break;
      }
    }
  }
  /* فيض أفقي للمستند */
  const de = document.documentElement;
  const over = de.scrollWidth - de.clientWidth;
  if (over > 2) out.push({ kind: "فيض-أفقي", detail: `${over}px` });
  return out;
};

for (const mode of MODES) {
  const ctx = await b.newContext({ viewport: { width: mode.w, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
    await page.evaluate((css) => {
      const s = new CSSStyleSheet();          /* <style> محقون ترفضه style-src */
      s.replaceSync(css);
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, s];
    }, mode.css);
    /* عناصر الكشف عند التمرير تبدأ مُزاحة بـtranslateY — قياسها قبل ظهورها
       يقيس الحركة لا التخطيط، ويبلّغ عن «نصّ مقصوص» لا وجود له. */
    await page.evaluate(async () => {
      const H = document.documentElement.scrollHeight;
      for (let y = 0; y <= H; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 24)); }
      window.scrollTo(0, 0);
      document.querySelectorAll(".rv,[data-stagger]").forEach((e) => e.classList.add("in"));
    });
    /* الخطوط قبل القياس: نصّ يُقاس بوجه احتياطي ثم يُستبدل بالوجه الحقيقي
       يعطي عرضاً غير عرضه، فتظهر إصابات تختفي في التشغيلة التالية. الفحص
       المتقطّع أسوأ من غيابه لأنه يعلّم الفريق تجاهل الأحمر. */
    /* fonts.ready يَعِد بما هو معلّق، لا بما لم يُطلَب بعد: وجه فرعيّ لا
       يُطلَب إلا عند رسم محرف من نطاقه. نطلبها صراحةً ثم ننتظر. */
    await page.evaluate(async () => {
      const fams = ['1em "IBM Plex Mono"', '1em "IBM Plex Sans Arabic"', '1em "Archivo"', '1em "Alexandria"'];
      await Promise.all(fams.map((f) => document.fonts.load(f).catch(() => {})));
      await document.fonts.ready;
    }).catch(() => {});
    /* ثم يُنتظر استقرار التخطيط لا مهلة ثابتة: صفحة طويلة تُقاس قبل أن تهبط
       صورها وكشوفها تعطي صندوقاً أقصر من محتواه، فيبدو آخر سطر خارجاً منه.
       المهلة الثابتة تراهن على السرعة؛ الاستقرار يُقاس. */
    await page.evaluate(async () => {
      const de = document.documentElement;
      let last = -1, same = 0;
      /* حدّ أعلى ضيّق: حارس بطيء لا يُشغَّل، وفحص لا يُشغَّل لا يحمي. أمّا
         decode() على كل الصور فكان يعلّق على الكسولة منها التي لم تُطلَب أصلاً. */
      for (let i = 0; i < 10 && same < 2; i++) {
        await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 30)));
        const h = de.scrollHeight;
        same = h === last ? same + 1 : 0;
        last = h;
      }
    });
    if (process.env.TSDEBUG) await page.evaluate(() => { window.__TSDEBUG = 1; });
    let out = await page.evaluate(SCAN);
    /* لا يُحكم من لقطة واحدة: المسح يعيد استعمال صفحة واحدة عبر 82 تنقّلاً،
       وخطّ فرعيّ يصل متأخّراً أو تخطيط لم يستقرّ يُنتجان إصابة تختفي في
       التشغيلة التالية. ما ينجو من قياسين متباعدين هو وحده الذي يُبلَّغ عنه. */
    let flaky = [];
    if (out.length) {
      await page.evaluate(() => document.fonts.ready).catch(() => {});
      await page.waitForTimeout(520);
      const again = await page.evaluate(SCAN);
      const key = (o) => o.kind + "|" + o.detail.replace(/[\d.]+px/g, "Npx");
      const survived = new Set(again.map(key));
      /* ما لا ينجو لا يُسقَط بصمت: يُذكَر متقطّعاً. إصابة تظهر مرّة وتختفي
         مرّة قد تكون حالة حدّية حقيقية — والإسقاط الصامت يحوّل الأداة إلى
         مُطَمئِن بدل أن تكون فاحصاً. */
      flaky = out.filter((o) => !survived.has(key(o)));
      out = out.filter((o) => survived.has(key(o)));
    }
    checked++;
    const seen = new Set();
    for (const o of out) { const k = o.kind + o.detail; if (seen.has(k)) continue; seen.add(k); add(mode.key, r, o.kind, o.detail); }
    for (const o of flaky) { const k = "~" + o.kind + o.detail; if (seen.has(k)) continue; seen.add(k); intermittent.push({ mode: mode.key, route: r, kind: o.kind, detail: o.detail }); }
  }
  await ctx.close();
}
await b.close();

console.log(`${checked} قياساً · ${routes.length} صفحة × ${MODES.length} وضع (تباعد 1.4.12 ×2 عرض، وتكبير 200%)`);
const showFlaky = () => {
  if (!intermittent.length) return;
  console.log(`\n≈ ${intermittent.length} إصابة متقطّعة — ظهرت في قياس واحد ولم تنجُ من الثاني (لا تُفشِل، وتستحقّ النظر):`);
  const seenF = new Set();
  for (const f of intermittent) {
    const k = f.kind + f.detail.replace(/[\d.]+px/g, "Npx");
    if (seenF.has(k)) continue; seenF.add(k);
    console.log(`   ${f.mode} · ${f.kind} · ${f.detail}   [${f.route}]`);
  }
};
if (!findings.length) { console.log("✔ النصّ يحتمل تباعد المعيار وتكبير 200% بلا قصّ ولا فيض"); showFlaky(); process.exit(0); }
const uniq = new Map();
for (const f of findings) { const k = f.mode + "|" + f.kind + "|" + f.detail.replace(/\d+px/g, "Npx"); if (!uniq.has(k)) uniq.set(k, { ...f, routes: [] }); uniq.get(k).routes.push(f.route); }
console.log(`✘ ${findings.length} مخالفة · ${uniq.size} حالة فريدة\n`);
const byMode = {};
for (const u of uniq.values()) (byMode[u.mode + " · " + u.kind] ||= []).push(u);
for (const [k, list] of Object.entries(byMode).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`■ ${k} — ${list.length} حالة`);
  for (const u of list.slice(0, 10)) console.log(`   ${String(u.routes.length).padStart(3)} صفحة  ${u.detail}   [${u.routes[0]}]`);
  if (list.length > 10) console.log(`   … و${list.length - 10} أخرى`);
}
showFlaky();
process.exit(1);
