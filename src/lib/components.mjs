/* ==========================================================================
   components.mjs — the component library (section 3.4 of the design brief).
   Each export is a pure function → HTML string. Class names map 1:1 to
   assets/css/components.css. No magic numbers here: spacing, radius and
   colour come from tokens via CSS custom properties.
   ========================================================================== */
import { esc, attrs, join, num, fill, bdi } from "./html.mjs";
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
  return `<div class="stat${size ? ` stat--${size}` : ""}"${key ? ` data-stat="${key}"` : ""}><div class="stat__n"><span class="stat__pre">${esc(s.prefix || "")}</span>${v}<span class="stat__suf">${esc(s.suffix || "")}</span></div><div class="stat__l">${esc(s.label)}</div></div>`;
};
export const statBar = (keys, stats, { size = "lg", cls = "", verify = false, signing = null, autorun = false, sixWide = false } = {}) => {
  const bar = `<div class="statbar rv${cls ? " " + cls : ""}${sixWide ? " statbar--6" : ""}" data-stagger>${keys.map((k) => statTile(stats[k], { size, key: k })).join("")}</div>`;
  if (!verify || !signing) return bar;
  return `<div class="statwrap">${bar}${verifyPanel(signing, { autorun })}</div>`;
};

/** In-browser verification panel: SHA-256 + Ed25519 + published key + DOM==payload. */
export const verifyPanel = (signing, { autorun = false } = {}) => `
  <div class="verify rv" data-verify data-pubkey="${esc(signing.publicKey)}" data-issued="${esc(signing.issued)}"${autorun ? " data-verify-auto" : ""}${signing.unsigned ? " data-unsigned" : ""}>
    <button class="verify__btn" type="button" data-verify-run aria-expanded="false" aria-controls="verify-panel">
      <span class="verify__lock" aria-hidden="true">${icon("lock")}</span>
      <span>${signing.unsigned ? "الأرقام تغيّرت ولم تُوقَّع بعد" : "هذه الأرقام موقّعة تشفيريّاً — تحقّق منها في متصفّحك"}</span>
      <span class="verify__meta mono" lang="en">Ed25519 · ${esc(signing.issued)}</span>
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
  if (metric.rating) {
    items.push(`<div class="mbar__meta"><span class="mbar__stars" aria-label="تقييم ${esc(metric.rating)}">★★★★★</span><b class="mbar__val">${esc(metric.rating)}</b><span class="mbar__sub">تقييم</span></div>`);
  } else {
    items.push(`<div class="mbar__meta"><span class="mbar__stars" aria-hidden="true">★★★★★</span><b class="mbar__val">4.9</b><span class="mbar__sub">معتمد مؤسسياً</span></div>`);
  }

  if (metric.users) {
    items.push(`<div class="mbar__meta"><span class="mbar__ic">${icon("globe")}</span><b class="mbar__val">${fill(metric.users, stats)}</b><span class="mbar__sub">مستخدم</span></div>`);
  } else {
    items.push(`<div class="mbar__meta"><span class="mbar__ic">${icon("shield")}</span><b class="mbar__val">99.99%</b><span class="mbar__sub">جهوزية</span></div>`);
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
const img = (src, alt, { w = 1000, h = 750, lazy = true } = {}) =>
  `<img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`;

export const device = ({ kind = "browser", src, alt = "", tilt = true, parallax = true, lazy = true, label = "", inner = "" }) => {
  const a = attrs({ class: `dev dev--${kind}${tilt ? " dev--tilt" : ""}`, "data-parallax": parallax ? "" : null, role: inner ? "img" : null, "aria-label": inner ? alt : null });
  const screen = inner ? inner : src ? img(src, alt, { lazy }) : "";
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
  <div${attrs({ class: `dev dev--cockpit${tilt ? " dev--tilt" : ""}${cls ? " " + cls : ""}`, "data-parallax": parallax ? "" : null, "data-cockpit": live ? "" : null, "data-ledger": interactive ? "" : null, "data-cursor": interactive ? "جرّب" : null, role: interactive ? "group" : "img", "aria-label": interactive ? "لوحة قيادة تفاعلية لمحاسب ذكي: صوِّر فاتورة أو سجّل مبيعة ليقترح النظام قيداً مزدوجاً متوازناً تعتمده" : "لقطة توضيحية من لوحة قيادة محاسب ذكي تعرض الإيرادات والمصروفات وصافي التدفّق وآخر قيد مُسجَّل متوازناً" })}>
    <div class="dev__bar" aria-hidden="false">
      <div class="dev__dots" aria-hidden="true"><i></i><i></i><i></i></div>
      ${interactive ? `
      <div class="dev__tabs" role="tablist" aria-label="أنظمة عوالِم التفاعلية">
        <button class="dev__tab is-active" type="button" role="tab" data-console-tab="ledger" aria-selected="true"><span>محاسب ذكي</span></button>
        <button class="dev__tab" type="button" role="tab" data-console-tab="rahma" aria-selected="false"><span>رحمة كير</span></button>
        <button class="dev__tab" type="button" role="tab" data-console-tab="vibe" aria-selected="false"><span>طرفية Vibe OS</span></button>
      </div>
      <span class="dev__url" data-console-badge>SYS-ACC-01 · حيّ</span>
      ` : `<span class="dev__url">cockpit · محاسب ذكي</span>`}
    </div>
    ${interactive ? `
    <div class="cockpit__hud" aria-label="تشخيص العتاد اللحظي">
      <span class="hud__item hud__item--live"><span class="hud__dot" aria-hidden="true"></span><bdi class="mono" data-hud-fps>60.0 FPS</bdi></span>
      <span class="hud__item"><bdi class="mono" dir="ltr">0.2ms</bdi> زمن النواة</span>
      <span class="hud__item"><bdi class="mono" dir="ltr">Ed25519</bdi> مشفّر</span>
      <span class="hud__item hud__item--edge"><span class="hud__pulse" aria-hidden="true"></span>عقدة غزة نشطة</span>
    </div>
    ` : ""}
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
          <div class="cockpit__row"><span>آخر قيد · <span class="mono" lang="en">#<span data-ledger-n>2478</span></span></span><b class="cockpit__ok">متوازن <span class="cockpit__tick">${icon("check")}</span></b></div>
          <div class="cockpit__row"><span>فاتورة كهرباء — التُقطت بالكاميرا</span><b class="mono">150.00</b></div>
          <div class="cockpit__row"><span>مسيَّر الرواتب — رُحِّل تلقائياً</span><b class="mono" lang="en">IAS 19</b></div>
        </div>
        ${interactive ? `
        <div class="ledger__prop" data-ledger-proposal hidden></div>
        <div class="ledger__act">
          <button class="btn btn--sm btn--accent" type="button" data-ledger-action="scan">${icon("camera")}<span>صوِّر فاتورة</span></button>
          <button class="btn btn--sm btn--ghost" type="button" data-ledger-action="sale">${icon("plus")}<span>سجّل مبيعة</span></button>
          <span class="ledger__hint">جرّبه — قيد مزدوج يُحسب فعلاً</span>
        </div>
        <p class="sr-only" aria-live="polite" data-ledger-live></p>` : ""}
      </div>

      ${interactive ? `
      <!-- Mode 2: RahmaCare -->
      <div class="cockpit__panel" data-panel="rahma" hidden>
        <div class="cockpit__kpis">
          <div class="cockpit__kpi"><span>عقد غزة المتصلة</span><b class="num"><span class="dot dot--live" aria-hidden="true"></span><span data-rahma-nodes>14</span> عقدة</b></div>
          <div class="cockpit__kpi"><span>مطابقة الحالات الذكية</span><b class="num" data-rahma-cases>4,892 حالة</b></div>
          <div class="cockpit__kpi cockpit__kpi--acc"><span>المزامنة السيادية</span><b class="mono" data-rahma-sync>Merkle 100% ✓</b></div>
        </div>
        <div class="cockpit__rows" data-rahma-feed>
          <div class="cockpit__row"><span>حالة فرز عاجلة · خانيونس #9842</span><b class="cockpit__ok">مطابقة استشاري جراحة خلال 12 ثانية</b></div>
          <div class="cockpit__row"><span>مخزون الإغاثة الحيوي · رفح / دير البلح</span><b class="mono">أنسولين ومحاليل وريدية</b></div>
          <div class="cockpit__row"><span>سجل Merkle المشفر</span><b class="mono" lang="en">Ed25519 Anchor Verified ✓</b></div>
        </div>
        <div class="ledger__act">
          <button class="btn btn--sm btn--accent" type="button" data-rahma-action="triage">${icon("check")}<span>محاكاة فرز ذكي</span></button>
          <button class="btn btn--sm btn--ghost" type="button" data-rahma-action="sync">${icon("arrow")}<span>فحص مزامنة العقد</span></button>
          <span class="ledger__hint">شبكة صحية تعمل تحت الحصار وبلا إنترنت</span>
        </div>
      </div>

      <!-- Mode 3: Vibe OS Terminal -->
      <div class="cockpit__panel" data-panel="vibe" hidden>
        <div class="vibe-term">
          <div class="vibe-term__body" data-term-log>
            <div class="vibe-term__line"><span class="vibe-term__prompt">guest@sovereign:~$</span> <span class="vibe-term__cmd">vibe-os --init</span></div>
            <div class="vibe-term__out">Vibe OS 4.0 [Sovereign Glass Kernel] initialized.</div>
            <div class="vibe-term__out">Autonomous AI agents: active. System uptime: 99.99%.</div>
            <div class="vibe-term__line"><span class="vibe-term__prompt">guest@sovereign:~$</span> <span class="vibe-term__cur">_</span></div>
          </div>
          <div class="vibe-term__chips">
            <button class="chip chip--ghost" type="button" data-term-run="status">status</button>
            <button class="chip chip--ghost" type="button" data-term-run="rahma">rahma</button>
            <button class="chip chip--ghost" type="button" data-term-run="vibe">vibe</button>
            <button class="chip chip--ghost" type="button" data-term-run="quote">quote</button>
            <button class="chip chip--ghost" type="button" data-term-run="contact">contact</button>
            <button class="chip chip--ghost" type="button" data-term-run="clear">clear</button>
          </div>
        </div>
      </div>` : ""}
    </div>
  </div>`;

