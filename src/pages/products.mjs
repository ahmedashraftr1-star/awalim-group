import { esc, fill, join, seoTitle } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

const PRODUCT_META = {
  "smart-accountant": {
    category: "fintech",
    badgeAr: "معتمد IFRS · جاهز للعزل التام (Air-Gapped)",
    badgeEn: "IFRS ACCREDITED · AIR-GAPPED READY",
    domainAr: "أنظمة مالية ومحاسبة",
    domainEn: "Sovereign FinTech & ERP",
    icon: ""
  },
  "rahmacare": {
    category: "mesh",
    badgeAr: "شبكة هجينة P2P · صفرية التبعية للإنترنت",
    badgeEn: "P2P LORA MESH · ZERO INTERNET DEPENDENCY",
    domainAr: "رعاية صحية وشبكات طوارئ",
    domainEn: "Emergency Mesh & Health",
    icon: ""
  },
  "vibe-os": {
    category: "os-ai",
    badgeAr: "نظام تشغيل زجاجي سيادي · فيزياء نابضية حية",
    badgeEn: "GLASS MATRIX OS · MASS & MAGNETISM",
    domainAr: "أنظمة تشغيل وواجهات",
    domainEn: "Glass OS & Web Physics",
    icon: ""
  },
  "ai-lab": {
    category: "os-ai",
    badgeAr: "استدلال محلي مشفر · حماية تامة من التسريب",
    badgeEn: "LOCAL LLM INFERENCE · ZERO DATA LEAK",
    domainAr: "ذكاء اصطناعي سيادي",
    domainEn: "Private AI & Local LLM",
    icon: ""
  },
  "jameel-store": {
    category: "commerce",
    badgeAr: "تجارة فائقة السرعة · كاش غير متزامن",
    badgeEn: "SUB-MILLISECOND COMMERCE · ED25519 SIGNED",
    domainAr: "متاجر ومنصات تجارية",
    domainEn: "High-Velocity Commerce",
    icon: ""
  },
  "web-platforms": {
    category: "commerce",
    badgeAr: "منصات ويب سيادية · صفرية الديون البرمجية",
    badgeEn: "SOVEREIGN WEB ARCHITECTURE",
    domainAr: "منصات وبوابات رقمية",
    domainEn: "Sovereign Web Portals",
    icon: ""
  },
  "brand-studio": {
    category: "commerce",
    badgeAr: "هوية رقمية قياسية · معايير آبل العالمية",
    badgeEn: "APPLE STANDARDS DESIGN SUITE",
    domainAr: "تصميم وهويات بصرية",
    domainEn: "Design & Brand Systems",
    icon: ""
  }
};

