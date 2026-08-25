// @ts-check
/* eslint-disable no-undef */

/**
 * THE ONLY Playwright config in this repository.
 *
 * Why this file exists at the root instead of inside the test pack:
 *
 * The suite used to live entirely under `src/gannonwaye-playwright-pack/`, with its
 * own package.json declaring `@playwright/test: ^1.60.0` — and nothing ever installed
 * it. Running `npx playwright test` therefore resolved to whatever Playwright happened
 * to exist on the machine (a global install, or a fresh npx download), while the browser
 * binaries were pinned to a different version. That mismatch is the "conflicting
 * Playwright installs" error.
 *
 * The fix is structural, not a flag:
 *   1. `@playwright/test` is now a devDependency of the ROOT package.json, pinned to an
 *      EXACT version (1.60.0, no caret) so two runs can never resolve two versions.
 *   2. This config lives at the root, so it runs from the same directory as the install.
 *   3. The nested package.json no longer declares Playwright, so there is exactly one
 *      npm project and one module resolution path.
 *
 * Run it:
 *   npm install
 *   npm run test:e2e:install      # one time — fetches the matching browser binary
 *   npm run test:e2e              # against a local dev server
 *   npm run test:e2e:live         # against https://gannonwaye.com
 *
 * Never run bare `npx playwright test`. That is what caused the problem.
 */

const { defineConfig, devices } = require('@playwright/test');

const isLive = process.env.LIVE === '1';
const baseURL = process.env.BASE_URL || 'http://localhost:5173';

// Third-party embeds are mapped to NOTFOUND so a flaky CDN never fails our own suite.
const BLOCK_THIRD_PARTY = [
  'MAP tracker.metricool.com ~NOTFOUND',
  'MAP *.posthog.com ~NOTFOUND',
  'MAP *.youtube.com ~NOTFOUND',
  'MAP *.youtube-nocookie.com ~NOTFOUND',
  'MAP *.doubleclick.net ~NOTFOUND',
  'MAP *.spotify.com ~NOTFOUND',
  'MAP *.google-analytics.com ~NOTFOUND',
  'MAP *.googletagmanager.com ~NOTFOUND',
].join(', ');

module.exports = defineConfig({
  testDir: './src/gannonwaye-playwright-pack/tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 4 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      args: [`--host-rules=${BLOCK_THIRD_PARTY}`],
    },
  },

  // Against the live site there is nothing to start. Locally, start Vite from the
  // repo root — which is now also where this config lives, so no ../../ juggling.
  webServer: isLive
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // The scroll bug was mobile-only, so mobile is no longer optional.
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
