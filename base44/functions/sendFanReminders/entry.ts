import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch all unsent fan reminders that are due (remind_at <= now)
    const now = new Date().toISOString();
    const reminders = await base44.asServiceRole.entities.FanReminder.filter({
      is_sent: false,
    });

    let sentCount = 0;
    const dueReminders = reminders.filter(r => r.remind_at && new Date(r.remind_at) <= new Date());

    for (const reminder of dueReminders) {
      try {
        const typeLabels = {
          new_release: 'New Music from Gannon Waye',
          album_drop: 'Gannon Waye Album Release',
          next_single: 'New Single from Gannon Waye',
          merch_drop: 'New Merch from Gannon Waye',
          tour_date: 'Upcoming Show from Gannon Waye',
          general: 'Your Reminder from Gannon Waye',
        };

        const subject = typeLabels[reminder.reminder_type] || 'Your Gannon Waye Reminder';
        const greeting = reminder.name ? `Hi ${reminder.name},` : 'Hi there,';

        const body = `${greeting}

This is your reminder from Gannon Waye.

${reminder.custom_message || 'You asked us to nudge you about something happening in Gannon\'s world — here\'s your nudge!'}

Check the latest at https://gannonwaye.com/music

— Gannon Waye Music
https://gannonwaye.com

You're receiving this because you set a fan reminder. Reply to unsubscribe.`;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: reminder.email,
          subject,
          body,
        });

        // Mark as sent
        await base44.asServiceRole.entities.FanReminder.update(reminder.id, {
          is_sent: true,
          sent_at: now,
        });

        sentCount++;
      } catch (err) {
        // Continue to next reminder even if one fails
        console.error(`Failed to send reminder ${reminder.id}:`, err.message);
      }
    }

    return Response.json({
      success: true,
      checked: reminders.length,
      due: dueReminders.length,
      sent: sentCount,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});