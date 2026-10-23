import JournalAccount from '@/pages/JournalAccount';
import {journalDeliveryLabel,JOURNAL_CHECKOUT_TERMS_VERSION} from '@/lib/journalOfferDisclosure';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { PUBLIC_JOURNALS, JOURNAL_PURCHASES_ENABLED, JOURNAL_BUNDLE_COUNT_CONFIRMED, JOURNAL_BUNDLE_PURCHASES_ENABLED } from '@/lib/publicJournalCatalogue';
import { journalBasketQuote } from '@/lib/journalBasket';
import { STORE_CRASHED } from '@/config/storeStatus';

export default function JournalPurchasePanel({ book }) {
  const [selectedIds, setSelectedIds] = useState([book.id]);
  const [bundle, setBundle] = useState(false);
  const [ownership, setOwnership] = useState({ status: 'held', ownedBookIds: [], purchases: [] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [buyerDetails,setBuyerDetails]=useState({first_name:'',last_name:'',date_of_birth:'',phone:''});
  const [purchaseRulesAccepted,setPurchaseRulesAccepted]=useState(false);
  const [selfHelpAcknowledged,setSelfHelpAcknowledged]=useState(false);
  const updateDetail=(name,value)=>setBuyerDetails(previous=>({...previous,[name]:value}));
  const termsVersion=JOURNAL_CHECKOUT_TERMS_VERSION;
  const [ownerCode,setOwnerCode]=useState(''),[ownerQuote,setOwnerQuote]=useState(null);
  const loadOwnership=async(isActive=()=>true)=>{
    if(!JOURNAL_PURCHASES_ENABLED||(!book.releaseApproved&&!book.preorderApproved))return;
    setOwnership({status:'checking',ownedBookIds:[],purchases:[]});setError('');
    try{
      const response=await base44.functions.invoke('getJournalPurchases',{});
      const data=response?.data;
      if(!data||!Array.isArray(data.ownedBookIds)||!Array.isArray(data.purchases))throw new Error('Purchase lookup unavailable');
      if(isActive())setOwnership({...data,status:'ready'});
    }catch(error){
      if(!isActive())return;
      const status=error?.status||error?.response?.status;
      setOwnership({status:status===401||status===403?'sign_in_required':'unavailable',ownedBookIds:[],purchases:[]});
      if(status!==401&&status!==403)setError('Purchase access could not be checked. Sign in below or try again before paying.');
    }
  };
  useEffect(()=>{let active=true;loadOwnership(()=>active);return()=>{active=false;};},[]);
  const quote = journalBasketQuote({ books: PUBLIC_JOURNALS, selectedIds, ownedIds: ownership.ownedBookIds, bundle });
  const totalCents=ownerQuote&&quote.bookIds.length===1&&ownerQuote.bookId===quote.bookIds[0]?ownerQuote.totalCents:quote.totalCents;
  const applyOwnerCode=async()=>{
    if(busy||quote.bookIds.length!==1)return;setBusy(true);setError('');setOwnerQuote(null);
    try{const response=await base44.functions.invoke('createJournalCheckout',{action:'quote_owner_test',offer_id:quote.bookIds,owner_test_code:ownerCode});
      if(response?.data?.status!=='owner_test_quote'||response.data.total_cents!==99)throw Error('Owner discount unavailable');
      setOwnerQuote({bookId:quote.bookIds[0],totalCents:99,code:ownerCode});
    }catch{setError('This owner test code is not available for this verified account and selection. The normal price has not changed.');}
    finally{setBusy(false);}
  };
  const detailsComplete=Object.values(buyerDetails).every(value=>value.trim())&&!!ownership.buyer?.email;
  const includesPreorders=quote.bookIds.some(id=>!['building-resilience','healthy-boundaries'].includes(id));
  const mayPurchase = (!includesPreorders||ownership.offerTerms?.preorder?.approved===true)&&ownership.offerTerms?.termsVersion===termsVersion&&detailsComplete&&purchaseRulesAccepted&&selfHelpAcknowledged&&JOURNAL_PURCHASES_ENABLED && ownership.status === 'ready' &&
    quote.bookIds.length > 0 && quote.bookIds.every(id => {const item=PUBLIC_JOURNALS.find(item=>item.id===id);return item?.releaseApproved===true||item?.preorderApproved===true;});
  const existing = ownership.purchases.find(purchase => purchase.bookIds?.includes(book.id));
  const toggle = (id, checked) => {
    setBundle(false);setOwnerQuote(null);
    setSelectedIds(previous => checked ? [...new Set([...previous, id])] : previous.filter(item => item !== id));
  };
  const purchase = async () => {
    if (!mayPurchase || busy) return;
    setBusy(true); setError('');
    try {
      const response = await base44.functions.invoke('createJournalCheckout', {
        offer_id: quote.bookIds, bundle_requested: quote.bundle,catalogue_version:ownership.offerTerms?.catalogueVersion,
        expected_total_cents: totalCents,...(ownerQuote?{owner_test_code:ownerQuote.code}:{}),
        buyer_details:{...buyerDetails,email:ownership.buyer?.email},
        purchase_rules_accepted:purchaseRulesAccepted,self_help_acknowledged:selfHelpAcknowledged,terms_version:termsVersion
      });
      const data = response?.data || {};
      if(data.status==='already_owned'){
        setOwnership(previous=>({...previous,...data,status:'ready'}));return;
      }
      if(data.status==='selection_requires_confirmation'){
        setError('Your existing purchases changed this selection. Close and reopen the journal to review the updated total.');return;
      }
      if(data.status==='pending_selection_conflict'){
        setError('You already have an unpaid checkout with a different selection or price. Review or cancel it before starting another payment.');
        setOwnership(previous=>({...previous,pending:[data.pending]}));return;
      }
      if (!data.checkout_url) throw new Error('Please refresh your purchase selection before paying.');
      const url = new URL(data.checkout_url);
      if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com' || url.username || url.password || url.port) throw new Error('Checkout unavailable');
      window.location.assign(url.href);
    } catch {
      setError('Checkout could not be started. You have not been charged by this page. Please check any existing payment before trying again.');
    } finally { setBusy(false); }
  };
  const access = async () => {
    if (!JOURNAL_PURCHASES_ENABLED || !existing?.downloadableBookIds?.includes(book.id) || busy) return;
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
  if(!book.releaseApproved&&!book.preorderApproved)return <p className="font-body text-sm leading-relaxed">This journal is available to preview. Purchasing for this title and the all-six bundle is not yet open.</p>;
  return (
    <div className="font-body space-y-4" data-testid="journal-purchase-panel">
      {ownership.status!=='ready'&&<div className="rounded border p-4 space-y-3">
        <p className="text-sm font-semibold">Step 1 · Connect your verified journal account</p>
        <p className="text-sm">Your buyer details and checkout unlock after you sign in and verify your email. Keep your selected journal open while you complete this step.</p>
        <JournalAccount embedded onAuthenticated={()=>loadOwnership()}/>
      </div>}
      {ownership.status==='ready'&&<>
      <p className="text-sm">Step 2 · Enter your buyer details. Signed in as <span className="ph-no-capture">{ownership.buyer?.email}</span>.</p>
      <fieldset className="ph-no-capture grid gap-3 sm:grid-cols-2" disabled={busy||!JOURNAL_PURCHASES_ENABLED||ownership.status!=='ready'}>
       <legend className="text-sm font-semibold mb-2">Required buyer details</legend>
       <label className="text-sm">First name<input className="block w-full rounded border bg-background p-2 mt-1" required autoComplete="given-name" value={buyerDetails.first_name} onChange={e=>updateDetail('first_name',e.target.value)}/></label>
       <label className="text-sm">Last name<input className="block w-full rounded border bg-background p-2 mt-1" required autoComplete="family-name" value={buyerDetails.last_name} onChange={e=>updateDetail('last_name',e.target.value)}/></label>
       <label className="text-sm">Date of birth<input className="block w-full rounded border bg-background p-2 mt-1" required type="date" autoComplete="bday" max={new Date().toISOString().slice(0,10)} value={buyerDetails.date_of_birth} onChange={e=>updateDetail('date_of_birth',e.target.value)}/></label>
       <label className="text-sm">Phone number<input className="block w-full rounded border bg-background p-2 mt-1" required type="tel" autoComplete="tel" value={buyerDetails.phone} onChange={e=>updateDetail('phone',e.target.value)}/></label>
       <label className="text-sm sm:col-span-2">Verified email address<input className="block w-full rounded border bg-background p-2 mt-1" required type="email" readOnly value={ownership.buyer?.email||''}/></label>
      </fieldset>
      </>}
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold mb-2">Other journals you can choose to add</legend>
        {PUBLIC_JOURNALS.filter(item => item.id !== book.id).map(item => (
          <label key={item.id} className="flex gap-3 items-start text-sm">
            <input type="checkbox" disabled={busy||(!item.releaseApproved&&!item.preorderApproved)} checked={selectedIds.includes(item.id)} onChange={event => toggle(item.id, event.target.checked)} />
            <span>{item.title} · A$9.90 · {journalDeliveryLabel(item.id)}{ownership.ownedBookIds.includes(item.id) ? ' · Already purchased' : ''}</span>
          </label>
        ))}
      </fieldset>
      <label className="flex gap-3 items-start text-sm">
        <input type="checkbox" disabled={busy || !JOURNAL_BUNDLE_PURCHASES_ENABLED || !JOURNAL_BUNDLE_COUNT_CONFIRMED || ownership.ownedBookIds.length > 0} checked={quote.bundle}
          onChange={event => {
            setBundle(event.target.checked);setOwnerQuote(null);
            setSelectedIds(event.target.checked ? PUBLIC_JOURNALS.map(item => item.id) : [book.id]);
          }} />
        <span>All six journals · A$45 (save A$14.40) · purchasing not open</span>
      </label>
      <ul className="text-sm space-y-1" aria-label="Selected journals">
        {selectedIds.map(id => {
          const item = PUBLIC_JOURNALS.find(entry => entry.id === id);
          return <li key={id}>{item.title} · {quote.alreadyOwned.includes(id) ? 'Already purchased' : quote.bundle ? 'Included in bundle' : 'A$9.90'} · {journalDeliveryLabel(id)}</li>;
        })}
      </ul>
      {ownership.buyer?.ownerTestEligible&&quote.bookIds.length===1&&<div className="ph-no-capture rounded border p-3 space-y-2">
        <label className="block text-sm">Owner test code<input autoComplete="off" className="block w-full rounded border bg-background p-2 mt-1" value={ownerCode} onChange={e=>{setOwnerCode(e.target.value);setOwnerQuote(null);}} disabled={busy}/></label>
        <Button variant="outline" onClick={applyOwnerCode} disabled={busy||!ownerCode}>Apply owner test code</Button>
        {ownerQuote&&<p className="text-sm" role="status">Owner-only 90% test discount applied · A$9.90 reduced to A$0.99 for this journal.</p>}
      </div>}
      <p className="font-semibold" data-testid="journal-selection-total">Total: {'A$'}{(totalCents / 100).toFixed(2)}</p>
      {!JOURNAL_PURCHASES_ENABLED && <p className="text-sm text-muted-foreground">Online purchasing is being prepared.</p>}
      <p className="text-sm leading-relaxed text-foreground/90" id="journal-purchase-policy" data-testid="journal-delivery-notice">Digital journals are delivered by email after payment. Once delivered, we do not offer change-of-mind refunds. For further information about your consumer rights, visit the ACCC at <a className="underline text-primary" href="https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees" target="_blank" rel="noopener noreferrer">https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees</a>.</p>
      {includesPreorders&&<p className="text-sm leading-relaxed">{ownership.offerTerms?.preorder?.approved===true?'Undelivered preorders: '+ownership.offerTerms.preorder.cancellationText:'Preorder purchasing remains unavailable while its cancellation terms are confirmed.'}</p>}
      <label className="flex gap-3 items-start text-sm"><input type="checkbox" checked={purchaseRulesAccepted} disabled={busy} onChange={event=>setPurchaseRulesAccepted(event.target.checked)}/><span>I have read and agree to the <a className="underline text-primary" href="#journal-purchase-policy">purchase terms and refund policy</a>.</span></label>
      <label className="flex gap-3 items-start text-sm"><input type="checkbox" checked={selfHelpAcknowledged} disabled={busy} onChange={event=>setSelfHelpAcknowledged(event.target.checked)}/><span>I understand that these journals provide educational self-help and reflection activities. They are not psychological therapy, medical advice or a substitute for care from a qualified health professional.</span></label>
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      {ownership.status === 'unavailable' && <Button variant="outline" onClick={()=>loadOwnership()} disabled={busy}>Check purchase access again</Button>}
      {ownership.pending?.map(pending=><Link key={pending.sessionId} className="block text-sm text-primary underline"
        to={'/journals/purchase?session_id='+encodeURIComponent(pending.sessionId)}>Review your unpaid journal checkout</Link>)}
      {existing?.downloadableBookIds?.includes(book.id) ? <Button onClick={access} disabled={busy}>Access your purchased journal</Button> : existing ? <p className="text-sm">Already purchased · {journalDeliveryLabel(book.id)}. Do not purchase another copy.</p> : null}
      <Button onClick={purchase} disabled={!mayPurchase || busy}>{busy ? 'Please wait…' : 'Buy selected journals'}</Button>
      <p className="text-xs text-muted-foreground">
        {STORE_CRASHED ? 'Gannon Waye merchandise · online ordering currently unavailable' :
          <Link to="/store" className="underline">Gannon Waye merchandise</Link>}
      </p>
    </div>
  );
}
