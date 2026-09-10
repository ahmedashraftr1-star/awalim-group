/* keyboard.mjs — التنقّل بلوحة المفاتيح، مقيساً بضغط Tab فعلياً لا بقراءة DOM.
   ترتيب الجدولة يتأثّر بـ tabindex وبالإخفاء وبـ inert، ولا يظهر من الشجرة.
   يفحص:
     2.4.7  مؤشّر تركيز مرئي — نقارن نمط العنصر قبل التركيز وبعده
     2.4.11 التركيز غير محجوب — الترويسة اللاصقة تغطّي ما يُجدوَل تحتها،
            والمتصفّح يمرّر العنصر إلى الحافّة لا إلى ما تحت الترويسة
     2.1.2  لا مصيدة — الجدولة تخرج من كل عنصر إلى غيره
     رابط التخطّي يعمل ويصل إلى المحتوى */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:8899";
try {
  const res = await fetch(BASE + "/", { method: "HEAD" });
  if (!res.ok && res.status !== 404) throw new Error("status " + res.status);
} catch (e) {
  console.error(`\n✖ لا خادم على ${BASE} — شغّله بـ \`npm run serve\`.\n   ${e.message}`);
  process.exit(1);
}

const routes = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8"));
const MAX_TABS = Number(process.env.TABS || 70);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();

const findings = [];
const add = (rule, route, detail) => findings.push({ rule, route, detail });
let steps = 0;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

