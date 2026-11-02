import {test, expect} from '@playwright/test';

test('desktop mega menu: hover, preview, keyboard, escape', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  const trigger = page.getByRole('button', {name: 'Products'});
  await trigger.hover();
  const panel = page.getByRole('region', {name: 'Products menu'});
  await expect(panel).toBeVisible();
  // live preview follows the hovered category
  await panel.getByRole('link', {name: /Flush Doors/}).first().hover();
  await expect(panel.getByText('Duro Door flush doors in standard and custom sizes.')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  // keyboard open
  await trigger.press('Enter');
  await expect(panel).toBeVisible();
  await panel.getByRole('link', {name: /Plywood/}).first().click();
  await expect(page).toHaveURL(/\/products\/plywood$/);
});

test('brands panel shows official logos', async ({page}, info) => {
  test.skip(info.project.name !== 'desktop');
  await page.goto('/');
  await page.getByRole('button', {name: 'Brands'}).click();
  const panel = page.getByRole('region', {name: 'Brands menu'});
  for (const b of ['Duroply', 'Action TESA', 'Tenon Smart Lock']) await expect(panel.getByAltText(`${b} logo`)).toBeVisible();
});

test('mobile menu: full sheet, categories, contacts, closes on navigation', async ({page}, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('/');
  await page.getByTestId('menu-toggle').click();
  const sheet = page.getByTestId('mobile-menu');
  await expect(sheet).toBeVisible();
  await expect(sheet.getByRole('link', {name: /Call/})).toBeVisible();
  await expect(sheet.getByRole('link', {name: /WhatsApp/})).toBeVisible();
  const box = await sheet.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 0.5);
  await sheet.getByRole('link', {name: /MDF/}).first().click();
  await expect(page).toHaveURL(/\/products\/mdf$/);
  await expect(sheet).toBeHidden();
});
