import test from 'node:test';
import assert from 'node:assert/strict';
import { journalBasketQuote } from '../../src/lib/journalBasket.js';
import { PUBLIC_JOURNALS } from '../../src/lib/publicJournalCatalogue.js';
const books=PUBLIC_JOURNALS, ids=books.map(book=>book.id);
test('three optional journals are itemized at A29.70 without another discount',()=>{
  const quote=journalBasketQuote({books,selectedIds:ids.slice(0,3)});
  assert.equal(quote.totalCents,2970); assert.equal(quote.bundle,false);
});
test('duplicate selected IDs never duplicate a digital title or price',()=>{
  const quote=journalBasketQuote({books,selectedIds:[ids[0],ids[0],ids[1]]});
  assert.deepEqual(quote.bookIds,[ids[0],ids[1]]); assert.equal(quote.totalCents,1980);
});
test('whole six bundle is A49 only when explicitly selected',()=>{
  assert.equal(journalBasketQuote({books,selectedIds:ids}).totalCents,5940);
  assert.equal(journalBasketQuote({books,selectedIds:ids,bundle:true}).totalCents,4900);
  assert.equal(journalBasketQuote({books,selectedIds:ids.slice(0,3),bundle:true}).totalCents,2970);
});
test('owned journals are omitted from charges and can show existing access',()=>{
  const quote=journalBasketQuote({books,selectedIds:ids.slice(0,3),ownedIds:[ids[0]]});
  assert.deepEqual(quote.alreadyOwned,[ids[0]]); assert.deepEqual(quote.bookIds,ids.slice(1,3));
  assert.equal(quote.totalCents,1980);
  assert.equal(journalBasketQuote({books,selectedIds:[ids[0]],ownedIds:[ids[0]]}).totalCents,0);
});
test('unknown journal ID is rejected',()=>{
  assert.throws(()=>journalBasketQuote({books,selectedIds:['invented']}),/Invalid journal selection/);
});
