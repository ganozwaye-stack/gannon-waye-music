import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * PROMO CODE VALIDATION — v2.1
 * CRITICAL: Codes are stored and compared EXACTLY as entered. No case normalisation.
 * The two approved codes contain symbols: fnd@gwTYV!P and F@mFr!3NdsOFg@noz
 * These must never be uppercased/lowercased during lookup.
 *
 * Global Discount Guard is enforced: discounts apply only to eligible merch subtotal.
 * Shipping, fees, CDs, vinyl, songs, digital music, support contributions are always excluded.
 * 
 * FIX v2.1: Removed User entity lookup. one_use_per_email check uses stored used_by_emails
 * array only (via asServiceRole) — no authenticated user session required.
 */

const ALWAYS_INELIGIBLE_CATEGORIES = [
  'cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping',
  'processing', 'fees', 'music', 'limited_edition_music', 'digital_music',
];

const ALWAYS_EXCLUDED_LABEL = 'shipping, processing fees, support contributions, CDs, vinyl, songs, digital music releases';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { code, product_category, cart_items } = body;

    // Accept email from any common field name — trim+lowercase once
    const rawEmail = body.email || body.customer_email || body.customerEmail
      || body.shopper_email || body.shopperEmail || body.billing_email || '';
    const email = rawEmail.toLowerCase().trim();

    if (!code) {
      return Response.json({ valid: false, reason: 'No code provided' });
    }

    // CRITICAL: Search by exact code — do NOT normalise case.
    const trimmedCode = code.trim();

    // Always use asServiceRole for promo lookups — no user session required
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
      if (!approved.includes(email)) {
        return Response.json({ valid: false, reason: 'This code requires manual approval. Contact us to verify eligibility.' });
      }
    }

    // SAFETY: High-discount codes ≥90% must always require approval + have approved_emails
    if (promo.discount_percent >= 90) {
      if (!promo.requires_approval || !(promo.approved_emails || []).length) {
        return Response.json({ valid: false, reason: 'High-value code is misconfigured — contact support.' });
      }
      if (!email) {
        return Response.json({ valid: false, reason: 'Email required for this code' });
      }
      const approved = (promo.approved_emails || []).map(e => e.toLowerCase().trim());
      if (!approved.includes(email)) {
        return Response.json({ valid: false, reason: 'This code requires manual approval. Contact us to verify eligibility.' });
      }
    }

    // === OWNER OVERRIDE CODE ===
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
        global_guard_active: false,
        note: 'Owner override code — applies to all items including ineligible categories',
      });
    }

    // Check one-use-per-email — uses stored used_by_emails array, no User entity lookup
    if (promo.one_use_per_email) {
      if (!email) {
        return Response.json({ valid: false, reason: 'Email required for this code' });
      }
      const usedBy = (promo.used_by_emails || []).map(e => e.toLowerCase().trim());
      if (usedBy.includes(email)) {
        return Response.json({ valid: false, reason: 'This code has already been used with this email address' });
      }
    }

    // === CART ITEM CATEGORY RESOLUTION & REJECTION ===
    let discountGuardResult = null;

    if (cart_items && cart_items.length > 0) {
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
            }
          } catch (_) { /* keep as-is */ }
        }
        resolvedItems.push(resolved);
      }

      const promoExcludedCats = (promo.excluded_categories || []).map(c => c.toLowerCase());
      const promoAllowedCats = (promo.allowed_categories || []).map(c => c.toLowerCase());

      function isItemIneligible(item) {
        const cat = (item.category || item.product_type || item.type || '').toLowerCase().trim();
        const name = (item.name || item.product_name || '').toLowerCase();
        if (ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c))) return true;
        if (!cat || cat === 'other') {
          if (/\bcd\b/.test(name) || /\bvinyl\b/.test(name) || name.includes('digital download')) return true;
        }
        if (promoExcludedCats.length > 0 && promoExcludedCats.some(c => cat.includes(c))) return true;
        if (promoAllowedCats.length > 0 && cat && !promoAllowedCats.some(c => cat.includes(c))) return true;
        return false;
      }

      const eligibleItems = resolvedItems.filter(i => !isItemIneligible(i));
      const ineligibleItems = resolvedItems.filter(i => isItemIneligible(i));

      if (eligibleItems.length === 0 && ineligibleItems.length > 0) {
        const ineligibleNames = ineligibleItems.map(i => i.name || i.category || 'item').join(', ');
        return Response.json({
          valid: false,
          reason: `This code does not apply to items in your cart (${ineligibleNames}). It is valid for eligible merch only — ${ALWAYS_EXCLUDED_LABEL} are excluded.`,
          ineligible_items: ineligibleItems.map(i => ({ name: i.name, category: i.category })),
        });
      }

      try {
        const guardRes = await base44.asServiceRole.functions.invoke('applyCheckoutDiscountGuard', {
          cart_items: resolvedItems,
          discount_percent: promo.discount_percent,
          promo_code_id: promo.id,
          source_chain: `validatePromoCode → applyCheckoutDiscountGuard`,
        });
        discountGuardResult = guardRes;
      } catch (_) { /* non-fatal */ }

    } else if (product_category) {
      const cat = product_category.toLowerCase().trim();
      if (ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c))) {
        return Response.json({
          valid: false,
          reason: `This code applies to eligible merch only. ${ALWAYS_EXCLUDED_LABEL} are excluded.`,
        });
      }
    } else {
      const hasAllowedCats = (promo.allowed_categories || []).length > 0;
      const hasExcludedCats = (promo.excluded_categories || []).length > 0;
      if (hasAllowedCats || hasExcludedCats) {
        return Response.json({
          valid: false,
          reason: 'Unable to verify product eligibility for this code. Please apply it from the checkout page after products are in your cart.',
        });
      }
    }

    const baseResponse = {
      valid: true,
      code: promo.code,
      discount_percent: promo.discount_percent,
      id: promo.id,
      excludes_shipping: true,
      excludes_support: true,
      excludes_music: true,
      allowed_categories: promo.allowed_categories || [],
      excluded_categories: promo.excluded_categories || [],
      requires_approval: promo.requires_approval || false,
      global_guard_active: true,
      global_guard_version: '2.1',
      excluded_always: ALWAYS_EXCLUDED_LABEL,
    };

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