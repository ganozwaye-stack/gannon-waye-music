export const JOURNAL_UNIT_CENTS = 990;
export const JOURNAL_BUNDLE_CENTS = 4900;
export function journalBasketQuote({ books, selectedIds, ownedIds = [], bundle = false }) {
  const known = new Set(books.map(book => book.id));
  if (!Array.isArray(selectedIds) || selectedIds.some(id => !known.has(id))) throw new Error('Invalid journal selection');
  const unique = [...new Set(selectedIds)];
  const owned = new Set(ownedIds);
  const alreadyOwned = unique.filter(id => owned.has(id));
  const bookIds = unique.filter(id => !owned.has(id));
  const wholeSet = bundle && unique.length === books.length && books.length === 6 && alreadyOwned.length === 0;
  return { bookIds, alreadyOwned, bundle: wholeSet,
    totalCents: bookIds.length === 0 ? 0 : wholeSet ? JOURNAL_BUNDLE_CENTS : JOURNAL_UNIT_CENTS * bookIds.length };
}
