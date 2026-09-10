/* أخطاء طباعة العربية، مقيسة على النص المرسوم لا على القواعد المكتوبة:
   1) letter-spacing على نص عربي   — يفكّ وصل الحروف (خطأ إملائي بصري)
   2) خط لاتيني/مونو على نص عربي   — يسقط لخط احتياطي غير متّسق
   3) text-transform على نص عربي   — بلا أثر، لكنه يشي بقاعدة مكتوبة للاتيني وطُبّقت على العربي */
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


const ROUTES = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8")).filter((r) => !r.startsWith("/en"));
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, bypassCSP: true });
const p = await ctx.newPage();

const SCAN = () => {
  const AR = /[ء-ي٠-٩۰-۹]/;
  const JOINING = /[ء-ي]/;            // حروف تتّصل — الأرقام لا تتّصل
  const out = [];
  const seen = new Set();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n, examined = 0;
  while ((n = w.nextNode())) {
    const t = (n.nodeValue || "").trim();
    if (!t || !AR.test(t)) continue;
    const el = n.parentElement;
    if (!el || el.closest("script,style,svg title")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    examined++;
    const fs = parseFloat(cs.fontSize) || 16;
    const ls = cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing) || 0;
    const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
    const path = (() => { let e = el, s = []; while (e && e !== document.body && s.length < 3) { s.unshift(e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\s+/)[0] : "")); e = e.parentElement; } return s.join(">"); })();
    const push = (kind, detail) => {
      const key = kind + "|" + path + "|" + detail;
      if (seen.has(key)) return; seen.add(key);
      out.push({ kind, path, detail, sample: t.slice(0, 40) });
    };
    if (ls > 0.01 && JOINING.test(t)) push("تباعد-حروف", `${(ls / fs).toFixed(3)}em (${ls.toFixed(2)}px)`);
    /* الوجه المرسوم، مقيساً لا مسؤولاً عنه: نرسم الحروف العربية وحدها مرّتين —
       بمكدّس العنصر، وبالوجه العربي الصريح — ونقارن العرض. fonts.check يكذب
       حين ينقص @font-face وصفُ unicode-range، أمّا العرض فلا يكذب. */
    const arOnly = t.replace(/[^ء-ي]/g, "").slice(0, 16);
    if (arOnly.length >= 3) {
      const mk = (fam) => {
        const sp = document.createElement("span");
        sp.textContent = arOnly;
        sp.style.cssText = `position:fixed;visibility:hidden;white-space:pre;font-size:${fs}px;font-weight:${cs.fontWeight};font-family:${fam}`;
        document.body.appendChild(sp);
        const w = sp.getBoundingClientRect().width; sp.remove(); return w;
      };
      const mine = mk(cs.fontFamily);
      /* الأوجه العربية المشروعة في الموقع: النصّي والعرضي. المطابقة لأيّها تكفي. */
      const cands = [["نصّي", mk("var(--font-ar)")], ["عرضي", mk("var(--font-display-ar)")]];
      const hit = cands.find(([, w]) => w > 0 && Math.abs(mine - w) / w <= 0.02);
      if (!hit) push("وجه-غير-عربي",
        `${cs.fontFamily.split(",")[0].replace(/["']/g, "")} · أقرب وجه عربي يبعد ${Math.min(...cands.map(([, w]) => Math.abs(mine - w) / w * 100)).toFixed(0)}%`);
    }
    if (cs.textTransform !== "none" && JOINING.test(t)) push("text-transform", cs.textTransform);
  }
  return { out, examined };
};

const all = []; let examined = 0;
for (const r of ROUTES) {
  await p.goto(BASE + r, { waitUntil: "domcontentloaded" });
  const { out, examined: e } = await p.evaluate(SCAN);
  examined += e;
  for (const o of out) all.push({ route: r, ...o });
}
await b.close();

const byKind = {};
for (const a of all) (byKind[a.kind] ||= []).push(a);
const uniq = new Map();
for (const a of all) { const k = a.kind + "|" + a.path + "|" + a.detail; if (!uniq.has(k)) uniq.set(k, { ...a, routes: [] }); uniq.get(k).routes.push(a.route); }
console.log(`فُحص ${examined} عقدة نصّية عربية على ${ROUTES.length} مسار`);
for (const [k, v] of Object.entries(byKind)) console.log(`  ${k}: ${v.length} إصابة، ${new Set(v.map(x => x.path + x.detail)).size} موضع فريد`);
if (!all.length) { console.log("✔ الطباعة العربية سليمة — لا تباعد يفكّ الوصل، ولا وجه غير عربي، ولا text-transform"); process.exit(0); }
console.log("─".repeat(60));
for (const u of [...uniq.values()].sort((a, b) => b.routes.length - a.routes.length)) {
  console.log(`${u.kind.padEnd(14)} ${String(u.routes.length).padStart(3)} صفحة  ${u.detail.padEnd(22)} ${u.path}`);
  console.log(`${" ".repeat(15)}«${u.sample}»`);
}
process.exit(1);
