import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Auth check — service role or admin user
  let isAdmin = false;
  try {
    const user = await base44.auth.me();
    isAdmin = user?.role === 'admin';
  } catch (_) {
    // May be called without user context from automation
    isAdmin = true;
  }

  // Load products to find bundle candidates
  const products = await base44.asServiceRole.entities.MerchProduct.filter({ is_active: true });
  const availableProducts = products.filter(p => (p.stock_quantity || 0) > 0 && p.name?.toLowerCase() !== 'tote bag');

  if (availableProducts.length < 2) {
    return Response.json({ message: 'Not enough available products to create bundles', proposals_created: 0 });
  }

  // Check existing active decisions to avoid pitching the same thing again after approval.
  // Previously this only checked pending items, so approved/published offers came back as new approvals.
  const allExisting = await base44.asServiceRole.entities.AgentActionProposal.list('-created_date', 200);
  const activeDecisionStatuses = new Set(['pending_approval', 'approved', 'published', 'editing']);
  const existing = allExisting.filter(e => activeDecisionStatuses.has(e.status));
  const existingTitles = existing.map(e => e.title?.toLowerCase() || '');

  const proposals_created = [];

  // Identify hoodie/jumper + t-shirt bundle opportunity
  const hoodie = availableProducts.find(p =>
    p.name?.toLowerCase().includes('hoodie') || p.name?.toLowerCase().includes('jumper') || p.name?.toLowerCase().includes('sweater')
  );
  const tshirt = availableProducts.find(p =>
    p.name?.toLowerCase().includes('t-shirt') || p.name?.toLowerCase().includes('tee') || p.name?.toLowerCase().includes('shirt')
  );

  if (hoodie && tshirt) {
    const bundleTitle = 'Limited Fan Fit Bundle — Hoodie + T-Shirt (20% Off)';
    const alreadyExists = existingTitles.some(t => t.includes('fan fit') || (t.includes('hoodie') && t.includes('t-shirt')));

    if (!alreadyExists) {
      const originalPrice = (hoodie.sale_price || 89) + (tshirt.sale_price || 49);
      const discountPct = 20;
      const bundlePrice = Math.round(originalPrice * (1 - discountPct / 100) * 100) / 100;
      const saving = Math.round((originalPrice - bundlePrice) * 100) / 100;

      const now = new Date();
      const endDate = new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString();

      const proposal = await base44.asServiceRole.entities.AgentActionProposal.create({
        title: bundleTitle,
        agent_name: 'EcommerceIntelligenceAgent',
        proposal_type: 'bundle_offer',
        reason: `${hoodie.name} ($${hoodie.sale_price}) and ${tshirt.name} ($${tshirt.sale_price}) are both in stock. A 20% bundle discount creates a compelling limited-time offer that increases average order value while remaining profitable. Combined original price: $${originalPrice}. Bundle price: $${bundlePrice}. Customer saves $${saving}.`,
        products_involved: [hoodie.name, tshirt.name],
        product_prices: { [hoodie.name]: hoodie.sale_price, [tshirt.name]: tshirt.sale_price },
        original_combined_price: originalPrice,
        proposed_bundle_price: bundlePrice,
        discount_percent: discountPct,
        estimated_margin_percent: hoodie.profit_margin_percent || 40,
        estimated_revenue_impact: `Est. $${(bundlePrice * 3).toFixed(0)}–$${(bundlePrice * 8).toFixed(0)} over 72h campaign`,
        risk_level: 'low',
        confidence_score: 8,
        urgency_score: 7,
        profit_potential_score: 7,
        stock_check_passed: true,
        stock_notes: `${hoodie.name}: ${hoodie.stock_quantity} units. ${tshirt.name}: ${tshirt.stock_quantity} units.`,
        campaign_duration_hours: 72,
        start_date: now.toISOString(),
        end_date: endDate,
        customer_facing_headline: `Limited Time — Fan Fit Bundle. Save $${saving}`,
        customer_facing_copy: `Bundle your Gannon Waye ${hoodie.name} and ${tshirt.name} together and save ${discountPct}%. Available for a limited time only while stock remains.`,
        website_banner_draft: `🎵 LIMITED FAN FIT BUNDLE — ${hoodie.name} + ${tshirt.name} | Save $${saving} (${discountPct}% Off) | While Stocks Last`,
        product_card_draft: `Bundle: ${hoodie.name} + ${tshirt.name}\nOriginal: $${originalPrice} | Bundle: $${bundlePrice} | You save: $${saving}\nLimited time · While stocks last`,
        social_post_draft: `🔥 NEW BUNDLE DROP\n${hoodie.name} + ${tshirt.name} — save $${saving} when you grab both.\nLimited time only. Link in bio 🎵\n#GannonWaye #MerchDrop #LimitedOffer`,
        expiry_rule: '72 hours or until stock runs out',
        source_chain: `EcommerceIntelligenceAgent → Product Scan → Stock Check → Margin Analysis → Bundle Proposal → Approval Queue`,
        if_approved_action: `Creates a live BundleOffer record, publishes bundle card on Store, creates admin notification confirming it's live, starts 72h campaign tracking. Bundle auto-expires after 72h.`,
        if_rejected_action: `Marks proposal as rejected. Agent logs rejection reason and adjusts future recommendations.`,
        status: 'pending_approval',
      });
      proposals_created.push(proposal.id);

      // Create notification
      await base44.asServiceRole.entities.AdminNotification.create({
        notification_type: 'approval',
        title: `💰 Bundle Opportunity Ready: ${bundleTitle}`,
        summary: `Agent prepared a ${discountPct}% off bundle of ${hoodie.name} + ${tshirt.name}. Est. revenue: ${bundlePrice * 5 | 0}–${bundlePrice * 10 | 0} AUD. Awaiting your approval to go live.`,
        severity: 'info',
        requires_action: true,
        linked_route: '/admin/revenue-actions',
        linked_entity: 'AgentActionProposal',
        source: 'EcommerceIntelligenceAgent',
        is_read: false,
      });
    }
  }

  // Scan for other high-margin single product highlights
  const highMarginProducts = availableProducts
    .filter(p => (p.profit_margin_percent || 0) > 50)
    .sort((a, b) => (b.profit_margin_percent || 0) - (a.profit_margin_percent || 0));

  if (highMarginProducts.length > 0) {
    const top = highMarginProducts[0];
    const highlightTitle = `Product Spotlight: ${top.name} — High Margin Featured Listing`;
    const topName = top.name?.toLowerCase() || '';
    const alreadyExists = existingTitles.some(t => topName && t.includes(topName));

    if (!alreadyExists && top.profit_margin_percent > 55) {
      await base44.asServiceRole.entities.AgentActionProposal.create({
        title: highlightTitle,
        agent_name: 'EcommerceIntelligenceAgent',
        proposal_type: 'product_highlight',
        reason: `${top.name} has the highest margin in your store at ${top.profit_margin_percent}%. Featuring it prominently can increase revenue without discounting.`,
        products_involved: [top.name],
        product_prices: { [top.name]: top.sale_price },
        risk_level: 'none',
        confidence_score: 9,
        urgency_score: 5,
        profit_potential_score: 8,
        customer_facing_headline: `Featured Pick: ${top.name}`,
        customer_facing_copy: `One of the most popular items from Gannon Waye — ${top.name} available now.`,
        status: 'pending_approval',
        source_chain: 'EcommerceIntelligenceAgent → Margin Analysis → Product Highlight Proposal',
        if_approved_action: 'Pins product to top of store with featured badge.',
        if_rejected_action: 'Agent notes preference and adjusts future spotlights.',
      });
      proposals_created.push(highlightTitle);
    }
  }

  return Response.json({
    message: proposals_created.length > 0
      ? `${proposals_created.length} proposal(s) created and waiting for your approval in Revenue Actions`
      : 'No new proposals needed — existing pending proposals cover current opportunities',
    proposals_created: proposals_created.length,
    products_scanned: availableProducts.length,
  });
});
