import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// OpenAI Store Conversion Assistant — analyses content performance and suggests conversion optimisations
// Admin-only. Approval-gated. Never changes prices or publishes automatically.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) return Response.json({ error: 'OPENAI_API_KEY not set' }, { status: 400 });

    const body = await req.json();
    const { context = '', goal = 'store_visits' } = body;

    const goalMap = {
      store_visits: 'drive traffic to gannonwaye.com/store',
      pre_saves: 'describe a presave-review process without naming a release or inventing a link',
      email_signups: 'grow email subscriber list',
      founding_supporters: 'convert fans to Founding Supporters at /founding-supporter',
    };

    const prompt = `You are a music e-commerce conversion expert for indie artist Gannon Waye.

Goal: ${goalMap[goal] || goal}
Context: ${context || 'Gannon Waye store with CDs, merch, and apparel. No release-specific claim is authorised in this request.'}

Return JSON with conversion optimisation suggestions:
{
  "cta_suggestions": ["3 high-converting CTA texts"],
  "hook_suggestions": ["3 emotional opening lines for posts"],
  "conversion_tactics": ["3 specific tactics to increase ${goal}"],
  "best_platform_for_goal": "instagram|tiktok|facebook|etc",
  "urgency_triggers": ["2 ethical urgency phrases"],
  "campaign_idea": "one complete campaign idea with platform, hook, CTA, timing"
}

Rules: No fake urgency. No spam tactics. Authentic Gannon Waye voice. Community-first approach. Do not name or imply any song, release date, release status, streaming link, presave link, launch, or countdown.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 700,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json({ error: err?.error?.message || `OpenAI ${res.status}` }, { status: 500 });
    }

    const data = await res.json();
    let result = {};
    try { result = JSON.parse(data.choices[0].message.content); } catch {}

    await base44.asServiceRole.entities.AgentMessage.create({
      from_system: 'openAIStoreConversionAssistant', to_system: 'content_command',
      message_type: 'conversion_task', priority: 'medium',
      subject: `Conversion suggestions for: ${goal}`,
      summary: (result.campaign_idea || '').substring(0, 200),
      payload_json: JSON.stringify(result),
      linked_route: '/admin/content-command',
      status: 'awaiting_approval', requires_approval: true,
      created_by_agent: 'openAIStoreConversionAssistant',
      cost_estimate: (data.usage?.total_tokens || 0) * 0.00000015,
      risk_level: 'low',
    }).catch(() => {});

    return Response.json({ success: true, suggestions: result, tokens_used: data.usage?.total_tokens || 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});