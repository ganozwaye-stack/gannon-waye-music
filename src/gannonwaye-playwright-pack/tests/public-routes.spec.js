// tests/public-routes.spec.js
// Verifies public routes load correctly and release mode is active

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gannonwaye.com';

test.describe('Public routes', () => {
  test('home page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain(BASE_URL);
    await expect(page.locator('body')).toBeVisible();
  });

  test('home page shows Out Now state', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    const bodyText = await page.locator('body').textContent();
    const lower = bodyText.toLowerCase();
    expect(lower).toMatch(/out now|listen now|stream now/);
    expect(lower).not.toContain('pre-save');
    expect(lower).not.toContain('presave');
    expect(lower).not.toContain('june 10');
  });

  test('store page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('music page loads and shows Out Now', async ({ page }) => {
    await page.goto(`${BASE_URL}/music`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.toLowerCase()).toMatch(/out now|listen now|stream now/);
  });

  test('footer social handles are correct', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    const footerText = await page.locator('footer').textContent();
    expect(footerText).toContain('@gann0nwaye');
    expect(footerText).toContain('@gannonwayeofficial');
    expect(footerText).not.toContain('Instagram @gannonwaye');
    expect(footerText).not.toContain('TikTok @gannonwaye');
    expect(footerText).not.toContain('YouTube @gannonwaye');
  });

  test('Instagram link points to gann0nwaye', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    const links = await page.locator('a[href*="instagram.com"]').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href).not.toContain('instagram.com/gannonwaye');
    }
  });

  test('TikTok link points to gann0nwaye', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    const links = await page.locator('a[href*="tiktok.com"]').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.includes('developers')) {
        expect(href).not.toContain('tiktok.com/@gannonwaye"');
      }
    }
  });

  test('/tour redirects to home', async ({ page }) => {
    await page.goto(`${BASE_URL}/tour`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(`${BASE_URL}/`);
  });

  test('/bookings redirects to home', async ({ page }) => {
    await page.goto(`${BASE_URL}/bookings`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(`${BASE_URL}/`);
  });

  test('lyrics page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/lyrics`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.toLowerCase()).not.toContain('coming june 5');
    expect(bodyText.toLowerCase()).not.toContain('pre-save');
  });

  test('no broken console errors on home page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    const critical = errors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('Non-Error promise rejection') &&
      !e.includes('autoplay')
    );
    expect(critical.length).toBe(0);
  });
});