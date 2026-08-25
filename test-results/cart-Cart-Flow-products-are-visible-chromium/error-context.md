# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cart.spec.js >> Cart Flow >> products are visible
- Location: src/gannonwaye-playwright-pack/tests/cart.spec.js:14:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="product-card"]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="product-card"]').first()

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
  - link "Supporters":
    - /url: /back-this
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
  - img "Gannon Waye Boutique — official merch store"
  - paragraph: Boutique · Step Inside
  - heading "Gannon Waye" [level=1]
  - paragraph: Official Merch Store
  - link "All Products":
    - /url: /store/all
    - img
    - text: All Products
  - link "Listen":
    - /url: /music
    - img
    - text: Listen
  - link "Cart":
    - /url: /store/cart
    - img
    - text: Cart
  - paragraph: Gannon Waye
  - paragraph: Boutique · Step Inside
  - button "Respect Is Earned Hoodie Hoodie Respect Is Earned Hoodie $98":
    - img "Respect Is Earned Hoodie"
    - text: Hoodie Respect Is Earned Hoodie $98
  - button "Respect Is Earned Hoodie — Back Coming Soon Hoodie Back View Coming Soon":
    - img "Respect Is Earned Hoodie — Back"
    - text: Coming Soon Hoodie Back View Coming Soon
  - button "Winter Writing & Comfort Bundle Featured Bundle Winter Bundle $119":
    - img "Winter Writing & Comfort Bundle"
    - text: Featured Bundle Winter Bundle $119
  - button "Thankyou Journal, Pen & Thermos Flask Bundle Bundle Journal Bundle $59":
    - img "Thankyou Journal, Pen & Thermos Flask Bundle"
    - text: Bundle Journal Bundle $59
  - button "Thankyou \"Respect Is Earned\" Coffee Mug Mug Coffee Mug $9.90":
    - img "Thankyou \"Respect Is Earned\" Coffee Mug"
    - text: Mug Coffee Mug $9.90
  - button "Thankyou \"Respect Is Earned\" Wall Poster Poster Wall Poster From $19":
    - img "Thankyou \"Respect Is Earned\" Wall Poster"
    - text: Poster Wall Poster From $19
  - button "Thankyou CD Sold Out Thankyou CD Sold Out":
    - img "Thankyou CD"
    - text: Sold Out Thankyou CD Sold Out
  - button "Thankyou Tote Bag Sold Out Tote Bag $15":
    - img "Thankyou Tote Bag"
    - text: Sold Out Tote Bag $15
  - button "Mum's Garden Private Mum's Garden Tribute":
    - img "Mum's Garden"
    - text: Private Mum's Garden Tribute
  - paragraph: Hover or tap zones to explore · Click to quick-view & shop
  - paragraph: Most Popular
  - heading "Featured Gear" [level=2]
  - button "Respect Is Earned Hoodie ‹ › ★ Best Seller Respect Is Earned Hoodie Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye si… $98 SHOP NOW →":
    - img "Respect Is Earned Hoodie"
    - button "‹"
    - button "›"
    - button
    - button
    - button
    - button
    - button
    - text: ★ Best Seller Respect Is Earned Hoodie
    - paragraph: Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye si…
    - text: $98 SHOP NOW →
  - button "Winter Writing & Comfort Bundle ‹ › Featured Bundle Winter Bundle $119 SHOP NOW →":
    - img "Winter Writing & Comfort Bundle"
    - button "‹"
    - button "›"
    - button
    - button
    - button
    - button
    - button
    - button
    - text: Featured Bundle Winter Bundle $119 SHOP NOW →
  - button "Thankyou Journal, Pen & Thermos Flask Bundle ‹ › Bundle Journal Bundle $59 SHOP NOW →":
    - img "Thankyou Journal, Pen & Thermos Flask Bundle"
    - button "‹"
    - button "›"
    - button
    - button
    - button
    - button
    - text: Bundle Journal Bundle $59 SHOP NOW →
  - heading "Gannon Waye Merch Store — Full Collection" [level=2]
  - button "Respect Is Earned Hoodie Hoodie Respect Is Earned Hoodie $98 View →":
    - img "Respect Is Earned Hoodie"
    - text: Hoodie
    - paragraph: Respect Is Earned Hoodie
    - text: $98 View →
  - button "Respect Is Earned Hoodie — Back Coming Soon Hoodie Back View Coming Soon View →":
    - img "Respect Is Earned Hoodie — Back"
    - text: Coming Soon
    - paragraph: Hoodie Back View
    - text: Coming Soon View →
  - button "Winter Writing & Comfort Bundle Featured Bundle Winter Bundle $119 View →":
    - img "Winter Writing & Comfort Bundle"
    - text: Featured Bundle
    - paragraph: Winter Bundle
    - text: $119 View →
  - button "Thankyou Journal, Pen & Thermos Flask Bundle Bundle Journal Bundle $59 View →":
    - img "Thankyou Journal, Pen & Thermos Flask Bundle"
    - text: Bundle
    - paragraph: Journal Bundle
    - text: $59 View →
  - button "Thankyou \"Respect Is Earned\" Coffee Mug Mug Coffee Mug $9.90 View →":
    - img "Thankyou \"Respect Is Earned\" Coffee Mug"
    - text: Mug
    - paragraph: Coffee Mug
    - text: $9.90 View →
  - button "Thankyou \"Respect Is Earned\" Wall Poster Poster Wall Poster From $19 View →":
    - img "Thankyou \"Respect Is Earned\" Wall Poster"
    - text: Poster
    - paragraph: Wall Poster
    - text: From $19 View →
  - button "Thankyou CD Sold Out Thankyou CD Sold Out Waitlist →":
    - img "Thankyou CD"
    - text: Sold Out
    - paragraph: Thankyou CD
    - text: Sold Out Waitlist →
  - button "Thankyou Tote Bag Sold Out Tote Bag $15 Waitlist →":
    - img "Thankyou Tote Bag"
    - text: Sold Out
    - paragraph: Tote Bag
    - text: $15 Waitlist →
  - button "Mum's Garden Private Mum's Garden Tribute Visit →":
    - img "Mum's Garden"
    - text: Private
    - paragraph: Mum's Garden
    - text: Tribute Visit →
  - paragraph: The Collection
  - heading "Merch Gallery" [level=2]
  - paragraph: Every piece carries a meaning. Hover to explore the details.
  - img "Respect Is Earned Hoodie"
  - text: Hoodie
  - heading "Respect Is Earned Hoodie" [level=3]
  - paragraph: Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye signature de…
  - text: $98 View →
  - img "Respect Is Earned Hoodie — Back"
  - text: Coming Soon
  - heading "Hoodie Back View" [level=3]
  - paragraph: Without You Here — Memorial Merchandise. Coming soon.…
  - text: Coming Soon View →
  - img "Winter Writing & Comfort Bundle"
  - text: Featured Bundle
  - heading "Winter Bundle" [level=3]
  - paragraph: The hero bundle of the Thankyou Merch Store. Includes the oversized Respect Is Earned hoodie plus th…
  - text: $119 View →
  - img "Thankyou Journal, Pen & Thermos Flask Bundle"
  - text: Bundle
  - heading "Journal Bundle" [level=3]
  - paragraph: A premium Thankyou writing set featuring the Respect Is Earned journal, matching pen and thermos fla…
  - text: $59 View →
  - img "Thankyou \"Respect Is Earned\" Coffee Mug"
  - text: Mug
  - heading "Coffee Mug" [level=3]
  - paragraph: Ceramic Thankyou coffee mug featuring the Respect Is Earned lyric artwork. A simple daily reminder f…
  - text: $9.90 View →
  - img "Thankyou \"Respect Is Earned\" Wall Poster"
  - text: Poster
  - heading "Wall Poster" [level=3]
  - paragraph: Premium Thankyou lyric wall poster. Multiple sizes available — A4 $19 · A3 $29 · A2 $39 · A1 $59.…
  - text: From $19 View →
  - button "View Full Product Grid & Checkout →"
