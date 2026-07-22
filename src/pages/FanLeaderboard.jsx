import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, Star, Crown, Medal, Trophy, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TIER_LABELS = {
  day_one: 'Day One',
  inner_circle: 'Inner Circle',
  movement: 'Movement',
  with_you: "I'm With You",
  founding: 'Founding Supporter',
};

const RANK_ICONS = [
  { icon: Crown, color: 'text-primary', bg: 'from-primary/15 to-primary/5', label: '1st' },
  { icon: Medal, color: 'text-gray-300', bg: 'from-gray-400/20 to-gray-400/5', label: '2nd' },
  { icon: Trophy, color: 'text-primary', bg: 'from-primary/15 to-primary/5', label: '3rd' },
];

export default function FanLeaderboard() {
  const { data: supporters = [] } = useQuery({
    queryKey: ['supporterProfilesAll'],
    queryFn: () => base44.entities.SupporterProfile.filter({ is_public: true }, '-total_contributed', 50),
  });

  const { data: contributions = [] } = useQuery({
    queryKey: ['recentContributionsAll'],
    queryFn: () => base44.entities.SupportContribution.list('-created_date', 10),
  });

  const { data: foundingSupporters = [] } = useQuery({
    queryKey: ['foundingSupportersAll'],
    queryFn: () => base44.entities.FoundingSupporter.list('-created_date', 20),
  });

  const topThree = supporters.slice(0, 3);
  const rest = supporters.slice(3);

  return (
    <div className="min-h-screen px-4 md:px-8 py-12 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-3">The People Behind This</p>
        <h1 className="font-display text-4xl md:text-5xl text-foreground">Fan Leaderboard</h1>
        <p className="font-body text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
          These are the people who believed before anyone else. Their support made everything possible.
        </p>
      </motion.div>

      {/* Podium — Top 3 */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
          {topThree.map((s, i) => {
            const rank = RANK_ICONS[i] || RANK_ICONS[2];
            const Icon = rank.icon;
            const podiumOrder = i === 0 ? 'md:order-2 md:-translate-y-4' : i === 1 ? 'md:order-1' : 'md:order-3';
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative ${podiumOrder}`}
              >
                <div className={`bg-gradient-to-b ${rank.bg} border border-border/40 rounded-2xl p-6 text-center`}>
                  <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mx-auto mb-3 border-2 border-border/40">
                    <Icon className={`w-7 h-7 ${rank.color}`} />
                  </div>
                  <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">{rank.label}</p>
                  <p className="font-display text-lg text-foreground font-medium">{s.supporter_name || 'Anonymous'}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{TIER_LABELS[s.tier] || s.tier}</p>
                  {s.total_contributed && (
                    <p className="font-body text-sm text-primary font-semibold mt-2">${s.total_contributed.toLocaleString()} AUD</p>
                  )}
                  {s.message && (
                    <p className="font-body text-xs text-foreground/50 mt-2 italic line-clamp-2">"{s.message}"</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Rest of leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard list — spans 2 */}
        <div className="lg:col-span-2">
          {rest.length > 0 && (
            <div className="bg-card/50 border border-border/40 rounded-xl p-5">
              <h2 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> All Supporters
              </h2>
              <div className="space-y-2">
                {rest.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 p-3 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-display text-sm text-primary">{i + 4}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <span className="font-display text-base text-muted-foreground">{(s.supporter_name || '?')[0]?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-foreground font-medium truncate">{s.supporter_name || 'Anonymous Supporter'}</p>
                      <p className="font-body text-xs text-muted-foreground">{TIER_LABELS[s.tier] || s.tier}</p>
                    </div>
                    {s.total_contributed && (
                      <p className="font-body text-sm text-primary font-semibold shrink-0">${s.total_contributed.toLocaleString()}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {supporters.length === 0 && (
            <div className="bg-card/50 border border-border/40 rounded-xl p-8 text-center">
              <Heart className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-body text-sm text-muted-foreground">No public supporters yet. Be the first to join the movement.</p>
            </div>
          )}
        </div>

        {/* Right sidebar — Recent activity + Founding supporters */}
        <div className="lg:col-span-1 space-y-6">
          {contributions.length > 0 && (
            <div className="bg-card/50 border border-border/40 rounded-xl p-5">
              <h3 className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-3">Recent Support</h3>
              <div className="space-y-2">
                {contributions.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3 text-sm font-body">
                    <Heart className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-foreground/70 truncate">{c.supporter_name || 'Someone'}</span>
                    <span className="text-primary text-xs ml-auto shrink-0">${c.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {foundingSupporters.length > 0 && (
            <div className="bg-card/50 border border-border/40 rounded-xl p-5">
              <h3 className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-primary" /> Founding Supporters
              </h3>
              <div className="space-y-2">
                {foundingSupporters.slice(0, 8).map((f, i) => (
                  <div key={f.id} className="flex items-center gap-2 text-sm font-body">
                    <Star className="w-3 h-3 text-primary shrink-0" />
                    <span className="text-foreground/70 truncate">{f.name || f.email || 'Anonymous'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <Link to="/back-this">
              <Button className="rounded-full gradient-gold-button border-0 font-body text-sm tracking-wider uppercase px-8 gap-2 w-full">
                <Heart className="w-4 h-4" /> Be Part of This
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}