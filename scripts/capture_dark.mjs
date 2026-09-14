import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1728, height: 1080 } });

  await page.goto("http://localhost:8899/", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/home_dark_hero.png" });

  const core3 = await page.$(".arch-card:nth-child(3)");
  if (core3) {
    await core3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/home_dark_arch.png" });
  }

  // Dashboard in dark mode
  await page.goto("http://localhost:8899/dashboard", { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  await page.screenshot({ path: "/Users/ahmedashraf/.gemini/antigravity-ide/brain/702f55a7-0f04-4b48-a2ec-a7c227577b9e/dash_dark_top.png" });

  await browser.close();
  console.log("Dark screenshots captured!");
})();
