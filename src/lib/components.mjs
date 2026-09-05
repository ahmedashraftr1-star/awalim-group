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
    <h${level} class="d-1">${h}</h${level}>
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
    return `<div class="stat stat--lg"><div class="stat__n"><span class="stat__txt">${esc(t.text)}</span></div><div class="stat__l">${esc(t.label)}</div></div>`;
  return statTile({ value: t.n, prefix: t.prefix || "", suffix: t.suffix || "", label: t.label, count: true }, { size: "lg" });
};

/* ---------- feature rows ---------- */
export const featureRow = (f) => `
  <div class="frow">
    <span class="frow__ic" aria-hidden="true">${icon(f.icon || "spark")}</span>
    <div class="frow__b"><b>${f.t}</b><span>${f.d}</span></div>
  </div>`;
export const featureList = (list, cols = 2) => `<div class="frows frows--${cols} rv" data-stagger>${list.map(featureRow).join("")}</div>`;

/* ---------- metric bar (section 3.4 #6) ---------- */
export const metricBar = ({ metric = {}, href, ctaLabel = "دراسة الحالة", stats = {} }) => {
  const items = [];
  if (metric.rating) items.push(`<span class="mbar__it">${icon("star")}<b>${esc(metric.rating)}</b><span>تقييم</span></span>`);
  if (metric.users)  items.push(`<span class="mbar__it">${icon("globe")}<b>${fill(metric.users, stats)}</b><span>مستخدم</span></span>`);
  if (metric.platform) items.push(`<span class="mbar__it">${icon("phone")}<b>${esc(metric.platform)}</b></span>`);
  if (metric.standard) items.push(`<span class="mbar__it">${icon("shield")}<b>${esc(metric.standard)}</b></span>`);
  if (metric.honor)  items.push(`<span class="mbar__it mbar__it--badge">${icon("award")}<b>${fill(metric.honor, stats)}</b></span>`);
  return `<div class="mbar"><div class="mbar__list">${items.join("")}</div>${href ? `<a class="btn btn--sm btn--ghost mbar__cta" href="${href}"><span>${ctaLabel}</span>${arrow()}</a>` : ""}</div>`;
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

/** Live accounting cockpit — the interactive mock used in hero, product and case pages. */
export const cockpit = ({ tilt = true, parallax = true, live = true, cls = "", interactive = false } = {}) => `
  <div${attrs({ class: `dev dev--cockpit${tilt ? " dev--tilt" : ""}${cls ? " " + cls : ""}`, "data-parallax": parallax ? "" : null, "data-cockpit": live ? "" : null, "data-ledger": interactive ? "" : null, "data-cursor": interactive ? "جرّب" : null, role: interactive ? "group" : "img", "aria-label": interactive ? "لوحة قيادة تفاعلية لمحاسب ذكي: صوِّر فاتورة أو سجّل مبيعة ليقترح النظام قيداً مزدوجاً متوازناً تعتمده" : "لقطة توضيحية من لوحة قيادة محاسب ذكي تعرض الإيرادات والمصروفات وصافي التدفّق وآخر قيد مُسجَّل متوازناً" })}>
    <div class="dev__bar" aria-hidden="true"><i></i><i></i><i></i><span class="dev__url">cockpit · محاسب ذكي${interactive ? " · حيّ" : ""}</span></div>
    <div class="cockpit"${interactive ? "" : ' aria-hidden="true"'}>
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
  </div>`;

/** Inline theme variables: light + dark pairs; `.themed` in CSS picks the pair for the active mode. */
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
      <div class="proc__side">
        <span class="proc__count" aria-hidden="true"><span data-proc-cur>01</span><span class="proc__of">/ 0${steps.length}</span></span>
        <div class="proc__progress" aria-hidden="true"><span data-proc-bar></span></div>
        <ol class="proc__dots" aria-hidden="true">${steps.map((s, i) => `<li data-proc-dot${i === 0 ? ' class="is-on"' : ""}>${esc(s.n)}</li>`).join("")}</ol>
      </div>
      <div class="proc__panels">
        ${steps.map((s, i) => `
          <article class="proc__p${i === 0 ? " is-on" : ""}" data-proc-panel aria-label="المرحلة ${esc(s.n)}: ${esc(s.t)}">
            <span class="proc__n mono">${esc(s.n)}</span>
            <h3 class="d-2">${s.t}</h3>
            <p>${s.d}</p>
            ${chips(s.tags)}
          </article>`).join("")}
      </div>
    </div>
  </div>`;

/* ---------- standards / capabilities ---------- */
export const standardsGrid = (list, live = {}) => `
  <div class="caps rv" data-stagger>
    ${list.map((s) => `<article class="cap${live[s.n] ? " cap--live" : ""}"><span class="cap__n mono">${esc(s.n)}</span><h3>${s.t}</h3><p>${s.d}</p>${live[s.n] ? `<div class="cap__live">${live[s.n]}</div>` : ""}</article>`).join("")}
  </div>`;

/** Live readout cell used by the self-audit (values filled by extras.js). */
export const live = (key, label) => `<span class="live" data-audit="${key}" title="${esc(label)}"><span class="live__l">${esc(label)}</span><b>—</b></span>`;

/* ---------- system blueprint (drawn on scroll) ---------- */
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
export const wall = (stack) => `
  <div class="wall rv" data-stagger>
    ${stack.map((s) => `<div class="wall__c"><b lang="en">${esc(s.name)}</b><span lang="en">${esc(s.role)}</span></div>`).join("")}
  </div>`;

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
