import {test, expect, type Page} from '@playwright/test';
import {hydrated} from './helpers';
import {assertNoMeaningfulOverflow, revealWholePage} from './overflow-guard';

const decode = (href: string | null) => new URL(href!).searchParams.get("text") ?? "";
/** Let in-flight swatch image requests finish before navigating away (aborting them mid-optimisation can stall `next start`). */
const settle = (page: Page) => page.waitForLoadState('networkidle').catch(() => {});
const TOOL_PAGES = ['/tools/material-selector', '/tools/compare', '/tools/requirement-builder', '/tools/sheet-calculator'];

test('tools hub lists every tool and links to it', async ({page}) => {
  await page.goto('/tools');
  await expect(page.locator('h1')).toHaveCount(1);
  for (const name of ['Material Selector', 'Board Comparison', 'Requirement Builder', 'Sheet Quantity Helper', 'Finish Explorer'])
    await expect(page.getByRole('link', {name, exact: true}).first()).toBeVisible();
  await expect(page.getByRole('link', {name: 'Finish Explorer', exact: true}).first()).toHaveAttribute('href', /\/decor$/);
});

for (const path of TOOL_PAGES) {
  test(`${path}: one h1, breadcrumb, FAQ, related tools, canonical`, async ({page}) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('navigation', {name: 'Breadcrumb'}).getByRole('link', {name: 'Tools'})).toBeVisible();
    await expect(page.locator('details summary').first()).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Related tools'})).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path}$`));
  });
}

test('unknown tool → 404', async ({page}) => {
  const res = await page.goto('/tools/not-a-tool');
  expect(res?.status()).toBe(404);
});

test('compare: URL state, swap, copy link, Get price per product', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await page.goto('/tools/compare?a=action-tesa-hdhmr-board&b=action-tesa-interior-grade-mdf');
  await hydrated(page);
  const c = page.locator('#compare');
  await expect(c.getByLabel('Product A')).toHaveValue('action-tesa-hdhmr-board');
  await expect(c.getByLabel('Product B')).toHaveValue('action-tesa-interior-grade-mdf');
  expect((await c.getByRole('row').count()) - 1).toBeGreaterThanOrEqual(4);

  await c.getByRole('button', {name: 'Swap products A and B'}).click();
  await expect(c.getByLabel('Product A')).toHaveValue('action-tesa-interior-grade-mdf');
  await expect(page).toHaveURL(/a=action-tesa-interior-grade-mdf&b=action-tesa-hdhmr-board/);

  await c.getByLabel('Product B').selectOption('duroply-bwp-boiling-water-proof-plywood');
  await expect(page).toHaveURL(/b=duroply-bwp-boiling-water-proof-plywood/);

  const prices = c.getByRole('link', {name: /Get price for .* on WhatsApp/});
  await expect(prices).toHaveCount(2);
  const msg = decode(await prices.nth(1).getAttribute('href'));
  expect(msg).toContain('Duroply BWP Boiling Water Proof Plywood');
  expect(msg).toContain('Board Comparison');

  await c.getByRole('button', {name: 'Copy link'}).click();
  await expect(c.getByRole('button', {name: 'Link copied'})).toBeVisible();
});

test('compare: a lone ?a= gets a valid partner; bad slugs fall back', async ({page}) => {
  await page.goto('/tools/compare?a=action-tesa-hdhmr-board');
  await hydrated(page);
  const c = page.locator('#compare');
  await expect(c.getByLabel('Product A')).toHaveValue('action-tesa-hdhmr-board');
  await expect(c.getByLabel('Product B')).not.toHaveValue('action-tesa-hdhmr-board');
  await page.goto('/tools/compare?a=nope&b=nope');
  await hydrated(page);
  await expect(page.locator('#compare').getByRole('rowheader', {name: 'Brand', exact: true})).toHaveCount(1);
});

test('material selector: compare these two goes to a shareable comparison', async ({page}) => {
  await page.goto('/tools/material-selector');
  await hydrated(page);
  const sel = page.locator('#selector');
  await sel.getByRole('button', {name: 'Carcass', exact: true}).click();
  await sel.getByRole('link', {name: 'Compare these two'}).click();
  await expect(page).toHaveURL(/\/tools\/compare\?a=[^&]+&b=/);
  await hydrated(page);
  expect(await page.locator('#compare').getByRole('row').count()).toBeGreaterThan(4);
});

test('requirement builder: WhatsApp + enquiry carry project, material, quantity, city', async ({page}) => {
  await page.goto('/tools/requirement-builder');
  await hydrated(page);
  await page.getByRole('button', {name: /^Kitchen/}).click();
  // Doors-only categories must not be offered for a kitchen.
  await expect(page.getByRole('button', {name: 'Flush Doors', exact: true})).toHaveCount(0);
  await page.getByRole('button', {name: 'Plywood', exact: true}).click();
  await page.getByLabel(/Requirement/).fill('18 mm for carcass');
  await page.getByLabel('Quantity').fill('40');
  await page.getByLabel('City').fill('Ahmedabad');
  const wa = page.getByTestId('rb-whatsapp');
  const msg = decode(await wa.getAttribute('href'));
  expect(msg).toContain('Category: Plywood');
  expect(msg).toContain('Quantity: 40 sheets');
  expect(msg).toContain('City: Ahmedabad');
  expect(msg).toContain('Requirement: Kitchen — 18 mm for carcass');
  expect(msg).toContain('Requirement Builder');
  expect(msg).not.toMatch(/₹|in stock|delivery in/i);
  const enquiry = await page.getByTestId('rb-enquiry').getAttribute('href');
  expect(enquiry).toContain('/contact?');
  expect(enquiry).toContain('city=Ahmedabad');
  expect(enquiry).toContain('source=Requirement+Builder');
  await expect(page.getByRole('link', {name: 'Duroply BWP Plywood'})).toBeVisible();
});

