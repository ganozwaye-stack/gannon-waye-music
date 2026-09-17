import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Set Free drops 25 September 2026, midnight Melbourne time.
const TARGET = new Date('2026-09-25T00:00:00+10:00').getTime();

const pad = (n) => String(n).padStart(2, '0');

// `vertical` renders the units as a narrow strip running down one side of a box.
export default function SetFreeCountdown({ vertical = false }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = TARGET - now;

  if (remaining <= 0) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="font-body text-sm tracking-[0.3em] uppercase gradient-gold-glow my-6 text-center">
        Set Free · Out Now
      </motion.p>
    );
  }

  const units = [
    { label: 'Days', value: Math.floor(remaining / 86400000) },
    { label: 'Hours', value: Math.floor((remaining % 86400000) / 3600000) },
    { label: 'Mins', value: Math.floor((remaining % 3600000) / 60000) },
    { label: 'Secs', value: Math.floor((remaining % 60000) / 1000) },
  ];

  if (vertical) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 1.45 }}
        data-testid="set-free-countdown"
        className="flex flex-col items-center gap-2 h-full">
        <p className="font-body text-[8px] tracking-[0.35em] uppercase text-muted-foreground text-center leading-tight mb-0.5">
          Arrives in
        </p>
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-xl border border-primary/30 px-2 py-2 w-[54px] text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(8,8,14,0.45) 100%)',
              boxShadow: '0 0 18px rgba(212,175,55,0.14), 0 4px 14px rgba(0,0,0,0.35)',
            }}>
            <p className="font-body text-lg gradient-gold-glow tabular-nums leading-none">{pad(unit.value)}</p>
            <p className="font-body text-[7px] tracking-[0.2em] uppercase text-muted-foreground mt-1">{unit.label}</p>
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 1.45 }}
      data-testid="set-free-countdown"
      className="my-5">
      <p className="font-body text-[9px] tracking-[0.4em] uppercase text-muted-foreground text-center mb-2.5">
        Set Free arrives in
      </p>
      <div className="flex items-center justify-center gap-2.5 md:gap-3">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-xl border border-primary/30 px-2.5 md:px-3 py-2 min-w-[58px] md:min-w-[66px] text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(8,8,14,0.45) 100%)',
              boxShadow: '0 0 18px rgba(212,175,55,0.14), 0 4px 14px rgba(0,0,0,0.35)',
            }}>
            <p className="font-body text-xl md:text-2xl gradient-gold-glow tabular-nums leading-none">{pad(unit.value)}</p>
            <p className="font-body text-[8px] tracking-[0.25em] uppercase text-muted-foreground mt-1.5">{unit.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}