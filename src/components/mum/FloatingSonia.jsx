import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function FloatingSonia() {
  const { scrollY } = useScroll();
  const [hovered, setHovered] = useState(false);

  // Parallax: translate Sonia vertically based on page scroll
  // She drifts down slowly as the user scrolls, staying in view but shifting relative to text
  const y = useTransform(scrollY, [0, 3000], [-30, 200]);
  const rotate = useTransform(scrollY, [0, 3000], [-8, 8]);
  const scale = useTransform(scrollY, [0, 1500, 3000], [0.95, 1.05, 0.95]);

  const handleClick = () => {
    const el = document.getElementById('sonias-garden');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="fixed right-6 md:right-8 top-[32%] z-40 cursor-pointer hidden md:block select-none"
      style={{ y, rotate, scale }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 1 }}
    >
      <div className="relative group">
        {/* Soft radial golden aura */}
        <motion.div
          className="absolute -inset-4 rounded-full pointer-events-none z-0"
          animate={{
            scale: hovered ? [1, 1.15, 1] : [1, 1.08, 1],
            opacity: hovered ? [0.4, 0.7, 0.4] : [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.22) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />

        {/* Pulsing outer golden ring */}
        <div 
          className="absolute -inset-1 rounded-full border border-primary/30 group-hover:border-primary/60 transition-colors duration-500 z-0"
          style={{
            boxShadow: '0 0 15px rgba(212,175,55,0.15)',
          }}
        />

        {/* The portrait circle */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-primary/50 shadow-2xl z-10">
          <img
            src="/images/mum/mum_avatar.png"
            alt="Sonia's warm portrait"
            className="w-full h-full object-cover grayscale-[15%] group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        </div>

        {/* Floating leaf element drifting around the portrait */}
        <motion.div
          className="absolute -top-1 -left-1 z-20 pointer-events-none"
          animate={{ y: [-2, 3, -2], rotate: [-5, 5, -5] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="rgba(212,175,55,0.45)">
            <path d="M10 2 C 5 7 2 12 10 18 C 18 12 15 7 10 2 Z" />
          </svg>
        </motion.div>

        {/* Cinematic tooltip */}
        <motion.div
          className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/85 border border-primary/20 rounded-xl py-1.5 px-3 whitespace-nowrap shadow-2xl pointer-events-none z-30"
          animate={{
            opacity: hovered ? 1 : 0,
            x: hovered ? 0 : 8,
          }}
          transition={{ duration: 0.3 }}
        >
          <p className="font-display text-[10px] italic text-foreground tracking-wider">
            "Boy, you're not finished yet."
          </p>
          <p className="font-body text-[8px] text-primary/60 uppercase tracking-widest mt-0.5">
            Seek Her Wisdom
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
