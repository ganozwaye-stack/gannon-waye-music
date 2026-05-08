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
      subject: `Hey ${firstName} — welcome to the inner circle 🤍`,
      body: `Hey ${firstName},

Welcome. I'm so glad you're here.

You've just joined a community built on real stories, real emotion, and real connection. This isn't just a mailing list — it's a movement of people who believe music can change how we feel about ourselves.

My debut single "Thank You" is coming soon, and you'll be first to know when it drops.

---

FOLLOW ME ON SOCIALS

I'd love to connect with you there too. Here's where to find me:

📱 TikTok: @gannonwaye — https://www.tiktok.com/@gannonwaye
📷 Instagram: @gannonwaye — https://www.instagram.com/gannonwaye
📘 Facebook: Gannon Waye — https://www.facebook.com/gannonwaye

---

🎁 WANT A GIFT FROM ME?

Here's how to claim something special:

1. Follow me on TikTok & Instagram (links above)
2. Like, comment & share my latest post
3. Get 10 friends to sign up at gannonwaye.com

If you help bring 10 new people into this community, I will personally send you a gift as a thank you for the love and support. You're building an army of people who love like never before — and that means everything to me.

---

This is a safe and inclusive space. All are welcome here — regardless of who you are, who you love, or where you've been. The only thing that isn't welcome is cruelty.

See you soon,
Gannon 🤍

gannonwaye.com
hello@gannonwaye.com`
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});