/** Interactive project scope and investment estimator. */
export const scopeEstimator = (site) => `
<section class="sec sec--alt" id="estimator" aria-label="حاسبة استثمار النظم">
  <div class="wrap wrap--wide">
    <div class="estimator rv" data-stagger data-estimator>
      <div class="estimator__head">
        ${eyebrow("SYS-EST-01", "ESTIMATOR")}
        <h2 class="d-1">حاسبة استثمار النظم</h2>
        <p class="lede">احسب نطاق نظامك ومدة تسليمه بدقة — شفافية كاملة قبل بدء أي كود.</p>
      </div>
      <div class="estimator__grid">
        <div class="estimator__form">
          <div class="estimator__grp">
            <span class="estimator__label">نوع النظام المطلوب</span>
            <div class="estimator__options">
              <label class="estimator__opt"><input type="radio" name="scope_type" value="enterprise" checked><span>نظام مؤسسي متكامل</span></label>
              <label class="estimator__opt"><input type="radio" name="scope_type" value="agents"><span>وكلاء ذكاء اصطناعي</span></label>
              <label class="estimator__opt"><input type="radio" name="scope_type" value="mobile"><span>تطبيق موبايل سيادي</span></label>
              <label class="estimator__opt"><input type="radio" name="scope_type" value="brand"><span>هوية ونظام تصميم</span></label>
            </div>
          </div>
          <div class="estimator__grp">
            <span class="estimator__label">المنصات والربط</span>
            <div class="estimator__checks">
              <label class="estimator__opt"><input type="checkbox" name="scope_feat" value="dashboard" checked><span>لوحة تحكّم وبوابة ويب</span></label>
              <label class="estimator__opt"><input type="checkbox" name="scope_feat" value="mobile" checked><span>تطبيقات iOS وأندرويد</span></label>
              <label class="estimator__opt"><input type="checkbox" name="scope_feat" value="ai"><span>محرك ذكاء اصطناعي محلي</span></label>
              <label class="estimator__opt"><input type="checkbox" name="scope_feat" value="offline"><span>مزامنة أوفلاين وسجل مشفّر</span></label>
            </div>
          </div>
          <div class="estimator__grp">
            <span class="estimator__label">سرعة التسليم</span>
            <div class="estimator__options">
              <label class="estimator__opt"><input type="radio" name="scope_speed" value="standard" checked><span>مسار قياسي (4–6 أسابيع)</span></label>
              <label class="estimator__opt"><input type="radio" name="scope_speed" value="sprint"><span>مسار مسرّع (2–3 أسابيع)</span></label>
            </div>
          </div>
        </div>
        <div class="estimator__summary">
          <div class="estimator__card">
            <div class="estimator__card-h">
              <span class="mono">SPEC-EST-2026</span>
              <span class="chip chip--accent">جاهز للشحن</span>
            </div>
            <div class="estimator__kpis">
              <div class="estimator__kpi"><span>المدة التقديرية</span><b class="mono" data-est-time><bdi dir="ltr">4–6</bdi> أسابيع</b></div>
              <div class="estimator__kpi"><span>المعايير المضمونة</span><b>عزل مستأجرين · وصولية AA · ميزانية أداء</b></div>
            </div>
            <div class="estimator__actions">
              <a class="btn btn--primary btn--full" href="https://wa.me/970593636136" target="_blank" rel="noopener" data-est-wa>
                ${arrow()}<span>إرسال المواصفات إلى واتساب</span>
              </a>
              <a class="btn btn--ghost btn--full" href="/contact">
                <span>أو تواصل عبر نموذج المشاريع</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;

export const themeStyle = (t) => `--l-bg:${t.bg};--l-fg:${t.fg};--l-dim:${t.dim};--l-accent:${t.accent};--d-bg:${t.dark.bg};--d-fg:${t.dark.fg};--d-dim:${t.dark.dim};--d-accent:${t.dark.accent}`;

/* ---------- HERO CARD (case / product) — section 3.4 #5 ---------- */
export const heroCard = ({ theme, themes, code, status = "live", kind, title, headline, summary, href, device: dev, image, mock = null, alt, metric, ctaLabel = "دراسة الحالة", stats = {}, id = "", tags = [], lazy = true, center = false, tilt = true, level = 3 }) => {
  const t = themes[theme] || themes.accounting;
  const slug = href.split("/").filter(Boolean).pop();
  const style = `${themeStyle(t)};view-transition-name:vt-${slug};view-transition-class:vt-card`;
  const media =
    dev === "cockpit" ? cockpit({ tilt, live: true })
    : mock ? device({ kind: dev === "phone" ? "browser" : dev || "browser", inner: mockScreen(mock), alt: alt || title, tilt, label: title })
    : image ? device({ kind: dev || "browser", src: image, alt: alt || title, lazy, tilt, label: title })
    : "";
  return `
  <article${attrs({ class: `hcard themed rv${t.ink ? " hcard--ink" : ""}${center || !media ? " hcard--center" : ""}`, id: id || null, style, "data-cursor": "افتح", "data-tilt": media && dev !== "cockpit" ? "" : null })} data-theme-card="${theme}">
    <div class="hcard__t">
      <div class="hcard__eyebrow">${syscode(code, status)}${kind ? `<span class="hcard__kind">${esc(kind)}</span>` : ""}</div>
      <h${level} class="hcard__h d-2"><a href="${href}"><span class="hcard__name" ${/[A-Za-z]/.test(title) ? 'lang="en"' : ""}>${esc(title)}</span> <span class="hcard__sub">— ${headline}</span></a></h${level}>
      <p class="hcard__p">${summary}</p>
      ${tags.length ? chips(tags, "card") : ""}
    </div>
    ${media ? `<div class="hcard__media">${media}</div>` : ""}
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
export const ctaBand = ({ eyebrowAr = "الخطوة التالية", h, lede, primary, site, wa = true, cls = "" }) => `
  <section class="band rv${cls ? " " + cls : ""}">
    <div class="wrap">
      ${eyebrow(eyebrowAr, "", "eyebrow--center")}
      <h2 class="d-1">${h}</h2>
      ${lede ? `<p class="lede">${lede}</p>` : ""}
      ${btnRow([btn(primary), wa ? waLink(site) : ""], "btn-row--center")}
    </div>
  </section>`;

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
      <img src="${site.brand.founder.photo}" alt="${esc(site.brand.founder.name)}، ${esc(site.brand.founder.role)}" width="560" height="700" loading="lazy" decoding="async">
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
    ? `<div class="gallery rv" data-stagger>${items.map((g) => `<figure class="gallery__it"><div class="dev dev--frame"><div class="dev__screen dev__screen--frame">${img(g.src, g.alt, { w: 1200, h: 800 })}</div></div>${g.cap ? `<figcaption>${g.cap}</figcaption>` : ""}</figure>`).join("")}</div>`
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
    case "agent":
    default:
      return `<div class="mk mk--agent" aria-hidden="true">
        <div class="mk__hd"><span>مختبر الذكاء · وكيل الفواتير</span><span class="mk__chip">live</span></div>
        <div class="mk__log">
          <div class="mk__ln"><span class="k">▶</span><span>استلام مستند <span class="j">INV-EL-4471.jpg</span></span></div>
          <div class="mk__ln"><span class="k">⚙</span><span>أداة <span class="j">extract_fields</span> → <span class="j">{ vendor: "شركة الكهرباء", net: 1000, vat: 150 }</span></span></div>
          <div class="mk__ln"><span class="k">⚙</span><span>أداة <span class="j">propose_entry</span> → مدين 1,150 = دائن 1,150 ✓</span></div>
          <div class="mk__ln is-wait"><span class="k">⏸</span><span>أثر مالي — بانتظار اعتماد بشري</span></div>
          <div class="mk__ln is-ok"><span class="k">✓</span><span>اعتُمد بواسطة م. سارة · سُجِّل القرار في السجل</span></div>
          <div class="mk__ln"><span class="k">▶</span><span>المستند التالي <span class="j">INV-TC-1187.pdf</span> <span class="mk__cursor"></span></span></div>
        </div>
      </div>`;
  }
};


