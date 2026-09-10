/* copy-lint.mjs — أخطاء اللغة في المحتوى العربي، مقيسة لا مقروءة بالعين.
   يمشي على كل نصّ عربي داخل src/content/*.json ويطبّق قواعد ميكانيكية عالية الدقّة.
   العُرف مستخرَج من المحتوى نفسه، لا مفروضاً عليه: الأرقام لاتينية لأن 30 موضعاً
   يكتبها كذلك و4 فقط تخالف. */
import { readFileSync, readdirSync } from "node:fs";

const DIR = "src/content";
const SKIP_FILES = new Set(["i18n.json", "signing.json"]);
const AR = /[ء-ي]/;
const ARABIC_INDIC = /[٠-٩]/;
/* حقول ليست نثراً: الكود يحاذي بمسافات، واللاحقة تبدأ بمسافة عن قصد */
const NOT_PROSE = new Set(["code", "suffix", "latin", "slug", "id", "href", "src", "lang"]);
/* تكرار مقصود في العربية */
/* قواعد تحتاج النصّ كاملاً؛ شظيّة سطر من قالب ليست نصّاً كاملاً */
const FRAGMENT_UNSAFE = new Set(["أقواس-غير-متوازنة", "فراغ-طرفي", "مسافة-مزدوجة", "مسافة-قبل-ترقيم"]);
const OK_REPEAT = new Set(["واحدة", "واحداً", "شيئاً", "يوماً", "مرّة"]);

const RULES = [
  { id: "أرقام-هندية", why: "الموقع يكتب الأرقام لاتينية داخل العربية",
    test: (s) => ARABIC_INDIC.test(s) && [...s.matchAll(/[٠-٩]+/g)].map((m) => m[0]) },
  { id: "فاصلة-لاتينية", why: "الفاصلة العربية ،",
    test: (s) => /[ء-ي]\s*,/.test(s) && [","] },
  { id: "استفهام-لاتيني", why: "علامة الاستفهام العربية ؟",
    test: (s) => /[ء-ي]\s*\?/.test(s) && ["?"] },
  { id: "فاصلة-منقوطة-لاتينية", why: "الفاصلة المنقوطة العربية ؛",
    test: (s) => /[ء-ي]\s*;/.test(s) && [";"] },
  { id: "مسافة-قبل-ترقيم", why: "لا مسافة قبل علامة الترقيم",
    test: (s) => { const m = [...s.matchAll(/\s+([،؛؟!:.])/g)].map((x) => x[0]); return m.length ? m : false; } },
  { id: "مسافة-مزدوجة", why: "مسافة واحدة بين الكلمات",
    test: (s) => /[^\s] {2,}[^\s]/.test(s) && ["  "] },
  { id: "تطويل", why: "التطويل ـ لا يُستعمل في نصّ الواجهة",
    test: (s) => /[ء-ي]ـ+[ء-ي]/.test(s) && ["ـ"] },
  { id: "كلمة-مكرّرة", why: "تكرار كلمة متتالية",
    test: (s) => { const m = [...s.matchAll(/(?<![ء-ي])([ء-ي]{3,})\s+\1(?![ء-ي])/g)].map((x) => x[1]).filter((w) => !OK_REPEAT.has(w)); return m.length ? m : false; } },
  /* تمييز العدد يعاكس المعدود في 3–10: «خمس هجمات» لا «خمسة هجمات».
     جمع المؤنّث السالم (ـات) مفرده مؤنّث غالباً، فالعدد يأتي بلا تاء.
     القاعدة تُبلّغ للمراجعة لا للحكم — بعض جموع الـات مفردها مذكّر (مطار، حمّام). */
  { id: "تمييز-العدد", review: true, why: "3–10: العدد يعاكس المعدود",
    test: (s) => { const m = [...s.matchAll(/(ثلاثة|أربعة|خمسة|ستّة|ستة|سبعة|ثمانية|تسعة|عشرة)\s+([ء-ي]+ات)(?![ء-ي])/g)].map((x) => x[0]); return m.length ? m : false; } },
  { id: "تمييز-العدد-عكسي", review: true, why: "3–10: عدد مجرّد ⇒ معدود مؤنّث المفرد",
    test: (s) => { const m = [...s.matchAll(/(?<![ء-ي])(ثلاث|أربع|خمس|ستّ|ست|سبع|ثمان|تسع|عشر)\s+([ء-ي]{3,})(?![ء-ي])/g)]
      .filter((x) => !/ات$/.test(x[2])).map((x) => x[0]); return m.length ? m : false; } },
  { id: "أقواس-غير-متوازنة", why: "«» و() و[] يجب أن تتوازن",
    test: (s) => { const bad = [];
      for (const [o, c] of [["«", "»"], ["(", ")"], ["[", "]"], ["{", "}"]])
        if ((s.split(o).length - 1) !== (s.split(c).length - 1)) bad.push(o + c);
      return bad.length ? bad : false; } },
  { id: "شرطة-بلا-مسافة", why: "أسلوب الموقع: مسافة حول —",
    test: (s) => { const m = [...s.matchAll(/[ء-ي]—|—[ء-ي]/g)].map((x) => x[0]); return m.length ? m : false; } },
  { id: "فراغ-طرفي", why: "لا فراغ في أوّل النصّ أو آخره",
    test: (s) => s !== s.trim() && [JSON.stringify(s.slice(0, 3) + "…" + s.slice(-3))] },
  { id: "خلط-أرقام", why: "نظام أرقام واحد داخل النصّ الواحد",
    test: (s) => ARABIC_INDIC.test(s) && /[0-9]/.test(s) && ["٠-٩ + 0-9"] },
];

