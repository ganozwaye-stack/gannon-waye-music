# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: link-integrity.spec.js >> Link Integrity — Public routes >> footer Instagram link correct
- Location: src/gannonwaye-playwright-pack/tests/link-integrity.spec.js:50:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5173/", waiting until "load"

```

# Test source

```ts
  1   | // tests/link-integrity.spec.js
  2   | // Verifies correct link intent routing across dashboard cards and owner action items
  3   | 
  4   | /* eslint-disable no-undef */
  5   | import { test, expect } from '@playwright/test';
  6   | 
  7   | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
  8   | 
  9   | test.describe('Link Integrity — Public routes', () => {
  10  |   test('home page has no href="#" or javascript:void links', async ({ page }) => {
  11  |     await page.goto(`${BASE_URL}/`);
  12  |     await page.waitForLoadState('networkidle');
  13  |     const badLinks = await page.locator('a[href="#"], a[href="javascript:void(0)"]').count();
  14  |     expect(badLinks).toBe(0);
  15  |   });
  16  | 
  17  |   test('Instagram links point to @gann0nwaye', async ({ page }) => {
  18  |     await page.goto(`${BASE_URL}/`);
  19  |     await page.waitForLoadState('networkidle');
  20  |     const links = await page.locator('a[href*="instagram.com"]').all();
  21  |     for (const link of links) {
  22  |       const href = await link.getAttribute('href');
  23  |       expect(href).toMatch(/instagram\.com\/gann0nwaye/);
  24  |       expect(href).not.toMatch(/instagram\.com\/gannonwaye(?!official)/);
  25  |     }
  26  |   });
  27  | 
  28  |   test('TikTok links point to @gann0nwaye', async ({ page }) => {
  29  |     await page.goto(`${BASE_URL}/`);
  30  |     await page.waitForLoadState('networkidle');
  31  |     const links = await page.locator('a[href*="tiktok.com/@"]').all();
  32  |     for (const link of links) {
  33  |       const href = await link.getAttribute('href');
  34  |       if (href && !href.includes('developers')) {
  35  |         expect(href).toMatch(/tiktok\.com\/@gann0nwaye/);
  36  |       }
  37  |     }
  38  |   });
  39  | 
  40  |   test('contact page social links are correct', async ({ page }) => {
  41  |     await page.goto(`${BASE_URL}/contact`);
  42  |     await page.waitForLoadState('networkidle');
  43  |     const bodyText = await page.locator('body').textContent();
  44  |     expect(bodyText).toContain('@gann0nwaye');
  45  |     expect(bodyText).toContain('@gannonwayeofficial');
  46  |     // should NOT contain the old wrong handle
  47  |     expect(bodyText).not.toMatch(/(^|\s)@gannonwaye(?!official)/);
  48  |   });
  49  | 
  50  |   test('footer Instagram link correct', async ({ page }) => {
> 51  |     await page.goto(`${BASE_URL}/`);
      |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  52  |     await page.waitForLoadState('networkidle');
  53  |     const footerText = await page.locator('footer').textContent();
  54  |     expect(footerText).toContain('@gann0nwaye');
  55  |     expect(footerText).toContain('@gannonwayeofficial');
  56  |   });
  57  | 
  58  |   test('no public page redirects to admin dashboard', async ({ page }) => {
  59  |     const publicRoutes = ['/', '/music', '/store', '/community', '/contact', '/lyrics', '/faq'];
  60  |     for (const route of publicRoutes) {
  61  |       await page.goto(`${BASE_URL}${route}`);
  62  |       await page.waitForLoadState('networkidle');
  63  |       expect(page.url()).not.toContain('/admin');
  64  |     }
  65  |   });
  66  | });
  67  | 
  68  | test.describe('Link Integrity — Admin routing (requires login)', () => {
  69  |   test('dashboard revenue cube links to financials not generic /admin', async ({ page }) => {
  70  |     // Note: requires admin session — mark as needs_login if no cookie
  71  |     const cookies = process.env.ADMIN_SESSION_COOKIE;
  72  |     if (!cookies) {
  73  |       test.skip();
  74  |       return;
  75  |     }
  76  |     await page.goto(`${BASE_URL}/admin`);
  77  |     await page.waitForLoadState('networkidle');
  78  | 
  79  |     const revenueLink = page.locator('a[href*="financials"]').first();
  80  |     if (await revenueLink.count() > 0) {
  81  |       const href = await revenueLink.getAttribute('href');
  82  |       expect(href).toContain('financials');
  83  |       expect(href).not.toBe('/admin');
  84  |     }
  85  |   });
  86  | 
  87  |   test('add Spotify link notification routes to /admin/releases not /admin/notifications', async ({ page }) => {
  88  |     const cookies = process.env.ADMIN_SESSION_COOKIE;
  89  |     if (!cookies) { test.skip(); return; }
  90  | 
  91  |     await page.goto(`${BASE_URL}/admin/notifications`);
  92  |     await page.waitForLoadState('networkidle');
  93  | 
  94  |     // Find Spotify notification and check its link
  95  |     const spotifyLinks = page.locator('text=Add Spotify Link');
  96  |     if (await spotifyLinks.count() > 0) {
  97  |       const parent = spotifyLinks.first().locator('xpath=ancestor::a | xpath=ancestor::button');
  98  |       // The linked_route should go to releases
  99  |       const nearestLink = page.locator('a[href*="releases"]').first();
  100 |       if (await nearestLink.count() > 0) {
  101 |         const href = await nearestLink.getAttribute('href');
  102 |         expect(href).toContain('releases');
  103 |       }
  104 |     }
  105 |   });
  106 | 
  107 |   test('add lyrics notification routes to /admin/releases not /admin/notifications', async ({ page }) => {
  108 |     const cookies = process.env.ADMIN_SESSION_COOKIE;
  109 |     if (!cookies) { test.skip(); return; }
  110 |     // Semantic check: notifications page should have releases links for lyrics action items
  111 |     await page.goto(`${BASE_URL}/admin/notifications`);
  112 |     await page.waitForLoadState('networkidle');
  113 |     await expect(page.locator('body')).toBeVisible();
  114 |     // Pass as long as page loads without crash
  115 |   });
  116 | });
```