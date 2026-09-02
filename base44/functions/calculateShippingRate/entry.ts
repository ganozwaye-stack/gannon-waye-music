import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';
import {
  calculateShippingQuote,
  fromCents,
  toCents,
} from '../../shared/shippingQuote.ts';

function normaliseItems(rawItems) {
  return (Array.isArray(rawItems) ? rawItems : []).map(item => ({
    product_id: String(item?.product_id || '').trim(),
    category: String(item?.category || '').trim(),
    quantity: Math.max(1, Math.trunc(Number(item?.quantity || 1))),
    size: String(item?.size || '').trim(),
  }));
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const destination = body?.destination || 'australia';

    let items = normaliseItems(body?.cart_items);
    let cartSubtotalCents = 0;

    if (items.length > 0 && items.every(item => item.product_id)) {
      const verifiedItems = [];

      for (const requested of items) {
        const products = await base44.asServiceRole.entities.MerchProduct.filter({ id: requested.product_id });
        const product = Array.isArray(products) ? products[0] : null;

        if (!product || product.is_active !== true || product.publication_status !== 'live' || product.is_stage_one_sale !== true) {
          return Response.json({
            error: 'A cart item is no longer available for the current sale.',
            product_id: requested.product_id,
            shipping_cost: null,
            shipping_cost_cents: null,
            free_shipping: false,
          }, { status: 400 });
        }

        const sizes = Array.isArray(product.sizes_available) ? product.sizes_available : [];
        if (sizes.length > 0) {
          if (!requested.size || !sizes.includes(requested.size)) {
            return Response.json({
              error: 'A valid size is required before delivery can be calculated.',
              product_id: requested.product_id,
              shipping_cost: null,
              shipping_cost_cents: null,
              free_shipping: false,
            }, { status: 400 });
          }
          const variantStock = Number(product.stock_by_variant?.[requested.size]);
          if (!Number.isFinite(variantStock) || requested.quantity > variantStock) {
            return Response.json({
              error: 'The requested size quantity is no longer available.',
              product_id: requested.product_id,
              shipping_cost: null,
              shipping_cost_cents: null,
              free_shipping: false,
            }, { status: 409 });
          }
        } else if (requested.quantity > Number(product.stock_quantity || 0)) {
          return Response.json({
            error: 'The requested quantity is no longer available.',
            product_id: requested.product_id,
            shipping_cost: null,
            shipping_cost_cents: null,
            free_shipping: false,
          }, { status: 409 });
        }

        verifiedItems.push({
          category: product.category || '',
          quantity: requested.quantity,
        });
        cartSubtotalCents += toCents(product.sale_price) * requested.quantity;
      }

      items = verifiedItems;
    } else if (items.length > 0) {
      // Legacy preview callers may provide categories. This is display-only and the
      // final Stripe session still reloads every product from the database.
      cartSubtotalCents = Number.isFinite(Number(body?.cart_total_cents))
        ? Math.max(0, Math.trunc(Number(body.cart_total_cents)))
        : toCents(body?.cart_total || 0);
    } else if (body?.product_type) {
      items = [{
        category: body.product_type,
        quantity: Math.max(1, Math.trunc(Number(body?.quantity || 1))),
      }];
      cartSubtotalCents = Number.isFinite(Number(body?.cart_total_cents))
        ? Math.max(0, Math.trunc(Number(body.cart_total_cents)))
        : toCents(body?.cart_total || 0);
    }

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
      cart_subtotal: fromCents(cartSubtotalCents),
      cart_subtotal_cents: cartSubtotalCents,
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
