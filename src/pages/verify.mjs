import { esc, join } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

/* /verify — the site's own transparency page: every public number is signed
   at build (Ed25519) and re-verified here, in the visitor's browser. */
export default function render(ctx) {
  const { site, stats, signing } = ctx;
  const seo = {
    title: "تحقّق من أرقامنا — توقيع Ed25519 يتحقّق منه متصفّحك | عوالِم قروب",
    description: "كل رقم عامّ على هذا الموقع موقّع تشفيريّاً عند البناء. صفحة التحقّق تُجري أربعة فحوص في متصفّحك — لا ثقة مطلوبة بخادمنا.",
    path: "/verify",
    ogImage: "/assets/img/og/group.png"
  };
  const keys = ["founded", "systemsDelivered", "engineersTrained", "certifiedGraduates", "clientCountries", "graduateCountries"];

  const body = join([
    `<section class="phero phero--verify">
      <div class="wrap wrap--wide">
        ${C.eyebrow("الشفافية", "VERIFY", "rv")}
        <h1 class="d-hero rv" style="--i:1">لا تثق بنا — تحقّق منّا.</h1>
        <p class="lede rv" style="--i:2">قيمتنا الأولى «الصدق قبل التسويق» تعني أننا لا ننشر رقماً لا نستطيع إثباته. فجعلنا الإثبات آلياً: كل رقم عامّ على الموقع موقّع بمفتاح <bdi lang="en">Ed25519</bdi> عند البناء، ومتصفّحك هو من يتحقّق من التوقيع — لا خادمنا.</p>
      </div>
    </section>`,

    `<section class="sec sec--tight" aria-label="الأرقام الموقّعة">
      <div class="wrap wrap--wide">
        ${C.statBar(keys, stats, { size: "lg", cls: "statbar--verify", verify: true, signing, autorun: true, sixWide: true })}
      </div>
    </section>`,

    `<section class="sec">
      <div class="wrap wrap--wide">
        <div class="split split--top">
          <div class="rv" data-stagger>
            ${C.eyebrow("كيف يعمل", "HOW IT WORKS")}
            <h2 class="d-1">أربعة فحوص، كلّها عندك</h2>
            <ol class="bullets" style="margin-block-start:var(--space-5)">
              <li><b>الهاش يطابق</b> — يحسب متصفّحك <bdi lang="en">SHA-256</bdi> للحمولة الموقّعة ويقارنه بالمنشور.</li>
              <li><b>التوقيع صحيح</b> — يتحقّق <bdi lang="en">WebCrypto</bdi> من توقيع <bdi lang="en">Ed25519</bdi> بالمفتاح العامّ.</li>
              <li><b>المفتاح منشور</b> — المفتاح العامّ نفسه مضمَّن في مصدر هذه الصفحة وفي مستودع الكود.</li>
              <li><b>ما تراه هو ما وُقِّع</b> — يقارن المتصفّح الأرقام المعروضة في الصفحة بالأرقام داخل الحمولة الموقّعة.</li>
            </ol>
            <p class="lede" style="margin-block-start:var(--space-5)">المفتاح الخاصّ لا يغادر جهاز البناء. إن تغيّر رقم دون إعادة توقيع، تُعرض الأرقام على أنها <b>غير موقّعة</b> — لا تُخفى.</p>
          </div>
          <div class="rv" data-stagger>
            <div class="card">
              <span class="chip chip--accent">المفتاح العامّ · <bdi lang="en">Ed25519</bdi></span>
              <pre class="code code--sm" dir="ltr" tabindex="0"><code>${esc(signing.publicKey)}</code></pre>
              <span class="chip">الحمولة الموقّعة · <bdi lang="en">${esc(signing.issued)}</bdi></span>
              <pre class="code code--sm" dir="ltr" tabindex="0"><code>${esc(JSON.stringify(JSON.parse(signing.payload), null, 2))}</code></pre>
              <span class="chip">التوقيع · <bdi lang="en">base64</bdi></span>
              <pre class="code code--sm" dir="ltr" tabindex="0"><code>${esc(signing.signature)}</code></pre>
              <span class="chip">تحقّق خارج المتصفّح</span>
              <pre class="code code--sm" dir="ltr" tabindex="0"><code>curl -s ${esc(site.brand.url)}/verify/stats.json > s.json
node -e 'const s=require("./s.json"),c=require("crypto");
const der=Buffer.concat([Buffer.from("302a300506032b6570032100","hex"),Buffer.from(s.publicKey,"base64")]);
const k=c.createPublicKey({key:der,format:"der",type:"spki"});
console.log(c.verify(null,Buffer.from(s.payload),k,Buffer.from(s.signature,"base64"))?"VALID":"INVALID")'</code></pre>
              <p class="small muted">الملفّ العامّ: <a class="lnk" href="/verify/stats.json" dir="ltr">/verify/stats.json</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>`,

    C.ctaBand({ h: "تريد أرقاماً قابلة للتحقّق في نظامك أنت؟", lede: "هذا ما بنيناه لآيلاند هيفن — وما نبنيه لكل عميل يريد أن يقول لجمهوره: تحقّقوا بأنفسكم.", primary: { href: "/work/island-haven", label: "دراسة حالة آيلاند هيفن", kind: "primary" }, site })
  ]);

  return {
    path: "/verify",
    html: page({ site, seo, active: "group", body, schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "تحقّق", path: "/verify" }])], bodyClass: "page-verify" })
  };
}
