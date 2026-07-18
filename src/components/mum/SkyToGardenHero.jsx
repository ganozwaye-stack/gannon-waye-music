import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Heart } from 'lucide-react';
import { WithoutYouHereFeature } from './SoniaAmbientPlayer';

const SKY_WASH = '/images/mum/mum-sky-clean-crop.jpg';

export default function SkyToGardenHero() {
  return (
    <section
      id="entrance"
      className="relative min-h-[118vh] overflow-hidden"
      style={{ background: '#020502' }}
    >
      <div className="absolute inset-x-0 top-0 h-[58vh] md:h-[66vh]">
        <img
          src={SKY_WASH}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          style={{
            objectPosition: 'center top',
            filter: 'brightness(0.72) saturate(0.86) contrast(1.02)',
          }}
        />
      </div>
      <div
        className="absolute inset-x-0 top-0 h-[72vh] pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(2,5,2,0.08) 0%, rgba(2,5,2,0.45) 58%, rgba(2,5,2,0.98) 100%)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 65% 45% at 68% 34%, rgba(216,192,113,0.10), transparent 62%),
            linear-gradient(to right, rgba(2,5,2,0.96) 0%, rgba(2,5,2,0.64) 42%, rgba(2,5,2,0.22) 100%),
            linear-gradient(to bottom, rgba(2,5,2,0.38) 0%, rgba(2,5,2,0.10) 30%, rgba(2,5,2,0.88) 100%)
          `,
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-5 pb-28 pt-24 md:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.82fr)] md:px-10 md:pt-32 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="max-w-2xl text-left"
        >
          <p className="font-body mb-5 text-[9px] uppercase text-primary/55" style={{ letterSpacing: '0.46em' }}>
            For Mum - Sonia Katisa Waye
          </p>
          <h1
            className="font-display leading-[0.94] text-foreground"
            style={{ fontSize: 'clamp(2.55rem, 8vw, 8.2rem)' }}
          >
            Her love meets us in the sky first.
          </h1>
          <div className="my-5 flex items-center gap-3 md:my-7">
            <div className="h-px w-20" style={{ background: 'linear-gradient(to right, rgba(212,175,55,0.72), transparent)' }} />
            <Heart className="h-4 w-4 text-primary/45" fill="rgba(212,175,55,0.22)" />
          </div>
          <div className="mb-8 md:hidden">
            <WithoutYouHereFeature compact />
          </div>
          <p className="font-body max-w-xl text-base leading-relaxed text-foreground/68 md:text-lg">
            A page for the song, the memories, and the garden she left behind. Sky first, then the page carries you down through light, voice, photographs, and the love that keeps rising.
          </p>
          <p className="font-display mt-8 max-w-xl text-2xl italic leading-snug text-primary/80 md:text-3xl">
            "Boy... you're not finished yet."
          </p>
          <p className="font-body mt-8 text-[10px] uppercase text-primary/38" style={{ letterSpacing: '0.32em' }}>
            1961 - 2022 / Forever in our hearts
          </p>
        </motion.div>

        <div className="hidden md:block">
          <WithoutYouHereFeature compact />
        </div>
      </div>

      <motion.div
        className="absolute bottom-12 left-0 right-0 z-10 flex flex-col items-center gap-2"
        animate={{ opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p className="font-body text-[9px] uppercase text-primary/42" style={{ letterSpacing: '0.36em' }}>
          Scroll into her garden
        </p>
        <ChevronDown className="h-5 w-5 text-primary/38" />
      </motion.div>
    </section>
  );
}
