import React from 'react';
import { motion } from 'framer-motion';

// One clean, continuously scrolling marquee bar with evergreen public facts.
const ITEMS = [
  'Independent, heart-first music from Gannon Waye',
  'Music approved for public sharing appears on the Music page',
  'The Store shows only current owner-approved stock',
  'New music is shared only when it is ready',
  'Join the community and follow the story',
];

const Separator = () => (
  <span className="mx-6 text-primary/70 text-[10px]" aria-hidden>◆</span>
);

export default function MarqueeBar() {
  const Row = ({ ariaHidden = false }) => (
    <div className="flex items-center shrink-0" aria-hidden={ariaHidden}>
      {ITEMS.map((item, i) => (
        <React.Fragment key={i}>
          <span className="font-body text-[11px] tracking-[0.22em] uppercase text-foreground/80 whitespace-nowrap">
            {item}
          </span>
          <Separator />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className="relative w-full overflow-hidden border-y border-primary/25"
      style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.10), rgba(245,208,110,0.05), rgba(212,175,55,0.10))' }}>
      <motion.div
        className="flex py-3"
        initial={{ x: 0 }}
        animate={{ x: '-50%' }}
        transition={{ duration: 34, ease: 'linear', repeat: Infinity }}>
        <Row />
        <Row ariaHidden />
      </motion.div>
      {/* Edge fades for a polished finish */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}