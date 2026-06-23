import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { order_id, order_data } = body;

    // 1. Create admin notification
    await base44.asServiceRole.entities.AdminNotification.create({
      notification_type: 'order',
      severity: 'info',
      title: `New Order: ${order_data?.order_number || order_id || 'New Order'}`,
      summary: `Order from ${order_data?.customer_name || 'Unknown'} — $${(order_data?.total || 0).toFixed(2)}`,
      source: 'order_sync',
      requires_action: true,
      linked_entity: 'MerchOrder',
      linked_id: order_id || '',
    });

    // 2. Send email notification
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'gannon@gannonwaye.com',
      subject: `New Order: ${order_data?.order_number || order_id || 'New Order'}`,
      body: `New order received:\n\nCustomer: ${order_data?.customer_name || 'Unknown'}\nTotal: $${(order_data?.total || 0).toFixed(2)}\nItems: ${order_data?.items?.length || 0}\n\nView in admin dashboard.`,
    });

    return Response.json({ success: true, synced: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});