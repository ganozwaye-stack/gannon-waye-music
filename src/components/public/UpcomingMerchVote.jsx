import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Check, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Keep this evergreen. Public merch voting must not disclose a draft release,
 // its artwork, or a planned collection before it has passed the release gate.
 // Votes are stored admin-only and never displayed publicly.
const UPCOMING_ITEMS = [
  { key: 'artist-hoodie', name: 'Artist Hoodie', blurb: 'A heavyweight black hoodie, released only when the design is approved.' },
  { key: 'artist-tee', name: 'Artist T-Shirt', blurb: 'A simple black tee designed for everyday wear.' },
  { key: 'lyric-poster', name: 'Lyric Poster', blurb: 'A limited print built around the words that matter most.' },
  { key: 'artist-mug', name: 'Artist Mug', blurb: 'A matte black mug for the morning ritual.' },
];

export default function UpcomingMerchVote() {
  const [voted, setVoted] = useState(() =>
    UPCOMING_ITEMS.filter(item => typeof window !== 'undefined' && localStorage.getItem(`merch_vote_${item.key}`)).map(item => item.key)
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
    <section id="upcoming-merch" aria-label="Upcoming merchandise voting" className="py-10 md:py-14 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">New Merch To Come</p>
          <h2 className="font-body text-3xl md:text-5xl gradient-gold-text">Vote on what's next</h2>
          <p className="font-body text-sm text-muted-foreground mt-4 max-w-md mx-auto">
            Future pieces are being considered. Tell me what you would love to see next and it moves up the list.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {UPCOMING_ITEMS.map((item, index) => {
            const isVoted = voted.includes(item.key);
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-2xl border border-border/30 hover:border-primary/30 bg-card/40 backdrop-blur-sm p-5 text-center transition-colors">
                <h3 className="font-display text-lg text-foreground leading-snug">{item.name}</h3>
                <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">{item.blurb}</p>

                {isVoted ? (
                  <div className="mt-4 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase flex items-center justify-center gap-2 border border-primary/40 text-primary bg-primary/10">
                    <Check className="w-3.5 h-3.5" /> Thanks, your vote is in
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => vote(item)}
                    disabled={pending === item.key}
                    className="mt-4 w-full rounded-full py-2.5 font-body text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-2 gradient-gold-button hover:opacity-90 disabled:opacity-60">
                    <Heart className="w-3.5 h-3.5" /> {pending === item.key ? 'Counting...' : "I'd love this"}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-center font-body text-[10px] text-muted-foreground/60 mt-8 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" /> Votes go straight to Gannon, privately. Nothing is ever shown publicly.
        </p>
      </div>
    </section>
  );
}