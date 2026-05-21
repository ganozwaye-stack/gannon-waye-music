import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const [opportunities, revenueOps] = await Promise.all([
      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are an autonomous growth intelligence agent for Gannon Waye, an independent Australian music artist with a luxury brand, LGBTQIA+-inclusive messaging, and focus on emotional authenticity.

Scan for 5 high-value GROWTH OPPORTUNITIES right now (2026):
- Viral TikTok/Instagram content formats trending this week
- Underserved emotional creator niches
- Algorithm windows opening up
- Best audience engagement windows
- Collaboration angles

For each opportunity return JSON. Output a JSON array of 5 objects:
[{
  "trend_name": "string",
  "platform": "tiktok|instagram|youtube|all",
  "opportunity_type": "viral_trend|creator_gap|collaboration|emotional_hook|algorithm_window|content_format",
  "viral_probability": 8,
  "engagement_potential": 9,
  "competition_level": "low|medium|high",
  "audience_match_score": 8,
  "recommended_hook": "opening line for content",
  "recommended_format": "video format description",
  "emotional_trigger": "core emotion",
  "cta_strategy": "what to ask audience to do",
  "estimated_growth_impact": "string estimate",
  "estimated_revenue_impact": "string estimate",
  "requires_approval": true
}]

CRITICAL: requires_approval must always be true. Never suggest automated posting.`,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
        response_json_schema: {
          type: 'object',
          properties: { opportunities: { type: 'array', items: { type: 'object' } } }
        }
      }),

      base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are a revenue intelligence agent for Gannon Waye, an independent Australian music artist.

Identify 3 high-value REVENUE OPPORTUNITIES for today (2026):
- Digital products that would sell well right now
- Premium service upsells for existing fans
- Subscription or membership angle
- Merch bundle opportunities
- Licensing opportunities

Return a JSON array of 3 revenue opportunities:
[{
  "opportunity_name": "string",
  "source": "string - where this came from",
  "revenue_type": "product|service|subscription|affiliate|partnership|digital|licensing|upsell|bundle",
  "estimated_value": "$X-$Y per month",
  "difficulty": 4,
  "risk_level": "low|medium|high",
  "automation_potential": 7,
  "audience_match": 9,
  "recommended_next_step": "specific action"
}]`,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
        response_json_schema: {
          type: 'object',
          properties: { opportunities: { type: 'array', items: { type: 'object' } } }
        }
      }),
    ]);

    let growthSaved = 0;
    let revenueSaved = 0;

    // Save growth opportunities
    const growthList = opportunities?.opportunities || (Array.isArray(opportunities) ? opportunities : []);
    for (const opp of growthList.slice(0, 5)) {
      if (!opp.trend_name) continue;
      await base44.asServiceRole.entities.GrowthOpportunity.create({
        ...opp,
        source_agent: 'GrowthOpportunityScanner',
        status: 'new',
        tags: ['auto-scan', opp.platform || 'all'],
      });
      growthSaved++;
    }

    // Save revenue opportunities
    const revenueList = revenueOps?.opportunities || (Array.isArray(revenueOps) ? revenueOps : []);
    for (const opp of revenueList.slice(0, 3)) {
      if (!opp.opportunity_name) continue;
      await base44.asServiceRole.entities.RevenueOpportunity.create({
        ...opp,
        source_agent: 'GrowthOpportunityScanner',
        status: 'new',
        tags: ['auto-scan', opp.revenue_type || 'other'],
      });
      revenueSaved++;
    }

    // Notify if high-value opportunities found
    if (growthSaved > 0 || revenueSaved > 0) {
      await base44.asServiceRole.functions.invoke('notifyAdmin', {
        notification_type: 'viral_opportunity',
        title: `Growth scan: ${growthSaved} viral + ${revenueSaved} revenue opportunities found`,
        summary: `New opportunities detected. Review in Growth Engine.`,
        severity: 'info',
        linked_route: '/admin/growth-engine',
        requires_action: false,
        source: 'GrowthOpportunityScanner',
      });
    }

    await base44.asServiceRole.entities.AgentTaskLog.create({
      agent_name: 'GrowthOpportunityScanner',
      task_title: 'Growth + Revenue Opportunity Scan',
      outcome: `Saved ${growthSaved} growth ops + ${revenueSaved} revenue ops`,
      was_automatic: true,
      required_approval: false,
      risk_check_result: 'pass',
      tags: ['growth', 'revenue', 'autonomous'],
    });

    return Response.json({ success: true, growth_saved: growthSaved, revenue_saved: revenueSaved });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});