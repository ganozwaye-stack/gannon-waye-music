# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-freeze-regression.spec.js >> Mobile home remains operable at supported phone sizes >> 320x568 portrait: onboarding, navigation and fixed UI do not freeze scrolling
- Location: src/gannonwaye-playwright-pack/tests/mobile-freeze-regression.spec.js:71:5

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: getByRole('button', { name: 'Open navigation menu' })
Expected: "true"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" with timeout 10000ms
  - waiting for getByRole('button', { name: 'Open navigation menu' })

```

```yaml
- link "Support Now":
  - /url: /back-this
  - button "Support Now"
- navigation:
  - link "Gannon Waye · Home":
    - /url: /
  - button "Search the site":
    - img
  - button "Open cart":
    - img
  - button "Close navigation menu" [expanded]:
    - img
  - link "Home":
    - /url: /
  - link "Biography":
    - /url: /biography
  - link "Music":
    - /url: /music
  - link "Store":
    - /url: /store
  - link "Mum's Garden":
    - /url: /mums-garden
  - link "Press":
    - /url: /press
  - link "Contact":
    - /url: /contact
  - paragraph: More
  - link "My Story":
    - /url: /this-is-my-life
  - link "Videos":
    - /url: /videos
  - link "Lyric Library":
    - /url: /lyric-library
  - link "Discover Music":
    - /url: /discover
  - link "Fan Reminders":
    - /url: /fan-reminders
  - link "FAQ":
    - /url: /faq
  - link "Orders":
    - /url: /orders
  - link "My Profile":
    - /url: /fan-profile
- main:
  - heading "Gannon Waye" [level=1]
  - paragraph: Music
  - link "Gannon Waye Music, Gannon Waye":
    - /url: /music
    - img "Gannon Waye Music, Gannon Waye"
  - paragraph: Music is shared here only when it is ready.
  - link "Wear the Message":
    - /url: /store
    - button "Wear the Message"
  - link "Work with Me":
    - /url: /contact
    - button "Work with Me"
  - text: Gannon Waye Music Official artist site
  - paragraph: Independent, heart-first music from Gannon Waye
  - link "Explore the Music page":
    - /url: /music
  - paragraph: WELCOME
  - paragraph: I'm an Adelaide-born singer-songwriter now based in Melbourne. I grew up without access to formal music lessons, so I found my voice through school choirs, church, worship ministry, drag performance and every stage that would have me. After family violence, abusive relationships, addiction, PTSD and losing Mum, I returned to music with a purpose. I'm Still Here is not a search for fame. It is for anyone who needs a song to say what they cannot yet say. This is independent, heart-first art. You are not alone here.
  - text: Scroll Independent, heart-first music from Gannon Waye Music approved for public sharing appears on the Music page The Store shows only current owner-approved stock New music is shared only when it is ready Join the community and follow the story
  - paragraph: About
  - heading "The Story" [level=2]
  - paragraph: "I was born and raised in Adelaide and now call Melbourne home. We did not have the money for formal music lessons, no matter how often I asked, cried or begged, but that never weakened the drive. I learned by taking every chance available: leading school choirs, singing in church and eventually serving as a worship minister."
  - paragraph: I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
  - paragraph: I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.
  - paragraph: I didn't truly love myself
  - paragraph: until I was 33.
  - paragraph: Before that, I woke up
  - paragraph: every day wishing
  - paragraph: I could be someone else.
  - paragraph: That fear of abandonment
  - paragraph: ran my life.
  - paragraph: Then something shifted
  - paragraph: and for the first time,
  - paragraph: I didn't want to be
  - paragraph: anyone else.
  - paragraph: My journey has not been simple. Childhood was shaped by family violence, an abusive father and a mother who struggled to regulate overwhelming emotion. In adulthood I survived abusive relationships, coercive control, addiction, PTSD and the loss of Mum. Each time life knocked me down, music gave me a way to stand again.
  - paragraph: "The stages kept coming: I twice reached the grand final of Adelaide's Search for a Star, reached the Top 100 of Australian Idol, performed as a drag artist and opened Feast Festival in 2012. But the purpose is not trophies or fame. It is finding the voice I was denied and using it to reach someone else."
  - paragraph: I'm Still Here brings that purpose together. It is for the person searching for a song that can say what they cannot yet say, and for anyone who needs proof that being knocked down is not the end of the story.
  - paragraph: For Press
  - heading "Digital Press Kit" [level=2]
  - paragraph: Mission
  - paragraph: To reach people who need a voice or a song for what they cannot yet say through independent, emotionally honest music and storytelling.
  - paragraph: Biography
  - paragraph: Gannon Waye is an Adelaide-born, Melbourne-based independent singer songwriter. Raised without access to formal music lessons, he built his voice through school choirs, church, worship ministry, drag performance and community stages. His contemporary pop work transforms grief, family violence, abusive relationships, addiction, PTSD and rebuilding into honest music for people who need to feel less alone.
  - link "Full Press Kit":
    - /url: /press-kit
    - button "Full Press Kit":
      - img
      - text: Full Press Kit
  - link "Press & Booking":
    - /url: /press
    - button "Press & Booking":
      - text: Press & Booking
      - img
  - paragraph: Headshots
  - img "Gannon Waye"
  - paragraph: High-resolution images available on request
  - paragraph: Official Merch Boutique
  - heading "Enter the Gannon Waye Store" [level=2]
  - paragraph:
    - text: Shop the available
    - emphasis: Respect Is Earned
    - text: hoodie and the Thankyou journal, pen and thermos flask bundle.
  - text: ✦
  - button "Enter the Store ✦"
  - button "View Current Stock →"
  - button "\"Respect Is Earned\" Hoodie — Dark Grey · $98"
  - button "Thank You Journal Pen and Thermos Flask Bundle · $59"
  - img
  - paragraph: The Thank You Project
  - heading "Be Part of the Story" [level=2]
  - paragraph: Listen to the music, explore the current merchandise, and share the story with someone who may need it.
  - link "Listen Official music":
    - /url: /music
    - img
    - paragraph: Listen
    - paragraph: Official music
  - link "Shop Current merchandise":
    - /url: /store
    - img
    - paragraph: Shop
    - paragraph: Current merchandise
  - link "Follow Creative updates":
    - /url: https://www.instagram.com/gann0nwaye
    - img
    - paragraph: Follow
    - paragraph: Creative updates
  - link "Visit the Store":
    - /url: /store
    - button "Visit the Store":
      - img
      - text: Visit the Store
  - link "Listen to Music":
    - /url: /music
    - button "Listen to Music":
      - img
      - text: Listen to Music
  - img
  - paragraph: Stay Connected
  - heading "Join the Update List" [level=2]
  - paragraph: Receive occasional updates about new music, current merchandise, and Gannon's creative work.
  - text: Full name
  - textbox "Full name":
    - /placeholder: Your full name
  - text: Email address
  - textbox "Email address"
  - checkbox "I would like to receive music and merchandise updates from Gannon Waye. I can unsubscribe at any time."
  - text: I would like to receive music and merchandise updates from Gannon Waye. I can unsubscribe at any time.
  - button "Join the Update List"
  - img
  - paragraph: A Safe Space
  - heading "You Are Not Alone" [level=2]
  - paragraph: This space was built for anyone who has ever felt unseen, misunderstood, or too much for the world around them. Whether you're here for the music, for the message, or because something in a lyric hit a little too close to home, you belong here.
  - paragraph: No judgement. No noise. Just connection.
  - link "Join the Community":
    - /url: /community
    - button "Join the Community":
      - text: Join the Community
      - img
  - paragraph: If you need support right now
  - paragraph:
    - text: Australia · Lifeline
    - link "13 11 14":
      - /url: tel:131114
    - text: · 1800RESPECT
    - link "1800 737 732":
      - /url: tel:1800737732
    - text: · Beyond Blue
    - link "1300 22 4636":
      - /url: tel:1300224636
