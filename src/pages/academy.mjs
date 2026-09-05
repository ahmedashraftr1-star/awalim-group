import { esc, fill, join } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

export default function render(ctx) {
  const { site, stats, themes, pages, cases } = ctx;
  const a = pages.academy;
  const t = themes.academy;
  const platformCase = cases.find((c) => c.slug === "academy-platform");

  const body = join([
    `<section class="hero hero--product themed" style="${C.themeStyle(t)}" data-hero>
      <div class="wrap wrap--wide hero__in">
        <div class="hero__t">
          <div class="chero__eyebrow rv">${C.syscode(a.code, "live")}<span class="chero__kind">الأكاديمية</span></div>
          <h1 class="d-hero rv" style="--i:1">${a.h}</h1>
          <p class="lede rv" style="--i:2">${a.lede}</p>
          <div class="btn-row rv" style="--i:3">
            ${C.btn({ href: "/contact", label: "قدّم الآن", kind: "primary" })}
            ${C.btn({ href: "#tracks", label: "المسارات", kind: "ghost", arrow: true })}
          </div>
        </div>
        <div class="hero__media rv" style="--i:2" data-tilt>${C.device({ kind: "laptop", inner: C.mockScreen("academy"), alt: "منصّة أكاديمية عوالِم: مشروع المسار ومهامّه ومراجعة الكود", tilt: true, label: "academy.awalimgroup.com" })}</div>
      </div>
    </section>`,

    `<section class="sec sec--tight" aria-label="أرقام الأكاديمية">
      <div class="wrap wrap--wide">
        ${C.statBar(a.stats, stats, { size: "xl", cls: "statbar--hero", verify: true, signing: ctx.signing })}
        <p class="small muted rv statbar__note">${fill("«{engineersTrained}» هم كل من دخل مساراً في الأكاديمية؛ «{certifiedGraduates}» هم من أنهوا المسار كاملاً بمشروع منشور. الدول الست هي التي يعمل فيها خرّيجونا اليوم — أما «{clientCountries} دول» في الرئيسية فهي دول عملاء المجموعة.", stats)}</p>
      </div>
    </section>`,

    `<section class="sec" id="tracks">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "المسارات", eyebrowEn: "TRACKS", h: `${stats.tracks.value} مسارات هندسية`, lede: "كل مسار يُبنى حول مشروع واحد تُسلّمه في النهاية — لا حول قائمة مواضيع." })}
        <div class="tracks">
          ${a.tracks.map((tr, i) => `
            <article class="track rv" id="track-${i + 1}" data-stagger>
              <div class="track__hd">
                <span class="track__n mono">${esc(tr.n)}</span>
                <div><h3 class="d-2">${tr.t}</h3><p class="track__d">${tr.d}</p></div>
              </div>
              <div class="track__meta">
                <div class="track__fact"><span>المدّة</span><b>${esc(tr.duration)}</b></div>
                <div class="track__fact"><span>مشروع التخرّج</span><b>${esc(tr.project)}</b></div>
              </div>
              <div class="track__body">
                <div><h4 class="track__sub">المنهج</h4><ol class="track__syl">${tr.syllabus.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>
                <div><h4 class="track__sub">الأدوات</h4>${C.chips(tr.tags)}</div>
              </div>
            </article>`).join("")}
        </div>
      </div>
    </section>`,

    `<section class="sec sec--alt" id="philosophy">
      <div class="wrap wrap--wide">
        <div class="split split--top">
          <div class="rv" data-stagger>
            ${C.eyebrow("كيف تسير الدراسة", "METHOD")}
            <h2 class="d-1">${a.philosophy.h}</h2>
            <p class="lede">${a.philosophy.p}</p>
          </div>
          <div class="pillars rv" data-stagger>
            ${a.philosophy.pillars.map((p, i) => `<div class="pillar"><span class="pillar__n mono">0${i + 1}</span><h3>${p.t}</h3><p>${p.d}</p></div>`).join("")}
          </div>
        </div>
      </div>
    </section>`,

    `<section class="sec" id="why">
      <div class="wrap wrap--wide">
        <div class="split split--rev">
          <div class="rv" data-parallax data-parallax-amount="20">${C.device({ kind: "browser", inner: C.mockScreen("academy"), alt: "منصّة الأكاديمية", tilt: false, label: "academy.awalimgroup.com" })}</div>
          <div class="rv" data-stagger>
            ${C.eyebrow("لماذا نُدرّس أصلاً", "WHY")}
            <h2 class="d-1">${a.why.h}</h2>
            <p class="lede">${a.why.p1}</p>
            <p class="lede">${a.why.p2}</p>
            ${platformCase ? C.btnRow([C.btn({ href: `/work/${platformCase.slug}`, label: "دراسة حالة المنصّة", kind: "ghost", arrow: true })]) : ""}
          </div>
        </div>
      </div>
    </section>`,

    a.testimonials.length ? `<section class="sec sec--alt" id="graduates">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "شهادات الخرّيجين", eyebrowEn: "GRADUATES", h: "بكلماتهم" })}
        <div class="quotes rv" data-stagger>${a.testimonials.map((q) => `<blockquote class="quote"><p>${q.text}</p><footer>— ${esc(q.name)}، ${esc(q.track)} · ${esc(q.year)}</footer></blockquote>`).join("")}</div>
      </div>
    </section>` : "",

    C.ctaBand({ h: "تريد الانضمام إلى المسار القادم؟", lede: "أرسل لنا خلفيتك وما تريد أن تبنيه، ونرشدك إلى المسار المناسب — أو نقول لك بصراحة إن لم يكن أيٌّ منها مناسباً لك الآن.", primary: { href: "/contact", label: "قدّم الآن", kind: "primary" }, site })
  ]);

  return {
    path: "/academy",
    html: page({ site, seo: { ...a.seo, path: "/academy", ogImage: "/assets/img/og/academy.png" }, active: "academy", body, schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "الأكاديمية", path: "/academy" }])], bodyClass: "page-academy" })
  };
}
