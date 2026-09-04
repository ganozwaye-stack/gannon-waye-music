/* eslint-disable no-undef */
// @ts-check
 
 
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

async function addItemToCart(page) {
  await page.goto(`${BASE_URL}/store/all`);
  const cards = page.locator('[data-testid="product-card"]');
  await expect(cards.first()).toBeVisible();

  for (let i = 0; i < await cards.count(); i += 1) {
    const card = cards.nth(i);
    const addButton = card.locator('[data-testid="add-to-cart-btn"]');
    if (!await addButton.isVisible().catch(() => false)) continue;

    const sizeOption = card.locator('[data-testid="size-option"]').first();
    if (await sizeOption.isVisible().catch(() => false)) {
      await sizeOption.click();
    }

    await addButton.click();
    await expect(card.locator('[data-testid="go-to-checkout-button"]')).toBeVisible();
    return;
  }

  throw new Error('No purchasable product was available for the cart-details regression test.');
}

test.describe('Cart Details Page', () => {
  test('navigates to /store/cart-details after checkout click', async ({ page }) => {
    await addItemToCart(page);
    const checkoutBtn = page.locator('[data-testid="go-to-checkout-button"]').first();
    if (await checkoutBtn.isVisible().catch(() => false)) {
      await checkoutBtn.click();
    } else {
      await page.locator('[data-testid="store-sticky-checkout-button"]').click();
    }
    await expect(page).toHaveURL(/cart-details/);
    await expect(page.locator('[data-testid="cart-details-page"]')).toBeVisible();
  });

  test('required fields block continuation when empty', async ({ page }) => {
    await addItemToCart(page);
    await page.goto(`${BASE_URL}/store/cart-details`);
    const continueBtn = page.locator('[data-testid="continue-to-review-button"]');
    await continueBtn.click();
    // At least one validation error should appear
    const errors = page.locator('.text-destructive');
    await expect(errors.first()).toBeVisible();
  });

  test('customer can fill all required fields and continue', async ({ page }) => {
    await addItemToCart(page);
    await page.goto(`${BASE_URL}/store/cart-details`);

    await page.fill('[data-testid="input-full-name"]', 'Jane Smith');
    await page.fill('[data-testid="input-email"]', 'jane@example.com');
    await page.fill('[data-testid="input-mobile"]', '+61 400 000 000');
    await page.fill('[data-testid="input-street-address"]', '123 Test Street');
    await page.fill('[data-testid="input-suburb"]', 'Melbourne');
    // State — select VIC
    const stateSelect = page.locator('[data-testid="input-state"]');
    const tag = await stateSelect.evaluate(el => el.tagName);
    if (tag === 'SELECT') {
      await stateSelect.selectOption('VIC');
    } else {
      await stateSelect.fill('VIC');
    }
    await page.fill('[data-testid="input-postcode"]', '3000');

    await page.locator('[data-testid="continue-to-review-button"]').click();
    await expect(page).toHaveURL(/checkout/);
  });

  test('optional fields (DOB, business name, ABN) are not required', async ({ page }) => {
    await addItemToCart(page);
    await page.goto(`${BASE_URL}/store/cart-details`);

    // Fill required only — no DOB/business/ABN
    await page.fill('[data-testid="input-full-name"]', 'Test User');
    await page.fill('[data-testid="input-email"]', 'test@example.com');
    await page.fill('[data-testid="input-mobile"]', '0400000000');
    await page.fill('[data-testid="input-street-address"]', '456 Real Street');
    await page.fill('[data-testid="input-suburb"]', 'Sydney');
    const stateSelect = page.locator('[data-testid="input-state"]');
    const tag = await stateSelect.evaluate(el => el.tagName);
    if (tag === 'SELECT') { await stateSelect.selectOption('NSW'); } else { await stateSelect.fill('NSW'); }
    await page.fill('[data-testid="input-postcode"]', '2000');

    await page.locator('[data-testid="continue-to-review-button"]').click();
    await expect(page).toHaveURL(/checkout/);
  });

  test('checkout does not offer an unconnected marketing opt-in', async ({ page }) => {
    await addItemToCart(page);
    await page.goto(`${BASE_URL}/store/cart-details`);
    await expect(page.locator('[data-testid="checkbox-marketing-opt-in"]')).toHaveCount(0);
    await expect(page.getByText('This checkout does not subscribe you to marketing.')).toBeVisible();
  });
});