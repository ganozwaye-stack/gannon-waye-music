// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Merch store product safeguards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/store');
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  });

  test('journal bundle is $59 and available', async ({ page }) => {
    const bundle = page.locator('[data-testid="product-card"]').filter({ hasText: 'Journal Pen and Thermos' }).first();
    await expect(bundle).toBeVisible();
    await expect(bundle.locator('[data-testid="product-price"]')).toContainText('$59');
    await expect(bundle.locator('[data-testid="add-to-cart-btn"]')).toBeVisible();
  });

  test('hoodie is $98 with only S, M, L and XL', async ({ page }) => {
    const hoodie = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
    await expect(hoodie.locator('[data-testid="product-price"]')).toContainText('$98');
    const sizeButtons = hoodie.getByRole('button').filter({ hasText: /^(S|M|L|XL) \(\d+\)$/ });
    await expect(sizeButtons).toHaveCount(4);
    await expect(hoodie.getByRole('button', { name: /XS|2XL|3XL|XXL/ })).toHaveCount(0);
  });

  test('winter bundle, mug and posters are not offered for sale', async ({ page }) => {
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('Winter Writing & Comfort Bundle');
    expect(body).not.toContain('Coffee Mug');
    expect(body).not.toContain('Wall Poster');
  });

  test('stage one checkout does not expose promo controls', async ({ page }) => {
    const bundle = page.locator('[data-testid="product-card"]').filter({ hasText: 'Journal Pen and Thermos' }).first();
    await bundle.locator('[data-testid="add-to-cart-btn"]').click();
    await page.evaluate(() => {
      localStorage.setItem('gannon_checkout_details_v1', JSON.stringify({
        full_name: 'Merch Test',
        email: 'merch-test@example.com',
        mobile: '+61 400 000 000',
        street_address: '123 Test Street',
        suburb: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        country: 'Australia',
        order_support_consent: true,
        marketing_opt_in: false,
      }));
    });
    await page.goto('/store/checkout');
    await expect(page.locator('[data-testid="checkout-pay-button"]')).toBeEnabled();
    await expect(page.locator('[data-testid="promo-code-input"]')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText('Apply promo');
  });
});
