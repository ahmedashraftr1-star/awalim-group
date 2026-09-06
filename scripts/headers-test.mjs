/* The response headers are declared twice — _headers for the local server and
   any Netlify/Cloudflare host, vercel.json for the deploy target — and nothing
   kept them in step. A CSP that carries per-page script hashes makes that
   dangerous: a hash present in one file and missing from the other is a blank
   page on exactly one host. This asserts the two agree, and that the policy we
   ship can actually run the pages we build.
   Usage: node scripts/headers-test.mjs */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
let fail = 0;
const ok = (cond, msg, detail) => { if (cond) console.log("  ✔", msg); else { fail++; console.log("  ✖", msg, detail ? "\n     " + detail : ""); } };

/* ---- parse both declarations ---- */
const globToRe = (p) => new RegExp("^" + p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*") + "$");
const headersRules = (() => {
  const out = []; let cur = null;
  for (const line of readFileSync(join(ROOT, "_headers"), "utf8").split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) { cur = { re: globToRe(line.trim()), headers: [] }; out.push(cur); continue; }
    const i = line.indexOf(":");
    if (cur && i > 0) cur.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
  }
  return out;
})();
const vercelRules = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8")).headers.map((h) => ({
  re: new RegExp("^" + h.source + "$"),
  headers: h.headers.map((x) => [x.key, x.value]),
}));
const applied = (rules, path) => { const h = {}; for (const r of rules) if (r.re.test(path)) for (const [k, v] of r.headers) h[k] = v; return h; };

console.log("the two header declarations agree");
/* Both files are matched by pattern, and a pattern syntax that stops matching
   makes BOTH sides empty — which diffs clean. So each sample has to resolve
   something before its diff means anything: a check that quietly measures
   nothing is worse than one that fails. */
ok(headersRules.length > 0, `_headers parsed into ${headersRules.length} rules`);
ok(vercelRules.length > 0, `vercel.json parsed into ${vercelRules.length} rules`);
const SAMPLES = ["/", "/work/rahmacare/", "/en/products/vibe-os/", "/assets/css/awalim.css", "/assets/js/awalim.js", "/assets/fonts/x.woff2", "/assets/img/x.webp", "/assets/vendor/lenis.min.js"];
for (const p of SAMPLES) {
  const a = applied(headersRules, p), b = applied(vercelRules, p);
  if (!Object.keys(a).length || !Object.keys(b).length) {
    fail++;
    console.log(`  ✖ ${p} matched no rule in ${!Object.keys(a).length ? "_headers" : ""}${!Object.keys(a).length && !Object.keys(b).length ? " and " : ""}${!Object.keys(b).length ? "vercel.json" : ""} — the comparison for this path proves nothing`);
    continue;
  }
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
  const diff = keys.filter((k) => a[k] !== b[k]).map((k) => `${k}: _headers «${a[k] ?? "—"}» vs vercel.json «${b[k] ?? "—"}»`);
  ok(!diff.length, `${p}`, diff.join("\n     "));
}

/* ---- the policy has to be able to run the pages ---- */
console.log("\nthe policy can run the pages it ships with");
const csp = applied(headersRules, "/")["Content-Security-Policy"] || "";
const directive = (name) => { const m = new RegExp(`(?:^|;)\\s*${name}\\s+([^;]*)`).exec(csp); return m ? m[1].trim().split(/\s+/) : null; };
const scriptSrc = directive("script-src") || directive("default-src") || [];
ok(csp.length > 0, "a Content-Security-Policy is declared");
/* if the directive parser stops matching, scriptSrc goes empty and every check
   below it silently passes — so the parse itself is asserted first */
ok(scriptSrc.length > 0, `script-src parsed (${scriptSrc.length} sources)`);
ok(scriptSrc.includes("'unsafe-inline'") || scriptSrc.some((x) => x.startsWith("'sha")) || scriptSrc.some((x) => x.startsWith("'nonce-")),
  "script-src allows inline by SOME mechanism (hash, nonce or unsafe-inline)",
  "neither found — either the policy blocks its own inline script, or this parser is no longer reading it");
ok(!scriptSrc.includes("'unsafe-eval'"), "script-src does not allow 'unsafe-eval'");
ok((directive("object-src") || []).includes("'none'"), "object-src is 'none'");

const html = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (e === "node_modules" || e === "shots" || e === ".git" || e === "src") continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p); else if (e.endsWith(".html")) html.push(p);
  }
})(ROOT);

/* executable inline scripts only — application/ld+json is data, not code */
const INLINE = /<script(?![^>]*\bsrc=)(?![^>]*type=(?:"|')(?!text\/javascript)[^"']*(?:"|'))[^>]*>([\s\S]*?)<\/script>/g;
const hashes = new Map();
let handlers = 0;
for (const f of html) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(INLINE)) {
    const h = "sha256-" + createHash("sha256").update(m[1], "utf8").digest("base64");
    if (!hashes.has(h)) hashes.set(h, f.slice(ROOT.length + 1));
  }
  /* only inside a real tag opening: script bodies and comments are not markup,
     and prose about engineering quotes onclick= without meaning it. Counting
     raw matches failed the build on a comment that merely mentioned onload. */
  const markup = src.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "<$1></$1>");
  for (const tag of markup.matchAll(/<[a-zA-Z][^>]*>/g)) handlers += (tag[0].match(/\son[a-z]{2,12}\s*=/gi) || []).length;
}
ok(html.length > 20, `${html.length} built pages scanned, ${hashes.size} distinct inline script(s)`, "too few pages found — the walk is not reaching the build output");
ok(hashes.size > 0, "at least one executable inline script was found to hash", "the inline-script pattern matched nothing, so the hash checks below are vacuous");

const usesHashes = scriptSrc.some((s) => s.startsWith("'sha256-"));
if (usesHashes) {
  const missing = [...hashes].filter(([h]) => !csp.includes(h)).map(([h, f]) => `${h} (first seen in ${f})`);
  ok(!missing.length, "every inline script's hash is in the policy", missing.slice(0, 5).join("\n     "));
  const vcsp = applied(vercelRules, "/")["Content-Security-Policy"] || "";
  const drift = [...hashes].filter(([h]) => csp.includes(h) !== vcsp.includes(h)).map(([h]) => h);
  ok(!drift.length, "every hash is in BOTH _headers and vercel.json", drift.slice(0, 5).join("\n     "));
  /* a hash cannot cover an inline event handler: it needs 'unsafe-hashes' */
  ok(handlers === 0 || scriptSrc.includes("'unsafe-hashes'"),
    `no inline event handler the policy would block (${handlers} found)`,
    handlers ? "a hash-based script-src blocks on*= attributes unless 'unsafe-hashes' is added — move the handler into a hashed script instead" : "");
} else {
  console.log(`  · policy still allows 'unsafe-inline'; hash checks inert (${handlers} inline event handler${handlers === 1 ? "" : "s"} would need moving first)`);
}

if (fail) { console.log(`\n✖ ${fail} header check(s) failed`); process.exit(1); }
console.log("\n✔ header declarations agree and the policy fits the build");
