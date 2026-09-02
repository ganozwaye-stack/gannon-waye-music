import { test, expect } from '@playwright/test';
import { STOREFRONT_ART_LOCK } from '../../config/storefrontArtLock.js';

const LOCKED_IMAGE = STOREFRONT_ART_LOCK.imageUrl;
const LOCKED_SHA256 = STOREFRONT_ART_LOCK.imageSha256;
const HOODIE_ID = '69f11d1fc43e13c61fe6b9d7';
const JOURNAL_BUNDLE_ID = '69fbd261b760426cede1b7a3';

test.describe('Permanent boutique world and verified store', () => {
  test('the owner locked boutique world remains on the public store', async ({ page }) => {
    await page.goto('/store');

    const world = page.locator('[data-testid="locked-storefront-world"]');
    await expect(world).toBeVisible();
    await expect(world).toHaveAttribute('data-storefront-lock-id', 'gannon-waye-boutique-world-v1');

    const image = page.locator('[data-testid="locked-storefront-world-image"]');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('src', LOCKED_IMAGE);
    await expect(image).toHaveAttribute('data-storefront-image-sha256', LOCKED_SHA256);

    await expect(page.locator('[data-testid="locked-storefront-stage"]')).toBeVisible();
    await expect(page.locator('[data-testid="locked-storefront-stage-image"]')).toHaveAttribute('src', LOCKED_IMAGE);
  });

  test('only the two approved stage one products appear as sellable items', async ({ page }) => {
    await page.goto('/store');

    const worldCards = page.locator('[data-testid="world-product-card"]');
    await expect(worldCards).toHaveCount(2);

    const ids = await worldCards.evaluateAll(cards => cards.map(card => card.getAttribute('data-product-id')).sort());
    expect(ids).toEqual([HOODIE_ID, JOURNAL_BUNDLE_ID].sort());

    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCount(2);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText).not.toContain('Winter Writing & Comfort Bundle');
    expect(bodyText).not.toContain('Respect Is Earned Coffee Mug');
    expect(bodyText).not.toContain('Assorted Wall Poster');
  });

  test('hoodie sizes and quantities come from the verified live record', async ({ page }) => {
    await page.goto('/store');

    const hoodie = page.locator('[data-testid="product-card"]').filter({ hasText: 'Respect Is Earned' }).first();
    await expect(hoodie).toBeVisible();
    await expect(hoodie.getByRole('button', { name: 'S (3)', exact: true })).toBeVisible();
    await expect(hoodie.getByRole('button', { name: 'M (4)', exact: true })).toBeVisible();
    await expect(hoodie.getByRole('button', { name: 'L (5)', exact: true })).toBeVisible();
    await expect(hoodie.getByRole('button', { name: 'XL (2)', exact: true })).toBeVisible();
    await expect(hoodie.getByRole('button', { name: /2XL|3XL/ })).toHaveCount(0);
  });

  test('world product selection opens the database driven product modal', async ({ page }) => {
    await page.goto('/store');

    await page.locator(`[data-testid="world-product-card"][data-product-id="${JOURNAL_BUNDLE_ID}"]`).click();
    const modal = page.locator('[data-testid="product-detail-modal"]');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: 'Thank You Journal Pen and Thermos Flask Bundle' })).toBeVisible();
    await expect(modal.getByText('$59 AUD', { exact: true })).toBeVisible();
    await expect(modal.getByRole('button', { name: /Add to Cart/ })).toBeVisible();
  });
});
