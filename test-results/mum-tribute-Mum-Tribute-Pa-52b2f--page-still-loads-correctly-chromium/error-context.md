# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mum-tribute.spec.js >> Mum Tribute Page >> reduced motion — page still loads correctly
- Location: src/gannonwaye-playwright-pack/tests/mum-tribute.spec.js:195:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "For Mum"
Received string:    "Sonia’s Garden"
Timeout: 10000ms

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('h1')
    21 × locator resolved to <h1 data-dynamic-content="true" data-source-location="src/components/mums-garden/scenes/HeavenlyArrival.jsx:45:8" class="font-cormorant text-[clamp(3rem,8vw,6.5rem)] leading-none text-[hsl(var(--garden-cream))]">Sonia’s Garden</h1>
       - unexpected value "Sonia’s Garden"

```

```yaml
- heading "Sonia’s Garden" [level=1]
```

# Test source

```ts
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
  188 |     await expect(page.locator('[data-testid="mum-hero-artwork"]')).toBeVisible();
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
> 199 |     await expect(page.locator('h1')).toContainText('For Mum');
      |                                      ^ Error: expect(locator).toContainText(expected) failed
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