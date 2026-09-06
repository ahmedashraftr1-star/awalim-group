/* End-to-end checks for the core routes (section 13/14):
   - every route answers 200, has one <h1>, no console errors, no page errors
   - no horizontal overflow at 390px and 1440px
   - theme toggle, drawer, filters, accordion, side index, multi-step form
   Usage: node scripts/e2e.mjs   (expects a static server at BASE) */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:8899";
const routes = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8"));
let failures = 0;
const ok = (cond, msg) => { if (cond) console.log("  ✔", msg); else { failures++; console.log("  ✖", msg); } };

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

for (const r of routes) {
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error" && !(r === "/404" && /404/.test(m.text()))) errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
    const res = await page.goto(BASE + r, { waitUntil: "networkidle" });
    console.log(`${r} @${vp.width}`);
    ok(res && (res.status() === 200 || (r === "/404" && res.status() === 404)), `status ${res && res.status()}`);
    ok((await page.locator("h1").count()) === 1, "exactly one h1");
    ok(errors.length === 0, errors.length ? "console: " + errors.slice(0, 3).join(" | ") : "no console errors");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(overflow <= 1, `no horizontal overflow (${overflow}px)`);
    await ctx.close();
  }
}

/* interactions on the home page */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  console.log("interactions: home");
  const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  await page.click("[data-theme-toggle]");
  const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  ok(before !== after, `theme toggle ${before} → ${after}`);
  ok(await page.evaluate(() => localStorage.getItem("awalim-theme")) === after, "theme persisted");
  await page.click(".acc__q >> nth=0");
  await page.waitForTimeout(500);
  ok(await page.locator(".acc__it.is-open").count() === 1, "accordion opens");
  const stat = await page.locator(".statbar [data-count] >> nth=0").textContent();
  ok(/\d/.test(stat), "count-up rendered a number: " + stat);
  await ctx.close();
}
/* mobile drawer */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  console.log("interactions: drawer");
  await page.click("[data-drawer-open]");
  await page.waitForTimeout(400);
  ok(await page.getAttribute("#drawer", "data-open") === "true", "drawer opens");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  ok(await page.getAttribute("#drawer", "data-open") === "false", "drawer closes on Escape");
  await ctx.close();
}
/* work filters + side index */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/work", { waitUntil: "networkidle" });
  console.log("interactions: work");
  await page.click('[data-filter="brand"]');
  const shown = await page.locator('#work-list [data-cat]:not([hidden])').count();
  ok(shown > 0 && shown < 7, `filter brand shows ${shown} cards`);
  await page.click('[data-filter="all"]');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));
  await page.waitForTimeout(600);
  ok(await page.locator('.sideidx a[aria-current="true"]').count() === 1, "side index marks a current section");
  await ctx.close();
}
/* contact multi-step form */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
  console.log("interactions: contact form");
  await page.click("[data-msf-next]");
  ok(!(await page.locator('[data-err-for="scope"]').isHidden()), "step 1 validation blocks empty type");
  await page.click(".opt >> nth=0");
  await page.click("[data-msf-next]");
  ok(await page.locator('[data-step="1"]').isVisible(), "advanced to step 2");
  await page.click("[data-msf-next]");
  await page.fill("#f-msg", "لدينا عملية فوترة يدوية تستهلك يومين شهرياً ونريد أتمتتها.");
  await page.click("[data-msf-next]");
  ok(await page.locator('[data-step="3"]').isVisible(), "advanced to step 4");
  await page.fill("#f-name", "اختبار");
  await page.fill("#f-email", "test@example.com");
  ok(await page.locator("[data-msf-submit]").isVisible(), "submit visible on last step");
  ok(!(await page.locator("[data-msf-review]").isHidden()), "review summary rendered");
  await ctx.close();
}

