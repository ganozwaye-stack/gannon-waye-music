import { motion } from 'framer-motion';
import { ExternalLink, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SOCIAL_LINKS = [
  ['Instagram', 'https://www.instagram.com/gann0nwaye'],
  ['TikTok', 'https://www.tiktok.com/@gann0nwaye'],
  ['YouTube', 'https://www.youtube.com/@gannonwayeofficial'],
];

export default function Videos() {
  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">
            Watch and follow
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-foreground mb-5">Videos</h1>
          <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Instagram Reels, TikToks, and official artist videos.
          </p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-primary/20 bg-card/50 p-10 md:p-14 text-center"
        >
          <Video className="w-11 h-11 text-primary/60 mx-auto mb-5" />
          <h2 className="font-display text-3xl text-foreground mb-3">Official video library</h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Release-specific videos will appear here only after they are linked to an exact public Release. Follow the official channels for verified artist updates.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {SOCIAL_LINKS.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 rounded-full border-primary/35 text-primary">
                  {label} <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}