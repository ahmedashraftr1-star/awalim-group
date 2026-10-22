import { esc, fill, join } from "../lib/html.mjs";
import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

export default function render(ctx) {
  const { site, stats, themes, pages, cases } = ctx;
  const a = pages.academy;
  const tTheme = themes.academy;
  const platformCase = cases.find((c) => c.slug === "academy-platform");

  const isEn = ctx.locale === "en";
  const t = (ar, en) => (isEn ? en : ar);

  // Four curriculum stages per track — order of study only, no week ranges
  // (track lengths differ: see pages.json academy.tracks[].duration).
  const sprintRoadmaps = [
    // 01 Systems — capstone: multi-tenant billing system
    [
      { num: "01", title: t("نمذجة البيانات", "Data modelling"), desc: t("تصمّم جداول المشروع وتطبّعها، وتحدّد ما يخصّ كل مستأجر وما هو مشترك بينهم.", "Design and normalise the project's tables, and decide what belongs to each tenant and what is shared.") },
      { num: "02", title: t("الهجرات والمعاملات", "Migrations & transactions"), desc: t("تكتب الهجرات والفهارس، وتتعلّم متى تحتاج معاملة وأيّ مستوى عزل يناسبها.", "Write migrations and indexes, and learn when a transaction is needed and which isolation level fits it.") },
      { num: "03", title: t("الأداء والأمان", "Performance & security"), desc: t("تقيس الاستعلامات البطيئة بأدوات PostgreSQL نفسها وتحسّنها، وتضيف الأمان على مستوى الصفوف.", "Measure slow queries with PostgreSQL's own tools, improve them, and add row-level security.") },
      { num: "04", title: t("المراجعة النهائية والتسليم", "Final review & hand-in"), desc: t("مراجعة كود نهائية على مشروعك، ثم نشره وتسليمه.", "A final code review of your project, then you deploy it and hand it in.") }
    ],
    // 02 AI — capstone: document-extraction agent with a human in the loop
    [
      { num: "01", title: t("تعريف المهمّة وحدود الصلاحية", "Task definition & permissions"), desc: t("تحدّد بدقّة ما يفعله الوكيل وما لا يُسمح له به، وتجهّز المستندات التي سيعمل عليها.", "Define exactly what the agent does and what it may not do, and prepare the documents it will work on.") },
      { num: "02", title: t("الأدوات والذاكرة", "Tools & memory"), desc: t("تربط الوكيل بالأدوات التي يحتاجها، وتقرّر ما يتذكّره بين الخطوات وماذا يفعل حين تفشل خطوة.", "Connect the agent to the tools it needs, decide what it remembers between steps, and what it does when a step fails.") },
      { num: "03", title: t("الإنسان في الحلقة والتقييم", "Human review & evaluation"), desc: t("تضيف مراجعة بشرية للقرارات الحسّاسة، وتقيس دقّة الاستخراج على مستندات حقيقية قبل الاعتماد عليه.", "Add a human review step for sensitive decisions, and measure extraction accuracy on real documents before relying on it.") },
      { num: "04", title: t("الأمان والنشر", "Security & deployment"), desc: t("تختبر الوكيل ضد حقن الأوامر (Prompt Injection)، وتسجّل ما يفعله، ثم تنشره.", "Test the agent against prompt injection, log what it does, then deploy it.") }
    ],
    // 03 Flutter — capstone: offline-capable app on both stores
    [
      { num: "01", title: t("من التصميم إلى المكوّنات", "From design to widgets"), desc: t("تحوّل تصميم Figma إلى مكوّنات، وتختار طريقة لإدارة الحالة تبقى واضحة مع نموّ التطبيق.", "Turn the Figma design into widgets, and choose a state-management approach that stays clear as the app grows.") },
      { num: "02", title: t("العمل دون اتصال", "Working offline"), desc: t("يحفظ التطبيق بياناته محلياً ويعمل دون إنترنت، ثم يزامنها حين يعود الاتصال ويعالج التعارض.", "The app stores its data locally and works without a connection, then syncs when it returns and resolves conflicts.") },
      { num: "03", title: t("العربية والأداء", "Arabic & performance"), desc: t("دعم كامل للعربية واتجاه الكتابة، وقياس الأداء على أجهزة حقيقية وإصلاح ما يبطئه.", "Full Arabic and right-to-left support, and performance measured on real devices with the slow parts fixed.") },
      { num: "04", title: t("النشر على المتجرين", "Publishing to both stores"), desc: t("توقيع التطبيق، وتجهيز ما تطلبه مراجعة المتاجر، ثم النشر على App Store وGoogle Play.", "Sign the app, prepare what store review asks for, then publish to the App Store and Google Play.") }
    ],
    // 04 Design — capstone: Arabic design system exported to code
    [
      { num: "01", title: t("الطباعة العربية", "Arabic typography"), desc: t("اختيار الخطوط وأحجامها وتباعد الأسطر بما يناسب القارئ العربي.", "Choosing Arabic typefaces, sizes and line spacing that suit Arabic readers.") },
      { num: "02", title: t("رموز التصميم", "Design tokens"), desc: t("تحويل الألوان والمسافات والخطوط إلى رموز تصميم (Design Tokens) تُصدَّر إلى CSS.", "Turn colours, spacing and type into design tokens that export to CSS.") },
      { num: "03", title: t("المكوّنات والوصولية", "Components & accessibility"), desc: t("بناء مكوّنات تعمل في الاتجاهين (RTL/LTR) وتستوفي متطلبات التباين والوصولية WCAG.", "Build components that work in both directions (RTL/LTR) and meet WCAG contrast and accessibility requirements.") },
      { num: "04", title: t("التصدير إلى الكود والتوثيق", "Export to code & documentation"), desc: t("تصدير النظام إلى الكود مع دليل استخدام للمطوّرين.", "Export the system to code with a usage guide for developers.") }
    ]
  ];

  const body = join([
    `<section class="hero hero--product themed" style="${C.themeStyle(tTheme)}" data-hero>
      <div class="wrap wrap--wide hero__in">
        <div class="hero__t">
          <div class="chero__eyebrow rv">${C.syscode(a.code, "live")}<span class="chero__kind">${t("الأكاديمية", "Academy")}</span></div>
          <h1 class="d-hero rv" style="--i:1">${a.h}</h1>
          <p class="lede rv" style="--i:2">${a.lede}</p>
          <div class="btn-row rv" style="--i:3">
            <button type="button" class="btn btn--primary btn-open-academy-apply" data-track-name="${esc(a.tracks[0].t)}">
              <span>${t("قدّم للمسار القادم", "Apply for Next Cohort")}</span>
            </button>
            ${C.btn({ href: "#tracks", label: t("استكشف المسارات", "Explore Tracks"), kind: "ghost", arrow: true })}
          </div>
        </div>
        <div class="hero__media rv" style="--i:2" data-tilt>${C.device({ kind: "laptop", inner: C.mockScreen("academy"), alt: t("منصّة أكاديمية عوالِم: مشروع المسار ومهامّه ومراجعة الكود", "Awalim Academy platform: track project, tasks and code review"), tilt: true, label: "academy.awalimgroup.com" })}</div>
      </div>
    </section>`,

    `<section class="sec sec--tight" aria-label="${t("أرقام الأكاديمية", "Academy figures")}">
      <div class="wrap wrap--wide">
        ${C.statBar(a.stats, stats, { size: "xl", cls: "statbar--hero", verify: true, signing: ctx.signing })}
        <p class="small muted rv statbar__note">${fill(t("«{engineersTrained}» هم كل من دخل مساراً في الأكاديمية؛ «{certifiedGraduates}» هم من أنهوا المسار كاملاً بمشروع منشور. و«{graduateCountries} دول» هي التي يعمل فيها خرّيجونا اليوم — أما «{clientCountries} دولة» في الرئيسية فهي دول عملاء المجموعة.", "'{engineersTrained}' is everyone who has started an Academy track; '{certifiedGraduates}' is those who finished a whole track with a deployed project. '{graduateCountries} countries' is where our graduates work today — the {clientCountries} countries on the home page are where the Group's clients are."), stats)}</p>
      </div>
    </section>`,

    `<section class="sec" id="tracks">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "المسارات", eyebrowEn: "TRACKS", h: `${stats.tracks.value} ${t("مسارات هندسية مكثفة", "Rigorous Engineering Tracks")}`, lede: t("كل مسار يُبنى حول مشروع إنتاجي واحد تُسلّمه وتدافع عن كوده في النهاية — لا حول مجرد محاضرات نظرية.", "Each track is built around one real project that you deliver and defend the code of at the end — not around lectures alone.") })}
        <div class="tracks">
          ${a.tracks.map((tr, i) => `
            <article class="track rv" id="track-${i + 1}" data-stagger>
              <div class="track__hd">
                <span class="track__n mono">${esc(tr.n)}</span>
                <div><h3 class="d-2">${tr.t}</h3><p class="track__d">${tr.d}</p></div>
              </div>
              <div class="track__meta">
                <div class="track__fact"><span>${t("المدّة", "Duration")}</span><b>${esc(tr.duration)}</b></div>
                <div class="track__fact"><span>${t("مشروع التخرّج", "Capstone Project")}</span><b>${esc(tr.project)}</b></div>
              </div>
              <div class="track__body">
                <div><h4 class="track__sub">${t("المنهج الأساسي", "Core Curriculum")}</h4><ol class="track__syl">${tr.syllabus.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></div>
                <div><h4 class="track__sub">${t("الأدوات والتقنيات", "Tech Stack")}</h4>${C.chips(tr.tags)}</div>
              </div>

              <!-- Interactive Track Actions -->
              <div class="track__actions" style="display:flex; flex-wrap:wrap; gap:0.6rem; align-items:center; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.08);">
                <button type="button" class="btn btn--primary btn--sm btn-open-academy-apply" data-track-name="${esc(tr.t)}" style="padding:8px 18px; border-radius:8px; height:auto; width:auto; font-size:0.85rem; display:inline-flex;">
                  <span>${t("التقديم لهذا المسار", "Apply for Track")}</span>
                </button>
                <button type="button" class="btn btn--outline btn--sm btn-toggle-sprint-plan" data-sprint-target="track-sprints-${i + 1}" style="padding:8px 18px; border-radius:8px; height:auto; width:auto; font-size:0.85rem; display:inline-flex;">
                  <span>${t("مراحل المسار الأربع", "The four stages")}</span>
                </button>
              </div>

              <!-- Collapsible 4-Sprint Roadmap -->
              <div id="track-sprints-${i + 1}" class="track-sprints-drawer" style="display:none; padding:1.25rem; border-radius:var(--radius-md, 10px); background:var(--surface-2); border:1px solid var(--border-2);">
                <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.85rem; color:var(--gold);">
                  ${t("مراحل المسار الأربع، بترتيب دراستها", "The track's four stages, in the order you study them")}
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem;">
                  ${(sprintRoadmaps[i] || []).map(sp => `
                    <div style="padding:0.75rem; border-radius:8px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                        <span class="mono" style="font-size:0.75rem; color:var(--gold); font-weight:700;">${t("المرحلة", "Stage")} ${sp.num}</span>
                                              </div>
                      <div style="font-weight:700; font-size:0.85rem; margin-bottom:0.25rem;">${sp.title}</div>
                      <div style="font-size:0.78rem; color:var(--muted); line-height:1.4;">${sp.desc}</div>
                    </div>
                  `).join("")}
                </div>
              </div>
            </article>`).join("")}
        </div>
      </div>
    </section>`,

    `<section class="sec" id="philosophy">
      <div class="wrap wrap--wide">
        <div class="split split--top">
          <div class="rv" data-stagger>
            ${C.eyebrow(t("كيف تسير الدراسة", "How Study Proceeds"), "METHOD")}
            <h2 class="d-1">${a.philosophy.h}</h2>
            <p class="lede">${a.philosophy.p}</p>
          </div>
          <div class="pillars rv" data-stagger>
            ${a.philosophy.pillars.map((p, i) => `<div class="pillar"><span class="pillar__n mono">0${i + 1}</span><h3>${p.t}</h3><p>${p.d}</p></div>`).join("")}
          </div>
        </div>
      </div>
    </section>`,

    `<section class="sec" id="why">
      <div class="wrap wrap--wide">
        <div class="split split--rev">
          <div class="rv" data-parallax data-parallax-amount="20">${C.device({ kind: "browser", inner: C.mockScreen("academy"), alt: t("منصّة الأكاديمية", "Academy Platform"), tilt: false, label: "academy.awalimgroup.com" })}</div>
          <div class="rv" data-stagger>
            ${C.eyebrow(t("لماذا نُدرّس أصلاً", "Why We Teach"), "WHY")}
            <h2 class="d-1">${a.why.h}</h2>
            <p class="lede">${a.why.p1}</p>
            <p class="lede">${a.why.p2}</p>
            ${platformCase ? C.btnRow([C.btn({ href: `/work/${platformCase.slug}`, label: t("دراسة حالة المنصّة", "Platform Case Study"), kind: "ghost", arrow: true })]) : ""}
          </div>
        </div>
      </div>
    </section>`,

    a.testimonials.length ? `<section class="sec sec--alt" id="graduates">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "شهادات الخرّيجين", eyebrowEn: "GRADUATES", h: t("بكلماتهم", "In Their Own Words") })}
        <div class="quotes rv" data-stagger>${a.testimonials.map((q) => `<blockquote class="quote"><p>${q.text}</p><footer>— ${esc(q.name)}، ${esc(q.track)} · ${esc(q.year)}</footer></blockquote>`).join("")}</div>
      </div>
    </section>` : "",

    C.ctaBand({
      h: t("تريد الانضمام إلى المسار القادم؟", "Ready to Join the Next Cohort?"),
      lede: t("أرسل لنا خلفيتك وما تريد أن تبنيه، ونرشدك إلى المسار المناسب — أو نقول لك بصراحة إن لم يكن أيٌّ منها مناسباً لك الآن.", "Tell us what you want to build and your background. We match you with the right cohort or give you candid architectural guidance."),
      primary: { href: "#modal-apply-academy", label: t("قدّم الآن", "Apply Now"), kind: "primary" },
      site
    }),

    `<!-- Fast-Track Application Modal -->
    <div class="dash-modal-overlay" id="modal-apply-academy" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="modal-apply-title">
      <div class="dash-modal" style="max-width:560px;">
        <div class="dash-modal-header" style="border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.3rem;"></span>
            <h3 class="dash-modal-title" id="modal-apply-title" style="margin:0; font-size:1.15rem; font-weight:700;">
              ${t("طلب الالتحاق بمسارات أكاديمية عوالِم", "Apply for Awalim Academy Track")}
            </h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-academy-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <form id="form-apply-academy" aria-label="${t("نموذج التقديم على مسار الأكاديمية", "Academy Track Application Form")}" style="padding:1.25rem;">
          <div id="academy-apply-error" role="alert" aria-live="polite" class="dash-form-error" style="color:var(--bad); font-size:0.85rem; margin-bottom:0.75rem;"></div>
          <div class="dash-field-group" style="margin-bottom:0.85rem;">
            <label class="dash-label" for="select-academy-track">${t("المسار الهندسي المستهدف", "Target Engineering Track")}</label>
            <select name="track_name" class="dash-select" id="select-academy-track" aria-label="${t("المسار الهندسي المستهدف", "Target Engineering Track")}" required>
              ${a.tracks.map((tr) => `<option value="${esc(tr.t)}">${esc(tr.t)} (${esc(tr.duration)})</option>`).join("")}
            </select>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.85rem;">
            <div class="dash-field-group">
              <label class="dash-label" for="input-academy-name">${t("الاسم الكامل", "Full Name")}</label>
              <input type="text" name="applicant_name" autocomplete="name" class="dash-input" id="input-academy-name" aria-label="${t("الاسم الكامل", "Full Name")}" placeholder="${t("الاسم الثلاثي أو الهندسي", "Your full name")}" required>
            </div>
            <div class="dash-field-group">
              <label class="dash-label" for="input-academy-email">${t("البريد الإلكتروني", "Email Address")}</label>
              <input type="email" name="applicant_email" autocomplete="email" class="dash-input" id="input-academy-email" aria-label="${t("البريد الإلكتروني", "Email Address")}" placeholder="engineer@domain.com" required>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.85rem;">
            <div class="dash-field-group">
              <label class="dash-label" for="select-academy-tier">${t("المستوى الهندسي الحالي", "Current Engineering Level")}</label>
              <select name="applicant_tier" class="dash-select" id="select-academy-tier" aria-label="${t("المستوى الهندسي الحالي", "Current Engineering Level")}">
                <option value="junior">${t("مهندس مبتدئ / متخرج حديثاً", "Junior / Recent Graduate")}</option>
                <option value="mid" selected>${t("مهندس برمجيات (2-4 سنوات)", "Mid-Level Engineer (2-4 yrs)")}</option>
                <option value="senior">${t("مهندس أول / قائد فريق (5+ سنوات)", "Senior / Team Lead (5+ yrs)")}</option>
                <option value="architect">${t("معمار نظم / باحث مستقل", "Systems Architect / Researcher")}</option>
              </select>
            </div>
            <div class="dash-field-group">
              <label class="dash-label" for="input-academy-github">${t("رابط GitHub / المعرض", "GitHub / Portfolio URL")}</label>
              <input type="url" name="applicant_github" autocomplete="url" class="dash-input" id="input-academy-github" aria-label="${t("رابط GitHub أو معرض الأعمال", "GitHub or Portfolio URL")}" placeholder="https://github.com/username" required>
            </div>
          </div>

          <div class="dash-field-group" style="margin-bottom:1rem;">
            <label class="dash-label" for="textarea-academy-motivation">${t("ما هو المشروع الذي تطمح لبنائه في المسار؟", "What do you aspire to build during the capstone?")}</label>
            <textarea name="applicant_notes" class="dash-textarea" id="textarea-academy-motivation" aria-label="${t("ما هو المشروع الذي تطمح لبنائه في المسار؟", "What do you aspire to build during the capstone?")}" rows="3" placeholder="${t("اشرح فكرة النظام أو المعضلة البرمجية التي تود حلها...", "Describe the technical system or challenge you want to tackle...")}" required></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-academy-apply">${t("إلغاء", "Cancel")}</button>
            <button type="submit" class="btn btn--primary btn--sm">
              <span>${t("أرسل الطلب عبر واتساب", "Send application via WhatsApp")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>`
  ]);

  return {
    path: "/academy",
    html: page({
      site,
      seo: { ...a.seo, path: "/academy", ogImage: "/assets/img/og/academy.png" },
      active: "academy",
      body,
      schema: [breadcrumbSchema(site, [{ name: t("الرئيسية", "Home"), path: "/" }, { name: t("الأكاديمية", "Academy"), path: "/academy" }])],
      bodyClass: "page-academy"
    })
  };
}
