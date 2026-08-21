import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS = {
  lyrics_publishing: '📝',
  lyric_source: '🔍',
  unresolved_lines: '✏️',
  public_email: '📧',
  mums_garden_images: '🌸',
  press_photo: '📸',
  spotify_embed: '🎧',
  newsletter_send: '✉️',
  instagram_post: '📷',
  tiktok_post: '🎵',
  merch_feature: '🛍️',
  page_publish: '🌐',
  other: '📌',
};

export default function ApprovalCards() {
  const navigate = useNavigate();
  const { data: items = [] } = useQuery({
    queryKey: ['approvalQueueItems'],
    queryFn: () => base44.entities.ApprovalQueueItem.filter({ status: 'needs_approval' }, 'sort_order'),
  });

  const go = (item) => navigate(item.related_page || '/admin/approval-queue');

  return (
    <div className="bg-card border border-amber-500/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-amber-400" />
        <h2 className="font-display text-lg text-foreground">Needs Your Approval</h2>
        <span className="font-body text-xs text-amber-400/70 ml-auto">{items.length} waiting</span>
      </div>

      {items.length === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-4 text-center">Nothing waiting. You're clear. 🤍</p>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item)}
              className="w-full text-left rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 hover:border-amber-400/50 hover:bg-amber-500/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-base shrink-0">{CATEGORY_ICONS[item.category] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm text-foreground leading-snug">{item.title}</p>
                  {item.description && (
                    <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                  )}
                  {item.next_action && (
                    <p className="font-body text-xs text-amber-400/80 mt-2">→ {item.next_action}</p>
                  )}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400/50 group-hover:text-amber-400 shrink-0 mt-1 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}