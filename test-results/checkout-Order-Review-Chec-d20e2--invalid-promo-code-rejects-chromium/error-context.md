# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.js >> Order Review / Checkout Page >> invalid promo code rejects
- Location: src/gannonwaye-playwright-pack/tests/checkout.spec.js:155:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('[data-testid="promo-code-input"]')

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
    - paragraph [ref=e90]: 🖤Independent, emotionally honest music from Gannon Waye
    - button "Dismiss" [ref=e91] [cursor=pointer]:
      - img [ref=e92]
```

# Test source

```ts
  57  |     const line = page.locator('[data-testid="cart-line"]').first();
  58  |     await line.locator('[data-testid="cart-line-increase"]').click();
  59  |     await expect(line).toContainText('$118.00 AUD');
  60  |     await line.locator('[data-testid="cart-line-decrease"]').click();
  61  |     await expect(line).toContainText('$59.00 AUD');
  62  |   });
  63  | 
  64  |   test('customer can remove the item', async ({ page }) => {
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
      |                ^ Error: page.fill: Test timeout of 60000ms exceeded.
```