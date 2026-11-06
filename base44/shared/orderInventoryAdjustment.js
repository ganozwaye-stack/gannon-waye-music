/**
 * Decrements owned stock for a paid merchandise order.
 *
 * The downstream automation that used to do this (onNewOrderAutomation) is on a
 * safety hold and performs no work, so a paid order would otherwise leave stock
 * untouched. This runs inside the shared capture pipeline, which both capture
 * paths (stripeWebhook and verifyCheckoutSession) already use.
 *
 * Guarantees:
 * 1. One order decrements stock once: the order's inventory_adjusted flag is the
 *    guard, and the applied lines are stored on the order for audit.
 * 2. The exact purchased variant is decremented (stock_by_variant[size]); a
 *    product without variants decrements stock_quantity.
 * 3. No email, no external call, no price change.
 */

export async function adjustOrderInventory(base44, orderId) {
  try {
    const order = await base44.asServiceRole.entities.MerchOrder.get(orderId);
    if (!order) return { success: false, error: 'Order not found' };
    if (order.inventory_adjusted) return { success: true, skipped: true };

    const items = Array.isArray(order.items) ? order.items : [];
    const details = [];

    for (const item of items) {
      const productId = String(item?.product_id || '').trim();
      const quantity = Number(item?.quantity) || 0;
      if (!productId || quantity <= 0) continue;

      const product = await base44.asServiceRole.entities.MerchProduct.get(productId).catch(() => null);
      if (!product) {
        details.push({
          product_id: productId,
          product_name: String(item?.product_name || ''),
          quantity,
          applied: false,
          reason: 'product_not_found',
        });
        continue;
      }

      const size = String(item?.size || '').trim();
      const variantStock = (product.stock_by_variant && typeof product.stock_by_variant === 'object')
        ? { ...product.stock_by_variant }
        : {};

      if (size && Object.prototype.hasOwnProperty.call(variantStock, size)) {
        const previousStock = Number(variantStock[size]) || 0;
        const newStock = Math.max(0, previousStock - quantity);
        variantStock[size] = newStock;
        await base44.asServiceRole.entities.MerchProduct.update(productId, { stock_by_variant: variantStock });
        details.push({
          product_id: productId,
          product_name: String(product.name || item?.product_name || ''),
          size,
          quantity,
          previous_stock: previousStock,
          new_stock: newStock,
        });
      } else {
        const previousStock = Number(product.stock_quantity) || 0;
        const newStock = Math.max(0, previousStock - quantity);
        await base44.asServiceRole.entities.MerchProduct.update(productId, { stock_quantity: newStock });
        details.push({
          product_id: productId,
          product_name: String(product.name || item?.product_name || ''),
          size: size || null,
          quantity,
          previous_stock: previousStock,
          new_stock: newStock,
        });
      }
    }

    await base44.asServiceRole.entities.MerchOrder.update(orderId, {
      inventory_adjusted: true,
      inventory_adjusted_at: new Date().toISOString(),
      inventory_adjustment_details: details,
    });

    return { success: true, details };
  } catch (error) {
    return { success: false, error: String(error?.message || error) };
  }
}