# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.js >> Cart Flow >> go-to-checkout button from confirmation routes to cart-details
- Location: src/gannonwaye-playwright-pack/tests/cart.spec.js:114:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('[data-testid="go-to-checkout-button"]').first()

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
        - link "Mum's Garden" [ref=e18] [cursor=pointer]:
          - /url: /mums-garden
        - link "Press" [ref=e20] [cursor=pointer]:
          - /url: /press
        - link "Contact" [ref=e22] [cursor=pointer]:
          - /url: /contact
        - button "Open more navigation links" [ref=e24] [cursor=pointer]:
          - text: More
          - img [ref=e25]
      - generic [ref=e27]:
        - button "Search the site" [ref=e28] [cursor=pointer]:
          - img [ref=e29]
        - button "Open cart" [ref=e32] [cursor=pointer]:
          - img [ref=e33]
  - main [ref=e37]:
    - generic [ref=e38]:
      - region "Permanent Gannon Waye boutique world" [ref=e39]:
        - img "Gannon Waye Boutique, official merchandise store"
        - generic [ref=e41]:
          - paragraph [ref=e42]: Boutique · Step Inside
          - generic [ref=e43]:
            - heading "Gannon Waye" [level=1] [ref=e44]
            - paragraph [ref=e46]: Merch Store
      - region "Gannon Waye boutique world" [ref=e48]:
        - img "Gannon Waye boutique interior"
        - generic [ref=e49]:
          - paragraph [ref=e50]: Step inside the boutique
          - heading "The owner approved collection" [level=2] [ref=e51]
          - paragraph [ref=e52]: The boutique world is permanent. Prices, stock and purchasing come only from verified live records.
        - generic [ref=e55]:
          - button "\"Respect Is Earned\" Hoodie — Dark Grey Available \"Respect Is Earned\" Hoodie — Dark Grey $98.00 AUD 14 in stock" [ref=e56] [cursor=pointer]:
            - generic [ref=e57]:
              - img "\"Respect Is Earned\" Hoodie — Dark Grey" [ref=e58]
              - generic [ref=e59]: Available
            - generic [ref=e60]:
              - generic [ref=e61]: "\"Respect Is Earned\" Hoodie — Dark Grey"
              - generic [ref=e62]:
                - generic [ref=e63]: $98.00 AUD
                - generic [ref=e64]: 14 in stock
          - button "Thank You Journal Pen and Thermos Flask Bundle Available Thank You Journal Pen and Thermos Flask Bundle $59.00 AUD 19 in stock" [ref=e65] [cursor=pointer]:
            - generic [ref=e66]:
              - img "Thank You Journal Pen and Thermos Flask Bundle" [ref=e67]
              - generic [ref=e68]: Available
            - generic [ref=e69]:
              - generic [ref=e70]: Thank You Journal Pen and Thermos Flask Bundle
              - generic [ref=e71]:
                - generic [ref=e72]: $59.00 AUD
                - generic [ref=e73]: 19 in stock
      - generic [ref=e74]:
        - generic [ref=e75]:
          - paragraph [ref=e76]: Available now
          - heading "Shop the collection" [level=1] [ref=e77]
          - paragraph [ref=e80]: Current owner-approved stock is available for delivery within Australia.
          - paragraph [ref=e81]: Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
        - generic [ref=e84]: Merch
        - generic [ref=e86]:
          - generic [ref=e87]:
            - generic [ref=e88] [cursor=pointer]:
              - generic [ref=e89]:
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 1" [ref=e90]
                - img "\"Respect Is Earned\" Hoodie — Dark Grey 2" [ref=e91]
                - generic [ref=e92]:
                  - button [ref=e93]
                  - button [ref=e94]
              - img [ref=e96]
              - generic [ref=e99]: Available Now
            - generic [ref=e100]:
              - paragraph [ref=e102]: "\"Respect Is Earned\" Hoodie — Dark Grey"
              - paragraph [ref=e103]: $98 AUD
              - paragraph [ref=e104]: Owner-counted stock in S, M, L and XL. Delivery is calculated before payment.
              - generic [ref=e105]:
                - generic [ref=e106]:
                  - button "S (3)" [ref=e107] [cursor=pointer]
                  - button "M (4)" [ref=e108] [cursor=pointer]
                  - button "L (5)" [ref=e109] [cursor=pointer]
                  - button "XL (2)" [ref=e110] [cursor=pointer]
                - paragraph [ref=e111]: Please select a size
              - button "Add to Cart" [active] [ref=e112] [cursor=pointer]:
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
          - img "Gannon Waye" [ref=e141]
          - paragraph [ref=e142]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
        - generic [ref=e143]:
          - heading "Navigate" [level=4] [ref=e144]
          - generic [ref=e145]:
            - link "Home" [ref=e146] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e147] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e148] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e149] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e150] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e151] [cursor=pointer]:
              - /url: /press
            - link "Mum Tribute" [ref=e152] [cursor=pointer]:
              - /url: /remember-mum
            - link "Contact" [ref=e153] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e154]:
          - heading "Contact" [level=4] [ref=e155]
          - paragraph [ref=e156]: For music, media, collaboration, and business enquiries
          - link "gannonwayemusic@gmail.com" [ref=e157] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e158]
          - generic [ref=e159]:
            - link "Privacy Policy" [ref=e160] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e161] [cursor=pointer]:
              - /url: /terms-of-service
          - heading "Social" [level=4] [ref=e162]
          - generic [ref=e163]:
            - link "Instagram @gann0nwaye" [ref=e164] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e165] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e166] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e167]:
        - paragraph [ref=e168]: Stay connected
        - heading "Music and merchandise updates" [level=3] [ref=e169]
        - paragraph [ref=e170]: One clear signup form, with explicit consent, is available on the home page.
        - link "Join the Update List" [ref=e171] [cursor=pointer]:
          - /url: /#updates
      - generic [ref=e172]:
        - paragraph [ref=e173]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
        - paragraph [ref=e174]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e175]:
    - img [ref=e176]
    - paragraph [ref=e178]: 🎶Follow the story through music and creative updates
    - button "Dismiss" [ref=e179] [cursor=pointer]:
      - img [ref=e180]
