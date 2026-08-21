import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Generate trending hooks, viral ideas, and content strategies
    const trendReport = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are an elite music marketing strategist and viral content creator working for Gannon Waye, an Australian LGBTQIA+ affirming independent artist.

Generate a DAILY TREND REPORT with:

## 🔥 TOP 5 VIRAL HOOKS FOR TODAY
Create 5 specific social media hooks Gannon can use TODAY. Each hook should:
- Be under 15 words
- Create immediate emotional response or curiosity
- Be appropriate for Instagram/TikTok captions or video openers

## 💡 3 WINNING CONTENT IDEAS
Specific video/post concepts that are trending RIGHT NOW that Gannon could execute:
- What the content is
- Which platform
- Why it would work
- Estimated reach potential

## 🎯 MONEY-MAKING OPPORTUNITY OF THE DAY
One specific revenue opportunity Gannon should pursue this week:
- What it is
- How to execute it
- Estimated earning potential
- Risk level (low/medium/high)

## 📈 TRENDING SOUNDS/TOPICS TO RIDE
3 trending audio clips, hashtags, or cultural moments to capitalize on:
- What's trending
- How it can support Gannon's evergreen brand without naming or implying any song, release date, release status, lyric, streaming link, presave, launch, or countdown
- Window of opportunity (how long this trend lasts)

## 🎪 TOMORROW'S BIG IDEA
One bold creative campaign concept for the next 30 days

Make everything specific, bold, and designed to generate income and fan growth. Keep all outputs as internal suggestions requiring review; never present unverified release information as fact.`,
      add_context_from_internet: true,
      model: 'gemini_3_flash',
    });

    const today = new Date().toLocaleDateString('en-AU');

    // Save trend report to Knowledge Vault
    await base44.asServiceRole.entities.KnowledgeVault.create({
      title: `Daily Trend Report — ${today}`,
      category: 'creative',
      content: trendReport || 'Trend report unavailable',
      summary: `Auto-generated daily hooks, viral ideas, and money opportunities for ${today}`,
      tags: ['trends', 'hooks', 'viral', 'daily-report', 'autonomous'],
      source: 'Autonomous Trend Engine',
      is_sensitive: false,
      access_level: 'admin_only',
      linked_agent: 'TrendEngine',
    });

    // Also save as an ApprovalQueue item so Gannon sees the money opportunity
    const lines = (trendReport || '').split('\n');
    const moneySection = lines.find(l => l.includes('MONEY') || l.includes('revenue') || l.includes('earning'));

    await base44.asServiceRole.entities.ApprovalQueue.create({
      agent_name: 'TrendEngine',
      action_title: `💰 Daily Money Opportunity — ${today}`,
      action_description: 'The Trend Engine has identified a revenue opportunity for today. Review and decide whether to action it.',
      proposed_output: trendReport?.substring(0, 500) || 'See Knowledge Vault for full report',
      risk_type: ['publishing'],
      risk_level: 'medium',
      status: 'pending',
      auto_eligible: false,
      tags: ['daily', 'trends', 'opportunity'],
    });

    await base44.asServiceRole.entities.AgentTaskLog.create({
      agent_name: 'TrendEngine',
      task_title: `Daily trend report generated — ${today}`,
      outcome: 'Saved to Knowledge Vault, opportunity added to Approval Queue',
      was_automatic: true,
      required_approval: false,
      risk_check_result: 'pass',
      tags: ['trends', 'daily', 'autonomous'],
      source_used: 'Internet + LLM',
    });

    return Response.json({ success: true, date: today });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});