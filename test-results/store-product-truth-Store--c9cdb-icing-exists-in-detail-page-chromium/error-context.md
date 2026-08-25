# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: store-product-truth.spec.js >> Store Product Truth Audit >> Poster size pricing exists in detail page
- Location: src/gannonwaye-playwright-pack/tests/store-product-truth.spec.js:77:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
Timeout: 10000ms
- Expected substring  - 1
+ Received string     + 5

- A4
+
+     
+   
+
+

Call log:
  - Expect "toContainText" with timeout 10000ms
  - waiting for locator('body')
    14 × locator resolved to <body>…</body>
       - unexpected value "
    
  

"

```

# Test source

```ts
  1  | // Store Product Truth Audit
  2  | // Verifies prices, stock status, discount exclusions, and poster imagery requirements.
  3  | import { test, expect } from '@playwright/test';
  4  | 
  5  | test.describe('Store Product Truth Audit', () => {
  6  | 
  7  |   test('Store loads at /store/all', async ({ page }) => {
  8  |     await page.goto('/store/all');
  9  |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible({ timeout: 10000 });
  10 |   });
  11 | 
  12 |   test('Journal bundle shows $59', async ({ page }) => {
  13 |     await page.goto('/store/all');
  14 |     const prices = page.locator('[data-testid="product-price"]');
  15 |     await expect(prices).not.toHaveCount(0);
  16 |     const texts = await prices.allTextContents();
  17 |     expect(texts.some(t => t.includes('59'))).toBeTruthy();
  18 |   });
  19 | 
  20 |   test('Winter bundle shows $129', async ({ page }) => {
  21 |     await page.goto('/store/all');
  22 |     // Winter bundle is rendered by WinterBundleHero — check the hero section
  23 |     const hero = page.locator('[data-testid="winter-bundle-hero"]');
  24 |     await expect(hero).toBeVisible({ timeout: 8000 });
  25 |     await expect(hero).toContainText('129');
  26 |   });
  27 | 
  28 |   test('Winter bundle displays no further discounts apply messaging', async ({ page }) => {
  29 |     await page.goto('/store/all');
  30 |     const hero = page.locator('[data-testid="winter-bundle-hero"]');
  31 |     await expect(hero).toBeVisible({ timeout: 8000 });
  32 |     const text = await hero.textContent();
  33 |     expect(
  34 |       text.toLowerCase().includes('no further discount') ||
  35 |       text.toLowerCase().includes('discount') ||
  36 |       text.toLowerCase().includes('excluded')
  37 |     ).toBeTruthy();
  38 |   });
  39 | 
  40 |   test('Hoodie shows $89 and available', async ({ page }) => {
  41 |     await page.goto('/store/all');
  42 |     const prices = page.locator('[data-testid="product-price"]');
  43 |     const texts = await prices.allTextContents();
  44 |     expect(texts.some(t => t.includes('89'))).toBeTruthy();
  45 |   });
  46 | 
  47 |   test('Mug shows $9.90', async ({ page }) => {
  48 |     await page.goto('/store/all');
  49 |     const prices = page.locator('[data-testid="product-price"]');
  50 |     const texts = await prices.allTextContents();
  51 |     expect(texts.some(t => t.includes('9') && t.includes('90') || t.includes('9.90'))).toBeTruthy();
  52 |   });
  53 | 
  54 |   test('Tote bag shows sold out and will not be restocked', async ({ page }) => {
  55 |     await page.goto('/store/all');
  56 |     const page_text = await page.textContent('body');
  57 |     expect(page_text.toLowerCase()).toContain('tote');
  58 |     // Check sold out + will not be restocked messaging
  59 |     expect(
  60 |       page_text.toLowerCase().includes('not be restocked') ||
  61 |       page_text.toLowerCase().includes('sold out due to popular demand')
  62 |     ).toBeTruthy();
  63 |   });
  64 | 
  65 |   test('Poster product has poster-specific image or needs-images flag', async ({ page }) => {
  66 |     await page.goto('/store/all');
  67 |     const allImages = await page.locator('[data-testid="product-image"]').all();
  68 |     for (const img of allImages) {
  69 |       const src = await img.getAttribute('src');
  70 |       if (src) {
  71 |         // Poster must not use hoodie image
  72 |         expect(src).not.toContain('RespectisEarnedThankyouDarkGreyHoodieFront');
  73 |       }
  74 |     }
  75 |   });
  76 | 
  77 |   test('Poster size pricing exists in detail page', async ({ page }) => {
  78 |     await page.goto('/store/product/respect-is-earned-wall-poster');
> 79 |     await expect(page.locator('body')).toContainText('A4');
     |                                        ^ Error: expect(locator).toContainText(expected) failed
  80 |     await expect(page.locator('body')).toContainText('A3');
  81 |     await expect(page.locator('body')).toContainText('A1');
  82 |   });
  83 | 
  84 |   test('Add to cart button present for in-stock products', async ({ page }) => {
  85 |     await page.goto('/store/all');
  86 |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  87 |     await expect(addBtns).not.toHaveCount(0);
  88 |   });
  89 | 
  90 | });
```