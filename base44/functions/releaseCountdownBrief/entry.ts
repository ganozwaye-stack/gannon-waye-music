import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Daily release countdown brief — fires every morning at 7am AEST
// Tracks progress toward June 10, 2026 release
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const releaseDate = new Date('2026-06-10T00:00:00+10:00');
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((releaseDate - now) / (1000 * 60 * 60 * 24)));

    // Fetch key metrics
    const [subscribers, orders, opportunities] = await Promise.all([
      base44.asServiceRole.entities.EmailSubscriber.list('-created_date', 1000),
      base44.asServiceRole.entities.MerchOrder.list('-created_date', 100),
      base44.asServiceRole.entities.GrowthOpportunity.filter({ status: 'new' }, '-created_date', 10),
    ]);

    const recentSubs = subscribers.filter(s => {
      const d = new Date(s.created_date);
      return (now - d) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      severity: daysLeft <= 7 ? 'high' : daysLeft <= 14 ? 'warning' : 'info',
      title: `🎵 ${daysLeft} Days Until "Thank You" Releases — June 10, 2026`,
      summary: `Subscribers: ${subscribers.length} total (${recentSubs} new this week). Orders: ${orders.length} total. Open growth opportunities: ${opportunities.length}. Keep pushing pre-save, merch, and email growth.`,
      source: 'releaseCountdownBrief',
      requires_action: daysLeft <= 14,
      linked_route: '/admin/revenue-command',
      is_read: false,
    });

    return Response.json({ success: true, days_left: daysLeft, subscribers: subscribers.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});