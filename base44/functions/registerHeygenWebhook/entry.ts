import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Registers a webhook endpoint with HeyGen so video render events are sent to our heygenWebhook function.
// Returns the endpoint_id and signing secret — the secret MUST be stored as HEYGEN_WEBHOOK_SECRET in dashboard settings.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const heygenApiKey = Deno.env.get('HEYGEN_API_KEY');
    if (!heygenApiKey) {
      return Response.json({ error: 'HEYGEN_API_KEY not configured' }, { status: 500 });
    }

    const appId = Deno.env.get('BASE44_APP_ID');
    if (!appId) {
      return Response.json({ error: 'BASE44_APP_ID not available' }, { status: 500 });
    }

    // Construct the webhook URL for our heygenWebhook function
    const webhookUrl = `https://api.base44.app/api/v2/apps/${appId}/webhook/heygenWebhook`;

    // First, check if an endpoint already exists for this URL
    const listResponse = await fetch('https://api.heygen.com/v3/webhooks/endpoints?limit=100', {
      headers: { 'X-Api-Key': heygenApiKey },
    });
    const listData = await listResponse.json();

    const existing = listData.data?.find(ep => ep.url === webhookUrl);

    if (existing) {
      // Update the existing endpoint to subscribe to the events we need
      const updateResponse = await fetch(`https://api.heygen.com/v3/webhooks/endpoints/${existing.endpoint_id}`, {
        method: 'PATCH',
        headers: {
          'X-Api-Key': heygenApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          events: [
            'avatar_video.success',
            'avatar_video.fail',
            'video_agent.success',
            'video_agent.fail',
          ],
        }),
      });
      const updateData = await updateResponse.json();

      return Response.json({
        status: 'success',
        message: 'Webhook endpoint already registered and updated.',
        endpoint_id: existing.endpoint_id,
        webhook_url: webhookUrl,
        events: ['avatar_video.success', 'avatar_video.fail', 'video_agent.success', 'video_agent.fail'],
        action: 'updated_existing',
        note: 'The signing secret was set when this endpoint was created. If you need a new secret, use the rotate-secret endpoint or delete and recreate.',
      });
    }

    // Create a new webhook endpoint
    const createResponse = await fetch('https://api.heygen.com/v3/webhooks/endpoints', {
      method: 'POST',
      headers: {
        'X-Api-Key': heygenApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
        events: [
          'avatar_video.success',
          'avatar_video.fail',
          'video_agent.success',
          'video_agent.fail',
        ],
      }),
    });

    const createData = await createResponse.json();

    if (!createResponse.ok) {
      return Response.json({
        status: 'error',
        error: 'Failed to create webhook endpoint',
        heygen_response: createData,
      }, { status: 502 });
    }

    return Response.json({
      status: 'success',
      message: 'Webhook endpoint created! Store the secret as HEYGEN_WEBHOOK_SECRET in your dashboard settings → environment variables.',
      endpoint_id: createData.data?.endpoint_id,
      webhook_url: webhookUrl,
      events: createData.data?.events,
      secret: createData.data?.secret,
      action: 'created_new',
      next_step: 'Go to dashboard settings → environment variables and add HEYGEN_WEBHOOK_SECRET with the secret value above.',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});