# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.js >> Order review and checkout page >> different hoodie sizes remain separate cart lines
- Location: src/gannonwaye-playwright-pack/tests/checkout.spec.js:71:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-testid="cart-line"]')
Expected: 2
Received: 0

Call log:
  - Expect "toHaveCount" with timeout 10000ms
  - waiting for locator('[data-testid="cart-line"]')
    3 × locator resolved to 0 elements
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
          - generic [ref=e37]: "2"
  - main [ref=e38]:
    - generic [ref=e40]:
      - paragraph [ref=e41]: Enter your delivery details before reviewing the order.
      - button "Enter Details" [ref=e42] [cursor=pointer]
  - contentinfo [ref=e43]:
    - generic [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]:
          - img "Gannon Waye" [ref=e47]
          - paragraph [ref=e48]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
        - generic [ref=e49]:
          - heading "Navigate" [level=4] [ref=e50]
          - generic [ref=e51]:
            - link "Home" [ref=e52] [cursor=pointer]:
              - /url: /
            - link "Biography" [ref=e53] [cursor=pointer]:
              - /url: /biography
            - link "Music" [ref=e54] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e55] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e56] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e57] [cursor=pointer]:
              - /url: /press
            - link "Mum Tribute" [ref=e58] [cursor=pointer]:
              - /url: /remember-mum
            - link "Contact" [ref=e59] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e60]:
          - heading "Contact" [level=4] [ref=e61]
          - paragraph [ref=e62]: For music, media, collaboration, and business enquiries
          - link "gannonwayemusic@gmail.com" [ref=e63] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e64]
          - generic [ref=e65]:
            - link "Privacy Policy" [ref=e66] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e67] [cursor=pointer]:
              - /url: /terms-of-service
          - heading "Social" [level=4] [ref=e68]
          - generic [ref=e69]:
            - link "Instagram @gann0nwaye" [ref=e70] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e71] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e72] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e73]:
        - paragraph [ref=e74]: Stay connected
        - heading "Music and merchandise updates" [level=3] [ref=e75]
        - paragraph [ref=e76]: One clear signup form, with explicit consent, is available on the home page.
        - link "Join the Update List" [ref=e77] [cursor=pointer]:
          - /url: /#updates
      - generic [ref=e78]:
        - paragraph [ref=e79]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
        - paragraph [ref=e80]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e81]:
    - img [ref=e82]
    - paragraph [ref=e84]: 🎵Approved music and official listening links appear on the Music page
    - button "Dismiss" [ref=e85] [cursor=pointer]:
      - img [ref=e86]
