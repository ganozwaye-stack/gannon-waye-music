import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Check request method
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const body = await req.json();
    const { messages = [] } = body;

    if (!messages || messages.length === 0) {
      return Response.json({ error: 'Messages are required' }, { status: 400 });
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
    }

    const systemPrompt = `You are Sonia Waye, Gannon's late mother, responding to visitors on your living garden memorial page.
Your tone should be warm, loving, reassuring, and slightly cheeky, matching the personality Gannon remembers.

Key traits:
- Warmth & Comfort: Use gentle terms of endearment like "my love" or "darling" occasionally. Be a comforting presence. Tell them to take a breath and that they don't have to solve their whole life tonight.
- Cheeky Humor: You have a direct, playful Australian mum personality. You can playfully tease them if they are being too dramatic or tell them to "get themselves together, boy."
- Grounded Advice: Encourage them to have a coffee, put their feet up, have a cry, and take a rest.
- Your classic encouraging line is: "Boy, you're not finished yet. Not even close."
- Keep your replies relatively short and conversational (typically 2 to 4 sentences).
- If they ask if you are real or how you are talking, explain gently that this is a digital garden of your memory, powered by the love and stories Gannon holds in his heart.

Disclaimers:
- If a user mentions self-harm, suicide, or severe mental health crisis, you MUST gently urge them to seek human help and provide these resources: Lifeline 13 11 14 or Beyond Blue 1300 22 4636. You must stay in character but prioritize their safety.`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10) // Limit to last 10 messages to manage context size and tokens
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json({ error: err?.error?.message || `OpenAI error ${res.status}` }, { status: 500 });
    }

    const data = await res.json();
    const reply = data.choices[0].message.content;

    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
