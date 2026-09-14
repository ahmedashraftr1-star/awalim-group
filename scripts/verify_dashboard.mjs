import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  console.log("Navigating to http://localhost:8899/dashboard...");
  await page.goto("http://localhost:8899/dashboard", { waitUntil: "networkidle" });

  console.log("Title:", await page.title());

  // 1. Check Overview tab
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_overview.png" });
  console.log("Captured dash_overview.png");

  // 2. Switch to Landing / Hero Studio
  await page.click('[data-dash-tab="landing"]');
  await page.waitForTimeout(300);
  // Type in hero input line 1
  await page.fill("#hero-input-line1", "نحن نبني المستقبل الرقمي.");
  await page.waitForTimeout(200);
  const previewText = await page.textContent("#preview-line1");
  console.log("Live preview updated to:", previewText);
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_landing_preview.png" });

  // 3. Switch to Projects tab & Test Add Project
  await page.click('[data-dash-tab="projects"]');
  await page.waitForTimeout(300);
  await page.click("#btn-add-project");
  await page.waitForTimeout(200);
  console.log("Modal active:", await page.isVisible("#modal-project"));
  await page.fill("#form-project-title", "Gaza Mesh Telecom OS");
  await page.fill("#form-project-slug", "gaza-mesh-telecom");
  await page.fill("#form-project-domain", "Emergency Mesh · 0 bps");
  await page.fill("#form-project-metric", "100% Offline Resilience");
  await page.click("#btn-save-project");
  await page.waitForTimeout(300);
  console.log("Modal closed:", !(await page.isVisible("#modal-project")));
  const projectsCount = await page.textContent("#badge-projects-count");
  console.log("New projects count:", projectsCount);
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_projects_table.png" });

  // 4. Switch to Testing tab & Run Live Audit
  await page.click('[data-dash-tab="testing"]');
  await page.waitForTimeout(300);
  console.log("Running live audit on dashboard...");
  await page.click("#btn-run-live-test");
  await page.waitForFunction(() => {
    const score = document.getElementById("test-score-val");
    return score && score.textContent === "100";
  }, { timeout: 15000 });
  console.log("Live audit finished with 100/100 score!");
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_testing_audit.png" });

  // 5. Switch to Security tab & Test Key Generation
  await page.click('[data-dash-tab="security"]');
  await page.waitForTimeout(300);
  await page.click("#btn-generate-keypair");
  await page.waitForTimeout(300);
  const keyVal = await page.inputValue("#crypto-pubkey-display");
  console.log("Generated Key Fingerprint:", keyVal.slice(0, 30) + "...");
  await page.click("#btn-sign-state");
  await page.waitForTimeout(200);
  await page.click("#btn-verify-sig");
  await page.waitForTimeout(200);
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_security_vault.png" });

  // 6. Test English version
  await page.goto("http://localhost:8899/en/dashboard", { waitUntil: "networkidle" });
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_en_overview.png" });
  console.log("Captured English dashboard!");

  await browser.close();

  console.log("Total console errors encountered:", errors.length);
  if (errors.length) {
    console.error("Errors:", errors);
  } else {
    console.log("ZERO CONSOLE ERRORS! PERFECT VERIFICATION!");
  }
})();