- contentinfo:
  - img "Gannon Waye"
  - paragraph: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
  - heading "Navigate" [level=4]
  - link "Home":
    - /url: /
  - link "Biography":
    - /url: /biography
  - link "Music":
    - /url: /music
  - link "Lyrics":
    - /url: /lyrics
  - link "Store":
    - /url: /store
  - link "Press":
    - /url: /press
  - link "Mum Tribute":
    - /url: /remember-mum
  - link "Contact":
    - /url: /contact
  - heading "Contact" [level=4]
  - paragraph: For music, media, collaboration, and business enquiries
  - link "gannonwayemusic@gmail.com":
    - /url: mailto:gannonwayemusic@gmail.com
  - heading "Legal" [level=4]
  - link "Privacy Policy":
    - /url: /privacy-policy
  - link "Terms of Service":
    - /url: /terms-of-service
  - heading "Social" [level=4]
  - link "Instagram @gann0nwaye":
    - /url: https://www.instagram.com/gann0nwaye
  - link "TikTok @gann0nwaye":
    - /url: https://www.tiktok.com/@gann0nwaye
  - link "YouTube @gannonwayeofficial":
    - /url: https://www.youtube.com/@gannonwayeofficial
  - paragraph: Stay connected
  - heading "Music and merchandise updates" [level=3]
  - paragraph: One clear signup form, with explicit consent, is available on the home page.
  - link "Join the Update List":
    - /url: /#updates
  - paragraph: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
  - paragraph: © 2026 Gannon Waye. All rights reserved.
- navigation:
  - link "Home":
    - /url: /
    - img
    - text: Home
  - link "Music":
    - /url: /music
    - img
    - text: Music
  - link "Store":
    - /url: /store
    - img
    - text: Store
  - link "Lyrics":
    - /url: /lyrics
    - img
    - text: Lyrics
  - link "Contact":
    - /url: /contact
    - img
    - text: Contact
```

# Test source

```ts
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
  130 |       const mobileMenuButton = page.getByRole('button', { name: 'Open navigation menu' });
  131 |       const mobileMenu = page.locator('#mobile-navigation-menu');
  132 | 
  133 |       if (viewport.width < 768) {
  134 |         await expect(mobileMenuButton).toBeVisible();
  135 |         await mobileMenuButton.click();
  136 |         await expect(mobileMenu).toBeVisible();
> 137 |         await expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');
      |                                        ^ Error: expect(locator).toHaveAttribute(expected) failed
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