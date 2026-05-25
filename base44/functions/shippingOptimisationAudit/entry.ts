import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch shipping rules, products, and existing approval queue items for idempotency
    const [rules, products, existingApprovals] = await Promise.all([
      base44.asServiceRole.entities.ShippingRateRule.list(),
      base44.asServiceRole.entities.MerchProduct.list(),
      base44.asServiceRole.entities.ApprovalQueue.filter({ agent_name: 'shippingOptimisationAudit' }),
    ]);

    // Build idempotency key set from existing approvals to prevent duplicates
    const existingKeys = new Set(
    (existingApprovals || [])
      .filter(a => a.status === 'pending')
      .map(a => a.action_title)
    );

    const issues = [];
    const recommendations = [];

    // Audit active rules
    for (const rule of rules.filter(r => r.is_active)) {
      const baseRate = Number(rule.base_rate) || 0;
      const additionalRate = Number(rule.additional_item_rate) || 0;

      // Check for excessive rates
      if (baseRate > 25) {
        issues.push({
          type: 'excessive_base_rate',
          rule_id: rule.id,
          rule: rule.name,
          region: rule.region,
          product_type: rule.product_type,
          current_rate: baseRate,
          recommended_rate: rule.region === 'international' ? 18 : 12,
          severity: 'warning',
          linked_route: `/admin/shipping-rates`,
          reason: `Base rate of $${baseRate} AUD exceeds recommended maximum`,
        });
      }

      // Check for missing free shipping thresholds (Australia only)
      if (!rule.free_shipping_threshold && rule.region === 'australia') {
        recommendations.push({
          type: 'suggest_free_shipping_threshold',
          rule_id: rule.id,
          rule: rule.name,
          suggested_threshold: 100,
          reason: 'Encourages larger orders; standard practice in AU e-commerce',
        });
      }

      // Check bundle rates
      if (rule.product_type === 'bundle' && baseRate < 5) {
        recommendations.push({
          type: 'insufficient_bundle_rate',
          rule_id: rule.id,
          rule: rule.name,
          current_rate: baseRate,
          suggested_rate: 8,
          reason: 'Bundles cost more to pack and ship; undercharging erodes profit',
        });
      }

      // Check for zero additional item rate (potential revenue loss at scale)
      if (additionalRate === 0 && rule.region !== 'local_pickup') {
        recommendations.push({
          type: 'zero_additional_item_rate',
          rule_id: rule.id,
          rule: rule.name,
          reason: 'Multi-item orders have no additional shipping charge — check if intentional',
        });
      }
    }

    // Check CD undercharging specifically (standardised field: current_rate)
    const cdRules = rules.filter(r => r.product_type === 'cd' && r.is_active);
    for (const cdRule of cdRules) {
      const cdRate = Number(cdRule.base_rate) || 0;
      if (cdRate < 5) {
        issues.push({
          type: 'cd_undercharging',
          rule_id: cdRule.id,
          rule: cdRule.name,
          region: cdRule.region,
          product_type: 'cd',
          current_rate: cdRate,
          recommended_rate: 7,
          severity: 'high',
          linked_route: `/admin/shipping-rates`,
          reason: `CDs cost $5–7 AUD to post in Australia. Current rate: $${cdRate}. You are losing $${(7 - cdRate).toFixed(2)} per CD order.`,
        });
      }
    }

    // Check for missing rules for key product types
    const coveredTypes = new Set(rules.filter(r => r.is_active).map(r => r.product_type));
    for (const requiredType of ['cd', 'merch', 'vinyl']) {
      if (!coveredTypes.has(requiredType)) {
        issues.push({
          type: 'missing_shipping_rule',
          rule_id: null,
          rule: `No active rule for ${requiredType}`,
          current_rate: null,
          recommended_rate: null,
          severity: 'high',
          linked_route: '/admin/shipping-rates',
          reason: `No active shipping rule exists for product type: ${requiredType}`,
        });
      }
    }

    // Create approval queue items for high-severity issues — IDEMPOTENT (skip if already pending)
    const approvalResults = [];
    for (const issue of issues.filter(i => i.severity === 'high')) {
      const actionTitle = `Shipping Risk: ${issue.type} — ${issue.rule}`;
      if (existingKeys.has(actionTitle)) {
        approvalResults.push({ skipped: true, reason: 'Duplicate — already pending', title: actionTitle });
        continue;
      }
      const currentRateDisplay = issue.current_rate !== null ? `$${issue.current_rate} AUD` : 'N/A';
      const recommendedRateDisplay = issue.recommended_rate !== null ? `$${issue.recommended_rate} AUD` : 'N/A';
      const created = await base44.asServiceRole.entities.ApprovalQueue.create({
        agent_name: 'shippingOptimisationAudit',
        action_title: actionTitle,
        action_description: `Rule: ${issue.rule} | Product: ${issue.product_type || 'unknown'} | Region: ${issue.region || 'unknown'} | Current: ${currentRateDisplay} | Recommended: ${recommendedRateDisplay} | Reason: ${issue.reason} | Review: ${issue.linked_route}`,
        status: 'pending',
        risk_level: 'medium',
        risk_type: ['financial'],
        tags: ['shipping', 'audit', issue.type],
      });
      approvalResults.push({ created: true, id: created?.id, title: actionTitle });
    }

    // Create SystemHealthIssue for high-severity issues
    for (const issue of issues.filter(i => i.severity === 'high')) {
      const healthTitle = `Shipping Audit: ${issue.type} on "${issue.rule}"`;
      await base44.asServiceRole.entities.SystemHealthIssue.create({
        system_area: 'commerce',
        issue_title: healthTitle,
        severity: 'high',
        detected_by: 'shippingOptimisationAudit',
        recommended_fix: `Current rate: $${issue.current_rate ?? 'N/A'} AUD. Recommended: $${issue.recommended_rate ?? 'N/A'} AUD. ${issue.reason}`,
        status: 'open',
        requires_approval: true,
        risk_type: 'financial',
        last_checked: new Date().toISOString(),
      }).catch(() => {});
    }

    // Business Attention Centre notification with full issue summary
    if (issues.length > 0 || recommendations.length > 0) {
      const issueSummaryLines = issues.map(i =>
        `• [${i.severity.toUpperCase()}] ${i.type}: ${i.rule} — current: $${i.current_rate ?? 'N/A'}, recommended: $${i.recommended_rate ?? 'N/A'}`
      );
      const recSummaryLines = recommendations.map(r =>
        `• ${r.type}: ${r.rule} — ${r.reason}`
      );

      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'system',
        severity: issues.some(i => i.severity === 'high') ? 'high' : 'warning',
        title: `Shipping Rate Audit: ${issues.length} risk(s), ${recommendations.length} suggestion(s)`,
        summary: [
          `ISSUES:\n${issueSummaryLines.join('\n') || 'None'}`,
          `RECOMMENDATIONS:\n${recSummaryLines.join('\n') || 'None'}`,
          `Review at: /admin/shipping-rates`,
        ].join('\n\n'),
        source: 'ShippingOptimisationAudit',
        requires_action: issues.length > 0,
        linked_entity: 'ShippingRateRule',
        linked_route: '/admin/shipping-rates',
        is_read: false,
      }).catch(() => {});
    }

    return Response.json({
      success: true,
      audited_rules: rules.filter(r => r.is_active).length,
      total_issues: issues.length,
      total_recommendations: recommendations.length,
      high_severity_issues: issues.filter(i => i.severity === 'high').length,
      approval_items_created: approvalResults.filter(r => r.created).length,
      approval_items_skipped_duplicate: approvalResults.filter(r => r.skipped).length,
      issues,
      recommendations,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});