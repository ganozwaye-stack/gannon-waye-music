import { motion } from 'framer-motion';

// A 3D-styled gold frame that holds a single memory image.
// Subtle entrance tilt + hover lift give it depth without being flashy.
export default function MemoryFrame({ src, caption, delay = 0 }) {
  return (
    <motion.figure
      className="group relative"
      initial={{ opacity: 0, y: 48, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
    >
      <div
        className="relative overflow-hidden transition-transform duration-700 group-hover:-translate-y-1.5"
        style={{
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(145deg, rgba(20,16,10,0.92), rgba(8,8,12,0.96))',
          border: '1px solid rgba(212,175,55,0.35)',
          boxShadow: '0 18px 42px rgba(0,0,0,0.55), inset 0 1px 0 rgba(212,175,55,0.25)',
          padding: '10px',
        }}
      >
        {/* inner filigree border */}
        <div
          className="pointer-events-none absolute inset-2"
          style={{ border: '1px solid rgba(212,175,55,0.18)' }}
        />
        {/* corner accents */}
        {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute ${pos} h-3 w-3`}
            style={{ borderTop: '1px solid rgba(212,175,55,0.4)', borderLeft: '1px solid rgba(212,175,55,0.4)' }}
          />
        ))}
        <div className="relative aspect-[4/5] overflow-hidden" style={{ background: 'rgba(245,224,160,0.03)' }}>
          <img
            src={src}
            alt={caption || ''}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
            style={{ filter: 'saturate(0.88) brightness(0.94)' }}
          />
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-700 group-hover:opacity-0"
            style={{ background: 'linear-gradient(to bottom, transparent 45%, rgba(8,8,12,0.55) 100%)' }}
          />
        </div>
        {caption && (
          <figcaption className="mt-3 text-center">
            <p
              className="font-display text-sm italic md:text-base"
              style={{ color: 'rgba(255,255,255,0.72)', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
            >
              {caption}
            </p>
          </figcaption>
        )}
      </div>
    </motion.figure>
  );
}