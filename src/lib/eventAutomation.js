/**
 * SIMPLIFIED EVENT TYPES
 * 
 * This file previously contained an in-memory event handler registry.
 * That has been REMOVED — it was infrastructure theater (non-persistent,
 * lost on reload, no retry, no durability).
 *
 * What remains: a plain constants object for event type names,
 * used as documentation strings in audit logs and console output.
 *
 * Real side effects (email, inventory, profile) are now called DIRECTLY
 * in the flow that produces the event, not through an event bus.
 */

export const EVENT_TYPES = {
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_SHIPPED: 'order.shipped',
  CONTRIBUTION_RECEIVED: 'contribution.received',
  SUBSCRIBER_ADDED: 'subscriber.added',
  BOOKING_CREATED: 'booking.created',
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  INVENTORY_LOW: 'inventory.low',
};

/** No-op kept for backward-compat with any remaining callers. Safe to remove later. */
export const emitEvent = async (eventType, payload) => {
  console.log(`[event] ${eventType}`, payload?.id || '');
};

/** No-op. Event system removed. */
export const registerEventHandler = () => {};

/** No-op. Event system removed. */
export const initializeEventSystem = () => {
  console.log('[events] Simplified event system active — no in-memory registry');
};

export default { EVENT_TYPES, emitEvent, registerEventHandler, initializeEventSystem };