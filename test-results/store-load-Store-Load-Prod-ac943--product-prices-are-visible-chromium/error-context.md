# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-load.spec.js >> Store Load & Product Cards >> product prices are visible
- Location: src/gannonwaye-playwright-pack/tests/store-load.spec.js:28:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="product-price"]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="product-price"]').first()

```

```yaml
- navigation:
  - link "Gannon Waye home":
    - /url: /
    - text: GW
  - link "Home":
    - /url: /
  - link "Biography":
    - /url: /biography
  - link "Music":
    - /url: /music
  - link "Garden Tribute":
    - /url: /garden-tribute
  - link "Supporters":
    - /url: /supporters
  - link "Store":
    - /url: /store
  - link "Contact":
    - /url: /contact
  - button "Search site":
    - img
- button:
  - img
- main:
  - main:
    - region "Gannon Waye shop":
      - img "Gannon Waye shop interior"
      - paragraph: New stock landing soon
- contentinfo:
  - img "Gannon Waye"
  - paragraph: Independent Australian artist crafting honest stories through melody, visuals, community, and a self-built creative platform.
  - link "Join supporters":
    - /url: /supporters
  - heading "Navigate" [level=4]
  - link "Home":
    - /url: /
  - link "Biography":
    - /url: /biography
  - link "Music":
    - /url: /music
  - link "Garden Tribute":
    - /url: /garden-tribute
  - link "Supporters":
    - /url: /supporters
  - link "Impact":
    - /url: /impact
  - link "Store":
    - /url: /store
  - link "Contact":
    - /url: /contact
  - heading "Contact" [level=4]
  - paragraph: For press, management, order help and enquiries
  - link "gannonwayemusic@gmail.com":
    - /url: mailto:gannonwayemusic@gmail.com
  - heading "Legal" [level=4]
  - link "Privacy Policy":
    - /url: /privacy-policy
  - link "Terms of Service":
    - /url: /terms-of-service
  - link "Order Help":
    - /url: /contact#order-support
  - heading "Social" [level=4]
  - link "Instagram @gann0nwaye":
    - /url: https://instagram.com/gann0nwaye
  - link "TikTok @gann0nwaye":
    - /url: https://tiktok.com/@gann0nwaye
  - link "YouTube @gannonwayeofficial":
    - /url: https://www.youtube.com/@gannonwayeofficial
  - paragraph: Stay in the loop
  - heading "New music and supporter updates" [level=3]
  - text: Your name
  - textbox "Your name":
    - /placeholder: Your name *
  - text: Email address
  - textbox "Email address":
    - /placeholder: your@email.com *
  - checkbox "I agree to receive music and supporter emails. I can unsubscribe at any time. See the Privacy Policy."
  - text: I agree to receive music and supporter emails. I can unsubscribe at any time. See the
  - link "Privacy Policy":
    - /url: /privacy-policy
  - text: .
  - button "Join Supporters"
  - paragraph: Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible.
  - link "Support the project":
    - /url: /back-this
  - paragraph: © 2026 Gannon Waye. All rights reserved.
```

# Test source

```ts
  1  | // @ts-check
  2  |  
  3  | /* eslint-disable no-undef */
  4  | const { test, expect } = require('@playwright/test');
  5  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  6  | 
  7  | test.describe('Store Load & Product Cards', () => {
  8  |   test('/store loads', async ({ page }) => {
  9  |     await page.goto(`${BASE_URL}/store`);
  10 |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  11 |   });
  12 | 
  13 |   test('products are visible', async ({ page }) => {
  14 |     await page.goto(`${BASE_URL}/store`);
  15 |     await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  16 |   });
  17 | 
  18 |   test('product images are visible', async ({ page }) => {
  19 |     await page.goto(`${BASE_URL}/store`);
  20 |     await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible({ timeout: 5000 });
  21 |   });
  22 | 
  23 |   test('product titles are visible', async ({ page }) => {
  24 |     await page.goto(`${BASE_URL}/store`);
  25 |     await expect(page.locator('[data-testid="product-title"]').first()).toBeVisible();
  26 |   });
  27 | 
  28 |   test('product prices are visible', async ({ page }) => {
  29 |     await page.goto(`${BASE_URL}/store`);
> 30 |     await expect(page.locator('[data-testid="product-price"]').first()).toBeVisible();
     |                                                                         ^ Error: expect(locator).toBeVisible() failed
  31 |   });
  32 | 
  33 |   test('add-to-cart button visible on each in-stock card', async ({ page }) => {
  34 |     await page.goto(`${BASE_URL}/store`);
  35 |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  36 |     const count = await addBtns.count();
  37 |     expect(count).toBeGreaterThan(0);
  38 |   });
  39 | 
  40 |   test('NO size buttons visible on main product grid', async ({ page }) => {
  41 |     await page.goto(`${BASE_URL}/store`);
  42 |     // Size buttons should NOT be visible directly on the grid (they live in the modal)
  43 |     // Check that no size-selector testid exists outside of a modal
  44 |     const sizeSelector = page.locator('[data-testid="size-selector"]');
  45 |     const count = await sizeSelector.count();
  46 |     expect(count).toBe(0);
  47 |   });
  48 | 
  49 |   test('add-to-cart button works and shows confirmation', async ({ page }) => {
  50 |     await page.goto(`${BASE_URL}/store`);
  51 |     // Find a non-apparel product (no size required) or select size first
  52 |     const cards = page.locator('[data-testid="product-card"]');
  53 |     const count = await cards.count();
  54 |     let clicked = false;
  55 |     for (let i = 0; i < count; i++) {
  56 |       const title = await cards.nth(i).locator('[data-testid="product-title"]').textContent().catch(() => '');
  57 |       if (!title.toLowerCase().includes('hoodie') && !title.toLowerCase().includes('tee')) {
  58 |         const btn = cards.nth(i).locator('[data-testid="add-to-cart-btn"]');
  59 |         if (await btn.isVisible().catch(() => false)) {
  60 |           await btn.click();
  61 |           clicked = true;
  62 |           break;
  63 |         }
  64 |       }
  65 |     }
  66 |     if (clicked) {
  67 |       await expect(page.locator('[data-testid="add-to-cart-success"]').first()).toBeVisible({ timeout: 3000 });
  68 |     }
  69 |   });
  70 | 
  71 |   test('apparel size must be selected before adding', async ({ page }) => {
  72 |     await page.goto(`${BASE_URL}/store`);
  73 |     const cards = page.locator('[data-testid="product-card"]');
  74 |     const count = await cards.count();
  75 |     for (let i = 0; i < count; i++) {
  76 |       const title = await cards.nth(i).locator('[data-testid="product-title"]').textContent().catch(() => '');
  77 |       if (title.toLowerCase().includes('hoodie') || title.toLowerCase().includes('tee')) {
  78 |         const btn = cards.nth(i).locator('[data-testid="add-to-cart-btn"]');
  79 |         if (await btn.isVisible().catch(() => false)) {
  80 |           await btn.click();
  81 |           await expect(page.locator('.text-destructive').first()).toBeVisible({ timeout: 3000 });
  82 |           break;
  83 |         }
  84 |       }
  85 |     }
  86 |   });
  87 | 
  88 |   test('cart button is visible with testid', async ({ page }) => {
  89 |     await page.goto(`${BASE_URL}/store`);
  90 |     await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  91 |   });
  92 | 
  93 |   test('no free shipping text on store page', async ({ page }) => {
  94 |     await page.goto(`${BASE_URL}/store`);
  95 |     const content = await page.content();
  96 |     expect(content.toLowerCase()).not.toContain('free shipping');
  97 |   });
  98 | });
```