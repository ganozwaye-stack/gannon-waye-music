import { createClientFromRequest } from 'npm:@base44/sdk@0.8.53';
import { saveInterest } from './policy.js';
const attempts=new Map<string,{count:number,start:number}>();
Deno.serve(async req => {
 if(req.method!=='POST') return Response.json({error:'POST required'},{status:405});
 // Closed by default. Owner must resolve minors policy and approve deployment
 // before opening intake; do not invent an age-admission rule.
 if(Deno.env.get('COACHING_INTEREST_OPEN')!=='true' || !Deno.env.get('COACHING_MINOR_INTAKE_POLICY')) return Response.json({error:'Registration is being prepared. No details have been saved.'},{status:503});
 try {
   if(Number(req.headers.get('content-length')||0)>8192) return Response.json({error:'Submission too large'},{status:413});
   const raw=await req.text();
   if(new TextEncoder().encode(raw).length>8192) return Response.json({error:'Submission too large'},{status:413});
   const body=JSON.parse(raw);
   // Process-local burst guard only; no raw network address is stored or logged.
   // Deployment requires trusted ingress rate limiting as this does not span replicas.
   const secret=Deno.env.get('COACHING_ABUSE_HASH_SECRET');
   if(!secret) return Response.json({error:'Registration is being prepared.'},{status:503});
   const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
   const hash=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value)))).map(v=>v.toString(16).padStart(2,'0')).join('');
   const fingerprint=await hash(req.headers.get('x-forwarded-for')||'unknown');
   const now=Date.now(),last=attempts.get(fingerprint);
   const attempt=!last||now-last.start>60000?{count:0,start:now}:last;
   attempt.count++;attempts.set(fingerprint,attempt);
   for(const [id,value] of attempts) if(now-value.start>60000) attempts.delete(id);
   if(attempt.count>5) return Response.json({error:'Please wait before submitting again.'},{status:429});
   const base44=createClientFromRequest(req);
   const receipt=await saveInterest(base44.asServiceRole.entities,body,{hashEmail:hash});
   return Response.json(receipt);
 } catch(error) {
   // Never log input, DOB, email, phone or sensitive support text.
   const safe=new Set(['Please check the required fields and their lengths.','Please enter a valid email address.','Please enter a valid mobile number.','Please enter a valid date of birth that is not in the future.','Please confirm that Gannon may contact you about your interest.','Please refresh the form and try again.','Please wait before submitting again.']);
   return Response.json({error:safe.has(error?.message)?error.message:'We could not confirm your submission. Please try again.'},{status:400});
 }
});