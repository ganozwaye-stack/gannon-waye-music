# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-visuals.spec.js >> Store Visuals — Public safety checks >> homepage loads without console errors
- Location: src/gannonwaye-playwright-pack/tests/store-visuals.spec.js:36:7

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 12
Received array:  ["Failed to load resource: the server responded with a status of 404 (Not Found)", "[Base44 SDK Error] 404: Request failed with status code 404", "Warning: Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.%s data-source-location·
    at Row (http://localhost:5173/src/components/public/MarqueeBar.jsx:33:18)
    at div
    at MotionComponent (http://localhost:5173/node_modules/.vite/deps/framer-motion.js?v=584de14a:945:40)
    at div
    at MarqueeBar
    at div
    at Home (http://localhost:5173/src/pages/Home.jsx?t=1788366298667:47:30)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4131:5)
    at Outlet (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4537:26)
    at PresenceChild (http://localhost:5173/node_modules/.vite/deps/framer-motion.js?v=584de14a:121:24)
    at AnimatePresence (http://localhost:5173/node_modules/.vite/deps/framer-motion.js?v=584de14a:210:26)
    at main
    at div
    at PublicLayout (http://localhost:5173/src/components/public/PublicLayout.jsx?t=1788367174327:26:24)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4131:5)
    at Routes (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4601:5)
    at AuthenticatedApp (http://localhost:5173/src/App.jsx?t=1788367300924:334:82)
    at Router (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4544:15)
    at BrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:5290:5)
    at QueryClientProvider (http://localhost:5173/node_modules/.vite/deps/@tanstack_react-query.js?v=370b7003:3168:3)
    at AuthProvider (http://localhost:5173/src/lib/AuthContext.jsx?t=1788366298667:28:32)
    at App", "Warning: Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.%s data-source-location·
    at Row (http://localhost:5173/src/components/public/MarqueeBar.jsx:33:18)
    at div
    at MotionComponent (http://localhost:5173/node_modules/.vite/deps/framer-motion.js?v=584de14a:945:40)
    at div
    at MarqueeBar
    at div
    at Home (http://localhost:5173/src/pages/Home.jsx?t=1788366298667:47:30)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4131:5)
    at Outlet (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4537:26)
    at PresenceChild (http://localhost:5173/node_modules/.vite/deps/framer-motion.js?v=584de14a:121:24)
    at AnimatePresence (http://localhost:5173/node_modules/.vite/deps/framer-motion.js?v=584de14a:210:26)
    at main
    at div
    at PublicLayout (http://localhost:5173/src/components/public/PublicLayout.jsx?t=1788367174327:26:24)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4131:5)
    at Routes (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4601:5)
    at AuthenticatedApp (http://localhost:5173/src/App.jsx?t=1788367300924:334:82)
    at Router (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4544:15)
    at BrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:5290:5)
    at QueryClientProvider (http://localhost:5173/node_modules/.vite/deps/@tanstack_react-query.js?v=370b7003:3168:3)
    at AuthProvider (http://localhost:5173/src/lib/AuthContext.jsx?t=1788366298667:28:32)
    at App", "Warning: Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.%s data-source-location·
    at Row (http://localhost:5173/src/components/public/MarqueeBar.jsx:33:18)
    at div
    at MotionComponent (http://localhost:5173/node_modules/.vite/deps/framer-motion.js?v=584de14a:945:40)
    at div
    at MarqueeBar
    at div
    at Home (http://localhost:5173/src/pages/Home.jsx?t=1788366298667:47:30)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4131:5)
    at Outlet (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4537:26)
    at PresenceChild (http://localhost:5173/node_modules/.vite/deps/framer-motion.js?v=584de14a:121:24)
    at AnimatePresence (http://localhost:5173/node_modules/.vite/deps/framer-motion.js?v=584de14a:210:26)
    at main
    at div
    at PublicLayout (http://localhost:5173/src/components/public/PublicLayout.jsx?t=1788367174327:26:24)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4131:5)
    at Routes (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4601:5)
    at AuthenticatedApp (http://localhost:5173/src/App.jsx?t=1788367300924:334:82)
    at Router (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:4544:15)
    at BrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=584de14a:5290:5)
    at QueryClientProvider (http://localhost:5173/node_modules/.vite/deps/@tanstack_react-query.js?v=370b7003:3168:3)
    at AuthProvider (http://localhost:5173/src/lib/AuthContext.jsx?t=1788366298667:28:32)
    at App", …]
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
          - link "Mum's Garden" [ref=e22] [cursor=pointer]:
            - /url: /mums-garden
          - link "Press" [ref=e24] [cursor=pointer]:
            - /url: /press
          - link "Contact" [ref=e26] [cursor=pointer]:
            - /url: /contact
          - button "More" [ref=e28] [cursor=pointer]:
            - text: More
            - img [ref=e29]
        - generic [ref=e31]:
          - button [ref=e32] [cursor=pointer]:
            - img [ref=e33]
          - button "Open cart" [ref=e36] [cursor=pointer]:
            - img [ref=e37]
    - main [ref=e41]:
      - generic [ref=e42]:
        - generic [ref=e43]:
          - img
          - generic [ref=e45]:
            - heading "Gannon Waye" [level=1] [ref=e46]
            - generic [ref=e47]:
              - generic [ref=e48]:
                - generic [ref=e49]:
                  - paragraph [ref=e50]: Music
                  - link "Gannon Waye Music, Gannon Waye" [ref=e52] [cursor=pointer]:
                    - /url: /music
                    - img "Gannon Waye Music, Gannon Waye" [ref=e53]
                  - paragraph [ref=e54]: Music is shared here only when it is ready.
                - link "Visit the Store" [ref=e57] [cursor=pointer]:
                  - /url: /store
                  - button "Visit the Store" [ref=e58]
              - generic [ref=e59]:
                - generic [ref=e64]:
                  - generic [ref=e65]:
                    - generic [ref=e69]: Gannon Waye Music
                    - generic [ref=e70]: Official artist site
                  - paragraph [ref=e72]: Independent, heart-first music from Gannon Waye
                  - link "Explore the Music page" [ref=e74] [cursor=pointer]:
                    - /url: /music
                - generic [ref=e75]:
                  - paragraph [ref=e76]: WELCOME
                  - paragraph [ref=e77]: I'm an Adelaide-born singer-songwriter now based in Melbourne. I grew up without access to formal music lessons, so I found my voice through school choirs, church, worship ministry, drag performance and every stage that would have me. After family violence, abusive relationships, addiction, PTSD and losing Mum, I returned to music with a purpose. I'm Still Here is not a search for fame. It is for anyone who needs a song to say what they cannot yet say. This is independent, heart-first art. You are not alone here.
          - generic:
            - generic: Scroll
        - generic [ref=e79]:
          - generic [ref=e80]:
            - generic [ref=e81]: Independent, heart-first music from Gannon Waye
            - generic [ref=e82]: ◆
            - generic [ref=e83]: Music approved for public sharing appears on the Music page
            - generic [ref=e84]: ◆
            - generic [ref=e85]: The Store shows only current owner-approved stock
            - generic [ref=e86]: ◆
            - generic [ref=e87]: New music is shared only when it is ready
            - generic [ref=e88]: ◆
            - generic [ref=e89]: Join the community and follow the story
            - generic [ref=e90]: ◆
          - generic [ref=e91]:
            - generic [ref=e92]: Independent, heart-first music from Gannon Waye
            - generic [ref=e93]: ◆
            - generic [ref=e94]: Music approved for public sharing appears on the Music page
            - generic [ref=e95]: ◆
            - generic [ref=e96]: The Store shows only current owner-approved stock
            - generic [ref=e97]: ◆
            - generic [ref=e98]: New music is shared only when it is ready
            - generic [ref=e99]: ◆
            - generic [ref=e100]: Join the community and follow the story
            - generic [ref=e101]: ◆
        - generic [ref=e103]:
          - generic [ref=e104]:
            - paragraph [ref=e105]: About
            - heading "The Story" [level=2] [ref=e106]
          - generic [ref=e107]:
            - generic [ref=e108]:
              - paragraph [ref=e109]: "I was born and raised in Adelaide and now call Melbourne home. We did not have the money for formal music lessons, no matter how often I asked, cried or begged, but that never weakened the drive. I learned by taking every chance available: leading school choirs, singing in church and eventually serving as a worship minister."
              - paragraph [ref=e110]: I think deeply, feel deeply, and notice what others often miss. I'm obsessed with travel and culture. I care about people's wellbeing, sometimes more than they even realise about themselves. That perspective finds its way into everything I write.
              - paragraph [ref=e111]: I've been misunderstood and mislabelled more times than I can count. But I've learned that being misunderstood doesn't mean you're wrong. It often means you're seeing something others aren't ready for yet.
            - generic [ref=e114]:
              - paragraph [ref=e115]: I didn't truly love myself
              - paragraph [ref=e116]: until I was 33.
              - paragraph [ref=e117]: Before that, I woke up
              - paragraph [ref=e118]: every day wishing
              - paragraph [ref=e119]: I could be someone else.
              - paragraph [ref=e120]: That fear of abandonment
              - paragraph [ref=e121]: ran my life.
              - paragraph [ref=e122]: Then something shifted
              - paragraph [ref=e123]: and for the first time,
              - paragraph [ref=e124]: I didn't want to be
              - paragraph [ref=e125]: anyone else.
              - paragraph [ref=e126]: Gannon Waye
            - generic [ref=e128]:
              - paragraph [ref=e129]: My journey has not been simple. Childhood was shaped by family violence, an abusive father and a mother who struggled to regulate overwhelming emotion. In adulthood I survived abusive relationships, coercive control, addiction, PTSD and the loss of Mum. Each time life knocked me down, music gave me a way to stand again.
              - paragraph [ref=e130]: "The stages kept coming: I twice reached the grand final of Adelaide's Search for a Star, reached the Top 100 of Australian Idol, performed as a drag artist and opened Feast Festival in 2012. But the purpose is not trophies or fame. It is finding the voice I was denied and using it to reach someone else."
              - paragraph [ref=e131]: I'm Still Here brings that purpose together. It is for the person searching for a song that can say what they cannot yet say, and for anyone who needs proof that being knocked down is not the end of the story.
        - generic [ref=e133]:
          - generic [ref=e134]:
            - paragraph [ref=e135]: For Press
            - heading "Digital Press Kit" [level=2] [ref=e136]
          - generic [ref=e139]:
            - generic [ref=e140]:
              - paragraph [ref=e141]: Mission
              - paragraph [ref=e142]: To reach people who need a voice or a song for what they cannot yet say through independent, emotionally honest music and storytelling.
              - paragraph [ref=e144]: Biography
              - paragraph [ref=e145]: Gannon Waye is an Adelaide-born, Melbourne-based independent singer songwriter. Raised without access to formal music lessons, he built his voice through school choirs, church, worship ministry, drag performance and community stages. His contemporary pop work transforms grief, family violence, abusive relationships, addiction, PTSD and rebuilding into honest music for people who need to feel less alone.
              - generic [ref=e146]:
                - link "Full Press Kit" [ref=e147] [cursor=pointer]:
                  - /url: /press-kit
                  - button "Full Press Kit" [ref=e148]:
                    - img
                    - text: Full Press Kit
                - link "Press & Booking" [ref=e149] [cursor=pointer]:
                  - /url: /press
                  - button "Press & Booking" [ref=e150]:
                    - text: Press & Booking
                    - img
            - generic [ref=e151]:
              - paragraph [ref=e152]: Headshots
              - img "Gannon Waye" [ref=e155]
              - paragraph [ref=e156]: High-resolution images available on request
        - generic [ref=e158]:
          - paragraph [ref=e159]: Official Merch Boutique
          - heading "Enter the Gannon Waye Store" [level=2] [ref=e160]
          - paragraph [ref=e161]:
            - text: Shop the current owner-approved
            - emphasis [ref=e162]: Respect Is Earned
            - text: hoodie
            - text: and the Thankyou journal, pen and thermos flask bundle.
          - generic [ref=e165]: ✦
          - generic [ref=e167]:
            - button "Enter the Store ✦" [ref=e168] [cursor=pointer]
            - button "View Current Stock →" [ref=e169] [cursor=pointer]
          - generic [ref=e170]:
            - button "Respect Is Earned Hoodie — $98" [ref=e171] [cursor=pointer]
            - button "Journal, Pen and Thermos Bundle — $59" [ref=e172] [cursor=pointer]
        - generic [ref=e176]:
          - generic [ref=e177]:
            - img [ref=e178]
            - paragraph [ref=e180]: The Thank You Project
          - heading "Be Part of the Story" [level=2] [ref=e181]
          - paragraph [ref=e182]: Listen to the music, explore the current merchandise, and share the story with someone who may need it.
          - generic [ref=e183]:
            - link "Listen Official music" [ref=e184] [cursor=pointer]:
              - /url: /music
              - generic [ref=e185]:
                - img [ref=e186]
                - paragraph [ref=e190]: Listen
                - paragraph [ref=e191]: Official music
            - link "Shop Current merchandise" [ref=e192] [cursor=pointer]:
              - /url: /store
              - generic [ref=e193]:
                - img [ref=e194]
                - paragraph [ref=e197]: Shop
                - paragraph [ref=e198]: Current merchandise
            - link "Follow Creative updates" [ref=e199] [cursor=pointer]:
              - /url: https://www.instagram.com/gann0nwaye
              - generic [ref=e200]:
                - img [ref=e201]
                - paragraph [ref=e207]: Follow
                - paragraph [ref=e208]: Creative updates
          - generic [ref=e209]:
            - link "Visit the Store" [ref=e210] [cursor=pointer]:
              - /url: /store
              - button "Visit the Store" [ref=e211]:
                - img
                - text: Visit the Store
            - link "Listen to Music" [ref=e212] [cursor=pointer]:
              - /url: /music
              - button "Listen to Music" [ref=e213]:
                - img
                - text: Listen to Music
        - generic [ref=e216]:
          - img [ref=e217]
          - paragraph [ref=e220]: Stay Connected
          - heading "Join the Update List" [level=2] [ref=e221]
          - paragraph [ref=e222]: Receive occasional updates about new music, current merchandise, and Gannon's creative work.
          - generic [ref=e223]:
            - textbox "Your full name" [ref=e224]
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
            - generic [ref=e255]: GW
            - paragraph [ref=e256]: Australian singer songwriter sharing emotionally honest music, stories, and current merchandise.
          - generic [ref=e257]:
            - heading "Navigate" [level=4] [ref=e258]
            - generic [ref=e259]:
              - link "Home" [ref=e260] [cursor=pointer]:
                - /url: /
              - link "Biography" [ref=e261] [cursor=pointer]:
                - /url: /biography
              - link "Music" [ref=e262] [cursor=pointer]:
                - /url: /music
              - link "Lyrics" [ref=e263] [cursor=pointer]:
                - /url: /lyrics
              - link "Store" [ref=e264] [cursor=pointer]:
                - /url: /store
              - link "Press" [ref=e265] [cursor=pointer]:
                - /url: /press
              - link "Mum Tribute" [ref=e266] [cursor=pointer]:
                - /url: /remember-mum
              - link "Contact" [ref=e267] [cursor=pointer]:
                - /url: /contact
          - generic [ref=e268]:
            - heading "Contact" [level=4] [ref=e269]
            - paragraph [ref=e270]: For music, media, collaboration, and business enquiries
            - link "gannonwayemusic@gmail.com" [ref=e271] [cursor=pointer]:
              - /url: mailto:gannonwayemusic@gmail.com
            - heading "Legal" [level=4] [ref=e272]
            - generic [ref=e273]:
              - link "Privacy Policy" [ref=e274] [cursor=pointer]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e275] [cursor=pointer]:
                - /url: /terms-of-service
            - heading "Social" [level=4] [ref=e276]
            - generic [ref=e277]:
              - link "Instagram @gann0nwaye" [ref=e278] [cursor=pointer]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e279] [cursor=pointer]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e280] [cursor=pointer]:
                - /url: https://www.youtube.com/@gannonwayeofficial
        - generic [ref=e281]:
          - paragraph [ref=e282]: Stay connected
          - heading "Music and merchandise updates" [level=3] [ref=e283]
          - generic [ref=e284]:
            - textbox "Your name" [ref=e285]
            - textbox "Your email address" [ref=e286]
            - generic [ref=e287] [cursor=pointer]:
              - checkbox "I would like to receive music and merchandise updates. I can unsubscribe at any time." [ref=e288]
              - generic [ref=e289]: I would like to receive music and merchandise updates. I can unsubscribe at any time.
            - button "Join the Update List" [ref=e290] [cursor=pointer]
        - generic [ref=e291]:
          - paragraph [ref=e292]: Gannon Waye Music · ABN 22 931 809 349 · No GST is charged.
          - paragraph [ref=e293]: © 2026 Gannon Waye. All rights reserved.
    - generic [ref=e294]:
      - img [ref=e295]
      - paragraph [ref=e297]: 🎵Approved music and official listening links appear on the Music page
      - button "Dismiss" [ref=e298] [cursor=pointer]:
        - img [ref=e299]
```

# Test source

```ts
  1  | /* eslint-disable no-undef */
  2  | import { test, expect } from '@playwright/test';
  3  |  
  4  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  5  | 
  6  | test.describe('Store Visuals — Public safety checks', () => {
  7  | 
  8  |   test('public store still loads', async ({ page }) => {
  9  |     const errors = [];
  10 |     page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  11 |     await page.goto(`${BASE_URL}/store`);
  12 |     await page.waitForLoadState('load');
  13 |     await expect(page.locator('text=Store').first()).toBeVisible();
  14 |     const critical = errors.filter(e => !e.includes('favicon') && !e.includes('analytics') && !e.includes('posthog') && !e.includes('ERR_CONNECTION_REFUSED') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required') && !e.includes('net::ERR'));
  15 |     expect(critical).toHaveLength(0);
  16 |   });
  17 | 
  18 |   test('cart route exists', async ({ page }) => {
  19 |     await page.addInitScript(() => {
  20 |       window.localStorage.setItem('gannon_store_cart_v2', JSON.stringify({
  21 |         state: { items: [{ product_id: 'dummy', quantity: 1, product: { name: 'Dummy', price: 10 } }], __version: 3 },
  22 |         version: 0
  23 |       }));
  24 |     });
  25 |     await page.goto(`${BASE_URL}/store/cart`);
  26 |     await page.waitForLoadState('load');
  27 |     expect(page.url()).toContain('/store/cart');
  28 |   });
  29 | 
  30 |   test('checkout route exists', async ({ page }) => {
  31 |     await page.goto(`${BASE_URL}/store/checkout`);
  32 |     await page.waitForLoadState('load');
  33 |     expect(page.url()).toContain('/store');
  34 |   });
  35 | 
  36 |   test('homepage loads without console errors', async ({ page }) => {
  37 |     const errors = [];
  38 |     page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  39 |     await page.goto(`${BASE_URL}/`);
  40 |     await page.waitForLoadState('load');
  41 |     const critical = errors.filter(e => !e.includes('favicon') && !e.includes('analytics') && !e.includes('posthog') && !e.includes('ERR_CONNECTION_REFUSED') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required') && !e.includes('net::ERR'));
> 42 |     expect(critical).toHaveLength(0);
     |                      ^ Error: expect(received).toHaveLength(expected)
  43 |   });
  44 | 
  45 |   test('no unapproved raw MerchVisualAsset images appear on store', async ({ page }) => {
  46 |     await page.goto(`${BASE_URL}/store`);
  47 |     await page.waitForLoadState('load');
  48 |     // MerchVisualAsset images are admin-only — none should appear on public store
  49 |     // Check that no background_pending or needs_cleanup images are visible
  50 |     const pageContent = await page.content();
  51 |     expect(pageContent).not.toContain('background_pending');
  52 |     expect(pageContent).not.toContain('needs_cleanup');
  53 |   });
  54 | 
  55 |   test('store products still show add to cart', async ({ page }) => {
  56 |     await page.goto(`${BASE_URL}/store`);
  57 |     await page.waitForLoadState('load');
  58 |     // At least one product or store content should be present
  59 |     await expect(page.locator('text=/store|merch|hoodie|mug|shirt/i').first()).toBeVisible();
  60 |   });
  61 | 
  62 | });
```