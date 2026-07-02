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

  const originalInvoke = base44.functions.invoke;
  base44.functions.invoke = async (functionName, payload) => {
    console.log(`[Mock SDK] Invoke function: ${functionName}`, payload);
    if (functionName === 'validatePromoCode') {
      const code = payload?.code;
      if (code === 'F20UN26DVIP') {
        return { data: { valid: true, code: 'F20UN26DVIP', discount_percent: 20 } };
      }
      if (code === 'F30MOM26A') {
        return { data: { valid: true, code: 'F30MOM26A', discount_percent: 30 } };
      }
      return { data: { valid: false, reason: 'Invalid code' } };
    }
    if (functionName === 'createCheckoutSession') {
      return { data: { url: 'https://checkout.stripe.com/mock-session' } };
    }
    try {
      return await originalInvoke.call(base44.functions, functionName, payload);
    } catch {
      return { data: {} };
    }
  };

  const mockOrders = [
    { id: 'o1', customer_name: 'Thea Elsworth', customer_email: 'dorotheae@icloud.com', total_amount: 90.48, status: 'cancelled', financial_status: 'duplicate_void', created_date: '2026-06-01T12:00:00Z', items: [{ product_id: 'p1', product_name: 'Tee', price: 90.48, quantity: 1 }] },
    { id: 'o2', customer_name: 'Jane Smith', customer_email: 'jane@example.com', total_amount: 50.00, status: 'confirmed', financial_status: 'paid', created_date: '2026-06-02T12:00:00Z', items: [{ product_id: 'p1', product_name: 'Tee', price: 50.00, quantity: 1 }] },
    { id: 'o3', customer_name: 'John Doe', customer_email: 'john@example.com', total_amount: 120.00, status: 'shipped', financial_status: 'paid', created_date: '2026-06-03T12:00:00Z', items: [{ product_id: 'p2', product_name: 'Hoodie', price: 120.00, quantity: 1 }] },
    { id: 'o4', customer_name: 'Bob Wilson', customer_email: 'bob@example.com', total_amount: 75.00, status: 'pending', financial_status: 'pending', created_date: '2026-06-04T12:00:00Z', items: [{ product_id: 'p3', product_name: 'CD', price: 75.00, quantity: 1 }] },
  ];

  const mockProducts = [
    {
      id: '69f11d1fc43e13c61fe6b9d6',
      name: 'Thankyou CD Single',
      sale_price: 10,
      category: 'cd',
      stock_quantity: 0,
      price_note: 'Sold Out',
      image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6fbecc91f_THANKYOUOfficialSingleCover.bmp',
      description: 'Official Thankyou CD single in a slim clear case.',
      is_active: true,
      promo_eligible: false,
      discount_excluded: true,
      exclude_from_discounts: true,
      discount_lock_reason: 'CDs are excluded from discounts.',
    },
    {
      id: '69eed3e64e2da78ae4418a9d',
      name: 'Thankyou Deluxe Signed CD Single',
      sale_price: 20,
      category: 'cd',
      stock_quantity: 0,
      price_note: 'Sold Out',
      image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c2a1369c4_1.png',
      description: 'Hand-signed by Gannon Waye. A limited, personal piece of this moment.',
      is_active: true,
      promo_eligible: false,
      discount_excluded: true,
      exclude_from_discounts: true,
      discount_lock_reason: 'CDs are excluded from discounts.',
    },
    {
      id: '69f11d1fc43e13c61fe6b9d7',
      name: 'Thankyou "Respect Is Earned" Oversized Hoodie - Dark Grey',
      sale_price: 89,
      category: 'apparel',
      stock_quantity: 16,
      price_note: '$89 plus postage',
      sizes_available: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
      description: 'Premium dark grey oversized hoodie from the Thankyou collection.',
      is_active: true,
      promo_eligible: true,
    },
    {
      id: '69eed3e64e2da78ae4418a99',
      name: 'Thankyou "Respect Is Earned" Oversized Tee',
      sale_price: 59,
      category: 'apparel',
      stock_quantity: 20,
      price_note: '$59 plus postage',
      sizes_available: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dbb657925_IMG_17251.JPG',
      description: 'Premium oversized tee from the Thankyou collection.',
      is_active: true,
      promo_eligible: true,
    },
    {
      id: '6a16abb0198d4c5d294edc11',
      name: 'Thankyou "Respect Is Earned" Coffee Mug',
      sale_price: 9.9,
      category: 'drinkware',
      stock_quantity: 30,
      price_note: '$9.90 plus postage',
      image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d1e8a7822_MugFront.png',
      description: 'Coffee mug with the Respect Is Earned Thankyou artwork.',
      is_active: true,
      promo_eligible: true,
    },
    {
      id: '69fbd261b760426cede1b7a3',
      name: 'Thankyou Journal, Pen and Thermos Flask Bundle',
      sale_price: 59,
      category: 'bundle',
      stock_quantity: 20,
      price_note: '$59 plus postage',
      image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/e14220834_Bundle.png',
      description: 'For journaling, processing and building a safe space. This kit brings the essentials together.',
      is_active: true,
      is_featured: true,
      bundle_includes: ['Journal', 'Pen', 'Thermos Flask'],
      promo_eligible: false,
      discount_excluded: true,
      exclude_from_discounts: true,
      discount_lock_reason: 'Limited bundles are excluded from promo discounts.',
    },
    {
      id: 'winter-warmer-bundle-2026',
      name: 'Winter Warmer Bundle',
      sale_price: 129,
      category: 'bundle',
      stock_quantity: 12,
      price_note: '$129 plus postage',
      image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/e14220834_Bundle.png',
      description: 'Includes the hoodie plus the journal, pen and thermos flask bundle.',
      is_active: true,
      is_featured: true,
      bundle_includes: [
        'Thankyou "Respect Is Earned" Oversized Hoodie - Dark Grey',
        'Thankyou Journal, Pen and Thermos Flask Bundle',
      ],
      promo_eligible: false,
      discount_excluded: true,
      exclude_from_discounts: true,
      discount_lock_reason: 'Limited bundles are excluded from promo discounts.',
    },
    {
      id: '69eed3e64e2da78ae4418a9a',
      name: 'Thankyou Tote Bag',
      sale_price: 15,
      category: 'accessories',
      stock_quantity: 0,
      price_note: 'Sold Out',
      image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png',
      description: 'Limited series tote bag featuring the official Thankyou artwork.',
      is_active: true,
      promo_eligible: true,
    },
    {
      id: '6a2d595ef7bb7ff53258cdfe',
      name: 'Respect Is Earned: Assorted Wall Poster Pricing from $19',
      sale_price: 19,
      category: 'poster',
      stock_quantity: 100,
      price_note: 'A4, A3, A2 and A1 — from $19',
      sizes_available: ['A4 — $19', 'A3 — $29', 'A2 — $39', 'A1 — $59'],
      image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/a54656262_5e2e49fe-b4c2-448f-9390-35847282f185.png',
      images_array: [
        'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/a54656262_5e2e49fe-b4c2-448f-9390-35847282f185.png',
        'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/5eadb61eb_3cc92327-85e8-4975-9798-8ab605e3fea5.png',
        'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/f20e4dc31_d76efdba-9035-43ee-b021-a6110ccc3c91.png',
      ],
      description: 'Premium lyric wall art. Available in A4, A3, A2 and A1.',
      is_active: true,
      promo_eligible: true,
    },
  ];

  const mockNotifications = [
    { id: 'n1', notification_type: 'order', severity: 'info', title: 'New order #o2', summary: 'Jane Smith placed a new order for Tee', source: 'Stripe Webhook', requires_action: false, is_read: false, created_date: '2026-06-02T12:05:00Z' },
    { id: 'n2', notification_type: 'payment_warning', severity: 'high', title: 'Stripe Webhook Failure', summary: 'Webhook delivery failed for event evt_123', source: 'Stripe Router', requires_action: true, is_read: false, created_date: '2026-06-03T12:05:00Z' },
  ];

  const mockIntegrations = [
    { id: 'i1', platform_name: 'Stripe', setup_status: 'live', credential_status: 'saved', last_checked: '2026-06-04T12:00:00Z' },
  ];

  const entityMockData = {
    MerchOrder: mockOrders,
    MerchProduct: mockProducts,
    AdminNotification: mockNotifications,
    ApiIntegrationSetup: mockIntegrations,
    AgentActionProposal: [],
    SystemHealthIssue: [],
    ApprovalQueue: [],
    ActionItem: [],
    SystemsManagerLead: [],
    StoreCustomer: [],
  };

  const createDummyHandler = (entityName) => ({
    get(target, prop) {
      if (typeof target[prop] === 'function') {
        return async (...args) => {
          console.log(`[Mock SDK] ${entityName}.${prop}`, args);
          const data = entityMockData[entityName] || [];
          if (prop === 'list' || prop === 'filter') {
            return data;
          }
          if (prop === 'create') {
            const newObj = { id: `mock-${Date.now()}`, ...args[0] };
            if (Array.isArray(data)) data.push(newObj);
            return newObj;
          }
          if (prop === 'update') {
            const id = args[0];
            const updates = args[1];
            const existing = Array.isArray(data) ? data.find((item) => item.id === id) : null;
            if (existing) {
              Object.assign(existing, updates);
              return existing;
            }
            return { id, ...updates };
          }
          if (prop === 'delete') {
            return { success: true };
          }
          return null;
        };
      }
      return target[prop];
    },
  });

  base44.entities = new Proxy(base44.entities || {}, {
    get(target, entityName) {
      if (!target[entityName]) {
        target[entityName] = {};
      }
      return new Proxy(target[entityName], createDummyHandler(entityName));
    },
  });
} else if (!token) {
  base44.auth.me = async () => null;
}
