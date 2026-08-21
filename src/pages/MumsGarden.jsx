import { motion } from 'framer-motion';
import CinematicScene from '@/components/mums-garden/CinematicScene';
import FiligreeDivider from '@/components/mums-garden/FiligreeDivider';
import GardenHotspots from '@/components/mums-garden/GardenHotspots';
import MumGardenGallery from '@/components/mums-garden/MumGardenGallery';
import MumMemoryObjects from '@/components/mum/MumMemoryObjects';

const GARDEN_HERO = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/348532fd6_generated_image.png';
const GARDEN_SCENE = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3f0a494fe_ChatGPTImageJun23202605_44_12PM.png';

const HOTSPOTS = [
  { x: 28, y: 40, src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f40dcf451_ChatGPTImageJun23202605_44_06PM.png', caption: 'Every word, a memory', memory: 'The words she left behind live on in every song.' },
  { x: 50, y: 26, src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/70762b7fa_ChatGPTImageJun23202605_44_19PM.png', caption: 'The story behind the artwork', memory: 'Each frame holds a moment I keep returning to.' },
  { x: 70, y: 44, src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9b3f9f67b_ChatGPTImageJun23202605_43_41PM.png', caption: 'I wanted her to feel present', memory: 'I built this so she would never feel far away.' },
  { x: 40, y: 64, src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/ed16421e2_ChatGPTImageJun23202605_43_37PM.png', caption: 'Her love lights the way', memory: 'A quiet light that still guides me home.' },
  { x: 64, y: 72, src: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/03843c612_ChatGPTImageJun23202605_43_47PM2.png', caption: 'A song for my mum', memory: 'Every note is a letter she can still read.' },
];

export default function MumsGarden() {
  return (
    <div className="relative w-full" style={{ background: '#0a0a0f' }}>
      {/* ── Cinematic hero ── */}
      <CinematicScene image={GARDEN_HERO} minH="100vh">
        <div className="px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.3 }}
            className="mb-5 flex items-center justify-center gap-2.5 font-body text-[10px] uppercase tracking-[0.5em]"
            style={{ color: 'rgba(245,224,160,0.5)' }}
          >
            <span aria-hidden>❀</span> A Tribute · For Mum <span aria-hidden>❀</span>
          </motion.p>

          <motion.svg
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.4 }}
            viewBox="0 0 64 64"
            className="mx-auto mb-3 h-14 w-14"
            fill="none"
            aria-hidden
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

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.5 }}
            className="gradient-gold-text"
            style={{ fontFamily: "'Dancing Script', cursive", fontSize: 'clamp(3rem, 8vw, 5.5rem)', textShadow: '0 0 30px rgba(212,175,55,0.3)', lineHeight: 1 }}
          >
            Sonia&rsquo;s Garden
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.2 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <FiligreeDivider />
            <p className="font-display text-lg italic md:text-xl" style={{ color: 'rgba(255,255,255,0.55)' }}>
              In Loving Memory of
            </p>
            <p
              className="font-display"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'rgba(245,224,160,0.85)', textShadow: '0 0 30px rgba(245,224,160,0.3)' }}
            >
              Sonia Katisa Waye
            </p>
            <p className="font-body text-sm tracking-[0.4em]" style={{ color: 'rgba(245,224,160,0.4)' }}>
              1961 – 2022
            </p>
          </motion.div>
        </div>
      </CinematicScene>

      {/* ── Garden walkthrough · memory hotspots ── */}
      <section className="relative px-6 py-20">
        <div className="mb-10 text-center">
          <p className="mb-3 font-body text-[10px] uppercase tracking-[0.5em]" style={{ color: 'rgba(245,224,160,0.45)' }}>
            Walk gently through her garden
          </p>
          <h2 className="font-display text-2xl italic md:text-3xl" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Touch a light to remember
          </h2>
        </div>
        <div
          className="mx-auto max-w-5xl overflow-hidden rounded-2xl"
          style={{ border: '1px solid rgba(212,175,55,0.18)' }}
        >
          <GardenHotspots scene={GARDEN_SCENE} hotspots={HOTSPOTS} />
        </div>
      </section>

      {/* ── 3D-framed memory gallery ── */}
      <MumGardenGallery />

      {/* ── Her world · objects ── */}
      <MumMemoryObjects />

      {/* ── Closing ── */}
      <section className="relative px-6 py-24 text-center">
        <FiligreeDivider />
        <p
          className="mx-auto mt-8 max-w-xl font-display text-xl italic md:text-2xl"
          style={{ color: 'rgba(255,255,255,0.62)' }}
        >
          &ldquo;She is the garden now.&rdquo;
        </p>
        <p className="mt-6 font-body text-[10px] uppercase tracking-[0.4em]" style={{ color: 'rgba(245,224,160,0.35)' }}>
          Forever in our hearts
        </p>
      </section>
    </div>
  );
}