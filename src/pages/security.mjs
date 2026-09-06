import { esc, join } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

/* /security — the sibling of /verify. /verify proves the numbers; this proves
   the posture. Both work the same way: the browser does the checking, not our
   server, and a failing check is reported as a failure rather than hidden. */
export default function render(ctx) {
  const { site, security, csp } = ctx;
  const s = security;

  /* the policy is printed from the one the build actually emitted, split at
     the semicolons so it stays readable at any width */
  const directives = (csp || "").split(";").map((d) => d.trim()).filter(Boolean);

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow(ctx.t.security, "SECURITY", "rv")}
        <h1 class="d-hero rv" style="--i:1">${s.h}</h1>
        <p class="lede rv" style="--i:2">${s.lede}</p>
      </div>
    </section>`,

    `<section class="sec sec--tight" id="live">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: s.live.eyebrow, eyebrowEn: "LIVE PROOF", h: s.live.h, lede: s.live.lede })}
        <div class="sec-live rv" data-sec>
          <ul class="secchecks" data-sec-list></ul>
          <div class="sec__foot">
            <p class="sec__out" data-sec-out>${esc(ctx.t.probesIdle)}</p>
            <button class="btn btn--ghost btn--sm" type="button" data-sec-run><span>${esc(s.live.cta)}</span>${C.arrow()}</button>
          </div>
        </div>
      </div>
    </section>`,

    `<section class="sec sec--alt" id="posture">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: s.posture.eyebrow, eyebrowEn: "POSTURE", h: s.posture.h, lede: s.posture.lede })}
        <div class="frows frows--2 rv" data-stagger>
          ${s.posture.items.map((x) => `<div class="frow"><div class="frow__b"><b>${x.t}</b><span>${x.d}</span></div></div>`).join("")}
        </div>
      </div>
    </section>`,

    `<section class="sec" id="policy">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: ctx.t.thePolicy, eyebrowEn: "THE POLICY", h: ctx.t.policyH, lede: ctx.t.policyLede })}
        <ol class="policy rv" dir="ltr" lang="en" data-stagger>
          ${directives.map((d) => {
            const [name, ...rest] = d.split(/\s+/);
            return `<li><b class="mono">${esc(name)}</b>${rest.length ? `<span class="mono">${esc(rest.join(" "))}</span>` : ""}</li>`;
          }).join("")}
        </ol>
      </div>
    </section>`,

    `<section class="sec sec--ink" id="honest">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: s.honest.eyebrow, eyebrowEn: "HONESTLY", h: s.honest.h })}
        <ul class="bullets rv" data-stagger>
          ${s.honest.items.map((x) => `<li>${x}</li>`).join("")}
        </ul>
      </div>
    </section>`,

    C.ctaBand({ eyebrowAr: s.contact.eyebrow, h: s.contact.h, lede: s.contact.d, primary: { href: `mailto:${site.contact.email}`, label: site.contact.email, kind: "primary" }, site })
  ]);

  return {
    path: "/security",
    html: page({
      site,
      seo: { ...s.seo, path: "/security", ogImage: "/assets/img/og/group.png" },
      active: "group",
      body,
      schema: [breadcrumbSchema(site, [{ name: ctx.t.home, path: "/" }, { name: ctx.t.security, path: "/security" }])],
      bodyClass: "page-security"
    })
  };
}