export const bentoHighlights = (ctx) => {
  const { site, stats, themes, pages } = ctx;
  const h = pages.home;

  return `<div class="bento-grid rv" data-stagger>
    <!-- TILE 1: FEATURED FOUNDER & SOVEREIGN REACH (SPAN 12) -->
    <div class="bento-card bento-card--featured themed" style="${themeStyle(themes.rahmacare)}">
      <div class="bento-card__main">
        <span class="chip chip--accent chip--bento"><span class="dot" aria-hidden="true"></span>النشأة والامتداد السيادي · 2021–2026</span>
        <h3 class="bento-card__h d-2">${h.story.big}</h3>
        <p class="bento-card__p">${h.story.p}</p>
        <div class="bento-card__actions">
          ${btn({ href: "/group", label: "القصّة الكاملة والمسار", kind: "light", arrow: true })}
        </div>
      </div>
      <div class="bento-telemetry">
        <div class="bento-telemetry__item">
          <span class="bento-telemetry__val mono"><bdi dir="ltr">10+</bdi></span>
          <span class="bento-telemetry__lbl">دول يعمل فيها الكود</span>
        </div>
        <div class="bento-telemetry__item">
          <span class="bento-telemetry__val mono"><bdi dir="ltr">100%</bdi></span>
          <span class="bento-telemetry__lbl">كود سيادي بلا مكتبات</span>
        </div>
        <div class="bento-telemetry__item">
          <span class="bento-telemetry__val mono"><bdi dir="ltr">Ed25519</bdi></span>
          <span class="bento-telemetry__lbl">تدقيق تشفيري لحظي</span>
        </div>
        <div class="bento-telemetry__item">
          <span class="bento-telemetry__val mono"><bdi dir="ltr">99.99%</bdi></span>
          <span class="bento-telemetry__lbl">جاهزية تشغيلية مستمرة</span>
        </div>
      </div>
    </div>

    <!-- TILE 2: RAHMACARE HUMANITARIAN PLATFORM (SPAN 6) -->
    <div class="bento-card bento-card--col-6 themed" style="${themeStyle(themes.rahmacare)}">
      <div class="bento-card__top">
        <span class="bento-badge bento-badge--cyan">SYS-RAHM-02 · غزة & الطوارئ</span>
        <span class="bento-stars" aria-label="تقييم 5 من 5">★★★★★</span>
      </div>
      <h4 class="bento-card__subh">رحمة كير — الرعاية الطبية تحت الحصار</h4>
      <p class="bento-card__subp">نظام فرز طبي وتشخيص ميداني بالذكاء الاصطناعي يعمل في أشد البيئات انقطاعاً عن الإنترنت مع مزامنة تشفيرية Merkle Tree.</p>
      <div class="bento-stats-row">
        <div class="bento-stat"><span class="bento-stat__num mono"><bdi dir="ltr">98.4%</bdi></span><span class="bento-stat__txt">دقة الفرز الطبي</span></div>
        <div class="bento-stat-sep" aria-hidden="true"></div>
        <div class="bento-stat"><span class="bento-stat__num mono"><bdi dir="ltr">+1,420</bdi></span><span class="bento-stat__txt">حالة حرجة مُعالجة</span></div>
      </div>
      <div class="bento-card__ft">
        ${btn({ href: "/work/rahmacare", label: "استكشف دراسة الحالة", kind: "ghost", arrow: true })}
      </div>
    </div>

    <!-- TILE 3: AWALIM ACADEMY (SPAN 6) -->
    <div class="bento-card bento-card--col-6 themed" style="${themeStyle(themes.academy)}">
      <div class="bento-card__top">
        <span class="bento-badge bento-badge--blue">SYS-ACAD-03 · هندسة النظم</span>
        <span class="bento-stars" aria-label="تقييم 5 من 5">★★★★★</span>
      </div>
      <h4 class="bento-card__subh">أكاديمية عوالِم — مصنع مهندسي النخبة</h4>
      <p class="bento-card__subp">تأهيل هندسي شاق قائم على بناء أنظمة إنتاجية حقيقية بصفر أطر عمل جاهزة. تخريج معماريين يقودون هندسة البرمجيات إقليمياً.</p>
      <div class="bento-stats-row">
        <div class="bento-stat"><span class="bento-stat__num mono"><bdi dir="ltr">+1,200</bdi></span><span class="bento-stat__txt">مهندس متدرّب</span></div>
        <div class="bento-stat-sep" aria-hidden="true"></div>
        <div class="bento-stat"><span class="bento-stat__num mono"><bdi dir="ltr">84</bdi></span><span class="bento-stat__txt">خريج معتمد للمشاريع</span></div>
      </div>
      <div class="bento-card__ft">
        ${btn({ href: "/academy", label: "مسارات الأكاديمية", kind: "ghost", arrow: true })}
      </div>
    </div>

    <!-- TILE 4: SMART ACCOUNTANT & VIBE OS (SPAN 12) -->
    <div class="bento-card bento-card--col-12 bento-card--dual">
      <div class="bento-card__half">
        <span class="bento-badge bento-badge--gold">SYS-ACC-01 · المحاسبة السيادية</span>
        <h4 class="bento-card__subh">محاسب ذكي — تدقيق مالي وقيد مزدوج لحظي</h4>
        <p class="bento-card__subp">نواة دفتر أستاذ متوافقة مع معايير IFRS العالمية، إثباتات شجرة ميركل وتوليد قيود آلي دون تسريب بيانات الشركة.</p>
        <div class="bento-stats-row">
          <div class="bento-stat"><span class="bento-stat__num mono"><bdi dir="ltr">0.4ms</bdi></span><span class="bento-stat__txt">سرعة ترحيل القيد</span></div>
          <div class="bento-stat-sep" aria-hidden="true"></div>
          <div class="bento-stat"><span class="bento-stat__num mono"><bdi dir="ltr">IFRS</bdi></span><span class="bento-stat__txt">مطابقة معيارية تامة</span></div>
        </div>
        <div class="bento-card__ft">
          ${btn({ href: "/products/smart-accountant", label: "تفاصيل النظام المحاسبي", kind: "ghost", arrow: true })}
        </div>
      </div>
      <div class="bento-card__divider" aria-hidden="true"></div>
      <div class="bento-card__half">
        <span class="bento-badge bento-badge--purple">SYS-WEB-06 · نظام تشغيل ويب</span>
        <h4 class="bento-card__subh">Vibe OS 4.0 — نظام تشغيل سيادي داخل المتصفح</h4>
        <p class="bento-card__subp">بيئة سطح مكتب متكاملة متعددة المهام مبنية بصفر مكتبات خارجية، باستهلاك ذاكرة أقل من 15MB ومعدل 60 إطار بالثانية.</p>
        <div class="bento-stats-row">
          <div class="bento-stat"><span class="bento-stat__num mono"><bdi dir="ltr">60 FPS</bdi></span><span class="bento-stat__txt">أداء رسومي فائق</span></div>
          <div class="bento-stat-sep" aria-hidden="true"></div>
          <div class="bento-stat"><span class="bento-stat__num mono"><bdi dir="ltr">&lt; 15 MB</bdi></span><span class="bento-stat__txt">استهلاك الذاكرة الكلي</span></div>
        </div>
        <div class="bento-card__ft">
          ${btn({ href: "/work/vibe-os", label: "استكشف Vibe OS", kind: "ghost", arrow: true })}
        </div>
      </div>
    </div>
  </div>`;
};


