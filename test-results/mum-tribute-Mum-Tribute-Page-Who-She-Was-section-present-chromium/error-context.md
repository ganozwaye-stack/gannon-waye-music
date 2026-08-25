# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mum-tribute.spec.js >> Mum Tribute Page >> Who She Was section present
- Location: src/gannonwaye-playwright-pack/tests/mum-tribute.spec.js:79:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.scrollIntoViewIfNeeded: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('#who-she-was')

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
        - navigation [ref=e44]:
          - button "Heavenly Arrival" [ref=e45] [cursor=pointer]
          - button "Entering the Trees" [ref=e46] [cursor=pointer]
          - button "Memories Among Trees" [ref=e47] [cursor=pointer]
          - button "The Real Garden" [ref=e48] [cursor=pointer]
          - button "Onya & Gay's Archway" [ref=e49] [cursor=pointer]
          - button "Garden Rooms" [ref=e50] [cursor=pointer]
          - button "The Bench Garden" [ref=e51] [cursor=pointer]
          - button "Musical Conclusion" [ref=e52] [cursor=pointer]
        - button "Toggle reduced motion" [ref=e53] [cursor=pointer]:
          - img [ref=e54]
          - generic [ref=e60]: Cinematic motion
        - generic [ref=e61]:
          - generic [ref=e62]:
            - paragraph [ref=e63]: A Garden for Sonia
            - heading "Sonia’s Garden" [level=1] [ref=e64]
            - paragraph [ref=e65]: In loving memory of Sonia Katisa Waye
            - button "Enter the Garden" [ref=e66] [cursor=pointer]:
              - generic [ref=e67]: Enter the Garden
              - img [ref=e68]
            - link "Listen to Without You Here" [ref=e71] [cursor=pointer]:
              - /url: /music
              - img [ref=e72]
              - generic [ref=e74]: Listen to Without You Here
          - generic [ref=e75]: Full-screen world image — awaiting approved asset
        - generic [ref=e77]:
          - paragraph [ref=e78]: Step softly — the trees open slowly, the way memory does.
          - button "Walk deeper" [ref=e79] [cursor=pointer]:
            - generic [ref=e80]: Walk deeper
            - img [ref=e81]
        - generic [ref=e84]:
          - heading "Memories among the trees" [level=2] [ref=e85]
          - paragraph [ref=e86]: Move close to a frame · the garden waits
          - generic [ref=e87]:
            - figure [ref=e88]:
              - generic [ref=e89]:
                - generic [ref=e96]: Awaiting approved photograph
                - paragraph [ref=e98]: Coffee in the Garden
            - figure [ref=e99]:
              - generic [ref=e100]:
                - generic [ref=e107]: Awaiting approved photograph
                - paragraph [ref=e109]: Sonia's Gold Rings
            - figure [ref=e110]:
              - generic [ref=e111]:
                - generic [ref=e118]: Awaiting approved photograph
                - paragraph [ref=e120]: A Quiet Morning
          - button "Into the real garden" [ref=e122] [cursor=pointer]:
            - generic [ref=e123]: Into the real garden
            - img [ref=e124]
        - generic [ref=e127]:
          - heading "Her real garden" [level=2] [ref=e128]
          - paragraph [ref=e129]: An Adelaide backyard, quiet and alive — the place she tended with her hands.
          - generic [ref=e130]: Awaiting anchor photograph (IMG_3244)
          - list [ref=e131]:
            - listitem [ref=e132]: Orange flowering vine
            - listitem [ref=e133]: Elephant ear plants
            - listitem [ref=e134]: Monstera
            - listitem [ref=e135]: Spider plants
            - listitem [ref=e136]: Dense green foliage
            - listitem [ref=e137]: The round concrete table
            - listitem [ref=e138]: The garden bench
          - button "Toward the archway" [ref=e139] [cursor=pointer]:
            - generic [ref=e140]: Toward the archway
            - img [ref=e141]
        - generic [ref=e144]:
          - img [ref=e146]
          - paragraph [ref=e149]: Between the two homes
          - heading "Onya & Gay’s Archway" [level=2] [ref=e150]
          - paragraph [ref=e151]: Passing through is entering another chapter of the memory.
          - button "Pass through" [ref=e152] [cursor=pointer]:
            - generic [ref=e153]: Pass through
            - img [ref=e154]
        - generic [ref=e157]:
          - heading "Garden rooms & doorways" [level=2] [ref=e158]
          - paragraph [ref=e159]: Open a doorway · return when you are ready
          - generic [ref=e160]:
            - button "Doorway 01 Carla Sister · held close in the garden light" [ref=e161] [cursor=pointer]:
              - generic [ref=e162]: Doorway 01
              - generic [ref=e163]: Carla
              - generic [ref=e164]: Sister · held close in the garden light
            - button "Doorway 02 Gannon Son · the songs carry her forward" [ref=e165] [cursor=pointer]:
              - generic [ref=e166]: Doorway 02
              - generic [ref=e167]: Gannon
              - generic [ref=e168]: Son · the songs carry her forward
            - button "Doorway 03 Jarrad Family · quiet strength among the leaves" [ref=e169] [cursor=pointer]:
              - generic [ref=e170]: Doorway 03
              - generic [ref=e171]: Jarrad
              - generic [ref=e172]: Family · quiet strength among the leaves
            - button "Doorway 04 Crystal Family · laughter in the green rooms" [ref=e173] [cursor=pointer]:
              - generic [ref=e174]: Doorway 04
              - generic [ref=e175]: Crystal
              - generic [ref=e176]: Family · laughter in the green rooms
            - button "Doorway 05 Everyday gold Small rituals that made the garden home" [ref=e177] [cursor=pointer]:
              - generic [ref=e178]: Doorway 05
              - generic [ref=e179]: Everyday gold
              - generic [ref=e180]: Small rituals that made the garden home
          - button "To the bench" [ref=e181] [cursor=pointer]:
            - generic [ref=e182]: To the bench
            - img [ref=e183]
        - generic [ref=e185]:
          - img [ref=e186]
          - generic [ref=e188]:
            - paragraph [ref=e189]: Rest here
            - heading "The bench garden" [level=2] [ref=e190]
            - paragraph [ref=e191]: “Sit a while. The garden does not hurry, and neither should your remembering.”
            - button "When you are ready" [ref=e192] [cursor=pointer]:
              - generic [ref=e193]: When you are ready
              - img [ref=e194]
        - generic [ref=e197]:
          - paragraph [ref=e198]: The garden becomes a song
          - heading "Without You Here" [level=2] [ref=e199]
          - paragraph [ref=e200]: If you would like to hear it, the choice is yours.
          - generic [ref=e201]:
            - link "Listen on the Music page" [ref=e202] [cursor=pointer]:
              - /url: /music
              - img [ref=e203]
              - generic [ref=e205]: Listen on the Music page
            - link "Apple Music" [ref=e206] [cursor=pointer]:
              - /url: ""
              - generic [ref=e207]: Apple Music
              - img [ref=e208]
          - paragraph [ref=e212]: “She is the garden now.”
          - paragraph [ref=e213]: Forever in our hearts
    - contentinfo [ref=e214]:
      - generic [ref=e215]:
        - generic [ref=e216]:
          - generic [ref=e217]:
            - generic [ref=e219]: GW
            - paragraph [ref=e220]: Australian singer-songwriter crafting honest stories through melody and verse.
          - generic [ref=e221]:
            - heading "Navigate" [level=4] [ref=e222]
            - generic [ref=e223]:
              - link "Home" [ref=e224] [cursor=pointer]:
                - /url: /
              - link "Music" [ref=e225] [cursor=pointer]:
                - /url: /music
              - link "Lyrics" [ref=e226] [cursor=pointer]:
                - /url: /lyrics
              - link "Store" [ref=e227] [cursor=pointer]:
                - /url: /store
              - link "Press" [ref=e228] [cursor=pointer]:
                - /url: /press
              - link "Subscribe 🤍" [ref=e229] [cursor=pointer]:
                - /url: /back-this
              - link "Community" [ref=e230] [cursor=pointer]:
                - /url: /community
              - link "Biography" [ref=e231] [cursor=pointer]:
                - /url: /biography
              - link "Lyric Library" [ref=e232] [cursor=pointer]:
                - /url: /lyric-library
              - link "Mixing Services" [ref=e233] [cursor=pointer]:
                - /url: /mixing-services
              - link "Gift Cards" [ref=e234] [cursor=pointer]:
                - /url: /gift-cards
              - link "Mum Tribute" [ref=e235] [cursor=pointer]:
                - /url: /remember-mum
              - link "Systems Manager" [ref=e236] [cursor=pointer]:
                - /url: /systems-manager
              - link "Contact" [ref=e237] [cursor=pointer]:
                - /url: /contact
          - generic [ref=e238]:
            - heading "Contact" [level=4] [ref=e239]
            - paragraph [ref=e240]: For press, management & enquiries
            - link "gannonwayemusic@gmail.com" [ref=e241] [cursor=pointer]:
              - /url: mailto:gannonwayemusic@gmail.com
            - heading "Legal" [level=4] [ref=e242]
            - generic [ref=e243]:
              - link "Privacy Policy" [ref=e244] [cursor=pointer]:
                - /url: /privacy-policy
              - link "Terms of Service" [ref=e245] [cursor=pointer]:
                - /url: /terms-of-service
              - link "Contact Gannon" [ref=e246] [cursor=pointer]:
                - /url: /contact
            - heading "Social" [level=4] [ref=e247]
            - generic [ref=e248]:
              - link "Instagram @gann0nwaye" [ref=e249] [cursor=pointer]:
                - /url: https://www.instagram.com/gann0nwaye
              - link "TikTok @gann0nwaye" [ref=e250] [cursor=pointer]:
                - /url: https://www.tiktok.com/@gann0nwaye
              - link "YouTube @gannonwayeofficial" [ref=e251] [cursor=pointer]:
                - /url: https://www.youtube.com/@gannonwayeofficial
        - generic [ref=e252]:
          - paragraph [ref=e253]: Stay in the loop
          - heading "New music & community updates" [level=3] [ref=e254]
          - generic [ref=e255]:
            - textbox "Your name *" [ref=e256]
            - textbox "your@email.com *" [ref=e257]
            - textbox "Phone incl. country code e.g. +61 400 000 000 *" [ref=e258]
            - textbox "Birthday (optional — we'll send you something special)" [ref=e259]
            - paragraph [ref=e260]: Birthday optional — we'll send you something special 🎂
            - combobox [ref=e261]:
              - option "How did you find me? *" [selected]
              - option "Google"
              - option "Instagram"
              - option "Facebook"
              - option "TikTok"
              - option "X (Twitter)"
              - option "Friend / Word of Mouth"
              - option "I know Gannon"
              - option "Other"
            - button "Subscribe" [ref=e262] [cursor=pointer]
        - paragraph [ref=e264]: "* Support contributions are direct-support gifts to Gannon Waye as an independent artist to fund album production, merchandise sampling, and system operations; they are not tax-deductible."
        - generic [ref=e265]:
          - generic [ref=e266]:
            - img "GW Heart" [ref=e267]
            - link "Support the project 🤍" [ref=e268] [cursor=pointer]:
              - /url: /back-this
            - img "GW Heart" [ref=e269]
          - paragraph [ref=e270]: © 2026 Gannon Waye. All rights reserved.
    - generic [ref=e271]:
      - img [ref=e272]
      - paragraph [ref=e274]: 🖤10% of all proceeds support 1800RESPECT
      - button "Dismiss" [ref=e275] [cursor=pointer]:
        - img [ref=e276]
