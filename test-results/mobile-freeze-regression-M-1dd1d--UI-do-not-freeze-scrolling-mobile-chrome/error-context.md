# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-freeze-regression.spec.js >> Mobile home remains operable at supported phone sizes >> 430x932 portrait: onboarding, navigation and fixed UI do not freeze scrolling
- Location: src/gannonwaye-playwright-pack/tests/mobile-freeze-regression.spec.js:71:5

# Error details

```
Error: The expanded mobile menu must scroll on short screens.

The expanded mobile menu must scroll on short screens.

expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0

Call Log:
- Timeout 10000ms exceeded while waiting on the predicate
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
          - button "Close navigation menu" [expanded] [active] [ref=e20] [cursor=pointer]:
            - img [ref=e21]
      - generic [ref=e25]:
        - link "Home" [ref=e26] [cursor=pointer]:
          - /url: /
        - link "Biography" [ref=e27] [cursor=pointer]:
          - /url: /biography
        - link "Music" [ref=e28] [cursor=pointer]:
          - /url: /music
        - link "Store" [ref=e29] [cursor=pointer]:
          - /url: /store
        - link "Mum's Garden" [ref=e30] [cursor=pointer]:
          - /url: /mums-garden
        - link "Press" [ref=e31] [cursor=pointer]:
          - /url: /press
        - link "Contact" [ref=e32] [cursor=pointer]:
          - /url: /contact
        - paragraph [ref=e33]: More
        - link "My Story" [ref=e34] [cursor=pointer]:
          - /url: /this-is-my-life
        - link "Videos" [ref=e35] [cursor=pointer]:
          - /url: /videos
        - link "Lyric Library" [ref=e36] [cursor=pointer]:
          - /url: /lyric-library
        - link "Discover Music" [ref=e37] [cursor=pointer]:
          - /url: /discover
        - link "Fan Reminders" [ref=e38] [cursor=pointer]:
          - /url: /fan-reminders
        - link "FAQ" [ref=e39] [cursor=pointer]:
          - /url: /faq
        - link "Orders" [ref=e40] [cursor=pointer]:
          - /url: /orders
        - link "My Profile" [ref=e41] [cursor=pointer]:
          - /url: /fan-profile
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
                  - link "Gannon Waye Music, Gannon Waye" [ref=e53] [cursor=pointer]:
                    - /url: /music
                    - img "Gannon Waye Music, Gannon Waye" [ref=e54]
                  - paragraph [ref=e55]: Music is shared here only when it is ready.
                - generic [ref=e56]:
                  - link "Wear the Message" [ref=e58] [cursor=pointer]:
                    - /url: /store
                    - button "Wear the Message" [ref=e59]
                  - link "Work with Me" [ref=e61] [cursor=pointer]:
                    - /url: /contact
                    - button "Work with Me" [ref=e62]
              - generic [ref=e63]:
                - generic [ref=e68]:
                  - generic [ref=e69]:
                    - generic [ref=e73]: Gannon Waye Music
                    - generic [ref=e74]: Official artist site
                  - paragraph [ref=e76]: Verified merchandise is available through the official Store
                  - link "Explore the Music page" [ref=e78] [cursor=pointer]:
                    - /url: /music
                - generic [ref=e79]:
                  - paragraph [ref=e80]: WELCOME
                  - paragraph [ref=e81]: I'm an Adelaide-born singer-songwriter now based in Melbourne. I grew up without access to formal music lessons, so I found my voice through school choirs, church, worship ministry, drag performance and every stage that would have me. After family violence, abusive relationships, addiction, PTSD and losing Mum, I returned to music with a purpose. I'm Still Here is not a search for fame. It is for anyone who needs a song to say what they cannot yet say. This is independent, heart-first art. You are not alone here.
          - generic:
            - generic: Scroll
        - generic [ref=e83]:
          - generic [ref=e84]:
            - generic [ref=e85]: Independent, heart-first music from Gannon Waye
            - generic [ref=e86]: ◆
            - generic [ref=e87]: Music approved for public sharing appears on the Music page
            - generic [ref=e88]: ◆
            - generic [ref=e89]: The Store shows only current owner-approved stock
            - generic [ref=e90]: ◆
            - generic [ref=e91]: New music is shared only when it is ready
            - generic [ref=e92]: ◆
            - generic [ref=e93]: Join the community and follow the story
            - generic [ref=e94]: ◆
          - generic [ref=e95]:
            - generic [ref=e96]: Independent, heart-first music from Gannon Waye
            - generic [ref=e97]: ◆
            - generic [ref=e98]: Music approved for public sharing appears on the Music page
            - generic [ref=e99]: ◆
            - generic [ref=e100]: The Store shows only current owner-approved stock
            - generic [ref=e101]: ◆
            - generic [ref=e102]: New music is shared only when it is ready
            - generic [ref=e103]: ◆
            - generic [ref=e104]: Join the community and follow the story
            - generic [ref=e105]: ◆
        - generic [ref=e107]:
          - generic [ref=e108]:
            - paragraph [ref=e109]: About
            - heading "The Story" [level=2] [ref=e110]
          - generic [ref=e111]:
            - paragraph [ref=e112]: "I was born and raised in Adelaide and now call Melbourne home. We did not have the money for formal music lessons, no matter how often I asked, cried or begged, but that never weakened the drive. I learned by taking every chance available: leading school choirs, singing in church and eventually serving as a worship minister."
            - paragraph [ref=e113]: I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
            - paragraph [ref=e114]: I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.
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
            - paragraph [ref=e127]: My journey has not been simple. Childhood was shaped by family violence, an abusive father and a mother who struggled to regulate overwhelming emotion. In adulthood I survived abusive relationships, coercive control, addiction, PTSD and the loss of Mum. Each time life knocked me down, music gave me a way to stand again.
            - paragraph [ref=e128]: "The stages kept coming: I twice reached the grand final of Adelaide's Search for a Star, reached the Top 100 of Australian Idol, performed as a drag artist and opened Feast Festival in 2012. But the purpose is not trophies or fame. It is finding the voice I was denied and using it to reach someone else."
            - paragraph [ref=e129]: I'm Still Here brings that purpose together. It is for the person searching for a song that can say what they cannot yet say, and for anyone who needs proof that being knocked down is not the end of the story.
        - generic [ref=e131]:
          - generic [ref=e132]:
            - paragraph [ref=e133]: For Press
            - heading "Digital Press Kit" [level=2] [ref=e134]
          - generic [ref=e137]:
            - generic [ref=e138]:
              - paragraph [ref=e139]: Mission
              - paragraph [ref=e140]: To reach people who need a voice or a song for what they cannot yet say through independent, emotionally honest music and storytelling.
              - paragraph [ref=e142]: Biography
              - paragraph [ref=e143]: Gannon Waye is an Adelaide-born, Melbourne-based independent singer songwriter. Raised without access to formal music lessons, he built his voice through school choirs, church, worship ministry, drag performance and community stages. His contemporary pop work transforms grief, family violence, abusive relationships, addiction, PTSD and rebuilding into honest music for people who need to feel less alone.
              - generic [ref=e144]:
                - link "Full Press Kit" [ref=e145] [cursor=pointer]:
                  - /url: /press-kit
                  - button "Full Press Kit" [ref=e146]:
                    - img
                    - text: Full Press Kit
                - link "Press & Booking" [ref=e147] [cursor=pointer]:
                  - /url: /press
                  - button "Press & Booking" [ref=e148]:
                    - text: Press & Booking
                    - img
            - generic [ref=e149]:
              - paragraph [ref=e150]: Headshots
              - img "Gannon Waye" [ref=e153]
              - paragraph [ref=e154]: High-resolution images available on request
        - generic [ref=e156]:
          - paragraph [ref=e157]: Official Merch Boutique
          - heading "Enter the Gannon Waye Store" [level=2] [ref=e158]
          - paragraph [ref=e159]:
            - text: Shop the available
            - emphasis [ref=e160]: Respect Is Earned
            - text: hoodie
            - text: and the Thankyou journal, pen and thermos flask bundle.
          - generic [ref=e163]: ✦
          - generic [ref=e165]:
            - button "Enter the Store ✦" [ref=e166] [cursor=pointer]
            - button "View Current Stock →" [ref=e167] [cursor=pointer]
          - generic [ref=e168]:
            - button "\"Respect Is Earned\" Hoodie — Dark Grey · $98" [ref=e169] [cursor=pointer]
            - button "Thank You Journal Pen and Thermos Flask Bundle · $59" [ref=e170] [cursor=pointer]
        - generic [ref=e174]:
          - generic [ref=e175]:
            - img [ref=e176]
            - paragraph [ref=e178]: The Thank You Project
          - heading "Be Part of the Story" [level=2] [ref=e179]
          - paragraph [ref=e180]: Listen to the music, explore the current merchandise, and share the story with someone who may need it.
          - generic [ref=e181]:
            - link "Listen Official music" [ref=e182] [cursor=pointer]:
              - /url: /music
              - generic [ref=e183]:
                - img [ref=e184]
                - paragraph [ref=e188]: Listen
                - paragraph [ref=e189]: Official music
            - link "Shop Current merchandise" [ref=e190] [cursor=pointer]:
              - /url: /store
              - generic [ref=e191]:
                - img [ref=e192]
                - paragraph [ref=e195]: Shop
                - paragraph [ref=e196]: Current merchandise
            - link "Follow Creative updates" [ref=e197] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
              - generic [ref=e198]:
                - img [ref=e199]
                - paragraph [ref=e205]: Follow
                - paragraph [ref=e206]: Creative updates
          - generic [ref=e207]:
            - link "Visit the Store" [ref=e208] [cursor=pointer]:
              - /url: /store
              - button "Visit the Store" [ref=e209]:
                - img
                - text: Visit the Store
            - link "Listen to Music" [ref=e210] [cursor=pointer]:
              - /url: /music
              - button "Listen to Music" [ref=e211]:
                - img
                - text: Listen to Music
        - generic [ref=e214]:
          - img [ref=e215]
          - paragraph [ref=e218]: Stay Connected
          - heading "Join the Update List" [level=2] [ref=e219]
          - paragraph [ref=e220]: Receive occasional updates about new music, current merchandise, and Gannon's creative work.
          - generic [ref=e221]:
            - generic [ref=e222]: Full name
            - textbox "Full name" [ref=e223]:
              - /placeholder: Your full name
            - generic [ref=e224]: Email address
            - textbox "Email address" [ref=e225]
            - generic [ref=e226] [cursor=pointer]:
              - checkbox "I would like to receive music and merchandise updates from Gannon Waye. I can unsubscribe at any time." [ref=e227]
              - generic [ref=e228]: I would like to receive music and merchandise updates from Gannon Waye. I can unsubscribe at any time.
            - button "Join the Update List" [ref=e229] [cursor=pointer]
        - generic [ref=e233]:
          - img [ref=e235]
          - paragraph [ref=e237]: A Safe Space
          - heading "You Are Not Alone" [level=2] [ref=e238]
          - paragraph [ref=e239]: This space was built for anyone who has ever felt unseen, misunderstood, or too much for the world around them. Whether you're here for the music, for the message, or because something in a lyric hit a little too close to home, you belong here.
          - paragraph [ref=e240]: No judgement. No noise. Just connection.
          - link "Join the Community" [ref=e242] [cursor=pointer]:
            - /url: /community
            - button "Join the Community" [ref=e243]:
              - text: Join the Community
              - img
          - generic [ref=e244]:
            - paragraph [ref=e245]: If you need support right now
            - paragraph [ref=e246]:
              - text: Australia · Lifeline
              - link "13 11 14" [ref=e247] [cursor=pointer]:
                - /url: tel:131114
              - text: · 1800RESPECT
              - link "1800 737 732" [ref=e248] [cursor=pointer]:
                - /url: tel:1800737732
              - text: · Beyond Blue
              - link "1300 22 4636" [ref=e249] [cursor=pointer]:
                - /url: tel:1300224636
    - contentinfo [ref=e250]:
      - generic [ref=e251]:
        - generic [ref=e252]:
          - generic [ref=e253]:
            - img "Gannon Waye" [ref=e254]
            - paragraph [ref=e255]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
          - generic [ref=e256]:
            - heading "Navigate" [level=4] [ref=e257]
            - generic [ref=e258]:
              - link "Home" [ref=e259] [cursor=pointer]:
                - /url: /
              - link "Biography" [ref=e260] [cursor=pointer]:
                - /url: /biography
              - link "Music" [ref=e261] [cursor=pointer]:
                - /url: /music
              - link "Lyrics" [ref=e262] [cursor=pointer]:
                - /url: /lyrics
              - link "Store" [ref=e263] [cursor=pointer]:
                - /url: /store
              - link "Press" [ref=e264] [cursor=pointer]:
                - /url: /press
              - link "Mum Tribute" [ref=e265] [cursor=pointer]:
                - /url: /remember-mum
              - link "Contact" [ref=e266] [cursor=pointer]:
                - /url: /contact
          - generic [ref=e267]:
            - heading "Contact" [level=4] [ref=e268]
            - paragraph [ref=e269]: For music, media, collaboration, and business enquiries
            - link "gannonwayemusic@gmail.com" [ref=e270] [cursor=pointer]:
              - /url: mailto:gannonwayemusic@gmail.com
            - heading "Legal" [level=4] [ref=e271]
            - generic [ref=e272]:
              - link "Privacy Policy" [ref=e273] [cursor=pointer]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e274] [cursor=pointer]:
                - /url: /terms-of-service
            - heading "Social" [level=4] [ref=e275]
            - generic [ref=e276]:
              - link "Instagram @gann0nwaye" [ref=e277] [cursor=pointer]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e278] [cursor=pointer]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e279] [cursor=pointer]:
                - /url: https://www.youtube.com/@gannonwayeofficial
        - generic [ref=e280]:
          - paragraph [ref=e281]: Stay connected
          - heading "Music and merchandise updates" [level=3] [ref=e282]
          - paragraph [ref=e283]: One clear signup form, with explicit consent, is available on the home page.
          - link "Join the Update List" [ref=e284] [cursor=pointer]:
            - /url: /#updates
        - generic [ref=e285]:
          - paragraph [ref=e286]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
          - paragraph [ref=e287]: © 2026 Gannon Waye. All rights reserved.
    - navigation [ref=e288]:
      - generic [ref=e289]:
        - link "Home" [ref=e290] [cursor=pointer]:
          - /url: /
          - generic [ref=e292]:
            - img [ref=e293]
            - generic [ref=e296]: Home
        - link "Music" [ref=e297] [cursor=pointer]:
          - /url: /music
          - generic [ref=e298]:
            - img [ref=e299]
            - generic [ref=e303]: Music
        - link "Store" [ref=e304] [cursor=pointer]:
          - /url: /store
          - generic [ref=e305]:
            - img [ref=e306]
            - generic [ref=e309]: Store
        - link "Lyrics" [ref=e310] [cursor=pointer]:
          - /url: /lyrics
          - generic [ref=e311]:
            - img [ref=e312]
            - generic [ref=e315]: Lyrics
        - link "Contact" [ref=e316] [cursor=pointer]:
          - /url: /contact
          - generic [ref=e317]:
            - img [ref=e318]
            - generic [ref=e321]: Contact
```

