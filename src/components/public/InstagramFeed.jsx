import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Instagram Basic Display API requires META_APP_ID + META_APP_SECRET which are not set yet.
// Until connected, show a "follow" CTA with a placeholder grid.
// When META credentials are set, swap this for a live API call via a backend function.

const PLACEHOLDER_POSTS = [
  { id: 1, gradient: 'from-purple-900/40 to-primary/20', label: 'Behind the scenes' },
  { id: 2, gradient: 'from-primary/20 to-amber-900/30', label: 'Studio sessions' },
  { id: 3, gradient: 'from-blue-900/30 to-purple-900/30', label: 'Live moments' },
  { id: 4, gradient: 'from-amber-900/30 to-primary/20', label: 'Gig life' },
  { id: 5, gradient: 'from-primary/10 to-blue-900/30', label: 'New music updates' },
  { id: 6, gradient: 'from-purple-900/20 to-amber-900/20', label: 'Community love' },
];

export default function InstagramFeed() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-1">Social</p>
            <h2 className="font-display text-3xl text-foreground flex items-center gap-2">
              <Instagram className="w-6 h-6 text-primary/70" /> @gannonwaye
            </h2>
          </div>
          <a href="https://www.instagram.com/gannonwaye" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-full gap-2 font-body text-xs tracking-wider uppercase border-primary/30 text-primary hover:bg-primary/10">
              <Instagram className="w-3.5 h-3.5" /> Follow on Instagram <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PLACEHOLDER_POSTS.map((post, i) => (
            <motion.a
              key={post.id}
              href="https://www.instagram.com/gannonwaye"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`aspect-square rounded-xl bg-gradient-to-br ${post.gradient} border border-border/20 flex items-end p-3 hover:border-primary/30 hover:scale-[1.02] transition-all group cursor-pointer overflow-hidden`}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-body text-xs text-foreground/60">{post.label}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                <Instagram className="w-12 h-12 text-foreground" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center font-body text-xs text-muted-foreground mt-4"
        >
          Live Instagram feed coming soon · Follow <a href="https://www.instagram.com/gannonwaye" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@gannonwaye</a> for updates
        </motion.p>
      </div>
    </section>
  );
}