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

/** عرض تقريبي للنصّ بخطّ Arial 20px — الخطّ الذي يرسم به محرّك البحث عنوان
 *  النتيجة. عدّ الحروف مقياس أعمى هنا: الحرف العربي أضيق من اللاتيني بالثلث،
 *  فحدٌّ واحد بالحروف يظلم لغةً ويسامح أخرى. المعامِلات مُعايَرة على قياس فعلي
 *  في المتصفّح (shots/title-px.mjs) ويُعاد فحصها هناك. */
export const px20 = (s = "") => {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    if (c === 32) w += 5.6;
    else if (c >= 0x0600 && c <= 0x06FF) w += 7.2;
    else if (c >= 0x0660 && c <= 0x0669) w += 11.1;
    else if (c >= 48 && c <= 57) w += 11.1;
    else if (c >= 65 && c <= 90) w += 13.9;
    else if (c >= 97 && c <= 122) w += 10.5;
    else if (c > 0x2000) w += 9.0;
    else w += 6.4;
  }
  return Math.round(w);
};

/* لا يُختَم عنوان بحرف جرّ أو أداة: «... whose numbers can» شظيّة، لا اختصار. */
const TAIL_STOP = /\s+(a|an|the|of|to|in|on|at|for|and|or|with|that|which|can|is|are|be|من|في|على|إلى|عن|أن|أنّ|التي|الذي|مع|بلا|و)$/i;

/** أوّل جملة من سطر عريض، مقصوصة على ميزانية عرض لا على عدد حروف. */
export const lede1 = (s = "", budget = 300) => {
  let t = String(s).split(/\s[—–]\s|[،,:;]/)[0].trim();
  while (px20(t) > budget && t.includes(" ")) t = t.replace(/\s+\S*$/, "").trim();
  let prev;
  do { prev = t; t = t.replace(TAIL_STOP, "").trim(); } while (t !== prev);
  return t;
};

/** عنوان صفحة يتّسع في نتيجة البحث. الاسم واللاحقة أوّلاً، والوسط إن بقي له مكان.
 *  شظيّة مبتورة أسوأ من غيابها: إن ذهب أكثر من ثلث الجملة سقطت كلّها ونجا الاسم.
 *  الميزانية 580px لا 600: النموذج تقريبي (±2%)، والهامش يمتصّ خطأه. */
export const seoTitle = (name, sub, suffix, budget = 565) => {
  const tail = suffix ? ` | ${suffix}` : "";
  const room = budget - px20(tail);
  let head = String(name).trim();
  if (px20(head) > room) return `${lede1(head, room)}${tail}`;
  const full = lede1(sub, 1e6);
  if (!full) return `${head}${tail}`;
  const cut = lede1(sub, room - px20(`${head} — `));
  if (!cut || px20(cut) < px20(full) * 0.62) return `${head}${tail}`;
  return `${head} — ${cut}${tail}`;
};

/** شبكة أمان: أي عنوان يصل إلى الرأس، من محتوى أو قالب، يُقصّ على الميزانية
 *  نفسها. اللاحقة بعد «|» محفوظة لأنها الهوية، والوسط بعد «—» هو ما يُقصّ. */
export const fitTitle = (t, budget = 565) => {
  const s = String(t ?? "").trim();
  if (!s || px20(s) <= budget) return s;
  const bar = s.lastIndexOf(" | ");
  const suffix = bar > 0 ? s.slice(bar + 3) : "";
  const head = bar > 0 ? s.slice(0, bar) : s;
  const dash = head.search(/\s[—–]\s/);
  return dash > 0
    ? seoTitle(head.slice(0, dash), head.slice(dash + 3), suffix, budget)
    : seoTitle(head, "", suffix, budget);
};

/** وصف الصفحة يُقصّ عند حدّ جملة لا حدّ كلمة: نصف جملة في نتيجة البحث يقرؤها
 *  الزائر على أنّها عطل. الميزانية بوحدات النموذج (20px)؛ محرّك البحث يعرض
 *  الوصف بنحو 14px، والحدّ المتعارف عليه ~160 حرفاً ≈ 1600 من وحداتنا. */
export const fitDesc = (d, budget = 1600) => {
  const s = String(d ?? "").trim();
  if (!s || px20(s) <= budget) return s;
  const parts = s.split(/(?<=[.!؟؛])\s+/);
  let out = "";
  for (const p of parts) {
    const next = out ? out + " " + p : p;
    if (px20(next) > budget) break;
    out = next;
  }
  if (out) return out;
  let t = parts[0];                              /* حتى الجملة الأولى لا تتّسع */
  while (px20(t) > budget - 12 && t.includes(" ")) t = t.replace(/\s+\S*$/, "");
  return t.replace(/[،,;:—–-]$/, "").trim() + "…";
};

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
