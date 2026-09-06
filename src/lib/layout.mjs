/* ==========================================================================
   layout.mjs — the page shell shared by every route: <head> (meta, OG,
   JSON-LD, font preloads), the floating pill nav, the mobile drawer, the
   footer, and the script tags. Motion libraries are only included on pages
   whose markup actually uses them (see needsMotionLibs).
   ========================================================================== */
import { esc, attrs, join } from "./html.mjs";
import { icon } from "./icons.mjs";
import { btn, arrow } from "./components.mjs";

const FONT_PRELOADS = [
  "/assets/fonts/ibm-plex-sans-arabic-400-arabic.woff2",
  "/assets/fonts/alexandria-800-arabic.woff2"
];

/* Every page ships Lenis (13KB); scroll-driven effects use the 40-line scrub
   engine in motion.js instead of GSAP+ScrollTrigger (115KB) — the brief's
   own rule: don't load all of GSAP for the one part you need. */
export const needsMotionLibs = () => false;

const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

export const orgSchema = (site) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.brand.url}/#org`,
  name: site.brand.latin,
  alternateName: site.brand.name,
  url: `${site.brand.url}/`,
  logo: `${site.brand.url}${site.brand.logo}`,
  foundingDate: String(site.stats.founded.value),
  description: site.brand.shortDescription,
  founder: { "@type": "Person", name: site.brand.founder.latin, jobTitle: "Founder & Chief Engineer" },
  address: { "@type": "PostalAddress", addressCountry: "PS", addressRegion: "Palestine" },
  contactPoint: [{ "@type": "ContactPoint", telephone: `+${site.contact.whatsapp}`, contactType: "sales", availableLanguage: ["ar", "en"] }],
  knowsAbout: ["IFRS Accounting Software", "Agentic AI", "Flutter Engineering", "Design Systems", "Web Platforms"]
});

export const siteSchema = (site) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.brand.url}/#site`,
  url: `${site.brand.url}/`,
  name: site.brand.name,
  inLanguage: "ar",
  publisher: { "@id": `${site.brand.url}/#org` }
});

