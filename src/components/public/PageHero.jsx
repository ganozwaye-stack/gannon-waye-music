import { motion } from 'framer-motion';

// Shared hero banner, the Gannon sky image, adapted to every public page
// so the brand's hero imaging runs site-wide, not just on Home.
const HERO_BG = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cb360d5ee_image.png';

export default function PageHero({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: '52vh' }}>
      <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(8,8,14,0.6) 0%, rgba(8,8,14,0.35) 45%, rgba(8,8,14,0.92) 100%)' }}
      />
      <div
        className={`relative z-10 max-w-5xl mx-auto px-4 md:px-6 h-full flex flex-col justify-end pb-14 pt-32 ${
          align === 'center' ? 'items-center text-center' : 'items-start text-left'
        }`}
      >
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl gradient-gold-text"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-sm text-muted-foreground max-w-xl mt-4"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}