import {test, expect} from '@playwright/test';
import {hydrated} from './helpers';
import {assertNoMeaningfulOverflow} from './overflow-guard';

test('search finds BWP → Duroply BWP product', async ({page}) => {
  await page.goto('/');
  await hydrated(page);
  const desktop = page.viewportSize()!.width >= 1080;
  await page.getByTestId(desktop ? 'search-trigger' : 'search-trigger-mobile').click();
  const dialog = page.getByTestId('search-dialog');
  await expect(dialog).toBeVisible();
  await page.getByTestId('search-input').fill('BWP');
  const first = dialog.getByRole('option').first();
  await expect(first).toContainText('Duroply BWP Boiling Water Proof Plywood');
  await expect(first).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/products\/plywood\/boiling-water-proof\/duroply-bwp-boiling-water-proof-plywood$/);
  await expect(dialog).toBeHidden();
});

test('⌘K / Ctrl-K and "/" open search; Escape closes; arrows move', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/products');
  await hydrated(page);
  await page.keyboard.press('ControlOrMeta+k');
  const dialog = page.getByTestId('search-dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId('search-input')).toBeFocused();
  await page.getByTestId('search-input').fill('mdf');
  await page.keyboard.press('ArrowDown');
  await expect(dialog.getByRole('option').nth(1)).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await page.locator('body').click({position: {x: 5, y: 400}});
  await page.keyboard.press('/');
  await expect(dialog).toBeVisible();
  // empty state shows popular chips
  await expect(dialog.getByRole('button', {name: 'HDHMR'})).toBeVisible();
});

test('search dialog: no results → ask the assistant with the query', async ({page}) => {
  await page.goto('/');
  await hydrated(page);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('open-search', {detail: {q: 'zzqx'}})));
  await expect(page.getByTestId('search-empty')).toBeVisible();
  await page.getByTestId('search-ask').click();
  await expect(page.getByTestId('search-dialog')).toBeHidden();
  await expect(page.getByRole('dialog').first()).toBeVisible();
});

test('search dialog has no overflow', async ({page}) => {
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({width, height: width < 800 ? 844 : 900});
    await page.goto('/');
    await hydrated(page);
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('open-search', {detail: {q: 'board'}})));
    await expect(page.getByTestId('search-dialog')).toBeVisible();
    await assertNoMeaningfulOverflow(page, `search @${width}`);
  }
});

test('mobile bottom utility: five actions work', async ({page}, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/about');
  await hydrated(page);
  const dock = page.getByTestId('contact-dock');
  const box = (await dock.boundingBox())!;
  expect(box.height).toBeLessThanOrEqual(64 + 1);
  await expect(dock.getByTestId('dock-whatsapp')).toHaveAttribute('href', /wa\.me\/918320052838/);
  await dock.getByTestId('dock-products').click();
  await expect(page).toHaveURL(/\/products$/);
  await expect(dock.getByTestId('dock-products')).toHaveAttribute('aria-current', 'page');
  await dock.getByTestId('dock-search').click();
  await expect(page.getByTestId('search-dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('search-dialog')).toBeHidden();
  await dock.getByTestId('dock-home').click();
  await expect(page).toHaveURL(/\/$/);
  await dock.getByTestId('assistant-launcher').click();
  await expect(page.getByRole('dialog').first()).toBeVisible();
});

test('header: Get Price uses the quote builder; utility bar facts', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await hydrated(page);
  const href = await page.getByTestId('header-get-price').getAttribute('href');
  expect(decodeURIComponent(href!)).toContain('(Sent from: Header)');
  const header = page.getByTestId('site-header');
  await expect(header).toContainText('24ACDFA7104Q1ZB');
  await expect(header).toContainText('Ahmedabad, Gujarat');
});
