import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Collect and store release feedback from fans/community
// Creates a feedback record linked to a specific release
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const {
      release_id,
      fan_name,
      fan_email,
      feedback_text,
      rating,  // 1-10
      sentiment, // positive | neutral | negative
    } = body;

    if (!release_id || !feedback_text) {
      return Response.json({ error: 'release_id and feedback_text required' }, { status: 400 });
    }

    const release = await base44.asServiceRole.entities.Release.filter({ id: release_id }, '', 1)[0];
    if (!release) {
      return Response.json({ error: 'Release not found' }, { status: 404 });
    }

    // Store feedback in Knowledge Vault
    await base44.asServiceRole.entities.KnowledgeVault.create({
      title: `Release Feedback: ${release.title} — ${fan_name || 'Anonymous'}`,
      category: 'creative',
      content: feedback_text,
      summary: `Rating: ${rating || '—'}/10 | Sentiment: ${sentiment || 'neutral'}`,
      source: `ReleaseFeedback:${release_id}`,
      tags: [
        'release-feedback',
        `release:${release_id}`,
        sentiment || 'neutral',
        `rating:${rating || 0}`,
      ],
      access_level: 'admin_only',
    });

    // Log for agent
    await base44.asServiceRole.entities.AgentTaskLog.create({
      agent_name: 'FeedbackCollector',
      task_title: `New feedback on "${release.title}"`,
      task_description: `From ${fan_name || 'anonymous'} | Rating: ${rating || '—'}/10`,
      outcome: 'Feedback stored in Knowledge Vault',
      was_automatic: true,
      required_approval: false,
      risk_check_result: 'pass',
      tags: ['feedback', 'release', sentiment || 'neutral'],
    });

    // Alert admin via Slack if rating is low
    if (rating && rating <= 4) {
      try {
        await base44.asServiceRole.functions.invoke('sendSlackAlert', {
          channel: '#gannon-alerts',
          title: `⚠️ Low feedback rating on "${release.title}"`,
          urgency: 'normal',
          message: `*${fan_name || 'Anonymous'}* left a ${rating}/10 rating: "${feedback_text.substring(0, 200)}"`,
          action_url: 'https://gannonwaye.base44.app/admin/knowledge-vault',
        });
      } catch (_e) {
        // Non-blocking
      }
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});