/* ⌘K palette */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/services", { waitUntil: "networkidle" });
  console.log("interactions: palette");
  await page.keyboard.press("Control+k");
  await page.waitForTimeout(300);
  ok(await page.locator("[data-palette]").isVisible(), "palette opens with Ctrl+K");
  await page.fill("[data-pal-input]", "رحمه");
  await page.waitForTimeout(400);
  const first = await page.locator(".pal__it").first().locator(".pal__t").textContent();
  ok(/RahmaCare/.test(first || ""), "Arabic-normalised query «رحمه» (no tashkeel/ة) finds RahmaCare: " + first);
  await page.fill("[data-pal-input]", "ifrs");
  await page.waitForTimeout(300);
  ok((await page.locator(".pal__it").count()) > 0, "latin query finds results");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  ok(await page.locator("[data-palette]").isHidden(), "palette closes on Escape");
  await ctx.close();
}
/* signed numbers — verification runs in the browser */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/verify", { waitUntil: "networkidle" });
  console.log("interactions: verify");
  await page.waitForSelector('[data-check="dom"].is-ok, [data-check="dom"].is-fail', { timeout: 8000 }).catch(() => {});
  for (const k of ["hash", "sig", "key", "dom"]) ok(await page.locator(`[data-check="${k}"].is-ok`).count() === 1, `check ${k} passes in-browser`);
  const out = await page.locator("[data-verify-out]").textContent();
  ok(/نجحت/.test(out || ""), "verification summary: " + (out || "").slice(0, 60));
  await ctx.close();
}
/* live ledger in the hero */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  console.log("interactions: ledger");
  const N = page.locator("[data-ledger] [data-ledger-n]").first();   // the home page also renders a static cockpit in Selected Work
  const n0 = +(await N.textContent());
  await page.click('[data-ledger-action="scan"]', { force: true });   // the hero card floats; force skips the stability wait
  await page.waitForSelector('[data-ledger-action="approve"]', { timeout: 6000 });
  ok(/متوازن ✓/.test(await page.locator(".ledger__je-hd").textContent()), "proposed entry is balanced (dr = cr computed)");
  const exp0 = (await page.locator('[data-ledger] [data-k="exp"]').first().textContent()).replace(/\D/g, "");
  await page.click('[data-ledger-action="approve"]', { force: true });
  await page.waitForTimeout(1200);
  const n1 = +(await N.textContent());
  const exp1 = (await page.locator('[data-ledger] [data-k="exp"]').first().textContent()).replace(/\D/g, "");
  ok(n1 === n0 + 1, `entry number advanced ${n0} → ${n1}`);
  ok(+exp1 === +exp0 + 1000, `expenses posted +1,000 (${exp0} → ${exp1})`);
  ok(await page.locator("[data-ledger-proposal]").isHidden(), "proposal closed after posting");
  /* self-audit readouts filled */
  await page.mouse.move(200, 200); await page.mouse.click(200, 200);
  await page.waitForTimeout(800);
  const lcp = await page.locator('[data-audit="lcp"] b >> nth=0').textContent();
  ok(/\d/.test(lcp || ""), "live LCP readout: " + lcp);
  const c = await page.locator('[data-audit="contrast"] b').textContent();
  ok(/:1/.test(c || ""), "live contrast readout: " + c);
  await ctx.close();
}

/* product film + subnav + island */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/products/smart-accountant", { waitUntil: "networkidle" });
  console.log("interactions: film");
  const top = await page.evaluate(() => document.querySelector("[data-film]").getBoundingClientRect().top + scrollY);
  const h = await page.evaluate(() => document.querySelector("[data-film]").offsetHeight);
  const seen = [];
  for (const f of [0.02, 0.3, 0.5, 0.7, 0.95]) { await page.evaluate((y) => window.scrollTo(0, y), top + (h - 900) * f); await page.waitForTimeout(350); seen.push(await page.evaluate(() => [...document.querySelectorAll("[data-film-cap]")].findIndex((x) => x.classList.contains("is-on")))); }
  ok(seen.join(",") === "0,1,2,3,4", "film chapters advance with scroll: " + seen.join("→"));
  ok(await page.locator("[data-subnav].is-on").count() === 1, "sticky product bar appears once scrolled");
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
  ok(await page.locator("[data-subnav].is-on").count() === 0, "sticky product bar hides at top");
  await page.click("[data-theme-toggle]"); await page.waitForTimeout(300);
  const isl = await page.locator("[data-island].is-on .island__t").textContent();
  ok(/الوضع/.test(isl || ""), "dynamic island announces: " + isl);
  ok(await page.evaluate(() => !!document.querySelector("style") && document.querySelector("style").textContent.length > 2000), "critical CSS inlined");
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n✖ ${failures} failure(s)` : "\n✔ all e2e checks passed");
process.exit(failures ? 1 : 0);
