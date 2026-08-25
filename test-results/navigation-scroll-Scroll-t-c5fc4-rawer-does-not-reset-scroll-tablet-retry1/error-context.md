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
        - link "Home" [ref=e11]:
          - /url: /
        - link "Biography" [ref=e13]:
          - /url: /biography
        - link "Music" [ref=e15]:
          - /url: /music
        - link "Store" [ref=e17]:
          - /url: /store
        - link "Supporters" [ref=e19]:
          - /url: /back-this
        - link "Mum's Garden" [ref=e21]:
          - /url: /mums-garden
        - link "Press" [ref=e23]:
          - /url: /press
        - link "Contact" [ref=e25]:
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
    - generic [ref=e40]:
      - generic [ref=e41]:
        - img "Gannon Waye Boutique — official merch store" [ref=e42]
        - generic [ref=e44]:
          - paragraph [ref=e45]: Boutique · Step Inside
          - heading "Gannon Waye" [level=1] [ref=e46]
          - paragraph [ref=e47]: Official Merch Store
      - generic [ref=e48]:
        - generic [ref=e49]:
          - link "All Products" [ref=e50]:
            - /url: /store/all
            - img [ref=e51]
            - text: All Products
          - link "Listen" [ref=e53]:
            - /url: /music
            - img [ref=e54]
            - text: Listen
          - link "Cart" [ref=e58]:
            - /url: /store/cart
            - img [ref=e59]
            - text: Cart
        - generic [ref=e63]:
          - img [ref=e64]
          - generic [ref=e67]:
            - paragraph [ref=e68]: Gannon Waye
            - paragraph [ref=e69]: Boutique · Step Inside
          - generic [ref=e72]:
            - button "Respect Is Earned Hoodie Hoodie Respect Is Earned Hoodie $98" [ref=e73] [cursor=pointer]:
              - generic [ref=e74]:
                - img "Respect Is Earned Hoodie" [ref=e75]
                - generic: Hoodie
              - generic [ref=e76]:
                - generic [ref=e77]: Respect Is Earned Hoodie
                - generic [ref=e78]: $98
            - button "Respect Is Earned Hoodie — Back Coming Soon Hoodie Back View Coming Soon" [ref=e79] [cursor=pointer]:
              - generic [ref=e80]:
                - img "Respect Is Earned Hoodie — Back" [ref=e81]
                - generic: Coming Soon
              - generic [ref=e82]:
                - generic [ref=e83]: Hoodie Back View
                - generic [ref=e84]: Coming Soon
            - button "Winter Writing & Comfort Bundle Featured Bundle Winter Bundle $119" [ref=e85] [cursor=pointer]:
              - generic [ref=e86]:
                - img "Winter Writing & Comfort Bundle" [ref=e87]
                - generic: Featured Bundle
              - generic [ref=e88]:
                - generic [ref=e89]: Winter Bundle
                - generic [ref=e90]: $119
            - button "Thankyou Journal, Pen & Thermos Flask Bundle Bundle Journal Bundle $59" [ref=e91] [cursor=pointer]:
              - generic [ref=e92]:
                - img "Thankyou Journal, Pen & Thermos Flask Bundle" [ref=e93]
                - generic: Bundle
              - generic [ref=e94]:
                - generic [ref=e95]: Journal Bundle
                - generic [ref=e96]: $59
            - button "Thankyou \"Respect Is Earned\" Coffee Mug Mug Coffee Mug $9.90" [ref=e97] [cursor=pointer]:
              - generic [ref=e98]:
                - img "Thankyou \"Respect Is Earned\" Coffee Mug" [ref=e99]
                - generic: Mug
              - generic [ref=e100]:
                - generic [ref=e101]: Coffee Mug
                - generic [ref=e102]: $9.90
            - button "Thankyou \"Respect Is Earned\" Wall Poster Poster Wall Poster From $19" [ref=e103] [cursor=pointer]:
              - generic [ref=e104]:
                - img "Thankyou \"Respect Is Earned\" Wall Poster" [ref=e105]
                - generic: Poster
              - generic [ref=e106]:
                - generic [ref=e107]: Wall Poster
                - generic [ref=e108]: From $19
            - button "Thankyou CD Sold Out Thankyou CD Sold Out" [ref=e109] [cursor=pointer]:
              - generic [ref=e110]:
                - img "Thankyou CD" [ref=e111]
                - generic: Sold Out
              - generic [ref=e112]:
                - generic [ref=e113]: Thankyou CD
                - generic [ref=e114]: Sold Out
            - button "Thankyou Tote Bag Sold Out Tote Bag $15" [ref=e115] [cursor=pointer]:
              - generic [ref=e116]:
                - img "Thankyou Tote Bag" [ref=e117]
                - generic: Sold Out
              - generic [ref=e118]:
                - generic [ref=e119]: Tote Bag
                - generic [ref=e120]: $15
            - button "Mum's Garden Private Mum's Garden Tribute" [ref=e121] [cursor=pointer]:
              - generic [ref=e122]:
                - img "Mum's Garden" [ref=e123]
                - generic: Private
              - generic [ref=e124]:
                - generic [ref=e125]: Mum's Garden
                - generic [ref=e126]: Tribute
        - paragraph [ref=e127]: Hover or tap zones to explore · Click to quick-view & shop
        - generic [ref=e128]:
          - generic [ref=e129]:
            - paragraph [ref=e130]: Most Popular
            - heading "Featured Gear" [level=2] [ref=e131]
          - generic [ref=e132]:
            - button "Respect Is Earned Hoodie ‹ › ★ Best Seller Respect Is Earned Hoodie Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye si… $98 SHOP NOW →" [ref=e133] [cursor=pointer]:
              - generic [ref=e134]:
                - generic [ref=e135]:
                  - img "Respect Is Earned Hoodie" [ref=e136]
                  - button "‹" [ref=e137]
                  - button "›" [ref=e138]
                  - generic [ref=e139]:
                    - button [ref=e140]
                    - button [ref=e141]
                    - button [ref=e142]
                    - button [ref=e143]
                    - button [ref=e144]
                - generic: ★ Best Seller
              - generic [ref=e145]:
                - generic [ref=e146]: Respect Is Earned Hoodie
                - paragraph [ref=e147]: Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye si…
                - generic [ref=e148]:
                  - generic [ref=e149]: $98
                  - generic [ref=e150]: SHOP NOW →
            - button "Winter Writing & Comfort Bundle ‹ › Featured Bundle Winter Bundle $119 SHOP NOW →" [ref=e151] [cursor=pointer]:
              - generic [ref=e152]:
                - generic [ref=e153]:
                  - img "Winter Writing & Comfort Bundle" [ref=e154]
                  - button "‹" [ref=e155]
                  - button "›" [ref=e156]
                  - generic [ref=e157]:
                    - button [ref=e158]
                    - button [ref=e159]
                    - button [ref=e160]
                    - button [ref=e161]
                    - button [ref=e162]
                    - button [ref=e163]
                - generic: Featured Bundle
              - generic [ref=e164]:
                - generic [ref=e165]: Winter Bundle
                - generic [ref=e166]:
                  - generic [ref=e167]: $119
                  - generic [ref=e168]: SHOP NOW →
            - button "Thankyou Journal, Pen & Thermos Flask Bundle ‹ › Bundle Journal Bundle $59 SHOP NOW →" [ref=e169] [cursor=pointer]:
              - generic [ref=e170]:
                - generic [ref=e171]:
                  - img "Thankyou Journal, Pen & Thermos Flask Bundle" [ref=e172]
                  - button "‹" [ref=e173]
                  - button "›" [ref=e174]
                  - generic [ref=e175]:
                    - button [ref=e176]
                    - button [ref=e177]
                    - button [ref=e178]
                    - button [ref=e179]
                - generic: Bundle
              - generic [ref=e180]:
                - generic [ref=e181]: Journal Bundle
                - generic [ref=e182]:
                  - generic [ref=e183]: $59
                  - generic [ref=e184]: SHOP NOW →
        - heading "Gannon Waye Merch Store — Full Collection" [level=2] [ref=e185]
        - generic [ref=e187]:
          - button "Respect Is Earned Hoodie Hoodie Respect Is Earned Hoodie $98 View →" [ref=e188] [cursor=pointer]:
            - generic [ref=e189]:
              - img "Respect Is Earned Hoodie" [ref=e190]
              - generic [ref=e192]: Hoodie
              - generic [ref=e193]:
                - paragraph [ref=e194]: Respect Is Earned Hoodie
                - generic [ref=e195]:
                  - generic [ref=e196]: $98
                  - generic [ref=e197]: View →
          - button "Respect Is Earned Hoodie — Back Coming Soon Hoodie Back View Coming Soon View →" [ref=e198] [cursor=pointer]:
            - generic [ref=e199]:
              - img "Respect Is Earned Hoodie — Back" [ref=e200]
              - generic [ref=e202]: Coming Soon
              - generic [ref=e203]:
                - paragraph [ref=e204]: Hoodie Back View
                - generic [ref=e205]:
                  - generic [ref=e206]: Coming Soon
                  - generic [ref=e207]: View →
          - button "Winter Writing & Comfort Bundle Featured Bundle Winter Bundle $119 View →" [ref=e208] [cursor=pointer]:
            - generic [ref=e209]:
              - img "Winter Writing & Comfort Bundle" [ref=e210]
              - generic [ref=e212]: Featured Bundle
              - generic [ref=e213]:
                - paragraph [ref=e214]: Winter Bundle
                - generic [ref=e215]:
                  - generic [ref=e216]: $119
                  - generic [ref=e217]: View →
          - button "Thankyou Journal, Pen & Thermos Flask Bundle Bundle Journal Bundle $59 View →" [ref=e218] [cursor=pointer]:
            - generic [ref=e219]:
              - img "Thankyou Journal, Pen & Thermos Flask Bundle" [ref=e220]
              - generic [ref=e222]: Bundle
              - generic [ref=e223]:
                - paragraph [ref=e224]: Journal Bundle
                - generic [ref=e225]:
                  - generic [ref=e226]: $59
                  - generic [ref=e227]: View →
          - button "Thankyou \"Respect Is Earned\" Coffee Mug Mug Coffee Mug $9.90 View →" [ref=e228] [cursor=pointer]:
            - generic [ref=e229]:
              - img "Thankyou \"Respect Is Earned\" Coffee Mug" [ref=e230]
              - generic [ref=e232]: Mug
              - generic [ref=e233]:
                - paragraph [ref=e234]: Coffee Mug
                - generic [ref=e235]:
                  - generic [ref=e236]: $9.90
                  - generic [ref=e237]: View →
          - button "Thankyou \"Respect Is Earned\" Wall Poster Poster Wall Poster From $19 View →" [ref=e238] [cursor=pointer]:
            - generic [ref=e239]:
              - img "Thankyou \"Respect Is Earned\" Wall Poster" [ref=e240]
              - generic [ref=e242]: Poster
              - generic [ref=e243]:
                - paragraph [ref=e244]: Wall Poster
                - generic [ref=e245]:
                  - generic [ref=e246]: From $19
                  - generic [ref=e247]: View →
          - button "Thankyou CD Sold Out Thankyou CD Sold Out Waitlist →" [ref=e248] [cursor=pointer]:
            - generic [ref=e249]:
              - img "Thankyou CD" [ref=e250]
              - generic [ref=e252]: Sold Out
              - generic [ref=e253]:
                - paragraph [ref=e254]: Thankyou CD
                - generic [ref=e255]:
                  - generic [ref=e256]: Sold Out
                  - generic [ref=e257]: Waitlist →
          - button "Thankyou Tote Bag Sold Out Tote Bag $15 Waitlist →" [ref=e258] [cursor=pointer]:
            - generic [ref=e259]:
              - img "Thankyou Tote Bag" [ref=e260]
              - generic [ref=e262]: Sold Out
              - generic [ref=e263]:
                - paragraph [ref=e264]: Tote Bag
                - generic [ref=e265]:
                  - generic [ref=e266]: $15
                  - generic [ref=e267]: Waitlist →
          - button "Mum's Garden Private Mum's Garden Tribute Visit →" [ref=e268] [cursor=pointer]:
            - generic [ref=e269]:
              - img "Mum's Garden" [ref=e270]
              - generic [ref=e272]: Private
              - generic [ref=e273]:
                - paragraph [ref=e274]: Mum's Garden
                - generic [ref=e275]:
                  - generic [ref=e276]: Tribute
                  - generic [ref=e277]: Visit →
        - generic [ref=e279]:
          - generic [ref=e280]:
            - paragraph [ref=e281]: The Collection
            - heading "Merch Gallery" [level=2] [ref=e282]
            - paragraph [ref=e283]: Every piece carries a meaning. Hover to explore the details.
          - generic [ref=e284]:
            - generic [ref=e285] [cursor=pointer]:
              - img "Respect Is Earned Hoodie" [ref=e287]
              - generic [ref=e289]: Hoodie
              - generic [ref=e291]:
                - heading "Respect Is Earned Hoodie" [level=3] [ref=e292]
                - paragraph: Dark grey oversized hoodie featuring the Thankyou artwork on the front with Gannon Waye signature de…
                - generic [ref=e293]:
                  - generic [ref=e294]: $98
                  - generic [ref=e295]: View →
            - generic [ref=e296] [cursor=pointer]:
              - img "Respect Is Earned Hoodie — Back" [ref=e298]
              - generic [ref=e300]: Coming Soon
              - generic [ref=e302]:
                - heading "Hoodie Back View" [level=3] [ref=e303]
                - paragraph: Without You Here — Memorial Merchandise. Coming soon.…
                - generic [ref=e304]:
                  - generic [ref=e305]: Coming Soon
                  - generic [ref=e306]: View →
            - generic [ref=e307] [cursor=pointer]:
              - img "Winter Writing & Comfort Bundle" [ref=e309]
              - generic [ref=e311]: Featured Bundle
              - generic [ref=e313]:
                - heading "Winter Bundle" [level=3] [ref=e314]
                - paragraph: The hero bundle of the Thankyou Merch Store. Includes the oversized Respect Is Earned hoodie plus th…
                - generic [ref=e315]:
                  - generic [ref=e316]: $119
                  - generic [ref=e317]: View →
            - generic [ref=e318] [cursor=pointer]:
              - img "Thankyou Journal, Pen & Thermos Flask Bundle" [ref=e320]
              - generic [ref=e322]: Bundle
              - generic [ref=e324]:
                - heading "Journal Bundle" [level=3] [ref=e325]
                - paragraph: A premium Thankyou writing set featuring the Respect Is Earned journal, matching pen and thermos fla…
                - generic [ref=e326]:
                  - generic [ref=e327]: $59
                  - generic [ref=e328]: View →
            - generic [ref=e329] [cursor=pointer]:
              - img "Thankyou \"Respect Is Earned\" Coffee Mug" [ref=e331]
              - generic [ref=e333]: Mug
              - generic [ref=e335]:
                - heading "Coffee Mug" [level=3] [ref=e336]
                - paragraph: Ceramic Thankyou coffee mug featuring the Respect Is Earned lyric artwork. A simple daily reminder f…
                - generic [ref=e337]:
                  - generic [ref=e338]: $9.90
                  - generic [ref=e339]: View →
            - generic [ref=e340] [cursor=pointer]:
              - img "Thankyou \"Respect Is Earned\" Wall Poster" [ref=e342]
              - generic [ref=e344]: Poster
              - generic [ref=e346]:
                - heading "Wall Poster" [level=3] [ref=e347]
                - paragraph: Premium Thankyou lyric wall poster. Multiple sizes available — A4 $19 · A3 $29 · A2 $39 · A1 $59.…
                - generic [ref=e348]:
                  - generic [ref=e349]: From $19
                  - generic [ref=e350]: View →
        - button "View Full Product Grid & Checkout →" [ref=e352] [cursor=pointer]
  - contentinfo [ref=e353]:
    - generic [ref=e354]:
      - generic [ref=e355]:
        - generic [ref=e356]:
          - generic [ref=e358]: GW
          - paragraph [ref=e359]: Australian singer-songwriter crafting honest stories through melody and verse.
        - generic [ref=e360]:
          - heading "Navigate" [level=4] [ref=e361]
          - generic [ref=e362]:
            - link "Home" [ref=e363]:
              - /url: /
            - link "Music" [ref=e364]:
              - /url: /music
            - link "Lyrics" [ref=e365]:
              - /url: /lyrics
            - link "Store" [ref=e366]:
              - /url: /store
            - link "Press" [ref=e367]:
              - /url: /press
            - link "Subscribe 🤍" [ref=e368]:
              - /url: /back-this
            - link "Community" [ref=e369]:
              - /url: /community
            - link "Biography" [ref=e370]:
              - /url: /biography
            - link "Lyric Library" [ref=e371]:
              - /url: /lyric-library
            - link "Mixing Services" [ref=e372]:
              - /url: /mixing-services
            - link "Gift Cards" [ref=e373]:
              - /url: /gift-cards
            - link "Mum Tribute" [ref=e374]:
              - /url: /remember-mum
            - link "Systems Manager" [ref=e375]:
              - /url: /systems-manager
            - link "Contact" [ref=e376]:
              - /url: /contact
        - generic [ref=e377]:
          - heading "Contact" [level=4] [ref=e378]
          - paragraph [ref=e379]: For press, management & enquiries
          - link "gannonwayemusic@gmail.com" [ref=e380]:
            - /url: mailto:gannonwayemusic@gmail.com
          - heading "Legal" [level=4] [ref=e381]
          - generic [ref=e382]:
            - link "Privacy Policy" [ref=e383]:
              - /url: /privacy-policy
            - link "Terms of Service" [ref=e384]:
              - /url: /terms-of-service
            - link "Contact Gannon" [ref=e385]:
              - /url: /contact
          - heading "Social" [level=4] [ref=e386]
          - generic [ref=e387]:
            - link "Instagram @gann0nwaye" [ref=e388]:
              - /url: https://www.instagram.com/gann0nwaye
            - link "TikTok @gann0nwaye" [ref=e389]:
              - /url: https://www.tiktok.com/@gann0nwaye
            - link "YouTube @gannonwayeofficial" [ref=e390]:
              - /url: https://www.youtube.com/@gannonwayeofficial
      - generic [ref=e391]:
        - paragraph [ref=e392]: Stay in the loop
        - heading "New music & community updates" [level=3] [ref=e393]
        - generic [ref=e394]:
          - textbox "Your name *" [ref=e395]
          - textbox "your@email.com *" [ref=e396]
          - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e397]
          - textbox "Birthday (optional — we'll send you something special)" [ref=e398]
          - paragraph [ref=e399]: Birthday optional — we'll send you something special 🎂
          - combobox [ref=e400]:
            - option "How did you find me? *" [selected]
            - option "Google"
            - option "Instagram"
            - option "Facebook"
            - option "TikTok"
            - option "X (Twitter)"
            - option "Friend / Word of Mouth"
            - option "I know Gannon"
            - option "Other"
          - button "Subscribe" [ref=e401] [cursor=pointer]
      - paragraph [ref=e403]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
      - generic [ref=e404]:
        - generic [ref=e405]:
          - img "GW Heart" [ref=e406]
          - link "Support the project 🤍" [ref=e407]:
            - /url: /back-this
          - img "GW Heart" [ref=e408]
        - paragraph [ref=e409]: © 2026 Gannon Waye. All rights reserved.
  - generic [ref=e410]:
    - img [ref=e411]
    - paragraph [ref=e413]: 🎵Music approved for public sharing appears on the Music page
    - button "Dismiss" [ref=e414] [cursor=pointer]:
      - img [ref=e415]
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