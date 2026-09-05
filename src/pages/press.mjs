import { esc, join } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";
import { icon } from "../lib/icons.mjs";

/* /press — the approved boilerplate, the logo, the palette, the founder's
   bio, and the signed facts. Everything a journalist would otherwise ask
   for by email, copyable in one click. */
export default function render(ctx) {
  const { site, press, stats, signing } = ctx;

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow(ctx.t.press, "PRESS KIT", "rv")}
        <h1 class="d-hero rv" style="--i:1">${press.h}</h1>
        <p class="lede rv" style="--i:2">${press.lede}</p>
      </div>
    </section>`,

    `<section class="sec sec--alt" id="boilerplate">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: press.boilerplate.eyebrow, eyebrowEn: "BOILERPLATE", h: press.boilerplate.h })}
        <div class="boilers rv" data-stagger>
          ${press.boilerplate.items.map((b, i) => `
            <article class="boiler">
              <div class="boiler__hd"><span class="chip chip--accent">${esc(b.label)}</span><span class="small muted mono">${esc(b.chars)}</span></div>
              <p class="boiler__t" id="boiler-${i}">${b.text}</p>
              <button class="btn btn--ghost btn--sm" type="button" data-copy="#boiler-${i}"><span>${ctx.t.copy}</span>${C.arrow()}</button>
            </article>`).join("")}
        </div>
      </div>
    </section>`,

    `<section class="sec" id="assets">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: press.assets.eyebrow, eyebrowEn: "ASSETS", h: press.assets.h, lede: press.assets.note })}
        <div class="assets rv" data-stagger>
          ${press.assets.items.map((a) => `
            <figure class="asset">
              <div class="asset__box asset__box--${esc(a.kind)}"><img src="${a.src}" alt="${esc(a.t)}" loading="lazy" decoding="async" width="320" height="180"></div>
              <figcaption><b>${esc(a.t)}</b><span>${esc(a.d)}</span><a class="lnk" href="${a.src}" download><span>${ctx.t.download}</span>${C.arrow()}</a></figcaption>
            </figure>`).join("")}
        </div>
        <div class="swatches rv" data-stagger>
          ${press.assets.colors.map((c) => `<div class="swatch"><span class="swatch__chip" style="background:${esc(c.hex)}"></span><b>${esc(c.name)}</b><span class="mono" dir="ltr">${esc(c.hex)}</span></div>`).join("")}
        </div>
      </div>
    </section>`,

    `<section class="sec sec--alt" id="founder">
      <div class="wrap wrap--wide">
        <div class="founder rv" data-stagger>
          <div class="founder__img"><img src="${site.brand.founder.photo}" alt="${esc(press.founder.h)}، ${esc(press.founder.role)}" width="560" height="700" loading="lazy" decoding="async"></div>
          <div class="founder__b">
            ${C.eyebrow(press.founder.eyebrow)}
            <h2 class="d-1">${esc(press.founder.h)}</h2>
            <p class="lede">${esc(press.founder.role)}</p>
            <p id="founder-bio">${press.founder.bio}</p>
            <div class="btn-row">
              <button class="btn btn--ghost btn--sm" type="button" data-copy="#founder-bio"><span>${ctx.t.copy}</span>${C.arrow()}</button>
              ${C.btn({ href: site.brand.founder.photo, label: ctx.t.downloadPhoto, kind: "ghost", size: "sm", arrow: false, attrs: { download: "" } })}
            </div>
          </div>
        </div>
      </div>
    </section>`,

    `<section class="sec" id="facts">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: press.facts.eyebrow, eyebrowEn: "FACTS", h: press.facts.h, lede: press.facts.note })}
        ${C.statBar(press.facts.keys, stats, { size: "lg", cls: "statbar--verify", verify: true, signing, sixWide: true })}
      </div>
    </section>`,

    C.ctaBand({ eyebrowAr: press.contact.eyebrow, h: press.contact.h, lede: press.contact.d, primary: { href: `mailto:${site.contact.email}`, label: site.contact.email, kind: "primary" }, site })
  ]);

  return {
    path: "/press",
    html: page({
      site,
      seo: { ...press.seo, path: "/press", ogImage: "/assets/img/og/group.png" },
      active: "group",
      body,
      schema: [breadcrumbSchema(site, [{ name: ctx.t.home, path: "/" }, { name: ctx.t.press, path: "/press" }])],
      bodyClass: "page-press"
    })
  };
}
