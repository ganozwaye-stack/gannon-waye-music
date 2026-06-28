import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp } from 'lucide-react';

export default function Projections() {
  const { data: metrics = [] } = useQuery({
    queryKey: ['projectionMetrics'],
    queryFn: () => base44.entities.ProjectionMetric.list('sort_order'),
  });

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Projections & Goals</h2>
        <span className="font-body text-[10px] text-muted-foreground/50 ml-auto">Planning projections — not guaranteed income</span>
      </div>

      {metrics.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-4 text-center">No projections set yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {metrics.map((m) => (
            <div key={m.id} className="rounded-xl border border-border/30 bg-secondary/20 p-4">
              <p className="font-display text-sm text-foreground mb-3">{m.metric_name}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">Current</span>
                  <span className="font-body text-sm text-foreground">{m.current_value || 0}{m.unit && m.unit !== 'count' ? ` ${m.unit}` : ''}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/20">
                  <div className="text-center">
                    <p className="font-body text-[9px] text-muted-foreground/50 uppercase">7 Day</p>
                    <p className="font-body text-xs text-blue-400 mt-0.5">{m.goal_7day || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-body text-[9px] text-muted-foreground/50 uppercase">30 Day</p>
                    <p className="font-body text-xs text-amber-400 mt-0.5">{m.goal_30day || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-body text-[9px] text-muted-foreground/50 uppercase">90 Day</p>
                    <p className="font-body text-xs text-primary mt-0.5">{m.goal_90day || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}