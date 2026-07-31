// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

const PUBLIC_ROUTES = ['/', '/store', '/music', '/community', '/contact', '/mum'];
const SECRET_PATTERNS = [
  /sk_live_[A-Za-z0-9]{20,}/,
  /sk_test_[A-Za-z0-9]{20,}/,
  /rk_live_[A-Za-z0-9]{20,}/,
  /rk_test_[A-Za-z0-9]{20,}/,
  /whsec_[A-Za-z0-9]{20,}/,
  /gh[pousr]_[A-Za-z0-9_]{20,}/,
  /AIza[0-9A-Za-z_-]{20,}/,
];

test.describe('Public pages do not expose credentials', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} has no known secret patterns in rendered HTML`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
      const html = await page.content();
      for (const pattern of SECRET_PATTERNS) {
        expect(html).not.toMatch(pattern);
      }
    });
  }
});
