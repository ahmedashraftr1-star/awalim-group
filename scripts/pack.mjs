/* pack.mjs — the Hostinger upload: dist/awalim-hostinger-YYYY-MM-DD.zip.
   Ships ONLY the public site, derived from what the build actually wrote
   (src/deploy-manifest.json) plus the static assets the pages reference — never
   a guessed directory list. Then proves the zip on its own: unzips it into a
   temp dir, serves it the way the host does (clean URLs, 404.html), fetches
   every sitemap URL and resolves every internal link inside the extracted copy.
   Usage: node build.mjs && node scripts/pack.mjs     (npm run pack does both) */
import { chmodSync, readFileSync, existsSync, statSync, readdirSync, mkdirSync, rmSync, mkdtempSync } from "node:fs";
import { join, dirname, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const die = (msg) => { console.error("✖ " + msg); process.exit(1); };

const manPath = join(ROOT, "src/deploy-manifest.json");
if (!existsSync(manPath)) die("src/deploy-manifest.json missing — run `node build.mjs` first");
const manifest = JSON.parse(readFileSync(manPath, "utf8"));

/* never in the package, whatever the manifest or the asset walk says */
const FORBIDDEN = [
  /^(\.keys|\.git|\.panel-backups|\.claude[^/]*|\.vercel|src|scripts|node_modules|shots|dist|css|test-results|dashboard|en\/dashboard)(\/|$)/,
  /\.(zip|gz|md|mjs|pem|py|sh|log|psd|ai|sketch|fig|map)$/i,
  /^[^/]+\.png$/i,                      /* screenshots lying in the root */
  /(^|\/)serenity-spa/,
  /(^|\/)\.DS_Store$/,
  /^(_headers|_redirects|vercel\.json|package(-lock)?\.json|build\.mjs|\.gitignore|\.vercelignore)$/
];
/* assets/dossier (the downloadable PDFs) and css/js ship only when a shipped
   page actually links them — see step 2 */
const forbidden = (f) => FORBIDDEN.some((re) => re.test(f));

/* ---- 1. what the build wrote ---- */
const files = new Set();
for (const f of manifest.files) {
  if (forbidden(f)) continue;
  if (!existsSync(join(ROOT, f))) die(`the manifest lists ${f} but it is not on disk — rebuild`);
  files.add(f);
}
for (const f of ["favicon.ico", "site.webmanifest"]) {
  if (!existsSync(join(ROOT, f))) die(`${f} missing`);
  files.add(f);
}

/* ---- 2. static assets: everything under assets/, except code nobody loads ----
   css/js are included only when a shipped file names them (serenity-spa.* is a
   separate experiment, not this site). Fonts and images are all shipped. */
const walk = (dir, out = []) => {
  for (const e of readdirSync(join(ROOT, dir))) {
    const rel = `${dir}/${e}`;
    if (statSync(join(ROOT, rel)).isDirectory()) walk(rel, out); else out.push(rel);
  }
  return out;
};
const TEXT = /\.(html|css|js|json|xml|webmanifest|txt)$/;
const assets = walk("assets").filter((f) => !forbidden(f));
const corpus = () => [...files, ...assets.filter((a) => files.has(a))].filter((f) => TEXT.test(f)).map((f) => readFileSync(join(ROOT, f), "utf8")).join("\n");
const skipped = [];
{
  const text = corpus() + assets.filter((a) => /\.(css|js)$/.test(a) && !/^assets\/(css|js|dossier)\//.test(a)).map((f) => readFileSync(join(ROOT, f), "utf8")).join("\n");
  /* referenced code may itself reference code (awalim.js → ledger.js), so iterate */
  let changed = true, pool = text;
  while (changed) {
    changed = false;
    for (const a of assets) {
      if (files.has(a)) continue;
      const isCode = /^assets\/(css|js|dossier)\//.test(a);
      if (!isCode || pool.includes("/" + a)) {
        files.add(a); changed = true;
        if (isCode) pool += readFileSync(join(ROOT, a), "utf8");
      }
    }
  }
  for (const a of assets) if (!files.has(a)) skipped.push(a);
}

/* ---- 3. safety ---- */
const leaked = [...files].filter(forbidden);
if (leaked.length) die("forbidden path(s) selected:\n   " + leaked.join("\n   "));
for (const must of [".htaccess", "index.html", "404.html", "robots.txt", "sitemap.xml", "sw.js", "search.json", "en/index.html", "en/404/index.html", "verify/index.html", "verify/stats.json", "assets/css/awalim.css", "assets/js/awalim.js", "assets/js/ledger.js"])
  if (!files.has(must)) die(`required file not selected: ${must}`);

/* ---- 4. zip ---- */
const d = new Date();
const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const DIST = join(ROOT, "dist");
mkdirSync(DIST, { recursive: true });
const zipPath = join(DIST, `awalim-hostinger-${day}.zip`);
if (existsSync(zipPath)) rmSync(zipPath);
const list = [...files].sort();
/* the server reads files as another user: a file the build wrote 0600 (the og
   generator did) uploads fine and then answers 403 on the live site */
for (const f of list) { const m = statSync(join(ROOT, f)).mode & 0o777; if ((m & 0o044) !== 0o044) chmodSync(join(ROOT, f), (m | 0o644) & 0o755); }
execFileSync("zip", ["-q", "-X", "-9", zipPath, "-@"], { cwd: ROOT, input: list.join("\n") + "\n" });

/* re-read the zip itself, not our intent */
const inZip = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" }).split("\n").filter((x) => x && !x.endsWith("/"));
const zipLeak = inZip.filter(forbidden);
if (zipLeak.length) die("forbidden path(s) inside the zip:\n   " + zipLeak.join("\n   "));
if (inZip.length !== list.length) die(`zip holds ${inZip.length} files, expected ${list.length}`);
const size = statSync(zipPath).size;
console.log(`✔ ${zipPath.replace(ROOT + "/", "")} · ${inZip.length} files · ${(size / 1024 / 1024).toFixed(2)} MB · build ${manifest.stamp}`);
console.log(`  routes: ${inZip.filter((f) => f.endsWith("index.html") || f === "404.html").length} html pages · assets: ${inZip.filter((f) => f.startsWith("assets/")).length} files`);
if (skipped.length) console.log(`  left out (no shipped file references them): ${skipped.join(", ")}`);

if (process.argv.includes("--no-verify")) process.exit(0);

/* ---- 5. the zip stands on its own ---- */
const TMP = mkdtempSync(join(tmpdir(), "awalim-pack-"));
execFileSync("unzip", ["-q", zipPath, "-d", TMP]);
const fileFor = (p) => {
  p = decodeURIComponent(p.split("#")[0].split("?")[0]);
  p = normalize(p).replace(/^(\.\.[/\\])+/, "");
  if (!p || p === "/") return join(TMP, "index.html");
  const abs = join(TMP, p);
  if (!abs.startsWith(TMP)) return null;
  if (existsSync(abs) && statSync(abs).isFile()) return abs;
  if (existsSync(join(abs, "index.html"))) return join(abs, "index.html");
  return null;
};
let bad = 0, links = 0;
const htmlFiles = inZip.filter((f) => f.endsWith(".html"));
for (const f of htmlFiles) {
  const html = readFileSync(join(TMP, f), "utf8");
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (!u.startsWith("/") || u.startsWith("//")) continue;
    links++;
    if (!fileFor(u)) { bad++; if (bad <= 15) console.log(`  ✖ ${f} → ${u}`); }
  }
}

const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".xml": "application/xml" };
const server = createServer((req, res) => {
  const f = fileFor(new URL(req.url, "http://x").pathname);
  if (!f) { res.writeHead(404, { "content-type": MIME[".html"] }); res.end(readFileSync(join(TMP, "404.html"))); return; }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
const sm = readFileSync(join(TMP, "sitemap.xml"), "utf8");
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
let non200 = 0;
for (const p of urls) {
  const r = await fetch(base + p);
  if (r.status !== 200) { non200++; console.log(`  ✖ ${p} → ${r.status}`); }
}
const miss = await fetch(base + "/no-such-page-" + Date.now());
server.close();
rmSync(TMP, { recursive: true, force: true });

console.log(`  extracted copy: ${urls.length} sitemap URLs → ${urls.length - non200} × 200 · ${links} internal links in ${htmlFiles.length} pages, ${bad} broken · unknown path → ${miss.status}`);
if (bad || non200 || miss.status !== 404 || !urls.length) die("the zip is not self-sufficient");
console.log("✔ the zip serves on its own");
