# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mum-tribute.spec.js >> Mum Tribute Page >> garden atmosphere background is present
- Location: src/gannonwaye-playwright-pack/tests/mum-tribute.spec.js:197:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#sonias-garden-bg').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('#sonias-garden-bg').first()

```

```yaml
- heading "404" [level=1]
- heading "Page Not Found" [level=2]
- paragraph: The page "mum" could not be found.
- button "Go Home"
```

# Test source

```ts
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
  134 |     await page.goto(`${BASE}/mum`);
  135 |     await page.waitForLoadState('load');
  136 |     await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
  137 |     await expect(page.locator('text=Not medical').first()).toBeVisible();
  138 |   });
  139 | 
  140 |   test('Without You Here song section present', async ({ page }) => {
  141 |     await page.goto(`${BASE}/mum`);
  142 |     await page.waitForLoadState('load');
  143 |     await page.locator('#without-you-here').scrollIntoViewIfNeeded();
  144 |     await expect(page.locator('text=Without You Here').first()).toBeVisible();
  145 |   });
  146 | 
  147 |   test('A Letter To Mum section present', async ({ page }) => {
  148 |     await page.goto(`${BASE}/mum`);
  149 |     await page.waitForLoadState('load');
  150 |     await expect(page.locator('text=A Letter To Mum').first()).toBeVisible();
  151 |   });
  152 | 
  153 |   test('Forever Loved closing section present', async ({ page }) => {
  154 |     await page.goto(`${BASE}/mum`);
  155 |     await page.waitForLoadState('load');
  156 |     await expect(page.locator('text=Forever Loved').first()).toBeVisible();
  157 |   });
  158 | 
  159 |   test('Back Home and Explore My Music buttons present', async ({ page }) => {
  160 |     await page.goto(`${BASE}/mum`);
  161 |     await page.waitForLoadState('load');
  162 |     await expect(page.locator('text=Back Home').first()).toBeVisible();
  163 |     await expect(page.locator('text=Explore My Music').first()).toBeVisible();
  164 |   });
  165 | 
  166 |   test('no console errors on load', async ({ page }) => {
  167 |     const errors = [];
  168 |     page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  169 |     await page.goto(`${BASE}/mum`);
  170 |     await page.waitForLoadState('load');
  171 |     const realErrors = errors.filter(e =>
  172 |       !e.includes('favicon') && !e.includes('net::ERR') && !e.includes('ERR_NETWORK') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required')
  173 |     );
  174 |     expect(realErrors).toHaveLength(0);
  175 |   });
  176 | 
  177 |   test('mobile layout — artwork and title visible without overflow', async ({ page }) => {
  178 |     await page.setViewportSize({ width: 390, height: 844 });
  179 |     await page.goto(`${BASE}/mum`);
  180 |     await page.waitForLoadState('load');
  181 |     await expect(page.locator('h1')).toBeVisible();
  182 |     await expect(page.locator('[data-testid="mum-hero-artwork"]')).toBeVisible();
  183 |     // Check no horizontal scroll
  184 |     const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  185 |     const viewportWidth = await page.evaluate(() => window.innerWidth);
  186 |     expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 2);
  187 |   });
  188 | 
  189 |   test('reduced motion — page still loads correctly', async ({ page }) => {
  190 |     await page.emulateMedia({ reducedMotion: 'reduce' });
  191 |     await page.goto(`${BASE}/mum`);
  192 |     await page.waitForLoadState('load');
  193 |     await expect(page.locator('h1')).toContainText('For Mum');
  194 |     await expect(page.locator('[data-testid="mum-hero-artwork"]')).toBeVisible();
  195 |   });
  196 | 
  197 |   test('garden atmosphere background is present', async ({ page }) => {
  198 |     await page.goto(`${BASE}/mum`);
  199 |     await page.waitForLoadState('load');
> 200 |     await expect(page.locator('#sonias-garden-bg').first()).toBeVisible();
      |                                                             ^ Error: expect(locator).toBeVisible() failed
  201 |   });
  202 | 
  203 | });
```