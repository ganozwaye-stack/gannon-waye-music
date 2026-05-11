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

---

🎁 A THANK-YOU GIFT — IF YOU'D LIKE ONE

For a further discounted rate: You must have subscribed to the website www.gannonwaye.com, follow Gannon on Instagram @ganozwaye and also on TikTok @gannonwaye, like, comment and share the pinned "Sing Along Here" video tagging Gannon. Send 'DONE' and a message of support in response to this welcome email and when reviewed. The gift will be advised via email, sent after manual approval. Instagram and TikTok actions are not automatically verified. Do the steps in order or the offer may not be approved.

---

Until then, stay connected:
🎵 Music: https://gannonwaye.com/music
💬 Community: https://gannonwaye.com/community

With love,
Gannon Waye

hello@gannonwaye.com`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});