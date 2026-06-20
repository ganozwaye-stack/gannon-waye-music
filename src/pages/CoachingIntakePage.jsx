import CoachingIntakeForm from '@/components/coaching/CoachingIntakeForm';
import CoachingSignatureLine from '@/components/coaching/CoachingSignatureLine';
import { motion } from 'framer-motion';

export default function CoachingIntakePage() {
  return (
    <div className="min-h-screen">
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block border border-primary/30 text-primary font-body text-[9px] tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-6">
            Start Here
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-5xl text-foreground italic leading-tight mb-4"
          >
            Book a Clarity Session
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-base text-foreground/70 leading-relaxed"
          >
            Fill in this short intake form. Gannon will review it personally and reach out within 2 business days to confirm your session.
          </motion.p>
        </div>
      </section>

      <section className="py-4 px-4 pb-16">
        <CoachingIntakeForm offerInterest="Clarity Session" />
      </section>

      <section className="py-12 px-4">
        <CoachingSignatureLine line="Self respect is not revenge. It is coming home to yourself." size="sm" />
      </section>
    </div>
  );
}