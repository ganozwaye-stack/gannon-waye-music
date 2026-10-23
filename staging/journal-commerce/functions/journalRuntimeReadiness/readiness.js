const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
export function createJournalReadinessHandler({createClient,env,fetchImpl}){
 return async req=>{
  if(req.method!=='POST')return json({error:'method_not_allowed'},405);
  if(!/^Bearer\s+\S+$/i.test(req.headers.get('authorization')||''))return json({error:'sign_in_required'},401);
  let user;try{user=await createClient(req).auth.me();}catch{return json({error:'sign_in_required'},401);}
  if(user?.role!=='admin'||user.disabled===true||user.is_service===true||
   (user.app_id&&user.app_id!=='69eb7905ca6eb4180010f794'))return json({error:'admin_required'},403);
  const secret=env('STRIPE_SECRET_KEY')||'',pub=env('STRIPE_PUBLISHABLE_KEY')||'',webhook=env('STRIPE_WEBHOOK_SECRET')||'';
  const mode=secret.startsWith('sk_test_')?'test':secret.startsWith('sk_live_')?'live':'unknown';
  const result={version:'gw_journal_readiness_v1',checkedAt:new Date().toISOString(),nativeEmailVerified:user.is_verified===true,
   secretPresent:!!secret,secretMode:mode,publishableMode:pub.startsWith('pk_test_')?'test':pub.startsWith('pk_live_')?'live':'unknown',
   webhookPresent:!!webhook,webhookFormatValid:webhook.startsWith('whsec_')};
  if(mode==='unknown')return json(result);
  try{
   const response=await fetchImpl('https://api.stripe.com/v1/account',{headers:{Authorization:'Bearer '+secret},signal:AbortSignal.timeout(10000)});
   result.providerStatus=response.status;
   if(response.ok){const account=await response.json();result.accountId=account.id;result.chargesEnabled=account.charges_enabled===true;
    result.matchesObservedTestAccount=mode==='test'&&account.id==='acct_1TRr35ClJA0hGwhH';}
  }catch{result.providerRead='unavailable';}
  return json(result);
 };
}
