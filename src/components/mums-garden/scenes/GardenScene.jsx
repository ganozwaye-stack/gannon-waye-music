import { motion } from 'framer-motion';
import { useRef } from 'react';

/**
 * Shared full-bleed scene wrapper for the continuous garden walk.
 * Moody, dark, atmospheric — built to feel like moving through a place,
 * not scrolling past page sections.
 */
export default function GardenScene({
  id,
  children,
  minHeight = '100vh',
  background,
  zIndex = 0,
}) {
  const ref = useRef(null);
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ minHeight, background, zIndex }}
    >
      {children}
    </motion.section>
  );
}