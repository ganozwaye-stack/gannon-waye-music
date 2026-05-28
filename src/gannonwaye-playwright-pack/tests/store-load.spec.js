// tests/store-load.spec.js
// Verifies store page loads, products are visible, and gold styling is used (no customer-facing yellow)

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gannonwaye.com';

test.describe('Store page load and styling', () => {
  test('store page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  });

  test('products are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('product images are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    const images = page.locator('[data-testid="product-image"]');
    const firstVisible = images.first();
    await expect(firstVisible).toBeVisible({ timeout: 10000 });
  });

  test('product titles are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    const titles = page.locator('[data-testid="product-title"]');
    await expect(titles.first()).toBeVisible({ timeout: 10000 });
  });

  test('cart button is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  });

  test('no raw yellow/amber classes on customer-facing elements', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    // Check that no obvious yellow classes appear on visible elements
    const yellowElements = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const found = [];
      allElements.forEach(el => {
        const cls = el.className;
        if (typeof cls === 'string' && (
          /\btext-yellow-\d/.test(cls) ||
          /\bbg-yellow-\d/.test(cls) ||
          /\bborder-yellow-\d/.test(cls)
        )) {
          found.push({ tag: el.tagName, class: cls });
        }
      });
      return found;
    });
    expect(yellowElements.length).toBe(0);
  });
});