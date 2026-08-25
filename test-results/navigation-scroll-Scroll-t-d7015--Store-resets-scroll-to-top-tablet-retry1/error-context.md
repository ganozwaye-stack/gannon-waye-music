# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation-scroll.spec.js >> Scroll-to-top on route change >> navigating from Home to Store resets scroll to top
- Location: src/gannonwaye-playwright-pack/tests/navigation-scroll.spec.js:28:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/store", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Support Now" [ref=e4]:
    - /url: /back-this
    - button "Support Now" [ref=e5] [cursor=pointer]
  - generic [ref=e6]:
    - navigation [ref=e7]:
      - generic [ref=e8]:
        - link "Gannon Waye · Home" [ref=e9]:
          - /url: /
          - generic [ref=e11]: GW
        - generic [ref=e12]:
          - link "Home" [ref=e14]:
            - /url: /
          - link "Biography" [ref=e16]:
            - /url: /biography
          - link "Music" [ref=e18]:
            - /url: /music
          - link "Store" [ref=e20]:
            - /url: /store
          - link "Supporters" [ref=e22]:
            - /url: /back-this
          - link "Mum's Garden" [ref=e24]:
            - /url: /mums-garden
          - link "Press" [ref=e26]:
            - /url: /press
          - link "Contact" [ref=e28]:
            - /url: /contact
          - button "More" [ref=e30] [cursor=pointer]:
            - text: More
            - img
        - generic [ref=e32]:
          - button [ref=e33] [cursor=pointer]:
            - img [ref=e34]
          - button "Open cart" [ref=e37] [cursor=pointer]:
            - img [ref=e38]
    - main [ref=e42]:
      - generic [ref=e43]:
        - generic [ref=e44]:
          - button "Close" [ref=e45] [cursor=pointer]:
            - img [ref=e46]
          - generic [ref=e49]:
            - generic [ref=e50]:
              - paragraph [ref=e51]: Welcome
              - heading "This is more than music. This is choosing yourself." [level=2] [ref=e52]:
                - text: This is more than music.
                - text: This is choosing yourself.
              - paragraph [ref=e53]: Where would you like to begin?
            - generic [ref=e54]:
              - link "Discover the Music Stream the latest singles, explore the discography, and feel every lyric. Enter the Sound" [ref=e56]:
                - /url: /music
                - img [ref=e58]
                - heading "Discover the Music" [level=3] [ref=e62]
                - paragraph [ref=e63]: Stream the latest singles, explore the discography, and feel every lyric.
                - paragraph [ref=e64]:
                  - text: Enter the Sound
                  - img [ref=e65]
              - link "Join the Inner Circle Be part of a community that chooses authenticity over appearance. Step In" [ref=e68]:
                - /url: /back-this
                - img [ref=e70]
                - heading "Join the Inner Circle" [level=3] [ref=e75]
                - paragraph [ref=e76]: Be part of a community that chooses authenticity over appearance.
                - paragraph [ref=e77]:
                  - text: Step In
                  - img [ref=e78]
              - link "Book Gannon Secure your session — performances, collaborations, and creative partnerships. Reserve Your Session" [ref=e81]:
                - /url: /contact
                - img [ref=e83]
                - heading "Book Gannon" [level=3] [ref=e85]
                - paragraph [ref=e86]: Secure your session — performances, collaborations, and creative partnerships.
                - paragraph [ref=e87]:
                  - text: Reserve Your Session
                  - img [ref=e88]
            - button "Just exploring — take me to the site" [ref=e90] [cursor=pointer]
        - generic [ref=e91]:
          - img
          - generic [ref=e93]:
            - heading "Gannon Waye" [level=1] [ref=e94]
            - generic [ref=e95]:
              - generic [ref=e96]:
                - generic [ref=e97]:
                  - paragraph [ref=e98]: Music
                  - link "Gannon Waye Music, Gannon Waye" [ref=e100]:
                    - /url: /music
                    - img "Gannon Waye Music, Gannon Waye" [ref=e101]
                  - paragraph [ref=e102]: Music is shared here only when it is ready.
                - link "Back The Thankyou Project 🤍" [ref=e105]:
                  - /url: /back-this
                  - button "Back The Thankyou Project 🤍" [ref=e106] [cursor=pointer]
              - generic [ref=e107]:
                - generic [ref=e112]:
                  - generic [ref=e113]:
                    - generic [ref=e117]: Gannon Waye Music
                    - generic [ref=e118]: Official artist site
                  - paragraph [ref=e120]: Independent, heart-first music from Gannon Waye
                  - link "Explore the Music page" [ref=e122]:
                    - /url: /music
                - generic [ref=e123]:
                  - paragraph [ref=e124]: WELCOME
                  - paragraph [ref=e125]: I'm a singer-songwriter from Adelaide, now based in Melbourne. I write from lived experience about grief, healing, and the quiet courage it takes to love yourself. My mission is to make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. This is independent, heart-first art, powered by community, with 10% of all support going to 1800RESPECT. Every song is recorded honestly, voice and guitar first, so the feeling stays intact. Whether you're carrying loss, rebuilding after hard years, or learning to like yourself again, you're in the right place, and you're not alone here.
          - generic:
            - generic: Scroll
        - generic [ref=e127]:
          - generic [ref=e128]:
            - generic [ref=e129]: Independent, heart-first music from Gannon Waye
            - generic [ref=e130]: ◆
            - generic [ref=e131]: Music approved for public sharing appears on the Music page
            - generic [ref=e132]: ◆
            - generic [ref=e133]: 10% of all support goes to 1800RESPECT
            - generic [ref=e134]: ◆
            - generic [ref=e135]: New music is shared only when it is ready
            - generic [ref=e136]: ◆
            - generic [ref=e137]: Join the community and follow the story
            - generic [ref=e138]: ◆
          - generic [ref=e139]:
            - generic [ref=e140]: Independent, heart-first music from Gannon Waye
            - generic [ref=e141]: ◆
            - generic [ref=e142]: Music approved for public sharing appears on the Music page
            - generic [ref=e143]: ◆
            - generic [ref=e144]: 10% of all support goes to 1800RESPECT
            - generic [ref=e145]: ◆
            - generic [ref=e146]: New music is shared only when it is ready
            - generic [ref=e147]: ◆
            - generic [ref=e148]: Join the community and follow the story
            - generic [ref=e149]: ◆
        - generic [ref=e151]:
          - generic [ref=e152]:
            - paragraph [ref=e153]: About
            - heading "The Story" [level=2] [ref=e154]
          - generic [ref=e155]:
            - generic [ref=e156]:
              - paragraph [ref=e157]: I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me. It's the language I use to understand people, emotion, and the parts of life that don't always have words.
              - paragraph [ref=e158]: I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
              - paragraph [ref=e159]: I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.
            - generic [ref=e162]:
              - paragraph [ref=e163]: I didn't truly love myself
              - paragraph [ref=e164]: until I was 33.
              - paragraph [ref=e165]: Before that, I woke up
              - paragraph [ref=e166]: every day wishing
              - paragraph [ref=e167]: I could be someone else.
              - paragraph [ref=e168]: That fear of abandonment
              - paragraph [ref=e169]: ran my life.
              - paragraph [ref=e170]: Then something shifted
              - paragraph [ref=e171]: and for the first time,
              - paragraph [ref=e172]: I didn't want to be
              - paragraph [ref=e173]: anyone else.
              - paragraph [ref=e174]: Gannon Waye
            - generic [ref=e176]:
              - paragraph [ref=e177]: My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. But those experiences shaped me and gave me something real to say.
              - paragraph [ref=e178]: "I began singing at a young age, runner up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience."
              - paragraph [ref=e179]: That work shapes the music and stories I continue to create for anyone who needs hope or a reminder that they are not alone.
        - generic [ref=e181]:
          - generic [ref=e182]:
            - paragraph [ref=e183]: For Press
            - heading "Digital Press Kit" [level=2] [ref=e184]
          - generic [ref=e187]:
            - generic [ref=e188]:
              - paragraph [ref=e189]: Mission
              - paragraph [ref=e190]: To make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. Independent, heart-first art, with 10% of all support going to 1800RESPECT.
              - paragraph [ref=e192]: Biography
              - paragraph [ref=e193]: Gannon Waye is a singer-songwriter born and raised in Adelaide and based in Melbourne. He writes from lived experience about grief, healing, self-worth, and the quiet courage it takes to choose yourself. His work is independent, heart-first, and grounded in honest storytelling.
              - generic [ref=e194]:
                - link "Full Press Kit" [ref=e195]:
                  - /url: /press-kit
                  - button "Full Press Kit" [ref=e196] [cursor=pointer]:
                    - img
                    - text: Full Press Kit
                - link "Press & Booking" [ref=e197]:
                  - /url: /press
                  - button "Press & Booking" [ref=e198] [cursor=pointer]:
                    - text: Press & Booking
                    - img
            - generic [ref=e199]:
              - paragraph [ref=e200]: Headshots
              - img "Gannon Waye" [ref=e203]
              - paragraph [ref=e204]: High-resolution images available on request
        - generic [ref=e206]:
          - paragraph [ref=e207]: Official Merch Boutique
          - heading "Enter the Gannon Waye Store" [level=2] [ref=e208]
          - paragraph [ref=e209]:
            - text: Shop Official Merch — the
            - emphasis [ref=e210]: Respect Is Earned
            - text: collection,
            - text: bundles, wall posters and music collectables.
          - generic [ref=e213]: ✦
          - generic [ref=e215]:
            - button "Enter the Store ✦" [ref=e216] [cursor=pointer]
            - button "Shop All Merch →" [ref=e217] [cursor=pointer]
          - generic [ref=e218]:
            - button "Winter Bundle — $129" [ref=e219] [cursor=pointer]
            - button "Journal Bundle — $59" [ref=e220] [cursor=pointer]
            - button "Hoodie — $89" [ref=e221] [cursor=pointer]
            - button "Mug — $9.90" [ref=e222] [cursor=pointer]
            - button "Posters from $19" [ref=e223] [cursor=pointer]
        - generic [ref=e227]:
          - generic [ref=e228]:
            - img [ref=e229]
            - paragraph [ref=e231]: The Thank You Project
          - heading "Be Part of the Story" [level=2] [ref=e232]
          - paragraph [ref=e233]: Every contribution fuels independent music, supports healing, and builds a community where stories matter. 10% of all support goes to 1800RESPECT. Join the Thank You Project today.
          - generic [ref=e234]:
            - link "Donate From $5" [ref=e235]:
              - /url: /back-this
              - generic [ref=e236]:
                - img [ref=e237]
                - paragraph [ref=e239]: Donate
                - paragraph [ref=e240]: From $5
            - link "Join Free" [ref=e241]:
              - /url: /community
              - generic [ref=e242]:
                - img [ref=e243]
                - paragraph [ref=e248]: Join
                - paragraph [ref=e249]: Free
            - link "Shop Merch" [ref=e250]:
              - /url: /store
              - generic [ref=e251]:
                - img [ref=e252]
                - paragraph [ref=e255]: Shop
                - paragraph [ref=e256]: Merch
            - link "Follow Socials" [ref=e257]:
              - /url: https://www.instagram.com/gann0nwaye
              - generic [ref=e258]:
                - img [ref=e259]
                - paragraph [ref=e265]: Follow
                - paragraph [ref=e266]: Socials
          - generic [ref=e267]:
            - link "Support the Project" [ref=e268]:
              - /url: /back-this
              - button "Support the Project" [ref=e269] [cursor=pointer]:
                - img
                - text: Support the Project
            - link "Listen to Music" [ref=e270]:
              - /url: /music
              - button "Listen to Music" [ref=e271] [cursor=pointer]:
                - img
                - text: Listen to Music
        - generic [ref=e274]:
          - img [ref=e275]
          - paragraph [ref=e278]: Stay Connected
          - heading "Join the Inner Circle" [level=2] [ref=e279]
          - paragraph [ref=e280]: Be the first to hear about new music, behind-the-scenes stories, and exclusive updates.
          - button "Sign up today & get a gift from me" [ref=e281] [cursor=pointer]:
            - img [ref=e282]
            - generic [ref=e286]: Sign up today & get a gift from me
            - img [ref=e287]
          - generic [ref=e292]:
            - textbox "Your full name *" [ref=e294]
            - textbox "Email address *" [ref=e296]
            - button "Continue →" [ref=e297] [cursor=pointer]
        - generic [ref=e301]:
          - img [ref=e303]
          - paragraph [ref=e305]: A Safe Space
          - heading "You Are Not Alone" [level=2] [ref=e306]
          - paragraph [ref=e307]: This space was built for anyone who has ever felt unseen, misunderstood, or too much for the world around them. Whether you're here for the music, for the message, or because something in a lyric hit a little too close to home, you belong here.
          - paragraph [ref=e308]: No judgement. No noise. Just connection.
          - link "Join the Community" [ref=e310]:
            - /url: /community
            - button "Join the Community" [ref=e311] [cursor=pointer]:
              - text: Join the Community
              - img
          - generic [ref=e312]:
            - paragraph [ref=e313]: If you need support right now
            - paragraph [ref=e314]:
              - text: Australia · Lifeline
              - link "13 11 14" [ref=e315]:
                - /url: tel:131114
              - text: · 1800RESPECT
              - link "1800 737 732" [ref=e316]:
                - /url: tel:1800737732
              - text: · Beyond Blue
              - link "1300 22 4636" [ref=e317]:
                - /url: tel:1300224636
    - contentinfo [ref=e318]:
      - generic [ref=e319]:
        - generic [ref=e320]:
          - generic [ref=e321]:
            - generic [ref=e323]: GW
            - paragraph [ref=e324]: Australian singer-songwriter crafting honest stories through melody and verse.
          - generic [ref=e325]:
            - heading "Navigate" [level=4] [ref=e326]
            - generic [ref=e327]:
              - link "Home" [ref=e328]:
                - /url: /
              - link "Music" [ref=e329]:
                - /url: /music
              - link "Lyrics" [ref=e330]:
                - /url: /lyrics
              - link "Store" [ref=e331]:
                - /url: /store
              - link "Press" [ref=e332]:
                - /url: /press
              - link "Subscribe 🤍" [ref=e333]:
                - /url: /back-this
              - link "Community" [ref=e334]:
                - /url: /community
              - link "Biography" [ref=e335]:
                - /url: /biography
              - link "Lyric Library" [ref=e336]:
                - /url: /lyric-library
              - link "Mixing Services" [ref=e337]:
                - /url: /mixing-services
              - link "Gift Cards" [ref=e338]:
                - /url: /gift-cards
              - link "Mum Tribute" [ref=e339]:
                - /url: /remember-mum
              - link "Systems Manager" [ref=e340]:
                - /url: /systems-manager
              - link "Contact" [ref=e341]:
                - /url: /contact
          - generic [ref=e342]:
            - heading "Contact" [level=4] [ref=e343]
            - paragraph [ref=e344]: For press, management & enquiries
            - link "gannonwayemusic@gmail.com" [ref=e345]:
              - /url: mailto:gannonwayemusic@gmail.com
            - heading "Legal" [level=4] [ref=e346]
            - generic [ref=e347]:
              - link "Privacy Policy" [ref=e348]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e349]:
                - /url: /terms-of-service
              - link "Contact Gannon" [ref=e350]:
                - /url: /contact
            - heading "Social" [level=4] [ref=e351]
            - generic [ref=e352]:
              - link "Instagram @gann0nwaye" [ref=e353]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e354]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e355]:
                - /url: https://www.youtube.com/@gannonwayeofficial
        - generic [ref=e356]:
          - paragraph [ref=e357]: Stay in the loop
          - heading "New music & community updates" [level=3] [ref=e358]
          - generic [ref=e359]:
            - textbox "Your name *" [ref=e360]
            - textbox "your@email.com *" [ref=e361]
            - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e362]
            - textbox "Birthday (optional — we'll send you something special)" [ref=e363]
            - paragraph [ref=e364]: Birthday optional — we'll send you something special 🎂
            - combobox [ref=e365]:
              - option "How did you find me? *" [selected]
              - option "Google"
              - option "Instagram"
              - option "Facebook"
              - option "TikTok"
              - option "X (Twitter)"
              - option "Friend / Word of Mouth"
              - option "I know Gannon"
              - option "Other"
            - button "Subscribe" [ref=e366] [cursor=pointer]
        - paragraph [ref=e368]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
        - generic [ref=e369]:
          - generic [ref=e370]:
            - img "GW Heart" [ref=e371]
            - link "Support the project 🤍" [ref=e372]:
              - /url: /back-this
            - img "GW Heart" [ref=e373]
          - paragraph [ref=e374]: © 2026 Gannon Waye. All rights reserved.
    - generic [ref=e375]:
      - img [ref=e376]
      - paragraph [ref=e378]: 🎵Music approved for public sharing appears on the Music page
      - button "Dismiss" [ref=e379] [cursor=pointer]:
        - img [ref=e380]
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
> 36 |     await page.goto(`${BASE_URL}/store`);
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
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
  84 |       await cartBtn.click();
  85 |       await page.waitForTimeout(300);
  86 |     }
  87 | 
  88 |     const scrollAfter = await page.evaluate(() => window.scrollY);
  89 |     // Scroll should not have reset to 0
  90 |     expect(scrollAfter).toBe(scrollBefore);
  91 |   });
  92 | });
```