import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function StickySupportBar() {
  const [dismissed, setDismissed] = useState(false);
  const location = useLocation();

  // Don't show on the back-this page itself or admin pages
  if (location.pathname === '/back-this' || location.pathname.startsWith('/admin')) return null;
  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ delay: 3, duration: 0.5, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-primary/20 px-4 py-3 flex items-center justify-between gap-4"
      >
        <p className="font-body text-sm text-foreground/70 hidden sm:block">
          If this resonates… you can be part of it.
        </p>
        <p className="font-body text-xs text-foreground/70 sm:hidden">
          Be part of this.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link to="/back-this">
            <button className="gradient-gold-button rounded-full px-5 py-2 font-body text-xs tracking-wider uppercase flex items-center gap-2">
              <Heart className="w-3.5 h-3.5" /> Support 🤍
            </button>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}