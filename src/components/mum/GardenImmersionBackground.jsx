import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// The real garden photos — layered for physical depth
const DEEP_GARDEN   = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/49f01d22f_857913d8-6472-4f97-b0f6-697a789530ac.png';
const GOLD_HORIZON  = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/23c5eab45_image-generation_soED5efOMtOFxZ5QGy1JLIyzhOB3_1780293804650_result.jpeg';
const GOLD_SHIMMER  = 'https://media.base44.com/videos/public/69eb7905ca6eb4180010f794/304cd2b07_gold_shimmer_overlay.mp4';
const GOLD_SWEEP    = 'https://media.base44.com/videos/public/69eb7905ca6eb4180010f794/5dd0968fe_gold_light_sweep.mp4';

// Candle positions matching the deep garden image
const CANDLES = [
  { left: '18%',  top: '40%', w: 70,  h: 110, dur: 2.4,  delay: 0   },
  { left: '78%',  top: '35%', w: 55,  h:  90, dur: 3.1,  delay: 0.7 },
  { left: '8%',   top: '60%', w: 45,  h:  75, dur: 2.8,  delay: 1.4 },
  { left: '88%',  top: '55%', w: 45,  h:  75, dur: 3.5,  delay: 0.4 },
  { left: '34%',  top: '20%', w: 40,  h:  65, dur: 2.2,  delay: 1.8 },
  { left: '62%',  top: '22%', w: 40,  h:  65, dur: 3.8,  delay: 2.1 },
  { left: '50%',  top: '15%', w: 35,  h:  55, dur: 2.6,  delay: 0.9 },
];