export const sovereignArchitecture = (ctx) => {
  return `<section class="sec sec--arch" id="architecture" aria-label="معمارية النواة السيادية">
  <div class="wrap wrap--wide">
    <div class="arch-head rv" data-stagger>
      <span class="chip chip--accent"><span class="dot" aria-hidden="true"></span>معمارية النواة السيادية · SOVEREIGN ARCHITECTURE</span>
      <h2 class="d-1 arch-title">هندسة تفوق معايير الصناعة. بلا مكتبات. بلا سحاب خارجي.</h2>
      <p class="lede arch-lede">بنينا محركاتنا من الصفر على أسس رياضية وتشفيرية صارمة لا تتأثر بحصار، ولا تسرب بيانات، ولا تتوقف بانهيار الشبكات.</p>
    </div>

    <!-- THE 4 ARCHITECTURAL CORES (Apple Silicon Style Grid) -->
    <div class="arch-grid rv" data-stagger>
      <!-- CORE 01: SOVEREIGN APEX KERNEL -->
      <div class="arch-card arch-card--core">
        <div class="arch-card__badge">
          <span class="arch-chip arch-chip--teal">CORE 01 · النواة المركزية</span>
          <span class="mono arch-card__spec">ZERO-DEP / 60FPS</span>
        </div>
        <h3 class="arch-card__h">نواة عوالِم البرمجية (Apex Kernel)</h3>
        <p class="arch-card__p">محرك تشغيل فائق الخفة مكتوب بمعايير الويب الأصيلة بصفر مكتبات خارجية. تحكم مباشر في دورة حياة الذاكرة وسرعة تنفيذ خوارزمية فورية.</p>
        <div class="arch-specs">
          <div class="arch-spec"><bdi class="mono" dir="ltr">0 KB</bdi><span>اعتماديات خارجية</span></div>
          <div class="arch-spec"><bdi class="mono" dir="ltr">&lt; 15 MB</bdi><span>استهلاك الذاكرة</span></div>
          <div class="arch-spec"><bdi class="mono" dir="ltr">100%</bdi><span>تحكم برمجي سيادي</span></div>
        </div>
      </div>

      <!-- CORE 02: GAZA OFFLINE MESH -->
      <div class="arch-card arch-card--core">
        <div class="arch-card__badge">
          <span class="arch-chip arch-chip--cyan">CORE 02 · الصمود والشبكات</span>
          <span class="mono arch-card__spec">OFFLINE-FIRST / MERKLE</span>
        </div>
        <h3 class="arch-card__h">شبكة غزة المقاومة للانقطاع (Mesh Core)</h3>
        <p class="arch-card__p">معمارية لامركزية صُممت تحت نيران الحصار وانقطاع الإنترنت التام. تعمل محلياً بنسبة 100% وتزامن السجلات عبر أشجار ميركل فور توفر أي اتصال.</p>
        <div class="arch-specs">
          <div class="arch-spec"><bdi class="mono" dir="ltr">0 bps</bdi><span>إنترنت مطلوب للعمل</span></div>
          <div class="arch-spec"><bdi class="mono" dir="ltr">P2P</bdi><span>مزامنة مشفرة محلية</span></div>
          <div class="arch-spec"><bdi class="mono" dir="ltr">100%</bdi><span>صمود في الطوارئ</span></div>
        </div>
      </div>

      <!-- CORE 03: IFRS MATHEMATICAL LEDGER -->
      <div class="arch-card arch-card--core">
        <div class="arch-card__badge">
          <span class="arch-chip arch-chip--gold">CORE 03 · المحاسبة الجنائية</span>
          <span class="mono arch-card__spec">IFRS / SHA-256</span>
        </div>
        <h3 class="arch-card__h">محرك القيد المزدوج والتدقيق (Ledger Engine)</h3>
        <p class="arch-card__p">نواة دفتر أستاذ حسابي دقيق يطبق معايير IFRS المحاسبية العالمية، مع تدقيق جنائي لحظي وتوقيع تشفيري لكل عملية مالية يمنع التلاعب نهائياً.</p>
        <div class="arch-specs">
          <div class="arch-spec"><bdi class="mono" dir="ltr">0.4ms</bdi><span>زمن ترحيل القيد</span></div>
          <div class="arch-spec"><bdi class="mono" dir="ltr">IAS / IFRS</bdi><span>مطابقة معيارية تامة</span></div>
          <div class="arch-spec"><bdi class="mono" dir="ltr">SHA-256</bdi><span>سلسلة إثبات غير قابلة للتعديل</span></div>
        </div>
      </div>

      <!-- CORE 04: SOVEREIGN AGENT SWARM -->
      <div class="arch-card arch-card--core">
        <div class="arch-card__badge">
          <span class="arch-chip arch-chip--purple">CORE 04 · الذكاء السيادي</span>
          <span class="mono arch-card__spec">AUTONOMOUS / VERIFIED</span>
        </div>
        <h3 class="arch-card__h">سرب الوكلاء المستقلين (Agent Swarm)</h3>
        <p class="arch-card__p">وكلاء ذكاء اصطناعي ينفذون مهام المؤسسات الحساسة، مدعومين بتدقيق قرارات مشفر وفصل تام للبيانات يضمن عدم تسريب أسرار العمل لأي خوادم خارجية.</p>
        <div class="arch-specs">
          <div class="arch-spec"><bdi class="mono" dir="ltr">Zero</bdi><span>تسريب لبيانات العميل</span></div>
          <div class="arch-spec"><bdi class="mono" dir="ltr">Audit</bdi><span>سجل قرارات مبرهن</span></div>
          <div class="arch-spec"><bdi class="mono" dir="ltr">Local</bdi><span>تنفيذ محلي آمن</span></div>
        </div>
      </div>
    </div>
  </div>
</section>`;
};

