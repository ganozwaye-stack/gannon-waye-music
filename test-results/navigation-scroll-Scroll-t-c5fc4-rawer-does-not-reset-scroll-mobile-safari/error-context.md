# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation-scroll.spec.js >> Scroll-to-top on route change >> opening cart drawer does not reset scroll
- Location: src/gannonwaye-playwright-pack/tests/navigation-scroll.spec.js:71:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="cart-button"]')
    - locator resolved to <button type="button" aria-label="Open cart" data-testid="cart-button" data-dynamic-content="true" data-source-location="src/components/public/Navbar.jsx:151:10" class="relative flex items-center justify-center w-9 h-9 rounded-full border border-border/40 hover:border-primary/40 text-muted-foreground hover:text-primary transition-all">…</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - generic [ref=e5]:
      - link "Gannon Waye · Home" [ref=e6]:
        - /url: /
        - generic [ref=e8]: GW
      - generic [ref=e9]:
        - button [ref=e10] [cursor=pointer]:
          - img [ref=e11]
        - button "Open cart" [ref=e14] [cursor=pointer]:
          - img [ref=e15]
        - button [ref=e19] [cursor=pointer]:
          - img [ref=e20]
  - main [ref=e21]:
    - generic [ref=e22]:
      - generic [ref=e23]:
        - img "Gannon Waye Boutique — official merch store" [ref=e24]
        - generic [ref=e26]:
          - paragraph [ref=e27]: Boutique · Step Inside
          - heading "Gannon Waye" [level=1] [ref=e28]
          - paragraph [ref=e29]: Official Merch Store
      - generic [ref=e30]:
        - generic [ref=e31]:
          - link "All Products" [ref=e32]:
            - /url: /store/all
            - img [ref=e33]
            - text: All Products
          - link "Listen" [ref=e35]:
            - /url: /music
            - img [ref=e36]
            - text: Listen
          - link "Cart" [ref=e40]:
            - /url: /store/cart
            - img [ref=e41]
            - text: Cart
        - generic [ref=e45]:
          - img [ref=e46]
          - generic [ref=e49]:
            - paragraph [ref=e50]: Gannon Waye
            - paragraph [ref=e51]: Boutique · Step Inside
          - generic [ref=e54]:
            - button "Respect Is Earned Hoodie Hoodie Respect Is Earned Hoodie $98" [ref=e55] [cursor=pointer]:
              - generic [ref=e56]:
                - img "Respect Is Earned Hoodie" [ref=e57]
                - generic: Hoodie
              - generic [ref=e58]:
                - generic [ref=e59]: Respect Is Earned Hoodie
                - generic [ref=e60]: $98
            - button "Respect Is Earned Hoodie — Back Coming Soon Hoodie Back View Coming Soon" [ref=e61] [cursor=pointer]:
              - generic [ref=e62]:
                - img "Respect Is Earned Hoodie — Back" [ref=e63]
                - generic: Coming Soon
              - generic [ref=e64]:
                - generic [ref=e65]: Hoodie Back View
                - generic [ref=e66]: Coming Soon
            - button "Winter Writing & Comfort Bundle Featured Bundle Winter Bundle $119" [ref=e67] [cursor=pointer]:
              - generic [ref=e68]:
                - img "Winter Writing & Comfort Bundle" [ref=e69]
                - generic: Featured Bundle
              - generic [ref=e70]:
                - generic [ref=e71]: Winter Bundle
                - generic [ref=e72]: $119
            - button "Thankyou Journal, Pen & Thermos Flask Bundle Bundle Journal Bundle $59" [ref=e73] [cursor=pointer]:
              - generic [ref=e74]:
                - img "Thankyou Journal, Pen & Thermos Flask Bundle" [ref=e75]
                - generic: Bundle
              - generic [ref=e76]:
                - generic [ref=e77]: Journal Bundle
                - generic [ref=e78]: $59
            - button "Thankyou \"Respect Is Earned\" Coffee Mug Mug Coffee Mug $9.90" [ref=e79] [cursor=pointer]:
              - generic [ref=e80]:
                - img "Thankyou \"Respect Is Earned\" Coffee Mug" [ref=e81]
                - generic: Mug
              - generic [ref=e82]:
                - generic [ref=e83]: Coffee Mug
                - generic [ref=e84]: $9.90
            - button "Thankyou \"Respect Is Earned\" Wall Poster Poster Wall Poster From $19" [ref=e85] [cursor=pointer]:
              - generic [ref=e86]:
                - img "Thankyou \"Respect Is Earned\" Wall Poster" [ref=e87]
                - generic: Poster
              - generic [ref=e88]:
                - generic [ref=e89]: Wall Poster
                - generic [ref=e90]: From $19
            - button "Thankyou CD Sold Out Thankyou CD Sold Out" [ref=e91] [cursor=pointer]:
              - generic [ref=e92]:
                - img "Thankyou CD" [ref=e93]
                - generic: Sold Out
              - generic [ref=e94]:
                - generic [ref=e95]: Thankyou CD
                - generic [ref=e96]: Sold Out
            - button "Thankyou Tote Bag Sold Out Tote Bag $15" [ref=e97] [cursor=pointer]:
              - generic [ref=e98]:
                - img "Thankyou Tote Bag" [ref=e99]
                - generic: Sold Out
              - generic [ref=e100]:
                - generic [ref=e101]: Tote Bag
                - generic [ref=e102]: $15
            - button "Mum's Garden Private Mum's Garden Tribute" [ref=e103] [cursor=pointer]:
              - generic [ref=e104]:
                - img "Mum's Garden" [ref=e105]
                - generic: Private
              - generic [ref=e106]:
                - generic [ref=e107]: Mum's Garden
                - generic [ref=e108]: Tribute
        - paragraph [ref=e109]: Hover or tap zones to explore · Click to quick-view & shop
        - generic [ref=e110]:
          - generic [ref=e111]:
            - paragraph [ref=e112]: Most Popular
            - heading "Featured Gear" [level=2] [ref=e113]
          - generic [ref=e114]:
            - button "Respect Is Earned Hoodie ‹ › ★ Best Seller Respect Is Earned Hoodie Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye si… $98 SHOP NOW →" [ref=e115] [cursor=pointer]:
              - generic [ref=e116]:
                - generic [ref=e117]:
                  - img "Respect Is Earned Hoodie" [ref=e118]
                  - button "‹" [ref=e119]
                  - button "›" [ref=e120]
                  - generic [ref=e121]:
                    - button [ref=e122]
                    - button [ref=e123]
                    - button [ref=e124]
                    - button [ref=e125]
                    - button [ref=e126]
                - generic: ★ Best Seller
              - generic [ref=e127]:
                - generic [ref=e128]: Respect Is Earned Hoodie
                - paragraph [ref=e129]: Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye si…
                - generic [ref=e130]:
                  - generic [ref=e131]: $98
                  - generic [ref=e132]: SHOP NOW →
            - button "Winter Writing & Comfort Bundle ‹ › Featured Bundle Winter Bundle $119 SHOP NOW →" [ref=e133] [cursor=pointer]:
              - generic [ref=e134]:
                - generic [ref=e135]:
                  - img "Winter Writing & Comfort Bundle" [ref=e136]
                  - button "‹" [ref=e137]
                  - button "›" [ref=e138]
                  - generic [ref=e139]:
                    - button [ref=e140]
                    - button [ref=e141]
                    - button [ref=e142]
                    - button [ref=e143]
                    - button [ref=e144]
                    - button [ref=e145]
                - generic: Featured Bundle
              - generic [ref=e146]:
                - generic [ref=e147]: Winter Bundle
                - generic [ref=e148]:
                  - generic [ref=e149]: $119
                  - generic [ref=e150]: SHOP NOW →
            - button "Thankyou Journal, Pen & Thermos Flask Bundle ‹ › Bundle Journal Bundle $59 SHOP NOW →" [ref=e151] [cursor=pointer]:
              - generic [ref=e152]:
                - generic [ref=e153]:
                  - img "Thankyou Journal, Pen & Thermos Flask Bundle" [ref=e154]
                  - button "‹" [ref=e155]
                  - button "›" [ref=e156]
                  - generic [ref=e157]:
                    - button [ref=e158]
                    - button [ref=e159]
                    - button [ref=e160]
                    - button [ref=e161]
                - generic: Bundle
              - generic [ref=e162]:
                - generic [ref=e163]: Journal Bundle
                - generic [ref=e164]:
                  - generic [ref=e165]: $59
                  - generic [ref=e166]: SHOP NOW →
        - heading "Gannon Waye Merch Store — Full Collection" [level=2] [ref=e167]
        - generic [ref=e169]:
          - button "Respect Is Earned Hoodie Hoodie Respect Is Earned Hoodie $98 View →" [ref=e170] [cursor=pointer]:
            - generic [ref=e171]:
              - img "Respect Is Earned Hoodie" [ref=e172]
              - generic [ref=e174]: Hoodie
              - generic [ref=e175]:
                - paragraph [ref=e176]: Respect Is Earned Hoodie
                - generic [ref=e177]:
                  - generic [ref=e178]: $98
                  - generic [ref=e179]: View →
          - button "Respect Is Earned Hoodie — Back Coming Soon Hoodie Back View Coming Soon View →" [ref=e180] [cursor=pointer]:
            - generic [ref=e181]:
              - img "Respect Is Earned Hoodie — Back" [ref=e182]
              - generic [ref=e184]: Coming Soon
              - generic [ref=e185]:
                - paragraph [ref=e186]: Hoodie Back View
                - generic [ref=e187]:
                  - generic [ref=e188]: Coming Soon
                  - generic [ref=e189]: View →
          - button "Winter Writing & Comfort Bundle Featured Bundle Winter Bundle $119 View →" [ref=e190] [cursor=pointer]:
            - generic [ref=e191]:
              - img "Winter Writing & Comfort Bundle" [ref=e192]
              - generic [ref=e194]: Featured Bundle
              - generic [ref=e195]:
                - paragraph [ref=e196]: Winter Bundle
                - generic [ref=e197]:
                  - generic [ref=e198]: $119
                  - generic [ref=e199]: View →
          - button "Thankyou Journal, Pen & Thermos Flask Bundle Bundle Journal Bundle $59 View →" [ref=e200] [cursor=pointer]:
            - generic [ref=e201]:
              - img "Thankyou Journal, Pen & Thermos Flask Bundle" [ref=e202]
              - generic [ref=e204]: Bundle
              - generic [ref=e205]:
                - paragraph [ref=e206]: Journal Bundle
                - generic [ref=e207]:
                  - generic [ref=e208]: $59
                  - generic [ref=e209]: View →
          - button "Thankyou \"Respect Is Earned\" Coffee Mug Mug Coffee Mug $9.90 View →" [ref=e210] [cursor=pointer]:
            - generic [ref=e211]:
              - img "Thankyou \"Respect Is Earned\" Coffee Mug" [ref=e212]
              - generic [ref=e214]: Mug
              - generic [ref=e215]:
                - paragraph [ref=e216]: Coffee Mug
                - generic [ref=e217]:
                  - generic [ref=e218]: $9.90
                  - generic [ref=e219]: View →
          - button "Thankyou \"Respect Is Earned\" Wall Poster Poster Wall Poster From $19 View →" [ref=e220] [cursor=pointer]:
            - generic [ref=e221]:
              - img "Thankyou \"Respect Is Earned\" Wall Poster" [ref=e222]
              - generic [ref=e224]: Poster
              - generic [ref=e225]:
                - paragraph [ref=e226]: Wall Poster
                - generic [ref=e227]:
                  - generic [ref=e228]: From $19
                  - generic [ref=e229]: View →
          - button "Thankyou CD Sold Out Thankyou CD Sold Out Waitlist →" [ref=e230] [cursor=pointer]:
            - generic [ref=e231]:
              - img "Thankyou CD" [ref=e232]
              - generic [ref=e234]: Sold Out
              - generic [ref=e235]:
                - paragraph [ref=e236]: Thankyou CD
                - generic [ref=e237]:
                  - generic [ref=e238]: Sold Out
                  - generic [ref=e239]: Waitlist →
          - button "Thankyou Tote Bag Sold Out Tote Bag $15 Waitlist →" [ref=e240] [cursor=pointer]:
            - generic [ref=e241]:
              - img "Thankyou Tote Bag" [ref=e242]
              - generic [ref=e244]: Sold Out
              - generic [ref=e245]:
                - paragraph [ref=e246]: Tote Bag
                - generic [ref=e247]:
                  - generic [ref=e248]: $15
                  - generic [ref=e249]: Waitlist →
          - button "Mum's Garden Private Mum's Garden Tribute Visit →" [ref=e250] [cursor=pointer]:
            - generic [ref=e251]:
              - img "Mum's Garden" [ref=e252]
              - generic [ref=e254]: Private
              - generic [ref=e255]:
                - paragraph [ref=e256]: Mum's Garden
                - generic [ref=e257]:
                  - generic [ref=e258]: Tribute
                  - generic [ref=e259]: Visit →
        - generic [ref=e261]:
          - generic [ref=e262]:
            - paragraph [ref=e263]: The Collection
            - heading "Merch Gallery" [level=2] [ref=e264]
            - paragraph [ref=e265]: Every piece carries a meaning. Hover to explore the details.
          - generic [ref=e266]:
            - generic [ref=e267] [cursor=pointer]:
              - img "Respect Is Earned Hoodie" [ref=e269]
              - generic [ref=e271]: Hoodie
              - generic [ref=e273]:
                - heading "Respect Is Earned Hoodie" [level=3] [ref=e274]
                - paragraph: Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye signature de…
                - generic [ref=e275]:
                  - generic [ref=e276]: $98
                  - generic [ref=e277]: View →
            - generic [ref=e278] [cursor=pointer]:
              - img "Respect Is Earned Hoodie — Back" [ref=e280]
              - generic [ref=e282]: Coming Soon
              - generic [ref=e284]:
                - heading "Hoodie Back View" [level=3] [ref=e285]
                - paragraph: Without You Here — Memorial Merchandise. Coming soon.…
                - generic [ref=e286]:
                  - generic [ref=e287]: Coming Soon
                  - generic [ref=e288]: View →
            - generic [ref=e289] [cursor=pointer]:
              - img "Winter Writing & Comfort Bundle" [ref=e291]
              - generic [ref=e293]: Featured Bundle
              - generic [ref=e295]:
                - heading "Winter Bundle" [level=3] [ref=e296]
                - paragraph: The hero bundle of the Thankyou Merch Store. Includes the oversized Respect Is Earned hoodie plus th…
                - generic [ref=e297]:
                  - generic [ref=e298]: $119
                  - generic [ref=e299]: View →
            - generic [ref=e300] [cursor=pointer]:
              - img "Thankyou Journal, Pen & Thermos Flask Bundle" [ref=e302]
              - generic [ref=e304]: Bundle
              - generic [ref=e306]:
                - heading "Journal Bundle" [level=3] [ref=e307]
                - paragraph: A premium Thankyou writing set featuring the Respect Is Earned journal, matching pen and thermos fla…
                - generic [ref=e308]:
                  - generic [ref=e309]: $59
                  - generic [ref=e310]: View →
            - generic [ref=e311] [cursor=pointer]:
              - img "Thankyou \"Respect Is Earned\" Coffee Mug" [ref=e313]
              - generic [ref=e315]: Mug
              - generic [ref=e317]:
                - heading "Coffee Mug" [level=3] [ref=e318]
                - paragraph: Ceramic Thankyou coffee mug featuring the Respect Is Earned lyric artwork. A simple daily reminder f…
                - generic [ref=e319]:
                  - generic [ref=e320]: $9.90
                  - generic [ref=e321]: View →
            - generic [ref=e322] [cursor=pointer]:
              - img "Thankyou \"Respect Is Earned\" Wall Poster" [ref=e324]
              - generic [ref=e326]: Poster
              - generic [ref=e328]:
                - heading "Wall Poster" [level=3] [ref=e329]
                - paragraph: Premium Thankyou lyric wall poster. Multiple sizes available — A4 $19 · A3 $29 · A2 $39 · A1 $59.…
                - generic [ref=e330]:
                  - generic [ref=e331]: From $19
                  - generic [ref=e332]: View →
        - button "View Full Product Grid & Checkout →" [ref=e334] [cursor=pointer]
  - contentinfo [ref=e335]:
    - generic [ref=e336]:
      - generic [ref=e337]:
        - generic [ref=e338]:
          - generic [ref=e340]: GW
          - paragraph [ref=e341]: Australian singer-songwriter crafting honest stories through melody and verse.
        - generic [ref=e342]:
          - heading "Navigate" [level=4] [ref=e343]
          - generic [ref=e344]:
            - link "Home" [ref=e345]:
              - /url: /
            - link "Music" [ref=e346]:
              - /url: /music
            - link "Lyrics" [ref=e347]:
              - /url: /lyrics
            - link "Store" [ref=e348]:
              - /url: /store
            - link "Press" [ref=e349]:
              - /url: /press
            - link "Subscribe 🤍" [ref=e350]:
              - /url: /back-this
            - link "Community" [ref=e351]:
              - /url: /community
            - link "Biography" [ref=e352]:
              - /url: /biography
            - link "Lyric Library" [ref=e353]:
              - /url: /lyric-library
            - link "Mixing Services" [ref=e354]:
              - /url: /mixing-services
            - link "Gift Cards" [ref=e355]:
              - /url: /gift-cards
            - link "Mum Tribute" [ref=e356]:
              - /url: /remember-mum
            - link "Systems Manager" [ref=e357]:
              - /url: /systems-manager
            - link "Contact" [ref=e358]:
              - /url: /contact
        - generic [ref=e359]:
          - heading "Contact" [level=4] [ref=e360]
          - paragraph [ref=e361]: For press, management & enquiries
          - link "gannonwayemusic@gmail.com" [ref=e362]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e363]
          - generic [ref=e364]:
            - link "Privacy Policy" [ref=e365]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e366]:
              - /url: /terms-of-service
            - link "Contact Gannon" [ref=e367]:
              - /url: /contact
          - heading "Social" [level=4] [ref=e368]
          - generic [ref=e369]:
            - link "Instagram @gann0nwaye" [ref=e370]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e371]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e372]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e373]:
        - paragraph [ref=e374]: Stay in the loop
        - heading "New music & community updates" [level=3] [ref=e375]
        - generic [ref=e376]:
          - textbox "Your name *" [ref=e377]
          - textbox "your@email.com *" [ref=e378]
          - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e379]
          - textbox "Birthday (optional — we'll send you something special)" [ref=e380]
          - paragraph [ref=e381]: Birthday optional — we'll send you something special 🎂
          - combobox [ref=e382]:
            - option "How did you find me? *" [selected]
            - option "Google"
            - option "Instagram"
            - option "Facebook"
            - option "TikTok"
            - option "X (Twitter)"
            - option "Friend / Word of Mouth"
            - option "I know Gannon"
            - option "Other"
          - button "Subscribe" [ref=e383] [cursor=pointer]
      - paragraph [ref=e385]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
      - generic [ref=e386]:
        - generic [ref=e387]:
          - img "GW Heart" [ref=e388]
          - link "Support the project 🤍" [ref=e389]:
            - /url: /back-this
          - img "GW Heart" [ref=e390]
        - paragraph [ref=e391]: © 2026 Gannon Waye. All rights reserved.
  - navigation [ref=e392]:
    - generic [ref=e393]:
      - link "Home" [ref=e394]:
        - /url: /
        - generic [ref=e395]:
          - img [ref=e396]
          - generic [ref=e399]: Home
      - link "Music" [ref=e400]:
        - /url: /music
        - generic [ref=e401]:
          - img [ref=e402]
          - generic [ref=e406]: Music
      - link "Store" [ref=e407]:
        - /url: /store
        - generic [ref=e409]:
          - img [ref=e410]
          - generic [ref=e413]: Store
      - link "Lyrics" [ref=e414]:
        - /url: /lyrics
        - generic [ref=e415]:
          - img [ref=e416]
          - generic [ref=e419]: Lyrics
      - link "Contact" [ref=e420]:
        - /url: /contact
        - generic [ref=e421]:
          - img [ref=e422]
          - generic [ref=e425]: Contact
  - generic [ref=e426]:
    - img [ref=e427]
    - paragraph [ref=e429]: 🎵Music approved for public sharing appears on the Music page
    - button "Dismiss" [ref=e430] [cursor=pointer]:
      - img [ref=e431]
