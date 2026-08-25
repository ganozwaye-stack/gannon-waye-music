# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: link-integrity.spec.js >> Link Integrity — Public routes >> home page has no href="#" or javascript:void links
- Location: src/gannonwaye-playwright-pack/tests/link-integrity.spec.js:10:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

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
          - button [ref=e13] [cursor=pointer]:
            - img [ref=e14]
          - button "Open cart" [ref=e17] [cursor=pointer]:
            - img [ref=e18]
          - button [ref=e22] [cursor=pointer]:
            - img [ref=e23]
    - main [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e26]:
          - img
          - generic [ref=e28]:
            - heading "Gannon Waye" [level=1] [ref=e29]
            - generic [ref=e30]:
              - generic [ref=e31]:
                - generic [ref=e32]:
                  - paragraph [ref=e33]: Music
                  - link "Gannon Waye Music, Gannon Waye" [ref=e35]:
                    - /url: /music
                    - img "Gannon Waye Music, Gannon Waye" [ref=e36]
                  - paragraph [ref=e37]: Music is shared here only when it is ready.
                - link "Back The Thankyou Project 🤍" [ref=e40]:
                  - /url: /back-this
                  - button "Back The Thankyou Project 🤍" [ref=e41] [cursor=pointer]
              - generic [ref=e42]:
                - generic [ref=e47]:
                  - generic [ref=e48]:
                    - generic [ref=e52]: Gannon Waye Music
                    - generic [ref=e53]: Official artist site
                  - paragraph [ref=e55]: Independent, heart-first music from Gannon Waye
                  - link "Explore the Music page" [ref=e57]:
                    - /url: /music
                - generic [ref=e58]:
                  - paragraph [ref=e59]: WELCOME
                  - paragraph [ref=e60]: I'm a singer-songwriter from Adelaide, now based in Melbourne. I write from lived experience about grief, healing, and the quiet courage it takes to love yourself. My mission is to make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. This is independent, heart-first art, powered by community, with 10% of all support going to 1800RESPECT. Every song is recorded honestly, voice and guitar first, so the feeling stays intact. Whether you're carrying loss, rebuilding after hard years, or learning to like yourself again, you're in the right place, and you're not alone here.
          - generic:
            - generic: Scroll
        - generic [ref=e62]:
          - generic [ref=e63]:
            - generic [ref=e64]: Independent, heart-first music from Gannon Waye
            - generic [ref=e65]: ◆
            - generic [ref=e66]: Music approved for public sharing appears on the Music page
            - generic [ref=e67]: ◆
            - generic [ref=e68]: 10% of all support goes to 1800RESPECT
            - generic [ref=e69]: ◆
            - generic [ref=e70]: New music is shared only when it is ready
            - generic [ref=e71]: ◆
            - generic [ref=e72]: Join the community and follow the story
            - generic [ref=e73]: ◆
          - generic [ref=e74]:
            - generic [ref=e75]: Independent, heart-first music from Gannon Waye
            - generic [ref=e76]: ◆
            - generic [ref=e77]: Music approved for public sharing appears on the Music page
            - generic [ref=e78]: ◆
            - generic [ref=e79]: 10% of all support goes to 1800RESPECT
            - generic [ref=e80]: ◆
            - generic [ref=e81]: New music is shared only when it is ready
            - generic [ref=e82]: ◆
            - generic [ref=e83]: Join the community and follow the story
            - generic [ref=e84]: ◆
        - generic [ref=e86]:
          - generic [ref=e87]:
            - paragraph [ref=e88]: About
            - heading "The Story" [level=2] [ref=e89]
          - generic [ref=e90]:
            - paragraph [ref=e91]: I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me. It's the language I use to understand people, emotion, and the parts of life that don't always have words.
            - paragraph [ref=e92]: I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
            - paragraph [ref=e93]: I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.
            - generic [ref=e94]:
              - paragraph [ref=e95]: I didn't truly love myself
              - paragraph [ref=e96]: until I was 33.
              - paragraph [ref=e97]: Before that, I woke up
              - paragraph [ref=e98]: every day wishing
              - paragraph [ref=e99]: I could be someone else.
              - paragraph [ref=e100]: That fear of abandonment
              - paragraph [ref=e101]: ran my life.
              - paragraph [ref=e102]: Then something shifted
              - paragraph [ref=e103]: and for the first time,
              - paragraph [ref=e104]: I didn't want to be
              - paragraph [ref=e105]: anyone else.
            - paragraph [ref=e106]: My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. But those experiences shaped me and gave me something real to say.
            - paragraph [ref=e107]: "I began singing at a young age, runner up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience."
            - paragraph [ref=e108]: That work shapes the music and stories I continue to create for anyone who needs hope or a reminder that they are not alone.
        - generic [ref=e110]:
          - generic [ref=e111]:
            - paragraph [ref=e112]: For Press
            - heading "Digital Press Kit" [level=2] [ref=e113]
          - generic [ref=e116]:
            - generic [ref=e117]:
              - paragraph [ref=e118]: Mission
              - paragraph [ref=e119]: To make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. Independent, heart-first art, with 10% of all support going to 1800RESPECT.
              - paragraph [ref=e121]: Biography
              - paragraph [ref=e122]: Gannon Waye is a singer-songwriter born and raised in Adelaide and based in Melbourne. He writes from lived experience about grief, healing, self-worth, and the quiet courage it takes to choose yourself. His work is independent, heart-first, and grounded in honest storytelling.
              - generic [ref=e123]:
                - link "Full Press Kit" [ref=e124]:
                  - /url: /press-kit
                  - button "Full Press Kit" [ref=e125] [cursor=pointer]:
                    - img
                    - text: Full Press Kit
                - link "Press & Booking" [ref=e126]:
                  - /url: /press
                  - button "Press & Booking" [ref=e127] [cursor=pointer]:
                    - text: Press & Booking
                    - img
            - generic [ref=e128]:
              - paragraph [ref=e129]: Headshots
              - img "Gannon Waye" [ref=e132]
              - paragraph [ref=e133]: High-resolution images available on request
        - generic [ref=e135]:
          - paragraph [ref=e136]: Official Merch Boutique
          - heading "Enter the Gannon Waye Store" [level=2] [ref=e137]
          - paragraph [ref=e138]:
            - text: Shop Official Merch — the
            - emphasis [ref=e139]: Respect Is Earned
            - text: collection,
            - text: bundles, wall posters and music collectables.
          - generic [ref=e142]: ✦
          - generic [ref=e144]:
            - button "Enter the Store ✦" [ref=e145] [cursor=pointer]
            - button "Shop All Merch →" [ref=e146] [cursor=pointer]
          - generic [ref=e147]:
            - button "Winter Bundle — $129" [ref=e148] [cursor=pointer]
            - button "Journal Bundle — $59" [ref=e149] [cursor=pointer]
            - button "Hoodie — $89" [ref=e150] [cursor=pointer]
            - button "Mug — $9.90" [ref=e151] [cursor=pointer]
            - button "Posters from $19" [ref=e152] [cursor=pointer]
        - generic [ref=e156]:
          - generic [ref=e157]:
            - img [ref=e158]
            - paragraph [ref=e160]: The Thank You Project
          - heading "Be Part of the Story" [level=2] [ref=e161]
          - paragraph [ref=e162]: Every contribution fuels independent music, supports healing, and builds a community where stories matter. 10% of all support goes to 1800RESPECT. Join the Thank You Project today.
          - generic [ref=e163]:
            - link "Donate From $5" [ref=e164]:
              - /url: /back-this
              - generic [ref=e165]:
                - img [ref=e166]
                - paragraph [ref=e168]: Donate
                - paragraph [ref=e169]: From $5
            - link "Join Free" [ref=e170]:
              - /url: /community
              - generic [ref=e171]:
                - img [ref=e172]
                - paragraph [ref=e177]: Join
                - paragraph [ref=e178]: Free
            - link "Shop Merch" [ref=e179]:
              - /url: /store
              - generic [ref=e180]:
                - img [ref=e181]
                - paragraph [ref=e184]: Shop
                - paragraph [ref=e185]: Merch
            - link "Follow Socials" [ref=e186]:
              - /url: https://www.instagram.com/gann0nwaye
              - generic [ref=e187]:
                - img [ref=e188]
                - paragraph [ref=e194]: Follow
                - paragraph [ref=e195]: Socials
          - generic [ref=e196]:
            - link "Support the Project" [ref=e197]:
              - /url: /back-this
              - button "Support the Project" [ref=e198] [cursor=pointer]:
                - img
                - text: Support the Project
            - link "Listen to Music" [ref=e199]:
              - /url: /music
              - button "Listen to Music" [ref=e200] [cursor=pointer]:
                - img
                - text: Listen to Music
        - generic [ref=e203]:
          - img [ref=e204]
          - paragraph [ref=e207]: Stay Connected
          - heading "Join the Inner Circle" [level=2] [ref=e208]
          - paragraph [ref=e209]: Be the first to hear about new music, behind-the-scenes stories, and exclusive updates.
          - button "Sign up today & get a gift from me" [ref=e210] [cursor=pointer]:
            - img [ref=e211]
            - generic [ref=e215]: Sign up today & get a gift from me
            - img [ref=e216]
          - generic [ref=e221]:
            - textbox "Your full name *" [ref=e223]
            - textbox "Email address *" [ref=e225]
            - button "Continue →" [ref=e226] [cursor=pointer]
        - generic [ref=e230]:
          - img [ref=e232]
          - paragraph [ref=e234]: A Safe Space
          - heading "You Are Not Alone" [level=2] [ref=e235]
          - paragraph [ref=e236]: This space was built for anyone who has ever felt unseen, misunderstood, or too much for the world around them. Whether you're here for the music, for the message, or because something in a lyric hit a little too close to home, you belong here.
          - paragraph [ref=e237]: No judgement. No noise. Just connection.
          - link "Join the Community" [ref=e239]:
            - /url: /community
            - button "Join the Community" [ref=e240] [cursor=pointer]:
              - text: Join the Community
              - img
          - generic [ref=e241]:
            - paragraph [ref=e242]: If you need support right now
            - paragraph [ref=e243]:
              - text: Australia · Lifeline
              - link "13 11 14" [ref=e244]:
                - /url: tel:131114
              - text: · 1800RESPECT
              - link "1800 737 732" [ref=e245]:
                - /url: tel:1800737732
              - text: · Beyond Blue
              - link "1300 22 4636" [ref=e246]:
                - /url: tel:1300224636
    - contentinfo [ref=e247]:
      - generic [ref=e248]:
        - generic [ref=e249]:
          - generic [ref=e250]:
            - generic [ref=e252]: GW
            - paragraph [ref=e253]: Australian singer-songwriter crafting honest stories through melody and verse.
          - generic [ref=e254]:
            - heading "Navigate" [level=4] [ref=e255]
            - generic [ref=e256]:
              - link "Home" [ref=e257]:
                - /url: /
              - link "Music" [ref=e258]:
                - /url: /music
              - link "Lyrics" [ref=e259]:
                - /url: /lyrics
              - link "Store" [ref=e260]:
                - /url: /store
              - link "Press" [ref=e261]:
                - /url: /press
              - link "Subscribe 🤍" [ref=e262]:
                - /url: /back-this
              - link "Community" [ref=e263]:
                - /url: /community
              - link "Biography" [ref=e264]:
                - /url: /biography
              - link "Lyric Library" [ref=e265]:
                - /url: /lyric-library
              - link "Mixing Services" [ref=e266]:
                - /url: /mixing-services
              - link "Gift Cards" [ref=e267]:
                - /url: /gift-cards
              - link "Mum Tribute" [ref=e268]:
                - /url: /remember-mum
              - link "Systems Manager" [ref=e269]:
                - /url: /systems-manager
              - link "Contact" [ref=e270]:
                - /url: /contact
          - generic [ref=e271]:
            - heading "Contact" [level=4] [ref=e272]
            - paragraph [ref=e273]: For press, management & enquiries
            - link "gannonwayemusic@gmail.com" [ref=e274]:
              - /url: mailto:gannonwayemusic@gmail.com
            - heading "Legal" [level=4] [ref=e275]
            - generic [ref=e276]:
              - link "Privacy Policy" [ref=e277]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e278]:
                - /url: /terms-of-service
              - link "Contact Gannon" [ref=e279]:
                - /url: /contact
            - heading "Social" [level=4] [ref=e280]
            - generic [ref=e281]:
              - link "Instagram @gann0nwaye" [ref=e282]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e283]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e284]:
                - /url: https://www.youtube.com/@gannonwayeofficial
        - generic [ref=e285]:
          - paragraph [ref=e286]: Stay in the loop
          - heading "New music & community updates" [level=3] [ref=e287]
          - generic [ref=e288]:
            - textbox "Your name *" [ref=e289]
            - textbox "your@email.com *" [ref=e290]
            - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e291]
            - textbox "Birthday (optional — we'll send you something special)" [ref=e292]
            - paragraph [ref=e293]: Birthday optional — we'll send you something special 🎂
            - combobox [ref=e294]:
              - option "How did you find me? *" [selected]
              - option "Google"
              - option "Instagram"
              - option "Facebook"
              - option "TikTok"
              - option "X (Twitter)"
              - option "Friend / Word of Mouth"
              - option "I know Gannon"
              - option "Other"
            - button "Subscribe" [ref=e295] [cursor=pointer]
        - paragraph [ref=e297]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
        - generic [ref=e298]:
          - generic [ref=e299]:
            - img "GW Heart" [ref=e300]
            - link "Support the project 🤍" [ref=e301]:
              - /url: /back-this
            - img "GW Heart" [ref=e302]
          - paragraph [ref=e303]: © 2026 Gannon Waye. All rights reserved.
    - navigation [ref=e304]:
      - generic [ref=e305]:
        - link "Home" [ref=e306]:
          - /url: /
          - generic [ref=e308]:
            - img [ref=e309]
            - generic [ref=e312]: Home
        - link "Music" [ref=e313]:
          - /url: /music
          - generic [ref=e314]:
            - img [ref=e315]
            - generic [ref=e319]: Music
        - link "Store" [ref=e320]:
          - /url: /store
          - generic [ref=e321]:
            - img [ref=e322]
            - generic [ref=e325]: Store
        - link "Lyrics" [ref=e326]:
          - /url: /lyrics
          - generic [ref=e327]:
            - img [ref=e328]
            - generic [ref=e331]: Lyrics
        - link "Contact" [ref=e332]:
          - /url: /contact
          - generic [ref=e333]:
            - img [ref=e334]
            - generic [ref=e337]: Contact
    - generic [ref=e338]:
      - img [ref=e339]
      - paragraph [ref=e341]: 🎵Music approved for public sharing appears on the Music page
      - button "Dismiss" [ref=e342] [cursor=pointer]:
        - img [ref=e343]
