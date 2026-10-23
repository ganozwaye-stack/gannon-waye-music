import {JournalAccessError,verifyJournalDeliverables} from './journal/journalCommerce.js';
import {createPrivateFileReader,verifyJournalPrices} from './journal/journalHttp.js';
export const APP_ID='69eb7905ca6eb4180010f794';
export const ACCOUNT_ID='acct_1TRr2YEMr9QX7GBL';
const POLICY='gw_paid_journals_v1';
export const EDITIONS=[
 {id:'building-resilience',title:'Building Resilience',sha256:'9f8eea15b0d5ccca2e70f4a9d9b550492ba034205af82dd5d4a1ed3c662b7ab6',fileUri:'mp/private/'+APP_ID+'/572829079_BuildingResilience1.pdf',editionVersion:'11'},
 {id:'healthy-boundaries',title:'Healthy Boundaries',sha256:'2d5a05c79217cee7ddc978f91deae284703ef98250ab09bd042c98f3951bb53b',fileUri:'mp/private/'+APP_ID+'/9943b92dc_HealthyBoundaries.pdf',editionVersion:'10'}];
const held=['choosing-yourself','knowing-your-worth','working-with-people-pleasing','healing-after-toxic-relationships'];
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
function fail(code){throw Object.assign(Error(code),{safeCode:code});}
function catalogue(prices){return {enabled:true,approvedVersion:'gw_br11_hb10_singles_20261022',bundleId:'six-journal-bundle',bundleEnabled:false,bundlePriceCents:4500,books:[...EDITIONS.map(b=>({...b,priceCents:990,releaseApproved:true,stripePriceId:prices.find(p=>p.bookId===b.id)?.priceId})),...held.map(id=>({id,title:id,priceCents:990,releaseApproved:false,preorderApproved:false}))]};}
export function createJournalLaunchSetup({createClient,env,createStripe,fetchImpl=fetch,randomUUID=()=>crypto.randomUUID()}){
 return async req=>{
  if(req.method!=='POST')return json({error:'method_not_allowed'},405);
  if(!/^Bearer\s+\S+$/i.test(req.headers.get('authorization')||''))return json({error:'sign_in_required'},401);
  let client,user;try{client=createClient(req);user=await client.auth.me();}catch{return json({error:'sign_in_required'},401);}
  if(user?.role!=='admin'||user.is_verified!==true||user.disabled===true||user.is_service===true||(user.app_id&&user.app_id!==APP_ID))return json({error:'verified_admin_required'},403);
  let input;try{const text=await req.text();if(text.length>2048)return json({error:'invalid_request'},400);input=JSON.parse(text);}catch{return json({error:'invalid_request'},400);}
  const action=input?.action;
  if(!['inspect','preparePrices','checkOrderLock','testOwnerEmail','verifyFiles','probeFiles'].includes(action))return json({error:'invalid_action'},400);
  const key=env('STRIPE_SECRET_KEY')||'',pub=env('STRIPE_PUBLISHABLE_KEY')||'';
  if(!key.startsWith('sk_live_')||!pub.startsWith('pk_live_'))return json({error:'expected_live_binding_missing'},503);
  const checkedAt=new Date().toISOString();
  try{
   const stripe=createStripe(key),account=await stripe.accounts.retrieve();
   if(account?.id!==ACCOUNT_ID||account.charges_enabled!==true)fail('expected_live_account_not_ready');
   if(action==='verifyFiles'||action==='probeFiles'){
    let stage='private_signer',signedKeys=[],fetchStatus=null,redirectHost=null;
    try{
     const verified=[],core={CreateFileSignedUrl:async args=>{stage='private_signer';const result=await client.asServiceRole.integrations.Core.CreateFileSignedUrl(args);signedKeys=result&&typeof result==='object'?Object.keys(result):[];stage='signed_response';return result;}};
     const reader=createPrivateFileReader({core,fetchImpl:async(...args)=>{stage='private_fetch';const response=await fetchImpl(args[0],action==='probeFiles'?{...args[1],redirect:'manual'}:args[1]);fetchStatus=response.status;const location=response.headers.get('location');if(location){try{redirectHost=new URL(location,args[0]).hostname;}catch{redirectHost='invalid';}}stage='private_body';return response;},allowedHosts:['media.base44.com']});
     const sha256=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
     await verifyJournalDeliverables({catalogue:catalogue([]),bookIds:EDITIONS.map(b=>b.id),sha256,readPrivateFile:async uri=>{const bytes=await reader(uri),book=EDITIONS.find(b=>b.fileUri===uri);stage='pdf_hash';verified.push({bookId:book.id,bytes:bytes.byteLength,sha256:await sha256(bytes)});return bytes;}});
     return json({version:'gw_journal_launch_setup_v1',checkedAt,action,accountId:account.id,files:verified,verified:true,probeOnly:action==='probeFiles'});
    }catch(error){return json({error:error instanceof JournalAccessError?error.code:'private_reader_unavailable',checkedAt,action,stage,signedKeys,fetchStatus,redirectHost,providerStatus:error?.response?.status||error?.status||null,errorType:error?.name||'Error',failureKind:/redirect/i.test(String(error?.message))?'redirect':/certificate|ssl|tls/i.test(String(error?.message))?'tls':/dns|resolve|lookup/i.test(String(error?.message))?'dns':/timeout|abort/i.test(String(error?.message))?'timeout':/invalid.*url|url.*invalid/i.test(String(error?.message))?'invalid_url':/fetch|network|connect/i.test(String(error?.message))?'transport':'unknown'},503);}
   }
   if(action==='testOwnerEmail'){
    if(input.confirmOneOwnerTest!==true||typeof user.email!=='string'||!user.email.includes('@'))return json({error:'owner_test_confirmation_required'},400);
    const reference='gw_delivery_test_'+randomUUID();
    const receipt=await client.asServiceRole.integrations.Core.SendEmail({to:user.email,from_name:'Gannon Waye',subject:'Gannon Waye journal delivery test',body:'This is a technical delivery test requested while preparing the journal checkout. No purchase or payment has been made.\n\nReference: '+reference+'\n\nYour protected journal account: https://gannonwaye.com/journals/account\n\nNo private PDF is attached and no access is granted by this test.'});
    return json({version:'gw_journal_launch_setup_v1',checkedAt,action,accountId:account.id,reference,responseKeys:receipt&&typeof receipt==='object'?Object.keys(receipt):[],responseType:typeof receipt,accepted:receipt?.accepted===true,success:receipt?.success===true,status:typeof receipt?.status==='string'?receipt.status.slice(0,60):null,message:typeof receipt?.message==='string'?receipt.message.slice(0,160):null});
   }
   if(action==='checkOrderLock'){
    const api=client.asServiceRole.entities;
    let rows=await api.JournalOrderLock.list('-created_date',3);
    if(!Array.isArray(rows)||rows.length>1)fail('order_lock_inventory_requires_review');
    let row=rows[0];
    if(!row){row=await api.JournalOrderLock.create({locked:false,owner:'',claimed_at:''});rows=await api.JournalOrderLock.list('-created_date',3);if(!Array.isArray(rows)||rows.length!==1||rows[0].id!==row.id)fail('order_lock_inventory_requires_review');}
    if(!row.id||row.locked!==false||row.owner!=='')fail('order_lock_requires_reconciliation');
    const owners=Array.from({length:8},()=>randomUUID());
    const replies=await Promise.all(owners.map(owner=>api.JournalOrderLock.updateMany({id:row.id,locked:false},{$set:{locked:true,owner,claimed_at:checkedAt}})));
    const won=replies.flatMap((r,i)=>r?.success===true&&r.updated===1&&r.has_more===false?[i]:[]);
    if(won.length!==1||replies.some(r=>r?.success!==true||r.has_more!==false||![0,1].includes(r.updated)))fail('order_atomic_claim_unverified');
    const locked=await api.JournalOrderLock.get(row.id),winner=owners[won[0]];
    if(locked?.id!==row.id||locked.locked!==true||locked.owner!==winner)fail('order_atomic_readback_failed');
    const released=await api.JournalOrderLock.updateMany({id:row.id,locked:true,owner:winner},{$set:{locked:false,owner:'',claimed_at:''}});
    if(released?.success!==true||released.updated!==1||released.has_more!==false)fail('order_atomic_release_unconfirmed');
    const readback=await api.JournalOrderLock.get(row.id);
    if(readback?.id!==row.id||readback.locked!==false||readback.owner!=='')fail('order_atomic_release_unconfirmed');
    return json({version:'gw_journal_launch_setup_v1',checkedAt,action,accountId:account.id,orderLockId:row.id,contenders:8,winners:1,readbackVerified:true,unlocked:true});
   }
   const existing=[];let cursor,complete=false;
   for(let page=0;page<20;page++){
    const response=await stripe.prices.list({active:true,currency:'aud',type:'one_time',limit:100,expand:['data.product'],...(cursor?{starting_after:cursor}:{})});
    if(!Array.isArray(response?.data)||typeof response.has_more!=='boolean')fail('price_inventory_unavailable');
    existing.push(...response.data);if(!response.has_more){complete=true;break;}
    const next=response.data.at(-1)?.id;if(!next||next===cursor)fail('price_inventory_unavailable');cursor=next;
   }
   if(!complete)fail('price_inventory_incomplete');
   const prices=[];
   for(const book of EDITIONS){
    const candidates=existing.filter(p=>p.product?.metadata?.app_id===APP_ID&&p.product?.metadata?.journal_policy===POLICY&&p.product?.metadata?.journal_book_id===book.id&&p.product?.metadata?.journal_asset_sha256===book.sha256&&p.unit_amount===990).sort((a,b)=>a.created-b.created||a.id.localeCompare(b.id));
    let price=candidates[0];
    if(!price&&action==='preparePrices')price=await stripe.prices.create({currency:'aud',unit_amount:990,billing_scheme:'per_unit',product_data:{name:book.title+' — digital journal',metadata:{app_id:APP_ID,journal_policy:POLICY,journal_book_id:book.id,journal_asset_sha256:book.sha256}},expand:['product']},{idempotencyKey:'gw_journal_990_'+book.id+'_'+book.sha256});
    if(!price){prices.push({bookId:book.id,ready:false});continue;}
    const binding={bookId:book.id,priceId:price.id};
    const snapshot=catalogue([...prices,binding]);
    await verifyJournalPrices({stripe:{prices:{retrieve:(...args)=>stripe.prices.retrieve(...args)}},catalogue:snapshot,params:{metadata:{offer_id:book.id},line_items:[{price:price.id,quantity:1}]},liveMode:true,sha256:async()=>''});
    prices.push({...binding,ready:true,unitAmount:990,currency:'aud',editionVersion:book.editionVersion,sha256:book.sha256});
   }
   return json({version:'gw_journal_launch_setup_v1',checkedAt,action,accountId:account.id,liveMode:true,prices,checkoutEnabled:false});
  }catch(error){return json({error:error?.safeCode||'launch_setup_unavailable',checkedAt,action},503);}
 };
}
