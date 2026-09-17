# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-load.spec.js >> Verified public store >> exactly three live stage one product cards are visible
- Location: src/gannonwaye-playwright-pack/tests/store-load.spec.js:21:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-testid="world-product-card"]')
Expected: 3
Received: 0
Timeout:  10000ms

Call log:
  - Expect "toHaveCount" with timeout 10000ms
  - waiting for locator('[data-testid="world-product-card"]')
    24 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "Gannon Waye · Home" [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: Gannon Waye
      - generic [ref=e8]:
        - link "Home" [ref=e10] [cursor=pointer]:
          - /url: /
        - link "Biography" [ref=e12] [cursor=pointer]:
          - /url: /biography
        - link "Music" [ref=e14] [cursor=pointer]:
          - /url: /music
        - link "Store" [ref=e16] [cursor=pointer]:
          - /url: /store
        - link "Press" [ref=e18] [cursor=pointer]:
          - /url: /press
        - link "Contact" [ref=e20] [cursor=pointer]:
          - /url: /contact
        - button "Open more navigation links" [ref=e22] [cursor=pointer]:
          - text: More
          - img [ref=e23]
      - generic [ref=e25]:
        - link "Support the project" [ref=e26] [cursor=pointer]:
          - /url: /back-this
          - img [ref=e27]
          - text: Support
        - button "Search the site" [ref=e29] [cursor=pointer]:
          - img [ref=e30]
        - button "Open cart" [ref=e33] [cursor=pointer]:
          - img [ref=e34]
  - main [ref=e38]:
    - generic [ref=e39]:
      - region "Permanent Gannon Waye boutique world" [ref=e40]:
        - img "Gannon Waye Boutique, official merchandise store"
      - generic [ref=e41]:
        - generic [ref=e42]:
          - paragraph [ref=e43]: Available now
          - heading "Shop the collection" [level=1] [ref=e44]
          - paragraph [ref=e47]: Everything here is in stock and ready to ship within Australia.
          - paragraph [ref=e48]: Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
        - generic [ref=e51]: Merch
        - generic [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e55] [cursor=pointer]:
              - generic [ref=e56]:
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 1" [ref=e57]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 2" [ref=e58]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 3" [ref=e59]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 4" [ref=e60]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 5" [ref=e61]
                - generic [ref=e62]:
                  - button [ref=e63]
                  - button [ref=e64]
                  - button [ref=e65]
                  - button [ref=e66]
                  - button [ref=e67]
              - img [ref=e69]
              - generic [ref=e72]: Available Now
            - generic [ref=e73]:
              - paragraph [ref=e75]: "\"Respect Is Earned\" Hoodie — Dark Grey"
              - paragraph [ref=e76]: $98 AUD
              - paragraph [ref=e77]: Available in S, M, L and XL. Delivery is calculated before payment.
              - group "Complete the Set" [ref=e78]:
                - generic [ref=e79]: Complete the Set
                - paragraph [ref=e80]: Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.
                - generic [ref=e81]:
                  - generic [ref=e82] [cursor=pointer]:
                    - generic [ref=e83]:
                      - radio "This item $98 AUD" [checked] [ref=e84]
                      - generic [ref=e85]: This item
                    - generic [ref=e86]: $98 AUD
                  - generic [ref=e87] [cursor=pointer]:
                    - generic [ref=e88]:
                      - radio "Winter Writing & Comfort Bundle $119 AUD" [ref=e89]
                      - generic [ref=e90]: Winter Writing & Comfort Bundle
                    - generic [ref=e91]: $119 AUD
                - link "View the Winter Writing & Comfort Bundle" [ref=e92] [cursor=pointer]:
                  - /url: "#store-product-6a9a945016c72a1e3c04935f"
              - generic [ref=e93]:
                - paragraph [ref=e94]: Select size
                - generic [ref=e95]:
                  - button "Select size S, 3 in stock" [ref=e96] [cursor=pointer]: S (3)
                  - button "Select size M, 4 in stock" [ref=e97] [cursor=pointer]: M (4)
                  - button "Select size L, 5 in stock" [ref=e98] [cursor=pointer]: L (5)
                  - button "Select size XL, 2 in stock" [ref=e99] [cursor=pointer]: XL (2)
              - button "Add to Cart" [ref=e100] [cursor=pointer]:
                - img [ref=e101]
                - text: Add to Cart
          - generic [ref=e102]:
            - generic [ref=e103] [cursor=pointer]:
              - generic [ref=e104]:
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 1" [ref=e105]
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 2" [ref=e106]
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 3" [ref=e107]
                - generic [ref=e108]:
                  - button [ref=e109]
                  - button [ref=e110]
                  - button [ref=e111]
              - img [ref=e113]
              - generic [ref=e116]: In Stock
            - generic [ref=e117]:
              - paragraph [ref=e119]: Respect Is Earned Journal, Pen and Thermos Gift Box Bundle
              - paragraph [ref=e120]: $59 AUD
              - paragraph [ref=e121]: Journal, matching pen and thermos presented as one complete gift box set. Delivery is calculated before payment.
              - group "Complete the Set" [ref=e122]:
                - generic [ref=e123]: Complete the Set
                - paragraph [ref=e124]: Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.
                - generic [ref=e125]:
                  - generic [ref=e126] [cursor=pointer]:
                    - generic [ref=e127]:
                      - radio "This item $59 AUD" [checked] [ref=e128]
                      - generic [ref=e129]: This item
                    - generic [ref=e130]: $59 AUD
                  - generic [ref=e131] [cursor=pointer]:
                    - generic [ref=e132]:
                      - radio "Winter Writing & Comfort Bundle $119 AUD" [ref=e133]
                      - generic [ref=e134]: Winter Writing & Comfort Bundle
                    - generic [ref=e135]: $119 AUD
                - link "View the Winter Writing & Comfort Bundle" [ref=e136] [cursor=pointer]:
                  - /url: "#store-product-6a9a945016c72a1e3c04935f"
              - button "Add to Cart" [ref=e137] [cursor=pointer]:
                - img [ref=e138]
                - text: Add to Cart
          - generic [ref=e139]:
            - generic [ref=e140] [cursor=pointer]:
              - generic [ref=e141]:
                - img "Winter Writing & Comfort Bundle 1" [ref=e142]
                - img "Winter Writing & Comfort Bundle 2" [ref=e143]
                - generic [ref=e144]:
                  - button [ref=e145]
                  - button [ref=e146]
              - img [ref=e148]
              - generic [ref=e151]: In Stock
            - generic [ref=e152]:
              - paragraph [ref=e154]: Winter Writing & Comfort Bundle
              - paragraph [ref=e155]: $119 AUD
              - generic [ref=e156]:
                - paragraph [ref=e157]: Select size
                - generic [ref=e158]:
                  - button "Select size S, 3 in stock" [ref=e159] [cursor=pointer]: S (3)
                  - button "Select size M, 4 in stock" [ref=e160] [cursor=pointer]: M (4)
                  - button "Select size L, 5 in stock" [ref=e161] [cursor=pointer]: L (5)
                  - button "Select size XL, 2 in stock" [ref=e162] [cursor=pointer]: XL (2)
              - button "Add to Cart" [ref=e163] [cursor=pointer]:
                - img [ref=e164]
                - text: Add to Cart
        - paragraph [ref=e165]: Independent music, merchandise, and community support.
  - contentinfo [ref=e166]:
    - generic [ref=e167]:
      - generic [ref=e168]:
        - generic [ref=e169]:
          - img "Gannon Waye" [ref=e170]
          - paragraph [ref=e171]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
        - generic [ref=e172]:
          - heading "Navigate" [level=4] [ref=e173]
          - generic [ref=e174]:
            - link "Home" [ref=e175] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e176] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e177] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e178] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e179] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e180] [cursor=pointer]:
              - /url: /press
            - link "Mum Tribute" [ref=e181] [cursor=pointer]:
              - /url: /remember-mum
            - link "Contact" [ref=e182] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e183]:
          - heading "Contact" [level=4] [ref=e184]
          - paragraph [ref=e185]: For music, media, collaboration, and business enquiries
          - link "gannonwayemusic@gmail.com" [ref=e186] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e187]
          - generic [ref=e188]:
            - link "Privacy Policy" [ref=e189] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e190] [cursor=pointer]:
              - /url: /terms-of-service
          - heading "Social" [level=4] [ref=e191]
          - generic [ref=e192]:
            - link "Instagram @gann0nwaye" [ref=e193] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e194] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e195] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e196]:
        - paragraph [ref=e197]: Stay connected
        - heading "Music and merchandise updates" [level=3] [ref=e198]
        - paragraph [ref=e199]: One clear signup form, with explicit consent, is available on the home page.
        - link "Join the Update List" [ref=e200] [cursor=pointer]:
          - /url: /#updates
      - generic [ref=e201]:
        - paragraph [ref=e202]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
        - paragraph [ref=e203]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e205]:
    - generic [ref=e206]:
      - generic [ref=e207]: Set Free, out 25 September 2026
      - generic [ref=e208]: ◆
      - generic [ref=e209]: Join the community and follow the story
      - generic [ref=e210]: ◆
      - generic [ref=e211]: Independent, heart-first music from Gannon Waye
      - generic [ref=e212]: ◆
    - generic [ref=e213]:
      - generic [ref=e214]: Set Free, out 25 September 2026
      - generic [ref=e215]: ◆
      - generic [ref=e216]: Join the community and follow the story
      - generic [ref=e217]: ◆
      - generic [ref=e218]: Independent, heart-first music from Gannon Waye
      - generic [ref=e219]: ◆
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
  12 |     await expect(page.locator('[data-testid="locked-storefront-stage"]')).toBeVisible();
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
> 24 |     await expect(page.locator('[data-testid="world-product-card"]')).toHaveCount(3);
     |                                                                      ^ Error: expect(locator).toHaveCount(expected) failed
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