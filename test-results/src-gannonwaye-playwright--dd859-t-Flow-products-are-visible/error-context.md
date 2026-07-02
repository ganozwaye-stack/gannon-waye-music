# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: src\gannonwaye-playwright-pack\tests\cart.spec.js >> Cart Flow >> products are visible
- Location: src\gannonwaye-playwright-pack\tests\cart.spec.js:13:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/store
Call log:
  - navigating to "http://localhost:5173/store", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "This site can’t be reached" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - strong [ref=e9]: localhost
      - text: refused to connect.
    - generic [ref=e10]:
      - paragraph [ref=e11]: "Try:"
      - list [ref=e12]:
        - listitem [ref=e13]: Checking the connection
        - listitem [ref=e14]:
          - link "Checking the proxy and the firewall" [ref=e15] [cursor=pointer]:
            - /url: "#buttons"
    - generic [ref=e16]: ERR_CONNECTION_REFUSED
  - generic [ref=e17]:
    - button "Reload" [ref=e19] [cursor=pointer]
    - button "Details" [ref=e20] [cursor=pointer]
```

# Test source

```ts
  1   | // @ts-check
  2   |  
  3   | const { test, expect } = require('@playwright/test');
  4   | 
  5   | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  6   | 
  7   | test.describe('Cart Flow', () => {
  8   |   test('/store loads', async ({ page }) => {
  9   |     await page.goto(`${BASE_URL}/store`);
  10  |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  11  |   });
  12  | 
  13  |   test('products are visible', async ({ page }) => {
> 14  |     await page.goto(`${BASE_URL}/store`);
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5173/store
  15  |     await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  16  |   });
  17  | 
  18  |   test('product images are visible', async ({ page }) => {
  19  |     await page.goto(`${BASE_URL}/store`);
  20  |     await expect(page.locator('[data-testid="product-image"]').first()).toBeVisible();
  21  |   });
  22  | 
  23  |   test('cart button is visible with data-testid', async ({ page }) => {
  24  |     await page.goto(`${BASE_URL}/store`);
  25  |     await expect(page.locator('[data-testid="cart-button"]')).toBeVisible();
  26  |   });
  27  | 
  28  |   test('add to cart shows confirmation', async ({ page }) => {
  29  |     await page.goto(`${BASE_URL}/store`);
  30  |     await page.waitForSelector('[data-testid="add-to-cart-btn"]');
  31  | 
  32  |     // Select size if required
  33  |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  34  |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  35  | 
  36  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  37  |     const count = await addBtns.count();
  38  |     for (let i = 0; i < count; i++) {
  39  |       const btn = addBtns.nth(i);
  40  |       if (await btn.isVisible()) { await btn.click(); break; }
  41  |     }
  42  | 
  43  |     await expect(page.locator('[data-testid="add-to-cart-success"]').first()).toBeVisible({ timeout: 3000 });
  44  |   });
  45  | 
  46  |   test('continue shopping button closes confirmation', async ({ page }) => {
  47  |     await page.goto(`${BASE_URL}/store`);
  48  |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  49  |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  50  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  51  |     const count = await addBtns.count();
  52  |     for (let i = 0; i < count; i++) {
  53  |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  54  |     }
  55  |     await page.locator('[data-testid="continue-shopping-button"]').first().click();
  56  |     await expect(page.locator('[data-testid="add-to-cart-success"]')).not.toBeVisible({ timeout: 2000 });
  57  |   });
  58  | 
  59  |   test('view cart button opens cart drawer', async ({ page }) => {
  60  |     await page.goto(`${BASE_URL}/store`);
  61  |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  62  |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  63  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  64  |     const count = await addBtns.count();
  65  |     for (let i = 0; i < count; i++) {
  66  |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  67  |     }
  68  |     await page.locator('[data-testid="view-cart-button"]').first().click();
  69  |     await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible({ timeout: 3000 });
  70  |   });
  71  | 
  72  |   test('cart checkout button routes to cart-details', async ({ page }) => {
  73  |     await page.goto(`${BASE_URL}/store`);
  74  |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  75  |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  76  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  77  |     const count = await addBtns.count();
  78  |     for (let i = 0; i < count; i++) {
  79  |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  80  |     }
  81  |     await page.locator('[data-testid="view-cart-button"]').first().click();
  82  |     await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();
  83  |     await page.locator('[data-testid="cart-checkout-button"]').click();
  84  |     await expect(page).toHaveURL(/\/store\/cart-details/);
  85  |   });
  86  | 
  87  |   test('sticky checkout bar appears when cart has items', async ({ page }) => {
  88  |     await page.goto(`${BASE_URL}/store`);
  89  |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  90  |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  91  |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  92  |     const count = await addBtns.count();
  93  |     for (let i = 0; i < count; i++) {
  94  |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  95  |     }
  96  |     await expect(page.locator('[data-testid="store-sticky-checkout"]')).toBeVisible({ timeout: 3000 });
  97  |     await expect(page.locator('[data-testid="store-sticky-checkout-button"]')).toBeVisible();
  98  |   });
  99  | 
  100 |   test('sticky checkout button routes to cart-details', async ({ page }) => {
  101 |     await page.goto(`${BASE_URL}/store`);
  102 |     const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  103 |     if (await sizeM.isVisible().catch(() => false)) await sizeM.click();
  104 |     const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  105 |     const count = await addBtns.count();
  106 |     for (let i = 0; i < count; i++) {
  107 |       if (await addBtns.nth(i).isVisible()) { await addBtns.nth(i).click(); break; }
  108 |     }
  109 |     await page.locator('[data-testid="store-sticky-checkout-button"]').click();
  110 |     await expect(page).toHaveURL(/\/store\/cart-details/);
  111 |   });
  112 | 
  113 |   test('go-to-checkout button from confirmation routes to cart-details', async ({ page }) => {
  114 |     await page.goto(`${BASE_URL}/store`);
```