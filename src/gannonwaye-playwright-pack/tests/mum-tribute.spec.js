import { test, expect } from '@playwright/test';

const BASE = typeof process !== 'undefined' && process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:5173';

test.describe('Mum Tribute Page', () => {

  test('/mum loads and shows hero', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('For Mum');
    await expect(page.locator('text=Sonia Katisa Waye')).toBeVisible();
    await expect(page.locator('text=1961')).toBeVisible();
  });

  test('/without-you-here alias loads', async ({ page }) => {
    await page.goto(`${BASE}/without-you-here`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('For Mum');
  });

  test('moving heart is present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    // Heart char or aria-label should be present
    const heart = page.locator('.memorial-heart').first();
    await expect(heart).toBeVisible();
  });

  test('memory gallery section is present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await page.locator('#memories').scrollIntoViewIfNeeded();
    // At least 4 gallery images should load
    const images = page.locator('#memories img');
    await expect(images).toHaveCount({ minimum: 4 });
  });

  test('wisdom cards are clickable and show response', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await page.locator('#wisdom').scrollIntoViewIfNeeded();
    // Click "I need comfort"
    await page.locator('button:has-text("I need comfort")').click();
    await expect(page.locator('text=Take a breath')).toBeVisible();
  });

  test('no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    expect(errors.filter(e => !e.includes('favicon') && !e.includes('404'))).toHaveLength(0);
  });

  test('mobile layout renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('For Mum');
  });

  test('reduced motion: page still loads with prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('For Mum');
  });

  test('support bar is hidden on /mum', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    // StickySupportBar should not be rendered
    const bar = page.locator('[data-testid="sticky-support-bar"]');
    await expect(bar).toHaveCount(0);
  });

});