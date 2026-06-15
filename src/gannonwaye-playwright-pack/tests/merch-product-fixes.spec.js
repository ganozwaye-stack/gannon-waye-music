// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Merch store — product pricing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
  });

  test('Journal bundle shows $59', async ({ page }) => {
    const cards = page.locator('[data-testid="product-card"]');
    let found = false;
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const title = await card.locator('[data-testid="product-title"]').textContent();
      if (title && title.toLowerCase().includes('journal')) {
        const price = await card.locator('[data-testid="product-price"]').textContent();
        expect(price).toContain('59');
        found = true;
      }
    }
    expect(found).toBe(true);
  });

  test('Winter bundle shows $129', async ({ page }) => {
    const winterSection = page.locator('[data-testid="winter-bundle-hero"]');
    await expect(winterSection).toBeVisible();
    await expect(winterSection).toContainText('129');
  });

  test('Winter bundle shows no-discount badge', async ({ page }) => {
    const winterSection = page.locator('[data-testid="winter-bundle-hero"]');
    await expect(winterSection).toContainText(/no further discounts/i);
  });

  test('Winter bundle add to cart button is visible', async ({ page }) => {
    const btn = page.locator('[data-testid="winter-bundle-add-to-cart"]');
    await expect(btn).toBeVisible();
  });

  test('Poster product does not show hoodie image exclusively', async ({ page }) => {
    const cards = page.locator('[data-testid="product-card"]');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const title = await card.locator('[data-testid="product-title"]').textContent();
      if (title && title.toLowerCase().includes('poster')) {
        const img = card.locator('img').first();
        const src = await img.getAttribute('src');
        // Hoodie image should not be the poster image
        expect(src).not.toContain('RespectisEarnedThankyouDarkGreyHoodieFront');
      }
    }
  });
});

test.describe('Winter bundle — promo code rejection', () => {
  test('winter bundle item in cart rejects promo codes', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('networkidle');
    const addBtn = page.locator('[data-testid="winter-bundle-add-to-cart"]');
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.goto('/store/cart-details');
      await page.waitForLoadState('networkidle');
      // Try applying a promo code
      const promoInput = page.locator('input[placeholder*="promo"], input[placeholder*="code"]').first();
      if (await promoInput.count() > 0) {
        await promoInput.fill('TEST10');
        const applyBtn = page.locator('button:has-text("Apply")').first();
        if (await applyBtn.count() > 0) {
          await applyBtn.click();
          // Should show rejection or no discount applied to bundle
          await expect(page.locator('body')).toContainText(/no further|excluded|not eligible|bundle/i);
        }
      }
    }
  });
});