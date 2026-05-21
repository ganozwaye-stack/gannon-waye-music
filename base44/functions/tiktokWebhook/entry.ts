import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  // TikTok sends GET for verification, POST for events
  if (req.method === 'GET') {
    // Echo challenge for webhook verification
    const url = new URL(req.url);
    const challenge = url.searchParams.get('challenge');
    if (challenge) {
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    return new Response('OK', { status: 200 });
  }

  if (req.method === 'POST') {
    try {
      const base44 = createClientFromRequest(req);
      const body = await req.json();

      // Log the webhook event
      await base44.asServiceRole.functions.invoke('notifyAdmin', {
        notification_type: 'system',
        title: `TikTok Webhook: ${body.event || 'event received'}`,
        summary: JSON.stringify(body).slice(0, 500),
        severity: 'info',
        source: 'TikTokWebhook',
        linked_route: '/admin/api-setup',
        requires_action: false,
      });

      return Response.json({ success: true }, { status: 200 });
    } catch (error) {
      return Response.json({ error: error.message }, { status: 200 }); // Always 200 to TikTok
    }
  }

  // Allow HEAD and OPTIONS too
  return new Response('OK', { status: 200 });
});