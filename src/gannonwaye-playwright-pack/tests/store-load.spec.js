 
// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Verified public store', () => {
  test('/store is the sole public boutique and product route', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
    await expect(page.locator('[data-testid="locked-storefront-world"]')).toBeVisible();
    await expect(page.locator('[data-testid="locked-storefront-stage"]')).toBeVisible();
  });

  test('/store/all redirects to the same canonical store', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    await expect(page).toHaveURL(`${BASE_URL}/store`);
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  });

  test('exactly two owner approved stage one product cards are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="world-product-card"]')).toHaveCount(2);
  });

  test('product images, titles and prices are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards.first()).toBeVisible();
    await expect(cards.first().locator('[data-testid="product-title"]')).toBeVisible();
    await expect(cards.first().locator('[data-testid="product-price"]')).toBeVisible();
    await expect(cards.first().locator('img').first()).toBeVisible();
  });

  test('hoodie requires one verified size before being added', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    const hoodie = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
    await hoodie.locator('[data-testid="add-to-cart-btn"]').click();
    await expect(hoodie.locator('.text-destructive')).toContainText('Please select a size');

    await hoodie.getByRole('button', { name: /^M \(4\)$/ }).click();
    await hoodie.locator('[data-testid="add-to-cart-btn"]').click();
    await expect(hoodie.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
  });

  test('journal bundle can be added without a size', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    const bundle = page.locator('[data-testid="product-card"]').filter({ hasText: /Journal.*Pen.*Thermos.*Gift Box/i }).first();
    await bundle.locator('[data-testid="add-to-cart-btn"]').click();
    await expect(bundle.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
  });

  test('cart control is visible and counts added items', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    const bundle = page.locator('[data-testid="product-card"]').filter({ hasText: /Journal.*Pen.*Thermos.*Gift Box/i }).first();
    await bundle.locator('[data-testid="add-to-cart-btn"]').click();
    await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
  });

  test('store does not advertise unsupported products or unverified claims', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    const content = await page.locator('body').innerText();
    expect(content).not.toContain('Winter Writing & Comfort Bundle');
    expect(content).not.toContain('Coffee Mug');
    expect(content).not.toContain('Wall Poster');
    expect(content).not.toContain('10% of proceeds');
    expect(content).not.toContain('Includes GST');
  });
});