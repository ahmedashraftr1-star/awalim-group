/* الاتجاه ثنائيّ النصّ، مقيساً على الرسم لا على النصّ.
   داخل فقرة عربية تكون الشرطة والنقطة والنقطتان محارف محايدة، والأرقام ضعيفة —
   فينقلب ترتيبها بصريّاً: 2026-09-07 تُرسم 07-09-2026، و10–15 تُرسم 15–10.
   لا تكفي قراءة المصدر: النصّ سليم والمرسوم مقلوب. لذا نقيس موضع أوّل جزء
   وآخر جزء بـ Range ونسأل أيّهما إلى اليسار. */
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


const routes = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8")).filter((r) => !r.startsWith("/en"));
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

const SCAN = () => {
  /* مقطعان لاتينيّان/رقميّان أو أكثر يفصلهما محايد */
  const PAT = /[0-9A-Za-z]+(?:[\s]?[-–—/.:،,][\s]?[0-9A-Za-z]+)+/g;
  const AR = /[ء-ي]/;
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n, checked = 0;
  while ((n = w.nextNode())) {
    const t = n.nodeValue || "";
    if (!AR.test(t)) continue;                       // المقطع خارج سياق عربي لا يهمّ
    const el = n.parentElement;
    if (!el || el.closest("script,style,pre,code")) continue;
    const cs = getComputedStyle(el);
    if (cs.direction !== "rtl" || cs.display === "none" || cs.visibility === "hidden") continue;
    for (const m of t.matchAll(PAT)) {
      const s = m.index, e = s + m[0].length;
      if (m[0].length < 3) continue;
      const seg = m[0];
      const cut = seg.search(/[-–—/.:،,]/);
      if (cut < 1) continue;
      checked++;
      const r1 = document.createRange(); r1.setStart(n, s); r1.setEnd(n, s + cut);
      const r2 = document.createRange(); r2.setStart(n, e - 1); r2.setEnd(n, e);
      const a = r1.getBoundingClientRect(), c = r2.getBoundingClientRect();
      if (!a.width || !c.width) continue;
      if (Math.abs(a.top - c.top) > 2) continue;     // انقسم على سطرين: لا حكم
      if (a.left > c.left) {                          /* الجزء الأوّل صار يمين الأخير ⇒ مقلوب */
        const path = (() => { let x = el, o = []; while (x && x !== document.body && o.length < 3) { o.unshift(x.tagName.toLowerCase() + (typeof x.className === "string" && x.className ? "." + x.className.trim().split(/\s+/)[0] : "")); x = x.parentElement; } return o.join(">"); })();
        out.push({ seg, path, ctx: t.trim().slice(Math.max(0, s - 18), e + 18) });
      }
    }
  }
  return { out, checked };
};

const all = []; let checked = 0;
for (const r of routes) {
  await p.goto(BASE + r, { waitUntil: "networkidle" });
  await p.waitForTimeout(250);   /* نصّ يُولَّد وقت التشغيل يصل متأخّراً */
  const { out, checked: c } = await p.evaluate(SCAN);
  checked += c;
  for (const o of out) all.push({ route: r, ...o });
}
await b.close();

const uniq = new Map();
for (const a of all) { const k = a.seg + "|" + a.path; if (!uniq.has(k)) uniq.set(k, { ...a, routes: [] }); uniq.get(k).routes.push(a.route); }
console.log(`فُحص ${checked} مقطعاً مركّباً داخل نصّ عربي على ${routes.length} مسار`);
if (!uniq.size) { console.log("✔ لا مقطع مقلوب"); process.exit(0); }
console.log(`✘ ${all.length} إصابة · ${uniq.size} مقطع فريد\n`);
for (const u of [...uniq.values()].sort((a, b) => b.routes.length - a.routes.length).slice(0, 25))
  console.log(`${String(u.routes.length).padStart(3)} صفحة  «${u.seg}»  ${u.path}\n${" ".repeat(11)}…${u.ctx}…`);
process.exit(1);
