import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import GoldDust from './GoldDust';

export default function CinematicScene({ image, children, minH = '100vh', zoom = true, vignette = true }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '4%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.12, 0.85, 1], [0, 1, 1, 0.4]);

  return (
    <section ref={ref} className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: minH, background: '#0a1120' }}>
      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ scale: zoom ? scale : 1, y }}>
        <img src={image} alt="" className="max-w-full max-h-full object-contain" style={{ width: '100%', height: '100%' }} />
      </motion.div>
      {vignette && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 130% 110% at 50% 50%, transparent 25%, rgba(10,17,32,0.55) 100%),
            linear-gradient(to top, rgba(10,17,32,0.9) 0%, transparent 28%),
            linear-gradient(to bottom, rgba(10,17,32,0.5) 0%, transparent 20%)
          `,
        }} />
      )}
      <GoldDust count={18} />
      {children && (
        <motion.div className="relative z-10 w-full" style={{ opacity: contentOpacity }}>
          {children}
        </motion.div>
      )}
    </section>
  );
}