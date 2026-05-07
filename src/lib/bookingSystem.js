/**
 * Enterprise Booking & EPK System
 * Professional booking infrastructure for venues, media, brands, and collaborators
 */

import { base44 } from '@/api/base44Client';

const BOOKING_TYPES = [
  'live_performance',
  'festival',
  'private_event',
  'corporate_event',
  'wedding',
  'lgbtqia_event',
  'charity_event',
  'interview',
  'podcast',
  'media_appearance',
  'brand_collaboration',
  'partnership',
  'songwriting_session',
  'creative_collaboration',
];

const BOOKING_STATUSES = [
  'new_enquiry',
  'reviewing',
  'contacted',
  'negotiating',
  'confirmed',
  'completed',
  'declined',
  'archived',
];

/**
 * Create booking enquiry with full CRM integration
 */
export const createBookingEnquiry = async (data) => {
  try {
    const user = await base44.auth.me();
    
    // Create booking enquiry
    const enquiry = await base44.entities.BookingEnquiry.create({
      full_name: data.full_name,
      company_venue: data.company_venue,
      email: data.email,
      phone: data.phone,
      booking_type: data.booking_type,
      event_date: data.event_date,
      budget_range: data.budget_range,
      location: data.location,
      audience_size: data.audience_size,
      event_details: data.event_details,
      accessibility_needs: data.accessibility_needs,
      technical_requirements: data.technical_requirements,
      social_links: data.social_links,
      referral_source: data.referral_source,
      attachment_urls: data.attachment_urls || [],
      status: 'new_enquiry',
      assigned_to: user?.email || 'admin',
    });
    
    // Create audit log
    await base44.entities.AuditLog.create({
      entity_name: 'BookingEnquiry',
      entity_id: enquiry.id,
      action: 'create',
      user_email: user?.email || 'system',
      user_role: user?.role || 'system',
      timestamp: new Date().toISOString(),
      changes: Object.keys(data).map(field => ({
        field,
        old_value: null,
        new_value: data[field],
      })),
      description: `NEW BOOKING ENQUIRY: ${data.full_name} - ${data.booking_type}`,
      metadata: {
        workflow: 'booking_creation',
        session_id: `booking_${enquiry.id}`,
        rollback_available: true,
      },
    });
    
    // Send confirmation email to enquirer
    await base44.integrations.Core.SendEmail({
      to: data.email,
      subject: 'Booking Enquiry Received — Gannon Waye',
      body: buildConfirmationEmail(data, enquiry.id),
    });
    
    // Notify admin
    await base44.functions.invoke('notifyAdminBookingEnquiry', { enquiry });
    
    // Update analytics
    await base44.analytics.track({
      eventName: 'booking_enquiry_created',
      properties: {
        enquiry_id: enquiry.id,
        booking_type: data.booking_type,
        location: data.location,
        referral_source: data.referral_source,
      },
    });
    
    return { success: true, enquiry };
  } catch (error) {
    console.error('Booking enquiry creation failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update booking status with full audit trail
 */
export const updateBookingStatus = async (enquiryId, newStatus, notes = '') => {
  try {
    const user = await base44.auth.me();
    const enquiries = await base44.entities.BookingEnquiry.filter({ id: enquiryId });
    
    if (enquiries.length === 0) {
      throw new Error('Booking enquiry not found');
    }
    
    const oldEnquiry = enquiries[0];
    
    // Update status
    await base44.entities.BookingEnquiry.update(enquiryId, {
      status: newStatus,
      last_updated: new Date().toISOString(),
    });
    
    // Create audit log
    await base44.entities.AuditLog.create({
      entity_name: 'BookingEnquiry',
      entity_id: enquiryId,
      action: 'update',
      user_email: user?.email || 'system',
      user_role: user?.role || 'system',
      timestamp: new Date().toISOString(),
      changes: [
        { field: 'status', old_value: oldEnquiry.status, new_value: newStatus },
        ...(notes ? [{ field: 'notes', old_value: oldEnquiry.notes, new_value: notes }] : []),
      ],
      description: `BOOKING STATUS CHANGE: ${oldEnquiry.status} → ${newStatus}`,
      metadata: {
        workflow: 'booking_status_update',
        session_id: `booking_update_${enquiryId}`,
        rollback_available: true,
        previous_status: oldEnquiry.status,
        new_status: newStatus,
      },
    });
    
    // Send status update email if status changed to confirmed/declined
    if (['confirmed', 'declined'].includes(newStatus)) {
      await base44.integrations.Core.SendEmail({
        to: oldEnquiry.email,
        subject: `Booking Enquiry Update — ${newStatus === 'confirmed' ? 'Confirmed' : 'Update'}`,
        body: buildStatusUpdateEmail(oldEnquiry, newStatus, notes),
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Booking status update failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get booking analytics
 */
export const getBookingAnalytics = async () => {
  try {
    const enquiries = await base44.entities.BookingEnquiry.list();
    
    const analytics = {
      total: enquiries.length,
      by_status: {},
      by_type: {},
      by_location: {},
      by_referral: {},
      conversion_rate: 0,
      avg_response_time: 0,
      recent_enquiries: [],
    };
    
    // Aggregate by status
    BOOKING_STATUSES.forEach(status => {
      analytics.by_status[status] = enquiries.filter(e => e.status === status).length;
    });
    
    // Aggregate by type
    BOOKING_TYPES.forEach(type => {
      analytics.by_type[type] = enquiries.filter(e => e.booking_type === type).length;
    });
    
    // Aggregate by location
    const locations = [...new Set(enquiries.map(e => e.location).filter(Boolean))];
    locations.forEach(loc => {
      analytics.by_location[loc] = enquiries.filter(e => e.location === loc).length;
    });
    
    // Aggregate by referral source
    const referrals = [...new Set(enquiries.map(e => e.referral_source).filter(Boolean))];
    referrals.forEach(ref => {
      analytics.by_referral[ref] = enquiries.filter(e => e.referral_source === ref).length;
    });
    
    // Calculate conversion rate (confirmed / total)
    const confirmed = enquiries.filter(e => e.status === 'confirmed').length;
    analytics.conversion_rate = enquiries.length > 0 ? (confirmed / enquiries.length) * 100 : 0;
    
    // Get recent enquiries
    analytics.recent_enquiries = enquiries
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 10);
    
    return { success: true, analytics };
  } catch (error) {
    console.error('Booking analytics failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Build confirmation email
 */
const buildConfirmationEmail = (data, enquiryId) => {
  return `Hi ${data.full_name},\n\nThank you for your booking enquiry!\n\nEnquiry Details:\n- Type: ${data.booking_type.replace(/_/g, ' ')}\n- Date: ${data.event_date || 'TBD'}\n- Location: ${data.location || 'TBD'}\n- Enquiry ID: ${enquiryId}\n\nOur team will review your enquiry and respond within 2-3 business days.\n\nIf you have any urgent questions, please reply to this email.\n\nWarm regards,\nGannon Waye Team\nhello@gannonwaye.com`;
};

/**
 * Build status update email
 */
const buildStatusUpdateEmail = (enquiry, status, notes) => {
  if (status === 'confirmed') {
    return `Hi ${enquiry.full_name},\n\nGreat news! Your booking enquiry has been CONFIRMED.\n\nBooking Details:\n- Type: ${enquiry.booking_type.replace(/_/g, ' ')}\n- Date: ${enquiry.event_date}\n- Location: ${enquiry.location}\n- Enquiry ID: ${enquiry.id}\n\n${notes ? `Notes: ${notes}\n\n` : ''}Next Steps:\nOur team will be in touch shortly with contract details and payment information.\n\nWe're excited to work with you!\n\nWarm regards,\nGannon Waye Team`;
  }
  
  return `Hi ${enquiry.full_name},\n\nThank you for your booking enquiry.\n\nStatus Update: ${status.replace(/_/g, ' ')}\n\nEnquiry ID: ${enquiry.id}\n\n${notes ? `Notes: ${notes}\n\n` : ''}If you have any questions, please don't hesitate to reach out.\n\nWarm regards,\nGannon Waye Team`;
};

export { BOOKING_TYPES, BOOKING_STATUSES };

const bookingSystem = {
  createBookingEnquiry,
  updateBookingStatus,
  getBookingAnalytics,
  BOOKING_TYPES,
  BOOKING_STATUSES,
};

export default bookingSystem;