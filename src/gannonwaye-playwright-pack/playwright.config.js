/* eslint-disable no-undef */
// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 2,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: {
      args: [
        '--host-rules=MAP tracker.metricool.com ~NOTFOUND, MAP *.posthog.com ~NOTFOUND, MAP *.youtube.com ~NOTFOUND, MAP *.youtube-nocookie.com ~NOTFOUND, MAP *.doubleclick.net ~NOTFOUND, MAP *.spotify.com ~NOTFOUND, MAP *.google-analytics.com ~NOTFOUND, MAP *.googletagmanager.com ~NOTFOUND'
      ]
    }
  },
  webServer: {
    command: 'npm run dev -- --host localhost --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    cwd: '../../',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
