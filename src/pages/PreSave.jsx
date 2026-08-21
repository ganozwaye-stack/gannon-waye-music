import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PreSave() {
  return (
    <div className="min-h-screen py-24 px-4 md:px-8 flex items-center justify-center">
      <motion.main
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl rounded-3xl border border-primary/20 bg-card/50 p-10 md:p-14 text-center"
      >
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">
          Verified links only
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-foreground mb-5">Pre-save</h1>
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          There is no owner-approved public presave link right now. Links will appear only after the exact distributor URL and announcement are verified.
        </p>
        <Link to="/music" className="inline-block mt-8">
          <Button className="rounded-full gradient-gold-button border-0 px-7">
            Visit the Music Page
          </Button>
        </Link>
      </motion.main>
    </div>
  );
}
