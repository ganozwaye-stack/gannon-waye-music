import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Heart } from 'lucide-react';

const SKY_ANGEL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f61fd7d43_generated_image.png';
const GARDEN_ENTRY = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b7806166d_generated_image.png';

export default function SkyToGardenHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Sky layer moves up and fades out as you scroll
  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const skyOpacity = useTransform(scrollYProgress, [0, 0.55, 0.8], [1, 0.8, 0]);
  const skyScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Garden layer fades in from below
  const gardenY = useTransform(scrollYProgress, [0.3, 1], ['40%', '0%']);
  const gardenOpacity = useTransform(scrollYProgress, [0.3, 0.65], [0, 1]);

  // Content fades
  const contentOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  // Scroll hint fades
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <section
      id="entrance"
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: '200vh' }}
    >
      {/* ══ SKY LAYER — Sonia as angel in blue sky ══ */}
      <motion.div
        className="absolute inset-0"
        style={{ y: skyY, opacity: skyOpacity, height: '100vh' }}
      >
        <motion.img
          src={SKY_ANGEL}
          alt="Sonia — forever watching over us"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 25%',
            scale: skyScale,
          }}
        />
        {/* Soft sky vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 30%, transparent 30%, rgba(15,30,60,0.15) 70%, rgba(5,10,25,0.4) 100%),
            linear-gradient(to bottom, transparent 60%, rgba(5,15,10,0.3) 90%, rgba(2,5,2,0.6) 100%)
          `,
        }} />
      </motion.div>

      {/* ══ GARDEN LAYER — emerges as sky scrolls away ══ */}
      <motion.div
        className="absolute inset-0"
        style={{ y: gardenY, opacity: gardenOpacity, height: '100vh', top: '100vh' }}
      >
        <img
          src={GARDEN_ENTRY}
          alt=""
          aria-hidden
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            filter: 'brightness(0.42) saturate(0.9) contrast(1.05)',
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            linear-gradient(to right,  rgba(2,5,2,0.92) 0%, rgba(2,5,2,0.35) 16%, transparent 40%),
            linear-gradient(to left,   rgba(2,5,2,0.92) 0%, rgba(2,5,2,0.35) 16%, transparent 40%),
            linear-gradient(to top,    rgba(2,5,2,0.95) 0%, rgba(2,5,2,0.40) 30%, transparent 60%),
            linear-gradient(to bottom, rgba(2,5,2,0.50) 0%, transparent 30%)
          `,
        }} />
      </motion.div>

      {/* ══ HERO CONTENT — name and intro ══ */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
        style={{ opacity: contentOpacity, y: contentY, height: '100vh' }}
      >
        <motion.p
          className="font-body text-[8px] md:text-[10px] tracking-[0.8em] uppercase mb-6"
          style={{ color: 'rgba(255,255,255,0.45)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.5 }}
        >
          A Tribute · Forever in Our Hearts
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.8 }}
        >
          <p className="font-display italic mb-2" style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 'clamp(0.9rem,2.2vw,1.2rem)',
          }}>
            In Loving Memory of
          </p>
          <h1 className="font-display leading-none" style={{
            fontSize: 'clamp(3.5rem,11vw,7.5rem)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f5d06e 40%, #ffe08a 50%, #f5d06e 60%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.5)) drop-shadow(0 0 80px rgba(255,220,100,0.3))',
          }}>
            Sonia
          </h1>
          <h2 className="font-display text-foreground/90 tracking-widest" style={{
            fontSize: 'clamp(1.1rem,3.5vw,2.2rem)',
            letterSpacing: '0.14em',
            textShadow: '0 0 20px rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.8)',
          }}>
            Katisa Waye
          </h2>
          <p className="font-body tracking-[0.65em] mt-2" style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.7rem',
          }}>
            1961 – 2022
          </p>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="w-14 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3))' }} />
          <Heart className="w-3 h-3" fill="rgba(255,255,255,0.2)" style={{ color: 'rgba(255,255,255,0.25)' }} />
          <div className="w-14 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.3))' }} />
        </motion.div>

        <motion.blockquote
          className="max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1.5 }}
        >
          <p className="font-display italic leading-relaxed" style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 'clamp(1rem,2.5vw,1.4rem)',
          }}>
            "As long as you remember me,<br />my memory will live on."
          </p>
        </motion.blockquote>
      </motion.div>

      {/* ══ SCROLL HINT ══ */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2 z-10"
        style={{ opacity: hintOpacity, height: '100vh' }}
      >
        <div className="flex-1" />
        <motion.p
          className="font-body text-[9px] tracking-[0.4em] uppercase"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          animate={{ opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Scroll to her garden
        </motion.p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.25)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}