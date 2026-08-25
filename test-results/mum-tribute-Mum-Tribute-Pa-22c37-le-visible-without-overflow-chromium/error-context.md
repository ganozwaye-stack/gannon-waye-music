# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mum-tribute.spec.js >> Mum Tribute Page >> mobile layout — artwork and title visible without overflow
- Location: src/gannonwaye-playwright-pack/tests/mum-tribute.spec.js:183:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="mum-hero-artwork"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('[data-testid="mum-hero-artwork"]')

```

```yaml
- link "Support Now":
  - /url: /back-this
  - button "Support Now"
- navigation:
  - link "Gannon Waye · Home":
    - /url: /
    - text: GW
  - button:
    - img
  - button "Open cart":
    - img
  - button:
    - img
- main:
  - button "Toggle reduced motion":
    - img
    - text: Cinematic motion
  - paragraph: A Garden for Sonia
  - heading "Sonia’s Garden" [level=1]
  - paragraph: In loving memory of Sonia Katisa Waye
  - button "Enter the Garden":
    - text: Enter the Garden
    - img
  - link "Listen to Without You Here":
    - /url: /music
    - img
    - text: Listen to Without You Here
  - text: Full-screen world image — awaiting approved asset
  - paragraph: Step softly — the trees open slowly, the way memory does.
  - button "Walk deeper":
    - text: Walk deeper
    - img
  - heading "Memories among the trees" [level=2]
  - paragraph: Move close to a frame · the garden waits
  - figure:
    - text: Awaiting approved photograph
    - paragraph: Coffee in the Garden
  - figure:
    - text: Awaiting approved photograph
    - paragraph: Sonia's Gold Rings
  - figure:
    - text: Awaiting approved photograph
    - paragraph: A Quiet Morning
  - button "Into the real garden":
    - text: Into the real garden
    - img
  - heading "Her real garden" [level=2]
  - paragraph: An Adelaide backyard, quiet and alive — the place she tended with her hands.
  - text: Awaiting anchor photograph (IMG_3244)
  - list:
    - listitem: Orange flowering vine
    - listitem: Elephant ear plants
    - listitem: Monstera
    - listitem: Spider plants
    - listitem: Dense green foliage
    - listitem: The round concrete table
    - listitem: The garden bench
  - button "Toward the archway":
    - text: Toward the archway
    - img
  - paragraph: Between the two homes
  - heading "Onya & Gay’s Archway" [level=2]
  - paragraph: Passing through is entering another chapter of the memory.
  - button "Pass through":
    - text: Pass through
    - img
  - heading "Garden rooms & doorways" [level=2]
  - paragraph: Open a doorway · return when you are ready
  - button "Doorway 01 Carla Sister · held close in the garden light"
  - button "Doorway 02 Gannon Son · the songs carry her forward"
  - button "Doorway 03 Jarrad Family · quiet strength among the leaves"
  - button "Doorway 04 Crystal Family · laughter in the green rooms"
  - button "Doorway 05 Everyday gold Small rituals that made the garden home"
  - button "To the bench":
    - text: To the bench
    - img
  - paragraph: Rest here
  - heading "The bench garden" [level=2]
  - paragraph: “Sit a while. The garden does not hurry, and neither should your remembering.”
  - button "When you are ready":
    - text: When you are ready
    - img
  - paragraph: The garden becomes a song
  - heading "Without You Here" [level=2]
  - paragraph: If you would like to hear it, the choice is yours.
  - link "Listen on the Music page":
    - /url: /music
    - img
    - text: Listen on the Music page
  - link "Apple Music":
    - /url: ""
    - text: Apple Music
    - img
  - paragraph: “She is the garden now.”
  - paragraph: Forever in our hearts
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
- img
- paragraph: 🖤10% of all proceeds support 1800RESPECT
- button "Dismiss":
  - img
```

# Test source

```ts
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
  183 |   test('mobile layout — artwork and title visible without overflow', async ({ page }) => {
  184 |     await page.setViewportSize({ width: 390, height: 844 });
  185 |     await page.goto(`${BASE}/mum`);
  186 |     await page.waitForLoadState('load');
  187 |     await expect(page.locator('h1')).toBeVisible();
> 188 |     await expect(page.locator('[data-testid="mum-hero-artwork"]')).toBeVisible();
      |                                                                    ^ Error: expect(locator).toBeVisible() failed
  189 |     // Check no horizontal scroll
  190 |     const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  191 |     const viewportWidth = await page.evaluate(() => window.innerWidth);
  192 |     expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 2);
  193 |   });
  194 | 
  195 |   test('reduced motion — page still loads correctly', async ({ page }) => {
  196 |     await page.emulateMedia({ reducedMotion: 'reduce' });
  197 |     await page.goto(`${BASE}/mum`);
  198 |     await page.waitForLoadState('load');
  199 |     await expect(page.locator('h1')).toContainText('For Mum');
  200 |     await expect(page.locator('[data-testid="mum-hero-artwork"]')).toBeVisible();
  201 |   });
  202 | 
  203 |   test('garden atmosphere background is present', async ({ page }) => {
  204 |     await page.goto(`${BASE}/mum`);
  205 |     await page.waitForLoadState('load');
  206 |     await expect(page.locator('#sonias-garden-bg').first()).toBeVisible();
  207 |   });
  208 | 
  209 | });
```