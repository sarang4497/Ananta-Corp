import {test} from '@playwright/test';
import {assertNoMeaningfulOverflow, revealWholePage} from './overflow-guard';
import {ROUTES, WIDTHS} from './routes';

// Zero-failure responsive gate: every public route × every reference width.
// Runs once (desktop project); widths are set per test.
test.describe('no meaningful overflow', () => {
  for (const route of ROUTES) {
    test(`${route}`, async ({page}, info) => {
      test.skip(info.project.name !== 'desktop', 'width matrix runs once');
      for (const width of WIDTHS) {
        await page.setViewportSize({width, height: width < 800 ? 844 : 900});
        await page.goto(route, {waitUntil: 'domcontentloaded'});
        await revealWholePage(page);
        await assertNoMeaningfulOverflow(page, `${route} @${width}`);
      }
    });
  }
});
