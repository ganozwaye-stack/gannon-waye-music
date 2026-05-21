import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch shipping rules and products
    const [rules, products] = await Promise.all([
      base44.asServiceRole.entities.ShippingRateRule.list(),
      base44.asServiceRole.entities.MerchProduct.list(),
    ]);

    const issues = [];
    const recommendations = [];

    // Audit active rules
    for (const rule of rules.filter(r => r.is_active)) {
      // Check for excessive rates
      if (rule.base_rate > 25) {
        issues.push({
          type: 'excessive_base_rate',
          rule: rule.name,
          current: rule.base_rate,
          recommended: rule.region === 'international' ? 18 : 12,
          severity: 'warning',
        });
      }

      // Check for missing free shipping thresholds
      if (!rule.free_shipping_threshold && rule.region === 'australia') {
        recommendations.push({
          type: 'suggest_free_shipping_threshold',
          rule: rule.name,
          suggested_threshold: 100,
          reason: 'Encourages larger orders, standard practice in AU',
        });
      }

      // Check profit margin on bundles
      if (rule.product_type === 'bundle' && rule.base_rate < 5) {
        recommendations.push({
          type: 'insufficient_bundle_rate',
          rule: rule.name,
          current: rule.base_rate,
          suggested: 8,
          reason: 'Bundles cost more to pack and ship',
        });
      }
    }

    // Check for undercharging on small items
    const cdRules = rules.filter(r => r.product_type === 'cd' && r.is_active);
    if (cdRules.length > 0) {
      const cdRate = cdRules[0].base_rate;
      if (cdRate < 5) {
        issues.push({
          type: 'cd_undercharging',
          current_rate: cdRate,
          recommended: 7,
          reason: 'CDs cost $5-7 AUD to post in Australia',
          severity: 'high',
        });
      }
    }

    // Create approval queue items for high-severity issues
    for (const issue of issues.filter(i => i.severity === 'high')) {
      await base44.asServiceRole.entities.ApprovalQueue.create({
        request_type: 'shipping_rate_change',
        item_title: `Shipping Risk: ${issue.type}`,
        item_description: `Current: ${issue.current}, Recommended: ${issue.recommended}. Reason: ${issue.reason}`,
        requestor: 'shippingOptimisationAudit',
        status: 'pending',
        requires_approval: true,
        risk_level: 'medium',
      });
    }

    // Fire admin notification if issues found
    if (issues.length > 0 || recommendations.length > 0) {
      await base44.asServiceRole.functions.invoke('notifyAdmin', {
        notification_type: 'system',
        title: `Shipping Rate Audit: ${issues.length} risk(s) detected`,
        summary: `${issues.length} overcharge/undercharge issues, ${recommendations.length} improvement suggestions`,
        severity: issues.some(i => i.severity === 'high') ? 'high' : 'warning',
        source: 'ShippingOptimisationAudit',
        linked_route: '/admin/shipping-rates',
        requires_action: issues.length > 0,
      });
    }

    return Response.json({
      success: true,
      total_issues: issues.length,
      total_recommendations: recommendations.length,
      issues,
      recommendations,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});