import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PUBLIC_JOURNALS,JOURNAL_PURCHASES_ENABLED} from '../src/lib/publicJournalCatalogue.js';
import {fulfilJournalDownload,journalOffer,journalCheckoutParams,JOURNAL_POLICY,JOURNAL_APP_ID,JOURNAL_ABN} from '../base44/shared/journalCommerce.js';
assert.equal(PUBLIC_JOURNALS.length,6);assert.equal(JOURNAL_PURCHASES_ENABLED,false);
assert.deepEqual(PUBLIC_JOURNALS.filter(book=>book.releaseApproved).map(book=>book.id).sort(),['building-resilience','healthy-boundaries']);
const bytes=new TextEncoder().encode('%PDF-local fixture; no actual journal content');
const sha256=b=>createHash('sha256').update(b).digest('hex');
const catalogue={enabled:true,approvedVersion:'mock-only',bundleId:'mock-bundle',bundleEnabled:true,bundlePriceCents:4500,books:PUBLIC_JOURNALS.map(book=>({...book,fileUri:'private/mock/'+book.id,sha256:sha256(bytes),priceCents:990,releaseApproved:true}))};
const user={id:'mock-user',email:'mock@example.invalid',is_verified:true},bookId=catalogue.books[0].id;
const session={id:'cs_test_ABCDEFGHIJKLMNOP',livemode:false,mode:'payment',currency:'aud',status:'complete',payment_status:'paid',amount_total:990,amount_subtotal:990,payment_intent:'pi_mock',customer_email:user.email,metadata:{checkout_policy:JOURNAL_POLICY,app_id:JOURNAL_APP_ID,abn:JOURNAL_ABN,buyer_user_id:user.id,catalogue_version:catalogue.approvedVersion,offer_id:bookId}};
const intent={id:'pi_mock',status:'succeeded',currency:'aud',livemode:false,amount_received:990,latest_charge:{paid:true,status:'succeeded',disputed:false,refunded:false,amount_refunded:0}};
let reads=0;
const args={catalogue,user,sessionId:session.id,bookId,retrieveSession:async()=>session,retrievePaymentIntent:async()=>intent,readPrivateFile:async()=>{reads++;return bytes},sha256,liveMode:false};
for(const override of [
 {user:null},
 {catalogue:{...catalogue,enabled:false}},
 {catalogue:{...catalogue,books:catalogue.books.map(book=>({...book,releaseApproved:false}))}},
 {retrieveSession:async()=>({...session,payment_status:'unpaid'})},
 {retrieveSession:async()=>({...session,amount_total:1})},
 {user:{id:'different',email:user.email}},
 {liveMode:true},
 {bookId:catalogue.books[1].id},
 {retrievePaymentIntent:async()=>({...intent,latest_charge:{...intent.latest_charge,refunded:true}})}
]) {await assert.rejects(fulfilJournalDownload({...args,...override}));assert.equal(reads,0);}
assert.deepEqual((await fulfilJournalDownload(args)).bytes,bytes);assert.equal(reads,1);
await assert.rejects(fulfilJournalDownload({...args,sha256:async()=> '0'.repeat(64)}),/journal_file_unavailable/);
assert.throws(()=>journalOffer({...catalogue,books:catalogue.books.map(book=>({...book,releaseApproved:false}))},bookId),/journal_not_ready/);
const checkout={catalogue,offerId:bookId,user,origin:'https://gannonwaye.com',requestId:'mock_same_attempt_123456'};
assert.equal(journalCheckoutParams(checkout).idempotencyKey,journalCheckoutParams(checkout).idempotencyKey);
console.log('PASS: four preview flags held and only the two approved editions marked ready; 9 denial fixtures read zero files; only entitled exact-payment fixture reads a synthetic PDF; integrity mismatch blocked; same-attempt checkout key stable. No network or actual files.');
