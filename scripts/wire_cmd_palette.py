import sys

p_js = '/Users/ahmedashraf/Awalim-Group-Site/assets/js/ledger.js'
with open(p_js, 'r', encoding='utf-8') as f:
    code = f.read()

cmd_palette_js = '''
    // =============================================================
    // 11. GLOBAL SOVEREIGN COMMAND PALETTE (Cmd+K / Ctrl+K)
    // =============================================================
    var cmdPalette = document.getElementById("dash-cmd-palette");
    var cmdInput = document.getElementById("dash-cmd-input");
    var cmdBody = document.getElementById("dash-cmd-body");

    function openCmdPalette() {
      if (!cmdPalette) return;
      cmdPalette.style.display = "flex";
      if (cmdInput) {
        cmdInput.value = "";
        cmdInput.focus();
      }
      filterCmdItems("");
      if (window.AwalimAudio) window.AwalimAudio.tap();
    }

    function closeCmdPalette() {
      if (!cmdPalette) return;
      cmdPalette.style.display = "none";
    }

    function filterCmdItems(q) {
      if (!cmdBody) return;
      var term = (q || "").toLowerCase().trim();
      var items = cmdBody.querySelectorAll(".dash-cmd-item");
      items.forEach(function(item) {
        var text = item.textContent.toLowerCase();
        if (!term || text.indexOf(term) !== -1) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    }

    if (cmdInput) {
      cmdInput.addEventListener("input", function() {
        filterCmdItems(cmdInput.value);
      });
    }

    if (cmdPalette) {
      cmdPalette.addEventListener("click", function(e) {
        if (e.target === cmdPalette) closeCmdPalette();
      });
    }

    // Command Item Actions
    if (cmdBody) {
      cmdBody.addEventListener("click", function(e) {
        var item = e.target.closest(".dash-cmd-item");
        if (!item) return;

        var action = item.getAttribute("data-cmd-action");
        var target = item.getAttribute("data-cmd-target");

        closeCmdPalette();

        if (action === "tab" && target) {
          switchDashTab(target);
          if (window.AwalimAudio) window.AwalimAudio.chime();
        } else if (action === "lockdown") {
          toggleLockdownState();
        } else if (action === "rebuild") {
          var btnRebuild = document.getElementById("btn-rebuild-site");
          if (btnRebuild) btnRebuild.click();
        } else if (action === "directive") {
          openDirectiveModal();
        }
      });
    }

    // Global Hotkeys Listener
    window.addEventListener("keydown", function(e) {
      var isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      var cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (cmdPalette && cmdPalette.style.display === "flex") {
          closeCmdPalette();
        } else {
          openCmdPalette();
        }
      } else if (e.key === "Escape") {
        if (cmdPalette && cmdPalette.style.display === "flex") {
          closeCmdPalette();
        }
      } else if (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        toggleLockdownState();
      }
    });
'''

target_pos = code.find('// 10. SOVEREIGN OWNER APEX COCKPIT ENGINE')
if target_pos != -1 and 'GLOBAL SOVEREIGN COMMAND PALETTE' not in code:
    code = code[:target_pos] + cmd_palette_js + '\n' + code[target_pos:]
    with open(p_js, 'w', encoding='utf-8') as f:
        f.write(code)
    print('Wired Command Palette into ledger.js')
