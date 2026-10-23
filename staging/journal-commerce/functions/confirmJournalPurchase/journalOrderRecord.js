import {journalItemPlans,journalFulfilmentSummary,journalPreorderTerms,releasedJournalBook} from './journalFulfilment.js';
export async function persistVerifiedJournalOrder({store,buyer,session,catalogue,offer,now,releaseBindings={}}) {
 const intentId=typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent?.id;
 const items=journalItemPlans(catalogue,offer.bookIds),summary=journalFulfilmentSummary(items);
 const record={buyer_user_id:buyer.id,stripe_session_id:session.id,catalogue_version:catalogue.approvedVersion,
  offer_id:offer.id,book_ids:[...offer.bookIds].sort(),total_cents:offer.priceCents,currency:'aud',
  stripe_payment_intent_id:intentId,verified_at:new Date(now).toISOString(),
  fulfilment_type:summary.fulfilmentType,fulfilment_status:summary.fulfilmentStatus,item_plan:items,
  ...(summary.fulfilmentType!=='released'?{preorder_terms_snapshot:journalPreorderTerms(catalogue)}:{}),
  asset_hashes:Object.fromEntries(items.filter(p=>p.fulfilmentType==='released').map(p=>[p.bookId,p.sha256])),
  delivery_terms_version:catalogue.deliveryTermsVersion,buyer_details_id:session.metadata?.buyer_details_id,terms_accepted_at:session.metadata?.terms_accepted_at,delivery_status:'pending',release_delivery_revision:0,release_delivery:{}};
 await store.savePurchase(record);
 const rows=(await store.listPurchases(buyer.id)).filter(r=>r.stripe_session_id===session.id);
 if(rows.length!==1||!rows[0].id)throw new Error('Paid order persistence is not unique');
 for(const key of ['buyer_user_id','stripe_session_id','catalogue_version','offer_id','total_cents','currency',
  'stripe_payment_intent_id','fulfilment_type','fulfilment_status','item_plan','preorder_terms_snapshot','asset_hashes','delivery_terms_version','buyer_details_id','terms_accepted_at'])
  if(JSON.stringify(rows[0][key])!==JSON.stringify(record[key]))throw new Error('Paid order readback mismatch');
 if(JSON.stringify(rows[0].book_ids)!==JSON.stringify(record.book_ids))throw new Error('Paid SKU readback mismatch');
 const releasedItems=[];
 for(const item of items.filter(p=>p.fulfilmentType==='preorder')){
  try{const b=releasedJournalBook(catalogue,item.bookId,releaseBindings,now);releasedItems.push({bookId:b.id,editionVersion:b.editionVersion,sha256:b.sha256});}
  catch(e){if(e.code!=='journal_awaiting_release')throw e;}
 }
 const downloadableBookIds=[...summary.downloadableBookIds,...releasedItems.map(p=>p.bookId)];
 return {orderId:rows[0].id,...summary,releasedItems,downloadableBookIds,downloadReady:downloadableBookIds.length>0,
  deliveryStatus:rows[0].delivery_status||'pending'};
}
