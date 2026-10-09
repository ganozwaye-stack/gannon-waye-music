// STAGED BACKEND CANDIDATE: move into a Base44 function only after private-file
// authorization is verified. This file is not an active endpoint.
import Stripe from 'npm:stripe@14.21.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.30';
import {
  JournalAccessError, journalCheckoutParams, fulfilJournalDownload,
  validateJournalCatalogue, requireJournalBuyer
} from '../../base44/shared/journalCommerce.js';
import { journalAccountState, startJournalCheckout, confirmJournalReturn, cancelJournalCheckout } from '../../base44/shared/journalCheckoutRecovery.js';
const sha256 = async bytes => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), n => n.toString(16).padStart(2, '0')).join('');
function persistence(base44) {
 if (Deno.env.get('JOURNAL_PERSISTENCE_READY') !== 'true') throw new JournalAccessError('journals_not_ready',503);
 const entities=base44.asServiceRole.entities;
 const save=(entity,row)=>{if(typeof entity?.upsert!=='function')throw new JournalAccessError('purchase_recovery_unavailable',503);return entity.upsert([row],{key:['buyer_user_id','stripe_session_id']});};
 return {listPurchases:id=>entities.JournalPurchase.filter({buyer_user_id:id},'-created_date',101),
   listAttempts:id=>entities.JournalCheckoutAttempt.filter({buyer_user_id:id},'-created_date',101),
   savePurchase:row=>save(entities.JournalPurchase,row),saveAttempt:row=>save(entities.JournalCheckoutAttempt,row)};
}


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
  const snapshots=JSON.parse(Deno.env.get('JOURNAL_PRIVATE_CATALOGUE_VERSIONS')||'{}');
  snapshots[catalogue.approvedVersion]=catalogue;
  const resolveCatalogue=async version=>{const snapshot=snapshots[version];validateJournalCatalogue(snapshot);return snapshot;};
  const stripe=new Stripe(key);
  // Complete paginated account listing is filtered only on the server. An incomplete
  // scan fails closed; no other customer's records are returned to clients.
  stripe.findJournalSessions=async ({buyerId})=>{
    const results=[];let after;
    for(let page=0;page<100;page++){
      const batch=await stripe.checkout.sessions.list({limit:100,...(after?{starting_after:after}:{})});
      if(!Array.isArray(batch.data))throw new JournalAccessError('purchase_recovery_unavailable',503);
      for(const session of batch.data)if(session.metadata?.buyer_user_id===buyerId&&
        session.metadata?.checkout_policy==='gw_paid_journals_v1'&&session.metadata?.app_id==='69eb7905ca6eb4180010f794')results.push(session);
      if(!batch.has_more)return results;
      after=batch.data.at(-1)?.id;if(!after)break;
    }
    throw new JournalAccessError('purchase_recovery_unavailable',503);
  };
  return { catalogue, stripe, resolveCatalogue, liveMode:key.startsWith('sk_live_') };
}
export async function handleJournalRequest(req, action) {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  try {
    const base44 = createClientFromRequest(req);
    let user;
    try { user = await base44.auth.me(); } catch { throw new JournalAccessError('sign_in_required', 401); }
    requireJournalBuyer(user);
    const body = await req.json().catch(() => ({}));
    const { catalogue, stripe, resolveCatalogue, liveMode } = configuration();
    const store=persistence(base44);
    if(action==='purchases'){
      const state=await journalAccountState({user,store,stripe,resolveCatalogue,liveMode});
      return json({purchases:state.purchases,ownedBookIds:state.ownedBookIds,pending:state.pending});
    }
    if(action==='confirm')return json(await confirmJournalReturn({user,sessionId:body.session_id,store,stripe,resolveCatalogue,liveMode}));
    if(action==='expire')return json(await cancelJournalCheckout({user,sessionId:body.session_id,store,stripe,resolveCatalogue,liveMode}));
    if(action==='checkout'){
      const selectedIds=Array.isArray(body.offer_id)?body.offer_id:[body.offer_id];
      const result=await startJournalCheckout({user,catalogue,selectedIds,bundleRequested:body.bundle_requested===true,
        expectedTotalCents:body.expected_total_cents,store,stripe,resolveCatalogue,liveMode,sha256});
      return json(result);
    }
    if (action !== 'download') return json({ error: 'not_found' }, 404);
    const sourceSession=await stripe.checkout.sessions.retrieve(body.session_id);
    const downloadCatalogue=await resolveCatalogue(sourceSession?.metadata?.catalogue_version);
    const download = await fulfilJournalDownload({
      catalogue:downloadCatalogue, user, sessionId: body.session_id, bookId: body.book_id, liveMode,
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