import sys

p = '/Users/ahmedashraf/Awalim-Group-Site/src/pages/dashboard.mjs'
with open(p, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add owner variables after const site = ctx.site;
target_site = '  const site = ctx.site;\n  const pfx = isEn ? "/en" : "";'
replace_site = '''  const site = ctx.site;
  const pfx = isEn ? "/en" : "";
  const owner = ctx.owner || {};
  const treasury = owner.treasury || {};
  const ventures = owner.ventures || [];
  const contracts = owner.contracts || [];
  const directives = owner.directives || [];'''
if target_site in code:
    code = code.replace(target_site, replace_site, 1)
    print('1. Replaced site/owner vars')

# 2. Gatekeeper updates
code = code.replace(
    '${t("بوابة يوزر الإدارة السيادية", "SOVEREIGN ADMIN USER PORTAL")}',
    '${t("بوابة المالك والمؤسس السيادي", "SOVEREIGN OWNER & FOUNDER GATEWAY")}'
)
code = code.replace(
    '${t("لوحة تحكم المنظومة — جلسة الإدارة", "Sovereign Executive Suite — Admin Gateway")}',
    '${t("قمرة قيادة المالك — جلسة السيادة العليا", "Sovereign Executive Suite — Owner Gateway")}'
)
code = code.replace(
    '${t("هذه اللوحة خاصة بإدارة الموقع المركزية بواسطة يوزر الإدارة (أحمد أشرف) وتتطلب توثيقاً سيادياً معتمداً للتحكم في كافة قطاعات المنظومة.", "This command suite is reserved for the Root Sovereign Administrator (Ahmed Ashraf). Authenticate to manage site operations, Island Haven tasks, and RahmaCare dispatch.")}',
    '${t("هذه القمرة مخصصة حصرياً للمالك والمؤسس (المهندس أحمد أشرف) لممارسة السلطة السيادية العليا وإدارة الأذرع الستة والخزينة وعمليات الطوارئ.", "Reserved exclusively for the Sovereign Owner & Founder (Eng. Ahmed Ashraf) for apex governance, treasury oversight, and multi-venture command.")}'
)
code = code.replace(
    '${t("دخول فوري بصفة المؤسس أحمد أشرف", "Instant Root Access (Ahmed Ashraf)")}',
    '${t("دخول فوري بصفة المالك السيادي (أحمد أشرف)", "Instant Sovereign Owner Access (Ahmed Ashraf)")}'
)

# 3. Top Identity Card update
target_card = '''        <!-- Sovereign Root Admin Identity Card (يوزر الإدارة) -->
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
            <a href="/" class="btn btn--ghost btn--sm" target="_blank">
              <span>${t("معاينة الموقع كزائر عادي ↗", "Preview Live Site ↗")}</span>
            </a>
            <button type="button" class="btn btn--danger btn--sm" id="btn-admin-logout">
              <span>${t("قفل جلسة الإدارة", "Lock Admin Session")} ${icon("lock", "dash-btn-svg")}</span>
            </button>
          </div>
        </div>'''

replace_card = '''        <!-- Sovereign Owner Identity Card (المالك والمؤسس أحمد أشرف) -->
        <div class="dash-admin-identity-card" id="dash-admin-user-card">
          <div class="dash-admin-identity-left">
            <div class="dash-admin-avatar-wrap">
              <img src="/assets/img/ahmed-personal.webp" alt="Ahmed Ashraf" class="dash-admin-avatar" width="56" height="56">
              <span class="dash-admin-badge-icon" aria-hidden="true">${icon("crown", "dash-admin-crown-svg")}</span>
            </div>
            <div class="dash-admin-info">
              <div class="dash-admin-name-row">
                <h2 class="dash-admin-name">${t("المهندس أحمد أشرف", "Eng. Ahmed Ashraf")}</h2>
                <span class="chip chip--gold"><span class="dot dot--live" aria-hidden="true"></span>${t("صاحب المنظومة والمالك السيادي · صلاحية مطلقة", "SOVEREIGN OWNER & FOUNDER · ROOT 0x00")}</span>
              </div>
              <div class="dash-admin-meta">
                <span>${t("المؤسس والقائد المعماري الأعلى للمنظومة", "Founder, Owner & Chief Sovereign Architect")}</span>
                <span class="dash-admin-sep">·</span>
                <span>${t("معرّف الجلسة:", "Session ID:")} <b class="mono"><bdi dir="ltr">AWALIM-OWNER-AA01</bdi></b></span>
                <span class="dash-admin-sep">·</span>
                <span class="dash-admin-status-ok">${icon("shield", "dash-meta-svg")} ${t("مفتاح Ed25519 عتادي نشط", "Hardware Token Active")}</span>
                <span class="dash-admin-sep">·</span>
                <span>${t("الخزينة السيادية:", "Enterprise Treasury:")} <b class="mono" style="color:var(--gold,#D4AF37)">$24.8M</b></span>
              </div>
            </div>
          </div>
          <div class="dash-admin-identity-actions">
            <button type="button" class="btn btn--danger btn--sm" id="btn-owner-lockdown-top">
              <span class="dot dot--live"></span>
              <span>${t("⚡ قفل المنظومة", "⚡ Lockdown")}</span>
            </button>
            <button type="button" class="btn btn--primary btn--sm" id="btn-owner-broadcast-top">
              <span>${icon("bolt", "dash-btn-svg")} ${t("بث أمر طارئ", "Broadcast")}</span>
            </button>
            <a href="/" class="btn btn--ghost btn--sm" target="_blank">
              <span>${t("معاينة كزائر ↗", "Preview Live Site ↗")}</span>
            </a>
            <button type="button" class="btn btn--ghost btn--sm" id="btn-admin-logout">
              <span>${t("قفل الجلسة", "Lock Session")} ${icon("lock", "dash-btn-svg")}</span>
            </button>
          </div>
        </div>'''

if target_card in code:
    code = code.replace(target_card, replace_card, 1)
    print('2. Replaced Identity Card')

# 4. Navigation Tab Rail: insert Owner tab as first tab (active) and remove active from overview
target_tab_rail = '''        <!-- Navigation Tabs Rail (11 Dedicated Panels for Everything) -->
        <nav class="dash-nav-rail" aria-label="${t("أقسام لوحة التحكم", "Dashboard Sections Navigation")}">
          <button type="button" class="dash-tab-btn active" data-dash-tab="overview">'''

replace_tab_rail = '''        <!-- Navigation Tabs Rail (Sovereign Owner Cockpit & Modules) -->
        <nav class="dash-nav-rail" aria-label="${t("أقسام لوحة التحكم", "Dashboard Sections Navigation")}">
          <button type="button" class="dash-tab-btn active" data-dash-tab="owner">
            <span class="dash-tab-icon">${icon("crown", "dash-tab-svg")}</span>
            <span>${t("قمرة قيادة المالك والقرارات السيادية", "Owner Apex Cockpit & Treasury")}</span>
            <span class="dash-tab-badge dash-tab-badge--alert">👑 ROOT</span>
          </button>
          <button type="button" class="dash-tab-btn" data-dash-tab="overview">'''

if target_tab_rail in code:
    code = code.replace(target_tab_rail, replace_tab_rail, 1)
    print('3. Added Owner Tab to nav rail')

# 5. Insert Panel 0 (Owner Cockpit) before Overview Panel
target_overview_panel = '''        <!-- ================= PANEL 1: OVERVIEW ================= -->
        <section class="dash-panel active" data-dash-panel="overview" aria-label="${t("لوحة النظرة العامة", "Overview Panel")}">'''

owner_panel_html = '''        <!-- ================= PANEL 0: OWNER APEX COCKPIT ================= -->
        <section class="dash-panel active" data-dash-panel="owner" aria-label="${t("قمرة قيادة المالك والقرارات السيادية", "Owner Apex Cockpit")}">
          
          <!-- Master Owner Banner -->
          <div class="dash-owner-banner">
            <div class="dash-owner-banner__left">
              <div class="dash-owner-crown-icon" aria-hidden="true">
                ${icon("crown")}
              </div>
              <div>
                <h2 class="dash-owner-banner-title">${t("قمرة قيادة المالك والقرارات الاستراتيجية العليا", "Owner Apex Command & Sovereign Directives")}</h2>
                <p class="dash-owner-banner-sub">${t("المهندس أحمد أشرف · الصلاحية السيادية المطلقة (Clearance: 0x00 ROOT) · جلسة مشفرة وموثقة عتادياً", "Eng. Ahmed Ashraf · Sovereign Owner & Founder (Clearance: 0x00 ROOT) · Hardware Authenticated")}</p>
              </div>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--danger btn--sm" id="btn-lockdown-toggle">
                <span class="dot dot--live"></span>
                <span id="btn-lockdown-text">${t("تفعيل التجميد السيادي", "Engage Sovereign Lockdown")}</span>
              </button>
              <button type="button" class="btn btn--primary btn--sm" id="btn-open-directive-modal">
                <span>${icon("plus", "dash-btn-svg")} ${t("إصدار أمر رئاسي جديد", "New Signed Directive")}</span>
              </button>
            </div>
          </div>

          <!-- Enterprise Treasury & Sovereign Valuation Grid -->
          <div class="dash-treasury-grid">
            <div class="dash-treasury-card dash-treasury-card--gold">
              <span class="dash-treasury-label">${t("القيمة التقديرية للمنظومة (Valuation)", "Enterprise Valuation")}</span>
              <div class="dash-treasury-val dash-treasury-val--gold"><bdi dir="ltr">$24.8M</bdi></div>
              <div class="dash-treasury-meta">
                <span class="badge badge--ok">+34%</span>
                <span>${t("مدعومة بأصول تقنية وعقود فعلية", "Asset-backed sovereign IP")}</span>
              </div>
            </div>
            <div class="dash-treasury-card">
              <span class="dash-treasury-label">${t("الاحتياطي النقدي المباشر (Reserves)", "Liquid Reserves (USDC Vault)")}</span>
              <div class="dash-treasury-val"><bdi dir="ltr">$2,840,000</bdi></div>
              <div class="dash-treasury-meta">
                <span class="badge badge--ok">${t("خزينة لامركزية", "Cold Vault")}</span>
                <span>${t("صمود تشغيلي مستقل 100%", "Zero banking dependency")}</span>
              </div>
            </div>
            <div class="dash-treasury-card">
              <span class="dash-treasury-label">${t("معدل الإيرادات السنوية (ARR)", "Annual Contract Run-Rate")}</span>
              <div class="dash-treasury-val"><bdi dir="ltr">$4,650,000</bdi></div>
              <div class="dash-treasury-meta">
                <span class="badge badge--ok">18 عقود</span>
                <span>${t("عقود تشغيلية وصيانة مؤسسية", "Active enterprise retainers")}</span>
              </div>
            </div>
            <div class="dash-treasury-card">
              <span class="dash-treasury-label">${t("الصمود المالي التام (Runway)", "Sovereign Financial Runway")}</span>
              <div class="dash-treasury-val"><bdi dir="ltr">34 ${t("شهراً", "Months")}</bdi></div>
              <div class="dash-treasury-meta">
                <span class="badge badge--ok">IFRS 0.00%</span>
                <span>${t("انعدام تام لفروق التسوية المالية", "Zero reconciliation variance")}</span>
              </div>
            </div>
          </div>

          <!-- Sovereign Decision & Emergency Grid -->
          <div class="dash-split-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: 1.5rem; margin-block-end: 1.5rem;">
            
            <!-- Left: Sovereign Lockdown Protocol -->
            <div class="dash-card dash-lockdown-card" id="card-lockdown-status">
              <div class="dash-panel-head" style="margin-bottom: 0.75rem;">
                <div>
                  <span class="chip chip--danger" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("بروتوكول السيطرة والتعقيم الأمني", "SOVEREIGN DEFENSE PROTOCOL")}</span>
                  <h3 class="dash-card-title">${t("بروتوكول التجميد السيادي (Sovereign Lockdown)", "Sovereign Lockdown Protocol")}</h3>
                </div>
                <span class="badge badge--ok" id="badge-lockdown-state">${t("الأنظمة نشطة · وضع الأمان العادي", "SYSTEMS NORMAL · UNLOCKED")}</span>
              </div>
              <p class="dash-panel-desc" style="margin-bottom: 1rem;">
                ${t("عند تفعيل هذا المفتاح، يتم فورياً تجميد واجهات التعديل العامة وتحويل كامل خوادم وشبكات عوالِم قروب إلى وضع القراءة المشفرة فقط (Signed Read-Only Merkle Mode) لحماية الأصول من أي محاولة استهداف.", "When engaged, all public mutation APIs are frozen and the platform drops into an immutable, cryptographically signed read-only state to prevent tampering.")}
              </p>
              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <button type="button" class="btn btn--danger btn--sm" id="btn-trigger-lockdown">
                  <span>${icon("lock", "dash-btn-svg")} ${t("تبديل حالة التجميد السيادي للطوارئ", "Toggle Sovereign Lockdown")}</span>
                </button>
                <span class="mono" style="font-size: 0.75rem; color: var(--text-muted);">${t("يتطلب توقيع مفتاح المالك Ed25519", "Requires Owner Ed25519 Token")}</span>
              </div>
            </div>

            <!-- Right: Direct Sovereign Mesh Broadcast -->
            <div class="dash-card">
              <div class="dash-panel-head" style="margin-bottom: 0.75rem;">
                <div>
                  <span class="chip chip--accent" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("محطة البث الرئاسي المشفر", "SIGNED EXECUTIVE BROADCAST")}</span>
                  <h3 class="dash-card-title">${t("بث أمر قيادي فوري للعقد الميدانية والمهندسين", "Emergency Mesh & Pod Broadcast")}</h3>
                </div>
              </div>
              <form id="form-owner-broadcast" style="display: grid; gap: 0.75rem;">
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 0.5rem;">
                  <input type="text" class="dash-input" id="input-broadcast-text" placeholder="${t("اكتب نص الأمر القيادي الموجه للشبكة...", "Enter signed directive to broadcast...")}" required>
                  <select class="dash-select" id="select-broadcast-target">
                    <option value="all">${t("كافة العقد والأنظمة (All Nodes)", "All 14 Nodes & Pods")}</option>
                    <option value="rahmacare">${t("عقد رحمة كير الميدانية (Gaza/Beirut)", "RahmaCare Field Nodes")}</option>
                    <option value="islandhaven">${t("فرق آيلاند هيفن المصرفية", "Island Haven Core Teams")}</option>
                  </select>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="mono" style="font-size: 0.72rem; color: var(--text-muted);">${t("يتم التوزيع عبر بروتوكول P2P Mesh المشفر", "Propagated via encrypted P2P gossip mesh")}</span>
                  <button type="submit" class="btn btn--primary btn--sm">
                    <span>${icon("bolt", "dash-btn-svg")} ${t("بث وتعميم الأمر", "Dispatch Signed Directive")}</span>
                  </button>
                </div>
              </form>
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
                      <h4 class="dash-venture-name">${t(v.name, v.name_en || v.name)}</h4>
                      <span class="dash-venture-sector">${t(v.sector, v.sector_en || v.sector)}</span>
                    </div>
                    <span class="badge ${v.health >= 99 ? "badge--ok" : "badge--alert"}">${v.health}% ${t("سلامة", "Health")}</span>
                  </div>
                  <div class="dash-venture-stats">
                    <div class="dash-venture-stat-item">
                      <span class="dash-venture-stat-label">${t("القائد التنفيذي", "Lead")}</span>
                      <span class="dash-venture-stat-val">${t(v.lead, v.lead)}</span>
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
                      <td><b>${c.client}</b></td>
                      <td><span class="chip chip--sm">${c.venture}</span></td>
                      <td class="mono" style="color:var(--gold,#D4AF37); font-weight:var(--w-bold);">${c.value}</td>
                      <td><span class="badge badge--ok">${c.tier}</span></td>
                      <td><span class="dot dot--live"></span> ${c.status}</td>
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
                      <td><b>${d.title}</b></td>
                      <td><span class="chip chip--danger">${d.priority}</span></td>
                      <td class="mono">${d.date}</td>
                      <td><span class="dot dot--live"></span> ${d.status}</td>
                      <td><span class="badge badge--ok">${icon("shield", "dash-btn-svg")} ${t("موقع ومعتمد 0x00", "SIGNED ROOT")}</span></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

        </section>

        <!-- ================= PANEL 1: OVERVIEW ================= -->
        <section class="dash-panel" data-dash-panel="overview" aria-label="${t("لوحة النظرة العامة", "Overview Panel")}">'''

if target_overview_panel in code:
    code = code.replace(target_overview_panel, owner_panel_html, 1)
    print('4. Inserted Owner Panel before Overview Panel')

# 6. Add Directive Modal before the end of dashboard template
modal_directive_html = '''    <!-- New Owner Directive Modal -->
    <div class="dash-modal" id="modal-new-directive" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="modal-directive-title">
      <div class="dash-modal-backdrop" id="backdrop-modal-directive"></div>
      <div class="dash-modal-card">
        <div class="dash-modal-head">
          <div class="dash-modal-icon">${icon("crown", "dash-modal-svg")}</div>
          <h3 class="dash-modal-title" id="modal-directive-title">${t("إصدار وتوقيع أمر رئاسي سيادي", "Issue & Sign Sovereign Executive Directive")}</h3>
        </div>
        <form class="dash-modal-form" id="form-new-directive">
          <div class="dash-field-group">
            <label class="dash-label">${t("نص التوجيه السيادي الملزم", "Directive Mandate")}</label>
            <input type="text" class="dash-input" id="input-dir-title" placeholder="${t("مثال: ربط شبكة رحمة كير بالأقمار الصناعية الاحتياطية...", "e.g. Integrate backup satellite links for RahmaCare...")}" required>
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("مستوى الأولوية", "Priority Level")}</label>
            <select class="dash-select" id="select-dir-priority">
              <option value="طوارئ قصوى">${t("طوارئ قصوى (Priority 0)", "Priority 0 - Critical Emergency")}</option>
              <option value="حرج جداً">${t("حرج جداً (Priority 1)", "Priority 1 - Urgent")}</option>
              <option value="عالي">${t("عالي (Priority 2)", "Priority 2 - High")}</option>
            </select>
          </div>
          <div class="dash-field-group">
            <label class="dash-label">${t("الذراع المستهدف بالتنفيذ", "Target Venture")}</label>
            <select class="dash-select" id="select-dir-venture">
              <option value="all">${t("كافة الأذرع السيادية الستة", "All 6 Sovereign Arms")}</option>
              <option value="rahmacare">${t("رحمة كير (RahmaCare Mesh)", "RahmaCare Mesh")}</option>
              <option value="islandhaven">${t("آيلاند هيفن (Island Haven)", "Island Haven Core")}</option>
              <option value="falcon">${t("فالكون ومحاسب ذكي (Falcon ERP)", "Falcon ERP")}</option>
              <option value="academy">${t("أكاديمية عوالِم (Awalim Academy)", "Awalim Academy")}</option>
              <option value="vibeos">${t("مختبر الذكاء وVibe OS", "AI Lab & Vibe OS")}</option>
            </select>
          </div>
          <div class="dash-modal-actions">
            <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-directive">${t("إلغاء", "Cancel")}</button>
            <button type="submit" class="btn btn--primary btn--sm" id="btn-submit-directive">
              <span>${icon("shield", "dash-btn-svg")} ${t("توقيع واعتماد الأمر تشفيرياً", "Sign & Dispatch Directive")}</span>
            </button>
          </div>
        </form>
      </div>
    </div>'''

if 'id="modal-new-task"' in code and 'id="modal-new-directive"' not in code:
    code = code.replace('<div class="dash-modal" id="modal-new-task"', modal_directive_html + '\n    <div class="dash-modal" id="modal-new-task"', 1)
    print('5. Inserted modal-new-directive')

with open(p, 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated dashboard.mjs successfully!')
