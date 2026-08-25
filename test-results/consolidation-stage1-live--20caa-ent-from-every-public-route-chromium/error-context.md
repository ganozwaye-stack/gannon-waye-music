# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: consolidation-stage1-live.spec.js >> Stage 1 live consolidation smoke >> coaching remains absent from every public route
- Location: src/gannonwaye-playwright-pack/tests/consolidation-stage1-live.spec.js:119:3

# Error details

```
Error: Runtime errors for /coaching

Runtime errors for /coaching

expect(received).toEqual(expected) // deep equality

- Expected  -  1
+ Received  + 15

- Array []
+ Array [
+   "console.error: Failed to load resource: net::ERR_NAME_NOT_RESOLVED",
+   "response: 404 POST /api/apps/69eb7905ca6eb4180010f794/analytics/track/batch",
+   "console.error: Failed to load resource: the server responded with a status of 404 (Not Found)",
+   "response: 404 POST /api/app-logs/69eb7905ca6eb4180010f794/log-user-in-app/coaching",
+   "console.error: Failed to load resource: the server responded with a status of 404 (Not Found)",
+   "requestfailed: POST /api/app-logs/69eb7905ca6eb4180010f794/log-user-in-app/coaching net::ERR_ABORTED",
+   "console.error: Failed to load resource: net::ERR_NAME_NOT_RESOLVED",
+   "console.error: Failed to load resource: net::ERR_NAME_NOT_RESOLVED",
+   "console.error: Failed to load resource: net::ERR_NAME_NOT_RESOLVED",
+   "console.error: Failed to load resource: the server responded with a status of 404 (Not Found)",
+   "console.error: Failed to load resource: the server responded with a status of 404 (Not Found)",
+   "console.error: Failed to load resource: net::ERR_NAME_NOT_RESOLVED",
+   "console.error: Failed to load resource: net::ERR_NAME_NOT_RESOLVED",
+ ]

Call Log:
- Timeout 1000ms exceeded while waiting on the predicate
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
        - generic [ref=e15]: "\"coaching\""
        - text: could not be found.
    - button "Go Home" [ref=e17] [cursor=pointer]
```

# Test source

