import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Film } from 'lucide-react';

const COLUMNS = [
  { key: 'idea', label: 'Idea', color: 'text-muted-foreground' },
  { key: 'draft', label: 'Draft', color: 'text-blue-400' },
  { key: 'needs_asset', label: 'Needs Asset', color: 'text-amber-400' },
  { key: 'needs_approval', label: 'Needs Approval', color: 'text-amber-400' },
  { key: 'ready_to_schedule', label: 'Ready', color: 'text-purple-400' },
  { key: 'scheduled', label: 'Scheduled', color: 'text-blue-400' },
  { key: 'posted', label: 'Posted', color: 'text-green-400' },
  { key: 'performance_review', label: 'Review', color: 'text-primary' },
];

export default function ContentPipeline() {
  const { data: items = [] } = useQuery({
    queryKey: ['contentPipelineItems'],
    queryFn: () => base44.entities.ContentPipelineItem.list('sort_order'),
  });

  const byStatus = COLUMNS.reduce((acc, col) => {
    acc[col.key] = items.filter(i => (i.status || 'idea') === col.key);
    return acc;
  }, {});

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Film className="w-4 h-4 text-primary" />
        <h2 className="font-display text-lg text-foreground">Content Pipeline</h2>
        <span className="font-body text-xs text-muted-foreground ml-auto">{items.length} items · No auto-posting</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {COLUMNS.map((col) => (
          <div key={col.key} className="rounded-xl bg-secondary/20 border border-border/20 p-3 min-h-[80px]">
            <p className={`font-body text-[10px] tracking-widest uppercase ${col.color} mb-2`}>{col.label}</p>
            <div className="space-y-1.5">
              {byStatus[col.key].map((item) => (
                <div key={item.id} className="rounded-lg bg-card/60 border border-border/20 px-2.5 py-1.5">
                  <p className="font-body text-xs text-foreground/80 leading-snug truncate">{item.title}</p>
                  {item.content_type && (
                    <p className="font-body text-[9px] text-muted-foreground/50 mt-0.5">{item.content_type.replace(/_/g, ' ')}</p>
                  )}
                </div>
              ))}
              {byStatus[col.key].length === 0 && (
                <p className="font-body text-[10px] text-muted-foreground/30 py-2 text-center">—</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}