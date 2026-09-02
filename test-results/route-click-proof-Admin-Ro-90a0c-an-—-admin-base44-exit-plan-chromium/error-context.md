# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: route-click-proof.spec.js >> Admin Routes Load (require admin auth) >> Base44 Exit Plan — /admin/base44-exit-plan
- Location: src/gannonwaye-playwright-pack/tests/route-click-proof.spec.js:37:9

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "Page Not Found"
Received string:        "
    Support Now404Page Not FoundThe page \"login\" could not be found.Go Home
    
    
    if (window.self !== window.top) {
  const mode = new URLSearchParams(location.search).get(\"sandbox-bridge\");
  const url = mode === \"local\"
    ? \"https://localhost:3201/index.mjs\"
    : \"/node_modules/@base44/vite-plugin/dist/statics/index.mjs\";
  import(url)
    .then(mod => {
      if (typeof mod.setupVisualEditAgent === \"function\") mod.setupVisualEditAgent();
    })
    .catch(e => console.error(\"[visual-edit-agent] Failed to load:\", e));
}
  

"
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - link "Support Now" [ref=e4] [cursor=pointer]:
    - /url: /back-this
    - button "Support Now" [ref=e5]
  - generic [ref=e8]:
    - heading "404" [level=1] [ref=e10]
    - generic [ref=e12]:
      - heading "Page Not Found" [level=2] [ref=e13]
      - paragraph [ref=e14]:
        - text: The page
        - generic [ref=e15]: "\"login\""
        - text: could not be found.
    - button "Go Home" [ref=e17] [cursor=pointer]
```

# Test source

```ts
  1  | // Route and Click Proof Tests
  2  | // Verifies all key routes load and do not redirect to dashboard fallback.
  3  | import { test, expect } from '@playwright/test';
  4  | 
  5  | const PUBLIC_ROUTES = [
  6  |   { path: '/store', label: 'Store World' },
  7  |   { path: '/store/all', label: 'Store All Products' },
  8  |   { path: '/music', label: 'Music' },
  9  |   { path: '/lyrics', label: 'Lyrics' },
  10 |   { path: '/checkout-success', label: 'Checkout Success' },
  11 |   { path: '/checkout-cancel', label: 'Checkout Cancel' },
  12 | ];
  13 | 
  14 | const ADMIN_ROUTES = [
  15 |   { path: '/admin', label: 'Admin Dashboard' },
  16 |   { path: '/admin/orders', label: 'Orders' },
  17 |   { path: '/admin/music-opportunity-bulletin', label: 'Music Opportunity Bulletin' },
  18 |   { path: '/admin/base44-exit-plan', label: 'Base44 Exit Plan' },
  19 |   { path: '/admin/legal-drafts', label: 'Legal Drafts' },
  20 |   { path: '/admin/print-fulfilment', label: 'Print Fulfilment' },
  21 |   { path: '/admin/site-health', label: 'Site Health' },
  22 | ];
  23 | 
  24 | test.describe('Public Routes Load Without 404', () => {
  25 |   for (const route of PUBLIC_ROUTES) {
  26 |     test(`${route.label} — ${route.path}`, async ({ page }) => {
  27 |       await page.goto(route.path);
  28 |       const bodyText = await page.textContent('body');
  29 |       expect(bodyText).not.toContain('Page Not Found');
  30 |       expect(bodyText).not.toContain('404');
  31 |     });
  32 |   }
  33 | });
  34 | 
  35 | test.describe('Admin Routes Load (require admin auth)', () => {
  36 |   for (const route of ADMIN_ROUTES) {
  37 |     test(`${route.label} — ${route.path}`, async ({ page }) => {
  38 |       await page.goto(route.path);
  39 |       const bodyText = await page.textContent('body');
  40 |       // Should not 404 — either loads admin content or redirects to login (not 404)
> 41 |       expect(bodyText).not.toContain('Page Not Found');
     |                            ^ Error: expect(received).not.toContain(expected) // indexOf
  42 |     });
  43 |   }
  44 | });
  45 | 
  46 | test.describe('Store Product Detail Routes', () => {
  47 |   const PRODUCT_SLUGS = [
  48 |     'winter-writing-comfort-bundle',
  49 |     'thankyou-journal-pen-thermos-bundle',
  50 |     'respect-is-earned-wall-poster',
  51 |     'thankyou-respect-is-earned-coffee-mug',
  52 |     'thankyou-respect-is-earned-hoodie-front',
  53 |   ];
  54 | 
  55 |   for (const slug of PRODUCT_SLUGS) {
  56 |     test(`/store/product/${slug} loads`, async ({ page }) => {
  57 |       await page.goto(`/store/product/${slug}`);
  58 |       await expect(page.locator('body')).not.toContainText('Page Not Found');
  59 |     });
  60 |   }
  61 | });
  62 | 
  63 | test.describe('Store card links resolve correctly', () => {
  64 |   test('Store world page loads with product cards', async ({ page }) => {
  65 |     await page.goto('/store');
  66 |     // Should show product grid or store world scene
  67 |     await expect(page.locator('body')).not.toContainText('Page Not Found');
  68 |   });
  69 | 
  70 |   test('Store All products shows product grid', async ({ page }) => {
  71 |     await page.goto('/store/all');
  72 |     await expect(page.locator('[data-testid="store-page"]')).toBeVisible({ timeout: 10000 });
  73 |     const cards = await page.locator('[data-testid="product-card"]').count();
  74 |     expect(cards).toBeGreaterThan(0);
  75 |   });
  76 | });
  77 | 
  78 | test.describe('API Keys Not Exposed In Frontend', () => {
  79 |   test('No Stripe secret key exposed in /store page', async ({ page }) => {
  80 |     await page.goto('/store/all');
  81 |     const html = await page.content();
  82 |     expect(html).not.toMatch(/sk_live_[a-zA-Z0-9]{20,}/);
  83 |     expect(html).not.toMatch(/sk_test_[a-zA-Z0-9]{20,}/);
  84 |   });
  85 | 
  86 |   test('No OpenAI key exposed in /store page', async ({ page }) => {
  87 |     await page.goto('/store/all');
  88 |     const html = await page.content();
  89 |     expect(html).not.toMatch(/sk-[a-zA-Z0-9]{20,}/);
  90 |   });
  91 | 
  92 |   test('No print provider API keys exposed in /admin/print-fulfilment', async ({ page }) => {
  93 |     await page.goto('/admin/print-fulfilment');
  94 |     const html = await page.content();
  95 |     // Should show env var names only, not actual keys
  96 |     expect(html).not.toMatch(/[a-f0-9]{32,}/); // typical API key pattern (32+ hex chars)
  97 |     expect(html).toContain('PRINTFUL_API_KEY'); // should show placeholder
  98 |   });
  99 | });
```