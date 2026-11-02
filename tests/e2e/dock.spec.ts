import {test, expect, type Page} from '@playwright/test';

// Floating control stack: ONE dock (WhatsApp + assistant). It must stay inside
// the viewport, never overlap the header, step aside at the footer and in-page
// product CTA, while typing, and while the menu/assistant is open. On desktop
// it lives in the reserved side gutter: it must not overlap any content box.
const dock = (p: Page) => p.getByTestId('contact-dock');
const isHidden = (p: Page) => dock(p).evaluate((el) => el.getAttribute('data-hidden') === '1');

test('dock visible and inside the viewport on load', async ({page}) => {
  await page.goto('/');
  await page.waitForTimeout(400);
  expect(await isHidden(page)).toBe(false);
  const box = await dock(page).boundingBox();
  const vp = page.viewportSize()!;
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width + 0.5);
  expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height + 0.5);
});

test('dock steps aside at the footer', async ({page}) => {
  await page.goto('/about');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  expect(await isHidden(page)).toBe(true);
});

test('dock steps aside for the product enquiry box', async ({page}) => {
  await page.goto('/products/plywood/boiling-water-proof/duroply-bwp-boiling-water-proof-plywood');
  await page.getByTestId('enquiry-box').scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const el = document.querySelector('[data-testid="enquiry-box"]')!;
    const r = el.getBoundingClientRect();
    window.scrollBy(0, r.bottom - innerHeight + 10);
  });
  await page.waitForTimeout(500);
  expect(await isHidden(page)).toBe(true);
});

test('dock hides while typing in a form', async ({page}) => {
  await page.goto('/contact');
  await page.locator('input[name="name"]').focus();
  await page.waitForTimeout(400);
  expect(await isHidden(page)).toBe(true);
});

test('desktop dock never overlaps content while scrolling', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  for (const w of [1024, 1280, 1440]) {
    await page.setViewportSize({width: w, height: 900});
    await page.goto('/');
    for (let y = 0; y < 6000; y += 700) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(120);
      const hits = await page.evaluate(() => {
        const d = document.querySelector('[data-testid="contact-dock"]')!;
        if (d.getAttribute('data-hidden') === '1') return [];
        const r = d.getBoundingClientRect();
        const out: string[] = [];
        document.querySelectorAll('main h1, main h2, main h3, main p, main a, main button, main img, main li').forEach((el) => {
          if (el.closest('[aria-hidden="true"],.marquee')) return;
          const b = el.getBoundingClientRect();
          if (b.width < 2 || b.height < 2) return;
          if (b.left < r.right && b.right > r.left && b.top < r.bottom && b.bottom > r.top) out.push(el.tagName + ' ' + (el.textContent || '').trim().slice(0, 30));
        });
        return out;
      });
      expect(hits, `@${w} y=${y}`).toEqual([]);
    }
  }
});

test('assistant opens from the dock and the dock hides', async ({page}) => {
  await page.goto('/');
  const launcher = page.getByTestId(page.viewportSize()!.width < 768 ? 'assistant-launcher' : 'assistant-launcher-desktop');
  await launcher.click();
  await expect(page.getByRole('dialog').first()).toBeVisible();
  await page.waitForTimeout(400);
  expect(await isHidden(page)).toBe(true);
});
