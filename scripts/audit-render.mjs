/* Render-level audit: measures the page as PAINTED, across every route in both
   themes and at both widths.

   scripts/contrast.mjs proves the colour tokens pair legally. It cannot see a
   legal token used on a surface it was never meant for — a card's near-white
   ink on a white column, or #fff on an accent that inverts in the dark. Those
   only exist once the cascade has run, so this walks the live DOM instead:
   it composites each element's real background the way the browser does, and
   also checks text painted outside the box that clips it, targets under the
   WCAG 2.2 minimum, duplicate ids, aria references pointing at nothing, and
   interactive elements a screen reader could not announce. Every check is
   asserted to have actually run — see the instrumentation findings.

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
  /* 4. structural defects with no judgement in them: a duplicate id silently
     redirects every fragment link and aria reference that points at it to the
     first match, and a reference to an id that does not exist names nothing. */
  const idCount = new Map();
  for (const el of document.querySelectorAll("[id]")) idCount.set(el.id, (idCount.get(el.id) || 0) + 1);
  for (const [id, n] of idCount)
    if (n > 1) push({ kind: "duplicate-id", sel: "#" + id, parent: "document", text: `${n} elements share it`, got: "fragment links and aria references resolve to the first only" });

  for (const attr of ["aria-labelledby", "aria-describedby", "aria-controls", "aria-owns", "for"]) {
    for (const el of document.querySelectorAll(`[${attr}]`)) {
      if (attr === "for" && el.tagName !== "LABEL") continue;
      for (const ref of (el.getAttribute(attr) || "").split(/\s+/).filter(Boolean))
        if (!document.getElementById(ref)) push({ kind: "dangling-ref", sel: sel(el), parent: attr, text: ref, got: "no element has this id" });
    }
  }

  /* 5. an interactive element a screen reader cannot announce */
  for (const el of document.querySelectorAll("a[href],button,[role=button],input:not([type=hidden]),select,textarea,summary")) {
    const cs = getComputedStyle(el);
    if (!painted(el, cs) || el.closest("[aria-hidden=true],[hidden]")) continue;
    const byIds = (v) => (v || "").split(/\s+/).filter(Boolean).map((id) => ((document.getElementById(id) || {}).textContent || "")).join(" ");
    const img = el.querySelector("img[alt]");
    const wrapping = el.closest("label");
    const name = [
      el.getAttribute("aria-label"),
      byIds(el.getAttribute("aria-labelledby")),
      el.textContent,
      img && img.alt,
      el.getAttribute("title"),
      el.getAttribute("placeholder"),
      el.id ? ((document.querySelector(`label[for="${CSS.escape(el.id)}"]`) || {}).textContent || "") : "",
      wrapping && wrapping !== el ? wrapping.textContent : "",
    ].map((x) => (x || "").trim()).find(Boolean);
    if (!name) push({ kind: "no-name", sel: sel(el), parent: sel(el.parentElement), text: el.outerHTML.replace(/\s+/g, " ").slice(0, 58), got: "interactive element a screen reader cannot announce" });
  }

  /* an object, not the array with a property hung off it: page.evaluate
     serialises arrays by index and drops everything else, so `examined` never
     arrived — the check caught its own first draft. The count is returned so
     the driver can tell a clean page from one that was never examined; a walk
     that finds nothing reports exactly like a walk that finds nothing wrong. */
  return { findings: out, examined: document.querySelectorAll("p,h1,h2,h3,li,span,a,b").length };
};

/* A dead server surfaces as a networkidle timeout or ERR_CONNECTION_REFUSED
   deep in a stack trace, which reads like a site failure and is not one. */
try {
  const res = await fetch(BASE + "/", { method: "HEAD" });
  if (!res.ok && res.status !== 404) throw new Error("status " + res.status);
} catch (e) {
  console.error(`\n\u2716 no server at ${BASE} \u2014 start one with \`npm run serve\` (or \`npm run dev\` to build first).\n   ${e.message}`);
  process.exit(1);
}

const browser = await chromium.launch();
/* The fourth and fifth are prefers-reduced-transparency, where the glass
   surfaces turn OPAQUE --surface instead of translucent. That is a different
   composite, not a thinner one, and it is the state most likely to hide a
   contrast failure — text tuned against blurred page content sitting on a flat
   panel instead. Playwright has no context option for it, so it is emulated per
   page over CDP and then ASSERTED, because a media emulation that silently
   fails gives a whole configuration that measures nothing. */
