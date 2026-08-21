import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function UpcomingMusic() {
  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center rounded-3xl border border-primary/20 bg-card/50 p-10 md:p-14"
      >
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">
          Verified announcements only
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-foreground mb-5">
          Upcoming Music
        </h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          No upcoming song title, date, artwork, lyric, or presave link is public until Gannon explicitly approves that exact announcement.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link to="/music">
            <Button className="rounded-full gradient-gold-button border-0">View Public Music</Button>
          </Link>
          <Link to="/community">
            <Button variant="outline" className="rounded-full border-primary/35 text-primary">
              Join the Community
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
