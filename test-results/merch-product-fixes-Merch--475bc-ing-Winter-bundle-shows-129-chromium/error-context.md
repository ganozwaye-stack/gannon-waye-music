# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: merch-product-fixes.spec.js >> Merch store — product pricing >> Winter bundle shows $129
- Location: src/gannonwaye-playwright-pack/tests/merch-product-fixes.spec.js:26:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="winter-bundle-hero"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="winter-bundle-hero"]')

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
- paragraph: 🖤10% of all proceeds support 1800RESPECT
- button "Dismiss":
  - img
```

# Test source

```ts
  1  | // @ts-check
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | test.describe('Merch store — product pricing', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/store');
  7  |     await page.waitForLoadState('networkidle');
  8  |   });
  9  | 
  10 |   test('Journal bundle shows $59', async ({ page }) => {
  11 |     const cards = page.locator('[data-testid="product-card"]');
  12 |     let found = false;
  13 |     const count = await cards.count();
  14 |     for (let i = 0; i < count; i++) {
  15 |       const card = cards.nth(i);
  16 |       const title = await card.locator('[data-testid="product-title"]').textContent();
  17 |       if (title && title.toLowerCase().includes('journal')) {
  18 |         const price = await card.locator('[data-testid="product-price"]').textContent();
  19 |         expect(price).toContain('59');
  20 |         found = true;
  21 |       }
  22 |     }
  23 |     expect(found).toBe(true);
  24 |   });
  25 | 
  26 |   test('Winter bundle shows $129', async ({ page }) => {
  27 |     const winterSection = page.locator('[data-testid="winter-bundle-hero"]');
> 28 |     await expect(winterSection).toBeVisible();
     |                                 ^ Error: expect(locator).toBeVisible() failed
  29 |     await expect(winterSection).toContainText('129');
  30 |   });
  31 | 
  32 |   test('Winter bundle shows no-discount badge', async ({ page }) => {
  33 |     const winterSection = page.locator('[data-testid="winter-bundle-hero"]');
  34 |     await expect(winterSection).toContainText(/no further discounts/i);
  35 |   });
  36 | 
  37 |   test('Winter bundle add to cart button is visible', async ({ page }) => {
  38 |     const btn = page.locator('[data-testid="winter-bundle-add-to-cart"]');
  39 |     await expect(btn).toBeVisible();
  40 |   });
  41 | 
  42 |   test('Poster product does not show hoodie image exclusively', async ({ page }) => {
  43 |     const cards = page.locator('[data-testid="product-card"]');
  44 |     const count = await cards.count();
  45 |     for (let i = 0; i < count; i++) {
  46 |       const card = cards.nth(i);
  47 |       const title = await card.locator('[data-testid="product-title"]').textContent();
  48 |       if (title && title.toLowerCase().includes('poster')) {
  49 |         const img = card.locator('img').first();
  50 |         const src = await img.getAttribute('src');
  51 |         // Hoodie image should not be the poster image
  52 |         expect(src).not.toContain('RespectisEarnedThankyouDarkGreyHoodieFront');
  53 |       }
  54 |     }
  55 |   });
  56 | });
  57 | 
  58 | test.describe('Winter bundle — promo code rejection', () => {
  59 |   test('winter bundle item in cart rejects promo codes', async ({ page }) => {
  60 |     await page.goto('/store');
  61 |     await page.waitForLoadState('networkidle');
  62 |     const addBtn = page.locator('[data-testid="winter-bundle-add-to-cart"]');
  63 |     if (await addBtn.isVisible()) {
  64 |       await addBtn.click();
  65 |       await page.goto('/store/cart-details');
  66 |       await page.waitForLoadState('networkidle');
  67 |       // Try applying a promo code
  68 |       const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="code"]').first();
  69 |       if (await promoInput.count() > 0) {
  70 |         await promoInput.fill('TEST10');
  71 |         const applyBtn = page.locator('button:has-text("Apply")').first();
  72 |         if (await applyBtn.count() > 0) {
  73 |           await applyBtn.click();
  74 |           // Should show rejection or no discount applied to bundle
  75 |           await expect(page.locator('body')).toContainText(/no further|excluded|not eligible|bundle/i);
  76 |         }
  77 |       }
  78 |     }
  79 |   });
  80 | });
```