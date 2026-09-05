/* WCAG 2.2 contrast audit of the colour tokens (section 10).
   Reads src/css/tokens.css, resolves :root and [data-theme="dark"] values,
   and asserts every text/background pairing the site uses. */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/css/tokens.css", import.meta.url), "utf8");
const block = (sel) => {
  const i = css.indexOf(sel); const s = css.indexOf("{", i); let d = 1, j = s + 1;
  while (d && j < css.length) { if (css[j] === "{") d++; else if (css[j] === "}") d--; j++; }
  return css.slice(s + 1, j - 1);
};
const vars = (txt) => Object.fromEntries([...txt.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const light = vars(block(":root {"));
const dark = { ...light, ...vars(block(':root[data-theme="dark"]')) };

const hex = (h) => { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join(""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); };
const lum = (rgb) => { const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))]; return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)); };

/* [fg token, bg token, minimum, description] */
const pairs = [
  ["text", "bg", 4.5, "body text on page"],
  ["text-2", "bg", 4.5, "lede / secondary on page"],
  ["text-muted", "bg", 4.5, "captions & labels on page"],
  ["text-muted", "surface", 4.5, "captions on cards"],
  ["text-muted", "surface-2", 4.5, "captions on surface-2 (stat tiles)"],
  ["accent-text", "bg", 4.5, "accent links / small accent text"],
  ["accent-text", "surface", 4.5, "accent text on cards"],
  ["accent", "bg", 3, "accent display type / graphics (large text)"],
  ["btn-fg", "btn-bg", 4.5, "primary button label"],
  ["ink-strip-fg", "ink-strip", 4.5, "tech strip"],
  ["amber", "bg", 4.5, "beta status label"]
];

/* section themes: fg on bg, dim on bg (dim is rgba over bg → composite) */
const site = JSON.parse(readFileSync(new URL("../src/content/site.json", import.meta.url), "utf8"));
const composite = (rgba, bgHex) => {
  const m = rgba.match(/rgba?\(([^)]+)\)/); if (!m) return rgba;
  const [r, g, b, a = 1] = m[1].split(",").map((x) => parseFloat(x));
  const bg = hex(bgHex).map((c) => c * 255);
  const out = [r, g, b].map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
  return "#" + out.map((c) => c.toString(16).padStart(2, "0")).join("");
};

let fail = 0;
const check = (label, fg, bg, min) => {
  const r = ratio(fg, bg);
  const pass = r >= min;
  if (!pass) fail++;
  console.log(`${pass ? "✔" : "✖"} ${r.toFixed(2).padStart(5)} ≥ ${min}  ${label}  (${fg} on ${bg})`);
};

for (const [name, t] of [["light", light], ["dark", dark]]) {
  console.log(`\n— ${name} —`);
  for (const [fg, bg, min, d] of pairs) check(d, t[fg], t[bg], min);
}
console.log("\n— section themes —");
for (const [k, th] of Object.entries(site.themes)) {
  if (k.startsWith("_")) continue;
  check(`${k}: fg on card`, th.fg, th.bg, 4.5);
  check(`${k}: dim on card`, composite(th.dim, th.bg), th.bg, 4.5);
  check(`${k}: accent (large) on card`, th.accent, th.bg, 3);
  if (th.dark) {
    check(`${k} (dark): fg on card`, th.dark.fg, th.dark.bg, 4.5);
    check(`${k} (dark): dim on card`, composite(th.dark.dim, th.dark.bg), th.dark.bg, 4.5);
    check(`${k} (dark): accent (large) on card`, th.dark.accent, th.dark.bg, 3);
  }
}
console.log(fail ? `\n✖ ${fail} contrast failure(s)` : "\n✔ all contrast checks pass (WCAG AA)");
process.exit(fail ? 1 : 0);
