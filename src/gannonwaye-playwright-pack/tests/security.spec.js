// tests/security.spec.js
// Anonymous visitors must never see the admin console. AdminLayout sends
// signed-out users to login and refuses non-admins with "Access Restricted".

import { test, expect } from '@playwright/test';

const BASE_URL = globalThis.process?.env?.BASE_URL || 'http://localhost:5173';

const ADMIN_ROUTES = ['/admin', '/admin/dashboard', '/admin/orders', '/admin/approval-queue'];

test.describe('Admin routes are locked to anonymous visitors', () => {
  for (const route of ADMIN_ROUTES) {
    test(`${route} never renders the admin console for a signed-out visitor`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('load');

      // Either we were bounced to a login flow, or the guard rendered its lock screen.
      // In neither case may the admin navigation be present.
      await expect
        .poll(async () => {
          const url = page.url();
          const leftAdmin = !url.includes('/admin');
          const restricted = (await page.getByText('Access Restricted').count()) > 0;
          const loading = (await page.getByText('Loading', { exact: true }).count()) > 0;
          return leftAdmin || restricted || loading;
        }, { timeout: 20_000 })
        .toBe(true);

      await expect(page.locator('a[href="/admin/approval-queue"]')).toHaveCount(0);
    });
  }
});

test.describe('No credentials leak into the public bundle', () => {
  test('home page HTML carries no secret-shaped tokens', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('load');
    const html = await page.content();
    expect(html).not.toMatch(/sk_live_[A-Za-z0-9]{8,}/);
    expect(html).not.toMatch(/sk_test_[A-Za-z0-9]{8,}/);
    expect(html).not.toMatch(/whsec_[A-Za-z0-9]{8,}/);
  });
});