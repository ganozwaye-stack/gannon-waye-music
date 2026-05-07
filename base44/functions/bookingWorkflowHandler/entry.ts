import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Booking workflow enforcement
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { bookingId, action, targetState, notes } = await req.json();

    const bookings = await base44.asServiceRole.entities.BookingEnquiry.filter({ id: bookingId });
    if (bookings.length === 0) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookings[0];
    const VALID_NEXT = {
      new_enquiry: ['reviewing', 'declined'],
      reviewing: ['contacted', 'declined'],
      contacted: ['negotiating', 'declined'],
      negotiating: ['confirmed', 'declined'],
      confirmed: ['completed'],
      declined: ['archived'],
      completed: ['archived'],
    };

    if (!VALID_NEXT[booking.status]?.includes(targetState)) {
      return Response.json({
        error: `Cannot transition from ${booking.status} to ${targetState}`,
        validStates: VALID_NEXT[booking.status] || [],
      }, { status: 400 });
    }

    // Update booking
    await base44.asServiceRole.entities.BookingEnquiry.update(bookingId, {
      status: targetState,
      notes: notes || booking.notes,
      last_updated: new Date().toISOString(),
    });

    // Send notification email if transitioned to 'contacted'
    if (targetState === 'contacted' && booking.email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: booking.email,
        subject: 'Your booking enquiry — Next steps',
        body: `Hi ${booking.full_name},\n\nThanks for your enquiry. We're reviewing your request and will be in touch soon with next steps.\n\nBest,\nGannon`,
      });
    }

    return Response.json({ success: true, newStatus: targetState });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});