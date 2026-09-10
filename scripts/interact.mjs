/* عناصر ميتة: أداة يُنقر عليها فلا يحدث شيء.
   فحص الأخطاء السابق قاس الكونسول والشبكة — وكلاهما صامت حين يكون الزرّ
   موجوداً وبلا معالج. هنا نضغط كل أداة ونسأل: هل تغيّر شيء يمكن قياسه؟
   الدليل على الحياة: aria تتبدّل، أو الصنف، أو الـDOM، أو التركيز، أو المسار. */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:8899";

/* خادم ميّت يظهر كانهيار في عمق أثر النداء فيُقرأ كعطل في الموقع وليس كذلك. */
try {
  const res = await fetch(BASE + "/", { method: "HEAD" });
  if (!res.ok && res.status !== 404) throw new Error("status " + res.status);
} catch (e) {
  console.error(`\n\u2716 لا خادم على ${BASE} — شغّله بـ \`npm run serve\` (أو \`npm run dev\` للبناء أوّلاً).\n   ${e.message}`);
  process.exit(1);
}


const routes = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8"));
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
page.on("dialog", (d) => d.dismiss().catch(() => {}));

const dead = [], errs = [];
let controls = 0;

for (const r of routes) {
  await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(120);
  const n = await page.evaluate(() => document.querySelectorAll(
    'button:not([disabled]), [role="button"], summary, [aria-expanded], [aria-controls], a[href^="#"]:not([href="#"])'
  ).length);
  for (let i = 0; i < n; i++) {
    const res = await page.evaluate(async (idx) => {
      const sel = 'button:not([disabled]), [role="button"], summary, [aria-expanded], [aria-controls], a[href^="#"]:not([href="#"])';
      const el = document.querySelectorAll(sel)[idx];
      if (!el) return null;
      const cs = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      const id = (el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "")).slice(0, 60);
      const label = (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 34);
      if (cs.display === "none" || cs.visibility === "hidden" || box.width < 1 || box.height < 1)
        return { skip: "مخفي", id, label };

      /* بصمة قبل النقر */
      const snap = () => JSON.stringify({
        aria: [...el.attributes].filter((a) => a.name.startsWith("aria-") || a.name.startsWith("data-")).map((a) => a.name + "=" + a.value),
        cls: el.className && typeof el.className === "string" ? el.className : "",
        html: document.body.innerHTML.length,
        /* بصمة محلّية إلى جانب العامّة: طول الصفحة كلّها عدد واحد، وتغييران
           متعاكسان في اللحظة نفسها يُلغي أحدهما الآخر فيه — وقد فعلا. */
        own: el.textContent.trim().slice(0, 60),
        url: location.href,
        panels: [...document.querySelectorAll('[aria-expanded="true"], .is-on, .is-open, [open]')].length,
      });
      /* المرساة تُقاس من موضع غير الصفر: زرّ «العودة إلى الأعلى» وأنت في الأعلى
         لا يفعل شيئاً بحقّ، وذلك سلوك سليم لا عطل. */
      if ((el.getAttribute("href") || "").startsWith("#")) { window.scrollTo(0, Math.min(900, document.documentElement.scrollHeight / 2)); await new Promise((r) => setTimeout(r, 60)); }
      const before = snap();
      let moved = false;
      const target = el.getAttribute("aria-controls") ? document.getElementById(el.getAttribute("aria-controls")) : null;
      const tBefore = target ? getComputedStyle(target).display + "|" + target.getBoundingClientRect().height : "";
      const scrollBefore = scrollY;
      const focusBefore = document.activeElement;

      el.click();
      await new Promise((r) => setTimeout(r, 90));

      const look = () => {
        const after = snap();
        const tAfter = target ? getComputedStyle(target).display + "|" + target.getBoundingClientRect().height : "";
        return before !== after || tBefore !== tAfter
          || document.activeElement !== focusBefore || Math.abs(scrollY - scrollBefore) > 2;
      };
      /* بعض الأدوات تنتظر وعداً (الحافظة مثلاً): لا يُحكم بالموت من نظرة واحدة */
      let alive = look();
      if (!alive) { await new Promise((r) => setTimeout(r, 300)); alive = look(); }
      /* وفلتر مفعّل أصلاً لا يتغيّر بالنقر عليه — وذلك صواب لا عطل */
      if (!alive && (el.getAttribute("aria-pressed") === "true" || /\bis-on\b|\bis-active\b/.test(el.className || ""))) return { skip: "مفعّل أصلاً" };
      /* أعِد الحال ما أمكن حتى لا يلوّث النقر التالي */
      if (!alive) return { dead: true, id, label, href: el.getAttribute("href") || "" };
      return { alive: true, id, label };
    }, i);
    if (!res) continue;
    if (res.skip) continue;
    controls++;
    if (res.dead) dead.push({ route: r, ...res });
  }
}
await b.close();

const uniq = new Map();
for (const d of dead) { const k = d.id + "|" + d.label; if (!uniq.has(k)) uniq.set(k, { ...d, routes: [] }); uniq.get(k).routes.push(d.route); }
console.log(`نُقر على ${controls} أداة مرئية في ${routes.length} صفحة`);
if (!uniq.size) { console.log("✔ لا أداة ميتة"); process.exit(0); }
console.log(`✘ ${dead.length} نقرة بلا أثر · ${uniq.size} أداة فريدة\n`);
for (const u of [...uniq.values()].sort((a, b) => b.routes.length - a.routes.length).slice(0, 25))
  console.log(`${String(u.routes.length).padStart(3)} صفحة  ${u.id.padEnd(38)} «${u.label}» ${u.href || ""}\n${" ".repeat(11)}${u.routes.slice(0, 3).join(" ")}`);
process.exit(1);
