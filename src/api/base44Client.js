import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { STORE_PRODUCTS, toMerchProduct } from '@/config/storeWorldConfig';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// Mock implementations for local dev/testing
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
);

if (isLocal || token === 'mock-admin-token') {
  // 1. Mock Auth
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

  // 2. Mock functions.invoke
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
    } catch (e) {
      return { data: {} };
    }
  };

  // 3. Mock entities
  const mockOrders = [
    { id: 'o1', customer_name: 'Thea Elsworth', customer_email: 'dorotheae@icloud.com', total_amount: 90.48, status: 'cancelled', financial_status: 'duplicate_void', created_date: '2026-06-01T12:00:00Z', items: [{ product_id: 'p1', product_name: 'Tee', price: 90.48, quantity: 1 }] },
    { id: 'o2', customer_name: 'Jane Smith', customer_email: 'jane@example.com', total_amount: 50.00, status: 'confirmed', financial_status: 'paid', created_date: '2026-06-02T12:00:00Z', items: [{ product_id: 'p1', product_name: 'Tee', price: 50.00, quantity: 1 }] },
    { id: 'o3', customer_name: 'John Doe', customer_email: 'john@example.com', total_amount: 120.00, status: 'shipped', financial_status: 'paid', created_date: '2026-06-03T12:00:00Z', items: [{ product_id: 'p2', product_name: 'Hoodie', price: 120.00, quantity: 1 }] },
    { id: 'o4', customer_name: 'Bob Wilson', customer_email: 'bob@example.com', total_amount: 75.00, status: 'pending', financial_status: 'pending', created_date: '2026-06-04T12:00:00Z', items: [{ product_id: 'p3', product_name: 'CD', price: 75.00, quantity: 1 }] }
  ];

  const legacyMockProducts = [
    {
      id: '69f11d1fc43e13c61fe6b9d6',
      name: '"Thank You" CD Single Slim Case',
      sale_price: 10,
      category: 'cd',
      stock_quantity: 50,
      image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/6fbecc91f_THANKYOUOfficialSingleCover.bmp',
      description: 'Official debut single in a slim clear plastic jewel case.',
      is_active: true
    },
    {
      id: '69eed3e64e2da78ae4418a9d',
      name: 'Thank You — Deluxe Signed CD Single',
      sale_price: 20,
      category: 'cd',
      stock_quantity: 40,
      image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/c2a1369c4_1.png',
      description: 'Hand-signed by Gannon Waye. A limited, personal piece of this moment.',
      is_active: true
    },
    {
      id: '69f11d1fc43e13c61fe6b9d7',
      name: '"Respect Is Earned" Hoodie Dark Grey',
      sale_price: 98,
      category: 'apparel',
      stock_quantity: 50,
      sizes_available: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/4454da55f_RespectisEarnedThankyouDarkGreyHoodieFront.png',
      description: 'Premium heavyweight dark grey hoodie. Statement piece.',
      is_active: true
    },
    {
      id: '69eed3e64e2da78ae4418a99',
      name: 'Respect Is Earned Oversized Tee',
      sale_price: 59,
      category: 'apparel',
      stock_quantity: 50,
      sizes_available: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/dbb657925_IMG_17251.JPG',
      description: 'Official debut single artwork on a premium oversized tee.',
      is_active: true
    },
    {
      id: '69fbd261b760426cede1b7a3',
      name: 'Thank You Journal Pen and Thermos Flask Bundle',
      sale_price: 54,
      category: 'bundle',
      stock_quantity: 20,
      image_url: 'https://base44.app/api/apps/69eb7905ca6eb4180010f794/files/mp/public/69eb7905ca6eb4180010f794/e14220834_Bundle.png',
      description: 'Journaling, processing, or needing a safe-space kit — this is it.',
      is_active: true
    },
    {
      id: '69eed3e64e2da78ae4418a9a',
      name: '"Thank You" Tote Bag',
      sale_price: 15,
      category: 'accessories',
      stock_quantity: 0,
      image_url: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/d45dc7100_RespectisEarnedToteBagFront.png',
      description: "Large folding tote bag featuring the official 'Thank You' single cover artwork.",
      is_active: true
    }
  ];

  const mockProducts = STORE_PRODUCTS.length > 0
    ? STORE_PRODUCTS.filter(product => product.is_active).map(toMerchProduct)
    : legacyMockProducts;

  const mockNotifications = [
    { id: 'n1', notification_type: 'order', severity: 'info', title: 'New order #o2', summary: 'Jane Smith placed a new order for Tee', source: 'Stripe Webhook', requires_action: false, is_read: false, created_date: '2026-06-02T12:05:00Z' },
    { id: 'n2', notification_type: 'payment_warning', severity: 'high', title: 'Stripe Webhook Failure', summary: 'Webhook delivery failed for event evt_123', source: 'Stripe Router', requires_action: true, is_read: false, created_date: '2026-06-03T12:05:00Z' }
  ];

  const mockIntegrations = [
    { id: 'i1', platform_name: 'Stripe', setup_status: 'live', credential_status: 'saved', last_checked: '2026-06-04T12:00:00Z' }
  ];

  const mockGanozMixCandidates = [
    {
      id: 'gmx-candidate-magnetic-cable-organiser',
      source_app_id: '69eb857abaebfe9e3df48083',
      source_entity: 'ProductOpportunity',
      source_id: '6a37065a616a405a3c1be0cc',
      title: 'Magnetic Cable Organiser (Bamboo)',
      category: 'desk organisation',
      supplier_name: 'CJ Dropshipping',
      supplier_url: 'https://cjdropshipping.com/',
      cost_price_aud: 8.5,
      shipping_cost_aud: 6,
      landed_cost_aud: 14.5,
      target_price_aud: 39.95,
      estimated_margin_percent: 42.1,
      delivery_time_days: '8-15 days',
      supplier_rating: 4.3,
      problem_solved: 'Tangled cables and a messy desk every morning',
      target_audience: 'Work from home professionals, students, creator desks',
      marketplace: 'EBAY_AU',
      cleanup_status: 'keep',
      approval_status: 'needs_review',
      publish_locked: true,
      return_risk: 'low',
      competition_level: 'medium',
      social_content_potential: 'high',
      hero_potential: 'high',
      notes: 'First proof product. Source estimate only: verify exact supplier SKU, image rights, live stock, eBay fees, postage, returns, and live competition before any listing draft.'
    },
    {
      id: 'gmx-candidate-fridge-bins',
      source_app_id: '69eb857abaebfe9e3df48083',
      source_entity: 'ProductOpportunity',
      source_id: '6a37065a616a405a3c1be0d0',
      title: 'Fridge Organisation Bins Set (6-piece)',
      category: 'home organisation',
      marketplace: 'EBAY_AU',
      cleanup_status: 'maybe',
      approval_status: 'needs_review',
      publish_locked: true,
      return_risk: 'medium',
      competition_level: 'high',
      social_content_potential: 'medium',
      hero_potential: 'low'
    },
    {
      id: 'gmx-candidate-travel-bottles',
      source_app_id: '69eb857abaebfe9e3df48083',
      source_entity: 'ProductOpportunity',
      source_id: '6a37065a616a405a3c1be0cd',
      title: 'Silicone Travel Bottle Set (3-pack)',
      category: 'travel',
      marketplace: 'EBAY_AU',
      cleanup_status: 'maybe',
      approval_status: 'needs_review',
      publish_locked: true,
      return_risk: 'medium',
      competition_level: 'high',
      social_content_potential: 'low',
      hero_potential: 'low'
    }
  ];

  const mockGanozMixStores = [
    {
      id: 'gmx-store-ebay-ganoz1988',
      name: 'eBay - ganoz1988',
      marketplace: 'EBAY_AU',
      seller_username: 'ganoz1988',
      connection_status: 'needs_oauth',
      orders_enabled: false,
      publishing_enabled: false,
      notes: 'Source app shows eBay store, but token/OAuth state requires manual reconnect before any marketplace action.'
    }
  ];

  const mockGanozMixJobs = [
    { id: 'gmx-job-deadletter-summary', job_name: 'Source app job queue audit', status: 'dead_letter', run_mode: 'read_only', summary: '36 source JobQueue records were found, including dead letters. Do not resume jobs without review.' }
  ];

  const mockGanozMixErrors = [
    { id: 'gmx-error-ebay-oauth', error_type: 'eBay OAuth', severity: 'high', summary: 'Source app error logs include invalid token type / eBay 401 failures.', safe_detail: 'Reconnect must be manual and read-only first.', contains_secret: false, status: 'open' }
  ];

  const entityMockData = {
    MerchOrder: mockOrders,
    MerchProduct: mockProducts,
    AdminNotification: mockNotifications,
    ApiIntegrationSetup: mockIntegrations,
    AgentActionProposal: [],
    SystemHealthIssue: [],
    ApprovalQueue: [],
    StoreCustomer: [],
    GanozMixProductCandidate: mockGanozMixCandidates,
    GanozMixSupplier: [],
    GanozMixListingDraft: [],
    GanozMixMarketplaceStore: mockGanozMixStores,
    GanozMixApprovalItem: [],
    GanozMixJobRun: mockGanozMixJobs,
    GanozMixErrorLog: mockGanozMixErrors
  };

  const createDummyHandler = (entityName) => {
    return {
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
              const existing = Array.isArray(data) ? data.find(item => item.id === id) : null;
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
      }
    };
  };

  base44.entities = new Proxy(base44.entities || {}, {
    get(target, entityName) {
      if (!target[entityName]) {
        target[entityName] = {};
      }
      return new Proxy(target[entityName], createDummyHandler(entityName));
    }
  });
} else {
  if (!token) {
    base44.auth.me = async () => null;
  }
}

