import {createClientFromRequest} from 'npm:@base44/sdk@0.8.30';
import Stripe from 'npm:stripe@22.6.0';
import {createJournalHttpHandler} from './journalHttp.js';
import {RELEASE_CONFIG} from './releaseConfig.js';
import {JournalAccessError} from './journalCommerce.js';
const sha256=async (bytes: BufferSource)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),byte=>byte.toString(16).padStart(2,'0')).join('');
const createStripe=()=>{
 if(!RELEASE_CONFIG.stripeKeyEnv)throw new JournalAccessError('payment_binding_not_configured',503);
 const key=Deno.env.get(RELEASE_CONFIG.stripeKeyEnv);if(!key)throw new JournalAccessError('payment_binding_not_configured',503);
 if(RELEASE_CONFIG.liveMode?!key.startsWith('sk_live_'):!key.startsWith('sk_test_'))throw new JournalAccessError('payment_mode_not_configured',503);
 return new Stripe(key,{apiVersion:'2026-08-26.dahlia'});
};
Deno.serve((req:Request)=>createJournalHttpHandler('createJournalCheckout',{release:RELEASE_CONFIG,createRequestClient:createClientFromRequest,createStripe,sha256,fetchImpl:fetch,sendJournalEmail:async(message:any)=>{const receipt=await createClientFromRequest(req).asServiceRole.integrations.Core.SendEmail(message);return {accepted:receipt?.accepted===true||receipt?.success===true};}})(req));
