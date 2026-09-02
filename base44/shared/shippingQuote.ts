const NO_SHIPPING_CATEGORIES = new Set([
  'digital',
  'support',
  'donation',
  'song',
  'music',
  'digital_music',
]);

export function toCents(value) {
  return Math.round((Number(value) || 0) * 100);
}

export function fromCents(value) {
  return Math.round(Number(value) || 0) / 100;
}

export function needsShipping(category) {
  return !NO_SHIPPING_CATEGORIES.has(String(category || '').toLowerCase().trim());
}

export function productTypeForCategory(category) {
  const value = String(category || '').toLowerCase().trim();
  if (value === 'bundle') return 'bundle';
  if (value === 'vinyl') return 'vinyl';
  if (value === 'cd') return 'cd';
  if (['apparel', 'accessories', 'drinkware', 'poster', 'merch'].includes(value)) return 'merch';
  return 'other';
}

function normaliseDestination(destination) {
  const value = String(destination || '').toLowerCase().trim();
  if (['australia', 'au', 'australian'].includes(value)) return 'australia';
  if (['local_pickup', 'local pickup', 'pickup'].includes(value)) return 'local_pickup';
  return 'international';
}

function ruleSupportsQuantity(rule, quantity) {
  const minimum = Number(rule?.min_quantity || 1);
  const maximum = rule?.max_quantity === null || rule?.max_quantity === undefined
    ? Number.POSITIVE_INFINITY
    : Number(rule.max_quantity);
  return quantity >= minimum && quantity <= maximum;
}

async function loadRule(base44, region, productType, quantity) {
  const rules = await base44.asServiceRole.entities.ShippingRateRule.filter({
    region,
    product_type: productType,
    is_active: true,
    status: 'live',
  });

  return (rules || []).find(rule => ruleSupportsQuantity(rule, quantity)) || null;
}

export async function calculateShippingQuote({
  base44,
  destination = 'australia',
  items = [],
  cartSubtotalCents = 0,
  freeShippingOverride = false,
}) {
  const region = normaliseDestination(destination);
  const physicalItems = (Array.isArray(items) ? items : [])
    .filter(item => needsShipping(item?.category))
    .map(item => ({
      category: String(item?.category || ''),
      quantity: Math.max(1, Math.trunc(Number(item?.quantity || 1))),
    }));

  if (physicalItems.length === 0) {
    return {
      ok: true,
      region,
      shippingCostCents: 0,
      freeShipping: true,
      method: 'no_shipping_required',
      ruleIds: [],
      ruleNames: [],
    };
  }

  if (region === 'international') {
    return {
      ok: false,
      region,
      shippingCostCents: 0,
      freeShipping: false,
      method: 'international_blocked_stage_one',
      error: 'The current store accepts delivery addresses within Australia only.',
      ruleIds: [],
      ruleNames: [],
    };
  }

  if (freeShippingOverride) {
    return {
      ok: true,
      region,
      shippingCostCents: 0,
      freeShipping: true,
      method: 'approved_free_shipping_override',
      ruleIds: [],
      ruleNames: [],
    };
  }

  const totalQuantity = physicalItems.reduce((sum, item) => sum + item.quantity, 0);
  const productTypes = [...new Set(physicalItems.map(item => productTypeForCategory(item.category)))];
  const loadedRules = [];

  for (const productType of productTypes) {
    const rule = await loadRule(base44, region, productType, totalQuantity);
    if (!rule) {
      return {
        ok: false,
        region,
        shippingCostCents: 0,
        freeShipping: false,
        method: 'missing_live_shipping_rule',
        error: `No approved live shipping rule exists for ${region} ${productType}.`,
        ruleIds: [],
        ruleNames: [],
      };
    }
    loadedRules.push(rule);
  }

  // One combined parcel uses the rule with the highest base rate. This prevents a
  // mixed cart from being priced as the smallest item in the order.
  const selectedRule = [...loadedRules].sort((a, b) => {
    const baseDifference = toCents(b.base_rate) - toCents(a.base_rate);
    if (baseDifference !== 0) return baseDifference;
    return toCents(b.additional_item_rate) - toCents(a.additional_item_rate);
  })[0];

  const thresholdCents = selectedRule.free_shipping_threshold === null || selectedRule.free_shipping_threshold === undefined
    ? null
    : toCents(selectedRule.free_shipping_threshold);

  if (thresholdCents !== null && Number(cartSubtotalCents || 0) >= thresholdCents) {
    return {
      ok: true,
      region,
      shippingCostCents: 0,
      freeShipping: true,
      method: 'configured_threshold',
      selectedRuleId: selectedRule.id,
      selectedRuleName: selectedRule.name,
      ruleIds: loadedRules.map(rule => rule.id),
      ruleNames: loadedRules.map(rule => rule.name),
      freeShippingThresholdCents: thresholdCents,
    };
  }

  const baseCents = toCents(selectedRule.base_rate);
  const additionalItemCents = toCents(selectedRule.additional_item_rate);
  const shippingCostCents = baseCents + Math.max(0, totalQuantity - 1) * additionalItemCents;

  return {
    ok: true,
    region,
    shippingCostCents,
    freeShipping: shippingCostCents === 0,
    method: 'combined_package_live_rule',
    selectedRuleId: selectedRule.id,
    selectedRuleName: selectedRule.name,
    ruleIds: loadedRules.map(rule => rule.id),
    ruleNames: loadedRules.map(rule => rule.name),
    baseRateCents: baseCents,
    additionalItemRateCents: additionalItemCents,
    totalQuantity,
    freeShippingThresholdCents: thresholdCents,
  };
}
