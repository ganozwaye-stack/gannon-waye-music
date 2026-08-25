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
Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
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
          - button "Close" [ref=e27] [cursor=pointer]:
            - img [ref=e28]
          - generic [ref=e31]:
            - generic [ref=e32]:
              - paragraph [ref=e33]: Welcome
              - heading "This is more than music. This is choosing yourself." [level=2] [ref=e34]:
                - text: This is more than music.
                - text: This is choosing yourself.
              - paragraph [ref=e35]: Where would you like to begin?
            - generic [ref=e36]:
              - link "Discover the Music Stream the latest singles, explore the discography, and feel every lyric. Enter the Sound" [ref=e38]:
                - /url: /music
                - img [ref=e40]
                - heading "Discover the Music" [level=3] [ref=e44]
                - paragraph [ref=e45]: Stream the latest singles, explore the discography, and feel every lyric.
                - paragraph [ref=e46]:
                  - text: Enter the Sound
                  - img [ref=e47]
              - link "Join the Inner Circle Be part of a community that chooses authenticity over appearance. Step In" [ref=e50]:
                - /url: /back-this
                - img [ref=e52]
                - heading "Join the Inner Circle" [level=3] [ref=e57]
                - paragraph [ref=e58]: Be part of a community that chooses authenticity over appearance.
                - paragraph [ref=e59]:
                  - text: Step In
                  - img [ref=e60]
              - link "Book Gannon Secure your session — performances, collaborations, and creative partnerships. Reserve Your Session" [ref=e63]:
                - /url: /contact
                - img [ref=e65]
                - heading "Book Gannon" [level=3] [ref=e67]
                - paragraph [ref=e68]: Secure your session — performances, collaborations, and creative partnerships.
                - paragraph [ref=e69]:
                  - text: Reserve Your Session
                  - img [ref=e70]
            - button "Just exploring — take me to the site" [ref=e72] [cursor=pointer]
        - generic [ref=e73]:
          - img
          - generic [ref=e75]:
            - heading "Gannon Waye" [level=1] [ref=e76]
            - generic [ref=e77]:
              - generic [ref=e78]:
                - generic [ref=e79]:
                  - paragraph [ref=e80]: Music
                  - link "Gannon Waye Music, Gannon Waye" [ref=e82]:
                    - /url: /music
                    - img "Gannon Waye Music, Gannon Waye" [ref=e83]
                  - paragraph [ref=e84]: Music is shared here only when it is ready.
                - link "Back The Thankyou Project 🤍" [ref=e87]:
                  - /url: /back-this
                  - button "Back The Thankyou Project 🤍" [ref=e88] [cursor=pointer]
              - generic [ref=e89]:
                - generic [ref=e94]:
                  - generic [ref=e95]:
                    - generic [ref=e99]: Gannon Waye Music
                    - generic [ref=e100]: Official artist site
                  - paragraph [ref=e102]: Independent, heart-first music from Gannon Waye
                  - link "Explore the Music page" [ref=e104]:
                    - /url: /music
                - generic [ref=e105]:
                  - paragraph [ref=e106]: WELCOME
                  - paragraph [ref=e107]: I'm a singer-songwriter from Adelaide, now based in Melbourne. I write from lived experience about grief, healing, and the quiet courage it takes to love yourself. My mission is to make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. This is independent, heart-first art, powered by community, with 10% of all support going to 1800RESPECT. Every song is recorded honestly, voice and guitar first, so the feeling stays intact. Whether you're carrying loss, rebuilding after hard years, or learning to like yourself again, you're in the right place, and you're not alone here.
          - generic:
            - generic: Scroll
        - generic [ref=e109]:
          - generic [ref=e110]:
            - generic [ref=e111]: Independent, heart-first music from Gannon Waye
            - generic [ref=e112]: ◆
            - generic [ref=e113]: Music approved for public sharing appears on the Music page
            - generic [ref=e114]: ◆
            - generic [ref=e115]: 10% of all support goes to 1800RESPECT
            - generic [ref=e116]: ◆
            - generic [ref=e117]: New music is shared only when it is ready
            - generic [ref=e118]: ◆
            - generic [ref=e119]: Join the community and follow the story
            - generic [ref=e120]: ◆
          - generic [ref=e121]:
            - generic [ref=e122]: Independent, heart-first music from Gannon Waye
            - generic [ref=e123]: ◆
            - generic [ref=e124]: Music approved for public sharing appears on the Music page
            - generic [ref=e125]: ◆
            - generic [ref=e126]: 10% of all support goes to 1800RESPECT
            - generic [ref=e127]: ◆
            - generic [ref=e128]: New music is shared only when it is ready
            - generic [ref=e129]: ◆
            - generic [ref=e130]: Join the community and follow the story
            - generic [ref=e131]: ◆
        - generic [ref=e133]:
          - generic [ref=e134]:
            - paragraph [ref=e135]: About
            - heading "The Story" [level=2] [ref=e136]
          - generic [ref=e137]:
            - paragraph [ref=e138]: I'm a singer-songwriter born and raised in Adelaide, now calling Melbourne home for over 13 years. Music has always been more than sound to me. It's the language I use to understand people, emotion, and the parts of life that don't always have words.
            - paragraph [ref=e139]: I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
            - paragraph [ref=e140]: I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.
            - generic [ref=e141]:
              - paragraph [ref=e142]: I didn't truly love myself
              - paragraph [ref=e143]: until I was 33.
              - paragraph [ref=e144]: Before that, I woke up
              - paragraph [ref=e145]: every day wishing
              - paragraph [ref=e146]: I could be someone else.
              - paragraph [ref=e147]: That fear of abandonment
              - paragraph [ref=e148]: ran my life.
              - paragraph [ref=e149]: Then something shifted
              - paragraph [ref=e150]: and for the first time,
              - paragraph [ref=e151]: I didn't want to be
              - paragraph [ref=e152]: anyone else.
            - paragraph [ref=e153]: My journey hasn't been simple. I've experienced loss, grief, and environments that challenged my sense of self. But those experiences shaped me and gave me something real to say.
            - paragraph [ref=e154]: "I began singing at a young age, runner up in Adelaide Search for a Star, Top 100 in the early days of Australian Idol, and a few others. But this isn't about trophies. The past decade has been about something far more personal: developing my own voice and writing from lived experience."
            - paragraph [ref=e155]: That work shapes the music and stories I continue to create for anyone who needs hope or a reminder that they are not alone.
        - generic [ref=e157]:
          - generic [ref=e158]:
            - paragraph [ref=e159]: For Press
            - heading "Digital Press Kit" [level=2] [ref=e160]
          - generic [ref=e163]:
            - generic [ref=e164]:
              - paragraph [ref=e165]: Mission
              - paragraph [ref=e166]: To make music that helps anyone who hears it feel less alone, and to honour the people who shaped us. Independent, heart-first art, with 10% of all support going to 1800RESPECT.
              - paragraph [ref=e168]: Biography
              - paragraph [ref=e169]: Gannon Waye is a singer-songwriter born and raised in Adelaide and based in Melbourne. He writes from lived experience about grief, healing, self-worth, and the quiet courage it takes to choose yourself. His work is independent, heart-first, and grounded in honest storytelling.
              - generic [ref=e170]:
                - link "Full Press Kit" [ref=e171]:
                  - /url: /press-kit
                  - button "Full Press Kit" [ref=e172] [cursor=pointer]:
                    - img
                    - text: Full Press Kit
                - link "Press & Booking" [ref=e173]:
                  - /url: /press
                  - button "Press & Booking" [ref=e174] [cursor=pointer]:
                    - text: Press & Booking
                    - img
            - generic [ref=e175]:
              - paragraph [ref=e176]: Headshots
              - img "Gannon Waye" [ref=e179]
              - paragraph [ref=e180]: High-resolution images available on request
        - generic [ref=e182]:
          - paragraph [ref=e183]: Official Merch Boutique
          - heading "Enter the Gannon Waye Store" [level=2] [ref=e184]
          - paragraph [ref=e185]:
            - text: Shop Official Merch — the
            - emphasis [ref=e186]: Respect Is Earned
            - text: collection,
            - text: bundles, wall posters and music collectables.
          - generic [ref=e189]: ✦
          - generic [ref=e191]:
            - button "Enter the Store ✦" [ref=e192] [cursor=pointer]
            - button "Shop All Merch →" [ref=e193] [cursor=pointer]
          - generic [ref=e194]:
            - button "Winter Bundle — $129" [ref=e195] [cursor=pointer]
            - button "Journal Bundle — $59" [ref=e196] [cursor=pointer]
            - button "Hoodie — $89" [ref=e197] [cursor=pointer]
            - button "Mug — $9.90" [ref=e198] [cursor=pointer]
            - button "Posters from $19" [ref=e199] [cursor=pointer]
        - generic [ref=e203]:
          - generic [ref=e204]:
            - img [ref=e205]
            - paragraph [ref=e207]: The Thank You Project
          - heading "Be Part of the Story" [level=2] [ref=e208]
          - paragraph [ref=e209]: Every contribution fuels independent music, supports healing, and builds a community where stories matter. 10% of all support goes to 1800RESPECT. Join the Thank You Project today.
          - generic [ref=e210]:
            - link "Donate From $5" [ref=e211]:
              - /url: /back-this
              - generic [ref=e212]:
                - img [ref=e213]
                - paragraph [ref=e215]: Donate
                - paragraph [ref=e216]: From $5
            - link "Join Free" [ref=e217]:
              - /url: /community
              - generic [ref=e218]:
                - img [ref=e219]
                - paragraph [ref=e224]: Join
                - paragraph [ref=e225]: Free
            - link "Shop Merch" [ref=e226]:
              - /url: /store
              - generic [ref=e227]:
                - img [ref=e228]
                - paragraph [ref=e231]: Shop
                - paragraph [ref=e232]: Merch
            - link "Follow Socials" [ref=e233]:
              - /url: https://www.instagram.com/gann0nwaye
              - generic [ref=e234]:
                - img [ref=e235]
                - paragraph [ref=e241]: Follow
                - paragraph [ref=e242]: Socials
          - generic [ref=e243]:
            - link "Support the Project" [ref=e244]:
              - /url: /back-this
              - button "Support the Project" [ref=e245] [cursor=pointer]:
                - img
                - text: Support the Project
            - link "Listen to Music" [ref=e246]:
              - /url: /music
              - button "Listen to Music" [ref=e247] [cursor=pointer]:
                - img
                - text: Listen to Music
        - generic [ref=e250]:
          - img [ref=e251]
          - paragraph [ref=e254]: Stay Connected
          - heading "Join the Inner Circle" [level=2] [ref=e255]
          - paragraph [ref=e256]: Be the first to hear about new music, behind-the-scenes stories, and exclusive updates.
          - button "Sign up today & get a gift from me" [ref=e257] [cursor=pointer]:
            - img [ref=e258]
            - generic [ref=e262]: Sign up today & get a gift from me
            - img [ref=e263]
          - generic [ref=e268]:
            - textbox "Your full name *" [ref=e270]
            - textbox "Email address *" [ref=e272]
            - button "Continue →" [ref=e273] [cursor=pointer]
        - generic [ref=e277]:
          - img [ref=e279]
          - paragraph [ref=e281]: A Safe Space
          - heading "You Are Not Alone" [level=2] [ref=e282]
          - paragraph [ref=e283]: This space was built for anyone who has ever felt unseen, misunderstood, or too much for the world around them. Whether you're here for the music, for the message, or because something in a lyric hit a little too close to home, you belong here.
          - paragraph [ref=e284]: No judgement. No noise. Just connection.
          - link "Join the Community" [ref=e286]:
            - /url: /community
            - button "Join the Community" [ref=e287] [cursor=pointer]:
              - text: Join the Community
              - img
          - generic [ref=e288]:
            - paragraph [ref=e289]: If you need support right now
            - paragraph [ref=e290]:
              - text: Australia · Lifeline
              - link "13 11 14" [ref=e291]:
                - /url: tel:131114
              - text: · 1800RESPECT
              - link "1800 737 732" [ref=e292]:
                - /url: tel:1800737732
              - text: · Beyond Blue
              - link "1300 22 4636" [ref=e293]:
                - /url: tel:1300224636
    - contentinfo [ref=e294]:
      - generic [ref=e295]:
        - generic [ref=e296]:
          - generic [ref=e297]:
            - generic [ref=e299]: GW
            - paragraph [ref=e300]: Australian singer-songwriter crafting honest stories through melody and verse.
          - generic [ref=e301]:
            - heading "Navigate" [level=4] [ref=e302]
            - generic [ref=e303]:
              - link "Home" [ref=e304]:
                - /url: /
              - link "Music" [ref=e305]:
                - /url: /music
              - link "Lyrics" [ref=e306]:
                - /url: /lyrics
              - link "Store" [ref=e307]:
                - /url: /store
              - link "Press" [ref=e308]:
                - /url: /press
              - link "Subscribe 🤍" [ref=e309]:
                - /url: /back-this
              - link "Community" [ref=e310]:
                - /url: /community
              - link "Biography" [ref=e311]:
                - /url: /biography
              - link "Lyric Library" [ref=e312]:
                - /url: /lyric-library
              - link "Mixing Services" [ref=e313]:
                - /url: /mixing-services
              - link "Gift Cards" [ref=e314]:
                - /url: /gift-cards
              - link "Mum Tribute" [ref=e315]:
                - /url: /remember-mum
              - link "Systems Manager" [ref=e316]:
                - /url: /systems-manager
              - link "Contact" [ref=e317]:
                - /url: /contact
          - generic [ref=e318]:
            - heading "Contact" [level=4] [ref=e319]
            - paragraph [ref=e320]: For press, management & enquiries
            - link "gannonwayemusic@gmail.com" [ref=e321]:
              - /url: mailto:gannonwayemusic@gmail.com
            - heading "Legal" [level=4] [ref=e322]
            - generic [ref=e323]:
              - link "Privacy Policy" [ref=e324]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e325]:
                - /url: /terms-of-service
              - link "Contact Gannon" [ref=e326]:
                - /url: /contact
            - heading "Social" [level=4] [ref=e327]
            - generic [ref=e328]:
              - link "Instagram @gann0nwaye" [ref=e329]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e330]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e331]:
                - /url: https://www.youtube.com/@gannonwayeofficial
        - generic [ref=e332]:
          - paragraph [ref=e333]: Stay in the loop
          - heading "New music & community updates" [level=3] [ref=e334]
          - generic [ref=e335]:
            - textbox "Your name *" [ref=e336]
            - textbox "your@email.com *" [ref=e337]
            - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e338]
            - textbox "Birthday (optional — we'll send you something special)" [ref=e339]
            - paragraph [ref=e340]: Birthday optional — we'll send you something special 🎂
            - combobox [ref=e341]:
              - option "How did you find me? *" [selected]
              - option "Google"
              - option "Instagram"
              - option "Facebook"
              - option "TikTok"
              - option "X (Twitter)"
              - option "Friend / Word of Mouth"
              - option "I know Gannon"
              - option "Other"
            - button "Subscribe" [ref=e342] [cursor=pointer]
        - paragraph [ref=e344]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
        - generic [ref=e345]:
          - generic [ref=e346]:
            - img "GW Heart" [ref=e347]
            - link "Support the project 🤍" [ref=e348]:
              - /url: /back-this
            - img "GW Heart" [ref=e349]
          - paragraph [ref=e350]: © 2026 Gannon Waye. All rights reserved.
    - navigation [ref=e351]:
      - generic [ref=e352]:
        - link "Home" [ref=e353]:
          - /url: /
          - generic [ref=e355]:
            - img [ref=e356]
            - generic [ref=e359]: Home
        - link "Music" [ref=e360]:
          - /url: /music
          - generic [ref=e361]:
            - img [ref=e362]
            - generic [ref=e366]: Music
        - link "Store" [ref=e367]:
          - /url: /store
          - generic [ref=e368]:
            - img [ref=e369]
            - generic [ref=e372]: Store
        - link "Lyrics" [ref=e373]:
          - /url: /lyrics
          - generic [ref=e374]:
            - img [ref=e375]
            - generic [ref=e378]: Lyrics
        - link "Contact" [ref=e379]:
          - /url: /contact
          - generic [ref=e380]:
            - img [ref=e381]
            - generic [ref=e384]: Contact
    - generic [ref=e385]:
      - img [ref=e386]
      - paragraph [ref=e388]: 🎵Music approved for public sharing appears on the Music page
      - button "Dismiss" [ref=e389] [cursor=pointer]:
        - img [ref=e390]
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
  18  |     await page.goto(`${BASE_URL}/`);
> 19  |     await page.waitForLoadState('networkidle');
      |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
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