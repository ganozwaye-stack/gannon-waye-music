/* eslint-disable no-undef */
// tests/public-routes.spec.js
// Verifies public routes load correctly and bookings/tours are hidden

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const gotoRoute = (page, route) => page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });

test.describe('Public routes', () => {
  test('home page loads', async ({ page }) => {
    await gotoRoute(page, '/');
    expect(page.url()).toContain(BASE_URL);
    // No crash, page renders
    await expect(page.locator('body')).toBeVisible();
  });

  test('store page loads', async ({ page }) => {
    await gotoRoute(page, '/store');
    await expect(page.getByRole('link', { name: /all products/i })).toBeVisible();
  });

  test('music page loads', async ({ page }) => {
    await gotoRoute(page, '/music');
    await expect(page.locator('body')).toBeVisible();
  });

  test('/tour renders safely', async ({ page }) => {
    await gotoRoute(page, '/tour');
    await expect(page.locator('body')).toBeVisible();
  });

  test('/bookings renders safely', async ({ page }) => {
    await gotoRoute(page, '/bookings');
    await expect(page.locator('body')).toBeVisible();
  });

  test('navbar does not contain Tour or Bookings links', async ({ page }) => {
    await gotoRoute(page, '/');

    const navText = await page.locator('nav').first().textContent();
    expect(navText.toLowerCase()).not.toContain('tour');
    expect(navText.toLowerCase()).not.toContain('booking');
    expect(navText.toLowerCase()).not.toContain('live dates');
  });

  test('no broken console errors on home page', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await gotoRoute(page, '/');

    // Filter out known non-critical noise
    const critical = errors.filter(e =>
      !e.includes('ResizeObserver') &&
      !e.includes('Non-Error promise rejection') &&
      !e.includes('autoplay')
    );
    if (critical.length > 0) {
      console.error("CRITICAL CONSOLE ERRORS FOUND:", critical);
    }
    expect(critical.length).toBe(0);
  });
});
