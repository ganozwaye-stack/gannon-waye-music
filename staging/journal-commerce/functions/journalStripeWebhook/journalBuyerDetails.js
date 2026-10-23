import {journalItemPlans,journalPreorderTerms} from './journalFulfilment.js';
import {journalOffer} from './journalCommerce.js';
import {JournalAccessError} from './journalCommerce.js';
import {JOURNAL_DELIVERY_TERMS_VERSION} from './journalDeliveryTerms.js';
const fail=code=>{throw new JournalAccessError(code,400);};
export function validateJournalBuyerDetails(input,buyer){
 const text=v=>typeof v==='string'?v.trim():'';
 const firstName=text(input?.first_name),lastName=text(input?.last_name);
 const dateOfBirth=text(input?.date_of_birth),phone=text(input?.phone),email=text(input?.email).toLowerCase();
 if(!firstName||!lastName||firstName.length>80||lastName.length>80||/[\u0000-\u001f]/.test(firstName+lastName))fail('first_and_last_name_required');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth))fail('valid_date_of_birth_required');
 const date=new Date(dateOfBirth+'T00:00:00Z');
 if(!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==dateOfBirth||date>Date.now()||date.getUTCFullYear()<1900)fail('valid_date_of_birth_required');
 if(!/^\+?[\d ()-]{8,25}$/.test(phone)||phone.replace(/\D/g,'').length<8||phone.replace(/\D/g,'').length>15)fail('valid_phone_required');
 if(email!==buyer.email)fail('verified_email_required');
 return {first_name:firstName,last_name:lastName,date_of_birth:dateOfBirth,phone,email};
}
export async function journalAcknowledgementFacts({catalogue,offerId,sha256}){
 if(!catalogue?.approvedVersion||typeof sha256!=='function')throw new JournalAccessError('purchase_terms_not_configured',503);
 const offer=journalOffer(catalogue,offerId),items=journalItemPlans(catalogue,offer.bookIds);
 const preorder=items.some(p=>p.fulfilmentType==='preorder')?journalPreorderTerms(catalogue):null;
 const digest=await sha256(new TextEncoder().encode(JSON.stringify({catalogueVersion:catalogue.approvedVersion,offerId:offer.id,
  items,preorder,deliveryTermsVersion:catalogue.deliveryTermsVersion})));
 return {catalogue_version:catalogue.approvedVersion,offer_id:offer.id,item_plan_sha256:digest,
  preorder_terms_version:preorder?.termsVersion||''};
}
export async function recordJournalBuyerAcknowledgements({api,buyer,body,catalogue,sha256,now=Date.now()}){
 if(body.purchase_rules_accepted!==true||body.self_help_acknowledged!==true||body.terms_version!==JOURNAL_DELIVERY_TERMS_VERSION)
  fail('purchase_acknowledgements_required');
 const details=validateJournalBuyerDetails(body.buyer_details,buyer);
 if(body.catalogue_version!==catalogue?.approvedVersion)fail('purchase_terms_changed');
 const facts=await journalAcknowledgementFacts({catalogue,offerId:body.bundle_requested===true?catalogue.bundleId:body.offer_id,sha256});
 const row=await api.JournalBuyerDetails.create({buyer_user_id:buyer.id,verified_email:buyer.email,
  first_name:details.first_name,last_name:details.last_name,date_of_birth:details.date_of_birth,phone:details.phone,
  purchase_rules_accepted:true,self_help_acknowledged:true,terms_version:JOURNAL_DELIVERY_TERMS_VERSION,
  accepted_at:new Date(now).toISOString(),...facts});
 if(!row?.id)throw new JournalAccessError('buyer_details_not_recorded',503);
 const saved=await api.JournalBuyerDetails.get(row.id);
 for(const key of ['buyer_user_id','verified_email','first_name','last_name','date_of_birth','phone','purchase_rules_accepted','self_help_acknowledged','terms_version','accepted_at',...Object.keys(facts)]){
  const expected={buyer_user_id:buyer.id,verified_email:buyer.email,...details,purchase_rules_accepted:true,self_help_acknowledged:true,terms_version:JOURNAL_DELIVERY_TERMS_VERSION,accepted_at:new Date(now).toISOString(),...facts}[key];
  if(saved?.[key]!==expected)throw new JournalAccessError('buyer_details_not_recorded',503);
 }
 return {id:row.id,termsVersion:JOURNAL_DELIVERY_TERMS_VERSION,acceptedAt:new Date(now).toISOString(),...facts};
}
export async function verifyJournalBuyerAcknowledgements({api,buyer,session,catalogue,sha256}){
 if(!catalogue.deliveryTermsVersion)return; // Preserve only explicitly versioned historical purchases.
 const m=session.metadata||{},row=await api.JournalBuyerDetails.get(m.buyer_details_id);
 if(row?.buyer_user_id!==buyer.id||row.verified_email!==buyer.email||row.purchase_rules_accepted!==true||
  row.self_help_acknowledged!==true||row.terms_version!==catalogue.deliveryTermsVersion||
  row.accepted_at!==m.terms_accepted_at||m.delivery_terms_version!==row.terms_version)
  throw new JournalAccessError('purchase_acknowledgements_not_verified',403);
 if(catalogue.deliveryTermsVersion==='gw_journal_mixed_delivery_v2_20261022'){
  const facts=await journalAcknowledgementFacts({catalogue,offerId:m.offer_id,sha256});
  if(Object.entries(facts).some(([key,value])=>row[key]!==value)||
   m.buyer_acceptance_sha256!==facts.item_plan_sha256||
   (facts.preorder_terms_version&&m.preorder_terms_version!==facts.preorder_terms_version))
   throw new JournalAccessError('purchase_acknowledgements_not_verified',403);
 }
}
