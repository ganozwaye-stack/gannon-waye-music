import test from 'node:test';
import assert from 'node:assert/strict';
import { JOURNAL_POLICY, JOURNAL_APP_ID, JOURNAL_ABN } from '../../base44/shared/journalCommerce.js';
import { restoreJournalOwnership, planJournalPurchase } from '../../base44/shared/journalPurchaseRecovery.js';
const user = { id: 'buyer', email: 'buyer@example.com' };
const catalogue = { enabled: true, approvedVersion: 'v1', bundleEnabled: true,
  bundleId: 'all-six', bundlePriceCents: 4900, books: Array.from({length:6},(_,i) =>
    ({id:'book-'+i,title:'Book '+i,priceCents:990,fileUri:'private/test/'+i,sha256:'a'.repeat(64),releaseApproved:true})) };
function evidence() {
  return { session: {id:'cs_test_abcdefghijklmnop',livemode:false,mode:'payment',currency:'aud',
    status:'complete',payment_status:'paid',amount_total:990,amount_subtotal:990,
    customer_details:{email:user.email},payment_intent:'pi_fixture',
    metadata:{checkout_policy:JOURNAL_POLICY,app_id:JOURNAL_APP_ID,abn:JOURNAL_ABN,
      buyer_user_id:user.id,offer_id:'book-0',catalogue_version:'v1'}},
    intent:{id:'pi_fixture',status:'succeeded',livemode:false,currency:'aud',amount_received:990,
      latest_charge:{paid:true,status:'succeeded',disputed:false,refunded:false,amount_refunded:0}} };
}
const ref = {buyer_user_id:user.id,stripe_session_id:'cs_test_abcdefghijklmnop'};
async function restore({f=evidence(),references=[ref],retrieve}={}) {
  return restoreJournalOwnership({user,references,resolveCatalogue:async()=>catalogue,
    retrieveSession:retrieve|| (async()=>f.session),retrievePaymentIntent:async()=>f.intent,liveMode:false});
}
test('paid purchaser regains owned titles without another checkout', async()=>{
  const owned=await restore(); assert.deepEqual(owned.ownedBookIds,['book-0']);
  assert.equal(planJournalPurchase({catalogue,selectedIds:['book-0'],verifiedOwnedIds:owned.ownedBookIds}).status,'already_owned');
});
test('already purchased titles are excluded and changed selection requires confirmation',()=>{
  const plan=planJournalPurchase({catalogue,selectedIds:['book-0','book-1','book-2'],verifiedOwnedIds:['book-0']});
  assert.deepEqual(plan.bookIds,['book-1','book-2']); assert.equal(plan.totalCents,1980);
  assert.equal(plan.status,'selection_requires_confirmation');
});
test('whole set is A49 once; duplicate owned title is not charged as another copy',()=>{
  const ids=catalogue.books.map(b=>b.id);
  assert.equal(planJournalPurchase({catalogue,selectedIds:ids,verifiedOwnedIds:[],bundleRequested:true}).totalCents,4900);
  const plan=planJournalPurchase({catalogue,selectedIds:ids,verifiedOwnedIds:['book-0'],bundleRequested:true});
  assert.equal(plan.totalCents,4950); assert.equal(plan.status,'selection_requires_confirmation');
  assert.equal(plan.bookIds.length,5); // no invented upgrade discount
});
test('forged paid index cannot grant a download', async()=>{
  const f=evidence(); f.session.payment_status='unpaid';
  assert.deepEqual((await restore({f,references:[{...ref,payment_status:'paid'}]})).ownedBookIds,[]);
});
test('refunded purchaser no longer receives access',async()=>{
  const f=evidence(); f.intent.latest_charge.refunded=true;
  assert.deepEqual((await restore({f})).ownedBookIds,[]);
});
test('another buyer reference is excluded before Stripe lookup',async()=>{
  let calls=0;
  const result=await restore({references:[{...ref,buyer_user_id:'another'}],retrieve:async()=>{calls++;throw Error('should not retrieve');}});
  assert.deepEqual(result.ownedBookIds,[]); assert.equal(calls,0);
});
test('duplicate session references do not duplicate entitlements',async()=>{
  let calls=0; const f=evidence();
  const result=await restore({references:[ref,ref],retrieve:async()=>{calls++;return f.session;}});
  assert.deepEqual(result.ownedBookIds,['book-0']); assert.equal(result.purchases.length,1); assert.equal(calls,1);
});
test('Stripe outage fails closed instead of treating existing purchases as absent',async()=>{
  await assert.rejects(restore({retrieve:async()=>{throw Error('Stripe unavailable');}}),/Stripe unavailable/);
});
test('empty, unknown and duplicated selections are rejected',()=>{
  for(const selectedIds of [[],['missing'],['book-0','book-0']]) {
    assert.throws(()=>planJournalPurchase({catalogue,selectedIds,verifiedOwnedIds:[]}),/invalid_selection/);
  }
});
