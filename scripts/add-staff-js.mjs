import fs from "fs";

const file = "/Users/ahmedashraf/Awalim-Group-Site/assets/js/ledger.js";
let content = fs.readFileSync(file, "utf8");

const staffJsCode = `
    /* ==========================================================================
       STAFF & MULTI-EMPLOYEE ADMINISTRATIVE SYSTEM LOGIC
       ========================================================================== */
    var userSwitcher = document.getElementById("dash-user-switcher");
    var activeUserBadge = document.getElementById("active-user-badge");
    var activeUserStatusText = document.getElementById("active-user-status-text");
    var btnJumpMyTasks = document.getElementById("btn-jump-my-tasks");
    var btnMyTasksLabel = document.getElementById("btn-my-tasks-label");

    var appleName = document.querySelector(".dash-apple-name");
    var appleRole = document.querySelector(".dash-apple-role-pill");
    var appleSession = document.querySelector(".dash-apple-session-pill");
    var appleAvatar = document.querySelector(".dash-apple-avatar");

    function getAssignedTaskCountFor(name) {
      if (!name) return 0;
      var clean = name.replace("م. ", "").replace("د. ", "").trim();
      var count = 0;
      try {
        var raw = localStorage.getItem("awalim_kanban_tasks");
        var tasks = raw ? JSON.parse(raw) : (window.__INITIAL_TASKS__ || []);
        tasks.forEach(function(t) {
          if (t.assignee && (t.assignee.indexOf(clean) !== -1 || clean.indexOf(t.assignee) !== -1)) {
            count++;
          }
        });
      } catch(e) {}
      return count;
    }

    function applyActiveUser(userId) {
      if (!userSwitcher) return;
      var opt = userSwitcher.querySelector('option[value="' + userId + '"]');
      if (!opt) return;

      var name = EN ? (opt.getAttribute("data-name-en") || opt.getAttribute("data-name")) : opt.getAttribute("data-name");
      var role = EN ? (opt.getAttribute("data-role-en") || opt.getAttribute("data-role")) : opt.getAttribute("data-role");
      var clearance = opt.getAttribute("data-clearance") || "0x01";
      var avatar = opt.getAttribute("data-avatar") || "/assets/img/ahmed-personal.webp";

      if (appleName) appleName.textContent = name;
      if (appleRole) appleRole.innerHTML = '<span class="dot dot--live"></span>' + role;
      if (appleSession) appleSession.textContent = clearance + " · " + userId;
      if (appleAvatar && avatar) appleAvatar.src = avatar;

      if (activeUserStatusText) activeUserStatusText.textContent = (EN ? "Active: " : "نشط: ") + name;

      var taskCount = getAssignedTaskCountFor(opt.getAttribute("data-name"));
      if (btnMyTasksLabel) {
        btnMyTasksLabel.textContent = (EN ? "My Tasks (" : "مهامي المسندة (") + taskCount + ")";
      }

      // Highlight corresponding card in staff grid
      document.querySelectorAll(".dash-staff-card").forEach(function(card) {
        card.classList.toggle("is-active-workspace", card.getAttribute("data-staff-id") === userId);
      });

      try {
        localStorage.setItem("awalim_active_user_id", userId);
      } catch(e) {}
    }

    if (userSwitcher) {
      userSwitcher.addEventListener("change", function() {
        var selectedId = this.value;
        applyActiveUser(selectedId);
        var opt = this.options[this.selectedIndex];
        var name = opt ? opt.getAttribute("data-name") : selectedId;
        showToast((EN ? "Switched workspace to: " : "تم تفعيل حساب العمل للموظف: ") + name);
        if (window.AwalimAudio) window.AwalimAudio.tap(2400, 0.03);
      });

      var savedUserId = null;
      try {
        savedUserId = localStorage.getItem("awalim_active_user_id");
      } catch(e) {}
      if (savedUserId && userSwitcher.querySelector('option[value="' + savedUserId + '"]')) {
        userSwitcher.value = savedUserId;
      }
      applyActiveUser(userSwitcher.value);
    }

    // Jump to my tasks
    if (btnJumpMyTasks) {
      btnJumpMyTasks.addEventListener("click", function() {
        switchDashTab("tasks");
        if (userSwitcher) {
          var opt = userSwitcher.options[userSwitcher.selectedIndex];
          var name = opt ? (opt.getAttribute("data-name") || "").replace("م. ", "").replace("د. ", "").trim() : "";
          var searchInput = document.getElementById("task-search-input");
          if (searchInput && name) {
            searchInput.value = name;
            searchInput.dispatchEvent(new Event("input"));
            showToast((EN ? "Showing tasks assigned to " : "تمت تصفية المهام المسندة لـ ") + name);
          }
        }
      });
    }

    // Interactive switch user buttons inside staff cards
    document.addEventListener("click", function(e) {
      var btnSwitch = e.target.closest(".btn-act-switch-user");
      if (btnSwitch) {
        var userId = btnSwitch.getAttribute("data-user-id");
        if (userId && userSwitcher) {
          userSwitcher.value = userId;
          userSwitcher.dispatchEvent(new Event("change"));
          var card = btnSwitch.closest(".dash-staff-card");
          if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      var btnAssign = e.target.closest(".btn-act-assign-task");
      if (btnAssign) {
        var userName = btnAssign.getAttribute("data-user-name") || "";
        var modalAssign = document.getElementById("modal-assign-task");
        var inputAssignee = document.getElementById("input-assignee-name");
        if (inputAssignee) inputAssignee.value = userName;
        if (modalAssign) {
          modalAssign.style.display = "flex";
          var titleInp = document.getElementById("input-assign-title");
          if (titleInp) setTimeout(function() { titleInp.focus(); }, 100);
        }
      }
    });

    // Staff Discipline Filtering
    var staffDisciplinePills = document.querySelectorAll("#staff-discipline-filters button");
    var staffCards = document.querySelectorAll(".dash-staff-card");
    var staffSearchInput = document.getElementById("staff-search-input");

    function filterStaffCards() {
      var activePill = document.querySelector("#staff-discipline-filters button.active");
      var activeDiscipline = activePill ? activePill.getAttribute("data-filter-discipline") : "all";
      var query = staffSearchInput ? staffSearchInput.value.toLowerCase().trim() : "";

      staffCards.forEach(function(card) {
        var cardDiscipline = card.getAttribute("data-staff-discipline");
        var text = card.textContent.toLowerCase();

        var matchDiscipline = activeDiscipline === "all" || cardDiscipline === activeDiscipline;
        var matchQuery = !query || text.indexOf(query) !== -1;

        card.style.display = (matchDiscipline && matchQuery) ? "block" : "none";
      });
    }

    staffDisciplinePills.forEach(function(pill) {
      pill.addEventListener("click", function() {
        staffDisciplinePills.forEach(function(p) { p.classList.remove("active"); });
        pill.classList.add("active");
        filterStaffCards();
        if (window.AwalimAudio) window.AwalimAudio.tap(2000, 0.02);
      });
    });

    if (staffSearchInput) {
      staffSearchInput.addEventListener("input", filterStaffCards);
    }

    // Add Employee Modal
    var btnOpenAddStaff = document.getElementById("btn-open-add-staff-modal");
    var modalAddStaff = document.getElementById("modal-add-employee");
    var btnCloseAddStaff = document.getElementById("btn-close-add-employee");
    var btnCancelAddStaff = document.getElementById("btn-cancel-add-employee");
    var formAddStaff = document.getElementById("form-add-employee");

    function closeStaffModal() {
      if (modalAddStaff) modalAddStaff.style.display = "none";
    }

    if (btnOpenAddStaff) {
      btnOpenAddStaff.addEventListener("click", function() {
        if (modalAddStaff) {
          modalAddStaff.style.display = "flex";
          var nameInp = document.getElementById("input-emp-name");
          if (nameInp) setTimeout(function() { nameInp.focus(); }, 100);
        }
      });
    }
    if (btnCloseAddStaff) btnCloseAddStaff.addEventListener("click", closeStaffModal);
    if (btnCancelAddStaff) btnCancelAddStaff.addEventListener("click", closeStaffModal);

    if (formAddStaff) {
      formAddStaff.addEventListener("submit", function(e) {
        e.preventDefault();
        var nameAr = document.getElementById("input-emp-name")?.value.trim() || "";
        var nameEn = document.getElementById("input-emp-name-en")?.value.trim() || nameAr;
        var role = document.getElementById("input-emp-role")?.value.trim() || "";
        var disc = document.getElementById("select-emp-discipline")?.value || "core_systems";
        var country = document.getElementById("input-emp-country")?.value.trim() || "Palestine";
        var clearance = document.getElementById("select-emp-clearance")?.value || "0x02";

        var newId = "ENG-" + String(Math.floor(Math.random() * 89 + 11));

        // Append to User Switcher
        if (userSwitcher) {
          var newOpt = document.createElement("option");
          newOpt.value = newId;
          newOpt.setAttribute("data-name", nameAr);
          newOpt.setAttribute("data-name-en", nameEn);
          newOpt.setAttribute("data-role", role);
          newOpt.setAttribute("data-clearance", clearance);
          newOpt.setAttribute("data-node", country);
          newOpt.textContent = "👤 " + nameAr + " — " + role;
          userSwitcher.appendChild(newOpt);
        }

        // Append new card to Staff Grid
        var grid = document.getElementById("staff-cards-grid");
        if (grid) {
          var card = document.createElement("div");
          card.className = "dash-card dash-staff-card";
          card.setAttribute("data-staff-id", newId);
          card.setAttribute("data-staff-discipline", disc);
          card.innerHTML = 
            '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">' +
              '<div style="display:flex; gap:0.75rem; align-items:center;">' +
                '<div style="position:relative;">' +
                  '<div class="dash-avatar-circle" style="width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02)); border:1px solid rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-weight:var(--w-bold); font-size:0.85rem; color:var(--accent);">' +
                    nameAr.split(" ").slice(-1)[0].slice(0, 2) +
                  '</div>' +
                  '<span class="live-dot" style="position:absolute; bottom:0; right:0; width:9px; height:9px; border:2px solid #000;" aria-hidden="true"></span>' +
                '</div>' +
                '<div>' +
                  '<h4 style="font-size:var(--fs-sm); font-weight:var(--w-bold); margin:0; color:var(--text-1);">' + (EN ? nameEn : nameAr) + '</h4>' +
                  '<span style="font-size:var(--fs-xs); color:var(--text-muted);">' + role + '</span>' +
                '</div>' +
              '</div>' +
              '<span class="badge badge--ok mono">' + clearance + '</span>' +
            '</div>' +
            '<div style="display:flex; flex-wrap:wrap; gap:6px; font-size:0.72rem; color:var(--text-2); margin-bottom:0.75rem;">' +
              '<span class="chip chip--sm">📍 ' + country + '</span>' +
              '<span class="chip chip--sm"><span class="dot dot--live"></span> ' + (EN ? "Active" : "نشط بالمصفوفة") + '</span>' +
              '<span class="chip chip--sm mono">' + newId + '</span>' +
            '</div>' +
            '<div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:var(--text-muted); margin-bottom:0.75rem;">' +
              '<span>' + (EN ? "Sprint Velocity:" : "إنجاز السبرنت:") + '</span>' +
              '<span class="mono" style="color:#10B981; font-weight:var(--w-bold);">100% NEW</span>' +
            '</div>' +
            '<div style="display:flex; gap:0.5rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.75rem;">' +
              '<button type="button" class="btn btn--outline btn--xs btn-act-switch-user" data-user-id="' + newId + '" style="flex:1;">' +
                '<span>' + (EN ? "Switch User" : "تفعيل جلسته") + '</span>' +
              '</button>' +
              '<button type="button" class="btn btn--ghost btn--xs btn-act-assign-task" data-user-name="' + nameAr + '" data-user-name-en="' + nameEn + '">' +
                '<span>+ ' + (EN ? "Assign Task" : "تكليف بمهمة") + '</span>' +
              '</button>' +
            '</div>';
          grid.appendChild(card);
        }

        // Update badge
        var staffBadge = document.getElementById("badge-staff-count");
        if (staffBadge) {
          var curCount = parseInt(staffBadge.textContent, 10) || 11;
          staffBadge.textContent = curCount + 1;
        }

        closeStaffModal();
        formAddStaff.reset();
        showToast(EN ? ("New Engineer Added: " + nameEn) : ("تمت إضافة المهندس بنجاح: " + nameAr));
      });
    }

    // Quick Assign Task Modal Logic
    var modalAssignTask = document.getElementById("modal-assign-task");
    var btnCloseAssignTask = document.getElementById("btn-close-assign-task");
    var btnCancelAssignTask = document.getElementById("btn-cancel-assign-task");
    var formQuickAssignTask = document.getElementById("form-quick-assign-task");

    function closeAssignModal() {
      if (modalAssignTask) modalAssignTask.style.display = "none";
    }

    if (btnCloseAssignTask) btnCloseAssignTask.addEventListener("click", closeAssignModal);
    if (btnCancelAssignTask) btnCancelAssignTask.addEventListener("click", closeAssignModal);

    if (formQuickAssignTask) {
      formQuickAssignTask.addEventListener("submit", function(e) {
        e.preventDefault();
        var assignee = document.getElementById("input-assignee-name")?.value.trim() || "";
        var title = document.getElementById("input-assign-title")?.value.trim() || "";
        var priority = document.getElementById("select-assign-priority")?.value || "high";
        var dueDate = document.getElementById("input-assign-due")?.value || "";
        var desc = document.getElementById("textarea-assign-desc")?.value.trim() || "";

        var newTask = {
          id: "task-" + Date.now().toString(36),
          title: title,
          description: desc,
          status: "todo",
          priority: priority,
          category: "systems",
          assignee: assignee,
          createdBy: (userSwitcher ? userSwitcher.options[userSwitcher.selectedIndex].getAttribute("data-name") : "أحمد أشرف"),
          dueDate: dueDate,
          tags: ["Sprint", "Assigned"],
          orderIndex: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          commentCount: 0,
          comments: []
        };

        // Append task to local storage kanban tasks
        try {
          var raw = localStorage.getItem("awalim_kanban_tasks");
          var taskList = raw ? JSON.parse(raw) : (window.__INITIAL_TASKS__ || []);
          taskList.unshift(newTask);
          localStorage.setItem("awalim_kanban_tasks", JSON.stringify(taskList));
        } catch(err) {}

        closeAssignModal();
        formQuickAssignTask.reset();
        showToast((EN ? "Task delegated to " : "تم تفويض المهمة بنجاح إلى: ") + assignee);

        // Update task count button
        if (userSwitcher) applyActiveUser(userSwitcher.value);
      });
    }

    // Export Staff Roster JSON
    var btnExportStaff = document.getElementById("btn-export-staff-roster");
    if (btnExportStaff) {
      btnExportStaff.addEventListener("click", function() {
        var staffData = [];
        document.querySelectorAll(".dash-staff-card").forEach(function(card) {
          staffData.push({
            id: card.getAttribute("data-staff-id"),
            discipline: card.getAttribute("data-staff-discipline"),
            name: card.querySelector("h4")?.textContent.trim(),
            role: card.querySelector("h4 + span")?.textContent.trim(),
            clearance: card.querySelector(".badge")?.textContent.trim()
          });
        });
        var blob = new Blob([JSON.stringify(staffData, null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "awalim-engineering-roster-" + new Date().toISOString().slice(0, 10) + ".json";
        a.click();
        URL.revokeObjectURL(url);
        showToast(EN ? "Engineering Roster Exported (JSON)" : "تم تصدير سجل الكادر الهندسي (JSON)");
      });
    }
`;

const insertMarker = `    var btnSaveServices = document.getElementById("btn-save-services");`;

if (!content.includes("STAFF & MULTI-EMPLOYEE ADMINISTRATIVE SYSTEM LOGIC")) {
  content = content.replace(insertMarker, staffJsCode + "\n    " + insertMarker);
  fs.writeFileSync(file, content, "utf8");
  console.log("Successfully injected staff JS into ledger.js!");
} else {
  console.log("Staff JS already present");
}
