import {deliverJournalPreorderRelease} from '../staging/journal-commerce/functions/journalStripeWebhook/journalReleaseDelivery.js';
import {journalItemPlans,journalAssetBindings,journalFulfilmentSummary,assertJournalCheckoutTiming} from '../staging/journal-commerce/functions/journalStripeWebhook/journalFulfilment.js';
import {planJournalPurchase} from '../staging/journal-commerce/functions/journalStripeWebhook/journalPurchaseRecovery.js';
import {journalAccountState,startJournalCheckout} from '../staging/journal-commerce/functions/journalStripeWebhook/journalCheckoutRecovery.js';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import Stripe from 'npm:stripe@22.6.0';
import {createJournalWebhookHandler,createJournalHttpHandler,createJournalStore} from '../staging/journal-commerce/functions/journalStripeWebhook/journalHttp.js';
import {JOURNAL_POLICY,JOURNAL_APP_ID,JOURNAL_ABN,journalCheckoutParams,journalOffer,fulfilJournalDownload,verifyJournalDeliverables} from '../staging/journal-commerce/functions/journalStripeWebhook/journalCommerce.js';
import {confirmJournalReturn} from '../staging/journal-commerce/functions/journalStripeWebhook/journalCheckoutRecovery.js';
import {assertJournalPurchaseState} from '../src/lib/journalPurchaseState.js';
import {PUBLIC_JOURNALS} from '../src/lib/publicJournalCatalogue.js';
import {validateJournalBuyerDetails,recordJournalBuyerAcknowledgements,verifyJournalBuyerAcknowledgements,journalAcknowledgementFacts} from '../staging/journal-commerce/functions/journalStripeWebhook/journalBuyerDetails.js';
import {deliverJournalEmail} from '../staging/journal-commerce/functions/journalStripeWebhook/journalEmailDelivery.js';
import {JOURNAL_DELIVERY_TERMS_VERSION,JOURNAL_DELIVERY_NOTICE} from '../staging/journal-commerce/functions/journalStripeWebhook/journalDeliveryTerms.js';
const digest=b=>createHash('sha256').update(b).digest('hex');
const signingSecret='whsec_SYNTHETIC_LOCAL_FIXTURE_ONLY';
const sdk=new Stripe('sk_test_SYNTHETIC_LOCAL_FIXTURE_ONLY',{apiVersion:'2026-08-26.dahlia'});
const test=(name,fn)=>Deno.test({name,sanitizeResources:false,sanitizeOps:false,fn});
function fixture({live=false,preorder=false,bundle=false}={}){
 const buyer={id:'fixture-buyer',email:'buyer@example.invalid',is_verified:true};
 const books=Array.from({length:6},(_,i)=>({id:'fixture-book-'+i,title:'Synthetic journal '+i,priceCents:990,
  releaseApproved:!preorder,preorderApproved:preorder,fileUri:'private/synthetic/'+i,sha256:digest('synthetic'+i),stripePriceId:'price_fixturebook'+i}));
 const catalogue={enabled:true,deliveryTermsVersion:JOURNAL_DELIVERY_TERMS_VERSION,approvedVersion:'synthetic-contract-only-v1',fulfilmentType:preorder?'preorder':'released',
  books,bundleId:'fixture-bundle',bundlePriceCents:4500,bundleEnabled:true,bundleStripePriceId:'price_fixturebundle',
  ...(preorder?{preorder:{approved:true,termsApproved:true,editionLabel:'Synthetic test edition, not an actual product',
   deliveryBy:'2099-01-01T00:00:00Z',termsVersion:'synthetic-terms-v1',
   cancellationText:'Synthetic cancellation terms only.',delayText:'Synthetic delay terms only.'}}:{})};
 const amount=bundle?4500:990;
 const session={id:'cs_'+(live?'live':'test')+'_ABCDEFGHIJKLMNOP',livemode:live,mode:'payment',currency:'aud',
  status:'complete',payment_status:'paid',amount_total:amount,amount_subtotal:amount,payment_intent:'pi_fixture',
  customer_email:buyer.email,consent:{terms_of_service:'accepted'},expires_at:Math.floor(Date.now()/1000)+3600,
  url:'https://checkout.stripe.com/synthetic',
  metadata:{checkout_policy:JOURNAL_POLICY,app_id:JOURNAL_APP_ID,abn:JOURNAL_ABN,buyer_user_id:buyer.id,
   catalogue_version:catalogue.approvedVersion,buyer_details_id:'fixture-buyer-details',terms_accepted_at:'2026-10-22T00:00:00.000Z',delivery_terms_version:JOURNAL_DELIVERY_TERMS_VERSION,offer_id:bundle?catalogue.bundleId:books[0].id,
   ...(preorder?{fulfilment_type:'preorder',terms_version:catalogue.preorder.termsVersion}:{})}};
 const intent={id:'pi_fixture',status:'succeeded',currency:'aud',livemode:live,amount_received:amount,
  latest_charge:{paid:true,status:'succeeded',disputed:false,refunded:false,amount_refunded:0}};
 const assetSet=digest(JSON.stringify(books.map(b=>[b.id,b.sha256]).sort((a,b)=>a[0].localeCompare(b[0]))));
 const price={id:bundle?catalogue.bundleStripePriceId:books[0].stripePriceId,active:true,livemode:live,currency:'aud',
  type:'one_time',billing_scheme:'per_unit',unit_amount:amount,
  product:{active:true,metadata:{app_id:JOURNAL_APP_ID,journal_policy:JOURNAL_POLICY,
   ...(bundle?{journal_bundle_id:catalogue.bundleId,journal_asset_set_sha256:assetSet}:{journal_book_id:books[0].id,journal_asset_sha256:books[0].sha256}),
   ...(preorder?{journal_preorder_contract:catalogue.approvedVersion}:{})}}};
 const lock={id:'fixture-lock',locked:false,owner:''},rows={JournalPurchase:[],JournalCheckoutAttempt:[]};
 rows.JournalBuyerDetails=[{id:'fixture-buyer-details',buyer_user_id:buyer.id,verified_email:buyer.email,first_name:'Test',last_name:'Buyer',date_of_birth:'1990-01-01',phone:'+61400000000',terms_version:JOURNAL_DELIVERY_TERMS_VERSION,accepted_at:'2026-10-22T00:00:00.000Z',purchase_rules_accepted:true,self_help_acknowledged:true}];
 const calls={email:0,create:0,update:0,claim:0,release:0,client:0,privateRead:0,expire:0,price:0},fault={};
 const api=Object.fromEntries(Object.keys(rows).map(entity=>[entity,{
  get:async id=>structuredClone(rows[entity].find(r=>r.id===id)),
  updateMany:async(query,update)=>{const row=rows[entity].find(r=>Object.entries(query).every(([k,v])=>r[k]===v));if(row)Object.assign(row,update.$set);return {success:true,updated:row?1:0,has_more:false};},
  filter:async query=>{
   if(fault.readFailure)throw Error('synthetic database unavailable');
   const matches=rows[entity].filter(row=>Object.entries(query).every(([k,v])=>row[k]===v));
   return structuredClone(matches).map(row=>fault.badReadback&&entity==='JournalPurchase'?{...row,total_cents:1}:row);
  },
  create:async row=>{
   calls.create++;
   if(fault.createDelay)await new Promise(resolve=>setTimeout(resolve,5));
   const saved={...structuredClone(row),id:'fixture-record-'+rows[entity].length};
   if(fault.createBeforeWrite)throw Error('synthetic write failed');
   rows[entity].push(saved);
   if(fault.uncertainWrite)throw Error('synthetic timeout after commit');
   return saved;
  },
  update:async(id,row)=>{calls.update++;Object.assign(rows[entity].find(r=>r.id===id),structuredClone(row));return row;}
 }]));
 api.JournalOrderLock={
  get:async()=>structuredClone(lock),
  updateMany:async(query,update)=>{
   assert.equal(query.id,lock.id);assert.equal(typeof query.id,'string');
   const matches=Object.entries(query).every(([k,v])=>lock[k]===v);
   if(update.$set.locked)calls.claim++;else calls.release++;
   if(matches)Object.assign(lock,update.$set);
   return {success:true,updated:matches?1:0,has_more:false};
  }
 };
 const client={auth:{me:async()=>buyer},asServiceRole:{entities:api,integrations:{Core:{CreateFileSignedUrl:async()=>{calls.privateRead++;throw Error('private read forbidden');}}}}};
 const lines={data:[{price:price.id,quantity:1}],has_more:false};
 const stripe={webhooks:{constructEventAsync:(...args)=>sdk.webhooks.constructEventAsync(...args)},prices:{retrieve:async()=>{calls.price++;return price;}},
  checkout:{sessions:{retrieve:async()=>structuredClone(session),listLineItems:async()=>structuredClone(lines),list:async()=>({data:[],has_more:false}),
   create:async()=>{throw Error('Provider session creation forbidden by this suite');},
   expire:async id=>{calls.expire++;session.status='expired';return {id,status:'expired'};}}},
  paymentIntents:{retrieve:async()=>structuredClone(intent)}};
 const release={enabled:true,launchBookIds:[books[0].id],emailDeliveryVerified:true,liveMode:live,orderUniquenessVerified:true,orderLockId:lock.id,currentCatalogue:catalogue,
  catalogues:{[catalogue.approvedVersion]:catalogue},privateDownloadHosts:[]};
 const sentEmails=[];
 const deps={release,sendJournalEmail:async message=>{calls.email++;sentEmails.push(message);if(fault.emailThrow)throw Error('synthetic timeout');return fault.emptyEmailResponse?{}:{accepted:true};},createStripe:()=>stripe,createRequestClient:()=>{calls.client++;return client;},
  resolveBuyer:async(c,id)=>id===buyer.id?buyer:null,webhookSecret:()=>signingSecret,sha256:async b=>digest(b)};
 const store=()=>createJournalStore(client,{orderLockId:lock.id});
 const event={id:'evt_SYNTHETIC123',type:'checkout.session.completed',livemode:live,data:{object:{id:session.id}}};
 const refreshAcceptance=()=>{
  if(catalogue.fulfilmentType==='preorder')return;
  const offer=journalOffer(catalogue,session.metadata.offer_id),items=journalItemPlans(catalogue,offer.bookIds);
  const preorder=items.some(p=>p.fulfilmentType==='preorder')?catalogue.preorder:null;
  const contract=preorder?{termsVersion:preorder.termsVersion,releaseDate:preorder.releaseDate,timeZone:preorder.timeZone,
   releaseLabel:preorder.releaseLabel,releaseStartsAt:preorder.releaseStartsAt,deliveryBy:preorder.deliveryBy,cancellationText:preorder.cancellationText}:null;
  const acceptance=digest(JSON.stringify({catalogueVersion:catalogue.approvedVersion,offerId:offer.id,items,preorder:contract,deliveryTermsVersion:catalogue.deliveryTermsVersion}));
  Object.assign(rows.JournalBuyerDetails[0],{catalogue_version:catalogue.approvedVersion,offer_id:offer.id,item_plan_sha256:acceptance,preorder_terms_version:contract?.termsVersion||''});
  session.metadata.buyer_acceptance_sha256=acceptance;
  if(contract)session.metadata.preorder_terms_version=contract.termsVersion;
 };
 refreshAcceptance();
 const verifyAcknowledgements=args=>verifyJournalBuyerAcknowledgements({api,sha256:async b=>digest(b),...args});
 return {refreshAcceptance,verifyAcknowledgements,get lastEmail(){return sentEmails.at(-1);},buyer,books,catalogue,session,intent,price,lock,rows,calls,fault,api,client,lines,stripe,release,deps,event,store};
}
async function webhook(f,{signature='valid',mutateRaw=false}={}){
 const raw=JSON.stringify(f.event);
 let header=await sdk.webhooks.generateTestHeaderStringAsync({payload:raw,secret:signingSecret});
 if(signature==='invalid')header=header.replace(/v1=[a-f0-9]+/,'v1='+'0'.repeat(64));
 const headers=signature==='missing'?{}:{'stripe-signature':header};
 return createJournalWebhookHandler(f.deps)(new Request('https://synthetic.invalid',{method:'POST',headers,body:mutateRaw?raw+' ':raw}));
}
async function http(f,action,body){
 return createJournalHttpHandler(action,f.deps)(new Request('https://synthetic.invalid',{method:'POST',
  headers:{authorization:'Bearer SYNTHETIC','content-type':'application/json'},body:JSON.stringify(body)}));
}
for(const live of [false,true])for(const signature of ['missing','invalid']){
 test('signature '+signature+' rejects in '+(live?'live':'test')+' mode without order',async()=>{
  const f=fixture({live,preorder:false}),r=await webhook(f,{signature});
  assert.equal(r.status,400);assert.equal(f.calls.client,0);assert.equal(f.rows.JournalPurchase.length,0);
 });
}
test('raw signed body tamper is rejected',async()=>{const f=fixture();assert.equal((await webhook(f,{mutateRaw:true})).status,400);assert.equal(f.calls.create,0);});
test('explicitly closed webhook reads no SDK, credentials or customer data',async()=>{
 const {RELEASE_CONFIG}=await import('../staging/journal-commerce/functions/journalStripeWebhook/releaseConfig.js');
 let touched=0;const handler=createJournalWebhookHandler({release:{...RELEASE_CONFIG,enabled:false},createStripe:()=>{touched++;}});
 const r=await handler(new Request('https://synthetic.invalid',{method:'POST',body:'{}'}));assert.equal(r.status,503);assert.equal(touched,0);
});
for(const bundle of [false,true])test('signed '+(bundle?'A$45 bundle':'A$9.90 single')+' records exact released order and replay stays one order',async()=>{
 const f=fixture({bundle});let r=await webhook(f);assert.equal(r.status,200);
 let data=await r.json();assert.equal(data.processed,true);assert.equal(data.fulfilment_status,'paid_release_verified');
 assert.equal(f.rows.JournalPurchase.length,1);const order=f.rows.JournalPurchase[0];
 assert.equal(order.total_cents,bundle?4500:990);assert.equal(order.book_ids.length,bundle?6:1);
 assert.equal(order.asset_hashes[f.books[0].id],f.books[0].sha256);
 assert.equal(order.stripe_payment_intent_id,f.intent.id);assert.equal(order.delivery_status,'email_accepted');
 r=await webhook(f);assert.equal(r.status,200);assert.equal((await r.json()).order_id,data.order_id);assert.equal(f.rows.JournalPurchase.length,1);
});
test('completed unpaid grants nothing; signed async payment success captures once',async()=>{
 const f=fixture();f.session.payment_status='unpaid';let r=await webhook(f);assert.equal(r.status,200);assert.equal((await r.json()).processed,false);assert.equal(f.calls.create,0);
 f.session.payment_status='paid';f.event.type='checkout.session.async_payment_succeeded';r=await webhook(f);assert.equal(r.status,200);assert.equal(f.rows.JournalPurchase.length,1);
});
for(const [name,change] of [
 ['wrong price id with correct total',f=>{f.lines.data[0].price='price_unrelated';}],
 ['wrong quantity with correct total',f=>{f.lines.data[0].quantity=2;}],
 ['unknown extra line',f=>{f.lines.data.push({...f.lines.data[0]});}],
 ['truncated line items',f=>{f.lines.has_more=true;}],
 ['wrong product binding',f=>{f.price.product.metadata.journal_asset_sha256='0'.repeat(64);}],
 ['refunded payment',f=>{f.intent.latest_charge.refunded=true;}],
 ['partially refunded payment',f=>{f.intent.latest_charge.amount_refunded=1;}],
 ['disputed payment',f=>{f.intent.latest_charge.disputed=true;}],
 ['failed payment intent',f=>{f.intent.status='requires_payment_method';}],
 ['foreign app',f=>{f.session.metadata.app_id='another-app';}],
 ['foreign policy',f=>{f.session.metadata.checkout_policy='another-policy';}],
 ['foreign buyer',f=>{f.session.metadata.buyer_user_id='another-buyer';}],
 ['foreign mode',f=>{f.session.livemode=true;}],
 ['wrong amount',f=>{f.session.amount_total=4900;}],
 ['discounted amount',f=>{f.session.total_details={amount_discount:891};}],
 ['unaccepted purchase rules',f=>{f.rows.JournalBuyerDetails[0].purchase_rules_accepted=false;}],
 ['stale terms version',f=>{f.session.metadata.delivery_terms_version='stale';}]
])test(name+' creates no order',async()=>{const f=fixture();change(f);const r=await webhook(f);assert.ok(r.status>=400);assert.equal(f.calls.create,0);assert.equal(f.calls.privateRead,0);});
test('paid browser return after webhook reuses persisted order',async()=>{
 const f=fixture();const r=await webhook(f);assert.equal(r.status,200);const order=(await r.json()).order_id;
 const confirmed=await confirmJournalReturn({user:f.buyer,sessionId:f.session.id,store:f.store(),stripe:f.stripe,
  resolveCatalogue:async()=>f.catalogue,liveMode:false,verifyAcknowledgements:f.verifyAcknowledgements});
 assert.equal(confirmed.orderId,order);assert.equal(confirmed.downloadReady,true);assert.equal(f.rows.JournalPurchase.length,1);
});
test('24 independent order writers cannot create duplicates; retries reuse durable row',async()=>{
 const f=fixture();f.fault.createDelay=true;
 const args=()=>({user:f.buyer,sessionId:f.session.id,store:f.store(),stripe:f.stripe,resolveCatalogue:async()=>f.catalogue,liveMode:false,verifyAcknowledgements:f.verifyAcknowledgements});
 const results=await Promise.allSettled(Array.from({length:24},()=>confirmJournalReturn(args())));
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(f.rows.JournalPurchase.length,1);assert.equal(f.calls.create,1);
 for(let i=0;i<24;i++)await confirmJournalReturn(args());
 assert.equal(f.rows.JournalPurchase.length,1);assert.equal(f.lock.locked,false);
});
test('uncertain write keeps durable lock and no success/second write',async()=>{
 const f=fixture();f.fault.uncertainWrite=true;let r=await webhook(f);
 assert.equal(r.status,503);assert.equal(f.rows.JournalPurchase.length,1);assert.equal(f.lock.locked,true);assert.equal(f.calls.release,0);
 f.fault.uncertainWrite=false;r=await webhook(f);assert.equal(r.status,503);assert.equal(f.calls.create,1);
});
test('failed storage write grants no success and retains lock for reconciliation',async()=>{
 const f=fixture();f.fault.createBeforeWrite=true;const r=await webhook(f);assert.equal(r.status,503);
 assert.equal(f.rows.JournalPurchase.length,0);assert.equal(f.lock.locked,true);assert.equal(f.calls.release,0);
});
test('readback amount mismatch prevents paid acknowledgement and retains lock',async()=>{
 const f=fixture();f.fault.badReadback=true;const r=await webhook(f);assert.equal(r.status,503);
 assert.equal(f.rows.JournalPurchase.length,1);assert.equal(f.lock.locked,true);
});
test('duplicate stored sessions are rejected without update',async()=>{
 const f=fixture();f.rows.JournalPurchase.push({id:'a',stripe_session_id:f.session.id},{id:'b',stripe_session_id:f.session.id});
 assert.equal((await webhook(f)).status,503);assert.equal(f.calls.update,0);assert.equal(f.calls.create,0);
});
test('conflicting buyer on same session is rejected globally',async()=>{
 const f=fixture();f.rows.JournalPurchase.push({id:'a',stripe_session_id:f.session.id,buyer_user_id:'other'});
 assert.equal((await webhook(f)).status,503);assert.equal(f.calls.update,0);
});