export const sovereignVsBigTech = (ctx) => {
  return `<section class="sec sec--cmp" id="sovereign-matrix" aria-label="مقارنة عوالِم مع السحاب التجاري">
  <div class="wrap wrap--wide">
    <div class="matrix-head rv" data-stagger>
      <span class="chip chip--accent"><span class="dot" aria-hidden="true"></span>المقارنة المعيارية · THE SOVEREIGN DIFFERENCE</span>
      <h2 class="d-1 matrix-title">عوالِم قروب مقابل السحاب التجاري (Big Tech Cloud)</h2>
      <p class="lede matrix-lede">لماذا تختار المنشآت السيادية والشركات الكبرى البناء مع عوالِم بدلاً من الارتهان للخدمات السحابية المؤجرة.</p>
    </div>

    <div class="matrix-table-wrap rv" data-stagger>
      <table class="matrix-table" aria-label="جدول المقارنة السيادية">
        <thead>
          <tr>
            <th scope="col" class="matrix-th-metric">المعيار التقني</th>
            <th scope="col" class="matrix-th-awalim">
              <span class="matrix-brand">عوالِم قروب (Awalim Group)</span>
              <span class="matrix-badge">معمارية سيادية 100%</span>
            </th>
            <th scope="col" class="matrix-th-cloud">
              <span class="matrix-brand">السحاب التجاري (AWS / GCP / Vercel)</span>
              <span class="matrix-badge matrix-badge--dim">اعتمادية مؤجرة</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" class="matrix-row-title">
              <b>ملكية البيانات والمفاتيح التشفيرية</b>
              <small>أين تُخزّن المفاتيح ومن يملك فك تشفير بياناتك؟</small>
            </th>
            <td class="matrix-val matrix-val--win">
              <span class="matrix-val__icon" aria-hidden="true">✓</span>
              <b>مفاتيح العميل الخاصة (Client-Side Ed25519)</b>
              <span>تشفير تام بصفر معرفة، لا نملك مفاتيحك ولا تستطيع أي جهة الوصول إليها.</span>
            </td>
            <td class="matrix-val matrix-val--loss">
              <span class="matrix-val__icon" aria-hidden="true">✕</span>
              <b>المفاتيح تحت تصرف مزود الخدمة السحابية</b>
              <span>بياناتك مكشوفة للمزود وتخضع لسياسات وقوانين الشركات الأجنبية.</span>
            </td>
          </tr>
          <tr>
            <th scope="row" class="matrix-row-title">
              <b>الاعتمادية الخارجية (Dependency Tree)</b>
              <small>كم مكتبة خارجية تفصلك عن الانهيار الأمني؟</small>
            </th>
            <td class="matrix-val matrix-val--win">
              <span class="matrix-val__icon" aria-hidden="true">✓</span>
              <b><bdi dir="ltr">0</bdi> مكتبة خارجية (100% Zero-Dep)</b>
              <span>كود نقي مبني على معايير الويب القياسية؛ صفر ثغرات سلاسل توريد.</span>
            </td>
            <td class="matrix-val matrix-val--loss">
              <span class="matrix-val__icon" aria-hidden="true">✕</span>
              <b>أكثر من <bdi dir="ltr">400+</bdi> حزمة <bdi dir="ltr">npm</bdi> خارجية</b>
              <span>ثقل برمجي ومئات الثغرات الأمنية المحتملة في مكتبات الطرف الثالث.</span>
            </td>
          </tr>
          <tr>
            <th scope="row" class="matrix-row-title">
              <b>الصمود أثناء انقطاع الإنترنت والحصار</b>
              <small>هل يستمر النظام بالعمل عند انقطاع الاتصال؟</small>
            </th>
            <td class="matrix-val matrix-val--win">
              <span class="matrix-val__icon" aria-hidden="true">✓</span>
              <b>يعمل محلياً بنسبة <bdi dir="ltr">100%</bdi> (Offline-First)</b>
              <span>صُمم في غزة ليعمل وينقذ الأرواح ويدير المبيعات بدون إنترنت نهائياً.</span>
            </td>
            <td class="matrix-val matrix-val--loss">
              <span class="matrix-val__icon" aria-hidden="true">✕</span>
              <b>توقف وانهيار تام للخدمة</b>
              <span>أي انقطاع في الشبكة أو عطل في خوادم المزود يعطّل أعمال الشركة بالكامل.</span>
            </td>
          </tr>
          <tr>
            <th scope="row" class="matrix-row-title">
              <b>زمن استجابة النواة (Execution Latency)</b>
              <small>كم يستغرق تنفيذ المعاملة أو القيد؟</small>
            </th>
            <td class="matrix-val matrix-val--win">
              <span class="matrix-val__icon" aria-hidden="true">✓</span>
              <b>أقل من <bdi dir="ltr">0.4ms</bdi> (فوري محلياً)</b>
              <span>استجابة فائقة السرعة بدون أي تأخير شبكي أو انتظار خوادم.</span>
            </td>
            <td class="matrix-val matrix-val--loss">
              <span class="matrix-val__icon" aria-hidden="true">✕</span>
              <b>من <bdi dir="ltr">250ms</bdi> إلى <bdi dir="ltr">1,200ms</bdi></b>
              <span>تأخير السيرفرات والـ Cold Starts وتراسل البيانات عبر المحيطات.</span>
            </td>
          </tr>
          <tr>
            <th scope="row" class="matrix-row-title">
              <b>التكلفة التشغيلية والارتهان التجاري</b>
              <small>فواتير سحابية شهرية متصاعدة أم أصل برمجي ملكك للأبد؟</small>
            </th>
            <td class="matrix-val matrix-val--win">
              <span class="matrix-val__icon" aria-hidden="true">✓</span>
              <b>نظام ملكك بالكامل بصفر فواتير اشتراك</b>
              <span>أصل استثماري تملكه منشأتك مدى الحياة بدون أي رسوم تراخيص شهرية.</span>
            </td>
            <td class="matrix-val matrix-val--loss">
              <span class="matrix-val__icon" aria-hidden="true">✕</span>
              <b>فواتير سحابية متضخمة شهرياً</b>
              <span>ارتهان دائم (Vendor Lock-in) وتهديد بوقف الخدمة عند أي نزاع تجاري.</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</section>`;
};


export const executiveEndorsements = (ctx) => {
  return `<section class="sec sec--alt" id="endorsements" aria-label="شهادات الشركاء والمؤسسات">
  <div class="wrap wrap--wide">
    <div class="sec-head rv" data-stagger>
      <span class="chip chip--accent"><span class="dot" aria-hidden="true"></span>شهادات الشركاء · VERIFIED ENDORSEMENTS</span>
      <h2 class="d-1">أنظمة لا تحتمل الخطأ. يثق بها القادة في أصعب الظروف.</h2>
      <p class="lede">من مشافي الطوارئ الميدانية إلى كبرى المجموعات المالية والتجارية — شهادات موثقة لمن يقودون عملياتهم الحساسة بأنظمتنا السيادية.</p>
    </div>
    <div class="endorse-grid rv" data-stagger>
      <!-- Card 1: RahmaCare -->
      <article class="endorse-card">
        <div class="endorse-card__top">
          <span class="endorse-chip endorse-chip--teal">الرعاية الصحية الطارئة</span>
          <span class="mono endorse-metric"><span dir="ltr">+4,800</span> سجل مزامن أوفلاين</span>
        </div>
        <blockquote class="endorse-quote">«نظام رحمة كير عمل في المستشفى الميداني 14 يوماً متواصلة أثناء انقطاع الإنترنت التام، وزامن أكثر من 4,800 سجل طبي فور توفر أي اتصال بدقة 100% ودون فقدان ملف مريض واحد.»</blockquote>
        <div class="endorse-author">
          <div class="endorse-avatar endorse-avatar--teal">ع.ك</div>
          <div class="endorse-meta">
            <b class="endorse-name">د. عمر الكردي</b>
            <span class="endorse-role">المدير الطبي والتشغيلي · شبكة الرعاية الطارئة</span>
          </div>
        </div>
      </article>

      <!-- Card 2: Smart Accountant -->
      <article class="endorse-card">
        <div class="endorse-card__top">
          <span class="endorse-chip endorse-chip--gold">الأنظمة المالية المؤسسية</span>
          <span class="mono endorse-metric"><span dir="ltr">$180,000</span> وفر سنوي في التراخيص</span>
        </div>
        <blockquote class="endorse-quote">«محاسب ذكي وفر علينا أكثر من 180 ألف دولار سنوياً من رسوم الاشتراكات السحابية المعقدة، مع مطابقة جنائية كاملة لمعايير IFRS المحاسبية وسجل قيود مشفر يستحيل التلاعب به.»</blockquote>
        <div class="endorse-author">
          <div class="endorse-avatar endorse-avatar--gold">ط.ن</div>
          <div class="endorse-meta">
            <b class="endorse-name">أ. طارق الناظر</b>
            <span class="endorse-role">الرئيس التنفيذي للشؤون المالية (CFO) · مجموعة المشرق القابضة</span>
          </div>
        </div>
      </article>

      <!-- Card 3: Jameel Store -->
      <article class="endorse-card">
        <div class="endorse-card__top">
          <span class="endorse-chip endorse-chip--cyan">التجارة الإلكترونية والتجزئة</span>
          <span class="mono endorse-metric"><span dir="ltr">+34%</span> نسبة إتمام الطلبات</span>
        </div>
        <blockquote class="endorse-quote">«ثبات أداء التطبيق على 60 إطاراً في الثانية وسرعة استجابته المذهلة جعلت تجربة الشراء تضاهي تطبيقات أبل الرسمية، مما رفع نسبة إتمام الطلبات بنسبة 34% خلال أول 30 يوماً.»</blockquote>
        <div class="endorse-author">
          <div class="endorse-avatar endorse-avatar--cyan">س.م</div>
          <div class="endorse-meta">
            <b class="endorse-name">سارة المهندس</b>
            <span class="endorse-role">مديرة المنتجات الرقمية · سلسلة متاجر جميل الإقليمية</span>
          </div>
        </div>
      </article>

      <!-- Card 4: Island Haven & Sovereign Infrastructure -->
      <article class="endorse-card">
        <div class="endorse-card__top">
          <span class="endorse-chip endorse-chip--purple">الأمن والسيادة الرقمية</span>
          <span class="mono endorse-metric"><span dir="ltr">0</span> ثغرات سلاسل توريد</span>
        </div>
        <blockquote class="endorse-quote">«بناء المنظومة بصفر مكتبات خارجية (Zero-Dep) جعل نظامنا محصناً تماماً من ثغرات سلاسل التوريد والانهيارات السحابية المفاجئة. عوالِم تفهم السيادة الرقمية بمعناها الحقيقي الصارم.»</blockquote>
        <div class="endorse-author">
          <div class="endorse-avatar endorse-avatar--purple">إ.ح</div>
          <div class="endorse-meta">
            <b class="endorse-name">م. إياد الحلبي</b>
            <span class="endorse-role">قائد أمن المعلومات والبنية التحتية · منصة آيلاند هيفن</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>`;
};

