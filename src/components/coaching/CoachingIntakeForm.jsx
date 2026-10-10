import { useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { validateInterest } from '@/lib/coachingInterestPolicy';

export default function CoachingIntakeForm({ onSuccess }) {
 const [form,setForm]=useState({first_name:'',last_name:'',date_of_birth:'',phone:'',email:'',support_wanted:'',consent_to_contact:false,website:''});
 const [busy,setBusy]=useState(false),[receipt,setReceipt]=useState(''),[error,setError]=useState('');
 const inFlight=useRef(false),submissionId=useRef(null);
 const registrationOpen=import.meta.env.DEV||import.meta.env.VITE_COACHING_INTEREST_ENABLED==='true';
 const set=(key,value)=>setForm(previous=>({...previous,[key]:value}));
 const submit=async event=>{
   event.preventDefault();
   if(inFlight.current||receipt) return;
   if(!registrationOpen){setError('Registration is being prepared. No details have been submitted.');return;}
   submissionId.current ||= crypto.randomUUID();
   const payload={...form,submission_id:submissionId.current};
   try { validateInterest(payload); } catch(err) {setError(err.message);return;}
   inFlight.current=true;setBusy(true);setError('');
   try {
     const result=await base44.functions.invoke('submitCoachingInterest',payload);
     const data=result?.data;
     if(data?.saved!==true||data.receipt!==submissionId.current) throw new Error('Unable to confirm saved receipt');
     setReceipt(data.receipt);setForm({first_name:'',last_name:'',date_of_birth:'',phone:'',email:'',support_wanted:'',consent_to_contact:false,website:''});
     onSuccess?.();
   } catch {setError('Your submission has not been confirmed. Registration is being prepared; please try again when it opens.');}
   finally {inFlight.current=false;setBusy(false);}
 };
 if(receipt) return <div role="status" className="font-body py-8 space-y-3" data-testid="coaching-interest-success"><h3 className="text-xl font-bold text-[#F5D06E]">Thank you for reaching out.</h3><p>Your interest has been saved for Gannon to review. This is not an appointment booking or a payment.</p><p className="text-sm">Receipt: {receipt}</p></div>;
 return <form onSubmit={submit} className="font-body space-y-5 max-w-xl" data-testid="coaching-interest-form">
   <p className="text-sm text-foreground/80">Gannon will use your name, date of birth and contact details to review your interest and follow up with you. Your short message helps him understand what support you are looking for. These details stay in the private owner inbox and are not included in website analytics.</p>
   <p className="text-sm text-[#F5D06E]">Registration is being prepared. Submissions open after the private intake checks are complete.</p>
   <div className="grid sm:grid-cols-2 gap-4">
    {[['first_name','First name','text','given-name',80],['last_name','Last name','text','family-name',80],['date_of_birth','Date of birth','date','bday',10],['phone','Mobile number','tel','tel',30],['email','Email address','email','email',254]].map(([key,label,type,autoComplete,maxLength])=><div key={key} className="space-y-2"><Label htmlFor={'interest-'+key}>{label} *</Label><Input id={'interest-'+key} name={key} type={type} autoComplete={autoComplete} required maxLength={maxLength} max={type==='date'?new Date().toISOString().slice(0,10):undefined} value={form[key]} onChange={event=>set(key,event.target.value)} /></div>)}
   </div>
   <div className="space-y-2"><Label htmlFor="interest-support">What brings you here, and what would you like support with? *</Label><Textarea id="interest-support" name="support_wanted" required maxLength={1000} rows={4} value={form.support_wanted} onChange={event=>set('support_wanted',event.target.value)} /><p className="text-xs text-muted-foreground">A short message is enough. Please leave out detailed health information or journal answers.</p></div>
   <div className="hidden" aria-hidden="true"><label htmlFor="interest-website">Leave this blank</label><input id="interest-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={event=>set('website',event.target.value)} /></div>
   <label className="flex items-start gap-3 text-sm"><input type="checkbox" required checked={form.consent_to_contact} onChange={event=>set('consent_to_contact',event.target.checked)} className="mt-1" />Gannon may contact me about my interest.</label>
   <p className="text-sm">Registering interest does not commit you to a call. You can explore and purchase journals independently when journal purchasing opens.</p>
   {error&&<p role="alert" className="text-sm text-red-300">{error}</p>}
   <Button type="submit" disabled={busy||!registrationOpen} className="bg-[#F5D06E] text-primary-foreground rounded-full min-h-12 px-7">{busy?'Saving…':'Register your interest'}</Button>
 </form>;
}
