# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-load.spec.js >> Store Load & Product Cards >> products are visible
- Location: src/gannonwaye-playwright-pack/tests/store-load.spec.js:13:3

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
  1  | // @ts-check
  2  |  
  3  | /* eslint-disable no-undef */
  4  | const { test, expect } = require('@playwright/test');
  5  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  6  | 
  7  | test.describe('Store Load & Product Cards', () => {
  8  |   test('/store loads', async ({ page }) => {
  9  |     await page.goto(`${BASE_URL}/store`);
  10 |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  11 |   });
  12 | 
  13 |   test('products are visible', async ({ page }) => {
  14 |     await page.goto(`${BASE_URL}/store`);
> 15 |     await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
     |                                                                        ^ Error: expect(locator).toBeVisible() failed
  16 |   });
  17 | 
  18 |   test('product images are visible', async ({ page }) => {
  19 |     await page.goto(`${BASE_URL}/store`);
  20 |     await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible({ timeout: 5000 });
  21 |   });
  22 | 
  23 |   test('product titles are visible', async ({ page }) => {
  24 |     await page.goto(`${BASE_URL}/store`);
  25 |     await expect(page.locator('[data-testid="product-title"]').first()).toBeVisible();
  26 |   });
  27 | 
  28 |   test('product prices are visible', async ({ page }) => {
  29 |     await page.goto(`${BASE_URL}/store`);
  30 |     await expect(page.locator('[data-testid="product-price"]').first()).toBeVisible();
  31 |   });
  32 | 
  33 |   test('add-to-cart button visible on each in-stock card', async ({ page }) => {
  34 |     await page.goto(`${BASE_URL}/store`);
  35 |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  36 |     const count = await addBtns.count();
  37 |     expect(count).toBeGreaterThan(0);
  38 |   });
  39 | 
  40 |   test('NO size buttons visible on main product grid', async ({ page }) => {
  41 |     await page.goto(`${BASE_URL}/store`);
  42 |     // Size buttons should NOT be visible directly on the grid (they live in the modal)
  43 |     // Check that no size-selector testid exists outside of a modal
  44 |     const sizeSelector = page.locator('[data-testid="size-selector"]');
  45 |     const count = await sizeSelector.count();
  46 |     expect(count).toBe(0);
  47 |   });
  48 | 
  49 |   test('add-to-cart button works and shows confirmation', async ({ page }) => {
  50 |     await page.goto(`${BASE_URL}/store`);
  51 |     // Find a non-apparel product (no size required) or select size first
  52 |     const cards = page.locator('[data-testid="product-card"]');
  53 |     const count = await cards.count();
  54 |     let clicked = false;
  55 |     for (let i = 0; i < count; i++) {
  56 |       const title = await cards.nth(i).locator('[data-testid="product-title"]').textContent().catch(() => '');
  57 |       if (!title.toLowerCase().includes('hoodie') && !title.toLowerCase().includes('tee')) {
  58 |         const btn = cards.nth(i).locator('[data-testid="add-to-cart-btn"]');
  59 |         if (await btn.isVisible().catch(() => false)) {
  60 |           await btn.click();
  61 |           clicked = true;
  62 |           break;
  63 |         }
  64 |       }
  65 |     }
  66 |     if (clicked) {
  67 |       await expect(page.locator('[data-testid="add-to-cart-success"]').first()).toBeVisible({ timeout: 3000 });
  68 |     }
  69 |   });
  70 | 
  71 |   test('apparel size must be selected before adding', async ({ page }) => {
  72 |     await page.goto(`${BASE_URL}/store`);
  73 |     const cards = page.locator('[data-testid="product-card"]');
  74 |     const count = await cards.count();
  75 |     for (let i = 0; i < count; i++) {
  76 |       const title = await cards.nth(i).locator('[data-testid="product-title"]').textContent().catch(() => '');
  77 |       if (title.toLowerCase().includes('hoodie') || title.toLowerCase().includes('tee')) {
  78 |         const btn = cards.nth(i).locator('[data-testid="add-to-cart-btn"]');
  79 |         if (await btn.isVisible().catch(() => false)) {
  80 |           await btn.click();
  81 |           await expect(page.locator('.text-destructive').first()).toBeVisible({ timeout: 3000 });
  82 |           break;
  83 |         }
  84 |       }
  85 |     }
  86 |   });
  87 | 
  88 |   test('cart button is visible with testid', async ({ page }) => {
  89 |     await page.goto(`${BASE_URL}/store`);
  90 |     await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  91 |   });
  92 | 
  93 |   test('no free shipping text on store page', async ({ page }) => {
  94 |     await page.goto(`${BASE_URL}/store`);
  95 |     const content = await page.content();
  96 |     expect(content.toLowerCase()).not.toContain('free shipping');
  97 |   });
  98 | });
```