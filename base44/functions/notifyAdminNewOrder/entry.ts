import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    if (!data) {
      return Response.json({ error: 'No order data' }, { status: 400 });
    }

    const settings = await base44.entities.SiteSettings.list();
    const adminEmail = settings[0]?.email_contact || 'admin@example.com';

    const itemsList = data.items?.map(item => `${item.product_name} (${item.size || 'N/A'}) - $${item.price}`).join('\n') || 'No items';

    await base44.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `🛍️ New Merch Order from ${data.customer_name}`,
      body: `New order placed!\n\nCustomer: ${data.customer_name}\nEmail: ${data.customer_email}\nAddress: ${data.shipping_address}\n\nItems:\n${itemsList}\n\nTotal: $${data.total_amount?.toFixed(2)}\n\nOrder Status: ${data.status}`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});