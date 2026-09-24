import sys

# 1. Update dashboard.mjs
p_dash = '/Users/ahmedashraf/Awalim-Group-Site/src/pages/dashboard.mjs'
with open(p_dash, 'r', encoding='utf-8') as f:
    code_dash = f.read()

modal_html = '''
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
                <option value="طوارئ قصوى">${t("طوارئ قصوى (Priority 0)", "Priority 0 - Emergency")}</option>
                <option value="حرج جداً">${t("حرج جداً (Priority 1)", "Priority 1 - Urgent")}</option>
                <option value="عالي" selected>${t("عالي (Priority 2)", "Priority 2 - High")}</option>
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
    </div>'''

if 'id="modal-new-directive"' not in code_dash:
    target_pos = code_dash.find('<div class="dash-modal-overlay" id="modal-task">')
    if target_pos != -1:
        code_dash = code_dash[:target_pos] + modal_html + '\n' + code_dash[target_pos:]
        with open(p_dash, 'w', encoding='utf-8') as f:
            f.write(code_dash)
        print('1. Inserted modal-new-directive overlay into dashboard.mjs')

# 2. Update ledger.js modal handlers
p_js = '/Users/ahmedashraf/Awalim-Group-Site/assets/js/ledger.js'
with open(p_js, 'r', encoding='utf-8') as f:
    code_js = f.read()

js_wire = '''
    // Directive modal triggers
    var btnOpenDirModal = document.getElementById("btn-open-directive-modal");
    var btnAddDir2 = document.getElementById("btn-add-directive-2");
    var btnCloseDirModal = document.getElementById("btn-close-directive-modal");
    var btnCancelDir = document.getElementById("btn-cancel-directive");
    var btnSubmitDir = document.getElementById("btn-submit-directive");

    if (btnOpenDirModal) btnOpenDirModal.addEventListener("click", function() { openModal("modal-new-directive"); });
    if (btnAddDir2) btnAddDir2.addEventListener("click", function() { openModal("modal-new-directive"); });
    if (btnCloseDirModal) btnCloseDirModal.addEventListener("click", function() { closeModal("modal-new-directive"); });
    if (btnCancelDir) btnCancelDir.addEventListener("click", function() { closeModal("modal-new-directive"); });

    if (btnSubmitDir) {
      btnSubmitDir.addEventListener("click", function(e) {
        var titleInp = document.getElementById("input-dir-title");
        var prioSel = document.getElementById("select-dir-priority");
        var title = titleInp ? titleInp.value.trim() : "";
        var prio = prioSel ? prioSel.value : "عالي";

        if (!title) {
          showToast(EN ? "Please enter directive mandate" : "يرجى كتابة نص التوجيه الرئاسي", true);
          return;
        }

        titleInp.value = "";
        closeModal("modal-new-directive");

        if (window.AwalimAudio) window.AwalimAudio.chime();
        showToast(EN ? "✍️ Directive signed and dispatched across sovereign mesh!" : "✍️ تم توقيع واعتماد الأمر الرئاسي وتعميمه تشفيرياً!");

        var tableDirectives = document.getElementById("table-owner-directives");
        if (tableDirectives) {
          var tbody = tableDirectives.querySelector("tbody");
          if (tbody) {
            var tr = document.createElement("tr");
            var newId = "DIR-0" + (tbody.children.length + 1);
            var today = new Date().toISOString().slice(0, 10);
            tr.innerHTML = '<td class="mono"><b>' + newId + '</b></td>' +
                           '<td><b>' + title + '</b></td>' +
                           '<td><span class="chip chip--danger">' + prio + '</span></td>' +
                           '<td class="mono">' + today + '</td>' +
                           '<td><span class="dot dot--live"></span> ' + (EN ? "Enforced" : "قيد التنفيذ") + '</td>' +
                           '<td><span class="badge badge--ok">' + (EN ? "SIGNED ROOT" : "موقع ومعتمد 0x00") + '</span></td>';
            tbody.insertBefore(tr, tbody.firstChild);
          }
        }

        if (liveOwnerData) {
          if (!liveOwnerData.directives) liveOwnerData.directives = [];
          liveOwnerData.directives.unshift({
            id: "DIR-0" + (liveOwnerData.directives.length + 1),
            title: title,
            title_en: title,
            priority: prio,
            priority_en: prio,
            status: "قيد التنفيذ",
            status_en: "Enforced",
            date: new Date().toISOString().slice(0, 10),
            signed: true
          });
          fetch("/api/admin/save-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file: "owner.json", data: liveOwnerData })
          }).catch(function() {});
        }
      });
    }
'''

if 'Directive modal triggers' not in code_js:
    target_place = code_js.find('// 10. SOVEREIGN OWNER APEX COCKPIT ENGINE')
    if target_place != -1:
        code_js = code_js[:target_place] + js_wire + '\n' + code_js[target_place:]
        with open(p_js, 'w', encoding='utf-8') as f:
            f.write(code_js)
        print('2. Wired directive modal triggers into ledger.js')
