import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { data } = await req.json();

    if (!data?.email) {
      return Response.json({ error: 'No email provided' }, { status: 400 });
    }

    const settings = await base44.entities.SiteSettings.list();
    const artistName = settings[0]?.artist_name || 'Gannon Waye';

    const firstName = data.name ? data.name.split(' ')[0] : 'Friend';

    await base44.integrations.Core.SendEmail({
      to: data.email,
      from_name: 'Gannon Waye',
      subject: `Hey ${firstName} — welcome 🤍`,
      body: `Hey ${firstName},

Welcome. I'm so glad you're here.

My debut single "Thank You" is out now. Thank you for being part of this from the beginning — it means more than I can say.

---

FIND ME ON SOCIALS

📱 TikTok: @ganozwaye — https://www.tiktok.com/@ganozwaye
📷 Instagram: @ganozwaye — https://www.instagram.com/ganozwaye
📘 Facebook: Gannon Waye — https://www.facebook.com/gannonwaye

---

🎁 A THANK-YOU GIFT — IF YOU'D LIKE ONE

For a further discounted rate: You must have subscribed to the website www.gannonwaye.com, follow Gannon on Instagram @ganozwaye and also on TikTok @gannonwaye, like, comment and share the pinned "Sing Along Here" video tagging Gannon. Send 'DONE' and a message of support in response to this welcome email and when reviewed. The gift will be advised via email, sent after manual approval. Instagram and TikTok actions are not automatically verified. Do the steps in order or the offer may not be approved.

---

All are welcome here — regardless of who you are, who you love, or where you've been. The only thing that isn't welcome is cruelty.

With love,
Gannon 🤍

Instagram: @ganozwaye — https://www.instagram.com/ganozwaye
TikTok: @ganozwaye — https://www.tiktok.com/@ganozwaye
gannonwaye.com
hello@gannonwaye.com`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});