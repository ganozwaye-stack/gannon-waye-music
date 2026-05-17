import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Agent Self-Improvement Loop
// Reviews recent agent outputs, scores them, and saves learning records

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get recent agent task logs (last 24h)
    const recentLogs = await base44.asServiceRole.entities.AgentTaskLog.list('-created_date', 50);
    const last24h = recentLogs.filter(l =>
      l.created_date && (Date.now() - new Date(l.created_date).getTime()) < 24 * 60 * 60 * 1000
    );

    if (last24h.length === 0) {
      return Response.json({ success: true, message: 'No recent logs to analyze' });
    }

    // Get recent approved vs rejected from ApprovalQueue
    const approved = await base44.asServiceRole.entities.ApprovalQueue.filter({ status: 'approved' }, '-created_date', 20);
    const rejected = await base44.asServiceRole.entities.ApprovalQueue.filter({ status: 'rejected' }, '-created_date', 20);

    // Get recent knowledge vault entries to assess quality
    const recentVault = await base44.asServiceRole.entities.KnowledgeVault.list('-created_date', 20);

    // Self-improvement analysis
    const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are an AI performance analyst reviewing autonomous agent activity to extract improvement lessons.

Recent Agent Actions (last 24h): ${last24h.length} total
Action types: ${[...new Set(last24h.map(l => l.agent_name))].join(', ')}

Approved proposals: ${approved.length}
Rejected proposals: ${rejected.length}

Recent knowledge vault topics: ${recentVault.slice(0, 5).map(v => v.title).join(', ')}

Analyze this activity and identify:
1. WHAT'S WORKING: Most valuable agent behaviors to reinforce
2. WHAT'S FAILING: Patterns that produce low-value or redundant outputs
3. PROMPT IMPROVEMENTS: Specific ways to improve agent prompts for better results
4. WORKFLOW IMPROVEMENTS: Better sequencing or collaboration between agents
5. BLIND SPOTS: Topics or domains being under-researched
6. CONFIDENCE CALIBRATION: Are agents appropriately uncertain about risky actions?

Return actionable, specific improvement notes. Not generic advice.`,
      model: 'gemini_3_flash',
    });

    // Save improvement learnings
    const agentGroups = [...new Set(last24h.map(l => l.agent_name))];
    const savedLearnings = [];

    for (const agentName of agentGroups.slice(0, 3)) {
      const agentLogs = last24h.filter(l => l.agent_name === agentName);
      const passRate = agentLogs.filter(l => l.risk_check_result === 'pass').length / agentLogs.length;

      const learning = await base44.asServiceRole.entities.AgentLearningRecord.create({
        agent_name: agentName,
        lesson_type: 'workflow_improvement',
        what_worked: `Processed ${agentLogs.length} tasks with ${Math.round(passRate * 100)}% pass rate`,
        improvement: analysis?.substring(0, 500) || 'See full analysis in knowledge vault',
        source: 'AgentSelfImprovementLoop',
        confidence_score: Math.min(10, Math.round(passRate * 10)),
        impact_score: Math.min(10, agentLogs.length),
        tags: ['self-improvement', 'autonomous', 'learning'],
      });
      savedLearnings.push(agentName);
    }

    // Save full analysis to vault
    await base44.asServiceRole.entities.KnowledgeVault.create({
      title: `Agent Self-Improvement Report — ${new Date().toLocaleDateString('en-AU')}`,
      category: 'research',
      content: analysis || '',
      summary: `24h performance review: ${last24h.length} actions, ${approved.length} approved, ${rejected.length} rejected`,
      tags: ['self-improvement', 'agent-review', 'autonomous'],
      source: 'AgentSelfImprovementLoop',
      access_level: 'admin_only',
    });

    await base44.asServiceRole.entities.AgentTaskLog.create({
      agent_name: 'AgentSelfImprovementLoop',
      task_title: 'Self-improvement analysis complete',
      outcome: `Reviewed ${last24h.length} actions. Saved ${savedLearnings.length} learning records.`,
      was_automatic: true,
      required_approval: false,
      risk_check_result: 'pass',
      tags: ['self-improvement', 'autonomous'],
    });

    return Response.json({
      success: true,
      analyzed: last24h.length,
      learningsSaved: savedLearnings.length,
      agents: savedLearnings,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});