// Server-owned preorder contract. No dates or buyer promises are inferred.
export function preorderContract(catalogue) {
 if(catalogue?.fulfilmentType!=='preorder') return null;
 const c=catalogue.preorder;
 if(c?.approved!==true||c.termsApproved!==true||!c.editionLabel?.trim()||
  !c.termsVersion?.trim()||!c.cancellationText?.trim()||!c.delayText?.trim()||
  !/^\d{4}-\d{2}-\d{2}T.*Z$/.test(c.deliveryBy||'')||!Number.isFinite(Date.parse(c.deliveryBy)))
  throw new Error('Preorder contract is not approved');
 return {editionLabel:c.editionLabel,deliveryBy:c.deliveryBy,termsVersion:c.termsVersion,
  cancellationText:c.cancellationText,delayText:c.delayText};
}
export function journalFulfilment(catalogue) {
 const c=preorderContract(catalogue);
 return c?{fulfilmentType:'preorder',fulfilmentStatus:'paid_pending_release',deliveryBy:c.deliveryBy,
  editionLabel:c.editionLabel,termsVersion:c.termsVersion,downloadReady:false}:
  {fulfilmentType:'released',fulfilmentStatus:'paid_release_verified',downloadReady:true};
}
export async function persistVerifiedJournalOrder({store,buyer,session,catalogue,offer,now}) {
 const intentId=typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent?.id;
 const delivery=journalFulfilment(catalogue);
 const record={buyer_user_id:buyer.id,stripe_session_id:session.id,catalogue_version:catalogue.approvedVersion,
  offer_id:offer.id,book_ids:[...offer.bookIds].sort(),total_cents:offer.priceCents,currency:'aud',
  stripe_payment_intent_id:intentId,verified_at:new Date(now).toISOString(),
  fulfilment_type:delivery.fulfilmentType,fulfilment_status:delivery.fulfilmentStatus,
  ...(delivery.deliveryBy?{delivery_by:delivery.deliveryBy,edition_label:delivery.editionLabel,terms_version:delivery.termsVersion}:{})};
 await store.savePurchase(record);
 const rows=(await store.listPurchases(buyer.id)).filter(r=>r.stripe_session_id===session.id);
 if(rows.length!==1||!rows[0].id)throw new Error('Paid order persistence is not unique');
 for(const key of ['buyer_user_id','stripe_session_id','catalogue_version','offer_id','total_cents','currency',
  'stripe_payment_intent_id','fulfilment_type','fulfilment_status'])
  if(rows[0][key]!==record[key])throw new Error('Paid order readback mismatch');
 if(JSON.stringify(rows[0].book_ids)!==JSON.stringify(record.book_ids))throw new Error('Paid SKU readback mismatch');
 return {orderId:rows[0].id,...delivery};
}
