import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// OpenAI QA Assistant — analyses test failures, generates fix summaries
// Admin-only. Cost-controlled. Max 600 tokens per call.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const body = await req.json();
    const { test_output = '', test_file = '', url = 'https://gannonwaye.com' } = body;

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) return Response.json({ error: 'OPENAI_API_KEY not set' }, { status: 400 });

    const prompt = `You are a QA engineer. Analyse this Playwright test output for ${url} and return JSON:
{
  "pass_count": 0,
  "fail_count": 0,
  "critical_failures": ["list of critical failures only"],
  "quick_fix_suggestions": ["list of 3 actionable fixes"],
  "priority": "critical|high|medium",
  "retest_command": "npx playwright test ..."
}

Test output:
${test_output.substring(0, 3000)}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
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
      from_system: 'openAIQAAssistant', to_system: 'autonomous_repair_loop',
      message_type: 'playwright_failure', priority: result.priority || 'high',
      subject: `QA Analysis: ${result.fail_count || 0} failures`,
      summary: (result.critical_failures || []).join('; ').substring(0, 300),
      payload_json: JSON.stringify(result),
      linked_route: '/admin/autonomous-repair-loop',
      status: 'new', requires_approval: false,
      created_by_agent: 'openAIQAAssistant',
      cost_estimate: (data.usage?.total_tokens || 0) * 0.00000015,
      risk_level: result.priority === 'critical' ? 'high' : 'medium',
    }).catch(() => {});

    return Response.json({ success: true, analysis: result, tokens_used: data.usage?.total_tokens || 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});