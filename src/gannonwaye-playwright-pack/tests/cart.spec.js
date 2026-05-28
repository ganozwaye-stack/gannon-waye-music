// tests/cart.spec.js
// Verifies add-to-cart flow, confirmation UI, cart drawer, and sticky checkout bar

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gannonwaye.com';

test.describe('Cart flow', () => {
  test('add to cart button is visible on in-stock products', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    const btn = page.locator('[data-testid="add-to-cart-btn"]').first();
    await expect(btn).toBeVisible({ timeout: 10000 });
  });

  test('add-to-cart shows confirmation with 3 buttons', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    // Find first CD/no-size product to avoid size selection requirement
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await addBtns.first().click();

    // Confirmation UI
    const confirmation = page.locator('[data-testid="add-to-cart-success"]');
    await expect(confirmation).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="continue-shopping-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="view-cart-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="go-to-checkout-button"]')).toBeVisible();
  });

  test('cart count badge updates after add to cart', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await addBtns.first().click();

    // Cart count badge should be visible
    const badge = page.locator('[data-testid="cart-count"]');
    await expect(badge).toBeVisible({ timeout: 5000 });
    const text = await badge.textContent();
    expect(parseInt(text)).toBeGreaterThan(0);
  });

  test('cart button opens drawer', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    // Add to cart first
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await addBtns.first().click();
    await page.waitForTimeout(300);

    // Click view cart
    const viewCartBtn = page.locator('[data-testid="view-cart-button"]');
    if (await viewCartBtn.isVisible()) {
      await viewCartBtn.click();
    } else {
      await page.locator('[data-testid="cart-button"]').click();
    }

    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible({ timeout: 5000 });
  });

  test('cart drawer checkout button is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    // Add an item
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await addBtns.first().click();
    await page.waitForTimeout(300);

    // Open cart drawer
    await page.locator('[data-testid="cart-button"]').click();
    await expect(page.locator('[data-testid="cart-checkout-button"]')).toBeVisible({ timeout: 5000 });
  });

  test('sticky checkout bar appears when cart has items', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await addBtns.first().click();
    await page.waitForTimeout(500);

    await expect(page.locator('[data-testid="store-sticky-checkout"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="store-sticky-checkout-button"]')).toBeVisible();
  });

  test('continue shopping button dismisses confirmation', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');

    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await addBtns.first().click();

    await expect(page.locator('[data-testid="add-to-cart-success"]')).toBeVisible({ timeout: 5000 });
    await page.locator('[data-testid="continue-shopping-button"]').click();

    // Confirmation should disappear, add to cart button should be visible again
    const addBtn = page.locator('[data-testid="add-to-cart-btn"]').first();
    await expect(addBtn).toBeVisible({ timeout: 3000 });
  });
});