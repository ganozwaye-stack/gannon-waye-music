# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: storefront-world-lock.spec.js >> Permanent boutique world and verified store >> hoodie sizes and quantities come from the verified live record
- Location: src/gannonwaye-playwright-pack/tests/storefront-world-lock.spec.js:43:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="product-card"]').filter({ hasText: 'Respect Is Earned' }).first().getByRole('button', { name: 'S (3)', exact: true })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="product-card"]').filter({ hasText: 'Respect Is Earned' }).first().getByRole('button', { name: 'S (3)', exact: true })

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
    - text: The boutique is being prepared. No product will appear until it is owner approved and verified for sale.
  - paragraph: Available now
  - heading "Shop the collection" [level=1]
  - paragraph: Current owner-approved stock is available for delivery within Australia.
  - paragraph: Prices are in AUD. Delivery is shown before payment. Gannon Waye Music ABN 22 931 809 349. No GST is charged.
  - text: Music
  - img "\"Thank You\" CD Single Slim Case"
  - img
  - text: Slim Case
  - paragraph: "\"Thank You\" CD Single Slim Case"
  - paragraph: $10 AUD
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - img "Thank You — Deluxe Signed CD Single"
  - img
  - text: Deluxe · Signed
  - paragraph: Thank You — Deluxe Signed CD Single
  - paragraph: $20 AUD
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - text: Merch
  - img "Respect Is Earned Oversized Tee 1"
  - img "Respect Is Earned Oversized Tee 2"
  - button
  - button
  - img
  - text: In Stock
  - paragraph: Respect Is Earned Oversized Tee
  - paragraph: $59 AUD
  - button "XS"
  - button "S"
  - button "M"
  - button "L"
  - button "XL"
  - button "XXL"
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - img "\"Respect Is Earned\" Hoodie Dark Grey"
  - img
  - text: Available Now
  - paragraph: "\"Respect Is Earned\" Hoodie Dark Grey"
  - paragraph: $98 AUD
  - paragraph: Owner-counted stock in S, M, L and XL. Delivery is calculated before payment.
  - button "XS"
  - button "S"
  - button "M"
  - button "L"
  - button "XL"
  - button "2XL"
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
  - paragraph: $54 AUD
  - paragraph: Journal, pen and thermos flask set. Delivery is calculated before payment.
  - button "Add to Cart":
    - img
    - text: Add to Cart
  - img "\"Thank You\" Tote Bag 1"
  - img "\"Thank You\" Tote Bag 2"
  - img "\"Thank You\" Tote Bag 3"
  - button
  - button
  - button
  - img
  - text: Sold Out
  - paragraph: "\"Thank You\" Tote Bag"
  - paragraph: $15 AUD
  - text: Sold out due to popular demand. These will not be restocked.
  - paragraph: Independent music, merchandise, and community support.
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
- paragraph: 🛍️The Store shows only current owner-approved stock
- button "Dismiss":
  - img
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const LOCKED_IMAGE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cf2757c39_3d0e6cbc-87a7-4f9e-8d1c-05b82eb5b2e1.png';
  4  | const LOCKED_SHA256 = '9667a3698d14ec59d8b744d44a54692db5b24aefa09ed90e9344edd17eb83f98';
  5  | const HOODIE_ID = '69f11d1fc43e13c61fe6b9d7';
  6  | const JOURNAL_BUNDLE_ID = '69fbd261b760426cede1b7a3';
  7  | 
  8  | test.describe('Permanent boutique world and verified store', () => {
  9  |   test('the owner locked boutique world remains on the public store', async ({ page }) => {
  10 |     await page.goto('/store');
  11 | 
  12 |     const world = page.locator('[data-testid="locked-storefront-world"]');
  13 |     await expect(world).toBeVisible();
  14 |     await expect(world).toHaveAttribute('data-storefront-lock-id', 'gannon-waye-boutique-world-v1');
  15 | 
  16 |     const image = page.locator('[data-testid="locked-storefront-world-image"]');
  17 |     await expect(image).toBeVisible();
  18 |     await expect(image).toHaveAttribute('src', LOCKED_IMAGE);
  19 |     await expect(image).toHaveAttribute('data-storefront-image-sha256', LOCKED_SHA256);
  20 | 
  21 |     await expect(page.locator('[data-testid="locked-storefront-stage"]')).toBeVisible();
  22 |     await expect(page.locator('[data-testid="locked-storefront-stage-image"]')).toHaveAttribute('src', LOCKED_IMAGE);
  23 |   });
  24 | 
  25 |   test('only the two approved stage one products appear as sellable items', async ({ page }) => {
  26 |     await page.goto('/store');
  27 | 
  28 |     const worldCards = page.locator('[data-testid="world-product-card"]');
  29 |     await expect(worldCards).toHaveCount(2);
  30 | 
  31 |     const ids = await worldCards.evaluateAll(cards => cards.map(card => card.getAttribute('data-product-id')).sort());
  32 |     expect(ids).toEqual([HOODIE_ID, JOURNAL_BUNDLE_ID].sort());
  33 | 
  34 |     const productCards = page.locator('[data-testid="product-card"]');
  35 |     await expect(productCards).toHaveCount(2);
  36 | 
  37 |     const bodyText = await page.locator('body').innerText();
  38 |     expect(bodyText).not.toContain('Winter Writing & Comfort Bundle');
  39 |     expect(bodyText).not.toContain('Respect Is Earned Coffee Mug');
  40 |     expect(bodyText).not.toContain('Assorted Wall Poster');
  41 |   });
  42 | 
  43 |   test('hoodie sizes and quantities come from the verified live record', async ({ page }) => {
  44 |     await page.goto('/store');
  45 | 
  46 |     const hoodie = page.locator('[data-testid="product-card"]').filter({ hasText: 'Respect Is Earned' }).first();
  47 |     await expect(hoodie).toBeVisible();
> 48 |     await expect(hoodie.getByRole('button', { name: 'S (3)', exact: true })).toBeVisible();
     |                                                                              ^ Error: expect(locator).toBeVisible() failed
  49 |     await expect(hoodie.getByRole('button', { name: 'M (4)', exact: true })).toBeVisible();
  50 |     await expect(hoodie.getByRole('button', { name: 'L (5)', exact: true })).toBeVisible();
  51 |     await expect(hoodie.getByRole('button', { name: 'XL (2)', exact: true })).toBeVisible();
  52 |     await expect(hoodie.getByRole('button', { name: /2XL|3XL/ })).toHaveCount(0);
  53 |   });
  54 | 
  55 |   test('world product selection opens the database driven product modal', async ({ page }) => {
  56 |     await page.goto('/store');
  57 | 
  58 |     await page.locator(`[data-testid="world-product-card"][data-product-id="${JOURNAL_BUNDLE_ID}"]`).click();
  59 |     await expect(page.getByRole('heading', { name: 'Thank You Journal Pen and Thermos Flask Bundle' })).toBeVisible();
  60 |     await expect(page.getByText('$59 AUD', { exact: true })).toBeVisible();
  61 |     await expect(page.getByRole('button', { name: /Add to Cart/ })).toBeVisible();
  62 |   });
  63 | });
  64 | 
```