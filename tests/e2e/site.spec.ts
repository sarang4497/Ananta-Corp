import {test, expect} from '@playwright/test';
import {ROUTES} from './routes';

test('every public route renders with one h1, title and canonical', async ({page}) => {
  for (const r of ROUTES) {
    const res = await page.goto(r);
    expect(res!.status(), r).toBe(200);
    await expect(page.locator('h1'), r).toHaveCount(1);
    expect((await page.title()).length, r).toBeGreaterThan(10);
    expect(await page.locator('link[rel="canonical"]').getAttribute('href'), r).toMatch(/^https:\/\/www\.anantacorporation\.com/);
    expect(await page.locator('meta[name="description"]').getAttribute('content'), r).toBeTruthy();
  }
});

test('404 page', async ({page}) => {
  const res = await page.goto('/products/not-a-real-thing/x/y');
  expect(res!.status()).toBe(404);
  await expect(page.getByRole('heading', {level: 1})).toContainText('isn’t on the shelf');
});

test('original-site URLs redirect', async ({request}) => {
  for (const [from, to] of [
    ['/about-us', '/about'],
    ['/categories', '/products'],
    ['/privacy-policy', '/privacy'],
    ['/term-of-use', '/terms'],
    ['/products/doors', '/products/flush-door']
  ]) {
    const r = await request.get(from, {maxRedirects: 0});
    expect(r.status(), from).toBe(308);
    expect(r.headers().location, from).toContain(to);
  }
});

test('structured data: organization without ratings; product without offers', async ({page}) => {
  await page.goto('/products/plywood/moisture-resistant/duroply-mr-moisture-resistant-plywood');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const all = blocks.join('\n');
  expect(all).toContain('"postalCode":"382405"');
  expect(all).toContain('"@type":"Product"');
  expect(all).not.toMatch(/aggregateRating|"review"|openingHours/);
});

test('hero shows Duroply + Action TESA as logos, not text pills', async ({page}) => {
  await page.goto('/');
  const hero = page.locator('section[aria-labelledby="hero-title"]');
  await expect(hero.getByAltText('Duroply logo')).toBeVisible();
  await expect(hero.getByAltText('Action TESA logo')).toBeVisible();
  await expect(hero).not.toContainText(/CARB|German Technology|Certified Materials/i);
});

test('content stays visible with reduced motion', async ({browser}) => {
  const ctx = await browser.newContext({reducedMotion: 'reduce'});
  const page = await ctx.newPage();
  await page.goto('/');
  const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((e) => getComputedStyle(e).opacity === '0').length);
  expect(hidden).toBe(0);
  await ctx.close();
});

test('content is visible without JavaScript', async ({browser}) => {
  const ctx = await browser.newContext({javaScriptEnabled: false});
  const page = await ctx.newPage();
  await page.goto('/');
  const hidden = await page.evaluate(() => [...document.querySelectorAll('[data-reveal], .hero-in')].filter((e) => getComputedStyle(e).opacity === '0').length);
  expect(hidden).toBe(0);
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
  await ctx.close();
});

test('scroll reveals resolve when scrolling fast', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  const stuck = await page.evaluate(() => [...document.querySelectorAll('[data-reveal]')].filter((e) => !e.classList.contains('is-in')).length);
  expect(stuck).toBe(0);
});
