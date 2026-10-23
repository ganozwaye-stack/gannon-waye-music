import {journalItemPlans} from '../staging/journal-commerce/functions/downloadJournal/journalFulfilment.js';
import assert from 'node:assert/strict';
import {runInNewContext} from 'node:vm';
import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createJournalHttpHandler,createJournalStripe,readBoundedBytes} from '../staging/journal-commerce/functions/downloadJournal/journalHttp.js';
import {JOURNAL_POLICY,JOURNAL_APP_ID,JOURNAL_ABN} from '../staging/journal-commerce/functions/downloadJournal/journalCommerce.js';
import {JOURNAL_DELIVERY_TERMS_VERSION} from '../staging/journal-commerce/functions/downloadJournal/journalDeliveryTerms.js';
const root=resolve('staging/journal-commerce/functions');
const bundleHashes=new Map();
const actions=['createJournalCheckout','getJournalPurchases','confirmJournalPurchase','cancelJournalCheckout','downloadJournal'];
for(const action of actions){
 const dir=resolve(root,action),entry=await readFile(resolve(dir,'entry.ts'),'utf8');
 assert.equal(JSON.parse(await readFile(resolve(dir,'function.jsonc'),'utf8')).name,action);
 assert.ok(entry.includes("createJournalHttpHandler('"+action+"'"));
 for(const filename of await readdir(dir)){
  if(!/\.(js|ts)$/.test(filename))continue;
  const source=await readFile(resolve(dir,filename),'utf8');
  if(filename!=='entry.ts'){const digest=createHash('sha256').update(source).digest('hex');if(bundleHashes.has(filename))assert.equal(digest,bundleHashes.get(filename));else bundleHashes.set(filename,digest);}
  for(const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)){
   const target=match[1];if(target.startsWith('npm:')){assert.match(target,/^npm:(?:@base44\/sdk@0\.8\.30|stripe@22\.6\.0)$/);continue;}
   const full=resolve(dirname(resolve(dir,filename)),target);assert.ok(full.startsWith(dir+'/'));await readFile(full);
  }
 }
 const {RELEASE_CONFIG}=await import('../staging/journal-commerce/functions/'+action+'/releaseConfig.js');
 assert.equal(typeof RELEASE_CONFIG.enabled,'boolean');
 const closedRelease={...RELEASE_CONFIG,enabled:false};
 const {createJournalHttpHandler:factory}=await import('../staging/journal-commerce/functions/'+action+'/journalHttp.js');
 let touched=0;const closed=factory(action,{release:closedRelease,createRequestClient:()=>{touched++;throw Error('must not initialize')}});
 assert.equal((await closed(new Request('https://example.invalid',{method:'POST',body:'{}'}))).status,503);assert.equal(touched,0);
 let captured;const {JournalAccessError}=await import('../staging/journal-commerce/functions/'+action+'/journalCommerce.js');
 runInNewContext(entry.replace(/^import .*;$/gm,'').replace('(bytes: BufferSource)','(bytes)').replace('(req:Request)','(req)').replace('(message:any)','(message)'),{createJournalHttpHandler:factory,RELEASE_CONFIG:closedRelease,JournalAccessError,createClientFromRequest:()=>{touched++;throw Error('SDK forbidden');},Stripe:class {constructor(){touched++;throw Error('Stripe forbidden');}},Deno:{env:{get:()=>{touched++;throw Error('Env forbidden');}},serve:handler=>{captured=handler;}},crypto,fetch:()=>{touched++;throw Error('Network forbidden');}});
 assert.equal((await captured(new Request('https://example.invalid',{method:'POST',body:'{}'}))).status,503);assert.equal(touched,0);
}
const pdf=new TextEncoder().encode('%PDF-synthetic fixture only');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const buyer={id:'fixture-buyer',email:'buyer@example.invalid',is_verified:true};
const books=Array.from({length:6},(_,i)=>({id:'fixture-book-'+i,title:'Fixture '+i,priceCents:990,releaseApproved:i===0,...(i===0?{fileUri:'private/fixture/approved-original.pdf',sha256:hash(pdf),stripePriceId:'price_fixturebook0'}:{})}));
const catalogue={enabled:true,deliveryTermsVersion:JOURNAL_DELIVERY_TERMS_VERSION,approvedVersion:'fixture-original-34-pages',books,bundleId:'fixture-bundle',bundlePriceCents:4500,bundleEnabled:false};
const release={enabled:true,launchBookIds:[books[0].id],liveMode:false,orderUniquenessVerified:true,orderLockId:'fixture-lock',emailDeliveryVerified:true,currentCatalogue:catalogue,catalogues:{[catalogue.approvedVersion]:catalogue},privateDownloadHosts:['private-fixture.example.invalid']};
function fixture(){
 const lock={id:'fixture-lock',locked:false,owner:''};
 const calls={auth:0,stripe:0,create:0,expire:0,sign:0,fetch:0},rows={JournalPurchase:[],JournalCheckoutAttempt:[],JournalBuyerDetails:[{id:'fixture-consent',buyer_user_id:buyer.id,verified_email:buyer.email,terms_version:JOURNAL_DELIVERY_TERMS_VERSION,accepted_at:'2026-10-22T00:00:00.000Z',purchase_rules_accepted:true,self_help_acknowledged:true}]};
 const session={id:'cs_test_ABCDEFGHIJKLMNOP',livemode:false,mode:'payment',currency:'aud',status:'complete',payment_status:'paid',amount_total:990,amount_subtotal:990,payment_intent:'pi_fixture',customer_email:buyer.email,metadata:{checkout_policy:JOURNAL_POLICY,app_id:JOURNAL_APP_ID,abn:JOURNAL_ABN,buyer_user_id:buyer.id,catalogue_version:catalogue.approvedVersion,buyer_details_id:'fixture-consent',terms_accepted_at:'2026-10-22T00:00:00.000Z',delivery_terms_version:JOURNAL_DELIVERY_TERMS_VERSION,offer_id:books[0].id},url:'https://checkout.stripe.com/fixture',expires_at:Math.floor(Date.now()/1000)+3600};
 const items=journalItemPlans(catalogue,[books[0].id]);
 const accepted=hash(new TextEncoder().encode(JSON.stringify({catalogueVersion:catalogue.approvedVersion,offerId:books[0].id,items,preorder:null,deliveryTermsVersion:catalogue.deliveryTermsVersion})));
 Object.assign(rows.JournalBuyerDetails[0],{catalogue_version:catalogue.approvedVersion,offer_id:books[0].id,item_plan_sha256:accepted,preorder_terms_version:''});
 session.metadata.buyer_acceptance_sha256=accepted;
 const intent={id:'pi_fixture',status:'succeeded',currency:'aud',livemode:false,amount_received:990,latest_charge:{paid:true,status:'succeeded',disputed:false,refunded:false,amount_refunded:0}};
 const client={auth:{me:async()=>{calls.auth++;return buyer;}},asServiceRole:{entities:Object.fromEntries(Object.keys(rows).map(entity=>[entity,{
  get:async id=>rows[entity].find(r=>r.id===id),
  updateMany:async(query,update)=>{const row=rows[entity].find(r=>Object.entries(query).every(([k,v])=>r[k]===v));if(row)Object.assign(row,update.$set);return {success:true,updated:row?1:0,has_more:false};},
  filter:async query=>rows[entity].filter(row=>Object.entries(query).every(([k,v])=>row[k]===v)),
  create:async row=>{const saved={...row,id:'fixture-row-'+rows[entity].length};rows[entity].push(saved);return saved},
  update:async(id,row)=>{Object.assign(rows[entity].find(r=>r.id===id),row);return row}
 }])),integrations:{Core:{CreateFileSignedUrl:async args=>{calls.sign++;assert.equal(args.file_uri,books[0].fileUri);assert.equal(args.expires_in,60);return {signed_url:'https://private-fixture.example.invalid/temporary-fixture'};}}}}};
 client.asServiceRole.entities.JournalOrderLock={
  get:async()=>({...lock}),
  updateMany:async(query,update)=>{const matches=Object.entries(query).every(([k,v])=>lock[k]===v);if(matches)Object.assign(lock,update.$set);return {success:true,updated:matches?1:0,has_more:false};}
 };
 const price={id:'price_fixturebook0',active:true,livemode:false,currency:'aud',type:'one_time',billing_scheme:'per_unit',unit_amount:990,recurring:null,custom_unit_amount:null,transform_quantity:null,product:{id:'prod_fixture',active:true,metadata:{app_id:JOURNAL_APP_ID,journal_policy:JOURNAL_POLICY,journal_book_id:books[0].id,journal_asset_sha256:hash(pdf)}}};
 const stripe={prices:{retrieve:async(id,options)=>{assert.equal(id,price.id);assert.deepEqual(options,{expand:['product']});return price;}},checkout:{sessions:{retrieve:async()=>session,listLineItems:async()=>({data:[{price:'price_fixturebook0',quantity:1}],has_more:false}),list:async()=>({data:[],has_more:false}),create:async(params,opts)=>{calls.create++;assert.equal(params.metadata.buyer_user_id,buyer.id);assert.equal(params.line_items[0].price,'price_fixturebook0');assert.ok(!params.line_items[0].price_data);assert.ok(opts.idempotencyKey);Object.assign(session,{status:'open',payment_status:'unpaid',metadata:params.metadata});return session;},expire:async()=>{calls.expire++;session.status='expired';return session;}}},paymentIntents:{retrieve:async()=>intent}};
 const deps={release,sendJournalEmail:async()=>({accepted:true}),createRequestClient:()=>client,createStripe:()=>{calls.stripe++;return stripe;},sha256:async bytes=>hash(bytes),fetchImpl:async(url,options)=>{calls.fetch++;assert.equal(options.redirect,'manual');return new Response(pdf);}};
 return {calls,rows,session,intent,client,stripe,deps,price};
}
function req(body={},headers={}){
 return new Request('https://function.example.invalid',{method:'POST',headers:{Authorization:'Bearer fixture-only','Content-Type':'application/json',...headers},body:JSON.stringify(body)});
}
async function run(action,f,body,headers){
 if(action==='createJournalCheckout')body={buyer_details:{first_name:'Fixture',last_name:'Buyer',date_of_birth:'1990-01-01',phone:'+61400000000',email:buyer.email},purchase_rules_accepted:true,self_help_acknowledged:true,terms_version:JOURNAL_DELIVERY_TERMS_VERSION,catalogue_version:catalogue.approvedVersion,...body};
 return createJournalHttpHandler(action,f.deps)(req(body,headers));}
