// viewport (not full-page) screenshot. usage: node scripts/shot.mjs URL WIDTH OUT [scrollY]
import {chromium} from '@playwright/test';
const [url, w, out, y] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({viewport: {width: +w, height: +w < 800 ? 844 : 900}, isMobile: +w < 800, hasTouch: +w < 800});
await p.goto(url, {waitUntil: 'networkidle'});
if (y) await p.evaluate((y) => window.scrollTo(0, +y), y);
await p.waitForTimeout(1800);
await p.screenshot({path: out});
await b.close();
