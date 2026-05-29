// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:5173';

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

  test('/checkout-success with session_id shows reference', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout-success?session_id=cs_test_abc123`);
    await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
    await expect(page.locator('text=cs_test_abc123')).toBeVisible();
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