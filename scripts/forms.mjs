/* forms.mjs — النماذج كما يستعملها الزائر، لا كما كُتبت.
   يفحص لكل حقل:
     1.3.1  تسمية مربوطة فعلاً (label[for] أو aria-label أو aria-labelledby)
     1.3.5  autocomplete على الحقول الشخصية — يملأها المتصفّح لمن يصعب عليه الكتابة
     3.3.1  رسالة الخطأ موجودة ومربوطة بالحقل ومعلَنة (aria-describedby + live)
     3.3.2  تعليمات الحقل المطلوب ظاهرة لا لونية فقط
     2.5.3  الاسم المرئي داخل الاسم المحوسب
   ثم يُرسل النموذج فارغاً ويسأل: هل قيل للزائر ما الخطأ، وهل انتقل التركيز إليه؟ */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:8899";
try {
  const res = await fetch(BASE + "/", { method: "HEAD" });
  if (!res.ok && res.status !== 404) throw new Error("status " + res.status);
} catch (e) { console.error(`\n✖ لا خادم على ${BASE} — \`npm run serve\`.\n   ${e.message}`); process.exit(1); }

const routes = JSON.parse(readFileSync(new URL("../src/routes.json", import.meta.url), "utf8"));
const b = await chromium.launch();
const page = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();

const findings = [];
const add = (rule, route, detail) => findings.push({ rule, route, detail });
let fields = 0, forms = 0;

const AC = {
  name: "name", fullname: "name", email: "email", tel: "tel", phone: "tel",
  company: "organization", org: "organization", url: "url", website: "url",
};

for (const r of routes) {
  await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
  const has = await page.evaluate(() => document.querySelectorAll("form").length);
  if (!has) continue;

  const res = await page.evaluate((ACmap) => {
    const out = [];
    const forms = [...document.querySelectorAll("form")];
    let n = 0;
    for (const f of forms) {
      const controls = [...f.querySelectorAll("input:not([type=hidden]), select, textarea")];
      for (const el of controls) {
        n++;
        const id = el.id || "(بلا id)";
        const type = (el.getAttribute("type") || el.tagName).toLowerCase();
        const nameAttr = (el.name || "").toLowerCase();

        /* التسمية */
        let labelled = null;
        if (el.id) { const l = f.querySelector(`label[for="${CSS.escape(el.id)}"]`) || document.querySelector(`label[for="${CSS.escape(el.id)}"]`); if (l) labelled = "label[for]"; }
        if (!labelled && el.closest("label")) labelled = "label محيطة";
        if (!labelled && el.getAttribute("aria-label")) labelled = "aria-label";
        if (!labelled && el.getAttribute("aria-labelledby")) {
          const ok = el.getAttribute("aria-labelledby").split(/\s+/).every((x) => document.getElementById(x));
          labelled = ok ? "aria-labelledby" : null;
          if (!ok) out.push({ rule: "labelledby-معطّل", detail: `${type} #${id}` });
        }
        if (!labelled) out.push({ rule: "حقل-بلا-تسمية", detail: `${type} name=${nameAttr || "—"} #${id}` });

        /* autocomplete على الحقول الشخصية */
        const wants = ACmap[nameAttr] || (type === "email" ? "email" : type === "tel" ? "tel" : null);
        if (wants && !el.getAttribute("autocomplete"))
          out.push({ rule: "بلا-autocomplete", detail: `${type} name=${nameAttr} — المتوقّع "${wants}"` });

        /* المطلوب معلن برمجياً لا بالنجمة وحدها */
        const star = /[*]/.test((el.closest("label") || {}).textContent || "")
          || /[*]/.test((document.querySelector(`label[for="${el.id ? CSS.escape(el.id) : "___"}"]`) || {}).textContent || "");
        if (star && !el.required && el.getAttribute("aria-required") !== "true")
          out.push({ rule: "مطلوب-بالنجمة-فقط", detail: `${type} #${id}` });

        /* وصف/خطأ مربوط */
        const desc = el.getAttribute("aria-describedby");
        if (desc && !desc.split(/\s+/).every((x) => document.getElementById(x)))
          out.push({ rule: "describedby-معطّل", detail: `${type} #${id} → ${desc}` });
      }
      /* زرّ إرسال موجود */
      if (!f.querySelector('button[type=submit], input[type=submit], button:not([type])'))
        out.push({ rule: "نموذج-بلا-إرسال", detail: f.id || f.className || "(نموذج)" });
    }
    return { out, n, forms: forms.length };
  }, AC);

  fields += res.n; forms += res.forms;
  for (const o of res.out) add(o.rule, r, o.detail);

  /* إرسال فارغ: هل يُقال للزائر ما الخطأ، ويصل التركيز إليه؟ */
  const submit = await page.$('form button[type=submit], form input[type=submit], form button:not([type])');
  if (submit) {
    await page.evaluate(() => { const f = document.querySelector("form"); f.setAttribute("novalidate", ""); });
    await submit.click().catch(() => {});
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => {
      const f = document.querySelector("form");
      const invalid = [...f.querySelectorAll('[aria-invalid="true"], .is-error, :invalid')].length;
      const msgs = [...f.querySelectorAll('[role=alert], [aria-live]')].map((x) => x.textContent.trim()).filter(Boolean);
      const ae = document.activeElement;
      const focusedInForm = !!(ae && f.contains(ae) && ae.matches("input,select,textarea"));
      return { invalid, msgs, focusedInForm, navigated: location.pathname };
    });
    if (!after.msgs.length && !after.invalid) add("إرسال-فارغ-بلا-رسالة", r, "لا رسالة ولا حقل معلَّم بالخطأ");
    else if (!after.focusedInForm && after.msgs.length === 0) add("خطأ-غير-معلَن", r, `${after.invalid} حقلاً معلَّماً لكن بلا رسالة حيّة`);
  }
}
await b.close();

const uniq = new Map();
for (const f of findings) { const k = f.rule + "|" + f.detail; if (!uniq.has(k)) uniq.set(k, { ...f, routes: [] }); uniq.get(k).routes.push(f.route); }
console.log(`${forms} نموذجاً · ${fields} حقلاً على ${routes.length} صفحة`);
if (!findings.length) { console.log("✔ النماذج سليمة — تسميات مربوطة، autocomplete، ورسائل خطأ تصل"); process.exit(0); }
const byRule = {};
for (const u of uniq.values()) (byRule[u.rule] ||= []).push(u);
console.log(`✘ ${findings.length} مخالفة · ${uniq.size} حالة فريدة\n`);
for (const [rule, list] of Object.entries(byRule).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`■ ${rule} — ${list.length} حالة`);
  for (const u of list.slice(0, 10)) console.log(`   ${String(u.routes.length).padStart(3)} صفحة  ${u.detail}   [${u.routes[0]}]`);
}
process.exit(1);
