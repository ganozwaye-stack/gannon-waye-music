// tests/checkout.spec.js
// Verifies checkout page loads correctly, shows cart items and pay button

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gannonwaye.com';

test.describe('Checkout page', () => {
  test('checkout page shows empty cart message when cart is empty', async ({ page }) => {
    // Clear any stored cart
    await page.goto(`${BASE_URL}/store`);
    await page.evaluate(() => {
      Object.keys(localStorage).forEach(key => {
        if (key.includes('cart') || key.includes('zustand')) localStorage.removeItem(key);
      });
    });

    await page.goto(`${BASE_URL}/store/checkout`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="empty-cart-return-store"]')).toBeVisible();
  });

  test('checkout page loads after adding item', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    // Add to cart
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await expect(addBtns.first()).toBeVisible({ timeout: 10000 });
    await addBtns.first().click();
    await page.waitForTimeout(400);

    // Navigate to checkout
    await page.goto(`${BASE_URL}/store/checkout`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-pay-button"]')).toBeVisible();
  });

  test('pay securely button is visible on checkout', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await expect(addBtns.first()).toBeVisible({ timeout: 10000 });
    await addBtns.first().click();
    await page.waitForTimeout(400);

    await page.goto(`${BASE_URL}/store/checkout`);
    await page.waitForLoadState('networkidle');

    const payBtn = page.locator('[data-testid="checkout-pay-button"]');
    await expect(payBtn).toBeVisible({ timeout: 5000 });
    const text = await payBtn.textContent();
    expect(text.toLowerCase()).toMatch(/pay|secure|checkout/);
  });

  test('sticky checkout bar button navigates to checkout', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await expect(addBtns.first()).toBeVisible({ timeout: 10000 });
    await addBtns.first().click();
    await page.waitForTimeout(500);

    const stickyBtn = page.locator('[data-testid="store-sticky-checkout-button"]');
    await expect(stickyBtn).toBeVisible({ timeout: 5000 });
    await stickyBtn.click();

    await page.waitForURL('**/store/checkout');
    await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
  });
});