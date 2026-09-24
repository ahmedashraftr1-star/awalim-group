import fs from "fs";

let dash = fs.readFileSync("src/pages/dashboard.mjs", "utf8");

const targetTools = '<div class="dash-panel-tools">\n              <button type="button" class="btn btn--danger btn--sm" id="btn-lockdown-toggle">';
const replacementTools = `<div class="dash-panel-tools">
              <button type="button" class="btn btn--outline btn--sm" id="btn-export-ledger" title="${t("تصدير السجل التشفيري المعتمد", "Export Cryptographically Signed Ledger")}">
                <span>${icon("download", "dash-btn-svg")} ${t("تصدير السجل السيادي (JSON)", "Export Ledger (JSON)")}</span>
              </button>
              <button type="button" class="btn btn--outline btn--sm" id="btn-toggle-sovereign-audio" title="${t("الصوت التفاعلي السيادي", "Sovereign Interactive Acoustics")}">
                <span><span id="audio-status-icon">🔊</span> <span id="audio-status-text">${t("صوت: مفعل", "Audio: ON")}</span></span>
              </button>
              <button type="button" class="btn btn--danger btn--sm" id="btn-lockdown-toggle">`;

if (!dash.includes("btn-export-ledger")) {
  dash = dash.replace(targetTools, replacementTools);
  console.log("Tools updated");
}

const targetTreasuryEnd = `<span>${t("انعدام تام لفروق التسوية المالية", "Zero reconciliation variance")}</span>
              </div>
            </div>
          </div>`;

const simMarkup = `

          <!-- Dynamic Runway & Valuation Simulator -->
          <div class="dash-card dash-treasury-sim" id="dash-treasury-sim" style="margin-block-end: 1.5rem; background: linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(13,20,32,0.7) 100%); border: 1px solid rgba(212,175,55,0.25);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="chip chip--gold"><span class="dot dot--live"></span>${t("محاكي التوسع السيادي والسيولة التفاعلي", "DYNAMIC RUNWAY & EXPANSION SIMULATOR")}</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">${t("نمذجة فورية لأثر العقود والاحتياطي على الصمود والقيمة", "Real-time modeling of contract retainers and reserves on runway")}</span>
              </div>
              <button type="button" class="btn btn--ghost btn--xs" id="btn-reset-sim">
                <span>${t("إعادة ضبط النموذج", "Reset Model")}</span>
              </button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 1rem; align-items: end;">
              <div>
                <label for="sim-new-arr" style="display:block; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">
                  ${t("نمو الإيرادات السنوية الإضافية (ARR Delta):", "Additional Annual Retainers (ARR Delta):")}
                </label>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <input type="range" id="sim-new-arr" min="0" max="3000000" step="100000" value="0" style="flex:1;">
                  <span class="mono" id="sim-new-arr-val" style="font-size:0.8rem; color:var(--gold,#D4AF37); min-width:65px;">+$0</span>
                </div>
              </div>
              <div>
                <label for="sim-reserve-add" style="display:block; font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">
                  ${t("ضخ احتياطي نقدي إضافي للخزينة (Vault Injection):", "Direct Reserve Injection (Cold Vault):")}
                </label>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  <input type="range" id="sim-reserve-add" min="0" max="2000000" step="100000" value="0" style="flex:1;">
                  <span class="mono" id="sim-reserve-add-val" style="font-size:0.8rem; color:#10B981; min-width:65px;">+$0</span>
                </div>
              </div>
              <div style="background: rgba(0,0,0,0.35); padding: 0.6rem 0.9rem; border-radius: var(--radius-sm); border: 1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-around; text-align:center;">
                <div>
                  <div style="font-size:0.68rem; color:var(--text-muted);">${t("الصمود المالي المتوقع", "Simulated Runway")}</div>
                  <div class="mono" id="sim-res-runway" style="font-size:1.1rem; font-weight:var(--w-bold); color:#10B981;">34 ${t("شهراً", "Mo")}</div>
                </div>
                <div style="border-inline-start:1px solid rgba(255,255,255,0.08); padding-inline-start:0.75rem;">
                  <div style="font-size:0.68rem; color:var(--text-muted);">${t("القيمة التقديرية المتوقعة", "Simulated Valuation")}</div>
                  <div class="mono" id="sim-res-val" style="font-size:1.1rem; font-weight:var(--w-bold); color:var(--gold,#D4AF37);">$24.8M</div>
                </div>
              </div>
            </div>
          </div>`;

if (!dash.includes("dash-treasury-sim")) {
  dash = dash.replace(targetTreasuryEnd, targetTreasuryEnd + simMarkup);
  console.log("Treasury simulator updated");
}

const targetVentureStat = `<span class="dash-venture-stat-label">${t("المقاييس / SLA", "SLA Status")}</span>
                      <span class="dash-venture-stat-val mono">${v.sla}</span>
                    </div>
                  </div>
                </div>`;

const replacementVentureStat = `<span class="dash-venture-stat-label">${t("المقاييس / SLA", "SLA Status")}</span>
                      <span class="dash-venture-stat-val mono">${v.sla}</span>
                    </div>
                  </div>
                  <div class="dash-venture-foot" style="margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center;">
                    <span class="mono" style="font-size: 0.72rem; color: var(--accent);">${v.active_nodes || 4} ${t("عقد نشطة", "Active Nodes")} · ${v.latency || "10ms"}</span>
                    <button type="button" class="btn btn--ghost btn--xs btn-inspect-venture" data-venture-inspect="${v.id}">
                      <span>${t("فحص تكتيكي", "Inspect Specs")} →</span>
                    </button>
                  </div>
                </div>`;

if (!dash.includes("btn-inspect-venture")) {
  dash = dash.replace(targetVentureStat, replacementVentureStat);
  console.log("Venture foot updated");
}

const targetWorkforceGrid = `            <div class="dash-workforce-grid">
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
          </div>`;

const rosterMarkup = `

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
          </div>`;

if (!dash.includes("table-owner-roster")) {
  dash = dash.replace(targetWorkforceGrid, targetWorkforceGrid.slice(0, -16) + rosterMarkup);
  console.log("Workforce roster updated");
}

const targetModalDirEnd = `            <button type="button" class="btn btn--primary btn--sm" id="btn-submit-directive">
              <span>${icon("shield", "dash-btn-svg")} ${t("توقيع واعتماد الأمر تشفيرياً", "Sign & Dispatch Directive")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>`;

const modalVentureMarkup = `

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
    </div>`;

if (!dash.includes("modal-venture-inspect")) {
  dash = dash.replace(targetModalDirEnd, targetModalDirEnd + modalVentureMarkup);
  console.log("Modal venture inspect updated");
}

fs.writeFileSync("src/pages/dashboard.mjs", dash);
console.log("Successfully patched dashboard.mjs!");
