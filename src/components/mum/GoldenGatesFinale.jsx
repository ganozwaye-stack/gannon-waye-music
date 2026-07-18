import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function GoldenGatesFinale() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gate structure - pure CSS/SVG, no AI image dependency */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Distant light source - the beyond */}
        <motion.div
          className="absolute"
          style={{
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(216,192,113,0.18) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)',
          }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Left gate pillar */}
        <motion.div
          className="absolute"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{ left: 'calc(50% - 120px)', top: '15%', bottom: '20%' }}
        >
          {/* Pillar body */}
          <div style={{
            width: 16, height: '100%',
            background: 'linear-gradient(180deg, #c9a84c 0%, #d8c071 20%, #c9a84c 50%, #e8c55a 80%, #c9a84c 100%)',
            borderRadius: 4,
            boxShadow: '0 0 24px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.12)',
          }} />
          {/* Capital */}
          <div style={{
            position: 'absolute', top: -12, left: -12,
            width: 40, height: 24,
            background: 'linear-gradient(180deg, #d8c071, #c9a84c)',
            borderRadius: '4px 4px 0 0',
            boxShadow: '0 0 20px rgba(212,175,55,0.5)',
          }} />
        </motion.div>

        {/* Right gate pillar */}
        <motion.div
          className="absolute"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{ right: 'calc(50% - 120px)', top: '15%', bottom: '20%' }}
        >
          <div style={{
            width: 16, height: '100%',
            background: 'linear-gradient(180deg, #c9a84c 0%, #d8c071 20%, #c9a84c 50%, #e8c55a 80%, #c9a84c 100%)',
            borderRadius: 4,
            boxShadow: '0 0 24px rgba(212,175,55,0.4), 0 0 60px rgba(212,175,55,0.12)',
          }} />
          <div style={{
            position: 'absolute', top: -12, left: -12,
            width: 40, height: 24,
            background: 'linear-gradient(180deg, #d8c071, #c9a84c)',
            borderRadius: '4px 4px 0 0',
            boxShadow: '0 0 20px rgba(212,175,55,0.5)',
          }} />
        </motion.div>

        {/* Gate arch */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 'calc(15% - 40px)',
            left: 'calc(50% - 136px)',
            width: 272,
            height: 60,
            borderTop: '8px solid',
            borderLeft: '8px solid',
            borderRight: '8px solid',
            borderColor: '#c9a84c',
            borderRadius: '50% 50% 0 0',
            boxShadow: '0 0 30px rgba(212,175,55,0.35), inset 0 0 20px rgba(212,175,55,0.08)',
            background: 'transparent',
            transformOrigin: 'bottom',
          }}
        />

        {/* Gate bars - left panel */}
        {[0,1,2,3,4].map(i => (
          <motion.div
            key={`L${i}`}
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.2 + i * 0.08, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: `calc(50% - 112px + ${i * 16}px)`,
              top: '20%',
              bottom: '22%',
              width: 6,
              background: 'linear-gradient(180deg, #d8c071 0%, #c9a84c 50%, #d8c071 100%)',
              borderRadius: 3,
              boxShadow: '0 0 8px rgba(212,175,55,0.3)',
              transformOrigin: 'top',
            }}
          />
        ))}

        {/* Gate bars - right panel */}
        {[0,1,2,3,4].map(i => (
          <motion.div
            key={`R${i}`}
            initial={{ opacity: 0, scaleY: 0 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.2 + i * 0.08, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: `calc(50% + 28px + ${i * 16}px)`,
              top: '20%',
              bottom: '22%',
              width: 6,
              background: 'linear-gradient(180deg, #d8c071 0%, #c9a84c 50%, #d8c071 100%)',
              borderRadius: 3,
              boxShadow: '0 0 8px rgba(212,175,55,0.3)',
              transformOrigin: 'top',
            }}
          />
        ))}

        {/* Sonia - silhouette beyond the gates */}
        <motion.div
          className="absolute"
          style={{ bottom: '22%', left: '50%', transform: 'translateX(-50%)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, delay: 2 }}
        >
          <motion.div
            animate={{ opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="text-center"
          >
            <div style={{
              width: 48,
              height: 80,
              borderRadius: '50% 50% 0 0',
              background: 'radial-gradient(ellipse at 50% 30%, rgba(255,235,150,0.45) 0%, rgba(212,175,55,0.15) 60%, transparent 100%)',
              filter: 'blur(2px)',
              margin: '0 auto',
            }} />
          </motion.div>
        </motion.div>

        {/* Ground mist below gates */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          height: '25%',
          background: 'linear-gradient(to top, rgba(2,5,2,0.95) 0%, rgba(10,20,10,0.40) 60%, transparent 100%)',
        }} />

        {/* Floating gold particles */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              background: `rgba(212,175,55,${0.15 + (i % 5) * 0.08})`,
              left: `${30 + (i * 2.7) % 40}%`,
              top: `${20 + (i * 4.1) % 55}%`,
            }}
            animate={{
              y: [0, -30 - i * 4, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Text content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto" style={{ paddingTop: '10vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 2.5 }}
        >
          <p className="font-body text-[9px] tracking-[0.6em] uppercase mb-4" style={{ color: 'rgba(212,175,55,0.30)' }}>
            The Garden's End - A New Beginning
          </p>
          <h2
            className="font-display leading-none mb-6"
            style={{
              fontSize: 'clamp(2.5rem,8vw,5rem)',
              background: 'linear-gradient(145deg,#c9a84c 0%,#d8c071 38%,#d8c071 50%,#d8c071 62%,#c9a84c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(216,192,113,0.5))',
            }}
          >
            Until We Meet<br />Again, Mum
          </h2>
          <p className="font-display italic text-xl mb-8" style={{ color: 'rgba(245,235,200,0.35)' }}>
            "As long as you remember me,<br />my memory will live on."
          </p>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-px" style={{ background: 'linear-gradient(to right,transparent,rgba(212,175,55,0.3))' }} />
            <Heart className="w-4 h-4" fill="rgba(212,175,55,0.3)" style={{ color: 'rgba(212,175,55,0.35)' }} />
            <div className="w-10 h-px" style={{ background: 'linear-gradient(to left,transparent,rgba(212,175,55,0.3))' }} />
          </div>

          <p className="font-body text-xs tracking-[0.4em] uppercase" style={{ color: 'rgba(212,175,55,0.22)' }}>
            Sonia Katisa Waye - 1961 - 2022
          </p>
        </motion.div>
      </div>
    </div>
  );
}