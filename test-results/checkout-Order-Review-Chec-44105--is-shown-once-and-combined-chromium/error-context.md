# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.js >> Order Review / Checkout Page >> shipping is shown once and combined
- Location: src/gannonwaye-playwright-pack/tests/checkout.spec.js:163:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="checkout-shipping"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="checkout-shipping"]')

```

```yaml
- navigation:
  - link "Gannon Waye · Home":
    - /url: /
    - text: GW
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
  - button "More":
    - text: More
    - img
  - button:
    - img
  - button "Open cart":
    - img
- main:
  - paragraph: Your cart is empty.
  - button "Return to Store"
- contentinfo:
  - text: GW
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
  - textbox "Your name"
  - textbox "Your email address"
  - checkbox "I would like to receive music and merchandise updates. I can unsubscribe at any time."
  - text: I would like to receive music and merchandise updates. I can unsubscribe at any time.
  - button "Join the Update List"
  - paragraph: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
  - paragraph: © 2026 Gannon Waye. All rights reserved.
- img
- paragraph: 🖤Independent, emotionally honest music from Gannon Waye
- button "Dismiss":
  - img
```

# Test source

```ts
  65  |     await openCheckoutWithBundle(page);
  66  |     await page.locator('[data-testid="cart-line-remove"]').first().click();
  67  |     await expect(page.locator('[data-testid="empty-cart-return-store"]')).toBeVisible();
  68  |   });
  69  | 
  70  |   test('different hoodie sizes remain separate cart lines', async ({ page }) => {
  71  |     await prepareDetails(page);
  72  |     await addHoodie(page, 'M');
  73  |     await page.goto('/store');
  74  |     await addHoodie(page, 'L');
  75  |     await page.goto('/store/checkout');
  76  |     await expect(page.locator('[data-testid="cart-line"]')).toHaveCount(2);
  77  |     await expect(page.locator('[data-testid="cart-line"]').filter({ hasText: 'Size: M' })).toBeVisible();
  78  |     await expect(page.locator('[data-testid="cart-line"]').filter({ hasText: 'Size: L' })).toBeVisible();
  79  |   });
  80  | 
  81  |   test('stage one checkout has no promo code or support add-on controls', async ({ page }) => {
  82  |     await openCheckoutWithBundle(page);
  83  |     await expect(page.locator('[data-testid="promo-code-input"]')).toHaveCount(0);
  84  |     await expect(page.getByText(/support contribution/i)).toHaveCount(0);
  85  |   });
  86  | 
  87  |   test('delivery appears once and the totals are visible', async ({ page }) => {
  88  |     await openCheckoutWithBundle(page);
  89  |     await expect(page.locator('[data-testid="checkout-shipping"]')).toHaveCount(1);
  90  |     await expect(page.locator('[data-testid="checkout-shipping"]')).toContainText('$17.50 AUD');
  91  |     await expect(page.locator('[data-testid="checkout-subtotal"]')).toContainText('$59.00');
  92  |     await expect(page.locator('[data-testid="checkout-total"]')).toContainText('$76.50 AUD');
  93  |   });
  94  | 
  95  |   test('pay button is enabled only after delivery is ready', async ({ page }) => {
  96  |     await openCheckoutWithBundle(page);
  97  |     const pay = page.locator('[data-testid="checkout-pay-button"]');
  98  |     await expect(pay).toBeVisible();
  99  |     await expect(pay).toBeEnabled();
  100 |     await expect(pay).toContainText('$76.50 AUD');
  101 |   });
  102 | 
  103 |   test('empty cart returns the customer to the store', async ({ page }) => {
  104 |     await page.goto('/store');
  105 |     await page.evaluate(() => {
  106 |       localStorage.removeItem('gannon_store_cart_v2');
  107 |     });
  108 |     await page.goto('/store/checkout');
  109 |     await expect(page.locator('[data-testid="empty-cart-return-store"]')).toBeVisible();
  110 |   });
  111 | });
  112 | 
      |                                                                     ^ Error: expect(locator).toBeVisible() failed
```