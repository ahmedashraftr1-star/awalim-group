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

  // 4-Sprint curriculum plans per track
  const sprintRoadmaps = [
    // 01 Systems
    [
      { num: "01", weeks: t("الأسابيع 1-4", "Weeks 1-4"), title: t("معمارية النواة ونماذج البيانات", "Kernel Architecture & Schemas"), desc: t("تصميم بنية البيانات وتطبيع الجداول ومعايير الأمان وتحديد حدود العمليات المعزولة.", "Data modeling, ACID invariants, and zero-trust isolated execution boundaries.") },
      { num: "02", weeks: t("الأسابيع 5-8", "Weeks 5-8"), title: t("محرك المعاملات والقيد المزدوج IFRS", "IFRS Double-Entry Ledger Engine"), desc: t("بناء آلة الحالة المالية غير القابلة للتراجع وعزل الأخطاء وتأمين سلامة السجلات.", "Deterministic state machines, cryptographic commit logs, and concurrency safety.") },
      { num: "03", weeks: t("الأسابيع 9-12", "Weeks 9-12"), title: t("فحص الضغط ومزامنة العقد الموزعة", "Distributed Stress Testing"), desc: t("اختبار 50,000 عملية في الثانية وتحقيق زمن استجابة دون 10ms تحت الضغط.", "50k tx/sec benchmarking, load balancing, and sub-10ms p99 latency verification.") },
      { num: "04", weeks: t("الأسابيع 13-16", "Weeks 13-16"), title: t("التدقيق الجنائي والاعتماد السيادي", "Forensic Audit & Defense"), desc: t("مراجعة كود شاملة مع المهندس أحمد أشرف واعتماد ونشر المشروع النهائي حياً.", "Zero-defect code defense with Eng. Ahmed Ashraf and live production launch.") }
    ],
    // 02 AI
    [
      { num: "01", weeks: t("الأسابيع 1-4", "Weeks 1-4"), title: t("هندسة النماذج والاستدلال المحلي", "Model Engineering & Local Inference"), desc: t("تجهيز بيئات LLM المدمجة وخطوط استخراج المتجهات الحسابية الدقيقة.", "Edge LLM orchestration, embedding pipelines, and semantic retrieval systems.") },
      { num: "02", weeks: t("الأسابيع 5-8", "Weeks 5-8"), title: t("بناء الوكلاء المستقلين (Agents)", "Autonomous Agent Tooling"), desc: t("ربط حلقات التفكير، الأدوات الخارجية، واستراتيجيات التراجع الآمن.", "Multi-agent coordination, deterministic fallback routines, and memory layers.") },
      { num: "03", weeks: t("الأسابيع 9-12", "Weeks 9-12"), title: t("نظام الإنسان في الحلقة (HITL)", "Human-in-the-Loop Governance"), desc: t("حوكمة القرارات الحرجة ومنع الهلوسة في تدقيق المستندات الرسمية.", "Fail-safe verification workflows and zero-hallucination document extraction.") },
      { num: "04", weeks: t("الأسابيع 13-16", "Weeks 13-16"), title: t("اختبارات الأمان السيبراني والنشر", "Adversarial Hardening & Launch"), desc: t("مقاومة هجمات حقن الأوامر (Prompt Injection) والنشر السحابي المقسى.", "Prompt-injection red teaming, sandbox hardening, and live production deployment.") }
    ],
    // 03 Flutter
    [
      { num: "01", weeks: t("الأسابيع 1-4", "Weeks 1-4"), title: t("معمارية التطبيق وقاعدة البيانات المحلية", "State Architecture & Local DB"), desc: t("تصميم بنية BLoC الصارمة ومزامنة SQLite مشفرة محلياً دون تسريب بيانات.", "Strict BLoC state boundaries, encrypted local SQLite, and clean memory models.") },
      { num: "02", weeks: t("الأسابيع 5-8", "Weeks 5-8"), title: t("محرك الصمود دون إنترنت (Offline-First)", "Offline-First Sync Engine"), desc: t("بروتوكول تجميع الحزم والمزامنة الصامتة فور توفر الاتصال في الميدان.", "Conflict-free replicated data types and silent background mesh queuing.") },
      { num: "03", weeks: t("الأسابيع 9-12", "Weeks 9-12"), title: t("الأداء الفيزيائي 120 FPS والواجهات", "120 FPS Fluid Micro-Physics"), desc: t("تحسين استخدام الذاكرة والرسومات المخصصة للميدان وحالات الطوارئ.", "Zero-jank render pipelines, canvas optimizations, and field-ready UI.") },
      { num: "04", weeks: t("الأسابيع 13-16", "Weeks 13-16"), title: t("النشر التلقائي على المتاجر (CI/CD)", "Automated Dual App Store Release"), desc: t("أتمتة التوقيع الرقمي، فحص المتطلبات الصارمة، والإطلاق المزدوج في المتاجر.", "Cryptographic APK/IPA signing, automated pipelines, and production release.") }
    ],
    // 04 Design
    [
      { num: "01", weeks: t("الأسابيع 1-4", "Weeks 1-4"), title: t("قواعد التيبوغرافيا والأنظمة البصرية", "Arabic Typography Foundations"), desc: t("معايرة نسب الحروف، السطور، والمقاييس المتوافقة مع العين العربية.", "Glyph proportion science, baseline geometry, and culturally resonant optics.") },
      { num: "02", weeks: t("الأسابيع 5-8", "Weeks 5-8"), title: t("هندسة الرموز التصميمية (Design Tokens)", "Executable Design Token Engineering"), desc: t("بناء نظام ألوان HSL، زجاجية الإضاءة، وتوليد متغيرات CSS برمجياً.", "HSL light physics, semantic elevation layers, and automated CSS export.") },
      { num: "03", weeks: t("الأسابيع 9-12", "Weeks 9-12"), title: t("مكتبة المكونات التفاعلية المزدوجة", "Bi-Directional Component Systems"), desc: t("بناء 40 مكوناً عالي الدقة يراعي اتجاه القراءة وحركات اللمس الحية.", "40 production-grade components engineered for zero-compromise RTL/LTR parity.") },
      { num: "04", weeks: t("الأسابيع 13-16", "Weeks 13-16"), title: t("توثيق المنظومة وتصدير الحزمة", "Design System NPM Release"), desc: t("إطلاق نظام تصميم متكامل بمعايير عالمية مع دليل مطورين تفاعلي.", "Packaging, comprehensive developer documentation, and public design launch.") }
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
            ${C.btn({ href: "#cert-verify", label: t("التحقق من الشهادات", "Verify Credentials"), kind: "ghost", arrow: true })}
          </div>
        </div>
        <div class="hero__media rv" style="--i:2" data-tilt>${C.device({ kind: "laptop", inner: C.mockScreen("academy"), alt: t("منصّة أكاديمية عوالِم: مشروع المسار ومهامّه ومراجعة الكود", "Awalim Academy Platform: Sprint reviews and production grade code"), tilt: true, label: "academy.awalimgroup.com" })}</div>
      </div>
    </section>`,

    `<section class="sec sec--tight" aria-label="${t("أرقام الأكاديمية", "Academy Verified Metrics")}">
      <div class="wrap wrap--wide">
        ${C.statBar(a.stats, stats, { size: "xl", cls: "statbar--hero", verify: true, signing: ctx.signing })}
        <p class="small muted rv statbar__note">${fill(t("«{engineersTrained}» هم كل من دخل مساراً في الأكاديمية؛ «{certifiedGraduates}» هم من أنهوا المسار كاملاً بمشروع منشور. الدول الست هي التي يعمل فيها خرّيجونا اليوم — أما «{clientCountries} دول» في الرئيسية فهي دول عملاء المجموعة.", "'{engineersTrained}' entered our engineering tracks; '{certifiedGraduates}' completed the capstone project live in production. Graduates operate across 6 countries today."), stats)}</p>
      </div>
    </section>`,

    `<section class="sec" id="tracks">
      <div class="wrap wrap--wide">
        ${C.sectionHead({ eyebrowAr: "المسارات", eyebrowEn: "TRACKS", h: `${stats.tracks.value} ${t("مسارات هندسية مكثفة", "Rigorous Engineering Tracks")}`, lede: t("كل مسار يُبنى حول مشروع إنتاجي واحد تُسلّمه وتدافع عن كوده في النهاية — لا حول مجرد محاضرات نظرية.", "Each track centers on a single production-grade capstone you engineer, defend, and deploy live.") })}
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
                  <span>⚡ ${t("التقديم لهذا المسار", "Apply for Track")}</span>
                </button>
                <button type="button" class="btn btn--outline btn--sm btn-toggle-sprint-plan" data-sprint-target="track-sprints-${i + 1}" style="padding:8px 18px; border-radius:8px; height:auto; width:auto; font-size:0.85rem; display:inline-flex;">
                  <span>📋 ${t("خطة السبرنتات الـ 4", "4-Sprint Roadmap")}</span>
                </button>
              </div>

              <!-- Collapsible 4-Sprint Roadmap -->
              <div id="track-sprints-${i + 1}" class="track-sprints-drawer" style="display:none; padding:1.25rem; border-radius:var(--radius-md, 10px); background:rgba(14,18,25,0.65); border:1px solid rgba(212,175,55,0.25); box-shadow:0 10px 30px rgba(0,0,0,0.4);">
                <div style="font-weight:700; font-size:0.9rem; margin-bottom:0.85rem; color:var(--gold, #D4AF37);">
                  🏁 ${t("خطة السبرنتات الـ 4 والمخرجات الهندسية للمشروع", "4-Sprint Execution Roadmap & Technical Deliverables")}
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:0.75rem;">
                  ${(sprintRoadmaps[i] || []).map(sp => `
                    <div style="padding:0.75rem; border-radius:8px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                        <span class="mono" style="font-size:0.75rem; color:var(--gold, #D4AF37); font-weight:700;">Sprint ${sp.num}</span>
                        <span style="font-size:0.72rem; color:var(--muted);">${sp.weeks}</span>
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

    `<!-- Interactive Graduate Certificate Verification Suite -->
    <section class="sec sec--alt" id="cert-verify" aria-label="${t("التحقق من الشهادات", "Certificate Verification")}">
      <div class="wrap wrap--wide">
        ${C.sectionHead({
          eyebrowAr: "الاعتماد التشفيري",
          eyebrowEn: "CRYPTOGRAPHIC CREDENTIALS",
          h: t("التحقق الفوري من شهادات خريجي الأكاديمية", "Instant Cryptographic Graduate Certificate Verification"),
          lede: t("كل شهادة تخرج معتمدة صادرة من أكاديمية عوالِم موثقة بتوقيع Ed25519 ومربوطة بالهاش المشفر للمشروع النهائي المنشور على GitHub.", "Every accredited graduation certificate issued by Awalim Academy is cryptographically sealed with Ed25519 and verifiable in the visitor browser.")
        })}

        <div style="max-width:820px; margin:0 auto; padding:1.75rem; border-radius:var(--radius-lg, 16px); background:rgba(14,18,25,0.7); border:1px solid rgba(212,175,55,0.3); box-shadow:0 20px 50px rgba(0,0,0,0.5);">
          
          <form id="form-verify-cert" aria-label="${t("نموذج فحص الشهادة", "Certificate Verification Form")}" style="margin-bottom:1.25rem;">
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <div style="flex:1; min-width:240px;">
                <label for="input-cert-search" class="dash-label" style="display:block; margin-bottom:0.35rem; font-size:0.85rem;">
                  ${t("أدخل رقم الشهادة أو المعرف الرقمي (Certificate ID)", "Enter Certificate Serial ID")}
                </label>
                <input type="text" name="cert_id" id="input-cert-search" class="dash-input" aria-label="${t("أدخل رقم الشهادة أو المعرف الرقمي", "Enter Certificate Serial ID")}" aria-describedby="cert-verify-error" placeholder="AWL-CERT-2026-ENG01" required style="width:100%;">
              </div>
              <div style="display:flex; align-items:flex-end;">
                <button type="submit" class="btn btn--primary btn--sm" id="btn-submit-verify-cert" style="background:var(--gold,#D4AF37); border-color:var(--gold,#D4AF37); color:#000; font-weight:700; height:42px;">
                  <span>🔍 ${t("فحص ومصادقة الشهادة", "Verify Signature")}</span>
                </button>
              </div>
            </div>
            <div id="cert-verify-error" role="alert" aria-live="polite" class="dash-form-error" style="color:var(--danger, #f43f5e); font-size:0.85rem; margin-top:0.35rem; min-height:1rem;"></div>
          </form>

          <!-- Quick presets -->
          <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; font-size:0.78rem; margin-bottom:1.5rem;">
            <span class="text-muted">${t("شهادات تجريبية سريعة:", "Preset Graduate Credentials:")}</span>
            <button type="button" class="chip chip--sm btn-preset-cert" data-cert-id="AWL-CERT-2026-ENG01">ENG-01 (${t("م. طارق الناصر", "Tariq Al-Nasser")})</button>
            <button type="button" class="chip chip--sm btn-preset-cert" data-cert-id="AWL-CERT-2026-ENG06">ENG-06 (${t("م. هناء الزعبي", "Hana Al-Zoubi")})</button>
            <button type="button" class="chip chip--sm btn-preset-cert" data-cert-id="AWL-CERT-2026-ENG02">ENG-02 (${t("د. ليلى منصور", "Dr. Layla Mansour")})</button>
          </div>

          <!-- Certificate Verification Result Container -->
          <div id="cert-verification-result" style="padding:1.5rem; border-radius:12px; background:radial-gradient(circle at top right, rgba(212,175,55,0.08), transparent 70%), rgba(255,255,255,0.02); border:1px solid rgba(212,175,55,0.4);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
              <div style="display:flex; align-items:center; gap:0.75rem;">
                <span style="font-size:2rem;">🛡️</span>
                <div>
                  <div class="mono" style="font-size:0.75rem; color:var(--gold,#D4AF37); font-weight:700;" id="cert-out-id">AWL-CERT-2026-ENG01</div>
                  <h3 style="margin:0.2rem 0; font-size:1.2rem; font-weight:800;" id="cert-out-name">${t("المهندس طارق الناصر", "Eng. Tariq Al-Nasser")}</h3>
                  <div style="font-size:0.85rem; color:var(--muted);" id="cert-out-track">${t("مسار 01: هندسة الأنظمة وقواعد البيانات", "Track 01: Systems & Database Architecture")}</div>
                </div>
              </div>
              <span class="badge badge--ok" style="font-size:0.75rem; border-color:var(--gold,#D4AF37); color:var(--gold,#D4AF37);" id="cert-out-badge">
                ✔ ${t("شهادة رسمية معتمدة Ed25519", "Ed25519 Verified")}
              </span>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.85rem; padding:1rem; border-radius:8px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); margin-bottom:1rem; font-size:0.82rem;">
              <div>
                <span class="text-muted" style="display:block; font-size:0.72rem;">${t("مشروع التخرج المعتمد", "Verified Capstone Project")}</span>
                <b id="cert-out-project">${t("محرك القيد المحاسبي المزدوج IFRS (Island Haven)", "IFRS Double-Entry Ledger Engine")}</b>
              </div>
              <div>
                <span class="text-muted" style="display:block; font-size:0.72rem;">${t("التقدير والمرتبة", "Honors & Grade")}</span>
                <b style="color:#10B981;" id="cert-out-grade">${t("امتياز مع مرتبة الشرف 99.4%", "Summa Cum Laude (99.4%)")}</b>
              </div>
              <div>
                <span class="text-muted" style="display:block; font-size:0.72rem;">${t("المشرف العام ورئيس المعمارية", "Apex Reviewer")}</span>
                <b id="cert-out-mentor">${t("المهندس أحمد أشرف", "Eng. Ahmed Ashraf")}</b>
              </div>
              <div>
                <span class="text-muted" style="display:block; font-size:0.72rem;">${t("تاريخ الاعتماد", "Date of Conferral")}</span>
                <b id="cert-out-date">2026-09-20</b>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; font-size:0.72rem; color:var(--muted);">
              <div class="mono" id="cert-out-hash">SHA-256: 7c129f40b311...tn02 · ED25519 ROOT ATTESTED</div>
              <button type="button" class="btn btn--outline btn--xs" id="btn-print-academic-cert">
                <span>🖨️ ${t("طباعة / تصدير الشهادة", "Print Official Credential")}</span>
              </button>
            </div>
          </div>

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
            <span style="font-size:1.3rem;">🎓</span>
            <h3 class="dash-modal-title" id="modal-apply-title" style="margin:0; font-size:1.15rem; font-weight:700;">
              ${t("طلب الالتحاق بمسارات أكاديمية عوالِم", "Apply for Awalim Academy Track")}
            </h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-academy-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <form id="form-apply-academy" aria-label="${t("نموذج التقديم على مسار الأكاديمية", "Academy Track Application Form")}" style="padding:1.25rem;">
          <div id="academy-apply-error" role="alert" aria-live="polite" class="dash-form-error" style="color:var(--danger, #f43f5e); font-size:0.85rem; margin-bottom:0.75rem;"></div>
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
            <button type="submit" class="btn btn--primary btn--sm" style="background:var(--gold,#D4AF37); border-color:var(--gold,#D4AF37); color:#000; font-weight:700;">
              <span>🚀 ${t("إرسال طلب الالتحاق ومراجعة المعمارية", "Submit Application for Review")}</span>
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
