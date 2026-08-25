# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mum-tribute.spec.js >> Mum Tribute Page >> /without-you-here alias loads
- Location: src/gannonwaye-playwright-pack/tests/mum-tribute.spec.js:22:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "For Mum"
Received string:    "404"
Timeout: 10000ms

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('h1')
    22 × locator resolved to <h1 data-dynamic-content="false" data-source-location="src/lib/PageNotFound.jsx:29:24" class="text-7xl font-display text-muted-foreground/30">404</h1>
       - unexpected value "404"

```

```yaml
- heading "404" [level=1]
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
> 25  |     await expect(page.locator('h1')).toContainText('For Mum');
      |                                      ^ Error: expect(locator).toContainText(expected) failed
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
  82  |     await page.locator('#who-she-was').scrollIntoViewIfNeeded();
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
```