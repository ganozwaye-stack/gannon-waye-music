import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const order = payload?.data;
    if (!order) {
      return Response.json({ error: 'No order data' }, { status: 400 });
    }

    const settings = await base44.asServiceRole.entities.SiteSettings.list();
    const adminEmail = settings[0]?.email_contact || 'gannon@gannonwaye.com';

    const itemsList = (order.items || [])
      .map(i => `  • ${i.product_name}${i.size ? ` (${i.size})` : ''} x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
      .join('\n');

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `🛍️ New Order from ${order.customer_name} — $${(order.total_amount || 0).toFixed(2)}`,
      body: `A new merch order has been placed!

Customer: ${order.customer_name}
Email: ${order.customer_email}
Shipping: ${order.shipping_address || 'Not provided'}

Items:
${itemsList || '  (no items listed)'}

Total: $${(order.total_amount || 0).toFixed(2)}
Status: ${order.status || 'pending'}

---
View all orders: https://gannonwaye.com/admin/orders`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});