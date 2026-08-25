// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * THE ONLY Playwright config in this repository.
 *
 * What was actually wrong, for whoever reads this next:
 *
 * 1. The suite lived entirely under `src/gannonwaye-playwright-pack/` with its own
 *    package.json declaring `@playwright/test: ^1.60.0` — and nothing ever installed it.
 *    A bare `npx playwright test` therefore resolved to whatever Playwright existed on
 *    the machine (a global install, or a fresh npx download) while the browser binaries
 *    were pinned to a different build. That version mismatch is the "conflicting
 *    Playwright installs" error. It was never a flag or a cache — it was two projects.
 *
 * 2. The caret in `^1.60.0` meant two runs on two days could legitimately resolve two
 *    different minor versions. Browser binaries are version-locked to the runner, so
 *    that alone reproduces the fault.
 *
 * 3. This root package.json is `"type": "module"`, so a config written with `require()`
 *    throws before Playwright even starts. The old config only worked because the nested
 *    package.json declared `"type": "commonjs"`. That nested file is now dependency-free
 *    but KEEPS `type: commonjs`, because ten of the thirty spec files still use
 *    `require()` and rely on it.
 *
 * The fix is structural:
 *   - `@playwright/test` is a devDependency of the ROOT package.json, pinned EXACTLY
 *     (1.60.0, no caret) so two runs can never resolve two versions.
 *   - This config lives at the root, in ESM, matching the root package type.
 *   - The nested config throws a pointer instead of defining a second config.
 *
 * Run it, from the repo root, never with bare npx:
 *   npm install
 *   npm run test:e2e:install     # one time — fetches the matching browser binary
 *   npm run test:e2e             # spins up Vite and tests against it
 *   npm run test:e2e:live        # tests https://gannonwaye.com instead
 *   npm run test:e2e:report      # opens the HTML report
 */

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

export default defineConfig({
  testDir: './src/gannonwaye-playwright-pack/tests',

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,

  // Deliberately conservative. This app is large and the sandbox it usually runs in
  // is small; at 6 workers a healthy test intermittently blew the 30s default and
  // reported as a failure when nothing was actually broken. A slow suite that tells
  // the truth beats a fast one that cries wolf.
  workers: process.env.CI ? 4 : 2,
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // NOTE: --host-rules is a CHROMIUM-ONLY flag. It must NOT live here, because
    // `use` applies to every project and WebKit refuses to launch on an unknown
    // argument ('Cannot parse arguments: Unknown option --host-rules'). It is set
    // per-project below instead. Blocking third parties in WebKit is done with
    // route interception, which works in every engine.
  },

  // Against the live site there is nothing to start. Locally, start Vite from the repo
  // root — which is now also where this config lives, so no ../../ path juggling.
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
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { args: [`--host-rules=${BLOCK_THIRD_PARTY}`] },
      },
    },
    {
      // Chromium with phone emulation. Runs anywhere chromium runs.
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        launchOptions: { args: [`--host-rules=${BLOCK_THIRD_PARTY}`] },
      },
    },
    {
      // iPad viewport, forced onto Chromium. The stock 'iPad (gen 7)' descriptor
      // defaults to WebKit; we override browserName so the tablet breakpoint is
      // still covered on machines where WebKit will not install. Between phone and
      // desktop is exactly where responsive layouts break quietly.
      name: 'tablet-chrome',
      use: {
        ...devices['iPad (gen 7) landscape'],
        browserName: 'chromium',
        launchOptions: { args: [`--host-rules=${BLOCK_THIRD_PARTY}`] },
      },
    },
    {
      // Real Safari engine — the only project that catches iOS-only faults such as
      // `overflow: clip` being unsupported before Safari 16. No --host-rules here;
      // WebKit refuses to launch on unknown arguments.
      //
      // WebKit needs system libraries (libgstreamer, libgtk-4) that many sandboxes
      // lack, and browser binaries do NOT persist in the Base44 sandbox — the whole
      // ms-playwright cache gets wiped between sessions. So this project is kept
      // LAST and treated as supplementary: the three chromium projects above are
      // the gate that must always pass, and this one is the deeper check to run on
      // a machine that can hold an install.
      //
      //   npx playwright install webkit && npx playwright install-deps webkit
      //   npm run test:e2e -- --project=mobile-safari
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