```

# Test source

```ts
  24  |   test('cart button is visible with data-testid', async ({ page }) => {
  25  |     await page.goto(`${BASE_URL}/store/all`);
  26  |     await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  27  |   });
  28  | 
  29  |   test('add to cart shows confirmation', async ({ page }) => {
  30  |     await page.goto(`${BASE_URL}/store/all`);
  31  |     await page.waitForSelector('[data-testid="add-to-cart-btn"]');
  32  | 
  33  |     // Select size if required
  34  |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  35  |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  36  | 
  37  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  38  |     const count = await addBtns.count();
  39  |     for (let i = 0; i < count; i++) {
  40  |       const btn = addBtns.nth(i);
  41  |       if (await btn.isVisible()) { await btn.click(); break; }
  42  |     }
  43  | 
  44  |     await expect(page.locator('[data-testid="add-to-cart-success"]').first()).toBeVisible({ timeout: 3000 });
  45  |   });
  46  | 
  47  |   test('continue shopping button closes confirmation', async ({ page }) => {
  48  |     await page.goto(`${BASE_URL}/store/all`);
  49  |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  50  |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  51  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  52  |     const count = await addBtns.count();
  53  |     for (let i = 0; i < count; i++) {
  54  |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  55  |     }
  56  |     await page.locator('[data-testid="continue-shopping-button"]').first().click();
  57  |     await expect(page.locator('[data-testid="add-to-cart-success"]')).not.toBeVisible({ timeout: 2000 });
  58  |   });
  59  | 
  60  |   test('view cart button opens cart drawer', async ({ page }) => {
  61  |     await page.goto(`${BASE_URL}/store/all`);
  62  |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  63  |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  64  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  65  |     const count = await addBtns.count();
  66  |     for (let i = 0; i < count; i++) {
  67  |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  68  |     }
  69  |     await page.locator('[data-testid="view-cart-button"]').first().click();
  70  |     await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible({ timeout: 3000 });
  71  |   });
  72  | 
  73  |   test('cart checkout button routes to cart-details', async ({ page }) => {
  74  |     await page.goto(`${BASE_URL}/store/all`);
  75  |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  76  |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  77  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  78  |     const count = await addBtns.count();
  79  |     for (let i = 0; i < count; i++) {
  80  |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  81  |     }
  82  |     await page.locator('[data-testid="view-cart-button"]').first().click();
  83  |     await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
  84  |     await page.locator('[data-testid="cart-checkout-button"]').click();
  85  |     await expect(page).toHaveURL(/\/store\/cart-details/);
  86  |   });
  87  | 
  88  |   test('sticky checkout bar appears when cart has items', async ({ page }) => {
  89  |     await page.goto(`${BASE_URL}/store/all`);
  90  |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  91  |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  92  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  93  |     const count = await addBtns.count();
  94  |     for (let i = 0; i < count; i++) {
  95  |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  96  |     }
  97  |     await expect(page.locator('[data-testid="store-sticky-checkout"]')).toBeVisible({ timeout: 3000 });
  98  |     await expect(page.locator('[data-testid="store-sticky-checkout-button"]')).toBeVisible();
  99  |   });
  100 | 
  101 |   test('sticky checkout button routes to cart-details', async ({ page }) => {
  102 |     await page.goto(`${BASE_URL}/store/all`);
  103 |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  104 |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  105 |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  106 |     const count = await addBtns.count();
  107 |     for (let i = 0; i < count; i++) {
  108 |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  109 |     }
  110 |     await page.locator('[data-testid="store-sticky-checkout-button"]').click();
  111 |     await expect(page).toHaveURL(/\/store\/cart-details/);
  112 |   });
  113 | 
  114 |   test('go-to-checkout button from confirmation routes to cart-details', async ({ page }) => {
  115 |     await page.goto(`${BASE_URL}/store/all`);
  116 |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  117 |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  118 |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  119 |     const count = await addBtns.count();
  120 |     for (let i = 0; i < count; i++) {
  121 |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  122 |     }
  123 |     const checkoutBtn = page.locator('[data-testid="go-to-checkout-button"]').first();
> 124 |     await checkoutBtn.click();
      |                       ^ Error: locator.click: Test timeout of 60000ms exceeded.
  125 |     await expect(page).toHaveURL(/\/store\/cart-details/);
  126 |   });
  127 | 
  128 |   test('cart count badge shows item count', async ({ page }) => {
  129 |     await page.goto(`${BASE_URL}/store/all`);
  130 |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  131 |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  132 |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  133 |     const count = await addBtns.count();
  134 |     for (let i = 0; i < count; i++) {
  135 |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  136 |     }
  137 |     await expect(page.locator('[data-testid="cart-count"]')).toBeVisible({ timeout: 3000 });
  138 |     const text = await page.locator('[data-testid="cart-count"]').textContent();
  139 |     expect(parseInt(text)).toBeGreaterThan(0);
  140 |   });
  141 | });
```