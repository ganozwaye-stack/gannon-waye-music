# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation-scroll.spec.js >> Scroll-to-top on route change >> navigating to an admin page resets scroll to top
- Location: src/gannonwaye-playwright-pack/tests/navigation-scroll.spec.js:43:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/admin", waiting until "load"

```

# Test source

```ts
  1  | // tests/navigation-scroll.spec.js
  2  | // Verifies that navigating to a new page always resets scroll position to top.
  3  | 
  4  | /* eslint-disable no-undef */
  5  | import { test, expect } from '@playwright/test';
  6  | 
  7  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  8  | 
  9  | test.describe('Scroll-to-top on route change', () => {
  10 |   test('navigating from Store to Home resets scroll to top', async ({ page }) => {
  11 |     // Go to the store page (long page with products)
  12 |     await page.goto(`${BASE_URL}/store`);
  13 |     await page.waitForLoadState('load');
  14 | 
  15 |     // Scroll down significantly
  16 |     await page.evaluate(() => window.scrollTo(0, 800));
  17 |     const scrollBefore = await page.evaluate(() => window.scrollY);
  18 |     expect(scrollBefore).toBeGreaterThan(100);
  19 | 
  20 |     // Navigate to Home via a link or direct navigation
  21 |     await page.goto(`${BASE_URL}/`);
  22 |     await page.waitForLoadState('load');
  23 | 
  24 |     const scrollAfter = await page.evaluate(() => window.scrollY);
  25 |     expect(scrollAfter).toBe(0);
  26 |   });
  27 | 
  28 |   test('navigating from Home to Store resets scroll to top', async ({ page }) => {
  29 |     await page.goto(`${BASE_URL}/`);
  30 |     await page.waitForLoadState('load');
  31 | 
  32 |     await page.evaluate(() => window.scrollTo(0, 600));
  33 |     const scrollBefore = await page.evaluate(() => window.scrollY);
  34 |     expect(scrollBefore).toBeGreaterThan(100);
  35 | 
  36 |     await page.goto(`${BASE_URL}/store`);
  37 |     await page.waitForLoadState('load');
  38 | 
  39 |     const scrollAfter = await page.evaluate(() => window.scrollY);
  40 |     expect(scrollAfter).toBe(0);
  41 |   });
  42 | 
  43 |   test('navigating to an admin page resets scroll to top', async ({ page }) => {
  44 |     await page.goto(`${BASE_URL}/store`);
  45 |     await page.waitForLoadState('load');
  46 |     await page.evaluate(() => {
  47 |       localStorage.setItem('base44_access_token', 'mock-admin-token');
  48 |     });
  49 | 
  50 |     await page.evaluate(() => window.scrollTo(0, 500));
  51 | 
> 52 |     await page.goto(`${BASE_URL}/admin`);
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  53 |     await page.waitForLoadState('load');
  54 | 
  55 |     const scrollAfter = await page.evaluate(() => window.scrollY);
  56 |     expect(scrollAfter).toBe(0);
  57 |   });
  58 | 
  59 |   test('hash navigation scrolls to section, not top', async ({ page }) => {
  60 |     await page.goto(`${BASE_URL}/`);
  61 |     await page.waitForLoadState('load');
  62 | 
  63 |     // Navigate to a hash — scroll should NOT be 0 if section exists (or at least not throw)
  64 |     await page.goto(`${BASE_URL}/#about`);
  65 |     await page.waitForTimeout(300);
  66 |     // We just verify no crash — scroll position may vary depending on section existence
  67 |     const scrollY = await page.evaluate(() => window.scrollY);
  68 |     expect(scrollY).toBeGreaterThanOrEqual(0);
  69 |   });
  70 | 
  71 |   test('opening cart drawer does not reset scroll', async ({ page }) => {
  72 |     await page.goto(`${BASE_URL}/store`);
  73 |     await page.waitForLoadState('load');
  74 | 
  75 |     // Scroll down
  76 |     await page.evaluate(() => window.scrollTo(0, 400));
  77 |     await page.waitForTimeout(200);
  78 | 
  79 |     const scrollBefore = await page.evaluate(() => window.scrollY);
  80 | 
  81 |     // Open cart (if button exists)
  82 |     const cartBtn = page.locator('[data-testid="cart-button"]');
  83 |     if (await cartBtn.count() > 0) {
  84 |       await cartBtn.click();
  85 |       await page.waitForTimeout(300);
  86 |     }
  87 | 
  88 |     const scrollAfter = await page.evaluate(() => window.scrollY);
  89 |     // Scroll should not have reset to 0
  90 |     expect(scrollAfter).toBe(scrollBefore);
  91 |   });
  92 | });
```