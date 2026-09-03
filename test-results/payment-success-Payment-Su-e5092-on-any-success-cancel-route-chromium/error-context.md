# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment-success.spec.js >> Payment Success & Cancel Routes >> no 404 page shown on any success/cancel route
- Location: src/gannonwaye-playwright-pack/tests/payment-success.spec.js:80:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/payment-success", waiting until "load"

```

# Test source

```ts
  1  | // @ts-check
  2  |  
  3  |  
  4  | const { test, expect } = require('@playwright/test');
  5  | 
  6  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  7  | 
  8  | test.describe('Payment Success & Cancel Routes', () => {
  9  |   test('/checkout-success returns 200 and shows page', async ({ page }) => {
  10 |     const response = await page.goto(`${BASE_URL}/checkout-success`);
  11 |     expect(response?.status()).not.toBe(404);
  12 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  13 |   });
  14 | 
  15 |   test('/store/checkout-success returns 200 and shows page', async ({ page }) => {
  16 |     const response = await page.goto(`${BASE_URL}/store/checkout-success`);
  17 |     expect(response?.status()).not.toBe(404);
  18 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  19 |   });
  20 | 
  21 |   test('/payment-success returns 200 and shows page', async ({ page }) => {
  22 |     const response = await page.goto(`${BASE_URL}/payment-success`);
  23 |     expect(response?.status()).not.toBe(404);
  24 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  25 |   });
  26 | 
  27 |   test('/order-success returns 200 and shows page', async ({ page }) => {
  28 |     const response = await page.goto(`${BASE_URL}/order-success`);
  29 |     expect(response?.status()).not.toBe(404);
  30 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('/checkout-cancel returns 200 and shows cancel page', async ({ page }) => {
  34 |     const response = await page.goto(`${BASE_URL}/checkout-cancel`);
  35 |     expect(response?.status()).not.toBe(404);
  36 |     await expect(page.locator('text=Checkout Cancelled')).toBeVisible();
  37 |   });
  38 | 
  39 |   test('/store/checkout-cancel returns 200 and shows cancel page', async ({ page }) => {
  40 |     const response = await page.goto(`${BASE_URL}/store/checkout-cancel`);
  41 |     expect(response?.status()).not.toBe(404);
  42 |     await expect(page.locator('text=Checkout Cancelled')).toBeVisible();
  43 |   });
  44 | 
  45 |   test('invalid session_id cannot claim payment or expose a reference', async ({ page }) => {
  46 |     const invalidSessionId = 'cs_test_abc123';
  47 |     await page.goto(`${BASE_URL}/checkout-success?session_id=${invalidSessionId}`);
  48 | 
  49 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  50 |     await expect(page.getByRole('heading', { name: 'Payment Not Confirmed' })).toBeVisible();
  51 |     await expect(page.getByRole('heading', { name: /Payment (?:Confirmed|Received)/ })).toHaveCount(0);
  52 |     await expect(page.getByText(invalidSessionId, { exact: false })).toHaveCount(0);
  53 |     await expect(page.getByText(/Ending [A-Za-z0-9]+/)).toHaveCount(0);
  54 |   });
  55 | 
  56 |   test('syntactically valid fake is masked and still cannot claim payment', async ({ page }) => {
  57 |     const fakeSessionId = 'cs_test_A1B2C3D4E5F6G7H8';
  58 |     await page.goto(`${BASE_URL}/checkout-success?session_id=${fakeSessionId}`);
  59 | 
  60 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  61 |     await expect(page.getByText('Ending E5F6G7H8', { exact: true })).toBeVisible();
  62 |     await expect(page.getByText(fakeSessionId, { exact: false })).toHaveCount(0);
  63 |     await expect(page.getByRole('heading', { name: /Payment (?:Confirmed|Received)/ })).toHaveCount(0);
  64 |     await expect(page.getByRole('heading', { name: 'Payment Not Confirmed' })).toBeVisible({ timeout: 20000 });
  65 |   });
  66 | 
  67 |   test('success page has Return to Store button', async ({ page }) => {
  68 |     await page.goto(`${BASE_URL}/checkout-success`);
  69 |     await expect(page.locator('text=Return to Store')).toBeVisible();
  70 |   });
  71 | 
  72 |   test('cancel page has Return to Store button', async ({ page }) => {
  73 |     await page.goto(`${BASE_URL}/checkout-cancel`);
  74 |     const returnBtn = page.locator('text=Return to Store');
  75 |     await expect(returnBtn).toBeVisible();
  76 |     await returnBtn.click();
  77 |     await expect(page).toHaveURL(/\/store/);
  78 |   });
  79 | 
  80 |   test('no 404 page shown on any success/cancel route', async ({ page }) => {
  81 |     const routes = [
  82 |       '/checkout-success',
  83 |       '/store/checkout-success',
  84 |       '/payment-success',
  85 |       '/order-success',
  86 |       '/checkout-cancel',
  87 |       '/store/checkout-cancel',
  88 |     ];
  89 |     for (const route of routes) {
> 90 |       await page.goto(`${BASE_URL}${route}`);
     |                  ^ Error: page.goto: Test timeout of 60000ms exceeded.
  91 |       const content = await page.content();
  92 |       expect(content.toLowerCase()).not.toContain('could not be found');
  93 |       expect(content.toLowerCase()).not.toContain('page not found');
  94 |     }
  95 |   });
  96 | });
```