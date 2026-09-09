import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useSearchParams } from 'react-router-dom';

const MAILBOXES = [
  'killthemwithkindness26@outlook.com', 'ganoz01@icloud.com', 'gannonwayemusic@gmail.com',
  'yomanwithme@outlook.com', 'mariojohnrm@icloud.com', 'gannonwayemelb@gmail.com',
  'gannonwaye.melb88@gmail.com', 'Thanking You Kindly: address needed', 'GanozMix Direct: Gmail address needed',
];
const owner = user => user?.role === 'admin' && ['ganozwaye@gmail.com', 'gannonwayemusic@gmail.com'].includes(String(user.email || '').trim().toLowerCase());
const date = value => value ? new Date(value).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }) : 'No follow-up required';

export default function DeegoSupervisorDesk() {
  const client = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [showAccounts, setShowAccounts] = useState(false);
  const identity = useQuery({ queryKey: ['deego-owner'], queryFn: () => base44.auth.me(), retry: false });
  const review = useQuery({
    queryKey: ['deego-supervisor'], enabled: owner(identity.data),
    queryFn: async () => (await base44.functions.invoke('agentIntelligenceLoop', { mode: 'supervisor_snapshot' })).data,
    staleTime: 30000, retry: false,
  });
  const run = useMutation({
    mutationFn: async () => (await base44.functions.invoke('agentIntelligenceLoop', { mode: 'admin_supervisor' })).data,
    onSettled: () => client.invalidateQueries({ queryKey: ['deego-supervisor'] }),
  });
  if (identity.isPending) return <section aria-busy="true" className="rounded-2xl border border-border p-6 animate-pulse">Loading Deego desk…</section>;
  if (!owner(identity.data)) return <section className="rounded-2xl border border-border p-6">Deego supervision requires the signed-in owner account.</section>;
  const tasks = (review.data?.tasks || []).filter(task => !task.verified);
  const selected = tasks.find(task => task.id === params.get('task') && task.entity === params.get('entity'));
  const showTask = task => { const next = new URLSearchParams(params); next.set('task', task.id); next.set('entity', task.entity); setParams(next); };
  return <section className="rounded-2xl border border-primary/30 bg-card p-5 space-y-5 text-left">
    <div>
      <p className="text-xs uppercase tracking-widest text-primary">Deego executive desk</p>
      <h2 className="font-display text-2xl mt-1">Follow through on every commitment</h2>
      <p className="text-sm text-muted-foreground mt-2">No spending or outgoing refunds. Incoming refunds may be accepted only from verified offers using verified details; automatic email replies are not connected yet.</p>
    </div>
    <div role="status" className="rounded-xl bg-secondary/20 p-4 text-sm space-y-2">
      <p>Coverage: Daily Dashboard tasks and Action Items. Other task registers and email messages are not yet included.</p>
      <p>Unattended supervision: awaiting verified scheduler authentication. WhatsApp notifications: delivery not verified.</p>
      <p>Follow-up cadence: critical 15 minutes · high 1 hour · medium daily · low every 3 days. These are policy intervals; checks currently run only when you press the button below.</p>
    </div>
    <div className="flex flex-wrap gap-3 items-center">
      <button type="button" className="rounded-lg bg-primary text-primary-foreground px-4 py-2 disabled:opacity-50" disabled={run.isPending || review.isPending || review.isError} onClick={() => run.mutate()}>
        {run.isPending ? 'Reviewing tasks…' : 'Run task follow-ups'}
      </button>
      <a className="text-primary underline text-sm" href={base44.agents.getWhatsAppConnectURL('deego_master_ai')} target="_blank" rel="noreferrer">Open Deego WhatsApp connection</a>
      <button type="button" className="text-primary underline text-sm" aria-expanded={showAccounts} onClick={() => setShowAccounts(!showAccounts)}>Mailbox setup ({MAILBOXES.length})</button>
    </div>
    {showAccounts && <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Requested accounts, not proof of connection. Each needs identity, read access and a successful message fetch verified before monitoring starts.</p>
      {MAILBOXES.map(address => <div key={address} className="border border-border rounded-lg p-3 break-all text-sm">{address}<span className="block text-muted-foreground">Not verified for monitoring</span></div>)}
    </div>}
    {run.isSuccess && <p role="status" className="text-sm">{run.data.followed_up} follow-ups recorded across {run.data.reviewed} tasks. Alerts were saved inside the website; no WhatsApp message was sent.</p>}
    {(run.isError || review.isError) && <div role="alert" className="text-sm border border-destructive/40 rounded-lg p-3">Task review unavailable or partially completed. No complete coverage claimed. <button className="underline" onClick={() => review.refetch()}>Retry loading</button></div>}
    {review.isPending ? <p aria-busy="true">Loading task registers…</p> : !review.isError && <>
      <p className="text-sm text-muted-foreground">{tasks.length} tasks require follow-through or completion evidence. Delegation does not remove them.</p>
      <div className="max-h-96 overflow-auto space-y-2">
        {tasks.map(task => <button key={task.entity + task.id} type="button" onClick={() => showTask(task)} className="w-full text-left rounded-xl border border-border p-3 hover:border-primary/60">
          <span className="text-xs uppercase text-primary">{task.priority} · {task.entity}</span>
          <span className="block font-medium">{task.title}</span>
          <span className="block text-sm text-muted-foreground">{task.owner} · {task.evidence_required ? 'Completion evidence required' : task.status}</span>
          <span className="block text-xs text-muted-foreground">{task.follow_up_due ? 'Follow-up due now' : 'Next review: ' + date(task.next_follow_up_at)}</span>
        </button>)}
      </div>
    </>}
    {selected && <div className="rounded-xl border border-primary/40 p-4 space-y-2" aria-label="Selected task details">
      <h3 className="font-medium">{selected.title}</h3>
      <p className="text-sm">{selected.next_action}</p>
      <p className="text-xs text-muted-foreground">Source: {selected.entity} · {selected.id}</p>
      <p className="text-sm">Owner: {selected.owner}. Status: {selected.status}. {selected.evidence_required ? 'Reported complete; evidence still needs verification.' : ''}</p>
      <Link className="text-sm underline text-primary" to={selected.entity === 'DailyDashboardTask' ? '/admin/daily-dashboard' : '/admin/todo'}>Open task register</Link>
    </div>}
  </section>;
}
