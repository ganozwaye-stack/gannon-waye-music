// @ts-nocheck
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  DollarSign, Shield, Film, Star, ArrowRight, Circle,
  Music, ShoppingBag, FileText, Megaphone, Settings, Globe,
  Users, Heart, Mail, CheckCircle2,
  ExternalLink, Gift
} from 'lucide-react';

// ─── Quick Links (alphabetised, clean grid) ───────────────────────────────
const QUICK_LINKS = [
  { label: 'Approval Queue', path: '/admin/approval-queue', icon: Shield },
  { label: 'Communications', path: '/admin/communications-hub', icon: Mail },
  { label: 'Content Studio', path: '/admin/content-studio', icon: Film },
  { label: 'Lyrics Archive', path: '/admin/lyrics-archive', icon: FileText },
  { label: 'ManyChat Drafts', path: '/admin/manychat-drafts', icon: Megaphone },
  { label: 'Merch Management', path: '/admin/merch', icon: ShoppingBag },
  { label: 'Music Releases', path: '/admin/releases', icon: Music },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Press Kit', path: '/admin/press-kit', icon: Megaphone },
  { label: 'Release Sprint', path: '/admin/release-sprint', icon: Star },
  { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  { label: 'Site Overhaul', path: '/admin/site-upgrade-audit', icon: Globe },
  { label: 'Store Customers', path: '/admin/fans', icon: Users },
  { label: 'Subscribers', path: '/admin/subscribers', icon: Heart },
  { label: 'Supporters', path: '/admin/supporters', icon: Gift },
  { label: 'View Live Site', path: '/', icon: ExternalLink },
];

const STATUS_STYLES = {
  green: { dot: 'bg-green-500', text: 'text-green-400' },
  orange: { dot: 'bg-orange-500', text: 'text-orange-400' },
  red: { dot: 'bg-red-500', text: 'text-red-400' },
  grey: { dot: 'bg-zinc-500', text: 'text-zinc-400' },
};

function KpiCard({ icon: Icon, label, value, sublabel, path }) {
  const content = (
    <div className="group flex items-center gap-4 border border-border/50 rounded-xl px-5 py-4 hover:border-primary/40 transition-colors bg-card/40">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{label}</p>
        <p className="font-display text-2xl text-foreground leading-tight">{value}</p>
        <p className="font-body text-[10px] text-muted-foreground/60">{sublabel}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
    </div>
  );
  return path ? <Link to={path}>{content}</Link> : content;
}

function SectionCard({ title, actionLabel, actionPath, children }) {
  return (
    <div className="border border-border/40 rounded-xl bg-card/30">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
        <h2 className="font-body text-sm font-medium text-foreground tracking-wide">{title}</h2>
        {actionLabel && actionPath && (
          <Link to={actionPath} className="font-body text-xs text-primary hover:underline flex items-center gap-1">
            {actionLabel} <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

function ActivityRow({ title, status, statusColor, path }) {
  const s = STATUS_STYLES[statusColor] || STATUS_STYLES.grey;
  const content = (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30 transition-colors">
      <Circle className={`w-2 h-2 ${s.dot} fill-current shrink-0`} />
      <span className="font-body text-sm text-foreground/80 flex-1 truncate">{title}</span>
      <span className={`font-body text-[10px] tracking-wide ${s.text}`}>{status}</span>
    </div>
  );
  return path ? <Link to={path}>{content}</Link> : content;
}

function ApprovalRow({ title, desc, path }) {
  return (
    <Link to={path} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30 transition-colors group">
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-foreground/80 truncate">{title}</p>
        <p className="font-body text-[10px] text-muted-foreground/50">{desc}</p>
      </div>
      <span className="font-body text-[10px] text-primary border border-primary/30 rounded px-2 py-1 group-hover:bg-primary/10 transition-colors">Review</span>
    </Link>
  );
}

export default function DailyDashboardV2() {
  // Real data pulls
  const { data: orders = [] } = useQuery({
    queryKey: ['dash-paid-orders'],
    queryFn: () => base44.entities.MerchOrder.filter({ payment_status: 'paid' }),
    staleTime: 60_000,
  });
  const { data: approvals = [] } = useQuery({
    queryKey: ['dash-approvals'],
    queryFn: () => base44.entities.ApprovalQueueItem.filter({ status: 'needs_approval' }),
    staleTime: 30_000,
  });
  const { data: pipeline = [] } = useQuery({
    queryKey: ['dash-pipeline'],
    queryFn: () => base44.entities.ContentPipelineItem.filter({ status: 'draft' }),
    staleTime: 30_000,
  });
  const { data: releases = [] } = useQuery({
    queryKey: ['dash-releases'],
    queryFn: () => base44.entities.Release.list('-updated_date', 10),
    staleTime: 30_000,
  });
  const { data: blocked = [] } = useQuery({
    queryKey: ['dash-blocked'],
    queryFn: () => base44.entities.BlockedItem.filter({ status: 'blocked' }),
    staleTime: 30_000,
  });
  const { data: priorities = [] } = useQuery({
    queryKey: ['dash-priorities'],
    queryFn: () => base44.entities.DailyDashboardTask.filter({ status: 'not_started' }, 'priority', 10),
    staleTime: 30_000,
  });

  const revenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const releaseReady = releases.length > 0
    ? Math.round((releases.filter(r => r.status === 'ready' || r.status === 'released').length / releases.length) * 100)
    : 0;

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <div className="px-6 lg:px-10 pt-8 pb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="max-w-2xl">
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-3">{today}</p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
              Everything that needs your attention, in one place.
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-3 max-w-lg">
              To-dos, urgent matters, approvals and content — all here. Click anything to go straight to it.
            </p>
          </div>
          <div className="flex items-center gap-2 border border-green-500/30 rounded-lg px-3 py-2 bg-green-500/5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-body text-xs text-green-400">Systems healthy</span>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="px-6 lg:px-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard icon={DollarSign} label="Revenue" value={`$${revenue.toLocaleString('en-AU')}`} sublabel="Verified paid orders" path="/admin/orders" />
          <KpiCard icon={Shield} label="Approvals" value={approvals.length} sublabel="Waiting for you" path="/admin/approval-queue" />
          <KpiCard icon={Film} label="Content" value={pipeline.length} sublabel="Draft assets prepared" path="/admin/content-studio" />
          <KpiCard icon={Star} label="Release" value={`${releaseReady}%`} sublabel="Campaign readiness" path="/admin/releases" />
        </div>
      </div>

      {/* ── Split: Urgent Matters + Approval Queue ── */}
      <div className="px-6 lg:px-10 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Urgent Matters + To-Dos */}
          <SectionCard title="Urgent & To-Do" actionLabel="All tasks" actionPath="/admin/dashboard">
            {blocked.length > 0 && (
              <div className="px-3 pt-2 pb-1">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-red-400/70">Blocked</p>
              </div>
            )}
            {blocked.slice(0, 4).map((item) => (
              <ActivityRow key={item.id} title={item.title} status="Blocked" statusColor="red" path="/admin/dashboard" />
            ))}
            {priorities.length > 0 && (
              <div className="px-3 pt-2 pb-1">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-orange-400/70">To-Do</p>
              </div>
            )}
            {priorities.slice(0, 6).map((item) => (
              <ActivityRow key={item.id} title={item.title} status="Pending" statusColor="orange" path="/admin/dashboard" />
            ))}
            {blocked.length === 0 && priorities.length === 0 && (
              <div className="px-3 py-6 text-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-2" />
                <p className="font-body text-xs text-muted-foreground">Nothing urgent. You're all caught up.</p>
              </div>
            )}
          </SectionCard>

          {/* Right: Approval Queue */}
          <SectionCard title="Approval Queue" actionLabel="View all" actionPath="/admin/approval-queue">
            {approvals.length > 0 ? (
              approvals.slice(0, 6).map((item) => (
                <ApprovalRow key={item.id} title={item.title} desc={item.category || 'Needs review'} path="/admin/approval-queue" />
              ))
            ) : (
              <div className="px-3 py-6 text-center">
                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-2" />
                <p className="font-body text-xs text-muted-foreground">No approvals waiting.</p>
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* ── Releases + Content Pipeline ── */}
      <div className="px-6 lg:px-10 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="Recent Releases" actionLabel="All releases" actionPath="/admin/releases">
            {releases.slice(0, 5).map((r) => {
              const color = r.status === 'released' ? 'green' : r.status === 'mastering' || r.status === 'recording' ? 'orange' : 'grey';
              const s = STATUS_STYLES[color];
              return (
                <Link key={r.id} to="/admin/releases" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30 transition-colors">
                  <Circle className={`w-2 h-2 ${s.dot} fill-current shrink-0`} />
                  <span className="font-body text-sm text-foreground/80 flex-1 truncate">{r.title}</span>
                  <span className={`font-body text-[10px] tracking-wide capitalize ${s.text}`}>{r.status?.replace('_', ' ')}</span>
                </Link>
              );
            })}
          </SectionCard>

          <SectionCard title="Content Pipeline" actionLabel="All content" actionPath="/admin/content-studio">
            {pipeline.slice(0, 5).map((item) => (
              <Link key={item.id} to="/admin/content-studio" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/30 transition-colors">
                <Film className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="font-body text-sm text-foreground/80 flex-1 truncate">{item.title}</span>
                <span className="font-body text-[10px] text-muted-foreground capitalize">{item.content_type?.replace(/_/g, ' ')}</span>
              </Link>
            ))}
            {pipeline.length === 0 && (
              <div className="px-3 py-6 text-center">
                <p className="font-body text-xs text-muted-foreground">No drafts in pipeline.</p>
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* ── Quick Links (alphabetised grid) ── */}
      <div className="px-6 lg:px-10 pb-12">
        <SectionCard title="Quick Links">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.label} to={link.path} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-secondary/40 transition-colors group">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                  <span className="font-body text-xs text-foreground/70 group-hover:text-foreground">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <div className="px-6 lg:px-10 pb-8">
        <p className="font-body text-[10px] text-muted-foreground/40">
          This dashboard is private. Nothing published, nothing sent. All safe. · To revert to the old dashboard, go to /admin/dashboard
        </p>
      </div>
    </div>
  );
}