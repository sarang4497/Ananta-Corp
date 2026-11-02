import {test, expect} from '@playwright/test';

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

test('contact form: success only after API ok, honest copy', async ({page}) => {
  let body: Record<string, string> = {};
  await page.route('**/api/lead', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({json: {ok: true}});
  });
  await page.goto('/contact?product=Duroply%20BWP%20Boiling%20Water%20Proof%20Plywood');
  await page.locator('input[name="name"]').fill('QA Test');
  await page.locator('input[name="phone"]').fill('+91 90000 00000');
  await page.locator('input[name="email"]').fill('qa@example.com');
  await page.locator('input[name="quantity"]').fill('20 sheets');
  await page.getByRole('button', {name: 'Send enquiry'}).click();
  await expect(page.getByTestId('lead-success')).toBeVisible();
  expect(body.email).toBe('qa@example.com');
  expect(body.message).toContain('Product interest: Duroply BWP Boiling Water Proof Plywood');
  expect(body.message).toContain('Quantity: 20 sheets');
  await expect(page.getByTestId('lead-success')).not.toContainText(/same day|24 hours/i);
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
  await page.goto('/#selector');
  const sel = page.locator('#selector');
  await sel.getByRole('button', {name: 'Bathroom & humid areas'}).click();
  await sel.getByRole('button', {name: 'Covered balcony / semi-outdoor'}).click();
  await expect(sel.getByRole('link', {name: 'Exterior Grade MDF'})).toBeVisible();
  const href = await sel.getByRole('link', {name: /Get price for this selection/}).getAttribute('href');
  expect(decode(href)).toContain('Exterior Grade MDF');
});

test('compare shows only shared verified rows', async ({page}) => {
  await page.goto('/#compare');
  const c = page.locator('#compare');
  await expect(c.getByRole('row', {name: /Bonding resin/})).toBeVisible();
  await c.getByLabel('Product B').selectOption('action-tesa-hdhmr-board');
  await expect(c.getByRole('row', {name: /Density/})).toHaveCount(0); // MR has no density value
  await expect(c.getByRole('row', {name: /Bonding resin/})).toHaveCount(0);
});
