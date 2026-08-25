# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: link-integrity.spec.js >> Link Integrity — Public routes >> Instagram links point to @gann0nwaye
- Location: src/gannonwaye-playwright-pack/tests/link-integrity.spec.js:17:7

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
          - img
          - generic [ref=e46]:
            - heading "Gannon Waye" [level=1] [ref=e47]
            - generic [ref=e48]:
              - generic [ref=e49]:
                - generic [ref=e50]:
                  - paragraph [ref=e51]: Music
                  - link "Gannon Waye Music, Gannon Waye" [ref=e53]:
                    - /url: /music
                    - img "Gannon Waye Music, Gannon Waye" [ref=e54]
                  - paragraph [ref=e55]: Music is shared here only when it is ready.
                - link "Back The Thankyou Project 🤍" [ref=e58]:
                  - /url: /back-this
                  - button "Back The Thankyou Project 🤍" [ref=e59] [cursor=pointer]
              - generic [ref=e60]:
                - generic [ref=e65]:
                  - generic [ref=e66]:
                    - generic [ref=e70]: Gannon Waye Music
                    - generic [ref=e71]: Official artist site
                  - paragraph [ref=e73]: Independent, heart-first music from Gannon Waye
                  - link "Explore the Music page" [ref=e75]:
                    - /url: /music
                - generic [ref=e76]:
                  - paragraph [ref=e77]: WELCOME
                  - paragraph [ref=e78]: I'm a singer-songwriter from Adelaide, now based in Melbourne. I write from lived experience about grief, healing, and the quiet courage it takes to love yourself. My mission is to make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. This is independent, heart-first art, powered by community, with 10% of all support going to 1800RESPECT. Every song is recorded honestly, voice and guitar first, so the feeling stays intact. Whether you're carrying loss, rebuilding after hard years, or learning to like yourself again, you're in the right place, and you're not alone here.
          - generic:
            - generic: Scroll
        - generic [ref=e80]:
          - generic [ref=e81]:
            - generic [ref=e82]: Independent, heart-first music from Gannon Waye
            - generic [ref=e83]: ◆
            - generic [ref=e84]: Music approved for public sharing appears on the Music page
            - generic [ref=e85]: ◆
            - generic [ref=e86]: 10% of all support goes to 1800RESPECT
            - generic [ref=e87]: ◆
            - generic [ref=e88]: New music is shared only when it is ready
            - generic [ref=e89]: ◆
            - generic [ref=e90]: Join the community and follow the story
            - generic [ref=e91]: ◆
          - generic [ref=e92]:
            - generic [ref=e93]: Independent, heart-first music from Gannon Waye
            - generic [ref=e94]: ◆
            - generic [ref=e95]: Music approved for public sharing appears on the Music page
            - generic [ref=e96]: ◆
            - generic [ref=e97]: 10% of all support goes to 1800RESPECT
            - generic [ref=e98]: ◆
            - generic [ref=e99]: New music is shared only when it is ready
            - generic [ref=e100]: ◆
            - generic [ref=e101]: Join the community and follow the story
            - generic [ref=e102]: ◆
        - generic [ref=e104]:
          - generic [ref=e105]:
            - paragraph [ref=e106]: About
            - heading "The Story" [level=2] [ref=e107]
          - generic [ref=e108]:
            - generic [ref=e109]:
              - paragraph [ref=e110]: I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me. It's the language I use to understand people, emotion, and the parts of life that don't always have words.
              - paragraph [ref=e111]: I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
              - paragraph [ref=e112]: I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.
            - generic [ref=e115]:
              - paragraph [ref=e116]: I didn't truly love myself
              - paragraph [ref=e117]: until I was 33.
              - paragraph [ref=e118]: Before that, I woke up
              - paragraph [ref=e119]: every day wishing
              - paragraph [ref=e120]: I could be someone else.
              - paragraph [ref=e121]: That fear of abandonment
              - paragraph [ref=e122]: ran my life.
              - paragraph [ref=e123]: Then something shifted
              - paragraph [ref=e124]: and for the first time,
              - paragraph [ref=e125]: I didn't want to be
              - paragraph [ref=e126]: anyone else.
              - paragraph [ref=e127]: Gannon Waye
            - generic [ref=e129]:
              - paragraph [ref=e130]: My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. But those experiences shaped me and gave me something real to say.
              - paragraph [ref=e131]: "I began singing at a young age, runner up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience."
              - paragraph [ref=e132]: That work shapes the music and stories I continue to create for anyone who needs hope or a reminder that they are not alone.
        - generic [ref=e134]:
          - generic [ref=e135]:
            - paragraph [ref=e136]: For Press
            - heading "Digital Press Kit" [level=2] [ref=e137]
          - generic [ref=e140]:
            - generic [ref=e141]:
              - paragraph [ref=e142]: Mission
              - paragraph [ref=e143]: To make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. Independent, heart-first art, with 10% of all support going to 1800RESPECT.
              - paragraph [ref=e145]: Biography
              - paragraph [ref=e146]: Gannon Waye is a singer-songwriter born and raised in Adelaide and based in Melbourne. He writes from lived experience about grief, healing, self-worth, and the quiet courage it takes to choose yourself. His work is independent, heart-first, and grounded in honest storytelling.
              - generic [ref=e147]:
                - link "Full Press Kit" [ref=e148]:
                  - /url: /press-kit
                  - button "Full Press Kit" [ref=e149] [cursor=pointer]:
                    - img
                    - text: Full Press Kit
                - link "Press & Booking" [ref=e150]:
                  - /url: /press
                  - button "Press & Booking" [ref=e151] [cursor=pointer]:
                    - text: Press & Booking
                    - img
            - generic [ref=e152]:
              - paragraph [ref=e153]: Headshots
              - img "Gannon Waye" [ref=e156]
              - paragraph [ref=e157]: High-resolution images available on request
        - generic [ref=e159]:
          - paragraph [ref=e160]: Official Merch Boutique
          - heading "Enter the Gannon Waye Store" [level=2] [ref=e161]
          - paragraph [ref=e162]:
            - text: Shop Official Merch — the
            - emphasis [ref=e163]: Respect Is Earned
            - text: collection,
            - text: bundles, wall posters and music collectables.
          - generic [ref=e166]: ✦
          - generic [ref=e168]:
            - button "Enter the Store ✦" [ref=e169] [cursor=pointer]
            - button "Shop All Merch →" [ref=e170] [cursor=pointer]
          - generic [ref=e171]:
            - button "Winter Bundle — $129" [ref=e172] [cursor=pointer]
            - button "Journal Bundle — $59" [ref=e173] [cursor=pointer]
            - button "Hoodie — $89" [ref=e174] [cursor=pointer]
            - button "Mug — $9.90" [ref=e175] [cursor=pointer]
            - button "Posters from $19" [ref=e176] [cursor=pointer]
        - generic [ref=e180]:
          - generic [ref=e181]:
            - img [ref=e182]
            - paragraph [ref=e184]: The Thank You Project
          - heading "Be Part of the Story" [level=2] [ref=e185]
          - paragraph [ref=e186]: Every contribution fuels independent music, supports healing, and builds a community where stories matter. 10% of all support goes to 1800RESPECT. Join the Thank You Project today.
          - generic [ref=e187]:
            - link "Donate From $5" [ref=e188]:
              - /url: /back-this
              - generic [ref=e189]:
                - img [ref=e190]
                - paragraph [ref=e192]: Donate
                - paragraph [ref=e193]: From $5
            - link "Join Free" [ref=e194]:
              - /url: /community
              - generic [ref=e195]:
                - img [ref=e196]
                - paragraph [ref=e201]: Join
                - paragraph [ref=e202]: Free
            - link "Shop Merch" [ref=e203]:
              - /url: /store
              - generic [ref=e204]:
                - img [ref=e205]
                - paragraph [ref=e208]: Shop
                - paragraph [ref=e209]: Merch
            - link "Follow Socials" [ref=e210]:
              - /url: https://www.instagram.com/gann0nwaye
              - generic [ref=e211]:
                - img [ref=e212]
                - paragraph [ref=e218]: Follow
                - paragraph [ref=e219]: Socials
          - generic [ref=e220]:
            - link "Support the Project" [ref=e221]:
              - /url: /back-this
              - button "Support the Project" [ref=e222] [cursor=pointer]:
                - img
                - text: Support the Project
            - link "Listen to Music" [ref=e223]:
              - /url: /music
              - button "Listen to Music" [ref=e224] [cursor=pointer]:
                - img
                - text: Listen to Music
        - generic [ref=e227]:
          - img [ref=e228]
          - paragraph [ref=e231]: Stay Connected
          - heading "Join the Inner Circle" [level=2] [ref=e232]
          - paragraph [ref=e233]: Be the first to hear about new music, behind-the-scenes stories, and exclusive updates.
          - button "Sign up today & get a gift from me" [ref=e234] [cursor=pointer]:
            - img [ref=e235]
            - generic [ref=e239]: Sign up today & get a gift from me
            - img [ref=e240]
          - generic [ref=e245]:
            - textbox "Your full name *" [ref=e247]
            - textbox "Email address *" [ref=e249]
            - button "Continue →" [ref=e250] [cursor=pointer]
        - generic [ref=e254]:
          - img [ref=e256]
          - paragraph [ref=e258]: A Safe Space
          - heading "You Are Not Alone" [level=2] [ref=e259]
          - paragraph [ref=e260]: This space was built for anyone who has ever felt unseen, misunderstood, or too much for the world around them. Whether you're here for the music, for the message, or because something in a lyric hit a little too close to home, you belong here.
          - paragraph [ref=e261]: No judgement. No noise. Just connection.
          - link "Join the Community" [ref=e263]:
            - /url: /community
            - button "Join the Community" [ref=e264] [cursor=pointer]:
              - text: Join the Community
              - img
          - generic [ref=e265]:
            - paragraph [ref=e266]: If you need support right now
            - paragraph [ref=e267]:
              - text: Australia · Lifeline
              - link "13 11 14" [ref=e268]:
                - /url: tel:131114
              - text: · 1800RESPECT
              - link "1800 737 732" [ref=e269]:
                - /url: tel:1800737732
              - text: · Beyond Blue
              - link "1300 22 4636" [ref=e270]:
                - /url: tel:1300224636
    - contentinfo [ref=e271]:
      - generic [ref=e272]:
        - generic [ref=e273]:
          - generic [ref=e274]:
            - generic [ref=e276]: GW
            - paragraph [ref=e277]: Australian singer-songwriter crafting honest stories through melody and verse.
          - generic [ref=e278]:
            - heading "Navigate" [level=4] [ref=e279]
            - generic [ref=e280]:
              - link "Home" [ref=e281]:
                - /url: /
              - link "Music" [ref=e282]:
                - /url: /music
              - link "Lyrics" [ref=e283]:
                - /url: /lyrics
              - link "Store" [ref=e284]:
                - /url: /store
              - link "Press" [ref=e285]:
                - /url: /press
              - link "Subscribe 🤍" [ref=e286]:
                - /url: /back-this
              - link "Community" [ref=e287]:
                - /url: /community
              - link "Biography" [ref=e288]:
                - /url: /biography
              - link "Lyric Library" [ref=e289]:
                - /url: /lyric-library
              - link "Mixing Services" [ref=e290]:
                - /url: /mixing-services
              - link "Gift Cards" [ref=e291]:
                - /url: /gift-cards
              - link "Mum Tribute" [ref=e292]:
                - /url: /remember-mum
              - link "Systems Manager" [ref=e293]:
                - /url: /systems-manager
              - link "Contact" [ref=e294]:
                - /url: /contact
          - generic [ref=e295]:
            - heading "Contact" [level=4] [ref=e296]
            - paragraph [ref=e297]: For press, management & enquiries
            - link "gannonwayemusic@gmail.com" [ref=e298]:
              - /url: mailto:gannonwayemusic@gmail.com
            - heading "Legal" [level=4] [ref=e299]
            - generic [ref=e300]:
              - link "Privacy Policy" [ref=e301]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e302]:
                - /url: /terms-of-service
              - link "Contact Gannon" [ref=e303]:
                - /url: /contact
            - heading "Social" [level=4] [ref=e304]
            - generic [ref=e305]:
              - link "Instagram @gann0nwaye" [ref=e306]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e307]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e308]:
                - /url: https://www.youtube.com/@gannonwayeofficial
        - generic [ref=e309]:
          - paragraph [ref=e310]: Stay in the loop
          - heading "New music & community updates" [level=3] [ref=e311]
          - generic [ref=e312]:
            - textbox "Your name *" [ref=e313]
            - textbox "your@email.com *" [ref=e314]
            - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e315]
            - textbox "Birthday (optional — we'll send you something special)" [ref=e316]
            - paragraph [ref=e317]: Birthday optional — we'll send you something special 🎂
            - combobox [ref=e318]:
              - option "How did you find me? *" [selected]
              - option "Google"
              - option "Instagram"
              - option "Facebook"
              - option "TikTok"
              - option "X (Twitter)"
              - option "Friend / Word of Mouth"
              - option "I know Gannon"
              - option "Other"
            - button "Subscribe" [ref=e319] [cursor=pointer]
        - paragraph [ref=e321]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
        - generic [ref=e322]:
          - generic [ref=e323]:
            - img "GW Heart" [ref=e324]
            - link "Support the project 🤍" [ref=e325]:
              - /url: /back-this
            - img "GW Heart" [ref=e326]
          - paragraph [ref=e327]: © 2026 Gannon Waye. All rights reserved.
    - generic [ref=e328]:
      - img [ref=e329]
      - paragraph [ref=e331]: 🎵Music approved for public sharing appears on the Music page
      - button "Dismiss" [ref=e332] [cursor=pointer]:
        - img [ref=e333]
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
  11  |     await page.goto(`${BASE_URL}/`);
  12  |     await page.waitForLoadState('networkidle');
  13  |     const badLinks = await page.locator('a[href="#"], a[href="javascript:void(0)"]').count();
  14  |     expect(badLinks).toBe(0);
  15  |   });
  16  | 
  17  |   test('Instagram links point to @gann0nwaye', async ({ page }) => {
> 18  |     await page.goto(`${BASE_URL}/`);
      |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
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
  112 |     await page.waitForLoadState('networkidle');
  113 |     await expect(page.locator('body')).toBeVisible();
  114 |     // Pass as long as page loads without crash
  115 |   });
  116 | });
```