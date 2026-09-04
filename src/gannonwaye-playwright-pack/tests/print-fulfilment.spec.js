// Print Fulfilment Admin Page Tests
import { test, expect } from '@playwright/test';

test.describe('Print Fulfilment Admin Page', () => {

  test('/admin/print-fulfilment loads', async ({ page }) => {
    await page.goto('/admin/print-fulfilment');
    await expect(page.locator('h1')).toContainText('Print Fulfilment');
  });

  test('Provider records are displayed', async ({ page }) => {
    await page.goto('/admin/print-fulfilment');
    await expect(page.locator('body')).toContainText('Printful');
    await expect(page.locator('body')).toContainText('Printify');
    await expect(page.locator('body')).toContainText('Gelato');
    await expect(page.locator('body')).toContainText('Prodigi');
    await expect(page.locator('body')).toContainText('The Print Space');
    await expect(page.locator('body')).toContainText('Local AUS Print');
  });

  test('No active provider — manual fulfilment warning shown', async ({ page }) => {
    await page.goto('/admin/print-fulfilment');
    const text = await page.textContent('body');
    expect(
      text.toLowerCase().includes('manual') ||
      text.toLowerCase().includes('no provider')
    ).toBeTruthy();
  });

  test('API env var placeholders shown, not actual keys', async ({ page }) => {
    await page.goto('/admin/print-fulfilment');
    const text = await page.textContent('body');
    // Should show secret names, not actual token or key values
    expect(text).toContain('PRINTFUL_API_TOKEN');
    expect(text).toContain('GELATO_API_KEY');
    // Should NOT contain actual API key values (starts with live_ or test_)
    expect(text).not.toMatch(/live_[a-zA-Z0-9]{20,}/);
    expect(text).not.toMatch(/sk_live_[a-zA-Z0-9]{20,}/);
  });

  test('Size variants tab shows poster pricing', async ({ page }) => {
    await page.goto('/admin/print-fulfilment');
    await page.click('button:has-text("Size Variants")');
    await expect(page.locator('body')).toContainText('A4');
    await expect(page.locator('body')).toContainText('A3');
    await expect(page.locator('body')).toContainText('A2');
    await expect(page.locator('body')).toContainText('A1');
    await expect(page.locator('body')).toContainText('$19');
    await expect(page.locator('body')).toContainText('$29');
    await expect(page.locator('body')).toContainText('$39');
    await expect(page.locator('body')).toContainText('$59');
  });

  test('Human Action Required tab shows poster image requirement', async ({ page }) => {
    await page.goto('/admin/print-fulfilment');
    await page.click('button:has-text("Human Action Required")');
    await expect(page.locator('body')).toContainText('poster');
    await expect(page.locator('body')).toContainText('artwork');
  });

  test('Order Routing tab explains manual fallback', async ({ page }) => {
    await page.goto('/admin/print-fulfilment');
    await page.click('button:has-text("Order Routing")');
    await expect(page.locator('body')).toContainText('manual');
  });

});