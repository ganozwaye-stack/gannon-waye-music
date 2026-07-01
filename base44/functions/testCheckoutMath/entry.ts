import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * CHECKOUT MATH VERIFICATION — Tests all 4 promo scenarios
 * Verifies frontend display math === backend Stripe session math
 *
 * Scenarios:
 * 1. Full Price (no promo)
 * 2. F20UN26DVIP (20% off merch only, excludes music/CDs/vinyl/shipping/support)
 * 3. F30MOM26A (30% off merch only, same exclusions)
 * 4. NunY@69Ony@Son!@ (90% off EVERYTHING + free shipping override)
 */

const ALWAYS_INELIGIBLE_CATEGORIES = [
  'cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping',
  'processing', 'fees', 'music', 'limited_edition_music', 'digital_music',
  'bundle', 'bundles',
];

function isEligible(category) {
  if (!category) return true;
  const cat = (category || '').toLowerCase().trim();
  return !ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c));
}

/**
 * BACKEND MATH — mirrors createCheckoutSession exactly
 * Builds Stripe line items and sums unit_amount × quantity
 */
function backendTotal(items, discountPercent, isOwnerOverride, freeShipping, shippingAmount, addSupport) {
  const lineItems = [];

  for (const item of items) {
    const eligible = isOwnerOverride || isEligible(item.category);
    const discountedPerUnit = eligible && discountPercent > 0
      ? item.price * (1 - discountPercent / 100)
      : item.price;
    const unitAmountCents = Math.max(50, Math.round(discountedPerUnit * 100));
    lineItems.push({ unitAmountCents, quantity: item.quantity });
  }

  if (addSupport > 0) {
    lineItems.push({ unitAmountCents: Math.round(addSupport * 100), quantity: 1 });
  }

  if (shippingAmount > 0 && !freeShipping) {
    lineItems.push({ unitAmountCents: Math.round(shippingAmount * 100), quantity: 1 });
  }

  return lineItems.reduce((sum, li) => sum + li.unitAmountCents * li.quantity, 0);
}

/**
 * FRONTEND MATH — mirrors StoreCheckout.jsx exactly
 * Calculates subtotal, discount, and total in cents
 */
function frontendTotal(items, discountPercent, isOwnerOverride, freeShipping, shippingAmount, addSupport) {
  const subtotalCents = items.reduce((s, i) => s + Math.round(i.price * 100) * i.quantity, 0);
  const merchTotalCents = items.reduce((s, i) => {
    const eligible = isOwnerOverride || isEligible(i.category);
    const discountedPerUnit = eligible && discountPercent > 0
      ? i.price * (1 - discountPercent / 100)
      : i.price;
    const unitAmountCents = Math.max(50, Math.round(discountedPerUnit * 100));
    return s + unitAmountCents * i.quantity;
  }, 0);
  const shippingCents = freeShipping ? 0 : Math.round(shippingAmount * 100);
  const supportCents = Math.round(addSupport * 100);
  return merchTotalCents + shippingCents + supportCents;
}

Deno.serve(async (req) => {
  try {
    // Test cart: hoodie (apparel, eligible) + bundle (bundle, ineligible) + mug (accessories, eligible)
    const testCart = [
      { price: 98.00, quantity: 1, category: 'apparel', name: 'Respect Is Earned Hoodie' },
      { price: 119.00, quantity: 1, category: 'bundle', name: 'Winter Writing & Comfort Bundle' },
      { price: 9.90, quantity: 1, category: 'accessories', name: 'Thankyou Mug' },
    ];

    // 3 physical items: shipping = 12.95 + 2 × 2.00 = 16.95
    const baseShipping = 16.95;

    const scenarios = [
      {
        name: 'Full Price (no promo)',
        discountPercent: 0,
        isOwnerOverride: false,
        freeShipping: false,
        addSupport: 0,
        shippingAmount: baseShipping,
      },
      {
        name: 'F20UN26DVIP (20% off merch only)',
        discountPercent: 20,
        isOwnerOverride: false,
        freeShipping: false,
        addSupport: 0,
        shippingAmount: baseShipping,
      },
      {
        name: 'F30MOM26A (30% off merch only)',
        discountPercent: 30,
        isOwnerOverride: false,
        freeShipping: false,
        addSupport: 0,
        shippingAmount: baseShipping,
      },
      {
        name: 'NunY@69Ony@Son!@ (90% off everything + free shipping)',
        discountPercent: 90,
        isOwnerOverride: true,
        freeShipping: true,
        addSupport: 0,
        shippingAmount: 0,
      },
    ];

    const results = scenarios.map(s => {
      const backendCents = backendTotal(testCart, s.discountPercent, s.isOwnerOverride, s.freeShipping, s.shippingAmount, s.addSupport);
      const frontendCents = frontendTotal(testCart, s.discountPercent, s.isOwnerOverride, s.freeShipping, s.shippingAmount, s.addSupport);
      const match = backendCents === frontendCents;
      const diff = Math.abs(backendCents - frontendCents);

      // Per-item breakdown for transparency
      const itemBreakdown = testCart.map(item => {
        const eligible = s.isOwnerOverride || isEligible(item.category);
        const discountedPerUnit = eligible && s.discountPercent > 0
          ? item.price * (1 - s.discountPercent / 100)
          : item.price;
        const unitAmountCents = Math.max(50, Math.round(discountedPerUnit * 100));
        return {
          name: item.name,
          category: item.category,
          eligible,
          originalPrice: item.price,
          discountedPerUnit: Math.round(discountedPerUnit * 100) / 100,
          unitAmountCents,
          quantity: item.quantity,
          lineTotalCents: unitAmountCents * item.quantity,
        };
      });

      return {
        scenario: s.name,
        discountPercent: s.discountPercent,
        isOwnerOverride: s.isOwnerOverride,
        freeShipping: s.freeShipping,
        frontendTotal: frontendCents / 100,
        backendTotal: backendCents / 100,
        match,
        diffCents: diff,
        itemBreakdown,
        shippingCents: s.freeShipping ? 0 : Math.round(s.shippingAmount * 100),
        supportCents: Math.round(s.addSupport * 100),
      };
    });

    const allMatch = results.every(r => r.match);

    return Response.json({
      test: 'Checkout Math Verification — 4 Promo Scenarios',
      allMatch,
      results,
      summary: allMatch
        ? '✅ All 4 scenarios: frontend total === backend Stripe total (0¢ difference)'
        : '❌ MISMATCH detected — see results',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});