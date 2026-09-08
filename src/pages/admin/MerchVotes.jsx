import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Vote, Inbox, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Private merch vote tallies. Votes are recorded from the public site but are
// admin-only: they are never displayed publicly.
export default function MerchVotes() {
  const { data: votes = [], isLoading } = useQuery({
    queryKey: ['merchVotes'],
    queryFn: () => base44.entities.MerchVote.list('-created_date', 500),
  });

  const tallies = Object.values(
    votes.reduce((acc, vote) => {
      const key = vote.item_key || 'unknown';
      if (!acc[key]) acc[key] = { key, name: vote.item_name || key, count: 0, latest: null };
      acc[key].count += 1;
      const when = new Date(vote.created_date || 0);
      if (!acc[key].latest || when > acc[key].latest) acc[key].latest = when;
      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count);

  const totalVotes = votes.length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Vote className="w-5 h-5 text-primary" />
        <h1 className="font-display text-2xl text-foreground">Upcoming Merch Votes</h1>
      </div>
      <p className="font-body text-xs text-muted-foreground mb-1">
        Fan votes on the upcoming pieces shown on the public site.
      </p>
      <p className="font-body text-[10px] text-muted-foreground/60 mb-8 flex items-center gap-1.5">
        <Lock className="w-3 h-3" /> Private to admin. Never displayed publicly.
      </p>

      {isLoading ? (
        <p className="font-body text-sm text-muted-foreground">Loading votes...</p>
      ) : totalVotes === 0 ? (
        <div className="rounded-2xl border border-border/40 bg-card/40 p-10 text-center">
          <Inbox className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-body text-sm text-muted-foreground">No votes yet. They will appear here the moment fans start voting.</p>
        </div>
      ) : (
        <>
          <p className="font-body text-xs text-primary mb-6">{totalVotes} vote{totalVotes !== 1 ? 's' : ''} in total</p>
          <div className="space-y-3">
            {tallies.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="rounded-xl border border-border/40 bg-card/40 p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-body text-sm text-foreground truncate">{item.name}</p>
                  <p className="font-body text-[10px] text-muted-foreground mt-0.5">
                    Latest vote {item.latest && item.latest.getTime() > 0
                      ? item.latest.toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })
                      : 'unknown'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display text-2xl gradient-gold-text">{item.count}</p>
                  <p className="font-body text-[9px] uppercase tracking-widest text-muted-foreground">votes</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Recent votes</p>
            <div className="space-y-1.5">
              {votes.slice(0, 10).map(vote => (
                <div key={vote.id} className="font-body text-xs text-muted-foreground flex items-center justify-between gap-4 border-b border-border/20 pb-1.5">
                  <span className="truncate">{vote.item_name || vote.item_key}</span>
                  <span className="shrink-0">
                    {vote.created_date ? new Date(vote.created_date).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' }) : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}