import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';
import {
  captureOrderFromSession,
  requestOrderProcessing,
} from './checkoutOrderCapture.js';

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
  if (Deno.env.get('VERIFIED_ORDER_CAPTURE_OPEN') !== 'true') return Response.json({ error: 'Verified capture draft is closed.', external_actions_performed: false }, { status: 503 });
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

    // Guaranteed capture: the session was just retrieved live from Stripe and
    // confirmed paid by Stripe itself, which is stronger proof than a webhook
    // signature. If the webhook has not created the order yet, create it here
    // through the same shared pipeline, so every completed checkout is
    // captured even when webhook delivery fails. Stripe always redirects the
    // paying customer back to this success page after payment.
    const syntheticEvent = {
      id: `success_page_${session.id}_${Date.now()}`,
      type: 'checkout.session.completed',
    };
    const capture = await captureOrderFromSession({
      base44,
      session,
      event: syntheticEvent,
      orderSource: 'checkout_success_page',
      processorSource: 'verifyCheckoutSession',
      sourceChainPrefix: 'Stripe -> checkout-success -> verifyCheckoutSession',
      process: false,
      persistDuplicateEvent: false,
    });

    const orderRecorded = capture.outcome === 'created' || capture.outcome === 'duplicate';

    if (capture.outcome === 'created') {
      // The paid order and canonical records are already stored. Finish stock,
      // receipt and notification work in the background so this response
      // returns fast; requestOrderProcessing records a critical diagnostic on
      // failure so nothing is lost silently.
      requestOrderProcessing(base44, capture.order.id, syntheticEvent.id, 'verifyCheckoutSession');
    }
    // Capture failures (incomplete metadata, create failed, persistence
    // failed) already recorded a critical PaymentDiagnostic through the shared
    // pipeline, so the owner sees them on the payment diagnostics screen.

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