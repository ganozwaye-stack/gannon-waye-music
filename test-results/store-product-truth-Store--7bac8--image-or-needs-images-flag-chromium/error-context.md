# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-product-truth.spec.js >> Store Product Truth Audit >> Poster product has poster-specific image or needs-images flag
- Location: src/gannonwaye-playwright-pack/tests/store-product-truth.spec.js:65:7

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "RespectisEarnedThankyouDarkGreyHoodieFront"
Received string:        "https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png"
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
        - link "Supporters" [ref=e19] [cursor=pointer]:
          - /url: /back-this
        - link "Mum's Garden" [ref=e21] [cursor=pointer]:
          - /url: /mums-garden
        - link "Press" [ref=e23] [cursor=pointer]:
          - /url: /press
        - link "Contact" [ref=e25] [cursor=pointer]:
          - /url: /contact
        - button "More" [ref=e27] [cursor=pointer]:
          - text: More
          - img
      - generic [ref=e29]:
        - button [ref=e30] [cursor=pointer]:
          - img [ref=e31]
        - button "Open cart" [ref=e34] [cursor=pointer]:
          - img [ref=e35]
  - main [ref=e39]:
    - generic [ref=e41]:
      - generic [ref=e42]:
        - paragraph [ref=e43]: Official
        - heading "Merch" [level=1] [ref=e44]
        - paragraph [ref=e47]:
          - text: Store is
          - strong [ref=e48]: open
          - text: — order now. Shipping Australia-wide.
      - generic [ref=e50]:
        - generic [ref=e51]:
          - img "Hoodie" [ref=e52]
          - generic [ref=e53]:
            - img "Journal bundle" [ref=e54]
            - img "Thermos" [ref=e55]
        - generic [ref=e56]:
          - generic [ref=e57]:
            - generic [ref=e58]:
              - img [ref=e59]
              - text: Feature Bundle
            - generic [ref=e72]:
              - img [ref=e73]
              - text: No further discounts apply
          - generic [ref=e75]:
            - heading "Winter Writing & Comfort Bundle" [level=2] [ref=e76]:
              - text: Winter Writing &
              - text: Comfort Bundle
            - paragraph [ref=e77]: $129 AUD + postage
          - paragraph [ref=e78]: Built for cold nights, reflection, comfort, and the lyric that started a movement. Includes the hoodie, journal, pen, and thermos flask.
          - list [ref=e79]:
            - listitem [ref=e80]: Respect Is Earned Hoodie — Dark Grey
            - listitem [ref=e82]: Thankyou Journal
            - listitem [ref=e84]: Pen
            - listitem [ref=e86]: Thermos Flask
          - button "Add Winter Bundle to Cart" [ref=e89] [cursor=pointer]:
            - img [ref=e90]
            - text: Add Winter Bundle to Cart
          - paragraph [ref=e94]: Promo codes do not apply to this bundle. Price is as marked.
      - generic [ref=e97]: Music
      - generic [ref=e100]:
        - generic [ref=e101]:
          - generic [ref=e102] [cursor=pointer]:
            - img "\"Thank You\" CD Single Slim Case" [ref=e104]
            - img [ref=e106]
            - generic [ref=e109]: Slim Case
          - generic [ref=e110]:
            - paragraph [ref=e112]: "\"Thank You\" CD Single Slim Case"
            - paragraph [ref=e113]: $10 AUD
            - paragraph [ref=e114]: Sold out · Thank you for the love 🤍
            - button "Add to Cart" [ref=e115] [cursor=pointer]:
              - img [ref=e116]
              - text: Add to Cart
        - generic [ref=e117]:
          - generic [ref=e118] [cursor=pointer]:
            - img "Thank You — Deluxe Signed CD Single" [ref=e120]
            - img [ref=e122]
            - generic [ref=e125]: Deluxe · Signed
          - generic [ref=e126]:
            - paragraph [ref=e128]: Thank You — Deluxe Signed CD Single
            - paragraph [ref=e129]: $20 AUD
            - paragraph [ref=e130]: Sold out · Limited hand-signed edition
            - button "Add to Cart" [ref=e131] [cursor=pointer]:
              - img [ref=e132]
              - text: Add to Cart
      - generic [ref=e135]: Merch
      - generic [ref=e137]:
        - generic [ref=e138]:
          - generic [ref=e139] [cursor=pointer]:
            - generic [ref=e140]:
              - img "Respect Is Earned Oversized Tee 1" [ref=e141]
              - img "Respect Is Earned Oversized Tee 2" [ref=e142]
              - generic [ref=e143]:
                - button [ref=e144]
                - button [ref=e145]
            - img [ref=e147]
            - generic [ref=e150]: In Stock
          - generic [ref=e151]:
            - paragraph [ref=e153]: Respect Is Earned Oversized Tee
            - paragraph [ref=e154]: $59 AUD
            - paragraph [ref=e155]: Sold out · Oversized premium tee · $49
            - generic [ref=e157]:
              - button "XS" [ref=e158] [cursor=pointer]
              - button "S" [ref=e159] [cursor=pointer]
              - button "M" [ref=e160] [cursor=pointer]
              - button "L" [ref=e161] [cursor=pointer]
              - button "XL" [ref=e162] [cursor=pointer]
              - button "XXL" [ref=e163] [cursor=pointer]
            - button "Add to Cart" [ref=e164] [cursor=pointer]:
              - img [ref=e165]
              - text: Add to Cart
        - generic [ref=e166]:
          - generic [ref=e167] [cursor=pointer]:
            - img "\"Respect Is Earned\" Hoodie Dark Grey" [ref=e169]
            - img [ref=e171]
            - generic [ref=e174]: Available Now
          - generic [ref=e175]:
            - paragraph [ref=e177]: "\"Respect Is Earned\" Hoodie Dark Grey"
            - paragraph [ref=e178]: $98 AUD
            - paragraph [ref=e179]: ⚡ Get in fast, stock running out. New shipment on its way. $98
            - generic [ref=e181]:
              - button "XS" [ref=e182] [cursor=pointer]
              - button "S" [ref=e183] [cursor=pointer]
              - button "M" [ref=e184] [cursor=pointer]
              - button "L" [ref=e185] [cursor=pointer]
              - button "XL" [ref=e186] [cursor=pointer]
              - button "2XL" [ref=e187] [cursor=pointer]
            - button "Add to Cart" [ref=e188] [cursor=pointer]:
              - img [ref=e189]
              - text: Add to Cart
        - generic [ref=e190]:
          - generic [ref=e191] [cursor=pointer]:
            - generic [ref=e192]:
              - img "Thank You Journal Pen and Thermos Flask Bundle 1" [ref=e193]
              - img "Thank You Journal Pen and Thermos Flask Bundle 2" [ref=e194]
              - img "Thank You Journal Pen and Thermos Flask Bundle 3" [ref=e195]
              - generic [ref=e196]:
                - button [ref=e197]
                - button [ref=e198]
                - button [ref=e199]
            - img [ref=e201]
            - generic [ref=e204]: In Stock
          - generic [ref=e205]:
            - paragraph [ref=e207]: Thank You Journal Pen and Thermos Flask Bundle
            - paragraph [ref=e208]: $54 AUD
            - paragraph [ref=e209]: ❄️ Also available in the Winter Writing & Comfort Bundle, $129 with hoodie, pen & thermo. Journal features "Respect Is Earned, Not A Game You Make Me Play" lyric.
            - button "Add to Cart" [ref=e210] [cursor=pointer]:
              - img [ref=e211]
              - text: Add to Cart
        - generic [ref=e212]:
          - generic [ref=e213] [cursor=pointer]:
            - generic [ref=e214]:
              - img "\"Thank You\" Tote Bag 1" [ref=e215]
              - img "\"Thank You\" Tote Bag 2" [ref=e216]
              - img "\"Thank You\" Tote Bag 3" [ref=e217]
              - generic [ref=e218]:
                - button [ref=e219]
                - button [ref=e220]
                - button [ref=e221]
            - img [ref=e223]
            - generic [ref=e226]: Sold Out
          - generic [ref=e227]:
            - paragraph [ref=e229]: "\"Thank You\" Tote Bag"
            - paragraph [ref=e230]: $15 AUD
            - paragraph [ref=e231]: Sold out due to popular demand. These will not be restocked. 🤍
            - generic [ref=e232]: Sold out due to popular demand. These will not be restocked.
      - generic [ref=e233]:
        - paragraph [ref=e234]: Not your style? You can still support this.
        - button "Support Now" [ref=e235] [cursor=pointer]:
          - img [ref=e236]
          - text: Support Now
      - paragraph [ref=e238]: Independent music, merchandise, and community support.
  - contentinfo [ref=e239]:
    - generic [ref=e240]:
      - generic [ref=e241]:
        - generic [ref=e242]:
          - generic [ref=e244]: GW
          - paragraph [ref=e245]: Australian singer-songwriter crafting honest stories through melody and verse.
        - generic [ref=e246]:
          - heading "Navigate" [level=4] [ref=e247]
          - generic [ref=e248]:
            - link "Home" [ref=e249] [cursor=pointer]:
              - /url: /
            - link "Music" [ref=e250] [cursor=pointer]:
              - /url: /music
            - link "Lyrics" [ref=e251] [cursor=pointer]:
              - /url: /lyrics
            - link "Store" [ref=e252] [cursor=pointer]:
              - /url: /store
            - link "Press" [ref=e253] [cursor=pointer]:
              - /url: /press
            - link "Subscribe 🤍" [ref=e254] [cursor=pointer]:
              - /url: /back-this
            - link "Community" [ref=e255] [cursor=pointer]:
              - /url: /community
            - link "Biography" [ref=e256] [cursor=pointer]:
              - /url: /biography
            - link "Lyric Library" [ref=e257] [cursor=pointer]:
              - /url: /lyric-library
            - link "Mixing Services" [ref=e258] [cursor=pointer]:
              - /url: /mixing-services
            - link "Gift Cards" [ref=e259] [cursor=pointer]:
              - /url: /gift-cards
            - link "Mum Tribute" [ref=e260] [cursor=pointer]:
              - /url: /remember-mum
            - link "Systems Manager" [ref=e261] [cursor=pointer]:
              - /url: /systems-manager
            - link "Contact" [ref=e262] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e263]:
          - heading "Contact" [level=4] [ref=e264]
          - paragraph [ref=e265]: For press, management & enquiries
          - link "gannonwayemusic@gmail.com" [ref=e266] [cursor=pointer]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e267]
          - generic [ref=e268]:
            - link "Privacy Policy" [ref=e269] [cursor=pointer]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e270] [cursor=pointer]:
              - /url: /terms-of-service
            - link "Contact Gannon" [ref=e271] [cursor=pointer]:
              - /url: /contact
          - heading "Social" [level=4] [ref=e272]
          - generic [ref=e273]:
            - link "Instagram @gann0nwaye" [ref=e274] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e275] [cursor=pointer]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e276] [cursor=pointer]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e277]:
        - paragraph [ref=e278]: Stay in the loop
        - heading "New music & community updates" [level=3] [ref=e279]
        - generic [ref=e280]:
          - textbox "Your name *" [ref=e281]
          - textbox "your@email.com *" [ref=e282]
          - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e283]
          - textbox "Birthday (optional — we'll send you something special)" [ref=e284]
          - paragraph [ref=e285]: Birthday optional — we'll send you something special 🎂
          - combobox [ref=e286]:
            - option "How did you find me? *" [selected]
            - option "Google"
            - option "Instagram"
            - option "Facebook"
            - option "TikTok"
            - option "X (Twitter)"
            - option "Friend / Word of Mouth"
            - option "I know Gannon"
            - option "Other"
          - button "Subscribe" [ref=e287] [cursor=pointer]
      - paragraph [ref=e289]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
      - generic [ref=e290]:
        - generic [ref=e291]:
          - img "GW Heart" [ref=e292]
          - link "Support the project 🤍" [ref=e293] [cursor=pointer]:
            - /url: /back-this
          - img "GW Heart" [ref=e294]
        - paragraph [ref=e295]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e296]:
    - img [ref=e297]
    - paragraph [ref=e299]: 🎵Music approved for public sharing appears on the Music page
    - button "Dismiss" [ref=e300] [cursor=pointer]:
      - img [ref=e301]
