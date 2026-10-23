import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fixture,webhook,http} from './test-journal-order-webhook.mjs';
import {journalPricedOffer,journalCheckoutParams,ownerJournalTestEligible,verifyJournalPayment,OWNER_JOURNAL_TEST_POLICY} from '../staging/journal-commerce/functions/journalStripeWebhook/journalCommerce.js';
import {createJournalStripe,verifyJournalPrices} from '../staging/journal-commerce/functions/journalStripeWebhook/journalHttp.js';
import {startJournalCheckout} from '../staging/journal-commerce/functions/journalStripeWebhook/journalCheckoutRecovery.js';
const code='NunY@69Ony@Son!@',hash=b=>createHash('sha256').update(b).digest('hex');
function ownerFixture(){
 const f=fixture();f.buyer.id='6a73da328a15629ec5373c25';f.buyer.email='gannonwayemusic@gmail.com';
 f.books[0].id='building-resilience';f.release.launchBookIds=[f.books[0].id];f.price.product.id='prod_ownerfixture';
 f.price.product.metadata.journal_book_id=f.books[0].id;
 Object.assign(f.session,{customer_email:f.buyer.email});
 Object.assign(f.session.metadata,{buyer_user_id:f.buyer.id,offer_id:f.books[0].id});
 Object.assign(f.rows.JournalBuyerDetails[0],{buyer_user_id:f.buyer.id,verified_email:f.buyer.email});
 f.refreshAcceptance();
 const actual={...structuredClone(f.price),id:'price_owneractual99',unit_amount:99};
 f.stripe.prices.retrieve=async id=>id===actual.id?actual:f.price;
 return Object.assign(f,{actual});
}
function ownerPaid(f){
 const {params}=journalCheckoutParams({catalogue:f.catalogue,user:f.buyer,offerId:f.books[0].id,origin:'https://gannonwaye.com',requestId:'synthetic_owner_request_123',ownerTestCode:code});
 Object.assign(f.session.metadata,params.metadata);
 f.session.amount_total=99;f.session.amount_subtotal=99;f.intent.amount_received=99;
 f.lines.data[0].price=f.actual.id;f.refreshAcceptance();
}
Deno.test('eligible existing verified music owner: pure quote99, no record/email/payment',async()=>{
 const f=ownerFixture(),r=await http(f,'createJournalCheckout',{action:'quote_owner_test',offer_id:[f.books[0].id],owner_test_code:code});
 assert.equal(r.status,200);assert.equal((await r.json()).total_cents,99);assert.equal(f.calls.create,0);assert.equal(f.calls.email,0);
});
for(const [name,change] of [
 ['personal owner email',f=>{f.buyer.id='69eb7905ca6eb4180010f795';f.buyer.email='ganozwaye@gmail.com';}],
 ['other user',f=>{f.buyer.id='other';f.buyer.email='other@example.invalid';}],
 ['same email foreign id',f=>{f.buyer.id='other';}],
 ['unverified identity',f=>{f.buyer.is_verified=false;}],
 ['disabled identity',f=>{f.buyer.disabled=true;}],
 ['service identity',f=>{f.buyer.is_service=true;}],
 ['foreign app identity',f=>{f.buyer.app_id='other';}]
])Deno.test(name+' cannot use owner discount',async()=>{
 const f=ownerFixture();change(f);assert.equal(ownerJournalTestEligible(f.buyer),false);
 const r=await http(f,'createJournalCheckout',{action:'quote_owner_test',offer_id:[f.books[0].id],owner_test_code:code});
 assert.equal(r.status,403);assert.equal(f.calls.create,0);assert.equal(f.calls.email,0);
});
Deno.test('invalid code, multi-title, bundle and held title cannot discount',()=>{
 const f=ownerFixture(),price=(offerId,ownerTestCode=code)=>journalPricedOffer({catalogue:f.catalogue,user:f.buyer,offerId,ownerTestCode});
 assert.throws(()=>price(f.books[0].id,'wrong'));
 assert.throws(()=>price([f.books[0].id,f.books[1].id]));
 assert.throws(()=>price(f.catalogue.bundleId));
 f.books[0].releaseApproved=false;assert.throws(()=>price(f.books[0].id));
});
Deno.test('ordinary owner purchase stays990; 99 without exact policy rejected',()=>{
 const f=ownerFixture();assert.equal(journalPricedOffer({catalogue:f.catalogue,user:f.buyer,offerId:f.books[0].id}).priceCents,990);
 verifyJournalPayment({catalogue:f.catalogue,user:f.buyer,session:f.session,paymentIntent:f.intent,liveMode:false});
 f.session.amount_total=99;f.session.amount_subtotal=99;f.intent.amount_received=99;
 assert.throws(()=>verifyJournalPayment({catalogue:f.catalogue,user:f.buyer,session:f.session,paymentIntent:f.intent,liveMode:false}));
});
Deno.test('provider gets99 on same bound product; base990 price remains unchanged',async()=>{
 const f=ownerFixture();let created;
 f.stripe.checkout.sessions.create=async params=>{created=params;return {id:'synthetic'};};
 const {params}=journalCheckoutParams({catalogue:f.catalogue,user:f.buyer,offerId:f.books[0].id,origin:'https://gannonwaye.com',requestId:'synthetic_owner_request_123',ownerTestCode:code});
 await createJournalStripe(f.stripe,false,{catalogue:f.catalogue,sha256:hash}).checkout.sessions.create(params,{idempotencyKey:'synthetic'});
 assert.deepEqual(created.line_items,[{price_data:{currency:'aud',unit_amount:99,product:'prod_ownerfixture'},quantity:1}]);
 assert.equal(created.metadata.owner_test_discount,OWNER_JOURNAL_TEST_POLICY);
 assert.equal(f.price.unit_amount,990);assert.equal(created.allow_promotion_codes,undefined);assert.equal(created.discounts,undefined);
});
Deno.test('99 signed webhook persists exactly one99 order and email through replay',async()=>{
 const f=ownerFixture();ownerPaid(f);
 const first=await webhook(f);assert.equal(first.status,200);assert.equal((await first.json()).processed,true);
 const second=await webhook(f);assert.equal(second.status,200);
 assert.equal(f.rows.JournalPurchase.length,1);assert.equal(f.rows.JournalPurchase[0].total_cents,99);
 assert.equal(f.rows.JournalPurchase[0].delivery_status,'email_accepted');assert.equal(f.calls.email,1);
});
for(const [name,change] of [
 ['wrong policy',f=>{f.session.metadata.owner_test_discount='other';}],
 ['wrong promo binding',f=>{f.session.metadata.owner_test_promo_id='other';}],
 ['wrong total',f=>{f.session.amount_total=98;}],
 ['unexpected provider coupon',f=>{f.session.total_details={amount_discount:891};}],
 ['shipping',f=>{f.session.total_details={amount_shipping:1};}],
 ['tax',f=>{f.session.total_details={amount_tax:1};}],
 ['wrong intent amount',f=>{f.intent.amount_received=990;}],
 ['wrong inline price amount',f=>{f.actual.unit_amount=98;}],
 ['foreign actual product',f=>{f.actual.product.id='prod_foreign';}],
 ['bad actual hash',f=>{f.actual.product.metadata.journal_asset_sha256='0'.repeat(64);}],
 ['bad original price',f=>{f.price.unit_amount=99;}],
 ['wrong buyer',f=>{f.buyer.id='another';}]
])Deno.test('owner99 '+name+' grants no order/email',async()=>{
 const f=ownerFixture();ownerPaid(f);change(f);
 const r=await webhook(f);assert.ok(r.status>=400);assert.equal(f.rows.JournalPurchase.length,0);assert.equal(f.calls.email,0);
});
Deno.test('unaccepted owner quote cannot create checkout or bypass buyer acknowledgements',async()=>{
 const f=ownerFixture();const r=await http(f,'createJournalCheckout',{offer_id:[f.books[0].id],owner_test_code:code,expected_total_cents:99});
 assert.equal(r.status,400);assert.equal(f.calls.create,0);assert.equal(f.calls.email,0);
});
console.log('Synthetic owner-discount suite: no network, real checkout, order or customer email.');

