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

Thank you for getting in early. If you'd like to be considered for a thank-you gift from me:

1. Subscribe on www.gannonwaye.com (done ✓)
2. Follow Gannon on Instagram: @ganozwaye
3. Follow Gannon on TikTok: @ganozwaye
4. Choose the "Sing Along Here" video
5. Like it
6. Comment something you love about the song and tag Gannon
7. Share the post publicly
8. Once you've done that, reply to this email or upload proof so Gannon can review and approve the thank-you gift

Instagram and TikTok actions cannot be automatically verified reliably without approved platform APIs, so proof is reviewed manually. The gift is subject to approval and not guaranteed until reviewed.

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