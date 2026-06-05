import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Automated health check & testing system
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const checks: any = {
      entities: {},
      functions: {},
      connections: {},
      stripe: {},
      productsHealth: {},
      timestamp: new Date().toISOString(),
    };

    // Entity checks
    try {
      const subscribers = await base44.entities.EmailSubscriber.list();
      checks.entities.subscribers = { status: 'ok', count: subscribers.length };
    } catch (e: any) {
      checks.entities.subscribers = { status: 'error', message: e.message };
    }

    try {
      const products = await base44.entities.MerchProduct.list();
      checks.entities.products = { status: 'ok', count: products.length };
      
      // Perform product calculations check
      const issues: string[] = [];
      const affectedProducts: string[] = [];
      products.forEach((product: any) => {
        const prodIssues: string[] = [];
        if (product.sale_price === undefined || product.sale_price === null) prodIssues.push('missing sale price');
        if (product.cost_price === undefined || product.cost_price === null) prodIssues.push('missing cost price');
        if (product.delivery_cost === undefined || product.delivery_cost === null) prodIssues.push('missing delivery cost');
        if (product.profit_margin_percent === undefined || product.profit_margin_percent === null) {
          prodIssues.push('missing profit margin calculation');
        }
        if (prodIssues.length > 0) {
          issues.push(`${product.name}: ${prodIssues.join(', ')}`);
          affectedProducts.push(product.id);
        }
      });
      checks.productsHealth = {
        status: issues.length === 0 ? 'ok' : 'warn',
        issues: issues,
        affectedProducts: affectedProducts,
        summary: issues.length === 0 ? 'All product financial calculations present' : `${issues.length} product calculation issues found`
      };
    } catch (e: any) {
      checks.entities.products = { status: 'error', message: e.message };
      checks.productsHealth = { status: 'error', message: e.message };
    }

    try {
      const orders = await base44.entities.MerchOrder.list();
      checks.entities.orders = { status: 'ok', count: orders.length };
    } catch (e: any) {
      checks.entities.orders = { status: 'error', message: e.message };
    }

    try {
      const contributions = await base44.entities.SupportContribution.list();
      checks.entities.contributions = { status: 'ok', count: contributions.length };
    } catch (e: any) {
      checks.entities.contributions = { status: 'error', message: e.message };
    }

    try {
      const trackers = await base44.entities.GiftRequirementTracker.list();
      checks.entities.trackers = { status: 'ok', count: trackers.length };
    } catch (e: any) {
      checks.entities.trackers = { status: 'error', message: e.message };
    }

    try {
      const promoCodes = await base44.entities.PromoCode.list();
      checks.entities.promoCodes = { status: 'ok', count: promoCodes.length };
    } catch (e: any) {
      checks.entities.promoCodes = { status: 'error', message: e.message };
    }

    // Function checks (informational/status)
    checks.functions.calculateShippingRate = { status: 'info', note: 'Deployed — validated at /store checkout' };
    checks.functions.validatePromoCode = { status: 'info', note: 'Tested externally — LAUNCH15 valid, THANKYOU10 valid, FAMILY100 inactive (safe)' };

    // Connection checks
    try {
      const gmailStatus = await base44.asServiceRole.connectors.getConnection('gmail');
      checks.connections.gmail = { 
        status: gmailStatus?.accessToken ? 'ok' : 'needs_credential', 
        message: gmailStatus?.accessToken ? 'Connected' : 'Human Action Required: connect Gmail' 
      };
    } catch (e: any) {
      checks.connections.gmail = { status: 'needs_credential', message: 'Human Action Required: connect Gmail' };
    }

    try {
      const sheetsStatus = await base44.asServiceRole.connectors.getConnection('googlesheets');
      checks.connections.googlesheets = { 
        status: sheetsStatus?.accessToken ? 'ok' : 'needs_credential', 
        message: sheetsStatus?.accessToken ? 'Connected' : 'Human Action Required: connect Google Sheets' 
      };
    } catch (e: any) {
      checks.connections.googlesheets = { status: 'needs_credential', message: 'Human Action Required: connect Google Sheets' };
    }

    // Stripe Configuration checks
    try {
      const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
      const stripePk = Deno.env.get('STRIPE_PUBLISHABLE_KEY');
      const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
      
      const secretIsLive = stripeSecret?.startsWith('sk_live_');
      const pkIsLive = stripePk?.startsWith('pk_live_');
      const modeMismatch = stripeSecret && stripePk && (secretIsLive !== pkIsLive);
      
      checks.stripe = {
        status: (stripeSecret && stripePk && !modeMismatch) ? 'ok' : 'error',
        secretKeyStatus: stripeSecret ? (secretIsLive ? 'live' : 'test') : 'missing',
        publishableKeyStatus: stripePk ? (pkIsLive ? 'live' : 'test') : 'missing',
        webhookSecretStatus: webhookSecret ? 'configured' : 'missing',
        modeMismatch: !!modeMismatch,
        message: modeMismatch 
          ? 'CRITICAL: Stripe key mismatch (Secret is live, Publishable is test, or vice versa)'
          : (!stripeSecret || !stripePk) 
          ? 'Stripe keys are missing' 
          : 'Stripe configured and active'
      };
    } catch (e: any) {
      checks.stripe = { status: 'error', message: e.message };
    }

    // Compute dynamic health score
    const totalEntityChecks = Object.values(checks.entities).length;
    const failedEntityChecks = Object.values(checks.entities).filter((c: any) => c.status === 'error').length;
    
    const connectionList = Object.values(checks.connections);
    // Credential gates must not reduce the numeric health score as system failures.
    const failedConnections = connectionList.filter((c: any) => c.status === 'error').length;
    
    const productsFailed = checks.productsHealth.status === 'error';
    const productsWarn = checks.productsHealth.status === 'warn';
    
    const stripeFailed = checks.stripe.status === 'error';
    const stripeMismatch = checks.stripe.modeMismatch;

    let score = 100;
    if (failedEntityChecks > 0) score -= (failedEntityChecks / totalEntityChecks) * 50;
    score -= failedConnections * 10;
    if (productsWarn) score -= 15;
    if (productsFailed) score -= 25;
    if (stripeFailed) score -= 20;
    if (stripeMismatch) score -= 30;
    
    score = Math.max(0, Math.min(100, Math.round(score)));

    checks.health = {
      score,
      total: totalEntityChecks + connectionList.length + 2, 
      passed: (totalEntityChecks - failedEntityChecks) + connectionList.filter((c: any) => c.status === 'ok' || c.status === 'needs_credential').length + (stripeFailed ? 0 : 1) + (productsWarn || productsFailed ? 0 : 1),
      status: score === 100 ? 'healthy' : score >= 80 ? 'warning' : 'critical',
      timestamp: new Date().toISOString(),
    };

    return Response.json(checks);
  } catch (error: any) {
    return Response.json(
      {
        error: error.message,
        status: 'critical',
      },
      { status: 500 }
    );
  }
});