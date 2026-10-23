import {PUBLIC_JOURNALS} from './publicJournalCatalogue.js';
export function assertJournalPurchaseState(data){
 if(data?.status!=='paid')return;
 const known=id=>PUBLIC_JOURNALS.some(b=>b.id===id);
 if(!data.orderId||!Array.isArray(data.bookIds)||data.bookIds.length<1||new Set(data.bookIds).size!==data.bookIds.length||
  data.bookIds.some(id=>!known(id)))throw Error('Unverified paid order');
 if(!data.items){
  if(data.fulfilmentType!=='released'||data.downloadReady!==true)throw Error('Unverified paid order');
  return;
 }
 if(!['released','mixed','preorder'].includes(data.fulfilmentType)||!Array.isArray(data.items)||
  data.items.length!==data.bookIds.length||new Set(data.items.map(p=>p.bookId)).size!==data.bookIds.length||
  data.items.some(p=>!data.bookIds.includes(p.bookId)||!['released','preorder'].includes(p.fulfilmentType)||
   (p.fulfilmentType==='preorder'&&(!/^\d{4}-\d{2}-\d{2}$/.test(p.releaseDate||'')||p.timeZone!=='Australia/Melbourne'))))
  throw Error('Unverified item plan');
 const ids=data.downloadableBookIds;
 if(!Array.isArray(ids)||new Set(ids).size!==ids.length||ids.some(id=>!data.bookIds.includes(id))||
  data.downloadReady!==(ids.length>0))throw Error('Unverified download entitlement');
 if(ids.some(id=>data.items.find(p=>p.bookId===id).fulfilmentType!=='released'&&
  !data.releasedItems?.some(p=>p.bookId===id&&/^[a-f0-9]{64}$/.test(p.sha256||'')&&p.editionVersion)))
  throw Error('Unverified final edition');
 const immediate=data.items.filter(p=>p.fulfilmentType==='released').length;
 if(data.fulfilmentType!==(immediate===data.items.length?'released':immediate?'mixed':'preorder'))
  throw Error('Unverified fulfilment type');
}
