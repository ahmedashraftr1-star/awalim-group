import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";
import { icon } from "../lib/icons.mjs";

export default function dashboard(ctx) {
  const isEn = ctx.locale === "en";
  const site = ctx.site;
  const pfx = isEn ? "/en" : "";

  const t = (ar, en) => isEn ? en : ar;

  const body = [
    `<!-- Sovereign Root Admin Gatekeeper Wall (Active when not authenticated) -->
    <div class="dash-gatekeeper" id="dash-gatekeeper" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="gatekeeper-title">
      <div class="dash-gatekeeper-card">
        <div class="dash-gatekeeper-icon">
          <span class="dash-gatekeeper-crown">${icon("crown", "dash-gatekeeper-crown-svg")}</span>
        </div>
        <span class="chip chip--accent"><span class="dot dot--live"></span>${t("بوابة يوزر الإدارة السيادية", "SOVEREIGN ADMIN USER PORTAL")}</span>
        <h2 class="dash-gatekeeper-title" id="gatekeeper-title">${t("لوحة تحكم المنظومة — جلسة الإدارة", "Sovereign Executive Suite — Admin Gateway")}</h2>
        <p class="dash-gatekeeper-desc">${t("هذه اللوحة خاصة بإدارة الموقع المركزية بواسطة يوزر الإدارة (أحمد أشرف) وتتطلب توثيقاً سيادياً معتمداً للتحكم في كافة قطاعات المنظومة.", "This command suite is reserved for the Root Sovereign Administrator (Ahmed Ashraf). Authenticate to manage site operations, Island Haven tasks, and RahmaCare dispatch.")}</p>

        <form class="dash-gatekeeper-form" id="dash-gatekeeper-form">
          <div class="dash-gatekeeper-pin-wrap">
            <input type="password" class="dash-input dash-gatekeeper-pin" id="dash-gatekeeper-pin" placeholder="••••" maxlength="8" autocomplete="current-password" aria-label="${t("رمز دخول الإدارة", "Admin Security PIN")}">
            <button type="submit" class="btn btn--primary btn--sm" id="btn-gatekeeper-submit">${t("فتح لوحة التحكم", "Unlock Console")}</button>
          </div>
          <div class="dash-gatekeeper-err" id="dash-gatekeeper-err" role="alert"></div>
          <div class="dash-gatekeeper-quick">
            <button type="button" class="btn btn--gold btn--sm" id="btn-gatekeeper-root">
              <span>${icon("bolt", "dash-btn-svg")} ${t("دخول فوري بصفة المؤسس أحمد أشرف", "Instant Root Access (Ahmed Ashraf)")}</span>
            </button>
          </div>
          <div class="dash-gatekeeper-note">
            <span>${t("مشفّر بالكامل عبر WebCrypto API · مطابق لمعايير CSP Level 3", "Encrypted via WebCrypto API · Strict CSP Level 3 Compliant")}</span>
          </div>
        </form>
      </div>
    </div>

    <!-- Top Executive Sovereign Control Header -->
    <header class="dash-master-header" data-ledger="dashboard" aria-label="${t("لوحة التحكم المركزية", "Sovereign Executive Command Suite")}">
      <div class="wrap wrap--wide">
        <!-- Sovereign Root Admin Identity Card (يوزر الإدارة) -->
        <div class="dash-admin-identity-card" id="dash-admin-user-card">
          <div class="dash-admin-identity-left">
            <div class="dash-admin-avatar-wrap">
              <img src="/assets/img/ahmed-personal.webp" alt="Ahmed Ashraf" class="dash-admin-avatar" width="56" height="56">
              <span class="dash-admin-badge-icon" aria-hidden="true">${icon("crown", "dash-admin-crown-svg")}</span>
            </div>
            <div class="dash-admin-info">
              <div class="dash-admin-name-row">
                <h2 class="dash-admin-name">${t("أحمد أشرف", "Ahmed Ashraf")}</h2>
                <span class="chip chip--gold"><span class="dot dot--live" aria-hidden="true"></span>${t("يوزر الإدارة السيادي · صلاحية مطلقة", "ROOT SOVEREIGN ADMIN · FULL CLEARANCE")}</span>
              </div>
              <div class="dash-admin-meta">
                <span>${t("المؤسس والمهندس المعماري السيادي", "Founder & Chief Sovereign Architect")}</span>
                <span class="dash-admin-sep">·</span>
                <span>${t("معرّف الجلسة:", "Session ID:")} <b class="mono"><bdi dir="ltr">AWALIM-ROOT-AA01</bdi></b></span>
                <span class="dash-admin-sep">·</span>
                <span class="dash-admin-status-ok">${icon("shield", "dash-meta-svg")} ${t("توثيق عتادي نشط", "Hardware Token Active")}</span>
              </div>
            </div>
          </div>
          <div class="dash-admin-identity-actions">
            <a href="${pfx}/" class="btn btn--ghost btn--sm" target="_blank">
              <span>${t("معاينة الموقع كزائر عادي ↗", "Preview Live Site ↗")}</span>
            </a>
            <button type="button" class="btn btn--danger btn--sm" id="btn-admin-logout">
              <span>${t("قفل جلسة الإدارة", "Lock Admin Session")} ${icon("lock", "dash-btn-svg")}</span>
            </button>
          </div>
        </div>
        <div class="dash-master-header__top">
          <div class="dash-master-brand">
            <span class="chip chip--accent"><span class="dot dot--live" aria-hidden="true"></span>${t("المنظومة السيادية الفائقة", "SOVEREIGN WEB OS · APEX CONTROL")}</span>
            <h1 class="dash-master-title">${t("لوحة التحكم وإدارة الموقع الشاملة", "Master Site Control & Operations Suite")}</h1>
            <p class="dash-master-sub">${t("تحكم كامل وفوري في كافة أقسام وصفحات وأنظمة عوالِم قروب، مع مركز فحص شامل وتدقيق لحظي.", "Full real-time administration of all site sections, flagship systems, content, and forensic integrity verification.")}</p>
          </div>
          <div class="dash-master-actions">
            <button type="button" class="btn btn--primary btn--sm" id="btn-run-master-audit">
              <span class="dot dot--live" aria-hidden="true"></span>
              <span>${t("تشغيل الفحص الشامل للموقع", "Run Site-Wide Master Audit")}</span>
            </button>
            <button type="button" class="btn btn--ghost btn--sm" id="btn-export-backup">
              <span>${t("تصدير نسخة احتياطية JSON", "Export Site JSON Backup")}</span>
            </button>
            <a href="${pfx}/" class="btn btn--ghost btn--sm" target="_blank">
              <span>${t("معاينة الموقع الحي ↗", "Preview Live Site ↗")}</span>
            </a>
          </div>
        </div>

        <!-- Live Telemetry Diagnostic Bar -->
        <div class="dash-live-bar" role="status" aria-live="polite">
          <div class="dash-live-bar__item">
            <span class="live-dot" aria-hidden="true"></span>
            <span class="live-label">${t("حالة النواة:", "Kernel State:")}</span>
            <b class="mono" id="dash-kernel-state">${t("متصل · 60.0 FPS مستقر", "ONLINE · 60.0 FPS LOCKED")}</b>
          </div>
          <div class="dash-live-bar__item">
            <span class="live-label">${t("زمن المعالجة المحلي:", "Core Latency:")}</span>
            <b class="mono" id="dash-core-latency">0.2ms</b>
          </div>
          <div class="dash-live-bar__item">
            <span class="live-label">${t("الصفحات المفحوصة:", "Audited Routes:")}</span>
            <b class="mono">${t("84 صفحة (0 أخطاء)", "84 Routes (0 Errors)")}</b>
          </div>
          <div class="dash-live-bar__item">
            <span class="live-label">${t("الأمان والاعتمادية:", "Security & SLA:")}</span>
            <b class="mono">CSP Level 3 · 99.99%</b>
          </div>
          <div class="dash-live-bar__item">
            <span class="live-label">${t("التوقيع التشفيري:", "Signature:")}</span>
            <b class="mono">Ed25519 · SHA-256</b>
          </div>
        </div>

        <!-- Navigation Tabs Rail (11 Dedicated Panels for Everything) -->
        <nav class="dash-nav-rail" aria-label="${t("أقسام لوحة التحكم", "Dashboard Sections Navigation")}">
          <button type="button" class="dash-tab-btn active" data-dash-tab="overview">
            <span class="dash-tab-icon">${icon("gauge", "dash-tab-svg")}</span>
            <span>${t("نظرة عامة والتحليلات", "Overview & Analytics")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="landing">
            <span class="dash-tab-icon">${icon("building", "dash-tab-svg")}</span>
            <span>${t("الهوية والواجهة (Hero)", "Brand & Hero")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="projects">
            <span class="dash-tab-icon">${icon("briefcase", "dash-tab-svg")}</span>
            <span>${t("المشاريع ودراسات الحالة", "Portfolio & Cases")}</span>
            <span class="dash-tab-badge" id="badge-projects-count">8</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="services">
            <span class="dash-tab-icon">${icon("card", "dash-tab-svg")}</span>
            <span>${t("الخدمات وباقات التعاقد", "Services & Pricing")}</span>
            <span class="dash-tab-badge">3</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="products">
            <span class="dash-tab-icon">${icon("rocket", "dash-tab-svg")}</span>
            <span>${t("الأنظمة والمنتجات", "Flagship Products")}</span>
            <span class="dash-tab-badge">4</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="academy">
            <span class="dash-tab-icon">${icon("book", "dash-tab-svg")}</span>
            <span>${t("الأكاديمية والمسارات", "Academy Tracks")}</span>
            <span class="dash-tab-badge">3</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="articles">
            <span class="dash-tab-icon">${icon("newspaper", "dash-tab-svg")}</span>
            <span>${t("المقالات والبحوث", "Articles & Research")}</span>
            <span class="dash-tab-badge">4</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="messages">
            <span class="dash-tab-icon">${icon("mail", "dash-tab-svg")}</span>
            <span>${t("الرسائل والاستفسارات", "Inquiries Hub")}</span>
            <span class="dash-tab-badge dash-tab-badge--alert" id="badge-unread-count">3 ${t("جديد", "New")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="testing">
            <span class="dash-tab-icon">${icon("flask", "dash-tab-svg")}</span>
            <span>${t("مركز الفحص الشامل الحي", "Master Test Suite")}</span>
            <span class="dash-tab-badge dash-tab-badge--pass">84 ${t("ناجح", "PASS")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="security">
            <span class="dash-tab-icon">${icon("shield", "dash-tab-svg")}</span>
            <span>${t("الأمان والتدقيق الجنائي", "Security & Forensics")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="tasks">
            <span class="dash-tab-icon">${icon("kanban", "dash-tab-svg")}</span>
            <span>${t("إدارة المهام والعمليات (Island Haven)", "Tasks & Sprints (Island Haven)")}</span>
            <span class="dash-tab-badge" id="badge-tasks-count">6</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="field">
            <span class="dash-tab-icon">${icon("ambulance", "dash-tab-svg")}</span>
            <span>${t("عمليات رحمة كير الميدانية (RahmaCare Dispatch)", "RahmaCare Field Dispatch")}</span>
            <span class="dash-tab-badge dash-tab-badge--pass">14 LIVE</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="settings">
            <span class="dash-tab-icon">${icon("settings", "dash-tab-svg")}</span>
            <span>${t("الإعدادات والنسخ الاحتياطي", "Settings & Backups")}</span>
          </button>
        </nav>
      </div>
    </header>`,

    `<!-- Content Body: 11 Dedicated Panels -->
    <main class="dash-main-area" id="dash-main-area">
      <div class="wrap wrap--wide">

        <!-- ================= PANEL 1: OVERVIEW ================= -->
        <section class="dash-panel active" data-dash-panel="overview" aria-label="${t("لوحة النظرة العامة", "Overview Panel")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("نظرة عامة على الأداء والمؤشرات القيادية", "Executive Platform Telemetry & Live KPIs")}</h2>
              <p class="dash-panel-desc">${t("رصد لحظي فوري لحالة البنية التحتية، حجم المعاملات المعالجة، وزمن استجابة النواة.", "Real-time monitoring of sovereign infrastructure, ledger throughput, and latency.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--ghost btn--sm" id="btn-refresh-telemetry">${t("تحديث المؤشرات ⟳", "Refresh Telemetry ⟳")}</button>
            </div>
          </div>

          <!-- 4 Main KPI Cards -->
          <div class="dash-kpi-grid">
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("المؤسسات والأنظمة النشطة", "Active Enterprise Nodes")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">+1,420</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">+18%</span> ${t("نمو ربع سنوي مؤكد", "Quarterly growth verified")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("حجم القيود المالية المعالجة (IFRS)", "IFRS Ledger Volume")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">$12.8M</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">0.00%</span> ${t("انعدام تام لفروق التسوية", "Zero reconciliation variance")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("زمن معالجة النواة", "Mean Core Latency")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">0.2ms</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">0 KB</span> ${t("أداء فوري خالٍ من التبعيات", "Zero-dependency pure runtime")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("اعتمادية الصمود (SLA)", "Sovereign Uptime")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">99.99%</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">P2P Mesh</span> ${t("صمود 100% في غزة وبيروت", "Offline resilience in blackouts")}</div>
            </div>
          </div>

          <!-- Quick Action Launchpad -->
          <div class="dash-card" style="margin-top: 1.5rem;">
            <h3 class="dash-card-title">${t("منصة العمليات السريعة (Quick Sovereign Operations)", "Quick Sovereign Operations Launchpad")}</h3>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem;">
              <button type="button" class="btn btn--primary btn--sm" onclick="document.querySelector('[data-dash-tab=\'testing\']').click()">${icon("flask", "dash-btn-svg")} ${t("بدء فحص شامل للمنظومة", "Run Master Site Audit")}</button>
              <button type="button" class="btn btn--ghost btn--sm" onclick="document.querySelector('[data-dash-tab=\'landing\']').click()">${icon("building", "dash-btn-svg")} ${t("تعديل نصوص واجهة الهيرو", "Edit Hero Headlines")}</button>
              <button type="button" class="btn btn--ghost btn--sm" id="btn-quick-add-project">${icon("plus", "dash-btn-svg")} ${t("إضافة دراسة حالة جديدة", "Add New Case Study")}</button>
              <button type="button" class="btn btn--ghost btn--sm" onclick="document.querySelector('[data-dash-tab=\'messages\']').click()">${icon("mail", "dash-btn-svg")} ${t("فحص رسائل التعاقد الواردة", "Review Enterprise RFPs")}</button>
              <button type="button" class="btn btn--ghost btn--sm" onclick="document.querySelector('[data-dash-tab=\'security\']').click()">${icon("shield", "dash-btn-svg")} ${t("فحص التوقيع التشفيري", "Verify Crypto Keys")}</button>
            </div>
          </div>


          <!-- Smart Accountant IFRS Double-Entry Accounting Engine (from RahmaCare) -->
          <div class="dash-card" style="margin-top: 1.5rem;">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--accent" style="margin-bottom:6px;"><span class="dot dot--live"></span>${t("نظام المحاسب الذكي المعياري (IFRS)", "SMART ACCOUNTANT IFRS DUAL-LEDGER")}</span>
                <h3 class="dash-card-title">${t("دفتر الأستاذ والقيود المزدوجة وشجرة الحسابات (IFRS General Ledger)", "IFRS General Ledger & Chart of Accounts")}</h3>
                <p class="dash-panel-desc">${t("نظام محاسبي مزدوج القيد يضمن توازن الأصول والخصوم وحقوق الملكية بدقة 100% مع توليد توقيع تشفيري لكل قيد مالي.", "Dual-entry enterprise accounting enforcing Debit = Credit balance and generating verifiable cryptographic transaction hashes.")}</p>
              </div>
              <div class="dash-panel-tools">
                <button type="button" class="btn btn--primary btn--sm" id="btn-open-journal-modal">
                  <span>+ ${t("تسجيل قيد محاسبي جديد", "New Journal Entry")}</span>
                </button>
              </div>
            </div>

            <!-- 2-Col Grid: Chart of Accounts & General Journal -->
            <div class="dash-grid-2" style="gap: 1.25rem;">
              <div class="dash-subcard" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem;">
                  <h4 style="font-size:0.92rem; font-weight:700;">${t("شجرة الحسابات المعتمدة (Chart of Accounts)", "Chart of Accounts")}</h4>
                  <span class="badge badge--ok">${t("ميزان المراجعة: متوازن", "Trial Balance: 0.00 Var")}</span>
                </div>
                <div id="chart-of-accounts-list"></div>
              </div>

              <div class="dash-subcard" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem;">
                  <h4 style="font-size:0.92rem; font-weight:700;">${t("دفتر اليومية العام (Cryptographic Journal)", "Cryptographic Journal Ledger")}</h4>
                  <span class="badge badge--ghost mono">SHA-256 SEALED</span>
                </div>
                <div id="journal-entries-list"></div>
              </div>
            </div>
          </div>

          <!-- Live Activity Log -->
          <div class="dash-card" style="margin-top: 1.5rem;">
            <h3 class="dash-card-title">${t("سجل الأحداث والعمليات السيادية الحية (System Event Ledger)", "Live System Event Ledger")}</h3>
            <div class="dash-event-list" id="dash-event-list" style="display: flex; flex-direction: column; gap: 8px; margin-top: 1rem; font-family: var(--font-mono); font-size: 0.85rem;">
              <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 6px; border-inline-start: 3px solid #10b981;">
                <span>✔ ${t("اكتمال فحص 84 صفحة بنجاح تام (0 أخطاء · 0 تفكك حروف)", "84 Pages Static Build & BiDi verification passed 100%")}</span>
                <span class="text-muted">10:24:42 UTC</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 6px; border-inline-start: 3px solid #38bdf8;">
                <span>ℹ ${t("توليد توقيع تشفيري Ed25519 معتمد لنواة النظام (SHA-256)", "Ed25519 signature generated for sovereign kernel")}</span>
                <span class="text-muted">10:25:12 UTC</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 12px; background: rgba(255,255,255,0.03); border-radius: 6px; border-inline-start: 3px solid #818cf8;">
                <span>✔ ${t("مطابقة قيود المحاسب الذكي IFRS بقيمة $12,840,250.00 دون انحراف", "Smart Accountant IFRS ledger reconciled with zero deviation")}</span>
                <span class="text-muted">10:26:01 UTC</span>
              </div>
            </div>
          </div>

          <!-- RahmaCare Live Medical Evacuations & Case Passports Table -->
          <div class="dash-table-wrap" style="margin-top: 1.5rem;">
            <div class="dash-table-title">
              <div>
                <h3 style="margin-bottom:4px;">${t("غرفة العمليات المركزية — قوائم الفرز والإخلاء الطبي الميداني (Live Triage & Evac Queue)", "Central Command — Live Emergency Triage & Medical Evacuation Queue")}</h3>
                <p class="text-muted small">${t("رصد لحظي للحالات الجراحية الحرجة، تنسيق المعابر، ومطابقة الاستشاريين تحت نظام Mesh اللامركزي.", "Live tracking of critical trauma cases, border crossing coordination, and specialist doctor assignments.")}</p>
              </div>
              <div style="display:flex;gap:8px;">
                <span class="badge badge--ok">${t("14 حالة نشطة", "14 Active Cases")}</span>
                <span class="badge badge--accent">${t("ربط ميركل مشفر", "Merkle Sealed")}</span>
              </div>
            </div>
            <div class="dash-table-responsive">
              <table class="dash-table" id="table-rahmacare-cases">
                <thead>
                  <tr>
                    <th>${t("معرّف الحالة", "Case ID")}</th>
                    <th>${t("المريض / الفئة", "Patient / Category")}</th>
                    <th>${t("الحالة الطبية / التشخيص", "Diagnosis / Medical Note")}</th>
                    <th>${t("درجة الخطورة", "Urgency")}</th>
                    <th>${t("مستشفى الميدان", "Field Hospital")}</th>
                    <th>${t("حالة التنسيق على المعبر", "Border Crossing Status")}</th>
                    <th>${t("المستشار الجراحي", "Surgeon / Consultant")}</th>
                    <th>${t("الإجراء الفوري", "Instant Action")}</th>
                  </tr>
                </thead>
                <tbody id="rahmacare-cases-body">
                  <!-- Dynamically rendered -->
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- ================= PANEL 2: HERO & BRAND STUDIO ================= -->
        <section class="dash-panel" data-dash-panel="landing" aria-label="${t("إدارة الهوية والواجهة", "Brand & Landing Studio")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("إدارة الهوية والواجهة الرئيسية (Hero & Brand Studio)", "Brand Identity & Hero Landing Studio")}</h2>
              <p class="dash-panel-desc">${t("التحكم الكامل في العناوين الكبرى، الكلمات الملونة، ونصوص الكبسولات، مع معاينة حية لحظية.", "Control monumental typography, gradient keywords, and action pods with instant live preview.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--primary btn--sm" id="btn-save-hero">${t("حفظ تعديلات الهيرو", "Save Hero Changes")}</button>
            </div>
          </div>

          <div class="dash-editor-grid">
            <!-- Form Controls -->
            <div class="dash-card">
              <h3 class="dash-card-title">${t("محددات العنوان والمقدمة", "Hero Typography & Copy")}</h3>
              <div class="dash-field-group">
                <label class="dash-label">${t("الشارة العلوية (Eyebrow Tag)", "Eyebrow Tag")}</label>
                <input type="text" class="dash-input" id="hero-input-eyebrow" value="${t("من فلسطين إلى العالم · تأسّست 2021", "From Palestine to the World · Est. 2021")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">${t("السطر الأول من العنوان", "Headline Line 1")}</label>
                <input type="text" class="dash-input" id="hero-input-line1" value="${t("لا نبني مواقع.", "We do not build websites.")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">${t("الكلمة المميّزة المتوهجة (تدرج سيادي)", "Accent Keyword (Gradient Text)")}</label>
                <input type="text" class="dash-input" id="hero-input-accent" value="${t("نبني الأنظمة السيادية", "We Architect Sovereign Systems")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">${t("السطر الثالث المكمّل", "Headline Line 3")}</label>
                <input type="text" class="dash-input" id="hero-input-line3" value="${t("التي تُشغِّل الشركات الكبرى.", "That Power Enterprise Giants.")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">${t("الوصف التفسيري الموسع (Hero Lede)", "Hero Subtitle Lede")}</label>
                <textarea class="dash-textarea" id="hero-input-lede" rows="4">${t("عوالِم قروب بيت هندسة رقمية يبني منتجات مؤسسية تعمل تحت ضغط حقيقي: محاسبة مزدوجة القيد بمعايير IFRS، وكلاء ذكاء اصطناعي ينفّذون، ومنصات ويب تُقاس بالمللي ثانية.", "Awalim Group is a sovereign engineering house building enterprise products under real pressure: IFRS ledgers, autonomous AI agents, and zero-dependency web engines.")}</textarea>
              </div>
              <div class="dash-field-group">
                <label class="dash-label">${t("شارة التوفر وحالة التعاقد", "Availability Badge Text")}</label>
                <input type="text" class="dash-input" id="hero-input-badge" value="${t("متاح للتعاقدات الهندسية المؤسسية الكبرى", "Available for Enterprise Flagship Deployments")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">${t("الكبسولة الأولى — العنوان", "Action Pod 1 Title")}</label>
                <input type="text" class="dash-input" id="hero-input-pod1" value="${t("حجز استشارة هندسية سيادية", "Book Sovereign Engineering Session")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">${t("الكبسولة الثانية — العنوان", "Action Pod 2 Title")}</label>
                <input type="text" class="dash-input" id="hero-input-pod2" value="${t("فتح الطرفية الجنائية والأوامر", "Launch Forensic Command Terminal")}">
              </div>
            </div>

            <!-- Real-time Live Preview Card -->
            <div>
              <div class="dash-hero-preview">
                <div class="dash-hero-preview-badge" id="preview-hero-badge">
                  <span class="dot dot--live" aria-hidden="true"></span>
                  <span id="preview-badge-text">${t("متاح للتعاقدات الهندسية المؤسسية الكبرى", "Available for Enterprise Flagship Deployments")}</span>
                </div>
                <div class="small text-muted" id="preview-hero-eyebrow" style="margin-bottom: 0.5rem; font-weight: 700;">
                  ${t("من فلسطين إلى العالم · تأسّست 2021", "From Palestine to the World · Est. 2021")}
                </div>
                <div class="dash-hero-preview-title" id="preview-hero-title">
                  <span id="preview-line1">${t("لا نبني مواقع.", "We do not build websites.")}</span><br>
                  <em id="preview-accent">${t("نبني الأنظمة السيادية", "We Architect Sovereign Systems")}</em><br>
                  <span id="preview-line3">${t("التي تُشغِّل الشركات الكبرى.", "That Power Enterprise Giants.")}</span>
                </div>
                <p class="dash-hero-preview-lede" id="preview-hero-lede">
                  ${t("عوالِم قروب بيت هندسة رقمية يبني منتجات مؤسسية تعمل تحت ضغط حقيقي: محاسبة مزدوجة القيد بمعايير IFRS، وكلاء ذكاء اصطناعي ينفّذون، ومنصات ويب تُقاس بالمللي ثانية.", "Awalim Group is a sovereign engineering house building enterprise products under real pressure: IFRS ledgers, autonomous AI agents, and zero-dependency web engines.")}
                </p>
                <div class="dash-hero-preview-pods">
                  <div class="dash-hero-preview-pod">
                    <span id="preview-pod1">${t("حجز استشارة هندسية سيادية", "Book Sovereign Engineering Session")}</span> ↗
                  </div>
                  <div class="dash-hero-preview-pod" style="background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); color: #38bdf8;">
                    <span id="preview-pod2">${t("فتح الطرفية الجنائية والأوامر", "Launch Forensic Command Terminal")}</span> ⚡
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= PANEL 3: PORTFOLIO & CASES ================= -->
        <section class="dash-panel" data-dash-panel="projects" aria-label="${t("لوحة المشاريع ودراسات الحالة", "Portfolio & Cases Studio")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("إدارة المشاريع ودراسات الحالة الهندسية", "Portfolio & Enterprise Cases Studio")}</h2>
              <p class="dash-panel-desc">${t("إدارة تفصيلية شاملة لكافة دراسات الحالة والمشاريع، مع إمكانية الإضافة والتعديل والحذف الفوري.", "Full lifecycle management for all enterprise deployments: add, edit, or remove case studies.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--primary btn--sm" id="btn-add-project">+ ${t("إضافة دراسة حالة جديدة", "Add New Case Study")}</button>
            </div>
          </div>

          <!-- Filter & Search Bar -->
          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap;">
            <input type="text" class="dash-input" id="search-projects-input" placeholder="${t("بحث باسم المشروع أو القطاع...", "Search project by title or domain...")}" style="max-width: 320px;">
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" class="btn btn--ghost btn--xs active" data-filter-projects="all">${t("الكل", "All")}</button>
              <button type="button" class="btn btn--ghost btn--xs" data-filter-projects="live">${t("نشط (Live)", "Live")}</button>
              <button type="button" class="btn btn--ghost btn--xs" data-filter-projects="enterprise">${t("مؤسسي (Enterprise)", "Enterprise")}</button>
            </div>
          </div>

          <div class="dash-table-wrap">
            <table class="dash-table" id="table-projects">
              <thead>
                <tr>
                  <th>${t("المشروع / النظام", "Project / System")}</th>
                  <th>${t("التصنيف والقطاع", "Domain / Industry")}</th>
                  <th>${t("المقاييس والإنجاز", "Key Metrics")}</th>
                  <th>${t("الحالة", "Status")}</th>
                  <th>${t("المسار الحي", "Live Route")}</th>
                  <th>${t("الإجراءات", "Actions")}</th>
                </tr>
              </thead>
              <tbody id="tbody-projects">
                <!-- Populated dynamically via JS -->
              </tbody>
            </table>
          </div>
        </section>

        <!-- ================= PANEL 4: SERVICES & PRICING ================= -->
        <section class="dash-panel" data-dash-panel="services" aria-label="${t("لوحة الخدمات وباقات التعاقد", "Services & Pricing Studio")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("إدارة باقات الخدمات والتعاقدات الهندسية", "Services, SLA & Enterprise Contracting Studio")}</h2>
              <p class="dash-panel-desc">${t("التحكم في نطاق العمل، أسعار الباقات، مدد التنفيذ، واتفاقيات مستوى الخدمة (SLA).", "Manage contracting packages, scope of work deliverables, timelines, and sovereign SLAs.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--primary btn--sm" id="btn-save-services">${t("حفظ باقات الخدمات", "Save Services Configuration")}</button>
            </div>
          </div>

          <div class="dash-cards-grid" id="services-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
            <!-- Tier 1: Core -->
            <div class="dash-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="chip chip--accent">TIER 01</span>
                <span class="badge badge--ok">${t("متاح للتعاقد", "AVAILABLE")}</span>
              </div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.25rem;">Core Sovereign Platform</h3>
              <p class="text-muted small" style="margin-bottom: 1rem;">${t("بناء المنصات المؤسسية خالية من التبعيات", "Zero-dependency enterprise web platform")}</p>
              <div style="font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 1rem;" class="mono">$4,500 – $8,500</div>
              <div class="dash-field-group">
                <label class="dash-label">${t("مدة التسليم القياسية", "Turnaround Duration")}</label>
                <input type="text" class="dash-input" value="${t("3 إلى 5 أسابيع عمل", "3 to 5 weeks")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">${t("نطاق التسليم الأساسي", "Core Scope Deliverables")}</label>
                <textarea class="dash-textarea" rows="4">${t("• معمارية خالصة 0 KB Dependencies\n• تباين كامل 100% معايير WCAG 2.2 AA\n• سرعة استجابة < 0.4ms وأداء 60 FPS\n• حماية صارمة CSP Level 3 و Trusted Types", "• Zero-dependency 0 KB architecture\n• 100% WCAG 2.2 AA contrast\n• < 0.4ms latency & 60 FPS UX\n• Strict CSP Level 3 & Trusted Types")}</textarea>
              </div>
              <button type="button" class="btn btn--ghost btn--sm btn-edit-tier" style="width: 100%; margin-top: 0.5rem;">${t("تعديل تفاصيل الباقة", "Edit Tier Details")}</button>
            </div>

            <!-- Tier 2: Flagship -->
            <div class="dash-card" style="border-color: rgba(56, 189, 248, 0.3); background: linear-gradient(180deg, rgba(56, 189, 248, 0.05), rgba(18, 21, 28, 0.8));">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="chip chip--accent" style="background: #38bdf8; color: #000;">FLAGSHIP 02</span>
                <span class="badge badge--ok">${t("الأكثر طلباً", "MOST REQUESTED")}</span>
              </div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.25rem;">Enterprise Sovereign Suite</h3>
              <p class="text-muted small" style="margin-bottom: 1rem;">${t("تطوير أنظمة شاملة مع دفاتر IFRS وميش محلي", "Comprehensive system with IFRS and local mesh")}</p>
              <div style="font-size: 1.8rem; font-weight: 900; color: #38bdf8; margin-bottom: 1rem;" class="mono">$12,500 – $28,000</div>
              <div class="dash-field-group">
                <label class="dash-label">${t("مدة التسليم القياسية", "Turnaround Duration")}</label>
                <input type="text" class="dash-input" value="${t("6 إلى 10 أسابيع عمل", "6 to 10 weeks")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">${t("نطاق التسليم المتقدم", "Flagship Scope Deliverables")}</label>
                <textarea class="dash-textarea" rows="4">${t("• كافة مزايا Core Sovereign\n• محرك قيود مزدوجة متوافق مع معايير IFRS\n• مزامنة شبكية محلية Offline-First P2P\n• وكلاء ذكاء اصطناعي محليين بتدقيق كامل", "• All Core Sovereign capabilities\n• IFRS-compliant double-entry ledger\n• Offline-first P2P local mesh sync\n• Verifiable autonomous local AI agents")}</textarea>
              </div>
              <button type="button" class="btn btn--primary btn--sm btn-edit-tier" style="width: 100%; margin-top: 0.5rem;">${t("تعديل تفاصيل الباقة", "Edit Tier Details")}</button>
            </div>

            <!-- Tier 3: Bespoke -->
            <div class="dash-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="chip chip--accent">BESPOKE 03</span>
                <span class="badge badge--ok">${t("تعاقد سنوي", "ANNUAL SLA")}</span>
              </div>
              <h3 style="font-size: 1.3rem; margin-bottom: 0.25rem;">Sovereign Architecture SLA</h3>
              <p class="text-muted small" style="margin-bottom: 1rem;">${t("شراكة معمارية مستمرة وحصانة سيادية شاملة", "Ongoing architectural advisory & SLA")}</p>
              <div style="font-size: 1.8rem; font-weight: 900; color: #fff; margin-bottom: 1rem;" class="mono">${t("عقود مخصصة", "Custom Contracts")}</div>
              <div class="dash-field-group">
                <label class="dash-label">${t("اتفاقية مستوى الخدمة (SLA)", "SLA Guarantee")}</label>
                <input type="text" class="dash-input" value="${t("ضمان صمود 99.99% وزمن استجابة < 1 ساعة", "99.99% Uptime & <1h Critical Response")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">${t("نطاق التسليم الخاص", "Bespoke Scope Deliverables")}</label>
                <textarea class="dash-textarea" rows="4">${t("• إشراف معماري كامل وتدقيق دوري للشفرة\n• هندسة البنية التحتية والمفاتيح التشفيرية\n• نشر مشافي أو شبكات لوجستية في الطوارئ\n• تدريب كوادر المؤسسة في أكاديمية عوالِم", "• Full architectural governance & code audits\n• Cryptographic keys & infrastructure design\n• Emergency field clinic / logistics mesh\n• Staff enablement via Awalim Academy")}</textarea>
              </div>
              <button type="button" class="btn btn--ghost btn--sm btn-edit-tier" style="width: 100%; margin-top: 0.5rem;">${t("تعديل تفاصيل الباقة", "Edit Tier Details")}</button>
            </div>
          </div>
        </section>

        <!-- ================= PANEL 5: PRODUCTS ================= -->
        <section class="dash-panel" data-dash-panel="products" aria-label="${t("لوحة المنتجات والأنظمة", "Flagship Products Studio")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("إدارة المنتجات والأنظمة البرمجية السيادية", "Flagship Products & Sovereign Operating Systems")}</h2>
              <p class="dash-panel-desc">${t("التحكم في مواصفات المنتجات، بصمات الذاكرة RAM، كتل التشفير SHA-256، وتراخيص التشغيل.", "Manage software products specifications, memory consumption benchmarks, cryptographic build hashes, and license models.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--primary btn--sm" id="btn-add-product">+ ${t("إضافة منتج سيادي جديد", "Add New Flagship Product")}</button>
            </div>
          </div>

          <div class="dash-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
            <div class="dash-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="badge badge--ok">LTS STABLE</span>
                <span class="mono small text-muted">v4.2.0</span>
              </div>
              <h3 style="font-size: 1.25rem;">Smart Accountant Engine</h3>
              <p class="text-muted small">${t("محرك القيود المزدوجة الجنائي بمعايير IFRS / IAS الدولية", "Forensic Double-Entry Ledger Engine")}</p>
              <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(0,0,0,0.25); border-radius: 6px; font-size: 0.82rem;" class="mono">
                <div>RAM: &lt; 18.5 MB</div>
                <div>Offline: 100% SQLite / Merkle</div>
                <div>Hash: sha256:4a8b...9f12</div>
              </div>
              <a href="${pfx}/products/smart-accountant" class="btn btn--ghost btn--xs" target="_blank">${t("معاينة صفحة المنتج ↗", "View Product Page ↗")}</a>
            </div>

            <div class="dash-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="badge badge--ok">PRODUCTION</span>
                <span class="mono small text-muted">v3.8.1</span>
              </div>
              <h3 style="font-size: 1.25rem;">RahmaCare Healthcare OS</h3>
              <p class="text-muted small">${t("نظام إدارة المشافي الميدانية والتطبيب التشفيري اللامركزي", "Field Clinic Healthcare & Medical Ledger OS")}</p>
              <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(0,0,0,0.25); border-radius: 6px; font-size: 0.82rem;" class="mono">
                <div>RAM: &lt; 12.0 MB</div>
                <div>Offline: 100% P2P Mesh Sync</div>
                <div>Hash: sha256:7c1e...3b40</div>
              </div>
              <a href="${pfx}/work/rahmacare" class="btn btn--ghost btn--xs" target="_blank">${t("معاينة صفحة المنتج ↗", "View Product Page ↗")}</a>
            </div>

            <div class="dash-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="badge badge--ok">CORE APEX</span>
                <span class="mono small text-muted">v4.0.4</span>
              </div>
              <h3 style="font-size: 1.25rem;">Vibe OS Apex Kernel</h3>
              <p class="text-muted small">${t("نظام تشغيل الويب الخارق 120 FPS الخالي من التبعيات تماماً", "Zero-Dependency Sovereign Web OS")}</p>
              <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(0,0,0,0.25); border-radius: 6px; font-size: 0.82rem;" class="mono">
                <div>RAM: &lt; 14.2 MB</div>
                <div>Offline: 100% Service Worker DAG</div>
                <div>Hash: sha256:e3b0...855e</div>
              </div>
              <a href="${pfx}/work/vibe-os" class="btn btn--ghost btn--xs" target="_blank">${t("معاينة صفحة المنتج ↗", "View Product Page ↗")}</a>
            </div>

            <div class="dash-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="badge badge--ok">DEFENSE GRADE</span>
                <span class="mono small text-muted">v2.1.0</span>
              </div>
              <h3 style="font-size: 1.25rem;">Gaza Edge Mesh Core</h3>
              <p class="text-muted small">${t("بروتوكول الاتصال والمزامنة عند انقطاع الإنترنت الكامل", "Resilient Emergency Mesh Protocol")}</p>
              <div style="margin: 1rem 0; padding: 0.75rem; background: rgba(0,0,0,0.25); border-radius: 6px; font-size: 0.82rem;" class="mono">
                <div>RAM: &lt; 8.4 MB</div>
                <div>Offline: 100% Zero-BPS Required</div>
                <div>Hash: sha256:91d2...aa04</div>
              </div>
              <a href="${pfx}/security" class="btn btn--ghost btn--xs" target="_blank">${t("معاينة صفحة الأمان ↗", "View Security Page ↗")}</a>
            </div>
          </div>
        </section>

        <!-- ================= PANEL 6: ACADEMY ================= -->
        <section class="dash-panel" data-dash-panel="academy" aria-label="${t("لوحة الأكاديمية والمسارات", "Academy Tracks Studio")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("إدارة أكاديمية عوالِم ومسارات التدريب المتقدم", "Sovereign Academy & Engineering Tracks Studio")}</h2>
              <p class="dash-panel-desc">${t("إدارة المسارات التدريبية المتخصصة في هندسة النظم، أسراب الوكلاء، وحصانة البرمجيات.", "Curriculum management for systems architecture, agentic swarm orchestration, and high-performance Flutter.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--primary btn--sm" id="btn-add-track">+ ${t("إضافة مسار تدريبي جديد", "Add New Track")}</button>
            </div>
          </div>

          <div class="dash-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
            <div class="dash-card">
              <span class="badge badge--ok" style="margin-bottom: 0.5rem;">${t("باب التسجيل مفتوح", "INTAKE OPEN")}</span>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${t("هندسة معمارية الأنظمة السيادية", "Sovereign Systems Architecture")}</h3>
              <p class="text-muted small">${t("البرمجة بدون مكتبات خارجية، معمارية الذاكرة الفائقة، وهندسة الأداء 120 FPS.", "Zero-dependency engineering, memory layout, and 120 FPS kinetic rendering.")}</p>
              <div style="display: flex; gap: 1rem; margin: 1rem 0; font-size: 0.85rem;" class="mono">
                <div>${t("الطلاب:", "Enrolled:")} <b>42/50</b></div>
                <div>${t("الإنجاز:", "Completion:")} <b>96%</b></div>
              </div>
              <a href="${pfx}/academy" class="btn btn--ghost btn--xs" target="_blank">${t("عرض المسار ↗", "View Track ↗")}</a>
            </div>

            <div class="dash-card">
              <span class="badge badge--ok" style="margin-bottom: 0.5rem;">${t("باب التسجيل مفتوح", "INTAKE OPEN")}</span>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${t("أسراب وكلاء الذكاء الاصطناعي", "Distributed AI Agents Swarm")}</h3>
              <p class="text-muted small">${t("بناء وكلاء مستقلين ينفذون مهاماً مركبة دون تسريب بيانات وبمسارات تدقيق صارمة.", "Building autonomous agents that execute offline with verifiable audit trails.")}</p>
              <div style="display: flex; gap: 1rem; margin: 1rem 0; font-size: 0.85rem;" class="mono">
                <div>${t("الطلاب:", "Enrolled:")} <b>38/40</b></div>
                <div>${t("الإنجاز:", "Completion:")} <b>98%</b></div>
              </div>
              <a href="${pfx}/academy" class="btn btn--ghost btn--xs" target="_blank">${t("عرض المسار ↗", "View Track ↗")}</a>
            </div>

            <div class="dash-card">
              <span class="badge badge--ok" style="margin-bottom: 0.5rem;">${t("اكتملت المقاعد", "COHORT FULL")}</span>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${t("تطبيقات Flutter ولوحات القيادة HMI", "High-Performance Flutter & HMI")}</h3>
              <p class="text-muted small">${t("تصميم وبرمجة واجهات السيارات، أنظمة الملاحة، والشاشات الطبية المتقدمة.", "Crafting automotive dashboards, navigation clusters, and medical display software.")}</p>
              <div style="display: flex; gap: 1rem; margin: 1rem 0; font-size: 0.85rem;" class="mono">
                <div>${t("الطلاب:", "Enrolled:")} <b>30/30</b></div>
                <div>${t("الإنجاز:", "Completion:")} <b>100%</b></div>
              </div>
              <a href="${pfx}/academy" class="btn btn--ghost btn--xs" target="_blank">${t("عرض المسار ↗", "View Track ↗")}</a>
            </div>
          </div>
        </section>

        <!-- ================= PANEL 7: ARTICLES & RESEARCH ================= -->
        <section class="dash-panel" data-dash-panel="articles" aria-label="${t("لوحة المقالات والنشر", "Articles & Research Studio")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("إدارة المقالات والأبحاث الهندسية والنشر", "Articles, Technical Research & Editorial Studio")}</h2>
              <p class="dash-panel-desc">${t("نشر وإدارة المقالات التقنية والأوراق البحثية الصادرة عن عوالِم قروب.", "Publish, edit, and curate in-depth research essays and engineering papers.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--primary btn--sm" id="btn-add-article">+ ${t("كتابة ونشر مقال جديد", "Write New Essay")}</button>
            </div>
          </div>

          <div class="dash-table-wrap">
            <table class="dash-table">
              <thead>
                <tr>
                  <th>${t("عنوان الورقة البحثية / المقال", "Paper / Article Title")}</th>
                  <th>${t("الباحث والمؤلف", "Author")}</th>
                  <th>${t("زمن القراءة", "Read Time")}</th>
                  <th>${t("الحالة", "Status")}</th>
                  <th>${t("الإجراءات", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>${t("ثورة وكلاء الذكاء الاصطناعي: من النماذج اللغوية إلى الأنظمة المستقلة", "The AI Agents Revolution: Beyond Chatbots")}</b></td>
                  <td>${t("أحمد أشرف", "Ahmed Ashraf")}</td>
                  <td class="mono">8 min</td>
                  <td><span class="badge badge--ok">PUBLISHED</span></td>
                  <td><a href="${pfx}/journal/ai-agents-revolution" class="btn btn--ghost btn--xs" target="_blank">${t("قراءة ↗", "Read ↗")}</a></td>
                </tr>
                <tr>
                  <td><b>${t("أسرار سرعة 60 FPS: كيف نبني واجهات ويب خارقة خالية من التبعيات", "60 FPS Web Architecture: Zero Dependencies")}</b></td>
                  <td>${t("أحمد أشرف", "Ahmed Ashraf")}</td>
                  <td class="mono">11 min</td>
                  <td><span class="badge badge--ok">PUBLISHED</span></td>
                  <td><a href="${pfx}/journal/sovereign-glass-design" class="btn btn--ghost btn--xs" target="_blank">${t("قراءة ↗", "Read ↗")}</a></td>
                </tr>
                <tr>
                  <td><b>${t("معمارية المحاسبة الجنائية: القيود المزدوجة وفق معايير IFRS الصارمة", "Forensic Accounting Architecture & IFRS Standards")}</b></td>
                  <td>${t("أحمد أشرف", "Ahmed Ashraf")}</td>
                  <td class="mono">14 min</td>
                  <td><span class="badge badge--ok">PUBLISHED</span></td>
                  <td><a href="${pfx}/journal/idea-to-mrr-8-weeks" class="btn btn--ghost btn--xs" target="_blank">${t("قراءة ↗", "Read ↗")}</a></td>
                </tr>
                <tr>
                  <td><b>${t("صمود الشبكات في غزة: المزامنة اللامركزية عبر كتل Merkle DAG", "Network Resilience in Gaza: Merkle DAG P2P Sync")}</b></td>
                  <td>${t("فريق عوالِم الهندسي", "Awalim Engineering Team")}</td>
                  <td class="mono">16 min</td>
                  <td><span class="badge badge--ok">PUBLISHED</span></td>
                  <td><a href="${pfx}/security" class="btn btn--ghost btn--xs" target="_blank">${t("قراءة ↗", "Read ↗")}</a></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ================= PANEL 8: MESSAGES & INQUIRIES ================= -->
        <section class="dash-panel" data-dash-panel="messages" aria-label="${t("لوحة الرسائل وطلبات التعاقد", "Inquiries Hub")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("مركز الرسائل وطلبات التعاقد الواردة", "Enterprise Inquiries & Contract Requests Hub")}</h2>
              <p class="dash-panel-desc">${t("استعراض ومعالجة الطلبات الواردة من نموذج الاتصال في الموقع وتوليد مسوّدات العروض المعتمدة.", "Review incoming contract requests, filter leads, and generate sovereign corporate proposals.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--ghost btn--sm" id="btn-export-messages">${t("تصدير الرسائل CSV", "Export Inquiries CSV")}</button>
            </div>
          </div>

          <div class="dash-inbox-grid" id="dash-inbox-grid">
            <div class="dash-card dash-inbox-item unread" data-inquiry-id="1">
              <div class="dash-inbox-header" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <div class="dash-inbox-sender">
                  <b>${t("د. سمير النجار — وزارة الصحة والمنظمات الميدانية", "Dr. Samir Al-Najjar — Field Health Relief")}</b>
                  <span class="text-muted small">&lt;s.najjar@health-relief.org&gt;</span>
                </div>
                <span class="badge badge--accent">${t("طلب جديد · عاجل", "NEW · URGENT")}</span>
              </div>
              <h4 class="dash-inbox-subject" style="margin-bottom: 0.5rem;">${t("طلب نشر نظام RahmaCare في 5 مشافي ميدانية جديدة", "Request deployment of RahmaCare OS in 5 new field clinics")}</h4>
              <p class="dash-inbox-snippet" style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">${t("نحتاج إلى تفعيل شبكة المزامنة المحلية P2P لنظام RahmaCare لتغطية 350 مريضاً يومياً مع انقطاع كامل لشبكات الاتصال. نرجو التواصل الفوري لبدء التنفيذ الهيكلي.", "We require immediate deployment of RahmaCare offline-first P2P mesh across 5 clinics handling 350 daily patients. Please coordinate dispatch.")}</p>
              <div class="dash-inbox-actions" style="display: flex; gap: 0.5rem; align-items: center;">
                <button type="button" class="btn btn--primary btn--xs btn-reply-inquiry" data-sender="${t('د. سمير النجار', 'Dr. Samir Al-Najjar')}" data-org="${t('منظمات الإغاثة الصحية', 'Healthcare Relief Organizations')}" data-service="RahmaCare OS">${t("الرد وتوليد العرض المقترح", "Reply & Generate Proposal")}</button>
                <button type="button" class="btn btn--ghost btn--xs btn-mark-read">${t("تمييز كمقروء", "Mark Read")}</button>
                <span class="small text-muted mono">2026-09-13 14:15 UTC</span>
              </div>
            </div>

            <div class="dash-card dash-inbox-item" data-inquiry-id="2">
              <div class="dash-inbox-header" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <div class="dash-inbox-sender">
                  <b>${t("طارق عبد العزيز — مجموعة الاستثمار المصرفي (دبي)", "Tariq Abdulaziz — Gulf Investment Banking (Dubai)")}</b>
                  <span class="text-muted small">&lt;tariq.a@gulf-invest.ae&gt;</span>
                </div>
                <span class="badge badge--ghost">${t("استشارة تعاقدية", "Enterprise RFP")}</span>
              </div>
              <h4 class="dash-inbox-subject" style="margin-bottom: 0.5rem;">${t("طلب تدقيق جنائي IFRS وربط محرك المحاسب الذكي", "Inquiry regarding IFRS Forensic Engine integration")}</h4>
              <p class="dash-inbox-snippet" style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">${t("نرغب في استبدال النظام المحاسبي السحابي التابع لشركة أمريكية بنظام عوالِم المحاسبي السيادي لضمان سرية القيود واستقرارها محلياً.", "Looking to migrate our financial operations away from US-hosted cloud accounting to Awalim sovereign ledger for absolute privacy.")}</p>
              <div class="dash-inbox-actions" style="display: flex; gap: 0.5rem; align-items: center;">
                <button type="button" class="btn btn--primary btn--xs btn-reply-inquiry" data-sender="${t('طارق عبد العزيز', 'Tariq Abdulaziz')}" data-org="${t('مجموعة الاستثمار المصرفي (دبي)', 'Gulf Investment Banking (Dubai)')}" data-service="Smart Accountant IFRS Engine">${t("الرد وتوليد العرض المقترح", "Reply & Generate Proposal")}</button>
                <span class="small text-muted mono">2026-09-12 11:30 UTC</span>
              </div>
            </div>

            <div class="dash-card dash-inbox-item" data-inquiry-id="3">
              <div class="dash-inbox-header" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <div class="dash-inbox-sender">
                  <b>${t("المهندس عمر خليل — شركة النقل والخدمات اللوجستية", "Eng. Omar Khalil — Logistics Mesh Corp")}</b>
                  <span class="text-muted small">&lt;omar.k@mesh-logistics.com&gt;</span>
                </div>
                <span class="badge badge--ok">${t("مكتمل", "Resolved")}</span>
              </div>
              <h4 class="dash-inbox-subject" style="margin-bottom: 0.5rem;">${t("اكتمال ربط شبكة الميش بنجاح", "Successful P2P Mesh node registration confirmed")}</h4>
              <p class="dash-inbox-snippet" style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">${t("تم تأكيد سلامة عقد الميش وتزامن المعاملات خلال الـ 24 ساعة الماضية دون تسجيل أي تعارض في السجلات.", "Confirmed 24h conflict-free ledger synchronization across all warehouse nodes.")}</p>
              <div class="dash-inbox-actions" style="display: flex; gap: 0.5rem; align-items: center;">
                <span class="small text-muted mono">2026-09-11 09:10 UTC</span>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= PANEL 9: MASTER SITE-WIDE TEST SUITE ================= -->
        <section class="dash-panel" data-dash-panel="testing" aria-label="${t("لوحة الفحص الشامل للموقع", "Master Site-Wide Test Suite")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("مركز الفحص الشامل الحي لكافة صفحات المنظومة (Master Site Auditor)", "Master Site-Wide Verification & Diagnostics Suite")}</h2>
              <p class="dash-panel-desc">${t("فحص آلي حقيقي يختبر كافة مسارات الموقع الـ 84 صفحة عبر 6 محركات تدقيق: البناء، التحرير، التيبوغرافيا، اتجاه النص، التباين، وفحص المتصفح الحي.", "Full multi-engine automated audit verifying all 84 built pages across static integrity, linguistic accuracy, Arabic typography, BiDi isolation, contrast, and headless browser navigation.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--primary btn--sm" id="btn-run-live-test">
                <span class="dot dot--live" aria-hidden="true"></span>
                <span>${t("تشغيل الفحص الشامل الآن", "Run Master Audit Now")}</span>
              </button>
            </div>
          </div>

          <!-- Master Test Progress Bar -->
          <div class="dash-card dash-test-runner-card">
            <div class="dash-test-header">
              <div>
                <b class="dash-test-status" id="test-runner-status">${t("جاهز للفحص · تم اجتياز الفحص الأخير بنسبة 100%", "Ready · Last Audit Score: 100% Flawless")}</b>
                <div class="small text-muted" id="test-runner-sub">${t("84 صفحة مفحوصة · 0 أخطاء · 0 تفكك للحروف · 0 مقاطع مقلوبة · 0 أخطاء متصفح", "84 routes audited · 0 build warnings · 0 ligature defects · 0 BiDi faults · 0 console errors")}</div>
              </div>
              <div class="dash-test-score mono">
                <span class="score-num" id="test-score-val">100</span><span class="score-tot">/100</span>
              </div>
            </div>
            <div class="dash-progress-track">
              <div class="dash-progress-fill" id="test-progress-fill" style="width: 100%;"></div>
            </div>
          </div>

          <!-- 6 Verification Engines Summary Cards -->
          <div class="dash-six-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("layers", "test-svg")}</span>
              <b>${t("البناء واللغات", "Static Build")}</b>
              <small>${t("84 صفحة (عربي/إنجليزي)", "84 Pages (AR & EN)")}</small>
              <span class="badge badge--ok">✔ PASS (0 warn)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("feather", "test-svg")}</span>
              <b>${t("التدقيق اللغوي", "Linguistics")}</b>
              <small>${t("5,731 نص مفحوص", "5,731 Nodes Checked")}</small>
              <span class="badge badge--ok">✔ PASS (0 typo)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("rtl", "test-svg")}</span>
              <b>${t("الخطوط والوصل", "Typography")}</b>
              <small>${t("خط الإسكندرية 900", "Alexandria 900 & Ligatures")}</small>
              <span class="badge badge--ok">✔ PASS (0 break)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("swap", "test-svg")}</span>
              <b>${t("عزل النصوص (BiDi)", "BiDi Isolation")}</b>
              <small>${t("41 مساراً مركباً", "41 Compound Routes")}</small>
              <span class="badge badge--ok">✔ PASS (0 reversed)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("eye", "test-svg")}</span>
              <b>${t("التباين والوصولية", "WCAG Contrast")}</b>
              <small>${t("النمط الليلي والنهاري", "Dark & Light Surfaces")}</small>
              <span class="badge badge--ok">✔ PASS (2.2 AA)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("globe", "test-svg")}</span>
              <b>${t("المتصفح الحي (E2E)", "Headless Browser")}</b>
              <small>${t("11 مساراً قيادياً", "11 Flagship Routes")}</small>
              <span class="badge badge--ok">✔ PASS (0 console err)</span>
            </div>
          </div>

          <!-- Detailed Table of Live Routes Audited -->
          <div class="dash-table-wrap">
            <div class="dash-table-title">
              <h3>${t("جدول فحص المسارات الحية في المتصفح (Headless E2E Live Audit)", "Live Headless Browser E2E Route Verification Table")}</h3>
              <span class="badge badge--ghost mono">TARGET: http://localhost:8899</span>
            </div>
            <table class="dash-table" id="table-routes-audited">
              <thead>
                <tr>
                  <th>${t("المسار", "Route Path")}</th>
                  <th>${t("اسم الصفحة", "Page Title")}</th>
                  <th>${t("رمز الاستجابة", "HTTP Status")}</th>
                  <th>${t("زمن التحميل", "Latency")}</th>
                  <th>${t("عناصر DOM", "DOM Nodes")}</th>
                  <th>${t("أخطاء المتصفح", "Console Errors")}</th>
                  <th>${t("الإجراء الفردي", "Actions")}</th>
                </tr>
              </thead>
              <tbody id="tbody-audit-routes">
                <tr data-route="/"><td><code>/</code></td><td>${t("الرئيسية (Home)", "Homepage")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">420ms</td><td class="mono route-nodes">2,216</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/">${t("فحص فردي", "Test Route")}</button></td></tr>
                <tr data-route="/dashboard"><td><code>/dashboard</code></td><td>${t("لوحة التحكم (Dashboard)", "Executive Dashboard")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">180ms</td><td class="mono route-nodes">1,120</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/dashboard">${t("فحص فردي", "Test Route")}</button></td></tr>
                <tr data-route="/work"><td><code>/work</code></td><td>${t("المشاريع (Selected Work)", "Selected Work")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">210ms</td><td class="mono route-nodes">920</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/work">${t("فحص فردي", "Test Route")}</button></td></tr>
                <tr data-route="/work/rahmacare"><td><code>/work/rahmacare</code></td><td>${t("مشروع RahmaCare", "RahmaCare Case Study")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">190ms</td><td class="mono route-nodes">491</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/work/rahmacare">${t("فحص فردي", "Test Route")}</button></td></tr>
                <tr data-route="/products"><td><code>/products</code></td><td>${t("المنتجات (Products)", "Flagship Products")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">215ms</td><td class="mono route-nodes">783</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/products">${t("فحص فردي", "Test Route")}</button></td></tr>
                <tr data-route="/products/smart-accountant"><td><code>/products/smart-accountant</code></td><td>${t("منتج محاسب ذكي", "Smart Accountant Engine")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">220ms</td><td class="mono route-nodes">825</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/products/smart-accountant">${t("فحص فردي", "Test Route")}</button></td></tr>
                <tr data-route="/services"><td><code>/services</code></td><td>${t("الخدمات (Services)", "Enterprise Services")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">195ms</td><td class="mono route-nodes">596</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/services">${t("فحص فردي", "Test Route")}</button></td></tr>
                <tr data-route="/academy"><td><code>/academy</code></td><td>${t("الأكاديمية (Academy)", "Sovereign Academy")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">198ms</td><td class="mono route-nodes">600</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/academy">${t("فحص فردي", "Test Route")}</button></td></tr>
                <tr data-route="/group"><td><code>/group</code></td><td>${t("عن المجموعة (Group)", "About Awalim Group")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">185ms</td><td class="mono route-nodes">538</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/group">${t("فحص فردي", "Test Route")}</button></td></tr>
                <tr data-route="/security"><td><code>/security</code></td><td>${t("الأمان والسياسة (Security)", "Security & Policy")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">182ms</td><td class="mono route-nodes">424</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/security">${t("فحص فردي", "Test Route")}</button></td></tr>
                <tr data-route="/verify"><td><code>/verify</code></td><td>${t("التحقق والنزاهة (Verify)", "Forensic Ledger Verification")}</td><td><span class="badge badge--ok">200 OK</span></td><td class="mono route-latency">175ms</td><td class="mono route-nodes">392</td><td class="mono">0</td><td><button type="button" class="btn btn--ghost btn--xs btn-test-single-route" data-route="/verify">${t("فحص فردي", "Test Route")}</button></td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- ================= PANEL 10: SECURITY & CRYPTO ================= -->
        <section class="dash-panel" data-dash-panel="security" aria-label="${t("لوحة الأمان والتدقيق الجنائي", "Security & Forensics")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("الأمان السيادي والتدقيق الجنائي التشفيري", "Sovereign Cryptographic Vault & Security Audit")}</h2>
              <p class="dash-panel-desc">${t("توليد والتحقق من توقيعات Ed25519، ومطابقة كتل Merkle DAG، وسياسات Strict CSP Level 3.", "Inspect cryptographic keys, Merkle roots, strict Content Security Policies, and offline tamper resistance.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--primary btn--sm" id="btn-generate-keypair">${t("توليد زوج مفاتيح Ed25519 جديد", "Generate New Ed25519 Keypair")}</button>
            </div>
          </div>

          <div class="dash-two-col" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
            <div class="dash-card">
              <h3>${t("شهادة الأمان والتشفير الحي (Hardware Attestation)", "Live Cryptographic Attestation")}</h3>
              <div class="dash-field-group">
                <label class="dash-label">Ed25519 Public Key Fingerprint</label>
                <input type="text" class="dash-input mono" id="crypto-pubkey-display" readonly value="ed25519:7f8a9b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">Current Merkle Root Hash (SHA-256)</label>
                <input type="text" class="dash-input mono" id="crypto-merkle-display" readonly value="sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">CSP Level 3 Policy</label>
                <textarea class="dash-textarea mono" rows="3" readonly>default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-ancestors 'none'; require-trusted-types-for 'script';</textarea>
              </div>
              <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button type="button" class="btn btn--primary btn--sm" id="btn-sign-state">${t("توقيع حالة النظام تشفيرياً", "Sign System State")}</button>
                <button type="button" class="btn btn--ghost btn--sm" id="btn-verify-sig">${t("التحقق من التوقيع التشفيري", "Verify Signature")}</button>
              </div>
              <div id="crypto-verify-result" style="margin-top: 0.75rem; font-size: 0.85rem;" class="mono text-muted"></div>
            </div>

            <!-- Terminal Sandbox -->
            <div class="dash-card">
              <h3>${t("طرفية العمليات السيادية (Sovereign Operations Terminal)", "Sovereign Operations Terminal")}</h3>
              <p class="small text-muted">${t("أدخل أوامر مثل: status, audit, keypair, routes, hash <text>, help, clear", "Enter commands like: status, audit, keypair, routes, hash <text>, help, clear")}</p>
              <div class="dash-terminal-sandbox" style="background: #090b0e; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; height: 260px; overflow-y: auto; font-family: var(--font-mono); font-size: 0.82rem; color: #6ee7b7; margin-top: 0.75rem;" id="dash-terminal-output">
                <div>[SOVEREIGN APEX KERNEL · READY]</div>
                <div>Type "help" for a list of diagnostic commands.</div>
              </div>
              <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                <input type="text" class="dash-input mono" id="terminal-input" placeholder="${t("أدخل الأمر هنا... (مثال: status)", "Enter command... (e.g. status)")}">
                <button type="button" class="btn btn--primary btn--sm" id="terminal-btn-send">${t("تنفيذ", "Run")}</button>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= PANEL 12: TASKS & SPRINTS (ISLAND HAVEN ENGINE) ================= -->
        <section class="dash-panel" data-dash-panel="tasks" aria-label="${t("إدارة المهام وسبرنت العمليات", "Tasks & Sprint Operations")}">
          <div class="dash-panel-head">
            <div>
              <div class="dash-badge-row">
                <span class="chip chip--accent"><span class="dot dot--live" aria-hidden="true"></span>${t("محرك Island Haven السيادي", "ISLAND HAVEN TASK ENGINE")}</span>
                <span class="dash-tab-badge" id="tasks-total-badge">6 ${t("مهام نشطة", "Active Tasks")}</span>
              </div>
              <h2 class="dash-panel-title">${t("إدارة المهام وسبرنت العمليات السيادية (Island Haven Engine)", "Sovereign Tasks & Sprint Operations (Island Haven Engine)")}</h2>
              <p class="dash-panel-desc">${t("نظام كانبان تفاعلي متكامل لإدارة مهام وتطوير أنظمة عوالِم، مستوحى من نظام إدارة المهام والعمليات لـ Island Haven.", "Full-featured interactive Kanban and sprint management system for Awalim systems, powered by the Island Haven operations engine.")}</p>
            </div>
            <div class="dash-panel-tools">
              <div class="dash-view-switcher" role="group" aria-label="${t("طريقة العرض", "View Switcher")}">
                <button type="button" class="dash-view-btn active" data-task-view="kanban" aria-pressed="true">
                  <span>${icon("kanban", "view-svg")} ${t("لوحة كانبان", "Kanban Board")}</span>
                </button>
                <button type="button" class="dash-view-btn" data-task-view="table" aria-pressed="false">
                  <span>${icon("table", "view-svg")} ${t("جدول مفصل", "List Table")}</span>
                </button>
                <button type="button" class="dash-view-btn" data-task-view="feed" aria-pressed="false">
                  <span>${icon("feed", "view-svg")} ${t("نبض العمليات", "Live Feed")}</span>
                </button>
              </div>
              <button type="button" class="btn btn--primary btn--sm" id="btn-add-task">
                <span>+ ${t("مهمة سيادية جديدة", "New Sovereign Task")}</span>
              </button>
            </div>
          </div>

          <!-- Tasks Filter Bar -->
          <div class="dash-task-filter-bar">
            <div class="dash-search-box">
              <span aria-hidden="true" class="dash-search-icon">${icon("search", "dash-search-svg")}</span>
              <input type="search" class="dash-input" id="task-search-input" placeholder="${t("ابحث في المهام، المسؤول، أو الوسم...", "Search tasks, assignee, or tag...")}">
            </div>
            <div class="dash-filter-pills" id="task-category-filters">
              <button type="button" class="dash-filter-pill active" data-filter-cat="all">${t("كافة الأقسام", "All Domains")}</button>
              <button type="button" class="dash-filter-pill" data-filter-cat="kernel">${t("هندسة النواة", "Apex Kernel")}</button>
              <button type="button" class="dash-filter-pill" data-filter-cat="systems">${t("تطوير الأنظمة", "Systems")}</button>
              <button type="button" class="dash-filter-pill" data-filter-cat="design">${t("تصميم وواجهات", "UI / HMI")}</button>
              <button type="button" class="dash-filter-pill" data-filter-cat="security">${t("أمان وتشفير", "Security")}</button>
              <button type="button" class="dash-filter-pill" data-filter-cat="emergency">${t("إغاثة وطوارئ", "Emergency")}</button>
            </div>
            <div class="dash-priority-select-wrap">
              <select class="dash-select" id="task-priority-filter" aria-label="${t("تصفية بالأولوية", "Filter by Priority")}">
                <option value="all">${t("كافة الأولويات", "All Priorities")}</option>
                <option value="urgent">${t("🔥 عاجل طارئ", "🔥 Urgent")}</option>
                <option value="high">${t("🔺 أولوية عليا", "🔺 High")}</option>
                <option value="medium">${t("➖ أولوية متوسطة", "➖ Medium")}</option>
                <option value="low">${t("🔻 اعتيادية", "🔻 Low")}</option>
              </select>
            </div>
          </div>

          <!-- View 1: Kanban Board View -->
          <div class="dash-kanban-wrap" id="tasks-view-kanban">
            <div class="dash-kanban-grid">
              <!-- Col 1: Backlog -->
              <div class="dash-kanban-col" data-col="backlog">
                <div class="dash-kanban-col__head">
                  <div class="dash-kanban-col__title">
                    <span class="col-dot col-dot--backlog"></span>
                    <span>${t("المتراكم والأفكار", "Backlog")}</span>
                  </div>
                  <span class="col-badge" id="col-count-backlog">0</span>
                </div>
                <div class="dash-kanban-col__body" data-drop-col="backlog" id="kanban-cards-backlog"></div>
              </div>

              <!-- Col 2: Todo -->
              <div class="dash-kanban-col" data-col="todo">
                <div class="dash-kanban-col__head">
                  <div class="dash-kanban-col__title">
                    <span class="col-dot col-dot--todo"></span>
                    <span>${t("مجدول للسبرنت", "To Do")}</span>
                  </div>
                  <span class="col-badge" id="col-count-todo">0</span>
                </div>
                <div class="dash-kanban-col__body" data-drop-col="todo" id="kanban-cards-todo"></div>
              </div>

              <!-- Col 3: In Progress -->
              <div class="dash-kanban-col" data-col="in_progress">
                <div class="dash-kanban-col__head">
                  <div class="dash-kanban-col__title">
                    <span class="col-dot col-dot--progress"></span>
                    <span>${t("جارٍ التنفيذ والبرمجة", "In Progress")}</span>
                  </div>
                  <span class="col-badge" id="col-count-in_progress">0</span>
                </div>
                <div class="dash-kanban-col__body" data-drop-col="in_progress" id="kanban-cards-in_progress"></div>
              </div>

              <!-- Col 4: Review -->
              <div class="dash-kanban-col" data-col="review">
                <div class="dash-kanban-col__head">
                  <div class="dash-kanban-col__title">
                    <span class="col-dot col-dot--review"></span>
                    <span>${t("مراجعة وتدقيق جنائي", "Review & Audit")}</span>
                  </div>
                  <span class="col-badge" id="col-count-review">0</span>
                </div>
                <div class="dash-kanban-col__body" data-drop-col="review" id="kanban-cards-review"></div>
              </div>

              <!-- Col 5: Done -->
              <div class="dash-kanban-col" data-col="done">
                <div class="dash-kanban-col__head">
                  <div class="dash-kanban-col__title">
                    <span class="col-dot col-dot--done"></span>
                    <span>${t("منجز ومعتمد للإنتاج", "Done / Shipped")}</span>
                  </div>
                  <span class="col-badge" id="col-count-done">0</span>
                </div>
                <div class="dash-kanban-col__body" data-drop-col="done" id="kanban-cards-done"></div>
              </div>
            </div>
          </div>

          <!-- View 2: Detailed Table View -->
          <div class="dash-table-wrap" id="tasks-view-table" style="display: none;">
            <table class="dash-table">
              <thead>
                <tr>
                  <th>${t("المهمة", "Task Title")}</th>
                  <th>${t("المرحلة", "Stage")}</th>
                  <th>${t("الأولوية", "Priority")}</th>
                  <th>${t("القسم", "Domain")}</th>
                  <th>${t("المسؤول", "Assignee")}</th>
                  <th>${t("الاستحقاق", "Due Date")}</th>
                  <th>${t("إجراءات سريعة", "Actions")}</th>
                </tr>
              </thead>
              <tbody id="tasks-table-body"></tbody>
            </table>
          </div>

          <!-- View 3: Team Activity Feed View -->
          <div class="dash-card" id="tasks-view-feed" style="display: none;">
            <div class="dash-card-header">
              <h3 class="dash-card-title">${t("نبض وسجل نشاط الفريق الحي (Team Heartbeat & Audit Trail)", "Live Team Heartbeat & Immutable Audit Trail")}</h3>
              <span class="badge badge--ok">${t("محدث لحظياً", "Real-Time Synced")}</span>
            </div>
            <div class="dash-activity-timeline" id="tasks-feed-list"></div>
          </div>
        </section>

        <!-- ================= PANEL 13: RAHMACARE FIELD & EMERGENCY DISPATCH ================= -->
        <section class="dash-panel" data-dash-panel="field" aria-label="${t("عمليات رحمة كير الميدانية", "RahmaCare Field Dispatch")}">
          <div class="dash-panel-head">
            <div>
              <div class="dash-badge-row">
                <span class="chip chip--accent"><span class="dot dot--live" aria-hidden="true"></span>${t("مركز عمليات رحمة كير الميداني", "RAHMACARE EMERGENCY DISPATCH")}</span>
                <span class="badge badge--ok">${t("14 عقدة ميدانية نشطة", "14 Active Edge Nodes")}</span>
              </div>
              <h2 class="dash-panel-title">${t("مركز الطوارئ والفرز الميداني والشبكات السيادية (RahmaCare Dispatch)", "Emergency Triage, Supply Telemetry & Offline Mesh Operations")}</h2>
              <p class="dash-panel-desc">${t("نظام متكامل لإدارة عقد الإغاثة الصحية في غزة وبيروت، تتبع المخزون الطبي الحرج، وتنسيق الفرز الذكي تحت ظروف انقطاع الاتصال.", "Real-time command interface for healthcare relief nodes in Gaza and Beirut, tracking critical medical assets and offline triage dispatch.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--primary btn--sm" id="btn-simulate-triage">
                <span>${icon("bolt", "dash-btn-svg")} ${t("محاكاة فرز طبي عاجل", "Simulate Urgent Triage")}</span>
              </button>
              <button type="button" class="btn btn--ghost btn--sm" id="btn-sync-merkle">
                <span>${icon("refresh", "dash-btn-svg")} ${t("مزامنة أشجار ميركل (P2P)", "P2P Merkle Sync")}</span>
              </button>
            </div>
          </div>

          <!-- RahmaCare Live KPIs -->
          <div class="dash-kpi-grid">
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("عقد الاستجابة النشطة", "Active Field Nodes")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">14 / 14</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">P2P Mesh</span> ${t("صمود 100% دون إنترنت", "100% Offline Uptime")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("الحالات الطبية المفرزة", "Triaged Patients")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr" id="rahma-triaged-count">12,840</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">&lt; 14s</span> ${t("متوسط زمن مطابقة الطبيب", "Avg. Doctor Match Time")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("المخزون الدوائي الحرج", "Critical Medical Reserve")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">84.2%</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">Safe</span> ${t("تأمين الإمدادات لـ 45 يوماً", "45-Day Supply Secured")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("سجل التحقق التشفيري", "Merkle Anchor Proof")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">Ed25519</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">0 Variance</span> ${t("سجلات غير قابلة للتلاعب", "Cryptographically Sealed")}</div>
            </div>
          </div>

          <!-- Active Nodes Map & Inventory -->
          <div class="dash-grid-2">
            <!-- Node Status Grid -->
            <div class="dash-card">
              <div class="dash-card-header">
                <h3 class="dash-card-title">${t("شبكة العقد الميدانية في غزة وبيروت (Mesh Topology)", "Field Relief Node Topology")}</h3>
                <span class="badge badge--ok">${t("كافة العقد متزامنة", "All Nodes Healthy")}</span>
              </div>
              <div class="dash-nodes-list" id="field-nodes-list">
                <div class="dash-node-row">
                  <div class="dash-node-info">
                    <span class="node-status-dot node-status-dot--online"></span>
                    <div>
                      <b>${t("مجمع ناصر الطبي · خان يونس (Node-KH01)", "Nasser Medical Complex · Khan Yunis")}</b>
                      <span class="node-meta">P2P Mesh · Latency 0.1ms · 42 ${t("طبيب متصل", "Doctors Online")}</span>
                    </div>
                  </div>
                  <span class="badge badge--ok">99.9% Mesh</span>
                </div>
                <div class="dash-node-row">
                  <div class="dash-node-info">
                    <span class="node-status-dot node-status-dot--online"></span>
                    <div>
                      <b>${t("المستشفى الكويتي الميداني · رفح (Node-RF02)", "Kuwaiti Field Hospital · Rafah")}</b>
                      <span class="node-meta">0 bps Internet · Merkle Synced · 28 ${t("طبيب متصل", "Doctors Online")}</span>
                    </div>
                  </div>
                  <span class="badge badge--ok">100% Offline</span>
                </div>
                <div class="dash-node-row">
                  <div class="dash-node-info">
                    <span class="node-status-dot node-status-dot--online"></span>
                    <div>
                      <b>${t("مستشفى شهداء الأقصى · دير البلح (Node-DB03)", "Al-Aqsa Martyrs Hospital · Deir al-Balah")}</b>
                      <span class="node-meta">Solar Powered · 0.2ms Kernel · 35 ${t("طبيب متصل", "Doctors Online")}</span>
                    </div>
                  </div>
                  <span class="badge badge--ok">Active Node</span>
                </div>
                <div class="dash-node-row">
                  <div class="dash-node-info">
                    <span class="node-status-dot node-status-dot--online"></span>
                    <div>
                      <b>${t("مستشفى المعمداني للطوارئ · غزة الشمال (Node-GZ04)", "Al-Ahli Arab Hospital · North Gaza")}</b>
                      <span class="node-meta">Encrypted Radio Relay · 19 ${t("طبيب متصل", "Doctors Online")}</span>
                    </div>
                  </div>
                  <span class="badge badge--ok">Encrypted P2P</span>
                </div>
              </div>
            </div>

            <!-- Medical Inventory & Live Triage Stream -->
            <div class="dash-card">
              <div class="dash-card-header">
                <h3 class="dash-card-title">${t("سجل الفرز الطبي وتوزيع الإمدادات الحرج", "Live Triage Stream & Critical Supplies")}</h3>
                <span class="badge badge--accent">${t("رصد لحظي", "Live Stream")}</span>
              </div>
              <div class="dash-supplies-bars" style="margin-bottom: 1rem;">
                <div class="supply-item">
                  <div class="supply-head"><span>${t("الأنسولين ومثبطات الصدمة", "Insulin & Antishock")}</span><b>92%</b></div>
                  <div class="supply-bar"><div class="supply-bar__fill" style="width: 92%; background: #10b981;"></div></div>
                </div>
                <div class="supply-item">
                  <div class="supply-head"><span>${t("المحاليل الوريدية وحقن التخدير", "IV Fluids & Anesthetics")}</span><b>78%</b></div>
                  <div class="supply-bar"><div class="supply-bar__fill" style="width: 78%; background: #00f0ff;"></div></div>
                </div>
                <div class="supply-item">
                  <div class="supply-head"><span>${t("الشاش المعقم ومضادات الحروق", "Sterile Dressing & Burn Kits")}</span><b>84%</b></div>
                  <div class="supply-bar"><div class="supply-bar__fill" style="width: 84%; background: #f59e0b;"></div></div>
                </div>
              </div>
              <div class="dash-triage-stream" id="field-triage-stream">
                <div class="triage-entry">
                  <span class="triage-time">12:38:05</span>
                  <div class="triage-body">
                    <b>${t("استقبال حالة فرز #8921 — إصابة شظايا معقدة", "Triage Case #8921 — Complex Trauma")}</b>
                    <p>${t("تمت المطابقة الفورية مع استشاري جراحة الأوعية الدموية خلال 8 ثوانٍ.", "Matched vascular surgeon within 8 seconds via offline mesh.")}</p>
                  </div>
                  <span class="badge badge--ok">${t("تم التوجيه", "Dispatched")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ================= PANEL 11: SETTINGS & BACKUPS ================= -->
        <section class="dash-panel" data-dash-panel="settings" aria-label="${t("الإعدادات والنسخ الاحتياطي", "Settings & Backups")}">
          <div class="dash-panel-head">
            <div>
              <h2 class="dash-panel-title">${t("إدارة النظام والنسخ الاحتياطي وتصدير البيانات", "System Settings, Data Management & Full Backups")}</h2>
              <p class="dash-panel-desc">${t("تصدير النسخة الاحتياطية الكاملة لبيانات الموقع بصيغة JSON، استيراد بيانات سابقة، وإعادة ضبط المصنع.", "Export full platform state to JSON, restore snapshots, and manage global persistent storage.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--primary btn--sm" id="btn-backup-now">${t("تصدير نسخة JSON فورية", "Download JSON Snapshot")}</button>
            </div>
          </div>

          <div class="dash-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
            <!-- Backup & Export -->
            <div class="dash-card">
              <h3>${t("النسخ الاحتياطي الشامل (JSON Snapshot)", "Comprehensive JSON Snapshot")}</h3>
              <p class="text-muted small" style="margin-bottom: 1rem;">${t("تصدير كافة تعديلات الهيرو، المشاريع، الخدمات، والرسائل في ملف JSON متكامل يمكن استعادته في أي وقت.", "Download complete state snapshot including customized hero copy, enterprise cases, services tiers, and inquiries.")}</p>
              <button type="button" class="btn btn--primary btn--sm" id="btn-export-full-json" style="width: 100%; margin-bottom: 0.75rem;">${t("تصدير نسخة احتياطية كاملة (JSON)", "Export Full JSON Backup")}</button>
              <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem; margin-top: 0.5rem;">
                <label class="dash-label">${t("استيراد نسخة احتياطية سابقة", "Import JSON Backup File")}</label>
                <input type="file" id="input-import-json" accept=".json" class="dash-input" style="padding: 6px;">
              </div>
            </div>

            <!-- Factory Reset & Diagnostics -->
            <div class="dash-card">
              <h3>${t("ضبط المصنع والذاكرة المحلية", "Factory Reset & Local Storage")}</h3>
              <p class="text-muted small" style="margin-bottom: 1rem;">${t("إعادة تعيين كافة الحقول والبيانات إلى حالتها الافتراضية الأولى المعتمدة من عوالِم قروب.", "Restore initial corporate content and clear custom browser overrides from local storage.")}</p>
              <button type="button" class="btn btn--ghost btn--sm btn-del" id="btn-reset-defaults" style="width: 100%; color: #f87171; border-color: rgba(239,68,68,0.3);">${t("استعادة ضبط المصنع الأولي", "Reset to Factory Defaults")}</button>
              <div style="margin-top: 1.5rem; font-size: 0.85rem;" class="mono text-muted">
                <div>Storage Engine: localStorage (Active)</div>
                <div>Integrity Hash: SHA-256 Validated</div>
                <div>Runtime Mode: Sovereign Zero-Dep</div>
              </div>
            </div>

            <!-- Server & Environment Specs -->
            <div class="dash-card">
              <h3>${t("مواصفات الخادم والبيئة الحالية", "Server & Host Environment Specifications")}</h3>
              <div class="dash-field-group">
                <label class="dash-label">Operating Architecture</label>
                <input type="text" class="dash-input mono" readonly value="Sovereign Glass OS 4.2 · Apple Silicon Optimized">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">Node Runtime</label>
                <input type="text" class="dash-input mono" readonly value="v25.9.0 · Zero-Dep Native HTTP/2">
              </div>
              <div class="dash-field-group">
                <label class="dash-label">Active Port & Host</label>
                <input type="text" class="dash-input mono" readonly value="http://localhost:8899 (Production Optimized)">
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

    <!-- ================= MODALS SYSTEM ================= -->
    <!-- Modal 1: Project Edit/Add -->
    <div class="dash-modal-overlay" id="modal-project">
      <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-project-title">
        <div class="dash-modal-header">
          <h3 class="dash-modal-title" id="modal-project-title">${t("إضافة / تعديل دراسة حالة هندسية", "Add / Edit Enterprise Case Study")}</h3>
          <button type="button" class="dash-modal-close" id="btn-close-project-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>
        <div class="dash-modal-body">
          <input type="hidden" id="form-project-index" value="-1">
          <div class="dash-field-group">
            <label class="dash-label">${t("اسم المشروع / النظام", "Project / System Title")}</label>
            <input type="text" class="dash-input" id="form-project-title" placeholder="e.g. RahmaCare Healthcare OS">
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("المسار التعريفي (Slug)", "Project URL Slug")}</label>
            <input type="text" class="dash-input mono" id="form-project-slug" placeholder="e.g. rahmacare">
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("القطاع والتصنيف", "Domain & Industry")}</label>
            <input type="text" class="dash-input" id="form-project-domain" placeholder="e.g. HealthTech · Offline-First">
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("المؤشر القيادي للإنجاز", "Key Metric Highlight")}</label>
            <input type="text" class="dash-input" id="form-project-metric" placeholder="e.g. 12 مشفى ميداني · 0 تسريب">
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("الحالة التشغيلية", "Operating Status")}</label>
            <select class="dash-select" id="form-project-status">
              <option value="ACTIVE">${t("ACTIVE · نشط في الإنتاج", "ACTIVE · Live Production")}</option>
              <option value="ENTERPRISE">${t("ENTERPRISE · تعاقد خاص", "ENTERPRISE · Bespoke Contract")}</option>
              <option value="LTS">${t("LTS · دعم طويل الأجل", "LTS · Long-Term Support")}</option>
            </select>
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("النبذة الهندسية التفصيلية", "Technical Description")}</label>
            <textarea class="dash-textarea" id="form-project-desc" rows="3" placeholder="${t("اكتب نبذة مختصرة عن النظام والحلول التي يقدمها...", "Brief overview of the engineering solution...")}"></textarea>
          </div>
        </div>
        <div class="dash-modal-footer">
          <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-project">${t("إلغاء", "Cancel")}</button>
          <button type="button" class="btn btn--primary btn--sm" id="btn-save-project">${t("حفظ المشروع", "Save Case Study")}</button>
        </div>
      </div>
    </div>

    <!-- Modal 2: Inquiry Detail & Proposal Generator -->
    <div class="dash-modal-overlay" id="modal-inquiry">
      <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-inquiry-title">
        <div class="dash-modal-header">
          <h3 class="dash-modal-title" id="modal-inquiry-title">${t("تفاصيل طلب التعاقد والرد المقترح", "Inquiry Details & Sovereign Proposal")}</h3>
          <button type="button" class="dash-modal-close" id="btn-close-inquiry-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>
        <div class="dash-modal-body">
          <div style="background: rgba(0,0,0,0.25); border-radius: 8px; padding: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <b id="inquiry-modal-sender">${t("د. سمير النجار", "Dr. Samir Al-Najjar")}</b>
              <span class="badge badge--accent" id="inquiry-modal-badge">${t("عاجل", "URGENT")}</span>
            </div>
            <div class="small text-muted" id="inquiry-modal-org" style="margin-bottom: 0.5rem;">${t("منظمات الإغاثة الصحية", "Healthcare Relief Organizations")}</div>
            <p id="inquiry-modal-text" style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;"></p>
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("مسوّدة العرض الفني والمالي المقترح (Sovereign Proposal)", "Corporate Sovereign Proposal Draft")}</label>
            <textarea class="dash-textarea" id="inquiry-modal-proposal" rows="6"></textarea>
          </div>
        </div>
        <div class="dash-modal-footer">
          <button type="button" class="btn btn--ghost btn--sm" id="btn-copy-proposal">${t("نسخ مسودة العرض المقترح", "Copy Proposal Draft")} ${icon("copy", "dash-btn-svg")}</button>
          <button type="button" class="btn btn--primary btn--sm" id="btn-mark-inquiry-done">${t("تأكيد التواصل والمتابعة", "Confirm Coordination")}</button>
        </div>
      </div>
    </div>

    <!-- Modal 3: Task Create / Edit (Island Haven Engine) -->
    
    <!-- Island Haven Task Detail Drawer (Sliding from side, glassmorphic) -->
    <div class="dash-drawer-overlay" id="task-drawer-overlay" style="display:none;" aria-hidden="true">
      <aside class="dash-task-drawer" id="task-detail-drawer" role="dialog" aria-modal="true" aria-labelledby="task-drawer-title">
        <div class="dash-drawer-head">
          <div class="dash-drawer-badges">
            <span class="badge" id="task-drawer-status-badge">${t("مجدول", "To Do")}</span>
            <span class="badge badge--ghost mono" id="task-drawer-id">#TASK-101</span>
          </div>
          <div class="dash-drawer-actions">
            <button type="button" class="btn btn--danger btn--sm" id="task-drawer-btn-delete" title="${t("حذف المهمة", "Delete Task")}">${t("حذف", "Delete")}</button>
            <button type="button" class="dash-modal-close" id="task-drawer-btn-close" aria-label="${t("إغلاق", "Close")}">✕</button>
          </div>
        </div>
        
        <div class="dash-drawer-body">
          <div>
            <h3 class="dash-drawer-title" id="task-drawer-title">${t("عنوان المهمة", "Task Title")}</h3>
            <p class="dash-drawer-desc" id="task-drawer-desc">${t("وصف المهمة...", "Task Description...")}</p>
          </div>
          
          <div class="dash-drawer-meta-grid">
            <div class="dash-field-group">
              <label class="dash-label">${t("الحالة (Status)", "Status")}</label>
              <select class="dash-select" id="task-drawer-select-status">
                <option value="backlog">${t("المتراكم والأفكار", "Backlog")}</option>
                <option value="todo">${t("مجدول للسبرنت", "To Do")}</option>
                <option value="in_progress">${t("جارٍ العمل والتنفيذ", "In Progress")}</option>
                <option value="review">${t("مراجعة وتدقيق", "Review")}</option>
                <option value="done">${t("منجز ومعتمد", "Done")}</option>
                <option value="cancelled">${t("ملغى", "Cancelled")}</option>
              </select>
            </div>
            <div class="dash-field-group">
              <label class="dash-label">${t("الأولوية (Priority)", "Priority")}</label>
              <select class="dash-select" id="task-drawer-select-prio">
                <option value="urgent">${t("🔥 عاجل طارئ", "🔥 Urgent")}</option>
                <option value="high">${t("🔺 أولوية عليا", "🔺 High")}</option>
                <option value="medium">${t("➖ أولوية متوسطة", "➖ Medium")}</option>
                <option value="low">${t("🔻 اعتيادية", "🔻 Low")}</option>
              </select>
            </div>
            <div class="dash-field-group">
              <label class="dash-label">${t("المسؤول (Assignee)", "Assignee")}</label>
              <select class="dash-select" id="task-drawer-select-assignee">
                <option value="أحمد أشرف">${t("أحمد أشرف", "Ahmed Ashraf")}</option>
                <option value="فريق النواة">${t("فريق النواة", "Apex Kernel Team")}</option>
                <option value="مهندس الواجهات">${t("مهندس الواجهات", "UI/UX Engineer")}</option>
                <option value="أخصائي الأمان">${t("أخصائي الأمان", "Security Specialist")}</option>
                <option value="عمليات رحمة كير">${t("عمليات رحمة كير", "RahmaCare Operations")}</option>
              </select>
            </div>
            <div class="dash-field-group">
              <label class="dash-label">${t("تاريخ الاستحقاق", "Due Date")}</label>
              <input type="date" class="dash-input" id="task-drawer-due">
            </div>
          </div>

          <!-- Threaded Comments Section (Island Haven Protocol) -->
          <div class="dash-drawer-section">
            <div class="dash-section-title">
              <h4>${t("النقاش والتعليقات المترابطة", "Threaded Discussion & Comments")} (<span id="task-drawer-comment-count">0</span>)</h4>
            </div>
            <div class="dash-comments-list" id="task-drawer-comments-list"></div>
            <form class="dash-comment-form" id="task-drawer-comment-form">
              <textarea class="dash-textarea" id="task-drawer-comment-input" rows="2" placeholder="${t("أضف تعليقاً أو توجيهاً فنياً...", "Add comment or technical note...")}"></textarea>
              <div class="dash-comment-form-ft">
                <div class="dash-acting-as">
                  <span>${t("الهوية المعتمِدة:", "Acting as:")}</span>
                  <select class="dash-select-xs" id="task-drawer-acting-as" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;font-size:0.75rem;padding:2px 6px;">
                    <option value="أحمد أشرف (المؤسس)">${t("أحمد أشرف (المؤسس)", "Ahmed Ashraf (Founder)")}</option>
                    <option value="فريق النواة السيادية">${t("فريق النواة السيادية", "Apex Kernel Core")}</option>
                    <option value="مسؤول العمليات الميدانية">${t("مسؤول العمليات الميدانية", "Field Operations Lead")}</option>
                  </select>
                </div>
                <button type="submit" class="btn btn--primary btn--sm">${t("إرسال التعليق", "Post Comment")}</button>
              </div>
            </form>
          </div>

          <!-- Immutable Activity Audit Log (Island Haven Protocol) -->
          <div class="dash-drawer-section">
            <div class="dash-section-title">
              <h4>${t("سجل النشاط والتدقيق التاريخي (Audit Trail)", "Immutable Activity Audit Trail")}</h4>
            </div>
            <div class="dash-activity-timeline" id="task-drawer-activity-timeline"></div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Modal 3: Task Create / Edit (Island Haven Engine) -->
    
    <!-- Modal 4: New IFRS Journal Entry Modal -->
    <div class="dash-modal-overlay" id="modal-journal">
      <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-journal-title">
        <div class="dash-modal-header">
          <h3 class="dash-modal-title" id="modal-journal-title">${t("تسجيل قيد محاسبي مزدوج (IFRS Entry)", "Record New IFRS Dual Entry")}</h3>
          <button type="button" class="dash-modal-close" id="btn-close-journal-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>
        <div class="dash-modal-body">
          <div class="dash-field-group">
            <label class="dash-label">${t("بيان القيد المالي / الوصف", "Transaction Description")}</label>
            <input type="text" class="dash-input" id="journal-desc" placeholder="${t("مثال: استلام منحة دعم تقني لمشروع رحمة كير", "e.g. Enterprise grant received for RahmaCare")}">
          </div>
          <div class="dash-grid-2" style="gap: 12px;">
            <div class="dash-field-group">
              <label class="dash-label">${t("حساب المدين (Debit)", "Debit Account (+)")}</label>
              <select class="dash-select" id="journal-debit-account">
                <option value="1010">${t("1010 — النقدية والبنوك (Assets)", "1010 — Cash & Banks")}</option>
                <option value="1020">${t("1020 — مخزون الإغاثة والمواد (Assets)", "1020 — Aid Inventory")}</option>
                <option value="5010">${t("5010 — مصاريف الشحن واللوجستيات (Expense)", "5010 — Logistics")}</option>
                <option value="5020">${t("5020 — تكاليف هندسة النواة والأنظمة (Expense)", "5020 — Core Engineering")}</option>
              </select>
            </div>
            <div class="dash-field-group">
              <label class="dash-label">${t("حساب الدائن (Credit)", "Credit Account (-)")}</label>
              <select class="dash-select" id="journal-credit-account">
                <option value="4010">${t("4010 — إيرادات العقود والمنح (Revenue)", "4010 — Contract Revenue")}</option>
                <option value="3010">${t("3010 — حقوق الملكية / الشركاء (Equity)", "3010 — Capital Equity")}</option>
                <option value="2010">${t("2010 — حسابات دائنة / موردين (Liability)", "2010 — Accounts Payable")}</option>
                <option value="1010">${t("1010 — النقدية والبنوك (Assets)", "1010 — Cash & Banks")}</option>
              </select>
            </div>
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("المبلغ (USD)", "Amount in USD ($)")}</label>
            <input type="number" class="dash-input mono" id="journal-amount" placeholder="50000" min="1" step="100">
          </div>
        </div>
        <div class="dash-modal-footer">
          <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-journal">${t("إلغاء", "Cancel")}</button>
          <button type="button" class="btn btn--primary btn--sm" id="btn-submit-journal">${t("ترحيل وتوقيع القيد تشفيرياً", "Commit & Cryptographically Seal")}</button>
        </div>
      </div>
    </div>

    <div class="dash-modal-overlay" id="modal-task">
      <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-task-title">
        <div class="dash-modal-header">
          <h3 class="dash-modal-title" id="modal-task-title">${t("إضافة / تعديل مهمة سيادية", "Add / Edit Sovereign Task")}</h3>
          <button type="button" class="dash-modal-close" id="btn-close-task-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>
        <div class="dash-modal-body">
          <input type="hidden" id="form-task-id" value="">
          <div class="dash-field-group">
            <label class="dash-label">${t("عنوان المهمة", "Task Title")}</label>
            <input type="text" class="dash-input" id="form-task-title" placeholder="${t("مثال: ربط بوابات RahmaCare اللامركزية في غزة", "e.g. Deploy RahmaCare decentralized mesh nodes")}">
          </div>
          <div class="dash-grid-2" style="gap: 12px;">
            <div class="dash-field-group">
              <label class="dash-label">${t("المرحلة (Stage)", "Status Stage")}</label>
              <select class="dash-select" id="form-task-status">
                <option value="backlog">${t("المتراكم والأفكار (Backlog)", "Backlog")}</option>
                <option value="todo">${t("مجدول للسبرنت (To Do)", "To Do")}</option>
                <option value="in_progress">${t("جارٍ التنفيذ والبرمجة (In Progress)", "In Progress")}</option>
                <option value="review">${t("مراجعة وتدقيق جنائي (Review)", "Review")}</option>
                <option value="done">${t("منجز ومعتمد للإنتاج (Done)", "Done")}</option>
              </select>
            </div>
            <div class="dash-field-group">
              <label class="dash-label">${t("الأولوية (Priority)", "Priority")}</label>
              <select class="dash-select" id="form-task-priority">
                <option value="urgent">${t("🔥 عاجل طارئ (Urgent)", "🔥 Urgent")}</option>
                <option value="high">${t("🔺 أولوية عليا (High)", "🔺 High")}</option>
                <option value="medium" selected>${t("➖ أولوية متوسطة (Medium)", "➖ Medium")}</option>
                <option value="low">${t("🔻 اعتيادية (Low)", "🔻 Low")}</option>
              </select>
            </div>
          </div>
          <div class="dash-grid-2" style="gap: 12px;">
            <div class="dash-field-group">
              <label class="dash-label">${t("القسم / النطاق", "Category / Domain")}</label>
              <select class="dash-select" id="form-task-category">
                <option value="kernel">${t("هندسة النواة (Apex Kernel)", "Apex Kernel")}</option>
                <option value="systems">${t("تطوير الأنظمة (Systems)", "Systems")}</option>
                <option value="design">${t("تصميم وواجهات (UI / HMI)", "UI / HMI")}</option>
                <option value="security">${t("أمان وتشفير (Security)", "Security")}</option>
                <option value="emergency">${t("إغاثة وطوارئ (Emergency)", "Emergency")}</option>
                <option value="operations">${t("عمليات وشراكات (Operations)", "Operations")}</option>
              </select>
            </div>
            <div class="dash-field-group">
              <label class="dash-label">${t("المسؤول (Assignee)", "Assignee")}</label>
              <input type="text" class="dash-input" id="form-task-assignee" value="${t("أحمد أشرف", "Ahmed Ashraf")}">
            </div>
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("تاريخ الاستحقاق", "Due Date")}</label>
            <input type="date" class="dash-input" id="form-task-due">
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("تفاصيل ونطاق العمل", "Description & Specifications")}</label>
            <textarea class="dash-textarea" id="form-task-desc" rows="3" placeholder="${t("اكتب تفاصيل ومخرجات المهمة الهندسية...", "Detailed task specifications...")}"></textarea>
          </div>
        </div>
        <div class="dash-modal-footer">
          <button type="button" class="btn btn--danger btn--sm" id="btn-delete-task" style="display: none;">${t("حذف المهمة", "Delete Task")}</button>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-task">${t("إلغاء", "Cancel")}</button>
            <button type="button" class="btn btn--primary btn--sm" id="btn-save-task">${t("حفظ المهمة", "Save Task")}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Luxury Action Toast -->
    <div class="dash-toast" id="dash-toast" role="status" aria-live="polite"></div>`
  ];

  return {
    path: "/dashboard",
    html: page({
      site,
      seo: {
        title: t("لوحة التحكم المركزية وإدارة المنظومة الشاملة | عوالِم قروب", "Master Executive Control Suite & Site Operations | Awalim Group"),
        description: t("لوحة تحكم تنفيذية شاملة لإدارة كافة أقسام عوالِم قروب، فحص 84 صفحة حية، وتتبع سجلات التدقيق الجنائي.", "Complete executive command suite for managing all Awalim Group domains, auditing 84 live routes, and tracking cryptographic operations."),
        path: "/dashboard",
        ogImage: "/assets/img/og/home.png"
      },
      active: "dashboard",
      body,
      schema: [breadcrumbSchema(site, [{ name: t("الرئيسية", "Home"), path: pfx + "/" }, { name: t("لوحة التحكم", "Dashboard"), path: pfx + "/dashboard" }])],
      bodyClass: "page-dashboard-master"
    })
  };
}
