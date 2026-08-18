import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, Bot, MessageSquare } from 'lucide-react';

import DeegoTodoList from '@/components/admin/dashboard/DeegoTodoList';
import DeegoRecommendations from '@/components/admin/dashboard/DeegoRecommendations';
import DeegoProspects from '@/components/admin/dashboard/DeegoProspects';
import FunctionLauncher from '@/components/admin/dashboard/FunctionLauncher';
import BlockedItems from '@/components/admin/dashboard/BlockedItems';
import ApprovalCards from '@/components/admin/dashboard/ApprovalCards';
import DailyNotes from '@/components/admin/dashboard/DailyNotes';

export default function DailyDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });

  // Light pulse counts for Deego's headline
  const { data: approvals = [] } = useQuery({ queryKey: ['approvalQueueItems'], queryFn: () => base44.entities.ApprovalQueueItem.filter({ status: 'needs_approval' }), staleTime: 30_000 });
  const { data: blocked = [] } = useQuery({ queryKey: ['blockedItems'], queryFn: () => base44.entities.BlockedItem.filter({ status: 'blocked' }), staleTime: 30_000 });
  const { data: recs = [] } = useQuery({ queryKey: ['deego-recommendations'], queryFn: () => base44.entities.AgentAction.filter({ status: 'needs_gannon_approval' }, '-created_date', 20), staleTime: 30_000 });

  const attentionCount = approvals.length + blocked.length + recs.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* ── Deego's Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-card to-secondary/30 p-6">
        <div className="absolute -right-8 -top-8 opacity-10">
          <Bot className="w-40 h-40 text-primary" />
        </div>
        <div className="relative z-10">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">{today}</p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-primary" /> Deego's Desk
          </h1>
          <p className="font-body text-sm text-foreground/70 mt-2 max-w-xl">
            {greeting}, Gannon. Deego's pulled together what needs doing today, what's waiting on your call, and where the opportunities are.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="font-body text-[11px] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {recs.length} recommendations
            </span>
            <span className="font-body text-[11px] px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {approvals.length} approvals
            </span>
            <span className="font-body text-[11px] px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              {blocked.length} blocked
            </span>
          </div>
          <Link
            to="/admin/orchestrator-chat"
            className="inline-flex items-center gap-2 mt-4 rounded-lg bg-primary px-4 py-2 font-body text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageSquare className="w-4 h-4" />
            Talk to Deego
          </Link>
        </div>
      </div>

      {/* ── To-Do + Needs Your Approval ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeegoTodoList />
        </div>
        <div>
          <ApprovalCards />
        </div>
      </div>

      {/* ── Deego's Recommendations ── */}
      <DeegoRecommendations />

      {/* ── Prospects + Blocked ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeegoProspects />
        <BlockedItems />
      </div>

      {/* ── Function Launcher ── */}
      <FunctionLauncher />

      {/* ── Daily Notes ── */}
      <DailyNotes />

      {/* ── Footer ── */}
      <div className="text-center pt-2">
        <p className="font-body text-xs text-muted-foreground/40">
          Deego's Desk is private. No lyrics published. No emails sent. No social posts scheduled. All safe. 🤍
        </p>
      </div>
    </div>
  );
}