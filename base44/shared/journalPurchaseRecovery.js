import { JournalAccessError, requireJournalBuyer, verifyJournalPayment, journalOffer } from './journalCommerce.js';

// Index records are only lookup references. They never serve as proof of payment.
// A backend-only index with all client CRUD denied is required before deployment.
export async function restoreJournalOwnership({ user, references, resolveCatalogue,
  retrieveSession, retrievePaymentIntent, liveMode }) {
  const buyer = requireJournalBuyer(user);
  if (!Array.isArray(references) || references.length > 100) throw new JournalAccessError('purchase_recovery_unavailable', 503);
  const results = new Map();
  for (const ref of references) {
    if (ref.buyer_user_id !== buyer.id) continue;
    if (results.has(ref.stripe_session_id)) continue;
    if (!/^cs_(?:test|live)_[A-Za-z0-9]{16,200}$/.test(ref.stripe_session_id || '')) {
      throw new JournalAccessError('purchase_recovery_unavailable', 503);
    }
    // An API failure is not treated as "no purchases", which could charge someone twice.
    const session = await retrieveSession(ref.stripe_session_id);
    const catalogue = await resolveCatalogue(session?.metadata?.catalogue_version);
    const intentId = typeof session?.payment_intent === 'string' ? session.payment_intent : session?.payment_intent?.id;
    if (!intentId) throw new JournalAccessError('purchase_recovery_unavailable', 503);
    const paymentIntent = await retrievePaymentIntent(intentId);
    try {
      const offer = verifyJournalPayment({ catalogue, user, session, paymentIntent, liveMode });
      results.set(session.id, { sessionId: session.id, bookIds: offer.bookIds,
        catalogueVersion: catalogue.approvedVersion });
    } catch (error) {
      if (error instanceof JournalAccessError &&
          ['payment_not_complete','payment_not_eligible','purchase_not_found','payment_amount_mismatch'].includes(error.code)) continue;
      throw error;
    }
  }
  const purchases = [...results.values()];
  return { purchases, ownedBookIds: [...new Set(purchases.flatMap(purchase => purchase.bookIds))].sort() };
}
export function planJournalPurchase({ catalogue, selectedIds, verifiedOwnedIds, bundleRequested = false }) {
  requireArray(selectedIds);
  requireArray(verifiedOwnedIds);
  if (new Set(selectedIds).size !== selectedIds.length) throw new JournalAccessError('invalid_selection', 400);
  const owned = new Set(verifiedOwnedIds);
  const alreadyOwned = selectedIds.filter(id => owned.has(id));
  const remaining = selectedIds.filter(id => !owned.has(id));
  if (remaining.length === 0) return { status: 'already_owned', bookIds: [], alreadyOwned, totalCents: 0 };
  // The A$49 whole-set offer is distinct from subset pricing. No extra discount,
  // silent duplicate charge or invented collection-upgrade price is applied.
  const offer = bundleRequested && alreadyOwned.length === 0
    ? journalOffer(catalogue, catalogue.bundleId)
    : journalOffer(catalogue, remaining);
  if (bundleRequested && new Set(selectedIds).size !== catalogue.books.length) {
    throw new JournalAccessError('invalid_selection', 400);
  }
  return { status: alreadyOwned.length ? 'selection_requires_confirmation' : 'ready',
    bookIds: offer.bookIds, alreadyOwned, totalCents: offer.priceCents, offerId: offer.id };
}
function requireArray(value) {
  if (!Array.isArray(value) || value.length > 6 || value.some(id => typeof id !== 'string')) {
    throw new JournalAccessError('invalid_selection', 400);
  }
}
