/* eslint-disable no-undef */
// @ts-check
 
 
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Payment Success & Cancel Routes', () => {
  test('/checkout-success returns 200 and shows page', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/checkout-success`);
    expect(response?.status()).not.toBe(404);
    await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  });

  test('/store/checkout-success returns 200 and shows page', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/store/checkout-success`);
    expect(response?.status()).not.toBe(404);
    await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  });

  test('/payment-success returns 200 and shows page', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/payment-success`);
    expect(response?.status()).not.toBe(404);
    await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  });

  test('/order-success returns 200 and shows page', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/order-success`);
    expect(response?.status()).not.toBe(404);
    await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  });

  test('/checkout-cancel returns 200 and shows cancel page', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/checkout-cancel`);
    expect(response?.status()).not.toBe(404);
    await expect(page.locator('text=Checkout Cancelled')).toBeVisible();
  });

  test('/store/checkout-cancel returns 200 and shows cancel page', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/store/checkout-cancel`);
    expect(response?.status()).not.toBe(404);
    await expect(page.locator('text=Checkout Cancelled')).toBeVisible();
  });

  test('invalid session_id cannot claim payment or expose a reference', async ({ page }) => {
    const invalidSessionId = 'cs_test_abc123';
    await page.goto(`${BASE_URL}/checkout-success?session_id=${invalidSessionId}`);

    await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Payment Not Confirmed' })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Payment (?:Confirmed|Received)/ })).toHaveCount(0);
    await expect(page.getByText(invalidSessionId, { exact: false })).toHaveCount(0);
    await expect(page.getByText(/Ending [A-Za-z0-9]+/)).toHaveCount(0);
  });

  test('syntactically valid fake is masked and still cannot claim payment', async ({ page }) => {
    const fakeSessionId = 'cs_test_A1B2C3D4E5F6G7H8';
    await page.goto(`${BASE_URL}/checkout-success?session_id=${fakeSessionId}`);

    await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
    await expect(page.getByText('Ending E5F6G7H8', { exact: true })).toBeVisible();
    await expect(page.getByText(fakeSessionId, { exact: false })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /Payment (?:Confirmed|Received)/ })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Payment Not Confirmed' })).toBeVisible({ timeout: 20000 });
  });

  test('success page has Return to Store button', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout-success`);
    await expect(page.locator('text=Return to Store')).toBeVisible();
  });

  test('cancel page has Return to Store button', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout-cancel`);
    const returnBtn = page.locator('text=Return to Store');
    await expect(returnBtn).toBeVisible();
    await returnBtn.click();
    await expect(page).toHaveURL(/\/store/);
  });

  test('no 404 page shown on any success/cancel route', async ({ page }) => {
    const routes = [
      '/checkout-success',
      '/store/checkout-success',
      '/payment-success',
      '/order-success',
      '/checkout-cancel',
      '/store/checkout-cancel',
    ];
    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`);
      const content = await page.content();
      expect(content.toLowerCase()).not.toContain('could not be found');
      expect(content.toLowerCase()).not.toContain('page not found');
    }
  });
});