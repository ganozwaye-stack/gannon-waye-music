import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { PUBLIC_JOURNALS, JOURNAL_PURCHASES_ENABLED, JOURNAL_BUNDLE_COUNT_CONFIRMED } from '@/lib/publicJournalCatalogue';
import { journalBasketQuote } from '@/lib/journalBasket';
import { STORE_CRASHED } from '@/config/storeStatus';

export default function JournalPurchasePanel({ book }) {
  const [selectedIds, setSelectedIds] = useState([book.id]);
  const [bundle, setBundle] = useState(false);
  const [ownership, setOwnership] = useState({ status: 'held', ownedBookIds: [], purchases: [] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const requestId = useRef(null);
  useEffect(() => {
    if (!JOURNAL_PURCHASES_ENABLED) return undefined;
    let active = true;
    setOwnership({ status: 'checking', ownedBookIds: [], purchases: [] });
    base44.functions.invoke('getJournalPurchases', {}).then(response => {
      const data = response?.data;
      if (!data || !Array.isArray(data.ownedBookIds) || !Array.isArray(data.purchases)) throw new Error('Purchase lookup unavailable');
      if (active) setOwnership({ ...data, status: 'ready' });
    }).catch(() => {
      if (active) {
        setOwnership({ status: 'unavailable', ownedBookIds: [], purchases: [] });
        setError('We could not check your purchases. Sign in or try again before making a payment.');
      }
    });
    return () => { active = false; };
  }, []);
  const quote = journalBasketQuote({ books: PUBLIC_JOURNALS, selectedIds, ownedIds: ownership.ownedBookIds, bundle });
  const mayPurchase = JOURNAL_PURCHASES_ENABLED && ownership.status === 'ready' &&
    quote.bookIds.length > 0 && quote.bookIds.every(id => PUBLIC_JOURNALS.find(item => item.id === id)?.releaseApproved);
  const existing = ownership.purchases.find(purchase => purchase.bookIds?.includes(book.id));
  const toggle = (id, checked) => {
    setBundle(false); requestId.current = null;
    setSelectedIds(previous => checked ? [...new Set([...previous, id])] : previous.filter(item => item !== id));
  };
  const purchase = async () => {
    if (!mayPurchase || busy) return;
    setBusy(true); setError('');
    try {
      requestId.current ||= crypto.randomUUID();
      const response = await base44.functions.invoke('createJournalCheckout', {
        offer_id: quote.bookIds, bundle_requested: quote.bundle,
        expected_total_cents: quote.totalCents, request_id: requestId.current
      });
      const data = response?.data || {};
      if (!data.checkout_url) throw new Error('Please refresh your purchase selection before paying.');
      const url = new URL(data.checkout_url);
      if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com') throw new Error('Checkout unavailable');
      window.location.assign(url.href);
    } catch {
      setError('Checkout could not be started. You have not been charged by this page. Please check any existing payment before trying again.');
    } finally { setBusy(false); }
  };
  const access = async () => {
    if (!JOURNAL_PURCHASES_ENABLED || !existing || busy) return;
    setBusy(true); setError('');
    try {
      const response = await base44.functions.fetch('/downloadJournal', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: existing.sessionId, book_id: book.id })
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf')) throw new Error('Download unavailable');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = book.id + '.pdf'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setError('We could not confirm access right now. Please try again; do not purchase the same journal again.'); }
    finally { setBusy(false); }
  };
  return (
    <div className="font-body space-y-4" data-testid="journal-purchase-panel">
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold mb-2">Other journals you can choose to add</legend>
        {PUBLIC_JOURNALS.filter(item => item.id !== book.id).map(item => (
          <label key={item.id} className="flex gap-3 items-start text-sm">
            <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={event => toggle(item.id, event.target.checked)} />
            <span>{item.title} · A$9.90{ownership.ownedBookIds.includes(item.id) ? ' · Already purchased' : ''}</span>
          </label>
        ))}
      </fieldset>
      <label className="flex gap-3 items-start text-sm">
        <input type="checkbox" disabled={!JOURNAL_BUNDLE_COUNT_CONFIRMED || ownership.ownedBookIds.length > 0} checked={quote.bundle}
          onChange={event => {
            setBundle(event.target.checked); requestId.current = null;
            setSelectedIds(event.target.checked ? PUBLIC_JOURNALS.map(item => item.id) : [book.id]);
          }} />
        <span>Choose the whole six-journal bundle · A$49</span>
      </label>
      <ul className="text-sm space-y-1" aria-label="Selected journals">
        {selectedIds.map(id => {
          const item = PUBLIC_JOURNALS.find(entry => entry.id === id);
          return <li key={id}>{item.title} · {quote.alreadyOwned.includes(id) ? 'Already purchased' : quote.bundle ? 'Included in bundle' : 'A$9.90'}</li>;
        })}
      </ul>
      <p className="font-semibold" data-testid="journal-selection-total">Total: {'A$'}{(quote.totalCents / 100).toFixed(2)}</p>
      {!JOURNAL_PURCHASES_ENABLED && <p className="text-sm text-muted-foreground">Online purchasing is being prepared.</p>}
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      {ownership.status === 'unavailable' && <Link to="/login" className="text-sm text-primary underline">Sign in to check your purchases</Link>}
      {existing && <Button onClick={access} disabled={busy}>Access your purchased journal</Button>}
      <Button onClick={purchase} disabled={!mayPurchase || busy}>{busy ? 'Please wait…' : 'Purchase'}</Button>
      <p className="text-xs text-muted-foreground">
        {STORE_CRASHED ? 'Gannon Waye merchandise · online ordering currently unavailable' :
          <Link to="/store" className="underline">Gannon Waye merchandise</Link>}
      </p>
    </div>
  );
}
