import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

const BLOCKED_ROUTES = [
  { match: /ganozmix/i, path: '/admin/ganozmix' },
  { match: /icloud/i, path: '/admin/quick-upload' },
  { match: /lyric/i, path: '/admin/lyrics-archive' },
  { match: /deego|agent/i, path: '/admin/orchestrator-chat' },
  { match: /finance|profit|revenue|stripe|payment/i, path: '/admin/financials' },
  { match: /approval/i, path: '/admin/approval-queue' },
  { match: /sku|sourcing|procurement|supplier/i, path: '/admin/procurement-command' },
  { match: /function|deployment|deploy/i, path: '/admin/operation-registry' },
  { match: /release/i, path: '/admin/releases' },
  { match: /merch|product|store|shop/i, path: '/admin/merch' },
  { match: /social|content|post/i, path: '/admin/content-dashboard' },
];

function routeForBlocked(item) {
  if (item.related_page && item.related_page.startsWith('/')) return item.related_page;
  const text = `${item.title || ''} ${item.next_action || ''}`.toLowerCase();
  const hit = BLOCKED_ROUTES.find((r) => r.match.test(text));
  return hit ? hit.path : '/admin/human-action-required';
}

export default function BlockedItems() {
  const navigate = useNavigate();
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
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(routeForBlocked(item))}
              className="w-full text-left rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 hover:border-red-400/50 hover:bg-red-500/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-foreground leading-snug mb-1">{item.title}</p>
                  {item.blocker_reason && (
                    <p className="font-body text-xs text-red-400/80 leading-relaxed">
                      <span className="font-semibold">Why:</span> {item.blocker_reason}
                    </p>
                  )}
                  {item.next_action && (
                    <p className="font-body text-xs text-muted-foreground mt-1.5">→ {item.next_action}</p>
                  )}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-red-400/50 group-hover:text-red-400 shrink-0 mt-1 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}