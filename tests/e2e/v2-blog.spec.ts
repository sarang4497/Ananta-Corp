import {test, expect} from '@playwright/test';
import {hydrated} from './helpers';
import {findMeaningfulOverflow} from './overflow-guard';

test.describe('blog hub', () => {
  test('lists posts with a featured guide and cross-links', async ({page}) => {
    await page.goto('/blog');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('[data-featured-post]')).toHaveCount(1);
    const cards = page.locator('[data-blog-grid] [data-post-card]');
    expect(await cards.count()).toBeGreaterThanOrEqual(8);
    await expect(page.locator('[data-post-card="mdf-vs-plywood"]').first()).toBeVisible();
    await expect(page.locator('a[href="/tools"]').first()).toBeAttached();
    await expect(page.locator('a[href="/products"]').first()).toBeAttached();
  });

  test('category filter narrows the grid and syncs the URL', async ({page}) => {
    await page.goto('/blog');
    await hydrated(page);
    const cards = page.locator('[data-blog-grid] [data-post-card]');
    const total = await cards.count();
    const chip = page.locator('button[data-category="comparisons"]');
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await expect(page).toHaveURL(/\?category=comparisons/);
    const filtered = await cards.count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(total);
    await expect(page.locator('[data-blog-grid] [data-post-card="mdf-vs-plywood"]')).toBeVisible();

    await page.goto('/blog?category=smart-locks');
    await hydrated(page);
    await expect(page.locator('button[data-category="smart-locks"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(cards).toHaveCount(1);
  });
});

test.describe('blog post', () => {
  test('mdf-vs-plywood renders TOC, table, products, FAQ, JSON-LD', async ({page, isMobile}) => {
    const res = await page.goto('/blog/mdf-vs-plywood');
    expect(res!.status()).toBe(200);
    await hydrated(page);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('MDF vs Plywood');

    if (isMobile) {
      await page.locator('[data-toc-mobile] summary').click();
      await expect(page.locator('[data-toc-mobile] a[href="#side-by-side"]')).toBeVisible();
    } else {
      await expect(page.locator('[data-toc] a[href="#side-by-side"]')).toBeVisible();
    }
    await expect(page.locator('h2#side-by-side')).toBeAttached();

    const table = page.locator('[data-post-body] table').first();
    await expect(table).toBeAttached();
    const scroller = page.locator('[data-post-body] [role="region"]').first();
    expect(await scroller.evaluate((el) => getComputedStyle(el).overflowX)).toBe('auto');

    expect(await page.locator('[data-products-block] article').count()).toBeGreaterThan(0);
    await expect(page.locator('[data-callout="general"]').first()).toContainText('General guidance');
    await expect(page.locator('[data-callout="ananta"]').first()).toContainText('From the Ananta catalogue');

    const faq = page.locator('[data-post-faq] details').first();
    await faq.locator('summary').click();
    await expect(faq).toHaveAttribute('open', '');

    const quote = page.locator('[data-quote-cta]');
    expect(decodeURIComponent((await quote.getAttribute('href')) ?? '')).toContain('Guide: MDF vs Plywood');

    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = ld.flatMap((t) => {
      const j = JSON.parse(t);
      return (Array.isArray(j) ? j : [j]).map((x) => x['@type']).flat();
    });
    expect(types).toContain('Article');
    expect(types).toContain('FAQPage');
    expect(types).toContain('BreadcrumbList');

    expect(await page.locator('meta[property="og:type"]').getAttribute('content')).toBe('article');
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe('https://www.anantacorporation.com/blog/mdf-vs-plywood');
  });

  test('unknown slug is a 404', async ({page}) => {
    const res = await page.goto('/blog/not-a-real-post');
    expect(res!.status()).toBe(404);
  });

  for (const w of [320, 375, 768, 1280]) {
    test(`no clipping at ${w}px`, async ({page}) => {
      await page.setViewportSize({width: w, height: 900});
      for (const r of ['/blog', '/blog/mdf-vs-plywood', '/blog/smart-locks-for-interior-projects']) {
        await page.goto(r);
        await hydrated(page);
        await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')));
        expect(await findMeaningfulOverflow(page), `${r} @ ${w}`).toEqual([]);
      }
    });
  }
});
