import {test, expect} from '@playwright/test';
import {hydrated} from './helpers';

const decode = (href: string | null) => decodeURIComponent(new URL(href!).searchParams.get('text') ?? '');

test('product page WhatsApp carries product (and selected size)', async ({page}) => {
  await page.goto('/products/plywood/boiling-water-proof/duroply-bwp-boiling-water-proof-plywood');
  const cta = page.getByTestId('product-whatsapp');
  expect(await cta.getAttribute('href')).toContain('wa.me/918320052838');
  expect(decode(await cta.getAttribute('href'))).toContain('Duroply BWP Boiling Water Proof Plywood');
  await page.getByRole('button', {name: '12 mm'}).click();
  expect(decode(await cta.getAttribute('href'))).toContain('— 12 MM');
});

test('floating dock WhatsApp is contextual on product pages', async ({page}) => {
  await page.goto('/products/mdf/hdhmr/action-tesa-hdhmr-board');
  await page.waitForTimeout(300);
  const id = page.viewportSize()!.width < 768 ? 'dock-whatsapp' : 'dock-whatsapp-desktop';
  expect(decode(await page.getByTestId(id).getAttribute('href'))).toContain('Action TESA HDHMR Board');
});

test('contact form: success only after API ok, honest copy, structured fields', async ({page}) => {
  let body: Record<string, string> = {};
  await page.route('**/api/lead', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({json: {ok: true, id: 'L-TEST', email: 'sent'}});
  });
  await page.goto('/contact?product=Duroply%20BWP%20Boiling%20Water%20Proof%20Plywood');
  await hydrated(page);
  await page.locator('input[name="name"]').fill('QA Test');
  await page.locator('input[name="phone"]').fill('+91 90000 00000');
  await page.locator('input[name="email"]').fill('qa@example.com');
  await page.locator('input[name="quantity"]').fill('20 sheets');
  await page.getByRole('button', {name: 'Send enquiry'}).click();
  await expect(page.getByTestId('lead-success')).toContainText('Enquiry sent to the team.');
  await expect(page.getByTestId('lead-success')).toContainText('L-TEST');
  expect(body).toMatchObject({email: 'qa@example.com', product: 'Duroply BWP Boiling Water Proof Plywood', quantity: '20 sheets', source: 'contact-form'});
  expect(body.page).toContain('/contact');
  await expect(page.getByTestId('lead-success')).not.toContainText(/same day|24 hours/i);
});

test('contact form: email not delivered → "received", never "sent to the team"', async ({page}) => {
  await page.route('**/api/lead', (r) => r.fulfill({json: {ok: true, id: 'L-X', email: 'failed'}}));
  await page.goto('/contact');
  await hydrated(page);
  await page.locator('input[name="name"]').fill('QA');
  await page.locator('input[name="phone"]').fill('9000000000');
  await page.locator('input[name="email"]').fill('qa@example.com');
  await page.getByRole('button', {name: 'Send enquiry'}).click();
  await expect(page.getByTestId('lead-success')).toContainText('Enquiry received.');
  await expect(page.getByTestId('lead-success')).not.toContainText('sent to the team');
});

test('product enquiry: selected size flows into WhatsApp AND the written enquiry', async ({page}) => {
  let body: Record<string, string> = {};
  await page.route('**/api/lead', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({json: {ok: true, id: 'L-P', email: 'sent'}});
  });
  await page.goto('/products/mdf/hdhmr/action-tesa-hdhmr-board');
  await hydrated(page);
  await page.getByRole('button', {name: '18 mm'}).click();
  expect(decode(await page.getByTestId('product-whatsapp').getAttribute('href'))).toContain('Action TESA HDHMR Board — 18 MM');
  await page.getByRole('link', {name: 'Send a written enquiry'}).click();
  await expect(page).toHaveURL(/\/contact\?/);
  await hydrated(page);
  await expect(page.locator('select[name="product"]')).toHaveValue('Action TESA HDHMR Board');
  await expect(page.locator('input[name="size"]')).toHaveValue('18 MM');
  await page.locator('input[name="name"]').fill('QA');
  await page.locator('input[name="phone"]').fill('9000000000');
  await page.locator('input[name="email"]').fill('qa@example.com');
  await page.getByRole('button', {name: 'Send enquiry'}).click();
  await expect(page.getByTestId('lead-success')).toBeVisible();
  expect(body).toMatchObject({product: 'Action TESA HDHMR Board', size: '18 MM'});
});

test('homepage enquiry paths carry context (hero, selector, footer)', async ({page}) => {
  await page.goto('/');
  await hydrated(page);
  const hrefs = await page.locator('a[href*="wa.me/918320052838"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  expect(hrefs.length).toBeGreaterThan(5);
  const texts = hrefs.map(decode);
  expect(texts.some((t) => t.includes("interested in your products"))).toBe(true);
  expect(texts.some((t) => t.includes('material supply for a project'))).toBe(true);
  expect(texts.some((t) => t.includes('Duroply BWP Boiling Water Proof Plywood'))).toBe(true);
});

test('contact form: no success state when the API fails', async ({page}) => {
  await page.route('**/api/lead', (route) => route.fulfill({status: 500, json: {ok: false}}));
  await page.route('mailto:*', (route) => route.abort());
  await page.goto('/contact');
  await page.locator('input[name="name"]').fill('QA');
  await page.locator('input[name="phone"]').fill('9000000000');
  await page.locator('input[name="email"]').fill('qa@example.com');
  await page.getByRole('button', {name: 'Send enquiry'}).click();
  await page.waitForTimeout(500);
  await expect(page.getByTestId('lead-success')).toHaveCount(0);
});

test('contact form: required fields block submission', async ({page}) => {
  let called = false;
  await page.route('**/api/lead', (r) => {
    called = true;
    return r.fulfill({json: {ok: true}});
  });
  await page.goto('/contact');
  await page.getByRole('button', {name: 'Send enquiry'}).click();
  await page.waitForTimeout(300);
  expect(called).toBe(false);
});

test('material selector routes to real products and a prefilled WhatsApp', async ({page}) => {
  await page.goto('/tools/material-selector');
  await hydrated(page);
  const sel = page.locator('#selector');
  await sel.getByRole('button', {name: 'Bathroom & humid areas'}).click();
  await sel.getByRole('button', {name: 'Covered balcony / semi-outdoor'}).click();
  await expect(sel.getByRole('link', {name: 'Exterior Grade MDF', exact: true})).toBeVisible();
  const href = await sel.getByRole('link', {name: /Get price for this selection/}).getAttribute('href');
  expect(decode(href)).toContain('Exterior Grade MDF');
  expect(decode(href)).toContain('Material Selector');
});

test('compare shows only shared verified rows', async ({page}) => {
  await page.goto('/tools/compare');
  await hydrated(page);
  const c = page.locator('#compare');
  await expect(c.getByRole('row', {name: /Bonding resin/})).toBeVisible();
  await c.getByLabel('Product B').selectOption('action-tesa-hdhmr-board');
  // MR has no stored density and HDHMR no stored resin → neither row may appear.
  await expect(c.getByRole('rowheader', {name: 'Density', exact: true})).toHaveCount(0);
  await expect(c.getByRole('rowheader', {name: 'Bonding resin', exact: true})).toHaveCount(0);
  await expect(c.getByRole('rowheader', {name: 'Brand', exact: true})).toHaveCount(1);
});
