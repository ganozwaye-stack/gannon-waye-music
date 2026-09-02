# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront-world-lock.spec.js >> Permanent boutique world and verified store >> world product selection opens the database driven product modal
- Location: src/gannonwaye-playwright-pack/tests/storefront-world-lock.spec.js:55:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('[data-testid="world-product-card"][data-product-id="69fbd261b760426cede1b7a3"]')

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
        - generic [ref=e55]: The boutique is being prepared. No product will appear until it is owner approved and verified for sale.
      - generic [ref=e56]:
        - generic [ref=e57]:
          - paragraph [ref=e58]: Available now
          - heading "Shop the collection" [level=1] [ref=e59]
          - paragraph [ref=e62]: Current owner-approved stock is available for delivery within Australia.
          - paragraph [ref=e63]: Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
        - generic [ref=e66]: Music
        - generic [ref=e69]:
          - generic [ref=e70]:
            - generic [ref=e71] [cursor=pointer]:
              - img "\"Thank You\" CD Single Slim Case" [ref=e73]
              - img [ref=e75]
              - generic [ref=e78]: Slim Case
            - generic [ref=e79]:
              - paragraph [ref=e81]: "\"Thank You\" CD Single Slim Case"
              - paragraph [ref=e82]: $10 AUD
              - button "Add to Cart" [ref=e83] [cursor=pointer]:
                - img [ref=e84]
                - text: Add to Cart
          - generic [ref=e85]:
            - generic [ref=e86] [cursor=pointer]:
              - img "Thank You — Deluxe Signed CD Single" [ref=e88]
              - img [ref=e90]
              - generic [ref=e93]: Deluxe · Signed
            - generic [ref=e94]:
              - paragraph [ref=e96]: Thank You — Deluxe Signed CD Single
              - paragraph [ref=e97]: $20 AUD
              - button "Add to Cart" [ref=e98] [cursor=pointer]:
                - img [ref=e99]
                - text: Add to Cart
        - generic [ref=e102]: Merch
        - generic [ref=e104]:
          - generic [ref=e105]:
            - generic [ref=e106] [cursor=pointer]:
              - generic [ref=e107]:
                - img "Respect Is Earned Oversized Tee 1" [ref=e108]
                - img "Respect Is Earned Oversized Tee 2" [ref=e109]
                - generic [ref=e110]:
                  - button [ref=e111]
                  - button [ref=e112]
              - img [ref=e114]
              - generic [ref=e117]: In Stock
            - generic [ref=e118]:
              - paragraph [ref=e120]: Respect Is Earned Oversized Tee
              - paragraph [ref=e121]: $59 AUD
              - generic [ref=e123]:
                - button "XS" [ref=e124] [cursor=pointer]
                - button "S" [ref=e125] [cursor=pointer]
                - button "M" [ref=e126] [cursor=pointer]
                - button "L" [ref=e127] [cursor=pointer]
                - button "XL" [ref=e128] [cursor=pointer]
                - button "XXL" [ref=e129] [cursor=pointer]
              - button "Add to Cart" [ref=e130] [cursor=pointer]:
                - img [ref=e131]
                - text: Add to Cart
          - generic [ref=e132]:
            - generic [ref=e133] [cursor=pointer]:
              - img "\"Respect Is Earned\" Hoodie Dark Grey" [ref=e135]
              - img [ref=e137]
              - generic [ref=e140]: Available Now
            - generic [ref=e141]:
              - paragraph [ref=e143]: "\"Respect Is Earned\" Hoodie Dark Grey"
              - paragraph [ref=e144]: $98 AUD
              - paragraph [ref=e145]: Owner-counted stock in S, M, L and XL. Delivery is calculated before payment.
              - generic [ref=e147]:
                - button "XS" [ref=e148] [cursor=pointer]
                - button "S" [ref=e149] [cursor=pointer]
                - button "M" [ref=e150] [cursor=pointer]
                - button "L" [ref=e151] [cursor=pointer]
                - button "XL" [ref=e152] [cursor=pointer]
                - button "2XL" [ref=e153] [cursor=pointer]
              - button "Add to Cart" [ref=e154] [cursor=pointer]:
                - img [ref=e155]
                - text: Add to Cart
          - generic [ref=e156]:
            - generic [ref=e157] [cursor=pointer]:
              - generic [ref=e158]:
                - img "Thank You Journal Pen and Thermos Flask Bundle 1" [ref=e159]
                - img "Thank You Journal Pen and Thermos Flask Bundle 2" [ref=e160]
                - img "Thank You Journal Pen and Thermos Flask Bundle 3" [ref=e161]
                - generic [ref=e162]:
                  - button [ref=e163]
                  - button [ref=e164]
                  - button [ref=e165]
              - img [ref=e167]
              - generic [ref=e170]: In Stock
            - generic [ref=e171]:
              - paragraph [ref=e173]: Thank You Journal Pen and Thermos Flask Bundle
              - paragraph [ref=e174]: $54 AUD
              - paragraph [ref=e175]: Journal, pen and thermos flask set. Delivery is calculated before payment.
              - button "Add to Cart" [ref=e176] [cursor=pointer]:
                - img [ref=e177]
                - text: Add to Cart
          - generic [ref=e178]:
            - generic [ref=e179] [cursor=pointer]:
              - generic [ref=e180]:
                - img "\"Thank You\" Tote Bag 1" [ref=e181]
                - img "\"Thank You\" Tote Bag 2" [ref=e182]
                - img "\"Thank You\" Tote Bag 3" [ref=e183]
                - generic [ref=e184]:
                  - button [ref=e185]
                  - button [ref=e186]
                  - button [ref=e187]
              - img [ref=e189]
              - generic [ref=e192]: Sold Out
            - generic [ref=e193]:
              - paragraph [ref=e195]: "\"Thank You\" Tote Bag"
              - paragraph [ref=e196]: $15 AUD
              - generic [ref=e197]: Sold out due to popular demand. These will not be restocked.
        - paragraph [ref=e198]: Independent music, merchandise, and community support.
  - contentinfo [ref=e199]:
    - generic [ref=e200]:
      - generic [ref=e201]:
        - generic [ref=e202]:
          - generic [ref=e204]: GW
          - paragraph [ref=e205]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
        - generic [ref=e206]:
          - heading "Navigate" [level=4] [ref=e207]
          - generic [ref=e208]:
            - link "Home" [ref=e209] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e210] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e211] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e212] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e213] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e214] [cursor=pointer]:
              - /url: /press
            - link "Mum Tribute" [ref=e215] [cursor=pointer]:
              - /url: /remember-mum
            - link "Contact" [ref=e216] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e217]:
          - heading "Contact" [level=4] [ref=e218]
          - paragraph [ref=e219]: For music, media, collaboration, and business enquiries
          - link "gannonwayemusic@gmail.com" [ref=e220] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e221]
          - generic [ref=e222]:
            - link "Privacy Policy" [ref=e223] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e224] [cursor=pointer]:
              - /url: /terms-of-service
          - heading "Social" [level=4] [ref=e225]
          - generic [ref=e226]:
            - link "Instagram @gann0nwaye" [ref=e227] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e228] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e229] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e230]:
        - paragraph [ref=e231]: Stay connected
        - heading "Music and merchandise updates" [level=3] [ref=e232]
        - generic [ref=e233]:
          - textbox "Your name" [ref=e234]
          - textbox "Your email address" [ref=e235]
          - generic [ref=e236] [cursor=pointer]:
            - checkbox "I would like to receive music and merchandise updates. I can unsubscribe at any time." [ref=e237]
            - generic [ref=e238]: I would like to receive music and merchandise updates. I can unsubscribe at any time.
          - button "Join the Update List" [ref=e239] [cursor=pointer]
      - generic [ref=e240]:
        - paragraph [ref=e241]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
        - paragraph [ref=e242]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e243]:
    - img [ref=e244]
    - paragraph [ref=e246]: 🛍️The Store shows only current owner-approved stock
    - button "Dismiss" [ref=e247] [cursor=pointer]:
      - img [ref=e248]
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
> 58 |     await page.locator(`[data-testid="world-product-card"][data-product-id="${JOURNAL_BUNDLE_ID}"]`).click();
     |                                                                                                      ^ Error: locator.click: Test timeout of 60000ms exceeded.
  59 |     await expect(page.getByRole('heading', { name: 'Thank You Journal Pen and Thermos Flask Bundle' })).toBeVisible();
  60 |     await expect(page.getByText('$59 AUD', { exact: true })).toBeVisible();
  61 |     await expect(page.getByRole('button', { name: /Add to Cart/ })).toBeVisible();
  62 |   });
  63 | });
  64 | 
```