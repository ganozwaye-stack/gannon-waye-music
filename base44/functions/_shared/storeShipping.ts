const NO_SHIPPING_CATEGORIES = new Set(['digital', 'support', 'donation', 'song', 'music', 'digital_music']);

export function productTypeForCategory(category = '') {
  const value = String(category).toLowerCase().trim();
  if (value === 'bundle' || value === 'bundles') return 'bundle';
  if (value === 'vinyl') return 'vinyl';
  if (value === 'cd') return 'cd';
  if (['apparel', 'accessories', 'poster', 'posters', 'drinkware', 'mugs', 'hoodies'].includes(value)) return 'merch';
  return 'other';
}

export function itemNeedsShipping(category = '') {
  return !NO_SHIPPING_CATEGORIES.has(String(category).toLowerCase().trim());
}

function positiveInteger(value, fallback = 1) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

export async function calculateOrderShipping(base44, {
  destination = 'australia',
  items = [],
  cartTotal = 0,
  allowFreeShipping = false,
} = {}) {
  const normalizedDestination = String(destination || 'australia').toLowerCase().trim();
  const physicalItems = (Array.isArray(items) ? items : [])
    .filter(item => itemNeedsShipping(item?.category))
    .map(item => ({
      product_type: productTypeForCategory(item?.category),
      quantity: positiveInteger(item?.quantity),
    }));

  if (physicalItems.length === 0) {
    return {
      shipping_cost: 0,
      free_shipping: true,
      quote_required: false,
      destination: normalizedDestination,
      rule_names: [],
      calculation: 'no_physical_items',
    };
  }

  if (normalizedDestination === 'local_pickup') {
    return {
      shipping_cost: 0,
      free_shipping: true,
      quote_required: false,
      destination: normalizedDestination,
      rule_names: ['Local pickup'],
      calculation: 'local_pickup',
    };
  }

  // The initial live store is Australia only. International payment must not
  // be taken before a delivery amount is agreed and included in checkout.
  if (normalizedDestination !== 'australia') {
    return {
      shipping_cost: null,
      free_shipping: false,
      quote_required: true,
      destination: normalizedDestination,
      rule_names: [],
      calculation: 'international_quote_required',
    };
  }

  const distinctTypes = [...new Set(physicalItems.map(item => item.product_type))];
  const rules = [];
  for (const productType of distinctTypes) {
    const candidates = await base44.asServiceRole.entities.ShippingRateRule.filter({
      region: 'australia',
      product_type: productType,
      is_active: true,
      status: 'live',
    });
    if (!Array.isArray(candidates) || candidates.length === 0) {
      throw new Error(`No live Australian shipping rule for product type ${productType}`);
    }
    rules.push(candidates[0]);
  }

  // For a combined parcel, use the largest applicable base rate and the
  // largest additional item rate. This prevents a smaller item from making a
  // bundle parcel look cheaper than its verified fulfilment rule.
  const baseRate = Math.max(...rules.map(rule => Number(rule.base_rate || 0)));
  const additionalRate = Math.max(...rules.map(rule => Number(rule.additional_item_rate || 0)));
  const totalQuantity = physicalItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = baseRate + Math.max(0, totalQuantity - 1) * additionalRate;

  let freeShipping = false;
  if (allowFreeShipping) {
    const thresholds = rules
      .map(rule => Number(rule.free_shipping_threshold))
      .filter(value => Number.isFinite(value) && value > 0);
    const threshold = thresholds.length > 0 ? Math.max(...thresholds) : null;
    if (threshold !== null && Number(cartTotal || 0) >= threshold) freeShipping = true;
  }

  return {
    shipping_cost: freeShipping ? 0 : Number(shippingCost.toFixed(2)),
    free_shipping: freeShipping,
    quote_required: false,
    destination: 'australia',
    base_rate: baseRate,
    additional_item_rate: additionalRate,
    total_quantity: totalQuantity,
    rule_names: rules.map(rule => rule.name),
    calculation: 'highest_combined_parcel_rule',
  };
}
