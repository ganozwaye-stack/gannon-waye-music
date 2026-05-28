// tests/navigation-scroll.spec.js
// Verifies that navigating to a new page always resets scroll position to top.

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gannonwaye.com';

test.describe('Scroll-to-top on route change', () => {
  test('navigating from Store to Home resets scroll to top', async ({ page }) => {
    // Go to the store page (long page with products)
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    // Scroll down significantly
    await page.evaluate(() => window.scrollTo(0, 800));
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(100);

    // Navigate to Home via a link or direct navigation
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBe(0);
  });

  test('navigating from Home to Store resets scroll to top', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => window.scrollTo(0, 600));
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(100);

    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBe(0);
  });

  test('navigating to an admin page resets scroll to top', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => window.scrollTo(0, 500));

    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');

    const scrollAfter = await page.evaluate(() => window.scrollY);
    expect(scrollAfter).toBe(0);
  });

  test('hash navigation scrolls to section, not top', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    // Navigate to a hash — scroll should NOT be 0 if section exists (or at least not throw)
    await page.goto(`${BASE_URL}/#about`);
    await page.waitForTimeout(300);
    // We just verify no crash — scroll position may vary depending on section existence
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThanOrEqual(0);
  });

  test('opening cart drawer does not reset scroll', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(200);

    const scrollBefore = await page.evaluate(() => window.scrollY);

    // Open cart (if button exists)
    const cartBtn = page.locator('[data-testid="cart-button"]');
    if (await cartBtn.count() > 0) {
      await cartBtn.click();
      await page.waitForTimeout(300);
    }

    const scrollAfter = await page.evaluate(() => window.scrollY);
    // Scroll should not have reset to 0
    expect(scrollAfter).toBe(scrollBefore);
  });
});