test('approved released PDF is checked before provider checkout can be created',async()=>{
 const f=fixture(),pdf=new TextEncoder().encode('%PDF-synthetic fixture');
 let reads=0;
 f.catalogue.books[0].sha256=digest(pdf);
 await verifyJournalDeliverables({catalogue:f.catalogue,bookIds:[f.books[0].id],readPrivateFile:async()=>{reads++;return pdf;},sha256:async b=>digest(b)});
 assert.equal(reads,1);
 await assert.rejects(verifyJournalDeliverables({catalogue:f.catalogue,bookIds:[f.books[0].id],readPrivateFile:async()=>new Uint8Array([0]),sha256:async b=>digest(b)}));
});
test('single-title release cannot sell held journals or the six-book bundle',()=>{
 const f=fixture();f.catalogue.bundleEnabled=false;
 for(const book of f.books.slice(1))book.releaseApproved=false;
 assert.equal(journalOffer(f.catalogue,f.books[0].id).priceCents,990);
 assert.throws(()=>journalOffer(f.catalogue,f.books[1].id));
 assert.throws(()=>journalOffer(f.catalogue,f.catalogue.bundleId));
});
test('unverified email is rejected before provider or data access',async()=>{
 const f=fixture();f.buyer.is_verified=false;const r=await http(f,'getJournalPurchases',{});assert.equal(r.status,403);
 assert.equal(f.calls.create,0);assert.equal(f.calls.privateRead,0);
});
test('both buyer acknowledgements must be explicitly true',async()=>{
 const f=fixture();
 for(const body of [{},{purchase_rules_accepted:true},{self_help_acknowledged:true}]){
  await assert.rejects(recordJournalBuyerAcknowledgements({api:f.api,buyer:f.buyer,body}),e=>e.code==='purchase_acknowledgements_required');
 }
});
test('buyer details reject missing first/last, impossible/future DOB, invalid phone and foreign email',()=>{
 const f=fixture(),valid={first_name:'Test',last_name:'Buyer',date_of_birth:'1990-01-01',phone:'+61400000000',email:f.buyer.email};
 validateJournalBuyerDetails(valid,f.buyer);
 for(const patch of [{first_name:''},{last_name:''},{date_of_birth:'2025-02-30'},{date_of_birth:'2099-01-01'},{phone:'abc'},{email:'other@example.invalid'}])
  assert.throws(()=>validateJournalBuyerDetails({...valid,...patch},f.buyer));
});
test('private buyer details and both acknowledgements are stored without metadata leakage',async()=>{
 const f=fixture(),body={buyer_details:{first_name:'Test',last_name:'Buyer',date_of_birth:'1990-01-01',phone:'+61400000000',email:f.buyer.email},
  terms_version:JOURNAL_DELIVERY_TERMS_VERSION,purchase_rules_accepted:true,self_help_acknowledged:true,catalogue_version:f.catalogue.approvedVersion,offer_id:f.books[0].id};
 const ack=await recordJournalBuyerAcknowledgements({api:f.api,buyer:f.buyer,body,catalogue:f.catalogue,sha256:async b=>digest(b),now:Date.parse('2026-10-22T00:00:00Z')});
 const {params}=journalCheckoutParams({catalogue:f.catalogue,offerId:f.books[0].id,user:f.buyer,origin:'https://gannonwaye.com',
  requestId:'fixture_request_123456',acknowledgement:ack});
 assert.equal(params.metadata.buyer_details_id,ack.id);assert.equal(params.metadata.delivery_terms_version,JOURNAL_DELIVERY_TERMS_VERSION);
 const serial=JSON.stringify(params);assert.ok(!serial.includes('1990-01-01'));assert.ok(!serial.includes('+61400000000'));
 assert.equal(params.custom_text.submit.message,JOURNAL_DELIVERY_NOTICE);
 assert.equal(params.allow_promotion_codes,undefined);
});
test('email failure keeps paid order, returns no false success and retry sends no duplicate',async()=>{
 const f=fixture();f.fault.emailThrow=true;
 let r=await webhook(f);assert.equal(r.status,503);assert.equal(f.rows.JournalPurchase.length,1);
 assert.equal(f.rows.JournalPurchase[0].delivery_status,'review_required');assert.equal(f.lock.locked,false);assert.equal(f.calls.email,1);
 f.fault.emailThrow=false;r=await webhook(f);assert.equal(r.status,503);assert.equal(f.calls.email,1);
});
test('unknown email acceptance is not reported as delivery',async()=>{
 const f=fixture();f.fault.emptyEmailResponse=true;assert.equal((await webhook(f)).status,503);
 assert.equal(f.rows.JournalPurchase[0].delivery_status,'review_required');
});
test('24 email workers claim one paid order and never send duplicate receipts',async()=>{
 const f=fixture();await confirmJournalReturn({user:f.buyer,sessionId:f.session.id,store:f.store(),stripe:f.stripe,
  resolveCatalogue:async()=>f.catalogue,liveMode:false,verifyAcknowledgements:f.verifyAcknowledgements});
 const order=f.rows.JournalPurchase[0];
 const tasks=Array.from({length:24},()=>deliverJournalEmail({api:f.api,orderId:order.id,buyer:f.buyer,catalogue:f.catalogue,
  sendEmail:async()=>{f.calls.email++;await new Promise(resolve=>setTimeout(resolve,5));return {accepted:true};}}));
 await Promise.all(tasks);assert.equal(f.calls.email,1);assert.equal(order.delivery_status,'email_accepted');
});
test('email contains protected account link and no public file URI or DOB/phone',async()=>{
 const f=fixture();assert.equal((await webhook(f)).status,200);
 assert.ok(f.lastEmail.body.includes('https://gannonwaye.com/journals/purchase?session_id='));
 assert.ok(!f.lastEmail.body.includes('private/'));assert.ok(!f.lastEmail.body.includes('1990-01-01'));assert.ok(!f.lastEmail.body.includes('+61400000000'));
 assert.equal(f.lastEmail.to,f.buyer.email);
});
test('cancel unpaid checkout expires without order; paid checkout cannot be cancelled as unpaid',async()=>{
 const f=fixture();f.session.status='open';f.session.payment_status='unpaid';let r=await http(f,'cancelJournalCheckout',{session_id:f.session.id});
 assert.equal(r.status,200);assert.equal((await r.json()).status,'expired');assert.equal(f.calls.create,0);assert.equal(f.calls.expire,1);
 const paid=fixture();r=await http(paid,'cancelJournalCheckout',{session_id:paid.session.id});assert.equal((await r.json()).status,'paid');assert.equal(paid.calls.expire,0);
});
test('archived bound paid price/product do not erase a legitimate paid order',async()=>{
 const f=fixture();f.price.active=false;f.price.product.active=false;
 assert.equal((await webhook(f)).status,200);assert.equal(f.rows.JournalPurchase.length,1);
});
test('UI rejects paid response lacking durable order or released download entitlement',()=>{
 const good={status:'paid',orderId:'fixture',bookIds:[PUBLIC_JOURNALS[0].id],fulfilmentType:'released',downloadReady:true};
 assertJournalPurchaseState(good);
 for(const patch of [{orderId:null},{downloadReady:false},{fulfilmentType:'preorder'}])assert.throws(()=>assertJournalPurchaseState({...good,...patch}));
});
test('all six packages are identical, self contained and block SDK under explicit closed gate',async()=>{
 const root=new URL('../staging/journal-commerce/functions/',import.meta.url),hashes=new Map();let count=0;
 for(const directory of await readdir(root)){
  const dir=new URL(directory+'/',root),files=await readdir(dir);if(!files.includes('journalHttp.js'))continue;count++;
  for(const name of files.filter(n=>n.endsWith('.js'))){const hash=digest(await readFile(new URL(name,dir)));
   if(hashes.has(name))assert.equal(hash,hashes.get(name));else hashes.set(name,hash);}
  const {RELEASE_CONFIG}=await import(new URL('releaseConfig.js',dir).href);
  assert.equal(typeof RELEASE_CONFIG.enabled,'boolean');assert.equal(RELEASE_CONFIG.orderUniquenessVerified,true);assert.ok(RELEASE_CONFIG.orderLockId);assert.equal(RELEASE_CONFIG.emailDeliveryVerified,true);
  assert.deepEqual([...RELEASE_CONFIG.launchBookIds].sort(),['building-resilience','healthy-boundaries']);
  assert.equal(RELEASE_CONFIG.currentCatalogue.bundleEnabled,false);
  assert.deepEqual(RELEASE_CONFIG.currentCatalogue.books.filter(b=>b.releaseApproved).map(b=>b.id).sort(),['building-resilience','healthy-boundaries']);
  const {createJournalHttpHandler}=await import(new URL('journalHttp.js',dir).href);
  let touched=0;const closed=createJournalHttpHandler('createJournalCheckout',{release:{...RELEASE_CONFIG,enabled:false},createRequestClient:()=>{touched++;throw Error('closed SDK must not run');}});
  assert.equal((await closed(new Request('https://function.example.invalid',{method:'POST',body:'{}'}))).status,503);assert.equal(touched,0);
 }
 assert.equal(count,6);
});

