# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: link-integrity.spec.js >> Link Integrity — Public routes >> no public page redirects to admin dashboard
- Location: tests\link-integrity.spec.js:58:7

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
  - generic [ref=e4]:
    - generic [ref=e5]:
      - button "Play Thank You" [disabled] [ref=e6]:
        - img [ref=e7]
      - generic [ref=e16]: Thank You
    - generic [ref=e17]:
      - img "GW Heart" [ref=e18]
      - generic [ref=e19]:
        - paragraph [ref=e20]: Support the "Thank You" Project
        - paragraph [ref=e21]: 10% of all support → 1800RESPECT
    - generic [ref=e22]:
      - link "Impact" [ref=e23] [cursor=pointer]:
        - /url: /impact
        - button "Impact" [ref=e24]
      - link "Support Now" [ref=e25] [cursor=pointer]:
        - /url: /back-this
        - button "Support Now" [ref=e26]
  - generic [ref=e27]:
    - navigation [ref=e28]:
      - generic [ref=e29]:
        - link "Gannon Waye — Home" [ref=e30] [cursor=pointer]:
          - /url: /
          - generic [ref=e33]: GW
        - generic [ref=e34]:
          - link "Home" [ref=e35] [cursor=pointer]:
            - /url: /
          - link "My Story" [ref=e36] [cursor=pointer]:
            - /url: /this-is-my-life
          - link "Music" [ref=e37] [cursor=pointer]:
            - /url: /music
          - link "Videos" [ref=e38] [cursor=pointer]:
            - /url: /videos
          - link "Community" [ref=e39] [cursor=pointer]:
            - /url: /community
          - link "Store" [ref=e40] [cursor=pointer]:
            - /url: /store
          - link "Contact" [ref=e41] [cursor=pointer]:
            - /url: /contact
          - link "Back This 🤍" [ref=e42] [cursor=pointer]:
            - /url: /back-this
        - button [ref=e44] [cursor=pointer]:
          - img [ref=e45]
    - button [ref=e49] [cursor=pointer]:
      - img [ref=e50]
    - main [ref=e54]:
      - generic [ref=e56]:
        - generic [ref=e57]:
          - paragraph [ref=e58]: Get in Touch
          - heading "Contact" [level=1] [ref=e59]
          - paragraph [ref=e60]: For press enquiries, management, collaborations, or general contact, use the details below.
        - generic [ref=e61]:
          - generic [ref=e62]:
            - generic [ref=e63]:
              - generic [ref=e64]:
                - img [ref=e66]
                - heading "Email Direct" [level=2] [ref=e69]
              - paragraph [ref=e70]: For press enquiries, management, collaborations, or general contact.
              - link "hello@gannonwaye.com" [ref=e71] [cursor=pointer]:
                - /url: mailto:hello@gannonwaye.com
                - text: hello@gannonwaye.com
                - img [ref=e72]
            - generic [ref=e76]:
              - heading "Follow the Journey" [level=2] [ref=e77]
              - generic [ref=e78]:
                - link "Instagram @gann0nwaye" [ref=e79] [cursor=pointer]:
                  - /url: https://www.instagram.com/gann0nwaye
                  - generic [ref=e80]:
                    - img [ref=e82]
                    - generic [ref=e85]:
                      - paragraph [ref=e86]: Instagram
                      - paragraph [ref=e87]: "@gann0nwaye"
                  - img [ref=e88]
                - link "TikTok @gann0nwaye" [ref=e92] [cursor=pointer]:
                  - /url: https://www.tiktok.com/@gann0nwaye
                  - generic [ref=e93]:
                    - img [ref=e95]
                    - generic [ref=e99]:
                      - paragraph [ref=e100]: TikTok
                      - paragraph [ref=e101]: "@gann0nwaye"
                  - img [ref=e102]
                - link "Spotify Gannon Waye" [ref=e106] [cursor=pointer]:
                  - /url: https://open.spotify.com/artist/1tu7INPvRAcRihgaEvBVAz
                  - generic [ref=e107]:
                    - img [ref=e109]
                    - generic [ref=e113]:
                      - paragraph [ref=e114]: Spotify
                      - paragraph [ref=e115]: Gannon Waye
                  - img [ref=e116]
          - generic [ref=e121]:
            - heading "Send a Message" [level=2] [ref=e122]
            - generic [ref=e123]:
              - generic [ref=e124]:
                - generic [ref=e125]: Name
                - textbox "Your name" [ref=e126]
              - generic [ref=e127]:
                - generic [ref=e128]: Email
                - textbox "you@example.com" [ref=e129]
              - generic [ref=e130]:
                - generic [ref=e131]: Message
                - generic [ref=e132]:
                  - textbox "What's on your mind..." [ref=e133]
                  - button "Voice input — click and speak" [ref=e135] [cursor=pointer]:
                    - img [ref=e136]
              - button "Send Message" [ref=e139] [cursor=pointer]
    - contentinfo [ref=e140]:
      - generic [ref=e141]:
        - generic [ref=e142]:
          - generic [ref=e143]:
            - generic [ref=e145]: GW
            - paragraph [ref=e146]: Australian singer-songwriter crafting honest stories through melody and verse.
          - generic [ref=e147]:
            - heading "Navigate" [level=4] [ref=e148]
            - generic [ref=e149]:
              - link "Home" [ref=e150] [cursor=pointer]:
                - /url: /
              - link "My Story" [ref=e151] [cursor=pointer]:
                - /url: /this-is-my-life
              - link "Music" [ref=e152] [cursor=pointer]:
                - /url: /music
              - link "Videos" [ref=e153] [cursor=pointer]:
                - /url: /videos
              - link "Store" [ref=e154] [cursor=pointer]:
                - /url: /store
              - link "Community" [ref=e155] [cursor=pointer]:
                - /url: /community
              - link "Contact" [ref=e156] [cursor=pointer]:
                - /url: /contact
              - link "Order Status" [ref=e157] [cursor=pointer]:
                - /url: /order-status
              - link "The 7 Day Standard" [ref=e158] [cursor=pointer]:
                - /url: /7-day-standard
              - link "Current Single" [ref=e159] [cursor=pointer]:
                - /url: /current-single
              - link "Merch Feedback" [ref=e160] [cursor=pointer]:
                - /url: /merch-feedback
              - link "Back This Project 🤍" [ref=e161] [cursor=pointer]:
                - /url: /back-this
          - generic [ref=e162]:
            - heading "Contact" [level=4] [ref=e163]
            - paragraph [ref=e164]: For press, management & enquiries
            - link "hello@gannonwaye.com" [ref=e165] [cursor=pointer]:
              - /url: mailto:hello@gannonwaye.com
            - heading "Legal" [level=4] [ref=e166]
            - generic [ref=e167]:
              - link "Privacy Policy" [ref=e168] [cursor=pointer]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e169] [cursor=pointer]:
                - /url: /terms-of-service
              - link "Contact Gannon" [ref=e170] [cursor=pointer]:
                - /url: /contact
            - heading "Social" [level=4] [ref=e171]
            - generic [ref=e172]:
              - link "Instagram @gann0nwaye" [ref=e173] [cursor=pointer]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e174] [cursor=pointer]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e175] [cursor=pointer]:
                - /url: https://www.youtube.com/@gannonwayeofficial
        - generic [ref=e176]:
          - paragraph [ref=e177]: Stay in the loop
          - heading "New music & community updates" [level=3] [ref=e178]
          - generic [ref=e179]:
            - textbox "Your name *" [ref=e180]
            - textbox "your@email.com *" [ref=e181]
            - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e182]
            - textbox "Birthday (optional — we'll send you something special)" [ref=e183]
            - paragraph [ref=e184]: Birthday optional — we'll send you something special 🎂
            - combobox [ref=e185]:
              - option "How did you find me? *" [selected]
              - option "Google"
              - option "Instagram"
              - option "Facebook"
              - option "TikTok"
              - option "X (Twitter)"
              - option "Friend / Word of Mouth"
              - option "I know Gannon"
              - option "Other"
            - button "Subscribe" [ref=e186] [cursor=pointer]
        - generic [ref=e187]:
          - paragraph [ref=e188]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
          - paragraph [ref=e189]: "* The AI memorial reflective companion available on the tribute page (/mum) is configured as a comforting, gentle remembrance journal companion. It is not an active representation of Sonia, does not offer professional medical, legal, or grief counseling, and should not be used as a substitute for clinical therapy."
        - generic [ref=e190]:
          - generic [ref=e191]:
            - img "GW Heart" [ref=e192]
            - link "Support the project 🤍" [ref=e193] [cursor=pointer]:
              - /url: /back-this
            - img "GW Heart" [ref=e194]
          - paragraph [ref=e195]: © 2026 Gannon Waye. All rights reserved.
```

# Test source

```ts
  1   | /* eslint-disable no-undef */
  2   | // tests/link-integrity.spec.js
  3   | // Verifies correct link intent routing across dashboard cards and owner action items
  4   | 
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
> 62  |       await page.waitForLoadState('networkidle');
      |                  ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
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