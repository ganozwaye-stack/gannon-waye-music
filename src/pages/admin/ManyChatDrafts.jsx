import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Megaphone, ExternalLink, Music, Mail, BookOpen, ShoppingBag } from 'lucide-react';

const LINK_ICONS = {
  music_link: Music,
  subscribe_link: Mail,
  lyrics_link: BookOpen,
  store_link: ShoppingBag,
  press_link: Megaphone,
};
// Note: press_link reuses Megaphone icon (no Press icon in lucide-react)

export default function ManyChatDrafts() {
  const { data: drafts = [] } = useQuery({
    queryKey: ['ManyChatKeywordDraft'],
    queryFn: () => base44.entities.ManyChatKeywordDraft.list('sort_order', 100),
  });

  const primary = drafts.filter(d => d.keyword_tier === 'primary');
  const secondary = drafts.filter(d => d.keyword_tier === 'secondary');

  const renderCard = (draft) => (
    <div key={draft.id} className="p-4 rounded-xl border border-border/40 bg-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg gradient-gold-text font-bold tracking-wider">{draft.keyword}</span>
          <Badge className={`text-[9px] border-0 ${draft.keyword_tier === 'primary' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
            {draft.keyword_tier}
          </Badge>
        </div>
        <Badge className={`text-[9px] border-0 ${draft.status === 'draft' ? 'bg-amber-500/20 text-amber-400' : draft.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-secondary text-muted-foreground'}`}>
          {draft.status}
        </Badge>
      </div>
      {draft.song && <p className="font-body text-xs text-muted-foreground">Song: {draft.song}</p>}
      {draft.response_message && (
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
          <p className="font-body text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Draft DM Response</p>
          <p className="font-body text-sm text-foreground/80 whitespace-pre-line">{draft.response_message}</p>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {Object.entries(LINK_ICONS).map(([key, Icon]) => {
          if (!draft[key]) return null;
          return (
            <a key={key} href={draft[key]} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/40 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
              <Icon className="w-3 h-3" /> {key.replace('_link', '')}
              <ExternalLink className="w-2.5 h-2.5 opacity-50" />
            </a>
          );
        })}
      </div>
      {draft.notes && <p className="font-body text-xs text-muted-foreground/60">{draft.notes}</p>}
    </div>
  );

  return (
    <div className="space-y-6 pb-16">
      <div>
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-1">Admin · Private · Drafts Only</p>
        <h1 className="font-display text-3xl font-bold gradient-gold-text">ManyChat Keyword Drafts</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Music-first keyword campaign drafts. Not activated. No messages sent. No API tokens used. All drafts require Gannon's approval before activation.
        </p>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-500/40 bg-amber-500/5">
        <Megaphone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="font-body text-xs text-muted-foreground">
          <strong className="text-amber-400">Drafts only.</strong> These keyword campaigns are not connected to ManyChat. No auto-DMs are active. To activate, Gannon must approve each keyword and set up ManyChat manually.
        </p>
      </div>

      <div>
        <h2 className="font-display text-xl text-foreground mb-3">Primary Keywords</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {primary.length === 0 ? <p className="font-body text-sm text-muted-foreground">No primary keyword drafts yet.</p> : primary.map(renderCard)}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl text-foreground mb-3">Secondary Keywords</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {secondary.length === 0 ? <p className="font-body text-sm text-muted-foreground">No secondary keyword drafts yet.</p> : secondary.map(renderCard)}
        </div>
      </div>
    </div>
  );
}