```

# Test source

```ts
  1  | // Store Product Truth Audit
  2  | // Verifies prices, stock status, discount exclusions, and poster imagery requirements.
  3  | import { test, expect } from '@playwright/test';
  4  | 
  5  | test.describe('Store Product Truth Audit', () => {
  6  | 
  7  |   test('Store loads at /store/all', async ({ page }) => {
  8  |     await page.goto('/store/all');
  9  |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible({ timeout: 10000 });
  10 |   });
  11 | 
  12 |   test('Journal bundle shows $59', async ({ page }) => {
  13 |     await page.goto('/store/all');
  14 |     const prices = page.locator('[data-testid="product-price"]');
  15 |     await expect(prices).not.toHaveCount(0);
  16 |     const texts = await prices.allTextContents();
  17 |     expect(texts.some(t => t.includes('59'))).toBeTruthy();
  18 |   });
  19 | 
  20 |   test('Winter bundle shows $129', async ({ page }) => {
  21 |     await page.goto('/store/all');
  22 |     // Winter bundle is rendered by WinterBundleHero — check the hero section
  23 |     const hero = page.locator('[data-testid="winter-bundle-hero"]');
  24 |     await expect(hero).toBeVisible({ timeout: 8000 });
  25 |     await expect(hero).toContainText('129');
  26 |   });
  27 | 
  28 |   test('Winter bundle displays no further discounts apply messaging', async ({ page }) => {
  29 |     await page.goto('/store/all');
  30 |     const hero = page.locator('[data-testid="winter-bundle-hero"]');
  31 |     await expect(hero).toBeVisible({ timeout: 8000 });
  32 |     const text = await hero.textContent();
  33 |     expect(
  34 |       text.toLowerCase().includes('no further discount') ||
  35 |       text.toLowerCase().includes('discount') ||
  36 |       text.toLowerCase().includes('excluded')
  37 |     ).toBeTruthy();
  38 |   });
  39 | 
  40 |   test('Hoodie shows $89 and available', async ({ page }) => {
  41 |     await page.goto('/store/all');
  42 |     const prices = page.locator('[data-testid="product-price"]');
  43 |     const texts = await prices.allTextContents();
  44 |     expect(texts.some(t => t.includes('89'))).toBeTruthy();
  45 |   });
  46 | 
  47 |   test('Mug shows $9.90', async ({ page }) => {
  48 |     await page.goto('/store/all');
  49 |     const prices = page.locator('[data-testid="product-price"]');
  50 |     const texts = await prices.allTextContents();
  51 |     expect(texts.some(t => t.includes('9') && t.includes('90') || t.includes('9.90'))).toBeTruthy();
  52 |   });
  53 | 
  54 |   test('Tote bag shows sold out and will not be restocked', async ({ page }) => {
  55 |     await page.goto('/store/all');
  56 |     const page_text = await page.textContent('body');
  57 |     expect(page_text.toLowerCase()).toContain('tote');
  58 |     // Check sold out + will not be restocked messaging
  59 |     expect(
  60 |       page_text.toLowerCase().includes('not be restocked') ||
  61 |       page_text.toLowerCase().includes('sold out due to popular demand')
  62 |     ).toBeTruthy();
  63 |   });
  64 | 
  65 |   test('Poster product has poster-specific image or needs-images flag', async ({ page }) => {
  66 |     await page.goto('/store/all');
  67 |     const allImages = await page.locator('[data-testid="product-image"]').all();
  68 |     for (const img of allImages) {
  69 |       const src = await img.getAttribute('src');
  70 |       if (src) {
  71 |         // Poster must not use hoodie image
> 72 |         expect(src).not.toContain('RespectisEarnedThankyouDarkGreyHoodieFront');
     |                         ^ Error: expect(received).not.toContain(expected) // indexOf
  73 |       }
  74 |     }
  75 |   });
  76 | 
  77 |   test('Poster size pricing exists in detail page', async ({ page }) => {
  78 |     await page.goto('/store/product/respect-is-earned-wall-poster');
  79 |     await expect(page.locator('body')).toContainText('A4');
  80 |     await expect(page.locator('body')).toContainText('A3');
  81 |     await expect(page.locator('body')).toContainText('A1');
  82 |   });
  83 | 
  84 |   test('Add to cart button present for in-stock products', async ({ page }) => {
  85 |     await page.goto('/store/all');
  86 |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  87 |     await expect(addBtns).not.toHaveCount(0);
  88 |   });
  89 | 
  90 | });
```