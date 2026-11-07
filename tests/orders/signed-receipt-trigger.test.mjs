import test from 'node:test';
import assert from 'node:assert/strict';
import {
  captureOrderFromSession,
  isOrderProcessed,
  requestOrderProcessing,
  signReceiptTrigger,
} from '../../base44/shared/checkoutOrderCapture.js';

function createMockBase44({ initialOrder, initialProduct, receiptResponse = { sent: true, skipped: false } } = {}) {
  const state = {
    orders: initialOrder ? [{ ...initialOrder }] : [],
    products: initialProduct ? [{ ...initialProduct }] : [],
    diagnostics: [],
    events: [],
    idempotence: [],
    notifications: [],
    invocations: [],
  };

  const base44 = {
    asServiceRole: {
      entities: {
        MerchOrder: {
          get: async (id) => {
            const found = state.orders.find((o) => o.id === id);
            if (!found) throw new Error('Order not found');
            return { ...found };
          },
          filter: async (query) => state.orders.filter((row) =>
            Object.entries(query).every(([k, v]) => row[k] === v)
          ),
          create: async (data) => {
            const created = {
              ...data,
              id: `order_${state.orders.length + 1}`,
              created_date: new Date().toISOString(),
            };
            state.orders.push(created);
            return { ...created };
          },
          update: async (id, patch) => {
            const found = state.orders.find((o) => o.id === id);
            if (!found) throw new Error('Order not found');
            Object.assign(found, patch);
            return { ...found };
          },
        },
        MerchProduct: {
          get: async (id) => {
            const found = state.products.find((p) => p.id === id);
            if (!found) throw new Error('Product not found');
            return { ...found };
          },
          update: async (id, patch) => {
            const found = state.products.find((p) => p.id === id);
            if (!found) throw new Error('Product not found');
            Object.assign(found, patch);
            return { ...found };
          },
        },
        PaymentDiagnostic: {
          filter: async (query) => state.diagnostics.filter((row) =>
            Object.entries(query).every(([k, v]) => row[k] === v)
          ),
          create: async (data) => {
            const created = { ...data, id: `diag_${state.diagnostics.length + 1}` };
            state.diagnostics.push(created);
            return created;
          },
        },
        StripeEventLog: {
          filter: async (query) => state.events.filter((row) =>
            Object.entries(query).every(([k, v]) => row[k] === v)
          ),
          create: async (data) => {
            const created = { ...data, id: `evt_${state.events.length + 1}` };
            state.events.push(created);
            return created;
          },
        },
        IdempotenceLog: {
          filter: async (query) => state.idempotence.filter((row) =>
            Object.entries(query).every(([k, v]) => row[k] === v)
          ),
          create: async (data) => {
            const created = { ...data, id: `idem_${state.idempotence.length + 1}` };
            state.idempotence.push(created);
            return created;
          },
        },
        AdminNotification: {
          create: async (data) => {
            state.notifications.push(data);
            return data;
          },
        },
      },
      functions: {
        invoke: async (name, payload) => {
          state.invocations.push({ name, payload });
          if (name === 'sendOrderReceipt') {
            if (typeof receiptResponse === 'function') {
              return receiptResponse(payload, state);
            }
            if (receiptResponse?.sent) {
              const order = state.orders.find((o) => o.id === payload.order_id);
              if (order) {
                order.receipt_sent = true;
                order.receipt_sent_at = new Date().toISOString();
                order.receipt_status = 'sent';
              }
            }
            return { data: receiptResponse };
          }
          return { data: { success: true } };
        },
      },
    },
  };

  return { base44, state };
}

test('signReceiptTrigger produces deterministic HMAC-SHA256 hex matching sendOrderReceipt expectation', async () => {
  const secret = 'test-receipt-secret-key';
  const orderId = 'order_abc12345';
  const timestamp = 1762387200;
  const sig1 = await signReceiptTrigger(secret, orderId, timestamp);
  const sig2 = await signReceiptTrigger(secret, orderId, timestamp);
  assert.equal(sig1, sig2);
  assert.match(sig1, /^[0-9a-f]{64}$/);
  const different = await signReceiptTrigger(secret, orderId, timestamp + 1);
  assert.notEqual(sig1, different);
});

