import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Calendar, Check } from 'lucide-react';

export default function Timeline() {
  const { data: items = [] } = useQuery({
    queryKey: ['strategicPlanItems'],
    queryFn: () => base44.entities.StrategicPlanItem.list('sort_order'),
  });

  const days7 = items.filter(i => i.timeframe === '7_day').sort((a, b) => (a.day_number || 0) - (b.day_number || 0));
  const days30 = items.filter(i => i.timeframe === '30_day').sort((a, b) => (a.week_number || 0) - (b.week_number || 0));
  const days90 = items.filter(i => i.timeframe === '90_day');

  const renderBoard = (label, groupItems, groupKey) => {
    const groups = {};
    groupItems.forEach(i => {
      const k = groupKey === 'day' ? `Day ${i.day_number || '?'}` : groupKey === 'week' ? `Week ${i.week_number || '?'}` : 'Milestones';
      if (!groups[k]) groups[k] = [];
      groups[k].push(i);
    });
    return (
      <div className="rounded-xl border border-border/30 bg-secondary/20 p-4">
        <h3 className="font-display text-sm text-foreground mb-3">{label}</h3>
        <div className="space-y-3">
          {Object.entries(groups).map(([g, gItems]) => (
            <div key={g}>
              <p className="font-body text-[10px] tracking-widest uppercase text-primary/60 mb-1.5">{g}</p>
              <div className="space-y-1">
                {gItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    {item.status === 'complete' ? (
                      <Check className="w-3 h-3 text-green-400 shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                    )}
                    <span className={`font-body text-xs ${item.status === 'complete' ? 'text-muted-foreground line-through' : 'text-foreground/80'}`}>
                      {item.title}
                    </span>
                  </div>
                ))}
                {gItems.length === 0 && <p className="font-body text-[10px] text-muted-foreground/30">—</p>}
              </div>
            </div>
          ))}
          {groupItems.length === 0 && <p className="font-body text-xs text-muted-foreground/40 py-2">No plan yet.</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Strategic Timeline</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {renderBoard('Next 7 Days', days7, 'day')}
        {renderBoard('Next 30 Days', days30, 'week')}
        {renderBoard('Next 90 Days', days90, 'milestone')}
      </div>
    </div>
  );
}