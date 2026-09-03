# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.js >> Cart Flow >> add to cart shows confirmation
- Location: src/gannonwaye-playwright-pack/tests/cart.spec.js:29:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="add-to-cart-success"]').first()
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 3000ms
  - waiting for locator('[data-testid="add-to-cart-success"]').first()

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
- main:
  - region "Permanent Gannon Waye boutique world":
    - img "Gannon Waye Boutique, official merchandise store"
    - paragraph: Boutique · Step Inside
    - heading "Gannon Waye" [level=1]
    - paragraph: Merch Store
  - region "Gannon Waye boutique world":
    - img "Gannon Waye boutique interior"
    - paragraph: Step inside the boutique
    - heading "The owner approved collection" [level=2]
    - paragraph: The boutique world is permanent. Prices, stock and purchasing come only from verified live records.
    - button "\"Respect Is Earned\" Hoodie — Dark Grey Available \"Respect Is Earned\" Hoodie — Dark Grey $98.00 AUD 14 in stock":
      - img "\"Respect Is Earned\" Hoodie — Dark Grey"
      - text: Available "Respect Is Earned" Hoodie — Dark Grey $98.00 AUD 14 in stock
    - button "Thank You Journal Pen and Thermos Flask Bundle Available Thank You Journal Pen and Thermos Flask Bundle $59.00 AUD 19 in stock":
      - img "Thank You Journal Pen and Thermos Flask Bundle"
      - text: Available Thank You Journal Pen and Thermos Flask Bundle $59.00 AUD 19 in stock
  - paragraph: Available now
  - heading "Shop the collection" [level=1]
  - paragraph: Current owner-approved stock is available for delivery within Australia.
  - paragraph: Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
  - text: Merch
  - img "\"Respect Is Earned\" Hoodie — Dark Grey 1"
  - img "\"Respect Is Earned\" Hoodie — Dark Grey 2"
  - button
  - button
  - img
  - text: Available Now
  - paragraph: "\"Respect Is Earned\" Hoodie — Dark Grey"
  - paragraph: $98 AUD
  - paragraph: Owner-counted stock in S, M, L and XL. Delivery is calculated before payment.
  - button "S (3)"
  - button "M (4)"
  - button "L (5)"
  - button "XL (2)"
  - paragraph: Please select a size
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - img "Thank You Journal Pen and Thermos Flask Bundle 1"
  - img "Thank You Journal Pen and Thermos Flask Bundle 2"
  - img "Thank You Journal Pen and Thermos Flask Bundle 3"
  - button
  - button
  - button
  - img
  - text: In Stock
  - paragraph: Thank You Journal Pen and Thermos Flask Bundle
  - paragraph: $59 AUD
  - paragraph: Journal, pen and thermos flask set. Delivery is calculated before payment.
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - paragraph: Independent music, merchandise, and community support.
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
- text: Please select a size
- button:
  - img
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
  8   | test.describe('Cart Flow', () => {
  9   |   test('/store loads', async ({ page }) => {
  10  |     await page.goto(`${BASE_URL}/store/all`);
  11  |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  12  |   });
  13  | 
  14  |   test('products are visible', async ({ page }) => {
  15  |     await page.goto(`${BASE_URL}/store/all`);
  16  |     await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  17  |   });
  18  | 
  19  |   test('product images are visible', async ({ page }) => {
  20  |     await page.goto(`${BASE_URL}/store/all`);
  21  |     await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible();
  22  |   });
  23  | 
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
> 44  |     await expect(page.locator('[data-testid="add-to-cart-success"]').first()).toBeVisible({ timeout: 3000 });
      |                                                                               ^ Error: expect(locator).toBeVisible() failed
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
  124 |     await checkoutBtn.click();
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