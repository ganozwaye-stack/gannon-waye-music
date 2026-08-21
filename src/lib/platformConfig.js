/**
 * Centralized Platform Configuration
 * Single source of truth for all constants, rates, and business rules
 */

// Financial Constants
export const FINANCIAL_CONFIG = {
  GST_RATE: 0.10, // 10% Australian GST
  MERCHANT_FEE_RATE: 0.05, // 5% service & processing
  DEFAULT_MERCHANT_FEE_PERCENT: 3.5, // Stripe/PayPal default
  CHARITY_DONATION_RATE: 0.10, // 10% to 1800RESPECT
};

// Inventory Configuration
export const INVENTORY_CONFIG = {
  LOW_STOCK_THRESHOLD: 10,
  OUT_OF_STOCK_THRESHOLD: 0,
  REORDER_POINT: 15,
  ENABLE_VARIANTS: false, // Post-launch feature
  ENABLE_SKU: false, // Post-launch feature
};

// Customer Tiers
export const CUSTOMER_TIERS = {
  DAY_ONE: { name: 'day_one', minLTV: 0, badge: 'day_one' },
  WITH_YOU: { name: 'with_you', minLTV: 50, badge: 'supporter' },
  MOVEMENT: { name: 'movement', minLTV: 200, badge: 'top_supporter' },
  INNER_CIRCLE: { name: 'inner_circle', minLTV: 500, badge: 'inner_circle' },
};

// Engagement Scoring
export const ENGAGEMENT_CONFIG = {
  SCORES: {
    purchase: 5, // per $10 spent
    donation: 5, // per donation
    signup: 10,
    social_follow: 5,
    content_share: 15,
    fan_post: 10,
  },
  TIERS: {
    casual: { min: 0, label: 'Casual Fan' },
    engaged: { min: 30, label: 'Engaged Supporter' },
    dedicated: { min: 60, label: 'Dedicated Fan' },
    vip: { min: 80, label: 'VIP Supporter' },
  },
};

// Email Configuration
export const EMAIL_CONFIG = {
  FROM_NAME: 'Gannon Waye',
  FROM_EMAIL: 'hello@gannonwaye.com',
  SUPPORT_EMAIL: 'hello@gannonwaye.com',
};

// Shipping Configuration
export const SHIPPING_CONFIG = {
  DOMESTIC_BASE: 12.95,
  INTERNATIONAL_BASE: 29.95,
  FREE_SHIPPING_THRESHOLD: 150,
};

// Campaign Configuration
export const CAMPAIGN_CONFIG = {
  GIFT_REQUIREMENTS: {
    TIKTOK_FOLLOW: true,
    INSTAGRAM_FOLLOW: true,
    POST_ENGAGEMENT: true,
    SCREENSHOT_REQUIRED: true,
  },
  BIRTHDAY_DISCOUNT: {
    ENABLED: true,
    DISCOUNT_PERCENT: 20,
    DAYS_BEFORE: 7,
    VALID_DAYS: 14,
  },
  LAUNCH_PROMO: {
    CODE: 'LAUNCH15',
    DISCOUNT_PERCENT: 15,
    MAX_USES: 20,
  },
};

// Legal & Compliance
export const LEGAL_CONFIG = {
  REFUND_POLICY_DAYS: 30,
  PRIVACY_POLICY_URL: '/privacy-policy',
  TERMS_OF_SERVICE_URL: '/terms-of-service',
  // IMPORTANT: Do NOT claim tax deductibility unless verified through DGR structure
  DONATION_DISCLAIMER: '10% of all support received is donated to 1800RESPECT. This is not a tax-deductible donation.',
  GST_REGISTERED: true,
  ABN: null, // Add when registered
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ADVANCED_INVENTORY: false, // Post-launch
  ENABLE_VARIANTS: false, // Post-launch
  ENABLE_REFUNDS: false, // Post-launch
  ENABLE_CUSTOMER_PORTAL: false, // Post-launch
  ENABLE_ROLE_BASED_ACCESS: false, // Post-launch
  ENABLE_E2E_TESTING: false, // Post-launch
  COACHING_PUBLIC_LAUNCH_ENABLED: false, // Private until legal review and final approval
};

// Audit Configuration
export const AUDIT_CONFIG = {
  ENABLED: true,
  RETENTION_DAYS: 730, // 2 years
  TRACK_FINANCIAL_CHANGES: true,
  TRACK_INVENTORY_CHANGES: true,
  TRACK_PERMISSION_CHANGES: true,
  ENABLE_ROLLBACK: true,
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  ADMIN_EMAIL_ON_ORDER: true,
  ADMIN_EMAIL_ON_LOW_STOCK: true,
  ADMIN_EMAIL_ON_PAYMENT_FAILURE: true,
  CUSTOMER_EMAIL_ON_ORDER: true,
  CUSTOMER_EMAIL_ON_SHIPMENT: true,
  CUSTOMER_EMAIL_ON_RECEIPT: true,
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  ENABLE_ATTRIBUTION: true,
  ENABLE_COHORTS: true,
  ENABLE_LTV_FORECASTING: true,
  ENABLE_INVENTORY_FORECASTING: false, // Post-launch
};

// Media Configuration
export const MEDIA_CONFIG = {
  MAX_UPLOAD_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ENABLE_OPTIMIZATION: true,
  ENABLE_DUPLICATE_DETECTION: false, // Post-launch
  THUMBNAIL_SIZES: [200, 400, 800],
};

export default {
  FINANCIAL_CONFIG,
  INVENTORY_CONFIG,
  CUSTOMER_TIERS,
  ENGAGEMENT_CONFIG,
  EMAIL_CONFIG,
  SHIPPING_CONFIG,
  CAMPAIGN_CONFIG,
  LEGAL_CONFIG,
  FEATURE_FLAGS,
  AUDIT_CONFIG,
  NOTIFICATION_CONFIG,
  ANALYTICS_CONFIG,
  MEDIA_CONFIG,
};