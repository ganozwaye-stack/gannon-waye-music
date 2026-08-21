import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, X } from 'lucide-react';

export default function SocialProofTicker() {
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  const { data: subscribers = [] } = useQuery({
    queryKey: ['ticker-subs'],
    queryFn: () => base44.entities.EmailSubscriber.list('-created_date', 50),
    staleTime: 300000,
  });

  const subCount = subscribers.length;

  const messages = [
    { icon: '🎵', text: '"Thank You" — the new single is streaming now' },
    { icon: '✨', text: subCount > 0 ? `${subCount}+ fans in the inner circle` : 'Join the inner circle — be part of something real' },
    { icon: '🌍', text: 'Listeners across 12 countries and counting' },
    { icon: '🖤', text: '10% of all proceeds support 1800RESPECT' },
    { icon: '🎶', text: 'Lyric archive — coming soon' },
    { icon: '🔥', text: 'Limited edition merch — while it lasts' },
  ];

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length, dismissed]);

  const handleDismiss = () => {
    try { sessionStorage.setItem('ticker-dismissed', '1'); } catch (e) {}
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
            <span className="mr-1.5">{messages[index].icon}</span>
            {messages[index].text}
          </p>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}