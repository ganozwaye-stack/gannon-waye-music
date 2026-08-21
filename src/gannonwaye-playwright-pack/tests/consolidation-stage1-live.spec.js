const { test, expect } = require('@playwright/test');

const LIVE = process.env.LIVE === '1';
const BASE_URL = process.env.BASE_URL || 'https://gannonwaye.com';
const ALLOWED_CONSOLE_HOSTS = new Set([
  'tracker.metricool.com',
  'posthog.com',
  'www.posthog.com',
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'doubleclick.net',
  'www.doubleclick.net',
  'spotify.com',
  'www.spotify.com',
  'google-analytics.com',
  'www.google-analytics.com',
  'googletagmanager.com',
  'www.googletagmanager.com',
]);

test.skip(!LIVE, 'Production consolidation smoke only runs with LIVE=1.');

function consoleHost(message) {
  try {
    const url = message.location()?.url;
    return url ? new URL(url).hostname : '';
  } catch {
    return '';
  }
}

function attachRuntimeAudit(page) {
  const errors = [];
  const firstPartyHosts = new Set([
    new URL(BASE_URL).hostname,
    'gannonwaye.com',
    'www.gannonwaye.com',
  ]);

  page.on('pageerror', error => {
    errors.push(`pageerror: ${error.message}`);
  });

  page.on('console', message => {
    if (message.type() !== 'error') return;
    const host = consoleHost(message);
    if (host && ALLOWED_CONSOLE_HOSTS.has(host)) return;
    errors.push(`console.error: ${message.text()}`);
  });

  page.on('requestfailed', request => {
    try {
      const url = new URL(request.url());
      if (!firstPartyHosts.has(url.hostname)) return;
      errors.push(
        `requestfailed: ${request.method()} ${url.pathname} ${request.failure()?.errorText || ''}`,
      );
    } catch {
      errors.push(`requestfailed: ${request.url()}`);
    }
  });

  page.on('response', response => {
    try {
      const url = new URL(response.url());
      if (!firstPartyHosts.has(url.hostname) || response.status() < 400) return;
      errors.push(
        `response: ${response.status()} ${response.request().method()} ${url.pathname}`,
      );
    } catch {
      errors.push(`response: ${response.status()} ${response.url()}`);
    }
  });

  return errors;
}

async function openAudited(page, route) {
  const errors = attachRuntimeAudit(page);
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  expect(response, `Missing navigation response for ${route}`).not.toBeNull();
  expect(response.status(), `Navigation status for ${route}`).toBe(200);
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(500);

  const body = (await page.locator('body').innerText()).trim();
  expect(body.length, `Rendered body for ${route}`).toBeGreaterThan(40);
  expect(body).not.toContain('Application Error');

  await expect
    .poll(() => errors, {
      message: `Runtime errors for ${route}`,
      timeout: 1000,
    })
    .toEqual([]);

  return body;
}

test.describe('Stage 1 live consolidation smoke', () => {
  test('public release routes render without runtime errors', async ({ page }) => {
    const cases = [
      { route: '/', finalPath: '/', bodyPattern: /Gannon Waye|Australian artist/i },
      { route: '/music', finalPath: '/music', bodyPattern: /Music/i },
      { route: '/releases', finalPath: '/music', bodyPattern: /Music/i },
    ];

    for (const item of cases) {
      const body = await openAudited(page, item.route);
      expect(new URL(page.url()).pathname).toBe(item.finalPath);
      expect(body).toMatch(item.bodyPattern);
      expect(body).not.toContain('Page Not Found');
    }
  });

  test('coaching remains absent from every public route', async ({ page }) => {
    const lockedRoutes = [
      '/coaching',
      '/coaching/self-worth-reset',
      '/coaching/boundaries',
      '/coaching/creative-confidence',
      '/coaching/workbooks',
      '/coaching/intake',
      '/coaching/client-resources',
      '/coaching-programs',
      '/mindset-coaching',
      '/life-coaching',
      '/book-coaching',
    ];

    for (const route of lockedRoutes) {
      const body = await openAudited(page, route);
      expect(new URL(page.url()).pathname).toBe(route);
      expect(body).toContain('Page Not Found');
      expect(body).not.toMatch(/Start Your Coaching Journey|Coaching Intake Form/i);
      expect(await page.locator('form').count()).toBe(0);
    }
  });

  test('desktop and mobile navigation expose no coaching link', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('gw-first-visit-seen');
    });
    await openAudited(page, '/');
    await page.waitForTimeout(1500);
    await expect(page.locator('a[href^="/coaching"]')).toHaveCount(0);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    const menuButton = page.locator('nav button.md\\:hidden').last();
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(page.locator('a[href^="/coaching"]')).toHaveCount(0);
  });
});
