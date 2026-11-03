import {test, expect} from '@playwright/test';
import {hydrated} from './helpers';

test('desktop mega menu: hover, preview, keyboard, escape', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await hydrated(page);
  const trigger = page.getByRole('button', {name: 'Products', exact: true});
  await trigger.hover();
  const panel = page.getByRole('region', {name: 'Products menu'});
  await expect(panel).toBeVisible();
  // live preview follows the hovered category
  await panel.getByRole('link', {name: /Flush Doors/}).first().hover();
  await expect(panel.getByText('Duro Door flush doors in standard and custom sizes.')).toBeVisible();
  await expect(panel.getByRole('link', {name: /View complete range \(\d+ products\)/})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  // keyboard open (Enter) and ArrowDown focuses the first link
  await trigger.press('Enter');
  await expect(panel).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await trigger.press('ArrowDown');
  await expect(panel).toBeVisible();
  await expect(panel.locator('a').first()).toBeFocused();
  await panel.getByRole('link', {name: /Plywood/}).first().click();
  await expect(page).toHaveURL(/\/products\/plywood$/);
  await expect(panel).toBeHidden();
});

test('hover intent: no flicker when crossing to the panel', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await hydrated(page);
  const t = page.getByRole('button', {name: 'Products', exact: true});
  const box = (await t.boundingBox())!;
  await page.mouse.move(box.x + 10, box.y + box.height / 2);
  const panel = page.getByRole('region', {name: 'Products menu'});
  await expect(panel).toBeVisible();
  // pass diagonally over the Brands trigger into the panel quickly
  const b = (await page.getByRole('button', {name: 'Brands', exact: true}).boundingBox())!;
  await page.mouse.move(b.x + 5, b.y + b.height / 2, {steps: 2});
  await page.mouse.move(b.x + 5, b.y + b.height + 60, {steps: 2});
  await page.waitForTimeout(250);
  await expect(panel).toBeVisible();
});

test('brands panel shows official logos and counts', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await hydrated(page);
  await page.getByRole('button', {name: 'Brands', exact: true}).click();
  const panel = page.getByRole('region', {name: 'Brands menu'});
  for (const b of ['Duroply', 'Action TESA', 'Tenon Smart Lock']) await expect(panel.getByAltText(`${b} logo`)).toBeVisible();
  await expect(panel).toContainText('Supplied range');
  await expect(panel).not.toContainText(/Tenon[^·]*Authori/);
});

test('applications, tools and resources panels', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await hydrated(page);
  await page.getByRole('button', {name: 'Applications', exact: true}).click();
  const apps = page.getByRole('region', {name: 'Applications menu'});
  await apps.getByRole('link', {name: /Kitchens/}).click();
  await expect(page).toHaveURL(/\/products\?app=kitchens/);
  await page.getByRole('button', {name: 'Tools', exact: true}).click();
  await expect(page.getByRole('region', {name: 'Tools menu'}).getByRole('link', {name: /Board Comparison/})).toBeVisible();
  await page.getByRole('button', {name: 'Resources', exact: true}).click();
  await expect(page.getByRole('region', {name: 'Resources menu'}).getByRole('link', {name: /Décor library/})).toBeVisible();
});

test('header compacts on scroll and stays white', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await hydrated(page);
  const header = page.getByTestId('site-header');
  await expect(header).not.toHaveAttribute('data-compact', '1');
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(header).toHaveAttribute('data-compact', '1');
  const bg = await header.locator('> div').nth(1).evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe('rgb(255, 255, 255)');
});

test('mobile menu: full sheet, categories, contacts, closes on navigation', async ({page}, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  await hydrated(page);
  await page.getByTestId('menu-toggle').click();
  const sheet = page.getByTestId('mobile-menu');
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('link', {name: /Call/})).toBeVisible();
  await expect(sheet.getByRole('link', {name: /WhatsApp/})).toBeVisible();
  await expect(sheet.getByRole('link', {name: /Get Price/})).toBeVisible();
  const box = await sheet.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 0.5);
  // accordion
  await sheet.getByRole('button', {name: /Brands/}).click();
  await expect(sheet.getByRole('link', {name: /^Tenon Smart Lock/})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(page.getByTestId('menu-toggle')).toBeFocused();
  await page.getByTestId('menu-toggle').click();
  await sheet.getByRole('link', {name: /MDF/}).first().click();
  await expect(page).toHaveURL(/\/products\/mdf$/);
  await expect(sheet).toBeHidden();
});
