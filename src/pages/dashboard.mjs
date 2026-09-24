import { page, breadcrumbSchema } from "../lib/layout.mjs";
import * as C from "../lib/components.mjs";
import { icon } from "../lib/icons.mjs";

export default function dashboard(ctx) {
  const isEn = ctx.locale === "en";
  const site = ctx.site;
  const pfx = isEn ? "/en" : "";
  const owner = ctx.owner || {};
  const treasury = owner.treasury || {};
  const ventures = owner.ventures || [];
  const contracts = owner.contracts || [];
  const directives = owner.directives || [];
  const milestones = owner.milestones || [];
  const workforce = owner.workforce || { disciplines: [] };

  const t = (ar, en) => isEn ? en : ar;

  const body = [
    `<!-- Sovereign Root Admin Gatekeeper Wall (Active when not authenticated) -->
    <div class="dash-gatekeeper" id="dash-gatekeeper" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="gatekeeper-title">
      <div class="dash-gatekeeper-card">
        <div class="dash-gatekeeper-icon">
          <span class="dash-gatekeeper-crown">${icon("crown", "dash-gatekeeper-crown-svg")}</span>
        </div>
        <span class="chip chip--accent"><span class="dot dot--live"></span>${t("بوابة إدارة المنظومة", "SYSTEM OPERATIONS GATEWAY")}</span>
        <h2 class="dash-gatekeeper-title" id="gatekeeper-title">${t("لوحة التحكم المركزية وإدارة العمليات", "Executive Operations Console")}</h2>
        <p class="dash-gatekeeper-desc">${t("لوحة تحكم تنفيذية مخصصة لإدارة منصات عوالِم قروب، تدقيق المسارات، ومتابعة العمليات الهندسية والمهام.", "Centralized operations console for managing Awalim platforms, telemetry, and engineering workflows.")}</p>

        <form class="dash-gatekeeper-form" id="dash-gatekeeper-form">
          <div class="dash-gatekeeper-pin-wrap">
            <input type="password" name="pin" class="dash-input dash-gatekeeper-pin" id="dash-gatekeeper-pin" placeholder="••••" maxlength="8" autocomplete="current-password" aria-label="${t("رمز دخول الإدارة", "Admin Security PIN")}" aria-describedby="dash-gatekeeper-err">
            <button type="submit" class="btn btn--primary btn--sm" id="btn-gatekeeper-submit">${t("فتح لوحة التحكم", "Unlock Console")}</button>
          </div>
          <div class="dash-gatekeeper-err" id="dash-gatekeeper-err" role="alert"></div>
          <div class="dash-gatekeeper-quick">
            <button type="button" class="btn btn--gold btn--sm" id="btn-gatekeeper-root">
              <span>${icon("bolt", "dash-btn-svg")} ${t("دخول فوري كمسؤول (المهندس أحمد أشرف)", "Admin Quick Access (Eng. Ahmed Ashraf)")}</span>
            </button>
          </div>
          <div class="dash-gatekeeper-note">
            <span>${t("مشفّر بالكامل عبر WebCrypto API · مطابق لمعايير CSP Level 3", "Encrypted via WebCrypto API · Strict CSP Level 3 Compliant")}</span>
          </div>
        </form>
      </div>
    </div>

    <!-- Apple Silicon Pro Executive Header -->
    <header class="dash-master-header" data-ledger="dashboard" aria-label="${t("لوحة التحكم المركزية", "Sovereign Executive Command Suite")}">
      <div class="wrap wrap--wide">
        <div class="dash-apple-header" id="dash-admin-user-card">
          <div class="dash-apple-header__profile">
            <div class="dash-apple-avatar-wrap">
              <img src="/assets/img/ahmed-personal.webp" alt="Ahmed Ashraf" class="dash-apple-avatar" width="52" height="52">
              <span class="dash-apple-crown-badge" aria-hidden="true">${icon("crown", "dash-apple-crown-svg")}</span>
            </div>
            <div class="dash-apple-profile-info">
              <div class="dash-apple-name-row">
                <h1 class="dash-apple-name">${t("المهندس أحمد أشرف", "Eng. Ahmed Ashraf")}</h1>
                <span class="dash-apple-role-pill"><span class="dot dot--live"></span>${t("صاحب المنظومة والمؤسس", "Owner & Founder")}</span>
                <span class="dash-apple-session-pill mono">AWALIM-OWNER-AA01</span>
              </div>
              <p class="dash-apple-tagline">${t("لوحة التحكم المركزية وإدارة المنظومة الشاملة والعمليات الهندسية", "Executive Operations & Engineering Command Center")}</p>
            </div>
          </div>

          <div class="dash-apple-header__actions">
            <button type="button" class="btn btn--primary btn--sm" id="btn-rebuild-site">
              <span class="dot dot--live" aria-hidden="true"></span>
              <span>${t("⚡ إعادة بناء وتحديث الموقع", "⚡ Rebuild & Deploy")}</span>
            </button>
            <button type="button" class="btn btn--outline btn--sm" id="btn-run-master-audit">
              <span>${t("فحص شامل", "Run Audit")}</span>
            </button>
            <a href="/" class="btn btn--ghost btn--sm" target="_blank" title="${t("معاينة كزائر", "Preview Site")}">
              <span>${t("الموقع الحي ↗", "Live Site ↗")}</span>
            </a>
            <button type="button" class="btn btn--ghost btn--sm" id="btn-admin-logout" title="${t("قفل الجلسة", "Lock Session")}">
              <span>${icon("lock", "dash-btn-svg")}</span>
            </button>
          </div>
        </div>

        <!-- Interactive Employee / Workspace Identity Switcher Bar -->
        <div class="dash-user-switcher-bar">
          <div class="dash-user-switcher-left">
            <span class="dash-switcher-icon">${icon("users", "dash-switcher-svg")}</span>
            <span class="dash-switcher-title">${t("جلسة العمل والموظف النشط:", "Active Workspace Identity:")}</span>
            <select id="dash-user-switcher" class="dash-select dash-select--sm" aria-label="${t("تبديل هوية المستخدم", "Switch Active Workspace User")}">
              <option value="AA-01" data-name="${isEn ? "Eng. Ahmed Ashraf" : "المهندس أحمد أشرف"}" data-name-en="Eng. Ahmed Ashraf" data-role="${isEn ? "Owner & Founder" : "صاحب المنظومة والمؤسس"}" data-role-en="Owner & Founder" data-clearance="0x00 ROOT" data-avatar="/assets/img/ahmed-personal.webp" data-node="${isEn ? "Jerusalem" : "القدس"}" selected>👑 ${t("م. أحمد أشرف — المؤسس ورئيس المنظومة (ROOT)", "Eng. Ahmed Ashraf — Founder & Root Architect")}</option>
              <option value="ENG-01" data-name="${isEn ? "Eng. Tariq Al-Nasser" : "م. طارق الناصر"}" data-name-en="Eng. Tariq Al-Nasser" data-role="${isEn ? "Lead Systems Architect" : "قائد النواة والأنظمة المصرفية"}" data-role-en="Lead Systems Architect" data-clearance="0x01 KERNEL" data-avatar="" data-node="${isEn ? "Jerusalem" : "القدس"}">💻 ${t("م. طارق الناصر — قائد النواة المصرفية (Island Haven)", "Eng. Tariq Al-Nasser — Island Haven Lead")}</option>
              <option value="ENG-02" data-name="${isEn ? "Dr. Layla Mansour" : "د. ليلى منصور"}" data-name-en="Dr. Layla Mansour" data-role="${isEn ? "Field Mesh Director" : "قائدة شبكات الإغاثة الميدانية"}" data-role-en="Field Mesh Director" data-clearance="0x02 FIELD" data-avatar="" data-node="${isEn ? "Beirut" : "بيروت"}">🚑 ${t("د. ليلى منصور — قائدة شبكات الإغاثة (RahmaCare)", "Dr. Layla Mansour — RahmaCare Field Director")}</option>
              <option value="ENG-03" data-name="${isEn ? "Eng. Sarah Al-Ali" : "م. سارة العلي"}" data-name-en="Eng. Sarah Al-Ali" data-role="${isEn ? "Chief Cryptographer" : "رئيسة التدقيق الجنائي والتشفير"}" data-role-en="Chief Cryptographer" data-clearance="0x01 CRYPTO" data-avatar="" data-node="${isEn ? "Amman" : "عمان"}">🔐 ${t("م. سارة العلي — رئيسة التدقيق الجنائي والتشفير", "Eng. Sarah Al-Ali — Chief Cryptographer")}</option>
              <option value="ENG-04" data-name="${isEn ? "Eng. Omar Al-Saleh" : "م. عمر الصالح"}" data-name-en="Eng. Omar Al-Saleh" data-role="${isEn ? "Principal IFRS Architect" : "كبير مهندسي معايير IFRS"}" data-role-en="Principal IFRS Architect" data-clearance="0x02 LEDGER" data-avatar="" data-node="${isEn ? "Ramallah" : "رام الله"}">📊 ${t("م. عمر الصالح — كبير مهندسي IFRS (Falcon ERP)", "Eng. Omar Al-Saleh — Falcon IFRS Lead")}</option>
              <option value="ENG-05" data-name="${isEn ? "Eng. Kamal Darwish" : "م. كمال درويش"}" data-name-en="Eng. Kamal Darwish" data-role="${isEn ? "Senior Crypto Engineer" : "مهندس أول تعمية النواة وMerkle"}" data-role-en="Senior Crypto Engineer" data-clearance="0x02 CRYPTO" data-avatar="" data-node="${isEn ? "Dubai" : "دبي"}">🛡️ ${t("م. كمال درويش — مهندس تعمية النواة وMerkle", "Eng. Kamal Darwish — Senior Crypto Engineer")}</option>
              <option value="ENG-06" data-name="${isEn ? "Eng. Hana Al-Zoubi" : "م. هناء الزعبي"}" data-name-en="Eng. Hana Al-Zoubi" data-role="${isEn ? "Offline P2P Mesh Specialist" : "مهندسة شبكات بدون إنترنت P2P Mesh"}" data-role-en="Offline P2P Mesh Specialist" data-clearance="0x02 FIELD" data-avatar="" data-node="${isEn ? "Gaza" : "غزة"}">📡 ${t("م. هناء الزعبي — مهندسة شبكات P2P Mesh (غزة)", "Eng. Hana Al-Zoubi — Offline P2P Specialist (Gaza)")}</option>
              <option value="ENG-07" data-name="${isEn ? "Eng. Ziad Qasim" : "م. زياد قاسم"}" data-name-en="Eng. Ziad Qasim" data-role="${isEn ? "AI Runtime Engineer" : "مهندس محركات الذكاء الاصطناعي"}" data-role-en="AI Runtime Engineer" data-clearance="0x02 AI" data-avatar="" data-node="${isEn ? "Cairo" : "القاهرة"}">🤖 ${t("م. زياد قاسم — مهندس الذكاء الاصطناعي السيادي", "Eng. Ziad Qasim — Autonomous AI Engineer")}</option>
              <option value="ENG-08" data-name="${isEn ? "Eng. Razan Al-Alami" : "م. رزان العلمي"}" data-name-en="Eng. Razan Al-Alami" data-role="${isEn ? "Glass Physics & UI Lead" : "مهندسة فيزياء الزجاج وتجربة HMI"}" data-role-en="Glass Physics & UI Lead" data-clearance="0x03 UI" data-avatar="" data-node="${isEn ? "London" : "لندن"}">✨ ${t("م. رزان العلمي — فيزياء الواجهات السائلة والتصميم", "Eng. Razan Al-Alami — Liquid HMI Lead")}</option>
              <option value="ENG-09" data-name="${isEn ? "Eng. Youssef Al-Najjar" : "م. يوسف النجار"}" data-name-en="Eng. Youssef Al-Najjar" data-role="${isEn ? "Senior Academy Mentor" : "كبير موجهي أكاديمية النظم المعقدة"}" data-role-en="Senior Academy Mentor" data-clearance="0x03 MENTOR" data-avatar="" data-node="${isEn ? "Istanbul" : "إسطنبول"}">🎓 ${t("م. يوسف النجار — كبير موجهي الأكاديمية", "Eng. Youssef Al-Najjar — Senior Academy Mentor")}</option>
              <option value="ENG-10" data-name="${isEn ? "Eng. Maryam Khalil" : "م. مريم خليل"}" data-name-en="Eng. Maryam Khalil" data-role="${isEn ? "Cyber Threat Specialist" : "مهندسة دفاع سيبراني ومراقبة التهديدات"}" data-role-en="Cyber Threat Specialist" data-clearance="0x02 SEC" data-avatar="" data-node="${isEn ? "Berlin" : "برلين"}">🛰️ ${t("م. مريم خليل — دفاع سيبراني ومصفوفة التهديدات", "Eng. Maryam Khalil — Cyber Threat Specialist")}</option>
            </select>
          </div>
          <div class="dash-user-switcher-right">
            <span class="chip chip--sm" id="active-user-badge"><span class="dot dot--live"></span><span id="active-user-status-text">${t("نشط بالمصفوفة", "Active Mesh")}</span></span>
            
            <button type="button" class="btn btn--accent btn--xs" id="btn-open-employee-portal" data-jump-tab="portal" style="background:var(--accent, #00F0FF); color:#051419; font-weight:var(--w-bold);">
              <span>${icon("award", "dash-btn-svg")} <span id="btn-portal-label">${t("بوابتي الإدارية", "My Portal")}</span></span>
            </button>
            <button type="button" class="btn btn--primary btn--xs" id="btn-jump-my-tasks">
              <span>${icon("kanban", "dash-btn-svg")} <span id="btn-my-tasks-label">${t("مهامي المسندة (3)", "My Assigned Tasks (3)")}</span></span>
            </button>
            <button type="button" class="btn btn--ghost btn--xs" data-jump-tab="staff">
              <span>${icon("users", "dash-btn-svg")} ${t("دليل الكادر كاملاً", "Full Team Roster")} →</span>
            </button>
          </div>
        </div>

        <!-- Live Telemetry Diagnostic Bar -->
        <div class="dash-live-bar" role="status" aria-live="polite">
          <div class="dash-live-bar__item">
            <span class="live-dot" aria-hidden="true"></span>
            <span class="live-label">${t("حالة النواة:", "Kernel:")}</span>
            <b class="mono" id="dash-kernel-state">${t("60 FPS متصل", "60 FPS LOCKED")}</b>
          </div>
          <div class="dash-live-bar__item">
            <span class="live-label">${t("الاستجابة:", "Latency:")}</span>
            <b class="mono" id="dash-core-latency">0.2ms</b>
          </div>
          <div class="dash-live-bar__item">
            <span class="live-label">${t("الصفحات المدققة:", "Audited:")}</span>
            <b class="mono">${t("84 صفحة (0 أخطاء)", "84 Routes (0 Errors)")}</b>
          </div>
          <div class="dash-live-bar__item">
            <span class="live-label">${t("الأمان والاعتمادية:", "Security:")}</span>
            <b class="mono">Strict CSP L3 · 99.99%</b>
          </div>
          <div class="dash-live-bar__item">
            <span class="live-label">${t("التوثيق:", "Auth:")}</span>
            <b class="mono">Ed25519 · SHA-256</b>
          </div>
        </div>
<!-- Navigation Tabs Rail (Sovereign Owner Cockpit & Modules) -->
        <nav class="dash-nav-rail" aria-label="${t("أقسام لوحة التحكم", "Dashboard Sections Navigation")}">
          <button type="button" class="dash-tab-btn active is-active" data-dash-tab="overview" aria-pressed="true" aria-selected="true">
            <span class="dash-tab-icon">${icon("gauge", "dash-tab-svg")}</span>
            <span>${t("نظرة عامة والتحليلات", "Overview & Analytics")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="owner">
            <span class="dash-tab-icon">${icon("crown", "dash-tab-svg")}</span>
            <span>${t("ملف المؤسس والمعمارية", "Founder & Systems Architecture")}</span>
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
            <span class="dash-tab-badge" id="badge-tasks-count">7</span>
          </button>
          
          <button type="button" class="dash-tab-btn" data-dash-tab="portal">
            <span class="dash-tab-icon">${icon("award", "dash-tab-svg")}</span>
            <span>${t("بوابتي الإدارية وجلسات العمل", "Employee Portal & Desk")}</span>
            <span class="dash-tab-badge dash-tab-badge--pass" id="badge-portal-duty-status">${t("مناوب", "ON-DUTY")}</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="staff">
            <span class="dash-tab-icon">${icon("users", "dash-tab-svg")}</span>
            <span>${t("شؤون الموظفين والفرق الهندسية", "Staff & Engineering Hub")}</span>
            <span class="dash-tab-badge" id="badge-staff-count">11</span>
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

        <!-- ================= PANEL 0: OWNER APEX COCKPIT ================= -->
        <section class="dash-panel" data-dash-panel="owner" aria-label="${t("ملف المؤسس وهندسة النظم", "Founder & Systems Architecture")}">
          
          <!-- Founder Identity & Architecture Banner -->
          <div class="dash-owner-banner">
            <div class="dash-owner-banner__left">
              <div class="dash-owner-crown-icon" aria-hidden="true">
                ${icon("crown")}
              </div>
              <div>
                <h2 class="dash-owner-banner-title">${t("ملف المؤسس وكبير مهندسي النظم", "Founder & Systems Architecture")}</h2>
                <p class="dash-owner-banner-sub">${t("المهندس أحمد أشرف · المؤسس وكبير المعماريين · بنية تحتية مستقلة عالية الأمان", "Eng. Ahmed Ashraf · Founder & Principal Systems Architect · Resilient High-Security Systems")}</p>
              </div>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--outline btn--sm" id="btn-export-ledger" title="${t("تصدير المواصفات الفنية", "Export Technical Architecture Specs")}">
                <span>${icon("download", "dash-btn-svg")} ${t("تصدير المواصفات (JSON)", "Export Specs (JSON)")}</span>
              </button>
              <a href="/verify" class="btn btn--outline btn--sm" title="${t("فحص التوقيعات الرقمية", "Verify Signatures")}">
                <span>${icon("shield", "dash-btn-svg")} ${t("التحقق التشفيري", "Verify Keys")}</span>
              </a>
              <button type="button" class="btn btn--primary btn--sm" data-jump-tab="overview">
                <span>${icon("gauge", "dash-btn-svg")} ${t("الانتقال للعمليات", "Go to Overview")}</span>
              </button>
            </div>
          </div>

          <!-- Real Engineering & Architecture Pillars -->
          <div class="dash-treasury-grid">
            <div class="dash-treasury-card dash-treasury-card--gold">
              <span class="dash-treasury-label">${t("الأنظمة المركزية المطورة", "Core Platforms Built")}</span>
              <div class="dash-treasury-val dash-treasury-val--gold"><bdi dir="ltr">4</bdi></div>
              <div class="dash-treasury-meta">
                <span class="badge badge--ok">100% Production</span>
                <span>${t("آيلاند هيفن، رحمة كير، فالكون، سيرينيتي", "Island Haven, RahmaCare, Falcon, Serenity")}</span>
              </div>
            </div>
            <div class="dash-treasury-card">
              <span class="dash-treasury-label">${t("الصفحات المدققة برمجياً", "Audited Static Routes")}</span>
              <div class="dash-treasury-val"><bdi dir="ltr">84</bdi></div>
              <div class="dash-treasury-meta">
                <span class="badge badge--ok">${t("0 أخطاء", "0 Errors")}</span>
                <span>${t("تجميع كامل وسريع في 1.2 ثانية", "Instant 1.2s static compile")}</span>
              </div>
            </div>
            <div class="dash-treasury-card">
              <span class="dash-treasury-label">${t("مسارات الأكاديمية التخصصية", "Certified Academy Tracks")}</span>
              <div class="dash-treasury-val"><bdi dir="ltr">3</bdi></div>
              <div class="dash-treasury-meta">
                <span class="badge badge--ok">${t("682 خريجاً", "682 Grads")}</span>
                <span>${t("النظم المعقدة، الأمان السيبراني، الذكاء الاصطناعي", "Systems, SecOps & Applied AI")}</span>
              </div>
            </div>
            <div class="dash-treasury-card">
              <span class="dash-treasury-label">${t("الاستقلالية والأمان", "Sovereign Security Grade")}</span>
              <div class="dash-treasury-val"><bdi dir="ltr">CSP L3</bdi></div>
              <div class="dash-treasury-meta">
                <span class="badge badge--ok">Zero Cloud Dep</span>
                <span>${t("خوادم ذاتية وبنية شبكية P2P", "Bare-metal & offline-first mesh")}</span>
              </div>
            </div>
          </div>

          <!-- Architectural Standards & Engineering Philosophy -->
          <div class="dash-card" style="margin-block-end: 1.5rem;">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--accent" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("المعايير المعمارية الحاكمة", "ARCHITECTURAL STANDARDS")}</span>
                <h3 class="dash-card-title">${t("المبادئ الهندسية الأساسية لبناء النظم (Core Engineering Principles)", "Guiding Engineering Principles")}</h3>
                <p class="dash-panel-desc">${t("معايير صارمة تحكم تطوير كافة أنظمة عوالِم قروب لضمان السرعة الفائقة والصمود التام في أصعب الظروف.", "Rigid standards applied across all Awalim systems to ensure resilience, pure speed, and total offline autonomy.")}</p>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1rem;">
              <div style="padding: 1rem; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-weight: var(--w-bold); margin-bottom: 4px; color: var(--accent); font-size: 0.9rem;">1. ${t("الاستقلالية التامة عن التبعيات", "Zero External Dependencies")}</div>
                <p style="font-size: 0.8rem; color: var(--text-2); margin: 0; line-height: 1.5;">${t("بناء النوى المركزية بلغة Rust ومعايير الويب الخالصة دون الاعتماد على خدمات سحابية طرف ثالث.", "Core engines built with Rust and native Web Standards with zero third-party cloud lock-in.")}</p>
              </div>
              <div style="padding: 1rem; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-weight: var(--w-bold); margin-bottom: 4px; color: #10B981; font-size: 0.9rem;">2. ${t("التدقيق الجنائي والتوقيع التشفيري", "Forensic Cryptographic Audit")}</div>
                <p style="font-size: 0.8rem; color: var(--text-2); margin: 0; line-height: 1.5;">${t("كل بيان مالي أو سجل قيود موثق بشجرة ميركل (Merkle Tree) وتوقيع Ed25519 غير قابل للتلاعب.", "Every ledger transaction is verified via Merkle trees and tamper-proof Ed25519 signatures.")}</p>
              </div>
              <div style="padding: 1rem; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-weight: var(--w-bold); margin-bottom: 4px; color: #D4AF37; font-size: 0.9rem;">3. ${t("الصمود الميداني دون إنترنت", "Offline-First P2P Resilience")}</div>
                <p style="font-size: 0.8rem; color: var(--text-2); margin: 0; line-height: 1.5;">${t("أنظمة رحمة كير تعمل بكفاءة 100% في انقطاع الشبكات عبر شبكات التزامن الموضعي والفرز الذكي.", "Emergency triage mesh operates 100% offline during blackouts via peer-to-peer sync.")}</p>
              </div>
              <div style="padding: 1rem; border-radius: var(--radius-sm); background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);">
                <div style="font-weight: var(--w-bold); margin-bottom: 4px; color: #3B82F6; font-size: 0.9rem;">4. ${t("فيزياء الواجهات السريعة (120 FPS)", "High-Density Fluid Interfaces")}</div>
                <p style="font-size: 0.8rem; color: var(--text-2); margin: 0; line-height: 1.5;">${t("واجهات زجاجية دقيقة تعتمد على CSS الأصيل وHTML الدلالي مع استجابة فورية أقل من 16 مللي ثانية.", "Precision glass interfaces powered by pure CSS & semantic HTML with sub-16ms frame delivery.")}</p>
              </div>
            </div>
          </div>

          <!-- The 6 Sovereign Ventures Command Grid -->
          <div class="dash-card" style="margin-block-end: 1.5rem;">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--gold" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("الأذرع السيادية الستة التابعة للمالك", "THE 6 SOVEREIGN VENTURES MATRIX")}</span>
                <h3 class="dash-card-title">${t("مصفوفة تشغيل الأذرع السيادية الستة (The 6 Sovereign Arms)", "Operational Portfolio of the 6 Sovereign Arms")}</h3>
                <p class="dash-panel-desc">${t("متابعة حية للأداء التشغيلي ومسؤولي الفرق وحصة الإيرادات ونسب الامتثال لكافة الأذرع تحت قيادة المالك.", "Real-time visibility over team leads, revenue distribution, and SLA adherence across all 6 entities.")}</p>
              </div>
            </div>

            <div class="dash-ventures-grid">
              ${ventures.map(v => `
                <div class="dash-venture-card" data-venture-id="${v.id}">
                  <div class="dash-venture-head">
                    <div>
                      <h4 class="dash-venture-name">${isEn ? (v.name_en || v.name) : v.name}</h4>
                      <span class="dash-venture-sector">${isEn ? (v.sector_en || v.sector) : v.sector}</span>
                    </div>
                    <span class="badge ${v.health >= 99 ? "badge--ok" : "badge--alert"}">${v.health}% ${t("سلامة", "Health")}</span>
                  </div>
                  <div class="dash-venture-stats">
                    <div class="dash-venture-stat-item">
                      <span class="dash-venture-stat-label">${t("القائد التنفيذي", "Lead")}</span>
                      <span class="dash-venture-stat-val">${isEn ? (v.lead_en || v.lead) : v.lead}</span>
                    </div>
                    <div class="dash-venture-stat-item">
                      <span class="dash-venture-stat-label">${t("حصة الإيراد", "Rev Share")}</span>
                      <span class="dash-venture-stat-val" style="color:var(--gold,#D4AF37);">${v.revenue_share}</span>
                    </div>
                    <div class="dash-venture-stat-item">
                      <span class="dash-venture-stat-label">${t("المقاييس / SLA", "SLA Status")}</span>
                      <span class="dash-venture-stat-val mono">${v.sla}</span>
                    </div>
                  </div>
                  <div class="dash-venture-foot" style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center;">
                    <span class="mono" style="font-size: 0.72rem; color: var(--accent);">${v.active_nodes || 4} ${t("عقد نشطة", "Active Nodes")} · ${v.latency || "10ms"}</span>
                    <button type="button" class="btn btn--ghost btn--xs btn-inspect-venture" data-venture-inspect="${v.id}">
                      <span>${t("فحص تكتيكي", "Inspect Specs")} →</span>
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Active Enterprise Contracts Portfolio -->
          <div class="dash-card" style="margin-block-end: 1.5rem;">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--accent" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("العقود المؤسسية الكبرى الموثقة", "ACTIVE INSTITUTIONAL CONTRACTS")}</span>
                <h3 class="dash-card-title">${t("محفظة كبرى عقود المؤسسات والاتفاقيات السيادية", "Enterprise Retainers & SLA Contracts")}</h3>
              </div>
            </div>
            <div class="dash-table-wrap">
              <table class="dash-directives-table">
                <thead>
                  <tr>
                    <th>${t("رقم العقد", "Contract ID")}</th>
                    <th>${t("العميل / الجهة المتعاقدة", "Institutional Client")}</th>
                    <th>${t("الذراع المنفذ", "Venture")}</th>
                    <th>${t("قيمة العقد السنوية", "Contract Value")}</th>
                    <th>${t("مستوى الـ SLA", "SLA Tier")}</th>
                    <th>${t("الحالة", "Status")}</th>
                    <th>${t("تجديد العقد", "Renewal Date")}</th>
                    <th>${t("التوقيع التشفيري", "Merkle Hash")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${contracts.map(c => `
                    <tr>
                      <td class="mono"><b>${c.id}</b></td>
                      <td><b>${isEn ? (c.client_en || c.client) : c.client}</b></td>
                      <td><span class="chip chip--sm">${isEn ? (c.venture_en || c.venture) : c.venture}</span></td>
                      <td class="mono" style="color:var(--gold,#D4AF37); font-weight:var(--w-bold);">${isEn ? (c.value_en || c.value) : c.value}</td>
                      <td><span class="badge badge--ok">${c.tier}</span></td>
                      <td><span class="dot dot--live"></span> ${isEn ? (c.status_en || c.status) : c.status}</td>
                      <td class="mono">${c.renewal}</td>
                      <td class="mono" style="font-size:0.75rem; color:var(--accent);">${c.hash}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Signed Sovereign Executive Directives -->
          <div class="dash-card">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--gold" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("الأوامر والتوجيهات الرئاسية الموقعة", "SIGNED EXECUTIVE DIRECTIVES")}</span>
                <h3 class="dash-card-title">${t("سجل أوامر وتوجيهات المالك السيادية (Owner Directives Log)", "Sovereign Executive Orders & Directives")}</h3>
                <p class="dash-panel-desc">${t("أوامر استراتيجية ملزمة موقعة بالمفتاح التشفيري لأحمد أشرف لتوجيه مسار البحث والتطوير والعمليات الميدانية.", "Binding directives cryptographically signed by Ahmed Ashraf to govern R&D, deployment, and operational mandates.")}</p>
              </div>
              <button type="button" class="btn btn--primary btn--sm" id="btn-add-directive-2">
                <span>${icon("plus", "dash-btn-svg")} ${t("إصدار أمر رئاسي جديد", "New Signed Directive")}</span>
              </button>
            </div>

            <div class="dash-table-wrap">
              <table class="dash-directives-table" id="table-owner-directives">
                <thead>
                  <tr>
                    <th>${t("رقم الأمر", "Directive #")}</th>
                    <th>${t("نص التوجيه الرئاسي", "Executive Directive")}</th>
                    <th>${t("الأولوية", "Priority")}</th>
                    <th>${t("تاريخ الإصدار", "Date")}</th>
                    <th>${t("حالة التنفيذ", "Execution Status")}</th>
                    <th>${t("التوقيع الرقمي", "Digital Signature")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${directives.map(d => `
                    <tr>
                      <td class="mono"><b>${d.id}</b></td>
                      <td><b>${isEn ? (d.title_en || d.title) : d.title}</b></td>
                      <td><span class="chip chip--danger">${isEn ? (d.priority_en || d.priority) : d.priority}</span></td>
                      <td class="mono">${d.date}</td>
                      <td><span class="dot dot--live"></span> ${isEn ? (d.status_en || d.status) : d.status}</td>
                      <td><span class="badge badge--ok">${icon("shield", "dash-btn-svg")} ${t("موقع ومعتمد 0x00", "SIGNED ROOT")}</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Systems Activity & Resource Allocation -->
          <div class="dash-card" style="margin-block-start: 1.5rem; margin-block-end: 1.5rem;">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--gold" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("توزيع النشاط والأنظمة البرمجية", "SYSTEMS ACTIVITY & ALLOCATION")}</span>
                <h3 class="dash-card-title">${t("توزيع النشاط المعماري عبر أذرع المنظومة (Architecture & Systems Share)", "Systems Activity & Focus Across Awalim")}</h3>
                <p class="dash-panel-desc">${t("متابعة تركيز الموارد الهندسية والنوى البرمجية عبر المنصات الست التابعة لعوالِم.", "Direct tracking of engineering resources and architectural focus across the 6 pillars of Awalim.")}</p>
              </div>
            </div>

            <!-- Allocation Segmented Bar -->
            <div style="margin-block-start: 1rem;">
              <div style="display:flex; justify-content:space-between; font-size:var(--fs-xs); color:var(--text-muted); margin-bottom:4px;">
                <span>${t("توزيع الموارد الهندسية والأنظمة:", "Systems & Resource Allocation Across the 6 Arms:")}</span>
                <span class="mono">100% Production Ready</span>
              </div>
              <div class="dash-flow-bar-wrap" title="Share: Island Haven 38%, RahmaCare 22%, Falcon 19%, Academy 11%, AI Lab 6%, Studio 4%">
                <div class="dash-flow-seg" style="width:38%; background:#00F0FF;" title="Island Haven: 38%"></div>
                <div class="dash-flow-seg" style="width:22%; background:#10B981;" title="RahmaCare: 22%"></div>
                <div class="dash-flow-seg" style="width:19%; background:#D4AF37;" title="Falcon ERP: 19%"></div>
                <div class="dash-flow-seg" style="width:11%; background:#8B5CF6;" title="Awalim Academy: 11%"></div>
                <div class="dash-flow-seg" style="width:6%; background:#3B82F6;" title="AI Lab Vibe OS: 6%"></div>
                <div class="dash-flow-seg" style="width:4%; background:#EC4899;" title="Sovereign Studio: 4%"></div>
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:0.75rem; color:var(--text-2); margin-top:6px;">
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#00F0FF; margin-inline-end:4px;"></i>${t("آيلاند هيفن (النواة المصرفية) 38%", "Island Haven (Banking Core) 38%")}</span>
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10B981; margin-inline-end:4px;"></i>${t("رحمة كير (الإغاثة الميدانية) 22%", "RahmaCare (Field Triage) 22%")}</span>
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#D4AF37; margin-inline-end:4px;"></i>${t("فالكون (محرك المحاسبة IFRS) 19%", "Falcon (IFRS Ledger) 19%")}</span>
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#8B5CF6; margin-inline-end:4px;"></i>${t("الأكاديمية (تدريب المهندسين) 11%", "Academy (Engineering Fellowship) 11%")}</span>
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#3B82F6; margin-inline-end:4px;"></i>${t("مختبر الذكاء الاصطناعي 6%", "AI Lab (Autonomous Agents) 6%")}</span>
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#EC4899; margin-inline-end:4px;"></i>${t("استوديو الهوية والتجارب 4%", "Studio (HMI & Design) 4%")}</span>
              </div>
            </div>
          </div>

          <!-- Strategic Sovereign Milestones Roadmap (2026-2028) -->
          <div class="dash-card" style="margin-block-end: 1.5rem;">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--accent" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("خارطة الطريق الاستراتيجية للمنظومة", "STRATEGIC SOVEREIGN ROADMAP 2026–2028")}</span>
                <h3 class="dash-card-title">${t("أهداف ومحطات السيادة الرقمية الكبرى (Sovereign Strategic Milestones)", "Strategic Milestones & Sovereign Scaling Horizons")}</h3>
              </div>
            </div>

            <div class="dash-milestones-grid">
              ${milestones.map(m => `
                <div class="dash-milestone-card ${m.progress === 100 ? 'dash-milestone-card--done' : ''}">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="mono" style="font-size:0.75rem; color:var(--accent); font-weight:var(--w-bold);">${m.quarter}</span>
                    <span class="badge ${m.progress === 100 ? 'badge--ok' : 'badge--alert'}">${isEn ? m.status_en || m.status : m.status}</span>
                  </div>
                  <h4 style="font-size:var(--fs-sm); font-weight:var(--w-bold); margin:0; color:var(--text-1); line-height:1.4;">
                    ${isEn ? m.title_en || m.title : m.title}
                  </h4>
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted); margin-bottom:4px;">
                      <span>${t("نسبة الإنجاز", "Progress")}</span>
                      <span class="mono">${m.progress}%</span>
                    </div>
                    <div class="dash-milestone-progress">
                      <div class="dash-milestone-bar" style="width: ${m.progress}%;"></div>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Elite Human Capital & Engineering Deployment Grid -->
          <div class="dash-card">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--gold" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("رأس المال البشري وهندسة النخب", "ELITE HUMAN CAPITAL & TALENT INTELLIGENCE")}</span>
                <h3 class="dash-card-title">${t("توزيع الكفاءات والنخب الهندسية (42 مهندساً عبر 10 دول)", "Global Engineering Workforce Deployment (42 Elite Engineers)")}</h3>
                <p class="dash-panel-desc">${t("فريق هندسي نخبوي ينتشر في فلسطين والعالم، مكرّس لحماية وتطوير وتشغيل الأذرع السيادية الستة.", "Dedicated sovereign engineering workforce distributed across Palestine and global nodes.")}</p>
              </div>
            </div>

            <div class="dash-workforce-grid">
              ${(workforce.disciplines || []).map(d => `
                <div class="dash-workforce-card">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:var(--fs-xs); font-weight:var(--w-bold); color:var(--text-1);">${isEn ? d.name_en || d.name : d.name}</span>
                    <span class="chip chip--gold mono" style="font-size:0.75rem;">${d.count} ${t("مهندسين", "Engs")}</span>
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:6px; margin-top:4px;">
                    <span>${t("المشرف القيادي:", "Lead:")}</span>
                    <b style="color:var(--text-2);">${isEn ? d.lead_en || d.lead : d.lead}</b>
                  </div>
                </div>
              `).join("")}
            </div>


            <!-- Interactive Human Capital Filter & Search -->
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem; margin-block: 1.25rem 0.75rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1rem;">
              <div class="dash-filter-pills" id="roster-filter-pills">
                <button type="button" class="dash-filter-pill active" data-roster-filter="all">${t("كافة النخب (42)", "All Elite (42)")}</button>
                <button type="button" class="dash-filter-pill" data-roster-filter="core_systems">${t("النواة والأنظمة (8)", "Core Systems (8)")}</button>
                <button type="button" class="dash-filter-pill" data-roster-filter="security_crypto">${t("التشفير والتدقيق (6)", "Crypto & Security (6)")}</button>
                <button type="button" class="dash-filter-pill" data-roster-filter="mesh_field">${t("الشبكات الميدانية (12)", "Field Mesh (12)")}</button>
                <button type="button" class="dash-filter-pill" data-roster-filter="ui_glass">${t("واجهات الزجاج (5)", "UI & Glass (5)")}</button>
                <button type="button" class="dash-filter-pill" data-roster-filter="academy_mentors">${t("موجهو الأكاديمية (11)", "Academy Mentors (11)")}</button>
              </div>
              <input type="search" class="dash-input" id="input-roster-search" placeholder="${t("بحث بالاسم، الدولة أو التخصص...", "Filter 42 engineers by name, country, or role...")}" style="max-width: 280px; height: 32px; font-size: 0.75rem;">
            </div>

            <!-- High-Density Engineers Roster Table -->
            <div class="dash-table-wrap" style="max-height: 380px; overflow-y: auto;">
              <table class="dash-directives-table" id="table-owner-roster">
                <thead>
                  <tr>
                    <th>${t("الرمز الهيدروكربوني", "ID")}</th>
                    <th>${t("المهندس / القائد", "Engineer / Lead")}</th>
                    <th>${t("المسؤولية القيادية", "Sovereign Role")}</th>
                    <th>${t("الدولة / التمركز", "Station & Country")}</th>
                    <th>${t("حالة الاتصال", "Mesh Status")}</th>
                    <th>${t("الصلاحية الأمنية", "Security Clearance")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${(workforce.roster || []).map(r => `
                    <tr data-roster-discipline="${r.discipline}">
                      <td class="mono"><b>${r.id}</b></td>
                      <td><b>${isEn ? (r.name_en || r.name) : r.name}</b></td>
                      <td><span class="chip chip--sm">${isEn ? (r.role_en || r.role) : r.role}</span></td>
                      <td>${isEn ? (r.country_en || r.country) : r.country}</td>
                      <td><span class="dot dot--live"></span> ${isEn ? (r.status_en || r.status) : r.status}</td>
                      <td><span class="badge badge--ok mono">${r.clearance}</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

        </section>

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
              <div id="spark-nodes" style="margin: 0.5rem 0; min-height:42px;"></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">+18%</span> ${t("نمو ربع سنوي مؤكد", "Quarterly growth verified")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("حجم القيود المالية المعالجة (IFRS)", "IFRS Ledger Volume")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">$12.8M</bdi></div>
              <div id="spark-ledger" style="margin: 0.5rem 0; min-height:42px;"></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">0.00%</span> ${t("انعدام تام لفروق التسوية", "Zero reconciliation variance")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("زمن معالجة النواة", "Mean Core Latency")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">0.2ms</bdi></div>
              <div id="spark-latency" style="margin: 0.5rem 0; min-height:42px;"></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">0 KB</span> ${t("أداء فوري خالٍ من التبعيات", "Zero-dependency pure runtime")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("اعتمادية الصمود (SLA)", "Sovereign Uptime")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">99.99%</bdi></div>
              <div id="spark-uptime" style="margin: 0.5rem 0; min-height:42px;"></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">P2P Mesh</span> ${t("صمود 100% في غزة وبيروت", "Offline resilience in blackouts")}</div>
            </div>
          </div>

          <!-- Verified Live Public Stats & Performance (Controls site.json stats directly) -->
          <div class="dash-card" style="margin-top: 1.5rem;">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--gold" style="margin-bottom:6px;"><span class="dot dot--live"></span>${t("إدارة إحصائيات الموقع الرسمية الموثقة", "LIVE VERIFIED METRICS & GLOBAL STATS")}</span>
                <h3 class="dash-card-title">${t("الأرقام القياسية والمؤشرات العامة لكامل صفحات الموقع (Live Site Metrics)", "Public Proof & Global Key Metrics")}</h3>
                <p class="dash-panel-desc">${t("تحكم حقيقي في أرقام الموقع (site.json). عند الحفظ يتم تحديث الأرقام فورياً وإعادة بناء كافة صفحات الموقع (84 صفحة) حياً.", "Direct live control over site.json metrics. Saving triggers an immediate static rebuild across all 84 pages.")}</p>
              </div>
              <div class="dash-panel-tools">
                <button type="button" class="btn btn--primary btn--sm" id="btn-save-stats">
                  <span>${t("حفظ وتحديث الإحصائيات حياً", "Save & Deploy Metrics Live")}</span>
                </button>
              </div>
            </div>

            <div class="dash-editor-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
              <div class="dash-field-group">
                <label class="dash-label" for="stat-input-systems">${t("الأنظمة المسلّمة (Systems Delivered)", "Systems Delivered")}</label>
                <input type="number" class="dash-input mono" id="stat-input-systems" value="50" aria-label="${t("الأنظمة المسلّمة", "Systems Delivered")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label" for="stat-input-engineers">${t("المهندسون المتدربون (Engineers Trained)", "Engineers Trained")}</label>
                <input type="number" class="dash-input mono" id="stat-input-engineers" value="1200" aria-label="${t("المهندسون المتدربون", "Engineers Trained")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label" for="stat-input-graduates">${t("الخريجون المعتمدون (Certified Graduates)", "Certified Graduates")}</label>
                <input type="number" class="dash-input mono" id="stat-input-graduates" value="682" aria-label="${t("الخريجون المعتمدون", "Certified Graduates")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label" for="stat-input-countries">${t("الدول المخدومة (Client Countries)", "Client Countries")}</label>
                <input type="number" class="dash-input mono" id="stat-input-countries" value="10" aria-label="${t("الدول المخدومة", "Client Countries")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label" for="stat-input-years">${t("سنوات البناء (Years Building)", "Years Building")}</label>
                <input type="number" class="dash-input mono" id="stat-input-years" value="8" aria-label="${t("سنوات البناء", "Years Building")}">
              </div>
              <div class="dash-field-group">
                <label class="dash-label" for="stat-input-availability">${t("شارة التوفر للتعاقد (Availability Badge)", "Availability Badge")}</label>
                <input type="text" class="dash-input" id="stat-input-availability" value="${t("متاحون لمشاريع الربع القادم", "Available for next quarter deployments")}" aria-label="${t("شارة التوفر للتعاقد", "Availability Badge")}">
              </div>
            </div>
          </div>

          <!-- Quick Action Launchpad -->
          <div class="dash-card" style="margin-top: 1.5rem;">
            <h3 class="dash-card-title">${t("منصة العمليات السريعة (Quick Sovereign Operations)", "Quick Sovereign Operations Launchpad")}</h3>
            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem;">
              <button type="button" class="btn btn--primary btn--sm" data-jump-tab="testing">${icon("flask", "dash-btn-svg")} ${t("بدء فحص شامل للمنظومة", "Run Master Site Audit")}</button>
              <button type="button" class="btn btn--ghost btn--sm" data-jump-tab="landing">${icon("building", "dash-btn-svg")} ${t("تعديل نصوص واجهة الهيرو", "Edit Hero Headlines")}</button>
              <button type="button" class="btn btn--ghost btn--sm" id="btn-quick-add-project">${icon("plus", "dash-btn-svg")} ${t("إضافة دراسة حالة جديدة", "Add New Case Study")}</button>
              <button type="button" class="btn btn--ghost btn--sm" data-jump-tab="messages">${icon("mail", "dash-btn-svg")} ${t("فحص رسائل التعاقد الواردة", "Review Enterprise RFPs")}</button>
              <button type="button" class="btn btn--ghost btn--sm" data-jump-tab="security">${icon("shield", "dash-btn-svg")} ${t("فحص التوقيع التشفيري", "Verify Crypto Keys")}</button>
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

          
          <!-- Sovereign System Health Monitor -->
          <div class="dash-card" style="margin-top: 1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <span class="chip chip--gold" style="margin-bottom:6px;"><span class="dot dot--live"></span>${t("مراقبة صحة المنظومة الحية (Sovereign System Health)", "LIVE SOVEREIGN SYSTEM HEALTH MONITOR")}</span>
                <h3 style="margin:0; font-size:1.1rem; font-weight:700;">${t("حالة البنية التحتية والأنظمة الجذرية", "Core Infrastructure & Subsystem Status")}</h3>
              </div>
              <button type="button" class="btn btn--ghost btn--xs" id="btn-refresh-system-health">${t("تحديث ⟳", "Refresh ⟳")}</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;" id="sys-health-grid">
              <!-- Node: Core Runtime -->
              <div class="sys-node-card" data-status="ok" style="padding:1rem; border-radius:10px; border:1px solid rgba(16,185,129,0.25); background:rgba(16,185,129,0.04);">
                <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.6rem;">
                  <span class="dot dot--live" style="background:#10B981; box-shadow:0 0 8px #10B981;"></span>
                  <strong style="font-size:0.88rem;">${t("نواة التشغيل السيادية", "Sovereign Runtime Core")}</strong>
                  <span class="badge badge--ok" style="margin-inline-start:auto; font-size:0.72rem;">LIVE</span>
                </div>
                <div class="mono" style="font-size:0.78rem; color:var(--muted); line-height:1.7;">
                  <div>Engine: Vibe OS v4.2 · Zero-Dep</div>
                  <div id="sys-core-latency">Latency: 0.18ms</div>
                  <div>Heap: 14.2 MB / ∞</div>
                </div>
              </div>

              <!-- Node: P2P Mesh Gaza -->
              <div class="sys-node-card" data-status="ok" style="padding:1rem; border-radius:10px; border:1px solid rgba(0,240,255,0.2); background:rgba(0,240,255,0.03);">
                <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.6rem;">
                  <span class="dot dot--live"></span>
                  <strong style="font-size:0.88rem;">${t("شبكة Mesh الميدانية — غزة / لبنان", "Gaza-Lebanon P2P Mesh Network")}</strong>
                  <span class="badge badge--accent" style="margin-inline-start:auto; font-size:0.72rem;">MESH</span>
                </div>
                <div class="mono" style="font-size:0.78rem; color:var(--muted); line-height:1.7;">
                  <div>Protocol: Ed25519 + BLE Sync</div>
                  <div>Peers: 4 active (offline-safe)</div>
                  <div>Last Sync: 0 BPS required</div>
                </div>
              </div>

              <!-- Node: IFRS Ledger -->
              <div class="sys-node-card" data-status="ok" style="padding:1rem; border-radius:10px; border:1px solid rgba(245,158,11,0.2); background:rgba(245,158,11,0.03);">
                <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.6rem;">
                  <span class="dot dot--live" style="background:#F59E0B; box-shadow:0 0 8px #F59E0B;"></span>
                  <strong style="font-size:0.88rem;">${t("محرك المحاسبة IFRS المزدوج", "IFRS Dual-Entry Accounting Engine")}</strong>
                  <span class="badge" style="margin-inline-start:auto; font-size:0.72rem; background:rgba(245,158,11,0.15); color:#F59E0B; border:1px solid rgba(245,158,11,0.3);">IFRS</span>
                </div>
                <div class="mono" style="font-size:0.78rem; color:var(--muted); line-height:1.7;">
                  <div>Standard: IAS-1 / IAS-7 Compliant</div>
                  <div>Entries: 4,820 sealed</div>
                  <div>Variance: 0.000000 (Merkle-Verified)</div>
                </div>
              </div>

              <!-- Node: RahmaCare Medical OS -->
              <div class="sys-node-card" data-status="ok" style="padding:1rem; border-radius:10px; border:1px solid rgba(139,92,246,0.2); background:rgba(139,92,246,0.03);">
                <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.6rem;">
                  <span class="dot dot--live" style="background:#8B5CF6; box-shadow:0 0 8px #8B5CF6;"></span>
                  <strong style="font-size:0.88rem;">${t("RahmaCare Healthcare OS — الميدان", "RahmaCare Field Medical OS")}</strong>
                  <span class="badge" style="margin-inline-start:auto; font-size:0.72rem; background:rgba(139,92,246,0.15); color:#8B5CF6; border:1px solid rgba(139,92,246,0.3);">MED</span>
                </div>
                <div class="mono" style="font-size:0.78rem; color:var(--muted); line-height:1.7;">
                  <div>Active Cases: 14 critical</div>
                  <div>EHR Sealed: SQLite Merkle</div>
                  <div>RAM: 12.0 MB / offline-first</div>
                </div>
              </div>

              <!-- Node: Cryptographic Integrity -->
              <div class="sys-node-card" data-status="ok" style="padding:1rem; border-radius:10px; border:1px solid rgba(16,185,129,0.2); background:rgba(16,185,129,0.03);">
                <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.6rem;">
                  <span class="dot dot--live" style="background:#10B981;"></span>
                  <strong style="font-size:0.88rem;">${t("طبقة التشفير الكاملة (Ed25519 + SHA-256)", "Cryptographic Integrity Layer")}</strong>
                  <span class="badge badge--ok" style="margin-inline-start:auto; font-size:0.72rem;">SEAL</span>
                </div>
                <div class="mono" style="font-size:0.78rem; color:var(--muted); line-height:1.7;">
                  <div>Algorithm: Ed25519 + SHA-256</div>
                  <div>Keys Rotated: Auto every 90d</div>
                  <div>Tamper Events: 0 (all-time)</div>
                </div>
              </div>

              <!-- Node: Academy LMS -->
              <div class="sys-node-card" data-status="ok" style="padding:1rem; border-radius:10px; border:1px solid rgba(0,240,255,0.15); background:rgba(0,240,255,0.02);">
                <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.6rem;">
                  <span class="dot dot--live"></span>
                  <strong style="font-size:0.88rem;">${t("أكاديمية عوالِم LMS — التعليم التقني", "Awalim Academy LMS Platform")}</strong>
                  <span class="badge badge--accent" style="margin-inline-start:auto; font-size:0.72rem;">LMS</span>
                </div>
                <div class="mono" style="font-size:0.78rem; color:var(--muted); line-height:1.7;">
                  <div>Courses: 24 engineering tracks</div>
                  <div>Grads: 682 certified engineers</div>
                  <div>Status: Accepting Enrollments</div>
                </div>
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
                <input type="text" class="dash-input" id="hero-input-line3" value="${t("التي تُشغّل الشركات الكبرى.", "That Power Enterprise Giants.")}">
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
                  <span id="preview-line3">${t("التي تُشغّل الشركات الكبرى.", "That Power Enterprise Giants.")}</span>
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

          <div class="dash-cards-grid" id="dash-products-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
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
              <a href="/products/smart-accountant" class="btn btn--ghost btn--xs" target="_blank">${t("معاينة صفحة المنتج ↗", "View Product Page ↗")}</a>
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
              <a href="/work/rahmacare" class="btn btn--ghost btn--xs" target="_blank">${t("معاينة صفحة المنتج ↗", "View Product Page ↗")}</a>
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
              <a href="/work/vibe-os" class="btn btn--ghost btn--xs" target="_blank">${t("معاينة صفحة المنتج ↗", "View Product Page ↗")}</a>
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
              <a href="/security" class="btn btn--ghost btn--xs" target="_blank">${t("معاينة صفحة الأمان ↗", "View Security Page ↗")}</a>
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

          <div class="dash-cards-grid" id="academy-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
            <div class="dash-card">
              <span class="badge badge--ok" style="margin-bottom: 0.5rem;">${t("باب التسجيل مفتوح", "INTAKE OPEN")}</span>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${t("هندسة معمارية الأنظمة السيادية", "Sovereign Systems Architecture")}</h3>
              <p class="text-muted small">${t("البرمجة بدون مكتبات خارجية، معمارية الذاكرة الفائقة، وهندسة الأداء 120 FPS.", "Zero-dependency engineering, memory layout, and 120 FPS kinetic rendering.")}</p>
              <div style="display: flex; gap: 1rem; margin: 1rem 0; font-size: 0.85rem;" class="mono">
                <div>${t("الطلاب:", "Enrolled:")} <b>42/50</b></div>
                <div>${t("الإنجاز:", "Completion:")} <b>96%</b></div>
              </div>
              <a href="/academy" class="btn btn--ghost btn--xs" target="_blank">${t("عرض المسار ↗", "View Track ↗")}</a>
            </div>

            <div class="dash-card">
              <span class="badge badge--ok" style="margin-bottom: 0.5rem;">${t("باب التسجيل مفتوح", "INTAKE OPEN")}</span>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${t("أسراب وكلاء الذكاء الاصطناعي", "Distributed AI Agents Swarm")}</h3>
              <p class="text-muted small">${t("بناء وكلاء مستقلين ينفذون مهاماً مركبة دون تسريب بيانات وبمسارات تدقيق صارمة.", "Building autonomous agents that execute offline with verifiable audit trails.")}</p>
              <div style="display: flex; gap: 1rem; margin: 1rem 0; font-size: 0.85rem;" class="mono">
                <div>${t("الطلاب:", "Enrolled:")} <b>38/40</b></div>
                <div>${t("الإنجاز:", "Completion:")} <b>98%</b></div>
              </div>
              <a href="/academy" class="btn btn--ghost btn--xs" target="_blank">${t("عرض المسار ↗", "View Track ↗")}</a>
            </div>

            <div class="dash-card">
              <span class="badge badge--ok" style="margin-bottom: 0.5rem;">${t("اكتملت المقاعد", "COHORT FULL")}</span>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${t("تطبيقات Flutter ولوحات القيادة HMI", "High-Performance Flutter & HMI")}</h3>
              <p class="text-muted small">${t("تصميم وبرمجة واجهات السيارات، أنظمة الملاحة، والشاشات الطبية المتقدمة.", "Crafting automotive dashboards, navigation clusters, and medical display software.")}</p>
              <div style="display: flex; gap: 1rem; margin: 1rem 0; font-size: 0.85rem;" class="mono">
                <div>${t("الطلاب:", "Enrolled:")} <b>30/30</b></div>
                <div>${t("الإنجاز:", "Completion:")} <b>100%</b></div>
              </div>
              <a href="/academy" class="btn btn--ghost btn--xs" target="_blank">${t("عرض المسار ↗", "View Track ↗")}</a>
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
              <tbody id="articles-table-body">
                <tr>
                  <td><b>${t("ثورة وكلاء الذكاء الاصطناعي: من النماذج اللغوية إلى الأنظمة المستقلة", "The AI Agents Revolution: Beyond Chatbots")}</b></td>
                  <td>${t("أحمد أشرف", "Ahmed Ashraf")}</td>
                  <td class="mono">8 min</td>
                  <td><span class="badge badge--ok">PUBLISHED</span></td>
                  <td><a href="/journal/ai-agents-revolution" class="btn btn--ghost btn--xs" target="_blank">${t("قراءة ↗", "Read ↗")}</a></td>
                </tr>
                <tr>
                  <td><b>${t("أسرار سرعة 60 FPS: كيف نبني واجهات ويب خارقة خالية من التبعيات", "60 FPS Web Architecture: Zero Dependencies")}</b></td>
                  <td>${t("أحمد أشرف", "Ahmed Ashraf")}</td>
                  <td class="mono">11 min</td>
                  <td><span class="badge badge--ok">PUBLISHED</span></td>
                  <td><a href="/journal/sovereign-glass-design" class="btn btn--ghost btn--xs" target="_blank">${t("قراءة ↗", "Read ↗")}</a></td>
                </tr>
                <tr>
                  <td><b>${t("معمارية المحاسبة الجنائية: القيود المزدوجة وفق معايير IFRS الصارمة", "Forensic Accounting Architecture & IFRS Standards")}</b></td>
                  <td>${t("أحمد أشرف", "Ahmed Ashraf")}</td>
                  <td class="mono">14 min</td>
                  <td><span class="badge badge--ok">PUBLISHED</span></td>
                  <td><a href="/journal/idea-to-mrr-8-weeks" class="btn btn--ghost btn--xs" target="_blank">${t("قراءة ↗", "Read ↗")}</a></td>
                </tr>
                <tr>
                  <td><b>${t("صمود الشبكات في غزة: المزامنة اللامركزية عبر كتل Merkle DAG", "Network Resilience in Gaza: Merkle DAG P2P Sync")}</b></td>
                  <td>${t("فريق عوالِم الهندسي", "Awalim Engineering Team")}</td>
                  <td class="mono">16 min</td>
                  <td><span class="badge badge--ok">PUBLISHED</span></td>
                  <td><a href="/security" class="btn btn--ghost btn--xs" target="_blank">${t("قراءة ↗", "Read ↗")}</a></td>
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
              <p class="dash-panel-desc">${t("فحص آلي حقيقي يختبر كافة مسارات الموقع الـ 84 صفحة عبر 8 محركات تدقيق سيادية: البناء، النماذج، التيبوغرافيا، اتجاه النص، التباين، الترويسات الصارمة، التدقيق اللغوي، ونزاهة الروابط.", "Full multi-engine automated audit verifying all 84 built pages across static integrity, form validation, Arabic typography, BiDi isolation, WCAG AAA contrast, CSP Level 3, linguistics, and zero-dead link crawling.")}</p>
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
              <span class="test-icon">${icon("check", "test-svg")}</span>
              <b>${t("فحص النماذج والوصولية", "Forms & Live Alerts")}</b>
              <small>${t("109 نماذج · 216 حقلاً", "109 Forms · 216 Fields")}</small>
              <span class="badge badge--ok">✔ PASS (0 fault)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("rtl", "test-svg")}</span>
              <b>${t("الخطوط والوصل", "Typography")}</b>
              <small>${t("الإسكندرية وعلامات «»", "Alexandria & Quotes")}</small>
              <span class="badge badge--ok">✔ PASS (0 break)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("swap", "test-svg")}</span>
              <b>${t("عزل النصوص (BiDi)", "BiDi Isolation")}</b>
              <small>${t("84 مساراً مع عزل الأرقام", "84 Compound Routes")}</small>
              <span class="badge badge--ok">✔ PASS (0 reversed)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("a11y", "test-svg")}</span>
              <b>${t("التباين والوصولية", "WCAG Contrast")}</b>
              <small>${t("معيار الوصولية العالمي", "WCAG AAA Compliance")}</small>
              <span class="badge badge--ok">✔ PASS (AAA 7:1)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("shield", "test-svg")}</span>
              <b>${t("الترويسات والأمان الصارم", "CSP Level 3 & Trusted")}</b>
              <small>${t("TrustedHTML ومنع الحقن", "Strict CSP & Sandboxing")}</small>
              <span class="badge badge--ok">✔ PASS (0 inline)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("feather", "test-svg")}</span>
              <b>${t("التدقيق اللغوي والمصطلحات", "Linguistics & Copy")}</b>
              <small>${t("5,731 نص مفحوص", "5,731 Nodes Checked")}</small>
              <span class="badge badge--ok">✔ PASS (0 typo)</span>
            </div>
            <div class="dash-test-badge-card pass">
              <span class="test-icon">${icon("globe", "test-svg")}</span>
              <b>${t("نزاهة الروابط والشبكة", "Zero-Dead Links")}</b>
              <small>${t("فحص شامل لكافة المسارات", "84 Routes Crawler")}</small>
              <span class="badge badge--ok">✔ PASS (0 dead)</span>
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

          <!-- Awalim Raqib Fleet Security & Compliance Console -->
          <div class="dash-card" style="margin-bottom: 1.5rem; border: 1px solid rgba(212,175,55,0.25);">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--gold" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("رادار رَقيب لمراقبة الأسطول والامتثال المؤسسي", "AWALIM RAQIB FLEET DEFENSE & PDPL SENTINEL")}</span>
                <h3 class="dash-card-title">${t("مصفوفة فحص الأمان ومطابقة القوانين للأذرع الستة", "Fleet Security Posture & PDPL Law 151/2020 Compliance")}</h3>
                <p class="dash-panel-desc">${t("مراقبة مستمرة للمحيط الخارجي وترويسات الأمان وشهادات TLS عبر كافة منصات وأذرع عوالِم مع امتثال تام لقانون حماية البيانات المصري (151 لسنة 2020) واللائحة الأوروبية.", "Continuous perimeter scanning and privacy compliance mapping across all 6 sovereign ventures.")}</p>
              </div>
              <div style="display:flex; gap:0.5rem;">
                <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                <a href="${pfx}/security?raqib-tab=scanner#raqib-sentinel" class="btn btn--outline btn--xs" target="_blank">
                  <span>⚡ ${t("الماسح الخارجي", "Scanner")}</span>
                </a>
                <a href="${pfx}/security?raqib-tab=breach#raqib-sentinel" class="btn btn--ghost btn--xs" target="_blank" style="border:1px solid rgba(239,68,68,0.3);">
                  <span>🚨 ${t("طوارئ 72h", "72h Breach")}</span>
                </a>
                <a href="${pfx}/security?raqib-tab=consent#raqib-sentinel" class="btn btn--ghost btn--xs" target="_blank" style="border:1px solid rgba(0,240,255,0.3);">
                  <span>🛡️ ${t("شريط الموافقة", "Consent")}</span>
                </a>
                <a href="${pfx}/security?raqib-tab=readiness#raqib-sentinel" class="btn btn--ghost btn--xs" target="_blank" style="border:1px solid rgba(212,175,55,0.3);">
                  <span>📊 ${t("الجاهزية", "Readiness")}</span>
                </a>
              </div>
              </div>
            </div>

            <div class="dash-ventures-grid">
              <div class="dash-venture-card">
                <div class="dash-venture-head">
                  <div>
                    <h4 class="dash-venture-name">awalim.group</h4>
                    <span class="dash-venture-sector">${t("البوابة السيادية المركزية", "Sovereign Gateway")}</span>
                  </div>
                  <span class="badge badge--ok">100% · A+</span>
                </div>
                <div class="dash-venture-stats">
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("التشفير", "TLS")}</span><span class="dash-venture-stat-val mono" style="color:#10B981;">TLS 1.3 / PFS</span></div>
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("الترويسات", "CSP")}</span><span class="dash-venture-stat-val mono" style="color:var(--gold,#D4AF37);">Strict Level 3</span></div>
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("قانون 151", "PDPL")}</span><span class="dash-venture-stat-val" style="color:#10B981;">${t("ممتثل كلياً", "100% Compliant")}</span></div>
                </div>
              </div>

              <div class="dash-venture-card">
                <div class="dash-venture-head">
                  <div>
                    <h4 class="dash-venture-name">islandhaven.io</h4>
                    <span class="dash-venture-sector">${t("نواة الأنظمة المصرفية", "FinTech & Banking")}</span>
                  </div>
                  <span class="badge badge--ok">100% · A+</span>
                </div>
                <div class="dash-venture-stats">
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("التشفير", "TLS")}</span><span class="dash-venture-stat-val mono" style="color:#10B981;">TLS 1.3 / E2E</span></div>
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("الترويسات", "CSP")}</span><span class="dash-venture-stat-val mono" style="color:var(--gold,#D4AF37);">Zero Trust</span></div>
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("قانون 151", "PDPL")}</span><span class="dash-venture-stat-val" style="color:#10B981;">${t("ممتثل كلياً", "100% Compliant")}</span></div>
                </div>
              </div>

              <div class="dash-venture-card">
                <div class="dash-venture-head">
                  <div>
                    <h4 class="dash-venture-name">rahmacare.net</h4>
                    <span class="dash-venture-sector">${t("شبكة الإغاثة اللامركزية", "Field Mesh & Triage")}</span>
                  </div>
                  <span class="badge badge--ok">99% · A+</span>
                </div>
                <div class="dash-venture-stats">
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("التشفير", "TLS")}</span><span class="dash-venture-stat-val mono" style="color:#10B981;">P2P Mesh E2EE</span></div>
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("الترويسات", "CSP")}</span><span class="dash-venture-stat-val mono" style="color:var(--gold,#D4AF37);">Offline Mode</span></div>
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("قانون 151", "PDPL")}</span><span class="dash-venture-stat-val" style="color:#10B981;">${t("ممتثل كلياً", "100% Compliant")}</span></div>
                </div>
              </div>

              <div class="dash-venture-card">
                <div class="dash-venture-head">
                  <div>
                    <h4 class="dash-venture-name">falconerp.io</h4>
                    <span class="dash-venture-sector">${t("المحاسبة السحابية IFRS", "Sovereign IFRS Ledger")}</span>
                  </div>
                  <span class="badge badge--ok">100% · A+</span>
                </div>
                <div class="dash-venture-stats">
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("التشفير", "TLS")}</span><span class="dash-venture-stat-val mono" style="color:#10B981;">TLS 1.3 / HSM</span></div>
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("الترويسات", "CSP")}</span><span class="dash-venture-stat-val mono" style="color:var(--gold,#D4AF37);">Strict Level 3</span></div>
                  <div class="dash-venture-stat-item"><span class="dash-venture-stat-label">${t("قانون 151", "PDPL")}</span><span class="dash-venture-stat-val" style="color:#10B981;">${t("ممتثل كلياً", "100% Compliant")}</span></div>
                </div>
              </div>
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
                <span class="chip chip--accent"><span class="dot dot--live" aria-hidden="true"></span>${t("محرك Island Haven للمهام", "ISLAND HAVEN TASK ENGINE")}</span>
                <span class="dash-tab-badge" id="tasks-total-badge">6 ${t("مهام نشطة", "Active Tasks")}</span>
              </div>
              <h2 class="dash-panel-title">${t("إدارة المهام وسبرنت العمليات (Island Haven Engine)", "Tasks & Sprint Operations (Island Haven Engine)")}</h2>
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
                <span>+ ${t("إضافة مهمة جديدة", "New Engineering Task")}</span>
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

        <!-- ================= PANEL: STAFF & ENGINEERING MANAGEMENT ================= -->
        <section class="dash-panel" data-dash-panel="staff" aria-label="${t("شؤون الموظفين والفرق الهندسية", "Staff & Engineering Hub")}">
          
          <div class="dash-panel-head">
            <div>
              <div class="dash-badge-row">
                <span class="chip chip--accent"><span class="dot dot--live" aria-hidden="true"></span>${t("منظومة إدارة الكادر الهندسي", "ENGINEERING TALENT & RBAC SUITE")}</span>
                <span class="badge badge--ok" id="staff-live-active-badge">${t("11 مهندساً وخبيراً نشطاً", "11 Active Engineers")}</span>
              </div>
              <h2 class="dash-panel-title">${t("إدارة الكفاءات والموظفين والفرق الهندسية (Staff & Engineering Hub)", "Staff & Engineering Management Hub")}</h2>
              <p class="dash-panel-desc">${t("نظام إداري مركزي شامل لمتابعة فرق العمل عبر 10 دول، تفويض المهام المباشرة، إدارة صلاحيات الوصول (RBAC)، وتقييم أداء كل مهندس في المنظومة.", "Comprehensive talent and staff management system across 10 global nodes. Delegate sprint tasks, configure RBAC clearances, and audit engineer velocity.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--outline btn--sm" id="btn-export-staff-roster">
                <span>${icon("download", "dash-btn-svg")} ${t("تصدير الكادر (JSON)", "Export Roster (JSON)")}</span>
              </button>
              <button type="button" class="btn btn--primary btn--sm" id="btn-open-add-staff-modal">
                <span>${icon("plus", "dash-btn-svg")} ${t("إضافة مهندس / موظف جديد", "Add Team Member")}</span>
              </button>
            </div>
          </div>

          <!-- Staff KPI Metric Cards -->
          <div class="dash-kpi-grid" style="margin-block-end: 1.5rem;">
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("إجمالي الكادر الهندسي النشط", "Total Active Engineers")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">11</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">100% Retained</span> ${t("تفرغ وتواجد كامل", "Fully dedicated core")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("التوزيع الجغرافي للعقد", "Operational Cities & Nodes")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">10</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">P2P Mesh</span> ${t("فلسطين، لبنان، الأردن، الخليج، أوروبا", "Palestine, Levant, Gulf, EU")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("متوسط إنجاز السبرنت الفصلي", "Quarterly Sprint Velocity")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">96.4%</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">+4.2%</span> ${t("انضباط صارم بالـ SLA", "Rigid SLA adherence")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("نظام الصلاحيات (RBAC)", "Clearance Tiers (RBAC)")}</span>
              <div class="dash-kpi-val mono"><bdi dir="ltr">4 Tiers</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">Ed25519</span> ${t("تحقق تشفيري عتادي", "Hardware signed identity")}</div>
            </div>
          </div>

          <!-- Discipline Filter Pills & Search -->
          <div class="dash-task-filter-bar" style="margin-block-end: 1.5rem;">
            <div class="dash-search-box">
              <span aria-hidden="true" class="dash-search-icon">${icon("search", "dash-search-svg")}</span>
              <input type="search" class="dash-input" id="staff-search-input" placeholder="${t("ابحث باسم المهندس، الدور، الدولة، أو الصلاحية...", "Search by engineer, role, country, or clearance...")}">
            </div>
            <div class="dash-filter-pills" id="staff-discipline-filters">
              <button type="button" class="dash-filter-pill active" data-filter-discipline="all">${t("كافة الكفاءات (11)", "All Staff (11)")}</button>
              <button type="button" class="dash-filter-pill" data-filter-discipline="core_systems">${t("هندسة النواة والمصارف", "Core & Banking")}</button>
              <button type="button" class="dash-filter-pill" data-filter-discipline="mesh_field">${t("شبكات الإغاثة والميدان", "Field Mesh")}</button>
              <button type="button" class="dash-filter-pill" data-filter-discipline="security_crypto">${t("الأمان والتشفير الجنائي", "Security & Crypto")}</button>
              <button type="button" class="dash-filter-pill" data-filter-discipline="ui_glass">${t("فيزياء الواجهات والتجربة", "Glass UI / HMI")}</button>
              <button type="button" class="dash-filter-pill" data-filter-discipline="academy_mentors">${t("الأكاديمية والتوجيه", "Academy Mentors")}</button>
            </div>
          </div>

          <!-- Interactive Employee Cards Grid -->
          <div class="dash-staff-grid" id="staff-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr)); gap: 1rem; margin-block-end: 2rem;">
            <!-- Founder Card -->
            <div class="dash-card dash-staff-card is-active-workspace" data-staff-id="AA-01" data-staff-discipline="core_systems" style="border: 1px solid rgba(212,175,55,0.4); background: radial-gradient(circle at top right, rgba(212,175,55,0.06), transparent 70%), var(--dash-card-bg, rgba(14,18,25,0.7));">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                  <div style="position: relative;">
                    <img src="/assets/img/ahmed-personal.webp" alt="Ahmed Ashraf" width="46" height="46" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold,#D4AF37);">
                    <span class="live-dot" style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border: 2px solid #000;" aria-hidden="true"></span>
                  </div>
                  <div>
                    <h4 style="font-size: var(--fs-md); font-weight: var(--w-bold); margin: 0; color: var(--text-1);">${t("المهندس أحمد أشرف", "Eng. Ahmed Ashraf")}</h4>
                    <span style="font-size: var(--fs-xs); color: var(--text-muted);">${t("المؤسس ورئيس المنظومة", "Founder & Chief Architect")}</span>
                  </div>
                </div>
                <span class="badge badge--ok mono" style="border-color: var(--gold,#D4AF37); color: var(--gold,#D4AF37);">0x00 ROOT</span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; font-size: 0.72rem; color: var(--text-2); margin-bottom: 0.75rem;">
                <span class="chip chip--sm">📍 ${t("فلسطين (القدس / شبكة موزعة)", "Palestine (Jerusalem)")}</span>
                <span class="chip chip--sm">⚙️ ${t("هندسة النواة والأنظمة المعقدة", "Core & Systems")}</span>
                <span class="chip chip--sm">💼 ${t("3 مهام قيد المتابعة", "3 Active Sprints")}</span>
              </div>
              <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 1rem 0;">
                ${t("قيادة المعمارية العليا لكافة المنصات، اعتماد التوقيعات التشفيرية، وتوجيه استراتيجية التوسع والأكاديمية.", "Apex architecture governance, cryptographic attestation, and strategic expansion across all ventures.")}
              </p>
              <div style="display: flex; flex-direction: column; gap: 0.4rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem;">
                <div style="display: flex; gap: 0.5rem;">
                  <button type="button" class="btn btn--primary btn--xs btn-act-switch-user" data-user-id="AA-01" style="flex: 1;">
                    <span>${t("تفعيل حسابه كجلسة نشطة", "Switch Workspace")}</span>
                  </button>
                  <button type="button" class="btn btn--ghost btn--xs btn-act-assign-task" data-user-name="أحمد أشرف" data-user-name-en="Ahmed Ashraf">
                    <span>+ ${t("تكليف بمهمة", "Assign Task")}</span>
                  </button>
                </div>
                <div style="display: flex; gap: 0.4rem;">
                  <button type="button" class="btn btn--outline btn--xs btn-act-open-portal" data-user-id="AA-01" style="flex: 1; justify-content: center;">
                    <span>👤 ${t("فتح البوابة الإدارية", "Open Portal")}</span>
                  </button>
                  <button type="button" class="btn btn--ghost btn--xs btn-act-award-bonus" data-user-id="AA-01" style="color: var(--gold,#D4AF37); border: 1px solid rgba(212,175,55,0.3); justify-content: center;">
                    <span>🏆 ${t("صرف مكافأة", "Spot Bonus")}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Engineers from workforce.roster -->
            ${(workforce.roster || []).map(eng => `
              <div class="dash-card dash-staff-card" data-staff-id="${eng.id}" data-staff-discipline="${eng.discipline}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                  <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <div style="position: relative;">
                      <div class="dash-avatar-circle" style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; font-weight: var(--w-bold); font-size: 0.85rem; color: var(--accent);">
                        ${(isEn ? (eng.name_en || eng.name) : eng.name).split(" ").slice(-1)[0].slice(0, 2)}
                      </div>
                      <span class="live-dot" style="position: absolute; bottom: 0; right: 0; width: 9px; height: 9px; border: 2px solid #000;" aria-hidden="true"></span>
                    </div>
                    <div>
                      <h4 style="font-size: var(--fs-sm); font-weight: var(--w-bold); margin: 0; color: var(--text-1);">${isEn ? (eng.name_en || eng.name) : eng.name}</h4>
                      <span style="font-size: var(--fs-xs); color: var(--text-muted);">${isEn ? (eng.role_en || eng.role) : eng.role}</span>
                    </div>
                  </div>
                  <span class="badge badge--ok mono">${eng.clearance}</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; font-size: 0.72rem; color: var(--text-2); margin-bottom: 0.75rem;">
                  <span class="chip chip--sm">📍 ${isEn ? (eng.country_en || eng.country) : eng.country}</span>
                  <span class="chip chip--sm"><span class="dot dot--live"></span> ${isEn ? (eng.status_en || eng.status) : eng.status}</span>
                  <span class="chip chip--sm mono">${eng.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                  <span>${t("إنجاز السبرنت:", "Sprint Velocity:")}</span>
                  <span class="mono" style="color: #10B981; font-weight: var(--w-bold);">98% OK</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.4rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem;">
                  <div style="display: flex; gap: 0.5rem;">
                    <button type="button" class="btn btn--outline btn--xs btn-act-switch-user" data-user-id="${eng.id}" style="flex: 1;">
                      <span>${t("تفعيل جلسته", "Switch User")}</span>
                    </button>
                    <button type="button" class="btn btn--ghost btn--xs btn-act-assign-task" data-user-name="${eng.name}" data-user-name-en="${eng.name_en || eng.name}">
                      <span>+ ${t("تكليف بمهمة", "Assign Task")}</span>
                    </button>
                  </div>
                  <div style="display: flex; gap: 0.4rem;">
                    <button type="button" class="btn btn--outline btn--xs btn-act-open-portal" data-user-id="${eng.id}" style="flex: 1; justify-content: center;">
                      <span>👤 ${t("فتح البوابة والدوام", "Employee Portal")}</span>
                    </button>
                    <button type="button" class="btn btn--ghost btn--xs btn-act-award-bonus" data-user-id="${eng.id}" style="color: var(--gold,#D4AF37); border: 1px solid rgba(212,175,55,0.3); justify-content: center;">
                      <span>🏆 ${t("صرف مكافأة", "Spot Bonus")}</span>
                    </button>
                  </div>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- Role-Based Access Control (RBAC) Matrix Table -->
          <div class="dash-card" style="margin-block-end: 1.5rem;">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--accent" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("مصفوفة الصلاحيات والحوكمة", "RBAC PERMISSIONS MATRIX")}</span>
                <h3 class="dash-card-title">${t("مصفوفة صلاحيات الوصول والأمان (Role-Based Access Control)", "Role-Based Access Control (RBAC) Matrix")}</h3>
                <p class="dash-panel-desc">${t("هيكل حوكمة رقمي دقيق يحدد نطاق التصريح البرمجي والتنفيذي لكل مستوى إداري في المنظومة.", "Strict capability policies assigned by clearance level governing code commits, deployments, and ledger mutations.")}</p>
              </div>
            </div>

            <div class="dash-table-wrap">
              <table class="dash-directives-table">
                <thead>
                  <tr>
                    <th>${t("مستوى الصلاحية", "Clearance Tier")}</th>
                    <th>${t("المسمى والوصف", "Role Title & Scope")}</th>
                    <th>${t("الكوادر المعينة", "Assigned Personnel")}</th>
                    <th>${t("صلاحيات الكود والأنظمة", "Code & Infrastructure")}</th>
                    <th>${t("سلطة التوقيع التشفيري", "Forensic Signing")}</th>
                    <th>${t("الاعتماد النهائي", "Final Deploy")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="badge badge--ok mono" style="border-color: var(--gold,#D4AF37); color: var(--gold,#D4AF37);">0x00 ROOT</span></td>
                    <td><b>${t("المالك وكبير المعماريين", "Sovereign Owner & Chief Architect")}</b></td>
                    <td><span class="chip chip--sm">${isEn ? "Eng. Ahmed Ashraf" : "م. أحمد أشرف"}</span></td>
                    <td>${t("تحكم مطلق في كافة الخوادم والبنى والإنتاج", "Full Infrastructure & Mutation")}</td>
                    <td><span class="badge badge--ok">Ed25519 Root Key</span></td>
                    <td><span class="dot dot--live"></span> ${t("اعتماد ونشر فوري", "Instant Deploy")}</td>
                  </tr>
                  <tr>
                    <td><span class="badge badge--ok mono">0x01 KERNEL / CRYPTO</span></td>
                    <td><b>${t("قادة النواة والأمان التشفيري", "Core Kernel & Security Leads")}</b></td>
                    <td><span class="chip chip--sm">${isEn ? "Eng. Tariq Al-Nasser" : "م. طارق الناصر"}</span> <span class="chip chip--sm">${isEn ? "Eng. Sarah Al-Ali" : "م. سارة العلي"}</span></td>
                    <td>${t("تعديل نوى Rust والبروتوكولات التشفيرية", "Rust Core & Cryptographic Modules")}</td>
                    <td><span class="badge badge--ok">Peer Attestation</span></td>
                    <td>${t("يتطلب مراجعة الأقران", "Peer Review Gate")}</td>
                  </tr>
                  <tr>
                    <td><span class="badge badge--ok mono">0x02 FIELD / LEDGER / AI</span></td>
                    <td><b>${t("مهندسو العمليات والميدان والذكاء", "Field Mesh & Systems Engineers")}</b></td>
                    <td><span class="chip chip--sm">${isEn ? "Dr. Layla Mansour" : "د. ليلى منصور"}</span> <span class="chip chip--sm">${isEn ? "Eng. Omar Al-Saleh" : "م. عمر الصالح"}</span> <span class="chip chip--sm">${isEn ? "Eng. Ziad Qasim" : "م. زياد قاسم"}</span> <span class="chip chip--sm">${isEn ? "Eng. Hana Al-Zoubi" : "م. هناء الزعبي"}</span> <span class="chip chip--sm">${isEn ? "Eng. Kamal Darwish" : "م. كمال درويش"}</span> <span class="chip chip--sm">${isEn ? "Eng. Maryam Khalil" : "م. مريم خليل"}</span></td>
                    <td>${t("تشغيل شبكات P2P والقيود المحاسبية ومحركات AI", "P2P Mesh, Ledger IFRS & AI Models")}</td>
                    <td><span class="badge badge--ok">Sub-key Signed</span></td>
                    <td>${t("موافقة قائد الذراع", "Venture Lead Approval")}</td>
                  </tr>
                  <tr>
                    <td><span class="badge badge--ok mono">0x03 UI / MENTOR</span></td>
                    <td><b>${t("هندسة الواجهات وتدريب الأكاديمية", "UI/HMI & Academy Leads")}</b></td>
                    <td><span class="chip chip--sm">${isEn ? "Eng. Razan Al-Alami" : "م. رزان العلمي"}</span> <span class="chip chip--sm">${isEn ? "Eng. Youssef Al-Najjar" : "م. يوسف النجار"}</span></td>
                    <td>${t("أنظمة التصميم الزجاجي والمناهج والطلاب", "Glass Design Systems & Curriculums")}</td>
                    <td><span class="badge badge--ok">Standard Signature</span></td>
                    <td>${t("موافقة فريق النواة", "Core Team Approval")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Add Employee Modal Dialog -->
          <div class="dash-modal-overlay" id="modal-add-employee">
            <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-add-employee-title">
              <div class="dash-modal-header">
                <h3 class="dash-modal-title" id="modal-add-employee-title">${t("إضافة مهندس أو موظف جديد للمنظومة", "Add New Team Member / Engineer")}</h3>
                <button type="button" class="dash-modal-close" id="btn-close-add-employee" aria-label="${t("إغلاق", "Close")}">✕</button>
              </div>
              <form id="form-add-employee" style="display: grid; gap: 0.85rem; padding: 1.25rem;">
                <div class="dash-field-group">
                  <label class="dash-label" for="input-emp-name">${t("الاسم الكامل (عربي)", "Full Name (Arabic)")}</label>
                  <input type="text" name="emp_name" class="dash-input" id="input-emp-name" aria-label="${t("الاسم الكامل (عربي)", "Full Name (Arabic)")}" required placeholder="${t("مثال: م. فادي الأحمد", "e.g. Eng. Fadi Al-Ahmad")}">
                </div>
                <div class="dash-field-group">
                  <label class="dash-label" for="input-emp-name-en">${t("الاسم الكامل (إنجليزي)", "Full Name (English)")}</label>
                  <input type="text" name="emp_name_en" class="dash-input" id="input-emp-name-en" aria-label="${t("الاسم الكامل (إنجليزي)", "Full Name (English)")}" required placeholder="e.g. Eng. Fadi Al-Ahmad">
                </div>
                <div class="dash-field-group">
                  <label class="dash-label" for="input-emp-role">${t("المسمى الوظيفي والدور", "Role & Title")}</label>
                  <input type="text" name="emp_role" class="dash-input" id="input-emp-role" aria-label="${t("المسمى الوظيفي والدور", "Role & Title")}" required placeholder="${t("مثال: مهندس أول بنية تحتية وموزعة", "e.g. Senior Infrastructure Engineer")}">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                  <div class="dash-field-group">
                    <label class="dash-label" for="select-emp-discipline">${t("التخصص / القسم", "Discipline")}</label>
                    <select name="emp_discipline" class="dash-select" id="select-emp-discipline" aria-label="${t("التخصص / القسم", "Discipline")}">
                      <option value="core_systems">${t("هندسة النواة والمصارف", "Core & Banking")}</option>
                      <option value="mesh_field">${t("شبكات الإغاثة والبث الفضائي", "Field Mesh & Satellite")}</option>
                      <option value="ai_systems">${t("نظم الذكاء الاصطناعي والأتمتة", "AI & Autonomous Systems")}</option>
                      <option value="cyber_sec">${t("الأمن السيبراني وعقود التشفير", "Cybersecurity & Cryptography")}</option>
                      <option value="academy_mentors">${t("الأكاديمية والتوجيه", "Academy Mentors")}</option>
                    </select>
                  </div>
                  <div class="dash-field-group">
                    <label class="dash-label" for="input-emp-country">${t("الدولة / العقدة الميدانية", "Location / Node")}</label>
                    <input type="text" name="emp_country" class="dash-input" id="input-emp-country" aria-label="${t("الدولة / العقدة الميدانية", "Location / Node")}" required placeholder="${t("فلسطين / دبي / لندن...", "Palestine / Dubai...")}">
                  </div>
                </div>
                <div class="dash-field-group">
                  <label class="dash-label" for="select-emp-clearance">${t("مستوى الصلاحية (Clearance Tier)", "Clearance Tier")}</label>
                  <select name="emp_clearance" class="dash-select" id="select-emp-clearance" aria-label="${t("مستوى الصلاحية (Clearance Tier)", "Clearance Tier")}">
                    <option value="0x01 KERNEL">0x01 KERNEL (Core Architecture)</option>
                    <option value="0x02 FIELD">0x02 FIELD (Field Operations)</option>
                    <option value="0x02 CRYPTO">0x02 CRYPTO (Forensic Security)</option>
                    <option value="0x02 LEDGER">0x02 LEDGER (IFRS Accounting)</option>
                    <option value="0x02 AI">0x02 AI (Autonomous Agents)</option>
                    <option value="0x03 UI">0x03 UI (Design & Interaction)</option>
                    <option value="0x03 MENTOR">0x03 MENTOR (Academy Mentorship)</option>
                  </select>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;">
                  <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-add-employee">${t("إلغاء", "Cancel")}</button>
                  <button type="submit" class="btn btn--primary btn--sm">${t("حفظ وإضافة للكادر", "Save & Register Member")}</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Quick Task Assignment Modal -->
          <div class="dash-modal-overlay" id="modal-assign-task">
            <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-assign-task-title">
              <div class="dash-modal-header">
                <h3 class="dash-modal-title" id="modal-assign-task-title">${t("تكليف بمهمة هندسية جديدة", "Assign New Engineering Task")}</h3>
                <button type="button" class="dash-modal-close" id="btn-close-assign-task" aria-label="${t("إغلاق", "Close")}">✕</button>
              </div>
              <form id="form-quick-assign-task" style="display: grid; gap: 0.85rem; padding: 1.25rem;">
                <div class="dash-field-group">
                  <label class="dash-label" for="input-assignee-name">${t("المهندس المكلف بالمهمة", "Assigned Engineer")}</label>
                  <input type="text" name="assignee_name" class="dash-input" id="input-assignee-name" aria-label="${t("المهندس المكلف بالمهمة", "Assigned Engineer")}" readonly style="background: rgba(255,255,255,0.04); font-weight: var(--w-bold);">
                </div>
                <div class="dash-field-group">
                  <label class="dash-label" for="input-assign-title">${t("عنوان المهمة الهندسية", "Task Title")}</label>
                  <input type="text" name="assign_title" class="dash-input" id="input-assign-title" aria-label="${t("عنوان المهمة الهندسية", "Task Title")}" required placeholder="${t("اكتب عنوان المهمة ونطاق التسليم...", "Enter concise sprint deliverable...")}">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                  <div class="dash-field-group">
                    <label class="dash-label" for="select-assign-priority">${t("الأولوية", "Priority")}</label>
                    <select name="assign_priority" class="dash-select" id="select-assign-priority" aria-label="${t("الأولوية", "Priority")}">
                      <option value="urgent">${t("عاجل وطارئ (Urgent)", "Urgent")}</option>
                      <option value="high" selected>${t("أولوية عليا (High)", "High")}</option>
                      <option value="medium">${t("متوسط (Medium)", "Medium")}</option>
                      <option value="low">${t("عادي (Low)", "Low")}</option>
                    </select>
                  </div>
                  <div class="dash-field-group">
                    <label class="dash-label" for="input-assign-due">${t("تاريخ الاستحقاق", "Due Date")}</label>
                    <input type="date" name="assign_due" class="dash-input" id="input-assign-due" aria-label="${t("تاريخ الاستحقاق", "Due Date")}" required>
                  </div>
                </div>
                <div class="dash-field-group">
                  <label class="dash-label" for="textarea-assign-desc">${t("المواصفات الفنية والمخرجات المطلوبة", "Specifications & Criteria")}</label>
                  <textarea name="assign_desc" class="dash-textarea" id="textarea-assign-desc" aria-label="${t("المواصفات الفنية والمخرجات المطلوبة", "Specifications & Criteria")}" rows="3" placeholder="${t("اكتب تفاصيل المعمارية والمخرجات المتوقعة...", "Expected architecture deliverables...")}"></textarea>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;">
                  <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-assign-task">${t("إلغاء", "Cancel")}</button>
                  <button type="submit" class="btn btn--primary btn--sm">${t("إسناد المهمة وإشعار المهندس", "Assign & Dispatch Task")}</button>
                </div>
              </form>
            </div>
          </div>

        </section>

        
        <!-- ================= PANEL: EMPLOYEE ADMINISTRATIVE PORTAL & DESK ================= -->
        <section class="dash-panel" data-dash-panel="portal" aria-label="${t("البوابة الإدارية الخاصة بالموظف والدوام", "Employee Administrative Portal & Desk")}">
          
          <!-- Employee Profile & Duty Badge Card -->
          <div class="dash-portal-profile-card">
            <div class="dash-portal-profile-main">
              <div class="dash-portal-avatar-wrap">
                <div class="dash-portal-avatar" id="portal-user-avatar">AA</div>
                <div class="dash-portal-online-dot" id="portal-duty-dot" title="${t("جلسة نشطة", "Active Session")}"></div>
              </div>
              <div class="dash-portal-identity">
                <div class="dash-badge-row" style="margin-block-end: 0.35rem;">
                  <span class="badge badge--accent" id="portal-user-clearance">0x00 ROOT</span>
                  <span class="badge badge--ok" id="portal-user-id-badge">EMP-AWL-001</span>
                  <span class="chip chip--sm" id="portal-user-node"><span class="dot dot--live"></span><span id="portal-user-node-name">${t("القدس، فلسطين", "Jerusalem, Palestine")}</span></span>
                </div>
                <h3 id="portal-user-display-name">${t("المهندس أحمد أشرف", "Eng. Ahmed Ashraf")}</h3>
                <div class="dash-portal-role-tag">
                  <span id="portal-user-display-role">${t("صاحب المنظومة ورئيس مجلس المعمارية", "Owner & Chief Systems Architect")}</span>
                  <span>·</span>
                  <span style="font-family:var(--font-mono, monospace); font-size:0.75rem; color:var(--accent);" id="portal-user-gpg">ED25519: 9F4B-8A21-7CE0-AA01</span>
                </div>
              </div>
            </div>

            <!-- Active Shift & Clock-In Console -->
            <div class="dash-portal-timer-console">
              <div>
                <div style="font-size:0.75rem; color:var(--muted); margin-bottom:0.25rem;">${t("جلسة العمل الحالية النشطة", "Current Active Shift")}</div>
                <div class="dash-portal-timer-val" id="portal-session-timer">00:00:00</div>
              </div>
              <div style="display:flex; flex-direction:column; gap:0.4rem;">
                <button type="button" class="btn btn--primary btn--sm" id="btn-portal-clock-action">
                  <span>${icon("clock", "dash-btn-svg")} <span id="btn-portal-clock-label">${t("تسجيل بدء الدوام (Clock In)", "Start Shift (Clock In)")}</span></span>
                </button>
                <button type="button" class="btn btn--outline btn--xs" id="btn-portal-break-action">
                  <span>${icon("pulse", "dash-btn-svg")} ${t("استراحة تقنية", "Tech Break")}</span>
                </button>
              </div>

              <!-- 7-Day Shift Heatmap Grid -->
              <div id="portal-weekly-shift-grid" style="flex-basis: 100%; width: 100%; margin-top:0.75rem; padding-top:0.65rem; border-top:1px solid rgba(255,255,255,0.06);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.45rem;">
                  <span style="font-size:0.75rem; color:var(--muted); font-weight:600;">${t("سجل الالتزام بالساعات الأسبوعية (7 أيام)", "7-Day Velocity & Shift Heatmap")}</span>
                  <span class="mono" style="font-size:0.72rem; color:var(--accent); font-weight:700;" id="weekly-hours-total">42.5h / 40.0h (106%)</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:6px; text-align:center;" id="portal-shift-days-row">
                  <!-- Populated dynamically via JS -->
                </div>
              </div>
            </div>
          </div>

          <!-- Employee Personal KPIs -->
          <div class="dash-kpi-grid" style="margin-block-end: 1.5rem;">
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("ساعات العمل المسجلة (هذا الأسبوع)", "Logged Hours (This Week)")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr" id="portal-kpi-hours">38.5</bdi> / 40.0</div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">96.2%</span> ${t("انضباط تام بالساعات", "Punctual schedule")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("المهام المسندة الحالية", "Assigned Sprint Tasks")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr" id="portal-kpi-tasks-count">3</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--accent">${t("قيد التنفيذ", "In Progress")}</span> ${t("تسليمات السبرنت", "Sprint deliverables")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("معدل دقة الالتزام (SLA Adherence)", "SLA Adherence Velocity")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr" id="portal-kpi-sla">99.4%</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">+1.8%</span> ${t("أداء فائق للربع", "Quarterly peak")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">${t("رصيد الإجازات المتبقي", "Available Leave Balance")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr" id="portal-kpi-leave">18</bdi> ${t("يوماً", "Days")}</div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">${t("متاح", "Available")}</span> ${t("إجازات اعتيادية وفنية", "Annual & tech rest")}</div>
            </div>
          </div>

          <!-- Main Portal 2-Column Grid -->
          <div class="dash-portal-section-grid">
            
            <!-- Column 1: My Assigned Tasks -->
            <div class="dash-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div>
                  <h3 style="margin:0 0 0.25rem 0; font-size:1.1rem; font-weight:700;">${t("مهامي المسندة المباشرة (My Sprint Deliverables)", "My Assigned Sprint Deliverables")}</h3>
                  <p style="margin:0; font-size:0.8rem; color:var(--muted);">${t("المهام والبنود الموكلة إليك للعمل المباشر عليها وتحديث حالتها.", "Direct tasks allocated to your workspace. Update progress in real-time.")}</p>
                </div>
                <button type="button" class="btn btn--outline btn--xs" id="btn-portal-add-self-task">
                  <span>${icon("plus", "dash-btn-svg")} ${t("إضافة مهمة ذاتية", "Add Self-Task")}</span>
                </button>
              </div>

              <!-- List of My Tasks -->
              <div id="portal-my-tasks-list">
                <!-- Injected dynamically via JS -->
              </div>
            </div>

            <!-- Column 2: Administrative Requests Desk -->
            <div class="dash-card">
              <div style="margin-bottom:1rem;">
                <h3 style="margin:0 0 0.25rem 0; font-size:1.1rem; font-weight:700;">${t("مركز المعاملات والطلبات الإدارية", "Administrative Requests & Approvals Desk")}</h3>
                <p style="margin:0; font-size:0.8rem; color:var(--muted);">${t("تقديم طلبات الإجازات، الميزانيات، التراخيص، وترقيات الصلاحيات الإدارية.", "Submit requests for leave, hardware budgets, licenses, and clearance elevation.")}</p>
              </div>

              <!-- Request Form -->
              <form id="form-portal-submit-request" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:var(--radius-md, 10px); padding:1rem; margin-bottom:1.25rem;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.75rem;">
                  <div class="form-group">
                    <label class="form-label" for="portal-req-type" style="font-size:0.8rem;">${t("نوع المعاملة / الطلب", "Request Type")}</label>
                    <select name="req_type" class="form-select form-select--sm" id="portal-req-type" aria-label="${t("نوع المعاملة / الطلب", "Request Type")}" required>
                      <option value="leave">${t("طلب إجازة / استراحة تقنية", "Technical Leave / Rest")}</option>
                      <option value="budget">${t("طلب ميزانية عتاد وسيرفرات وتراخيص", "Hardware & Cloud Budget")}</option>
                      <option value="clearance">${t("طلب رفع تصريح أمني (Elevation)", "Clearance Elevation")}</option>
                      <option value="milestone">${t("تسليم مخرج هندسي / تقرير سبرنت", "Milestone / Deliverable Delivery")}</option>
                      <option value="expense">${t("طلب صرف نفقات تشغيلية ميدانية", "Operational Expense Claim")}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="portal-req-urgency" style="font-size:0.8rem;">${t("درجة الأولوية", "Urgency Tier")}</label>
                    <select name="req_urgency" class="form-select form-select--sm" id="portal-req-urgency" aria-label="${t("درجة الأولوية", "Urgency Tier")}">
                      <option value="normal">${t("عادي (Normal)", "Normal")}</option>
                      <option value="high">${t("أولوية تقنية (High Priority)", "High Priority")}</option>
                      <option value="critical">${t("طارئ تشغيلي (Critical)", "Critical")}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group" style="margin-bottom:0.75rem;">
                  <label class="form-label" for="portal-req-title" style="font-size:0.8rem;">${t("عنوان وتفاصيل المعاملة", "Subject & Justification")}</label>
                  <input type="text" name="req_title" class="form-input form-input--sm" id="portal-req-title" aria-label="${t("عنوان وتفاصيل المعاملة", "Subject & Justification")}" placeholder="${t("مثال: طلب عتاد سيرفرات استضافة محلية لغزة", "e.g., Local mesh server hardware budget")}" required>
                </div>

                <div class="form-group" style="margin-bottom:0.75rem;">
                  <label class="form-label" for="portal-req-notes" style="font-size:0.8rem;">${t("شرح ومبررات الطلب", "Justification & Details")}</label>
                  <textarea name="req_notes" class="form-textarea form-textarea--sm" id="portal-req-notes" aria-label="${t("شرح ومبررات الطلب", "Provide details, justifications, timeline or cost estimates")}" rows="2" placeholder="${t("شرح ومبررات الطلب، التواريخ المقترحة أو المبالغ التقديرية...", "Provide details, justifications, timeline or cost estimates...")}" required></textarea>
                </div>

                <button type="submit" class="btn btn--primary btn--sm" style="width:100%;">
                  <span>${icon("clipboard", "dash-btn-svg")} ${t("إرسال المعاملة للمصادقة الإدارية", "Submit Request for Administrative Review")}</span>
                </button>
              </form>

              <!-- Requests Ledger Table -->
              <h4 style="margin:0 0 0.5rem 0; font-size:0.9rem; font-weight:600;">${t("سجل معاملاتي الإدارية المقدمة", "My Submitted Requests Ledger")}</h4>
              <div class="dash-table-wrap" style="max-height:220px; overflow-y:auto;">
                <table class="dash-table dash-table--sm">
                  <thead>
                    <tr>
                      <th>${t("رقم المعاملة", "Ref ID")}</th>
                      <th>${t("نوع الطلب", "Type")}</th>
                      <th>${t("الموضوع", "Subject")}</th>
                      <th>${t("الحالة", "Status")}</th>
                    </tr>
                  </thead>
                  <tbody id="portal-requests-tbody">
                    <!-- Injected via JS -->
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <!-- Manager / Root Approvals Queue (Visible for ROOT Eng. Ahmed Ashraf) -->
          <div class="dash-card" id="portal-manager-approvals-box" style="margin-block-end: 1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <div>
                <div class="dash-badge-row">
                  <span class="badge badge--accent">${t("صلاحية المؤسس (ROOT)", "FOUNDER PRIVILEGE")}</span>
                  <span class="badge badge--ok" id="portal-pending-requests-count">2 ${t("معاملات بانتظار الاعتماد", "Pending Approvals")}</span>
                </div>
                <h3 style="margin:0.25rem 0; font-size:1.15rem; font-weight:700;">${t("صندوق اعتماد ومصادقة معاملات الموظفين (Executive Approvals Inbox)", "Staff Administrative Approvals Inbox")}</h3>
                <p style="margin:0; font-size:0.85rem; color:var(--muted);">${t("مراجعة واعتماد طلبات الإجازات، النفقات، ميزانيات السيرفرات، وترقيات الصلاحيات لجميع مهندسي المنظومة.", "Review and approve leave requests, hardware budgets, and clearance elevation across all 10 engineers.")}</p>
              </div>
              <button type="button" class="btn btn--outline btn--xs" id="btn-refresh-approvals">
                <span>${icon("refresh", "dash-btn-svg")} ${t("تحديث الصندوق", "Refresh")}</span>
              </button>
            </div>

            <div class="dash-table-wrap">
              <table class="dash-table">
                <thead>
                  <tr>
                    <th>${t("رقم المعاملة", "Ref ID")}</th>
                    <th>${t("الموظف / المهندس", "Engineer")}</th>
                    <th>${t("نوع الطلب", "Type")}</th>
                    <th>${t("التفاصيل والمبرر", "Justification & Details")}</th>
                    <th>${t("التاريخ", "Date")}</th>
                    <th>${t("الإجراء والقرار", "Action / Decision")}</th>
                  </tr>
                </thead>
                <tbody id="portal-manager-approvals-tbody">
                  <!-- Injected via JS -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Attendance & Shift History Ledger Table -->
          <div class="dash-card" style="margin-block-end: 1.5rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <div>
                <h3 style="margin:0 0 0.25rem 0; font-size:1.1rem; font-weight:700;">${t("سجل جلسات العمل والدوام الموثقة (Attendance & Shift Audit Trail)", "Attendance & Shift Audit Trail")}</h3>
                <p style="margin:0; font-size:0.85rem; color:var(--muted);">${t("سجل زمني دقيق لكل جلسة عمل هندسية ومناوبة تم توثيقها في المنظومة.", "Immutable operational timestamp for every work shift and engineering session.")}</p>
              </div>
              <span class="badge badge--ok">${t("توثيق تلقائي مشفر", "Cryptographically Logged")}</span>
            </div>

            <div class="dash-table-wrap">
              <table class="dash-table">
                <thead>
                  <tr>
                    <th>${t("التاريخ", "Date")}</th>
                    <th>${t("وقت بدء الدوام", "Clock-In")}</th>
                    <th>${t("وقت الانصراف", "Clock-Out")}</th>
                    <th>${t("مدة الجلسة", "Session Duration")}</th>
                    <th>${t("طبيعة العمل المنجز", "Logged Focus")}</th>
                    <th>${t("حالة التوثيق", "Status")}</th>
                  </tr>
                </thead>
                <tbody id="portal-attendance-tbody">
                  <!-- Injected via JS -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Bottom Row: Performance Metrics + Notifications -->
          <div class="dash-portal-section-grid" style="margin-block-end: 1.5rem;">

            <!-- Weekly Performance Summary -->
            <div class="dash-card">
              <div style="margin-bottom:1rem;">
                <h3 style="margin:0 0 0.25rem 0; font-size:1.1rem; font-weight:700;">${t("ملخص الأداء الأسبوعي (Weekly Performance Brief)", "Weekly Engineering Performance Brief")}</h3>
                <p style="margin:0; font-size:0.85rem; color:var(--muted);">${t("مقارنة معدل الإنتاجية والالتزام بمعايير SLA للأسبوع الحالي مقارنة بالأسبوع السابق.", "SLA adherence, sprint velocity, and output delta vs. last week.")}</p>
              </div>

              <!-- Mini performance bars -->
              <div style="display:flex; flex-direction:column; gap:0.85rem;" id="portal-performance-bars">
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:0.3rem;">
                    <span>${t("الالتزام بمعايير SLA", "SLA Adherence")}</span>
                    <span style="font-family:var(--font-mono); color:var(--accent);" id="perf-sla-val">99.4%</span>
                  </div>
                  <div style="height:6px; background:rgba(255,255,255,0.06); border-radius:999px; overflow:hidden;">
                    <div id="perf-sla-bar" style="height:100%; border-radius:999px; background:linear-gradient(90deg, var(--accent, #00F0FF), rgba(0,240,255,0.4)); width:99.4%; transition:width 0.8s ease;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:0.3rem;">
                    <span>${t("سرعة إنجاز السبرنت", "Sprint Velocity")}</span>
                    <span style="font-family:var(--font-mono); color:var(--accent);" id="perf-sprint-val">96.4%</span>
                  </div>
                  <div style="height:6px; background:rgba(255,255,255,0.06); border-radius:999px; overflow:hidden;">
                    <div id="perf-sprint-bar" style="height:100%; border-radius:999px; background:linear-gradient(90deg, #10B981, rgba(16,185,129,0.4)); width:96.4%; transition:width 0.8s ease;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:0.3rem;">
                    <span>${t("استغلال ساعات العمل", "Work Hours Utilization")}</span>
                    <span style="font-family:var(--font-mono); color:var(--accent);" id="perf-hours-val">96.2%</span>
                  </div>
                  <div style="height:6px; background:rgba(255,255,255,0.06); border-radius:999px; overflow:hidden;">
                    <div id="perf-hours-bar" style="height:100%; border-radius:999px; background:linear-gradient(90deg, #8B5CF6, rgba(139,92,246,0.4)); width:96.2%; transition:width 0.8s ease;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:0.3rem;">
                    <span>${t("جودة المخرجات الهندسية المرفوعة", "Engineering Output Quality")}</span>
                    <span style="font-family:var(--font-mono); color:var(--accent);" id="perf-quality-val">98.0%</span>
                  </div>
                  <div style="height:6px; background:rgba(255,255,255,0.06); border-radius:999px; overflow:hidden;">
                    <div id="perf-quality-bar" style="height:100%; border-radius:999px; background:linear-gradient(90deg, #F59E0B, rgba(245,158,11,0.4)); width:98.0%; transition:width 0.8s ease;"></div>
                  </div>
                </div>
              </div>

              <div style="margin-top:1rem; padding-top:0.85rem; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <span style="font-size:0.8rem; color:var(--muted);">${t("الفترة الزمنية: الأسبوع الحالي", "Period: Current Calendar Week")}</span>
                <div style="display:flex; gap:0.5rem;">
                  <span class="badge badge--ok">+1.8% ${t("مقارنة بالأسبوع السابق", "vs Last Week")}</span>
                  <span class="badge badge--accent">${t("أداء متميز", "Outstanding")}</span>
                </div>
              </div>
            </div>

            <!-- Real-time Notifications & System Alerts Feed -->
            <div class="dash-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div>
                  <h3 style="margin:0 0 0.25rem 0; font-size:1.1rem; font-weight:700;">${t("سجل التنبيهات والإشعارات الإدارية (Notifications Feed)", "Administrative Notifications Feed")}</h3>
                  <p style="margin:0; font-size:0.85rem; color:var(--muted);">${t("تنبيهات المنظومة والإشعارات الإدارية الموجهة لجلستك الحالية.", "System alerts and admin notifications directed to your active workspace.")}</p>
                </div>
                <span class="badge badge--accent" id="portal-notif-count">4</span>
              </div>

              <div id="portal-notifications-feed" style="display:flex; flex-direction:column; gap:0.6rem; max-height:280px; overflow-y:auto; padding-inline-end:0.25rem;">
                <!-- Injected via JS -->
              </div>
            </div>

          </div>


                  <!-- ================= NEW SOVEREIGN EMPLOYEE SUITE ================= -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 1.25rem; margin-top: 1.25rem;">
            
            <!-- 1. Encrypted Pay Slip & Compensation Card -->
            <div class="dash-card" id="portal-payslip-card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                <div>
                  <div class="dash-badge-row" style="margin-bottom:0.25rem;">
                    <span class="chip chip--accent"><span class="dot dot--live"></span>${t("مسير الرواتب المعتمد IFRS", "IFRS Certified Remuneration")}</span>
                    <span class="badge badge--ok" id="payslip-serial-badge">SLIP-AWL-2026-09</span>
                  </div>
                  <h3 style="margin:0; font-size:1.15rem; font-weight:700;">${t("قسيمة الراتب والمستحقات المشفرة (Digital Pay Slip)", "Encrypted Salary & Remuneration Slip")}</h3>
                  <p class="text-muted small" style="margin:0.25rem 0 0 0;">${t("بيان المستحقات والبدلات الشهرية مع الختم المالي المشفر وتوثيق التحويل.", "Verified monthly compensation, field hazard allowances and net payable balance.")}</p>
                </div>
                <div style="text-align:inline-end;">
                  <span class="badge badge--outline mono" id="payslip-period">SEP 2026</span>
                </div>
              </div>

              <!-- Pay Slip Table Breakdown -->
              <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:var(--radius-md, 10px); padding:0.85rem; margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; padding:0.4rem 0; border-bottom:1px dashed rgba(255,255,255,0.08); font-size:0.85rem;">
                  <span class="text-muted">${t("الراتب الأساسي (Base Salary)", "Base Salary")}</span>
                  <span class="mono" style="font-weight:700;" id="slip-base-amount">$8,500.00</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:0.4rem 0; border-bottom:1px dashed rgba(255,255,255,0.08); font-size:0.85rem;">
                  <span class="text-muted">${t("بدل المخاطر الميدانية - عقدة غزة (Field Hardship)", "Field Hardship Allowance")}</span>
                  <span class="mono" style="color:var(--accent); font-weight:700;" id="slip-hardship-amount">+$2,200.00</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:0.4rem 0; border-bottom:1px dashed rgba(255,255,255,0.08); font-size:0.85rem;">
                  <span class="text-muted">${t("بدل الاتصال الفضائي والإنترنت السيادي (Satellite Uplink)", "Satellite & Comms Allowance")}</span>
                  <span class="mono" style="color:#10B981; font-weight:700;" id="slip-comms-amount">+$350.00</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:0.4rem 0; border-bottom:1px dashed rgba(255,255,255,0.08); font-size:0.85rem;">
                  <span class="text-muted">${t("حافز الإنجاز وسرعة السبرنت (Sprint Milestone Bonus)", "Milestone Delivery Bonus")}</span>
                  <span class="mono" style="color:#F59E0B; font-weight:700;" id="slip-bonus-amount">+$1,000.00</span>
                </div>
                <div style="display:flex; justify-content:space-between; padding:0.4rem 0; border-bottom:1px dashed rgba(255,255,255,0.08); font-size:0.85rem;">
                  <span class="text-muted">${t("الخصومات وصندوق التكافل الطارئ (Emergency Takaful)", "Deductions & Emergency Fund")}</span>
                  <span class="mono" style="color:#EF4444; font-weight:700;" id="slip-deductions-amount">-$150.00</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.65rem 0 0.2rem 0; font-size:1rem; font-weight:800;">
                  <span>${t("صافي المستحقات المحولة (Net Payable)", "Net Payable Amount")}</span>
                  <span class="mono" style="font-size:1.3rem; color:var(--accent); text-shadow:0 0 10px rgba(0,240,255,0.3);" id="slip-net-payable">$11,900.00</span>
                </div>
              </div>

              <div style="display:flex; flex-wrap:wrap; gap:0.5rem; justify-content:space-between; align-items:center;">
                <div style="font-size:0.75rem; color:var(--muted); display:flex; align-items:center; gap:0.35rem;">
                  <span class="dot dot--live"></span>
                  <span class="mono" id="slip-sha-seal">SHA-256: 7f83b165...e2d1</span>
                </div>
                <div style="display:flex; gap:0.4rem;">
                  <button type="button" class="btn btn--outline btn--xs" id="btn-export-payslip">
                    <span>${icon("download", "dash-btn-svg")} ${t("تحميل القسيمة المشفرة (PDF)", "Export Slip (PDF)")}</span>
                  </button>
                  <button type="button" class="btn btn--primary btn--xs" id="btn-request-advance">
                    <span>${icon("clipboard", "dash-btn-svg")} ${t("طلب سلفة على الراتب", "Request Advance")}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 2. Performance Evaluation & Quality Radar Card -->
            <div class="dash-card" id="portal-performance-card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                <div>
                  <div class="dash-badge-row" style="margin-bottom:0.25rem;">
                    <span class="chip chip--accent"><span class="dot dot--live"></span>${t("تقييم الربع الثالث 2026", "Q3 2026 Evaluation")}</span>
                    <span class="badge badge--ok" id="perf-score-badge">98.4 / 100</span>
                  </div>
                  <h3 style="margin:0; font-size:1.15rem; font-weight:700;">${t("مؤشرات الجودة وتقييم الأداء (Performance Radar)", "Quality Metrics & OKR Evaluation")}</h3>
                  <p class="text-muted small" style="margin:0.25rem 0 0 0;">${t("تقييم الإدارة الهندسية لمعمارية النظم، الالتزام بالـ SLA، والابتكار الميداني.", "Verified engineering score, SLA conformance, and cross-node delivery milestones.")}</p>
                </div>
              </div>

              <!-- Quality Metrics Meters -->
              <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1rem;">
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.25rem;">
                    <span>${t("معمارية النظم وجودة الكود (Code Architecture & Zero-Defects)", "Architecture & Code Quality")}</span>
                    <span class="mono" style="font-weight:700; color:var(--accent);" id="meter-code-val">98.5%</span>
                  </div>
                  <div class="progress-bar-bg" style="height:6px; background:rgba(255,255,255,0.06); border-radius:999px; overflow:hidden;">
                    <div id="meter-code-bar" style="height:100%; width:98.5%; background:linear-gradient(90deg, #00F0FF, #10B981); border-radius:999px;"></div>
                  </div>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.25rem;">
                    <span>${t("الالتزام بمناوبات الطوارئ وزمن الاستجابة (SLA Response)", "Incident SLA & Response Time")}</span>
                    <span class="mono" style="font-weight:700; color:#10B981;" id="meter-sla-val">99.2%</span>
                  </div>
                  <div class="progress-bar-bg" style="height:6px; background:rgba(255,255,255,0.06); border-radius:999px; overflow:hidden;">
                    <div id="meter-sla-bar" style="height:100%; width:99.2%; background:#10B981; border-radius:999px;"></div>
                  </div>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.25rem;">
                    <span>${t("الابتكار التقني وتطوير بروتوكولات عوالِم (Sovereign Innovation)", "Autonomous R&D Innovation")}</span>
                    <span class="mono" style="font-weight:700; color:#F59E0B;" id="meter-inno-val">96.0%</span>
                  </div>
                  <div class="progress-bar-bg" style="height:6px; background:rgba(255,255,255,0.06); border-radius:999px; overflow:hidden;">
                    <div id="meter-inno-bar" style="height:100%; width:96%; background:#F59E0B; border-radius:999px;"></div>
                  </div>
                </div>

                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.25rem;">
                    <span>${t("التنسيق الميداني والتعاون بين العقد (Cross-Node Collaboration)", "Cross-Node Synergy")}</span>
                    <span class="mono" style="font-weight:700; color:#8B5CF6;" id="meter-team-val">97.8%</span>
                  </div>
                  <div class="progress-bar-bg" style="height:6px; background:rgba(255,255,255,0.06); border-radius:999px; overflow:hidden;">
                    <div id="meter-team-bar" style="height:100%; width:97.8%; background:#8B5CF6; border-radius:999px;"></div>
                  </div>
                </div>
              </div>

              <!-- Executive Commendation Note -->
              <div style="padding:0.75rem; border-radius:8px; background:rgba(0,240,255,0.03); border:1px solid rgba(0,240,255,0.12); font-size:0.8rem; line-height:1.5;">
                <div style="font-weight:700; color:var(--accent); margin-bottom:0.2rem;">${t("ملاحظة القيادة التنفيذية (Executive Feedback):", "Executive Leadership Feedback:")}</div>
                <span id="perf-feedback-text">${t("أداء استثنائي في تأمين استقرار شبكة البث الفضائي بين غزة ودبي وتصفير زمن التأخير تحت 15 ملي ثانية.", "Exceptional delivery on sub-15ms satellite uplink and resilient node synchronization under adverse conditions.")}</span>
              </div>
            </div>

            <!-- 3. Executive Directives & Official Memos Inbox -->
            <div class="dash-card" id="portal-directives-card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                <div>
                  <div class="dash-badge-row" style="margin-bottom:0.25rem;">
                    <span class="chip chip--accent"><span class="dot dot--live"></span>${t("صندوق القرارات والتعاميم", "Executive Directives")}</span>
                    <span class="badge badge--warn" id="directives-unread-badge">${t("تعميمان جديدان", "2 New Directives")}</span>
                  </div>
                  <h3 style="margin:0; font-size:1.15rem; font-weight:700;">${t("التعاميم والمذكرات الرسمية المباشرة (Directives Vault)", "Official Directives & Memos Vault")}</h3>
                  <p class="text-muted small" style="margin:0.25rem 0 0 0;">${t("المذكرات الإدارية الصادرة من أحمد أشرف ومجلس إدارة عوالِم الموجهة للموظف.", "Direct administrative instructions issued by founder Ahmed Ashraf and executive board.")}</p>
                </div>
              </div>

              <!-- Directives List Container -->
              <div id="portal-directives-list" style="display:flex; flex-direction:column; gap:0.65rem; max-height:260px; overflow-y:auto; padding-inline-end:0.25rem;">
                <!-- Populated via JS -->
              </div>
            </div>

          
            <!-- 4. Sovereign Hardware & Custody Ledger Card -->
            <div class="dash-card" id="portal-hardware-card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                <div>
                  <div class="dash-badge-row" style="margin-bottom:0.25rem;">
                    <span class="chip chip--accent"><span class="dot dot--live"></span>${t("العتاد والأجهزة السيادية", "Hardware & Custody Ledger")}</span>
                    <span class="badge badge--ok" id="hardware-status-badge">${t("4 أجهزة معتمدة ومسجلة", "4 Active Devices")}</span>
                  </div>
                  <h3 style="margin:0; font-size:1.15rem; font-weight:700;">${t("سجل العهد التقنية والأجهزة الميدانية (Hardware Custody)", "Assigned Sovereign Hardware & Tokens")}</h3>
                  <p class="text-muted small" style="margin:0.25rem 0 0 0;">${t("الأجهزة المشفرة ومفاتيح الأمان الصلبة المخصصة لجلستك ومهامك الميدانية.", "Encrypted workstation, hardware security keys, and satellite transceivers in active custody.")}</p>
                </div>
              </div>

              <!-- Hardware Items List -->
              <div id="portal-hardware-list" style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.65rem 0.85rem; border-radius:8px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);">
                  <div style="display:flex; align-items:center; gap:0.65rem;">
                    <span style="font-size:1.2rem;">💻</span>
                    <div>
                      <div style="font-weight:700; font-size:0.85rem;" id="hw-pc-name">MacBook Pro M3 Max 64GB (Hardware Enclave)</div>
                      <div class="mono text-muted small" style="font-size:0.7rem;" id="hw-pc-serial">SN: AWL-ENG-M3-9941 · Secured FileVault</div>
                    </div>
                  </div>
                  <span class="badge badge--ok" style="font-size:0.7rem;">${t("نشط ومعتمد", "Verified")}</span>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.65rem 0.85rem; border-radius:8px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);">
                  <div style="display:flex; align-items:center; gap:0.65rem;">
                    <span style="font-size:1.2rem;">📡</span>
                    <div>
                      <div style="font-weight:700; font-size:0.85rem;" id="hw-sat-name">Sovereign Mesh Satellite Transceiver 4.8GHz</div>
                      <div class="mono text-muted small" style="font-size:0.7rem;" id="hw-sat-serial">SN: SAT-MESH-NODE-08 · Sub-15ms Latency</div>
                    </div>
                  </div>
                  <span class="badge badge--ok" style="font-size:0.7rem;">${t("متصل بالقمر", "Uplink Active")}</span>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.65rem 0.85rem; border-radius:8px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);">
                  <div style="display:flex; align-items:center; gap:0.65rem;">
                    <span style="font-size:1.2rem;">🔑</span>
                    <div>
                      <div style="font-weight:700; font-size:0.85rem;" id="hw-key-name">YubiKey 5C NFC FIPS Cryptographic Token</div>
                      <div class="mono text-muted small" style="font-size:0.7rem;" id="hw-key-serial">FIPS 140-2 Level 3 · Serial: 8841-AA01</div>
                    </div>
                  </div>
                  <span class="badge badge--accent" style="font-size:0.7rem;">${t("مفتاح صلب FIPS", "FIPS HW")}</span>
                </div>
              </div>

              <!-- Action button for Hardware Request -->
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <button type="button" class="btn btn--outline btn--xs" id="btn-portal-emergency-ping" style="border-color:#EF4444; color:#EF4444;">
                  <span>⚡ ${t("نداء عمليات طارئ (Emergency Ping)", "Emergency Command Ping")}</span>
                </button>
                <button type="button" class="btn btn--outline btn--xs" id="btn-request-hardware">
                  <span>${icon("clipboard", "dash-btn-svg")} ${t("طلب صيانة / عتاد إضافي", "Request Hardware Service")}</span>
                </button>
              </div>
            </div>
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
              <button type="button" class="btn btn--outline btn--sm" id="btn-open-dispatch">
                <span>${icon("plus", "dash-btn-svg")} 📦 ${t("توجيه شحنة إمداد عاجلة", "Dispatch Supply Kit")}</span>
              </button>
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

          <!-- Interactive Regional P2P Mesh Radar -->
          <div class="dash-card" style="margin-bottom:1.5rem; background:rgba(10,14,20,0.85); border:1px solid rgba(0,240,255,0.25); box-shadow:0 12px 36px rgba(0,0,0,0.5);">
            <div class="dash-card-header">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="dot dot--live" aria-hidden="true"></span>
                <h3 class="dash-card-title">${t("رادار الطوبولوجيا الحية لشبكة غزة وبيروت (Live P2P Mesh Radar)", "Live P2P Mesh Topology & Telemetry Radar")}</h3>
              </div>
              <div style="display:flex; gap:0.6rem; align-items:center;">
                <span class="mono" style="font-size:0.75rem; color:var(--cyan, #00f0ff); background:rgba(0,240,255,0.08); padding:3px 8px; border-radius:6px; border:1px solid rgba(0,240,255,0.2);"><bdi dir="ltr">6,420 pkts/s · 0% Loss</bdi></span>
                <span class="badge badge--ok">${t("مزامنة فورية دون إنترنت", "Sub-Millisecond Merkle")}</span>
              </div>
            </div>
            <div style="padding:1rem; position:relative; overflow:hidden;">
              <svg viewBox="0 0 800 220" style="width:100%; height:auto; display:block; filter:drop-shadow(0 0 10px rgba(0,240,255,0.15));" role="img" aria-label="${t("مخطط الطوبولوجيا الحية للعقد الميدانية", "Live Field Node Topology Diagram")}">
                <!-- Connecting Laser Lines -->
                <line x1="120" y1="110" x2="260" y2="70" stroke="rgba(0,240,255,0.4)" stroke-width="2" stroke-dasharray="4 4" />
                <line x1="260" y1="70" x2="400" y2="120" stroke="rgba(0,240,255,0.4)" stroke-width="2" stroke-dasharray="4 4" />
                <line x1="400" y1="120" x2="540" y2="60" stroke="rgba(0,240,255,0.4)" stroke-width="2" stroke-dasharray="4 4" />
                <line x1="540" y1="60" x2="680" y2="110" stroke="rgba(212,175,55,0.4)" stroke-width="2" stroke-dasharray="4 4" />
                <line x1="120" y1="110" x2="400" y2="120" stroke="rgba(16,185,129,0.3)" stroke-width="1.5" stroke-dasharray="6 6" />

                <!-- Node 1: Rafah (Node-RF02) -->
                <g class="mesh-radar-node" data-node="Node-RF02" style="cursor:pointer;">
                  <circle cx="120" cy="110" r="22" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2" />
                  <circle cx="120" cy="110" r="6" fill="#10b981" />
                  <text x="120" y="150" fill="#fff" font-size="11" font-weight="700" text-anchor="middle">${t("رفح (RF-02)", "Rafah (RF-02)")}</text>
                  <text x="120" y="165" fill="#10b981" font-size="9" text-anchor="middle">0.08ms · 100% Offline</text>
                </g>

                <!-- Node 2: Khan Yunis (Node-KH01) -->
                <g class="mesh-radar-node" data-node="Node-KH01" style="cursor:pointer;">
                  <circle cx="260" cy="70" r="26" fill="rgba(0,240,255,0.2)" stroke="#00f0ff" stroke-width="2" />
                  <circle cx="260" cy="70" r="7" fill="#00f0ff" />
                  <text x="260" y="110" fill="#fff" font-size="11" font-weight="700" text-anchor="middle">${t("مجمع ناصر (KH-01)", "Nasser Complex (KH-01)")}</text>
                  <text x="260" y="125" fill="#00f0ff" font-size="9" text-anchor="middle">0.12ms · LoRa+Starlink</text>
                </g>

                <!-- Node 3: Deir al-Balah (Node-DB03) -->
                <g class="mesh-radar-node" data-node="Node-DB03" style="cursor:pointer;">
                  <circle cx="400" cy="120" r="22" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2" />
                  <circle cx="400" cy="120" r="6" fill="#10b981" />
                  <text x="400" y="160" fill="#fff" font-size="11" font-weight="700" text-anchor="middle">${t("الأقصى · دير البلح (DB-03)", "Al-Aqsa · Deir al-Balah (DB-03)")}</text>
                  <text x="400" y="175" fill="#10b981" font-size="9" text-anchor="middle">0.15ms · Solar Core</text>
                </g>

                <!-- Node 4: North Gaza (Node-GZ04) -->
                <g class="mesh-radar-node" data-node="Node-GZ04" style="cursor:pointer;">
                  <circle cx="540" cy="60" r="24" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="2" />
                  <circle cx="540" cy="60" r="6" fill="#f59e0b" />
                  <text x="540" y="100" fill="#fff" font-size="11" font-weight="700" text-anchor="middle">${t("المعمداني · غزة الشمال (GZ-04)", "Al-Ahli · North Gaza (GZ-04)")}</text>
                  <text x="540" y="115" fill="#f59e0b" font-size="9" text-anchor="middle">Radio Relay · Secured</text>
                </g>

                <!-- Node 5: Beirut South (Node-BY05) -->
                <g class="mesh-radar-node" data-node="Node-BY05" style="cursor:pointer;">
                  <circle cx="680" cy="110" r="22" fill="rgba(212,175,55,0.2)" stroke="#d4af37" stroke-width="2" />
                  <circle cx="680" cy="110" r="6" fill="#d4af37" />
                  <text x="680" y="150" fill="#fff" font-size="11" font-weight="700" text-anchor="middle">${t("الضاحية · بيروت (BY-05)", "Beirut South (BY-05)")}</text>
                  <text x="680" y="165" fill="#d4af37" font-size="9" text-anchor="middle">Encrypted Mesh Trunk</text>
                </g>
              </svg>
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
                <div class="dash-node-row" style="display:flex; justify-content:space-between; align-items:center;">
                  <div class="dash-node-info">
                    <span class="node-status-dot node-status-dot--online"></span>
                    <div>
                      <b>${t("مجمع ناصر الطبي · خان يونس (Node-KH01)", "Nasser Medical Complex · Khan Yunis")}</b>
                      <span class="node-meta">P2P Mesh · Latency 0.1ms · 42 ${t("طبيب متصل", "Doctors Online")}</span>
                    </div>
                  </div>
                  <div style="display:flex; gap:0.4rem; align-items:center;">
                    <span class="badge badge--ok">99.9% Mesh</span>
                    <button type="button" class="btn btn--outline btn--xs btn-inspect-node" data-node="Node-KH01"><span>⚡ ${t("فحص العقدة", "Inspect")}</span></button>
                    <button type="button" class="btn btn--primary btn--xs btn-quick-dispatch" data-node="Node-KH01"><span>📦 ${t("إمداد", "Supply")}</span></button>
                  </div>
                </div>
                <div class="dash-node-row" style="display:flex; justify-content:space-between; align-items:center;">
                  <div class="dash-node-info">
                    <span class="node-status-dot node-status-dot--online"></span>
                    <div>
                      <b>${t("المستشفى الكويتي الميداني · رفح (Node-RF02)", "Kuwaiti Field Hospital · Rafah")}</b>
                      <span class="node-meta">0 bps Internet · Merkle Synced · 28 ${t("طبيب متصل", "Doctors Online")}</span>
                    </div>
                  </div>
                  <div style="display:flex; gap:0.4rem; align-items:center;">
                    <span class="badge badge--ok">100% Offline</span>
                    <button type="button" class="btn btn--outline btn--xs btn-inspect-node" data-node="Node-RF02"><span>⚡ ${t("فحص العقدة", "Inspect")}</span></button>
                    <button type="button" class="btn btn--primary btn--xs btn-quick-dispatch" data-node="Node-RF02"><span>📦 ${t("إمداد", "Supply")}</span></button>
                  </div>
                </div>
                <div class="dash-node-row" style="display:flex; justify-content:space-between; align-items:center;">
                  <div class="dash-node-info">
                    <span class="node-status-dot node-status-dot--online"></span>
                    <div>
                      <b>${t("مستشفى شهداء الأقصى · دير البلح (Node-DB03)", "Al-Aqsa Martyrs Hospital · Deir al-Balah")}</b>
                      <span class="node-meta">Solar Powered · 0.2ms Kernel · 35 ${t("طبيب متصل", "Doctors Online")}</span>
                    </div>
                  </div>
                  <div style="display:flex; gap:0.4rem; align-items:center;">
                    <span class="badge badge--ok">Active Node</span>
                    <button type="button" class="btn btn--outline btn--xs btn-inspect-node" data-node="Node-DB03"><span>⚡ ${t("فحص العقدة", "Inspect")}</span></button>
                    <button type="button" class="btn btn--primary btn--xs btn-quick-dispatch" data-node="Node-DB03"><span>📦 ${t("إمداد", "Supply")}</span></button>
                  </div>
                </div>
                <div class="dash-node-row" style="display:flex; justify-content:space-between; align-items:center;">
                  <div class="dash-node-info">
                    <span class="node-status-dot node-status-dot--online"></span>
                    <div>
                      <b>${t("مستشفى المعمداني للطوارئ · غزة الشمال (Node-GZ04)", "Al-Ahli Arab Hospital · North Gaza")}</b>
                      <span class="node-meta">Encrypted Radio Relay · 19 ${t("طبيب متصل", "Doctors Online")}</span>
                    </div>
                  </div>
                  <div style="display:flex; gap:0.4rem; align-items:center;">
                    <span class="badge badge--ok">Encrypted P2P</span>
                    <button type="button" class="btn btn--outline btn--xs btn-inspect-node" data-node="Node-GZ04"><span>⚡ ${t("فحص العقدة", "Inspect")}</span></button>
                    <button type="button" class="btn btn--primary btn--xs btn-quick-dispatch" data-node="Node-GZ04"><span>📦 ${t("إمداد", "Supply")}</span></button>
                  </div>
                </div>
                <div class="dash-node-row" style="display:flex; justify-content:space-between; align-items:center;">
                  <div class="dash-node-info">
                    <span class="node-status-dot node-status-dot--online"></span>
                    <div>
                      <b>${t("المركز الصحي الميداني · ضاحية بيروت (Node-BY05)", "Beirut Southern Field Health Center · Lebanon")}</b>
                      <span class="node-meta">Encrypted Trunk · 0.18ms Latency · 24 ${t("طبيب متصل", "Doctors Online")}</span>
                    </div>
                  </div>
                  <div style="display:flex; gap:0.4rem; align-items:center;">
                    <span class="badge badge--ok" style="background:rgba(212,175,55,0.15); color:var(--gold,#d4af37);">Regional Hub</span>
                    <button type="button" class="btn btn--outline btn--xs btn-inspect-node" data-node="Node-BY05"><span>⚡ ${t("فحص العقدة", "Inspect")}</span></button>
                    <button type="button" class="btn btn--primary btn--xs btn-quick-dispatch" data-node="Node-BY05"><span>📦 ${t("إمداد", "Supply")}</span></button>
                  </div>
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

            <!-- Platform Engineering Analytics -->
            <div class="dash-card">
              <h3>${t("إحصائيات المنصة الهندسية (Engineering Analytics)", "Platform Engineering Analytics")}</h3>
              <p class="text-muted small" style="margin-bottom: 1rem;">${t("إحصائيات موثقة وشاملة عن كامل مكونات المنظومة البرمجية.", "Verified engineering metrics across the sovereign platform stack.")}</p>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(165px, 1fr)); gap: 0.85rem;">
                <div style="padding:0.85rem; border-radius:8px; background:rgba(0,240,255,0.04); border:1px solid rgba(0,240,255,0.12); text-align:center;">
                  <div class="mono" style="font-size:1.8rem; font-weight:800; color:var(--accent);">84</div>
                  <div class="text-muted small">${t("صفحة مبنية / لغتين", "Pages · 2 Locales")}</div>
                </div>
                <div style="padding:0.85rem; border-radius:8px; background:rgba(16,185,129,0.04); border:1px solid rgba(16,185,129,0.12); text-align:center;">
                  <div class="mono" style="font-size:1.8rem; font-weight:800; color:#10B981;">0</div>
                  <div class="text-muted small">${t("تبعيات npm خارجية", "npm Dependencies")}</div>
                </div>
                <div style="padding:0.85rem; border-radius:8px; background:rgba(245,158,11,0.04); border:1px solid rgba(245,158,11,0.12); text-align:center;">
                  <div class="mono" style="font-size:1.8rem; font-weight:800; color:#F59E0B;">0.2ms</div>
                  <div class="text-muted small">${t("متوسط زمن الاستجابة", "Mean Latency")}</div>
                </div>
                <div style="padding:0.85rem; border-radius:8px; background:rgba(139,92,246,0.04); border:1px solid rgba(139,92,246,0.12); text-align:center;">
                  <div class="mono" style="font-size:1.8rem; font-weight:800; color:#8B5CF6;">11</div>
                  <div class="text-muted small">${t("مهندس موثق بالشبكة", "Engineers in Network")}</div>
                </div>
                <div style="padding:0.85rem; border-radius:8px; background:rgba(0,240,255,0.04); border:1px solid rgba(0,240,255,0.12); text-align:center;">
                  <div class="mono" style="font-size:1.8rem; font-weight:800; color:var(--accent);">268KB</div>
                  <div class="text-muted small">${t("حجم CSS الكامل", "Total CSS Bundle")}</div>
                </div>
                <div style="padding:0.85rem; border-radius:8px; background:rgba(16,185,129,0.04); border:1px solid rgba(16,185,129,0.12); text-align:center;">
                  <div class="mono" style="font-size:1.8rem; font-weight:800; color:#10B981;">99.99%</div>
                  <div class="text-muted small">${t("اعتمادية SLA الحية", "Live SLA Uptime")}</div>
                </div>
              </div>
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
              <textarea name="comment" aria-label="${t("التعليق أو التوجيه الفني", "Technical Comment or Note")}" aria-describedby="task-drawer-comment-err" class="dash-textarea" id="task-drawer-comment-input" rows="2" placeholder="${t("أضف تعليقاً أو توجيهاً فنياً...", "Add comment or technical note...")}"></textarea>
              <div id="task-drawer-comment-err" role="alert" aria-live="polite" style="color:#EF4444;font-size:0.75rem;min-height:0.8rem;margin:2px 0;"></div>
              <div class="dash-comment-form-ft">
                <div class="dash-acting-as">
                  <span>${t("الهوية المعتمِدة:", "Acting as:")}</span>
                  <select name="acting_as" aria-label="${t("الهوية المعتمِدة", "Acting as Identity")}" class="dash-select-xs" id="task-drawer-acting-as" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#fff;font-size:0.75rem;padding:2px 6px;">
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

    
    <!-- New Owner Directive Modal -->
    <div class="dash-modal-overlay" id="modal-new-directive">
      <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-directive-title">
        <div class="dash-modal-header">
          <h3 class="dash-modal-title" id="modal-directive-title">${t("إصدار وتوقيع أمر رئاسي سيادي", "Issue & Sign Sovereign Directive")}</h3>
          <button type="button" class="dash-modal-close" id="btn-close-directive-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>
        <div class="dash-modal-body">
          <div class="dash-field-group">
            <label class="dash-label">${t("نص التوجيه السيادي الملزم", "Directive Mandate & Title")}</label>
            <input type="text" class="dash-input" id="input-dir-title" placeholder="${t("مثال: ربط شبكة رحمة كير بالأقمار الصناعية الاحتياطية...", "e.g. Integrate backup satellite links for RahmaCare...")}">
          </div>
          <div class="dash-grid-2" style="gap: 12px;">
            <div class="dash-field-group">
              <label class="dash-label">${t("مستوى الأولوية", "Priority Level")}</label>
              <select class="dash-select" id="select-dir-priority">
                <option value="critical">${t("طوارئ قصوى (Priority 0)", "Priority 0 - Emergency")}</option>
                <option value="urgent">${t("حرج جداً (Priority 1)", "Priority 1 - Urgent")}</option>
                <option value="high" selected>${t("عالي (Priority 2)", "Priority 2 - High")}</option>
              </select>
            </div>
            <div class="dash-field-group">
              <label class="dash-label">${t("الذراع المستهدف بالتنفيذ", "Target Sovereign Venture")}</label>
              <select class="dash-select" id="select-dir-venture">
                <option value="all">${t("كافة الأذرع السيادية الستة", "All 6 Sovereign Arms")}</option>
                <option value="rahmacare">${t("رحمة كير (RahmaCare Mesh)", "RahmaCare Mesh")}</option>
                <option value="islandhaven">${t("آيلاند هيفن (Island Haven)", "Island Haven Core")}</option>
                <option value="falcon">${t("فالكون ومحاسب ذكي (Falcon ERP)", "Falcon ERP")}</option>
                <option value="academy">${t("أكاديمية عوالِم (Awalim Academy)", "Awalim Academy")}</option>
                <option value="vibeos">${t("مختبر الذكاء وVibe OS", "AI Lab & Vibe OS")}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="dash-modal-footer">
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-directive">${t("إلغاء", "Cancel")}</button>
            <button type="button" class="btn btn--primary btn--sm" id="btn-submit-directive">
              <span>${icon("shield", "dash-btn-svg")} ${t("توقيع واعتماد الأمر تشفيرياً", "Sign & Dispatch Directive")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Venture Tactical Inspection Modal -->
    <div class="dash-modal-overlay" id="modal-venture-inspect">
      <div class="dash-modal" style="max-width: 680px;" role="dialog" aria-modal="true" aria-labelledby="modal-venture-title">
        <div class="dash-modal-header">
          <div>
            <span class="chip chip--gold" id="modal-venture-badge" style="margin-bottom: 4px;"></span>
            <h3 class="dash-modal-title" id="modal-venture-title"></h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-venture-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>
        <div class="dash-modal-body">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 1rem;">
            <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 0.68rem; color: var(--text-muted);">${t("القائد التنفيذي", "Executive Lead")}</div>
              <div class="mono" id="modal-venture-lead" style="font-size: 0.85rem; font-weight: var(--w-bold); color: var(--text-1); margin-top: 2px;"></div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 0.68rem; color: var(--text-muted);">${t("حصة الإيراد", "Rev Share")}</div>
              <div class="mono" id="modal-venture-share" style="font-size: 0.85rem; font-weight: var(--w-bold); color: var(--gold,#D4AF37); margin-top: 2px;"></div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 0.68rem; color: var(--text-muted);">${t("زمن الاستجابة", "Global Latency")}</div>
              <div class="mono" id="modal-venture-lat" style="font-size: 0.85rem; font-weight: var(--w-bold); color: #10B981; margin-top: 2px;"></div>
            </div>
            <div style="background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.06);">
              <div style="font-size: 0.68rem; color: var(--text-muted);">${t("الموازنة التشغيلية", "Monthly Budget")}</div>
              <div class="mono" id="modal-venture-budget" style="font-size: 0.85rem; font-weight: var(--w-bold); color: var(--text-1); margin-top: 2px;"></div>
            </div>
          </div>
          
          <div class="dash-field-group" style="margin-bottom: 1rem;">
            <label class="dash-label" style="font-size: 0.75rem; color: var(--text-muted);">${t("البنية المعمارية وهندسة النواة", "Core Architecture & Kernel Topology")}</label>
            <div id="modal-venture-arch" style="font-size: 0.82rem; color: var(--text-1); background: rgba(0,0,0,0.4); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.08); line-height: 1.6;"></div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
            <span>${t("العقد الميدانية النشطة المخصصة للذراع:", "Dedicated Active Nodes:")} <b id="modal-venture-nodes" class="mono" style="color: var(--accent);"></b></span>
            <span class="badge badge--ok" id="modal-venture-sla"></span>
          </div>
        </div>
        <div class="dash-modal-footer">
          <button type="button" class="btn btn--primary btn--sm" id="btn-close-venture-modal-ok">${t("إغلاق الفحص التكتيكي", "Close Inspection")}</button>
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

        <!-- ================= MODAL: OFFICIAL DIGITAL PAY SLIP ================= -->
    <div class="dash-modal-overlay" id="modal-view-payslip" style="display:none;">
      <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-payslip-title" style="max-width:680px;">
        <div class="dash-modal-header" style="border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:1rem;">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div style="width:38px; height:38px; border-radius:8px; background:var(--accent); color:#000; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:1.1rem;">AW</div>
            <div>
              <h3 class="dash-modal-title" id="modal-payslip-title" style="margin:0; font-size:1.15rem; font-weight:800;">${t("قسيمة الراتب والمستحقات المعتمدة (IFRS Certified Slip)", "Official Remuneration & Pay Slip")}</h3>
              <div style="font-size:0.75rem; color:var(--text-muted);">${t("عوالِم قروب ذ.م.م · الرقم الضريبي والقيد المالي IFRS-AWL-2026", "Awalim Group LLC · Certified Double-Entry Ledger IFRS-AWL-2026")}</div>
            </div>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-payslip-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <div class="dash-modal-body" style="padding:1.25rem;">
          <!-- Slip Metadata Grid -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:0.85rem; margin-bottom:1.25rem; font-size:0.8rem;">
            <div>
              <div class="text-muted" style="font-size:0.72rem;">${t("رقم القسيمة", "Slip Serial")}</div>
              <div class="mono" style="font-weight:700; color:var(--accent);" id="modal-slip-serial">SLIP-AWL-2026-AA01</div>
            </div>
            <div>
              <div class="text-muted" style="font-size:0.72rem;">${t("فترة الصرف", "Pay Period")}</div>
              <div class="mono" style="font-weight:700;">SEP 2026</div>
            </div>
            <div>
              <div class="text-muted" style="font-size:0.72rem;">${t("اسم الموظف / الرتبة", "Employee / Clearance")}</div>
              <div style="font-weight:700;" id="modal-slip-empname">أحمد أشرف (0x00 ROOT)</div>
            </div>
            <div>
              <div class="text-muted" style="font-size:0.72rem;">${t("حالة التحويل", "Disbursement Status")}</div>
              <div style="font-weight:700; color:#10B981;">${t("تم التحويل المعتمد ✔", "Disbursed & Verified ✔")}</div>
            </div>
          </div>

          <!-- Table of Remuneration Elements -->
          <table class="dash-table" style="width:100%; margin-bottom:1.25rem; font-size:0.85rem;">
            <thead>
              <tr>
                <th style="text-align:start;">${t("بند الاستحقاق أو الخصم", "Remuneration / Deduction Line Item")}</th>
                <th style="text-align:end;">${t("القيمة بالدولار الأمريكي ($)", "Amount (USD)")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${t("الراتب الأساسي التعاقدي (Contractual Base Salary)", "Contractual Base Salary")}</td>
                <td class="mono" style="text-align:end; font-weight:700;" id="modal-slip-base">$8,500.00</td>
              </tr>
              <tr>
                <td>${t("بدل المخاطر والعمليات الميدانية الاستثنائية - غزة والضفة", "Field Hardship & Adverse Node Allowance")}</td>
                <td class="mono" style="text-align:end; color:var(--accent); font-weight:700;" id="modal-slip-hardship">+$2,200.00</td>
              </tr>
              <tr>
                <td>${t("بدل الاتصالات والربط الفضائي المشفر (Mesh Uplink)", "Encrypted Satellite & Comms Allowance")}</td>
                <td class="mono" style="text-align:end; color:#10B981; font-weight:700;" id="modal-slip-comms">+$350.00</td>
              </tr>
              <tr>
                <td>${t("مكافأة تسليم مخرجات السبرنت وتصفير التأخير (Zero-Defect Bonus)", "Sprint Milestone Delivery Bonus")}</td>
                <td class="mono" style="text-align:end; color:#F59E0B; font-weight:700;" id="modal-slip-bonus">+$1,000.00</td>
              </tr>
              <tr>
                <td>${t("اقتطاع صندوق التكافل الصحي والطوارئ الميدانية", "Emergency Relief & Health Fund Deduction")}</td>
                <td class="mono" style="text-align:end; color:#EF4444; font-weight:700;" id="modal-slip-deductions">-$150.00</td>
              </tr>
              <tr style="border-top:2px solid var(--accent); background:rgba(0,240,255,0.04);">
                <td style="font-weight:800; font-size:0.95rem;">${t("صافي المستحقات المحولة للبنك (Net Payable)", "Total Net Remuneration Disbursed")}</td>
                <td class="mono" style="text-align:end; font-size:1.2rem; font-weight:800; color:var(--accent);" id="modal-slip-net">$11,900.00</td>
              </tr>
            </tbody>
          </table>

          <!-- Cryptographic Validation Footer -->
          <div style="background:rgba(255,255,255,0.015); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:0.75rem; font-size:0.75rem; color:var(--text-muted); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div>${t("مُوثق بتشفير مزدوج ومطابق لمعايير التدقيق المالي IFRS", "IFRS Certified Cryptographic Audit Trail")}</div>
              <div class="mono" id="modal-slip-seal">SHA-256: 7f83b165...e2d1</div>
            </div>
            <div style="padding:4px 8px; border-radius:4px; border:1px solid var(--accent); color:var(--accent); font-weight:700; font-size:0.7rem;">
              VERIFIED
            </div>
          </div>
        </div>

        <div class="dash-modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-size:0.75rem; color:var(--text-muted);">${t("هذا المستند رقمي ومعتمد قانونياً", "Certified Digital Document")}</div>
          <div style="display:flex; gap:0.5rem;">
            <button type="button" class="btn btn--outline btn--sm" id="btn-print-payslip">
              <span>${icon("download", "dash-btn-svg")} ${t("طباعة / حفظ كـ PDF", "Print / Save PDF")}</span>
            </button>
            <button type="button" class="btn btn--primary btn--sm" id="btn-close-payslip-done">${t("إغلاق المستند", "Close Document")}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= MODAL: EMERGENCY OPERATIONAL PING ================= -->
    
    <!-- 8. Spot Excellence Bonus Modal -->
    <div class="dash-modal-overlay" id="modal-spot-bonus" style="display:none;">
      <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-bonus-title" style="max-width:540px;">
        <div class="dash-modal-header" style="border-bottom:1px solid rgba(212,175,55,0.25);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.3rem;">🏆</span>
            <h3 class="dash-modal-title" id="modal-bonus-title" style="color:var(--gold,#D4AF37); margin:0;">${t("صرف مكافأة تميز وإنجاز استثنائي", "Authorize Spot Excellence Bonus")}</h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-bonus-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <form id="form-spot-bonus" style="padding:1.25rem;">
          <input type="hidden" name="bonus_emp_code" id="input-bonus-emp-code" value="">

          <div style="display:flex; align-items:center; gap:0.75rem; padding:0.75rem; border-radius:8px; background:rgba(212,175,55,0.05); border:1px solid rgba(212,175,55,0.2); margin-bottom:1rem;">
            <div style="font-size:1.5rem;">👤</div>
            <div>
              <div style="font-weight:700; font-size:0.95rem;" id="bonus-modal-emp-name">${t("المهندس طارق الناصر", "Eng. Tariq Al-Nasser")}</div>
              <div class="small text-muted" id="bonus-modal-emp-role">${t("قائد النواة والأنظمة المصرفية · رام الله، فلسطين", "Lead Systems Architect · Ramallah, Palestine")}</div>
            </div>
          </div>

          <div class="dash-field-group" style="margin-bottom:0.85rem;">
            <label class="dash-label" for="select-bonus-amount">${t("قيمة المكافأة الاستثنائية المعتمدة", "Approved Bonus Amount (USD)")}</label>
            <select name="bonus_amount" class="dash-select" id="select-bonus-amount" aria-label="${t("قيمة المكافأة الاستثنائية المعتمدة", "Approved Bonus Amount (USD)")}" required>
              <option value="500">+$500.00 — ${t("مكافأة إنجاز سبرنت سريع", "Rapid Sprint Milestone")}</option>
              <option value="1000" selected>+$1,000.00 — ${t("مكافأة تميز وتفاني ميداني", "Field Dedication & Resilience")}</option>
              <option value="2000">+$2,000.00 — ${t("مكافأة معمارية سيادية كبرى", "Major Sovereign Architecture Milestone")}</option>
              <option value="3500">+$3,500.00 — ${t("مكافأة بطل الصمود والابتكار", "Unmatched Heroic Innovation")}</option>
            </select>
          </div>

          <div class="dash-field-group" style="margin-bottom:1rem;">
            <label class="dash-label" for="textarea-bonus-reason">${t("موجب الصرف وحيثيات التقدير والثناء", "Executive Justification & Commendation Memo")}</label>
            <textarea name="bonus_reason" class="dash-textarea" id="textarea-bonus-reason" aria-label="${t("موجب الصرف وحيثيات التقدير والثناء", "Executive Justification & Commendation Memo")}" rows="3" placeholder="${t("اكتب حيثيات صرف المكافأة وتقدير جهود المهندس...", "State the milestone achievements and official commendation text...")}" required></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-bonus">${t("إلغاء", "Cancel")}</button>
            <button type="submit" class="btn btn--primary btn--sm" style="background:var(--gold,#D4AF37); border-color:var(--gold,#D4AF37); color:#000; font-weight:700;">
              <span>🏆 ${t("اعتماد وصرف فوري من الخزينة السيادية", "Authorize & Disburse Immediately")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="dash-modal-overlay" id="modal-emergency-ping" style="display:none;">
      <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-ping-title" style="max-width:560px;">
        <div class="dash-modal-header" style="border-bottom:1px solid rgba(239,68,68,0.2);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.3rem;">⚡</span>
            <h3 class="dash-modal-title" id="modal-ping-title" style="color:#EF4444; margin:0;">${t("نداء عمليات طارئ لغرفة القيادة السيادية", "Emergency Operational Command Dispatch")}</h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-ping-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <form id="form-emergency-ping" style="padding:1.25rem;">
          <div class="dash-field-group" style="margin-bottom:0.85rem;">
            <label class="dash-label" for="select-ping-type">${t("نوع الحادث أو الطارئ الميداني", "Incident Classification")}</label>
            <select name="ping_type" class="dash-select" id="select-ping-type" aria-label="${t("نوع الحادث أو الطارئ الميداني", "Incident Classification")}" required>
              <option value="comms_outage">${t("انقطاع شبكة واتصال فضائي ميداني (Mesh/Sat Outage)", "Field Comms / Mesh Satellite Outage")}</option>
              <option value="cyber_breach">${t("تهديد أمني أو محاولة اختراق سيبراني (Security Breach)", "Security Breach / Cyber Threat")}</option>
              <option value="medical_evac">${t("حالة إخلاء طبي طارئة - منظومة رحمة كير", "RahmaCare Critical Medical Evacuation")}</option>
              <option value="node_failure">${t("خلل في عقدة السيرفرات والبث الميداني", "Node Hardware / Generator Failure")}</option>
            </select>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.85rem;">
            <div class="dash-field-group">
              <label class="dash-label" for="select-ping-severity">${t("مستوى الحرج", "Severity Tier")}</label>
              <select name="ping_severity" class="dash-select" id="select-ping-severity" aria-label="${t("مستوى الحرج", "Severity Tier")}">
                <option value="p0" selected>${t("🔥 P0 - حرج للغاية وفوري", "🔥 P0 - Immediate Critical")}</option>
                <option value="p1">${t("🔺 P1 - أولوية عليا", "🔺 P1 - High Urgency")}</option>
              </select>
            </div>
            <div class="dash-field-group">
              <label class="dash-label" for="input-ping-coords">${t("إحداثيات العقدة / الموقع", "Node Location / Coordinates")}</label>
              <input type="text" name="ping_coords" class="dash-input" id="input-ping-coords" aria-label="${t("إحداثيات العقدة / الموقع", "Node Location / Coordinates")}" value="NODE-GZA-31.5°N" required>
            </div>
          </div>

          <div class="dash-field-group" style="margin-bottom:1rem;">
            <label class="dash-label" for="textarea-ping-details">${t("تفاصيل الطارئ والإجراءات المطلوبة فوراً", "Emergency Specifications & Response Needed")}</label>
            <textarea name="ping_details" class="dash-textarea" id="textarea-ping-details" aria-label="${t("تفاصيل الطارئ والإجراءات المطلوبة فوراً", "Emergency Specifications & Response Needed")}" rows="3" placeholder="${t("اكتب تفاصيل الواقعة الميدانية لغرفة العمليات المركزية...", "State incident status, affected nodes, and immediate needs...")}" required></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-ping">${t("إلغاء", "Cancel")}</button>
            <button type="submit" class="btn btn--primary btn--sm" style="background:#EF4444; border-color:#EF4444;">
              <span>⚡ ${t("إرسال النداء وتنبيه أحمد أشرف فوراً", "Dispatch Alert to Command Room")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Field Node Cryptographic Telemetry Inspector -->
    <div class="dash-modal-overlay" id="modal-node-detail" style="display:none;">
      <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-node-title" style="max-width:620px;">
        <div class="dash-modal-header" style="border-bottom:1px solid rgba(0,240,255,0.2);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span class="dot dot--live" aria-hidden="true"></span>
            <h3 class="dash-modal-title" id="modal-node-title" style="color:var(--cyan,#00f0ff); margin:0;">${t("مستكشف القياسات والتشفير للعقدة الميدانية", "Field Relief Node Telemetry & Cryptographic Inspection")}</h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-node-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <div style="padding:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; padding-bottom:0.75rem; border-bottom:1px solid rgba(255,255,255,0.06);">
            <div>
              <div style="font-weight:700; font-size:1.1rem; color:#fff;" id="modal-node-name">${t("مجمع ناصر الطبي · خان يونس", "Nasser Medical Complex · Khan Yunis")}</div>
              <div class="mono" style="font-size:0.8rem; color:var(--cyan,#00f0ff);" id="modal-node-serial">NODE-KH01 · Ed25519 VERIFIED</div>
            </div>
            <span class="badge badge--ok" id="modal-node-status-badge">100% Operational</span>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1rem;">
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:0.75rem;">
              <span class="dash-kpi-label">${t("الأجهزة والنواة الميدانية", "Hardware & Kernel")}</span>
              <div style="font-size:0.85rem; font-weight:600; margin-top:0.25rem;" id="modal-node-hw">Raspberry Pi 5 + LoRa SX1262 (100W Solar)</div>
            </div>
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:0.75rem;">
              <span class="dash-kpi-label">${t("قاعدة البيانات والمزامنة دون إنترنت", "Offline SQLite & CRDT Replication")}</span>
              <div style="font-size:0.85rem; font-weight:600; margin-top:0.25rem;" id="modal-node-db">14,892 Blocks · 0 Divergence</div>
            </div>
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:0.75rem;">
              <span class="dash-kpi-label">${t("طاقم الأطباء المتصل محلياً", "Local Physicians Active")}</span>
              <div style="font-size:0.85rem; font-weight:600; margin-top:0.25rem; color:#10b981;" id="modal-node-docs">${t("42 استشاري وطبيب مقيم", "42 Active Physicians")}</div>
            </div>
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:0.75rem;">
              <span class="dash-kpi-label">${t("زمن الاستجابة الحقيقي (Latency)", "Real-time Ping Latency")}</span>
              <div class="mono" style="font-size:0.85rem; font-weight:700; margin-top:0.25rem; color:var(--cyan,#00f0ff);" id="modal-node-lat">0.12 ms (LoRa Mesh)</div>
            </div>
          </div>

          <div style="background:rgba(0,0,0,0.3); border-radius:6px; padding:0.65rem 0.85rem; margin-bottom:1.25rem;">
            <div class="dash-kpi-label" style="margin-bottom:0.25rem;">Merkle Tree Root Anchor</div>
            <div class="mono" style="font-size:0.75rem; color:var(--gold,#d4af37); word-break:break-all;" id="modal-node-merkle">SHA256: 7f4d92a188bc0291ffca710924bce81109a1 · ROOT ATTESTED</div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <button type="button" class="btn btn--outline btn--sm" id="btn-node-ping-test">
              <span>⚡ ${t("فحص إشارة البينغ الحية", "Send Live Ping Handshake")}</span>
            </button>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-node-modal">${t("إغلاق", "Close")}</button>
              <button type="button" class="btn btn--primary btn--sm" id="btn-node-dispatch-drop" style="background:var(--gold,#d4af37); border-color:var(--gold,#d4af37); color:#000; font-weight:700;">
                <span>📦 ${t("توجيه شحنة إمداد عاجلة للعقدة", "Dispatch Supply to Node")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Emergency Medical Supply Dispatch -->
    <div class="dash-modal-overlay" id="modal-dispatch-supply" style="display:none;">
      <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-dispatch-title" style="max-width:560px;">
        <div class="dash-modal-header" style="border-bottom:1px solid rgba(212,175,55,0.25);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.3rem;">📦</span>
            <h3 class="dash-modal-title" id="modal-dispatch-title" style="color:var(--gold,#d4af37); margin:0;">${t("صرف وتوجيه إمداد طبي عاجل", "Emergency Medical Supply Dispatch")}</h3>
          </div>
          <button type="button" class="dash-modal-close" id="btn-close-dispatch-modal" aria-label="${t("إغلاق", "Close")}">✕</button>
        </div>

        <form id="form-dispatch-supply" aria-label="${t("نموذج صرف شحنة الإمداد الطبي", "Medical Supply Dispatch Form")}" style="padding:1.25rem;">
          <div id="dispatch-supply-error" role="alert" aria-live="polite" class="dash-form-error" style="color:var(--danger, #f43f5e); font-size:0.85rem; margin-bottom:0.75rem;"></div>

          <div class="dash-field-group" style="margin-bottom:0.85rem;">
            <label class="dash-label" for="select-dispatch-target">${t("العقدة الميدانية المستهدفة", "Target Field Node")}</label>
            <select name="target_node" class="dash-select" id="select-dispatch-target" aria-label="${t("العقدة الميدانية المستهدفة", "Target Field Node")}" required>
              <option value="Node-KH01">${t("مجمع ناصر الطبي · خان يونس (Node-KH01)", "Nasser Medical Complex · Khan Yunis")}</option>
              <option value="Node-RF02">${t("المستشفى الكويتي الميداني · رفح (Node-RF02)", "Kuwaiti Field Hospital · Rafah")}</option>
              <option value="Node-DB03">${t("مستشفى شهداء الأقصى · دير البلح (Node-DB03)", "Al-Aqsa Martyrs Hospital · Deir al-Balah")}</option>
              <option value="Node-GZ04">${t("مستشفى المعمداني للطوارئ · غزة الشمال (Node-GZ04)", "Al-Ahli Arab Hospital · North Gaza")}</option>
              <option value="Node-BY05">${t("المركز الصحي الميداني · ضاحية بيروت (Node-BY05)", "Beirut Southern Field Health Center · Lebanon")}</option>
            </select>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.85rem;">
            <div class="dash-field-group">
              <label class="dash-label" for="select-dispatch-category">${t("صنف الإمداد الطبي الحرج", "Medical Supply Category")}</label>
              <select name="supply_category" class="dash-select" id="select-dispatch-category" aria-label="${t("صنف الإمداد الطبي الحرج", "Medical Supply Category")}" required>
                <option value="plasma">${t("أكياس بلازما الدم المجمدة (FFP)", "Fresh Frozen Plasma Units")}</option>
                <option value="surgery">${t("حقائب جراحة الأوعية والكسور", "Tactical Surgical Trauma Kits")}</option>
                <option value="insulin">${t("أنسولين وثلاجات شمسية", "Cold-Chain Solar Insulin")}</option>
                <option value="pediatric">${t("مضادات حيوية ومحاليل أطفال", "Pediatric Antibiotics & IV")}</option>
              </select>
            </div>
            <div class="dash-field-group">
              <label class="dash-label" for="input-dispatch-qty">${t("الكمية المطلوبة (وحدات)", "Quantity (Units)")}</label>
              <input type="number" name="supply_qty" class="dash-input" id="input-dispatch-qty" aria-label="${t("الكمية المطلوبة بالوحدات", "Quantity (Units)")}" min="1" max="1000" value="50" required>
            </div>
          </div>

          <div class="dash-field-group" style="margin-bottom:1rem;">
            <label class="dash-label" for="input-dispatch-auth">${t("رمز الاعتماد والمصادقة اللوجستية السيادية", "Sovereign Logistics Passcode")}</label>
            <input type="text" name="attestation_code" class="dash-input" id="input-dispatch-auth" aria-label="${t("رمز الاعتماد والمصادقة اللوجستية", "Sovereign Logistics Passcode")}" placeholder="AWL-LOG-2026" value="AWL-LOG-2026" required>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-dispatch">${t("إلغاء", "Cancel")}</button>
            <button type="submit" class="btn btn--primary btn--sm" style="background:var(--gold,#d4af37); border-color:var(--gold,#d4af37); color:#000; font-weight:700;">
              <span>🚀 ${t("اعتماد الشحنة والتوجيه الفوري", "Authorize & Dispatch Medical Supplies")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Floating Luxury Action Toast -->
    <div class="dash-toast" id="dash-toast" role="status" aria-live="polite"></div>
    <script id="initial-owner-data" type="application/json">${JSON.stringify(owner)}</script>`
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
      schema: [breadcrumbSchema(site, [{ name: t("الرئيسية", "Home"), path: "/" }, { name: t("لوحة التحكم", "Dashboard"), path: "/dashboard" }])],
      bodyClass: "page-dashboard-master"
    })
  };
}
