import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, MessageSquare } from 'lucide-react';

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
  const navigate = useNavigate();

  // Live attention counts for Deego's headline
  const { data: approvals = [] } = useQuery({ queryKey: ['approvalQueueItems'], queryFn: () => base44.entities.ApprovalQueueItem.filter({ status: 'needs_approval' }), staleTime: 30_000 });
  const { data: blocked = [] } = useQuery({ queryKey: ['blockedItems'], queryFn: () => base44.entities.BlockedItem.filter({ status: 'blocked' }), staleTime: 30_000 });
  const { data: recs = [] } = useQuery({ queryKey: ['deego-recommendations'], queryFn: () => base44.entities.AgentAction.filter({ status: 'needs_gannon_approval' }, '-created_date', 20), staleTime: 30_000 });

  const counters = [
    { label: 'recommendations', value: recs.length, cls: 'text-primary border-primary/25 bg-primary/10', path: '/admin/revenue-actions' },
    { label: 'approvals', value: approvals.length, cls: 'text-amber-400 border-amber-500/25 bg-amber-500/10', path: '/admin/approval-queue' },
    { label: 'blocked', value: blocked.length, cls: 'text-red-400 border-red-500/25 bg-red-500/10', path: '/admin/human-action-required' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 pb-10">
      {/* ── Header bar ── */}
      <header className="rounded-2xl border border-border/30 bg-card p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="font-body text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-2">{today}</p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-primary" /> Deego's Desk
            </h1>
            <p className="font-body text-sm text-foreground/70 mt-2 max-w-xl">
              {greeting}, Gannon. Deego's pulled together today's priorities, what's waiting on your call, and where the music pipeline is sitting.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <Link
              to="/admin/orchestrator-chat"
              className="inline-flex items-center gap-2 rounded-lg gradient-gold-button px-4 py-2 font-body text-xs font-semibold tracking-wide uppercase transition-transform hover:-translate-y-0.5"
            >
              <MessageSquare className="w-4 h-4" /> Talk to Deego
            </Link>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {counters.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => navigate(c.path)}
                  className={`font-body text-[11px] px-3 py-1.5 rounded-full border ${c.cls} cursor-pointer hover:scale-105 transition-transform`}
                >
                  {c.value} {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero focus — Today's priorities + Pending approvals ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        <div className="lg:col-span-8">
          <DeegoTodoList />
        </div>
        <div id="deego-approvals" className="lg:col-span-4">
          <ApprovalCards />
        </div>
      </div>

      {/* ── Also today — supporting grid (subdued) ── */}
      <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 pt-2 pb-1">Also today</p>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start opacity-95">
        <div id="deego-recommendations" className="lg:col-span-5">
          <DeegoRecommendations />
        </div>
        <div className="lg:col-span-3">
          <DeegoProgressRing recs={recs.length} approvals={approvals.length} blocked={blocked.length} />
        </div>
        <div id="deego-blocked" className="lg:col-span-4">
          <BlockedItems />
        </div>
        <div className="lg:col-span-4">
          <DeegoProspects />
        </div>
        <div className="lg:col-span-8">
          <DailyNotes />
        </div>
      </div>

      {/* ── Release pipeline — wide ── */}
      <ReleasePipelineList />

      {/* ── Function launcher — full width (kept) ── */}
      <FunctionLauncher />

      {/* ── Footer ── */}
      <footer className="text-center pt-2">
        <p className="font-body text-xs text-muted-foreground/40">
          Deego's Desk is private. No lyrics published. No emails sent. No social posts scheduled. All safe. 🤍
        </p>
      </footer>
    </div>
  );
}