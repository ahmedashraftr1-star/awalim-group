import { esc, join } from "../lib/html.mjs";
import { page } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

/* /offline — served by the service worker when the network is gone */
export default function render(ctx) {
  const { site } = ctx;
  const body = join([
    `<section class="phero phero--404">
      <div class="wrap wrap--wide">
        <p class="eyebrow rv"><span class="mono" lang="en">OFFLINE</span><span class="eyebrow__sep" aria-hidden="true">·</span><span>لا اتصال</span></p>
        <h1 class="d-hero rv" style="--i:1">الشبكة انقطعت. الموقع لم ينقطع.</h1>
        <p class="lede rv" style="--i:2">هذه الصفحة تعمل من ذاكرة متصفّحك. الصفحات التي زرتها من قبل متاحة أيضاً — وسنعود إلى الشبكة تلقائياً حين تعود.</p>
        <div class="btn-row rv" style="--i:3">
          ${C.btn({ href: "/", label: "الرئيسية", kind: "primary" })}
          ${C.btn({ href: "/journal", label: "رؤى", kind: "ghost", arrow: false })}
        </div>
        <p class="small muted rv" style="--i:4">هكذا نبني تطبيقات العملاء أيضاً: تخزين محلّي ومزامنة عند عودة الشبكة — لأنها تنقطع فعلاً.</p>
      </div>
    </section>`
  ]);
  return { path: "/offline", html: page({ site, seo: { title: "لا اتصال — عوالِم قروب", description: "هذه الصفحة تعمل دون اتصال.", path: "/offline" }, active: "", body, bodyClass: "page-offline" }) };
}
