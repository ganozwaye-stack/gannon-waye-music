import {isJournalPrivateUri} from './journalPrivateUri.js';
import {journalAssetBindings,journalItemPlan} from './journalFulfilment.js';
import {recordJournalBuyerAcknowledgements,verifyJournalBuyerAcknowledgements} from './journalBuyerDetails.js';
import {JOURNAL_DELIVERY_TERMS_VERSION} from './journalDeliveryTerms.js';
import {deliverJournalEmail} from './journalEmailDelivery.js';
import {createAtomicJournalOrderWriter} from './journalOrderLock.js';
import {JournalAccessError,requireJournalBuyer,validateJournalCatalogue,fulfilJournalDownload,verifyJournalDeliverables,JOURNAL_POLICY,JOURNAL_APP_ID,journalOffer,journalPricedOffer,ownerJournalTestEligible,ownerJournalTestMetadata} from './journalCommerce.js';
import {journalAccountState,startJournalCheckout,confirmJournalReturn,cancelJournalCheckout} from './journalCheckoutRecovery.js';
const fail=(code,status=503)=>{throw new JournalAccessError(code,status);};
const MAX_PDF_BYTES=25*1024*1024;
export const secureHeaders={'Cache-Control':'private, no-store','Pragma':'no-cache','Vary':'Authorization','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
export async function readBoundedBytes(response,maxBytes){
 const header=response.headers.get('content-length');
 if(header!==null&&(!/^\d+$/.test(header)||Number(header)>maxBytes))fail('journal_file_unavailable');
 if(!response.body)fail('journal_file_unavailable');
 const reader=response.body.getReader(),parts=[];let size=0;
 try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();fail('journal_file_unavailable');}parts.push(value);}}
 finally{reader.releaseLock();}
 const result=new Uint8Array(size);let offset=0;for(const part of parts){result.set(part,offset);offset+=part.byteLength;}return result;
}
export function createPrivateFileReader({core,fetchImpl,allowedHosts}){
 return async fileUri=>{
  if(!Array.isArray(allowedHosts)||!allowedHosts.length||!isJournalPrivateUri(fileUri))fail('private_storage_not_configured');
  const signed=await core.CreateFileSignedUrl({file_uri:fileUri,expires_in:60});
  let url;try{url=new URL(signed?.signed_url);}catch{fail('journal_file_unavailable');}
  if(url.protocol!=='https:'||url.username||url.password||url.port||!allowedHosts.includes(url.hostname))fail('journal_file_unavailable');
  const response=await fetchImpl(url.href,{redirect:'manual',signal:AbortSignal.timeout(15000)});
  if(!response.ok||response.redirected===true)fail('journal_file_unavailable');
  return readBoundedBytes(response,MAX_PDF_BYTES);
 };
}
export function createJournalStore(client,{orderLockId,randomUUID,now}={}){
 const api=client.asServiceRole.entities;
 async function list(entity,buyerId){const rows=await api[entity].filter({buyer_user_id:buyerId},'-created_date',101);if(!Array.isArray(rows)||rows.length>100)fail('purchase_recovery_unavailable');return rows;}
 async function save(entity,row){
  const existing=await api[entity].filter({buyer_user_id:row.buyer_user_id,stripe_session_id:row.stripe_session_id},'-created_date',2);
  if(!Array.isArray(existing))fail('purchase_recovery_unavailable');
  if(existing.length>1)fail('duplicate_order_records');
  if(existing.length){
   for(const key of ['buyer_user_id','stripe_session_id','catalogue_version','offer_id','total_cents','currency','stripe_payment_intent_id'])
    if(existing[0][key]!==undefined&&existing[0][key]!==row[key])fail('conflicting_order_record');
   return api[entity].update(existing[0].id,row);
  }
  return api[entity].create(row);
 }
 return {listPurchases:id=>list('JournalPurchase',id),listAttempts:id=>list('JournalCheckoutAttempt',id),savePurchase:createAtomicJournalOrderWriter({api,lockId:orderLockId,randomUUID,now}),saveAttempt:row=>save('JournalCheckoutAttempt',row)};
}
export async function verifyJournalPrices({stripe,catalogue,params,liveMode,sha256,requireActive=true,discountedLineItems=false}){
 const offer=journalOffer(catalogue,params.metadata?.offer_id);
 const ownerTest=ownerJournalTestMetadata(params.metadata);
 if(ownerTest&&(offer.bundle||offer.bookIds.length!==1||offer.priceCents!==990||
  !['building-resilience','healthy-boundaries'].includes(offer.bookIds[0])||
  catalogue.books.find(b=>b.id===offer.bookIds[0])?.releaseApproved!==true))fail('owner_discount_not_eligible',403);
 const verified=[];
 const expected=offer.bundle?[{id:catalogue.bundleStripePriceId,cents:4500,bundle:true}]:
  offer.bookIds.map(id=>({id:catalogue.books.find(book=>book.id===id).stripePriceId,cents:990,book:catalogue.books.find(book=>book.id===id)}));
 if(!Array.isArray(params.line_items)||params.line_items.length!==expected.length)fail('journal_price_unavailable');
 for(let i=0;i<expected.length;i++){
  const binding=expected[i],item=ownerTest&&discountedLineItems?params.line_items[0]:params.line_items.find(x=>x.price===binding.id);
  if(!item||(!ownerTest||!discountedLineItems)&&params.line_items.filter(x=>x.price===binding.id).length!==1)fail('journal_price_unavailable');
  if(item.quantity!==1||((!ownerTest||!discountedLineItems)&&item.price!==binding.id)||item.price_data||!/^price_[A-Za-z0-9]+$/.test(binding.id||''))fail('journal_price_unavailable');
  const price=await stripe.prices.retrieve(binding.id,{expand:['product']});
  const product=price?.product,m=product?.metadata||{};
  if(ownerTest&&discountedLineItems){
   if(!/^price_[A-Za-z0-9]+$/.test(item.price||''))fail('journal_price_unavailable');
   const actual=await stripe.prices.retrieve(item.price,{expand:['product']});
   if(!/^prod_[A-Za-z0-9]+$/.test(product?.id||'')||actual?.id!==item.price||
    actual.livemode!==liveMode||actual.currency!=='aud'||actual.type!=='one_time'||
    actual.billing_scheme!=='per_unit'||actual.unit_amount!==99||actual.recurring||actual.custom_unit_amount||actual.transform_quantity||
    actual.product?.id!==product.id||actual.product?.deleted===true||
    actual.product?.metadata?.app_id!==JOURNAL_APP_ID||actual.product?.metadata?.journal_policy!==JOURNAL_POLICY||
    actual.product?.metadata?.journal_book_id!==binding.book.id||actual.product?.metadata?.journal_asset_sha256!==binding.book.sha256)fail('journal_price_unavailable');
  }
  verified.push(price);
  if(price?.id!==binding.id||(requireActive&&price.active!==true)||price.livemode!==liveMode||price.currency!=='aud'||
   price.type!=='one_time'||price.billing_scheme!=='per_unit'||price.unit_amount!==binding.cents||
   price.recurring||price.custom_unit_amount||price.transform_quantity||
   !product||typeof product!=='object'||(requireActive&&product.active!==true)||product.deleted===true||
   m.app_id!==JOURNAL_APP_ID||m.journal_policy!==JOURNAL_POLICY)fail('journal_price_unavailable');
  if(binding.bundle){
   const digest=await sha256(new TextEncoder().encode(JSON.stringify(journalAssetBindings(catalogue,offer.bookIds))));
   if(m.journal_bundle_id!==catalogue.bundleId||
    m.journal_asset_set_sha256!==digest)fail('journal_price_unavailable');
  }else {
   if(m.journal_book_id!==binding.book.id)fail('journal_price_unavailable');
   const plan=journalItemPlan(catalogue,binding.book);
   if(plan.fulfilmentType==='released'){
    if(m.journal_asset_sha256!==binding.book.sha256)fail('journal_price_unavailable');
   }else if(m.journal_preorder_contract!==catalogue.approvedVersion||
    m.journal_delivery_date!==plan.releaseDate||m.journal_terms_version!==plan.termsVersion||
    m.journal_preorder_plan_sha256!==await sha256(new TextEncoder().encode(JSON.stringify(journalAssetBindings(catalogue,[binding.book.id])))))fail('journal_price_unavailable');
  }
 }
 return verified;
}
export function createJournalStripe(stripe,liveMode,{catalogue,sha256,resolveCatalogue}={}){
 const checkout={sessions:{retrieve:async(...args)=>{
  const session=await stripe.checkout.sessions.retrieve(...args);
  if(session.status==='complete'&&session.payment_status==='paid'){
   const snapshot=session.metadata?.catalogue_version===catalogue?.approvedVersion?catalogue:await resolveCatalogue?.(session.metadata?.catalogue_version);
   if(!snapshot||typeof stripe.checkout.sessions.listLineItems!=='function')fail('paid_line_items_unavailable');
   const lines=await stripe.checkout.sessions.listLineItems(session.id,{limit:7});
   if(!Array.isArray(lines?.data)||lines.has_more!==false)fail('paid_line_items_unavailable');
   await verifyJournalPrices({stripe,catalogue:snapshot,params:{metadata:session.metadata,line_items:lines.data.map(x=>({price:typeof x.price==='string'?x.price:x.price?.id,quantity:x.quantity}))},liveMode,sha256,requireActive:false,discountedLineItems:true});
  }
  return session;
 },list:(...args)=>stripe.checkout.sessions.list(...args),expire:(...args)=>stripe.checkout.sessions.expire(...args),create:async(params,options)=>{
  const prices=await verifyJournalPrices({stripe,catalogue,params,liveMode,sha256,requireActive:true});
  if(ownerJournalTestMetadata(params.metadata)){
   const productId=prices[0]?.product?.id;
   if(params.customer_email!=='gannonwayemusic@gmail.com'||!/^prod_[A-Za-z0-9]+$/.test(productId||''))fail('owner_discount_not_eligible',403);
   params={...params,line_items:[{price_data:{currency:'aud',unit_amount:99,product:productId},quantity:1}]};
  }
  return stripe.checkout.sessions.create(params,options);
 }}};
 return {checkout,paymentIntents:stripe.paymentIntents,
  async findJournalSessions({buyerId}){
   if(typeof buyerId!=='string'||!buyerId)fail('purchase_recovery_unavailable');
   const found=[];let cursor;
   // Checkout Sessions has no metadata-search method. Paginate actual list API;
   // a capped or failed scan must never become "no previous purchase".
   for(let page=0;page<50;page++){
    const result=await stripe.checkout.sessions.list({limit:100,...(cursor?{starting_after:cursor}:{})});
    if(!Array.isArray(result?.data)||typeof result.has_more!=='boolean')fail('purchase_recovery_unavailable');
    for(const session of result.data){const m=session.metadata||{};if(m.buyer_user_id===buyerId&&m.checkout_policy===JOURNAL_POLICY&&m.app_id===JOURNAL_APP_ID&&session.livemode===liveMode)found.push(session);}
    if(found.length>100)fail('purchase_recovery_unavailable');
    if(!result.has_more)return found;
    const next=result.data.at(-1)?.id;if(!next||next===cursor)fail('purchase_recovery_unavailable');cursor=next;
   }
   fail('purchase_recovery_unavailable');
  }
 };
}
async function bodyJSON(req){
 let bytes;try{bytes=await readBoundedBytes(req,4096);}catch{fail('invalid_request',400);}
 try{const body=JSON.parse(new TextDecoder().decode(bytes));if(!body||typeof body!=='object'||Array.isArray(body))fail('invalid_request',400);return body;}catch{fail('invalid_request',400);}
}
export function createJournalHttpHandler(action,deps){
 return async req=>{
  try{
   if(req.method!=='POST')return Response.json({error:'method_not_allowed'},{status:405,headers:{...secureHeaders,Allow:'POST'}});
   const origin=req.headers.get('origin');if(origin&&origin!=='https://gannonwaye.com')fail('invalid_origin',403);
   // Closed before SDK, auth, Stripe, indexing or private-file access.
   const release=deps.release;if(release?.enabled!==true)fail('journals_not_ready');
   if(!/^Bearer\s+\S+$/i.test(req.headers.get('authorization')||''))fail('sign_in_required',401);
   const client=deps.createRequestClient(req);let user;try{user=await client.auth.me();}catch{fail('sign_in_required',401);}requireJournalBuyer(user);
   const body=await bodyJSON(req);
   const catalogue=release.currentCatalogue;validateJournalCatalogue(catalogue);
   if(typeof release.liveMode!=='boolean')fail('payment_mode_not_configured');
   if(release.orderUniquenessVerified!==true||!release.orderLockId)fail('order_storage_not_verified');
   const resolveCatalogue=async version=>{const snapshot=release.catalogues?.[version];if(!snapshot)fail('catalogue_unavailable');validateJournalCatalogue(snapshot);return snapshot;};
   const stripe=createJournalStripe(deps.createStripe(),release.liveMode,{catalogue,sha256:deps.sha256,resolveCatalogue}),store=createJournalStore(client,{orderLockId:release.orderLockId});
   const verifyAcknowledgements=({buyer,session,catalogue})=>verifyJournalBuyerAcknowledgements({api:client.asServiceRole.entities,buyer,session,catalogue,sha256:deps.sha256});
   const common={user,store,stripe,resolveCatalogue,resolveReleaseBindings:async version=>release.fulfilmentReleases?.[version]||{},liveMode:release.liveMode,verifyAcknowledgements};
   let result;
   if(action==='createJournalCheckout'){
    if(release.emailDeliveryVerified!==true)fail('email_delivery_not_verified');
    const requested=Array.isArray(body.offer_id)?body.offer_id:[body.offer_id];
    if(!Array.isArray(release.launchBookIds)||!requested.length||
     requested.some(id=>!release.launchBookIds.includes(id)))fail('journal_not_ready');
    if(catalogue.deliveryTermsVersion!==JOURNAL_DELIVERY_TERMS_VERSION)fail('delivery_terms_not_configured');
    if(body.owner_test_code){
     if(!ownerJournalTestEligible(user))fail('owner_discount_not_eligible',403);
     const promo=await client.asServiceRole.entities.PromoCode.get('6a16abb0198d4c5d294edc12');
     const expires=promo?.expires_at?Date.parse(promo.expires_at):null;
     if(promo?.id!=='6a16abb0198d4c5d294edc12'||promo.is_active!==true||promo.discount_percent!==90||
      promo.requires_approval!==true||promo.code!==body.owner_test_code||
      !Array.isArray(promo.approved_emails)||promo.approved_emails.length!==1||
      promo.approved_emails[0]?.trim().toLowerCase()!=='gannonwayemusic@gmail.com'||
      expires!==null&&(!Number.isFinite(expires)||expires<=Date.now())||
      promo.max_uses!==null&&promo.max_uses!==undefined&&(!Number.isFinite(promo.max_uses)||!Number.isFinite(promo.times_used)||promo.times_used>=promo.max_uses))
       fail('owner_discount_not_eligible',403);
    }
    if(body.action==='quote_owner_test'){
     const offer=journalPricedOffer({catalogue,user,offerId:body.offer_id,ownerTestCode:body.owner_test_code});
     if(!offer.ownerTestDiscount)fail('owner_discount_not_eligible',403);
     return Response.json({status:'owner_test_quote',total_cents:offer.priceCents,base_total_cents:offer.basePriceCents,percent:90},{headers:secureHeaders});
    }
    const acknowledgement=await recordJournalBuyerAcknowledgements({api:client.asServiceRole.entities,buyer:requireJournalBuyer(user),body,catalogue,sha256:deps.sha256});
    const verifyDeliverables=({catalogue,bookIds})=>verifyJournalDeliverables({catalogue,bookIds,
     readPrivateFile:createPrivateFileReader({core:client.asServiceRole.integrations.Core,fetchImpl:deps.fetchImpl,allowedHosts:release.privateDownloadHosts}),sha256:deps.sha256});
    result=await startJournalCheckout({...common,catalogue,selectedIds:body.offer_id,bundleRequested:body.bundle_requested===true,expectedTotalCents:body.expected_total_cents,ownerTestCode:body.owner_test_code,sha256:deps.sha256,verifyDeliverables,acknowledgement});
   }else if(action==='getJournalPurchases'){
    const state=await journalAccountState(common);result={purchases:state.purchases,pending:state.pending,ownedBookIds:state.ownedBookIds,buyer:{email:requireJournalBuyer(user).email,verified:true,ownerTestEligible:ownerJournalTestEligible(user)},offerTerms:{catalogueVersion:catalogue.approvedVersion,termsVersion:catalogue.deliveryTermsVersion,
     preorder:catalogue.preorder?.cancellationPolicyApproved===true?{approved:true,termsVersion:catalogue.preorder.termsVersion,cancellationText:catalogue.preorder.cancellationText}:null}};
   }else if(action==='confirmJournalPurchase')result=await confirmJournalReturn({...common,sessionId:body.session_id});
   else if(action==='cancelJournalCheckout')result=await cancelJournalCheckout({...common,sessionId:body.session_id});
   else if(action==='downloadJournal'){
    // Resolve the immutable purchased edition rather than today's catalogue.
    if(!/^cs_(?:test|live)_[A-Za-z0-9]{16,200}$/.test(body.session_id||''))fail('invalid_reference',400);
    const paidOrder=await confirmJournalReturn({...common,sessionId:body.session_id});
    if(paidOrder.status!=='paid'||!paidOrder.orderId)fail('paid_order_required',403);
    const session=await stripe.checkout.sessions.retrieve(body.session_id);
    const purchasedCatalogue=await resolveCatalogue(session?.metadata?.catalogue_version);
    const download=await fulfilJournalDownload({catalogue:purchasedCatalogue,user,sessionId:body.session_id,bookId:body.book_id,
     retrieveSession:async()=>session,retrievePaymentIntent:id=>stripe.paymentIntents.retrieve(id,{expand:['latest_charge']}),
     readPrivateFile:createPrivateFileReader({core:client.asServiceRole.integrations.Core,fetchImpl:deps.fetchImpl,allowedHosts:release.privateDownloadHosts}),
     sha256:deps.sha256,liveMode:release.liveMode,releaseBindings:release.fulfilmentReleases?.[purchasedCatalogue.approvedVersion]||{}});
    return new Response(download.bytes,{headers:{...secureHeaders,'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="'+download.filename+'"'}});
   }else fail('unknown_action',404);
   if(result?.status==='paid'&&release.emailDeliveryVerified===true){
    const snapshot=await resolveCatalogue((await stripe.checkout.sessions.retrieve(result.sessionId)).metadata.catalogue_version);
    // The paid entitlement is already verified here. An email transport or
    // record failure is delivery pending review, never a payment failure;
    // a paid order must never be reported as an unconfirmed payment.
    let delivery;
    try{delivery=await deliverJournalEmail({api:client.asServiceRole.entities,orderId:result.orderId,buyer:requireJournalBuyer(user),
     catalogue:snapshot,sendEmail:deps.sendJournalEmail});}
    catch(error){delivery={deliveryStatus:'review_required',delivery_error:error instanceof JournalAccessError?error.code:'email_transport_unavailable'};}
    result={...result,...delivery};
   }
   return Response.json(result,{headers:secureHeaders});
  }catch(error){
   const known=error instanceof JournalAccessError;
   return Response.json({error:known?error.code:'journal_service_unavailable'},{status:known?error.status:503,headers:secureHeaders});
  }
 };
}


