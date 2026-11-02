// Full-page screenshots of representative routes at QA widths.
// usage: BASE=http://localhost:3300 OUT=dir WIDTHS=390,430,1440 ROUTES=/,/products node scripts/screens.mjs
import {chromium} from '@playwright/test';
import fs from 'node:fs';
const base = process.env.BASE ?? 'http://localhost:3300';
const out = process.env.OUT ?? 'qa/screens';
const widths = (process.env.WIDTHS ?? '390,430,1440').split(',').map(Number);
const routes = (process.env.ROUTES ??
  '/,/products,/products/plywood,/products/mdf,/products/mdf/hdhmr/action-tesa-hdhmr-board,/partners,/about,/contact').split(',');
fs.mkdirSync(out, {recursive: true});
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({viewport: {width: w, height: w < 800 ? 844 : 900}, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800});
  const page = await ctx.newPage();
  for (const r of routes) {
    await page.goto(base + r, {waitUntil: 'networkidle'});
    // play every scroll reveal once
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((res) => setTimeout(res, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(900);
    const name = (r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '_')) + `@${w}.png`;
    await page.screenshot({path: `${out}/${name}`, fullPage: true});
    const h = await page.evaluate(() => document.body.scrollHeight);
    console.log(name, h);
  }
  await ctx.close();
}
await browser.close();
