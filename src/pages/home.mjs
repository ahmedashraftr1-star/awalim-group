import { esc, fill, join } from "../lib/html.mjs";
import { page, orgSchema, siteSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

export default function render(ctx) {
  const { site, stats, themes, pages, cases, products, articles } = ctx;
  const h = pages.home;

  const heroLines = h.hero.lines
    .map((l, i) => `<span class="kl" style="--i:${i}"><span class="kl__in">${l}</span></span>`)
    .join("");

  const selected = h.selectedWork.map((slug) => cases.find((c) => c.slug === slug)).filter(Boolean);
  const gridProducts = h.gridProducts
    .map((slug) => (slug === "academy" ? { code: "SYS-ACAD-03", status: "live", theme: "academy", title: "أكاديمية عوالِم", summary: `مسارات تدريب هندسية في الذكاء الاصطناعي وتطوير الأنظمة. ${fill("{engineersTrained}", stats)} مهندس تدرّبوا فيها.`, href: "/academy" } : products.find((p) => p.slug === slug)))
    .filter(Boolean)
    .map((p) => ({ ...p, href: p.href || `/products/${p.slug}` }));
  const posts = h.journal.map((s) => articles.find((a) => a.slug === s)).filter(Boolean);

  /* Calm-premium pass (2026-09-28): the home page was 26 sections and ~32
     screens. It now answers a buyer's questions in the order they ask them —
     what do you do, how big are you, what have you built, how do you think,
     how do you work, who are you, what about X, how do I start. The removed
     sections (bento highlights, sovereign architecture, why-us, vs-big-tech,
     values, product grid, engines, disciplines, standards, stack, reach,
     journal, milestones, estimator, pathways) still exist as components and
     on their own pages. The endorsements were removed outright — they quoted
     named people who never gave them. */
  const body = join([
    /* 1 — HERO */
    `<section class="hero" data-hero>
      <div class="wrap wrap--wide hero__in">
        <div class="hero__t">
          ${C.eyebrow(h.hero.eyebrow, "", "eyebrow--hero rv")}
          <h1 class="d-hero">${heroLines}</h1>
          <p class="lede hero__lede rv" style="--i:3">${h.hero.lede}</p>
          <div class="btn-row hero__cta rv" style="--i:4">
            ${C.btn({ href: "/contact", label: "ابدأ مشروعك", kind: "primary" })}
            ${C.btn({ href: "/work", label: "شاهد الأعمال", kind: "ghost", arrow: false })}
            <span class="chip chip--accent chip--pulse"><span class="dot" aria-hidden="true"></span>${esc(site.contact.availability)}</span>
          </div>
          <div class="hero__meta rv" style="--i:5">
            <img src="${site.brand.founder.photo}" alt="" width="44" height="44" loading="lazy" decoding="async">
            <p>أسّسها <b>${esc(site.brand.founder.name)}</b> عام ${stats.founded.value} من غزّة. اليوم فريق هندسي يخدم عملاء في ${fill("{clientCountries}", stats).replace("+", "")} دولة.</p>
          </div>
        </div>
        <div class="hero__media rv" style="--i:2" data-tilt>
          ${C.cockpit({ tilt: false, live: true, cls: "hero__dev", interactive: true })}
          <span class="hero__orb" aria-hidden="true"></span>
        </div>
      </div>
    </section>`,

    /* 2 — STAT BAR (four equal tiles, no empty cell) */
    `<section class="sec sec--tight" aria-label="أرقام عوالِم">
      <div class="wrap wrap--wide">${C.statBar(h.statBar, stats, { size: "xl", cls: "statbar--hero", verify: true, signing: ctx.signing })}</div>
    </section>`,

    /* 3 — WHAT WE BUILD
       The first thing a buyer asks, and the home page had stopped answering
       it. One typographic index — the page's focal moment — read straight
       from the services content, so it can't drift from /services. */
    `<section class="sec" id="build" aria-labelledby="build-h">
      <div class="wrap wrap--wide">
        <div class="bindex__head rv">
          ${C.eyebrow("ماذا نبني", "WHAT WE BUILD")}
          <h2 class="d-1" id="build-h">أربعة مجالات. في كلٍّ منها عمق حقيقي.</h2>
        </div>
        <ol class="bindex" data-stagger>
          ${pages.services.items.map((it) => `<li class="bindex__i rv">
            <a class="bindex__row" href="/services#${it.id}">
              <span class="bindex__n" aria-hidden="true">${esc(it.n)}</span>
              <span class="bindex__t">${esc(it.t)}</span>
              <span class="bindex__h">${it.h}</span>
              <span class="bindex__go" aria-hidden="true">${C.arrow()}</span>
            </a>
          </li>`).join("")}
        </ol>
      </div>
    </section>`,

    /* 6 — SELECTED WORK */
    `<section class="sec" id="work">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "الأعمال", eyebrowEn: "SELECTED WORK", h: "ما بنيناه فعلاً", lede: "أنظمة وتطبيقات وهويات سُلِّمت لعملاء حقيقيين." })}
        <div class="hcards">
          ${selected.map((c) => C.heroCard({ ...c, themes, href: `/work/${c.slug}`, alt: c.heroAlt, stats, lazy: true, showImpact: true })).join("")}
        </div>
        ${C.btnRow([C.btn({ href: "/work", label: "كل الأعمال", kind: "primary" })], "btn-row--after")}
      </div>
    </section>`,

    /* 5 — MANIFESTO */
    `<section class="sec sec--alt">
      <div class="wrap wrap--wide">
        <div class="manifesto rv" data-stagger>
          ${C.eyebrow(h.manifesto.eyebrow, "MANIFESTO")}
          <h2 class="d-1 manifesto__h">${h.manifesto.h}</h2>
          <div class="manifesto__b">
            <p class="lede">${h.manifesto.p1}</p>
            <p class="lede">${h.manifesto.p2}</p>
            ${C.btnRow([C.btn({ href: "/services#process", label: "كيف نعمل بالتفصيل", kind: "ghost", arrow: true })])}
          </div>
          <div class="manifesto__bp">${C.blueprint()}</div>
        </div>
      </div>
    </section>`,

    /* 10 — PROCESS (pinned) */
    `<section class="sec sec--ink" id="process">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "كيف نعمل", eyebrowEn: "PROCESS", h: "أربع مراحل. لا مفاجآت.", lede: "مسار واحد لكل مشروع — تعرف فيه ما الذي يحدث الآن وما الذي يليه." })}
      </div>
      ${C.processPinned(site.process, { id: "process-stage" })}
    </section>`,

    /* 11 — ACADEMY GLIMPSE */
    `<section class="sec sec--alt" id="academy">
      <div class="wrap wrap--wide">
        <div class="split split--rev">
          <div class="acad rv" data-stagger>
            <div class="acad__stats">
              ${C.statTile(stats.certifiedGraduates, { size: "lg" })}
              ${C.statTile(stats.graduateCountries, { size: "lg" })}
            </div>
            <hr class="rule">
            <p class="small muted">${fill("{engineersTrained} مهندس دخلوا مسارات الأكاديمية؛ {certifiedGraduates} منهم أنهوا المسار كاملاً بمشروع منشور. التدريب ليس خط دخل — هو كيف نبني الفريق الذي نوظّفه لاحقاً.", stats)}</p>
          </div>
          <div class="rv" data-stagger>
            ${C.eyebrow("الأكاديمية", "ACADEMY")}
            <h2 class="d-1">أكاديمية عوالِم</h2>
            <p class="lede">مسارات تدريب هندسية تُدرَّس بالطريقة التي نعمل بها فعلاً: مشروع حقيقي، مراجعة كود، واختبارات — لا سلسلة فيديوهات.</p>
            ${C.btnRow([C.btn({ href: "/academy", label: "المسارات", kind: "ghost", arrow: true })])}
          </div>
        </div>
      </div>
    </section>`,

    /* 13 — FOUNDER */
    `<section class="sec sec--alt" id="founder">
      <div class="wrap wrap--wide">${C.founder({ site, quote: site.founderQuote })}</div>
    </section>`,

    /* 14 — FAQ */
    `<section class="sec" id="faq">
      <div class="wrap wrap--wide">
        <div class="split split--top">
          <div class="rv" data-stagger>
            ${C.eyebrow("أسئلة متكرّرة", "FAQ")}
            <h2 class="d-1">قبل أن تتواصل</h2>
            <p class="lede">إن لم تجد سؤالك هنا، اسألنا مباشرة على واتساب — نردّ عادةً خلال ساعات العمل.</p>
            ${C.btnRow([C.waLink(site, "اسألنا على واتساب")])}
          </div>
          ${C.accordion(site.faq)}
        </div>
      </div>
    </section>`,

    /* 15 — CTA */
    C.ctaBand({ h: "عندك عملية تستحقّ نظاماً؟", lede: "احكِ لنا عن العملية التي تستهلك وقت فريقك اليوم. نعود إليك بتشخيص أوّلي وتقدير نطاق — دون التزام منك.", primary: { href: "/contact", label: "ابدأ محادثة", kind: "primary" }, site }),
  ]);

  return {
    path: "/",
    html: page({ site, seo: { ...h.seo, path: "/", ogImage: "/assets/img/og/home.png" }, active: "home", body, schema: [orgSchema(site), siteSchema(site)], bodyClass: "page-home" })
  };
}
