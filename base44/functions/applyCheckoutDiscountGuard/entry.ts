import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

/**
 * GLOBAL DISCOUNT GUARD — v2.0
 * Single source of truth for ALL discount calculations.
 *
 * PERMANENT RULES (server-enforced):
 * - NEVER discount: bundles, shipping, fees, music/digital items, support/donations
 * - BUNDLE RULE: Any item with category="bundle" OR name containing "bundle" OR price=119 is ALWAYS excluded
 * - The Winter Writing & Comfort Bundle ($119) NEVER receives a discount under any promo code
 * - Eligible: apparel, accessories, hoodies, t-shirts, merch clothing items
 */

const DISCOUNT_GUARD_VERSION = '2.0';

// These category values are ALWAYS ineligible — no exceptions
const ALWAYS_INELIGIBLE_CATEGORIES = [
  'cd', 'vinyl', 'song', 'digital', 'support', 'donation', 'shipping',
  'processing', 'fees', 'music', 'limited_edition_music', 'digital_music',
  'music_bundle', 'other_music',
  // ADDED v2.0 — bundles are always fixed price, no discount
  'bundle', 'bundles',
];

const ALWAYS_ELIGIBLE_CATEGORIES = [
  'apparel', 'accessories', 'hoodie', 'hoodies', 't-shirt', 't_shirt',
  'tshirt', 'jumper', 'merch', 'clothing'
];

// Name keywords indicating ineligible items
const INELIGIBLE_NAME_KEYWORDS = [
  'cd', ' cd ', 'vinyl', 'album', 'digital download', 'digital music',
  'song download', 'mp3', 'wav', 'flac', 'single download', 'music download',
  'thank you cd', 'thankyou cd',
];

// Bundle name keywords — ALWAYS excluded regardless of category label
const BUNDLE_NAME_KEYWORDS = [
  'bundle', 'winter writing', 'comfort bundle', 'writing & comfort', 'writing and comfort',
  'cd & poster', 'cd and poster', 'pack', 'combo set',
];

// Fixed prices that identify known bundles — excluded from ALL discounts
const BUNDLE_FIXED_PRICES = [119, 129]; // Winter Writing & Comfort Bundle

function isBundleItem(item) {
  const cat = (item.category || item.product_type || item.type || '').toLowerCase().trim();
  const name = (item.name || item.product_name || '').toLowerCase();
  const price = item.price || item.sale_price || item.unit_price || 0;
  const slug = (item.slug || item.product_slug || item.id || '').toLowerCase();

  if (cat === 'bundle' || cat === 'bundles') return true;
  if (BUNDLE_NAME_KEYWORDS.some(k => name.includes(k))) return true;
  if (BUNDLE_FIXED_PRICES.includes(Number(price))) return true;
  if (slug.includes('bundle')) return true;

  return false;
}

function categoriseItem(item) {
  const cat = (item.category || item.product_type || item.type || '').toLowerCase().trim();
  const name = (item.name || item.product_name || '').toLowerCase();

  // CRITICAL v2.0: Bundle check takes absolute priority
  if (isBundleItem(item)) return 'bundle';

  // Music/ineligible name check
  const nameLooksLikeMusic = INELIGIBLE_NAME_KEYWORDS.some(k => name.includes(k)) ||
    /\bcd\b/.test(name) ||
    /\bvinyl\b/.test(name);

  if (ALWAYS_INELIGIBLE_CATEGORIES.some(c => cat.includes(c))) return 'ineligible';
  if (nameLooksLikeMusic) return 'ineligible';
  if (ALWAYS_ELIGIBLE_CATEGORIES.some(c => cat.includes(c))) return 'eligible';

  // Unknown category — treat as eligible (apparel/merch default)
  return 'eligible';
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
      const resolvedItem = { ...item };
      if (!item.category && (item.product_id || item.id)) {
        try {
          const productId = item.product_id || item.id;
          const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: productId });
          if (products && products.length > 0) {
            resolvedItem.category = products[0].category;
            resolvedItem.name = resolvedItem.name || products[0].name;
          }
        } catch (_) { /* keep as-is */ }
      }
      resolvedItems.push(resolvedItem);
    }

    // Classify items
    const eligibleItems = [];
    const excludedItems = [];
    const exclusionReasons = [];
    let hasBundle = false;

    for (const item of resolvedItems) {
      const classification = categoriseItem(item);
      const itemTotal = (item.price || item.sale_price || item.unit_price || 0) * (item.quantity || 1);
      const itemName = item.name || item.product_name || 'Unknown item';

      if (classification === 'eligible') {
        eligibleItems.push({ ...item, item_total: itemTotal });
      } else {
        let reason;
        if (classification === 'bundle') {
          hasBundle = true;
          reason = 'Bundle price is fixed — no discount applies. The Winter Writing & Comfort Bundle is priced as marked.';
        } else {
          const cat = (item.category || item.product_type || 'unknown').toLowerCase();
          if (['cd', 'vinyl', 'music', 'digital_music', 'limited_edition_music', 'music_bundle'].includes(cat)) {
            reason = `Music item (${cat}) — discounts never apply to music products`;
          } else if (['support', 'donation'].includes(cat)) {
            reason = 'Support/donation contributions are always excluded from discounts';
          } else if (['shipping', 'processing', 'fees'].includes(cat)) {
            reason = `${cat} charges are always excluded from discounts`;
          } else {
            reason = `Category "${cat}" is excluded from discounts`;
          }
        }
        excludedItems.push({ ...item, item_total: itemTotal, exclusion_reason: reason });
        exclusionReasons.push({ item_name: itemName, reason });
      }
    }

    const eligibleSubtotal = eligibleItems.reduce((sum, i) => sum + i.item_total, 0);
    const excludedSubtotal = excludedItems.reduce((sum, i) => sum + i.item_total, 0);

    const discPct = Math.min(Math.max(parseFloat(discount_percent || 0), 0), 99.99);
    const discountAmount = Math.round(eligibleSubtotal * (discPct / 100) * 100) / 100;
    const finalDiscountedSubtotal = Math.max(eligibleSubtotal - discountAmount, 0);

    if (finalDiscountedSubtotal < 0) {
      return Response.json({ error: 'Calculation error: negative total detected', safe: false }, { status: 400 });
    }

    // Build user-facing message when cart contains only bundles
    let message = null;
    if (hasBundle && eligibleItems.length === 0) {
      message = 'The Winter Writing & Comfort Bundle is priced as marked. Promo codes cannot be applied to bundles.';
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
      bundle_exclusion_applied: hasBundle,
      message,
    });
  } catch (error) {
    return Response.json({ error: error.message, safe: false }, { status: 500 });
  }
});