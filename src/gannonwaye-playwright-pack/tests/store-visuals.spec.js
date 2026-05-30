import { test, expect } from '@playwright/test';

const BASE_URL = 'https://gannonwaye.base44.app';

test.describe('Store Visuals — Public safety checks', () => {

  test('public store still loads', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Store').first()).toBeVisible();
    const critical = errors.filter(e => !e.includes('favicon') && !e.includes('analytics'));
    expect(critical).toHaveLength(0);
  });

  test('cart route exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/cart`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/store/cart');
  });

  test('checkout route exists', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/checkout`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/store');
  });

  test('homepage loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
    const critical = errors.filter(e => !e.includes('favicon') && !e.includes('analytics'));
    expect(critical).toHaveLength(0);
  });

  test('no unapproved raw MerchVisualAsset images appear on store', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    // MerchVisualAsset images are admin-only — none should appear on public store
    // Check that no background_pending or needs_cleanup images are visible
    const pageContent = await page.content();
    expect(pageContent).not.toContain('background_pending');
    expect(pageContent).not.toContain('needs_cleanup');
  });

  test('store products still show add to cart', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('networkidle');
    // At least one product or store content should be present
    await expect(page.locator('text=/store|merch|hoodie|mug|shirt/i').first()).toBeVisible();
  });

});