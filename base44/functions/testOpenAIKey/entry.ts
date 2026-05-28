import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    const present = !!apiKey && apiKey.length > 10;

    if (!present) {
      return Response.json({
        present: false, valid: false, model_reachable: false,
        key_display: 'missing',
        last_checked: new Date().toISOString(),
        error_type: 'key_missing',
        estimated_cost: 'minimal',
        note: 'Set OPENAI_API_KEY in Base44 Secrets. Never log or display the key value.',
      });
    }

    // Minimal validation — tiny request, cheap model
    let valid = false;
    let model_reachable = false;
    let error_type = null;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Reply with only the word: OK' }],
          max_tokens: 5,
        }),
      });

      if (res.ok) {
        valid = true;
        model_reachable = true;
      } else {
        const err = await res.json().catch(() => ({}));
        error_type = err?.error?.code || err?.error?.type || `http_${res.status}`;
        if (res.status === 401) error_type = 'invalid_key_or_revoked';
        if (res.status === 429) { valid = true; error_type = 'rate_limited'; } // key is valid, just rate limited
      }
    } catch (fetchErr) {
      error_type = 'network_error';
    }

    // Log key test (no key value ever stored)
    await base44.asServiceRole.entities.AgentTaskLog.create({
      task_title: `OpenAI key test — ${valid ? 'VALID' : 'INVALID'}`,
      agent_name: 'testOpenAIKey',
      status: valid ? 'completed' : 'failed',
    }).catch(() => {});

    return Response.json({
      present: true,
      valid,
      model_reachable,
      key_display: 'present',
      last_checked: new Date().toISOString(),
      error_type,
      estimated_cost: 'minimal (~$0.00001 per test)',
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});