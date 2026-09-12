import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

// The tilted gold orbit ring with travelling sparks, driven entirely by Hero
// Design Studio values. All percentages are relative to the parent heart
// plate, exactly as defined in the HeroDesignSettings entity, so what the
// owner locks in the studio is what renders on the site.
export default function HeroOrbitRing({ ring }) {
  const {
    ring_top_pct = 12,
    ring_left_pct = -22,
    ring_width_pct = 144,
    ring_aspect = 3.4,
    ring_rotation_deg = -14,
    spark_main_size = 8,
    spark_companion_size = 6,
    orbit_duration = 18,
  } = ring || {};

  // One lap around the ellipse, parametric so the sparks follow the ring
  // edge itself rather than drifting inside it.
  const progress = useMotionValue(0);
  useEffect(() => {
    const duration = Math.max(Number(orbit_duration) || 18, 3);
    const controls = animate(progress, Math.PI * 2, {
      duration,
      repeat: Infinity,
      ease: 'linear',
    });
    return () => controls.stop();
  }, [orbit_duration, progress]);

  const mainLeft = useTransform(progress, (t) => `${50 + 50 * Math.cos(t)}%`);
  const mainTop = useTransform(progress, (t) => `${50 - 50 * Math.sin(t)}%`);
  const companionLeft = useTransform(progress, (t) => `${50 + 50 * Math.cos(t + Math.PI)}%`);
  const companionTop = useTransform(progress, (t) => `${50 - 50 * Math.sin(t + Math.PI)}%`);

  const boxStyle = {
    left: `${ring_left_pct}%`,
    top: `${ring_top_pct}%`,
    width: `${ring_width_pct}%`,
    aspectRatio: String(ring_aspect),
    transform: `rotate(${ring_rotation_deg}deg)`,
  };

  return (
    <>
      <div
        className="absolute rounded-[50%] pointer-events-none"
        style={{
          ...boxStyle,
          border: '1px solid rgba(212,175,55,0.45)',
          boxShadow: '0 0 16px rgba(212,175,55,0.20), inset 0 0 16px rgba(212,175,55,0.08)',
        }}
      />
      <div className="absolute pointer-events-none" style={boxStyle}>
        {spark_main_size > 0 && (
          <motion.span
            className="absolute rounded-full"
            style={{
              left: mainLeft,
              top: mainTop,
              width: spark_main_size,
              height: spark_main_size,
              x: '-50%',
              y: '-50%',
              background: '#f0e6c8',
              boxShadow: '0 0 12px rgba(212,175,55,0.95), 0 0 26px rgba(212,175,55,0.5)',
            }}
          />
        )}
        {spark_companion_size > 0 && (
          <motion.span
            className="absolute rounded-full"
            style={{
              left: companionLeft,
              top: companionTop,
              width: spark_companion_size,
              height: spark_companion_size,
              x: '-50%',
              y: '-50%',
              background: '#d4af37',
              boxShadow: '0 0 10px rgba(212,175,55,0.85)',
            }}
          />
        )}
      </div>
    </>
  );
}