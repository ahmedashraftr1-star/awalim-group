/* ==========================================================================
   components.mjs — the component library (section 3.4 of the design brief).
   Each export is a pure function → HTML string. Class names map 1:1 to
   assets/css/components.css. No magic numbers here: spacing, radius and
   colour come from tokens via CSS custom properties.
   ========================================================================== */
import { esc, attrs, join, num, fill, bdi, affix, isLatinText } from "./html.mjs";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join as joinPath, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = joinPath(dirname(fileURLToPath(import.meta.url)), "..", "..");
import { icon } from "./icons.mjs";

/* ---------- inline pieces ---------- */
export const arrow = () => `<span class="btn__arrow" aria-hidden="true">${icon("arrow")}</span>`;

/** Eyebrow: "Arabic · LATIN" — the Latin half gets lang="en" and the tracked class. */
export const eyebrow = (ar, latin = "", extra = "") =>
  `<p class="eyebrow${extra ? " " + extra : ""}"><span>${ar}</span>${latin ? `<span class="eyebrow__sep" aria-hidden="true">·</span><span class="eyebrow__latin" lang="en">${esc(latin)}</span>` : ""}</p>`;

/** Section head: eyebrow → display-1 → one lede line. */
export const sectionHead = ({ eyebrowAr, eyebrowEn = "", h, lede = "", level = 2, cls = "", wide = false }) => `
  <div class="sec-head rv${wide ? " sec-head--wide" : ""}${cls ? " " + cls : ""}">
    ${eyebrowAr ? eyebrow(eyebrowAr, eyebrowEn) : ""}
    <h${level} class="d-1 klh"><span class="klh__in">${h}</span></h${level}>
    ${lede ? `<p class="lede">${lede}</p>` : ""}
  </div>`;

/* ---------- buttons ---------- */
export const btn = ({ href, label, kind = "primary", size = "", arrow: withArrow = kind === "primary", attrs: a = {}, external = false }) => {
  const cls = `btn btn--${kind}${size ? ` btn--${size}` : ""}`;
  const rel = external ? { target: "_blank", rel: "noopener" } : {};
  return `<a${attrs({ class: cls, href, ...rel, ...a })}><span>${label}</span>${withArrow ? arrow() : ""}</a>`;
};
export const btnRow = (buttons, cls = "") => `<div class="btn-row${cls ? " " + cls : ""}">${join(buttons, "")}</div>`;

export const waLink = (site, label = "واتساب مباشر", kind = "ghost") =>
  btn({ href: `https://wa.me/${site.contact.whatsapp}`, label: `${icon("whatsapp")} ${label}`, kind, arrow: false, external: true });

/* ---------- chips / codes ---------- */
export const chip = (label, kind = "") => `<span class="chip${kind ? ` chip--${kind}` : ""}">${label}</span>`;
export const chips = (list, kind = "") => `<div class="chips">${list.map((l) => chip(l, kind)).join("")}</div>`;

/** System code chip: SYS-XXX-00 + status dot (live green / beta amber). */
export const syscode = (code, status = "live", withLabel = true) =>
  `<span class="syscode" data-status="${status}"><span class="syscode__dot" aria-hidden="true"></span><span class="syscode__code" lang="en">${esc(code)}</span>${withLabel ? `<span class="syscode__st">${status === "beta" ? "تجريبي" : "يعمل"}</span>` : ""}</span>`;

/* ---------- stat tiles ---------- */
export const statTile = (s, { size = "", key = "" } = {}) => {
  const v = s.count
    ? `<span data-count="${s.value}">${num(s.value)}</span>`
    : `<span class="num">${esc(String(s.value))}</span>`;
  const a = affix(s, isLatinText(s.label));
  return `<div class="stat${size ? ` stat--${size}` : ""}"${key ? ` data-stat="${key}"` : ""}><div class="stat__n"><span class="stat__pre">${esc(a.pre)}</span>${v}<span class="stat__suf">${esc(a.suf)}</span></div><div class="stat__l">${esc(s.label)}</div></div>`;
};
export const statBar = (keys, stats, { size = "lg", cls = "", verify = false, signing = null, autorun = false, sixWide = false } = {}) => {
  const bar = `<div class="statbar rv${cls ? " " + cls : ""}${sixWide ? " statbar--6" : ""}" data-stagger>${keys.map((k) => statTile(stats[k], { size, key: k })).join("")}</div>`;
  if (!verify || !signing) return bar;
  const en = keys.length ? isLatinText(stats[keys[0]]?.label) : false;
  return `<div class="statwrap">${bar}${verifyPanel(signing, { autorun, en })}</div>`;
};

/** In-browser verification panel: SHA-256 + Ed25519 + published key + DOM==payload. */
/* Outside /verify (autorun) the button speaks plainly — «أرقام قابلة للتحقق» —
   and the algorithm name stays on /verify, where the visitor came for it. */
export const verifyPanel = (signing, { autorun = false, en = false } = {}) => `
  <div class="verify rv" data-verify data-pubkey="${esc(signing.publicKey)}" data-issued="${esc(signing.issued)}"${autorun ? " data-verify-auto" : ""}${signing.unsigned ? " data-unsigned" : ""}>
    <button class="verify__btn" type="button" data-verify-run aria-expanded="false" aria-controls="verify-panel">
      <span class="verify__lock" aria-hidden="true">${icon("lock")}</span>
      <span>${signing.unsigned ? "الأرقام تغيّرت ولم تُوقَّع بعد" : autorun ? "هذه الأرقام موقّعة تشفيريّاً — تحقّق منها في متصفّحك" : en ? "Verifiable figures" : "أرقام قابلة للتحقق"}</span>
      ${autorun ? `<span class="verify__meta mono" lang="en">Ed25519 · ${esc(signing.issued)}</span>` : ""}
    </button>
    <div class="verify__panel" id="verify-panel" hidden>
      <ol class="verify__checks">
        <li data-check="hash"><span class="verify__ic" aria-hidden="true">${icon("check")}</span><span>الهاش يطابق</span><span class="verify__d mono" lang="en">SHA-256</span></li>
        <li data-check="sig"><span class="verify__ic" aria-hidden="true">${icon("check")}</span><span>التوقيع صحيح</span><span class="verify__d mono" lang="en">Ed25519 · WebCrypto</span></li>
        <li data-check="key"><span class="verify__ic" aria-hidden="true">${icon("check")}</span><span>المفتاح منشور</span><span class="verify__d mono" lang="en">${esc(signing.publicKey.slice(0, 12))}…</span></li>
        <li data-check="dom"><span class="verify__ic" aria-hidden="true">${icon("check")}</span><span>الأرقام المعروضة = الأرقام الموقّعة</span><span class="verify__d" data-check-dom-d></span></li>
      </ol>
      <p class="verify__out small" data-verify-out aria-live="polite"></p>
      <a class="lnk" href="/verify"><span>كيف يعمل هذا؟</span>${arrow()}</a>
    </div>
  </div>`;

/** Impact tile from case/product data: {stat:key} | {n,prefix,suffix,label} | {text,label} */
export const impactTile = (t, stats) => {
  if (t.stat) return statTile(stats[t.stat], { size: "lg" });
  if (t.text !== undefined)
    /* a worded stat may wrap, so bind each separator to the word before it —
       otherwise «CMYK · RGB» breaks into «CMYK» / «· RGB», orphaning the dot */
    return `<div class="stat stat--lg"><div class="stat__n"><span class="stat__txt">${esc(t.text).replace(/ ([·—–]) /g, "\u00A0$1 ")}</span></div><div class="stat__l">${esc(t.label)}</div></div>`;
  return statTile({ value: t.n, prefix: t.prefix || "", suffix: t.suffix || "", label: t.label, count: true }, { size: "lg" });
};

/* ---------- feature rows ---------- */
export const featureRow = (f) => `
  <div class="frow">
    <span class="frow__ic" aria-hidden="true">${icon(f.icon || "spark")}</span>
    <div class="frow__b"><b>${f.t}</b><span>${f.d}</span></div>
  </div>`;
