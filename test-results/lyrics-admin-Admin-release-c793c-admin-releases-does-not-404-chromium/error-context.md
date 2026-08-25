# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lyrics-admin.spec.js >> Admin releases route >> /admin/releases does not 404
- Location: src/gannonwaye-playwright-pack/tests/lyrics-admin.spec.js:27:7

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
    22 × locator resolved to <body>…</body>
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
  15 |     await expect(page.locator('body')).toContainText(/thank\s*you/i);
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
> 31 |     await expect(page.locator('body')).not.toContainText('Page Not Found');
     |                                            ^ Error: expect(locator).not.toContainText(expected) failed
  32 |   });
  33 | });
```