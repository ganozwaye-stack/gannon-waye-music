// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Lyrics page — public visibility', () => {
  test('lyrics page loads', async ({ page }) => {
    await page.goto('/lyrics');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).not.toContainText('404');
    await expect(page.locator('body')).not.toContainText('Page Not Found');
  });

  test('lyrics page includes Thankyou / Thank You song', async ({ page }) => {
    await page.goto('/lyrics');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/thank\s*you/i);
  });

  test('no admin buttons visible to unauthenticated user on lyrics page', async ({ page }) => {
    await page.goto('/lyrics');
    await page.waitForLoadState('networkidle');
    const adminBtns = page.locator('[data-testid="admin-edit-btn"]');
    await expect(adminBtns).toHaveCount(0);
  });
});

test.describe('Admin releases route', () => {
  test('/admin/releases does not 404', async ({ page }) => {
    await page.goto('/admin/releases');
    await page.waitForLoadState('networkidle');
    // Will redirect to login if not authenticated — just confirm no 404
    await expect(page.locator('body')).not.toContainText('Page Not Found');
  });
});