export const featureList = (list, cols = 2) => `<div class="frows frows--${cols} rv" data-stagger>${list.map(featureRow).join("")}</div>`;

/* ---------- metric bar (Jonny Czar & Enterprise Grade) ---------- */
export const metricBar = ({ metric = {}, href, ctaLabel = "دراسة الحالة", stats = {} }) => {
  const items = [];
  // Only what the data actually says. A rating or an uptime figure appears
  // when a case carries one — never a default.
  if (metric.rating) {
    items.push(`<div class="mbar__meta"><b class="mbar__val">${esc(metric.rating)}</b><span class="mbar__sub">تقييم</span></div>`);
  }

  if (metric.users) {
    items.push(`<div class="mbar__meta"><span class="mbar__ic">${icon("globe")}</span><b class="mbar__val">${fill(metric.users, stats)}</b><span class="mbar__sub">مستخدم</span></div>`);
  }

  if (metric.platform) {
    items.push(`<div class="mbar__meta mbar__meta--hide-sm"><span class="mbar__ic">${icon("phone")}</span><b class="mbar__val">${esc(metric.platform)}</b></div>`);
  }
  if (metric.honor) {
    items.push(`<div class="mbar__meta mbar__meta--badge"><span class="mbar__ic">${icon("award")}</span><b class="mbar__val">${fill(metric.honor, stats)}</b></div>`);
  }

  return `
  <div class="mbar mbar--elevation">
    <div class="mbar__list">${items.join("")}</div>
    ${href ? `<a class="btn btn--sm btn--primary mbar__cta" href="${href}"><span>${ctaLabel}</span>${arrow()}</a>` : ""}
  </div>`;
};

/* ---------- device mockups (section 3.5) ---------- */
/* Downscaled siblings (name-<w>.webp) for images whose original is far wider
   than any box it fills. Widths listed smallest first; the last is the
   original. "auto" lets Chromium pick by the laid-out width of lazy images;
   other engines skip it and use the fallback, which errs toward sharp. */
const IMG_WIDTHS = {
  "/assets/img/work/rahmacare-ledger.webp": [600, 1200, 1760],
  "/assets/img/work/islandhaven-verify.webp": [600, 1200, 1760],
  "/assets/img/work/island-haven-live.webp": [600, 1200, 2160],
  "/assets/img/work/island-haven-programs.webp": [600, 1200, 2160],
  "/assets/img/work/island-haven-visit.webp": [600, 1200, 2160],
  "/assets/img/work/jameel-store-ui.webp": [600, 1024],
  "/assets/img/work/maya-brand.webp": [600, 1024],
  "/assets/img/work/card_1.webp": [600, 1024],
  "/assets/img/work/social-design.webp": [600, 1024],
  "/assets/img/ahmed-personal.webp": [[96, 171], 768, 1024]
};
export const srcset = (src) => {
  const ws = IMG_WIDTHS[src];
  if (!ws) return "";
  return ws.map((w, i) => {
    const [name, real] = Array.isArray(w) ? w : [w, w];
    return `${i === ws.length - 1 ? src : src.replace(/\.webp$/, `-${name}.webp`)} ${real}w`;
  }).join(", ");
};
/* sizes fallback: cards top out near 570px; a full-width frame (case hero,
   gallery) at 1000px. "auto" is only valid on lazy images. */
const imgSizes = (lazy, wide) => `${lazy ? "auto, " : ""}${wide ? "(min-width: 1100px) 1000px, 92vw" : "(min-width: 1200px) 600px, 92vw"}`;
const img = (src, alt, { w = 1000, h = 750, lazy = true, wide = true } = {}) =>
  `<img src="${src}"${srcset(src) ? ` srcset="${srcset(src)}" sizes="${imgSizes(lazy, wide)}"` : ""} alt="${esc(alt)}" width="${w}" height="${h}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`;

export const device = ({ kind = "browser", src, alt = "", tilt = true, parallax = true, lazy = true, label = "", inner = "" }) => {
  const a = attrs({ class: `dev dev--${kind}${tilt ? " dev--tilt" : ""}`, "data-tilt": tilt ? "" : null, "data-parallax": parallax ? "" : null, role: inner ? "img" : null, "aria-label": inner ? alt : null });
  const screen = inner ? inner : src ? img(src, alt, { lazy, wide: kind === "frame" }) : "";
  switch (kind) {
    case "phone":
      return `<div${a}><div class="dev__phone"><span class="dev__notch" aria-hidden="true"></span><div class="dev__screen">${screen}</div></div></div>`;
    case "laptop":
      return `<div${a}><div class="dev__lid"><div class="dev__bar" aria-hidden="true"><i></i><i></i><i></i><span class="dev__url">${esc(label || "awalimgroup.com")}</span></div><div class="dev__screen">${screen}</div></div><div class="dev__base" aria-hidden="true"></div></div>`;
    case "figma":
      return `<div${a}><div class="dev__bar" aria-hidden="true"><i></i><i></i><i></i><span class="dev__tab" lang="en">Figma · ${esc(label || "Design")}</span></div><div class="dev__figma"><span class="dev__tools" aria-hidden="true"><i></i><i></i><i></i><i></i></span><div class="dev__screen">${screen}</div></div></div>`;
    case "frame":
      return `<div${a}><div class="dev__screen dev__screen--frame">${screen}</div></div>`;
    case "browser":
    default:
      return `<div${a}><div class="dev__bar" aria-hidden="true"><i></i><i></i><i></i><span class="dev__url" lang="en">${esc(label || "awalimgroup.com")}</span></div><div class="dev__screen">${screen}</div></div>`;
  }
};

/** Live sovereign multi-console — interactive mock used in hero, product and case pages. */
export const cockpit = ({ tilt = true, parallax = true, live = true, cls = "", interactive = false } = {}) => `
  <div${attrs({ class: `dev dev--cockpit${tilt ? " dev--tilt" : ""}${cls ? " " + cls : ""}`, "data-tilt": tilt ? "" : null, "data-parallax": parallax ? "" : null, "data-cockpit": live ? "" : null, "data-ledger": interactive ? "" : null, "data-cursor": interactive ? "جرّب" : null, role: interactive ? "group" : "img", "aria-label": interactive ? "لوحة قيادة تفاعلية لمحاسب ذكي: صوِّر فاتورة أو سجّل مبيعة ليقترح النظام قيداً مزدوجاً متوازناً تعتمده" : "لقطة توضيحية من لوحة قيادة محاسب ذكي تعرض الإيرادات والمصروفات وصافي التدفّق وآخر قيد مُسجَّل متوازناً" })}>
    <div class="dev__bar" aria-hidden="false">
      <div class="dev__dots" aria-hidden="true"><i></i><i></i><i></i></div>
      ${interactive ? `
      <span class="dev__url">محاسب ذكي · تجربة تفاعلية</span>
      ` : `<span class="dev__url">cockpit · محاسب ذكي</span>`}
    </div>
    <div class="cockpit"${interactive ? "" : ' aria-hidden="true"'}>
      <!-- Mode 1: Smart Accountant -->
      <div class="cockpit__panel is-active" data-panel="ledger">
        <div class="cockpit__kpis">
          <div class="cockpit__kpi"><span>الإيرادات</span><b class="num" data-count="482900" data-count-live data-k="rev">482,900</b></div>
          <div class="cockpit__kpi"><span>المصروفات</span><b class="num" data-count="311240" data-count-live data-k="exp">311,240</b></div>
          <div class="cockpit__kpi cockpit__kpi--acc"><span>صافي التدفّق</span><b class="num">+<span data-count="171660" data-count-live data-k="net">171,660</span></b></div>
        </div>
        <div class="cockpit__bars" data-bars>
          <i style="--h:38%"></i><i style="--h:52%"></i><i style="--h:44%"></i><i style="--h:67%"></i>
          <i style="--h:58%"></i><i style="--h:79%"></i><i style="--h:71%"></i><i style="--h:92%"></i>
        </div>
        <div class="cockpit__rows" data-ledger-rows>
          <div class="cockpit__row"><span>آخر قيد · <span class="mono">رقم <span data-ledger-n>2478</span></span></span><b class="cockpit__ok">متوازن <span class="cockpit__tick">${icon("check")}</span></b></div>
          <div class="cockpit__row"><span>فاتورة كهرباء — التُقطت بالكاميرا</span><b class="mono">150.00</b></div>
          <div class="cockpit__row"><span>مسيَّر الرواتب — رُحِّل تلقائياً</span><b class="mono" lang="en">IAS 19</b></div>
        </div>
        ${interactive ? `
        <div class="ledger__prop" data-ledger-proposal hidden></div>
        <div class="ledger__act">
          <button class="btn btn--sm btn--accent" type="button" data-ledger-action="scan">${icon("camera")}<span>صوِّر فاتورة</span></button>
          <button class="btn btn--sm btn--ghost" type="button" data-ledger-action="sale">${icon("plus")}<span>سجّل مبيعة</span></button>
          <span class="ledger__hint">جرّب بنفسك — قيد مزدوج يُحسب فعلياً</span>
        </div>
        <p class="sr-only" aria-live="polite" data-ledger-live></p>` : ""}
      </div>

    </div>
  </div>`;

