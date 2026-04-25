import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { data } = await req.json();

    if (!data || data.stock_quantity >= 5) {
      return Response.json({ skip: true }, { status: 200 });
    }

    const settings = await base44.entities.SiteSettings.list();
    const adminEmail = settings[0]?.email_contact || 'admin@example.com';

    await base44.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `⚠️ Low Stock Alert: ${data.name}`,
      body: `${data.name} is running low on stock.\n\nCurrent quantity: ${data.stock_quantity}\n\nConsider reordering soon.`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});