# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-product-truth.spec.js >> Store Product Truth Audit >> Mug shows $9.90
- Location: src/gannonwaye-playwright-pack/tests/store-product-truth.spec.js:47:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "Gannon Waye · Home" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e8]: GW
      - generic [ref=e9]:
        - link "Home" [ref=e11] [cursor=pointer]:
          - /url: /
        - link "Biography" [ref=e13] [cursor=pointer]:
          - /url: /biography
        - link "Music" [ref=e15] [cursor=pointer]:
          - /url: /music
        - link "Store" [ref=e17] [cursor=pointer]:
          - /url: /store
        - link "Mum's Garden" [ref=e19] [cursor=pointer]:
          - /url: /mums-garden
        - link "Press" [ref=e21] [cursor=pointer]:
          - /url: /press
        - link "Contact" [ref=e23] [cursor=pointer]:
          - /url: /contact
        - button "More" [ref=e25] [cursor=pointer]:
          - text: More
          - img [ref=e26]
      - generic [ref=e28]:
        - button [ref=e29] [cursor=pointer]:
          - img [ref=e30]
        - button "Open cart" [ref=e33] [cursor=pointer]:
          - img [ref=e34]
  - main [ref=e38]:
    - generic [ref=e39]:
      - region "Permanent Gannon Waye boutique world" [ref=e40]:
        - img "Gannon Waye Boutique, official merchandise store"
        - generic [ref=e42]:
          - paragraph [ref=e43]: Boutique · Step Inside
          - generic [ref=e44]:
            - heading "Gannon Waye" [level=1] [ref=e45]
            - paragraph [ref=e47]: Merch Store
      - region "Gannon Waye boutique world" [ref=e49]:
        - img "Gannon Waye boutique interior"
        - generic [ref=e50]:
          - paragraph [ref=e51]: Step inside the boutique
          - heading "The owner approved collection" [level=2] [ref=e52]
          - paragraph [ref=e53]: The boutique world is permanent. Prices, stock and purchasing come only from verified live records.
        - generic [ref=e56]:
          - button "\"Respect Is Earned\" Hoodie — Dark Grey Available \"Respect Is Earned\" Hoodie — Dark Grey $98.00 AUD 14 in stock" [ref=e57] [cursor=pointer]:
            - generic [ref=e58]:
              - img "\"Respect Is Earned\" Hoodie — Dark Grey" [ref=e59]
              - generic [ref=e60]: Available
            - generic [ref=e61]:
              - generic [ref=e62]: "\"Respect Is Earned\" Hoodie — Dark Grey"
              - generic [ref=e63]:
                - generic [ref=e64]: $98.00 AUD
                - generic [ref=e65]: 14 in stock
          - button "Thank You Journal Pen and Thermos Flask Bundle Available Thank You Journal Pen and Thermos Flask Bundle $59.00 AUD 19 in stock" [ref=e66] [cursor=pointer]:
            - generic [ref=e67]:
              - img "Thank You Journal Pen and Thermos Flask Bundle" [ref=e68]
              - generic [ref=e69]: Available
            - generic [ref=e70]:
              - generic [ref=e71]: Thank You Journal Pen and Thermos Flask Bundle
              - generic [ref=e72]:
                - generic [ref=e73]: $59.00 AUD
                - generic [ref=e74]: 19 in stock
      - generic [ref=e75]:
        - generic [ref=e76]:
          - paragraph [ref=e77]: Available now
          - heading "Shop the collection" [level=1] [ref=e78]
          - paragraph [ref=e81]: Current owner-approved stock is available for delivery within Australia.
          - paragraph [ref=e82]: Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
        - generic [ref=e85]: Merch
        - generic [ref=e87]:
          - generic [ref=e88]:
            - generic [ref=e89] [cursor=pointer]:
              - generic [ref=e90]:
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 1" [ref=e91]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 2" [ref=e92]
                - generic [ref=e93]:
                  - button [ref=e94]
                  - button [ref=e95]
              - img [ref=e97]
              - generic [ref=e100]: Available Now
            - generic [ref=e101]:
              - paragraph [ref=e103]: "\"Respect Is Earned\" Hoodie — Dark Grey"
              - paragraph [ref=e104]: $98 AUD
              - paragraph [ref=e105]: Owner-counted stock in S, M, L and XL. Delivery is calculated before payment.
              - generic [ref=e107]:
                - button "S (3)" [ref=e108] [cursor=pointer]
                - button "M (4)" [ref=e109] [cursor=pointer]
                - button "L (5)" [ref=e110] [cursor=pointer]
                - button "XL (2)" [ref=e111] [cursor=pointer]
              - button "Add to Cart" [ref=e112] [cursor=pointer]:
                - img [ref=e113]
                - text: Add to Cart
          - generic [ref=e114]:
            - generic [ref=e115] [cursor=pointer]:
              - generic [ref=e116]:
                - img "Thank You Journal Pen and Thermos Flask Bundle 1" [ref=e117]
                - img "Thank You Journal Pen and Thermos Flask Bundle 2" [ref=e118]
                - img "Thank You Journal Pen and Thermos Flask Bundle 3" [ref=e119]
                - generic [ref=e120]:
                  - button [ref=e121]
                  - button [ref=e122]
                  - button [ref=e123]
              - img [ref=e125]
              - generic [ref=e128]: In Stock
            - generic [ref=e129]:
              - paragraph [ref=e131]: Thank You Journal Pen and Thermos Flask Bundle
              - paragraph [ref=e132]: $59 AUD
              - paragraph [ref=e133]: Journal, pen and thermos flask set. Delivery is calculated before payment.
              - button "Add to Cart" [ref=e134] [cursor=pointer]:
                - img [ref=e135]
                - text: Add to Cart
        - paragraph [ref=e136]: Independent music, merchandise, and community support.
  - contentinfo [ref=e137]:
    - generic [ref=e138]:
      - generic [ref=e139]:
        - generic [ref=e140]:
          - generic [ref=e142]: GW
          - paragraph [ref=e143]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
        - generic [ref=e144]:
          - heading "Navigate" [level=4] [ref=e145]
          - generic [ref=e146]:
            - link "Home" [ref=e147] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e148] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e149] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e150] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e151] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e152] [cursor=pointer]:
              - /url: /press
            - link "Mum Tribute" [ref=e153] [cursor=pointer]:
              - /url: /remember-mum
            - link "Contact" [ref=e154] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e155]:
          - heading "Contact" [level=4] [ref=e156]
          - paragraph [ref=e157]: For music, media, collaboration, and business enquiries
          - link "gannonwayemusic@gmail.com" [ref=e158] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e159]
          - generic [ref=e160]:
            - link "Privacy Policy" [ref=e161] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e162] [cursor=pointer]:
              - /url: /terms-of-service
          - heading "Social" [level=4] [ref=e163]
          - generic [ref=e164]:
            - link "Instagram @gann0nwaye" [ref=e165] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e166] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e167] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e168]:
        - paragraph [ref=e169]: Stay connected
        - heading "Music and merchandise updates" [level=3] [ref=e170]
        - generic [ref=e171]:
          - textbox "Your name" [ref=e172]
          - textbox "Your email address" [ref=e173]
          - generic [ref=e174] [cursor=pointer]:
            - checkbox "I would like to receive music and merchandise updates. I can unsubscribe at any time." [ref=e175]
            - generic [ref=e176]: I would like to receive music and merchandise updates. I can unsubscribe at any time.
          - button "Join the Update List" [ref=e177] [cursor=pointer]
      - generic [ref=e178]:
        - paragraph [ref=e179]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
        - paragraph [ref=e180]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e181]:
    - img [ref=e182]
    - paragraph [ref=e184]: 🎵Approved music and official listening links appear on the Music page
    - button "Dismiss" [ref=e185] [cursor=pointer]:
      - img [ref=e186]
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
  31 |   });
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
> 51 |       'Oversized Tee',
     |                                                                                        ^ Error: expect(received).toBeTruthy()
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