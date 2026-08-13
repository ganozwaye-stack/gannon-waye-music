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
          className="font-body text-[10px] tracking-[0.5em] uppercase mb-6"
          style={{ color: 'rgba(245,224,160,0.5)' }}
        >
          A Tribute · For Mum
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.5 }}
          className="font-display gradient-gold-text"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', textShadow: '0 0 30px rgba(212,175,55,0.3)' }}
        >
          Sonia's Garden
        </motion.h1>

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