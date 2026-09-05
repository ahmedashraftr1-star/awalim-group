import { esc, fill, join } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

export default function render(ctx) {
  const { site, stats, themes, pages } = ctx;
  const g = pages.group;

  const body = join([
    `<section class="phero phero--group">
      <div class="wrap wrap--wide">
        ${C.eyebrow("المجموعة", "THE GROUP", "rv")}
        <h1 class="d-hero rv" style="--i:1">${g.h}</h1>
        <p class="lede rv" style="--i:2">${g.lede}</p>
        <p class="origin rv mono" style="--i:3" lang="en">${esc(site.brand.origin)}</p>
      </div>
    </section>`,

    `<section class="sec sec--tight" aria-label="أرقام الأثر">
      <div class="wrap wrap--wide">${C.statBar(g.impact, stats, { size: "xl", cls: "statbar--hero", verify: true, signing: ctx.signing })}</div>
    </section>`,

    `<section class="sec" id="timeline">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "القصّة الكاملة", eyebrowEn: "TIMELINE", h: "من غرفة في غزّة إلى أنظمة تعمل في عشر دول", lede: "ثماني محطّات — كل واحدة منها قرار." })}
        ${C.timeline(g.timeline)}
      </div>
    </section>`,

    `<section class="sec sec--alt" id="values">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "القيم", eyebrowEn: "VALUES", h: "أربعة مبادئ نرفض التنازل عنها" })}
        <div class="values rv" data-stagger>
          ${g.values.map((v) => `<article class="value"><span class="value__n mono">${esc(v.n)}</span><h3 class="d-2">${v.t}</h3><p>${v.d}</p></article>`).join("")}
        </div>
        <div class="values__std">
          <p class="eyebrow"><span>وثمانية شروط هندسية لا نسلّم بدونها</span></p>
          ${C.standardsGrid(site.standards)}
        </div>
      </div>
    </section>`,

    `<section class="sec" id="founder">
      <div class="wrap wrap--wide">
        ${C.founder({ site, quote: g.founder.full, lede: g.founder.lede, h: "المؤسّس", cta: false, big: true })}
      </div>
    </section>`,

    `<section class="sec sec--alt" id="stack">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "المنظومة التقنية", eyebrowEn: "STACK", h: "أدوات نعرفها عن ظهر قلب" })}
        ${C.wall(site.stack)}
      </div>
    </section>`,

    `<section class="sec sec--born" aria-label="Born in Palestine">
      <div class="wrap wrap--wide born rv">
        <span class="born__flag" aria-hidden="true">🇵🇸</span>
        <p class="born__h d-1" lang="en">Born in Palestine</p>
        <p class="lede">فلسطيني الجذر، عالمي المعيار. كل نظام نسلّمه يحمل هذا السطر في تذييله — ونقصده.</p>
      </div>
    </section>`,

    C.ctaBand({ h: "تريد أن تعرفنا أكثر؟", lede: "أسرع طريقة هي مكالمة قصيرة. احكِ لنا عن مشروعك ونحكي لك كيف سنبنيه.", primary: { href: "/contact", label: "ابدأ محادثة", kind: "primary" }, site })
  ]);

  return {
    path: "/group",
    html: page({ site, seo: { ...g.seo, path: "/group", ogImage: "/assets/img/og/group.png" }, active: "group", body, schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "المجموعة", path: "/group" }])], bodyClass: "page-group" })
  };
}
