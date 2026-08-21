import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailBody = `Hi there,

Thank you for signing up. You've shown me who you are, and that means everything.

As a token of my appreciation, I'm offering something special after a manual review.

**How to claim your gift:**

1. Follow me on TikTok @gann0nwaye and Instagram @gann0nwaye
2. Like, comment, and share my latest post
3. Reply to this email or DM me on either platform with a screenshot
4. I'll personally send your gift 🤍

This is my way of saying thank you for believing in this from the beginning. You're not just a supporter — you're part of the story.

See you on the other side,
Gannon

---
P.S. Music approved for public sharing is always listed on the Music page.`;

    await base44.integrations.Core.SendEmail({
      to: email,
      subject: 'Your gift from Gannon Waye 🎁',
      body: emailBody,
      from_name: 'Gannon Waye',
    });

    return Response.json({ success: true, sent_to: email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});