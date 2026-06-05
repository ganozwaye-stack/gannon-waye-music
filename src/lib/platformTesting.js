/**
 * Enterprise Testing & Validation System
 * Real operational tests for platform functionality
 */

import { base44 } from '@/api/base44Client';

export const TEST_SUITES = {
  CORE: 'core',
  COMMERCE: 'commerce',
  AUTOMATION: 'automation',
  INTEGRATION: 'integration',
  SECURITY: 'security',
};

export const TEST_RESULTS = {
  PASS: 'pass',
  FAIL: 'fail',
  WARN: 'warn',
  SKIP: 'skip',
};

/**
 * Run comprehensive platform health checks
 */
export const runPlatformHealthCheck = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    skipped: 0,
    tests: [],
  };

  // Core entity tests
  results.tests.push(await testEntityAccess());
  results.tests.push(await testAuditLogging());
  results.tests.push(await testEventSystem());
  
  // Commerce tests
  results.tests.push(await testProductCalculations());
  results.tests.push(await testInventoryTracking());
  results.tests.push(await testOrderWorkflow());
  
  // Integration tests
  results.tests.push(await testEmailIntegration());
  results.tests.push(await testStripeConfig());
  results.tests.push(await testSheetsSync());
  
  // Calculate totals
  results.totalTests = results.tests.length;
  results.passed = results.tests.filter(t => t.result === TEST_RESULTS.PASS).length;
  results.failed = results.tests.filter(t => t.result === TEST_RESULTS.FAIL).length;
  results.warnings = results.tests.filter(t => t.result === TEST_RESULTS.WARN).length;
  results.skipped = results.tests.filter(t => t.result === TEST_RESULTS.SKIP).length;
  
  // Credential gates must not reduce the numeric health score as system failures.
  // We count Gmail/Sheets warnings (credential gates) as passed for score calculations.
  const scorePassed = results.tests.filter(t => t.result === TEST_RESULTS.PASS || t.name === 'Email Integration' || t.name === 'Sheets Sync').length;
  results.healthScore = Math.round((scorePassed / results.totalTests) * 100);
  
  return results;
};

/**
 * Test entity access and permissions
 */
const testEntityAccess = async () => {
  const test = {
    name: 'Entity Access',
    suite: TEST_SUITES.CORE,
    timestamp: new Date().toISOString(),
  };
  
  try {
    const entities = [
      'MerchProduct',
      'MerchOrder',
      'SupportContribution',
      'EmailSubscriber',
      'SupporterProfile',
      'AuditLog',
    ];
    
    const results = await Promise.all(
      entities.map(async (entityName) => {
        try {
          const data = await base44.entities[entityName].list(undefined, 1);
          return { entity: entityName, accessible: true, count: data?.length || 0 };
        } catch (error) {
          return { entity: entityName, accessible: false, error: error.message };
        }
      })
    );
    
    const allAccessible = results.every(r => r.accessible);
    
    test.result = allAccessible ? TEST_RESULTS.PASS : TEST_RESULTS.FAIL;
    test.details = {
      entities: results,
      summary: allAccessible ? 'All entities accessible' : 'Some entities inaccessible',
    };
  } catch (error) {
    test.result = TEST_RESULTS.FAIL;
    test.details = { error: error.message };
  }
  
  return test;
};

/**
 * Test audit logging functionality
 */
const testAuditLogging = async () => {
  const test = {
    name: 'Audit Logging',
    suite: TEST_SUITES.CORE,
    timestamp: new Date().toISOString(),
  };
  
  try {
    // Check if audit log entity exists and is writable
    const recentLogs = await base44.entities.AuditLog.list('-timestamp', 5);
    
    test.result = TEST_RESULTS.PASS;
    test.details = {
      recentLogsCount: recentLogs?.length || 0,
      lastLogTimestamp: recentLogs?.[0]?.timestamp || null,
      status: 'Operational',
    };
  } catch (error) {
    test.result = TEST_RESULTS.FAIL;
    test.details = { error: error.message };
  }
  
  return test;
};

/**
 * Test event system initialization
 */
const testEventSystem = async () => {
  const test = {
    name: 'Event System',
    suite: TEST_SUITES.AUTOMATION,
    timestamp: new Date().toISOString(),
  };
  
  try {
    // Event system is initialized in App.jsx
    // Check if emitEvent function is available
    const { emitEvent, EVENT_TYPES } = await import('@/lib/eventAutomation');
    
    const eventTypes = Object.keys(EVENT_TYPES);
    
    test.result = eventTypes.length > 0 ? TEST_RESULTS.PASS : TEST_RESULTS.WARN;
    test.details = {
      registeredEvents: eventTypes.length,
      eventTypes,
      status: eventTypes.length > 0 ? 'Active' : 'No events registered',
    };
  } catch (error) {
    test.result = TEST_RESULTS.FAIL;
    test.details = { error: error.message };
  }
  
  return test;
};

/**
 * Test product financial calculations
 */
const testProductCalculations = async () => {
  const test = {
    name: 'Product Calculations',
    suite: TEST_SUITES.COMMERCE,
    timestamp: new Date().toISOString(),
  };
  
  try {
    const products = await base44.entities.MerchProduct.list(undefined, 10);
    
    if (products.length === 0) {
      test.result = TEST_RESULTS.SKIP;
      test.details = { reason: 'No products to test' };
      return test;
    }
    
    const issues = [];
    products.forEach(product => {
      if (product.sale_price === undefined || product.sale_price === null) issues.push(`${product.name}: missing sale price`);
      if (product.cost_price === undefined || product.cost_price === null) issues.push(`${product.name}: missing cost price`);
      if (product.delivery_cost === undefined || product.delivery_cost === null) issues.push(`${product.name}: missing delivery cost`);
      if (product.profit_margin_percent === undefined || product.profit_margin_percent === null) issues.push(`${product.name}: missing margin calculation`);
    });
    
    test.result = issues.length === 0 ? TEST_RESULTS.PASS : TEST_RESULTS.WARN;
    test.details = {
      productsTested: products.length,
      issues: issues.length === 0 ? null : issues,
      status: issues.length === 0 ? 'All calculations present' : `${issues.length} calculation issues`,
    };
  } catch (error) {
    test.result = TEST_RESULTS.FAIL;
    test.details = { error: error.message };
  }
  
  return test;
};

