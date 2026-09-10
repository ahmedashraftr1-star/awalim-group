import { esc, fill, join, seoTitle} from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

export function renderIndex(ctx) {
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

/* ---------- /services/[id] — one page per service ----------
   The competitor this was measured against carries seven dedicated service
   pages; this site carried four services stacked on one. That is a structural
   gap and worth closing — but only four pages get built, because four services
   are offered. Inventing three more to match a count would be the same lie as
   confirming a number nobody checked.

   Each page is assembled from that service's OWN data and nothing else:

   · the flow is drawn from its `deliverables`, so the diagram cannot drift from
     the list printed beside it — the same rule the case pages follow;
   · the numbers are the ones its `stats` array names, and those are the signed
     ones. A visitor can carry any of them to /verify and check the signature.
     That is the part a competitor cannot copy without building the signing
     chain first: they publish 100M+ with no source, and this publishes three
     numbers that a browser can verify;
   · the work shown is the real cases whose theme matches, not a carousel. If no
     case matches, the section is absent rather than filled. */
export function renderService(ctx, it, i) {
  const { site, stats, themes, pages, cases } = ctx;
  const s = pages.services;
  const t = themes[it.theme];
  const related = (cases || []).filter((c) => c.theme === it.theme || c.cat === it.id).slice(0, 3);
  const mine = (it.stats || []).filter((k) => stats[k]);

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow(it.t, it.latin.toUpperCase(), "rv")}
        <h1 class="d-hero rv" style="--i:1">${esc(it.h)}</h1>
        <p class="lede rv" style="--i:2">${esc(it.d)}</p>
        <p class="rv mono svc__for" style="--i:3">${esc(it.for)}</p>
      </div>
    </section>`,

    /* The path, drawn from the deliverables themselves. */
    it.deliverables && it.deliverables.length ? `<section class="sec sec--alt" id="flow">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "المسار", eyebrowEn: "THE PATH", h: "ما الذي يصلك، وبأيّ ترتيب", lede: "المخطّط مرسوم من قائمة التسليمات نفسها — لا يستطيع أن يختلف عنها." })}
        ${C.flow({ steps: it.deliverables.slice(0, 5).map((d, n) => ({ n: String(n + 1).padStart(2, "0"), t: String(d).split("—")[0].split(":")[0].trim().slice(0, 26), d: "" })), label: `مسار ${it.t}` })}
      </div>
    </section>` : "",

    `<section class="sec">
      <div class="wrap wrap--wide">
        <div class="indexed">
          ${C.sideIndex([{ title: it.t, items: [{ id: "includes", label: "ما يشمله" }, { id: "deliverables", label: "ما نُسلّمه" }].concat(mine.length ? [{ id: "numbers", label: "أرقام موقّعة" }] : []).concat(related.length ? [{ id: "proof", label: "أعمال" }] : []) }], `فهرس ${it.t}`)}
          <div class="indexed__col case">
            <div class="case__sec" id="includes">
              ${C.sectionHead({ eyebrowAr: "ما يشمله", eyebrowEn: "SCOPE", h: "المجالات التي نغطّيها" })}
              <ul class="ticks rv">${it.includes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            </div>
            <div class="case__sec" id="deliverables">
              ${C.sectionHead({ eyebrowAr: "ما نُسلّمه", eyebrowEn: "DELIVERABLES", h: "ما يبقى في يدك بعد انتهائنا" })}
              <ul class="ticks rv">${it.deliverables.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            </div>
            ${mine.length ? `<div class="case__sec" id="numbers">
              ${C.sectionHead({ eyebrowAr: "أرقام موقّعة", eyebrowEn: "SIGNED", h: "أرقام هذه الخدمة — موقّعة، لا مكتوبة", lede: "كل رقم هنا موقّع بمفتاح Ed25519 عند البناء، ومتصفّحك يعيد التحقّق منه في صفحة التحقّق." })}
              ${C.statBar(mine, stats, { size: "lg", verify: !!ctx.signing, signing: ctx.signing })}
              <p class="rv"><a class="lnk" href="/verify">كل الأرقام وطريقة التحقّق ←</a></p>
            </div>` : ""}
            ${related.length ? `<div class="case__sec" id="proof">
              ${C.sectionHead({ eyebrowAr: "أعمال", eyebrowEn: "PROOF", h: "أين طُبِّق هذا فعلاً" })}
              <div class="grid grid--3 rv">${related.map((c) => `<a class="mini" href="/work/${esc(c.slug)}"><span class="mini__t">${esc(c.title)}</span><span class="mini__d">${esc(c.summary || "")}</span></a>`).join("")}</div>
            </div>` : ""}
            <div class="case__sec">
              ${C.sectionHead({ eyebrowAr: "الخطوة التالية", eyebrowEn: "NEXT", h: "ابدأ بمكالمة قصيرة" })}
              <p class="rv"><a class="btn btn--pri" href="/contact">تواصل معنا</a> <a class="lnk" href="/services">كل الخدمات ←</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>`
  ]);

  return {
    path: `/services/${it.id}`,
    html: page({
      site,
      seo: { title: seoTitle(it.t, it.h, "عوالِم قروب"), description: it.d.slice(0, 155), path: `/services/${it.id}` },
      active: "services",
      body,
      schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "الخدمات", path: "/services" }, { name: it.t, path: `/services/${it.id}` }])],
      bodyClass: "page-case"
    })
  };
}
