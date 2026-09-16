// @ts-check
import { test, expect } from '@playwright/test';

const LOCKED_PUBLIC_ROUTES = [
  '/coaching',
  '/coaching-programs',
  '/mindset-coaching',
  '/life-coaching',
  '/book-coaching',
];

test.describe('Coaching public launch lock', () => {
  for (const route of LOCKED_PUBLIC_ROUTES) {
    test(`${route} remains unavailable to the public`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      await expect(page).toHaveURL(/\/contact\/?$/);

      const body = await page.locator('body').innerText();
      expect(body).not.toContain('Book a Session');
      expect(body).not.toContain('Clarity Reset');
      expect(body).not.toContain('Self-Worth Reset');
    });
  }
});