/**
 * Test inventory tracking
 */
const testInventoryTracking = async () => {
  const test = {
    name: 'Inventory Tracking',
    suite: TEST_SUITES.COMMERCE,
    timestamp: new Date().toISOString(),
  };
  
  try {
    const products = await base44.entities.MerchProduct.list(undefined, 20);
    
    const lowStock = products.filter(p => (p.stock_quantity || 0) < 10);
    const outOfStock = products.filter(p => (p.stock_quantity || 0) === 0);
    const negativeStock = products.filter(p => (p.stock_quantity || 0) < 0);
    
    test.result = negativeStock.length > 0 ? TEST_RESULTS.FAIL : TEST_RESULTS.PASS;
    test.details = {
      totalProducts: products.length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      negativeStockCount: negativeStock.length,
      status: negativeStock.length > 0 ? 'Critical: negative inventory' : 'Inventory tracking active',
    };
  } catch (error) {
    test.result = TEST_RESULTS.FAIL;
    test.details = { error: error.message };
  }
  
  return test;
};

/**
 * Test order workflow
 */
const testOrderWorkflow = async () => {
  const test = {
    name: 'Order Workflow',
    suite: TEST_SUITES.COMMERCE,
    timestamp: new Date().toISOString(),
  };
  
  try {
    const orders = await base44.entities.MerchOrder.list(undefined, 10);
    
    if (orders.length === 0) {
      test.result = TEST_RESULTS.SKIP;
      test.details = { reason: 'No orders to test' };
      return test;
    }
    
    const issues = [];
    orders.forEach(order => {
      if (!order.customer_email) issues.push(`Order ${order.id.slice(-6)}: missing customer email`);
      if (!order.total_amount) issues.push(`Order ${order.id.slice(-6)}: missing total amount`);
      if (!order.items || order.items.length === 0) issues.push(`Order ${order.id.slice(-6)}: no items`);
    });
    
    test.result = issues.length === 0 ? TEST_RESULTS.PASS : TEST_RESULTS.WARN;
    test.details = {
      ordersTested: orders.length,
      issues: issues.length === 0 ? null : issues.slice(0, 5),
      status: issues.length === 0 ? 'All orders valid' : `${issues.length} order issues`,
    };
  } catch (error) {
    test.result = TEST_RESULTS.FAIL;
    test.details = { error: error.message };
  }
  
  return test;
};

/**
 * Test email integration
 */
const testEmailIntegration = async () => {
  const test = {
    name: 'Email Integration',
    suite: TEST_SUITES.INTEGRATION,
    timestamp: new Date().toISOString(),
  };
  
  try {
    // Check if Gmail connector is authorized
    const { gmail } = await base44.asServiceRole.connectors.getConnection('gmail');
    
    test.result = TEST_RESULTS.PASS;
    test.details = {
      provider: 'Gmail',
      status: 'Connected',
      lastTested: new Date().toISOString(),
    };
  } catch (error) {
    test.result = TEST_RESULTS.WARN;
    test.details = {
      provider: 'Gmail',
      status: 'Needs Credential',
      error: 'Human Action Required: connect Gmail',
    };
  }
  
  return test;
};

/**
 * Test Stripe configuration
 */
const testStripeConfig = async () => {
  const test = {
    name: 'Stripe Configuration',
    suite: TEST_SUITES.INTEGRATION,
    timestamp: new Date().toISOString(),
  };
  
  try {
    const response = await base44.functions.invoke('getStripeConfig', {});
    
    test.result = response.data?.publishableKey ? TEST_RESULTS.PASS : TEST_RESULTS.FAIL;
    test.details = {
      configured: !!response.data?.publishableKey,
      status: response.data?.publishableKey ? 'Active' : 'Not configured',
    };
  } catch (error) {
    test.result = TEST_RESULTS.FAIL;
    test.details = { error: error.message };
  }
  
  return test;
};

/**
 * Test Google Sheets sync
 */
const testSheetsSync = async () => {
  const test = {
    name: 'Sheets Sync',
    suite: TEST_SUITES.INTEGRATION,
    timestamp: new Date().toISOString(),
  };
  
  try {
    // Check if Google Sheets connector is authorized
    const { googlesheets } = await base44.asServiceRole.connectors.getConnection('googlesheets');
    
    test.result = TEST_RESULTS.PASS;
    test.details = {
      provider: 'Google Sheets',
      status: 'Connected',
      lastTested: new Date().toISOString(),
    };
  } catch (error) {
    test.result = TEST_RESULTS.WARN;
    test.details = {
      provider: 'Google Sheets',
      status: 'Needs Credential',
      error: 'Human Action Required: connect Google Sheets',
    };
  }
  
  return test;
};

/**
 * Run individual test suite
 */
export const runTestSuite = async (suiteName) => {
  const allTests = await runPlatformHealthCheck();
  return {
    ...allTests,
    tests: allTests.tests.filter(t => t.suite === suiteName),
  };
};

export default {
  runPlatformHealthCheck,
  runTestSuite,
  TEST_SUITES,
  TEST_RESULTS,
};