for (const r of routes) {
  await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(90);

  /* مرحلة أولى: بصمة كل عنصر وهو غير مركَّز، وترقيمه ترقيماً فريداً.
     لا نطفئ التركيز أثناء القياس لاحقاً: إطفاؤه وإعادته يلغي تمرير المتصفّح
     التلقائي، فيبدو رابط التخطّي — وهو ينزلق إلى الشاشة عند التركيز — خارجَها. */
  await page.evaluate((sel) => {
    window.__kb = {};
    /* البصمة تشمل ثلاثة أجداد: كثير من التصاميم ترسم حلقة التركيز على الغلاف
       لا على العنصر — والإدخال المخفي خلف تسمية مصمَّمة هو الحالة النموذجية. */
    const one = (el) => { const c = getComputedStyle(el);
      return [c.outlineStyle, c.outlineWidth, c.outlineColor, c.boxShadow, c.backgroundColor, c.borderColor, c.color, c.transform].join("|"); };
    const snap = (el) => { const out = []; let a = el, n = 0;
      while (a && n < 4) { out.push(one(a)); a = a.parentElement; n++; } return out.join("§"); };
    window.__snap = snap;
    document.querySelectorAll(sel).forEach((el, i) => { el.dataset.kbi = String(i); window.__kb[i] = snap(el); });
  }, FOCUSABLE);

  const seen = new Set();
  let prev = -1;
  for (let i = 0; i < MAX_TABS; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body || el === document.documentElement) return { end: true };
      const snap = window.__snap;
      const kbi = el.dataset.kbi === undefined ? -1 : Number(el.dataset.kbi);
      const box = el.getBoundingClientRect();
      const id = el.tagName.toLowerCase() + (el.id ? "#" + el.id : "")
        + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/)[0] : "");
      const label = (el.getAttribute("aria-label") || el.textContent || el.value || "").trim().slice(0, 30);
      let covered = null, offscreen = false;
      if (box.width > 0 && box.height > 0) {
        if (box.bottom < 0 || box.top > innerHeight || box.right < 0 || box.left > innerWidth) offscreen = true;
        else {
          const pts = [[box.left + 4, box.top + 3], [box.left + box.width / 2, box.top + 3],
                       [box.right - 4, box.top + 3], [box.left + box.width / 2, box.top + box.height / 2]];
          let hits = 0, by = "";
          for (const [x, y] of pts) {
            if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
            const top = document.elementFromPoint(x, y);
            if (!top || top === el || el.contains(top) || top.contains(el)) continue;
            let a = top, fixed = null;
            while (a) { const pos = getComputedStyle(a).position; if (pos === "fixed" || pos === "sticky") { fixed = a; break; } a = a.parentElement; }
            if (fixed) { hits++; by = by || (fixed.tagName.toLowerCase() + "." + (typeof fixed.className === "string" ? fixed.className.split(" ")[0] : "")); }
          }
          if (hits >= 3) covered = by;
        }
      }
      /* الشفافية تتراكم عبر الأجداد، ولا تُخرج العنصر من ترتيب الجدولة —
         فيقف التركيز على ما لا يُرى. هذا ما كان يفعله .subnav المخفيّ. */
      let op = 1, a2 = el;
      while (a2 && a2 !== document.documentElement) { op *= parseFloat(getComputedStyle(a2).opacity) || 0; a2 = a2.parentElement; }
      return { kbi, id, label, focused: snap(el), unfocused: window.__kb[kbi], covered, offscreen, op, w: Math.round(box.width), h: Math.round(box.height) };
    });

    if (info.end) break;
    steps++;
    if (info.kbi >= 0 && info.kbi === prev) { add("مصيدة-جدولة", r, `${info.id} «${info.label}»`); break; }
    if (info.kbi >= 0 && seen.has(info.kbi) && seen.size > 2) break;   /* دارت الحلقة: انتهت الجولة */
    if (info.kbi >= 0) seen.add(info.kbi);
    prev = info.kbi;
    if (info.unfocused !== undefined && info.focused === info.unfocused) add("تركيز-بلا-مؤشّر", r, `${info.id} «${info.label}»`);
    /* عنصر ينزلق إلى الشاشة بانتقال (رابط التخطّي مثلاً) يبدو غائباً في اللحظة
       الأولى. لا يُحكم من نظرة واحدة — نُعيد السؤال بعد أن يستقرّ. */
    let covered = info.covered, offscreen = info.offscreen;
    if (covered || offscreen) {
      await page.waitForTimeout(280);
      const again = await page.evaluate(() => {
        const el = document.activeElement; if (!el) return { offscreen: true, covered: null };
        const box = el.getBoundingClientRect();
        if (box.width === 0 || box.height === 0) return { offscreen: false, covered: null };
        if (box.bottom < 0 || box.top > innerHeight || box.right < 0 || box.left > innerWidth) return { offscreen: true, covered: null };
        const pts = [[box.left + 4, box.top + 3], [box.left + box.width / 2, box.top + 3],
                     [box.right - 4, box.top + 3], [box.left + box.width / 2, box.top + box.height / 2]];
        let hits = 0, by = "";
        for (const [x, y] of pts) {
          if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
          const top = document.elementFromPoint(x, y);
          if (!top || top === el || el.contains(top) || top.contains(el)) continue;
          let a = top, fixed = null;
          while (a) { const pos = getComputedStyle(a).position; if (pos === "fixed" || pos === "sticky") { fixed = a; break; } a = a.parentElement; }
          if (fixed) { hits++; by = by || (fixed.tagName.toLowerCase() + "." + (typeof fixed.className === "string" ? fixed.className.split(" ")[0] : "")); }
        }
        return { offscreen: false, covered: hits >= 3 ? by : null };
      });
      covered = again.covered; offscreen = again.offscreen;
    }
    if (covered) add("تركيز-محجوب", r, `${info.id} «${info.label}» ← ${covered}`);
    if (offscreen) add("تركيز-خارج-النافذة", r, `${info.id} «${info.label}»`);
    if (info.w === 0 || info.h === 0) add("تركيز-على-مخفي", r, `${info.id} «${info.label}»`);
    /* عنصر شفّاف مقبول إن ظهر التركيز على غلافه — وهو نمط الإدخال المخفي خلف
       تسمية مصمَّمة. غير مقبول إن لم يتغيّر شيء في السلسلة كلّها. */
    if (info.op < 0.1 && info.focused === info.unfocused)
      add("تركيز-على-شفّاف-بلا-أثر", r, `${info.id} «${info.label}»`);
  }

  /* رابط التخطّي يُفحص على صفحة جديدة: التركيز بعد الجولة السابقة عميق في
     الصفحة، وضغط Tab من هناك لا يقيس أوّل عنصر بل ما يليه. */
  await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
  /* والصفحة ممرَّرة: هذه حالة الاستعمال الحقيقية — من قرأ نصف الصفحة ثم جدول. */
  await page.evaluate(() => window.scrollTo(0, Math.min(600, document.documentElement.scrollHeight / 3)));
  await page.keyboard.press("Tab");
  await page.waitForTimeout(260);          /* الرابط ينزلق بانتقال 0.2s */
  const skip = await page.evaluate(() => {
    const a = document.activeElement;
    if (!a || a.tagName !== "A" || !(a.getAttribute("href") || "").startsWith("#")) return { ok: false, why: `أوّل عنصر ${a ? a.tagName.toLowerCase() : "لا شيء"} وليس رابط تخطٍّ` };
    const t = document.getElementById((a.getAttribute("href") || "").slice(1));
    if (!t) return { ok: false, why: "هدف التخطّي غير موجود: " + a.getAttribute("href") };
    const box = a.getBoundingClientRect();
    if (box.bottom < 0 || box.top > innerHeight) return { ok: false, why: "الرابط لا يظهر عند التركيز عليه" };
    return { ok: true };
  });
  if (!skip.ok) add("رابط-التخطّي", r, skip.why);
}
await b.close();

const uniq = new Map();
for (const f of findings) { const k = f.rule + "|" + f.detail; if (!uniq.has(k)) uniq.set(k, { ...f, routes: [] }); uniq.get(k).routes.push(f.route); }
console.log(`${steps} خطوة جدولة على ${routes.length} صفحة (حتى ${MAX_TABS} لكل صفحة)`);
if (!findings.length) { console.log("✔ لوحة المفاتيح سليمة — مؤشّر مرئي، بلا حجب، بلا مصيدة، ورابط تخطٍّ يعمل"); process.exit(0); }
const byRule = {};
for (const u of uniq.values()) (byRule[u.rule] ||= []).push(u);
console.log(`✘ ${findings.length} مخالفة · ${uniq.size} حالة فريدة\n`);
for (const [rule, list] of Object.entries(byRule).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`■ ${rule} — ${list.length} حالة`);
  for (const u of list.slice(0, 10)) console.log(`   ${String(u.routes.length).padStart(3)} صفحة  ${u.detail}`);
  if (list.length > 10) console.log(`   … و${list.length - 10} أخرى`);
}
process.exit(1);
