import {test} from '@playwright/test';
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
