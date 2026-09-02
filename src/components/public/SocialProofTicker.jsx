import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

const MESSAGES = [
  { icon: '🎵', text: 'Approved music and official listening links appear on the Music page' },
  { icon: '🖤', text: 'Independent, emotionally honest music from Gannon Waye' },
  { icon: '🛍️', text: 'The Store shows only current owner-approved stock' },
  { icon: '🎶', text: 'Follow the story through music and creative updates' },
];

export default function SocialProofTicker() {
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('ticker-dismissed') === '1') setDismissed(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (dismissed) return undefined;
    const interval = setInterval(() => {
      setIndex(current => (current + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [dismissed]);

  const handleDismiss = () => {
    try { sessionStorage.setItem('ticker-dismissed', '1'); } catch {}
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-16 md:bottom-5 left-1/2 -translate-x-1/2 z-30 px-4 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-card/80 backdrop-blur-xl border border-primary/20"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.06)' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 animate-pulse" />
          <p className="font-body text-xs text-foreground/80 flex-1 truncate">
            <span className="mr-1.5">{MESSAGES[index].icon}</span>
            {MESSAGES[index].text}
          </p>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors shrink-0" aria-label="Dismiss">
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