test('requirement builder: doors default the unit to doors', async ({page}) => {
  await page.goto('/tools/requirement-builder');
  await hydrated(page);
  await page.getByRole('button', {name: /^Doors/}).click();
  await page.getByRole('button', {name: 'Flush Doors', exact: true}).click();
  await page.getByLabel('Quantity').fill('12');
  expect(decode(await page.getByTestId('rb-whatsapp').getAttribute('href'))).toContain('Quantity: 12 doors');
});

test('sheet helper: pieces in ft and mm, wastage, quote context', async ({page}) => {
  await page.goto('/tools/sheet-calculator');
  await hydrated(page);
  await page.getByLabel('Piece 1 length in ft').fill('8');
  await page.getByLabel('Piece 1 width in ft').fill('4');
  await page.getByLabel('Piece 1 quantity').fill('10');
  // 320 sq ft × 1.10 / 32 = 11
  await expect(page.getByTestId('sheet-count')).toHaveText('11');
  await expect(page.getByTestId('sheet-area')).toContainText('320 sq ft');
  await page.getByLabel('Wastage %').fill('0');
  await expect(page.getByTestId('sheet-count')).toHaveText('10');
  await expect(page.getByText(/not a cutting plan; confirm with your carpenter\/fabricator/)).toBeVisible();

  await page.getByRole('button', {name: 'mm', exact: true}).click();
  await page.getByLabel('Piece 1 length in mm').fill('600');
  await page.getByLabel('Piece 1 width in mm').fill('400');
  await page.getByLabel('Piece 1 quantity').fill('20');
  // 0.6 × 0.4 m × 20 = 4.8 m² ≈ 51.67 sq ft → 2 sheets
  await expect(page.getByTestId('sheet-count')).toHaveText('2');

  await page.getByLabel(/^Board/).selectOption({label: 'HDHMR Board'});
  await page.getByLabel(/^Thickness/).selectOption('18 MM');
  const msg = decode(await page.getByTestId('sheet-whatsapp').getAttribute('href'));
  expect(msg).toContain('Action TESA HDHMR Board');
  expect(msg).toContain('Quantity: 2 sheets of 8 × 4 ft');
  expect(msg).toContain('Size / thickness: 18 MM');
  expect(msg).toContain('Sheet Quantity Helper');
});

test('sheet helper: total area mode', async ({page}) => {
  await page.goto('/tools/sheet-calculator');
  await hydrated(page);
  await page.getByRole('button', {name: 'Total area'}).click();
  await page.getByLabel('Total panel area').fill('100');
  await expect(page.getByTestId('sheet-count')).toHaveText('4');
});

test('décor: unique codes, enlarge dialog (Escape, next), shortlist → WhatsApp', async ({page}) => {
  await page.goto('/decor');
  await hydrated(page);
  await page.evaluate(() => localStorage.removeItem('ananta:decor-shortlist'));
  await settle(page);
  await page.reload();
  await hydrated(page);
  await expect(page.getByRole('button', {name: /^Enlarge 1141 /})).toHaveCount(1);
  await expect(page.getByRole('heading', {name: /^Woodgrains/})).toBeVisible();

  await page.getByRole('button', {name: 'Enlarge 1104 Silver Grey'}).click();
  const dialog = page.getByTestId('decor-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', {name: 'Close'})).toBeFocused();
  await dialog.getByRole('button', {name: 'Add to shortlist'}).click();
  await dialog.getByRole('button', {name: 'Next décor'}).click();
  await expect(dialog.getByRole('heading')).not.toContainText('1104');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('button', {name: 'Enlarge 1104 Silver Grey'})).toBeFocused();

  await page.getByRole('button', {name: 'Add 3009 Classic Planked Walnut to shortlist'}).click();
  const tray = page.getByTestId('decor-shortlist');
  await expect(tray).toContainText('2/12');
  const msg = decode(await page.getByTestId('decor-shortlist-whatsapp').getAttribute('href'));
  expect(msg).toContain('Action TESA prelam particle board');
  expect(msg).toContain('1104 Silver Grey');
  expect(msg).toContain('3009 Classic Planked Walnut');
  expect(msg).toContain('Finish Explorer');

  await settle(page);
  await page.reload();
  await hydrated(page);
  await expect(page.getByTestId('decor-shortlist')).toContainText('2/12');
});

test('décor deep links still filter', async ({page}) => {
  await page.goto('/decor?type=stone');
  await hydrated(page);
  await expect(page.getByRole('button', {name: /^Stone & marble/})).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('heading', {name: /^Woodgrains/})).toHaveCount(0);
  await settle(page);
  await page.goto('/decor?q=walnut');
  await hydrated(page);
  await expect(page.getByRole('searchbox')).toHaveValue('walnut');
});

async function interact(page: Page, path: string) {
  if (path.includes('requirement')) {
    await page.getByRole('button', {name: /^Office/}).click();
    await page.getByRole('button', {name: 'Pre-Laminated Particle Board', exact: true}).click().catch(() => {});
  }
}

test.describe('no clipping on tool pages', () => {
  test.skip(({isMobile}) => !!isMobile, 'width sweep runs once');
  for (const path of ['/tools', ...TOOL_PAGES, '/decor'])
    test(`${path} at 320/390/768/1280`, async ({page}) => {
      for (const width of [320, 390, 768, 1280]) {
        await page.setViewportSize({width, height: 900});
        await page.goto(path);
        await hydrated(page);
        await interact(page, path);
        await revealWholePage(page);
        await assertNoMeaningfulOverflow(page, `${path} @${width}`);
        await settle(page);
      }
    });
});
