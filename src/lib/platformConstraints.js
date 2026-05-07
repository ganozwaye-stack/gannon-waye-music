// Platform Constraints — Document limits for Option 1
export const PLATFORM_CONSTRAINTS = {
  MAX_CONCURRENT_ORDERS_PER_USER: 1,
  ORDER_LOCK_DURATION_MINUTES: 5,
  MAX_PRODUCTS: 1000,
  MAX_ORDERS_PER_MINUTE: 10,
  IDEMPOTENCE_LOG_RETENTION_DAYS: 30,
  EMAIL_RETRY_ATTEMPTS: 2,
  TOKEN_REFRESH_THRESHOLD_MINUTES: 5,
  CONCURRENT_INVENTORY_UPDATES: 'OPTIMISTIC_LOCK',
};

/**
 * Document constraints in UI/Admin
 */
export const getConstraintsDisplay = () => {
  return {
    maxConcurrentOrders: PLATFORM_CONSTRAINTS.MAX_CONCURRENT_ORDERS_PER_USER,
    lockDurationSeconds: PLATFORM_CONSTRAINTS.ORDER_LOCK_DURATION_MINUTES * 60,
    maxProducts: PLATFORM_CONSTRAINTS.MAX_PRODUCTS,
    scalingMessage: '✅ Safe for 1-2 concurrent users. Plan infrastructure upgrade for commercial scale.',
  };
};

export default PLATFORM_CONSTRAINTS;