export function renderIndex(ctx) {
  const { site, stats, themes, pages, products } = ctx;
  const p = pages.products;
  const isEn = ctx.locale === "en";
  const t = (ar, en) => (isEn ? en : ar);

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow(t("المنتجات", "Products"), "SYS INDEX · ZERO DEBT PLATFORMS", "rv")}
        <h1 class="d-hero rv" style="--i:1">${p.h}</h1>
        <p class="lede rv" style="--i:2">${p.lede}</p>

      </div>
    </section>`,

    `<!-- Interactive Filter & Live Search Bar -->
    <div class="prod-filter-bar wrap wrap--wide rv" id="prod-filter-suite" style="--i:3">
      <div class="prod-filter-tabs" role="tablist" aria-label="${t("تصفية الأنظمة والمنتجات", "Filter Systems & Products")}">
        <button type="button" class="prod-tab is-active active" data-filter="all" role="tab" aria-selected="true" aria-pressed="true">
          ${t("الكل", "All")} <span class="prod-tab-badge">7</span>
        </button>
        <button type="button" class="prod-tab" data-filter="fintech" role="tab" aria-selected="false" aria-pressed="false">
          ${t("الأنظمة المالية والمحاسبية", "FinTech & ERP")} <span class="prod-tab-badge">1</span>
        </button>
        <button type="button" class="prod-tab" data-filter="mesh" role="tab" aria-selected="false" aria-pressed="false">
          ${t("الصحة وشبكات الطوارئ", "Health & Mesh")} <span class="prod-tab-badge">1</span>
        </button>
        <button type="button" class="prod-tab" data-filter="os-ai" role="tab" aria-selected="false" aria-pressed="false">
          ${t("أنظمة التشغيل والذكاء", "OS & Private AI")} <span class="prod-tab-badge">2</span>
        </button>
        <button type="button" class="prod-tab" data-filter="commerce" role="tab" aria-selected="false" aria-pressed="false">
          ${t("المتاجر والهوية الرقمية", "Commerce & Studio")} <span class="prod-tab-badge">3</span>
        </button>
      </div>

      <div class="prod-search-wrapper">
        <label for="input-prod-search" class="sr-only">${t("بحث فوري في مواصفات الأنظمة", "Instant search in system specifications")}</label>
        <div class="prod-search-box">
          <span class="prod-search-icon" aria-hidden="true"></span>
          <input type="search" id="input-prod-search" class="prod-search-input" autocomplete="off" placeholder="${t("ابحث في المنتجات: محاسبة، صحة، متجر…", "Search products: accounting, health, store…")}">
          <span class="prod-count-pill" id="prod-counter-display">${t("عرض 7 من 7 أنظمة", "Showing 7 of 7 systems")}</span>
        </div>
      </div>
    </div>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="hcards hcards--grid" id="prod-items-grid">
          ${products.map((x, i) => {
            const meta = PRODUCT_META[x.slug] || { category: "commerce", badgeAr: "نظام سيادي", badgeEn: "Sovereign System", icon: "" };
            const cardMarkup = C.heroCard({
              ...x,
              themes,
              href: `/products/${x.slug}`,
              image: x.image,
              alt: x.title,
              metric: { platform: x.tags[0], standard: x.tags[1], honor: x.kind },
              ctaLabel: t("استعرض", "Explore"),
              stats,
              lazy: i > 0,
              tags: x.tags,
              level: 2
            });

            const searchTokens = [
              x.slug,
              x.title,
              x.headline,
              x.summary,
              ...(x.tags || []),
              isEn ? meta.domainEn : meta.domainAr
            ].join(" ").toLowerCase();

            return `
              <div class="prod-card-wrapper" data-category="${meta.category}" data-search="${esc(searchTokens)}">
                <div class="prod-card-topbar">
                  <span class="prod-card-domain">${esc(isEn ? meta.domainEn : meta.domainAr)}</span>
                  <span class="prod-card-icon">${meta.icon}</span>
                </div>
                ${cardMarkup}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </section>`,

    C.ctaBand({
      h: t("تحتاج نظاماً مبنياً على مقاس عملك؟", "Need a system built around how you work?"),
      lede: t("احكِ لنا عن العملية التي تريد ضبطها. نعود إليك بتشخيص أوّلي وتقدير نطاق ومدّة — والكود وحقوقه ملكك من اليوم الأول.", "Tell us about the process you want under control. We come back with a first diagnosis, a scope and a timeline — and the code and its rights are yours from day one."),
      primary: { label: t("ابدأ مشروعك", "Start your project"), href: "/contact" },
      secondary: { label: t("استعرض الخدمات الهندسية", "Explore Engineering Services"), href: "/services" },
      site,
      rv: 8
    })
  ]);

  return {
    path: "/products",
    html: page({
      site,
      seo: { ...p.seo, path: "/products", ogImage: "/assets/img/og/products.png" },
      active: "products",
      body,
      schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "المنتجات", path: "/products" }])],
      bodyClass: "page-products"
    })
  };
}

