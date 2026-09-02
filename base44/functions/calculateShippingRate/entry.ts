import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

function mapProductType(category) {
  const value = String(category || '').toLowerCase().trim();
  if (value === 'bundle') return 'bundle';
  if (value === 'vinyl') return 'vinyl';
  if (value === 'cd') return 'cd';
  if (['apparel', 'accessories', 'poster'].includes(value)) return 'merch';
  return 'other';
}

async function getRule(base44, destination, productType) {
  const rules = await base44.asServiceRole.entities.ShippingRateRule.filter({
    region: destination,
    product_type: productType,
    is_active: true,
    status: 'live',
  });
  return Array.isArray(rules) && rules.length > 0 ? rules[0] : null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const destination = body.destination || 'australia';
    const cartItems = Array.isArray(body.cart_items) ? body.cart_items : [];

    if (destination !== 'australia') {
      return Response.json({
        error: 'Current checkout is available within Australia only.',
        shipping_cost: null,
        free_shipping: false,
      }, { status: 400 });
    }

    if (cartItems.length > 0) {
      const verifiedItems = [];

      for (const item of cartItems) {
        const quantity = Number(item.quantity || 1);
        if (!item.product_id || !Number.isInteger(quantity) || quantity <= 0) {
          return Response.json({ error: 'Invalid cart item.', shipping_cost: null, free_shipping: false }, { status: 400 });
        }

        const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: item.product_id });
        const product = Array.isArray(products) ? products[0] : null;
        if (!product || !product.is_active || product.publication_status !== 'live' || product.is_stage_one_sale !== true) {
          return Response.json({ error: 'A cart item is not approved for the current sale.', shipping_cost: null, free_shipping: false }, { status: 400 });
        }
        if (product.shipping_policy !== 'customer_pays') {
          return Response.json({ error: 'A cart item does not have an approved customer-paid delivery policy.', shipping_cost: null, free_shipping: false }, { status: 400 });
        }

        verifiedItems.push({
          product_id: product.id,
          product_type: mapProductType(product.category),
          quantity,
        });
      }

      const productTypes = [...new Set(verifiedItems.map(item => item.product_type))];
      const rules = [];
      for (const productType of productTypes) {
        const rule = await getRule(base44, destination, productType);
        if (!rule) {
          return Response.json({
            error: `No approved delivery rule is available for ${productType}.`,
            shipping_cost: null,
            free_shipping: false,
          }, { status: 400 });
        }
        rules.push(rule);
      }

      const governingRule = [...rules].sort((a, b) => Number(b.base_rate || 0) - Number(a.base_rate || 0))[0];
      const totalQuantity = verifiedItems.reduce((sum, item) => sum + item.quantity, 0);
      const baseRate = Number(governingRule.base_rate || 0);
      const additionalRate = Number(governingRule.additional_item_rate || 0);
      const shippingCost = baseRate + Math.max(0, totalQuantity - 1) * additionalRate;

      return Response.json({
        destination,
        rule_name: governingRule.name,
        product_types: productTypes,
        quantity: totalQuantity,
        base_rate: baseRate,
        additional_item_rate: additionalRate,
        shipping_cost: Number(shippingCost.toFixed(2)),
        free_shipping: false,
        calculation_policy: 'highest applicable package rate plus additional-item rate; no free-shipping threshold during stage one',
      });
    }

    // Legacy single-type path retained for admin diagnostics only.
    const productType = body.product_type;
    const quantity = Number(body.quantity || 1);
    if (!productType || !Number.isInteger(quantity) || quantity <= 0) {
      return Response.json({ error: 'Missing cart items or product type.', shipping_cost: null, free_shipping: false }, { status: 400 });
    }

    const rule = await getRule(base44, destination, productType);
    if (!rule) {
      return Response.json({ error: 'Shipping rate not available.', shipping_cost: null, free_shipping: false }, { status: 400 });
    }

    const shippingCost = Number(rule.base_rate || 0) + Math.max(0, quantity - 1) * Number(rule.additional_item_rate || 0);
    return Response.json({
      destination,
      product_type: productType,
      quantity,
      rule_name: rule.name,
      base_rate: Number(rule.base_rate || 0),
      additional_item_rate: Number(rule.additional_item_rate || 0),
      shipping_cost: Number(shippingCost.toFixed(2)),
      free_shipping: false,
    });
  } catch (error) {
    return Response.json({
      error: 'Unable to calculate delivery.',
      shipping_cost: null,
      free_shipping: false,
      details: error.message,
    }, { status: 500 });
  }
});