```

# Test source

```ts
  1  | // tests/navigation-scroll.spec.js
  2  | // Verifies that navigating to a new page always resets scroll position to top.
  3  | 
  4  | /* eslint-disable no-undef */
  5  | import { test, expect } from '@playwright/test';
  6  | 
  7  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  8  | 
  9  | test.describe('Scroll-to-top on route change', () => {
  10 |   test('navigating from Store to Home resets scroll to top', async ({ page }) => {
  11 |     // Go to the store page (long page with products)
  12 |     await page.goto(`${BASE_URL}/store`);
  13 |     await page.waitForLoadState('load');
  14 | 
  15 |     // Scroll down significantly
  16 |     await page.evaluate(() => window.scrollTo(0, 800));
  17 |     const scrollBefore = await page.evaluate(() => window.scrollY);
  18 |     expect(scrollBefore).toBeGreaterThan(100);
  19 | 
  20 |     // Navigate to Home via a link or direct navigation
  21 |     await page.goto(`${BASE_URL}/`);
  22 |     await page.waitForLoadState('load');
  23 | 
  24 |     const scrollAfter = await page.evaluate(() => window.scrollY);
  25 |     expect(scrollAfter).toBe(0);
  26 |   });
  27 | 
  28 |   test('navigating from Home to Store resets scroll to top', async ({ page }) => {
  29 |     await page.goto(`${BASE_URL}/`);
  30 |     await page.waitForLoadState('load');
  31 | 
  32 |     await page.evaluate(() => window.scrollTo(0, 600));
  33 |     const scrollBefore = await page.evaluate(() => window.scrollY);
  34 |     expect(scrollBefore).toBeGreaterThan(100);
  35 | 
  36 |     await page.goto(`${BASE_URL}/store`);
  37 |     await page.waitForLoadState('load');
  38 | 
  39 |     const scrollAfter = await page.evaluate(() => window.scrollY);
  40 |     expect(scrollAfter).toBe(0);
  41 |   });
  42 | 
  43 |   test('navigating to an admin page resets scroll to top', async ({ page }) => {
  44 |     await page.goto(`${BASE_URL}/store`);
  45 |     await page.waitForLoadState('load');
  46 |     await page.evaluate(() => {
  47 |       localStorage.setItem('base44_access_token', 'mock-admin-token');
  48 |     });
  49 | 
  50 |     await page.evaluate(() => window.scrollTo(0, 500));
  51 | 
  52 |     await page.goto(`${BASE_URL}/admin`);
  53 |     await page.waitForLoadState('load');
  54 | 
  55 |     const scrollAfter = await page.evaluate(() => window.scrollY);
  56 |     expect(scrollAfter).toBe(0);
  57 |   });
  58 | 
  59 |   test('hash navigation scrolls to section, not top', async ({ page }) => {
  60 |     await page.goto(`${BASE_URL}/`);
  61 |     await page.waitForLoadState('load');
  62 | 
  63 |     // Navigate to a hash — scroll should NOT be 0 if section exists (or at least not throw)
  64 |     await page.goto(`${BASE_URL}/#about`);
  65 |     await page.waitForTimeout(300);
  66 |     // We just verify no crash — scroll position may vary depending on section existence
  67 |     const scrollY = await page.evaluate(() => window.scrollY);
  68 |     expect(scrollY).toBeGreaterThanOrEqual(0);
  69 |   });
  70 | 
  71 |   test('opening cart drawer does not reset scroll', async ({ page }) => {
  72 |     await page.goto(`${BASE_URL}/store`);
  73 |     await page.waitForLoadState('load');
  74 | 
  75 |     // Scroll down
  76 |     await page.evaluate(() => window.scrollTo(0, 400));
  77 |     await page.waitForTimeout(200);
  78 | 
  79 |     const scrollBefore = await page.evaluate(() => window.scrollY);
  80 | 
  81 |     // Open cart (if button exists)
  82 |     const cartBtn = page.locator('[data-testid="cart-button"]');
  83 |     if (await cartBtn.count() > 0) {
> 84 |       await cartBtn.click();
     |                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
  85 |       await page.waitForTimeout(300);
  86 |     }
  87 | 
  88 |     const scrollAfter = await page.evaluate(() => window.scrollY);
  89 |     // Scroll should not have reset to 0
  90 |     expect(scrollAfter).toBe(scrollBefore);
  91 |   });
  92 | });
```