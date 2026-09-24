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

    `<section class="sec sec--alt" id="raqib-sentinel" data-raqib>
      <div class="wrap wrap--wide">
        ${C.sectionHead({
          eyebrowAr: s.raqib ? s.raqib.eyebrow : "منظومة رَقيب السيادية · AWALIM RAQIB SENTINEL",
          eyebrowEn: "AWALIM RAQIB SENTINEL · COMPLIANCE & CYBER DEFENSE",
          h: s.raqib ? s.raqib.h : "فحص الأمان الشامل ومطابقة الامتثال لقوانين حماية البيانات العربية والدولية",
          lede: s.raqib ? s.raqib.lede : "افحص أي نطاق أو تطبيق SaaS خارجياً بلحظات: تدقيق معمق للتشفير وترويسات الأمان والكوكيز، مع مطابقة تفصيلية لمواد قانون حماية البيانات المصري (151 لسنة 2020) والنظام السعودي واللائحة الأوروبية GDPR، وحساب فوري للغرامات المالية المحتملة وتقديم حلول كود برمجية فورية."
        })}

                <!-- Sovereign Module Navigation Tabs -->
        <div class="raqib-module-tabs rv" id="raqib-module-tabs" style="margin-block-end: 1.5rem;">
          <button type="button" class="raqib-module-tab-btn active" data-tab="scanner">
            <span class="dot dot--live"></span> <span>${s.raqib ? s.raqib.tab_scanner : "الماسح الخارجي والمطابقة"}</span>
          </button>
          <button type="button" class="raqib-module-tab-btn" data-tab="breach">
            <span>🚨 ${s.raqib ? s.raqib.tab_breach : "إخطار الخروقات (72 ساعة)"}</span>
          </button>
          <button type="button" class="raqib-module-tab-btn" data-tab="consent">
            <span>🛡️ ${s.raqib ? s.raqib.tab_consent : "مولّد شريط الامتثال 0KB"}</span>
          </button>
          <button type="button" class="raqib-module-tab-btn" data-tab="readiness">
            <span>📊 ${s.raqib ? s.raqib.tab_readiness : "مقياس الجاهزية المؤسسية"}</span>
          </button>
        </div>

        <!-- View 1: Statutory & Perimeter Scanner -->
        <div class="raqib-module-view active" id="raqib-view-scanner">
        <!-- Scanner Console Card -->
        <div class="raqib-console-card rv" style="margin-block-end: 2rem;">
          <div class="raqib-console-head">
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <span class="chip chip--gold"><span class="dot dot--live"></span>${ctx.locale === "en" ? "PDPL & CYBER COMPLIANCE ENGINE" : "محرك الامتثال لقانون حماية البيانات 151 لسنة 2020"}</span>
              <span class="chip chip--accent">${ctx.locale === "en" ? "ZERO EXTERNAL TRACKERS" : "خالٍ تماماً من متعقبات الطرف الثالث"}</span>
            </div>
            <span class="mono" style="font-size: 0.75rem; color: var(--text-muted);">${ctx.locale === "en" ? "Edge & Client Audit Engine · Sub-16ms INP" : "محرك فحص فوري على الحافة · استجابة تحت 16ms"}</span>
          </div>

          <form id="form-raqib-scan" class="raqib-scan-form">
            <div class="raqib-input-wrap">
              <label for="input-raqib-target" class="raqib-label">${s.raqib ? s.raqib.target_label : (ctx.locale === "en" ? "Enter target domain or SaaS URL:" : "أدخل عنوان النطاق أو تطبيق الـ SaaS للفحص الخارجي:")}</label>
              <div class="raqib-input-row">
                <div class="raqib-input-box">
                  <span class="raqib-input-icon">🌐</span>
                  <input type="url" name="target_url" class="raqib-target-input mono" id="input-raqib-target" placeholder="https://your-saas-platform.com" required aria-describedby="raqib-input-err">
                  <div id="raqib-input-err" role="alert" aria-live="polite" class="raqib-error-msg" style="display:none; color:#EF4444; font-size:0.8rem; margin-top:0.35rem;"></div>
                </div>
                <button type="submit" class="btn btn--primary raqib-submit-btn" id="btn-run-raqib-scan">
                  <span>⚡ ${s.raqib ? s.raqib.btn_scan : (ctx.locale === "en" ? "Run Sovereign Audit" : "بدء الفحص الجنائي السيادي")}</span>
                </button>
              </div>
            </div>

            <!-- Target Presets & Quick Chips -->
            <div class="raqib-presets-row">
              <span style="font-size: 0.75rem; color: var(--text-muted);">${ctx.locale === "en" ? "Quick Presets:" : "نماذج جاهزة للفحص:"}</span>
              <button type="button" class="raqib-preset-chip active" data-target="https://awalim.group">
                <span class="dot dot--live"></span> ${ctx.locale === "en" ? "Awalim Group (100% Compliant)" : "عوالِم قروب (امتثال 100%)"}
              </button>
              <button type="button" class="raqib-preset-chip" data-target="https://vulnerable-demo-saas.com">
                <span class="dot" style="background:#EF4444;"></span> ${ctx.locale === "en" ? "Unprotected SaaS (High Violations)" : "تطبيق SaaS تجريبي غير محمي (مخالفات وغرامات)"}
              </button>
            </div>

            <!-- Framework Selection -->
            <div class="raqib-framework-row" style="margin-top: 1rem;">
              <span class="raqib-label" style="margin-bottom: 0.4rem;">${s.raqib ? s.raqib.framework_label : (ctx.locale === "en" ? "Regulatory Framework:" : "الإطار التشريعي والتنظيمي للمطابقة:")}</span>
              <div class="raqib-framework-pills">
                <label class="raqib-framework-pill active">
                  <input type="radio" name="raqib-framework" value="egypt_pdpl" checked>
                  <span>${ctx.locale === "en" ? "Egypt PDPL (Law 151/2020)" : "قانون حماية البيانات المصري (151 لسنة 2020)"}</span>
                </label>
                <label class="raqib-framework-pill">
                  <input type="radio" name="raqib-framework" value="saudi_pdpl">
                  <span>${ctx.locale === "en" ? "Saudi PDPL & NDMO" : "نظام حماية البيانات السعودي (NDMO)"}</span>
                </label>
                <label class="raqib-framework-pill">
                  <input type="radio" name="raqib-framework" value="uae_pdpl">
                  <span>${ctx.locale === "en" ? "UAE Data Law (Decree 45/2021)" : "قانون البيانات الإماراتي (مرسوم 45 لسنة 2021)"}</span>
                </label>
                <label class="raqib-framework-pill">
                  <input type="radio" name="raqib-framework" value="eu_gdpr">
                  <span>${ctx.locale === "en" ? "EU GDPR (Regulation 2016/679)" : "اللائحة الأوروبية لحماية البيانات (GDPR)"}</span>
                </label>
              </div>
            </div>
          </form>

          <!-- Live Scanning Terminal HUD (Animated Progress) -->
          <div class="raqib-hud" id="raqib-hud" style="display: none;">
            <div class="raqib-hud-header">
              <span class="mono" style="color: var(--accent);"><span class="dot dot--live"></span> ${ctx.locale === "en" ? "PROBING PERIMETER & COMPLIANCE RULES..." : "جاري فحص المحيط الخارجي وتدقيق قواعد الامتثال..."}</span>
              <span class="mono" id="raqib-hud-percent" style="font-weight: var(--w-bold);">0%</span>
            </div>
            <div class="raqib-progress-track">
              <div class="raqib-progress-bar" id="raqib-progress-bar" style="width: 0%;"></div>
            </div>
            <div class="raqib-terminal-logs" id="raqib-terminal-logs">
              <div class="raqib-log-line">[01/05] Initializing cryptographic probe matrix...</div>
            </div>
          </div>

          <!-- Comprehensive Results & Sovereign Audit Dossier -->
          <div class="raqib-dossier" id="raqib-dossier" style="display: none;">
            
            <!-- Top Score & Fines Meter -->
            <div class="raqib-dossier-top">
              <div class="raqib-score-box">
                <div class="raqib-score-badge" id="raqib-score-grade">A+</div>
                <div>
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${ctx.locale === "en" ? "Sovereign Compliance Score" : "مؤشر الامتثال والأمان السيادي"}</div>
                  <div class="mono" id="raqib-score-val" style="font-size: 2rem; font-weight: var(--w-bold); color: var(--gold, #D4AF37);">99/100</div>
                  <span class="badge badge--ok" id="raqib-score-verdict">${ctx.locale === "en" ? "Sovereign Excellence Class" : "مرتبة الامتثال السيادي الفائق"}</span>
                </div>
              </div>

              <!-- Fines & Legal Liability Meter -->
              <div class="raqib-fines-card" id="raqib-fines-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 0.75rem; font-weight: var(--w-bold); color: var(--text-1);">${s.raqib ? s.raqib.fines_title : (ctx.locale === "en" ? "Statutory Fines & Regulatory Liability Risk" : "المخاطر والغرامات المالية المحتملة بموجب القانون")}</span>
                  <span class="badge" id="raqib-fines-badge">0 EGP</span>
                </div>
                <p id="raqib-fines-desc" style="font-size: 0.78rem; color: var(--text-muted); margin: 0; line-height: 1.5;">
                  ${ctx.locale === "en" ? "No statutory violations detected. Fully shielded against Egypt PDPL Law 151/2020 fines (up to 5,000,000 EGP)." : "لا توجد أي مخالفات نظامية مرصودة. المنظومة محصنة بالكامل ضد غرامات قانون حماية البيانات المصري (تصل إلى 5,000,000 جنيه)."}
                </p>
              </div>

              <div style="display: flex; flex-direction: column; justify-content: center; gap: 8px;">
                <button type="button" class="btn btn--outline btn--sm" id="btn-export-raqib-report">
                  <span>📥 ${s.raqib ? s.raqib.btn_export : (ctx.locale === "en" ? "Download Certified Forensic Report" : "تحميل التقرير الجنائي المعتمد")}</span>
                </button>
                <span class="mono" style="font-size: 0.7rem; color: var(--text-muted); text-align: center;">SHA-256 Merkle Certified</span>
              </div>
            </div>

            <!-- Egypt PDPL Law 151/2020 Compliance Articles Matrix -->
            <div style="margin-block-start: 1.5rem;">
              <h3 style="font-size: 1rem; font-weight: var(--w-bold); color: var(--text-1); margin-bottom: 0.75rem;">
                ${s.raqib ? s.raqib.articles_title : (ctx.locale === "en" ? "Egypt PDPL (Law 151/2020) Statutory Articles Mapping" : "مطابقة مواد قانون حماية البيانات الشخصية المصري (رقم 151 لسنة 2020)")}
              </h3>
              <div class="raqib-articles-grid" id="raqib-articles-grid">
                <!-- Injected dynamically by security.js -->
              </div>
            </div>

            <!-- Technical Vectors Grid -->
            <div style="margin-block-start: 1.5rem;">
              <h3 style="font-size: 1rem; font-weight: var(--w-bold); color: var(--text-1); margin-bottom: 0.75rem;">
                ${ctx.locale === "en" ? "Perimeter Security & Privacy Vectors" : "محاور الأمان الخارجي وخصوصية البيانات"}
              </h3>
              <div class="raqib-vectors-grid" id="raqib-vectors-grid">
                <!-- Injected dynamically by security.js -->
              </div>
            </div>

            <!-- Actionable Remediation Code Generator -->
            <div style="margin-block-start: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <h3 style="font-size: 1rem; font-weight: var(--w-bold); color: var(--text-1); margin: 0;">
                  ${s.raqib ? s.raqib.remediation_title : (ctx.locale === "en" ? "Instant Actionable Remediation Code" : "حلول الكود البرمجي الفورية لمعالجة الثغرات")}
                </h3>
                <div class="raqib-code-tabs" id="raqib-code-tabs">
                  <button type="button" class="raqib-tab-btn active" data-tab="nginx">Nginx</button>
                  <button type="button" class="raqib-tab-btn" data-tab="cloudflare">Cloudflare</button>
                  <button type="button" class="raqib-tab-btn" data-tab="node">Node / Express</button>
                  <button type="button" class="raqib-tab-btn" data-tab="apache">Apache</button>
                </div>
              </div>
              <div class="raqib-code-display-wrap">
                <pre class="raqib-code-pre mono" id="raqib-code-content" dir="ltr"></pre>
                <button type="button" class="btn btn--ghost btn--xs raqib-copy-code-btn" id="btn-copy-remediation">
                  <span>${ctx.locale === "en" ? "Copy Snippet" : "نسخ الكود"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

                </div>

        <!-- View 2: 72h Data Breach Emergency Protocol -->
        <div class="raqib-module-view" id="raqib-view-breach" style="display: none;">
          <div class="raqib-console-card rv" style="margin-block-end: 2rem;">
            <div class="raqib-console-head">
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <span class="chip chip--gold"><span class="dot dot--live"></span>${ctx.locale === "en" ? "STATUTORY 72H DEADLINE · LAW 151/2020 ART. 12" : "الموعد القانوني الإلزامي: 72 ساعة · المادة 12 من القانون 151"}</span>
                <span class="chip chip--accent">${ctx.locale === "en" ? "FORMAL REGULATORY DISPATCH" : "إخطار رسمي لمركز حماية البيانات"}</span>
              </div>
              <span class="mono" style="font-size: 0.75rem; color: var(--text-muted);">${ctx.locale === "en" ? "DPO Legal Incident Engine" : "محرك توثيق حوادث مسؤول حماية البيانات"}</span>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <h3 style="font-size: 1.25rem; font-weight: var(--w-bold); color: var(--text-1); margin: 0 0 0.5rem;">${s.raqib ? s.raqib.breach_h : "بروتوكول طوارئ الإخطار عن الخروقات الأمنية (خلال 72 ساعة)"}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin: 0;">${s.raqib ? s.raqib.breach_desc : "توجب المادة 12 من قانون حماية البيانات المصري والمادة 24 من النظام السعودي إخطار المركز القومي خلال 72 ساعة من العلم بالخرق تجنباً للعقوبات الجنائية والغرامات المليونية."}</p>
            </div>

            <!-- Live Statutory 72-Hour Countdown Clock HUD -->
            <div class="raqib-countdown-card rv" id="raqib-breach-countdown-card" style="margin-bottom: 1.5rem;">
              <div class="raqib-countdown-header">
                <div>
                  <span class="chip chip--gold" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${ctx.locale === "en" ? "STATUTORY FILING WINDOW" : "النافذة الزمنية النظامية للإخطار (المادة 12)"}</span>
                  <div style="font-size: 0.82rem; color: var(--text-muted);">${ctx.locale === "en" ? "Time remaining before statutory expiration and criminal non-compliance liability:" : "الوقت المتبقي قبل انقضاء المهلة النظامية والتعرض للمساءلة الجنائية والغرامات:"}</div>
                </div>
                <div class="badge badge--ok" id="raqib-countdown-status" style="margin-top: 4px;">${ctx.locale === "en" ? "WITHIN LEGAL WINDOW" : "ضمن المهلة النظامية"}</div>
              </div>
              <div class="raqib-countdown-digits" id="raqib-countdown-digits">
                <div class="raqib-digit-box"><span class="mono" id="cd-hours">71</span><span class="digit-lbl">${ctx.locale === "en" ? "Hours" : "ساعة"}</span></div>
                <span class="digit-sep">:</span>
                <div class="raqib-digit-box"><span class="mono" id="cd-minutes">59</span><span class="digit-lbl">${ctx.locale === "en" ? "Minutes" : "دقيقة"}</span></div>
                <span class="digit-sep">:</span>
                <div class="raqib-digit-box"><span class="mono" id="cd-seconds">59</span><span class="digit-lbl">${ctx.locale === "en" ? "Seconds" : "ثانية"}</span></div>
              </div>
            </div>

            <form id="form-raqib-breach" class="raqib-tool-form">
              <div class="raqib-form-grid">
                <div class="raqib-field-group">
                  <label for="input-breach-org" class="raqib-label">${ctx.locale === "en" ? "Entity / Data Controller Name:" : "اسم المنشأة أو جهة التحكم:"}</label>
                  <input type="text" id="input-breach-org" class="raqib-input mono" value="${ctx.locale === "en" ? "Acme Enterprise Ltd." : "شركة التقنية المؤسسية القابضة"}" required>
                </div>
                <div class="raqib-field-group">
                  <label for="select-breach-type" class="raqib-label">${ctx.locale === "en" ? "Cyber Incident Classification:" : "تصنيف الحادث السيبراني:"}</label>
                  <select id="select-breach-type" class="raqib-select">
                    <option value="ransomware">${ctx.locale === "en" ? "Ransomware Attack & Encryption" : "هجوم فدية وتشفير قواعد البيانات (Ransomware)"}</option>
                    <option value="unauthorized_access" selected>${ctx.locale === "en" ? "Unauthorized Database Access / API Leak" : "تسريب بيانات عبر واجهة برمجة أو وصول غير مصرح"}</option>
                    <option value="cloud_misconfig">${ctx.locale === "en" ? "Cloud Storage Bucket Misconfiguration" : "خطأ تهيئة أمنية في وسائط تخزين سحابية"}</option>
                    <option value="credential_theft">${ctx.locale === "en" ? "Credential Theft / Executive Phishing" : "سرقة بيانات اعتماد دخول عبر تصيد احتيالي"}</option>
                  </select>
                </div>
                <div class="raqib-field-group">
                  <label for="input-breach-time" class="raqib-label">${ctx.locale === "en" ? "Discovery Timestamp (72h starts here):" : "تاريخ وتوقيت اكتشاف الواقعة (يبدأ عداد الـ 72 ساعة):"}</label>
                  <input type="datetime-local" id="input-breach-time" class="raqib-input mono" value="2026-09-19T14:30">
                </div>
                <div class="raqib-field-group">
                  <label for="select-breach-scope" class="raqib-label">${ctx.locale === "en" ? "Compromised Data Classification:" : "تصنيف وحساسية البيانات المنتهكة:"}</label>
                  <select id="select-breach-scope" class="raqib-select">
                    <option value="financial">${ctx.locale === "en" ? "Financial Data / Credit Cards / Bank Accounts" : "بيانات مالية وحسابات بنكية وبطاقات ائتمان"}</option>
                    <option value="pii" selected>${ctx.locale === "en" ? "National IDs / Passports / Personal Records" : "أرقام قومية وجوازات سفر وبيانات هوية أساسية"}</option>
                    <option value="health">${ctx.locale === "en" ? "Sensitive Health & Biometric Data" : "بيانات صحية وحيوية (بيومترية) حساسة"}</option>
                    <option value="credentials">${ctx.locale === "en" ? "User Passwords & Auth Hashes" : "كلمات مرور مشفرة وبيانات تسجيل الدخول"}</option>
                  </select>
                </div>
                <div class="raqib-field-group">
                  <label for="input-breach-count" class="raqib-label">${ctx.locale === "en" ? "Estimated Affected Data Subjects:" : "العدد التقديري التقريبي لأصحاب البيانات المتأثرين:"}</label>
                  <input type="number" id="input-breach-count" class="raqib-input mono" value="12500" min="1">
                </div>
                <div class="raqib-field-group">
                  <label for="input-breach-dpo" class="raqib-label">${ctx.locale === "en" ? "Designated DPO Name & Reg No.:" : "اسم ورقم قيد مسؤول حماية البيانات (DPO):"}</label>
                  <input type="text" id="input-breach-dpo" class="raqib-input mono" value="Eng. Ahmed Ashraf (DPO-REG-EG-2026-088)">
                </div>
              </div>

              <div class="raqib-field-group" style="margin-top: 1rem;">
                <label for="textarea-breach-actions" class="raqib-label">${ctx.locale === "en" ? "Immediate Containment & Remediation Measures Taken:" : "التدابير العاجلة المتخذة لاحتواء الخرق وتقليص الأثر:"}</label>
                <textarea id="textarea-breach-actions" class="raqib-textarea mono" rows="3" name="breach_actions">${ctx.locale === "en" ? "Isolated affected API gateways, revoked compromised credentials, rotated all cryptographic master keys, and activated forensic logging." : "تم عزل البوابات الرقمية المتأثرة، إبطال صلاحيات مفاتيح الاعتماد المسربة، تدوير كافة المفاتيح التشفيرية، وتفعيل السجلات الجنائية الرقمية."}</textarea>
              </div>

              <div style="margin-top: 1.25rem; display: flex; justify-content: flex-end;">
                <button type="submit" class="btn btn--primary btn--sm" id="btn-submit-breach-report">
                  <span>${ctx.locale === "en" ? "Generate & Dispatch Forensic Breach Notification (72h)" : "توليد وإرسال إشعار الخرق السيبراني الرسمي (خلال 72 ساعة)"}</span>
                </button>
              </div>
            </form>

            <!-- Generated Official Notification Letter Preview -->
            <div style="margin-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <h4 style="font-size: 0.95rem; font-weight: var(--w-bold); color: var(--text-1); margin: 0;">${ctx.locale === "en" ? "Formal Regulatory Notification Dispatch (Statutory Law 151/2020 Art. 12)" : "نص الإخطار الرسمي لمركز حماية البيانات الشخصية (وفق المادة 12)"}</h4>
                <div style="display: flex; gap: 8px;">
                  <button type="button" class="btn btn--ghost btn--xs" id="btn-copy-breach-notice"><span>📋 ${ctx.locale === "en" ? "Copy Official Letter" : "نسخ الخطاب الرسمي"}</span></button>
                  <button type="button" class="btn btn--outline btn--xs" id="btn-download-breach-notice"><span>📥 ${ctx.locale === "en" ? "Download Dispatch (.txt)" : "تنزيل الخطاب (.txt)"}</span></button>
                </div>
              </div>
              <pre class="raqib-code-pre mono" id="raqib-breach-notice-content" dir="rtl" style="white-space: pre-wrap; font-size: 0.82rem; line-height: 1.6; max-height: 360px; overflow-y: auto;"></pre>
            </div>
          </div>
        </div>

        <!-- View 3: 0KB Sovereign Consent & CMP Engine -->
        <div class="raqib-module-view" id="raqib-view-consent" style="display: none;">
          <div class="raqib-console-card rv" style="margin-block-end: 2rem;">
            <div class="raqib-console-head">
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <span class="chip chip--gold"><span class="dot dot--live"></span>${ctx.locale === "en" ? "0KB TRACKING · STRICT LAW 151/2020 COMPLIANCE" : "صفر متتبعات · مطابقة تامة للمادتين 3 و 7"}</span>
                <span class="chip chip--accent">${ctx.locale === "en" ? "ZERO RUNTIME DEPENDENCIES" : "خالٍ من أي سكريبتات خارجية 0KB"}</span>
              </div>
              <span class="mono" style="font-size: 0.75rem; color: var(--text-muted);">${ctx.locale === "en" ? "Sovereign Glass CMP Generator" : "مولد شريط الموافقة السيادي الخفيف"}</span>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <h3 style="font-size: 1.25rem; font-weight: var(--w-bold); color: var(--text-1); margin: 0 0 0.5rem;">${s.raqib ? s.raqib.consent_h : "مولّد شريط الموافقة والامتثال الصريح 0KB (Strict Consent CMP)"}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin: 0;">${s.raqib ? s.raqib.consent_desc : "المادتان 3 و 7 من قانون حماية البيانات المصري تنصان على بطلان أي موافقة مبنية على السكوت أو مربعات محددة مسبقاً. ولّد كود شريط موافقة سيادي خفيف وخالٍ من التعقب."}</p>
            </div>

            <!-- Interactive Visual Preview of the Sovereign Consent Bar -->
            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <span class="raqib-label" style="margin: 0;">${ctx.locale === "en" ? "Live Visual Preview (What your users see):" : "المعاينة الحية التفاعلية (ما يراه مستخدموك):"}</span>
                <span class="chip chip--sm mono">${ctx.locale === "en" ? "Strict CSP Level 3 Safe" : "آمن تماماً مع CSP Level 3"}</span>
              </div>
              <div class="raqib-consent-preview" id="raqib-consent-preview-box">
                <div class="raqib-consent-inner">
                  <div style="display: flex; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
                    <span style="font-size: 1.75rem;">🛡️</span>
                    <div style="flex: 1; min-width: 240px;">
                      <h4 style="margin: 0 0 4px; font-size: 0.95rem; font-weight: var(--w-bold); color: var(--text-1);">${ctx.locale === "en" ? "Sovereign Privacy & Explicit Consent" : "الخصوصية السيادية والموافقة الصريحة"}</h4>
                      <p style="margin: 0 0 10px; font-size: 0.78rem; color: var(--text-muted); line-height: 1.5;">${ctx.locale === "en" ? "In compliance with Egypt Law 151/2020 & GDPR, we respect your rights. No non-essential cookies or analytics are executed without your explicit choice." : "التزاماً بالقانون 151 لسنة 2020 ولائحة GDPR، نحترم سيادتك الرقمية. لا يتم تشغيل أي أدوات أو كوكيز غير ضرورية دون موافقتك الصريحة المستقلة."}</p>
                      <div class="raqib-consent-toggles">
                        <label class="raqib-toggle-pill active"><input type="checkbox" checked disabled> <span>🔒 ${ctx.locale === "en" ? "Essential (Always Active)" : "الضرورية (مفعلة دائماً)"}</span></label>
                        <label class="raqib-toggle-pill"><input type="checkbox" id="chk-consent-pref" checked> <span>⚙️ ${ctx.locale === "en" ? "Preferences" : "التفضيلات"}</span></label>
                        <label class="raqib-toggle-pill"><input type="checkbox" id="chk-consent-telemetry"> <span>📈 ${ctx.locale === "en" ? "Edge Telemetry (0-PII)" : "القياس المجهول (0-PII)"}</span></label>
                      </div>
                    </div>
                    <div class="raqib-consent-actions">
                      <button type="button" class="btn btn--primary btn--xs" id="btn-demo-consent-accept"><span>${ctx.locale === "en" ? "Accept Selection" : "حفظ والموافقة"}</span></button>
                      <button type="button" class="btn btn--ghost btn--xs" id="btn-demo-consent-essential"><span>${ctx.locale === "en" ? "Essential Only" : "الضرورية فقط"}</span></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Code Output for Sovereign Consent Bar -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <h4 style="font-size: 0.95rem; font-weight: var(--w-bold); color: var(--text-1); margin: 0;">${ctx.locale === "en" ? "Pure 0KB Zero-Tracker HTML/JS Snippet (Copy & Paste)" : "كود التضمين السيادي الخفيف (انسخ والصق في موقعك)"}</h4>
                <button type="button" class="btn btn--ghost btn--xs" id="btn-copy-consent-code"><span>📋 ${ctx.locale === "en" ? "Copy Snippet" : "نسخ الكود"}</span></button>
              </div>
              <pre class="raqib-code-pre mono" id="raqib-consent-code" dir="ltr" style="font-size: 0.78rem; max-height: 280px; overflow-y: auto;"></pre>
            </div>
          </div>
        </div>

        <!-- View 4: Institutional Readiness Diagnostic Quiz -->
        <div class="raqib-module-view" id="raqib-view-readiness" style="display: none;">
          <div class="raqib-console-card rv" style="margin-block-end: 2rem;">
            <div class="raqib-console-head">
              <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                <span class="chip chip--gold"><span class="dot dot--live"></span>${ctx.locale === "en" ? "INSTITUTIONAL GOVERNANCE AUDIT" : "فحص الحوكمة المؤسسية والجاهزية"}</span>
                <span class="chip chip--accent">${ctx.locale === "en" ? "EGYPT PDPL / SAUDI NDMO" : "القانون المصري 151 / النظام السعودي"}</span>
              </div>
              <span class="mono" style="font-size: 0.75rem; color: var(--text-muted);">${ctx.locale === "en" ? "Statutory Gap Assessment" : "تقييم الفجوات التشريعية"}</span>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <h3 style="font-size: 1.25rem; font-weight: var(--w-bold); color: var(--text-1); margin: 0 0 0.5rem;">${s.raqib ? s.raqib.readiness_h : "مقياس الجاهزية التشريعية المؤسسية السريع"}</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin: 0;">${s.raqib ? s.raqib.readiness_desc : "تقييم تشريعي فوري مكون من 5 أسئلة استراتيجية يقيس مدى استيفاء منشأتك لاشتراطات التراخيص وسجلات المعالجة وتعيين مسؤول حماية البيانات."}</p>
            </div>

            <div class="raqib-readiness-layout">
              <!-- Questions Check List -->
              <div class="raqib-readiness-questions">
                <div class="raqib-question-card" data-q="dpo">
                  <div class="raqib-q-head">
                    <label class="raqib-switch">
                      <input type="checkbox" id="q-readiness-1" checked>
                      <span class="raqib-slider"></span>
                    </label>
                    <div style="flex: 1;">
                      <h4 class="raqib-q-title">${ctx.locale === "en" ? "1. Appointed & Registered Data Protection Officer (DPO)" : "1. تعيين وتسجيل مسؤول حماية بيانات رسمي (DPO)"}</h4>
                      <p class="raqib-q-desc">${ctx.locale === "en" ? "Statutory requirement under Egypt Law 151/2020 Art. 12 & Saudi PDPL Art. 30. Penalty: fine up to 1,000,000 EGP." : "إلزام قانوني بموجب المادة 12 من القانون 151 لسنة 2020 والمادة 30 من النظام السعودي. العقوبة: غرامة تصل إلى مليون جنيه."}</p>
                    </div>
                  </div>
                </div>

                <div class="raqib-question-card" data-q="ropa">
                  <div class="raqib-q-head">
                    <label class="raqib-switch">
                      <input type="checkbox" id="q-readiness-2" checked>
                      <span class="raqib-slider"></span>
                    </label>
                    <div style="flex: 1;">
                      <h4 class="raqib-q-title">${ctx.locale === "en" ? "2. Documented Record of Processing Activities (RoPA)" : "2. توثيق سجل رسمي لأنشطة المعالجة (RoPA)"}</h4>
                      <p class="raqib-q-desc">${ctx.locale === "en" ? "Statutory requirement under Art. 8. Must catalog all data flows, retention periods, and lawful basis." : "إلزام بموجب المادة 8 بحصر وتوثيق مسارات تدفق البيانات وفترات الاحتفاظ والسند القانوني لكل معالجة."}</p>
                    </div>
                  </div>
                </div>

                <div class="raqib-question-card" data-q="transfer">
                  <div class="raqib-q-head">
                    <label class="raqib-switch">
                      <input type="checkbox" id="q-readiness-3">
                      <span class="raqib-slider"></span>
                    </label>
                    <div style="flex: 1;">
                      <h4 class="raqib-q-title">${ctx.locale === "en" ? "3. Cross-Border Data Transfer Licensing & Approval" : "3. ترخيص نقل البيانات الشخصية وتخزينها عبر الحدود"}</h4>
                      <p class="raqib-q-desc">${ctx.locale === "en" ? "Statutory requirement under Art. 14 & 15. Prohibits cross-border hosting without Center license. Penalty: criminal liability + 5,000,000 EGP." : "حظر نقل أو استضافة البيانات خارج القطر دون تصريح من مركز حماية البيانات (المادتان 14 و 15). العقوبة: مساءلة جنائية وغرامة حتى 5 ملايين جنيه."}</p>
                    </div>
                  </div>
                </div>

                <div class="raqib-question-card" data-q="dsr">
                  <div class="raqib-q-head">
                    <label class="raqib-switch">
                      <input type="checkbox" id="q-readiness-4" checked>
                      <span class="raqib-slider"></span>
                    </label>
                    <div style="flex: 1;">
                      <h4 class="raqib-q-title">${ctx.locale === "en" ? "4. Data Subject Rights (DSR) Intake & 6-Day SLA Workflow" : "4. بروتوكول تلبية حقوق أصحاب البيانات (الوصول والمحو) خلال 6 أيام عمل"}</h4>
                      <p class="raqib-q-desc">${ctx.locale === "en" ? "Statutory requirement under Art. 13. Data subjects have legal rights to access, rectify, or erase personal data." : "المادة 13 توجب إتاحة آلية ميسرة للمواطن للوصول لبياناته أو تصحيحها أو محوها، والرد الإلزامي خلال 6 أيام عمل."}</p>
                    </div>
                  </div>
                </div>

                <div class="raqib-question-card" data-q="dpa">
                  <div class="raqib-q-head">
                    <label class="raqib-switch">
                      <input type="checkbox" id="q-readiness-5">
                      <span class="raqib-slider"></span>
                    </label>
                    <div style="flex: 1;">
                      <h4 class="raqib-q-title">${ctx.locale === "en" ? "5. Vendor Data Processing Agreements (DPA) & Privacy Audits" : "5. توقيع عقود معالجة بيانات (DPA) مع الموردين وإجراء تقييم الأثر (DPIA)"}</h4>
                      <p class="raqib-q-desc">${ctx.locale === "en" ? "Statutory requirement under Art. 7 & 12. Controllers must bind cloud/SaaS processors by written sovereign contracts." : "التزام قانوني بإلزام كافة مزودي الخدمات وموردي السحابة باتفاقيات حماية بيانات مكتوبة ومطابقة للقانون."}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Readiness Score Panel -->
              <div class="raqib-readiness-score-panel">
                <div class="raqib-score-badge" id="raqib-readiness-gauge">60%</div>
                <div style="margin-top: 10px; text-align: center;">
                  <div style="font-size: 0.72rem; color: var(--text-muted);">${ctx.locale === "en" ? "Institutional Readiness Index" : "مؤشر الجاهزية التشريعية المؤسسية"}</div>
                  <div class="mono" id="raqib-readiness-val" style="font-size: 1.6rem; font-weight: var(--w-bold); color: var(--gold, #D4AF37);">60 / 100</div>
                  <span class="badge" id="raqib-readiness-badge" style="margin-top: 4px;">${ctx.locale === "en" ? "Partial Readiness · Gaps Identified" : "جاهزية جزئية · تتطلب سد ثغرات"}</span>
                </div>
                <div class="raqib-readiness-actions" style="margin-top: 1.25rem; width: 100%;">
                  <button type="button" class="btn btn--outline btn--sm" id="btn-export-readiness-cert" style="width: 100%;">
                    <span>📥 ${ctx.locale === "en" ? "Export Readiness Roadmap (JSON)" : "تصدير خارطة طريق الامتثال (JSON)"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
<!-- Comparison Table: Awalim Raqib vs withraqib.com -->
        <div class="raqib-comparison-card rv" style="margin-block-start: 2rem; margin-block-end: 2.5rem;">
          <div style="margin-bottom: 1rem;">
            <span class="chip chip--gold" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${ctx.locale === "en" ? "TECHNICAL COMPARISON" : "المقارنة التقنية العالمية"}</span>
            <h3 style="font-size: 1.15rem; font-weight: var(--w-bold); margin: 0; color: var(--text-1);">
              ${s.raqib ? s.raqib.comparison_title : (ctx.locale === "en" ? "Why Awalim Raqib Outperforms Traditional Scanners" : "لماذا رَقيب عوالِم هو الأقوى والأشمل في العالم؟")}
            </h3>
          </div>
          <div class="dash-table-wrap">
            <table class="dash-directives-table">
              <thead>
                <tr>
                  <th>${ctx.locale === "en" ? "Feature / Capability" : "المعيار والقدرة التقنية"}</th>
                  <th style="color: var(--gold, #D4AF37);">${ctx.locale === "en" ? "Awalim Raqib Sentinel" : "رَقيب عوالِم السيادي"}</th>
                  <th style="color: var(--text-muted);">${ctx.locale === "en" ? "Traditional Tools (withraqib.com)" : "الأدوات التقليدية (withraqib.com)"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>${ctx.locale === "en" ? "Legal Compliance Frameworks" : "الأطر التشريعية المعتمدة"}</b></td>
                  <td><span class="badge badge--ok">${ctx.locale === "en" ? "Egypt PDPL + Saudi PDPL + UAE + GDPR" : "القانون المصري 151 + السعودي + الإماراتي + GDPR"}</span></td>
                  <td><span class="chip chip--sm">${ctx.locale === "en" ? "Egypt PDPL Only" : "القانون المصري فقط"}</span></td>
                </tr>
                <tr>
                  <td><b>${ctx.locale === "en" ? "External Trackers & Surveillance" : "المتعقبات وتسريب البيانات"}</b></td>
                  <td><span class="badge badge--ok">${ctx.locale === "en" ? "0KB Trackers · 0 Cookies · Complete Privacy" : "صفر متعقبات · صفر كوكيز · خصوصية مطلقة"}</span></td>
                  <td><span class="chip chip--danger">${ctx.locale === "en" ? "Uses Meta Pixel & Cloudflare Tracking" : "يستخدم Meta Pixel ومتعقبات إعلانية"}</span></td>
                </tr>
                <tr>
                  <td><b>${ctx.locale === "en" ? "Audit Performance & Latency" : "سرعة الفحص والأداء"}</b></td>
                  <td><span class="badge badge--ok mono">${ctx.locale === "en" ? "Sub-16ms Client/Edge Engine" : "استجابة تحت 16ms على الحافة والمتصفح"}</span></td>
                  <td><span class="chip chip--sm mono">${ctx.locale === "en" ? "Multi-minute Server Queues" : "قوائم انتظار وبطء خادم مركزي"}</span></td>
                </tr>
                <tr>
                  <td><b>${ctx.locale === "en" ? "Security Architecture" : "بنية الأمان السيبراني"}</b></td>
                  <td><span class="badge badge--ok">${ctx.locale === "en" ? "Strict CSP Level 3 + Trusted Types + Ed25519" : "حماية صارمة CSP L3 + Trusted Types + Ed25519"}</span></td>
                  <td><span class="chip chip--sm">${ctx.locale === "en" ? "Standard React SPA" : "تطبيق React قياسي غير مدعم بتشفير جذري"}</span></td>
                </tr>
                <tr>
                  <td><b>${ctx.locale === "en" ? "Actionable Remediation" : "حلول المعالجة البرمجية"}</b></td>
                  <td><span class="badge badge--ok">${ctx.locale === "en" ? "Instant 1-Click Code (Nginx/Cloudflare/Node)" : "كود جاهز فوراً لـ Nginx وCloudflare وNode"}</span></td>
                  <td><span class="chip chip--sm">${ctx.locale === "en" ? "Generic Text Descriptions" : "إرشادات نصية عامة خلف اشتراك مدفوع"}</span></td>
                </tr>
                <tr>
                  <td><b>${ctx.locale === "en" ? "Cryptographic Report Proof" : "التوثيق التشفيري للتقرير"}</b></td>
                  <td><span class="badge badge--ok mono">${ctx.locale === "en" ? "SHA-256 WebCrypto Hash Verification" : "توثيق مشفر ببصمة SHA-256 WebCrypto"}</span></td>
                  <td><span class="chip chip--sm">${ctx.locale === "en" ? "Standard Unsigned PDF" : "ملف PDF تقليدي غير موثق تشفيرياً"}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>

    <section class="sec sec--tight" id="live">
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
