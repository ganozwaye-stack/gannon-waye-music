import {createClientFromRequest} from 'npm:@base44/sdk@0.8.53';
import {summarizeWebsite} from './policy.js';
import {isWebsiteOwner} from './ownerPolicy.js';
Deno.serve(async req=>{
 const base44=createClientFromRequest(req),user=await base44.auth.me().catch(()=>null);
 if(!isWebsiteOwner(user))return Response.json({error:'Owner access required'},{status:403});
 try{
 const body=await req.json().catch(()=>({}));
 const start=Date.parse(String(body.start||'')+'T00:00:00Z'),endDay=Date.parse(String(body.end||'')+'T00:00:00Z'),end=endDay+86400000;
 if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||end-start>366*86400000)return Response.json({error:'Choose a valid date range of up to one year.'},{status:400});
 async function read(entity: {list: (...args: any[]) => Promise<any[]>},fields: string[]){const rows=[];let limited=false;for(let skip=0;skip<20000;skip+=500){const page=await entity.list('-created_date',500,skip,fields);rows.push(...page);if(page.length<500)return {rows,limited:false};}return {rows,limited:true};}
 // Field projection excludes all contact details, DOB and support text.
 const [events,leads,orders]=await Promise.all([
 read(base44.entities.WebsiteEvent,['event_id','event_name','created_date','created_by','is_sample','analytics_excluded']),
 read(base44.entities.CoachingLead,['id','submission_id','created_date','created_by','is_sample','analytics_excluded','duplicate_submission']),
 read(base44.asServiceRole.entities.MerchOrder,['stripe_session_id','stripe_event_id','created_date','created_by','checkout_policy','status','financial_status','payment_status','payment_verified','total_amount','refunded_amount','attribution','is_sample','analytics_excluded','excluded_from_revenue'])
 ]);
 return Response.json({...summarizeWebsite(events.rows,leads.rows,orders.rows,start,end),limited:events.limited||leads.limited||orders.limited,timezone:'UTC',capture_enabled:Deno.env.get('WEBSITE_ANALYTICS_OPEN')==='true'});
 }catch{return Response.json({error:'Owner aggregate statistics are being prepared'},{status:503});}
});