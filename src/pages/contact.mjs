import { esc, join } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";
import { icon } from "../lib/icons.mjs";

export default function render(ctx) {
  const { site, pages } = ctx;
  const c = pages.contact;

  const step = (i, inner) => `
    <fieldset class="msf__step" data-step="${i}" ${i ? "hidden" : ""}>
      <legend class="msf__legend"><span class="msf__stepn mono" dir="ltr">0${i + 1} / 0${c.steps.length}</span><span class="d-2">${c.steps[i].q}</span></legend>
      ${inner}
    </fieldset>`;

  const form = `
  <form class="msf card rv" id="brief-form" data-msf novalidate aria-describedby="msf-privacy">
    <div class="msf__progress" aria-hidden="true">
      <span class="msf__bar"><span data-msf-bar></span></span>
      <ol class="msf__labels">${c.steps.map((s, i) => `<li data-msf-label="${i}"${i === 0 ? ' class="is-on"' : ""}>${esc(s.t)}</li>`).join("")}</ol>
    </div>
    <p class="sr-only" aria-live="polite" data-msf-live></p>

    ${step(0, `
      <div class="opts" role="radiogroup" aria-required="true">
        ${c.types.map((t, i) => `
          <label class="opt">
            <input type="radio" name="scope" value="${esc(t.v)}" ${i === 0 ? "" : ""} required>
            <span class="opt__ic" aria-hidden="true">${icon(t.icon)}</span>
            <span class="opt__b"><b>${esc(t.t)}</b><span>${esc(t.d)}</span></span>
            <span class="opt__check" aria-hidden="true">${icon("check")}</span>
          </label>`).join("")}
      </div>
      <p class="field__err" data-err-for="scope" hidden>اختر نوع المشروع للمتابعة.</p>`)}

    ${step(1, `
      <div class="field">
        <span class="field__label" id="lbl-budget">الميزانية التقديرية</span>
        <div class="opts opts--row" role="radiogroup" aria-labelledby="lbl-budget">
          ${c.budgets.map((b, i) => `<label class="opt opt--pill"><input type="radio" name="budget" value="${esc(b)}" ${i === 0 ? "checked" : ""}><span>${esc(b)}</span></label>`).join("")}
        </div>
      </div>
      <div class="field">
        <span class="field__label" id="lbl-timeline">متى تريد البدء؟</span>
        <div class="opts opts--row" role="radiogroup" aria-labelledby="lbl-timeline">
          ${c.timelines.map((b, i) => `<label class="opt opt--pill"><input type="radio" name="timeline" value="${esc(b)}" ${i === 0 ? "checked" : ""}><span>${esc(b)}</span></label>`).join("")}
        </div>
      </div>`)}

    ${step(2, `
      <div class="field">
        <label for="f-msg">اشرح العملية التي تريد حلّها <span class="req" aria-hidden="true">*</span></label>
        <textarea id="f-msg" name="message" required minlength="20" rows="6" placeholder="ما الذي يستهلك وقت فريقك اليوم؟ وكيف تُنجَز العملية حالياً؟"></textarea>
        <small>كلّما وصفت الوضع الحالي بدقّة، كان تشخيصنا أدقّ. (20 حرفاً على الأقل)</small>
        <p class="field__err" data-err-for="message" hidden>اكتب وصفاً من 20 حرفاً على الأقل.</p>
      </div>
      <div class="field">
        <label for="f-company">الشركة أو الجهة <span class="muted small">(اختياري)</span></label>
        <input id="f-company" name="company" type="text" autocomplete="organization" placeholder="اسم الشركة">
      </div>`)}

    ${step(3, `
      <div class="field">
        <label for="f-name">الاسم <span class="req" aria-hidden="true">*</span></label>
        <input id="f-name" name="name" type="text" required autocomplete="name" placeholder="اسمك الكامل" minlength="2">
        <p class="field__err" data-err-for="name" hidden>اكتب اسمك.</p>
      </div>
      <div class="field">
        <label for="f-email">البريد الإلكتروني <span class="req" aria-hidden="true">*</span></label>
        <input id="f-email" name="email" type="email" required autocomplete="email" placeholder="name@company.com" dir="ltr" inputmode="email">
        <p class="field__err" data-err-for="email" hidden>اكتب بريداً إلكترونياً صحيحاً.</p>
      </div>
      <div class="field">
        <label for="f-phone">رقم واتساب <span class="muted small">(اختياري)</span></label>
        <input id="f-phone" name="phone" type="tel" autocomplete="tel" placeholder="+970 5x xxx xxxx" dir="ltr" inputmode="tel">
      </div>
      <div class="msf__review" data-msf-review hidden>
        <p class="eyebrow"><span>راجع قبل الإرسال</span></p>
        <dl class="msf__summary" data-msf-summary></dl>
      </div>`)}

    <div class="msf__nav">
      <button class="btn btn--ghost" type="button" data-msf-prev hidden><span>رجوع</span></button>
      <button class="btn btn--primary" type="button" data-msf-next><span>التالي</span>${C.arrow()}</button>
      <button class="btn btn--accent" type="submit" data-msf-submit hidden><span>${icon("whatsapp")} أرسل عبر واتساب</span></button>
      <a class="btn btn--ghost btn--sm" data-msf-mail hidden href="#"><span>${icon("mail")} أو عبر البريد</span></a>
    </div>
    <p class="small muted" id="msf-privacy">الزر يفتح محادثة واتساب (أو بريداً) مُعبّأة بتفاصيل طلبك على جهازك — لا يُرسَل شيء إلى أي خادم من هذا الموقع، ولا يُخزَّن.</p>
    <p class="small" role="status" data-msf-status hidden></p>
  </form>`;

  const body = join([
    `<section class="phero">
      <div class="wrap wrap--wide">
        ${C.eyebrow("تواصل", "START A PROJECT", "rv")}
        <h1 class="d-hero rv" style="--i:1">${c.h}</h1>
        <p class="lede rv" style="--i:2">${c.lede}</p>
      </div>
    </section>`,

    `<section class="sec sec--tight">
      <div class="wrap wrap--wide">
        <div class="split split--top split--form">
          ${form}
          <aside class="contact__side rv" data-stagger>
            <a class="card card--hover contact__wa" href="https://wa.me/${site.contact.whatsapp}" target="_blank" rel="noopener">
              <span class="chip chip--accent">الأسرع</span>
              <h2 class="d-2">${icon("whatsapp")} واتساب</h2>
              <p class="mono contact__num" dir="ltr" lang="en">${esc(site.contact.whatsappDisplay)}</p>
              <p class="muted small">للاستشارات السريعة والتنسيق العاجل.</p>
            </a>
            <a class="card card--hover" href="mailto:${site.contact.email}">
              <span class="chip">بريد</span>
              <h2 class="h3">${icon("mail")} ${esc(site.contact.email)}</h2>
              <p class="muted small">للطلبات الرسمية والمرفقات.</p>
            </a>
            <div class="card">
              <span class="chip">التوفّر</span>
              <h2 class="h3">مقاعد الربع القادم</h2>
              <p class="muted small">نقبل عدداً محدوداً من المشاريع في وقت واحد حتى يبقى الفريق قادراً على العمق. إن كانت المقاعد ممتلئة نخبرك بذلك صراحةً وبتاريخ متوقّع.</p>
              <p><span class="chip chip--accent chip--pulse"><span class="dot" aria-hidden="true"></span>${esc(site.contact.availability)}</span></p>
            </div>
            <div class="card">
              <span class="chip">ماذا يحدث بعد الإرسال</span>
              <ol class="after">${c.after.map((x) => `<li>${x}</li>`).join("")}</ol>
            </div>
          </aside>
        </div>
      </div>
    </section>`,

    `<section class="sec sec--alt" id="faq">
      <div class="wrap wrap--wide">
        <div class="split split--top">
          <div class="rv" data-stagger>${C.eyebrow("أسئلة قبل الإرسال", "FAQ")}<h2 class="d-1">ثلاثة أسئلة تتكرّر</h2></div>
          ${C.accordion(c.faq, { name: "contact-faq" })}
        </div>
      </div>
    </section>`
  ]);

  return {
    path: "/contact",
    html: page({ site, seo: { ...c.seo, path: "/contact", ogImage: "/assets/img/og/contact.png" }, active: "contact", body, schema: [breadcrumbSchema(site, [{ name: "الرئيسية", path: "/" }, { name: "تواصل", path: "/contact" }])], bodyClass: "page-contact" })
  };
}
