# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-freeze-regression.spec.js >> Mobile home remains operable at supported phone sizes >> 320x568 portrait: onboarding, navigation and fixed UI do not freeze scrolling
- Location: src/gannonwaye-playwright-pack/tests/mobile-freeze-regression.spec.js:71:5

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: locator.click: Test timeout of 90000ms exceeded.
Call log:
  - waiting for getByRole('dialog', { name: 'Search the Gannon Waye site' }).getByRole('button', { name: 'Close search' })
    - locator resolved to <button type="button" aria-label="Close search" data-dynamic-content="true" data-source-location="src/components/public/SiteSearch.jsx:85:10" class="text-muted-foreground hover:text-foreground transition-colors">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    147 × waiting for element to be visible, enabled and stable
        - element is not visible
      - retrying click action
        - waiting 500ms
    - waiting for element to be visible, enabled and stable

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
        - generic [ref=e10]:
          - button "Search the site" [ref=e11] [cursor=pointer]:
            - img [ref=e12]
          - button "Open cart" [ref=e15] [cursor=pointer]:
            - img [ref=e16]
          - button "Open navigation menu" [ref=e20] [cursor=pointer]:
            - img [ref=e21]
      - dialog "Search the Gannon Waye site" [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]:
            - img [ref=e25]
            - textbox "Search music, merchandise, and stories" [active] [ref=e28]:
              - /placeholder: Search music, merch, stories...
            - button "Close search":
              - img
          - generic [ref=e32]:
            - paragraph [ref=e33]: Quick Links
            - 'link "My Story About Gannon: ten-episode life series" [ref=e34] [cursor=pointer]':
              - /url: /this-is-my-life
              - img [ref=e36]
              - generic [ref=e38]:
                - paragraph [ref=e39]: My Story
                - paragraph [ref=e40]: "About Gannon: ten-episode life series"
            - link "Contact Music, media, collaboration, or business enquiries" [ref=e41] [cursor=pointer]:
              - /url: /contact
              - img [ref=e43]
              - generic [ref=e46]:
                - paragraph [ref=e47]: Contact
                - paragraph [ref=e48]: Music, media, collaboration, or business enquiries
            - link "Lyrics Read every word" [ref=e49] [cursor=pointer]:
              - /url: /lyrics
              - img [ref=e51]
              - generic [ref=e54]:
                - paragraph [ref=e55]: Lyrics
                - paragraph [ref=e56]: Read every word
            - link "Videos Instagram & TikTok content" [ref=e57] [cursor=pointer]:
              - /url: /videos
              - img [ref=e59]
              - generic [ref=e63]:
                - paragraph [ref=e64]: Videos
                - paragraph [ref=e65]: Instagram & TikTok content
            - link "FAQ Common questions answered" [ref=e66] [cursor=pointer]:
              - /url: /faq
              - img [ref=e68]
              - generic [ref=e71]:
                - paragraph [ref=e72]: FAQ
                - paragraph [ref=e73]: Common questions answered
    - main [ref=e74]:
      - generic [ref=e75]:
        - generic [ref=e76]:
          - img
          - generic [ref=e78]:
            - heading "Gannon Waye" [level=1] [ref=e79]
            - generic [ref=e80]:
              - generic [ref=e81]:
                - generic [ref=e82]:
                  - paragraph [ref=e83]: Music
                  - link "Gannon Waye Music, Gannon Waye" [ref=e85] [cursor=pointer]:
                    - /url: /music
                    - img "Gannon Waye Music, Gannon Waye" [ref=e86]
                  - paragraph [ref=e87]: Music is shared here only when it is ready.
                - generic [ref=e88]:
                  - link "Wear the Message" [ref=e90] [cursor=pointer]:
                    - /url: /store
                    - button "Wear the Message" [ref=e91]
                  - link "Work with Me" [ref=e93] [cursor=pointer]:
                    - /url: /contact
                    - button "Work with Me" [ref=e94]
              - generic [ref=e95]:
                - generic [ref=e100]:
                  - generic [ref=e101]:
                    - generic [ref=e105]: Gannon Waye Music
                    - generic [ref=e106]: Official artist site
                  - paragraph [ref=e108]: Independent, heart-first music from Gannon Waye
                  - link "Explore the Music page" [ref=e110] [cursor=pointer]:
                    - /url: /music
                - generic [ref=e111]:
                  - paragraph [ref=e112]: WELCOME
                  - paragraph [ref=e113]: I'm an Adelaide-born singer-songwriter now based in Melbourne. I grew up without access to formal music lessons, so I found my voice through school choirs, church, worship ministry, drag performance and every stage that would have me. After family violence, abusive relationships, addiction, PTSD and losing Mum, I returned to music with a purpose. I'm Still Here is not a search for fame. It is for anyone who needs a song to say what they cannot yet say. This is independent, heart-first art. You are not alone here.
          - generic:
            - generic: Scroll
        - generic [ref=e115]:
          - generic [ref=e116]:
            - generic [ref=e117]: Independent, heart-first music from Gannon Waye
            - generic [ref=e118]: ◆
            - generic [ref=e119]: Music approved for public sharing appears on the Music page
            - generic [ref=e120]: ◆
            - generic [ref=e121]: The Store shows only current owner-approved stock
            - generic [ref=e122]: ◆
            - generic [ref=e123]: New music is shared only when it is ready
            - generic [ref=e124]: ◆
            - generic [ref=e125]: Join the community and follow the story
            - generic [ref=e126]: ◆
          - generic [ref=e127]:
            - generic [ref=e128]: Independent, heart-first music from Gannon Waye
            - generic [ref=e129]: ◆
            - generic [ref=e130]: Music approved for public sharing appears on the Music page
            - generic [ref=e131]: ◆
            - generic [ref=e132]: The Store shows only current owner-approved stock
            - generic [ref=e133]: ◆
            - generic [ref=e134]: New music is shared only when it is ready
            - generic [ref=e135]: ◆
            - generic [ref=e136]: Join the community and follow the story
            - generic [ref=e137]: ◆
        - generic [ref=e139]:
          - generic [ref=e140]:
            - paragraph [ref=e141]: About
            - heading "The Story" [level=2] [ref=e142]
          - generic [ref=e143]:
            - paragraph [ref=e144]: "I was born and raised in Adelaide and now call Melbourne home. We did not have the money for formal music lessons, no matter how often I asked, cried or begged, but that never weakened the drive. I learned by taking every chance available: leading school choirs, singing in church and eventually serving as a worship minister."
            - paragraph [ref=e145]: I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
            - paragraph [ref=e146]: I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.
            - generic [ref=e147]:
              - paragraph [ref=e148]: I didn't truly love myself
              - paragraph [ref=e149]: until I was 33.
              - paragraph [ref=e150]: Before that, I woke up
              - paragraph [ref=e151]: every day wishing
              - paragraph [ref=e152]: I could be someone else.
              - paragraph [ref=e153]: That fear of abandonment
              - paragraph [ref=e154]: ran my life.
              - paragraph [ref=e155]: Then something shifted
              - paragraph [ref=e156]: and for the first time,
              - paragraph [ref=e157]: I didn't want to be
              - paragraph [ref=e158]: anyone else.
            - paragraph [ref=e159]: My journey has not been simple. Childhood was shaped by family violence, an abusive father and a mother who struggled to regulate overwhelming emotion. In adulthood I survived abusive relationships, coercive control, addiction, PTSD and the loss of Mum. Each time life knocked me down, music gave me a way to stand again.
            - paragraph [ref=e160]: "The stages kept coming: I twice reached the grand final of Adelaide's Search for a Star, reached the Top 100 of Australian Idol, performed as a drag artist and opened Feast Festival in 2012. But the purpose is not trophies or fame. It is finding the voice I was denied and using it to reach someone else."
            - paragraph [ref=e161]: I'm Still Here brings that purpose together. It is for the person searching for a song that can say what they cannot yet say, and for anyone who needs proof that being knocked down is not the end of the story.
        - generic [ref=e163]:
          - generic [ref=e164]:
            - paragraph [ref=e165]: For Press
            - heading "Digital Press Kit" [level=2] [ref=e166]
          - generic [ref=e169]:
            - generic [ref=e170]:
              - paragraph [ref=e171]: Mission
              - paragraph [ref=e172]: To reach people who need a voice or a song for what they cannot yet say through independent, emotionally honest music and storytelling.
              - paragraph [ref=e174]: Biography
              - paragraph [ref=e175]: Gannon Waye is an Adelaide-born, Melbourne-based independent singer songwriter. Raised without access to formal music lessons, he built his voice through school choirs, church, worship ministry, drag performance and community stages. His contemporary pop work transforms grief, family violence, abusive relationships, addiction, PTSD and rebuilding into honest music for people who need to feel less alone.
              - generic [ref=e176]:
                - link "Full Press Kit" [ref=e177] [cursor=pointer]:
                  - /url: /press-kit
                  - button "Full Press Kit" [ref=e178]:
                    - img
                    - text: Full Press Kit
                - link "Press & Booking" [ref=e179] [cursor=pointer]:
                  - /url: /press
                  - button "Press & Booking" [ref=e180]:
                    - text: Press & Booking
                    - img
            - generic [ref=e181]:
              - paragraph [ref=e182]: Headshots
              - img "Gannon Waye" [ref=e185]
              - paragraph [ref=e186]: High-resolution images available on request
        - generic [ref=e188]:
          - paragraph [ref=e189]: Official Merch Boutique
          - heading "Enter the Gannon Waye Store" [level=2] [ref=e190]
          - paragraph [ref=e191]:
            - text: Shop the available
            - emphasis [ref=e192]: Respect Is Earned
            - text: hoodie
            - text: and the Thankyou journal, pen and thermos flask bundle.
          - generic [ref=e195]: ✦
          - generic [ref=e197]:
            - button "Enter the Store ✦" [ref=e198] [cursor=pointer]
            - button "View Current Stock →" [ref=e199] [cursor=pointer]
          - generic [ref=e200]:
            - button "\"Respect Is Earned\" Hoodie — Dark Grey · $98" [ref=e201] [cursor=pointer]
            - button "Thank You Journal Pen and Thermos Flask Bundle · $59" [ref=e202] [cursor=pointer]
        - generic [ref=e206]:
          - generic [ref=e207]:
            - img [ref=e208]
            - paragraph [ref=e210]: The Thank You Project
          - heading "Be Part of the Story" [level=2] [ref=e211]
          - paragraph [ref=e212]: Listen to the music, explore the current merchandise, and share the story with someone who may need it.
          - generic [ref=e213]:
            - link "Listen Official music" [ref=e214] [cursor=pointer]:
              - /url: /music
              - generic [ref=e215]:
                - img [ref=e216]
                - paragraph [ref=e220]: Listen
                - paragraph [ref=e221]: Official music
            - link "Shop Current merchandise" [ref=e222] [cursor=pointer]:
              - /url: /store
              - generic [ref=e223]:
                - img [ref=e224]
                - paragraph [ref=e227]: Shop
                - paragraph [ref=e228]: Current merchandise
            - link "Follow Creative updates" [ref=e229] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
              - generic [ref=e230]:
                - img [ref=e231]
                - paragraph [ref=e237]: Follow
                - paragraph [ref=e238]: Creative updates
          - generic [ref=e239]:
            - link "Visit the Store" [ref=e240] [cursor=pointer]:
              - /url: /store
              - button "Visit the Store" [ref=e241]:
                - img
                - text: Visit the Store
            - link "Listen to Music" [ref=e242] [cursor=pointer]:
              - /url: /music
              - button "Listen to Music" [ref=e243]:
                - img
                - text: Listen to Music
        - generic [ref=e246]:
          - img [ref=e247]
          - paragraph [ref=e250]: Stay Connected
          - heading "Join the Update List" [level=2] [ref=e251]
          - paragraph [ref=e252]: Receive occasional updates about new music, current merchandise, and Gannon's creative work.
          - generic [ref=e253]:
            - generic [ref=e254]: Full name
            - textbox "Full name" [ref=e255]:
              - /placeholder: Your full name
            - generic [ref=e256]: Email address
            - textbox "Email address" [ref=e257]
            - generic [ref=e258] [cursor=pointer]:
              - checkbox "I would like to receive music and merchandise updates from Gannon Waye. I can unsubscribe at any time." [ref=e259]
              - generic [ref=e260]: I would like to receive music and merchandise updates from Gannon Waye. I can unsubscribe at any time.
            - button "Join the Update List" [ref=e261] [cursor=pointer]
        - generic [ref=e265]:
          - img [ref=e267]
          - paragraph [ref=e269]: A Safe Space
          - heading "You Are Not Alone" [level=2] [ref=e270]
          - paragraph [ref=e271]: This space was built for anyone who has ever felt unseen, misunderstood, or too much for the world around them. Whether you're here for the music, for the message, or because something in a lyric hit a little too close to home, you belong here.
          - paragraph [ref=e272]: No judgement. No noise. Just connection.
          - link "Join the Community" [ref=e274] [cursor=pointer]:
            - /url: /community
            - button "Join the Community" [ref=e275]:
              - text: Join the Community
              - img
          - generic [ref=e276]:
            - paragraph [ref=e277]: If you need support right now
            - paragraph [ref=e278]:
              - text: Australia · Lifeline
              - link "13 11 14" [ref=e279] [cursor=pointer]:
                - /url: tel:131114
              - text: · 1800RESPECT
              - link "1800 737 732" [ref=e280] [cursor=pointer]:
                - /url: tel:1800737732
              - text: · Beyond Blue
              - link "1300 22 4636" [ref=e281] [cursor=pointer]:
                - /url: tel:1300224636
    - contentinfo [ref=e282]:
      - generic [ref=e283]:
        - generic [ref=e284]:
          - generic [ref=e285]:
            - img "Gannon Waye" [ref=e286]
            - paragraph [ref=e287]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
          - generic [ref=e288]:
            - heading "Navigate" [level=4] [ref=e289]
            - generic [ref=e290]:
              - link "Home" [ref=e291] [cursor=pointer]:
                - /url: /
              - link "Biography" [ref=e292] [cursor=pointer]:
                - /url: /biography
              - link "Music" [ref=e293] [cursor=pointer]:
                - /url: /music
              - link "Lyrics" [ref=e294] [cursor=pointer]:
                - /url: /lyrics
              - link "Store" [ref=e295] [cursor=pointer]:
                - /url: /store
              - link "Press" [ref=e296] [cursor=pointer]:
                - /url: /press
              - link "Mum Tribute" [ref=e297] [cursor=pointer]:
                - /url: /remember-mum
              - link "Contact" [ref=e298] [cursor=pointer]:
                - /url: /contact
          - generic [ref=e299]:
            - heading "Contact" [level=4] [ref=e300]
            - paragraph [ref=e301]: For music, media, collaboration, and business enquiries
            - link "gannonwayemusic@gmail.com" [ref=e302] [cursor=pointer]:
              - /url: mailto:gannonwayemusic@gmail.com
            - heading "Legal" [level=4] [ref=e303]
            - generic [ref=e304]:
              - link "Privacy Policy" [ref=e305] [cursor=pointer]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e306] [cursor=pointer]:
                - /url: /terms-of-service
            - heading "Social" [level=4] [ref=e307]
            - generic [ref=e308]:
              - link "Instagram @gann0nwaye" [ref=e309] [cursor=pointer]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e310] [cursor=pointer]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e311] [cursor=pointer]:
                - /url: https://www.youtube.com/@gannonwayeofficial
        - generic [ref=e312]:
          - paragraph [ref=e313]: Stay connected
          - heading "Music and merchandise updates" [level=3] [ref=e314]
          - paragraph [ref=e315]: One clear signup form, with explicit consent, is available on the home page.
          - link "Join the Update List" [ref=e316] [cursor=pointer]:
            - /url: /#updates
        - generic [ref=e317]:
          - paragraph [ref=e318]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
          - paragraph [ref=e319]: © 2026 Gannon Waye. All rights reserved.
    - navigation [ref=e320]:
      - generic [ref=e321]:
        - link "Home" [ref=e322] [cursor=pointer]:
          - /url: /
          - generic [ref=e324]:
            - img [ref=e325]
            - generic [ref=e328]: Home
        - link "Music" [ref=e329] [cursor=pointer]:
          - /url: /music
          - generic [ref=e330]:
            - img [ref=e331]
            - generic [ref=e335]: Music
        - link "Store" [ref=e336] [cursor=pointer]:
          - /url: /store
          - generic [ref=e337]:
            - img [ref=e338]
            - generic [ref=e341]: Store
        - link "Lyrics" [ref=e342] [cursor=pointer]:
          - /url: /lyrics
          - generic [ref=e343]:
            - img [ref=e344]
            - generic [ref=e347]: Lyrics
        - link "Contact" [ref=e348] [cursor=pointer]:
          - /url: /contact
          - generic [ref=e349]:
            - img [ref=e350]
            - generic [ref=e353]: Contact
