import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TIER_LABELS = {
  day_one: 'Day One',
  inner_circle: 'Inner Circle',
  movement: 'Movement',
  with_you: "I'm With You",
};

const BADGE_COLORS = {
  day_one: 'text-yellow-400',
  top_supporter: 'text-primary',
  inner_circle: 'text-purple-400',
  supporter: 'text-muted-foreground',
};

export default function SupporterLeaderboard() {
  const { data: supporters } = useQuery({
    queryKey: ['supporterProfiles'],
    queryFn: () => base44.entities.SupporterProfile.filter({ is_public: true }, '-total_contributed', 10),
    initialData: [],
  });

  const { data: contributions } = useQuery({
    queryKey: ['recentContributions'],
    queryFn: () => base44.entities.SupportContribution.list('-created_date', 5),
    initialData: [],
  });

  if (supporters.length === 0 && contributions.length === 0) return null;

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">The People Behind This</p>
          <h2 className="font-display text-3xl md:text-4xl text-foreground">Supporters</h2>
          <p className="font-body text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            These are the people who believed before anyone else.
          </p>
        </motion.div>

        {supporters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {supporters.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 bg-card border border-border/40 rounded-xl p-4 hover:border-primary/20 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-lg text-primary">
                    {(s.supporter_name || '?')[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-foreground font-medium truncate">
                    {s.supporter_name || 'Anonymous Supporter'}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {TIER_LABELS[s.tier] || s.tier}
                  </p>
                  {s.message && (
                    <p className="font-body text-xs text-foreground/50 mt-1 truncate italic">"{s.message}"</p>
                  )}
                </div>
                {i === 0 && (
                  <Star className={`w-4 h-4 flex-shrink-0 ${BADGE_COLORS[s.badge] || 'text-primary'}`} />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Recent activity */}
        {contributions.length > 0 && (
          <div className="space-y-2 mb-8">
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-3">Recent Support</p>
            {contributions.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 text-sm font-body"
              >
                <Heart className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-foreground/70">
                  {c.supporter_name || 'Someone'} backed this with ${c.amount} AUD
                </span>
                {c.tier_label && (
                  <span className="text-muted-foreground text-xs">· {c.tier_label}</span>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link to="/back-this">
            <Button className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase px-8 gap-2">
              <Heart className="w-4 h-4" /> Be Part of This
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}