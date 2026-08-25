# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-routes.spec.js >> Public routes >> store page loads
- Location: src/gannonwaye-playwright-pack/tests/public-routes.spec.js:18:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="store-page"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="store-page"]')

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
  1  | // tests/public-routes.spec.js
  2  | // Verifies public routes load correctly and bookings/tours are hidden
  3  | 
  4  | /* eslint-disable no-undef */
  5  | import { test, expect } from '@playwright/test';
  6  | 
  7  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  8  | 
  9  | test.describe('Public routes', () => {
  10 |   test('home page loads', async ({ page }) => {
  11 |     await page.goto(`${BASE_URL}/`);
  12 |     await page.waitForLoadState('load');
  13 |     expect(page.url()).toContain(BASE_URL);
  14 |     // No crash, page renders
  15 |     await expect(page.locator('body')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('store page loads', async ({ page }) => {
  19 |     await page.goto(`${BASE_URL}/store`);
  20 |     await page.waitForLoadState('load');
> 21 |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
     |                                                              ^ Error: expect(locator).toBeVisible() failed
  22 |   });
  23 | 
  24 |   test('music page loads', async ({ page }) => {
  25 |     await page.goto(`${BASE_URL}/music`);
  26 |     await page.waitForLoadState('load');
  27 |     await expect(page.locator('body')).toBeVisible();
  28 |   });
  29 | 
  30 |   test('/tour redirects to home', async ({ page }) => {
  31 |     await page.goto(`${BASE_URL}/tour`);
  32 |     await page.waitForLoadState('load');
  33 |     await expect(page).toHaveURL(`${BASE_URL}/`);
  34 |   });
  35 | 
  36 |   test('/bookings redirects to home', async ({ page }) => {
  37 |     await page.goto(`${BASE_URL}/bookings`);
  38 |     await page.waitForLoadState('load');
  39 |     await expect(page).toHaveURL(`${BASE_URL}/`);
  40 |   });
  41 | 
  42 |   test('navbar does not contain Tour or Bookings links', async ({ page }) => {
  43 |     await page.goto(`${BASE_URL}/`);
  44 |     await page.waitForLoadState('load');
  45 | 
  46 |     const navText = await page.locator('nav').first().textContent();
  47 |     expect(navText.toLowerCase()).not.toContain('tour');
  48 |     expect(navText.toLowerCase()).not.toContain('booking');
  49 |     expect(navText.toLowerCase()).not.toContain('live dates');
  50 |   });
  51 | 
  52 |   test('no broken console errors on home page', async ({ page }) => {
  53 |     const errors = [];
  54 |     page.on('pageerror', err => errors.push(err.message));
  55 | 
  56 |     await page.goto(`${BASE_URL}/`);
  57 |     await page.waitForLoadState('load');
  58 | 
  59 |     // Filter out known non-critical noise
  60 |     const critical = errors.filter(e =>
  61 |       !e.includes('ResizeObserver') &&
  62 |       !e.includes('Non-Error promise rejection') &&
  63 |       !e.includes('autoplay')
  64 |     );
  65 |     if (critical.length > 0) {
  66 |       console.error("CRITICAL CONSOLE ERRORS FOUND:", critical);
  67 |     }
  68 |     expect(critical.length).toBe(0);
  69 |   });
  70 | });
```