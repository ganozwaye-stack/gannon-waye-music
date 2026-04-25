import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const subscriber = payload?.data;
    if (!subscriber?.email) {
      return Response.json({ error: 'No email found' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: subscriber.email,
      subject: "Welcome to the Gannon Waye community 🎵",
      body: `Hi ${subscriber.name || 'there'},

Thank you so much for joining — it genuinely means the world to me.

This is more than a music page. It's a community built for people who've felt unseen, unheard, or like they don't quite fit. You belong here.

My debut single "Thank You" is coming soon — you'll be the first to know when it drops.

Until then, stay connected:
🎵 Music: https://gannonwaye.com/music
💬 Community: https://gannonwaye.com/community

With love,
Gannon Waye`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});