for(const state of ['sending','review_required','email_accepted'])test('legacy enrichment preserves '+state+' and sends no duplicate email',async()=>{
 const f=fixture();assert.equal((await webhook(f)).status,200);const order=f.rows.JournalPurchase[0];
 delete order.asset_hashes;order.delivery_status=state;f.calls.email=0;
 const response=await webhook(f);assert.equal(response.status,state==='email_accepted'?200:503);
 assert.equal(order.delivery_status,state);assert.equal(f.calls.email,0);assert.ok(order.asset_hashes);
});
test('email verification gate blocks bound transport in both webhook and return',async()=>{
 const f=fixture();f.release.emailDeliveryVerified=false;
 assert.equal((await webhook(f)).status,503);assert.equal(f.calls.email,0);
 const response=await http(f,'confirmJournalPurchase',{session_id:f.session.id});
 assert.equal(response.status,200);assert.equal((await response.json()).deliveryStatus,'pending');assert.equal(f.calls.email,0);
});

function mixedFixture({bundle=true,pendingOnly=false}={}){
 const f=fixture({bundle});f.catalogue.fulfilmentType='mixed';
 f.catalogue.preorder={saleApproved:true,cancellationPolicyApproved:true,termsVersion:'synthetic-preorder-v2',
  cancellationText:'Synthetic approved cancellation policy, never published.',releaseDate:'2099-11-02',
  timeZone:'Australia/Melbourne',releaseLabel:'2 November 2099 (synthetic only)',
  releaseStartsAt:'2099-11-01T13:00:00.000Z',deliveryBy:'2099-11-02T12:59:59.999Z'};
 for(const b of f.books.slice(2)){b.releaseApproved=false;b.preorderApproved=true;delete b.fileUri;delete b.sha256;}
 if(pendingOnly){
  f.session.metadata.offer_id=f.books[2].id;f.price.id=f.books[2].stripePriceId;
  f.price.product.metadata={app_id:JOURNAL_APP_ID,journal_policy:JOURNAL_POLICY,journal_book_id:f.books[2].id,
   journal_preorder_contract:f.catalogue.approvedVersion,journal_delivery_date:f.catalogue.preorder.releaseDate,
   journal_terms_version:f.catalogue.preorder.termsVersion,
   journal_preorder_plan_sha256:digest(JSON.stringify(journalAssetBindings(f.catalogue,[f.books[2].id])))};
  f.lines.data=[{price:f.price.id,quantity:1}];
 }else if(bundle)f.price.product.metadata.journal_asset_set_sha256=digest(JSON.stringify(journalAssetBindings(f.catalogue,f.books.map(b=>b.id))));
 f.release.launchBookIds=f.books.map(b=>b.id);f.refreshAcceptance();return f;
}
const confirmed=f=>confirmJournalReturn({user:f.buyer,sessionId:f.session.id,store:f.store(),stripe:f.stripe,
 resolveCatalogue:async()=>f.catalogue,verifyAcknowledgements:f.verifyAcknowledgements,liveMode:false});
