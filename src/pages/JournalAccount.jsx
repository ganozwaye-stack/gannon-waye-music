import {useState} from 'react';
import {Link} from 'react-router-dom';
import {base44} from '@/api/base44Client';
import {Button} from '@/components/ui/button';

// Persist the session token so the session survives a page refresh.
const persistToken = result => {
 const token=result?.token||result?.access_token||result?.session?.token;
 if(typeof token==='string'&&token)localStorage.setItem('base44_access_token',token);
};

export default function JournalAccount({embedded=false,onAuthenticated}){
 const [mode,setMode]=useState('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[code,setCode]=useState('');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[signedIn,setSignedIn]=useState(false);
 const finish=async()=>{
  // user === null (or a thrown error) means NOT SIGNED IN, never "unverified email".
  let user=null,authError=null;
  try{user=await base44.auth.me();}
  catch(error){authError=error;}
  if(!user){
   setMode('login');
   setMessage('You are not signed in yet. Enter your email address and password, then choose Sign in.'+(authError?.message?' ('+String(authError.message)+')':''));
   return;
  }
  if(user?.is_verified!==true){setMode('verify');setMessage('Verify your email with the code from Base44 before purchasing.');return;}
  setPassword('');setSignedIn(true);setMessage('You are signed in as '+user.email+'.');
  if(onAuthenticated){await onAuthenticated(user);return;}window.location.assign('/coaching#journals');
 };
 const submit=async event=>{
  event.preventDefault();if(busy)return;setBusy(true);setMessage('');
  try{
   if(mode==='register'){persistToken(await base44.auth.register({email:email.trim().toLowerCase(),password}));setMode('verify');setMessage('Enter the verification code sent to your email.');}
   else if(mode==='verify'){
    if(!password){setMessage('Enter your password below the code as well: after your email is verified, your password signs you in. If you would rather sign in first, choose Sign in.');return;}
    persistToken(await base44.auth.verifyOtp({email:email.trim().toLowerCase(),otpCode:code.trim()}));setCode('');
    persistToken(await base44.auth.loginViaEmailPassword(email.trim().toLowerCase(),password));
    await finish();
   }
   else{persistToken(await base44.auth.loginViaEmailPassword(email.trim().toLowerCase(),password));await finish();}
  }catch(error){
   const status=error?.status||error?.response?.status;
   const detail=String(error?.code||'')+' '+String(error?.message||'');
   if(status===429)setMessage('Too many attempts. Please wait a few minutes before trying again.');
   else if(status===409||/already.{0,20}(exist|register)|user.{0,12}exists/i.test(detail))setMessage('An account already exists for this email. Choose Sign in below to continue.');
   else if(mode==='verify')setMessage('That verification code is invalid or has expired. Check the latest code emailed by Base44, or request another code below.');
   else if(status===401||status===403)setMessage('Sign-in failed: the email address or password is incorrect. Check them and try again.');
   else if(/not.{0,10}verified|email.{0,10}verif/i.test(detail)&&mode!=='verify'){setMode('verify');setMessage('Verify your email using the code sent by Base44. You can request another code below.');}
   else if(mode==='register'&&/password/i.test(detail))setMessage('The password does not meet the account requirements. Please check it and try again.');
   else if(mode==='register')setMessage('Account creation was not completed. If you already have an account, choose Sign in. Otherwise check your email address and password and try again.');
   else if(mode==='verify')setMessage('Email verification was not completed. Check the code or request another code below.');
   else setMessage('Sign-in was not completed. Check your email address and password and try again.');
  }
  finally{setBusy(false);}
 };
 const resend=async()=>{
  if(busy||!email.trim())return;setBusy(true);
  try{await base44.auth.resendOtp(email.trim().toLowerCase());setMessage('A new verification code has been requested.');}
  catch(error){
   const status=error?.status||error?.response?.status;
   setMessage(status===429?'Too many code requests. Please wait a few minutes before trying again.':'The code could not be requested. Please try again later.');
  }finally{setBusy(false);}
 };
 const Wrapper=embedded?'section':'main';
 return <Wrapper className={embedded?'ph-no-capture space-y-4 font-body':'ph-no-capture container mx-auto max-w-xl px-6 py-16 font-body'}>
  <h1 className={embedded?"text-xl font-bold":"text-3xl font-bold mb-4"}>Sign in or create your journal account</h1>
  <p className="mb-6">New here? Choose Create a journal account, then verify your email with the code sent by Base44. Already have an account? Sign in. Buyer details appear after your verified account is connected.</p>
  <form className="space-y-4" onSubmit={submit}>
   <label className="block">Email address<input className="block w-full rounded border bg-background p-3 mt-1" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} disabled={busy}/></label>
   {mode==='verify'?<>
     <label className="block">Email verification code<input className="block w-full rounded border bg-background p-3 mt-1" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={e=>setCode(e.target.value)} disabled={busy}/></label>
     <label className="block">Password (used to sign you in after verification)<input className="block w-full rounded border bg-background p-3 mt-1" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} disabled={busy}/></label>
    </>:
    <label className="block">Password<input className="block w-full rounded border bg-background p-3 mt-1" type="password" autoComplete={mode==='register'?'new-password':'current-password'} required value={password} onChange={e=>setPassword(e.target.value)} disabled={busy}/></label>}
   <Button type="submit" disabled={busy}>{busy?'Please wait…':mode==='verify'?'Verify email':mode==='register'?'Create account':'Sign in'}</Button>
  </form>
  {signedIn&&message&&<p className="my-4 font-bold text-primary" role="status">{message}</p>}
  {!signedIn&&message&&<p className="my-4" role="status">{message}</p>}
  <div className="flex flex-wrap gap-4 my-6">
   <Button variant="outline" disabled={busy||mode==='login'} onClick={()=>{setMode('login');setMessage('');}}>Sign in</Button>
   <Button variant="outline" disabled={busy||mode==='register'} onClick={()=>{setMode('register');setMessage('');}}>Create a journal account</Button>
   <Button variant="outline" disabled={busy||mode==='verify'} onClick={()=>{setMode('verify');setCode('');setMessage('Enter your email and verification code, then your password, and submit. You can also request another code.');}}>Verify existing account</Button>
   {mode==='verify'&&<Button variant="outline" disabled={busy} onClick={resend}>Request another code</Button>}
  </div>
  {!embedded&&<Link className="underline text-primary" to="/coaching#journals">Back to journals</Link>}
 </Wrapper>;
}