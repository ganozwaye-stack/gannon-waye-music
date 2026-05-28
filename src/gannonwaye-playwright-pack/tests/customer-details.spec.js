// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

const DETAILS = { full_name: 'Test User', email: 'test@example.com', mobile: '0400000000', street_address: '123 Test St', suburb: 'Melbourne', state: 'VIC', postcode: '3000', country: 'Australia', dob: '', business_name: '', abn: '', order_only: true, subscribe_community: false };

async function seedCart(page) {
  await page.goto(`${BASE_URL}/store`);
  await page.evaluate(() => {
    const cart = { state: { items: [{ product_id: 'p1', product: { id: 'p1', name: 'Test Product', sale_price: 30, category: 'apparel', image_url: '' }, quantity: 1, size: 'M', added_at: Date.now() }], __version: 3 }, version: 0 };
    localStorage.setItem('gannon_store_cart_v2', JSON.stringify(cart));
  });
}

test.describe('Customer Details Page', () => {
  test('loads at /store/customer-details', async ({ page }) => {
    await seedCart(page);
    await page.goto(`${BASE_URL}/store/customer-details`);
    await expect(page.locator('[data-testid="customer-details-page"]')).toBeVisible();
  });

  test('required fields block continuation when empty', async ({ page }) => {
    await seedCart(page);
    await page.goto(`${BASE_URL}/store/customer-details`);
    await page.locator('[data-testid="continue-to-order-review"]').click();
    await expect(page.locator('.text-destructive').first()).toBeVisible();
  });

  test('all required fields have correct testids', async ({ page }) => {
    await seedCart(page);
    await page.goto(`${BASE_URL}/store/customer-details`);
    for (const id of ['customer-full-name','customer-email','customer-mobile','customer-street-address','customer-suburb','customer-postcode']) {
      await expect(page.locator(`[data-testid="${id}"]`)).toBeVisible();
    }
  });

  test('optional fields (DOB, business, ABN) do not block', async ({ page }) => {
    await seedCart(page);
    await page.goto(`${BASE_URL}/store/customer-details`);
    await page.fill('[data-testid="customer-full-name"]', DETAILS.full_name);
    await page.fill('[data-testid="customer-email"]', DETAILS.email);
    await page.fill('[data-testid="customer-mobile"]', DETAILS.mobile);
    await page.fill('[data-testid="customer-street-address"]', DETAILS.street_address);
    await page.fill('[data-testid="customer-suburb"]', DETAILS.suburb);
    const state = page.locator('[data-testid="customer-state"]');
    const tag = await state.evaluate(el => el.tagName);
    if (tag === 'SELECT') await state.selectOption('VIC'); else await state.fill('VIC');
    await page.fill('[data-testid="customer-postcode"]', DETAILS.postcode);
    // Do NOT fill DOB/business/ABN
    await page.locator('[data-testid="continue-to-order-review"]').click();
    await expect(page).toHaveURL(/checkout/);
  });

  test('order-only option is present', async ({ page }) => {
    await seedCart(page);
    await page.goto(`${BASE_URL}/store/customer-details`);
    await expect(page.locator('[data-testid="order-only-option"]')).toBeVisible();
  });

  test('subscribe-community option is present', async ({ page }) => {
    await seedCart(page);
    await page.goto(`${BASE_URL}/store/customer-details`);
    await expect(page.locator('[data-testid="subscribe-community-option"]')).toBeVisible();
  });
});