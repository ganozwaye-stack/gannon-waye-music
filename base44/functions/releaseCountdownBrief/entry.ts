import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Daily release countdown brief — fires every morning
// Dynamically targets the NEXT upcoming release from the Release entity
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch all releases to find the next upcoming one
    const allReleases = await base44.asServiceRole.entities.Release.list('-release_date', 100);
    const now = new Date();

    // Find the next unreleased release with a future release date
    const upcoming = allReleases.find(r =>
      r.status !== 'released' &&
      r.release_date &&
      new Date(r.release_date) >= now
    );

    // If there's an upcoming release, count down to it
    // Otherwise, summarise post-release performance of the most recent release
    if (upcoming) {
      const releaseDate = new Date(upcoming.release_date + 'T00:00:00+10:00');
      const daysLeft = Math.max(0, Math.ceil((releaseDate - now) / (1000 * 60 * 60 * 24)));

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
        title: `🎵 ${daysLeft} Day${daysLeft === 1 ? '' : 's'} Until "${upcoming.title}" Releases — ${upcoming.release_date}`,
        summary: `Subscribers: ${subscribers.length} total (${recentSubs} new this week). Orders: ${orders.length} total. Open growth opportunities: ${opportunities.length}. Keep pushing pre-save, merch, and email growth.`,
        source: 'releaseCountdownBrief',
        requires_action: daysLeft <= 14,
        linked_route: '/admin/releases',
        is_read: false,
      });

      return Response.json({ success: true, mode: 'countdown', release: upcoming.title, days_left: daysLeft });
    }

    // No upcoming release — post-release performance summary
    const lastRelease = allReleases.find(r => r.status === 'released');
    if (!lastRelease) {
      return Response.json({ success: true, mode: 'no_releases' });
    }

    const releaseDate = new Date(lastRelease.release_date + 'T00:00:00+10:00');
    const daysSince = Math.floor((now - releaseDate) / (1000 * 60 * 60 * 24));

    const [subscribers, orders] = await Promise.all([
      base44.asServiceRole.entities.EmailSubscriber.list('-created_date', 1000),
      base44.asServiceRole.entities.MerchOrder.list('-created_date', 100),
    ]);

    const recentSubs = subscribers.filter(s => {
      const d = new Date(s.created_date);
      return (now - d) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'system',
      severity: 'info',
      title: `📈 "${lastRelease.title}" — ${daysSince} day${daysSince === 1 ? '' : 's'} since release`,
      summary: `Post-release performance: ${subscribers.length} subscribers (${recentSubs} new this week). ${orders.length} orders total. Plan next release or content cycle.`,
      source: 'releaseCountdownBrief',
      requires_action: false,
      linked_route: '/admin/releases',
      is_read: false,
    });

    return Response.json({ success: true, mode: 'post_release', release: lastRelease.title, days_since: daysSince });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});