/* Zero-dependency static server that behaves like production: brotli/gzip,
   clean URLs (/work → /work/index.html), 404.html, cache headers.
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
  headers["Cache-Control"] = /\/assets\/(fonts|img|vendor)\//.test(file) ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate";
  res.writeHead(status, headers);
  res.end(body);
}).listen(PORT, () => console.log(`▸ http://localhost:${PORT}  (brotli/gzip, clean URLs)`));
