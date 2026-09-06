/* Render-level audit: measures the page as PAINTED, across every route in both
   themes and at both widths.

   scripts/contrast.mjs proves the colour tokens pair legally. It cannot see a
   legal token used on a surface it was never meant for — a card's near-white
   ink on a white column, or #fff on an accent that inverts in the dark. Those
   only exist once the cascade has run, so this walks the live DOM instead:
   it composites each element's real background the way the browser does, and
   also checks for text painted outside the box that clips it and for targets
   under the WCAG 2.2 minimum.

   Usage: node scripts/audit-render.mjs [routeFilter]   (expects a server at BASE) */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:8899";
const routes = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8"));
const only = process.argv[2] ? routes.filter((r) => r.includes(process.argv[2])) : routes;

const IN_PAGE = () => {
  /* a canvas normalises every CSS colour syntax — rgb(), color(srgb …), oklch() — to rgba */
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const cache = new Map();
  const parse = (v) => {
    if (cache.has(v)) return cache.get(v);
    ctx.fillStyle = "#000"; ctx.fillStyle = v;
    ctx.clearRect(0, 0, 1, 1); ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    const out = { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
    cache.set(v, out); return out;
  };
  const over = (s, d) => {                                   /* src OVER dst, keeping partial alpha */
    const a = s.a + d.a * (1 - s.a);
    if (!a) return { r: 0, g: 0, b: 0, a: 0 };
    return { r: (s.r * s.a + d.r * d.a * (1 - s.a)) / a, g: (s.g * s.a + d.g * d.a * (1 - s.a)) / a, b: (s.b * s.a + d.b * d.a * (1 - s.a)) / a, a };
  };
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const sel = (e) => {
    if (!e) return "—";
    const t = e.tagName.toLowerCase();
    if (e.id) return `${t}#${e.id}`;
    const c = e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className;
    return t + (typeof c === "string" && c.trim() ? "." + c.trim().split(/\s+/).slice(0, 2).join(".") : "");
  };
  const WHITE = { r: 255, g: 255, b: 255, a: 1 }, BLACK = { r: 0, g: 0, b: 0, a: 1 };

  /* Effective background: composite ancestors until opaque. `floats` means the
     stack passed a fixed/sticky box, so whatever scrolls under it is unknown. */
  const bgOf = (el) => {
    let acc = { r: 0, g: 0, b: 0, a: 0 }, node = el, floats = false;
    while (node) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage !== "none") return { img: true };   /* over art — not judgeable statically */
      const c = parse(cs.backgroundColor);
      if (c.a > 0) acc = over(acc, c);
      if (acc.a >= 0.995) return { bg: acc, floats };
      if (cs.position === "fixed" || cs.position === "sticky") floats = true;
      node = node.parentElement;
    }
    return { bg: over(acc, WHITE), floats, thin: true };
  };

  const out = [];
  const seen = new Set();
  const push = (o) => { const k = o.kind + o.sel + (o.text || "").slice(0, 24); if (!seen.has(k)) { seen.add(k); out.push(o); } };
  /* opacity is a group property: an element at 1 inside an ancestor at 0 is not
     painted at all, so the gate has to be the product up the tree. */
  const effOpacity = (el) => { let o = 1; for (let n = el; n; n = n.parentElement) { o *= parseFloat(getComputedStyle(n).opacity); if (o < 0.15) break; } return o; };
  const painted = (el, cs) => cs.display !== "none" && cs.visibility !== "hidden" && effOpacity(el) >= 0.15;

  /* 1. contrast, against the ground the text is actually painted on */
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (!painted(el, cs) || el.closest("[hidden],[aria-hidden=true]")) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const txt = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.nodeValue).join("").replace(/[⁦-⁩\s]+/g, " ").trim();
    if (!txt) continue;
    const b = bgOf(el);
    if (b.img) continue;
    const fg = parse(cs.color);
    const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight) || 400;
    const need = size >= 24 || (size >= 18.66 && weight >= 700) ? 3 : 4.5;
    /* a floating element must stay legible over anything that can scroll beneath it */
    const grounds = b.floats && b.bg.a < 0.995 ? [over(b.bg, WHITE), over(b.bg, BLACK)] : [b.bg];
    let worst = Infinity;
    for (const g of grounds) worst = Math.min(worst, ratio(fg.a < 1 ? over(fg, g) : fg, g));
    if (worst < need - 0.05) push({ kind: "contrast", sel: sel(el), parent: sel(el.parentElement), text: txt.slice(0, 44), got: `${worst.toFixed(2)}:1 (need ${need} at ${Math.round(size)}px) — ${cs.color} on rgb(${[b.bg.r, b.bg.g, b.bg.b].map(Math.round).join(",")})` });
  }

  /* 2. text painted outside the box that clips it */
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
    if (cr.height < 2) continue;                                /* collapsed panel */
    const slack = Math.max(2, parseFloat(getComputedStyle(host).fontSize) * 0.12);  /* line boxes sit taller than ink */
    const rg = document.createRange(); rg.selectNodeContents(n);
    for (const b of rg.getClientRects()) {
      if (!b.width || !b.height) continue;
      const outX = Math.max(cr.left - b.left, b.right - cr.right);
      const outY = Math.max(cr.top - b.top, b.bottom - cr.bottom);
      if (outX > slack || outY > slack) { push({ kind: "clipped", sel: sel(host), parent: sel(clip), text: t.slice(0, 40), got: `${Math.round(Math.max(outX, outY))}px outside` }); break; }
    }
  }

  /* 3. WCAG 2.2 2.5.8 target size (minimum) — inline links inside prose are exempt */
  for (const el of document.querySelectorAll("a[href],button,summary,[role=button],input:not([type=hidden]),select")) {
    const cs = getComputedStyle(el);
    if (!painted(el, cs) || el.closest(".sr-only,.prose p,.prose li,article p,article li")) continue;
    if (cs.display === "inline" && el.closest("p,li")) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (r.width < 24 || r.height < 24) push({ kind: "target", sel: sel(el), parent: sel(el.parentElement), text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 28), got: `${Math.round(r.width)}×${Math.round(r.height)} (min 24×24)` });
  }
  return out;
};

