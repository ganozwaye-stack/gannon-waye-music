# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-load.spec.js >> Store Load & Product Cards >> add-to-cart button visible on each in-stock card
- Location: src/gannonwaye-playwright-pack/tests/store-load.spec.js:33:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "Gannon Waye home" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e8]: GW
      - generic [ref=e9]:
        - link "Home" [ref=e10] [cursor=pointer]:
          - /url: /
        - link "Biography" [ref=e11] [cursor=pointer]:
          - /url: /biography
        - link "Music" [ref=e12] [cursor=pointer]:
          - /url: /music
        - link "Garden Tribute" [ref=e13] [cursor=pointer]:
          - /url: /garden-tribute
        - link "Supporters" [ref=e14] [cursor=pointer]:
          - /url: /supporters
        - link "Store" [ref=e15] [cursor=pointer]:
          - /url: /store
        - link "Contact" [ref=e16] [cursor=pointer]:
          - /url: /contact
      - button "Search site" [ref=e18] [cursor=pointer]:
        - img [ref=e19]
  - button [ref=e23] [cursor=pointer]:
    - img [ref=e24]
  - main [ref=e28]:
    - main [ref=e29]:
      - region "Gannon Waye shop" [ref=e30]:
        - generic [ref=e31]:
          - img "Gannon Waye shop interior" [ref=e32]
          - generic "Products in the shop" [ref=e33]
          - paragraph [ref=e34]: New stock landing soon
  - contentinfo [ref=e35]:
    - generic [ref=e36]:
      - generic [ref=e37]:
        - generic [ref=e38]:
          - img "Gannon Waye" [ref=e39]
          - paragraph [ref=e40]: Independent Australian artist crafting honest stories through melody, visuals, community, and a self-built creative platform.
          - link "Join supporters" [ref=e41] [cursor=pointer]:
            - /url: /supporters
        - generic [ref=e42]:
          - heading "Navigate" [level=4] [ref=e43]
          - generic [ref=e44]:
            - link "Home" [ref=e45] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e46] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e47] [cursor=pointer]:
              - /url: /music
            - link "Garden Tribute" [ref=e48] [cursor=pointer]:
              - /url: /garden-tribute
            - link "Supporters" [ref=e49] [cursor=pointer]:
              - /url: /supporters
            - link "Impact" [ref=e50] [cursor=pointer]:
              - /url: /impact
            - link "Store" [ref=e51] [cursor=pointer]:
              - /url: /store
            - link "Contact" [ref=e52] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e53]:
          - heading "Contact" [level=4] [ref=e54]
          - paragraph [ref=e55]: For press, management, order help and enquiries
          - link "gannonwayemusic@gmail.com" [ref=e56] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e57]
          - generic [ref=e58]:
            - link "Privacy Policy" [ref=e59] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e60] [cursor=pointer]:
              - /url: /terms-of-service
            - link "Order Help" [ref=e61] [cursor=pointer]:
              - /url: /contact#order-support
          - heading "Social" [level=4] [ref=e62]
          - generic [ref=e63]:
            - link "Instagram @gann0nwaye" [ref=e64] [cursor=pointer]:
              - /url: https://instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e65] [cursor=pointer]:
              - /url: https://tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e66] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e67]:
        - paragraph [ref=e68]: Stay in the loop
        - heading "New music and supporter updates" [level=3] [ref=e69]
        - generic [ref=e70]:
          - generic [ref=e71]: Your name
          - textbox "Your name" [ref=e72]:
            - /placeholder: Your name *
          - generic [ref=e73]: Email address
          - textbox "Email address" [ref=e74]:
            - /placeholder: your@email.com *
          - generic [ref=e75]:
            - checkbox "I agree to receive music and supporter emails. I can unsubscribe at any time. See the Privacy Policy." [ref=e76]
            - generic [ref=e77]:
              - text: I agree to receive music and supporter emails. I can unsubscribe at any time. See the
              - link "Privacy Policy" [ref=e78] [cursor=pointer]:
                - /url: /privacy-policy
              - text: .
          - button "Join Supporters" [ref=e79] [cursor=pointer]
      - paragraph [ref=e81]: Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible.
      - generic [ref=e82]:
        - link "Support the project" [ref=e83] [cursor=pointer]:
          - /url: /back-this
        - paragraph [ref=e84]: © 2026 Gannon Waye. All rights reserved.
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
  30 |     await expect(page.locator('[data-testid="product-price"]').first()).toBeVisible();
  31 |   });
  32 | 
  33 |   test('add-to-cart button visible on each in-stock card', async ({ page }) => {
  34 |     await page.goto(`${BASE_URL}/store`);
  35 |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  36 |     const count = await addBtns.count();
> 37 |     expect(count).toBeGreaterThan(0);
     |                   ^ Error: expect(received).toBeGreaterThan(expected)
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