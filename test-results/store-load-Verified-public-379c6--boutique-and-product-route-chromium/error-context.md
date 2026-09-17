# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-load.spec.js >> Verified public store >> /store is the sole public boutique and product route
- Location: src/gannonwaye-playwright-pack/tests/store-load.spec.js:8:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="locked-storefront-stage"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="locked-storefront-stage"]')

```

```yaml
- navigation:
  - link "Gannon Waye · Home":
    - /url: /
    - text: Gannon Waye
  - link "Home":
    - /url: /
  - link "Biography":
    - /url: /biography
  - link "Music":
    - /url: /music
  - link "Store":
    - /url: /store
  - link "Press":
    - /url: /press
  - link "Contact":
    - /url: /contact
  - button "Open more navigation links":
    - text: More
    - img
  - link "Support the project":
    - /url: /back-this
    - img
    - text: Support
  - button "Search the site":
    - img
  - button "Open cart":
    - img
- main:
  - region "Permanent Gannon Waye boutique world":
    - img "Gannon Waye Boutique, official merchandise store"
  - paragraph: Available now
  - heading "Shop the collection" [level=1]
  - paragraph: Everything here is in stock and ready to ship within Australia.
  - paragraph: Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
  - text: Merch
  - img "\"Respect Is Earned\" Hoodie — Dark Grey 1"
  - img "\"Respect Is Earned\" Hoodie — Dark Grey 2"
  - img "\"Respect Is Earned\" Hoodie — Dark Grey 3"
  - img "\"Respect Is Earned\" Hoodie — Dark Grey 4"
  - img "\"Respect Is Earned\" Hoodie — Dark Grey 5"
  - button
  - button
  - button
  - button
  - button
  - img
  - text: Available Now
  - paragraph: "\"Respect Is Earned\" Hoodie — Dark Grey"
  - paragraph: $98 AUD
  - paragraph: Available in S, M, L and XL. Delivery is calculated before payment.
  - group "Complete the Set":
    - text: Complete the Set
    - paragraph: Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.
    - radio "This item $98 AUD" [checked]
    - text: This item $98 AUD
    - radio "Winter Writing & Comfort Bundle $119 AUD"
    - text: Winter Writing & Comfort Bundle $119 AUD
    - link "View the Winter Writing & Comfort Bundle":
      - /url: "#store-product-6a9a945016c72a1e3c04935f"
  - paragraph: Select size
  - button "Select size S, 3 in stock": S (3)
  - button "Select size M, 4 in stock": M (4)
  - button "Select size L, 5 in stock": L (5)
  - button "Select size XL, 2 in stock": XL (2)
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 1"
  - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 2"
  - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 3"
  - button
  - button
  - button
  - img
  - text: In Stock
  - paragraph: Respect Is Earned Journal, Pen and Thermos Gift Box Bundle
  - paragraph: $59 AUD
  - paragraph: Journal, matching pen and thermos presented as one complete gift box set. Delivery is calculated before payment.
  - group "Complete the Set":
    - text: Complete the Set
    - paragraph: Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.
    - radio "This item $59 AUD" [checked]
    - text: This item $59 AUD
    - radio "Winter Writing & Comfort Bundle $119 AUD"
    - text: Winter Writing & Comfort Bundle $119 AUD
    - link "View the Winter Writing & Comfort Bundle":
      - /url: "#store-product-6a9a945016c72a1e3c04935f"
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - img "Winter Writing & Comfort Bundle 1"
  - img "Winter Writing & Comfort Bundle 2"
  - button
  - button
  - img
  - text: In Stock
  - paragraph: Winter Writing & Comfort Bundle
  - paragraph: $119 AUD
  - paragraph: Select size
  - button "Select size S, 3 in stock": S (3)
  - button "Select size M, 4 in stock": M (4)
  - button "Select size L, 5 in stock": L (5)
  - button "Select size XL, 2 in stock": XL (2)
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - paragraph: Independent music, merchandise, and community support.
- contentinfo:
  - img "Gannon Waye"
  - paragraph: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
  - heading "Navigate" [level=4]
  - link "Home":
    - /url: /
  - link "Biography":
    - /url: /biography
  - link "Music":
    - /url: /music
  - link "Lyrics":
    - /url: /lyrics
  - link "Store":
    - /url: /store
  - link "Press":
    - /url: /press
  - link "Mum Tribute":
    - /url: /remember-mum
  - link "Contact":
    - /url: /contact
  - heading "Contact" [level=4]
  - paragraph: For music, media, collaboration, and business enquiries
  - link "gannonwayemusic@gmail.com":
    - /url: mailto:gannonwayemusic@gmail.com
  - heading "Legal" [level=4]
  - link "Privacy Policy":
    - /url: /privacy-policy
  - link "Terms of Service":
    - /url: /terms-of-service
  - heading "Social" [level=4]
  - link "Instagram @gann0nwaye":
    - /url: https://www.instagram.com/gann0nwaye
  - link "TikTok @gann0nwaye":
    - /url: https://www.tiktok.com/@gann0nwaye
  - link "YouTube @gannonwayeofficial":
    - /url: https://www.youtube.com/@gannonwayeofficial
  - paragraph: Stay connected
  - heading "Music and merchandise updates" [level=3]
  - paragraph: One clear signup form, with explicit consent, is available on the home page.
  - link "Join the Update List":
    - /url: /#updates
  - paragraph: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
  - paragraph: © 2026 Gannon Waye. All rights reserved.
