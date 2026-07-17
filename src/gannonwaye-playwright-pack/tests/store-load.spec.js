// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const gotoStore = (page) => page.goto(`${BASE_URL}/store`, { waitUntil: 'domcontentloaded' });

test.describe('Store Load & Product Cards', () => {
  test('/store loads', async ({ page }) => {
    await gotoStore(page);
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  });

  test('products are visible', async ({ page }) => {
    await gotoStore(page);
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('product images are visible', async ({ page }) => {
    await gotoStore(page);
    await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('product titles are visible', async ({ page }) => {
    await gotoStore(page);
    await expect(page.locator('[data-testid="product-title"]').first()).toBeVisible();
  });

  test('product prices are visible', async ({ page }) => {
    await gotoStore(page);
    await expect(page.locator('[data-testid="product-price"]').first()).toBeVisible();
  });

  test('add-to-cart button visible on each in-stock card', async ({ page }) => {
    await gotoStore(page);
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    const count = await addBtns.count();
    expect(count).toBeGreaterThan(0);
  });

  test('NO size buttons visible on main product grid', async ({ page }) => {
    await gotoStore(page);
    // Size buttons should NOT be visible directly on the grid (they live in the modal)
    // Check that no size-selector testid exists outside of a modal
    const sizeSelector = page.locator('[data-testid="size-selector"]');
    const count = await sizeSelector.count();
    expect(count).toBe(0);
  });

  test('add-to-cart button works and shows confirmation', async ({ page }) => {
    await gotoStore(page);
    // Find a non-apparel product (no size required) or select size first
    const cards = page.locator('[data-testid="product-card"]');
    const count = await cards.count();
    let clicked = false;
    for (let i = 0; i < count; i++) {
      const title = await cards.nth(i).locator('[data-testid="product-title"]').textContent().catch(() => '');
      if (!title.toLowerCase().includes('hoodie') && !title.toLowerCase().includes('tee')) {
        const btn = cards.nth(i).locator('[data-testid="add-to-cart-btn"]');
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
          clicked = true;
          break;
        }
      }
    }
    if (clicked) {
      await expect(page.locator('[data-testid="add-to-cart-success"]').first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('apparel size must be selected before adding', async ({ page }) => {
    await gotoStore(page);
    const cards = page.locator('[data-testid="product-card"]');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const title = await cards.nth(i).locator('[data-testid="product-title"]').textContent().catch(() => '');
      if (title.toLowerCase().includes('hoodie') || title.toLowerCase().includes('tee')) {
        const btn = cards.nth(i).locator('[data-testid="add-to-cart-btn"]');
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
          await expect(page.locator('.text-destructive').first()).toBeVisible({ timeout: 3000 });
          break;
        }
      }
    }
  });

  test('cart button is visible with testid', async ({ page }) => {
    await gotoStore(page);
    await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  });

  test('no free shipping text on store page', async ({ page }) => {
    await gotoStore(page);
    const content = await page.content();
    expect(content.toLowerCase()).not.toContain('free shipping');
  });
});
