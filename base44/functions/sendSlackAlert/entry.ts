import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Central Slack notification dispatcher
// Sends rich formatted alerts to a Slack channel or DM
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      channel = '#gannon-alerts',  // default channel
      message,
      title,
      urgency = 'normal',         // critical | high | normal | info
      category = 'system',        // order | alert | agent | brief | social | system
      fields = [],                 // [{label, value}]
      action_url,
    } = body;

    if (!message) return Response.json({ error: 'message required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('slack');

    // Resolve the target channel — if the specified channel doesn't exist,
    // fall back to a DM with the authenticated user themselves
    let targetChannel = channel;
    let usingDM = false;

    const urgencyColors = {
      critical: '#ef4444',
      high:     '#f97316',
      normal:   '#f5d06e',
      info:     '#6b7280',
    };
    const urgencyEmoji = {
      critical: '🚨',
      high:     '⚠️',
      normal:   '📣',
      info:     'ℹ️',
    };

    const blocks = [
      {
        type: 'header',
        text: { type: 'plain_text', text: `${urgencyEmoji[urgency] || '📣'} ${title || 'Gannon Core Alert'}`, emoji: true }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: message }
      },
    ];

    if (fields.length > 0) {
      blocks.push({
        type: 'section',
        fields: fields.slice(0, 10).map(f => ({ type: 'mrkdwn', text: `*${f.label}*\n${f.value}` }))
      });
    }

    if (action_url) {
      blocks.push({
        type: 'actions',
        elements: [{
          type: 'button',
          text: { type: 'plain_text', text: 'View in Admin →' },
          url: action_url,
          style: 'primary',
        }]
      });
    }

    blocks.push({ type: 'divider' });

    const sendToChannel = async (chan) => {
      const payload = {
        channel: chan,
        attachments: [{
          color: urgencyColors[urgency] || urgencyColors.normal,
          blocks,
        }]
      };

      const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return res.json();
    };

    let result = await sendToChannel(targetChannel);

    // If channel doesn't exist, fall back to DM with the authenticated user
    if (!result.ok && result.error === 'channel_not_found') {
      const authRes = await fetch('https://slack.com/api/auth.test', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const authData = await authRes.json();
      if (authData.ok && authData.user_id) {
        targetChannel = authData.user_id;
        usingDM = true;
        result = await sendToChannel(targetChannel);
      }
    }

    if (!result.ok) {
      return Response.json({ error: result.error, detail: result }, { status: 502 });
    }

    return Response.json({ success: true, ts: result.ts, channel: result.channel, delivered_via_dm: usingDM });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});