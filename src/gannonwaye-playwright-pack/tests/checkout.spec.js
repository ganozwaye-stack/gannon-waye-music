/* eslint-disable no-undef -- vendored Playwright pack: CommonJS globals (require/process) are valid in Node test context */
// @ts-check
const { test, expect } = require('@playwright/test');

const DETAILS = {
  full_name: 'Checkout Verification',
  email: 'checkout-verification@example.com',
  mobile: '+61 400 000 000',
  street_address: '123 Verification Street',
  suburb: 'Melbourne',
  state: 'VIC',
  postcode: '3000',
  country: 'Australia',
  order_support_consent: true,
  marketing_opt_in: false,
};

async function prepareDetails(page) {
  await page.goto('/store');
  await page.evaluate(details => {
    localStorage.setItem('gannon_checkout_details_v1', JSON.stringify(details));
  }, DETAILS);
}

async function addHoodie(page, size = 'M') {
  const card = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: new RegExp(`^${size} \\(`) }).click();
  await card.locator('[data-testid="add-to-cart-btn"]').click();
  await expect(card.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
}

async function addBundle(page) {
  const card = page.locator('[data-testid="product-card"]').filter({ hasText: 'Journal Pen and Thermos' }).first();
  await expect(card).toBeVisible();
  await card.locator('[data-testid="add-to-cart-btn"]').click();
  await expect(card.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
}

async function openCheckoutWithBundle(page) {
  await prepareDetails(page);
  await addBundle(page);
  await page.goto('/store/checkout');
  await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
}

test.describe('Order review and checkout page', () => {
  test('checkout page loads with verified cart item and summaries', async ({ page }) => {
    await openCheckoutWithBundle(page);
    await expect(page.locator('[data-testid="checkout-items"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-customer-summary"]')).toContainText('Checkout Verification');
    await expect(page.locator('[data-testid="checkout-delivery-summary"]')).toContainText('Melbourne');
    await expect(page.locator('[data-testid="cart-line"]').first()).toContainText('Journal Pen and Thermos');
  });

  test('customer can increase and decrease within verified stock', async ({ page }) => {
    await openCheckoutWithBundle(page);
    const line = page.locator('[data-testid="cart-line"]').first();
    await line.locator('[data-testid="cart-line-increase"]').click();
    await expect(line).toContainText('$118.00 AUD');
    await line.locator('[data-testid="cart-line-decrease"]').click();
    await expect(line).toContainText('$59.00 AUD');
  });

  test('customer can remove the item', async ({ page }) => {
    await openCheckoutWithBundle(page);
    await page.locator('[data-testid="cart-line-remove"]').first().click();
    await expect(page.locator('[data-testid="empty-cart-return-store"]')).toBeVisible();
  });

  test('different hoodie sizes remain separate cart lines', async ({ page }) => {
    await prepareDetails(page);
    await addHoodie(page, 'M');
    await page.goto('/store');
    await addHoodie(page, 'L');
    await page.goto('/store/checkout');
    await expect(page.locator('[data-testid="cart-line"]')).toHaveCount(2);
    await expect(page.locator('[data-testid="cart-line"]').filter({ hasText: 'Size: M' })).toBeVisible();
    await expect(page.locator('[data-testid="cart-line"]').filter({ hasText: 'Size: L' })).toBeVisible();
  });

  test('stage one checkout has no promo code or support add-on controls', async ({ page }) => {
    await openCheckoutWithBundle(page);
    await expect(page.locator('[data-testid="promo-code-input"]')).toHaveCount(0);
    await expect(page.getByText(/support contribution/i)).toHaveCount(0);
  });

  test('delivery appears once and the totals are visible', async ({ page }) => {
    await openCheckoutWithBundle(page);
    await expect(page.locator('[data-testid="checkout-shipping"]')).toHaveCount(1);
    await expect(page.locator('[data-testid="checkout-shipping"]')).toContainText('$17.50 AUD');
    await expect(page.locator('[data-testid="checkout-subtotal"]')).toContainText('$59.00');
    await expect(page.locator('[data-testid="checkout-total"]')).toContainText('$76.50 AUD');
  });

  test('pay button is enabled only after delivery is ready', async ({ page }) => {
    await openCheckoutWithBundle(page);
    const pay = page.locator('[data-testid="checkout-pay-button"]');
    await expect(pay).toBeVisible();
    await expect(pay).toBeEnabled();
    await expect(pay).toContainText('$76.50 AUD');
  });

  test('empty cart returns the customer to the store', async ({ page }) => {
    await page.goto('/store');
    await page.evaluate(() => {
      localStorage.removeItem('gannon_store_cart_v2');
    });
    await page.goto('/store/checkout');
    await expect(page.locator('[data-testid="empty-cart-return-store"]')).toBeVisible();
  });
});