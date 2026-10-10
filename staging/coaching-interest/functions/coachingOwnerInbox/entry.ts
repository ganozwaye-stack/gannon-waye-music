import { createClientFromRequest } from 'npm:@base44/sdk@0.8.53';
import { isWebsiteOwner } from './policy.js';
Deno.serve(async req=>{
 const base44=createClientFromRequest(req),user=await base44.auth.me().catch(()=>null);
 if(!isWebsiteOwner(user)) return Response.json({error:'Owner access required'},{status:403});
 try {
 const body=await req.json().catch(()=>({}));
 if(body.action==='update') {
  if(!['new','contacted','booked','declined','unresponsive','archived'].includes(body.status)||typeof body.id!=='string') return Response.json({error:'Invalid update'},{status:400});
  await base44.entities.CoachingLead.update(body.id,{status:body.status});
  return Response.json({updated:true});
 }
 const leads=await base44.entities.CoachingLead.list('-created_date',500);
 return Response.json({leads:leads.filter(row=>!row.duplicate_submission),limited:leads.length===500});
 }catch {return Response.json({error:'Private inbox unavailable'},{status:503});}
});