```

# Test source

```ts
  20  | ];
  21  | 
  22  | async function expectDocumentCanScroll(page, distance) {
  23  |   await page.evaluate(() => window.scrollTo(0, 0));
  24  |   await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  25  | 
  26  |   const viewport = page.viewportSize();
  27  |   await page.mouse.move(
  28  |     Math.floor((viewport?.width || 320) / 2),
  29  |     Math.floor((viewport?.height || 568) / 2),
  30  |   );
  31  |   await page.mouse.wheel(0, distance);
  32  | 
  33  |   await expect.poll(
  34  |     () => page.evaluate(() => window.scrollY),
  35  |     { message: 'The page must respond to a real wheel/trackpad scroll gesture.' },
  36  |   ).toBeGreaterThan(20);
  37  | }
  38  | 
  39  | async function expectNoFullscreenBlocker(page) {
  40  |   const blockers = await page.evaluate(() => {
  41  |     const viewportWidth = window.innerWidth;
  42  |     const viewportHeight = window.innerHeight;
  43  | 
  44  |     return Array.from(document.querySelectorAll('body *'))
  45  |       .filter((element) => {
  46  |         const style = window.getComputedStyle(element);
  47  |         const rect = element.getBoundingClientRect();
  48  |         const visible = style.display !== 'none'
  49  |           && style.visibility !== 'hidden'
  50  |           && Number(style.opacity || 1) > 0
  51  |           && style.pointerEvents !== 'none';
  52  |         return visible
  53  |           && style.position === 'fixed'
  54  |           && rect.width >= viewportWidth * 0.9
  55  |           && rect.height >= viewportHeight * 0.9;
  56  |       })
  57  |       .map((element) => ({
  58  |         tag: element.tagName.toLowerCase(),
  59  |         role: element.getAttribute('role'),
  60  |         label: element.getAttribute('aria-label'),
  61  |         testId: element.getAttribute('data-testid'),
  62  |         className: String(element.getAttribute('class') || '').slice(0, 160),
  63  |       }));
  64  |   });
  65  | 
  66  |   expect(blockers, 'No closed dialog or drawer may keep a viewport-sized click blocker mounted.').toEqual([]);
  67  | }
  68  | 
  69  | test.describe('Mobile home remains operable at supported phone sizes', () => {
  70  |   for (const viewport of VIEWPORTS) {
  71  |     test(`${viewport.name}: onboarding, navigation and fixed UI do not freeze scrolling`, async ({ page }) => {
  72  |       test.setTimeout(90_000);
  73  |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  74  | 
  75  |       // Force the real first-visit path for every viewport. This runs before app code.
  76  |       await page.addInitScript((key) => {
  77  |         try {
  78  |           window.localStorage.removeItem(key);
  79  |         } catch {
  80  |           // Storage can be unavailable in hardened browsers. The component handles this too.
  81  |         }
  82  |       }, FIRST_VISIT_KEY);
  83  | 
  84  |       await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  85  |       await expect(page.locator('main')).toBeVisible();
  86  |       await expect.poll(
  87  |         () => page.evaluate(() => document.documentElement.scrollHeight),
  88  |         { timeout: 20_000, message: 'The home page must render enough content to scroll.' },
  89  |       ).toBeGreaterThan(viewport.height + 100);
  90  | 
  91  |       const welcome = page.getByRole('dialog', { name: /This is more than music/i });
  92  |       await expect(welcome).toBeVisible({ timeout: 8_000 });
  93  | 
  94  |       const welcomeMetrics = await welcome.evaluate((element) => ({
  95  |         clientHeight: element.clientHeight,
  96  |         scrollHeight: element.scrollHeight,
  97  |       }));
  98  | 
  99  |       if (welcomeMetrics.scrollHeight > welcomeMetrics.clientHeight + 2) {
  100 |         await welcome.hover();
  101 |         await page.mouse.wheel(0, Math.max(360, viewport.height));
  102 |         await expect.poll(
  103 |           () => welcome.evaluate((element) => element.scrollTop),
  104 |           { message: 'The first-visit guide must scroll when its content exceeds the viewport.' },
  105 |         ).toBeGreaterThan(0);
  106 |       }
  107 | 
  108 |       const dismissWelcome = page.getByRole('button', { name: /Just exploring/i });
  109 |       await dismissWelcome.scrollIntoViewIfNeeded();
  110 |       await dismissWelcome.click();
  111 |       await expect(welcome).toBeHidden();
  112 |       await expect.poll(() => page.evaluate((key) => window.localStorage.getItem(key), FIRST_VISIT_KEY)).toBe('1');
  113 | 
  114 |       await expectDocumentCanScroll(page, Math.max(420, viewport.height));
  115 | 
  116 |       // Search is another full-screen overlay. It must always expose a working close control.
  117 |       await page.getByRole('button', { name: 'Search the site' }).click();
  118 |       const searchDialog = page.getByRole('dialog', { name: 'Search the Gannon Waye site' });
  119 |       await expect(searchDialog).toBeVisible();
> 120 |       await searchDialog.getByRole('button', { name: 'Close search' }).click();
      |                                                                        ^ Error: locator.click: Test timeout of 90000ms exceeded.
  121 |       await expect(searchDialog).toBeHidden();
  122 | 
  123 |       // The cart backdrop and drawer must not remain mounted after the drawer is closed.
  124 |       await page.getByRole('button', { name: 'Open cart' }).click();
  125 |       const cartDrawer = page.locator('[data-testid="cart-drawer"]');
  126 |       await expect(cartDrawer).toBeVisible();
  127 |       await cartDrawer.locator('button').first().click();
  128 |       await expect(cartDrawer).toBeHidden();
  129 | 
  130 |       const mobileMenuButton = page.getByRole('button', { name: 'Open navigation menu' });
  131 |       const mobileMenu = page.locator('#mobile-navigation-menu');
  132 | 
  133 |       if (viewport.width < 768) {
  134 |         await expect(mobileMenuButton).toBeVisible();
  135 |         await mobileMenuButton.click();
  136 |         await expect(mobileMenu).toBeVisible();
  137 |         await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
  138 | 
  139 |         const menuMetrics = await mobileMenu.evaluate((element) => ({
  140 |           clientHeight: element.clientHeight,
  141 |           scrollHeight: element.scrollHeight,
  142 |         }));
  143 | 
  144 |         if (menuMetrics.scrollHeight > menuMetrics.clientHeight + 2) {
  145 |           await mobileMenu.evaluate((element) => {
  146 |             element.scrollTop = element.scrollHeight;
  147 |           });
  148 |           await expect.poll(
  149 |             () => mobileMenu.evaluate((element) => element.scrollTop),
  150 |             { message: 'The expanded mobile menu must scroll on short screens.' },
  151 |           ).toBeGreaterThan(0);
  152 |           await expect(mobileMenu.getByRole('link', { name: 'My Profile' })).toBeVisible();
  153 |         }
  154 | 
  155 |         await page.getByRole('button', { name: 'Close navigation menu' }).click();
  156 |         await expect(mobileMenu).toBeHidden();
  157 |         await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  158 |       } else {
  159 |         // Wide phone landscape switches to the desktop navigation intentionally.
  160 |         await expect(mobileMenuButton).toBeHidden();
  161 |         await expect(page.getByRole('button', { name: 'Open more navigation links' })).toBeVisible();
  162 |       }
  163 | 
  164 |       await expectNoFullscreenBlocker(page);
  165 |       await expectDocumentCanScroll(page, Math.max(420, viewport.height));
  166 | 
  167 |       await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  168 |       await expect.poll(
  169 |         () => page.evaluate(() => {
  170 |           const scroller = document.scrollingElement || document.documentElement;
  171 |           return Math.abs((scroller.scrollHeight - window.innerHeight) - window.scrollY);
  172 |         }),
  173 |         { message: 'The page must reach its maximum scroll position before overlap checks.' },
  174 |       ).toBeLessThan(3);
  175 | 
  176 |       const bottomTabs = page.locator('nav.fixed.bottom-0');
  177 |       if (viewport.width < 768) {
  178 |         await expect(bottomTabs).toBeVisible();
  179 |         const footerAndTabs = await page.evaluate(() => {
  180 |           const footer = document.querySelector('footer');
  181 |           const tabs = document.querySelector('nav.fixed.bottom-0');
  182 |           if (!footer || !tabs) return null;
  183 |           const footerRect = footer.getBoundingClientRect();
  184 |           const tabsRect = tabs.getBoundingClientRect();
  185 |           return {
  186 |             footerBottom: footerRect.bottom,
  187 |             tabsTop: tabsRect.top,
  188 |             overlaps: footerRect.bottom > tabsRect.top + 1,
  189 |           };
  190 |         });
  191 |         expect(footerAndTabs).not.toBeNull();
  192 |         expect(footerAndTabs.overlaps, 'Bottom navigation must not cover the footer at maximum scroll.').toBe(false);
  193 |       } else {
  194 |         await expect(bottomTabs).toBeHidden();
  195 |       }
  196 |     });
  197 |   }
  198 | });
  199 | 
```