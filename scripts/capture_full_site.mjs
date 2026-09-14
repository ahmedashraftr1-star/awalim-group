import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1728, height: 1080 } });

  await page.goto("http://localhost:8899/", { waitUntil: "networkidle" });
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/home_hero.png" });

  // Scroll to architecture
  const arch = await page.$("#architecture");
  if (arch) {
    await arch.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/home_architecture.png" });
  }

  // Scroll to work
  const work = await page.$("#work");
  if (work) {
    await work.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/home_work.png" });
  }

  // Scroll to matrix
  const matrix = await page.$("#sovereign-matrix");
  if (matrix) {
    await matrix.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/home_matrix.png" });
  }

  // Dashboard full tabs inspection
  await page.goto("http://localhost:8899/dashboard", { waitUntil: "networkidle" });
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_full_top.png" });

  // Projects tab
  await page.click('[data-dash-tab="projects"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_projects_full.png" });

  // Services tab
  await page.click('[data-dash-tab="services"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_services_full.png" });

  // Testing tab
  await page.click('[data-dash-tab="testing"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_testing_full.png" });

  await browser.close();
  console.log("All comprehensive screenshots captured successfully!");
})();
