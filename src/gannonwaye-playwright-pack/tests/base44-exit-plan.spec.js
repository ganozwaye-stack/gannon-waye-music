// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Admin — Base44 Exit Plan and Legal Drafts', () => {
  // These routes are admin-only — tests confirm pages load and render content
  // Run these in a context where admin session is active

  test('/admin/base44-exit-plan route exists and does not 404', async ({ page }) => {
    await page.goto('/admin/base44-exit-plan');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('Page Not Found');
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('/admin/legal-drafts route exists and does not 404', async ({ page }) => {
    await page.goto('/admin/legal-drafts');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('Page Not Found');
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('/admin/master-blueprint loads without 404', async ({ page }) => {
    await page.goto('/admin/master-blueprint');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('Page Not Found');
  });

  test('no random redirect to dashboard from public pages', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL('/admin');
    await expect(page).toHaveURL(/\/store/);
  });

  test('public lyrics page does not redirect to admin', async ({ page }) => {
    await page.goto('/lyrics');
    await page.waitForLoadState('networkidle');
    await expect(page).not.toHaveURL('/admin');
  });
});