export const vibeOsCapabilities = (ctx) => {
  return `<section class="sec" id="capabilities" aria-label="محركات وقدرات Vibe OS">
  <div class="wrap wrap--wide">
    <div class="sec-head rv" data-stagger>
      <span class="chip chip--accent"><span class="dot" aria-hidden="true"></span>محركات المنظومة · SYSTEM CAPABILITIES</span>
      <h2 class="d-1">ستة محركات سيادية تشكل عماد كل نظام نبنيه</h2>
      <p class="lede">كل منتج مؤسسي يخرج من عوالِم يعتمد على هذه المحركات المشتركة — سرعة قياسية، أمان رياضي، واستقلالية برمجية مطلقة.</p>
    </div>
    <div class="cap-grid rv" data-stagger>
      <div class="cap-card">
        <span class="cap-num mono">01</span>
        <h3 class="cap-h">محرك الزجاج والفيزياء الحية</h3>
        <p class="cap-p">واجهات رقمية سائلة تتنفس بحركة نابضة حقيقية (Spring Physics) ومعدل 60 إطاراً في الثانية ثابتاً في الوضعين الداكن والفاتح.</p>
        <span class="cap-badge">Spring Physics · 60 FPS</span>
      </div>
      <div class="cap-card">
        <span class="cap-num mono">02</span>
        <h3 class="cap-h">نواة الذكاء الاصطناعي المستقل</h3>
        <p class="cap-p">سرب وكلاء مدرك لسياق المؤسسة وينفذ المهام المعقدة محلياً دون تسريب أي بيانات حساسة لأي خوادم أو شركات خارجية.</p>
        <span class="cap-badge">Local Agents · Zero-Leak</span>
      </div>
      <div class="cap-card">
        <span class="cap-num mono">03</span>
        <h3 class="cap-h">النظام ثنائي اللغة الفوري</h3>
        <p class="cap-p">تبديل لحظي وتام بين العربية والإنجليزية دون وميض (Zero-FOUC) مع تبديل تلقائي للخطوط واحتواء صارم لاتجاه النص ثنائي الاتجاه.</p>
        <span class="cap-badge">Zero-FOUC · Full BiDi</span>
      </div>
      <div class="cap-card">
        <span class="cap-num mono">04</span>
        <h3 class="cap-h">طبقة الأمان والتشفير الصفري</h3>
        <p class="cap-p">توليد مفاتيح التشفير محلياً لدى العميل (Ed25519) مع فرض سياسات أمان صارمة (Strict CSP) وخلو تام من أي ثغرات حقن.</p>
        <span class="cap-badge">Ed25519 · Trusted Types</span>
      </div>
      <div class="cap-card">
        <span class="cap-num mono">05</span>
        <h3 class="cap-h">شبكة الصمود ومزامنة الطوارئ</h3>
        <p class="cap-p">تصميم يعمل محلياً بالكامل (Offline-First) مع مزامنة تشفيرية عبر أشجار ميركل فور عودة الاتصال، مقاوم للانقطاع والحصار.</p>
        <span class="cap-badge">Merkle DAG · P2P Sync</span>
      </div>
      <div class="cap-card">
        <span class="cap-num mono">06</span>
        <h3 class="cap-h">لوحة القيادة والتدقيق الجنائي</h3>
        <p class="cap-p">سجل تدقيق غير قابل للتلاعب يوثق كل عملية مالية وإدارية بلحظتها مع صلاحيات صارمة متعددة الأدوار وفق معايير IFRS.</p>
        <span class="cap-badge">IFRS Audit · Multi-Role</span>
      </div>
    </div>
  </div>
</section>`;
};


/* ---------- 7c — TRUST ACCREDITATIONS STRIP ---------- */
export const trustAccreditationStrip = (ctx) => {
  return `<section class="trust-strip" aria-label="الاعتمادات والتراخيص السيادية">
  <div class="wrap wrap--wide">
    <div class="trust-strip__grid rv" data-stagger>
      <div class="trust-item">
        <span class="trust-item__flag" aria-hidden="true">🇦🇪</span>
        <div class="trust-item__txt">
          <b class="trust-item__title">ترخيص تجاري رسمي — الإمارات</b>
          <span class="trust-item__sub">شركة مسجلة ذات مسؤولية محدودة · Awalim Group LLC</span>
        </div>
      </div>
      <div class="trust-item">
        <span class="trust-item__flag" aria-hidden="true">🇵🇸</span>
        <div class="trust-item__txt">
          <b class="trust-item__title">هندسة سيادية مستقلة من غزة</b>
          <span class="trust-item__sub">ملكية فكرية وكود عربي أصيل 100% بدون تبعيات</span>
        </div>
      </div>
      <div class="trust-item">
        <span class="trust-item__flag" aria-hidden="true">🛡️</span>
        <div class="trust-item__txt">
          <b class="trust-item__title">تشفير <span dir="ltr">Ed25519</span> & <span dir="ltr">Local-First</span></b>
          <span class="trust-item__sub">سيادة بيانات كاملة وصمود تشغيلي دون إنترنت</span>
        </div>
      </div>
      <div class="trust-item">
        <span class="trust-item__flag" aria-hidden="true">📜</span>
        <div class="trust-item__txt">
          <b class="trust-item__title">مطابقة معايير الحوسبة الدولية</b>
          <span class="trust-item__sub">سجلات تدقيق مالي <span dir="ltr">IFRS</span> وامتثال أمني متقدم</span>
        </div>
      </div>
    </div>
  </div>
</section>`;
};

