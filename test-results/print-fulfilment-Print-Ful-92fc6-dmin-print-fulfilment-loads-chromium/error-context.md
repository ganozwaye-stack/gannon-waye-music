# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: print-fulfilment.spec.js >> Print Fulfilment Admin Page >> /admin/print-fulfilment loads
- Location: src/gannonwaye-playwright-pack/tests/print-fulfilment.spec.js:6:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h1')
Expected substring: "Print Fulfilment"
Received string:    "404"
Timeout: 10000ms

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('h1')
    22 × locator resolved to <h1 class="text-7xl font-display text-muted-foreground/30">404</h1>
       - unexpected value "404"

```

```yaml
- heading "404" [level=1]
```

# Test source

```ts
  1  | // Print Fulfilment Admin Page Tests
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | test.describe('Print Fulfilment Admin Page', () => {
  5  | 
  6  |   test('/admin/print-fulfilment loads', async ({ page }) => {
  7  |     await page.goto('/admin/print-fulfilment');
> 8  |     await expect(page.locator('h1')).toContainText('Print Fulfilment');
     |                                      ^ Error: expect(locator).toContainText(expected) failed
  9  |   });
  10 | 
  11 |   test('Provider records are displayed', async ({ page }) => {
  12 |     await page.goto('/admin/print-fulfilment');
  13 |     await expect(page.locator('body')).toContainText('Printful');
  14 |     await expect(page.locator('body')).toContainText('Printify');
  15 |     await expect(page.locator('body')).toContainText('Gelato');
  16 |     await expect(page.locator('body')).toContainText('Prodigi');
  17 |     await expect(page.locator('body')).toContainText('The Print Space');
  18 |     await expect(page.locator('body')).toContainText('Local AUS Print');
  19 |   });
  20 | 
  21 |   test('No active provider — manual fulfilment warning shown', async ({ page }) => {
  22 |     await page.goto('/admin/print-fulfilment');
  23 |     const text = await page.textContent('body');
  24 |     expect(
  25 |       text.toLowerCase().includes('manual') ||
  26 |       text.toLowerCase().includes('no provider')
  27 |     ).toBeTruthy();
  28 |   });
  29 | 
  30 |   test('API env var placeholders shown, not actual keys', async ({ page }) => {
  31 |     await page.goto('/admin/print-fulfilment');
  32 |     const text = await page.textContent('body');
  33 |     // Should show env var names, not actual key values
  34 |     expect(text).toContain('PRINTFUL_API_KEY');
  35 |     expect(text).toContain('GELATO_API_KEY');
  36 |     // Should NOT contain actual API key values (starts with live_ or test_)
  37 |     expect(text).not.toMatch(/live_[a-zA-Z0-9]{20,}/);
  38 |     expect(text).not.toMatch(/sk_live_[a-zA-Z0-9]{20,}/);
  39 |   });
  40 | 
  41 |   test('Size variants tab shows poster pricing', async ({ page }) => {
  42 |     await page.goto('/admin/print-fulfilment');
  43 |     await page.click('button:has-text("Size Variants")');
  44 |     await expect(page.locator('body')).toContainText('A4');
  45 |     await expect(page.locator('body')).toContainText('A3');
  46 |     await expect(page.locator('body')).toContainText('A2');
  47 |     await expect(page.locator('body')).toContainText('A1');
  48 |     await expect(page.locator('body')).toContainText('$19');
  49 |     await expect(page.locator('body')).toContainText('$29');
  50 |     await expect(page.locator('body')).toContainText('$39');
  51 |     await expect(page.locator('body')).toContainText('$59');
  52 |   });
  53 | 
  54 |   test('Human Action Required tab shows poster image requirement', async ({ page }) => {
  55 |     await page.goto('/admin/print-fulfilment');
  56 |     await page.click('button:has-text("Human Action Required")');
  57 |     await expect(page.locator('body')).toContainText('poster');
  58 |     await expect(page.locator('body')).toContainText('artwork');
  59 |   });
  60 | 
  61 |   test('Order Routing tab explains manual fallback', async ({ page }) => {
  62 |     await page.goto('/admin/print-fulfilment');
  63 |     await page.click('button:has-text("Order Routing")');
  64 |     await expect(page.locator('body')).toContainText('manual');
  65 |   });
  66 | 
  67 | });
```