import { test, expect } from '@playwright/test';

const HOODIE_ID = '69f11d1fc43e13c61fe6b9d7';
const JOURNAL_BUNDLE_ID = '69fbd261b760426cede1b7a3';

test.describe('Stage one product truth', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/store');
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
  });

  test('journal bundle shows the approved $59 price', async ({ page }) => {
    const bundle = page.locator('[data-testid="product-card"]').filter({ hasText: 'Journal Pen and Thermos' }).first();
    await expect(bundle).toBeVisible();
    await expect(bundle.locator('[data-testid="product-price"]')).toContainText('$59');
  });

  test('hoodie shows the approved $98 price', async ({ page }) => {
    const hoodie = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
    await expect(hoodie).toBeVisible();
    await expect(hoodie.locator('[data-testid="product-price"]')).toContainText('$98');
  });

  test('hoodie exposes only owner counted sizes', async ({ page }) => {
    const hoodie = page.locator('[data-testid="product-card"]').filter({ hasText: 'Hoodie' }).first();
    await expect(hoodie.getByRole('button', { name: /^S \(3\)$/ })).toBeVisible();
    await expect(hoodie.getByRole('button', { name: /^M \(4\)$/ })).toBeVisible();
    await expect(hoodie.getByRole('button', { name: /^L \(5\)$/ })).toBeVisible();
    await expect(hoodie.getByRole('button', { name: /^XL \(2\)$/ })).toBeVisible();
    await expect(hoodie.getByRole('button', { name: /XS|2XL|3XL|XXL/ })).toHaveCount(0);
  });

  test('both visual layers use the same two database identifiers', async ({ page }) => {
    const gridIds = await page.locator('[data-testid="product-card"]').evaluateAll(cards =>
      cards.map(card => card.querySelector('[data-testid="product-title"]')?.textContent || '')
    );
    expect(gridIds).toHaveLength(2);

    const worldIds = await page.locator('[data-testid="world-product-card"]').evaluateAll(cards =>
      cards.map(card => card.getAttribute('data-product-id')).sort()
    );
    expect(worldIds).toEqual([HOODIE_ID, JOURNAL_BUNDLE_ID].sort());
  });

  test('blocked and retired products are absent', async ({ page }) => {
    const text = await page.locator('body').innerText();
    for (const blocked of [
      'Winter Writing & Comfort Bundle',
      'Respect Is Earned Coffee Mug',
      'Assorted Wall Poster',
      'Oversized Tee',
      'Deluxe Signed CD',
      'Slim Case',
    ]) {
      expect(text).not.toContain(blocked);
    }
  });

  test('legacy product detail links return to the verified store', async ({ page }) => {
    for (const slug of [
      'winter-writing-comfort-bundle',
      'thankyou-respect-is-earned-coffee-mug',
      'respect-is-earned-wall-poster',
      'thankyou-respect-is-earned-hoodie-front',
    ]) {
      await page.goto(`/store/product/${slug}`);
      await expect(page).toHaveURL('/store');
      await expect(page.locator('[data-testid="store-page"]')).toBeVisible();
    }
  });
});
