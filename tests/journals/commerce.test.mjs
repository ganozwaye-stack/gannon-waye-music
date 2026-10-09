import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { JOURNAL_POLICY, JOURNAL_ABN, journalCheckoutParams, fulfilJournalDownload } from '../../base44/shared/journalCommerce.js';
const pdf = new TextEncoder().encode('%PDF-1.7\nfixture');
const digest = createHash('sha256').update(pdf).digest('hex');
const catalogue = { enabled: true, approvedVersion: 'approved-test-v1', bundleId: 'six-journals', bundlePriceCents: 4900,
  books: Array.from({ length: 6 }, (_, i) => ({ id: 'journal-' + i, title: 'Test journal ' + i,
    priceCents: 990, fileUri: 'private/test/' + i + '.pdf', sha256: digest })) };
const user = { id: 'buyer-1', email: 'buyer@example.com' };
function fixture(offerId = 'journal-0') {
  const amount = offerId === 'six-journals' ? 4900 : 990;
  return {
    session: { id: 'cs_test_abcdefghijklmnop', livemode: false, mode: 'payment', currency: 'aud',
      status: 'complete', payment_status: 'paid', amount_total: amount, amount_subtotal: amount,
      customer_details: { email: user.email }, payment_intent: 'pi_fixture',
      metadata: { checkout_policy: JOURNAL_POLICY, abn: JOURNAL_ABN,
        buyer_user_id: user.id, offer_id: offerId, catalogue_version: catalogue.approvedVersion } },
    paymentIntent: { id: 'pi_fixture', status: 'succeeded', livemode: false, currency: 'aud',
      amount_received: amount, latest_charge: { paid: true, status: 'succeeded',
        refunded: false, disputed: false, amount_refunded: 0 } }
  };
}
async function download({ f = fixture(), buyer = user, bookId = 'journal-0', config = catalogue,
  bytes = pdf, sessionId = 'cs_test_abcdefghijklmnop' } = {}) {
  let fileReads = 0;
  const promise = fulfilJournalDownload({ catalogue: config, user: buyer, sessionId, bookId,
    liveMode: false, retrieveSession: async () => f.session,
    retrievePaymentIntent: async () => f.paymentIntent,
    readPrivateFile: async () => { fileReads++; return bytes; },
    sha256: async data => createHash('sha256').update(data).digest('hex') });
  return { promise, fileReads: () => fileReads };
}
test('checkout uses server prices, buyer identity, no shipping and stable retry key', () => {
  const args = { catalogue, offerId: 'journal-0', user, origin: 'https://gannonwaye.com', requestId: 'fixture-request-123456' };
  const one = journalCheckoutParams(args), two = journalCheckoutParams(args);
  assert.equal(one.params.line_items[0].price_data.unit_amount, 990);
  assert.equal(one.params.metadata.buyer_user_id, user.id);
  assert.equal(one.idempotencyKey, two.idempotencyKey);
  assert.equal(one.params.shipping_address_collection, undefined);
  assert.equal(journalCheckoutParams({ ...args, offerId: 'six-journals' }).params.line_items[0].price_data.unit_amount, 4900);
});
test('paid individual gets only its purchased PDF without exposing storage URI', async () => {
  const d = await download(); const result = await d.promise;
  assert.deepEqual(result.bytes, pdf); assert.equal(d.fileReads(), 1);
  assert.equal(result.filename, 'journal-0.pdf'); assert.equal(result.fileUri, undefined);
});
test('bundle authorizes each of six books', async () => {
  for (const book of catalogue.books) {
    const d = await download({ f: fixture('six-journals'), bookId: book.id });
    assert.equal((await d.promise).filename, book.id + '.pdf');
  }
});
const denied = [
  ['unpaid', f => { f.session.payment_status = 'unpaid'; }],
  ['expired checkout', f => { f.session.status = 'expired'; }],
  ['wrong paid amount', f => { f.session.amount_total = 1; }],
  ['client supplied store order is not accepted', f => { f.session.metadata.checkout_policy = 'stage_one_owned_stock_v1'; }],
  ['another buyer id', f => { f.session.metadata.buyer_user_id = 'other'; }],
  ['another email', f => { f.session.customer_details.email = 'other@example.com'; }],
  ['test mode cannot masquerade as live', f => { f.session.livemode = true; }],
  ['refunded', f => { f.paymentIntent.latest_charge.refunded = true; }],
  ['partially refunded', f => { f.paymentIntent.latest_charge.amount_refunded = 1; }],
  ['disputed', f => { f.paymentIntent.latest_charge.disputed = true; }],
  ['missing charge evidence', f => { f.paymentIntent.latest_charge = 'ch_reference'; }],
  ['different payment intent', f => { f.paymentIntent.id = 'pi_other'; }],
  ['unapproved catalogue version', f => { f.session.metadata.catalogue_version = 'invented'; }],
];
for (const [name, mutate] of denied) test(name + ' denies before private file access', async () => {
  const f = fixture(); mutate(f); const d = await download({ f });
  await assert.rejects(d.promise); assert.equal(d.fileReads(), 0);
});
for (const [name, overrides] of [
  ['anonymous', { buyer: null }], ['unbought book', { bookId: 'journal-1' }],
  ['disabled sales', { config: { ...catalogue, enabled: false } }],
  ['public PDF URI', { config: { ...catalogue, books: catalogue.books.map(b => ({ ...b, fileUri: 'https://public.example/' + b.id })) } }],
  ['invalid checkout reference', { sessionId: 'invented' }],
]) test(name + ' fails closed', async () => {
  const d = await download(overrides); await assert.rejects(d.promise); assert.equal(d.fileReads(), 0);
});
test('damaged or replaced PDF fails its approved integrity hash', async () => {
  const d = await download({ bytes: new TextEncoder().encode('%PDF-changed') });
  await assert.rejects(d.promise, /journal_file_unavailable/);
});