export const breadcrumbSchema = (site, crumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${site.brand.url}${c.path}` }))
});

const header = (site, active) => `
<header class="pillnav" data-nav>
  <div class="wrap wrap--wide pillnav__in">
    <a class="brand" href="/">
      <img src="${site.brand.mark}" alt="" width="34" height="34">
      <span class="brand__txt"><span class="brand__name">${esc(site.brand.name)}</span><span class="brand__sub" lang="en">${esc(site.brand.latin)}</span></span>
    </a>
    <nav class="pillnav__links" aria-label="التنقل الرئيسي">
      ${site.nav.map((n) => `<a href="${n.href}"${active === n.key ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`).join("")}
    </nav>
    <div class="pillnav__act">
      <a class="icon-btn lang-btn" href="__ALT_URL__" hreflang="__ALT_CODE__" lang="__ALT_CODE__" aria-label="__ALT_ARIA__"><span>__ALT_SHORT__</span></a>
      <button class="icon-btn pal-btn" type="button" data-palette-open aria-label="بحث سريع — ⌘K" aria-keyshortcuts="Meta+K Control+K">${icon("search")}<kbd aria-hidden="true">⌘K</kbd></button>
      <button class="icon-btn" data-theme-toggle type="button" aria-label="تبديل الوضع الليلي والنهاري" aria-pressed="false">
        ${icon("moon", "i-moon")}${icon("sun", "i-sun")}
      </button>
      ${btn({ href: "/contact", label: "ابدأ مشروعك", kind: "primary", size: "sm", arrow: true, attrs: { class: "btn btn--primary btn--sm pillnav__cta" } })}
      <button class="icon-btn burger" type="button" data-drawer-open aria-expanded="false" aria-controls="drawer" aria-label="فتح القائمة">${icon("menu")}</button>
    </div>
  </div>
</header>

<div class="drawer" id="drawer" data-open="false" aria-hidden="true" role="dialog" aria-modal="true" aria-label="القائمة">
  <div class="drawer__top">
    <span class="brand__name">القائمة</span>
    <button class="icon-btn" type="button" data-drawer-close aria-label="إغلاق القائمة">${icon("close")}</button>
  </div>
  <nav class="drawer__nav" aria-label="التنقل للجوال">
    ${site.nav.map((n, i) => `<a href="${n.href}" style="--i:${i}"${active === n.key ? ' aria-current="page"' : ""}>${esc(n.label)}</a>`).join("")}
  </nav>
  <div class="btn-row">
    ${btn({ href: "/contact", label: "ابدأ مشروعك", kind: "primary", arrow: true })}
    ${btn({ href: `https://wa.me/${site.contact.whatsapp}`, label: "واتساب", kind: "ghost", arrow: false, external: true })}
    <a class="btn btn--ghost btn--sm" href="__ALT_URL__" hreflang="__ALT_CODE__" lang="__ALT_CODE__"><span>__ALT_LABEL__</span></a>
  </div>
</div>

<div class="pal" data-palette hidden role="dialog" aria-modal="true" aria-label="بحث سريع في الموقع">
  <div class="pal__scrim" data-palette-close></div>
  <div class="pal__box">
    <div class="pal__hd">
      <span class="pal__ic" aria-hidden="true">${icon("search")}</span>
      <input class="pal__in" type="search" placeholder="ابحث: RahmaCare، IFRS، وكلاء، كيف نعمل…" aria-label="ابحث في الموقع" autocomplete="off" spellcheck="false" data-pal-input>
      <button class="pal__esc" type="button" data-palette-close aria-label="إغلاق"><kbd>Esc</kbd></button>
    </div>
    <ul class="pal__list" role="listbox" aria-label="النتائج" data-pal-list></ul>
    <div class="pal__ft"><span><kbd>↑</kbd><kbd>↓</kbd> تنقّل</span><span><kbd>↵</kbd> افتح</span><span><kbd>⌘K</kbd> فتح / إغلاق</span></div>
  </div>
</div>`;

const footer = (site) => `
<footer class="ftr">
  <div class="wrap wrap--wide">
    <div class="ftr__grid">
      <div class="ftr__brand">
        <a class="brand brand--lockup" href="/">
          <img src="${site.brand.logo}" alt="${esc(site.brand.latin)}" width="1024" height="540" loading="lazy">
        </a>
        <p class="ftr__desc">${esc(site.brand.shortDescription)}</p>
        <div class="btn-row">
          ${btn({ href: `https://wa.me/${site.contact.whatsapp}`, label: `${icon("whatsapp")} واتساب`, kind: "ghost", size: "sm", arrow: false, external: true })}
          ${btn({ href: `mailto:${site.contact.email}`, label: `${icon("mail")} بريد`, kind: "ghost", size: "sm", arrow: false })}
        </div>
      </div>
      ${site.footer.columns.map((c) => `
      <nav aria-label="روابط ${esc(c.title)}">
        <h2 class="ftr__h">${esc(c.title)}</h2>
        <ul>${c.links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join("")}</ul>
      </nav>`).join("")}
    </div>
    <p class="ftr__vitals mono" data-vitals lang="ar">
      <span class="ftr__vitals-l">هذه الصفحة الآن — قياس حيّ من متصفّحك:</span>
      <span>LCP <b data-audit="lcp">—</b></span><span>CLS <b data-audit="cls">—</b></span><span>INP <b data-audit="inp">—</b></span><span>الوزن <b data-audit="weight">—</b></span>
      <a href="/verify" class="ftr__vitals-a">الأرقام موقّعة ${icon("lock")}</a>
    </p>
    <div class="ftr__btm">
      <span>© <span data-year>2026</span> ${esc(site.brand.name)} · جميع الحقوق محفوظة</span>
      <span class="ftr__origin mono" lang="en">${esc(site.brand.origin)}</span>
      <a class="ftr__top" href="#top" data-scroll-top aria-label="العودة إلى الأعلى">${icon("arrowUp")}</a>
    </div>
  </div>
</footer>`;

/**
 * page({ site, seo:{title,description,path,ogImage,type}, active, body, schema:[...], bodyClass })
 */
let criticalCss = "", buildStamp = "dev";
export const setBuild = (css, stamp) => { criticalCss = css; buildStamp = stamp; };

export const page = ({ site, seo, active = "", body, schema = [], bodyClass = "" }) => {
  const url = `${site.brand.url}${seo.path === "/" ? "/" : seo.path}`;
  const og = `${site.brand.url}${seo.ogImage || site.brand.ogImage}`;
  const motion = needsMotionLibs(body);
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(seo.title)}</title>
<meta name="description" content="${esc(seo.description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#FAFAF8">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0A0A0B">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${seo.type || "website"}">
<meta property="og:locale" content="ar_AR">
<meta property="og:site_name" content="${esc(site.brand.latin)}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(seo.title)}">
<meta property="og:description" content="${esc(seo.description)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(seo.title)}">
<meta name="twitter:description" content="${esc(seo.description)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="${site.brand.logo}" type="image/webp">
<link rel="apple-touch-icon" href="/assets/img/icon-192.png">
<link rel="manifest" href="/site.webmanifest">
${FONT_PRELOADS.map((f) => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`).join("\n")}
<style>${criticalCss}</style>
<link rel="preload" id="css-main" href="/assets/css/awalim.css?v=${buildStamp}" as="style">
<noscript><link rel="stylesheet" href="/assets/css/awalim.css?v=${buildStamp}"></noscript>
<script>
/* Theme before first paint: saved choice wins, otherwise follow the system. */
(function(){try{var s=localStorage.getItem("awalim-theme");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.setAttribute("data-theme",d?"dark":"light");if(s)document.documentElement.setAttribute("data-theme-saved","")}catch(e){}document.documentElement.classList.add("js")})();
/* The full sheet used to be promoted by an inline load handler on the link.
   script-src-attr blocks those and no hash can cover one: a hash authorises a
   script element, never an event-handler attribute. So the swap moved in here,
   where this block's own hash covers it. The listener keeps the load off the
   render path; the DOMContentLoaded arm catches the race where the preload
   finished before this script ran. */
