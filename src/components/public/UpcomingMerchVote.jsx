import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { MERCH_VOTE_ITEMS } from '@/config/merchVoteItems';
import MerchVoteCard from '@/components/public/MerchVoteCard';

// Expression of interest vote on owner-supplied concept designs.
// Votes are stored admin-only and never displayed publicly.
export default function UpcomingMerchVote() {
  const [voted, setVoted] = useState(() =>
    MERCH_VOTE_ITEMS.filter(item => typeof window !== 'undefined' && localStorage.getItem(`merch_vote_${item.key}`)).map(item => item.key)
  );
  const [pending, setPending] = useState(null);

  const vote = async (item) => {
    if (voted.includes(item.key) || pending) return;
    setPending(item.key);
    try {
      await base44.entities.MerchVote.create({ item_key: item.key, item_name: item.name });
      localStorage.setItem(`merch_vote_${item.key}`, '1');
      setVoted(prev => [...prev, item.key]);
    } catch {
      // Leave the button available so the fan can try again.
    }
    setPending(null);
  };

  return (
    <section id="upcoming-merch" aria-label="Merch expression of interest vote" className="py-10 md:py-14 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">Expressions of Interest</p>
          <h2 className="font-body text-3xl md:text-5xl gradient-gold-text">Vote for what you'd buy</h2>
          <p className="font-body text-sm text-muted-foreground mt-4 max-w-md mx-auto">
            These are concept designs, not yet for sale. Vote for the pieces you would actually buy and the most loved ones get made first.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {MERCH_VOTE_ITEMS.map(item => (
            <MerchVoteCard key={item.key} item={item} isVoted={voted.includes(item.key)} isPending={pending === item.key} onVote={vote} />
          ))}
        </div>

        <p className="text-center font-body text-[10px] text-muted-foreground/60 mt-8 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" /> Votes go straight to Gannon, privately. Nothing is ever shown publicly.
        </p>
      </div>
    </section>
  );
}