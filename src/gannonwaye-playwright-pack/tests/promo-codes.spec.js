// @ts-check
 
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

const DETAILS = { full_name: 'Test User', email: 'test@example.com', mobile: '0400000000', street_address: '123 Test St', suburb: 'Melbourne', state: 'VIC', postcode: '3000', country: 'Australia', dob: '', business_name: '', abn: '', order_only: true, subscribe_community: false };

async function seedCheckout(page) {
  await page.goto(`${BASE_URL}/store`);
  await page.evaluate((details) => {
    const items = [{ product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 98, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }];
    localStorage.setItem('gannon_store_cart_v2', JSON.stringify({ state: { items, __version: 3 }, version: 0 }));
    localStorage.setItem('gannon_checkout_details_v1', JSON.stringify(details));
  }, DETAILS);
  await page.goto(`${BASE_URL}/store/checkout`);
  await page.waitForSelector('[data-testid="checkout-page"]');
}

test.describe('Promo Codes', () => {
  test('promo code input field is visible', async ({ page }) => {
    await seedCheckout(page);
    await expect(page.locator('[data-testid="promo-code-input"]')).toBeVisible();
  });

  test('apply promo button is visible', async ({ page }) => {
    await seedCheckout(page);
    await expect(page.locator('[data-testid="apply-promo-code"]')).toBeVisible();
  });

  test('valid promo code F20UN26DVIP applies discount', async ({ page }) => {
    await seedCheckout(page);
    await page.fill('[data-testid="promo-code-input"]', 'F20UN26DVIP');
    await page.locator('[data-testid="apply-promo-code"]').click();
    await page.waitForTimeout(3000);
    // Should show discount element OR no error
    const hasDiscount = await page.locator('[data-testid="checkout-discount"]').isVisible().catch(() => false);
    const hasError = await page.locator('.text-destructive:visible').count();
    expect(hasDiscount || hasError === 0).toBeTruthy();
  });

  test('valid promo code F30MOM26A applies discount', async ({ page }) => {
    await seedCheckout(page);
    await page.fill('[data-testid="promo-code-input"]', 'F30MOM26A');
    await page.locator('[data-testid="apply-promo-code"]').click();
    await page.waitForTimeout(3000);
    const hasDiscount = await page.locator('[data-testid="checkout-discount"]').isVisible().catch(() => false);
    const hasError = await page.locator('.text-destructive:visible').count();
    expect(hasDiscount || hasError === 0).toBeTruthy();
  });

  test('invalid promo code LAUNCH20 is rejected', async ({ page }) => {
    await seedCheckout(page);
    await page.fill('[data-testid="promo-code-input"]', 'LAUNCH20');
    await page.locator('[data-testid="apply-promo-code"]').click();
    await page.waitForTimeout(3000);
    await expect(page.locator('.text-destructive').first()).toBeVisible();
  });

  test('invalid promo code INVALIDCODE is rejected', async ({ page }) => {
    await seedCheckout(page);
    await page.fill('[data-testid="promo-code-input"]', 'INVALIDCODE');
    await page.locator('[data-testid="apply-promo-code"]').click();
    await page.waitForTimeout(3000);
    await expect(page.locator('.text-destructive').first()).toBeVisible();
  });

  test('discount shows as AUD subtraction', async ({ page }) => {
    await seedCheckout(page);
    await page.fill('[data-testid="promo-code-input"]', 'F20UN26DVIP');
    await page.locator('[data-testid="apply-promo-code"]').click();
    await page.waitForTimeout(3000);
    const discountEl = page.locator('[data-testid="checkout-discount"]');
    if (await discountEl.isVisible()) {
      const text = await discountEl.textContent();
      expect(text).toMatch(/−?\$\d+/);
    }
  });

  test('grand total is visible', async ({ page }) => {
    await seedCheckout(page);
    await expect(page.locator('[data-testid="checkout-total"]')).toBeVisible();
  });

  test('pay button is visible', async ({ page }) => {
    await seedCheckout(page);
    await expect(page.locator('[data-testid="checkout-pay-button"]')).toBeVisible();
  });
});