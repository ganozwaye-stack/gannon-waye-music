# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lyrics-admin.spec.js >> Lyrics page — public visibility >> lyrics page includes Thankyou / Thank You song
- Location: src/gannonwaye-playwright-pack/tests/lyrics-admin.spec.js:12:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
Timeout: 10000ms
Expected pattern: /thank\s*you/i
Received string:  "
    Support NowGWHomeBiographyMusicStoreSupportersMum's GardenPressContactMore Words & MeaningLyricsEvery word is intentional. Read along, sit with it, or find the line that feels like yours.Lyrics Coming SoonThe full lyrics archive is being carefully prepared. Each song's words will appear here once they're finalised and approved for publishing.Go to MusicSupport the Music 🤍GWAustralian singer-songwriter crafting honest stories through melody and verse.NavigateHomeMusicLyricsStorePressSubscribe 🤍CommunityBiographyLyric LibraryMixing ServicesGift CardsMum TributeSystems ManagerContactContactFor press, management & enquiriesgannonwayemusic@gmail.comLegalPrivacy PolicyTerms of ServiceContact GannonSocialInstagram @gann0nwayeTikTok @gann0nwayeYouTube @gannonwayeofficialStay in the loopNew music & community updatesBirthday optional — we'll send you something special 🎂How did you find me? *GoogleInstagramFacebookTikTokX (Twitter)Friend / Word of MouthI know GannonOtherSubscribe* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible.Support the project 🤍© 2026 Gannon Waye. All rights reserved.HomeMusicStoreLyricsContact✨Join the inner circle — be part of something real····
"

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('body')
    11 × locator resolved to <body>…</body>
       - unexpected value "
    Support NowGWHomeBiographyMusicStoreSupportersMum's GardenPressContactMore Words & MeaningLyricsEvery word is intentional. Read along, sit with it, or find the line that feels like yours.Lyrics Coming SoonThe full lyrics archive is being carefully prepared. Each song's words will appear here once they're finalised and approved for publishing.Go to MusicSupport the Music 🤍GWAustralian singer-songwriter crafting honest stories through melody and verse.NavigateHomeMusicLyricsStorePressSubscribe 🤍CommunityBiographyLyric LibraryMixing ServicesGift CardsMum TributeSystems ManagerContactContactFor press, management & enquiriesgannonwayemusic@gmail.comLegalPrivacy PolicyTerms of ServiceContact GannonSocialInstagram @gann0nwayeTikTok @gann0nwayeYouTube @gannonwayeofficialStay in the loopNew music & community updatesBirthday optional — we'll send you something special 🎂How did you find me? *GoogleInstagramFacebookTikTokX (Twitter)Friend / Word of MouthI know GannonOtherSubscribe* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible.Support the project 🤍© 2026 Gannon Waye. All rights reserved.HomeMusicStoreLyricsContact🎵Music approved for public sharing appears on the Music page
  

"
    9 × locator resolved to <body>…</body>
      - unexpected value "
    Support NowGWHomeBiographyMusicStoreSupportersMum's GardenPressContactMore Words & MeaningLyricsEvery word is intentional. Read along, sit with it, or find the line that feels like yours.Lyrics Coming SoonThe full lyrics archive is being carefully prepared. Each song's words will appear here once they're finalised and approved for publishing.Go to MusicSupport the Music 🤍GWAustralian singer-songwriter crafting honest stories through melody and verse.NavigateHomeMusicLyricsStorePressSubscribe 🤍CommunityBiographyLyric LibraryMixing ServicesGift CardsMum TributeSystems ManagerContactContactFor press, management & enquiriesgannonwayemusic@gmail.comLegalPrivacy PolicyTerms of ServiceContact GannonSocialInstagram @gann0nwayeTikTok @gann0nwayeYouTube @gannonwayeofficialStay in the loopNew music & community updatesBirthday optional — we'll send you something special 🎂How did you find me? *GoogleInstagramFacebookTikTokX (Twitter)Friend / Word of MouthI know GannonOtherSubscribe* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible.Support the project 🤍© 2026 Gannon Waye. All rights reserved.HomeMusicStoreLyricsContact✨Join the inner circle — be part of something real
  

"

```

```yaml
- link "Support Now":
  - /url: /back-this
  - button "Support Now"
- navigation:
  - link "Gannon Waye · Home":
    - /url: /
    - text: GW
  - link "Home":
    - /url: /
  - link "Biography":
    - /url: /biography
  - link "Music":
    - /url: /music
  - link "Store":
    - /url: /store
  - link "Supporters":
    - /url: /back-this
  - link "Mum's Garden":
    - /url: /mums-garden
  - link "Press":
    - /url: /press
  - link "Contact":
    - /url: /contact
  - button "More":
    - text: More
    - img
  - button:
    - img
  - button "Open cart":
    - img
