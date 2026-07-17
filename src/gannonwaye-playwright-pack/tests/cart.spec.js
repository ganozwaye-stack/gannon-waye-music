// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const gotoStore = (page) => page.goto(`${BASE_URL}/store/all`, { waitUntil: 'domcontentloaded' });

async function addWinterBundle(page) {
  await gotoStore(page);
  const addButton = page.locator('[data-testid="winter-bundle-add-to-cart"]');
  await expect(addButton).toBeVisible();
  await addButton.click();
}

test.describe('Cart Flow', () => {
  test('products are visible', async ({ page }) => {
    await gotoStore(page);
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('product images are visible', async ({ page }) => {
    await gotoStore(page);
    await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible();
  });

  test('cart button is visible with data-testid', async ({ page }) => {
    await gotoStore(page);
    await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  });

  test('winter bundle can be added to cart', async ({ page }) => {
    await addWinterBundle(page);
    await expect(page.locator('[data-testid="cart-count"]')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('[data-testid="store-sticky-checkout"]')).toBeVisible({ timeout: 3000 });
  });

  test('continue shopping button returns to store state', async ({ page }) => {
    await addWinterBundle(page);
    await page.getByRole('button', { name: /continue shopping/i }).click();
    await expect(page.locator('[data-testid="winter-bundle-add-to-cart"]')).toBeVisible();
  });

  test('view cart button opens cart drawer', async ({ page }) => {
    await addWinterBundle(page);
    await page.getByRole('button', { name: /view cart/i }).click();
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible({ timeout: 3000 });
  });

  test('cart checkout button routes to cart-details', async ({ page }) => {
    await addWinterBundle(page);
    await page.getByRole('button', { name: /view cart/i }).click();
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible({ timeout: 3000 });
    await page.locator('[data-testid="cart-checkout-button"]').click();
    await expect(page).toHaveURL(/\/store\/cart-details/);
  });

  test('sticky checkout bar appears when cart has items', async ({ page }) => {
    await addWinterBundle(page);
    await expect(page.locator('[data-testid="store-sticky-checkout"]')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('[data-testid="store-sticky-checkout-button"]')).toBeVisible();
  });

  test('sticky checkout button routes to cart-details', async ({ page }) => {
    await addWinterBundle(page);
    await page.locator('[data-testid="store-sticky-checkout-button"]').click();
    await expect(page).toHaveURL(/\/store\/cart-details/);
  });

  test('cart count badge shows item count', async ({ page }) => {
    await addWinterBundle(page);
    await expect(page.locator('[data-testid="cart-count"]')).toBeVisible({ timeout: 3000 });
    const text = await page.locator('[data-testid="cart-count"]').textContent();
    expect(parseInt(text || '0', 10)).toBeGreaterThan(0);
  });
});
