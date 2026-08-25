# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: link-integrity.spec.js >> Link Integrity — Public routes >> contact page social links are correct
- Location: src/gannonwaye-playwright-pack/tests/link-integrity.spec.js:40:7

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
      - generic [ref=e26]:
        - generic [ref=e27]:
          - paragraph [ref=e28]: Get in Touch
          - heading "Contact" [level=1] [ref=e29]
          - paragraph [ref=e30]: For press enquiries, management, collaborations, or general contact, use the details below.
        - generic [ref=e31]:
          - generic [ref=e32]:
            - generic [ref=e33]:
              - generic [ref=e34]:
                - img [ref=e36]
                - heading "Email Direct" [level=2] [ref=e39]
              - paragraph [ref=e40]: For press enquiries, management, collaborations, or general contact.
              - link "gannonwayemusic@gmail.com" [ref=e41]:
                - /url: mailto:gannonwayemusic@gmail.com
                - text: gannonwayemusic@gmail.com
                - img [ref=e42]
            - generic [ref=e46]:
              - heading "Follow the Journey" [level=2] [ref=e47]
              - generic [ref=e48]:
                - link "Instagram @gann0nwaye" [ref=e49]:
                  - /url: https://www.instagram.com/gann0nwaye
                  - generic [ref=e50]:
                    - img [ref=e52]
                    - generic [ref=e55]:
                      - paragraph [ref=e56]: Instagram
                      - paragraph [ref=e57]: "@gann0nwaye"
                  - img [ref=e58]
                - link "TikTok @gann0nwaye" [ref=e62]:
                  - /url: https://www.tiktok.com/@gann0nwaye
                  - generic [ref=e63]:
                    - img [ref=e65]
                    - generic [ref=e69]:
                      - paragraph [ref=e70]: TikTok
                      - paragraph [ref=e71]: "@gann0nwaye"
                  - img [ref=e72]
                - link "Spotify Gannon Waye" [ref=e76]:
                  - /url: https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz
                  - generic [ref=e77]:
                    - img [ref=e79]
                    - generic [ref=e83]:
                      - paragraph [ref=e84]: Spotify
                      - paragraph [ref=e85]: Gannon Waye
                  - img [ref=e86]
          - generic [ref=e91]:
            - heading "Send a Message" [level=2] [ref=e92]
            - generic [ref=e93]:
              - generic [ref=e94]:
                - generic [ref=e95]: Name
                - textbox "Your name" [ref=e96]
              - generic [ref=e97]:
                - generic [ref=e98]: Email
                - textbox "you@example.com" [ref=e99]
              - generic [ref=e100]:
                - generic [ref=e101]: Message
                - textbox "What's on your mind..." [ref=e103]
              - button "Send Message" [ref=e104] [cursor=pointer]
    - contentinfo [ref=e105]:
      - generic [ref=e106]:
        - generic [ref=e107]:
          - generic [ref=e108]:
            - generic [ref=e110]: GW
            - paragraph [ref=e111]: Australian singer-songwriter crafting honest stories through melody and verse.
          - generic [ref=e112]:
            - heading "Navigate" [level=4] [ref=e113]
            - generic [ref=e114]:
              - link "Home" [ref=e115]:
                - /url: /
              - link "Music" [ref=e116]:
                - /url: /music
              - link "Lyrics" [ref=e117]:
                - /url: /lyrics
              - link "Store" [ref=e118]:
                - /url: /store
              - link "Press" [ref=e119]:
                - /url: /press
              - link "Subscribe 🤍" [ref=e120]:
                - /url: /back-this
              - link "Community" [ref=e121]:
                - /url: /community
              - link "Biography" [ref=e122]:
                - /url: /biography
              - link "Lyric Library" [ref=e123]:
                - /url: /lyric-library
              - link "Mixing Services" [ref=e124]:
                - /url: /mixing-services
              - link "Gift Cards" [ref=e125]:
                - /url: /gift-cards
              - link "Mum Tribute" [ref=e126]:
                - /url: /remember-mum
              - link "Systems Manager" [ref=e127]:
                - /url: /systems-manager
              - link "Contact" [ref=e128]:
                - /url: /contact
          - generic [ref=e129]:
            - heading "Contact" [level=4] [ref=e130]
            - paragraph [ref=e131]: For press, management & enquiries
            - link "gannonwayemusic@gmail.com" [ref=e132]:
              - /url: mailto:gannonwayemusic@gmail.com
            - heading "Legal" [level=4] [ref=e133]
            - generic [ref=e134]:
              - link "Privacy Policy" [ref=e135]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e136]:
                - /url: /terms-of-service
              - link "Contact Gannon" [ref=e137]:
                - /url: /contact
            - heading "Social" [level=4] [ref=e138]
            - generic [ref=e139]:
              - link "Instagram @gann0nwaye" [ref=e140]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e141]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e142]:
                - /url: https://www.youtube.com/@gannonwayeofficial
        - generic [ref=e143]:
          - paragraph [ref=e144]: Stay in the loop
          - heading "New music & community updates" [level=3] [ref=e145]
          - generic [ref=e146]:
            - textbox "Your name *" [ref=e147]
            - textbox "your@email.com *" [ref=e148]
            - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e149]
            - textbox "Birthday (optional — we'll send you something special)" [ref=e150]
            - paragraph [ref=e151]: Birthday optional — we'll send you something special 🎂
            - combobox [ref=e152]:
              - option "How did you find me? *" [selected]
              - option "Google"
              - option "Instagram"
              - option "Facebook"
              - option "TikTok"
              - option "X (Twitter)"
              - option "Friend / Word of Mouth"
              - option "I know Gannon"
              - option "Other"
            - button "Subscribe" [ref=e153] [cursor=pointer]
        - paragraph [ref=e155]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
        - generic [ref=e156]:
          - generic [ref=e157]:
            - img "GW Heart" [ref=e158]
            - link "Support the project 🤍" [ref=e159]:
              - /url: /back-this
            - img "GW Heart" [ref=e160]
          - paragraph [ref=e161]: © 2026 Gannon Waye. All rights reserved.
    - navigation [ref=e162]:
      - generic [ref=e163]:
        - link "Home" [ref=e164]:
          - /url: /
          - generic [ref=e165]:
            - img [ref=e166]
            - generic [ref=e169]: Home
        - link "Music" [ref=e170]:
          - /url: /music
          - generic [ref=e171]:
            - img [ref=e172]
            - generic [ref=e176]: Music
        - link "Store" [ref=e177]:
          - /url: /store
          - generic [ref=e178]:
            - img [ref=e179]
            - generic [ref=e182]: Store
        - link "Lyrics" [ref=e183]:
          - /url: /lyrics
          - generic [ref=e184]:
            - img [ref=e185]
            - generic [ref=e188]: Lyrics
        - link "Contact" [ref=e189]:
          - /url: /contact
          - generic [ref=e191]:
            - img [ref=e192]
            - generic [ref=e195]: Contact
    - generic [ref=e196]:
      - img [ref=e197]
      - paragraph [ref=e199]: 🎵Music approved for public sharing appears on the Music page
      - button "Dismiss" [ref=e200] [cursor=pointer]:
        - img [ref=e201]
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
> 42  |     await page.waitForLoadState('networkidle');
      |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
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