/** Interactive project scope and investment estimator. */
export const scopeEstimator = (site, isEn = false) => `
<section class="sec sec--alt" id="estimator" aria-labelledby="estimator-h">
  <div class="wrap wrap--wide">
    <div class="estimator rv" data-stagger data-estimator>
      <div class="estimator__head">
        ${eyebrow(isEn ? "Project scope" : "نطاق المشروع", "")}
        <h2 class="d-1" id="estimator-h">${isEn ? "Shape your starting scope" : "حدّد نطاقك المبدئي"}</h2>
        <p class="lede">${isEn ? "Pick what you need and send it to us as it is. We come back with a diagnosis and a scope, before any code." : "اختر ما تحتاجه وأرسله لنا كما هو — نعود إليك بتشخيص وتقدير نطاق، قبل أي كود."}</p>
      </div>
      <div class="estimator__grid">
        <div class="estimator__form">
          <div class="estimator__grp">
            <span class="estimator__label">${isEn ? "Requested System Type" : "نوع النظام المطلوب"}</span>
            <div class="estimator__options">
              <label class="estimator__opt"><input type="radio" name="scope_type" value="enterprise" checked><span>${isEn ? "Integrated Enterprise System" : "نظام مؤسسي متكامل"}</span></label>
              <label class="estimator__opt"><input type="radio" name="scope_type" value="agents"><span>${isEn ? "Autonomous AI Agents" : "وكلاء ذكاء اصطناعي"}</span></label>
              <label class="estimator__opt"><input type="radio" name="scope_type" value="mobile"><span>${isEn ? "Mobile app" : "تطبيق موبايل"}</span></label>
              <label class="estimator__opt"><input type="radio" name="scope_type" value="brand"><span>${isEn ? "Brand & Design System" : "هوية ونظام تصميم"}</span></label>
            </div>
          </div>
          <div class="estimator__grp">
            <span class="estimator__label">${isEn ? "Platforms & Integrations" : "المنصات والربط"}</span>
            <div class="estimator__checks">
              <label class="estimator__opt"><input type="checkbox" name="scope_feat" value="dashboard" checked><span>${isEn ? "Web Portal & Dashboard" : "لوحة تحكّم وبوابة ويب"}</span></label>
              <label class="estimator__opt"><input type="checkbox" name="scope_feat" value="mobile" checked><span>${isEn ? "iOS & Android Apps" : "تطبيقات iOS وأندرويد"}</span></label>
              <label class="estimator__opt"><input type="checkbox" name="scope_feat" value="ai"><span>${isEn ? "Local Private AI Engine" : "محرك ذكاء اصطناعي محلي"}</span></label>
              <label class="estimator__opt"><input type="checkbox" name="scope_feat" value="offline"><span>${isEn ? "Offline Sync & Encrypted Ledger" : "مزامنة أوفلاين وسجل مشفّر"}</span></label>
            </div>
          </div>
        </div>
        <div class="estimator__summary">
          <div class="estimator__card">
            <div class="estimator__card-h">
              <span>${isEn ? "Your starting scope" : "نطاقك المبدئي"}</span>
            </div>
            <div class="estimator__kpis">
              <div class="estimator__kpi"><span>${isEn ? "How it starts" : "كيف يبدأ"}</span><ol class="estimator__steps">${(site.process || []).slice(0, 3).map((p) => `<li><span>${esc(p.t)}</span><b>${esc(p.dur).replace(/(\d+\s*[–-]\s*\d+|\d+)/g, '<bdi dir="ltr">$1</bdi>')}</b></li>`).join("")}</ol></div>
              <p class="small muted estimator__note">${isEn ? "The full timeline is set in the scope document after diagnosis. We don't quote a number before we've seen the work." : "المدة الكاملة تُحدَّد في وثيقة النطاق بعد التشخيص — لا نعطي رقماً قبل أن نرى العمل."}</p>
              <div class="estimator__kpi"><span>${isEn ? "Standards we work to" : "المعايير التي نعمل بها"}</span><b>${isEn ? "Each client's data kept apart · Usable by everyone (WCAG AA) · Fast on any device" : "بيانات كل عميل معزولة · يستخدمه الجميع (WCAG AA) · سريع على أي جهاز"}</b></div>
            </div>
            <div class="estimator__actions">
              <a class="btn btn--primary btn--full" href="https://wa.me/970593636136" target="_blank" rel="noopener" data-est-wa>
                ${arrow()}<span>${isEn ? "Send Specifications to WhatsApp" : "إرسال المواصفات إلى واتساب"}</span>
              </a>
              <a class="btn btn--ghost btn--full" href="/contact">
                <span>${isEn ? "Or reach out via project inquiry form" : "أو تواصل عبر نموذج المشاريع"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;

export const themeStyle = (t) => (!t || !t.bg || !t.dark) ? "" : `--l-bg:${t.bg};--l-fg:${t.fg};--l-dim:${t.dim};--l-accent:${t.accent};--d-bg:${t.dark.bg};--d-fg:${t.dark.fg};--d-dim:${t.dark.dim};--d-accent:${t.dark.accent}`;

/* ---------- HERO CARD (case / product) — section 3.4 #5 ---------- */
/* A case's own results, as the case study states them (cases.json → impact):
   a number with its affix, a word (AA, RTL, IAS 19), or a signed stat.
   Items with nothing to show are dropped rather than printed empty. */
export const impactList = (impact = [], stats = {}) => {
  const rows = impact.map((x) => {
    if (x.stat) {
      const s = stats[x.stat];
      if (!s) return null;
      const a = affix(s, isLatinText(s.label));
      return { v: `${a.pre}${Number(s.value).toLocaleString("en-US")}${a.suf}`, l: s.label };
    }
    if (typeof x.n === "number") return { v: `${x.prefix || ""}${x.n.toLocaleString("en-US")}${x.suffix || ""}`, l: x.label };
    if (x.text) return { v: x.text, l: x.label };
    return null;
  }).filter((r) => r && r.l);
  if (!rows.length) return "";
  return `<dl class="hfacts">${rows.map((r) => `<div class="hfacts__i"><dt class="hfacts__v"><bdi>${esc(r.v)}</bdi></dt><dd class="hfacts__l">${esc(r.l)}</dd></div>`).join("")}</dl>`;
};

export const heroCard = ({ theme, themes, code, status = "live", kind, title, headline, summary, href, device: dev, image, mock = null, alt, metric, ctaLabel = "دراسة الحالة", stats = {}, id = "", tags = [], lazy = true, center = false, tilt = true, level = 3, impact = [], showImpact = false }) => {
  const t = themes[theme] || themes.accounting;
  const slug = href.split("/").filter(Boolean).pop();
  const style = `${themeStyle(t)};view-transition-name:vt-${slug};view-transition-class:vt-card`;
  const media =
    dev === "cockpit" ? cockpit({ tilt, live: true })
    : mock ? device({ kind: dev === "phone" ? "browser" : dev || "browser", inner: mockScreen(mock), alt: alt || title, tilt, label: title })
    : image ? device({ kind: dev || "browser", src: image, alt: alt || title, lazy, tilt, label: title })
    : "";
  return `
  <article${attrs({ class: `hcard themed rv${t.ink ? " hcard--ink" : ""}${center || !media ? " hcard--center" : ""}`, id: id || null, style, "data-cursor": "افتح", "data-tilt": media ? "" : null })} data-theme-card="${theme}">
    <div class="hcard__t">
      <div class="hcard__eyebrow">${syscode(code, status)}${kind ? `<span class="hcard__kind">${esc(kind)}</span>` : ""}</div>
      <h${level} class="hcard__h d-2"><a href="${href}"><span class="hcard__name" ${/[A-Za-z]/.test(title) ? 'lang="en"' : ""}>${esc(title)}</span> <span class="hcard__sub">— ${headline}</span></a></h${level}>
      <p class="hcard__p">${summary}</p>
      ${tags.length ? chips(tags, "card") : ""}
    </div>
    ${media ? `<div class="hcard__media">${media}</div>` : ""}
    ${showImpact ? `<div class="hcard__impact">${impactList(impact, stats)}</div>` : ""}
    <div class="hcard__bar">${metricBar({ metric, href, ctaLabel, stats })}</div>
  </article>`;
};

/* ---------- small product/eco card (3×2 grid) ---------- */
export const pcard = (p, themes) => {
  const t = themes[p.theme] || themes.accounting;
  return `
  <article class="pcard rv" style="--card-accent:${t.accent}">
    <div class="pcard__hd">${syscode(p.code, p.status)}</div>
    <h3 class="pcard__h">${esc(p.title)}</h3>
    <p class="pcard__p">${p.summary}</p>
    <a class="lnk" href="${p.href}"><span>استعرض</span>${arrow()}</a>
  </article>`;
};

/* ---------- sticky side index (3.4 #10) ---------- */
export const sideIndex = (groups, label = "فهرس الصفحة") => `
  <nav class="sideidx" data-spy aria-label="${esc(label)}">
    <span class="sideidx__bar" aria-hidden="true"></span>
    ${groups.map((g) => `
      <div class="sideidx__g">
        ${g.title ? `<p class="sideidx__h">${esc(g.title)}</p>` : ""}
        <ol class="sideidx__list">${g.items.map((it) => `<li><a href="#${it.id}">${esc(it.label)}</a></li>`).join("")}</ol>
      </div>`).join("")}
  </nav>`;

/* ---------- accordion (3.4 #11) ---------- */
export const accordion = (items, { name = "faq", cls = "" } = {}) => `
  <div class="acc rv${cls ? " " + cls : ""}">
    ${items.map((it, i) => `
      <details class="acc__it" ${name ? `name="${name}"` : ""}>
        <summary class="acc__q"><span>${it.q}</span><span class="acc__ic" aria-hidden="true">${icon("plus")}</span></summary>
        <div class="acc__a"><div class="acc__in"><p>${it.a}</p></div></div>
      </details>`).join("")}
  </div>`;

/* ---------- CTA band ---------- */
/* The executive dossier is a real file: its size and SHA-256 are read from
   disk at build time so the card can never claim a hash it does not have. */
const DOSSIER = (() => {
  const out = {};
  for (const [k, file] of [["ar", "Awalim_Group_Executive_Dossier_2026.pdf"], ["en", "Awalim_Group_Executive_Dossier_2026_EN.pdf"]]) {
    const p = joinPath(ROOT, "assets/dossier", file);
    if (!existsSync(p)) continue;
    const buf = readFileSync(p);
    const sha = createHash("sha256").update(buf).digest("hex");
    out[k] = { href: `/assets/dossier/${file}`, mb: (buf.length / 1048576).toFixed(1), sha, short: `${sha.slice(0, 4)}…${sha.slice(-4)}` };
  }
  return out;
})();
export const dossier = (isEn = false) => DOSSIER[isEn ? "en" : "ar"] || DOSSIER.ar || null;

export const ctaBand = ({ eyebrowAr = "الخطوة التالية", h, lede, primary, site, wa = true, cls = "" }) => {
  const d = dossier(!!(site && site.locale === "en"));
  const st = (site && site.stats) || {};
  const sv = (k) => (st[k] ? `${st[k].prefix || ""}${num(st[k].value)}${st[k].suffix || ""}` : "");
  const stat = (k) => st[k] ? `<div class="dossier-stat"><span class="dossier-stat__val mono" dir="ltr">${sv(k)}</span><span class="dossier-stat__lbl">${esc(st[k].label)}</span></div>` : "";
  return `
  <section class="band rv${cls ? " " + cls : ""}" data-sovereign-band>
    <div class="wrap wrap--wide">
      <div class="band__grid">
        <div class="band__lead">
          ${eyebrow(eyebrowAr, "", "")}
          <h2 class="d-1 band__h">${h}</h2>
          ${lede ? `<p class="lede band__lede">${lede}</p>` : ""}
          ${btnRow([btn(primary), wa ? waLink(site) : "", d ? `<a href="${d.href}" download class="btn btn--outline"><span>${icon("pdf", "btn__ic")} ملف الأعمال التنفيذي (PDF)</span></a>` : ""], "band__actions")}
          <ul class="band__trust" aria-label="ما نلتزم به">
            <li><span class="dot" aria-hidden="true"></span>${esc((site && site.contact && site.contact.responseTime) || "نعود إليك خلال يومَي عمل")}</li>
            <li><span class="dot" aria-hidden="true"></span>الكود ملك لك بالكامل</li>
            <li><span class="dot" aria-hidden="true"></span>أرقام منشورة موقّعة وقابلة للتحقّق</li>
          </ul>
        </div>
        ${d ? `
        <aside class="band__card" aria-label="ملف الأعمال التنفيذي">
          <div class="dossier-card">
            <div class="dossier-card__hd">
              <span class="mono dossier-card__code" dir="ltr">DOSSIER · 2026</span>
              <span class="dossier-card__seal"><span class="dot" aria-hidden="true"></span>PDF · ${d.mb} MB</span>
            </div>
            <h3 class="d-2 dossier-card__title">ملف الأعمال التنفيذي</h3>
            <p class="dossier-card__sub">دراسات الحالة والمنتجات كما بُنيت، في ملف واحد يُقرأ دون اتصال. الأرقام فيه هي الأرقام الموقّعة نفسها المنشورة على الموقع.</p>
            <div class="dossier-card__stats">
              ${["systemsDelivered", "clientCountries", "engineersTrained", "yearsBuilding"].map((k) => stat(k)).join("")}
            </div>
            <div class="dossier-card__ft">
              <a href="${d.href}" download class="dossier-btn-download">${icon("download", "btn__ic")}<span>تنزيل ملف الأعمال (PDF)</span></a>
              <div class="dossier-card__meta">
                <span class="small mono" dir="ltr" title="SHA-256: ${d.sha}">SHA-256 ${d.short}</span>
                <a href="/verify" class="small">تحقّق من الأرقام الموقّعة ←</a>
              </div>
            </div>
          </div>
        </aside>` : ""}
      </div>
    </div>
  </section>`;
};

/* ---------- journal post card ---------- */
export const postCard = (a, { lazy = true } = {}) => `
  <a class="post rv" href="/journal/${a.slug}" data-cat="${a.cat}" data-cursor="اقرأ" style="view-transition-name:vt-a-${a.slug};view-transition-class:vt-card">
    <span class="post__img">${img(a.image, "", { w: 800, h: 500, lazy, sizes: "(min-width: 900px) 33vw, 100vw" })}</span>
    <span class="post__body">
      <span class="post__meta">${esc(a.catLabel)} · ${esc(a.readLabel)}</span>
      <span class="post__h">${a.title}</span>
      <span class="post__p">${a.excerpt}</span>
    </span>
  </a>`;

/* ---------- timeline (group page) ---------- */
export const timeline = (items) => `
  <div class="tline" data-timeline>
    <span class="tline__rail" aria-hidden="true"><span class="tline__fill"></span></span>
    ${items.map((it, i) => `
      <div class="tline__it rv" style="--i:${i}">
        <span class="tline__dot" aria-hidden="true"></span>
        <span class="tline__y num">${esc(it.y)}</span>
        <div class="tline__b"><h3>${it.t}</h3><p>${it.d}</p></div>
      </div>`).join("")}
  </div>`;

/* ---------- pinned process (4.4) ---------- */
export const processPinned = (steps, { id = "process" } = {}) => `
  <div class="proc" id="${id}" data-process>
    <div class="proc__stage">
      <div class="proc__side" aria-hidden="true">
        <span class="proc__label">مسار العمل</span>
        <ol class="proc__dots">${steps.map((s, i) => `
          <li data-proc-dot${i === 0 ? ' class="is-on"' : ""}>
            <span class="proc__dn mono">${esc(s.n)}</span>
            <span class="proc__dt">${esc(s.t)}</span>
            ${s.dur ? `<span class="proc__dd">${esc(s.dur)}</span>` : ""}
          </li>`).join("")}
        </ol>
        <div class="proc__progress"><span data-proc-bar></span></div>
        <span class="proc__count"><span data-proc-cur>01</span><span class="proc__of">/ 0${steps.length}</span></span>
      </div>
      <div class="proc__panels">
        ${steps.map((s, i) => `
          <article class="proc__p${i === 0 ? " is-on" : ""}" data-proc-panel aria-label="المرحلة ${esc(s.n)}: ${esc(s.t)}">
            <div class="proc__head">
              <span class="proc__n mono">${esc(s.n)}</span>
              ${s.dur ? `<span class="proc__dur">${esc(s.dur)}</span>` : ""}
            </div>
            <h3 class="d-2">${s.t}</h3>
            <p>${s.d}</p>
            ${s.out ? `<div class="proc__out">
              <h4 class="proc__oh">تخرج بـ</h4>
              <ul class="proc__ol">${s.out.map((o) => `<li>${o}</li>`).join("")}</ul>
            </div>` : chips(s.tags || [])}
            ${s.keep ? `<p class="proc__keep"><b>إن توقّفنا هنا:</b> ${s.keep}</p>` : ""}
          </article>`).join("")}
      </div>
    </div>
  </div>`;

/* ---------- why us: a claim is only as good as the place you can check it ---------- */
export const whyGrid = (reasons) => `
  <ol class="why rv" data-stagger>
    ${reasons.map((r, i) => `
      <li class="why__i">
        <span class="why__n mono" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="why__t">${r.t}</h3>
        <p class="why__d">${r.d}</p>
        <a class="lnk why__a" href="${esc(r.href)}"><span>${esc(r.cta)}</span>${arrow()}</a>
      </li>`).join("")}
  </ol>`;

/* ---------- measured comparison ----------
   scripts/compare.mjs produced this and nothing rendered it. The numbers are
   medians of interleaved runs, and one column is one we lose — which is the
   only reason the other three are worth reading. Best-in-column is marked with
   a word as well as a colour: 1.4.1 does not accept colour alone. */
export const compareStrip = (cmp, copy = {}) => {
  const cols = [
    { k: "kb",       h: "الوزن",         u: "ك.ب" },
    { k: "requests", h: "الطلبات",       u: "" },
    { k: "fcp",      h: "أوّل رسم",       u: "م.ث" },
    { k: "load",     h: "اكتمال التحميل", u: "م.ث" },
  ];
  const rows = (cmp.rows || []).filter((r) => r.ok);
  if (!rows.length) return "";
  const best = Object.fromEntries(cols.map((c) => [c.k, Math.min(...rows.map((r) => r[c.k]))]));
  return `
  <figure class="cmp rv">
    <div class="cmp__scroll">
      <table class="cmp__t">
        <caption class="sr-only">قياس وزن الصفحة وسرعتها: عوالِم مقابل مواقع أخرى</caption>
        <thead><tr>
          <th scope="col">الموقع</th>
          ${cols.map((c) => `<th scope="col">${c.h}${c.u ? ` <span class="cmp__u">${c.u}</span>` : ""}</th>`).join("")}
        </tr></thead>
        <tbody>
          ${rows.map((r) => `<tr${r.ours ? ' class="is-ours"' : ""}>
            <th scope="row">${esc(r.name)}${r.ours ? ` <span class="cmp__us">نحن</span>` : ""}</th>
            ${cols.map((c) => `<td${r[c.k] === best[c.k] ? ' class="is-best"' : ""}>${num(r[c.k])}${r[c.k] === best[c.k] ? `<span class="sr-only"> — الأفضل في هذا العمود</span>` : ""}</td>`).join("")}
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <figcaption class="cmp__note">
      ${esc(copy.note || "")
        .replace("{repeats}", num(cmp.repeats))
        /* التاريخ ISO داخل فقرة عربية: الشرطات محايدة والأرقام ضعيفة، فيقلبه
           خوارزمي الاتجاه إلى 07-09-2026. <bdi> يعزل ولا يوجّه — الأرقام ليست
           محرفاً قويّاً — فالاتجاه يُصرَّح به. */
        .replace("{measured}", `<bdi dir="ltr" lang="en">${esc(cmp.measured)}</bdi>`)}
      <b>${esc(copy.caveat || "")}</b>${copy.caveatRest ? ` — ${esc(copy.caveatRest)}` : ""}
    </figcaption>
  </figure>`;
};

/* ---------- standards / capabilities ---------- */
export const standardsGrid = (list, live = {}) => `
  <div class="caps rv" data-stagger>
    ${list.map((s) => `<article class="cap${live[s.n] ? " cap--live" : ""}"><span class="cap__n mono">${esc(s.n)}</span><h3>${s.t}</h3><p>${s.d}</p>${live[s.n] ? `<div class="cap__live">${live[s.n]}</div>` : ""}</article>`).join("")}
  </div>`;

/** Live readout cell used by the self-audit (values filled by extras.js). */
export const live = (key, label) => `<span class="live" data-audit="${key}" title="${esc(label)}"><span class="live__l">${esc(label)}</span><b>—</b></span>`;

/* ---------- system blueprint (drawn on scroll) ---------- */
/** A drawn flow, scroll-revealed like the blueprint but driven by content.
    The reference sites carry 137 and 231 SVG figures against this site's 27,
    and for a company that sells system engineering a drawing is the native
    language — but only where the thing drawn is true. This renders from data,
    so a diagram cannot drift from the words beside it, and there is no
    hand-drawn architecture anywhere claiming to be a client's. */
export const flow = ({ steps, label = "" }) => {
  const W = 880, H = 150, gap = W / steps.length;
  const N = steps.length * 2;
  const k = (i) => ` style="--k:${(i / N).toFixed(3)}"`;
  const nodes = steps.map((st, i) => {
    const cx = gap * i + gap / 2;
    return `
      <g class="bp__el flow__n"${k(i * 2)}>
        <rect class="bp__box" x="${cx - gap / 2 + 12}" y="34" width="${gap - 24}" height="74" rx="16" pathLength="1"/>
        <rect class="bp__fill" x="${cx - gap / 2 + 12}" y="34" width="${gap - 24}" height="74" rx="16"/>
        <text class="flow__i" x="${cx}" y="26" text-anchor="middle">${esc(st.n || String(i + 1).padStart(2, "0"))}</text>
        <text class="bp__t" x="${cx}" y="66" text-anchor="middle">${esc(st.t)}</text>
        <text class="bp__d" x="${cx}" y="90" text-anchor="middle">${esc(st.d || "")}</text>
      </g>`;
  }).join("");
  /* the connectors are drawn right-to-left so the flow reads with the language */
  const links = steps.slice(1).map((_, i) => {
    const x1 = gap * i + gap - 12, x2 = gap * (i + 1) + 12;
    return `
      <g class="bp__el"${k(i * 2 + 1)}>
        <line class="bp__line" x1="${x1}" y1="71" x2="${x2}" y2="71" pathLength="1"/>
        <line class="bp__flow" x1="${x1}" y1="71" x2="${x2}" y2="71" pathLength="1"/>
      </g>`;
  }).join("");
  /* --n is the stage count the draw is divided into; .bp__el reads it to work
     out when each element's turn comes, and it is not 9 here as it is for the
     blueprint */
  return `<figure class="flow rv" data-blueprint style="--n:${N}"${label ? ` aria-label="${esc(label)}"` : ""}>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label || steps.map((x) => x.t).join(" ← "))}" preserveAspectRatio="xMidYMid meet">
      ${links}${nodes}
    </svg>
    <figcaption class="sr-only">${esc(steps.map((x, i) => `${i + 1}. ${x.t}${x.d ? ": " + x.d : ""}`).join(" "))}</figcaption>
  </figure>`;
};

export const blueprint = () => {
  const layers = [
    { y: 24,  t: "الواجهة — عربية من الجذر",        d: "RTL أصلي · وصولية AA · ميزانية أداء" },
    { y: 124, t: "واجهة برمجية بعقود مشتركة",        d: "TypeScript من الطرف إلى الطرف · تحقّق على كل طلب" },
    { y: 224, t: "محرّك القيود",                      d: "لا يمرّ قيد إلا متوازناً — مدين = دائن" },
    { y: 324, t: "عزل المستأجرين ×3",                 d: "حارس مسار · تخزين مقيَّد · سياسات صفوف" },
    { y: 424, t: "PostgreSQL",                        d: "هجرات مُصدَّرة قابلة للتراجع" }
  ];
  const N = 9;
  const k = (i) => ` style="--k:${(i / N).toFixed(3)}"`;
  const box = (l, i) => `
    <g class="bp__el"${k(i)}>
      <rect class="bp__box" x="200" y="${l.y}" width="400" height="66" rx="16" pathLength="1"/>
      <rect class="bp__fill" x="200" y="${l.y}" width="400" height="66" rx="16"/>
      <text class="bp__t" x="400" y="${l.y + 28}" text-anchor="middle">${esc(l.t)}</text>
      <text class="bp__d" x="400" y="${l.y + 50}" text-anchor="middle">${esc(l.d)}</text>
    </g>`;
  const link = (i, y1, y2) => `
    <g class="bp__el"${k(i)}>
      <line class="bp__line" x1="400" y1="${y1}" x2="400" y2="${y2}" pathLength="1"/>
      <line class="bp__flow" x1="400" y1="${y1}" x2="400" y2="${y2}" pathLength="1"/>
    </g>`;
  const pill = (i, y, t, from) => `
    <g class="bp__el"${k(i)}>
      <path class="bp__line" d="M200 ${from} C 186 ${from} 186 ${y + 22} 172 ${y + 22}" pathLength="1"/>
      <rect class="bp__box bp__box--side" x="12" y="${y}" width="160" height="44" rx="22" pathLength="1"/>
      <rect class="bp__fill" x="12" y="${y}" width="160" height="44" rx="22"/>
      <text class="bp__t bp__t--side" x="92" y="${y + 27}" text-anchor="middle">${esc(t)}</text>
    </g>`;
  return `
  <figure class="blueprint" data-blueprint aria-label="مخطّط طبقات النظام: الواجهة، واجهة برمجية، محرّك القيود، عزل المستأجرين، قاعدة البيانات — مع سجل تدقيق واختبارات على الجانب">
    <svg class="bp" viewBox="0 0 640 520" role="img" aria-hidden="true" focusable="false">
      ${layers.map((l, i) => box(l, i === 0 ? 0 : i * 2 - 1)).join("")}
      ${layers.slice(0, -1).map((l, i) => link(i * 2 + 1 > 8 ? 8 : i * 2 + 1, l.y + 66, layers[i + 1].y)).join("")}
      ${pill(8, 150, "سجل تدقيق لا يُمحى", 257)}
      ${pill(8, 340, "اختبارات تمنع الانحدار", 357)}
    </svg>
    <figcaption class="bp__cap">الطبقة التي لا يراها أحد — تُرسم كما تُبنى.</figcaption>
  </figure>`;
};

/* ---------- tech wall ---------- */
/* جدار الأدوات. الاسم وحده يقوله كل مكتب؛ الحدّ المعروف هو الادّعاء الوحيد
   الذي لا يُنسَخ بلا معرفة. حين يوجد حدّ تتحوّل الخلية من بطاقة شعار إلى بند. */
export const wall = (stack) => {
  const deep = stack.some((s) => s.limit);
  return `
  <div class="wall rv${deep ? " wall--deep" : ""}" data-wall style="--cells:${stack.length}">
    ${stack.map((s, i) => `<div class="wall__c" style="--c:${i}">
      <b lang="en">${esc(s.name)}</b>
      <span lang="en">${esc(s.role)}</span>
      ${s.limit ? `<p class="wall__lim">${esc(s.limit)}</p>` : ""}
    </div>`).join("")}
  </div>`;
};

/* ---------- marquee strip ---------- */
export const marquee = (items) => `
  <div class="marq" aria-hidden="true">
    <div class="marq__track">${[...items, ...items].map((t) => `<span lang="en">${esc(t)}</span>`).join("")}</div>
  </div>
  <p class="sr-only">تقنيات نعمل بها: ${items.join("، ")}.</p>`;

/* ---------- founder block ---------- */
export const founder = ({ site, quote, lede = "", h = "", cta = true, big = false }) => `
  <div class="founder rv${big ? " founder--big" : ""}" data-stagger>
    <div class="founder__img">
      <img src="${site.brand.founder.photo}" srcset="${srcset(site.brand.founder.photo)}" sizes="(min-width: 900px) 680px, 200vw" alt="${esc(site.brand.founder.name)}، ${esc(site.brand.founder.role)}" width="1024" height="575" loading="lazy" decoding="async">
    </div>
    <div class="founder__b">
      ${eyebrow(h || "كلمة المؤسّس")}
      ${lede ? `<p class="lede">${lede}</p>` : ""}
      <blockquote class="quote">${Array.isArray(quote) ? quote.map((q) => `<p>${q}</p>`).join("") : quote}</blockquote>
      <div class="sig"><b>${esc(site.brand.founder.name)}</b><span>${esc(site.brand.founder.role)} · ${esc(site.brand.name)}</span></div>
      ${cta ? btnRow([btn({ href: "/group#founder", label: "القصّة الكاملة", kind: "ghost", size: "sm", arrow: true })]) : ""}
    </div>
  </div>`;

/* ---------- facts strip (case page) ---------- */
export const facts = (list) => `
  <dl class="facts rv" data-stagger>${list.map((f) => `<div class="fact"><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join("")}</dl>`;

/* ---------- gallery ---------- */
export const gallery = (items) =>
  items.length
    ? `<div class="gallery rv" data-stagger>${items.map((g) => `<figure class="gallery__it${g.h > g.w ? " gallery__it--tall" : ""}"><div class="dev dev--frame"><div class="dev__screen dev__screen--frame">${img(g.src, g.alt, { w: g.w || 1200, h: g.h || 800 })}</div></div>${g.cap ? `<figcaption>${g.cap}</figcaption>` : ""}</figure>`).join("")}</div>`
    : "";

/* ---------- next project card ---------- */
export const nextCard = (c, themes, label = "المشروع التالي") => {
  const t = themes[c.theme];
  return `
  <a class="next themed rv${t.ink ? " next--ink" : ""}" href="/work/${c.slug}" style="${themeStyle(t)}">
    <span class="next__eyebrow">${esc(label)} · <span lang="en">${esc(c.code)}</span></span>
    <span class="next__h d-2">${esc(c.title)} — ${c.headline}</span>
    <span class="next__cta">${label === "المشروع التالي" ? "افتح دراسة الحالة" : "استعرض"} ${arrow()}</span>
  </a>`;
};

/* ---------- article body renderer ---------- */
export const articleBody = (blocks) =>
  blocks
    .map((b) => {
      if (b.h2) return `<h2 id="${esc(b.id)}">${b.h2}</h2>`;
      if (b.p) return `<p>${b.p}</p>`;
      if (b.ul) return `<ul>${b.ul.map((li) => `<li>${li}</li>`).join("")}</ul>`;
      if (b.quote) return `<blockquote class="quote quote--pull"><p>${b.quote}</p></blockquote>`;
      if (b.code) return `<pre class="code" dir="ltr" lang="en" tabindex="0"><code class="lang-${esc(b.lang || "txt")}">${esc(b.code)}</code></pre>`;
      if (b.note) return `<aside class="note">${b.note}</aside>`;
      return "";
    })
    .join("\n");

export { icon, img, bdi };


/* ---------- APPLE-STYLE PRODUCT FILM (pinned, scroll-driven chapters) ---------- */
const ffPaperLines = () => `<span class="ff__lines" aria-hidden="true"><i style="--w:72%"></i><i style="--w:54%"></i><i style="--w:63%"></i><i style="--w:40%"></i></span>`;
export const filmFrame = (k) => {
  switch (k) {
    case "photo":
      return `<div class="ff ff--photo"><div class="ff__paper"><span class="ff__paper-h">شركة الكهرباء · فاتورة ضريبية</span>${ffPaperLines()}<span class="ff__total"><span>الإجمالي</span><b class="mono" dir="ltr">1,150.00</b></span></div><span class="ff__beam" aria-hidden="true"></span><span class="ff__shutter" aria-hidden="true"></span></div>`;
    case "extract":
      return `<div class="ff ff--extract"><dl class="ff__fields">
        <div style="--i:0"><dt>المورّد</dt><dd>شركة الكهرباء</dd></div>
        <div style="--i:1"><dt>المستند</dt><dd class="mono" dir="ltr">INV-EL-4471 · 2026-09-02</dd></div>
        <div style="--i:2"><dt>الصافي</dt><dd class="mono" dir="ltr">1,000.00</dd></div>
        <div style="--i:3"><dt>الضريبة 15%</dt><dd class="mono" dir="ltr">150.00</dd></div>
        <div style="--i:4"><dt>الحساب المقترح</dt><dd><span class="chip chip--accent">مصروف كهرباء · 5110</span></dd></div>
      </dl></div>`;
    case "balance":
      return `<div class="ff ff--balance"><div class="ledger__je-hd"><span>قيد مقترح · <bdi class="mono">#2479</bdi></span><span class="chip chip--accent">متوازن ✓ <bdi class="mono">1,150.00 = 1,150.00</bdi></span></div>
        <table class="ledger__t"><thead><tr><th scope="col">الحساب</th><th scope="col">مدين</th><th scope="col">دائن</th></tr></thead><tbody>
        <tr><td>مصروف كهرباء</td><td class="num">1,000.00</td><td class="num"></td></tr>
        <tr><td>ضريبة القيمة المضافة — مدخلات</td><td class="num">150.00</td><td class="num"></td></tr>
        <tr><td>ذمم دائنة — شركة الكهرباء</td><td class="num"></td><td class="num">1,150.00</td></tr>
        </tbody><tfoot><tr><td>المجموع</td><td class="num">1,150.00</td><td class="num">1,150.00</td></tr></tfoot></table></div>`;
    case "post":
      return `<div class="ff ff--post"><div class="cockpit__kpis"><div class="cockpit__kpi"><span>الإيرادات</span><b class="num">482,900</b></div><div class="cockpit__kpi"><span>المصروفات</span><b class="num ff__tick">312,240</b></div><div class="cockpit__kpi cockpit__kpi--acc"><span>صافي التدفّق</span><b class="num">+170,660</b></div></div>
        <div class="cockpit__rows"><div class="cockpit__row is-new"><span>آخر قيد · <span class="mono" lang="en">#2479</span> · شركة الكهرباء</span><b class="cockpit__ok">رُحِّل ✓</b></div><div class="cockpit__row"><span>الأستاذ العام — مصروف كهرباء</span><b class="mono">+1,000.00</b></div><div class="cockpit__row"><span>ذمم دائنة — شركة الكهرباء</span><b class="mono">+1,150.00</b></div></div></div>`;
    case "close":
    default:
      return `<div class="ff ff--close"><div class="ff__stmt"><div><span>الإيرادات</span><b class="mono" dir="ltr">482,900</b></div><div><span>المصروفات</span><b class="mono" dir="ltr">312,240</b></div><div class="ff__net"><span>صافي الربح</span><b class="mono" dir="ltr">170,660</b></div></div><div class="ff__seal"><span class="ff__seal-ic">${icon("lock")}</span><span>سبتمبر 2026 مُقفل ✓</span><span class="mono" lang="en">IFRS</span></div><div class="chips"><span class="chip">قائمة الدخل</span><span class="chip">المركز المالي</span><span class="chip">التدفّق النقدي</span><span class="chip">تغيّرات حقوق الملكية</span></div></div>`;
  }
};

