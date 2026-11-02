import type {Page} from '@playwright/test';

/** React has hydrated: RevealObserver's effect marks <html data-motion="ready">. */
export async function hydrated(page: Page) {
  await page.waitForFunction(() => document.documentElement.dataset.motion === 'ready');
}
