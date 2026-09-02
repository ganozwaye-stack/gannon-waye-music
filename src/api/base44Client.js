import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl,
});

const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
);

function simpleFilter(records, query) {
  if (!query || typeof query !== 'object' || Array.isArray(query)) return [...records];
  return records.filter(record => Object.entries(query).every(([key, expected]) => {
    if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
      if ('$in' in expected) return expected.$in.includes(record[key]);
      return true;
    }
    return record[key] === expected;
  }));
}

if (isLocal || token === 'mock-admin-token') {
  base44.auth.me = async () => {
    const currentToken = appParams.token || (typeof window !== 'undefined' ? localStorage.getItem('base44_access_token') : null);
    if (currentToken === 'mock-admin-token') {
      return {
        id: 'mock-admin-id',
        email: 'admin@gannonwaye.com',
        role: 'admin',
        full_name: 'Gannon Admin',
      };
    }
    return null;
  };

  const mockProducts = [
    {
      id: '69f11d1fc43e13c61fe6b9d7',
      name: '"Respect Is Earned" Hoodie — Dark Grey',
      description: 'Premium dark grey Respect Is Earned hoodie from the Thankyou collection.',
      sale_price: 98,
      cost_price: 25,
      packaging_cost: 0,
      merchant_fee_percent: 3.5,
      category: 'apparel',
      stock_quantity: 14,
      stock_by_variant: { S: 3, M: 4, L: 5, XL: 2 },
      sizes_available: ['S', 'M', 'L', 'XL'],
      inventory_source: 'owned_stock',
      stock_verified_at: '2026-09-02T14:00:50.000Z',
      stock_verification_note: 'Owner-confirmed physical count: S 3, M 4, L 5, XL 2.',
      cost_verification_status: 'owner_approved_recorded_cost',
      cost_verification_note: 'Owner-approved recorded acquisition cost for stage one sale.',
      shipping_policy: 'customer_pays',
      exclude_from_discounts: true,
      is_stage_one_sale: true,
      publication_status: 'live',
      is_active: true,
      approved_by: '69eb7905ca6eb4180010f795',
      approved_at: '2026-09-02T14:00:50.000Z',
      image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
      images_array: [
        'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/e1954bbbf_RespectisEarnedThankyouDarkGreyHoodieFront.png',
        'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/fc46764a3_RespectisEarnedThankyouDarkGreyHoodieBack.jpg',
      ],
    },
    {
      id: '69fbd261b760426cede1b7a3',
      name: 'Thank You Journal Pen and Thermos Flask Bundle',
      description: 'Thankyou journal, pen and thermos flask set for writing and reflection.',
      sale_price: 59,
      cost_price: 10,
      packaging_cost: 0,
      merchant_fee_percent: 3.5,
      category: 'bundle',
      stock_quantity: 19,
      stock_by_variant: {},
      sizes_available: [],
      inventory_source: 'owned_stock',
      stock_verified_at: '2026-09-02T14:00:50.000Z',
      stock_verification_note: 'Owner-confirmed physical count of 19 sets. Component completeness remains a fulfilment check before dispatch.',
      cost_verification_status: 'owner_approved_recorded_cost',
      cost_verification_note: 'Owner-approved recorded acquisition cost for stage one sale.',
      shipping_policy: 'customer_pays',
      exclude_from_discounts: true,
      is_stage_one_sale: true,
      publication_status: 'live',
      is_active: true,
      approved_by: '69eb7905ca6eb4180010f795',
      approved_at: '2026-09-02T14:00:50.000Z',
      image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/196aece47_JournalBundle.png',
      images_array: [
        'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/196aece47_JournalBundle.png',
        'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/18964f39a_BundleJournalPenThermos.png',
        'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/9aab98d2b_RIEBundleBox.png',
      ],
    },
  ];

  const mockOrders = [
    {
      id: '6a1b33200908eb6a636c3ebf',
      customer_name: 'Thea Elsworth',
      customer_email: 'dorotheae@icloud.com',
      total_amount: 90.48,
      status: 'shipped',
      financial_status: 'captured',
      created_date: '2026-05-30T18:57:36.961Z',
      items: [{ product_id: '69f11d1fc43e13c61fe6b9d7', product_name: 'Respect Is Earned Hoodie', price: 98, quantity: 1, size: 'XL' }],
    },
  ];

  const entityMockData = {
    MerchOrder: mockOrders,
    MerchProduct: mockProducts,
    AdminNotification: [],
    ApiIntegrationSetup: [],
    AgentActionProposal: [],
    SystemHealthIssue: [],
    ApprovalQueue: [],
    StoreCustomer: [],
  };

  const originalInvoke = base44.functions.invoke;
  base44.functions.invoke = async (functionName, payload) => {
    console.log(`[Mock SDK] Invoke function: ${functionName}`, payload);

    if (functionName === 'validatePromoCode') {
      return { data: { valid: false, reason: 'Promo codes are paused during stage one checkout.' } };
    }

    if (functionName === 'calculateShippingRate') {
      const requested = Array.isArray(payload?.cart_items) ? payload.cart_items : [];
      const products = requested.map(item => ({
        product: mockProducts.find(product => product.id === item.product_id),
        quantity: Math.max(1, Number(item.quantity || 1)),
      })).filter(item => item.product);

      if (products.length !== requested.length || products.length === 0) {
        return { data: { error: 'A cart item is unavailable.', shipping_cost: null, free_shipping: false } };
      }

      const subtotal = products.reduce((sum, item) => sum + item.product.sale_price * item.quantity, 0);
      const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
      const hasBundle = products.some(item => item.product.category === 'bundle');
      const baseRate = hasBundle ? 17.5 : 12.5;
      const additionalRate = hasBundle ? 3.5 : 2.5;
      const threshold = hasBundle ? 120 : 100;
      const shippingCost = subtotal >= threshold ? 0 : baseRate + Math.max(0, totalQuantity - 1) * additionalRate;

      return {
        data: {
          destination: 'australia',
          shipping_cost: Number(shippingCost.toFixed(2)),
          shipping_cost_cents: Math.round(shippingCost * 100),
          free_shipping: shippingCost === 0,
          method: shippingCost === 0 ? 'configured_threshold' : 'combined_package_live_rule',
          selected_rule_name: hasBundle ? 'Bundle Standard' : 'Merch Standard',
          cart_subtotal: subtotal,
          total_quantity: totalQuantity,
        },
      };
    }

    if (functionName === 'createCheckoutSession') {
      return {
        data: {
          url: 'https://checkout.stripe.com/mock-session',
          sessionId: 'cs_test_mock',
        },
      };
    }

    try {
      return await originalInvoke.call(base44.functions, functionName, payload);
    } catch {
      return { data: {} };
    }
  };

  const createDummyHandler = entityName => ({
    get(target, prop) {
      if (typeof target[prop] !== 'function') return target[prop];

      return async (...args) => {
        console.log(`[Mock SDK] ${entityName}.${String(prop)}`, args);
        const data = entityMockData[entityName] || [];

        if (prop === 'list') return [...data];
        if (prop === 'filter') return simpleFilter(data, args[0]);
        if (prop === 'get') return data.find(item => item.id === args[0]) || null;

        if (prop === 'create') {
          const newRecord = { id: `mock-${Date.now()}`, ...args[0] };
          data.push(newRecord);
          return newRecord;
        }

        if (prop === 'update') {
          const record = data.find(item => item.id === args[0]);
          if (record) {
            Object.assign(record, args[1]);
            return record;
          }
          return { id: args[0], ...args[1] };
        }

        if (prop === 'delete') return { success: true };
        return null;
      };
    },
  });

  base44.entities = new Proxy(base44.entities || {}, {
    get(target, entityName) {
      if (!target[entityName]) target[entityName] = {};
      return new Proxy(target[entityName], createDummyHandler(entityName));
    },
  });
} else if (!token) {
  base44.auth.me = async () => null;
}