const CONFIGS = [
  { theme: "light", width: 1440 },
  { theme: "dark", width: 1440 },
  { theme: "light", width: 390 },
  { theme: "light", width: 1440, rt: true },
  { theme: "dark", width: 1440, rt: true },
];
const ckey = (c) => `${c.theme}@${c.width}${c.rt ? "+rt" : ""}`;
const POOL = Number(process.env.POOL || 6);
const all = [];

/* one context per configuration, a pool of pages inside it — creating a context
   per page cost more than the measuring did */
const contexts = new Map();
for (const c of CONFIGS)
  contexts.set(ckey(c), await browser.newContext({ viewport: { width: c.width, height: 900 }, colorScheme: c.theme, reducedMotion: "reduce" }));

/* WHAT page.evaluate DOES AND DOES NOT INHERIT — measured against the real
   policy, because getting this wrong invalidates a test silently.
   CDP-initiated script execution is debugger-initiated, so ONLY the direct
   script-execution path escapes the policy:
       eval("1+1")            ran      ← bypassed, cannot be tested this way
       new Function(...)      ran      ← bypassed
       el.innerHTML = str     TypeError    (Trusted Types, enforced)
       script.textContent     TypeError    (Trusted Types, enforced)
       script.src = foreign   TypeError    (Trusted Types, enforced)
       <style> element        blocked      (style-src, enforced)
       style attribute        not applied  (style-src, enforced)
       CSSOM adopted sheet    APPLIED      (not governed by style-src at all)
       foreign <img>          blocked      (img-src, enforced)
       foreign fetch()        blocked      (connect-src, enforced)
   So the freeze above goes in through CSSOM by mechanism, not by privilege —
   a <style> element from this very context is refused. And a probe of eval or
   Function must be driven by the PAGE's own script, never evaluated into it,
   which is why /security is exercised by clicking its button. */

/* /security attacks itself and the browser refuses it, so the route produces
   CSP violations by design. Excluding it would leave the one page that proves
   the policy is ENFORCING rather than merely present permanently unchecked, so
   the assertion is inverted there instead: run the probes, require every one to
   be refused, and still fail on any violation outside the expected set. */
const isSecurityRoute = (r) => /(^|\/)security$/.test(r);
const EXPECTED_ON_SECURITY = /^(script-src|script-src-elem|script-src-attr|style-src|style-src-elem|require-trusted-types-for|trusted-types)/;

