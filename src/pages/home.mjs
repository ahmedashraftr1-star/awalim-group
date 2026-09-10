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
            <p>أسّسها <b>${esc(site.brand.founder.name)}</b> عام ${stats.founded.value} من غزّة. اليوم فريق هندسي يخدم عملاء في أكثر من ${fill("{clientCountries}", stats).replace("+", "")} دول.</p>
          </div>
        </div>
        <div class="hero__media rv" style="--i:2" data-tilt>
          ${C.cockpit({ tilt: true, live: true, cls: "hero__dev", interactive: true })}
          <span class="hero__orb" aria-hidden="true"></span>
        </div>
      </div>
    </section>`,

    /* 2 — STAT BAR (four equal tiles, no empty cell) */
    `<section class="sec sec--tight" aria-label="أرقام عوالِم">
      <div class="wrap wrap--wide">${C.statBar(h.statBar, stats, { size: "xl", cls: "statbar--hero", verify: true, signing: ctx.signing })}</div>
    </section>`,

    /* 3 — TECH STRIP (dark, visually separated from the hero) */
    `<div class="marq-band">${C.marquee(site.marquee)}</div>`,

    /* 4 — STORY SPLIT */
    `<section class="sec">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "أبرز المحطّات", eyebrowEn: "HIGHLIGHTS", h: "خمس سنوات من الشحن" })}
        <div class="story rv" data-stagger>
          <div class="story__card themed" style="${C.themeStyle(themes.rahmacare)}">
            <p class="story__big d-2">${h.story.big}</p>
            <p class="story__p">${h.story.p}</p>
            ${C.btn({ href: "/group", label: "القصّة الكاملة", kind: "light", arrow: true })}
          </div>
          <ul class="story__list">
            ${site.highlights.map((x, i) => `<li class="story__it" style="--i:${i}"><span class="story__n mono">0${i + 1}</span><span>${fill(x, stats)}</span></li>`).join("")}
          </ul>
        </div>
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

    /* 5b — WHY US
       The competitor answers this with adjectives. Adjectives are free, so
       they are worth nothing. Every reason here ends in a link to the place on
       this site where the visitor checks it — and the last one opens onto a
       measurement with a column we lose. */
    `<section class="sec" id="why">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: h.why.eyebrow, eyebrowEn: "WHY US", h: h.why.h, lede: h.why.lede })}
        ${C.whyGrid(h.why.reasons)}
        <div class="why__cmp" id="compare">${C.compareStrip(ctx.compare, h.why.cmp)}</div>
      </div>
    </section>`,

    /* 6 — SELECTED WORK */
    `<section class="sec" id="work">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "الأعمال", eyebrowEn: "SELECTED WORK", h: "ما بنيناه فعلاً", lede: "أنظمة وتطبيقات وهويات سُلِّمت لعملاء حقيقيين." })}
        <div class="hcards">
          ${selected.map((c) => C.heroCard({ ...c, themes, href: `/work/${c.slug}`, alt: c.heroAlt, stats, lazy: true })).join("")}
        </div>
        ${C.btnRow([C.btn({ href: "/work", label: "كل الأعمال", kind: "primary" })], "btn-row--after")}
      </div>
    </section>`,

    /* 7 — PRODUCT GRID 3×2 */
    `<section class="sec sec--alt" id="ecosystem">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "المنظومة", eyebrowEn: "SYSTEMS", h: "ستّة خطوط إنتاج تحت مظلّة واحدة", lede: "كل خط منتج قائم بذاته — ويستفيد من البنية والفريق نفسيهما." })}
        <div class="pcards" data-stagger>${gridProducts.map((p) => C.pcard(p, themes)).join("")}</div>
      </div>
    </section>`,

    /* 8 — ENGINEERING STANDARDS */
    `<section class="sec" id="standards">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "المعايير", eyebrowEn: "ENGINEERING STANDARDS", h: "ثمانية شروط لا نسلّم بدونها", lede: "ليست ميزات نبيعها — هي الحدّ الأدنى الذي يجعل النظام صالحاً للتشغيل أصلاً." })}
        ${C.standardsGrid(site.standards, {
          "01": `<a class="lnk" href="#top" data-scroll-top><span>جرّب محرّك القيود في الأعلى</span>${C.arrow()}</a>`,
          "05": `<span class="live live--static"><span class="live__l">قبل كل نشر</span><b>${ctx.routesCount || 31} مسار × 2 شاشة · تباين · روابط</b></span>`,
          "06": `${C.live("contrast", "تباين هذه الصفحة الآن")}${C.live("headings", "تسلسل العناوين")}`,
          "07": `${C.live("rtl", "الاتجاه واللغة")}${C.live("digits", "سياسة الأرقام")}`,
          "08": `${C.live("lcp", "LCP")}${C.live("cls", "CLS")}${C.live("inp", "INP")}${C.live("weight", "الوزن")}`
        })}
        <p class="small muted rv caps__note">القيم في البطاقات 06–08 تُقاس حيّاً في متصفّحك الآن عبر <bdi lang="en">PerformanceObserver</bdi> — لا نكتب أرقاماً لا نقيسها.</p>
      </div>
    </section>`,

    /* 9 — STACK */
    `<section class="sec sec--alt" id="stack">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "المنظومة التقنية", eyebrowEn: "STACK", h: "أدوات نعرفها عن ظهر قلب", lede: "لا نطارد كل جديد. مع كل أداة هنا الحدّ الذي اصطدمنا به فيها — ومعرفة الحدّ هي الفرق بين استعمال الأداة وإتقانها." })}
        ${C.wall(site.stack)}
      </div>
    </section>`,

    /* 9b — WHERE WE OPERATE
       A competitor answers this with a wall of client flags. We cannot: the
       client names are not ours to publish. So the section is split — what we
       can NAME (country packs we built, each openable and checkable) sits above
       what we can only COUNT (signed numbers), and the note says which is which
       and why. Stating the boundary is the claim; a flag we cannot back is not. */
    `<section class="sec" id="reach">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: site.reach.eyebrowAr, eyebrowEn: site.reach.eyebrowEn, h: site.reach.h, lede: site.reach.lede })}
        <div class="reach rv" data-stagger>
          <div class="reach__named">
            <p class="reach__label">${site.reach.namedLabel}</p>
            <ul class="reach__packs">
              ${site.reach.named.map((n) => `<li class="reach__pack">${n}</li>`).join("")}
            </ul>
          </div>
          <div class="reach__counted">
            ${site.reach.counted.map((c) => C.statTile({ ...stats[c.stat], label: c.label }, { size: "md" })).join("")}
          </div>
        </div>
        <p class="reach__note rv">${site.reach.note}</p>
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
            ${C.eyebrow("SYS-ACAD-03", "ACADEMY")}
            <h2 class="d-1">أكاديمية عوالِم</h2>
            <p class="lede">مسارات تدريب هندسية تُدرَّس بالطريقة التي نعمل بها فعلاً: مشروع حقيقي، مراجعة كود، واختبارات — لا سلسلة فيديوهات.</p>
            ${C.btnRow([C.btn({ href: "/academy", label: "المسارات", kind: "ghost", arrow: true })])}
          </div>
        </div>
      </div>
    </section>`,

    /* 12 — JOURNAL */
    `<section class="sec" id="journal">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "رؤى", eyebrowEn: "JOURNAL", h: "ما نتعلّمه ونكتبه", lede: "ملاحظات هندسية من مشاريع حقيقية — لا محتوى تسويقي." })}
        <div class="posts" data-stagger>${posts.map((a) => C.postCard(a)).join("")}</div>
        ${C.btnRow([C.btn({ href: "/journal", label: "كل المقالات", kind: "ghost", arrow: true })], "btn-row--after")}
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
    C.ctaBand({ h: "عندك عملية تستحقّ نظاماً؟", lede: "احكِ لنا عن العملية التي تستهلك وقت فريقك اليوم. نعود إليك بتشخيص أوّلي وتقدير نطاق — دون التزام منك.", primary: { href: "/contact", label: "ابدأ محادثة", kind: "primary" }, site })
  ]);

  return {
    path: "/",
    html: page({ site, seo: { ...h.seo, path: "/", ogImage: "/assets/img/og/home.png" }, active: "home", body, schema: [orgSchema(site), siteSchema(site)], bodyClass: "page-home" })
  };
}
