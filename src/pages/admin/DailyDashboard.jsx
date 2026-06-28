import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import {
  Sun, Shield, Lock, Link2, Music, ShoppingBag, FileText, Megaphone,
  Film, MessageSquare, BarChart3, Heart, Settings, CheckCircle2, XCircle,
  ExternalLink, Sparkles, AlertTriangle
} from 'lucide-react';

import TodaysPriorities from '@/components/admin/dashboard/TodaysPriorities';
import DailyChecklist from '@/components/admin/dashboard/DailyChecklist';
import WebsiteOverhaul from '@/components/admin/dashboard/WebsiteOverhaul';
import ApprovalCards from '@/components/admin/dashboard/ApprovalCards';
import BlockedItems from '@/components/admin/dashboard/BlockedItems';
import ReleasePrep from '@/components/admin/dashboard/ReleasePrep';
import ContentPipeline from '@/components/admin/dashboard/ContentPipeline';
import Projections from '@/components/admin/dashboard/Projections';
import Timeline from '@/components/admin/dashboard/Timeline';
import DailyNotes from '@/components/admin/dashboard/DailyNotes';

const QUICK_LINKS = [
  // ── Pinned daily operating links (fixed order) ──
  { label: 'Approval Queue', path: '/admin/approval-queue', icon: Shield },
  { label: 'Website Overhaul', path: '/admin/site-upgrade-audit', icon: AlertTriangle },
  { label: 'Content Studio', path: '/admin/content-studio', icon: Film },
  { label: 'Release Prep', path: '/admin/release-sprint', icon: Music },
  // ── Remaining links (alphabetical by label) ──
  { label: 'Fan List', path: '/admin/subscribers', icon: Heart },
  { label: 'Lyrics Admin', path: '/admin/lyrics-archive', icon: FileText },
  { label: 'ManyChat Drafts', path: '/admin/manychat-drafts', icon: MessageSquare },
  { label: 'Music Page', path: '/music', icon: Music },
  { label: "Mum's Garden", path: '/admin/mums-garden', icon: Heart },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Press Kit', path: '/admin/press-kit', icon: Megaphone },
  { label: 'Releases', path: '/admin/releases', icon: Music },
  { label: 'Site Settings', path: '/admin/settings', icon: Settings },
  { label: 'Store Admin', path: '/admin/merch', icon: ShoppingBag },
  { label: 'View Site', path: '/', icon: ExternalLink },
];

const SAFE_TO_DO = [
  'Public website copy clean up',
  'Private dashboard organization',
  'Create draft content',
  'Prepare pitch lists',
  'Review merch gallery',
  'Review release pages',
  'Store lyrics privately',
];

const DO_NOT_TOUCH = [
  'Do not delete laptop profiles',
  'Do not publish unapproved lyrics',
  'Do not auto send newsletters',
  'Do not auto post to social media',
  'Do not expose admin routes publicly',
  'Do not make GanozMix or systems public focus',
  'Do not use unapproved email addresses publicly',
];

