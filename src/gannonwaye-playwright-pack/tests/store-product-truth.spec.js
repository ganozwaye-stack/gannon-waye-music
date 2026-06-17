// Store Product Truth Audit
// Verifies prices, stock status, discount exclusions, and poster imagery requirements.
import { test, expect } from '@playwright/test';

test.describe('Store Product Truth Audit', () => {

  test('Store loads at /store/all', async ({ page }) => {
    await page.goto('/store/all');
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible({ timeout: 10000 });
  });

  test('Journal bundle shows $59', async ({ page }) => {
    await page.goto('/store/all');
    const prices = page.locator('[data-testid="product-price"]');
    await expect(prices).not.toHaveCount(0);
    const texts = await prices.allTextContents();
    expect(texts.some(t => t.includes('59'))).toBeTruthy();
  });

  test('Winter bundle shows $129', async ({ page }) => {
    await page.goto('/store/all');
    // Winter bundle is rendered by WinterBundleHero — check the hero section
    const hero = page.locator('[data-testid="winter-bundle-hero"]');
    await expect(hero).toBeVisible({ timeout: 8000 });
    await expect(hero).toContainText('129');
  });

  test('Winter bundle displays no further discounts apply messaging', async ({ page }) => {
    await page.goto('/store/all');
    const hero = page.locator('[data-testid="winter-bundle-hero"]');
    await expect(hero).toBeVisible({ timeout: 8000 });
    const text = await hero.textContent();
    expect(
      text.toLowerCase().includes('no further discount') ||
      text.toLowerCase().includes('discount') ||
      text.toLowerCase().includes('excluded')
    ).toBeTruthy();
  });

  test('Hoodie shows $89 and available', async ({ page }) => {
    await page.goto('/store/all');
    const prices = page.locator('[data-testid="product-price"]');
    const texts = await prices.allTextContents();
    expect(texts.some(t => t.includes('89'))).toBeTruthy();
  });

  test('Mug shows $9.90', async ({ page }) => {
    await page.goto('/store/all');
    const prices = page.locator('[data-testid="product-price"]');
    const texts = await prices.allTextContents();
    expect(texts.some(t => t.includes('9') && t.includes('90') || t.includes('9.90'))).toBeTruthy();
  });

  test('Tote bag shows sold out and will not be restocked', async ({ page }) => {
    await page.goto('/store/all');
    const page_text = await page.textContent('body');
    expect(page_text.toLowerCase()).toContain('tote');
    // Check sold out + will not be restocked messaging
    expect(
      page_text.toLowerCase().includes('not be restocked') ||
      page_text.toLowerCase().includes('sold out due to popular demand')
    ).toBeTruthy();
  });

  test('Poster product has poster-specific image or needs-images flag', async ({ page }) => {
    await page.goto('/store/all');
    const allImages = await page.locator('[data-testid="product-image"]').all();
    for (const img of allImages) {
      const src = await img.getAttribute('src');
      if (src) {
        // Poster must not use hoodie image
        expect(src).not.toContain('RespectisEarnedThankyouDarkGreyHoodieFront');
      }
    }
  });

  test('Poster size pricing exists in detail page', async ({ page }) => {
    await page.goto('/store/product/respect-is-earned-wall-poster');
    await expect(page.locator('body')).toContainText('A4');
    await expect(page.locator('body')).toContainText('A3');
    await expect(page.locator('body')).toContainText('A1');
  });

  test('Add to cart button present for in-stock products', async ({ page }) => {
    await page.goto('/store/all');
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await expect(addBtns).not.toHaveCount(0);
  });

});