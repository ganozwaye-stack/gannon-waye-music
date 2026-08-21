import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function TikTokWelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('utm_source') || '';
    if (ref.toLowerCase().includes('tiktok')) {
      setVisible(true);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3"
          style={{
            background: 'linear-gradient(90deg, #0e1117ee, #1a0a2eee)',
            borderBottom: '1px solid rgba(245,208,110,0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex items-center gap-3 flex-1 justify-center">
            <span className="text-lg">🎵</span>
            <p className="font-body text-sm text-foreground/90">
              Welcome from TikTok 🤍 — you made it. This is the real place.
            </p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}