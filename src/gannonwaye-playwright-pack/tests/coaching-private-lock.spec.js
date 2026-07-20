// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

const LOCKED_PUBLIC_ROUTES = [
  '/coaching',
  '/coaching-programs',
  '/mindset-coaching',
  '/life-coaching',
  '/book-coaching',
  '/coaching/intake',
  '/coaching/workbooks',
];

test.describe('Public coaching routes stay locked', () => {
  for (const route of LOCKED_PUBLIC_ROUTES) {
    test(`${route} returns the public 404 screen`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
      await expect(page.getByText('Page Not Found')).toBeVisible();
      await expect(page.locator('body')).not.toContainText('Gannon Waye Coaching');
    });
  }
});
