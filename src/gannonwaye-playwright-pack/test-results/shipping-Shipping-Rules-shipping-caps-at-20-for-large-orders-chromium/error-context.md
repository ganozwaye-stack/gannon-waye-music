# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shipping.spec.js >> Shipping Rules >> shipping caps at $20 for large orders
- Location: tests\shipping.spec.js:32:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/store/checkout", waiting until "load"

```

# Test source

```ts
  1  | // @ts-check
  2  | /* eslint-disable no-undef */
  3  | const { test, expect } = require('@playwright/test');
  4  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  5  | 
  6  | const DETAILS = { full_name: 'Test User', email: 'test@example.com', mobile: '0400000000', street_address: '123 Test St', suburb: 'Melbourne', state: 'VIC', postcode: '3000', country: 'Australia', dob: '', business_name: '', abn: '', order_only: true, subscribe_community: false };
  7  | 
  8  | async function seedCheckout(page, items) {
  9  |   await page.goto(`${BASE_URL}/store`);
  10 |   await page.evaluate(([cartItems, details]) => {
  11 |     const cart = { state: { items: cartItems, __version: 3 }, version: 0 };
  12 |     localStorage.setItem('gannon_store_cart_v2', JSON.stringify(cart));
  13 |     localStorage.setItem('gannon_checkout_details_v1', JSON.stringify(details));
  14 |   }, [items, DETAILS]);
> 15 |   await page.goto(`${BASE_URL}/store/checkout`);
     |              ^ Error: page.goto: Test timeout of 30000ms exceeded.
  16 | }
  17 | 
  18 | test.describe('Shipping Rules', () => {
  19 |   test('shipping appears on checkout page', async ({ page }) => {
  20 |     const items = [{ product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }];
  21 |     await seedCheckout(page, items);
  22 |     await expect(page.locator('[data-testid="checkout-shipping"]')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('shipping starts at $12.95 for 1 item', async ({ page }) => {
  26 |     const items = [{ product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }];
  27 |     await seedCheckout(page, items);
  28 |     const shippingEl = page.locator('[data-testid="checkout-shipping"]');
  29 |     await expect(shippingEl).toContainText('12.95');
  30 |   });
  31 | 
  32 |   test('shipping caps at $20 for large orders', async ({ page }) => {
  33 |     // 5 items should push past $20
  34 |     const items = Array.from({ length: 5 }, (_, i) => ({
  35 |       product_id: `p${i}`, product: { id: `p${i}`, name: `Item ${i}`, sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now()
  36 |     }));
  37 |     await seedCheckout(page, items);
  38 |     const shippingEl = page.locator('[data-testid="checkout-shipping"]');
  39 |     const text = await shippingEl.textContent();
  40 |     // Should show $20.00 (capped), not more
  41 |     const numbers = text.match(/\d+\.\d+/g) || [];
  42 |     const shippingAmt = parseFloat(numbers[0] || '0');
  43 |     expect(shippingAmt).toBeLessThanOrEqual(20.00);
  44 |   });
  45 | 
  46 |   test('no free shipping text appears on store page', async ({ page }) => {
  47 |     await page.goto(`${BASE_URL}/store`);
  48 |     const content = await page.content();
  49 |     expect(content.toLowerCase()).not.toContain('free shipping');
  50 |     expect(content.toLowerCase()).not.toContain('free postage');
  51 |   });
  52 | 
  53 |   test('no free shipping text appears on checkout page', async ({ page }) => {
  54 |     const items = [{ product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }];
  55 |     await seedCheckout(page, items);
  56 |     const content = await page.content();
  57 |     expect(content.toLowerCase()).not.toContain('free shipping');
  58 |   });
  59 | 
  60 |   test('shipping is calculated once (not per item)', async ({ page }) => {
  61 |     const items = [
  62 |       { product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() },
  63 |       { product_id: 'p2', product: { id: 'p2', name: 'Hoodie', sale_price: 98, category: 'apparel', image_url: '' }, quantity: 1, size: 'L', added_at: Date.now() },
  64 |     ];
  65 |     await seedCheckout(page, items);
  66 |     const count = await page.locator('[data-testid="checkout-shipping"]').count();
  67 |     expect(count).toBe(1);
  68 |   });
  69 | 
  70 |   test('shipping is not discounted by promo codes', async ({ page }) => {
  71 |     const items = [{ product_id: 'p1', product: { id: 'p1', name: 'Tee', sale_price: 59, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }];
  72 |     await seedCheckout(page, items);
  73 |     // Apply a promo
  74 |     await page.fill('[data-testid="promo-code-input"]', 'F20UN26DVIP');
  75 |     await page.locator('[data-testid="apply-promo-code"]').click();
  76 |     await page.waitForTimeout(2000);
  77 |     // Shipping should still show a dollar amount (not free or $0)
  78 |     const shippingEl = page.locator('[data-testid="checkout-shipping"]');
  79 |     const text = await shippingEl.textContent();
  80 |     const numbers = text.match(/\d+\.\d+/g) || [];
  81 |     if (numbers.length > 0) {
  82 |       const shippingAmt = parseFloat(numbers[0]);
  83 |       expect(shippingAmt).toBeGreaterThan(0);
  84 |     }
  85 |   });
  86 | });
```