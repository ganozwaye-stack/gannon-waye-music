import { motion, useTransform } from 'framer-motion';

// One half of the tilted gold orbit ring. Rendered twice around the heart:
// the back half sits behind the planet and the front half passes in front,
// so the sparks genuinely travel behind and around it in 3D.
export default function OrbitRing3D({ progress, half }) {
  const mainLeft = useTransform(progress, (t) => `${50 + 50 * Math.cos(t)}%`);
  const mainTop = useTransform(progress, (t) => `${50 - 50 * Math.sin(t)}%`);
  const mainScale = useTransform(progress, (t) => 1 - 0.4 * Math.sin(t));
  const compLeft = useTransform(progress, (t) => `${50 + 50 * Math.cos(t + 2.6)}%`);
  const compTop = useTransform(progress, (t) => `${50 - 50 * Math.sin(t + 2.6)}%`);
  const compScale = useTransform(progress, (t) => 1 - 0.4 * Math.sin(t + 2.6));

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: '-26%', top: '29%', width: '152%', aspectRatio: '3.6',
        transform: 'rotate(-14deg)',
        clipPath: half === 'back' ? 'inset(-20% -5% 50% -5%)' : 'inset(50% -5% -20% -5%)',
      }}
    >
      <div className="absolute -inset-[3%] rounded-[50%]" style={{ border: '7px solid rgba(212,175,55,0.10)', filter: 'blur(3px)' }} />
      <div
        className="absolute inset-0 rounded-[50%]"
        style={{ border: '1.5px solid rgba(240,210,130,0.65)', boxShadow: '0 0 18px rgba(212,175,55,0.35), inset 0 0 18px rgba(212,175,55,0.12)' }}
      />
      <motion.span
        className="absolute rounded-full"
        style={{ left: mainLeft, top: mainTop, scale: mainScale, x: '-50%', y: '-50%', width: 10, height: 10, background: '#fff4d6', boxShadow: '0 0 14px rgba(255,220,140,1), 0 0 34px rgba(212,175,55,0.7)' }}
      />
      <motion.span
        className="absolute rounded-full"
        style={{ left: compLeft, top: compTop, scale: compScale, x: '-50%', y: '-50%', width: 6, height: 6, background: '#d4af37', boxShadow: '0 0 12px rgba(212,175,55,0.9)' }}
      />
    </div>
  );
}