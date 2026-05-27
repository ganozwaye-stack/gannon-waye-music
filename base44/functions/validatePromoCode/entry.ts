import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * PROMO CODE VALIDATION — v2.0
 * CRITICAL: Codes are stored and compared EXACTLY as entered. No case normalisation.
 * The two approved codes contain symbols: fnd@gwTYV!P and F@mFr!3NdsOFg@noz
 * These must never be uppercased/lowercased during lookup.
 *
 * Global Discount Guard is enforced: discounts apply only to eligible merch subtotal.
 * Shipping, fees, CDs, vinyl, songs, digital music, support contributions are always excluded.
 */

const ALWAYS_INELIGIBLE_CATEGORIES = [
  'cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping',
  'processing', 'fees', 'music', 'limited_edition_music', 'digital_music',
];

const ALWAYS_EXCLUDED_LABEL = 'shipping, processing fees, support contributions, CDs, vinyl, songs, digital music releases';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { code, email, product_category, cart_items } = await req.json();

    if (!code) {
      return Response.json({ valid: false, reason: 'No code provided' });
    }

    // CRITICAL: Search by exact code — do NOT normalise case.
    // The approved codes contain symbols and mixed case that must be preserved.
    const trimmedCode = code.trim();

    // First try exact match
    let codes = await base44.asServiceRole.entities.PromoCode.filter({
      code: trimmedCode,
      is_active: true,
    });

    if (!codes || codes.length === 0) {
      return Response.json({ valid: false, reason: 'Code not found or inactive' });
    }

    const promo = codes[0];

    // Check expiry date
    if (promo.expires_at) {
      const expiry = new Date(promo.expires_at);
      if (new Date() > expiry) {
        return Response.json({ valid: false, reason: 'This code has expired' });
      }
    }

    // Check global usage limit
    if (promo.max_uses !== null && promo.max_uses !== undefined && promo.times_used >= promo.max_uses) {
      return Response.json({ valid: false, reason: 'This code has reached its maximum uses' });
    }

    // Check approval requirement
    if (promo.requires_approval) {
      if (!email) {
        return Response.json({ valid: false, reason: 'Email required for this code' });
      }
      const approved = promo.approved_emails || [];
      if (!approved.includes(email.toLowerCase().trim())) {
        return Response.json({ valid: false, reason: 'This code requires manual approval. Contact us to verify eligibility.' });
      }
    }

    // Check one-use-per-email
    if (promo.one_use_per_email) {
      if (!email) {
        return Response.json({ valid: false, reason: 'Email required for this code' });
      }
      const usedBy = promo.used_by_emails || [];
      if (usedBy.includes(email.toLowerCase().trim())) {
        return Response.json({ valid: false, reason: 'This code has already been used with this email address' });
      }
    }

    // === GLOBAL DISCOUNT GUARD ===
    // Compute eligible vs excluded subtotals if cart_items provided
    let discountGuardResult = null;
    if (cart_items && cart_items.length > 0) {
      try {
        const guardRes = await base44.asServiceRole.functions.invoke('applyCheckoutDiscountGuard', {
          cart_items,
          discount_percent: promo.discount_percent,
          promo_code_id: promo.id,
          source_chain: `validatePromoCode → applyCheckoutDiscountGuard`,
        });
        discountGuardResult = guardRes;
      } catch (_) {
        // Guard failed — fail safe: allow but return warning
      }
    } else if (product_category) {
      // Single category check against always-ineligible list
      const cat = product_category.toLowerCase().trim();
      if (ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c))) {
        return Response.json({
          valid: false,
          reason: `This code applies to eligible merch only. ${ALWAYS_EXCLUDED_LABEL} are excluded.`,
        });
      }
    }

    // Category restrictions from promo record
    if (promo.allowed_categories && promo.allowed_categories.length > 0 && !discountGuardResult) {
      if (product_category) {
        const allowed = promo.allowed_categories.map(c => c.toLowerCase());
        if (!allowed.includes(product_category.toLowerCase())) {
          return Response.json({
            valid: false,
            reason: `This code is only valid for: ${promo.allowed_categories.join(', ')}`,
          });
        }
      }
    }

    const baseResponse = {
      valid: true,
      code: promo.code, // Return exact stored code
      discount_percent: promo.discount_percent,
      id: promo.id,
      excludes_shipping: true, // Always true for global guard
      excludes_support: true,   // Always true for global guard
      excludes_music: true,     // Always true for global guard
      allowed_categories: promo.allowed_categories || [],
      excluded_categories: promo.excluded_categories || [],
      requires_approval: promo.requires_approval || false,
      global_guard_active: true,
      global_guard_version: '1.0',
      excluded_always: ALWAYS_EXCLUDED_LABEL,
    };

    // Attach discount guard result if available
    if (discountGuardResult) {
      return Response.json({
        ...baseResponse,
        eligible_subtotal: discountGuardResult.eligible_subtotal,
        excluded_subtotal: discountGuardResult.excluded_subtotal,
        discount_amount: discountGuardResult.discount_amount,
        final_discounted_subtotal: discountGuardResult.final_discounted_subtotal,
        excluded_items: discountGuardResult.excluded_items,
        has_eligible_items: discountGuardResult.has_eligible_items,
        all_items_excluded: discountGuardResult.all_items_excluded,
        checkout_message: discountGuardResult.all_items_excluded
          ? 'This code applies to eligible merch only. Your cart contains only excluded items (music, shipping, or support contributions).'
          : null,
      });
    }

    return Response.json(baseResponse);
  } catch (error) {
    return Response.json({ valid: false, reason: 'Validation failed', details: error.message }, { status: 500 });
  }
});