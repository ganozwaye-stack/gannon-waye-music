# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: consolidation-stage1-live.spec.js >> Stage 1 live consolidation smoke >> desktop and mobile navigation expose no coaching link
- Location: src/gannonwaye-playwright-pack/tests/consolidation-stage1-live.spec.js:143:3

# Error details

```
Error: Runtime errors for /

Runtime errors for /

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 10

- Array []
+ Array [
+   "console.error: Failed to load resource: net::ERR_NAME_NOT_RESOLVED",
+   "response: 404 POST /api/apps/69eb7905ca6eb4180010f794/analytics/track/batch",
+   "console.error: Failed to load resource: the server responded with a status of 404 (Not Found)",
+   "response: 404 POST /api/app-logs/69eb7905ca6eb4180010f794/log-user-in-app/home",
+   "console.error: Failed to load resource: the server responded with a status of 404 (Not Found)",
+   "requestfailed: POST /api/app-logs/69eb7905ca6eb4180010f794/log-user-in-app/home net::ERR_ABORTED",
+   "console.error: Failed to load resource: net::ERR_NAME_NOT_RESOLVED",
+   "console.error: Failed to load resource: net::ERR_NAME_NOT_RESOLVED",
+ ]

Call Log:
- Timeout 1000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Support Now" [ref=e4] [cursor=pointer]:
    - /url: /back-this
    - button "Support Now" [ref=e5]
  - generic [ref=e6]:
    - navigation [ref=e7]:
      - generic [ref=e8]:
        - link "Gannon Waye · Home" [ref=e9] [cursor=pointer]:
          - /url: /
          - generic [ref=e11]: GW
        - generic [ref=e12]:
          - link "Home" [ref=e14] [cursor=pointer]:
            - /url: /
          - link "Biography" [ref=e16] [cursor=pointer]:
            - /url: /biography
          - link "Music" [ref=e18] [cursor=pointer]:
            - /url: /music
          - link "Store" [ref=e20] [cursor=pointer]:
            - /url: /store
          - link "Supporters" [ref=e22] [cursor=pointer]:
            - /url: /back-this
          - link "Mum's Garden" [ref=e24] [cursor=pointer]:
            - /url: /mums-garden
          - link "Press" [ref=e26] [cursor=pointer]:
            - /url: /press
          - link "Contact" [ref=e28] [cursor=pointer]:
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
              - link "Discover the Music Stream the latest singles, explore the discography, and feel every lyric. Enter the Sound" [ref=e56] [cursor=pointer]:
                - /url: /music
                - img [ref=e58]
                - heading "Discover the Music" [level=3] [ref=e62]
                - paragraph [ref=e63]: Stream the latest singles, explore the discography, and feel every lyric.
                - paragraph [ref=e64]:
                  - text: Enter the Sound
                  - img [ref=e65]
              - link "Join the Inner Circle Be part of a community that chooses authenticity over appearance. Step In" [ref=e68] [cursor=pointer]:
                - /url: /back-this
                - img [ref=e70]
                - heading "Join the Inner Circle" [level=3] [ref=e75]
                - paragraph [ref=e76]: Be part of a community that chooses authenticity over appearance.
                - paragraph [ref=e77]:
                  - text: Step In
                  - img [ref=e78]
              - link "Book Gannon Secure your session — performances, collaborations, and creative partnerships. Reserve Your Session" [ref=e81] [cursor=pointer]:
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
                  - link "Gannon Waye Music, Gannon Waye" [ref=e100] [cursor=pointer]:
                    - /url: /music
                    - img "Gannon Waye Music, Gannon Waye" [ref=e101]
                  - paragraph [ref=e102]: Music is shared here only when it is ready.
                - link "Back The Thankyou Project 🤍" [ref=e105] [cursor=pointer]:
                  - /url: /back-this
                  - button "Back The Thankyou Project 🤍" [ref=e106]
              - generic [ref=e107]:
                - generic [ref=e112]:
                  - generic [ref=e113]:
                    - generic [ref=e117]: Gannon Waye Music
                    - generic [ref=e118]: Official artist site
                  - paragraph [ref=e120]: Independent, heart-first music from Gannon Waye
                  - link "Explore the Music page" [ref=e122] [cursor=pointer]:
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
                - link "Full Press Kit" [ref=e195] [cursor=pointer]:
                  - /url: /press-kit
                  - button "Full Press Kit" [ref=e196]:
                    - img
                    - text: Full Press Kit
                - link "Press & Booking" [ref=e197] [cursor=pointer]:
                  - /url: /press
                  - button "Press & Booking" [ref=e198]:
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
            - link "Donate From $5" [ref=e235] [cursor=pointer]:
              - /url: /back-this
              - generic [ref=e236]:
                - img [ref=e237]
                - paragraph [ref=e239]: Donate
                - paragraph [ref=e240]: From $5
            - link "Join Free" [ref=e241] [cursor=pointer]:
              - /url: /community
              - generic [ref=e242]:
                - img [ref=e243]
                - paragraph [ref=e248]: Join
                - paragraph [ref=e249]: Free
            - link "Shop Merch" [ref=e250] [cursor=pointer]:
              - /url: /store
              - generic [ref=e251]:
                - img [ref=e252]
                - paragraph [ref=e255]: Shop
                - paragraph [ref=e256]: Merch
            - link "Follow Socials" [ref=e257] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
              - generic [ref=e258]:
                - img [ref=e259]
                - paragraph [ref=e265]: Follow
                - paragraph [ref=e266]: Socials
          - generic [ref=e267]:
            - link "Support the Project" [ref=e268] [cursor=pointer]:
              - /url: /back-this
              - button "Support the Project" [ref=e269]:
                - img
                - text: Support the Project
            - link "Listen to Music" [ref=e270] [cursor=pointer]:
              - /url: /music
              - button "Listen to Music" [ref=e271]:
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
          - link "Join the Community" [ref=e310] [cursor=pointer]:
            - /url: /community
            - button "Join the Community" [ref=e311]:
              - text: Join the Community
              - img
          - generic [ref=e312]:
            - paragraph [ref=e313]: If you need support right now
            - paragraph [ref=e314]:
              - text: Australia · Lifeline
              - link "13 11 14" [ref=e315] [cursor=pointer]:
                - /url: tel:131114
              - text: · 1800RESPECT
              - link "1800 737 732" [ref=e316] [cursor=pointer]:
                - /url: tel:1800737732
              - text: · Beyond Blue
              - link "1300 22 4636" [ref=e317] [cursor=pointer]:
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
              - link "Home" [ref=e328] [cursor=pointer]:
                - /url: /
              - link "Music" [ref=e329] [cursor=pointer]:
                - /url: /music
              - link "Lyrics" [ref=e330] [cursor=pointer]:
                - /url: /lyrics
              - link "Store" [ref=e331] [cursor=pointer]:
                - /url: /store
              - link "Press" [ref=e332] [cursor=pointer]:
                - /url: /press
              - link "Subscribe 🤍" [ref=e333] [cursor=pointer]:
                - /url: /back-this
              - link "Community" [ref=e334] [cursor=pointer]:
                - /url: /community
              - link "Biography" [ref=e335] [cursor=pointer]:
                - /url: /biography
              - link "Lyric Library" [ref=e336] [cursor=pointer]:
                - /url: /lyric-library
              - link "Mixing Services" [ref=e337] [cursor=pointer]:
                - /url: /mixing-services
              - link "Gift Cards" [ref=e338] [cursor=pointer]:
                - /url: /gift-cards
              - link "Mum Tribute" [ref=e339] [cursor=pointer]:
                - /url: /remember-mum
              - link "Systems Manager" [ref=e340] [cursor=pointer]:
                - /url: /systems-manager
              - link "Contact" [ref=e341] [cursor=pointer]:
                - /url: /contact
          - generic [ref=e342]:
            - heading "Contact" [level=4] [ref=e343]
            - paragraph [ref=e344]: For press, management & enquiries
            - link "gannonwayemusic@gmail.com" [ref=e345] [cursor=pointer]:
              - /url: mailto:gannonwayemusic@gmail.com
            - heading "Legal" [level=4] [ref=e346]
            - generic [ref=e347]:
              - link "Privacy Policy" [ref=e348] [cursor=pointer]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e349] [cursor=pointer]:
                - /url: /terms-of-service
              - link "Contact Gannon" [ref=e350] [cursor=pointer]:
                - /url: /contact
            - heading "Social" [level=4] [ref=e351]
            - generic [ref=e352]:
              - link "Instagram @gann0nwaye" [ref=e353] [cursor=pointer]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e354] [cursor=pointer]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e355] [cursor=pointer]:
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
            - link "Support the project 🤍" [ref=e372] [cursor=pointer]:
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
  1   | /* eslint-disable no-undef */
  2   | const { test, expect } = require('@playwright/test');
  3   | 
  4   | const LIVE = process.env.LIVE === '1';
  5   | const BASE_URL = process.env.BASE_URL || 'https://gannonwaye.com';
  6   | const ALLOWED_CONSOLE_HOSTS = new Set([
  7   |   'tracker.metricool.com',
  8   |   'posthog.com',
  9   |   'www.posthog.com',
  10  |   'youtube.com',
  11  |   'www.youtube.com',
  12  |   'youtube-nocookie.com',
  13  |   'www.youtube-nocookie.com',
  14  |   'doubleclick.net',
  15  |   'www.doubleclick.net',
  16  |   'spotify.com',
  17  |   'www.spotify.com',
  18  |   'google-analytics.com',
  19  |   'www.google-analytics.com',
  20  |   'googletagmanager.com',
  21  |   'www.googletagmanager.com',
  22  | ]);
  23  | 
  24  | test.skip(!LIVE, 'Production consolidation smoke only runs with LIVE=1.');
  25  | 
  26  | function consoleHost(message) {
  27  |   try {
  28  |     const url = message.location()?.url;
  29  |     return url ? new URL(url).hostname : '';
  30  |   } catch {
  31  |     return '';
  32  |   }
  33  | }
  34  | 
  35  | function attachRuntimeAudit(page) {
  36  |   const errors = [];
  37  |   const firstPartyHosts = new Set([
  38  |     new URL(BASE_URL).hostname,
  39  |     'gannonwaye.com',
  40  |     'www.gannonwaye.com',
  41  |   ]);
  42  | 
  43  |   page.on('pageerror', error => {
  44  |     errors.push(`pageerror: ${error.message}`);
  45  |   });
  46  | 
  47  |   page.on('console', message => {
  48  |     if (message.type() !== 'error') return;
  49  |     const host = consoleHost(message);
  50  |     if (host && ALLOWED_CONSOLE_HOSTS.has(host)) return;
  51  |     errors.push(`console.error: ${message.text()}`);
  52  |   });
  53  | 
  54  |   page.on('requestfailed', request => {
  55  |     try {
  56  |       const url = new URL(request.url());
  57  |       if (!firstPartyHosts.has(url.hostname)) return;
  58  |       errors.push(
  59  |         `requestfailed: ${request.method()} ${url.pathname} ${request.failure()?.errorText || ''}`,
  60  |       );
  61  |     } catch {
  62  |       errors.push(`requestfailed: ${request.url()}`);
  63  |     }
  64  |   });
  65  | 
  66  |   page.on('response', response => {
  67  |     try {
  68  |       const url = new URL(response.url());
  69  |       if (!firstPartyHosts.has(url.hostname) || response.status() < 400) return;
  70  |       errors.push(
  71  |         `response: ${response.status()} ${response.request().method()} ${url.pathname}`,
  72  |       );
  73  |     } catch {
  74  |       errors.push(`response: ${response.status()} ${response.url()}`);
  75  |     }
  76  |   });
  77  | 
  78  |   return errors;
  79  | }
  80  | 
  81  | async function openAudited(page, route) {
  82  |   const errors = attachRuntimeAudit(page);
  83  |   const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  84  |   expect(response, `Missing navigation response for ${route}`).not.toBeNull();
  85  |   expect(response.status(), `Navigation status for ${route}`).toBe(200);
  86  |   await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  87  |   await page.waitForTimeout(500);
  88  | 
  89  |   const body = (await page.locator('body').innerText()).trim();
  90  |   expect(body.length, `Rendered body for ${route}`).toBeGreaterThan(40);
  91  |   expect(body).not.toContain('Application Error');
  92  | 
  93  |   await expect
  94  |     .poll(() => errors, {
  95  |       message: `Runtime errors for ${route}`,
  96  |       timeout: 1000,
  97  |     })
> 98  |     .toEqual([]);
      |      ^ Error: Runtime errors for /
  99  | 
  100 |   return body;
  101 | }
  102 | 
  103 | test.describe('Stage 1 live consolidation smoke', () => {
  104 |   test('public release routes render without runtime errors', async ({ page }) => {
  105 |     const cases = [
  106 |       { route: '/', finalPath: '/', bodyPattern: /Gannon Waye|Australian artist/i },
  107 |       { route: '/music', finalPath: '/music', bodyPattern: /Music/i },
  108 |       { route: '/releases', finalPath: '/music', bodyPattern: /Music/i },
  109 |     ];
  110 | 
  111 |     for (const item of cases) {
  112 |       const body = await openAudited(page, item.route);
  113 |       expect(new URL(page.url()).pathname).toBe(item.finalPath);
  114 |       expect(body).toMatch(item.bodyPattern);
  115 |       expect(body).not.toContain('Page Not Found');
  116 |     }
  117 |   });
  118 | 
  119 |   test('coaching remains absent from every public route', async ({ page }) => {
  120 |     const lockedRoutes = [
  121 |       '/coaching',
  122 |       '/coaching/self-worth-reset',
  123 |       '/coaching/boundaries',
  124 |       '/coaching/creative-confidence',
  125 |       '/coaching/workbooks',
  126 |       '/coaching/intake',
  127 |       '/coaching/client-resources',
  128 |       '/coaching-programs',
  129 |       '/mindset-coaching',
  130 |       '/life-coaching',
  131 |       '/book-coaching',
  132 |     ];
  133 | 
  134 |     for (const route of lockedRoutes) {
  135 |       const body = await openAudited(page, route);
  136 |       expect(new URL(page.url()).pathname).toBe(route);
  137 |       expect(body).toContain('Page Not Found');
  138 |       expect(body).not.toMatch(/Start Your Coaching Journey|Coaching Intake Form/i);
  139 |       expect(await page.locator('form').count()).toBe(0);
  140 |     }
  141 |   });
  142 | 
  143 |   test('desktop and mobile navigation expose no coaching link', async ({ page }) => {
  144 |     await page.addInitScript(() => {
  145 |       localStorage.removeItem('gw-first-visit-seen');
  146 |     });
  147 |     await openAudited(page, '/');
  148 |     await page.waitForTimeout(1500);
  149 |     await expect(page.locator('a[href^="/coaching"]')).toHaveCount(0);
  150 | 
  151 |     await page.setViewportSize({ width: 390, height: 844 });
  152 |     await page.reload({ waitUntil: 'domcontentloaded' });
  153 |     const menuButton = page.locator('nav button.md\\:hidden').last();
  154 |     await expect(menuButton).toBeVisible();
  155 |     await menuButton.click();
  156 |     await expect(page.locator('a[href^="/coaching"]')).toHaveCount(0);
  157 |   });
  158 | });
```