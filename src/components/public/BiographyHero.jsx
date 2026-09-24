import { motion, useScroll, useTransform } from 'framer-motion';
import GoldenEmbers from '@/components/three/GoldenEmbers';

// Full-screen biography hero: the portrait fills the screen behind the bio
// text, which sits left aligned over a left-to-right shade. The portrait drifts
// on scroll (parallax) and the text block floats forward in 3D.
const HERO_PORTRAIT = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/637f52efd_image.png';

const reveal = (delay) => ({ initial: { opacity: 0, x: -24, rotateY: 12 }, animate: { opacity: 1, x: 0, rotateY: 0 }, transition: { duration: 0.8, delay } });

export default function BiographyHero() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 800], [0, 160]);
  const imgScale = useTransform(scrollY, [0, 800], [1.08, 1.18]);

  return (
    <section className="relative -mt-16 min-h-[100svh] overflow-hidden flex items-end md:items-center">
      <motion.img
        src={HERO_PORTRAIT}
        alt="Gannon Waye, looking up into the light"
        fetchpriority="high"
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0 w-full h-full max-w-none object-cover object-[65%_center]"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(8,8,14,0.92) 0%, rgba(8,8,14,0.72) 45%, rgba(8,8,14,0.2) 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }} />
      <div className="absolute inset-0 opacity-40 pointer-events-none"><GoldenEmbers density={0.5} intensity={0.45} /></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 md:px-10 pt-28 pb-16 text-left" style={{ perspective: 1000 }}>
        <div className="max-w-xl">
          <motion.p {...reveal(0)} className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-4">The Artist</motion.p>
          <motion.h1 {...reveal(0.1)} className="font-display text-5xl md:text-7xl gradient-gold-text">Gannon Waye</motion.h1>
          <motion.p {...reveal(0.2)} className="font-body text-sm tracking-widest uppercase text-foreground/85 mt-3">Singer · Songwriter · Storyteller · Melbourne</motion.p>
          <motion.div {...reveal(0.32)} className="mt-6 space-y-4 font-body text-sm md:text-[15px] text-foreground/85 leading-relaxed" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
            <p>
              Gannon Waye is an independent Australian singer songwriter whose contemporary pop work turns lived experience into connection. Born in Adelaide and now based in Melbourne, he was raised in low socioeconomic conditions where formal music lessons were never possible. He built his craft by leading school choirs, singing in church, serving as a worship minister and taking every stage that would let him learn.
            </p>
            <p>
              His public catalogue begins with <em>Thankyou</em>, produced by Spike Leo and mastered by Nicholas Di Lorenzo at Panorama, followed by <em>Without You Here</em> and <em>Set Free</em>, produced by Will Henderson. The songs open the world of <em>I'm Still Here</em>, a fifteen song project shaped by family violence, abusive relationships, addiction, PTSD, grief and the decision to keep standing.
            </p>
            <p className="italic text-foreground/75">
              The purpose is not fame for its own sake. It is to reach people searching for a voice or a song that can say what they cannot yet say.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}