```

# Test source

```ts
  1   | // SECTION IDS CHANGED when the garden was rebuilt as the immersive scroll world.
  2   | // Old ids: sonias-garden, who-she-was, without-you-here.
  3   | // Live ids: arrival, trees, memories, garden, archway, rooms, bench, conclusion.
  4   | // Mapped the unambiguous one (sonias-garden -> garden). #memories still exists.
  5   | // who-she-was and without-you-here have NO current equivalent — those assertions are
  6   | // left as-is deliberately so they keep failing loudly until Gannon says what replaced them.
  7   | // @ts-check
  8   |  
  9   | /* eslint-disable no-undef */
  10  | const { test, expect } = require('@playwright/test');
  11  | 
  12  | const BASE = 'http://localhost:5173';
  13  | 
  14  | test.describe('Mum Tribute Page', () => {
  15  | 
  16  |   test('/mum loads and shows hero', async ({ page }) => {
  17  |     await page.goto(`${BASE}/mum`);
  18  |     await page.waitForLoadState('load');
  19  |     await expect(page.locator('h1')).toContainText('For Mum');
  20  |   });
  21  | 
  22  |   test('/without-you-here alias loads', async ({ page }) => {
  23  |     await page.goto(`${BASE}/without-you-here`);
  24  |     await page.waitForLoadState('load');
  25  |     await expect(page.locator('h1')).toContainText('For Mum');
  26  |   });
  27  | 
  28  |   test('mum-hero section is present', async ({ page }) => {
  29  |     await page.goto(`${BASE}/mum`);
  30  |     await page.waitForLoadState('load');
  31  |     await expect(page.locator('[data-testid="mum-hero"]')).toBeVisible();
  32  |   });
  33  | 
  34  |   test('approved tribute artwork is displayed cleanly (no giant overlay)', async ({ page }) => {
  35  |     await page.goto(`${BASE}/mum`);
  36  |     await page.waitForLoadState('load');
  37  |     // Artwork img should be present and visible
  38  |     const artwork = page.locator('[data-testid="mum-hero-artwork"]');
  39  |     await expect(artwork).toBeVisible();
  40  |     // Artwork frame should be present
  41  |     const frame = page.locator('[data-testid="mum-hero-artwork-frame"]');
  42  |     await expect(frame).toBeVisible();
  43  |   });
  44  | 
  45  |   test('Sonia Katisa Waye name is visible', async ({ page }) => {
  46  |     await page.goto(`${BASE}/mum`);
  47  |     await page.waitForLoadState('load');
  48  |     await expect(page.locator('text=Sonia Katisa Waye').first()).toBeVisible();
  49  |   });
  50  | 
  51  |   test('1961 and 2022 dates are visible', async ({ page }) => {
  52  |     await page.goto(`${BASE}/mum`);
  53  |     await page.waitForLoadState('load');
  54  |     await expect(page.locator('text=1961').first()).toBeVisible();
  55  |     await expect(page.locator('text=2022').first()).toBeVisible();
  56  |   });
  57  | 
  58  |   test('heart of gold emblem is present', async ({ page }) => {
  59  |     await page.goto(`${BASE}/mum`);
  60  |     await page.waitForLoadState('load');
  61  |     const heart = page.locator('.memorial-heart').first();
  62  |     await expect(heart).toBeVisible();
  63  |   });
  64  | 
  65  |   test('Enter Her Garden button is visible and links to #who-she-was', async ({ page }) => {
  66  |     await page.goto(`${BASE}/mum`);
  67  |     await page.waitForLoadState('load');
  68  |     const btn = page.locator('text=Enter Her Garden').first();
  69  |     await expect(btn).toBeVisible();
  70  |   });
  71  | 
  72  |   test('Hear Her Wisdom button is visible and links to #garden', async ({ page }) => {
  73  |     await page.goto(`${BASE}/mum`);
  74  |     await page.waitForLoadState('load');
  75  |     const btn = page.locator('text=Hear Her Wisdom').first();
  76  |     await expect(btn).toBeVisible();
  77  |   });
  78  | 
  79  |   test('Who She Was section present', async ({ page }) => {
  80  |     await page.goto(`${BASE}/mum`);
  81  |     await page.waitForLoadState('load');
> 82  |     await page.locator('#who-she-was').scrollIntoViewIfNeeded();
      |                                        ^ Error: locator.scrollIntoViewIfNeeded: Test timeout of 60000ms exceeded.
  83  |     await expect(page.locator('text=Who She Was').first()).toBeVisible();
  84  |   });
  85  | 
  86  |   test('memory gallery section is present with real photos', async ({ page }) => {
  87  |     await page.goto(`${BASE}/mum`);
  88  |     await page.waitForLoadState('load');
  89  |     await page.locator('#memories').scrollIntoViewIfNeeded();
  90  |     const images = page.locator('#memories img');
  91  |     const count = await images.count();
  92  |     expect(count).toBeGreaterThanOrEqual(4);
  93  |   });
  94  | 
  95  |   test('memory gallery photos use base44 CDN or local assets', async ({ page }) => {
  96  |     await page.goto(`${BASE}/mum`);
  97  |     await page.waitForLoadState('load');
  98  |     await page.locator('#memories').scrollIntoViewIfNeeded();
  99  |     const imgs = page.locator('#memories img');
  100 |     const count = await imgs.count();
  101 |     for (let i = 0; i < count; i++) {
  102 |       const src = await imgs.nth(i).getAttribute('src');
  103 |       // All real photos must come from base44 CDN or local assets folder
  104 |       expect(src).toMatch(/media\.base44\.com|\/images\//);
  105 |     }
  106 |   });
  107 | 
  108 |   test("Sonia's Garden of Wisdom section is present", async ({ page }) => {
  109 |     await page.goto(`${BASE}/mum`);
  110 |     await page.waitForLoadState('load');
  111 |     await page.locator('#garden').scrollIntoViewIfNeeded();
  112 |     await expect(page.locator('text=Sonia\'s Garden of Wisdom').first()).toBeVisible();
  113 |   });
  114 | 
  115 |   test('wisdom cards are clickable and show comfort response', async ({ page }) => {
  116 |     await page.goto(`${BASE}/mum`);
  117 |     await page.waitForLoadState('load');
  118 |     await page.locator('#garden').scrollIntoViewIfNeeded();
  119 |     await page.locator('button:has-text("I need comfort")').first().click();
  120 |     await expect(page.locator('text=Take a breath').first()).toBeVisible({ timeout: 4000 });
  121 |   });
  122 | 
  123 |   test('wisdom cards show strength response', async ({ page }) => {
  124 |     await page.goto(`${BASE}/mum`);
  125 |     await page.waitForLoadState('load');
  126 |     await page.locator('#garden').scrollIntoViewIfNeeded();
  127 |     await page.locator('button:has-text("I need strength")').first().click();
  128 |     await expect(page.locator('text=survived').first()).toBeVisible({ timeout: 4000 });
  129 |   });
  130 | 
  131 |   test('safety note (Lifeline 13 11 14) is visible', async ({ page }) => {
  132 |     await page.goto(`${BASE}/mum`);
  133 |     await page.waitForLoadState('load');
  134 |     await page.locator('#garden').scrollIntoViewIfNeeded();
  135 |     await expect(page.locator('text=Lifeline').first()).toBeVisible();
  136 |     await expect(page.locator('text=13 11 14').first()).toBeVisible();
  137 |   });
  138 | 
  139 |   test('disclaimer (Not medical) is visible', async ({ page }) => {
  140 |     await page.goto(`${BASE}/mum`);
  141 |     await page.waitForLoadState('load');
  142 |     await page.locator('#garden').scrollIntoViewIfNeeded();
  143 |     await expect(page.locator('text=Not medical').first()).toBeVisible();
  144 |   });
  145 | 
  146 |   test('Without You Here song section present', async ({ page }) => {
  147 |     await page.goto(`${BASE}/mum`);
  148 |     await page.waitForLoadState('load');
  149 |     await page.locator('#without-you-here').scrollIntoViewIfNeeded();
  150 |     await expect(page.locator('text=Without You Here').first()).toBeVisible();
  151 |   });
  152 | 
  153 |   test('A Letter To Mum section present', async ({ page }) => {
  154 |     await page.goto(`${BASE}/mum`);
  155 |     await page.waitForLoadState('load');
  156 |     await expect(page.locator('text=A Letter To Mum').first()).toBeVisible();
  157 |   });
  158 | 
  159 |   test('Forever Loved closing section present', async ({ page }) => {
  160 |     await page.goto(`${BASE}/mum`);
  161 |     await page.waitForLoadState('load');
  162 |     await expect(page.locator('text=Forever Loved').first()).toBeVisible();
  163 |   });
  164 | 
  165 |   test('Back Home and Explore My Music buttons present', async ({ page }) => {
  166 |     await page.goto(`${BASE}/mum`);
  167 |     await page.waitForLoadState('load');
  168 |     await expect(page.locator('text=Back Home').first()).toBeVisible();
  169 |     await expect(page.locator('text=Explore My Music').first()).toBeVisible();
  170 |   });
  171 | 
  172 |   test('no console errors on load', async ({ page }) => {
  173 |     const errors = [];
  174 |     page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  175 |     await page.goto(`${BASE}/mum`);
  176 |     await page.waitForLoadState('load');
  177 |     const realErrors = errors.filter(e =>
  178 |       !e.includes('favicon') && !e.includes('net::ERR') && !e.includes('ERR_NETWORK') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required')
  179 |     );
  180 |     expect(realErrors).toHaveLength(0);
  181 |   });
  182 | 
```