# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: base44-exit-plan.spec.js >> Admin — Base44 Exit Plan and Legal Drafts >> /admin/master-blueprint loads without 404
- Location: src/gannonwaye-playwright-pack/tests/base44-exit-plan.spec.js:22:7

# Error details

```
Error: expect(locator).not.toContainText(expected) failed

Locator: locator('body')
Expected substring: not "Page Not Found"
Received string: "
    Support Now404Page Not FoundThe page \"login\" could not be found.Go Home
  

"
Timeout: 10000ms

Call log:
  - Expect "not toContainText" with timeout 10000ms
  - waiting for locator('body')
    23 × locator resolved to <body>…</body>
       - unexpected value "
    Support Now404Page Not FoundThe page "login" could not be found.Go Home
  

"

```

```yaml
- link "Support Now":
  - /url: /back-this
  - button "Support Now"
- heading "404" [level=1]
- heading "Page Not Found" [level=2]
- paragraph: The page "login" could not be found.
- button "Go Home"
```

# Test source

```ts
  1  | // @ts-check
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | test.describe('Admin — Base44 Exit Plan and Legal Drafts', () => {
  5  |   // These routes are admin-only — tests confirm pages load and render content
  6  |   // Run these in a context where admin session is active
  7  | 
  8  |   test('/admin/base44-exit-plan route exists and does not 404', async ({ page }) => {
  9  |     await page.goto('/admin/base44-exit-plan');
  10 |     await page.waitForLoadState('networkidle');
  11 |     await expect(page.locator('body')).not.toContainText('Page Not Found');
  12 |     await expect(page.locator('body')).not.toContainText('404');
  13 |   });
  14 | 
  15 |   test('/admin/legal-drafts route exists and does not 404', async ({ page }) => {
  16 |     await page.goto('/admin/legal-drafts');
  17 |     await page.waitForLoadState('networkidle');
  18 |     await expect(page.locator('body')).not.toContainText('Page Not Found');
  19 |     await expect(page.locator('body')).not.toContainText('404');
  20 |   });
  21 | 
  22 |   test('/admin/master-blueprint loads without 404', async ({ page }) => {
  23 |     await page.goto('/admin/master-blueprint');
  24 |     await page.waitForLoadState('networkidle');
> 25 |     await expect(page.locator('body')).not.toContainText('Page Not Found');
     |                                            ^ Error: expect(locator).not.toContainText(expected) failed
  26 |   });
  27 | 
  28 |   test('no random redirect to dashboard from public pages', async ({ page }) => {
  29 |     await page.goto('/store');
  30 |     await page.waitForLoadState('networkidle');
  31 |     await expect(page).not.toHaveURL('/admin');
  32 |     await expect(page).toHaveURL(/\/store/);
  33 |   });
  34 | 
  35 |   test('public lyrics page does not redirect to admin', async ({ page }) => {
  36 |     await page.goto('/lyrics');
  37 |     await page.waitForLoadState('networkidle');
  38 |     await expect(page).not.toHaveURL('/admin');
  39 |   });
  40 | });
```