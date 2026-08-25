# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment-success.spec.js >> Payment Success & Cancel Routes >> /payment-success returns 200 and shows page
- Location: src/gannonwaye-playwright-pack/tests/payment-success.spec.js:21:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="checkout-success-page"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="checkout-success-page"]')

```

```yaml
- link "Support Now":
  - /url: /back-this
  - button "Support Now"
- heading "404" [level=1]
- heading "Page Not Found" [level=2]
- paragraph: The page "payment-success" could not be found.
- button "Go Home"
```

# Test source

```ts
  1  | // @ts-check
  2  |  
  3  | /* eslint-disable no-undef */
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
> 24 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
     |                                                                         ^ Error: expect(locator).toBeVisible() failed
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
  45 |   test('/checkout-success with session_id shows reference', async ({ page }) => {
  46 |     await page.goto(`${BASE_URL}/checkout-success?session_id=cs_test_abc123`);
  47 |     await expect(page.locator('[data-testid="checkout-success-page"]')).toBeVisible();
  48 |     await expect(page.locator('text=cs_test_abc123')).toBeVisible();
  49 |   });
  50 | 
  51 |   test('success page has Return to Store button', async ({ page }) => {
  52 |     await page.goto(`${BASE_URL}/checkout-success`);
  53 |     await expect(page.locator('text=Return to Store')).toBeVisible();
  54 |   });
  55 | 
  56 |   test('cancel page has Return to Store button', async ({ page }) => {
  57 |     await page.goto(`${BASE_URL}/checkout-cancel`);
  58 |     const returnBtn = page.locator('text=Return to Store');
  59 |     await expect(returnBtn).toBeVisible();
  60 |     await returnBtn.click();
  61 |     await expect(page).toHaveURL(/\/store/);
  62 |   });
  63 | 
  64 |   test('no 404 page shown on any success/cancel route', async ({ page }) => {
  65 |     const routes = [
  66 |       '/checkout-success',
  67 |       '/store/checkout-success',
  68 |       '/payment-success',
  69 |       '/order-success',
  70 |       '/checkout-cancel',
  71 |       '/store/checkout-cancel',
  72 |     ];
  73 |     for (const route of routes) {
  74 |       await page.goto(`${BASE_URL}${route}`);
  75 |       const content = await page.content();
  76 |       expect(content.toLowerCase()).not.toContain('could not be found');
  77 |       expect(content.toLowerCase()).not.toContain('page not found');
  78 |     }
  79 |   });
  80 | });
```