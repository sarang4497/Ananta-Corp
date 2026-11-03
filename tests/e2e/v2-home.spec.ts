import {test, expect} from '@playwright/test';
import {hydrated} from './helpers';
import {assertNoMeaningfulOverflow, revealWholePage} from './overflow-guard';

const SECTIONS = ['hero-title', 'range-title', 'aud-title', 'featured-title', 'tech-title', 'brands-title', 'tools-demo-title', 'ops-title', 'why-title', 'toolkit-title', 'voices-title', 'faq-title', 'quote-title'];

test('homepage renders every V2 section with one h1', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  for (const id of SECTIONS) await expect(page.locator(`section[aria-labelledby="${id}"]`), id).toHaveCount(1);
  await expect(page.locator('#selector')).toHaveCount(1);
  await expect(page.locator('#compare')).toHaveCount(1);
  const hero = page.locator('section[aria-labelledby="hero-title"]');
  await expect(hero.getByRole('link', {name: /Explore products/})).toBeVisible();
  const wa = await hero.getByTestId('hero-whatsapp').getAttribute('href');
  expect(decodeURIComponent(wa!)).toContain('Home hero');
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join('')).toContain('"FAQPage"');
  expect(ld.join('')).not.toMatch(/aggregateRating|ratingValue/);
});

test('audience tabs: click + keyboard arrows', async ({page}) => {
  await page.goto('/');
  await hydrated(page);
  const list = page.getByRole('tablist', {name: 'Choose your role'});
  const tabs = list.getByRole('tab');
  await expect(tabs).toHaveCount(6);
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  await tabs.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(tabs.nth(5)).toHaveAttribute('aria-selected', 'true');
  const panel = page.getByRole('tabpanel');
  await expect(panel).toHaveCount(1);
  await expect(panel).toHaveAttribute('id', (await tabs.nth(5).getAttribute('aria-controls'))!);
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('link', {name: /Get a quote on WhatsApp/})).toBeVisible();
  await tabs.nth(3).click();
  await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
});

test('FAQ: one open at a time, aria-expanded toggles', async ({page}) => {
  await page.goto('/');
  await hydrated(page);
  const faq = page.locator('#faq');
  const btns = faq.locator('button[aria-expanded]');
  await expect(btns.first()).toHaveAttribute('aria-expanded', 'true');
  await btns.nth(2).scrollIntoViewIfNeeded();
  await btns.nth(2).click();
  await expect(btns.nth(2)).toHaveAttribute('aria-expanded', 'true');
  await expect(btns.first()).toHaveAttribute('aria-expanded', 'false');
  await btns.nth(2).click();
  await expect(btns.nth(2)).toHaveAttribute('aria-expanded', 'false');
});

test('contact prefill from quote context', async ({page}) => {
  await page.goto('/contact?product=Action%20TESA%20HDHMR%20Board&size=18%20MM&finish=3009&city=Surat&source=Product%20page');
  await hydrated(page);
  await expect(page.locator('select[name="product"]')).toHaveValue('Action TESA HDHMR Board');
  await expect(page.locator('input[name="size"]')).toHaveValue('18 MM');
  await expect(page.locator('input[name="finish"]')).toHaveValue('3009');
  await expect(page.locator('input[name="city"]')).toHaveValue('Surat');
  const summary = page.getByTestId('quote-summary');
  await expect(summary).toContainText('Your request');
  await expect(summary).toContainText('18 MM');
  await expect(summary).toContainText('Product page');
  await expect(page.getByRole('link', {name: /Open in Google Maps/}).first()).toHaveAttribute('href', /google\.com\/maps/);
});

test('contact without context shows no summary', async ({page}) => {
  await page.goto('/contact');
  await hydrated(page);
  await expect(page.getByTestId('lead-form')).toBeVisible();
  await expect(page.getByTestId('quote-summary')).toHaveCount(0);
});

for (const w of [320, 390, 768, 1280]) {
  test(`home + about + contact: no meaningful overflow at ${w}px`, async ({page}) => {
    test.skip(test.info().project.name !== 'desktop', 'width sweep runs once');
    await page.setViewportSize({width: w, height: 900});
    for (const r of ['/', '/about', '/contact', '/partners']) {
      await page.goto(r);
      await revealWholePage(page);
      await assertNoMeaningfulOverflow(page, `${r} @${w}`);
    }
  });
}
