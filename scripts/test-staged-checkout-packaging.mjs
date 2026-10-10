import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
import {pathToFileURL} from 'node:url';
const root='staging/website-analytics/functions/';
let handler, sdkCalls=0, stripeCalls=0;
const env=new Map();
globalThis.Deno={serve:fn=>handler=fn,env:{get:name=>env.get(name)}};
globalThis.__draftSDK=()=>{sdkCalls++;return {};};
globalThis.__draftStripe=class {constructor(){stripeCalls++;this.checkout={sessions:{retrieve:async()=>globalThis.__mockSession}};}};
const originalFetch=globalThis.fetch;
globalThis.fetch=async()=>{throw new Error('Real network is forbidden in this mock harness');};
const request=(method='POST',body={})=>new Request('http://localhost/draft',{method,...(method==='GET'?{}:{body:JSON.stringify(body)})});
for(const name of ['createCheckoutSession','stripeWebhook','verifyCheckoutSession']){
 const source=fs.readFileSync(root+name+'/entry.ts','utf8');
 assert.ok(!source.includes('../../shared/'),'function entry must stay inside its package');
 const bundle=await build({entryPoints:[root+name+'/entry.ts'],bundle:true,write:false,format:'esm',platform:'neutral',external:['npm:*'],logLevel:'silent'});
 let code=bundle.outputFiles[0].text
  .replace(/import Stripe from "npm:stripe@14\.21\.0";/,'const Stripe=globalThis.__draftStripe;')
  .replace(/import \{ createClientFromRequest \} from "npm:@base44\/sdk@0\.8\.30";/,'const createClientFromRequest=globalThis.__draftSDK;');
 assert.ok(!code.includes('from "npm:'),'all SDK/Stripe dependencies must be mocked');
 await import('data:text/javascript;base64,'+Buffer.from(code+'\n//'+name).toString('base64'));
 const response=await handler(request());
 assert.equal(response.status,503);
 assert.equal(sdkCalls,0);assert.equal(stripeCalls,0);
 if(name==='stripeWebhook'){
  env.set('VERIFIED_ORDER_CAPTURE_OPEN','true');env.set('STRIPE_SECRET_KEY','sk_live_mock_only');env.set('STRIPE_WEBHOOK_SECRET','whsec_mock_only');
  assert.equal((await handler(request())).status,400);
  assert.equal(sdkCalls,1);assert.equal(stripeCalls,1);
  env.clear();sdkCalls=0;stripeCalls=0;
 }
 if(name==='verifyCheckoutSession'){
  env.set('VERIFIED_ORDER_CAPTURE_OPEN','true');
  assert.equal((await handler(request('GET'))).status,405);
  assert.equal((await handler(request('POST',{session_id:'invalid'}))).status,400);
  assert.equal(sdkCalls,0);assert.equal(stripeCalls,0);
  env.set('STRIPE_SECRET_KEY','sk_test_mock_only');
  const owned={id:'cs_test_ABCDEFGHIJKLMNOP',mode:'payment',currency:'aud',amount_total:9900,status:'complete',payment_status:'paid',metadata:{checkout_policy:'stage_one_owned_stock_v1',abn:'22931809349'}};
  for(const changes of [{currency:'usd'},{mode:'subscription'},{metadata:{checkout_policy:'foreign_store',abn:'22931809349'}},{metadata:{checkout_policy:'stage_one_owned_stock_v1',abn:'other'}}]){
   globalThis.__mockSession={...owned,...changes};
   assert.equal((await handler(request('POST',{session_id:owned.id}))).status,404);
  }
  globalThis.__mockSession={...owned,payment_status:'unpaid'};
  const unpaid=await handler(request('POST',{session_id:owned.id}));
  assert.equal(unpaid.status,200);assert.equal((await unpaid.json()).order_recorded,false);
  assert.equal(sdkCalls,0);assert.equal(stripeCalls,5);
  env.clear();stripeCalls=0;
 }
}
const shared=fs.readFileSync('staging/website-analytics/shared/checkoutOrderCapture.js');
const attribution=fs.readFileSync('staging/website-analytics/shared/websiteAnalyticsPolicy.js');
for(const name of ['stripeWebhook','verifyCheckoutSession']){
 assert.deepEqual(fs.readFileSync(root+name+'/checkoutOrderCapture.js'),shared);
 assert.deepEqual(fs.readFileSync(root+name+'/websiteAnalyticsPolicy.js'),attribution);
}
const {captureOrderFromSession}=await import(pathToFileURL(process.cwd()+'/staging/website-analytics/functions/stripeWebhook/checkoutOrderCapture.js').href);
const rows={},calls=[];
const entities=new Proxy({}, {get:(_,name)=>({
 filter:async query=>(rows[name]||[]).filter(row=>Object.entries(query).every(([key,value])=>row[key]===value)),
 create:async data=>{const list=rows[name]||=[];const row={...data,id:name+'_'+(list.length+1),created_date:new Date().toISOString()};list.push(row);return row;},
 update:async(id,data)=>{const row=(rows[name]||[]).find(row=>row.id===id);Object.assign(row,data);return row;},
})});
const base44={asServiceRole:{entities,functions:{invoke:async(name)=>{calls.push(name);return {data:{success:true}};}}}};
const session={id:'cs_test_fake',currency:'aud',amount_total:9900,customer_details:{email:'fake@example.invalid',name:'Mock Buyer'},metadata:{customer_name:'Mock Buyer',checkout_policy:'stage_one_owned_stock_v1',items:JSON.stringify([{product_id:'fake',product_name:'Mock item',price:99,quantity:1,category:'digital'}]),gw_first_source:'instagram',gw_first_medium:'social',gw_first_campaign:'journals',gw_last_source:'tiktok',gw_last_medium:'social',gw_last_campaign:'launch',email:'IGNORED_PRIVATE'}};
const first=await captureOrderFromSession({base44,session,event:{id:'evt_fake',type:'checkout.session.completed'},process:false});
assert.equal(first.outcome,'created');
assert.equal(rows.MerchOrder.length,1);
assert.equal(first.order.payment_verified,true);
assert.equal(first.order.attribution.first.source,'instagram');
assert.equal(first.order.attribution.last.source,'tiktok');
assert.ok(!JSON.stringify(first.order.attribution).includes('IGNORED_PRIVATE'));
assert.equal(rows.StripeEventLog.length,1);assert.equal(rows.IdempotenceLog.length,1);
rows.MerchOrder[0].inventory_adjusted=true;
const repeat=await captureOrderFromSession({base44,session,event:{id:'evt_fake',type:'checkout.session.completed'},process:false});
assert.equal(repeat.outcome,'duplicate');assert.equal(rows.MerchOrder.length,1);
assert.equal(calls.filter(name=>name==='sendSlackAlert').length,1);
const incomplete=await captureOrderFromSession({base44,session:{...session,id:'cs_incomplete',metadata:{}},event:{id:'evt_incomplete'},process:false});
assert.equal(incomplete.outcome,'incomplete_metadata');assert.equal(rows.MerchOrder.length,1);
globalThis.fetch=originalFetch;
console.log('Three isolated function bundles compile; default closed gates precede SDK/Stripe; missing live webhook signatures, invalid references, foreign-store and unpaid sessions are rejected before capture. Mock paid capture preserves sanitized first/last attribution, canonical records, duplicate retry and incomplete metadata handling. All entity/notification/processor actions are in-memory mocks; no live payment or messages.');
