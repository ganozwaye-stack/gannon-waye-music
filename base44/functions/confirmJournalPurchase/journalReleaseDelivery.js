import {JournalAccessError,requireJournalBuyer} from './journalCommerce.js';
import {releasedJournalBook} from './journalFulfilment.js';
const fail=code=>{throw new JournalAccessError(code,503);};
const escape=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function deliverJournalPreorderRelease({api,orderId,user,catalogue,releaseBindings,
 verifyPaidOrder,readPrivateFile,sha256,sendEmail,now=Date.now(),randomUUID=()=>crypto.randomUUID()}){
 const buyer=requireJournalBuyer(user);
 if(typeof verifyPaidOrder!=='function'||typeof sendEmail!=='function')fail('release_dependencies_not_configured');
 const paid=await verifyPaidOrder();
 if(paid?.status!=='paid'||paid.orderId!==orderId)fail('paid_order_not_verified');
 let order=await api.JournalPurchase.get(orderId);
 if(order?.buyer_user_id!==buyer.id||order.catalogue_version!==catalogue.approvedVersion||
  !Array.isArray(order.item_plan)||!Array.isArray(paid.bookIds)||
  JSON.stringify([...paid.bookIds].sort())!==JSON.stringify([...order.book_ids].sort())||
  !Number.isInteger(order.release_delivery_revision)||order.release_delivery_revision<0)fail('release_order_not_verified');
 const available=[];
 for(const plan of order.item_plan.filter(p=>p.fulfilmentType==='preorder')){
  const state=order.release_delivery?.[plan.bookId];
  if(state)continue;
  let book;try{book=releasedJournalBook(catalogue,plan.bookId,releaseBindings,now);}
  catch(e){if(e instanceof JournalAccessError&&e.code==='journal_awaiting_release')continue;throw e;}
  const bytes=await readPrivateFile(book.fileUri);
  if(!(bytes instanceof Uint8Array)||bytes.length<5||bytes.length>25*1024*1024||
   String.fromCharCode(...bytes.slice(0,5))!=='%PDF-'||await sha256(bytes)!==book.sha256)fail('journal_file_unavailable');
  available.push({...book,id:plan.bookId});
 }
 if(!available.length)return {releaseDeliveryStatus:'no_new_release'};
 const attempt=randomUUID(),revision=order.release_delivery_revision;
 const records={...(order.release_delivery||{})};
 for(const b of available)records[b.id]={status:'sending',attemptId:attempt,sha256:b.sha256,editionVersion:b.editionVersion};
 const claim=await api.JournalPurchase.updateMany({id:orderId,release_delivery_revision:revision},
  {$set:{release_delivery_revision:revision+1,release_delivery:records}});
 if(claim?.success!==true||claim.updated!==1||claim.has_more!==false)return {releaseDeliveryStatus:'not_claimed'};
 order=await api.JournalPurchase.get(orderId);
 if(available.some(b=>order?.release_delivery?.[b.id]?.attemptId!==attempt))fail('release_claim_not_verified');
 let accepted=false;
 const link='https://gannonwaye.com/journals/purchase?session_id='+encodeURIComponent(order.stripe_session_id);
 try{
  const response=await sendEmail({to:buyer.email,from_name:'Gannon Waye',subject:'Your preordered journal'+(available.length>1?'s are':' is')+' ready',
   body:'<p>Your preordered journal'+(available.length>1?'s are':' is')+' now ready.</p><p>Order reference: '+escape(orderId)+'</p><ul>'+
    available.map(b=>'<li>'+escape(b.title)+'</li>').join('')+'</ul><p><a href="'+escape(link)+'">Access your released journal'+(available.length>1?'s':'')+'</a></p>'+
    '<p>Sign in using the verified email address for this purchase.</p>'});
  accepted=response?.accepted===true;
 }catch{}
 for(let retry=0;retry<5;retry++){
  order=await api.JournalPurchase.get(orderId);
  if(!Number.isInteger(order?.release_delivery_revision)||
   available.some(b=>order.release_delivery?.[b.id]?.attemptId!==attempt||order.release_delivery[b.id].status!=='sending'))
   fail('release_record_unconfirmed');
  const finished={...order.release_delivery};
  for(const b of available)finished[b.id]={...finished[b.id],status:accepted?'email_accepted':'review_required',
   ...(accepted?{emailAcceptedAt:new Date(now).toISOString()}:{})};
  const result=await api.JournalPurchase.updateMany({id:orderId,release_delivery_revision:order.release_delivery_revision},
   {$set:{release_delivery_revision:order.release_delivery_revision+1,release_delivery:finished}});
  if(result?.success===true&&result.updated===1&&result.has_more===false){
   const saved=await api.JournalPurchase.get(orderId);
   if(available.some(b=>saved?.release_delivery?.[b.id]?.status!==(accepted?'email_accepted':'review_required')||
    saved.release_delivery[b.id].attemptId!==attempt))fail('release_record_unconfirmed');
   return {releaseDeliveryStatus:accepted?'email_accepted':'review_required',bookIds:available.map(b=>b.id)};
  }
 }
 fail('release_record_unconfirmed');
}
