import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// 3D hover-tilt wrapper — perspective on the outer, rotate toward the cursor on the inner,
// with a soft gold glare that follows the pointer.
export default function TiltCard({ children, className = '', max = 8, glare = true }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const x = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });

  const rotateX = useTransform(y, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-max, max]);
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);
  const glareBg = useTransform([glareX, glareY], ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,224,138,0.5), transparent 45%)`);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      className={`[perspective:1000px] ${className}`}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative">
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
            style={{ opacity: hovered ? 0.2 : 0, background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}