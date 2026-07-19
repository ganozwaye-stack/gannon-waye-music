import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { LIVE_RETAIL_PRODUCTS } from '@/lib/liveRetailProducts';

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

  base44.integrations = base44.integrations || {};
  base44.integrations.Core = base44.integrations.Core || {};
  base44.integrations.Core.UploadFile = base44.integrations.Core.UploadFile || (async ({ file }) => ({
    file_url: file ? `local-preview-upload://${file.name}` : '',
    file_name: file?.name || ''
  }));

  // 3. Mock entities
  const mockOrders = [
    { id: 'o1', customer_name: 'Thea Elsworth', customer_email: 'dorotheae@icloud.com', total_amount: 90.48, status: 'cancelled', financial_status: 'duplicate_void', created_date: '2026-06-01T12:00:00Z', items: [{ product_id: 'p1', product_name: 'Tee', price: 90.48, quantity: 1 }] },
    { id: 'o2', customer_name: 'Jane Smith', customer_email: 'jane@example.com', total_amount: 50.00, status: 'confirmed', financial_status: 'paid', created_date: '2026-06-02T12:00:00Z', items: [{ product_id: 'p1', product_name: 'Tee', price: 50.00, quantity: 1 }] },
    { id: 'o3', customer_name: 'John Doe', customer_email: 'john@example.com', total_amount: 120.00, status: 'shipped', financial_status: 'paid', created_date: '2026-06-03T12:00:00Z', items: [{ product_id: 'p2', product_name: 'Hoodie', price: 120.00, quantity: 1 }] },
    { id: 'o4', customer_name: 'Bob Wilson', customer_email: 'bob@example.com', total_amount: 75.00, status: 'pending', financial_status: 'pending', created_date: '2026-06-04T12:00:00Z', items: [{ product_id: 'p3', product_name: 'CD', price: 75.00, quantity: 1 }] },
  ];

  const mockProducts = LIVE_RETAIL_PRODUCTS.map((product) => ({ ...product }));

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
    VideoIntakeItem: [],
    EditingPreset: [
      { id: 'preset-raw-truth', preset_key: 'raw_truth', display_name: 'Raw Truth', status: 'active' },
      { id: 'preset-black-gold-merch', preset_key: 'black_gold_merch', display_name: 'Black Gold Merch', status: 'active' },
      { id: 'preset-memorial-garden', preset_key: 'memorial_garden', display_name: 'Memorial Garden', status: 'active' },
      { id: 'preset-release-energy', preset_key: 'release_energy', display_name: 'Release Energy', status: 'active' },
    ],
    ActionItem: [],
    SystemsManagerLead: [],
    StoreCustomer: [],
    SoniaMemorySubmission: []
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
