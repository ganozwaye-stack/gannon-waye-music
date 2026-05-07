/**
 * CENTRALIZED CHECKOUT CALCULATIONS
 * Single source of truth for all order totals
 * NO PAGE-LEVEL MATH. Use this everywhere.
 */

import { FINANCIAL_CONFIG } from './platformConfig';

/**
 * Calculate complete checkout total (base + fees)
 * Used by: BackThis, Store, Orders, Invoices, Receipts
 * @param {number} baseAmount - Amount before fees
 * @param {boolean} includeCharity - Include 10% charity allocation
 * @returns {Object} { baseAmount, gst, merchantFee, total, charityAllocation }
 */
export const calculateCheckoutTotal = (baseAmount, includeCharity = false) => {
  const base = Number(baseAmount) || 0;
  
  // GST calculation (always on base)
  const gst = base * FINANCIAL_CONFIG.GST_RATE;
  
  // Merchant fee (Stripe/payment processor)
  const merchantFee = base * FINANCIAL_CONFIG.MERCHANT_FEE_RATE;
  
  // Charity allocation (10% of base for donations)
  const charityAllocation = includeCharity ? base * FINANCIAL_CONFIG.CHARITY_DONATION_RATE : 0;
  
  // Total charged to customer
  const total = base + gst + merchantFee;
  
  return {
    baseAmount: base,
    gst: Number(gst.toFixed(2)),
    merchantFee: Number(merchantFee.toFixed(2)),
    charityAllocation: Number(charityAllocation.toFixed(2)),
    total: Number(total.toFixed(2)),
    breakdown: {
      label: `$${base.toFixed(2)} (base) + $${gst.toFixed(2)} GST + $${merchantFee.toFixed(2)} fee`,
    },
  };
};

/**
 * Calculate order totals with item-level detail
 * @param {Array} items - Order items [{ price, quantity }]
 * @returns {Object} Complete order financial breakdown
 */
export const calculateOrderTotal = (items = []) => {
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  
  const gst = subtotal * FINANCIAL_CONFIG.GST_RATE;
  const merchantFee = subtotal * FINANCIAL_CONFIG.MERCHANT_FEE_RATE;
  const total = subtotal + gst + merchantFee;
  
  return {
    subtotal: Number(subtotal.toFixed(2)),
    itemCount: items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
    gst: Number(gst.toFixed(2)),
    merchantFee: Number(merchantFee.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

/**
 * Validate checkout total matches expected
 * Used for fraud detection and consistency checks
 */
export const validateCheckoutTotal = (expectedTotal, actualTotal, tolerance = 0.01) => {
  const difference = Math.abs(expectedTotal - actualTotal);
  return difference <= tolerance;
};

export default {
  calculateCheckoutTotal,
  calculateOrderTotal,
  validateCheckoutTotal,
};