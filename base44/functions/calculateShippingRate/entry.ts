import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Public shipping rate calculator using ShippingRateRule entity
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { destination, product_type, quantity, cart_total } = await req.json();

    // destination: 'australia', 'international', 'local_pickup'
    // product_type: 'cd', 'merch', 'vinyl', 'bundle', 'other'
    // quantity: number of items
    // cart_total: total cart value in AUD (for free shipping threshold check)

    if (!destination || !product_type) {
      return Response.json({ 
        error: 'Missing destination or product type',
        shipping_cost: null,
        free_shipping: false 
      }, { status: 400 });
    }

    const qty = quantity || 1;
    const total = cart_total || 0;

    // Use service role to read shipping rules (admin-only entity)
    const rules = await base44.asServiceRole.entities.ShippingRateRule.filter({
      region: destination,
      product_type: product_type,
      is_active: true,
      status: 'live',
    });

    if (!rules || rules.length === 0) {
      // No matching rule found - return friendly error instead of 403
      return Response.json({
        error: 'Shipping rate not available for this combination',
        shipping_cost: null,
        free_shipping: false,
        fallback_message: 'Please contact us for a shipping quote',
      });
    }

    // Find the best matching rule (first active rule for this qty)
    const applicableRule = rules.find(rule => {
      const minQty = rule.min_quantity || 1;
      const maxQty = rule.max_quantity;
      return qty >= minQty && (maxQty === null || qty <= maxQty);
    });

    if (!applicableRule) {
      return Response.json({
        error: 'No shipping rate available for this quantity',
        shipping_cost: null,
        free_shipping: false,
        fallback_message: 'Please contact us for a shipping quote',
      });
    }

    // Calculate shipping cost
    let shippingCost = applicableRule.base_rate || 0;
    
    // Add additional item rate for quantities > 1
    if (qty > 1 && applicableRule.additional_item_rate) {
      shippingCost += (qty - 1) * applicableRule.additional_item_rate;
    }

    // Check free shipping threshold
    let freeShipping = false;
    if (applicableRule.free_shipping_threshold && total >= applicableRule.free_shipping_threshold) {
      freeShipping = true;
      shippingCost = 0;
    }

    return Response.json({
      rule_name: applicableRule.name,
      destination,
      product_type,
      quantity: qty,
      cart_total: total,
      base_rate: applicableRule.base_rate,
      additional_item_rate: applicableRule.additional_item_rate,
      free_shipping_threshold: applicableRule.free_shipping_threshold,
      shipping_cost: shippingCost,
      free_shipping: freeShipping,
    });
  } catch (error) {
    return Response.json({ 
      error: 'Unable to calculate shipping',
      shipping_cost: null,
      free_shipping: false,
      details: error.message 
    }, { status: 500 });
  }
});