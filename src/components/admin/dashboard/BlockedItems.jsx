import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

export default function BlockedItems() {
  const { data: items = [] } = useQuery({
    queryKey: ['blockedItems'],
    queryFn: () => base44.entities.BlockedItem.filter({ status: 'blocked' }, 'sort_order'),
  });

  return (
    <div className="bg-card border border-red-500/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-4 h-4 text-red-400" />
        <h2 className="font-display text-lg text-foreground">Blocked Items</h2>
        <span className="font-body text-xs text-red-400/70 ml-auto">{items.length} blocked</span>
      </div>

      {items.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-4 text-center">Nothing blocked. Flowing freely. 🤍</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-red-500/20 bg-red-500/5 p-3.5">
              <p className="font-display text-sm text-foreground leading-snug mb-1">{item.title}</p>
              {item.blocker_reason && (
                <p className="font-body text-xs text-red-400/80 leading-relaxed">
                  <span className="font-semibold">Why:</span> {item.blocker_reason}
                </p>
              )}
              {item.next_action && (
                <p className="font-body text-xs text-muted-foreground mt-1.5">→ {item.next_action}</p>
              )}
              {item.related_page && (
                <Link to={item.related_page} className="inline-flex items-center gap-1 mt-2 font-body text-[10px] tracking-wider uppercase text-primary/70 hover:text-primary">
                  Open <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}