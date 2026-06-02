import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * GLOBAL DISCOUNT GUARD — v1.0
 * This function is the single source of truth for ALL discount calculations.
 * It enforces permanent rules that cannot be bypassed at checkout.
 *
 * RULES (permanent, enforced server-side):
 * - Discounts apply ONLY to eligible merch product subtotals
 * - NEVER discounts: shipping, fees, processing, support/donations, music items (CD/vinyl/songs/digital)
 * - Eligible: apparel, accessories, hoodies, t-shirts, merch bundles (no music items)
 * - Ineligible: cd, vinyl, song, digital, support, donation, shipping, processing, limited_edition_music
 */

const DISCOUNT_GUARD_VERSION = '1.0';

const ALWAYS_INELIGIBLE_CATEGORIES = [
  'cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping',
  'processing', 'fees', 'music', 'limited_edition_music', 'digital_music',
  'music_bundle', 'other_music'
];

const ALWAYS_ELIGIBLE_CATEGORIES = [
  'apparel', 'accessories', 'hoodie', 'hoodies', 't-shirt', 't_shirt',
  'tshirt', 'jumper', 'merch', 'clothing'
];

// Name keywords that indicate a music/ineligible product regardless of category
const INELIGIBLE_NAME_KEYWORDS = [
  'cd', ' cd ', 'vinyl', 'album', 'digital download', 'digital music',
  'song download', 'mp3', 'wav', 'flac', 'single download', 'music download',
  'thank you cd', 'thankyou cd',
];

function categoriseItem(item) {
  const cat = (item.category || item.product_type || item.type || '').toLowerCase().trim();
  const name = (item.name || item.product_name || '').toLowerCase();

  // CRITICAL: Always check name for music keywords — catches items with missing/wrong category
  // Check name first with word-boundary awareness for 'cd'
  const nameLooksLikeMusic = INELIGIBLE_NAME_KEYWORDS.some(k => name.includes(k)) ||
    /\bcd\b/.test(name) ||
    /\bvinyl\b/.test(name);

  // Explicit category ineligible check
  if (ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c))) {
    return 'ineligible';
  }

  // Name-based ineligible fallback — catches category-less music items
  if (nameLooksLikeMusic) {
    return 'ineligible';
  }

  // Explicit eligible check
  if (ALWAYS_ELIGIBLE_CATEGORIES.some(c => cat.includes(c))) {
    return 'eligible';
  }

  // Special: if category is 'bundle', check if name contains music keywords
  if (cat === 'bundle' || cat === 'other') {
    const musicKeywords = ['cd', 'vinyl', 'album', 'ep', 'song', 'track', 'single', 'digital', 'music'];
    if (musicKeywords.some(k => name.includes(k))) return 'ineligible';
    return 'eligible';
  }

  // Default: fail closed — unknown/unresolved category is ineligible
  return 'ineligible';
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { cart_items, promo_code_id, discount_percent, source_chain } = body;

    if (!cart_items || cart_items.length === 0) {
      return Response.json({
        eligible_subtotal: 0,
        excluded_subtotal: 0,
        discount_amount: 0,
        final_discounted_subtotal: 0,
        eligible_items: [],
        excluded_items: [],
        reason_each_item_excluded: [],
        applied_code: null,
        discount_percent: 0,
        discount_rule_version: DISCOUNT_GUARD_VERSION,
        calculation_timestamp: new Date().toISOString(),
        source_chain: source_chain || 'applyCheckoutDiscountGuard',
        message: 'Empty cart',
      });
    }

    // Resolve product categories if needed
    const resolvedItems = [];
    for (const item of cart_items) {
      let resolvedItem = { ...item };

      // If item has a product_id but no category, fetch from DB
      if (!item.category && (item.product_id || item.id)) {
        try {
          const productId = item.product_id || item.id;
          const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: productId });
          if (products && products.length > 0) {
            resolvedItem.category = products[0].category;
            resolvedItem.name = resolvedItem.name || products[0].name;
          }
        } catch (_) {
          // If can't resolve, keep as-is
        }
      }

      resolvedItems.push(resolvedItem);
    }

    // Classify items
    const eligibleItems = [];
    const excludedItems = [];
    const exclusionReasons = [];

    for (const item of resolvedItems) {
      const classification = categoriseItem(item);
      const itemTotal = (item.price || item.sale_price || item.unit_price || 0) * (item.quantity || 1);

      if (classification === 'eligible') {
        eligibleItems.push({ ...item, item_total: itemTotal });
      } else {
        const cat = (item.category || item.product_type || 'unknown').toLowerCase();
        let reason = `Category "${cat}" is excluded from discounts`;

        if (['cd', 'vinyl', 'music', 'digital_music', 'limited_edition_music', 'music_bundle'].includes(cat)) {
          reason = `Music item (${cat}) — discounts never apply to music products`;
        } else if (['support', 'donation'].includes(cat)) {
          reason = `Support/donation contributions are always excluded from discounts`;
        } else if (['shipping', 'processing', 'fees'].includes(cat)) {
          reason = `${cat} charges are always excluded from discounts`;
        }

        excludedItems.push({ ...item, item_total: itemTotal, exclusion_reason: reason });
        exclusionReasons.push({ item_name: item.name || 'Unknown item', reason });
      }
    }

    const eligibleSubtotal = eligibleItems.reduce((sum, i) => sum + i.item_total, 0);
    const excludedSubtotal = excludedItems.reduce((sum, i) => sum + i.item_total, 0);

    // Apply discount only to eligible subtotal
    const discPct = Math.min(Math.max(parseFloat(discount_percent || 0), 0), 99.99); // Cap at 99.99%
    const discountAmount = Math.round(eligibleSubtotal * (discPct / 100) * 100) / 100;
    const finalDiscountedSubtotal = Math.max(eligibleSubtotal - discountAmount, 0);

    // Safety: never allow negative totals
    if (finalDiscountedSubtotal < 0) {
      return Response.json({ error: 'Calculation error: negative total detected', safe: false }, { status: 400 });
    }

    return Response.json({
      eligible_subtotal: Math.round(eligibleSubtotal * 100) / 100,
      excluded_subtotal: Math.round(excludedSubtotal * 100) / 100,
      discount_amount: discountAmount,
      final_discounted_subtotal: finalDiscountedSubtotal,
      eligible_items: eligibleItems,
      excluded_items: excludedItems,
      reason_each_item_excluded: exclusionReasons,
      applied_code: promo_code_id || null,
      discount_percent: discPct,
      discount_rule_version: DISCOUNT_GUARD_VERSION,
      calculation_timestamp: new Date().toISOString(),
      source_chain: `${source_chain || 'direct'} → applyCheckoutDiscountGuard v${DISCOUNT_GUARD_VERSION}`,
      has_eligible_items: eligibleItems.length > 0,
      has_excluded_items: excludedItems.length > 0,
      all_items_excluded: eligibleItems.length === 0 && excludedItems.length > 0,
    });
  } catch (error) {
    return Response.json({ error: error.message, safe: false }, { status: 500 });
  }
});