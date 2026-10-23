import assert from 'node:assert/strict';
import {createJournalReadinessHandler} from '../staging/journal-commerce/functions/journalRuntimeReadiness/readiness.js';
let passed=0;
for(const [user,auth,expected] of [[{role:'admin'},'',401],[{role:'user'},'Bearer fixture',403],[{role:'admin',disabled:true},'Bearer fixture',403],[{role:'admin',is_service:true},'Bearer fixture',403],[{role:'admin',app_id:'foreign'},'Bearer fixture',403]]){
 let touched=0;const handler=createJournalReadinessHandler({createClient:()=>({auth:{me:async()=>user}}),env:()=>{touched++;return 'must-not-read';},fetchImpl:()=>{throw Error('no provider');}});
 const r=await handler(new Request('https://fixture.invalid',{method:'POST',headers:{authorization:auth}}));assert.equal(r.status,expected);assert.equal(touched,0);passed++;
}
const secret='sk_test_SYNTHETIC_ONLY',pub='pk_test_SYNTHETIC_ONLY',wh='whsec_SYNTHETIC_ONLY';
const handler=createJournalReadinessHandler({createClient:()=>({auth:{me:async()=>({role:'admin',is_verified:true})}}),
 env:k=>({STRIPE_SECRET_KEY:secret,STRIPE_PUBLISHABLE_KEY:pub,STRIPE_WEBHOOK_SECRET:wh})[k],
 fetchImpl:async(url,options)=>{assert.equal(url,'https://api.stripe.com/v1/account');assert.equal(options.headers.Authorization,'Bearer '+secret);return Response.json({id:'acct_1TRr35ClJA0hGwhH',charges_enabled:true});}});
const r=await handler(new Request('https://fixture.invalid',{method:'POST',headers:{authorization:'Bearer fixture'}}));
const output=await r.text();assert.equal(r.status,200);assert.ok(!output.includes(secret)&&!output.includes(pub)&&!output.includes(wh));
assert.equal(JSON.parse(output).matchesObservedTestAccount,true);passed++;
console.log('PASS '+passed+' read-only admin readiness tests; no keys returned, no provider or data mutation.');
