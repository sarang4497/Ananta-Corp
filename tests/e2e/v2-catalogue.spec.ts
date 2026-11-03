import {test, expect} from '@playwright/test';
import {hydrated} from './helpers';
import {PRODUCTS} from '../../src/data/products';

const waText = (href: string | null) => decodeURIComponent(new URL(href!).searchParams.get('text') ?? '');
const HDHMR = '/products/mdf/hdhmr/action-tesa-hdhmr-board';

test('product page shows verified USPs and spec blocks', async ({page}) => {
  await page.goto(HDHMR);
  const usps = page.getByTestId('product-usps');
  await expect(usps).toBeVisible();
  await expect(usps).toContainText('Over 850 kg/m³');
  await expect(usps.locator('li')).toHaveCount(4);
  const blocks = page.getByTestId('spec-blocks');
  await expect(blocks).toContainText('Thickness');
  await expect(blocks).toContainText('3–25 mm');
  await expect(blocks).toContainText('Density');
  // No empty placeholder blocks.
  for (const v of await blocks.locator('li').allInnerTexts()) expect(v.trim().split('\n').length).toBeGreaterThan(1);
});

test('size, quantity and city flow into WhatsApp and the written enquiry', async ({page}) => {
  await page.goto(HDHMR);
  await hydrated(page);
  await page.getByRole('button', {name: '18 mm'}).click();
  await page.getByTestId('enquiry-quantity').fill('40 sheets');
  await page.getByTestId('enquiry-city').fill('Surat');

  const wa = waText(await page.getByTestId('product-whatsapp').getAttribute('href'));
  expect(wa).toContain('Action TESA HDHMR Board — 18 MM');
  expect(wa).toContain('Size / thickness: 18 MM');
  expect(wa).toContain('Quantity: 40 sheets');
  expect(wa).toContain('City: Surat');
  expect(wa).toContain('Product page');

  const href = await page.getByTestId('product-enquiry').getAttribute('href');
  const q = new URL(href!, 'http://x').searchParams;
  expect(new URL(href!, 'http://x').pathname).toBe('/contact');
  expect(q.get('product')).toBe('Action TESA HDHMR Board');
  expect(q.get('size')).toBe('18 MM');
  expect(q.get('quantity')).toBe('40 sheets');
  expect(q.get('city')).toBe('Surat');
  expect(q.get('source')).toBe('Product page');
});

test('compare link carries a=slug', async ({page}) => {
  await page.goto(HDHMR);
  const href = await page.getByTestId('product-compare').getAttribute('href');
  const u = new URL(href!, 'http://x');
  expect(u.pathname).toBe('/tools/compare');
  expect(u.searchParams.get('a')).toBe('action-tesa-hdhmr-board');
});

test('smart lock shows only existing data plus "Specs on request"', async ({page}) => {
  await page.goto('/products/smart-locks/locks/wifi-smart-door-lock');
  await expect(page.getByTestId('product-usps')).toContainText('Specs on request');
  await expect(page.getByTestId('product-compare')).toHaveCount(0);
});

test('catalogue filter ?app=kitchens works', async ({page}) => {
  const expected = PRODUCTS.filter((p) => p.applications.includes('kitchens'));
  await page.goto('/products?app=kitchens');
  await hydrated(page);
  await expect(page.getByTestId('result-count')).toContainText(`${expected.length} of ${PRODUCTS.length}`);
  const grid = page.getByTestId('catalog-grid');
  await expect(grid.locator('article')).toHaveCount(expected.length);
  for (const p of expected) await expect(grid.getByRole('heading', {name: p.name})).toBeVisible();
  expect(page.url()).toContain('app=kitchens');
});

test('product cards show full names, USP chips and three actions', async ({page}) => {
  await page.goto('/products/plywood');
  const card = page.locator('article', {has: page.getByRole('heading', {name: 'Duroply BWP Boiling Water Proof Plywood'})});
  await expect(card.getByRole('list', {name: 'Key attributes'})).toContainText('IS 710');
  await expect(card.getByRole('link', {name: /^Details/})).toBeVisible();
  const cmp = await card.getByRole('link', {name: /^Compare/}).getAttribute('href');
  expect(cmp).toContain('a=duroply-bwp-boiling-water-proof-plywood');
  expect(waText(await card.getByRole('link', {name: /Get price/}).getAttribute('href'))).toContain('Product card');
});

test('category page key-attribute tabs are keyboard operable', async ({page}) => {
  await page.goto('/products/mdf');
  await hydrated(page);
  const tabs = page.getByTestId('usp-tabs').getByRole('tab');
  await expect(tabs).toHaveCount(3);
  await tabs.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('Exterior Grade MDF');
});

test('phones: Filters sheet opens and applies a facet', async ({page}, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/products');
  await hydrated(page);
  await page.getByTestId('filters-toggle').click();
  const sheet = page.getByTestId('filters-sheet');
  await expect(sheet).toBeVisible();
  await sheet.getByRole('button', {name: /^Kitchens/}).click();
  await sheet.getByRole('button', {name: /^Show \d+ product/}).click();
  await expect(sheet).toBeHidden();
  expect(page.url()).toContain('app=kitchens');
});
