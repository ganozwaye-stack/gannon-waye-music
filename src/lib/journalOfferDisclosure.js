import {PUBLIC_JOURNALS} from './publicJournalCatalogue.js';
// Approved commercial presentation. These labels do not open purchase/release gates.
export const IMMEDIATE_JOURNAL_IDS=['building-resilience','healthy-boundaries'];
export const JOURNAL_PREORDER_DATE='2026-11-02';
export const JOURNAL_PREORDER_LABEL='Monday 2 November 2026 (Melbourne)';
export const JOURNAL_CHECKOUT_TERMS_VERSION='gw_journal_mixed_delivery_v2_20261022';
export function journalDeliveryLabel(id){
 const book=PUBLIC_JOURNALS.find(book=>book.id===id);
 return book?.releaseApproved===true?'Email delivery after payment':book?.preorderApproved===true?'Preorder · '+JOURNAL_PREORDER_LABEL:'Preview only · purchasing not open';
}
