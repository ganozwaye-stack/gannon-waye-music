# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-routes.spec.js >> Public routes >> /bookings redirects to home
- Location: src/gannonwaye-playwright-pack/tests/public-routes.spec.js:36:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:4173/"
Received: "http://localhost:4173/bookings"
Timeout:  10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    23 × unexpected value "http://localhost:4173/bookings"

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
  19 |     await page.goto(`${BASE_URL}/store`);
  20 |     await page.waitForLoadState('load');
  21 |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  22 |   });
  23 | 
  24 |   test('music page loads', async ({ page }) => {
  25 |     await page.goto(`${BASE_URL}/music`);
  26 |     await page.waitForLoadState('load');
  27 |     await expect(page.locator('body')).toBeVisible();
  28 |   });
  29 | 
  30 |   test('/tour redirects to home', async ({ page }) => {
  31 |     await page.goto(`${BASE_URL}/tour`);
  32 |     await page.waitForLoadState('load');
  33 |     await expect(page).toHaveURL(`${BASE_URL}/`);
  34 |   });
  35 | 
  36 |   test('/bookings redirects to home', async ({ page }) => {
  37 |     await page.goto(`${BASE_URL}/bookings`);
  38 |     await page.waitForLoadState('load');
> 39 |     await expect(page).toHaveURL(`${BASE_URL}/`);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  40 |   });
  41 | 
  42 |   test('navbar does not contain Tour or Bookings links', async ({ page }) => {
  43 |     await page.goto(`${BASE_URL}/`);
  44 |     await page.waitForLoadState('load');
  45 | 
  46 |     const navText = await page.locator('nav').first().textContent();
  47 |     expect(navText.toLowerCase()).not.toContain('tour');
  48 |     expect(navText.toLowerCase()).not.toContain('booking');
  49 |     expect(navText.toLowerCase()).not.toContain('live dates');
  50 |   });
  51 | 
  52 |   test('no broken console errors on home page', async ({ page }) => {
  53 |     const errors = [];
  54 |     page.on('pageerror', err => errors.push(err.message));
  55 | 
  56 |     await page.goto(`${BASE_URL}/`);
  57 |     await page.waitForLoadState('load');
  58 | 
  59 |     // Filter out known non-critical noise
  60 |     const critical = errors.filter(e =>
  61 |       !e.includes('ResizeObserver') &&
  62 |       !e.includes('Non-Error promise rejection') &&
  63 |       !e.includes('autoplay')
  64 |     );
  65 |     if (critical.length > 0) {
  66 |       console.error("CRITICAL CONSOLE ERRORS FOUND:", critical);
  67 |     }
  68 |     expect(critical.length).toBe(0);
  69 |   });
  70 | });
```