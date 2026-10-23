import assert from 'node:assert/strict';
import {createJournalLaunchSetup,EDITIONS,APP_ID,ACCOUNT_ID} from '../staging/journal-commerce/functions/journalLaunchSetup/setup.js';
let writes=0;const stored=[];
const stripe={accounts:{retrieve:async()=>({id:ACCOUNT_ID,charges_enabled:true})},prices:{list:async()=>({data:stored,has_more:false}),retrieve:async id=>stored.find(p=>p.id===id),create:async(params,options)=>{writes++;assert.equal(params.unit_amount,990);assert.equal(params.currency,'aud');assert.ok(options.idempotencyKey.includes(params.product_data.metadata.journal_asset_sha256));assert.equal(params.recurring,undefined);const price={id:'price_fixture'+writes,created:writes,livemode:true,active:true,currency:'aud',type:'one_time',billing_scheme:'per_unit',unit_amount:990,product:{id:'prod_fixture'+writes,active:true,metadata:params.product_data.metadata}};stored.push(price);return price;}}};
const admin={id:'fixture-admin',email:'owner@example.invalid',role:'admin',is_verified:true,app_id:APP_ID};
const make=(user=admin,provider=stripe)=>createJournalLaunchSetup({createClient:()=>({auth:{me:async()=>user},asServiceRole:{}}),env:name=>name==='STRIPE_SECRET_KEY'?'sk_live_fixture':'pk_live_fixture',createStripe:()=>provider});
const req=(action,extra={})=>new Request('https://app.example.invalid/setup',{method:'POST',headers:{Authorization:'Bearer fixture'},body:JSON.stringify({action,...extra})});
let cases=0;
for(const user of [null,{...admin,is_verified:false},{...admin,role:'user'},{...admin,is_service:true},{...admin,app_id:'foreign'}]){assert.equal((await make(user)(req('preparePrices'))).status,403);assert.equal(writes,0);cases++;}
assert.equal((await make()(req('unknown'))).status,400);cases++;
assert.equal((await make(admin,{accounts:{retrieve:async()=>({id:'acct_foreign',charges_enabled:true})}})(req('preparePrices'))).status,503);assert.equal(writes,0);cases++;
let result=await (await make()(req('inspect'))).json();assert.equal(result.prices.filter(p=>p.ready).length,0);assert.equal(writes,0);cases++;
result=await(await make()(req('preparePrices'))).json();assert.equal(result.prices.length,2);assert.ok(result.prices.every(p=>p.ready&&p.unitAmount===990));assert.equal(result.checkoutEnabled,false);assert.equal(writes,2);cases++;
result=await(await make()(req('preparePrices'))).json();assert.ok(result.prices.every(p=>p.ready));assert.equal(writes,2);cases++;
stored[0].unit_amount=4900;assert.equal((await make()(req('inspect'))).status,200);assert.equal(writes,2);stored[0].unit_amount=990;cases++;
stored[0].livemode=false;assert.equal((await make()(req('inspect'))).status,503);stored[0].livemode=true;cases++;
assert.equal((await make()(req('testOwnerEmail'))).status,400);cases++;
assert.deepEqual(EDITIONS.map(b=>b.id),['building-resilience','healthy-boundaries']);assert.ok(stored.every(p=>!p.product.metadata.journal_bundle_id));cases++;
function lockFixture(mode='ok'){
 let row={id:'fixture-lock',locked:false,owner:''},releases=0;
 const api={JournalOrderLock:{list:async()=>[structuredClone(row)],get:async()=>structuredClone(row),updateMany:async(query,change)=>{if(change.$set.locked===true){if(mode==='multiple')return {success:true,updated:1,has_more:false};if(mode==='zero')return {success:true,updated:0,has_more:false};if(row.locked)return {success:true,updated:0,has_more:false};Object.assign(row,change.$set);return {success:true,updated:1,has_more:false};}releases++;if(mode==='uncertainRelease')throw Error('uncertain');Object.assign(row,change.$set);return {success:true,updated:1,has_more:false};}}};
 const handler=createJournalLaunchSetup({createClient:()=>({auth:{me:async()=>admin},asServiceRole:{entities:api}}),env:n=>n==='STRIPE_SECRET_KEY'?'sk_live_fixture':'pk_live_fixture',createStripe:()=>stripe,randomUUID:(()=>{let i=0;return()=> 'owner-'+(++i);})()});
 return {handler,get:()=>({row,releases})};
}
for(const mode of ['ok','zero','multiple','uncertainRelease']){const fixture=lockFixture(mode);const response=await fixture.handler(req('checkOrderLock'));assert.equal(response.status,mode==='ok'?200:503);const state=fixture.get();if(mode==='ok'){const result=await response.json();assert.equal(result.winners,1);assert.equal(result.contenders,8);assert.equal(state.row.locked,false);assert.equal(state.releases,1);}else if(mode==='uncertainRelease')assert.equal(state.row.locked,true);else assert.equal(state.releases,0);cases++;}
let emails=0;
const selfTest=createJournalLaunchSetup({createClient:()=>({auth:{me:async()=>admin},asServiceRole:{integrations:{Core:{SendEmail:async message=>{emails++;assert.equal(message.to,admin.email);assert.ok(message.subject.includes('test'));assert.ok(message.body.includes('No purchase or payment'));assert.equal(message.attachments,undefined);return {success:true};}}}}}),env:n=>n==='STRIPE_SECRET_KEY'?'sk_live_fixture':'pk_live_fixture',createStripe:()=>stripe});
const emailResult=await(await selfTest(req('testOwnerEmail',{confirmOneOwnerTest:true,to:'foreign@example.invalid'}))).json();assert.equal(emailResult.success,true);assert.equal(emails,1);cases++;
console.log('PASS admin launch setup:',cases,'synthetic cases; no network, email, payment or real provider mutation.');
