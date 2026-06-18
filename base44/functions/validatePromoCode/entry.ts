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
      const approved = (promo.approved_emails || []).map(e => e.toLowerCase().trim());
      const emailLower = email.toLowerCase().trim();
      if (!approved.includes(emailLower)) {
        return Response.json({ valid: false, reason: 'This code requires manual approval. Contact us to verify eligibility.' });
      }
    }

    // === OWNER OVERRIDE CODE ===
    // If this promo has 90%+ discount and requires_approval and is restricted to specific emails,
    // it's an owner override — bypass category guards entirely
    const isOwnerOverride = promo.discount_percent >= 90 && promo.requires_approval && (promo.approved_emails || []).length > 0;
    if (isOwnerOverride) {
      return Response.json({
        valid: true,
        code: promo.code,
        discount_percent: promo.discount_percent,
        id: promo.id,
        is_owner_override: true,
        override_applies_to_all: true,
        excludes_shipping: promo.excludes_shipping ?? true,
        global_guard_active: false, // Override bypasses guard
        note: 'Owner override code — applies to all items including ineligible categories',
      });
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

    // === CART ITEM CATEGORY RESOLUTION & REJECTION ===
    // Resolve product categories from DB when missing, then check against promo exclusions.
    // CRITICAL: If ALL cart items are ineligible/excluded, return valid: false immediately.
    let discountGuardResult = null;

    if (cart_items && cart_items.length > 0) {
      // Step 1: Resolve categories for any items missing one
      const resolvedItems = [];
      for (const item of cart_items) {
        let resolved = { ...item };
        if (!resolved.category && (resolved.product_id || resolved.id)) {
          try {
            const pid = resolved.product_id || resolved.id;
            const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: pid });
            if (products && products.length > 0) {
              resolved.category = products[0].category;
              resolved.name = resolved.name || products[0].name;
              resolved.promo_eligible = products[0].promo_eligible;
              resolved.discount_excluded = products[0].discount_excluded;
              resolved.exclude_from_discounts = products[0].exclude_from_discounts;
              resolved.discount_lock_reason = products[0].discount_lock_reason;
            }
          } catch (_) { /* keep as-is */ }
        }
        resolvedItems.push(resolved);
      }

      // Step 2: Classify each item as eligible or ineligible
      const promoExcludedCats = (promo.excluded_categories || []).map(c => c.toLowerCase());
      const promoAllowedCats = (promo.allowed_categories || []).map(c => c.toLowerCase());

      function isItemIneligible(item) {
        if (item.discount_excluded || item.exclude_from_discounts || item.promo_eligible === false) return true;

        const cat = (item.category || item.product_type || item.type || '').toLowerCase().trim();
        const name = (item.name || item.product_name || '').toLowerCase();

        // Always-ineligible categories (global rule)
        if (ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c))) return true;

        // Name-based CD/vinyl detection for items with missing/empty category
        if (!cat || cat === 'other') {
          if (/\bcd\b/.test(name) || /\bvinyl\b/.test(name) || name.includes('digital download')) return true;
        }

        // Promo-level excluded categories
        if (promoExcludedCats.length > 0 && promoExcludedCats.some(c => cat.includes(c))) return true;

        // Promo-level allowed categories restriction
        if (promoAllowedCats.length > 0 && cat && !promoAllowedCats.some(c => cat.includes(c))) return true;

        return false;
      }

      const eligibleItems = resolvedItems.filter(i => !isItemIneligible(i));
      const ineligibleItems = resolvedItems.filter(i => isItemIneligible(i));

      // Step 3: REJECT if every item in cart is ineligible
      if (eligibleItems.length === 0 && ineligibleItems.length > 0) {
        const ineligibleNames = ineligibleItems.map(i => i.name || i.category || 'item').join(', ');
        return Response.json({
          valid: false,
          reason: `This code does not apply to items in your cart (${ineligibleNames}). It is valid for eligible merch only — ${ALWAYS_EXCLUDED_LABEL} are excluded.`,
          ineligible_items: ineligibleItems.map(i => ({ name: i.name, category: i.category })),
        });
      }

      // Step 4: Pass to discount guard for amount calculation (has eligible items)
      try {
        const guardRes = await base44.asServiceRole.functions.invoke('applyCheckoutDiscountGuard', {
          cart_items: resolvedItems,
          discount_percent: promo.discount_percent,
          promo_code_id: promo.id,
          source_chain: `validatePromoCode → applyCheckoutDiscountGuard`,
        });
        discountGuardResult = guardRes;
      } catch (_) { /* non-fatal — amounts computed at checkout */ }

    } else if (product_category) {
      // Single category check (legacy path)
      const cat = product_category.toLowerCase().trim();
      if (ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c))) {
        return Response.json({
          valid: false,
          reason: `This code applies to eligible merch only. ${ALWAYS_EXCLUDED_LABEL} are excluded.`,
        });
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
