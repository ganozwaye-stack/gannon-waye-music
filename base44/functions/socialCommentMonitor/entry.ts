import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Social comment triage — classifies comments and decides response strategy
// When real OAuth is connected, this will fetch live comments
// For now, it processes any comments submitted via the dashboard

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const { comments = [], platform = 'instagram', simulate = false } = body;

    // If simulating (for dashboard demo), generate sample comments
    let commentsToProcess = comments;
    if (simulate || comments.length === 0) {
      commentsToProcess = [
        { id: 'sim1', author: '@fan_account', text: "This song literally saved my life thank you so much ❤️", likes: 234 },
        { id: 'sim2', author: '@music_blog_au', text: "Would you be interested in a feature piece? DM us!", likes: 45 },
        { id: 'sim3', author: '@hater123', text: "This is terrible lol nobody cares", likes: 2 },
        { id: 'sim4', author: '@collaborative_artist', text: "Love this energy! Would love to collab sometime 🎵", likes: 89 },
        { id: 'sim5', author: '@general_fan', text: "Obsessed with this omg 🔥🔥🔥", likes: 156 },
        { id: 'sim6', author: '@booking_agent_aus', text: "Hi, we'd like to discuss a booking opportunity", likes: 12 },
        { id: 'sim7', author: '@brand_deals', text: "We love your aesthetic, interested in partnership?", likes: 8 },
        { id: 'sim8', author: '@fan2', text: "When is the album coming?? 👀", likes: 67 },
      ];
    }

    // AI triage each comment
    const triagePrompt = `You are a social media manager for Gannon Waye, an Australian LGBTQIA+ pop artist.

Analyse these social media comments and classify each one:

Comments:
${commentsToProcess.map((c, i) => `${i+1}. [${c.author}]: "${c.text}" (${c.likes} likes)`).join('\n')}

For each comment, return a JSON array with objects containing:
- id: the comment id
- author: the author
- text: the text
- classification: one of: "general_positive" | "general_negative" | "important_fan" | "business_opportunity" | "collaboration" | "media_press" | "troll_ignore" | "requires_gannon"
- priority: "low" | "medium" | "high" | "critical"
- escalate_to_gannon: true/false
- auto_response: suggested response text (null if should be ignored or needs Gannon)
- reason: brief explanation of classification

Rules:
- Business opportunities, media requests, bookings → escalate_to_gannon: true, priority: high
- Emotional/personal fan messages → escalate_to_gannon: false if can be handled warmly by bot
- Trolls/hate → classification: troll_ignore, no response
- Collaboration offers → escalate_to_gannon: true (Gannon decides)
- General fans → auto_response with warm brand voice

Return ONLY valid JSON array, no markdown.`;

    const triageResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: triagePrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          triage: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                author: { type: 'string' },
                text: { type: 'string' },
                classification: { type: 'string' },
                priority: { type: 'string' },
                escalate_to_gannon: { type: 'boolean' },
                auto_response: { type: 'string' },
                reason: { type: 'string' },
              }
            }
          }
        }
      }
    });

    const triage = triageResult?.triage || [];

    // Save to Knowledge Vault as a social archive entry
    await base44.asServiceRole.entities.KnowledgeVault.create({
      title: `Social Comment Triage — ${platform} — ${new Date().toLocaleDateString('en-AU')}`,
      category: 'social_archive',
      content: JSON.stringify(triage, null, 2),
      summary: `${triage.length} comments triaged. ${triage.filter(t => t.escalate_to_gannon).length} require Gannon's attention. ${triage.filter(t => t.auto_response).length} have auto-responses ready.`,
      tags: [platform, 'comments', 'triage', 'social'],
      source: 'Social Comment Monitor',
      is_sensitive: false,
      access_level: 'admin_only',
      linked_agent: 'SocialCommentMonitor',
    });

    // Create risk alerts for business opportunities
    const highPriority = triage.filter(t => t.priority === 'high' || t.priority === 'critical');
    for (const item of highPriority) {
      await base44.asServiceRole.entities.RiskAlert.create({
        alert_type: 'opportunity',
        severity: item.priority === 'critical' ? 'high' : 'warning',
        title: `Social Opportunity: ${item.author} on ${platform}`,
        description: `"${item.text}" — Classification: ${item.classification}`,
        source_agent: 'SocialCommentMonitor',
        status: 'open',
        recommended_action: item.auto_response ? `Auto-response ready: "${item.auto_response.substring(0,100)}..."` : 'Requires manual Gannon response',
        requires_professional: false,
      });
    }

    await base44.asServiceRole.entities.AgentTaskLog.create({
      agent_name: 'SocialCommentMonitor',
      task_title: `Triaged ${triage.length} ${platform} comments`,
      outcome: `${triage.filter(t => t.escalate_to_gannon).length} escalated, ${triage.filter(t => t.auto_response).length} auto-responses drafted`,
      was_automatic: true,
      required_approval: false,
      risk_check_result: 'pass',
      tags: ['social', 'comments', platform],
    });

    return Response.json({
      success: true,
      total: triage.length,
      escalated: triage.filter(t => t.escalate_to_gannon).length,
      auto_responses: triage.filter(t => t.auto_response).length,
      triage,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});