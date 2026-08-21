import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Heart, Star, Trash2, Eye, EyeOff } from 'lucide-react';

const TIER_LABELS = {
  day_one: 'Day One',
  inner_circle: 'Inner Circle',
  movement: 'Movement',
  with_you: "I'm With You",
};

const BADGE_LABELS = {
  day_one: '⭐ Day One',
  top_supporter: '💛 Top Supporter',
  inner_circle: '💜 Inner Circle',
  supporter: '🤍 Supporter',
};

export default function Supporters() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: supporters } = useQuery({
    queryKey: ['supporterProfilesAdmin'],
    queryFn: () => base44.entities.SupporterProfile.list('-total_contributed'),
    initialData: [],
  });

  const filtered = filter === 'all' ? supporters : supporters.filter(s => s.tier === filter);

  const totalRevenue = supporters.reduce((sum, s) => sum + (s.total_contributed || 0), 0);

  const toggleVisibility = async (s) => {
    await base44.entities.SupporterProfile.update(s.id, { is_public: !s.is_public });
    queryClient.invalidateQueries({ queryKey: ['supporterProfilesAdmin'] });
    toast({ title: s.is_public ? 'Hidden from public leaderboard' : 'Now visible on leaderboard' });
  };

  const handleDelete = async (id) => {
    await base44.entities.SupporterProfile.delete(id);
    queryClient.invalidateQueries({ queryKey: ['supporterProfilesAdmin'] });
    toast({ title: 'Removed' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground">Supporters</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {supporters.length} supporter{supporters.length !== 1 ? 's' : ''} · ${totalRevenue.toFixed(2)} AUD total contributed
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'day_one', 'inner_circle', 'movement', 'with_you'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full font-body text-xs tracking-wider uppercase transition-all ${
                filter === t ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-secondary/50 text-muted-foreground border border-border/40'
              }`}
            >
              {t === 'all' ? 'All' : TIER_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Supporters', value: supporters.length, icon: Heart },
          { label: 'Total Raised', value: `$${totalRevenue.toFixed(0)} AUD`, icon: Star },
          { label: 'Inner Circle', value: supporters.filter(s => s.tier === 'inner_circle' || s.tier === 'day_one').length, icon: Star },
          { label: 'Public', value: supporters.filter(s => s.is_public).length, icon: Eye },
        ].map(card => (
          <div key={card.label} className="bg-card border border-border/40 rounded-xl p-4">
            <card.icon className="w-4 h-4 text-primary mb-2" />
            <p className="font-display text-xl text-foreground">{card.value}</p>
            <p className="font-body text-xs text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="font-body text-muted-foreground">No supporters yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <div key={s.id} className="bg-card border border-border/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="font-display text-lg text-primary">
                  {(s.supporter_name || s.supporter_email || '?')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-body text-sm text-foreground font-medium">
                    {s.supporter_name || 'Anonymous'}
                  </p>
                  <span className="font-body text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {BADGE_LABELS[s.badge] || s.badge}
                  </span>
                  {!s.is_public && (
                    <span className="font-body text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      Private
                    </span>
                  )}
                </div>
                <p className="font-body text-xs text-muted-foreground">{s.supporter_email}</p>
                {s.message && <p className="font-body text-xs text-foreground/50 mt-1 italic">"{s.message}"</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display text-lg gradient-gold-glow">${(s.total_contributed || 0).toFixed(0)}</p>
                <p className="font-body text-xs text-muted-foreground">{TIER_LABELS[s.tier] || s.tier}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleVisibility(s)}
                  className="rounded-full font-body text-xs"
                >
                  {s.is_public ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(s.id)}
                  className="rounded-full font-body text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}