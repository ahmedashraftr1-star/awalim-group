import { icon } from "../lib/icons.mjs";
import { esc, fill, join, num, seoTitle } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

/* /work — hero + filters + sticky side index + hero cards + minor works + CTA */
export function renderIndex(ctx) {
  const { site, stats, themes, pages, cases, minor, filters } = ctx;
  const w = pages.work;
  const isEn = ctx.locale === "en";
  const t = (ar, en) => isEn ? en : ar;
  const d = C.dossier(isEn);

  const body = join([
    `<section class="phero">
      <span class="hero__orb" aria-hidden="true"></span>
      <div class="wrap wrap--wide phero__dossier-grid">
        <div class="phero__main">
          <div class="sovereign-badge rv" style="--i:0.5; margin-bottom: 1rem;">
            <span class="chip chip--accent"><span class="dot" aria-hidden="true"></span>${t("ملف الأعمال التنفيذي 2026", "Executive Portfolio 2026")}</span>
          </div>
          <h1 class="d-hero rv" style="--i:1">${w.h}</h1>
          <p class="lede rv" style="--i:2">${w.lede}</p>
          <div class="phero__actions rv" style="--i:2.5; margin: 1.5rem 0; display: flex; gap: 0.85rem; flex-wrap: wrap; align-items: center;">
            <button type="button" class="btn btn--primary btn--sm" id="btn-export-dossier" aria-haspopup="dialog" aria-expanded="false" aria-controls="modal-executive-dossier" title="${t("عرض وتحميل ملف الأعمال التنفيذي", "View and download the executive portfolio")}">
              <span>${icon("pdf", "dash-btn-svg")} ${t("تحميل / طباعة ملف الأعمال التنفيذي (PDF)", "Download Executive Portfolio (PDF)")}</span>
            </button>
            <a href="https://wa.me/970593636136?text=${encodeURIComponent(t("مرحباً م. أحمد أشرف، أود طلب استشارة فنية والاطلاع على تفاصيل ملف أعمال عوالِم قروب لمشروعنا.", "Hello Eng. Ahmed Ashraf, I would like to request an engineering consultation regarding our project."))}" target="_blank" rel="noopener" class="btn btn--outline btn--sm">
              <span>${icon("whatsapp", "dash-btn-svg")} ${t("طلب استشارة مباشرة عبر واتساب", "Direct WhatsApp Consultation")} ↗</span>
            </a>
          </div>
          <div class="pills rv" style="--i:3" role="group" aria-label="${t("تصفية الأعمال", "Filter Work")}" data-filter-group="work-list">
            ${filters.map((f, i) => `<button class="pill" type="button" data-filter="${f.key}" aria-pressed="${i === 0 ? "true" : "false"}">${esc(f.label)}</button>`).join("")}
            <span class="pills__count small muted" data-filter-count aria-live="polite"></span>
          </div>
        </div>

        <aside class="phero__card rv" style="--i:2;" aria-label="${t("ملف الأعمال التنفيذي", "Executive portfolio")}">
          ${d ? `<div class="dossier-card">
            <div class="dossier-card__hd">
              <span class="mono dossier-card__code" dir="ltr">DOSSIER · 2026</span>
              <span class="dossier-card__seal"><span class="dot" aria-hidden="true"></span>PDF · ${d.mb} MB</span>
            </div>
            <h3 class="d-2 dossier-card__title">${t("ملف الأعمال التنفيذي", "Executive Portfolio")}</h3>
            <p class="dossier-card__sub">${t("دراسات الحالة الثماني كما بُنيت، بأرقامها الموقّعة نفسها، في ملف واحد يُقرأ دون اتصال.", "All eight case studies as they were built, with the same signed numbers, in one file that reads offline.")}</p>
            <div class="dossier-card__stats">
              ${["systemsDelivered", "clientCountries", "engineersTrained", "yearsBuilding"].map((k) => stats[k] ? `<div class="dossier-stat"><span class="dossier-stat__val mono" dir="ltr">${stats[k].prefix || ""}${num(stats[k].value)}${stats[k].suffix || ""}</span><span class="dossier-stat__lbl">${esc(stats[k].label)}</span></div>` : "").join("")}
            </div>
            <div class="dossier-card__ft">
              <a href="${d.href}" download class="dossier-btn-download">${icon("download", "dash-btn-svg")}<span>${t("تنزيل ملف الأعمال (PDF)", "Download the portfolio (PDF)")}</span></a>
              <div class="dossier-card__meta">
                <span class="small mono" dir="ltr" title="SHA-256: ${d.sha}">SHA-256 ${d.short}</span>
                <a href="/verify" class="small">${t("تحقّق من الأرقام الموقّعة ←", "Verify the signed numbers →")}</a>
              </div>
            </div>
          </div>` : ""}
        </aside>
      </div>
    </section>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed">
          ${C.sideIndex([{ title: "دراسات الحالة", items: cases.map((c) => ({ id: `case-${c.slug}`, label: c.title })) }, { title: "أعمال أخرى", items: [{ id: "minor", label: "حملات وأنظمة تصميم" }] }])}
          <div class="indexed__col">
            <div class="hcards" id="work-list">
              ${cases.map((c, i) => C.heroCard({ ...c, themes, id: `case-${c.slug}`, href: `/work/${c.slug}`, alt: c.heroAlt, stats, lazy: i > 0, tags: (c.tech || []).slice(0, 4), showImpact: true, level: 2 }).replace('class="hcard themed rv', `data-cat="${c.cat}" class="hcard themed rv`)).join("")}
            </div>
            <div id="minor" class="minor">
              ${C.sectionHead({ eyebrowAr: "أعمال أخرى", eyebrowEn: "CAMPAIGNS", h: "حملات وأنظمة تصميم", lede: "أعمال هوية وحملات موسمية سُلِّمت ضمن نطاقات أصغر." })}
              <div class="tiles rv" data-stagger>
                ${minor.map((m, i) => `
                  <article class="tile" data-cat="${m.cat}">
                    <div class="tile__img"><img src="${m.img}" alt="${esc(m.title)}" width="900" height="900" loading="lazy" decoding="async"></div>
                    <div class="tile__body">
                      <span class="tile__idx mono">0${i + 1}</span>
                      <h3 class="tile__t">${esc(m.title)}</h3>
                      <p class="tile__d">${m.d}</p>
                      ${C.chips(m.tags)}
                    </div>
                  </article>`).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    C.ctaBand({ h: "مشروعك القادم يستحقّ هذا المستوى", lede: "أرسل لنا وصفاً للعملية التي تريد حلّها، ونعود إليك بتشخيص أوّلي وتقدير نطاق.", primary: { href: "/contact", label: "ابدأ محادثة", kind: "primary" }, site }),

    `<div class="dash-modal-overlay" id="modal-executive-dossier" role="dialog" aria-modal="true" aria-labelledby="modal-dossier-title">
      <div class="dash-modal" style="max-width: 680px; border: 1px solid var(--accent-line); background: var(--surface);">
        <div class="dash-modal-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); padding: 1.25rem 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="chip chip--accent" style="font-weight: 700;">2026 DOSSIER</span>
            <h2 id="modal-dossier-title" class="d-2" style="margin: 0; font-size: 1.15rem;">${t("الملف التنفيذي المعتمد | عوالِم قروب", "Executive Portfolio Dossier | Awalim Group")}</h2>
          </div>
          <button type="button" class="dash-modal-close" aria-label="${t("إغلاق الملف التنفيذي", "Close Executive Dossier")}" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
        </div>
        <div class="dash-modal-body" style="padding: 1.5rem; overflow-y: auto; max-height: 65vh; font-size: 0.95rem; line-height: 1.7;">
          <div class="card" style="margin-bottom: 1.25rem;">
            <p style="margin: 0 0 0.5rem; font-weight: 600;">
              ${t("إشراف هندسي وتنفيذي: م. أحمد أشرف — المؤسس وكبير المعماريين", "Engineering leadership: Eng. Ahmed Ashraf — founder and chief architect")}
            </p>
            <p class="small muted" style="margin: 0;">
              ${t("كل دراسة حالة في الملف مكتوبة كما بُنيت: ما المشكلة، وما الذي قرّرناه، ولماذا. الأرقام فيه هي الأرقام الموقّعة نفسها المنشورة على الموقع، ويمكن التحقّق منها في صفحة التحقّق.", "Every case study in the file is written the way it was built: the problem, the decision, and why. Its numbers are the same signed figures published on this site, checkable on the verify page.")}
            </p>
          </div>

          <h3 style="font-size: 1rem; margin-bottom: 0.75rem;">${t("ما يحويه الملف", "What the file contains")}</h3>
          <ul style="padding-inline-start: 1.25rem; margin-bottom: 1.25rem;">
            ${cases.map((c) => `<li><strong>${esc(c.title)}:</strong> ${esc(c.headline)}</li>`).join("")}
          </ul>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 1rem;">
            <span class="chip" style="font-size: 0.8rem;">✓ ${t("أرقام موقّعة Ed25519", "Ed25519-signed numbers")}</span>
            <span class="chip" style="font-size: 0.8rem;">✓ ${t("يُقرأ دون اتصال", "Reads offline")}</span>
            <span class="chip" style="font-size: 0.8rem;">✓ ${t(`${cases.length} دراسات حالة`, `${cases.length} case studies`)}</span>
          </div>
        </div>
        <div class="dash-modal-footer" style="padding: 1rem 1.5rem; border-top: 1px solid var(--border); display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
          <a href="/verify" class="btn btn--outline btn--sm" style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <span>${icon("shield", "dash-btn-svg")} ${t("تحقّق من الأرقام الموقّعة", "Verify the signed numbers")}</span>
          </a>
          ${d ? `<a href="${d.href}" download class="btn btn--primary btn--sm" style="display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 700;">
            <span>${icon("download", "dash-btn-svg")} ${t(`تنزيل ملف الأعمال الكامل (PDF ${d.mb}MB)`, `Download the full portfolio (PDF ${d.mb}MB)`)}</span>
          </a>` : ""}
          <button type="button" class="btn btn--primary btn--sm" data-action="print-dossier" style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <span>${icon("pdf", "dash-btn-svg")} ${t("طباعة فورية", "Print Now")}</span>
          </button>
        </div>
      </div>
    </div>`
  ]);

  return {
    path: "/work",
    html: page({ site, seo: { ...w.seo, path: "/work", ogImage: "/assets/img/og/work.png" }, active: "work", body, schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "الأعمال", path: "/work" }])], bodyClass: "page-work" })
  };
}

