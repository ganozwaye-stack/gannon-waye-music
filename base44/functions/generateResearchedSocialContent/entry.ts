import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { topic, content_type, related_release, platform, tone } = body;

    if (!topic) return Response.json({ error: 'topic is required' }, { status: 400 });

    // Step 1: Research the topic using web search for credible, verifiable facts
    const researchPrompt = `You are a PhD-level researcher fact-checking content for a music artist's social media.
Research this topic thoroughly using web sources: "${topic}"
${related_release ? `Context: This is related to the release "${related_release}".` : ''}

Find 3-5 credible, verifiable facts, statistics, or insights related to this topic.
For each fact, provide:
- The fact itself (concise, specific)
- The source (organisation, publication, or study name)
- Approximate date if available
- Why it's relevant to the topic

Prioritise:
- Peer-reviewed research and academic studies
- Reputable publications and news organisations
- Official statistics and reports
- Named experts with credentials

Reject any claim that is opinion, unverified, or from dubious sources.
Return as JSON with this structure:
{
  "facts": [
    { "claim": "...", "source": "...", "date": "...", "relevance": "..." }
  ],
  "themes": ["theme1", "theme2"],
  "research_gaps": ["any notable gaps in available research"]
}`;

    const researchResult = await base44.integrations.Core.InvokeLLM({
      prompt: researchPrompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: 'object',
        properties: {
          facts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                claim: { type: 'string' },
                source: { type: 'string' },
                date: { type: 'string' },
                relevance: { type: 'string' }
              }
            }
          },
          themes: { type: 'array', items: { type: 'string' } },
          research_gaps: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    // Step 2: Generate social content using the researched facts
    const validContentTypes = ['reel', 'caption', 'hook', 'first_comment', 'lyric_quote_post', 'behind_song_post', 'merch_post', 'press_snippet', 'newsletter_draft'];
    const finalContentType = validContentTypes.includes(content_type) ? content_type : 'caption';
    const finalTone = tone || 'authentic, warm, and credible — not salesy';

    const contentPrompt = `You are an expert social media content writer for an independent music artist (Gannon Waye).
Using ONLY the researched facts below, create a ${finalContentType} post for ${platform || 'Instagram'}.

Tone: ${finalTone}

Researched facts (use these for credibility — cite sources naturally in the content):
${JSON.stringify(researchResult.facts, null, 2)}

Themes to weave in: ${researchResult.themes.join(', ')}

Rules:
- Every claim must be backed by one of the researched facts above
- Do NOT invent statistics, quotes, or sources
- If a fact doesn't fit naturally, leave it out rather than forcing it
- Include a subtle call-to-action relevant to the content type
- Keep it concise and scannable
- If it's a reel hook, make it punchy (under 15 words)
- If it's a caption, aim for 80-150 words

Return the post content as plain text.`;

    const contentResult = await base44.integrations.Core.InvokeLLM({
      prompt: contentPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          post_content: { type: 'string' },
          suggested_hashtags: { type: 'array', items: { type: 'string' } },
          sources_used: { type: 'array', items: { type: 'string' } },
          notes: { type: 'string' }
        }
      }
    });

    // Step 3: Save as a ContentPipelineItem for review
    const pipelineItem = await base44.entities.ContentPipelineItem.create({
      title: `${finalContentType} — ${topic.slice(0, 60)}`,
      description: contentResult.post_content,
      content_type: finalContentType,
      status: 'needs_approval',
      priority: 'medium',
      related_release: related_release || null,
      related_song: related_release || null,
      next_action: 'Review for accuracy and brand alignment before scheduling',
      approval_required: true,
      approval_notes: `Auto-generated with web-researched facts. Sources: ${(contentResult.sources_used || []).join(', ')}`,
      sort_order: 0,
    });

    return Response.json({
      status: 'success',
      content: contentResult.post_content,
      hashtags: contentResult.suggested_hashtags,
      sources: contentResult.sources_used,
      research_facts: researchResult.facts,
      themes: researchResult.themes,
      pipeline_item_id: pipelineItem.id,
      message: 'Content created with web-researched facts and saved to content pipeline for approval.'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});