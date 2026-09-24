import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const outDir = "/Users/ahmedashraf/.gemini/antigravity-ide/brain/7a47a092-d740-44da-8a33-61c00097b776";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

// 1. Capture /products index
await page.goto("http://localhost:8899/products", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.querySelectorAll(".rv,[data-stagger]").forEach((e) => e.classList.add("in"));
});
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/products_index_view.png`, fullPage: false });

// 2. Open Sandbox Modal on Smart Accountant and click calculate
const sandboxBtn = await page.$('.btn-open-sandbox[data-product="smart-accountant"]');
if (sandboxBtn) {
  await sandboxBtn.click();
  await page.waitForTimeout(300);
  const calcBtn = await page.$('#btn-run-acc-calc');
  if (calcBtn) await calcBtn.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outDir}/products_sandbox_modal.png` });
  
  // Close modal
  const closeBtn = await page.$('#btn-close-sandbox-modal');
  if (closeBtn) await closeBtn.click();
  await page.waitForTimeout(300);
}

// 3. Open RFQ Modal
const rfqBtn = await page.$('.btn-open-rfq[data-product="smart-accountant"]');
if (rfqBtn) {
  await rfqBtn.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outDir}/products_rfq_modal.png` });
}

// 4. Capture Smart Accountant Product Page
await page.goto("http://localhost:8899/products/smart-accountant", { waitUntil: "networkidle" });
await page.evaluate(() => {
  document.querySelectorAll(".rv,[data-stagger]").forEach((e) => e.classList.add("in"));
});
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/product_smart_accountant_detail.png`, fullPage: false });

await browser.close();
console.log("✔ Captured all product screenshots successfully!");