```ts
  1   | /* eslint-disable no-undef */
  2   | const { test, expect } = require('@playwright/test');
  3   | 
  4   | const LIVE = process.env.LIVE === '1';
  5   | const BASE_URL = process.env.BASE_URL || 'https://gannonwaye.com';
  6   | const ALLOWED_CONSOLE_HOSTS = new Set([
  7   |   'tracker.metricool.com',
  8   |   'posthog.com',
  9   |   'www.posthog.com',
  10  |   'youtube.com',
  11  |   'www.youtube.com',
  12  |   'youtube-nocookie.com',
  13  |   'www.youtube-nocookie.com',
  14  |   'doubleclick.net',
  15  |   'www.doubleclick.net',
  16  |   'spotify.com',
  17  |   'www.spotify.com',
  18  |   'google-analytics.com',
  19  |   'www.google-analytics.com',
  20  |   'googletagmanager.com',
  21  |   'www.googletagmanager.com',
  22  | ]);
  23  | 
  24  | test.skip(!LIVE, 'Production consolidation smoke only runs with LIVE=1.');
  25  | 
  26  | function consoleHost(message) {
  27  |   try {
  28  |     const url = message.location()?.url;
  29  |     return url ? new URL(url).hostname : '';
  30  |   } catch {
  31  |     return '';
  32  |   }
  33  | }
  34  | 
  35  | function attachRuntimeAudit(page) {
  36  |   const errors = [];
  37  |   const firstPartyHosts = new Set([
  38  |     new URL(BASE_URL).hostname,
  39  |     'gannonwaye.com',
  40  |     'www.gannonwaye.com',
  41  |   ]);
  42  | 
  43  |   page.on('pageerror', error => {
  44  |     errors.push(`pageerror: ${error.message}`);
  45  |   });
  46  | 
  47  |   page.on('console', message => {
  48  |     if (message.type() !== 'error') return;
  49  |     const host = consoleHost(message);
  50  |     if (host && ALLOWED_CONSOLE_HOSTS.has(host)) return;
  51  |     errors.push(`console.error: ${message.text()}`);
  52  |   });
  53  | 
  54  |   page.on('requestfailed', request => {
  55  |     try {
  56  |       const url = new URL(request.url());
  57  |       if (!firstPartyHosts.has(url.hostname)) return;
  58  |       errors.push(
  59  |         `requestfailed: ${request.method()} ${url.pathname} ${request.failure()?.errorText || ''}`,
  60  |       );
  61  |     } catch {
  62  |       errors.push(`requestfailed: ${request.url()}`);
  63  |     }
  64  |   });
  65  | 
  66  |   page.on('response', response => {
  67  |     try {
  68  |       const url = new URL(response.url());
  69  |       if (!firstPartyHosts.has(url.hostname) || response.status() < 400) return;
  70  |       errors.push(
  71  |         `response: ${response.status()} ${response.request().method()} ${url.pathname}`,
  72  |       );
  73  |     } catch {
  74  |       errors.push(`response: ${response.status()} ${response.url()}`);
  75  |     }
  76  |   });
  77  | 
  78  |   return errors;
  79  | }
  80  | 
  81  | async function openAudited(page, route) {
  82  |   const errors = attachRuntimeAudit(page);
  83  |   const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  84  |   expect(response, `Missing navigation response for ${route}`).not.toBeNull();
  85  |   expect(response.status(), `Navigation status for ${route}`).toBe(200);
  86  |   await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  87  |   await page.waitForTimeout(500);
  88  | 
  89  |   const body = (await page.locator('body').innerText()).trim();
  90  |   expect(body.length, `Rendered body for ${route}`).toBeGreaterThan(40);
  91  |   expect(body).not.toContain('Application Error');
  92  | 
  93  |   await expect
  94  |     .poll(() => errors, {
  95  |       message: `Runtime errors for ${route}`,
  96  |       timeout: 1000,
  97  |     })
> 98  |     .toEqual([]);
      |      ^ Error: Runtime errors for /coaching
  99  | 
  100 |   return body;
  101 | }
  102 | 
  103 | test.describe('Stage 1 live consolidation smoke', () => {
  104 |   test('public release routes render without runtime errors', async ({ page }) => {
  105 |     const cases = [
  106 |       { route: '/', finalPath: '/', bodyPattern: /Gannon Waye|Australian artist/i },
  107 |       { route: '/music', finalPath: '/music', bodyPattern: /Music/i },
  108 |       { route: '/releases', finalPath: '/music', bodyPattern: /Music/i },
  109 |     ];
  110 | 
  111 |     for (const item of cases) {
  112 |       const body = await openAudited(page, item.route);
  113 |       expect(new URL(page.url()).pathname).toBe(item.finalPath);
  114 |       expect(body).toMatch(item.bodyPattern);
  115 |       expect(body).not.toContain('Page Not Found');
  116 |     }
  117 |   });
  118 | 
  119 |   test('coaching remains absent from every public route', async ({ page }) => {
  120 |     const lockedRoutes = [
  121 |       '/coaching',
  122 |       '/coaching/self-worth-reset',
  123 |       '/coaching/boundaries',
  124 |       '/coaching/creative-confidence',
  125 |       '/coaching/workbooks',
  126 |       '/coaching/intake',
  127 |       '/coaching/client-resources',
  128 |       '/coaching-programs',
  129 |       '/mindset-coaching',
  130 |       '/life-coaching',
  131 |       '/book-coaching',
  132 |     ];
  133 | 
  134 |     for (const route of lockedRoutes) {
  135 |       const body = await openAudited(page, route);
  136 |       expect(new URL(page.url()).pathname).toBe(route);
  137 |       expect(body).toContain('Page Not Found');
  138 |       expect(body).not.toMatch(/Start Your Coaching Journey|Coaching Intake Form/i);
  139 |       expect(await page.locator('form').count()).toBe(0);
  140 |     }
  141 |   });
  142 | 
  143 |   test('desktop and mobile navigation expose no coaching link', async ({ page }) => {
  144 |     await page.addInitScript(() => {
  145 |       localStorage.removeItem('gw-first-visit-seen');
  146 |     });
  147 |     await openAudited(page, '/');
  148 |     await page.waitForTimeout(1500);
  149 |     await expect(page.locator('a[href^="/coaching"]')).toHaveCount(0);
  150 | 
  151 |     await page.setViewportSize({ width: 390, height: 844 });
  152 |     await page.reload({ waitUntil: 'domcontentloaded' });
  153 |     const menuButton = page.locator('nav button.md\\:hidden').last();
  154 |     await expect(menuButton).toBeVisible();
  155 |     await menuButton.click();
  156 |     await expect(page.locator('a[href^="/coaching"]')).toHaveCount(0);
  157 |   });
  158 | });
```