(function(){var l=document.getElementById("css-main");if(!l)return;var on=function(){l.rel="stylesheet"};l.addEventListener("load",on,{once:true});document.addEventListener("DOMContentLoaded",function(){if(l.rel!=="stylesheet")on()},{once:true})})();
</script>
${schema.map(jsonld).join("\n")}
</head>
<body class="${[bodyClass, /data-subnav/.test(body) ? "has-subnav" : ""].filter(Boolean).join(" ")}" id="top">
<a class="skip" href="#main">تخطَّ إلى المحتوى الرئيسي</a>
<div class="curtain" data-curtain aria-hidden="true"><span class="curtain__mark"><img src="${site.brand.mark}" alt="" width="40" height="40"></span></div>
<div class="cursor" data-cursor-el aria-hidden="true"><span class="cursor__l"></span></div>
<div class="island" data-island role="status" aria-live="polite"><span class="island__ic" aria-hidden="true"></span><span class="island__t"></span></div>
${header(site, active)}
<main id="main">
${body}
</main>
${footer(site)}
<script src="/assets/vendor/lenis.min.js" defer></script>
<script src="/assets/js/awalim.js?v=${buildStamp}" defer></script>
<script src="/assets/js/motion.js?v=${buildStamp}" defer></script>
<script src="/assets/js/extras.js?v=${buildStamp}" defer></script>
${/data-ledger/.test(body) ? '<script src="/assets/js/ledger.js" defer></script>' : ""}
${/data-sec\b/.test(body) ? `<script src="/assets/js/security.js?v=${buildStamp}" defer></script>` : ""}
</body>
</html>`;
};

export { arrow, join, attrs };
