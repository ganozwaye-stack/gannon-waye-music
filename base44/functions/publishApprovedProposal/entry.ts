import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  let user = null;
  try {
    user = await base44.auth.me();
  } catch (_) { /* no-op */ }
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Admin access required' }, { status: 403 });
  }

  const body = await req.json();
  const { proposal_id, action, decision_note, edits } = body;

  if (!proposal_id || !action) {
    return Response.json({ error: 'proposal_id and action required' }, { status: 400 });
  }

  const proposals = await base44.asServiceRole.entities.AgentActionProposal.filter({ id: proposal_id });
  const proposal = proposals[0];
  if (!proposal) {
    return Response.json({ error: 'Proposal not found' }, { status: 404 });
  }

  const now = new Date().toISOString();

  if (action === 'reject') {
    await base44.asServiceRole.entities.AgentActionProposal.update(proposal_id, {
      status: 'rejected',
      decision_note: decision_note || 'Rejected by admin',
      decided_by: user.email,
      decided_at: now,
    });

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      title: `Proposal rejected: ${proposal.title}`,
      summary: decision_note || 'Admin rejected this proposal.',
      severity: 'info',
      source: 'Revenue Actions',
      is_read: false,
    });

    return Response.json({ success: true, action: 'rejected' });
  }

  if (action === 'approve') {
    // Apply any edits from the modal
    const finalDiscount = edits?.discount_percent ?? proposal.discount_percent;
    const finalHeadline = edits?.customer_facing_headline ?? proposal.customer_facing_headline;
    const finalCopy = edits?.customer_facing_copy ?? proposal.customer_facing_copy;
    const finalDuration = edits?.campaign_duration_hours ?? proposal.campaign_duration_hours ?? 72;

    const startDate = new Date().toISOString();
    const endDate = new Date(Date.now() + finalDuration * 60 * 60 * 1000).toISOString();

    // Create live BundleOffer if it's a bundle_offer type
    let bundleOfferId = null;
    if (proposal.proposal_type === 'bundle_offer' && proposal.products_involved?.length >= 2) {
      const bundle = await base44.asServiceRole.entities.BundleOffer.create({
        bundle_name: proposal.title,
        products_included: proposal.products_involved,
        original_combined_price: proposal.original_combined_price,
        bundle_price: proposal.proposed_bundle_price,
        discount_percent: finalDiscount,
        start_date: startDate,
        end_date: endDate,
        status: 'active',
        campaign_copy: finalCopy,
        customer_headline: finalHeadline,
        show_original_price: true,
        show_saving: true,
        show_stock_warning: true,
        limited_time_label: true,
        created_by_agent: proposal.agent_name,
        approved_by: user.email,
        proposal_id: proposal_id,
        stock_rule: proposal.expiry_rule || 'while_stocks_last',
        image_url: '',
      });
      bundleOfferId = bundle.id;
    }

    // Update proposal to published
    await base44.asServiceRole.entities.AgentActionProposal.update(proposal_id, {
      status: 'published',
      decision_note: decision_note || 'Approved by admin',
      decided_by: user.email,
      decided_at: now,
      published_at: now,
      bundle_offer_id: bundleOfferId,
    });

    // Create success notification
    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'order',
      title: `✅ Live: ${proposal.title}`,
      summary: `Your approval published this offer. ${proposal.estimated_revenue_impact || 'Campaign is now live on the store.'} Expires: ${new Date(endDate).toLocaleString('en-AU')}`,
      severity: 'info',
      requires_action: false,
      linked_route: '/admin/revenue-actions',
      linked_entity: 'BundleOffer',
      linked_id: bundleOfferId,
      source: 'Revenue Actions',
      is_read: false,
    });

    return Response.json({
      success: true,
      action: 'approved',
      bundle_offer_id: bundleOfferId,
      message: 'Offer is now live on your store',
    });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
});