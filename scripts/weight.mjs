// Transfer weight per resource type for a page (production QA helper).
import {chromium} from '@playwright/test';
const [url, w = '390'] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({viewport: {width: +w, height: 844}});
const sizes = {};
p.on('response', async (r) => {
  try {
    const t = r.request().resourceType();
    const len = (await r.body()).length;
    sizes[t] = (sizes[t] ?? 0) + len;
  } catch {}
});
await p.goto(url, {waitUntil: 'networkidle'});
const cls = await p.evaluate(() => new Promise((res) => { let v = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) v += e.value; }).observe({type: 'layout-shift', buffered: true}); setTimeout(() => res(v), 500); }));
const lcp = await p.evaluate(() => new Promise((res) => new PerformanceObserver((l) => { const e = l.getEntries().at(-1); res(Math.round(e.startTime)); }).observe({type: 'largest-contentful-paint', buffered: true})));
console.log(JSON.stringify({kb: Object.fromEntries(Object.entries(sizes).map(([k, v]) => [k, Math.round(v / 1024)])), cls: +cls.toFixed(3), lcpMsLocal: lcp}));
await b.close();
