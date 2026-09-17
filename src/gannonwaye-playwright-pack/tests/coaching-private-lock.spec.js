// tests/coaching-private-lock.spec.js
// Coaching stays private until COACHING_PUBLIC_LAUNCH_ENABLED is deliberately
// switched on. Every coaching route must redirect a visitor to /contact.

import { test, expect } from '@playwright/test';

const BASE_URL = globalThis.process?.env?.BASE_URL || 'http://localhost:5173';

const COACHING_ROUTES = [
  '/coaching',
  '/coaching/workbooks',
  '/coaching/intake',
  '/coaching/client-resources',
  '/coaching-programs',
  '/mindset-coaching',
  '/life-coaching',
  '/book-coaching',
];

test.describe('Coaching routes stay private', () => {
  for (const route of COACHING_ROUTES) {
    test(`${route} redirects to /contact`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('load');
      await expect.poll(() => new URL(page.url()).pathname, { timeout: 15_000 }).toBe('/contact');
    });
  }

  test('public navigation does not advertise coaching', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('load');
    await expect(page.locator('nav a[href^="/coaching"]')).toHaveCount(0);
  });
});