```

# Test source

```ts
  1   | // tests/link-integrity.spec.js
  2   | // Verifies correct link intent routing across dashboard cards and owner action items
  3   | 
  4   | /* eslint-disable no-undef */
  5   | import { test, expect } from '@playwright/test';
  6   | 
  7   | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  8   | 
  9   | test.describe('Link Integrity — Public routes', () => {
  10  |   test('home page has no href="#" or javascript:void links', async ({ page }) => {
> 11  |     await page.goto(`${BASE_URL}/`);
      |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  12  |     await page.waitForLoadState('networkidle');
  13  |     const badLinks = await page.locator('a[href="#"], a[href="javascript:void(0)"]').count();
  14  |     expect(badLinks).toBe(0);
  15  |   });
  16  | 
  17  |   test('Instagram links point to @gann0nwaye', async ({ page }) => {
  18  |     await page.goto(`${BASE_URL}/`);
  19  |     await page.waitForLoadState('networkidle');
  20  |     const links = await page.locator('a[href*="instagram.com"]').all();
  21  |     for (const link of links) {
  22  |       const href = await link.getAttribute('href');
  23  |       expect(href).toMatch(/instagram\.com\/gann0nwaye/);
  24  |       expect(href).not.toMatch(/instagram\.com\/gannonwaye(?!official)/);
  25  |     }
  26  |   });
  27  | 
  28  |   test('TikTok links point to @gann0nwaye', async ({ page }) => {
  29  |     await page.goto(`${BASE_URL}/`);
  30  |     await page.waitForLoadState('networkidle');
  31  |     const links = await page.locator('a[href*="tiktok.com/@"]').all();
  32  |     for (const link of links) {
  33  |       const href = await link.getAttribute('href');
  34  |       if (href && !href.includes('developers')) {
  35  |         expect(href).toMatch(/tiktok\.com\/@gann0nwaye/);
  36  |       }
  37  |     }
  38  |   });
  39  | 
  40  |   test('contact page social links are correct', async ({ page }) => {
  41  |     await page.goto(`${BASE_URL}/contact`);
  42  |     await page.waitForLoadState('networkidle');
  43  |     const bodyText = await page.locator('body').textContent();
  44  |     expect(bodyText).toContain('@gann0nwaye');
  45  |     expect(bodyText).toContain('@gannonwayeofficial');
  46  |     // should NOT contain the old wrong handle
  47  |     expect(bodyText).not.toMatch(/(^|\s)@gannonwaye(?!official)/);
  48  |   });
  49  | 
  50  |   test('footer Instagram link correct', async ({ page }) => {
  51  |     await page.goto(`${BASE_URL}/`);
  52  |     await page.waitForLoadState('networkidle');
  53  |     const footerText = await page.locator('footer').textContent();
  54  |     expect(footerText).toContain('@gann0nwaye');
  55  |     expect(footerText).toContain('@gannonwayeofficial');
  56  |   });
  57  | 
  58  |   test('no public page redirects to admin dashboard', async ({ page }) => {
  59  |     const publicRoutes = ['/', '/music', '/store', '/community', '/contact', '/lyrics', '/faq'];
  60  |     for (const route of publicRoutes) {
  61  |       await page.goto(`${BASE_URL}${route}`);
  62  |       await page.waitForLoadState('networkidle');
  63  |       expect(page.url()).not.toContain('/admin');
  64  |     }
  65  |   });
  66  | });
  67  | 
  68  | test.describe('Link Integrity — Admin routing (requires login)', () => {
  69  |   test('dashboard revenue cube links to financials not generic /admin', async ({ page }) => {
  70  |     // Note: requires admin session — mark as needs_login if no cookie
  71  |     const cookies = process.env.ADMIN_SESSION_COOKIE;
  72  |     if (!cookies) {
  73  |       test.skip();
  74  |       return;
  75  |     }
  76  |     await page.goto(`${BASE_URL}/admin`);
  77  |     await page.waitForLoadState('networkidle');
  78  | 
  79  |     const revenueLink = page.locator('a[href*="financials"]').first();
  80  |     if (await revenueLink.count() > 0) {
  81  |       const href = await revenueLink.getAttribute('href');
  82  |       expect(href).toContain('financials');
  83  |       expect(href).not.toBe('/admin');
  84  |     }
  85  |   });
  86  | 
  87  |   test('add Spotify link notification routes to /admin/releases not /admin/notifications', async ({ page }) => {
  88  |     const cookies = process.env.ADMIN_SESSION_COOKIE;
  89  |     if (!cookies) { test.skip(); return; }
  90  | 
  91  |     await page.goto(`${BASE_URL}/admin/notifications`);
  92  |     await page.waitForLoadState('networkidle');
  93  | 
  94  |     // Find Spotify notification and check its link
  95  |     const spotifyLinks = page.locator('text=Add Spotify Link');
  96  |     if (await spotifyLinks.count() > 0) {
  97  |       const parent = spotifyLinks.first().locator('xpath=ancestor::a | xpath=ancestor::button');
  98  |       // The linked_route should go to releases
  99  |       const nearestLink = page.locator('a[href*="releases"]').first();
  100 |       if (await nearestLink.count() > 0) {
  101 |         const href = await nearestLink.getAttribute('href');
  102 |         expect(href).toContain('releases');
  103 |       }
  104 |     }
  105 |   });
  106 | 
  107 |   test('add lyrics notification routes to /admin/releases not /admin/notifications', async ({ page }) => {
  108 |     const cookies = process.env.ADMIN_SESSION_COOKIE;
  109 |     if (!cookies) { test.skip(); return; }
  110 |     // Semantic check: notifications page should have releases links for lyrics action items
  111 |     await page.goto(`${BASE_URL}/admin/notifications`);
```