/* The bilingual merge decides what the English mirror says. Two content-loss
   bugs shipped through it in fluent English, where no rendering test could see
   them, so its semantics are asserted here directly rather than inferred from
   a page. Each case is named for the failure it prevents. */
import { merge, findLoss } from "../src/lib/merge.mjs";

let fail = 0;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const ok = (name, got, want) => {
  if (eq(got, want)) return console.log("  ✔", name);
  fail++;
  console.log("  ✖", name, "\n     got  " + JSON.stringify(got), "\n     want " + JSON.stringify(want));
};

console.log("merge semantics");

/* the /en/work/maya bug: three keyed elements and one unkeyed, and every
   unkeyed base element matched the same override via `x.n === undefined` */
ok("a partially-keyed array pairs each override once",
  merge(
    [{ n: 1, label: "أ" }, { n: 2, label: "ب" }, { text: "CMYK · RGB", label: "ج" }, { text: "دليل", label: "د" }],
    [{ n: 1, label: "a" }, { n: 2, label: "b" }, { text: "CMYK · RGB", label: "c" }, { text: "Guide", label: "d" }]),
  [{ n: 1, label: "a" }, { n: 2, label: "b" }, { text: "CMYK · RGB", label: "c" }, { text: "Guide", label: "d" }]);

/* the /en/work/vibe-os bug: an unkeyed object array replaced wholesale, so the
   Arabic step's `mock` went with the array and the page lost a mock screen */
ok("an unkeyed object array merges element-wise, keeping fields the translation omits",
  merge(
    [{ t: "أ", d: "١", mock: "vibe" }, { t: "ب", d: "٢" }],
    [{ t: "a", d: "1" }, { t: "b", d: "2" }]),
  [{ t: "a", d: "1", mock: "vibe" }, { t: "b", d: "2" }]);

ok("a scalar array is restated whole",
  merge(["أ", "ب", "ج"], ["a", "b"]), ["a", "b"]);

ok("an override longer than the base appends (an English-only gallery)",
  merge([], [{ src: "/a.webp" }]), [{ src: "/a.webp" }]);

ok("identity keys pair across a reordered, partial translation",
  merge(
    [{ slug: "x", t: "أ", keep: 1 }, { slug: "y", t: "ب" }],
    [{ slug: "y", t: "b" }]),
  [{ slug: "x", t: "أ", keep: 1 }, { slug: "y", t: "b" }]);

ok("nested objects keep untranslated branches",
  merge({ a: { b: 1, c: "أ" }, d: [1, 2] }, { a: { c: "a" } }),
  { a: { b: 1, c: "a" }, d: [1, 2] });

console.log("\nloss guard");
const loss = (base, over) => { const out = []; findLoss(base, merge(base, over), "t", out); return out; };
ok("a clean merge reports no loss", loss({ a: 1, b: [{ x: 1 }] }, { a: 2 }), []);
ok("a dropped key is reported",
  (() => { const out = []; findLoss({ a: 1, mock: "vibe" }, { a: 2 }, "t", out); return out; })(),
  ["t.mock: key lost in the translation"]);
ok("a shortened array is reported",
  (() => { const out = []; findLoss({ s: [1, 2, 3] }, { s: [1, 2] }, "t", out); return out; })(),
  ["t.s: array of 3 became 2"]);

if (fail) { console.log(`\n✖ ${fail} merge check(s) failed`); process.exit(1); }
console.log("\n✔ merge semantics hold");
