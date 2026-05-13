import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Called by entity automation when a new MerchInterest record is created
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Count total interest registrations
    const allInterest = await base44.asServiceRole.entities.MerchInterest.list();
    const total = allInterest.length;

    // Get the latest entry from the payload
    const payload = await req.json().catch(() => ({}));
    const latest = payload?.data || {};

    // Group by product
    const byProduct = {};
    for (const item of allInterest) {
      const key = item.product_name || item.product_id || 'Unknown';
      byProduct[key] = (byProduct[key] || 0) + 1;
    }

    const breakdown = Object.entries(byProduct)
      .map(([name, count]) => `  • ${name}: ${count}`)
      .join('\n');

    const subject = `🛍️ New Interest Registration — ${latest.product_name || 'Merch'} (Total: ${total})`;
    const body = `Hi Gannon,

Someone just registered their interest in your merch!

📦 Product: ${latest.product_name || 'Unknown'}
📧 Email: ${latest.email || 'Not provided'}
🕐 Time: ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })}

---

📊 TOTAL INTEREST REGISTRATIONS: ${total}

Breakdown by product:
${breakdown}

---

You can view all registrations in your admin dashboard under Merch Management.

— Gannon Waye Site
`;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'gannonwayemusic@gmail.com',
      subject,
      body,
      from_name: 'Gannon Waye Site',
    });

    return Response.json({ success: true, total });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});