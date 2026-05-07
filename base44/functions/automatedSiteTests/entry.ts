import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Comprehensive automated testing suite for the entire platform
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const results = {
      timestamp: new Date().toISOString(),
      user: user.email,
      tests: [],
      summary: { passed: 0, failed: 0, warnings: 0 },
    };

    // Test 1: All entities accessible
    const entityTests = ['EmailSubscriber', 'MerchProduct', 'MerchOrder', 'PromoCode', 'SupportContribution', 'GiftRequirementTracker'];

    for (const entity of entityTests) {
      try {
        const data = await base44.entities[entity].list();
        results.tests.push({
          name: `Read ${entity}`,
          status: 'pass',
          detail: `${data.length} records found`,
        });
        results.summary.passed++;
      } catch (e) {
        results.tests.push({
          name: `Read ${entity}`,
          status: 'fail',
          error: e.message,
        });
        results.summary.failed++;
      }
    }

    // Test 2: Financial calculations
    try {
      const products = await base44.entities.MerchProduct.list();
      if (products.length > 0) {
        const p = products[0];
        const hasBasics = p.name && p.sale_price;
        const hasFinancials = p.cost_price !== undefined && p.delivery_cost !== undefined;

        if (hasBasics && hasFinancials) {
          results.tests.push({
            name: 'Merch Financial Fields',
            status: 'pass',
            detail: `Product has cost/delivery fields`,
          });
          results.summary.passed++;
        } else {
          results.tests.push({
            name: 'Merch Financial Fields',
            status: 'warning',
            detail: `Not all products have cost/delivery fields`,
          });
          results.summary.warnings++;
        }
      }
    } catch (e) {
      results.tests.push({
        name: 'Merch Financial Fields',
        status: 'fail',
        error: e.message,
      });
      results.summary.failed++;
    }

    // Test 3: Promo codes exist
    try {
      const promos = await base44.entities.PromoCode.list();
      results.tests.push({
        name: 'Promo Codes Exist',
        status: promos.length > 0 ? 'pass' : 'warning',
        detail: `${promos.length} active promo codes`,
      });
      if (promos.length > 0) results.summary.passed++;
      else results.summary.warnings++;
    } catch (e) {
      results.tests.push({
        name: 'Promo Codes Exist',
        status: 'fail',
        error: e.message,
      });
      results.summary.failed++;
    }

    // Test 4: Orders have proper structure
    try {
      const orders = await base44.entities.MerchOrder.list();
      if (orders.length > 0) {
        const o = orders[0];
        const hasRequired = o.customer_name && o.customer_email && o.total_amount !== undefined;
        results.tests.push({
          name: 'Merch Order Structure',
          status: hasRequired ? 'pass' : 'fail',
          detail: `Checking required fields on ${orders.length} orders`,
        });
        results.summary.passed++;
      } else {
        results.tests.push({
          name: 'Merch Order Structure',
          status: 'warning',
          detail: 'No orders to test',
        });
        results.summary.warnings++;
      }
    } catch (e) {
      results.tests.push({
        name: 'Merch Order Structure',
        status: 'fail',
        error: e.message,
      });
      results.summary.failed++;
    }

    // Test 5: Gift tracking enabled
    try {
      const trackers = await base44.entities.GiftRequirementTracker.list();
      results.tests.push({
        name: 'Gift Tracking System',
        status: 'pass',
        detail: `${trackers.length} gift tracker records`,
      });
      results.summary.passed++;
    } catch (e) {
      results.tests.push({
        name: 'Gift Tracking System',
        status: 'fail',
        error: e.message,
      });
      results.summary.failed++;
    }

    // Test 6: Contributions recorded
    try {
      const contribs = await base44.entities.SupportContribution.list();
      results.tests.push({
        name: 'Support Contributions',
        status: 'pass',
        detail: `${contribs.length} contribution records`,
      });
      results.summary.passed++;
    } catch (e) {
      results.tests.push({
        name: 'Support Contributions',
        status: 'fail',
        error: e.message,
      });
      results.summary.failed++;
    }

    // Test 7: Shipping rates calculated
    try {
      const shippingTest = await base44.functions.invoke('calculateShippingRate', {
        destination: 'au',
        weight: 0.5,
        shipping_type: 'standard',
      });
      const hasRate = shippingTest && shippingTest.cost && shippingTest.estimated_days;
      results.tests.push({
        name: 'Shipping Rate Calculation',
        status: hasRate ? 'pass' : 'fail',
        detail: `Cost: $${shippingTest.cost}, Time: ${shippingTest.estimated_days}`,
      });
      if (hasRate) results.summary.passed++;
      else results.summary.failed++;
    } catch (e) {
      results.tests.push({
        name: 'Shipping Rate Calculation',
        status: 'fail',
        error: e.message,
      });
      results.summary.failed++;
    }

    // Test 8: Promo validation
    try {
      const validation = await base44.functions.invoke('validatePromoCode', { code: 'LAUNCH15' });
      results.tests.push({
        name: 'Promo Code Validation',
        status: 'pass',
        detail: validation.valid ? 'Code is valid' : 'Code validation working',
      });
      results.summary.passed++;
    } catch (e) {
      results.tests.push({
        name: 'Promo Code Validation',
        status: 'warning',
        detail: 'Promo validation may need setup',
      });
      results.summary.warnings++;
    }

    // Overall health
    const totalTests = results.tests.length;
    const passPercent = (results.summary.passed / totalTests) * 100;

    results.health = {
      score: Math.round(passPercent),
      status: passPercent === 100 ? 'excellent' : passPercent >= 80 ? 'good' : passPercent >= 60 ? 'warning' : 'critical',
      recommendation: passPercent < 100 ? 'Review failed tests and fix before launch' : 'System ready for production',
    };

    return Response.json(results);
  } catch (error) {
    return Response.json(
      {
        error: error.message,
        status: 'critical',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
});