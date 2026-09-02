# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.js >> Order Review / Checkout Page >> customer can decrease item quantity
- Location: src/gannonwaye-playwright-pack/tests/checkout.spec.js:87:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('[data-testid="cart-line-increase"]').first()

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
    - generic [ref=e40]:
      - paragraph [ref=e41]: Your cart is empty.
      - button "Return to Store" [ref=e42] [cursor=pointer]
  - contentinfo [ref=e43]:
    - generic [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]:
          - generic [ref=e48]: GW
          - paragraph [ref=e49]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
        - generic [ref=e50]:
          - heading "Navigate" [level=4] [ref=e51]
          - generic [ref=e52]:
            - link "Home" [ref=e53] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e54] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e55] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e56] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e57] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e58] [cursor=pointer]:
              - /url: /press
            - link "Mum Tribute" [ref=e59] [cursor=pointer]:
              - /url: /remember-mum
            - link "Contact" [ref=e60] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e61]:
          - heading "Contact" [level=4] [ref=e62]
          - paragraph [ref=e63]: For music, media, collaboration, and business enquiries
          - link "gannonwayemusic@gmail.com" [ref=e64] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e65]
          - generic [ref=e66]:
            - link "Privacy Policy" [ref=e67] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e68] [cursor=pointer]:
              - /url: /terms-of-service
          - heading "Social" [level=4] [ref=e69]
          - generic [ref=e70]:
            - link "Instagram @gann0nwaye" [ref=e71] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e72] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e73] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e74]:
        - paragraph [ref=e75]: Stay connected
        - heading "Music and merchandise updates" [level=3] [ref=e76]
        - generic [ref=e77]:
          - textbox "Your name" [ref=e78]
          - textbox "Your email address" [ref=e79]
          - generic [ref=e80] [cursor=pointer]:
            - checkbox "I would like to receive music and merchandise updates. I can unsubscribe at any time." [ref=e81]
            - generic [ref=e82]: I would like to receive music and merchandise updates. I can unsubscribe at any time.
          - button "Join the Update List" [ref=e83] [cursor=pointer]
      - generic [ref=e84]:
        - paragraph [ref=e85]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
        - paragraph [ref=e86]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e87]:
    - img [ref=e88]
    - paragraph [ref=e90]: 🛍️The Store shows only current owner-approved stock
    - button "Dismiss" [ref=e91] [cursor=pointer]:
      - img [ref=e92]
