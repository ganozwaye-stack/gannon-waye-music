import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Create sample gift tracker for testing
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get first subscriber
    const subscribers = await base44.entities.EmailSubscriber.list();
    if (subscribers.length === 0) {
      return Response.json({ error: 'No subscribers found' }, { status: 404 });
    }

    const sub = subscribers[0];

    // Create gift tracker
    const tracker = await base44.entities.GiftRequirementTracker.create({
      subscriber_email: sub.email,
      subscriber_name: sub.name,
      tiktok_followed: false,
      instagram_followed: false,
      post_engaged: false,
      screenshot_submitted: 'pending',
      status: 'not_started',
      checklist_token: `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });

    return Response.json({
      success: true,
      tracker,
      message: 'Sample gift tracker created for testing',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});