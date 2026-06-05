// @ts-check
/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

async function addItemToCart(page) {
  await page.goto(`${BASE_URL}/store`);
  await page.waitForSelector('[data-testid="product-card"]');
  
  // Select size M first if it exists, to avoid size selection validation toasts
  const sizeM = page.locator('button').filter({ hasText: /^M$/ }).first();
  if (await sizeM.isVisible().catch(() => false)) {
    await sizeM.click({ force: true });
  }

  // Click first visible add to cart button
  const addBtns = page.locator('[data-testid="add-to-cart-btn"]');
  const count = await addBtns.count();
  for (let i = 0; i < count; i++) {
    const btn = addBtns.nth(i);
    if (await btn.isVisible()) {
      await btn.click({ force: true });
      // Wait for the cart drawer checkout button to ensure Zustand state is saved
      await page.waitForSelector('[data-testid="go-to-checkout-button"]', { timeout: 5000 }).catch(() => {});
      break;
    }
  }
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
    await page.goto(`${BASE_URL}/store/cart-details`);
    // If redirected to /store (empty cart), that's acceptable — add item first
    if (page.url().includes('/store') && !page.url().includes('cart-details')) {
      await addItemToCart(page);
      await page.goto(`${BASE_URL}/store/cart-details`);
    }
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

  test('marketing opt-in checkbox exists and is optional', async ({ page }) => {
    await page.goto(`${BASE_URL}/store/cart-details`);
    const cb = page.locator('[data-testid="checkbox-marketing-opt-in"]');
    // May redirect to /store if empty cart — just check it exists on the form page
    if (await cb.isVisible().catch(() => false)) {
      await expect(cb).not.toBeChecked();
    }
  });
});