import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const VALID_NEXT = {
  new_enquiry: ['reviewing', 'declined'],
  reviewing: ['contacted', 'declined'],
  contacted: ['negotiating', 'declined'],
  negotiating: ['confirmed', 'declined'],
  confirmed: ['completed'],
  declined: ['archived'],
  completed: ['archived'],
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { bookingId, targetState, notes, owner_approved_booking_email } = await req.json();

    const bookings = await base44.asServiceRole.entities.BookingEnquiry.filter({ id: bookingId });
    if (bookings.length === 0) {
      return Response.json({ error: 'Booking not found' }, { status: 404 });
    }

    const booking = bookings[0];
    if (!VALID_NEXT[booking.status]?.includes(targetState)) {
      return Response.json({
        error: `Cannot transition from ${booking.status} to ${targetState}`,
        validStates: VALID_NEXT[booking.status] || [],
      }, { status: 400 });
    }

    await base44.asServiceRole.entities.BookingEnquiry.update(bookingId, {
      status: targetState,
      notes: notes || booking.notes,
      last_updated: new Date().toISOString(),
    });

    const needsCustomerMessage = ['contacted', 'confirmed', 'declined'].includes(targetState) && booking.email;
    if (needsCustomerMessage && owner_approved_booking_email !== true) {
      const proposedOutput = buildCustomerMessage(booking, targetState, notes);
      await queueOutboundApproval(base44, booking, targetState, proposedOutput);
      return Response.json({
        success: true,
        newStatus: targetState,
        external_actions_performed: false,
        approval_required: true,
        message: 'Booking status updated. Customer message queued for approval; no email sent.',
      });
    }

    if (needsCustomerMessage && owner_approved_booking_email === true) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: booking.email,
        subject: bookingSubject(targetState),
        body: buildCustomerMessage(booking, targetState, notes),
      });
    }

    return Response.json({
      success: true,
      newStatus: targetState,
      external_actions_performed: needsCustomerMessage && owner_approved_booking_email === true,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function queueOutboundApproval(base44, booking, targetState, proposedOutput) {
  await base44.asServiceRole.entities.AdminNotification.create({
    notification_type: 'approval',
    severity: 'warning',
    title: `Booking ${targetState} message needs approval`,
    summary: `${booking.full_name || 'Booking enquiry'} was moved to ${targetState}. Review the proposed customer message before sending.`,
    source: 'bookingWorkflowHandler',
    requires_action: true,
    linked_entity: 'BookingEnquiry',
    linked_id: booking.id,
    linked_route: '/admin/coaching-leads',
    delivered_email: false,
    delivered_slack: false,
  });

  await base44.asServiceRole.entities.ApprovalQueue.create({
    agent_name: 'Booking Revenue Agent',
    action_title: `Approve booking ${targetState} message - ${booking.full_name || booking.id}`,
    action_description: `Approve or edit the customer-facing booking message before sending to ${booking.email}.`,
    risk_type: ['reputation', 'commitment'],
    risk_level: 'medium',
    status: 'pending',
    payload: {
      action: 'booking_status_email',
      booking_id: booking.id,
      recipient: booking.email,
      target_status: targetState,
    },
    proposed_output: proposedOutput,
    auto_eligible: false,
    tags: ['booking', 'customer_message', 'approval_required'],
  });
}

function bookingSubject(targetState) {
  if (targetState === 'confirmed') return 'Booking enquiry confirmed - Gannon Waye';
  if (targetState === 'declined') return 'Booking enquiry update - Gannon Waye';
  return 'Your booking enquiry - next steps';
}

function buildCustomerMessage(booking, targetState, notes = '') {
  if (targetState === 'confirmed') {
    return `Hi ${booking.full_name},\n\nYour booking enquiry has been confirmed internally.\n\nBooking details:\n- Type: ${(booking.booking_type || 'booking').replace(/_/g, ' ')}\n- Date: ${booking.event_date || 'TBD'}\n- Location: ${booking.location || 'TBD'}\n- Enquiry ID: ${booking.id}\n\n${notes ? `Notes: ${notes}\n\n` : ''}Gannon's team will be in touch with next steps.\n\nWarm regards,\nGannon Waye Team`;
  }

  if (targetState === 'declined') {
    return `Hi ${booking.full_name},\n\nThank you for your booking enquiry.\n\nAt this stage we are unable to proceed with this request.\n\nEnquiry ID: ${booking.id}\n\n${notes ? `Notes: ${notes}\n\n` : ''}Warm regards,\nGannon Waye Team`;
  }

  return `Hi ${booking.full_name},\n\nThanks for your booking enquiry. We are reviewing your request and will come back with next steps.\n\nEnquiry ID: ${booking.id}\n\n${notes ? `Notes: ${notes}\n\n` : ''}Warm regards,\nGannon Waye Team`;
}
