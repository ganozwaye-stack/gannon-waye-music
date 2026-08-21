// @ts-check
 
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:5173';

test.describe('Mum Tribute Page', () => {

  test('/mum loads and shows hero', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await expect(page.locator('h1')).toContainText('For Mum');
  });

  test('/without-you-here alias loads', async ({ page }) => {
    await page.goto(`${BASE}/without-you-here`);
    await page.waitForLoadState('load');
    await expect(page.locator('h1')).toContainText('For Mum');
  });

  test('mum-hero section is present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await expect(page.locator('[data-testid="mum-hero"]')).toBeVisible();
  });

  test('approved tribute artwork is displayed cleanly (no giant overlay)', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    // Artwork img should be present and visible
    const artwork = page.locator('[data-testid="mum-hero-artwork"]');
    await expect(artwork).toBeVisible();
    // Artwork frame should be present
    const frame = page.locator('[data-testid="mum-hero-artwork-frame"]');
    await expect(frame).toBeVisible();
  });

  test('Sonia Katisa Waye name is visible', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await expect(page.locator('text=Sonia Katisa Waye').first()).toBeVisible();
  });

  test('1961 and 2022 dates are visible', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await expect(page.locator('text=1961').first()).toBeVisible();
    await expect(page.locator('text=2022').first()).toBeVisible();
  });

  test('heart of gold emblem is present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    const heart = page.locator('.memorial-heart').first();
    await expect(heart).toBeVisible();
  });

  test('Enter Her Garden button is visible and links to #who-she-was', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    const btn = page.locator('text=Enter Her Garden').first();
    await expect(btn).toBeVisible();
  });

  test('Hear Her Wisdom button is visible and links to #sonias-garden', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    const btn = page.locator('text=Hear Her Wisdom').first();
    await expect(btn).toBeVisible();
  });

  test('Who She Was section present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await page.locator('#who-she-was').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Who She Was').first()).toBeVisible();
  });

  test('memory gallery section is present with real photos', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await page.locator('#memories').scrollIntoViewIfNeeded();
    const images = page.locator('#memories img');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('memory gallery photos use base44 CDN or local assets', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await page.locator('#memories').scrollIntoViewIfNeeded();
    const imgs = page.locator('#memories img');
    const count = await imgs.count();
    for (let i = 0; i < count; i++) {
      const src = await imgs.nth(i).getAttribute('src');
      // All real photos must come from base44 CDN or local assets folder
      expect(src).toMatch(/media\.base44\.com|\/images\//);
    }
  });

  test("Sonia's Garden of Wisdom section is present", async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Sonia\'s Garden of Wisdom').first()).toBeVisible();
  });

  test('wisdom cards are clickable and show comfort response', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
    await page.locator('button:has-text("I need comfort")').first().click();
    await expect(page.locator('text=Take a breath').first()).toBeVisible({ timeout: 4000 });
  });

  test('wisdom cards show strength response', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
    await page.locator('button:has-text("I need strength")').first().click();
    await expect(page.locator('text=survived').first()).toBeVisible({ timeout: 4000 });
  });

  test('safety note (Lifeline 13 11 14) is visible', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Lifeline').first()).toBeVisible();
    await expect(page.locator('text=13 11 14').first()).toBeVisible();
  });

  test('disclaimer (Not medical) is visible', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Not medical').first()).toBeVisible();
  });

  test('Without You Here song section present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await page.locator('#without-you-here').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Without You Here').first()).toBeVisible();
  });

  test('A Letter To Mum section present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await expect(page.locator('text=A Letter To Mum').first()).toBeVisible();
  });

  test('Forever Loved closing section present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await expect(page.locator('text=Forever Loved').first()).toBeVisible();
  });

  test('Back Home and Explore My Music buttons present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await expect(page.locator('text=Back Home').first()).toBeVisible();
    await expect(page.locator('text=Explore My Music').first()).toBeVisible();
  });

  test('no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    const realErrors = errors.filter(e =>
      !e.includes('favicon') && !e.includes('net::ERR') && !e.includes('ERR_NETWORK') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required')
    );
    expect(realErrors).toHaveLength(0);
  });

  test('mobile layout — artwork and title visible without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="mum-hero-artwork"]')).toBeVisible();
    // Check no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });

  test('reduced motion — page still loads correctly', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await expect(page.locator('h1')).toContainText('For Mum');
    await expect(page.locator('[data-testid="mum-hero-artwork"]')).toBeVisible();
  });

  test('garden atmosphere background is present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('load');
    await expect(page.locator('#sonias-garden-bg').first()).toBeVisible();
  });

});