import React from 'react';
import { motion } from 'framer-motion';

// The site-wide release ticker, permanently fixed to the bottom of the screen
// on desktop. Mobile keeps its bottom tab bar instead of this strip.
const ITEMS = [
  'Set Free, out 25 September 2026',
  'Join the community and follow the story',
  'Independent, heart-first music from Gannon Waye',
];

const Separator = () => (
  <span className="mx-6 text-[10px] shrink-0" style={{ color: '#d4af37' }} aria-hidden>◆</span>
);

export default function MarqueeBar() {
  const Row = ({ ariaHidden = false }) => (
    <div className="flex items-center shrink-0" aria-hidden={ariaHidden}>
      {ITEMS.map((item, i) => (
        <React.Fragment key={i}>
          <span
            className="font-body text-[11px] tracking-[0.22em] uppercase whitespace-nowrap"
            style={{ color: '#e0e0e0' }}>
            {item}
          </span>
          <Separator />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 hidden md:block overflow-hidden"
      style={{
        background: 'rgba(26, 26, 21, 0.8)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderTop: '1px solid rgba(92, 80, 48, 0.9)',
        borderBottom: '1px solid rgba(92, 80, 48, 0.9)',
      }}>
      <motion.div
        className="flex py-2.5"
        initial={{ x: 0 }}
        animate={{ x: '-50%' }}
        transition={{ duration: 34, ease: 'linear', repeat: Infinity }}>
        <Row />
        <Row ariaHidden />
      </motion.div>
    </div>
  );
}