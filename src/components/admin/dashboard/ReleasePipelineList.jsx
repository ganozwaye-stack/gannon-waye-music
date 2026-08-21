import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Disc3, Loader2, ArrowRight } from 'lucide-react';

// Pending releases (anything not yet released) shown as pipeline rows.
const STAGE_ORDER = ['idea', 'writing', 'pre_production', 'recording', 'mixing', 'mastering', 'ready', 'released'];
const STAGE_LABEL = {
  idea: 'Idea',
  writing: 'Writing',
  pre_production: 'Pre-prod',
  recording: 'Recording',
  mixing: 'Mixing',
  mastering: 'Mastering',
  ready: 'Ready',
  released: 'Released',
};
const STAGE_DOT = {
  idea: 'bg-muted-foreground/40',
  writing: 'bg-sky-400',
  pre_production: 'bg-sky-400',
  recording: 'bg-amber-400',
  mixing: 'bg-violet-400',
  mastering: 'bg-violet-400',
  ready: 'bg-primary',
  released: 'bg-green-400',
};

export default function ReleasePipelineList() {
  const { data: releases = [], isLoading } = useQuery({
    queryKey: ['deego-release-pipeline'],
    queryFn: async () => {
      const all = await base44.entities.Release.list('-updated_date', 30);
      return all
        .filter((r) => r.status !== 'released')
        .sort((a, b) => STAGE_ORDER.indexOf(a.status) - STAGE_ORDER.indexOf(b.status))
        .slice(0, 6);
    },
    staleTime: 60_000,
  });

  const total = releases.length;

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Disc3 className="w-4 h-4 text-primary" />
          <h3 className="font-display text-base text-foreground">Pending Releases</h3>
        </div>
        <Link to="/admin/releases" className="font-body text-[11px] text-primary hover:underline inline-flex items-center gap-1">
          All releases <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
      ) : total === 0 ? (
        <p className="font-body text-xs text-muted-foreground text-center py-6">No pending releases. The pipeline's clear.</p>
      ) : (
        <div className="space-y-2">
          {releases.map((r) => {
            const stage = STAGE_LABEL[r.status] || r.status;
            const dot = STAGE_DOT[r.status] || 'bg-muted-foreground/40';
            const progress = Math.round((STAGE_ORDER.indexOf(r.status) / (STAGE_ORDER.length - 1)) * 100);
            return (
              <Link
                key={r.id}
                to="/admin/releases"
                className="block rounded-xl bg-secondary/20 border border-border/30 p-3 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                    <p className="font-body text-sm text-foreground truncate">{r.title}</p>
                  </div>
                  <span className="font-body text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">{stage}</span>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-secondary/40 overflow-hidden">
                  <div className="h-full bg-primary/70" style={{ width: `${progress}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}