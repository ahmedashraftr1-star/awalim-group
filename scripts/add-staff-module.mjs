import fs from "fs";

const file = "/Users/ahmedashraf/Awalim-Group-Site/src/pages/dashboard.mjs";
let content = fs.readFileSync(file, "utf8");

const fieldMarker = `        <!-- ================= PANEL 13: RAHMACARE FIELD & EMERGENCY DISPATCH ================= -->`;

const staffPanelHtml = `        <!-- ================= PANEL: STAFF & ENGINEERING MANAGEMENT ================= -->
        <section class="dash-panel" data-dash-panel="staff" aria-label="\${t("شؤون الموظفين والفرق الهندسية", "Staff & Engineering Hub")}">
          
          <div class="dash-panel-head">
            <div>
              <div class="dash-badge-row">
                <span class="chip chip--accent"><span class="dot dot--live" aria-hidden="true"></span>\${t("منظومة إدارة الكادر الهندسي", "ENGINEERING TALENT & RBAC SUITE")}</span>
                <span class="badge badge--ok" id="staff-live-active-badge">\${t("11 مهندساً وخبيراً نشطاً", "11 Active Engineers")}</span>
              </div>
              <h2 class="dash-panel-title">\${t("إدارة الكفاءات والموظفين والفرق الهندسية (Staff & Engineering Hub)", "Staff & Engineering Management Hub")}</h2>
              <p class="dash-panel-desc">\${t("نظام إداري مركزي شامل لمتابعة فرق العمل عبر 10 دول، تفويض المهام المباشرة، إدارة صلاحيات الوصول (RBAC)، وتقييم أداء كل مهندس في المنظومة.", "Comprehensive talent and staff management system across 10 global nodes. Delegate sprint tasks, configure RBAC clearances, and audit engineer velocity.")}</p>
            </div>
            <div class="dash-panel-tools">
              <button type="button" class="btn btn--outline btn--sm" id="btn-export-staff-roster">
                <span>\${icon("download", "dash-btn-svg")} \${t("تصدير الكادر (JSON)", "Export Roster (JSON)")}</span>
              </button>
              <button type="button" class="btn btn--primary btn--sm" id="btn-open-add-staff-modal">
                <span>\${icon("plus", "dash-btn-svg")} \${t("إضافة مهندس / موظف جديد", "Add Team Member")}</span>
              </button>
            </div>
          </div>

          <!-- Staff KPI Metric Cards -->
          <div class="dash-kpi-grid" style="margin-block-end: 1.5rem;">
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">\${t("إجمالي الكادر الهندسي النشط", "Total Active Engineers")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">11</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">100% Retained</span> \${t("تفرغ وتواجد كامل", "Fully dedicated core")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">\${t("التوزيع الجغرافي للعقد", "Operational Cities & Nodes")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">10</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">P2P Mesh</span> \${t("فلسطين، لبنان، الأردن، الخليج، أوروبا", "Palestine, Levant, Gulf, EU")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">\${t("متوسط إنجاز السبرنت الفصلي", "Quarterly Sprint Velocity")}</span>
              <div class="dash-kpi-val"><bdi dir="ltr">96.4%</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">+4.2%</span> \${t("انضباط صارم بالـ SLA", "Rigid SLA adherence")}</div>
            </div>
            <div class="dash-kpi-card">
              <span class="dash-kpi-label">\${t("نظام الصلاحيات (RBAC)", "Clearance Tiers (RBAC)")}</span>
              <div class="dash-kpi-val mono"><bdi dir="ltr">4 Tiers</bdi></div>
              <div class="dash-kpi-meta"><span class="badge badge--ok">Ed25519</span> \${t("تحقق تشفيري عتادي", "Hardware signed identity")}</div>
            </div>
          </div>

          <!-- Discipline Filter Pills & Search -->
          <div class="dash-task-filter-bar" style="margin-block-end: 1.5rem;">
            <div class="dash-search-box">
              <span aria-hidden="true" class="dash-search-icon">\${icon("search", "dash-search-svg")}</span>
              <input type="search" class="dash-input" id="staff-search-input" placeholder="\${t("ابحث باسم المهندس، الدور، الدولة، أو الصلاحية...", "Search by engineer, role, country, or clearance...")}">
            </div>
            <div class="dash-filter-pills" id="staff-discipline-filters">
              <button type="button" class="dash-filter-pill active" data-filter-discipline="all">\${t("كافة الكفاءات (11)", "All Staff (11)")}</button>
              <button type="button" class="dash-filter-pill" data-filter-discipline="core_systems">\${t("هندسة النواة والمصارف", "Core & Banking")}</button>
              <button type="button" class="dash-filter-pill" data-filter-discipline="mesh_field">\${t("شبكات الإغاثة والميدان", "Field Mesh")}</button>
              <button type="button" class="dash-filter-pill" data-filter-discipline="security_crypto">\${t("الأمان والتشفير الجنائي", "Security & Crypto")}</button>
              <button type="button" class="dash-filter-pill" data-filter-discipline="ui_glass">\${t("فيزياء الواجهات والتجربة", "Glass UI / HMI")}</button>
              <button type="button" class="dash-filter-pill" data-filter-discipline="academy_mentors">\${t("الأكاديمية والتوجيه", "Academy Mentors")}</button>
            </div>
          </div>

          <!-- Interactive Employee Cards Grid -->
          <div class="dash-staff-grid" id="staff-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr)); gap: 1rem; margin-block-end: 2rem;">
            <!-- Founder Card -->
            <div class="dash-card dash-staff-card is-active-workspace" data-staff-id="AA-01" data-staff-discipline="core_systems" style="border: 1px solid rgba(212,175,55,0.4); background: radial-gradient(circle at top right, rgba(212,175,55,0.06), transparent 70%), var(--dash-card-bg, rgba(14,18,25,0.7));">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                  <div style="position: relative;">
                    <img src="/assets/img/ahmed-personal.webp" alt="Ahmed Ashraf" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold,#D4AF37);">
                    <span class="live-dot" style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border: 2px solid #000;" aria-hidden="true"></span>
                  </div>
                  <div>
                    <h4 style="font-size: var(--fs-md); font-weight: var(--w-bold); margin: 0; color: var(--text-1);">\${t("المهندس أحمد أشرف", "Eng. Ahmed Ashraf")}</h4>
                    <span style="font-size: var(--fs-xs); color: var(--text-muted);">\${t("المؤسس ورئيس المنظومة", "Founder & Chief Architect")}</span>
                  </div>
                </div>
                <span class="badge badge--ok mono" style="border-color: var(--gold,#D4AF37); color: var(--gold,#D4AF37);">0x00 ROOT</span>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 6px; font-size: 0.72rem; color: var(--text-2); margin-bottom: 0.75rem;">
                <span class="chip chip--sm">📍 \${t("فلسطين (القدس / شبكة موزعة)", "Palestine (Jerusalem)")}</span>
                <span class="chip chip--sm">⚙️ \${t("هندسة النواة والأنظمة المعقدة", "Core & Systems")}</span>
                <span class="chip chip--sm">💼 \${t("3 مهام قيد المتابعة", "3 Active Sprints")}</span>
              </div>
              <p style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.5; margin: 0 0 1rem 0;">
                \${t("قيادة المعمارية العليا لكافة المنصات، اعتماد التوقيعات التشفيرية، وتوجيه استراتيجية التوسع والأكاديمية.", "Apex architecture governance, cryptographic attestation, and strategic expansion across all ventures.")}
              </p>
              <div style="display: flex; gap: 0.5rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem;">
                <button type="button" class="btn btn--primary btn--xs btn-act-switch-user" data-user-id="AA-01" style="flex: 1;">
                  <span>\${t("تفعيل حسابه كجلسة نشطة", "Switch Workspace")}</span>
                </button>
                <button type="button" class="btn btn--ghost btn--xs btn-act-assign-task" data-user-name="أحمد أشرف" data-user-name-en="Ahmed Ashraf">
                  <span>+ \${t("تكليف بمهمة", "Assign Task")}</span>
                </button>
              </div>
            </div>

            <!-- Engineers from workforce.roster -->
            \${(workforce.roster || []).map(eng => \`
              <div class="dash-card dash-staff-card" data-staff-id="\${eng.id}" data-staff-discipline="\${eng.discipline}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                  <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <div style="position: relative;">
                      <div class="dash-avatar-circle" style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; font-weight: var(--w-bold); font-size: 0.85rem; color: var(--accent);">
                        \${(isEn ? (eng.name_en || eng.name) : eng.name).split(" ").slice(-1)[0].slice(0, 2)}
                      </div>
                      <span class="live-dot" style="position: absolute; bottom: 0; right: 0; width: 9px; height: 9px; border: 2px solid #000;" aria-hidden="true"></span>
                    </div>
                    <div>
                      <h4 style="font-size: var(--fs-sm); font-weight: var(--w-bold); margin: 0; color: var(--text-1);">\${isEn ? (eng.name_en || eng.name) : eng.name}</h4>
                      <span style="font-size: var(--fs-xs); color: var(--text-muted);">\${isEn ? (eng.role_en || eng.role) : eng.role}</span>
                    </div>
                  </div>
                  <span class="badge badge--ok mono">\${eng.clearance}</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; font-size: 0.72rem; color: var(--text-2); margin-bottom: 0.75rem;">
                  <span class="chip chip--sm">📍 \${isEn ? (eng.country_en || eng.country) : eng.country}</span>
                  <span class="chip chip--sm"><span class="dot dot--live"></span> \${isEn ? (eng.status_en || eng.status) : eng.status}</span>
                  <span class="chip chip--sm mono">\${eng.id}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                  <span>\${t("إنجاز السبرنت:", "Sprint Velocity:")}</span>
                  <span class="mono" style="color: #10B981; font-weight: var(--w-bold);">98% OK</span>
                </div>
                <div style="display: flex; gap: 0.5rem; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem;">
                  <button type="button" class="btn btn--outline btn--xs btn-act-switch-user" data-user-id="\${eng.id}" style="flex: 1;">
                    <span>\${t("تفعيل جلسته", "Switch User")}</span>
                  </button>
                  <button type="button" class="btn btn--ghost btn--xs btn-act-assign-task" data-user-name="\${eng.name}" data-user-name-en="\${eng.name_en || eng.name}">
                    <span>+ \${t("تكليف بمهمة", "Assign Task")}</span>
                  </button>
                </div>
              </div>
            \`).join("")}
          </div>

          <!-- Role-Based Access Control (RBAC) Matrix Table -->
          <div class="dash-card" style="margin-block-end: 1.5rem;">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--accent" style="margin-bottom: 4px;"><span class="dot dot--live"></span>\${t("مصفوفة الصلاحيات والحوكمة", "RBAC PERMISSIONS MATRIX")}</span>
                <h3 class="dash-card-title">\${t("مصفوفة صلاحيات الوصول والأمان (Role-Based Access Control)", "Role-Based Access Control (RBAC) Matrix")}</h3>
                <p class="dash-panel-desc">\${t("هيكل حوكمة رقمي دقيق يحدد نطاق التصريح البرمجي والتنفيذي لكل مستوى إداري في المنظومة.", "Strict capability policies assigned by clearance level governing code commits, deployments, and ledger mutations.")}</p>
              </div>
            </div>

            <div class="dash-table-wrap">
              <table class="dash-directives-table">
                <thead>
                  <tr>
                    <th>\${t("مستوى الصلاحية", "Clearance Tier")}</th>
                    <th>\${t("المسمى والوصف", "Role Title & Scope")}</th>
                    <th>\${t("الكوادر المعينة", "Assigned Personnel")}</th>
                    <th>\${t("صلاحيات الكود والأنظمة", "Code & Infrastructure")}</th>
                    <th>\${t("سلطة التوقيع التشفيري", "Forensic Signing")}</th>
                    <th>\${t("الاعتماد النهائي", "Final Deploy")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span class="badge badge--ok mono" style="border-color: var(--gold,#D4AF37); color: var(--gold,#D4AF37);">0x00 ROOT</span></td>
                    <td><b>\${t("المالك وكبير المعماريين", "Sovereign Owner & Chief Architect")}</b></td>
                    <td><span class="chip chip--sm">م. أحمد أشرف</span></td>
                    <td>\${t("تحكم مطلق في كافة الخوادم والبنى والإنتاج", "Full Infrastructure & Mutation")}</td>
                    <td><span class="badge badge--ok">Ed25519 Root Key</span></td>
                    <td><span class="dot dot--live"></span> \${t("اعتماد ونشر فوري", "Instant Deploy")}</td>
                  </tr>
                  <tr>
                    <td><span class="badge badge--ok mono">0x01 KERNEL / CRYPTO</span></td>
                    <td><b>\${t("قادة النواة والأمان التشفيري", "Core Kernel & Security Leads")}</b></td>
                    <td><span class="chip chip--sm">م. طارق الناصر</span> <span class="chip chip--sm">م. سارة العلي</span></td>
                    <td>\${t("تعديل نوى Rust والبروتوكولات التشفيرية", "Rust Core & Cryptographic Modules")}</td>
                    <td><span class="badge badge--ok">Peer Attestation</span></td>
                    <td>\${t("يتطلب مراجعة الأقران", "Peer Review Gate")}</td>
                  </tr>
                  <tr>
                    <td><span class="badge badge--ok mono">0x02 FIELD / LEDGER / AI</span></td>
                    <td><b>\${t("مهندسو العمليات والميدان والذكاء", "Field Mesh & Systems Engineers")}</b></td>
                    <td><span class="chip chip--sm">د. ليلى منصور</span> <span class="chip chip--sm">م. عمر الصالح</span> <span class="chip chip--sm">م. زياد قاسم</span> <span class="chip chip--sm">م. هناء الزعبي</span> <span class="chip chip--sm">م. كمال درويش</span> <span class="chip chip--sm">م. مريم خليل</span></td>
                    <td>\${t("تشغيل شبكات P2P والقيود المحاسبية ومحركات AI", "P2P Mesh, Ledger IFRS & AI Models")}</td>
                    <td><span class="badge badge--ok">Sub-key Signed</span></td>
                    <td>\${t("موافقة قائد الذراع", "Venture Lead Approval")}</td>
                  </tr>
                  <tr>
                    <td><span class="badge badge--ok mono">0x03 UI / MENTOR</span></td>
                    <td><b>\${t("هندسة الواجهات وتدريب الأكاديمية", "UI/HMI & Academy Leads")}</b></td>
                    <td><span class="chip chip--sm">م. رزان العلمي</span> <span class="chip chip--sm">م. يوسف النجار</span></td>
                    <td>\${t("أنظمة التصميم الزجاجي والمناهج والطلاب", "Glass Design Systems & Curriculums")}</td>
                    <td><span class="badge badge--ok">Standard Signature</span></td>
                    <td>\${t("موافقة فريق النواة", "Core Team Approval")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Add Employee Modal Dialog -->
          <div class="dash-modal" id="modal-add-employee" role="dialog" aria-modal="true" aria-labelledby="modal-add-employee-title" style="display: none;">
            <div class="dash-modal-card" style="max-width: 520px;">
              <div class="dash-modal-header">
                <h3 class="dash-modal-title" id="modal-add-employee-title">\${t("إضافة مهندس أو موظف جديد للمنظومة", "Add New Team Member / Engineer")}</h3>
                <button type="button" class="dash-modal-close" id="btn-close-add-employee" aria-label="\${t("إغلاق", "Close")}">✕</button>
              </div>
              <form id="form-add-employee" style="display: grid; gap: 0.85rem; padding: 1.25rem;">
                <div class="dash-field-group">
                  <label class="dash-label">\${t("الاسم الكامل (عربي)", "Full Name (Arabic)")}</label>
                  <input type="text" class="dash-input" id="input-emp-name" required placeholder="\${t("مثال: م. فادي الأحمد", "e.g. Eng. Fadi Al-Ahmad")}">
                </div>
                <div class="dash-field-group">
                  <label class="dash-label">\${t("الاسم الكامل (إنجليزي)", "Full Name (English)")}</label>
                  <input type="text" class="dash-input" id="input-emp-name-en" required placeholder="e.g. Eng. Fadi Al-Ahmad">
                </div>
                <div class="dash-field-group">
                  <label class="dash-label">\${t("المسمى الوظيفي والدور", "Role & Title")}</label>
                  <input type="text" class="dash-input" id="input-emp-role" required placeholder="\${t("مثال: مهندس أول بنية تحتية وموزعة", "e.g. Senior Infrastructure Engineer")}">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                  <div class="dash-field-group">
                    <label class="dash-label">\${t("التخصص / القسم", "Discipline")}</label>
                    <select class="dash-select" id="select-emp-discipline">
                      <option value="core_systems">\${t("هندسة النواة والمصارف", "Core & Banking")}</option>
                      <option value="mesh_field">\${t("شبكات الإغاثة والميدان", "Field Mesh")}</option>
                      <option value="security_crypto">\${t("الأمان والتشفير الجنائي", "Security & Crypto")}</option>
                      <option value="ui_glass">\${t("فيزياء الواجهات والتصميم", "Glass UI / HMI")}</option>
                      <option value="academy_mentors">\${t("الأكاديمية والتوجيه", "Academy Mentors")}</option>
                    </select>
                  </div>
                  <div class="dash-field-group">
                    <label class="dash-label">\${t("الدولة / العقدة الميدانية", "Location / Node")}</label>
                    <input type="text" class="dash-input" id="input-emp-country" required placeholder="\${t("فلسطين / دبي / لندن...", "Palestine / Dubai...")}">
                  </div>
                </div>
                <div class="dash-field-group">
                  <label class="dash-label">\${t("مستوى الصلاحية (Clearance Tier)", "Clearance Tier")}</label>
                  <select class="dash-select" id="select-emp-clearance">
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
                  <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-add-employee">\${t("إلغاء", "Cancel")}</button>
                  <button type="submit" class="btn btn--primary btn--sm">\${t("حفظ وإضافة للكادر", "Save & Register Member")}</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Quick Task Assignment Modal -->
          <div class="dash-modal" id="modal-assign-task" role="dialog" aria-modal="true" aria-labelledby="modal-assign-task-title" style="display: none;">
            <div class="dash-modal-card" style="max-width: 500px;">
              <div class="dash-modal-header">
                <h3 class="dash-modal-title" id="modal-assign-task-title">\${t("تكليف بمهمة هندسية جديدة", "Assign New Engineering Task")}</h3>
                <button type="button" class="dash-modal-close" id="btn-close-assign-task" aria-label="\${t("إغلاق", "Close")}">✕</button>
              </div>
              <form id="form-quick-assign-task" style="display: grid; gap: 0.85rem; padding: 1.25rem;">
                <div class="dash-field-group">
                  <label class="dash-label">\${t("المهندس المكلف بالمهمة", "Assigned Engineer")}</label>
                  <input type="text" class="dash-input" id="input-assignee-name" readonly style="background: rgba(255,255,255,0.04); font-weight: var(--w-bold);">
                </div>
                <div class="dash-field-group">
                  <label class="dash-label">\${t("عنوان المهمة الهندسية", "Task Title")}</label>
                  <input type="text" class="dash-input" id="input-assign-title" required placeholder="\${t("اكتب عنوان المهمة ونطاق التسليم...", "Enter concise sprint deliverable...")}">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                  <div class="dash-field-group">
                    <label class="dash-label">\${t("الأولوية", "Priority")}</label>
                    <select class="dash-select" id="select-assign-priority">
                      <option value="urgent">\${t("عاجل وطارئ (Urgent)", "Urgent")}</option>
                      <option value="high" selected>\${t("أولوية عليا (High)", "High")}</option>
                      <option value="medium">\${t("متوسط (Medium)", "Medium")}</option>
                      <option value="low">\${t("عادي (Low)", "Low")}</option>
                    </select>
                  </div>
                  <div class="dash-field-group">
                    <label class="dash-label">\${t("تاريخ الاستحقاق", "Due Date")}</label>
                    <input type="date" class="dash-input" id="input-assign-due" required>
                  </div>
                </div>
                <div class="dash-field-group">
                  <label class="dash-label">\${t("المواصفات الفنية والمخرجات المطلوبة", "Specifications & Criteria")}</label>
                  <textarea class="dash-textarea" id="textarea-assign-desc" rows="3" placeholder="\${t("اكتب تفاصيل المعمارية والمخرجات المتوقعة...", "Expected architecture deliverables...")}"></textarea>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;">
                  <button type="button" class="btn btn--ghost btn--sm" id="btn-cancel-assign-task">\${t("إلغاء", "Cancel")}</button>
                  <button type="submit" class="btn btn--primary btn--sm">\${t("إسناد المهمة وإشعار المهندس", "Assign & Dispatch Task")}</button>
                </div>
              </form>
            </div>
          </div>

        </section>

`;

if (!content.includes('data-dash-panel="staff"')) {
  content = content.replace(fieldMarker, staffPanelHtml + fieldMarker);
  console.log("Successfully inserted staff panel!");
} else {
  console.log("Staff panel already exists");
}

fs.writeFileSync(file, content, "utf8");
