import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { data } = await req.json();

    if (!data || data.stock_quantity >= 5) {
      return Response.json({ skip: true }, { status: 200 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');

    function buildMime({ to, subject, body }) {
      const raw = [`From: me`, `To: ${to}`, `Subject: ${subject}`, `Content-Type: text/plain; charset=utf-8`, ``, body].join('\r\n');
      return btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: buildMime({ to: 'ganozwaye@gmail.com', subject: `⚠️ Low Stock Alert: ${data.name}`, body: `${data.name} is running low on stock.\n\nCurrent quantity: ${data.stock_quantity}\n\nLog in to admin to reorder: https://gannonwaye.com/admin/merch` }) })
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});