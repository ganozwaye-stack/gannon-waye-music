import { test, expect } from '@playwright/test';

const DETAILS = {
  full_name: 'Store Verification',
  email: 'store-verification@example.com',
  mobile: '+61 400 000 000',
  street_address: '123 Verification Street',
  suburb: 'Melbourne',
  state: 'VIC',
  postcode: '3000',
  country: 'Australia',
  order_support_consent: true,
};

async function openStoreWithDetails(page) {
  await page.goto('/store');
  await page.evaluate(details => {
    sessionStorage.setItem('gannon_checkout_details_v1', JSON.stringify({ ...details, _saved_at: Date.now() }));
  }, DETAILS);
}

async function addHoodie(page, size = 'M') {
  const card = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: new RegExp(`^Select size ${size}\\b`) }).click();
  await card.locator('[data-testid="add-to-cart-btn"]').click();
  await expect(card.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
}

async function addBundle(page) {
  const card = page.locator('[data-testid="product-card"]').filter({ hasText: 'Journal Pen and Thermos' }).first();
  await expect(card).toBeVisible();
  await card.locator('[data-testid="add-to-cart-btn"]').click();
  await expect(card.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
}

async function openCheckout(page) {
  await page.goto('/store/checkout');
  await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
  await expect(page.locator('[data-testid="checkout-pay-button"]')).toBeEnabled();
}

test.describe('Stage one checkout preview', () => {
  test('hoodie uses verified price, Australian merch delivery and no GST', async ({ page }) => {
    await openStoreWithDetails(page);
    await addHoodie(page, 'M');
    await openCheckout(page);

    await expect(page.locator('[data-testid="checkout-subtotal"]')).toContainText('$98.00');
    await expect(page.locator('[data-testid="checkout-shipping"]')).toContainText('$12.50 AUD');
    await expect(page.locator('[data-testid="checkout-total"]')).toContainText('$110.50 AUD');
    await expect(page.locator('[data-testid="checkout-pay-button"]')).toContainText('$110.50 AUD');
    await expect(page.locator('body')).toContainText('No GST is charged');
    await expect(page.locator('body')).not.toContainText('Includes GST');
  });

  test('journal bundle uses verified price and bundle delivery rule', async ({ page }) => {
    await openStoreWithDetails(page);
    await addBundle(page);
    await openCheckout(page);

    await expect(page.locator('[data-testid="checkout-subtotal"]')).toContainText('$59.00');
    await expect(page.locator('[data-testid="checkout-shipping"]')).toContainText('$17.50 AUD');
    await expect(page.locator('[data-testid="checkout-total"]')).toContainText('$76.50 AUD');
    await expect(page.locator('[data-testid="checkout-pay-button"]')).toContainText('$76.50 AUD');
  });

  test('mixed order uses the governing live rule and configured threshold', async ({ page }) => {
    await openStoreWithDetails(page);
    await addHoodie(page, 'S');
    await page.goto('/store');
    await addBundle(page);
    await openCheckout(page);

    await expect(page.locator('[data-testid="checkout-subtotal"]')).toContainText('$157.00');
    await expect(page.locator('[data-testid="checkout-shipping"]')).toContainText('No delivery charge');
    await expect(page.locator('[data-testid="checkout-total"]')).toContainText('$157.00 AUD');
  });

  test('cart quantity cannot exceed the verified hoodie size stock', async ({ page }) => {
    await openStoreWithDetails(page);
    await addHoodie(page, 'S');
    await openCheckout(page);

    const increase = page.locator('[data-testid="cart-line-increase"]').first();
    await increase.click();
    await increase.click();
    await expect(increase).toBeDisabled();
    await expect(page.locator('[data-testid="cart-line"]').first()).toContainText('$294.00 AUD');
  });
});
