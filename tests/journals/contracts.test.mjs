import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { build } from 'esbuild';

const schema=JSON.parse(await readFile(new URL('../../base44/entities/JournalPurchase.jsonc',import.meta.url),'utf8'));
test('purchase index has no client CRUD grant or public file fields',()=>{
  assert.deepEqual(schema.rls,{create:false,read:false,update:false,delete:false});
  assert.deepEqual(Object.keys(schema.properties).sort(),['buyer_user_id','catalogue_version','offer_id','stripe_session_id','verified_at']);
});
test('deployed schema source matches the reviewed restricted candidate',async()=>{
  const candidate=JSON.parse(await readFile(new URL('../../tools/journals/purchase-index.schema.candidate.jsonc',import.meta.url),'utf8'));
  assert.deepEqual(schema,candidate);
});

// Contract tests execute the staged adapter with dependency stubs.
// They do NOT exercise Base44 RLS, real accounts, Stripe or private object storage.
const temp=await mkdtemp(path.join(os.tmpdir(),'gw-journal-contract-'));
const entry=path.resolve('tools/journals/handlers.candidate.ts');
await build({entryPoints:[entry],outfile:path.join(temp,'handler.mjs'),bundle:true,platform:'node',format:'esm',
  plugins:[{name:'isolated-contract-dependencies',setup(b){
    b.onResolve({filter:/^npm:/},args=>({path:args.path,namespace:'contract'}));
    b.onLoad({filter:/.*/,namespace:'contract'},args=>({contents:args.path.includes('stripe')
      ? 'export default class Stripe { constructor(){this.checkout={sessions:{list:async()=>({data:[],has_more:false}),create:async()=>{globalThis.__GW_JOURNAL_CONTRACT__.stripeCalls++;throw Error("private/test-uri sk_test_DO_NOT_DISCLOSE");}}};} }'
      : 'export function createClientFromRequest(){return {asServiceRole:{entities:{JournalPurchase:{filter:async()=>[],upsert:async()=>({})},JournalCheckoutAttempt:{filter:async()=>[],upsert:async()=>({})}}},auth:{me:async()=>{globalThis.__GW_JOURNAL_CONTRACT__.authCalls++;return globalThis.__GW_JOURNAL_CONTRACT__.user;}}};}',
      loader:'js'}));
  }}]});
const {handleJournalRequest}=await import('file://'+path.join(temp,'handler.mjs'));
const originalDeno=globalThis.Deno;
function fixture({enabled=true,user={id:'contract-buyer',email:'buyer@example.invalid'}}={}){
  const state={user,authCalls:0,stripeCalls:0};
  globalThis.__GW_JOURNAL_CONTRACT__=state;
  const catalogue={enabled:true,approvedVersion:'contract-v1',bundleEnabled:true,bundleId:'all-six',bundlePriceCents:4900,
    books:Array.from({length:6},(_,i)=>({id:'book-'+i,title:'Book '+i,priceCents:990,fileUri:'private/contract/book-'+i,
      sha256:'a'.repeat(64),releaseApproved:true}))};
  const env={JOURNAL_PERSISTENCE_READY:'true',JOURNAL_COMMERCE_ENABLED:enabled?'true':undefined,
    JOURNAL_PRIVATE_CATALOGUE:JSON.stringify(catalogue),STRIPE_SECRET_KEY:'sk_test_contract_only'};
  globalThis.Deno={env:{get:key=>env[key]}};
  return state;
}
const request=body=>new Request('https://example.invalid/staged-handler',{method:'POST',
  headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
test('adapter rejects non-POST before authentication or Stripe',async()=>{
  const state=fixture();
  const response=await handleJournalRequest(new Request('https://example.invalid/staged-handler'),'checkout');
  assert.equal(response.status,405);assert.equal(state.authCalls,0);assert.equal(state.stripeCalls,0);
});
test('anonymous checkout and download fail before Stripe',async()=>{
  const state=fixture({user:null});
  for(const action of ['checkout','download','purchases','confirm','expire']){
    const response=await handleJournalRequest(request({}),action);
    assert.equal(response.status,401);assert.deepEqual(await response.json(),{error:'sign_in_required'});
  }
  assert.equal(state.stripeCalls,0);
});
test('authenticated caller cannot start checkout while server flag is held',async()=>{
  const state=fixture({enabled:false});
  const response=await handleJournalRequest(request({offer_id:'book-0'}),'checkout');
  assert.equal(response.status,503);assert.deepEqual(await response.json(),{error:'journals_not_ready'});
  assert.equal(state.stripeCalls,0);
});
test('client price mismatch requires confirmation before creating checkout',async()=>{
  const state=fixture();
  const response=await handleJournalRequest(request({offer_id:['book-0','book-1','book-2'],expected_total_cents:4900,request_id:'a'.repeat(36)}),'checkout');
  assert.equal(response.status,200);const data=await response.json();assert.equal(data.status,'selection_requires_confirmation');assert.equal(data.total_cents,2970);
  assert.equal(state.stripeCalls,0);
});
test('incomplete or duplicated bundle is rejected before Stripe',async()=>{
  const state=fixture();
  for(const ids of [['book-0'],Array(6).fill('book-0')]){
    const response=await handleJournalRequest(request({offer_id:ids,bundle_requested:true}),'checkout');
    assert.equal(response.status,400);assert.deepEqual(await response.json(),{error:'invalid_selection'});
  }
  assert.equal(state.stripeCalls,0);
});
test('adapter errors return only safe code and no private payload',async()=>{
  const state=fixture();
  const response=await handleJournalRequest(request({offer_id:'book-0',expected_total_cents:990,request_id:'a'.repeat(36)}),'checkout');
  assert.equal(response.status,503);assert.deepEqual(await response.json(),{error:'journals_unavailable'});
  assert.equal(response.headers.get('cache-control'),'private, no-store');
  assert.equal(state.stripeCalls,1); // Stub only; no network/Stripe request.
});
test.after(async()=>{
  globalThis.Deno=originalDeno;delete globalThis.__GW_JOURNAL_CONTRACT__;
  await rm(temp,{recursive:true,force:true});
});