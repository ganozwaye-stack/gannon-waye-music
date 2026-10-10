import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
import {saveInterest} from '../src/lib/coachingInterestPolicy.js';

// Entirely local: no credentials, provider calls or real records.
const originalFetch=globalThis.fetch;
globalThis.fetch=async()=>{throw new Error('Network forbidden in readiness harness');};
let handler,sdkCalls=0,env={};
globalThis.Deno={serve:fn=>handler=fn,env:{get:key=>env[key]}};
globalThis.__readinessSDK=()=>{sdkCalls++;return {auth:{me:async()=>null},asServiceRole:{entities:{}}};};
const bundle=await build({entryPoints:['staging/coaching-interest/functions/submitCoachingInterest/entry.ts'],bundle:true,write:false,format:'esm',platform:'neutral',external:['npm:*'],logLevel:'silent'});
const code=bundle.outputFiles[0].text.replace(/import \{ createClientFromRequest \} from "npm:@base44\/sdk@0\.8\.53";/,'const createClientFromRequest=globalThis.__readinessSDK;');
assert.ok(!code.includes('from "npm:'),'SDK must be mocked');
await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const request=()=>new Request('http://localhost/readiness',{method:'POST',body:'{}'});
for(const flags of [
 {},
 {COACHING_INTEREST_OPEN:'true',COACHING_ABUSE_HASH_SECRET:'mock-only'},
 {COACHING_INTEREST_OPEN:'true',COACHING_MINOR_INTAKE_POLICY_APPROVED:'false',COACHING_ABUSE_HASH_SECRET:'mock-only'},
 {COACHING_INTEREST_OPEN:'true',COACHING_MINOR_INTAKE_POLICY_APPROVED:'true'},
]){
 env=flags;
 assert.equal((await handler(request())).status,503);
 assert.equal(sdkCalls,0,'closed or incomplete configuration must not reach SDK');
}
console.log('PASS: four missing/closed intake configurations reject before SDK access.');

// Characterization, NOT proof of a real database failure: two replicas with
// stale peer visibility each observe their own reservation. This exposes the
// assumption hidden by the earlier shared-array concurrency mock.
const input={first_name:'Mock',last_name:'Replica',date_of_birth:'2000-01-01',phone:'+61 400 123 456',email:'mock@example.invalid',support_wanted:'Local readiness fixture only.',consent_to_contact:true,website:'',submission_id:'00000000-0000-4000-8000-000000000090'};
const now=new Date('2026-10-10T12:00:00Z'), leads=[],reservations=[];
function replica(prefix){
 const local=[];
 return {
  CoachingSubmissionReceipt:{
   filter:async query=>local.filter(row=>Object.entries(query).every(([key,value])=>row[key]===value)),
   create:async data=>{const row={...data,id:prefix+'-receipt',created_date:now.toISOString()};local.push(row);reservations.push(row);return row;},
   update:async(id,data)=>Object.assign(local.find(row=>row.id===id),data),
  },
  CoachingLead:{create:async data=>{const row={...data,id:prefix+'-lead'};leads.push(row);return row;}},
 };
}
const results=await Promise.all([saveInterest(replica('A'),input,{now,hashEmail:async()=> 'b'.repeat(64)}),saveInterest(replica('B'),input,{now,hashEmail:async()=> 'b'.repeat(64)})]);
assert.equal(results.filter(result=>result.saved).length,2);
assert.equal(leads.length,2);
console.log('BLOCKER REPRODUCED IN MOCK: stale peer visibility permits two saved leads for one submission ID. Atomic uniqueness still required.');

const receiptSchema=JSON.parse(fs.readFileSync('staging/coaching-interest/entities/CoachingSubmissionReceipt.jsonc','utf8'));
assert.deepEqual(receiptSchema.rls.read,{user_condition:{role:'admin'}});
assert.ok(!JSON.stringify(receiptSchema).includes('unique'),'no schema uniqueness claim');
console.log('SOURCE GAP: staged receipt read policy is admin-wide; owner-only acceptance is not proven. No policy modified.');
globalThis.fetch=originalFetch;