test('mixed A$45 signed order records two immediate and four preorder items without invented PDF hashes',async()=>{
 const f=mixedFixture();assert.equal((await webhook(f)).status,200);
 const result=await confirmed(f),order=f.rows.JournalPurchase[0];
 assert.equal(result.fulfilmentType,'mixed');assert.equal(order.total_cents,4500);
 assert.equal(result.bookIds.length,6);assert.equal(result.downloadableBookIds.length,2);
 assert.equal(result.items.filter(p=>p.fulfilmentType==='preorder').length,4);
 assert.deepEqual(Object.keys(order.asset_hashes).sort(),f.books.slice(0,2).map(b=>b.id));
 assert.equal(order.item_plan.filter(p=>p.fulfilmentType==='preorder').some(p=>p.sha256||p.fileUri),false);
 assert.match(f.lastEmail.body,/Preorder: 2 November 2099/);assert.match(f.lastEmail.body,/Ready to download/);assert.equal(f.calls.privateRead,0);
});
test('preorder-only A$9.90 payment records ownership without any download entitlement',async()=>{
 const f=mixedFixture({bundle:false,pendingOnly:true});assert.equal((await webhook(f)).status,200);
 const result=await confirmed(f);assert.equal(f.rows.JournalPurchase[0].total_cents,990);
 assert.equal(result.fulfilmentType,'preorder');assert.equal(result.downloadReady,false);assert.deepEqual(result.downloadableBookIds,[]);
 assert.equal(planJournalPurchase({catalogue:f.catalogue,selectedIds:[f.books[2].id],verifiedOwnedIds:result.bookIds}).status,'already_owned');
 assert.equal(f.calls.privateRead,0);
});
test('mixed selection and bundle retain A$9.90/A$45 with no silent subset discount',()=>{
 const f=mixedFixture();assert.equal(journalOffer(f.catalogue,[f.books[0].id,f.books[2].id]).priceCents,1980);
 assert.equal(journalOffer(f.catalogue,f.catalogue.bundleId).priceCents,4500);
 assert.equal(planJournalPurchase({catalogue:f.catalogue,selectedIds:f.books.map(b=>b.id),verifiedOwnedIds:[f.books[0].id],bundleRequested:true}).totalCents,4950);
});
test('mixed preflight reads only the two released exact PDFs',async()=>{
 const f=mixedFixture(),bytes=new TextEncoder().encode('%PDF-synthetic only'),uris=[];
 for(const b of f.books.slice(0,2))b.sha256=digest(bytes);
 await verifyJournalDeliverables({catalogue:f.catalogue,bookIds:f.books.map(b=>b.id),
  readPrivateFile:async uri=>{uris.push(uri);return bytes;},sha256:async b=>digest(b)});
 assert.deepEqual(uris.sort(),f.books.slice(0,2).map(b=>b.fileUri).sort());
});
test('pending PDF cannot download before OR after the promised date without an approved release binding',async()=>{
 const f=mixedFixture(),args={catalogue:f.catalogue,user:f.buyer,sessionId:f.session.id,bookId:f.books[2].id,
  retrieveSession:async()=>f.session,retrievePaymentIntent:async()=>f.intent,
  readPrivateFile:async()=>{throw Error('NO PRIVATE READ');},sha256:async b=>digest(b),liveMode:false};
 await assert.rejects(fulfilJournalDownload(args),e=>e.code==='journal_awaiting_release');
 await assert.rejects(fulfilJournalDownload({...args,now:Date.parse('2100-01-01T00:00:00Z')}),e=>e.code==='journal_awaiting_release');
});
for(const field of ['releaseStartsAt','deliveryBy','releaseLabel','cancellationText'])test('provider bundle digest rejects changed preorder '+field,async()=>{
 const f=mixedFixture();f.catalogue.preorder[field]=field==='releaseStartsAt'?'2099-11-01T14:00:00Z':
  field==='deliveryBy'?'2099-11-02T11:59:59Z':'Changed synthetic terms';
 const response=await webhook(f);assert.equal(response.status,503);assert.equal(f.rows.JournalPurchase.length,0);
});
test('preorder single provider binding must identify contract, release date and terms version',async()=>{
 const f=mixedFixture({bundle:false,pendingOnly:true});f.price.product.metadata.journal_terms_version='wrong';
 assert.equal((await webhook(f)).status,503);assert.equal(f.rows.JournalPurchase.length,0);
});
test('paid preorder capture rejects a stale acceptance digest before durable order or email',async()=>{
 const f=mixedFixture();f.rows.JournalBuyerDetails[0].item_plan_sha256='0'.repeat(64);
 assert.equal((await webhook(f)).status,403);assert.equal(f.rows.JournalPurchase.length,0);assert.equal(f.calls.email,0);
});
test('paid preorder capture rejects absent contract version',async()=>{
 const f=mixedFixture();delete f.session.metadata.preorder_terms_version;
 assert.equal((await webhook(f)).status,403);assert.equal(f.rows.JournalPurchase.length,0);
});
test('unapproved preorder cancellation policy blocks only affected selection',()=>{
 const f=mixedFixture();f.catalogue.preorder.cancellationPolicyApproved=false;
 assert.throws(()=>journalOffer(f.catalogue,f.books[2].id));assert.throws(()=>journalOffer(f.catalogue,f.catalogue.bundleId));
 assert.equal(journalOffer(f.catalogue,f.books[0].id).priceCents,990);
});
test('existing pending checkout past preorder cutoff cannot resume or create another session',async()=>{
 const f=mixedFixture({bundle:false,pendingOnly:true});f.session.status='open';f.session.payment_status='unpaid';
 f.session.expires_at=Math.floor(Date.parse('2100-01-01T00:00:00Z')/1000);
 f.rows.JournalCheckoutAttempt.push({buyer_user_id:f.buyer.id,stripe_session_id:f.session.id});
 let creates=0;f.stripe.checkout.sessions.create=async()=>{creates++;throw Error('NOT ALLOWED');};
 await assert.rejects(startJournalCheckout({user:f.buyer,catalogue:f.catalogue,selectedIds:[f.books[2].id],
  expectedTotalCents:990,store:f.store(),stripe:f.stripe,resolveCatalogue:async()=>f.catalogue,liveMode:false,
  verifyAcknowledgements:f.verifyAcknowledgements,verifyDeliverables:async()=>{},sha256:async b=>digest(b),
  now:Date.parse('2100-01-01T00:00:00Z')}),e=>e.code==='preorder_delivery_date_passed');
 assert.equal(creates,0);
});
test('genuine mixed payment still persists after contractual deadline without early file access',async()=>{
 const f=mixedFixture(),result=await confirmJournalReturn({user:f.buyer,sessionId:f.session.id,store:f.store(),stripe:f.stripe,
  resolveCatalogue:async()=>f.catalogue,verifyAcknowledgements:f.verifyAcknowledgements,liveMode:false,now:Date.parse('2100-01-01T00:00:00Z')});
 assert.equal(result.status,'paid');assert.equal(result.downloadableBookIds.length,2);
});
test('24 competing mixed captures preserve one paid order and all six owned IDs',async()=>{
 const f=mixedFixture();await Promise.all(Array.from({length:24},()=>confirmed(f).catch(()=>null)));
 const result=await confirmed(f);assert.equal(f.rows.JournalPurchase.length,1);assert.equal(result.bookIds.length,6);
});
test('mixed receipt UI validates a complete known plan and explicit downloadable subset',()=>{
 const ids=PUBLIC_JOURNALS.map(b=>b.id),items=ids.map((id,i)=>({bookId:id,fulfilmentType:i<2?'released':'preorder',
  ...(i<2?{}:{releaseDate:'2026-11-02',timeZone:'Australia/Melbourne'})}));
 const state={status:'paid',orderId:'synthetic',bookIds:ids,items,fulfilmentType:'mixed',downloadReady:true,downloadableBookIds:ids.slice(0,2)};
 assertJournalPurchaseState(state);
 for(const patch of [{downloadableBookIds:ids},{items:items.slice(1)},{downloadReady:false},{fulfilmentType:'released'}])
  assert.throws(()=>assertJournalPurchaseState({...state,...patch}));
});
test('mixed email refuses a changed stored contract snapshot and sends nothing',async()=>{
 const f=mixedFixture();await confirmed(f);f.rows.JournalPurchase[0].preorder_terms_snapshot.cancellationText='Changed';
 await assert.rejects(deliverJournalEmail({api:f.api,orderId:f.rows.JournalPurchase[0].id,buyer:f.buyer,catalogue:f.catalogue,
  sendEmail:async()=>{f.calls.email++;return {accepted:true};}}),e=>e.code==='delivery_terms_not_verified');assert.equal(f.calls.email,0);
});
async function releaseArgs(f,extra={}){
 const paid=await confirmed(f),bytes=new TextEncoder().encode('%PDF-approved synthetic release');
 const bindings=Object.fromEntries(f.books.slice(2,3).map(b=>[b.id,{bookId:b.id,catalogueVersion:f.catalogue.approvedVersion,
  releaseApproved:true,editionVersion:'synthetic-final-v1',fileUri:'private/synthetic/final',sha256:digest(bytes)}]));
 return {api:f.api,orderId:paid.orderId,user:f.buyer,catalogue:f.catalogue,releaseBindings:bindings,
  verifyPaidOrder:()=>confirmed(f),readPrivateFile:async()=>bytes,sha256:async b=>digest(b),
  sendEmail:async()=>{f.calls.email++;return {accepted:true};},now:Date.parse('2100-01-01T00:00:00Z'),...extra};
}
test('one newly approved preorder release sends separately and never resends initial journals',async()=>{
 const f=mixedFixture();assert.equal((await webhook(f)).status,200);assert.equal(f.calls.email,1);
 const args=await releaseArgs(f),result=await deliverJournalPreorderRelease(args);
 assert.equal(result.releaseDeliveryStatus,'email_accepted');assert.deepEqual(result.bookIds,[f.books[2].id]);
 assert.equal(f.calls.email,2);assert.equal(f.rows.JournalPurchase[0].delivery_status,'email_accepted');
 await deliverJournalPreorderRelease(args);assert.equal(f.calls.email,2);
});
test('24 concurrent release workers send one later-release email',async()=>{
 const f=mixedFixture(),args=await releaseArgs(f);
 const attempts=await Promise.allSettled(Array.from({length:24},()=>deliverJournalPreorderRelease(args)));
 for(const attempt of attempts)if(attempt.status==='rejected')assert.equal(attempt.reason?.code,'order_writer_busy');
 await deliverJournalPreorderRelease(args);assert.equal(f.calls.email,1);
});
test('uncertain later email stays held and retry does not resend',async()=>{
 const f=mixedFixture(),args=await releaseArgs(f,{sendEmail:async()=>{f.calls.email++;throw Error('uncertain');}});
 assert.equal((await deliverJournalPreorderRelease(args)).releaseDeliveryStatus,'review_required');
 await deliverJournalPreorderRelease(args);assert.equal(f.calls.email,1);
});
test('later release requires a freshly eligible paid order before file or email access',async()=>{
 const f=mixedFixture(),args=await releaseArgs(f,{verifyPaidOrder:async()=>({status:'refunded'}),
  readPrivateFile:async()=>{throw Error('NO FILE ACCESS');}});
 await assert.rejects(deliverJournalPreorderRelease(args),e=>e.code==='paid_order_not_verified');assert.equal(f.calls.email,0);
});
test('approved later binding is still unavailable before its promised release day',async()=>{
 const f=mixedFixture(),args=await releaseArgs(f,{now:Date.parse('2099-10-01T00:00:00Z')});
 assert.equal((await deliverJournalPreorderRelease(args)).releaseDeliveryStatus,'no_new_release');assert.equal(f.calls.email,0);
});
test('copied asset-record id cannot change purchased SKU or cause repeat release emails',async()=>{
 const f=mixedFixture(),args=await releaseArgs(f);args.releaseBindings[f.books[2].id].id='unrelated-asset-record';
 args.releaseBindings[f.books[2].id].title='Untrusted replacement title';
 const result=await deliverJournalPreorderRelease(args);assert.deepEqual(result.bookIds,[f.books[2].id]);
 assert.ok(f.rows.JournalPurchase[0].release_delivery[f.books[2].id]);
 assert.equal(f.rows.JournalPurchase[0].release_delivery['unrelated-asset-record'],undefined);
 await deliverJournalPreorderRelease(args);assert.equal(f.calls.email,1);
});
test('single preorder rejects a mismatched full-plan product digest',async()=>{
 const f=mixedFixture({bundle:false,pendingOnly:true});f.price.product.metadata.journal_preorder_plan_sha256='0'.repeat(64);
 assert.equal((await webhook(f)).status,503);assert.equal(f.rows.JournalPurchase.length,0);
});
test('preorder calendar label must match its exact Melbourne release day window',()=>{
 const f=mixedFixture();f.catalogue.preorder.releaseDate='2099-11-03';assert.throws(()=>journalOffer(f.catalogue,f.books[2].id));
});

