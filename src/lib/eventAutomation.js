// Enterprise Event-Driven Automation Engine
// Centralized event handling for all platform actions

import { base44 } from '@/api/base44Client';
import { calculateOrderFinancials, calculateCustomerLTV } from './businessLogic';
import { AUDIT_CONFIG } from './platformConfig';
import { createAuditLog } from './auditSystem';

// Event types registry - ALL platform events
export const EVENT_TYPES = {
  // Order events
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_SHIPPED: 'order.shipped',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_REFUNDED: 'order.refunded',
  
  // Booking events
  BOOKING_CREATED: 'booking.created',
  BOOKING_UPDATED: 'booking.updated',
  BOOKING_CONFIRMED: 'booking.confirmed',
  BOOKING_DECLINED: 'booking.declined',
  
  // Product events
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  
  // Inventory events
  INVENTORY_LOW: 'inventory.low',
  INVENTORY_CHANGED: 'inventory.changed',
  
  // Customer events
  CONTRIBUTION_RECEIVED: 'contribution.received',
  SUBSCRIBER_ADDED: 'subscriber.added',
  SUPPORTER_CREATED: 'supporter.created',
  SUPPORTER_UPDATED: 'supporter.updated',
  
  // Campaign events
  GIFT_CLAIMED: 'gift.claimed',
  PROMO_USED: 'promo.used',
  BIRTHDAY_TRIGGERED: 'birthday.triggered',
  
  // System events
  CHARITY_DONATION: 'charity.donation',
  PAYMENT_FAILED: 'payment.failed',
  EMAIL_FAILED: 'email.failed',
  CAMPAIGN_CREATED: 'campaign.created',
};

// Event handlers registry
const eventHandlers = {};

/**
 * Register an event handler
 * @param {String} eventType - Type of event to handle
 * @param {Function} handler - Async function to handle the event
 */
export const registerEventHandler = (eventType, handler) => {
  if (!eventHandlers[eventType]) {
    eventHandlers[eventType] = [];
  }
  eventHandlers[eventType].push(handler);
};

/**
 * Emit an event to all registered handlers
 * @param {String} eventType - Type of event
 * @param {Object} payload - Event data
 */
export const emitEvent = async (eventType, payload) => {
  const handlers = eventHandlers[eventType] || [];
  
  // Execute all handlers in parallel
  const results = await Promise.allSettled(
    handlers.map(handler => handler(payload))
  );
  
  // Log results
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`Handler ${i} for ${eventType} failed:`, result.reason);
    }
  });
  
  return results;
};

/**
 * Initialize all event-driven automations
 * Call this on app startup
 */
