import { createClientFromRequest } from 'npm:@base44/sdk@0.8.53';
import { isWebsiteOwner } from './policy.js';
Deno.serve(async req=>{
 const base44=createClientFromRequest(req),user=await base44.auth.me().catch(()=>null);
 if(!isWebsiteOwner(user)) return Response.json({error:'Owner access required'},{status:403});
 try {
 const body=await req.json().catch(()=>({}));
 if(body.action==='reconcile_receipt') {
  if(typeof body.submission_id!=='string')return Response.json({error:'Invalid receipt'},{status:400});
  const saved=await base44.entities.CoachingLead.filter({submission_id:body.submission_id},'created_date',2);
  if(saved.length!==1)return Response.json({error:'Owner review required'},{status:409});
  const reservations=await base44.asServiceRole.entities.CoachingSubmissionReceipt.filter({submission_id:body.submission_id},'created_date',20);
  for(const row of reservations)await base44.asServiceRole.entities.CoachingSubmissionReceipt.update(row.id,{completed:true,lead_id:saved[0].id});
  return Response.json({reconciled:true});
 }
 if(body.action==='update') {
  if(!['new','contacted','booked','declined','unresponsive','archived'].includes(body.status)||typeof body.id!=='string') return Response.json({error:'Invalid update'},{status:400});
  await base44.entities.CoachingLead.update(body.id,{status:body.status});
  return Response.json({updated:true});
 }
 const leads=await base44.entities.CoachingLead.list('-created_date',500);
 return Response.json({leads:leads.filter(row=>!row.duplicate_submission),limited:leads.length===500});
 }catch {return Response.json({error:'Private inbox unavailable'},{status:503});}
});