export const film = (f, { id = "film" } = {}) => `
  <section class="film sec--ink" id="${id}" data-film aria-label="${esc(f.h)}">
    <div class="film__stage">
      <div class="film__head">
        ${eyebrow(f.eyebrow, "HOW IT WORKS")}
        <h2 class="d-2">${f.h}</h2>
        <p class="film__lede">${f.lede}</p>
      </div>
      <div class="film__body">
        <div class="film__dev">
          <div class="dev dev--cockpit film__cockpit" aria-hidden="true">
            <div class="dev__bar"><i></i><i></i><i></i><span class="dev__url">محاسب ذكي · <span data-film-title>${esc(f.chapters[0].t)}</span></span></div>
            <div class="film__frames">
              ${f.chapters.map((c, i) => `<div class="film__f${i === 0 ? " is-on" : ""}" data-film-frame>${filmFrame(c.k)}</div>`).join("")}
            </div>
          </div>
        </div>
        <div class="film__caps">
          ${f.chapters.map((c, i) => `<div class="film__cap${i === 0 ? " is-on" : ""}" data-film-cap><span class="film__n mono">0${i + 1} / 0${f.chapters.length}</span><h3 class="film__t">${c.t}</h3><p>${c.d}</p></div>`).join("")}
        </div>
      </div>
      <div class="film__nav" aria-hidden="true"><span class="film__bar"><span data-film-bar></span></span><ol class="film__dots">${f.chapters.map((c, i) => `<li data-film-dot${i === 0 ? ' class="is-on"' : ""}>${c.t.replace(/\./g, "")}</li>`).join("")}</ol></div>
    </div>
    <ol class="sr-only">${f.chapters.map((c) => `<li>${c.t} ${c.d}</li>`).join("")}</ol>
  </section>`;

