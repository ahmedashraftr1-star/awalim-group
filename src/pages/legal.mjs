import { esc, join, slug as slugify } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

/* /privacy and /terms — one reading template, a sticky table of contents,
   and the last-updated date carried from the content so it cannot drift. */
export default function render(ctx, doc) {
  const { site, legal } = ctx;
  const blocks = doc.sections.map((s) => ({ ...s, id: "s-" + slugify(s.h).slice(0, 40) }));

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow(ctx.t.legal, "LEGAL", "rv")}
        <h1 class="d-hero rv" style="--i:1">${doc.h}</h1>
        <p class="lede rv" style="--i:2">${doc.lede}</p>
        <p class="small muted rv" style="--i:3">${ctx.t.lastUpdated} <time datetime="${esc(legal.updated)}" class="mono">${esc(legal.updated)}</time></p>
      </div>
    </section>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="indexed indexed--article">
          <nav class="sideidx" data-spy aria-label="${esc(ctx.t.toc)}">
            <span class="sideidx__bar" aria-hidden="true"></span>
            <div class="sideidx__g"><p class="sideidx__h">${ctx.t.onThisPage}</p><ol class="sideidx__list">${blocks.map((b) => `<li><a href="#${b.id}">${b.h}</a></li>`).join("")}</ol></div>
          </nav>
          <article class="prose indexed__col rv">
            ${blocks.map((b) => join([
              `<h2 id="${b.id}">${b.h}</h2>`,
              b.p ? `<p>${b.p}</p>` : "",
              b.ul ? `<ul>${b.ul.map((x) => `<li>${x}</li>`).join("")}</ul>` : "",
              b.note ? `<aside class="note">${b.note}</aside>` : ""
            ])).join("\n")}
            <footer class="prose__ftr">
              <p class="small muted">${ctx.t.legalFooter}</p>
              ${C.btnRow([C.btn({ href: `mailto:${site.contact.email}`, label: site.contact.email, kind: "ghost", size: "sm", arrow: false })])}
            </footer>
          </article>
        </div>
      </div>
    </section>`
  ]);

  return {
    path: `/${doc.slug}`,
    html: page({
      site,
      seo: { ...doc.seo, path: `/${doc.slug}`, ogImage: "/assets/img/og/group.png" },
      active: "",
      body,
      schema: [breadcrumbSchema(site, [{ name: ctx.t.home, path: "/" }, { name: doc.h, path: `/${doc.slug}` }])],
      bodyClass: "page-legal"
    })
  };
}
