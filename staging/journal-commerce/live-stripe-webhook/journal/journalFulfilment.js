import {isJournalPrivateUri} from './journalPrivateUri.js';
import {JournalAccessError} from './journalCommerce.js';
const fail=code=>{throw new JournalAccessError(code,503);};
const text=v=>typeof v==='string'?v.trim():'';
export function journalPreorderTerms(catalogue){
 const p=catalogue?.preorder;
 if(catalogue?.fulfilmentType!=='mixed'||p?.saleApproved!==true||p.cancellationPolicyApproved!==true||
  !text(p.termsVersion)||!text(p.cancellationText)||!/^\d{4}-\d{2}-\d{2}$/.test(p.releaseDate||'')||
  p.timeZone!=='Australia/Melbourne'||!text(p.releaseLabel)||!Number.isFinite(Date.parse(p.releaseStartsAt))||
  !Number.isFinite(Date.parse(p.deliveryBy))||Date.parse(p.releaseStartsAt)>=Date.parse(p.deliveryBy))
  fail('preorder_terms_not_ready');
 const local=value=>Object.fromEntries(new Intl.DateTimeFormat('en-AU',{timeZone:p.timeZone,year:'numeric',month:'2-digit',
  day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(value)).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
 const start=local(p.releaseStartsAt),end=local(p.deliveryBy);
 const day=x=>x.year+'-'+x.month+'-'+x.day;
 if(day(start)!==p.releaseDate||day(end)!==p.releaseDate||start.hour!=='00'||start.minute!=='00'||start.second!=='00'||
  end.hour!=='23'||end.minute!=='59'||end.second!=='59'||new Date(p.releaseStartsAt).getUTCMilliseconds()!==0||
  new Date(p.deliveryBy).getUTCMilliseconds()!==999)fail('preorder_terms_not_ready');
 return {termsVersion:p.termsVersion,releaseDate:p.releaseDate,timeZone:p.timeZone,releaseLabel:p.releaseLabel,
  releaseStartsAt:p.releaseStartsAt,deliveryBy:p.deliveryBy,cancellationText:p.cancellationText};
}
export function journalItemPlan(catalogue,book){
 if(book?.releaseApproved===true){
  if(!isJournalPrivateUri(book.fileUri)||!/^[a-f0-9]{64}$/.test(book.sha256||''))fail('journal_not_ready');
  return {bookId:book.id,fulfilmentType:'released',editionVersion:String(book.editionVersion||catalogue.approvedVersion),sha256:book.sha256};
 }
 if(book?.preorderApproved!==true)fail('journal_not_ready');
 const p=journalPreorderTerms(catalogue);
 return {bookId:book.id,fulfilmentType:'preorder',releaseDate:p.releaseDate,timeZone:p.timeZone,
  releaseLabel:p.releaseLabel,termsVersion:p.termsVersion,releaseStartsAt:p.releaseStartsAt,deliveryBy:p.deliveryBy};
}
export function journalItemPlans(catalogue,bookIds){
 return [...bookIds].sort().map(id=>{const book=catalogue.books.find(b=>b.id===id);if(!book)fail('journal_not_found');return journalItemPlan(catalogue,book);});
}
export function journalAssetBindings(catalogue,bookIds){
 return journalItemPlans(catalogue,bookIds).map(p=>p.fulfilmentType==='released'?[p.bookId,p.sha256]:
  [p.bookId,'preorder',p,journalPreorderTerms(catalogue)]);
}
export function journalFulfilmentSummary(items){
 const downloadableBookIds=items.filter(p=>p.fulfilmentType==='released').map(p=>p.bookId);
 const fulfilmentType=downloadableBookIds.length===items.length?'released':downloadableBookIds.length?'mixed':'preorder';
 return {fulfilmentType,fulfilmentStatus:fulfilmentType==='released'?'paid_release_verified':
  fulfilmentType==='mixed'?'paid_partial_release':'paid_pending_release',
  items,downloadableBookIds,downloadReady:downloadableBookIds.length>0};
}
export function releasedJournalBook(catalogue,bookId,releaseBindings={},now=Date.now()){
 const book=catalogue.books.find(b=>b.id===bookId),plan=journalItemPlan(catalogue,book);
 if(plan.fulfilmentType==='released')return book;
 const binding=releaseBindings[bookId];
 if(now<Date.parse(plan.releaseStartsAt)||binding?.releaseApproved!==true||
  binding.catalogueVersion!==catalogue.approvedVersion||binding.bookId!==bookId||
  !text(binding.editionVersion)||!isJournalPrivateUri(binding.fileUri)||
  !/^[a-f0-9]{64}$/.test(binding.sha256||''))fail('journal_awaiting_release');
 return {...book,id:bookId,releaseApproved:true,fileUri:binding.fileUri,sha256:binding.sha256,editionVersion:binding.editionVersion};
}
export function assertJournalCheckoutTiming(catalogue,bookIds,now=Date.now()){
 const pending=journalItemPlans(catalogue,bookIds).filter(p=>p.fulfilmentType==='preorder');
 if(pending.some(p=>Date.parse(p.deliveryBy)<now+30*60*1000))fail('preorder_delivery_date_passed');
}
