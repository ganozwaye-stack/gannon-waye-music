/* eslint-disable no-undef */
const { test, expect } = require('@playwright/test');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const REPOSITORY_ROOT = resolve(__dirname, '../../..');

function source(path) {
  return readFileSync(resolve(REPOSITORY_ROOT, path), 'utf8');
}

test.describe('Commerce approval guardrails', () => {
  test('backend checkout blocks international physical orders before Stripe', () => {
    const checkoutFunction = source('base44/functions/createCheckoutSession/entry.ts');

    expect(checkoutFunction).toContain('INTERNATIONAL_SHIPPING_QUOTE_REQUIRED');
    expect(checkoutFunction).toContain('International delivery for physical items needs a shipping quote before payment');
    expect(checkoutFunction).toMatch(/allowed_countries:\s*\[\s*'AU'\s*\]/);
    expect(checkoutFunction).not.toMatch(/allowed_countries:\s*\[[^\]]*'NZ'/);
  });

  test('local Base44 checkout mock mirrors the international quote block', () => {
    const mockClient = source('src/api/base44Client.js');

    expect(mockClient).toContain('International delivery for physical items needs a shipping quote before payment');
    expect(mockClient).toContain('hasPhysicalItems && !isAustralianAddress');
  });

  test('procurement creates approval proposals, not inventory batches before approval', () => {
    const procurement = source('src/pages/admin/ProcurementCommand.jsx');

    expect(procurement).toContain('Approval proposal only. No supplier order has been placed from this screen.');
    expect(procurement).toContain("const createInventoryAfterApproval = po.status === 'approved';");
    expect(procurement).toMatch(/if \(createInventoryAfterApproval\) \{\s+await base44\.entities\.InventoryBatch\.create/s);
  });
});
