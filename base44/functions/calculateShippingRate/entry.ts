import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';
import {
  calculateShippingQuote,
  fromCents,
  toCents,
} from '../../shared/shippingQuote.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const destination = body?.destination || 'australia';
    const cartSubtotalCents = Number.isFinite(Number(body?.cart_total_cents))
      ? Math.max(0, Math.trunc(Number(body.cart_total_cents)))
      : toCents(body?.cart_total || 0);

    const items = Array.isArray(body?.cart_items) && body.cart_items.length > 0
      ? body.cart_items.map(item => ({
          category: item?.category || '',
          quantity: item?.quantity || 1,
        }))
      : body?.product_type
        ? [{ category: body.product_type, quantity: body?.quantity || 1 }]
        : [];

    if (items.length === 0) {
      return Response.json({
        error: 'At least one cart item is required.',
        shipping_cost: null,
        shipping_cost_cents: null,
        free_shipping: false,
      }, { status: 400 });
    }

    const quote = await calculateShippingQuote({
      base44,
      destination,
      items,
      cartSubtotalCents,
      freeShippingOverride: body?.free_shipping_override === true,
    });

    if (!quote.ok) {
      return Response.json({
        error: quote.error,
        destination: quote.region,
        shipping_cost: null,
        shipping_cost_cents: null,
        free_shipping: false,
        method: quote.method,
      }, { status: 400 });
    }

    return Response.json({
      destination: quote.region,
      shipping_cost: fromCents(quote.shippingCostCents),
      shipping_cost_cents: quote.shippingCostCents,
      free_shipping: quote.freeShipping,
      method: quote.method,
      selected_rule_id: quote.selectedRuleId || null,
      selected_rule_name: quote.selectedRuleName || null,
      rule_ids: quote.ruleIds || [],
      rule_names: quote.ruleNames || [],
      free_shipping_threshold: quote.freeShippingThresholdCents === null || quote.freeShippingThresholdCents === undefined
        ? null
        : fromCents(quote.freeShippingThresholdCents),
      total_quantity: quote.totalQuantity || 0,
    });
  } catch (error) {
    return Response.json({
      error: 'Unable to calculate shipping.',
      shipping_cost: null,
      shipping_cost_cents: null,
      free_shipping: false,
      details: error.message,
    }, { status: 500 });
  }
});
