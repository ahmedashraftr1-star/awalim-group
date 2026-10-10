import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  console.log("1. Navigating to http://localhost:8899/dashboard (Unauthenticated)...");
  await page.goto("http://localhost:8899/dashboard", { waitUntil: "networkidle" });

  // 1. Check Gatekeeper is active & confidential dashboard is locked
  const isGatekeeperVisible = await page.isVisible("#dash-gatekeeper");
  const isMainAreaHidden = await page.evaluate(() => {
    const main = document.getElementById("dash-main-area");
    return !main || main.classList.contains("dash-auth-locked") || window.getComputedStyle(main).display === "none";
  });
  console.log("Gatekeeper visible:", isGatekeeperVisible, "Main area locked:", isMainAreaHidden);
  if (!isGatekeeperVisible || !isMainAreaHidden) {
    throw new Error("SECURITY FAILURE: Gatekeeper must be visible and confidential main area must be locked by default!");
  }
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/36607892-fd2f-4111-adf9-45456b840cef/dash_gatekeeper_locked.png" });
  console.log("Captured dash_gatekeeper_locked.png");

  // 2. Test Invalid PIN
  console.log("2. Testing invalid PIN rejection...");
  await page.fill("#dash-gatekeeper-pin", "9999");
  await page.click("#btn-gatekeeper-submit");
  await page.waitForTimeout(300);
  const errText = await page.textContent("#dash-gatekeeper-err");
  console.log("Invalid PIN Error message:", errText);

  // 3. Test Valid PIN (2026) Unlock
  console.log("3. Testing valid PIN (2026) unlock...");
  await page.fill("#dash-gatekeeper-pin", "2026");
  await page.click("#btn-gatekeeper-submit");
  await page.waitForTimeout(500);

  const isUnlocked = await page.evaluate(() => {
    const main = document.getElementById("dash-main-area");
    const gate = document.getElementById("dash-gatekeeper");
    return main && !main.classList.contains("dash-auth-locked") && (!gate || gate.style.display === "none");
  });
  console.log("Dashboard unlocked successfully:", isUnlocked);
  if (!isUnlocked) {
    throw new Error("AUTHENTICATION FAILURE: Valid PIN 2026 failed to unlock dashboard!");
  }
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/36607892-fd2f-4111-adf9-45456b840cef/dash_overview_unlocked.png" });

  // 4. Switch to Landing / Content & Hero Studio
  console.log("4. Testing content editing in Landing tab...");
  await page.click('[data-dash-tab="landing"]');
  await page.waitForTimeout(300);
  await page.fill("#hero-input-line1", "نحن نبني الأنظمة السيادية للشركات الكبرى.");
  await page.waitForTimeout(200);
  const previewText = await page.textContent("#preview-line1");
  console.log("Live preview updated to:", previewText);
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/36607892-fd2f-4111-adf9-45456b840cef/dash_landing_editor.png" });

  // 5. Switch to Projects tab & Test Project Modal UI
  console.log("5. Testing projects management interface...");
  await page.click('[data-dash-tab="projects"]');
  await page.waitForTimeout(300);
  await page.click("#btn-add-project");
  await page.waitForTimeout(200);
  const modalVisible = await page.isVisible("#modal-project");
  console.log("Project modal opened:", modalVisible);
  await page.fill("#form-project-title", "Gaza Mesh Telecom OS");
  await page.fill("#form-project-slug", "gaza-mesh-telecom");
  await page.fill("#form-project-domain", "Emergency Mesh");
  await page.fill("#form-project-metric", "100% Offline Resilience");
  await page.waitForTimeout(200);
  await page.click("#btn-close-project-modal");
  await page.waitForTimeout(300);
  const modalClosed = !(await page.isVisible("#modal-project"));
  console.log("Project modal closed gracefully:", modalClosed);

  // 6. Test Logout / Lock Session
  console.log("6. Testing session lock...");
  await page.click("#btn-admin-logout");
  await page.waitForTimeout(400);
  const isRelocked = await page.evaluate(() => {
    const main = document.getElementById("dash-main-area");
    const gate = document.getElementById("dash-gatekeeper");
    return (!main || main.classList.contains("dash-auth-locked")) && gate && gate.style.display !== "none";
  });
  console.log("Dashboard re-locked after logout:", isRelocked);
  if (!isRelocked) {
    throw new Error("SECURITY FAILURE: Logging out failed to re-lock dashboard!");
  }

  await browser.close();

  console.log("Total console errors encountered:", errors.length);
  if (errors.length) {
    console.error("Errors:", errors);
    throw new Error("Encountered console errors during verification");
  } else {
    console.log("ZERO CONSOLE ERRORS! PERFECT VERIFICATION!");
  }
})();