const browser = await chromium.launch();
const CONFIGS = [["light", 1440], ["dark", 1440], ["light", 390]];
const POOL = Number(process.env.POOL || 6);
const all = [];

/* one context per configuration, a pool of pages inside it — creating a context
   per page cost more than the measuring did */
const contexts = new Map();
for (const [theme, width] of CONFIGS)
  contexts.set(`${theme}@${width}`, await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: "reduce" }));

const transients = [];
const jobs = only.flatMap((r) => CONFIGS.map(([theme, width]) => ({ r, theme, width })));
let next = 0;
const worker = async () => {
  while (next < jobs.length) {
    const { r, theme, width } = jobs[next++];
    const page = await contexts.get(`${theme}@${width}`).newPage();
    try {
      /* attached before any page script runs, so a policy that blocks the site
         is a failing test rather than something a visitor finds. scripts/serve.mjs
         serves the real _headers, so this measures the policy we actually ship. */
      await page.addInitScript(() => {
        window.__csp = [];
        document.addEventListener("securitypolicyviolation", (e) => {
          window.__csp.push({ d: e.effectiveDirective || e.violatedDirective, b: e.blockedURI || "inline", s: e.sourceFile ? `${e.sourceFile.replace(/^https?:\/\/[^/]+/, "")}:${e.lineNumber}` : "", x: (e.sample || "").slice(0, 48) });
        });
      });
      await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
      await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
      /* touch the length of the page so scroll-triggered content exists, settle
         every reveal, then FREEZE. A fixed delay is not a settle: under a busy
         pool a .btn's background-color transition was still in flight, and half
         a fill composited over the dark hero behind it read 4.4:1 on an element
         that rests at 14.9:1. Measure the resting state or measure nothing. */
      await page.evaluate(async () => {
        const H = document.documentElement.scrollHeight;
        for (let y = 0; y <= H; y += Math.max(600, innerHeight)) { window.scrollTo(0, y); await new Promise((res) => setTimeout(res, 16)); }
        window.scrollTo(0, 0);
        document.querySelectorAll(".rv,[data-stagger]").forEach((e) => e.classList.add("in"));
        await document.fonts.ready;
      });
      await page.addStyleTag({ content: "*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important;}" });
      const settled = await page.evaluate(async () => {
        for (const a of document.getAnimations()) { try { a.finish(); } catch { a.cancel(); } }
        for (let i = 0; i < 40; i++) {
          await new Promise((res) => requestAnimationFrame(() => res()));
          if (!document.getAnimations().some((a) => a.playState === "running")) return true;
        }
        return false;
      });
      if (!settled) all.push({ route: r, theme, width, kind: "unsettled", sel: "document", parent: "—", text: "animations still running after the freeze", got: "measurement not trustworthy" });
      /* Confirm every finding in a second pass. A defect in the resting state is
         stable; anything that measured once and not again was a transient, and a
         gate that reports those gets ignored on the day it is right. */
      const first = await page.evaluate(IN_PAGE);
      if (first.length) {
        await page.evaluate(async () => { for (const a of document.getAnimations()) { try { a.finish(); } catch { a.cancel(); } } await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))); });
        const second = await page.evaluate(IN_PAGE);
        const key = (f) => `${f.kind}|${f.sel}|${f.text}`;
        const seen2 = new Set(second.map(key));
        for (const f of first) {
          if (seen2.has(key(f))) all.push({ route: r, theme, width, ...f });
          else transients.push(`${r} ${theme}@${width} ${f.kind} ${f.sel} «${f.text}» ${f.got}`);
        }
      }
      for (const v of await page.evaluate(() => window.__csp || []))
        all.push({ route: r, theme, width, kind: "csp", sel: v.d, parent: v.s || "—", text: v.b, got: v.x ? `blocked · sample «${v.x}»` : "blocked" });
    } finally {
      await page.close();
      process.stdout.write(".");
    }
  }
};
await Promise.all(Array.from({ length: POOL }, worker));
await browser.close();

console.log("");
if (transients.length) {
  console.log(`\n· ${transients.length} transient measurement(s) dropped — seen once, gone on re-measure, so not reported:`);
  for (const t of transients) console.log("  " + t);
}
for (const kind of ["csp", "unsettled", "contrast", "clipped", "target"]) {
  const list = all.filter((f) => f.kind === kind);
  if (!list.length) continue;
  console.log(`\n✖ ${kind} — ${list.length} instances`);
  const grouped = {};
  for (const f of list) (grouped[`${f.sel} in ${f.parent} · ${f.theme}@${f.width} · ${f.text}`] ||= []).push(f);
  for (const [key, l] of Object.entries(grouped).sort((a, b) => b[1].length - a[1].length))
    console.log(`  ${String(l.length).padStart(3)}×  ${key}  →  ${l[0].got}   [${l[0].route}]`);
}
if (all.length) { console.log(`\n✖ render audit: ${all.length} findings across ${only.length} routes`); process.exit(1); }
console.log(`✔ render audit clean — ${only.length} routes × light/dark/mobile: CSP, contrast, clipped text, target size`);
