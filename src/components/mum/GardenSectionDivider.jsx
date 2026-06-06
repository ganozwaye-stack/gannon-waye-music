import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function GardenSectionDivider({ light = false }) {
  return (
    <div className="flex items-center gap-4 my-1 px-6 max-w-2xl mx-auto">
      <motion.div
        className="flex-1 h-px"
        style={{
          background: light
            ? 'linear-gradient(to right, transparent, rgba(212,175,55,0.30))'
            : 'linear-gradient(to right, transparent, rgba(212,175,55,0.12))',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      />
      <Heart
        className="w-2.5 h-2.5 flex-shrink-0"
        style={{ color: light ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.22)' }}
        fill={light ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.10)'}
      />
      <motion.div
        className="flex-1 h-px"
        style={{
          background: light
            ? 'linear-gradient(to left, transparent, rgba(212,175,55,0.30))'
            : 'linear-gradient(to left, transparent, rgba(212,175,55,0.12))',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      />
    </div>
  );
}