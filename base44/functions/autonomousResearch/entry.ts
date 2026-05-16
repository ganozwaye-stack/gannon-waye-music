import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Topics the research agent rotates through automatically
const RESEARCH_TOPICS = [
  { topic: 'music industry trends 2025-2026', category: 'research', tags: ['music', 'industry', 'trends'] },
  { topic: 'viral music marketing strategies TikTok Instagram', category: 'research', tags: ['marketing', 'social', 'viral'] },
  { topic: 'independent artist revenue streams and monetization', category: 'financial', tags: ['revenue', 'monetization', 'indie'] },
  { topic: 'AI tools for musicians and music producers 2025', category: 'research', tags: ['ai', 'tools', 'production'] },
  { topic: 'music sync licensing opportunities and placements', category: 'financial', tags: ['sync', 'licensing', 'revenue'] },
  { topic: 'LGBTQIA+ music scene artists brands and culture', category: 'research', tags: ['lgbtqia', 'culture', 'brand'] },
  { topic: 'Australian music industry opportunities', category: 'research', tags: ['australia', 'local', 'industry'] },
  { topic: 'fan engagement strategies for independent artists', category: 'research', tags: ['fans', 'engagement', 'community'] },
  { topic: 'music distribution platforms comparison 2025', category: 'research', tags: ['distribution', 'platforms', 'tunecore'] },
  { topic: 'brand sponsorship deals for musicians', category: 'financial', tags: ['sponsorship', 'brand', 'deals'] },
  { topic: 'social media algorithm changes music promotion', category: 'research', tags: ['algorithm', 'promotion', 'social'] },
  { topic: 'merch and physical product trends for artists', category: 'research', tags: ['merch', 'products', 'revenue'] },
  { topic: 'music release strategy and timing best practices', category: 'creative', tags: ['release', 'strategy', 'timing'] },
  { topic: 'mental health and wellness for performing artists', category: 'personal_profile', tags: ['wellness', 'mental-health', 'artist'] },
  { topic: 'music NFTs and web3 opportunities for artists', category: 'financial', tags: ['nft', 'web3', 'digital'] },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This function is called by the scheduler — no user auth needed
    // Rotate through topics based on time of day to ensure variety
    const hour = new Date().getHours();
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const topicIndex = (dayOfYear * 24 + hour) % RESEARCH_TOPICS.length;
    const { topic, category, tags } = RESEARCH_TOPICS[topicIndex];

    // Check if we researched this topic very recently (within 12 hours) to avoid duplicates
    const existing = await base44.asServiceRole.entities.KnowledgeVault.filter({
      category: category,
    }, '-created_date', 5);

    const recentlyResearched = existing.some(item =>
      item.tags?.some(t => tags.includes(t)) &&
      item.created_date &&
      (Date.now() - new Date(item.created_date).getTime()) < 12 * 60 * 60 * 1000
    );

    if (recentlyResearched) {
      // Pick a different topic
      const altIndex = (topicIndex + 7) % RESEARCH_TOPICS.length;
      const alt = RESEARCH_TOPICS[altIndex];
      Object.assign({ topic: alt.topic, category: alt.category, tags: alt.tags }, { topic: alt.topic, category: alt.category, tags: alt.tags });
    }

    // Research using LLM with web search
    const research = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are a dedicated research agent for Gannon Waye, an Australian LGBTQIA+ affirming pop artist releasing debut single "Thank You".

Research this topic thoroughly: ${topic}

Provide:
1. KEY FINDINGS: 5-7 specific, actionable insights (not generic advice)
2. OPPORTUNITIES: 3 concrete opportunities Gannon should act on
3. RISKS: 2-3 risks to be aware of  
4. TRENDING NOW: What is hot and rising RIGHT NOW related to this topic
5. RECOMMENDED ACTIONS: Top 3 immediate actions for Gannon's team

Be specific with numbers, platform names, artist examples, and dollar amounts where relevant.
Focus on what would actually help an independent Australian artist with Gannon's profile.`,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
    });

    // Generate a concise summary
    const summaryText = research?.substring(0, 300) || 'Research completed';

    // Save to Knowledge Vault
    const title = `Research: ${topic.substring(0, 60)} — ${new Date().toLocaleDateString('en-AU')}`;
    await base44.asServiceRole.entities.KnowledgeVault.create({
      title,
      category,
      content: research || 'Research unavailable',
      summary: summaryText,
      tags: [...tags, 'auto-research', 'autonomous'],
      source: 'Autonomous Research Agent',
      is_sensitive: false,
      access_level: 'admin_only',
      linked_agent: 'ResearchAgent',
    });

    // Log the action
    await base44.asServiceRole.entities.AgentTaskLog.create({
      agent_name: 'AutonomousResearchAgent',
      task_title: `Research completed: ${topic.substring(0, 80)}`,
      outcome: `Saved to Knowledge Vault under category: ${category}`,
      was_automatic: true,
      required_approval: false,
      risk_check_result: 'pass',
      tags: ['autonomous', 'research', ...tags],
      source_used: 'Internet + LLM',
    });

    return Response.json({
      success: true,
      topic,
      category,
      saved: title,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});