test('interleaved disjoint releases preserve both delivery states without repeat emails',async()=>{
 const f=mixedFixture(),a=await releaseArgs(f);
 let signalSent,releaseFirst;
 const atSend=new Promise(resolve=>{signalSent=resolve;});
 const continueFirst=new Promise(resolve=>{releaseFirst=resolve;});
 let firstEmails=0,secondEmails=0;
 a.sendEmail=async()=>{firstEmails++;signalSent();await continueFirst;return {accepted:true};};
 const b={...a,releaseBindings:{[f.books[3].id]:{...a.releaseBindings[f.books[2].id],bookId:f.books[3].id}},
  sendEmail:async()=>{secondEmails++;return {accepted:true};}};
 const first=deliverJournalPreorderRelease(a);
 await Promise.race([atSend,new Promise((_,reject)=>setTimeout(()=>reject(Error('Synthetic send was not reached')),1000))]);
 try{assert.equal((await deliverJournalPreorderRelease(b)).releaseDeliveryStatus,'email_accepted');}
 finally{releaseFirst();}
 assert.equal((await first).releaseDeliveryStatus,'email_accepted');
 const order=f.rows.JournalPurchase[0];
 assert.equal(order.release_delivery[f.books[2].id].status,'email_accepted');
 assert.equal(order.release_delivery[f.books[3].id].status,'email_accepted');
 await deliverJournalPreorderRelease(a);await deliverJournalPreorderRelease(b);
 assert.equal(firstEmails,1);assert.equal(secondEmails,1);
});

export {fixture,webhook,http};
