import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body = {};
    try { body = await req.json(); } catch { /* empty body ok */ }

    const booking = body.enquiry || body.booking;
    if (!booking) {
      return Response.json({ error: 'Booking data required' }, { status: 400 });
    }

    const summary = buildAdminNotification(booking);
    const proposedReply = buildConfirmationDraft(booking);
    const linkedId = booking.id || booking.enquiry_id || '';

    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'approval',
      severity: 'high',
      title: `New booking enquiry needs review: ${booking.full_name || 'Unknown'} - ${(booking.booking_type || 'booking').replace(/_/g, ' ')}`,
      summary,
      source: body.source || 'notifyAdminBookingEnquiry',
      requires_action: true,
      linked_entity: 'BookingEnquiry',
      linked_id: linkedId,
      linked_route: '/admin/coaching-leads',
      delivered_email: false,
      delivered_slack: false,
    });

    await base44.asServiceRole.entities.ApprovalQueue.create({
      agent_name: 'Booking Revenue Agent',
      action_title: `Approve booking acknowledgement - ${booking.full_name || linkedId || 'new enquiry'}`,
      action_description: `Review or edit the acknowledgement before any customer email is sent to ${booking.email || 'the enquirer'}.`,
      risk_type: ['reputation', 'commitment'],
      risk_level: 'medium',
      status: 'pending',
      payload: {
        action: 'booking_acknowledgement_email',
        booking_id: linkedId,
        recipient: booking.email || '',
        source: body.source || 'booking_form',
      },
      proposed_output: proposedReply,
      auto_eligible: false,
      tags: ['booking', 'customer_message', 'approval_required'],
    });

    return Response.json({
      success: true,
      external_actions_performed: false,
      approval_required: true,
      message: 'Booking notification logged internally and customer acknowledgement queued for approval. No email sent.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

const buildAdminNotification = (booking) => {
  return `NEW BOOKING ENQUIRY\n\nEnquiry ID: ${booking.id || 'N/A'}\nSubmitted: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}\n\nCONTACT INFORMATION:\nName: ${booking.full_name || 'N/A'}\nCompany/Venue: ${booking.company_venue || 'N/A'}\nEmail: ${booking.email || 'N/A'}\nPhone: ${booking.phone || 'N/A'}\n\nEVENT DETAILS:\nType: ${(booking.booking_type || 'booking').replace(/_/g, ' ')}\nDate: ${booking.event_date || 'TBD'}\nLocation: ${booking.location || 'TBD'}\nBudget: ${booking.budget_range?.replace(/_/g, ' ') || 'Not specified'}\nAudience Size: ${booking.audience_size || 'Not specified'}\n\nEVENT DESCRIPTION:\n${booking.event_details || 'Not provided'}\n\nACCESSIBILITY NEEDS:\n${booking.accessibility_needs || 'None specified'}\n\nTECHNICAL REQUIREMENTS:\n${booking.technical_requirements || 'None specified'}\n\nREFERRAL SOURCE: ${booking.referral_source?.replace(/_/g, ' ') || 'Not specified'}\nSOCIAL LINKS: ${booking.social_links?.join(', ') || 'None'}\nATTACHMENTS: ${booking.attachment_urls?.length || 0} file(s)\n\nACTION REQUIRED:\nReview this enquiry in the admin panel and approve/edit the acknowledgement before any outbound customer message.`;
};

const buildConfirmationDraft = (booking) => {
  return `Hi ${booking.full_name || 'there'},\n\nThank you for your booking enquiry.\n\nEnquiry details:\n- Type: ${(booking.booking_type || 'booking').replace(/_/g, ' ')}\n- Date: ${booking.event_date || 'TBD'}\n- Location: ${booking.location || 'TBD'}\n- Enquiry ID: ${booking.id || 'pending'}\n\nGannon's team will review the enquiry and come back with next steps.\n\nWarm regards,\nGannon Waye Team`;
};
