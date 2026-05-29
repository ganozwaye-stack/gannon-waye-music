import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function MumStorySection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="who-she-was" className="relative px-4 md:px-8 max-w-3xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-body text-[10px] tracking-[0.5em] uppercase gradient-gold-glow mb-3">Who She Was</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card/25 backdrop-blur-sm border border-primary/10 rounded-3xl p-8 md:p-12"
        style={{ boxShadow: '0 0 60px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(212,175,55,0.05)' }}
      >
        <div className="font-body text-foreground/72 leading-relaxed text-base space-y-5">
          <motion.p initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            My mum was love, strength, wisdom, protection, humour, reflection, and home.
          </motion.p>
          <motion.p initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            She helped me think, process, create, survive, and understand the world when the world felt too heavy to understand on my own.
          </motion.p>
          <motion.p initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            After a life marked by neglect, abandonment, abuse, mistreatment, rejection, and survival, my mum became the one place where love did not feel conditional.
          </motion.p>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden space-y-5"
              >
                <p>She was human. She made mistakes, like we all do. But what I admired most was her heart, her growth, her forgiveness, and her ability to rise above pain that was never hers to carry.</p>
                <p>She loved hard. She forgave deeply. She protected fiercely. And she gave so much of herself to people who needed her.</p>
                <p>So many people still tell me how much they miss her. Some even say she felt like their mum too. As her son, that is one of the greatest honours of my life.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pull quote */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="border-l-2 border-primary/40 pl-5 my-8"
        >
          <p className="font-display text-xl md:text-2xl italic text-foreground/82">
            "She never placed conditions on her ability to love me."
          </p>
        </motion.div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 font-body text-xs tracking-wider uppercase text-primary/55 hover:text-primary transition-colors"
        >
          {expanded ? 'Read less' : 'Read more'}
          <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </motion.div>
    </section>
  );
}