import { motion } from 'framer-motion';

// Gently floats its children up and down — gives the site a "living world" feel.
export default function FloatingImage({ children, className = '', amplitude = 6, duration = 4, delay = 0 }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}