export function createJournalWebhookHandler(deps){
 return async req=>{
  try{
   if(req.method!=='POST')return Response.json({error:'method_not_allowed'},{status:405,headers:secureHeaders});
   const release=deps.release;
   if(release?.enabled!==true||release.orderUniquenessVerified!==true)fail('journals_not_ready');
   if(typeof release.liveMode!=='boolean')fail('payment_mode_not_configured');
   const signature=req.headers.get('stripe-signature');
   if(!signature)fail('signature_required',400);
   const raw=await readBoundedBytes(req,262144);
   const stripeRaw=deps.createStripe();
   let event;try{event=await stripeRaw.webhooks.constructEventAsync(new TextDecoder().decode(raw),signature,deps.webhookSecret());}
   catch{fail('invalid_signature',400);}
   if(!/^evt_[A-Za-z0-9]+$/.test(event?.id||'')||event.livemode!==release.liveMode)fail('invalid_event',400);
   if(!['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type))
    return Response.json({received:true,processed:false},{headers:secureHeaders});
   const sessionId=event.data?.object?.id;
   if(!/^cs_(?:test|live)_[A-Za-z0-9]{16,200}$/.test(sessionId||''))fail('invalid_reference',400);
   const resolveCatalogue=async version=>{const c=release.catalogues?.[version];validateJournalCatalogue(c);return c;};
   const stripe=createJournalStripe(stripeRaw,release.liveMode,{catalogue:release.currentCatalogue,sha256:deps.sha256,resolveCatalogue});
   const session=await stripe.checkout.sessions.retrieve(sessionId);
   const m=session?.metadata||{};
   if(m.app_id!==JOURNAL_APP_ID||m.checkout_policy!==JOURNAL_POLICY)fail('foreign_checkout',400);
   if(session.status!=='complete'||session.payment_status!=='paid')
    return Response.json({received:true,processed:false,reason:'payment_pending'},{headers:secureHeaders});
   const client=deps.createRequestClient(req);
   const user=await deps.resolveBuyer(client,m.buyer_user_id);
   requireJournalBuyer(user);
   const result=await confirmJournalReturn({user,sessionId,store:createJournalStore(client,{orderLockId:release.orderLockId}),stripe,resolveCatalogue,liveMode:release.liveMode,
    resolveReleaseBindings:async version=>release.fulfilmentReleases?.[version]||{},verifyAcknowledgements:({buyer,session,catalogue})=>verifyJournalBuyerAcknowledgements({api:client.asServiceRole.entities,buyer,session,catalogue,sha256:deps.sha256})});
   if(result.status!=='paid'||!result.orderId)fail('paid_order_not_persisted');
   if(release.emailDeliveryVerified!==true)fail('email_delivery_not_verified');
   const snapshot=await resolveCatalogue(m.catalogue_version);
   const delivery=await deliverJournalEmail({api:client.asServiceRole.entities,orderId:result.orderId,buyer:requireJournalBuyer(user),
    catalogue:snapshot,sendEmail:deps.sendJournalEmail});
   if(delivery.deliveryStatus!=='email_accepted')fail('email_delivery_unconfirmed');
   return Response.json({received:true,processed:true,order_id:result.orderId,fulfilment_status:result.fulfilmentStatus},{headers:secureHeaders});
  }catch(error){
   const known=error instanceof JournalAccessError;
   return Response.json({error:known?error.code:'journal_capture_unavailable'},{status:known?error.status:503,headers:secureHeaders});
  }
 };
}