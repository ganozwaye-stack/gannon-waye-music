import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const GANNON_SIGNATURE = `
With gratitude & respect,
Gannon Waye

P.S. Your support means the world. You're part of something real. 🤍
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { email, name, gift } = await req.json();

    if (!email || !name || !gift) {
      return Response.json(
        { error: 'Missing required fields: email, name, gift' },
        { status: 400 }
      );
    }

    // Send personalized gift email
    await base44.integrations.Core.SendEmail({
      to: email,
      subject: `Your Early Supporter Gift from Gannon 🎁`,
      body: `
Hi ${name},

Thank you for being here from the start. For getting in early, believing in this project, and following me on TikTok and Instagram — I wanted to send you something special.

Your gift: ${gift}

You made this moment possible. Not through money, but through genuine support and belief. That's what separates the real ones from the rest.

I'm building this with you. Every chapter, every release, every moment forward — it matters because you're here.

${GANNON_SIGNATURE}

---
gannonwaye.com
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});