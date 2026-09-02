import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

function numberOr(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function aggregateItems(items) {
  const byProduct = new Map();
  for (const item of Array.isArray(items) ? items : []) {
    const productId = String(item?.product_id || '').trim();
    const quantity = numberOr(item?.quantity, 0);
    const size = String(item?.size || '').trim();
    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Order contains an invalid product or quantity.');
    }
    const productGroup = byProduct.get(productId) || {
      product_id: productId,
      total_quantity: 0,
      variants: {},
      lines: [],
    };
    productGroup.total_quantity += quantity;
    if (size) productGroup.variants[size] = numberOr(productGroup.variants[size]) + quantity;
    productGroup.lines.push({ ...item, quantity, size });
    byProduct.set(productId, productGroup);
  }
  return [...byProduct.values()];
}

async function createHealthIssue(base44, title, description, orderId) {
  try {
    await base44.asServiceRole.entities.SystemHealthIssue.create({
      system_area: 'payments',
      issue_title: title,
      severity: 'critical',
      detected_by: 'onNewOrderAutomation',
      recommended_fix: `Review MerchOrder ${orderId}, compare Stripe payment evidence with current stock, and run only the idempotent recovery action. Do not charge the customer again.`,
      description: String(description || '').slice(0, 1000),
      status: 'open',
      requires_approval: false,
      risk_type: 'financial',
      last_checked: new Date().toISOString(),
    });
  } catch {
    // Preserve the original order-processing result.
  }
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  let orderId = '';
  let inventoryLog = null;

  try {
    const body = await req.json();
    orderId = String(body?.orderId || body?.data?.id || '').trim();
    if (!orderId) return Response.json({ error: 'Order ID is required.' }, { status: 400 });

    const order = await base44.asServiceRole.entities.MerchOrder.get(orderId);
    if (!order) return Response.json({ error: 'Order not found.' }, { status: 404 });

    if (order.status === 'duplicate' || order.financial_status === 'duplicate_void') {
      return Response.json({ success: true, skipped: true, reason: 'Duplicate order is never processed.' });
    }

    if (order.excluded_from_inventory || order.excluded_from_revenue || order.payment_status !== 'paid') {
      await base44.asServiceRole.entities.MerchOrder.update(orderId, {
        receipt_status: order.excluded_from_revenue ? 'not_required' : order.receipt_status || 'not_attempted',
        admin_note: [order.admin_note, 'Order automation skipped because the record is excluded or is not a paid external order.'].filter(Boolean).join(' | '),
      });
      return Response.json({ success: true, skipped: true, reason: 'Excluded or unpaid order.' });
    }

    const inventoryKey = `inventory_order:${orderId}`;
    const existingLogs = await base44.asServiceRole.entities.IdempotenceLog.filter({
      idempotence_key: inventoryKey,
    });
    inventoryLog = Array.isArray(existingLogs) ? existingLogs[0] : null;

    if (order.inventory_adjusted || inventoryLog?.result?.status === 'completed') {
      if (!order.inventory_adjusted && inventoryLog?.result?.status === 'completed') {
        await createHealthIssue(
          base44,
          `Inventory state mismatch for paid order ${orderId}`,
          'The idempotence log says inventory completed, but the order is not marked inventory_adjusted. Manual reconciliation is required before any retry.',
          orderId,
        );
      }
    } else {
      if (inventoryLog?.result?.status === 'processing') {
        await createHealthIssue(
          base44,
          `Inventory processing was interrupted for paid order ${orderId}`,
          'A previous run created the inventory lock but did not record completion. The system stopped rather than risking a second stock decrement.',
          orderId,
        );
        await base44.asServiceRole.entities.MerchOrder.update(orderId, {
          status: 'needs_admin_review',
          financial_status: 'inventory_reconciliation_required',
        });
        return Response.json({
          success: false,
          needs_review: true,
          reason: 'Existing inventory lock is incomplete. No second decrement was attempted.',
        }, { status: 409 });
      }

      if (!inventoryLog) {
        inventoryLog = await base44.asServiceRole.entities.IdempotenceLog.create({
          idempotence_key: inventoryKey,
          created_at: new Date().toISOString(),
          description: `Inventory adjustment lock for paid order ${orderId}`,
          result: { status: 'processing', order_id: orderId },
        });
      }

      const groupedItems = aggregateItems(order.items);
      if (groupedItems.length === 0) throw new Error('Paid order has no inventory lines.');

      const adjustmentDetails = [];
      let productCostTotal = 0;
      let packagingCostTotal = 0;
      let highestFeePercent = 0;

      for (const group of groupedItems) {
        const product = await base44.asServiceRole.entities.MerchProduct.get(group.product_id);
        if (!product) throw new Error(`Product ${group.product_id} was not found.`);

        const currentTotal = numberOr(product.stock_quantity);
        const nextTotal = currentTotal - group.total_quantity;
        if (nextTotal < 0) throw new Error(`Insufficient total stock for ${product.name}.`);

        const currentVariants = { ...(product.stock_by_variant || {}) };
        const nextVariants = { ...currentVariants };
        const hasVariantInventory = Object.keys(currentVariants).length > 0 || (product.sizes_available || []).length > 0;

        if (hasVariantInventory) {
          for (const [size, quantity] of Object.entries(group.variants)) {
            const currentVariant = numberOr(currentVariants[size], -1);
            if (currentVariant < 0 || currentVariant - quantity < 0) {
              throw new Error(`Insufficient verified stock for ${product.name}, size ${size}.`);
            }
            nextVariants[size] = currentVariant - quantity;
          }
          const linesWithoutSize = group.lines.filter(line => !line.size);
          if (linesWithoutSize.length > 0) throw new Error(`A size is missing for ${product.name}.`);
        }

        await base44.asServiceRole.entities.MerchProduct.update(product.id, {
          stock_quantity: nextTotal,
          ...(hasVariantInventory ? { stock_by_variant: nextVariants } : {}),
        });

        for (const line of group.lines) {
          const unitCost = numberOr(line.recorded_unit_cost, numberOr(product.cost_price));
          const packagingCost = numberOr(line.recorded_packaging_cost, numberOr(product.packaging_cost));
          productCostTotal += unitCost * line.quantity;
          packagingCostTotal += packagingCost * line.quantity;
          highestFeePercent = Math.max(highestFeePercent, numberOr(product.merchant_fee_percent, 3.5));
        }

        adjustmentDetails.push({
          product_id: product.id,
          product_name: product.name,
          quantity: group.total_quantity,
          variants: group.variants,
          stock_before: currentTotal,
          stock_after: nextTotal,
          variant_stock_before: hasVariantInventory ? currentVariants : null,
          variant_stock_after: hasVariantInventory ? nextVariants : null,
        });
      }

      const estimatedPaymentFee = numberOr(order.total_amount) * (highestFeePercent || 3.5) / 100;
      const estimatedNetProfit = numberOr(order.subtotal_amount) - productCostTotal - packagingCostTotal - estimatedPaymentFee;
      const processedAt = new Date().toISOString();

      await base44.asServiceRole.entities.MerchOrder.update(orderId, {
        inventory_adjusted: true,
        inventory_adjusted_at: processedAt,
        inventory_adjustment_details: adjustmentDetails,
        product_cost_total: Number(productCostTotal.toFixed(2)),
        packaging_cost_total: Number(packagingCostTotal.toFixed(2)),
        estimated_delivery_cost: Number(numberOr(order.shipping_amount).toFixed(2)),
        estimated_payment_fee: Number(estimatedPaymentFee.toFixed(2)),
        estimated_net_order_profit: Number(estimatedNetProfit.toFixed(2)),
        profit_status: 'estimated',
        profit_calculated_at: processedAt,
        financial_status: order.status === 'needs_admin_review' ? order.financial_status : 'captured_inventory_adjusted',
      });

      await base44.asServiceRole.entities.IdempotenceLog.update(inventoryLog.id, {
        result: {
          status: 'completed',
          order_id: orderId,
          completed_at: processedAt,
          adjustment_details: adjustmentDetails,
        },
      });
    }

    const refreshedOrder = await base44.asServiceRole.entities.MerchOrder.get(orderId);

    if (!refreshedOrder.admin_notification_sent) {
      try {
        await base44.asServiceRole.entities.AdminNotification.create({
          notification_type: 'order',
          severity: refreshedOrder.status === 'needs_admin_review' ? 'high' : 'info',
          title: `Paid merchandise order from ${refreshedOrder.customer_name}`,
          summary: `${(refreshedOrder.items || []).map(item => `${item.product_name}${item.size ? `, ${item.size}` : ''} x${item.quantity}`).join('; ')}. Total $${numberOr(refreshedOrder.total_amount).toFixed(2)} AUD.`,
          source: 'onNewOrderAutomation',
          requires_action: true,
          linked_entity: 'MerchOrder',
          linked_id: orderId,
          linked_route: '/admin/orders',
          is_read: false,
          delivered_slack: false,
          delivered_email: false,
        });
        await base44.asServiceRole.entities.MerchOrder.update(orderId, {
          admin_notification_sent: true,
          admin_notification_status: 'created',
        });
      } catch (error) {
        await base44.asServiceRole.entities.MerchOrder.update(orderId, {
          admin_notification_status: 'failed',
        }).catch(() => {});
      }
    }

    const orderBeforeReceipt = await base44.asServiceRole.entities.MerchOrder.get(orderId);
    let receiptResult = { skipped: orderBeforeReceipt.receipt_sent === true };
    if (!orderBeforeReceipt.receipt_sent) {
      try {
        receiptResult = await base44.asServiceRole.functions.invoke('sendOrderReceipt', { orderId });
      } catch (error) {
        await base44.asServiceRole.entities.MerchOrder.update(orderId, {
          receipt_status: 'failed',
        }).catch(() => {});
        await base44.asServiceRole.entities.PaymentDiagnostic.create({
          diagnostic_type: 'receipt_failure',
          severity: 'warning',
          status: 'open',
          order_id: orderId,
          stripe_event_id: orderBeforeReceipt.stripe_event_id || '',
          issue_summary: `Receipt delivery needs attention for paid order ${orderId}`,
          customer_safe_message: 'Your payment was received. Your order remains recorded even if the email receipt is delayed.',
          admin_message: String(error?.message || error).slice(0, 1000),
          recommended_fix: 'Verify the connected order email account, then resend the receipt once. Do not change or repeat the payment.',
          source_chain: 'MerchOrder -> onNewOrderAutomation -> sendOrderReceipt failed',
        }).catch(() => {});
        receiptResult = { success: false, error: String(error?.message || error) };
      }
    }

    return Response.json({
      success: true,
      order_id: orderId,
      inventory_adjusted: true,
      admin_notification: 'created_or_already_present',
      receipt: receiptResult,
    });
  } catch (error) {
    if (orderId) {
      await base44.asServiceRole.entities.MerchOrder.update(orderId, {
        status: 'needs_admin_review',
        financial_status: 'order_processing_failed',
        admin_note: `Order processing failed: ${String(error?.message || error).slice(0, 1000)}`,
      }).catch(() => {});

      if (inventoryLog?.id) {
        await base44.asServiceRole.entities.IdempotenceLog.update(inventoryLog.id, {
          result: {
            status: 'failed',
            order_id: orderId,
            failed_at: new Date().toISOString(),
            error: String(error?.message || error).slice(0, 1000),
          },
        }).catch(() => {});
      }

      await createHealthIssue(
        base44,
        `Paid order processing failed for ${orderId}`,
        String(error?.message || error),
        orderId,
      );
    }

    return Response.json({
      success: false,
      order_id: orderId || null,
      error: String(error?.message || error),
    }, { status: 500 });
  }
});
