import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Sun, Moon, Check } from 'lucide-react';

export default function DailyChecklist() {
  const queryClient = useQueryClient();
  const [toggling, setToggling] = useState(null);

  const { data: items = [] } = useQuery({
    queryKey: ['dailyChecklistItems'],
    queryFn: () => base44.entities.DailyAdminChecklistItem.list('sort_order'),
  });

  const today = new Date().toISOString().split('T')[0];

  const toggle = async (item) => {
    setToggling(item.id);
    const wasChecked = item.is_checked && item.checked_date === today;
    try {
      await base44.entities.DailyAdminChecklistItem.update(item.id, {
        is_checked: !wasChecked,
        checked_date: !wasChecked ? today : null,
      });
      queryClient.invalidateQueries({ queryKey: ['dailyChecklistItems'] });
    } catch { /* bubble */ }
    setToggling(null);
  };

  const morning = items.filter(i => i.checklist_type === 'morning');
  const evening = items.filter(i => i.checklist_type === 'evening');

  const renderList = (list, label, Icon) => (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="w-3.5 h-3.5 text-primary" />
        <h3 className="font-display text-sm text-foreground">{label}</h3>
        <span className="font-body text-[10px] text-muted-foreground ml-auto">
          {list.filter(i => i.is_checked && i.checked_date === today).length}/{list.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {list.map((item) => {
          const checked = item.is_checked && item.checked_date === today;
          return (
            <button
              key={item.id}
              onClick={() => toggle(item)}
              disabled={toggling === item.id}
              className="w-full flex items-center gap-2.5 text-left group"
            >
              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                checked ? 'bg-primary border-primary' : 'border-border/50 group-hover:border-primary/40'
              }`}>
                {checked && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
              </span>
              <span className={`font-body text-xs ${checked ? 'text-muted-foreground line-through' : 'text-foreground/80'}`}>
                {item.title}
              </span>
              {item.related_page && (
                <Link to={item.related_page} onClick={e => e.stopPropagation()} className="ml-auto font-body text-[10px] text-primary/60 hover:text-primary">
                  →
                </Link>
              )}
            </button>
          );
        })}
        {list.length === 0 && <p className="font-body text-xs text-muted-foreground/50 pl-6">No items yet.</p>}
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-border/40 rounded-2xl p-5">
      <h2 className="font-display text-lg text-foreground mb-4">Daily Admin Checklist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderList(morning, 'Morning', Sun)}
        {renderList(evening, 'Evening', Moon)}
      </div>
    </div>
  );
}