import {defineConfig, devices} from '@playwright/test';

// E2E against a production build. PW_BASE_URL reuses a running server (or the
// live site); otherwise Playwright builds + starts one on :3300. The lead API
// is mocked inside the tests — no real lead is ever sent.
const baseURL = process.env.PW_BASE_URL ?? 'http://localhost:3300';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  timeout: 60_000,
  use: {baseURL, trace: 'retain-on-failure'},
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome'], viewport: {width: 1440, height: 900}}},
    {name: 'mobile', use: {...devices['Pixel 7'], viewport: {width: 390, height: 844}}}
  ],
  webServer: process.env.PW_BASE_URL
    ? undefined
    : {command: 'npm run build && npx next start -p 3300', url: baseURL, timeout: 240_000, reuseExistingServer: true}
});
