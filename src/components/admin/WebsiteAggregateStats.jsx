import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {base44} from '@/api/base44Client';
import {useAuth} from '@/lib/AuthContext';
import {isWebsiteOwner} from '@/lib/coachingInterestPolicy';
import {EVENT_LABELS} from '@/lib/websiteAnalyticsPolicy';
export default function WebsiteAggregateStats() {
 const {user}=useAuth(),today=new Date().toISOString().slice(0,10);
 const [start,setStart]=useState(new Date(Date.now()-29*86400000).toISOString().slice(0,10)),[end,setEnd]=useState(today),[model,setModel]=useState('last');
 const {data,error,isLoading}=useQuery({queryKey:['website-owner-stats',start,end],enabled:isWebsiteOwner(user),retry:false,queryFn:async()=>{const result=await base44.functions.invoke('websiteOwnerStats',{start,end});return result.data;}});
 if(!isWebsiteOwner(user))return null;
 return <section className="rounded-xl border border-primary/30 p-5 space-y-4 font-body" data-testid="website-owner-stats">
 <h2 className="text-xl font-bold text-primary">Private website statistics</h2>
 <p className="text-sm text-muted-foreground">Aggregate activity only. Clicks do not identify people. Contact submissions stay in the separate private inbox. Outbound music clicks are not streams.</p>
 <div className="flex flex-wrap gap-4"><label>From (UTC)<input type="date" className="block bg-background border rounded p-2" value={start} onChange={e=>setStart(e.target.value)}/></label><label>Through (UTC)<input type="date" className="block bg-background border rounded p-2" value={end} onChange={e=>setEnd(e.target.value)}/></label></div>
 {isLoading&&<p role="status">Loading private aggregates…</p>}
 {error&&<p role="status">First-party aggregate statistics are being prepared. No live counts are claimed.</p>}
 {data&&<>
 {!data.capture_enabled&&<p className="text-sm text-primary">First-party capture is closed. No new live counts are being collected by this draft.</p>}
 {data.limited&&<p className="text-sm text-primary">The record limit was reached. These counts are incomplete.</p>}
 <dl className="grid sm:grid-cols-2 gap-3">{Object.entries(EVENT_LABELS).map(([key,label])=><div key={key} className="border rounded-lg p-3"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-xl font-semibold">{data.counts?.[key]??0}</dd></div>)}<div className="border rounded-lg p-3"><dt className="text-sm text-muted-foreground">Coaching interests saved</dt><dd className="text-xl font-semibold">{data.coaching_interests_saved??0}</dd></div></dl>
 <label>Recorded source model <select className="bg-background border rounded p-2" value={model} onChange={e=>setModel(e.target.value)}><option value="first">First recorded source</option><option value="last">Last recorded source</option></select></label>
 <p className="text-sm text-muted-foreground">Session-only recorded touches on verified store payments. These describe recorded origins, not why someone bought. Direct and unknown sources remain visible. Revenue is after known refunds, in AUD; partial refunds without an amount are omitted and flagged.</p>
 <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr><th>Source</th><th>Campaign</th><th>Orders</th><th>Known net revenue</th></tr></thead><tbody>{Object.entries(data.attribution?.[model]||{}).map(([key,row])=><tr key={key}><td className="p-2">{row.source}</td><td>{row.campaign||'No recorded campaign'}</td><td>{row.orders}</td><td>A$ {row.revenue.toFixed(2)}{row.revenueIncomplete?' (incomplete)':''}</td></tr>)}</tbody></table></div>
 {!Object.keys(data.attribution?.[model]||{}).length&&<p>No attributable verified orders in this range.</p>}
 </>}
 </section>;
}