let strings = 0, arabicStrings = 0;
const hits = [];
const walk = (node, path, file) => {
  const leaf = path.split(".").pop().replace(/\[\d+\]$/, "");
  if (typeof node === "string") {
    strings++;
    if (!AR.test(node)) return;
    if (NOT_PROSE.has(leaf) || leaf.startsWith("_")) return;
    arabicStrings++;
    for (const r of RULES) {
      const found = r.test(node);
      if (found) hits.push({ file, path, rule: r.id, review: !!r.review, why: r.why, found: [...new Set(found)].slice(0, 4), text: node.length > 90 ? node.slice(0, 90) + "…" : node });
    }
    return;
  }
  if (Array.isArray(node)) return node.forEach((v, i) => walk(v, `${path}[${i}]`, file));
  if (node && typeof node === "object") return Object.entries(node).forEach(([k, v]) => walk(v, path ? `${path}.${k}` : k, file));
};

for (const f of readdirSync(DIR).filter((f) => f.endsWith(".json") && !SKIP_FILES.has(f)))
  walk(JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")), "", f);

/* والقوالب: كل نصّ عربي مكتوب داخل src/pages و src/lib. المحتوى وحده لم يكن كل النصّ. */
const srcDirs = ["src/pages", "src/lib"];
for (const d of srcDirs) for (const f of readdirSync(d).filter((f) => f.endsWith(".mjs"))) {
  const body = readFileSync(`${d}/${f}`, "utf8");
  body.split("\n").forEach((line, i) => {
    if (!AR.test(line)) return;
    /* أطول متتالية عربية في السطر، بما حولها من ترقيم — يكفي لقواعد الترقيم والأرقام */
    for (const m of line.matchAll(/[ء-ي][ء-ي\s،.؛؟!:«»()\[\]—\-0-9٠-٩]{2,}/g)) {
      const t = m[0].trim();
      if (t.length < 4) continue;
      strings++; arabicStrings++;
      for (const r of RULES) {
        if (FRAGMENT_UNSAFE.has(r.id)) continue;   // الشظيّة مقتطعة، فالتوازن والفراغ الطرفي بلا معنى
        const found = r.test(t);
        if (found) hits.push({ file: `${d}/${f}`, path: `:${i + 1}`, rule: r.id, review: !!r.review, why: r.why, found: [...new Set(found)].slice(0, 4), text: t.length > 90 ? t.slice(0, 90) + "…" : t });
      }
    }
  });
}

const errs = hits.filter((h) => !h.review), revs = hits.filter((h) => h.review);
const files = readdirSync(DIR).filter((f) => f.endsWith(".json") && !SKIP_FILES.has(f)).length;
console.log(`فُحص ${strings} نصّاً، منها ${arabicStrings} عربي، في ${files} ملف محتوى + قوالب src/pages و src/lib`);
const show = (list, head) => {
  if (!list.length) return;
  console.log(`\n${head}`);
  const byRule = {};
  for (const h of list) (byRule[h.rule] ||= []).push(h);
  for (const [rule, l] of Object.entries(byRule).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n■ ${rule} — ${l.length} (${l[0].why})`);
    for (const h of l.slice(0, 12)) console.log(`   ${h.file}:${h.path}\n     ${h.found.join(" · ")}   «${h.text}»`);
    if (l.length > 12) console.log(`   … و${l.length - 12} أخرى`);
  }
};
show(errs, "══ أخطاء ══");
show(revs, "══ للمراجعة (تحتاج جنس المفرد — الأداة لا تعرفه) ══");
if (!errs.length) console.log(`\n✔ لا أخطاء لغوية${revs.length ? ` · ${revs.length} موضعاً للمراجعة` : ""}`);
process.exit(errs.length ? 1 : 0);
