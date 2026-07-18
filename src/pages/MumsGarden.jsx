import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Play } from 'lucide-react';
import CinematicScene from '@/components/mums-garden/CinematicScene';
import GoldDust from '@/components/mums-garden/GoldDust';
import FiligreeDivider from '@/components/mums-garden/FiligreeDivider';
import MumGardenGallery from '@/components/mums-garden/MumGardenGallery';
import { WITHOUT_YOU_HERE_COVER } from '@/config/releaseAssets';

const IMG = {
  cover: WITHOUT_YOU_HERE_COVER,
  coverAlt: WITHOUT_YOU_HERE_COVER,
  sky: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/3f0a494fe_ChatGPTImageJun23202605_44_12PM.png',
  title: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f40dcf451_ChatGPTImageJun23202605_44_06PM.png',
  story: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/70762b7fa_ChatGPTImageJun23202605_44_19PM.png',
  built: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/bf49dfafc_ChatGPTImageJun23202605_44_01PM.png',
  present: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/9b3f9f67b_ChatGPTImageJun23202605_43_41PM.png',
  song: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/03843c612_ChatGPTImageJun23202605_43_47PM2.png',
  single: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/f040fdc86_ChatGPTImageJun23202605_43_47PM1.png',
  light: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/ed16421e2_ChatGPTImageJun23202605_43_37PM.png',
  forever: 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/b52c8e6ce_ChatGPTImageJun23202605_43_31PM.png',
};

function Interlude({ children }) {
  return (
    <section className="relative flex items-center justify-center py-32 px-6" style={{ background: '#0a1120', minHeight: '60vh' }}>
      <GoldDust count={12} />
      <motion.div
        className="relative z-10 max-w-xl text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        {children}
      </motion.div>
    </section>
  );
}

function SceneCaption({ text }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 pb-16 px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 1.2 }}
        className="font-display italic text-lg md:text-xl" style={{ color: 'rgba(255,255,255,0.55)' }}
      >
        {text}
      </motion.p>
    </div>
  );
}

export default function MumsGarden() {
  return (
    <div className="relative overflow-x-hidden" style={{ background: '#0a1120' }}>
      {/* ══ HERO — Official Cover ══ */}
      <CinematicScene image={IMG.cover}>
        <div className="flex flex-col items-center justify-end min-h-screen text-center px-6 pb-20">
          <motion.p
            className="font-body text-[10px] tracking-[0.5em] uppercase mb-8"
            style={{ color: 'rgba(245,224,160,0.45)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1.5 }}
          >
            A Tribute · For Mum
          </motion.p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <ChevronDown className="w-5 h-5" style={{ color: 'rgba(245,224,160,0.3)' }} />
          </motion.div>
        </div>
      </CinematicScene>

      {/* ══ INTERLUDE — Written on Mother's Day ══ */}
      <Interlude>
        <p className="font-body text-[10px] tracking-[0.4em] uppercase mb-4" style={{ color: 'rgba(245,224,160,0.4)' }}>
          Written on Mother's Day
        </p>
        <p className="font-display italic text-xl md:text-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          "This song is the most honest I have ever been in my music.
          She wasn't just my mum — she was my best friend."
        </p>
        <FiligreeDivider />
      </Interlude>

      {/* ══ SCENE — The Question ══ */}
      <CinematicScene image={IMG.sky}>
        <SceneCaption text="I looked up and asked the sky…" />
      </CinematicScene>

      {/* ══ SCENE — Choosing the Title ══ */}
      <CinematicScene image={IMG.title}>
        <SceneCaption text="Every word, a memory" />
      </CinematicScene>

      {/* ══ INTERLUDE — The Production ══ */}
      <Interlude>
        <p className="font-display italic text-lg md:text-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          A stripped-back, acoustic masterpiece. A raw, unfiltered letter
          to his late mother. Produced by Will Henderson.
        </p>
        <p className="font-body text-xs tracking-[0.3em] uppercase mt-6" style={{ color: 'rgba(245,224,160,0.4)' }}>
          Available July 31, 2026
        </p>
        <FiligreeDivider />
      </Interlude>

      {/* ══ SCENE — The Story Behind the Artwork ══ */}
      <CinematicScene image={IMG.story}>
        <SceneCaption text="The story behind the artwork" />
      </CinematicScene>

      {/* ══ SCENE — Built From Memory ══ */}
      <CinematicScene image={IMG.built}>
        <SceneCaption text="Built from memory, stitch by stitch" />
      </CinematicScene>

      {/* ══ INTERLUDE — Presence ══ */}
      <Interlude>
        <p className="font-display italic text-lg md:text-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          I wanted her to feel present —
          not just remembered, but here.
        </p>
        <FiligreeDivider />
      </Interlude>

      {/* ══ SCENE — I Wanted Her to Feel Present ══ */}
      <CinematicScene image={IMG.present}>
        <SceneCaption text="I wanted her to feel present" />
      </CinematicScene>

      {/* ══ SCENE — A Song for My Mum + Listen CTA ══ */}
      <CinematicScene image={IMG.song}>
        <div className="absolute bottom-0 left-0 right-0 pb-16 px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1.2 }}
            className="font-display italic text-lg md:text-xl mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            A song for my mum
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
          >
            <Link to="/music">
              <button
                className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-body text-xs tracking-widest uppercase transition-all hover:scale-105"
                style={{ background: 'rgba(245,224,160,0.08)', border: '1px solid rgba(245,224,160,0.3)', color: 'rgba(245,224,160,0.85)' }}
              >
                <Play className="w-3.5 h-3.5" /> Listen to Without You Here
              </button>
            </Link>
          </motion.div>
        </div>
      </CinematicScene>

      {/* ══ SCENE — The Single ══ */}
      <CinematicScene image={IMG.single}>
        <SceneCaption text="The single" />
      </CinematicScene>

      {/* ══ SCENE — Her Love Lights the Way ══ */}
      <CinematicScene image={IMG.light}>
        <SceneCaption text="Her love lights the way" />
      </CinematicScene>

      {/* ══ SCENE — Forever in My Heart ══ */}
      <CinematicScene image={IMG.forever}>
        <SceneCaption text="Forever in my heart" />
      </CinematicScene>

      {/* ══ GALLERY — A Garden of Memories ══ */}
      <MumGardenGallery />

      {/* ══ CLOSING — In Loving Memory ══ */}
      <CinematicScene image={IMG.coverAlt}>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2 }}
          >
            <p className="font-display italic text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>In Loving Memory of</p>
            <h2 className="font-display mt-2" style={{
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              color: 'rgba(245,224,160,0.85)',
              textShadow: '0 0 30px rgba(245,224,160,0.3)',
            }}>Sonia Katisa Waye</h2>
            <p className="font-body tracking-[0.4em] mt-3 text-sm" style={{ color: 'rgba(245,224,160,0.4)' }}>1961 – 2022</p>
            <FiligreeDivider />
            <p className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Forever in our hearts
            </p>
          </motion.div>
        </div>
      </CinematicScene>
    </div>
  );
}