```

# Test source

```ts
  1   |  
  2   | // @ts-check
  3   | const { test, expect } = require('@playwright/test');
  4   | 
  5   | const DETAILS = {
  6   |   full_name: 'Checkout Verification',
  7   |   email: 'checkout-verification@example.com',
  8   |   mobile: '+61 400 000 000',
  9   |   street_address: '123 Verification Street',
  10  |   suburb: 'Melbourne',
  11  |   state: 'VIC',
  12  |   postcode: '3000',
  13  |   country: 'Australia',
  14  |   order_support_consent: true,
  15  |   marketing_opt_in: false,
  16  | };
  17  | 
  18  | async function prepareDetails(page) {
  19  |   await page.goto('/store');
  20  |   await page.evaluate(details => {
  21  |     localStorage.setItem('gannon_checkout_details_v1', JSON.stringify(details));
  22  |   }, DETAILS);
  23  | }
  24  | 
  25  | async function addHoodie(page, size = 'M') {
  26  |   const card = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
  27  |   await expect(card).toBeVisible();
  28  |   await card.getByRole('button', { name: new RegExp(`^${size} \\(`) }).click();
  29  |   await card.locator('[data-testid="add-to-cart-btn"]').click();
  30  |   await expect(card.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
  31  | }
  32  | 
  33  | async function addBundle(page) {
  34  |   const card = page.locator('[data-testid="product-card"]').filter({ hasText: 'Journal Pen and Thermos' }).first();
  35  |   await expect(card).toBeVisible();
  36  |   await card.locator('[data-testid="add-to-cart-btn"]').click();
  37  |   await expect(card.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
  38  | }
  39  | 
  40  | async function openCheckoutWithBundle(page) {
  41  |   await prepareDetails(page);
  42  |   await addBundle(page);
  43  |   await page.goto('/store/checkout');
  44  |   await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
  45  | }
  46  | 
  47  | test.describe('Order review and checkout page', () => {
  48  |   test('checkout page loads with verified cart item and summaries', async ({ page }) => {
  49  |     await openCheckoutWithBundle(page);
  50  |     await expect(page.locator('[data-testid="checkout-items"]')).toBeVisible();
  51  |     await expect(page.locator('[data-testid="checkout-customer-summary"]')).toContainText('Checkout Verification');
  52  |     await expect(page.locator('[data-testid="checkout-delivery-summary"]')).toContainText('Melbourne');
  53  |     await expect(page.locator('[data-testid="cart-line"]').first()).toContainText('Journal Pen and Thermos');
  54  |   });
  55  | 
  56  |   test('customer can increase and decrease within verified stock', async ({ page }) => {
  57  |     await openCheckoutWithBundle(page);
  58  |     const line = page.locator('[data-testid="cart-line"]').first();
  59  |     await line.locator('[data-testid="cart-line-increase"]').click();
  60  |     await expect(line).toContainText('$118.00 AUD');
  61  |     await line.locator('[data-testid="cart-line-decrease"]').click();
  62  |     await expect(line).toContainText('$59.00 AUD');
  63  |   });
  64  | 
  65  |   test('customer can remove the item', async ({ page }) => {
  66  |     await openCheckoutWithBundle(page);
  67  |     await page.locator('[data-testid="cart-line-remove"]').first().click();
  68  |     await expect(page.locator('[data-testid="empty-cart-return-store"]')).toBeVisible();
  69  |   });
  70  | 
  71  |   test('different hoodie sizes remain separate cart lines', async ({ page }) => {
  72  |     await prepareDetails(page);
  73  |     await addHoodie(page, 'M');
  74  |     await page.goto('/store');
  75  |     await addHoodie(page, 'L');
  76  |     await page.goto('/store/checkout');
> 77  |     await expect(page.locator('[data-testid="cart-line"]')).toHaveCount(2);
      |                                                             ^ Error: expect(locator).toHaveCount(expected) failed
  78  |     await expect(page.locator('[data-testid="cart-line"]').filter({ hasText: 'Size: M' })).toBeVisible();
  79  |     await expect(page.locator('[data-testid="cart-line"]').filter({ hasText: 'Size: L' })).toBeVisible();
  80  |   });
  81  | 
  82  |   test('stage one checkout has no promo code or support add-on controls', async ({ page }) => {
  83  |     await openCheckoutWithBundle(page);
  84  |     await expect(page.locator('[data-testid="promo-code-input"]')).toHaveCount(0);
  85  |     await expect(page.getByText(/support contribution/i)).toHaveCount(0);
  86  |   });
  87  | 
  88  |   test('delivery appears once and the totals are visible', async ({ page }) => {
  89  |     await openCheckoutWithBundle(page);
  90  |     await expect(page.locator('[data-testid="checkout-shipping"]')).toHaveCount(1);
  91  |     await expect(page.locator('[data-testid="checkout-shipping"]')).toContainText('$17.50 AUD');
  92  |     await expect(page.locator('[data-testid="checkout-subtotal"]')).toContainText('$59.00');
  93  |     await expect(page.locator('[data-testid="checkout-total"]')).toContainText('$76.50 AUD');
  94  |   });
  95  | 
  96  |   test('pay button is enabled only after delivery is ready', async ({ page }) => {
  97  |     await openCheckoutWithBundle(page);
  98  |     const pay = page.locator('[data-testid="checkout-pay-button"]');
  99  |     await expect(pay).toBeVisible();
  100 |     await expect(pay).toBeEnabled();
  101 |     await expect(pay).toContainText('$76.50 AUD');
  102 |   });
  103 | 
  104 |   test('empty cart returns the customer to the store', async ({ page }) => {
  105 |     await page.goto('/store');
  106 |     await page.evaluate(() => {
  107 |       localStorage.removeItem('gannon_store_cart_v2');
  108 |     });
  109 |     await page.goto('/store/checkout');
  110 |     await expect(page.locator('[data-testid="empty-cart-return-store"]')).toBeVisible();
  111 |   });
  112 | });
```