- contentinfo:
  - text: GW
  - paragraph: Australian singer-songwriter crafting honest stories through melody and verse.
  - heading "Navigate" [level=4]
  - link "Home":
    - /url: /
  - link "Music":
    - /url: /music
  - link "Lyrics":
    - /url: /lyrics
  - link "Store":
    - /url: /store
  - link "Press":
    - /url: /press
  - link "Subscribe 🤍":
    - /url: /back-this
  - link "Community":
    - /url: /community
  - link "Biography":
    - /url: /biography
  - link "Lyric Library":
    - /url: /lyric-library
  - link "Mixing Services":
    - /url: /mixing-services
  - link "Gift Cards":
    - /url: /gift-cards
  - link "Mum Tribute":
    - /url: /remember-mum
  - link "Systems Manager":
    - /url: /systems-manager
  - link "Contact":
    - /url: /contact
  - heading "Contact" [level=4]
  - paragraph: For press, management & enquiries
  - link "gannonwayemusic@gmail.com":
    - /url: mailto:gannonwayemusic@gmail.com
  - heading "Legal" [level=4]
  - link "Privacy Policy":
    - /url: /privacy-policy
  - link "Terms of Service":
    - /url: /terms-of-service
  - link "Contact Gannon":
    - /url: /contact
  - heading "Social" [level=4]
  - link "Instagram @gann0nwaye":
    - /url: https://www.instagram.com/gann0nwaye
  - link "TikTok @gann0nwaye":
    - /url: https://www.tiktok.com/@gann0nwaye
  - link "YouTube @gannonwayeofficial":
    - /url: https://www.youtube.com/@gannonwayeofficial
  - paragraph: Stay in the loop
  - heading "New music & community updates" [level=3]
  - textbox "Your name *"
  - textbox "your@email.com *"
  - textbox "Phone incl. country code e.g. +61 400 000 000 *"
  - textbox "Birthday (optional — we'll send you something special)"
  - paragraph: Birthday optional — we'll send you something special 🎂
  - combobox:
    - option "How did you find me? *" [selected]
    - option "Google"
    - option "Instagram"
    - option "Facebook"
    - option "TikTok"
    - option "X (Twitter)"
    - option "Friend / Word of Mouth"
    - option "I know Gannon"
    - option "Other"
  - button "Subscribe"
  - paragraph: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
  - img "GW Heart"
  - link "Support the project 🤍":
    - /url: /back-this
  - img "GW Heart"
  - paragraph: © 2026 Gannon Waye. All rights reserved.