Deno.test('owner99 pending990 conflicts instead of returning a payable full-price checkout',async()=>{
 const f=ownerFixture();f.session.status='open';f.session.payment_status='unpaid';
 f.rows.JournalCheckoutAttempt.push({buyer_user_id:f.buyer.id,stripe_session_id:f.session.id});
 const result=await startJournalCheckout({user:f.buyer,catalogue:f.catalogue,selectedIds:[f.books[0].id],ownerTestCode:code,expectedTotalCents:99,
  store:f.store(),stripe:f.stripe,resolveCatalogue:async()=>f.catalogue,liveMode:false,sha256:hash,verifyDeliverables:async()=>{}});
 assert.equal(result.status,'pending_selection_conflict');assert.equal(result.pending.totalCents,990);
 assert.equal(f.rows.JournalPurchase.length,0);
});
Deno.test('owner99 paid exact private PDF entitlement survives; another buyer cannot download',async()=>{
 const f=ownerFixture(),pdf=new TextEncoder().encode('%PDF-synthetic-owner-only');
 f.books[0].sha256=hash(pdf);f.price.product.metadata.journal_asset_sha256=hash(pdf);f.actual.product.metadata.journal_asset_sha256=hash(pdf);
 ownerPaid(f);
 const {fulfilJournalDownload}=await import('../staging/journal-commerce/functions/journalStripeWebhook/journalCommerce.js');
 const args={catalogue:f.catalogue,user:f.buyer,sessionId:f.session.id,bookId:f.books[0].id,retrieveSession:async()=>f.session,retrievePaymentIntent:async()=>f.intent,readPrivateFile:async()=>pdf,sha256:hash,liveMode:false};
 assert.deepEqual((await fulfilJournalDownload(args)).bytes,pdf);
 await assert.rejects(fulfilJournalDownload({...args,user:{id:'other',email:'other@example.invalid',is_verified:true}}));
});
