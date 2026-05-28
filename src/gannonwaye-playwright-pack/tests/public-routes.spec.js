// tests/public-routes.spec.js
// Verifies public routes load correctly and bookings/tours are hidden

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gannonwaye.com';

test.describe('Public routes', () => {
  test('home page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain(BASE_URL);
    // No crash, page renders
    await expect(page.locator('body')).toBeVisible();
  });

  test('store page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  });

  test('music page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/music`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
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

  test('navbar does not contain Tour or Bookings links', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    const navText = await page.locator('nav').first().textContent();
    expect(navText.toLowerCase()).not.toContain('tour');
    expect(navText.toLowerCase()).not.toContain('booking');
    expect(navText.toLowerCase()).not.toContain('live dates');
  });

  test('no broken console errors on home page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');

    // Filter out known non-critical noise
    const critical = errors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('Non-Error promise rejection') &&
      !e.includes('autoplay')
    );
    expect(critical.length).toBe(0);
  });
});