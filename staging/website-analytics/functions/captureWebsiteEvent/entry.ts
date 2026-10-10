import {createClientFromRequest} from 'npm:@base44/sdk@0.8.53';
import {sanitizeEvent} from './policy.js';
const burst=new Map();
Deno.serve(async req=>{
 if(req.method!=='POST')return Response.json({error:'POST required'},{status:405});
 if(Deno.env.get('WEBSITE_ANALYTICS_OPEN')!=='true')return Response.json({error:'Analytics is being prepared'},{status:503});
 try{
 const text=await req.text();if(new TextEncoder().encode(text).length>2048)return Response.json({error:'Event too large'},{status:413});
 const event=sanitizeEvent(JSON.parse(text));if(!event)return Response.json({error:'Unsupported event'},{status:400});
 const base44=createClientFromRequest(req),actor=await base44.auth.me().catch(()=>null);
 if(actor?.role==='admin')return Response.json({accepted:false,excluded:true});
 // Process-local burst limit; trust-boundary/replica load test required before activation.
 const key=req.headers.get('x-forwarded-for')||'unknown',now=Date.now();
 let value=burst.get(key);if(!value||now-value.start>60000)value={start:now,count:0};
 value.count++;burst.set(key,value);for(const [id,state] of burst)if(now-state.start>60000)burst.delete(id);
 if(value.count>120)return Response.json({error:'Too many events'},{status:429});
 const rows=await base44.asServiceRole.entities.WebsiteEvent.filter({event_id:event.event_id},'created_date',1);
 if(!rows.length)await base44.asServiceRole.entities.WebsiteEvent.create(event);
 return Response.json({accepted:true});
 }catch{return Response.json({error:'Event unavailable'},{status:503});}
});