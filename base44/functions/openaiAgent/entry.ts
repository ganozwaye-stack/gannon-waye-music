import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import OpenAI from 'npm:openai@4.83.0';

// AI Agent Layer with OpenAI tool calling
// Safe permissions: read approved data, analyze, draft content, create Approval Queue items
// Blocked: publish public content, send external emails, change prices, spend money, submit reviews

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const { action, task, context } = body;

    // Admin-only access
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: '403 Forbidden — Admin access required' }, { status: 403 });
    }

    const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_KEY) {
      return Response.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: OPENAI_KEY });

    // ── TOOL DEFINITIONS ─────────────────────────────────────────────────────
    const tools = [
      {
        type: 'function',
        function: {
          name: 'read_entity_data',
          description: 'Read approved entity data (orders, products, fans, releases). Cannot access secrets or tokens.',
          parameters: {
            type: 'object',
            properties: {
              entity_name: { type: 'string', description: 'Entity to read from' },
              limit: { type: 'number', default: 50, description: 'Max records to fetch' },
              filter: { type: 'object', description: 'Optional filter criteria' }
            },
            required: ['entity_name']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'create_approval_item',
          description: 'Create an item in the Approval Queue for admin review. Cannot auto-publish.',
          parameters: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              item_type: { type: 'string' },
              content: { type: 'string' },
              urgency: { type: 'string', enum: ['low', 'medium', 'high'] }
            },
            required: ['title', 'item_type', 'content']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'analyze_data',
          description: 'Analyze provided data and return insights, summaries, or recommendations.',
          parameters: {
            type: 'object',
            properties: {
              data_type: { type: 'string', description: 'Type of data being analyzed' },
              data: { type: 'array', description: 'Data to analyze' },
              goal: { type: 'string', description: 'What insight or recommendation is needed' }
            },
            required: ['data_type', 'data', 'goal']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'draft_content',
          description: 'Draft content (emails, social posts, product descriptions) for admin review. Cannot publish.',
          parameters: {
            type: 'object',
            properties: {
              content_type: { type: 'string', enum: ['email', 'social_post', 'product_description', 'blog_post', 'ad_copy'] },
              topic: { type: 'string' },
              tone: { type: 'string', description: 'Desired tone (e.g. friendly, professional, urgent)' },
              length: { type: 'string', enum: ['short', 'medium', 'long'] }
            },
            required: ['content_type', 'topic']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'generate_report',
          description: 'Generate a structured report from entity data.',
          parameters: {
            type: 'object',
            properties: {
              report_type: { type: 'string', description: 'Type of report (e.g. sales, engagement, inventory)' },
              date_range: { type: 'object', description: 'Start and end dates' },
              include_charts: { type: 'boolean', default: false }
            },
            required: ['report_type']
          }
        }
      }
    ];

    // ── TOOL EXECUTION HANDLER ──────────────────────────────────────────────
    async function executeTool(name, args) {
      console.log('[openaiAgent] Tool call:', name, args);

      switch (name) {
        case 'read_entity_data': {
          const { entity_name, limit = 50, filter = {} } = args;
          // Block sensitive entities
          const blocked = ['KnowledgeVault', 'User', 'AdminNotification'];
          if (blocked.includes(entity_name)) {
            return { error: 'Access denied to sensitive entity' };
          }
          const records = await base44.asServiceRole.entities[entity_name]?.filter(filter, '-created_date', limit) || [];
          return { count: records.length, data: records };
        }

        case 'create_approval_item': {
          const { title, item_type, content, urgency = 'medium' } = args;
          const item = await base44.asServiceRole.entities.ApprovalQueue.create({
            title,
            item_type,
            content,
            urgency,
            status: 'pending_review',
            source: 'openai_agent'
          });
          return { success: true, approval_item_id: item.id };
        }

        case 'analyze_data': {
          // Just pass through to LLM for analysis
          return { analysis: 'Analysis completed by LLM' };
        }

        case 'draft_content': {
          return { draft: 'Content draft generated by LLM' };
        }

        case 'generate_report': {
          return { report: 'Report generated by LLM' };
        }

        default:
          return { error: `Unknown tool: ${name}` };
      }
    }

    // ── ACTION: CHAT WITH TOOLS ─────────────────────────────────────────────
    if (action === 'chat') {
      const messages = [
        {
          role: 'system',
          content: `You are an AI assistant for the Gannon Waye Music business.
          
SAFE ACTIONS (can do automatically):
- Read approved data (orders, products, releases, fans, merch)
- Analyze trends, summarize data, identify opportunities
- Draft content (emails, social posts, product descriptions)
- Create Approval Queue items for admin review
- Generate reports and recommendations

BLOCKED ACTIONS (must NEVER do automatically):
- Publish public content (posts, emails, releases)
- Send external emails
- Change prices or discounts
- Spend money or make purchases
- Submit app reviews (TikTok, Meta, etc.)
- Launch coaching services publicly
- Access secrets, tokens, or API keys

Always explain what you're doing and ask for confirmation before creating approval items.`
        },
        ...context || [],
        { role: 'user', content: task }
      ];

      // Initial LLM call
      let response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        tools,
        tool_choice: 'auto'
      });

      const assistantMessage = response.choices[0].message;
      messages.push(assistantMessage);

      // Execute tool calls if any
      if (assistantMessage.tool_calls) {
        for (const toolCall of assistantMessage.tool_calls) {
          const args = JSON.parse(toolCall.function.arguments);
          const result = await executeTool(toolCall.function.name, args);

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          });
        }

        // Final LLM call with tool results
        response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          tools
        });
      }

      return Response.json({
        response: response.choices[0].message.content,
        tool_calls: assistantMessage.tool_calls || []
      });
    }

    // ── ACTION: ANALYZE ENTITY ──────────────────────────────────────────────
    if (action === 'analyze_entity') {
      const { entity_name, limit = 100, goal } = body;
      const records = await base44.asServiceRole.entities[entity_name]?.filter({}, '-created_date', limit) || [];

      const messages = [
        {
          role: 'system',
          content: 'Analyze this business data and provide actionable insights. Focus on trends, opportunities, and recommendations.'
        },
        {
          role: 'user',
          content: `Goal: ${goal}\n\nData: ${JSON.stringify(records, null, 2)}`
        }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages
      });

      return Response.json({
        analysis: response.choices[0].message.content,
        record_count: records.length
      });
    }

    // ── ACTION: DRAFT CONTENT ───────────────────────────────────────────────
    if (action === 'draft') {
      const { content_type, topic, tone, length } = body;

      const messages = [
        {
          role: 'system',
          content: `You are a professional copywriter for a music artist business.
Draft ${content_type} content with a ${tone || 'friendly'} tone.
Length: ${length || 'medium'}.
Include clear calls-to-action where appropriate.`
        },
        {
          role: 'user',
          content: `Topic: ${topic}\n\nDraft the content now.`
        }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages
      });

      return Response.json({
        draft: response.choices[0].message.content,
        content_type,
        topic
      });
    }

    // ── ACTION: GENERATE REPORT ─────────────────────────────────────────────
    if (action === 'report') {
      const { report_type, date_range } = body;

      // Fetch relevant data based on report type
      let data = {};
      if (report_type.includes('sales') || report_type.includes('revenue')) {
        data.orders = await base44.asServiceRole.entities.MerchOrder.filter({}, '-created_date', 200);
      }
      if (report_type.includes('fan') || report_type.includes('engagement')) {
        data.fans = await base44.asServiceRole.entities.FanPost.filter({}, '-created_date', 100);
        data.comments = await base44.asServiceRole.entities.FanComment.filter({}, '-created_date', 100);
      }
      if (report_type.includes('product') || report_type.includes('inventory')) {
        data.products = await base44.asServiceRole.entities.MerchProduct.filter({}, '-name', 50);
      }

      const messages = [
        {
          role: 'system',
          content: 'Generate a structured business report from the provided data. Use clear sections, key metrics, and actionable recommendations.'
        },
        {
          role: 'user',
          content: `Report Type: ${report_type}\n\nData: ${JSON.stringify(data, null, 2)}`
        }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages
      });

      return Response.json({
        report: response.choices[0].message.content,
        data_summary: Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: data[key].length }), {})
      });
    }

    return Response.json({ error: 'Unknown action. Use: chat, analyze_entity, draft, or report' }, { status: 400 });

  } catch (error) {
    console.error('[openaiAgent] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});