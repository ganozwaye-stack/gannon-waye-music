import { test, expect } from '@playwright/test';
 
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Public Contact Details — Safety Checks', () => {

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
  });

  test('homepage loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('load');
    const critical = errors.filter(e => !e.includes('favicon') && !e.includes('analytics') && !e.includes('posthog') && !e.includes('ERR_CONNECTION_REFUSED') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required') && !e.includes('net::ERR') && !e.includes('posthog') && !e.includes('ERR_CONNECTION_REFUSED') && !e.includes('401') && !e.includes('403') && !e.includes('Unauthorized') && !e.includes('Authentication required') && !e.includes('net::ERR'));
    expect(critical).toHaveLength(0);
  });

  test('contact page loads and does not show disallowed email', async ({ page }) => {
    await page.goto(`${BASE_URL}/contact`);
    await page.waitForLoadState('load');
    const content = await page.content();
    expect(content).not.toContain('ganozwaye@gmail.com');
    expect(content).not.toContain('resiliencefitness@hotmail.com');
  });

  test('checkout success page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout-success`);
    await page.waitForLoadState('load');
    expect(page.url()).toMatch(/checkout-success|store/);
  });

  test('store page loads without disallowed email', async ({ page }) => {
    await page.goto(`${BASE_URL}/store`);
    await page.waitForLoadState('load');
    const content = await page.content();
    expect(content).not.toContain('ganozwaye@gmail.com');
  });

  test('privacy policy page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy-policy`);
    await page.waitForLoadState('load');
    await expect(page.locator('text=/privacy/i').first()).toBeVisible();
  });

  test('terms of service page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/terms-of-service`);
    await page.waitForLoadState('load');
    await expect(page.locator('text=/terms/i').first()).toBeVisible();
  });

});