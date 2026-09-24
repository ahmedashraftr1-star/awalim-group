
import { chromium } from "playwright";
const b = await chromium.launch();
const page = await b.newPage();
await page.goto("http://localhost:8899/");
await page.evaluate(() => localStorage.clear());
await b.close();
console.log("CLEARED_STORAGE");
