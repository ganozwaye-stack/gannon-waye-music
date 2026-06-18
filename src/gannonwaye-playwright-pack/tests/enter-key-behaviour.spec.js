 
// tests/enter-key-behaviour.spec.js
// Verifies Enter key does NOT redirect to Dashboard from forms/inputs

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Enter Key Behaviour — Public', () => {
  test('Enter in footer email input does not navigate away from home', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('footer input[type="text"]').first();
    if (await nameInput.count() > 0) {
      await nameInput.fill('Test User');
      await nameInput.press('Enter');
      // Should NOT navigate to /admin
      expect(page.url()).not.toContain('/admin');
      expect(page.url()).toContain(BASE_URL);
    }
  });

  test('Enter in contact form does not redirect to dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input[type="text"], input[type="email"]');
    if (await inputs.count() > 0) {
      await inputs.first().fill('test');
      await inputs.first().press('Enter');
      expect(page.url()).not.toContain('/admin');
    }
  });

  test('Enter in community post form does not redirect to dashboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/community`);
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('input[type="text"]').first();
    if (await nameInput.count() > 0) {
      await nameInput.fill('Test');
      await nameInput.press('Enter');
      expect(page.url()).not.toContain('/admin');
    }
  });

  test('Enter in textarea creates newline, does not navigate', async ({ page }) => {
    await page.goto(`${BASE_URL}/community`);
    await page.waitForLoadState('networkidle');

    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      await textarea.fill('Line one');
      await textarea.press('Enter');
      const value = await textarea.inputValue();
      expect(value).toContain('\n');
      expect(page.url()).not.toContain('/admin');
    }
  });

  test('no console errors from Enter key press on public forms', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('networkidle');

    const inputs = page.locator('input').all();
    for (const input of await inputs) {
      await input.press('Enter').catch(() => {});
    }

    const critical = errors.filter(e =>
      !e.includes('ResizeObserver') && !e.includes('autoplay') && !e.includes('Non-Error')
    );
    expect(critical.length).toBe(0);
  });
});

test.describe('Enter Key Behaviour — Admin (requires login)', () => {
  test('Enter in admin search input does not redirect to dashboard', async ({ page }) => {
    const cookies = process.env.ADMIN_SESSION_COOKIE;
    if (!cookies) { test.skip(); return; }

    await page.goto(`${BASE_URL}/admin/orders`);
    await page.waitForLoadState('networkidle');

    const search = page.locator('input[placeholder*="Search"]').first();
    if (await search.count() > 0) {
      await search.fill('test');
      await search.press('Enter');
      // Should remain on /admin/orders, not redirect to /admin
      expect(page.url()).toContain('/admin/orders');
    }
  });

  test('Enter in admin orders search stays on orders page', async ({ page }) => {
    const cookies = process.env.ADMIN_SESSION_COOKIE;
    if (!cookies) { test.skip(); return; }

    await page.goto(`${BASE_URL}/admin/orders`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/admin/orders');

    const search = page.locator('input').first();
    if (await search.count() > 0) {
      await search.press('Enter');
      await page.waitForTimeout(500);
      expect(page.url()).toContain('/admin/orders');
    }
  });
});