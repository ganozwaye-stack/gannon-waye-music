import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Check, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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

const CATEGORY_ROUTES = {
  lyrics_publishing: '/admin/lyrics-archive',
  lyric_source: '/admin/lyrics-archive',
  unresolved_lines: '/admin/lyrics-archive',
  public_email: '/admin/communications-hub',
  mums_garden_images: '/admin/mums-garden',
  press_photo: '/admin/press-kit',
  spotify_embed: '/admin/releases',
  newsletter_send: '/admin/newsletter',
  instagram_post: '/admin/social-command',
  tiktok_post: '/admin/tiktok-recording-studio',
  merch_feature: '/admin/merch',
  page_publish: '/admin/website-ops',
  other: '/admin/approval-queue',
};

export default function ApprovalCards() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data: items = [] } = useQuery({
    queryKey: ['approvalQueueItems'],
    queryFn: () => base44.entities.ApprovalQueueItem.filter({ status: 'needs_approval' }, 'sort_order'),
  });

  const statusMut = useMutation({
    mutationFn: async ({ id, status }) => base44.entities.ApprovalQueueItem.update(id, { status }),
    onSuccess: () => qc.invalidateQueries(['approvalQueueItems']),
  });

  const approve = (item) => {
    statusMut.mutate({ id: item.id, status: 'complete' });
    toast({ title: 'Approved', description: item.title });
  };
  const defer = (item) => {
    statusMut.mutate({ id: item.id, status: 'deferred' });
    toast({ title: 'Deferred', description: item.title });
  };

  const go = (item) => navigate(CATEGORY_ROUTES[item.category] || '/admin/approval-queue');

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
            <div key={item.id} className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 group">
              <button type="button" onClick={() => go(item)} className="w-full text-left flex items-start gap-2.5 cursor-pointer">
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
              </button>
              <div className="flex items-center gap-2 mt-2.5 pl-7">
                <button
                  type="button"
                  onClick={() => approve(item)}
                  disabled={statusMut.isPending}
                  className="inline-flex items-center gap-1 font-body text-[10px] tracking-wider uppercase px-3 py-1 rounded-full gradient-gold-button border-0 disabled:opacity-50"
                >
                  <Check className="w-3 h-3" /> Approve
                </button>
                <button
                  type="button"
                  onClick={() => defer(item)}
                  disabled={statusMut.isPending}
                  className="inline-flex items-center gap-1 font-body text-[10px] tracking-wider uppercase px-3 py-1 rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50"
                >
                  <Clock className="w-3 h-3" /> Defer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}