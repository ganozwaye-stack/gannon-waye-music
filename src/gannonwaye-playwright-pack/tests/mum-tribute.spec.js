// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE = 'http://localhost:5173';

test.describe('Mum Tribute Page', () => {

  test('/mum loads and shows hero', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('For Mum');
    await expect(page.locator('text=Sonia Katisa Waye').first()).toBeVisible();
    await expect(page.locator('text=1961').first()).toBeVisible();
  });

  test('/without-you-here alias loads', async ({ page }) => {
    await page.goto(`${BASE}/without-you-here`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('For Mum');
  });

  test('1961-2022 dates are present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=1961').first()).toBeVisible();
    await expect(page.locator('text=2022').first()).toBeVisible();
  });

  test('heart of gold emblem is present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    // Heart emblem has aria-label
    const heart = page.locator('.memorial-heart').first();
    await expect(heart).toBeVisible();
  });

  test('hero image (approved Sonia artwork) is present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    const heroImg = page.locator('[data-testid="mum-hero"] img').first();
    await expect(heroImg).toBeVisible();
  });

  test('memory gallery section is present with real photos', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await page.locator('#memories').scrollIntoViewIfNeeded();
    const images = page.locator('#memories img');
    const count = await images.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('memory gallery lightbox opens on click', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await page.locator('#memories').scrollIntoViewIfNeeded();
    await page.locator('#memories img').first().click();
    await expect(page.locator('img.max-h-\\[70vh\\]').first()).toBeVisible({ timeout: 3000 });
  });

  test("Sonia's Garden of Wisdom section is present", async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Sonia\'s Garden of Wisdom').first()).toBeVisible();
  });

  test('wisdom cards are clickable and show response', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
    await page.locator('button:has-text("I need comfort")').click();
    await expect(page.locator('text=Take a breath').first()).toBeVisible({ timeout: 3000 });
  });

  test('safety note is visible in wisdom section', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Lifeline').first()).toBeVisible();
    await expect(page.locator('text=13 11 14').first()).toBeVisible();
  });

  test('privacy / disclaimer note is visible', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await page.locator('#sonias-garden').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Not medical').first()).toBeVisible();
  });

  test('Enter Her Garden button is present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Enter Her Garden').first()).toBeVisible();
  });

  test('Hear Her Wisdom button is present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Hear Her Wisdom').first()).toBeVisible();
  });

  test('Who She Was section present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await page.locator('#who-she-was').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Who She Was').first()).toBeVisible();
  });

  test('Without You Here song section present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await page.locator('#without-you-here').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Without You Here').first()).toBeVisible();
  });

  test('A Letter To Mum section is present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=A Letter To Mum').first()).toBeVisible();
  });

  test('no console errors on load', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    const realErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('404') &&
      !e.includes('net::ERR') &&
      !e.includes('ERR_NETWORK')
    );
    expect(realErrors).toHaveLength(0);
  });

  test('mobile layout renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('For Mum');
  });

  test('reduced motion: page still loads', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('For Mum');
  });

  test('garden atmosphere section renders', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#sonias-garden-bg').first()).toBeVisible();
  });

  test('Forever Loved closing section present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Forever Loved').first()).toBeVisible();
  });

  test('Back Home and Explore My Music buttons present', async ({ page }) => {
    await page.goto(`${BASE}/mum`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Back Home').first()).toBeVisible();
    await expect(page.locator('text=Explore My Music').first()).toBeVisible();
  });

});