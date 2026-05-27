import TourTracker from '@/components/public/TourTracker';
import BePartOfThisCTA from '@/components/public/BePartOfThisCTA';
import { motion } from 'framer-motion';

export default function Tour() {
  return (
    <div className="min-h-screen py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4 px-4"
      >
        <p className="font-body text-xs tracking-[0.3em] uppercase gradient-gold-glow mb-2">Gannon Waye</p>
        <h1 className="font-display text-5xl md:text-6xl text-foreground">Live</h1>
      </motion.div>
      <TourTracker />
      <div className="max-w-4xl mx-auto px-4">
        <BePartOfThisCTA context="Want to see Gannon live? Support the project and help make more shows happen." />
      </div>
    </div>
  );
}