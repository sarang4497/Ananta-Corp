// Screenshots of routes × widths, plus shell UI states.
// usage:
//   BASE=http://localhost:3301 node scripts/screens.mjs
//   BASE=… OUT=qa/screens/v2 WIDTHS=320,390,1440 ROUTES=/,/products STATES=page,mega,search,assistant,menu FULL=1 node scripts/screens.mjs
// STATES:
//   page       the route itself (full page when FULL=1, else viewport)
//   mega       desktop (≥1080) Products mega panel open (MEGA=products|brands|applications|tools|resources)
//   search     site search open (query from SEARCH_Q, default "plywood")
//   assistant  assistant panel open
//   menu       mobile menu open (<1080)
// Output: OUT/<route>@<width>[.<state>].png (qa/screens/ is gitignored).
import {chromium} from '@playwright/test';
import fs from 'node:fs';

const base = process.env.BASE ?? 'http://localhost:3300';
const out = process.env.OUT ?? 'qa/screens/v2';
const widths = (process.env.WIDTHS ?? '320,390,430,768,1024,1440').split(',').map(Number);
const routes = (process.env.ROUTES ?? '/,/products,/products/plywood,/products/mdf/hdhmr/action-tesa-hdhmr-board,/decor,/tools,/blog,/about,/contact').split(',');
const states = (process.env.STATES ?? 'page,mega,search,assistant,menu').split(',');
const full = process.env.FULL === '1';
const mega = process.env.MEGA ?? 'products';
const q = process.env.SEARCH_Q ?? 'plywood';

fs.mkdirSync(out, {recursive: true});
const browser = await chromium.launch();
const ready = (page) => page.waitForFunction(() => document.documentElement.dataset.motion === 'ready', null, {timeout: 15000}).catch(() => {});

for (const w of widths) {
  const ctx = await browser.newContext({viewport: {width: w, height: w < 800 ? 844 : 900}, deviceScaleFactor: 1, isMobile: w < 800, hasTouch: w < 800});
  const page = await ctx.newPage();
  for (const r of routes) {
    const slug = r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '_');
    for (const s of states) {
      if (s === 'mega' && w < 1080) continue;
      if (s === 'menu' && w >= 1080) continue;
      await page.goto(base + r, {waitUntil: 'domcontentloaded'});
      await ready(page);
      if (s === 'page' && full) {
        // play every scroll reveal once
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 400) {
            window.scrollTo(0, y);
            await new Promise((res) => setTimeout(res, 60));
          }
          window.scrollTo(0, 0);
        });
      }
      if (s === 'mega') {
        const label = mega[0].toUpperCase() + mega.slice(1);
        await page.getByRole('button', {name: label, exact: true}).click();
      }
      if (s === 'search') await page.evaluate((q) => window.dispatchEvent(new CustomEvent('open-search', {detail: {q}})), q);
      if (s === 'assistant') await page.evaluate(() => window.dispatchEvent(new CustomEvent('open-bella')));
      if (s === 'menu') await page.getByTestId('menu-toggle').click();
      await page.waitForTimeout(900);
      const name = `${slug}@${w}${s === 'page' ? '' : '.' + s}.png`;
      await page.screenshot({path: `${out}/${name}`, fullPage: s === 'page' && full});
      console.log(name);
    }
  }
  await ctx.close();
}
await browser.close();
