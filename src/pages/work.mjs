import { esc, fill, join } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

/* /work — hero + filters + sticky side index + hero cards + minor works + CTA */
export function renderIndex(ctx) {
  const { site, stats, themes, pages, cases, minor, filters } = ctx;
  const w = pages.work;

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow("الأعمال", "SELECTED WORK", "rv")}
        <h1 class="d-hero rv" style="--i:1">${w.h}</h1>
        <p class="lede rv" style="--i:2">${w.lede}</p>
        <div class="pills rv" style="--i:3" role="group" aria-label="تصفية الأعمال" data-filter-group="work-list">
          ${filters.map((f, i) => `<button class="pill" type="button" data-filter="${f.key}" aria-pressed="${i === 0 ? "true" : "false"}">${esc(f.label)}</button>`).join("")}
          <span class="pills__count small muted" data-filter-count aria-live="polite"></span>
        </div>
      </div>
    </section>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed">
          ${C.sideIndex([{ title: "دراسات الحالة", items: cases.map((c) => ({ id: `case-${c.slug}`, label: c.title })) }, { title: "أعمال أخرى", items: [{ id: "minor", label: "حملات وأنظمة تصميم" }] }])}
          <div class="indexed__col">
            <div class="hcards" id="work-list">
              ${cases.map((c, i) => C.heroCard({ ...c, themes, id: `case-${c.slug}`, href: `/work/${c.slug}`, alt: c.heroAlt, stats, lazy: i > 0, tags: c.tech.slice(0, 4), level: 2 }).replace('class="hcard themed rv', `data-cat="${c.cat}" class="hcard themed rv`)).join("")}
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

    C.ctaBand({ h: "مشروعك القادم يستحقّ هذا المستوى", lede: "أرسل لنا وصفاً للعملية التي تريد حلّها، ونعود إليك بتشخيص أوّلي وتقدير نطاق.", primary: { href: "/contact", label: "ابدأ محادثة", kind: "primary" }, site })
  ]);

  return {
    path: "/work",
    html: page({ site, seo: { ...w.seo, path: "/work", ogImage: "/assets/img/og/work.png" }, active: "work", body, schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "الأعمال", path: "/work" }])], bodyClass: "page-work" })
  };
}

/* /work/[slug] — the case-study template (section 6.3) */
export function renderCase(ctx, c, i) {
  const { site, stats, themes, cases } = ctx;
  const t = themes[c.theme];
  const next = cases[(i + 1) % cases.length];
  const heroMedia = c.device === "cockpit" ? C.cockpit({ tilt: false, live: true }) : c.mock ? C.device({ kind: c.device === "laptop" ? "laptop" : "browser", inner: C.mockScreen(c.mock), alt: c.heroAlt, tilt: false, label: c.title }) : c.hero ? C.device({ kind: "frame", src: c.hero, alt: c.heroAlt, tilt: false, lazy: false }) : "";
  const toc = [
    { id: "challenge", label: "التحدّي" },
    { id: "approach", label: "المقاربة" },
    { id: "solution", label: "الحل" },
    { id: "impact", label: "النتائج" },
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
        <div class="chero__media rv" style="--i:4" data-parallax data-parallax-amount="24">${heroMedia}</div>
      </div>
    </section>`,

    C.subnav({ title: c.title, code: c.code, cta: "ابدأ مشروعاً مشابهاً", href: "/contact", secondary: { href: `/work/${next.slug}`, label: "المشروع التالي" } }),

    `<section class="sec sec--tight sec--after-hero">
      <div class="wrap wrap--wide">
        ${C.facts(c.facts)}
        <div class="chips chips--tech rv">${c.tech.map((x) => `<span class="chip" lang="en">${esc(x)}</span>`).join("")}</div>
      </div>
    </section>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed">
          ${C.sideIndex([{ title: "في هذه الدراسة", items: toc }], "فهرس دراسة الحالة")}
          <div class="indexed__col case">

            <div class="case__sec" id="challenge">
              ${C.sectionHead({ eyebrowAr: "التحدّي", eyebrowEn: "THE CHALLENGE", h: "ما المشكلة التي جئنا لحلّها" })}
              <p class="lede rv">${c.challenge.p}</p>
              <ul class="bullets rv" data-stagger>${c.challenge.points.map((p) => `<li>${p}</li>`).join("")}</ul>
            </div>

            <div class="case__sec" id="approach">
              ${C.sectionHead({ eyebrowAr: "المقاربة", eyebrowEn: "APPROACH", h: "ما الذي قرّرناه — ولماذا" })}
              <div class="steps">
                ${c.approach.map((s, k) => `
                  <div class="step rv${k % 2 ? " step--rev" : ""}${s.img || s.mock ? "" : " step--text"}" data-stagger>
                    <div class="step__t"><span class="step__n mono">0${k + 1}</span><h3 class="d-2">${s.t}</h3><p>${s.d}</p></div>
                    ${s.img ? `<div class="step__m" data-parallax data-parallax-amount="18">${C.device({ kind: "frame", src: s.img, alt: s.t, tilt: false })}</div>` : s.mock ? `<div class="step__m" data-parallax data-parallax-amount="18">${C.device({ kind: "browser", inner: C.mockScreen(s.mock), alt: s.t, tilt: false, label: c.title })}</div>` : ""}
                  </div>`).join("")}
              </div>
            </div>

            <div class="case__sec" id="solution">
              ${C.sectionHead({ eyebrowAr: "الحل", eyebrowEn: "SOLUTION", h: "ما الذي سُلِّم فعلاً" })}
              <p class="lede rv">${c.solution}</p>
              ${c.device === "cockpit" ? `<div class="rv" data-parallax data-parallax-amount="16">${C.cockpit({ tilt: true, live: true })}</div>` : c.mock ? `<div class="rv" data-parallax data-parallax-amount="16">${C.device({ kind: c.device === "laptop" ? "laptop" : "browser", inner: C.mockScreen(c.mock), alt: c.heroAlt, tilt: true, label: c.title })}</div>` : C.gallery(c.gallery)}
            </div>

            <div class="case__sec" id="impact">
              ${C.sectionHead({ eyebrowAr: "النتائج", eyebrowEn: "IMPACT", h: "ما الذي تغيّر", lede: "أرقام يمكن تتبّع مصدرها — لا صفات." })}
              <div class="impact rv" data-stagger>${c.impact.map((x) => C.impactTile(x, stats)).join("")}</div>
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
      seo: { title: `${c.title} — ${c.headline} | دراسة حالة · عوالِم قروب`, description: c.summary, path: `/work/${c.slug}`, ogImage: `/assets/img/og/work-${c.slug}.png`, type: "article" },
      active: "work",
      body,
      schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "الأعمال", path: "/work" }, { name: c.title, path: `/work/${c.slug}` }])],
      bodyClass: "page-case"
    })
  };
}