export default function GardenImmersionBackground() {
  const { scrollY } = useScroll();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);

  // Scroll-driven parallax — deepest layer moves least, foreground moves most
  const deepY  = useTransform(scrollY, [0, 4000], [0, -280]);
  const goldY  = useTransform(scrollY, [0, 4000], [0, -140]);
  const vigY   = useTransform(scrollY, [0, 4000], [0,  -60]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);

    const onMouse = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth  - 0.5),
        y: (e.clientY / window.innerHeight - 0.5),
      });
    };

    if (!mq.matches) {
      window.addEventListener('mousemove', onMouse, { passive: true });
      return () => window.removeEventListener('mousemove', onMouse);
    }
  }, []);

  // Returns CSS transform for mouse parallax at a given depth multiplier
  const px = (depth) => reduced ? {} : {
    transform: `translate(${mouse.x * depth}px, ${mouse.y * depth * 0.6}px)`,
    transition: 'transform 1.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* ── ABSOLUTE BASE: near-black so nothing flashes white ── */}
      <div className="absolute inset-0" style={{ background: '#040704' }} />

      {/* ── LAYER 1 (DEEPEST): Real photo garden space — the room you stand inside ──
          Overscaled 20% so mouse parallax has room to move without revealing edges */}
      <motion.div
        className="absolute"
        style={{
          inset: '-10%',
          width: '120%',
          height: '120%',
          y: deepY,
        }}
      >
        <div style={{ width: '100%', height: '100%', ...px(-30) }}>
          <img
            src={DEEP_GARDEN}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              // darken + desaturate slightly so Sonia's photos pop in the foreground
              filter: 'brightness(0.48) contrast(1.12) saturate(0.78)',
              display: 'block',
            }}
          />
        </div>
      </motion.div>

      {/* ── LAYER 2: Gold horizon — atmospheric depth plane ──
          This is "image 6" — gives the sensation of infinite depth behind the trees */}
      <motion.div
        className="absolute inset-0"
        style={{ y: goldY, mixBlendMode: 'screen', opacity: 0.30 }}
      >
        <div style={{ width: '100%', height: '100%', ...px(-14) }}>
          <img
            src={GOLD_HORIZON}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 50%',
            }}
          />
        </div>
      </motion.div>

      {/* ── LAYER 3: Warm amber wash — unifies everything into one golden hour ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.22, 0.34, 0.22] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(130,72,18,0.28) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── LAYER 4: Gold shimmer video — living light through canopy leaves ── */}
      {!reduced && (
        <video
          autoPlay loop muted playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            mixBlendMode: 'screen',
            opacity: 0.16,
          }}
        >
          <source src={GOLD_SHIMMER} type="video/mp4" />
        </video>
      )}

      {/* ── LAYER 5: Gold light sweep — drifting sunbeams ── */}
      {!reduced && (
        <video
          autoPlay loop muted playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            mixBlendMode: 'screen',
            opacity: 0.10,
          }}
        >
          <source src={GOLD_SWEEP} type="video/mp4" />
        </video>
      )}

      {/* ── LAYER 6: Candle flicker glows — matches positions in the photo ── */}
      {CANDLES.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: c.left, top: c.top, width: c.w, height: c.h }}
          animate={{ opacity: [0.10, 0.28, 0.12, 0.30, 0.10] }}
          transition={{ duration: c.dur, repeat: Infinity, delay: c.delay, ease: 'easeInOut' }}
        >
          <div style={{
            width: '100%', height: '100%', borderRadius: '50%',
            background: 'radial-gradient(ellipse at 50% 80%, rgba(255,175,55,0.5) 0%, rgba(255,130,20,0.2) 40%, transparent 75%)',
          }} />
        </motion.div>
      ))}

      {/* ── LAYER 7: Floating gold motes / pollen ── */}
      {[...Array(22)].map((_, i) => (
        <motion.div
          key={`mote-${i}`}
          className="absolute rounded-full"
          style={{
            width:  `${0.8 + (i % 3) * 0.7}px`,
            height: `${0.8 + (i % 3) * 0.7}px`,
            background: `rgba(212,175,55,${0.12 + (i % 6) * 0.06})`,
            left: `${(i * 4.7 + 3) % 96}%`,
            top:  `${(i * 7.3 + 5) % 90}%`,
          }}
          animate={{
            y:       [0, -(25 + (i % 4) * 12), 0],
            x:       [(i % 2 === 0 ? -6 : 6), 0, (i % 2 === 0 ? 5 : -5)],
            opacity: [0.04, 0.38, 0.04],
          }}
          transition={{
            duration: 5 + (i % 5) * 1.8,
            repeat: Infinity,
            delay: i * 0.38,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ── LAYER 8: Depth vignettes — makes you feel enclosed inside the garden ──
          Dark edges all around create the sensation of standing inside, not looking at a screen */}
      {/* Left forest wall — darkest, feels like deep foliage to your left */}
      <motion.div className="absolute inset-y-0 left-0" style={{ width: '22%', y: vigY }}>
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(to right, rgba(2,8,2,0.82) 0%, rgba(4,12,4,0.40) 60%, transparent 100%)',
        }} />
      </motion.div>
      {/* Right forest wall */}
      <motion.div className="absolute inset-y-0 right-0" style={{ width: '22%', y: vigY }}>
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(to left, rgba(2,8,2,0.82) 0%, rgba(4,12,4,0.40) 60%, transparent 100%)',
        }} />
      </motion.div>
      {/* Ground underfoot — richest dark earth */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: '35%' }}>
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(to top, rgba(3,6,3,0.90) 0%, rgba(4,8,3,0.55) 40%, transparent 100%)',
        }} />
      </div>
      {/* Sky / canopy ceiling — lighter, hints at sky through leaves */}
      <div className="absolute top-0 left-0 right-0" style={{ height: '18%' }}>
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(to bottom, rgba(5,9,5,0.65) 0%, transparent 100%)',
        }} />
      </div>

      {/* ── LAYER 9: Subtle green mist — the living air of the garden ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.04, 0.10, 0.04] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse 70% 40% at 50% 100%, rgba(10,32,10,0.25) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}