import {useState} from 'react';
import {Link} from 'react-router-dom';
import {base44} from '@/api/base44Client';
import {Button} from '@/components/ui/button';
export default function JournalAccount(){
 const [mode,setMode]=useState('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[code,setCode]=useState('');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 const finish=async()=>{
  const user=await base44.auth.me();
  if(user?.is_verified!==true){setMode('verify');setMessage('Verify your email with the code from Base44 before purchasing.');return;}
  setPassword('');window.location.assign('/coaching#journals');
 };
 const submit=async event=>{
  event.preventDefault();if(busy)return;setBusy(true);setMessage('');
  try{
   if(mode==='register'){await base44.auth.register({email:email.trim().toLowerCase(),password});setMode('verify');setMessage('Enter the verification code sent to your email.');}
   else if(mode==='verify'){await base44.auth.verifyOtp({email:email.trim().toLowerCase(),otpCode:code.trim()});setCode('');if(password){await base44.auth.loginViaEmailPassword(email.trim().toLowerCase(),password);await finish();}else{setMode('login');setMessage('Email verified. Sign in to continue.');}}
   else{await base44.auth.loginViaEmailPassword(email.trim().toLowerCase(),password);await finish();}
  }catch{setMessage('This step could not be completed. Check your details or request a new verification code.');}
  finally{setBusy(false);}
 };
 const resend=async()=>{
  if(busy||!email.trim())return;setBusy(true);
  try{await base44.auth.resendOtp(email.trim().toLowerCase());setMessage('A new verification code has been requested.');}
  catch{setMessage('The code could not be requested. Please try again later.');}finally{setBusy(false);}
 };
 return <main className="ph-no-capture container mx-auto max-w-xl px-6 py-16 font-body">
  <h1 className="text-3xl font-bold mb-4">Your journal account</h1>
  <p className="mb-6">Use your own email address. Base44 verifies ownership with an emailed code before journal purchases.</p>
  <form className="space-y-4" onSubmit={submit}>
   <label className="block">Email address<input className="block w-full rounded border bg-background p-3 mt-1" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} disabled={busy}/></label>
   {mode==='verify'?<label className="block">Email verification code<input className="block w-full rounded border bg-background p-3 mt-1" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value)} disabled={busy}/></label>:
    <label className="block">Password<input className="block w-full rounded border bg-background p-3 mt-1" type="password" autoComplete={mode==='register'?'new-password':'current-password'} required value={password} onChange={e=>setPassword(e.target.value)} disabled={busy}/></label>}
   <Button type="submit" disabled={busy}>{busy?'Please wait…':mode==='verify'?'Verify email':mode==='register'?'Create account':'Sign in'}</Button>
  </form>
  {message&&<p className="my-4" role="status">{message}</p>}
  <div className="flex flex-wrap gap-4 my-6">
   <Button variant="outline" disabled={busy} onClick={()=>{setMode(mode==='register'?'login':'register');setMessage('');}}> {mode==='register'?'Already have an account? Sign in':'Create a journal account'}</Button>
   {mode==='verify'&&<Button variant="outline" disabled={busy} onClick={resend}>Request another code</Button>}
  </div>
  <Link className="underline text-primary" to="/coaching#journals">Back to journals</Link>
 </main>;
}
