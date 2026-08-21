import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ParallaxImageSection({
  leftImage,
  rightImage,
  leftAlt = 'Left image',
  rightAlt = 'Right image',
  children,
  mood = 'balanced', // 'emotional', 'warm', 'vulnerable', 'uplifting'
}) {
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const elementScrollPos = rect.top + window.scrollY;
        setScrollY(window.scrollY - (elementScrollPos - window.innerHeight / 2));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getMoodStyles = () => {
    switch (mood) {
      case 'emotional':
        return 'opacity-80 saturate-110';
      case 'warm':
        return 'opacity-85 saturate-95 brightness-110';
      case 'vulnerable':
        return 'opacity-75 saturate-80 contrast-110';
      case 'uplifting':
        return 'opacity-90 saturate-100 brightness-105';
      default:
        return 'opacity-80 saturate-100';
    }
  };

  return (
    <div ref={containerRef} className="relative py-16 md:py-24 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-center max-w-7xl mx-auto px-4">
        
        {/* Left Image - Emotional / Contemplative */}
        {leftImage && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            style={{ y: scrollY * 0.5 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={leftImage}
              alt={leftAlt}
              className={`w-full h-full object-cover ${getMoodStyles()}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40" />
          </motion.div>
        )}

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:w-80 lg:w-96 z-10"
        >
          {children}
        </motion.div>

        {/* Right Image - Warm / Expressive */}
        {rightImage && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ y: scrollY * -0.3 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={rightImage}
              alt={rightAlt}
              className={`w-full h-full object-cover ${getMoodStyles()}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/20" />
          </motion.div>
        )}
      </div>
    </div>
  );
}