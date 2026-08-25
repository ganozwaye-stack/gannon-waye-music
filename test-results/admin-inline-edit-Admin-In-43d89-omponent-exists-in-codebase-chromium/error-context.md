# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-inline-edit.spec.js >> Admin Inline Edit Buttons — Public Visibility >> Admin edit button component exists in codebase
- Location: src/gannonwaye-playwright-pack/tests/admin-inline-edit.spec.js:21:7

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
    20 × locator resolved to <body>…</body>
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
  1  | // Admin Inline Edit Button Tests
  2  | // Verifies admin edit buttons are hidden from public and visible to admin.
  3  | import { test, expect } from '@playwright/test';
  4  | 
  5  | test.describe('Admin Inline Edit Buttons — Public Visibility', () => {
  6  | 
  7  |   test('Edit buttons NOT visible to unauthenticated public user on store', async ({ page }) => {
  8  |     await page.goto('/store/all');
  9  |     // Admin edit buttons have no data-testid by design — look for Edit text in gold admin buttons
  10 |     // They should not appear for unauthenticated users
  11 |     const editLinks = await page.locator('a[href*="/admin/merch"]:has-text("Edit")').count();
  12 |     expect(editLinks).toBe(0);
  13 |   });
  14 | 
  15 |   test('Edit buttons NOT visible on public store world page', async ({ page }) => {
  16 |     await page.goto('/store');
  17 |     const editLinks = await page.locator('a:has-text("Edit")').count();
  18 |     expect(editLinks).toBe(0);
  19 |   });
  20 | 
  21 |   test('Admin edit button component exists in codebase', async ({ page }) => {
  22 |     // Verify the admin routes exist (which means AdminEditButton is importable)
  23 |     await page.goto('/admin');
  24 |     // If page loads admin dashboard, the component infrastructure is present
> 25 |     await expect(page.locator('body')).not.toContainText('Page Not Found');
     |                                            ^ Error: expect(locator).not.toContainText(expected) failed
  26 |   });
  27 | 
  28 | });
  29 | 
  30 | // Note: Admin-visible edit button tests require an authenticated admin session.
  31 | // These run in a separate auth-required context.
  32 | test.describe('Admin Inline Edit Buttons — Admin Visibility (requires auth)', () => {
  33 |   // These tests are documented but require manual auth setup or Base44 admin session token.
  34 |   // BLOCKER: Base44 platform handles auth — cannot programmatically log in as admin in Playwright
  35 |   // without a session fixture. Tests below are stubs for when auth fixture is available.
  36 | 
  37 |   test.skip('Edit buttons visible to admin on /store/all', async ({ page }) => {
  38 |     // Requires: page.context().addCookies([adminSessionCookie])
  39 |     await page.goto('/store/all');
  40 |     const editLinks = await page.locator('a[href*="/admin/merch"]:has-text("Edit")').count();
  41 |     expect(editLinks).toBeGreaterThan(0);
  42 |   });
  43 | 
  44 | });
```