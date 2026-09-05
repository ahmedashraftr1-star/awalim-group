/* Verify every internal href/src in the built HTML resolves to a real file. */
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const routes = JSON.parse(readFileSync(join(ROOT, "src/routes.json"), "utf8"));
const fileFor = (p) => {
  p = p.split("#")[0].split("?")[0];
  if (!p || p === "/") return join(ROOT, "index.html");
  const abs = join(ROOT, p);
  if (existsSync(abs) && statSync(abs).isFile()) return abs;
  if (existsSync(join(abs, "index.html"))) return join(abs, "index.html");
  if (existsSync(abs + ".html")) return abs + ".html";
  return null;
};
let bad = 0, total = 0;
for (const r of routes) {
  const html = readFileSync(fileFor(r), "utf8");
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(u)) continue;
    total++;
    if (!fileFor(u)) { bad++; console.log(`✖ ${r} → ${u}`); }
  }
}
console.log(bad ? `\n✖ ${bad} broken of ${total} internal links` : `\n✔ ${total} internal links resolve`);
process.exit(bad ? 1 : 0);
