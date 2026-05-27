import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Quality Council — 5-agent review of a ContentCalendarPost draft
// Input: { post_id }
// Output: individual agent scores + council verdict + updated post status
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    let user = null;
    try { user = await base44.auth.me(); } catch (_) {}
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required.' }, { status: 403 });
    }

    let body = {};
    try { body = await req.json(); } catch (_) {}

    const { post_id } = body;
    if (!post_id) return Response.json({ error: 'post_id required' }, { status: 400 });

    const posts = await base44.asServiceRole.entities.ContentCalendarPost.filter({ id: post_id }, 'created_date', 1);
    if (!posts.length) return Response.json({ error: 'Post not found' }, { status: 404 });
    const post = posts[0];

    const postContext = `
Platform: ${post.platform}
Hook: ${post.hook || '(none)'}
Caption: ${post.caption || '(none)'}
CTA: ${post.cta || '(none)'}
Hashtags: ${post.hashtags || '(none)'}
Visual direction: ${post.broll_ideas || '(none)'}
Content notes: ${post.content_notes || '(none)'}
`.trim();

    const AGENTS = [
      {
        name: 'Trend Research Agent',
        prompt: `You are the Trend Research Agent for Gannon Waye social media.
Review this post draft and assess how well it aligns with current TikTok/Instagram music trends.
Score 1-10. Be honest.

POST:
${postContext}

Output JSON: { "score": <1-10>, "verdict": "pass|revise|reject", "reason": "...", "improvement": "...", "risk_note": "..." }`,
      },
      {
        name: 'Brand Voice Agent',
        prompt: `You are the Brand Voice Agent for Gannon Waye — Australian indie artist, emotional/cinematic/direct/human voice.
Review this post draft for authentic Gannon Waye brand fit. Reject anything generic, corporate, or cringe.

POST:
${postContext}

Output JSON: { "score": <1-10>, "verdict": "pass|revise|reject", "reason": "...", "improvement": "...", "risk_note": "..." }`,
      },
      {
        name: 'Content Quality Agent',
        prompt: `You are the Content Quality Agent. Review this social post for viral potential, emotional resonance, platform fit, and scroll-stopping power.
Score 1-10. Be tough — mediocre content harms the brand.

POST:
${postContext}

Output JSON: { "score": <1-10>, "verdict": "pass|revise|reject", "reason": "...", "improvement": "...", "risk_note": "..." }`,
      },
      {
        name: 'Compliance Gatekeeper',
        prompt: `You are the Compliance Gatekeeper for Gannon Waye social media.
Check this post for: legal risks, health/medical claims, unsafe content, insensitive content, privacy violations, misleading claims, platform policy violations.

POST:
${postContext}

Output JSON: { "score": <1-10>, "verdict": "pass|revise|reject", "reason": "...", "improvement": "...", "risk_note": "..." }`,
      },
      {
        name: 'Supervisor Agent',
        prompt: `You are the Supervisor / Quality Council Agent for Gannon Waye. Your job is final rejection authority.
REJECT anything: generic, embarrassing, vague, off-brand, unsafe, insensitive, low-value, or that would damage Gannon's reputation.
Only PASS content that would genuinely serve fans and the brand.

POST:
${postContext}

Output JSON: { "score": <1-10>, "verdict": "pass|revise|reject", "reason": "...", "improvement": "...", "risk_note": "..." }`,
      },
    ];

    const reviews = [];
    for (const agent of AGENTS) {
      try {
        const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: agent.prompt,
          response_json_schema: {
            type: 'object',
            properties: {
              score: { type: 'number' },
              verdict: { type: 'string' },
              reason: { type: 'string' },
              improvement: { type: 'string' },
              risk_note: { type: 'string' },
            },
          },
        });
        reviews.push({ agent: agent.name, ...result });
      } catch (e) {
        console.log(`[socialQualityCouncil] ${agent.name} error: ${e.message}`);
        reviews.push({ agent: agent.name, score: 5, verdict: 'revise', reason: 'Agent error — manual review needed', improvement: '', risk_note: '' });
      }
    }

    const avgScore = reviews.reduce((sum, r) => sum + (r.score || 5), 0) / reviews.length;
    const rejectCount = reviews.filter(r => r.verdict === 'reject').length;
    const reviseCount = reviews.filter(r => r.verdict === 'revise').length;

    let councilVerdict = 'pass';
    if (rejectCount >= 2) councilVerdict = 'reject';
    else if (rejectCount >= 1 || reviseCount >= 3) councilVerdict = 'revise';

    // Update post status based on verdict
    let newStatus = post.status;
    if (councilVerdict === 'pass') newStatus = 'pending_approval';
    else if (councilVerdict === 'reject') newStatus = 'rejected';
    // 'revise' stays as draft

    const councilNotes = reviews.map(r =>
      `[${r.agent}] Score: ${r.score}/10 | ${r.verdict?.toUpperCase()} | ${r.reason}`
    ).join('\n');

    await base44.asServiceRole.entities.ContentCalendarPost.update(post_id, {
      status: newStatus,
      content_notes: `${post.content_notes || ''}\n\n--- QUALITY COUNCIL (${new Date().toISOString()}) ---\nVerdict: ${councilVerdict.toUpperCase()} | Avg Score: ${avgScore.toFixed(1)}/10\n${councilNotes}`,
    });

    // If passed, update the ApprovalQueue item to reflect council approval
    if (councilVerdict === 'pass') {
      const aqItems = await base44.asServiceRole.entities.ApprovalQueue.filter({ status: 'pending' }, '-created_date', 20);
      for (const item of aqItems) {
        if (item.payload?.post_id === post_id) {
          await base44.asServiceRole.entities.ApprovalQueue.update(item.id, {
            action_description: `[QUALITY COUNCIL PASSED — Avg ${avgScore.toFixed(1)}/10]\n\n${item.action_description || ''}`,
          });
          break;
        }
      }
    }

    // Learning record
    await base44.asServiceRole.entities.AgentLearningRecord.create({
      agent_name: 'SocialQualityCouncil',
      lesson_type: 'other',
      what_worked: reviews.filter(r => r.verdict === 'pass').map(r => `${r.agent}: ${r.reason}`).join('\n') || 'none passed',
      what_failed: reviews.filter(r => r.verdict !== 'pass').map(r => `${r.agent}: ${r.reason}`).join('\n') || 'none failed',
      improvement: reviews.map(r => r.improvement).filter(Boolean).join('\n'),
      source: `post_id:${post_id}`,
      impact_score: Math.round(avgScore),
      confidence_score: 8,
      tags: ['quality_council', post.platform, councilVerdict],
    }).catch(() => {});

    return Response.json({
      success: true,
      post_id,
      council_verdict: councilVerdict,
      average_score: parseFloat(avgScore.toFixed(1)),
      new_status: newStatus,
      reviews,
      source_chain: 'SocialQualityCouncil → TrendResearch + BrandVoice + ContentQuality + Compliance + Supervisor → ContentCalendarPost.update → AgentLearningRecord',
    });

  } catch (error) {
    console.log(`[socialQualityCouncil] ERROR: ${error.message}`);
    return Response.json({ error: error.message }, { status: 500 });
  }
});