import {useEffect,useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {useAuth} from '@/lib/AuthContext';
import {trackEvent,recordLandingSource,setAnalyticsTrafficExcluded} from '@/lib/analytics';
import {publicPage} from '@/lib/websiteAnalyticsPolicy';
export default function WebsiteAnalyticsTracker() {
 const location=useLocation(),last=useRef(''),{user,isLoadingAuth}=useAuth();
 useEffect(()=>{
  const marked=new URLSearchParams(location.search).get('analytics_test')==='1';
  setAnalyticsTrafficExcluded(isLoadingAuth||marked||user?.role==='admin');
  if(isLoadingAuth||marked||user?.role==='admin'||!publicPage(location.pathname))return;
  const navigation=location.key||location.pathname;
  if(last.current===navigation)return;last.current=navigation;
  recordLandingSource();trackEvent('page_view');
 },[location.key,location.pathname,location.search,user?.role,isLoadingAuth]);
 useEffect(()=>{
  const click=event=>{
   if(!event.isTrusted)return;
   const element=event.target.closest?.('a,button');if(!element)return;
   const label=element.textContent.trim().toLowerCase();
   let destination='';if(element.tagName==='A')try{const url=new URL(element.href);if(url.origin===window.location.origin)destination=url.pathname;}catch{}
   if(label==='work with me'||['/bookings','/booking','/work-with-me','/press-kit'].includes(destination))trackEvent('work_cta',{target:'work'});
   else if(label==='contact me'||destination==='/contact')trackEvent('contact_cta',{target:'contact'});
   else if(['enquire about coaching','register your interest'].includes(label)||destination==='/coaching')trackEvent('coaching_cta',{target:'coaching'});
   else if(element.tagName==='A') {
    try{const host=new URL(element.href).hostname;
     const platform={'open.spotify.com':'spotify','music.apple.com':'apple_music','youtube.com':'youtube','www.youtube.com':'youtube','youtu.be':'youtube'}[host];
     if(platform)trackEvent('music_outbound',{target:platform});
    }catch{}
   }
  };
  document.addEventListener('click',click);return()=>document.removeEventListener('click',click);
 },[]);
 return null;
}