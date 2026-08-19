import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, Bot, MessageSquare } from 'lucide-react';

import DeegoTodoList from '@/components/admin/dashboard/DeegoTodoList';
import DeegoRecommendations from '@/components/admin/dashboard/DeegoRecommendations';
import ReleasePipelineList from '@/components/admin/dashboard/ReleasePipelineList';
import ApprovalCards from '@/components/admin/dashboard/ApprovalCards';
import DeegoProspects from '@/components/admin/dashboard/DeegoProspects';
import BlockedItems from '@/components/admin/dashboard/BlockedItems';
import DeegoProgressRing from '@/components/admin/dashboard/DeegoProgressRing';
import FunctionLauncher from '@/components/admin/dashboard/FunctionLauncher';
import DailyNotes from '@/components/admin/dashboard/DailyNotes';

export default function DailyDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase();

  // Live attention counts for Deego's headline
  const { data: approvals = [] } = useQuery({ queryKey: ['approvalQueueItems'], queryFn: () => base44.entities.ApprovalQueueItem.filter({ status: 'needs_approval' }), staleTime: 30_000 });
  const { data: blocked = [] } = useQuery({ queryKey: ['blockedItems'], queryFn: () => base44.entities.BlockedItem.filter({ status: 'blocked' }), staleTime: 30_000 });
  const { data: recs = [] } = useQuery({ queryKey: ['deego-recommendations'], queryFn: () => base44.entities.AgentAction.filter({ status: 'needs_gannon_approval' }, '-created_date', 20), staleTime: 30_000 });

  const counters = [
    { label: 'recommendations', value: recs.length, cls: 'text-primary border-primary/25 bg-primary/10' },
    { label: 'approvals', value: approvals.length, cls: 'text-amber-400 border-amber-500/25 bg-amber-500/10' },
    { label: 'blocked', value: blocked.length, cls: 'text-red-400 border-red-500/25 bg-red-500/10' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-10">
      {/* ── Mission Console Header ── */}
      <header className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card via-card to-secondary/20 p-6">
        <div className="absolute -right-10 -top-10 opacity-[0.07] pointer-events-none">
          <Bot className="w-44 h-44 text-primary" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="min-w-0">
            <p className="font-body text-[11px] tracking-[0.32em] uppercase gradient-gold-glow mb-2">{today}</p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-primary" /> Deego's Desk
            </h1>
            <p className="font-body text-sm text-foreground/70 mt-2 max-w-xl">
              {greeting}, Gannon. Deego's pulled together today's priorities, what's waiting on your call, and where the music pipeline is sitting.
            </p>
            <Link
              to="/admin/orchestrator-chat"
              className="inline-flex items-center gap-2 mt-4 rounded-lg gradient-gold-button px-4 py-2 font-body text-xs font-semibold tracking-wide uppercase transition-transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4" /> Talk to Deego
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {counters.map((c) => (
              <span key={c.label} className={`font-body text-[11px] px-3 py-1.5 rounded-full border ${c.cls}`}>
                {c.value} {c.label}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main: priorities + recommendations (left) · release pipeline rail (right) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left column — daily priorities + Deego's recommendations */}
        <div className="xl:col-span-2 space-y-6">
          <DeegoTodoList />
          <DeegoRecommendations />
        </div>

        {/* Right rail — Release Pipeline */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-1 -mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="font-display text-lg text-foreground">Release Pipeline</h2>
          </div>
          <ReleasePipelineList />
          <ApprovalCards />
          <DeegoProspects />
          <BlockedItems />
          <DeegoProgressRing
            recs={recs.length}
            approvals={approvals.length}
            blocked={blocked.length}
          />
        </div>
      </div>

      {/* ── Full-width utilities ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <FunctionLauncher />
        <DailyNotes />
      </div>

      {/* ── Footer ── */}
      <footer className="text-center pt-2">
        <p className="font-body text-xs text-muted-foreground/40">
          Deego's Desk is private. No lyrics published. No emails sent. No social posts scheduled. All safe. 🤍
        </p>
      </footer>
    </div>
  );
}