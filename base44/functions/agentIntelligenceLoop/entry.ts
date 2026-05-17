import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Multi-domain intelligence topics for continuous learning
const INTELLIGENCE_DOMAINS = [
  // Ecommerce & Products
  { topic: 'viral ecommerce products trending now 2026', domain: 'ecommerce', tags: ['viral', 'products', 'ecommerce'], saveAs: 'research' },
  { topic: 'high-margin digital products creators sell online 2026', domain: 'ecommerce', tags: ['digital', 'margin', 'products'], saveAs: 'financial' },
  { topic: 'luxury merchandise strategies for independent artists', domain: 'ecommerce', tags: ['luxury', 'merch', 'strategy'], saveAs: 'research' },
  // Creator Economy
  { topic: 'creator economy revenue models beyond advertising 2026', domain: 'creator', tags: ['creator', 'revenue', 'monetization'], saveAs: 'financial' },
  { topic: 'TikTok shop creator affiliate highest converting products', domain: 'creator', tags: ['tiktok', 'affiliate', 'conversion'], saveAs: 'research' },
  { topic: 'Substack Patreon creator membership tier strategies', domain: 'creator', tags: ['membership', 'subscription', 'fans'], saveAs: 'research' },
  // AI & Automation SaaS
  { topic: 'AI automation SaaS tools highest ROI for small business 2026', domain: 'saas', tags: ['ai', 'saas', 'automation'], saveAs: 'research' },
  { topic: 'no-code AI agent platforms market opportunities 2026', domain: 'saas', tags: ['nocode', 'agents', 'saas'], saveAs: 'financial' },
  // Social & Viral
  { topic: 'viral content formats performing best on TikTok Instagram 2026', domain: 'social', tags: ['viral', 'content', 'social'], saveAs: 'creative' },
  { topic: 'Instagram Reels vs TikTok organic reach comparison 2026', domain: 'social', tags: ['reach', 'organic', 'social'], saveAs: 'research' },
  // Luxury & Premium Branding
  { topic: 'luxury brand digital experience strategies Apple Rolex method', domain: 'luxury', tags: ['luxury', 'brand', 'premium'], saveAs: 'brand_profile' },
  { topic: 'premium pricing psychology high-end consumer behavior', domain: 'luxury', tags: ['pricing', 'psychology', 'premium'], saveAs: 'research' },
  // Music & Artist Economy
  { topic: 'independent artist income streams highest ROI 2026', domain: 'music', tags: ['artist', 'income', 'music'], saveAs: 'financial' },
  { topic: 'sync licensing music TV film game opportunities 2026', domain: 'music', tags: ['sync', 'licensing', 'music'], saveAs: 'financial' },
  // Conversion & Marketing
  { topic: 'highest converting landing page patterns ecommerce 2026', domain: 'conversion', tags: ['conversion', 'landing', 'ecommerce'], saveAs: 'research' },
  { topic: 'email marketing automation sequences highest open rates', domain: 'conversion', tags: ['email', 'automation', 'conversion'], saveAs: 'research' },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Select 2 topics per run based on time rotation for variety
    const now = new Date();
    const minuteSlot = Math.floor(Date.now() / (4 * 60 * 60 * 1000)); // changes every 4h
    const idx1 = minuteSlot % INTELLIGENCE_DOMAINS.length;
    const idx2 = (minuteSlot + 5) % INTELLIGENCE_DOMAINS.length;

    const topics = [INTELLIGENCE_DOMAINS[idx1], INTELLIGENCE_DOMAINS[idx2]];
    const results = [];

    for (const { topic, domain, tags, saveAs } of topics) {
      // Dedup check — skip if researched in last 8h
      const recent = await base44.asServiceRole.entities.KnowledgeVault.filter(
        { category: saveAs }, '-created_date', 5
      );
      const alreadyDone = recent.some(r =>
        r.tags?.some(t => tags.includes(t)) &&
        r.created_date &&
        (Date.now() - new Date(r.created_date).getTime()) < 8 * 60 * 60 * 1000
      );
      if (alreadyDone) {
        results.push({ topic, skipped: true });
        continue;
      }

      // Research with live internet
      const research = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are an elite autonomous intelligence agent. Research this topic thoroughly RIGHT NOW and extract maximum value.

Topic: ${topic}
Domain: ${domain}

Provide:
## KEY FINDINGS
5-7 specific, data-backed insights (include numbers, names, percentages)

## TOP OPPORTUNITIES (ranked by ROI)
3 concrete opportunities with scores:
- ROI Score: /10
- Risk Score: /10  
- Automation Potential: /10
- Difficulty: /10

## RISKS TO WATCH
2-3 specific risks with mitigation

## TRENDING RIGHT NOW
What is hot and rising this week

## RECOMMENDED ACTION THIS WEEK
1 specific immediate action with expected outcome

## LONG-TERM MEMORY NOTE
1 sentence insight worth remembering permanently

Be hyper-specific. No generic advice. Include platform names, dollar amounts, creator names, tool names where applicable.`,
        add_context_from_internet: true,
        model: 'gemini_3_flash',
      });

      const title = `[${domain.toUpperCase()}] ${topic.substring(0, 70)} — ${now.toLocaleDateString('en-AU')}`;

      // Save to KnowledgeVault
      await base44.asServiceRole.entities.KnowledgeVault.create({
        title,
        category: saveAs,
        content: research || '',
        summary: research?.substring(0, 250) || '',
        tags: [...tags, 'auto-intelligence', domain, 'autonomous'],
        source: 'AgentIntelligenceLoop',
        access_level: 'admin_only',
        linked_agent: 'AgentIntelligenceLoop',
      });

      // Check for high-value opportunities to save to IdeaOpportunity
      const hasOpportunity = research?.toLowerCase().includes('opportunity') ||
        research?.toLowerCase().includes('roi') ||
        research?.toLowerCase().includes('revenue');

      if (hasOpportunity) {
        // Extract opportunity data with LLM
        const oppData = await base44.asServiceRole.integrations.Core.InvokeLLM({
          prompt: `Extract the top opportunity from this research and return JSON only:
${research?.substring(0, 2000)}

Return ONLY valid JSON in this exact format:
{
  "title": "opportunity title (max 60 chars)",
  "category": "business|ecommerce|saas|content|automation|marketing|product|other",
  "description": "2-3 sentence description",
  "target_customer": "who this is for",
  "problem_solved": "what problem this solves",
  "revenue_potential_score": 7,
  "automation_potential_score": 8,
  "difficulty_score": 4,
  "risk_score": 3,
  "opportunity_score": 75,
  "estimated_monthly_value": "$2,000-$5,000",
  "recommended_next_step": "specific action"
}`,
          response_json_schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              category: { type: 'string' },
              description: { type: 'string' },
              target_customer: { type: 'string' },
              problem_solved: { type: 'string' },
              revenue_potential_score: { type: 'number' },
              automation_potential_score: { type: 'number' },
              difficulty_score: { type: 'number' },
              risk_score: { type: 'number' },
              opportunity_score: { type: 'number' },
              estimated_monthly_value: { type: 'string' },
              recommended_next_step: { type: 'string' },
            }
          }
        });

        if (oppData?.title && (oppData?.opportunity_score || 0) >= 65) {
          await base44.asServiceRole.entities.IdeaOpportunity.create({
            ...oppData,
            status: 'new',
            source_agent: 'AgentIntelligenceLoop',
            tags: [...tags, domain, 'auto-discovered'],
            requires_approval: false,
          });
        }
      }

      // Log action
      await base44.asServiceRole.entities.AgentTaskLog.create({
        agent_name: 'AgentIntelligenceLoop',
        task_title: `Research: ${topic.substring(0, 80)}`,
        outcome: `Saved to ${saveAs} vault. ${hasOpportunity ? 'Opportunity extracted.' : ''}`,
        was_automatic: true,
        required_approval: false,
        risk_check_result: 'pass',
        tags: [...tags, 'autonomous', 'intelligence'],
        source_used: 'Internet + LLM',
      });

      results.push({ topic, saved: true, domain });
    }

    return Response.json({ success: true, processed: results.length, results });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});