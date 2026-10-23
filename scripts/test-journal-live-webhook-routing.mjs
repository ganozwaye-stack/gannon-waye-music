import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const root=new URL('../staging/journal-commerce/live-stripe-webhook/',import.meta.url);
const baseline=await readFile(new URL('deployed-entry.baseline.ts',root),'utf8');
const overlay=await readFile(new URL('entry.ts',root),'utf8');
const runtimeOverlay=overlay.replace(/catch \(error: any\)/g,'catch (error)').replace(/capture\.postProcessing!/g,'capture.postProcessing');
const restored=runtimeOverlay.replace("import {isJournalEvent,journalWebhook} from './journalAdapter.ts';\n",'')
 .replace("'./checkoutOrderCapture.js'","'../../shared/checkoutOrderCapture.js'")
 .replace('  const journalRequest=req.clone();\n','')
 .replace('  if (isJournalEvent(event)) return journalWebhook(journalRequest);\n\n','');
assert.equal(restored,baseline,'Every existing merchandise/refund/dispute line must remain unchanged');
const isJournalEvent=event=>event?.data?.object?.metadata?.checkout_policy==='gw_paid_journals_v1';
function fixture(){
 let handler,captures=0,diagnostics=0;const forwarded=[];
 const context={Response,Request,console,createClientFromRequest:()=>({}),
  createDiagnostic:async()=>{diagnostics++;},
  captureOrderFromSession:async()=>{captures++;return {outcome:'created',order:{id:'synthetic-merch'},postProcessing:{success:true}};},
  isJournalEvent,journalWebhook:async req=>{forwarded.push(await req.text());return Response.json({journal:true},{status:503});},
  Stripe:class {webhooks={constructEventAsync:async(raw,signature)=>{if(signature!=='synthetic-valid')throw Error('synthetic invalid signature');return JSON.parse(raw);}};},
  Deno:{env:{get:name=>name==='STRIPE_SECRET_KEY'?'sk_live_SYNTHETIC_NOT_A_KEY':'whsec_SYNTHETIC_NOT_A_KEY'},serve:value=>{handler=value;}}};
 const source=runtimeOverlay.replace(/^import[\s\S]*?from\s+['"][^'"]+['"];?\r?\n/gm,'');
 runInNewContext(source,context);
 const invoke=async(event,signature='synthetic-valid')=>{
  const raw=JSON.stringify(event),response=await handler(new Request('https://synthetic.invalid',{method:'POST',
   headers:{'stripe-signature':signature},body:raw}));return {response,raw,data:await response.json()};
 };
 return {invoke,forwarded,get captures(){return captures;},get diagnostics(){return diagnostics;}};
}
const checkout=policy=>({id:'evt_SYNTHETIC',type:'checkout.session.completed',data:{object:{id:'cs_test_ABCDEFGHIJKLMNOP',
 mode:'payment',currency:'aud',payment_status:'paid',amount_total:990,metadata:{checkout_policy:policy,abn:'22931809349'}}}});
let f=fixture(),r=await f.invoke(checkout('stage_one_owned_stock_v1'));
assert.equal(r.response.status,200);assert.equal(r.data.order_id,'synthetic-merch');assert.equal(f.captures,1);assert.equal(f.forwarded.length,0);
f=fixture();r=await f.invoke(checkout('gw_paid_journals_v1'));
assert.equal(r.response.status,503);assert.equal(f.captures,0);assert.deepEqual(f.forwarded,[r.raw]);
for(const type of ['charge.refunded','charge.dispute.created','payment_intent.payment_failed','payment_intent.succeeded']){
 f=fixture();r=await f.invoke({id:'evt_SYNTHETIC',type,data:{object:{id:'synthetic'}}});
 assert.equal(r.response.status,200);assert.equal(r.data.order_action,'not_applicable');assert.equal(f.captures,0);assert.equal(f.forwarded.length,0);
}
f=fixture();r=await f.invoke(checkout('gw_paid_journals_v1'),'invalid');
assert.equal(r.response.status,400);assert.equal(f.captures,0);assert.equal(f.forwarded.length,0);assert.equal(f.diagnostics,1);
f=fixture();r=await f.invoke(checkout('foreign-policy'));
assert.equal(r.data.reason,'checkout_not_owned_by_this_store');assert.equal(f.captures,0);assert.equal(f.forwarded.length,0);
console.log('PASS: live webhook runtime preserved after journal insertions/type-only annotations; merchandise and refund/dispute/failure routes preserved; signed raw body routing gated; synthetic only.');
