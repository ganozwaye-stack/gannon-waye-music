import {createClientFromRequest} from 'npm:@base44/sdk@0.8.30';
import {createJournalReadinessHandler} from './readiness.js';
Deno.serve(createJournalReadinessHandler({createClient:createClientFromRequest,env:(name:string)=>Deno.env.get(name),fetchImpl:fetch}));
