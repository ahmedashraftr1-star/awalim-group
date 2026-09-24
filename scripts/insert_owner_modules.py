import sys

p_dash = '/Users/ahmedashraf/Awalim-Group-Site/src/pages/dashboard.mjs'
with open(p_dash, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add milestones and workforce to declarations
target_decl = '  const directives = owner.directives || [];'
replace_decl = '''  const directives = owner.directives || [];
  const milestones = owner.milestones || [];
  const workforce = owner.workforce || { disciplines: [] };'''

if target_decl in code and 'const milestones =' not in code:
    code = code.replace(target_decl, replace_decl, 1)
    print('1. Added milestones and workforce declarations')

# 2. Build the HTML block for the 3 new sections
expansion_html = '''
          <!-- Real-Time Cashflow & Capital Allocation Visualizer -->
          <div class="dash-card" style="margin-block-start: 1.5rem; margin-block-end: 1.5rem;">
            <div class="dash-panel-head" style="margin-bottom: 1rem;">
              <div>
                <span class="chip chip--gold" style="margin-bottom: 4px;"><span class="dot dot--live"></span>${t("التدفقات المالية والسيولة الشهرية المباشرة", "MONTHLY CASHFLOW & CAPITAL ALLOCATION")}</span>
                <h3 class="dash-card-title">${t("مؤشرات السيولة والتدفق النقدي الشهري (IFRS Cashflow Runrate)", "Monthly Net Sovereign Surplus & Capital Allocation")}</h3>
                <p class="dash-panel-desc">${t("رصد دقيق للتدفقات الشهرية الداخلة مقابل نفقات البنية التحتية المستقلة، مع فائض سيادي حر يعزز استقلالية المنظومة.", "Direct visibility of monthly contract inflows versus independent infrastructure overhead, yielding an autonomous sovereign surplus.")}</p>
              </div>
            </div>

            <div class="dash-flow-grid">
              <div class="dash-flow-stat">
                <span class="dash-treasury-label">${t("التدفق الشهري الإجمالي (Inflow)", "Monthly Contract Inflow")}</span>
                <div class="dash-treasury-val" style="color:#10B981;"><bdi dir="ltr">+$387,500</bdi></div>
                <div class="dash-treasury-meta"><span class="badge badge--ok">18 عقود</span> ${t("عقود تشغيلية وصيانة مؤسسية", "Enterprise retainers")}</div>
              </div>
              <div class="dash-flow-stat">
                <span class="dash-treasury-label">${t("الإنفاق التشغيلي الشهري (Burn)", "Monthly Operational Burn")}</span>
                <div class="dash-treasury-val" style="color:#EF4444;"><bdi dir="ltr">-$84,000</bdi></div>
                <div class="dash-treasury-meta"><span class="badge badge--alert">Zero Cloud</span> ${t("خوادم ذاتية ومكافآت النخب", "Bare-metal servers & elite retainers")}</div>
              </div>
              <div class="dash-flow-stat" style="border-color:rgba(212,175,55,0.4);">
                <span class="dash-treasury-label">${t("الفائض السيادي الشهري الصافي (Surplus)", "Net Sovereign Monthly Surplus")}</span>
                <div class="dash-treasury-val dash-treasury-val--gold"><bdi dir="ltr">+$303,500</bdi></div>
                <div class="dash-treasury-meta"><span class="badge badge--ok">+78.3%</span> ${t("هامش ربحية سيادي حر يودع في الخزينة", "Autonomous treasury surplus")}</div>
              </div>
            </div>

            <!-- Capital Allocation Segmented Bar -->
            <div style="margin-block-start: 1rem;">
              <div style="display:flex; justify-content:space-between; font-size:var(--fs-xs); color:var(--text-muted); margin-bottom:4px;">
                <span>${t("توزيع العوائد عبر الأذرع الستة:", "Revenue Allocation Across the 6 Sovereign Arms:")}</span>
                <span class="mono">100% Verified</span>
              </div>
              <div class="dash-flow-bar-wrap" title="Revenue Share: Island Haven 38%, RahmaCare 22%, Falcon 19%, Academy 11%, Vibe OS 6%, Studio 4%">
                <div class="dash-flow-seg" style="width:38%; background:#00F0FF;" title="Island Haven: 38%"></div>
                <div class="dash-flow-seg" style="width:22%; background:#10B981;" title="RahmaCare: 22%"></div>
                <div class="dash-flow-seg" style="width:19%; background:#D4AF37;" title="Falcon ERP: 19%"></div>
                <div class="dash-flow-seg" style="width:11%; background:#8B5CF6;" title="Awalim Academy: 11%"></div>
                <div class="dash-flow-seg" style="width:6%; background:#3B82F6;" title="AI Lab Vibe OS: 6%"></div>
                <div class="dash-flow-seg" style="width:4%; background:#EC4899;" title="Sovereign Studio: 4%"></div>
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:0.75rem; color:var(--text-2); margin-top:6px;">
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#00F0FF; margin-inline-end:4px;"></i>${t("آيلاند هيفن 38%", "Island Haven 38%")}</span>
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10B981; margin-inline-end:4px;"></i>${t("رحمة كير 22%", "RahmaCare 22%")}</span>
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#D4AF37; margin-inline-end:4px;"></i>${t("فالكون 19%", "Falcon ERP 19%")}</span>
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#8B5CF6; margin-inline-end:4px;"></i>${t("الأكاديمية 11%", "Academy 11%")}</span>
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#3B82F6; margin-inline-end:4px;"></i>${t("مختبر الذكاء 6%", "AI Lab 6%")}</span>
                <span><i style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#EC4899; margin-inline-end:4px;"></i>${t("الاستوديو 4%", "Studio 4%")}</span>
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
          </div>
'''

# 3. Find the end of Panel 0 (owner) and insert the expansion HTML
target_panel_end = '''              </table>
            </div>
          </div>

        </section>'''

if target_panel_end in code and 'REAL-TIME CASHFLOW & CAPITAL ALLOCATION' not in code:
    replace_panel_end = '''              </table>
            </div>
          </div>
''' + expansion_html + '''
        </section>'''
    code = code.replace(target_panel_end, replace_panel_end, 1)
    print('2. Inserted Cashflow, Milestones & Workforce into Owner Panel')

# 4. Command Palette Modal HTML
cmd_palette_html = '''
    <!-- Sovereign Command Palette Modal (Cmd+K / Ctrl+K) -->
    <div class="dash-cmd-palette" id="dash-cmd-palette" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="cmd-palette-title">
      <div class="dash-cmd-card">
        <div class="dash-cmd-head">
          <span class="dash-cmd-icon">${icon("crown")}</span>
          <input type="text" class="dash-cmd-input" id="dash-cmd-input" placeholder="${t("اكتب أمراً أو ابحث في المنظومة (مثال: lockdown, rebuild, tasks, mesh)...", "Type a sovereign command or search (e.g. lockdown, rebuild, tasks, mesh)...")}" aria-label="Command search">
          <span class="dash-cmd-badge">ESC</span>
        </div>
        <div class="dash-cmd-body" id="dash-cmd-body">
          <div class="dash-cmd-group">
            <div class="dash-cmd-group-title">${t("أوامر المالك السيادية العليا", "Sovereign Owner Actions")}</div>
            <div class="dash-cmd-item" data-cmd-action="tab" data-cmd-target="owner">
              <div class="dash-cmd-item-left">
                <span class="dash-cmd-icon">${icon("crown")}</span>
                <span>${t("الانتقال إلى قمرة قيادة المالك والقرارات العليا", "Switch to Owner Apex Cockpit")}</span>
              </div>
              <span class="dash-cmd-badge">Tab 1</span>
            </div>
            <div class="dash-cmd-item" data-cmd-action="lockdown">
              <div class="dash-cmd-item-left">
                <span class="dash-cmd-icon" style="color:#EF4444;">${icon("lock")}</span>
                <span>${t("تبديل حالة التجميد والتعقيم السيادي للطوارئ", "Toggle Sovereign Lockdown Protocol")}</span>
              </div>
              <span class="dash-cmd-badge">CMD+L</span>
            </div>
            <div class="dash-cmd-item" data-cmd-action="rebuild">
              <div class="dash-cmd-item-left">
                <span class="dash-cmd-icon" style="color:#10B981;">${icon("bolt")}</span>
                <span>${t("إعادة بناء وتحديث كامل صفحات الموقع حياً (84 صفحة)", "Rebuild & Deploy Live Site (84 Pages)")}</span>
              </div>
              <span class="dash-cmd-badge">CMD+B</span>
            </div>
            <div class="dash-cmd-item" data-cmd-action="directive">
              <div class="dash-cmd-item-left">
                <span class="dash-cmd-icon" style="color:#D4AF37;">${icon("plus")}</span>
                <span>${t("إصدار وتوقيع أمر رئاسي سيادي جديد", "Issue & Sign New Sovereign Directive")}</span>
              </div>
              <span class="dash-cmd-badge">CMD+D</span>
            </div>
          </div>
          <div class="dash-cmd-group" style="margin-top: 8px;">
            <div class="dash-cmd-group-title">${t("الانتقال بين أجنحة وأنظمة المنظومة", "Navigate Sovereign Modules")}</div>
            <div class="dash-cmd-item" data-cmd-action="tab" data-cmd-target="tasks">
              <div class="dash-cmd-item-left">
                <span class="dash-cmd-icon">${icon("kanban")}</span>
                <span>${t("إدارة مهام وعمليات آيلاند هيفن (Island Haven Kanban)", "Island Haven Tasks & Sprints")}</span>
              </div>
              <span class="dash-cmd-badge">Tasks</span>
            </div>
            <div class="dash-cmd-item" data-cmd-action="tab" data-cmd-target="field">
              <div class="dash-cmd-item-left">
                <span class="dash-cmd-icon">${icon("ambulance")}</span>
                <span>${t("عمليات رحمة كير الميدانية وعقد الطوارئ الـ 14", "RahmaCare Field Dispatch (14 Nodes)")}</span>
              </div>
              <span class="dash-cmd-badge">Mesh</span>
            </div>
            <div class="dash-cmd-item" data-cmd-action="tab" data-cmd-target="products">
              <div class="dash-cmd-item-left">
                <span class="dash-cmd-icon">${icon("rocket")}</span>
                <span>${t("أستوديو الأنظمة والمنتجات السيادية الستة", "Flagship Products Studio")}</span>
              </div>
              <span class="dash-cmd-badge">Products</span>
            </div>
            <div class="dash-cmd-item" data-cmd-action="tab" data-cmd-target="testing">
              <div class="dash-cmd-item-left">
                <span class="dash-cmd-icon">${icon("flask")}</span>
                <span>${t("مركز الفحص الشامل للموقع (0 أخطاء)", "Master Site-Wide Test Suite")}</span>
              </div>
              <span class="dash-cmd-badge">QA</span>
            </div>
          </div>
        </div>
        <div class="dash-cmd-footer">
          <span>${t("التنقل عبر الأسهم · Enter للاختيار · ESC للإغلاق", "Use ↑↓ arrows to navigate · Enter to select · ESC to close")}</span>
          <span class="mono" style="color:var(--gold,#D4AF37);">AWALIM APEX OS</span>
        </div>
      </div>
    </div>
'''

if 'id="dash-cmd-palette"' not in code:
    target_body_end = '    return {'
    code = code.replace(target_body_end, cmd_palette_html + '\n    return {', 1)
    print('3. Appended Command Palette Modal to dashboard template')

with open(p_dash, 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated dashboard.mjs successfully!')
