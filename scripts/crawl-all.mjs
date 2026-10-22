/* Full crawl: every public route (both locales) + every asset any page, stylesheet,
   manifest, sitemap or JSON-LD refers to. Each must answer 200 from the server.
   Usage: node scripts/crawl-all.mjs [baseUrl]   (default http://localhost:8899) */
const BASE = (process.argv[2] || "http://localhost:8899").replace(/\/$/, "");
const ORIGIN = "https://awalimgroup.com";
const head = await fetch(BASE + "/").catch(() => null);
if (!head) { console.error(`✖ no server at ${BASE} — start one with npm run serve`); process.exit(2); }

const seen = new Map();            // url -> status
let pages = 0;
const refs = new Map();            // url -> Set(pages)
const queue = [];
const note = (u, from) => {
  if (!u) return;
  u = u.trim().replace(/&amp;/g, "&");
  if (/^(mailto:|tel:|data:|javascript:|#|blob:)/.test(u)) return;
  if (u.startsWith(ORIGIN)) u = u.slice(ORIGIN.length) || "/";
  if (/^https?:\/\//.test(u) || u.startsWith("//")) return;   // external: not ours to serve
  const baseFor = from.startsWith("/") ? BASE + from : BASE + "/"; const url = new URL(u, baseFor); const abs = url.pathname + url.search;
  const key = abs.split("#")[0];
  if (!refs.has(key)) refs.set(key, new Set());
  refs.get(key).add(from);
  if (!seen.has(key)) { seen.set(key, null); queue.push(key); }
};
const sm = await (await fetch(BASE + "/sitemap.xml")).text();
for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>|href="([^"]+)"/g)) note(m[1] || m[2], "/sitemap.xml");
for (const r of ["/", "/en/", "/404.html", "/en/404/", "/offline/", "/en/offline/", "/robots.txt", "/site.webmanifest", "/sw.js", "/search.json", "/verify/stats.json", "/favicon.ico"]) note(r, "(seed)");

let n = 0;
while (queue.length) {
  const u = queue.shift();
  const res = await fetch(BASE + u, { redirect: "follow" }).catch(() => null);
  const st = res ? res.status : 0;
  seen.set(u, st); n++;
  if (!res || st !== 200) continue;
  const type = res.headers.get("content-type") || "";
  if (!/html|css|manifest|json/.test(type) && !/\.(webmanifest|json)$/.test(u)) continue;
  const body = await res.text();
  if (/html/.test(type)) {
    pages++;
    if (/\/dashboard\//.test(u)) continue;
    for (const m of body.matchAll(/\s(?:href|src|poster|data-src|content)="([^"]+)"/g)) {
      const v = m[1];
      if (/\s(content)="/.test(m[0]) && !/^(\/|https:\/\/awalimgroup\.com)/.test(v)) continue;
      if (/\scontent="/.test(m[0]) && !/\.(png|jpe?g|webp|svg|ico)(\?|$)/.test(v)) continue;
      note(v, u);
    }
    for (const m of body.matchAll(/\ssrcset="([^"]+)"/g)) for (const part of m[1].split(",")) note(part.trim().split(/\s+/)[0], u);
    for (const m of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))
      for (const v of m[1].matchAll(/"(https:\/\/awalimgroup\.com[^"]*)"/g)) note(v[1], u);
    for (const m of body.matchAll(/url\(["']?([^"')]+)["']?\)/g)) note(m[1], u);
  } else if (/css/.test(type)) {
    for (const m of body.matchAll(/url\(["']?([^"')]+)["']?\)/g)) note(m[1], u);
  } else {
    for (const m of body.matchAll(/"(?:src|url|href|start_url)"\s*:\s*"([^"]+)"/g)) if (m[1].startsWith("/")) note(m[1], u);
  }
}
const broken = [...seen].filter(([, s]) => s !== 200);
console.log(`crawled ${n} URLs (${pages} pages, ${n - pages} assets/files) on ${BASE}`);
if (!broken.length) { console.log("✔ 0 broken — every internal link and asset answers 200"); process.exit(0); }
console.log(`✖ ${broken.length} broken:`);
for (const [u, s] of broken) console.log(`  ${s || "ERR"}  ${u}\n        ← ${[...refs.get(u) || []].slice(0, 4).join(", ")}${(refs.get(u)?.size || 0) > 4 ? ` (+${refs.get(u).size - 4} more)` : ""}`);
process.exit(1);