function QuickLinks() {
  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Quick Links</h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.path} to={link.path} className="flex items-center gap-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 px-3 py-2 transition-colors group">
              <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
              <span className="font-body text-xs text-foreground/70 group-hover:text-foreground truncate">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SafeVsDoNotTouch() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <h2 className="font-display text-base text-foreground">Safe To Do Now</h2>
        </div>
        <ul className="space-y-1.5">
          {SAFE_TO_DO.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-green-400/60 mt-2 shrink-0" />
              <span className="font-body text-xs text-foreground/70">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-4 h-4 text-red-400" />
          <h2 className="font-display text-base text-foreground">Do Not Touch Yet</h2>
        </div>
        <ul className="space-y-1.5">
          {DO_NOT_TOUCH.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-red-400/60 mt-2 shrink-0" />
              <span className="font-body text-xs text-foreground/70">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProgressSummary({ overhaul, approvals, blocked, pipeline, releases }) {
  const bars = [
    { label: 'Website Overhaul', done: overhaul.filter(t => t.status === 'complete').length, total: overhaul.length },
    { label: 'Approval Queue', done: 0, total: approvals.length, isCount: true },
    { label: 'Blocked Items', done: 0, total: blocked.length, isCount: true },
    { label: 'Content Pipeline', done: pipeline.filter(i => i.status === 'posted').length, total: pipeline.length },
    { label: 'Release Prep', done: releases.filter(r => r.status === 'complete').length, total: releases.length },
  ];

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Progress Summary</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {bars.map((bar) => {
          const pct = bar.total > 0 ? (bar.isCount ? 0 : Math.round((bar.done / bar.total) * 100)) : 0;
          return (
            <div key={bar.label} className="rounded-xl bg-secondary/20 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body text-xs text-foreground/70">{bar.label}</span>
                <span className="font-body text-xs text-muted-foreground">
                  {bar.isCount ? `${bar.total} pending` : `${bar.done}/${bar.total}`}
                </span>
              </div>
              {bar.isCount ? (
                <div className={`h-1.5 rounded-full ${bar.total > 0 ? 'bg-amber-500/30' : 'bg-green-500/30'}`} />
              ) : (
                <div className="h-1.5 rounded-full bg-secondary/40 overflow-hidden">
                  <div className="h-full rounded-full bg-primary/60 transition-all" style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DailyDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  const { data: overhaul = [] } = useQuery({ queryKey: ['websiteOverhaulTasks'], queryFn: () => base44.entities.WebsiteOverhaulTask.list(), staleTime: 30_000 });
  const { data: approvals = [] } = useQuery({ queryKey: ['approvalQueueItems'], queryFn: () => base44.entities.ApprovalQueueItem.filter({ status: 'needs_approval' }), staleTime: 30_000 });
  const { data: blocked = [] } = useQuery({ queryKey: ['blockedItems'], queryFn: () => base44.entities.BlockedItem.filter({ status: 'blocked' }), staleTime: 30_000 });
  const { data: pipeline = [] } = useQuery({ queryKey: ['contentPipelineItems'], queryFn: () => base44.entities.ContentPipelineItem.list(), staleTime: 30_000 });
  const { data: releases = [] } = useQuery({ queryKey: ['releaseActionPlans'], queryFn: () => base44.entities.ReleaseActionPlan.list(), staleTime: 30_000 });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="text-center py-2">
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">{today}</p>
        <h1 className="font-display text-3xl md:text-4xl text-foreground">{greeting}, Gannon</h1>
        <p className="font-body text-sm text-muted-foreground mt-2">Here's what needs your attention today.</p>
      </div>

      {/* ── First Screen: Priorities + Approvals + Blocked + Quick Links ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TodaysPriorities />
          <BlockedItems />
        </div>
        <div className="space-y-6">
          <ApprovalCards />
          <QuickLinks />
        </div>
      </div>

      {/* ── Daily Checklist ── */}
      <DailyChecklist />

      {/* ── Website Overhaul ── */}
      <WebsiteOverhaul />

      {/* ── Release Prep ── */}
      <ReleasePrep />

      {/* ── Content Pipeline ── */}
      <ContentPipeline />

      {/* ── Projections ── */}
      <Projections />

      {/* ── Timeline ── */}
      <Timeline />

      {/* ── Safe vs Do Not Touch ── */}
      <SafeVsDoNotTouch />

      {/* ── Daily Notes ── */}
      <DailyNotes />

      {/* ── Progress Summary ── */}
      <ProgressSummary overhaul={overhaul} approvals={approvals} blocked={blocked} pipeline={pipeline} releases={releases} />

      {/* ── Footer note ── */}
      <div className="text-center pt-4">
        <p className="font-body text-xs text-muted-foreground/40">
          This dashboard is private. No lyrics published. No emails sent. No social posts scheduled. All safe. 🤍
        </p>
      </div>
    </div>
  );
}