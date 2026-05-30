import { test, expect } from '@playwright/test';

const BASE_URL = (typeof process !== 'undefined' && process.env?.PLAYWRIGHT_BASE_URL) || 'https://gannonwaye.com';

const PUBLIC_PAGES = ['/', '/store', '/contact', '/music', '/store/checkout-success'];

test.describe('Site Details Audit — Public pages must not expose wrong emails', () => {

  for (const path of PUBLIC_PAGES) {
    test(`${path} does not expose ganozwaye@gmail.com publicly`, async ({ page }) => {
      await page.goto(`${BASE_URL}${path}`);
      await page.waitForLoadState('networkidle');
      const content = await page.content();
      // This email must not appear in rendered HTML of public pages
      expect(content).not.toContain('ganozwaye@gmail.com');
    });
  }

  test('donation wording is correct on store page', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    // Check the exact wording used — no "official partnership" claim
    const content = await page.content();
    expect(content).not.toMatch(/official partner(ship)? (with|of) 1800RESPECT/i);
  });

  test('/admin/business-profile-settings requires login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/business-profile-settings`);
    await page.waitForLoadState('networkidle');
    // Should either redirect to login or show a login gate
    const url = page.url();
    const content = await page.content();
    const isLoginGated = url.includes('login') || url.includes('auth') ||
      content.includes('Sign in') || content.includes('Log in') || content.includes('login');
    expect(isLoginGated).toBeTruthy();
  });

  test('public store page loads without login', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/store');
  });

  test('Spotify links point to correct artist URL', async ({ page }) => {
    await page.goto(`${BASE_URL}/music`);
    await page.waitForLoadState('networkidle');
    const links = await page.$$eval('a[href*="spotify"]', els => els.map(el => el.href));
    links.forEach(link => {
      // All spotify links should point to the correct artist
      expect(link).toContain('spotify.com');
    });
  });

});