- text: Set Free, out 25 September 2026 Join the community and follow the story Independent, heart-first music from Gannon Waye
```

# Test source

```ts
  1  | /* eslint-disable no-undef */
  2  | // @ts-check
  3  | const { test, expect } = require('@playwright/test');
  4  | 
  5  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  6  | 
  7  | test.describe('Verified public store', () => {
  8  |   test('/store is the sole public boutique and product route', async ({ page }) => {
  9  |     await page.goto(`${BASE_URL}/store`);
  10 |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  11 |     await expect(page.locator('[data-testid="locked-storefront-world"]')).toBeVisible();
> 12 |     await expect(page.locator('[data-testid="locked-storefront-stage"]')).toBeVisible();
     |                                                                           ^ Error: expect(locator).toBeVisible() failed
  13 |   });
  14 | 
  15 |   test('/store/all redirects to the same canonical store', async ({ page }) => {
  16 |     await page.goto(`${BASE_URL}/store/all`);
  17 |     await expect(page).toHaveURL(`${BASE_URL}/store`);
  18 |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  19 |   });
  20 | 
  21 |   test('exactly three live stage one product cards are visible', async ({ page }) => {
  22 |     await page.goto(`${BASE_URL}/store`);
  23 |     await expect(page.locator('[data-testid="product-card"]')).toHaveCount(3);
  24 |     await expect(page.locator('[data-testid="world-product-card"]')).toHaveCount(3);
  25 |   });
  26 | 
  27 |   test('product images, titles and prices are visible', async ({ page }) => {
  28 |     await page.goto(`${BASE_URL}/store`);
  29 |     const cards = page.locator('[data-testid="product-card"]');
  30 |     await expect(cards.first()).toBeVisible();
  31 |     await expect(cards.first().locator('[data-testid="product-title"]')).toBeVisible();
  32 |     await expect(cards.first().locator('[data-testid="product-price"]')).toBeVisible();
  33 |     await expect(cards.first().locator('img').first()).toBeVisible();
  34 |   });
  35 | 
  36 |   test('hoodie requires one verified size before being added', async ({ page }) => {
  37 |     await page.goto(`${BASE_URL}/store`);
  38 |     const hoodie = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
  39 |     await hoodie.locator('[data-testid="add-to-cart-btn"]').click();
  40 |     await expect(hoodie.locator('.text-destructive')).toContainText('Please select a size');
  41 | 
  42 |     await hoodie.getByRole('button', { name: /^M \(4\)$/ }).click();
  43 |     await hoodie.locator('[data-testid="add-to-cart-btn"]').click();
  44 |     await expect(hoodie.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
  45 |   });
  46 | 
  47 |   test('journal bundle can be added without a size', async ({ page }) => {
  48 |     await page.goto(`${BASE_URL}/store`);
  49 |     const bundle = page.locator('[data-testid="product-card"]').filter({ hasText: /Journal.*Pen.*Thermos.*Gift Box/i }).first();
  50 |     await bundle.locator('[data-testid="add-to-cart-btn"]').click();
  51 |     await expect(bundle.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
  52 |   });
  53 | 
  54 |   test('cart control is visible and counts added items', async ({ page }) => {
  55 |     await page.goto(`${BASE_URL}/store`);
  56 |     const bundle = page.locator('[data-testid="product-card"]').filter({ hasText: /Journal.*Pen.*Thermos.*Gift Box/i }).first();
  57 |     await bundle.locator('[data-testid="add-to-cart-btn"]').click();
  58 |     await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  59 |     await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
  60 |   });
  61 | 
  62 |   test('store does not advertise unsupported products or unverified claims', async ({ page }) => {
  63 |     await page.goto(`${BASE_URL}/store`);
  64 |     const content = await page.locator('body').innerText();
  65 |     expect(content).not.toContain('Coffee Mug');
  66 |     expect(content).not.toContain('Wall Poster');
  67 |     expect(content).not.toContain('10% of proceeds');
  68 |     expect(content).not.toContain('Includes GST');
  69 |   });
  70 | });
```