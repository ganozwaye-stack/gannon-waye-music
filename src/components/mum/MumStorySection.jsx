import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MumStorySection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="who-she-was" className="px-4 md:px-8 max-w-3xl mx-auto py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="gsap-reveal"
      >
        <p className="font-body text-[9px] tracking-[0.6em] uppercase text-primary/40 mb-3">Who She Was</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mb-8">Who She Was</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="space-y-5 font-body text-base text-foreground/65 leading-relaxed gsap-reveal"
      >
        <p>
          My mum was love, strength, wisdom, protection, humour, reflection, and home.
        </p>
        <p>
          She helped me think, process, create, survive, and understand the world when the world felt too heavy to understand on my own.
        </p>
        <p>
          After a life marked by neglect, abandonment, abuse, mistreatment, rejection, and survival, my mum became the one place where love did not feel conditional.
        </p>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-5 font-body text-base text-foreground/65 leading-relaxed mt-5">
              <p>
                She was human. She made mistakes, like we all do. But what I admired most was her heart, her growth, her forgiveness, and her ability to rise above pain that was never hers to carry.
              </p>
              <p>
                She loved hard. She forgave deeply. She protected fiercely. And she gave so much of herself to people who needed her.
              </p>
              <p>
                So many people still tell me how much they miss her. Some even say she felt like their mum too. As her son, that is one of the greatest honours of my life.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pull quote */}
      <motion.blockquote
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="border-l-2 border-primary/30 pl-6 my-10"
      >
        <p className="font-display text-2xl md:text-3xl italic text-foreground/75 leading-relaxed">
          "She never placed conditions on her ability to love me."
        </p>
      </motion.blockquote>

      <button
        onClick={() => setExpanded(!expanded)}
        className="font-body text-xs tracking-widest uppercase text-primary/50 hover:text-primary transition-colors border border-primary/20 rounded-full px-6 py-2.5"
      >
        {expanded ? 'Read less' : 'Read more about her'}
      </button>
    </section>
  );
}