// Backend-only journal commerce policy. Do not import this module into public UI.
export const JOURNAL_POLICY = 'gw_paid_journals_v1';
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
  const books = catalogue.books;
  if (!Array.isArray(books) || books.length !== 6) deny('journals_not_ready', 503);
  const ids = new Set();
  for (const book of books) {
    if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(book.id || '') || ids.has(book.id)) deny('journals_not_ready', 503);
    ids.add(book.id);
    if (!text(book.title) || !text(book.fileUri).startsWith('private/') ||
        !/^[a-f0-9]{64}$/.test(book.sha256 || '') || book.priceCents !== 990) deny('journals_not_ready', 503);
  }
  if (!text(catalogue.bundleId) || ids.has(catalogue.bundleId) || catalogue.bundlePriceCents !== 4900) deny('journals_not_ready', 503);
  return catalogue;
}
export function requireJournalBuyer(user) {
  if (!text(user?.id) || !email(user?.email)) deny('sign_in_required', 401);
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
    if (books.some(book => book.releaseApproved !== true)) deny('journal_not_ready', 503);
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
    if (single.releaseApproved !== true) deny('journal_not_ready', 503);
    return { id: single.id, title: single.title, priceCents: 990, bookIds: [single.id], bundle: false };
  }
  if (offerId === catalogue.bundleId) {
    if (catalogue.bundleEnabled !== true || catalogue.books.some(book => book.releaseApproved !== true)) deny('bundle_not_ready', 503);
    return { id: catalogue.bundleId, title: 'Six-journal bundle', priceCents: 4900,
      bookIds: catalogue.books.map(item => item.id), bundle: true };
  }
  return deny('journal_not_found', 404);
}
export function journalCheckoutParams({ catalogue, offerId, user, origin, requestId }) {
  const buyer = requireJournalBuyer(user);
  const offer = journalOffer(catalogue, offerId);
  if (origin !== 'https://gannonwaye.com') deny('invalid_checkout_origin', 400);
  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(requestId || '')) deny('invalid_request_id', 400);
  return {
    params: {
      mode: 'payment', customer_email: buyer.email,
      line_items: offer.bundle ? [{ price_data: { currency: 'aud', unit_amount: 4900,
        product_data: { name: offer.title } }, quantity: 1 }] : offer.bookIds.map(id => ({
          price_data: { currency: 'aud', unit_amount: 990,
            product_data: { name: catalogue.books.find(book => book.id === id).title } }, quantity: 1
        })),
      success_url: origin + '/journals/purchase?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: origin + '/coaching#journals',
      metadata: { checkout_policy: JOURNAL_POLICY, abn: JOURNAL_ABN,
        buyer_user_id: buyer.id, offer_id: offer.id, catalogue_version: catalogue.approvedVersion },
      automatic_tax: { enabled: false },
    },
    idempotencyKey: JOURNAL_POLICY + ':' + buyer.id + ':' + offer.id + ':' + requestId
  };
}
// Only the server's Stripe retrieval result is accepted; never client metadata or MerchOrder.
export function verifyJournalPayment({ catalogue, user, session, paymentIntent, liveMode }) {
  const buyer = requireJournalBuyer(user);
  validateJournalCatalogue(catalogue);
  const meta = session?.metadata || {};
  if (typeof liveMode !== 'boolean' || session?.livemode !== liveMode ||
      session?.mode !== 'payment' || session?.currency !== 'aud' ||
      meta.checkout_policy !== JOURNAL_POLICY || meta.abn !== JOURNAL_ABN ||
      meta.buyer_user_id !== buyer.id || meta.catalogue_version !== catalogue.approvedVersion ||
      email(session.customer_details?.email || session.customer_email) !== buyer.email) deny('purchase_not_found', 404);
  const offer = journalOffer(catalogue, meta.offer_id);
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
  retrieveSession, retrievePaymentIntent, readPrivateFile, sha256, liveMode }) {
  requireJournalBuyer(user);
  validateJournalCatalogue(catalogue);
  if (!/^cs_(?:test|live)_[A-Za-z0-9]{16,200}$/.test(sessionId || '')) deny('invalid_reference', 400);
  const session = await retrieveSession(sessionId);
  const intentId = typeof session?.payment_intent === 'string' ? session.payment_intent : session?.payment_intent?.id;
  if (!/^pi_[A-Za-z0-9]+$/.test(intentId || '')) deny('purchase_not_found', 404);
  const paymentIntent = await retrievePaymentIntent(intentId);
  const offer = verifyJournalPayment({ catalogue, user, session, paymentIntent, liveMode });
  if (!offer.bookIds.includes(bookId)) deny('journal_not_purchased');
  const book = catalogue.books.find(item => item.id === bookId);
  // No file read or signed link is attempted before every entitlement check passes.
  const bytes = await readPrivateFile(book.fileUri);
  if (!(bytes instanceof Uint8Array) || bytes.byteLength < 5 ||
      bytes.byteLength > 25 * 1024 * 1024 ||
      String.fromCharCode(...bytes.slice(0, 5)) !== '%PDF-' ||
      await sha256(bytes) !== book.sha256) deny('journal_file_unavailable', 503);
  return { bytes, filename: book.id + '.pdf', contentType: 'application/pdf' };
}
