# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: systems-manager-links.spec.js >> Systems Manager — service destination pages load >> /systems/social-automation loads
- Location: src/gannonwaye-playwright-pack/tests/systems-manager-links.spec.js:51:9

# Error details

```
Error: expect(locator).not.toContainText(expected) failed

Locator: locator('body')
Expected substring: not "404"
Received string: "
    Support Now404Page Not FoundThe page \"systems/social-automation\" could not be found.Go Home
  

"
Timeout: 10000ms

Call log:
  - Expect "not toContainText" with timeout 10000ms
  - waiting for locator('body')
    16 × locator resolved to <body>…</body>
       - unexpected value "
    Support Now404Page Not FoundThe page "systems/social-automation" could not be found.Go Home
  

"

```

```yaml
- link "Support Now":
  - /url: /back-this
  - button "Support Now"
- heading "404" [level=1]
- heading "Page Not Found" [level=2]
- paragraph: The page "systems/social-automation" could not be found.
- button "Go Home"
```

# Test source

```ts
  1  | // @ts-check
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | test.describe('Systems Manager — service card routing', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await page.goto('/systems-manager');
  7  |     await page.waitForLoadState('networkidle');
  8  |   });
  9  | 
  10 |   test('page loads with headline', async ({ page }) => {
  11 |     await expect(page.locator('h1')).toContainText(/systems/i);
  12 |   });
  13 | 
  14 |   test('Cinematic Websites card links to correct page', async ({ page }) => {
  15 |     const link = page.locator('a[href*="cinematic-websites"]').first();
  16 |     await expect(link).toBeVisible();
  17 |     await link.click();
  18 |     await expect(page).toHaveURL(/\/systems\/cinematic-websites/);
  19 |   });
  20 | 
  21 |   test('case study Gannon Waye card links to correct page', async ({ page }) => {
  22 |     const link = page.locator('a[href*="gannon-waye"]').first();
  23 |     if (await link.count() > 0) {
  24 |       await link.click();
  25 |       await expect(page).toHaveURL(/gannon-waye/);
  26 |     }
  27 |   });
  28 | 
  29 |   test('case study GanozMix card links to correct page', async ({ page }) => {
  30 |     const link = page.locator('a[href*="ganozmix"]').first();
  31 |     if (await link.count() > 0) {
  32 |       await link.click();
  33 |       await expect(page).toHaveURL(/ganozmix/);
  34 |     }
  35 |   });
  36 | });
  37 | 
  38 | test.describe('Systems Manager — service destination pages load', () => {
  39 |   const SERVICE_ROUTES = [
  40 |     '/systems/cinematic-websites',
  41 |     '/systems/social-automation',
  42 |     '/systems/dropshipping-inventory',
  43 |     '/systems/control-panels',
  44 |     '/systems/ecommerce-merch-stores',
  45 |     '/systems/approval-workflows',
  46 |     '/systems/ai-content-systems',
  47 |     '/systems/artist-release-systems',
  48 |   ];
  49 | 
  50 |   for (const route of SERVICE_ROUTES) {
  51 |     test(`${route} loads`, async ({ page }) => {
  52 |       await page.goto(route);
  53 |       await page.waitForLoadState('networkidle');
> 54 |       await expect(page.locator('body')).not.toContainText('404');
     |                                              ^ Error: expect(locator).not.toContainText(expected) failed
  55 |       await expect(page.locator('body')).not.toContainText('Page Not Found');
  56 |     });
  57 |   }
  58 | });
  59 | 
  60 | test.describe('Systems Manager — case study pages', () => {
  61 |   test('/systems/case-studies/gannon-waye-music-os loads', async ({ page }) => {
  62 |     await page.goto('/systems/case-studies/gannon-waye-music-os');
  63 |     await page.waitForLoadState('networkidle');
  64 |     await expect(page.locator('h1')).toContainText(/Gannon Waye/i);
  65 |     await expect(page.locator('body')).not.toContainText('404');
  66 |   });
  67 | 
  68 |   test('/systems/case-studies/ganozmix-direct loads', async ({ page }) => {
  69 |     await page.goto('/systems/case-studies/ganozmix-direct');
  70 |     await page.waitForLoadState('networkidle');
  71 |     await expect(page.locator('h1')).toContainText(/GanozMix/i);
  72 |     await expect(page.locator('body')).not.toContainText('404');
  73 |   });
  74 | });
  75 | 
  76 | test.describe('Admin edit buttons — hidden from public', () => {
  77 |   test('admin edit buttons are not visible to unauthenticated visitors on /store', async ({ page }) => {
  78 |     await page.goto('/store');
  79 |     await page.waitForLoadState('networkidle');
  80 |     // Admin edit buttons contain the "Edit" pencil link — should not exist for public
  81 |     const adminButtons = page.locator('[data-testid="admin-edit-btn"]');
  82 |     await expect(adminButtons).toHaveCount(0);
  83 |   });
  84 | 
  85 |   test('admin edit buttons are not visible on /systems-manager', async ({ page }) => {
  86 |     await page.goto('/systems-manager');
  87 |     await page.waitForLoadState('networkidle');
  88 |     const adminButtons = page.locator('[data-testid="admin-edit-btn"]');
  89 |     await expect(adminButtons).toHaveCount(0);
  90 |   });
  91 | });
```