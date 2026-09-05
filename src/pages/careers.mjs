import { esc, join } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";
import { icon } from "../lib/icons.mjs";

/* /careers — open roles, how we hire, and a JobPosting record per role.
   With no open role the page still stands: it says so and takes an open
   application, rather than 404-ing or showing an empty grid. */
export default function render(ctx) {
  const { site, careers, themes, locale } = ctx;
  const open = careers.roles.filter((r) => r.open !== false);
  const t = themes.lab;

  const roleCard = (r, i) => `
    <article class="role rv" id="role-${r.slug}" data-stagger>
      <div class="role__hd">
        <span class="role__n mono">0${i + 1}</span>
        <div>
          <h3 class="d-2">${esc(r.title)}</h3>
          <div class="chips role__meta">
            <span class="chip">${esc(r.team)}</span><span class="chip">${esc(r.type)}</span>
            <span class="chip">${esc(r.location)}</span><span class="chip">${esc(r.level)}</span>
          </div>
        </div>
      </div>
      <p class="role__sum lede">${r.summary}</p>
      <div class="role__body">
        <div><h4 class="role__sub">${ctx.t.does}</h4><ul class="bullets">${r.does.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        <div><h4 class="role__sub">${ctx.t.needs}</h4><ul class="bullets bullets--check">${r.needs.map((x) => `<li>${x}</li>`).join("")}</ul></div>
        ${r.bonus && r.bonus.length ? `<div><h4 class="role__sub">${ctx.t.bonus}</h4>${C.chips(r.bonus)}</div>` : ""}
      </div>
      <div class="btn-row">
        ${C.btn({ href: "/contact", label: ctx.t.apply, kind: "primary" })}
        ${C.waLink(site, ctx.t.askFirst)}
      </div>
    </article>`;

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow(ctx.t.careersEyebrow, "CAREERS", "rv")}
        <h1 class="d-hero rv" style="--i:1">${careers.h}</h1>
        <p class="lede rv" style="--i:2">${careers.lede}</p>
        <div class="btn-row rv" style="--i:3">
          ${C.btn({ href: open.length ? "#roles" : "/contact", label: open.length ? `${ctx.t.openRoles} (${open.length})` : ctx.t.openApplication, kind: "primary" })}
          ${C.btn({ href: "#how", label: ctx.t.howWeHire, kind: "ghost", arrow: true })}
        </div>
      </div>
    </section>`,

    `<section class="sec sec--alt" id="why">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: careers.why.eyebrow, eyebrowEn: "WHY HERE", h: careers.why.h })}
        <div class="frows frows--2 rv" data-stagger>
          ${careers.why.items.map((x, i) => `<div class="frow"><span class="frow__ic" aria-hidden="true">${icon(["users", "globe", "spark", "compass"][i] || "spark")}</span><div class="frow__b"><b>${x.t}</b><span>${x.d}</span></div></div>`).join("")}
        </div>
      </div>
    </section>`,

    `<section class="sec" id="roles">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: ctx.t.openRoles, eyebrowEn: "OPEN ROLES", h: open.length ? `${open.length} ${ctx.t.rolesOpenNow}` : ctx.t.noRolesTitle, lede: open.length ? "" : ctx.t.noRolesLede })}
        ${open.length ? `<div class="roles">${open.map(roleCard).join("")}</div>` : ""}
        <div class="spont themed rv" style="${C.themeStyle(t)}">
          <div>
            <h3 class="d-2">${careers.spontaneous.h}</h3>
            <p>${careers.spontaneous.d}</p>
          </div>
          ${C.btn({ href: "/contact", label: careers.spontaneous.cta, kind: "primary" })}
        </div>
        <p class="small muted rv careers__equal">${careers.equal}</p>
      </div>
    </section>`,

    `<section class="sec sec--ink" id="how">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: careers.process.eyebrow, eyebrowEn: "HIRING PROCESS", h: careers.process.h })}
        <div class="caps rv" data-stagger>
          ${careers.process.steps.map((s) => `<article class="cap"><span class="cap__n mono">${esc(s.n)}</span><h3>${s.t}</h3><p>${s.d}</p></article>`).join("")}
        </div>
      </div>
    </section>`,

    C.ctaBand({ h: ctx.t.careersCtaH, lede: ctx.t.careersCtaLede, primary: { href: "/contact", label: ctx.t.apply, kind: "primary" }, site })
  ]);

  /* one JobPosting per open role — the record search engines and job boards read */
  const jobs = open.map((r) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: r.title,
    description: [r.summary, ...r.does, ...r.needs].join(" "),
    employmentType: /جزئي|part/i.test(r.type) ? "PART_TIME" : "FULL_TIME",
    datePosted: careers.posted || "2026-09-05",
    hiringOrganization: { "@type": "Organization", name: site.brand.latin, sameAs: site.brand.url, logo: `${site.brand.url}${site.brand.logo}` },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: { "@type": "Country", name: "Worldwide" },
    directApply: true,
    url: `${site.brand.url}${locale === "en" ? "/en" : ""}/careers#role-${r.slug}`
  }));

  return {
    path: "/careers",
    html: page({
      site,
      seo: { ...careers.seo, path: "/careers", ogImage: "/assets/img/og/group.png" },
      active: "group",
      body,
      schema: [...jobs, breadcrumbSchema(site, [{ name: ctx.t.home, path: "/" }, { name: ctx.t.careersEyebrow, path: "/careers" }])],
      bodyClass: "page-careers"
    })
  };
}
