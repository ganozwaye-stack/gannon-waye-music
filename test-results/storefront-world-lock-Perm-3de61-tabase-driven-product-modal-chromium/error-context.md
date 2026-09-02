# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront-world-lock.spec.js >> Permanent boutique world and verified store >> world product selection opens the database driven product modal
- Location: src/gannonwaye-playwright-pack/tests/storefront-world-lock.spec.js:55:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('$59 AUD', { exact: true })
Expected: visible
Error: strict mode violation: getByText('$59 AUD', { exact: true }) resolved to 2 elements:
    1) <p data-dynamic-content="true" data-testid="product-price" data-collection-item-field="price" data-source-location="src/pages/Store.jsx:233:10" class="font-body text-sm gradient-gold-glow font-medium">$59 AUD</p> aka getByTestId('product-grid').getByText('$59 AUD')
    2) <p data-dynamic-content="true" data-collection-item-field="price" class="font-body text-2xl gradient-gold-glow mt-2 font-medium" data-source-location="src/components/store/ProductDetailModal.jsx:137:16">$59 AUD</p> aka getByText('$59 AUD').nth(1)

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('$59 AUD', { exact: true })

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
          - button "Thank You Journal Pen and Thermos Flask Bundle Available Thank You Journal Pen and Thermos Flask Bundle $59.00 AUD 19 in stock" [active] [ref=e66] [cursor=pointer]:
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
      - generic [ref=e138]:
        - button [ref=e139] [cursor=pointer]:
          - img [ref=e140]
        - generic [ref=e143]:
          - generic [ref=e144]:
            - generic [ref=e145]:
              - img "Thank You Journal Pen and Thermos Flask Bundle — view 1" [ref=e146]
              - generic:
                - generic:
                  - img
              - button [ref=e147] [cursor=pointer]:
                - img [ref=e148]
              - button [ref=e150] [cursor=pointer]:
                - img [ref=e151]
            - generic [ref=e153]:
              - button "View 1" [ref=e154] [cursor=pointer]:
                - img "View 1" [ref=e155]
              - button "View 2" [ref=e156] [cursor=pointer]:
                - img "View 2" [ref=e157]
              - button "View 3" [ref=e158] [cursor=pointer]:
                - img "View 3" [ref=e159]
          - generic [ref=e160]:
            - generic [ref=e161]:
              - generic [ref=e162]: In Stock
              - generic [ref=e163]: Not eligible for promo codes
            - generic [ref=e164]:
              - heading "Thank You Journal Pen and Thermos Flask Bundle" [level=2] [ref=e165]
              - paragraph [ref=e166]: $59 AUD
            - paragraph [ref=e167]: Thankyou journal, pen and thermos flask set for writing and reflection.
            - paragraph [ref=e169]: 🚚 Delivery within Australia is calculated before payment from the current approved shipping rule.
            - button "Add to Cart" [ref=e170] [cursor=pointer]:
              - img [ref=e171]
              - text: Add to Cart
  - contentinfo [ref=e172]:
    - generic [ref=e173]:
      - generic [ref=e174]:
        - generic [ref=e175]:
          - generic [ref=e177]: GW
          - paragraph [ref=e178]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
        - generic [ref=e179]:
          - heading "Navigate" [level=4] [ref=e180]
          - generic [ref=e181]:
            - link "Home" [ref=e182] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e183] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e184] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e185] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e186] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e187] [cursor=pointer]:
              - /url: /press
            - link "Mum Tribute" [ref=e188] [cursor=pointer]:
              - /url: /remember-mum
            - link "Contact" [ref=e189] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e190]:
          - heading "Contact" [level=4] [ref=e191]
          - paragraph [ref=e192]: For music, media, collaboration, and business enquiries
          - link "gannonwayemusic@gmail.com" [ref=e193] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e194]
          - generic [ref=e195]:
            - link "Privacy Policy" [ref=e196] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e197] [cursor=pointer]:
              - /url: /terms-of-service
          - heading "Social" [level=4] [ref=e198]
          - generic [ref=e199]:
            - link "Instagram @gann0nwaye" [ref=e200] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e201] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e202] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e203]:
        - paragraph [ref=e204]: Stay connected
        - heading "Music and merchandise updates" [level=3] [ref=e205]
        - generic [ref=e206]:
          - textbox "Your name" [ref=e207]
          - textbox "Your email address" [ref=e208]
          - generic [ref=e209] [cursor=pointer]:
            - checkbox "I would like to receive music and merchandise updates. I can unsubscribe at any time." [ref=e210]
            - generic [ref=e211]: I would like to receive music and merchandise updates. I can unsubscribe at any time.
          - button "Join the Update List" [ref=e212] [cursor=pointer]
      - generic [ref=e213]:
        - paragraph [ref=e214]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
        - paragraph [ref=e215]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e216]:
    - img [ref=e217]
    - paragraph [ref=e219]: 🎵Approved music and official listening links appear on the Music page
    - button "Dismiss" [ref=e220] [cursor=pointer]:
      - img [ref=e221]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const LOCKED_IMAGE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cf2757c39_3d0e6cbc-87a7-4f9e-8d1c-05b82eb5b2e1.png';
  4  | const LOCKED_SHA256 = '9667a3698d14ec59d8b744d44a54692db5b24aefa09ed90e9344edd17eb83f98';
  5  | const HOODIE_ID = '69f11d1fc43e13c61fe6b9d7';
  6  | const JOURNAL_BUNDLE_ID = '69fbd261b760426cede1b7a3';
  7  | 
  8  | test.describe('Permanent boutique world and verified store', () => {
  9  |   test('the owner locked boutique world remains on the public store', async ({ page }) => {
  10 |     await page.goto('/store');
  11 | 
  12 |     const world = page.locator('[data-testid="locked-storefront-world"]');
  13 |     await expect(world).toBeVisible();
  14 |     await expect(world).toHaveAttribute('data-storefront-lock-id', 'gannon-waye-boutique-world-v1');
  15 | 
  16 |     const image = page.locator('[data-testid="locked-storefront-world-image"]');
  17 |     await expect(image).toBeVisible();
  18 |     await expect(image).toHaveAttribute('src', LOCKED_IMAGE);
  19 |     await expect(image).toHaveAttribute('data-storefront-image-sha256', LOCKED_SHA256);
  20 | 
  21 |     await expect(page.locator('[data-testid="locked-storefront-stage"]')).toBeVisible();
  22 |     await expect(page.locator('[data-testid="locked-storefront-stage-image"]')).toHaveAttribute('src', LOCKED_IMAGE);
  23 |   });
  24 | 
  25 |   test('only the two approved stage one products appear as sellable items', async ({ page }) => {
  26 |     await page.goto('/store');
  27 | 
  28 |     const worldCards = page.locator('[data-testid="world-product-card"]');
  29 |     await expect(worldCards).toHaveCount(2);
  30 | 
  31 |     const ids = await worldCards.evaluateAll(cards => cards.map(card => card.getAttribute('data-product-id')).sort());
  32 |     expect(ids).toEqual([HOODIE_ID, JOURNAL_BUNDLE_ID].sort());
  33 | 
  34 |     const productCards = page.locator('[data-testid="product-card"]');
  35 |     await expect(productCards).toHaveCount(2);
  36 | 
  37 |     const bodyText = await page.locator('body').innerText();
  38 |     expect(bodyText).not.toContain('Winter Writing & Comfort Bundle');
  39 |     expect(bodyText).not.toContain('Respect Is Earned Coffee Mug');
  40 |     expect(bodyText).not.toContain('Assorted Wall Poster');
  41 |   });
  42 | 
  43 |   test('hoodie sizes and quantities come from the verified live record', async ({ page }) => {
  44 |     await page.goto('/store');
  45 | 
  46 |     const hoodie = page.locator('[data-testid="product-card"]').filter({ hasText: 'Respect Is Earned' }).first();
  47 |     await expect(hoodie).toBeVisible();
  48 |     await expect(hoodie.getByRole('button', { name: 'S (3)', exact: true })).toBeVisible();
  49 |     await expect(hoodie.getByRole('button', { name: 'M (4)', exact: true })).toBeVisible();
  50 |     await expect(hoodie.getByRole('button', { name: 'L (5)', exact: true })).toBeVisible();
  51 |     await expect(hoodie.getByRole('button', { name: 'XL (2)', exact: true })).toBeVisible();
  52 |     await expect(hoodie.getByRole('button', { name: /2XL|3XL/ })).toHaveCount(0);
  53 |   });
  54 | 
  55 |   test('world product selection opens the database driven product modal', async ({ page }) => {
  56 |     await page.goto('/store');
  57 | 
  58 |     await page.locator(`[data-testid="world-product-card"][data-product-id="${JOURNAL_BUNDLE_ID}"]`).click();
  59 |     await expect(page.getByRole('heading', { name: 'Thank You Journal Pen and Thermos Flask Bundle' })).toBeVisible();
> 60 |     await expect(page.getByText('$59 AUD', { exact: true })).toBeVisible();
     |                                                              ^ Error: expect(locator).toBeVisible() failed
  61 |     await expect(page.getByRole('button', { name: /Add to Cart/ })).toBeVisible();
  62 |   });
  63 | });
  64 | 
```