test('requestOrderProcessing decrements variant stock once and triggers signed sendOrderReceipt', async () => {
  process.env.RECEIPT_TRIGGER_SECRET = 'unit-test-secret-999';
  try {
    const { base44, state } = createMockBase44({
      initialProduct: {
        id: 'prod_1',
        name: 'This Is Me Hoodie',
        stock_by_variant: { L: 5, XL: 3 },
      },
      initialOrder: {
        id: 'order_101',
        customer_name: 'Test Buyer',
        customer_email: 'buyer@example.com',
        items: [{ product_id: 'prod_1', product_name: 'This Is Me Hoodie', size: 'L', quantity: 2, price: 98 }],
        inventory_adjusted: false,
        receipt_sent: false,
      },
    });

    const res = await requestOrderProcessing(base44, 'order_101', 'evt_101', 'stripeWebhook');
    assert.equal(res.success, true);
    assert.equal(state.products[0].stock_by_variant.L, 3);
    assert.equal(state.orders[0].inventory_adjusted, true);
    assert.equal(state.orders[0].receipt_sent, true);

    const receiptCalls = state.invocations.filter((c) => c.name === 'sendOrderReceipt');
    assert.equal(receiptCalls.length, 1);
    const { order_id, timestamp, signature } = receiptCalls[0].payload;
    assert.equal(order_id, 'order_101');
    assert.equal(typeof timestamp, 'number');
    const expectedSig = await signReceiptTrigger('unit-test-secret-999', order_id, timestamp);
    assert.equal(signature, expectedSig);

    // Second invocation is a no-op for both inventory and receipt
    const repeat = await requestOrderProcessing(base44, 'order_101', 'evt_101_retry', 'stripeWebhook');
    assert.equal(repeat.success, true);
    assert.equal(repeat.inventory.skipped, true);
    assert.equal(repeat.receipt.skipped, true);
    assert.equal(state.products[0].stock_by_variant.L, 3);
    assert.equal(state.invocations.filter((c) => c.name === 'sendOrderReceipt').length, 1);
  } finally {
    delete process.env.RECEIPT_TRIGGER_SECRET;
  }
});

test('missing RECEIPT_TRIGGER_SECRET records critical PaymentDiagnostic and retries receipt on duplicate event without double stock decrement', async () => {
  delete process.env.RECEIPT_TRIGGER_SECRET;
  const { base44, state } = createMockBase44({
    initialProduct: {
      id: 'prod_2',
      name: 'Journal Workbook',
      stock_quantity: 10,
    },
  });

  const session = {
    id: 'cs_test_1234567890ABCDEF',
    mode: 'payment',
    currency: 'aud',
    payment_status: 'paid',
    amount_total: 4500,
    customer_details: { email: 'reader@example.com', name: 'Reader One' },
    metadata: {
      customer_name: 'Reader One',
      checkout_policy: 'stage_one_owned_stock_v1',
      abn: '22931809349',
      subtotal_amount_aud: '45.00',
      shipping_amount_aud: '0.00',
      items: JSON.stringify([{ product_id: 'prod_2', product_name: 'Journal Workbook', quantity: 1, price: 45 }]),
    },
  };

  const first = await captureOrderFromSession({
    base44,
    session,
    event: { id: 'evt_first', type: 'checkout.session.completed' },
  });

  assert.equal(first.outcome, 'created');
  assert.equal(first.postProcessing.success, false);
  assert.equal(state.products[0].stock_quantity, 9);
  assert.equal(state.orders[0].inventory_adjusted, true);
  assert.equal(isOrderProcessed(state.orders[0]), false);
  assert.equal(state.diagnostics.length, 1);
  assert.match(state.diagnostics[0].issue_summary, /needs customer receipt/);

  // Now configure secret and deliver duplicate event: stock stays 9, receipt sends once
  process.env.RECEIPT_TRIGGER_SECRET = 'recovered-secret-123';
  try {
    const second = await captureOrderFromSession({
      base44,
      session,
      event: { id: 'evt_retry', type: 'checkout.session.completed' },
    });
    assert.equal(second.outcome, 'duplicate');
    assert.equal(second.postProcessing.success, true);
    assert.equal(state.products[0].stock_quantity, 9);
    assert.equal(isOrderProcessed(state.orders[0]), true);
    assert.equal(state.invocations.filter((c) => c.name === 'sendOrderReceipt').length, 1);
  } finally {
    delete process.env.RECEIPT_TRIGGER_SECRET;
  }
});