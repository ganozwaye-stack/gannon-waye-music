import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { PUBLIC_JOURNALS, JOURNAL_PURCHASES_ENABLED } from '@/lib/publicJournalCatalogue';
export default function JournalPurchaseReturn(){
 const [params]=useSearchParams(),sessionId=params.get('session_id');
 const [state,setState]=useState({status:'held'}),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const refresh=async()=>{
  if(!JOURNAL_PURCHASES_ENABLED)return;
  if(!/^cs_(test|live)_[A-Za-z0-9]{16,200}$/.test(sessionId||'')){setState({status:'invalid'});return;}
  setBusy(true);setMessage('');
  try{
   const response=await base44.functions.invoke('confirmJournalPurchase',{session_id:sessionId});
   const data=response?.data;
   if(!['paid','pending','confirming','expired'].includes(data?.status))throw Error('Unavailable');
   if(data.status==='paid'&&(!Array.isArray(data.bookIds)||data.bookIds.some(id=>!PUBLIC_JOURNALS.some(b=>b.id===id))))throw Error('Unavailable');
   setState(data);
  }catch{setState({status:'unavailable'});setMessage('We could not confirm this payment. Sign in to the purchasing account and check again before buying the same journal.');}
  finally{setBusy(false);}
 };
 useEffect(()=>{refresh();},[sessionId]);
 const download=async id=>{
  if(state.status!=='paid'||busy||!JOURNAL_PURCHASES_ENABLED)return;
  setBusy(true);setMessage('');
  try{
   const response=await base44.functions.fetch('/downloadJournal',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({session_id:sessionId,book_id:id})});
   if(!response.ok||!response.headers.get('content-type')?.includes('application/pdf'))throw Error('Unavailable');
   const url=URL.createObjectURL(await response.blob()),link=document.createElement('a');
   link.href=url;link.download=id+'.pdf';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch{setMessage('Access could not be confirmed. Please try again; do not buy another copy.');}
  finally{setBusy(false);}
 };
 const resume=()=>{
  try{const url=new URL(state.checkoutUrl);if(url.protocol==='https:'&&url.hostname==='checkout.stripe.com'&&!url.username&&!url.password)window.location.assign(url.href);}
  catch{setMessage('Checkout is unavailable. Please check again before paying.');}
 };
 return <main className="container mx-auto px-6 py-16 max-w-3xl font-body" data-testid="journal-purchase-return">
  <h1 className="font-display text-4xl mb-6">Your journals</h1>
  {!JOURNAL_PURCHASES_ENABLED?<p>Online purchasing is being prepared. No payment is accepted by this page.</p>:<>
   {busy&&<p role="status">Checking your purchase…</p>}
   {state.status==='paid'&&<><p className="mb-5">Your payment has been verified. Choose a purchased journal to download.</p>
    <ul className="space-y-4">{state.bookIds.map(id=><li key={id} className="flex flex-wrap gap-4 items-center">
     <span>{PUBLIC_JOURNALS.find(b=>b.id===id)?.title}</span><Button disabled={busy} onClick={()=>download(id)}>Download journal</Button></li>)}</ul></>}
   {state.status==='pending'&&<><p>Your checkout is still unpaid.</p><Button disabled={busy} onClick={resume}>Resume this checkout</Button></>}
   {state.status==='confirming'&&<p>Payment confirmation is pending. Please check again before starting another checkout.</p>}
   {state.status==='expired'&&<p>This checkout has expired. Check your existing purchases before choosing another checkout.</p>}
   {state.status==='invalid'&&<p>This purchase reference is invalid.</p>}
   {message&&<p role="alert" className="my-5">{message}</p>}
   <div className="flex flex-wrap gap-4 my-6"><Button disabled={busy} onClick={refresh}>Check again</Button>
    <Button variant="outline" onClick={()=>base44.auth.redirectToLogin(window.location.href)}>Sign in to purchasing account</Button></div>
  </>}
  <Link className="inline-block mt-8 text-primary underline" to="/coaching#journals">Back to the journals</Link>
 </main>;
}