# Test source

```ts
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
  120 |       await searchDialog.getByRole('button', { name: 'Close search' }).click();
  121 |       await expect(searchDialog).toBeHidden();
  122 | 
  123 |       // The cart backdrop and drawer must not remain mounted after the drawer is closed.
  124 |       await page.getByRole('button', { name: 'Open cart' }).click();
  125 |       const cartDrawer = page.locator('[data-testid="cart-drawer"]');
  126 |       await expect(cartDrawer).toBeVisible();
  127 |       await cartDrawer.locator('button').first().click();
  128 |       await expect(cartDrawer).toBeHidden();
  129 | 
  130 |       const mobileMenuButton = page.locator('button[aria-controls="mobile-navigation-menu"]');
  131 |       const mobileMenu = page.locator('#mobile-navigation-menu');
  132 | 
  133 |       if (viewport.width < 768) {
  134 |         await expect(mobileMenuButton).toBeVisible();
  135 |         await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  136 |         await mobileMenuButton.click();
  137 |         await expect(mobileMenu).toBeVisible();
  138 |         await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
  139 | 
  140 |         const menuMetrics = await mobileMenu.evaluate((element) => ({
  141 |           clientHeight: element.clientHeight,
  142 |           scrollHeight: element.scrollHeight,
  143 |         }));
  144 | 
  145 |         if (menuMetrics.scrollHeight > menuMetrics.clientHeight + 2) {
  146 |           await mobileMenu.evaluate((element) => {
  147 |             element.scrollTop = element.scrollHeight;
  148 |           });
  149 |           await expect.poll(
  150 |             () => mobileMenu.evaluate((element) => element.scrollTop),
  151 |             { message: 'The expanded mobile menu must scroll on short screens.' },
> 152 |           ).toBeGreaterThan(0);
      |             ^ Error: The expanded mobile menu must scroll on short screens.
  153 |           await expect(mobileMenu.getByRole('link', { name: 'My Profile' })).toBeVisible();
  154 |         }
  155 | 
  156 |         await mobileMenuButton.click();
  157 |         await expect(mobileMenu).toBeHidden();
  158 |         await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
  159 |       } else {
  160 |         // Wide phone landscape switches to the desktop navigation intentionally.
  161 |         await expect(mobileMenuButton).toBeHidden();
  162 |         await expect(page.getByRole('button', { name: 'Open more navigation links' })).toBeVisible();
  163 |       }
  164 | 
  165 |       await expectNoFullscreenBlocker(page);
  166 |       await expectDocumentCanScroll(page, Math.max(420, viewport.height));
  167 | 
  168 |       await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  169 |       await expect.poll(
  170 |         () => page.evaluate(() => {
  171 |           const scroller = document.scrollingElement || document.documentElement;
  172 |           return Math.abs((scroller.scrollHeight - window.innerHeight) - window.scrollY);
  173 |         }),
  174 |         { message: 'The page must reach its maximum scroll position before overlap checks.' },
  175 |       ).toBeLessThan(3);
  176 | 
  177 |       const bottomTabs = page.locator('nav.fixed.bottom-0');
  178 |       if (viewport.width < 768) {
  179 |         await expect(bottomTabs).toBeVisible();
  180 |         const footerAndTabs = await page.evaluate(() => {
  181 |           const footer = document.querySelector('footer');
  182 |           const tabs = document.querySelector('nav.fixed.bottom-0');
  183 |           if (!footer || !tabs) return null;
  184 |           const footerRect = footer.getBoundingClientRect();
  185 |           const tabsRect = tabs.getBoundingClientRect();
  186 |           return {
  187 |             footerBottom: footerRect.bottom,
  188 |             tabsTop: tabsRect.top,
  189 |             overlaps: footerRect.bottom > tabsRect.top + 1,
  190 |           };
  191 |         });
  192 |         expect(footerAndTabs).not.toBeNull();
  193 |         expect(footerAndTabs.overlaps, 'Bottom navigation must not cover the footer at maximum scroll.').toBe(false);
  194 |       } else {
  195 |         await expect(bottomTabs).toBeHidden();
  196 |       }
  197 |     });
  198 |   }
  199 | });
  200 | 
```