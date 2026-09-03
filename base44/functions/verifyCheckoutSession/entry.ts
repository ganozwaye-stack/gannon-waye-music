import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';

const SESSION_ID_PATTERN = /^cs_(?:test|live)_[A-Za-z0-9]{16,200}$/;

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      Pragma: 'no-cache',
    },
  });
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ verified: false, status: 'method_not_allowed' }, 405);
  }

  const body = await req.json().catch(() => ({}));
  const sessionId = String(body?.session_id || '').trim();

  if (!SESSION_ID_PATTERN.test(sessionId)) {
    return json({ verified: false, status: 'invalid_reference' }, 400);
  }

  const secretKey = String(Deno.env.get('STRIPE_SECRET_KEY') || '').trim();
  if (!secretKey.startsWith('sk_')) {
    return json({ verified: false, status: 'verification_unavailable' }, 503);
  }

  const requestedMode = sessionId.startsWith('cs_live_') ? 'live' : 'test';
  const configuredMode = secretKey.startsWith('sk_live_') ? 'live' : 'test';
  if (requestedMode !== configuredMode) {
    return json({ verified: false, status: 'not_verified' }, 404);
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const belongsToThisStore = (
      session.mode === 'payment' &&
      String(session.currency || '').toLowerCase() === 'aud' &&
      session.metadata?.checkout_policy === 'stage_one_owned_stock_v1' &&
      session.metadata?.abn === '22931809349' &&
      Number(session.amount_total || 0) > 0
    );
    const paid = session.status === 'complete' && session.payment_status === 'paid';

    if (!belongsToThisStore) {
      return json({ verified: false, status: 'not_verified' }, 404);
    }

    if (!paid) {
      return json({
        verified: false,
        payment_status: session.payment_status || 'unpaid',
        order_recorded: false,
        status: 'payment_not_complete',
      });
    }

    const base44 = createClientFromRequest(req);
    let orderRecorded = false;

    try {
      const orders = await base44.asServiceRole.entities.MerchOrder.filter({
        stripe_session_id: session.id,
      });
      orderRecorded = (Array.isArray(orders) ? orders : []).some(order =>
        order.status !== 'duplicate' &&
        order.financial_status !== 'duplicate_void' &&
        (order.payment_status === 'paid' || order.financial_status === 'paid' || order.status === 'confirmed')
      );
    } catch {
      // Stripe remains the payment source of truth. The UI will flag reconciliation if
      // the order record is not yet visible.
    }

    return json({
      verified: true,
      payment_status: 'paid',
      order_recorded: orderRecorded,
      status: orderRecorded ? 'paid_and_recorded' : 'paid_order_pending',
    });
  } catch {
    return json({ verified: false, status: 'not_verified' }, 404);
  }
});
