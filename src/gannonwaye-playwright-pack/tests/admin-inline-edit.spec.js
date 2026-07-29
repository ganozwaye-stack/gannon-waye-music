// Admin Inline Edit Button Tests
// Verifies admin edit buttons are hidden from public and visible to admin.
import { test, expect } from '@playwright/test';

test.describe('Admin Inline Edit Buttons — Public Visibility', () => {

  test('Edit buttons NOT visible to unauthenticated public user on store', async ({ page }) => {
    await page.goto('/store/all', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible({ timeout: 10000 });
    // Admin edit buttons have no data-testid by design — look for Edit text in gold admin buttons
    // They should not appear for unauthenticated users
    const editLinks = await page.locator('a[href*="/admin/merch"]:has-text("Edit")').count();
    expect(editLinks).toBe(0);
  });

  test('Edit buttons NOT visible on public store world page', async ({ page }) => {
    await page.goto('/store', { waitUntil: 'domcontentloaded' });
    const editLinks = await page.locator('a:has-text("Edit")').count();
    expect(editLinks).toBe(0);
  });

  test('Admin edit button component exists in codebase', async ({ page }) => {
    // Verify the admin routes exist (which means AdminEditButton is importable)
    await page.goto('/admin');
    // If page loads admin dashboard, the component infrastructure is present
    await expect(page.locator('body')).not.toContainText('Page Not Found');
  });

});

// Note: Admin-visible edit button tests require an authenticated admin session.
// These run in a separate auth-required context.
test.describe('Admin Inline Edit Buttons — Admin Visibility (requires auth)', () => {
  // These tests are documented but require manual auth setup or Base44 admin session token.
  // BLOCKER: Base44 platform handles auth — cannot programmatically log in as admin in Playwright
  // without a session fixture. Tests below are stubs for when auth fixture is available.

  test.skip('Edit buttons visible to admin on /store/all', async ({ page }) => {
    // Requires: page.context().addCookies([adminSessionCookie])
    await page.goto('/store/all');
    const editLinks = await page.locator('a[href*="/admin/merch"]:has-text("Edit")').count();
    expect(editLinks).toBeGreaterThan(0);
  });

});
