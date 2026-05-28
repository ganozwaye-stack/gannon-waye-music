import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// OpenAI Repair Assistant
// Analyses Playwright/GitHub Actions failures and produces structured fix instructions.
// Admin-only. Cost-controlled. Creates AgentMessage + SystemHealthIssue.

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const body = await req.json();
    const { failedTests = [], errorStack = '', source = 'manual', maxTokens = 800 } = body;

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'OPENAI_API_KEY not set. Add it in Base44 Secrets.' }, { status: 400 });
    }

    if (failedTests.length === 0 && !errorStack) {
      return Response.json({ error: 'Provide failedTests or errorStack to analyse.' }, { status: 400 });
    }

    const prompt = `You are a senior web developer analysing Playwright test failures for a React/Base44 music e-commerce site (gannonwaye.com).

FAILED TESTS:
${failedTests.map((t, i) => `${i + 1}. ${t}`).join('\n')}

ERROR STACK:
${errorStack.substring(0, 2000)}

Provide a structured JSON analysis with ONLY these fields:
{
  "likely_files": ["list of 2-5 suspected React/JS files"],
  "root_cause": "one sentence cause",
  "fix_plan": "3-5 step Base44-safe fix (no Next.js, no Node backend, no custom auth)",
  "cursor_prompt": "short Cursor AI fix prompt",
  "warp_command": "exact terminal command to run after fix",
  "github_branch": "fix/short-description",
  "retest_command": "npx playwright test ...",
  "severity": "critical|high|medium"
}`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json({ error: err?.error?.message || `OpenAI error ${res.status}` }, { status: 500 });
    }

    const data = await res.json();
    let analysis = {};
    try { analysis = JSON.parse(data.choices[0].message.content); } catch {}

    // Create AgentMessage
    await base44.asServiceRole.entities.AgentMessage.create({
      from_system: 'openAIRepairAssistant',
      to_system: 'autonomous_repair_loop',
      message_type: 'store_repair_task',
      priority: analysis.severity === 'critical' ? 'critical' : 'high',
      subject: `AI Repair Analysis: ${failedTests[0] || 'store failure'}`,
      summary: analysis.root_cause || 'See fix plan',
      payload_json: JSON.stringify(analysis),
      linked_route: '/admin/autonomous-repair-loop',
      status: 'new',
      requires_approval: false,
      created_by_agent: 'openAIRepairAssistant',
      cost_estimate: 0.001,
      risk_level: analysis.severity === 'critical' ? 'high' : 'medium',
    }).catch(() => {});

    // Create SystemHealthIssue if critical
    if (analysis.severity === 'critical' || failedTests.length > 0) {
      await base44.asServiceRole.entities.SystemHealthIssue.create({
        system_area: 'other',
        issue_title: `AI Repair: ${failedTests[0] || 'store failure'}`,
        severity: analysis.severity === 'critical' ? 'critical' : 'high',
        detected_by: 'openAIRepairAssistant',
        recommended_fix: `${analysis.fix_plan}\n\nCursor prompt: ${analysis.cursor_prompt}\n\nRetest: ${analysis.retest_command}`,
        status: 'open',
        last_checked: new Date().toISOString(),
      }).catch(() => {});
    }

    return Response.json({
      success: true,
      analysis,
      tokens_used: data.usage?.total_tokens || 0,
      estimated_cost_usd: ((data.usage?.total_tokens || 0) * 0.00000015).toFixed(6),
      message_created: true,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});