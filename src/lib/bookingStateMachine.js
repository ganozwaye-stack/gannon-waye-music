// Booking State Machine — Enforce valid transitions
export const BOOKING_STATES = {
  NEW_ENQUIRY: 'new_enquiry',
  REVIEWING: 'reviewing',
  CONTACTED: 'contacted',
  NEGOTIATING: 'negotiating',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  DECLINED: 'declined',
  ARCHIVED: 'archived',
};

const VALID_TRANSITIONS = {
  new_enquiry: ['reviewing', 'declined', 'archived'],
  reviewing: ['contacted', 'declined', 'archived'],
  contacted: ['negotiating', 'declined', 'archived'],
  negotiating: ['confirmed', 'declined', 'archived'],
  confirmed: ['completed', 'archived'],
  completed: ['archived'],
  declined: ['archived'],
  archived: [],
};

export const canTransition = (currentState, nextState) => {
  if (currentState === nextState) return true;
  return VALID_TRANSITIONS[currentState]?.includes(nextState) || false;
};

export const transitionBooking = async (base44, bookingId, currentState, nextState) => {
  if (!canTransition(currentState, nextState)) {
    throw new Error(`Invalid transition: ${currentState} → ${nextState}`);
  }

  await base44.entities.BookingEnquiry.update(bookingId, {
    status: nextState,
    last_updated: new Date().toISOString(),
  });

  return { success: true, from: currentState, to: nextState };
};

export default { BOOKING_STATES, canTransition, transitionBooking };