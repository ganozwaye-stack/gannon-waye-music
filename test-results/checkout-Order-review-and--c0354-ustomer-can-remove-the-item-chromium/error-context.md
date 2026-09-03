# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.js >> Order review and checkout page >> customer can remove the item
- Location: src/gannonwaye-playwright-pack/tests/checkout.spec.js:65:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="checkout-page"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="checkout-page"]')

```

```yaml
- navigation:
  - link "Gannon Waye · Home":
    - /url: /
    - text: Gannon Waye
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
  - button "Open more navigation links":
    - text: More
    - img
  - button "Search the site":
    - img
  - button "Open cart":
    - img
    - text: "1"
- main:
  - paragraph: Enter your delivery details before reviewing the order.
  - button "Enter Details"
- contentinfo:
  - img "Gannon Waye"
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
  - paragraph: One clear signup form, with explicit consent, is available on the home page.
  - link "Join the Update List":
    - /url: /#updates
  - paragraph: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
  - paragraph: © 2026 Gannon Waye. All rights reserved.
- img
- paragraph: 🖤Independent, emotionally honest music from Gannon Waye
- button "Dismiss":
  - img
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
> 44  |   await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
      |                                                               ^ Error: expect(locator).toBeVisible() failed
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
  77  |     await expect(page.locator('[data-testid="cart-line"]')).toHaveCount(2);
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