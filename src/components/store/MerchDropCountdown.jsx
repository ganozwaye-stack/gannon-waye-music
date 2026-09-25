import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { MERCH_DROP_AT } from '@/config/merchDrop';

// Big, clear countdown to the 5pm AEST merch drop. Left aligned, 3D flip-in digits.
const pad = (n) => String(n).padStart(2, '0');

export default function MerchDropCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = MERCH_DROP_AT - now;

  if (diff <= 0) {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/10 px-5 py-5 mb-10 text-left flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-primary flex-shrink-0" />
        <p className="font-body text-lg md:text-2xl uppercase tracking-wider gradient-gold-glow">The Set Free merch has dropped · Shop it below</p>
      </div>
    );
  }

  const s = Math.floor(diff / 1000);
  const units = [
    { label: 'Hours', value: pad(Math.floor(s / 3600)) },
    { label: 'Minutes', value: pad(Math.floor((s % 3600) / 60)) },
    { label: 'Seconds', value: pad(s % 60) },
  ];

  return (
    <div className="rounded-2xl border border-primary/40 px-5 py-6 md:px-8 md:py-8 mb-10 text-left" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.14), rgba(8,8,14,0.85))', perspective: 900 }}>
      <p className="font-body text-[11px] tracking-[0.35em] uppercase text-primary mb-2">The Set Free merch drop · today 5pm AEST</p>
      <h2 className="font-body text-2xl md:text-4xl uppercase tracking-wider gradient-gold-text mb-5">Don't miss the drop</h2>
      <div className="flex justify-start gap-3 md:gap-5">
        {units.map((u) => (
          <div key={u.label} className="rounded-xl border border-primary/30 bg-background/70 px-3 py-3 md:px-6 md:py-4 min-w-[84px] md:min-w-[130px] shadow-[0_18px_36px_rgba(0,0,0,0.5)]">
            <motion.p
              key={u.value}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="font-body font-bold text-5xl md:text-7xl tabular-nums gradient-gold-glow leading-none"
            >
              {u.value}
            </motion.p>
            <p className="font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-muted-foreground mt-2">{u.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}