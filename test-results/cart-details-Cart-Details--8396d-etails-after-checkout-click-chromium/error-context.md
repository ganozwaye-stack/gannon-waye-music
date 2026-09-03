# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart-details.spec.js >> Cart Details Page >> navigates to /store/cart-details after checkout click
- Location: src/gannonwaye-playwright-pack/tests/cart-details.spec.js:33:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('[data-testid="store-sticky-checkout-button"]')

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
    - paragraph [ref=e178]: 🛍️The Store shows only current owner-approved stock
    - button "Dismiss" [ref=e179] [cursor=pointer]:
      - img [ref=e180]
```

# Test source

```ts
  1   | // @ts-check
  2   |  
  3   |  
  4   | const { test, expect } = require('@playwright/test');
  5   | 
  6   | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  7   | 
  8   | async function addItemToCart(page) {
  9   |   await page.goto(`${BASE_URL}/store/all`);
  10  |   await page.waitForSelector('[data-testid="product-card"]');
  11  |   
  12  |   // Select size M first if it exists, to avoid size selection validation toasts
  13  |   const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  14  |   if (await sizeM.isVisible().catch(() => false)) {
  15  |     await sizeM.click({ force: true });
  16  |   }
  17  | 
  18  |   // Click first visible add to cart button
  19  |   const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  20  |   const count = await addBtns.count();
  21  |   for (let i = 0; i < count; i++) {
  22  |     const btn = addBtns.nth(i);
  23  |     if (await btn.isVisible()) {
  24  |       await btn.click({ force: true });
  25  |       // Wait for the cart drawer checkout button to ensure Zustand state is saved
  26  |       await page.waitForSelector('[data-testid="go-to-checkout-button"]', { timeout: 5000 }).catch(() => {});
  27  |       break;
  28  |     }
  29  |   }
  30  | }
  31  | 
  32  | test.describe('Cart Details Page', () => {
  33  |   test('navigates to /store/cart-details after checkout click', async ({ page }) => {
  34  |     await addItemToCart(page);
  35  |     const checkoutBtn = page.locator('[data-testid="go-to-checkout-button"]').first();
  36  |     if (await checkoutBtn.isVisible().catch(() => false)) {
  37  |       await checkoutBtn.click();
  38  |     } else {
> 39  |       await page.locator('[data-testid="store-sticky-checkout-button"]').click();
      |                                                                          ^ Error: locator.click: Test timeout of 60000ms exceeded.
  40  |     }
  41  |     await expect(page).toHaveURL(/cart-details/);
  42  |     await expect(page.locator('[data-testid="cart-details-page"]')).toBeVisible();
  43  |   });
  44  | 
  45  |   test('required fields block continuation when empty', async ({ page }) => {
  46  |     await page.goto(`${BASE_URL}/store/cart-details`);
  47  |     // If redirected to /store (empty cart), that's acceptable — add item first
  48  |     if (page.url().includes('/store') && !page.url().includes('cart-details')) {
  49  |       await addItemToCart(page);
  50  |       await page.goto(`${BASE_URL}/store/cart-details`);
  51  |     }
  52  |     const continueBtn = page.locator('[data-testid="continue-to-review-button"]');
  53  |     await continueBtn.click();
  54  |     // At least one validation error should appear
  55  |     const errors = page.locator('.text-destructive');
  56  |     await expect(errors.first()).toBeVisible();
  57  |   });
  58  | 
  59  |   test('customer can fill all required fields and continue', async ({ page }) => {
  60  |     await addItemToCart(page);
  61  |     await page.goto(`${BASE_URL}/store/cart-details`);
  62  | 
  63  |     await page.fill('[data-testid="input-full-name"]', 'Jane Smith');
  64  |     await page.fill('[data-testid="input-email"]', 'jane@example.com');
  65  |     await page.fill('[data-testid="input-mobile"]', '+61 400 000 000');
  66  |     await page.fill('[data-testid="input-street-address"]', '123 Test Street');
  67  |     await page.fill('[data-testid="input-suburb"]', 'Melbourne');
  68  |     // State — select VIC
  69  |     const stateSelect = page.locator('[data-testid="input-state"]');
  70  |     const tag = await stateSelect.evaluate(el => el.tagName);
  71  |     if (tag === 'SELECT') {
  72  |       await stateSelect.selectOption('VIC');
  73  |     } else {
  74  |       await stateSelect.fill('VIC');
  75  |     }
  76  |     await page.fill('[data-testid="input-postcode"]', '3000');
  77  | 
  78  |     await page.locator('[data-testid="continue-to-review-button"]').click();
  79  |     await expect(page).toHaveURL(/checkout/);
  80  |   });
  81  | 
  82  |   test('optional fields (DOB, business name, ABN) are not required', async ({ page }) => {
  83  |     await addItemToCart(page);
  84  |     await page.goto(`${BASE_URL}/store/cart-details`);
  85  | 
  86  |     // Fill required only — no DOB/business/ABN
  87  |     await page.fill('[data-testid="input-full-name"]', 'Test User');
  88  |     await page.fill('[data-testid="input-email"]', 'test@example.com');
  89  |     await page.fill('[data-testid="input-mobile"]', '0400000000');
  90  |     await page.fill('[data-testid="input-street-address"]', '456 Real Street');
  91  |     await page.fill('[data-testid="input-suburb"]', 'Sydney');
  92  |     const stateSelect = page.locator('[data-testid="input-state"]');
  93  |     const tag = await stateSelect.evaluate(el => el.tagName);
  94  |     if (tag === 'SELECT') { await stateSelect.selectOption('NSW'); } else { await stateSelect.fill('NSW'); }
  95  |     await page.fill('[data-testid="input-postcode"]', '2000');
  96  | 
  97  |     await page.locator('[data-testid="continue-to-review-button"]').click();
  98  |     await expect(page).toHaveURL(/checkout/);
  99  |   });
  100 | 
  101 |   test('marketing opt-in checkbox exists and is optional', async ({ page }) => {
  102 |     await page.goto(`${BASE_URL}/store/cart-details`);
  103 |     const cb = page.locator('[data-testid="checkbox-marketing-opt-in"]');
  104 |     // May redirect to /store if empty cart — just check it exists on the form page
  105 |     if (await cb.isVisible().catch(() => false)) {
  106 |       await expect(cb).not.toBeChecked();
  107 |     }
  108 |   });
  109 | });
```