import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";

export default function dashboard(ctx) {
  const isEn = ctx.locale === "en";
  const site = ctx.site;
  const pfx = isEn ? "/en" : "";

  const t = (ar, en) => isEn ? en : ar;

  const body = [
    `<!-- Top Executive Sovereign Control Header -->
    <header class="dash-master-header" data-ledger="dashboard" aria-label="${t("لوحة التحكم المركزية", "Sovereign Executive Command Suite")}">
      <div class="wrap wrap--wide">
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
            <span class="dash-tab-icon">📊</span>
            <span>${t("نظرة عامة والتحليلات", "Overview & Analytics")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="landing">
            <span class="dash-tab-icon">🏛️</span>
            <span>${t("الهوية والواجهة (Hero)", "Brand & Hero")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="projects">
            <span class="dash-tab-icon">💼</span>
            <span>${t("المشاريع ودراسات الحالة", "Portfolio & Cases")}</span>
            <span class="dash-tab-badge" id="badge-projects-count">8</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="services">
            <span class="dash-tab-icon">⚙️</span>
            <span>${t("الخدمات وباقات التعاقد", "Services & Pricing")}</span>
            <span class="dash-tab-badge">3</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="products">
            <span class="dash-tab-icon">🚀</span>
            <span>${t("الأنظمة والمنتجات", "Flagship Products")}</span>
            <span class="dash-tab-badge">4</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="academy">
            <span class="dash-tab-icon">🎓</span>
            <span>${t("الأكاديمية والمسارات", "Academy Tracks")}</span>
            <span class="dash-tab-badge">3</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="articles">
            <span class="dash-tab-icon">📰</span>
            <span>${t("المقالات والبحوث", "Articles & Research")}</span>
            <span class="dash-tab-badge">4</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="messages">
            <span class="dash-tab-icon">📬</span>
            <span>${t("الرسائل والاستفسارات", "Inquiries Hub")}</span>
            <span class="dash-tab-badge dash-tab-badge--alert" id="badge-unread-count">3 ${t("جديد", "New")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="testing">
            <span class="dash-tab-icon">🧪</span>
            <span>${t("مركز الفحص الشامل الحي", "Master Test Suite")}</span>
            <span class="dash-tab-badge dash-tab-badge--pass">84 ${t("ناجح", "PASS")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="security">
            <span class="dash-tab-icon">🛡️</span>
            <span>${t("الأمان والتدقيق الجنائي", "Security & Forensics")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="settings">
            <span class="dash-tab-icon">💾</span>
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
              <button type="button" class="btn btn--primary btn--sm" onclick="document.querySelector('[data-dash-tab=\'testing\']').click()">${t("🧪 بدء فحص شامل للمنظومة", "🧪 Run Master Site Audit")}</button>
              <button type="button" class="btn btn--ghost btn--sm" onclick="document.querySelector('[data-dash-tab=\'landing\']').click()">${t("🏛️ تعديل نصوص واجهة الهيرو", "🏛️ Edit Hero Headlines")}</button>
              <button type="button" class="btn btn--ghost btn--sm" id="btn-quick-add-project">${t("💼 إضافة دراسة حالة جديدة", "💼 Add New Case Study")}</button>
              <button type="button" class="btn btn--ghost btn--sm" onclick="document.querySelector('[data-dash-tab=\'messages\']').click()">${t("📬 فحص رسائل التعاقد الواردة", "📬 Review Enterprise RFPs")}</button>
              <button type="button" class="btn btn--ghost btn--sm" onclick="document.querySelector('[data-dash-tab=\'security\']').click()">${t("🛡️ فحص التوقيع التشفيري", "🛡️ Verify Crypto Keys")}</button>
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
              <span class="test-icon">🏗️</span>
              <b>${t("البناء واللغات", "Static Build")}</b>
              <small>${t("84 صفحة (عربي/إنجليزي)", "84 Pages (AR & EN)")}</small>
              <span class="badge badge--ok">✔ PASS (0 warn)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">✍️</span>
              <b>${t("التدقيق اللغوي", "Linguistics")}</b>
              <small>${t("5,731 نص مفحوص", "5,731 Nodes Checked")}</small>
              <span class="badge badge--ok">✔ PASS (0 typo)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">✒️</span>
              <b>${t("الخطوط والوصل", "Typography")}</b>
              <small>${t("خط الإسكندرية 900", "Alexandria 900 & Ligatures")}</small>
              <span class="badge badge--ok">✔ PASS (0 break)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">↔️</span>
              <b>${t("عزل النصوص (BiDi)", "BiDi Isolation")}</b>
              <small>${t("41 مساراً مركباً", "41 Compound Routes")}</small>
              <span class="badge badge--ok">✔ PASS (0 reversed)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">👁️</span>
              <b>${t("التباين والوصولية", "WCAG Contrast")}</b>
              <small>${t("النمط الليلي والنهاري", "Dark & Light Surfaces")}</small>
              <span class="badge badge--ok">✔ PASS (2.2 AA)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">🌐</span>
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
          <button type="button" class="btn btn--ghost btn--sm" id="btn-copy-proposal">${t("نسخ مسودة العرض المقترح 📋", "Copy Proposal Draft 📋")}</button>
          <button type="button" class="btn btn--primary btn--sm" id="btn-mark-inquiry-done">${t("تأكيد التواصل والمتابعة", "Confirm Coordination")}</button>
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
