import {JournalAccessError,requireJournalBuyer,validateJournalCatalogue,fulfilJournalDownload,JOURNAL_POLICY,JOURNAL_APP_ID,journalOffer} from './journalCommerce.js';
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
  if(!Array.isArray(allowedHosts)||!allowedHosts.length||!fileUri.startsWith('private/'))fail('private_storage_not_configured');
  const signed=await core.CreateFileSignedUrl({file_uri:fileUri,expires_in:60});
  let url;try{url=new URL(signed?.signed_url);}catch{fail('journal_file_unavailable');}
  if(url.protocol!=='https:'||url.username||url.password||url.port||!allowedHosts.includes(url.hostname))fail('journal_file_unavailable');
  const response=await fetchImpl(url.href,{redirect:'error',signal:AbortSignal.timeout(15000)});
  if(!response.ok)fail('journal_file_unavailable');
  return readBoundedBytes(response,MAX_PDF_BYTES);
 };
}
export function createJournalStore(client){
 const api=client.asServiceRole.entities;
 async function list(entity,buyerId){const rows=await api[entity].filter({buyer_user_id:buyerId},'-created_date',101);if(!Array.isArray(rows)||rows.length>100)fail('purchase_recovery_unavailable');return rows;}
 async function save(entity,row){
  const existing=await api[entity].filter({buyer_user_id:row.buyer_user_id,stripe_session_id:row.stripe_session_id},'-created_date',2);
  if(!Array.isArray(existing))fail('purchase_recovery_unavailable');
  if(existing.length)return api[entity].update(existing[0].id,row);
  return api[entity].create(row);
 }
 return {listPurchases:id=>list('JournalPurchase',id),listAttempts:id=>list('JournalCheckoutAttempt',id),savePurchase:row=>save('JournalPurchase',row),saveAttempt:row=>save('JournalCheckoutAttempt',row)};
}
export async function verifyJournalPrices({stripe,catalogue,params,liveMode,sha256}){
 const offer=journalOffer(catalogue,params.metadata?.offer_id);
 const expected=offer.bundle?[{id:catalogue.bundleStripePriceId,cents:4900,bundle:true}]:
  offer.bookIds.map(id=>({id:catalogue.books.find(book=>book.id===id).stripePriceId,cents:990,book:catalogue.books.find(book=>book.id===id)}));
 if(!Array.isArray(params.line_items)||params.line_items.length!==expected.length)fail('journal_price_unavailable');
 for(let i=0;i<expected.length;i++){
  const item=params.line_items[i],binding=expected[i];
  if(item.quantity!==1||item.price!==binding.id||item.price_data||!/^price_[A-Za-z0-9]+$/.test(binding.id||''))fail('journal_price_unavailable');
  const price=await stripe.prices.retrieve(binding.id,{expand:['product']});
  const product=price?.product,m=product?.metadata||{};
  if(price?.id!==binding.id||price.active!==true||price.livemode!==liveMode||price.currency!=='aud'||
   price.type!=='one_time'||price.billing_scheme!=='per_unit'||price.unit_amount!==binding.cents||
   price.recurring||price.custom_unit_amount||price.transform_quantity||
   !product||typeof product!=='object'||product.active!==true||product.deleted===true||
   m.app_id!==JOURNAL_APP_ID||m.journal_policy!==JOURNAL_POLICY)fail('journal_price_unavailable');
  if(binding.bundle){
   const digest=await sha256(new TextEncoder().encode(JSON.stringify([...offer.bookIds].sort().map(id=>[id,catalogue.books.find(book=>book.id===id).sha256]))));
   if(m.journal_bundle_id!==catalogue.bundleId||m.journal_asset_set_sha256!==digest)fail('journal_price_unavailable');
  }else if(m.journal_book_id!==binding.book.id||m.journal_asset_sha256!==binding.book.sha256)fail('journal_price_unavailable');
 }
}
export function createJournalStripe(stripe,liveMode,{catalogue,sha256}={}){
 const checkout={sessions:{retrieve:(...args)=>stripe.checkout.sessions.retrieve(...args),list:(...args)=>stripe.checkout.sessions.list(...args),expire:(...args)=>stripe.checkout.sessions.expire(...args),create:async(params,options)=>{
  await verifyJournalPrices({stripe,catalogue,params,liveMode,sha256});
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
   const resolveCatalogue=async version=>{const snapshot=release.catalogues?.[version];if(!snapshot)fail('catalogue_unavailable');validateJournalCatalogue(snapshot);return snapshot;};
   const stripe=createJournalStripe(deps.createStripe(),release.liveMode,{catalogue,sha256:deps.sha256}),store=createJournalStore(client);
   const common={user,store,stripe,resolveCatalogue,liveMode:release.liveMode};
   let result;
   if(action==='createJournalCheckout')result=await startJournalCheckout({...common,catalogue,selectedIds:body.offer_id,bundleRequested:body.bundle_requested===true,expectedTotalCents:body.expected_total_cents,sha256:deps.sha256});
   else if(action==='getJournalPurchases'){
    const state=await journalAccountState(common);result={purchases:state.purchases,pending:state.pending,ownedBookIds:state.ownedBookIds};
   }else if(action==='confirmJournalPurchase')result=await confirmJournalReturn({...common,sessionId:body.session_id});
   else if(action==='cancelJournalCheckout')result=await cancelJournalCheckout({...common,sessionId:body.session_id});
   else if(action==='downloadJournal'){
    // Resolve the immutable purchased edition rather than today's catalogue.
    if(!/^cs_(?:test|live)_[A-Za-z0-9]{16,200}$/.test(body.session_id||''))fail('invalid_reference',400);
    const session=await stripe.checkout.sessions.retrieve(body.session_id);
    const purchasedCatalogue=await resolveCatalogue(session?.metadata?.catalogue_version);
    const download=await fulfilJournalDownload({catalogue:purchasedCatalogue,user,sessionId:body.session_id,bookId:body.book_id,
     retrieveSession:async()=>session,retrievePaymentIntent:id=>stripe.paymentIntents.retrieve(id,{expand:['latest_charge']}),
     readPrivateFile:createPrivateFileReader({core:client.asServiceRole.integrations.Core,fetchImpl:deps.fetchImpl,allowedHosts:release.privateDownloadHosts}),
     sha256:deps.sha256,liveMode:release.liveMode});
    return new Response(download.bytes,{headers:{...secureHeaders,'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="'+download.filename+'"'}});
   }else fail('unknown_action',404);
   return Response.json(result,{headers:secureHeaders});
  }catch(error){
   const known=error instanceof JournalAccessError;
   return Response.json({error:known?error.code:'journal_service_unavailable'},{status:known?error.status:503,headers:secureHeaders});
  }
 };
}
