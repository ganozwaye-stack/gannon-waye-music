import { motion } from 'framer-motion';
import FiligreeDivider from '@/components/mums-garden/FiligreeDivider';

// The garden is still closed. One image: the path through her garden at golden hour. Nothing else.
const GARDEN_HERO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/348532fd6_generated_image.png';

export default function MumsGarden() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* The sky. Her, in the clouds, wings out. The only image. */}
      <img
        src={GARDEN_HERO}
        alt="Sonia's Garden"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark veil so the words rest gently on the sky */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 42%, rgba(8,8,14,0.2) 0%, rgba(8,8,14,0.72) 100%)' }}
      />

      {/* Sonia's Garden — Coming Soon */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 0.3 }}
          className="font-body text-[10px] tracking-[0.5em] uppercase mb-5 flex items-center gap-2.5"
          style={{ color: 'rgba(245,224,160,0.5)' }}
        >
          <span aria-hidden>❀</span> A Tribute · For Mum <span aria-hidden>❀</span>
        </motion.p>

        {/* Floral bloom */}
        <motion.svg
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          viewBox="0 0 64 64" className="w-14 h-14 mb-3" fill="none" aria-hidden
        >
          <g stroke="rgba(212,175,55,0.75)" strokeWidth="1.1" fill="rgba(212,175,55,0.10)">
            <ellipse cx="32" cy="13" rx="6.5" ry="10" />
            <ellipse cx="32" cy="51" rx="6.5" ry="10" />
            <ellipse cx="13" cy="32" rx="10" ry="6.5" />
            <ellipse cx="51" cy="32" rx="10" ry="6.5" />
            <ellipse cx="20.5" cy="20.5" rx="9" ry="9" transform="rotate(45 20.5 20.5)" />
            <ellipse cx="43.5" cy="43.5" rx="9" ry="9" transform="rotate(45 43.5 43.5)" />
          </g>
          <circle cx="32" cy="32" r="3.5" fill="rgba(212,175,55,0.7)" />
        </motion.svg>

        {/* Creative garden title with flanking floral flourishes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.5 }}
          className="flex items-center justify-center gap-4 md:gap-6"
        >
          <svg viewBox="0 0 110 40" className="hidden sm:block w-24 h-9" fill="none" aria-hidden>
            <path d="M2 20 C 24 14, 36 26, 56 20 C 76 14, 88 26, 108 20" stroke="rgba(212,175,55,0.55)" strokeWidth="1.1" />
            <ellipse cx="42" cy="14" rx="3" ry="6" fill="rgba(212,175,55,0.18)" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />
            <ellipse cx="70" cy="26" rx="3" ry="6" fill="rgba(212,175,55,0.18)" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />
            <circle cx="56" cy="20" r="2.4" fill="rgba(212,175,55,0.6)" />
          </svg>
          <h1
            className="gradient-gold-text"
            style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(3rem, 8vw, 5.5rem)', textShadow: '0 0 30px rgba(212,175,55,0.3)', lineHeight: 1 }}
          >
            Sonia&rsquo;s Garden
          </h1>
          <svg viewBox="0 0 110 40" className="hidden sm:block w-24 h-9 -scale-x-100" fill="none" aria-hidden>
            <path d="M2 20 C 24 14, 36 26, 56 20 C 76 14, 88 26, 108 20" stroke="rgba(212,175,55,0.55)" strokeWidth="1.1" />
            <ellipse cx="42" cy="14" rx="3" ry="6" fill="rgba(212,175,55,0.18)" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />
            <ellipse cx="70" cy="26" rx="3" ry="6" fill="rgba(212,175,55,0.18)" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />
            <circle cx="56" cy="20" r="2.4" fill="rgba(212,175,55,0.6)" />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1 }}
          className="font-body tracking-[0.45em] uppercase text-sm md:text-base mt-4"
          style={{ color: 'rgba(245,224,160,0.7)' }}
        >
          Coming Soon
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.4 }}
          className="mt-8"
        >
          <FiligreeDivider />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.8 }}
          className="font-display italic text-lg md:text-xl mt-6"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          In Loving Memory of
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 2 }}
          className="font-display mt-1"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'rgba(245,224,160,0.85)', textShadow: '0 0 30px rgba(245,224,160,0.3)' }}
        >
          Sonia Katisa Waye
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, delay: 2.4 }}
          className="font-body tracking-[0.4em] mt-2 text-sm"
          style={{ color: 'rgba(245,224,160,0.4)' }}
        >
          1961 – 2022
        </motion.p>
      </div>
    </div>
  );
}