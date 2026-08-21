/* eslint-disable no-undef */
import { test, expect } from '@playwright/test';
 
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Merch Visual Lab — Admin', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.evaluate(() => {
      localStorage.setItem('base44_access_token', 'mock-admin-token');
    });
  });

  test('page loads at /admin/merch-visual-lab', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('load');
    await expect(page.locator('text=Merch Visual Lab').first()).toBeVisible();
    const critical = errors.filter(e => !e.includes('favicon') && !e.includes('analytics') && !e.includes('posthog') && !e.includes('ERR_CONNECTION_REFUSED') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required') && !e.includes('net::ERR'));
    expect(critical).toHaveLength(0);
  });

  test('all 8 tabs are present', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('load');
    for (const tab of ['Product Assets', 'BG Removal Guide', 'PNG Uploads', 'Composition Builder', 'Reel Builder', 'Store Visuals', 'Approval Queue', 'Export Centre']) {
      await expect(page.locator(`text=${tab}`).first()).toBeVisible();
    }
  });

  test('upload product image button exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('load');
    await expect(page.locator('text=Upload Images').first()).toBeVisible();
  });

  test('BG Removal Guide tab shows tool list', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('load');
    await page.click('text=BG Removal Guide');
    await expect(page.locator('text=Remove.bg').first()).toBeVisible();
    await expect(page.locator('text=Adobe Photoshop').first()).toBeVisible();
    await expect(page.locator('text=Transparent PNG').first()).toBeVisible();
  });

  test('Composition Builder tab loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('load');
    await page.click('text=Composition Builder');
    await expect(page.locator('text=Composition Builder').first()).toBeVisible();
  });

  test('Reel Builder tab shows storyboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('load');
    await page.click('text=Reel Builder');
    await expect(page.locator('text=Reel Storyboard Builder').first()).toBeVisible();
    await expect(page.locator('text=Respect is earned.').first()).toBeVisible();
  });

  test('Approval Queue shows auto-post blocked warning', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('load');
    await page.click('text=Approval Queue');
    await expect(page.locator('text=BLOCKED').first()).toBeVisible();
  });

  test('Export Centre shows Metricool blocked', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('load');
    await page.click('text=Export Centre');
    await expect(page.locator('text=BLOCKED').first()).toBeVisible();
  });

  test('mobile responsive — loads on 390px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('load');
    await expect(page.locator('text=Merch Visual Lab').first()).toBeVisible();
  });

});