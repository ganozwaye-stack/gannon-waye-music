# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-load.spec.js >> Verified public store >> hoodie requires one verified size before being added
- Location: src/gannonwaye-playwright-pack/tests/store-load.spec.js:36:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first().getByRole('button', { name: /^M \(4\)$/ })

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
                - paragraph [ref=e100]: Please select a size
              - button "Add to Cart" [active] [ref=e101] [cursor=pointer]:
                - img [ref=e102]
                - text: Add to Cart
          - generic [ref=e103]:
            - generic [ref=e104] [cursor=pointer]:
              - generic [ref=e105]:
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 1" [ref=e106]
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 2" [ref=e107]
                - img "Respect Is Earned Journal, Pen and Thermos Gift Box Bundle 3" [ref=e108]
                - generic [ref=e109]:
                  - button [ref=e110]
                  - button [ref=e111]
                  - button [ref=e112]
              - img [ref=e114]
              - generic [ref=e117]: In Stock
            - generic [ref=e118]:
              - paragraph [ref=e120]: Respect Is Earned Journal, Pen and Thermos Gift Box Bundle
              - paragraph [ref=e121]: $59 AUD
              - paragraph [ref=e122]: Journal, matching pen and thermos presented as one complete gift box set. Delivery is calculated before payment.
              - group "Complete the Set" [ref=e123]:
                - generic [ref=e124]: Complete the Set
                - paragraph [ref=e125]: Choose this item on its own or the Winter Writing & Comfort Bundle with the hoodie, journal, matching pen and thermos.
                - generic [ref=e126]:
                  - generic [ref=e127] [cursor=pointer]:
                    - generic [ref=e128]:
                      - radio "This item $59 AUD" [checked] [ref=e129]
                      - generic [ref=e130]: This item
                    - generic [ref=e131]: $59 AUD
                  - generic [ref=e132] [cursor=pointer]:
                    - generic [ref=e133]:
                      - radio "Winter Writing & Comfort Bundle $119 AUD" [ref=e134]
                      - generic [ref=e135]: Winter Writing & Comfort Bundle
                    - generic [ref=e136]: $119 AUD
                - link "View the Winter Writing & Comfort Bundle" [ref=e137] [cursor=pointer]:
                  - /url: "#store-product-6a9a945016c72a1e3c04935f"
              - button "Add to Cart" [ref=e138] [cursor=pointer]:
                - img [ref=e139]
                - text: Add to Cart
          - generic [ref=e140]:
            - generic [ref=e141] [cursor=pointer]:
              - generic [ref=e142]:
                - img "Winter Writing & Comfort Bundle 1" [ref=e143]
                - img "Winter Writing & Comfort Bundle 2" [ref=e144]
                - generic [ref=e145]:
                  - button [ref=e146]
                  - button [ref=e147]
              - img [ref=e149]
              - generic [ref=e152]: In Stock
            - generic [ref=e153]:
              - paragraph [ref=e155]: Winter Writing & Comfort Bundle
              - paragraph [ref=e156]: $119 AUD
              - generic [ref=e157]:
                - paragraph [ref=e158]: Select size
                - generic [ref=e159]:
                  - button "Select size S, 3 in stock" [ref=e160] [cursor=pointer]: S (3)
                  - button "Select size M, 4 in stock" [ref=e161] [cursor=pointer]: M (4)
                  - button "Select size L, 5 in stock" [ref=e162] [cursor=pointer]: L (5)
                  - button "Select size XL, 2 in stock" [ref=e163] [cursor=pointer]: XL (2)
              - button "Add to Cart" [ref=e164] [cursor=pointer]:
                - img [ref=e165]
                - text: Add to Cart
        - paragraph [ref=e166]: Independent music, merchandise, and community support.
  - contentinfo [ref=e167]:
    - generic [ref=e168]:
      - generic [ref=e169]:
        - generic [ref=e170]:
          - img "Gannon Waye" [ref=e171]
          - paragraph [ref=e172]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
        - generic [ref=e173]:
          - heading "Navigate" [level=4] [ref=e174]
          - generic [ref=e175]:
            - link "Home" [ref=e176] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e177] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e178] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e179] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e180] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e181] [cursor=pointer]:
              - /url: /press
            - link "Mum Tribute" [ref=e182] [cursor=pointer]:
              - /url: /remember-mum
            - link "Contact" [ref=e183] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e184]:
          - heading "Contact" [level=4] [ref=e185]
          - paragraph [ref=e186]: For music, media, collaboration, and business enquiries
          - link "gannonwayemusic@gmail.com" [ref=e187] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e188]
          - generic [ref=e189]:
            - link "Privacy Policy" [ref=e190] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e191] [cursor=pointer]:
              - /url: /terms-of-service
          - heading "Social" [level=4] [ref=e192]
          - generic [ref=e193]:
            - link "Instagram @gann0nwaye" [ref=e194] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e195] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e196] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e197]:
        - paragraph [ref=e198]: Stay connected
        - heading "Music and merchandise updates" [level=3] [ref=e199]
        - paragraph [ref=e200]: One clear signup form, with explicit consent, is available on the home page.
        - link "Join the Update List" [ref=e201] [cursor=pointer]:
          - /url: /#updates
      - generic [ref=e202]:
        - paragraph [ref=e203]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
        - paragraph [ref=e204]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e206]:
    - generic [ref=e207]:
      - generic [ref=e208]: Set Free, out 25 September 2026
      - generic [ref=e209]: ◆
      - generic [ref=e210]: Join the community and follow the story
      - generic [ref=e211]: ◆
      - generic [ref=e212]: Independent, heart-first music from Gannon Waye
      - generic [ref=e213]: ◆
    - generic [ref=e214]:
      - generic [ref=e215]: Set Free, out 25 September 2026
      - generic [ref=e216]: ◆
      - generic [ref=e217]: Join the community and follow the story
      - generic [ref=e218]: ◆
      - generic [ref=e219]: Independent, heart-first music from Gannon Waye
      - generic [ref=e220]: ◆
  - dialog "Stay updated on new releases?" [ref=e221]:
    - button "Close" [ref=e222] [cursor=pointer]:
      - img [ref=e223]
    - generic [ref=e226]:
      - img [ref=e228]
      - paragraph [ref=e231]: Stay Close
      - heading "Stay updated on new releases?" [level=2] [ref=e232]
      - paragraph [ref=e233]: Be the first to hear about new music, including Set Free, out 25 September.
      - generic [ref=e234]:
        - textbox "Your email address" [ref=e235]:
          - /placeholder: your@email.com
        - button "Keep Me Updated" [ref=e236] [cursor=pointer]
      - button "No thanks, I am just browsing" [ref=e237] [cursor=pointer]
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
> 42 |     await hoodie.getByRole('button', { name: /^M \(4\)$/ }).click();
     |                                                             ^ Error: locator.click: Test timeout of 60000ms exceeded.
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