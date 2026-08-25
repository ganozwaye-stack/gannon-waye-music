# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-routes.spec.js >> Public routes >> /tour redirects to home
- Location: src/gannonwaye-playwright-pack/tests/public-routes.spec.js:31:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:4173/"
Received: "http://localhost:4173/tour"
Timeout:  10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    18 × unexpected value "http://localhost:4173/tour"

```

```yaml
- link "Support Now":
  - /url: /back-this
  - button "Support Now"
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
  - paragraph: Gannon Waye
  - heading "Live" [level=1]
  - paragraph: Live
  - heading "Schedule" [level=2]
  - img
  - paragraph: No dates announced yet. The moment a show or release is added to my calendar, it appears here automatically.
  - link "TikTok @gann0nwaye":
    - /url: https://www.tiktok.com/@gann0nwaye
    - button "TikTok @gann0nwaye"
  - link "Instagram @gann0nwaye":
    - /url: https://www.instagram.com/gann0nwaye
    - button "Instagram @gann0nwaye"
  - paragraph: Want to see Gannon live? Support the project and help make more shows happen.
  - link "Be Part of This":
    - /url: /back-this
    - button "Be Part of This":
      - img
      - text: Be Part of This
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
  19 |     // /store is the boutique landing scene; the product grid lives at /store/all
  20 |     await page.goto(`${BASE_URL}/store/all`);
  21 |     await page.waitForLoadState('load');
  22 |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  23 |   });
  24 | 
  25 |   test('music page loads', async ({ page }) => {
  26 |     await page.goto(`${BASE_URL}/music`);
  27 |     await page.waitForLoadState('load');
  28 |     await expect(page.locator('body')).toBeVisible();
  29 |   });
  30 | 
  31 |   test('/tour redirects to home', async ({ page }) => {
  32 |     await page.goto(`${BASE_URL}/tour`);
  33 |     await page.waitForLoadState('load');
> 34 |     await expect(page).toHaveURL(`${BASE_URL}/`);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  35 |   });
  36 | 
  37 |   test('/bookings redirects to home', async ({ page }) => {
  38 |     await page.goto(`${BASE_URL}/bookings`);
  39 |     await page.waitForLoadState('load');
  40 |     await expect(page).toHaveURL(`${BASE_URL}/`);
  41 |   });
  42 | 
  43 |   test('navbar does not contain Tour or Bookings links', async ({ page }) => {
  44 |     await page.goto(`${BASE_URL}/`);
  45 |     await page.waitForLoadState('load');
  46 | 
  47 |     const navText = await page.locator('nav').first().textContent();
  48 |     expect(navText.toLowerCase()).not.toContain('tour');
  49 |     expect(navText.toLowerCase()).not.toContain('booking');
  50 |     expect(navText.toLowerCase()).not.toContain('live dates');
  51 |   });
  52 | 
  53 |   test('no broken console errors on home page', async ({ page }) => {
  54 |     const errors = [];
  55 |     page.on('pageerror', err => errors.push(err.message));
  56 | 
  57 |     await page.goto(`${BASE_URL}/`);
  58 |     await page.waitForLoadState('load');
  59 | 
  60 |     // Filter out known non-critical noise
  61 |     const critical = errors.filter(e =>
  62 |       !e.includes('ResizeObserver') &&
  63 |       !e.includes('Non-Error promise rejection') &&
  64 |       !e.includes('autoplay')
  65 |     );
  66 |     if (critical.length > 0) {
  67 |       console.error("CRITICAL CONSOLE ERRORS FOUND:", critical);
  68 |     }
  69 |     expect(critical.length).toBe(0);
  70 |   });
  71 | });
```