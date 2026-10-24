import {isJournalPrivateUri} from './journalPrivateUri.js';
import {journalItemPlan,journalItemPlans,journalAssetBindings,journalPreorderTerms,releasedJournalBook} from './journalFulfilment.js';
import {JOURNAL_DELIVERY_TERMS_VERSION,JOURNAL_DELIVERY_NOTICE} from './journalDeliveryTerms.js';
// Backend-only journal commerce policy. Do not import this module into public UI.
export const JOURNAL_POLICY = 'gw_paid_journals_v1';
export const JOURNAL_APP_ID = '69eb7905ca6eb4180010f794';
export const JOURNAL_ABN = '22931809349';
export class JournalAccessError extends Error {
  constructor(code, status = 403) { super(code); this.code = code; this.status = status; }
}
const deny = (code, status) => { throw new JournalAccessError(code, status); };
const text = value => typeof value === 'string' ? value.trim() : '';
const email = value => text(value).toLowerCase();

// Configuration must be supplied server-side after the six current books are verified.
// Empty/unapproved catalogues never create checkout sessions or expose files.
export function validateJournalCatalogue(catalogue) {
  if (!catalogue || catalogue.enabled !== true || !text(catalogue.approvedVersion)) deny('journals_not_ready', 503);
  if(catalogue.fulfilmentType&&!['released','mixed'].includes(catalogue.fulfilmentType))deny('immediate_delivery_required',503);
  const books = catalogue.books;
  if (!Array.isArray(books) || books.length !== 6) deny('journals_not_ready', 503);
  const ids = new Set();
  for (const book of books) {
    if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(book.id || '') || ids.has(book.id)) deny('journals_not_ready', 503);
    ids.add(book.id);
    if (!text(book.title) || book.priceCents !== 990 || typeof book.releaseApproved !== 'boolean') deny('journals_not_ready', 503);
    // Held editions need no invented private-file configuration. Only the exact
    // released edition may be purchased or downloaded; bundle still needs all six.
    if (book.releaseApproved && (!isJournalPrivateUri(book.fileUri) ||
        !/^[a-f0-9]{64}$/.test(book.sha256 || ''))) deny('journals_not_ready', 503);
  }
  if (!text(catalogue.bundleId) || ids.has(catalogue.bundleId) || catalogue.bundlePriceCents !== 4500) deny('journals_not_ready', 503);
  return catalogue;
}
export function requireJournalBuyer(user) {
  if (!text(user?.id) || !email(user?.email)) deny('sign_in_required', 401);
  if(user.is_verified!==true||user.disabled===true||user.is_service===true||
   (user.app_id&&user.app_id!==JOURNAL_APP_ID))deny('verified_email_required',403);
  return { id: user.id, email: email(user.email) };
}
export function journalOffer(catalogue, offerId) {
  validateJournalCatalogue(catalogue);
  const single = catalogue.books.find(item => item.id === offerId);
  const select = ids => {
    if (!Array.isArray(ids) || ids.length < 1 || ids.length > 6 ||
        new Set(ids).size !== ids.length || ids.some(id => typeof id !== 'string')) deny('invalid_selection', 400);
    const canonical = [...ids].sort();
    const books = canonical.map(id => catalogue.books.find(book => book.id === id));
    if (books.some(book => !book)) deny('journal_not_found', 404);
    if (books.some(book => {try{journalItemPlan(catalogue,book);return false;}catch{return true;}})) deny('journal_not_ready', 503);
    return { id: 'journals:' + canonical.join(','), title: books.map(book => book.title).join(' + '),
      priceCents: 990 * books.length, bookIds: canonical, bundle: false };
  };
  if (Array.isArray(offerId)) return select(offerId);
  if (typeof offerId === 'string' && offerId.startsWith('journals:')) {
    const selection = select(offerId.slice(9).split(','));
    if (selection.id !== offerId) deny('invalid_selection', 400);
    return selection;
  }
  if (single) {
    journalItemPlan(catalogue,single);
    return { id: single.id, title: single.title, priceCents: 990, bookIds: [single.id], bundle: false };
  }
  if (offerId === catalogue.bundleId) {
    if (catalogue.bundleEnabled !== true || catalogue.books.some(book => {try{journalItemPlan(catalogue,book);return false;}catch{return true;}})) deny('bundle_not_ready', 503);
    return { id: catalogue.bundleId, title: 'Six-journal bundle', priceCents: 4500,
      bookIds: catalogue.books.map(item => item.id), bundle: true };
  }
  return deny('journal_not_found', 404);
}
export const OWNER_JOURNAL_TEST_POLICY='gw_owner_journal_test_90_v1';
const OWNER_JOURNAL_TEST_PROMO='6a16abb0198d4c5d294edc12';
const OWNER_JOURNAL_TEST_CODE='NunY@69Ony@Son!@';
// Owner-only 90% test discount: the exact owner email with a verified account,
// server-side only and never public. journalPricedOffer re-checks eligibility
// against the real authenticated user, so no other account can claim it.
export function ownerJournalTestEligible(user){
 return email(user?.email)==='ganoz01@icloud.com'&&user?.is_verified===true&&
  user.disabled!==true&&user.is_service!==true&&(!user.app_id||user.app_id===JOURNAL_APP_ID);
}
export function ownerJournalTestMetadata(meta){
 const marked=meta?.owner_test_discount!==undefined||meta?.owner_test_promo_id!==undefined;
 if(!marked)return false;
 if(meta.owner_test_discount!==OWNER_JOURNAL_TEST_POLICY||meta.owner_test_promo_id!==OWNER_JOURNAL_TEST_PROMO)deny('owner_discount_not_eligible',403);
 return true;
}
export function journalPricedOffer({catalogue,user,offerId,ownerTestCode,metadata}){
 requireJournalBuyer(user);
 const offer=journalOffer(catalogue,offerId);
 const selected=metadata?ownerJournalTestMetadata(metadata):Boolean(ownerTestCode);
 if(!selected)return offer;
 if(!ownerJournalTestEligible(user)||(!metadata&&ownerTestCode!==OWNER_JOURNAL_TEST_CODE)||
  offer.bundle||offer.bookIds.length!==1||offer.priceCents!==990||
  !['building-resilience','healthy-boundaries'].includes(offer.bookIds[0])||
  catalogue.books.find(b=>b.id===offer.bookIds[0])?.releaseApproved!==true)deny('owner_discount_not_eligible',403);
 return {...offer,priceCents:99,basePriceCents:990,ownerTestDiscount:true};
}
export function journalCheckoutParams({ catalogue, offerId, user, origin, requestId, acknowledgement,ownerTestCode }) {
  const buyer=requireJournalBuyer(user),offer=journalPricedOffer({catalogue,user,offerId,ownerTestCode});
  const items=journalItemPlans(catalogue,offer.bookIds),pending=items.filter(p=>p.fulfilmentType==='preorder');
  const contract=pending.length?journalPreorderTerms(catalogue):null;
  if(contract&&Date.parse(contract.deliveryBy)<Date.now()+30*60*1000)deny('preorder_delivery_date_passed',503);
  const disclosure=items.map(p=>catalogue.books.find(b=>b.id===p.bookId).title+': '+(p.fulfilmentType==='released'?'email delivery after payment':'preorder, '+p.releaseLabel)).join('; ');
  if(origin!=='https://gannonwaye.com')deny('invalid_checkout_origin',400);
  if(!/^[a-zA-Z0-9_-]{16,80}$/.test(requestId||''))deny('invalid_request_id',400);
  return {params:{mode:'payment',payment_method_types:['card'],customer_email:buyer.email,currency:'aud',
   payment_intent_data:{metadata:{...(offer.ownerTestDiscount?{owner_test_discount:OWNER_JOURNAL_TEST_POLICY,owner_test_promo_id:OWNER_JOURNAL_TEST_PROMO}:{}),checkout_policy:JOURNAL_POLICY,app_id:JOURNAL_APP_ID,buyer_user_id:buyer.id,catalogue_version:catalogue.approvedVersion}},
   ...(contract?{expires_at:Math.floor(Math.min(Date.parse(contract.deliveryBy),Date.now()+24*60*60*1000)/1000)}:{}),
   line_items:offer.bundle?[{price:catalogue.bundleStripePriceId,quantity:1}]:
    offer.bookIds.map(id=>({price:catalogue.books.find(b=>b.id===id).stripePriceId,quantity:1})),
   success_url:origin+'/journals/purchase?session_id={CHECKOUT_SESSION_ID}',
   cancel_url:origin+'/coaching#journals',
   custom_text:{submit:{message:contract?disclosure+'. '+JOURNAL_DELIVERY_NOTICE+' Undelivered preorders: '+contract.cancellationText:JOURNAL_DELIVERY_NOTICE}},
   metadata:{...(offer.ownerTestDiscount?{owner_test_discount:OWNER_JOURNAL_TEST_POLICY,owner_test_promo_id:OWNER_JOURNAL_TEST_PROMO}:{}),checkout_policy:JOURNAL_POLICY,app_id:JOURNAL_APP_ID,abn:JOURNAL_ABN,
    buyer_user_id:buyer.id,offer_id:offer.id,catalogue_version:catalogue.approvedVersion,delivery_terms_version:JOURNAL_DELIVERY_TERMS_VERSION,
    ...(contract?{preorder_terms_version:contract.termsVersion}:{}),
    ...(acknowledgement?{buyer_details_id:acknowledgement.id,terms_accepted_at:acknowledgement.acceptedAt,buyer_acceptance_sha256:acknowledgement.item_plan_sha256}:{})},
   automatic_tax:{enabled:false}},idempotencyKey:JOURNAL_POLICY+':'+buyer.id+':'+offer.id+':'+requestId};
}
export async function verifyJournalDeliverables({catalogue,bookIds,readPrivateFile,sha256}){
 const offer=journalOffer(catalogue,bookIds);
 for(const id of offer.bookIds){
  const book=catalogue.books.find(b=>b.id===id);
  if(journalItemPlan(catalogue,book).fulfilmentType==='preorder')continue;
  await checkedJournalFile({book,readPrivateFile,sha256});
 }
}
async function checkedJournalFile({book,readPrivateFile,sha256}){
 const bytes=await readPrivateFile(book.fileUri);
 if(!(bytes instanceof Uint8Array)||bytes.byteLength<5||bytes.byteLength>25*1024*1024||
  String.fromCharCode(...bytes.slice(0,5))!=='%PDF-'||await sha256(bytes)!==book.sha256)deny('journal_file_unavailable',503);
 return bytes;
}
// Only the server's Stripe retrieval result is accepted; never client metadata or MerchOrder.
export function verifyJournalPayment({ catalogue, user, session, paymentIntent, liveMode }) {
  const buyer = requireJournalBuyer(user);
  validateJournalCatalogue(catalogue);
  const meta = session?.metadata || {};
  if (typeof liveMode !== 'boolean' || session?.livemode !== liveMode ||
      session?.mode !== 'payment' || session?.currency !== 'aud' ||
      meta.checkout_policy !== JOURNAL_POLICY || meta.app_id !== JOURNAL_APP_ID || meta.abn !== JOURNAL_ABN ||
      meta.buyer_user_id !== buyer.id || meta.catalogue_version !== catalogue.approvedVersion ||
      email(session.customer_details?.email || session.customer_email) !== buyer.email) deny('purchase_not_found', 404);
  const offer = journalPricedOffer({catalogue,user,offerId:meta.offer_id,metadata:meta});
  if(journalItemPlans(catalogue,offer.bookIds).some(p=>p.fulfilmentType==='preorder')&&
   meta.preorder_terms_version!==journalPreorderTerms(catalogue).termsVersion)deny('preorder_terms_mismatch',403);
  if (session.status !== 'complete' || session.payment_status !== 'paid') deny('payment_not_complete');
  if (session.amount_total !== offer.priceCents || session.amount_subtotal !== offer.priceCents ||
      (session.total_details?.amount_discount || 0) !== 0 ||
      (session.total_details?.amount_shipping || 0) !== 0 ||
      (session.total_details?.amount_tax || 0) !== 0) deny('payment_amount_mismatch');
  const intentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id;
  const charge = paymentIntent?.latest_charge;
  if (!intentId || paymentIntent?.id !== intentId || paymentIntent?.status !== 'succeeded' ||
      paymentIntent?.currency !== 'aud' || paymentIntent?.livemode !== liveMode ||
      paymentIntent?.amount_received !== offer.priceCents ||
      !charge || typeof charge !== 'object' || charge.paid !== true ||
      charge.status !== 'succeeded' || charge.disputed !== false ||
      charge.refunded !== false || charge.amount_refunded !== 0) deny('payment_not_eligible');
  return offer;
}
export async function fulfilJournalDownload({ catalogue, user, sessionId, bookId,
  retrieveSession, retrievePaymentIntent, readPrivateFile, sha256, liveMode,releaseBindings={},now=Date.now() }) {
  requireJournalBuyer(user);
  validateJournalCatalogue(catalogue);
  if (!/^cs_(?:test|live)_[A-Za-z0-9]{16,200}$/.test(sessionId || '')) deny('invalid_reference', 400);
  const session = await retrieveSession(sessionId);
  if (session?.id !== sessionId) deny('purchase_not_found', 404);
  const intentId = typeof session?.payment_intent === 'string' ? session.payment_intent : session?.payment_intent?.id;
  if (!/^pi_[A-Za-z0-9]+$/.test(intentId || '')) deny('purchase_not_found', 404);
  const paymentIntent = await retrievePaymentIntent(intentId);
  const offer = verifyJournalPayment({ catalogue, user, session, paymentIntent, liveMode });
  if (!offer.bookIds.includes(bookId)) deny('journal_not_purchased');
  const book = releasedJournalBook(catalogue,bookId,releaseBindings,now);
  // No file read or signed link is attempted before every entitlement check passes.
  const bytes=await checkedJournalFile({book,readPrivateFile,sha256});
  return { bytes, filename: book.id + '.pdf', contentType: 'application/pdf' };
}