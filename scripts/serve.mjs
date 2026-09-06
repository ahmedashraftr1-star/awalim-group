/* Zero-dependency static server that behaves like production: brotli/gzip,
   clean URLs (/work → /work/index.html), 404.html, and the REAL response
   headers, parsed from _headers rather than restated here. Without that the
   whole test suite ran with no Content-Security-Policy at all, so nothing ever
   checked that the policy we actually ship lets the site work.
   Usage: node scripts/serve.mjs [port]   (default 8899) */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync, constants } from "node:zlib";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = +(process.argv[2] || process.env.PORT || 8899);
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".webp": "image/webp", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml" };
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".json", ".xml", ".txt", ".webmanifest", ".svg"]);
const cache = new Map();

/* _headers: a path pattern at column 0, indented "Key: value" lines under it.
   Every matching rule applies, in file order, later winning on a repeated key.
   Re-read when the file changes: build.mjs generates it, so a rebuild must not
   need a server restart to take effect. */
const HEADERS_FILE = join(ROOT, "_headers");
let rulesMtime = -1, RULES = [];
const rules = () => {
  const m = existsSync(HEADERS_FILE) ? statSync(HEADERS_FILE).mtimeMs : 0;
  if (m === rulesMtime) return RULES;
  rulesMtime = m;
  const txt = m ? readFileSync(HEADERS_FILE, "utf8") : "";
  const out = [];
  let cur = null;
  for (const line of txt.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) { cur = { pattern: line.trim(), headers: [] }; out.push(cur); continue; }
    const i = line.indexOf(":");
    if (cur && i > 0) cur.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
  }
  RULES = out.map((r) => ({ re: new RegExp("^" + r.pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*") + "$"), headers: r.headers }));
  return RULES;
};
const headersFor = (urlPath) => {
  const h = {};
  for (const r of rules()) if (r.re.test(urlPath)) for (const [k, v] of r.headers) h[k] = v;
  return h;
};

function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  p = normalize(p).replace(/^(\.\.[/\\])+/, "");
  const abs = join(ROOT, p);
  if (!abs.startsWith(ROOT)) return null;
  if (existsSync(abs) && statSync(abs).isFile()) return abs;
  if (existsSync(join(abs, "index.html"))) return join(abs, "index.html");
  if (existsSync(abs + ".html")) return abs + ".html";
  return null;
}

createServer((req, res) => {
  let file = resolve(req.url);
  let status = 200;
  if (!file) { file = join(ROOT, "404.html"); status = 404; }
  const ext = extname(file);
  const type = MIME[ext] || "application/octet-stream";
  const accept = req.headers["accept-encoding"] || "";
  const enc = COMPRESSIBLE.has(ext) ? (accept.includes("br") ? "br" : accept.includes("gzip") ? "gzip" : "") : "";
  /* cache compressed bodies, keyed by mtime so a rebuild is served immediately */
  const key = file + "|" + enc + "|" + statSync(file).mtimeMs;
  let body = cache.get(key);
  if (!body) {
    const raw = readFileSync(file);
    body = enc === "br" ? brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }) : enc === "gzip" ? gzipSync(raw, { level: 6 }) : raw;
    if (cache.size > 400) cache.clear();
    cache.set(key, body);
  }
  const headers = { "Content-Type": type, "Content-Length": body.length, Vary: "Accept-Encoding" };
  if (enc) headers["Content-Encoding"] = enc;
  headers["Cache-Control"] = "public, max-age=0, must-revalidate";
  Object.assign(headers, headersFor(decodeURIComponent(req.url.split("?")[0])));
  res.writeHead(status, headers);
  res.end(body);
}).listen(PORT, () => console.log(`▸ http://localhost:${PORT}  (brotli/gzip, clean URLs, live _headers)`));
