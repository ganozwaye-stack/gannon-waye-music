import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const data = body.data || body;

    if (!data?.id || !data?.customer_name) {
      return Response.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const urgency = (data.total_amount || 0) > 150 ? 'high' : 'normal';

    // Slack is optional — don't fail the automation if it's unavailable
    try {
      await base44.asServiceRole.functions.invoke('sendSlackAlert', {
        channel: '#gannon-alerts',
        title: `🛍️ New Order — $${(data.total_amount || 0).toFixed(2)}`,
        urgency,
        message: `*${data.customer_name}* just ordered from the store`,
        fields: [
          { label: '💰 Amount', value: `$${(data.total_amount || 0).toFixed(2)}` },
          { label: '📦 Items', value: String(data.items?.length || 1) },
          { label: '🚚 Shipping', value: data.shipping_address?.split(',')[0] || 'Standard' },
          { label: '📧 Email', value: data.customer_email || '—' },
        ],
        action_url: 'https://gannonwaye.base44.app/admin/orders',
        category: 'order',
      });
    } catch (_) {
      // Slack optional — return success so automation doesn't pause
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});