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

As a token of my appreciation, I will review gift requests manually for supporters who complete the current steps.

How to be considered:

1. Subscribe at www.gannonwaye.com
2. Follow Gannon on Instagram @ganozwaye and TikTok @gannonwaye
3. Like, comment, share, and tag Gannon on the pinned "Sing Along Here" video
4. Reply DONE with a message of support and your screenshot proof

The gift is advised by email after manual approval. Instagram and TikTok actions are not automatically verified. Do the steps in order or the offer may not be approved.

This is my way of saying thank you for believing in this from the beginning. You're not just a supporter - you're part of the story.

Gannon

---
P.S. THANKYOU is out now. Stream it today.`;

    await base44.integrations.Core.SendEmail({
      to: email,
      subject: 'Your gift review from Gannon Waye',
      body: emailBody,
      from_name: 'Gannon Waye',
    });

    return Response.json({ success: true, sent_to: email });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