- main:
  - paragraph: Words & Meaning
  - heading "Lyrics" [level=1]
  - paragraph: Every word is intentional. Read along, sit with it, or find the line that feels like yours.
  - img
  - heading "Lyrics Coming Soon" [level=2]
  - paragraph: The full lyrics archive is being carefully prepared. Each song's words will appear here once they're finalised and approved for publishing.
  - link "Go to Music":
    - /url: /music
    - button "Go to Music"
  - link "Support the Music 🤍":
    - /url: /back-this
    - button "Support the Music 🤍"
- contentinfo:
  - text: GW
  - paragraph: Australian singer-songwriter crafting honest stories through melody and verse.
  - heading "Navigate" [level=4]
  - link "Home":
    - /url: /
  - link "Music":
    - /url: /music
  - link "Lyrics":
    - /url: /lyrics
  - link "Store":
    - /url: /store
  - link "Press":
    - /url: /press
  - link "Subscribe 🤍":
    - /url: /back-this
  - link "Community":
    - /url: /community
  - link "Biography":
    - /url: /biography
  - link "Lyric Library":
    - /url: /lyric-library
  - link "Mixing Services":
    - /url: /mixing-services
  - link "Gift Cards":
    - /url: /gift-cards
  - link "Mum Tribute":
    - /url: /remember-mum
  - link "Systems Manager":
    - /url: /systems-manager
  - link "Contact":
    - /url: /contact
  - heading "Contact" [level=4]
  - paragraph: For press, management & enquiries
  - link "gannonwayemusic@gmail.com":
    - /url: mailto:gannonwayemusic@gmail.com
  - heading "Legal" [level=4]
  - link "Privacy Policy":
    - /url: /privacy-policy
  - link "Terms of Service":
    - /url: /terms-of-service
  - link "Contact Gannon":
    - /url: /contact
  - heading "Social" [level=4]
  - link "Instagram @gann0nwaye":
    - /url: https://www.instagram.com/gann0nwaye
  - link "TikTok @gann0nwaye":
    - /url: https://www.tiktok.com/@gann0nwaye
  - link "YouTube @gannonwayeofficial":
    - /url: https://www.youtube.com/@gannonwayeofficial
  - paragraph: Stay in the loop
  - heading "New music & community updates" [level=3]
  - textbox "Your name *"
  - textbox "your@email.com *"
  - textbox "Phone incl. country code e.g. +61 400 000 000 *"
  - textbox "Birthday (optional — we'll send you something special)"
  - paragraph: Birthday optional — we'll send you something special 🎂
  - combobox:
    - option "How did you find me? *" [selected]
    - option "Google"
    - option "Instagram"
    - option "Facebook"
    - option "TikTok"
    - option "X (Twitter)"
    - option "Friend / Word of Mouth"
    - option "I know Gannon"
    - option "Other"
  - button "Subscribe"
  - paragraph: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
  - img "GW Heart"
  - link "Support the project 🤍":
    - /url: /back-this
  - img "GW Heart"
  - paragraph: © 2026 Gannon Waye. All rights reserved.
- img
- paragraph: ✨Join the inner circle — be part of something real
- button "Dismiss":
  - img
```

# Test source

```ts
  1  | // @ts-check
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | test.describe('Lyrics page — public visibility', () => {
  5  |   test('lyrics page loads', async ({ page }) => {
  6  |     await page.goto('/lyrics');
  7  |     await page.waitForLoadState('networkidle');
  8  |     await expect(page.locator('body')).not.toContainText('404');
  9  |     await expect(page.locator('body')).not.toContainText('Page Not Found');
  10 |   });
  11 | 
  12 |   test('lyrics page includes Thankyou / Thank You song', async ({ page }) => {
  13 |     await page.goto('/lyrics');
  14 |     await page.waitForLoadState('networkidle');
> 15 |     await expect(page.locator('body')).toContainText(/thank\s*you/i);
     |                                        ^ Error: expect(locator).toContainText(expected) failed
  16 |   });
  17 | 
  18 |   test('no admin buttons visible to unauthenticated user on lyrics page', async ({ page }) => {
  19 |     await page.goto('/lyrics');
  20 |     await page.waitForLoadState('networkidle');
  21 |     const adminBtns = page.locator('[data-testid="admin-edit-btn"]');
  22 |     await expect(adminBtns).toHaveCount(0);
  23 |   });
  24 | });
  25 | 
  26 | test.describe('Admin releases route', () => {
  27 |   test('/admin/releases does not 404', async ({ page }) => {
  28 |     await page.goto('/admin/releases');
  29 |     await page.waitForLoadState('networkidle');
  30 |     // Will redirect to login if not authenticated — just confirm no 404
  31 |     await expect(page.locator('body')).not.toContainText('Page Not Found');
  32 |   });
  33 | });
```