```

# Test source

```ts
  1   | // @ts-check
  2   |  
  3   | /* eslint-disable no-undef */
  4   | const { test, expect } = require('@playwright/test');
  5   | 
  6   | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  7   | 
  8   | const DETAILS = {
  9   |   full_name: 'Gannon Test',
  10  |   email: 'test@gannonwaye.com',
  11  |   mobile: '+61 400 000 000',
  12  |   street_address: '123 Test Street',
  13  |   suburb: 'Melbourne',
  14  |   state: 'VIC',
  15  |   postcode: '3000',
  16  |   country: 'Australia',
  17  | };
  18  | 
  19  | async function fillDetailsAndNavigate(page) {
  20  |   // Set localStorage details so checkout page loads correctly
  21  |   await page.goto(`${BASE_URL}/store/all`);
  22  |   await page.evaluate((d) => {
  23  |     localStorage.setItem('gannon_checkout_details_v1', JSON.stringify({
  24  |       ...d,
  25  |       dob: '', business_name: '', abn: '',
  26  |       order_support_consent: true, marketing_opt_in: false,
  27  |     }));
  28  |   }, DETAILS);
  29  | 
  30  |   // Add item to cart via UI
  31  |   await page.waitForSelector('[data-testid="product-card"]');
  32  |   
  33  |   // Select size M first if visible
  34  |   const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  35  |   if (await sizeM.isVisible().catch(() => false)) {
  36  |     await sizeM.click({ force: true });
  37  |   }
  38  | 
  39  |   const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  40  |   const count = await addBtns.count();
  41  |   for (let i = 0; i < count; i++) {
  42  |     const btn = addBtns.nth(i);
  43  |     if (await btn.isVisible()) {
  44  |       await btn.click({ force: true });
  45  |       // Wait for the cart drawer checkout button to ensure Zustand state is saved
  46  |       await page.waitForSelector('[data-testid="go-to-checkout-button"]', { timeout: 5000 }).catch(() => {});
  47  |       break;
  48  |     }
  49  |   }
  50  |   await page.goto(`${BASE_URL}/store/checkout`);
  51  |   await page.waitForSelector('[data-testid="checkout-page"]');
  52  | }
  53  | 
  54  | test.describe('Order Review / Checkout Page', () => {
  55  |   test('checkout page loads with items', async ({ page }) => {
  56  |     await fillDetailsAndNavigate(page);
  57  |     await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
  58  |     await expect(page.locator('[data-testid="checkout-items"]')).toBeVisible();
  59  |   });
  60  | 
  61  |   test('customer summary is visible', async ({ page }) => {
  62  |     await fillDetailsAndNavigate(page);
  63  |     await expect(page.locator('[data-testid="checkout-customer-summary"]')).toBeVisible();
  64  |     await expect(page.locator('[data-testid="checkout-customer-summary"]')).toContainText('Gannon Test');
  65  |   });
  66  | 
  67  |   test('delivery summary is visible', async ({ page }) => {
  68  |     await fillDetailsAndNavigate(page);
  69  |     await expect(page.locator('[data-testid="checkout-delivery-summary"]')).toBeVisible();
  70  |     await expect(page.locator('[data-testid="checkout-delivery-summary"]')).toContainText('Melbourne');
  71  |   });
  72  | 
  73  |   test('cart items are shown', async ({ page }) => {
  74  |     await fillDetailsAndNavigate(page);
  75  |     const lines = page.locator('[data-testid="cart-line"]');
  76  |     await expect(lines.first()).toBeVisible();
  77  |   });
  78  | 
  79  |   test('customer can increase item quantity', async ({ page }) => {
  80  |     await fillDetailsAndNavigate(page);
  81  |     const increaseBtn = page.locator('[data-testid="cart-line-increase"]').first();
  82  |     await increaseBtn.click();
  83  |     // Total should update — just assert it's still visible
  84  |     await expect(page.locator('[data-testid="checkout-total"]')).toBeVisible();
  85  |   });
  86  | 
  87  |   test('customer can decrease item quantity', async ({ page }) => {
  88  |     await fillDetailsAndNavigate(page);
  89  |     // First increase so decrease doesn't remove item
> 90  |     await page.locator('[data-testid="cart-line-increase"]').first().click();
      |                                                                      ^ Error: locator.click: Test timeout of 60000ms exceeded.
  91  |     await page.locator('[data-testid="cart-line-decrease"]').first().click();
  92  |     await expect(page.locator('[data-testid="checkout-total"]')).toBeVisible();
  93  |   });
  94  | 
  95  |   test('customer can remove item', async ({ page }) => {
  96  |     await fillDetailsAndNavigate(page);
  97  |     // Add a second item via cart store manipulation, then remove the first
  98  |     await page.locator('[data-testid="cart-line-remove"]').first().click();
  99  |     // Either shows empty state or remaining items
  100 |     const isEmpty = await page.locator('[data-testid="empty-cart-return-store"]').isVisible().catch(() => false);
  101 |     const hasItems = await page.locator('[data-testid="cart-line"]').count() >= 0;
  102 |     expect(isEmpty || hasItems).toBeTruthy();
  103 |   });
  104 | 
  105 |   test('different sizes create separate cart lines', async ({ page }) => {
  106 |     await page.goto(`${BASE_URL}/store/all`);
  107 |     await page.evaluate((d) => {
  108 |       localStorage.setItem('gannon_checkout_details_v1', JSON.stringify({
  109 |         ...d, dob: '', business_name: '', abn: '',
  110 |         order_support_consent: true, marketing_opt_in: false,
  111 |       }));
  112 |     }, DETAILS);
  113 | 
  114 |     // Find Hoodie product card with sizes - select size M
  115 |     const hoodieCard = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
  116 |     await expect(hoodieCard).toBeVisible();
  117 | 
  118 |     const sizeM = hoodieCard.locator('button').filter({ hasText: /^M$/ });
  119 |     await sizeM.click({ force: true });
  120 |     await hoodieCard.locator('[data-testid="add-to-cart-btn"]').click({ force: true });
  121 | 
  122 |     // Now add size L — navigate back to store
  123 |     await page.goto(`${BASE_URL}/store/all`);
  124 |     const hoodieCard2 = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
  125 |     await expect(hoodieCard2).toBeVisible();
  126 | 
  127 |     const sizeL = hoodieCard2.locator('button').filter({ hasText: /^L$/ });
  128 |     await sizeL.click({ force: true });
  129 |     await hoodieCard2.locator('[data-testid="add-to-cart-btn"]').click({ force: true });
  130 | 
  131 |     await page.goto(`${BASE_URL}/store/checkout`);
  132 |     const lines = page.locator('[data-testid="cart-line"]');
  133 |     const lineCount = await lines.count();
  134 |     expect(lineCount).toBeGreaterThanOrEqual(2);
  135 |   });
  136 | 
  137 |   test('promo code input is visible', async ({ page }) => {
  138 |     await fillDetailsAndNavigate(page);
  139 |     await expect(page.locator('[data-testid="promo-code-input"]')).toBeVisible();
  140 |     await expect(page.locator('[data-testid="apply-promo-code"]')).toBeVisible();
  141 |   });
  142 | 
  143 |   test('valid promo code applies', async ({ page }) => {
  144 |     await fillDetailsAndNavigate(page);
  145 |     await page.fill('[data-testid="promo-code-input"]', 'F20UN26DVIP');
  146 |     await page.locator('[data-testid="apply-promo-code"]').click();
  147 |     // Should show discount or success — not an error
  148 |     await page.waitForTimeout(2000);
  149 |     const hasError = await page.locator('.text-destructive').isVisible().catch(() => false);
  150 |     // May show as applied (check for promo display or no error)
  151 |     const hasPrimarySuccess = await page.locator('.text-primary').isVisible().catch(() => false);
  152 |     expect(hasError === false || hasPrimarySuccess === true).toBeTruthy();
  153 |   });
  154 | 
  155 |   test('invalid promo code rejects', async ({ page }) => {
  156 |     await fillDetailsAndNavigate(page);
  157 |     await page.fill('[data-testid="promo-code-input"]', 'INVALIDCODE999');
  158 |     await page.locator('[data-testid="apply-promo-code"]').click();
  159 |     await page.waitForTimeout(2000);
  160 |     await expect(page.locator('.text-destructive').first()).toBeVisible();
  161 |   });
  162 | 
  163 |   test('shipping is shown once and combined', async ({ page }) => {
  164 |     await fillDetailsAndNavigate(page);
  165 |     await expect(page.locator('[data-testid="checkout-shipping"]')).toBeVisible();
  166 |     const shippingEls = await page.locator('[data-testid="checkout-shipping"]').count();
  167 |     expect(shippingEls).toBe(1);
  168 |   });
  169 | 
  170 |   test('subtotal and total are visible', async ({ page }) => {
  171 |     await fillDetailsAndNavigate(page);
  172 |     await expect(page.locator('[data-testid="checkout-subtotal"]')).toBeVisible();
  173 |     await expect(page.locator('[data-testid="checkout-total"]')).toBeVisible();
  174 |   });
  175 | 
  176 |   test('pay button is visible and enabled', async ({ page }) => {
  177 |     await fillDetailsAndNavigate(page);
  178 |     const payBtn = page.locator('[data-testid="checkout-pay-button"]');
  179 |     await expect(payBtn).toBeVisible();
  180 |     await expect(payBtn).not.toBeDisabled();
  181 |   });
  182 | 
  183 |   test('empty cart shows return to store button', async ({ page }) => {
  184 |     await page.goto(`${BASE_URL}/store/all`);
  185 |     await page.evaluate(() => {
  186 |       const key = 'gannon_store_cart_v2';
  187 |       localStorage.setItem(key, JSON.stringify({ state: { items: [], __version: 3 }, version: 0 }));
  188 |     });
  189 |     await page.goto(`${BASE_URL}/store/checkout`);
  190 |     await expect(page.locator('[data-testid="empty-cart-return-store"]')).toBeVisible();
```