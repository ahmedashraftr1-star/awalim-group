import sys

p = '/Users/ahmedashraf/Awalim-Group-Site/assets/js/ledger.js'
with open(p, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add terminal commands inside runTermCommand
target_term = '      if (lower === "help") {'
replace_term = '''      if (lower === "help") {
        resLine.textContent = "Commands: owner, treasury, ventures, lockdown, broadcast <msg>, status, audit, keypair, routes, godmode, whoami, rebuild, tasks, mesh, products, clear, help";
      } else if (lower === "owner" || lower === "whoami") {
        resLine.textContent = "👑 SOVEREIGN OWNER: Eng. Ahmed Ashraf | Clearance: 0x00 ROOT | Session: AWALIM-OWNER-AA01 | Valuation: $24.8M | Reserves: $2.84M USDC";
      } else if (lower === "treasury") {
        resLine.textContent = "💰 TREASURY: $24.8M Valuation | $2,840,000 Liquid Reserves | $4.65M ARR | IFRS Variance: 0.00% | Runway: 34 Mos";
      } else if (lower === "ventures") {
        resLine.textContent = "🌐 6 SOVEREIGN VENTURES: 1. Island Haven Core | 2. RahmaCare Mesh | 3. Falcon ERP | 4. Awalim Academy | 5. AI Lab Vibe OS | 6. Sovereign Studio";
      } else if (lower.startsWith("broadcast ")) {
        var bMsg = cmd.slice(10).trim();
        resLine.textContent = "📡 MESH BROADCAST SENT: \\"" + bMsg + "\\" -> Propagated to all 14 field nodes.";
        if (window.AwalimAudio) window.AwalimAudio.chime();
      } else if (lower === "lockdown" || lower === "lockdown --toggle") {
        toggleLockdownState();
        resLine.textContent = "🔒 SOVEREIGN LOCKDOWN TOGGLED | Check master status indicator.";
      } else if (false) {'''

if target_term in code and 'SOVEREIGN OWNER: Eng. Ahmed Ashraf' not in code:
    code = code.replace(target_term, replace_term, 1)
    print('1. Added Owner Terminal Commands')

# 2. Add Owner Cockpit Event Handlers before line 3328
owner_handlers = '''
    // =============================================================
    // 10. SOVEREIGN OWNER APEX COCKPIT ENGINE (إدارة المالك السيادية)
    // =============================================================
    var isLockdownActive = false;
    var liveOwnerData = null;

    // Fetch initial owner.json
    fetch("/api/admin/content?file=owner.json")
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(data) {
        if (data) {
          liveOwnerData = data;
          if (data.owner && data.owner.lockdown_active) {
            isLockdownActive = true;
            updateLockdownUI(true);
          }
        }
      }).catch(function() {});

    function updateLockdownUI(active) {
      var card = document.getElementById("card-lockdown-status");
      var badge = document.getElementById("badge-lockdown-state");
      var btnText = document.getElementById("btn-lockdown-text");
      var topBtn = document.getElementById("btn-owner-lockdown-top");

      if (active) {
        if (card) card.classList.add("dash-lockdown-active");
        if (badge) {
          badge.className = "badge badge--alert";
          badge.textContent = EN ? "LOCKDOWN ENGAGED · READ-ONLY" : "تجميد سيادي نشط · للقراءة فقط";
        }
        if (btnText) btnText.textContent = EN ? "Disengage Lockdown" : "فك التجميد السيادي";
        if (topBtn) {
          topBtn.className = "btn btn--danger btn--sm";
          topBtn.innerHTML = '<span class="dot dot--live"></span><span>' + (EN ? "LOCKED 🔒" : "مغلق سيادياً 🔒") + '</span>';
        }
      } else {
        if (card) card.classList.remove("dash-lockdown-active");
        if (badge) {
          badge.className = "badge badge--ok";
          badge.textContent = EN ? "SYSTEMS NORMAL · UNLOCKED" : "الأنظمة نشطة · وضع الأمان العادي";
        }
        if (btnText) btnText.textContent = EN ? "Engage Sovereign Lockdown" : "تفعيل التجميد السيادي";
        if (topBtn) {
          topBtn.className = "btn btn--danger btn--sm";
          topBtn.innerHTML = '<span class="dot dot--live"></span><span>' + (EN ? "⚡ Lockdown" : "⚡ قفل المنظومة") + '</span>';
        }
      }
    }

    function toggleLockdownState() {
      isLockdownActive = !isLockdownActive;
      updateLockdownUI(isLockdownActive);

      if (isLockdownActive) {
        if (window.AwalimAudio) window.AwalimAudio.tap();
        showToast(EN ? "🔒 Sovereign Lockdown ENGAGED — Public mutations sealed." : "🔒 تم تفعيل التجميد السيادي — كافة العمليات مشفرة ومحمية.");
      } else {
        if (window.AwalimAudio) window.AwalimAudio.chime();
        showToast(EN ? "🔓 Sovereign Lockdown DISENGAGED — Systems operational." : "🔓 تم فك التجميد السيادي — المنظومة بكامل طاقتها التشغيلية.");
      }

      if (liveOwnerData && liveOwnerData.owner) {
        liveOwnerData.owner.lockdown_active = isLockdownActive;
        fetch("/api/admin/save-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: "owner.json", data: liveOwnerData })
        }).catch(function() {});
      }
    }

    var btnLockdownToggle = document.getElementById("btn-lockdown-toggle");
    var btnTriggerLockdown = document.getElementById("btn-trigger-lockdown");
    var btnOwnerLockdownTop = document.getElementById("btn-owner-lockdown-top");

    if (btnLockdownToggle) btnLockdownToggle.addEventListener("click", toggleLockdownState);
    if (btnTriggerLockdown) btnTriggerLockdown.addEventListener("click", toggleLockdownState);
    if (btnOwnerLockdownTop) btnOwnerLockdownTop.addEventListener("click", toggleLockdownState);

    // Emergency Broadcast Form
    var formOwnerBroadcast = document.getElementById("form-owner-broadcast");
    var btnOwnerBroadcastTop = document.getElementById("btn-owner-broadcast-top");

    if (btnOwnerBroadcastTop) {
      btnOwnerBroadcastTop.addEventListener("click", function() {
        switchDashTab("owner");
        var inp = document.getElementById("input-broadcast-text");
        if (inp) { inp.focus(); inp.scrollIntoView({ behavior: "smooth", block: "center" }); }
      });
    }

    if (formOwnerBroadcast) {
      formOwnerBroadcast.addEventListener("submit", function(e) {
        e.preventDefault();
        var textInput = document.getElementById("input-broadcast-text");
        var targetSelect = document.getElementById("select-broadcast-target");
        var text = textInput ? textInput.value.trim() : "";
        var target = targetSelect ? targetSelect.value : "all";

        if (!text) return;
        textInput.value = "";

        if (window.AwalimAudio) window.AwalimAudio.chime();
        showToast(EN ? "📡 Signed Directive dispatched to 14 mesh nodes!" : "📡 تم بث وتعميم الأمر القيادي المشفر عبر كافة العقد بنجاح!");

        // Add to directives table dynamically
        var tableDirectives = document.getElementById("table-owner-directives");
        if (tableDirectives) {
          var tbody = tableDirectives.querySelector("tbody");
          if (tbody) {
            var tr = document.createElement("tr");
            var newId = "DIR-0" + (tbody.children.length + 1);
            var today = new Date().toISOString().slice(0, 10);
            tr.innerHTML = '<td class="mono"><b>' + newId + '</b></td>' +
                           '<td><b>' + text + '</b></td>' +
                           '<td><span class="chip chip--danger">' + (EN ? "Emergency" : "طوارئ قصوى") + '</span></td>' +
                           '<td class="mono">' + today + '</td>' +
                           '<td><span class="dot dot--live"></span> ' + (EN ? "Active Broadcast" : "بث ميداني نشط") + '</td>' +
                           '<td><span class="badge badge--ok">' + (EN ? "SIGNED ROOT" : "موقع ومعتمد 0x00") + '</span></td>';
            tbody.insertBefore(tr, tbody.firstChild);
          }
        }

        // Save to owner.json
        if (liveOwnerData) {
          if (!liveOwnerData.directives) liveOwnerData.directives = [];
          liveOwnerData.directives.unshift({
            id: "DIR-0" + (liveOwnerData.directives.length + 1),
            title: text,
            title_en: text,
            priority: "طوارئ قصوى",
            priority_en: "Critical Emergency",
            status: "بث ميداني نشط",
            status_en: "Active Broadcast",
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

    // Modal New Directive
    var btnOpenDirModal = document.getElementById("btn-open-directive-modal");
    var btnAddDir2 = document.getElementById("btn-add-directive-2");
    var btnCancelDir = document.getElementById("btn-cancel-directive");
    var backdropModalDir = document.getElementById("backdrop-modal-directive");
    var formNewDirective = document.getElementById("form-new-directive");

    function openDirectiveModal() { openModal("modal-new-directive"); }
    function closeDirectiveModal() { closeModal("modal-new-directive"); }

    if (btnOpenDirModal) btnOpenDirModal.addEventListener("click", openDirectiveModal);
    if (btnAddDir2) btnAddDir2.addEventListener("click", openDirectiveModal);
    if (btnCancelDir) btnCancelDir.addEventListener("click", closeDirectiveModal);
    if (backdropModalDir) backdropModalDir.addEventListener("click", closeDirectiveModal);

    if (formNewDirective) {
      formNewDirective.addEventListener("submit", function(e) {
        e.preventDefault();
        var titleInp = document.getElementById("input-dir-title");
        var prioSel = document.getElementById("select-dir-priority");
        var ventSel = document.getElementById("select-dir-venture");

        var title = titleInp ? titleInp.value.trim() : "";
        var prio = prioSel ? prioSel.value : "عالي";

        if (!title) return;
        titleInp.value = "";
        closeDirectiveModal();

        if (window.AwalimAudio) window.AwalimAudio.chime();
        showToast(EN ? "✍️ Directive signed and recorded in sovereign ledger!" : "✍️ تم توقيع واعتماد الأمر الرئاسي وحفظه في سجل النواة!");

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

target_bottom = '    var btnSaveServices = document.getElementById("btn-save-services");'
if target_bottom in code and 'SOVEREIGN OWNER APEX COCKPIT ENGINE' not in code:
    code = code.replace(target_bottom, owner_handlers + '\n    var btnSaveServices = document.getElementById("btn-save-services");', 1)
    print('2. Added Owner Event Handlers into ledger.js')

with open(p, 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated ledger.js successfully!')