/* ---------- BIG-NUMBER MOMENTS (Apple "stat" beats) ---------- */
export const moments = (list, stats) => `
  <section class="moments sec--ink" aria-label="أرقام">
    <div class="wrap wrap--wide moments__grid">
      ${list.map((m) => {
        const st = m.stat ? stats[m.stat] : { value: m.n, prefix: m.prefix || "", suffix: m.suffix || "", label: m.label, count: true };
        return `<div class="moment" data-moment><div class="moment__n"><span class="moment__pre">${esc(st.prefix || "")}</span><span data-count="${st.value}">${num(st.value)}</span><span class="moment__suf">${esc(st.suffix || "")}</span></div><p class="moment__l">${esc(st.label)}</p></div>`;
      }).join("")}
    </div>
  </section>`;

/* ---------- STICKY PRODUCT BAR (Apple local nav) ---------- */
export const subnav = ({ title, code, status = "live", cta, href, secondary }) => `
  <div class="subnav" data-subnav aria-label="شريط ${esc(title)}">
    <div class="wrap wrap--wide subnav__in">
      <div class="subnav__id"><b>${esc(title)}</b>${syscode(code, status, false)}</div>
      <div class="subnav__act">${secondary ? `<a class="lnk" href="${secondary.href}"><span>${esc(secondary.label)}</span>${arrow()}</a>` : ""}<a class="btn btn--primary btn--sm" href="${href}"><span>${esc(cta)}</span>${arrow()}</a></div>
    </div>
  </div>`;


