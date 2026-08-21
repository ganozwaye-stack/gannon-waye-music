import { motion } from 'framer-motion';

// Floating leaf SVG
function Leaf({ x, y, delay, duration, size = 32, flip = false }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, transform: flip ? 'scaleX(-1)' : 'none' }}
      animate={{ y: [-6, 10, -6], rotate: [-4, 4, -4], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 40 60" width={size} height={size * 1.5} fill="none">
        <path d="M20 2 C 8 12 2 30 20 58 C 38 30 32 12 20 2 Z" fill="rgba(28,68,28,0.55)" />
        <path d="M20 4 C 18 16 16 32 20 56" stroke="rgba(50,100,50,0.3)" strokeWidth="0.8" />
      </svg>
    </motion.div>
  );
}

// Wide palm frond
function PalmFrond({ x, y, delay, flip = false }) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, transform: flip ? 'scaleX(-1)' : 'none', transformOrigin: 'bottom center' }}
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ duration: 7, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 120 80" width="120" height="80" fill="none">
        <path d="M60 75 C 40 55 10 35 2 10 C 20 18 38 40 60 75 Z" fill="rgba(20,56,20,0.45)" />
        <path d="M60 75 C 55 50 45 25 30 5 C 42 18 54 42 60 75 Z" fill="rgba(24,64,24,0.35)" />
        <path d="M60 75 C 70 50 80 25 95 5 C 80 18 68 42 60 75 Z" fill="rgba(24,64,24,0.35)" />
        <path d="M60 75 C 80 55 110 35 118 10 C 100 18 82 40 60 75 Z" fill="rgba(20,56,20,0.45)" />
      </svg>
    </motion.div>
  );
}

// Butterfly
function Butterfly({ x, y, delay }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      animate={{ x: [-18, 18, -18], y: [-8, 8, -8], opacity: [0, 0.35, 0] }}
      transition={{ duration: 9, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 50 35" width="24" height="17" fill="none">
        <path d="M25 17 C 10 5 2 15 8 24 C 14 30 22 22 25 17 Z" fill="rgba(212,175,55,0.45)" />
        <path d="M25 17 C 40 5 48 15 42 24 C 36 30 28 22 25 17 Z" fill="rgba(212,175,55,0.45)" />
        <line x1="25" y1="10" x2="25" y2="28" stroke="rgba(180,140,40,0.5)" strokeWidth="1.2" />
      </svg>
    </motion.div>
  );
}

export default function LivingGardenBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">

      {/* Deep garden base gradient */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(160deg, #06090506 0%, #0d1108 30%, #09090708 55%, #080606 100%)'
      }} />

      {/* Gold warm glow — top centre */}
      <motion.div
        className="absolute"
        style={{ top: '-10%', left: '20%', right: '20%', height: '55%', borderRadius: '50%',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(180,110,30,0.14) 0%, transparent 65%)'
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Burgundy warmth — bottom left */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 10% 80%, rgba(90,18,32,0.12) 0%, transparent 45%)'
      }} />

      {/* Deep green glow — right */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 92% 40%, rgba(15,45,20,0.18) 0%, transparent 40%)'
      }} />

      {/* Drifting gold particles */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${1.5 + (i % 3)}px`,
            height: `${1.5 + (i % 3)}px`,
            background: `rgba(212,175,55,${0.08 + (i % 5) * 0.05})`,
            left: `${4 + (i * 6.1) % 92}%`,
            top: `${8 + (i * 8.3) % 84}%`,
          }}
          animate={{ y: [-8, -26, -8], opacity: [0.04, 0.32, 0.04] }}
          transition={{ duration: 4.5 + (i % 4), repeat: Infinity, delay: i * 0.42, ease: 'easeInOut' }}
        />
      ))}

      {/* Large blurred background leaves — corners, very subtle */}
      <div className="absolute -left-8 top-0 opacity-25" style={{ filter: 'blur(4px)' }}>
        <PalmFrond x={0} y={0} delay={0} />
      </div>
      <div className="absolute -right-8 top-0 opacity-25" style={{ filter: 'blur(4px)' }}>
        <PalmFrond x={0} y={0} delay={1.5} flip />
      </div>

      {/* Mid-level foreground leaves */}
      <Leaf x="1%" y="22%" delay={0} duration={5.5} size={28} />
      <Leaf x="3%" y="55%" delay={1.8} duration={6.5} size={22} />
      <Leaf x="94%" y="18%" delay={0.6} duration={5} size={28} flip />
      <Leaf x="91%" y="60%" delay={2.2} duration={7} size={24} flip />
      <Leaf x="12%" y="88%" delay={1.1} duration={6} size={20} />
      <Leaf x="80%" y="82%" delay={0.4} duration={5.8} size={20} flip />
      <Leaf x="45%" y="4%" delay={2.8} duration={7.5} size={18} />

      {/* Butterflies — sparse and gentle */}
      <Butterfly x="18%" y="28%" delay={3} />
      <Butterfly x="72%" y="45%" delay={7} />
      <Butterfly x="38%" y="72%" delay={11} />

      {/* Foreground blur layer — bottom edge greenery */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(8,18,8,0.45) 0%, transparent 100%)'
      }} />
    </div>
  );
}