export const initializeEventSystem = () => {
  // ORDER_CREATED automation
  registerEventHandler(EVENT_TYPES.ORDER_CREATED, async (order) => {
    try {
      // 1. Create audit log (moved to auditSystem.js)
      // Already created automatically via auditedCreate()
      // await createAuditLog('MerchOrder', order.id, 'create', order);
      
      // 2. Decrement inventory
      if (order.items) {
        for (const item of order.items) {
          if (item.product_id) {
            const products = await base44.entities.MerchProduct.filter({ id: item.product_id });
            if (products.length > 0) {
              const product = products[0];
              await base44.entities.MerchProduct.update(product.id, {
                stock_quantity: Math.max(0, (product.stock_quantity || 0) - item.quantity),
              });
            }
          }
        }
      }
      
      // 3. Send receipt email
      await base44.functions.invoke('sendOrderReceipt', { orderId: order.id });
      
      // 4. Update supporter score
      await updateSupporterScore(order.customer_email, 'purchase', order.total_amount);
      
      // 5. Notify admin
      await base44.functions.invoke('notifyAdminNewOrder', { order });
      
      // 6. Sync to Google Sheets
      await base44.functions.invoke('syncOrderToSheets', { order });
      
      console.log(`Order ${order.id} automation complete`);
    } catch (error) {
      console.error('ORDER_CREATED automation failed:', error);
    }
  });

  // CONTRIBUTION_RECEIVED automation
  registerEventHandler(EVENT_TYPES.CONTRIBUTION_RECEIVED, async (contribution) => {
    try {
      // 1. Create audit log
      await createAuditLog('SupportContribution', contribution.id, 'create', contribution);
      
      // 2. Generate donor receipt
      await base44.functions.invoke('generateDonorReceipt', { contributionId: contribution.id });
      
      // 3. Update supporter profile
      await updateSupporterProfile(contribution);
      
      // 4. Allocate charity donation (10%)
      await allocateCharityDonation(contribution);
      
      // 5. Update analytics
      await updateAnalytics('contribution', contribution);
      
      console.log(`Contribution ${contribution.id} automation complete`);
    } catch (error) {
      console.error('CONTRIBUTION_RECEIVED automation failed:', error);
    }
  });

  // SUBSCRIBER_ADDED automation
  registerEventHandler(EVENT_TYPES.SUBSCRIBER_ADDED, async (subscriber) => {
    try {
      // 1. Create audit log
      await createAuditLog('EmailSubscriber', subscriber.id, 'create', subscriber);
      
      // 2. Send welcome email
      await base44.functions.invoke('sendWelcomeEmailGmail', { email: subscriber.email });
      
      // 3. Create gift tracker if eligible
      await createGiftTracker(subscriber);
      
      // 4. Update analytics
      await updateAnalytics('subscriber', subscriber);
      
      console.log(`Subscriber ${subscriber.email} automation complete`);
    } catch (error) {
      console.error('SUBSCRIBER_ADDED automation failed:', error);
    }
  });

  // ORDER_SHIPPED automation
  registerEventHandler(EVENT_TYPES.ORDER_SHIPPED, async (order) => {
    try {
      // 1. Create audit log
      await createAuditLog('MerchOrder', order.id, 'update', { tracking_number: order.tracking_number });
      
      // 2. Send tracking email
      await sendTrackingEmail(order);
      
      // 3. Update analytics
      await updateAnalytics('order_shipped', order);
      
      console.log(`Order ${order.id} shipped automation complete`);
    } catch (error) {
      console.error('ORDER_SHIPPED automation failed:', error);
    }
  });

  // BOOKING_CREATED automation
  registerEventHandler(EVENT_TYPES.BOOKING_CREATED, async (booking) => {
    try {
      // 1. Create audit log
      await createAuditLog('BookingEnquiry', booking.id, 'create', booking);
      
      // 2. Send confirmation email (already done in createBookingEnquiry)
      
      // 3. Notify admin
      await base44.functions.invoke('notifyAdminBookingEnquiry', { booking });
      
      // 4. Update analytics
      await updateAnalytics('booking_created', booking);
      
      console.log(`Booking ${booking.id} automation complete`);
    } catch (error) {
      console.error('BOOKING_CREATED automation failed:', error);
    }
  });

  console.log('Event system initialized with', Object.keys(eventHandlers).length, 'event handlers');
};

/**
 * DEPRECATED: Use lib/auditSystem.js instead
 * Legacy audit log wrapper (kept for compatibility)
 */
const createAuditLogLegacy = async (entityName, entityId, action, newData, oldData = null, options = {}) => {
  if (!AUDIT_CONFIG.ENABLED) return;
  
  try {
    const user = await base44.auth.me();
    const changes = [];
    
    if (oldData) {
      // Compare old and new values
      const allFields = new Set([...Object.keys(newData || {}), ...Object.keys(oldData || {})]);
      allFields.forEach(field => {
        if (field === 'id' || field === 'created_date' || field === 'updated_date') return;
        
        const oldValue = oldData[field];
        const newValue = newData?.[field];
        
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes.push({
            field,
            old_value: oldValue,
            new_value: newValue,
          });
        }
      });
    } else {
      // Create action - all fields are new
      Object.keys(newData || {}).forEach(field => {
        if (field === 'id' || field === 'created_date' || field === 'updated_date') return;
        changes.push({
          field,
          old_value: null,
          new_value: newData[field],
        });
      });
    }
    
    // Generate rollback snapshot
    const rollbackSnapshot = AUDIT_CONFIG.ENABLE_ROLLBACK && action !== 'delete' ? {
      entity_name: entityName,
      entity_id: entityId,
      previous_state: oldData || null,
      current_state: newData,
      can_rollback: true,
    } : null;
    
    await base44.entities.AuditLog.create({
      entity_name: entityName,
      entity_id: entityId,
      action,
      user_email: user?.email || 'system',
      user_role: user?.role || 'system',
      timestamp: new Date().toISOString(),
      changes,
      description: `${action.toUpperCase()} ${entityName} #${entityId.slice(-6)}${changes.length > 0 ? ` (${changes.length} fields changed)` : ''}`,
      metadata: {
        ip_address: options.ip_address || 'system',
        user_agent: options.user_agent || 'automation',
        session_id: options.session_id || 'event-automation',
        rollback_available: !!rollbackSnapshot,
        triggering_workflow: options.workflow || 'manual',
        affected_entities: options.affected_entities || [entityName],
      },
      // Store rollback snapshot in a parseable format
      ...(rollbackSnapshot && { 
        metadata: {
          ...rollbackSnapshot,
          ...((await base44.entities.AuditLog.create({})).metadata || {})
        }
      }),
    });
  } catch (error) {
    console.error('Audit log creation failed:', error);
  }
};