let f=fixture(),response=await run('downloadJournal',f,{session_id:f.session.id,book_id:books[0].id,file_uri:'https://attacker.invalid'});
assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'application/pdf');assert.equal(response.headers.get('cache-control'),'private, no-store');assert.deepEqual(new Uint8Array(await response.arrayBuffer()),pdf);assert.equal(f.calls.sign,1);assert.equal(f.calls.fetch,1);
for(const change of [
 f=>{f.session.metadata.buyer_user_id='someone-else'},
 f=>{f.intent.latest_charge.refunded=true},
 f=>{f.session.amount_total=1},
 f=>{f.deps.release={...release,liveMode:true}},
]){
 f=fixture();change(f);response=await run('downloadJournal',f,{session_id:f.session.id,book_id:books[0].id});assert.ok(response.status>=400);assert.equal(f.calls.sign,0);assert.equal(f.calls.fetch,0);
}
f=fixture();response=await run('downloadJournal',f,{session_id:f.session.id,book_id:books[1].id});assert.equal(response.status,403);assert.equal(f.calls.sign,0);
f=fixture();response=await run('downloadJournal',f,{session_id:f.session.id,book_id:books[0].id},{Authorization:''});assert.equal(response.status,401);assert.equal(f.calls.auth,0);
f=fixture();response=await run('downloadJournal',f,{}, {Origin:'https://attacker.invalid'});assert.equal(response.status,403);assert.equal(f.calls.auth,0);
f=fixture();response=await run('downloadJournal',f,{padding:'x'.repeat(5000)});assert.equal(response.status,400);assert.equal(f.calls.stripe,0);
f=fixture();f.deps.release={...release,privateDownloadHosts:[]};response=await run('downloadJournal',f,{session_id:f.session.id,book_id:books[0].id});assert.equal(response.status,503);assert.equal(f.calls.sign,0);
f=fixture();f.client.asServiceRole.integrations.Core.CreateFileSignedUrl=async()=>({signed_url:'https://attacker.invalid/private'});response=await run('downloadJournal',f,{session_id:f.session.id,book_id:books[0].id});assert.equal(response.status,503);assert.equal(f.calls.fetch,0);
await assert.rejects(readBoundedBytes(new Response('123456'),5));
f=fixture();f.stripe.checkout.sessions.retrieve=async()=>{throw Error('private-sensitive-provider-error');};response=await run('downloadJournal',f,{session_id:f.session.id,book_id:books[0].id});assert.equal(response.status,503);assert.ok(!(await response.text()).includes('private-sensitive-provider-error'));
f=fixture();response=await run('createJournalCheckout',f,{offer_id:[books[0].id],bundle_requested:false,expected_total_cents:990,buyer_user_id:'forged'});assert.equal(response.status,200);assert.equal((await response.json()).status,'checkout');assert.equal(f.calls.create,1);
response=await run('createJournalCheckout',f,{offer_id:[books[0].id],expected_total_cents:990});assert.equal((await response.json()).status,'pending_checkout');assert.equal(f.calls.create,1);
f=fixture();f.rows.JournalPurchase.push({id:'fixture-row-legacy',buyer_user_id:buyer.id,stripe_session_id:f.session.id});response=await run('getJournalPurchases',f,{});assert.deepEqual((await response.json()).ownedBookIds,[books[0].id]);
response=await run('cancelJournalCheckout',f,{session_id:f.session.id});assert.equal((await response.json()).status,'paid');assert.equal(f.calls.expire,0);
f=fixture();response=await run('confirmJournalPurchase',f,{session_id:f.session.id});assert.equal((await response.json()).status,'paid');assert.equal(f.rows.JournalPurchase.length,1);
f=fixture();f.session.status='open';f.session.payment_status='unpaid';response=await run('cancelJournalCheckout',f,{session_id:f.session.id});assert.equal((await response.json()).status,'expired');assert.equal(f.calls.expire,1);
f=fixture();f.stripe.checkout.sessions.list=async()=>({data:[],has_more:true});response=await run('createJournalCheckout',f,{offer_id:[books[0].id],expected_total_cents:990});assert.equal(response.status,503);assert.equal(f.calls.create,0);
f=fixture();f.client.asServiceRole.entities.JournalPurchase.filter=async()=>{throw Error('Index offline');};response=await run('getJournalPurchases',f,{});assert.equal(response.status,503);
f=fixture();f.stripe.checkout.sessions=Object.create(f.stripe.checkout.sessions);response=await run('createJournalCheckout',f,{offer_id:[books[0].id],expected_total_cents:990});assert.equal((await response.json()).status,'checkout');response=await run('createJournalCheckout',f,{offer_id:[books[0].id],expected_total_cents:990});assert.equal((await response.json()).status,'pending_checkout');assert.equal(f.calls.create,1);
for(const change of [f=>{f.price.unit_amount=1},f=>{f.price.livemode=true},f=>{f.price.active=false},f=>{f.price.product.metadata.journal_asset_sha256='0'.repeat(64)},f=>{f.price.currency='usd'},f=>{f.price.type='recurring'}]){f=fixture();change(f);response=await run('createJournalCheckout',f,{offer_id:[books[0].id],expected_total_cents:990});assert.equal(response.status,503);assert.equal(f.calls.create,0);}
let pages=0;const scan=createJournalStripe({checkout:{sessions:{list:async()=>{pages++;return {data:[{id:'fixture-page-'+pages,metadata:{}}],has_more:true};}}}},false);await assert.rejects(scan.findJournalSessions({buyerId:buyer.id}));assert.equal(pages,50);
console.log('PASS: five standalone default-closed bundles; one approved original/5 held; authenticated exact-edition PDF HTTP delivery; buyer/payment/refund/mode/body/host/size gates; no signed URL leakage; checkout pending reuse; paid cancellation safe; complete pagination/unavailable index fail closed; existing edition-bound prices only, 6 invalid-price fixtures create no checkout, prototype SDK methods preserved. Synthetic only, zero external calls.');
