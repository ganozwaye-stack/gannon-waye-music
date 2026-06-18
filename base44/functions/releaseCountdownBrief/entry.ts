import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Daily release growth brief - fires every morning at 7am AEST.
// Tracks post-release growth after the official 05 June 2026 THANKYOU release.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date();

    const [subscribers, orders, opportunities] = await Promise.all([
      base44.asServiceRole.entities.EmailSubscriber.list('-created_date', 1000),
      base44.asServiceRole.entities.MerchOrder.list('-created_date', 100),
      base44.asServiceRole.entities.GrowthOpportunity.filter({ status: 'new' }, '-created_date', 10),
    ]);

    const recentSubs = subscribers.filter((subscriber) => {
      const createdAt = new Date(subscriber.created_date);
      return (now - createdAt) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      severity: opportunities.length > 0 ? 'high' : 'info',
      title: 'THANKYOU Growth Brief - Stream, Share, Save',
      summary: `Subscribers: ${subscribers.length} total (${recentSubs} new this week). Orders: ${orders.length} total. Open growth opportunities: ${opportunities.length}. Keep pushing streams, saves, shares, comments, merch, and email growth.`,
      source: 'releaseCountdownBrief',
      requires_action: opportunities.length > 0,
      linked_route: '/admin/revenue-command',
      is_read: false,
    });

    return Response.json({
      success: true,
      mode: 'post_release_growth',
      subscribers: subscribers.length,
      orders: orders.length,
      opportunities: opportunities.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
