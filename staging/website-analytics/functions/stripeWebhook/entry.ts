/**
 * Primary Stripe webhook for paid merchandise orders.
 *
 * Core guarantees:
 * 1. Live events require a valid Stripe signature.
 * 2. A checkout session can create only one active order.
 * 3. The paid order and canonical Stripe event are stored before a 2xx response.
 * 4. GST is recorded as zero while the business is not GST registered.
 * 5. Inventory and customer communication are delegated to an idempotent order processor.
 *
 * The order-creation pipeline itself lives in shared/checkoutOrderCapture.js
 * so the checkout success page (verifyCheckoutSession) captures through the
 * exact same guarantee set when webhook delivery fails.
 */

import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';
import {
  captureOrderFromSession,
  createDiagnostic,
} from './checkoutOrderCapture.js';

Deno.serve(async (req) => {
  if (Deno.env.get('VERIFIED_ORDER_CAPTURE_OPEN') !== 'true') return Response.json({ error: 'Verified capture draft is closed.', external_actions_performed: false }, { status: 503 });
  const base44 = createClientFromRequest(req);
  const secretKey = String(Deno.env.get('STRIPE_SECRET_KEY') || '').trim();
  const webhookSecret = String(Deno.env.get('STRIPE_WEBHOOK_SECRET') || '').trim();
  const isLiveMode = secretKey.startsWith('sk_live_');

  if (!secretKey.startsWith('sk_')) {
    return Response.json({ error: 'Stripe is not configured.' }, { status: 500 });
  }

  let rawBody;
  try {
    rawBody = await req.text();
  } catch {
    return Response.json({ error: 'Unable to read webhook body.' }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const signature = req.headers.get('stripe-signature');
  let event;

  try {
    if (isLiveMode) {
      if (!webhookSecret) {
        return Response.json({ error: 'Live webhook signing secret is not configured.' }, { status: 500 });
      }
      if (!signature) {
        return Response.json({ error: 'Missing Stripe signature.' }, { status: 400 });
      }
      event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
    } else if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
    } else {
      event = JSON.parse(rawBody);
    }
  } catch (error) {
    await createDiagnostic(base44, `stripeWebhook signature or payload verification failed: ${String(error instanceof Error ? error.message : error).slice(0, 240)}`, {
      diagnostic_type: 'webhook_signature_failure',
      severity: 'critical',
      admin_message: 'The webhook was rejected before any order or payment record was created.',
      recommended_fix: 'Verify the Stripe endpoint signing secret and endpoint URL. Do not rotate credentials without owner approval.',
      source_chain: 'Stripe -> stripeWebhook -> verification failed',
    });
    return Response.json({ error: 'Webhook verification failed.' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return Response.json({
      received: true,
      stripe_event_id: event.id,
      event_type: event.type,
      order_action: 'not_applicable',
    });
  }

  const session = event.data?.object;
  if (!session?.id) {
    return Response.json({ error: 'Checkout session is missing.' }, { status: 400 });
  }

  if (session.payment_status !== 'paid') {
    await createDiagnostic(base44, `Checkout session ${session.id} completed without paid status`, {
      diagnostic_type: 'webhook_failure',
      severity: 'high',
      checkout_session_id: session.id,
      stripe_event_id: event.id,
      admin_message: 'No paid order was created because Stripe did not mark the checkout as paid.',
      recommended_fix: 'Review the checkout session in Stripe before taking any fulfilment action.',
      source_chain: 'Stripe -> stripeWebhook -> checkout not paid',
    });
    return Response.json({ received: true, processed: false, reason: 'checkout_not_paid' });
  }

  const metadata = session.metadata || {};
  const belongsToThisStore = (
    session.mode === 'payment' &&
    String(session.currency || '').toLowerCase() === 'aud' &&
    metadata.checkout_policy === 'stage_one_owned_stock_v1' &&
    metadata.abn === '22931809349' &&
    Number(session.amount_total || 0) > 0
  );

  if (!belongsToThisStore) {
    return Response.json({
      received: true,
      processed: false,
      reason: 'checkout_not_owned_by_this_store',
    });
  }

  const capture = await captureOrderFromSession({
    base44,
    session,
    event,
    orderSource: 'stripe_webhook',
    processorSource: 'stripeWebhook',
    sourceChainPrefix: 'Stripe -> stripeWebhook',
    process: true,
    persistDuplicateEvent: true,
  });

  if (capture.outcome === 'incomplete_metadata') {
    return Response.json({ error: 'Paid checkout has incomplete order metadata.' }, { status: 500 });
  }

  if (capture.outcome === 'duplicate') {
    return Response.json({
      received: true,
      duplicate: true,
      order_id: capture.order.id,
      post_processing: capture.postProcessing?.success ? 'complete_or_queued' : 'needs_attention',
    });
  }

  if (capture.outcome === 'create_failed') {
    return Response.json({ error: 'Paid order creation failed.' }, { status: 500 });
  }

  if (capture.outcome === 'persistence_failed') {
    return Response.json({
      error: capture.stage === 'duplicate_persist'
        ? `Duplicate event persistence failed: ${capture.error}`
        : 'Canonical event persistence failed.',
    }, { status: 500 });
  }

  if (capture.outcome === 'created') {
    return Response.json({
      received: true,
      order_id: capture.order.id,
      stripe_event_id: event.id,
      post_processing: capture.postProcessing?.success ? 'complete_or_queued' : 'needs_attention',
    });
  }

  return Response.json({ error: 'Capture did not complete.' }, { status: 500 });
});