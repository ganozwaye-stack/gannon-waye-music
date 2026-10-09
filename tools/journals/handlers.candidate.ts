// STAGED BACKEND CANDIDATE: move into a Base44 function only after private-file
// authorization is verified. This file is not an active endpoint.
import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';
import {
  JournalAccessError, journalCheckoutParams, fulfilJournalDownload,
  validateJournalCatalogue, requireJournalBuyer
} from '../../base44/shared/journalCommerce.js';

const json = (body, status = 200) => Response.json(body, {
  status, headers: { 'Cache-Control': 'private, no-store', Pragma: 'no-cache' }
});
function configuration() {
  // The default is held, even if someone accidentally deploys this candidate.
  if (Deno.env.get('JOURNAL_COMMERCE_ENABLED') !== 'true') throw new JournalAccessError('journals_not_ready', 503);
  const catalogue = JSON.parse(Deno.env.get('JOURNAL_PRIVATE_CATALOGUE') || '{}');
  validateJournalCatalogue(catalogue);
  const key = Deno.env.get('STRIPE_SECRET_KEY') || '';
  if (!key.startsWith('sk_live_') && !key.startsWith('sk_test_')) throw new JournalAccessError('journals_not_ready', 503);
  return { catalogue, stripe: new Stripe(key), liveMode: key.startsWith('sk_live_') };
}
export async function handleJournalRequest(req, action) {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  try {
    const base44 = createClientFromRequest(req);
    let user;
    try { user = await base44.auth.me(); } catch { throw new JournalAccessError('sign_in_required', 401); }
    requireJournalBuyer(user);
    const body = await req.json().catch(() => ({}));
    const { catalogue, stripe, liveMode } = configuration();
    if (action === 'checkout') {
      const { params, idempotencyKey } = journalCheckoutParams({
        catalogue, offerId: body.offer_id, user,
        origin: 'https://gannonwaye.com', requestId: body.request_id
      });
      const session = await stripe.checkout.sessions.create(params, { idempotencyKey });
      if (!session.url || !session.url.startsWith('https://checkout.stripe.com/')) {
        return json({ error: 'checkout_unavailable' }, 503);
      }
      return json({ checkout_url: session.url });
    }
    if (action !== 'download') return json({ error: 'not_found' }, 404);
    const download = await fulfilJournalDownload({
      catalogue, user, sessionId: body.session_id, bookId: body.book_id, liveMode,
      retrieveSession: id => stripe.checkout.sessions.retrieve(id),
      retrievePaymentIntent: id => stripe.paymentIntents.retrieve(id, { expand: ['latest_charge'] }),
      readPrivateFile: async fileUri => {
        // URI remains server-only. No user-provided URL or URI can reach this call.
        const link = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
          file_uri: fileUri, expires_in: 60
        });
        const url = new URL(link.signed_url);
        if (url.protocol !== 'https:') throw new JournalAccessError('journal_file_unavailable', 503);
        const response = await fetch(url, { redirect: 'error' });
        if (!response.ok) throw new JournalAccessError('journal_file_unavailable', 503);
        const length = Number(response.headers.get('content-length'));
        if (length > 25 * 1024 * 1024) throw new JournalAccessError('journal_file_unavailable', 503);
        const reader = response.body?.getReader();
        if (!reader) throw new JournalAccessError('journal_file_unavailable', 503);
        const chunks = [];
        let total = 0;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            total += value.byteLength;
            if (total > 25 * 1024 * 1024) throw new JournalAccessError('journal_file_unavailable', 503);
            chunks.push(value);
          }
        } finally { await reader.cancel().catch(() => {}); }
        const bytes = new Uint8Array(total);
        let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
        return bytes;
      },
      sha256: async bytes => {
        const hash = await crypto.subtle.digest('SHA-256', bytes);
        return Array.from(new Uint8Array(hash), n => n.toString(16).padStart(2, '0')).join('');
      }
    });
    return new Response(download.bytes, { headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="' + download.filename + '"',
      'Cache-Control': 'private, no-store', Pragma: 'no-cache',
      'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer'
    } });
  } catch (error) {
    // Do not reveal Stripe payloads, customer details, private URIs, signed links or secrets.
    return json({ error: error instanceof JournalAccessError ? error.code : 'journals_unavailable' },
      error instanceof JournalAccessError ? error.status : 503);
  }
}
