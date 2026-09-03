# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stage-one-checkout.spec.js >> Stage one checkout preview >> mixed order uses the governing live rule and configured threshold
- Location: src/gannonwaye-playwright-pack/tests/stage-one-checkout.spec.js:69:7

# Error details

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
    - text: "2"
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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const DETAILS = {
  4  |   full_name: 'Store Verification',
  5  |   email: 'store-verification@example.com',
  6  |   mobile: '+61 400 000 000',
  7  |   street_address: '123 Verification Street',
  8  |   suburb: 'Melbourne',
  9  |   state: 'VIC',
  10 |   postcode: '3000',
  11 |   country: 'Australia',
  12 |   order_support_consent: true,
  13 |   marketing_opt_in: false,
  14 | };
  15 | 
  16 | async function openStoreWithDetails(page) {
  17 |   await page.goto('/store');
  18 |   await page.evaluate(details => {
  19 |     localStorage.setItem('gannon_checkout_details_v1', JSON.stringify(details));
  20 |   }, DETAILS);
  21 | }
  22 | 
  23 | async function addHoodie(page, size = 'M') {
  24 |   const card = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
  25 |   await expect(card).toBeVisible();
  26 |   await card.getByRole('button', { name: new RegExp(`^${size} \\(`) }).click();
  27 |   await card.locator('[data-testid="add-to-cart-btn"]').click();
  28 |   await expect(card.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
  29 | }
  30 | 
  31 | async function addBundle(page) {
  32 |   const card = page.locator('[data-testid="product-card"]').filter({ hasText: 'Journal Pen and Thermos' }).first();
  33 |   await expect(card).toBeVisible();
  34 |   await card.locator('[data-testid="add-to-cart-btn"]').click();
  35 |   await expect(card.locator('[data-testid="add-to-cart-success"]')).toBeVisible();
  36 | }
  37 | 
  38 | async function openCheckout(page) {
  39 |   await page.goto('/store/checkout');
> 40 |   await expect(page.locator('[data-testid="checkout-page"]')).toBeVisible();
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  41 |   await expect(page.locator('[data-testid="checkout-pay-button"]')).toBeEnabled();
  42 | }
  43 | 
  44 | test.describe('Stage one checkout preview', () => {
  45 |   test('hoodie uses verified price, Australian merch delivery and no GST', async ({ page }) => {
  46 |     await openStoreWithDetails(page);
  47 |     await addHoodie(page, 'M');
  48 |     await openCheckout(page);
  49 | 
  50 |     await expect(page.locator('[data-testid="checkout-subtotal"]')).toContainText('$98.00');
  51 |     await expect(page.locator('[data-testid="checkout-shipping"]')).toContainText('$12.50 AUD');
  52 |     await expect(page.locator('[data-testid="checkout-total"]')).toContainText('$110.50 AUD');
  53 |     await expect(page.locator('[data-testid="checkout-pay-button"]')).toContainText('$110.50 AUD');
  54 |     await expect(page.locator('body')).toContainText('No GST is charged');
  55 |     await expect(page.locator('body')).not.toContainText('Includes GST');
  56 |   });
  57 | 
  58 |   test('journal bundle uses verified price and bundle delivery rule', async ({ page }) => {
  59 |     await openStoreWithDetails(page);
  60 |     await addBundle(page);
  61 |     await openCheckout(page);
  62 | 
  63 |     await expect(page.locator('[data-testid="checkout-subtotal"]')).toContainText('$59.00');
  64 |     await expect(page.locator('[data-testid="checkout-shipping"]')).toContainText('$17.50 AUD');
  65 |     await expect(page.locator('[data-testid="checkout-total"]')).toContainText('$76.50 AUD');
  66 |     await expect(page.locator('[data-testid="checkout-pay-button"]')).toContainText('$76.50 AUD');
  67 |   });
  68 | 
  69 |   test('mixed order uses the governing live rule and configured threshold', async ({ page }) => {
  70 |     await openStoreWithDetails(page);
  71 |     await addHoodie(page, 'S');
  72 |     await page.goto('/store');
  73 |     await addBundle(page);
  74 |     await openCheckout(page);
  75 | 
  76 |     await expect(page.locator('[data-testid="checkout-subtotal"]')).toContainText('$157.00');
  77 |     await expect(page.locator('[data-testid="checkout-shipping"]')).toContainText('No delivery charge');
  78 |     await expect(page.locator('[data-testid="checkout-total"]')).toContainText('$157.00 AUD');
  79 |   });
  80 | 
  81 |   test('cart quantity cannot exceed the verified hoodie size stock', async ({ page }) => {
  82 |     await openStoreWithDetails(page);
  83 |     await addHoodie(page, 'S');
  84 |     await openCheckout(page);
  85 | 
  86 |     const increase = page.locator('[data-testid="cart-line-increase"]').first();
  87 |     await increase.click();
  88 |     await increase.click();
  89 |     await expect(increase).toBeDisabled();
  90 |     await expect(page.locator('[data-testid="cart-line"]').first()).toContainText('$294.00 AUD');
  91 |   });
  92 | });
  93 | 
```