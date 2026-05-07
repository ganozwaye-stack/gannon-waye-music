import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Automated health check & testing system
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const checks = {
      entities: {},
      functions: {},
      connections: {},
      timestamp: new Date().toISOString(),
    };

    // Entity checks
    try {
      const subscribers = await base44.entities.EmailSubscriber.list();
      checks.entities.subscribers = { status: 'ok', count: subscribers.length };
    } catch (e) {
      checks.entities.subscribers = { status: 'error', message: e.message };
    }

    try {
      const products = await base44.entities.MerchProduct.list();
      checks.entities.products = { status: 'ok', count: products.length };
    } catch (e) {
      checks.entities.products = { status: 'error', message: e.message };
    }

    try {
      const orders = await base44.entities.MerchOrder.list();
      checks.entities.orders = { status: 'ok', count: orders.length };
    } catch (e) {
      checks.entities.orders = { status: 'error', message: e.message };
    }

    try {
      const contributions = await base44.entities.SupportContribution.list();
      checks.entities.contributions = { status: 'ok', count: contributions.length };
    } catch (e) {
      checks.entities.contributions = { status: 'error', message: e.message };
    }

    try {
      const trackers = await base44.entities.GiftRequirementTracker.list();
      checks.entities.trackers = { status: 'ok', count: trackers.length };
    } catch (e) {
      checks.entities.trackers = { status: 'error', message: e.message };
    }

    try {
      const promoCodes = await base44.entities.PromoCode.list();
      checks.entities.promoCodes = { status: 'ok', count: promoCodes.length };
    } catch (e) {
      checks.entities.promoCodes = { status: 'error', message: e.message };
    }

    // Function checks
    try {
      const shippingRate = await base44.functions.invoke('calculateShippingRate', {
        destination: 'au',
        weight: 0.5,
        shipping_type: 'standard',
      });
      checks.functions.calculateShippingRate = { status: shippingRate.cost ? 'ok' : 'error' };
    } catch (e) {
      checks.functions.calculateShippingRate = { status: 'error', message: e.message };
    }

    try {
      const promoValidation = await base44.functions.invoke('validatePromoCode', {
        code: 'TEST',
      });
      checks.functions.validatePromoCode = { status: 'ok' };
    } catch (e) {
      checks.functions.validatePromoCode = { status: 'error', message: e.message };
    }

    // Calculate overall health
    const allChecks = [...Object.values(checks.entities), ...Object.values(checks.functions)];
    const failedChecks = allChecks.filter(c => c.status === 'error').length;
    const healthScore = ((allChecks.length - failedChecks) / allChecks.length) * 100;

    checks.health = {
      score: Math.round(healthScore),
      status: healthScore === 100 ? 'healthy' : healthScore >= 80 ? 'warning' : 'critical',
      timestamp: new Date().toISOString(),
    };

    return Response.json(checks);
  } catch (error) {
    return Response.json(
      {
        error: error.message,
        status: 'critical',
      },
      { status: 500 }
    );
  }
});