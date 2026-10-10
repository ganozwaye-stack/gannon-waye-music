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
  const lead=validateInterest(input,now);
  const fingerprint=await hashEmail(lead.email);
  const previous=await entities.CoachingLead.filter({submission_id:lead.submission_id},'created_date',2);
  if(previous.length) {
    if(previous[0].contact_fingerprint!==fingerprint) throw new Error('Please refresh the form and try again.');
    return {saved:true,receipt:previous[0].submission_id,duplicate:true};
  }
  const recent=await entities.CoachingLead.filter({contact_fingerprint:fingerprint},'-created_date',4);
  if(recent.filter(row=>new Date(row.created_date).getTime()>now.getTime()-86400000).length>=3) throw new Error('Please wait before submitting again.');
  const created=await entities.CoachingLead.create({...lead,contact_fingerprint:fingerprint,analytics_excluded:Boolean(excludeTraffic)});
  if(!created?.id) throw new Error('The submission could not be confirmed. Please retry.');
  // Deterministic post-create reconciliation: retries share one receipt. Entity
  // storage has no documented unique constraint/transaction; deployment must test concurrency.
  const peers=await entities.CoachingLead.filter({submission_id:lead.submission_id},'created_date',20);
  const canonical=peers.slice().sort((a,b)=>String(a.created_date).localeCompare(String(b.created_date))||String(a.id).localeCompare(String(b.id)))[0]||created;
  for(const row of peers) if(row.id!==canonical.id) await entities.CoachingLead.update(row.id,{status:'archived',duplicate_submission:true});
  return {saved:true,receipt:lead.submission_id,duplicate:canonical.id!==created.id};
}
