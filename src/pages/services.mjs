import { esc, fill, join } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

export default function render(ctx) {
  const { site, stats, themes, pages } = ctx;
  const s = pages.services;

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow("الخدمات", "SERVICES", "rv")}
        <h1 class="d-hero rv" style="--i:1">${s.h}</h1>
        <p class="lede rv" style="--i:2">${s.lede}</p>
      </div>
    </section>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed">
          ${C.sideIndex([{ title: "المجالات", items: s.items.map((it) => ({ id: it.id, label: it.t })) }, { title: "", items: [{ id: "process", label: "كيف نعمل" }, { id: "standards", label: "المعايير" }, { id: "pricing", label: "كيف نُسعّر" }] }], "فهرس الخدمات")}
          <div class="indexed__col">
            ${s.items.map((it, i) => {
              const t = themes[it.theme];
              return `
              <article class="svc case__sec themed${t.ink ? " svc--ink" : ""}" id="${it.id}" style="${C.themeStyle(t)}">
                <div class="svc__card rv" data-stagger>
                  <div class="svc__hd">
                    <span class="svc__n mono">${esc(it.n)}</span>
                    <span class="svc__latin" lang="en">${esc(it.latin)}</span>
                  </div>
                  <h2 class="d-1">${it.t}</h2>
                  <p class="svc__h">${it.h}</p>
                  <p class="svc__d">${it.d}</p>
                  ${it.stats.length ? `<div class="svc__stats">${it.stats.map((k) => C.statTile(stats[k], { size: "md" })).join("")}</div>` : ""}
                </div>
                <div class="svc__grid rv" data-stagger>
                  <div class="svc__col"><h3 class="h3">ما تشمله</h3><ul class="bullets">${it.includes.map((x) => `<li>${x}</li>`).join("")}</ul></div>
                  <div class="svc__col"><h3 class="h3">المخرجات</h3><ul class="bullets bullets--check">${it.deliverables.map((x) => `<li>${x}</li>`).join("")}</ul></div>
                  <div class="svc__col svc__col--for"><h3 class="h3">لمن</h3><p>${it.for}</p>${C.btn({ href: "/contact", label: "ابدأ هنا", kind: "ghost", size: "sm", arrow: true })}</div>
                </div>
              </article>`;
            }).join("")}

            <div class="case__sec" id="process">
              ${C.sectionHead({ eyebrowAr: "كيف نعمل", eyebrowEn: "PROCESS", h: "أربع مراحل. لا مفاجآت." })}
            </div>
          </div>
        </div>
      </div>
      ${C.processPinned(site.process, { id: "process-stage" })}
    </section>`,

    `<section class="sec sec--alt" id="standards">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "المعايير", eyebrowEn: "ENGINEERING STANDARDS", h: "ما نلتزم به في كل تسليم" })}
        ${C.standardsGrid(site.standards)}
      </div>
    </section>`,

    `<section class="sec" id="pricing">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: s.pricing.eyebrow, eyebrowEn: "PRICING", h: s.pricing.h, lede: "لا نُسعّر قبل أن نفهم. التشخيص الأوّلي مجاني، ووثيقة النطاق تملكها أنت حتى لو لم نكمل معاً." })}
        <div class="pricing rv" data-stagger>
          ${s.pricing.models.map((m, i) => `<article class="price"><span class="chip chip--accent">${esc(m.tag)}</span><h3 class="d-2">${m.t}</h3><p>${m.d}</p></article>`).join("")}
        </div>
      </div>
    </section>`,

    C.ctaBand({ h: "لنبدأ بتشخيص، لا بعرض سعر", lede: "احكِ لنا عن العملية التي تستهلك وقت فريقك اليوم. نعود إليك بتشخيص أوّلي وتقدير نطاق — دون التزام منك.", primary: { href: "/contact", label: "ابدأ محادثة", kind: "primary" }, site })
  ]);

  return {
    path: "/services",
    html: page({ site, seo: { ...s.seo, path: "/services", ogImage: "/assets/img/og/services.png" }, active: "services", body, schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "الخدمات", path: "/services" }])], bodyClass: "page-services" })
  };
}
