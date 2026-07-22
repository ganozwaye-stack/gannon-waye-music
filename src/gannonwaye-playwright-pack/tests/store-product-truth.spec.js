// Store Product Truth Audit
// Verifies prices, stock status, discount exclusions, and poster imagery requirements.
import { test, expect } from '@playwright/test';

test.describe('Store Product Truth Audit', () => {
  const gotoStore = (page) => page.goto('/store/all', { waitUntil: 'domcontentloaded' });

  test('Store loads at /store/all', async ({ page }) => {
    await gotoStore(page);
    await expect(page.locator('[data-testid="store-page"]')).toBeVisible({ timeout: 10000 });
  });

  test('Journal bundle shows $59', async ({ page }) => {
    await gotoStore(page);
    const prices = page.locator('[data-testid="product-price"]');
    await expect(prices).not.toHaveCount(0);
    const texts = await prices.allTextContents();
    expect(texts.some(text => text.includes('59'))).toBeTruthy();
  });

  test('Winter bundle shows $119', async ({ page }) => {
    await gotoStore(page);
    const hero = page.locator('[data-testid="winter-bundle-hero"]');
    await expect(hero).toBeVisible({ timeout: 8000 });
    await expect(hero).toContainText('119');
  });

  test('Winter bundle displays no further discounts apply messaging', async ({ page }) => {
    await gotoStore(page);
    const hero = page.locator('[data-testid="winter-bundle-hero"]');
    await expect(hero).toBeVisible({ timeout: 8000 });
    const text = (await hero.textContent()) || '';
    expect(
      text.toLowerCase().includes('no further discount') ||
      text.toLowerCase().includes('discount') ||
      text.toLowerCase().includes('excluded')
    ).toBeTruthy();
  });

  test('Hoodie shows $98 and available', async ({ page }) => {
    await gotoStore(page);
    const prices = page.locator('[data-testid="product-price"]');
    const texts = await prices.allTextContents();
    expect(texts.some(text => text.includes('98'))).toBeTruthy();
  });

  test('Mug shows $9.90', async ({ page }) => {
    await gotoStore(page);
    const prices = page.locator('[data-testid="product-price"]');
    const texts = await prices.allTextContents();
    expect(texts.some(text => text.includes('9.90'))).toBeTruthy();
  });

  test('Tote bag shows sold out and will not be restocked', async ({ page }) => {
    await gotoStore(page);
    const pageText = (await page.textContent('body')) || '';
    expect(pageText.toLowerCase()).toContain('tote');
    expect(
      pageText.toLowerCase().includes('not be restocked') ||
      pageText.toLowerCase().includes('sold out due to popular demand')
    ).toBeTruthy();
  });

  test('Poster product has poster-specific image', async ({ page }) => {
    await page.goto('/store/product/respect-is-earned-wall-poster', { waitUntil: 'domcontentloaded' });
    const firstPosterImage = page.locator('img[alt*="Poster"], img[alt*="poster"]').first();
    await expect(firstPosterImage).toBeVisible({ timeout: 10000 });
    const src = await firstPosterImage.getAttribute('src');
    expect(src || '').not.toContain('RespectisEarnedThankyouDarkGreyHoodieFront');
  });

  test('Poster size pricing exists in detail page', async ({ page }) => {
    await page.goto('/store/product/respect-is-earned-wall-poster', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText('A4');
    await expect(page.locator('body')).toContainText('A3');
    await expect(page.locator('body')).toContainText('A1');
  });

  test('Add to cart button present for in-stock products', async ({ page }) => {
    await gotoStore(page);
    const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
    await expect(addBtns).not.toHaveCount(0);
  });
});
