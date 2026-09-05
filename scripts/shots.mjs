/* Screenshot every route (desktop light/dark + mobile) for visual QA.
   Usage: node scripts/shots.mjs [outDir] [routeFilter] */
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE || "http://localhost:8899";
const out = process.argv[2] || "shots";
const filter = process.argv[3] || "";
const routes = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8")).filter((r) => r.includes(filter));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const name = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "-"));

for (const r of routes) {
  for (const [label, vp, theme] of [["desktop", { width: 1440, height: 900 }, "light"], ["dark", { width: 1440, height: 900 }, "dark"], ["mobile", { width: 390, height: 844 }, "light"]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: theme });
    const page = await ctx.newPage();
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    /* walk the page so lazy images and observers fire, then wait for every image */
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
      window.scrollTo(0, 0);
      document.querySelectorAll(".rv,[data-stagger]").forEach((e) => e.classList.add("in"));
      await Promise.all([...document.images].map((i) => i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })));
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(out, `${name(r)}-${label}.png`), fullPage: true });
    await ctx.close();
  }
  console.log("✔", r);
}
await browser.close();