/* /products/[slug] — the rich product template (section 6.5) */
export function renderProduct(ctx, p) {
  const { site, stats, themes, cases } = ctx;
  const t = themes[p.theme] || themes.blue;
  const relatedCase = p.caseSlug ? cases.find((c) => c.slug === p.caseSlug) : null;
  const heroMedia = p.device === "cockpit" ? C.cockpit({ tilt: true, live: true, cls: "hero__dev" }) : p.mock ? C.device({ kind: p.device, inner: C.mockScreen(p.mock), alt: p.headline, tilt: true, label: p.title }) : p.image ? C.device({ kind: p.device, src: p.image, alt: p.title, tilt: true, lazy: false, label: p.title }) : "";
  const toc = [
    { id: "features", label: "المزايا" },
    ...(p.modules && p.modules.length ? [{ id: "modules", label: "الوحدات" }] : []),
    ...(p.countries && p.countries.length ? [{ id: "countries", label: "حزم الدول" }] : []),
    { id: "usecases", label: "لمن هو" },
    { id: "proof", label: "الدليل" },
    { id: "architecture", label: "البنية" }
  ];

  const body = join([
    `<section class="hero hero--product themed${t.ink ? " hero--ink" : ""}" style="${C.themeStyle(t)};view-transition-name:vt-${p.slug};view-transition-class:vt-card" data-hero>
      <div class="wrap wrap--wide hero__in">
        <div class="hero__t">
          <nav class="crumbs rv" aria-label="مسار التنقّل"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="/products">المنتجات</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.title)}</span></nav>
          <div class="chero__eyebrow rv" style="--i:1">${C.syscode(p.code, p.status)}<span class="chero__kind">${esc(p.kind)}</span></div>
          <h1 class="d-hero rv" style="--i:2">${esc(p.title)}</h1>
          <p class="lede rv" style="--i:3">${p.headline}</p>
          <div class="chips rv" style="--i:4">${p.tags.map((x) => `<span class="chip chip--card">${esc(x)}</span>`).join("")}</div>
          <div class="btn-row rv" style="--i:5">
            ${C.btn({ href: "/contact", label: p.cta ? p.cta.label : "اطلب ترخيص المنظومة", kind: "primary" })}
            ${relatedCase ? C.btn({ href: `/work/${relatedCase.slug}`, label: "دراسة الحالة", kind: "ghost", arrow: true }) : C.btn({ href: "/work", label: "كل الأعمال", kind: "ghost", arrow: true })}
          </div>
        </div>
        <div class="hero__media rv" style="--i:2" data-tilt>${heroMedia}</div>
      </div>
    </section>`,

    C.subnav({ title: p.title, code: p.code, status: p.status, cta: p.cta ? p.cta.label : "طلب عرض", href: "/contact", secondary: relatedCase ? { href: `/work/${relatedCase.slug}`, label: "دراسة الحالة" } : null }),
    p.film ? C.film(p.film) : "",
    p.moments ? C.moments(p.moments, stats) : "",

    /* drawn only where the drawing is true — this flow is the live demo's own
       sequence, not an illustration invented for the page */
    p.flow ? `<section class="sec sec--alt" id="flow">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: p.flow.eyebrow, eyebrowEn: "THE PATH", h: p.flow.h, lede: p.flow.lede })}
        ${C.flow({ steps: p.flow.steps, label: p.flow.h })}
      </div>
    </section>` : "",

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed">
          ${C.sideIndex([{ title: "في هذه الصفحة", items: [...(p.film ? [{ id: "film", label: "كيف يعمل" }] : []), ...toc] }], "فهرس المنتج")}
          <div class="indexed__col">

            <div class="case__sec" id="features">
              ${C.sectionHead({ eyebrowAr: "المزايا", eyebrowEn: "FEATURES", h: "ما الذي يفعله فعلاً" })}
              ${C.featureList(p.features, 2)}
            </div>

            ${p.modules && p.modules.length ? `
            <div class="case__sec" id="modules">
              ${C.sectionHead({ eyebrowAr: "الوحدات", eyebrowEn: "MODULES", h: `${p.modules.length} وحدات جاهزة` })}
              <div class="tbl-wrap rv" tabindex="0" role="region" aria-labelledby="mod-cap">
                <table class="tbl">
                  <caption class="sr-only" id="mod-cap">جدول وحدات ${esc(p.title)} وما تشمله كل وحدة</caption>
                  <thead><tr><th scope="col">الوحدة</th><th scope="col">ما تشمله</th></tr></thead>
                  <tbody>${p.modules.map(([m, d]) => `<tr><td>${esc(m)}</td><td>${esc(d)}</td></tr>`).join("")}</tbody>
                </table>
              </div>
            </div>` : ""}

            ${p.countries && p.countries.length ? `
            <div class="case__sec" id="countries">
              ${C.sectionHead({ eyebrowAr: "حزم الدول", eyebrowEn: "COUNTRY PACKS", h: `${p.countries.length} حزم دول`, lede: p.countriesNote || "" })}
              <div class="packs rv" data-stagger>${p.countries.map((c) => `<span class="pack">${esc(c)}</span>`).join("")}</div>
            </div>` : ""}

            <div class="case__sec" id="usecases">
              ${C.sectionHead({ eyebrowAr: "لمن هو", eyebrowEn: "USE CASES", h: "من يستفيد منه" })}
              <div class="ucases rv" data-stagger>${(p.useCases || []).map((u, i) => `<article class="ucase"><span class="ucase__n mono">0${i + 1}</span><h3>${u.t}</h3><p>${u.d}</p></article>`).join("")}</div>
            </div>

            <div class="case__sec" id="proof">
              ${C.sectionHead({ eyebrowAr: "الدليل", eyebrowEn: "PROOF", h: "أرقام لا صفات" })}
              <div class="impact rv" data-stagger>${(p.proof || []).map((x) => C.impactTile(x.stat ? x : x.text !== undefined ? x : { n: x.n, prefix: x.prefix || "", suffix: x.suffix || "", label: x.label }, stats)).join("")}</div>
              ${p.testimonial ? `<blockquote class="quote quote--pull rv"><p>${p.testimonial.text}</p><footer>— ${esc(p.testimonial.name)}</footer></blockquote>` : ""}
            </div>

            <div class="case__sec" id="architecture">
              ${C.sectionHead({ eyebrowAr: "البنية التقنية", eyebrowEn: "ARCHITECTURE", h: "كيف بُني" })}
              <ul class="bullets rv" data-stagger>${(p.architecture || []).map((a) => `<li>${a}</li>`).join("")}</ul>
              ${relatedCase ? C.nextCard(relatedCase, themes, "دراسة الحالة") : ""}
            </div>
          </div>
        </div>
      </div>
    </section>`,

    C.ctaBand({ h: p.cta ? p.cta.label : "جرّب النظام", lede: p.cta ? p.cta.sub : "عرض تقديمي مباشر", primary: { href: "/contact", label: p.cta ? p.cta.label : "اطلب عرضاً", kind: "primary" }, site })
  ]);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.summary,
    brand: { "@type": "Brand", name: site.brand.latin },
    sku: p.code,
    category: p.kind,
    url: `${site.brand.url}/products/${p.slug}`,
    ...(p.image ? { image: `${site.brand.url}${p.image}` } : {})
  };

  return {
    path: `/products/${p.slug}`,
    html: page({
      site,
      seo: { title: seoTitle(p.title, p.headline, "عوالِم قروب"), description: p.summary, path: `/products/${p.slug}`, ogImage: `/assets/img/og/products-${p.slug}.png`, type: "product" },
      active: "products",
      body,
      schema: [productSchema, breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "المنتجات", path: "/products" }, { name: p.title, path: `/products/${p.slug}` }])],
      bodyClass: "page-product"
    })
  };
}
