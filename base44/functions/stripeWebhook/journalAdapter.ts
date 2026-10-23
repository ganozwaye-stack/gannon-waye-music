import {createClientFromRequest} from 'npm:@base44/sdk@0.8.30';
import Stripe from 'npm:stripe@22.6.0';
import {createJournalWebhookHandler} from './journal/journalHttp.js';
import {RELEASE_CONFIG} from './journal/releaseConfig.js';
export const isJournalEvent=(event:any)=>event?.data?.object?.metadata?.checkout_policy==='gw_paid_journals_v1';
const sha256=async(bytes:BufferSource)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
export function journalWebhook(req:Request){
 const createStripe=()=>{
  const key=RELEASE_CONFIG.stripeKeyEnv?Deno.env.get(RELEASE_CONFIG.stripeKeyEnv):'';
  if(!key||!key.startsWith(RELEASE_CONFIG.liveMode?'sk_live_':'sk_test_'))throw Error('Payment binding unavailable');
  return new Stripe(key,{apiVersion:'2026-08-26.dahlia'});
 };
 const webhookSecret=()=>{
  const value=RELEASE_CONFIG.stripeWebhookSecretEnv?Deno.env.get(RELEASE_CONFIG.stripeWebhookSecretEnv):'';
  if(!value?.startsWith('whsec_'))throw Error('Webhook binding unavailable');return value;
 };
 return createJournalWebhookHandler({release:RELEASE_CONFIG,createStripe,createRequestClient:createClientFromRequest,sha256,webhookSecret,
  resolveBuyer:async(client:any,id:string)=>client.asServiceRole.entities.User.get(id),
  sendJournalEmail:async(message:any)=>{
   const receipt=await createClientFromRequest(req).asServiceRole.integrations.Core.SendEmail(message);
   return {accepted:receipt?.accepted===true||receipt?.success===true};
  }})(req);
}
