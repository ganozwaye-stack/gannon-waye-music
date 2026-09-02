# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: merch-product-fixes.spec.js >> Merch store — product pricing >> Winter bundle shows no-discount badge
- Location: src/gannonwaye-playwright-pack/tests/merch-product-fixes.spec.js:32:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('[data-testid="winter-bundle-hero"]')
Expected pattern: /no further discounts/i
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('[data-testid="winter-bundle-hero"]')

```

```yaml
- navigation:
  - link "Gannon Waye · Home":
    - /url: /
    - text: GW
  - link "Home":
    - /url: /
  - link "Biography":
    - /url: /biography
  - link "Music":
    - /url: /music
  - link "Store":
    - /url: /store
  - link "Mum's Garden":
    - /url: /mums-garden
  - link "Press":
    - /url: /press
  - link "Contact":
    - /url: /contact
  - button "More":
    - text: More
    - img
  - button:
    - img
  - button "Open cart":
    - img
- main:
  - region "Permanent Gannon Waye boutique world":
    - img "Gannon Waye Boutique, official merchandise store"
    - paragraph: Boutique · Step Inside
    - heading "Gannon Waye" [level=1]
    - paragraph: Merch Store
  - region "Gannon Waye boutique world":
    - img "Gannon Waye boutique interior"
    - paragraph: Step inside the boutique
    - heading "The owner approved collection" [level=2]
    - paragraph: The boutique world is permanent. Prices, stock and purchasing come only from verified live records.
    - button "\"Respect Is Earned\" Hoodie — Dark Grey Available \"Respect Is Earned\" Hoodie — Dark Grey $98.00 AUD 14 in stock":
      - img "\"Respect Is Earned\" Hoodie — Dark Grey"
      - text: Available "Respect Is Earned" Hoodie — Dark Grey $98.00 AUD 14 in stock
    - button "Thank You Journal Pen and Thermos Flask Bundle Available Thank You Journal Pen and Thermos Flask Bundle $59.00 AUD 19 in stock":
      - img "Thank You Journal Pen and Thermos Flask Bundle"
      - text: Available Thank You Journal Pen and Thermos Flask Bundle $59.00 AUD 19 in stock
  - paragraph: Available now
  - heading "Shop the collection" [level=1]
  - paragraph: Current owner-approved stock is available for delivery within Australia.
  - paragraph: Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
  - text: Merch
  - img "\"Respect Is Earned\" Hoodie — Dark Grey 1"
  - img "\"Respect Is Earned\" Hoodie — Dark Grey 2"
  - button
  - button
  - img
  - text: Available Now
  - paragraph: "\"Respect Is Earned\" Hoodie — Dark Grey"
  - paragraph: $98 AUD
  - paragraph: Owner-counted stock in S, M, L and XL. Delivery is calculated before payment.
  - button "S (3)"
  - button "M (4)"
  - button "L (5)"
  - button "XL (2)"
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - img "Thank You Journal Pen and Thermos Flask Bundle 1"
  - img "Thank You Journal Pen and Thermos Flask Bundle 2"
  - img "Thank You Journal Pen and Thermos Flask Bundle 3"
  - button
  - button
  - button
  - img
  - text: In Stock
  - paragraph: Thank You Journal Pen and Thermos Flask Bundle
  - paragraph: $59 AUD
  - paragraph: Journal, pen and thermos flask set. Delivery is calculated before payment.
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - paragraph: Independent music, merchandise, and community support.
- contentinfo:
  - text: GW
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
  - textbox "Your name"
  - textbox "Your email address"
  - checkbox "I would like to receive music and merchandise updates. I can unsubscribe at any time."
  - text: I would like to receive music and merchandise updates. I can unsubscribe at any time.
  - button "Join the Update List"
  - paragraph: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
  - paragraph: © 2026 Gannon Waye. All rights reserved.
- img
- paragraph: 🛍️The Store shows only current owner-approved stock
- button "Dismiss":
  - img
```

# Test source

```ts
  1  | // @ts-check
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | test.describe('Merch store — product pricing', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/store');
  7  |     await page.waitForLoadState('networkidle');
  8  |   });
  9  | 
  10 |   test('Journal bundle shows $59', async ({ page }) => {
  11 |     const cards = page.locator('[data-testid="product-card"]');
  12 |     let found = false;
  13 |     const count = await cards.count();
  14 |     for (let i = 0; i < count; i++) {
  15 |       const card = cards.nth(i);
  16 |       const title = await card.locator('[data-testid="product-title"]').textContent();
  17 |       if (title && title.toLowerCase().includes('journal')) {
  18 |         const price = await card.locator('[data-testid="product-price"]').textContent();
  19 |         expect(price).toContain('59');
  20 |         found = true;
  21 |       }
  22 |     }
  23 |     expect(found).toBe(true);
  24 |   });
  25 | 
  26 |   test('Winter bundle shows $129', async ({ page }) => {
  27 |     const winterSection = page.locator('[data-testid="winter-bundle-hero"]');
  28 |     await expect(winterSection).toBeVisible();
  29 |     await expect(winterSection).toContainText('129');
  30 |   });
  31 | 
  32 |   test('Winter bundle shows no-discount badge', async ({ page }) => {
  33 |     const winterSection = page.locator('[data-testid="winter-bundle-hero"]');
> 34 |     await expect(winterSection).toContainText(/no further discounts/i);
     |                                 ^ Error: expect(locator).toContainText(expected) failed
  35 |   });
  36 | 
  37 |   test('Winter bundle add to cart button is visible', async ({ page }) => {
  38 |     const btn = page.locator('[data-testid="winter-bundle-add-to-cart"]');
  39 |     await expect(btn).toBeVisible();
  40 |   });
  41 | 
  42 |   test('Poster product does not show hoodie image exclusively', async ({ page }) => {
  43 |     const cards = page.locator('[data-testid="product-card"]');
  44 |     const count = await cards.count();
  45 |     for (let i = 0; i < count; i++) {
  46 |       const card = cards.nth(i);
  47 |       const title = await card.locator('[data-testid="product-title"]').textContent();
  48 |       if (title && title.toLowerCase().includes('poster')) {
  49 |         const img = card.locator('img').first();
  50 |         const src = await img.getAttribute('src');
  51 |         // Hoodie image should not be the poster image
  52 |         expect(src).not.toContain('RespectisEarnedThankyouDarkGreyHoodieFront');
  53 |       }
  54 |     }
  55 |   });
  56 | });
  57 | 
  58 | test.describe('Winter bundle — promo code rejection', () => {
  59 |   test('winter bundle item in cart rejects promo codes', async ({ page }) => {
  60 |     await page.goto('/store');
  61 |     await page.waitForLoadState('networkidle');
  62 |     const addBtn = page.locator('[data-testid="winter-bundle-add-to-cart"]');
  63 |     if (await addBtn.isVisible()) {
  64 |       await addBtn.click();
  65 |       await page.goto('/store/cart-details');
  66 |       await page.waitForLoadState('networkidle');
  67 |       // Try applying a promo code
  68 |       const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="code"]').first();
  69 |       if (await promoInput.count() > 0) {
  70 |         await promoInput.fill('TEST10');
  71 |         const applyBtn = page.locator('button:has-text("Apply")').first();
  72 |         if (await applyBtn.count() > 0) {
  73 |           await applyBtn.click();
  74 |           // Should show rejection or no discount applied to bundle
  75 |           await expect(page.locator('body')).toContainText(/no further|excluded|not eligible|bundle/i);
  76 |         }
  77 |       }
  78 |     }
  79 |   });
  80 | });
```