/* ---------- HONEST MOCK SCREENS (HTML, theme-aware) ---------- */
export const mockScreen = (kind) => {
  switch (kind) {
    case "academy":
      return `<div class="mk mk--academy" aria-hidden="true">
        <div class="mk__hd"><span>أكاديمية عوالِم <small>· مسار هندسة الأنظمة</small></span><span class="mk__chip">الأسبوع 07 / 12</span></div>
        <div class="mk__body">
          <div class="mk__prog"><b>المشروع: نظام فوترة متعدّد المستأجرين</b><span class="mk__bar"><i></i></span></div>
          <div class="mk__list">
            <div class="mk__it is-done"><i>✓</i>نمذجة البيانات والتطبيع<small>مقبول</small></div>
            <div class="mk__it is-done"><i>✓</i>الهجرات والفهارس<small>مقبول</small></div>
            <div class="mk__it is-now"><i></i>المعاملات والعزل<small>قيد المراجعة</small></div>
            <div class="mk__it"><i></i>الأمان على مستوى الصفوف<small>قادم</small></div>
          </div>
          <div class="mk__review">
            <b style="font-size:11px">مراجعة كود · التسليم 03</b>
            <pre class="mk__code">CREATE INDEX <b>idx_inv_tenant_date</b>
  ON invoices (tenant_id, issued_at DESC);</pre>
            <p class="mk__note">فهرس مركّب صحيح — لكن رتّب الأعمدة بحسب الانتقائية.<small>المراجع · قبل 20 دقيقة</small></p>
          </div>
          <div class="mk__weeks">${Array.from({ length: 12 }, (_, i) => `<i class="${i < 6 ? "is-done" : i === 6 ? "is-now" : ""}"><span>${String(i + 1).padStart(2, "0")}</span></i>`).join("")}</div>
        </div>
      </div>`;
    case "vibe":
      return `<div class="mk mk--vibe" aria-hidden="true">
        <div class="mk__hd"><span>Vibe OS 4.0</span><span>الثلاثاء · 10:42</span></div>
        <div class="mk__win" style="inset-inline-end:6%;inset-block-start:16%;inline-size:46%"><div class="mk__win-t"><span>لوحة المبيعات</span><i></i></div><div class="mk__row"><span>اليوم</span><b>12,480</b></div><div class="mk__row"><span>هذا الشهر</span><b>318,900</b></div><div class="mk__row"><span>طلبات معلّقة</span><b>7</b></div></div>
        <div class="mk__win" style="inset-inline-start:6%;inset-block-start:30%;inline-size:44%"><div class="mk__win-t"><span>فاتورة #2479</span><i></i></div><div class="mk__ai"><b>مساعد داخل المهمّة</b><span>القيد متوازن. الحساب المقترح: مصروف كهرباء · 5110 — اعتمد؟</span></div></div>
        <div class="mk__win" style="inset-inline-end:22%;inset-block-end:18%;inline-size:40%"><div class="mk__win-t"><span>جدول الرواتب</span><i></i></div><div class="mk__row"><span>سبتمبر</span><b>رُحِّل ✓</b></div></div>
        <div class="mk__dock"><i></i><i></i><i></i><i></i><i></i></div>
      </div>`;
    case "close":
      return `<div class="mk mk--agent" aria-hidden="true">
        <div class="mk__hd"><span>منسّق الإقفال الذكي · دورة الإقفال الشهري</span><span class="mk__chip">قيد التنفيذ</span></div>
        <div class="mk__log">
          <div class="mk__ln"><span class="k">▶</span><span>مطابقة حركات البنك — 42 حركة</span></div>
          <div class="mk__ln"><span class="k"></span><span>تسوية الحسابات — 3 فروقات تحتاج مراجعة</span></div>
          <div class="mk__ln is-wait"><span class="k">⏸</span><span>قيد تسوية بأثر مالي — بانتظار اعتماد بشري</span></div>
          <div class="mk__ln is-ok"><span class="k">✓</span><span>اعتُمد بواسطة م. سارة · سُجِّل القرار في السجل</span></div>
          <div class="mk__ln"><span class="k">▶</span><span>تجميع تقرير الإقفال<span class="mk__cursor"></span></span></div>
        </div>
      </div>`;
    case "agent":
    default:
      return `<div class="mk mk--agent" aria-hidden="true">
        <div class="mk__hd"><span>مختبر الذكاء · وكيل الفواتير</span><span class="mk__chip">live</span></div>
        <div class="mk__log">
          <div class="mk__ln"><span class="k">▶</span><span>استلام مستند <span class="j">INV-EL-4471.jpg</span></span></div>
          <div class="mk__ln"><span class="k"></span><span>أداة <span class="j">extract_fields</span> → <span class="j">{ vendor: "شركة الكهرباء", net: 1000, vat: 150 }</span></span></div>
          <div class="mk__ln"><span class="k"></span><span>أداة <span class="j">propose_entry</span> → مدين 1,150 = دائن 1,150 ✓</span></div>
          <div class="mk__ln is-wait"><span class="k">⏸</span><span>أثر مالي — بانتظار اعتماد بشري</span></div>
          <div class="mk__ln is-ok"><span class="k">✓</span><span>اعتُمد بواسطة م. سارة · سُجِّل القرار في السجل</span></div>
          <div class="mk__ln"><span class="k">▶</span><span>المستند التالي <span class="j">INV-TC-1187.pdf</span> <span class="mk__cursor"></span></span></div>
        </div>
      </div>`;
  }
};


