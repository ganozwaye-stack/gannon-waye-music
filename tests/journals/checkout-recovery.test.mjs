import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {journalAccountState,startJournalCheckout,confirmJournalReturn,cancelJournalCheckout} from '../../base44/shared/journalCheckoutRecovery.js';
import {JOURNAL_POLICY,JOURNAL_APP_ID,JOURNAL_ABN} from '../../base44/shared/journalCommerce.js';
const user={id:'contract-buyer',email:'buyer@example.invalid'},now=1800000000000;
const catalogue={enabled:true,approvedVersion:'v1',bundleEnabled:true,bundleId:'all-six',bundlePriceCents:4900,
 books:Array.from({length:6},(_,i)=>({id:'book-'+i,title:'Book '+i,priceCents:990,fileUri:'private/contract/'+i,sha256:'a'.repeat(64),releaseApproved:true}))};
const hash=async bytes=>createHash('sha256').update(bytes).digest('hex');
function fixture(){
 const purchases=[],attempts=[],sessions=new Map(),keys=new Map();let creates=0,saveFailure=false;
 const save=(rows,row)=>{const i=rows.findIndex(r=>r.stripe_session_id===row.stripe_session_id);if(i<0)rows.push({...row});else rows[i]={...row};};
 const store={listPurchases:async()=>purchases.map(r=>({...r})),listAttempts:async()=>attempts.map(r=>({...r})),
  savePurchase:async row=>save(purchases,row),saveAttempt:async row=>{if(saveFailure){saveFailure=false;throw Error('Persistence unavailable');}save(attempts,row);}};
 const stripe={findJournalSessions:async()=>[...sessions.values()],
  checkout:{sessions:{retrieve:async id=>{if(!sessions.has(id))throw Error('Stripe unavailable');return sessions.get(id);},
   expire:async id=>{const session=sessions.get(id);if(session?.status!=='open')throw Error('Not open');session.status='expired';return session;},
   create:async(params,{idempotencyKey})=>{
    const serial=JSON.stringify(params);
    if(keys.has(idempotencyKey)){
     const old=keys.get(idempotencyKey);if(old.serial!==serial)throw Error('Idempotency key already in use');
     return sessions.get(old.id);
    }
    const id='cs_test_'+String(++creates).padStart(20,'0'),total=params.line_items.reduce((n,i)=>n+i.price_data.unit_amount*i.quantity,0);
    const session={id,mode:'payment',livemode:false,currency:'aud',metadata:params.metadata,customer_email:params.customer_email,
     amount_total:total,amount_subtotal:total,status:'open',payment_status:'unpaid',expires_at:now/1000+1800,url:'https://checkout.stripe.com/c/pay/'+id};
    keys.set(idempotencyKey,{serial,id});sessions.set(id,session);return session;
   }}},
  paymentIntents:{retrieve:async id=>{const s=[...sessions.values()].find(s=>s.payment_intent===id);return {id,status:'succeeded',currency:'aud',livemode:false,amount_received:s.amount_total,
   latest_charge:{status:'succeeded',paid:true,disputed:false,refunded:Boolean(s.refunded),amount_refunded:s.refunded?s.amount_total:0}};}}};
 const args={user,catalogue,store,stripe,resolveCatalogue:async version=>{if(version!=='v1')throw Error('Unknown edition');return catalogue;},liveMode:false,sha256:hash,now};
 return {args,store,stripe,purchases,attempts,sessions,creates:()=>creates,failSave:()=>saveFailure=true,
  pay:id=>Object.assign(sessions.get(id),{status:'complete',payment_status:'paid',payment_intent:'pi_contract'+id.slice(-20)})};
}
const start=(f,ids=['book-0'],extra={})=>startJournalCheckout({...f.args,selectedIds:ids,expectedTotalCents:ids.length*990,...extra});
test('pending checkout persists and another device resumes without another session',async()=>{
 const f=fixture(),first=await start(f),second=await start(f);
 assert.equal(first.status,'checkout');assert.equal(second.status,'pending_checkout');
 assert.equal(second.checkout_url,first.checkout_url);assert.equal(f.creates(),1);assert.equal(f.attempts.length,1);
});
test('different selection is blocked while an unpaid checkout exists',async()=>{
 const f=fixture();await start(f);
 const result=await start(f,['book-1']);assert.equal(result.status,'pending_selection_conflict');assert.equal(f.creates(),1);
});
test('concurrent identical requests share the server idempotency key',async()=>{
 const f=fixture();const results=await Promise.all([start(f),start(f)]);
 assert.equal(results[0].checkout_url,results[1].checkout_url);assert.equal(f.creates(),1);
});
test('concurrent different baskets cannot create two sessions for one generation',async()=>{
 const f=fixture();const results=await Promise.allSettled([start(f),start(f,['book-1'])]);
 assert.equal(f.creates(),1);assert.ok(results.some(r=>r.status==='fulfilled'));
});
test('lost pending index write is recovered by Stripe lookup without another checkout',async()=>{
 const f=fixture();f.failSave();await assert.rejects(start(f),/Persistence unavailable/);
 const result=await start(f);assert.equal(result.status,'pending_checkout');assert.equal(f.creates(),1);
});
test('confirmed expired checkout derives a fresh deterministic generation',async()=>{
 const f=fixture(),first=await start(f);f.sessions.get(first.session_id).status='expired';
 const second=await start(f);assert.notEqual(second.session_id,first.session_id);assert.equal(f.creates(),2);
});
test('paid return records ownership and a repeat selection cannot charge again',async()=>{
 const f=fixture(),first=await start(f);f.pay(first.session_id);
 const result=await confirmJournalReturn({...f.args,sessionId:first.session_id});
 assert.equal(result.status,'paid');assert.deepEqual(result.bookIds,['book-0']);assert.equal(f.purchases.length,1);
 assert.equal((await start(f)).status,'already_owned');assert.equal(f.creates(),1);
});
test('existing ownership removes a book and requires review of the new total',async()=>{
 const f=fixture(),first=await start(f);f.pay(first.session_id);
 const result=await start(f,['book-0','book-1']);assert.equal(result.status,'selection_requires_confirmation');
 assert.deepEqual(result.bookIds,['book-1']);assert.equal(result.total_cents,990);assert.equal(f.creates(),1);
});
test('another account cannot confirm a real session reference',async()=>{
 const f=fixture(),first=await start(f);f.pay(first.session_id);
 await assert.rejects(confirmJournalReturn({...f.args,user:{id:'other',email:'other@example.invalid'},sessionId:first.session_id}),/purchase_not_found/);
 assert.equal(f.purchases.length,0);
});
test('refund invalidates return access and recovery',async()=>{
 const f=fixture(),first=await start(f);f.pay(first.session_id);f.sessions.get(first.session_id).refunded=true;
 await assert.rejects(confirmJournalReturn({...f.args,sessionId:first.session_id}),/payment_not_eligible/);
 assert.deepEqual((await journalAccountState(f.args)).ownedBookIds,[]);
});
test('persistence or complete Stripe discovery outage prevents new checkout',async()=>{
 for(const type of ['store','stripe']){
  const f=fixture();if(type==='store')f.store.listAttempts=async()=>{throw Error('Unavailable');};
  else f.stripe.findJournalSessions=async()=>{throw Error('Unavailable');};
  await assert.rejects(start(f),/Unavailable/);assert.equal(f.creates(),0);
 }
});
test('unpaid return has no purchase entitlement or paid record',async()=>{
 const f=fixture(),first=await start(f);
 assert.equal((await confirmJournalReturn({...f.args,sessionId:first.session_id})).status,'pending');
 assert.equal(f.purchases.length,0);
});

test('return resolves the purchased edition even when current catalogue advances',async()=>{
 const f=fixture(),first=await start(f);f.pay(first.session_id);
 const result=await confirmJournalReturn({...f.args,catalogue:{...catalogue,approvedVersion:'v2'},sessionId:first.session_id});
 assert.equal(result.status,'paid');assert.equal(f.purchases[0].catalogue_version,'v1');
});
test('unknown purchased edition blocks recovery and another checkout',async()=>{
 const f=fixture(),first=await start(f);f.sessions.get(first.session_id).metadata.catalogue_version='unknown';
 await assert.rejects(start(f),/Unknown edition/);assert.equal(f.creates(),1);
});