/* /work/[slug] — the case-study template (section 6.3) */
export function renderCase(ctx, c, i) {
  const { site, stats, themes, cases } = ctx;
  const t = (themes && c.theme && themes[c.theme]) ? themes[c.theme] : ((themes && themes.vibeos) ? themes.vibeos : { bg: "#050B14", fg: "#F8FAFC", dim: "#94A3B8", accent: "#00F0FF", dark: { bg: "#050B14", fg: "#F8FAFC", dim: "#94A3B8", accent: "#00F0FF" }, ink: false });
  const next = cases[(i + 1) % cases.length];
  const heroMedia = c.device === "cockpit" ? C.cockpit({ tilt: false, live: true }) : c.mock ? C.device({ kind: c.device === "laptop" ? "laptop" : "browser", inner: C.mockScreen(c.mock), alt: c.heroAlt, tilt: false, label: c.title }) : c.hero ? C.device({ kind: "frame", src: c.hero, alt: c.heroAlt, tilt: false, lazy: false }) : "";
  const toc = [
    { id: "impact", label: "النتائج" },
    { id: "challenge", label: "التحدّي" },
    { id: "approach", label: "المقاربة" },
    { id: "solution", label: "الحل" },
    ...(c.testimonial ? [{ id: "testimonial", label: "شهادة العميل" }] : []),
    { id: "next", label: "المشروع التالي" }
  ];

  const body = join([
    `<section class="chero themed${t.ink ? " chero--ink" : ""}" style="${C.themeStyle(t)};view-transition-name:vt-${c.slug};view-transition-class:vt-card">
      <div class="wrap wrap--wide">
        <nav class="crumbs rv" aria-label="مسار التنقّل"><a href="/">الرئيسية</a><span aria-hidden="true">/</span><a href="/work">الأعمال</a><span aria-hidden="true">/</span><span aria-current="page">${esc(c.title)}</span></nav>
        <div class="chero__eyebrow rv" style="--i:1">${C.syscode(c.code, "live")}<span class="chero__kind">${esc(c.kind)}</span></div>
        <h1 class="d-hero rv" style="--i:2"><span ${/[A-Za-z]/.test(c.title) ? 'lang="en"' : ""}>${esc(c.title)}</span><span class="chero__sub">${c.headline}</span></h1>
        <p class="lede rv" style="--i:3">${c.summary}</p>
        ${/* the strongest proof is the product itself: a case with a live address links to it */""}
        ${c.url ? `<p class="chero__live rv" style="--i:3"><a class="btn btn--primary" href="${esc(c.url)}" target="_blank" rel="noopener"><span>زُر الموقع الحي</span>${C.arrow()}</a><span class="chero__url" lang="en" dir="ltr">${esc(c.url.replace(/^https?:\/\//, ""))}</span></p>` : ""}
        <div class="chero__media rv" style="--i:4" data-parallax data-parallax-amount="24">${heroMedia}</div>
      </div>
    </section>`,

    C.subnav({ title: c.title, code: c.code, cta: "ابدأ مشروعاً مشابهاً", href: "/contact", secondary: { href: `/work/${next.slug}`, label: "المشروع التالي" } }),

    `<section class="sec sec--tight sec--after-hero">
      <div class="wrap wrap--wide">
        ${C.facts(c.facts)}
        <div class="chips chips--tech rv">${(c.tech || []).map((x) => `<span class="chip" lang="en">${esc(x)}</span>`).join("")}</div>
      </div>
    </section>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed">
          ${C.sideIndex([{ title: "في هذه الدراسة", items: toc }], "فهرس دراسة الحالة")}
          <div class="indexed__col case">

            <div class="case__sec" id="impact">
              ${C.sectionHead({ eyebrowAr: "النتائج", eyebrowEn: "IMPACT", h: "ما الذي تغيّر", lede: "النتيجة أولاً، ثم كيف وصلنا إليها. أرقام يمكن تتبّع مصدرها — لا صفات." })}
              <div class="impact rv" data-stagger>${(c.impact || []).map((x) => C.impactTile(x, stats)).join("")}</div>
            </div>

            <div class="case__sec" id="challenge">
              ${C.sectionHead({ eyebrowAr: "التحدّي", eyebrowEn: "THE CHALLENGE", h: "ما المشكلة التي جئنا لحلّها" })}
              <p class="lede rv">${c.challenge.p}</p>
              <ul class="bullets rv" data-stagger>${(c.challenge?.points || []).map((p) => `<li>${p}</li>`).join("")}</ul>
            </div>

            <div class="case__sec" id="approach">
              ${C.sectionHead({ eyebrowAr: "المقاربة", eyebrowEn: "APPROACH", h: "ما الذي قرّرناه — ولماذا" })}
              <div class="steps">
                ${(c.approach || []).map((s, k) => `
                  <div class="step rv${k % 2 ? " step--rev" : ""}${s.img || s.mock ? "" : " step--text"}" data-stagger>
                    <div class="step__t"><span class="step__n mono">0${k + 1}</span><h3 class="d-2">${s.t}</h3><p>${s.d}</p></div>
                    ${s.img ? `<div class="step__m" data-parallax data-parallax-amount="18">${C.device({ kind: "frame", src: s.img, alt: s.t, tilt: false })}</div>` : s.mock ? `<div class="step__m" data-parallax data-parallax-amount="18">${C.device({ kind: "browser", inner: C.mockScreen(s.mock), alt: s.t, tilt: false, label: c.title })}</div>` : ""}
                  </div>`).join("")}
              </div>
            </div>

            <div class="case__sec" id="solution">
              ${C.sectionHead({ eyebrowAr: "الحل", eyebrowEn: "SOLUTION", h: "ما الذي سُلِّم فعلاً" })}
              <p class="lede rv">${c.solution}</p>
              ${/* The architecture, drawn from the case's own data — the same
                    flow() the product pages use. It sits directly under the
                    solution paragraph so the drawing and the sentence it draws
                    are read together; the component's contract is that a
                    diagram is worth having "only where the thing drawn is
                    true", and rendering it from the case's own steps is what
                    keeps it from drifting from the words beside it.
                    Cases with no `flow` render nothing at all rather than an
                    invented architecture. */""}
              ${c.flow ? `<div class="rv">${C.flow({ steps: c.flow.steps, label: c.flow.h || c.flow.label || `معماريّة ${c.title}` })}</div>` : ""}
              ${c.device === "cockpit" ? `<div class="rv" data-parallax data-parallax-amount="16">${C.cockpit({ tilt: true, live: true })}</div>` : c.mock ? `<div class="rv" data-parallax data-parallax-amount="16">${C.device({ kind: c.device === "laptop" ? "laptop" : "browser", inner: C.mockScreen(c.mock), alt: c.heroAlt, tilt: true, label: c.title })}</div>` : C.gallery(c.gallery)}
            </div>


            ${c.testimonial ? `
            <div class="case__sec" id="testimonial">
              ${C.sectionHead({ eyebrowAr: "شهادة العميل", eyebrowEn: "TESTIMONIAL", h: "" })}
              <blockquote class="quote quote--pull rv"><p>${c.testimonial.text}</p><footer>— ${esc(c.testimonial.name)}، ${esc(c.testimonial.role)}</footer></blockquote>
            </div>` : ""}

            <div class="case__sec" id="next">
              ${C.nextCard(next, themes)}
            </div>
          </div>
        </div>
      </div>
    </section>`,

    C.ctaBand({ h: "عندك مشروع بهذا الحجم؟", lede: "احكِ لنا عن العملية، ونعود إليك بتشخيص أوّلي وتقدير نطاق — دون التزام.", primary: { href: "/contact", label: "ابدأ محادثة", kind: "primary" }, site })
  ]);

  return {
    path: `/work/${c.slug}`,
    html: page({
      site,
      seo: { title: seoTitle(c.title, c.headline, "دراسة حالة · عوالِم قروب"), description: c.summary, path: `/work/${c.slug}`, ogImage: `/assets/img/og/work-${c.slug}.png`, type: "article" },
      active: "work",
      body,
      schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "الأعمال", path: "/work" }, { name: c.title, path: `/work/${c.slug}` }])],
      bodyClass: "page-case"
    })
  };
}
