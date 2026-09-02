# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-product-truth.spec.js >> Store Product Truth Audit >> Winter bundle displays no further discounts apply messaging
- Location: src/gannonwaye-playwright-pack/tests/store-product-truth.spec.js:28:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="winter-bundle-hero"]')
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
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
- paragraph: 🖤Independent, emotionally honest music from Gannon Waye
- button "Dismiss":
  - img
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const HOODIE_ID = '69f11d1fc43e13c61fe6b9d7';
  4  | const JOURNAL_BUNDLE_ID = '69fbd261b760426cede1b7a3';
  5  | 
  6  | test.describe('Stage one product truth', () => {
  7  |   test.beforeEach(async ({ page }) => {
  8  |     await page.goto('/store');
  9  |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  10 |   });
  11 | 
  12 |   test('journal bundle shows the approved $59 price', async ({ page }) => {
  13 |     const bundle = page.locator('[data-testid="product-card"]').filter({ hasText: 'Journal Pen and Thermos' }).first();
  14 |     await expect(bundle).toBeVisible();
  15 |     await expect(bundle.locator('[data-testid="product-price"]')).toContainText('$59');
  16 |   });
  17 | 
  18 |   test('hoodie shows the approved $98 price', async ({ page }) => {
  19 |     const hoodie = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
  20 |     await expect(hoodie).toBeVisible();
  21 |     await expect(hoodie.locator('[data-testid="product-price"]')).toContainText('$98');
  22 |   });
  23 | 
  24 |   test('hoodie exposes only owner counted sizes', async ({ page }) => {
  25 |     const hoodie = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
  26 |     await expect(hoodie.getByRole('button', { name: /^S \(3\)$/ })).toBeVisible();
  27 |     await expect(hoodie.getByRole('button', { name: /^M \(4\)$/ })).toBeVisible();
  28 |     await expect(hoodie.getByRole('button', { name: /^L \(5\)$/ })).toBeVisible();
  29 |     await expect(hoodie.getByRole('button', { name: /^XL \(2\)$/ })).toBeVisible();
  30 |     await expect(hoodie.getByRole('button', { name: /XS|2XL|3XL|XXL/ })).toHaveCount(0);
> 31 |   });
     |                        ^ Error: expect(locator).toBeVisible() failed
  32 | 
  33 |   test('both visual layers use the same two database identifiers', async ({ page }) => {
  34 |     const gridIds = await page.locator('[data-testid="product-card"]').evaluateAll(cards =>
  35 |       cards.map(card => card.querySelector('[data-testid="product-title"]')?.textContent || '')
  36 |     );
  37 |     expect(gridIds).toHaveLength(2);
  38 | 
  39 |     const worldIds = await page.locator('[data-testid="world-product-card"]').evaluateAll(cards =>
  40 |       cards.map(card => card.getAttribute('data-product-id')).sort()
  41 |     );
  42 |     expect(worldIds).toEqual([HOODIE_ID, JOURNAL_BUNDLE_ID].sort());
  43 |   });
  44 | 
  45 |   test('blocked and retired products are absent', async ({ page }) => {
  46 |     const text = await page.locator('body').innerText();
  47 |     for (const blocked of [
  48 |       'Winter Writing & Comfort Bundle',
  49 |       'Respect Is Earned Coffee Mug',
  50 |       'Assorted Wall Poster',
  51 |       'Oversized Tee',
  52 |       'Deluxe Signed CD',
  53 |       'Slim Case',
  54 |     ]) {
  55 |       expect(text).not.toContain(blocked);
  56 |     }
  57 |   });
  58 | 
  59 |   test('legacy product detail links return to the verified store', async ({ page }) => {
  60 |     for (const slug of [
  61 |       'winter-writing-comfort-bundle',
  62 |       'thankyou-respect-is-earned-coffee-mug',
  63 |       'respect-is-earned-wall-poster',
  64 |       'thankyou-respect-is-earned-hoodie-front',
  65 |     ]) {
  66 |       await page.goto(`/store/product/${slug}`);
  67 |       await expect(page).toHaveURL('/store');
  68 |       await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  69 |     }
  70 |   });
  71 | });
  72 | 
```