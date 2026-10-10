export const WEBSITE_EVENTS = ['page_view','work_cta','contact_cta','coaching_cta','music_outbound','contact_enquiry_sent','booking_enquiry_saved'];
export const EVENT_LABELS = {page_view:'Page views',work_cta:'Work with me clicks',contact_cta:'Contact me clicks',coaching_cta:'Coaching clicks',music_outbound:'Outbound music clicks',contact_enquiry_sent:'Contact emails acknowledged',booking_enquiry_saved:'Booking enquiries saved'};
export function publicPage(path) {
 if(path==='/')return 'home';
 if(/^\/coaching(?:\/|$)/.test(path))return 'coaching';
 if(path==='/contact')return 'contact';
 if(/^\/(booking|work-with-me)(?:\/|$)/.test(path))return 'work';
 if(/^\/store(?:\/|$)/.test(path))return 'store';
 if(/^\/(music|releases?|listen)(?:\/|$)/.test(path))return 'music';
 return null;
}
const sources=new Set(['direct','unknown','google','bing','facebook','instagram','tiktok','youtube','spotify','apple_music','email','newsletter','paid_social','social','referral','organic','cpc']);
function cleanCampaign(value) {
 // Accept campaign identifiers, never query URLs, email addresses, prose or free text.
 return typeof value==='string'&&/^[a-zA-Z0-9_-]{1,64}$/.test(value)?value.toLowerCase():'';
}
export function sanitizeSource(input={}) {
 return {source:sources.has(input.source)?input.source:'unknown',medium:sources.has(input.medium)?input.medium:'',campaign:cleanCampaign(input.campaign)};
}
export function landingSource(url,referrer='') {
 const page=new URL(url,'https://gannonwaye.com'),q=page.searchParams;
 const supplied=q.get('utm_source');
 if(supplied)return sanitizeSource({source:supplied.toLowerCase(),medium:(q.get('utm_medium')||'').toLowerCase(),campaign:q.get('utm_campaign')||''});
 if(!referrer)return {source:'direct',medium:'',campaign:''};
 try {
  const host=new URL(referrer).hostname.toLowerCase().replace(/^www\./,'');
  if(host==='gannonwaye.com')return null;
  const domains={'google.com':'google','google.com.au':'google','bing.com':'bing','facebook.com':'facebook','instagram.com':'instagram','tiktok.com':'tiktok','youtube.com':'youtube','open.spotify.com':'spotify','music.apple.com':'apple_music'};
  return {source:domains[host]||'referral',medium:'referral',campaign:''};
 }catch{return {source:'unknown',medium:'',campaign:''};}
}
export function sanitizeAttribution(input={}) {
 return {first:sanitizeSource(input.first),last:sanitizeSource(input.last)};
}
export function attributionMetadata(input) {
 const {first,last}=sanitizeAttribution(input);
 return {gw_first_source:first.source,gw_first_medium:first.medium,gw_first_campaign:first.campaign,gw_last_source:last.source,gw_last_medium:last.medium,gw_last_campaign:last.campaign};
}
export function orderAttribution(metadata={}) {
 return sanitizeAttribution({first:{source:metadata.gw_first_source,medium:metadata.gw_first_medium,campaign:metadata.gw_first_campaign},last:{source:metadata.gw_last_source,medium:metadata.gw_last_medium,campaign:metadata.gw_last_campaign}});
}
export function sanitizeEvent(input) {
 if(!WEBSITE_EVENTS.includes(input?.event_name)||!['home','coaching','contact','work','store','music'].includes(input.page)||!/^[a-f0-9-]{36}$/.test(input.event_id||''))return null;
 return {event_id:input.event_id,event_name:input.event_name,page:input.page,target:['work','contact','coaching','spotify','apple_music','youtube','music'].includes(input.target)?input.target:'',...sanitizeAttribution(input)};
}
export function excluded(row) {return row.is_sample===true||row.analytics_excluded===true||row.excluded_from_revenue===true||row.duplicate_submission===true||['ganozwaye@gmail.com','gannonwayemusic@gmail.com'].includes(String(row.created_by||'').toLowerCase());}
export function summarizeWebsite(events,leads,orders,start,end) {
 const inside=row=>{const t=Date.parse(row.created_date);return Number.isFinite(t)&&t>=start&&t<end;};
 const counts=Object.fromEntries(WEBSITE_EVENTS.map(name=>[name,0])),seenEvents=new Set(),seenLeads=new Set(),seenOrders=new Set(),groups={first:{},last:{}};
 for(const row of events)if(inside(row)&&!excluded(row)&&WEBSITE_EVENTS.includes(row.event_name)&&!seenEvents.has(row.event_id)){seenEvents.add(row.event_id);counts[row.event_name]++;}
 for(const row of leads)if(inside(row)&&!excluded(row)&&!seenLeads.has(row.submission_id||row.id))seenLeads.add(row.submission_id||row.id);
 let refundUnknown=0;
 for(const row of orders) {
  if(!inside(row)||excluded(row)||row.status==='duplicate'||row.status==='needs_admin_review'||row.financial_status==='duplicate_void'||!row.stripe_session_id||!row.stripe_event_id||row.checkout_policy!=='stage_one_owned_stock_v1'||!['paid','refunded','partially_refunded'].includes(row.payment_status)||seenOrders.has(row.stripe_session_id))continue;
  seenOrders.add(row.stripe_session_id);
  const total=Number(row.total_amount);
  if(!Number.isFinite(total)||total<0)continue;
  let net=total;
  if(row.payment_status==='refunded')net=0;
  if(row.payment_status==='partially_refunded') {
   if(!Number.isFinite(row.refunded_amount)){refundUnknown++;net=null;}
   else net=Math.max(0,total-row.refunded_amount);
  }
  const attribution=sanitizeAttribution(row.attribution);
  for(const model of ['first','last']) {
   const {source,campaign}=attribution[model],key=source+' / '+(campaign||'(no recorded campaign)');
   groups[model][key] ||= {source,campaign,orders:0,revenue:0,revenueIncomplete:false};
   const group=groups[model][key];group.orders++;if(net===null)group.revenueIncomplete=true;else group.revenue=Math.round((group.revenue+net)*100)/100;
  }
 }
 return {counts,coaching_interests_saved:seenLeads.size,attribution:groups,refund_amount_unknown:refundUnknown};
}
