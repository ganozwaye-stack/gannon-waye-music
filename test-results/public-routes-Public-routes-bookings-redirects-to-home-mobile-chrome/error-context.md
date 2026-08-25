# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-routes.spec.js >> Public routes >> /bookings redirects to home
- Location: src/gannonwaye-playwright-pack/tests/public-routes.spec.js:37:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:4173/"
Received: "http://localhost:4173/bookings"
Timeout:  10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    17 × unexpected value "http://localhost:4173/bookings"

```

```yaml
- link "Support Now":
  - /url: /back-this
  - button "Support Now"
- heading "404" [level=1]
- heading "Page Not Found" [level=2]
- paragraph: The page "bookings" could not be found.
- button "Go Home"
```

# Test source

```ts
  1  | // tests/public-routes.spec.js
  2  | // Verifies public routes load correctly and bookings/tours are hidden
  3  | 
  4  | /* eslint-disable no-undef */
  5  | import { test, expect } from '@playwright/test';
  6  | 
  7  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  8  | 
  9  | test.describe('Public routes', () => {
  10 |   test('home page loads', async ({ page }) => {
  11 |     await page.goto(`${BASE_URL}/`);
  12 |     await page.waitForLoadState('load');
  13 |     expect(page.url()).toContain(BASE_URL);
  14 |     // No crash, page renders
  15 |     await expect(page.locator('body')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('store page loads', async ({ page }) => {
  19 |     // /store is the boutique landing scene; the product grid lives at /store/all
  20 |     await page.goto(`${BASE_URL}/store/all`);
  21 |     await page.waitForLoadState('load');
  22 |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('music page loads', async ({ page }) => {
  26 |     await page.goto(`${BASE_URL}/music`);
  27 |     await page.waitForLoadState('load');
  28 |     await expect(page.locator('body')).toBeVisible();
  29 |   });
  30 | 
  31 |   test('/tour redirects to home', async ({ page }) => {
  32 |     await page.goto(`${BASE_URL}/tour`);
  33 |     await page.waitForLoadState('load');
  34 |     await expect(page).toHaveURL(`${BASE_URL}/`);
  35 |   });
  36 | 
  37 |   test('/bookings redirects to home', async ({ page }) => {
  38 |     await page.goto(`${BASE_URL}/bookings`);
  39 |     await page.waitForLoadState('load');
> 40 |     await expect(page).toHaveURL(`${BASE_URL}/`);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  41 |   });
  42 | 
  43 |   test('navbar does not contain Tour or Bookings links', async ({ page }) => {
  44 |     await page.goto(`${BASE_URL}/`);
  45 |     await page.waitForLoadState('load');
  46 | 
  47 |     const navText = await page.locator('nav').first().textContent();
  48 |     expect(navText.toLowerCase()).not.toContain('tour');
  49 |     expect(navText.toLowerCase()).not.toContain('booking');
  50 |     expect(navText.toLowerCase()).not.toContain('live dates');
  51 |   });
  52 | 
  53 |   test('no broken console errors on home page', async ({ page }) => {
  54 |     const errors = [];
  55 |     page.on('pageerror', err => errors.push(err.message));
  56 | 
  57 |     await page.goto(`${BASE_URL}/`);
  58 |     await page.waitForLoadState('load');
  59 | 
  60 |     // Filter out known non-critical noise
  61 |     const critical = errors.filter(e =>
  62 |       !e.includes('ResizeObserver') &&
  63 |       !e.includes('Non-Error promise rejection') &&
  64 |       !e.includes('autoplay')
  65 |     );
  66 |     if (critical.length > 0) {
  67 |       console.error("CRITICAL CONSOLE ERRORS FOUND:", critical);
  68 |     }
  69 |     expect(critical.length).toBe(0);
  70 |   });
  71 | });
```