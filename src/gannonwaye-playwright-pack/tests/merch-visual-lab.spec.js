import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gannonwaye.base44.app';

test.describe('Merch Visual Lab — Admin', () => {

  test('page loads at /admin/merch-visual-lab', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Merch Visual Lab')).toBeVisible();
    const critical = errors.filter(e => !e.includes('favicon') && !e.includes('analytics'));
    expect(critical).toHaveLength(0);
  });

  test('all 8 tabs are present', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('networkidle');
    for (const tab of ['Product Assets', 'BG Removal Guide', 'PNG Uploads', 'Composition Builder', 'Reel Builder', 'Store Visuals', 'Approval Queue', 'Export Centre']) {
      await expect(page.locator(`text=${tab}`).first()).toBeVisible();
    }
  });

  test('upload product image button exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Upload Product Image')).toBeVisible();
  });

  test('BG Removal Guide tab shows tool list', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('networkidle');
    await page.click('text=BG Removal Guide');
    await expect(page.locator('text=Remove.bg')).toBeVisible();
    await expect(page.locator('text=Adobe Photoshop')).toBeVisible();
    await expect(page.locator('text=Transparent PNG')).toBeVisible();
  });

  test('Composition Builder tab loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('networkidle');
    await page.click('text=Composition Builder');
    await expect(page.locator('text=Composition Builder')).toBeVisible();
  });

  test('Reel Builder tab shows storyboard', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('networkidle');
    await page.click('text=Reel Builder');
    await expect(page.locator('text=Reel Storyboard Builder')).toBeVisible();
    await expect(page.locator('text=Respect is earned.')).toBeVisible();
  });

  test('Approval Queue shows auto-post blocked warning', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('networkidle');
    await page.click('text=Approval Queue');
    await expect(page.locator('text=BLOCKED')).toBeVisible();
  });

  test('Export Centre shows Metricool blocked', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('networkidle');
    await page.click('text=Export Centre');
    await expect(page.locator('text=BLOCKED')).toBeVisible();
  });

  test('mobile responsive — loads on 390px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/admin/merch-visual-lab`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Merch Visual Lab')).toBeVisible();
  });

});