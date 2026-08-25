// @ts-check
 
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Cart Flow', () => {
  test('/store loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  });

  test('products are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('product images are visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible();
  });

  test('cart button is visible with data-testid', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  });

  test('add to cart shows confirmation', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    await page.waitForSelector('[data-testid="add-to-cart-btn"]');

    // Select size if required
    const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
    if (await sizeM.isVisible().catch(() => false)) await sizeM.click();

    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    const count = await addBtns.count();
    for (let i = 0; i < count; i++) {
      const btn = addBtns.nth(i);
      if (await btn.isVisible()) { await btn.click(); break; }
    }

    await expect(page.locator('[data-testid="add-to-cart-success"]').first()).toBeVisible({ timeout: 3000 });
  });

  test('continue shopping button closes confirmation', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
    if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    const count = await addBtns.count();
    for (let i = 0; i < count; i++) {
      if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
    }
    await page.locator('[data-testid="continue-shopping-button"]').first().click();
    await expect(page.locator('[data-testid="add-to-cart-success"]')).not.toBeVisible({ timeout: 2000 });
  });

  test('view cart button opens cart drawer', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
    if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    const count = await addBtns.count();
    for (let i = 0; i < count; i++) {
      if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
    }
    await page.locator('[data-testid="view-cart-button"]').first().click();
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible({ timeout: 3000 });
  });

  test('cart checkout button routes to cart-details', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
    if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    const count = await addBtns.count();
    for (let i = 0; i < count; i++) {
      if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
    }
    await page.locator('[data-testid="view-cart-button"]').first().click();
    await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
    await page.locator('[data-testid="cart-checkout-button"]').click();
    await expect(page).toHaveURL(/\/store\/cart-details/);
  });

  test('sticky checkout bar appears when cart has items', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
    if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    const count = await addBtns.count();
    for (let i = 0; i < count; i++) {
      if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
    }
    await expect(page.locator('[data-testid="store-sticky-checkout"]')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('[data-testid="store-sticky-checkout-button"]')).toBeVisible();
  });

  test('sticky checkout button routes to cart-details', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
    if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    const count = await addBtns.count();
    for (let i = 0; i < count; i++) {
      if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
    }
    await page.locator('[data-testid="store-sticky-checkout-button"]').click();
    await expect(page).toHaveURL(/\/store\/cart-details/);
  });

  test('go-to-checkout button from confirmation routes to cart-details', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
    if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    const count = await addBtns.count();
    for (let i = 0; i < count; i++) {
      if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
    }
    const checkoutBtn = page.locator('[data-testid="go-to-checkout-button"]').first();
    await checkoutBtn.click();
    await expect(page).toHaveURL(/\/store\/cart-details/);
  });

  test('cart count badge shows item count', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/all`);
    const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
    if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    const count = await addBtns.count();
    for (let i = 0; i < count; i++) {
      if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
    }
    await expect(page.locator('[data-testid="cart-count"]')).toBeVisible({ timeout: 3000 });
    const text = await page.locator('[data-testid="cart-count"]').textContent();
    expect(parseInt(text)).toBeGreaterThan(0);
  });
});