import {journalItemPlans,journalPreorderTerms} from './journalFulfilment.js';
import {JournalAccessError} from './journalCommerce.js';
const fail=code=>{throw new JournalAccessError(code,503);};
export async function deliverJournalEmail({api,orderId,buyer,catalogue,sendEmail,randomUUID=()=>crypto.randomUUID(),now=()=>Date.now()}){
 const read=()=>api.JournalPurchase.get(orderId);
 let order=await read();
 if(order?.id!==orderId||order.buyer_user_id!==buyer.id||!['released','mixed','preorder'].includes(order.fulfilment_type)||
  order.catalogue_version!==catalogue.approvedVersion||!Array.isArray(order.book_ids))fail('delivery_order_not_verified');
 if(order.delivery_status==='email_accepted')return {deliveryStatus:'email_accepted'};
 if(order.delivery_status!=='pending')return {deliveryStatus:'review_required'};
 if(typeof sendEmail!=='function')fail('email_transport_not_configured');
 const books=order.book_ids.map(id=>catalogue.books.find(b=>b.id===id));
 const items=journalItemPlans(catalogue,order.book_ids);
 if(JSON.stringify(items)!==JSON.stringify(order.item_plan))fail('delivery_edition_not_verified');
 if(items.some(p=>p.fulfilmentType==='preorder')&&
  JSON.stringify(journalPreorderTerms(catalogue))!==JSON.stringify(order.preorder_terms_snapshot))fail('delivery_terms_not_verified');
 if(books.some(b=>!b||(b.releaseApproved===true&&b.sha256!==order.asset_hashes?.[b.id])))fail('delivery_edition_not_verified');
 const attempt=randomUUID();
 const claim=await api.JournalPurchase.updateMany({id:orderId,delivery_status:'pending'},
  {$set:{delivery_status:'sending',delivery_attempt_id:attempt}});
 if(claim?.success!==true||claim.updated!==1||claim.has_more!==false){
  order=await read();return {deliveryStatus:order?.delivery_status==='email_accepted'?'email_accepted':'review_required'};
 }
 const link='https://gannonwaye.com/journals/purchase?session_id='+encodeURIComponent(order.stripe_session_id);
 let accepted=false;
 try{
  const response=await sendEmail({to:buyer.email,from_name:'Gannon Waye',subject:'Your Gannon Waye journal order',
   body:['Thank you for your purchase.','Order reference: '+orderId,'',
    ...books.map(b=>{const p=items.find(p=>p.bookId===b.id);return b.title+' — '+(p.fulfilmentType==='released'?'Ready to download':('Preorder: '+p.releaseLabel));}),
    '','Access your journal'+(books.length>1?'s':''),link,
    ...(items.some(p=>p.fulfilmentType==='preorder')?['','Undelivered preorders: '+order.preorder_terms_snapshot.cancellationText]:[]),
    '','Sign in with the email address used for this purchase to download your PDF. This link does not grant access to another account.'].join('\n')});
  accepted=response?.accepted===true;
 }catch{}
 if(!accepted){
  await api.JournalPurchase.updateMany({id:orderId,delivery_status:'sending',delivery_attempt_id:attempt},
   {$set:{delivery_status:'review_required'}});
  return {deliveryStatus:'review_required'};
 }
 const result=await api.JournalPurchase.updateMany({id:orderId,delivery_status:'sending',delivery_attempt_id:attempt},
  {$set:{delivery_status:'email_accepted',email_accepted_at:new Date(now()).toISOString()}});
 if(result?.success!==true||result.updated!==1||result.has_more!==false)fail('email_record_unconfirmed');
 order=await read();
 if(order?.delivery_status!=='email_accepted'||order.delivery_attempt_id!==attempt)fail('email_record_unconfirmed');
 return {deliveryStatus:'email_accepted'};
}