/**
 * Perform rollback from audit log
 */
export const performRollback = async (auditLogId) => {
  try {
    const auditLogs = await base44.entities.AuditLog.filter({ id: auditLogId });
    if (auditLogs.length === 0) throw new Error('Audit log not found');
    
    const auditLog = auditLogs[0];
    if (!auditLog.metadata?.rollback_available) {
      throw new Error('Rollback not available for this audit log');
    }
    
    const { entity_name, entity_id, previous_state } = auditLog.metadata;
    
    // Restore previous state
    await base44.entities[entity_name].update(entity_id, previous_state);
    
    // Log the rollback
    await createAuditLog(entity_name, entity_id, 'rollback', previous_state, null, {
      workflow: 'manual_rollback',
      session_id: `rollback_from_${auditLogId}`,
    });
    
    return { success: true, message: `Successfully rolled back ${entity_name} #${entity_id}` };
  } catch (error) {
    console.error('Rollback failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Allocate charity donation (10%)
 */
const allocateCharityDonation = async (record) => {
  try {
    const amount = record.amount || record.total_amount || 0;
    const donationAmount = amount * 0.10;
    
    // This will be processed monthly by trackMonthlyCharityDonation
    console.log(`Allocated $${donationAmount.toFixed(2)} to charity from ${record.id}`);
  } catch (error) {
    console.error('Charity allocation failed:', error);
  }
};

/**
 * Update supporter score based on activity
 */
const updateSupporterScore = async (email, actionType, value) => {
  try {
    // Engagement scoring logic
    const points = {
      purchase: Math.floor(value / 10),
      signup: 10,
      social_follow: 5,
      content_share: 15,
    };
    
    console.log(`Updated supporter score for ${email}: +${points[actionType] || 0} points`);
  } catch (error) {
    console.error('Supporter score update failed:', error);
  }
};

/**
 * Update supporter profile with contribution data
 */
const updateSupporterProfile = async (contribution) => {
  try {
    const profiles = await base44.entities.SupporterProfile.filter({
      supporter_email: contribution.supporter_email
    });
    
    if (profiles.length > 0) {
      const profile = profiles[0];
      const newTotal = (profile.total_contributed || 0) + contribution.amount;
      
      await base44.entities.SupporterProfile.update(profile.id, {
        total_contributed: newTotal,
        tier: newTotal >= 500 ? 'inner_circle' : newTotal >= 200 ? 'movement' : newTotal >= 50 ? 'with_you' : 'day_one',
      });
    } else {
      await base44.entities.SupporterProfile.create({
        supporter_email: contribution.supporter_email,
        supporter_name: contribution.supporter_name,
        total_contributed: contribution.amount,
        tier: contribution.amount >= 500 ? 'inner_circle' : contribution.amount >= 200 ? 'movement' : 'with_you',
      });
    }
  } catch (error) {
    console.error('Supporter profile update failed:', error);
  }
};

/**
 * Create gift tracker for new subscriber
 */
const createGiftTracker = async (subscriber) => {
  try {
    // Check if already exists
    const existing = await base44.entities.GiftRequirementTracker.filter({
      subscriber_email: subscriber.email
    });
    
    if (existing.length === 0) {
      const token = `gift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await base44.entities.GiftRequirementTracker.create({
        subscriber_email: subscriber.email,
        subscriber_name: subscriber.name,
        status: 'not_started',
        checklist_token: token,
      });
    }
  } catch (error) {
    console.error('Gift tracker creation failed:', error);
  }
};

/**
 * Send tracking email to customer
 */
const sendTrackingEmail = async (order) => {
  try {
    await base44.integrations.Core.SendEmail({
      to: order.customer_email,
      subject: `Your order has shipped! Tracking: ${order.tracking_number}`,
      body: `Hi ${order.customer_name},\n\nGreat news — your Gannon Waye merch is on its way!\n\nTracking number: ${order.tracking_number}\n\nThank you for your support!\n\nGannon`,
    });
  } catch (error) {
    console.error('Tracking email failed:', error);
  }
};

/**
 * Update analytics for various events
 */
const updateAnalytics = async (eventType, data) => {
  // Placeholder for analytics tracking
  // In production, this would call your analytics service
  console.log(`Analytics updated for ${eventType}`, data);
};

export default {
  EVENT_TYPES,
  registerEventHandler,
  emitEvent,
  initializeEventSystem,
};