const transients = [];
const jobs = only.flatMap((r) => CONFIGS.map((c) => ({ r, ...c })));
let next = 0;
const worker = async () => {
  while (next < jobs.length) {
    const job = jobs[next++];
    const { r, theme, width, rt } = job;
    const page = await contexts.get(ckey(job)).newPage();
    try {
      if (rt) {
        /* setEmulatedMedia replaces the whole feature list, so the ones
           Playwright already set have to be restated or they are dropped */
        const cdp = await page.context().newCDPSession(page);
        await cdp.send("Emulation.setEmulatedMedia", { features: [
          { name: "prefers-color-scheme", value: theme },
          { name: "prefers-reduced-motion", value: "reduce" },
          { name: "prefers-reduced-transparency", value: "reduce" },
        ] });
      }
      /* attached before any page script runs, so a policy that blocks the site
         is a failing test rather than something a visitor finds. scripts/serve.mjs
         serves the real _headers, so this measures the policy we actually ship. */
      await page.addInitScript(() => {
        window.__csp = [];
        window.__cssFail = [];
        addEventListener("error", (e) => { const t = e.target; if (t && t.tagName === "LINK") window.__cssFail.push(t.href); }, true);
        document.addEventListener("securitypolicyviolation", (e) => {
          window.__csp.push({ d: e.effectiveDirective || e.violatedDirective, b: e.blockedURI || "inline", s: e.sourceFile ? `${e.sourceFile.replace(/^https?:\/\/[^/]+/, "")}:${e.lineNumber}` : "", x: (e.sample || "").slice(0, 48) });
        });
      });
      await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
      await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
      if (rt && !(await page.evaluate(() => matchMedia("(prefers-reduced-transparency: reduce)").matches))) {
        all.push({ route: r, theme, width, rt, kind: "emulation", sel: "prefers-reduced-transparency", parent: "—", text: "the media emulation did not take", got: "this configuration measured nothing" });
        continue;
      }
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
      /* Every declared stylesheet must actually be APPLIED before anything is
         measured. A sheet that never lands does not produce one finding, it
         manufactures a page of them — a CSP that blocked the stylesheet swap
         once made a 40×40 footer link measure 17×25 at its intrinsic size, and
         reporting that as a target-size defect would have sent someone to fix
         CSS that was already correct. */
      const unstyled = await page.evaluate(async () => {
        /* Three signals, because none alone is sufficient: a link whose href
           404s still appears in document.styleSheets, and reading its cssRules
           throws SecurityError rather than returning zero — so "it has rules"
           cannot be the test. A load error is definitive; a link still sitting
           at rel="preload" was never swapped; a rel="stylesheet" with a null
           .sheet never landed. */
        const css = () => [...document.querySelectorAll('link[as="style"],link[rel="stylesheet"]')];
        const broken = () => {
          const failed = new Set(window.__cssFail || []);
          return css().filter((l) => failed.has(l.href) || l.rel === "preload" || !l.sheet);
        };
        for (let i = 0; i < 60; i++) {
          if (!broken().length) return null;
          await new Promise((res) => setTimeout(res, 50));
        }
        return broken().map((l) => `${l.href.replace(/^https?:\/\/[^/]+/, "")} (rel=${l.rel}${(window.__cssFail || []).includes(l.href) ? ", load error" : l.sheet ? "" : ", no sheet"})`);
      });
      /* A constructed stylesheet, not addStyleTag: style-src carries no
         'unsafe-inline' any more, so injecting a <style> element is refused by
         the very policy this audit exists to verify. CSSOM is not governed by
         style-src — only <style> elements, style attributes and @import are. */
      await page.evaluate((css) => {
        try {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(css);
          document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
        } catch {
          const sheet = document.styleSheets[0];
          if (sheet) for (const rule of css.split("}").filter(Boolean)) { try { sheet.insertRule(rule + "}", sheet.cssRules.length); } catch {} }
        }
      }, "*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important;}");
      /* the freeze has to be proven, not attempted: if the injection stops
         working the audit would measure a moving page and still report clean */
      const frozen = await page.evaluate(() => {
        const el = document.querySelector(".btn, a, p") || document.body;
        return getComputedStyle(el).transitionDuration.split(",").every((d) => parseFloat(d) === 0);
      });
      if (!frozen) all.push({ route: r, theme, width, rt, kind: "instrumentation", sel: "freeze", parent: "—", text: "transitions still running after the freeze", got: "the page was measured while moving" });
      const settled = await page.evaluate(async () => {
        for (const a of document.getAnimations()) { try { a.finish(); } catch { a.cancel(); } }
        for (let i = 0; i < 40; i++) {
          await new Promise((res) => requestAnimationFrame(() => res()));
          if (!document.getAnimations().some((a) => a.playState === "running")) return true;
        }
        return false;
      });
      if (!settled) all.push({ route: r, theme, width, rt, kind: "unsettled", sel: "document", parent: "—", text: "animations still running after the freeze", got: "measurement not trustworthy" });
      if (unstyled) {
        for (const href of unstyled) all.push({ route: r, theme, width, rt, kind: "stylesheet", sel: "link", parent: "head", text: href, got: "declared but never applied — measurement suppressed for this page" });
        for (const v of await page.evaluate(() => window.__csp || []))
          all.push({ route: r, theme, width, rt, kind: "csp", sel: v.d, parent: v.s || "—", text: v.b, got: v.x ? `blocked · sample «${v.x}»` : "blocked" });
        continue;
      }
      if (isSecurityRoute(r)) {
        /* the page auto-runs on an IntersectionObserver, but only when the
           visitor has not asked for reduced motion — which this audit always
           does — so drive it explicitly rather than depending on a scroll */
        const verdict = await page.evaluate(async () => {
          const root = document.querySelector("[data-sec]");
          if (!root) return { error: "no [data-sec] root on the page" };
          const btn = root.querySelector("[data-sec-run]");
          if (!btn) return { error: "no [data-sec-run] control" };
          btn.click();
          const out = root.querySelector("[data-sec-out]");
          for (let i = 0; i < 160; i++) {
            if (out && /\bis-(ok|bad)\b/.test(out.className)) break;
            await new Promise((res) => setTimeout(res, 50));
          }
          const items = [...root.querySelectorAll(".seccheck")].map((li) => ({
            id: li.id, ok: li.classList.contains("is-ok"), bad: li.classList.contains("is-bad"),
            label: (li.querySelector("b") || {}).textContent || "", detail: (li.querySelector(".seccheck__r") || {}).textContent || "",
          }));
          return { items, summary: out ? out.className : "", settled: out ? /\bis-(ok|bad)\b/.test(out.className) : false };
        });
        if (verdict.error) all.push({ route: r, theme, width, rt, kind: "security", sel: "[data-sec]", parent: "—", text: verdict.error, got: "the self-attack page could not be driven" });
        else if (!verdict.settled) all.push({ route: r, theme, width, rt, kind: "security", sel: "[data-sec-out]", parent: "—", text: "probes never reported a verdict", got: `${verdict.items.filter((i) => i.ok || i.bad).length}/${verdict.items.length} settled` });
        else {
          if (verdict.items.length < 5) all.push({ route: r, theme, width, rt, kind: "security", sel: ".seccheck", parent: "—", text: "fewer probes than expected", got: `${verdict.items.length} (want 5)` });
          for (const it of verdict.items)
            if (!it.ok) all.push({ route: r, theme, width, rt, kind: "security", sel: "#" + it.id, parent: "—", text: it.label.trim(), got: `NOT REFUSED — ${it.detail.trim()}` });
          if (!/\bis-ok\b/.test(verdict.summary)) all.push({ route: r, theme, width, rt, kind: "security", sel: "[data-sec-out]", parent: "—", text: "summary does not report a clean sweep", got: verdict.summary });
        }
      }
      /* Confirm every finding in a second pass. A defect in the resting state is
         stable; anything that measured once and not again was a transient, and a
         gate that reports those gets ignored on the day it is right. */
      const { findings: first, examined } = await page.evaluate(IN_PAGE);
      if (!(examined > 20)) all.push({ route: r, theme, width, rt, kind: "instrumentation", sel: "IN_PAGE", parent: "—", text: "almost nothing to examine on this page", got: `${examined || 0} text elements` });
      if (first.length) {
        await page.evaluate(async () => { for (const a of document.getAnimations()) { try { a.finish(); } catch { a.cancel(); } } await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))); });
        const { findings: second } = await page.evaluate(IN_PAGE);
        const key = (f) => `${f.kind}|${f.sel}|${f.text}`;
        const seen2 = new Set(second.map(key));
        for (const f of first) {
          if (seen2.has(key(f))) all.push({ route: r, theme, width, rt, ...f });
          else transients.push(`${r} ${theme}@${width} ${f.kind} ${f.sel} «${f.text}» ${f.got}`);
        }
      }
      if (!(await page.evaluate(() => Array.isArray(window.__csp)))) all.push({ route: r, theme, width, rt, kind: "instrumentation", sel: "window.__csp", parent: "—", text: "the violation listener was never installed", got: "CSP violations on this page went uncollected" });
      for (const v of await page.evaluate(() => window.__csp || [])) {
        if (isSecurityRoute(r) && EXPECTED_ON_SECURITY.test(v.d || "")) continue;   /* the page is supposed to trip these */
        all.push({ route: r, theme, width, rt, kind: "csp", sel: v.d, parent: v.s || "—", text: v.b, got: v.x ? `blocked · sample «${v.x}»` : "blocked" });
      }
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
for (const kind of ["instrumentation", "emulation", "security", "stylesheet", "csp", "unsettled", "duplicate-id", "dangling-ref", "no-name", "contrast", "clipped", "target"]) {
  const list = all.filter((f) => f.kind === kind);
  if (!list.length) continue;
  console.log(`\n✖ ${kind} — ${list.length} instances`);
  const grouped = {};
  for (const f of list) (grouped[`${f.sel} in ${f.parent} · ${f.theme}@${f.width} · ${f.text}`] ||= []).push(f);
  for (const [key, l] of Object.entries(grouped).sort((a, b) => b[1].length - a[1].length))
    console.log(`  ${String(l.length).padStart(3)}×  ${key}  →  ${l[0].got}   [${l[0].route}]`);
}
if (all.length) { console.log(`\n✖ render audit: ${all.length} findings across ${only.length} routes`); process.exit(1); }
console.log(`✔ render audit clean — ${only.length} routes × light/dark/mobile/reduced-transparency: CSP, contrast, clipped text, target size, duplicate ids, dangling aria refs, accessible names`);
