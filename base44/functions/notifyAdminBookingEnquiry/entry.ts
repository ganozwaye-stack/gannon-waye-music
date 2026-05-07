import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { booking } = req.body || {};
    if (!booking) {
      return Response.json({ error: 'Booking data required' }, { status: 400 });
    }

    // Send admin notification email
    await base44.integrations.Core.SendEmail({
      to: 'hello@gannonwaye.com',
      subject: `NEW BOOKING ENQUIRY: ${booking.full_name} - ${booking.booking_type?.replace(/_/g, ' ')}`,
      body: buildAdminNotification(booking),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

const buildAdminNotification = (booking) => {
  return `NEW BOOKING ENQUIRY

Enquiry ID: ${booking.id}
Submitted: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}

CONTACT INFORMATION:
Name: ${booking.full_name}
Company/Venue: ${booking.company_venue || 'N/A'}
Email: ${booking.email}
Phone: ${booking.phone || 'N/A'}

EVENT DETAILS:
Type: ${booking.booking_type?.replace(/_/g, ' ')}
Date: ${booking.event_date || 'TBD'}
Location: ${booking.location || 'TBD'}
Budget: ${booking.budget_range?.replace(/_/g, ' ') || 'Not specified'}
Audience Size: ${booking.audience_size || 'Not specified'}

EVENT DESCRIPTION:
${booking.event_details}

ACCESSIBILITY NEEDS:
${booking.accessibility_needs || 'None specified'}

TECHNICAL REQUIREMENTS:
${booking.technical_requirements || 'None specified'}

REFERRAL SOURCE: ${booking.referral_source?.replace(/_/g, ' ') || 'Not specified'}
SOCIAL LINKS: ${booking.social_links?.join(', ') || 'None'}
ATTACHMENTS: ${booking.attachment_urls?.length || 0} file(s)

---
ACTION REQUIRED:
Review this enquiry in the admin panel: /admin/bookings
Respond within 2-3 business days.`;
};