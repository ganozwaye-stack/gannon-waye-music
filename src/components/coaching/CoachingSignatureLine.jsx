import { motion } from 'framer-motion';

const LINES = [
  'Respect is earned. Not a game you make me play.',
  'Still here.',
  'You are not too broken to rebuild.',
  'The chapter hurt. But it did not get the final say.',
  'Self respect is not revenge. It is coming home to yourself.',
  'Your story is not shame. It is evidence that you survived.',
  'Thank you for teaching me who I am not anymore.',
];

export default function CoachingSignatureLine({ line, center = true, size = 'md' }) {
  const text = line || LINES[0];
  const sizeClass = size === 'lg'
    ? 'text-2xl md:text-3xl'
    : size === 'sm'
    ? 'text-base'
    : 'text-xl md:text-2xl';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={center ? 'text-center' : 'text-left'}
    >
      <div className="inline-flex flex-col items-center gap-2">
        <div className="w-6 h-px bg-primary/40" />
        <p className={`font-display ${sizeClass} gradient-gold-glow italic leading-snug`}>
          "{text}"
        </p>
        <p className="font-body text-[9px] tracking-[0.3em] uppercase text-muted-foreground/50">Gannon Waye</p>
      </div>
    </motion.div>
  );
}