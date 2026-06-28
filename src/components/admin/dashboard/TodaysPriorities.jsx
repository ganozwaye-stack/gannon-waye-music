import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight } from 'lucide-react';

const PRIORITY_STYLES = {
  critical: { label: 'Critical', dot: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30' },
  high: { label: 'High', dot: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30' },
  medium: { label: 'Medium', dot: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/30' },
  low: { label: 'Low', dot: 'bg-muted-foreground', text: 'text-muted-foreground', border: 'border-border/40' },
};

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export default function TodaysPriorities() {
  const { data: tasks = [] } = useQuery({
    queryKey: ['dailyDashboardTasks'],
    queryFn: () => base44.entities.DailyDashboardTask.filter({ status: { $ne: 'complete' } }, 'sort_order'),
  });

  const sorted = [...tasks].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] ?? 3;
    const pb = PRIORITY_ORDER[b.priority] ?? 3;
    return pa - pb;
  });
  const top = sorted.slice(0, 7);

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Today's Top Priorities</h2>
        <span className="font-body text-xs text-muted-foreground ml-auto">{top.length} active</span>
      </div>

      {top.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-6 text-center">Nothing urgent today. A calm moment. 🤍</p>
      ) : (
        <div className="space-y-2.5">
          {top.map((task) => {
            const ps = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
            return (
              <div key={task.id} className={`rounded-xl border ${ps.border} bg-secondary/20 p-3.5`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${ps.dot} shrink-0`} />
                      <span className={`font-body text-[10px] tracking-widest uppercase ${ps.text}`}>{ps.label}</span>
                    </div>
                    <p className="font-display text-sm text-foreground leading-snug">{task.title}</p>
                    {task.next_action && (
                      <p className="font-body text-xs text-muted-foreground mt-1">→ {task.next_action}</p>
                    )}
                  </div>
                  {task.related_page && (
                    <Link to={task.related_page} className="shrink-0 mt-1">
                      <span className="flex items-center gap-1 font-body text-[10px] tracking-wider uppercase text-primary hover:underline">
                        Open <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}