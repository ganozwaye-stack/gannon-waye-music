# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: src\gannonwaye-playwright-pack\tests\store-load.spec.js >> Store Load & Product Cards >> no free shipping text on store page
- Location: src\gannonwaye-playwright-pack\tests\store-load.spec.js:92:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/store
Call log:
  - navigating to "http://localhost:5173/store", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "This site can’t be reached" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - strong [ref=e9]: localhost
      - text: refused to connect.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Try:"
      - list [ref=e12]:
        - listitem [ref=e13]: Checking the connection
        - listitem [ref=e14]:
          - link "Checking the proxy and the firewall" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
    - generic [ref=e16]: ERR_CONNECTION_REFUSED
  - generic [ref=e17]:
    - button "Reload" [ref=e19] [cursor=pointer]
    - button "Details" [ref=e20] [cursor=pointer]
```

# Test source

```ts
  1  | // @ts-check
  2  |  
  3  | const { test, expect } = require('@playwright/test');
  4  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  5  | 
  6  | test.describe('Store Load & Product Cards', () => {
  7  |   test('/store loads', async ({ page }) => {
  8  |     await page.goto(`${BASE_URL}/store`);
  9  |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  10 |   });
  11 | 
  12 |   test('products are visible', async ({ page }) => {
  13 |     await page.goto(`${BASE_URL}/store`);
  14 |     await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  15 |   });
  16 | 
  17 |   test('product images are visible', async ({ page }) => {
  18 |     await page.goto(`${BASE_URL}/store`);
  19 |     await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible({ timeout: 5000 });
  20 |   });
  21 | 
  22 |   test('product titles are visible', async ({ page }) => {
  23 |     await page.goto(`${BASE_URL}/store`);
  24 |     await expect(page.locator('[data-testid="product-title"]').first()).toBeVisible();
  25 |   });
  26 | 
  27 |   test('product prices are visible', async ({ page }) => {
  28 |     await page.goto(`${BASE_URL}/store`);
  29 |     await expect(page.locator('[data-testid="product-price"]').first()).toBeVisible();
  30 |   });
  31 | 
  32 |   test('add-to-cart button visible on each in-stock card', async ({ page }) => {
  33 |     await page.goto(`${BASE_URL}/store`);
  34 |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  35 |     const count = await addBtns.count();
  36 |     expect(count).toBeGreaterThan(0);
  37 |   });
  38 | 
  39 |   test('NO size buttons visible on main product grid', async ({ page }) => {
  40 |     await page.goto(`${BASE_URL}/store`);
  41 |     // Size buttons should NOT be visible directly on the grid (they live in the modal)
  42 |     // Check that no size-selector testid exists outside of a modal
  43 |     const sizeSelector = page.locator('[data-testid="size-selector"]');
  44 |     const count = await sizeSelector.count();
  45 |     expect(count).toBe(0);
  46 |   });
  47 | 
  48 |   test('add-to-cart button works and shows confirmation', async ({ page }) => {
  49 |     await page.goto(`${BASE_URL}/store`);
  50 |     // Find a non-apparel product (no size required) or select size first
  51 |     const cards = page.locator('[data-testid="product-card"]');
  52 |     const count = await cards.count();
  53 |     let clicked = false;
  54 |     for (let i = 0; i < count; i++) {
  55 |       const title = await cards.nth(i).locator('[data-testid="product-title"]').textContent().catch(() => '');
  56 |       if (!title.toLowerCase().includes('hoodie') && !title.toLowerCase().includes('tee')) {
  57 |         const btn = cards.nth(i).locator('[data-testid="add-to-cart-btn"]');
  58 |         if (await btn.isVisible().catch(() => false)) {
  59 |           await btn.click();
  60 |           clicked = true;
  61 |           break;
  62 |         }
  63 |       }
  64 |     }
  65 |     if (clicked) {
  66 |       await expect(page.locator('[data-testid="add-to-cart-success"]').first()).toBeVisible({ timeout: 3000 });
  67 |     }
  68 |   });
  69 | 
  70 |   test('apparel size must be selected before adding', async ({ page }) => {
  71 |     await page.goto(`${BASE_URL}/store`);
  72 |     const cards = page.locator('[data-testid="product-card"]');
  73 |     const count = await cards.count();
  74 |     for (let i = 0; i < count; i++) {
  75 |       const title = await cards.nth(i).locator('[data-testid="product-title"]').textContent().catch(() => '');
  76 |       if (title.toLowerCase().includes('hoodie') || title.toLowerCase().includes('tee')) {
  77 |         const btn = cards.nth(i).locator('[data-testid="add-to-cart-btn"]');
  78 |         if (await btn.isVisible().catch(() => false)) {
  79 |           await btn.click();
  80 |           await expect(page.locator('.text-destructive').first()).toBeVisible({ timeout: 3000 });
  81 |           break;
  82 |         }
  83 |       }
  84 |     }
  85 |   });
  86 | 
  87 |   test('cart button is visible with testid', async ({ page }) => {
  88 |     await page.goto(`${BASE_URL}/store`);
  89 |     await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  90 |   });
  91 | 
  92 |   test('no free shipping text on store page', async ({ page }) => {
> 93 |     await page.goto(`${BASE_URL}/store`);
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/store
  94 |     const content = await page.content();
  95 |     expect(content.toLowerCase()).not.toContain('free shipping');
  96 |   });
  97 | });
```