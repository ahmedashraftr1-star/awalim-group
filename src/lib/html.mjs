/* ==========================================================================
   html.mjs — primitives shared by every template.
   No framework: templates are plain functions returning strings.
   ========================================================================== */

export const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Attribute helper: attrs({ class: "a", hidden: true, id: null }) → ` class="a" hidden` */
export const attrs = (o = {}) =>
  Object.entries(o)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join("");

/** Join array of strings (or nested arrays), dropping falsy. */
export const join = (arr, sep = "\n") =>
  (Array.isArray(arr) ? arr : [arr]).flat(Infinity).filter(Boolean).join(sep);

/** Format a number with Latin digits and thousands separators. Site policy: Latin digits everywhere. */
export const num = (n) => Number(n).toLocaleString("en-US");

/**
 * Replace {statKey} placeholders inside copy with formatted stat values, so
 * prose like "{engineersTrained} مهندس" reads from the single source of truth.
 *
 * The value is wrapped in U+2066 LRI … U+2069 PDI: inside an RTL paragraph a
 * bare "+1,200" is reordered by the bidi algorithm and paints as "1,200+".
 * Isolate characters (not markup) fix the order and also keep the sign from
 * wrapping away from its digits — and they stay invisible inside attributes,
 * alt text and screen-reader output, where markup could not go.
 */
const LRI = "\u2066", PDI = "\u2069";
export const fill = (text, stats) =>
  String(text ?? "").replace(/\{(\w+)\}/g, (m, k) => {
    const s = stats[k];
    if (!s) return m;
    return `${LRI}${s.prefix || ""}${num(s.value)}${s.suffix || ""}${PDI}`;
  });

/** Latin term isolated inside RTL prose. */
export const bdi = (s) => `<bdi lang="en">${esc(s)}</bdi>`;

/** Slug-safe id from arbitrary text (Arabic kept). */
export const slug = (s) =>
  String(s)
    .trim()
    .replace(/[\s·—–]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .toLowerCase();

/** Reading-time helper for article bodies. */
export const words = (blocks) =>
  blocks
    .map((b) => b.p || b.h2 || (b.ul || []).join(" ") || b.quote || "")
    .join(" ")
    .replace(/<[^>]+>/g, "")
    .split(/\s+/)
    .filter(Boolean).length;

/**
 * Arabic-aware search normalisation, mirrored in assets/js/extras.js:
 * strip tashkeel & tatweel, unify alef/yaa/taa-marbuta forms, lowercase Latin.
 */
export const normalizeSearch = (s) =>
  String(s)
    .replace(/<[^>]+>/g, " ")
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
