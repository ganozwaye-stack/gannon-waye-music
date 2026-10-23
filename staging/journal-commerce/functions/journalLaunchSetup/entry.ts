import {createClientFromRequest} from 'npm:@base44/sdk@0.8.30';
import Stripe from 'npm:stripe@22.6.0';
import {createJournalLaunchSetup} from './setup.js';
Deno.serve(createJournalLaunchSetup({createClient:createClientFromRequest,env:(name:string)=>Deno.env.get(name),createStripe:(key:string)=>new Stripe(key,{httpClient:Stripe.createFetchHttpClient(),maxNetworkRetries:0,timeout:15000})}));
