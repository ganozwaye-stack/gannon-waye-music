export const OWNER_EMAILS = ['ganozwaye@gmail.com','gannonwayemusic@gmail.com'];
export function isWebsiteOwner(user) { return user?.role === 'admin' && OWNER_EMAILS.includes(String(user.email || '').trim().toLowerCase()); }
export function validateInterest(input, now = new Date()) {
  const fail = message => { throw new Error(message); };
  const text = (key,max) => {
    const value = typeof input[key] === 'string' ? input[key].trim() : '';
    if (!value || value.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) fail('Please check the required fields and their lengths.');
    return value;
  };
  const first_name=text('first_name',80),last_name=text('last_name',80);
  const email=text('email',254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Please enter a valid email address.');
  const phone=text('phone',30);
  if (!/^\+?[0-9 ()-]+$/.test(phone) || phone.replace(/\D/g,'').length < 8 || phone.replace(/\D/g,'').length > 15) fail('Please enter a valid mobile number.');
  const date_of_birth=text('date_of_birth',10);
  const dob=new Date(date_of_birth+'T00:00:00Z'),today=now.toISOString().slice(0,10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth) || !Number.isFinite(dob.getTime()) || dob.toISOString().slice(0,10)!==date_of_birth || date_of_birth>today) fail('Please enter a valid date of birth that is not in the future.');
  const support_wanted=text('support_wanted',1000);
  if (input.consent_to_contact!==true) fail('Please confirm that Gannon may contact you about your interest.');
  if (input.website) fail('Unable to accept this submission.');
  if (!/^[a-f0-9-]{36}$/.test(String(input.submission_id||''))) fail('Please refresh the form and try again.');
  return {first_name,last_name,full_name:first_name+' '+last_name,email,phone,date_of_birth,support_wanted,consent_to_contact:true,submission_id:input.submission_id,source_page:'/coaching',source_offer:'coaching_interest',status:'new'};
}
export async function saveInterest(entities, input, {now = new Date(),hashEmail,excludeTraffic=false} = {}) {
 const lead=validateInterest(input,now),fingerprint=await hashEmail(lead.email),ledger=entities.CoachingSubmissionReceipt;
 const existing=await ledger.filter({submission_id:lead.submission_id},'created_date',20);
 if(existing.length) {
  const previous=existing.slice().sort((a,b)=>String(a.created_date).localeCompare(String(b.created_date))||String(a.id).localeCompare(String(b.id)))[0];
  if(previous.contact_fingerprint!==fingerprint)throw new Error('Please refresh the form and try again.');
  if(previous.completed===true)return {saved:true,receipt:lead.submission_id,duplicate:true};
  // A pending/ambiguous save is not retried as a fresh lead. Owner reconciliation
  // can confirm an existing saved record without making a second submission.
  throw new Error('Your submission is awaiting confirmation. Please try again later.');
 }
 const recent=await ledger.filter({contact_fingerprint:fingerprint},'-created_date',4);
 if(recent.filter(row=>new Date(row.created_date).getTime()>now.getTime()-86400000).length>=3)throw new Error('Please wait before submitting again.');
 const reservation=await ledger.create({submission_id:lead.submission_id,contact_fingerprint:fingerprint,completed:false});
 if(!reservation?.id)throw new Error('The submission could not be confirmed. Please retry.');
 const peers=await ledger.filter({submission_id:lead.submission_id},'created_date',20);
 const canonical=peers.slice().sort((a,b)=>String(a.created_date).localeCompare(String(b.created_date))||String(a.id).localeCompare(String(b.id)))[0]||reservation;
 if(canonical.id!==reservation.id) {
  if(canonical.completed===true)return {saved:true,receipt:lead.submission_id,duplicate:true};
  throw new Error('Your submission is awaiting confirmation. Please try again later.');
 }
 const created=await entities.CoachingLead.create({...lead,analytics_excluded:Boolean(excludeTraffic)});
 if(!created?.id)throw new Error('The submission could not be confirmed. Please retry.');
 await ledger.update(reservation.id,{completed:true,lead_id:created.id});
 return {saved:true,receipt:lead.submission_id,duplicate:false};
}
