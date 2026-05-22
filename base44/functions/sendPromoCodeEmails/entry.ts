import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ADMIN_EMAIL = 'ganozwaye@gmail.com';
    const STORE_URL = 'https://gannonwaye.com/store';

    const promoCodes = [
      {
        code: 'THANKYOU15',
        discount: '15% OFF',
        description: 'Launch promo — 15% off merch (apparel, accessories, bundles). Excludes CDs & shipping.',
        audience: 'Customers / Launch Attendees',
        subject: '🎉 Your 15% Off Promo Code — Gannon Waye Store',
        body: `Hi Gannon,

Here is your promo code to share with customers and launch attendees:

━━━━━━━━━━━━━━━━━━━━━━━━━
PROMO CODE:  THANKYOU15
DISCOUNT:    15% OFF
━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Valid on: Apparel, accessories, bundles
❌ Excludes: CDs, vinyl, shipping
🛍️ Store: ${STORE_URL}

COPY THIS TO SEND TO CUSTOMERS:
─────────────────────────────────
Hey! Use code THANKYOU15 at checkout on the Gannon Waye store for 15% off merch. Shop here: ${STORE_URL} 🤍
─────────────────────────────────

Thanks,
Your GanozMix AI System`
      },
      {
        code: 'FAMILYFRIENDS30',
        discount: '30% OFF',
        description: 'Family & friends — 30% off merch (apparel, accessories, bundles). Excludes CDs & shipping.',
        audience: 'Family & Friends',
        subject: '🤍 Your 30% Off Family & Friends Code — Gannon Waye Store',
        body: `Hi Gannon,

Here is your family & friends promo code:

━━━━━━━━━━━━━━━━━━━━━━━━━
PROMO CODE:  FAMILYFRIENDS30
DISCOUNT:    30% OFF
━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Valid on: Apparel, accessories, bundles
❌ Excludes: CDs, vinyl, shipping
🛍️ Store: ${STORE_URL}

COPY THIS TO SEND TO FAMILY & FRIENDS:
─────────────────────────────────
Hey! As family/friends of Gannon Waye, here's 30% off the official merch store. Use code FAMILYFRIENDS30 at checkout. Shop: ${STORE_URL} 🤍
─────────────────────────────────

Thanks,
Your GanozMix AI System`
      },
      {
        code: 'GIFTAPPROVED25',
        discount: '25% OFF',
        description: 'Gift-approved — 25% off, one use per approved email. Requires manual approval.',
        audience: 'Gift Recipients (Admin Approved)',
        subject: '🎁 Your 25% Off Gift Code — Gannon Waye Store',
        body: `Hi Gannon,

Here is your gift-approved promo code:

━━━━━━━━━━━━━━━━━━━━━━━━━
PROMO CODE:  GIFTAPPROVED25
DISCOUNT:    25% OFF
━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Valid on: Apparel, accessories, bundles
❌ Excludes: CDs, vinyl, shipping
⚠️  One use per approved email — requires admin approval
🛍️ Store: ${STORE_URL}

COPY THIS TO SEND TO GIFT RECIPIENTS:
─────────────────────────────────
Hi! You've been gifted a 25% discount at the Gannon Waye official store. Use code GIFTAPPROVED25 at checkout. Shop: ${STORE_URL} 🎁
─────────────────────────────────

Thanks,
Your GanozMix AI System`
      }
    ];

    const results = [];
    for (const promo of promoCodes) {
      const res = await base44.integrations.Core.SendEmail({
        to: ADMIN_EMAIL,
        from_name: 'GanozMix AI System',
        subject: promo.subject,
        body: promo.body
      });
      results.push({ code: promo.code, sent: true });
    }

    return Response.json({ success: true, emails_sent: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});