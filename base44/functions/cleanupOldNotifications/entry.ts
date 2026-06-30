import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Auto-cleans old AdminNotifications — marks any unread notification older than 30 days as read
// Runs daily via scheduled automation
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);

    const result = await base44.asServiceRole.entities.AdminNotification.updateMany(
      { is_read: false, created_date: { $lt: cutoff.toISOString() } },
      { $set: { is_read: true } }
    );

    return Response.json({ success: true, cutoff: cutoff.toISOString(), result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});