/* ---------- proof: client wall + testimonials (2026-09-29) ----------
   Designed and wired before the content exists, so the owner's first real
   testimonial lands on a finished page. Every item needs `consent: true`
   (the client agreed to be named); anything else is not rendered. With no
   consented items the whole section renders nothing — never a placeholder. */
const consented = (list = []) => list.filter((x) => x && x.consent === true);

export const clientWall = (clients = []) => {
  const list = consented(clients).filter((c) => c.name && c.logo);
  if (list.length < 3) return ""; // a wall of one or two logos reads as thin, not as proof
  return `<section class="sec sec--tight" aria-labelledby="clients-h">
    <div class="wrap wrap--wide">
      <h2 class="clients__h rv" id="clients-h">يعمل معنا</h2>
      <ul class="clients rv" data-stagger>${list.map((c) => `<li class="clients__i">${c.url ? `<a href="${esc(c.url)}" rel="noopener" target="_blank">` : ""}<img src="${esc(c.logo)}" alt="${esc(c.name)}" width="160" height="40" loading="lazy" decoding="async">${c.url ? "</a>" : ""}</li>`).join("")}</ul>
    </div>
  </section>`;
};

export const testimonials = (items = []) => {
  const list = consented(items).filter((t) => t.quote && t.name);
  if (!list.length) return "";
  const [lead, ...rest] = list;
  const who = (t) => `<footer class="tq__who">${t.photo ? `<img src="${esc(t.photo)}" alt="" width="48" height="48" loading="lazy" decoding="async">` : ""}<span><b>${esc(t.name)}</b>${[t.role, t.company].filter(Boolean).map(esc).join("، ") ? `<span>${[t.role, t.company].filter(Boolean).map(esc).join("، ")}</span>` : ""}</span></footer>`;
  return `<section class="sec" aria-labelledby="tq-h">
    <div class="wrap wrap--wide">
      ${eyebrow("بكلمات عملائنا", "", "rv")}
      <h2 class="sr-only" id="tq-h">بكلمات عملائنا</h2>
      <blockquote class="tq tq--lead rv"><p>${esc(lead.quote)}</p>${who(lead)}${lead.case ? `<a class="lnk tq__case" href="/work/${esc(lead.case)}"><span>اقرأ دراسة الحالة</span>${arrow()}</a>` : ""}</blockquote>
      ${rest.length ? `<div class="tq__grid" data-stagger>${rest.map((t) => `<blockquote class="tq rv"><p>${esc(t.quote)}</p>${who(t)}</blockquote>`).join("")}</div>` : ""}
    </div>
  </section>`;
};
