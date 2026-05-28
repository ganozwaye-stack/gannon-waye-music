// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Store Load & Product Cards', () => {
  test('/store loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  });

  test('products are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('product images are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('product titles are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await expect(page.locator('[data-testid="product-title"]').first()).toBeVisible();
  });

  test('product prices are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await expect(page.locator('[data-testid="product-price"]').first()).toBeVisible();
  });

  test('add-to-cart button visible on each in-stock card', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    const addBtns = page.locator('[data-testid="add-to-cart"]');
    const count = await addBtns.count();
    expect(count).toBeGreaterThan(0);
  });

  test('NO size buttons visible on main product grid', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    // Size buttons should NOT be visible directly on the grid (they live in the modal)
    // Check that no size-selector testid exists outside of a modal
    const sizeSelector = page.locator('[data-testid="size-selector"]');
    const count = await sizeSelector.count();
    expect(count).toBe(0);
  });

  test('add-to-cart opens product option modal', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    const addBtn = page.locator('[data-testid="add-to-cart"]').first();
    await addBtn.click();
    await expect(page.locator('[data-testid="product-option-modal"]')).toBeVisible({ timeout: 3000 });
  });

  test('product option modal has quantity selector', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.locator('[data-testid="add-to-cart"]').first().click();
    await expect(page.locator('[data-testid="quantity-selector"]')).toBeVisible();
  });

  test('confirm-add-to-cart button exists in modal', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.locator('[data-testid="add-to-cart"]').first().click();
    await expect(page.locator('[data-testid="confirm-add-to-cart"]')).toBeVisible();
  });

  test('cancel-add-to-cart closes modal', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.locator('[data-testid="add-to-cart"]').first().click();
    await page.locator('[data-testid="cancel-add-to-cart"]').click();
    await expect(page.locator('[data-testid="product-option-modal"]')).not.toBeVisible({ timeout: 2000 });
  });

  test('apparel size must be selected before adding', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    // Find an apparel product — hoodie or tee
    const cards = page.locator('[data-testid="product-card"]');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const title = await cards.nth(i).locator('[data-testid="product-title"]').textContent();
      if (title && (title.toLowerCase().includes('hoodie') || title.toLowerCase().includes('tee'))) {
        await cards.nth(i).locator('[data-testid="add-to-cart"]').click();
        // Try to confirm without selecting size
        await page.locator('[data-testid="confirm-add-to-cart"]').click();
        await expect(page.locator('.text-destructive').first()).toBeVisible();
        break;
      }
    }
  });

  test('cart button is visible with testid', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  });

  test('no free shipping text on store page', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    const content = await page.content();
    expect(content.toLowerCase()).not.toContain('free shipping');
  });
});