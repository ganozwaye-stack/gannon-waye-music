// Owner-approved offer; separate from the optional, inactive free clarity call.
export const PAID_INITIAL_CONSULTATION = Object.freeze({
 id:'paid-initial-consultation', title:'Paid initial consultation',
 amountCents:9900,currency:'aud',durationMinutes:45,
 introductoryThreeCents:19800,tenSessionPackageCents:85000,
 contactPath:'/contact?topic=coaching'
});
export function consultationEmailHref(email){
 if(typeof email!=='string'||! /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email)) return null;
 const subject='Paid initial consultation | A$99 | 45 minutes';
 const body="Hi Gannon,\n\nI'd like to ask about availability for the A$99, 45-minute paid initial consultation. Please let me know available times, the session format and the payment and cancellation details before I decide.\n\nThank you.";
 return 'mailto:'+email+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
}
