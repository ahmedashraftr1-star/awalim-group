import fs from "fs";

// 1. Fix modal markup in dashboard.mjs
const dashFile = "/Users/ahmedashraf/Awalim-Group-Site/src/pages/dashboard.mjs";
let dashContent = fs.readFileSync(dashFile, "utf8");

dashContent = dashContent.replace(
  `<div class="dash-modal" id="modal-add-employee" role="dialog" aria-modal="true" aria-labelledby="modal-add-employee-title" style="display: none;">\n            <div class="dash-modal-card" style="max-width: 520px;">`,
  `<div class="dash-modal-overlay" id="modal-add-employee">\n            <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-add-employee-title">`
);

dashContent = dashContent.replace(
  `<div class="dash-modal" id="modal-assign-task" role="dialog" aria-modal="true" aria-labelledby="modal-assign-task-title" style="display: none;">\n            <div class="dash-modal-card" style="max-width: 500px;">`,
  `<div class="dash-modal-overlay" id="modal-assign-task">\n            <div class="dash-modal" role="dialog" aria-modal="true" aria-labelledby="modal-assign-task-title">`
);

// Fix closing tags
dashContent = dashContent.replace(
  `</form>\n            </div>\n          </div>\n\n          <!-- Quick Task Assignment Modal -->`,
  `</form>\n            </div>\n          </div>\n\n          <!-- Quick Task Assignment Modal -->`
);

fs.writeFileSync(dashFile, dashContent, "utf8");
console.log("Updated dashboard modals markup");

// 2. Fix modal logic in ledger.js to use classList.add("active") and classList.remove("active")
const ledgerFile = "/Users/ahmedashraf/Awalim-Group-Site/assets/js/ledger.js";
let ledgerContent = fs.readFileSync(ledgerFile, "utf8");

ledgerContent = ledgerContent.replace(
  `function closeStaffModal() {\n      if (modalAddStaff) modalAddStaff.style.display = "none";\n    }`,
  `function closeStaffModal() {\n      if (modalAddStaff) modalAddStaff.classList.remove("active");\n    }`
);

ledgerContent = ledgerContent.replace(
  `if (modalAddStaff) {\n          modalAddStaff.style.display = "flex";`,
  `if (modalAddStaff) {\n          modalAddStaff.classList.add("active");`
);

ledgerContent = ledgerContent.replace(
  `function closeAssignModal() {\n      if (modalAssignTask) modalAssignTask.style.display = "none";\n    }`,
  `function closeAssignModal() {\n      if (modalAssignTask) modalAssignTask.classList.remove("active");\n    }`
);

ledgerContent = ledgerContent.replace(
  `if (modalAssign) {\n          modalAssign.style.display = "flex";`,
  `if (modalAssign) {\n          modalAssign.classList.add("active");`
);

fs.writeFileSync(ledgerFile, ledgerContent, "utf8");
console.log("Updated ledger modals classList active");
