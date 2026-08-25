# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mum-tribute.spec.js >> Mum Tribute Page >> approved tribute artwork is displayed cleanly (no giant overlay)
- Location: src/gannonwaye-playwright-pack/tests/mum-tribute.spec.js:28:3

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
- heading "404" [level=1]
- heading "Page Not Found" [level=2]
- paragraph: The page "mum" could not be found.
- button "Go Home"
```

# Test source

```ts
  1   | // @ts-check
  2   |  
  3   | /* eslint-disable no-undef */
  4   | const { test, expect } = require('@playwright/test');
  5   | 
  6   | const BASE = 'http://localhost:5173';
  7   | 
  8   | test.describe('Mum Tribute Page', () => {
  9   | 
  10  |   test('/mum loads and shows hero', async ({ page }) => {
  11  |     await page.goto(`${BASE}/mum`);
  12  |     await page.waitForLoadState('load');
  13  |     await expect(page.locator('h1')).toContainText('For Mum');
  14  |   });
  15  | 
  16  |   test('/without-you-here alias loads', async ({ page }) => {
  17  |     await page.goto(`${BASE}/without-you-here`);
  18  |     await page.waitForLoadState('load');
  19  |     await expect(page.locator('h1')).toContainText('For Mum');
  20  |   });
  21  | 
  22  |   test('mum-hero section is present', async ({ page }) => {
  23  |     await page.goto(`${BASE}/mum`);
  24  |     await page.waitForLoadState('load');
  25  |     await expect(page.locator('[data-testid="mum-hero"]')).toBeVisible();
  26  |   });
  27  | 
  28  |   test('approved tribute artwork is displayed cleanly (no giant overlay)', async ({ page }) => {
  29  |     await page.goto(`${BASE}/mum`);
  30  |     await page.waitForLoadState('load');
  31  |     // Artwork img should be present and visible
  32  |     const artwork = page.locator('[data-testid="mum-hero-artwork"]');
> 33  |     await expect(artwork).toBeVisible();
      |                           ^ Error: expect(locator).toBeVisible() failed
  34  |     // Artwork frame should be present
  35  |     const frame = page.locator('[data-testid="mum-hero-artwork-frame"]');
  36  |     await expect(frame).toBeVisible();
  37  |   });
  38  | 
  39  |   test('Sonia Katisa Waye name is visible', async ({ page }) => {
  40  |     await page.goto(`${BASE}/mum`);
  41  |     await page.waitForLoadState('load');
  42  |     await expect(page.locator('text=Sonia Katisa Waye').first()).toBeVisible();
  43  |   });
  44  | 
  45  |   test('1961 and 2022 dates are visible', async ({ page }) => {
  46  |     await page.goto(`${BASE}/mum`);
  47  |     await page.waitForLoadState('load');
  48  |     await expect(page.locator('text=1961').first()).toBeVisible();
  49  |     await expect(page.locator('text=2022').first()).toBeVisible();
  50  |   });
  51  | 
  52  |   test('heart of gold emblem is present', async ({ page }) => {
  53  |     await page.goto(`${BASE}/mum`);
  54  |     await page.waitForLoadState('load');
  55  |     const heart = page.locator('.memorial-heart').first();
  56  |     await expect(heart).toBeVisible();
  57  |   });
  58  | 
  59  |   test('Enter Her Garden button is visible and links to #who-she-was', async ({ page }) => {
  60  |     await page.goto(`${BASE}/mum`);
  61  |     await page.waitForLoadState('load');
  62  |     const btn = page.locator('text=Enter Her Garden').first();
  63  |     await expect(btn).toBeVisible();
  64  |   });
  65  | 
  66  |   test('Hear Her Wisdom button is visible and links to #sonias-garden', async ({ page }) => {
  67  |     await page.goto(`${BASE}/mum`);
  68  |     await page.waitForLoadState('load');
  69  |     const btn = page.locator('text=Hear Her Wisdom').first();
  70  |     await expect(btn).toBeVisible();
  71  |   });
  72  | 
  73  |   test('Who She Was section present', async ({ page }) => {
  74  |     await page.goto(`${BASE}/mum`);
  75  |     await page.waitForLoadState('load');
  76  |     await page.locator('#who-she-was').scrollIntoViewIfNeeded();
  77  |     await expect(page.locator('text=Who She Was').first()).toBeVisible();
  78  |   });
  79  | 
  80  |   test('memory gallery section is present with real photos', async ({ page }) => {
  81  |     await page.goto(`${BASE}/mum`);
  82  |     await page.waitForLoadState('load');
  83  |     await page.locator('#memories').scrollIntoViewIfNeeded();
  84  |     const images = page.locator('#memories img');
  85  |     const count = await images.count();
  86  |     expect(count).toBeGreaterThanOrEqual(4);
  87  |   });
  88  | 
  89  |   test('memory gallery photos use base44 CDN or local assets', async ({ page }) => {
  90  |     await page.goto(`${BASE}/mum`);
  91  |     await page.waitForLoadState('load');
  92  |     await page.locator('#memories').scrollIntoViewIfNeeded();
  93  |     const imgs = page.locator('#memories img');
  94  |     const count = await imgs.count();
  95  |     for (let i = 0; i < count; i++) {
  96  |       const src = await imgs.nth(i).getAttribute('src');
  97  |       // All real photos must come from base44 CDN or local assets folder
  98  |       expect(src).toMatch(/media\.base44\.com|\/images\//);
  99  |     }
  100 |   });
  101 | 
  102 |   test("Sonia's Garden of Wisdom section is present", async ({ page }) => {
  103 |     await page.goto(`${BASE}/mum`);
  104 |     await page.waitForLoadState('load');
  105 |     await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
  106 |     await expect(page.locator('text=Sonia\'s Garden of Wisdom').first()).toBeVisible();
  107 |   });
  108 | 
  109 |   test('wisdom cards are clickable and show comfort response', async ({ page }) => {
  110 |     await page.goto(`${BASE}/mum`);
  111 |     await page.waitForLoadState('load');
  112 |     await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
  113 |     await page.locator('button:has-text("I need comfort")').first().click();
  114 |     await expect(page.locator('text=Take a breath').first()).toBeVisible({ timeout: 4000 });
  115 |   });
  116 | 
  117 |   test('wisdom cards show strength response', async ({ page }) => {
  118 |     await page.goto(`${BASE}/mum`);
  119 |     await page.waitForLoadState('load');
  120 |     await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
  121 |     await page.locator('button:has-text("I need strength")').first().click();
  122 |     await expect(page.locator('text=survived').first()).toBeVisible({ timeout: 4000 });
  123 |   });
  124 | 
  125 |   test('safety note (Lifeline 13 11 14) is visible', async ({ page }) => {
  126 |     await page.goto(`${BASE}/mum`);
  127 |     await page.waitForLoadState('load');
  128 |     await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
  129 |     await expect(page.locator('text=Lifeline').first()).toBeVisible();
  130 |     await expect(page.locator('text=13 11 14').first()).toBeVisible();
  131 |   });
  132 | 
  133 |   test('disclaimer (Not medical) is visible', async ({ page }) => {
```