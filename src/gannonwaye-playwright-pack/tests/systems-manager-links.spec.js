// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Systems Manager — service card routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/systems-manager');
    await page.waitForLoadState('networkidle');
  });

  test('page loads with headline', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/systems/i);
  });

  test('Cinematic Websites card links to correct page', async ({ page }) => {
    const link = page.locator('a[href*="cinematic-websites"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/systems\/cinematic-websites/);
  });

  test('case study Gannon Waye card links to correct page', async ({ page }) => {
    const link = page.locator('a[href*="gannon-waye"]').first();
    if (await link.count() > 0) {
      await link.click();
      await expect(page).toHaveURL(/gannon-waye/);
    }
  });

  test('case study GanozMix card links to correct page', async ({ page }) => {
    const link = page.locator('a[href*="ganozmix"]').first();
    if (await link.count() > 0) {
      await link.click();
      await expect(page).toHaveURL(/ganozmix/);
    }
  });
});

test.describe('Systems Manager — service destination pages load', () => {
  const SERVICE_ROUTES = [
    '/systems/cinematic-websites',
    '/systems/social-automation',
    '/systems/dropshipping-inventory',
    '/systems/control-panels',
    '/systems/ecommerce-merch-stores',
    '/systems/approval-workflows',
    '/systems/ai-content-systems',
    '/systems/artist-release-systems',
  ];

  for (const route of SERVICE_ROUTES) {
    test(`${route} loads`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).not.toContainText('404');
      await expect(page.locator('body')).not.toContainText('Page Not Found');
    });
  }
});

test.describe('Systems Manager — case study pages', () => {
  test('/systems/case-studies/gannon-waye-music-os loads', async ({ page }) => {
    await page.goto('/systems/case-studies/gannon-waye-music-os');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText(/Gannon Waye/i);
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('/systems/case-studies/ganozmix-direct loads', async ({ page }) => {
    await page.goto('/systems/case-studies/ganozmix-direct');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText(/GanozMix/i);
    await expect(page.locator('body')).not.toContainText('404');
  });
});

test.describe('Admin edit buttons — hidden from public', () => {
  test('admin edit buttons are not visible to unauthenticated visitors on /store', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    // Admin edit buttons contain the "Edit" pencil link — should not exist for public
    const adminButtons = page.locator('[data-testid="admin-edit-btn"]');
    await expect(adminButtons).toHaveCount(0);
  });

  test('admin edit buttons are not visible on /systems-manager', async ({ page }) => {
    await page.goto('/systems-manager');
    await page.waitForLoadState('networkidle');
    const adminButtons = page.locator('[data-testid="admin-edit-btn"]');
    await expect(adminButtons).toHaveCount(0);
  });
});