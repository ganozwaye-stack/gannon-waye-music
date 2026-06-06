import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const SECTIONS = [
  { id: 'her-story',  label: 'Her Story'  },
  { id: 'gallery',    label: 'Gallery'    },
  { id: 'her-world',  label: 'Her World'  },
  { id: 'our-love',   label: 'Our Love'   },
  { id: 'letters',    label: 'Letters'    },
  { id: 'legacy',     label: 'Legacy'     },
];

export default function MumMemorialNav() {
  const [active, setActive]   = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight whichever section is currently in view
  useEffect(() => {
    const ids = SECTIONS.map(s => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(id);
    }
  };

  return (
    <motion.div
      className="fixed left-0 right-0 z-50 flex justify-center px-4"
      style={{ top: '68px', pointerEvents: visible ? 'auto' : 'none' }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
      transition={{ duration: 0.35 }}
    >
      <div
        className="flex items-center gap-0.5 px-2 py-1.5 rounded-full flex-wrap justify-center"
        style={{
          background:       'rgba(5,8,4,0.82)',
          backdropFilter:   'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border:           '1px solid rgba(212,175,55,0.18)',
          boxShadow:        '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.06)',
        }}
      >
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className="font-body text-[9px] md:text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full transition-all duration-300"
            style={{
              color:      active === s.id ? 'rgba(245,208,110,1)' : 'rgba(212,175,55,0.45)',
              background: active === s.id ? 'rgba(212,175,55,0.12)' : 'transparent',
              letterSpacing: '0.18em',
            }}
          >
            {s.label}
          </button>
        ))}

        {/* ♥ Light a Candle */}
        <button
          onClick={() => scrollTo('light-a-candle')}
          className="ml-1 flex items-center gap-1 font-body text-[9px] md:text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full transition-all hover:scale-105"
          style={{
            background:  'linear-gradient(135deg, #c9a84c, #f5d06e)',
            color:       '#09100a',
            boxShadow:   '0 0 14px rgba(212,175,55,0.35)',
            fontWeight:  600,
          }}
        >
          <Heart className="w-2.5 h-2.5" fill="currentColor" />
          Light a Candle
        </button>
      </div>
    </motion.div>
  );
}