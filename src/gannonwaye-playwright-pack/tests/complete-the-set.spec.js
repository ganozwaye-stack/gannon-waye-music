import { test, expect } from '@playwright/test';

const HOODIE_ID = '69f11d1fc43e13c61fe6b9d7';
const JOURNAL_ID = '69fbd261b760426cede1b7a3';
const WINTER_ID = '6a9a945016c72a1e3c04935f';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('gannon_store_cart_v2');
  });
  await page.goto('/store');
});

test('hoodie and journal offer the live Winter bundle as one selectable product', async ({ page }) => {
  const hoodie = page.locator(`[data-product-id="${HOODIE_ID}"]`);
  const journal = page.locator(`[data-product-id="${JOURNAL_ID}"]`);
  const winter = page.locator(`[data-product-id="${WINTER_ID}"]`);

  await expect(hoodie.locator('[data-testid="complete-set-option"]')).toBeVisible();
  await expect(journal.locator('[data-testid="complete-set-option"]')).toBeVisible();
  await expect(winter.locator('[data-testid="complete-set-option"]')).toHaveCount(0);

  await expect(journal.locator('[data-testid="complete-set-link"]')).toHaveAttribute(
    'href',
    `#store-product-${WINTER_ID}`,
  );
  await expect(journal.locator('[data-testid="purchase-choice-item"]')).toBeChecked();

  await journal.locator('[data-testid="purchase-choice-set"]').check();
  await expect(journal.getByText('Select hoodie size for the complete set')).toBeVisible();

  await journal.locator('[data-testid="add-to-cart-btn"]').click();
  await expect(journal.getByText('Please select a size')).toBeVisible();

  await journal.getByRole('button', { name: /^Select size M\b/ }).click();
  await journal.locator('[data-testid="add-to-cart-btn"]').click();
  await expect(journal.locator('[data-testid="add-to-cart-success"]')).toBeVisible();

  await expect.poll(async () => page.evaluate(() => {
    const raw = localStorage.getItem('gannon_store_cart_v2');
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.state?.items?.map(item => ({
      product_id: item.product_id,
      size: item.size,
      price: item.product?.sale_price,
    })) ?? [];
  })).toEqual([{ product_id: WINTER_ID, size: 'M', price: 119 }]);

  await expect(page.locator('body')).not.toContainText(/upsell|upscale/i);
});

test('detail modal exposes the same Complete the Set link and choice', async ({ page }) => {
  const hoodie = page.locator(`[data-product-id="${HOODIE_ID}"]`);
  await hoodie.locator('div.relative.cursor-pointer').first().click();

  const modal = page.locator('[data-testid="product-detail-modal"]');
  await expect(modal).toBeVisible();
  await expect(modal.locator('[data-testid="complete-set-option"]')).toBeVisible();
  await expect(modal.locator('[data-testid="purchase-choice-item"]')).toBeChecked();

  await modal.locator('[data-testid="purchase-choice-set"]').check();
  await expect(modal.getByText('Select hoodie size for the complete set')).toBeVisible();
  await expect(modal.getByRole('button', { name: 'Add Complete Set to Cart' })).toBeVisible();

  await modal.locator('[data-testid="complete-set-link"]').click();
  await expect(modal).toHaveCount(0);
  await expect(page).toHaveURL(new RegExp(`#store-product-${WINTER_ID}$`));
  await expect(page.locator(`#store-product-${WINTER_ID}`)).toBeVisible();
});
