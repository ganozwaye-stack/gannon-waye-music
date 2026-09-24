import { useEffect } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import HeartFlames from './HeartFlames';
import OrbitRing3D from './OrbitRing3D';

// The official Set Free heart (never regenerated or edited, only masked for
// display) floating like a planet: real campfire footage and live flames burn
// around it, the orbit ring passes behind and in front, and it tilts in 3D.
// Web-sized copy (1000px, 175 KB) of the official 3500px artwork, same image
// scaled down only, so the hero heart appears straight away.
const HEART_ART = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/5008be4ec_SetFreeHeart_web1000.jpg';
const FIRE_VIDEO = 'https://media.base44.com/videos/public/69eb7905ca6eb4180010f794/8e23b3544_Ambient_Hero_Loop.mp4';

const HEART_MASK = 'radial-gradient(ellipse 52% 50% at 50% 47%, black 68%, transparent 100%), linear-gradient(to bottom, black 72%, transparent 80%)';

export default function HeartPlanet({ rotateX, rotateY }) {
  const progress = useMotionValue(0);
  useEffect(() => {
    const controls = animate(progress, Math.PI * 2, { duration: 16, repeat: Infinity, ease: 'linear' });
    return () => controls.stop();
  }, [progress]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className="relative aspect-square w-[min(84vw,50svh,560px)]"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -16, 0], rotate: [-1.2, 1.2, -1.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute -inset-[18%] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(255,120,40,0.32) 0%, rgba(200,40,20,0.16) 38%, rgba(0,0,0,0) 68%)' }} />
        <OrbitRing3D progress={progress} half="back" />
        <video
          src={FIRE_VIDEO} autoPlay loop muted playsInline aria-hidden
          className="absolute -inset-[12%] w-[124%] h-[124%] max-w-none object-cover pointer-events-none"
          style={{
            opacity: 0.7, mixBlendMode: 'screen',
            maskImage: 'radial-gradient(circle closest-side, transparent 38%, black 62%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle closest-side, transparent 38%, black 62%, transparent 100%)',
          }}
        />
        <div className="absolute -inset-[25%]"><HeartFlames /></div>
        <motion.img
          src={HEART_ART}
          alt="Set Free by Gannon Waye, a cracked gold heart on fire in space"
          draggable="false"
          fetchpriority="high"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover select-none"
          style={{
            mixBlendMode: 'screen',
            maskImage: HEART_MASK, WebkitMaskImage: HEART_MASK,
            maskComposite: 'intersect', WebkitMaskComposite: 'source-in',
          }}
          animate={{ filter: ['brightness(1) saturate(1.05)', 'brightness(1.14) saturate(1.2)', 'brightness(0.98) saturate(1.05)', 'brightness(1.1) saturate(1.15)', 'brightness(1) saturate(1.05)'] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute -inset-[25%]"><HeartFlames rate={70} alpha={0.4} /></div>
        <OrbitRing3D progress={progress} half="front" />
      </motion.div>
    </motion.div>
  );
}