- img
- paragraph: ✨Join the inner circle — be part of something real
- button "Dismiss":
  - img
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
  8   | test.describe('Cart Flow', () => {
  9   |   test('/store loads', async ({ page }) => {
  10  |     await page.goto(`${BASE_URL}/store`);
  11  |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  12  |   });
  13  | 
  14  |   test('products are visible', async ({ page }) => {
  15  |     await page.goto(`${BASE_URL}/store`);
> 16  |     await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
      |                                                                        ^ Error: expect(locator).toBeVisible() failed
  17  |   });
  18  | 
  19  |   test('product images are visible', async ({ page }) => {
  20  |     await page.goto(`${BASE_URL}/store`);
  21  |     await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible();
  22  |   });
  23  | 
  24  |   test('cart button is visible with data-testid', async ({ page }) => {
  25  |     await page.goto(`${BASE_URL}/store`);
  26  |     await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  27  |   });
  28  | 
  29  |   test('add to cart shows confirmation', async ({ page }) => {
  30  |     await page.goto(`${BASE_URL}/store`);
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
  48  |     await page.goto(`${BASE_URL}/store`);
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
  61  |     await page.goto(`${BASE_URL}/store`);
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
  74  |     await page.goto(`${BASE_URL}/store`);
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
  89  |     await page.goto(`${BASE_URL}/store`);
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
  102 |     await page.goto(`${BASE_URL}/store`);
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
  115 |     await page.goto(`${BASE_URL}/store`);
  116 |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
```