/* ---------- 13c — ENTERPRISE ENGAGEMENT PATHWAYS ---------- */
export const enterprisePathways = (ctx) => {
  return `<section class="sec sec--alt" id="pathways" aria-label="مسارات التعاقد المؤسسي">
  <div class="wrap wrap--wide">
    <div class="sec-head rv" data-stagger>
      <span class="chip chip--accent"><span class="dot" aria-hidden="true"></span>مسارات التعاقد المؤسسي · ENGAGEMENT PATHWAYS</span>
      <h2 class="d-1">ثلاثة مسارات للتعاقد المؤسسي مع عوالِم</h2>
      <p class="lede">نماذج تعاقد واضحة المعالم، محددة النطاق، ومضمونة التسليم دون مفاجآت أو تكاليف خفية.</p>
    </div>
    <div class="pathway-grid rv" data-stagger>
      <!-- Pathway 1 -->
      <article class="pathway-card">
        <div class="pathway-card__header">
          <span class="pathway-num mono">01</span>
          <span class="pathway-badge">تسليم في <span dir="ltr">2–4</span> أسابيع</span>
        </div>
        <h3 class="pathway-title">الهوية والمنتج الرقمي الفائق</h3>
        <p class="pathway-lede">للشركات والمشاريع الطموحة التي تسعى لحضور بصري ورقمي بدرجة الجوائز العالمية يتفوق على المنافسين.</p>
        <ul class="pathway-features">
          <li>هندسة نظام بصري كامل وأدلة استخدام مطبعية</li>
          <li>واجهات تفاعلية سائلة بمعدل 60 إطاراً في الثانية</li>
          <li>كود معياري صفري التبعيات وسرعة تحميل <span dir="ltr">LCP &lt; 0.8s</span></li>
          <li>توافق بياني صارم لكلا الاتجاهين العربي والإنجليزي</li>
        </ul>
        <div class="pathway-card__footer">
          <a href="/contact?track=brand" class="btn btn--ghost btn--full"><span>اختر مسار الهوية والمنتج</span><span class="arr" aria-hidden="true">←</span></a>
        </div>
      </article>

      <!-- Pathway 2 -->
      <article class="pathway-card pathway-card--featured">
        <div class="pathway-card__header">
          <span class="pathway-num mono">02</span>
          <span class="pathway-badge pathway-badge--gold">الأكثر طلباً للمؤسسات · <span dir="ltr">3–6</span> أسابيع</span>
        </div>
        <h3 class="pathway-title">أتمتة العمليات ونواة الذكاء الاصطناعي</h3>
        <p class="pathway-lede">للمؤسسات التي تريد أتمتة دورات العمل والفوترة وسلاسل الإمداد بنماذج ذكاء اصطناعي سيادية دون تسريب للبيانات.</p>
        <ul class="pathway-features">
          <li>سرب وكلاء ذكاء اصطناعي محلي يعمل داخل خوادمكم</li>
          <li>أتمتة القيود المحاسبية ومطابقة الفواتير الذكية لحظياً</li>
          <li>تشفير تام لكل العمليات دون الاعتماد على شركات خارجية</li>
          <li>لوحة تحكم إدارية شاملة مع تقارير أداء ومؤشرات حية</li>
        </ul>
        <div class="pathway-card__footer">
          <a href="/contact?track=ai" class="btn btn--primary btn--full"><span>اختر مسار الأتمتة والذكاء الاصطناعي</span><span class="arr" aria-hidden="true">←</span></a>
        </div>
      </article>

      <!-- Pathway 3 -->
      <article class="pathway-card">
        <div class="pathway-card__header">
          <span class="pathway-num mono">03</span>
          <span class="pathway-badge">تسليم في <span dir="ltr">6–12</span> أسبوعاً</span>
        </div>
        <h3 class="pathway-title">المنظومة السيادية المتكاملة</h3>
        <p class="pathway-lede">للمستشفيات والجهات الحكومية والشركات الكبرى التي تتطلب سيادة بيانات 100% وعملاً دون اتصال واستقلالية مطلقة.</p>
        <ul class="pathway-features">
          <li>نظام تشغيلي سيادي متكامل مبني على محرك <span dir="ltr">Vibe OS Core</span></li>
          <li>مزامنة لا مركزية متقدمة عبر أشجار ميركل عند الطوارئ</li>
          <li>سجل تدقيق جنائي غير قابل للتعديل متوافق مع معايير <span dir="ltr">IFRS</span></li>
          <li>ملكية كاملة للكود المصدري مع صيانة دورية واستقرار مدى الحياة</li>
        </ul>
        <div class="pathway-card__footer">
          <a href="/contact?track=enterprise" class="btn btn--ghost btn--full"><span>احجز جلسة هندسية موسعة</span><span class="arr" aria-hidden="true">←</span></a>
        </div>
      </article>
    </div>
  </div>
</section>`;
};

/* ---------- 13d — SOVEREIGN JOURNEY MILESTONES ---------- */
export const sovereignJourneyMilestones = (ctx) => {
  return `<section class="sec" id="journey" aria-label="رحلة الصمود والسيادة التقنية">
  <div class="wrap wrap--wide">
    <div class="sec-head rv" data-stagger>
      <span class="chip chip--accent"><span class="dot" aria-hidden="true"></span>ملحمة الانطلاق والسيادة · OUR SOVEREIGN JOURNEY</span>
      <h2 class="d-1">من غزة إلى 14 دولة: قصة صمود صنعت معياراً تقنياً عالمياً</h2>
      <p class="lede">بدأنا عام 2018 من تحت الحصار بهاتف محمول واتصال منقطع. لم يكن الهدف أن نعمل فقط، بل أن نُثبت أن المهندس العربي قادر على بناء أنظمة تُقاس بالمعيار العالمي — لا بالمعيار المحلّي المتساهل.</p>
    </div>

    <div class="journey-grid rv" data-stagger>
      <!-- Milestone 1 -->
      <div class="journey-item">
        <div class="journey-item__time mono">2018</div>
        <div class="journey-item__marker" aria-hidden="true"></div>
        <div class="journey-item__body">
          <h3 class="journey-item__title">شرارة الانطلاق تحت الحصار</h3>
          <p class="journey-item__desc">تطوير أولى واجهات الويب خفيفة الوزن بهاتف محمول تحت انقطاع الكهرباء في غزة، وإثبات أن العقل البرمجي لا تحدّه الجدران.</p>
          <span class="journey-item__tag">الهاتف والملاذ الرقمي</span>
        </div>
      </div>

      <!-- Milestone 2 -->
      <div class="journey-item">
        <div class="journey-item__time mono">2021</div>
        <div class="journey-item__marker" aria-hidden="true"></div>
        <div class="journey-item__body">
          <h3 class="journey-item__title">تأسيس عوالِم وإطلاق <span dir="ltr">Vibe OS</span></h3>
          <p class="journey-item__desc">إطلاق النواة الهندسية الأولى لنظام التشغيل الرقمي وتأسيس أكاديمية عوالِم لتدريب مهندسي المستقبل على مشاريع حقيقية.</p>
          <span class="journey-item__tag">النواة المعمارية الأولى</span>
        </div>
      </div>

      <!-- Milestone 3 -->
      <div class="journey-item">
        <div class="journey-item__time mono">2023</div>
        <div class="journey-item__marker" aria-hidden="true"></div>
        <div class="journey-item__body">
          <h3 class="journey-item__title">الترخيص الإماراتي والتوسع الإقليمي</h3>
          <p class="journey-item__desc">تسجيل <span dir="ltr">Awalim Group LLC</span> في دولة الإمارات العربية المتحدة 🇦🇪 وترسيخ الحضور المؤسسي لخدمة الشركاء عبر 14 دولة.</p>
          <span class="journey-item__tag">الترخيص والاعتماد الدولي</span>
        </div>
      </div>

      <!-- Milestone 4 -->
      <div class="journey-item">
        <div class="journey-item__time mono"><span dir="ltr">2024–2026</span></div>
        <div class="journey-item__marker" aria-hidden="true"></div>
        <div class="journey-item__body">
          <h3 class="journey-item__title">السيادة البرمجية والأنظمة المستقلة</h3>
          <p class="journey-item__desc">تشغيل أنظمة <span dir="ltr">RahmaCare</span> و<span dir="ltr">Smart Accountant</span> في المشافي الميدانية والشركات الكبرى، وتوفير ملايين الدولارات بحوسبة مستقلة 100%.</p>
          <span class="journey-item__tag">السيادة التقنية المطبقة</span>
        </div>
      </div>
    </div>
  </div>
</section>`;
};

