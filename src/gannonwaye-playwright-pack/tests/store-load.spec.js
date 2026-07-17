// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const gotoStore = (page) => page.goto(`${BASE_URL}/store`, { waitUntil: 'domcontentloaded' });
const gotoProductGrid = (page) => page.goto(`${BASE_URL}/store/all`, { waitUntil: 'domcontentloaded' });

test.describe('Store Load & Product Cards', () => {
  test('/store loads', async ({ page }) => {
    await gotoStore(page);
    await expect(page.getByRole('link', { name: /all products/i })).toBeVisible();
  });

  test('products are visible', async ({ page }) => {
    await gotoProductGrid(page);
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('product images are visible', async ({ page }) => {
    await gotoProductGrid(page);
    await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('product titles are visible', async ({ page }) => {
    await gotoProductGrid(page);
    await expect(page.locator('[data-testid="product-title"]').first()).toBeVisible();
  });

  test('product prices are visible', async ({ page }) => {
    await gotoProductGrid(page);
    await expect(page.locator('[data-testid="product-price"]').first()).toBeVisible();
  });

  test('winter bundle add-to-cart button is visible', async ({ page }) => {
    await gotoProductGrid(page);
    await expect(page.locator('[data-testid="winter-bundle-add-to-cart"]')).toBeVisible();
  });

  test('winter bundle hero is visible', async ({ page }) => {
    await gotoProductGrid(page);
    await expect(page.locator('[data-testid="winter-bundle-hero"]')).toBeVisible();
  });

  test('winter bundle add-to-cart updates cart state', async ({ page }) => {
    await gotoProductGrid(page);
    await page.locator('[data-testid="winter-bundle-add-to-cart"]').click();
    await expect(page.locator('[data-testid="cart-count"]')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('[data-testid="store-sticky-checkout"]')).toBeVisible({ timeout: 3000 });
  });

  test('cart quick link is visible on store page', async ({ page }) => {
    await gotoStore(page);
    await expect(page.getByRole('link', { name: /cart/i }).first()).toBeVisible();
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
