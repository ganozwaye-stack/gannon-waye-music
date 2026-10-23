import {JournalAccessError} from './journalCommerce.js';
const fail=code=>{throw new JournalAccessError(code,503);};
const immutable=['buyer_user_id','stripe_session_id','catalogue_version','offer_id','book_ids','total_cents','currency',
 'stripe_payment_intent_id','fulfilment_type','fulfilment_status','item_plan','preorder_terms_snapshot','asset_hashes','delivery_terms_version','buyer_details_id','terms_accepted_at'];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
// Base44 documents atomic predicate rechecks only for updateMany with one literal id.
// One pre-provisioned row serializes every journal paid-order writer across replicas.
// No lease expiry, automatic steal, or filter-then-create lock bootstrap is permitted.
export function createAtomicJournalOrderWriter({api,lockId,randomUUID=()=>crypto.randomUUID(),now=()=>Date.now()}){
 return async row=>{
  if(typeof lockId!=='string'||!lockId.trim()||typeof api?.JournalOrderLock?.updateMany!=='function')
   fail('order_storage_not_configured');
  const owner=randomUUID();
  const claim=await api.JournalOrderLock.updateMany({id:lockId,locked:false},
   {$set:{locked:true,owner,claimed_at:new Date(now()).toISOString()}});
  if(claim?.success!==true||claim.updated!==1||claim.has_more!==false)fail('order_writer_busy');
  // On ANY uncertain write/read, keep the durable lock. A timed-out database
  // write may still commit later. Operators must reconcile it before recovery.
  const lock=await api.JournalOrderLock.get(lockId);
  if(lock?.id!==lockId||lock.locked!==true||lock.owner!==owner)fail('order_lock_not_verified');
  const purchases=api.JournalPurchase;
  const existing=await purchases.filter({stripe_session_id:row.stripe_session_id},'-created_date',2);
  if(!Array.isArray(existing)||existing.length>1)fail('duplicate_order_records');
  if(existing.length){
   if(!existing[0].id)fail('order_readback_failed');
   for(const key of immutable)if(existing[0][key]!==undefined&&!same(existing[0][key],row[key]))fail('conflicting_order_record');
   // Legacy reference rows may be completed ONLY from freshly verified provider facts.
   if(immutable.some(key=>!same(existing[0][key],row[key]))){
    const facts=Object.fromEntries([...immutable,'verified_at'].filter(key=>row[key]!==undefined).map(key=>[key,row[key]]));
    await purchases.update(existing[0].id,facts);
   }
  }else await purchases.create(row);
  const saved=await purchases.filter({stripe_session_id:row.stripe_session_id},'-created_date',2);
  if(!Array.isArray(saved)||saved.length!==1||!saved[0].id)fail('order_readback_failed');
  for(const key of immutable)if(!same(saved[0][key],row[key]))fail('order_readback_failed');
  const released=await api.JournalOrderLock.updateMany({id:lockId,locked:true,owner},
   {$set:{locked:false,owner:'',claimed_at:''}});
  if(released?.success!==true||released.updated!==1||released.has_more!==false)fail('order_lock_release_unconfirmed');
  return saved[0];
 };
}
