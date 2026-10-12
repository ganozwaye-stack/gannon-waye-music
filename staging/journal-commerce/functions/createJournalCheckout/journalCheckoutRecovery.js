import { JournalAccessError, requireJournalBuyer, journalOffer, journalCheckoutParams, verifyJournalPayment, JOURNAL_POLICY, JOURNAL_APP_ID, JOURNAL_ABN } from './journalCommerce.js';
import { planJournalPurchase } from './journalPurchaseRecovery.js';
const fail=(code,status=503)=>{throw new JournalAccessError(code,status);};
const validSession=id=>/^cs_(?:test|live)_[A-Za-z0-9]{16,200}$/.test(id||'');
function sessionOffer({session,user,catalogue,liveMode}){
  const buyer=requireJournalBuyer(user),m=session?.metadata||{};
  if(session?.mode!=='payment'||session.livemode!==liveMode||session.currency!=='aud'||
    m.checkout_policy!==JOURNAL_POLICY||m.app_id!==JOURNAL_APP_ID||m.abn!==JOURNAL_ABN||
    m.buyer_user_id!==buyer.id||m.catalogue_version!==catalogue.approvedVersion||
    String(session.customer_details?.email||session.customer_email||'').toLowerCase()!==buyer.email)fail('purchase_not_found',404);
  const offer=journalOffer(catalogue,m.offer_id);
  if(session.amount_total!==offer.priceCents||session.amount_subtotal!==offer.priceCents||
    (session.total_details?.amount_discount||0)!==0||(session.total_details?.amount_tax||0)!==0||
    (session.total_details?.amount_shipping||0)!==0)fail('payment_amount_mismatch',403);
  return offer;
}
function checkoutURL(value){
 const url=new URL(value);
 if(url.protocol!=='https:'||url.hostname!=='checkout.stripe.com'||url.username||url.password)fail('checkout_unavailable');
 return url.href;
}
// Store callbacks are service-role only. References never grant entitlement.
// A failed store/Stripe lookup blocks checkout rather than assuming no previous purchase.
export async function journalAccountState({user,store,stripe,resolveCatalogue,liveMode,now=Date.now()}){
 const buyer=requireJournalBuyer(user);
 const [paid,attempts]=await Promise.all([store.listPurchases(buyer.id),store.listAttempts(buyer.id)]);
 if(!Array.isArray(paid)||!Array.isArray(attempts)||paid.length>100||attempts.length>100)fail('purchase_recovery_unavailable');
 const refs=[...paid,...attempts],seen=new Set(),purchases=[],pending=[];
 for(const ref of refs){
  if(ref.buyer_user_id!==buyer.id)continue;
  if(!validSession(ref.stripe_session_id))fail('purchase_recovery_unavailable');
  if(seen.has(ref.stripe_session_id))continue;seen.add(ref.stripe_session_id);
  const session=await stripe.checkout.sessions.retrieve(ref.stripe_session_id);
  if(session?.id!==ref.stripe_session_id)fail('purchase_recovery_unavailable');
  const catalogue=await resolveCatalogue(session.metadata?.catalogue_version);
  const offer=sessionOffer({session,user,catalogue,liveMode});
  if(session.status==='complete'&&session.payment_status==='paid'){
   const pi=typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent?.id;
   if(!/^pi_[A-Za-z0-9]+$/.test(pi||''))fail('purchase_recovery_unavailable');
   const intent=await stripe.paymentIntents.retrieve(pi,{expand:['latest_charge']});
   try{verifyJournalPayment({catalogue,user,session,paymentIntent:intent,liveMode});}
   catch(error){if(error instanceof JournalAccessError&&error.code==='payment_not_eligible')continue;throw error;}
   await store.savePurchase({buyer_user_id:buyer.id,stripe_session_id:session.id,
     catalogue_version:catalogue.approvedVersion,offer_id:offer.id,verified_at:new Date(now).toISOString()});
   purchases.push({sessionId:session.id,bookIds:offer.bookIds,catalogueVersion:catalogue.approvedVersion});
  }else if(session.status==='open'&&session.payment_status==='unpaid'){
   if(!Number.isFinite(session.expires_at))fail('purchase_recovery_unavailable');
   if(session.expires_at*1000>now)pending.push({sessionId:session.id,bookIds:offer.bookIds,
     catalogueVersion:catalogue.approvedVersion,totalCents:offer.priceCents,
     checkoutUrl:checkoutURL(session.url),expiresAt:session.expires_at});
  }else if(session.status!=='expired'){
   // A completed delayed/unpaid payment must not trigger a second charge.
   fail('payment_confirmation_pending',409);
  }
 }
 return {purchases,pending,ownedBookIds:[...new Set(purchases.flatMap(p=>p.bookIds))].sort(),attempts};
}
export async function startJournalCheckout({user,catalogue,selectedIds,bundleRequested=false,expectedTotalCents,
 store,stripe,resolveCatalogue,liveMode,sha256,now=Date.now(),recoveryPass=0}){
 const buyer=requireJournalBuyer(user);
 const state=await journalAccountState({user,store,stripe,resolveCatalogue,liveMode,now});
 const plan=planJournalPurchase({catalogue,selectedIds,verifiedOwnedIds:state.ownedBookIds,bundleRequested});
 if(plan.status==='already_owned')return {status:'already_owned',ownedBookIds:state.ownedBookIds,purchases:state.purchases};
 if(plan.status!=='ready'||expectedTotalCents!==plan.totalCents)return {status:'selection_requires_confirmation',
   bookIds:plan.bookIds,alreadyOwned:plan.alreadyOwned,total_cents:plan.totalCents};
 const pending=state.pending[0]; // One open checkout per buyer, including different selections.
 if(pending)return {status:pending.bookIds.length===plan.bookIds.length&&pending.bookIds.every(id=>plan.bookIds.includes(id))&&
   pending.totalCents===plan.totalCents?'pending_checkout':'pending_selection_conflict',
   pending,checkout_url:pending.checkoutUrl};
 // One buyer-wide generation selects the same server key, regardless of browser
 // nonce or selection. Different concurrent payloads must fail Stripe idempotency.
 // After a confirmed expired session, both concurrent callers derive the same successor.
 const fingerprint=await sha256(new TextEncoder().encode(JSON.stringify([JOURNAL_POLICY,buyer.id,buyer.email,catalogue.approvedVersion,plan.offerId,plan.totalCents])));
 const predecessors=[...new Set([...state.attempts,...state.purchases.map(p=>({stripe_session_id:p.sessionId}))]
   .map(a=>a.stripe_session_id))].sort();
 const generation=await sha256(new TextEncoder().encode(JSON.stringify(predecessors)));
 const buyerKey=await sha256(new TextEncoder().encode(JSON.stringify([JOURNAL_POLICY,buyer.id,buyer.email])));
 const requestId=buyerKey.slice(0,32)+generation.slice(0,32);
 const checkout=journalCheckoutParams({catalogue,offerId:plan.offerId,user,origin:'https://gannonwaye.com',requestId});
 // Stripe has a bounded idempotency window; its complete paginated search is also required
 // before creation so a lost index write or old retry does not silently create another charge.
 const discovered=await stripe.findJournalSessions({buyerId:buyer.id});
 if(!Array.isArray(discovered)||discovered.length>100)fail('purchase_recovery_unavailable');
 for(const session of discovered){
  if(!validSession(session?.id))fail('purchase_recovery_unavailable');
  const snapshot=await resolveCatalogue(session.metadata?.catalogue_version);
  const discoveredOffer=sessionOffer({session,user,catalogue:snapshot,liveMode});
  await store.saveAttempt({buyer_user_id:buyer.id,stripe_session_id:session.id,
    catalogue_version:snapshot.approvedVersion,offer_id:discoveredOffer.id,
    fingerprint:session.metadata?.checkout_fingerprint||'legacy-recovered',
    recorded_at:new Date(now).toISOString()});
 }
 if(discovered.some(s=>!state.attempts.some(a=>a.stripe_session_id===s.id))){
   if(recoveryPass>=1)fail('purchase_recovery_unavailable');
   return startJournalCheckout({user,catalogue,selectedIds,bundleRequested,expectedTotalCents,store,stripe,resolveCatalogue,liveMode,sha256,now,recoveryPass:recoveryPass+1});
 }
 const params={...checkout.params,metadata:{...checkout.params.metadata,checkout_fingerprint:fingerprint}};
 const session=await stripe.checkout.sessions.create(params,{idempotencyKey:JOURNAL_POLICY+':'+requestId});
 if(!validSession(session?.id))fail('checkout_unavailable');
 const url=checkoutURL(session.url);
 // Persist before handing the URL to a browser. If persistence fails, the same server
 // key/search recovers the Stripe session on retry, without accepting another payment.
 await store.saveAttempt({buyer_user_id:buyer.id,stripe_session_id:session.id,
   catalogue_version:catalogue.approvedVersion,offer_id:plan.offerId,fingerprint,
   recorded_at:new Date(now).toISOString()});
 return {status:'checkout',checkout_url:url,session_id:session.id};
}
export async function confirmJournalReturn({user,sessionId,store,stripe,resolveCatalogue,liveMode,now=Date.now()}){
 const buyer=requireJournalBuyer(user);
 if(!validSession(sessionId))fail('invalid_reference',400);
 const session=await stripe.checkout.sessions.retrieve(sessionId);
 if(session?.id!==sessionId)fail('purchase_not_found',404);
 const catalogue=await resolveCatalogue(session.metadata?.catalogue_version);
 const offer=sessionOffer({session,user,catalogue,liveMode});
 if(session.status==='open'&&session.payment_status==='unpaid'&&Number.isFinite(session.expires_at)&&session.expires_at*1000<=now)return {status:'expired'};
 if(session.status==='open'&&session.payment_status==='unpaid')return {status:'pending',
   sessionId,bookIds:offer.bookIds,checkoutUrl:checkoutURL(session.url)};
 if(session.status==='expired')return {status:'expired'};
 if(session.status!=='complete'||session.payment_status!=='paid')return {status:'confirming'};
 const pi=typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent?.id;
 if(!/^pi_[A-Za-z0-9]+$/.test(pi||''))fail('purchase_not_found',404);
 const intent=await stripe.paymentIntents.retrieve(pi,{expand:['latest_charge']});
 verifyJournalPayment({catalogue,user,session,paymentIntent:intent,liveMode});
 await store.savePurchase({buyer_user_id:buyer.id,stripe_session_id:sessionId,
  catalogue_version:catalogue.approvedVersion,offer_id:offer.id,verified_at:new Date(now).toISOString()});
 return {status:'paid',sessionId,bookIds:offer.bookIds};
}

export async function cancelJournalCheckout(args){
 const state=await confirmJournalReturn(args);
 if(state.status!=='pending')return state;
 const result=await args.stripe.checkout.sessions.expire(args.sessionId);
 if(result?.id!==args.sessionId||result.status!=='expired')fail('checkout_cancellation_unavailable');
 return {status:'expired'};
}
