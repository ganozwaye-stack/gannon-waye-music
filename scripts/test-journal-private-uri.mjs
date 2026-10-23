import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const names=['createJournalCheckout','getJournalPurchases','confirmJournalPurchase','cancelJournalCheckout','downloadJournal','journalStripeWebhook'];
const roots=names.map(n=>'../staging/journal-commerce/functions/'+n+'/');
roots.push('../staging/journal-commerce/functions/journalLaunchSetup/journal/');
roots.push('../staging/journal-commerce/live-stripe-webhook/journal/');
const canonical='mp/private/69eb7905ca6eb4180010f794/572829079_BuildingResilience1.pdf';
const invalid=[null,1,'',canonical+' ', ' '+canonical,'mp/private/foreign/file.pdf','mp/private/69eb7905ca6eb4180010f794x/file.pdf','mp/public/69eb7905ca6eb4180010f794/file.pdf','https://example.invalid/file.pdf','//example.invalid/file.pdf','private/../file.pdf','private/a/./file.pdf','private/%2e%2e/file.pdf','private/%252e%252e/file.pdf','private/a%2ffile.pdf','private/a%5cfile.pdf','private/a\\file.pdf','private/a//file.pdf','private/','private/a?x','private/a#x','private/a\nfile.pdf'];
let assertions=0;
for(const root of roots){
 const {isJournalPrivateUri}=await import(root+'journalPrivateUri.js');
 for(const value of [canonical,'private/fixture/file.pdf']){assert.equal(isJournalPrivateUri(value),true);assertions++;}
 let calls=0;const pdf=new TextEncoder().encode('%PDF-synthetic-private-fixture');
 const {createPrivateFileReader}=await import(root+'journalHttp.js');
 const reader=createPrivateFileReader({core:{CreateFileSignedUrl:async()=>{calls++;return {signed_url:'https://media.base44.com/opaque'};}},fetchImpl:async(_url,options)=>{assert.equal(options.redirect,'manual');return new Response(pdf);},allowedHosts:['media.base44.com']});
 for(const value of invalid){assert.equal(isJournalPrivateUri(value),false);await assert.rejects(reader(value));assert.equal(calls,0);assertions+=3;}
 assert.deepEqual(await reader(canonical),pdf);assert.equal(calls,1);assertions+=2;
 const {verifyJournalDeliverables}=await import(root+'journalCommerce.js');
 const books=Array.from({length:6},(_,i)=>({id:'fixture-'+i,title:'Fixture '+i,priceCents:990,releaseApproved:i===0,...(i===0?{fileUri:canonical,sha256:createHash('sha256').update(pdf).digest('hex')}:{} )}));
 const catalogue={enabled:true,approvedVersion:'uri-fixture',books,bundleId:'fixture-bundle',bundleEnabled:false,bundlePriceCents:4500};
 const args={catalogue,bookIds:['fixture-0'],readPrivateFile:reader,sha256:bytes=>createHash('sha256').update(bytes).digest('hex')};
 await verifyJournalDeliverables(args);await assert.rejects(verifyJournalDeliverables({...args,sha256:()=> '0'.repeat(64)}));assertions+=2;
 const hostile=createPrivateFileReader({core:{CreateFileSignedUrl:async()=>({signed_url:'https://evil.example.invalid/file'})},fetchImpl:async()=>{throw Error('must not fetch');},allowedHosts:['media.base44.com']});
 await assert.rejects(hostile(canonical));assertions++;
 for(const response of [new Response(null,{status:302,headers:{location:'https://evil.example.invalid/private'}}),{ok:true,redirected:true}]){let fetches=0;const redirected=createPrivateFileReader({core:{CreateFileSignedUrl:async()=>({signed_url:'https://media.base44.com/opaque'})},fetchImpl:async()=>{fetches++;return response;},allowedHosts:['media.base44.com']});await assert.rejects(redirected(canonical));assert.equal(fetches,1);assertions+=2;}
}
console.log('PASS private URI and delivery guards:',assertions,'assertions across',roots.length,'copies; synthetic, no network.');
