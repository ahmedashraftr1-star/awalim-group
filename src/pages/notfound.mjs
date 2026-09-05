import { esc, join } from "../lib/html.mjs";
import { page } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

export default function render(ctx) {
  const { site, pages } = ctx;
  const n = pages.notFound;
  const body = join([
    `<section class="phero phero--404">
      <div class="wrap wrap--wide">
        <p class="eyebrow rv"><span class="mono" lang="en">404</span><span class="eyebrow__sep" aria-hidden="true">·</span><span>الصفحة غير موجودة</span></p>
        <h1 class="d-hero rv" style="--i:1">${n.h}</h1>
        <p class="lede rv" style="--i:2">${n.lede}</p>
        <div class="btn-row rv" style="--i:3">
          ${C.btn({ href: "/", label: "الرئيسية", kind: "primary" })}
          ${C.btn({ href: "/work", label: "الأعمال", kind: "ghost", arrow: false })}
          ${C.btn({ href: "/contact", label: "تواصل", kind: "ghost", arrow: false })}
        </div>
        <nav class="rv" style="--i:4" aria-label="كل الصفحات">
          <ul class="linklist">${site.nav.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join("")}<li><a href="/journal">رؤى</a></li></ul>
        </nav>
      </div>
    </section>`
  ]);
  return { path: "/404", html: page({ site, seo: { ...n.seo, path: "/404" }, active: "", body, bodyClass: "page-404" }) };
}
