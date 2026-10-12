import assert from 'node:assert/strict';
import {build} from 'esbuild';
const originalFetch=globalThis.fetch;globalThis.fetch=async()=>{throw new Error('Network forbidden');};
let handler,event,env={},verified=0,captured=0,outcome='created';const saved=new Map();
globalThis.Deno={serve:fn=>handler=fn,env:{get:key=>env[key]}};
globalThis.__mockSDK=()=>({});
globalThis.__mockStripe=class {constructor(){this.webhooks={constructEventAsync:async(raw,signature)=>{verified++;if(signature==='invalid')throw new Error('fixture invalid signature');return event;}};}};
globalThis.__mockCapture=async({session})=>{captured++;if(outcome==='persistence_failed')return {outcome,stage:'canonical_event',error:'fixture interrupted'};const existing=saved.get(session.id),order=existing||{id:'mock-order'};saved.set(session.id,order);return {outcome:existing?'duplicate':'created',order,postProcessing:{success:true}};};
const bundle=await build({entryPoints:['staging/website-analytics/functions/stripeWebhook/entry.ts'],bundle:true,write:false,platform:'neutral',format:'esm',external:['npm:*'],plugins:[{name:'mock-capture-only',setup(build){build.onLoad({filter:/checkoutOrderCapture\.js$/},()=>({contents:'export const captureOrderFromSession=(args)=>globalThis.__mockCapture(args);export const createDiagnostic=async()=>null;',loader:'js'}));}}],logLevel:'silent'});
let code=bundle.outputFiles[0].text.replace(/import Stripe from "npm:stripe@14\.21\.0";/,'const Stripe=globalThis.__mockStripe;').replace(/import \{ createClientFromRequest \} from "npm:@base44\/sdk@0\.8\.30";/,'const createClientFromRequest=globalThis.__mockSDK;');
assert.ok(!code.includes('from "npm:'));await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const req=signature=>new Request('http://localhost/fixture',{method:'POST',body:'{}',headers:signature?{'stripe-signature':signature}:{}});
assert.equal((await handler(req())).status,503);assert.equal(captured,0);
const session={id:'cs_test_ABCDEFGHIJKLMNOP',mode:'payment',currency:'aud',payment_status:'paid',amount_total:9900,metadata:{checkout_policy:'stage_one_owned_stock_v1',abn:'22931809349'}};
for(const mode of ['test','live']){
 env={VERIFIED_ORDER_CAPTURE_OPEN:'true',STRIPE_SECRET_KEY:'sk_'+mode+'_fixture',STRIPE_WEBHOOK_SECRET:'whsec_fixture'};
 assert.equal((await handler(req())).status,400);assert.equal(captured,0);
 assert.equal((await handler(req('invalid'))).status,400);assert.equal(captured,0);
}
env.STRIPE_SECRET_KEY='sk_test_fixture';
for(const type of ['checkout.session.completed','checkout.session.async_payment_succeeded']){
 event={id:'evt_fixture_'+type,type,data:{object:session}};
 const response=await handler(req('fixture-valid'));
 assert.equal(response.status,200);
 if(type.endsWith('async_payment_succeeded'))assert.equal((await response.json()).duplicate,true);
}
assert.equal(saved.size,1);assert.equal(captured,2);
event={id:'evt_unpaid',type:'checkout.session.async_payment_succeeded',data:{object:{...session,payment_status:'unpaid'}}};
assert.equal((await handler(req('fixture-valid'))).status,200);assert.equal(captured,2);
outcome='persistence_failed';event={id:'evt_interrupted',type:'checkout.session.completed',data:{object:{...session,id:'cs_test_ZYXWVUTSRQPONMLK'}}};
assert.equal((await handler(req('fixture-valid'))).status,500);assert.equal(saved.size,1);
globalThis.fetch=originalFetch;
console.log('PASS: closed gate, unsigned/invalid signatures in both modes, completed/delayed paid event dispatch, repeated same-session capture, unpaid denial and interrupted persistence. Signature verification and persistence are mocks; no Stripe-origin event or live writes.');
