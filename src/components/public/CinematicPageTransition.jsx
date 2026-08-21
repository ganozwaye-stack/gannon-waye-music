import { motion } from 'framer-motion';

export default function CinematicPageTransition() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 pointer-events-none z-50"
    >
      <motion.div
        animate={{ scaleX: [1, 0] }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="absolute inset-y-0 left-0 w-full origin-left bg-background"
        style={{ transformOrigin: 'left center' }}
      />
    </motion.div>
  );
}