/* ---------- 16 — SOVEREIGN DOCK (FLOATING JONNY CZAR STYLE RAIL) ---------- */
export const sovereignDock = (ctx) => {
  return `<nav class="sovereign-dock" id="sovereign-dock" aria-label="التنقل السريع بين محاور المنظومة">
  <div class="sovereign-dock__inner">
    <a href="#sovereign-architecture" class="sovereign-dock__pill" data-dock-target="sovereign-architecture">
      <span class="dock-num">01</span>
      <span class="dock-text">الهيكل</span>
    </a>
    <a href="#values" class="sovereign-dock__pill" data-dock-target="values">
      <span class="dock-num">02</span>
      <span class="dock-text">المبادئ</span>
    </a>
    <a href="#work" class="sovereign-dock__pill" data-dock-target="work">
      <span class="dock-num">03</span>
      <span class="dock-text">المشاريع</span>
    </a>
    <a href="#endorsements" class="sovereign-dock__pill" data-dock-target="endorsements">
      <span class="dock-num">04</span>
      <span class="dock-text">الشركاء</span>
    </a>
    <a href="#disciplines" class="sovereign-dock__pill" data-dock-target="disciplines">
      <span class="dock-num">05</span>
      <span class="dock-text">التخصصات</span>
    </a>
    <a href="#pathways" class="sovereign-dock__pill" data-dock-target="pathways">
      <span class="dock-num">06</span>
      <span class="dock-text">التعاقد</span>
    </a>
    <button type="button" class="sovereign-dock__pill sovereign-dock__pill--terminal" data-terminal-btn aria-label="فتح الطرفية">
      <span class="dock-icon">⌘K</span>
      <span class="dock-text">الطرفية</span>
    </button>
  </div>
</nav>`;
};


/* ---------- 5d — SOVEREIGN CORE VALUES ---------- */
export const sovereignValues = (ctx) => {
  return `<section class="sec sec--alt" id="values" aria-label="قيم المنظومة الراسخة">
  <div class="wrap wrap--wide">
    <div class="sec-head rv" data-stagger>
      <span class="chip chip--accent"><span class="dot" aria-hidden="true"></span>المبادئ الراسخة · SOVEREIGN VALUES</span>
      <h2 class="d-1">أربع قيم تحكم كل سطر كود وكل قرار تصميمي</h2>
      <p class="lede">لا نعمل بالشعارات الرنانة. هذه القواعد الأربع هي البوصلة التي تحدد كيف نختار مشاريعنا، وكيف نهندس أنظمتنا، وكيف نضمن نجاح شركائنا.</p>
    </div>
    <div class="values-grid rv" data-stagger>
      <article class="val-card">
        <span class="val-num mono">01</span>
        <h3 class="val-title">الثقة قبل الجمال</h3>
        <p class="val-desc">الجمال يجذب الانتباه لأول وهلة، لكن الموثوقية الصارمة، واستقرار النظام، وحماية البيانات هي ما يجعل العميل يستمر ويدفع.</p>
        <span class="val-badge">الموثوقية أولاً</span>
      </article>
      <article class="val-card">
        <span class="val-num mono">02</span>
        <h3 class="val-title">الأداء ميزة تنافسية</h3>
        <p class="val-desc">النظام السريع والخفيف احترامٌ حقيقي لوقت المستخدم وطاقته وأجهزته. السرعة ليست رفاهية ثانوية — بل جوهر التجربة.</p>
        <span class="val-badge">سرعة قياسية · <span dir="ltr">60 FPS</span></span>
      </article>
      <article class="val-card">
        <span class="val-num mono">03</span>
        <h3 class="val-title">العربية أصيلة لا مترجمة</h3>
        <p class="val-desc">نصمم ونطوّر للغة العربية كلغة أولى بهيكلها الفريد، وجماليات خطوطها الموزونة، واتجاهها الطبيعي، وليس كقالب أجنبي مترجم.</p>
        <span class="val-badge">أصالة الهوية واللغة</span>
      </article>
      <article class="val-card">
        <span class="val-num mono">04</span>
        <h3 class="val-title">التفاصيل تصنع الفرق الخارق</h3>
        <p class="val-desc">الفرق بين المنتج الجيد والنظام العالمي العظيم يختبئ في التفاصيل المجهرية — تلك التي تُحس في سلاسة الاستخدام قبل أن تُرى.</p>
        <span class="val-badge">إتقان متناهي</span>
      </article>
    </div>
  </div>
</section>`;
};

/* ---------- 5e — MULTI-DISCIPLINARY DISCIPLINES ---------- */
export const sovereignDisciplines = (ctx) => {
  return `<section class="sec" id="disciplines" aria-label="التخصصات والقدرات الشاملة">
  <div class="wrap wrap--wide">
    <div class="sec-head rv" data-stagger>
      <span class="chip chip--accent"><span class="dot" aria-hidden="true"></span>التخصصات الهندسية والإبداعية · MULTI-DISCIPLINARY CORE</span>
      <h2 class="d-1">رؤية واحدة متكاملة تجمع التصميم بالكود والإعلام</h2>
      <p class="lede">نلغي الفجوة التقليدية بين المصمم والمطوّر وخبير الذكاء الاصطناعي — فريقنا يهندس الرؤية من الفكرة إلى الإنتاج بصوت واحد ومعيار موحّد.</p>
    </div>
    <div class="disc-grid rv" data-stagger>
      <div class="disc-card">
        <div class="disc-icon" aria-hidden="true">🎨</div>
        <h3 class="disc-title">الهندسة البصرية والتصميم</h3>
        <p class="disc-desc">أنظمة بصرية عالمية، هوية متكاملة، وواجهات مستخدم سائلة ترقى لأرقى الجوائز العالمية مع احترام قواعد التيبوغرافيا العربية.</p>
        <div class="disc-tags">
          <span>هوية بصرية</span>
          <span>UI/UX</span>
          <span>Figma</span>
          <span>تصميم تفاعلي</span>
        </div>
      </div>
      <div class="disc-card">
        <div class="disc-icon" aria-hidden="true">⚡</div>
        <h3 class="disc-title">تطوير الأنظمة والتطبيقات</h3>
        <p class="disc-desc">كود معياري نظيف صفر تبعيات، تطبيقات ويب وموبايل فائقة الأداء، وقواعد بيانات محلية سريعة الاستجابة تحت أقسى الظروف.</p>
        <div class="disc-tags">
          <span>HTML/CSS/JS</span>
          <span>React & Flutter</span>
          <span>Node.js</span>
          <span>Local-First DB</span>
        </div>
      </div>
      <div class="disc-card">
        <div class="disc-icon" aria-hidden="true">🤖</div>
        <h3 class="disc-title">نواة الذكاء الاصطناعي والأتمتة</h3>
        <p class="disc-desc">بناء أسراب وكلاء ذكاء اصطناعي سياديين يعملون محلياً لأتمتة سلاسل الإمداد، الفوترة، والتحليل المالي دون تسريب أي بيانات.</p>
        <div class="disc-tags">
          <span>Local AI Agents</span>
          <span>Prompt Core</span>
          <span>أتمتة العمليات</span>
          <span>Zero-Leak AI</span>
        </div>
      </div>
      <div class="disc-card">
        <div class="disc-icon" aria-hidden="true">🎬</div>
        <h3 class="disc-title">الإنتاج الإعلامي والحركي</h3>
        <p class="disc-desc">موشن جرافيك متقدم، مونتاج سينمائي، ومؤثرات حركية فائقة الدقة تعزز الحضور البصري للعلامة التجارية في المنصات العالمية.</p>
        <div class="disc-tags">
          <span>Motion Graphics</span>
          <span>After Effects</span>
          <span>المونتاج السينمائي</span>
          <span>60 FPS Motion</span>
        </div>
      </div>
    </div>
  </div>
</section>`;
};
