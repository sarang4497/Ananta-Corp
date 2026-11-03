import {test, expect} from '@playwright/test';
import {hydrated} from './helpers';
import {assertNoMeaningfulOverflow, revealWholePage} from './overflow-guard';
import {ROUTES, WIDTHS} from './routes';

// Zero-failure responsive gate: every public route × every reference width,
// one test each (parallel). Runs in the desktop project only (width is set
// per test; the mobile project would duplicate it).
for (const route of ROUTES) {
  test.describe(`overflow ${route}`, () => {
    for (const width of WIDTHS) {
      test(`@${width}`, async ({page}, info) => {
        test.skip(info.project.name !== 'desktop', 'width matrix runs once');
        await page.setViewportSize({width, height: width < 800 ? 844 : 900});
        await page.goto(route, {waitUntil: 'domcontentloaded'});
        await revealWholePage(page);
        await assertNoMeaningfulOverflow(page, `${route} @${width}`);
      });
    }
  });
}

// Shell states: the same zero-overflow gate with UI open.
const STATE_WIDTHS = [320, 360, 390, 430, 768, 1024, 1080, 1280, 1440];
test.describe('overflow with shell UI open', () => {
  for (const width of STATE_WIDTHS) {
    test(`search dialog @${width}`, async ({page}, info) => {
      test.skip(info.project.name !== 'desktop', 'width matrix runs once');
      await page.setViewportSize({width, height: width < 800 ? 844 : 900});
      await page.goto('/');
      await hydrated(page);
      await page.evaluate(() => window.dispatchEvent(new CustomEvent('open-search', {detail: {q: 'plywood'}})));
      await expect(page.getByTestId('search-dialog')).toBeVisible();
      await assertNoMeaningfulOverflow(page, `search open @${width}`);
    });
    if (width < 1080) {
      test(`mobile menu @${width}`, async ({page}, info) => {
        test.skip(info.project.name !== 'desktop', 'width matrix runs once');
        await page.setViewportSize({width, height: 844});
        await page.goto('/');
        await hydrated(page);
        await page.getByTestId('menu-toggle').click();
        const sheet = page.getByTestId('mobile-menu');
        await expect(sheet).toBeVisible();
        for (const name of ['Brands', 'Applications', 'Tools', 'Resources']) {
          await sheet.getByRole('button', {name: new RegExp(name)}).click();
          await assertNoMeaningfulOverflow(page, `menu ${name} @${width}`);
        }
      });
    } else {
      for (const menu of ['Products', 'Brands', 'Applications', 'Tools', 'Resources']) {
        test(`mega ${menu} @${width}`, async ({page}, info) => {
          test.skip(info.project.name !== 'desktop', 'width matrix runs once');
          await page.setViewportSize({width, height: 900});
          await page.goto('/');
          await hydrated(page);
          await page.getByRole('button', {name: menu, exact: true}).click();
          await expect(page.getByRole('region', {name: `${menu} menu`})).toBeVisible();
          await page.waitForTimeout(250);
          await assertNoMeaningfulOverflow(page, `mega ${menu} @${width}`);
        });
      }
    }
  }
});
