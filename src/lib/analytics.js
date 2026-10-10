import { base44 } from '@/api/base44Client';
import { publicPage,landingSource,sanitizeAttribution,sanitizeEvent } from './websiteAnalyticsPolicy';
const completed=new Set(),recent=new Map();
let excludeTraffic=true, capturedInitialReferrer=false;
export function setAnalyticsTrafficExcluded(value) {excludeTraffic=Boolean(value);}
export function getRecordedAttribution() {
 if(typeof window==='undefined')return sanitizeAttribution();
 try{return sanitizeAttribution(JSON.parse(sessionStorage.getItem('gw_recorded_source')||'{}'));}catch{return sanitizeAttribution();}
}
export function recordLandingSource() {
 if(typeof window==='undefined'||excludeTraffic||!publicPage(location.pathname))return;
 const hasCampaign=new URLSearchParams(location.search).has('utm_source');
 if(capturedInitialReferrer&&!hasCampaign)return;
 capturedInitialReferrer=true;
 const source=landingSource(location.href,document.referrer);
 if(!source)return;
 try {
  const previous=JSON.parse(sessionStorage.getItem('gw_recorded_source')||'{}');
  // Direct revisits do not erase an observed campaign. These are session-only
  // recorded touches; no persistent visitor ID and no cross-device claim.
  const next={first:previous.first||source,last:source.source==='direct'&&previous.last?previous.last:source};
  sessionStorage.setItem('gw_recorded_source',JSON.stringify(sanitizeAttribution(next)));
 }catch{}
}
export function trackEvent(eventName,properties={},deduplicationKey='') {
 if(typeof window==='undefined'||excludeTraffic||location.pathname.startsWith('/admin')||new URLSearchParams(location.search).get('analytics_test')==='1')return;
 const page=publicPage(location.pathname);if(!page)return;
 if(deduplicationKey&&completed.has(deduplicationKey))return;
 if(deduplicationKey)completed.add(deduplicationKey);
 const aliases={stream_click:'music_outbound',booking_enquiry_created:'booking_enquiry_saved'};
 const name=aliases[eventName]||eventName;
 const target=properties.target||'';
 const throttleKey=name+':'+page,now=Date.now();
 if(!deduplicationKey&&now-(recent.get(throttleKey)||0)<500)return;
 recent.set(throttleKey,now);
 const event=sanitizeEvent({event_id:crypto.randomUUID(),event_name:name,page,target,...getRecordedAttribution()});
 if(!event){
  if(['release_updates_popup_signup','coaching_interest_registered'].includes(eventName)){
   try{base44.analytics.track({eventName,properties:{page}});}catch{}
   try{if(typeof window.gtag==='function')window.gtag('event',eventName,{page});}catch{}
  }
  return; // unknown/free-text events and properties are not forwarded
 }
 // Reuse existing providers; never pass intake, journal, contact or full URL data.
 try{base44.analytics.track({eventName:name,properties:{page,target:event.target}});}catch{}
 try{if(typeof window.gtag==='function')window.gtag('event',name,{page,target:event.target});}catch{}
 if(import.meta.env.VITE_FIRST_PARTY_ANALYTICS_ENABLED==='true')base44.functions.invoke('captureWebsiteEvent',event).catch(()=>{});
}
