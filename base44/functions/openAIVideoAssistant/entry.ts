import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// OpenAI Video Assistant — Phase 1 only: transcript analysis, hook detection, CapCut prompts
// NO automatic video editing. NO TikTok upload. All output requires approval.

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
    const { transcript = '', timestamp_notes = '', video_context = '', platform = 'tiktok' } = body;

    if (!transcript && !timestamp_notes) {
      return Response.json({ error: 'Provide transcript or timestamp_notes' }, { status: 400 });
    }

    const prompt = `You are a video content strategist for indie artist Gannon Waye.
Platform: ${platform}
Video context: ${video_context || 'Music/behind-scenes content'}

TRANSCRIPT/NOTES:
${(transcript || timestamp_notes).substring(0, 3000)}

Analyse and return JSON:
{
  "best_hook_moment": "timestamp or quote that makes the strongest hook",
  "hook_text": "rewritten hook for ${platform} (max 10 words)",
  "emotional_peaks": ["timestamp + description of 2-3 emotional moments"],
  "clip_ideas": ["3 specific clip suggestions with start/end context"],
  "capcut_prompt": "CapCut edit instructions: cuts, transitions, text overlays, music sync",
  "caption": "post caption for ${platform}",
  "thumbnail_idea": "thumbnail visual concept",
  "hook_type": "question|statement|visual|emotional|curiosity"
}

Phase 1 only. No auto-upload. Output requires Gannon approval before use.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
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
      from_system: 'openAIVideoAssistant', to_system: 'video_agent_command',
      message_type: 'video_task', priority: 'medium',
      subject: `Video analysis: hook detected for ${platform}`,
      summary: result.hook_text || result.best_hook_moment || 'Video hook analysis complete',
      payload_json: JSON.stringify(result),
      linked_route: '/admin/video-agent-command',
      status: 'awaiting_approval', requires_approval: true,
      created_by_agent: 'openAIVideoAssistant',
      cost_estimate: (data.usage?.total_tokens || 0) * 0.00000015,
      risk_level: 'low',
    }).catch(() => {});

    return Response.json({
      success: true,
      phase: 1,
      note: 'Phase 1 only — hook detection, CapCut prompts, clip ideas. No auto-upload.',
      analysis: result,
      tokens_used: data.usage?.total_tokens || 0,
      approval_required: true,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});