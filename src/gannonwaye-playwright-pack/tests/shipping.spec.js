// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

const DETAILS = { full_name: 'Test User', email: 'test@example.com', mobile: '0400000000', street_address: '123 Test St', suburb: 'Melbourne', state: 'VIC', postcode: '3000', country: 'Australia', dob: '', business_name: '', abn: '', order_only: true, subscribe_community: false };
const INTERNATIONAL_DETAILS = { ...DETAILS, state: '', country: 'New Zealand' };

async function seedCheckout(page, items, details = DETAILS) {
  await page.goto(`${BASE_URL}/store/all`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(([cartItems, customerDetails]) => {
    const cart = { state: { items: cartItems, __version: 3 }, version: 0 };
    localStorage.setItem('gannon_store_cart_v2', JSON.stringify(cart));
    localStorage.setItem('gannon_checkout_details_v1', JSON.stringify(customerDetails));
  }, [items, details]);
  await page.goto(`${BASE_URL}/store/checkout`, { waitUntil: 'domcontentloaded' });
}

test.describe('Shipping Rules', () => {
  test('shipping appears on checkout page', async ({ page }) => {
    const items = [{ product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }];
    await seedCheckout(page, items);
    await expect(page.locator('[data-testid="checkout-shipping"]')).toBeVisible();
  });

  test('shipping starts at $12.95 for 1 item', async ({ page }) => {
    const items = [{ product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }];
    await seedCheckout(page, items);
    const shippingEl = page.locator('[data-testid="checkout-shipping"]');
    await expect(shippingEl).toContainText('12.95');
  });

  test('shipping caps at $20 for large orders', async ({ page }) => {
    // 5 items should push past $20
    const items = Array.from({ length: 5 }, (_, i) => ({
      product_id: `p${i}`, product: { id: `p${i}`, name: `Item ${i}`, sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now()
    }));
    await seedCheckout(page, items);
    const shippingEl = page.locator('[data-testid="checkout-shipping"]');
    const text = await shippingEl.textContent();
    // Should show $20.00 (capped), not more
    const numbers = text.match(/\d+\.\d+/g) || [];
    const shippingAmt = parseFloat(numbers[0] || '0');
    expect(shippingAmt).toBeLessThanOrEqual(20.00);
  });

  test('no free shipping text appears on store page', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`, { waitUntil: 'domcontentloaded' });
    const content = await page.content();
    expect(content.toLowerCase()).not.toContain('free shipping');
    expect(content.toLowerCase()).not.toContain('free postage');
  });

  test('no free shipping text appears on checkout page', async ({ page }) => {
    const items = [{ product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }];
    await seedCheckout(page, items);
    const content = await page.content();
    expect(content.toLowerCase()).not.toContain('free shipping');
  });

  test('shipping is calculated once (not per item)', async ({ page }) => {
    const items = [
      { product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() },
      { product_id: 'p2', product: { id: 'p2', name: 'Mug', sale_price: 9.90, category: 'accessories', image_url: '' }, quantity: 1, size: 'One size', added_at: Date.now() },
    ];
    await seedCheckout(page, items);
    await expect(page.getByText('Shipping', { exact: true })).toHaveCount(1);
  });

  test('shipping is not discounted by promo codes', async ({ page }) => {
    const items = [{ product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }];
    await seedCheckout(page, items);
    // Apply a promo
    await page.fill('[data-testid="promo-code-input"]', 'F20UN26DVIP');
    await page.locator('[data-testid="apply-promo-code"]').click();
    await page.waitForTimeout(2000);
    // Shipping should still show a dollar amount (not free or $0)
    const shippingEl = page.locator('[data-testid="checkout-shipping"]');
    const text = await shippingEl.textContent();
    const numbers = text.match(/\d+\.\d+/g) || [];
    if (numbers.length > 0) {
      const shippingAmt = parseFloat(numbers[0]);
      expect(shippingAmt).toBeGreaterThan(0);
    }
  });

  test('international physical checkout is blocked until shipping is quoted', async ({ page }) => {
    const items = [{ product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }];
    await seedCheckout(page, items, INTERNATIONAL_DETAILS);

    await expect(page.locator('[data-testid="checkout-shipping"]')).toContainText(/quote required/i);
    await expect(page.locator('[data-testid="international-shipping-block"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-pay-button"]')).toBeDisabled();
  });
});
